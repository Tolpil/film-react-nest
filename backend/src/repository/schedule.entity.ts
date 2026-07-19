import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FilmEntity } from './film.entity';

@Entity({ name: 'schedule' })
export class ScheduleEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  daytime: string;

  @Column()
  hall: number;

  @Column()
  rows: number;

  @Column()
  seats: number;

  @Column()
  price: number;

  @Column({ type: 'text', array: true, default: [] })
  taken: string[];

  @ManyToOne(() => FilmEntity, (film) => film.schedule, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'filmId' })
  film: FilmEntity;

  @Column()
  filmId: string;
}