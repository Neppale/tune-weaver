import { Injectable, Logger } from '@nestjs/common';
import { Platform } from '@prisma/client';
import { SpotifyAuthService } from '@Auth/services/spotify-auth.service';
import { ImportedPlaylist } from '@Playlists/models/imported-playlist.model';
import { SpotifyPlaylistResponse } from '@Interfaces/spotify/playlist.interface';

@Injectable()
export class FetchSpotifyPlaylistService {
  private readonly logger = new Logger(FetchSpotifyPlaylistService.name);

  constructor(private readonly spotifyAuthService: SpotifyAuthService) {}

  async fetch(playlistId: string): Promise<ImportedPlaylist> {
    try {
      const playlist =
        await this.spotifyAuthService.makeRequest<SpotifyPlaylistResponse>(
          `/playlists/${playlistId}`,
        );

      return {
        name: playlist.name,
        trackIds: playlist.tracks.items
          .filter((item) => item.track !== null)
          .map((item) => item.track!.id),
        platform: Platform.SPOTIFY,
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch Spotify playlist ${playlistId}: ${error.message}`,
      );
      throw error;
    }
  }
}
