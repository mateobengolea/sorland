'use strict';
/* =====================================================================
   El rival: Mati Carpo. Eligió la inicial que le gana a la tuya y te
   persigue toda la aventura. Aparece cuando entrás a ciertos lugares
   después de cierta cantidad de medallas, y siempre trae un equipo
   que creció desde la última vez.
   ===================================================================== */
const RIVAL = {nombre: 'Mati Carpo', titulo: 'Rival', ropa: '#2A2420', pelo: '#E2574C'};
const CONTRA_INICIAL = {carosor: ['rufisor', 'rufisaurio', 'rufititan'], matesor: ['carosor', 'carosaurio', 'carotitan'], rufisor: ['matesor', 'matesaurio', 'matetitan']};
function raizDe(esp){ let e = ESPECIES[esp], n = 0; while(e && e.de && n++ < 5) e = ESPECIES[e.de]; return e ? e.id : esp; }
function inicialDelJugador(){
  S.rival = S.rival || {};
  if(S.rival.inicial) return S.rival.inicial;
  const todas = [...S.equipo, ...S.reserva];
  const c = todas.find(c => CONTRA_INICIAL[raizDe(c.esp)]);
  S.rival.inicial = c ? raizDe(c.esp) : 'carosor';
  return S.rival.inicial;
}
// Etapa del inicial del rival según el nivel (los niveles de la región 1 están en la escala vieja).
function inicialRival(nivel, region2){
  const linea = CONTRA_INICIAL[inicialDelJugador()];
  const n = region2 ? 99 : nivel;
  return linea[n >= 32 ? 2 : n >= 16 ? 1 : 0];
}
const ENCUENTROS_RIVAL = [
  {id: 'r1', mapa: 'villapiedra', medallas: 1, region2: false, nivel: 10, premio: 300,
    equipo: [['pampito', 8]],
    antes: ['¡Eh, vos! Soy Mati Carpo. Elegí mi inicial justo para ganarte.', 'Vamos a ver quién llega primero a la Liga.'],
    despues: ['¿Me ganaste? Fue suerte. La próxima no.'], regalo: {obj: 'jarabe', n: 3}},
  {id: 'r2', mapa: 'camalote', medallas: 3, region2: false, nivel: 16, premio: 700,
    equipo: [['hornero', 15], ['carpinchito', 14]],
    antes: ['¡Te estaba esperando! Ya tengo tres medallas, como vos.', 'Entrené toda la semana. Esta vez no hay suerte que te salve.'],
    despues: ['Bueno... estuvo cerca. Muy cerca.', 'Tomá, para que no digas que no comparto.'], regalo: {obj: 'yuyos', n: 2}},
  {id: 'r3', mapa: 'tormenta', medallas: 5, region2: false, nivel: 21, premio: 1100,
    equipo: [['hornero', 19], ['carpincho', 19], ['nubarron', 20]],
    antes: ['Cerro Tormenta... lindo lugar para que pierdas.', 'Cambié todo mi equipo. Ahora es imparable.'],
    despues: ['¿Cómo hacés? ¡Si yo entreno el doble!'], regalo: {obj: 'jarabemax', n: 3}},
  {id: 'r4', mapa: 'fogon', medallas: 7, region2: false, nivel: 26, premio: 1600,
    equipo: [['horneron', 24], ['carpincho', 25], ['tormenton', 25], ['cuarzon', 24]],
    antes: ['¡Ahí estás! Siete medallas, igual que yo.', 'El que gane llega primero a la Cumbre. Dale.'],
    despues: ['Andá. Te espero en la Cumbre. Esta no es la última.'], regalo: {obj: 'revivir', n: 2}},
  {id: 'r5', mapa: 'supremo', medallas: 8, region2: false, nivel: 33, premio: 3000,
    equipo: [['horneron', 30], ['carpinchon', 31], ['tormenton', 31], ['geodon', 31], ['zorrofogon', 32]],
    antes: ['Antes del Cuartel Supremo, pasás por mí. Es la última vez, te lo juro.', 'Todo lo que entrené fue para este momento.'],
    despues: ['...Ganaste. De verdad sos bueno.', 'Andá a la Liga. Yo voy a seguir entrenando. Algún día te gano.'], regalo: {obj: 'revivirmax', n: 2}},
  {id: 'r6', mapa: 'colonia', medallas: 0, region2: true, nivel: 62, premio: 5000,
    equipo: [['lobazo', 60], ['termon', 61], ['tero', 61], ['horneron', 62]],
    antes: ['¿¡Vos también viniste a la Costa Oriental!?', 'Yo llegué en el ferry anterior. Ya atrapé criaturas nuevas. ¡Mirá!'],
    despues: ['Increíble. Hasta acá me ganás.'], regalo: {obj: 'yuyos', n: 5}},
  {id: 'r7', mapa: 'minas', medallas: 6, region2: true, nivel: 78, premio: 7000,
    equipo: [['lobomar', 76], ['geiseron', 76], ['terazo', 77], ['amatiston', 77], ['horneron', 78]],
    antes: ['Seis medallas orientales. Yo también. Esta vez es distinto.', 'Entrené en la Gruta del Palacio... bueno, en la entrada.'],
    despues: ['Me estás dejando sin excusas.'], regalo: {obj: 'jarabetotal', n: 3}},
  {id: 'r8', mapa: 'fortaleza', medallas: 8, region2: true, nivel: 88, premio: 10000,
    equipo: [['lobomar', 86], ['geiseron', 87], ['terazo', 87], ['amatiston', 87], ['tamborazo', 88]],
    antes: ['La Fortaleza del Cerro. El último lugar donde te puedo frenar.', 'Todo, todo lo que tengo. Dale.'],
    despues: ['Sos el mejor entrenador que conocí. Ganá la Liga. Hacelo por los dos.'], regalo: {obj: 'revivirmax', n: 3}},
];
function encuentroPendiente(mapa){
  S.rival = S.rival || {};
  for(const e of ENCUENTROS_RIVAL){
    if(e.mapa !== mapa || S.rival[e.id]) continue;
    const med = e.region2 ? cantMedallas2() : cantMedallas();
    if(med < e.medallas) continue;
    // Si ya pasaste de largo hace rato, ese encuentro no ocurre.
    if(med > e.medallas + 2){ S.rival[e.id] = 'saltado'; continue; }
    // Uno por vez: si quedó uno anterior sin pelear, se saltea (llegaste tarde).
    return e;
  }
  return null;
}
async function encuentroRival(e){
  if(!MW || MW.ocupado || !hayLuchadorEnPie()) return;
  MW.ocupado = true;
  try { await dialogo(`${RIVAL.titulo} ${RIVAL.nombre}`, e.antes); }
  finally { if(MW) MW.ocupado = false; }
  const equipo = [...e.equipo, [inicialRival(e.nivel, e.region2), e.nivel]];
  S.rival.pendiente = e.id; guardar();
  lanzarPeleaEntrenador({id: 'rival_' + e.id, titulo: RIVAL.titulo, nombre: RIVAL.nombre, premio: e.premio, equipo, antes: [], despues: e.despues, ropa: RIVAL.ropa, rival: true},
    mapaActual().zonaBase || mapaActual().zonas[0][0]);
}
// Al volver al mapa: si le ganaste, regalo; si no, la próxima vez que entres te vuelve a buscar.
async function despuesDelRival(){
  const id = S.rival && S.rival.pendiente; if(!id) return;
  S.rival.pendiente = null;
  if(!S.vencidos['rival_' + id]) { guardar(); return; }
  S.rival[id] = true;
  const e = ENCUENTROS_RIVAL.find(x => x.id === id);
  if(e && e.regalo){ const txt = darPremio(e.regalo); guardar(); await dialogo(RIVAL.nombre, [`Tomá: ${txt}. Lo vas a necesitar.`]); }
  else guardar();
}
(() => {
  const orig = pintarMundo;
  pintarMundo = function(){
    const r = orig.apply(this, arguments);
    if(!S || !S.mundo) return r;
    if(S.rival && S.rival.pendiente) setTimeout(() => { if(MW) despuesDelRival(); }, 700);
    else {
      const e = encuentroPendiente(S.mundo.mapa);
      if(e && S.mundo.mapa !== (S.rival && S.rival.ultimoMapa)) setTimeout(() => { if(MW && S.mundo.mapa === e.mapa) encuentroRival(e); }, 900);
    }
    S.rival = S.rival || {}; S.rival.ultimoMapa = S.mundo.mapa;
    return r;
  };
})();
