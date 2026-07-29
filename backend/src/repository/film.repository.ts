import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { FilmEntity } from './film.entity';
import { ScheduleEntity } from './schedule.entity';
import { FilmDto, FilmScheduleDto } from '../films/dto/films.dto';
import { FilmConverter } from './film.converter';

@Injectable()
export class FilmRepository {
  constructor(
    @InjectRepository(FilmEntity)
    private readonly filmRepository: Repository<FilmEntity>,
    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepository: Repository<ScheduleEntity>,
  ) {}

  async findAll(
    limit: number = 50,
    offset: number = 0,
  ): Promise<{ total: number; items: FilmDto[] }> {
    const [films, total] = await this.filmRepository.findAndCount({
      skip: offset,
      take: limit,
    });
    const items = films.map(FilmConverter.toFilmDto);
    return { total, items };
  }

  async findByIds(ids: string[]): Promise<FilmEntity[]> {
    return this.filmRepository.find({
      where: { id: In(ids) },
      relations: { schedule: true },
    });
  }

  async findById(id: string): Promise<FilmEntity | null> {
    return this.filmRepository.findOne({
      where: { id },
      relations: { schedule: true },
    });
  }

  async findScheduleById(id: string): Promise<FilmScheduleDto | null> {
    const film = await this.findById(id);
    if (!film) return null;
    return FilmConverter.toFilmScheduleDto(film);
  }

  async create(filmData: Partial<FilmEntity>): Promise<FilmEntity> {
    const film = this.filmRepository.create(filmData);
    return this.filmRepository.save(film);
  }

  async update(film: FilmEntity): Promise<void> {
    await this.filmRepository.save(film);
  }
}
