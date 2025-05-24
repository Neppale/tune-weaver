import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { GetSamplePlaylistsService } from './services/get-sample-playlists.service';
import { CreatePlaylistDto } from './dtos/create-playlist.dto';
import { CreatePlaylistService } from './services/create-playlist.service';
import { Platform } from '@prisma/client';
import { PlaylistOrganization } from '../interfaces/spotify/playlist-organization.interface';

@Controller('playlist')
export class PlaylistController {
  constructor(
    private readonly getSamplePlaylistsService: GetSamplePlaylistsService,
    private readonly createPlaylistService: CreatePlaylistService,
  ) {}

  @Get('sample/:playlistId')
  async sample(
    @Param('playlistId') playlistId: string,
    @Query('platform') platform: Platform,
  ): Promise<PlaylistOrganization[]> {
    return this.getSamplePlaylistsService.get(platform, playlistId);
  }

  @Post('create')
  async create(@Body() body: CreatePlaylistDto) {
    return this.createPlaylistService.create(body);
  }
}
