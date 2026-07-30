import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DevLogger } from './logger/dev-logger';
import { JsonLogger } from './logger/json-logger';
import { TSKVLogger } from './logger/tskv-logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api/afisha');
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const logFormat = configService.get<string>('LOG_FORMAT', 'dev');
  switch (logFormat) {
    case 'json':
      app.useLogger(new JsonLogger());
      break;
    case 'tskv':
      app.useLogger(new TSKVLogger());
      break;
    default:
      app.useLogger(new DevLogger());
      break;
  }

  const port = configService.get<number>('BACKEND_PORT', 3000);
  await app.listen(port);
}
bootstrap();
