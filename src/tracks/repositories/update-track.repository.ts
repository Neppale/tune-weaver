import { Injectable } from '@nestjs/common';
import { PrismaService } from '@Prisma/prisma.service';
import { Track } from '@prisma/client';
import { UpdateTrackDataParams } from '@Tracks/interfaces/update-track-data.params';

@Injectable()
export class UpdateTrackRepository {
  constructor(private readonly prisma: PrismaService) {}

  async update(trackId: string, data: UpdateTrackDataParams): Promise<Track> {
    return this.prisma.track.update({
      where: { id: trackId },
      data,
    });
  }
}
