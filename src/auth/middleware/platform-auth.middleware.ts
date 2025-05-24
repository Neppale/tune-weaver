import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SpotifyAuthService } from '../services/spotify-auth.service';
import { YoutubeMusicAuthService } from '../services/youtube-music-auth.service';

@Injectable()
export class PlatformAuthMiddleware implements NestMiddleware {
  constructor(
    private readonly spotifyAuthService: SpotifyAuthService,
    private readonly youtubeMusicAuthService: YoutubeMusicAuthService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const platform = req.headers['x-platform'] as string;
    const auth = req.headers.authorization;

    if (!platform || !auth) {
      return next();
    }

    try {
      switch (platform.toLowerCase()) {
        case 'spotify':
          this.spotifyAuthService.setAccessToken(auth);
          break;
        case 'youtube-music':
          await this.youtubeMusicAuthService.initialize();
          break;
      }
    } catch (error) {
      console.error(`Failed to authenticate with ${platform}:`, error);
    }

    next();
  }
}
