-- Punjabi Cuisine — Supabase schema.
-- Run this once in your Supabase project: SQL Editor → paste → Run.
-- All app access is server-side via the service_role key (which bypasses RLS),
-- so RLS is enabled with NO public policies to keep these tables private.

create extension if not exists "pgcrypto";

-- Customers + marketing leads (accounts have a password; guests are leads).
create table if not exists public.customers (
  id               uuid primary key default gen_random_uuid(),
  email            text unique not null,
  name             text not null,
  phone            text not null,
  password_hash    text,
  password_salt    text,
  registered       boolean not null default false,
  marketing_opt_in boolean not null default true,
  created_at       bigint  not null,
  last_order_at    bigint,
  order_count      int     not null default 0
);

-- Pickup orders.
create table if not exists public.orders (
  id          text primary key,          -- e.g. PC-4821
  created_at  bigint not null,
  updated_at  bigint not null,
  status      text   not null,
  customer_id uuid,                       -- set when placed by a signed-in account
  customer    jsonb  not null,            -- { name, phone, email }
  pickup_time text   not null,
  items       jsonb  not null,            -- OrderLine[]
  subtotal    numeric not null,
  taxes       numeric not null,
  total       numeric not null,
  note        text
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_customer_id_idx on public.orders (customer_id);
create index if not exists orders_customer_email_idx on public.orders ((customer->>'email'));

alter table public.customers enable row level security;
alter table public.orders    enable row level security;
-- (No policies on purpose — only the server's service_role key can read/write.)
