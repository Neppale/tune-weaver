import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../services/prisma.service';
import { IAddTracksToPlaylistRepository } from '../../interfaces/playlist.repository.interface';
import { Playlist } from '@prisma/client';
import { AddTracksDto } from '../../dtos/playlist.dto';

@Injectable()
export class AddTracksToPlaylistRepository
  implements IAddTracksToPlaylistRepository
{
  constructor(private prisma: PrismaService) {}

  async addTracks(playlistId: string, data: AddTracksDto): Promise<Playlist> {
    return this.prisma.playlist.update({
      where: { id: playlistId },
      data: {
        tracks: {
          connectOrCreate: data.tracks.map((track) => ({
            where: {
              platform_platformId: {
                platform: track.platform,
                platformId: track.platformId,
              },
            },
            create: {
              platform: track.platform,
              platformId: track.platformId,
            },
          })),
        },
      },
      include: {
        tracks: true,
        sourcePlaylist: true,
      },
    });
  }
}
