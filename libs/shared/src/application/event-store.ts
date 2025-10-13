import { SerializableEvent } from '../domain';

export abstract class EventStore {
  abstract persist(
    streamId: string,
    eventOrEvents: SerializableEvent | SerializableEvent[],
    expectedVersion?: number,
  ): Promise<void>;
  abstract getEventsByStreamId(streamId: string): Promise<SerializableEvent[]>;
}
