-- Создание базы данных и пользователя
-- Выполнять от лица супер-пользователя postgres

-- CREATE USER exampleuser WITH PASSWORD 'examplepass';
-- CREATE DATABASE exampledb OWNER exampleuser;

-- Таблица фильмов
CREATE TABLE IF NOT EXISTS film (
    id VARCHAR(255) PRIMARY KEY,
    rating DOUBLE PRECISION NOT NULL,
    director VARCHAR(255) NOT NULL,
    tags TEXT[] DEFAULT '{}',
    title VARCHAR(255) NOT NULL,
    about TEXT NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(255) NOT NULL,
    cover VARCHAR(255) NOT NULL
);

-- Таблица расписания сеансов
CREATE TABLE IF NOT EXISTS schedule (
    id VARCHAR(255) PRIMARY KEY,
    "daytime" VARCHAR(255) NOT NULL,
    hall INTEGER NOT NULL,
    rows INTEGER NOT NULL,
    seats INTEGER NOT NULL,
    price INTEGER NOT NULL,
    taken TEXT[] DEFAULT '{}',
    "filmId" VARCHAR(255) NOT NULL,
    CONSTRAINT fk_film
        FOREIGN KEY ("filmId")
        REFERENCES film(id)
        ON DELETE CASCADE
);