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

/* =====================================================================
   Estadios temáticos: el estadio cambia según el tipo del equipo rival.
   ===================================================================== */
const TEMAS_ESTADIO = {
  normal: {fondo: 'pradera', campo: ['#7CC46A', '#6AB45A'], borde: '#5E9E50', tribuna: ['#4A5578', '#2F3A5C'], lineas: true},
  planta: {fondo: 'bosque', campo: ['#6FBF5E', '#5EAE4E'], borde: '#3E7E3B', tribuna: ['#2E5E30', '#1E4220'], lineas: true},
  fuego:  {fondo: 'volcan', campo: ['#5E4A3E', '#4E3E34'], borde: '#3A2C24', tribuna: ['#6E2A20', '#4A1A14'], lineas: false},
  agua:   {fondo: 'rio', campo: ['#5AB4E8', '#4AA4DA'], borde: '#3A8CC4', tribuna: ['#2C5E8C', '#1C3E62'], lineas: false},
  piedra: {fondo: 'sierras', campo: ['#D6B97E', '#C9A86E'], borde: '#9C8458', tribuna: ['#6E5A44', '#4E3E2E'], lineas: true},
  rayo:   {fondo: 'ciudad', campo: ['#5A6478', '#4E5868'], borde: '#3A4252', tribuna: ['#3A3A58', '#24243A'], lineas: false},
  hielo:  {fondo: 'cumbres', campo: ['#E6F4FB', '#D3EAF5'], borde: '#A8CCE0', tribuna: ['#5E7E9A', '#3E5E7A'], lineas: true},
  viento: {fondo: 'cumbres', campo: ['#CDEBFA', '#B9E0F5'], borde: '#FFFFFF', tribuna: ['#7FA6C8', '#5E86A8'], lineas: false},
  bicho:  {fondo: 'bosque', campo: ['#8DB04A', '#7EA03E'], borde: '#5E7E2A', tribuna: ['#4E6A2A', '#36501A'], lineas: false},
};
function tipoDominante(lista){
  const c = {}; let mejor = 'normal', max = 0;
  for(const x of lista){ const t = x.tipo || (ESPECIES[x.esp] && ESPECIES[x.esp].tipo) || 'normal'; c[t] = (c[t] || 0) + 1; if(c[t] > max){ max = c[t]; mejor = t; } }
  return TEMAS_ESTADIO[mejor] ? mejor : 'normal';
}
// Decoración del campo de cada tipo (sobre el campo en perspectiva).
function decoCampo(tipo, H){
  const xs = t => [80 - 240 * t, 320 + 240 * t], at = (t, f) => { const [a, b] = xs(t); return a + (b - a) * f; };
  let s = '';
  const rnd = i => { const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };
  if(tipo === 'agua'){
    for(let i = 0; i < 14; i++){ const t = rnd(i) * .9 + .05, y = prof(H, t), x = at(t, rnd(i + 30)), k = .5 + t;
      s += `<path d="M${x - 14 * k} ${y} q${7 * k} ${-5 * k} ${14 * k} 0 t${14 * k} 0" fill="none" stroke="#DDF3FF" stroke-width="${2 * k}" stroke-linecap="round" opacity=".8"/>`; }
    for(let i = 0; i < 5; i++){ const t = rnd(i + 7) * .8 + .1, x = at(t, rnd(i + 11)), y = prof(H, t), k = .6 + t;
      s += `<ellipse cx="${x}" cy="${y}" rx="${12 * k}" ry="${4 * k}" fill="#6FBF5E" stroke="#22304A" stroke-width="1.2"/><path d="M${x} ${y} l${10 * k} ${-2 * k}" stroke="#4E9A3E" stroke-width="1.5"/>`; }
  } else if(tipo === 'fuego'){
    for(let i = 0; i < 9; i++){ const t = rnd(i) * .85 + .1, y = prof(H, t), x = at(t, rnd(i + 5)), k = .5 + t;
      s += `<path class="lava" d="M${x - 30 * k} ${y} l${12 * k} ${-3 * k} l${10 * k} ${4 * k} l${14 * k} ${-4 * k} l${12 * k} ${3 * k}" fill="none" stroke="#FF8A3D" stroke-width="${3 * k}" stroke-linecap="round" stroke-linejoin="round"/>`; }
    for(let i = 0; i < 16; i++){ const t = rnd(i + 3), x = at(t, rnd(i + 21)), y = prof(H, t); s += `<circle cx="${x}" cy="${y}" r="${1.5 + t * 2}" fill="#FFD23F" class="brasa" style="animation-delay:${rnd(i) * 2}s"/>`; }
  } else if(tipo === 'rayo'){
    for(let i = 1; i < 8; i++){ const t = i / 8, [a, b] = xs(t); s += `<path d="M${a} ${prof(H, t)} L${b} ${prof(H, t)}" stroke="#7FD4FF" stroke-width="1.4" opacity=".6"/>`; }
    for(let i = 0; i <= 10; i++){ const f = i / 10; s += `<path d="M${at(0, f)} ${H} L${at(1, f)} 300" stroke="#7FD4FF" stroke-width="1.4" opacity=".6"/>`; }
    s += `<path class="chispa" d="M150 ${prof(H, .4)} l12 -6 l-4 10 l14 -6" fill="none" stroke="#FFE45C" stroke-width="3" stroke-linecap="round"/><path class="chispa" style="animation-delay:.7s" d="M260 ${prof(H, .7)} l12 -6 l-4 10 l14 -6" fill="none" stroke="#FFE45C" stroke-width="3" stroke-linecap="round"/>`;
  } else if(tipo === 'hielo'){
    for(let i = 0; i < 12; i++){ const t = rnd(i) * .9 + .05, y = prof(H, t), x = at(t, rnd(i + 9)), k = .5 + t;
      s += `<path d="M${x} ${y} l${30 * k} ${-6 * k}" stroke="#FFFFFF" stroke-width="${2.5 * k}" stroke-linecap="round" opacity=".85"/>`; }
    s += `<path d="M0 ${H} L${xs(0)[0]} ${H} L${xs(1)[0]} 300 L0 300Z M400 ${H} L${xs(0)[1]} ${H} L${xs(1)[1]} 300 L400 300Z" fill="#FFFFFF" opacity=".75"/>`;
  } else if(tipo === 'viento'){
    for(let i = 0; i < 10; i++){ const t = rnd(i) * .9 + .05, y = prof(H, t), x = at(t, rnd(i + 13)), k = .6 + t;
      s += `<g fill="#FFFFFF" opacity=".95"><ellipse cx="${x}" cy="${y}" rx="${26 * k}" ry="${8 * k}"/><ellipse cx="${x + 12 * k}" cy="${y - 5 * k}" rx="${14 * k}" ry="${7 * k}"/></g>`; }
    s += `<path d="M0 ${H} L${xs(0)[0]} ${H} L${xs(1)[0]} 300 L0 300Z M400 ${H} L${xs(0)[1]} ${H} L${xs(1)[1]} 300 L400 300Z" fill="#FFFFFF" opacity=".85"/>`;
  } else if(tipo === 'bicho'){
    for(let i = 0; i < 22; i++){ const t = rnd(i) * .9 + .05, y = prof(H, t), x = at(t, rnd(i + 17)), r = 5 + t * 8;
      s += `<path d="M${x - r} ${y} l${r / 2} ${-r * .45} h${r} l${r / 2} ${r * .45} l${-r / 2} ${r * .45} h${-r}Z" fill="#FFD23F" opacity=".35" stroke="#C9A227" stroke-width="1"/>`; }
    for(let i = 0; i < 4; i++){ const x = [30, 370, 60, 340][i], y = prof(H, [.3, .35, .8, .85][i]); s += `<path d="M${x} ${y} C${x - 20} ${y - 30} ${x + 10} ${y - 50} ${x + 20} ${y - 30} C${x + 26} ${y - 16} ${x + 12} ${y} ${x} ${y}Z" fill="#5E9E45" stroke="#22304A" stroke-width="1.5"/>`; }
  } else if(tipo === 'planta'){
    for(let i = 0; i < 18; i++){ const t = rnd(i), x = at(t, rnd(i + 5) < .5 ? rnd(i) * .12 : .88 + rnd(i) * .12), y = prof(H, t); s += `<circle cx="${x}" cy="${y}" r="${2 + t * 3}" fill="${['#FF8FB1', '#FFD23F', '#E2493C'][i % 3]}"/>`; }
    s += `<path d="M0 ${H + 6} Q100 ${H - 8} 200 ${H + 2} Q300 ${H - 10} 400 ${H + 6} L400 ${H + 14} L0 ${H + 14}Z" fill="#3E7E3B"/>`;
  } else if(tipo === 'piedra'){
    for(let i = 0; i < 8; i++){ const t = rnd(i) * .85 + .1, y = prof(H, t), x = at(t, rnd(i + 3) < .5 ? rnd(i) * .15 : .85 + rnd(i) * .15), k = .5 + t;
      s += `<path d="M${x - 14 * k} ${y} L${x - 9 * k} ${y - 14 * k} L${x + 4 * k} ${y - 18 * k} L${x + 14 * k} ${y - 6 * k} L${x + 12 * k} ${y}Z" fill="#9AA2AD" stroke="#22304A" stroke-width="1.5"/>`; }
    for(let i = 0; i < 6; i++){ const t = rnd(i + 40) * .8 + .15, y = prof(H, t), x = at(t, .3 + rnd(i) * .4); s += `<path d="M${x} ${y} l8 3 l6 -4 l9 2" fill="none" stroke="#9C8458" stroke-width="1.6"/>`; }
  }
  return s;
}
function svgCampoTema(tipo){
  const T = TEMAS_ESTADIO[tipo] || TEMAS_ESTADIO.normal, H = 132, [c1, c2] = T.campo;
  const xs = t => [80 - 240 * t, 320 + 240 * t];
  let s = `<svg class="campo-svg" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">
    <rect y="${H}" width="400" height="${300 - H}" fill="${T.borde}"/>`;
  for(let i = 0; i < 8; i++){
    const t0 = i / 8, t1 = (i + 1) / 8, [a0, b0] = xs(t0), [a1, b1] = xs(t1);
    s += `<path d="M${a0} ${prof(H, t0)} L${b0} ${prof(H, t0)} L${b1} ${prof(H, t1)} L${a1} ${prof(H, t1)}Z" fill="${i % 2 ? c2 : c1}"/>`;
  }
  s += decoCampo(tipo, H);
  if(T.lineas){
    const ln = `fill="none" stroke="${tipo === 'hielo' ? '#7EC0E8' : '#FFFFFF'}" stroke-width="2.4" opacity=".85" stroke-linejoin="round"`;
    const m = .08, [a, b] = xs(m), [c, d] = xs(1.1), tm = .42, ym = prof(H, tm), [am, bm] = xs(tm);
    s += `<path d="M${a + 30} ${prof(H, m)} L${b - 30} ${prof(H, m)} L${d - 60} ${prof(H, 1.1)} M${a + 30} ${prof(H, m)} L${c + 60} ${prof(H, 1.1)}" ${ln}/>
      <path d="M${am + 22} ${ym} L${bm - 22} ${ym}" ${ln}/><ellipse cx="200" cy="${ym}" rx="70" ry="${(300 - H) * .1}" ${ln}/>`;
  }
  // Emblema del tipo en el centro del campo
  const ym = prof(H, .42);
  s += `<ellipse cx="200" cy="${ym}" rx="26" ry="9" fill="${TIPOS[tipo] ? TIPOS[tipo].color : '#D6D0C2'}" stroke="#22304A" stroke-width="1.5" opacity=".9"/>`;
  s += `<defs><linearGradient id="niebla-tema" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".4"/><stop offset=".35" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient></defs>
    <rect y="${H}" width="400" height="${300 - H}" fill="url(#niebla-tema)"/></svg>`;
  return s;
}
// Estadio completo para un tipo: cielo/paisaje, tribuna del color del tipo y campo temático.
function estadioHTML(tipo){
  const T = TEMAS_ESTADIO[tipo] || TEMAS_ESTADIO.normal;
  let trib = svgTribuna(TIPOS[tipo] ? TIPOS[tipo].color : '#E2574C');
  trib = trib.replace('fill="#4A5578"', `fill="${T.tribuna[0]}"`).replace('fill="#2F3A5C"', `fill="${T.tribuna[1]}"`);
  return svgFondoArena(T.fondo) + trib + svgCampoTema(tipo);
}
