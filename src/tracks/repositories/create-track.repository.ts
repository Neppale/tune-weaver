import { Injectable } from '@nestjs/common';
import { PrismaService } from '@Prisma/prisma.service';
import { CreateTrackDto } from '@Tracks/dtos/create-track.dto';

@Injectable()
export class CreateTrackRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(track: CreateTrackDto) {
    return this.prisma.track.create({
      data: {
        name: track.name,
        artist: track.artist,
        album: track.album,
        duration: track.duration,
        platforms: {
          create: {
            platform: track.platform,
            platformId: track.platformId,
          },
        },
      },
      include: {
        platforms: true,
      },
    });
  }

  async createMany(tracks: CreateTrackDto[]) {
    return this.prisma.$transaction(
      tracks.map((track) =>
        this.prisma.track.create({
          data: {
            name: track.name,
            artist: track.artist,
            album: track.album,
            duration: track.duration,
            platforms: {
              create: {
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
