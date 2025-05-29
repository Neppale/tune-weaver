import { Module } from '@nestjs/common';
import { QueueService } from './services/queue.service';
import { TrackEnrichmentConsumer } from './consumers/track-enrichment.consumer';
import { TrackModule } from '@Tracks/track.module';
import { AuthModule } from '@Auth/auth.module';
import { PrismaModule } from '@Prisma/prisma.module';

@Module({
  imports: [TrackModule, AuthModule, PrismaModule],
  providers: [QueueService, TrackEnrichmentConsumer],
  exports: [QueueService],
})
export class QueueModule {}
