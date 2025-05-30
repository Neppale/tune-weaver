import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@Prisma/prisma.service';
import { generateId } from '@Utils/id-generator.util';

@Injectable()
export class AddTracksToPlaylistRepository {
  private readonly logger = new Logger(AddTracksToPlaylistRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async addTracks(playlistId: string, trackIds: string[]): Promise<void> {
    try {
      await this.prisma.playlistTrack.createMany({
        data: trackIds.map((trackId) => ({
          id: generateId(),
          playlistId,
          trackId,
        })),
        skipDuplicates: true,
      });
    } catch (error) {
      this.logger.error(
        `Failed to add tracks to playlist ${playlistId}: ${error.message}`,
      );
      throw error;
    }
  }
}
