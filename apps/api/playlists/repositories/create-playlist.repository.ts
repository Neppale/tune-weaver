import { Injectable } from '@nestjs/common';
import { PrismaService } from '@Prisma/prisma.service';
import { Playlist } from '@prisma/client';
import { CreatePlaylistDto } from '@Playlists/models/dtos/create-playlist.dto';
import { generateId } from '@Utils/id-generator.util';

@Injectable()
export class CreatePlaylistRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePlaylistDto): Promise<Playlist> {
    const id = generateId();
    return await this.prisma.playlist.create({
      data: {
        id,
        name: data.name,
        userId: data.userId,
        sourcePlaylist: data.sourcePlaylistId
          ? {
              connect: { id: data.sourcePlaylistId },
            }
          : undefined,
      },
    });
  }
}
