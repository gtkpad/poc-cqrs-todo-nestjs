import { IsNotEmpty, IsString } from 'class-validator';

export class RenameTodoDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
