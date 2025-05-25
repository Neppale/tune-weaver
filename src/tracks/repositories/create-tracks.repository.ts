import { Injectable } from '@nestjs/common';
import { PrismaService } from '@Prisma/prisma.service';
import { CreateTrackDto } from '@Tracks/dtos/create-track.dto';
import { generateId } from '@Utils/id-generator.util';

@Injectable()
export class CreateTracksRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tracks: CreateTrackDto[]) {
    return this.prisma.$transaction(
      tracks.map((track) =>
        this.prisma.track.create({
          data: {
            id: generateId(),
            name: track.name,
            artist: track.artist,
            album: track.album,
            duration: track.duration,
            platforms: {
              create: {
                id: generateId(),
                platform: track.platform,
                platformId: track.platformId,
              },
            },
          },
          include: {
            platforms: true,
          },
        }),
      ),
    );
  }
}
