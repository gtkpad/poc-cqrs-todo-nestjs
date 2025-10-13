import { TodoMarkedAsUndoneEvent } from '@lib/todo-common';
import { Logger } from '@nestjs/common';
import { EventsHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from '../models/todo.model';

@EventsHandler(TodoMarkedAsUndoneEvent)
export class TodoMarkedAsUndoneEventHandler {
  private readonly logger = new Logger(TodoMarkedAsUndoneEventHandler.name);
  constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) {}

  async handle(event: TodoMarkedAsUndoneEvent) {
    this.logger.log(
      `Handling TodoMarkedAsUndoneEvent for id: ${event.stream_id}`,
    );
    const todo = await this.todoModel.findOne({ id: event.stream_id });
    if (todo) {
      todo.done = false;
      await todo.save();
      this.logger.log(`Todo marked as undone: ${todo.id}`);
    }
  }
}
