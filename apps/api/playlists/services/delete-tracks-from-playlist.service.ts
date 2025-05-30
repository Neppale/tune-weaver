import { Injectable, Logger } from '@nestjs/common';
import { DeleteTracksFromPlaylistRepository } from '@Playlists/repositories/delete-tracks-from-playlist.repository';
import { DeleteTracksFromPlaylistDto } from '@Playlists/dtos/delete-tracks-from-playlist.dto';

@Injectable()
export class DeleteTracksFromPlaylistService {
  private readonly logger = new Logger(DeleteTracksFromPlaylistService.name);

  constructor(
    private readonly deleteTracksFromPlaylistRepository: DeleteTracksFromPlaylistRepository,
  ) {}

  async delete(
    playlistId: string,
    dto: DeleteTracksFromPlaylistDto,
  ): Promise<void> {
    this.logger.log(
      `Processing request to delete ${dto.trackIds.length} tracks from playlist ${playlistId}`,
    );

    await this.deleteTracksFromPlaylistRepository.delete(
      playlistId,
      dto.trackIds,
    );
  }
}
