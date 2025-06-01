import { Injectable } from '@nestjs/common';
import { LoadPlaylistTracksRepository } from '@Playlists/repositories/load-playlist-tracks.repository';
import { LoadPlaylistDataByIdService } from '@Playlists/services/load-playlist-data.service';
import { LoadPlaylistTracksDto } from '@Playlists/models/dtos/load-playlist-tracks.dto';
import { LoadPlaylistTracksResult } from '@Playlists/models/load-playlist-tracks.result';

@Injectable()
export class LoadPlaylistTracksService {
  constructor(
    private readonly loadPlaylistTracksRepository: LoadPlaylistTracksRepository,
    private readonly loadPlaylistDataByIdService: LoadPlaylistDataByIdService,
  ) {}

  async load(
    playlistId: string,
    { search, page, size }: LoadPlaylistTracksDto,
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
