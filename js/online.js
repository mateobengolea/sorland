'use strict';
/* =====================================================================
   Online: ver a otros jugadores en el mapa, hablar y pedir duelos.
   Usa los canales en vivo de Supabase (presencia + mensajes).
   ===================================================================== */

const ON = {canal: null, mapa: null, otros: new Map(), ultimaPresencia: 0, miBurbuja: null, pedido: null,
            silenciados: new Set(), imgs: {}};
try { JSON.parse(localStorage.getItem('sorlandia-silenciados') || '[]').forEach(id => ON.silenciados.add(id)); } catch(e){}

const FRASES = ['¡Hola!', '¿Peleamos?', '¡Buena pelea!', '¡Suerte!', '¿Me ayudás?', '¡Gracias!', 'Ya vuelvo', '¡Nos vemos!'];
const PALABRAS_FEAS = ['puto', 'puta', 'boludo', 'pelotudo', 'forro', 'concha', 'mierda', 'pija', 'verga', 'culiado', 'trolo', 'idiota', 'imbecil', 'imbécil', 'mogolico', 'mogólico'];
function limpiarTexto(t){
  let s = String(t).replace(/\s+/g, ' ').trim().slice(0, 80);
  for(const p of PALABRAS_FEAS) s = s.replace(new RegExp(`\\b${p}\\b`, 'gi'), m => '*'.repeat(m.length));
  return s;
}
const onlineListo = () => !!(db && usuarioId && apodo);

function miPresencia(){
  return {id: usuarioId, apodo, esp: S.equipo[0] ? S.equipo[0].esp : 'carosor', shiny: !!(S.equipo[0] && S.equipo[0].shiny), ent: S.entrenador,
          nivel: nivelEntrenador(), medallas: cantMedallas(), campeon: !!S.campeon,
          x: S.mundo.x, y: S.mundo.y, dir: MW ? MW.dir : 1, mira: MW ? MW.mira : 'abajo', pelea: ON.pelea || null, t: Date.now()};
}
function nivelEntrenador(){ return S.equipo.reduce((m, c) => Math.max(m, c.nivel), 1); }
function imagenEntrenador(ent){
  const k = 'e' + JSON.stringify(ent || {});
  if(!ON.imgs[k]){ const i = new Image(); i.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgEntrenador(ent)); ON.imgs[k] = i; }
  return ON.imgs[k];
}
function imagenDe(esp){
  if(!ON.imgs[esp]){ const i = new Image(); i.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgCriatura(esp, {humor:'feliz'})); ON.imgs[esp] = i; }
  return ON.imgs[esp];
}

/* ---------------- Entrar y salir del canal del mapa ---------------- */
function alEntrarAlMapa(){
  pintarBotonHablar();
  ON.pelea = null;
  conectarGlobal(); avisarDondeEstoy();
  if(!onlineListo()) return;
  const id = S.mundo.mapa;
  if(ON.canal && ON.mapa === id){
    // Volví al mismo mapa (después de una pelea): aviso por broadcast, que no tiene límite de presencia.
    const p = miPresencia();
    ON.canal.send({type: 'broadcast', event: 'mov', payload: {id: p.id, x: p.x, y: p.y, dir: p.dir, mira: p.mira}});
    ON.canal.send({type: 'broadcast', event: 'pelea', payload: {id: usuarioId, pelea: null}});
    trackMapa();
    return;
  }
  dejarCanal();
  ON.mapa = id;
  const canal = db.channel('sl:mapa:' + id, {config: {private: true, presence: {key: usuarioId}, broadcast: {self: false}}});
  ON.canal = canal;
  canal
    .on('presence', {event: 'sync'}, () => {
      const estado = canal.presenceState(), vistos = new Set(); let hayNuevo = false;
      for(const k in estado){
        const p = estado[k][estado[k].length - 1];
        if(!p || p.id === usuarioId) continue;
        vistos.add(p.id);
        const o = ON.otros.get(p.id);
        if(o){ Object.assign(o, {apodo: p.apodo, esp: p.esp, shiny: p.shiny, ent: p.ent, nivel: p.nivel, medallas: p.medallas, campeon: p.campeon});
               if(!o.movido){ o.x = p.x; o.y = p.y; } if(!o.peleaPorMensaje) o.pelea = p.pelea; }
        else { ON.otros.set(p.id, {...p, px: p.x, py: p.y}); hayNuevo = true; }
      }
      for(const k of [...ON.otros.keys()]) if(!vistos.has(k)) ON.otros.delete(k);
      actualizarContador();
      // Llegó alguien: le cuento dónde estoy y si estoy peleando (por broadcast, sin gastar presencia).
      if(hayNuevo) setTimeout(() => {
        if(ON.canal !== canal) return;
        const p = miPresencia();
        canal.send({type: 'broadcast', event: 'mov', payload: {id: p.id, x: p.x, y: p.y, dir: p.dir, mira: p.mira}});
        canal.send({type: 'broadcast', event: 'pelea', payload: {id: usuarioId, pelea: ON.pelea || null}});
      }, 300 + Math.random() * 500);
    })
    .on('broadcast', {event: 'mov'}, ({payload: p}) => {
      const o = ON.otros.get(p.id); if(!o) return;
      o.x = p.x; o.y = p.y; o.dir = p.dir; o.mira = p.mira || o.mira; o.movido = true;
    })
    .on('broadcast', {event: 'pelea'}, ({payload: p}) => {
      const o = ON.otros.get(p.id); if(!o) return;
      o.pelea = p.pelea || null; o.peleaPorMensaje = true;
    })
    .on('broadcast', {event: 'decir'}, ({payload: p}) => {
      if(ON.silenciados.has(p.id)) return;
      const o = ON.otros.get(p.id); if(!o) return;
      o.burbuja = {txt: limpiarTexto(p.txt), hasta: performance.now() + 5500};
    })
    .on('broadcast', {event: 'duelo'}, ({payload: p}) => { if(p.para === usuarioId && typeof recibirDuelo === 'function') recibirDuelo(p); })
    .subscribe(async estado => {
      if(estado === 'SUBSCRIBED'){ ON.ultimaPresencia = Date.now(); await canal.track(miPresencia()); }
    });
}
function alSalirDelMapa(){ /* el canal sigue abierto mientras dure el combate; se cambia al entrar a otro mapa */ }
function dejarCanal(){
  if(ON.canal){ try { db.removeChannel(ON.canal); } catch(e){} }
  ON.canal = null; ON.mapa = null; ON.otros.clear();
}
// Al salir del juego (cerrar sesión) se llama desde salir().
function cortarOnline(){
  dejarCanal();
  if(ONG.canal){ try { db.removeChannel(ONG.canal); } catch(e){} }
  ONG.canal = null; ONG.estado = {}; ONG.listo = false; ONG.firma = null; clearTimeout(ONG.timer);
}

/* ---------------- Cuántos hay online (en todo el juego) ---------------- */
const ONG = {canal: null, estado: {}, ultimo: 0, listo: false, firma: null, timer: 0};
function dondeEstoy(){
  if(vista === 'casa') return 'En su casa';
  if(ON.pelea) return ON.pelea.tipo === 'duelo' ? 'En duelo con ' + ON.pelea.contra : 'En batalla';
  if(vista === 'combate' || vista === 'duelo') return 'En batalla';
  const M = S && S.mundo && MAPAS[S.mundo.mapa];
  return M ? (M.tema.interior ? 'De visita en ' + M.nombre : M.nombre) : 'Paseando';
}
function presenciaGlobal(){ return {apodo, nivel: S && S.equipo ? nivelEntrenador() : 1, donde: dondeEstoy(), medallas: cantMedallas(), campeon: !!(S && S.campeon), ent: S && S.entrenador, puntos: RK.ficha ? RK.ficha.puntos : null}; }
function conectarGlobal(){
  if(!onlineListo() || ONG.canal) return;
  const canal = db.channel('sl:global', {config: {private: true, presence: {key: usuarioId}}});
  ONG.canal = canal;
  canal.on('presence', {event: 'sync'}, () => { ONG.estado = canal.presenceState(); actualizarOnline(); })
       // Solicitudes de amistad e invitaciones a duelo llegan por acá, estés en el mapa que estés.
       .on('broadcast', {event: 'amistad'}, ({payload: p}) => { if(typeof alRecibirAmistad === 'function') alRecibirAmistad(p); })
       .on('broadcast', {event: 'duelo'}, ({payload: p}) => { if(p.para === usuarioId && typeof recibirDuelo === 'function') recibirDuelo(p); })
       .subscribe(async estado => {
         if(estado === 'SUBSCRIBED'){
           ONG.listo = true; ONG.ultimo = Date.now();
           if(typeof cargarAmigos === 'function') cargarAmigos();
           const p = presenciaGlobal(); ONG.firma = JSON.stringify([p.donde, p.medallas, p.campeon, p.puntos, p.ent]);
           await canal.track(p);
         } else if(estado === 'CHANNEL_ERROR' || estado === 'TIMED_OUT' || estado === 'CLOSED'){
           // Se cortó: reintento en un rato con un canal nuevo.
           if(ONG.canal !== canal) return;
           ONG.listo = false; ONG.canal = null; ONG.firma = null;
           try { db.removeChannel(canal); } catch(e){}
           setTimeout(conectarGlobal, 15000);
         }
       });
}
function avisarDondeEstoy(){
  if(!ONG.canal || !ONG.listo) return;
  const p = presenciaGlobal(), firma = JSON.stringify([p.donde, p.medallas, p.campeon, p.puntos, p.ent]);
  if(firma === ONG.firma) return;
  const espera = 5000 - (Date.now() - ONG.ultimo);
  clearTimeout(ONG.timer);
  if(espera > 0){ ONG.timer = setTimeout(avisarDondeEstoy, espera); return; }
  ONG.ultimo = Date.now(); ONG.firma = firma;
  ONG.canal.track(p);
}
function jugadoresOnline(){
  return Object.entries(ONG.estado).map(([id, l]) => ({id, ...(l[l.length - 1] || {})})).filter(p => p.apodo);
}
function actualizarOnline(){
  const b = document.getElementById('online-badge'); if(!b) return;
  if(!onlineListo()){ b.hidden = true; return; }
  const n = Math.max(1, jugadoresOnline().length);
  b.hidden = false;
  b.innerHTML = `<i class="punto-online"></i>${n} online`;
  b.setAttribute('aria-label', `${n} jugador${n > 1 ? 'es' : ''} online`);
  if(hojaActual === 'online') pintarOnline();
  if(hojaActual === 'amigos' && typeof pintarAmigos === 'function') pintarAmigos();
}
function abrirOnline(){
  if(typeof abrirAmigos === 'function') return abrirAmigos(AM.lista.some(a => a.estado === 'aceptada' && presenciaDe(a.id)) || solicitudesRecibidas().length ? 'amigos' : 'online');
  hojaActual = 'online';
  nuevoVelo();
  pintarOnline();
}
function pintarOnline(){
  const v = $('#velo'); if(!v) return;
  const lista = jugadoresOnline().sort((a, b) => (b.id === usuarioId) - (a.id === usuarioId) || b.medallas - a.medallas);
  v.innerHTML = `<div class="hoja" role="dialog" aria-label="Jugadores online"><div class="hoja-cab"><h2>Online ahora</h2><button class="cerrar" aria-label="Cerrar">×</button></div>
    <p class="rotulo-chico">${lista.length || 1} jugador${lista.length === 1 ? '' : 'es'} en Sorlandia en este momento.</p>
    <div class="lista-online">${lista.map(p => `<div class="fila-online"><span class="cr-mini" style="width:38px;height:52px">${svgEntrenador(p.ent)}</span>
      <span class="fo-txt"><b></b><small></small></span>
      <span class="fo-med">${p.puntos != null ? chipRango(p.puntos, false) : ''}${p.campeon ? '<span class="titulo-campeon">Campeón</span>' : ''}<br>${p.medallas ? '★ ' + p.medallas : ''}</span></div>`).join('')}</div>
    <button class="grande" id="ver-ranking" style="margin-top:10px">Ver ranking</button></div>`;
  v.querySelectorAll('.fila-online').forEach((f, i) => {
    f.querySelector('b').textContent = lista[i].apodo + (lista[i].id === usuarioId ? ' (vos)' : '');
    f.querySelector('small').textContent = lista[i].donde || '';
  });
  v.querySelector('.cerrar').onclick = cerrarHoja;
  $('#ver-ranking').onclick = abrirRanking;
}

function alMoverme(){
  if(!ON.canal) return;
  const p = miPresencia();
  ON.canal.send({type: 'broadcast', event: 'mov', payload: {id: p.id, x: p.x, y: p.y, dir: p.dir, mira: p.mira}});
  if(Date.now() - ON.ultimaPresencia > 20000) trackMapa();
}
// Supabase limita cuántas veces por segundo se puede actualizar la presencia:
// se manda como mucho una cada 5 s y, si hay cambios en el medio, va la última al final.
function trackMapa(){
  if(!ON.canal) return;
  const espera = 5000 - (Date.now() - ON.ultimaPresencia);
  clearTimeout(ON.timerTrack);
  if(espera > 0){ ON.timerTrack = setTimeout(trackMapa, espera); return; }
  ON.ultimaPresencia = Date.now();
  ON.canal.track(miPresencia());
}
// Avisa a los del mapa (y al contador global) que empecé o terminé una pelea.
function marcarPelea(tipo, contra, sala){
  ON.pelea = tipo ? {tipo, contra: contra || '', ...(sala ? {sala} : {})} : null;
  if(ON.canal) ON.canal.send({type: 'broadcast', event: 'pelea', payload: {id: usuarioId, pelea: ON.pelea}});
  avisarDondeEstoy();
}

/* ---------------- Dibujo de otros jugadores ---------------- */
function jugadoresVisibles(){
  if(!ON.canal || ON.mapa !== S.mundo.mapa) return [];
  const lista = [];
  for(const o of ON.otros.values()){
    const d = Math.hypot(o.x - o.px, o.y - o.py);
    if(d > 6){ o.px = o.x; o.py = o.y; }
    else { o.px += (o.x - o.px) * .22; o.py += (o.y - o.py) * .22; }
    if(Math.abs(o.x - o.px) < .02) o.px = o.x;
    if(Math.abs(o.y - o.py) < .02) o.py = o.y;
    lista.push(o);
  }
  return lista;
}
function otroJugador(ctx, cx, piso, o, t){
  const anda = Math.abs(o.x - o.px) + Math.abs(o.y - o.py) > .05;
  const paso = anda ? (Math.floor(t / 160) % 2 ? 1 : 2) : 0;
  ctx.fillStyle = 'rgba(34,48,74,.22)'; ctx.beginPath(); ctx.ellipse(cx, piso - 3, 11, 4, 0, 0, 7); ctx.fill();
  dibujarEntrenador(ctx, spritesEntrenador(o.ent), cx, piso, o.mira || 'abajo', paso, 48);
  etiqueta(ctx, (o.campeon ? '♛ ' : '') + o.apodo + (o.medallas ? ' ★' + o.medallas : ''), cx, piso - 62, o.campeon ? 'rgba(184,134,11,.95)' : 'rgba(122,79,201,.9)');
  if(o.pelea) cartelPelea(ctx, o.pelea.tipo === 'duelo' ? '⚔ En duelo' : '⚔ En batalla', cx, piso - 84, t);
  else if(o.burbuja && o.burbuja.hasta > t) burbuja(ctx, o.burbuja.txt, cx, piso - 68);
}
function cartelPelea(ctx, txt, cx, y, t){
  ctx.save();
  ctx.font = '800 11px system-ui, sans-serif';
  const w = ctx.measureText(txt).width + 16, h = 18, sube = Math.sin(t / 260) * 1.5;
  const x = cx - w / 2, yy = y + sube;
  ctx.fillStyle = '#E2574C'; ctx.strokeStyle = '#22304A'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, yy, w, h, 9) : ctx.rect(x, yy, w, h); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(txt, cx, yy + h / 2 + .5);
  ctx.restore();
}
function burbuja(ctx, txt, cx, abajo){
  ctx.font = '700 12px Nunito, sans-serif'; ctx.textAlign = 'center';
  const w = Math.min(200, ctx.measureText(txt).width + 16), h = 22;
  const x = Math.max(4, Math.min(MW.vw - w - 4, cx - w / 2)), y = abajo - h - 6;
  ctx.fillStyle = '#fff'; ctx.strokeStyle = '#22304A'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, w, h, 9) : ctx.rect(x, y, w, h); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - 5, y + h); ctx.lineTo(cx, y + h + 6); ctx.lineTo(cx + 5, y + h); ctx.fill();
  ctx.fillStyle = '#22304A'; ctx.fillText(txt.length > 30 ? txt.slice(0, 29) + '…' : txt, x + w / 2, y + 15);
}
/* ---------------- Tocar a otro jugador ---------------- */
function tocarLienzo(ev){
  if(!MW || !MW.cam || MW.dlg) return;
  const r = MW.canvas.getBoundingClientRect();
  const x = ev.clientX - r.left + MW.cam.x, y = ev.clientY - r.top + MW.cam.y;
  let mejor = null, dist = 30;
  for(const o of jugadoresVisibles()){
    const ox = (o.px + .5) * TS, oy = (o.py + .5) * TS - 10;
    const d = Math.hypot(ox - x, oy - y);
    if(d < dist){ dist = d; mejor = o; }
  }
  if(mejor) abrirInteraccion(mejor);
}
function jugadorEn(){ return null; }

function abrirInteraccion(o){
  hojaActual = 'jugador';
  let velo = $('#velo');
  if(!velo){ velo = document.createElement('div'); velo.id = 'velo'; velo.className = 'velo'; velo.onclick = e => { if(e.target === velo) cerrarHoja(); }; document.body.appendChild(velo); }
  const sil = ON.silenciados.has(o.id);
  velo.innerHTML = `<div class="hoja" role="dialog" aria-label="Jugador">
    <div class="hoja-cab"><h2 id="j-nom"></h2><button class="cerrar" aria-label="Cerrar">×</button></div>
    <div class="ficha-jugador"><span class="cr-mini" style="width:60px;height:84px">${svgEntrenador(o.ent)}</span><span class="cr-mini" style="width:70px;height:70px">${ESPECIES[o.esp] ? svgEspecie(o.esp, {humor:'feliz', shiny: o.shiny}) : ''}</span>
      <div><p><b>Nivel ${o.nivel}</b> · anda con ${ESPECIES[o.esp] ? ESPECIES[o.esp].nombre : ''}</p>
      <p class="medallas-mini">${MEDALLAS.map((m, i) => svgMedalla(m, 20, i >= o.medallas)).join('')}</p></div></div>
    <p class="rotulo-chico">Decile algo</p>
    <div class="frases">${FRASES.map(f => `<button data-f="${esc(f)}">${esc(f)}</button>`).join('')}</div>
    <div class="acciones-jugador">
      ${o.pelea && o.pelea.tipo === 'duelo' && o.pelea.sala && typeof mirarDuelo === 'function' ? `<button class="grande" id="j-mirar">👀 Mirar su duelo</button>`
        : o.pelea ? `<button class="grande" id="j-duelo" disabled>Está ${o.pelea.tipo === 'duelo' ? 'en un duelo' : 'en batalla'}</button>` : '<button class="grande" id="j-duelo">Desafiar a duelo</button>'}
      <button class="btn" id="j-perfil">${typeof estadoAmistad === 'function' && estadoAmistad(o.id) === 'amigos' ? 'Ver perfil · son amigos' : typeof estadoAmistad === 'function' && estadoAmistad(o.id) === 'enviada' ? 'Ver perfil · solicitud enviada' : 'Ver perfil y agregar a amigos'}</button>
      <button class="btn btn-2" id="j-silenciar">${sil ? 'Dejar de silenciar' : 'Silenciar sus mensajes'}</button>
    </div></div>`;
  $('#j-nom').textContent = o.apodo;
  velo.querySelector('.cerrar').onclick = cerrarHoja;
  velo.querySelectorAll('[data-f]').forEach(b => b.onclick = () => { decir(b.dataset.f); cerrarHoja(); });
  if($('#j-duelo')) $('#j-duelo').onclick = () => { cerrarHoja(); pedirDuelo(o); };
  if($('#j-mirar')) $('#j-mirar').onclick = () => { cerrarHoja(); mirarDuelo(o); };
  $('#j-perfil').onclick = () => abrirPerfil(o.id, o);
  $('#j-silenciar').onclick = () => {
    if(sil) ON.silenciados.delete(o.id); else ON.silenciados.add(o.id);
    try { localStorage.setItem('sorlandia-silenciados', JSON.stringify([...ON.silenciados])); } catch(e){}
    avisar(sil ? `Ya ves los mensajes de ${o.apodo}` : `Silenciaste a ${o.apodo}`); cerrarHoja();
  };
}

/* ---------------- Hablar ---------------- */
function pintarBotonHablar(){
  const caja = document.querySelector('.mundo-botones'); if(!caja || $('#m-conectados')) return;
  const c = document.createElement('span'); c.id = 'm-conectados'; c.className = 'conectados'; caja.appendChild(c);
  const lienzo = $('#lienzo'); if(lienzo) lienzo.addEventListener('pointerdown', tocarLienzo);
  actualizarContador();
}
function actualizarContador(){
  const c = $('#m-conectados'); if(!c) return;
  if(!onlineListo()){ c.textContent = 'Sin conexión'; return; }
  const n = ON.otros.size;
  c.textContent = n ? `${n} jugador${n > 1 ? 'es' : ''} acá` : 'Nadie más acá';
}
function abrirHablar(){
  if(!onlineListo()){ avisar('Para hablar con otros jugadores hace falta conexión'); return; }
  hojaActual = 'hablar';
  let velo = $('#velo');
  if(!velo){ velo = document.createElement('div'); velo.id = 'velo'; velo.className = 'velo'; velo.onclick = e => { if(e.target === velo) cerrarHoja(); }; document.body.appendChild(velo); }
  velo.innerHTML = `<div class="hoja" role="dialog" aria-label="Hablar">
    <div class="hoja-cab"><h2>Hablar</h2><button class="cerrar" aria-label="Cerrar">×</button></div>
    <p class="rotulo-chico">Lo ven todos los que están en este mapa.</p>
    <div class="frases">${FRASES.map(f => `<button data-f="${esc(f)}">${esc(f)}</button>`).join('')}</div>
    <form class="ficha" id="f-hablar" style="padding:0;margin-top:10px">
      <label for="txt-hablar">O escribí algo cortito</label>
      <div style="display:flex;gap:8px"><input id="txt-hablar" maxlength="80" autocomplete="off" placeholder="Hasta 80 letras"><button class="grande" style="font-size:1rem;padding:8px 14px">Decir</button></div>
    </form></div>`;
  velo.querySelector('.cerrar').onclick = cerrarHoja;
  velo.querySelectorAll('[data-f]').forEach(b => b.onclick = () => { decir(b.dataset.f); cerrarHoja(); });
  $('#f-hablar').onsubmit = ev => { ev.preventDefault(); const t = $('#txt-hablar').value; if(t.trim()){ decir(t); cerrarHoja(); } };
}
let ultimoDecir = 0;
function decir(txt){
  if(Date.now() - ultimoDecir < 1500){ avisar('Más despacio, esperá un segundo'); return; }
  ultimoDecir = Date.now();
  const limpio = limpiarTexto(txt); if(!limpio) return;
  ON.miBurbuja = {txt: limpio, hasta: performance.now() + 5500};
  if(ON.canal) ON.canal.send({type: 'broadcast', event: 'decir', payload: {id: usuarioId, txt: limpio}});
}

/* ---------------- Los jugadores no se atraviesan ----------------
   Un casillero ocupado por otro jugador del mismo mapa no se puede pisar.
   Puertas y salidas quedan libres para que nadie tape una entrada. */
(() => {
  const orig = transitable;
  transitable = function(M, x, y){
    if(!orig(M, x, y)) return false;
    if(!M || !ON || !ON.canal || ON.mapa !== M.id || !ON.otros || !ON.otros.size) return true;
    const c = M.m[y] && M.m[y][x];
    if(c === 'D' || c === 'x' || (M.salidas && M.salidas[x + ',' + y])) return true;
    // Donde ya estás parado siempre vale (al cargar el mapa, por ejemplo).
    if(S && S.mundo && S.mundo.mapa === M.id && S.mundo.x === x && S.mundo.y === y) return true;
    for(const o of ON.otros.values()) if(Math.round(o.x) === x && Math.round(o.y) === y) return false;
    return true;
  };
})();
