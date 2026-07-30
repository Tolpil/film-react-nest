import { ConfigModule, ConfigService } from '@nestjs/config';

export const configProvider = {
  imports: [ConfigModule.forRoot()],
  provide: 'CONFIG',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) =>
    <AppConfig>{
      database: {
        driver: configService.get<string>('DATABASE_DRIVER', 'postgres'),
        url: configService.get<string>(
          'DATABASE_URL',
          'postgres://localhost:5432/exampledb',
        ),
        username: configService.get<string>('DATABASE_USERNAME', 'exampleuser'),
        password: configService.get<string>('DATABASE_PASSWORD', 'examplepass'),
      },
    },
};

export interface AppConfig {
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
  username: string;
  password: string;
}
