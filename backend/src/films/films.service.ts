import { Injectable } from '@nestjs/common';

@Injectable()
export class FilmsService {
  async getFilms() {
    // TODO: реализовать получение списка фильмов из репозитория
    return { total: 0, items: [] };
  }

  async getFilmSchedule(id: string) {
    // TODO: реализовать получение расписания фильма из репозитория
    return { total: 0, items: [] };
  }
}
