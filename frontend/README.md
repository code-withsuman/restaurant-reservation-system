# Table Twelve — Restaurant Reservation & Table Management System

A React frontend scaffold for a restaurant reservation and table management
system, built to the module list in the project brief: authentication,
customer booking, table management, reservations, an admin dashboard, staff
tools, customer records, a menu, orders, payments, and reports.

## Running it

```bash
npm install
npm start
```

The app opens at `http://localhost:3000`.

## How it works right now

This repo has two parts:

- **`/` (this folder)** — the React frontend. It runs standalone against a
  localStorage-backed mock database (`src/services/db.js`) seeded with demo
  data, so it's fully clickable with zero setup.
- **`/server`** — a real Node.js + Express + MongoDB API (see
  `server/README.md`) with the same resources, ready to swap in.

Every frontend page reads/writes through the `services/*.js` files, using
the same method names (`getAll`, `create`, `update`, `remove`, ...) the real
API client uses. Wiring the frontend to the real backend is a matter of
rewriting the insides of those service files to call `services/api.js`
(already set up with an axios instance and a JWT header interceptor)
instead of `db.js` — no page or component needs to change.

To reset the frontend's demo data at any point, open the browser console and run:

```js
localStorage.removeItem("ttw_db_v1")
```
then refresh.

## Booking a table without an account

The Home page has a **"Book a Table"** button — no login or signup required.
It asks for name, phone number, date, time and party size, picks the
smallest available table that fits, and confirms with a popup showing the
name, table number, date and time, plus a note that logging in or signing up
(with that same phone number) unlocks the full booking history.

That link-up is automatic: booking data is stored keyed by phone number, and
the moment that phone number registers or logs in, every reservation made
under it — before there was ever an account — becomes part of that
account's history. This works the same way in both the mock frontend
database and the real backend (see "The guest-booking → account-history
flow" in `server/README.md` for the backend version).

## Demo accounts

| Role     | Email                     | Password     |
|----------|---------------------------|--------------|
| Admin    | admin@tabletwelve.com     | admin123     |
| Staff    | staff@tabletwelve.com     | staff123     |
| Customer | asha@example.com          | customer123  |

The login page also has one-click buttons to fill these in.

## What's implemented

- **Auth** — register, login, forgot password (demo), profile edit, logout,
  role stored on the user (`admin` / `staff` / `customer`).
- **Customer flow** — browse tables on the public Home page, search/filter
  by capacity, book a table, view booking history, cancel a reservation.
- **Table management** — add/edit/delete tables, set capacity and location,
  change status (Available / Reserved / Occupied / Cleaning).
- **Reservations** — create, edit (via cancel + rebook), cancel, check-in,
  check-out, walk-in booking for staff.
- **Admin dashboard** — total/available/occupied tables, today's bookings,
  today's revenue, popular menu items.
- **Staff tools** — assign tables, update status, check guests in and out.
- **Customers** — searchable customer list with visit counts and a
  "Regular" badge at 5+ visits.
- **Menu** — categories, price, description, full CRUD for admin/staff.
- **Orders** — build an order against a seated table, kitchen queue with
  status progression (Placed → Preparing → Ready → Served).
- **Payments** — record a payment against an order (Cash/Card/UPI), running
  payment history.
- **Reports** — today's reservations, this month's revenue, popular tables,
  frequent customers, current occupancy rate.
- **Role-based routing** — `ProtectedRoute` redirects unauthenticated users
  to `/login` and hides admin/staff-only pages from customers.

## What's not wired up yet (by design, for the next milestone)

- The frontend still talks to the mock database by default — point
  `services/api.js` at `/server` (running on `http://localhost:5000/api`)
  to switch to the real backend.
- Real email/SMS notifications (booking confirmation, cancellation,
  reminders) — currently no-ops on both frontend and backend.
- Real payment gateway integration for Card/UPI.
- QR-code menu, customer reviews, dark mode.

## Folder structure

```text
restaurant-reservation-system/
├── src/                (frontend — see below)
├── server/              real Express + MongoDB API (see server/README.md)
├── public/
└── package.json

src/
├── components/     Navbar, Sidebar, DashboardLayout, TableCard,
│                    ReservationCard, StatCard, Footer, ProtectedRoute,
│                    BookTableModal (guest booking + success popup)
├── pages/           Home, Login, Register, ForgotPassword, Dashboard,
│                    Tables, Reservations, Customers, Menu, Orders,
│                    Payments, Reports, Profile, NotFound
├── services/        api.js, db.js, authService, reservationService,
│                    tableService, menuService (menu/order/payment/customer)
├── context/         AuthContext.jsx
├── routes/          AppRoutes.jsx
├── App.js
└── index.js
```

## Design

Custom design system (see `src/index.css`) rather than default Bootstrap
look: ink/parchment/brass palette, Fraunces for display type, Inter for
body, JetBrains Mono for data (table numbers, timestamps, reservation IDs).
The signature element is the seating-chart dot on every table card and the
perforated "ticket" styling on reservation cards.
