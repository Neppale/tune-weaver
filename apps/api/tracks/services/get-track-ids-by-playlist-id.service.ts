import { Injectable } from '@nestjs/common';
import { Platform } from '@prisma/client';
import { SpotifyAuthService } from '@Auth/services/spotify-auth.service';
import { YoutubeMusicAuthService } from '@Auth/services/youtube-music-auth.service';
import { SpotifyPlaylistResponse } from '@Interfaces/spotify/playlist.interface';
import { PlatformNotSupportedException } from '@Exceptions/auth.exception';

@Injectable()
export class GetTrackIdsByPlaylistIdService {
  constructor(
    private readonly spotifyAuthService: SpotifyAuthService,
    private readonly youtubeMusicAuthService: YoutubeMusicAuthService,
  ) {}

  async get(platform: Platform, playlistId: string): Promise<string[]> {
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
  }
}
