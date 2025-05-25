import { Injectable } from '@nestjs/common';
import { CreatePlaylistRepository } from '../repositories/create-playlist.repository';
import { CreatePlaylistDto } from '../dtos/create-playlist.dto';
import { Playlist, Platform } from '@prisma/client';
import { CreateTracksService } from '@Tracks/services/create-tracks.service';
import { CreateTrackParams } from '@Tracks/dtos/create-track.params';
import { LoadTrackPlatformByPlatformIdRepository } from '@Tracks/repositories/load-track-platform-by-platform-id.repository';
import { FindTrackByMetadataRepository } from '@Tracks/repositories/find-tracks-by-metadata.repository';
import { GetTrackDataByPlatformService } from '@Tracks/services/get-track-data-by-platform.service';
import { CreateTrackPlatformRepository } from '@Tracks/repositories/create-track-platform.repository';
import { CreateTrackDto } from '@Playlists/dtos/playlist.dto';

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

    const existingTracks = await this.processExistingTracks(data.tracks);
    const tracksToProcess = await this.getTracksToProcess(
      data.tracks,
      existingTracks,
    );

    if (tracksToProcess.length) {
      const processedTracks = await this.processNewTracks(tracksToProcess);
      existingTracks.push(...processedTracks);
    }

    return this.createPlaylistRepository.create({
      ...data,
      existingTrackIds: existingTracks.map((track) => track.trackId),
    });
  }

  private async processExistingTracks(
    tracks: CreateTrackDto[],
  ): Promise<TrackMatch[]> {
    const existingTracks: TrackMatch[] = [];
    const tracksByPlatform = this.groupTracksByPlatform(tracks);

    const platformPromises = Object.entries(tracksByPlatform).map(
      async ([platform, platformTracks]) => {
        const platformIds = platformTracks.map((track) => track.platformId);
        const existingPlatformTracks =
          await this.loadTrackPlatformByPlatformIdRepository.load(
            platform as Platform,
            platformIds,
          );

        this.addExistingTracks(
          existingTracks,
          platformTracks,
          existingPlatformTracks,
        );
      },
    );

    await Promise.all(platformPromises);
    return existingTracks;
  }

  private groupTracksByPlatform(
    tracks: CreatePlaylistDto['tracks'],
  ): Record<Platform, CreatePlaylistDto['tracks']> {
    return tracks.reduce(
      (acc, track) => {
        if (!acc[track.platform]) {
          acc[track.platform] = [];
        }
        acc[track.platform].push(track);
        return acc;
      },
      {} as Record<Platform, CreatePlaylistDto['tracks']>,
    );
  }

  private addExistingTracks(
    existingTracks: TrackMatch[],
    platformTracks: CreatePlaylistDto['tracks'],
    existingPlatformTracks: any[],
  ): void {
    existingPlatformTracks.forEach((platformTrack) => {
      const originalTrack = platformTracks.find(
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
  }

  private async getTracksToProcess(
    allTracks: CreatePlaylistDto['tracks'],
    existingTracks: TrackMatch[],
  ): Promise<CreatePlaylistDto['tracks']> {
    const existingIds = new Set(existingTracks.map((t) => t.platformId));
    return allTracks.filter((track) => !existingIds.has(track.platformId));
  }

  private async processNewTracks(
    tracksToProcess: CreatePlaylistDto['tracks'],
  ): Promise<TrackMatch[]> {
    const tracksWithData = await this.getTracksData(tracksToProcess);
    return this.processTracksWithData(tracksWithData);
  }

  private async getTracksData(
    tracks: CreatePlaylistDto['tracks'],
  ): Promise<CreateTrackParams[]> {
    const trackDataPromises = tracks.map(async (track) => {
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
      } as CreateTrackParams;
    });

    return Promise.all(trackDataPromises);
  }

  private async processTracksWithData(
    tracks: CreateTrackParams[],
  ): Promise<TrackMatch[]> {
    const trackProcessingPromises = tracks.map(async (track) => {
      const similarTrack = await this.findTrackByMetadataRepository.find(track);

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
      }

      const { newTracks } = await this.createTracksService.create([track]);
      return {
        trackId: newTracks[0].id,
        platform: track.platform,
        platformId: track.platformId,
      };
    });

    return Promise.all(trackProcessingPromises);
  }
}
