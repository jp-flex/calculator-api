import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.use(helmet());
  app.setGlobalPrefix('truenorth');

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.enableCors({
    origin: [
      'http://localhost:3000',
    ],
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('True North Official Calculator')
    .setDescription('Your API Description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  // Generate the Swagger document from the app and the configuration
  const document = SwaggerModule.createDocument(app, config);

  // Serve the generated Swagger document at a specific path
  SwaggerModule.setup('api-docs', app, document);

  if (process.env.localhost) {
    await app.listen(3000);
  }  else {
    //start host at railway server
    await app.listen(process.env.PORT || 3000, '0.0.0.0');
  }
    
  
}
bootstrap();
