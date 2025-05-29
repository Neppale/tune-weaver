import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { PlaylistController } from './playlist.controller';
import { GetSamplePlaylistsService } from './services/get-sample-playlists.service';
import { CreatePlaylistService } from './services/create-playlist.service';
import { PlatformAuthMiddleware } from '@Auth/middleware/platform-auth.middleware';
import { TrackModule } from '@Tracks/track.module';
import { CreatePlaylistRepository } from './repositories/create-playlist.repository';
import { AuthModule } from '@Auth/auth.module';
import { PrismaModule } from '@Prisma/prisma.module';
import { CreateTrackPlatformRepository } from '@Tracks/repositories/create-track-platform.repository';
import { QueueModule } from '@Queue/queue.module';
import { LoadPlaylistDataService } from './services/load-playlist-data.service';
import { LoadPlaylistDataRepository } from './repositories/load-playlist-data.repository';
import { LoadPlaylistTracksService } from './services/load-playlist-tracks.service';
import { LoadPlaylistTracksRepository } from './repositories/load-playlist-tracks.repository';

@Module({
  imports: [TrackModule, AuthModule, PrismaModule, QueueModule],
  controllers: [PlaylistController],
  providers: [
    GetSamplePlaylistsService,
    CreatePlaylistService,
    CreatePlaylistRepository,
    CreateTrackPlatformRepository,
    LoadPlaylistDataService,
    LoadPlaylistDataRepository,
    LoadPlaylistTracksService,
    LoadPlaylistTracksRepository,
  ],
})
export class PlaylistModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PlatformAuthMiddleware).forRoutes('playlist');
  }
}
