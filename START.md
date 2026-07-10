# Запуск проекта

Два способа: через Docker (всё в контейнерах, ближе к проду) или локально через `npm run dev` (для разработки, с hot reload).

---

## Вариант 1. Docker

**Требования:** Docker + Docker Compose.

### 1. Клонировать и настроить окружение

```bash
git clone https://github.com/AndreiKhan/DarkFantasyCafe
cd DarkFantasyCafe

cp .env.example .env
cp backend/.env.example backend/.env
```

Заполнить `.env`

Заполнить `backend/.env`

### 2. Собрать и запустить

```bash
docker compose up -d --build
```

Поднимутся все три контейнера

### 3. Открыть

- Приложение: **http://localhost:8080**
- Swagger: **http://localhost:8080/api/docs**

---

## Вариант 2. Локально через npm run dev

**Требования:** Node.js 22+, PostgreSQL 16 (запущен локально).

### 1. База данных

Создать пустую БД, например: `baldgoose`

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Заполнить `backend/.env`

Применить миграции, применить сиды:

```bash
npx prisma migrate dev
npm run seed
npm run dev
```

Swagger будет доступен на **http://localhost:5000/api/docs**

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

Заполнить `frontend/.env`

Запуск:

```bash
npm run dev
```

---

## Тестовые учётные записи из seed

| Роль | Email | Пароль |
|------|-------|--------|
| Админ | `admin@baldgoose.ru` | `password123` |
| Пользователь | `guest@baldgoose.ru` | `password123` |
| Мастер | `master1@baldgoose.ru` … `master4@baldgoose.ru` | `password123` |

---

## Тесты

Интеграционные тесты backend:

```bash
cd backend
npm test
```
