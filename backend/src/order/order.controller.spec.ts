import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;

  const mockOrderService = {
    createOrder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create an order and return total with items', async () => {
      const createOrderDto: CreateOrderDto = {
        email: 'test@example.com',
        phone: '+71234567890',
        tickets: [
          {
            film: '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf',
            session: 'f2e429b0-685d-41f8-a8cd-1d8cb63b99ce',
            daytime: '2024-06-28T10:00:53+03:00',
            row: 1,
            seat: 1,
            price: 350,
          },
        ],
      };

      const expectedResult = {
        total: 350,
        items: [
          {
            id: '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf:f2e429b0-685d-41f8-a8cd-1d8cb63b99ce:1:1',
            film: '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf',
            session: 'f2e429b0-685d-41f8-a8cd-1d8cb63b99ce',
            daytime: '2024-06-28T10:00:53+03:00',
            row: 1,
            seat: 1,
            price: 350,
          },
        ],
      };

      mockOrderService.createOrder.mockResolvedValue(expectedResult);

      const result = await controller.create(createOrderDto);
      expect(result).toEqual(expectedResult);
      expect(mockOrderService.createOrder).toHaveBeenCalledWith(createOrderDto);
    });
  });
});
