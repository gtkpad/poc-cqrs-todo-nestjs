import { SerializedEventPayload, Notification } from '@lib/shared';
import { AggregateRoot } from '@lib/shared';
import {
  TodoCreatedEvent,
  TodoMarkedAsDoneEvent,
  TodoMarkedAsUndoneEvent,
  TodoRenamedEvent,
} from '@lib/todo-common';
import { TodoValidatorFactory } from '../validation/todo.validator';

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

      this.validate(TodoValidatorFactory.create());
    }
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
    this.validate(TodoValidatorFactory.create());
  }

  [`on${TodoMarkedAsDoneEvent.name}`](
    _: SerializedEventPayload<TodoMarkedAsDoneEvent>,
  ) {
    this.done = true;
  }

  public markAsUndone() {
    this.apply(new TodoMarkedAsUndoneEvent(this.id, crypto.randomUUID()));
    this.validate(TodoValidatorFactory.create());
  }

  [`on${TodoMarkedAsUndoneEvent.name}`](
    _: SerializedEventPayload<TodoMarkedAsUndoneEvent>,
  ) {
    this.done = false;
  }

  public rename(name: string) {
    this.apply(new TodoRenamedEvent(this.id, crypto.randomUUID(), name));
    this.validate(TodoValidatorFactory.create());
  }

  [`on${TodoRenamedEvent.name}`](
    event: SerializedEventPayload<TodoRenamedEvent>,
  ) {
    this.name = event.name;
  }
}
