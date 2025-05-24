import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SpotifyTrack } from '../../interfaces/spotify.interface';
import { SpotifyAuthService } from '../../auth/services/spotify-auth.service';
import { GetSpotifyTrackDataByTrackIdService } from '../../tracks/services/get-spotify-track-data-by-track-id.service';

interface SpotifyPlaylistResponse {
  tracks: {
    items: Array<{
      track: {
        id: string;
      } | null;
    }>;
  };
}

@Injectable()
export class SpotifyPlaylistService {
  constructor(
    private readonly spotifyAuthService: SpotifyAuthService,
    private readonly spotifyTrackService: GetSpotifyTrackDataByTrackIdService,
  ) {}

  async getPlaylistTracks(playlistId: string): Promise<SpotifyTrack[]> {
    try {
      const response =
        await this.spotifyAuthService.makeRequest<SpotifyPlaylistResponse>(
          `/playlists/${playlistId}`,
        );

      // The items array is inside the tracks object
      const trackIds = response.tracks.items
        .filter((item) => item.track !== null)
        .map((item) => item.track!.id);

      return this.spotifyTrackService.get(trackIds);
    } catch (error) {
      // Handle different types of Spotify API errors
      if (error.response?.status) {
        switch (error.response.status) {
          case 401:
            throw new HttpException(
              'Unauthorized access to Spotify API',
              HttpStatus.UNAUTHORIZED,
            );
          case 403:
            throw new HttpException(
              'Forbidden access to Spotify API',
              HttpStatus.FORBIDDEN,
            );
          case 404:
            throw new HttpException('Playlist not found', HttpStatus.NOT_FOUND);
          case 429:
            throw new HttpException(
              'Too many requests to Spotify API',
              HttpStatus.TOO_MANY_REQUESTS,
            );
          case 500:
          case 502:
          case 503:
          case 504:
            throw new HttpException(
              'Spotify API is currently unavailable',
              HttpStatus.SERVICE_UNAVAILABLE,
            );
          default:
            throw new HttpException(
              `Spotify API error: ${error.message}`,
              error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
      }

      // For other types of errors (network, etc.)
      throw new HttpException(
        `Failed to fetch playlist tracks: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
