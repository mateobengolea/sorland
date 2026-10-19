'use strict';
/* =====================================================================
   Jefes cooperativos.
   Cada 3 horas aparece una leyenda gigante con 15.000 de vida que es la
   misma para todos los jugadores. Cada uno pelea por su cuenta y su daño
   se suma al de los demás (se comparte en vivo por el canal del jefe).
   Cuando la vida llega a 0, todos los que pegaron cobran el premio.
   Se encuentra hablando con la Mensajera de las Leyendas (Pueblo Ceibo y
   Colonia del Plátano). Hacen falta 4 medallas.
   ===================================================================== */
const JEFE_VIDA = 15000, JEFE_NIVEL = 80, JEFE_HORAS = 3;
const JEFES = ['intiraya', 'yacura', 'huracanto', 'uritorco', 'ballenaria', 'yaguarete', 'marejadon'];
const JF = {canal: null, ventana: null, aportes: {}, rival: null};
const ventanaJefe = () => Math.floor(Date.now() / (JEFE_HORAS * 3600000));
const especieJefe = v => JEFES[v % JEFES.length];
const totalJefe = () => Object.values(JF.aportes).reduce((a, b) => a + (b | 0), 0);
const vidaJefe = () => Math.max(0, JEFE_VIDA - totalJefe());
function guardarAportes(){ try { localStorage.setItem('sorlandia-jefe', JSON.stringify({v: JF.ventana, a: JF.aportes})); } catch(e){} }
function conectarJefe(){
  const v = ventanaJefe();
  if(JF.ventana === v && JF.canal) return;
  if(JF.canal){ try { db.removeChannel(JF.canal); } catch(e){} JF.canal = null; }
  JF.ventana = v; JF.aportes = {};
  try { const g = JSON.parse(localStorage.getItem('sorlandia-jefe') || 'null'); if(g && g.v === v) JF.aportes = g.a || {}; } catch(e){}
  if(S && S.jefe && S.jefe.ventana === v && S.jefe.mio) JF.aportes[usuarioId || 'yo'] = Math.max(JF.aportes[usuarioId || 'yo'] || 0, S.jefe.mio);
  if(typeof db === 'undefined' || !db || !usuarioId) return;
  const c = db.channel('sl:jefe:' + v, {config: {private: true, broadcast: {self: false}}});
  JF.canal = c;
  const unir = a => { let cambio = false; for(const [k, n] of Object.entries(a || {})){ const x = Math.min(JEFE_VIDA, n | 0); if(x > (JF.aportes[k] || 0)){ JF.aportes[k] = x; cambio = true; } } if(cambio){ guardarAportes(); refrescarJefe(); } };
  c.on('broadcast', {event: 'aportes'}, ({payload}) => unir(payload && payload.a))
   .on('broadcast', {event: 'pedir'}, () => { if(Object.keys(JF.aportes).length) c.send({type: 'broadcast', event: 'aportes', payload: {a: JF.aportes}}); })
   .subscribe(st => { if(st === 'SUBSCRIBED') c.send({type: 'broadcast', event: 'pedir', payload: {}}); });
}
function contarAporte(danio){
  const k = usuarioId || 'yo';
  JF.aportes[k] = Math.min(JEFE_VIDA, (JF.aportes[k] || 0) + Math.max(0, danio | 0));
  S.jefe = {ventana: JF.ventana, mio: JF.aportes[k], cobrado: S.jefe && S.jefe.ventana === JF.ventana ? S.jefe.cobrado : false};
  guardarAportes(); guardar();
  if(JF.canal) JF.canal.send({type: 'broadcast', event: 'aportes', payload: {a: JF.aportes}});
}
// Si el jefe cayó y pegaste, cobrás.
async function cobrarJefe(){
  if(!S || !S.jefe || S.jefe.ventana !== JF.ventana || S.jefe.cobrado || !(S.jefe.mio > 0) || vidaJefe() > 0) return;
  S.jefe.cobrado = true;
  ST().jefes = (ST().jefes || 0) + 1;
  ganar(3000);
  const txt = darPremio({obj: 'ultracapsula', n: 3});
  const extra = Math.random() < .25 ? darPremio({obj: 'revivirmax', n: 2}) : '';
  guardar(); if(typeof revisarLogros === 'function') revisarLogros();
  await dialogo('¡Cayó el jefe!', [`Entre todos derrotaron a ${ESPECIES[especieJefe(JF.ventana)].nombre}.`, `Por tu ayuda te llevás 3000 monedas y ${txt}${extra ? ` y ${extra}` : ''}.`]);
}
function refrescarJefe(){ if(hojaActual === 'jefe' && $('#velo')) pintarJefe(); if(vidaJefe() <= 0 && MW && !MW.ocupado && vista === 'mundo') cobrarJefe(); }
function abrirJefe(){
  conectarJefe();
  hojaActual = 'jefe';
  nuevoVelo();
  pintarJefe();
}
function pintarJefe(){
  const v = $('#velo'); if(!v) return;
  const esp = especieJefe(JF.ventana), e = ESPECIES[esp], vida = vidaJefe(), pct = vida / JEFE_VIDA * 100;
  const fin = (JF.ventana + 1) * JEFE_HORAS * 3600000, min = Math.max(0, Math.round((fin - Date.now()) / 60000));
  const mio = JF.aportes[usuarioId || 'yo'] || 0, gente = Object.values(JF.aportes).filter(n => n > 0).length;
  v.innerHTML = `<div class="hoja" role="dialog" aria-label="Jefe"><div class="hoja-cab"><h2>Jefe de las Leyendas</h2><button class="cerrar" aria-label="Cerrar">×</button></div>
    <div class="jefe-caja"><span class="jefe-img">${svgEspecie(esp, {humor: vida > 0 ? 'bien' : 'mal'})}</span>
      <h3>${e.nombre} gigante · Nv ${JEFE_NIVEL}</h3>
      <div class="barra jefe-barra"><i style="width:${pct}%;background:${pct > 50 ? 'var(--verde)' : pct > 20 ? 'var(--ambar)' : 'var(--rojo)'}"></i></div>
      <p><b>${vida.toLocaleString('es')}</b> / ${JEFE_VIDA.toLocaleString('es')} de vida · ${gente} jugador${gente === 1 ? '' : 'es'} pegando</p>
      <p>Tu daño: <b>${mio.toLocaleString('es')}</b> · ${vida > 0 ? `Se va en ${Math.floor(min / 60)} h ${min % 60} min` : '¡Derrotado!'}</p></div>
    <p class="rotulo-chico">La vida del jefe es la misma para todos. Peleás con tu equipo hasta que se agote o te retirás: todo el daño que hagas se suma. Cuando cae, todos los que pegaron cobran 3000 monedas y 3 Ultra cápsulas. Perder acá no cuesta plata.</p>
    <div class="acciones-jugador">${vida > 0 ? `<button class="grande" id="jf-pelear">¡Pelear!</button>` : `<button class="grande" id="jf-cobrar" ${S.jefe && S.jefe.ventana === JF.ventana && !S.jefe.cobrado && mio > 0 ? '' : 'disabled'}>${mio > 0 ? (S.jefe && S.jefe.cobrado ? 'Ya cobraste' : 'Cobrar premio') : 'No llegaste a pegarle'}</button>`}</div></div>`;
  v.querySelector('.cerrar').onclick = cerrarHoja;
  const p = v.querySelector('#jf-pelear'); if(p) p.onclick = () => pelearJefe();
  const c = v.querySelector('#jf-cobrar'); if(c) c.onclick = () => { cerrarHoja(); cobrarJefe(); };
}
function pelearJefe(){
  if(cantMedallas() < 4){ avisar('Necesitás 4 medallas para enfrentar a los jefes.'); return; }
  if(!hayLuchadorEnPie()){ avisar('Tu equipo está agotado. Curate primero.'); return; }
  const esp = especieJefe(JF.ventana), e = ESPECIES[esp], stats = statsPorNivel(e.base, JEFE_NIVEL), vida = vidaJefe();
  if(vida <= 0) return;
  cerrarHoja();
  const rival = {esp, nombre: e.nombre + ' gigante', nivel: JEFE_NIVEL, stats, hp: vida, tipo: e.tipo, mult: 1.05, escalado: true};
  JF.rival = rival; JF.inicio = vida;
  S.jefe = S.jefe && S.jefe.ventana === JF.ventana ? S.jefe : {ventana: JF.ventana, mio: 0, cobrado: false};
  S.jefe.peleando = true; guardar();
  PELEA_NIVEL_FIJO = true;
  lanzarPeleaEntrenador({id: 'jefe_' + JF.ventana, titulo: 'Jefe', nombre: 'de las Leyendas', premio: 0, equipo: [], antes: [], despues: ['¡Lo lograron entre todos!'],
    lider: true, jefe: true, sinXP: true, vuelta: {mapa: S.mundo.mapa, x: S.mundo.x, y: S.mundo.y}}, 'cumbres');
}
(() => {
  // lanzarPeleaEntrenador arma los rivales desde n.equipo: para el jefe usamos el nuestro, con la vida compartida.
  const origLanzar = lanzarPeleaEntrenador;
  lanzarPeleaEntrenador = function(n, zona){
    if(!n || !n.jefe) return origLanzar.apply(this, arguments);
    salirDelMundo(); guardar();
    empezarCombate([JF.rival], zona, n);
    if(B){ B.salvaje.max = JEFE_VIDA; fichas(); }
  };
  const origPintar = pintarMundo;
  pintarMundo = function(){
    const r = origPintar.apply(this, arguments);
    if(S && S.jefe && S.jefe.peleando && JF.rival){
      S.jefe.peleando = false;
      const hecho = Math.max(0, JF.inicio - Math.max(0, JF.rival.hp));
      contarAporte(hecho);
      JF.rival = null;
      setTimeout(() => { if(MW){ avisar(`Le hiciste ${hecho} de daño al jefe.`); if(vidaJefe() <= 0) cobrarJefe(); } }, 600);
    }
    if(S && db && usuarioId && cantMedallas() >= 4) conectarJefe();
    return r;
  };
  for(const [mapa, x, y] of [['ceibo', 22, 25], ['colonia', 20, 20]]){
    const M = MAPAS[mapa]; if(!M) continue;
    const s = lugarLibre(M, x, y) || [x, y];
    M.npc({id: 'jefe_mensajera_' + mapa, x: s[0], y: s[1], tipo: 'vecino', nombre: 'Mensajera de las Leyendas', ropa: '#C9A227', pelo: '#E9E2D3', accion: async n => {
      if(cantMedallas() < 4){ await dialogo(n.nombre, ['Cada tres horas despierta una leyenda gigante, y hace falta que todos los entrenadores la enfrenten juntos.', 'Volvé cuando tengas 4 medallas.']); return; }
      abrirJefe();
    }});
    M.jefeMensajera = {x: s[0], y: s[1]};
  }
  const dib = dibujarSecretos;
  dibujarSecretos = function(ctx, M, camX, camY, t){
    if(dib) dib(ctx, M, camX, camY, t);
    if(M && M.jefeMensajera) etiqueta(ctx, '⚔ JEFE', (M.jefeMensajera.x + .5) * TS - camX, (M.jefeMensajera.y + 1) * TS - camY - 62, 'rgba(201,162,39,.95)');
  };
})();
