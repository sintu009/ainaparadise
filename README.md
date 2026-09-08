# Aina Paradise - Hotel Booking System

## Project Structure
```
aina-paradise/
├── aina-landing/   # Frontend (React + Vite + Tailwind) — port 5173
├── backend/        # API (Node.js + Express + PostgreSQL) — port 5000
└── admin/          # Admin Panel (React + Vite + Tailwind) — port 5174
```

## 1. PostgreSQL Setup

1. Create the database:
```sql
CREATE DATABASE aina_paradise;
```

2. Run the schema (seeds rooms + default admin):
```bash
psql -U postgres -d aina_paradise -f backend/schema.sql
```

Default admin credentials:
- Email: `admin@ainaparadise.com`
- Password: `password`

## 2. Backend Setup

```bash
cd backend
# Edit .env — set your DATABASE_URL and JWT_SECRET
npm install
npm run dev
```

`.env` example:
```
PORT=5000
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/aina_paradise
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

## 3. Frontend Setup

```bash
cd aina-landing
npm install
npm run dev
```

## 4. Admin Panel Setup

```bash
cd admin
npm install
npm run dev
```

Open http://localhost:5174 and login with admin credentials.

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | — | Register user |
| POST | /api/auth/login | — | Login |
| GET | /api/auth/me | User | Get profile |
| GET | /api/rooms | — | List rooms |
| GET | /api/rooms/:id | — | Room detail |
| POST | /api/rooms | Admin | Create room |
| PUT | /api/rooms/:id | Admin | Update room |
| DELETE | /api/rooms/:id | Admin | Delete room |
| POST | /api/bookings | User | Create booking |
| GET | /api/bookings/my | User | My bookings |
| PATCH | /api/bookings/:id/cancel | User | Cancel booking |
| GET | /api/bookings | Admin | All bookings |
| PATCH | /api/bookings/:id/status | Admin | Update status |
| GET | /api/bookings/admin/stats | Admin | Dashboard stats |
| GET | /api/users | Admin | All users |
| DELETE | /api/users/:id | Admin | Delete user |
