import { TrackData } from '@Tracks/interfaces/track-data.interface';

export interface PlaylistOrganization {
  type: 'artist' | 'album' | 'genre' | 'bpm';
  data: Record<string, TrackData[]>;
}
