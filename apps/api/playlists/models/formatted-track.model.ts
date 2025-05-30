export class FormattedTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration: number;
  isEnriched: boolean;
  platforms: {
    platform: string;
    platformId: string;
  }[];
}
