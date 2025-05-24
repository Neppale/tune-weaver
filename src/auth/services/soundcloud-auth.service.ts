import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SoundCloudAuthService {
  private accessToken: string | null = null;
  private readonly baseUrl = 'https://api.soundcloud.com';

  constructor() {
    // Initialize with client credentials for public endpoints
    this.initializeClientCredentials();
  }

  private async initializeClientCredentials() {
    try {
      const response = await axios.post(
        'https://api.soundcloud.com/oauth2/token',
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: process.env.SOUNDCLOUD_CLIENT_ID,
          client_secret: process.env.SOUNDCLOUD_CLIENT_SECRET,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      this.accessToken = response.data.access_token;
    } catch (error) {
      console.error('Failed to initialize client credentials:', error);
      throw error;
    }
  }

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  getAuthorizationUrl(): string {
    const params = new URLSearchParams({
      client_id: process.env.SOUNDCLOUD_CLIENT_ID,
      response_type: 'code',
      redirect_uri: process.env.SOUNDCLOUD_REDIRECT_URI,
      scope: ['non-expiring', 'playlist-read', 'playlist-write'].join(' '),
    });

    return `https://soundcloud.com/connect?${params.toString()}`;
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
          Authorization: `OAuth ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        // Token might be expired, try to refresh
        await this.initializeClientCredentials();
        // Retry the request with new token
        return this.makeRequest(endpoint, options);
      }
      throw error;
    }
  }
}
