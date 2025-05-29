import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import { GetSamplePlaylistsService } from './services/get-sample-playlists.service';
import { CreatePlaylistDto } from './dtos/create-playlist.dto';
import { CreatePlaylistService } from './services/create-playlist.service';
import { Platform, Playlist } from '@prisma/client';
import { PlaylistOrganization } from '../interfaces/spotify/playlist-organization.interface';
import { LoadPlaylistDataService } from './services/load-playlist-data.service';
import { LoadPlaylistTracksService } from './services/load-playlist-tracks.service';
import { LoadPlaylistTracksResult } from './models/load-playlist-tracks.result';
import { LoadPlaylistTracksDto } from '@Playlists/dtos/load-playlist-tracks.dto';
import { ImportPlaylistService } from './services/import-playlist.service';
import { ImportPlaylistDto } from './dtos/import-playlist.dto';
import { AddTracksToPlaylistService } from './services/add-tracks-to-playlist.service';
import { AddTracksToPlaylistDto } from './dtos/add-tracks-to-playlist.dto';
import { DeleteTracksFromPlaylistService } from './services/delete-tracks-from-playlist.service';
import { DeleteTracksFromPlaylistDto } from './dtos/delete-tracks-from-playlist.dto';
import { DeletePlaylistService } from './services/delete-playlist.service';

@Controller('playlist')
export class PlaylistController {
  constructor(
    private readonly getSamplePlaylistsService: GetSamplePlaylistsService,
    private readonly createPlaylistService: CreatePlaylistService,
    private readonly loadPlaylistDataService: LoadPlaylistDataService,
    private readonly loadPlaylistTracksService: LoadPlaylistTracksService,
    private readonly importPlaylistService: ImportPlaylistService,
    private readonly addTracksToPlaylistService: AddTracksToPlaylistService,
    private readonly deleteTracksFromPlaylistService: DeleteTracksFromPlaylistService,
    private readonly deletePlaylistService: DeletePlaylistService,
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

  @Post('import')
  async import(@Body() data: ImportPlaylistDto): Promise<Playlist> {
    return this.importPlaylistService.import(data);
  }

  @Patch(':id')
  addTracks(
    @Param('id') id: string,
    @Body() addTracksDto: AddTracksToPlaylistDto,
  ): Promise<void> {
    return this.addTracksToPlaylistService.add(id, addTracksDto);
  }

  @Delete(':id/tracks')
  deleteTracks(
    @Param('id') id: string,
    @Body() deleteTracksDto: DeleteTracksFromPlaylistDto,
  ): Promise<void> {
    return this.deleteTracksFromPlaylistService.delete(id, deleteTracksDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.deletePlaylistService.delete(id);
  }
}
