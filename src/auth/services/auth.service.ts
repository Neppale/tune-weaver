import { Injectable } from '@nestjs/common';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import {
  Platform,
  PlatformNotSupportedException,
} from '../../exceptions/auth.exception';

export interface PlatformAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  platform: Platform;
}

@Injectable()
export class AuthService {
  private platformConfigs: Map<Platform, PlatformAuthConfig> = new Map();
  private platformApis: Map<Platform, any> = new Map();

  constructor() {
    // Initialize Spotify
    if (process.env.SPOTIFY_CLIENT_ID) {
      this.platformConfigs.set(Platform.SPOTIFY, {
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        redirectUri: process.env.SPOTIFY_REDIRECT_URI,
      });
      this.platformApis.set(
        Platform.SPOTIFY,
        SpotifyApi.withClientCredentials(
          this.platformConfigs.get(Platform.SPOTIFY).clientId,
          this.platformConfigs.get(Platform.SPOTIFY).clientSecret,
        ),
      );
    }

    // Add other platforms here as they are implemented
    // Example:
    // if (process.env.SOUNDCLOUD_CLIENT_ID) {
    //   this.platformConfigs.set(Platform.SOUNDCLOUD, {...});
    //   this.platformApis.set(Platform.SOUNDCLOUD, new SoundCloudAPI(...));
    // }
  }

  getAuthUrl(platform: Platform): string {
    const api = this.platformApis.get(platform);
    if (!api) {
      throw new PlatformNotSupportedException(platform);
    }

    switch (platform) {
      case Platform.SPOTIFY:
        const scopes = [
          'playlist-read-private',
          'playlist-read-collaborative',
          'user-read-private',
          'user-read-email',
        ];
        return api.createAuthorizeURL(scopes, 'state');
      // Add other platforms here
      // case Platform.SOUNDCLOUD:
      //   return api.getAuthUrl();
      default:
        throw new PlatformNotSupportedException(platform);
    }
  }

  async getAccessToken(platform: Platform, code: string): Promise<AuthTokens> {
    const api = this.platformApis.get(platform);
    if (!api) {
      throw new PlatformNotSupportedException(platform);
    }

    switch (platform) {
      case Platform.SPOTIFY: {
        const data = await api.authorizationCodeGrant(code);
        return {
          accessToken: data.body.access_token,
          refreshToken: data.body.refresh_token,
          expiresIn: data.body.expires_in,
          platform,
        };
      }
      // Add other platforms here
      // case Platform.SOUNDCLOUD: {
      //   const data = await api.getAccessToken(code);
      //   return {
      //     accessToken: data.access_token,
      //     expiresIn: data.expires_in,
      //     platform,
      //   };
      // }
      default:
        throw new PlatformNotSupportedException(platform);
    }
  }

  async refreshAccessToken(
    platform: Platform,
    refreshToken: string,
  ): Promise<AuthTokens> {
    const api = this.platformApis.get(platform);
    if (!api) {
      throw new PlatformNotSupportedException(platform);
    }

    switch (platform) {
      case Platform.SPOTIFY: {
        api.setRefreshToken(refreshToken);
        const data = await api.refreshAccessToken();
        return {
          accessToken: data.body.access_token,
          expiresIn: data.body.expires_in,
          platform,
        };
      }
      // Add other platforms here
      // case Platform.SOUNDCLOUD: {
      //   const data = await api.refreshToken(refreshToken);
      //   return {
      //     accessToken: data.access_token,
      //     expiresIn: data.expires_in,
      //     platform,
      //   };
      // }
      default:
        throw new PlatformNotSupportedException(platform);
    }
  }
}
