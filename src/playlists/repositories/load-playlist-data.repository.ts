import { Injectable } from '@nestjs/common';
import { PrismaService } from '@Prisma/prisma.service';
import { Playlist } from '@prisma/client';

@Injectable()
export class LoadPlaylistDataByIdRepository {
  constructor(private readonly prisma: PrismaService) {}

  async load(id: string): Promise<Playlist | null> {
    return this.prisma.playlist.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });
  }
}
