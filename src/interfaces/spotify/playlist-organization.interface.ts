import { TrackData } from 'src/tracks/interfaces/track-data.interface';

export interface PlaylistOrganization {
  type: 'artist' | 'album' | 'genre' | 'bpm';
  data: Record<string, TrackData[]>;
}
