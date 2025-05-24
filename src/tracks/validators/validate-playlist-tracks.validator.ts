import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { Platform } from '@prisma/client';
import { SpotifyAuthService } from 'src/auth/services/spotify-auth.service';
import { YoutubeMusicAuthService } from 'src/auth/services/youtube-music-auth.service';
import { CreateTrackDto } from 'src/playlists/dtos/playlist.dto';

@Injectable()
export class ValidatePlaylistTracksValidator {
  constructor(
    private readonly spotifyAuthService: SpotifyAuthService,
    private readonly youtubeMusicAuthService: YoutubeMusicAuthService,
  ) {}

  async validate(tracks: CreateTrackDto[]): Promise<void> {
    const spotifyTracks = tracks.filter(
      (track) => track.platform === Platform.SPOTIFY,
    );
    const youtubeTracks = tracks.filter(
      (track) => track.platform === Platform.YOUTUBE_MUSIC,
    );

    const [spotifyResults, youtubeResults] = await Promise.all([
      this.validateSpotifyTracks(spotifyTracks),
      this.validateYoutubeTracks(youtubeTracks),
    ]);

    const errors: string[] = [];

    if (spotifyResults.failed.length > 0) {
      errors.push(
        `Invalid Spotify tracks: ${spotifyResults.failed.join(', ')}`,
      );
    }

    if (youtubeResults.failed.length > 0) {
      errors.push(
        `Invalid YouTube Music tracks: ${youtubeResults.failed.join(', ')}`,
      );
    }

    if (errors.length > 0) {
      throw new BadRequestException({
        message: errors.join('. '),
      });
    }
  }

  private async validateSpotifyTracks(
    tracks: CreateTrackDto[],
  ): Promise<{ failed: string[] }> {
    if (tracks.length === 0) return { failed: [] };

    const results = await Promise.allSettled(
      tracks.map((track) =>
        this.spotifyAuthService.makeRequest(`/tracks/${track.platformId}`),
      ),
    );

    const failed = results
      .map((result, index) => {
        if (result.status === 'rejected') {
          if (result.reason.response?.status === 400) {
            return tracks[index].platformId;
          }
          throw new BadGatewayException({
            message:
              'Something went wrong while validating the songs from Spotify.',
          });
        }
        return null;
      })
      .filter((id): id is string => id !== null);

    return { failed };
  }

  private async validateYoutubeTracks(
    tracks: CreateTrackDto[],
  ): Promise<{ failed: string[] }> {
    if (tracks.length === 0) return { failed: [] };

    const results = await Promise.allSettled(
      tracks.map((track) =>
        this.youtubeMusicAuthService.getTrack(track.platformId),
      ),
    );

    const failed = results
      .map((result, index) => {
        if (result.status === 'rejected') {
          if (result.reason.message?.includes('Invalid videoId')) {
            return tracks[index].platformId;
          }
          throw new BadGatewayException({
            message:
              'Something went wrong while validating the songs from YouTube Music.',
          });
        }
        return null;
      })
      .filter((id): id is string => id !== null);

    return { failed };
  }
}
