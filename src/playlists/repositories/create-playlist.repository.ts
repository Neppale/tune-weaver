import { Injectable } from '@nestjs/common';
import { PrismaService } from '@Prisma/prisma.service';
import { Playlist } from '@prisma/client';
import { CreatePlaylistDto } from '@Playlists/dtos/create-playlist.dto';

@Injectable()
export class CreatePlaylistRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePlaylistDto): Promise<Playlist> {
    return this.prisma.$transaction(async (tx) => {
      const playlist = await tx.playlist.create({
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

      if (data.existingTrackIds?.length > 0) {
        await tx.playlistTrack.createMany({
          data: data.existingTrackIds.map((trackId) => ({
            playlistId: playlist.id,
            trackId,
          })),
        });
      }

      return playlist;
    });
  }
}
