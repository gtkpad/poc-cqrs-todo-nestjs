import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CommandModule } from './command.module';
import {
  AggregateNotFoundErrorFilter,
  AggregateInvalidErrorFilter,
} from '@lib/shared';

async function bootstrap() {
  const app = await NestFactory.create(CommandModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(
    new AggregateInvalidErrorFilter(),
    new AggregateNotFoundErrorFilter(),
  );

  await app.listen(process.env.port ?? 3000);
}
bootstrap();
