export interface YouTubeMusicPlaylistResponse {
  type: 'PLAYLIST';
  name: string;
  artist: {
    artistId: string;
    name: string;
  };
  thumbnails: Array<{
    url: string;
    width: number;
    height: number;
  }>;
  playlistId: string;
  videoCount: number;
  tracks: Array<{
    videoId: string;
    name: string;
    artist: {
      artistId: string;
      name: string;
    };
    duration: number;
  }>;
}
