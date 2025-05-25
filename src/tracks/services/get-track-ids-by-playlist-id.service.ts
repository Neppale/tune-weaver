import { ServiceUnavailableException, Injectable } from '@nestjs/common';
import { Platform } from '@prisma/client';
import { SpotifyAuthService } from '../../auth/services/spotify-auth.service';
import { YoutubeMusicAuthService } from '../../auth/services/youtube-music-auth.service';
import { SpotifyPlaylistResponse } from '../../interfaces/spotify/playlist.interface';
import { PlatformNotSupportedException } from 'src/exceptions/auth.exception';

@Injectable()
export class GetTrackIdsByPlaylistIdService {
  constructor(
    private readonly spotifyAuthService: SpotifyAuthService,
    private readonly youtubeMusicAuthService: YoutubeMusicAuthService,
  ) {}

  async get(platform: Platform, playlistId: string): Promise<string[]> {
    try {
      switch (platform) {
        case Platform.SPOTIFY:
          const spotifyPlaylist =
            await this.spotifyAuthService.makeRequest<SpotifyPlaylistResponse>(
              `/playlists/${playlistId}`,
            );
          return spotifyPlaylist.tracks.items
            .filter((item) => item.track !== null)
            .map((item) => item.track!.id);

        case Platform.YOUTUBE_MUSIC:
          const youtubePlaylist =
            await this.youtubeMusicAuthService.getPlaylist(playlistId);
          return youtubePlaylist.map((track) => track.videoId);

        default:
          throw new PlatformNotSupportedException(platform);
      }
    } catch (error) {
      throw new ServiceUnavailableException({
        message: `Failed to fetch track IDs from ${platform} playlist: ${error.message}`,
        source: GetTrackIdsByPlaylistIdService.name,
      });
    }
  }
}
