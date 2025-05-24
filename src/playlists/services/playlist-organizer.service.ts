import { Injectable } from '@nestjs/common';
import {
  SpotifyTrack,
  PlaylistOrganization,
} from '../../interfaces/spotify.interface';

@Injectable()
export class PlaylistOrganizerService {
  organizeByArtist(tracks: SpotifyTrack[]): PlaylistOrganization {
    const organization: Record<string, SpotifyTrack[]> = {};

    tracks.forEach((track) => {
      track.artists.forEach((artist) => {
        if (!organization[artist.name]) {
          organization[artist.name] = [];
        }
        organization[artist.name].push(track);
      });
    });

    return {
      type: 'artist',
      data: organization,
    };
  }

  organizeByAlbum(tracks: SpotifyTrack[]): PlaylistOrganization {
    const organization: Record<string, SpotifyTrack[]> = {};

    tracks.forEach((track) => {
      if (!organization[track.album.name]) {
        organization[track.album.name] = [];
      }
      organization[track.album.name].push(track);
    });

    return {
      type: 'album',
      data: organization,
    };
  }

  organizeByGenre(tracks: SpotifyTrack[]): PlaylistOrganization {
    const organization: Record<string, SpotifyTrack[]> = {};

    tracks.forEach((track) => {
      track.genres?.forEach((genre) => {
        if (!organization[genre]) {
          organization[genre] = [];
        }
        organization[genre].push(track);
      });
    });

    return {
      type: 'genre',
      data: organization,
    };
  }

  organizeByBPM(tracks: SpotifyTrack[]): PlaylistOrganization {
    const organization: Record<string, SpotifyTrack[]> = {};

    tracks.forEach((track) => {
      if (track.tempo) {
        const bpmRange = this.getBPMRange(track.tempo);
        if (!organization[bpmRange]) {
          organization[bpmRange] = [];
        }
        organization[bpmRange].push(track);
      }
    });

    return {
      type: 'bpm',
      data: organization,
    };
  }

  private getBPMRange(tempo: number): string {
    const ranges = [
      { min: 0, max: 60, label: '0-60 BPM' },
      { min: 60, max: 80, label: '60-80 BPM' },
      { min: 80, max: 100, label: '80-100 BPM' },
      { min: 100, max: 120, label: '100-120 BPM' },
      { min: 120, max: 140, label: '120-140 BPM' },
      { min: 140, max: 160, label: '140-160 BPM' },
      { min: 160, max: 180, label: '160-180 BPM' },
      { min: 180, max: Infinity, label: '180+ BPM' },
    ];

    const range = ranges.find((r) => tempo >= r.min && tempo < r.max);
    return range ? range.label : 'Unknown BPM';
  }

  getAllOrganizations(tracks: SpotifyTrack[]): PlaylistOrganization[] {
    return [
      this.organizeByArtist(tracks),
      this.organizeByAlbum(tracks),
      this.organizeByGenre(tracks),
      this.organizeByBPM(tracks),
    ];
  }
}
