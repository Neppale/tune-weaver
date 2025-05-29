import { Injectable, Logger } from '@nestjs/common';
import { Platform } from '@prisma/client';
import { ImportPlaylistDto } from '../dtos/import-playlist.dto';
import { FetchYoutubeMusicPlaylistService } from './youtube-music/fetch-youtube-music-playlist.service';
import { CreatePlaylistService } from './create-playlist.service';
import { CreatePlaylistDto } from '../dtos/create-playlist.dto';
import { PlatformNotSupportedException } from '@Exceptions/auth.exception';
import { ImportedPlaylist } from '../models/imported-playlist.model';

@Injectable()
export class ImportPlaylistService {
  private readonly logger = new Logger(ImportPlaylistService.name);

  constructor(
    private readonly fetchYoutubeMusicPlaylistService: FetchYoutubeMusicPlaylistService,
    private readonly createPlaylistService: CreatePlaylistService,
  ) {}

  async import(data: ImportPlaylistDto) {
    try {
      const playlist = await this.fetchPlaylist(data.platform, data.platformId);
      const createPlaylistDto = this.mapToCreatePlaylistDto(data, playlist);

      return this.createPlaylistService.create(createPlaylistDto);
    } catch (error) {
      this.logger.error(
        `Failed to import playlist from ${data.platform}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private async fetchPlaylist(
    platform: Platform,
    platformId: string,
  ): Promise<ImportedPlaylist> {
    switch (platform) {
      case Platform.YOUTUBE_MUSIC:
        const response =
          await this.fetchYoutubeMusicPlaylistService.fetch(platformId);

        return {
          name: response.name,
          trackIds: response.trackIds,
          platform,
        };
      default:
        throw new PlatformNotSupportedException(platform);
    }
  }

  private mapToCreatePlaylistDto(
    data: ImportPlaylistDto,
    playlist: ImportedPlaylist,
  ): CreatePlaylistDto {
    return {
      name: playlist.name,
      type: 'IMPORTED',
      userId: data.userId,
      tracks: playlist.trackIds.map((trackId) => ({
        platform: data.platform,
        platformId: trackId,
      })),
    };
  }
}
