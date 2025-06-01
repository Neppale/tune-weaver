import { Injectable } from '@nestjs/common';
import { PrismaService } from '@Prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { LoadPlaylistTracksDto } from '@Playlists/models/dtos/load-playlist-tracks.dto';
import { LoadPlaylistTracksResult } from '@Playlists/models/load-playlist-tracks.result';

@Injectable()
export class LoadPlaylistTracksRepository {
  constructor(private readonly prisma: PrismaService) {}

  async load(
    playlistId: string,
    { search, page, size }: LoadPlaylistTracksDto,
  ): Promise<LoadPlaylistTracksResult> {
    const where: Prisma.TrackWhereInput = {
      playlists: {
        some: {
          playlistId,
        },
      },
      ...(search
        ? {
            OR: [
              {
                artist: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                album: { contains: search, mode: Prisma.QueryMode.insensitive },
              },
            ],
          }
        : {}),
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
          createdAt: 'asc',
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
