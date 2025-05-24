export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  tempo?: number;
  genres?: string[];
}

export interface SpotifyArtist {
  id: string;
  name: string;
  genres?: string[];
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  releaseDate: string;
}

export interface PlaylistOrganization {
  type: 'artist' | 'album' | 'genre' | 'bpm';
  data: Record<string, SpotifyTrack[]>;
}
