import { Injectable } from '@nestjs/common';
import { CreatePlaylistRepository } from '../repositories/create-playlist.repository';
import { CreatePlaylistDto } from '../dtos/create-playlist.dto';
import { Playlist, Platform } from '@prisma/client';
import { CreateTracksService } from '../../tracks/services/create-tracks.service';
import { CreateTrackDto as TrackCreateTrackDto } from '../../tracks/dtos/create-track.dto';
import { LoadTrackPlatformByPlatformIdRepository } from '../../tracks/repositories/load-track-platform-by-platform-id.repository';
import { FindTracksByMetadataRepository } from '../../tracks/repositories/find-tracks-by-metadata.repository';
import { GetTrackDataByPlatformService } from '../../tracks/services/get-track-data-by-platform.service';

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
    private readonly getTrackDataByPlatformService: GetTrackDataByPlatformService,
    private readonly loadTrackPlatformByPlatformIdRepository: LoadTrackPlatformByPlatformIdRepository,
    private readonly findTracksByMetadataRepository: FindTracksByMetadataRepository,
  ) {}

  async create(data: CreatePlaylistDto): Promise<Playlist> {
    if (!data.tracks?.length) {
      return this.createPlaylistRepository.create(data);
    }

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

    if (tracksToProcess.length > 0) {
      const trackDataPromises = tracksToProcess.map(async (track) => {
        const trackData = await this.getTrackDataByPlatformService.get(
          track.platform,
          [track.platformId],
        );
        return {
          platform: track.platform,
          platformId: track.platformId,
          name: trackData[0].name,
          artist: trackData[0].artists[0].name,
          album: trackData[0].album?.name,
          duration: trackData[0].duration,
        } as TrackCreateTrackDto;
      });

      const tracksWithData = await Promise.all(trackDataPromises);

      for (const track of tracksWithData) {
        const similarTracks =
          await this.findTracksByMetadataRepository.findSimilarTracks(track);

        if (similarTracks.length > 0) {
          const matchedTrack = similarTracks[0];
          existingTracks.push({
            trackId: matchedTrack.id,
            platform: track.platform,
            platformId: track.platformId,
          });
        } else {
          const { newTracks } = await this.createTracksService.create([track]);
          existingTracks.push({
            trackId: newTracks[0].id,
            platform: track.platform,
            platformId: track.platformId,
          });
        }
      }
    }

    return this.createPlaylistRepository.create({
      ...data,
      existingTrackIds: existingTracks.map((track) => track.trackId),
    });
  }
}
