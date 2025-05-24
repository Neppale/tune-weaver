import { SpotifyArtist } from './artist.interface';
import { SpotifyAlbum } from './album.interface';

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  tempo?: number;
  genres?: string[];
  duration_ms: number;
}
