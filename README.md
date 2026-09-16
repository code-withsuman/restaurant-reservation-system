# 🍽️ Desi Delight — Restaurant Reservation & Table Management System

[![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20v18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Framework-Express%204-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Bootstrap](https://img.shields.io/badge/Styling-Bootstrap%205-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Auth](https://img.shields.io/badge/Auth-JWT%20Bearer-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> A modern, full-stack MERN restaurant reservation and floor management platform. Designed for high-turnover hospitality operations, offering frictionless guest booking, real-time table tracking, kitchen order management, billing, and role-based administration.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
  - [Guest & Customer Experience](#guest--customer-experience)
  - [Floor & Table Management](#floor--table-management)
  - [Staff & Admin Operations](#staff--admin-operations)
- [System Architecture](#-system-architecture)
  - [Seamless Guest-to-Account Linking](#seamless-guest-to-account-linking)
  - [Dual Data-Layer Support](#dual-data-layer-support)
- [Tech Stack](#-tech-stack)
- [Directory Structure](#-directory-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Backend Setup](#1-backend-setup)
  - [2. Frontend Setup](#2-frontend-setup)
- [Environment Variables](#-environment-variables)
- [Demo Credentials](#-demo-credentials)
- [API Reference](#-api-reference)
- [License](#-license)

---

## 🌟 Overview

**Desi Delight** is an enterprise-grade restaurant table reservation and hospitality management system. It bridges the gap between customer self-service dining reservations and back-of-house restaurant operations. 

Whether operating as a self-contained single-page application with mock storage or backed by a scalable MongoDB & Express REST API, Desi Delight provides end-to-end visibility across reservations, table statuses, orders, payments, and staff schedules.

---

## ✨ Key Features

### Guest & Customer Experience
* **Instant Guest Booking**: Reserve a table without mandatory registration—just name, phone number, date, time, and party size.
* **Intelligent Table Matching**: Automatically computes and assigns the best-fitting available table based on party capacity.
* **Interactive Digital Menu**: Filter by cuisine, dietary tags (Veg/Non-Veg), and popular chef specials.
* **Customer Portal**: Authenticated history tracking, upcoming booking modifications, cancellations, and feedback submission.
* **Adaptive Theme**: One-click toggle between Dark and Light luxury themes.

### Floor & Table Management
* **Visual Floor Grid**: Live indicators of dining room tables with immediate status flags (`Available`, `Occupied`, `Cleaning`).
* **One-Click Check-In / Check-Out**: Seamlessly seat incoming parties (table flips to `Occupied`) and release tables upon exit (flips to `Cleaning`).
* **Table Capacity Management**: Dynamic table addition, capacity adjustments, and section layout assignments.

### Staff & Admin Operations
* **Role-Based Access Control (RBAC)**: Secure access tiers for `Admin`, `Staff`, and `Customer`.
* **Kitchen Orders & POS**: Live order ticketing, order itemization, and status lifecycles (`Received`, `Preparing`, `Served`).
* **Billing & Payments**: Invoice generation supporting Cash, Card, and Online settlement.
* **Staff Scheduling & Roles**: Admin controls to provision staff credentials, shifts, and permission tiers.
* **Reports & Analytics**: High-level KPI dashboards showing daily covers, peak booking hours, occupancy rates, and revenue breakdown.

---

## 🏗️ System Architecture

### Seamless Guest-to-Account Linking
Traditional platforms force users to register before booking. Desi Delight implements an automated **phone-number ledger system**:
1. A guest reserves a table anonymously using their contact phone number.
2. When the customer eventually signs up or logs into an account with that same phone number, the backend automatically binds all prior unassigned reservations to their new User ID:
   $$\text{Reservation.updateMany}(\{ \text{phone}, \text{customer: null} \}, \{ \text{customer: user.\_id} \})$$
3. Complete booking history is immediately available without manual claim workflows.

### Dual Data-Layer Support
The React frontend is architected with a decoupled service tier (`src/services/`):
* **Demo / Offline Mode**: Uses a seedable `localStorage` database engine (`db.js`) for instant zero-dependency previews.
* **Production API Mode**: Easily routes to the Node.js + Express backend via `api.js` with centralized JWT request interceptors.

---

## 💻 Tech Stack

### Frontend
| Technology | Description |
|---|---|
| **React 18** | Functional component architecture with hooks |
| **React Router v6** | Client-side routing and protected role gates |
| **Bootstrap 5 & Icons** | Responsive UI styling, modal workflows, responsive grid |
| **Axios** | HTTP client with automatic bearer token injection |

### Backend
| Technology | Description |
|---|---|
| **Node.js & Express 4** | Lightweight RESTful microservice API |
| **MongoDB & Mongoose 8** | Schematized NoSQL database with relation population |
| **JWT (JSON Web Tokens)** | Stateless bearer authorization with 7-day TTL |
| **Bcrypt.js** | Salted cryptographic password hashing |
| **CORS & Dotenv** | Cross-Origin resource sharing and configuration isolation |

---

## 📁 Directory Structure

```text
restaurant-reservation-system/
├── frontend/                     # React Single-Page Application
│   ├── public/                   # Static assets, favicon, HTML template
│   ├── src/
│   │   ├── components/           # Header, Footer, ProtectedRoute, Home sections
│   │   ├── context/              # AuthContext, ThemeContext
│   │   ├── pages/                # BookTable, Dashboard, Tables, Orders, Reports...
│   │   ├── routes/               # AppRoutes configuration
│   │   ├── services/             # API client & local mock storage engine
│   │   ├── utils/                # Date/time helpers, formatters
│   │   ├── App.js
│   │   ├── index.css             # Design tokens & custom luxury theme styles
│   │   └── index.js
│   └── package.json
│
├── server/                       # Node.js + Express REST API
│   ├── src/
│   │   ├── config/               # Database connection & seed script
│   │   ├── controllers/          # Request handlers for auth, tables, bookings
│   │   ├── middleware/           # authMiddleware, roleValidator, errorHandlers
│   │   ├── models/               # User, Table, Reservation, Customer, Menu schemas
│   │   ├── routes/               # Modular Express router files
│   │   ├── utils/                # JWT signers & helpers
│   │   └── server.js             # API entrypoint
│   ├── .env.example
│   └── package.json
│
└── README.md                     # Root Documentation
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18.x or higher recommended)
* **npm** (v9.x or higher)
* **MongoDB** (Local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster URI)

---

### 1. Backend Setup

1. Open your terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   *(Edit `.env` with your MongoDB URI and custom JWT secret)*

4. Seed the database with initial tables, users, and menu items:
   ```bash
   npm run seed
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will start on `http://localhost:5000`.*

---

### 2. Frontend Setup

1. In a new terminal window, navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the client:
   ```bash
   npm start
   ```
   *The client will open in your browser at `http://localhost:3000`.*

---

## ⚙️ Environment Variables

Create a `.env` file in the `server` directory based on the following template:

```ini
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/desi-delight
JWT_SECRET=super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:3000
```

---

## 🔑 Demo Credentials

After running `npm run seed` in the server, the following pre-configured accounts are available:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Admin** | `admin@desidelighthotels.com` | `admin123` | Full access: Analytics, Staff, Settings, Menu, Tables |
| **Staff** | `staff@desidelighthotels.com` | `staff123` | Floor access: Tables, Reservations, Orders, Payments |
| **Customer** | `asha@example.com` | `customer123` | Client access: Booking, Personal Reservations, Profile |

---

## 📡 API Reference

All backend endpoints are prefixed with `/api`.

| Module | Method | Endpoint | Access | Description |
|---|---|---|---|---|
| **Auth** | `POST` | `/api/auth/register` | Public | Register new customer account |
| | `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT |
| | `GET` | `/api/auth/me` | User | Get current profile |
| **Tables** | `GET` | `/api/tables` | Public | List all floor tables and statuses |
| | `POST` | `/api/tables` | Admin/Staff | Create a new table |
| | `PATCH` | `/api/tables/:id/status`| Admin/Staff | Update status (`Available`, `Occupied`, `Cleaning`) |
| **Reservations** | `POST` | `/api/reservations` | Public/User | Book a table (Guest or Registered) |
| | `GET` | `/api/reservations` | User/Staff | Retrieve reservations (role-scoped) |
| | `POST` | `/api/reservations/:id/check-in` | Admin/Staff | Check in party (marks table `Occupied`) |
| | `POST` | `/api/reservations/:id/check-out` | Admin/Staff | Check out party (marks table `Cleaning`) |
| | `POST` | `/api/reservations/:id/cancel` | User/Staff | Cancel booking and release table |
| **Orders** | `GET`/`POST` | `/api/orders` | Admin/Staff | Retrieve or create dining orders |
| **Payments** | `GET`/`POST` | `/api/payments` | Admin/Staff | Retrieve records or process payments |
| **Reports** | `GET` | `/api/reports/overview` | Authenticated | Fetch dashboard metric summary |
| | `GET` | `/api/reports` | Admin | Fetch detailed revenue & occupancy analytics |

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
