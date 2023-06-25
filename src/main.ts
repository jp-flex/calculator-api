import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const server= await app.listen(8080);

  const address = server.address();
  const host = address.address;
  const port = address.port;

  console.log(`Application is running on: http://${host}:${port}`);
  
}
bootstrap();
