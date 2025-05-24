import { Controller, Post, Body, Get, Param, Headers } from '@nestjs/common';
import { SpotifyAuthService } from '../auth/services/spotify-auth.service';
import { SpotifyPlaylistService } from './services/spotify-playlist.service';
import { PlaylistOrganizerService } from './services/playlist-organizer.service';
import { PlaylistOrganization } from '../interfaces/spotify.interface';
import { CreatePlaylistService } from 'src/playlists/create-playlist.service';

@Controller('playlist')
export class PlaylistController {
  constructor(
    private readonly spotifyAuthService: SpotifyAuthService,
    private readonly spotifyPlaylistService: SpotifyPlaylistService,
    private readonly playlistOrganizerService: PlaylistOrganizerService,
    private readonly createPlaylistService: CreatePlaylistService,
  ) {}

  @Get('organize/:playlistId')
  async organize(
    @Param('playlistId') playlistId: string,
    @Headers('Authorization') authorization: string,
  ): Promise<PlaylistOrganization[]> {
    this.spotifyAuthService.setAccessToken(authorization);
    const tracks =
      await this.spotifyPlaylistService.getPlaylistTracks(playlistId);
    return this.playlistOrganizerService.getAllOrganizations(tracks);
  }

  @Post('create')
  async create(@Body() body: { name: string; userId: string }) {
    return this.createPlaylistService.create(body.subplaylistName, [], '1');
  }
}
