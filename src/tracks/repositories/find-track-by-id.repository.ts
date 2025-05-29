import { Injectable } from '@nestjs/common';
import { PrismaService } from '@Prisma/prisma.service';
import { Track, Platform, TrackPlatform } from '@prisma/client';

@Injectable()
export class FindTrackByIdRepository {
  constructor(private readonly prisma: PrismaService) {}

  async find(
    id: string,
    platform: Platform,
  ): Promise<Track & { platforms: TrackPlatform[] }> {
    return this.prisma.track.findUnique({
      where: { id },
      include: { platforms: { where: { platform } } },
    });
  }
}
