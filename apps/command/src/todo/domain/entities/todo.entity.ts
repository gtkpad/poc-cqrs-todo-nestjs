/* eslint-disable @typescript-eslint/no-unsafe-return */
import { SerializedEventPayload, Notification } from '@lib/shared';
import { AggregateRoot } from '@lib/shared';
import {
  TodoCreatedEvent,
  TodoMarkedAsDoneEvent,
  TodoMarkedAsUndoneEvent,
  TodoRenamedEvent,
} from '@lib/todo-common';

export class Todo extends AggregateRoot {
  public name: string;
  public done: boolean;
  public date: Date;

  constructor(id: string, name: string, date: Date) {
    super();
    if (name !== undefined && date !== undefined) {
      this.apply(
        new TodoCreatedEvent(id, crypto.randomUUID(), name, false, date),
      );

      this.validate();
    }
  }

  public validate(): boolean {
    this.clearNotifications();

    if (!this.name || this.name.trim().length === 0) {
      this.addNotification(
        new Notification('name', 'Name is required and cannot be empty.'),
      );
    }

    if (this.name && this.name.length > 100) {
      this.addNotification(
        new Notification('name', 'Name must not exceed 100 characters.'),
      );
    }

    if (this.name.length < 3) {
      this.addNotification(
        new Notification('name', 'Name must be at least 3 characters long.'),
      );
    }

    if (
      !this.date ||
      !(this.date instanceof Date) ||
      isNaN(this.date.valueOf())
    ) {
      this.addNotification(
        new Notification('date', 'Date is required and must be a valid date.'),
      );
    }

    return this.isValid;
  }

  [`on${TodoCreatedEvent.name}`](
    event: SerializedEventPayload<TodoCreatedEvent>,
  ) {
    this.id = event.stream_id;
    this.name = event.name;
    this.done = event.done;
    this.date = new Date(event.date);
  }

  public markAsDone() {
    this.apply(new TodoMarkedAsDoneEvent(this.id, crypto.randomUUID()));
    this.validate();
  }

  [`on${TodoMarkedAsDoneEvent.name}`](
    _: SerializedEventPayload<TodoMarkedAsDoneEvent>,
  ) {
    this.done = true;
  }

  public markAsUndone() {
    this.apply(new TodoMarkedAsUndoneEvent(this.id, crypto.randomUUID()));
    this.validate();
  }

  [`on${TodoMarkedAsUndoneEvent.name}`](
    _: SerializedEventPayload<TodoMarkedAsUndoneEvent>,
  ) {
    this.done = false;
  }

  public rename(name: string) {
    this.apply(new TodoRenamedEvent(this.id, crypto.randomUUID(), name));
    this.validate();
  }

  [`on${TodoRenamedEvent.name}`](
    event: SerializedEventPayload<TodoRenamedEvent>,
  ) {
    this.name = event.name;
  }
}
