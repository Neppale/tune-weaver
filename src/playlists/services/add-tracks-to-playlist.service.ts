import { Injectable, Logger } from '@nestjs/common';
import { Platform } from '@prisma/client';
import { AddTracksToPlaylistRepository } from '../repositories/add-tracks-to-playlist.repository';
import { CreateTracksService } from '@Tracks/services/create-tracks.service';
import { QueueService } from '@Queue/services/queue.service';
import { AddTracksToPlaylistDto } from '../dtos/add-tracks-to-playlist.dto';

@Injectable()
export class AddTracksToPlaylistService {
  private readonly logger = new Logger(AddTracksToPlaylistService.name);

  constructor(
    private readonly addTracksToPlaylistRepository: AddTracksToPlaylistRepository,
    private readonly createTracksService: CreateTracksService,
    private readonly queueService: QueueService,
  ) {}

  async addTracks(
    playlistId: string,
    dto: AddTracksToPlaylistDto,
  ): Promise<void> {
    try {
      const tracksByPlatform = dto.tracks.reduce(
        (acc, track) => {
          if (!acc[track.platform]) {
            acc[track.platform] = [];
          }
          acc[track.platform].push(track.platformId);
          return acc;
        },
        {} as Record<Platform, string[]>,
      );

      for (const [platform, platformIds] of Object.entries(tracksByPlatform)) {
        const existingTracks =
          await this.addTracksToPlaylistRepository.findExistingTracks(
            platformIds,
            platform as Platform,
          );

        const existingPlatformIds = new Set(
          existingTracks.map((track) => track.platformId),
        );
        const newPlatformIds = platformIds.filter(
          (id) => !existingPlatformIds.has(id),
        );

        if (newPlatformIds.length > 0) {
          const { newTracks } = await this.createTracksService.create(
            newPlatformIds.map((platformId) => ({
              platformId,
              platform: platform as Platform,
              name: '',
              artist: '',
              album: '',
              duration: 0,
            })),
          );

          for (const track of newTracks) {
            await this.queueService.publishTrackEnrichment(
              track.id,
              platform as Platform,
            );
          }

          await this.addTracksToPlaylistRepository.addTracks(playlistId, [
            ...existingTracks.map((t) => t.id),
            ...newTracks.map((t) => t.id),
          ]);
        } else {
          await this.addTracksToPlaylistRepository.addTracks(
            playlistId,
            existingTracks.map((t) => t.id),
          );
        }
      }
    } catch (error) {
      this.logger.error(
        `Failed to add tracks to playlist ${playlistId}: ${error.message}`,
      );
      throw error;
    }
  }
}
