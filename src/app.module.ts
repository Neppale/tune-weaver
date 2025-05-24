import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PlaylistModule } from './playlists/playlist.module';
import { AuthModule } from './auth/auth.module';
import { TrackModule } from './tracks/track.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    TrackModule,
    PlaylistModule,
  ],
})
export class AppModule {}
