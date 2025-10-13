import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { QueryModule } from './query.module';

async function bootstrap() {
  const app = await NestFactory.create(QueryModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.listen(process.env.port ?? 3001);
}
bootstrap();
