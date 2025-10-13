import { KurrentDBClient } from '@kurrent/kurrentdb-client';
import { Module } from '@nestjs/common';
import { TodoEventSubscription } from './subscriptions/todo.event-subscription';
import { TodoCreatedEventHandler } from './event/todo-created.handler';
import { TodoMarkedAsUndoneEventHandler } from './event/todo-marked-as-undone.handler';
import { TodoMarkedAsDoneEventHandler } from './event/todo-marked-as-done.handler';
import { TodoRenamedEventHandler } from './event/todo-renamed.handler';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo, TodoSchema } from './models/todo.model';
import { TodoController } from './controllers/todo.controller';
import { ListTodoQueryHandler } from './handlers/list-todo.query-handler';
import { GetTodoQueryHandler } from './handlers/get-todo.query-handler';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
  ],
  controllers: [TodoController],
  providers: [
    {
      provide: KurrentDBClient,
      useFactory: () => {
        return KurrentDBClient.connectionString(
          'kurrentdb://localhost:2113?tls=false',
        );
      },
    },
    // EventStorePublisher,
    TodoCreatedEventHandler,
    TodoRenamedEventHandler,
    TodoMarkedAsDoneEventHandler,
    TodoMarkedAsUndoneEventHandler,
    TodoEventSubscription,
    ListTodoQueryHandler,
    GetTodoQueryHandler,
  ],
})
export class TodoModule {}
