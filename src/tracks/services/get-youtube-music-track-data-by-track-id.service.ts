import { Injectable } from '@nestjs/common';
import { YoutubeMusicAuthService } from '../../auth/services/youtube-music-auth.service';

interface YouTubeMusicTrackResponse {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
  }>;
  album: {
    id: string;
    name: string;
    releaseDate: string;
  };
  duration: number;
}

@Injectable()
export class GetYouTubeMusicTrackDataByTrackIdService {
  constructor(
    private readonly youtubeMusicAuthService: YoutubeMusicAuthService,
  ) {}

  async get(trackIds: string[]): Promise<YouTubeMusicTrackResponse[]> {
    try {
      const trackPromises = trackIds.map((trackId) =>
        this.youtubeMusicAuthService.getTrack(trackId),
      );

      const tracks = await Promise.all(trackPromises);

      return tracks.map((track) => ({
        id: track.videoId,
        name: track.name,
        artists: [
          {
            id: track.artist.artistId,
            name: track.artist.name,
          },
        ],
        album: {
          id: track.videoId,
          name: track.name,
          releaseDate: track.duration.toString(),
        },
        duration: track.duration,
      }));
    } catch (error) {
      throw new Error(
        `Failed to fetch YouTube Music track details: ${error.message}`,
      );
    }
  }
}
