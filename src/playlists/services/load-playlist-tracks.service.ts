import { Injectable } from '@nestjs/common';
import { LoadPlaylistTracksRepository } from '../repositories/load-playlist-tracks.repository';
import { LoadPlaylistDataByIdService } from './load-playlist-data.service';
import { LoadPlaylistTracksDto } from '@Playlists/dtos/load-playlist-tracks.dto';
import { LoadPlaylistTracksResult } from '@Playlists/models/load-playlist-tracks.result';

@Injectable()
export class LoadPlaylistTracksService {
  private readonly DEFAULT_PAGE = 1;
  private readonly DEFAULT_PAGE_SIZE = 100;

  constructor(
    private readonly loadPlaylistTracksRepository: LoadPlaylistTracksRepository,
    private readonly loadPlaylistDataByIdService: LoadPlaylistDataByIdService,
  ) {}

  async load(
    playlistId: string,
    {
      search,
      page = this.DEFAULT_PAGE,
      size = this.DEFAULT_PAGE_SIZE,
    }: LoadPlaylistTracksDto,
  ): Promise<LoadPlaylistTracksResult> {
    await this.loadPlaylistDataByIdService.load(playlistId);

    const { tracks, total } = await this.loadPlaylistTracksRepository.load(
      playlistId,
      {
        search,
        page,
        size,
      },
    );

    return {
      tracks,
      total,
    };
  }
}
