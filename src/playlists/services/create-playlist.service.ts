import { Injectable } from '@nestjs/common';
import { CreatePlaylistRepository } from '../repositories/create-playlist.repository';
import { CreatePlaylistDto } from '../dtos/create-playlist.dto';

@Injectable()
export class CreatePlaylistService {
  constructor(
    private readonly createPlaylistRepository: CreatePlaylistRepository,
  ) {}

  async create(data: CreatePlaylistDto) {
    return await this.createPlaylistRepository.create(data);
  }
}
