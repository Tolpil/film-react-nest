import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FilmRepository } from './repository/film.repository';
import * as fs from 'fs';
import * as path from 'path';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const filmRepository = app.get(FilmRepository);

  const dataPath = path.join(__dirname, '..', 'test', 'mongodb_initial_stub.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const films = JSON.parse(rawData);

  for (const film of films) {
    await filmRepository.create(film);
  }

  console.log(`Seeded ${films.length} films successfully!`);
  await app.close();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});