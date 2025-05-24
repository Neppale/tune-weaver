import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Platform } from '@prisma/client';

interface CreateTrackPlatformDto {
  trackId: string;
  platform: Platform;
  platformId: string;
}

@Injectable()
export class CreateTrackPlatformRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTrackPlatformDto) {
    return this.prisma.trackPlatform.create({
      data: {
        track: {
          connect: { id: data.trackId },
        },
        platform: data.platform,
        platformId: data.platformId,
      },
    });
  }
}
