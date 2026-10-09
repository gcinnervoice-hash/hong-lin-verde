-- ==============================================================================
-- Estudio Verde Hong - Configuración de Base de Datos y Almacenamiento Supabase
-- ==============================================================================
-- Instrucciones de uso:
-- 1. Ve a tu panel de Supabase: https://supabase.com/dashboard/project/_
-- 2. Entra en SQL Editor > New query
-- 3. Pega todo el contenido de este archivo y pulsa "Run"
-- 4. En Authentication > Users > Add user:
--    Crea un usuario administrador (ej. honglin@estudioverde.com con su contraseña)
-- ==============================================================================

-- 1. Tabla de Catálogo de Plantas
create table if not exists public.plants (
  id text primary key,
  nombre text not null,
  precio numeric not null check (precio >= 0),
  imagenes jsonb not null default '[]'::jsonb,
  ambiente text not null check (ambiente in ('Interior', 'Exterior')),
  descripcion text not null default '',
  estado text not null check (estado in ('disponible', 'vendido')),
  vendida_en timestamptz,
  destacado boolean not null default false,
  updated_at timestamptz not null default now()
);

-- Habilitar RLS en plants
alter table public.plants enable row level security;
revoke all on public.plants from anon, authenticated;
grant select on public.plants to anon, authenticated;
grant insert, update, delete on public.plants to authenticated;

drop policy if exists "El catálogo es público" on public.plants;
create policy "El catálogo es público" on public.plants
  for select to anon, authenticated using (true);

drop policy if exists "Sólo el administrador modifica el catálogo" on public.plants;
drop policy if exists "Administradores autenticados modifican el catálogo" on public.plants;
create policy "Administradores autenticados modifican el catálogo" on public.plants
  for all to authenticated
  using (true)
  with check (true);

-- 2. Tabla de Ajustes de la Tienda
create table if not exists public.store_settings (
  id text primary key default 'general',
  nombre_tienda text not null default 'Estudio Verde Hong',
  facebook text not null default 'https://www.facebook.com/estudioverdehong',
  direccion text not null default 'Madrid y Toledo',
  horario text not null default 'Lunes a sábado, 10:00–18:00',
  entrega text not null default 'Envío gratis para pedidos superiores a 30 € cerca de Toledo y 50 € en Madrid.',
  updated_at timestamptz not null default now()
);

-- Habilitar RLS en store_settings
alter table public.store_settings enable row level security;
revoke all on public.store_settings from anon, authenticated;
grant select on public.store_settings to anon, authenticated;
grant insert, update, delete on public.store_settings to authenticated;

drop policy if exists "Los ajustes son públicos" on public.store_settings;
create policy "Los ajustes son públicos" on public.store_settings
  for select to anon, authenticated using (true);

drop policy if exists "Administradores modifican ajustes" on public.store_settings;
create policy "Administradores modifican ajustes" on public.store_settings
  for all to authenticated
  using (true)
  with check (true);

-- 3. Bucket de Almacenamiento para Imágenes de Plantas
insert into storage.buckets (id, name, public)
values ('plants', 'plants', true)
on conflict (id) do update set public = true;

drop policy if exists "Plant images are publicly accessible" on storage.objects;
drop policy if exists "Imágenes de plantas públicas" on storage.objects;
create policy "Imágenes de plantas públicas" on storage.objects
  for select using (bucket_id = 'plants');

drop policy if exists "Authenticated users can upload plant images" on storage.objects;
drop policy if exists "Administradores suben imágenes" on storage.objects;
create policy "Administradores suben imágenes" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'plants');

drop policy if exists "Administradores modifican imágenes" on storage.objects;
create policy "Administradores modifican imágenes" on storage.objects
  for update to authenticated
  using (bucket_id = 'plants');

drop policy if exists "Administradores eliminan imágenes" on storage.objects;
create policy "Administradores eliminan imágenes" on storage.objects
  for delete to authenticated
  using (bucket_id = 'plants');

-- 4. Habilitar Tiempo Real (Realtime)
-- Permite que los cambios lleguen al resto de dispositivos sin recargar.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'plants'
  ) then
    alter publication supabase_realtime add table public.plants;
  end if;
end $$;

-- 5. Datos iniciales del catálogo
insert into public.plants (id, nombre, precio, imagenes, ambiente, descripcion, estado, destacado)
values
  ('monstera-deliciosa', 'Monstera Deliciosa', 39, '["/plants/monstera.jpg"]'::jsonb, 'Interior', 'Una planta tropical de hojas grandes que aporta presencia y frescura a cualquier estancia.', 'disponible', true),
  ('ficus-lyrata', 'Ficus Lyrata', 45, '["/plants/ficus.jpg"]'::jsonb, 'Interior', 'Hojas esculturales y un porte elegante para espacios luminosos y tranquilos.', 'disponible', true),
  ('sansevieria', 'Sansevieria', 24, '["/plants/sansevieria.jpg"]'::jsonb, 'Interior', 'Resistente, vertical y muy sencilla de integrar en rincones con luz suave.', 'vendido', false),
  ('poto-dorado', 'Poto Dorado', 18, '["/plants/poto.jpg"]'::jsonb, 'Interior', 'Una planta colgante y agradecida que llena de vida estanterías y repisas.', 'disponible', true),
  ('calathea-orbifolia', 'Calathea Orbifolia', 32, '["/plants/calathea.jpg"]'::jsonb, 'Interior', 'Follaje decorativo de gran tamaño para interiores con luz indirecta.', 'vendido', false),
  ('aloe-vera', 'Aloe Vera', 16, '["/plants/aloe.jpg"]'::jsonb, 'Exterior', 'Una suculenta sobria y luminosa, perfecta para balcones y terrazas soleadas.', 'disponible', true),
  ('palmera-areca', 'Palmera Areca', 36, '["/plants/areca.jpg"]'::jsonb, 'Interior', 'Una palmera ligera y exuberante para aportar volumen verde a casa.', 'disponible', false),
  ('set-cactus-suculentas', 'Set de Cactus y Suculentas', 28, '["/plants/cactus.jpg"]'::jsonb, 'Exterior', 'Una selección de plantas resistentes para llenar de textura un exterior soleado.', 'disponible', false)
on conflict (id) do nothing;

-- 6. Fila inicial de ajustes de la tienda
insert into public.store_settings (id, nombre_tienda, facebook, direccion, horario, entrega)
values (
  'general',
  'Estudio Verde Hong',
  'https://www.facebook.com/estudioverdehong',
  'Madrid y Toledo',
  'Lunes a sábado, 10:00–18:00',
  'Envío gratis para pedidos superiores a 30 € cerca de Toledo y 50 € en Madrid.'
)
on conflict (id) do nothing;
