import { Injectable } from '@nestjs/common';
import { PrismaService } from '@Prisma/prisma.service';
import { Track } from '@prisma/client';

interface UpdateTrackData {
  name: string;
  artist: string;
  album?: string;
  duration: number;
  isEnriched: boolean;
}

@Injectable()
export class UpdateTrackRepository {
  constructor(private readonly prisma: PrismaService) {}

  async update(trackId: string, data: UpdateTrackData): Promise<Track> {
    return this.prisma.track.update({
      where: { id: trackId },
      data,
    });
  }
}
