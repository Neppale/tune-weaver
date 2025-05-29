import { Injectable } from '@nestjs/common';
import { PrismaService } from '@Prisma/prisma.service';
import { Playlist } from '@prisma/client';
import { CreatePlaylistDto } from '@Playlists/dtos/create-playlist.dto';
import { generateId } from '@Utils/id-generator.util';

@Injectable()
export class CreatePlaylistRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePlaylistDto): Promise<Playlist> {
    const id = generateId();
    this.prisma.$transaction(async (tx) => {
      const playlist = await tx.playlist.create({
        data: {
          id,
          name: data.name,
          sourcePlaylist: data.sourcePlaylistId
            ? {
                connect: { id: data.sourcePlaylistId },
              }
            : undefined,
          user: {
            connect: { id: data.userId },
          },
        },
        include: {
          tracks: true,
        },
      });

      if (data.existingTrackIds?.length > 0) {
        await tx.playlistTrack.createMany({
          data: data.existingTrackIds.map((trackId) => ({
            id: generateId(),
            playlistId: playlist.id,
            trackId,
          })),
        });
      }
    });

    const playlist = await this.prisma.playlist.findUnique({
      where: {
        id,
      },
    });

    return playlist;
  }
}
