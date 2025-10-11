import { Test, TestingModule } from '@nestjs/testing';
import { QueryController } from './query.controller';
import { QueryService } from './query.service';

describe('QueryController', () => {
  let queryController: QueryController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [QueryController],
      providers: [QueryService],
    }).compile();

    queryController = app.get<QueryController>(QueryController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(queryController.getHello()).toBe('Hello World!');
    });
  });
});
