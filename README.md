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

### Первая часть проектной работы — Модульный API-сервис (часть 1)

Реализация базового бэкенда на NestJS с хранением данных в MongoDB через Mongoose.

#### Step 1. Создание компонентов Nest.js
- Созданы контроллеры и сервисы для модулей `films` и `order`
- Реализованы эндпоинты-пустышки
- Подключён `ServeStaticModule` для раздачи статического контента по пути `/content/afisha/*`
- Описаны DTO-классы для фильмов (`FilmDto`, `ScheduleDto`, `FilmScheduleDto`) и заказов (`TicketDto`, `CreateOrderDto`, `OrderDto`)

#### Step 2. Имплементация хранилища
- Созданы Mongoose-схемы для фильмов (`Film`, `Schedule`) с коллекцией `films`
- Реализован MongoDB репозиторий (`FilmRepository`) с методами `findAll`, `findById`, `findScheduleById`
- Создан конвертер (`FilmConverter`) для преобразования DTO в сущности Mongoose и обратно
- Подключён `MongooseModule` в корневой модуль приложения
- Заполнена база данных 6 фильмами из `mongodb_initial_stub.json` через seed-скрипт

#### Step 3. Имплементация бизнес-логики бронирования билетов
- Реализован метод `createOrder()` в `OrderService`:
  - Поиск фильма и сеанса по идентификаторам
  - Валидация цены билета
  - Проверка, что ряд и место находятся в пределах зала
  - Проверка, что место ещё не занято (ошибка `BadRequestException` при повторе)
  - Сохранение занятого места в формате `${row}:${seat}` в поле `taken` сеанса
  - Поддержка нескольких билетов в одном заказе (в т.ч. на разные фильмы)

#### Step 3.1. Исправление возврата расписания
- Исправлен метод `getFilmSchedule()` в `FilmsService` — теперь возвращает плоский массив сеансов, а не объект фильма с вложенным `schedule`

#### Step 4. Завершение
- Проверена работа всего приложения в соответствии с чек-листом
- Исправлена типизация — убрано использование `any`
- Фронтенд и бэкенд работают корректно

---

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

- **Film** ([`film.entity.ts`](backend/src/repository/film.entity.ts)) — хранит информацию о фильме: id, rating, director, tags, title, about, description, image, cover. Связана один-ко-многим с Schedule.
- **Schedule** ([`schedule.entity.ts`](backend/src/repository/schedule.entity.ts)) — хранит информацию о сеансах: id, daytime, hall, rows, seats, price, taken (занятые места). Связана многие-к-одному с Film.

#### SQL-скрипты для инициализации БД

В папке [`backend/test/`](backend/test/) находятся SQL-скрипты:

- [`prac.init.sql`](backend/test/prac.init.sql) — создание таблиц `film` и `schedule`
- [`prac.films.sql`](backend/test/prac.films.sql) — заполнение таблицы фильмов (6 фильмов)
- [`prac.shedules.sql`](backend/test/prac.shedules.sql) — заполнение таблицы расписания сеансов

---

### Третья часть проектной работы — Деплой сервиса

Реализация системы логирования, юнит-тестов, контейнеризация и автоматизация деплоя.

#### Шаг 1. Реализация логгеров

Созданы три логгера в директории [`backend/src/logger/`](backend/src/logger/):

- **DevLogger** ([`dev-logger.ts`](backend/src/logger/dev-logger.ts)) — наследуется от `ConsoleLogger` NestJS, используется в режиме разработки. Сохраняет цветной вывод в консоль.
- **JsonLogger** ([`json-logger.ts`](backend/src/logger/json-logger.ts)) — реализует `LoggerService`, выводит логи в формате JSON: `{"level": "...", "message": "...", "optionalParams": [...]}`.
- **TSKVLogger** ([`tskv-logger.ts`](backend/src/logger/tskv-logger.ts)) — реализует `LoggerService`, выводит логи в формате TSKV (Tab-Separated Key-Value): `level=...\tmessage=...\tcontext=...`.

Выбор логгера происходит через переменную окружения `LOG_FORMAT` в файле `.env`:
- `dev` (по умолчанию) — DevLogger
- `json` — JsonLogger
- `tskv` — TSKVLogger

Логгер подключается в [`main.ts`](backend/src/main.ts) через `app.useLogger()` с опцией `bufferLogs: true`. Выбор реализации осуществляется через `switch` по переменной `LOG_FORMAT`.

#### Шаг 2. Написание тестов

Созданы юнит-тесты для логгеров и контроллеров:

- **JsonLogger** ([`json-logger.spec.ts`](backend/src/logger/json-logger.spec.ts)) — 7 тестов: проверка формата JSON, включения optionalParams, вызовов console.log/error/warn/debug
- **TSKVLogger** ([`tskv-logger.spec.ts`](backend/src/logger/tskv-logger.spec.ts)) — 8 тестов: проверка формата TSKV, включения контекста, вызовов console.log/error/warn/debug, форматирования объектов
- **FilmsController** ([`films.controller.spec.ts`](backend/src/films/films.controller.spec.ts)) — 3 теста: проверка создания контроллера, получения списка фильмов и расписания
- **OrderController** ([`order.controller.spec.ts`](backend/src/order/order.controller.spec.ts)) — 2 теста: проверка создания контроллера и бронирования билетов

Все тесты объединены в блоки `describe` с описанием проверяемой функциональности. Каждый тест содержит корректное описание того, что проверяет.

Результат запуска `npm test`: **20 тестов, 0 ошибок**.

#### Шаг 3. Деплой — контейнеризация и Docker Compose

Выполнена полная докеризация приложения для деплоя на удалённый сервер.

**Dockerfile бэкенда** ([`backend/Dockerfile`](backend/Dockerfile)):
- **Stage 1 (build)**: установка зависимостей и сборка проекта (`npm run build`)
- **Stage 2 (production)**: только production-зависимости и собранный `dist`
- Указан образ в реестре `ghcr.io`

**Dockerfile фронтенда** ([`frontend/Dockerfile`](frontend/Dockerfile)):
- **Stage 1 (build)**: установка зависимостей и сборка статики (`npm run build`)
- **Stage 2 (production)**: только собранный `dist` в volume для nginx
- Указан образ в реестре `ghcr.io`

**Nginx** ([`nginx/`](nginx/)):
- Отдельный сервис для раздачи статики и проксирования запросов
- Конфиг ([`nginx.conf`](nginx/nginx.conf)): раздача `index.html`, прокси `/api/` и `/content/` в бэкенд
- Dockerfile ([`nginx/Dockerfile`](nginx/Dockerfile)) на основе `nginx:1.25-alpine`
- Указан образ в реестре `ghcr.io`

**Docker Compose** ([`docker-compose.yml`](docker-compose.yml)):
- `database` — PostgreSQL 14 с healthcheck и init-скриптами
- `pgadmin` — pgAdmin 4 на порту 8080 для администрирования БД
- `backend` — NestJS приложение, подключение к БД через переменные окружения
- `frontend-build` — сборка фронтенда в volume `frontend-dist`
- `nginx` — раздача статики из volume, прокси на backend
- Все сервисы в одной сети `app-network`
- Volumes: `pgdata` (БД), `pgadmin-data` (pgAdmin), `frontend-dist` (фронтенд)
- Политика перезапуска `unless-stopped` для всех сервисов (кроме `frontend-build`)

**Исправления в Dockerfile:**
- [`backend/Dockerfile`](backend/Dockerfile): обновлён `node:18-alpine` → `node:20-alpine` (ошибка `crypto is not defined` в `@nestjs/typeorm`)
- [`frontend/Dockerfile`](frontend/Dockerfile): добавлена установка `@rollup/rollup-linux-x64-musl` (ошибка `Cannot find module` на Alpine) и заменён `FROM scratch` на `FROM alpine:3.19` (ошибка `no command specified`)

Запуск проекта:
```bash
docker compose up -d --build
```

После запуска:
- Фронтенд доступен на `http://localhost:80`
- pgAdmin доступен на `http://localhost:8080`
- Бэкенд API доступен на `http://localhost:3000`

#### Шаг 4. Автоматизация деплоя (CI/CD)

Создан GitHub Action ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)), который при пуше в ветку `main`:
1. Настраивает Docker Buildx через `docker/setup-buildx-action@v3`
2. Логинится в GitHub Container Registry (ghcr.io) через `GITHUB_TOKEN`
3. Собирает и публикует три образа:
   - `ghcr.io/<repo>-backend` — бэкенд на NestJS
   - `ghcr.io/<repo>-frontend` — фронтенд (собранный dist)
   - `ghcr.io/<repo>-nginx` — nginx для раздачи статики и прокси
4. Для каждого образа используются теги и метаданные через `docker/metadata-action@v5`

**Production-конфигурация** ([`docker-compose.prod.yml`](docker-compose.prod.yml)):
- Использует готовые образы из ghcr.io вместо локальной сборки
- Содержит сервис `frontend-build` с volume `frontend-dist` для передачи статики в nginx
- Предназначен для развёртывания на удалённом сервере

**Проверка линтинга:**
- Бэкенд: `npm run lint` — 0 ошибок (исправлены CRLF-окончания строк через `--fix`)
- Фронтенд: `npx eslint src/` — 0 ошибок

#### Шаг 5. Развёртывание на удалённом сервере (Yandex Cloud)

Приложение развёрнуто на виртуальной машине Yandex Cloud.

**Подготовка сервера:**
1. Создана учётная запись Yandex Cloud и платёжный аккаунт (использован грант)
2. Создана виртуальная машина с публичным SSH-ключом
3. Создано доменное имя через `domain.nomoreparties.site` и привязано к ВМ
4. На сервере установлен Docker

**Запуск приложения:**
1. На сервере создана директория проекта
2. Скопированы [`docker-compose.prod.yml`](docker-compose.prod.yml) и `.env` с настройками
3. Запущены контейнеры: `docker compose -f docker-compose.prod.yml up -d`
4. Образы спулены из GitHub Container Registry (ghcr.io)

**Наполнение базы данных:**
1. Выполнен вход в pgAdmin по адресу `http://<domain>:8080`
2. Добавлено подключение к PostgreSQL (хост: `database`, порт: `5432`)
3. Выполнены SQL-скрипты: `prac.init.sql` (создание таблиц), `prac.films.sql` (фильмы), `prac.shedules.sql` (расписание)

**Безопасность:**
- Порт PostgreSQL (5432) закрыт через фаервол, доступ только через SSH-туннель
- Порт pgAdmin (8080) закрыт через фаервол при необходимости

**Ссылка на задеплоенное приложение:** `https://<domain>`

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

Бэкенд будет доступен на `http://localhost:3000`.

### 3. Фронтенд

```bash
cd frontend
npm ci
```

Создайте файл `.env` из примера `.env.example`:

```env
VITE_API_URL=http://localhost:3000/api/afisha
VITE_CDN_URL=http://localhost:3000/content/afisha
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
curl http://localhost:3000/api/afisha/films

# Расписание фильма
curl http://localhost:3000/api/afisha/films/0e33c7f6-27a7-4aa0-8e61-65d7e5effecf/schedule

# Бронирование билетов
curl -X POST http://localhost:3000/api/afisha/order \
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
