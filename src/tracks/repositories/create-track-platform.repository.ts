import { Injectable } from '@nestjs/common';
import { PrismaService } from '@Prisma/prisma.service';
import { TrackPlatform, Platform } from '@prisma/client';
import { generateId } from '@Utils/id-generator.util';

interface CreateTrackPlatformParams {
  trackId: string;
  platform: Platform;
  platformId: string;
  existingTrackId?: string;
}

@Injectable()
export class CreateTrackPlatformRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(params: CreateTrackPlatformParams): Promise<TrackPlatform> {
    return this.prisma.$transaction(async (tx) => {
      const trackPlatform = await tx.trackPlatform.create({
        data: {
          id: generateId(),
          trackId: params.trackId,
          platform: params.platform,
          platformId: params.platformId,
        },
      });

      if (params.existingTrackId) {
        await tx.track.delete({
          where: { id: params.existingTrackId },
        });
      }

      return trackPlatform;
    });
  }
}
