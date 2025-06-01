import { Injectable } from '@nestjs/common';
import { Platform } from '@prisma/client';
import { GetSpotifyTrackDataByTrackIdService } from './get-spotify-track-data-by-track-id.service';
import { GetYouTubeMusicTrackDataByTrackIdService } from './get-youtube-music-track-data-by-track-id.service';
import { TrackData } from '@Tracks/models/interfaces/track-data.interface';
import { PlatformNotSupportedException } from '@Exceptions/auth.exception';

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
          duration: track.duration_ms / 1000,
        }));
      case Platform.YOUTUBE_MUSIC:
        const youtubeMusicTracks =
          await this.getYouTubeMusicTrackDataByTrackIdService.get(trackIds);
        return youtubeMusicTracks.map((track) => ({
          id: track.id,
          name: (() => {
            const parts = track.name.split(' - ');
            if (parts.length > 1) {
              const [artist, ...nameParts] = parts;
              track.artists.push({ id: '', name: artist });
              return nameParts.join(' - ');
            }
            return track.name;
          })(),
          artists: (() => {
            const parts = track.name.split(' - ');
            if (parts.length > 1) {
              const [artist] = parts;
              return [{ id: '', name: artist }];
            }
            return track.artists;
          })(),
          album: track.album,
          duration: track.duration,
        }));
      default:
        throw new PlatformNotSupportedException(platform);
    }
  }
}
