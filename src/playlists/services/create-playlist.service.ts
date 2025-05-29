import { Injectable } from '@nestjs/common';
import { CreatePlaylistRepository } from '../repositories/create-playlist.repository';
import { CreatePlaylistDto } from '../dtos/create-playlist.dto';
import { Playlist, Platform } from '@prisma/client';
import { CreateTracksService } from '@Tracks/services/create-tracks.service';
import { LoadTrackPlatformByPlatformIdRepository } from '@Tracks/repositories/load-track-platform-by-platform-id.repository';
import { QueueService } from '@Queue/services/queue.service';
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
    private readonly loadTrackPlatformByPlatformIdRepository: LoadTrackPlatformByPlatformIdRepository,
    private readonly queueService: QueueService,
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
    const tracksWithData = tracksToProcess.map((track) => ({
      platform: track.platform,
      platformId: track.platformId,
      name: '',
      artist: '',
      album: '',
      duration: 0,
    }));

    const { newTracks } = await this.createTracksService.create(tracksWithData);

    await Promise.all(
      newTracks.map((track, index) =>
        this.queueService.publishTrackEnrichment(
          track.id,
          tracksToProcess[index].platform,
        ),
      ),
    );

    return newTracks.map((track, index) => ({
      trackId: track.id,
      platform: tracksToProcess[index].platform,
      platformId: tracksToProcess[index].platformId,
    }));
  }
}
