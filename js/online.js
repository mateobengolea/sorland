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
          nivel: nivelEntrenador(), medallas: cantMedallas(),
          x: S.mundo.x, y: S.mundo.y, dir: MW ? MW.dir : 1, t: Date.now()};
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
  if(!onlineListo()) return;
  const id = S.mundo.mapa;
  if(ON.canal && ON.mapa === id){
    const p = miPresencia(); ON.ultimaPresencia = Date.now();
    ON.canal.track(p); ON.canal.send({type: 'broadcast', event: 'mov', payload: {id: p.id, x: p.x, y: p.y, dir: p.dir}});
    return;
  }
  dejarCanal();
  ON.mapa = id;
  const canal = db.channel('sl:mapa:' + id, {config: {private: true, presence: {key: usuarioId}, broadcast: {self: false}}});
  ON.canal = canal;
  canal
    .on('presence', {event: 'sync'}, () => {
      const estado = canal.presenceState(), vistos = new Set();
      for(const k in estado){
        const p = estado[k][estado[k].length - 1];
        if(!p || p.id === usuarioId) continue;
        vistos.add(p.id);
        const o = ON.otros.get(p.id);
        if(o){ Object.assign(o, {apodo: p.apodo, esp: p.esp, shiny: p.shiny, ent: p.ent, nivel: p.nivel, medallas: p.medallas}); if(!o.movido){ o.x = p.x; o.y = p.y; } }
        else ON.otros.set(p.id, {...p, px: p.x, py: p.y});
      }
      for(const k of [...ON.otros.keys()]) if(!vistos.has(k)) ON.otros.delete(k);
      actualizarContador();
    })
    .on('broadcast', {event: 'mov'}, ({payload: p}) => {
      const o = ON.otros.get(p.id); if(!o) return;
      o.x = p.x; o.y = p.y; o.dir = p.dir; o.movido = true;
    })
    .on('broadcast', {event: 'decir'}, ({payload: p}) => {
      if(ON.silenciados.has(p.id)) return;
      const o = ON.otros.get(p.id); if(!o) return;
      o.burbuja = {txt: limpiarTexto(p.txt), hasta: performance.now() + 5500};
    })
    .on('broadcast', {event: 'duelo'}, ({payload: p}) => { if(p.para === usuarioId && typeof recibirDuelo === 'function') recibirDuelo(p); })
    .subscribe(async estado => {
      if(estado === 'SUBSCRIBED'){ await canal.track(miPresencia()); ON.ultimaPresencia = Date.now(); }
    });
}
function alSalirDelMapa(){ /* el canal sigue abierto mientras dure el combate; se cambia al entrar a otro mapa */ }
function dejarCanal(){
  if(ON.canal){ try { db.removeChannel(ON.canal); } catch(e){} }
  ON.canal = null; ON.mapa = null; ON.otros.clear();
}
// Al salir del juego (cerrar sesión) se llama desde salir().
function cortarOnline(){ dejarCanal(); }

function alMoverme(){
  if(!ON.canal) return;
  const p = miPresencia();
  ON.canal.send({type: 'broadcast', event: 'mov', payload: {id: p.id, x: p.x, y: p.y, dir: p.dir}});
  if(Date.now() - ON.ultimaPresencia > 2500){ ON.ultimaPresencia = Date.now(); ON.canal.track(p); }
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
  const alto = 46, ancho = alto * .72, img = imagenEntrenador(o.ent);
  const anda = Math.abs(o.x - o.px) + Math.abs(o.y - o.py) > .05;
  const salto = anda ? Math.abs(Math.sin(t / 90)) * 3 : 0;
  ctx.fillStyle = 'rgba(34,48,74,.2)'; ctx.beginPath(); ctx.ellipse(cx, piso - 3, 11, 4, 0, 0, 7); ctx.fill();
  ctx.save(); ctx.translate(cx, piso - salto); if(o.dir < 0) ctx.scale(-1, 1);
  if(img.complete) ctx.drawImage(img, -ancho / 2, -alto + 1, ancho, alto);
  ctx.restore();
  etiqueta(ctx, o.apodo + (o.medallas ? ' ' + '★'.repeat(o.medallas) : ''), cx, piso - alto - 14 - salto, 'rgba(122,79,201,.9)');
  if(o.burbuja && o.burbuja.hasta > t) burbuja(ctx, o.burbuja.txt, cx, piso - alto - 20 - salto);
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
      <p class="medallas-mini">${MEDALLAS.map((m, i) => svgMedalla(m, 26, i >= o.medallas)).join('')}</p></div></div>
    <p class="rotulo-chico">Decile algo</p>
    <div class="frases">${FRASES.map(f => `<button data-f="${esc(f)}">${esc(f)}</button>`).join('')}</div>
    <div class="acciones-jugador">
      <button class="grande" id="j-duelo">Desafiar a duelo</button>
      <button class="btn btn-2" id="j-silenciar">${sil ? 'Dejar de silenciar' : 'Silenciar sus mensajes'}</button>
    </div></div>`;
  $('#j-nom').textContent = o.apodo;
  velo.querySelector('.cerrar').onclick = cerrarHoja;
  velo.querySelectorAll('[data-f]').forEach(b => b.onclick = () => { decir(b.dataset.f); cerrarHoja(); });
  $('#j-duelo').onclick = () => { cerrarHoja(); pedirDuelo(o); };
  $('#j-silenciar').onclick = () => {
    if(sil) ON.silenciados.delete(o.id); else ON.silenciados.add(o.id);
    try { localStorage.setItem('sorlandia-silenciados', JSON.stringify([...ON.silenciados])); } catch(e){}
    avisar(sil ? `Ya ves los mensajes de ${o.apodo}` : `Silenciaste a ${o.apodo}`); cerrarHoja();
  };
}

/* ---------------- Hablar ---------------- */
function pintarBotonHablar(){
  const caja = document.querySelector('.mundo-botones'); if(!caja || $('#m-hablar')) return;
  const b = document.createElement('button'); b.id = 'm-hablar'; b.textContent = 'Hablar';
  b.onclick = abrirHablar; caja.appendChild(b);
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
