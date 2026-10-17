-- Amigos: solicitudes y lista. Nadie escribe la tabla directo: todo pasa por funciones.
create table public.amistades (
  de uuid not null references auth.users(id) on delete cascade,
  a uuid not null references auth.users(id) on delete cascade,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'aceptada')),
  creado timestamptz not null default now(),
  primary key (de, a),
  check (de <> a)
);
create index amistades_a on public.amistades (a);
alter table public.amistades enable row level security;
create policy "Cada jugador ve sus amistades" on public.amistades
  for select to authenticated using ((select auth.uid()) in (de, a));

-- Pedir amistad (si el otro ya te había pedido, quedan amigos directamente).
create or replace function public.sl_pedir_amistad(p_otro uuid)
returns text language plpgsql security definer set search_path = '' as $$
declare yo uuid := auth.uid(); est text;
begin
  if yo is null or p_otro is null or p_otro = yo then return 'invalido'; end if;
  if not exists (select 1 from public.perfiles where id = p_otro) then return 'invalido'; end if;
  select estado into est from public.amistades where de = yo and a = p_otro;
  if found then return est; end if;
  select estado into est from public.amistades where de = p_otro and a = yo;
  if found then
    if est = 'pendiente' then update public.amistades set estado = 'aceptada' where de = p_otro and a = yo; end if;
    return 'aceptada';
  end if;
  if (select count(*) from public.amistades where de = yo or a = yo) >= 200 then return 'lleno'; end if;
  insert into public.amistades (de, a) values (yo, p_otro);
  return 'pendiente';
end $$;
revoke all on function public.sl_pedir_amistad(uuid) from public, anon;
grant execute on function public.sl_pedir_amistad(uuid) to authenticated;

create or replace function public.sl_responder_amistad(p_de uuid, p_acepta boolean)
returns text language plpgsql security definer set search_path = '' as $$
declare yo uuid := auth.uid();
begin
  if yo is null then return 'invalido'; end if;
  if p_acepta then
    update public.amistades set estado = 'aceptada' where de = p_de and a = yo and estado = 'pendiente';
    return case when found then 'aceptada' else 'invalido' end;
  end if;
  delete from public.amistades where de = p_de and a = yo and estado = 'pendiente';
  return 'rechazada';
end $$;
revoke all on function public.sl_responder_amistad(uuid, boolean) from public, anon;
grant execute on function public.sl_responder_amistad(uuid, boolean) to authenticated;

create or replace function public.sl_quitar_amistad(p_otro uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare yo uuid := auth.uid();
begin
  delete from public.amistades where (de = yo and a = p_otro) or (de = p_otro and a = yo);
end $$;
revoke all on function public.sl_quitar_amistad(uuid) from public, anon;
grant execute on function public.sl_quitar_amistad(uuid) to authenticated;

-- Mi lista: amigos, solicitudes que recibí y las que mandé, con su ficha pública.
create or replace function public.sl_mis_amigos()
returns table (id uuid, apodo text, estado text, yo_pedi boolean, medallas int, puntos int, campeon boolean, album int, ent jsonb)
language sql stable security definer set search_path = '' as $$
  select o.id, p.apodo, x.estado, x.de = auth.uid(),
         coalesce(r.medallas, 0), coalesce(r.puntos, 1000), coalesce(r.campeon, false), coalesce(r.album, 0), r.ent
  from public.amistades x
  cross join lateral (select case when x.de = auth.uid() then x.a else x.de end as id) o
  join public.perfiles p on p.id = o.id
  left join public.ranking r on r.user_id = o.id
  where auth.uid() in (x.de, x.a)
  order by x.estado, p.apodo;
$$;
revoke all on function public.sl_mis_amigos() from public, anon;
grant execute on function public.sl_mis_amigos() to authenticated;

-- Ficha pública de un jugador (para el perfil).
create or replace function public.sl_ficha(p_id uuid)
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object('apodo', p.apodo, 'medallas', coalesce(r.medallas, 0), 'puntos', coalesce(r.puntos, 1000),
    'ganados', coalesce(r.ganados, 0), 'perdidos', coalesce(r.perdidos, 0), 'album', coalesce(r.album, 0),
    'campeon', coalesce(r.campeon, false), 'ent', r.ent,
    'amistad', (select case when x.estado = 'aceptada' then 'amigos' when x.de = auth.uid() then 'enviada' else 'recibida' end
                from public.amistades x where (x.de = auth.uid() and x.a = p_id) or (x.de = p_id and x.a = auth.uid()) limit 1))
  from public.perfiles p left join public.ranking r on r.user_id = p.id
  where p.id = p_id and auth.uid() is not null;
$$;
revoke all on function public.sl_ficha(uuid) from public, anon;
grant execute on function public.sl_ficha(uuid) to authenticated;
