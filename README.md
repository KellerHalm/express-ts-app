# express-app

Todo list REST API на Express 5 и TypeScript. SQLite через Prisma, JWT-авторизация, валидация на zod.

## Стек

- Express 5, TypeScript (strict)
- Prisma 6 + SQLite
- zod — валидация
- jsonwebtoken + bcryptjs — аутентификация
- tsx — запуск TS без сборки

## Запуск

```bash
npm install
npm run migrate   # создаст prisma/dev.db и применит миграции
npm run seed      # необязательно: демо-пользователь
npm run dev
```

Сервер: http://localhost:3000, префикс API — `/api`.

Демо-пользователь после `npm run seed`: `demo@example.com` / `password1`.

## Переменные окружения

В `.env` (создаётся вручную, в gitignore):

| Переменная    | По умолчанию | Назначение              |
| ------------- | ------------ | ----------------------- |
| `DATABASE_URL`| `file:./dev.db` | путь к SQLite-файлу |
| `JWT_SECRET`  | `dev-secret` | ключ подписи токенов    |
| `PORT`        | `3000`       | порт                   |
| `CORS_ORIGIN` | `*`          | разрешённый origin      |

Для продакшна задай `JWT_SECRET` через окружение.

## Скрипты

| Команда             | Действие                              |
| ------------------- | ------------------------------------- |
| `npm run dev`       | сервер с автоперезапуском             |
| `npm start`         | сервер без watch                      |
| `npm run typecheck` | проверка типов                        |
| `npm run migrate`   | миграции Prisma                       |
| `npm run seed`      | демо-данные                           |
| `npm run generate`  | генерация клиента Prisma              |
| `npm run studio`    | GUI для просмотра данных              |

## API

Все todo требуют заголовка `Authorization: Bearer <token>`, полученного при регистрации или логине.

| Метод  | Путь                 | Тело / параметры        | Ответ                        |
| ------ | -------------------- | ----------------------- | ---------------------------- |
| `GET`  | `/api/health`        | —                       | `200 { status }`              |
| `POST` | `/api/auth/register` | `{ email, password }`   | `201 { token, user }`         |
| `POST` | `/api/auth/login`    | `{ email, password }`   | `200 { token, user }`         |
| `GET`  | `/api/auth/me`       | —                       | `200 { id, email }`           |
| `GET`  | `/api/todos`         | `?done=&search=`        | `200 Todo[]`                  |
| `POST` | `/api/todos`         | `{ title }`             | `201 Todo`                    |
| `PATCH`| `/api/todos/:id`     | `{ title?, done? }`     | `200 Todo`                    |
| `DELETE`| `/api/todos/:id`     | —                       | `204`                         |

`Todo`: `{ id, title, done, createdAt, updatedAt }`.

Пароль минимум 8 символов, title — непустая строка до 200 символов. `done` в query принимает `true` или `false`.

## Ошибки

```json
{ "error": "todo not found" }
```

| Код  | Когда                                                    |
| ---- | -------------------------------------------------------- |
| `400`| валидация не прошла, список issues в `issues`            |
| `401`| нет токена, токен невалиден, неверный пароль             |
| `404`| маршрут, todo или пользователь не найдены                |
| `409`| email уже зарегистрирован                                |

## Примеры

```bash
TOKEN=$(curl -s -X POST localhost:3000/api/auth/register \
  -H 'content-type: application/json' \
  -d '{"email":"me@example.com","password":"password1"}' | jq -r .token)

curl -X POST localhost:3000/api/todos \
  -H 'content-type: application/json' -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"купить хлеб"}'

curl 'localhost:3000/api/todos?done=false' -H "Authorization: Bearer $TOKEN"

curl -X DELETE localhost:3000/api/todos/ID -H "Authorization: Bearer $TOKEN"
```

## Структура

```
.env                   переменные окружения
prisma/
  schema.prisma        модели User и Todo
  migrations/          миграции
  dev.db               база SQLite (создаётся миграцией)
  seed.ts              демо-данные
src/
  app.ts               сборка приложения: cors, json, роутеры, обработка ошибок
  index.ts             запуск сервера
  config.ts            настройки из env
  db.ts                Prisma client
  types.ts             типы и Request.userId
  middleware/          auth, validate, error
  schemas/             zod-схемы
  controllers/         auth, todo
  routers/             auth.routes, todo.routes, index
```