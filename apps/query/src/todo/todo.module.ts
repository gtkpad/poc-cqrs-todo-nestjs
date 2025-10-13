/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { KurrentDBClient } from '@kurrent/kurrentdb-client';
import { Module } from '@nestjs/common';
import { TodoEventSubscription } from './subscriptions/todo.event-subscription';
import { TodoService } from './services/todo.service';
import { TodoCreatedEventHandler } from './event/todo-created.handler';
import { TodoMarkedAsUndoneEventHandler } from './event/todo-marked-as-undone.handler';
import { TodoMarkedAsDoneEventHandler } from './event/todo-marked-as-done.handler';
import { TodoRenamedEventHandler } from './event/todo-renamed.handler';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo, TodoSchema } from './models/todo.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
  ],
  controllers: [],
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
    TodoService,
    TodoCreatedEventHandler,
    TodoRenamedEventHandler,
    TodoMarkedAsDoneEventHandler,
    TodoMarkedAsUndoneEventHandler,
    TodoEventSubscription,
  ],
})
export class TodoModule {}
