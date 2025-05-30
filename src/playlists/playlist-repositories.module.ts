import { Module } from '@nestjs/common';
import { CreatePlaylistRepository } from './repositories/create-playlist.repository';
import { DeletePlaylistRepository } from './repositories/delete-playlist.repository';
import { LoadPlaylistDataByIdRepository } from './repositories/load-playlist-data-by-id.repository';
import { LoadPlaylistTracksRepository } from './repositories/load-playlist-tracks.repository';
import { AddTracksToPlaylistRepository } from './repositories/add-tracks-to-playlist.repository';
import { DeleteTracksFromPlaylistRepository } from './repositories/delete-tracks-from-playlist.repository';
import { PrismaModule } from '@Prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    CreatePlaylistRepository,
    DeletePlaylistRepository,
    LoadPlaylistDataByIdRepository,
    LoadPlaylistTracksRepository,
    AddTracksToPlaylistRepository,
    DeleteTracksFromPlaylistRepository,
  ],
  exports: [
    CreatePlaylistRepository,
    DeletePlaylistRepository,
    LoadPlaylistDataByIdRepository,
    LoadPlaylistTracksRepository,
    AddTracksToPlaylistRepository,
    DeleteTracksFromPlaylistRepository,
  ],
})
export class PlaylistRepositoriesModule {}
