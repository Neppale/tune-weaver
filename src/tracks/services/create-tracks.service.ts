import { Injectable } from '@nestjs/common';
import { CreateTrackRepository } from '../repositories/create-track.repository';
import { CreateTrackDto } from '../dtos/create-track.dto';
import { Track, TrackPlatform } from '@prisma/client';

@Injectable()
export class CreateTracksService {
  constructor(private readonly createTrackRepository: CreateTrackRepository) {}

  async create(
    tracks: CreateTrackDto[],
  ): Promise<{ newTracks: Track[]; newTrackPlatforms: TrackPlatform[] }> {
    const createdTracks = await this.createTrackRepository.createMany(tracks);

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
