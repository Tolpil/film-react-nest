import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TicketDto {
  @IsUUID()
  film!: string;

  @IsUUID()
  session!: string;

  @IsString()
  daytime!: string;

  @IsNumber()
  @Min(1)
  row!: number;

  @IsNumber()
  @Min(1)
  seat!: number;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsOptional()
  @IsString()
  day?: string;

  @IsOptional()
  @IsString()
  time?: string;
}

export class CreateOrderDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TicketDto)
  @IsNotEmpty()
  tickets!: TicketDto[];
}

export class OrderDto extends TicketDto {
  id!: string;
}
