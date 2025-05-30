import { forwardRef, Module } from '@nestjs/common';
import { EnrichTrackService } from './src/services/enrich-track.service';
import { TrackServicesModule } from '@Tracks/track-services.module';
import { TrackRepositoriesModule } from '@Tracks/track-repositories.module';

@Module({
  imports: [forwardRef(() => TrackServicesModule), TrackRepositoriesModule],
  providers: [EnrichTrackService],
  exports: [EnrichTrackService],
})
export class QueueServicesModule {}
