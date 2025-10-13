import { TodoCreatedEvent } from '@lib/todo-common';
import { EventsHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Todo } from '../models/todo.model';
import { Model } from 'mongoose';
import { Logger } from '@nestjs/common';

@EventsHandler(TodoCreatedEvent)
export class TodoCreatedEventHandler {
  private readonly logger = new Logger(TodoCreatedEventHandler.name);
  constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) {}
  async handle(event: TodoCreatedEvent) {
    const createdTodo = await this.todoModel.create({
      id: event.stream_id,
      name: event.name,
      date: event.date,
      done: event.done,
    });
    await createdTodo.save();
    this.logger.log(`Todo created: ${createdTodo.id}`);
  }
}
