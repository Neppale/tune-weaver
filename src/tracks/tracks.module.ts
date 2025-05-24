import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTracksService } from './services/create-tracks.service';
import { LoadTrackPlatformByPlatformIdRepository } from './repositories/load-track-platform-by-platform-id.repository';
import { FindTracksByMetadataRepository } from './repositories/find-tracks-by-metadata.repository';
import { GetSpotifyTrackDataByTrackIdService } from './services/get-spotify-track-data-by-track-id.service';
import { GetYouTubeMusicTrackDataByTrackIdService } from './services/get-youtube-music-track-data-by-track-id.service';
import { GetTrackDataByPlatformService } from './services/get-track-data-by-platform.service';

@Module({
  providers: [
    PrismaService,
    CreateTracksService,
    LoadTrackPlatformByPlatformIdRepository,
    FindTracksByMetadataRepository,
    GetSpotifyTrackDataByTrackIdService,
    GetYouTubeMusicTrackDataByTrackIdService,
    GetTrackDataByPlatformService,
  ],
  exports: [
    CreateTracksService,
    LoadTrackPlatformByPlatformIdRepository,
    FindTracksByMetadataRepository,
    GetTrackDataByPlatformService,
  ],
})
export class TracksModule {}
