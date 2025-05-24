import { Platform } from '@prisma/client';
import { mockDate } from './playlist.mock';

export const mockExistingTrack = {
  track: {
    id: 'existingTrack1',
    name: 'Test Track',
    artist: 'Test Artist',
    album: 'Test Album',
    duration: 180,
    createdAt: mockDate,
    updatedAt: mockDate,
  },
  id: 'platform1',
  trackId: 'existingTrack1',
  platform: Platform.SPOTIFY,
  platformId: 'track1',
  createdAt: mockDate,
  updatedAt: mockDate,
};

export const mockNewTrack = {
  id: 'newTrack1',
  name: 'Test Track',
  artist: 'Test Artist',
  album: 'Test Album',
  duration: 180,
  createdAt: mockDate,
  updatedAt: mockDate,
};

export const mockNewTrackPlatform = {
  id: 'platform1',
  trackId: 'newTrack1',
  platform: Platform.SPOTIFY,
  platformId: 'track1',
  createdAt: mockDate,
  updatedAt: mockDate,
};

export const mockSimilarTrack = {
  id: 'similarTrack1',
  name: 'Test Track',
  artist: 'Test Artist',
  album: 'Test Album',
  duration: 180,
  createdAt: mockDate,
  updatedAt: mockDate,
  platforms: [mockNewTrackPlatform],
};
