import { Module } from '@nestjs/common';
import { CreateTodoCommandHandler } from './application/handlers/create-todo.command-handler';
import { MarkTodoAsDoneCommandHandler } from './application/handlers/mark-todo-as-done.command-handler';
import { MarkTodoAsUndoneCommandHandler } from './application/handlers/mark-todo-as-undone.command-handler';
import { RenameTodoCommandHandler } from './application/handlers/rename-todo.command-handler';
import { TodoController } from './application/controllers/todo.controller';

@Module({
  imports: [],
  controllers: [TodoController],
  providers: [
    CreateTodoCommandHandler,
    RenameTodoCommandHandler,
    MarkTodoAsDoneCommandHandler,
    MarkTodoAsUndoneCommandHandler,
  ],
})
export class TodoModule {}
