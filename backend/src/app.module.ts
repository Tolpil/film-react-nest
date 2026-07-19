import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
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
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgres://localhost:5432/exampledb',
      username: process.env.DATABASE_USERNAME || 'exampleuser',
      password: process.env.DATABASE_PASSWORD || 'examplepass',
      entities: [FilmEntity, ScheduleEntity],
      synchronize: false,
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
