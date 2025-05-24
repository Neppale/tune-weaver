import { Injectable } from '@nestjs/common';
import { Platform } from '@prisma/client';
import { CreatePlaylistRepository } from './repositories/create-playlist.repository';

interface PlatformData {
  platformId: string;
  platform: Platform;
}

interface TrackData {
  platformId: string;
  platform: Platform;
}

@Injectable()
export class CreatePlaylistService {
  constructor(
    private readonly createPlaylistRepository: CreatePlaylistRepository,
  ) {}

  async create(
    name: string,
    tracks: TrackData[] = [],
    userId: string,
    platformData?: PlatformData,
  ) {
    // Create main playlist in database
    const playlist = await this.createPlaylistRepository.create({
      name,
      type: 'custom',
      value: name,
      userId,
      sourcePlaylist: platformData
        ? {
            platform: platformData.platform,
            platformId: platformData.platformId,
          }
        : undefined,
      tracks,
    });

    return playlist;
  }
}
