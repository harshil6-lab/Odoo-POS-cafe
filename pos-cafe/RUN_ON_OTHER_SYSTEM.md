# Run pos-cafe On Another System

This document explains everything required to run the `pos-cafe` project on a different computer.

You do not need to push the project to GitHub to use this. You can copy the full `pos-cafe` folder using ZIP, USB, network share, or any file transfer method.

## 1. What this project uses

Frontend stack:

- React
- Vite
- Tailwind CSS
- React Router
- Supabase JavaScript client
- Axios

Backend stack:

- Supabase Auth
- Supabase PostgreSQL Database
- Supabase Realtime

This project does not use:

- MongoDB
- Express backend

## 2. Folder to copy

Copy this full folder to the other system:

```text
pos-cafe/
```

Important subfolders:

- `pos-cafe/frontend`
- `pos-cafe/supabase`

## 3. Software required on the other system

Install these dependencies first:

1. Node.js 20 or later
2. npm 10 or later
3. A Supabase account and project
4. Git is optional

Check installed versions:

```bash
node -v
npm -v
```

If Node.js is missing, install it from the official Node.js website.

## 4. Create a Supabase project

1. Open Supabase.
2. Create a new project.
3. Wait until the database is ready.
4. Open the project dashboard.

You will need these two values later:

- `Project URL`
- `anon public key`

## 5. Create database schema

The SQL schema for this project is here:

```text
pos-cafe/supabase/schema.sql
```

To apply it:

1. Open Supabase SQL Editor.
2. Open the file `pos-cafe/supabase/schema.sql` on your machine.
3. Copy the full SQL.
4. Paste it into Supabase SQL Editor.
5. Run it.

What this SQL creates:

- `users`
- `tables`
- `categories`
- `products`
- `orders`
- `order_items`
- `payments`
- `sessions`

It also creates:

- relationships and foreign keys
- indexes
- update triggers
- auth sync trigger for new users
- row level security policies
- sample seed data for tables, categories, and products

## 6. Enable authentication in Supabase

This project uses Supabase Auth.

Recommended Auth setup:

1. Open `Authentication` in Supabase.
2. Enable `Email` provider.
3. Disable email confirmation for local hackathon testing if you want faster access.
4. If you keep email confirmation enabled, users must confirm email before login.

How it works in this project:

- Signup happens from the React app.
- A trigger in `schema.sql` creates or updates the matching row in `public.users`.

## 7. Realtime requirement

Kitchen Display and Customer Display use Supabase Realtime.

If realtime does not work automatically in your Supabase setup, check these points:

1. Open `Database` in Supabase.
2. Open `Replication` or `Realtime` settings depending on your Supabase UI version.
3. Make sure the `orders` table is available for realtime events.

The frontend realtime logic is already implemented in:

```text
frontend/src/hooks/useRealtimeOrders.js
```

## 8. Create environment file

Go to:

```text
pos-cafe/frontend
```

Create a file named:

```text
.env
```

Use this template:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

You can also copy from:

```text
pos-cafe/frontend/.env.example
```

Important:

- Do not commit `.env`
- Do not share the key publicly in screenshots or public repos

## 9. Install frontend dependencies

Open terminal in:

```text
pos-cafe/frontend
```

Run:

```bash
npm install
```

This installs all required packages from `package.json`, including:

- `react`
- `react-dom`
- `react-router-dom`
- `@supabase/supabase-js`
- `axios`
- `vite`
- `tailwindcss`
- `postcss`
- `autoprefixer`
- `@vitejs/plugin-react`

## 10. Run the project in development

From `pos-cafe/frontend`, run:

```bash
npm run dev
```

Expected result:

- Vite starts local development server
- browser URL is usually `http://localhost:5173`

## 11. Build for production

To verify production build:

```bash
npm run build
```

To preview production build locally:

```bash
npm run preview
```

## 12. First-time usage flow

After setup:

1. Start the app with `npm run dev`
2. Open the browser
3. Go to signup page
4. Create the first operator account
5. Log in
6. Open Dashboard, POS, Kitchen Display, and Reports

The sample SQL already inserts:

- sample dining tables
- sample categories
- sample menu items

So the app should not start empty.

## 13. Main app features included

This scaffold already includes:

1. Authentication
2. Tables / floor plan view
3. POS terminal
4. Kitchen Display with realtime order updates
5. Customer Display
6. Orders management
7. Products management
8. Categories management
9. Payments for Cash, Card, and UPI QR
10. Reports dashboard

## 14. Important files

Use these files when debugging or extending the project:

- `frontend/package.json`
- `frontend/src/App.jsx`
- `frontend/src/main.jsx`
- `frontend/src/context/AuthContext.jsx`
- `frontend/src/services/supabaseClient.js`
- `frontend/src/services/authService.js`
- `frontend/src/services/orderService.js`
- `frontend/src/hooks/useRealtimeOrders.js`
- `supabase/schema.sql`

## 15. If you cannot push to GitHub

You can still run this on another system.

Use any of these methods:

1. Compress the `pos-cafe` folder into a ZIP file and transfer it
2. Copy the folder with USB drive
3. Use a private cloud drive
4. Copy through local network

After copying, follow this order:

1. Install Node.js
2. Create Supabase project
3. Run `schema.sql`
4. Create `frontend/.env`
5. Run `npm install`
6. Run `npm run dev`

## 16. Common issues and fixes

### Error: Missing Supabase environment variables

Cause:

- `.env` file is missing
- variable names are wrong

Fix:

Make sure `frontend/.env` contains:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Then restart Vite.

### Error: Login or signup not working

Cause:

- Email provider not enabled in Supabase
- Email confirmation required but not confirmed

Fix:

Check Supabase Authentication settings.

### Error: Kitchen screen not updating in realtime

Cause:

- Realtime for `orders` table is not enabled

Fix:

Check Supabase Realtime or replication settings for the `orders` table.

### Error: App opens but shows no data

Cause:

- `schema.sql` was not executed
- sample seed inserts failed

Fix:

Run `schema.sql` again and confirm the tables contain records.

### Error: npm install fails

Cause:

- old Node.js version

Fix:

Upgrade Node.js to version 20 or later.

## 17. Verified commands

These commands were already validated for this project:

```bash
npm install
npm run build
```

Run them from:

```text
pos-cafe/frontend
```

## 18. Quick setup checklist

Use this checklist on the other system:

1. Copy `pos-cafe` folder
2. Install Node.js 20+
3. Create Supabase project
4. Run `supabase/schema.sql`
5. Create `frontend/.env`
6. Open terminal in `frontend`
7. Run `npm install`
8. Run `npm run dev`
9. Create first user account
10. Start using the software

## 19. Recommended for hackathon demo

Before presenting, make sure:

1. Supabase project is active
2. `.env` values are correct
3. Sample menu items exist
4. At least one user can log in
5. Open two browser tabs

Demo suggestion:

1. One tab on POS Terminal
2. One tab on Kitchen Display or Customer Display

This will show realtime order flow clearly during the demo.