import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { SearchTracksService } from './services/search-tracks.service';
import { SearchTracksDto } from './models/dtos/search-tracks.dto';
import { SearchTracksResult } from './models/search-tracks.result';
import { Track } from '@prisma/client';
import { UpdateTrackDto } from '@Tracks/models/dtos/update-track.dto';
import { UpdateTrackService } from '@Tracks/services/update-track.service';

@Controller('track')
export class TrackController {
  constructor(
    private readonly searchTracksService: SearchTracksService,
    private readonly updateTrackService: UpdateTrackService,
  ) {}

  @Get()
  async search(@Query() params: SearchTracksDto): Promise<SearchTracksResult> {
    return this.searchTracksService.search(params);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ): Promise<Track> {
    return this.updateTrackService.update(id, updateTrackDto);
  }
}
