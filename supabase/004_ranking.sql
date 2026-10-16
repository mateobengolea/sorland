-- Ranking de entrenadores: puntos por duelos online (tipo Elo) y ficha pública.
-- Nadie escribe estas tablas directo: todo pasa por funciones que validan.

create table public.ranking (
  user_id uuid primary key references auth.users(id) on delete cascade,
  apodo text not null,
  puntos int not null default 1000,
  ganados int not null default 0,
  perdidos int not null default 0,
  album int not null default 0,
  shiny int not null default 0,
  medallas int not null default 0,
  campeon boolean not null default false,
  ent jsonb,
  actualizado timestamptz not null default now()
);
create index ranking_puntos on public.ranking (puntos desc);
create index ranking_album on public.ranking (album desc, medallas desc);
alter table public.ranking enable row level security;
create policy "Los jugadores ven el ranking" on public.ranking for select to authenticated using (true);

-- Cada jugador anota el arranque y el resultado de cada duelo.
create table public.duelos_registro (
  sala text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  rival uuid not null references auth.users(id) on delete cascade,
  ganador uuid,
  creado timestamptz not null default now(),
  reportado timestamptz,
  primary key (sala, user_id)
);
alter table public.duelos_registro enable row level security;

create table public.duelos_resueltos (
  sala text primary key,
  ganador uuid not null,
  perdedor uuid not null,
  delta int not null,
  creado timestamptz not null default now()
);
create index duelos_resueltos_par on public.duelos_resueltos (ganador, perdedor, creado);
alter table public.duelos_resueltos enable row level security;

-- Asegura que el jugador tenga fila en el ranking.
create or replace function public.sl_asegurar_ficha(p_uid uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  insert into public.ranking (user_id, apodo)
  select p.id, p.apodo from public.perfiles p where p.id = p_uid
  on conflict (user_id) do nothing;
end $$;
revoke all on function public.sl_asegurar_ficha(uuid) from public, anon, authenticated;

-- Aplica el resultado de un duelo (una sola vez por sala).
create or replace function public.sl_aplicar_duelo(p_sala text, p_ganador uuid, p_perdedor uuid)
returns int language plpgsql security definer set search_path = '' as $$
declare rg int; rp int; esperado float; d int; repetidos int;
begin
  if exists (select 1 from public.duelos_resueltos where sala = p_sala) then
    return (select delta from public.duelos_resueltos where sala = p_sala);
  end if;
  perform public.sl_asegurar_ficha(p_ganador);
  perform public.sl_asegurar_ficha(p_perdedor);
  select puntos into rg from public.ranking where user_id = p_ganador for update;
  select puntos into rp from public.ranking where user_id = p_perdedor for update;
  esperado := 1.0 / (1.0 + power(10.0, (rp - rg) / 400.0));
  d := greatest(1, round(32 * (1 - esperado))::int);
  -- Contra el mismo rival, solo los primeros 3 duelos del día suman puntos.
  select count(*) into repetidos from public.duelos_resueltos
   where creado > now() - interval '1 day'
     and ((ganador = p_ganador and perdedor = p_perdedor) or (ganador = p_perdedor and perdedor = p_ganador));
  if repetidos >= 3 then d := 0; end if;
  update public.ranking set puntos = puntos + d, ganados = ganados + 1, actualizado = now() where user_id = p_ganador;
  update public.ranking set puntos = greatest(0, puntos - d), perdidos = perdidos + 1, actualizado = now() where user_id = p_perdedor;
  insert into public.duelos_resueltos (sala, ganador, perdedor, delta) values (p_sala, p_ganador, p_perdedor, d);
  return d;
end $$;
revoke all on function public.sl_aplicar_duelo(text, uuid, uuid) from public, anon, authenticated;

-- Al arrancar un duelo, cada jugador lo anota.
create or replace function public.sl_iniciar_duelo(p_sala text, p_rival uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare yo uuid := auth.uid();
begin
  if yo is null or p_rival is null or p_rival = yo or p_sala !~ '^sl:duelo:[a-z0-9]{4,40}$' then return; end if;
  insert into public.duelos_registro (sala, user_id, rival) values (p_sala, yo, p_rival) on conflict do nothing;
end $$;
revoke all on function public.sl_iniciar_duelo(text, uuid) from public, anon;
grant execute on function public.sl_iniciar_duelo(text, uuid) to authenticated;

-- Resuelve duelos donde un jugador reportó y el otro se fue sin reportar (pasados 2 minutos).
create or replace function public.sl_resolver_pendientes()
returns void language plpgsql security definer set search_path = '' as $$
declare r record;
begin
  for r in
    select a.sala, a.ganador, case when a.ganador = a.user_id then a.rival else a.user_id end as perdedor
      from public.duelos_registro a
      join public.duelos_registro b on b.sala = a.sala and b.user_id = a.rival and b.rival = a.user_id
     where a.ganador is not null and b.ganador is null
       and a.reportado < now() - interval '2 minutes'
       and a.ganador in (a.user_id, a.rival)
       and (a.user_id = auth.uid() or a.rival = auth.uid())
       and not exists (select 1 from public.duelos_resueltos x where x.sala = a.sala)
  loop
    perform public.sl_aplicar_duelo(r.sala, r.ganador, r.perdedor);
  end loop;
end $$;
revoke all on function public.sl_resolver_pendientes() from public, anon;
grant execute on function public.sl_resolver_pendientes() to authenticated;

-- Reporta quién ganó. Cuenta cuando los dos dicen lo mismo.
create or replace function public.sl_reportar_duelo(p_sala text, p_ganador uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare yo uuid := auth.uid(); mio record; suyo record; d int;
begin
  select * into mio from public.duelos_registro where sala = p_sala and user_id = yo;
  if not found or p_ganador not in (mio.user_id, mio.rival) then return jsonb_build_object('estado', 'invalido'); end if;
  if mio.ganador is null then
    update public.duelos_registro set ganador = p_ganador, reportado = now() where sala = p_sala and user_id = yo;
  end if;
  if exists (select 1 from public.duelos_resueltos where sala = p_sala) then
    select delta into d from public.duelos_resueltos where sala = p_sala;
    return jsonb_build_object('estado', 'listo', 'delta', d);
  end if;
  select * into suyo from public.duelos_registro where sala = p_sala and user_id = mio.rival and rival = yo;
  if not found or suyo.ganador is null then return jsonb_build_object('estado', 'pendiente'); end if;
  if suyo.ganador <> coalesce(mio.ganador, p_ganador) then return jsonb_build_object('estado', 'conflicto'); end if;
  d := public.sl_aplicar_duelo(p_sala, suyo.ganador, case when suyo.ganador = yo then mio.rival else yo end);
  return jsonb_build_object('estado', 'listo', 'delta', d);
end $$;
revoke all on function public.sl_reportar_duelo(text, uuid) from public, anon;
grant execute on function public.sl_reportar_duelo(text, uuid) to authenticated;

-- Actualiza la parte pública de la ficha (álbum, medallas, aspecto).
create or replace function public.sl_actualizar_ficha(p_album int, p_shiny int, p_medallas int, p_campeon boolean, p_ent jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare yo uuid := auth.uid(); f record;
begin
  if yo is null then return null; end if;
  perform public.sl_asegurar_ficha(yo);
  perform public.sl_resolver_pendientes();
  update public.ranking r set
    apodo = coalesce((select p.apodo from public.perfiles p where p.id = yo), r.apodo),
    album = least(greatest(coalesce(p_album, 0), 0), 104),
    shiny = least(greatest(coalesce(p_shiny, 0), 0), 104),
    medallas = least(greatest(coalesce(p_medallas, 0), 0), 4),
    campeon = coalesce(p_campeon, false),
    ent = case when pg_column_size(p_ent) < 2000 then p_ent else r.ent end,
    actualizado = now()
  where r.user_id = yo;
  select * into f from public.ranking where user_id = yo;
  if not found then return null; end if;
  return jsonb_build_object('puntos', f.puntos, 'ganados', f.ganados, 'perdidos', f.perdidos,
    'posicion', (select count(*) + 1 from public.ranking where puntos > f.puntos),
    'posicion_album', (select count(*) + 1 from public.ranking where album > f.album or (album = f.album and medallas > f.medallas)));
end $$;
revoke all on function public.sl_actualizar_ficha(int, int, int, boolean, jsonb) from public, anon;
grant execute on function public.sl_actualizar_ficha(int, int, int, boolean, jsonb) to authenticated;
