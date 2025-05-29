import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@Prisma/prisma.service';
import { Playlist } from '@prisma/client';
import { CreatePlaylistDto } from '@Playlists/dtos/create-playlist.dto';
import { generateId } from '@Utils/id-generator.util';

@Injectable()
export class CreatePlaylistRepository {
  private readonly logger = new Logger(CreatePlaylistRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePlaylistDto): Promise<Playlist> {
    const id = generateId();
    return await this.prisma.playlist.create({
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
    });
  }
}
