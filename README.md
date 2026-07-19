# FILM!

Fullstack-приложение кинотеатра: афиша фильмов и бронирование билетов.

## Стек технологий

- **Бэкенд:** NestJS, PostgreSQL (TypeORM)
- **Фронтенд:** React 18, TypeScript, Vite, SCSS, Storybook
- **API:** OpenAPI 3.0 (см. [`film.yml`](film.yml))

## Структура проекта

```
film-react-nest/
├── backend/          # Бэкенд на NestJS
│   ├── src/
│   │   ├── films/        # Модуль фильмов
│   │   ├── order/        # Модуль заказов
│   │   └── repository/   # Репозиторий (TypeORM)
│   ├── public/       # Статические файлы (изображения)
│   └── test/         # Тесты и SQL-скрипты
├── frontend/         # Фронтенд на React + Vite
│   └── src/
│       ├── components/  # React-компоненты
│       ├── hooks/       # Кастомные хуки
│       └── utils/       # Утилиты
├── film.yml          # OpenAPI спецификация
└── film.postman.json # Postman коллекция
```

## Функциональные требования

Проект реализует бэкенд для кинотеатра в соответствии со спецификацией OpenAPI (см. [`film.yml`](film.yml) и коллекцию Postman [`film.postman.json`](film.postman.json)).

### Запрос списка фильмов
- **Эндпоинт:** `GET /api/afisha/films`
- Возвращает список фильмов с идентификатором и информацией о каждом фильме

### Запрос расписания фильма
- **Эндпоинт:** `GET /api/afisha/films/:id/schedule`
- Возвращает данные о фильме с идентификатором и списком сеансов

### Бронирование билетов
- **Эндпоинт:** `POST /api/afisha/order`
- Принимает данные о заказе: email, телефон и список билетов (идентификатор фильма, идентификатор сеанса, ряд, место, цена)
- Проверяет, что место свободно, и сохраняет его в формате `${row}:${seat}`
- Запрещает повторное бронирование одного и того же места
- Возвращает подтверждение с общей суммой и списком билетов

### Статический контент
- **Эндпоинт:** `GET /content/afisha/*`
- Возвращает статические файлы (изображения афиш)

## API Endpoints

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| GET | `/api/afisha/films` | Список фильмов |
| GET | `/api/afisha/films/:id/schedule` | Расписание фильма |
| POST | `/api/afisha/order` | Бронирование билетов |
| GET | `/content/afisha/*` | Статический контент |

## Ход выполнения

### Вторая часть проектной работы — Модульный API-сервис (часть 2)

Перевод бэкенда с MongoDB на PostgreSQL с использованием TypeORM.

#### Шаг 1. Подготовка окружения

- Создана ветка `review-2` от `main`
- Установлены зависимости `@nestjs/typeorm`, `typeorm`, `pg` для работы с PostgreSQL
- Удалены зависимости `mongoose` и `@nestjs/mongoose`

#### Шаг 2. Подключение TypeORM и PostgreSQL

- Обновлён [`app.module.ts`](backend/src/app.module.ts) — `MongooseModule` заменён на `TypeOrmModule` с подключением к PostgreSQL
- Обновлён [`app.config.provider.ts`](backend/src/app.config.provider.ts) — добавлены поля `username` и `password` для подключения к БД
- Обновлён [`film.repository.ts`](backend/src/repository/film.repository.ts) — переписан на TypeORM (использует `InjectRepository` и `Repository`)
- Обновлён [`film.converter.ts`](backend/src/repository/film.converter.ts) — работает с `FilmEntity` и `ScheduleEntity` вместо Mongoose-схем
- Обновлён [`order.service.ts`](backend/src/order/order.service.ts) — импорт `Film` заменён на `FilmEntity`
- Удалена Mongoose-схема [`film.schema.ts`](backend/src/repository/film.schema.ts)
- Обновлён `.env.example` — добавлены `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`
- Создан `.env` файл с настройками подключения к PostgreSQL
- Сборка `nest build` проходит успешно
- Линтинг `npm run lint` проходит без ошибок

#### Сущности базы данных

- **Film** (`film.entity.ts`) — хранит информацию о фильме: id, rating, director, tags, title, about, description, image, cover. Связана один-ко-многим с Schedule.
- **Schedule** (`schedule.entity.ts`) — хранит информацию о сеансах: id, daytime, hall, rows, seats, price, taken (занятые места). Связана многие-к-одному с Film.

#### SQL-скрипты для инициализации БД

В папке [`backend/test/`](backend/test/) находятся SQL-скрипты:

- [`prac.init.sql`](backend/test/prac.init.sql) — создание таблиц `film` и `schedule`
- [`prac.films.sql`](backend/test/prac.films.sql) — заполнение таблицы фильмов (6 фильмов)
- [`prac.shedules.sql`](backend/test/prac.shedules.sql) — заполнение таблицы расписания сеансов

## Установка и запуск

### Предварительные требования

- Node.js 18+
- PostgreSQL 14+ (установленная и запущенная)
- npm или yarn

### 1. Настройка PostgreSQL

Создайте базу данных и пользователя:

```sql
CREATE USER exampleuser WITH PASSWORD 'examplepass';
CREATE DATABASE exampledb OWNER exampleuser;
```

Выполните SQL-скрипты для создания таблиц и наполнения данными:

```bash
psql -U exampleuser -d exampledb < backend/test/prac.init.sql
psql -U exampleuser -d exampledb < backend/test/prac.films.sql
psql -U exampleuser -d exampledb < backend/test/prac.shedules.sql
```

### 2. Бэкенд

```bash
cd backend
npm ci
```

Создайте файл `.env` из примера `.env.example`:

```env
DATABASE_DRIVER="postgres"
DATABASE_HOST="localhost"
DATABASE_PORT="5432"
DATABASE_NAME="exampledb"
DATABASE_USERNAME="exampleuser"
DATABASE_PASSWORD="examplepass"
```

Запустите бэкенд:

```bash
npm run start:dev
```

Бэкенд будет доступен на `http://localhost:3001`.

### 3. Фронтенд

```bash
cd frontend
npm ci
```

Создайте файл `.env` из примера `.env.example`:

```env
VITE_API_URL=http://localhost:3001/api/afisha
VITE_CDN_URL=http://localhost:3001/content/afisha
```

Запустите фронтенд:

```bash
npm run dev
```

Фронтенд будет доступен на `http://localhost:5173`.

### Проверка работы

Отправьте тестовые запросы с помощью Postman (коллекция [`film.postman.json`](film.postman.json)) или curl:

```bash
# Список фильмов
curl http://localhost:3001/api/afisha/films

# Расписание фильма
curl http://localhost:3001/api/afisha/films/0e33c7f6-27a7-4aa0-8e61-65d7e5effecf/schedule

# Бронирование билетов
curl -X POST http://localhost:3001/api/afisha/order \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "phone": "+71234567890",
    "tickets": [
      {
        "film": "0e33c7f6-27a7-4aa0-8e61-65d7e5effecf",
        "session": "f2e429b0-685d-41f8-a8cd-1d8cb63b99ce",
        "row": 1,
        "seat": 1,
        "price": 350
      }
    ]
  }'
```

## Чек-лист

- ✅ Линтинг проходит без ошибок (`npm run lint`)
- ✅ Типизация TypeScript — без использования `any`
- ✅ Файловая структура соответствует стартеркиту (папки `films`, `order`, `repository`)
- ✅ Все параметры приложения берутся из `.env` через `ConfigModule`
- ✅ Данные хранятся в PostgreSQL через TypeORM
- ✅ Взаимодействие с БД вынесено в отдельный репозиторий (`FilmRepository`)
- ✅ Контроллеры не содержат бизнес-логики, только передача в сервисы
- ✅ Используются классы DTO
- ✅ Раздача статического контента из папки `public` через `ServeStaticModule`
- ✅ Компоненты NestJS используют внедрение через конструктор (DI)
- ✅ Фронтенд и бэкенд работают корректно, в консоли Network нет ошибок 500/404
- ✅ При повторном бронировании одного места запрос завершается ошибкой 400
- ✅ Занятые места сохраняются в поле `taken` в формате `${row}:${seat}`
- ✅ Приложение не падает при разных запросах
- ✅ Код и зависимости mongoose удалены из проекта
- ✅ Описаны сущности Film и Schedule со связью один-ко-многим
- ✅ Взаимодействие с данными через репозитории TypeORM
