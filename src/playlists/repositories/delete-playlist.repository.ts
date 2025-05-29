import { Injectable } from '@nestjs/common';
import { PrismaService } from '@Prisma/prisma.service';

@Injectable()
export class DeletePlaylistRepository {
  constructor(private readonly prisma: PrismaService) {}

  async delete(id: string): Promise<void> {
    await this.prisma.playlist.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
