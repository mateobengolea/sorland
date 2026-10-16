-- Canales en vivo de Sorlandia (mapas y duelos): solo jugadores con cuenta.
create policy "Sorlandia: jugadores escuchan canales del juego" on realtime.messages
  for select to authenticated
  using ((select realtime.topic()) like 'sl:%' and realtime.messages.extension in ('broadcast', 'presence'));

create policy "Sorlandia: jugadores envían en canales del juego" on realtime.messages
  for insert to authenticated
  with check ((select realtime.topic()) like 'sl:%' and realtime.messages.extension in ('broadcast', 'presence'));
