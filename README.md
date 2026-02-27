# GymLite 

**GymLite** is a modern e-commerce web application for purchasing gym equipment, supplements, apparel, and accessories.  
It follows a **microservices architecture** for scalability, maintainability, and resilience, with secure authentication & authorization via **Keycloak**.

## Tech Stack

### Backend
- **Java 17+** / **Spring Boot 3.x**
- **Spring Cloud** → Netflix Eureka (Service Discovery)
- **Apache Kafka** → Event-driven communication (order events, inventory updates, notifications…)
- **Zipkin + Micrometer** → Distributed tracing & observability
- **Spring Cloud Gateway** → API Gateway + OAuth2 / OpenID Connect integration
- **Keycloak** → Open-source Identity & Access Management (OAuth2 / OIDC server, JWT tokens, roles & realms)
- **Spring Security** + **OAuth2 Resource Server** → Secures individual microservices (JWT validation)
- **PostgreSQL** / **MySQL** (per service or shared in dev)
- **Maven** (multi-module project)

### Frontend (planned / in progress)
- **Angular 19** (standalone components, signals, modern routing)
- **Tailwind CSS** + **Angular Material** / custom components
- **keycloak-angular** / **keycloak-js-adapter** → Frontend OIDC client (login, token refresh, guards)
- **NgRx** or **Signal Store** for state management (optional)

### Infrastructure / DevOps
- **Docker** + **Docker Compose** (Keycloak, Kafka, Zookeeper, Zipkin, databases)
- **Zipkin UI** (tracing visualization)
- **Kafka + Zookeeper** (via Docker)

## Features (Implemented / Planned)

- Product catalog, search & filtering
- Shopping cart & checkout flow
- Order creation & async processing via Kafka
- Secure authentication & authorization with **Keycloak** (login, registration, roles: USER / ADMIN)
- JWT-based protection on backend APIs (via Gateway + Resource Servers)
- Inventory reservation & updates via Kafka events
- Async notifications (order confirmation, low-stock alerts)
- Distributed tracing across services with Zipkin
- Responsive, modern UI with Angular 19 + Tailwind

## Architecture Notes – Security with Keycloak

- **Keycloak** runs as the central authorization server (OIDC provider)
- **Spring Cloud Gateway** acts as OAuth2 Client → handles login redirect & token acquisition
- **Gateway** can forward tokens downstream (TokenRelay filter) or act as OAuth2 Resource Server (validates JWTs itself)
- Backend microservices are **OAuth2 Resource Servers** → validate JWTs using Keycloak's JWKS endpoint (issuer-uri)
- Frontend (Angular) uses **keycloak-angular** library to handle login, token refresh, role-based route guards
- Roles / scopes can be used for fine-grained authorization (e.g., `@PreAuthorize("hasRole('ADMIN')")`)

## Project Structure (typical multi-module layout)
