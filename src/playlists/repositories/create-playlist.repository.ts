import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Playlist } from '@prisma/client';
import { CreatePlaylistDto } from 'src/playlists/dtos/create-playlist.dto';

@Injectable()
export class CreatePlaylistRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePlaylistDto): Promise<Playlist> {
    const playlist = await this.prisma.playlist.create({
      data: {
        name: data.name,
        user: {
          connect: { id: data.userId },
        },
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

    await this.prisma.playlistTrack.createMany({
      data: data.existingTrackIds.map((trackId) => ({
        playlistId: playlist.id,
        trackId,
      })),
    });

    return playlist;
  }
}
