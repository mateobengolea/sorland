'use strict';
/* =====================================================================
   Arte a mano, tanda 1: Pampito, Hornerito, Chispulo, Ceibín,
   Carpinchito, Tatupiedra y Brasita (con sus evoluciones).
   Cada etapa es una ilustración propia. Usa las piezas de iniciales.js.
   ===================================================================== */
// Cara estándar: mejillas + ojos + boca, con soporte de vista (espalda / costado).
function caraArte(cx, cy, o, s = 1, {enojo = false, boca = 10, colmillo = false, dy = 22, sinMejillas = false, dx = 20} = {}){
  return envolverCara(`${sinMejillas ? '' : `<ellipse cx="${cx - dx - 14 * s}" cy="${cy + 13 * s}" rx="${7 * s}" ry="${4.5 * s}" fill="#FF8FAE" opacity=".7"/><ellipse cx="${cx + dx + 14 * s}" cy="${cy + 13 * s}" rx="${7 * s}" ry="${4.5 * s}" fill="#FF8FAE" opacity=".7"/>`}
    ${ojosPar(cx - dx * s, cx + dx * s, cy, s, o, enojo)}${bocaCaricatura(cx, cy + dy * s, o, boca * s, colmillo)}`, cx, cy, o);
}
const oval = (cx, cy, rx, ry, fill, extra = '') => `<path d="M${cx} ${cy - ry} C${cx + rx * 1.1} ${cy - ry} ${cx + rx} ${cy + ry} ${cx} ${cy + ry} C${cx - rx} ${cy + ry} ${cx - rx * 1.1} ${cy - ry} ${cx} ${cy - ry}Z" fill="${fill}" ${L4} ${extra}/>`;
const pie = (x, y, w, col, g = '#FFFDF8') => `<path d="M${x - w / 2} ${y} C${x - w / 2} ${y - w * .8} ${x + w / 2} ${y - w * .8} ${x + w / 2} ${y} C${x + w / 3} ${y + w * .22} ${x - w / 3} ${y + w * .22} ${x - w / 2} ${y}Z" fill="${col}" ${L3}/>${garras([[x - w * .25, y + 1], [x, y + 2], [x + w * .25, y + 1]], g)}`;

const ARTE1 = {
  /* ---------- Pampito → Pampero: liebre de la pampa ---------- */
  pampito: o => {
    const C = '#D9C3A0', D = '#B79D78', B = '#F4E8D2', R = '#F5B9C6';
    return `
    <path d="M136 164 C150 160 160 168 156 178 C152 186 138 186 132 180Z" fill="#FFFDF8" ${L3}/>
    ${pie(80, 182, 26, D)}${pie(118, 184, 34, D)}
    <path d="M100 104 C132 104 146 128 144 152 C142 172 124 184 98 184 C74 184 58 172 58 150 C58 126 72 104 100 104Z" fill="${C}" ${L4}/>
    <path d="M96 124 C112 124 120 140 118 156 C116 170 106 178 96 178 C84 178 76 168 76 154 C76 138 82 124 96 124Z" fill="${B}"/>
    <path d="M72 132 C64 140 62 154 68 160 C74 162 78 156 78 148Z" fill="${C}" ${L3}/>
    <path d="M78 64 C64 34 64 8 76 4 C90 6 92 34 90 62Z" fill="${C}" ${L3}/><path d="M80 58 C72 36 72 16 78 12 C84 16 86 36 85 56Z" fill="${R}"/>
    <path d="M114 62 C116 32 128 6 142 10 C150 18 138 42 124 66Z" fill="${C}" ${L3}/><path d="M118 58 C122 36 130 18 138 18 C142 26 134 42 124 60Z" fill="${R}"/>
    <path d="M98 50 C130 50 144 70 142 92 C140 112 122 124 98 124 C74 124 56 112 56 92 C56 70 70 50 98 50Z" fill="${C}" ${L4}/>
    <path d="M98 94 C112 94 120 100 118 108 C116 116 108 120 98 120 C88 120 80 116 78 108 C76 100 84 94 98 94Z" fill="${B}" ${L3}/>
    ${envolverCara(`<path d="M94 99 Q98 103 102 99" fill="${R}" ${L3}/><path d="M76 104 h-24 M76 110 h-20 M120 104 h24 M120 110 h20" stroke="${TK}" stroke-width="2" stroke-linecap="round"/>`, 98, 90, o)}
    ${caraArte(98, 82, o, .9, {dy: 26, boca: 7})}`;
  },
  pampero: o => {
    const C = '#C9AE86', D = '#9C7F5A', B = '#F4E8D2', R = '#F5B9C6', V = '#BFE6FB';
    return `
    <path d="M14 110 C30 100 44 104 52 112 M8 132 C28 124 46 128 56 136 M16 154 C30 148 42 150 50 156" fill="none" stroke="${V}" stroke-width="5" stroke-linecap="round"/>
    <path d="M150 126 C168 120 178 132 170 144 C164 152 150 150 146 142Z" fill="#FFFDF8" ${L3}/>
    <path d="M138 150 C160 158 176 172 170 184 L146 186 C144 176 136 168 124 164Z" fill="${D}" ${L4}/>${garras([[150, 186], [158, 187], [166, 186]])}
    <path d="M64 116 C92 98 140 104 152 130 C162 152 146 170 120 172 C94 174 68 166 58 148 C50 134 52 124 64 116Z" fill="${C}" ${L4}/>
    <path d="M70 146 C88 160 116 164 138 160 C120 168 92 168 74 158Z" fill="${B}"/>
    <path d="M70 152 C62 164 56 174 58 186 L76 186 C76 176 80 166 86 158Z" fill="${D}" ${L4}/>${garras([[62, 187], [70, 187]])}
    <path d="M60 50 C48 22 50 0 62 -4 C76 0 78 26 74 52Z" fill="${C}" ${L3}/><path d="M63 46 C56 26 58 10 64 6 C70 10 72 28 69 44Z" fill="${R}"/>
    <path d="M84 50 C92 22 106 2 120 8 C126 18 112 38 96 58Z" fill="${C}" ${L3}/><path d="M88 48 C96 28 106 14 114 16 C116 24 106 38 94 52Z" fill="${R}"/>
    <path d="M72 46 C102 46 116 64 114 86 C112 106 96 118 72 118 C50 118 34 106 34 86 C34 64 48 46 72 46Z" fill="${C}" ${L4}/>
    <path d="M44 94 C34 94 26 100 28 108 C30 116 44 118 56 114 C62 110 60 100 52 96Z" fill="${B}" ${L3}/>
    ${envolverCara(`<path d="M28 100 Q32 104 36 100" fill="${R}" ${L3}/><path d="M34 106 h-22 M36 112 h-18" stroke="${TK}" stroke-width="2" stroke-linecap="round"/>`, 60, 84, o)}
    ${caraArte(68, 78, o, .82, {enojo: true, dy: 26, boca: 7, dx: 16})}`;
  },
  /* ---------- Hornerito → Hornero → Hornerón: el pájaro del nido de barro ---------- */
  hornerito: o => {
    const C = '#B5703E', D = '#8A5229', B = '#F2C79A';
    return `
    <path d="M86 172 v12 M78 186 l8 -4 l8 4 M114 172 v12 M106 186 l8 -4 l8 4" stroke="#E59A3B" stroke-width="4" stroke-linecap="round" fill="none"/>
    <path d="M140 140 C158 142 174 150 180 162 C168 162 160 166 152 160 C148 168 140 166 136 160Z" fill="${D}" ${L3}/>
    <path d="M100 64 C138 64 156 92 154 122 C152 152 130 174 100 174 C70 174 48 152 46 122 C44 92 62 64 100 64Z" fill="${C}" ${L4}/>
    <path d="M100 112 C122 112 134 128 132 146 C130 162 116 172 100 172 C84 172 70 162 68 146 C66 128 78 112 100 112Z" fill="${B}" ${L3}/>
    <path d="M50 110 C34 120 30 142 40 160 C44 152 50 154 54 146 C58 152 62 146 62 138 C66 126 62 114 50 110Z" fill="${D}" ${L3}/>
    <path d="M150 110 C166 120 170 142 160 160 C156 152 150 154 146 146 C142 152 138 146 138 138 C134 126 138 114 150 110Z" fill="${D}" ${L3}/>
    <path d="M86 72 C88 58 96 52 104 56 C100 60 102 66 106 70Z" fill="${D}" ${L3}/>
    ${envolverCara(`<path d="M88 104 L112 104 L100 120Z" fill="#F0A93B" ${L3}/><path d="M64 88 Q78 82 92 88 M108 88 Q122 82 136 88" fill="none" stroke="#F4E2C8" stroke-width="4" stroke-linecap="round"/>`, 100, 96, o)}
    ${caraArte(100, 96, o, .95, {boca: 0, dy: -40})}`;
  },
  hornero: o => {
    const C = '#A8622F', D = '#7A4520', B = '#F2C79A', Ba = '#B5835A';
    return `
    <path d="M84 170 v14 M76 188 l8 -4 l8 4 M116 170 v14 M108 188 l8 -4 l8 4" stroke="#E59A3B" stroke-width="4.5" stroke-linecap="round" fill="none"/>
    <path d="M138 136 C160 134 182 144 190 160 C176 160 168 166 158 160 C154 170 144 168 138 160Z" fill="${D}" ${L3}/>
    <path d="M100 54 C140 54 160 86 158 120 C156 152 132 176 100 176 C68 176 44 152 42 120 C40 86 60 54 100 54Z" fill="${C}" ${L4}/>
    <path d="M100 104 C124 104 136 122 134 142 C132 160 118 172 100 172 C82 172 68 160 66 142 C64 122 76 104 100 104Z" fill="${B}" ${L3}/>
    <path d="M44 96 C20 104 10 132 20 160 C26 150 32 154 36 144 C42 152 48 144 50 134 C58 120 56 104 44 96Z" fill="${D}" ${L3}/>
    <path d="M156 96 C176 104 182 126 172 150 C166 142 162 146 158 138 C156 130 152 120 150 110Z" fill="${D}" ${L3}/>
    <path d="M162 150 C176 140 194 146 194 160 C194 172 180 178 168 174 C158 170 156 158 162 150Z" fill="${Ba}" ${L4}/>
    <path d="M168 156 q6 -4 12 0 M172 166 q6 -3 12 1" fill="none" stroke="#8A5A35" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M84 62 C84 44 96 36 106 42 C102 48 104 54 110 58Z" fill="${D}" ${L3}/>
    ${envolverCara(`<path d="M86 96 L114 96 L100 116Z" fill="#F0A93B" ${L3}/><path d="M60 80 Q76 72 92 80 M108 80 Q124 72 140 80" fill="none" stroke="#F4E2C8" stroke-width="4" stroke-linecap="round"/>`, 100, 88, o)}
    ${caraArte(100, 88, o, .95, {boca: 0, dy: -40, enojo: true})}`;
  },
  horneron: o => {
    const C = '#9C5A2A', D = '#6E3E1C', B = '#F2C79A', Ba = '#C08A5A', Bo = '#8A5A35';
    return `
    <path d="M60 64 C60 30 80 12 100 12 C120 12 140 30 140 64Z" fill="${Ba}" ${L4}/>
    <path d="M76 40 q8 -6 16 0 M108 34 q8 -5 16 1 M86 56 q8 -5 16 0" fill="none" stroke="${Bo}" stroke-width="3" stroke-linecap="round"/>
    <path d="M86 64 C86 50 94 42 100 42 C106 42 114 50 114 64Z" fill="#3B2A22" ${L3}/>
    <path d="M30 104 C0 106 -4 140 12 168 C20 158 26 162 30 150 C38 160 46 150 48 138 C58 120 50 104 30 104Z" fill="${D}" ${L4}/>
    <path d="M170 104 C200 106 204 140 188 168 C180 158 174 162 170 150 C162 160 154 150 152 138 C142 120 150 104 170 104Z" fill="${D}" ${L4}/>
    <path d="M82 172 v14 M72 190 l10 -5 l10 5 M118 172 v14 M108 190 l10 -5 l10 5" stroke="#E59A3B" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M100 60 C142 60 164 92 162 126 C160 158 134 180 100 180 C66 180 40 158 38 126 C36 92 58 60 100 60Z" fill="${C}" ${L4}/>
    <path d="M100 112 C126 112 140 130 138 150 C136 168 120 178 100 178 C80 178 64 168 62 150 C60 130 74 112 100 112Z" fill="${B}" ${L3}/>
    <path d="M70 138 L100 128 L130 138 L124 156 L100 150 L76 156Z" fill="${Ba}" ${L3}/>
    ${envolverCara(`<path d="M84 100 L116 100 L100 122Z" fill="#F0A93B" ${L3}/>`, 100, 92, o)}
    ${caraArte(100, 90, o, .95, {boca: 0, dy: -40, enojo: true})}`;
  },
  /* ---------- Chispulo → Chispón: luciérnaga eléctrica ---------- */
  chispulo: o => {
    const N = '#3B4A9C', D = '#26306E', Y = '#FFE45C', W = '#DCEEFF';
    return `
    <circle cx="100" cy="150" r="40" fill="${Y}" opacity=".25"/>
    <path d="M70 108 C40 84 20 100 28 118 C36 132 60 130 76 120Z" fill="${W}" opacity=".85" ${L3}/>
    <path d="M130 108 C160 84 180 100 172 118 C164 132 140 130 124 120Z" fill="${W}" opacity=".85" ${L3}/>
    <path d="M100 116 C126 116 140 134 138 154 C136 172 120 184 100 184 C80 184 64 172 62 154 C60 134 74 116 100 116Z" fill="${Y}" ${L4}/>
    <path d="M68 146 Q100 156 132 146 M66 162 Q100 174 134 162" fill="none" stroke="#E8B23A" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M86 26 Q80 10 70 6 M114 26 Q120 10 130 6" fill="none" stroke="${TK}" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="68" cy="6" r="7" fill="${Y}" ${L3}/><circle cx="132" cy="6" r="7" fill="${Y}" ${L3}/>
    <path d="M100 30 C130 30 146 50 144 78 C142 102 124 118 100 118 C76 118 58 102 56 78 C54 50 70 30 100 30Z" fill="${N}" ${L4}/>
    <path d="M78 44 C86 38 96 38 102 42" fill="none" stroke="#7E8CD8" stroke-width="4" stroke-linecap="round"/>
    ${caraArte(100, 74, o, .95, {dy: 20})}`;
  },
  chispon: o => {
    const N = '#2E3A8C', D = '#1E2766', Y = '#FFE45C', W = '#DCEEFF';
    return `
    <circle cx="100" cy="148" r="52" fill="${Y}" opacity=".22"/>
    <path d="M66 100 C26 64 0 86 10 112 C20 134 54 132 76 116Z" fill="${W}" opacity=".85" ${L3}/><path d="M24 92 L54 110 M14 112 L50 118" stroke="#9FB6E8" stroke-width="2"/>
    <path d="M134 100 C174 64 200 86 190 112 C180 134 146 132 124 116Z" fill="${W}" opacity=".85" ${L3}/><path d="M176 92 L146 110 M186 112 L150 118" stroke="#9FB6E8" stroke-width="2"/>
    <g stroke="${TK}" stroke-width="3.5" stroke-linecap="round" fill="none"><path d="M74 150 L54 160 L50 178"/><path d="M126 150 L146 160 L150 178"/></g>
    <path d="M100 110 C132 110 150 132 148 156 C146 176 126 190 100 190 C74 190 54 176 52 156 C50 132 68 110 100 110Z" fill="${N}" ${L4}/>
    <path d="M100 124 C120 124 132 140 130 158 C128 174 116 184 100 184 C84 184 72 174 70 158 C68 140 80 124 100 124Z" fill="${Y}" ${L3}/>
    <path d="M86 140 l12 -8 l-4 12 l12 -2 l-16 20 l4 -12 l-10 2Z" fill="#FFFDF8" ${L3}/>
    <path d="M80 24 L66 0 L84 12 L88 -6 L96 20Z M120 24 L134 0 L116 12 L112 -6 L104 20Z" fill="${Y}" ${L3}/>
    <path d="M100 22 C134 22 150 44 148 72 C146 98 126 114 100 114 C74 114 54 98 52 72 C50 44 66 22 100 22Z" fill="${N}" ${L4}/>
    <path d="M70 40 C82 32 96 32 104 36" fill="none" stroke="#6E7CD0" stroke-width="4" stroke-linecap="round"/>
    ${caraArte(100, 68, o, .95, {dy: 20, enojo: true, colmillo: true})}`;
  },
  /* ---------- Ceibín → Ceibal: la flor del ceibo ---------- */
  ceibin: o => {
    const C = '#7CC56A', D = '#4F9A3F', B = '#E5F5C6', F = '#E2493C', Fo = '#B5302A';
    const petalo = (x, y, r) => `<path d="M${x} ${y} C${x - 10} ${y - 16} ${x - 4} ${y - 34} ${x + 4} ${y - 38} C${x + 10} ${y - 26} ${x + 10} ${y - 12} ${x} ${y}Z" transform="rotate(${r} ${x} ${y})" fill="${F}" ${L3}/>`;
    return `
    ${pie(82, 182, 26, D)}${pie(118, 182, 26, D)}
    <path d="M100 112 C126 112 138 132 136 152 C134 170 120 182 100 182 C80 182 66 170 64 152 C62 132 74 112 100 112Z" fill="${C}" ${L4}/>
    <path d="M100 128 C114 128 122 140 120 154 C118 166 110 174 100 174 C90 174 82 166 80 154 C78 140 86 128 100 128Z" fill="${B}"/>
    <path d="M66 130 C48 120 36 128 38 140 C48 140 58 138 68 140Z" fill="${C}" ${L3}/><path d="M134 130 C152 120 164 128 162 140 C152 140 142 138 132 140Z" fill="${C}" ${L3}/>
    ${[-50, -28, -8, 12, 32, 52].map((r, i) => petalo(100, 52, r)).join('')}
    <path d="M100 44 C130 44 144 64 142 88 C140 110 122 122 100 122 C78 122 60 110 58 88 C56 64 70 44 100 44Z" fill="${C}" ${L4}/>
    <path d="M86 50 C92 44 108 44 114 50" fill="none" stroke="${Fo}" stroke-width="3"/>
    ${caraArte(100, 84, o, .95)}`;
  },
  ceibal: o => {
    const T = '#8A5A35', To = '#6B4226', C = '#7CC56A', B = '#E5F5C6', F = '#E2493C';
    const flor = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${[-30, 0, 30].map(r => `<path d="M0 0 C-8 -12 -3 -26 3 -28 C8 -20 8 -9 0 0Z" transform="rotate(${r})" fill="${F}" ${L3}/>`).join('')}</g>`;
    return `
    <path d="M60 186 C64 170 70 160 76 150 M140 186 C136 170 130 160 124 150 M88 188 C90 176 92 168 94 160 M112 188 C110 176 108 168 106 160" fill="none" stroke="${TK}" stroke-width="10" stroke-linecap="round"/>
    <path d="M60 186 C64 170 70 160 76 150 M140 186 C136 170 130 160 124 150 M88 188 C90 176 92 168 94 160 M112 188 C110 176 108 168 106 160" fill="none" stroke="${T}" stroke-width="5" stroke-linecap="round"/>
    <path d="M100 86 C130 86 144 110 142 136 C140 158 124 168 100 168 C76 168 60 158 58 136 C56 110 70 86 100 86Z" fill="${T}" ${L4}/>
    <path d="M74 110 C80 130 78 146 72 158 M126 110 C120 130 122 146 128 158 M100 100 V164" fill="none" stroke="${To}" stroke-width="2.5" opacity=".7"/>
    <path d="M62 112 C40 100 26 80 30 62 M138 112 C160 100 174 80 170 62" fill="none" stroke="${TK}" stroke-width="10" stroke-linecap="round"/>
    <path d="M62 112 C40 100 26 80 30 62 M138 112 C160 100 174 80 170 62" fill="none" stroke="${T}" stroke-width="5" stroke-linecap="round"/>
    <path d="M100 6 C134 2 158 18 160 40 C176 46 182 66 168 80 C164 96 140 100 126 92 C118 104 82 104 74 92 C60 100 36 96 32 80 C18 66 24 46 40 40 C42 18 66 2 100 6Z" fill="${C}" ${L4}/>
    ${flor(56, 40)}${flor(100, 24, 1.1)}${flor(144, 40)}${flor(78, 76, .9)}${flor(126, 74, .9)}${flor(30, 62, .8)}${flor(170, 62, .8)}
    <path d="M100 100 C120 100 128 110 126 122 C124 132 114 138 100 138 C86 138 76 132 74 122 C72 110 80 100 100 100Z" fill="${B}" opacity=".9" ${L3}/>
    ${caraArte(100, 116, o, .8, {dy: 16, sinMejillas: true, dx: 16})}`;
  },
  /* ---------- Carpinchito → Carpincho → Carpinchón: el carpincho ---------- */
  carpinchito: o => {
    const C = '#B07A4E', D = '#8A5A35', B = '#D8B08A';
    return `
    ${pie(72, 184, 22, D)}${pie(124, 184, 22, D)}
    <path d="M100 96 C138 96 158 120 156 146 C154 170 132 184 100 184 C68 184 46 170 44 146 C42 120 62 96 100 96Z" fill="${C}" ${L4}/>
    <path d="M100 136 C120 136 130 148 128 162 C126 174 114 180 100 180 C86 180 74 174 72 162 C70 148 80 136 100 136Z" fill="${B}"/>
    <path d="M60 58 C52 46 56 36 66 38 C70 44 70 52 66 60Z M140 58 C148 46 144 36 134 38 C130 44 130 52 134 60Z" fill="${D}" ${L3}/>
    <path d="M100 42 C136 42 152 62 150 88 C148 110 128 124 100 124 C72 124 52 110 50 88 C48 62 64 42 100 42Z" fill="${C}" ${L4}/>
    <path d="M100 84 C124 84 136 94 134 106 C132 118 118 124 100 124 C82 124 68 118 66 106 C64 94 76 84 100 84Z" fill="${B}" ${L3}/>
    <ellipse cx="90" cy="96" rx="3.5" ry="2.5" fill="${TK}"/><ellipse cx="110" cy="96" rx="3.5" ry="2.5" fill="${TK}"/>
    <g transform="translate(118 34)"><path d="M0 0 C0 -10 12 -14 18 -6 C22 -2 22 6 14 8 C6 10 0 6 0 0Z" fill="#FFD23F" ${L3}/><path d="M18 -4 L26 -2 L18 2Z" fill="#F0A93B" stroke="${TK}" stroke-width="1.5"/><circle cx="12" cy="-4" r="1.6" fill="${TK}"/></g>
    ${envolverCara(`<ellipse cx="62" cy="80" rx="7" ry="4.5" fill="#FF8FAE" opacity=".6"/><ellipse cx="138" cy="80" rx="7" ry="4.5" fill="#FF8FAE" opacity=".6"/>
      <g class="ojos" style="animation-delay:${o.parpadeo || 0}s"><path d="M74 70 Q82 66 90 70" fill="none" ${L3}/><path d="M110 70 Q118 66 126 70" fill="none" ${L3}/></g>
      ${o.humor === 'feliz' ? `<path d="M92 108 Q100 116 108 108" fill="#B8364F" ${L3}/>` : `<path d="M94 110 Q100 113 106 110" fill="none" ${L3}/>`}`, 100, 80, o)}`;
  },
  carpincho: o => {
    const C = '#A06A3E', D = '#7A4F2C', B = '#D8B08A';
    return `
    <path d="M150 140 C150 160 152 176 154 188 L172 188 C172 172 170 156 166 140Z" fill="${D}" ${L4}/>
    <path d="M56 104 C92 88 150 92 172 112 C188 128 182 156 160 164 C128 172 92 170 70 160 C50 150 40 116 56 104Z" fill="${C}" ${L4}/>
    <path d="M78 152 C100 162 130 164 156 158 C140 168 100 168 82 160Z" fill="${B}"/>
    <path d="M160 156 C162 168 162 178 164 190 L180 190 C180 176 178 164 174 152Z" fill="${C}" ${L4}/>${garras([[168, 190], [175, 190]])}
    <path d="M70 152 C70 166 72 178 74 190 L92 190 C92 178 92 164 88 152Z" fill="${C}" ${L4}/>${garras([[78, 190], [86, 190]])}
    <path d="M96 156 C96 168 98 180 100 190 L116 190 C116 178 116 168 114 158Z" fill="${C}" ${L4}/>${garras([[104, 190], [111, 190]])}
    <path d="M58 58 C50 46 54 36 64 38 C68 44 68 52 64 60Z" fill="${D}" ${L3}/>
    <path d="M62 52 C94 52 108 72 106 96 C104 118 86 132 62 132 C36 132 22 116 22 96 C22 72 36 52 62 52Z" fill="${C}" ${L4}/>
    <path d="M30 90 C18 92 12 102 14 112 C16 122 32 126 46 122 C58 118 62 108 56 100 C50 92 40 88 30 90Z" fill="${B}" ${L3}/>
    <ellipse cx="20" cy="104" rx="3.5" ry="2.6" fill="${TK}"/>
    <g transform="translate(76 46)"><path d="M0 0 C-14 -2 -16 -16 -4 -20 C2 -24 14 -20 14 -10 C14 -4 8 0 0 0Z" fill="#FF9F2E" ${L3}/><path d="M-2 -18 C0 -26 4 -28 8 -26" fill="none" stroke="#4F9A3F" stroke-width="3" stroke-linecap="round"/></g>
    ${envolverCara(`<g class="ojos" style="animation-delay:${o.parpadeo || 0}s"><path d="M54 82 Q62 78 70 82" fill="none" ${L3}/></g><path d="M26 118 Q34 122 42 118" fill="none" ${L3}/>`, 54, 96, o)}`;
  },
  carpinchon: o => {
    const C = '#8F5C34', D = '#6B4426', B = '#D0A47C', Ag = '#5AB4E8';
    return `
    <ellipse cx="110" cy="182" rx="88" ry="12" fill="${Ag}" opacity=".55" ${L3}/>
    <path d="M44 92 C86 70 160 74 184 100 C202 120 194 156 168 166 C132 178 88 176 62 164 C34 152 26 108 44 92Z" fill="${C}" ${L4}/>
    <path d="M70 158 C100 170 140 172 168 162 C150 174 100 174 76 166Z" fill="${B}"/>
    <path d="M168 160 C170 170 170 178 172 186 L188 186 C188 176 186 166 182 156Z M64 158 C64 170 66 178 68 186 L86 186 C86 176 86 166 82 158Z" fill="${D}" ${L4}/>
    <path d="M96 78 C104 62 124 58 138 66 C150 58 168 66 166 80 C168 92 152 100 138 94 C124 102 102 96 96 84Z" fill="#7CC56A" ${L4}/>
    <path d="M120 70 C126 56 140 56 144 66 C138 66 132 70 130 78Z" fill="#FF8FB1" ${L3}/><circle cx="134" cy="70" r="4" fill="#FFD23F"/>
    <path d="M50 44 C42 32 46 22 56 24 C60 30 60 38 56 46Z" fill="${D}" ${L3}/>
    <path d="M56 36 C90 36 106 58 104 84 C102 108 82 124 56 124 C28 124 12 106 12 84 C12 58 28 36 56 36Z" fill="${C}" ${L4}/>
    <path d="M22 78 C8 80 0 92 2 104 C4 116 22 120 38 116 C52 112 56 100 50 92 C44 82 34 76 22 78Z" fill="${B}" ${L3}/>
    <ellipse cx="8" cy="96" rx="4" ry="3" fill="${TK}"/>
    <path d="M30 50 L38 30 L46 48Z M58 44 L68 22 L74 44Z" fill="#E6D2B8" ${L3}/>
    ${envolverCara(`<g class="ojos" style="animation-delay:${o.parpadeo || 0}s"><path d="M44 68 Q52 64 60 68" fill="none" ${L3}/></g><path d="M16 110 Q26 114 36 110" fill="none" ${L3}/>`, 44, 84, o)}`;
  },
  /* ---------- Tatupiedra → Tatupeñón: mulita con caparazón de piedra ---------- */
  tatupiedra: o => {
    const P = '#9AA2AD', Po = '#6E7884', C = '#E6C8A0', D = '#C49A6C';
    return `
    ${pie(64, 184, 20, D)}${pie(84, 186, 20, D)}${pie(124, 186, 20, D)}${pie(144, 184, 20, D)}
    <path d="M160 160 C176 158 184 166 182 172 C176 170 168 170 160 168Z" fill="${C}" ${L3}/>
    <path d="M40 160 C38 110 70 82 104 82 C140 82 168 110 166 160Z" fill="${P}" ${L4}/>
    <path d="M60 160 C60 120 76 96 104 92 M84 160 C84 120 92 100 104 92 M124 160 C124 120 116 100 104 92 M148 160 C148 120 132 96 104 92" fill="none" stroke="${Po}" stroke-width="3"/>
    <path d="M52 132 Q60 128 64 134 M136 120 Q144 116 150 122 M98 110 Q104 106 110 110" fill="none" stroke="#7CC56A" stroke-width="4" stroke-linecap="round"/>
    <path d="M40 160 H166" ${L4}/>
    <path d="M58 70 L48 42 L70 62Z" fill="${C}" ${L3}/><path d="M90 66 L96 38 L104 64Z" fill="${C}" ${L3}/>
    <path d="M72 66 C96 66 110 84 108 106 C106 124 92 136 72 136 C52 136 38 124 36 106 C34 84 48 66 72 66Z" fill="${C}" ${L4}/>
    <path d="M40 112 C30 114 24 120 26 128 C30 134 42 134 52 130Z" fill="${C}" ${L3}/><ellipse cx="28" cy="124" rx="3.5" ry="2.5" fill="${TK}"/>
    ${caraArte(76, 100, o, .8, {dy: 20, dx: 16, boca: 7})}`;
  },
  tatupenon: o => {
    const P = '#8A929E', Po = '#5E6874', C = '#D9B88E', D = '#B08452', Pu = '#C9CED6';
    return `
    ${pie(56, 186, 24, D)}${pie(82, 188, 24, D)}${pie(130, 188, 24, D)}${pie(156, 186, 24, D)}
    <path d="M176 156 C192 152 200 162 196 172 C186 170 176 170 168 166Z" fill="${C}" ${L3}/>
    <path d="M26 162 C22 100 64 64 108 64 C154 64 190 100 186 162Z" fill="${P}" ${L4}/>
    ${[[50, 100], [80, 76], [108, 68], [136, 76], [164, 100]].map(([x, y]) => `<path d="M${x - 10} ${y + 6} L${x} ${y - 22} L${x + 10} ${y + 6}Z" fill="${Pu}" ${L3}/>`).join('')}
    <path d="M50 162 C50 116 70 88 108 80 M80 162 C80 116 92 92 108 80 M136 162 C136 116 124 92 108 80 M164 162 C164 116 146 88 108 80" fill="none" stroke="${Po}" stroke-width="3"/>
    <path d="M26 162 H186" ${L4}/>
    <path d="M44 66 L30 30 L62 56Z" fill="${C}" ${L3}/><path d="M80 60 L88 22 L98 56Z" fill="${C}" ${L3}/>
    <path d="M64 56 C92 56 108 76 106 102 C104 124 88 138 64 138 C40 138 24 124 22 102 C20 76 36 56 64 56Z" fill="${C}" ${L4}/>
    <path d="M26 108 C14 110 6 118 8 128 C12 136 28 136 40 130Z" fill="${C}" ${L3}/><ellipse cx="10" cy="122" rx="4" ry="3" fill="${TK}"/>
    <path d="M44 72 L56 66 L70 70 L84 64" fill="none" stroke="${Po}" stroke-width="3" stroke-linecap="round"/>
    ${caraArte(70, 96, o, .78, {dy: 22, dx: 16, boca: 7, enojo: true})}`;
  },
  /* ---------- Brasita → Brasero: salamandra de brasas ---------- */
  brasita: o => {
    const C = '#E2493C', D = '#B5302A', B = '#FFB36B', E = '#FFD23F';
    return `
    <g opacity=".5" fill="#9AA2AD"><circle cx="30" cy="180" r="5"/><circle cx="42" cy="172" r="3.5"/><circle cx="170" cy="182" r="5"/></g>
    <path d="M132 160 C156 164 176 156 180 140 C186 128 196 134 192 146 C184 170 160 182 130 176Z" fill="${C}" ${L4}/>
    ${llamaG(190, 140, .6)}
    ${pie(74, 182, 26, D)}${pie(122, 182, 26, D)}
    <path d="M100 104 C132 104 146 128 144 150 C142 172 124 182 100 182 C76 182 58 172 56 150 C54 128 68 104 100 104Z" fill="${C}" ${L4}/>
    <path d="M100 122 C116 122 124 138 122 154 C120 168 110 176 100 176 C90 176 80 168 78 154 C76 138 84 122 100 122Z" fill="${B}" ${L3}/>
    ${[[70, 126], [134, 130], [64, 150], [140, 154]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${E}" ${L3}/>`).join('')}
    <path d="M100 42 C136 42 152 62 150 88 C148 112 128 124 100 124 C72 124 52 112 50 88 C48 62 64 42 100 42Z" fill="${C}" ${L4}/>
    <path d="M70 50 C74 40 84 38 88 44 M112 44 C116 38 126 40 130 50" fill="none" stroke="${E}" stroke-width="4" stroke-linecap="round"/>
    ${caraArte(100, 82, o, .95, {colmillo: true})}`;
  },
  brasero: o => {
    const C = '#C9372B', D = '#962520', B = '#FFB36B', E = '#FFD23F', H = '#5A4A40';
    return `
    <path d="M128 156 C154 162 172 150 176 124 C180 108 190 114 188 130 C182 168 156 184 126 178Z" fill="${C}" ${L4}/>
    ${llamaG(184, 112, .8)}
    ${pie(68, 186, 30, D)}${pie(128, 186, 30, D)}
    <path d="M100 96 C138 96 156 124 154 152 C152 176 130 188 100 188 C70 188 48 176 46 152 C44 124 62 96 100 96Z" fill="${C}" ${L4}/>
    <path d="M100 116 C120 116 130 134 128 154 C126 170 114 180 100 180 C86 180 74 170 72 154 C70 134 80 116 100 116Z" fill="${B}" ${L3}/>
    <path d="M60 116 C44 122 38 140 44 152 C48 158 56 156 58 150 C60 142 64 136 70 132Z M140 116 C156 122 162 140 156 152 C152 158 144 156 142 150 C140 142 136 136 130 132Z" fill="${C}" ${L3}/>
    <path d="M100 30 C138 30 154 52 152 80 C150 104 130 118 100 118 C70 118 50 104 48 80 C46 52 62 30 100 30Z" fill="${C}" ${L4}/>
    <path d="M66 40 C70 30 82 28 86 34 M114 34 C118 28 130 30 134 40" fill="none" stroke="${E}" stroke-width="4" stroke-linecap="round"/>
    <path d="M62 48 L46 22 L76 38Z M88 36 L86 8 L104 32Z M112 36 L114 8 L96 32Z M138 48 L154 22 L124 38Z" fill="${H}" ${L3}/>
    ${llamaG(46, 24, .42)}${llamaG(86, 10, .48)}${llamaG(114, 10, .48)}${llamaG(154, 24, .42)}
    ${caraArte(100, 72, o, .95, {colmillo: true, enojo: true})}`;
  },
};
Object.assign(INICIALES_V2, ARTE1);
