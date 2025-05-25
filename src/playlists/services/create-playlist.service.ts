import { Injectable } from '@nestjs/common';
import { CreatePlaylistRepository } from '../repositories/create-playlist.repository';
import { CreatePlaylistDto } from '../dtos/create-playlist.dto';
import { Playlist, Platform } from '@prisma/client';
import { CreateTracksService } from '@Tracks/services/create-tracks.service';
import { CreateTrackDto as TrackCreateTrackDto } from '@Tracks/dtos/create-track.dto';
import { LoadTrackPlatformByPlatformIdRepository } from '@Tracks/repositories/load-track-platform-by-platform-id.repository';
import { FindTrackByMetadataRepository } from '@Tracks/repositories/find-tracks-by-metadata.repository';
import { GetTrackDataByPlatformService } from '@Tracks/services/get-track-data-by-platform.service';
import { CreateTrackPlatformRepository } from '@Tracks/repositories/create-track-platform.repository';

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
    private readonly findTrackByMetadataRepository: FindTrackByMetadataRepository,
    private readonly createTrackPlatformRepository: CreateTrackPlatformRepository,
  ) {}

  async create(data: CreatePlaylistDto): Promise<Playlist> {
    if (!data.tracks?.length) {
      return this.createPlaylistRepository.create(data);
    }

    const existingTracks: TrackMatch[] = [];
    const tracksToProcess: CreatePlaylistDto['tracks'] = [];

    const tracksByPlatform = data.tracks.reduce(
      (acc, track) => {
        if (!acc[track.platform]) {
          acc[track.platform] = [];
        }
        acc[track.platform].push(track);
        return acc;
      },
      {} as Record<Platform, CreatePlaylistDto['tracks']>,
    );

    const platformPromises = Object.entries(tracksByPlatform).map(
      async ([platform, tracks]) => {
        const platformIds = tracks.map((track) => track.platformId);
        const existingPlatformTracks =
          await this.loadTrackPlatformByPlatformIdRepository.load(
            platform as Platform,
            platformIds,
          );

        existingPlatformTracks.forEach((platformTrack) => {
          const originalTrack = tracks.find(
            (t) => t.platformId === platformTrack.platformId,
          );
          if (originalTrack) {
            existingTracks.push({
              trackId: platformTrack.track.id,
              platform: originalTrack.platform,
              platformId: originalTrack.platformId,
            });
          }
        });

        const existingIds = new Set(
          existingPlatformTracks.map((t) => t.platformId),
        );
        tracksToProcess.push(
          ...tracks.filter((track) => !existingIds.has(track.platformId)),
        );
      },
    );

    await Promise.all(platformPromises);

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

      const trackProcessingPromises = tracksWithData.map(async (track) => {
        const similarTrack =
          await this.findTrackByMetadataRepository.find(track);

        if (similarTrack) {
          await this.createTrackPlatformRepository.create({
            trackId: similarTrack.id,
            platform: track.platform,
            platformId: track.platformId,
          });

          return {
            trackId: similarTrack.id,
            platform: track.platform,
            platformId: track.platformId,
          };
        } else {
          const { newTracks } = await this.createTracksService.create([track]);
          return {
            trackId: newTracks[0].id,
            platform: track.platform,
            platformId: track.platformId,
          };
        }
      });

      const processedTracks = await Promise.all(trackProcessingPromises);
      existingTracks.push(...processedTracks);
    }

    return this.createPlaylistRepository.create({
      ...data,
      existingTrackIds: existingTracks.map((track) => track.trackId),
    });
  }
}
