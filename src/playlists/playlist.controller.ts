import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { GetSamplePlaylistsService } from './services/get-sample-playlists.service';
import { CreatePlaylistDto } from './dtos/create-playlist.dto';
import { CreatePlaylistService } from './services/create-playlist.service';
import { Platform, Playlist } from '@prisma/client';
import { PlaylistOrganization } from '../interfaces/spotify/playlist-organization.interface';
import { LoadPlaylistDataService } from './services/load-playlist-data.service';
import { LoadPlaylistTracksService } from './services/load-playlist-tracks.service';
import { LoadPlaylistTracksResult } from './models/load-playlist-tracks.result';
import { LoadPlaylistTracksDto } from '@Playlists/dtos/load-playlist-tracks.dto';

@Controller('playlist')
export class PlaylistController {
  constructor(
    private readonly getSamplePlaylistsService: GetSamplePlaylistsService,
    private readonly createPlaylistService: CreatePlaylistService,
    private readonly loadPlaylistDataService: LoadPlaylistDataService,
    private readonly loadPlaylistTracksService: LoadPlaylistTracksService,
  ) {}

  @Get('sample/:playlistId')
  async sample(
    @Param('playlistId') playlistId: string,
    @Query('platform') platform: Platform,
  ): Promise<PlaylistOrganization[]> {
    return this.getSamplePlaylistsService.get(platform, playlistId);
  }

  @Post('create')
  async create(@Body() body: CreatePlaylistDto): Promise<Playlist> {
    return this.createPlaylistService.create(body);
  }

  @Get(':id')
  async load(@Param('id') id: string): Promise<Playlist> {
    return this.loadPlaylistDataService.load(id);
  }

  @Get(':id/tracks')
  async loadTracks(
    @Param('id') playlistId: string,
    @Query() query: LoadPlaylistTracksDto,
  ): Promise<LoadPlaylistTracksResult> {
    return this.loadPlaylistTracksService.load(playlistId, query);
  }
}
