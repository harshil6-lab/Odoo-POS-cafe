# pos-cafe

Production-ready hackathon scaffold for a restaurant POS system built with React, Vite, Tailwind CSS, and Supabase.

## Stack

- Frontend: React + Vite
- Styling: Tailwind CSS
- Backend: Supabase Auth, Postgres, and Realtime
- No Express backend
- No MongoDB

## Project structure

```text
pos-cafe/
  frontend/
  supabase/
```

## Setup

1. Create a Supabase project.
2. Run [supabase/schema.sql](./supabase/schema.sql) in the Supabase SQL editor.
3. Copy [frontend/.env.example](./frontend/.env.example) to `frontend/.env` and add your project values.
4. From `pos-cafe/frontend`, run:

```bash
npm install
npm run dev
```

## Included modules

- Authentication with Supabase Auth
- Tables and floor management
- POS terminal with payments
- Kitchen display with realtime sync
- Customer display screen
- Orders, products, and categories management
- Reports dashboard

## Notes

- Realtime order updates are implemented in `frontend/src/hooks/useRealtimeOrders.js`.
- Supabase client setup lives in `frontend/src/services/supabaseClient.js`.
- The sample SQL includes starter categories, products, and tables.