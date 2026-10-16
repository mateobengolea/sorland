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
  MW.sprites = spritesEntrenador(S.entrenador); MW.mira = S.mundo.mira || 'abajo'; MW.paso = false;
  MW.seg = {x: S.mundo.x, y: Math.min(M.h - 2, S.mundo.y + 1)}; MW.segDesde = {...MW.seg};
  if(!transitable(M, MW.seg.x, MW.seg.y)){ MW.seg = {...MW.pos}; MW.segDesde = {...MW.pos}; }
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
      S.mundo = {mapa: M.id, x: MW.pos.x, y: MW.pos.y, mira: MW.mira};
      if(typeof alMoverme === 'function') alMoverme();
      if(alLlegar()) return;
    }
  }
  if(!MW.hacia && !MW.ocupado && !$('#velo')){
    const d = [...MW.teclas].pop();
    if(d){
      const [dx, dy] = DIRS[d];
      if(dx) MW.dir = dx;
      MW.mira = {up: 'arriba', down: 'abajo', left: 'izq', right: 'der'}[d];
      const nx = MW.pos.x + dx, ny = MW.pos.y + dy;
      if(transitable(M, nx, ny)){ MW.desde = {...MW.pos}; MW.hacia = {x: nx, y: ny}; MW.t = 0; MW.segDesde = {...MW.seg}; MW.seg = {...MW.pos}; MW.paso = !MW.paso; }
      else {
        const n = npcEn(M, nx, ny);
        if(n){ MW.teclas.clear(); hablarCon(n); }
        else if(M.altares[nx + ',' + ny]){ MW.teclas.clear(); visitarAltar(M.altares[nx + ',' + ny]); }
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
  // Objetos en el piso
  const it = itemEn(M, x, y);
  if(it){
    S.recogidos[it.id] = true;
    const txt = darPremio(premioAleatorio());
    guardar();
    MW.teclas.clear();
    dialogo('¡Encontraste algo!', [`En el piso había ${txt}.`]);
    return false;
  }
  // Puertas
  if(c === 'D'){
    const acc = M.puertas[x + ',' + y];
    MW.teclas.clear();
    // Al entrar por una puerta volvés al casillero de abajo para no quedar adentro.
    const afuera = {x, y: y + 1};
    if(acc && acc.interior){
      S.mundo = {mapa: acc.interior, x: 5, y: 7};
      salirDelMundo(); guardar(); pintarMundo();
      return true;
    }
    if(acc === 'casa'){
      S.mundo = {mapa: M.id, ...afuera};
      salirDelMundo(); guardar(); pintarJuego();
      avisar('Volviste a casa. Tu equipo descansó y está como nuevo.');
      return true;
    }
    MW.pos = afuera; S.mundo = {mapa: M.id, ...afuera};
    if(acc === 'centro'){
      curarEquipo();
      S.respawn = {mapa: M.id, ...afuera};
      guardar();
      dialogo('Enfermera Clara', ['¡Bienvenido al Centro de Rehabilitación! Dejame a tus criaturas un ratito...', 'Listo: tu equipo está como nuevo. Si te va mal en una pelea, volvés a este centro.']);
      return false;
    }
    if(acc === 'market'){ pestana.tienda = 'aventura'; abrirHoja('tienda'); return false; }
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
      if(!hayLuchadorEnPie()){ avisar('Tu equipo está agotado. Andá a un Centro de Rehabilitación o a tu casa.'); return false; }
      MW.teclas.clear();
      const salvaje = crearSalvaje(z);
      salirDelMundo(); guardar();
      empezarCombate([salvaje], z, null);
      return true;
    }
  }
  return false;
}

const OPUESTA = {arriba: 'abajo', abajo: 'arriba', izq: 'der', der: 'izq'};
async function hablarCon(n){
  if(!MW || MW.ocupado) return;
  const dx = MW.pos.x - n.x, dy = MW.pos.y - n.y;
  n.mira = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'der' : 'izq') : (dy > 0 ? 'abajo' : 'arriba');
  MW.mira = OPUESTA[n.mira];
  if(n.tipo === 'vecino'){
    if(n.regalo && !S.regalos[n.id]){
      await dialogo(n.nombre, n.frases);
      S.regalos[n.id] = true;
      const txt = darPremio(premioAleatorio(true)); guardar();
      await dialogo('¡Regalo!', [`${n.nombre} te dio ${txt}.`]);
      return;
    }
    await dialogo(n.nombre, n.regalo ? [n.frases[0], '¡Volvé cuando quieras!'] : n.frases); return;
  }
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
  if(!hayLuchadorEnPie()){ await dialogo(`${L.titulo} ${L.nombre}`, ['Tu equipo está agotado. Pasá por el Centro de Rehabilitación y volvé.']); return; }
  await dialogo(`${L.titulo} ${L.nombre}`, L.antes);
  lanzarPeleaEntrenador({...L, lider: true}, M.zonas[0][0]);
}
function lanzarPeleaEntrenador(n, zona){
  const mult = n.lider ? .95 : .8;
  const rivales = n.equipo.map(([esp, nivel]) => {
    const sp = ESPECIES[esp], stats = statsPorNivel(sp.base, nivel);
    return {esp, nombre: sp.nombre, nivel, stats, hp: vidaMax(stats, nivel), tipo: sp.tipo, mult};
  });
  salirDelMundo(); guardar();
  empezarCombate(rivales, zona, n);
}

/* ---------------- Premios y altares ---------------- */
function premioAleatorio(generoso){
  const r = Math.random() * (generoso ? .85 : 1) + (generoso ? .15 : 0);
  if(r < .32) return {obj: 'capsula', n: 3};
  if(r < .55) return {obj: 'jarabe', n: 2};
  if(r < .7) return {obj: 'supercapsula', n: 2};
  if(r < .82) return {obj: 'jarabemax', n: 1};
  if(r < .89) return {obj: 'ultracapsula', n: 1};
  if(r < .94) return {obj: 'jarabetotal', n: 1};
  if(r < .97) return {mueble: PELUCHES[Math.floor(Math.random() * PELUCHES.length)]};
  return {monedas: 150 + Math.floor(Math.random() * 250)};
}
function darPremio(p){
  if(p.obj){
    S.inv.objetos[p.obj] = (S.inv.objetos[p.obj] || 0) + p.n;
    const o = POR_ID[p.obj], plural = {capsula: 'cápsulas', supercapsula: 'súper cápsulas', jarabe: 'jarabes', jarabemax: 'jarabes grandes'};
    return p.n > 1 ? `${p.n} ${plural[p.obj] || o.nom}` : `${/jarabe/.test(p.obj) ? 'un' : 'una'} ${o.nom}`;
  }
  if(p.mueble){ const id = 'peluche_' + p.mueble; S.inv.muebles[id] = (S.inv.muebles[id] || 0) + 1; return `un ${POR_ID[id].nom} para tu casa`; }
  ganar(p.monedas); return `${p.monedas} monedas`;
}
async function visitarAltar(id){
  const L = ESPECIES[id], estado = S.legendarios[id];
  if(estado && estado.capturada){ await dialogo('Altar antiguo', ['El altar está en silencio. Ya no hay nada acá.']); return; }
  if(cantMedallas() < 4){ await dialogo('Altar antiguo', ['Un altar de piedra muy viejo. Se siente una energía rara...', 'Hay una inscripción: «Solo quien tenga las cuatro medallas será escuchado».']); return; }
  if(estado && estado.proxima > Date.now()){
    const h = Math.ceil((estado.proxima - Date.now()) / 3600000);
    await dialogo('Altar antiguo', ['El altar está frío. Lo que vivía acá se fue por un tiempo.', `Volvé en unas ${h} hora${h > 1 ? 's' : ''}.`]); return;
  }
  if(!hayLuchadorEnPie()){ await dialogo('Altar antiguo', ['Algo se mueve detrás del altar... pero tu equipo está agotado. Mejor volvé descansado.']); return; }
  await dialogo('Altar antiguo', ['Apoyás las cuatro medallas sobre la piedra...', 'El aire tiembla. ¡Algo enorme se acerca!']);
  const stats = statsPorNivel(L.base, 40);
  const rival = {esp: id, nombre: L.nombre, nivel: 40, stats, hp: vidaMax(stats, 40), tipo: L.tipo, mult: 1, shiny: Math.random() < PROB_SHINY};
  salirDelMundo(); guardar();
  empezarCombate([rival], zonaEn(mapaActual(), S.mundo.x, S.mundo.y), null);
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
    case 'W': return '#C9B08E';
    case 'p': case 'm': case 'x': return (x + y) % 2 ? '#E2C29A' : '#DDBB91';
    case 'A': return M.base === 's' ? t.tierra : M.id === 'camalote' ? '#5AB4E8' : t.pasto;
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
    if(c === '.' || c === 'f' || c === 'v' || c === 's' || c === 'T' || c === '#') detalleSuelo(ctx, M, c, sx, sy, x, y);
    if(c === ',') pastoAlto(ctx, sx, sy, x, y, ahora, M.tema.brizna);
    if(c === 'f') flores(ctx, sx, sy, x, y);
    if(c === '~' || c === 'b') agua(ctx, sx, sy, x, y, ahora);
    if(c === 'b') puente(ctx, sx, sy);
    if(c === ':') adoquin(ctx, sx, sy, x, y);
    if(c === '!') lava(ctx, sx, sy, x, y, ahora);
    if(c === '=') camino(ctx, M, sx, sy, x, y);
    if(c === '~') orilla(ctx, M, sx, sy, x, y, ahora);
    if(c === 'W') pared(ctx, sx, sy, x, y, M);
    if(c === 'x'){ ctx.fillStyle = '#B5452B'; ctx.fillRect(sx + 4, sy + 6, TS - 8, TS - 12); }
    if(M.salidas[x + ',' + y] && c !== 'x') flecha(ctx, sx, sy, x, y, M, ahora);
  }
  for(const mb of M.muebles) if(mb.tipo === 'alfombra'){ ctx.fillStyle = '#E2574C'; ctx.fillRect(mb.x * TS - camX - 12, mb.y * TS - camY + 4, TS * 2, TS - 8); ctx.strokeStyle = '#FFD23F'; ctx.lineWidth = 2; ctx.strokeRect(mb.x * TS - camX - 8, mb.y * TS - camY + 8, TS * 2 - 8, TS - 16); }
  for(const e of M.edificios){ ctx.fillStyle = 'rgba(34,48,74,.16)'; ctx.fillRect(e.x * TS - camX + 4, (e.y + 2) * TS - camY, e.ancho * TS, 8); }
  for(const it of M.items) if(!S.recogidos[it.id]) brilloItem(ctx, it.x * TS - camX, it.y * TS - camY, ahora);
  const otros = typeof jugadoresVisibles === 'function' ? jugadoresVisibles() : [];
  for(let y = y0; y <= y1; y++){
    for(let x = x0; x <= x1; x++){
      const c = M.m[y][x], sx = Math.round(x * TS - camX), sy = Math.round(y * TS - camY);
      if(c === '#') roca(ctx, sx, sy, x, y, M);
      if(c === 'R' || c === 'H' || c === 'D') edificioTile(ctx, sx, sy, x, y, c, M);
      if(c === 'A') altar(ctx, sx, sy, x, y, ahora, M);
    }
    for(const mb of M.muebles) if(mb.y === y && mb.tipo !== 'alfombra') muebleInterior(ctx, mb.x * TS - camX, mb.y * TS - camY, mb.tipo);
    if(MW.seg && y === Math.floor(segY() + .5)) seguidor(ctx, ahora, camX, camY);
    for(let x = x0; x <= x1; x++) if(M.m[y][x] === 'T') arbol(ctx, Math.round(x * TS - camX), Math.round(y * TS - camY), x, y, M);
    for(const n of M.npcs) if(n.y === y && !(n.tipo === 'guardia' && guardiaAbierto(n))) persona(ctx, (n.x + .5) * TS - camX, (n.y + 1) * TS - camY, n, ahora);
    for(const o of otros) if(Math.floor(o.py + .5) === y) otroJugador(ctx, (o.px + .5) * TS - camX, (o.py + 1) * TS - camY, o, ahora);
    if(y === Math.floor(py + .5)) jugador(ctx, (px + .5) * TS - camX, (py + 1) * TS - camY, ahora);
  }
  for(const e of M.edificios) cartelEdificio(ctx, e, camX, camY);
  if(M.tema.tinte){ ctx.fillStyle = M.tema.tinte; ctx.fillRect(0, 0, vw, vh); }
  // Luz cálida arriba y viñeta suave en los bordes
  const luz = ctx.createLinearGradient(0, 0, 0, vh);
  luz.addColorStop(0, M.tema.interior ? 'rgba(255,230,180,.10)' : 'rgba(255,248,220,.14)'); luz.addColorStop(.5, 'rgba(255,255,255,0)');
  ctx.fillStyle = luz; ctx.fillRect(0, 0, vw, vh);
  if(!MW.vigneta || MW.vigneta.w !== vw || MW.vigneta.h !== vh){
    const g = ctx.createRadialGradient(vw / 2, vh / 2, Math.min(vw, vh) * .45, vw / 2, vh / 2, Math.max(vw, vh) * .75);
    g.addColorStop(0, 'rgba(20,30,50,0)'); g.addColorStop(1, 'rgba(20,30,50,.28)');
    MW.vigneta = {w: vw, h: vh, g};
  }
  ctx.fillStyle = MW.vigneta.g; ctx.fillRect(0, 0, vw, vh);
  if(MW.alerta && MW.alerta.hasta > ahora){
    const n = MW.alerta.n, ax = (n.x + .5) * TS - camX, ay = n.y * TS - camY - 26;
    ctx.fillStyle = '#fff'; ctx.strokeStyle = '#22304A'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(ax, ay, 11, 0, 7); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#E2492E'; ctx.font = '800 16px "Baloo 2", sans-serif'; ctx.textAlign = 'center'; ctx.fillText('!', ax, ay + 6);
  }
}

function pastoAlto(ctx, sx, sy, x, y, t, color){
  const mov = Math.sin(t / 520 + x * .7 + y) * 1.8;
  ctx.fillStyle = 'rgba(0,0,0,.08)'; ctx.fillRect(sx, sy + TS - 6, TS, 6);
  for(let fila = 0; fila < 3; fila++){
    const by = sy + 12 + fila * 9, osc = fila % 2 === 0;
    for(let i = 0; i < 4; i++){
      const bx = sx + 3 + i * 8 + hashXY(x * 5 + i, y * 3 + fila) * 3 + (fila % 2) * 3;
      const alto = 9 + hashXY(x + i, y + fila) * 5;
      ctx.fillStyle = osc ? color : aclarar(color, .22);
      ctx.beginPath(); ctx.moveTo(bx - 3, by); ctx.quadraticCurveTo(bx - 1 + mov, by - alto * .6, bx + mov * 1.2, by - alto); ctx.quadraticCurveTo(bx + 1 + mov, by - alto * .5, bx + 3, by); ctx.closePath(); ctx.fill();
    }
  }
}
function aclarar(hex, k){
  const n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const f = v => Math.round(k > 0 ? v + (255 - v) * k : v * (1 + k));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}
function detalleSuelo(ctx, M, c, sx, sy, x, y){
  const h = hashXY(x, y);
  if(h < .25){ ctx.fillStyle = 'rgba(255,255,255,.07)'; ctx.fillRect(sx, sy, TS, TS); }
  else if(h > .8){ ctx.fillStyle = 'rgba(0,0,0,.04)'; ctx.fillRect(sx, sy, TS, TS); }
  if(M.tema.interior) return;
  const tierra = c === 's' || (M.base === 's' && (c === 'T' || c === '#'));
  ctx.strokeStyle = tierra ? 'rgba(120,90,50,.28)' : 'rgba(40,100,50,.32)'; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
  const n = Math.floor(hashXY(y, x) * 3);
  for(let i = 0; i < n; i++){
    const tx = sx + 5 + hashXY(x * 3 + i, y) * 22, ty = sy + 8 + hashXY(x, y * 3 + i) * 18;
    if(tierra){ ctx.fillStyle = 'rgba(120,90,50,.25)'; ctx.beginPath(); ctx.arc(tx, ty, 1.6, 0, 7); ctx.fill(); }
    else { ctx.beginPath(); ctx.moveTo(tx - 2, ty + 3); ctx.lineTo(tx - 3, ty - 2); ctx.moveTo(tx, ty + 3); ctx.lineTo(tx + 1, ty - 3); ctx.moveTo(tx + 2, ty + 3); ctx.lineTo(tx + 4, ty - 1); ctx.stroke(); }
  }
}
const ES_CAMINO = new Set(['=', 'b', 'D', 'x', ':', 'A']);
function camino(ctx, M, sx, sy, x, y){
  const v = (dx, dy) => { const f = M.m[y + dy]; return !f || f[x + dx] === undefined || ES_CAMINO.has(f[x + dx]); };
  ctx.fillStyle = 'rgba(150,110,60,.22)';
  if(!v(0, -1)) ctx.fillRect(sx, sy, TS, 3);
  if(!v(0, 1)) ctx.fillRect(sx, sy + TS - 3, TS, 3);
  if(!v(-1, 0)) ctx.fillRect(sx, sy, 3, TS);
  if(!v(1, 0)) ctx.fillRect(sx + TS - 3, sy, 3, TS);
  for(let i = 0; i < 2; i++){
    if(hashXY(x * 7 + i, y) < .5) continue;
    ctx.fillStyle = 'rgba(140,105,60,.35)';
    ctx.beginPath(); ctx.ellipse(sx + 6 + hashXY(x, y + i) * 20, sy + 6 + hashXY(x + i, y) * 20, 2.4, 1.6, 0, 0, 7); ctx.fill();
  }
}
function orilla(ctx, M, sx, sy, x, y, t){
  const tierra = (dx, dy) => { const f = M.m[y + dy]; const c = f && f[x + dx]; return c !== undefined && c !== '~' && c !== 'b' && c !== 'A'; };
  const o = Math.sin(t / 500 + x + y) * 1.5;
  ctx.fillStyle = 'rgba(255,255,255,.55)';
  if(tierra(0, -1)) ctx.fillRect(sx, sy, TS, 4 + o);
  if(tierra(0, 1)) ctx.fillRect(sx, sy + TS - 4 - o, TS, 4 + o);
  if(tierra(-1, 0)) ctx.fillRect(sx, sy, 4 + o, TS);
  if(tierra(1, 0)) ctx.fillRect(sx + TS - 4 - o, sy, 4 + o, TS);
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
  const g = ctx.createLinearGradient(sx, sy, sx, sy + TS);
  g.addColorStop(0, '#62B9EC'); g.addColorStop(1, '#4A9FD8');
  ctx.fillStyle = g; ctx.fillRect(sx, sy, TS + 1, TS + 1);
  ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 2; ctx.lineCap = 'round';
  const o = Math.sin(t / 600 + x + y * .5) * 3;
  ctx.beginPath(); ctx.moveTo(sx + 4 + o, sy + 10); ctx.quadraticCurveTo(sx + 9 + o, sy + 6, sx + 14 + o, sy + 10); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(sx + 16 - o, sy + 22); ctx.quadraticCurveTo(sx + 21 - o, sy + 18, sx + 26 - o, sy + 22); ctx.stroke();
  const brillo = (Math.sin(t / 350 + x * 2.3 + y * 1.7) + 1) / 2;
  if(brillo > .85){ ctx.fillStyle = `rgba(255,255,255,${(brillo - .85) * 5})`; ctx.beginPath(); ctx.arc(sx + 8 + hashXY(x, y) * 16, sy + 14, 1.8, 0, 7); ctx.fill(); }
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
  const tipo = M.tema.arbol, T = '#22304A';
  ctx.fillStyle = 'rgba(20,40,30,.22)'; ctx.beginPath(); ctx.ellipse(sx + 18, sy + 28, 14, 5, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = T; ctx.lineWidth = 2.5; ctx.lineJoin = 'round';
  const rr = (x0, y0, w, h, r) => { ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x0, y0, w, h, r) : ctx.rect(x0, y0, w, h); };
  if(tipo === 'cardon'){
    ctx.fillStyle = '#5BAE5B';
    rr(sx + 11, sy - 6, 10, 34, 5); ctx.fill(); ctx.stroke();
    rr(sx + 3, sy + 4, 7, 13, 3.5); ctx.fill(); ctx.stroke();
    rr(sx + 22, sy, 7, 13, 3.5); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(30,80,40,.5)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(sx + 16, sy - 2); ctx.lineTo(sx + 16, sy + 26); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.fillRect(sx + 13, sy - 2, 2, 24);
    if(hashXY(x, y) < .3){ ctx.fillStyle = '#FF7FA3'; ctx.beginPath(); ctx.arc(sx + 16, sy - 6, 3, 0, 7); ctx.fill(); }
    return;
  }
  if(tipo === 'seco'){
    ctx.strokeStyle = '#3B2A22'; ctx.lineWidth = 4.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(sx + 16, sy + 28); ctx.lineTo(sx + 16, sy + 4); ctx.moveTo(sx + 16, sy + 14); ctx.lineTo(sx + 6, sy + 4); ctx.moveTo(sx + 16, sy + 10); ctx.lineTo(sx + 26, sy + 2); ctx.moveTo(sx + 9, sy + 7); ctx.lineTo(sx + 5, sy + 8); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,140,60,.35)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(sx + 17, sy + 26); ctx.lineTo(sx + 17, sy + 6); ctx.stroke();
    return;
  }
  // tronco
  ctx.fillStyle = '#8A5A35'; rr(sx + 12, sy + 14, 8, 15, 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.fillRect(sx + 16, sy + 16, 3, 12);
  if(tipo === 'pino'){
    const capas = [[sy + 20, 15, '#2A6E46'], [sy + 9, 12, '#2F7A4E'], [sy - 1, 9, '#3B8C5A']];
    for(const [base, ancho, col] of capas){
      ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(sx + 16, base - 16); ctx.lineTo(sx + 16 + ancho, base); ctx.lineTo(sx + 16 - ancho, base); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.15)'; ctx.beginPath(); ctx.moveTo(sx + 16, base - 14); ctx.lineTo(sx + 16 - ancho * .7, base - 1); ctx.lineTo(sx + 13, base - 1); ctx.closePath(); ctx.fill();
    }
    if(M.tema.tinte && hashXY(x, y) < .5){ ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.beginPath(); ctx.moveTo(sx + 16, sy - 17); ctx.lineTo(sx + 21, sy - 9); ctx.lineTo(sx + 11, sy - 9); ctx.closePath(); ctx.fill(); }
    return;
  }
  const ceibo = M.id === 'ceibo' && zonaEn(M, x, y) === 'bosque';
  const base = ceibo ? '#3F8F4A' : tipo === 'sauce' ? '#5FB862' : '#4FAE56';
  // copa: tres bollos con luz de arriba a la izquierda
  ctx.fillStyle = base;
  ctx.beginPath(); ctx.arc(sx + 9, sy + 10, 10, 0, 7); ctx.arc(sx + 23, sy + 10, 10, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(sx + 16, sy + 2, 12, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(sx + 9, sy + 10, 10, Math.PI * .55, Math.PI * 1.45); ctx.stroke();
  ctx.beginPath(); ctx.arc(sx + 23, sy + 10, 10, -Math.PI * .45, Math.PI * .45); ctx.stroke();
  ctx.beginPath(); ctx.arc(sx + 16, sy + 2, 12, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(sx + 1, sy + 14); ctx.quadraticCurveTo(sx + 16, sy + 24, sx + 31, sy + 14); ctx.stroke();
  ctx.fillStyle = 'rgba(0,0,0,.14)'; ctx.beginPath(); ctx.ellipse(sx + 18, sy + 15, 11, 5, 0, 0, 7); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.beginPath(); ctx.arc(sx + 11, sy - 2, 5, 0, 7); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.beginPath(); ctx.arc(sx + 7, sy + 7, 4, 0, 7); ctx.fill();
  if(ceibo){
    ctx.fillStyle = '#E63B4B';
    for(let i = 0; i < 5; i++){ ctx.beginPath(); ctx.arc(sx + 5 + hashXY(x + i, y) * 22, sy - 6 + hashXY(x, y + i) * 20, 2.6, 0, 7); ctx.fill(); }
  }
}

function roca(ctx, sx, sy, x, y, M){
  ctx.fillStyle = 'rgba(20,30,40,.22)'; ctx.beginPath(); ctx.ellipse(sx + 17, sy + 27, 14, 4.5, 0, 0, 7); ctx.fill();
  const osc = M.id === 'fogon', h = hashXY(x, y);
  const base = osc ? '#4E423D' : '#9AA2AD', luz = osc ? '#6A5A52' : '#BCC3CC', sombra = osc ? '#3A302C' : '#7C8592';
  ctx.strokeStyle = '#22304A'; ctx.lineWidth = 2.5; ctx.lineJoin = 'round';
  ctx.fillStyle = base;
  ctx.beginPath(); ctx.moveTo(sx + 3, sy + 26); ctx.lineTo(sx + 6, sy + 12); ctx.lineTo(sx + 15, sy + 4 + h * 3); ctx.lineTo(sx + 25, sy + 8); ctx.lineTo(sx + 29, sy + 18); ctx.lineTo(sx + 28, sy + 26); ctx.closePath(); ctx.fill();
  ctx.fillStyle = luz; ctx.beginPath(); ctx.moveTo(sx + 6, sy + 12); ctx.lineTo(sx + 15, sy + 4 + h * 3); ctx.lineTo(sx + 17, sy + 14); ctx.lineTo(sx + 8, sy + 19); ctx.closePath(); ctx.fill();
  ctx.fillStyle = sombra; ctx.beginPath(); ctx.moveTo(sx + 17, sy + 14); ctx.lineTo(sx + 29, sy + 18); ctx.lineTo(sx + 28, sy + 26); ctx.lineTo(sx + 16, sy + 26); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(sx + 3, sy + 26); ctx.lineTo(sx + 6, sy + 12); ctx.lineTo(sx + 15, sy + 4 + h * 3); ctx.lineTo(sx + 25, sy + 8); ctx.lineTo(sx + 29, sy + 18); ctx.lineTo(sx + 28, sy + 26); ctx.closePath(); ctx.stroke();
  if(!osc && h > .6){ ctx.fillStyle = '#79B95F'; ctx.beginPath(); ctx.ellipse(sx + 12, sy + 9, 5, 2.5, -.4, 0, 7); ctx.fill(); }
}

const COLOR_EDIF = {mia:'#E2574C', centro:'#FF7FA3', market:'#3B82D6'};
function edificioDe(M, x, y){ return M.edificios.find(e => x >= e.x && x < e.x + e.ancho && (y === e.y || y === e.y + 1)); }
function edificioTile(ctx, sx, sy, x, y, c, M){
  const e = edificioDe(M, x, y) || {tipo:'casa', color:'#6BAF5B', x, ancho:1, y};
  const gym = e.tipo === 'gimnasio', T = '#22304A';
  const primero = x === e.x, ultimo = x === e.x + e.ancho - 1;
  if(c === 'R'){
    const col = e.color || COLOR_EDIF[e.tipo] || '#6BAF5B';
    const g = ctx.createLinearGradient(0, sy, 0, sy + TS);
    g.addColorStop(0, aclarar(col, .18)); g.addColorStop(1, aclarar(col, -.12));
    ctx.fillStyle = g; ctx.fillRect(sx - (primero ? 3 : 0), sy + 2, TS + 1 + (primero ? 3 : 0) + (ultimo ? 3 : 0), TS - 2);
    // tejas
    ctx.strokeStyle = 'rgba(0,0,0,.16)'; ctx.lineWidth = 1.5;
    for(let i = 8; i < TS; i += 8){ ctx.beginPath(); ctx.moveTo(sx, sy + 2 + i); ctx.lineTo(sx + TS, sy + 2 + i); ctx.stroke(); }
    for(let i = 0; i < 4; i++){ const off = (i % 2) * 8; for(let k = off; k < TS; k += 16){ ctx.beginPath(); ctx.moveTo(sx + k, sy + 2 + i * 8); ctx.lineTo(sx + k, sy + 10 + i * 8); ctx.stroke(); } }
    ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fillRect(sx, sy + 2, TS + 1, 3);
    ctx.strokeStyle = T; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(sx - (primero ? 3 : 0), sy + 2); ctx.lineTo(sx + TS + (ultimo ? 3 : 0), sy + 2); ctx.stroke();
    if(primero){ ctx.beginPath(); ctx.moveTo(sx - 3, sy + 2); ctx.lineTo(sx - 3, sy + TS); ctx.stroke(); }
    if(ultimo){ ctx.beginPath(); ctx.moveTo(sx + TS + 3, sy + 2); ctx.lineTo(sx + TS + 3, sy + TS); ctx.stroke(); }
    if(x === e.x + e.ancho - 2 && !gym){ ctx.fillStyle = '#8A5A35'; ctx.fillRect(sx + 10, sy - 8, 9, 12); ctx.strokeRect(sx + 10, sy - 8, 9, 12); }
  } else {
    ctx.fillStyle = gym ? '#EFE9DF' : '#FFF4E0'; ctx.fillRect(sx, sy, TS + 1, TS - 2);
    ctx.fillStyle = 'rgba(0,0,0,.12)'; ctx.fillRect(sx, sy, TS + 1, 5);
    ctx.fillStyle = 'rgba(0,0,0,.06)'; ctx.fillRect(sx, sy + TS - 8, TS + 1, 6);
    ctx.strokeStyle = T; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(sx, sy + TS - 2); ctx.lineTo(sx + TS, sy + TS - 2); ctx.stroke();
    if(primero){ ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx, sy + TS - 2); ctx.stroke(); }
    if(ultimo){ ctx.beginPath(); ctx.moveTo(sx + TS, sy); ctx.lineTo(sx + TS, sy + TS - 2); ctx.stroke(); }
    if(c === 'D'){
      ctx.fillStyle = gym ? '#2E3A52' : '#8A5A35'; ctx.fillRect(sx + 8, sy + 6, 16, TS - 8); ctx.strokeRect(sx + 8, sy + 6, 16, TS - 8);
      ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(sx + 10, sy + 8, 4, TS - 12);
      ctx.fillStyle = '#FFC93C'; ctx.beginPath(); ctx.arc(sx + 20, sy + 19, 1.8, 0, 7); ctx.fill();
      ctx.fillStyle = '#B5A58E'; ctx.fillRect(sx + 5, sy + TS - 3, 22, 4);
    } else if((x + y) % 2 === 0){
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(sx + 6, sy + 7, 20, 15); ctx.strokeRect(sx + 6, sy + 7, 20, 15);
      ctx.fillStyle = '#8FD0F0'; ctx.fillRect(sx + 9, sy + 10, 14, 9);
      ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.beginPath(); ctx.moveTo(sx + 10, sy + 18); ctx.lineTo(sx + 15, sy + 11); ctx.lineTo(sx + 18, sy + 11); ctx.lineTo(sx + 13, sy + 18); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(34,48,74,.6)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(sx + 16, sy + 10); ctx.lineTo(sx + 16, sy + 19); ctx.stroke();
    }
  }
}

function cartelEdificio(ctx, e, camX, camY){
  const textos = {centro:'CENTRO', market:'MARKET', gimnasio:'GIMNASIO', mia:'TU CASA'};
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
const PEINADOS_NPC = ['corto', 'largo', 'colita', 'rulos', 'rapado'];
function aspectoNpc(n){
  if(!n._aspecto){
    const h = Math.floor(hashXY(n.x * 7 + 3, n.y * 13 + (n.nombre || '').length) * 1000);
    n._aspecto = {piel: n.piel || ASPECTO.piel[h % 4], pelo: n.pelo || '#3B2A22', peinado: n.peinado || PEINADOS_NPC[h % 5],
                  ropa: n.ropa || '#4F86C6', gorra: n.tipo === 'guardia' ? '#2F4A7A' : (n.gorra || (h % 3 === 0 ? ASPECTO.gorra[1 + h % 4] : 'ninguna'))};
  }
  return n._aspecto;
}
function persona(ctx, cx, piso, n, t){
  ctx.fillStyle = 'rgba(34,48,74,.22)'; ctx.beginPath(); ctx.ellipse(cx, piso - 3, 11, 4, 0, 0, 7); ctx.fill();
  dibujarEntrenador(ctx, spritesEntrenador(aspectoNpc(n)), cx, piso, n.mira || 'abajo', 0, 46);
  if(n.tipo === 'entrenador' && !S.vencidos[n.id]){
    const b = Math.sin(t / 300 + n.x) * 2;
    ctx.fillStyle = '#FFC93C'; ctx.strokeStyle = '#22304A'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx + 13, piso - 46 + b, 5, 0, 7); ctx.fill(); ctx.stroke();
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
  const moviendo = !!MW.hacia && MW.t > .1 && MW.t < .9;
  const paso = moviendo ? (MW.paso ? 1 : 2) : 0;
  ctx.fillStyle = 'rgba(34,48,74,.22)'; ctx.beginPath(); ctx.ellipse(cx, piso - 3, 11, 4, 0, 0, 7); ctx.fill();
  dibujarEntrenador(ctx, MW.sprites, cx, piso, MW.mira, paso, 48);
  etiqueta(ctx, apodo || 'Vos', cx, piso - 62);
  if(typeof ON !== 'undefined' && ON.miBurbuja && ON.miBurbuja.hasta > t) burbuja(ctx, ON.miBurbuja.txt, cx, piso - 68);
}
// La criatura que va primero en el equipo te sigue un casillero atrás.
function segX(){ return MW.hacia ? MW.segDesde.x + (MW.seg.x - MW.segDesde.x) * MW.t : MW.seg.x; }
function segY(){ return MW.hacia ? MW.segDesde.y + (MW.seg.y - MW.segDesde.y) * MW.t : MW.seg.y; }
function seguidor(ctx, t, camX, camY){
  const c = S.equipo[0]; if(!c) return;
  const img = imagenCriatura(c.esp, c.shiny);
  const x = segX(), y = segY();
  if(x === MW.pos.x && y === MW.pos.y && !MW.hacia) return;
  const cx = (x + .5) * TS - camX, piso = (y + 1) * TS - camY, tam = 36;
  const salto = MW.hacia ? Math.abs(Math.sin(MW.t * Math.PI)) * 3 : Math.abs(Math.sin(t / 380)) * 1.5;
  ctx.save(); ctx.translate(cx, piso - salto);
  const vx = MW.seg.x - MW.segDesde.x;
  if(vx) MW.segDir = vx;
  if((MW.segDir || MW.dir) < 0) ctx.scale(-1, 1);
  ctx.fillStyle = 'rgba(34,48,74,.18)'; ctx.beginPath(); ctx.ellipse(0, -2, 10, 3.5, 0, 0, 7); ctx.fill();
  if(img.complete && img.naturalWidth) ctx.drawImage(img, -tam / 2, -tam + 2, tam, tam);
  ctx.restore();
}
function brilloItem(ctx, sx, sy, t){
  const p = (Math.sin(t / 250 + sx) + 1) / 2;
  ctx.save(); ctx.translate(sx + 16, sy + 18);
  ctx.fillStyle = '#F2545B'; ctx.strokeStyle = '#22304A'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(0, 0, 6, 0, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = `rgba(255,236,120,${.5 + p * .5})`;
  ctx.beginPath(); ctx.moveTo(8, -12); ctx.lineTo(10, -8); ctx.lineTo(14, -6); ctx.lineTo(10, -4); ctx.lineTo(8, 0); ctx.lineTo(6, -4); ctx.lineTo(2, -6); ctx.lineTo(6, -8); ctx.closePath(); ctx.fill();
  ctx.restore();
}
function altar(ctx, sx, sy, x, y, t, M){
  const id = M.altares[x + ',' + y], capt = S.legendarios[id] && S.legendarios[id].capturada;
  ctx.fillStyle = 'rgba(34,48,74,.2)'; ctx.beginPath(); ctx.ellipse(sx + 16, sy + 28, 14, 4, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#B8B2A6'; ctx.strokeStyle = '#22304A'; ctx.lineWidth = 2.5;
  ctx.fillRect(sx + 4, sy + 14, 24, 14); ctx.strokeRect(sx + 4, sy + 14, 24, 14);
  ctx.fillRect(sx + 8, sy + 2, 16, 12); ctx.strokeRect(sx + 8, sy + 2, 16, 12);
  if(!capt && cantMedallas() >= 4){
    const p = (Math.sin(t / 300) + 1) / 2;
    ctx.fillStyle = `rgba(255,220,90,${.35 + p * .5})`; ctx.beginPath(); ctx.arc(sx + 16, sy + 8, 5 + p * 3, 0, 7); ctx.fill();
  }
}
function pared(ctx, sx, sy, x, y, M){
  if(y <= 1){
    ctx.fillStyle = y === 0 ? '#B89A78' : '#D9C3A0'; ctx.fillRect(sx, sy, TS + 1, TS + 1);
    if(y === 1){ ctx.fillStyle = '#8A6A4A'; ctx.fillRect(sx, sy + TS - 5, TS + 1, 5); }
    if(y === 0 && x % 3 === 1 && x > 0 && x < M.w - 1){ ctx.fillStyle = '#9FD9F2'; ctx.fillRect(sx + 6, sy + 8, 20, 18); ctx.strokeStyle = '#22304A'; ctx.lineWidth = 2; ctx.strokeRect(sx + 6, sy + 8, 20, 18); }
  } else { ctx.fillStyle = '#5A4232'; ctx.fillRect(sx, sy, TS + 1, TS + 1); }
}
function muebleInterior(ctx, sx, sy, tipo){
  ctx.strokeStyle = '#22304A'; ctx.lineWidth = 2.5;
  const rr = (x, y, w, h, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, w, h, 4) : ctx.rect(x, y, w, h); ctx.fill(); ctx.stroke(); };
  if(tipo === 'cama'){ rr(sx + 2, sy - 6, 28, 36, '#F4E8D2'); rr(sx + 4, sy + 8, 24, 20, '#3B82D6'); rr(sx + 6, sy - 2, 20, 8, '#fff'); }
  else if(tipo === 'estante'){ rr(sx + 3, sy - 14, 26, 42, '#8A5A35'); ctx.fillStyle = '#E2574C'; ctx.fillRect(sx + 7, sy - 8, 5, 10); ctx.fillStyle = '#4CC27A'; ctx.fillRect(sx + 14, sy - 8, 5, 10); ctx.fillStyle = '#FFD23F'; ctx.fillRect(sx + 9, sy + 8, 14, 8); }
  else if(tipo === 'tele'){ rr(sx + 4, sy + 12, 24, 16, '#8A5A35'); rr(sx + 2, sy - 6, 28, 18, '#22304A'); ctx.fillStyle = '#9FD9F2'; ctx.fillRect(sx + 5, sy - 3, 22, 12); }
  else if(tipo === 'planta'){ rr(sx + 9, sy + 14, 14, 14, '#C97B4A'); ctx.fillStyle = '#4FAE56'; ctx.beginPath(); ctx.arc(sx + 16, sy + 8, 11, 0, 7); ctx.fill(); ctx.stroke(); }
  else if(tipo === 'mesa'){ rr(sx + 2, sy + 4, 28, 18, '#B5835A'); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(sx + 16, sy + 10, 4, 0, 7); ctx.fill(); }
  else if(tipo === 'sillon'){ rr(sx + 2, sy + 2, 28, 26, '#7A4FC9'); rr(sx + 6, sy + 12, 20, 12, '#9C7CD4'); }
}
