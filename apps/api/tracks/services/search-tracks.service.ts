import { Injectable, Logger } from '@nestjs/common';
import { SearchTracksRepository } from '@Tracks/repositories/search-tracks.repository';
import { SearchTracksDto } from '@Tracks/dtos/search-tracks.dto';
import { SearchTracksResult } from '@Tracks/models/search-tracks.result';

@Injectable()
export class SearchTracksService {
  private readonly logger = new Logger(SearchTracksService.name);

  constructor(
    private readonly searchTracksRepository: SearchTracksRepository,
  ) {}

  async search(dto: SearchTracksDto): Promise<SearchTracksResult> {
    this.logger.log(`Processing track search request: ${dto.search}`);
    return this.searchTracksRepository.search(dto);
  }
}
