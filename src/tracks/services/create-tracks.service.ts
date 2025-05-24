import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from '../dtos/create-track.dto';
import { CreateTracksResult } from '../interfaces/create-tracks-result.interface';
import { CreateTrackRepository } from '../repositories/create-track.repository';

@Injectable()
export class CreateTracksService {
  constructor(private readonly createTrackRepository: CreateTrackRepository) {}

  async create(tracks: CreateTrackDto[]): Promise<CreateTracksResult> {
    const newTracks = await this.createTrackRepository.createMany(tracks);

    return {
      existingTracks: [],
      newTracks: newTracks.map((track) => ({
        id: track.id,
        name: track.name,
        artist: track.artist,
        album: track.album,
        duration: track.duration,
        platforms: track.platforms.map((p) => ({
          platform: p.platform,
          platformId: p.platformId,
        })),
      })),
    };
  }
}
