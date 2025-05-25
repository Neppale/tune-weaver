import { Injectable } from '@nestjs/common';
import { Platform } from '@prisma/client';
import { CreateTrackDto } from '@Tracks/dtos/create-track.dto';
import { LoadTrackPlatformByPlatformIdRepository } from '@Tracks/repositories/load-track-platform-by-platform-id.repository';

interface ValidationResult {
  existingTracks: {
    trackId: string;
    platform: Platform;
    platformId: string;
  }[];
  tracksToValidate: CreateTrackDto[];
}

@Injectable()
export class TrackAlreadyExistsValidator {
  constructor(
    private readonly loadTrackPlatformByPlatformIdRepository: LoadTrackPlatformByPlatformIdRepository,
  ) {}

  async validate(tracks: CreateTrackDto[]): Promise<ValidationResult> {
    const existingTracks: ValidationResult['existingTracks'] = [];
    const tracksToValidate: CreateTrackDto[] = [];

    const tracksByPlatform = tracks.reduce<Record<Platform, CreateTrackDto[]>>(
      (acc, track) => {
        if (!acc[track.platform]) {
          acc[track.platform] = [];
        }
        acc[track.platform].push(track);
        return acc;
      },
      {} as Record<Platform, CreateTrackDto[]>,
    );

    for (const [platform, platformTracks] of Object.entries(tracksByPlatform)) {
      const platformIds = platformTracks.map((track) => track.platformId);

      const existingPlatformTracks =
        await this.loadTrackPlatformByPlatformIdRepository.load(
          platform as Platform,
          platformIds,
        );

      const existingIds = new Set(
        existingPlatformTracks.map((t) => t.platformId),
      );

      platformTracks.forEach((track) => {
        if (existingIds.has(track.platformId)) {
          const existingTrack = existingPlatformTracks.find(
            (existing) => existing.platformId === track.platformId,
          );
          if (existingTrack) {
            existingTracks.push({
              trackId: existingTrack.track.id,
              platform: track.platform,
              platformId: track.platformId,
            });
          }
        } else {
          tracksToValidate.push(track);
        }
      });
    }

    return {
      existingTracks,
      tracksToValidate,
    };
  }
}
