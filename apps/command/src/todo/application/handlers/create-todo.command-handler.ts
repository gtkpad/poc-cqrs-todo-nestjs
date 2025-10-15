/* eslint-disable @typescript-eslint/require-await */
import { CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { CreateTodoCommand } from '../../domain/commands/create-todo.command';
import { Logger } from '@nestjs/common';
import { TodoFactory } from '../../domain/factories/todo.factory';
import { TodoMapper } from '../presentation/todo.mapper';
import { TodoResponseDTO } from '../dtos/todo-response.dto';

@CommandHandler(CreateTodoCommand)
export class CreateTodoCommandHandler {
  constructor(private readonly eventPublisher: EventPublisher) {}
  private readonly logger = new Logger(CreateTodoCommandHandler.name);
  async execute(command: CreateTodoCommand): Promise<TodoResponseDTO> {
    this.logger.debug(`Received command ${command.constructor.name}`);
    this.logger.log(
      `Creating todo with name: ${command.name} and date: ${command.date.toISOString()}`,
    );

    const todo = TodoFactory.create(command.name, command.date);
    this.eventPublisher.mergeObjectContext(todo);

    todo.commit();

    return TodoMapper.toDTO(todo);
  }
}
