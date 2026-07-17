import { Injectable } from '@nestjs/common';
import { FilmRepository } from '../repository/film.repository';

@Injectable()
export class FilmsService {
  constructor(private readonly filmRepository: FilmRepository) {}

  async getFilms() {
    return this.filmRepository.findAll();
  }

  async getFilmSchedule(id: string) {
    const result = await this.filmRepository.findScheduleById(id);
    if (!result) {
      return { total: 0, items: [] };
    }
    return { total: result.schedule.length, items: result.schedule };
  }
}
