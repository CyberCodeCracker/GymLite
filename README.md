# GymLite
**GymLite** is a modern microservices-based online shopping system built with Spring Boot and Spring Cloud.  
It follows a **microservices architecture** for scalability, maintainability, and resilience, with event-driven communication via **Apache Kafka**.

## Tech Stack
### Backend
- **Java 17** / **Spring Boot 4.x**
- **Spring Cloud 2025.1.0** → Netflix Eureka (Service Discovery), Config Server
- **Apache Kafka 4.1.1** → Event-driven communication (order confirmations, payment notifications)
- **Spring Cloud OpenFeign** → Inter-service REST communication
- **PostgreSQL** → Order, Payment services
- **MongoDB** → Customer, Notification services
- **MapStruct 1.5.5** → DTO mapping
- **Maven** (multi-module project)

### Infrastructure / DevOps
- **Docker** + **Docker Compose** (Kafka, Zookeeper, MongoDB, PostgreSQL)
- **MailDev** (email testing on port 1025)

## Features
- Customer management with MongoDB
- Product catalog with inventory management
- Order creation & processing
- Payment processing with confirmation
- Async event-driven notifications (order & payment emails)
- Inter-service communication via Feign clients
- Service discovery with Eureka
- Centralized configuration with Config Server

## Architecture Overview
- **Config Server** → Centralized configuration management
- **Discovery Service (Eureka)** → Service registry & discovery
- **Customer Service** → Customer CRUD operations (MongoDB)
- **Product Service** → Product catalog & inventory management
- **Order Service** → Order creation, coordinates customer/product/payment services
- **Payment Service** → Payment processing, sends payment notifications
- **Notification Service** → Consumes Kafka events, sends emails via SMTP

### Event Flow
```
Order Created
    ↓
Order Service → order-topic (Kafka) → Notification Service → Order Confirmation Email
    ↓
Payment Service → payment-topic (Kafka) → Notification Service → Payment Confirmation Email
```

## Project Structure
```
ecommerce-microservices/
├── config-server/              # Spring Cloud Config Server
├── discovery-service/          # Eureka Server (port 8761)
├── gateway/                    # API Gateway (port 8222)
├── customer-service/           # Customer management (MongoDB, port 8090)
├── product-service/            # Product catalog (PostgreSQL, port 8050)
├── order-service/              # Order processing (PostgreSQL, port 8070)
├── payment-service/            # Payment processing (PostgreSQL, port 8060)
├── notification-service/       # Email notifications (MongoDB, port 8040)
└── docker-compose.yml          # Kafka + Zookeeper + MongoDB + PostgreSQL + MailDev
```

## Service Ports
| Service | Port |
|---------|------|
| Config Server | 8888 |
| Eureka Discovery | 8761 |
| Gateway | 8222 |
| Customer Service | 8090 |
| Product Service | 8050 |
| Order Service | 8070 |
| Payment Service | 8060 |
| Notification Service | 8040 |
| Kafka | 9092 |
| Zookeeper | 2181 |
| MongoDB | 27017 |
| PostgreSQL | 5432 |
| MailDev UI | 1080 |

## Prerequisites
- **Java 17+** (Temurin / Zulu recommended)
- **Maven 3.8+**
- **Docker** + **Docker Compose**
- **Git**

## Quick Start (Docker Compose)
1. Clone the repository
```bash
   git clone https://github.com/cybercodecracker.git
   cd services
```

2. Start infrastructure services
```bash
   docker-compose up -d
```

3. Verify containers are running
```bash
   docker ps
```

4. Build all services
```bash
   mvn clean install
```

5. Start services in order:
```bash
   # Terminal 1
   cd config-server && mvn spring-boot:run
   
   # Terminal 2
   cd discovery-service && mvn spring-boot:run
   
   # Terminal 3
   cd gateway && mvn spring-boot:run
   
   # Terminal 4-8 (start remaining services)
   cd customer-service && mvn spring-boot:run
   cd product-service && mvn spring-boot:run
   cd order-service && mvn spring-boot:run
   cd payment-service && mvn spring-boot:run
   cd notification-service && mvn spring-boot:run
```

6. Access services:
   - Eureka Dashboard: http://localhost:8761
   - API Gateway: http://localhost:8222
   - MailDev UI: http://localhost:1080

## API Examples

### Create Customer
```bash
POST http://localhost:8222/api/customer
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  }
}
```

### Create Order
```bash
POST http://localhost:8222/api/order
Content-Type: application/json

{
  "reference": "ORD-001",
  "totalAmount": 150.00,
  "paymentMethod": "PAYPAL",
  "customerId": "699053db1ff807f524287a6e",
  "products": [
    {
      "id": 1,
      "availableQuantity": 2
    }
  ]
}
```

## Kafka Topics
- **order-topic** → Order confirmation events
- **payment-topic** → Payment confirmation events

## Email Testing
Emails are captured by MailDev (no actual sending):
- UI: http://localhost:1080
- SMTP: localhost:1025

## Technologies Used
- Spring Boot 4.0.2
- Spring Cloud 2025.1.0
- Apache Kafka 4.1.1
- MongoDB (Customer, Notification)
- PostgreSQL (Order, Payment, Product)
- MapStruct 1.5.5
- Lombok 1.18.30
- Jakarta Validation
- Spring Data JPA / MongoDB
