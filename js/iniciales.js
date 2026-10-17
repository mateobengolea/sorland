'use strict';
/* =====================================================================
   Iniciales dibujados a mano, una ilustración distinta por etapa.
   Fuego: cría de dragón → dragón joven → dragón alado.
   Planta: brote dinosaurio → dinosaurio con arbolito → tortuga ombú.
   Agua: yorkie → terrier de agua → lobo de las olas.
   (El sombreado tipo anime lo agrega después svgEspecie.)
   ===================================================================== */
const TK = '#22304A', L4 = `stroke="${TK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"`, L3 = `stroke="${TK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
const llamaG = (x, y, s = 1, cls = 'llama') => `<g class="${cls}" style="transform-origin:${x}px ${y}px"><path d="M${x} ${y} C${x - 14 * s} ${y - 12 * s} ${x - 10 * s} ${y - 30 * s} ${x} ${y - 42 * s} C${x + 2 * s} ${y - 30 * s} ${x + 14 * s} ${y - 26 * s} ${x + 12 * s} ${y - 12 * s} C${x + 11 * s} ${y - 4 * s} ${x + 6 * s} ${y} ${x} ${y}Z" fill="#FF9F2E" ${L3}/><path d="M${x} ${y - 3 * s} C${x - 6 * s} ${y - 8 * s} ${x - 4 * s} ${y - 18 * s} ${x} ${y - 24 * s} C${x + 2 * s} ${y - 16 * s} ${x + 7 * s} ${y - 13 * s} ${x + 6 * s} ${y - 7 * s} C${x + 5 * s} ${y - 4 * s} ${x + 3 * s} ${y - 3 * s} ${x} ${y - 3 * s}Z" fill="#FFE36B"/></g>`;
function bocaCaricatura(cx, cy, o, ancho = 12, colmillo = false){
  if(o.humor === 'mal') return `<path d="M${cx - ancho * .7} ${cy + 4} Q${cx} ${cy - 4} ${cx + ancho * .7} ${cy + 4}" fill="none" ${L3}/>`;
  const abierta = o.humor === 'feliz';
  return (abierta
    ? `<path d="M${cx - ancho} ${cy - 2} Q${cx} ${cy + 16} ${cx + ancho} ${cy - 2} Z" fill="#B8364F" ${L3}/><path d="M${cx - ancho * .45} ${cy + 6} Q${cx} ${cy + 12} ${cx + ancho * .45} ${cy + 6} Q${cx} ${cy + 3} ${cx - ancho * .45} ${cy + 6}Z" fill="#FF8FAE"/>`
    : `<path d="M${cx - ancho} ${cy} Q${cx - ancho / 2} ${cy + 6} ${cx} ${cy} Q${cx + ancho / 2} ${cy + 6} ${cx + ancho} ${cy}" fill="none" ${L3}/>`)
    + (colmillo ? `<path d="M${cx + ancho * .45} ${cy + (abierta ? 1 : 2)} l3 6 l3 -6Z" fill="#fff" stroke="${TK}" stroke-width="1.5" stroke-linejoin="round"/>` : '');
}
function ojosPar(x1, x2, y, s, o, enojo){
  const cejas = enojo ? `<path d="M${x1 - 10 * s} ${y - 13 * s} L${x1 + 7 * s} ${y - 8 * s} M${x2 + 10 * s} ${y - 13 * s} L${x2 - 7 * s} ${y - 8 * s}" ${L3}/>` : '';
  return `<g class="ojos" style="animation-delay:${o.parpadeo || 0}s">${ojo(x1, y, s, o.iris)}${ojo(x2, y, s, o.iris)}</g>${cejas}`;
}
const garras = (pts, col = '#FFF0D0') => pts.map(([x, y, r = 0]) => `<path d="M${x - 3} ${y} l3 6 l3 -6Z" transform="rotate(${r} ${x} ${y})" fill="${col}" stroke="${TK}" stroke-width="1.5" stroke-linejoin="round"/>`).join('');

const INICIALES_V2 = {
  /* ---------------- Fuego ---------------- */
  carosor: o => {
    const C = '#F47A45', D = '#D85A2A', B = '#FFD98A', Cu = '#FFF0D0';
    return `
    <path d="M124 160 C150 164 168 150 172 128 C174 118 184 118 184 130 C184 154 164 176 128 176Z" fill="${C}" ${L4}/>
    ${llamaG(178, 122, .9)}
    <path d="M64 176 C60 162 70 154 82 156 C94 158 98 170 96 182 C88 188 70 188 64 176Z" fill="${D}" ${L4}/>${garras([[70, 182], [80, 185], [90, 183]], Cu)}
    <path d="M136 176 C140 162 130 154 118 156 C106 158 102 170 104 182 C112 188 130 188 136 176Z" fill="${D}" ${L4}/>${garras([[110, 183], [120, 185], [130, 182]], Cu)}
    <path d="M100 104 C132 104 146 130 144 152 C142 172 124 182 100 182 C76 182 58 172 56 152 C54 130 68 104 100 104Z" fill="${C}" ${L4}/>
    <path d="M100 118 C118 118 128 136 126 154 C124 170 112 178 100 178 C88 178 76 170 74 154 C72 136 82 118 100 118Z" fill="${B}" ${L3}/>
    <path d="M80 136 Q100 142 120 136 M77 152 Q100 158 123 152 M80 167 Q100 172 120 167" fill="none" stroke="#E8B860" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M72 122 C58 124 50 138 54 150 C56 158 64 158 68 152 C70 144 74 138 82 134Z" fill="${C}" ${L3}/>${garras([[56, 152, 20], [62, 155, 10]], Cu)}
    <path d="M128 122 C142 124 150 138 146 150 C144 158 136 158 132 152 C130 144 126 138 118 134Z" fill="${C}" ${L3}/>${garras([[144, 152, -20], [138, 155, -10]], Cu)}
    ${llamaG(100, 44, .55)}
    <path d="M70 52 C60 40 62 24 72 18 C74 32 82 40 88 44Z" fill="${Cu}" ${L3}/><path d="M130 52 C140 40 138 24 128 18 C126 32 118 40 112 44Z" fill="${Cu}" ${L3}/>
    <path d="M100 38 C138 38 158 60 156 88 C154 112 134 126 100 126 C66 126 46 112 44 88 C42 60 62 38 100 38Z" fill="${C}" ${L4}/>
    <path d="M60 72 C66 66 74 66 78 70 M140 72 C134 66 126 66 122 70" fill="none" stroke="${D}" stroke-width="3" stroke-linecap="round" opacity=".6"/>
    ${envolverCara(`<path d="M100 92 C122 92 134 100 132 112 C130 120 118 124 100 124 C82 124 70 120 68 112 C66 100 78 92 100 92Z" fill="${B}" ${L3}/>
      <ellipse cx="93" cy="101" rx="2.4" ry="1.8" fill="${TK}"/><ellipse cx="107" cy="101" rx="2.4" ry="1.8" fill="${TK}"/>
      <ellipse cx="62" cy="96" rx="8" ry="5" fill="#FF8FAE" opacity=".75"/><ellipse cx="138" cy="96" rx="8" ry="5" fill="#FF8FAE" opacity=".75"/>
      ${ojosPar(80, 120, 76, 1.05, o)}${bocaCaricatura(100, 110, o, 11, true)}`, 100, 86, o)}`;
  },
  /* ---------------- Planta ---------------- */
  matesor: o => {
    const C = '#72C25B', D = '#4FA03C', B = '#E5F5C6', H = '#9BDB6E';
    return `
    <path d="M58 158 C40 166 28 160 26 148 C36 152 46 148 58 140Z" fill="${C}" ${L4}/>
    <path d="M66 176 C62 162 72 156 84 158 C96 160 98 172 96 182 C86 188 70 188 66 176Z" fill="${D}" ${L4}/>${garras([[72, 182], [82, 185], [92, 183]], '#F4F9E8')}
    <path d="M134 176 C138 162 128 156 116 158 C104 160 102 172 104 182 C114 188 130 188 134 176Z" fill="${D}" ${L4}/>${garras([[108, 183], [118, 185], [128, 182]], '#F4F9E8')}
    <path d="M100 106 C132 106 146 130 144 152 C142 172 124 182 100 182 C76 182 58 172 56 152 C54 130 68 106 100 106Z" fill="${C}" ${L4}/>
    <path d="M100 122 C118 122 128 138 126 154 C124 170 112 178 100 178 C88 178 76 170 74 154 C72 138 82 122 100 122Z" fill="${B}" ${L3}/>
    <circle cx="66" cy="132" r="5" fill="${D}"/><circle cx="136" cy="128" r="4.5" fill="${D}"/><circle cx="140" cy="148" r="3.5" fill="${D}"/><circle cx="62" cy="150" r="3.5" fill="${D}"/>
    <path d="M70 124 C58 128 52 140 56 150 C58 156 66 156 68 150 C70 144 74 138 80 134Z" fill="${C}" ${L3}/>
    <path d="M130 124 C142 128 148 140 144 150 C142 156 134 156 132 150 C130 144 126 138 120 134Z" fill="${C}" ${L3}/>
    <path d="M100 44 Q98 30 102 16" fill="none" stroke="${TK}" stroke-width="5" stroke-linecap="round"/><path d="M100 44 Q98 30 102 16" fill="none" stroke="#5DA84A" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M101 22 C86 4 66 10 62 18 C76 28 92 30 101 22Z" fill="${H}" ${L3}/><path d="M101 22 C80 18 72 18 64 18" fill="none" stroke="#5DA84A" stroke-width="2"/>
    <path d="M102 20 C112 0 134 2 140 10 C128 22 112 26 102 20Z" fill="${H}" ${L3}/><path d="M102 20 C118 12 128 10 138 10" fill="none" stroke="#5DA84A" stroke-width="2"/>
    <path d="M100 40 C136 40 156 62 154 90 C152 114 132 128 100 128 C68 128 48 114 46 90 C44 62 64 40 100 40Z" fill="${C}" ${L4}/>
    <circle cx="70" cy="62" r="4" fill="${D}"/><circle cx="132" cy="58" r="5" fill="${D}"/>
    ${envolverCara(`<ellipse cx="64" cy="100" rx="8" ry="5" fill="#FF8FAE" opacity=".75"/><ellipse cx="136" cy="100" rx="8" ry="5" fill="#FF8FAE" opacity=".75"/>
      ${ojosPar(80, 120, 82, 1.05, o)}${bocaCaricatura(100, 104, o, 10)}`, 100, 90, o)}`;
  },
  matetitan: o => {
    const C = '#4E9E44', D = '#367530', B = '#D8EDB0', Ca = '#8A6A3E', H = '#6FBF4F', T = '#7A4F2C';
    return `
    <path d="M100 4 C126 0 150 10 156 28 C176 30 188 48 180 64 C192 76 184 98 164 98 C156 108 136 108 128 100 C116 108 92 108 80 100 C70 108 48 106 42 94 C24 92 16 72 28 60 C22 42 38 26 56 28 C64 12 82 6 100 4Z" fill="${H}" ${L4}/>
    <path d="M60 50 C66 44 76 44 80 50 M112 34 C120 30 130 34 132 42 M144 60 C152 58 160 64 158 72 M86 70 C92 66 100 68 102 74" fill="none" stroke="#4A9A38" stroke-width="3" stroke-linecap="round"/>
    <circle cx="70" cy="80" r="5" fill="#FF8FB1" ${L3}/><circle cx="138" cy="44" r="5" fill="#FF8FB1" ${L3}/><circle cx="112" cy="84" r="4.5" fill="#FFD23F" ${L3}/>
    <path d="M92 98 L90 126 L112 126 L108 98Z" fill="${T}" ${L3}/>
    <path d="M28 142 C24 112 54 96 100 96 C146 96 176 112 172 142 C170 158 150 166 100 166 C50 166 30 158 28 142Z" fill="${Ca}" ${L4}/>
    <path d="M100 98 V164 M60 104 L72 162 M140 104 L128 162 M34 134 H166" fill="none" stroke="#6E5230" stroke-width="3" opacity=".8"/>
    <path d="M40 160 C36 176 40 186 48 190 L70 190 C74 180 72 168 70 160Z" fill="${C}" ${L4}/>${garras([[50, 190], [59, 191], [68, 190]], '#F4F9E8')}
    <path d="M160 160 C164 176 160 186 152 190 L130 190 C126 180 128 168 130 160Z" fill="${C}" ${L4}/>${garras([[132, 190], [141, 191], [150, 190]], '#F4F9E8')}
    <path d="M100 150 C130 150 146 164 144 176 C142 186 124 190 100 190 C76 190 58 186 56 176 C54 164 70 150 100 150Z" fill="${B}" ${L3}/>
    <path d="M20 132 C6 124 2 108 8 98 C18 106 24 116 30 126Z" fill="${C}" ${L3}/>
    <path d="M58 104 C36 98 18 112 16 130 C14 152 30 164 52 162 C70 160 82 146 82 128 C82 112 74 106 58 104Z" fill="${C}" ${L4}/>
    <path d="M24 108 C18 100 18 88 26 84 C28 92 32 98 38 102Z M70 108 C76 100 76 88 68 84 C66 92 62 98 56 102Z" fill="#F4E8D2" ${L3}/>
    ${envolverCara(`<path d="M22 140 C30 150 44 154 58 150" fill="none" ${L3}/><ellipse cx="22" cy="132" rx="3" ry="2.2" fill="${TK}"/>
      ${ojosPar(36, 64, 122, .85, o, true)}${o.humor === 'feliz' ? '<path d="M30 146 Q42 156 54 148 Z" fill="#B8364F" stroke="#22304A" stroke-width="2.5" stroke-linejoin="round"/>' : ''}`, 48, 130, o)}`;
  },
  /* ---------------- Agua (el yorkie sigue siendo Rufisor) ---------------- */
};

/* =====================================================================
   Fondos ilustrados para los combates, uno por tipo de zona.
   ===================================================================== */
function svgFondoArena(tipo){
  const cerros = (y, col, amp, sem, sombra) => {
    let d = `M0 300 L0 ${y}`;
    for(let x = 0; x <= 400; x += 40){ const h = Math.sin(x * .021 + sem) * amp + Math.sin(x * .053 + sem * 2) * amp * .4; d += ` Q${x + 20} ${y - h - amp * .6} ${x + 40} ${y - h * .5}`; }
    return `<path d="${d} L400 300Z" fill="${col}"/>` + (sombra ? `<path d="${d} L400 300Z" fill="${sombra}" transform="translate(0 6)" opacity=".35"/>` : '');
  };
  const nube = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" fill="#fff" opacity=".92"><ellipse cx="0" cy="0" rx="26" ry="12"/><ellipse cx="18" cy="-8" rx="18" ry="14"/><ellipse cx="-16" cy="-5" rx="14" ry="10"/><ellipse cx="34" cy="2" rx="16" ry="9"/></g>`;
  const pino = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-3" y="-6" width="6" height="12" fill="#6B4426"/><path d="M0 -60 L18 -28 H10 L24 -8 H-24 L-10 -28 H-18Z" fill="${c}"/></g>`;
  const arbol = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-4" y="-14" width="8" height="18" fill="#7A4F2C"/><circle cx="0" cy="-30" r="20" fill="${c}"/><circle cx="-14" cy="-22" r="13" fill="${c}"/><circle cx="14" cy="-22" r="13" fill="${c}"/></g>`;
  const pasto = (n, y0, y1, c, sem) => { let s = ''; for(let i = 0; i < n; i++){ const x = (i * 97 + sem * 31) % 400, y = y0 + ((i * 53 + sem * 17) % (y1 - y0)); s += `<path d="M${x} ${y} l3 -9 l2 9 l3 -7 l2 7" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`; } return s; };
  const cielo = (a, b) => `<defs><linearGradient id="cielo-${tipo}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="400" height="300" fill="url(#cielo-${tipo})"/>`;
  const piso = (a, b) => `<defs><linearGradient id="piso-${tipo}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect y="160" width="400" height="140" fill="url(#piso-${tipo})"/>`;
  const F = {
    pradera: () => cielo('#8FD0F5', '#E6F6FF') + `<circle cx="330" cy="50" r="26" fill="#FFF3B0"/><circle cx="330" cy="50" r="38" fill="#FFF3B0" opacity=".3"/>` + nube(80, 50, 1) + nube(250, 80, .7)
      + cerros(150, '#A8D98E', 14, 1) + cerros(162, '#86C46E', 10, 3) + piso('#8DD17C', '#5FAF55') + pasto(26, 175, 295, '#4E9A46', 1)
      + [[40, 200], [120, 260], [300, 230], [360, 280]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#FFD23F"/><circle cx="${x + 8}" cy="${y + 4}" r="3" fill="#FF8FB1"/>`).join(''),
    bosque: () => cielo('#7CC4C4', '#D6F0E6') + nube(300, 40, .8) + cerros(130, '#5E9E74', 12, 2)
      + [20, 70, 120, 280, 330, 380].map((x, i) => pino(x, 166, 1.1 + (i % 2) * .3, '#3E7A54')).join('') + [50, 160, 240, 360].map((x, i) => arbol(x, 170, .9 + (i % 2) * .2, '#4F9A5E')).join('')
      + piso('#6CB36A', '#3F8A48') + pasto(30, 175, 295, '#2F6E3A', 2),
    rio: () => cielo('#93D2F5', '#EAF7FF') + nube(120, 46, .9) + nube(320, 70, .6) + cerros(146, '#A2D48E', 12, 4) + piso('#9ED68C', '#6FB866')
      + `<path d="M0 196 C80 186 160 206 240 196 C300 188 360 200 400 194 L400 236 C340 244 280 230 220 240 C140 252 70 232 0 242Z" fill="#5AB4E8"/><path d="M30 214 h40 M150 222 h50 M280 210 h36 M340 226 h30" stroke="#DFF4FF" stroke-width="3" stroke-linecap="round" opacity=".8"/>` + pasto(22, 250, 295, '#4E9A46', 3),
    sierras: () => cielo('#F8D6A8', '#FFF1DC') + `<circle cx="80" cy="60" r="24" fill="#FFE9A8"/>`
      + `<path d="M0 160 L60 80 L110 130 L170 60 L240 140 L300 90 L360 130 L400 100 V300 H0Z" fill="#C9A27A"/><path d="M170 60 L190 84 L178 86 L170 74 L160 88 L152 82Z M60 80 L74 98 L60 96 L50 92Z" fill="#F4E8D2"/>`
      + cerros(170, '#D9BB8E', 10, 5) + piso('#E2C99A', '#C9A878') + [[60, 220, 1], [300, 250, 1.3], [200, 280, .8]].map(([x, y, s]) => `<ellipse cx="${x}" cy="${y}" rx="${16 * s}" ry="${9 * s}" fill="#9AA2AD" stroke="#22304A" stroke-width="2"/>`).join(''),
    cumbres: () => cielo('#A8B4E6', '#E8ECFA') + `<path d="M0 170 L70 70 L130 140 L200 50 L270 130 L330 80 L400 140 V300 H0Z" fill="#8E9CC8"/><path d="M70 70 L92 100 L78 98 L70 88 L60 100 L52 96Z M200 50 L224 84 L210 82 L200 70 L188 86 L178 80Z M330 80 L350 106 L336 104 L326 96Z" fill="#fff"/>`
      + piso('#EEF5FA', '#C9DCEA') + Array.from({length: 18}, (_, i) => `<circle cx="${(i * 71) % 400}" cy="${(i * 37) % 300}" r="${1.5 + (i % 3)}" fill="#fff" opacity=".9"/>`).join(''),
    volcan: () => cielo('#E2785A', '#F8C79A') + `<path d="M120 170 L190 60 H230 L300 170Z" fill="#6E5A4A"/><path d="M190 60 C200 70 220 70 230 60 C222 52 198 52 190 60Z" fill="#FF6B3D"/><path d="M200 62 C206 90 196 110 204 140" fill="none" stroke="#FF8A3D" stroke-width="6" stroke-linecap="round"/>`
      + `<g fill="#5A4A40" opacity=".7"><circle cx="214" cy="40" r="14"/><circle cx="226" cy="22" r="18"/><circle cx="244" cy="6" r="14"/></g>` + cerros(172, '#8F7B6A', 8, 6) + piso('#8F7B6A', '#5E4C42')
      + `<path d="M40 230 l30 6 l20 -8 M260 260 l26 4 l18 -10 M150 280 l24 -4" fill="none" stroke="#FF8A3D" stroke-width="3" stroke-linecap="round"/>`,
    ciudad: () => cielo('#9BD4F2', '#EAF6FF') + nube(90, 46, .8) + nube(300, 60, .7)
      + [[10, 110, 60, '#E2574C'], [80, 96, 70, '#5AB4E8'], [160, 120, 50, '#FFD23F'], [220, 100, 80, '#7A4FC9'], [310, 112, 70, '#4CC27A']].map(([x, y, w, c]) => `<rect x="${x}" y="${y}" width="${w}" height="${170 - y}" fill="#F4E8D2" stroke="#22304A" stroke-width="2"/><path d="M${x - 6} ${y} L${x + w / 2} ${y - 22} L${x + w + 6} ${y}Z" fill="${c}" stroke="#22304A" stroke-width="2"/><rect x="${x + w / 2 - 8}" y="${y + 18}" width="16" height="14" fill="#BFE6FB" stroke="#22304A" stroke-width="1.5"/>`).join('')
      + piso('#D9D0C1', '#B9AE9C') + Array.from({length: 40}, (_, i) => `<rect x="${(i % 10) * 40 + (Math.floor(i / 10) % 2) * 20}" y="${175 + Math.floor(i / 10) * 30}" width="36" height="26" rx="4" fill="none" stroke="#A89C88" stroke-width="1.5"/>`).join(''),
  };
  return `<svg class="fondo-arena" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${(F[tipo] || F.ciudad)()}</svg>`;
}

/* ---------------- Legendarios, cada uno con ilustración propia ---------------- */
Object.assign(INICIALES_V2, {
  // Intiraya: león del sol, con melena de rayos y cola de fuego.
  intiraya: o => {
    const C = '#FFC93C', D = '#E8A21B', M = '#E8742B', B = '#FFF3B0';
    const rayos = Array.from({length: 14}, (_, i) => { const a = (i / 14) * Math.PI * 2, x1 = 70 + Math.cos(a) * 40, y1 = 82 + Math.sin(a) * 40, x2 = 70 + Math.cos(a) * 66, y2 = 82 + Math.sin(a) * 66, xa = 70 + Math.cos(a + .2) * 44, ya = 82 + Math.sin(a + .2) * 44;
      return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)} L${xa.toFixed(1)} ${ya.toFixed(1)}Z" fill="${i % 2 ? '#FFE36B' : '#FF9F2E'}" ${L3}/>`; }).join('');
    return `<circle cx="70" cy="82" r="74" fill="#FFF3B0" opacity=".35"/>${rayos}
    <path d="M160 124 C178 112 188 92 186 72 C196 84 196 104 186 120 C178 134 166 140 156 140Z" fill="${C}" ${L4}/>${llamaG(190, 72, 1.1)}
    <path d="M146 150 C144 166 146 178 150 190 L168 190 C168 176 168 162 164 150Z" fill="${D}" ${L4}/>
    <path d="M70 116 C96 104 148 106 168 122 C184 136 178 160 156 164 C126 170 96 168 80 158 C62 148 56 126 70 116Z" fill="${C}" ${L4}/>
    <path d="M90 156 C110 164 136 166 154 160 C142 168 112 170 94 164Z" fill="${B}"/>
    <path d="M150 154 C150 168 152 178 156 190 L174 190 C174 176 172 162 168 152Z" fill="${C}" ${L4}/>${garras([[160, 190], [168, 191]])}
    <path d="M84 152 C84 166 84 178 86 190 L104 190 C104 178 104 164 102 154Z" fill="${C}" ${L4}/>${garras([[90, 190], [98, 191]])}
    <path d="M106 154 C106 168 108 178 110 190 L126 190 C126 178 126 166 124 156Z" fill="${C}" ${L4}/>${garras([[114, 190], [121, 191]])}
    <path d="M70 34 C102 34 120 56 118 84 C116 108 98 124 70 124 C42 124 24 108 22 84 C20 56 38 34 70 34Z" fill="${M}" ${L4}/>
    <path d="M70 48 C94 48 106 64 104 86 C102 104 88 116 70 116 C52 116 38 104 36 86 C34 64 46 48 70 48Z" fill="${C}" ${L4}/>
    <path d="M58 40 L62 24 L70 34 L78 22 L82 40Z" fill="#FFE36B" ${L3}/><circle cx="70" cy="56" r="5" fill="#E2574C" ${L3}/>
    ${envolverCara(`<path d="M70 86 C84 86 92 94 90 102 C88 110 80 114 70 114 C60 114 52 110 50 102 C48 94 56 86 70 86Z" fill="${B}" ${L3}/>
      <path d="M64 92 L70 98 L76 92Z" fill="${TK}"/>${ojosPar(56, 84, 76, .85, o, true)}${bocaCaricatura(70, 104, o, 8, true)}`, 70, 84, o)}`;
  },
  // Yacurá: serpiente de agua enroscada, con aletas como velos y una perla.
  yacura: o => {
    const C = '#3FB8B0', D = '#1F7A82', B = '#D6F5F2', A = '#8FE3FF';
    return `<circle cx="100" cy="100" r="92" fill="#DFF8FF" opacity=".45"/>
    <path d="M150 170 C190 160 196 120 170 104 C186 128 172 150 146 152Z" fill="${A}" ${L3}/>
    <path d="M60 176 C30 176 20 150 40 132 C60 114 100 124 120 140 C140 156 170 160 176 140 C182 120 162 104 140 108 C152 92 182 96 190 120 C198 148 172 182 132 180 C110 180 96 166 80 156 C66 148 54 152 56 162 C58 170 70 172 78 168 C74 178 66 178 60 176Z" fill="${C}" ${L4}/>
    <path d="M44 140 C60 128 92 132 114 146 M64 168 C76 158 90 160 104 170" fill="none" stroke="${B}" stroke-width="5" stroke-linecap="round"/>
    <path d="M130 116 C120 96 118 76 124 60 C134 78 140 92 142 108Z" fill="${A}" ${L3}/>
    <path d="M100 34 C134 34 150 58 148 84 C146 106 128 120 104 122 C96 136 90 144 92 156 C78 146 76 128 82 116 C64 108 54 92 56 74 C58 50 74 34 100 34Z" fill="${C}" ${L4}/>
    <path d="M74 44 C66 26 72 10 84 4 C84 20 90 30 98 36Z M126 44 C134 26 128 10 116 4 C116 20 110 30 102 36Z" fill="${A}" ${L3}/>
    <path d="M58 90 C40 96 30 110 34 122 M60 98 C48 108 46 122 52 130" fill="none" stroke="${TK}" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="100" cy="26" r="9" fill="#FFFDF8" ${L3}/><circle cx="97" cy="23" r="3" fill="#fff"/>
    ${envolverCara(`<path d="M100 88 C118 88 128 96 126 106 C124 114 114 118 100 118 C86 118 76 114 74 106 C72 96 82 88 100 88Z" fill="${B}" ${L3}/>
      ${ojosPar(84, 116, 72, .9, o)}${bocaCaricatura(100, 104, o, 9)}`, 100, 82, o)}`;
  },
  // Huracanto: ave de la tormenta con las alas abiertas y plumas de rayo.
  huracanto: o => {
    const C = '#7A4FC9', D = '#4B2E8A', B = '#E6DCF7', Y = '#FFE45C';
    const pluma = (x, y, r, l, col) => `<path d="M${x} ${y} C${x - 8} ${y - l * .4} ${x - 6} ${y - l * .8} ${x} ${y - l} C${x + 6} ${y - l * .8} ${x + 8} ${y - l * .4} ${x} ${y}Z" transform="rotate(${r} ${x} ${y})" fill="${col}" ${L3}/>`;
    return `<circle cx="100" cy="100" r="92" fill="#F3EDFF" opacity=".5"/>
    ${[-70, -56, -42, -28].map((r, i) => pluma(66, 110, r, 70 - i * 6, i % 2 ? D : C)).join('')}
    ${[70, 56, 42, 28].map((r, i) => pluma(134, 110, r, 70 - i * 6, i % 2 ? D : C)).join('')}
    <path d="M86 160 L76 196 L90 182 L96 198 L102 170Z M114 160 L126 194 L114 182Z" fill="${Y}" ${L3}/>
    <path d="M88 170 v14 M80 188 l8 -4 l8 4 M112 170 v14 M104 188 l8 -4 l8 4" stroke="#E59A3B" stroke-width="4.5" stroke-linecap="round" fill="none"/>
    <path d="M100 76 C132 76 146 104 144 130 C142 156 124 172 100 172 C76 172 58 156 56 130 C54 104 68 76 100 76Z" fill="${C}" ${L4}/>
    <path d="M100 108 C118 108 128 122 126 140 C124 156 112 166 100 166 C88 166 76 156 74 140 C72 122 82 108 100 108Z" fill="${B}" ${L3}/>
    <path d="M90 124 l8 -10 l-2 9 l8 -2 l-10 14 l2 -9Z" fill="${Y}" ${L3}/>
    <path d="M84 30 L90 6 L98 26 L108 2 L112 28 L124 12 L120 40Z" fill="${Y}" ${L3}/>
    <path d="M100 26 C128 26 142 46 140 68 C138 88 122 100 100 100 C78 100 62 88 60 68 C58 46 72 26 100 26Z" fill="${C}" ${L4}/>
    ${envolverCara(`<path d="M90 70 L110 70 L100 88Z" fill="#F0A93B" ${L3}/>${ojosPar(84, 116, 58, .9, o, true)}`, 100, 64, o)}`;
  },
});
