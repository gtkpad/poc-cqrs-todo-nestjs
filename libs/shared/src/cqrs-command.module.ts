import { KurrentDBClient } from '@kurrent/kurrentdb-client';
import { Global, Module } from '@nestjs/common';
import { AggregateRehydrator, EventStore } from './application';
import {
  EventSerializer,
  EventStorePublisher,
  KurrentEventStore,
  EventDeserializer,
} from './infrastructure';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: KurrentDBClient,
      useFactory: () => {
        return KurrentDBClient.connectionString(
          'kurrentdb://localhost:2113?tls=false',
        );
      },
    },
    KurrentEventStore,
    {
      provide: EventStore,
      useExisting: KurrentEventStore,
    },
    EventSerializer,
    EventStorePublisher,
    // EventsBridge,
    EventDeserializer,
    AggregateRehydrator,
  ],
  exports: [EventStore, AggregateRehydrator],
})
export class CqrsCommandModule {}
