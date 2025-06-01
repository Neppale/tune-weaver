import { Injectable, Logger } from '@nestjs/common';
import { CreatePlaylistRepository } from '@Playlists/repositories/create-playlist.repository';
import { CreatePlaylistDto } from '@Playlists/models/dtos/create-playlist.dto';
import { Playlist } from '@prisma/client';

@Injectable()
export class CreatePlaylistService {
  private readonly logger = new Logger(CreatePlaylistService.name);

  constructor(
    private readonly createPlaylistRepository: CreatePlaylistRepository,
  ) {}

  async create(data: CreatePlaylistDto): Promise<Playlist> {
    this.logger.log(`Creating playlist ${data.name} for user ${data.userId}`);
    return await this.createPlaylistRepository.create(data);
  }
}
