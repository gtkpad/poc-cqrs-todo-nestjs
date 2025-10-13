/* eslint-disable @typescript-eslint/no-unsafe-return */
import { SerializableEvent } from './interfaces/serializable-event';
import { Notification } from './validations/notification';
import { AggregateRoot as NestJSAggregateRoot } from '@nestjs/cqrs';
import { Version } from './value-objects/version.vo';

const VERSION = Symbol('version');

export class AggregateRoot extends NestJSAggregateRoot {
  public id: string;
  // private _notification: Notification[] = [];

  private [VERSION] = new Version(-1);

  get version(): Version {
    return this[VERSION];
  }

  get stream_id(): string {
    let name = this.constructor.name;
    if (name === '') {
      name = Object.getPrototypeOf(this.constructor).name;
    }
    return `${name}:${this.id}`;
  }

  public loadFromHistory(history: SerializableEvent[]): void {
    const domainEvents = history.map((event) => event.data);
    super.loadFromHistory(domainEvents);

    const lastEvent = history[history.length - 1];

    if (lastEvent) {
      this.setVersion(new Version(lastEvent.position));
    }
  }

  private setVersion(version: Version): void {
    this[VERSION] = version;
  }
}
