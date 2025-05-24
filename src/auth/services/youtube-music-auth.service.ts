import { Injectable } from '@nestjs/common';
import YTMusic from 'ytmusic-api';

@Injectable()
export class YoutubeMusicAuthService {
  private ytmusic: YTMusic;

  constructor() {
    this.ytmusic = new YTMusic();
  }

  async initialize() {
    try {
      await this.ytmusic.initialize({
        cookies:
          'CONSENT=YES+1; _ga=GA1.2.1234567890.1234567890; _gid=GA1.2.1234567890.1234567890; _ga_1234567890=GA1.2.1234567890.1234567890.1234567890.1234567890; _ga_1234567890=GA1.2.1234567890.1234567890.1234567890.1234567890',
      });
    } catch (error) {
      console.error('Failed to initialize YouTube Music:', error);
      throw error;
    }
  }

  async getTrack(trackId: string) {
    return this.ytmusic.getSong(trackId);
  }

  async getPlaylist(playlistId: string) {
    return this.ytmusic.getPlaylistVideos(playlistId);
  }

  async getArtist(artistId: string) {
    return this.ytmusic.getArtist(artistId);
  }
}
