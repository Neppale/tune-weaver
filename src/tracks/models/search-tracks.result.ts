import { FormattedTrack } from '@Playlists/models/formatted-track.model';

export interface SearchTracksResult {
  tracks: FormattedTrack[];
  total: number;
}
