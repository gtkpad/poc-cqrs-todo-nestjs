/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import {
  KurrentDBClient,
  ReadStreamOptions,
  StreamNotFoundError,
  WrongExpectedVersionError,
  ResolvedEvent,
  jsonEvent,
  AppendStreamState,
} from '@kurrent/kurrentdb-client';
import { SerializableEvent } from '@lib/shared';
import { EventStore } from '@lib/shared/application/event-store';
import { Injectable, Logger } from '@nestjs/common';
import { EventDeserializer } from './deserializers/event.deserializer';
import { EventSerializer } from './serializers/event.serializer';
import { Event } from './schemas/event.schema';
import { AggregateNotFoundError } from '../domain/errors/aggregate-not-found.error';
import { AggregateStaleError } from '../domain/errors/aggregate-stale.error';

@Injectable()
export class KurrentEventStore implements EventStore {
  private readonly logger = new Logger(KurrentEventStore.name);

  constructor(
    private readonly client: KurrentDBClient,
    private readonly eventSerializer: EventSerializer,
    private readonly eventDeserializer: EventDeserializer,
  ) {}

  async persist(
    streamId: string,
    eventOrEvents: SerializableEvent | SerializableEvent[],
    expectedVersion?: number,
  ): Promise<void> {
    const events = Array.isArray(eventOrEvents)
      ? eventOrEvents
      : [eventOrEvents];

    if (events.length === 0) {
      return;
    }

    const kurrentEvents = events.map((event) => jsonEvent(event));

    try {
      await this.client.appendToStream(streamId, kurrentEvents, {
        streamState:
          expectedVersion !== undefined && expectedVersion >= 0
            ? (expectedVersion as unknown as AppendStreamState)
            : 'no_stream',
      });
      this.logger.debug(`Events appended to stream ${streamId} successfully.`);
    } catch (err) {
      if (err instanceof WrongExpectedVersionError) {
        this.logger.warn(`Version conflict for stream ${streamId}`);

        throw new AggregateStaleError(
          `Aggregate ${streamId} is stale: ${err.message}`,
          streamId,
        );
      }
      this.logger.error(
        `Error appending events to stream ${streamId}: ${err.message}`,
      );

      throw err;
    }
  }

  async getEventsByStreamId(streamId: string): Promise<SerializableEvent[]> {
    const readOpts: ReadStreamOptions = {
      direction: 'forwards',
      fromRevision: 'start',
    };

    const recorded: ResolvedEvent[] = [];
    try {
      const eventsIterator = this.client.readStream(streamId, readOpts);
      for await (const event of eventsIterator) {
        recorded.push(event);
      }
    } catch (err) {
      if (err instanceof StreamNotFoundError) {
        throw new AggregateNotFoundError(
          `Aggregate with id ${streamId} does not exist`,
          streamId,
        );
      }
      this.logger.error(`Error reading stream ${streamId}: ${err.message}`);
      throw err;
    }

    if (!recorded || recorded.length === 0) {
      throw new Error(`Aggregate with id ${streamId} does not exist`);
    }

    // Desserializa cada evento
    const result = recorded.map((rec) => {
      const serialized: Event = {
        id: rec.event?.id as string,
        stream_id: streamId,
        type: rec.event?.type as string,
        position: rec.event?.revision as unknown as number,
        data: rec.event?.data as object,
        timestamp: rec.event?.created as Date,
      };
      return this.eventDeserializer.deserialize(serialized);
    });

    return result;
  }
}
