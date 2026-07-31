import 'dotenv/config';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'node:path';

import { configProvider } from './app.config.provider';
import { FilmsController } from './films/films.controller';
import { FilmsService } from './films/films.service';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';
import { FilmRepository } from './repository/film.repository';
import { FilmEntity } from './repository/film.entity';
import { ScheduleEntity } from './repository/schedule.entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST', 'localhost'),
        port: configService.get<number>('DATABASE_PORT', 5432),
        database: configService.get<string>('DATABASE_NAME', 'exampledb'),
        username: configService.get<string>('DATABASE_USERNAME', 'exampleuser'),
        password: configService.get<string>('DATABASE_PASSWORD', 'examplepass'),
        entities: [FilmEntity, ScheduleEntity],
        synchronize: false,
      }),
    }),
    TypeOrmModule.forFeature([FilmEntity, ScheduleEntity]),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
      serveStaticOptions: {
        index: false,
      },
    }),
  ],
  controllers: [FilmsController, OrderController],
  providers: [configProvider, FilmsService, OrderService, FilmRepository],
})
export class AppModule {}
