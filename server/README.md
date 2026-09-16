# ⚙️ Desi Delight — Backend REST API Server

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19.2-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%208-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-jsonwebtoken%209.0-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Bcrypt](https://img.shields.io/badge/Security-bcryptjs%202.4-green)](https://www.npmjs.com/package/bcryptjs)

> Robust, scalable RESTful API powering the **Desi Delight Restaurant Reservation & Table Management System**. Built with Node.js, Express, and MongoDB to deliver real-time table floor status tracking, unauthenticated guest booking linking, order processing, and administrative reporting.

---

## 📑 Table of Contents

- [Core Capabilities](#-core-capabilities)
- [System Architecture](#-system-architecture)
  - [The Guest Booking ➔ Account History Merger](#the-guest-booking--account-history-merger)
  - [Authentication & RBAC Model](#authentication--rbac-model)
- [Database Models & Schemas](#-database-models--schemas)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Database Seeding](#database-seeding)
  - [Running the Server](#running-the-server)
- [Demo Credentials](#-demo-credentials)
- [Complete API Reference](#-complete-api-reference)
  - [1. Authentication (`/api/auth`)](#1-authentication-apiauth)
  - [2. Tables (`/api/tables`)](#2-tables-apitables)
  - [3. Reservations (`/api/reservations`)](#3-reservations-apireservations)
  - [4. Customers (`/api/customers`)](#4-customers-apicustomers)
  - [5. Menu (`/api/menu`)](#5-menu-apimenu)
  - [6. Orders (`/api/orders`)](#6-orders-apiorders)
  - [7. Payments (`/api/payments`)](#7-payments-apipayments)
  - [8. Reports & Analytics (`/api/reports`)](#8-reports--analytics-apireports)
  - [9. System Health (`/api/health`)](#9-system-health-apihealth)
- [Error Handling](#-error-handling)

---

## 🚀 Core Capabilities

* **Unrestricted Guest Reservations**: Allows guests to reserve tables immediately without creating an account first.
* **Smart Phone-Keyed Ledger**: Automatically merges anonymous guest reservations into a registered user's booking history as soon as they sign up or log in.
* **Table Lifecycle Management**: Tracks table availability transitions through `Available` ➔ `Reserved` ➔ `Occupied` ➔ `Cleaning`.
* **Kitchen Order Processing**: Links itemized food orders to active dining reservations with progress status tracking.
* **Financial Settlements**: Records payments by Cash, Card, or UPI with instant receipt status updates.
* **Role-Based Security**: Three authorization tiers (`admin`, `staff`, and `customer`) enforced via Express middleware.
* **Automated Data Seeding**: Populates initial tables, menu items, staff, and customer accounts upon deployment.

---

## 🏗️ System Architecture

### The Guest Booking ➔ Account History Merger

The backend solves the onboarding friction common in hospitality booking platforms:

1. **Unauthenticated Booking**: A guest calls `POST /api/reservations` providing only their `customerName`, `phone`, `date`, `time`, and `guests`. The server saves the reservation with `customer: null`.
2. **Account Onboarding**: When the user registers (`POST /api/auth/register`) or signs in (`POST /api/auth/login`) with that same phone number, the auth controller triggers:
   ```javascript
   await Reservation.updateMany(
     { phone: user.phone, customer: null },
     { customer: user._id }
   );
   ```
3. **Inclusive Querying**: When fetching customer reservations via `GET /api/reservations`, the server queries:
   ```javascript
   { $or: [{ customer: req.user._id }, { phone: req.user.phone }] }
   ```
   This guarantees that past reservations created before account creation appear in the user's dashboard immediately.

### Authentication & RBAC Model

* **Stateless JWT Tokens**: Upon successful login or registration, the server issues a signed JWT (`Authorization: Bearer <token>`) with a 7-day default lifespan (`JWT_EXPIRES_IN`).
* **Middleware Layers**:
  * `requireAuth`: Verifies the JWT signature and attaches the active `User` document to `req.user`.
  * `optionalAuth`: Verifies the token if supplied, but allows unauthenticated requests to pass through gracefully (used for public booking endpoints).
  * `requireRole(...roles)`: Enforces role permissions, rejecting unauthorized tiers with `403 Forbidden`.
* **Password Hashing**: User passwords are encrypted with `bcryptjs` using 10 salt rounds via a Mongoose `pre('save')` hook and stripped from queries by default (`select: false`).

---

## 🗄️ Database Models & Schemas

| Model | Schema File | Key Fields | Description |
|---|---|---|---|
| **User** | `models/User.js` | `name`, `email` (unique), `password`, `phone` (indexed), `role` (`admin`, `staff`, `customer`) | System accounts with bcrypt methods |
| **Table** | `models/Table.js` | `number` (unique), `capacity`, `status` (`Available`, `Reserved`, `Occupied`, `Cleaning`), `location` | Restaurant dining floor layout |
| **Reservation**| `models/Reservation.js` | `customerName`, `phone`, `customer` (ref User), `table` (ref Table), `tableNumber`, `date`, `time`, `guests`, `status` | Booking lifecycle records |
| **Customer** | `models/misc.js` | `name`, `phone` (unique), `email`, `address`, `visits`, `user` (ref User) | Hospitality CRM directory & loyalty tracking |
| **MenuItem** | `models/misc.js` | `name`, `category` (`Starters`, `Main Course`, `Desserts`, `Beverages`), `price`, `description`, `image` | Digital menu catalog items |
| **Order** | `models/misc.js` | `reservation` (ref Reservation), `items` `[{ menuItem, qty }]`, `status` (`Placed`, `Preparing`, `Ready`, `Served`), `total` | Table dining food orders |
| **Payment** | `models/misc.js` | `order` (ref Order), `amount`, `method` (`Cash`, `Card`, `UPI`), `status` (`Paid`, `Refunded`) | Settlement transactions |

---

## 📁 Project Structure

```text
server/
├── src/
│   ├── config/
│   │   ├── db.js                 # Mongoose connection logic
│   │   └── seed.js               # Database seeding routine
│   │
│   ├── controllers/
│   │   ├── authController.js     # Register, Login, Me, ForgotPassword
│   │   ├── tableController.js    # Floor tables CRUD & status patch
│   │   ├── reservationController.js # Booking creation, seating, cancellation
│   │   └── miscController.js     # Menu, Order, Payment, Customer, Reports
│   │
│   ├── middleware/
│   │   ├── auth.js               # requireAuth, optionalAuth, requireRole
│   │   └── errorHandler.js       # 404 handler and central error response
│   │
│   ├── models/
│   │   ├── User.js               # User account schema
│   │   ├── Table.js              # Dining table schema
│   │   ├── Reservation.js        # Reservation schema
│   │   └── misc.js               # Customer, MenuItem, Order, Payment schemas
│   │
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth
│   │   ├── tableRoutes.js        # /api/tables
│   │   ├── reservationRoutes.js  # /api/reservations
│   │   └── miscRoutes.js         # Customers, Menu, Orders, Payments, Reports
│   │
│   ├── utils/
│   │   ├── generateToken.js      # JWT signing utility
│   │   └── seed.js               # Standalone seed executor
│   │
│   └── server.js                 # Express application entry point
│
├── .env.example                  # Environment variables template
├── package.json
└── README.md                     # Backend Documentation
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **MongoDB**: A running local MongoDB instance (`mongodb://127.0.0.1:27017/desi-delight`) or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection URI.

### Installation
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Configuration
Copy the sample environment file and configure your settings:
```bash
cp .env.example .env
```

Define the following environment keys in `.env`:
```ini
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/desi-delight
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:3000
```

### Database Seeding
Populate the database with sample tables, 5 staff accounts, 10 customer records, and menu items:
```bash
npm run seed
```
*(Note: The server also verifies and auto-seeds missing default accounts on startup in `server.js`)*

### Running the Server
* **Development mode** (with Nodemon hot-reload):
  ```bash
  npm run dev
  ```
* **Standard start**:
  ```bash
  npm start
  ```
The API server will listen on `http://localhost:5000`.

---

## 🔑 Demo Credentials

| Role | Email | Password | Phone |
|---|---|---|---|
| **Admin** | `admin@desidelighthotels.com` | `admin123` | `9000000001` |
| **Staff** | `staff@desidelighthotels.com` | `staff123` | `9000000002` |
| **Customer** | `asha@example.com` | `customer123` | `9000000003` |

---

## 📡 Complete API Reference

All routes are mounted under `/api`.

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Any | Create account (`name`, `email`, `password`, `phone`) & claim guest bookings |
| `POST` | `/api/auth/login` | Public | Any | Sign in with email & password, claim guest bookings, returns JWT |
| `POST` | `/api/auth/forgot-password` | Public | Any | Request password reset token or confirmation |
| `GET` | `/api/auth/me` | Bearer | Any | Retrieve current authenticated profile |
| `PUT` | `/api/auth/me` | Bearer | Any | Update authenticated user's name or phone |

### 2. Tables (`/api/tables`)
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `GET` | `/api/tables` | Public | Any | Retrieve all tables sorted by number |
| `POST` | `/api/tables` | Bearer | Admin, Staff | Add a new dining table (`number`, `capacity`, `location`) |
| `PUT` | `/api/tables/:id` | Bearer | Admin, Staff | Update table capacity, location, or number |
| `PATCH` | `/api/tables/:id/status`| Bearer | Admin, Staff | Update status only (`Available`, `Reserved`, `Occupied`, `Cleaning`) |
| `DELETE` | `/api/tables/:id` | Bearer | Admin, Staff | Remove a table from the floor plan |

### 3. Reservations (`/api/reservations`)
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `POST` | `/api/reservations` | Optional | Any / Guest | Create reservation. Auto-binds table or finds best fit |
| `GET` | `/api/reservations` | Bearer | Any | Get reservations (scoped to user's bookings for Customers, all for Staff/Admin) |
| `PUT` | `/api/reservations/:id` | Bearer | Admin, Staff | Modify reservation details |
| `POST` | `/api/reservations/:id/check-in` | Bearer | Admin, Staff | Seat guest, changes linked table status to `Occupied` |
| `POST` | `/api/reservations/:id/check-out`| Bearer | Admin, Staff | Conclude dining, sets table to `Cleaning`, increments customer visit count |
| `POST` | `/api/reservations/:id/cancel` | Bearer | Any | Cancel reservation and immediately free associated table |
| `DELETE` | `/api/reservations/:id` | Bearer | Admin, Staff | Delete reservation record permanently |

### 4. Customers (`/api/customers`)
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `GET` | `/api/customers` | Bearer | Admin, Staff | List all customer profiles with visit counts |
| `PUT` | `/api/customers/:id` | Bearer | Admin, Staff | Update customer notes, address, or details |
| `DELETE` | `/api/customers/:id` | Bearer | Admin, Staff | Remove customer record |

### 5. Menu (`/api/menu`)
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `GET` | `/api/menu` | Public | Any | List all menu dishes categorized |
| `POST` | `/api/menu` | Bearer | Admin, Staff | Add dish (`name`, `category`, `price`, `description`, `image`) |
| `PUT` | `/api/menu/:id` | Bearer | Admin, Staff | Edit existing menu item |
| `DELETE` | `/api/menu/:id` | Bearer | Admin, Staff | Delete menu item |

### 6. Orders (`/api/orders`)
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `GET` | `/api/orders` | Bearer | Admin, Staff | View all active orders and items |
| `POST` | `/api/orders` | Bearer | Admin, Staff | Create order attached to reservation |
| `PUT` | `/api/orders/:id` | Bearer | Admin, Staff | Update order status (`Placed`, `Preparing`, `Ready`, `Served`) |
| `DELETE` | `/api/orders/:id` | Bearer | Admin, Staff | Remove an order |

### 7. Payments (`/api/payments`)
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `GET` | `/api/payments` | Bearer | Admin, Staff | List all payment receipts and transaction records |
| `POST` | `/api/payments` | Bearer | Admin, Staff | Settle payment (`orderId`, `amount`, `method`: Cash/Card/UPI) |

### 8. Reports & Analytics (`/api/reports`)
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `GET` | `/api/reports/overview` | Bearer | Any | Dashboard summary: available tables, today's bookings, revenue |
| `GET` | `/api/reports` | Bearer | Admin | Comprehensive analytics: monthly revenue, occupancy %, frequent guests |

### 9. System Health (`/api/health`)
* `GET /api/health` ➔ Returns `{ "status": "ok" }`.

---

## ⚠️ Error Handling

Errors return standard JSON payloads with descriptive messages and relevant HTTP status codes:

```json
{
  "message": "Table 4 is already occupied during this time window."
}
```

Common status codes:
* `200 OK`: Request succeeded.
* `201 Created`: Resource successfully created.
* `400 Bad Request`: Missing or invalid input payload.
* `401 Unauthorized`: Missing, invalid, or expired JWT bearer token.
* `403 Forbidden`: Authenticated user lacks the necessary role permissions.
* `404 Not Found`: Target endpoint or database document does not exist.
* `500 Internal Server Error`: Unhandled server exception.
