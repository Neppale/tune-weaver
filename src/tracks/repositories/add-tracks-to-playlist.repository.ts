import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Playlist } from '@prisma/client';
import { AddTracksDto } from '../../playlists/dtos/playlist.dto';

@Injectable()
export class AddTracksToPlaylistRepository {
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
