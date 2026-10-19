'use strict';
/* =====================================================================
   Torre de Batalla (Cumbre Suprema, para Campeones).
   Elegís 3 criaturas: en la Torre todas pelean en nivel 70.
   Entre piso y piso se curan. Los rivales suben de nivel con tu racha.
   Perder no cuesta plata: se corta la racha. La mejor racha va al ranking.
   ===================================================================== */
const TORRE_NIVEL = 70;
const NOMBRES_TORRE = [['As', 'Ramiro Racha'], ['Veterana', 'Clara Victoria'], ['Estratega', 'Tito Táctico'], ['Entrenadora', 'Luna Llena'], ['Campeón retirado', 'Don Trofeo'],
  ['Aventurera', 'Brisa Andina'], ['Gaucho', 'Facundo Pampa'], ['Doctora', 'Vera Cura'], ['Profe', 'Lucas Libro'], ['Cantora', 'Mora Milonga'], ['Pescador', 'Juan Anzuelo'], ['Piloto', 'Ala Delta']];
function candidatosTorre(racha){
  return Object.values(ESPECIES).filter(e => !e.evol && !e.ultra && (!e.legendaria || racha >= 20) && e.id !== 'soldemayo').map(e => e.id);
}
function rivalTorre(racha){
  const r = Math.random, lista = candidatosTorre(racha), nivel = Math.min(100, 66 + racha);
  const equipo = [];
  while(equipo.length < 3){ const id = lista[Math.floor(r() * lista.length)]; if(!equipo.some(([x]) => x === id) && !(ESPECIES[id].legendaria && equipo.some(([x]) => ESPECIES[x].legendaria))) equipo.push([id, nivel]); }
  const [titulo, nombre] = NOMBRES_TORRE[Math.floor(r() * NOMBRES_TORRE.length)];
  return {titulo, nombre, equipo};
}
// Copias de tus criaturas en nivel 70 (no tocan a las de verdad).
function equipoTorre(){
  return S.torre.elegidas.map(c => {
    const e = ESPECIES[c.esp], copia = {esp: c.esp, nombre: c.nombre, nivel: TORRE_NIVEL, stats: statsPorNivel(e.base, TORRE_NIVEL), shiny: c.shiny, movs: [...(c.movs || [])], hp: null, xp: 0, ppExtra: {...(c.ppExtra || {})}};
    return comoLuchador(copia);
  });
}
async function hablarTorre(n){
  S.torre = S.torre || {mejor: 0};
  if(!S.campeon){ await dialogo(n.nombre, ['Esta es la Torre de Batalla. Solo pueden entrar los Campeones.', 'Ganá la Liga en el Cuartel Supremo y volvé.']); return; }
  await dialogo(n.nombre, ['¡Bienvenido a la Torre de Batalla!', 'Elegís tres criaturas y peleás piso por piso. Acá todas pelean en nivel 70, así que gana el que mejor juega.',
    'Entre piso y piso te curamos. Cada piso, los rivales son un poco más fuertes. Si perdés, no perdés plata: solo se termina la racha.',
    `Tu mejor racha: ${S.torre.mejor || 0} victorias.`]);
  const i = await elegirOpcion(n.nombre, '¿Arrancás una racha nueva?', ['¡Vamos!', 'Ahora no']);
  if(i !== 0) return;
  const elegidas = await elegirParaDuelo('la Torre de Batalla', 90, false, 3);
  if(!elegidas) return;
  S.torre.elegidas = elegidas; S.torre.racha = 0;
  S.torre.vuelta = {mapa: S.mundo.mapa, x: S.mundo.x, y: S.mundo.y};
  guardar();
  pisoTorre();
}
function pisoTorre(){
  const t = S.torre, R = rivalTorre(t.racha);
  t.pendiente = 'torre_' + Date.now().toString(36);
  guardar();
  PELEA_NIVEL_FIJO = true;
  lanzarPeleaEntrenador({id: t.pendiente, titulo: R.titulo, nombre: R.nombre, premio: 300 + t.racha * 60, equipo: R.equipo, antes: [], despues: ['¡Buena pelea! Seguí subiendo.'],
    lider: true, torre: true, sinXP: true, listaPropia: equipoTorre(), vuelta: t.vuelta}, 'cumbres');
  setTimeout(() => { if(B && B.ent && B.ent.torre) mensaje(`Piso ${t.racha + 1} de la Torre`, 900); }, 50);
}
async function despuesDelPiso(){
  const t = S.torre; if(!t || !t.pendiente) return;
  const gano = !!S.vencidos[t.pendiente];
  delete S.vencidos[t.pendiente];
  t.pendiente = null;
  if(!gano){
    const r = t.racha; t.racha = 0;
    guardar();
    if(typeof actualizarFicha === 'function') actualizarFicha(true);
    await dialogo('Torre de Batalla', [`Racha terminada: ${r} victoria${r === 1 ? '' : 's'}.`, r >= (t.mejor || 0) && r > 0 ? '¡Es tu mejor racha!' : `Tu mejor racha sigue siendo ${t.mejor || 0}.`]);
    return;
  }
  t.racha++;
  if(t.racha > (t.mejor || 0)) t.mejor = t.racha;
  let extra = '';
  if(t.racha % 7 === 0){ extra = darPremio([{obj: 'ultracapsula', n: 3}, {obj: 'jarabetotal', n: 3}, {obj: 'revivirmax', n: 2}, {obj: 'alfajor', n: 1}, {obj: 'matecocido', n: 1}][(t.racha / 7 - 1) % 5]); }
  guardar();
  if(typeof actualizarFicha === 'function') actualizarFicha(true);
  await dialogo('Torre de Batalla', [`¡Ganaste el piso ${t.racha}!${extra ? ` Premio especial: ${extra}.` : ''}`, 'Tu equipo ya está curado.']);
  const i = await elegirOpcion('Torre de Batalla', `Racha: ${t.racha}. ¿Subís al piso ${t.racha + 1}?`, ['¡Seguir!', 'Retirarme']);
  if(i === 0) pisoTorre();
  else { await dialogo('Torre de Batalla', [`Te retiraste con ${t.racha} victorias. ${t.racha >= t.mejor ? '¡Tu mejor racha!' : `Tu récord: ${t.mejor}.`}`]); t.racha = 0; guardar(); }
}
(() => {
  const orig = pintarMundo;
  pintarMundo = function(){
    const r = orig.apply(this, arguments);
    if(S && S.torre && S.torre.pendiente) setTimeout(() => { if(MW) despuesDelPiso(); }, 600);
    return r;
  };
  // La mejor racha viaja con la ficha del ranking.
  document.addEventListener('DOMContentLoaded', () => { if(typeof actualizarFicha === 'function'){
    const origF = actualizarFicha;
    actualizarFicha = async function(){
      const ent = S && S.entrenador;
      if(S && ent) S.entrenador = {...ent, torre: (S.torre && S.torre.mejor) || 0};
      try { return await origF.apply(this, arguments); } finally { if(S && ent) S.entrenador = ent; }
    };
  } });
})();
(() => {
  const P = MAPAS.supremo; if(!P) return;
  const sitio = lugarLibre(P, 20, 11) || [20, 11];
  P.npc({id: 'torre_recepcion', x: sitio[0], y: sitio[1], tipo: 'vecino', nombre: 'Recepcionista de la Torre', ropa: '#7A4FC9', pelo: '#2A2420', accion: hablarTorre});
  P.torre = {x: sitio[0], y: sitio[1]};
  const dib = dibujarSecretos;
  dibujarSecretos = function(ctx, M, camX, camY, t){
    if(dib) dib(ctx, M, camX, camY, t);
    if(M && M.id === 'supremo' && M.torre) etiqueta(ctx, '🏯 TORRE DE BATALLA', (M.torre.x + .5) * TS - camX, (M.torre.y + 1) * TS - camY - 62, 'rgba(122,79,201,.95)');
  };
})();
