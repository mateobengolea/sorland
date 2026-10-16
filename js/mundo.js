'use strict';
/* =====================================================================
   El mundo: cámara, movimiento, encuentros, personajes y edificios.
   Los mapas están en mapas.js.
   ===================================================================== */

const TS = 32;
let MW = null; // estado de la vista del mundo

function mapaActual(){ return MAPAS[S.mundo.mapa] || MAPAS.ceibo; }

function pintarMundo(){
  vista = 'mundo';
  cerrarHoja();
  if(!S.mundo || !MAPAS[S.mundo.mapa]) S.mundo = {...SALIDA_CASA};
  const M = mapaActual();
  if(!transitable(M, S.mundo.x, S.mundo.y)) S.mundo = {...SALIDA_CASA};
  $('#app').innerHTML = `
    ${cabeceraHTML()}
    <section class="mundo" id="mundo">
      <canvas id="lienzo" aria-label="Mapa de Sorlandia"></canvas>
      <div class="cartel-zona" id="cartel-zona"></div>
      <div class="mundo-botones">
        <button id="m-equipo">Criaturas</button>
        <button id="m-mochila">Mochila</button>
      </div>
      <div class="dpad" aria-label="Moverse">
        <button data-d="up" aria-label="Arriba">▲</button>
        <button data-d="left" aria-label="Izquierda">◀</button>
        <button data-d="down" aria-label="Abajo">▼</button>
        <button data-d="right" aria-label="Derecha">▶</button>
      </div>
      <div class="dialogo" id="dialogo" hidden role="dialog" aria-live="polite"><b id="dlg-nom"></b><p id="dlg-txt"></p><small>Tocá para seguir</small></div>
    </section>
    <p class="pie">El pasto alto esconde criaturas. Hablá con la gente caminando hacia ella. Para volver a casa, entrá por tu puerta en Pueblo Ceibo.</p>
    <p class="pie" id="cuenta"></p>`;
  pintarTodo(); pintarCuenta();
  $('#m-equipo').onclick = () => abrirEquipo();
  $('#m-mochila').onclick = () => { pestana.mochila = 'aventura'; abrirHoja('mochila'); };
  $('#dialogo').onclick = avanzarDialogo;

  const canvas = $('#lienzo');
  MW = {canvas, ctx: canvas.getContext('2d'), pos: {x: S.mundo.x, y: S.mundo.y}, desde: null, hacia: null, t: 0,
        dir: 1, teclas: new Set(), raf: 0, zona: null, img: new Image(), ultimo: performance.now(), pasos: 0,
        ocupado: false, dlg: null, alerta: null};
  MW.img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgCriatura(S.especie, {humor:'feliz'}));
  ajustarLienzo();
  window.addEventListener('resize', ajustarLienzo);
  document.querySelectorAll('.dpad button').forEach(b => {
    const d = b.dataset.d;
    b.onpointerdown = ev => { ev.preventDefault(); if(MW.dlg){ avanzarDialogo(); return; } MW.teclas.add(d); b.setPointerCapture(ev.pointerId); };
    const soltar = () => MW && MW.teclas.delete(d);
    b.onpointerup = soltar; b.onpointercancel = soltar; b.onlostpointercapture = soltar;
  });
  mostrarZona(true);
  MW.raf = requestAnimationFrame(cuadro);
  if(typeof alEntrarAlMapa === 'function') alEntrarAlMapa();
}

function salirDelMundo(){
  if(!MW) return;
  cancelAnimationFrame(MW.raf);
  window.removeEventListener('resize', ajustarLienzo);
  if(MW.dlg) MW.dlg.fin();
  MW = null;
  if(typeof alSalirDelMapa === 'function') alSalirDelMapa();
}

function ajustarLienzo(){
  if(!MW) return;
  const c = MW.canvas, dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = c.parentElement.clientWidth, h = Math.min(440, Math.max(320, Math.round(window.innerHeight * .55)));
  c.style.width = w + 'px'; c.style.height = h + 'px';
  c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
  MW.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  MW.vw = w; MW.vh = h;
}

/* ---------------- Diálogos ---------------- */
function dialogo(nombre, lineas){
  return new Promise(res => {
    if(!MW){ res(); return; }
    MW.teclas.clear(); MW.ocupado = true;
    MW.dlg = {nombre, lineas: [...lineas], i: 0, fin: () => { if(!MW) return res(); MW.dlg = null; MW.ocupado = false; $('#dialogo').hidden = true; res(); }};
    $('#dlg-nom').textContent = nombre;
    $('#dlg-txt').textContent = MW.dlg.lineas[0];
    $('#dialogo').hidden = false;
  });
}
function avanzarDialogo(){
  if(!MW || !MW.dlg) return;
  const d = MW.dlg; d.i++;
  if(d.i >= d.lineas.length) d.fin();
  else $('#dlg-txt').textContent = d.lineas[d.i];
}

const TECLAS = {ArrowUp:'up', ArrowDown:'down', ArrowLeft:'left', ArrowRight:'right', w:'up', s:'down', a:'left', d:'right', W:'up', S:'down', A:'left', D:'right'};
document.addEventListener('keydown', e => {
  if(!MW || vista !== 'mundo' || $('#velo')) return;
  if(MW.dlg && (e.key === 'Enter' || e.key === ' ' || TECLAS[e.key])){ e.preventDefault(); if(!e.repeat) avanzarDialogo(); return; }
  if(e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
  const d = TECLAS[e.key]; if(!d) return;
  e.preventDefault(); MW.teclas.add(d);
});
document.addEventListener('keyup', e => { const d = TECLAS[e.key]; if(d && MW) MW.teclas.delete(d); });
window.addEventListener('blur', () => MW && MW.teclas.clear());

const DIRS = {up:[0,-1], down:[0,1], left:[-1,0], right:[1,0]};
const DUR_PASO = 170;

function cuadro(ahora){
  if(!MW) return;
  const dt = Math.min(50, ahora - MW.ultimo); MW.ultimo = ahora;
  const M = mapaActual();
  if(MW.hacia){
    MW.t += dt / DUR_PASO;
    if(MW.t >= 1){
      MW.pos = {...MW.hacia}; MW.hacia = null; MW.t = 0;
      S.mundo = {mapa: M.id, x: MW.pos.x, y: MW.pos.y};
      if(typeof alMoverme === 'function') alMoverme();
      if(alLlegar()) return;
    }
  }
  if(!MW.hacia && !MW.ocupado && !$('#velo')){
    const d = [...MW.teclas].pop();
    if(d){
      const [dx, dy] = DIRS[d];
      if(dx) MW.dir = dx;
      const nx = MW.pos.x + dx, ny = MW.pos.y + dy;
      if(transitable(M, nx, ny)){ MW.desde = {...MW.pos}; MW.hacia = {x: nx, y: ny}; MW.t = 0; }
      else {
        const n = npcEn(M, nx, ny);
        if(n){ MW.teclas.clear(); hablarCon(n); }
        else if(typeof jugadorEn === 'function'){ const j = jugadorEn(nx, ny); if(j){ MW.teclas.clear(); abrirInteraccion(j); } }
      }
    }
  }
  if(!MW) return;
  dibujar(ahora);
  MW.raf = requestAnimationFrame(cuadro);
}

function alLlegar(){
  const M = mapaActual(), {x, y} = MW.pos, c = M.m[y][x];
  MW.pasos++;
  if(MW.pasos % 12 === 0) guardar();
  mostrarZona();
  // Salidas a otros mapas
  const sal = M.salidas[x + ',' + y];
  if(sal){
    S.mundo = {mapa: sal.mapa, x: sal.x, y: sal.y};
    salirDelMundo(); guardar(); pintarMundo();
    return true;
  }
  // Puertas
  if(c === 'D'){
    const acc = M.puertas[x + ',' + y];
    MW.teclas.clear();
    // Al entrar por una puerta volvés al casillero de abajo para no quedar adentro.
    const afuera = {x, y: y + 1};
    if(acc === 'casa'){
      S.mundo = {mapa: M.id, ...afuera};
      salirDelMundo(); guardar(); pintarJuego();
      avisar('Volviste a casa. Tu equipo descansó y está como nuevo.');
      return true;
    }
    MW.pos = afuera; S.mundo = {mapa: M.id, ...afuera};
    if(acc === 'posada'){
      curarEquipo();
      S.respawn = {mapa: M.id, ...afuera};
      guardar();
      dialogo('Posadera', ['¡Bienvenido a la posada! Descansen un ratito...', 'Listo: tu equipo está como nuevo. Si te va mal en una pelea, volvés acá.']);
      return false;
    }
    if(acc === 'almacen'){ pestana.tienda = 'aventura'; abrirHoja('tienda'); return false; }
    if(acc && acc.lider){ desafiarLider(LIDERES[acc.lider], M); return false; }
    return false;
  }
  // Entrenadores que te ven al pasar al lado
  for(const n of M.npcs){
    if(n.tipo === 'entrenador' && !S.vencidos[n.id] && Math.abs(n.x - x) + Math.abs(n.y - y) === 1){
      MW.teclas.clear();
      MW.alerta = {n, hasta: performance.now() + 700};
      MW.ocupado = true;
      setTimeout(() => { if(MW){ MW.ocupado = false; hablarCon(n); } }, 700);
      return false;
    }
  }
  // Pasto alto
  if(c === ','){
    const z = zonaEn(M, x, y);
    if(ZONAS[z] && ZONAS[z].aparecen.length && Math.random() < .13){
      if(!hayLuchadorEnPie()){ avisar('Tu equipo está agotado. Descansá en una posada o en tu casa.'); return false; }
      MW.teclas.clear();
      const salvaje = crearSalvaje(z);
      salirDelMundo(); guardar();
      empezarCombate([salvaje], z, null);
      return true;
    }
  }
  return false;
}

async function hablarCon(n){
  if(!MW || MW.ocupado) return;
  if(n.tipo === 'vecino'){ await dialogo(n.nombre, n.frases); return; }
  if(n.tipo === 'guardia'){ await dialogo(n.nombre, guardiaAbierto(n) ? n.abierto : n.frases); return; }
  if(n.tipo === 'entrenador'){
    if(S.vencidos[n.id]){ await dialogo(`${n.titulo} ${n.nombre}`, n.despues); return; }
    if(!hayLuchadorEnPie()){ await dialogo(`${n.titulo} ${n.nombre}`, ['Tu equipo está agotado. Andá a descansar y después peleamos.']); return; }
    await dialogo(`${n.titulo} ${n.nombre}`, n.antes);
    lanzarPeleaEntrenador(n, zonaEn(mapaActual(), n.x, n.y));
  }
}
async function desafiarLider(L, M){
  if(S.medallas[L.medalla]){ await dialogo(`${L.titulo} ${L.nombre}`, [L.yaGano]); return; }
  if(!hayLuchadorEnPie()){ await dialogo(`${L.titulo} ${L.nombre}`, ['Tu equipo está agotado. Pasá por la posada y volvé.']); return; }
  await dialogo(`${L.titulo} ${L.nombre}`, L.antes);
  lanzarPeleaEntrenador({...L, lider: true}, M.zonas[0][0]);
}
function lanzarPeleaEntrenador(n, zona){
  const mult = n.lider ? .95 : .8;
  const rivales = n.equipo.map(([esp, nivel]) => {
    const sp = SALVAJES[esp], stats = statsPorNivel(sp.base, nivel);
    return {esp, nombre: sp.nombre, nivel, stats, hp: vidaMax(stats, nivel), tipo: sp.tipo, mult};
  });
  salirDelMundo(); guardar();
  empezarCombate(rivales, zona, n);
}

function mostrarZona(forzar){
  const M = mapaActual(), z = zonaEn(M, MW.pos.x, MW.pos.y);
  if(z === MW.zona && !forzar) return;
  MW.zona = z;
  const c = $('#cartel-zona'); if(!c) return;
  c.textContent = ZONAS[z] ? ZONAS[z].nom : M.nombre;
  c.classList.remove('ver'); void c.offsetWidth; c.classList.add('ver');
}

/* ---------------- Dibujo ---------------- */
function hashXY(x, y){ let h = x * 374761393 + y * 668265263; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }

function colorSuelo(M, c, x, y){
  const t = M.tema;
  switch(c){
    case ',': return t.pastoAlto;
    case '~': case 'b': return '#5AB4E8';
    case '=': return M.id === 'fogon' ? '#B49A7A' : '#E9D3A0';
    case ':': return '#D9D0C1';
    case 's': return t.tierra;
    case 'v': return t.pasto;
    case '!': return '#E2492E';
    case '#': case 'T': {
      if(M.id === 'ceibo') return zonaEn(M, x, y) === 'sierras' ? t.tierra : t.pasto;
      return M.base === 's' ? t.tierra : t.pasto;
    }
    default: return t.pasto;
  }
}

function dibujar(ahora){
  const {ctx, vw, vh} = MW, M = mapaActual();
  let px = MW.pos.x, py = MW.pos.y;
  if(MW.hacia){ px = MW.desde.x + (MW.hacia.x - MW.desde.x) * MW.t; py = MW.desde.y + (MW.hacia.y - MW.desde.y) * MW.t; }
  const camX = Math.max(0, Math.min(M.w * TS - vw, (px + .5) * TS - vw / 2));
  const camY = Math.max(0, Math.min(M.h * TS - vh, (py + .5) * TS - vh / 2));
  MW.cam = {x: camX, y: camY};
  ctx.fillStyle = M.tema.fondo; ctx.fillRect(0, 0, vw, vh);
  const x0 = Math.max(0, Math.floor(camX / TS)), y0 = Math.max(0, Math.floor(camY / TS));
  const x1 = Math.min(M.w - 1, Math.ceil((camX + vw) / TS)), y1 = Math.min(M.h - 1, Math.ceil((camY + vh) / TS));
  for(let y = y0; y <= y1; y++) for(let x = x0; x <= x1; x++){
    const c = M.m[y][x], sx = Math.round(x * TS - camX), sy = Math.round(y * TS - camY);
    ctx.fillStyle = colorSuelo(M, c, x, y); ctx.fillRect(sx, sy, TS + 1, TS + 1);
    if(c === '.' || c === 'f' || c === 'v'){ if(hashXY(x, y) < .3){ ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(sx, sy, TS, TS); } }
    if(c === ',') pastoAlto(ctx, sx, sy, x, y, ahora, M.tema.brizna);
    if(c === 'f') flores(ctx, sx, sy, x, y);
    if(c === '~' || c === 'b') agua(ctx, sx, sy, x, y, ahora);
    if(c === 'b') puente(ctx, sx, sy);
    if(c === ':') adoquin(ctx, sx, sy, x, y);
    if(c === '!') lava(ctx, sx, sy, x, y, ahora);
    if(c === '=' && hashXY(x, y) < .5){ ctx.fillStyle = 'rgba(160,120,60,.18)'; ctx.fillRect(sx + 6, sy + 10, 4, 3); }
    if(M.salidas[x + ',' + y]) flecha(ctx, sx, sy, x, y, M, ahora);
  }
  const otros = typeof jugadoresVisibles === 'function' ? jugadoresVisibles() : [];
  for(let y = y0; y <= y1; y++){
    for(let x = x0; x <= x1; x++){
      const c = M.m[y][x], sx = Math.round(x * TS - camX), sy = Math.round(y * TS - camY);
      if(c === '#') roca(ctx, sx, sy, x, y, M);
      if(c === 'R' || c === 'H' || c === 'D') edificioTile(ctx, sx, sy, x, y, c, M);
    }
    for(let x = x0; x <= x1; x++) if(M.m[y][x] === 'T') arbol(ctx, Math.round(x * TS - camX), Math.round(y * TS - camY), x, y, M);
    for(const n of M.npcs) if(n.y === y && !(n.tipo === 'guardia' && guardiaAbierto(n))) persona(ctx, (n.x + .5) * TS - camX, (n.y + 1) * TS - camY, n, ahora);
    for(const o of otros) if(Math.floor(o.py + .5) === y) otroJugador(ctx, (o.px + .5) * TS - camX, (o.py + 1) * TS - camY, o, ahora);
    if(y === Math.floor(py + .5)) jugador(ctx, (px + .5) * TS - camX, (py + 1) * TS - camY, ahora);
  }
  for(const e of M.edificios) cartelEdificio(ctx, e, camX, camY);
  if(M.tema.tinte){ ctx.fillStyle = M.tema.tinte; ctx.fillRect(0, 0, vw, vh); }
  if(MW.alerta && MW.alerta.hasta > ahora){
    const n = MW.alerta.n, ax = (n.x + .5) * TS - camX, ay = n.y * TS - camY - 26;
    ctx.fillStyle = '#fff'; ctx.strokeStyle = '#22304A'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(ax, ay, 11, 0, 7); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#E2492E'; ctx.font = '800 16px "Baloo 2", sans-serif'; ctx.textAlign = 'center'; ctx.fillText('!', ax, ay + 6);
  }
}

function pastoAlto(ctx, sx, sy, x, y, t, color){
  ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
  const mov = Math.sin(t / 500 + x * .7 + y) * 1.6;
  for(let i = 0; i < 4; i++){
    const bx = sx + 5 + i * 7 + hashXY(x * 3 + i, y) * 3, by = sy + 26 - (i % 2) * 10;
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx - 3 + mov, by - 10); ctx.moveTo(bx + 1, by); ctx.lineTo(bx + 4 + mov, by - 9); ctx.stroke();
  }
}
function flores(ctx, sx, sy, x, y){
  const cols = ['#FF7FA3', '#FFE45C', '#FFFFFF', '#E63B4B'];
  for(let i = 0; i < 3; i++){
    const fx = sx + 6 + hashXY(x + i, y * 2) * 20, fy = sy + 6 + hashXY(x, y + i * 3) * 20;
    ctx.fillStyle = cols[Math.floor(hashXY(x * i + 1, y) * 4)];
    ctx.beginPath(); ctx.arc(fx, fy, 3, 0, 7); ctx.fill();
    ctx.fillStyle = '#FFC93C'; ctx.beginPath(); ctx.arc(fx, fy, 1.2, 0, 7); ctx.fill();
  }
}
function adoquin(ctx, sx, sy, x, y){
  ctx.strokeStyle = 'rgba(34,48,74,.12)'; ctx.lineWidth = 1.5;
  const o = (y % 2) * 8;
  ctx.beginPath(); ctx.moveTo(sx, sy + 16); ctx.lineTo(sx + TS, sy + 16);
  ctx.moveTo(sx + o, sy); ctx.lineTo(sx + o, sy + 16); ctx.moveTo(sx + 16 + o, sy); ctx.lineTo(sx + 16 + o, sy + 16);
  ctx.moveTo(sx + 8 - o, sy + 16); ctx.lineTo(sx + 8 - o, sy + TS); ctx.moveTo(sx + 24 - o, sy + 16); ctx.lineTo(sx + 24 - o, sy + TS);
  ctx.stroke();
}
function agua(ctx, sx, sy, x, y, t){
  ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 2;
  const o = Math.sin(t / 600 + x + y * .5) * 3;
  ctx.beginPath(); ctx.moveTo(sx + 4 + o, sy + 10); ctx.quadraticCurveTo(sx + 9 + o, sy + 6, sx + 14 + o, sy + 10); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(sx + 16 - o, sy + 22); ctx.quadraticCurveTo(sx + 21 - o, sy + 18, sx + 26 - o, sy + 22); ctx.stroke();
}
function lava(ctx, sx, sy, x, y, t){
  const p = (Math.sin(t / 400 + x * 1.3 + y) + 1) / 2;
  ctx.fillStyle = `rgba(255,${180 + p * 60 | 0},60,.7)`;
  ctx.beginPath(); ctx.arc(sx + 10 + hashXY(x, y) * 12, sy + 12 + hashXY(y, x) * 8, 3 + p * 3, 0, 7); ctx.fill();
}
function puente(ctx, sx, sy){
  ctx.fillStyle = '#B5835A'; ctx.fillRect(sx, sy + 3, TS, TS - 6);
  ctx.strokeStyle = '#7E5434'; ctx.lineWidth = 2;
  for(let i = 0; i <= TS; i += 8){ ctx.beginPath(); ctx.moveTo(sx + i, sy + 3); ctx.lineTo(sx + i, sy + TS - 3); ctx.stroke(); }
  ctx.strokeStyle = '#22304A'; ctx.strokeRect(sx, sy + 3, TS, TS - 6);
}
function flecha(ctx, sx, sy, x, y, M, t){
  const dir = y === 0 ? 'up' : y === M.h - 1 ? 'down' : x === 0 ? 'left' : 'right';
  const b = Math.sin(t / 250) * 2;
  ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.strokeStyle = '#22304A'; ctx.lineWidth = 2;
  ctx.save(); ctx.translate(sx + 16, sy + 16);
  ctx.rotate({up: 0, right: Math.PI / 2, down: Math.PI, left: -Math.PI / 2}[dir]);
  ctx.beginPath(); ctx.moveTo(0, -9 + b); ctx.lineTo(8, 2 + b); ctx.lineTo(-8, 2 + b); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function arbol(ctx, sx, sy, x, y, M){
  const tipo = M.tema.arbol;
  ctx.fillStyle = 'rgba(34,48,74,.18)'; ctx.beginPath(); ctx.ellipse(sx + 16, sy + 28, 12, 4, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = '#22304A'; ctx.lineWidth = 2.5;
  if(tipo === 'cardon'){
    ctx.fillStyle = '#5BAE5B';
    ctx.beginPath(); ctx.roundRect ? ctx.roundRect(sx + 11, sy - 4, 10, 32, 5) : ctx.rect(sx + 11, sy - 4, 10, 32); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.roundRect ? ctx.roundRect(sx + 3, sy + 6, 7, 12, 3.5) : ctx.rect(sx + 3, sy + 6, 7, 12); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.roundRect ? ctx.roundRect(sx + 22, sy + 2, 7, 12, 3.5) : ctx.rect(sx + 22, sy + 2, 7, 12); ctx.fill(); ctx.stroke();
    return;
  }
  if(tipo === 'seco'){
    ctx.strokeStyle = '#3B2A22'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(sx + 16, sy + 28); ctx.lineTo(sx + 16, sy + 4); ctx.moveTo(sx + 16, sy + 14); ctx.lineTo(sx + 6, sy + 4);
    ctx.moveTo(sx + 16, sy + 10); ctx.lineTo(sx + 26, sy + 2); ctx.stroke();
    return;
  }
  ctx.fillStyle = '#8A5A35'; ctx.fillRect(sx + 13, sy + 16, 6, 12); ctx.strokeRect(sx + 13, sy + 16, 6, 12);
  if(tipo === 'pino'){
    ctx.fillStyle = '#2F7A4E';
    ctx.beginPath(); ctx.moveTo(sx + 16, sy - 10); ctx.lineTo(sx + 30, sy + 18); ctx.lineTo(sx + 2, sy + 18); ctx.closePath(); ctx.fill(); ctx.stroke();
    return;
  }
  const ceibo = M.id === 'ceibo' && zonaEn(M, x, y) === 'bosque';
  ctx.fillStyle = ceibo ? '#3F8F4A' : tipo === 'sauce' ? '#6CBF6A' : '#4FAE56';
  ctx.beginPath(); ctx.arc(sx + 16, sy + 8, 15, 0, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.beginPath(); ctx.arc(sx + 10, sy + 3, 5, 0, 7); ctx.fill();
  if(ceibo){
    ctx.fillStyle = '#E63B4B';
    for(let i = 0; i < 4; i++){ ctx.beginPath(); ctx.arc(sx + 6 + hashXY(x + i, y) * 20, sy - 2 + hashXY(x, y + i) * 18, 2.6, 0, 7); ctx.fill(); }
  }
}
function roca(ctx, sx, sy, x, y, M){
  ctx.fillStyle = 'rgba(34,48,74,.18)'; ctx.beginPath(); ctx.ellipse(sx + 16, sy + 27, 13, 4, 0, 0, 7); ctx.fill();
  const osc = M.id === 'fogon';
  ctx.fillStyle = osc ? (hashXY(x, y) < .5 ? '#4A3E3A' : '#5A4C46') : (hashXY(x, y) < .5 ? '#A3A9B3' : '#959CA7');
  ctx.strokeStyle = '#22304A'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(sx + 4, sy + 26); ctx.lineTo(sx + 8, sy + 10); ctx.lineTo(sx + 18, sy + 4); ctx.lineTo(sx + 28, sy + 14); ctx.lineTo(sx + 28, sy + 26); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.beginPath(); ctx.moveTo(sx + 10, sy + 12); ctx.lineTo(sx + 17, sy + 8); ctx.stroke();
}
const COLOR_EDIF = {mia:'#E2574C', posada:'#FF7FA3', almacen:'#3B82D6'};
function edificioDe(M, x, y){ return M.edificios.find(e => x >= e.x && x < e.x + e.ancho && (y === e.y || y === e.y + 1)); }
function edificioTile(ctx, sx, sy, x, y, c, M){
  const e = edificioDe(M, x, y) || {tipo:'casa', color:'#6BAF5B', x, ancho:1, y};
  const gym = e.tipo === 'gimnasio';
  if(c === 'R'){
    ctx.fillStyle = e.color || COLOR_EDIF[e.tipo] || '#6BAF5B';
    ctx.fillRect(sx, sy + 4, TS + 1, TS - 4);
    ctx.strokeStyle = 'rgba(0,0,0,.18)'; ctx.lineWidth = 2;
    for(let i = 8; i < TS; i += 8){ ctx.beginPath(); ctx.moveTo(sx, sy + 4 + i); ctx.lineTo(sx + TS, sy + 4 + i); ctx.stroke(); }
    ctx.strokeStyle = '#22304A'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(sx, sy + 4); ctx.lineTo(sx + TS, sy + 4); ctx.stroke();
    if(x === e.x){ ctx.beginPath(); ctx.moveTo(sx, sy + 4); ctx.lineTo(sx, sy + TS); ctx.stroke(); }
    if(x === e.x + e.ancho - 1){ ctx.beginPath(); ctx.moveTo(sx + TS, sy + 4); ctx.lineTo(sx + TS, sy + TS); ctx.stroke(); }
  } else {
    ctx.fillStyle = gym ? '#F1ECE4' : '#FFF4E0'; ctx.fillRect(sx, sy, TS + 1, TS - 2);
    ctx.strokeStyle = '#22304A'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(sx, sy + TS - 2); ctx.lineTo(sx + TS, sy + TS - 2); ctx.stroke();
    if(x === e.x){ ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx, sy + TS - 2); ctx.stroke(); }
    if(x === e.x + e.ancho - 1){ ctx.beginPath(); ctx.moveTo(sx + TS, sy); ctx.lineTo(sx + TS, sy + TS - 2); ctx.stroke(); }
    if(c === 'D'){
      ctx.fillStyle = gym ? '#22304A' : '#8A5A35'; ctx.fillRect(sx + 8, sy + 6, 16, TS - 8); ctx.strokeRect(sx + 8, sy + 6, 16, TS - 8);
      ctx.fillStyle = '#FFC93C'; ctx.beginPath(); ctx.arc(sx + 20, sy + 19, 1.8, 0, 7); ctx.fill();
    } else if((x + y) % 2 === 0){
      ctx.fillStyle = '#9FD9F2'; ctx.fillRect(sx + 8, sy + 8, 16, 12); ctx.strokeRect(sx + 8, sy + 8, 16, 12);
    }
  }
}
function cartelEdificio(ctx, e, camX, camY){
  const textos = {posada:'POSADA', almacen:'ALMACÉN', gimnasio:'GIMNASIO'};
  const t = textos[e.tipo]; if(!t) return;
  const cx = (e.x + e.ancho / 2) * TS - camX, cy = e.y * TS - camY + 18;
  if(cx < -80 || cx > MW.vw + 80 || cy < -40 || cy > MW.vh + 40) return;
  ctx.font = '800 10px Nunito, sans-serif'; ctx.textAlign = 'center';
  const w = ctx.measureText(t).width + 12;
  ctx.fillStyle = '#FFFDF8'; ctx.strokeStyle = '#22304A'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect ? ctx.roundRect(cx - w / 2, cy - 9, w, 15, 4) : ctx.rect(cx - w / 2, cy - 9, w, 15); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#22304A'; ctx.fillText(t, cx, cy + 2);
  if(e.tipo === 'gimnasio'){
    ctx.fillStyle = TIPOS[e.tipoGym].color; ctx.beginPath(); ctx.arc(cx, cy - 18, 8, 0, 7); ctx.fill(); ctx.stroke();
  }
}
function persona(ctx, cx, piso, n, t){
  const bob = Math.sin(t / 500 + n.x) * .8;
  ctx.fillStyle = 'rgba(34,48,74,.2)'; ctx.beginPath(); ctx.ellipse(cx, piso - 3, 10, 3.5, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = '#22304A'; ctx.lineWidth = 2.2;
  ctx.fillStyle = n.ropa || '#4F86C6';
  ctx.beginPath(); ctx.roundRect ? ctx.roundRect(cx - 8, piso - 20 + bob, 16, 16, 6) : ctx.rect(cx - 8, piso - 20 + bob, 16, 16); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#F5CDA7'; ctx.beginPath(); ctx.arc(cx, piso - 26 + bob, 8, 0, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = n.pelo || '#3B2A22'; ctx.beginPath(); ctx.arc(cx, piso - 28 + bob, 8, Math.PI, 0); ctx.fill();
  if(n.tipo === 'guardia'){ ctx.fillStyle = '#2F4A7A'; ctx.fillRect(cx - 9, piso - 36 + bob, 18, 5); ctx.strokeRect(cx - 9, piso - 36 + bob, 18, 5); }
  ctx.fillStyle = '#22304A'; ctx.beginPath(); ctx.arc(cx - 3, piso - 25 + bob, 1.3, 0, 7); ctx.arc(cx + 3, piso - 25 + bob, 1.3, 0, 7); ctx.fill();
  if(n.tipo === 'entrenador' && !S.vencidos[n.id]){
    ctx.fillStyle = '#FFC93C'; ctx.beginPath(); ctx.arc(cx + 10, piso - 36 + bob, 4, 0, 7); ctx.fill(); ctx.stroke();
  }
}
function etiqueta(ctx, texto, cx, y, fondo){
  ctx.font = '800 11px Nunito, sans-serif'; ctx.textAlign = 'center';
  const w = ctx.measureText(texto).width + 10;
  ctx.fillStyle = fondo || 'rgba(34,48,74,.8)';
  ctx.beginPath(); ctx.roundRect ? ctx.roundRect(cx - w / 2, y, w, 15, 7) : ctx.rect(cx - w / 2, y, w, 15); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.fillText(texto, cx, y + 11);
}
function jugador(ctx, cx, piso, t){
  const moviendo = !!MW.hacia, salto = moviendo ? Math.abs(Math.sin(MW.t * Math.PI)) * 4 : Math.sin(t / 400) * 1;
  const tam = 44;
  ctx.fillStyle = 'rgba(34,48,74,.2)'; ctx.beginPath(); ctx.ellipse(cx, piso - 3, 13, 4, 0, 0, 7); ctx.fill();
  ctx.save();
  ctx.translate(cx, piso - salto);
  if(MW.dir < 0) ctx.scale(-1, 1);
  if(MW.img.complete) ctx.drawImage(MW.img, -tam / 2, -tam + 2, tam, tam);
  ctx.restore();
  etiqueta(ctx, apodo || S.nombre, cx, piso - tam - 16 - salto);
}
