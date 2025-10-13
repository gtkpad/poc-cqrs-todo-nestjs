import { TodoRenamedEvent } from '@lib/todo-common';
import { Logger } from '@nestjs/common';
import { EventsHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Todo } from 'apps/command/src/todo/domain/entities/todo.entity';
import { Model } from 'mongoose';

@EventsHandler(TodoRenamedEvent)
export class TodoRenamedEventHandler {
  private readonly logger = new Logger(TodoRenamedEventHandler.name);
  constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) {}
  async handle(event: TodoRenamedEvent) {
    this.logger.log(`Handling TodoRenamedEvent for id: ${event.stream_id}`);
    const todo = await this.todoModel.findOne({ id: event.stream_id });
    if (todo) {
      todo.name = event.name;
      await todo.save();
      this.logger.log(`Todo renamed: ${todo.id} to ${todo.name}`);
    }
  }
}
