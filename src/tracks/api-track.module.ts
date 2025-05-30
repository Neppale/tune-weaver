import { Module } from '@nestjs/common';
import { TrackServicesModule } from './track-services.module';
import { TrackRepositoriesModule } from './track-repositories.module';
import { TrackController } from '@Tracks/track.controller';

@Module({
  imports: [TrackServicesModule, TrackRepositoriesModule],
  controllers: [TrackController],
})
export class ApiTrackModule {}
