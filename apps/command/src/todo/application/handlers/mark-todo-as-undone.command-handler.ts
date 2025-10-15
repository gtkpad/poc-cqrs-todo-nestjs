import { CommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { MarkTodoAsUndoneCommand } from '../../domain/commands/mark-todo-as-undone.command';
import { AggregateRehydrator } from '@lib/shared';
import { Todo } from '../../domain/entities/todo.entity';
import { TodoMapper } from '../presentation/todo.mapper';

@CommandHandler(MarkTodoAsUndoneCommand)
export class MarkTodoAsUndoneCommandHandler {
  private readonly logger = new Logger(MarkTodoAsUndoneCommandHandler.name);

  constructor(private readonly aggregateRehydrator: AggregateRehydrator) {}
  async execute(command: MarkTodoAsUndoneCommand) {
    const todo = await this.aggregateRehydrator.rehydrate(command.id, Todo);

    todo.markAsUndone();

    todo.commit();

    this.logger.log(`Marked todo with id: ${command.id} as undone`);

    return TodoMapper.toDTO(todo);
  }
}
