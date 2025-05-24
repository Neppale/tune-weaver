export interface CreateTracksResult {
  existingTracks: {
    trackId: string;
    platform: string;
    platformId: string;
  }[];
  newTracks: {
    id: string;
    name: string;
    artist: string;
    album?: string;
    duration: number;
    platforms: {
      platform: string;
      platformId: string;
    }[];
  }[];
}
