import { Injectable } from '@nestjs/common';
import { SpotifyTrack } from 'src/interfaces/spotify/track.interface';
import { SpotifyAuthService } from '../../auth/services/spotify-auth.service';

interface SpotifyTrackResponse {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
  }>;
  album: {
    id: string;
    name: string;
    release_date: string;
  };
}

interface SpotifyArtistResponse {
  id: string;
  genres: string[];
}

@Injectable()
export class GetSpotifyTrackDataByTrackIdService {
  constructor(private readonly spotifyAuthService: SpotifyAuthService) {}

  async get(trackIds: string[]): Promise<SpotifyTrack[]> {
    try {
      const tracks = await this.spotifyAuthService.makeRequest<{
        tracks: SpotifyTrackResponse[];
      }>(`/tracks?ids=${trackIds.join(',')}`);

      const artistIds = tracks.tracks.flatMap((track) =>
        track.artists.map((artist) => artist.id),
      );

      const artists = await Promise.all(
        artistIds.map((id) =>
          this.spotifyAuthService.makeRequest<SpotifyArtistResponse>(
            `/artists/${id}`,
          ),
        ),
      );

      const mappedTracks = tracks.tracks.map((track) => ({
        id: track.id,
        name: track.name,
        artists: track.artists.map((artist) => ({
          id: artist.id,
          name: artist.name,
        })),
        album: {
          id: track.album.id,
          name: track.album.name,
          releaseDate: track.album.release_date,
        },
        genres: [
          ...new Set(
            track.artists.flatMap((artist) => {
              const artistDetails = artists.find((a) => a.id === artist.id);
              return artistDetails?.genres || [];
            }),
          ),
        ],
      }));

      return mappedTracks;
    } catch (error) {
      throw new Error(`Failed to fetch track details: ${error.message}`);
    }
  }
}
