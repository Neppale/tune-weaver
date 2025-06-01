import { Injectable } from '@nestjs/common';
import { PrismaService } from '@Prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { SearchTracksDto } from '@Tracks/models/dtos/search-tracks.dto';
import { SearchTracksResult } from '@Tracks/models/search-tracks.result';

@Injectable()
export class SearchTracksRepository {
  constructor(private readonly prisma: PrismaService) {}

  async search({
    search,
    page,
    size,
  }: SearchTracksDto): Promise<SearchTracksResult> {
    const where: Prisma.TrackWhereInput = {
      OR: [
        {
          name: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          artist: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        },
      ],
    };

    const [tracks, total] = await Promise.all([
      this.prisma.track.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        include: {
          platforms: {
            select: {
              platform: true,
              platformId: true,
            },
          },
        },
        orderBy: {
          playlists: {
            _count: 'desc',
          },
        },
      }),
      this.prisma.track.count({ where }),
    ]);

    return {
      tracks,
      total,
    };
  }
}
