/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-floating-promises */

import { OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import {
  KurrentDBClient,
  persistentSubscriptionToAllSettingsFromDefaults,
  streamNameFilter,
  SubscribeToPersistentSubscriptionToAllOptions,
  PersistentSubscriptionToAll,
} from '@kurrent/kurrentdb-client';
import { DuplexOptions } from 'node:stream';
import { EventDeserializer } from './deserializers/event.deserializer';
import { Event } from './schemas/event.schema';
import { EventClsRegistry } from './event-cls.registry';
import { EventBus } from '@nestjs/cqrs';

export abstract class SubscriptionService
  implements OnModuleInit, OnModuleDestroy
{
  private subscription: PersistentSubscriptionToAll;
  private isRunning = false;

  constructor(
    private readonly client: KurrentDBClient,
    private readonly logger: Logger,
    private readonly preffixFilter: string,
    private readonly eventDeserializer: EventDeserializer,
    private readonly eventBus: EventBus,
  ) {}

  async onModuleInit() {
    const groupName = this.constructor.name;
    await this.ensureSubscriptionTodoAll(groupName);
    this.startTodoSubscription(groupName);
  }

  async onModuleDestroy() {
    this.logger.log(`Stopping subscription ${this.constructor.name}`);
    this.isRunning = false;
    if (
      this.subscription &&
      typeof (this.subscription as any).stop === 'function'
    ) {
      try {
        await (this.subscription as any).stop();
      } catch (err) {
        this.logger.error('Error stopping subscription', err);
      }
    }
  }

  private async ensureSubscriptionTodoAll(groupName: string) {
    const settings = persistentSubscriptionToAllSettingsFromDefaults();

    const filter = streamNameFilter({ prefixes: [this.preffixFilter] });

    try {
      await this.client.createPersistentSubscriptionToAll(groupName, settings, {
        filter,
      });
      this.logger.log(
        `Persistent subscription group "${groupName}" for $all with filter "${this.preffixFilter}" created.`,
      );
    } catch (err: any) {
      if (err.type === 'persistent-subscription-exists') {
        this.logger.warn(
          `Persistent subscription group "${groupName}" already exists — skipping creation.`,
        );
      } else {
        this.logger.error(
          `Error creating filtered persistent subscription "${groupName}"`,
          err,
        );
        throw err;
      }
    }
  }

  private startTodoSubscription(
    groupName: string,
    options?: SubscribeToPersistentSubscriptionToAllOptions,
    duplexOptions?: DuplexOptions,
  ) {
    this.isRunning = true;
    this.subscription = this.client.subscribeToPersistentSubscriptionToAll(
      groupName,
      options,
      duplexOptions,
    );

    (async () => {
      this.logger.log(
        `Starting filtered subscription consumer for group "${groupName}".`,
      );
      try {
        for await (const eventWrapper of this.subscription) {
          if (!this.isRunning) break;

          const { event } = eventWrapper;
          this.logger.debug(
            `Received event ${event?.type} from stream ${event?.streamId}`,
          );

          try {
            const serialized: Event = {
              id: event?.id as string,
              stream_id: event?.streamId as string,
              type: event?.type as string,
              position: event?.revision as unknown as number,
              data: event?.data as object,
              timestamp: event?.created as Date,
            };
            const deserialized =
              this.eventDeserializer.deserializeEvent(serialized);

            if (!deserialized) {
              this.logger.warn(
                `No event class registered for event type ${event?.type}. Skipping...`,
              );
              await this.subscription.ack(eventWrapper);
              continue;
            }

            await this.eventBus.publish(deserialized);
            this.logger.log(
              `Event ${event?.type} from stream ${event?.streamId} processed successfully.`,
            );

            await this.subscription.ack(eventWrapper);
          } catch (procErr) {
            this.logger.error(`Error processing event ${event?.type}`, procErr);
            await this.subscription.nack(
              'park',
              procErr.toString(),
              eventWrapper,
            );
          }
        }
      } catch (err) {
        this.logger.error('Subscription iteration failed or dropped', err);
        if (this.isRunning) {
          this.logger.log('Reconnecting subscription after delay...');
          setTimeout(
            () => this.startTodoSubscription(groupName, options, duplexOptions),
            5000,
          );
        }
      }
    })();
  }
}
