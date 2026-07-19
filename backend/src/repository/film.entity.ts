import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { ScheduleEntity } from './schedule.entity';

@Entity({ name: 'film' })
export class FilmEntity {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'float' })
  rating: number;

  @Column()
  director: string;

  @Column({ type: 'text', array: true, default: [] })
  tags: string[];

  @Column()
  title: string;

  @Column()
  about: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column()
  cover: string;

  @OneToMany(() => ScheduleEntity, (schedule) => schedule.film, {
    cascade: true,
    eager: true,
  })
  schedule: ScheduleEntity[];
}
