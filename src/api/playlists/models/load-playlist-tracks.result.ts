import { FormattedTrack } from './formatted-track.model';

export interface LoadPlaylistTracksResult {
  tracks: FormattedTrack[];
  total: number;
}
