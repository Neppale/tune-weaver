import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@Prisma/prisma.service';

@Injectable()
export class DeleteTracksFromPlaylistRepository {
  private readonly logger = new Logger(DeleteTracksFromPlaylistRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async delete(playlistId: string, trackIds: string[]): Promise<void> {
    this.logger.log(
      `Deleting ${trackIds.length} tracks from playlist ${playlistId}`,
    );

    await this.prisma.playlistTrack.deleteMany({
      where: {
        playlistId,
        trackId: {
          in: trackIds,
        },
      },
    });
  }
}
