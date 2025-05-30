import { Module } from '@nestjs/common';
import { AuthModule } from '@Auth/auth.module';
import { PrismaModule } from '@Prisma/prisma.module';
import { QueueServicesModule } from '@Queue/queue-services.module';
import { QueueClientsModule } from '@Queue/queue-clients.module';
import { TrackEnrichmentHandler } from '@Queue/src/handlers/track-enrichment.handler';

@Module({
  imports: [QueueClientsModule, QueueServicesModule, AuthModule, PrismaModule],
  providers: [TrackEnrichmentHandler],
  exports: [TrackEnrichmentHandler],
  controllers: [TrackEnrichmentHandler],
})
export class QueueModule {}
