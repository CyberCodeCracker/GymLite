# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GymLite is an e-commerce platform for gym equipment built with a microservices architecture: Spring Boot 4 / Spring Cloud backends and an Angular 19 frontend. All frontend traffic routes through a single API gateway.

## Commands

### Infrastructure (run first)
```bash
# From repo root — starts Postgres, MongoDB, Kafka, MailDev, Zipkin
docker compose up -d
```

### Backend services (start in this order)
```bash
# Each service has its own Maven wrapper — run from its directory
cd services/config-server  && ./mvnw spring-boot:run   # port 8888 — must start first
cd services/discovery-server && ./mvnw spring-boot:run # port 8761
cd services/auth     && ./mvnw spring-boot:run          # port 8095
cd services/customer && ./mvnw spring-boot:run          # depends on MongoDB
cd services/product  && ./mvnw spring-boot:run          # port 8050
cd services/payment  && ./mvnw spring-boot:run          # port 8060
cd services/notification && ./mvnw spring-boot:run      # Kafka consumer
cd services/order    && ./mvnw spring-boot:run          # port 8070 — start after customer/product/payment
cd services/gateway  && ./mvnw spring-boot:run          # port 8222 — start last
```

Build a single service (skip tests):
```bash
cd services/<name> && ./mvnw clean package -DskipTests
```

Run tests for a single service:
```bash
cd services/<name> && ./mvnw test
```

### Frontend
```bash
cd frontend
npm install
npm start       # dev server at http://localhost:4200
npm run build   # production build
npm test        # Karma unit tests
```

## Architecture

### Service map

| Service | Port | DB | Notes |
|---|---|---|---|
| config-server | 8888 | — | Serves YAML configs from `classpath:/configurations/` |
| discovery-server | 8761 | — | Eureka registry |
| gateway | 8222 | — | Spring Cloud Gateway (WebFlux), JWT validation |
| auth | 8095 | MongoDB | Custom RSA-signed JWT (RS256), issues access + refresh tokens |
| customer | — | MongoDB | CRUD; custom `@UniqueEmail` validation annotation |
| product | 8050 | Postgres | Flyway migrations; handles multipart image uploads |
| order | 8070 | Postgres | Feign clients → customer/product/payment; Kafka producer |
| payment | 8060 | Postgres | Kafka producer → notification |
| notification | — | MongoDB | Kafka consumer; sends HTML emails via Thymeleaf + JavaMail |

### Authentication & security

The auth service generates RS256 JWTs signed with a private key stored at `services/auth/src/main/resources/keys/private.pem`. The gateway validates tokens using the matching public key at `services/gateway/src/main/resources/keys/public.pem`. Both keys must exist before starting those services.

Gateway security (`SecurityConfig.java`): `/api/auth/**` and `/eureka/**` are public; everything else requires a valid JWT.

### Inter-service communication

Order service calls customer, product, and payment services via **OpenFeign** clients (`interfaces/CustomerClient`, `interfaces/PaymentClient`, `services/ProductClient`). The URLs are configured in `configurations/order-service.yml` and always go through the gateway (`http://localhost:8222/api/...`), not directly.

### Async event flow

1. Order created → `OrderProducer` publishes to **order-topic**
2. Payment processed → `NotificationProducer` (in payment service) publishes to **payment-topic**
3. Notification service consumes both topics, persists to MongoDB, and sends Thymeleaf HTML emails through MailDev (SMTP: 1025, UI: http://localhost:1080)

### Configuration

All services pull their config from the config server on startup (`optional:configserver:http://localhost:8888`). Service-specific YAML files live in `services/config-server/src/main/resources/configurations/`. Changes to those files require a service restart (no bus refresh is configured).

### Frontend structure

Angular 19 standalone components with lazy-loaded routes. All HTTP calls go to the gateway at `http://localhost:8222` (see `frontend/src/environments/environment.ts`). Auth state is managed via `token.service.ts`. Route protection uses two guards:
- `auth.guard.ts` — requires a valid JWT
- `role.guard.ts` — requires `admin`/`ROLE_ADMIN` role claim (for `/admin/**` routes)

The frontend feature layout: `features/auth`, `features/shop`, `features/cart`, `features/checkout`, `features/orders`, `features/profile`, `features/admin`.

### Databases

- **Postgres** (`post`/`post`) — three separate databases: `order`, `payment`, `product`
- **MongoDB** (`glite`/`GliteEcom200`) — databases: `auth`, `customer` (implicit), `notification` (implicit)
- Product service uses **Flyway** for migrations (`V1__` through `V4__` in `src/main/resources/db/migration/`)
- Other Postgres services use `ddl-auto: update`

### Observability

Zipkin distributed tracing is active on all services (http://localhost:9411). Sampling probability is 1.0 on the gateway; other services inherit defaults.
