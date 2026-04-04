<p align="center">
  <img src="pos-cafe/frontend/public/favicon.svg" alt="POS Cafe Logo" width="80" height="80" />
</p>

<h1 align="center">POS Cafe</h1>

<p align="center">
  A full-featured Restaurant Point-of-Sale system with role-based workflows, real-time kitchen display, Razorpay payments, and 3D floor visualization.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Supabase-Postgres-3FCF8E?logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Razorpay-Payments-0C2451?logo=razorpay&logoColor=white" alt="Razorpay" />
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT License" />
</p>

---

## Features

| Module | Description |
|--------|-------------|
| **Role-based Auth** | Signup & login with manager, waiter, cashier, chef, and customer roles |
| **Tables & Floor Map** | Real-time table status with 3D preview (React Three Fiber) |
| **Waiter Register** | Select table → browse menu → add to cart → place order |
| **Kitchen Display** | Real-time order tickets synced via Supabase Realtime |
| **Cashier Billing** | View pending bills per table, confirm payment, release table, auto-generate invoice PDF |
| **Razorpay Payments** | UPI QR and card payments via Razorpay popup — no static QR codes |
| **Manager Dashboard** | Full access to all modules: orders, reports, staff, reservations, menu editor |
| **Customer Ordering** | QR code scan → menu → cart → checkout → order tracking |
| **PDF Generation** | Kitchen tickets, billing invoices, and order receipts as downloadable PDFs |
| **Reservations** | Table reservation management |

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite 5, React Router v6 |
| Styling | Tailwind CSS 3, Framer Motion |
| 3D | React Three Fiber, Drei |
| Backend | Supabase (Auth, Postgres, Realtime, RLS) |
| Payments | Razorpay (react-razorpay) |
| Server | Express.js (Razorpay order creation) |

## Project Structure

```
pos-cafe/
├── frontend/
│   ├── public/                  # Static assets & favicon
│   └── src/
│       ├── components/          # Reusable UI components
│       │   └── ui/              # Button, Card, Input, Badge
│       ├── context/             # AuthContext, AppStateContext
│       ├── hooks/               # useRealtimeOrders
│       ├── layouts/             # DashboardLayout, LandingLayout
│       ├── pages/               # All page components
│       │   ├── Dashboard.jsx    # Manager dashboard
│       │   ├── Register.jsx     # Waiter POS register
│       │   ├── Billing.jsx      # Cashier billing
│       │   ├── Kitchen.jsx      # Chef kitchen display
│       │   ├── Tables.jsx       # Floor overview
│       │   ├── TableDetail.jsx  # Manager table detail
│       │   ├── Checkout.jsx     # Customer checkout + Razorpay
│       │   └── ...
│       ├── services/            # Supabase service layer
│       ├── utils/               # Helpers, PDF generation, role navigation
│       └── 3d/                  # Three.js floor visualization
├── backend/
│   └── server.js                # Express server for Razorpay order creation
└── supabase/
    └── schema.sql               # Database schema, enums, triggers, RLS policies
```

## Role-Based Access

| Role | Login Redirect | Table Click | Accessible Pages |
|------|---------------|-------------|-----------------|
| **Manager** | `/dashboard` | View details | All pages |
| **Waiter** | `/tables` | Open register | Tables |
| **Cashier** | `/tables` | View bill | Tables, Billing |
| **Chef** | `/kitchen` | — | Kitchen |
| **Customer** | `/menu` | — | Menu, Cart, Checkout, Track Order |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- [Razorpay](https://razorpay.com) test/live API keys

### 1. Clone the repository

```bash
git clone https://github.com/harshil6-lab/Odoo-POS-cafe.git
cd Odoo-POS-cafe
```

### 2. Set up Supabase

1. Create a new Supabase project.
2. Open the **SQL Editor** and run the contents of [`supabase/schema.sql`](pos-cafe/supabase/schema.sql).
3. Ensure the `user_role` enum includes all values:

```sql
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'waiter';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'chef';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'customer';
```

### 3. Configure environment

Create `pos-cafe/.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
VITE_BACKEND_URL=http://localhost:3001
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your-secret-key
```

### 4. Install & run frontend

```bash
cd pos-cafe/frontend
npm install
npm run dev
```

### 5. Install & run backend (for Razorpay payments)

```bash
cd pos-cafe/backend
npm install
npm start
```

The backend server starts on `http://localhost:3001`.

## Database Schema

Key tables:

| Table | Purpose |
|-------|---------|
| `users` | Staff profiles with `role` enum (manager, waiter, cashier, chef, customer) |
| `tables` | Restaurant tables with `table_code`, `seats`, `status` |
| `categories` | Menu categories |
| `menu_items` | Menu items with `is_available`, price, image |
| `orders` | Orders with `status`, `payment_status`, `payment_method`, `tax`, `total` |
| `order_items` | Line items with `menu_item_id`, `quantity`, `price`, `line_total` |
| `reservations` | Table reservations |

## Payment Flow

- **Cash**: Order inserted with `payment_status: pending` → cashier confirms at billing → table released
- **UPI / Card**: Razorpay popup opens → customer pays → order inserted with `payment_status: paid` → kitchen receives immediately

## Screenshots

> Run the app locally and visit `http://localhost:5173` to explore all modules.

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

Copyright © 2026 HARSHIL