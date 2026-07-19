import { FilmDto, ScheduleDto, FilmScheduleDto } from '../films/dto/films.dto';
import { FilmEntity } from './film.entity';
import { ScheduleEntity } from './schedule.entity';

export class FilmConverter {
  static toFilmDto(film: FilmEntity): FilmDto {
    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
    };
  }

  static toFilmScheduleDto(film: FilmEntity): FilmScheduleDto {
    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
      schedule: film.schedule.map(FilmConverter.toScheduleDto),
    };
  }

  static toScheduleDto(schedule: ScheduleEntity): ScheduleDto {
    return {
      id: schedule.id,
      daytime: schedule.daytime,
      hall: String(schedule.hall),
      rows: schedule.rows,
      seats: schedule.seats,
      price: schedule.price,
      taken: schedule.taken,
    };
  }
}
