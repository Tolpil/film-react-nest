import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let controller: FilmsController;

  const mockFilmsService = {
    getFilms: jest.fn(),
    getFilmSchedule: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: mockFilmsService,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getFilms', () => {
    it('should return list of films', async () => {
      const expectedResult = {
        total: 1,
        items: [
          {
            id: 'test-id',
            rating: 8.5,
            director: 'Test Director',
            tags: ['Test'],
            title: 'Test Film',
            about: 'About test',
            description: 'Description test',
            image: '/test.jpg',
            cover: '/test-cover.jpg',
          },
        ],
      };
      mockFilmsService.getFilms.mockResolvedValue(expectedResult);

      const result = await controller.getFilms();
      expect(result).toEqual(expectedResult);
      expect(mockFilmsService.getFilms).toHaveBeenCalled();
    });
  });

  describe('getFilmSchedule', () => {
    it('should return schedule for a film', async () => {
      const filmId = 'test-id';
      const expectedResult = {
        total: 1,
        items: [
          {
            id: 'schedule-id',
            daytime: '2024-06-28T10:00:53+03:00',
            hall: '0',
            rows: 5,
            seats: 10,
            price: 350,
            taken: [],
          },
        ],
      };
      mockFilmsService.getFilmSchedule.mockResolvedValue(expectedResult);

      const result = await controller.getFilmSchedule(filmId);
      expect(result).toEqual(expectedResult);
      expect(mockFilmsService.getFilmSchedule).toHaveBeenCalledWith(filmId);
    });
  });
});
