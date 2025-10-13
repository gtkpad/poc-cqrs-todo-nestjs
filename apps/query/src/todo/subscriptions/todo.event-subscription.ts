import { KurrentDBClient } from '@kurrent/kurrentdb-client';
import { EventDeserializer } from '@lib/shared';
import { SubscriptionService } from '@lib/shared/infrastructure/stream-subscription';
import { Injectable, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

@Injectable()
export class TodoEventSubscription extends SubscriptionService {
  constructor(
    kurrentDBClient: KurrentDBClient,
    eventDeserializer: EventDeserializer,
    eventBus: EventBus,
  ) {
    super(
      kurrentDBClient,
      new Logger(TodoEventSubscription.name),
      'Todo:',
      eventDeserializer,
      eventBus,
    );
  }
}
