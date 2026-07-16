import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  async createOrder(createOrderDto: CreateOrderDto) {
    // TODO: реализовать создание заказа через репозиторий
    return { total: 0, items: [] };
  }
}
