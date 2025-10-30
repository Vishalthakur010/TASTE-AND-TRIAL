# Restaurant Booking Backend — System Architecture Documentation (Phase 2)

## 1. High-Level Architecture Overview

The backend system is designed as a **scalable, modular, and maintainable service** powering a location-based restaurant booking platform.

### **Components:**

1. **API Gateway / Load Balancer**

   * Handles routing of client requests.
   * Provides SSL termination, rate limiting, and request validation.
   * Distributes traffic across backend instances for scalability.

2. **Backend Service (Express.js)**

   * Stateless Node.js service handling API requests.
   * Responsibilities include authentication, restaurant management, bookings, reviews, and geospatial queries.
   * Handles **role-based access control (User, RestaurantOwner, Admin)** to manage permissions.
   * Horizontally scalable using containerized deployments.

3. **Database (MongoDB)**

   * Stores data for users, restaurants, menus, bookings, and reviews.
   * Uses `2dsphere` indexes for geospatial queries to locate nearby restaurants.
   * Maintains references between restaurants, owners, and reviews.
   * Pre-aggregates average ratings and total reviews for performance.

4. **Cache (Redis)**

   * Stores frequently accessed data such as popular restaurants, JWT blacklists, and temporary booking sessions.
   * Used for rate-limiting, session management, and speeding up repeated queries.

5. **External Services**

   * **Email/SMS Providers (SendGrid, Twilio):** Send booking confirmations, reminders, and alerts.
   * **Optional Search Engine (Elasticsearch):** Enables full-text search across restaurant names and cuisines.

6. **Monitoring & Logging**

   * **Winston/Pino:** Centralized structured logging.
   * **Prometheus + Grafana:** Collect and visualize system metrics.
   * **Sentry:** Real-time error tracking and alerting.

---

## 2. Data Flow Diagrams

### **2.1 Nearby Restaurant Search**

1. User (client) sends coordinates and filters (cuisine, radius, rating, etc.).
2. Backend validates inputs and applies user or restaurantOwner role checks.
3. Backend queries MongoDB using `$geoNear` aggregation to find restaurants within the radius.
4. Aggregated ratings and review counts are fetched from the restaurant documents.
5. Backend applies pagination (cursor-based) and filtering before sending results to the client.

---

### **2.2 Restaurant Creation & Approval Flow**

1. **RestaurantOwner** logs in and submits a `POST /api/v1/restaurants` request.
2. Backend validates token and ensures the role is `restaurantOwner`.
3. Restaurant is created with `status: 'pending'` and linked to the owner.
4. **Admin** reviews pending restaurants using `GET /api/v1/restaurants?status=pending`.
5. Admin approves or rejects by updating status via `PUT /api/v1/restaurants/:id/status`.
6. Approved restaurants become visible to all **Users**.

---

### **2.3 Booking Flow**

1. **User** submits a booking request specifying restaurant, date, and party size.
2. Backend verifies user’s JWT and checks if restaurant status is approved.
3. Checks for table availability using concurrency control.
4. Booking record is saved in MongoDB using transactions or atomic updates.
5. Confirmation email/SMS is sent to the user and restaurant owner.

---

### **2.4 Review Submission Flow**

1. **User** submits rating and review after visiting a restaurant.
2. Backend validates booking history to ensure the user dined there.
3. Review is saved in the database and linked to both restaurant and user.
4. Aggregated rating and review count fields in the restaurant document are updated.
5. New rating is reflected in future queries instantly.

---

## 3. Component Responsibilities

| Component | Responsibility |
|------------|----------------|
| API Gateway | Request routing, SSL termination, rate limiting, and security enforcement |
| Backend Service | Core business logic, RESTful APIs, role-based authorization (User, RestaurantOwner, Admin) |
| MongoDB | Persistent data storage, geospatial queries, and relational references |
| Redis | Caching, rate limiting, and session handling |
| Email/SMS Service | Booking and approval notifications |
| Monitoring Tools | Metrics collection, centralized logging, error reporting |

---

## 4. Technology Stack Justification

* **Node.js + Express.js:** Non-blocking I/O for scalable, high-performance APIs.
* **MongoDB:** Perfect fit for geospatial data, flexible schema for restaurants, menus, and reviews.
* **Redis:** Improves read performance and scalability; supports session and rate-limit management.
* **Docker:** Ensures consistent deployment across development and production.
* **Swagger / OpenAPI:** Standardized and auto-generated API documentation.
* **Prometheus / Grafana / Sentry:** Provide observability, monitoring, and debugging insights.

---

## 5. Architecture Diagram

(Place your diagram image here, e.g., `docs/images/architecture_diagram.png`)

```
                ┌───────────────────────────┐
                │         Client App        │
                │ (Mobile / Web Interface)  │
                └─────────────┬─────────────┘
                              │
                              ▼
                   ┌────────────────────┐
                   │ API Gateway / LB   │
                   │ (SSL, Routing, RL) │
                   └─────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────────────┐
                  │     Backend (Express.js)    │
                  │ Auth | Restaurants | Booking │
                  │ Reviews | Roles: User / RO / Admin │
                  └───────┬───────────────┬──────┘
                          │               │
         ┌────────────────┘               └────────────────┐
         ▼                                                 ▼
 ┌──────────────────┐                          ┌──────────────────┐
 │    MongoDB       │                          │      Redis       │
 │ (Data Storage)   │                          │ (Cache/Session)  │
 └──────────────────┘                          └──────────────────┘
         │                                                 │
         ▼                                                 ▼
 ┌────────────────────┐                        ┌────────────────────┐
 │ Email/SMS Service  │                        │ Monitoring Tools   │
 │ (SendGrid/Twilio)  │                        │ (Grafana/Sentry)   │
 └────────────────────┘                        └────────────────────┘
```
