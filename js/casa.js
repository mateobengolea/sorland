'use strict';
/* =====================================================================
   La casa en perspectiva isométrica: un cuarto con dos paredes y piso
   en grilla. Los muebles de piso van a un casillero; los de pared se
   cuelgan en cualquiera de las dos paredes.
   ===================================================================== */
const CASA = {N: 8, tw: 46, th: 23, hw: 128, ox: 200, oy: 148, W: 400, H: 340};
const casaIso = (gx, gy) => ({x: CASA.ox + (gx - gy) * CASA.tw / 2, y: CASA.oy + (gx + gy) * CASA.th / 2});
function casaGrilla(x, y){
  const a = (x - CASA.ox) / (CASA.tw / 2), b = (y - CASA.oy) / (CASA.th / 2);
  return {gx: (a + b) / 2, gy: (b - a) / 2};
}
const maxMuebles = () => 10 + cantMedallas() * 2;

/* ---------------- Dibujos de muebles (vista 3/4, apoyados abajo al medio) ---------------- */
const TT = '#22304A';
const sv = (cuerpo, vb = '0 0 100 100') => `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g stroke="${TT}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${cuerpo}</g></svg>`;
const DIB_MUEBLE = {
  planta: () => sv(`<path d="M34 72 L66 72 L61 96 L39 96Z" fill="#D98A52"/><rect x="31" y="66" width="38" height="8" rx="3" fill="#E9A06A"/>
    <path d="M44 66 L44 28 C44 18 58 18 58 28 L58 66Z" fill="#5DB86A"/><path d="M44 48 L34 48 C28 48 28 36 34 36 L36 36 L36 42 L44 42" fill="#5DB86A"/>
    <path d="M58 40 L68 40 C74 40 74 28 68 28 L66 28 L66 34 L58 34" fill="#5DB86A"/><path d="M51 30 V60" stroke="#3E9150" stroke-width="2" fill="none"/>
    <circle cx="51" cy="20" r="4" fill="#FF8FB1" stroke-width="2"/>`),
  silla: () => sv(`<path d="M30 20 L62 12 L64 52 L32 60Z" fill="#C98A52"/><path d="M34 26 L60 20 M34 36 L61 30" stroke="#A86F3E" fill="none"/>
    <path d="M28 58 L64 50 L78 58 L42 68Z" fill="#E0A66A"/><path d="M42 68 L42 94 M78 58 L78 86 M28 58 L28 84 M64 50 L64 78" fill="none" stroke-width="4"/>`),
  lampara: () => sv(`<ellipse cx="50" cy="92" rx="18" ry="5" fill="#8A5A35"/><path d="M50 90 V40" stroke-width="4" fill="none"/>
    <path d="M32 40 L68 40 L60 14 L40 14Z" fill="#FFD98A"/><ellipse cx="50" cy="40" rx="18" ry="3" fill="#FFE9A8"/>
    <circle cx="50" cy="44" r="20" fill="rgba(255,230,140,.25)" stroke="none"/>`),
  guitarra: () => sv(`<path d="M58 8 L64 10 L52 52" fill="none" stroke-width="5"/><path d="M58 6 L66 8 L64 16 L56 14Z" fill="#6B4226"/>
    <path d="M48 46 C36 42 28 52 34 60 C24 66 26 86 40 90 C52 94 62 86 62 76 C68 70 66 58 58 56 C58 50 54 46 48 46Z" fill="#E08A3C"/>
    <circle cx="46" cy="68" r="6" fill="#5A3A22"/><path d="M38 80 L54 84" stroke-width="3.5"/>`),
  sillon: () => sv(`<path d="M12 46 C12 34 22 30 30 32 L84 22 C92 20 98 28 96 36 L94 60 L20 76Z" fill="#7A4FC9"/>
    <path d="M14 58 L92 44 L96 70 L22 88Z" fill="#9C7CD4"/><path d="M30 58 L62 52 M62 52 L64 76" fill="none" stroke="#7A4FC9"/>
    <path d="M6 54 C6 46 18 44 20 52 L22 88 C14 90 8 86 8 80Z" fill="#7A4FC9"/><path d="M90 40 C90 32 102 32 100 42 L98 70 C96 74 94 72 94 70Z" fill="#7A4FC9"/>
    <path d="M24 88 L24 96 M90 72 L90 80" stroke-width="4"/>`, '0 0 104 100'),
  tele: () => sv(`<path d="M22 84 L78 72 L82 88 L26 98Z" fill="#8A5A35"/><path d="M14 22 L84 10 L86 66 L18 78Z" fill="#3B4A6B"/>
    <path d="M22 28 L78 18 L79 58 L24 68Z" fill="#7FD3F7"/><path d="M26 56 L40 46 L52 54 L64 42 L78 52 L79 58 L24 68Z" fill="#5DB86A" stroke-width="2"/>
    <circle cx="66" cy="28" r="4" fill="#FFE45C" stroke-width="2"/><path d="M40 10 L48 2 M56 8 L62 0" fill="none"/>`),
  cama: () => sv(`<path d="M8 46 L60 30 L100 46 L48 64Z" fill="#F4E8D2"/><path d="M8 46 L48 64 L48 88 L8 70Z" fill="#E0CDB0"/><path d="M48 64 L100 46 L100 70 L48 88Z" fill="#D2BE9E"/>
    <path d="M30 52 L70 38 L100 48 L58 64Z" fill="#3B82D6"/><path d="M58 64 L100 48 L100 60 L58 76Z" fill="#2F6DB5"/>
    <path d="M14 44 L34 38 L44 44 L24 50Z" fill="#FFFFFF"/><path d="M6 46 L6 26 C6 18 16 16 18 24 L18 50" fill="#B5835A"/>`, '0 0 106 100'),
  trofeo: () => sv(`<rect x="34" y="82" width="32" height="12" rx="2" fill="#8A5A35"/><path d="M44 82 L56 82 L54 68 L46 68Z" fill="#FFC93C"/>
    <path d="M30 18 L70 18 C70 50 62 64 50 66 C38 64 30 50 30 18Z" fill="#FFD23F"/><path d="M30 26 C18 26 18 44 32 44 M70 26 C82 26 82 44 68 44" fill="none" stroke-width="4"/>
    <path d="M44 28 L48 52" stroke="#FFF3B0" stroke-width="4" fill="none"/>`),
  mesa: () => sv(`<ellipse cx="50" cy="44" rx="40" ry="16" fill="#C98A52"/><path d="M10 44 L10 50 C10 59 90 59 90 50 L90 44" fill="#A86F3E"/>
    <path d="M30 56 L28 92 M70 56 L72 92 M50 60 L50 96" fill="none" stroke-width="5"/>
    <path d="M42 36 C42 30 56 30 56 36 L54 44 L44 44Z" fill="#FFFFFF"/><path d="M56 38 C62 38 62 42 56 42" fill="none"/>`),
  biblioteca: () => sv(`<path d="M16 6 L84 6 L84 96 L16 96Z" fill="#A86F3E"/><path d="M22 12 H78 V36 H22Z M22 40 H78 V64 H22Z M22 68 H78 V90 H22Z" fill="#7A4F2C"/>
    ${[['#E2574C',24],['#3B82D6',32],['#FFD23F',40],['#4CC27A',48],['#7A4FC9',58],['#FF8FB1',66]].map(([c, x]) => `<rect x="${x}" y="16" width="7" height="20" fill="${c}" stroke-width="2"/>`).join('')}
    ${[['#4CC27A',26],['#E2574C',34],['#5AB4E8',44],['#FFD23F',62],['#3B82D6',70]].map(([c, x]) => `<rect x="${x}" y="44" width="7" height="20" fill="${c}" stroke-width="2"/>`).join('')}
    <circle cx="36" cy="80" r="7" fill="#5DB86A" stroke-width="2"/><rect x="52" y="74" width="20" height="16" fill="#FFFDF8" stroke-width="2"/>`),
  acuario: () => sv(`<rect x="14" y="80" width="72" height="16" fill="#3B4A6B"/><rect x="12" y="26" width="76" height="56" rx="4" fill="rgba(127,211,247,.75)"/>
    <path d="M12 36 H88" stroke="#4EA8E3" fill="none"/><path d="M22 80 C24 70 20 64 24 58 M32 80 C30 72 34 68 32 62" stroke="#3E9150" fill="none"/>
    <path d="M50 52 C58 46 68 50 70 56 C68 62 58 64 50 58 L44 62 L44 48Z" fill="#FF9F2E" stroke-width="2"/><circle cx="64" cy="54" r="1.6" fill="${TT}" stroke="none"/>
    <circle cx="40" cy="44" r="2.5" fill="#fff" stroke-width="1.5"/><circle cx="44" cy="36" r="1.8" fill="#fff" stroke-width="1.5"/>`),
  heladera: () => sv(`<rect x="24" y="4" width="52" height="92" rx="6" fill="#E9F4FB"/><path d="M24 36 H76" fill="none"/><path d="M66 14 V28 M66 44 V64" stroke-width="4" fill="none"/>
    <circle cx="36" cy="18" r="4" fill="#E2574C" stroke-width="2"/><rect x="34" y="48" width="12" height="10" fill="#FFD23F" stroke-width="2"/>`),
  // De pared (se dibujan de frente; la perspectiva la pone la pared)
  cuadro: () => sv(`<rect x="10" y="18" width="80" height="62" rx="3" fill="#C98A52"/><rect x="18" y="26" width="64" height="46" fill="#BFE4F3"/>
    <path d="M18 72 L38 46 L52 60 L62 50 L82 72Z" fill="#5DB86A" stroke-width="2.5"/><circle cx="68" cy="36" r="6" fill="#FFD23F" stroke-width="2"/>`),
  reloj: () => sv(`<circle cx="50" cy="50" r="34" fill="#B5835A"/><circle cx="50" cy="50" r="27" fill="#FFFDF8"/>
    <path d="M50 50 L50 32 M50 50 L62 56" stroke-width="4" fill="none"/><circle cx="50" cy="50" r="3" fill="${TT}"/>
    ${[0, 90, 180, 270].map(a => `<path d="M${50 + Math.sin(a * Math.PI / 180) * 22} ${50 - Math.cos(a * Math.PI / 180) * 22} L${50 + Math.sin(a * Math.PI / 180) * 25} ${50 - Math.cos(a * Math.PI / 180) * 25}" fill="none"/>`).join('')}`),
  ventana: () => sv(`<rect x="12" y="8" width="76" height="80" rx="4" fill="#FFFDF8"/><rect x="20" y="16" width="60" height="64" fill="#8FD3F7"/>
    <circle cx="64" cy="30" r="8" fill="#FFE45C" stroke-width="2"/><path d="M26 40 C26 34 38 34 38 40 C44 38 46 46 40 46 L28 46 C22 46 22 40 26 40Z" fill="#fff" stroke-width="2"/>
    <path d="M50 16 V80 M20 48 H80" fill="none" stroke-width="3.5"/><path d="M12 8 C22 30 22 60 14 88 L6 88 L6 8Z M88 8 C78 30 78 60 86 88 L94 88 L94 8Z" fill="#FF8FB1"/>
    <rect x="8" y="88" width="84" height="6" rx="2" fill="#C98A52"/>`),
  estante: () => sv(`<rect x="8" y="60" width="84" height="8" rx="2" fill="#C98A52"/><path d="M18 68 L26 80 M82 68 L74 80" fill="none" stroke-width="4"/>
    <rect x="16" y="34" width="8" height="26" fill="#E2574C" stroke-width="2"/><rect x="24" y="38" width="8" height="22" fill="#3B82D6" stroke-width="2"/><rect x="32" y="32" width="8" height="28" fill="#FFD23F" stroke-width="2"/>
    <path d="M58 60 L58 50 L76 50 L76 60Z" fill="#D98A52" stroke-width="2"/><path d="M62 50 C58 40 64 34 66 44 C68 32 76 38 72 50" fill="#5DB86A" stroke-width="2"/>`),
  poster: () => sv(`<rect x="14" y="8" width="72" height="84" rx="3" fill="#2C3A73"/><path d="M50 22 L56 38 L74 38 L60 48 L65 66 L50 56 L35 66 L40 48 L26 38 L44 38Z" fill="#FFD23F" stroke-width="2.5"/>
    <rect x="22" y="74" width="56" height="10" rx="2" fill="#E2574C" stroke-width="2"/><circle cx="18" cy="12" r="3" fill="#E2574C" stroke-width="1.5"/><circle cx="82" cy="12" r="3" fill="#E2574C" stroke-width="1.5"/>`),
  banderin: () => sv(`<path d="M4 20 Q50 34 96 20" fill="none" stroke-width="2.5"/>${['#E2574C','#FFD23F','#4CC27A','#3B82D6','#FF8FB1'].map((c, i) => { const x = 10 + i * 18, y = 22 + Math.sin((i + .5) / 5 * Math.PI) * 6; return `<path d="M${x} ${y} L${x + 14} ${y + 1} L${x + 7} ${y + 20}Z" fill="${c}" stroke-width="2"/>`; }).join('')}`),
  // De piso, planas
  alfombra: () => `<svg viewBox="0 0 92 46" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M46 1 L91 23 L46 45 L1 23Z" fill="#E2574C" stroke="${TT}" stroke-width="2"/>
    <path d="M46 7 L79 23 L46 39 L13 23Z" fill="none" stroke="#FFD23F" stroke-width="3"/><path d="M46 15 L62 23 L46 31 L30 23Z" fill="#FFD23F" stroke="${TT}" stroke-width="1.5"/></svg>`,
  alfombraAzul: () => `<svg viewBox="0 0 92 46" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><ellipse cx="46" cy="23" rx="44" ry="21" fill="#5AB4E8" stroke="${TT}" stroke-width="2"/>
    <ellipse cx="46" cy="23" rx="32" ry="15" fill="none" stroke="#FFFDF8" stroke-width="3"/><ellipse cx="46" cy="23" rx="18" ry="8" fill="#8FD3F7" stroke="${TT}" stroke-width="1.5"/></svg>`,
};

/* ---------------- Fondos: colores para el cuarto ---------------- */
const FONDO_CASA = {
  durazno:   {pared: ['#FBDCC4', '#F3CBAE'], patron: 'liso', piso: ['#D49A62', '#C68A52'], suelo: 'tablas', zocalo: '#C68A52'},
  menta:     {pared: ['#CFEEDC', '#BFE4CF'], patron: 'rayas', piso: ['#B98B6A', '#A87B5B'], suelo: 'tablas', zocalo: '#8FBFA4'},
  lavanda:   {pared: ['#E6DEF8', '#D3C6F0'], patron: 'lunares', piso: ['#F2EEF9', '#CFC4E6'], suelo: 'damero', zocalo: '#B7A6DE'},
  cancha:    {pared: ['#BFE6FB', '#9FD4F5'], patron: 'cielo', piso: ['#5DBB63', '#4FAE56'], suelo: 'pasto', zocalo: '#3E9150'},
  estrellas: {pared: ['#2C3A73', '#24305F'], patron: 'estrellas', piso: ['#4A3E6E', '#3D3260'], suelo: 'tablas', zocalo: '#1D2550'},
  frutilla:  {pared: ['#FFE1EA', '#FFCADB'], patron: 'lunares', piso: ['#FFFDF8', '#F6E3EA'], suelo: 'damero', zocalo: '#E9709A'},
  playa:     {pared: ['#DFF4FF', '#C7EAFB'], patron: 'rayas', piso: ['#F3DFAF', '#E9D09A'], suelo: 'tablas', zocalo: '#5AB4E8'},
};

function svgCuarto(fondoId){
  const f = FONDO_CASA[fondoId] || FONDO_CASA.durazno, {N, hw} = CASA;
  const p = (gx, gy, alto = 0) => { const q = casaIso(gx, gy); return `${q.x},${q.y - alto}`; };
  let s = `<svg viewBox="0 0 ${CASA.W} ${CASA.H}" xmlns="http://www.w3.org/2000/svg" class="cuarto" aria-hidden="true">
    <defs><linearGradient id="g-cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9FD4F5"/><stop offset="1" stop-color="#E4F5FF"/></linearGradient>
    <linearGradient id="g-sombra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(34,48,74,0)"/><stop offset="1" stop-color="rgba(34,48,74,.12)"/></linearGradient></defs>`;
  const paredIzq = `${p(0, 0)} ${p(0, N)} ${p(0, N, hw)} ${p(0, 0, hw)}`, paredDer = `${p(0, 0)} ${p(N, 0)} ${p(N, 0, hw)} ${p(0, 0, hw)}`;
  const relleno = f.patron === 'cielo' ? 'url(#g-cielo)' : f.pared[0];
  s += `<polygon points="${paredIzq}" fill="${relleno}"/><polygon points="${paredDer}" fill="${relleno}"/>`;
  // Patrones de pared
  for(let i = 0; i <= N * 2; i++){
    const t = i / 2;
    if(f.patron === 'rayas' && i % 2 === 1){
      s += `<polygon points="${p(0, t - .25)} ${p(0, t + .25)} ${p(0, t + .25, hw)} ${p(0, t - .25, hw)}" fill="${f.pared[1]}"/>`;
      s += `<polygon points="${p(t - .25, 0)} ${p(t + .25, 0)} ${p(t + .25, 0, hw)} ${p(t - .25, 0, hw)}" fill="${f.pared[1]}"/>`;
    }
    if((f.patron === 'lunares' || f.patron === 'estrellas') && i > 0 && i < N * 2){
      for(let k = 1; k <= 5; k++){
        const alto = k * hw / 6 + (i % 2 ? hw / 12 : 0);
        if(alto > hw - 6) continue;
        const a = casaIso(0, t), b = casaIso(t, 0);
        const r = f.patron === 'estrellas' ? ((i * 7 + k * 3) % 5 === 0 ? 2 : 1.2) : 3.2;
        const col = f.patron === 'estrellas' ? ((i + k) % 3 ? '#FFFFFF' : '#FFF6B0') : f.pared[1];
        if(f.patron === 'lunares' || (i * 3 + k) % 4 === 0){
          s += `<circle cx="${a.x}" cy="${a.y - alto}" r="${r}" fill="${col}"/><circle cx="${b.x}" cy="${b.y - alto}" r="${r}" fill="${col}"/>`;
        }
      }
    }
  }
  if(f.patron === 'cielo'){
    for(const [t, alto] of [[2, 90], [5.5, 70]]){ const a = casaIso(0, t), b = casaIso(t + .5, 0);
      for(const q of [a, b]) s += `<g fill="#fff" stroke="${TT}" stroke-width="1.5"><ellipse cx="${q.x - 8}" cy="${q.y - alto}" rx="10" ry="6"/><ellipse cx="${q.x + 6}" cy="${q.y - alto - 3}" rx="12" ry="8"/></g>`; }
  }
  // Sombra suave abajo de las paredes, zócalo y borde de arriba
  s += `<polygon points="${paredIzq}" fill="url(#g-sombra)"/><polygon points="${paredDer}" fill="url(#g-sombra)"/>`;
  s += `<polygon points="${p(0, 0)} ${p(0, N)} ${p(0, N, 8)} ${p(0, 0, 8)}" fill="${f.zocalo}"/><polygon points="${p(0, 0)} ${p(N, 0)} ${p(N, 0, 8)} ${p(0, 0, 8)}" fill="${f.zocalo}"/>`;
  // Piso
  s += `<polygon points="${p(0, 0)} ${p(N, 0)} ${p(N, N)} ${p(0, N)}" fill="${f.piso[0]}"/>`;
  for(let gx = 0; gx < N; gx++) for(let gy = 0; gy < N; gy++){
    if(f.suelo === 'damero' && (gx + gy) % 2) s += `<polygon points="${p(gx, gy)} ${p(gx + 1, gy)} ${p(gx + 1, gy + 1)} ${p(gx, gy + 1)}" fill="${f.piso[1]}"/>`;
  }
  if(f.suelo === 'tablas') for(let i = 1; i < N * 2; i++){ const t = i / 2; s += `<line x1="${casaIso(t, 0).x}" y1="${casaIso(t, 0).y}" x2="${casaIso(t, N).x}" y2="${casaIso(t, N).y}" stroke="${f.piso[1]}" stroke-width="2"/>`;
    if(i % 2) for(let j = 0; j < N; j++){ const off = (i * 3 + j * 5) % 4 === 0; if(off){ const a = casaIso(t - .5, j + .5), b = casaIso(t, j + .5); s += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${f.piso[1]}" stroke-width="1.5"/>`; } } }
  if(f.suelo === 'pasto') for(let i = 0; i < N; i += 2) s += `<polygon points="${p(i, 0)} ${p(i + 1, 0)} ${p(i + 1, N)} ${p(i, N)}" fill="${f.piso[1]}"/>`;
  // Grilla de baldosas, finita como en Habbo
  for(let i = 1; i < N; i++){
    const a1 = casaIso(i, 0), b1 = casaIso(i, N), a2 = casaIso(0, i), b2 = casaIso(N, i);
    s += `<line x1="${a1.x}" y1="${a1.y}" x2="${b1.x}" y2="${b1.y}" stroke="rgba(34,48,74,.10)" stroke-width="1"/><line x1="${a2.x}" y1="${a2.y}" x2="${b2.x}" y2="${b2.y}" stroke="rgba(34,48,74,.10)" stroke-width="1"/>`;
  }
  // Contornos
  s += `<polyline points="${p(0, N)} ${p(0, N, hw)} ${p(0, 0, hw)} ${p(N, 0, hw)} ${p(N, 0)}" fill="none" stroke="${TT}" stroke-width="3" stroke-linejoin="round"/>
    <line x1="${casaIso(0, 0).x}" y1="${casaIso(0, 0).y}" x2="${casaIso(0, 0).x}" y2="${casaIso(0, 0).y - hw}" stroke="${TT}" stroke-width="2" opacity=".35"/>
    <polygon points="${p(0, 0)} ${p(N, 0)} ${p(N, N)} ${p(0, N)}" fill="none" stroke="${TT}" stroke-width="3" stroke-linejoin="round"/>
    <polygon points="${p(0, N)} ${p(N, N)} ${p(N, N, -10)} ${p(0, N, -10)}" fill="#8A5A35" stroke="${TT}" stroke-width="2.5" stroke-linejoin="round"/>
    <polygon points="${p(N, 0)} ${p(N, N)} ${p(N, N, -10)} ${p(N, 0, -10)}" fill="#6E4628" stroke="${TT}" stroke-width="2.5" stroke-linejoin="round"/>`;
  return s + '</svg>';
}

/* ---------------- Muebles en 3D isométrico, estilo Habbo ---------------- */
// Cada mueble de piso ocupa casilleros (fp = [ancho, fondo]) y se puede girar (rot 0/1 = espejado).
const ISO = {};
function oscurecer(hex, f){
  if(!hex.startsWith('#')) return hex;
  const n = parseInt(hex.slice(1), 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return `rgb(${Math.round(r * f)},${Math.round(g * f)},${Math.round(b * f)})`;
}
function kitIso(gx, gy, rot){
  const P = (u, v, z = 0) => { const q = rot ? casaIso(gx + v, gy + u) : casaIso(gx + u, gy + v); return `${q.x.toFixed(1)},${(q.y - z).toFixed(1)}`; };
  const caja = (u0, v0, u1, v1, z0, z1, c) => {
    // Con rot, el eje u pasa a ser el fondo: las caras visibles se recalculan solas.
    const [x0, x1, y0, y1] = rot ? [v0, v1, u0, u1] : [u0, u1, v0, v1];
    const Q = (x, y, z) => { const q = casaIso(gx + x, gy + y); return `${q.x.toFixed(1)},${(q.y - z).toFixed(1)}`; };
    return `<polygon points="${Q(x1, y0, z0)} ${Q(x1, y1, z0)} ${Q(x1, y1, z1)} ${Q(x1, y0, z1)}" fill="${oscurecer(c, .72)}"/>`
      + `<polygon points="${Q(x0, y1, z0)} ${Q(x1, y1, z0)} ${Q(x1, y1, z1)} ${Q(x0, y1, z1)}" fill="${oscurecer(c, .86)}"/>`
      + `<polygon points="${Q(x0, y0, z1)} ${Q(x1, y0, z1)} ${Q(x1, y1, z1)} ${Q(x0, y1, z1)}" fill="${c}"/>`;
  };
  // Un rectángulo pintado sobre el frente (el plano v = constante, que mira hacia vos).
  const frente = (v, u0, u1, z0, z1, c, extra = '') => `<polygon points="${P(u0, v, z0)} ${P(u1, v, z0)} ${P(u1, v, z1)} ${P(u0, v, z1)}" fill="${c}" ${extra}/>`;
  const piso = (u0, v0, u1, v1, z, c, extra = '') => `<polygon points="${P(u0, v0, z)} ${P(u1, v0, z)} ${P(u1, v1, z)} ${P(u0, v1, z)}" fill="${c}" ${extra}/>`;
  const punto = (u, v, z) => { const [x, y] = P(u, v, z).split(',').map(Number); return {x, y}; };
  return {caja, frente, piso, punto};
}
Object.assign(ISO, {
  silla: {fp: [1, 1], dib: k => [[.2, .2], [.7, .2], [.2, .7], [.7, .7]].map(([u, v]) => k.caja(u, v, u + .1, v + .1, 0, 15, '#8A5A35')).join('')
    + k.caja(.15, .15, .85, .85, 15, 19, '#E0A66A') + k.caja(.15, .1, .85, .22, 19, 44, '#C98A52')},
  mesa: {fp: [1, 1], dib: k => [[.15, .15], [.75, .15], [.15, .75], [.75, .75]].map(([u, v]) => k.caja(u, v, u + .1, v + .1, 0, 17, '#8A5A35')).join('')
    + k.caja(.05, .05, .95, .95, 17, 21, '#C98A52') + k.caja(.4, .4, .58, .58, 21, 28, '#FFFFFF')},
  cama: {fp: [1, 2], dib: k => k.caja(0, 0, 1, 2, 0, 12, '#B5835A') + k.caja(.05, .05, .95, 1.95, 12, 20, '#F4E8D2')
    + k.caja(.05, .75, .95, 1.95, 12, 22, '#3B82D6') + k.piso(.05, 1.05, .95, 1.2, 22.2, '#2F6DB5') + k.caja(.15, .12, .85, .55, 20, 26, '#FFFFFF') + k.caja(0, 0, 1, .12, 12, 42, '#A86F3E')},
  sillon: {fp: [2, 1], dib: k => k.caja(0, .1, 2, .95, 0, 14, '#7A4FC9') + k.caja(0, .1, 2, .38, 14, 34, '#6A43B5')
    + k.caja(.25, .38, 1, .95, 14, 19, '#9C7CD4') + k.caja(1, .38, 1.75, .95, 14, 19, '#9C7CD4')
    + k.caja(0, .1, .25, .95, 14, 25, '#7A4FC9') + k.caja(1.75, .1, 2, .95, 14, 25, '#7A4FC9')},
  tele: {fp: [1, 1], dib: k => k.caja(.1, .3, .9, .85, 0, 14, '#8A5A35') + k.caja(.12, .35, .88, .62, 14, 42, '#3B4A6B')
    + k.frente(.62, .2, .8, 18, 38, '#7FD3F7') + k.frente(.62, .2, .5, 18, 24, '#5DB86A') + k.frente(.62, .5, .8, 18, 22, '#5DB86A')},
  biblioteca: {fp: [1, 1], dib: k => k.caja(.05, .1, .95, .6, 0, 66, '#A86F3E')
    + [10, 31, 52].map((z, f) => k.frente(.6, .1, .9, z, z + 17, '#6B4426') + ['#E2574C', '#3B82D6', '#FFD23F', '#4CC27A', '#7A4FC9'].map((c, i) => (i + f) % 5 === 4 ? '' : k.frente(.6, .12 + i * .15, .24 + i * .15, z, z + 14 - (i % 2) * 3, c)).join('')).join('')},
  heladera: {fp: [1, 1], dib: k => k.caja(.1, .15, .9, .8, 0, 60, '#E9F4FB') + k.frente(.8, .1, .9, 40, 41.5, '#9AA2AD')
    + k.frente(.8, .72, .78, 44, 54, '#9AA2AD') + k.frente(.8, .72, .78, 20, 34, '#9AA2AD') + k.frente(.8, .2, .34, 50, 56, '#E2574C')},
  acuario: {fp: [1, 1], dib: k => { const c = k.punto(.5, .8, 24);
    return k.caja(.05, .2, .95, .8, 0, 12, '#3B4A6B') + k.caja(.05, .2, .95, .8, 12, 38, '#9ED8F2').replace(/fill="/g, 'fill-opacity=".55" fill="')
      + `<path d="M${c.x - 6} ${c.y} c4 -5 12 -5 14 0 c-2 5 -10 5 -14 0 l-5 4 v-8z" fill="#FF9F2E"/><circle cx="${c.x - 8}" cy="${c.y - 8}" r="1.6" fill="#fff"/>`; }},
  lampara: {fp: [1, 1], dib: k => { const c = k.punto(.5, .5, 50);
    return k.caja(.35, .35, .65, .65, 0, 4, '#8A5A35') + k.caja(.47, .47, .53, .53, 4, 44, '#8A5A35') + k.caja(.25, .25, .75, .75, 44, 58, '#FFD98A')
      + `<circle cx="${c.x}" cy="${c.y}" r="26" fill="rgba(255,226,140,.22)" stroke="none"/>`; }},
  planta: {fp: [1, 1], dib: k => { const c = k.punto(.5, .5, 12);
    return k.caja(.3, .3, .7, .7, 0, 12, '#D98A52') + `<path d="M${c.x - 6} ${c.y + 1} V${c.y - 30} c0 -9 12 -9 12 0 V${c.y + 1}Z M${c.x - 6} ${c.y - 14} h-7 c-5 0 -5 -10 0 -10 v6 h7 M${c.x + 6} ${c.y - 20} h7 c5 0 5 -10 0 -10 v6 h-7" fill="#5DB86A"/><circle cx="${c.x}" cy="${c.y - 32}" r="3" fill="#FF8FB1"/>`; }},
  alfombra: {fp: [2, 2], plano: true, dib: k => k.piso(0, 0, 2, 2, .5, '#E2574C') + k.piso(.2, .2, 1.8, 1.8, .7, 'none', 'stroke="#FFD23F" stroke-width="2.5"') + k.piso(.7, .7, 1.3, 1.3, .9, '#FFD23F')},
  alfombraAzul: {fp: [2, 2], plano: true, dib: k => { const c = k.punto(1, 1, .5); return `<ellipse cx="${c.x}" cy="${c.y}" rx="42" ry="21" fill="#5AB4E8"/><ellipse cx="${c.x}" cy="${c.y}" rx="30" ry="15" fill="none" stroke="#FFFDF8" stroke-width="3"/><ellipse cx="${c.x}" cy="${c.y}" rx="16" ry="8" fill="#8FD3F7"/>`; }},
});
const fpDe = (it, m) => { const f = (ISO[it.id] && ISO[it.id].fp) || [1, 1]; return m && m.rot ? [f[1], f[0]] : f; };
const esPlano = it => !!(it.plano || (ISO[it.id] && ISO[it.id].plano));
const pct = (v, total) => (v / total * 100) + '%';

// Los que no tienen versión 3D (peluches, copa, trofeo, vitrina, guitarra) se paran en el centro de su casillero.
function svgFigura(it, cx, piso, ancho){
  let svg = (DIB_MUEBLE[it.id] ? DIB_MUEBLE[it.id]() : it.svg ? it.svg() : '').replace(/^<svg([^>]*?)\s(width|height)="[^"]*"/, '<svg$1').replace(/^<svg([^>]*?)\s(width|height)="[^"]*"/, '<svg$1');
  const vb = (svg.match(/viewBox="([^"]+)"/) || [, '0 0 100 100'])[1].split(/\s+/).map(Number);
  const alto = ancho * vb[3] / vb[2];
  return svg.replace('<svg', `<svg x="${cx - ancho / 2}" y="${piso - alto}" width="${ancho}" height="${alto}" overflow="visible"`);
}
function svgMuebleEnCuarto(it, m){
  if(it.pared){
    const base = m.muro === 'izq' ? casaIso(0, m.p) : casaIso(m.p, 0), cy = base.y - m.h * CASA.hw, ancho = it.tamCasa || 56;
    const k = m.muro === 'izq' ? -.5 : .5;
    return `<g transform="matrix(1 ${k} 0 1 ${base.x} ${cy})">${svgFigura(it, 0, ancho / 2, ancho)}</g>`;
  }
  const [w, d] = fpDe(it, m);
  if(ISO[it.id]) return `<g stroke="#22304A" stroke-width="1.6" stroke-linejoin="round">${ISO[it.id].dib(kitIso(m.gx, m.gy, m.rot ? 1 : 0))}</g>`;
  const c = casaIso(m.gx + w / 2, m.gy + d / 2);
  return `<g transform="${m.rot ? `translate(${2 * c.x} 0) scale(-1 1)` : ''}">${svgFigura(it, c.x, c.y + 6, it.tamCasa || 46)}</g>`;
}
// Normaliza muebles de partidas viejas al formato nuevo.
function normalizarMueble(m, i){
  const it = POR_ID[m.id]; if(!it) return m;
  const N = CASA.N;
  if(it.pared){
    if(!m.muro){ m.muro = (m.x || 50) < 50 ? 'izq' : 'der'; m.p = 1 + ((m.x || 50) % 50) / 50 * (N - 2); m.h = .55; }
    m.p = clamp(m.p, .8, N - .8); m.h = clamp(m.h, .3, .78);
  } else {
    if(m.gx == null){ m.gx = Math.round(clamp((m.x || 50) / 100, 0, 1) * (N - 1)); m.gy = Math.round(clamp(((m.y || 88) - 74) / 25, 0, 1) * (N - 3)) + (i % 2); }
    const [w, d] = fpDe(it, m);
    m.gx = clamp(Math.round(m.gx), 0, N - w); m.gy = clamp(Math.round(m.gy), 0, N - d);
  }
  delete m.x; delete m.y;
  return m;
}
// Casilleros que ocupa cada mueble de piso (los planos, como alfombras, no ocupan).
function ocupados(excepto = -1){
  const o = new Set();
  S.casa.forEach((m, i) => { const it = POR_ID[m.id]; if(i === excepto || !it || it.pared || esPlano(it)) return;
    const [w, d] = fpDe(it, m); for(let x = 0; x < w; x++) for(let y = 0; y < d; y++) o.add((m.gx + x) + ',' + (m.gy + y)); });
  return o;
}
function lugarValido(it, m, i){
  if(it.pared) return true;
  const [w, d] = fpDe(it, m);
  if(m.gx < 0 || m.gy < 0 || m.gx + w > CASA.N || m.gy + d > CASA.N) return false;
  if(esPlano(it)) return true;
  const o = ocupados(i);
  for(let x = 0; x < w; x++) for(let y = 0; y < d; y++) if(o.has((m.gx + x) + ',' + (m.gy + y))) return false;
  return true;
}
function profundidad(it, m){
  if(it.pared) return 20;
  if(esPlano(it)) return 30;
  const [w, d] = fpDe(it, m);
  return 100 + (m.gx + w - 1 + m.gy + d - 1) * 10 + 6;
}

/* ---------------- Personajes que caminan ---------------- */
const CASA_AV = {ent: null, bi: null, camino: null, timer: 0, paseo: 0};
function ubicarAvatar(el, x, y, dir){
  const c = casaIso(x + .5, y + .5);
  el.style.left = pct(c.x, CASA.W); el.style.top = pct(c.y + CASA.th * .3, CASA.H);
  el.style.zIndex = 100 + (x + y) * 10 + 5;
  el.style.transform = `translate(-50%,-100%)${dir === 'izq' ? ' scaleX(-1)' : ''}`;
}
function libreParaAvatar(x, y, otro){
  return x >= 0 && y >= 0 && x < CASA.N && y < CASA.N && !ocupados().has(x + ',' + y) && !(otro && otro.x === x && otro.y === y);
}
function lugarAvatar(pref, otro){
  if(libreParaAvatar(pref.x, pref.y, otro)) return {...pref};
  for(let r = 1; r < CASA.N; r++) for(let dx = -r; dx <= r; dx++) for(let dy = -r; dy <= r; dy++)
    if(libreParaAvatar(pref.x + dx, pref.y + dy, otro)) return {x: pref.x + dx, y: pref.y + dy};
  return {...pref};
}
function caminoA(desde, hasta, otro){
  const k = p => p.x + ',' + p.y, prev = {[k(desde)]: null}, q = [desde];
  while(q.length){
    const p = q.shift(); if(p.x === hasta.x && p.y === hasta.y) break;
    for(const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]){
      const n = {x: p.x + dx, y: p.y + dy};
      if(k(n) in prev || !libreParaAvatar(n.x, n.y, otro)) continue;
      prev[k(n)] = p; q.push(n);
    }
  }
  if(!(k(hasta) in prev)) return null;
  const r = []; let p = hasta;
  while(p && !(p.x === desde.x && p.y === desde.y)){ r.unshift(p); p = prev[k(p)]; }
  return r;
}
function dibujarEnt(dir, paso){
  const el = $('#ent-casa'); if(!el) return;
  el.innerHTML = svgEntrenador(S.entrenador, undefined, dir, paso);
}
function caminarEnt(destino){
  if(!CASA_AV.ent) return;
  const r = caminoA(CASA_AV.ent, destino, CASA_AV.bi);
  if(!r || !r.length) return;
  clearTimeout(CASA_AV.timer);
  let i = 0;
  const paso = () => {
    const el = $('#ent-casa'); if(!el || vista !== 'casa') return;
    if(i >= r.length){ dibujarEnt('abajo', 0); ubicarAvatar(el, CASA_AV.ent.x, CASA_AV.ent.y); return; }
    const n = r[i++], dx = n.x - CASA_AV.ent.x, dy = n.y - CASA_AV.ent.y;
    // En isométrico: +x baja a la derecha, +y baja a la izquierda.
    const dir = dx > 0 || dy > 0 ? 'abajo' : 'arriba', lado = dx > 0 || dy < 0 ? 'der' : 'izq';
    CASA_AV.ent = n;
    dibujarEnt(dir, i % 2 ? 1 : 2);
    ubicarAvatar(el, n.x, n.y, lado);
    CASA_AV.timer = setTimeout(paso, 230);
  };
  paso();
}
function pasearCriatura(){
  clearTimeout(CASA_AV.paseo);
  CASA_AV.paseo = setTimeout(() => {
    const el = $('#bichito'); if(!el || vista !== 'casa' || !CASA_AV.bi) return;
    if(modo !== 'decorar'){
      const opciones = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => ({x: CASA_AV.bi.x + dx, y: CASA_AV.bi.y + dy})).filter(p => libreParaAvatar(p.x, p.y, CASA_AV.ent));
      if(opciones.length){ const n = opciones[Math.floor(Math.random() * opciones.length)], lado = n.x > CASA_AV.bi.x || n.y < CASA_AV.bi.y ? 'der' : 'izq'; CASA_AV.bi = n; ubicarAvatar(el, n.x, n.y, lado); }
    }
    pasearCriatura();
  }, 2500 + Math.random() * 3500);
}

/* ---------------- Pintar el cuarto ---------------- */
let selMueble = -1, moviendo = false;
function pintarCuarto(){
  const c = $('#cuarto'); if(!c) return;
  c.innerHTML = svgCuarto(S.fondo);
  c.querySelector('svg').addEventListener('click', tocarPiso);
  const ent = $('#ent-casa'), bi = $('#bichito');
  CASA_AV.ent = lugarAvatar(CASA_AV.ent || {x: 4, y: 6}, null);
  CASA_AV.bi = lugarAvatar(CASA_AV.bi || {x: 6, y: 5}, CASA_AV.ent);
  if(ent) ubicarAvatar(ent, CASA_AV.ent.x, CASA_AV.ent.y);
  if(bi) ubicarAvatar(bi, CASA_AV.bi.x, CASA_AV.bi.y);
  pasearCriatura();
}
function tocarPiso(ev){
  if(modo === 'decorar'){ if(!ev.target.closest('.mueble')){ selMueble = -1; pintarMuebles(); } return; }
  const r = $('#escenario').getBoundingClientRect();
  const g = casaGrilla((ev.clientX - r.left) / r.width * CASA.W, (ev.clientY - r.top) / r.height * CASA.H);
  const destino = {x: Math.floor(g.gx), y: Math.floor(g.gy)};
  if(destino.x < 0 || destino.y < 0 || destino.x >= CASA.N || destino.y >= CASA.N) return;
  caminarEnt(destino);
}
function pintarMuebles(){
  const cont = $('#muebles'); if(!cont) return;
  cont.innerHTML = '';
  S.casa.forEach((m, i) => {
    const it = POR_ID[m.id]; if(!it) return;
    normalizarMueble(m, i);
    const d = document.createElement('div');
    d.className = 'mueble capa' + (i === selMueble ? ' elegido' : '') + (it.pared ? ' en-pared' : '');
    d.innerHTML = `<svg viewBox="0 0 ${CASA.W} ${CASA.H}" xmlns="http://www.w3.org/2000/svg"><g class="toca">${svgMuebleEnCuarto(it, m)}</g></svg>`;
    d.style.zIndex = profundidad(it, m);
    d.dataset.i = i;
    if(modo === 'decorar') d.querySelector('.toca').addEventListener('pointerdown', ev => agarrar(ev, i));
    else d.querySelector('.toca').addEventListener('click', ev => { ev.stopPropagation(); tocarPiso(ev); });
    cont.appendChild(d);
  });
  pintarCuarto();
  pintarSeleccion();
}
// Resalta los casilleros del mueble (verde si entra, rojo si choca).
function marcaPiso(it, m, ok){
  const svg = document.querySelector('#cuarto svg'); if(!svg) return;
  let g = svg.querySelector('#marca');
  if(!it){ if(g) g.remove(); return; }
  if(!g){ g = document.createElementNS('http://www.w3.org/2000/svg', 'polygon'); g.id = 'marca'; svg.appendChild(g); }
  let pts;
  if(it.pared){
    const a = m.muro === 'izq' ? [casaIso(0, m.p - .6), casaIso(0, m.p + .6)] : [casaIso(m.p - .6, 0), casaIso(m.p + .6, 0)];
    pts = [[a[0].x, a[0].y - 4], [a[1].x, a[1].y - 4], [a[1].x, a[1].y - CASA.hw + 4], [a[0].x, a[0].y - CASA.hw + 4]];
  } else {
    const [w, d] = fpDe(it, m);
    pts = [casaIso(m.gx, m.gy), casaIso(m.gx + w, m.gy), casaIso(m.gx + w, m.gy + d), casaIso(m.gx, m.gy + d)].map(q => [q.x, q.y]);
  }
  g.setAttribute('points', pts.map(q => q.join(',')).join(' '));
  g.setAttribute('fill', ok ? 'rgba(76,194,122,.40)' : 'rgba(226,87,76,.45)'); g.setAttribute('stroke', ok ? '#2E7D4F' : '#B5452B'); g.setAttribute('stroke-width', '2');
}
function agarrar(ev, i){
  ev.preventDefault(); ev.stopPropagation();
  const m = S.casa[i], it = POR_ID[m.id], r = $('#escenario').getBoundingClientRect();
  const antes = {...m}, inicio = {x: ev.clientX, y: ev.clientY};
  let arrastro = false;
  selMueble = i;
  const capa = document.querySelector(`.mueble[data-i="${i}"]`);
  const mover = e => {
    if(!arrastro && Math.hypot(e.clientX - inicio.x, e.clientY - inicio.y) < 6) return;
    arrastro = true; moviendo = true;
    const x = (e.clientX - r.left) / r.width * CASA.W, y = (e.clientY - r.top) / r.height * CASA.H;
    if(it.pared){
      const izq = x < CASA.ox; m.muro = izq ? 'izq' : 'der';
      m.p = clamp(Math.abs(x - CASA.ox) / (CASA.tw / 2), .8, CASA.N - .8);
      const base = izq ? casaIso(0, m.p) : casaIso(m.p, 0); m.h = clamp((base.y - y) / CASA.hw, .3, .78);
    } else {
      const [w, d] = fpDe(it, m), g = casaGrilla(x, y + 10);
      m.gx = clamp(Math.floor(g.gx - (w - 1) / 2), 0, CASA.N - w); m.gy = clamp(Math.floor(g.gy - (d - 1) / 2), 0, CASA.N - d);
    }
    if(capa){ capa.querySelector('.toca').innerHTML = svgMuebleEnCuarto(it, m); capa.style.zIndex = profundidad(it, m) + 500; capa.classList.add('levantado'); }
    marcaPiso(it, m, lugarValido(it, m, i));
    const bar = $('#barra-mueble'); if(bar) bar.hidden = true;
  };
  const soltar = () => {
    window.removeEventListener('pointermove', mover); window.removeEventListener('pointerup', soltar); window.removeEventListener('pointercancel', soltar);
    moviendo = false; marcaPiso(null);
    if(arrastro && !lugarValido(it, m, i)){ Object.assign(m, antes); avisar('Ahí no entra: choca con otro mueble'); }
    if(arrastro) guardar();
    pintarMuebles();
  };
  window.addEventListener('pointermove', mover); window.addEventListener('pointerup', soltar); window.addEventListener('pointercancel', soltar);
}
// Menú del mueble elegido: Girar, Guardar, Listo.
function pintarSeleccion(){
  const viejo = $('#barra-mueble'); if(viejo) viejo.remove();
  if(modo !== 'decorar' || selMueble < 0 || !S.casa[selMueble]) return;
  const m = S.casa[selMueble], it = POR_ID[m.id];
  let x, y;
  if(it.pared){ const b = m.muro === 'izq' ? casaIso(0, m.p) : casaIso(m.p, 0); x = b.x; y = b.y - m.h * CASA.hw - 40; }
  else { const [w, d] = fpDe(it, m), c = casaIso(m.gx + w / 2, m.gy + d / 2); x = c.x; y = c.y - 70; }
  const bar = document.createElement('div');
  bar.id = 'barra-mueble'; bar.className = 'barra-mueble';
  bar.innerHTML = `<b></b><button data-acc="girar">${it.pared ? '⇄ Otra pared' : '↻ Girar'}</button><button data-acc="guardar">Guardar</button><button data-acc="ok">✓</button>`;
  bar.querySelector('b').textContent = it.nom;
  bar.style.left = pct(clamp(x, 70, CASA.W - 70), CASA.W); bar.style.top = pct(clamp(y, 8, CASA.H - 40), CASA.H);
  bar.onpointerdown = e => e.stopPropagation();
  bar.querySelector('[data-acc=girar]').onclick = e => {
    e.stopPropagation();
    if(it.pared){ m.muro = m.muro === 'izq' ? 'der' : 'izq'; }
    else {
      const prueba = {...m, rot: m.rot ? 0 : 1}; const [w, d] = fpDe(it, prueba);
      prueba.gx = clamp(prueba.gx, 0, CASA.N - w); prueba.gy = clamp(prueba.gy, 0, CASA.N - d);
      if(!lugarValido(it, prueba, selMueble)){ avisar('No hay lugar para girarlo ahí'); return; }
      Object.assign(m, prueba);
    }
    guardar(); pintarMuebles();
  };
  bar.querySelector('[data-acc=guardar]').onclick = e => {
    e.stopPropagation();
    S.casa.splice(selMueble, 1); S.inv.muebles[m.id] = (S.inv.muebles[m.id] || 0) + 1; selMueble = -1;
    guardar(); pintarMuebles(); pintarInventarioCasa();
  };
  bar.querySelector('[data-acc=ok]').onclick = e => { e.stopPropagation(); selMueble = -1; pintarMuebles(); };
  $('#escenario').appendChild(bar);
}
// Inventario abajo del cuarto, como el de Habbo: tocás un mueble y aparece en la casa.
function pintarInventarioCasa(){
  let inv = $('#inv-casa');
  if(modo !== 'decorar'){ if(inv) inv.remove(); return; }
  if(!inv){ inv = document.createElement('div'); inv.id = 'inv-casa'; inv.className = 'inv-casa'; $('#escenario').after(inv); }
  const ids = Object.keys(S.inv.muebles).filter(id => S.inv.muebles[id] > 0 && POR_ID[id]);
  const lleno = S.casa.length >= maxMuebles();
  inv.innerHTML = `<div class="inv-cab"><b>Inventario</b><small>${S.casa.length}/${maxMuebles()} en la casa · tocá para poner, arrastrá para mover</small></div>
    <div class="inv-lista">${ids.length ? ids.map(id => `<button class="inv-item" data-poner-casa="${id}" ${lleno ? 'disabled' : ''} title="${esc(POR_ID[id].nom)}"><span>${(DIB_MUEBLE[id] ? DIB_MUEBLE[id]() : POR_ID[id].svg ? POR_ID[id].svg() : '')}</span><i>${S.inv.muebles[id]}</i></button>`).join('')
      : '<p class="inv-vacio">No tenés muebles guardados. Comprá en el Market.</p>'}</div>`;
  inv.querySelectorAll('[data-poner-casa]').forEach(b => b.onclick = () => {
    const id = b.dataset.ponerCasa, it = POR_ID[id];
    if(S.casa.length >= maxMuebles()){ avisar('Tu casa está llena: guardá algo primero'); return; }
    const lugar = lugarLibre(it); if(!lugar){ avisar('No queda lugar libre en el piso'); return; }
    S.inv.muebles[id]--; if(!S.inv.muebles[id]) delete S.inv.muebles[id];
    S.casa.push({id, ...lugar}); selMueble = S.casa.length - 1;
    guardar(); pintarMuebles(); pintarInventarioCasa();
  });
}
// Busca un lugar libre para un mueble nuevo (lejos de los personajes).
function lugarLibre(it){
  if(it.pared){
    const usados = S.casa.filter(m => POR_ID[m.id] && POR_ID[m.id].pared);
    for(const muro of ['der', 'izq']) for(let p = 1.5; p < CASA.N - .5; p += 1.5)
      if(!usados.some(m => m.muro === muro && Math.abs(m.p - p) < 1.2)) return {muro, p, h: .55};
    return {muro: 'der', p: 4, h: .55};
  }
  for(let s = 0; s < CASA.N * 2; s++) for(let gx = 0; gx < CASA.N; gx++){
    const m = {gx, gy: s - gx, rot: 0};
    if(m.gy < 0 || m.gy >= CASA.N) continue;
    if(!lugarValido(it, m, -1)) continue;
    const [w, d] = fpDe(it, m), pisa = (p) => p && p.x >= gx && p.x < gx + w && p.y >= m.gy && p.y < m.gy + d;
    if(!esPlano(it) && (pisa(CASA_AV.ent) || pisa(CASA_AV.bi))) continue;
    return m;
  }
  return null;
}
