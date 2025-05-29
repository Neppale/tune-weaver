import { Injectable, NotFoundException } from '@nestjs/common';
import { LoadPlaylistDataRepository } from '../repositories/load-playlist-data.repository';
import { Playlist } from '@prisma/client';

@Injectable()
export class LoadPlaylistDataService {
  constructor(
    private readonly loadPlaylistDataRepository: LoadPlaylistDataRepository,
  ) {}

  async load(id: string): Promise<Playlist> {
    const playlist = await this.loadPlaylistDataRepository.load(id);

    if (!playlist) {
      throw new NotFoundException({
        message: `Playlist with id ${id} not found`,
        source: LoadPlaylistDataService.name,
      });
    }

    return playlist;
  }
}
