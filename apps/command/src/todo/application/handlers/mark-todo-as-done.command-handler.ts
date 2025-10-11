import { CommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { MarkTodoAsDoneCommand } from '../../domain/commands/mark-todo-as-done.command';

@CommandHandler(MarkTodoAsDoneCommand)
export class MarkTodoAsDoneCommandHandler {
  private readonly logger = new Logger(MarkTodoAsDoneCommandHandler.name);
  execute(command: MarkTodoAsDoneCommand) {
    this.logger.log(`Marking todo with id: ${command.id} as done`);
  }
}
