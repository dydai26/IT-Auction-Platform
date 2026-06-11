-- Очищення бази перед запуском (видаляємо старі таблиці, якщо вони існують)
drop trigger if exists on_auth_user_created on auth.users cascade;
drop trigger if exists on_bid_insert on public.bids cascade;
drop function if exists public.handle_new_user() cascade;
drop function if exists public.update_auction_price() cascade;

drop table if exists public.settings cascade;
drop table if exists public.bids cascade;
drop table if exists public.auctions cascade;
drop table if exists public.categories cascade;
drop table if exists public.profiles cascade;

-- Увімкнення розширення для UUID
create extension if not exists "uuid-ossp";

-- Таблиця користувачів (Profiles), що зв'язується з auth.users
create table public.profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  email text,
  phone text,
  avatar_url text,
  role text default 'user',
  telegram_chat_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Таблиця категорій (багатомовна)
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name_ru text not null,
  name_en text not null,
  name_zh text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Таблиця аукціонів (багатомовна)
create table public.auctions (
  id uuid default uuid_generate_v4() primary key,
  title_ru text not null,
  title_en text not null,
  title_zh text not null,
  description_ru text,
  description_en text,
  description_zh text,
  category_ru text not null,
  category_en text not null,
  category_zh text not null,
  brand text,
  image text, -- URL або Base64
  start_price numeric not null check (start_price >= 0),
  current_price numeric not null check (current_price >= start_price),
  end_time timestamp with time zone not null,
  status text default 'active' check (status in ('active', 'ended', 'cancelled')),
  currency text default 'USD' check (currency in ('UAH', 'USD', 'EUR')),
  creator_id uuid references public.profiles(id),
  winner_id uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Таблиця ставок
create table public.bids (
  id uuid default uuid_generate_v4() primary key,
  auction_id uuid references public.auctions(id) on delete cascade not null,
  user_id uuid references public.profiles(id) not null,
  amount numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Таблиця налаштувань
create table public.settings (
  id text primary key default 'global',
  email_enabled boolean default false,
  email_smtp text,
  sms_enabled boolean default false,
  sms_gateway text,
  telegram_enabled boolean default false,
  telegram_bot_token text,
  telegram_chat_id text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Встановлення Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.auctions enable row level security;
alter table public.bids enable row level security;
alter table public.settings enable row level security;

-- Політики для Profiles
create policy "Публічні профілі доступні всім" on public.profiles for select using (true);
create policy "Користувачі можуть оновлювати власні профілі" on public.profiles for update using (auth.uid() = id);

-- Політики для Categories
create policy "Категорії доступні всім" on public.categories for select using (true);
create policy "Тільки адміни можуть керувати категоріями" on public.categories for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Політики для Auctions
create policy "Аукціони доступні для всіх" on public.auctions for select using (true);
create policy "Тільки авторизовані можуть створювати аукціони" on public.auctions for insert with check (auth.uid() is not null);
create policy "Творці або адміни можуть оновлювати аукціони" on public.auctions for update using (
  auth.uid() = creator_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Тільки адміни можуть видаляти аукціони" on public.auctions for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Політики для Bids
create policy "Ставки доступні для всіх" on public.bids for select using (true);
create policy "Тільки авторизовані можуть робити ставки" on public.bids for insert with check (auth.uid() = user_id);

-- Політики для Settings
create policy "Налаштування доступні для всіх" on public.settings for select using (true);
create policy "Тільки адміни можуть оновлювати налаштування" on public.settings for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Автоматичне оновлення current_price в Auctions при новій ставці
create or replace function update_auction_price()
returns trigger as $$
begin
  update public.auctions
  set current_price = new.amount
  where id = new.auction_id and current_price < new.amount;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_bid_insert
  after insert on public.bids
  for each row execute procedure update_auction_price();

-- Автоматичне створення профілю при реєстрації (Trigger на auth.users)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, phone, avatar_url, role)
  values (
    new.id, 
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)), 
    new.email,
    coalesce(new.raw_user_meta_data->>'phone', new.phone),
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_user_meta_data->>'role', 'user')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Початкове заповнення демо-категоріями (багатомовне)
insert into public.categories (name_ru, name_en, name_zh) values 
  ('Антиквариат', 'Antiques', '古董'),
  ('Искусство', 'Art', '艺术'),
  ('Автомобили', 'Cars', '汽车'),
  ('Ноутбуки', 'Laptops', '笔记本电脑'),
  ('Телефоны', 'Phones', '手机'),
  ('Мебель', 'Furniture', '家具'),
  ('Электроника', 'Electronics', '电子产品');

-- Автоматичне закриття лотів та вибір переможця щохвилини (pg_cron)
create or replace function public.close_expired_auctions()
returns void as $$
declare
  r_auction record;
  v_winner_id uuid;
begin
  for r_auction in 
    select id 
    from public.auctions 
    where status = 'active' and end_time <= now()
  loop
    select user_id 
    into v_winner_id
    from public.bids 
    where auction_id = r_auction.id 
    order by amount desc, created_at asc 
    limit 1;

    update public.auctions 
    set status = 'ended', winner_id = v_winner_id 
    where id = r_auction.id;
  end loop;
end;
$$ language plpgsql security definer;

-- Налаштування pg_cron (якщо підтримується хостингом)
create extension if not exists pg_cron;
select cron.schedule(
  'close-auctions-every-minute',
  '* * * * *',
  'select public.close_expired_auctions()'
);
