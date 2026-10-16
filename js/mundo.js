'use strict';
/* =====================================================================
   El mundo: mapa en grilla, cámara, movimiento y encuentros.
   ===================================================================== */

const MAPA_W = 40, MAPA_H = 30, TS = 32;
const SALIDA_CASA = {x: 11, y: 24};
// Rectángulos de zona [x0, y0, x1, y1], el primero que contiene la casilla gana.
const RECT_ZONAS = [
  ['pueblo', 1, 21, 26, 28],
  ['sierras', 1, 1, 15, 10],
  ['bosque', 24, 1, 38, 13],
  ['rio', 24, 14, 38, 28],
  ['pradera', 1, 1, 23, 20],
];
function zonaEn(x, y){
  for(const [z, x0, y0, x1, y1] of RECT_ZONAS) if(x >= x0 && x <= x1 && y >= y0 && y <= y1) return z;
  return 'pradera';
}

// Generador pseudoaleatorio con semilla: el mapa sale igual para todos.
function rng(semilla){ let s = semilla >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

const MAPA = (() => {
  const r = rng(20261016);
  const m = Array.from({length: MAPA_H}, () => Array(MAPA_W).fill('.'));
  const en = (x, y) => x > 0 && y > 0 && x < MAPA_W - 1 && y < MAPA_H - 1;
  const set = (x, y, c) => { if(en(x, y)) m[y][x] = c; };
  const mancha = (x0, y0, x1, y1, cant, c, rmin = 1, rmax = 3) => {
    for(let i = 0; i < cant; i++){
      const cx = x0 + Math.floor(r() * (x1 - x0 + 1)), cy = y0 + Math.floor(r() * (y1 - y0 + 1));
      const rad = rmin + r() * (rmax - rmin);
      for(let y = Math.floor(cy - rad); y <= cy + rad; y++)
        for(let x = Math.floor(cx - rad); x <= cx + rad; x++)
          if(x >= x0 && x <= x1 && y >= y0 && y <= y1 && Math.hypot(x - cx, y - cy) <= rad) set(x, y, c);
    }
  };
  const salpicar = (x0, y0, x1, y1, prob, c, sobre = null) => {
    for(let y = y0; y <= y1; y++) for(let x = x0; x <= x1; x++)
      if(r() < prob && (!sobre || sobre.includes(m[y][x]))) set(x, y, c);
  };

  // Sierras: tierra, pasto seco y rocas
  for(let y = 1; y <= 10; y++) for(let x = 1; x <= 15; x++) m[y][x] = 's';
  mancha(2, 2, 14, 9, 7, ',', 1.5, 2.8);
  salpicar(1, 1, 15, 10, .16, '#', ['s']);
  // Pradera
  mancha(2, 2, 22, 19, 16, ',', 1.6, 3.2);
  salpicar(16, 1, 23, 20, .04, 'T', ['.']);
  salpicar(1, 11, 23, 20, .03, 'T', ['.']);
  salpicar(1, 11, 23, 20, .06, 'f', ['.']);
  // Bosque
  mancha(25, 2, 37, 12, 8, ',', 1.2, 2.3);
  salpicar(24, 1, 38, 13, .5, 'T', ['.']);
  // Río
  for(let y = 14; y <= 28; y++){
    const off = Math.round(Math.sin(y * .55) * 1.2);
    for(let x = 29 + off; x <= 31 + off; x++) set(x, y, '~');
  }
  mancha(24, 15, 28, 27, 5, ',', 1.2, 2.2);
  mancha(32, 15, 38, 27, 6, ',', 1.2, 2.4);
  salpicar(24, 14, 38, 28, .05, 'T', ['.']);
  // Pueblo: limpio, con flores
  for(let y = 21; y <= 28; y++) for(let x = 1; x <= 26; x++) m[y][x] = '.';
  salpicar(1, 21, 26, 28, .07, 'f');
  // Caminos (despejan lo que haya)
  const camino = (x0, y0, x1, y1) => {
    for(let y = Math.min(y0, y1); y <= Math.max(y0, y1); y++)
      for(let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++)
        if(en(x, y)) m[y][x] = m[y][x] === '~' ? 'b' : '=';
  };
  camino(11, 24, 11, 3);   // al norte: pradera y sierras
  camino(3, 25, 36, 25);   // la calle principal, cruza el río
  camino(35, 25, 35, 3);   // al bosque
  camino(5, 6, 11, 6);     // dentro de las sierras
  camino(11, 14, 22, 14);  // pradera hacia el este
  // Casas: techo (R) arriba, pared (H) abajo, puerta (D)
  const casa = (x0, y0, puerta) => {
    for(let x = x0; x < x0 + 5; x++){ m[y0][x] = 'R'; m[y0 + 1][x] = 'H'; }
    if(puerta) m[y0 + 1][x0 + 2] = 'D';
  };
  casa(9, 22, true);    // tu casa
  casa(16, 21, false);
  casa(2, 21, false);
  casa(20, 26, false);
  // Bordes
  for(let x = 0; x < MAPA_W; x++){ m[0][x] = 'T'; m[MAPA_H - 1][x] = 'T'; }
  for(let y = 0; y < MAPA_H; y++){ m[y][0] = 'T'; m[y][MAPA_W - 1] = 'T'; }
  return m;
})();

const BLOQUEA = new Set(['T', '~', '#', 'R', 'H']);
function transitable(x, y){ return x >= 0 && y >= 0 && x < MAPA_W && y < MAPA_H && !BLOQUEA.has(MAPA[y][x]); }

/* ---------------- Estado de la vista ---------------- */
let MW = null; // {canvas, ctx, pos, desde, hacia, t, dir, teclas, raf, img, zona, ...}

function pintarMundo(){
  vista = 'mundo';
  cerrarHoja();
  if(!S.mundo || !transitable(S.mundo.x, S.mundo.y)) S.mundo = {...SALIDA_CASA};
  $('#app').innerHTML = `
    ${cabeceraHTML()}
    <section class="mundo" id="mundo">
      <canvas id="lienzo" aria-label="Mapa de Sorlandia"></canvas>
      <div class="cartel-zona" id="cartel-zona"></div>
      <div class="mundo-botones">
        <button id="m-equipo">Equipo</button>
        <button id="m-mochila">Mochila</button>
      </div>
      <div class="dpad" aria-label="Moverse">
        <button data-d="up" aria-label="Arriba">▲</button>
        <button data-d="left" aria-label="Izquierda">◀</button>
        <button data-d="down" aria-label="Abajo">▼</button>
        <button data-d="right" aria-label="Derecha">▶</button>
      </div>
    </section>
    <p class="pie">Caminá por el pasto alto para encontrar criaturas. Para volver, entrá por la puerta de tu casa.</p>
    <p class="pie" id="cuenta"></p>`;
  pintarTodo(); pintarCuenta();
  $('#m-equipo').onclick = () => abrirEquipo();
  $('#m-mochila').onclick = () => { pestana.mochila = 'aventura'; abrirHoja('mochila'); };

  const canvas = $('#lienzo');
  MW = {canvas, ctx: canvas.getContext('2d'), pos: {...S.mundo}, desde: null, hacia: null, t: 0,
        dir: 1, teclas: new Set(), raf: 0, zona: null, img: new Image(), ultimo: performance.now(), pasos: 0};
  MW.img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgCriatura(S.especie, {humor:'feliz'}));
  ajustarLienzo();
  window.addEventListener('resize', ajustarLienzo);
  document.querySelectorAll('.dpad button').forEach(b => {
    const d = b.dataset.d;
    b.onpointerdown = ev => { ev.preventDefault(); MW.teclas.add(d); b.setPointerCapture(ev.pointerId); };
    const soltar = () => MW && MW.teclas.delete(d);
    b.onpointerup = soltar; b.onpointercancel = soltar; b.onlostpointercapture = soltar;
  });
  mostrarZona(true);
  MW.raf = requestAnimationFrame(cuadro);
}

function salirDelMundo(){
  if(!MW) return;
  cancelAnimationFrame(MW.raf);
  window.removeEventListener('resize', ajustarLienzo);
  MW = null;
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

const TECLAS = {ArrowUp:'up', ArrowDown:'down', ArrowLeft:'left', ArrowRight:'right', w:'up', s:'down', a:'left', d:'right', W:'up', S:'down', A:'left', D:'right'};
document.addEventListener('keydown', e => {
  if(!MW || vista !== 'mundo' || $('#velo')) return;
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
  if(MW.hacia){
    MW.t += dt / DUR_PASO;
    if(MW.t >= 1){
      MW.pos = {...MW.hacia}; MW.hacia = null; MW.t = 0;
      S.mundo = {...MW.pos};
      if(alLlegar()) return;
    }
  }
  if(!MW.hacia && !$('#velo')){
    const d = [...MW.teclas].pop();
    if(d){
      const [dx, dy] = DIRS[d];
      if(dx) MW.dir = dx;
      const nx = MW.pos.x + dx, ny = MW.pos.y + dy;
      if(transitable(nx, ny)){ MW.desde = {...MW.pos}; MW.hacia = {x: nx, y: ny}; MW.t = 0; }
    }
  }
  dibujar(ahora);
  MW.raf = requestAnimationFrame(cuadro);
}

function alLlegar(){
  const {x, y} = MW.pos, c = MAPA[y][x];
  MW.pasos++;
  if(MW.pasos % 12 === 0) guardar();
  mostrarZona();
  if(c === 'D'){
    S.mundo = {...SALIDA_CASA};
    salirDelMundo(); guardar(); pintarJuego();
    avisar('Volviste a casa. Tu equipo descansó y está como nuevo.');
    return true;
  }
  if(c === ','){
    const z = zonaEn(x, y);
    if(ZONAS[z].aparecen.length && Math.random() < .13){
      if(!hayLuchadorEnPie()){ avisar('Tu equipo está agotado. Volvé a casa a descansar.'); return false; }
      MW.teclas.clear();
      const salvaje = crearSalvaje(z);
      salirDelMundo(); guardar();
      empezarCombate(salvaje, z);
      return true;
    }
  }
  return false;
}

function mostrarZona(forzar){
  const z = zonaEn(MW.pos.x, MW.pos.y);
  if(z === MW.zona && !forzar) return;
  MW.zona = z;
  const c = $('#cartel-zona'); if(!c) return;
  c.textContent = ZONAS[z].nom;
  c.classList.remove('ver'); void c.offsetWidth; c.classList.add('ver');
}

/* ---------------- Dibujo del mapa ---------------- */
const COLORES = {
  '.':'#8DD17C', ',':'#5FB45A', 'T':'#8DD17C', '~':'#5AB4E8', '=':'#E9D3A0', '#':'#D8BE8C',
  'f':'#8DD17C', 's':'#DFC48E', 'R':'#8DD17C', 'H':'#8DD17C', 'D':'#8DD17C', 'b':'#5AB4E8',
};
function hashXY(x, y){ let h = x * 374761393 + y * 668265263; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }

function dibujar(ahora){
  const {ctx, vw, vh} = MW;
  let px = MW.pos.x, py = MW.pos.y;
  if(MW.hacia){ px = MW.desde.x + (MW.hacia.x - MW.desde.x) * MW.t; py = MW.desde.y + (MW.hacia.y - MW.desde.y) * MW.t; }
  const camX = Math.max(0, Math.min(MAPA_W * TS - vw, (px + .5) * TS - vw / 2));
  const camY = Math.max(0, Math.min(MAPA_H * TS - vh, (py + .5) * TS - vh / 2));
  ctx.fillStyle = '#3E8E4B'; ctx.fillRect(0, 0, vw, vh);
  const x0 = Math.floor(camX / TS), y0 = Math.floor(camY / TS);
  const x1 = Math.min(MAPA_W - 1, Math.ceil((camX + vw) / TS)), y1 = Math.min(MAPA_H - 1, Math.ceil((camY + vh) / TS));
  // suelo
  for(let y = y0; y <= y1; y++) for(let x = x0; x <= x1; x++){
    const c = MAPA[y][x], sx = Math.round(x * TS - camX), sy = Math.round(y * TS - camY);
    let base = COLORES[c] || '#8DD17C';
    if(zonaEn(x, y) === 'sierras' && (c === 'T' || c === '#')) base = '#DFC48E';
    ctx.fillStyle = base; ctx.fillRect(sx, sy, TS + 1, TS + 1);
    if(c === '.' || c === 'f'){ if(hashXY(x, y) < .3){ ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(sx, sy, TS, TS); } }
    if(c === ',') pastoAlto(ctx, sx, sy, x, y, ahora, zonaEn(x, y) === 'sierras');
    if(c === 'f') flores(ctx, sx, sy, x, y);
    if(c === '~' || c === 'b') agua(ctx, sx, sy, x, y, ahora);
    if(c === 'b') puente(ctx, sx, sy);
    if(c === '=') { ctx.fillStyle = 'rgba(160,120,60,.18)'; if(hashXY(x, y) < .5) ctx.fillRect(sx + 6, sy + 10, 4, 3); }
  }
  // objetos altos, ordenados por fila
  for(let y = y0; y <= y1; y++){
    for(let x = x0; x <= x1; x++){
      const c = MAPA[y][x], sx = Math.round(x * TS - camX), sy = Math.round(y * TS - camY);
      if(c === '#') roca(ctx, sx, sy, x, y);
      if(c === 'R' || c === 'H' || c === 'D') casaTile(ctx, sx, sy, x, y, c);
    }
    for(let x = x0; x <= x1; x++){
      if(MAPA[y][x] === 'T') arbol(ctx, Math.round(x * TS - camX), Math.round(y * TS - camY), x, y);
    }
    if(y === Math.floor(py + .5)) jugador(ctx, (px + .5) * TS - camX, (py + 1) * TS - camY, ahora);
  }
}

function pastoAlto(ctx, sx, sy, x, y, t, seco){
  ctx.strokeStyle = seco ? '#B49A55' : '#3F9A45'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
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
function agua(ctx, sx, sy, x, y, t){
  ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 2;
  const o = Math.sin(t / 600 + x + y * .5) * 3;
  ctx.beginPath(); ctx.moveTo(sx + 4 + o, sy + 10); ctx.quadraticCurveTo(sx + 9 + o, sy + 6, sx + 14 + o, sy + 10); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(sx + 16 - o, sy + 22); ctx.quadraticCurveTo(sx + 21 - o, sy + 18, sx + 26 - o, sy + 22); ctx.stroke();
}
function puente(ctx, sx, sy){
  ctx.fillStyle = '#B5835A'; ctx.fillRect(sx, sy + 3, TS, TS - 6);
  ctx.strokeStyle = '#7E5434'; ctx.lineWidth = 2;
  for(let i = 0; i <= TS; i += 8){ ctx.beginPath(); ctx.moveTo(sx + i, sy + 3); ctx.lineTo(sx + i, sy + TS - 3); ctx.stroke(); }
  ctx.strokeStyle = '#22304A'; ctx.strokeRect(sx, sy + 3, TS, TS - 6);
}
function arbol(ctx, sx, sy, x, y){
  const ceibo = zonaEn(x, y) === 'bosque';
  ctx.fillStyle = 'rgba(34,48,74,.18)'; ctx.beginPath(); ctx.ellipse(sx + 16, sy + 28, 12, 4, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#8A5A35'; ctx.fillRect(sx + 13, sy + 16, 6, 12);
  ctx.strokeStyle = '#22304A'; ctx.lineWidth = 2.5; ctx.strokeRect(sx + 13, sy + 16, 6, 12);
  ctx.fillStyle = ceibo ? '#3F8F4A' : '#4FAE56';
  ctx.beginPath(); ctx.arc(sx + 16, sy + 8, 15, 0, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.beginPath(); ctx.arc(sx + 10, sy + 3, 5, 0, 7); ctx.fill();
  if(ceibo){
    ctx.fillStyle = '#E63B4B';
    for(let i = 0; i < 4; i++){ ctx.beginPath(); ctx.arc(sx + 6 + hashXY(x + i, y) * 20, sy - 2 + hashXY(x, y + i) * 18, 2.6, 0, 7); ctx.fill(); }
  }
}
function roca(ctx, sx, sy, x, y){
  ctx.fillStyle = 'rgba(34,48,74,.18)'; ctx.beginPath(); ctx.ellipse(sx + 16, sy + 27, 13, 4, 0, 0, 7); ctx.fill();
  ctx.fillStyle = hashXY(x, y) < .5 ? '#A3A9B3' : '#959CA7';
  ctx.strokeStyle = '#22304A'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(sx + 4, sy + 26); ctx.lineTo(sx + 8, sy + 10); ctx.lineTo(sx + 18, sy + 4); ctx.lineTo(sx + 28, sy + 14); ctx.lineTo(sx + 28, sy + 26); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.beginPath(); ctx.moveTo(sx + 10, sy + 12); ctx.lineTo(sx + 17, sy + 8); ctx.stroke();
}
function casaTile(ctx, sx, sy, x, y, c){
  const mia = x >= 9 && x <= 13 && y >= 22 && y <= 23;
  if(c === 'R'){
    ctx.fillStyle = mia ? '#E2574C' : (x < 9 ? '#4F86C6' : '#6BAF5B');
    ctx.fillRect(sx, sy + 4, TS + 1, TS - 4);
    ctx.strokeStyle = 'rgba(0,0,0,.18)'; ctx.lineWidth = 2;
    for(let i = 8; i < TS; i += 8){ ctx.beginPath(); ctx.moveTo(sx, sy + 4 + i); ctx.lineTo(sx + TS, sy + 4 + i); ctx.stroke(); }
    ctx.strokeStyle = '#22304A'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(sx, sy + 4); ctx.lineTo(sx + TS, sy + 4); ctx.stroke();
    if(MAPA[y][x - 1] !== 'R'){ ctx.beginPath(); ctx.moveTo(sx, sy + 4); ctx.lineTo(sx, sy + TS); ctx.stroke(); }
    if(MAPA[y][x + 1] !== 'R'){ ctx.beginPath(); ctx.moveTo(sx + TS, sy + 4); ctx.lineTo(sx + TS, sy + TS); ctx.stroke(); }
  } else {
    ctx.fillStyle = '#FFF4E0'; ctx.fillRect(sx, sy, TS + 1, TS - 2);
    ctx.strokeStyle = '#22304A'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(sx, sy + TS - 2); ctx.lineTo(sx + TS, sy + TS - 2); ctx.stroke();
    if(MAPA[y][x - 1] !== 'H' && MAPA[y][x - 1] !== 'D'){ ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx, sy + TS - 2); ctx.stroke(); }
    if(MAPA[y][x + 1] !== 'H' && MAPA[y][x + 1] !== 'D'){ ctx.beginPath(); ctx.moveTo(sx + TS, sy); ctx.lineTo(sx + TS, sy + TS - 2); ctx.stroke(); }
    if(c === 'D'){
      ctx.fillStyle = '#8A5A35'; ctx.fillRect(sx + 8, sy + 6, 16, TS - 8); ctx.strokeRect(sx + 8, sy + 6, 16, TS - 8);
      ctx.fillStyle = '#FFC93C'; ctx.beginPath(); ctx.arc(sx + 20, sy + 19, 1.8, 0, 7); ctx.fill();
    } else if((x + y) % 2 === 0){
      ctx.fillStyle = '#9FD9F2'; ctx.fillRect(sx + 8, sy + 8, 16, 12); ctx.strokeRect(sx + 8, sy + 8, 16, 12);
    }
  }
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
  const etiqueta = apodo || S.nombre;
  ctx.font = '800 11px Nunito, sans-serif'; ctx.textAlign = 'center';
  const w = ctx.measureText(etiqueta).width + 10;
  ctx.fillStyle = 'rgba(34,48,74,.8)';
  ctx.beginPath(); ctx.roundRect ? ctx.roundRect(cx - w / 2, piso - tam - 16 - salto, w, 15, 7) : ctx.rect(cx - w / 2, piso - tam - 16 - salto, w, 15); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.fillText(etiqueta, cx, piso - tam - 5 - salto);
}
