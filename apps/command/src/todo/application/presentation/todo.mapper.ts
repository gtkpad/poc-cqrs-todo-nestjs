import { Todo } from '../../domain/entities/todo.entity';
import { TodoResponseDTO } from '../dtos/todo-response.dto';

export class TodoMapper {
  static toDTO(entity: Todo): TodoResponseDTO {
    const dto = new TodoResponseDTO();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.done = entity.done;
    dto.date = entity.date;
    return dto;
  }
}
