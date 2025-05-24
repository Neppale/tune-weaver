import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTrackDto } from '../dtos/create-track.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class FindTracksByMetadataRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findSimilarTracks(track: CreateTrackDto) {
    const whereConditions: Prisma.TrackWhereInput[] = [
      { name: { equals: track.name, mode: 'insensitive' } },
      { artist: { equals: track.artist, mode: 'insensitive' } },
      { duration: track.duration },
    ];

    if (track.album) {
      whereConditions.push({
        album: { equals: track.album, mode: 'insensitive' },
      });
    }

    return this.prisma.track.findMany({
      where: {
        AND: whereConditions,
      },
      include: {
        platforms: true,
      },
    });
  }
}
