import { Injectable } from '@nestjs/common';
import { PrismaService } from '@Prisma/prisma.service';
import { Playlist } from '@prisma/client';

@Injectable()
export class RemoveTrackFromPlaylistRepository {
  constructor(private prisma: PrismaService) {}

  async removeTrack(playlistId: string, trackId: string): Promise<Playlist> {
    return this.prisma.playlist.update({
      where: { id: playlistId },
      data: {
        tracks: {
          delete: {
            id: trackId,
          },
        },
      },
      include: {
        tracks: true,
      },
    });
  }
}
