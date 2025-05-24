export interface TrackData {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
  }>;
  album: {
    id: string;
    name: string;
    releaseDate: string;
  };
  duration: number;
}
