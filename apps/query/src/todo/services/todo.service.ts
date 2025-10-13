import {
  TodoCreatedEvent,
  TodoMarkedAsDoneEvent,
  TodoMarkedAsUndoneEvent,
  TodoRenamedEvent,
} from '@lib/todo-common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TodoService {
  create(_: TodoCreatedEvent) {}
  rename(_: TodoRenamedEvent) {}
  markAsDone(_: TodoMarkedAsDoneEvent) {}
  markAsUndone(_: TodoMarkedAsUndoneEvent) {}
}
