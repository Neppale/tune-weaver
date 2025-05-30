import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

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
  exports: [ClientsModule],
})
export class QueueClientsModule {}
