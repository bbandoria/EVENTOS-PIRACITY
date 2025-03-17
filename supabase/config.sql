-- Create venues table
create table public.venues (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  address text not null,
  description text not null,
  image_url text not null,
  latitude double precision not null,
  longitude double precision not null,
  owner_id uuid references auth.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create events table
create table public.events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  date date not null,
  time time not null,
  image_url text not null,
  venue_id uuid references public.venues(id) not null,
  category text not null,
  owner_id uuid references auth.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create favorites table
create table public.favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  event_id uuid references public.events(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, event_id)
);

-- Enable Row Level Security
alter table public.venues enable row level security;
alter table public.events enable row level security;
alter table public.favorites enable row level security;

-- Venues policies
create policy "Venues are viewable by everyone"
  on public.venues for select
  using (true);

create policy "Venues are insertable by owner"
  on public.venues for insert
  with check (auth.uid() = owner_id);

create policy "Venues are updatable by owner"
  on public.venues for update
  using (auth.uid() = owner_id);

create policy "Venues are deletable by owner"
  on public.venues for delete
  using (auth.uid() = owner_id);

-- Events policies
create policy "Events are viewable by everyone"
  on public.events for select
  using (true);

create policy "Events are insertable by owner"
  on public.events for insert
  with check (auth.uid() = owner_id);

create policy "Events are updatable by owner"
  on public.events for update
  using (auth.uid() = owner_id);

create policy "Events are deletable by owner"
  on public.events for delete
  using (auth.uid() = owner_id);

-- Favorites policies
create policy "Users can view their own favorites"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "Users can insert their own favorites"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own favorites"
  on public.favorites for delete
  using (auth.uid() = user_id);

-- Create indexes
create index venues_created_at_idx on public.venues(created_at desc);
create index events_date_idx on public.events(date);
create index events_venue_id_idx on public.events(venue_id);
create index favorites_user_id_idx on public.favorites(user_id);
create index favorites_event_id_idx on public.favorites(event_id);
create index venues_owner_id_idx on public.venues(owner_id);
create index events_owner_id_idx on public.events(owner_id); 