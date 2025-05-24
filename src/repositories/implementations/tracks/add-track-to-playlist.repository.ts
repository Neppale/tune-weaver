import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { IAddTrackToPlaylistRepository } from '../interfaces/playlist.repository.interface';
import { Playlist } from '@prisma/client';
import { AddTrackDto } from '../dtos/playlist.dto';

@Injectable()
export class AddTrackToPlaylistRepository
  implements IAddTrackToPlaylistRepository
{
  constructor(private prisma: PrismaService) {}

  async addTrack(playlistId: string, track: AddTrackDto): Promise<Playlist> {
    return this.prisma.playlist.update({
      where: { id: playlistId },
      data: {
        tracks: {
          create: {
            platform: track.platform,
            platformId: track.platformId,
          },
        },
      },
      include: {
        tracks: true,
        sourcePlaylist: true,
      },
    });
  }
}
