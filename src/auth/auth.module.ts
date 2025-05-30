import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { SpotifyAuthService } from './services/spotify-auth.service';
import { YoutubeMusicAuthService } from './services/youtube-music-auth.service';
import { PrismaModule } from '@Prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, SpotifyAuthService, YoutubeMusicAuthService],
  exports: [SpotifyAuthService, YoutubeMusicAuthService],
})
export class AuthModule {}
