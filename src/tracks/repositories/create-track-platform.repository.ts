import { Injectable } from '@nestjs/common';
import { PrismaService } from '@Prisma/prisma.service';
import { TrackPlatform } from '@prisma/client';
import { generateId } from '@Utils/id-generator.util';
import { CreateTrackPlatformParams } from '@Tracks/interfaces/create-track-platform-params';

@Injectable()
export class CreateTrackPlatformRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTrackPlatformParams): Promise<TrackPlatform> {
    return this.prisma.trackPlatform.create({
      data: {
        id: generateId(),
        track: {
          connect: { id: data.trackId },
        },
        platform: data.platform,
        platformId: data.platformId,
      },
    });
  }
}
