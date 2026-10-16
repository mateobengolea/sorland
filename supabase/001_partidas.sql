-- Tabla de partidas: una por jugador, con el estado completo del juego en "data".
create table public.partidas (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null default '',
  especie text not null default '',
  nivel int not null default 1,
  data jsonb not null,
  creada_en timestamptz not null default now(),
  actualizada_en timestamptz not null default now()
);

alter table public.partidas enable row level security;

create policy "Cada jugador ve su partida" on public.partidas
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Cada jugador crea su partida" on public.partidas
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Cada jugador actualiza su partida" on public.partidas
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create or replace function public.tocar_actualizada_en()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.actualizada_en := now();
  return new;
end $$;

create trigger partidas_actualizada_en before update on public.partidas
  for each row execute function public.tocar_actualizada_en();
