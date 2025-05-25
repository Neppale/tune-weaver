import { Injectable } from '@nestjs/common';
import { CreateTrackParams } from '@Tracks/dtos/create-track.params';
import { Track, TrackPlatform } from '@prisma/client';
import { CreateTracksRepository } from '@Tracks/repositories/create-tracks.repository';

@Injectable()
export class CreateTracksService {
  constructor(
    private readonly createTracksRepository: CreateTracksRepository,
  ) {}

  async create(
    tracks: CreateTrackParams[],
  ): Promise<{ newTracks: Track[]; newTrackPlatforms: TrackPlatform[] }> {
    const createdTracks = await this.createTracksRepository.create(tracks);

    return {
      newTracks: createdTracks.map((track) => ({
        id: track.id,
        name: track.name,
        artist: track.artist,
        album: track.album,
        duration: track.duration,
        createdAt: track.createdAt,
        updatedAt: track.updatedAt,
      })),
      newTrackPlatforms: createdTracks.flatMap((track) => track.platforms),
    };
  }
}
