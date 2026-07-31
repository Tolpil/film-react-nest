import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateOrderDto, OrderDto } from './dto/order.dto';
import { FilmRepository } from '../repository/film.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly filmRepository: FilmRepository,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const { tickets } = createOrderDto;
    const items: OrderDto[] = [];
    let total = 0;

    // 1. Получить уникальные ID фильмов и загрузить их одним запросом
    const filmIds = [...new Set(tickets.map((t) => t.film))];
    const films = await this.filmRepository.findByIds(filmIds);
    const filmMap = new Map(films.map((f) => [f.id, f]));

    // Проверить, что все фильмы найдены
    for (const filmId of filmIds) {
      if (!filmMap.has(filmId)) {
        throw new NotFoundException(`Film with id "${filmId}" not found`);
      }
    }

    // 2. Выполнить бронирование в транзакции
    await this.dataSource.transaction(async (manager) => {
      for (const ticket of tickets) {
        const film = filmMap.get(ticket.film)!;

        // Найти сеанс по ID
        const schedule = film.schedule.find((s) => s.id === ticket.session);
        if (!schedule) {
          throw new NotFoundException(
            `Session with id "${ticket.session}" not found`,
          );
        }

        // Проверить, что цена совпадает
        if (schedule.price !== ticket.price) {
          throw new BadRequestException(
            `Price mismatch for session "${ticket.session}": expected ${schedule.price}, got ${ticket.price}`,
          );
        }

        // Проверить, что место в пределах зала
        if (ticket.row < 1 || ticket.row > schedule.rows) {
          throw new BadRequestException(
            `Row ${ticket.row} is out of range (1-${schedule.rows}) for session "${ticket.session}"`,
          );
        }
        if (ticket.seat < 1 || ticket.seat > schedule.seats) {
          throw new BadRequestException(
            `Seat ${ticket.seat} is out of range (1-${schedule.seats}) for session "${ticket.session}"`,
          );
        }

        const seatKey = `${ticket.row}:${ticket.seat}`;

        // Атомарно проверить и обновить место через raw SQL
        // Используем array_position для проверки, что места нет в массиве taken
        const result = await manager.query(
          `UPDATE schedule SET taken = array_append(taken, $1)
           WHERE id = $2 AND NOT ($1 = ANY(taken))`,
          [seatKey, ticket.session],
        );

        // result — это массив, где последний элемент — количество затронутых строк
        const affected =
          Array.isArray(result) && result.length > 0
            ? result[result.length - 1]
            : 0;

        if (!affected || affected === 0) {
          // Ничего не обновлено — место уже занято или сеанс не найден
          // Проверим, существует ли сеанс вообще
          const existing = await manager.query(
            `SELECT id FROM schedule WHERE id = $1`,
            [ticket.session],
          );
          if (existing.length === 0) {
            throw new NotFoundException(
              `Session with id "${ticket.session}" not found`,
            );
          }
          throw new BadRequestException(
            `Seat ${seatKey} is already taken for session "${ticket.session}"`,
          );
        }

        total += schedule.price;

        items.push({
          id: `${ticket.film}:${ticket.session}:${seatKey}`,
          film: ticket.film,
          session: ticket.session,
          daytime: schedule.daytime,
          row: ticket.row,
          seat: ticket.seat,
          price: schedule.price,
        });
      }
    });

    return { total, items };
  }
}
