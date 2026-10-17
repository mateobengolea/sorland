'use strict';
/* =====================================================================
   Intercambio de criaturas entre jugadores conectados.
   A ofrece una criatura → B elige qué dar a cambio → A confirma → los dos cambian.
   Los mensajes viajan por el mismo canal que los duelos (evento 'duelo', tipos tq_*).
   ===================================================================== */
let TQ = null;
const datosTrueque = c => ({esp: c.esp, nombre: String(c.nombre).slice(0, 16), nivel: c.nivel, stats: {...c.stats}, movs: movsDe(c).slice(0, 4), shiny: !!c.shiny, ppExtra: {...(c.ppExtra || {})}});
// Lo que llega del otro lado se revisa: nada de especies inventadas ni números imposibles.
function criaturaRecibida(d, deApodo){
  if(!d || !ESPECIES[d.esp]) return null;
  const nivel = Math.max(1, Math.min(100, d.nivel | 0));
  const esperado = statsPorNivel(ESPECIES[d.esp].base, nivel), st = d.stats || {};
  const ok = k => Number.isFinite(st[k]) && st[k] > 0 && st[k] <= esperado[k] * 1.6 + 24;
  const stats = ok('vida') && ok('fuerza') && ok('velocidad') ? {vida: st.vida | 0, fuerza: st.fuerza | 0, velocidad: st.velocidad | 0} : esperado;
  const movs = (Array.isArray(d.movs) ? d.movs : []).filter(m => MOVS[m] && m !== 'forcejeo').slice(0, 4);
  const ppExtra = {}; for(const m of movs) if(d.ppExtra && Number.isFinite(d.ppExtra[m])) ppExtra[m] = Math.max(0, Math.min(3, d.ppExtra[m] | 0));
  let nombre = String(d.nombre || ESPECIES[d.esp].nombre).slice(0, 16);
  if(typeof limpiarTexto === 'function') nombre = limpiarTexto(nombre) || ESPECIES[d.esp].nombre;
  const c = nuevaCriatura(d.esp, nivel, {nombre, stats, shiny: !!d.shiny, ppExtra, deEntrenador: String(deApodo || '').slice(0, 16)});
  if(movs.length) c.movs = movs;
  return c;
}
function buscarCriatura(uid){
  for(const lista of [S.equipo, S.reserva]){ const i = lista.findIndex(c => c.uid === uid); if(i >= 0) return {lista, i}; }
  return null;
}
// Cambia la criatura propia por la recibida, en el mismo lugar.
function aplicarTrueque(uidMia, datos, deApodo){
  const pos = buscarCriatura(uidMia), nueva = criaturaRecibida(datos, deApodo);
  if(!pos || !nueva) return null;
  const vieja = pos.lista[pos.i];
  pos.lista[pos.i] = nueva;
  S.album.vistos[nueva.esp] = true; S.album.capt[nueva.esp] = (S.album.capt[nueva.esp] || 0) + 1; if(nueva.shiny) S.album.shiny[nueva.esp] = true;
  guardar();
  if(vista === 'casa') pintarJuego(); else if(MW) MW.imgLider = null;
  return {vieja, nueva};
}
const tarjetaTrueque = d => `<div class="tq-carta" style="--tipo:${TIPOS[tipoDe(d.esp)].color}">${svgEspecie(d.esp, {humor: 'feliz', shiny: d.shiny})}<b>${esc(d.nombre)}${d.shiny ? ' ✦' : ''}</b><small>${esc(ESPECIES[d.esp].nombre)} · Nv ${d.nivel | 0}</small></div>`;
function elegirParaTrueque(titulo){
  return new Promise(res => {
    hojaActual = 'trueque';
    const v = nuevoVelo(false), todas = [...S.equipo, ...S.reserva];
    v.innerHTML = `<div class="hoja hoja-elegir" role="dialog" aria-label="${esc(titulo)}"><div class="hoja-cab"><h2>${esc(titulo)}</h2><button class="cerrar" aria-label="Cancelar">×</button></div>
      <p class="rotulo-chico">Elegí una criatura de tu equipo o de tu casa. La que des se va para siempre.</p>
      <div class="grilla-elegir">${todas.map((c, i) => `<button class="elegible${c.shiny ? ' es-shiny' : ''}" data-i="${i}" ${todas.length < 2 ? 'disabled' : ''} style="--tipo:${TIPOS[tipoDe(c.esp)].color}">
        <span class="el-img">${svgEspecie(c.esp, {humor: 'feliz', shiny: c.shiny})}</span><b data-nom="${i}"></b><small>${ESPECIES[c.esp].nombre} · Nv ${c.nivel}</small></button>`).join('')}</div>
      ${todas.length < 2 ? '<p class="rotulo-chico">Necesitás al menos dos criaturas para intercambiar.</p>' : ''}</div>`;
    todas.forEach((c, i) => { v.querySelector(`[data-nom="${i}"]`).textContent = c.nombre + (c.shiny ? ' ✦' : ''); });
    v.querySelector('.cerrar').onclick = () => { cerrarHoja(); res(null); };
    v.querySelectorAll('[data-i]').forEach(b => b.onclick = () => { cerrarHoja(); res(todas[+b.dataset.i]); });
  });
}
function cartelTrueque(titulo, html, botones){
  return new Promise(res => {
    hojaActual = 'trueque';
    let v = $('#velo'); if(!v){ v = document.createElement('div'); v.id = 'velo'; v.className = 'velo'; document.body.appendChild(v); }
    v.onclick = null;
    v.innerHTML = `<div class="hoja" role="dialog" aria-label="${esc(titulo)}"><div class="hoja-cab"><h2>${esc(titulo)}</h2></div>${html}
      <div class="acciones-jugador">${botones.map((b, i) => `<button class="${i ? 'btn btn-2' : 'grande'}" data-b="${i}">${esc(b)}</button>`).join('')}</div></div>`;
    v.querySelectorAll('[data-b]').forEach(b => b.onclick = () => { cerrarHoja(); res(+b.dataset.b); });
  });
}
const enviarTrueque = p => enviarMapa(p);
const libreParaTrueque = () => !TQ && !DU && (vista === 'mundo' || vista === 'casa');

/* ---------------- Quien propone ---------------- */
async function pedirTrueque(o){
  if(!libreParaTrueque()){ avisar(TQ ? 'Ya tenés un intercambio en curso' : 'Terminá lo que estás haciendo primero'); return; }
  const c = await elegirParaTrueque(`¿Qué le ofrecés a ${o.apodo}?`);
  if(!c || !libreParaTrueque()) return;
  const tid = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  TQ = {tid, con: o.id, apodo: o.apodo, mia: c.uid, ofrezco: datosTrueque(c), estado: 'esperando'};
  enviarTrueque({tipo: 'tq_pedido', para: o.id, tid, oferta: TQ.ofrezco});
  avisar(`Le ofreciste ${c.nombre} a ${o.apodo}. Esperando que elija qué darte...`);
  TQ.timer = setTimeout(() => { if(TQ && TQ.tid === tid && TQ.estado === 'esperando'){ TQ = null; avisar(`${o.apodo} no respondió el intercambio`); } }, 90000);
}
/* ---------------- Mensajes ---------------- */
async function recibirTrueque(p){
  if(p.tipo === 'tq_pedido'){
    if(!libreParaTrueque() || (hojaActual && !['amigos', 'online', 'perfil', 'menu'].includes(hojaActual) && $('#velo'))){ enviarTrueque({tipo: 'tq_no', para: p.de, tid: p.tid, motivo: 'ocupado'}); return; }
    if(!p.oferta || !ESPECIES[p.oferta.esp]){ return; }
    TQ = {tid: p.tid, con: p.de, apodo: p.apodo, recibo: p.oferta, estado: 'decidiendo'};
    const r = await cartelTrueque('¡Te proponen un intercambio!', `<p class="pedido-txt"><b>${esc(p.apodo)}</b> te ofrece:</p><div class="tq-fila">${tarjetaTrueque(p.oferta)}</div>`, ['Elegir qué darle', 'No, gracias']);
    if(!TQ || TQ.tid !== p.tid) return;
    if(r !== 0){ enviarTrueque({tipo: 'tq_no', para: p.de, tid: p.tid}); TQ = null; return; }
    const c = await elegirParaTrueque(`¿Qué le das a ${p.apodo}?`);
    if(!TQ || TQ.tid !== p.tid) return;
    if(!c){ enviarTrueque({tipo: 'tq_no', para: p.de, tid: p.tid}); TQ = null; return; }
    TQ.mia = c.uid; TQ.ofrezco = datosTrueque(c); TQ.estado = 'ofrecido';
    enviarTrueque({tipo: 'tq_oferta', para: p.de, tid: p.tid, oferta: TQ.ofrezco});
    avisar(`Le ofreciste ${c.nombre}. Esperando que ${p.apodo} confirme...`);
    TQ.timer = setTimeout(() => { if(TQ && TQ.tid === p.tid && TQ.estado === 'ofrecido'){ TQ = null; avisar('El intercambio se canceló'); } }, 60000);
  } else if(p.tipo === 'tq_oferta'){
    if(!TQ || TQ.tid !== p.tid || TQ.estado !== 'esperando' || !p.oferta || !ESPECIES[p.oferta.esp]) return;
    clearTimeout(TQ.timer); TQ.recibo = p.oferta; TQ.estado = 'confirmando';
    const r = await cartelTrueque('¿Confirmás el intercambio?', `<div class="tq-fila">${tarjetaTrueque(TQ.ofrezco)}<span class="tq-flechas">⇄</span>${tarjetaTrueque(TQ.recibo)}</div>
      <p class="rotulo-chico" style="text-align:center">Vos das la de la izquierda y recibís la de ${esc(TQ.apodo)}.</p>`, ['¡Intercambiar!', 'Cancelar']);
    if(!TQ || TQ.tid !== p.tid) return;
    if(r !== 0){ enviarTrueque({tipo: 'tq_no', para: TQ.con, tid: TQ.tid}); TQ = null; return; }
    TQ.estado = 'confirmado';
    enviarTrueque({tipo: 'tq_ok', para: TQ.con, tid: TQ.tid});
    TQ.timer = setTimeout(() => { if(TQ && TQ.tid === p.tid){ TQ = null; avisar('No hubo respuesta: el intercambio no se hizo.'); } }, 20000);
  } else if(p.tipo === 'tq_ok'){
    if(!TQ || TQ.tid !== p.tid || TQ.estado !== 'ofrecido') return;
    clearTimeout(TQ.timer);
    const t = TQ; TQ = null;
    const hecho = aplicarTrueque(t.mia, t.recibo, t.apodo);
    if(!hecho){ enviarTrueque({tipo: 'tq_no', para: t.con, tid: t.tid, motivo: 'error'}); avisar('No se pudo hacer el intercambio'); return; }
    for(const ms of [0, 800, 2000]) setTimeout(() => enviarTrueque({tipo: 'tq_hecho', para: t.con, tid: t.tid}), ms);
    escenaTrueque(t.ofrezco, hecho.nueva, t.apodo);
  } else if(p.tipo === 'tq_hecho'){
    if(!TQ || TQ.tid !== p.tid || TQ.estado !== 'confirmado') return;
    clearTimeout(TQ.timer);
    const t = TQ; TQ = null;
    const hecho = aplicarTrueque(t.mia, t.recibo, t.apodo);
    if(hecho) escenaTrueque(t.ofrezco, hecho.nueva, t.apodo);
  } else if(p.tipo === 'tq_no'){
    if(!TQ || TQ.tid !== p.tid) return;
    clearTimeout(TQ.timer); TQ = null;
    if($('#velo') && hojaActual === 'trueque') cerrarHoja();
    avisar(p.motivo === 'ocupado' ? `${p.apodo} está ocupado ahora` : `${p.apodo} canceló el intercambio`);
  }
}
async function escenaTrueque(di, nueva, apodoOtro){
  await cartelTrueque('¡Intercambio hecho!', `<div class="tq-fila tq-anim">${tarjetaTrueque(di)}<span class="tq-flechas">⇄</span>${tarjetaTrueque(datosTrueque(nueva))}</div>
    <p class="pedido-txt" style="text-align:center">¡<b>${esc(nueva.nombre)}</b> llegó desde el equipo de ${esc(apodoOtro)}! Cuidalo mucho.</p>`, ['¡Genial!']);
}
// Los mensajes de intercambio llegan por el mismo camino que los de duelo.
(() => {
  const original = recibirDuelo;
  recibirDuelo = function(p){ if(p && typeof p.tipo === 'string' && p.tipo.startsWith('tq_')) return recibirTrueque(p); return original(p); };
})();
// Botón de intercambio al tocar a otro jugador en el mapa.
(() => {
  const original = abrirInteraccion;
  abrirInteraccion = function(o){
    original(o);
    const acc = document.querySelector('#velo .acciones-jugador'); if(!acc) return;
    acc.insertAdjacentHTML('afterbegin', `<button class="btn" id="j-trueque" ${o.pelea ? 'disabled' : ''}>Intercambiar criaturas</button>`);
    $('#j-trueque').onclick = () => { cerrarHoja(); pedirTrueque(o); };
  };
})();
