import { CommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { MarkTodoAsDoneCommand } from '../../domain/commands/mark-todo-as-done.command';
import { AggregateRehydrator } from '@lib/shared';
import { Todo } from '../../domain/entities/todo.entity';

@CommandHandler(MarkTodoAsDoneCommand)
export class MarkTodoAsDoneCommandHandler {
  private readonly logger = new Logger(MarkTodoAsDoneCommandHandler.name);

  constructor(private readonly aggregateRehydrator: AggregateRehydrator) {}

  async execute(command: MarkTodoAsDoneCommand) {
    const todo = await this.aggregateRehydrator.rehydrate(command.id, Todo);
    todo.markAsDone();

    todo.commit();

    return todo;
  }
}
