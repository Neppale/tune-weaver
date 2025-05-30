import { Injectable, Logger } from '@nestjs/common';
import { YoutubeMusicAuthService } from '@Auth/services/youtube-music-auth.service';
import { ImportedPlaylist } from '@Playlists/models/imported-playlist.model';
import { Platform } from '@prisma/client';

@Injectable()
export class FetchYoutubeMusicPlaylistService {
  private readonly logger = new Logger(FetchYoutubeMusicPlaylistService.name);

  constructor(
    private readonly youtubeMusicAuthService: YoutubeMusicAuthService,
  ) {}

  async fetch(playlistId: string): Promise<ImportedPlaylist> {
    try {
      const playlist =
        await this.youtubeMusicAuthService.getPlaylist(playlistId);

      return {
        name: playlist[0]?.name || 'Unknown Playlist',
        trackIds: playlist.map((track) => track.videoId),
        platform: Platform.YOUTUBE_MUSIC,
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch YouTube Music playlist ${playlistId}: ${error.message}`,
      );
      throw error;
    }
  }
}
