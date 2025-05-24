import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { PlaylistController } from './playlist.controller';
import { GetSamplePlaylistsService } from './services/get-sample-playlists.service';
import { CreatePlaylistService } from './services/create-playlist.service';
import { PlatformAuthMiddleware } from '../auth/middleware/platform-auth.middleware';
import { TrackModule } from '../tracks/track.module';
import { CreatePlaylistRepository } from './repositories/create-playlist.repository';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CreateTrackPlatformRepository } from 'src/tracks/repositories/create-track-platform.repository';

@Module({
  imports: [TrackModule, AuthModule, PrismaModule],
  controllers: [PlaylistController],
  providers: [
    GetSamplePlaylistsService,
    CreatePlaylistService,
    CreatePlaylistRepository,
    CreateTrackPlatformRepository,
  ],
})
export class PlaylistModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PlatformAuthMiddleware).forRoutes('playlist');
  }
}
