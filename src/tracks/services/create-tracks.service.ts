import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from '../dtos/create-track.dto';
import { TrackAlreadyExistsValidator } from '../validators/track-already-exists.validator';
import { ValidatePlaylistTracksValidator } from '../validators/validate-playlist-tracks.validator';
import { CreateTrackRepository } from '../repositories/create-track.repository';
import { CreateTracksResult } from '../interfaces/create-tracks-result.interface';

@Injectable()
export class CreateTracksService {
  constructor(
    private readonly trackAlreadyExistsValidator: TrackAlreadyExistsValidator,
    private readonly validatePlaylistTracksValidator: ValidatePlaylistTracksValidator,
    private readonly createTrackRepository: CreateTrackRepository,
  ) {}

  async create(tracks: CreateTrackDto[]): Promise<CreateTracksResult> {
    // Create new tracks
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
