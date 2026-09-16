# Table Twelve — API Server

Node.js + Express + MongoDB backend for the Restaurant Reservation & Table
Management System. Mirrors the data shapes the React frontend already uses,
so wiring the frontend up to this is a matter of pointing `services/api.js`
at it.

## Setup

```bash
cp .env.example .env      # then fill in MONGO_URI and JWT_SECRET
npm install
npm run seed              # populates demo data + demo accounts
npm run dev               # starts on http://localhost:5000
```

Requires a running MongoDB instance — either local (`mongodb://127.0.0.1:27017/table-twelve`)
or a connection string from MongoDB Atlas.

## Demo accounts (after `npm run seed`)

| Role     | Email                  | Password    |
|----------|-------------------------|-------------|
| Admin    | admin@tabletwelve.com  | admin123    |
| Staff    | staff@tabletwelve.com  | staff123    |
| Customer | asha@example.com       | customer123 |

## Auth model

JWT bearer tokens (`Authorization: Bearer <token>`), issued on register/login,
7-day expiry by default (`JWT_EXPIRES_IN` in `.env`). Three roles: `admin`,
`staff`, `customer`.

## The guest-booking → account-history flow

`POST /api/reservations` never requires a token — anyone can book a table
by name and phone number, no account needed. Under the hood:

1. A guest books → the reservation is stored with `customer: null` and the
   phone number they gave.
2. When that phone number later registers or logs in, the server runs
   `Reservation.updateMany({ phone, customer: null }, { customer: user._id })`
   — every booking made with that phone becomes part of the new account's
   history automatically.
3. `GET /api/reservations` for a `customer`-role user returns bookings
   matched by **either** their account id or their phone number, so even a
   booking made seconds before signing up shows up right away.

## API reference

All routes are prefixed with `/api`.

### Auth — `/auth`
| Method | Route              | Auth   | Description |
|--------|---------------------|--------|--------------|
| POST   | `/register`          | Public | Create account (name, email, password, phone) |
| POST   | `/login`             | Public | Log in, claims any guest bookings on that phone |
| POST   | `/forgot-password`   | Public | Confirms an account exists (plug in email/SMS provider) |
| GET    | `/me`                | Token  | Current user profile |
| PUT    | `/me`                | Token  | Update name/phone |

### Tables — `/tables`
| Method | Route         | Auth           | Description |
|--------|----------------|----------------|--------------|
| GET    | `/`            | Public         | List all tables (for the public floor view) |
| POST   | `/`            | admin/staff    | Add a table |
| PUT    | `/:id`         | admin/staff    | Edit a table |
| PATCH  | `/:id/status`  | admin/staff    | Change status only |
| DELETE | `/:id`         | admin/staff    | Remove a table |

### Reservations — `/reservations`
| Method | Route            | Auth           | Description |
|--------|-------------------|----------------|--------------|
| POST   | `/`               | Public/Token   | Book a table (guest or account) |
| GET    | `/`               | Token          | List reservations, scoped for customers |
| PUT    | `/:id`            | admin/staff    | Edit a reservation |
| POST   | `/:id/cancel`     | Token          | Cancel (frees the table) |
| POST   | `/:id/check-in`   | admin/staff    | Seat the guest (table → Occupied) |
| POST   | `/:id/check-out`  | admin/staff    | Close it out (table → Cleaning, adds a visit) |
| DELETE | `/:id`            | admin/staff    | Remove a reservation |

### Customers — `/customers` (admin/staff)
`GET /`, `PUT /:id`, `DELETE /:id`

### Menu — `/menu`
`GET /` is public; `POST /`, `PUT /:id`, `DELETE /:id` are admin/staff.

### Orders — `/orders` (admin/staff)
`GET /`, `POST /`, `PUT /:id`, `DELETE /:id`

### Payments — `/payments` (admin/staff)
`GET /`, `POST /`

### Reports — `/reports`
`GET /overview` (any logged-in user, powers the dashboard stat cards),
`GET /` (admin only, powers the Reports page).

## Project structure

```text
server/
├── src/
│   ├── server.js
│   ├── config/db.js
│   ├── middleware/auth.js         requireAuth, requireRole, optionalAuth
│   ├── middleware/errorHandler.js
│   ├── models/                    User, Table, Reservation, Customer, MenuItem, Order, Payment
│   ├── controllers/                one per resource
│   ├── routes/                     one per resource
│   └── utils/seed.js
├── .env.example
└── package.json
```
