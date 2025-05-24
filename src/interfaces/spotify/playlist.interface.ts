export interface SpotifyPlaylistResponse {
  tracks: {
    items: Array<{
      track: {
        id: string;
      } | null;
    }>;
  };
}
