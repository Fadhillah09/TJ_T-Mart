# TJ-T-Mart Backend API

REST API backend for **TJ-T-Mart** — a campus dormitory mini-mart system supporting product catalog, shopping cart, checkout, gallon water delivery, electricity token purchase, staff attendance, and admin operations.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Laravel 12 |
| Language | PHP 8.2+ |
| Authentication | Laravel Sanctum (Bearer tokens) |
| Database | MySQL 8 |
| API Documentation | L5-Swagger (OpenAPI 3) |
| Testing | PHPUnit 11 |

---

## Requirements

- PHP >= 8.2 with extensions: `pdo_mysql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `fileinfo`
- Composer 2.x
- MySQL 8.x (or MariaDB 10.6+)
- Node.js 18+ (optional, for frontend assets)

---

## Installation

```bash
# Clone and enter backend directory
cd backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Run migrations and seed test data
php artisan migrate --seed

# Link storage for file uploads
php artisan storage:link
```

---

## Environment Setup

Edit `.env` with your local configuration:

```env
APP_NAME="TJ-T-Mart"
APP_URL=http://localhost:8000
APP_DEBUG=false

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tj_t_mart
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost,localhost:5173,127.0.0.1:8000
APP_FRONTEND_URL=http://localhost:5173

BCRYPT_ROUNDS=12

# Swagger (optional)
L5_SWAGGER_GENERATE_ALWAYS=false
L5_SWAGGER_CONST_HOST=http://localhost:8000/api
```

### Seeded Test Accounts

All accounts use password: `password`

| Email | Role |
|-------|------|
| `superadmin@tjmart.com` | Super Admin |
| `admin@tjmart.com` | Admin |
| `kurir@tjmart.com` | Kurir (Courier) |
| `customer@tjmart.com` | Customer |

---

## Running the Application

```bash
# Start development server
php artisan serve

# API base URL
http://localhost:8000/api
```

For production:

```bash
php artisan config:cache
php artisan route:cache
php artisan optimize
```

---

## Running Tests

```bash
php artisan test
```

Tests cover authentication security, rate limiting, file upload validation, policy authorization, and OWASP security headers.

---

## API Documentation

### Swagger UI (OpenAPI)

Generate and view interactive API docs:

```bash
php artisan l5-swagger:generate
```

Open in browser: **http://localhost:8000/api/documentation**

Authenticate in Swagger UI using the **Authorize** button with: `Bearer {your_token}`

### Postman Collection

Import the collection from:

```
docs/TJ-T-Mart.postman_collection.json
```

**Collection variables:**

| Variable | Default |
|----------|---------|
| `base_url` | `http://localhost:8000/api` |
| `token` | _(auto-set after Login request)_ |

Run **Auth > Login** first — the test script saves the token automatically.

---

## Database Schema Overview

| Domain | Tables |
|--------|--------|
| Auth & Users | `roles`, `users`, `admins`, `personal_access_tokens` |
| Mart & Location | `mart`, `lokasi_delivery`, `master_kamars` |
| Products | `kategori_produk`, `produk`, `produk_mart`, `produk_variants`, `produk_reviews`, `banners` |
| Commerce | `carts`, `cart_items`, `riwayat_pembelian`, `detail_pembelian`, `wishlists` |
| Services | `galon_transactions`, `token_transactions`, `metode_pembayaran` |
| Operations | `absensis`, `notifications`, `audit_logs` |
| Reporting | `penjualan`, `detail_penjualan` (+ DB views) |

Key design decisions:
- **Per-mart inventory** via `produk_mart` (local stock & pricing)
- **Soft deletes** on `users`, `produk`, `mart`, `kategori_produk`, `riwayat_pembelian`
- **Order snapshots** in `detail_pembelian` (product name & price at purchase time)

---

## Security Features Implemented

### OWASP Top 10 Protections

| Risk | Mitigation |
|------|------------|
| Broken Access Control | Laravel Policies, role middleware (`CheckRole`), IDOR prevention on cart/notifications |
| Cryptographic Failures | Bcrypt rounds 12, HTTPS forced in production |
| Injection | Eloquent ORM, FormRequest validation, input sanitization middleware |
| Insecure Design | Server-side price/stock calculation, DB transactions for checkout |
| Security Misconfiguration | `APP_DEBUG=false` warning, security headers middleware |
| Vulnerable Components | Composer lock file, dependency auditing |
| Auth Failures | Sanctum tokens, email verification, account lockout (5 attempts / 15 min) |
| Data Integrity | Signed email verification URLs, audit logging |
| Logging Failures | `audit_logs` table tracks sensitive actions with IP & user agent |
| SSRF | No user-controlled URL fetching |

### Additional Hardening

- **Rate limiting**: `auth` 5/min, `api` 60/min, `public` 30/min
- **Security headers**: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, etc.
- **Input sanitization**: Global `SanitizeInput` middleware (strip_tags on POST/PUT/PATCH)
- **File upload security**: MIME validation, extension whitelist, 2 MB max, random filenames
- **CORS**: Restricted to configured frontend origins
- **Token revocation**: `RefreshSanctumAuthentication` middleware prevents stale token reuse after logout
- **Audit logging**: Actions logged — `login`, `logout`, `order_create`, `product_create`, `token_purchase`, etc.

Run security check:

```bash
php artisan security:check
```

---

## Folder Structure

```
backend/
├── app/
│   ├── Console/Commands/       # Artisan commands (security:check)
│   ├── Http/
│   │   ├── Controllers/Api/    # API controllers
│   │   ├── Middleware/         # SecurityHeaders, SanitizeInput, CheckRole
│   │   ├── Requests/           # FormRequest validation classes
│   │   └── Resources/          # JSON API resources
│   ├── Models/                 # Eloquent models
│   ├── OpenApi/                # Swagger base spec & schemas
│   ├── Policies/               # Authorization policies
│   ├── Providers/              # AuthServiceProvider (rate limits, policies)
│   └── Services/               # Audit, FileUpload, LoginSecurity, Notification
├── config/
│   ├── cors.php
│   ├── hashing.php
│   └── l5-swagger.php
├── database/
│   ├── migrations/             # 29 sequential migrations
│   └── seeders/                # Roles, marts, users, products
├── docs/                       # Postman collection (project root)
├── routes/api.php              # All API routes
├── storage/api-docs/           # Generated OpenAPI JSON
└── tests/Feature/              # Security & policy tests
```

---

## API Response Format

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": "OK"
}
```

**Error:**
```json
{
  "success": false,
  "message": "Validasi gagal.",
  "errors": { "field": ["Error message"] }
}
```

---

## License

MIT — TJ-T-Mart Project
