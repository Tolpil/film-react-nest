# Film — Frontend (React + TypeScript + Vite)

Фронтенд-часть сервиса для покупки билетов в кинотеатр. Реализован на React с TypeScript, сборка Vite.

## Стек

- **Фреймворк:** React 18
- **Язык:** TypeScript
- **Сборщик:** Vite 5
- **Стили:** SCSS (CSS-модули)
- **Storybook:** 8 (для изолированной разработки компонентов)

## Переменные окружения

Создайте файл `.env` в корне frontend на основе `.env.example`:

```env
VITE_API_URL=https://stub.practicum-team.ru/api/afisha
VITE_CDN_URL=https://stub.practicum-team.ru/content/afisha
```

| Переменная    | Описание              | Значение по умолчанию                              |
|---------------|-----------------------|----------------------------------------------------|
| VITE_API_URL  | Базовый URL API       | https://stub.practicum-team.ru/api/afisha          |
| VITE_CDN_URL  | URL для статического контента (изображения) | https://stub.practicum-team.ru/content/afisha |

## Установка и запуск

```bash
# Установка зависимостей
$ npm install

# Запуск в режиме разработки
$ npm run dev

# Сборка для production
$ npm run build

# Предпросмотр production-сборки
$ npm run preview
```

## Storybook

```bash
# Запуск Storybook
$ npm run storybook

# Сборка Storybook
$ npm run build-storybook
```

## Линтинг

```bash
$ npm run lint
```

## Структура проекта

```
src/
├── components/         # React-компоненты
│   ├── App/
│   ├── Basket/
│   ├── Button/
│   ├── Card/
│   ├── ContactsForm/
│   ├── FilmInfo/
│   ├── FilmPreview/
│   ├── FilmsGallery/
│   ├── Header/
│   ├── Layout/
│   ├── Message/
│   ├── Modal/
│   ├── ModalHeader/
│   ├── SelectPlaces/
│   ├── SelectSession/
│   └── Ticket/
├── hooks/              # Кастомные React-хуки
│   └── useAppState.tsx
├── utils/              # Утилиты
│   ├── api.ts
│   ├── constants.ts
│   └── state.ts
├── scss/               # Глобальные стили и миксины
├── stories/            # Конфигурация Storybook
├── assets/             # Статические ресурсы (SVG)
├── main.tsx            # Точка входа
└── index.scss          # Глобальные стили
