create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  user_id uuid primary key references public.users(id) on delete cascade,
  firstname text,
  lastname text,
  phone text,
  country text,
  state text,
  city text,
  dob text,
  gender text,
  acctype text,
  brname text,
  branch_code text,
  status text,
  account_pin_hash text,
  transfer_pin_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.accounts (
  user_id uuid primary key references public.users(id) on delete cascade,
  account_number text not null unique,
  currency text not null default 'USD',
  balance numeric(14,2) not null default 0,
  opening_date date not null default (now()::date),
  last_login timestamptz,
  status text not null default 'ACTIVE',
  branch_code text not null default 'RBSUS001',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  card_number text not null,
  expiry text not null,
  type text not null default 'Visa Platinum',
  currency text not null default 'USD ($)',
  security text not null default '3D Secure Enabled',
  usage text not null default 'Global Transactions',
  status text not null default 'ACTIVE',
  created_at timestamptz not null default now()
);

create index if not exists cards_user_id_idx on public.cards(user_id);

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  token_hash text not null unique,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create index if not exists sessions_user_id_idx on public.sessions(user_id);
create index if not exists sessions_expires_at_idx on public.sessions(expires_at);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  type text not null,
  description text,
  amount numeric(14,2) not null,
  status text not null default 'Completed',
  meta jsonb not null default '{}'::jsonb
);

create index if not exists transactions_user_id_idx on public.transactions(user_id);
create index if not exists transactions_created_at_idx on public.transactions(created_at);

create table if not exists public.transfers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  kind text not null default 'international',
  beneficiary_name text,
  bank_name text,
  bank_address text,
  account_number text,
  swift_routing text,
  amount numeric(14,2) not null,
  status text not null default 'Pending',
  meta jsonb not null default '{}'::jsonb
);

create index if not exists transfers_user_id_idx on public.transfers(user_id);
create index if not exists transfers_created_at_idx on public.transfers(created_at);

