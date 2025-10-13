/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ListTodoQuery } from '../queries/list-todo.query';
import { QueryBus } from '@nestjs/cqrs';
import { GetTodoQuery } from '../queries/get-todo.query';

@Controller('todos')
export class TodoController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async list(@Query() query: ListTodoQuery) {
    return await this.queryBus.execute<ListTodoQuery>(query);
  }

  @Get(':id')
  async get(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.queryBus.execute<GetTodoQuery>(new GetTodoQuery(id));
  }
}
