/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { EventBus, IEventPublisher } from '@nestjs/cqrs';

import { EventSerializer } from '../serializers/event.serializer';
import { AggregateRoot, BaseEvent, EventStore } from '@lib/shared';

@Injectable()
export class EventStorePublisher
  implements OnApplicationBootstrap, IEventPublisher<BaseEvent>
{
  constructor(
    private readonly eventStore: EventStore,
    private readonly eventBus: EventBus<BaseEvent>,
    private readonly eventSerializer: EventSerializer,
  ) {}

  onApplicationBootstrap() {
    this.eventBus.publisher = this;
  }

  async publish<T extends BaseEvent>(event: T, dispatcher: AggregateRoot) {
    const serializableEvent = this.eventSerializer.serialize(event, dispatcher);

    return await this.eventStore.persist(
      dispatcher.stream_id,
      serializableEvent,
      dispatcher.version.value,
    );
  }

  async publishAll<T extends BaseEvent>(
    events: T[],
    dispatcher: AggregateRoot,
  ) {
    const serializableEvents = events.map((event) =>
      this.eventSerializer.serialize(event, dispatcher),
    );

    return await this.eventStore.persist(
      dispatcher.stream_id,
      serializableEvents,
      dispatcher.version.value,
    );
  }
}
