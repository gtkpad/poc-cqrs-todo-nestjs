/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AggregateRoot, BaseEvent, SerializableEvent } from '@lib/shared';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EventSerializer {
  serialize<T>(
    event: BaseEvent,
    dispatcher: AggregateRoot,
  ): SerializableEvent<T> {
    const eventType = event?.constructor?.name;
    if (!eventType) {
      throw new Error('Incompatible event type');
    }

    return {
      id: event.id,
      type: eventType,
      position: dispatcher.version.value + 1,
      data: this.toJSON(event),
    };
  }

  private toJSON<T>(data: T) {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    if ('toJSON' in data && typeof data.toJSON === 'function') {
      return data.toJSON();
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.toJSON(item));
    }

    return Object.entries(data).reduce((acc, [key, value]) => {
      acc[key] = this.toJSON(value);
      return acc;
    }, {});
  }
}
