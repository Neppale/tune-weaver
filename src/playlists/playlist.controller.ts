import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { GetSamplePlaylistsService } from './services/get-sample-playlists.service';
import { PlaylistOrganization } from '../interfaces/spotify/playlist-organization.interface';
import { CreatePlaylistDto } from './dtos/create-playlist.dto';
import { CreatePlaylistService } from './services/create-playlist.service';

@Controller('playlist')
export class PlaylistController {
  constructor(
    private readonly getSamplePlaylistsService: GetSamplePlaylistsService,
    private readonly createPlaylistService: CreatePlaylistService,
  ) {}

  @Get('sample/:playlistId')
  async sample(
    @Param('playlistId') playlistId: string,
  ): Promise<PlaylistOrganization[]> {
    return this.getSamplePlaylistsService.organize(playlistId);
  }

  @Post('create')
  async create(@Body() body: CreatePlaylistDto) {
    return this.createPlaylistService.create(body);
  }
}
