import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IRemoveTrackFromPlaylistRepository } from '../../interfaces/playlist.repository.interface';
import { Playlist } from '@prisma/client';

@Injectable()
export class RemoveTrackFromPlaylistRepository
  implements IRemoveTrackFromPlaylistRepository
{
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
        sourcePlaylist: true,
      },
    });
  }
}
