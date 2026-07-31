import { IsString, IsNumber, IsArray, IsUUID, Min } from 'class-validator';

export class FilmDto {
  @IsUUID()
  id!: string;

  @IsNumber()
  rating!: number;

  @IsString()
  director!: string;

  @IsArray()
  tags!: string[];

  @IsString()
  title!: string;

  @IsString()
  about!: string;

  @IsString()
  description!: string;

  @IsString()
  image!: string;

  @IsString()
  cover!: string;
}

export class ScheduleDto {
  @IsUUID()
  id!: string;

  @IsString()
  daytime!: string;

  @IsString()
  hall!: string;

  @IsNumber()
  @Min(1)
  rows!: number;

  @IsNumber()
  @Min(1)
  seats!: number;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsArray()
  taken!: string[];
}

export class FilmScheduleDto {
  @IsUUID()
  id!: string;

  @IsNumber()
  rating!: number;

  @IsString()
  director!: string;

  @IsArray()
  tags!: string[];

  @IsString()
  title!: string;

  @IsString()
  about!: string;

  @IsString()
  description!: string;

  @IsString()
  image!: string;

  @IsString()
  cover!: string;

  @IsArray()
  schedule!: ScheduleDto[];
}
