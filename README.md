# GymLite

GymLite is an e-commerce web application for browsing and purchasing gym equipment. It is built with an Angular frontend and a Spring Boot microservices backend, with service discovery, centralized configuration, an API gateway, persistence, messaging, email notifications, and tracing.

## Features

- Product catalog with product listing and product detail pages
- Category browsing and category management
- Customer registration and login
- JWT-based authentication and role-based authorization
- Shopping cart and checkout flow
- Order creation and order line management
- Payment processing workflow
- Kafka-driven order and payment notifications
- Email templates for order and payment confirmations
- Admin dashboard for products, categories, and orders
- API Gateway routing for all backend services
- Eureka service discovery
- Centralized service configuration with Spring Cloud Config
- PostgreSQL and MongoDB persistence
- Flyway database migrations for product data
- Distributed tracing support with Zipkin

## Technologies Used

### Frontend

- Angular 19
- TypeScript
- RxJS
- Angular Router
- Angular Forms
- Tailwind CSS
- Font Awesome

### Backend

- Java 17
- Spring Boot 4
- Spring Cloud 2025.1
- Spring Cloud Gateway
- Spring Cloud Config Server
- Netflix Eureka
- Spring Security
- JWT with JJWT
- Spring Data JPA
- Spring Data MongoDB
- Spring Kafka
- Spring Mail
- Thymeleaf email templates
- MapStruct
- Lombok
- Flyway
- Maven Wrapper

### Infrastructure

- Docker Compose
- PostgreSQL
- MongoDB
- Mongo Express
- Apache Kafka
- Zookeeper
- MailDev
- Zipkin

## Project Structure

```text
GymLite/
|-- frontend/                  # Angular client application
|-- services/
|   |-- auth/                  # Authentication and JWT service
|   |-- config-server/         # Centralized Spring Cloud Config server
|   |-- customer/              # Customer profile service
|   |-- discovery-server/      # Eureka discovery server
|   |-- gateway/               # API gateway
|   |-- notification/          # Email and Kafka notification service
|   |-- order/                 # Order and order line service
|   |-- payment/               # Payment service
|   `-- product/               # Product and category service
|-- docker-compose.yml         # Local infrastructure containers
`-- README.md
```

## Local Requirements

- Git
- Docker and Docker Compose
- Java 17
- Node.js and npm
- A terminal that can run Maven Wrapper commands

## Clone the Project

```bash
git clone https://github.com/CyberCodeCracker/GymLite.git
cd GymLite
```

## Run Locally

### 1. Start Infrastructure Services

From the project root, start the databases, Kafka, MailDev, and Zipkin:

```bash
docker compose up -d
```

This starts:

| Service | URL / Port |
| --- | --- |
| PostgreSQL | `localhost:5434` |
| MongoDB | `localhost:27017` |
| Mongo Express | `http://localhost:8081` |
| Kafka | `localhost:9092` |
| Zookeeper | `localhost:2181` |
| MailDev UI | `http://localhost:1080` |
| Zipkin | `http://localhost:9411` |

### 2. Start Backend Services

Start the backend services in this order so configuration and discovery are available before the domain services register.

On Windows PowerShell:

```powershell
cd services\config-server
.\mvnw.cmd spring-boot:run
```

Open a new terminal for each service:

```powershell
cd services\discovery-server
.\mvnw.cmd spring-boot:run
```

```powershell
cd services\gateway
.\mvnw.cmd spring-boot:run
```

```powershell
cd services\auth
.\mvnw.cmd spring-boot:run
```

```powershell
cd services\product
.\mvnw.cmd spring-boot:run
```

```powershell
cd services\customer
.\mvnw.cmd spring-boot:run
```

```powershell
cd services\order
.\mvnw.cmd spring-boot:run
```

```powershell
cd services\payment
.\mvnw.cmd spring-boot:run
```

```powershell
cd services\notification
.\mvnw.cmd spring-boot:run
```

On macOS or Linux, use `./mvnw spring-boot:run` instead of `.\mvnw.cmd spring-boot:run`.

Backend ports:

| Service | Port |
| --- | --- |
| Config Server | `8888` |
| Discovery Server | `8761` |
| API Gateway | `8222` |
| Auth Service | `8095` |
| Product Service | `8050` |
| Customer Service | `8090` |
| Order Service | `8070` |
| Payment Service | `8060` |
| Notification Service | `8040` |

The frontend calls the backend through the API Gateway at:

```text
http://localhost:8222
```

### 3. Start the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

The Angular application should be available at:

```text
http://localhost:4200
```

## Useful URLs

- Frontend: `http://localhost:4200`
- API Gateway: `http://localhost:8222`
- Eureka Dashboard: `http://localhost:8761`
- Mongo Express: `http://localhost:8081`
- MailDev: `http://localhost:1080`
- Zipkin: `http://localhost:9411`

## API Gateway Routes

All frontend API calls go through the gateway:

| Route | Target |
| --- | --- |
| `/api/auth/**` | Auth Service |
| `/api/customer/**` | Customer Service |
| `/api/product/**` | Product Service |
| `/api/category/**` | Product Service |
| `/api/order/**` | Order Service |
| `/api/order-line/**` | Order Service |
| `/api/payment/**` | Payment Service |

## Stop Local Services

Stop the Angular and Spring Boot terminals with `Ctrl + C`.

Stop Docker infrastructure from the project root:

```bash
docker compose down
```

To remove local Docker volumes as well:

```bash
docker compose down -v
```
