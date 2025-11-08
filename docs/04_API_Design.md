# Restaurant Booking Platform — API Design Documentation (Phase 4)

> RESTful API design for both mobile and web (React) clients. Uses cursor-based pagination (infinite scroll), filtering, and role-based access (`user`, `restaurantOwner`, `admin`).

---

## 1. Base URL & Versioning

- **Base URL:** `https://api.yourdomain.com` (replace with actual domain)
- **API Prefix:** `/api/v1`
- **Versioning:** Included in the URL to support future versions (e.g., `/api/v2`).

---

## 2. Authentication & Authorization

### 2.1 Tokens

- **Access Token (JWT):** Short-lived (e.g., 15m). Sent in the `Authorization` header:
  ```
  Authorization: Bearer <access_token>
  ```
- **Refresh Token:** Long-lived (e.g., 7d), stored securely (httpOnly cookie on web or secure storage on mobile).  
  Exchange at `/auth/refresh`.

### 2.2 Roles

- `user` — normal platform user (browse, book, review)
- `restaurantOwner` — manages their own restaurant listings, menus, and bookings
- `admin` — super admin who oversees all restaurants, users, and platform operations

Authorization middleware will enforce role checks (e.g., `requireRole('restaurantOwner')` or `requireRole('admin')`).

---

## 3. Common Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { },
  "meta": { } // optional (pagination, totals, nextCursor)
}
```

**Error Response:**
```json
HTTP/1.1 400 Bad Request
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Description of the error"
  }
}
```

**Common Error Codes:**

| HTTP Code | Code String       | Description                      |
|------------|------------------|----------------------------------|
| 400        | INVALID_INPUT    | Bad or missing data              |
| 401        | UNAUTHORIZED     | Invalid or missing token         |
| 403        | FORBIDDEN        | Insufficient role permissions    |
| 404        | NOT_FOUND        | Resource not found               |
| 409        | CONFLICT         | Duplicate entry / double booking |
| 429        | RATE_LIMITED     | Too many requests                |
| 500        | INTERNAL_ERROR   | Server error                     |

---

## 4. Pagination, Filtering & Sorting

### 4.1 Cursor-based Pagination

- Params: `limit`, `cursor`
- Response includes `nextCursor` (string or null)

Example:
```
GET /api/v1/restaurants?limit=10&sort=distance
```

Response:
```json
{
  "data": [...],
  "meta": { "nextCursor": "r110" }
}
```

### 4.2 Filtering Parameters

| Parameter | Description | Example |
|------------|--------------|----------|
| `cuisine` | Filter by cuisine type | `cuisine=italian` |
| `minRating` | Minimum rating | `minRating=4` |
| `priceLevel` | Price level (1-4) | `priceLevel=2` |
| `openNow` | Currently open | `openNow=true` |
| `lat`, `lng`, `radius` | For geospatial search | `lat=26.91&lng=75.78&radius=5000` |
| `q` | Text search | `q=pizza` |

### 4.3 Sorting

Options:  
- `distance` (requires `lat`, `lng`)
- `rating`
- `popular`
- `price_asc`, `price_desc`

---

## 5. Endpoints

### 5.1 Auth

#### `POST /api/v1/auth/register`
- Register new user or restaurant owner
- **Body:** `{ name, email, password, phone, role }`
- **Response:** `201` — user object + tokens

#### `POST /api/v1/auth/login`
- Login existing user
- **Body:** `{ email, password }`
- **Response:** `{ accessToken, refreshToken, user }`

#### `POST /api/v1/auth/refresh`
- Get new access token using refresh token

#### `POST /api/v1/auth/logout`
- Logout and invalidate tokens

---

### 5.2 Restaurants

#### `GET /api/v1/restaurants`
- **Desc:** List / Search restaurants
- **Access:** Public
- **Query:** `limit`, `cursor`, `lat`, `lng`, `radius`, `cuisine`, `sort`, etc.

#### `GET /api/v1/restaurants/:id`
- **Desc:** Get restaurant details, menu, reviews
- **Access:** Public

#### `POST /api/v1/restaurants`
- **Desc:** Create new restaurant
- **Access:** `restaurantOwner` or `admin`

#### `PUT /api/v1/restaurants/:id`
- **Desc:** Update restaurant details
- **Access:** Only the restaurant owner or admin

#### `DELETE /api/v1/restaurants/:id`
- **Desc:** Delete restaurant
- **Access:** `admin`

---

### 5.3 Menu

#### `GET /api/v1/restaurants/:id/menu`
- **Desc:** Get restaurant’s menu
- **Access:** Public

#### `POST /api/v1/restaurants/:id/menu`
- **Desc:** Add menu item
- **Access:** `restaurantOwner` or `admin`

#### `PUT /api/v1/restaurants/:id/menu/:menuId`
- **Desc:** Update menu item
- **Access:** `restaurantOwner` or `admin`

#### `DELETE /api/v1/restaurants/:id/menu/:menuId`
- **Desc:** Delete menu item
- **Access:** `restaurantOwner` or `admin`

---

### 5.4 Reviews

#### `POST /api/v1/restaurants/:id/reviews`
- **Desc:** Create new review
- **Access:** `user`
- **Body:** `{ rating, text, images? }`
- **Behavior:** Updates restaurant’s `ratingAvg` and `ratingCount`.

#### `GET /api/v1/restaurants/:id/reviews`
- **Desc:** Fetch restaurant reviews
- **Query:** `limit`, `cursor`, `sort=recent|helpful`

#### `DELETE /api/v1/restaurants/:id/reviews/:reviewId`
- **Access:** Review author or `admin`

---

### 5.5 Bookings

#### `POST /api/v1/bookings`
- **Desc:** Create booking
- **Access:** `user`
- **Body:** `{ restaurantId, bookingTime, partySize, specialRequests? }`
- **Response:** `201` — booking details or `409` if slot not available

#### `GET /api/v1/bookings`
- **Desc:** Fetch bookings
- **Access:**  
  - `user` → their bookings  
  - `restaurantOwner` → bookings for their restaurants  
  - `admin` → all bookings
- **Query:** `limit`, `cursor`, `restaurantId`

#### `PUT /api/v1/bookings/:id/cancel`
- **Desc:** Cancel booking
- **Access:** `user`, `restaurantOwner`, or `admin`

#### `PUT /api/v1/bookings/:id/confirm`
- **Desc:** Confirm booking
- **Access:** `restaurantOwner` or `admin`

---

### 5.6 Admin Management

**Prefix:** `/api/v1/admin/*`

Admin-level routes include:
- Manage users
- View all restaurants
- Suspend restaurantOwner accounts
- Access global analytics (optional)

---

## 6. Example Workflows

### 6.1 Browse & Book (User Flow)

1. `GET /api/v1/restaurants?lat=...&lng=...&limit=10`
2. Select a restaurant → `GET /api/v1/restaurants/:id`
3. `POST /api/v1/bookings` with desired time and party size
4. Backend validates and confirms booking
5. Email/SMS confirmation sent

### 6.2 Restaurant Owner Adds Restaurant

1. Restaurant owner logs in → obtains token  
2. `POST /api/v1/restaurants` with restaurant details  
3. Adds menu items via `POST /api/v1/restaurants/:id/menu`  
4. Can view bookings with `GET /api/v1/bookings?restaurantId=...`

---

## 7. Rate Limiting & Caching

- **Rate Limiting:** Redis-based token-bucket to prevent abuse on `/auth` and `/search`
- **Caching:** Cache hot restaurant search results for 60–120s using Redis
- **Idempotency:** For booking requests, include an idempotency key to prevent duplicate bookings

---

## 8. API Documentation & Testing

- **OpenAPI (Swagger)** documentation for all endpoints
- Example `curl` and Postman collections for testing
- Automated contract tests between frontend and backend

---

**✅ Roles Summary:**

| Role | Permissions Summary |
|------|----------------------|
| `user` | Can search, book, and review restaurants |
| `restaurantOwner` | Can add/edit restaurants, menus, and manage bookings for owned restaurants |
| `admin` | Full platform access (manage users, restaurants, bookings) |

---