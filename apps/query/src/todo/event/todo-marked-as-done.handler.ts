import { TodoMarkedAsDoneEvent } from '@lib/todo-common';
import { Logger } from '@nestjs/common';
import { EventsHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from '../models/todo.model';

@EventsHandler(TodoMarkedAsDoneEvent)
export class TodoMarkedAsDoneEventHandler {
  private readonly logger = new Logger(TodoMarkedAsDoneEventHandler.name);
  constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) {}
  async handle(event: TodoMarkedAsDoneEvent) {
    this.logger.log(
      `Handling TodoMarkedAsDoneEvent for id: ${event.stream_id}`,
    );
    const todo = await this.todoModel.findOne({ id: event.stream_id });
    if (todo) {
      todo.done = true;
      await todo.save();
      this.logger.log(`Todo marked as done: ${todo.id}`);
    }
  }
}
