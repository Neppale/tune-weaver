export interface SpotifyPlaylistResponse {
  name: string;
  tracks: {
    items: Array<{
      track: {
        id: string;
      } | null;
    }>;
  };
}
