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
  carosaurio: o => {
    const C = '#E8653A', D = '#C24A22', B = '#FFD98A', Cu = '#FFF0D0';
    return `
    <path d="M120 150 C150 156 172 140 180 110 C184 96 196 98 192 114 C186 146 160 172 122 172Z" fill="${C}" ${L4}/>
    ${llamaG(188, 104, 1.15)}
    <path d="M106 96 L112 82 L120 96 L128 84 L134 100 L142 90 L144 108Z" fill="${D}" ${L3}/>
    <path d="M60 182 C56 166 64 152 80 152 C94 152 98 166 96 184 C86 190 68 190 60 182Z" fill="${D}" ${L4}/>${garras([[66, 186], [77, 189], [88, 187]], Cu)}
    <path d="M140 182 C144 166 136 152 120 152 C106 152 102 166 104 184 C114 190 132 190 140 182Z" fill="${D}" ${L4}/>${garras([[112, 187], [123, 189], [134, 186]], Cu)}
    <path d="M100 92 C134 92 150 122 148 150 C146 172 126 182 100 182 C74 182 54 172 52 150 C50 122 66 92 100 92Z" fill="${C}" ${L4}/>
    <path d="M100 108 C120 108 130 128 128 150 C126 168 114 176 100 176 C86 176 74 168 72 150 C70 128 80 108 100 108Z" fill="${B}" ${L3}/>
    <path d="M78 126 Q100 132 122 126 M75 142 Q100 148 125 142 M76 158 Q100 164 124 158" fill="none" stroke="#E8B860" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M66 112 C48 116 40 134 44 148 C46 156 56 156 60 150 C62 140 68 132 78 126Z" fill="${C}" ${L3}/>${garras([[45, 150, 25], [51, 154, 12], [57, 155, 0]], Cu)}
    <path d="M134 112 C152 116 160 134 156 148 C154 156 144 156 140 150 C138 140 132 132 122 126Z" fill="${C}" ${L3}/>${garras([[155, 150, -25], [149, 154, -12], [143, 155, 0]], Cu)}
    <path d="M64 50 C50 40 46 20 56 10 C60 26 70 34 80 38Z" fill="${Cu}" ${L3}/><path d="M136 50 C150 40 154 20 144 10 C140 26 130 34 120 38Z" fill="${Cu}" ${L3}/>
    ${llamaG(100, 36, .8)}
    <path d="M100 30 C136 30 156 50 156 76 C156 98 140 112 120 116 L80 116 C60 112 44 98 44 76 C44 50 64 30 100 30Z" fill="${C}" ${L4}/>
    ${envolverCara(`<path d="M100 82 C126 82 140 92 138 104 C136 114 122 118 100 118 C78 118 64 114 62 104 C60 92 74 82 100 82Z" fill="${B}" ${L3}/>
      <ellipse cx="92" cy="92" rx="2.6" ry="2" fill="${TK}"/><ellipse cx="108" cy="92" rx="2.6" ry="2" fill="${TK}"/>
      <ellipse cx="60" cy="86" rx="7" ry="4.5" fill="#FF8FAE" opacity=".6"/><ellipse cx="140" cy="86" rx="7" ry="4.5" fill="#FF8FAE" opacity=".6"/>
      ${ojosPar(78, 122, 66, 1, o, true)}${bocaCaricatura(100, 102, o, 13, true)}`, 100, 76, o)}`;
  },
  carotitan: o => {
    const C = '#D9542E', D = '#A83A1A', B = '#FFD08A', Cu = '#FFF0D0', A = '#5B3A8C';
    return `
    <path d="M70 92 C40 70 14 70 4 86 C16 88 18 98 12 108 C24 104 30 112 26 124 C38 116 46 122 46 132 C56 120 64 112 74 108Z" fill="${A}" ${L4}/>
    <path d="M130 92 C160 70 186 70 196 86 C184 88 182 98 188 108 C176 104 170 112 174 124 C162 116 154 122 154 132 C144 120 136 112 126 108Z" fill="${A}" ${L4}/>
    <path d="M30 96 L64 104 M14 96 L60 110 M22 112 L52 118" fill="none" stroke="#7E5BB8" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M170 96 L136 104 M186 96 L140 110 M178 112 L148 118" fill="none" stroke="#7E5BB8" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M124 156 C156 164 180 150 186 124 C190 112 200 116 196 130 C188 162 158 182 124 180Z" fill="${C}" ${L4}/>
    ${llamaG(194, 124, 1.35)}
    <path d="M58 186 C52 168 60 150 78 150 C94 150 98 168 96 188 C84 194 64 194 58 186Z" fill="${D}" ${L4}/>${garras([[62, 190, 8], [74, 193], [86, 192]], Cu)}
    <path d="M142 186 C148 168 140 150 122 150 C106 150 102 168 104 188 C116 194 136 194 142 186Z" fill="${D}" ${L4}/>${garras([[114, 192], [126, 193], [138, 190, -8]], Cu)}
    <path d="M100 82 C138 82 156 116 154 148 C152 174 128 186 100 186 C72 186 48 174 46 148 C44 116 62 82 100 82Z" fill="${C}" ${L4}/>
    <path d="M100 100 C122 100 134 124 132 150 C130 170 116 180 100 180 C84 180 70 170 68 150 C66 124 78 100 100 100Z" fill="${B}" ${L3}/>
    <path d="M76 120 Q100 128 124 120 M72 138 Q100 146 128 138 M72 156 Q100 164 128 156 M78 172 Q100 178 122 172" fill="none" stroke="#E0A850" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M60 100 C38 104 26 124 30 144 C32 154 44 156 50 148 C52 136 60 124 74 118Z" fill="${C}" ${L4}/>${garras([[30, 146, 30], [36, 152, 18], [43, 155, 5]], Cu)}
    <path d="M140 100 C162 104 174 124 170 144 C168 154 156 156 150 148 C148 136 140 124 126 118Z" fill="${C}" ${L4}/>${garras([[170, 146, -30], [164, 152, -18], [157, 155, -5]], Cu)}
    ${llamaG(66, 96, .7)}${llamaG(134, 96, .7)}
    <path d="M62 44 C44 36 36 14 46 0 C52 18 64 26 78 30Z" fill="${Cu}" ${L3}/><path d="M138 44 C156 36 164 14 154 0 C148 18 136 26 122 30Z" fill="${Cu}" ${L3}/>
    ${llamaG(100, 30, .95)}
    <path d="M100 24 C138 24 158 44 158 70 C158 92 142 106 122 110 L78 110 C58 106 42 92 42 70 C42 44 62 24 100 24Z" fill="${C}" ${L4}/>
    ${envolverCara(`<path d="M100 76 C128 76 142 86 140 98 C138 108 124 112 100 112 C76 112 62 108 60 98 C58 86 72 76 100 76Z" fill="${B}" ${L3}/>
      <ellipse cx="91" cy="86" rx="2.8" ry="2.2" fill="${TK}"/><ellipse cx="109" cy="86" rx="2.8" ry="2.2" fill="${TK}"/>
      ${ojosPar(76, 124, 60, .95, o, true)}${bocaCaricatura(100, 96, o, 14, true)}`, 100, 70, o)}`;
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
  matesaurio: o => {
    const C = '#5FB24A', D = '#3E8A30', B = '#E0F2C0', H = '#8ED063', T = '#8A5A35';
    return `
    <path d="M120 70 C112 50 120 28 140 22 C150 10 172 14 176 30 C192 34 194 56 180 66 C178 80 158 86 146 78 C136 86 120 84 120 70Z" fill="${H}" ${L4}/>
    <path d="M132 40 C140 36 150 40 152 48 M160 34 C168 36 172 44 168 52" fill="none" stroke="#5DA84A" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M140 74 L144 100 L132 100 Z" fill="${T}" ${L3}/>
    <path d="M56 160 C34 170 20 160 18 146 C32 150 44 146 58 136Z" fill="${C}" ${L4}/>
    <path d="M60 184 C56 168 64 154 80 154 C94 154 98 168 96 186 C86 192 68 192 60 184Z" fill="${D}" ${L4}/>${garras([[66, 188], [77, 191], [88, 189]], '#F4F9E8')}
    <path d="M140 184 C144 168 136 154 120 154 C106 154 102 168 104 186 C114 192 132 192 140 184Z" fill="${D}" ${L4}/>${garras([[112, 189], [123, 191], [134, 188]], '#F4F9E8')}
    <path d="M100 96 C136 96 152 124 150 150 C148 172 126 184 100 184 C74 184 52 172 50 150 C48 124 64 96 100 96Z" fill="${C}" ${L4}/>
    <path d="M100 112 C120 112 130 132 128 152 C126 170 114 178 100 178 C86 178 74 170 72 152 C70 132 80 112 100 112Z" fill="${B}" ${L3}/>
    <path d="M64 114 C48 118 42 134 46 146 C48 154 58 154 60 148 C62 140 68 132 76 128Z" fill="${C}" ${L3}/>
    <path d="M136 114 C152 118 158 134 154 146 C152 154 142 154 140 148 C138 140 132 132 124 128Z" fill="${C}" ${L3}/>
    <path d="M58 52 C40 44 34 28 42 20 C52 26 60 36 66 46Z M142 52 C160 44 166 28 158 20 C148 26 140 36 134 46Z" fill="${H}" ${L3}/>
    <path d="M100 34 C138 34 156 56 154 84 C152 108 132 120 100 120 C68 120 48 108 46 84 C44 56 62 34 100 34Z" fill="${C}" ${L4}/>
    <circle cx="70" cy="54" r="4.5" fill="${D}"/><circle cx="128" cy="50" r="5" fill="${D}"/><circle cx="62" cy="134" r="4" fill="${D}"/><circle cx="140" cy="138" r="4" fill="${D}"/>
    ${envolverCara(`<ellipse cx="62" cy="92" rx="7" ry="4.5" fill="#FF8FAE" opacity=".65"/><ellipse cx="138" cy="92" rx="7" ry="4.5" fill="#FF8FAE" opacity=".65"/>
      ${ojosPar(80, 120, 74, 1, o)}${bocaCaricatura(100, 98, o, 11)}`, 100, 82, o)}`;
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
  rufisaurio: o => {
    const A = '#3E86D0', Ao = '#2A63A8', K = '#E2AE6C', Ko = '#C98A47', Ag = '#8FD3F7';
    return `
    <path d="M140 150 C162 146 176 128 174 108 C186 116 190 138 178 156 C170 166 154 170 140 168Z" fill="${A}" ${L4}/>
    <path d="M174 108 C180 96 192 96 196 104 C188 106 184 112 182 120Z" fill="${Ag}" ${L3}/>
    <path d="M58 184 C54 170 62 158 76 158 C90 158 94 170 92 186 C82 192 64 192 58 184Z" fill="${K}" ${L4}/>${garras([[64, 188], [74, 191], [84, 189]], '#FFFDF8')}
    <path d="M142 184 C146 170 138 158 124 158 C110 158 106 170 108 186 C118 192 136 192 142 184Z" fill="${K}" ${L4}/>${garras([[116, 189], [126, 191], [136, 188]], '#FFFDF8')}
    <path d="M100 98 C134 98 152 126 150 152 C148 174 126 186 100 186 C74 186 52 174 50 152 C48 126 66 98 100 98Z" fill="${A}" ${L4}/>
    <path d="M58 150 Q66 166 60 180 M76 140 Q82 162 76 182 M124 140 Q118 162 124 182 M142 150 Q134 166 140 180" fill="none" stroke="${Ao}" stroke-width="2.5" stroke-linecap="round" opacity=".75"/>
    <path d="M100 116 C120 116 128 134 126 150 C124 164 112 170 100 170 C88 170 76 164 74 150 C72 134 80 116 100 116Z" fill="${K}" ${L3}/>
    <path d="M70 116 C54 120 48 136 52 148 C54 156 64 156 66 150 C68 142 72 136 80 132Z" fill="${K}" ${L3}/>
    <path d="M130 116 C146 120 152 136 148 148 C146 156 136 156 134 150 C132 142 128 136 120 132Z" fill="${K}" ${L3}/>
    <path d="M58 62 L40 18 C56 22 70 36 78 50Z" fill="${Ag}" ${L3}/><path d="M142 62 L160 18 C144 22 130 36 122 50Z" fill="${Ag}" ${L3}/>
    <path d="M52 64 L50 26 L76 50Z M148 64 L150 26 L124 50Z" fill="${K}" ${L3}/>
    <path d="M100 36 C138 36 156 60 154 88 C152 112 132 126 100 126 C68 126 48 112 46 88 C44 60 62 36 100 36Z" fill="${K}" ${L4}/>
    <path d="M58 74 C62 48 84 40 100 42 C116 40 138 48 142 74 C130 62 116 60 100 66 C84 60 70 62 58 74Z" fill="${A}" ${L3}/>
    <path d="M100 44 C94 30 98 20 104 14 C108 24 106 34 100 44Z" fill="${Ag}" ${L3}/>
    <path d="M52 82 C46 106 52 124 64 132 C62 116 64 104 68 96Z M148 82 C154 106 148 124 136 132 C138 116 136 104 132 96Z" fill="${Ko}" ${L3}/>
    ${envolverCara(`<path d="M100 96 C116 96 126 104 124 112 C122 120 112 122 100 122 C88 122 78 120 76 112 C74 104 84 96 100 96Z" fill="#F6D7A6" ${L3}/>
      <ellipse cx="100" cy="100" rx="7" ry="5" fill="${TK}"/><ellipse cx="98" cy="98.5" rx="2.2" ry="1.4" fill="#fff" opacity=".8"/>
      <ellipse cx="66" cy="96" rx="7" ry="4.5" fill="#FF8FAE" opacity=".6"/><ellipse cx="134" cy="96" rx="7" ry="4.5" fill="#FF8FAE" opacity=".6"/>
      ${ojosPar(80, 120, 80, 1, o)}${bocaCaricatura(100, 110, o, 9)}`, 100, 88, o)}`;
  },
  rufititan: o => {
    const A = '#2F74BD', Ao = '#1F5596', K = '#E2AE6C', Ag = '#8FD3F7', Bl = '#DFF4FF';
    return `
    <path d="M150 112 C170 96 186 74 182 50 C196 62 200 92 186 116 C176 132 162 138 150 136Z" fill="${A}" ${L4}/>
    <path d="M182 50 C186 36 198 34 200 44 C192 46 190 54 192 62Z" fill="${Ag}" ${L3}/>
    <path d="M132 144 C130 162 132 176 136 188 L156 188 C158 172 158 156 154 144Z" fill="${Ao}" ${L4}/>${garras([[140, 188], [148, 189]], '#FFFDF8')}
    <path d="M66 112 C92 100 140 102 160 118 C176 132 170 156 148 160 C118 166 90 164 74 152 C58 140 52 120 66 112Z" fill="${A}" ${L4}/>
    <path d="M84 150 C104 158 128 160 148 154 C138 162 110 164 90 158Z" fill="${K}"/>
    <path d="M150 150 C150 166 152 178 156 190 L174 190 C174 174 172 160 168 148Z" fill="${A}" ${L4}/>${garras([[160, 190], [168, 191]], '#FFFDF8')}
    <path d="M80 148 C80 164 80 176 82 190 L100 190 C100 176 100 162 98 150Z" fill="${A}" ${L4}/>${garras([[86, 190], [94, 191]], '#FFFDF8')}
    <path d="M102 150 C102 164 104 176 106 190 L122 190 C122 176 122 164 120 152Z" fill="${A}" ${L4}/>${garras([[110, 190], [117, 191]], '#FFFDF8')}
    <path d="M60 46 C84 30 108 40 116 60 C126 52 140 58 136 72 C150 72 156 88 144 96 C152 108 140 120 126 114 C118 128 96 128 88 116 C76 124 58 116 60 102 C46 98 44 80 56 74 C46 62 50 50 60 46Z" fill="${Ag}" ${L4}/>
    <path d="M74 56 C82 50 94 54 96 62 M112 70 C120 68 128 74 126 82 M84 98 C92 96 100 100 100 108" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    <path d="M44 56 L30 14 C48 20 58 34 62 48Z" fill="${A}" ${L4}/><path d="M42 50 L36 26 L54 44Z" fill="${Ag}"/>
    <path d="M86 58 L98 18 C108 30 108 46 100 58Z" fill="${A}" ${L4}/><path d="M92 54 L98 32 L102 52Z" fill="${Ag}"/>
    <path d="M70 52 C96 52 110 70 108 92 C106 110 92 120 70 120 C48 120 34 108 32 90 C30 68 46 52 70 52Z" fill="${A}" ${L4}/>
    <path d="M34 96 C22 98 14 106 16 114 C18 122 32 124 46 120 C58 116 62 106 56 100 C50 94 42 94 34 96Z" fill="${K}" ${L3}/>
    <path d="M36 72 C44 66 54 66 58 72" fill="none" stroke="${Ao}" stroke-width="3" stroke-linecap="round"/>
    ${envolverCara(`<ellipse cx="18" cy="106" rx="6" ry="4.5" fill="${TK}"/><path d="M22 118 Q34 124 46 118" fill="none" ${L3}/>
      ${o.humor === 'feliz' ? '<path d="M24 118 Q34 128 44 119 Z" fill="#B8364F" stroke="#22304A" stroke-width="2.5" stroke-linejoin="round"/>' : ''}
      ${ojosPar(52, 80, 84, .82, o, true)}`, 64, 90, o)}
    <g fill="${Bl}" stroke="${TK}" stroke-width="2"><circle cx="186" cy="146" r="5"/><circle cx="194" cy="132" r="3"/></g>`;
  },
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
