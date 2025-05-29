import { Platform } from '@prisma/client';
import { CreatePlaylistDto } from '../../dtos/create-playlist.dto';

export const mockDate = new Date('2024-01-01');

export const mockPlaylistData: CreatePlaylistDto = {
  name: 'Test Playlist',
  userId: 'user1',
  type: 'CUSTOM',
  tracks: [
    {
      platform: Platform.SPOTIFY,
      platformId: 'track1',
    },
  ],
};

export const mockEmptyPlaylistData: CreatePlaylistDto = {
  name: 'Test Playlist',
  userId: 'user1',
  type: 'CUSTOM',
  tracks: [],
};

export const mockPlaylistResponse = {
  id: 'playlist1',
  name: mockPlaylistData.name,
  userId: mockPlaylistData.userId,
  createdAt: mockDate,
  updatedAt: mockDate,
  sourcePlaylistId: mockPlaylistData.sourcePlaylistId,
};
