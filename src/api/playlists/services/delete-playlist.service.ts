import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DeletePlaylistRepository } from '@Playlists/repositories/delete-playlist.repository';
import { LoadPlaylistDataByIdRepository } from '@Playlists/repositories/load-playlist-data-by-id.repository';

@Injectable()
export class DeletePlaylistService {
  private readonly logger = new Logger(DeletePlaylistService.name);

  constructor(
    private readonly deletePlaylistRepository: DeletePlaylistRepository,
    private readonly loadPlaylistDataByIdRepository: LoadPlaylistDataByIdRepository,
  ) {}

  async delete(id: string): Promise<void> {
    this.logger.log(`Processing request to delete playlist ${id}`);

    const playlist = await this.loadPlaylistDataByIdRepository.load(id);
    if (!playlist || playlist.deletedAt) {
      throw new NotFoundException({
        message: `Playlist with id ${id} not found`,
        source: DeletePlaylistService.name,
      });
    }

    await this.deletePlaylistRepository.delete(id);
  }
}
