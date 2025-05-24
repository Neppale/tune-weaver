import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../services/prisma.service';
import { ICreatePlaylistRepository } from '../../interfaces/playlist.repository.interface';
import { Playlist } from '@prisma/client';
import { CreatePlaylistDto } from '../../dtos/playlist.dto';

@Injectable()
export class CreatePlaylistRepository implements ICreatePlaylistRepository {
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
            create: {
              platform: data.sourcePlaylist.platform,
              platformId: data.sourcePlaylist.platformId,
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
