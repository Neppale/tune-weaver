import { Controller, Post, Body, Get, Param, Headers } from '@nestjs/common';
import { SpotifyAuthService } from '../auth/services/spotify-auth.service';
import { GetTracksBySpotifyPlaylistId } from './services/get-tracks-by-spotify-playlist-id.service';
import { GetSamplePlaylistsService } from './services/get-sample-playlists.service';
import { PlaylistOrganization } from '../interfaces/spotify/playlist-organization.interface';
import { CreatePlaylistDto } from './dtos/create-playlist.dto';
import { CreatePlaylistService } from './services/create-playlist.service';

@Controller('playlist')
export class PlaylistController {
  constructor(
    private readonly spotifyAuthService: SpotifyAuthService,
    private readonly spotifyPlaylistService: GetTracksBySpotifyPlaylistId,
    private readonly getSamplePlaylistsService: GetSamplePlaylistsService,
    private readonly createPlaylistService: CreatePlaylistService,
  ) {}

  @Get('sample/:playlistId')
  async sample(
    @Param('playlistId') playlistId: string,
    @Headers('Authorization') authorization: string,
  ): Promise<PlaylistOrganization[]> {
    this.spotifyAuthService.setAccessToken(authorization);
    const tracks =
      await this.spotifyPlaylistService.getPlaylistTracks(playlistId);
    return this.getSamplePlaylistsService.organize(tracks);
  }

  @Post('create')
  async create(@Body() body: CreatePlaylistDto) {
    return this.createPlaylistService.create(body);
  }
}
