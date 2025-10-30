# Restaurant Booking Platform — API Design Documentation (Phase 4)

> RESTful API design for both mobile and web (React) clients. Uses cursor-based pagination (infinite scroll), filtering, and role-based access (User / Admin).

---

## 1. Base URL & Versioning

* **Base URL:** `https://api.yourdomain.com` (replace with actual domain)
* **API Prefix:** `/api/v1`
* Versioning is included in the URL to allow future breaking changes: `/api/v2` etc.

---

## 2. Authentication & Authorization

### 2.1 Tokens

* **Access Token (JWT):** short-lived (e.g., 15m). Sent in the `Authorization` header:

  * `Authorization: Bearer <access_token>`
* **Refresh Token:** long-lived (e.g., 7d) stored securely (httpOnly cookie on web or secure storage on mobile). Exchange refresh token at `/auth/refresh`.

### 2.2 Roles

* `user` — normal end-user (browse, book, review)
* `admin` — platform/restaurant owner (manage restaurants, menus, bookings)

Authorization middleware will enforce role checks (e.g., `requireRole('admin')`).

---

## 3. Common Response Format

All successful responses follow a consistent structure:

```json
{
  "success": true,
  "data": { ... },
  "meta": { ... } // optional (pagination, totals, nextCursor)
}
```

Error responses:

```json
HTTP/1.1 400 Bad Request
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Description of the error",
    "details": { /* optional */ }
  }
}
```

Common error HTTP codes and example `code` strings:

* `400` — `INVALID_INPUT`
* `401` — `UNAUTHORIZED`
* `403` — `FORBIDDEN`
* `404` — `NOT_FOUND`
* `409` — `CONFLICT` (e.g., double booking)
* `429` — `RATE_LIMITED`
* `500` — `INTERNAL_ERROR`

---

## 4. Pagination, Filtering & Sorting

### 4.1 Cursor-based Pagination (infinite scroll)

* Query params: `limit`, `cursor`
* Response includes `nextCursor` (string or null). If `nextCursor` is absent or `null`, no more data.

Example:

* First call: `GET /api/v1/restaurants?limit=10&sort=distance`
* Response: `{ data: [...], meta: { nextCursor: "r110" } }`
* Next call: `GET /api/v1/restaurants?limit=10&cursor=r110&sort=distance`

Implementation note: Use a stable sort (e.g., by distance then _id) to ensure no missing/duplicate items when paginating.

### 4.2 Filtering Parameters

Common filters (applied as query params):

* `cuisine` (string) — e.g., `cuisine=italian` or `cuisines=italian,mexican`
* `minRating` (number) — e.g., `minRating=4`
* `priceLevel` (number or comma-separated)
* `openNow` (boolean) — checks current time against `openingHours`
* `lat`, `lng`, `radius` (meters) — for geospatial queries
* `q` (string) — text search across name/description/cuisines

Example combined request:

```
GET /api/v1/restaurants?limit=20&lat=26.9124&lng=75.7873&radius=5000&cuisine=italian&minRating=4&sort=distance
```

### 4.3 Sorting

* `sort` param options:

  * `distance` (requires lat,lng)
  * `rating` (desc)
  * `popular` (by booking/review count)
  * `price` (asc/desc)

---

## 5. Endpoints

Below are primary endpoints with purpose, access, query parameters, and sample request/response snippets.

### 5.1 Auth

#### POST /api/v1/auth/register

* **Desc:** Register new user
* **Body:** `{ name, email, password, phone }`
* **Response:** `201` — user summary + tokens

#### POST /api/v1/auth/login

* **Desc:** Login and receive access + refresh tokens
* **Body:** `{ email, password }`
* **Response:** `200` — `{ accessToken, refreshToken, user }`

#### POST /api/v1/auth/refresh

* **Desc:** Exchange refresh token for new access token
* **Access:** refresh token via cookie or body

#### POST /api/v1/auth/logout

* **Desc:** Revoke refresh token (server-side or remove cookie)
* **Access:** Authenticated

---

### 5.2 Restaurants

#### GET /api/v1/restaurants

* **Desc:** List / Search restaurants (cursor-based)
* **Query Params:** `limit`, `cursor`, `lat`, `lng`, `radius`, `cuisine`, `minRating`, `priceLevel`, `openNow`, `q`, `sort`
* **Access:** Public

**Sample Request:**

```
GET /api/v1/restaurants?limit=15&lat=26.9124&lng=75.7873&radius=5000&cuisine=italian&minRating=4&sort=distance
```

**Sample Response:**

```json
{
  "success": true,
  "data": [
    { "_id": "r101", "name": "The Spice Route", "distance_m": 1200, "ratingAvg": 4.5 }
  ],
  "meta": { "nextCursor": "r115", "count": 15 }
}
```

Implementation notes:

* Use `$geoNear` aggregation when `lat`/`lng` provided to compute `distance`.
* If sorting by `distance`, `cursor` should encode both distance and last `_id` to avoid ordering edge-cases.

#### GET /api/v1/restaurants/:id

* **Desc:** Get restaurant details (menus, openingHours, rating summary)
* **Access:** Public

#### POST /api/v1/restaurants

* **Desc:** Create restaurant (Admin)
* **Access:** `admin`
* **Body:** full restaurant object

#### PUT /api/v1/restaurants/:id

* **Desc:** Update restaurant (Admin)
* **Access:** `admin`

#### DELETE /api/v1/restaurants/:id

* **Desc:** Delete restaurant (Admin)
* **Access:** `admin`

---

### 5.3 Menu

#### GET /api/v1/restaurants/:id/menu

* **Desc:** Get restaurant menu (public)

#### POST /api/v1/restaurants/:id/menu

* **Desc:** Add menu item (admin)
* **Access:** `admin`
* **Body:** `{ name, description, price, category, available }`

#### PUT /api/v1/restaurants/:id/menu/:menuId

* **Desc:** Update menu item (admin)
* **Access:** `admin`

#### DELETE /api/v1/restaurants/:id/menu/:menuId

* **Desc:** Delete menu item (admin)
* **Access:** `admin`

---

### 5.4 Reviews

#### POST /api/v1/restaurants/:id/reviews

* **Desc:** Create review
* **Access:** `user` (authenticated)
* **Body:** `{ rating: 1-5, text, images? }`
* **Behavior:** Update restaurant `ratingAvg` and `ratingCount` transactionally or via two-step update ensuring consistency.

**Response:** `201` created

#### GET /api/v1/restaurants/:id/reviews

* **Desc:** List reviews (cursor/page)
* **Query:** `limit`, `cursor`, `sort=recent|helpful`

#### DELETE /api/v1/restaurants/:id/reviews/:reviewId

* **Desc:** Delete review (owner or admin)

---

### 5.5 Bookings

#### POST /api/v1/bookings

* **Desc:** Create booking
* **Access:** `user`
* **Body:** `{ restaurantId, bookingTime (ISO), partySize, specialRequests? }`
* **Behavior:** Check availability, prevent double-bookings using transactions / optimistic locking.

**Success:** `201` with booking object
**Conflict:** `409` `{"code":"CONFLICT","message":"Time slot not available"}`

#### GET /api/v1/bookings

* **Desc:** List user bookings (cursor-based)
* **Access:** `user` (returns user's bookings) or `admin` with `restaurantId` filter
* **Query Params:** `limit`, `cursor`, `restaurantId` (admin)

#### PUT /api/v1/bookings/:id/cancel

* **Desc:** Cancel booking
* **Access:** `user` (owner) or `admin`

#### PUT /api/v1/bookings/:id/confirm

* **Desc:** Admin confirms booking (if required)
* **Access:** `admin`

---

### 5.6 Admin / Management

* Endpoints protected by `admin` role for managing restaurants, menus, viewing all bookings, and user management.
* Recommended prefix: `/api/v1/admin/*` or reuse resource endpoints with role checks.

---

## 6. Example Workflows

### 6.1 Browse & Book (Mobile or Web)

1. Frontend requests nearby restaurants with:

   * `GET /api/v1/restaurants?lat=...&lng=...&limit=10`
2. Backend returns `data` and `nextCursor`.
3. Frontend displays results; on scroll, it requests next batch with `cursor`.
4. User taps a restaurant → `GET /api/v1/restaurants/:id` to fetch details + menu.
5. User books: `POST /api/v1/bookings` (authenticated). Backend checks availability and returns booking.
6. Backend sends confirmation (email/SMS) asynchronously via background job.

### 6.2 Admin Adds Restaurant

1. Admin logs in and calls `POST /api/v1/restaurants` with restaurant data.
2. Backend validates and saves; index updates allow immediate searchability.
3. Admin adds menu items via `POST /api/v1/restaurants/:id/menu`.

---

## 7. Rate Limiting & Caching Recommendations

* **Rate limiting:** Protect endpoints (e.g., auth, search) using Redis token-bucket or leaky-bucket.
* **Caching:** Cache hotspot search results in Redis with short TTL (e.g., popular city tiles) to reduce DB load.
* **Idempotency:** For booking endpoints consider idempotency tokens to avoid duplicate bookings on retries.

---

## 8. API Documentation & Testing

* Provide an OpenAPI (Swagger) spec for automated docs and client generation.
* Include example curl requests for every endpoint.
* Use contract tests to ensure frontend-backend compatibility.

---
