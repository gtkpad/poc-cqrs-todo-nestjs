import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class ListTodoQuery {
  @IsPositive()
  @IsInt()
  @IsNumber()
  page: number = 1;

  @IsPositive()
  @IsInt()
  @IsNumber()
  limit: number = 10;
}
