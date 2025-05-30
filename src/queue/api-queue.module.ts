import { Module } from '@nestjs/common';
import { TrackEnrichmentHandler } from './handlers/track-enrichment.handler';
import { QueueServicesModule } from './queue-services.module';
import { TrackServicesModule } from '@Tracks/track-services.module';
import { TrackRepositoriesModule } from '@Tracks/track-repositories.module';

@Module({
  imports: [QueueServicesModule, TrackServicesModule, TrackRepositoriesModule],
  providers: [TrackEnrichmentHandler],
  exports: [TrackEnrichmentHandler],
  controllers: [TrackEnrichmentHandler],
})
export class ApiQueueModule {}
