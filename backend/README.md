# TJ-T-Mart Backend API

Sistem backend untuk aplikasi TJ-T-Mart — mini-mart asrama kampus Universitas Telkom Bandung.

---

## Tech Stack

| Komponen | Teknologi |
|----------|-----------|
| Runtime | PHP 8.2+ |
| Framework | Laravel 12 |
| Database | MySQL 8 |
| Authentication | Laravel Sanctum (Bearer Token) |
| API Documentation | L5-Swagger (OpenAPI 3) |
| Testing | PHPUnit 11 |

---

## Requirements

- PHP >= 8.2 (extensions: `pdo_mysql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `fileinfo`)
- Composer 2.x
- MySQL 8.x
- Node.js 18+ (untuk frontend, terpisah)

---

## Installation

```bash
# 1. Clone repository
git clone <repository-url>
cd TJ-T-Mart/backend

# 2. Install dependencies
composer install

# 3. Environment
cp .env.example .env
php artisan key:generate

# 4. Database
php artisan migrate --seed

# 5. Storage link (upload gambar produk)
php artisan storage:link

# 6. Generate API docs
php artisan l5-swagger:generate
```

---

## Environment Setup

| Variable | Deskripsi |
|----------|-----------|
| `APP_NAME` | Nama aplikasi (`TJ-T-Mart`) |
| `APP_URL` | URL backend (`http://localhost:8000`) |
| `APP_DEBUG` | Debug mode (`false` di production) |
| `APP_FRONTEND_URL` | URL frontend untuk CORS |
| `DB_CONNECTION` | Driver database (`mysql`) |
| `DB_HOST` | Host MySQL |
| `DB_PORT` | Port MySQL (`3306`) |
| `DB_DATABASE` | Nama database (`tj_t_mart`) |
| `DB_USERNAME` | Username MySQL |
| `DB_PASSWORD` | Password MySQL |
| `SANCTUM_STATEFUL_DOMAINS` | Domain SPA yang diizinkan |
| `BCRYPT_ROUNDS` | Rounds bcrypt (`12`) |
| `L5_SWAGGER_CONST_HOST` | Base URL untuk Swagger (`http://localhost:8000/api`) |
| `L5_SWAGGER_GENERATE_ALWAYS` | Regenerate docs tiap request (`false` di production) |

### Akun Seeder (password: `password`)

| Email | Role |
|-------|------|
| `superadmin@tjmart.com` | Super Admin |
| `admin@tjmart.com` | Admin |
| `kurir@tjmart.com` | Kurir |
| `customer@tjmart.com` | Customer |

---

## Running the Application

```bash
# Development server
php artisan serve

# Queue worker (notifikasi/async jobs)
php artisan queue:work

# API base URL
http://localhost:8000/api
```

Production:

```bash
php artisan optimize:clear
php artisan optimize
php artisan l5-swagger:generate
```

---

## Running Tests

```bash
# Semua test
php artisan test

# Dengan coverage (butuh Xdebug/PCOV)
php artisan test --coverage
```

---

## API Documentation

### Swagger UI

```bash
php artisan l5-swagger:generate
```

Buka: **http://localhost:8000/api/documentation**

Klik **Authorize** → masukkan: `Bearer {token_dari_login}`

### Postman

1. Import `docs/TJ-T-Mart.postman_collection.json`
2. Import `docs/TJ-T-Mart.postman_environment.json`
3. Pilih environment **TJ-T-Mart Local**
4. Jalankan **Auth → Login** (token otomatis tersimpan)

---

## Security Features Implemented

| Fitur | Implementasi |
|-------|--------------|
| Authentication | Laravel Sanctum Bearer tokens |
| Email verification | Wajib untuk akses route bisnis |
| Account lockout | 5 percobaan gagal → lock 15 menit |
| Rate limiting | `auth` 5/min, `api` 60/min, `public` 30/min |
| Authorization | Policies + role middleware |
| IDOR prevention | Scoped queries (cart, notifications) |
| Input sanitization | `SanitizeInput` middleware global |
| Security headers | OWASP headers (`X-Frame-Options`, `X-Content-Type-Options`, dll.) |
| File upload security | MIME validation, whitelist extension, max 2MB |
| CORS | Origin terbatas ke frontend yang dikonfigurasi |
| Audit logging | `audit_logs` — login, order, product, token |
| Server-side pricing | Harga & stok tidak pernah dari frontend |
| DB transactions | Checkout, absensi, status update |
| Token revocation | Middleware refresh Sanctum setiap request |

```bash
php artisan security:check
```

---

## Database Schema Overview

| Domain | Tabel | Fungsi |
|--------|-------|--------|
| Auth | `roles`, `users`, `admins`, `personal_access_tokens` | User, role, session token |
| Mart | `mart`, `lokasi_delivery`, `master_kamars` | Cabang mart & lokasi antar |
| Produk | `kategori_produk`, `produk`, `produk_mart`, `produk_variants`, `produk_reviews`, `banners` | Katalog & inventori per-mart |
| Commerce | `carts`, `cart_items`, `riwayat_pembelian`, `detail_pembelian`, `wishlists` | Keranjang & pesanan |
| Layanan | `galon_transactions`, `token_transactions` | Galon air & token listrik |
| Operasional | `absensis`, `notifications`, `audit_logs` | Absensi staff & notifikasi |
| Laporan | `penjualan`, `detail_penjualan` | Agregat penjualan |

---

## Folder Structure

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/   # REST API controllers (+ @OA annotations)
│   │   ├── Middleware/        # SecurityHeaders, SanitizeInput, CheckRole
│   │   ├── Requests/          # FormRequest validation
│   │   └── Resources/         # JSON API transformers
│   ├── Models/                # Eloquent models
│   ├── OpenApi/               # Reusable OpenAPI schemas
│   ├── Policies/              # Authorization policies
│   └── Services/              # Audit, FileUpload, LoginSecurity, Notification
├── config/                    # l5-swagger.php, cors.php, hashing.php
├── database/migrations/       # Schema migrations
├── database/seeders/          # Test data seeders
├── routes/api.php             # API route definitions
├── storage/api-docs/          # Generated OpenAPI JSON
└── tests/Feature/             # Security & integration tests
```

---

## API Response Format

```json
{
  "success": true,
  "data": {},
  "message": "OK"
}
```

```json
{
  "success": false,
  "message": "Validasi gagal.",
  "errors": {}
}
```
