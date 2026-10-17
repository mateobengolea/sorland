'use strict';
/* =====================================================================
   Evoluciones rediseñadas (1): cada etapa cambia de cuerpo, postura
   y rasgos; no es la misma figura más grande.
   ===================================================================== */
const brazo6 = (pts, col, ancho = 14) => `<path d="${pts}" fill="none" stroke="${TK}" stroke-width="${ancho + 5}" stroke-linecap="round" stroke-linejoin="round"/><path d="${pts}" fill="none" stroke="${col}" stroke-width="${ancho}" stroke-linecap="round" stroke-linejoin="round"/>`;
const rayo6 = (x, y, s = 1, col = '#FFE45C') => `<path d="M${x} ${y} l${8 * s} ${-14 * s} l${-2 * s} ${10 * s} l${10 * s} ${-2 * s} l${-14 * s} ${20 * s} l${2 * s} ${-10 * s}Z" fill="${col}" ${L3}/>`;
const viento6 = (d, col = '#BFE6FB', w = 5) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;
const leno6 = (x1, y1, x2, y2, w = 12) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${TK}" stroke-width="${w + 5}" stroke-linecap="round"/><path d="M${x1} ${y1} L${x2} ${y2}" stroke="#8A5A35" stroke-width="${w}" stroke-linecap="round"/><path d="M${x1 + (x2 - x1) * .2} ${y1 + (y2 - y1) * .2} L${x1 + (x2 - x1) * .7} ${y1 + (y2 - y1) * .7}" stroke="#6B4226" stroke-width="2" opacity=".7"/>`;

const ARTE6 = {
  /* Pampero: liebre guerrera del viento, parada en dos patas, orejas como cuchillas */
  pampero: o => {
    const C = '#C9AE86', D = '#9C7F5A', B = '#F4E8D2', R = '#F5B9C6', V = '#BFE6FB', Pa = '#5AB4E8';
    return `
    ${viento6('M8 70 C30 60 46 66 56 76')}${viento6('M150 150 C168 142 184 146 194 156')}${viento6('M4 120 C20 112 34 114 42 122', V, 4)}
    <path d="M128 70 C152 54 176 58 192 44 C186 70 168 86 140 90Z" fill="${Pa}" ${L4}/><path d="M146 74 C160 70 172 66 182 58" fill="none" stroke="#9FD8F8" stroke-width="3"/>
    <path d="M68 150 C60 168 48 178 34 186 L66 188 C76 178 84 166 88 154Z M112 154 C118 168 128 178 146 186 L114 188 C106 178 100 166 98 156Z" fill="${D}" ${L4}/>
    ${garras([[38, 187], [48, 188], [58, 188], [124, 188], [134, 188], [142, 187]])}
    <path d="M100 82 C132 82 146 108 144 136 C142 160 124 170 100 170 C76 170 58 160 56 136 C54 108 68 82 100 82Z" fill="${C}" ${L4}/>
    <path d="M100 96 C116 96 124 112 122 132 C120 150 112 160 100 160 C88 160 80 150 78 132 C76 112 84 96 100 96Z" fill="${B}"/>
    <path d="M86 92 L94 104 L100 92 L106 104 L114 92" fill="none" stroke="${B}" stroke-width="5" stroke-linejoin="round"/>
    ${brazo6('M60 108 C44 116 36 128 34 140', C, 13)}${brazo6('M140 108 C156 104 166 94 172 82', C, 13)}
    ${garras([[30, 144], [36, 146], [170, 76], [178, 80]])}
    <path d="M76 40 C58 22 52 0 62 -4 C78 0 88 22 90 40Z" fill="${C}" ${L3}/><path d="M78 34 C68 20 64 8 68 4 C76 8 82 22 84 34Z" fill="${R}"/>
    <path d="M114 38 C128 18 152 6 166 12 C164 26 140 40 122 48Z" fill="${C}" ${L3}/><path d="M118 38 C132 24 148 16 158 18 C154 28 138 38 124 44Z" fill="${R}"/>
    <path d="M100 30 C128 30 142 48 140 70 C138 90 122 100 100 100 C78 100 62 90 60 70 C58 48 72 30 100 30Z" fill="${C}" ${L4}/>
    <path d="M100 72 C114 72 122 80 120 88 C118 96 110 100 100 100 C90 100 82 96 80 88 C78 80 86 72 100 72Z" fill="${B}" ${L3}/>
    <path d="M66 42 C72 34 84 30 92 30" fill="none" stroke="${B}" stroke-width="4" stroke-linecap="round"/>
    ${envolverCara(`<path d="M95 77 Q100 81 105 77" fill="${R}" ${L3}/><path d="M80 84 h-22 M120 84 h22" stroke="${TK}" stroke-width="2" stroke-linecap="round"/>`, 100, 70, o)}
    ${caraArte(100, 60, o, .85, {enojo: true, dy: 30, boca: 6, dx: 18})}`;
  },
  /* Hornero: pájaro parado con alas abiertas y bola de barro en una mano */
  hornero: o => {
    const C = '#A8622F', D = '#7A4520', B = '#F2C79A', Ba = '#B5835A';
    return `
    <path d="M84 168 v16 M74 190 l10 -5 l10 5 M116 168 v16 M106 190 l10 -5 l10 5" stroke="#E59A3B" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M120 156 C140 166 156 182 160 196 C146 192 134 184 126 176 C124 188 116 194 108 196 C110 182 112 170 110 160Z" fill="${D}" ${L4}/>
    <path d="M48 96 C18 80 2 98 4 124 C14 120 18 128 24 120 C28 132 38 128 40 120 C48 128 56 120 58 112Z" fill="${D}" ${L4}/>
    <path d="M14 104 L40 112 M10 116 L36 118" stroke="#C07A44" stroke-width="2.5"/>
    <path d="M100 56 C138 56 154 88 152 120 C150 152 128 172 100 172 C72 172 50 152 48 120 C46 88 62 56 100 56Z" fill="${C}" ${L4}/>
    <path d="M100 98 C122 98 134 116 132 138 C130 156 116 168 100 168 C84 168 70 156 68 138 C66 116 78 98 100 98Z" fill="${B}" ${L3}/>
    <path d="M150 96 C172 86 186 98 184 116 C176 112 170 116 166 112 C164 120 156 122 152 116Z" fill="${D}" ${L3}/>
    <circle cx="176" cy="132" r="17" fill="${Ba}" ${L4}/><path d="M166 128 q6 -4 12 0 M170 138 q6 -3 12 1" fill="none" stroke="#8A5A35" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M84 60 C80 36 92 24 104 30 C98 36 100 42 108 46 C102 48 100 54 104 58Z" fill="${D}" ${L3}/>
    <path d="M58 76 Q76 66 92 74 M108 74 Q124 66 142 76" fill="none" stroke="#F4E2C8" stroke-width="4.5" stroke-linecap="round"/>
    ${caraArte(100, 86, o, .95, {boca: 0, enojo: true})}
    ${envolverCara(`<path d="M86 96 L114 96 L100 116Z" fill="#F0A93B" ${L3}/>`, 100, 88, o)}`;
  },
  /* Hornerón: su cuerpo es el horno de barro; la cabeza asoma por la puerta */
  horneron: o => {
    const C = '#9C5A2A', D = '#6E3E1C', Ba = '#C08A5A', Bo = '#8A5A35', B = '#F2C79A';
    return `
    <path d="M70 176 v12 M60 192 l10 -5 l10 5 M130 176 v12 M120 192 l10 -5 l10 5" stroke="#E59A3B" stroke-width="6" stroke-linecap="round" fill="none"/>
    <path d="M44 118 C4 96 -8 128 2 160 C12 152 16 162 24 150 C30 164 42 156 46 146Z M156 118 C196 96 208 128 198 160 C188 152 184 162 176 150 C170 164 158 156 154 146Z" fill="${D}" ${L4}/>
    <path d="M14 126 L42 136 M10 142 L40 146 M186 126 L158 136 M190 142 L160 146" stroke="#B5703E" stroke-width="2.5"/>
    <path d="M100 18 C156 18 186 66 182 126 C180 162 150 182 100 182 C50 182 20 162 18 126 C14 66 44 18 100 18Z" fill="${Ba}" ${L4}/>
    ${[[52, 60], [130, 46], [150, 90], [40, 120], [158, 140], [70, 162], [124, 168], [96, 36]].map(([x, y]) => `<path d="M${x - 8} ${y} q8 -6 16 0" fill="none" stroke="${Bo}" stroke-width="3" stroke-linecap="round"/>`).join('')}
    <path d="M100 4 C108 4 112 12 108 18 L92 18 C88 12 92 4 100 4Z" fill="${C}" ${L3}/>
    <path d="M46 132 C46 74 154 74 154 132 L154 152 L46 152Z" fill="#3B2A22" ${L4}/>
    <path d="M100 66 C134 66 148 92 146 118 C144 140 126 152 100 152 C74 152 56 140 54 118 C52 92 66 66 100 66Z" fill="${C}" ${L4}/>
    <path d="M100 116 C116 116 124 126 122 140 C120 150 112 152 100 152 C88 152 80 150 78 140 C76 126 84 116 100 116Z" fill="${B}"/>
    <path d="M64 88 Q78 80 92 86 M108 86 Q122 80 136 88" fill="none" stroke="#F4E2C8" stroke-width="4" stroke-linecap="round"/>
    <path d="M46 152 H154" ${L4}/>
    ${caraArte(100, 98, o, .92, {boca: 0, enojo: true})}
    ${envolverCara(`<path d="M84 108 L116 108 L100 130Z" fill="#F0A93B" ${L3}/>`, 100, 100, o)}`;
  },
  /* Chispón: escarabajo ciervo con mandíbulas de rayo y caparazón */
  chispon: o => {
    const N = '#2E3A8C', D = '#1E2766', Y = '#FFE45C', W = '#DCEEFF', Ca = '#4656B8';
    return `
    <circle cx="100" cy="110" r="88" fill="${Y}" opacity=".14"/>
    <path d="M60 110 C20 80 -2 100 6 126 C14 146 46 140 66 126Z M140 110 C180 80 202 100 194 126 C186 146 154 140 134 126Z" fill="${W}" opacity=".8" ${L3}/>
    ${[[64, 150, 36, 170, 30, 188], [100, 166, 100, 180, 96, 192], [136, 150, 164, 170, 170, 188]].map(([a, b, c, d, e, f]) => brazo6(`M${a} ${b} L${c} ${d} L${e} ${f}`, D, 6)).join('')}
    <path d="M100 76 C146 76 170 110 166 146 C162 174 136 186 100 186 C64 186 38 174 34 146 C30 110 54 76 100 76Z" fill="${N}" ${L4}/>
    <path d="M100 80 V184" stroke="${TK}" stroke-width="3"/>
    <path d="M52 112 C60 96 78 88 92 88 M108 88 C122 88 140 96 148 112" fill="none" stroke="${Ca}" stroke-width="6" stroke-linecap="round"/>
    <circle cx="70" cy="140" r="9" fill="${Y}" ${L3}/><circle cx="130" cy="140" r="9" fill="${Y}" ${L3}/>
    <path d="M70 52 C56 30 50 10 62 0 L66 16 L76 6 L76 26 C80 36 84 44 86 50Z" fill="${Y}" ${L4}/>
    <path d="M130 52 C144 30 150 10 138 0 L134 16 L124 6 L124 26 C120 36 116 44 114 50Z" fill="${Y}" ${L4}/>
    <path d="M100 38 C128 38 142 54 140 74 C138 92 122 102 100 102 C78 102 62 92 60 74 C58 54 72 38 100 38Z" fill="${N}" ${L4}/>
    <path d="M74 50 C82 44 94 42 102 44" fill="none" stroke="${Ca}" stroke-width="4" stroke-linecap="round"/>
    ${rayo6(18, 56, .9)}${rayo6(172, 50, .9)}
    ${caraArte(100, 70, o, .85, {dy: 20, dx: 18, enojo: true, colmillo: true, boca: 8})}`;
  },
  /* Tatupeñón: tatú parado en dos patas, caparazón de peñasco y puños de piedra */
  tatupenon: o => {
    const P = '#8A929E', Po = '#5E6874', C = '#D9B88E', D = '#B08452', Pu = '#C9CED6';
    return `
    <path d="M70 160 C66 172 62 182 58 190 L88 190 C88 180 88 170 88 162Z M112 162 C112 172 112 180 112 190 L142 190 C138 182 134 172 130 160Z" fill="${D}" ${L4}/>
    ${garras([[64, 190], [74, 191], [82, 190], [118, 190], [126, 191], [136, 190]])}
    <path d="M156 160 C176 160 192 172 190 186 C178 184 166 178 154 172Z" fill="${C}" ${L3}/>
    <path d="M100 56 C150 56 178 90 176 130 C174 162 146 180 100 180 C54 180 26 162 24 130 C22 90 50 56 100 56Z" fill="${P}" ${L4}/>
    ${[[40, 76], [70, 52], [100, 44], [130, 52], [160, 76]].map(([x, y]) => `<path d="M${x - 11} ${y + 8} L${x} ${y - 20} L${x + 11} ${y + 8}Z" fill="${Pu}" ${L3}/>`).join('')}
    <path d="M36 100 Q100 84 164 100 M30 130 Q100 114 170 130 M34 158 Q100 144 166 158" fill="none" stroke="${Po}" stroke-width="3"/>
    <path d="M100 96 C124 96 136 116 134 140 C132 162 118 176 100 176 C82 176 68 162 66 140 C64 116 76 96 100 96Z" fill="${C}" ${L4}/>
    <path d="M84 120 h32 M82 136 h36 M84 152 h32" stroke="${D}" stroke-width="2.5" opacity=".7"/>
    ${brazo6('M64 116 C46 124 38 138 36 150', C, 13)}${brazo6('M136 116 C154 124 162 138 164 150', C, 13)}
    <path d="M24 146 L48 142 L52 164 L28 170Z M176 146 L152 142 L148 164 L172 170Z" fill="${Pu}" ${L4}/>
    <path d="M62 50 L50 16 L80 40Z M138 50 L150 16 L120 40Z" fill="${C}" ${L3}/>
    <path d="M100 26 C128 26 142 44 140 66 C138 86 122 98 100 98 C78 98 62 86 60 66 C58 44 72 26 100 26Z" fill="${C}" ${L4}/>
    <path d="M100 74 C112 74 118 82 116 92 C112 100 88 100 84 92 C82 82 88 74 100 74Z" fill="#F2DDBE" ${L3}/>
    <path d="M70 34 L82 30 L96 34 L112 28 L128 34" fill="none" stroke="${Po}" stroke-width="3.5" stroke-linecap="round"/>
    ${envolverCara(`<ellipse cx="100" cy="82" rx="5" ry="3.4" fill="${TK}"/>`, 100, 66, o)}
    ${caraArte(100, 60, o, .82, {dy: 32, dx: 18, boca: 7, enojo: true, colmillo: true})}`;
  },
  /* Brasero: salamandra-dragón erguida con un brasero de hierro en la espalda */
  brasero: o => {
    const C = '#C9372B', D = '#962520', B = '#FFB36B', E = '#FFD23F', H = '#4A4A58', Hh = '#6E6E80';
    return `
    <path d="M122 158 C150 168 174 160 182 140 C190 124 200 132 196 146 C186 176 156 188 120 180Z" fill="${C}" ${L4}/>
    ${llamaG(190, 128, .7)}
    <path d="M118 46 L196 46 L186 84 L126 84Z" fill="${H}" ${L4}/>
    <path d="M122 56 H192 M124 70 H188" stroke="${Hh}" stroke-width="3"/>
    ${llamaG(138, 44, .6)}${llamaG(160, 36, .8)}${llamaG(182, 44, .6)}
    <path d="M74 156 C70 170 66 180 62 190 L90 190 C90 180 90 170 92 160Z M108 160 C110 170 110 180 110 190 L138 190 C134 180 130 170 126 156Z" fill="${D}" ${L4}/>
    ${garras([[68, 190], [78, 191], [86, 190], [114, 190], [124, 191], [132, 190]], E)}
    <path d="M100 80 C134 80 152 108 150 138 C148 164 128 176 100 176 C72 176 52 164 50 138 C48 108 66 80 100 80Z" fill="${C}" ${L4}/>
    <path d="M100 98 C118 98 128 116 126 138 C124 156 114 168 100 168 C86 168 76 156 74 138 C72 116 82 98 100 98Z" fill="${B}" ${L3}/>
    <path d="M84 118 h32 M82 134 h36 M84 150 h32" stroke="#E08A4A" stroke-width="2.5"/>
    ${brazo6('M54 110 C36 118 28 132 26 146', C, 14)}${brazo6('M146 112 C164 118 172 132 174 146', C, 14)}
    ${garras([[20, 150], [28, 152], [34, 150], [168, 150], [174, 152], [182, 150]], E)}
    <path d="M100 18 C134 18 148 38 146 62 C144 84 126 96 100 96 C74 96 56 84 54 62 C52 38 66 18 100 18Z" fill="${C}" ${L4}/>
    <path d="M64 26 L52 4 L78 18Z M136 26 L148 4 L122 18Z" fill="${H}" ${L3}/>
    <path d="M70 32 C76 24 88 22 94 26" fill="none" stroke="${E}" stroke-width="4" stroke-linecap="round"/>
    ${caraArte(100, 56, o, .9, {colmillo: true, enojo: true, dy: 22})}`;
  },
  /* Bagrón: bagre acorazado gigante que emerge del agua, bigotes como látigos */
  bagron: o => {
    const C = '#5E7286', D = '#3E5266', B = '#D8E3EC', Y = '#E6C35A', A = '#5AB4E8', Pl = '#8CA0B4';
    return `
    <path d="M0 176 C30 166 60 182 100 174 C140 166 170 182 200 172 L200 200 L0 200Z" fill="${A}" opacity=".6"/>
    <path d="M150 140 C176 120 190 92 196 64 C200 96 196 134 176 160Z" fill="${D}" ${L4}/>
    <path d="M100 30 C154 30 182 76 176 124 C172 160 142 184 100 184 C58 184 28 160 24 124 C18 76 46 30 100 30Z" fill="${C}" ${L4}/>
    <path d="M40 130 C56 168 144 168 160 130 C150 160 50 160 40 130Z" fill="${B}"/>
    ${[[60, 46, 56, 18], [84, 34, 84, 4], [116, 34, 116, 4], [140, 46, 144, 18]].map(([x, y, x2, y2]) => `<path d="M${x - 9} ${y + 4} L${x2} ${y2} L${x + 9} ${y + 4}Z" fill="${Y}" ${L3}/>`).join('')}
    <path d="M44 74 Q100 52 156 74 L152 92 Q100 72 48 92Z" fill="${Pl}" ${L3}/>
    <path d="M36 104 Q100 86 164 104" fill="none" stroke="${D}" stroke-width="3"/>
    ${envolverCara(`<path d="M64 132 C40 132 20 150 10 176 M70 140 C54 152 46 170 48 190 M136 132 C160 132 180 150 190 176 M130 140 C146 152 154 170 152 190" fill="none" stroke="${TK}" stroke-width="5" stroke-linecap="round"/>
      <path d="M64 132 C40 132 20 150 10 176 M136 132 C160 132 180 150 190 176" fill="none" stroke="${Y}" stroke-width="2" stroke-linecap="round"/>`, 100, 110, o)}
    ${caraArte(100, 108, o, 1, {dy: 26, boca: 16, enojo: true, colmillo: true})}`;
  },
  /* Tormentón: gigante de tormenta con brazos de nube que empuñan rayos */
  tormenton: o => {
    const C = '#5E6A8C', L = '#94A3C6', Y = '#FFE45C', D = '#3E4866';
    return `<g transform="translate(8 10) scale(.92)">
    <g fill="#7FB4E8" opacity=".85">${[[40, 176], [70, 186], [130, 186], [160, 176], [100, 192]].map(([x, y]) => `<path d="M${x} ${y - 10} q-4 8 0 10 q4 -2 0 -10Z"/>`).join('')}</g>
    ${rayo6(60, 196, 1.4)}${rayo6(130, 196, 1.2)}
    <path d="M40 90 C14 92 4 112 10 130 C2 140 6 156 20 158" fill="none" stroke="${TK}" stroke-width="26" stroke-linecap="round"/>
    <path d="M40 90 C14 92 4 112 10 130 C2 140 6 156 20 158" fill="none" stroke="${C}" stroke-width="20" stroke-linecap="round"/>
    <path d="M160 90 C186 80 194 60 188 40" fill="none" stroke="${TK}" stroke-width="26" stroke-linecap="round"/>
    <path d="M160 90 C186 80 194 60 188 40" fill="none" stroke="${C}" stroke-width="20" stroke-linecap="round"/>
    <path d="M180 0 L200 0 L186 22 L198 22 L172 60 L180 32 L168 32Z" fill="${Y}" ${L4}/>
    <path d="M10 150 L32 150 L20 170 L32 170 L8 200 L14 176 L2 176Z" fill="${Y}" ${L4}/>
    <path d="M40 150 C18 146 14 118 34 108 C26 82 50 64 70 74 C76 48 120 42 132 68 C154 58 180 78 170 102 C190 112 184 148 158 150 C152 168 124 172 112 162 C98 174 72 172 64 160 C52 166 40 160 40 150Z" fill="${C}" ${L4}/>
    <path d="M52 92 C58 80 70 76 78 80 M94 64 C106 56 122 58 128 66 M144 82 C154 80 162 86 164 94" fill="none" stroke="${L}" stroke-width="5" stroke-linecap="round"/>
    <path d="M62 66 L56 40 L76 58Z M138 66 L146 40 L124 58Z" fill="${Y}" ${L3}/>
    <path d="M70 140 Q100 152 130 140" fill="none" stroke="${D}" stroke-width="3"/>
    ${caraArte(100, 112, o, 1.05, {dy: 24, enojo: true, colmillo: true, boca: 13})}</g>`;
  },
  /* Zorrofogón: zorro de tres colas de fuego y melena de llamas */
  zorrofogon: o => {
    const C = '#D9582A', D = '#A63E16', B = '#FFF1DE', N = '#3A2A24';
    const cola = (d, x, y, s) => `<path d="${d}" fill="${C}" ${L4}/>${llamaG(x, y, s)}`;
    return `<g transform="translate(4 8) scale(.94)">
    ${cola('M132 140 C168 132 190 104 186 70 C198 84 204 112 196 136 C184 166 156 176 132 170Z', 186, 70, .8)}
    ${cola('M130 150 C170 156 196 140 204 116 C210 140 196 172 166 182 C150 186 136 180 128 172Z', 204, 116, .6)}
    ${cola('M128 132 C150 108 156 78 144 50 C160 60 170 86 166 112 C162 136 146 150 130 152Z', 144, 50, .7)}
    <path d="M60 110 C90 96 140 100 154 126 C164 148 150 168 124 170 C96 172 70 166 56 150 C48 138 48 120 60 110Z" fill="${C}" ${L4}/>
    <path d="M64 150 C84 162 114 166 138 160 C118 170 88 170 68 160Z" fill="${B}"/>
    <path d="M130 156 C132 170 134 180 136 190 L154 190 C152 178 150 166 146 154Z M62 148 C60 162 60 176 62 190 L80 190 C80 176 80 164 78 152Z M92 160 C92 172 92 180 94 190 L112 190 C112 178 110 168 108 160Z" fill="${N}" ${L4}/>
    ${garras([[66, 190], [74, 190], [98, 190], [106, 190], [140, 190], [148, 190]], '#FFD23F')}
    ${[[30, 82, .55], [44, 62, .6], [70, 50, .6], [98, 62, .55], [24, 108, .45]].map(([x, y, s]) => llamaG(x, y, s)).join('')}
    <path d="M38 50 L26 8 L64 38Z M102 50 L114 8 L76 38Z" fill="${C}" ${L4}/><path d="M40 42 L32 20 L56 38Z M100 42 L108 20 L84 38Z" fill="${N}"/>
    <path d="M70 30 C104 30 120 52 118 78 C116 102 96 116 70 116 C44 116 24 102 22 78 C20 52 36 30 70 30Z" fill="${C}" ${L4}/>
    <path d="M70 76 C48 76 30 90 36 106 C46 118 94 118 104 106 C110 90 92 76 70 76Z" fill="${B}" ${L3}/>
    ${envolverCara(`<ellipse cx="70" cy="96" rx="7" ry="4.5" fill="${TK}"/>`, 70, 78, o)}
    ${caraArte(70, 70, o, .88, {dy: 36, boca: 8, enojo: true, colmillo: true, dx: 18})}</g>`;
  },
  /* Cuisón: cuis cavador, parado, con garras de excavar y pañuelo de hojas */
  cuison: o => {
    const C = '#957555', D = '#6A5038', B = '#EADCC6', G = '#7CC56A', T = '#A86A3E';
    return `
    <ellipse cx="100" cy="188" rx="80" ry="9" fill="${T}" opacity=".45"/>
    ${[[24, 180], [176, 182], [40, 190]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${T}" ${L3}/>`).join('')}
    <path d="M70 150 C64 166 60 178 56 188 L86 188 C86 176 88 166 90 156Z M110 156 C112 166 114 176 114 188 L144 188 C140 178 136 166 130 150Z" fill="${D}" ${L4}/>
    ${garras([[62, 188], [72, 189], [80, 188], [120, 188], [128, 189], [138, 188]])}
    <path d="M100 66 C140 66 160 98 158 132 C156 164 132 180 100 180 C68 180 44 164 42 132 C40 98 60 66 100 66Z" fill="${C}" ${L4}/>
    <path d="M100 106 C122 106 134 124 132 146 C130 164 118 176 100 176 C82 176 70 164 68 146 C66 124 78 106 100 106Z" fill="${B}"/>
    ${brazo6('M48 110 C30 118 22 134 22 150', C, 15)}${brazo6('M152 110 C170 118 178 134 178 150', C, 15)}
    <path d="M10 148 L34 146 L30 168 L18 172 L10 164Z M190 148 L166 146 L170 168 L182 172 L190 164Z" fill="#F4ECDC" ${L4}/>
    <path d="M14 166 l-4 8 M22 170 l-2 9 M186 166 l4 8 M178 170 l2 9" stroke="${TK}" stroke-width="3" stroke-linecap="round"/>
    <path d="M60 92 C80 108 120 108 140 92 L144 104 C120 122 80 122 56 104Z" fill="${G}" ${L3}/>
    <path d="M124 108 L146 128 L132 128 L136 140 L118 116Z" fill="${G}" ${L3}/>
    <path d="M52 40 C40 20 52 6 68 16 C72 26 70 36 64 44Z M148 40 C160 20 148 6 132 16 C128 26 130 36 136 44Z" fill="#E7A7A0" ${L3}/>
    <path d="M100 24 C134 24 150 46 148 70 C146 92 128 104 100 104 C72 104 54 92 52 70 C50 46 66 24 100 24Z" fill="${C}" ${L4}/>
    <path d="M72 34 C82 26 94 28 100 22 C106 28 118 26 128 34" fill="none" stroke="${D}" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M86 78 Q100 88 114 78 C110 94 90 94 86 78Z" fill="${B}" ${L3}/>
    ${envolverCara(`<ellipse cx="100" cy="74" rx="6" ry="4" fill="#E58AA0" ${L3}/><path d="M80 80 h-30 M120 80 h30" stroke="${TK}" stroke-width="2" stroke-linecap="round"/><rect x="92" y="86" width="16" height="12" rx="2" fill="#FFFDF8" ${L3}/><path d="M100 86 v12" ${L3}/>`, 100, 64, o)}
    ${caraArte(100, 58, o, .95, {boca: 0, enojo: true, dx: 22})}`;
  },
  /* Ñandurón: ñandú corredor con penacho, plumas de guerra y estela de viento */
  nanduron: o => {
    const C = '#958468', D = '#6A5C46', B = '#E6DCC8', N = '#3A322C', R = '#7FD4FF', Pe = '#E2493C';
    return `<g transform="translate(6 10) scale(.92)">
    ${viento6('M0 100 C22 92 40 96 50 104', R)}${viento6('M-6 128 C18 120 36 124 46 132', R)}${viento6('M4 156 C22 150 36 152 44 160', R, 4)}
    <path d="M80 148 L56 176 L36 182 M110 150 L132 182 L150 190" fill="none" stroke="${TK}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M80 148 L56 176 L36 182 M110 150 L132 182 L150 190" fill="none" stroke="#E59A3B" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M100 74 C152 70 186 96 184 124 C182 150 152 162 112 160 C72 158 44 144 44 118 C44 92 66 76 100 74Z" fill="${C}" ${L4}/>
    <path d="M170 82 C196 58 220 70 214 96 C204 90 194 94 186 104 M184 100 C208 96 222 114 212 136 C202 126 190 128 180 134 M180 132 C200 138 206 156 196 170 C186 160 176 158 166 156" fill="${C}" ${L3}/>
    <path d="M60 100 C84 84 130 82 160 96 C140 92 100 94 66 112Z" fill="${B}" ${L3}/>
    ${[[78, 120], [104, 112], [130, 116], [154, 124], [92, 140], [122, 140]].map(([x, y]) => `<path d="M${x} ${y} q7 7 14 0" fill="none" stroke="${D}" stroke-width="2.6" stroke-linecap="round"/>`).join('')}
    <path d="M62 120 L90 110 L118 120 L112 132 L90 126 L68 132Z" fill="${Pe}" ${L3}/>
    <path d="M52 100 C46 72 48 42 56 26 L76 26 C78 44 78 72 76 96Z" fill="${N}" ${L4}/>
    <path d="M66 -6 C90 -6 100 10 98 26 C96 40 84 48 66 48 C48 48 36 40 34 26 C32 10 42 -6 66 -6Z" fill="${B}" ${L4}/>
    <path d="M60 -4 C56 -20 70 -30 82 -24 C76 -18 80 -12 88 -10 C80 -6 72 -4 66 -2Z" fill="${Pe}" ${L3}/>
    <path d="M36 26 C22 26 8 30 2 36 C12 40 26 40 40 38Z" fill="#F0A93B" ${L3}/>
    ${caraArte(66, 18, o, .75, {boca: 0, dx: 16, enojo: true})}</g>`;
  },
  /* Peludón: peludo erguido con armadura peluda y garras enormes */
  peludon: o => {
    const C = '#B89370', D = '#86664A', P = '#E2C8A2', Pe = '#F4E8D8', U = '#F4ECDC';
    return `
    <path d="M72 158 C68 170 64 180 60 190 L90 190 C90 180 90 170 92 162Z M108 162 C110 170 110 180 110 190 L140 190 C136 180 132 170 128 158Z" fill="${D}" ${L4}/>
    ${garras([[66, 190], [76, 191], [84, 190], [116, 190], [126, 191], [134, 190]], U)}
    <path d="M150 168 C170 168 186 176 186 188 C172 188 160 184 148 178Z" fill="${P}" ${L3}/>
    <path d="M100 60 C146 60 170 94 168 132 C166 164 140 182 100 182 C60 182 34 164 32 132 C30 94 54 60 100 60Z" fill="${D}" ${L4}/>
    ${[52, 76, 100, 124, 148].map(x => `<path d="M${x} 176 C${x - 2} 130 ${x} 90 ${x + 2} 66" fill="none" stroke="${C}" stroke-width="6"/>`).join('')}
    ${[[40, 120], [52, 84], [78, 68], [160, 120], [148, 84], [122, 68], [100, 62]].map(([x, y]) => `<path d="M${x} ${y} l-7 -8 M${x} ${y} l2 -10 M${x} ${y} l8 -6" stroke="${Pe}" stroke-width="2.4" stroke-linecap="round"/>`).join('')}
    <path d="M100 100 C120 100 130 118 128 140 C126 160 116 172 100 172 C84 172 74 160 72 140 C70 118 80 100 100 100Z" fill="${P}" ${L4}/>
    ${brazo6('M50 104 C30 112 22 128 22 146', P, 15)}${brazo6('M150 104 C170 112 178 128 178 146', P, 15)}
    <path d="M8 146 L38 146 M10 154 L34 160 M192 146 L162 146 M190 154 L166 160" stroke="${TK}" stroke-width="9" stroke-linecap="round"/>
    <path d="M8 146 L38 146 M10 154 L34 160 M192 146 L162 146 M190 154 L166 160" stroke="${U}" stroke-width="5" stroke-linecap="round"/>
    <path d="M70 34 C60 14 70 2 84 10 C86 20 84 30 78 36Z M130 34 C140 14 130 2 116 10 C114 20 116 30 122 36Z" fill="${P}" ${L3}/>
    <path d="M100 22 C130 22 146 42 144 66 C142 88 124 100 100 100 C76 100 58 88 56 66 C54 42 70 22 100 22Z" fill="${P}" ${L4}/>
    <path d="M100 70 C112 70 120 78 118 88 C114 98 86 98 82 88 C80 78 88 70 100 70Z" fill="#F2DDBE" ${L3}/>
    ${envolverCara(`<ellipse cx="100" cy="78" rx="5.5" ry="3.8" fill="${TK}"/>`, 100, 62, o)}
    ${caraArte(100, 56, o, .85, {dy: 34, dx: 18, boca: 7, enojo: true})}`;
  },
  /* Fogonero: golem chiquito de leños con cabeza de fuego y una pava al hombro */
  fogonero: o => {
    const F = '#FF8A3D', Fo = '#D63A2E', Y = '#FFD23F', L = '#8A5A35', Lo = '#6B4226', K = '#4A4A58';
    return `
    ${leno6(76, 150, 70, 186, 16)}${leno6(124, 150, 130, 186, 16)}
    <path d="M58 92 C58 80 142 80 142 92 L146 152 C146 164 54 164 54 152Z" fill="${L}" ${L4}/>
    <path d="M70 96 V156 M100 92 V160 M130 96 V156" stroke="${Lo}" stroke-width="2.5"/>
    <circle cx="100" cy="124" r="15" fill="${Y}" ${L3}/><circle cx="100" cy="124" r="8" fill="#FFF6D8"/>
    ${leno6(56, 100, 26, 136, 14)}${leno6(144, 100, 172, 120, 14)}
    <path d="M166 84 C166 72 196 72 196 84 L194 112 C194 122 168 122 168 112Z" fill="${K}" ${L4}/>
    <path d="M166 92 C152 92 150 104 160 108 M180 72 V64 M174 64 H186" fill="none" stroke="${TK}" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M196 86 L200 78" ${L3}/>
    ${llamaG(26, 136, .45)}
    <path d="M100 0 C110 18 134 30 138 62 C142 90 124 104 100 104 C76 104 58 90 62 62 C64 40 80 32 84 14 C90 24 92 30 96 32 C98 22 98 12 100 0Z" fill="${Fo}" ${L4}/>
    <path d="M100 34 C110 48 124 58 124 76 C124 92 114 100 100 100 C86 100 76 92 76 76 C76 64 86 56 90 46 C94 50 96 54 98 56Z" fill="${F}"/>
    ${caraArte(100, 70, o, .88, {dy: 20, dx: 18, enojo: true, colmillo: true, boca: 9})}`;
  },
  /* Fogonazo: titán de fuego con brazos de leño, corazón de brasa y corona de llamas */
  fogonazo: o => {
    const F = '#FF8A3D', Fo = '#C42E26', Y = '#FFD23F', L = '#6B4226', W = '#FFF6D8';
    return `
    <circle cx="100" cy="100" r="96" fill="${F}" opacity=".13"/>
    ${leno6(70, 150, 56, 192, 20)}${leno6(130, 150, 144, 192, 20)}
    ${leno6(52, 92, 14, 140, 18)}${leno6(148, 92, 186, 140, 18)}
    ${llamaG(14, 142, .6)}${llamaG(186, 142, .6)}
    <path d="M100 30 C146 30 168 70 164 112 C160 150 136 170 100 170 C64 170 40 150 36 112 C32 70 54 30 100 30Z" fill="${Fo}" ${L4}/>
    <path d="M100 60 C130 60 146 88 144 116 C142 142 124 160 100 160 C76 160 58 142 56 116 C54 88 70 60 100 60Z" fill="${F}"/>
    <path d="M58 72 L42 62 L50 84 M142 72 L158 62 L150 84" fill="${L}" ${L3}/>
    <path d="M100 116 C114 130 124 140 124 154 C124 166 114 172 100 172 C86 172 76 166 76 154 C76 140 86 130 100 116Z" fill="${Y}" ${L3}/>
    <path d="M100 140 C106 148 110 152 110 158 C110 164 106 168 100 168 C94 168 90 164 90 158 C90 152 94 148 100 140Z" fill="${W}"/>
    ${[[56, 34, .55], [78, 18, .65], [100, 8, .8], [122, 18, .65], [144, 34, .55]].map(([x, y, s]) => llamaG(x, y, s)).join('')}
    ${caraArte(100, 86, o, 1, {dy: 22, enojo: true, colmillo: true, boca: 12})}`;
  },
  /* Ajipicante: diablito de ají con melena de llamas, capa de hojas y brazos */
  ajipicante: o => {
    const R = '#D02A22', D = '#961A16', G = '#3E7E3B', F = '#FF8A3D';
    return `
    <path d="M60 50 C30 80 24 140 40 178 L62 160 C52 130 54 90 72 64Z M140 50 C170 80 176 140 160 178 L138 160 C148 130 146 90 128 64Z" fill="${G}" ${L4}/>
    <path d="M78 160 C74 172 70 182 66 190 L92 190 C92 182 92 172 94 164Z M106 164 C108 172 108 182 108 190 L134 190 C130 182 126 172 122 160Z" fill="${D}" ${L4}/>
    <path d="M100 46 C140 46 154 82 150 116 C146 150 126 172 102 176 C78 174 58 152 52 120 C46 86 62 46 100 46Z" fill="${R}" ${L4}/>
    <path d="M66 74 C60 96 62 120 70 138" fill="none" stroke="#FF8A7E" stroke-width="7" stroke-linecap="round"/>
    ${brazo6('M54 112 C38 112 28 100 24 86', R, 13)}${brazo6('M146 112 C162 112 172 100 176 86', R, 13)}
    ${llamaG(22, 82, .55)}${llamaG(178, 82, .55)}
    ${[[62, 50, .6], [80, 36, .7], [120, 36, .7], [138, 50, .6]].map(([x, y, s]) => llamaG(x, y, s)).join('')}
    <path d="M70 52 C80 32 120 32 130 52 C118 58 110 52 100 58 C90 52 82 58 70 52Z" fill="${G}" ${L4}/>
    <path d="M100 44 C100 26 108 12 124 6" fill="none" stroke="${TK}" stroke-width="10" stroke-linecap="round"/><path d="M100 44 C100 26 108 12 124 6" fill="none" stroke="${G}" stroke-width="6" stroke-linecap="round"/>
    <path d="M76 70 L66 54 L84 64Z M124 70 L134 54 L116 64Z" fill="${D}" ${L3}/>
    ${caraArte(100, 98, o, 1, {dy: 26, enojo: true, colmillo: true, boca: 12})}`;
  },
};
Object.assign(INICIALES_V2, ARTE6);
