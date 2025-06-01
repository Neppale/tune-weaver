import { TrackData } from '@Tracks/models/interfaces/track-data.interface';

export const mockTrackData: TrackData = {
  id: 'track1',
  name: 'Test Track',
  artists: [{ id: 'artist1', name: 'Test Artist' }],
  album: { id: 'album1', name: 'Test Album', releaseDate: '2024' },
  duration: 180,
};
