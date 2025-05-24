import { Injectable } from '@nestjs/common';
import { CreatePlaylistRepository } from '../repositories/create-playlist.repository';
import { CreatePlaylistDto } from '../dtos/create-playlist.dto';
import { ValidatePlaylistTracksValidator } from 'src/tracks/validators/validate-playlist-tracks.validator';

@Injectable()
export class CreatePlaylistService {
  constructor(
    private readonly createPlaylistRepository: CreatePlaylistRepository,
    private readonly validatePlaylistTracksValidator: ValidatePlaylistTracksValidator,
  ) {}

  async create(data: CreatePlaylistDto) {
    await this.validatePlaylistTracksValidator.validate(data.tracks);
    return await this.createPlaylistRepository.create(data);
  }
}
