import { Injectable, NotFoundException } from '@nestjs/common';
import { LoadPlaylistDataByIdRepository } from '@Playlists/repositories/load-playlist-data-by-id.repository';
import { Playlist } from '@prisma/client';

@Injectable()
export class LoadPlaylistDataByIdService {
  constructor(
    private readonly loadPlaylistDataByIdRepository: LoadPlaylistDataByIdRepository,
  ) {}

  async load(id: string): Promise<Playlist> {
    const playlist = await this.loadPlaylistDataByIdRepository.load(id);

    if (!playlist) {
      throw new NotFoundException({
        message: `Playlist with id ${id} not found`,
        source: LoadPlaylistDataByIdService.name,
      });
    }

    return playlist;
  }
}
