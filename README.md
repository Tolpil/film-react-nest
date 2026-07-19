# FILM!

Fullstack-приложение кинотеатра: афиша фильмов и бронирование билетов.

## Стек технологий

- **Бэкенд:** NestJS, PostgreSQL (TypeORM), Express
- **Фронтенд:** React 18, TypeScript, Vite, SCSS, Storybook
- **API:** OpenAPI 3.0 (см. [`film.yml`](film.yml))

## Структура проекта

```
film-react-nest/
├── backend/          # Бэкенд на NestJS
│   ├── src/
│   │   ├── films/    # Модуль фильмов
│   │   ├── order/    # Модуль заказов
│   │   └── repository/  # Репозиторий для хранения данных
│   ├── public/       # Статические файлы (изображения)
│   └── test/         # Тесты
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

### Step 1. Создание компонентов Nest.js
- Созданы контроллеры и сервисы для модулей `films` и `order`
- Реализованы эндпоинты-пустышки:
  - `GET /api/afisha/films` — возвращает `{ total: 0, items: [] }`
  - `GET /api/afisha/films/:id/schedule` — возвращает `{ total: 0, items: [] }`
  - `POST /api/afisha/order` — возвращает `{ total: 0, items: [] }`
- Подключён `ServeStaticModule` для раздачи статического контента по пути `/content/afisha/*`
- Описаны DTO-классы для фильмов (`FilmDto`, `ScheduleDto`, `FilmScheduleDto`) и заказов (`TicketDto`, `CreateOrderDto`, `OrderDto`)

### Step 2. Имплементация хранилища
- Созданы Mongoose-схемы для фильмов (`Film`, `Schedule`) с коллекцией `films`
- Реализован MongoDB репозиторий (`FilmRepository`) с методами `findAll`, `findById`, `findScheduleById`
- Создан конвертер (`FilmConverter`) для преобразования DTO в сущности Mongoose и обратно
- Подключён `MongooseModule` в корневой модуль приложения
- Создан `.env` файл с настройками подключения к MongoDB
- Заполнена база данных 6 фильмами из `mongodb_initial_stub.json` через seed-скрипт
- `GET /api/afisha/films` — возвращает 6 фильмов с полными данными
- `GET /api/afisha/films/:id/schedule` — возвращает расписание с сеансами

### Step 3. Имплементация бизнес-логики бронирования билетов
- Реализован метод `createOrder()` в `OrderService`:
  - Поиск фильма и сеанса по идентификаторам
  - Валидация цены билета
  - Проверка, что ряд и место находятся в пределах зала
  - Проверка, что место ещё не занято (ошибка `BadRequestException` при повторе)
  - Сохранение занятого места в формате `${row}:${seat}` в поле `taken` сеанса
  - Поддержка нескольких билетов в одном заказе (в т.ч. на разные фильмы)
- Добавлен метод `update()` в `FilmRepository` для сохранения изменений в MongoDB
- `POST /api/afisha/order` — возвращает `{ total, items }` с подтверждением бронирования

### Step 3.1. Исправление возврата расписания
- Исправлен метод `getFilmSchedule()` в `FilmsService`:
  - Раньше возвращал `items: [result]` (объект фильма с вложенным `schedule`)
  - Теперь возвращает `items: result.schedule` (плоский массив сеансов)
- Это позволило фронтенду корректно отображать схему зала с выбором мест

### Step 4. Завершение
- Проверена работа всего приложения в соответствии с чек-листом:
  - ✅ Линтинг проходит без ошибок (`npm run lint`)
  - ✅ Типизация TypeScript — исправлено использование `any` на `Partial<Film>`
  - ✅ Файловая структура соответствует стартеркиту (папки `films`, `order`, `repository`)
  - ✅ Все параметры приложения берутся из `.env` через `ConfigModule`
  - ✅ Данные хранятся в MongoDB через Mongoose
  - ✅ Взаимодействие с БД вынесено в отдельный репозиторий (`FilmRepository`)
  - ✅ Контроллеры не содержат бизнес-логики, только передача в сервисы
  - ✅ Используются классы DTO
  - ✅ Раздача статического контента из папки `public` через `ServeStaticModule`
  - ✅ Компоненты NestJS используют внедрение через конструктор (DI)
  - ✅ Фронтенд и бэкенд работают корректно, в консоли Network нет ошибок 500/404
  - ✅ При повторном бронировании одного места запрос завершается ошибкой 400
  - ✅ Занятые места сохраняются в поле `taken` в формате `${row}:${seat}`
  - ✅ Приложение не падает при разных запросах
- Пользователь может:
  - просмотреть список фильмов (`GET /api/afisha/films`)
  - ознакомиться с конкретным фильмом и его сеансами (`GET /api/afisha/films/:id/schedule`)
  - создать заказ (`POST /api/afisha/order`)

---

## Вторая часть проектной работы — Модульный API-сервис (часть 2)

Перевод бэкенда с MongoDB на PostgreSQL с использованием TypeORM.

### Шаг 1. Подготовка окружения

- Создана ветка `review-2` от `main`
- Установлены зависимости `@nestjs/typeorm`, `typeorm`, `pg` для работы с PostgreSQL

### Шаг 2. Подключение TypeORM и PostgreSQL

- Обновлён [`app.module.ts`](backend/src/app.module.ts) — `MongooseModule` заменён на `TypeOrmModule` с подключением к PostgreSQL
- Обновлён [`app.config.provider.ts`](backend/src/app.config.provider.ts) — добавлены поля `username` и `password` для подключения к БД
- Обновлён [`film.repository.ts`](backend/src/repository/film.repository.ts) — переписан на TypeORM (использует `InjectRepository` и `Repository`)
- Обновлён [`film.converter.ts`](backend/src/repository/film.converter.ts) — работает с `FilmEntity` и `ScheduleEntity` вместо Mongoose-схем
- Обновлён [`order.service.ts`](backend/src/order/order.service.ts) — импорт `Film` заменён на `FilmEntity`
- Удалена Mongoose-схема [`film.schema.ts`](backend/src/repository/film.schema.ts)
- Обновлён `.env.example` — добавлены `DATABASE_DRIVER=postgres`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`
- Создан `.env` файл с настройками подключения к PostgreSQL
- Сборка `nest build` проходит успешно

## Установка

### MongoDB

Установите MongoDB скачав дистрибутив с официального сайта или с помощью пакетного менеджера вашей ОС. Также можно воспользоваться Docker (см. ветку `feat/docker`).

Выполните скрипт `test/mongodb_initial_stub.js` в консоли `mongo`.

### Бэкенд

Перейдите в папку с исходным кодом бэкенда

`cd backend`

Установите зависимости (точно такие же, как в package-lock.json) помощью команд

`npm ci` или `yarn install --frozen-lockfile`

Создайте `.env` файл из примера `.env.example`, в нём укажите:

* `DATABASE_DRIVER` - тип драйвера СУБД - в нашем случае это `mongodb` 
* `DATABASE_URL` - адрес СУБД MongoDB, например `mongodb://127.0.0.1:27017/practicum`.  

MongoDB должна быть установлена и запущена.

Запустите бэкенд:

`npm start:debug`

Для проверки отправьте тестовый запрос с помощью Postman или `curl`.

### Фронтенд

Перейдите в папку фронтенда:

`cd frontend`

Установите зависимости:

`npm ci`

Создайте `.env` файл из примера `.env.example`:

* `VITE_API_URL` - URL бэкенд API
* `VITE_CDN_URL` - URL для статического контента

Запустите фронтенд:

`npm run dev`
