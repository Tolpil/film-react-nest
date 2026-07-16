# FILM!

Fullstack-приложение кинотеатра: афиша фильмов и бронирование билетов.

## Стек технологий

- **Бэкенд:** NestJS, MongoDB (Mongoose), Express
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

## API Endpoints

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| GET | `/api/afisha/films` | Список фильмов |
| GET | `/api/afisha/films/:id/schedule` | Расписание фильма |
| POST | `/api/afisha/order` | Бронирование билетов |
| GET | `/content/afisha/*` | Статический контент |

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
