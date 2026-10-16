-- Apodo público de cada jugador (lo que ven los demás en el mundo).
create table public.perfiles (
  id uuid primary key references auth.users(id) on delete cascade,
  apodo text not null check (apodo ~ '^[A-Za-z0-9_ÁÉÍÓÚáéíóúÑñÜü]{3,16}$'),
  creado_en timestamptz not null default now()
);
create unique index perfiles_apodo_unico on public.perfiles (lower(apodo));

alter table public.perfiles enable row level security;

create policy "Los jugadores ven los apodos" on public.perfiles
  for select to authenticated using (true);
create policy "Cada jugador crea su perfil" on public.perfiles
  for insert to authenticated with check ((select auth.uid()) = id);
create policy "Cada jugador cambia su perfil" on public.perfiles
  for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- Avisa en el registro si un apodo ya está tomado, sin exponer la tabla.
create or replace function public.apodo_disponible(p_apodo text)
returns boolean language sql stable security definer set search_path = '' as $$
  select not exists (select 1 from public.perfiles where lower(apodo) = lower(p_apodo));
$$;
revoke all on function public.apodo_disponible(text) from public;
grant execute on function public.apodo_disponible(text) to anon, authenticated;
