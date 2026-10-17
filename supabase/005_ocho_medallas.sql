-- Ahora hay ocho gimnasios: la ficha acepta hasta 8 medallas.
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
    medallas = least(greatest(coalesce(p_medallas, 0), 0), 8),
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
