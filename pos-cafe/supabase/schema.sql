create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type user_role as enum ('admin', 'manager', 'cashier', 'kitchen');
  end if;

  if not exists (select 1 from pg_type where typname = 'table_status') then
    create type table_status as enum ('available', 'occupied', 'reserved', 'cleaning');
  end if;

  if not exists (select 1 from pg_type where typname = 'order_status') then
    create type order_status as enum ('draft', 'pending', 'preparing', 'ready', 'served', 'completed', 'cancelled');
  end if;

  if not exists (select 1 from pg_type where typname = 'payment_method') then
    create type payment_method as enum ('cash', 'card', 'upi_qr');
  end if;

  if not exists (select 1 from pg_type where typname = 'session_status') then
    create type session_status as enum ('open', 'closed');
  end if;
end $$;

alter type user_role add value if not exists 'customer';
alter type user_role add value if not exists 'waiter';
alter type user_role add value if not exists 'chef';

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text not null,
  role user_role not null default 'cashier',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  phone text,
  role user_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tables (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  area text,
  capacity integer not null default 4 check (capacity > 0),
  pos_x numeric(10, 2),
  pos_y numeric(10, 2),
  shape text not null default 'square',
  status table_status not null default 'available',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  sort_order integer not null default 1,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories (id) on delete set null,
  name text not null,
  sku text unique,
  description text,
  image_url text,
  price numeric(10, 2) not null check (price >= 0),
  tax_rate numeric(5, 2) not null default 5.00 check (tax_rate >= 0),
  available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete restrict,
  opened_at timestamptz not null default now(),
  closed_at timestamptz,
  opening_cash numeric(10, 2) not null default 0,
  closing_cash numeric(10, 2),
  notes text,
  status session_status not null default 'open'
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint generated always as identity unique,
  table_id uuid references public.tables (id) on delete set null,
  user_id uuid references public.users (id) on delete set null,
  session_id uuid references public.sessions (id) on delete set null,
  order_type text not null default 'dine-in',
  customer_name text,
  status order_status not null default 'pending',
  notes text,
  subtotal numeric(10, 2) not null default 0,
  tax_amount numeric(10, 2) not null default 0,
  service_charge numeric(10, 2) not null default 0,
  total_amount numeric(10, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  quantity numeric(10, 2) not null check (quantity > 0),
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  line_total numeric(10, 2) not null check (line_total >= 0),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  method payment_method not null,
  amount numeric(10, 2) not null check (amount >= 0),
  status text not null default 'completed',
  provider_reference text,
  paid_at timestamptz not null default now()
);

create index if not exists idx_products_category_id on public.products (category_id);
create index if not exists idx_sessions_user_id on public.sessions (user_id);
create index if not exists idx_orders_table_id on public.orders (table_id);
create index if not exists idx_orders_user_id on public.orders (user_id);
create index if not exists idx_orders_status on public.orders (status);
create index if not exists idx_orders_created_at on public.orders (created_at desc);
create index if not exists idx_order_items_order_id on public.order_items (order_id);
create index if not exists idx_payments_order_id on public.payments (order_id);
create index if not exists idx_payments_method on public.payments (method);

drop trigger if exists trg_users_updated_at on public.users;
create trigger trg_users_updated_at
before update on public.users
for each row
execute function public.set_updated_at();

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = excluded.full_name,
      updated_at = now();

  insert into public.profiles (id, full_name, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'phone',
    coalesce((new.raw_user_meta_data ->> 'role')::user_role, 'customer')
  )
  on conflict (id) do update
  set full_name = excluded.full_name,
      phone = excluded.phone,
      role = excluded.role,
      updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.tables enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.sessions enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;

drop policy if exists "authenticated users manage profiles" on public.users;
create policy "authenticated users manage profiles"
on public.users
for all
to authenticated
using (auth.uid() is not null)
with check (auth.uid() is not null);

drop policy if exists "users can manage own profile" on public.profiles;
create policy "users can manage own profile"
on public.profiles
for all
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "anon can insert customer profiles" on public.profiles;
create policy "anon can insert customer profiles"
on public.profiles
for insert
to anon
with check (role = 'customer');

drop policy if exists "authenticated users manage tables" on public.tables;
create policy "authenticated users manage tables"
on public.tables
for all
to authenticated
using (auth.uid() is not null)
with check (auth.uid() is not null);

drop policy if exists "catalog readable by all" on public.categories;
create policy "catalog readable by all"
on public.categories
for select
to anon, authenticated
using (active = true);

drop policy if exists "authenticated users manage categories" on public.categories;
create policy "authenticated users manage categories"
on public.categories
for all
to authenticated
using (auth.uid() is not null)
with check (auth.uid() is not null);

drop policy if exists "products readable by all" on public.products;
create policy "products readable by all"
on public.products
for select
to anon, authenticated
using (available = true);

drop policy if exists "authenticated users manage products" on public.products;
create policy "authenticated users manage products"
on public.products
for all
to authenticated
using (auth.uid() is not null)
with check (auth.uid() is not null);

drop policy if exists "authenticated users manage sessions" on public.sessions;
create policy "authenticated users manage sessions"
on public.sessions
for all
to authenticated
using (auth.uid() is not null)
with check (auth.uid() is not null);

drop policy if exists "authenticated users manage orders" on public.orders;
create policy "authenticated users manage orders"
on public.orders
for all
to authenticated
using (auth.uid() is not null)
with check (auth.uid() is not null);

drop policy if exists "customer display can view ready orders" on public.orders;
create policy "customer display can view ready orders"
on public.orders
for select
to anon
using (status in ('ready', 'served'));

drop policy if exists "authenticated users manage order items" on public.order_items;
create policy "authenticated users manage order items"
on public.order_items
for all
to authenticated
using (auth.uid() is not null)
with check (auth.uid() is not null);

drop policy if exists "customer display can view order items" on public.order_items;
create policy "customer display can view order items"
on public.order_items
for select
to anon
using (
  exists (
    select 1
    from public.orders
    where public.orders.id = order_items.order_id
      and public.orders.status in ('ready', 'served')
  )
);

drop policy if exists "authenticated users manage payments" on public.payments;
create policy "authenticated users manage payments"
on public.payments
for all
to authenticated
using (auth.uid() is not null)
with check (auth.uid() is not null);

insert into public.tables (name, area, capacity, pos_x, pos_y)
values
  ('T1', 'Patio', 2, 10, 20),
  ('T2', 'Main Hall', 4, 30, 20),
  ('T3', 'Main Hall', 4, 50, 20),
  ('T4', 'Balcony', 6, 70, 20)
on conflict (name) do nothing;

update public.users
set id = auth.users.id
from auth.users
where public.users.email = auth.users.email
  and public.users.id <> auth.users.id;

insert into public.categories (name, description, sort_order)
values
  ('Coffee', 'Hot and cold coffee beverages', 1),
  ('Tea', 'Chai and specialty teas', 2),
  ('Bakery', 'Fresh pastries and baked goods', 3),
  ('Meals', 'All-day cafe plates', 4)
on conflict (name) do nothing;

insert into public.products (name, sku, category_id, price, description)
select 'Cappuccino', 'COF-001', c.id, 180, 'Double espresso with steamed milk'
from public.categories c
where c.name = 'Coffee'
on conflict (sku) do nothing;

insert into public.products (name, sku, category_id, price, description)
select 'Masala Chai', 'TEA-001', c.id, 90, 'Spiced Indian tea'
from public.categories c
where c.name = 'Tea'
on conflict (sku) do nothing;

insert into public.products (name, sku, category_id, price, description)
select 'Butter Croissant', 'BAK-001', c.id, 120, 'Fresh laminated pastry'
from public.categories c
where c.name = 'Bakery'
on conflict (sku) do nothing;

insert into public.products (name, sku, category_id, price, description)
select 'Paneer Sandwich', 'MEA-001', c.id, 220, 'Grilled sandwich with cottage cheese filling'
from public.categories c
where c.name = 'Meals'
on conflict (sku) do nothing;