# Restaurant Booking Backend — System Architecture Documentation (Phase 2)

## 1. High-Level Architecture Overview

The backend system is designed as a **scalable, modular, and maintainable service** powering a location-based restaurant booking platform.

### **Components:**

1. **API Gateway / Load Balancer**

   * Handles routing of client requests.
   * Provides SSL termination and rate limiting.
   * Distributes traffic across backend instances.

2. **Backend Service (Express.js)**

   * Stateless Node.js service handling API requests.
   * Responsibilities include authentication, restaurant management, bookings, reviews, and geospatial queries.
   * Horizontally scalable.

3. **Database (MongoDB)**

   * Stores restaurant, menu, booking, review, and user data.
   * Uses `2dsphere` indexes for geospatial queries.
   * Pre-aggregates ratings to improve performance.

4. **Cache (Redis)**

   * Stores frequently accessed data (e.g., popular restaurants, session tokens).
   * Supports rate-limiting and temporary caching for hotspot queries.

5. **External Services**

   * Email/SMS providers for booking confirmations (SendGrid, Twilio).
   * Optional search engine (Elasticsearch) for advanced text queries.

6. **Monitoring & Logging**

   * Centralized logging (Winston or Pino).
   * Metrics and alerts via Prometheus and Grafana.
   * Error tracking via Sentry.

## 2. Data Flow Diagrams

### **2.1 Nearby Restaurant Search**

1. Client sends coordinates + filters (e.g., cuisine, radius).
2. Backend validates input.
3. Backend queries MongoDB using `$geoNear` aggregation.
4. Ratings and review summaries fetched from pre-aggregated fields.
5. Results returned to client with distance calculated.

### **2.2 Booking Flow**

1. User submits booking request (restaurant, time, party size).
2. Backend checks seat availability and concurrent bookings.
3. Booking saved to DB using optimistic concurrency / transaction.
4. Confirmation sent to user via email/SMS.

### **2.3 Review Submission Flow**

1. User submits rating and review.
2. Backend validates input and saves review.
3. Aggregated rating and histogram updated in Restaurant document.
4. New rating visible in future queries.

## 3. Component Responsibilities

| Component         | Responsibility                              |
| ----------------- | ------------------------------------------- |
| API Gateway       | Request routing, SSL, rate limiting         |
| Backend Service   | Business logic, endpoints, authentication   |
| MongoDB           | Persistent data storage, geospatial queries |
| Redis             | Caching, rate-limiting, session management  |
| Email/SMS Service | Notifications, confirmations                |
| Monitoring Tools  | Metrics, logging, error tracking            |

## 4. Technology Stack Justification

* **Node.js + Express.js:** Rapid development, asynchronous I/O, large ecosystem.
* **MongoDB:** Native geospatial support (`2dsphere`), flexible schema for restaurants and reviews.
* **Redis:** Fast in-memory caching for hot queries.
* **Docker:** Consistent environment across dev/prod.
* **Swagger/OpenAPI:** Auto-generated API documentation.
* **Prometheus/Grafana/Sentry:** Monitoring, metrics, and error tracking for reliability.

## 5. Architecture Diagram

(Place your diagram image here, e.g., `docs/images/architecture_diagram.png`)

```
[Client] ---> [API Gateway] ---> [Backend Service] ---> [MongoDB]
                               |                    
                               ---> [Redis]
                               ---> [External Services (Email/SMS)]
```