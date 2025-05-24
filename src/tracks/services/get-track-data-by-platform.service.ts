import { Injectable } from '@nestjs/common';
import { Platform } from '@prisma/client';
import { GetSpotifyTrackDataByTrackIdService } from './get-spotify-track-data-by-track-id.service';
import { GetYouTubeMusicTrackDataByTrackIdService } from './get-youtube-music-track-data-by-track-id.service';
import { TrackData } from '../interfaces/track-data.interface';

@Injectable()
export class GetTrackDataByPlatformService {
  constructor(
    private readonly getSpotifyTrackDataByTrackIdService: GetSpotifyTrackDataByTrackIdService,
    private readonly getYouTubeMusicTrackDataByTrackIdService: GetYouTubeMusicTrackDataByTrackIdService,
  ) {}

  async get(platform: Platform, trackIds: string[]): Promise<TrackData[]> {
    switch (platform) {
      case Platform.SPOTIFY:
        const spotifyTracks =
          await this.getSpotifyTrackDataByTrackIdService.get(trackIds);
        return spotifyTracks.map((track) => ({
          id: track.id,
          name: track.name,
          artists: track.artists,
          album: track.album,
          duration: track.duration_ms / 1000, // Convert to seconds
        }));
      case Platform.YOUTUBE_MUSIC:
        const youtubeMusicTracks =
          await this.getYouTubeMusicTrackDataByTrackIdService.get(trackIds);
        return youtubeMusicTracks.map((track) => ({
          id: track.id,
          name: track.name,
          artists: track.artists,
          album: track.album,
          duration: track.duration,
        }));
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }
}
