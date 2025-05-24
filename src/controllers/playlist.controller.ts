import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SpotifyService } from '../services/spotify.service';
import { PlaylistOrganizerService } from '../services/playlist-organizer.service';
import { PlaylistOrganization } from '../interfaces/spotify.interface';

@Controller('playlist')
export class PlaylistController {
  constructor(
    private readonly spotifyService: SpotifyService,
    private readonly playlistOrganizerService: PlaylistOrganizerService,
  ) {}

  @Post('organize')
  async organize(
    @Body() body: { accessToken: string; playlistId: string },
  ): Promise<PlaylistOrganization[]> {
    try {
      this.spotifyService.setAccessToken(body.accessToken);
      const tracks = await this.spotifyService.getPlaylistTracks(
        body.playlistId,
      );
      return this.playlistOrganizerService.getAllOrganizations(tracks);
    } catch (error) {
      throw new HttpException(
        `Failed to organize playlist: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
