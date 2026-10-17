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
  // Flashes de cámaras
  for(let i = 0; i < 7; i++) s += `<circle cx="${30 + i * 55}" cy="${66 + (i % 3) * 16}" r="4" fill="#FFFFFF" class="flash" style="animation-delay:${(i * .73) % 3}s"/>`;
  return s + '</svg>';
}
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
