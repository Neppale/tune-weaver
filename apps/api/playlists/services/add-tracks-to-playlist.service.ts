import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Platform } from '@prisma/client';
import { AddTracksToPlaylistRepository } from '@Playlists/repositories/add-tracks-to-playlist.repository';
import { CreateTracksService } from '@Tracks/services/create-tracks.service';
import { SendTrackToEnrichmentQueue } from '@Tracks/services/send-track-to-enrichment-queue.service';
import { AddTracksToPlaylistDto } from '@Tracks/models/dtos/add-tracks-to-playlist.dto';
import { LoadPlaylistDataByIdRepository } from '@Playlists/repositories/load-playlist-data-by-id.repository';
import { LoadTrackByIdRepository } from '@Tracks/repositories/load-track-by-id.repository';

@Injectable()
export class AddTracksToPlaylistService {
  private readonly logger = new Logger(AddTracksToPlaylistService.name);

  constructor(
    private readonly loadPlaylistDataByIdRepository: LoadPlaylistDataByIdRepository,
    private readonly addTracksToPlaylistRepository: AddTracksToPlaylistRepository,
    private readonly loadTrackByIdRepository: LoadTrackByIdRepository,
    private readonly createTracksService: CreateTracksService,
    private readonly queueService: SendTrackToEnrichmentQueue,
  ) {}

  async add(playlistId: string, dto: AddTracksToPlaylistDto): Promise<void> {
    try {
      this.logger.log(
        `Adding ${dto.tracks.length} tracks to playlist ${playlistId}`,
      );

      const playlist =
        await this.loadPlaylistDataByIdRepository.load(playlistId);
      if (!playlist) {
        throw new NotFoundException({
          message: `Playlist with id ${playlistId} not found`,
          source: AddTracksToPlaylistService.name,
        });
      }

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
        const existingTracks = await Promise.all(
          platformIds.map((platformId) =>
            this.loadTrackByIdRepository.load(platformId, platform as Platform),
          ),
        ).then((tracks) =>
          tracks.filter(
            (track): track is NonNullable<typeof track> => track !== null,
          ),
        );

        const existingPlatformIds = new Set(
          existingTracks.flatMap((track) =>
            track.platforms?.map((p) => p.platformId),
          ),
        );
        const newPlatformIds = platformIds.filter(
          (id) => !existingPlatformIds.has(id),
        );

        if (newPlatformIds.length) {
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
