# Film — Backend (NestJS)

Бэкенд-часть сервиса для покупки билетов в кинотеатр. Реализован на NestJS с MongoDB (Mongoose).

## Стек

- **Runtime:** Node.js
- **Фреймворк:** NestJS 10
- **База данных:** MongoDB + Mongoose 8
- **Конфигурация:** @nestjs/config + dotenv

## Переменные окружения

Создайте файл `.env` в корне backend на основе `.env.example`:

```env
DATABASE_DRIVER="mongodb"
DATABASE_URL="mongodb://localhost:27017/prac"
DEBUG=*
```

| Переменная       | Описание                  | Значение по умолчанию          |
|------------------|---------------------------|--------------------------------|
| DATABASE_DRIVER  | Драйвер БД                | mongodb                        |
| DATABASE_URL     | Строка подключения к MongoDB | mongodb://localhost:27017/prac |
| DEBUG            | Флаг отладки              | *                              |

## Установка и запуск

```bash
# Установка зависимостей
$ npm install

# Запуск в режиме разработки (watch)
$ npm run start:dev

# Сборка
$ npm run build

# Запуск в production
$ npm run start:prod
```

## Линтинг и форматирование

```bash
# Проверка линтером
$ npm run lint

# Форматирование Prettier
$ npm run format
```

## Тесты

```bash
# Модульные тесты
$ npm run test

# E2E тесты
$ npm run test:e2e

# Покрытие
$ npm run test:cov
```

## Структура проекта

```
src/
├── films/              # Модуль фильмов
│   ├── films.controller.ts
│   ├── films.service.ts
│   └── dto/
│       └── films.dto.ts
├── order/              # Модуль заказов (бронирование билетов)
│   ├── order.controller.ts
│   ├── order.service.ts
│   └── dto/
│       └── order.dto.ts
├── repository/         # Слой работы с БД (репозиторий)
│   ├── film.converter.ts
│   ├── film.repository.ts
│   └── film.schema.ts
├── app.module.ts       # Корневой модуль
├── main.ts             # Точка входа
└── seed.ts             # Скрипт наполнения БД тестовыми данными
```

## API Endpoints

| Метод | Путь                | Описание                        |
|-------|---------------------|---------------------------------|
| GET   | /films              | Список фильмов (с пагинацией)   |
| GET   | /films/:id/schedule | Расписание сеансов фильма       |
| POST  | /order              | Создание заказа (бронь билетов) |
