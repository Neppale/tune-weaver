import { Injectable } from '@nestjs/common';
import { CreatePlaylistRepository } from '../repositories/create-playlist.repository';
import { CreatePlaylistDto } from '../dtos/create-playlist.dto';
import { Playlist, Platform } from '@prisma/client';
import { CreateTracksService } from '../../tracks/services/create-tracks.service';
import { CreateTrackDto as TrackCreateTrackDto } from '../../tracks/dtos/create-track.dto';
import { GetSpotifyTrackDataByTrackIdService } from '../../tracks/services/get-spotify-track-data-by-track-id.service';
import { LoadTrackPlatformByPlatformIdRepository } from '../../tracks/repositories/load-track-platform-by-platform-id.repository';
import { FindTracksByMetadataRepository } from '../../tracks/repositories/find-tracks-by-metadata.repository';

interface TrackMatch {
  trackId: string;
  platform: Platform;
  platformId: string;
}

@Injectable()
export class CreatePlaylistService {
  constructor(
    private readonly createPlaylistRepository: CreatePlaylistRepository,
    private readonly createTracksService: CreateTracksService,
    private readonly getSpotifyTrackDataByTrackIdService: GetSpotifyTrackDataByTrackIdService,
    private readonly loadTrackPlatformByPlatformIdRepository: LoadTrackPlatformByPlatformIdRepository,
    private readonly findTracksByMetadataRepository: FindTracksByMetadataRepository,
  ) {}

  async create(data: CreatePlaylistDto): Promise<Playlist> {
    if (!data.tracks?.length) {
      return this.createPlaylistRepository.create(data);
    }

    // Step 1: Check for existing tracks by platform ID
    const existingTracks: TrackMatch[] = [];
    const tracksToProcess: CreatePlaylistDto['tracks'] = [];

    for (const track of data.tracks) {
      const existingPlatformTracks =
        await this.loadTrackPlatformByPlatformIdRepository.load(
          track.platform,
          [track.platformId],
        );

      if (existingPlatformTracks.length > 0) {
        existingTracks.push({
          trackId: existingPlatformTracks[0].track.id,
          platform: track.platform,
          platformId: track.platformId,
        });
      } else {
        tracksToProcess.push(track);
      }
    }

    // Step 2: Get data for remaining tracks and check for metadata matches
    if (tracksToProcess.length > 0) {
      const trackDataPromises = tracksToProcess.map(async (track) => {
        const trackData = await this.getSpotifyTrackDataByTrackIdService.get([
          track.platformId,
        ]);
        return {
          platform: track.platform,
          platformId: track.platformId,
          name: trackData[0].name,
          artist: trackData[0].artists[0].name,
          album: trackData[0].album?.name,
          duration: trackData[0].duration_ms / 1000,
        } as TrackCreateTrackDto;
      });

      const tracksWithData = await Promise.all(trackDataPromises);

      // Check for metadata matches
      for (const track of tracksWithData) {
        const similarTracks =
          await this.findTracksByMetadataRepository.findSimilarTracks(track);

        if (similarTracks.length > 0) {
          // Use the first matching track
          const matchedTrack = similarTracks[0];
          existingTracks.push({
            trackId: matchedTrack.id,
            platform: track.platform,
            platformId: track.platformId,
          });
        } else {
          // Create new track
          const { newTracks } = await this.createTracksService.create([track]);
          existingTracks.push({
            trackId: newTracks[0].id,
            platform: track.platform,
            platformId: track.platformId,
          });
        }
      }
    }

    // Step 3: Create playlist with all matched/created tracks
    return this.createPlaylistRepository.create({
      ...data,
      existingTrackIds: existingTracks.map((track) => track.trackId),
    });
  }
}
