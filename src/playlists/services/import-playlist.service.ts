import { Injectable, Logger } from '@nestjs/common';
import { Platform } from '@prisma/client';
import { ImportPlaylistDto } from '../dtos/import-playlist.dto';
import { FetchYoutubeMusicPlaylistService } from './youtube-music/fetch-youtube-music-playlist.service';
import { FetchSpotifyPlaylistService } from './spotify/fetch-spotify-playlist.service';
import { CreatePlaylistService } from './create-playlist.service';
import { CreatePlaylistDto } from '../dtos/create-playlist.dto';
import { ImportedPlaylist } from '../models/imported-playlist.model';
import { PlatformNotSupportedException } from '@Exceptions/auth.exception';
import { AddTracksToPlaylistService } from './add-tracks-to-playlist.service';

@Injectable()
export class ImportPlaylistService {
  private readonly logger = new Logger(ImportPlaylistService.name);

  constructor(
    private readonly fetchYoutubeMusicPlaylistService: FetchYoutubeMusicPlaylistService,
    private readonly fetchSpotifyPlaylistService: FetchSpotifyPlaylistService,
    private readonly createPlaylistService: CreatePlaylistService,
    private readonly addTracksToPlaylistService: AddTracksToPlaylistService,
  ) {}

  async import(data: ImportPlaylistDto) {
    this.logger.log(
      `Importing playlist from ${data.platform} with id ${data.platformId} for user ${data.userId}`,
    );

    let playlist: ImportedPlaylist;
    switch (data.platform) {
      case Platform.YOUTUBE_MUSIC:
        playlist = await this.fetchYoutubeMusicPlaylistService.fetch(
          data.platformId,
        );
        break;
      case Platform.SPOTIFY:
        playlist = await this.fetchSpotifyPlaylistService.fetch(
          data.platformId,
        );
        break;
      default:
        throw new PlatformNotSupportedException(data.platform);
    }
    const createPlaylistDto: CreatePlaylistDto = {
      name: playlist.name,
      userId: data.userId,
    };

    const createdPlaylist =
      await this.createPlaylistService.create(createPlaylistDto);

    await this.addTracksToPlaylistService.add(createdPlaylist.id, {
      tracks: playlist.trackIds.map((trackId) => ({
        platformId: trackId,
        platform: playlist.platform,
      })),
    });

    return createdPlaylist;
  }
}
