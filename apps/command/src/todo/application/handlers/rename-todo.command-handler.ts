import { CommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { RenameTodoCommand } from '../../domain/commands/rename-todo.command';
import { AggregateRehydrator } from '@lib/shared/application';
import { Todo } from '../../domain/entities/todo.entity';
import { TodoMapper } from '../presentation/todo.mapper';

@CommandHandler(RenameTodoCommand)
export class RenameTodoCommandHandler {
  private readonly logger = new Logger(RenameTodoCommandHandler.name);
  constructor(
    private readonly aggregateRehydrator: AggregateRehydrator, // Importa o AggregateRehydrator
  ) {}
  async execute(command: RenameTodoCommand) {
    this.logger.log(
      `Renaming todo with id: ${command.id} to new name: ${command.name}`,
    );
    const todo = await this.aggregateRehydrator.rehydrate(command.id, Todo);

    todo.rename(command.name);
    todo.commit();

    return TodoMapper.toDTO(todo);
  }
}
