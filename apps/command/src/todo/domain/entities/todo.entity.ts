import { SerializedEventPayload } from '@lib/shared';
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
    this.apply(
      new TodoCreatedEvent(id, crypto.randomUUID(), name, false, date),
    );
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
  }

  [`on${TodoMarkedAsDoneEvent.name}`](
    _: SerializedEventPayload<TodoMarkedAsDoneEvent>,
  ) {
    this.done = true;
  }

  public markAsUndone() {
    this.apply(new TodoMarkedAsUndoneEvent(this.id, crypto.randomUUID()));
  }

  [`on${TodoMarkedAsUndoneEvent.name}`](
    _: SerializedEventPayload<TodoMarkedAsUndoneEvent>,
  ) {
    this.done = false;
  }

  public rename(name: string) {
    this.apply(new TodoRenamedEvent(this.id, crypto.randomUUID(), name));
  }

  [`on${TodoRenamedEvent.name}`](
    event: SerializedEventPayload<TodoRenamedEvent>,
  ) {
    this.name = event.name;
  }
}
