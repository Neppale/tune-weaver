import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Playlist } from '@prisma/client';
import { CreatePlaylistDto } from '../dtos/playlist.dto';

@Injectable()
export class CreatePlaylistRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePlaylistDto): Promise<Playlist> {
    return this.prisma.playlist.create({
      data: {
        name: data.name,
        type: data.type,
        value: data.value,
        user: {
          connect: { id: data.userId },
        },
        ...(data.tracks && {
          tracks: {
            create: data.tracks.map((track) => ({
              platform: track.platform,
              platformId: track.platformId,
            })),
          },
        }),
        ...(data.sourcePlaylist && {
          sourcePlaylist: {
            connectOrCreate: {
              where: {
                platform_platformId: {
                  platform: data.sourcePlaylist.platform,
                  platformId: data.sourcePlaylist.platformId,
                },
              },
              create: {
                platform: data.sourcePlaylist.platform,
                platformId: data.sourcePlaylist.platformId,
              },
            },
          },
        }),
      },
      include: {
        tracks: true,
        sourcePlaylist: true,
      },
    });
  }
}
