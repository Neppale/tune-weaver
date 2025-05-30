import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiTrackModule } from '@Tracks/api-track.module';
import { ApiPlaylistModule } from '@Playlists/api-playlist.module';
import { AuthModule } from '@Auth/auth.module';
import { PrismaModule } from '@Prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    ApiTrackModule,
    ApiPlaylistModule,
  ],
})
export class ApiModule {}
