# 🎨 Desi Delight — Frontend Web Application

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![React Router](https://img.shields.io/badge/React_Router-v6.22-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.3-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Axios](https://img.shields.io/badge/HTTP-Axios%201.6-5A29E4?logo=axios&logoColor=white)](https://axios-http.com/)

> Modern, responsive Single-Page Application (SPA) for **Desi Delight Hotels & Restaurant**. Features a luxury dining landing page, frictionless guest table reservation workflows, real-time table floor management, kitchen order tracking, billing, staff administration, and role-based portals.

---

## 📑 Table of Contents

- [Features & Capabilities](#-features--capabilities)
- [Application Architecture](#-application-architecture)
  - [Dual Data-Layer System](#dual-data-layer-system)
  - [State & Context Providers](#state--context-providers)
  - [Route Protection & RBAC](#route-protection--rbac)
- [Pages & Routing](#-pages--routing)
- [Design System & Styling](#-design-system--styling)
- [Folder Structure](#-folder-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Available Scripts](#available-scripts)
  - [Environment Configuration](#environment-configuration)
- [Demo Credentials & Quick Login](#-demo-credentials--quick-login)

---

## ✨ Features & Capabilities

### 1. Customer & Guest Experience
* **Hero & Fine-Dining Showcase**: Engaging landing page displaying chef specials, restaurant story, customer testimonials, food gallery, and contact information.
* **Instant Guest Table Booking**: Zero barrier to entry—customers can book directly using just their name, phone number, date, time slot, and party size.
* **Smart Capacity Matching**: Automatically recommends the best table size matching the reservation party count.
* **Customer Account Dashboard**: View upcoming and completed reservations, modify or cancel bookings, update profiles, and submit customer feedback.
* **Theme Customization**: Built-in Dark / Light mode toggle with persistent local preference.

### 2. Back-of-House & Floor Operations
* **Interactive Floor Grid**: Visual table cards displaying live statuses (`Available`, `Reserved`, `Occupied`, `Cleaning`) with section location details.
* **Seating Workflow**: One-click **Check-In** (seats party and marks table `Occupied`) and **Check-Out** (frees table, marks `Cleaning`, and logs customer visit).
* **Kitchen Order Management**: Create food orders assigned to active reservations and track status through `Placed` ➔ `Preparing` ➔ `Ready` ➔ `Served`.
* **POS & Billing**: Settle bills with support for Cash, Card, and UPI payment methods with downloadable receipt states.

### 3. Administration & Business Intelligence
* **Analytics Dashboard**: High-level KPIs including table occupancy percentage, daily covers, revenue tallies, and top menu favorites.
* **Menu Catalog CRUD**: Manage dishes, prices, categories, descriptions, and dietary tags.
* **Staff Management**: Create and configure staff accounts, assign roles, and review shift schedules.
* **Offers & Promotions**: Launch and edit seasonal restaurant discounts and promotional banners.

---

## 🏗️ Application Architecture

```text
               ┌───────────────────────────────┐
               │    React UI Pages / Views     │
               └──────────────┬────────────────┘
                              │
               ┌──────────────▼────────────────┐
               │   Service Layer (Services)    │
               │ authService | reservation...  │
               └───────┬───────────────┬───────┘
                       │               │
        [Default / Offline]     [Production API]
                       │               │
         ┌─────────────▼───┐     ┌─────▼──────────┐
         │  db.js (Mock)   │     │  api.js (Axios)│
         │  localStorage   │     │  JWT Bearer    │
         └─────────────────┘     └────────┬───────┘
                                          │
                                   ┌──────▼───────┐
                                   │  Express API │
                                   └──────────────┘
```

### Dual Data-Layer System
The application features an adaptable service-tier design:
1. **Local Mock Storage (`src/services/db.js`)**: Runs directly in the browser out-of-the-box using `localStorage` (`ttw_db_v1`). Pre-populated with realistic tables, active reservations, customer records, and menu items.
2. **REST API Client (`src/services/api.js`)**: An Axios instance pre-configured with a JWT request interceptor that passes `Authorization: Bearer <token>`. Pointing the services to `api.js` connects the app directly to the Node.js/Express server with zero UI changes.

To reset the mock database to default demo data at any time:
```javascript
localStorage.removeItem("ttw_db_v1");
window.location.reload();
```

### State & Context Providers
* **`AuthContext.jsx`**: Manages user authentication state, token persistence (`ttw_token`), logged-in user profile (`ttw_user`), login handler, and logout cleanup.
* **`ThemeContext.jsx`**: Handles application theme state (`light` or `dark`), saves selection to `ttw_theme`, and toggles HTML body class attributes.

### Route Protection & RBAC
The `ProtectedRoute.jsx` component wraps private routes to ensure only authenticated users can access them, with optional role filtering:
* **Public**: `/`, `/book-table`, `/login`, `/register`, `/forgot-password`, `/management-login`
* **Customer / All Users**: `/dashboard`, `/reservations`, `/profile`, `/feedback`
* **Staff & Admin**: `/tables`, `/customers`, `/menu`, `/orders`, `/payments`
* **Admin Exclusive**: `/staff-management`, `/offers-management`, `/reports`, `/settings`

---

## 🗺️ Pages & Routing

| Path | Component | Access | Description |
|---|---|---|---|
| `/` | `Home.jsx` | Public | Landing page with Hero, Menu, Chefs, & Reviews |
| `/book-table` | `BookTable.jsx` | Public | Dedicated table booking page with party picker |
| `/login` | `Login.jsx` | Public | Customer portal authentication |
| `/management-login` | `ManagementLogin.jsx`| Public | Staff & Admin login with demo quick-fill |
| `/register` | `Register.jsx` | Public | New user registration |
| `/dashboard` | `Dashboard.jsx` | Authenticated | User/Admin operational overview & metrics |
| `/tables` | `Tables.jsx` | Staff / Admin | Live floor plan and table status manager |
| `/reservations`| `Reservations.jsx` | Authenticated | Reservation lists, filtering, and check-in |
| `/customers` | `Customers.jsx` | Staff / Admin | Customer directory with visit count |
| `/menu` | `Menu.jsx` | Staff / Admin | Menu item catalog and pricing CRUD |
| `/orders` | `Orders.jsx` | Staff / Admin | Kitchen order queue & item builder |
| `/payments` | `Payments.jsx` | Staff / Admin | Billing settlement and payment records |
| `/staff-management` | `StaffManagement.jsx` | Admin | Staff member account provisioning & roles |
| `/offers-management`| `OffersManagement.jsx`| Admin | Promotional deals and discounts manager |
| `/reports` | `Reports.jsx` | Admin | Occupancy, revenue, and guest analytics |
| `/feedback` | `Feedback.jsx` | Authenticated | Customer review & rating submission |
| `/settings` | `Settings.jsx` | Admin | Restaurant opening hours & operational settings |

---

## 🎨 Design System & Styling

The frontend styling is defined in `src/index.css` using custom design tokens rather than generic templates:
* **Color Palette**:
  * Brand Crimson: `#C0392B` / `#E74C3C`
  * Champagne Gold: `#D4AF37` / `#F1C40F`
  * Obsidian / Dark Mode: `#121212` / `#1E1E1E`
  * Clean Light Mode: `#F8F9FA` / `#FFFFFF`
* **Typography**:
  * Heading Font: *Playfair Display* (Editorial fine-dining aesthetic)
  * Body Font: *Poppins* and *Inter*
* **Micro-Interactions**: Smooth table status badges, animated modal backdrops, floating quick-booking CTAs, and responsive hamburger navigation.

---

## 📁 Folder Structure

```text
frontend/
├── public/
│   ├── index.html              # HTML shell & Google Fonts imports
│   ├── favicon.ico
│   └── logo.png
│
├── src/
│   ├── components/
│   │   ├── Header/             # Navbar, Navigation links, Theme switcher
│   │   ├── Home/               # Hero, FeaturedDishes, AboutUs, Chefs, etc.
│   │   ├── BookTableModal.jsx  # Floating booking modal
│   │   ├── CancelModal.jsx     # Reservation cancellation confirm
│   │   ├── DashboardLayout.jsx # Layout wrapper with sidebar
│   │   ├── Footer.jsx          # Branded footer
│   │   ├── ProtectedRoute.jsx  # Role authorization gate
│   │   ├── Sidebar.jsx         # Dashboard navigation sidebar
│   │   ├── StatCard.jsx        # Metric summary card
│   │   └── TableCard.jsx       # Floor table item card
│   │
│   ├── context/
│   │   ├── AuthContext.jsx     # Authentication state provider
│   │   └── ThemeContext.jsx    # Dark/Light theme provider
│   │
│   ├── pages/                  # 20 application page components
│   ├── routes/
│   │   └── AppRoutes.jsx       # Central route configuration
│   │
│   ├── services/
│   │   ├── api.js              # Axios instance with JWT interceptor
│   │   ├── authService.js      # Auth API & mock connector
│   │   ├── db.js               # LocalStorage mock database engine
│   │   ├── menuService.js      # Menu, Order, & Payment services
│   │   ├── reservationService.js# Booking & Table check-in services
│   │   └── tableService.js     # Table CRUD services
│   │
│   ├── utils/                  # Date helpers, formatters
│   ├── App.js                  # App root
│   ├── index.css               # Core styling and design tokens
│   └── index.js                # React DOM entry point
│
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.x or higher
* **npm**: v9.x or higher

### Installation
1. Change into the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm start
   ```
   The application will automatically launch at `http://localhost:3000`.

### Available Scripts
* `npm start` — Runs the development server with live reload.
* `npm run build` — Compiles optimized production bundle into `/build`.
* `npm test` — Launches the test runner.

### Environment Configuration
To connect to a custom backend API server instead of the default `http://localhost:5000/api`, create a `.env` file in the `frontend` root:

```ini
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🔑 Demo Credentials & Quick Login

For evaluation and testing, the **Management Login** (`/management-login`) and **Customer Login** (`/login`) pages include pre-fill buttons for demo credentials:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Admin** | `admin@desidelighthotels.com` | `admin123` | Full administrative control, reports, staff management |
| **Staff** | `staff@desidelighthotels.com` | `staff123` | Floor table management, check-ins, orders, payments |
| **Customer** | `asha@example.com` | `customer123` | Table reservations, personal history, feedback |
