import { Injectable } from '@nestjs/common';
import YTMusic from 'ytmusic-api';

@Injectable()
export class YoutubeMusicAuthService {
  private ytmusic: YTMusic;

  constructor() {
    this.ytmusic = new YTMusic();
    this.initialize();
  }

  async initialize() {
    try {
      await this.ytmusic.initialize();
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
