import { Injectable, Type } from '@nestjs/common';
import { EventStore } from './event-store';
import { AggregateRoot, EventPublisher } from '@nestjs/cqrs';

@Injectable()
export class AggregateRehydrator {
  constructor(
    private readonly eventStore: EventStore,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async rehydrate<T extends AggregateRoot>(
    aggregateId: string,
    AggregateCls: Type<T>,
  ): Promise<T> {
    const events = await this.eventStore.getEventsByStreamId(
      `${AggregateCls.name}:${aggregateId}`,
    );

    const AggregateClsWithDispatcher =
      this.eventPublisher.mergeClassContext(AggregateCls);
    const aggregate = new AggregateClsWithDispatcher(aggregateId);

    aggregate.loadFromHistory(events);

    return aggregate;
  }
}
