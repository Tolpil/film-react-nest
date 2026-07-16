import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateOrderDto, OrderDto } from './dto/order.dto';
import { FilmRepository } from '../repository/film.repository';
import { Film } from '../repository/film.schema';

@Injectable()
export class OrderService {
  constructor(private readonly filmRepository: FilmRepository) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const { tickets } = createOrderDto;
    const items: OrderDto[] = [];
    let total = 0;
    const updatedFilms = new Map<string, Film>();

    for (const ticket of tickets) {
      // 1. Найти фильм по ID (из кэша или из БД)
      let film = updatedFilms.get(ticket.film);
      if (!film) {
        film = await this.filmRepository.findById(ticket.film);
        if (!film) {
          throw new NotFoundException(`Film with id "${ticket.film}" not found`);
        }
        updatedFilms.set(ticket.film, film);
      }

      // 2. Найти сеанс по ID
      const schedule = film.schedule.find(s => s.id === ticket.session);
      if (!schedule) {
        throw new NotFoundException(`Session with id "${ticket.session}" not found`);
      }

      // 3. Проверить, что цена совпадает
      if (schedule.price !== ticket.price) {
        throw new BadRequestException(
          `Price mismatch for session "${ticket.session}": expected ${schedule.price}, got ${ticket.price}`
        );
      }

      // 4. Проверить, что место в пределах зала
      if (ticket.row < 1 || ticket.row > schedule.rows) {
        throw new BadRequestException(
          `Row ${ticket.row} is out of range (1-${schedule.rows}) for session "${ticket.session}"`
        );
      }
      if (ticket.seat < 1 || ticket.seat > schedule.seats) {
        throw new BadRequestException(
          `Seat ${ticket.seat} is out of range (1-${schedule.seats}) for session "${ticket.session}"`
        );
      }

      // 5. Проверить, что место ещё не занято
      const seatKey = `${ticket.row}:${ticket.seat}`;
      if (schedule.taken.includes(seatKey)) {
        throw new BadRequestException(
          `Seat ${seatKey} is already taken for session "${ticket.session}"`
        );
      }

      // 6. Занять место
      schedule.taken.push(seatKey);
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

    // 7. Сохранить изменения в БД по каждому фильму
    for (const film of updatedFilms.values()) {
      await this.filmRepository.update(film);
    }

    return { total, items };
  }
}
