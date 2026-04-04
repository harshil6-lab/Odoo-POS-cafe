create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default timezone('utc', now())
);

insert into public.roles (name)
values ('manager'), ('waiter'), ('cashier')
on conflict (name) do nothing;

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text not null unique,
  role_id uuid references public.roles (id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.floors (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default timezone('utc', now())
);

insert into public.floors (name)
values ('Ground Floor'), ('First Floor')
on conflict (name) do nothing;

create table if not exists public.tables (
  id uuid primary key default gen_random_uuid(),
  table_code text not null unique,
  floor_id uuid not null references public.floors (id) on delete restrict,
  status text not null default 'available' check (status in ('available', 'occupied', 'reserved', 'cleaning')),
  seats integer not null default 4 check (seats > 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

insert into public.tables (table_code, floor_id, status, seats)
select seed.table_code, floors.id, 'available', 4
from (
  values
    ('Ground Floor', 'G1'),
    ('Ground Floor', 'G2'),
    ('Ground Floor', 'G3'),
    ('Ground Floor', 'G4'),
    ('Ground Floor', 'G5'),
    ('Ground Floor', 'G6'),
    ('Ground Floor', 'G7'),
    ('Ground Floor', 'G8'),
    ('Ground Floor', 'G9'),
    ('Ground Floor', 'G10'),
    ('Ground Floor', 'G11'),
    ('Ground Floor', 'G12'),
    ('First Floor', 'F1'),
    ('First Floor', 'F2'),
    ('First Floor', 'F3'),
    ('First Floor', 'F4'),
    ('First Floor', 'F5'),
    ('First Floor', 'F6'),
    ('First Floor', 'F7'),
    ('First Floor', 'F8'),
    ('First Floor', 'F9'),
    ('First Floor', 'F10'),
    ('First Floor', 'F11'),
    ('First Floor', 'F12')
) as seed(floor_name, table_code)
join public.floors on floors.name = seed.floor_name
on conflict (table_code) do nothing;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default timezone('utc', now())
);

insert into public.categories (name)
values
  ('Coffee'),
  ('Tea'),
  ('Snacks'),
  ('Pizza'),
  ('Pasta'),
  ('Burger'),
  ('Desserts'),
  ('Water'),
  ('Drinks')
on conflict (name) do nothing;

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category_id uuid not null references public.categories (id) on delete restrict,
  price numeric(10, 2) not null check (price >= 0),
  image_url text,
  is_available boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  table_id uuid not null references public.tables (id) on delete restrict,
  customer_name text not null,
  payment_method text not null,
  status text not null default 'pending' check (status in ('pending', 'preparing', 'cooking', 'ready', 'served')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  menu_item_id uuid not null references public.menu_items (id) on delete restrict,
  quantity integer not null check (quantity > 0),
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  table_id uuid not null references public.tables (id) on delete restrict,
  customer_name text not null,
  guests integer not null check (guests > 0),
  reservation_time timestamptz not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.get_user_role(user_id uuid default auth.uid())
returns text
language sql
stable
security definer
set search_path = public
as $$
  select lower(r.name)
  from public.users u
  join public.roles r on r.id = u.role_id
  where u.id = user_id
  limit 1;
$$;

create or replace function public.is_staff(user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.get_user_role(user_id) in ('manager', 'waiter', 'cashier'), false);
$$;

create or replace function public.is_manager(user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.get_user_role(user_id) = 'manager', false);
$$;

create or replace function public.handle_auth_user_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (
    new.id,
    new.email
  )
  on conflict (id) do update
  set email = excluded.email,
      updated_at = timezone('utc', now());

  return new;
end;
$$;

create or replace function public.assign_role_to_user(target_user_id uuid, target_role_name text)
returns public.users
language plpgsql
security definer
set search_path = public
as $$
declare
  resolved_role_id uuid;
  updated_user public.users;
begin
  select id
  into resolved_role_id
  from public.roles
  where lower(name) = lower(target_role_name)
  limit 1;

  if resolved_role_id is null then
    raise exception 'Role % was not found.', target_role_name;
  end if;

  update public.users
  set role_id = resolved_role_id,
      updated_at = timezone('utc', now())
  where id = target_user_id
  returning * into updated_user;

  if updated_user.id is null then
    raise exception 'User % was not found.', target_user_id;
  end if;

  return updated_user;
end;
$$;

drop trigger if exists trg_users_updated_at on public.users;
create trigger trg_users_updated_at
before update on public.users
for each row
execute function public.set_updated_at();

drop trigger if exists trg_tables_updated_at on public.tables;
create trigger trg_tables_updated_at
before update on public.tables
for each row
execute function public.set_updated_at();

drop trigger if exists trg_menu_items_updated_at on public.menu_items;
create trigger trg_menu_items_updated_at
before update on public.menu_items
for each row
execute function public.set_updated_at();

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();

drop trigger if exists trg_reservations_updated_at on public.reservations;
create trigger trg_reservations_updated_at
before update on public.reservations
for each row
execute function public.set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_auth_user_created();

alter table public.roles enable row level security;
alter table public.users enable row level security;
alter table public.floors enable row level security;
alter table public.tables enable row level security;
alter table public.categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reservations enable row level security;

drop policy if exists "staff can read roles" on public.roles;
create policy "staff can read roles"
on public.roles
for select
to authenticated
using (public.is_staff());

drop policy if exists "staff can read users" on public.users;
create policy "staff can read users"
on public.users
for select
to authenticated
using (public.is_staff());

drop policy if exists "users can read own profile" on public.users;
create policy "users can read own profile"
on public.users
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "managers can update users" on public.users;
create policy "managers can update users"
on public.users
for update
to authenticated
using (public.is_manager())
with check (public.is_manager());

drop policy if exists "floors readable by everyone" on public.floors;
create policy "floors readable by everyone"
on public.floors
for select
to anon, authenticated
using (true);

drop policy if exists "tables readable by everyone" on public.tables;
create policy "tables readable by everyone"
on public.tables
for select
to anon, authenticated
using (true);

drop policy if exists "staff can update tables" on public.tables;
create policy "staff can update tables"
on public.tables
for update
to authenticated
using (public.is_staff())
with check (public.is_staff());

drop policy if exists "categories readable by everyone" on public.categories;
create policy "categories readable by everyone"
on public.categories
for select
to anon, authenticated
using (true);

drop policy if exists "managers can manage categories" on public.categories;
create policy "managers can manage categories"
on public.categories
for all
to authenticated
using (public.is_manager())
with check (public.is_manager());

drop policy if exists "menu readable by everyone" on public.menu_items;
create policy "menu readable by everyone"
on public.menu_items
for select
to anon, authenticated
using (true);

drop policy if exists "managers can manage menu" on public.menu_items;
create policy "managers can manage menu"
on public.menu_items
for all
to authenticated
using (public.is_manager())
with check (public.is_manager());

drop policy if exists "staff can read orders" on public.orders;
create policy "staff can read orders"
on public.orders
for select
to authenticated
using (public.is_staff());

drop policy if exists "customer can create orders" on public.orders;
create policy "customer can create orders"
on public.orders
for insert
to anon, authenticated
with check (status in ('pending', 'preparing', 'cooking', 'ready', 'served'));

drop policy if exists "staff can update orders" on public.orders;
create policy "staff can update orders"
on public.orders
for update
to authenticated
using (public.is_staff())
with check (public.is_staff());

drop policy if exists "staff can read order items" on public.order_items;
create policy "staff can read order items"
on public.order_items
for select
to authenticated
using (public.is_staff());

drop policy if exists "customer can create order items" on public.order_items;
create policy "customer can create order items"
on public.order_items
for insert
to anon, authenticated
with check (exists (select 1 from public.orders where orders.id = order_id));

drop policy if exists "staff can update order items" on public.order_items;
create policy "staff can update order items"
on public.order_items
for update
to authenticated
using (public.is_staff())
with check (public.is_staff());

drop policy if exists "staff can read reservations" on public.reservations;
create policy "staff can read reservations"
on public.reservations
for select
to authenticated
using (public.is_staff());

drop policy if exists "customer can create reservations" on public.reservations;
create policy "customer can create reservations"
on public.reservations
for insert
to anon, authenticated
with check (guests > 0);

drop policy if exists "staff can update reservations" on public.reservations;
create policy "staff can update reservations"
on public.reservations
for update
to authenticated
using (public.is_staff())
with check (public.is_staff());