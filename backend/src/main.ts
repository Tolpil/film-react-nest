import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { DevLogger } from './logger/dev-logger';
import { JsonLogger } from './logger/json-logger';
import { TSKVLogger } from './logger/tskv-logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.setGlobalPrefix('api/afisha');
  app.enableCors();

  const logFormat = process.env.LOG_FORMAT || 'dev';
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

  await app.listen(3000);
}
bootstrap();
