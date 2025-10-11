import { EventStore } from '../application/event-store';
import { EventDeserializer } from './deserializers/event.deserializer';
// import { EventsBridge } from './event-bridge';
import { EventStorePublisher } from './publishers/event-store.publisher';
import { EventSerializer } from './serializers/event.serializer';
import { KurrentEventStore } from './kurrentdb.event-store';
import { Module } from '@nestjs/common';
import { KurrentDBClient } from '@kurrent/kurrentdb-client';

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
    EventSerializer,
    EventStorePublisher,
    KurrentEventStore,
    // EventsBridge,
    EventDeserializer,
    {
      provide: EventStore,
      useExisting: KurrentEventStore,
    },
  ],
  exports: [EventStore],
})
export class SharedInfrastructureModule {}
