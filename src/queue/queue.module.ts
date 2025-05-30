import { Module } from '@nestjs/common';
import { AuthModule } from '@Auth/auth.module';
import { PrismaModule } from '@Prisma/prisma.module';
import { QueueServicesModule } from './queue-services.module';
import { QueueClientsModule } from './queue-clients.module';
import { TrackEnrichmentHandler } from './src/handlers/track-enrichment.handler';

@Module({
  imports: [QueueClientsModule, QueueServicesModule, AuthModule, PrismaModule],
  providers: [TrackEnrichmentHandler],
  exports: [TrackEnrichmentHandler],
  controllers: [TrackEnrichmentHandler],
})
export class QueueModule {}
