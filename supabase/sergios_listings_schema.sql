create extension if not exists pgcrypto;

create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  listing_type text not null check (listing_type in ('sale', 'rent')),
  title text not null,
  address text not null,
  city text not null,
  neighborhood text not null,
  status text not null,
  property_type text not null,
  price numeric not null default 0,
  bedrooms numeric not null default 0,
  bathrooms numeric not null default 0,
  square_feet integer not null default 0,
  description text not null default '',
  tags text[] not null default '{}',
  highlight text not null default '',
  mls_number text,
  lease_term_months integer,
  pet_policy text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  client_type text not null check (client_type in ('buyer', 'renter')),
  name text not null,
  email text not null default '',
  phone text not null default '',
  status text not null,
  budget numeric not null default 0,
  timeline text not null default '',
  priority text not null default '',
  preferred_areas text[] not null default '{}',
  preference_summary text not null default '',
  notes text not null default '',
  next_action text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists campaign_templates (
  id text primary key,
  name text not null,
  audience text not null,
  subject text not null,
  body text not null,
  sent integer not null default 0,
  opened integer not null default 0,
  replied integer not null default 0,
  segment_size integer not null default 0,
  open_goal integer not null default 0,
  conversion_goal integer not null default 0,
  status text not null default 'Draft'
);

alter table listings disable row level security;
alter table clients disable row level security;
alter table campaign_templates disable row level security;

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists listings_set_updated_at on listings;
create trigger listings_set_updated_at
before update on listings
for each row
execute procedure set_updated_at();

drop trigger if exists clients_set_updated_at on clients;
create trigger clients_set_updated_at
before update on clients
for each row
execute procedure set_updated_at();
