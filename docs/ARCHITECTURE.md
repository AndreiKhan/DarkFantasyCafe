# Архитектура

## Общая схема

```mermaid
flowchart LR
    Browser["Браузер"] -->|HTTP :8080| NGINX

    subgraph VPS["VPS · Docker Compose"]
        subgraph FE["контейнер frontend"]
            NGINX["nginx"] --> SPA["React SPA<br/>(статика)"]
        end

        subgraph BE["контейнер backend"]
            API["Fastify API<br/>/api/*"]
            STATIC["Статика<br/>/uploads/*"]
        end

        NGINX -->|"/api/ → proxy"| API
        NGINX -->|"/uploads/ → proxy"| STATIC

        API --> PRISMA["Prisma ORM"]
        PRISMA --> PG[("PostgreSQL 16<br/>volume pgdata")]
        STATIC --- VOL[("volume uploads")]
    end

    API <-->|"создание платежа /<br/>проверка статуса"| YK["💳 YooKassa API"]
    YK -.->|webhook| API
```

## Backend

Каждый модуль устроен одинаково:

```
route → service → repository
```

## Frontend

Feature-Sliced Design, направление импортов контролируется линтером:

```
app
 └─> pages
      └─> widgets
           └─> features
                └─> entities
                     └─> shared
```

## Аутентификация

```mermaid
sequenceDiagram
    participant C as Клиент (SPA)
    participant A as Backend /api/auth

    C->>A: POST /login (email, password)
    A-->>C: accessToken (JWT, 15 мин) — в памяти<br/>refreshToken (7 дней) — httpOnly cookie

    Note over C: access истёк → любой запрос вернул 401

    C->>A: POST /refresh (cookie)
    A->>A: сверка SHA-256-хеша токена в БД,<br/>ротация: старый удалён, выдан новый
    A-->>C: новый accessToken + новый refresh-cookie
```

## Бизнес-процесс: бронирование и оплата

### Статусная модель брони

```mermaid
stateDiagram-v2
    [*] --> DRAFT : пользователь собрал бронь
    DRAFT --> PENDING_PAYMENT : нажал «Оплатить» — создан платёж YooKassa
    DRAFT --> [*] : не оплатил — авто-удаление через 15 мин
    PENDING_PAYMENT --> CONFIRMED : платёж успешен и стол свободен
    PENDING_PAYMENT --> CANCELLED : платёж отклонён / истёк TTL 60 мин / стол успели занять
    CONFIRMED --> [*]
    CANCELLED --> [*]
```

### Последовательность оплаты

```mermaid
sequenceDiagram
    actor U as Пользователь
    participant F as Frontend (SPA)
    participant B as Backend (Fastify)
    participant Y as YooKassa

    U->>F: дата, стол, мастер, блюда
    F->>B: POST /api/reservation
    B->>B: проверка слота (рабочие часы, буфер 30 мин, конфликты)
    B-->>F: бронь DRAFT + сумма

    U->>F: «Оплатить»
    F->>B: POST /api/reservation/:id/pay
    B->>Y: создать платёж (metadata: reservationId)
    Y-->>B: confirmationUrl
    B-->>F: статус PENDING_PAYMENT + ссылка
    F->>Y: redirect на страницу оплаты

    Y-->>B: webhook /api/payments/yookassa/webhook
    B->>Y: запрос статуса платежа (сверка с API)
    B->>B: CONFIRMED (или CANCELLED, если стол заняли)

    U->>F: возврат на /reserve/success
    F->>B: polling GET /api/reservation/:id/status
    B-->>F: CONFIRMED ✅
```

Занятость стола проверяется трижды: при выборе, перед созданием платежа и после его подтверждения — конфликт на последнем шаге отменяет бронь.
