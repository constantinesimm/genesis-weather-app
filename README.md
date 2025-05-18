# Weather Forecast API

> API для отримання прогнозу погоди та управління підписками на оновлення.

---

## Технології

* **NestJS** (Node.js + TypeScript)
* **TypeORM** + **PostgreSQL**
* **Swagger** (OpenAPI 3)
* **Docker & Docker Compose**
* **Nodemailer** (MailerService)

---

## Зміст

1. [Швидкий старт через Docker](#швидкий-старт-через-docker)
2. [Локальний запуск без Docker](#локальний-запуск-без-docker)
3. [Налаштування `.env`](#налаштування-env)
4. [Міграції бази даних](#міграції-бази-даних)
5. [Підключення до PostgreSQL](#підключення-до-postgresql)
6. [Документація API](#документація-api)

---

## Швидкий старт через Docker

```bash
git clone git@github.com:constantinesimm/genesis-weather-app.git
cd genesis-weather-app
//перед запуском потрібно додати свій WEATHERAPI_KEY сервісу weatherapi.com в файл .env.example
docker-compose up --build
```

1. Контейнер `app` почекає базу, виконає міграції та запустить сервер.
2. Відкрийте Swagger UI: `http://localhost:3000/api/docs`

---

## Локальний запуск без Docker

1. Встановіть залежності:

   ```bash
   npm install
   ```
2. Скопіюйте `.env`:

   // перед копіюванням потрібно додати свій WEATHERAPI_KEY сервісу weatherapi.com в файл .env.example
   ```bash
   cp .env.example .env
   ```
3. Побудуйте проєкт:

   ```bash
   npm run build
   ```
4. Запустіть міграції програмно:

   ```bash
   node dist/migrations-runner.js
   ```
5. Запустіть у режимі розробки:

   ```bash
   npm run start:dev
   ```
6. Перейдіть до `http://localhost:3000/api/docs`

---

## Налаштування `.env`

```dotenv
# Загальні
APP_HOST=http://localhost
APP_PORT=3000

# WeatherAPI
WEATHERAPI_URL=https://api.weatherapi.com/v1
WEATHERAPI_KEY=ваш_ключ

# PostgreSQL
DB_HOST=db
DB_PORT=5432       # всередині Docker. зовнішній 5433
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=weatherdb

# SMTP для пошти
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_user
SMTP_PASS=your_pass
```

---

## Міграції бази даних

* Файли міграцій у `src/migrations`.
* Конфігурація у `ormconfig.js` або `TypeOrmModule.forRoot`:

  ```js
  migrations: ['dist/migrations/*.js'],
  cli: { migrationsDir: 'src/migrations' },
  ```
* Запуск:

  ```bash
  node dist/migrations-runner.js
  ```

---

## Підключення до PostgreSQL

### Через pgAdmin

* **Host**: `localhost`
* **Port**: `5433` (зовнішній) або `5432` (в контейнері)
* **Database**: `weatherdb`
* **Username**: `postgres`
* **Password**: `postgres`

### Через psql CLI

```bash
psql -h localhost -p 5433 -U postgres -d weatherdb
```

---

## Документація API

### Swagger UI

`GET http://localhost:3000/api/docs`

### Основні ендпоінти

* `GET  /api/weather?city={city}` — поточна погода.
* `POST /api/subscribe` — підписатися.
* `GET  /api/confirm/{token}` — підтвердити підписку.
* `GET  /api/unsubscribe/{token}` — відписатися.
