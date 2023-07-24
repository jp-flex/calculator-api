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
      'http://0.0.0.0:3000',
      'https://calculator-client-production.up.railway.app/',
      'https://cors-anywhere-production-6f0a.up.railway.app',
      'https://cors-anywhere-production-6f0a.up.railway.app/https://calculator-api-production-97a7.up.railway.app/truenorth/v1/auth/login'
    ],
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('True North Official Calculator')
    .setDescription(`This API implements arithmetic and non arithmetic 
    calculations that can be accessed via Bearer auth.`)
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  // Generate the Swagger document from the app and the configuration
  const document = SwaggerModule.createDocument(app, config);

  // Serve the generated Swagger document at a specific path
  SwaggerModule.setup('api-docs', app, document);

  console.log( process.env.RAILWAY_SERVICE_CALCULATOR_API_URL)
  console.log(process.env.PORT)

  //LOCALHOST_PORT is the port for localhost env while 3000 is for remote host
  await app.listen(process.env.LOCALHOST_PORT || 7652 , '0.0.0.0');

    
  
}
bootstrap();
