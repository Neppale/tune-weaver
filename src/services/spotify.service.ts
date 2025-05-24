import { Injectable } from '@nestjs/common';
import SpotifyWebApi from 'spotify-web-api-node';
import { SpotifyTrack } from '../interfaces/spotify.interface';
import { PrismaService } from '../services/prisma.service';
import { Platform } from '@prisma/client';
import { CreatePlaylistRepository } from 'src/repositories/implementations/playlists/create-playlist.repository';

@Injectable()
export class SpotifyService {
  private spotifyApi: SpotifyWebApi;
  private createPlaylistRepository: CreatePlaylistRepository;

  constructor(private prisma: PrismaService) {
    this.spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    });
    this.createPlaylistRepository = new CreatePlaylistRepository(this.prisma);
  }

  setAccessToken(token: string) {
    this.spotifyApi.setAccessToken(token);
  }

  async getPlaylistTracks(playlistId: string): Promise<SpotifyTrack[]> {
    try {
      const response = await this.spotifyApi.getPlaylistTracks(playlistId);
      const tracks = response.body.items.map((item) => ({
        id: item.track.id,
        name: item.track.name,
        artists: item.track.artists.map((artist) => ({
          id: artist.id,
          name: artist.name,
        })),
        album: {
          id: item.track.album.id,
          name: item.track.album.name,
          releaseDate: item.track.album.release_date,
        },
      }));

      // Get audio features for tempo
      const trackIds = tracks.map((track) => track.id);
      const audioFeatures =
        await this.spotifyApi.getAudioFeaturesForTracks(trackIds);

      // Get artist details for genres
      const artistIds = [
        ...new Set(
          tracks.flatMap((track) => track.artists.map((artist) => artist.id)),
        ),
      ];
      const artists = await this.spotifyApi.getArtists(artistIds);

      // Combine all data
      return tracks.map((track, index) => ({
        ...track,
        tempo: audioFeatures.body.audio_features[index]?.tempo,
        genres: [
          ...new Set(
            track.artists.flatMap((artist) => {
              const artistDetails = artists.body.artists.find(
                (a) => a.id === artist.id,
              );
              return artistDetails?.genres || [];
            }),
          ),
        ],
      }));
    } catch (error) {
      throw new Error(`Failed to fetch playlist tracks: ${error.message}`);
    }
  }

  async createSubplaylistFromSpotifyPlaylist(
    accessToken: string,
    playlistId: string,
    subplaylistName: string,
  ) {
    this.setAccessToken(accessToken);

    // Get tracks from Spotify
    const tracks = await this.getPlaylistTracks(playlistId);

    // Create subplaylist in database
    const subplaylist = await this.createPlaylistRepository.create({
      name: subplaylistName,
      type: 'custom',
      value: subplaylistName,
      userId: '1',
      sourcePlaylist: {
        platform: Platform.SPOTIFY,
        platformId: playlistId,
      },
      tracks: [],
    });

    // Create categories and track references
    const categories = new Map<
      string,
      { type: string; value: string; tracks: SpotifyTrack[] }
    >();

    // Organize by artist
    tracks.forEach((track) => {
      track.artists.forEach((artist) => {
        const key = `artist:${artist.name}`;
        if (!categories.has(key)) {
          categories.set(key, {
            type: 'artist',
            value: artist.name,
            tracks: [],
          });
        }
        categories.get(key)!.tracks.push(track);
      });
    });

    // Organize by album
    tracks.forEach((track) => {
      const key = `album:${track.album.name}`;
      if (!categories.has(key)) {
        categories.set(key, {
          type: 'album',
          value: track.album.name,
          tracks: [],
        });
      }
      categories.get(key)!.tracks.push(track);
    });

    // Organize by genre
    tracks.forEach((track) => {
      track.genres?.forEach((genre) => {
        const key = `genre:${genre}`;
        if (!categories.has(key)) {
          categories.set(key, { type: 'genre', value: genre, tracks: [] });
        }
        categories.get(key)!.tracks.push(track);
      });
    });

    // Organize by BPM
    tracks.forEach((track) => {
      if (track.tempo) {
        const bpmRange = this.getBPMRange(track.tempo);
        const key = `bpm:${bpmRange}`;
        if (!categories.has(key)) {
          categories.set(key, { type: 'bpm', value: bpmRange, tracks: [] });
        }
        categories.get(key)!.tracks.push(track);
      }
    });

    // Create categories and track references in database
    for (const category of categories.values()) {
      await this.createPlaylistRepository.create({
        name: `${subplaylist.name} - ${category.type} - ${category.value}`,
        type: category.type,
        value: category.value,
        userId: subplaylist.userId,
        sourcePlaylist: {
          platform: Platform.SPOTIFY,
          platformId: subplaylist.id,
        },
        tracks: category.tracks.map((track) => ({
          platform: Platform.SPOTIFY,
          platformId: track.id,
        })),
      });
    }

    return subplaylist;
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
}
