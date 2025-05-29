import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Platform } from '@prisma/client';

@Injectable()
export class LoadTrackPlatformByPlatformIdRepository {
  constructor(private readonly prisma: PrismaService) {}

  async load(platform: Platform, platformIds: string[]) {
    return this.prisma.trackPlatform.findMany({
      where: {
        platform,
        track: { isEnriched: true },
        platformId: {
          in: platformIds,
        },
      },
      include: {
        track: true,
      },
    });
  }
}
