import { Controller, Get, Query } from '@nestjs/common';
import { SearchTracksService } from './services/search-tracks.service';
import { SearchTracksDto } from './models/dtos/search-tracks.dto';
import { SearchTracksResult } from './models/search-tracks.result';

@Controller('track')
export class TrackController {
  constructor(private readonly searchTracksService: SearchTracksService) {}

  @Get()
  async search(@Query() params: SearchTracksDto): Promise<SearchTracksResult> {
    return this.searchTracksService.search(params);
  }
}
