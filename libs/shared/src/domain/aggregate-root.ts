/* eslint-disable @typescript-eslint/no-unsafe-return */
import { SerializableEvent } from './interfaces/serializable-event';
import { Notification } from './validations/notification';
import { AggregateRoot as NestJSAggregateRoot } from '@nestjs/cqrs';
import { Version } from './value-objects/version.vo';
import { INotifiable } from './validations/notifiable.interface';
import { AggregateInvalidError } from './errors/aggregate-invalid.error';
import { ClassValidatorFields } from './validations/class-validator-fields';

const VERSION = Symbol('version');

export class AggregateRoot extends NestJSAggregateRoot implements INotifiable {
  public id: string;
  private _notification: Notification[] = [];

  private [VERSION] = new Version(-1);

  get isValid(): boolean {
    return this._notification.length === 0;
  }

  getNotifications(): Notification[] {
    return this._notification;
  }

  addNotification(notification: Notification): void {
    this._notification.push(notification);
  }

  clearNotifications(): void {
    this._notification = [];
  }

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

  public validate(
    validator: ClassValidatorFields,
    fields: string[] = [],
  ): boolean {
    this.clearNotifications();

    this._notification = validator.validate(this, fields);

    return this.isValid;
  }

  public loadFromHistory(history: SerializableEvent[]): void {
    const domainEvents = history.map((event) => event.data);
    super.loadFromHistory(domainEvents);

    const lastEvent = history[history.length - 1];

    if (lastEvent) {
      this.setVersion(new Version(lastEvent.position));
    }
  }

  commit(): void {
    if (!this.isValid) {
      throw new AggregateInvalidError(
        "Can't commit an invalid aggregate.",
        this.getNotifications(),
      );
    }
    super.commit();
  }

  private setVersion(version: Version): void {
    this[VERSION] = version;
  }
}
