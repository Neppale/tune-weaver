import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { Platform } from '@prisma/client';
import { SpotifyAuthService } from 'src/auth/services/spotify-auth.service';
import { CreateTrackDto } from 'src/playlists/dtos/playlist.dto';

@Injectable()
export class ValidatePlaylistTracksValidator {
  constructor(private readonly spotifyAuthService: SpotifyAuthService) {}

  async validate(tracks: CreateTrackDto[]): Promise<void> {
    for (const track of tracks) {
      if (track.platform === Platform.SPOTIFY) {
        try {
          await this.spotifyAuthService.makeRequest(
            `/tracks/${track.platformId}`,
          );
        } catch (error) {
          if (error.response?.status === 400) {
            throw new BadRequestException({
              message: `At least one of the songs from Spotify is invalid.`,
            });
          }
          throw new BadGatewayException({
            message: `Something went wrong while validating the songs from Spotify.`,
          });
        }
      }
    }
  }
}
