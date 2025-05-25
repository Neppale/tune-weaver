import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTrackParams } from '@Tracks/dtos/create-track.params';
import { Track } from '@prisma/client';

interface ScoredTrack {
  track: any;
  score: number;
}

@Injectable()
export class FindTrackByMetadataRepository {
  constructor(private readonly prisma: PrismaService) {}

  async find(track: CreateTrackParams): Promise<Track | null> {
    const potentialMatches = await this.prisma.track.findMany({
      where: {
        AND: [
          {
            artist: {
              equals: track.artist,
              mode: 'insensitive',
            },
          },
          {
            name: {
              equals: track.name,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        platforms: true,
      },
    });

    const scoredTracks: ScoredTrack[] = potentialMatches.map(
      (potentialTrack) => {
        let score = 0;

        if (potentialTrack.album.toLowerCase() === track.album.toLowerCase()) {
          score += 40;
        } else if (
          potentialTrack.name
            .toLowerCase()
            .includes(track.name.toLowerCase()) ||
          track.name.toLowerCase().includes(potentialTrack.name.toLowerCase())
        ) {
          score += 20;
        }

        const durationDiff = Math.abs(potentialTrack.duration - track.duration);
        if (durationDiff === 0) {
          score += 30;
        } else if (durationDiff <= 5) {
          score += 20;
        } else if (durationDiff <= 10) {
          score += 10;
        }

        if (
          potentialTrack.artist.toLowerCase() === track.artist.toLowerCase()
        ) {
          score += 20;
        }

        if (
          potentialTrack.album?.toLowerCase() === track.album?.toLowerCase()
        ) {
          score += 10;
        }

        return {
          track: potentialTrack,
          score,
        };
      },
    );

    scoredTracks.sort((a, b) => b.score - a.score);

    const bestMatch = scoredTracks[0];
    const SCORE_THRESHOLD = 60;
    if (bestMatch && bestMatch.score >= SCORE_THRESHOLD) {
      return bestMatch.track;
    }

    return;
  }
}
