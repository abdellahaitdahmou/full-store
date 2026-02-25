-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- --------------------------------------------------------
-- 1. PRODUCTS TABLE
-- --------------------------------------------------------
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  price numeric not null,
  category text not null,
  images jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Disable Row Level Security (RLS) for products temporarily for seeding
alter table products disable row level security;

-- Products Policies:
-- Allow public read access to products
create policy "Allow public read access to products" on products
  for select using (true);

-- Allow authenticated admins to insert/update/delete products
create policy "Allow admin full access to products" on products
  for all using (auth.role() = 'authenticated');

-- --------------------------------------------------------
-- 2. ORDERS TABLE
-- --------------------------------------------------------
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  phone text not null,
  city text not null,
  product_id uuid references products(id) on delete cascade not null,
  status text not null default 'Pending' check (status in ('Pending', 'Confirmed', 'Delivered', 'Cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) for orders
alter table orders enable row level security;

-- Orders Policies:
-- Allow public insert to orders
create policy "Allow public insert to orders" on orders
  for insert with check (true);

-- Allow authenticated admins to view and update orders
create policy "Allow admin full access to orders" on orders
  for all using (auth.role() = 'authenticated');

-- --------------------------------------------------------
-- 3. STORAGE BUCKET
-- --------------------------------------------------------
-- Create a new bucket called 'products'
insert into storage.buckets (id, name, public) 
values ('products', 'products', true)
on conflict (id) do nothing;

-- Storage Policies:
-- Allow public read access to product images
create policy "Public Access" on storage.objects 
  for select using (bucket_id = 'products');

-- Allow authenticated admins to upload/update/delete images
create policy "Admin Access" on storage.objects 
  for all using (bucket_id = 'products' and auth.role() = 'authenticated');

-- --------------------------------------------------------
-- 4. REALTIME ENABLEMENT
-- --------------------------------------------------------
-- Enable realtime broadcasting for orders so the admin dashboard gets instant notifications
alter publication supabase_realtime add table orders;
