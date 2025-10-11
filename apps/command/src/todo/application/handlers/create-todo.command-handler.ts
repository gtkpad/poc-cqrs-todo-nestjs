/* eslint-disable @typescript-eslint/require-await */
import { CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { CreateTodoCommand } from '../../domain/commands/create-todo.command';
import { Logger } from '@nestjs/common';
import { Todo } from '../../domain/entities/todo.entity';
import { TodoFactory } from '../../domain/factories/todo.factory';

@CommandHandler(CreateTodoCommand)
export class CreateTodoCommandHandler {
  constructor(private readonly eventPublisher: EventPublisher) {}
  private readonly logger = new Logger(CreateTodoCommandHandler.name);
  async execute(command: CreateTodoCommand): Promise<Todo> {
    this.logger.debug(`Received command ${command.constructor.name}`);

    const todo = TodoFactory.create(command.name, command.date);
    this.eventPublisher.mergeObjectContext(todo);

    todo.commit();

    return todo;
  }
}
