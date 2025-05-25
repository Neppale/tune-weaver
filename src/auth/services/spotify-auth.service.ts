import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SpotifyAuthService {
  private accessToken: string | null = null;
  private readonly baseUrl = 'https://api.spotify.com/v1';
  private readonly logger = new Logger(SpotifyAuthService.name);

  constructor() {
    this.initializeClientCredentials();
  }

  private async initializeClientCredentials() {
    try {
      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        new URLSearchParams({
          grant_type: 'client_credentials',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(
              `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
            ).toString('base64')}`,
          },
        },
      );

      this.accessToken = response.data.access_token;
    } catch (error) {
      this.logger.error('Failed to initialize client credentials:', error);
      throw error;
    }
  }

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  getAuthorizationUrl(): string {
    const params = new URLSearchParams({
      client_id: process.env.SPOTIFY_CLIENT_ID,
      response_type: 'code',
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      scope: [
        'playlist-read-private',
        'playlist-read-collaborative',
        'user-read-private',
        'user-read-email',
      ].join(' '),
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  async getAccessToken(): Promise<string> {
    if (!this.accessToken) {
      await this.initializeClientCredentials();
    }
    return this.accessToken;
  }

  async makeRequest<T>(endpoint: string, options: any = {}): Promise<T> {
    const token = await this.getAccessToken();

    try {
      const response = await axios({
        ...options,
        url: `${this.baseUrl}${endpoint}`,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        await this.initializeClientCredentials();
        return this.makeRequest(endpoint, options);
      }
      throw error;
    }
  }
}
