import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, FilmDocument } from './film.schema';
import { FilmDto, FilmScheduleDto } from '../films/dto/films.dto';
import { FilmConverter } from './film.converter';

@Injectable()
export class FilmRepository {
  constructor(
    @InjectModel(Film.name) private filmModel: Model<FilmDocument>,
  ) {}

  async findAll(): Promise<{ total: number; items: FilmDto[] }> {
    const films = await this.filmModel.find().exec();
    const items = films.map(FilmConverter.toFilmDto);
    return { total: items.length, items };
  }

  async findById(id: string): Promise<Film | null> {
    return this.filmModel.findOne({ id }).exec();
  }

  async findScheduleById(id: string): Promise<FilmScheduleDto | null> {
    const film = await this.findById(id);
    if (!film) return null;
    return FilmConverter.toFilmScheduleDto(film);
  }

  async create(filmData: any): Promise<Film> {
    const film = new this.filmModel(filmData);
    return film.save();
  }

  async update(film: Film): Promise<void> {
    await this.filmModel.updateOne({ id: film.id }, film).exec();
  }
}