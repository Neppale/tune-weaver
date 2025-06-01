import { Injectable } from '@nestjs/common';
import { Platform } from '@prisma/client';
import { GetTrackDataByPlatformService } from '@Tracks/services/get-track-data-by-platform.service';
import { TrackData } from '@Tracks/models/interfaces/track-data.interface';
import { PlaylistOrganization } from '@Interfaces/spotify/playlist-organization.interface';
import { GetTrackIdsByPlaylistIdService } from '@Tracks/services/get-track-ids-by-playlist-id.service';

@Injectable()
export class GetSamplePlaylistsService {
  constructor(
    private readonly getTrackDataByPlatformService: GetTrackDataByPlatformService,
    private readonly getTrackIdsByPlaylistIdService: GetTrackIdsByPlaylistIdService,
  ) {}

  async get(
    platform: Platform,
    playlistId: string,
  ): Promise<PlaylistOrganization[]> {
    const trackIds = await this.getTrackIdsByPlaylistIdService.get(
      platform,
      playlistId,
    );
    const tracks = await this.getTrackDataByPlatformService.get(
      platform,
      trackIds,
    );

    return [
      this.organizeByArtist(tracks),
      this.organizeByAlbum(tracks),
      this.organizeByGenre(tracks),
      this.organizeByBPM(tracks),
    ];
  }

  organizeByArtist(tracks: TrackData[]): PlaylistOrganization {
    const organization: Record<string, TrackData[]> = {};

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

  organizeByAlbum(tracks: TrackData[]): PlaylistOrganization {
    const organization: Record<string, TrackData[]> = {};

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

  organizeByGenre(tracks: TrackData[]): PlaylistOrganization {
    const organization: Record<string, TrackData[]> = {};

    tracks.forEach((track) => {
      if (!track.genres) return;

      track.genres.forEach((genre) => {
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

  organizeByBPM(tracks: TrackData[]): PlaylistOrganization {
    const organization: Record<string, TrackData[]> = {};

    tracks.forEach((track) => {
      if (!track.tempo) return;

      const bpmRange = this.getBPMRange(track.tempo);
      if (!organization[bpmRange]) {
        organization[bpmRange] = [];
      }
      organization[bpmRange].push(track);
    });

    return {
      type: 'bpm',
      data: organization,
    };
  }

  private getBPMRange(bpm: number): string {
    if (bpm < 60) return 'Very Slow (< 60 BPM)';
    if (bpm < 80) return 'Slow (60-80 BPM)';
    if (bpm < 100) return 'Medium (80-100 BPM)';
    if (bpm < 120) return 'Fast (100-120 BPM)';
    if (bpm < 140) return 'Very Fast (120-140 BPM)';
    return 'Extreme (> 140 BPM)';
  }
}
