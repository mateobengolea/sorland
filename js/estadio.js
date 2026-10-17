'use strict';
/* =====================================================================
   Combates estilo estadio: campo en perspectiva, tribuna con público,
   tu criatura de tres cuartos y una cámara que se mueve con la pelea.
   ===================================================================== */
const CAMPO = {
  pradera: ['#8FD07A', '#7CC46A'], bosque: ['#6FB070', '#5E9E60'], rio: ['#8ED08C', '#7AC27A'], sierras: ['#E3C893', '#D6B97E'],
  cumbres: ['#EAF3F8', '#D7E6EF'], volcan: ['#8F7B6A', '#7E6A5A'], ciudad: ['#7CC46A', '#6AB45A'],
};
// Profundidad (0 = horizonte, 1 = frente) a coordenada y del dibujo.
const prof = (H, t) => H + (300 - H) * Math.pow(t, 1.5);
function svgCampo(tipo, estadio){
  const H = estadio ? 132 : 158, [c1, c2] = CAMPO[tipo] || CAMPO.pradera;
  // Ancho del campo a cada profundidad: angosto al fondo, ancho adelante.
  const xs = t => [80 - 240 * t, 320 + 240 * t];
  let s = `<svg class="campo-svg" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">`;
  // Franjas de pasto cortado
  const N = 8;
  for(let i = 0; i < N; i++){
    const t0 = i / N, t1 = (i + 1) / N, [a0, b0] = xs(t0), [a1, b1] = xs(t1);
    s += `<path d="M${a0} ${prof(H, t0)} L${b0} ${prof(H, t0)} L${b1} ${prof(H, t1)} L${a1} ${prof(H, t1)}Z" fill="${i % 2 ? c2 : c1}"/>`;
  }
  // Pasto alrededor del campo (fuera de las líneas)
  s += `<path d="M0 ${H} L${xs(0)[0]} ${H} L${xs(1)[0]} 300 L0 300Z M400 ${H} L${xs(0)[1]} ${H} L${xs(1)[1]} 300 L400 300Z" fill="${c2}" opacity=".9"/>`;
  if(estadio){
    const ln = 'fill="none" stroke="#FFFFFF" stroke-width="2.4" opacity=".85" stroke-linejoin="round"';
    const m = .08, [a, b] = xs(m), [c, d] = xs(1.1);
    s += `<path d="M${a + 30} ${prof(H, m)} L${b - 30} ${prof(H, m)} L${d - 60} ${prof(H, 1.1)} M${a + 30} ${prof(H, m)} L${c + 60} ${prof(H, 1.1)}" ${ln}/>`;
    const tm = .42, ym = prof(H, tm), [am, bm] = xs(tm);
    s += `<path d="M${am + 22} ${ym} L${bm - 22} ${ym}" ${ln}/>`;
    s += `<ellipse cx="200" cy="${ym}" rx="70" ry="${(300 - H) * .1}" ${ln}/><circle cx="200" cy="${ym}" r="3" fill="#fff" opacity=".85"/>`;
    // Áreas de cada lado
    const ta = .2, ya = prof(H, ta);
    s += `<path d="M150 ${prof(H, m)} L146 ${ya} L254 ${ya} L250 ${prof(H, m)}" ${ln}/>`;
  } else {
    // Matas, flores y piedritas en el campo salvaje
    for(let i = 0; i < 26; i++){
      const t = ((i * 37) % 100) / 100, x = ((i * 89) % 400), y = prof(H, t), k = .5 + t;
      s += i % 4 === 0
        ? `<circle cx="${x}" cy="${y}" r="${2.4 * k}" fill="${['#FFD23F', '#FF8FB1', '#FFFFFF'][i % 3]}"/>`
        : `<path d="M${x} ${y} l${2 * k} ${-7 * k} l${2 * k} ${7 * k} l${2 * k} ${-5 * k} l${1.5 * k} ${5 * k}" fill="none" stroke="${c2}" stroke-width="${1.6 * k}" stroke-linecap="round" filter="brightness(.8)"/>`;
    }
  }
  // Sombra suave hacia el horizonte para dar profundidad
  s += `<defs><linearGradient id="niebla-campo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".45"/><stop offset=".35" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient></defs>
    <rect y="${H}" width="400" height="${300 - H}" fill="url(#niebla-campo)"/></svg>`;
  return s;
}
// Tribuna con público, focos y banderines (gimnasios, entrenadores y duelos).
function svgTribuna(color = '#E2574C'){
  const cols = ['#E2574C', '#3B82D6', '#FFD23F', '#4CC27A', '#FF8FB1', '#7A4FC9', '#FFFFFF', '#F2B63D', '#22304A'];
  let s = `<svg class="tribuna-svg" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">
    <path d="M-10 40 Q200 10 410 40 L410 136 L-10 136Z" fill="#4A5578"/>
    <path d="M-10 40 Q200 10 410 40 L410 52 Q200 22 -10 52Z" fill="#2F3A5C"/>`;
  // Gradas: filas de público (las de atrás más chicas)
  for(let fila = 0; fila < 6; fila++){
    const y = 58 + fila * 13, r = 3 + fila * .45, curva = 18 - fila * 2;
    s += `<g class="publico p${fila % 3}">`;
    for(let x = -6; x < 410; x += r * 2.6){
      const k = Math.floor(x * 7 + fila * 13) % cols.length, yy = y - Math.sin((x / 400) * Math.PI) * curva * .4;
      s += `<circle cx="${x.toFixed(1)}" cy="${yy.toFixed(1)}" r="${r.toFixed(1)}" fill="${cols[(k + 9) % 9]}"/><rect x="${(x - r).toFixed(1)}" y="${(yy + r * .6).toFixed(1)}" width="${(r * 2).toFixed(1)}" height="${(r * 1.4).toFixed(1)}" rx="${r * .5}" fill="${cols[(k + 4) % 9]}" opacity=".85"/>`;
    }
    s += '</g>';
  }
  s += `<path d="M-10 132 Q200 120 410 132 L410 140 L-10 140Z" fill="#E9E2D3"/><path d="M-10 136 L410 136" stroke="#22304A" stroke-width="2"/>`;
  // Carteles de publicidad a lo largo del borde
  for(let i = 0; i < 6; i++){ const x = 8 + i * 66; s += `<rect x="${x}" y="125" width="56" height="10" rx="2" fill="${i % 2 ? color : '#FFFDF8'}" stroke="#22304A" stroke-width="1.2"/><text x="${x + 28}" y="133" text-anchor="middle" font-size="7" font-weight="800" fill="${i % 2 ? '#FFFDF8' : '#22304A'}">${['SORLANDIA', 'MATE COCIDO', 'ESTADIO', 'ALFAJOR', 'CAPSULAS', 'DALE!'][i]}</text>`; }
  // Focos
  for(const x of [18, 382]) s += `<path d="M${x} 136 L${x} 6" stroke="#9AA2AD" stroke-width="4"/><rect x="${x - 14}" y="0" width="28" height="14" rx="3" fill="#22304A"/>${[-8, 0, 8].map(d => `<circle cx="${x + d}" cy="7" r="3.4" fill="#FFF6C8" class="foco"/>`).join('')}`;
  // Banderines
  for(const x of [70, 200, 330]) s += `<path d="M${x} 44 L${x} 14" stroke="#22304A" stroke-width="2"/><path d="M${x} 14 L${x + 24} 20 L${x} 27Z" fill="${color}" stroke="#22304A" stroke-width="1.5" class="bandera"/>`;
  // Pantalla gigante en el medio de la tribuna
  s += `<g class="pantalla"><rect x="150" y="2" width="100" height="40" rx="4" fill="#22304A" stroke="#9AA2AD" stroke-width="3"/><rect x="155" y="6" width="90" height="32" rx="2" fill="#1B2244"/>
    <text x="200" y="20" text-anchor="middle" font-size="10" font-weight="900" fill="#FFD23F" letter-spacing="1">SORLANDIA</text><text x="200" y="33" text-anchor="middle" font-size="9" font-weight="800" fill="#8FD3F7" letter-spacing="2">STADIUM</text></g>`;
  // Flashes de cámaras
  for(let i = 0; i < 7; i++) s += `<circle cx="${30 + i * 55}" cy="${66 + (i % 3) * 16}" r="4" fill="#FFFFFF" class="flash" style="animation-delay:${(i * .73) % 3}s"/>`;
  return s + '</svg>';
}
/* ---------------- Tarima: el ring elevado donde pelean ---------------- */
const TARIMA = {
  pradera: ['#8FD07A', '#7CC46A', '#B98A5A', '#8A6440'], bosque: ['#6FB070', '#5E9E60', '#8A6440', '#6B4A2E'], rio: ['#8ED08C', '#7AC27A', '#7FA6C0', '#5E7E9A'],
  sierras: ['#E3C893', '#D6B97E', '#A8907A', '#7E6A58'], cumbres: ['#F2F7FA', '#DCE8EF', '#9AB4C8', '#6E8AA0'], volcan: ['#9C8676', '#8A7464', '#5E4A3E', '#3E302A'],
  ciudad: ['#7CC46A', '#6AB45A', '#C9CED6', '#8A929E'],
};
function svgTarima(tipo, estadio){
  const [a, b, lado, ladoOsc] = estadio ? ['#7CC46A', '#6AB45A', '#E9E2D3', '#B9B2A6'] : (TARIMA[tipo] || TARIMA.pradera);
  const top = 'M34 12 H366 Q394 12 392 46 Q390 82 360 86 H40 Q10 82 8 46 Q6 12 34 12Z';
  let s = `<svg viewBox="0 0 400 140" preserveAspectRatio="none" aria-hidden="true">
    <ellipse cx="200" cy="128" rx="200" ry="12" fill="rgba(20,30,50,.28)"/>
    <path d="M8 46 Q10 82 40 86 H360 Q390 82 392 46 L392 100 Q390 128 360 130 H40 Q10 128 8 100Z" fill="${ladoOsc}" stroke="#22304A" stroke-width="2.5"/>
    <path d="M12 70 Q16 100 44 104 H356 Q384 100 388 70" fill="none" stroke="${lado}" stroke-width="10"/>`;
  if(estadio){
    for(let x = 30; x < 380; x += 34) s += `<rect x="${x}" y="98" width="20" height="8" rx="2" fill="${(x / 34) % 2 < 1 ? '#E2574C' : '#3B82D6'}" opacity=".9"/>`;
  } else {
    for(let x = 26; x < 380; x += 44) s += `<ellipse cx="${x}" cy="${110 + (x % 3) * 4}" rx="7" ry="4" fill="${lado}" opacity=".7"/>`;
  }
  s += `<path d="${top}" fill="${a}" stroke="#22304A" stroke-width="2.5"/>`;
  // Franjas de pasto
  for(let i = 1; i < 10; i += 2) s += `<path d="M${10 + i * 38} 13 L${10 + (i + 1) * 38} 13 L${10 + (i + 1) * 38} 86 L${10 + i * 38} 86Z" fill="${b}" opacity=".7"/>`;
  if(estadio){
    const ln = 'fill="none" stroke="#FFFFFF" stroke-width="2.4" opacity=".9"';
    s += `<path d="M44 20 H356 Q378 20 378 46 Q378 76 356 78 H44 Q22 76 22 46 Q22 20 44 20Z" ${ln}/>
      <path d="M200 20 V78" ${ln}/><ellipse cx="200" cy="49" rx="34" ry="16" ${ln}/>
      <path d="M22 34 H70 V64 H22 M378 34 H330 V64 H378" ${ln}/>
      <circle cx="200" cy="49" r="9" fill="#FFFFFF" stroke="#22304A" stroke-width="2"/><path d="M191 49 H209" stroke="#22304A" stroke-width="2"/><path d="M191 49 A9 9 0 0 1 209 49Z" fill="#E2574C" stroke="#22304A" stroke-width="2"/><circle cx="200" cy="49" r="3" fill="#FFFFFF" stroke="#22304A" stroke-width="1.5"/>`;
  } else {
    for(let i = 0; i < 16; i++){ const x = 30 + (i * 53) % 340, y = 22 + (i * 29) % 56; s += i % 3 ? `<path d="M${x} ${y} l2 -6 l2 6 l2 -4 l1.5 4" fill="none" stroke="${b}" stroke-width="2" stroke-linecap="round" filter="brightness(.8)"/>` : `<circle cx="${x}" cy="${y}" r="2.4" fill="${['#FFD23F', '#FF8FB1', '#FFFFFF'][i % 3]}"/>`; }
  }
  return s + `<path d="${top}" fill="none" stroke="#22304A" stroke-width="2.5"/><path d="M40 16 H200" stroke="#FFFFFF" stroke-width="3" opacity=".35" stroke-linecap="round"/></svg>`;
}
/* ---------------- Las criaturas se miran de perfil ---------------- */
// Dibujos que ya miran hacia la izquierda: se muestran tal cual. Al resto se los dibuja de tres cuartos.
const MIRA_IZQ = new Set(['carosaurio', 'matesaurio', 'rufisaurio', 'matetitan', 'nandusito', 'nandu', 'nanduron', 'pejerrin', 'pejerrey', 'bagrecito', 'tortuguin', 'tortugon',
  'tatupiedra', 'peludito', 'carpincho', 'carpinchon', 'huemulito', 'yaguarayo', 'zorrofogon', 'condorcito']);
function svgLuchador(esp, shiny){
  const izq = MIRA_IZQ.has(esp);
  // Con "espejo", el dibujo queda mirando para el lado contrario al original: tu criatura mira a la derecha y la rival a la izquierda.
  return `<div class="giro${izq ? '' : ' espejo'}">${svgEspecie(esp, {humor: 'bien', shiny, vista: izq ? undefined : 'lado'})}</div>`;
}
/* ---------------- Cámara con cortes, como en la tele ---------------- */
const escenaEl = () => document.querySelector('.arena .escena');
function camara(plano){
  const e = escenaEl(); if(!e || MOVIMIENTO_REDUCIDO) return;
  e.classList.remove('cam-tribuna', 'cam-intro', 'cam-cerca-propio', 'cam-cerca-rival', 'cam-centro', 'lento');
  if(plano) e.classList.add('cam-' + plano);
}
// Corte seco (sin transición) a un plano.
function corte(plano){
  const e = escenaEl(); if(!e || MOVIMIENTO_REDUCIDO) return;
  e.classList.add('sin-trans'); camara(plano); void e.offsetWidth; e.classList.remove('sin-trans');
}
function arrancarCamara(){
  const e = escenaEl(); if(!e) return;
  if(MOVIMIENTO_REDUCIDO){ camara(null); return; }
  // Paneo lento desde la tribuna (o el cielo) hasta el plano general del campo.
  requestAnimationFrame(() => requestAnimationFrame(() => {
    e.classList.add('lento'); e.classList.remove('cam-tribuna', 'cam-intro');
    setTimeout(() => e.classList.remove('lento'), 1700);
  }));
}
(() => {
  const original = animarAtaque;
  animarAtaque = async function(mov, idA, idD, acierta){
    if(MOVIMIENTO_REDUCIDO || !escenaEl()) return original(mov, idA, idD, acierta);
    const atacante = idA === 'b-propio' ? 'propio' : 'rival', defensor = atacante === 'propio' ? 'rival' : 'propio';
    // 1) Primer plano del que ataca, con un empujón de cámara.
    corte('cerca-' + atacante); await espera(520);
    // 2) Plano general para ver el ataque cruzar el campo.
    corte(null); await espera(60);
    try { await original(mov, idA, idD, acierta); }
    finally {
      // 3) Primer plano del que recibe y vuelta al general.
      if(acierta && !mov.efecto){ corte('cerca-' + defensor); await espera(380); }
      corte(null);
    }
  };
})();
// La cápsula vuela desde el costado del entrenador hasta el campo antes de abrirse.
(() => {
  const original = popCapsula;
  popCapsula = async function(cr){
    const arena = document.querySelector('.arena');
    if(!arena || !cr || MOVIMIENTO_REDUCIDO) return original(cr);
    const a = arena.getBoundingClientRect(), r = cr.getBoundingClientRect();
    const fin = {x: r.left - a.left + r.width / 2, y: r.top - a.top + r.height * .6};
    const propio = cr.id === 'b-propio', ini = {x: propio ? -20 : a.width + 20, y: a.height * .35};
    const d = document.createElement('div'); d.className = 'capsula-vuela'; d.innerHTML = iconoObjeto(OBJETOS[0], 30);
    arena.appendChild(d);
    const medio = {x: (ini.x + fin.x) / 2, y: Math.min(ini.y, fin.y) - 70};
    await d.animate([
      {transform: `translate(${ini.x}px, ${ini.y}px) translate(-50%,-50%) rotate(0deg)`},
      {transform: `translate(${medio.x}px, ${medio.y}px) translate(-50%,-50%) rotate(${propio ? 360 : -360}deg)`},
      {transform: `translate(${fin.x}px, ${fin.y}px) translate(-50%,-50%) rotate(${propio ? 720 : -720}deg)`}], {duration: 460, easing: 'ease-in'}).finished.catch(() => {});
    d.remove();
    return original(cr);
  };
})();
// El público grita cuando alguien cae.
function ovacion(){
  const t = document.querySelector('.arena .tribuna-svg'); if(!t) return;
  t.classList.remove('ovacion'); void t.getBoundingClientRect(); t.classList.add('ovacion');
  setTimeout(() => t.classList.remove('ovacion'), 1400);
}
(() => {
  const original = animar;
  animar = function(id, clase, ms){ if(clase === 'desmayo') ovacion(); return original(id, clase, ms); };
})();
