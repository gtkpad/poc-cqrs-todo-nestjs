import { Injectable } from '@nestjs/common';

@Injectable()
export class QueryService {
  getHello(): string {
    return 'Hello World!';
  }
}
