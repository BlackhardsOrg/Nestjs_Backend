import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT || 8080;
  console.log(port);

  const corsOptions: CorsOptions = {
    origin: 'https://www.blackhards.com', // Allow your domain
    credentials: true, // Allow credentials if needed (e.g., cookies)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Specify allowed methods
  };

  app.enableCors(corsOptions);

  await app.listen(port);
}
bootstrap();
