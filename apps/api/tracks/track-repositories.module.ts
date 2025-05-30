import { Module } from '@nestjs/common';
import { FindTrackByMetadataRepository } from './repositories/find-tracks-by-metadata.repository';
import { CreateTrackPlatformRepository } from './repositories/create-track-platform.repository';
import { UpdateTrackRepository } from './repositories/update-track.repository';
import { LoadTrackByIdRepository } from './repositories/load-track-by-id.repository';
import { PrismaModule } from '@Prisma/prisma.module';
import { CreateTracksRepository } from '@Tracks/repositories/create-tracks.repository';
import { SearchTracksRepository } from '@Tracks/repositories/search-tracks.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    FindTrackByMetadataRepository,
    CreateTrackPlatformRepository,
    UpdateTrackRepository,
    LoadTrackByIdRepository,
    CreateTracksRepository,
    LoadTrackByIdRepository,
    SearchTracksRepository,
  ],
  exports: [
    FindTrackByMetadataRepository,
    CreateTrackPlatformRepository,
    UpdateTrackRepository,
    LoadTrackByIdRepository,
    CreateTracksRepository,
    SearchTracksRepository,
  ],
})
export class TrackRepositoriesModule {}
