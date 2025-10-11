import { CommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { MarkTodoAsUndoneCommand } from '../../domain/commands/mark-todo-as-undone.command';

@CommandHandler(MarkTodoAsUndoneCommand)
export class MarkTodoAsUndoneCommandHandler {
  private readonly logger = new Logger(MarkTodoAsUndoneCommandHandler.name);
  execute(command: MarkTodoAsUndoneCommand) {
    this.logger.log(`Marking todo with id: ${command.id} as undone`);
  }
}
