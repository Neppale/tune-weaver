import { Injectable, NotFoundException } from '@nestjs/common';
import { LoadPlaylistDataByIdRepository } from '../repositories/load-playlist-data.repository';
import { Playlist } from '@prisma/client';

@Injectable()
export class LoadPlaylistDataService {
  constructor(
    private readonly loadPlaylistDataByIdRepository: LoadPlaylistDataByIdRepository,
  ) {}

  async load(id: string): Promise<Playlist> {
    const playlist = await this.loadPlaylistDataByIdRepository.load(id);

    if (!playlist) {
      throw new NotFoundException({
        message: `Playlist with id ${id} not found`,
        source: LoadPlaylistDataService.name,
      });
    }

    return playlist;
  }
}
