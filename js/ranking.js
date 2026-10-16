'use strict';
/* =====================================================================
   Ranking de entrenadores: rangos por duelos online y tabla de posiciones.
   Los puntos los calcula Supabase (supabase/004_ranking.sql): un duelo
   cuenta cuando los dos jugadores reportan el mismo ganador.
   ===================================================================== */
const RANGOS = [
  {id: 'bronce',   nom: 'Bronce',   desde: 0,    col: '#C98B5A', borde: '#8A5A33'},
  {id: 'plata',    nom: 'Plata',    desde: 1100, col: '#D9DEE6', borde: '#8A93A3'},
  {id: 'oro',      nom: 'Oro',      desde: 1250, col: '#FFD23F', borde: '#B8860B'},
  {id: 'platino',  nom: 'Platino',  desde: 1400, col: '#9FE3D8', borde: '#3E9C8E'},
  {id: 'diamante', nom: 'Diamante', desde: 1550, col: '#9CC8FF', borde: '#3D6FC2'},
  {id: 'leyenda',  nom: 'Leyenda',  desde: 1700, col: '#E6B3FF', borde: '#7A4FC9'},
];
const rangoDe = p => RANGOS.reduce((r, x) => p >= x.desde ? x : r, RANGOS[0]);
const RK = {ficha: null, ultimo: 0, pestana: 'duelos'};

function chipRango(puntos, conPuntos = true){
  const r = rangoDe(puntos);
  return `<span class="chip-rango" style="--rc:${r.col};--rb:${r.borde}">${r.nom}${conPuntos ? ` · ${puntos}` : ''}</span>`;
}

// Sube la parte pública de la ficha (álbum, medallas, aspecto) y trae puntos y posición.
async function actualizarFicha(forzar = false){
  if(!db || !usuarioId || !apodo || !S) return null;
  if(!forzar && Date.now() - RK.ultimo < 60000) return RK.ficha;
  RK.ultimo = Date.now();
  try {
    const {data, error} = await db.rpc('sl_actualizar_ficha', {
      p_album: Object.keys(S.album.capt || {}).length, p_shiny: Object.keys(S.album.shiny || {}).length,
      p_medallas: cantMedallas(), p_campeon: !!S.campeon, p_ent: S.entrenador || null});
    if(error || !data) return RK.ficha;
    RK.ficha = data;
    pintarRangoTop();
    if(typeof avisarDondeEstoy === 'function') avisarDondeEstoy();
  } catch(e){}
  return RK.ficha;
}
function pintarRangoTop(){
  const el = document.getElementById('rango-top'); if(!el) return;
  el.innerHTML = RK.ficha ? chipRango(RK.ficha.puntos) : '';
}

// Duelos: anotar el arranque y reportar el ganador.
function registrarDuelo(sala, rivalId){
  if(!db || !usuarioId || !rivalId) return;
  db.rpc('sl_iniciar_duelo', {p_sala: sala, p_rival: rivalId}).then(() => {}, () => {});
}
async function reportarDuelo(sala, ganadorId){
  if(!db || !usuarioId) return null;
  for(let i = 0; i < 5; i++){
    try {
      const {data, error} = await db.rpc('sl_reportar_duelo', {p_sala: sala, p_ganador: ganadorId});
      if(error) return null;
      if(data && data.estado !== 'pendiente') return data;
    } catch(e){ return null; }
    await new Promise(r => setTimeout(r, 2500));
  }
  return {estado: 'pendiente'};
}

/* ---------------- Hoja de ranking ---------------- */
async function abrirRanking(){
  if(vista === 'combate' || vista === 'duelo') return;
  hojaActual = 'ranking';
  const v = nuevoVelo();
  if(!db || !usuarioId){
    v.innerHTML = `<div class="hoja" role="dialog" aria-label="Ranking"><div class="hoja-cab"><h2>Ranking</h2><button class="cerrar" aria-label="Cerrar">×</button></div>
      <p class="rotulo-chico">El ranking es para jugadores con cuenta. Entrá con tu mail para aparecer en la tabla.</p></div>`;
    v.querySelector('.cerrar').onclick = cerrarHoja; return;
  }
  v.innerHTML = `<div class="hoja" role="dialog" aria-label="Ranking"><div class="hoja-cab"><h2>Ranking</h2><button class="cerrar" aria-label="Cerrar">×</button></div><p class="rotulo-chico">Cargando…</p></div>`;
  v.querySelector('.cerrar').onclick = cerrarHoja;
  await actualizarFicha(true);
  pintarRanking();
}
async function pintarRanking(){
  const v = $('#velo'); if(!v || hojaActual !== 'ranking') return;
  const duelos = RK.pestana === 'duelos';
  let q = db.from('ranking').select('user_id,apodo,puntos,ganados,perdidos,album,shiny,medallas,campeon,ent');
  q = duelos ? q.order('puntos', {ascending: false}).order('ganados', {ascending: false}) : q.order('album', {ascending: false}).order('medallas', {ascending: false}).order('shiny', {ascending: false});
  const {data, error} = await q.limit(50);
  if(hojaActual !== 'ranking' || !$('#velo')) return;
  const f = RK.ficha;
  const total = Object.keys(ESPECIES).length;
  const filas = (data || []).map((p, i) => `<div class="fila-rank${p.user_id === usuarioId ? ' yo' : ''}">
      <span class="rk-pos ${i < 3 ? 'podio p' + (i + 1) : ''}">${i + 1}</span>
      <span class="cr-mini" style="width:34px;height:46px">${svgEntrenador(p.ent || undefined)}</span>
      <span class="fo-txt"><b data-apodo="${i}"></b><small>${duelos ? `${p.ganados} ganados · ${p.perdidos} perdidos` : `${'★'.repeat(p.medallas)}${p.campeon ? ' · Campeón' : ''}${p.shiny ? ` · ${p.shiny} ✦` : ''}`}</small></span>
      <span class="rk-val">${duelos ? chipRango(p.puntos) : `<b>${p.album}</b><small>/${total}</small>`}</span></div>`).join('');
  v.innerHTML = `<div class="hoja" role="dialog" aria-label="Ranking"><div class="hoja-cab"><h2>Ranking</h2><button class="cerrar" aria-label="Cerrar">×</button></div>
    <div class="pestanas" role="tablist"><button role="tab" data-tab="duelos" aria-selected="${duelos}">Duelos</button><button role="tab" data-tab="album" aria-selected="${!duelos}">Álbum</button></div>
    ${f ? `<div class="mi-rango">${duelos
      ? `<span>Tu rango</span>${chipRango(f.puntos)}<span>Puesto <b>#${f.posicion}</b></span>`
      : `<span>Tu álbum</span><b>${Object.keys(S.album.capt || {}).length}/${total}</b><span>Puesto <b>#${f.posicion_album}</b></span>`}</div>` : ''}
    <p class="rotulo-chico">${duelos
      ? 'Ganá duelos contra otros jugadores para subir: Bronce, Plata (1100), Oro (1250), Platino (1400), Diamante (1550) y Leyenda (1700). Ganarle a alguien más fuerte da más puntos.'
      : 'Los que más criaturas distintas atraparon. A igual álbum, desempatan las medallas.'}</p>
    <div class="lista-online">${error ? '<p class="rotulo-chico">No se pudo cargar el ranking.</p>' : filas || '<p class="rotulo-chico">Todavía no hay nadie en la tabla.</p>'}</div></div>`;
  (data || []).forEach((p, i) => { const b = v.querySelector(`[data-apodo="${i}"]`); if(b) b.textContent = p.apodo; });
  v.querySelector('.cerrar').onclick = cerrarHoja;
  v.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { RK.pestana = b.dataset.tab; pintarRanking(); });
}
