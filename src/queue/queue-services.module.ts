import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { QueueService } from './src/services/queue.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'TRACK_ENRICHMENT',
        useFactory: () => ({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL],
            queue: 'track_enrichment',
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [],
      },
    ]),
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueServicesModule {}
