-- ============================================================
-- InterioOne — Initial Database Schema
-- Run via: npx supabase db push
-- ============================================================

-- ── Enums ────────────────────────────────────────────────────

create type enquiry_project_type as enum (
  'modular_kitchen',
  'open_plan',
  'full_interior',
  'luxury_kitchen',
  'other'
);

create type enquiry_status as enum (
  'new',
  'contacted',
  'quoted',
  'closed_won',
  'closed_lost'
);

create type project_status as enum (
  'published',
  'draft',
  'archived'
);

create type finish_type as enum (
  'Solid Matte',
  'Metallic',
  'Wood',
  'Gloss',
  'Concrete'
);

create type edge_band_finish as enum (
  'Satin',
  'Metallic',
  'Matte'
);

-- ── enquiries ─────────────────────────────────────────────────
-- Stores every lead form submission from the landing page.

create table public.enquiries (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text not null check (char_length(name) between 1 and 120),
  email         text not null check (email ~* '^[^@]+@[^@]+\.[^@]+$'),
  phone         text check (phone is null or char_length(phone) <= 20),
  project_type  enquiry_project_type not null,
  message       text check (message is null or char_length(message) <= 2000),
  status        enquiry_status not null default 'new',
  source        text            -- 'hero_cta' | 'contact_page' | 'palette' etc.
);

alter table public.enquiries enable row level security;

-- Only authenticated admins can read; inserts are public (lead capture)
create policy "Anyone can submit an enquiry"
  on public.enquiries for insert
  with check (true);

create policy "Admins can read enquiries"
  on public.enquiries for select
  using (auth.role() = 'authenticated');

-- ── contact_messages ──────────────────────────────────────────

create table public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(name) between 1 and 120),
  email       text not null check (email ~* '^[^@]+@[^@]+\.[^@]+$'),
  subject     text check (subject is null or char_length(subject) <= 200),
  message     text not null check (char_length(message) between 10 and 5000),
  replied     boolean not null default false
);

alter table public.contact_messages enable row level security;

create policy "Anyone can submit a contact message"
  on public.contact_messages for insert
  with check (true);

create policy "Admins can read contact messages"
  on public.contact_messages for select
  using (auth.role() = 'authenticated');

-- ── projects ──────────────────────────────────────────────────
-- Portfolio cards shown in the 3D gallery.

create table public.projects (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  slug              text not null unique check (slug ~ '^[a-z0-9-]+$'),
  title             text not null,
  location          text not null,
  year              smallint not null check (year between 2000 and 2100),
  category          text not null,
  placeholder_color text not null default '#9BAAB8',
  image_src         text,
  description       text,
  status            project_status not null default 'draft',
  sort_order        smallint not null default 0
);

alter table public.projects enable row level security;

create policy "Published projects are public"
  on public.projects for select
  using (status = 'published');

create policy "Admins can manage projects"
  on public.projects for all
  using (auth.role() = 'authenticated');

-- ── finish_ranges + finishes ──────────────────────────────────
-- Material / colour catalogue backing the PaletteTapestry section.

create table public.finish_ranges (
  id          text primary key,   -- 'signature' | 'premier' | 'select'
  label       text not null,
  description text not null,
  sort_order  smallint not null default 0
);

alter table public.finish_ranges enable row level security;

create policy "Finish ranges are public"
  on public.finish_ranges for select using (true);

create table public.finishes (
  id               text primary key,
  range_id         text not null references public.finish_ranges(id) on delete cascade,
  name             text not null,
  hex              text not null check (hex ~ '^#[0-9A-Fa-f]{6}$'),
  finish_type      finish_type not null,
  edge_band_name   text not null,
  edge_band_hex    text not null check (edge_band_hex ~ '^#[0-9A-Fa-f]{6}$'),
  edge_band_finish edge_band_finish not null,
  sort_order       smallint not null default 0
);

alter table public.finishes enable row level security;

create policy "Finishes are public"
  on public.finishes for select using (true);

-- ── Seed: finish ranges ───────────────────────────────────────

insert into public.finish_ranges (id, label, description, sort_order) values
  ('signature', 'Signature', 'Understated luxury finishes with architectural depth.', 0),
  ('premier',   'Premier',   'Bold material stories — concrete, teak, and dune.',    1),
  ('select',    'Select',    'High-gloss precision for the discerning eye.',          2);

-- ── Seed: finishes ────────────────────────────────────────────

insert into public.finishes
  (id, range_id, name, hex, finish_type, edge_band_name, edge_band_hex, edge_band_finish, sort_order)
values
  ('prairie-metallic',      'signature', 'Prairie Metallic',        '#C4B090', 'Metallic',    'Oasis Ivory Satin',    '#FAF6EC', 'Satin',    0),
  ('tundra-solid-matte',    'signature', 'Tundra Solid Matte',      '#FAFAFA', 'Solid Matte', 'Bronze Metallic',      '#8B6820', 'Metallic', 1),
  ('cavern-grey-solid-matte','signature','Cavern Grey Solid Matte', '#7D9182', 'Solid Matte', 'Cavern Grey',          '#7D9182', 'Matte',    2),
  ('desert-dune-metallic',  'premier',   'Desert Dune Metallic',    '#C49482', 'Metallic',    'Rose Gold Satin',      '#D4A2A2', 'Satin',    0),
  ('chamber-teak-wood',     'premier',   'Chamber Teak Wood',       '#B8956A', 'Wood',        'Industrial Bay Satin', '#5A5C68', 'Satin',    1),
  ('pour-line-concrete',    'premier',   'Pour Line Concrete',      '#D0CABC', 'Concrete',    'Oasis Ivory Satin',    '#FAF6EC', 'Satin',    2),
  ('glacier-veil-gloss',    'select',    'Glacier Veil Gloss',      '#F0EDE8', 'Gloss',       'Glacier Veil Satin',   '#E8E5E0', 'Satin',    0),
  ('oasis-ivory-gloss',     'select',    'Oasis Ivory Gloss',       '#FAF6EC', 'Gloss',       'Oasis Ivory Satin',    '#F5F0E8', 'Satin',    1);

-- ── Seed: projects ────────────────────────────────────────────

insert into public.projects
  (slug, title, location, year, category, placeholder_color, status, sort_order)
values
  ('begumpet-residency',       'Begumpet Residency',       'Hyderabad', 2024, 'Modular Kitchen',  '#9BAAB8', 'published', 0),
  ('jubilee-hills-penthouse',  'Jubilee Hills Penthouse',  'Hyderabad', 2024, 'Open-Plan Living', '#C9A87A', 'published', 1),
  ('banjara-hills-villa',      'Banjara Hills Villa',      'Hyderabad', 2023, 'Full Interior',    '#7D9182', 'published', 2),
  ('gachibowli-tech-home',     'Gachibowli Tech Home',     'Hyderabad', 2023, 'Modular Kitchen',  '#5A5C68', 'published', 3),
  ('kokapet-lake-villa',       'Kokapet Lake Villa',        'Hyderabad', 2024, 'Luxury Kitchen',   '#B8956A', 'published', 4),
  ('madhapur-duplex',          'Madhapur Duplex',          'Hyderabad', 2023, 'Open-Plan Living', '#4B6B54', 'published', 5);
