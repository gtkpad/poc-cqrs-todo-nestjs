import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { EventBus, IEventPublisher } from '@nestjs/cqrs';

import { EventSerializer } from '../serializers/event.serializer';
import { AggregateRoot, BaseEvent } from '@lib/shared';
import { KurrentEventStore } from '../kurrentdb.event-store';

@Injectable()
export class EventStorePublisher
  implements OnApplicationBootstrap, IEventPublisher<BaseEvent>
{
  constructor(
    private readonly eventStore: KurrentEventStore,
    private readonly eventBus: EventBus<BaseEvent>,
    private readonly eventSerializer: EventSerializer,
  ) {}

  onApplicationBootstrap() {
    this.eventBus.publisher = this;
  }

  publish<T extends BaseEvent>(event: T, dispatcher: AggregateRoot) {
    const serializableEvent = this.eventSerializer.serialize(event, dispatcher);

    return this.eventStore.persist(
      dispatcher.stream_id,
      serializableEvent,
      dispatcher.version.value,
    );
  }

  publishAll<T extends BaseEvent>(events: T[], dispatcher: AggregateRoot) {
    const serializableEvents = events.map((event) =>
      this.eventSerializer.serialize(event, dispatcher),
    );

    console.log(`stream id: ${dispatcher.stream_id}`);
    console.log('dispatcher version: ', dispatcher.version.value);

    return this.eventStore.persist(
      dispatcher.stream_id,
      serializableEvents,
      dispatcher.version.value,
    );
  }
}
