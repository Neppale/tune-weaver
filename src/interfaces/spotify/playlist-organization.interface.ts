import { SpotifyTrack } from './track.interface';

export interface PlaylistOrganization {
  type: 'artist' | 'album' | 'genre' | 'bpm';
  data: Record<string, SpotifyTrack[]>;
}
