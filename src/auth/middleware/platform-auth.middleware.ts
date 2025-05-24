import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Platform } from '@prisma/client';
import { SpotifyAuthService } from '../services/spotify-auth.service';
import { YoutubeMusicAuthService } from '../services/youtube-music-auth.service';

@Injectable()
export class PlatformAuthMiddleware implements NestMiddleware {
  constructor(
    private readonly spotifyAuthService: SpotifyAuthService,
    private readonly youtubeMusicAuthService: YoutubeMusicAuthService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const platform = req.query.platform as Platform;
    const auth = req.headers.authorization;

    try {
      if (!platform) {
        // If no platform is specified, try to authenticate with all platforms
        this.spotifyAuthService.setAccessToken(auth);
        await this.youtubeMusicAuthService.initialize();
      } else {
        // If platform is specified, authenticate only with that platform
        switch (platform) {
          case Platform.SPOTIFY:
            this.spotifyAuthService.setAccessToken(auth);
            break;
          case Platform.YOUTUBE_MUSIC:
            await this.youtubeMusicAuthService.initialize();
            break;
        }
      }
    } catch (error) {
      console.error(
        `Failed to authenticate with ${platform || 'all platforms'}:`,
        error,
      );
    }

    next();
  }
}
