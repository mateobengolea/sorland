'use strict';
/* Arte a mano, tanda 3: Cuis, Ñandú, Peludo, Fogón, Ají, Luz mala, Yerba y Jacarandá. */
const hojaA = (x, y, r, s = 1, col = '#7CC56A') => `<path d="M0 0 C${-10 * s} ${-10 * s} ${-8 * s} ${-28 * s} 0 ${-34 * s} C${8 * s} ${-28 * s} ${10 * s} ${-10 * s} 0 0Z M0 ${-4 * s} V${-28 * s}" transform="translate(${x} ${y}) rotate(${r})" fill="${col}" ${L3}/>`;

const ARTE3 = {
  /* ---------- Cuisito → Cuisón: el cuis ---------- */
  cuisito: o => {
    const C = '#A88A6A', D = '#7E6448', B = '#EADCC6';
    return `
    ${pie(76, 182, 22, D)}${pie(124, 182, 22, D)}
    <path d="M100 66 C144 66 162 100 160 132 C158 164 134 182 100 182 C66 182 42 164 40 132 C38 100 56 66 100 66Z" fill="${C}" ${L4}/>
    <path d="M100 122 C124 122 136 140 134 158 C132 172 118 180 100 180 C82 180 68 172 66 158 C64 140 76 122 100 122Z" fill="${B}"/>
    <path d="M58 72 C50 56 58 46 70 52 C74 60 72 68 68 74Z M142 72 C150 56 142 46 130 52 C126 60 128 68 132 74Z" fill="#E7A7A0" ${L3}/>
    <path d="M82 70 C86 60 96 58 100 64 C104 58 114 60 118 70" fill="none" stroke="${D}" stroke-width="3" stroke-linecap="round"/>
    <path d="M86 116 Q100 124 114 116 C110 130 90 130 86 116Z" fill="${B}" ${L3}/>
    ${envolverCara(`<ellipse cx="100" cy="112" rx="5" ry="3.4" fill="#E58AA0" ${L3}/><path d="M80 116 h-26 M80 122 h-22 M120 116 h26 M120 122 h22" stroke="${TK}" stroke-width="2" stroke-linecap="round"/><rect x="95" y="124" width="10" height="7" rx="2" fill="#FFFDF8" ${L3}/>`, 100, 100, o)}
    ${caraArte(100, 98, o, .95, {boca: 0, dx: 22})}`;
  },
  cuison: o => {
    const C = '#957555', D = '#6A5038', B = '#EADCC6';
    return `
    ${pie(68, 186, 28, D)}${pie(132, 186, 28, D)}
    <path d="M100 50 C152 50 176 92 172 132 C168 170 140 188 100 188 C60 188 32 170 28 132 C24 92 48 50 100 50Z" fill="${C}" ${L4}/>
    <path d="M100 116 C130 116 146 138 144 160 C142 178 124 186 100 186 C76 186 58 178 56 160 C54 138 70 116 100 116Z" fill="${B}"/>
    <path d="M30 120 C12 126 10 148 22 158 C30 160 36 150 38 140Z M170 120 C188 126 190 148 178 158 C170 160 164 150 162 140Z" fill="${C}" ${L3}/>
    <path d="M50 58 C38 38 50 24 66 34 C70 44 68 54 62 62Z M150 58 C162 38 150 24 134 34 C130 44 132 54 138 62Z" fill="#E7A7A0" ${L3}/>
    <path d="M70 58 C80 46 92 50 100 44 C108 50 120 46 130 58 M64 74 L54 66 M136 74 L146 66" fill="none" stroke="${D}" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M84 108 Q100 118 116 108 C112 124 88 124 84 108Z" fill="${B}" ${L3}/>
    ${envolverCara(`<ellipse cx="100" cy="104" rx="6" ry="4" fill="#E58AA0" ${L3}/><path d="M78 110 h-30 M78 116 h-26 M122 110 h30 M122 116 h26" stroke="${TK}" stroke-width="2" stroke-linecap="round"/><rect x="93" y="118" width="14" height="10" rx="2" fill="#FFFDF8" ${L3}/><path d="M100 118 v10" ${L3}/>`, 100, 92, o)}
    ${caraArte(100, 88, o, 1, {boca: 0, enojo: true, dx: 22})}`;
  },
  /* ---------- Ñandusito → Ñandú → Ñandurón ---------- */
  nandusito: o => {
    const C = '#B9A88E', D = '#8E7E66', B = '#E6DCC8';
    return `
    <path d="M88 164 L84 184 M76 188 l8 -4 l8 4 M112 164 L116 184 M108 188 l8 -4 l8 4" stroke="#E59A3B" stroke-width="4.5" stroke-linecap="round" fill="none"/>
    <path d="M100 100 C134 100 150 124 148 146 C146 166 128 176 100 176 C72 176 54 166 52 146 C50 124 66 100 100 100Z" fill="${C}" ${L4}/>
    <path d="M134 112 C150 104 160 110 158 122 C150 120 144 124 140 130 M140 128 C156 126 164 134 160 144" fill="${C}" ${L3}/>
    ${[[70, 130], [90, 120], [110, 124], [80, 150], [126, 144]].map(([x, y]) => `<path d="M${x} ${y} q6 6 12 0" fill="none" stroke="${D}" stroke-width="2.5" stroke-linecap="round"/>`).join('')}
    <path d="M86 108 C84 90 86 72 90 60 L110 60 C114 72 116 90 114 108Z" fill="${B}" ${L4}/>
    <path d="M100 18 C124 18 134 34 132 52 C130 68 116 76 100 76 C84 76 70 68 68 52 C66 34 76 18 100 18Z" fill="${B}" ${L4}/>
    <path d="M94 18 C92 8 100 4 104 10 C106 4 114 8 110 18" fill="${C}" ${L3}/>
    ${envolverCara(`<path d="M88 56 C88 50 112 50 112 56 C112 62 104 66 100 72 C96 66 88 62 88 56Z" fill="#F0A93B" ${L3}/>`, 100, 46, o)}
    ${caraArte(100, 42, o, .8, {boca: 0, dx: 18})}`;
  },
  nandu: o => {
    const C = '#A8977C', D = '#7E6E56', B = '#E6DCC8', N = '#4A4038';
    return `
    <path d="M86 150 L80 184 M70 190 l10 -5 l10 5 M116 150 L122 184 M112 190 l10 -5 l10 5" stroke="#E59A3B" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M104 90 C150 86 176 110 174 134 C172 156 146 166 112 164 C78 162 52 150 52 128 C52 106 72 92 104 90Z" fill="${C}" ${L4}/>
    <path d="M166 104 C186 92 200 102 196 118 C188 114 180 118 176 126 M176 124 C194 124 202 136 196 150 C188 144 180 146 174 150" fill="${C}" ${L3}/>
    ${[[80, 120], [104, 108], [128, 112], [90, 142], [120, 140], [146, 130]].map(([x, y]) => `<path d="M${x} ${y} q7 7 14 0" fill="none" stroke="${D}" stroke-width="2.5" stroke-linecap="round"/>`).join('')}
    <path d="M60 110 C54 84 56 58 62 44 L80 44 C82 60 82 84 80 108Z" fill="${N}" ${L4}/>
    <path d="M70 8 C92 8 102 22 100 38 C98 52 86 58 70 58 C54 58 42 52 40 38 C38 22 48 8 70 8Z" fill="${B}" ${L4}/>
    ${envolverCara(`<path d="M42 40 C30 40 18 44 14 48 C22 52 34 52 46 50Z" fill="#F0A93B" ${L3}/>`, 60, 34, o)}
    ${caraArte(70, 30, o, .75, {boca: 0, dx: 16, enojo: true})}`;
  },
  nanduron: o => {
    const C = '#958468', D = '#6A5C46', B = '#E6DCC8', N = '#3A322C', R = '#7FD4FF';
    return `<g transform="translate(6 14) scale(.92)">
    <path d="M14 120 C26 112 38 116 44 124 M8 142 C24 136 38 140 46 146" fill="none" stroke="${R}" stroke-width="5" stroke-linecap="round"/>
    <path d="M86 150 L74 186 M62 192 l12 -6 l12 6 M122 150 L132 186 M120 192 l12 -6 l12 6" stroke="#E59A3B" stroke-width="6" stroke-linecap="round" fill="none"/>
    <path d="M104 80 C156 76 188 102 186 130 C184 156 154 168 114 166 C74 164 46 150 46 124 C46 98 68 82 104 80Z" fill="${C}" ${L4}/>
    <path d="M176 94 C196 76 214 88 210 108 C200 104 190 108 184 118 M184 114 C204 112 214 126 208 144 C198 136 188 138 180 144 M180 142 C196 146 200 160 194 172 C184 164 176 162 168 162" fill="${C}" ${L3}/>
    ${[[76, 110], [100, 98], [126, 100], [150, 112], [86, 136], [116, 134], [144, 138]].map(([x, y]) => `<path d="M${x} ${y} q7 7 14 0" fill="none" stroke="${D}" stroke-width="2.6" stroke-linecap="round"/>`).join('')}
    <path d="M66 104 C70 120 96 126 110 116" fill="none" stroke="${B}" stroke-width="6" stroke-linecap="round"/>
    <path d="M54 104 C48 76 50 46 58 30 L78 30 C80 48 80 76 78 100Z" fill="${N}" ${L4}/>
    <path d="M66 -2 C90 -2 100 14 98 30 C96 44 84 52 66 52 C48 52 36 44 34 30 C32 14 42 -2 66 -2Z" fill="${B}" ${L4}/>
    <path d="M52 2 L40 -6 L56 -10 Z M66 -2 L62 -14 L76 -8Z" fill="${N}" ${L3}/>
    ${envolverCara(`<path d="M36 32 C22 32 8 36 2 42 C12 46 26 46 40 44Z" fill="#F0A93B" ${L3}/>`, 56, 26, o)}
    ${caraArte(66, 22, o, .75, {boca: 0, dx: 16, enojo: true})}</g>`;
  },
  /* ---------- Peludito → Peludón: el peludo ---------- */
  peludito: o => {
    const C = '#C9A57E', D = '#9C7A56', P = '#E8D2B0', Pe = '#F4E8D8';
    return `
    ${pie(70, 184, 22, D)}${pie(130, 184, 22, D)}
    <path d="M150 162 C170 164 178 174 174 180 C164 178 156 176 148 172Z" fill="${P}" ${L3}/>
    <path d="M40 166 C38 116 66 88 104 88 C142 88 166 116 164 166Z" fill="${D}" ${L4}/>
    ${[66, 88, 110, 132].map(x => `<path d="M${x} 166 C${x} 130 ${x + 4} 108 ${x + 8} 96" fill="none" stroke="${C}" stroke-width="5"/>`).join('')}
    ${[[50, 150], [60, 120], [80, 104], [150, 150], [146, 120], [128, 102]].map(([x, y]) => `<path d="M${x} ${y} l-6 6 M${x} ${y} l2 8 M${x} ${y} l7 4" stroke="${Pe}" stroke-width="2" stroke-linecap="round"/>`).join('')}
    <path d="M40 166 H164" ${L4}/>
    <path d="M52 72 C44 56 52 46 62 52 C64 60 62 68 58 74Z M92 72 C100 56 92 46 82 52 C80 60 82 68 86 74Z" fill="${P}" ${L3}/>
    <path d="M72 64 C98 64 112 82 110 104 C108 124 92 136 72 136 C52 136 36 124 34 104 C32 82 46 64 72 64Z" fill="${P}" ${L4}/>
    <path d="M40 112 C28 114 20 122 22 130 C26 136 40 136 50 130Z" fill="${P}" ${L3}/><ellipse cx="24" cy="126" rx="4" ry="3" fill="${TK}"/>
    ${caraArte(74, 98, o, .8, {dy: 22, dx: 16, boca: 7})}`;
  },
  peludon: o => {
    const C = '#B89370', D = '#86664A', P = '#E2C8A2', Pe = '#F4E8D8';
    return `
    ${pie(56, 188, 28, D)}${pie(144, 188, 28, D)}
    <path d="M172 158 C192 156 202 168 198 178 C186 176 176 174 166 170Z" fill="${P}" ${L3}/>
    <path d="M24 170 C20 100 60 62 108 62 C156 62 192 100 188 170Z" fill="${D}" ${L4}/>
    ${[52, 80, 108, 136, 162].map(x => `<path d="M${x} 170 C${x} 120 ${x + 4} 92 ${x + 10} 74" fill="none" stroke="${C}" stroke-width="6"/>`).join('')}
    ${[[36, 150], [44, 112], [70, 82], [176, 150], [170, 112], [146, 82], [108, 70]].map(([x, y]) => `<path d="M${x} ${y} l-7 7 M${x} ${y} l2 9 M${x} ${y} l8 4" stroke="${Pe}" stroke-width="2.4" stroke-linecap="round"/>`).join('')}
    <path d="M24 170 H188" ${L4}/>
    <path d="M36 56 C26 36 36 24 50 32 C52 42 50 52 44 58Z M84 56 C94 36 84 24 70 32 C68 42 70 52 76 58Z" fill="${P}" ${L3}/>
    <path d="M60 46 C90 46 106 68 104 92 C102 116 84 130 60 130 C36 130 18 116 16 92 C14 68 30 46 60 46Z" fill="${P}" ${L4}/>
    <path d="M20 100 C6 102 -2 112 0 122 C4 130 22 130 34 122Z" fill="${P}" ${L3}/><ellipse cx="4" cy="116" rx="4.5" ry="3.4" fill="${TK}"/>
    ${garras([[44, 190], [52, 192], [60, 192], [140, 192], [148, 192], [156, 190]], '#FFFDF8')}
    ${caraArte(62, 88, o, .85, {dy: 24, dx: 16, boca: 8, enojo: true})}`;
  },
  /* ---------- Fogoncito → Fogonero → Fogonazo: espíritu del fogón ---------- */
  fogoncito: o => {
    const F = '#FF8A3D', Fo = '#E2493C', Y = '#FFD23F', L = '#8A5A35';
    return `
    <path d="M56 176 L144 160 M56 160 L144 176" stroke="${TK}" stroke-width="12" stroke-linecap="round"/>
    <path d="M56 176 L144 160 M56 160 L144 176" stroke="${L}" stroke-width="7" stroke-linecap="round"/>
    <path d="M100 26 C112 46 140 62 144 104 C148 142 126 166 100 166 C74 166 52 142 56 104 C60 74 78 64 82 40 C90 52 92 60 96 64 C98 52 98 40 100 26Z" fill="${Fo}" ${L4}/>
    <path d="M100 70 C110 84 128 96 128 120 C128 142 116 156 100 156 C84 156 72 142 72 120 C72 104 82 96 86 84 C90 90 94 94 96 96Z" fill="${F}"/>
    <path d="M100 112 C106 120 114 126 114 138 C114 148 108 154 100 154 C92 154 86 148 86 138 C86 130 92 124 100 112Z" fill="${Y}"/>
    ${caraArte(100, 108, o, .9, {dy: 22})}`;
  },
  fogonero: o => {
    const F = '#FF8A3D', Fo = '#D63A2E', Y = '#FFD23F', L = '#8A5A35', H = '#4A4A58';
    return `
    <path d="M44 184 L156 166 M44 166 L156 184 M60 188 L100 160 L140 188" stroke="${TK}" stroke-width="13" stroke-linecap="round"/>
    <path d="M44 184 L156 166 M44 166 L156 184 M60 188 L100 160 L140 188" stroke="${L}" stroke-width="8" stroke-linecap="round"/>
    <path d="M100 8 C114 32 150 50 154 98 C158 144 132 172 100 172 C68 172 42 144 46 98 C50 64 72 52 76 24 C86 38 88 48 94 52 C96 36 96 22 100 8Z" fill="${Fo}" ${L4}/>
    <path d="M100 58 C112 74 134 88 134 116 C134 142 120 160 100 160 C80 160 66 142 66 116 C66 98 78 88 82 74 C88 80 92 84 94 88Z" fill="${F}"/>
    <path d="M100 110 C108 120 118 128 118 142 C118 154 110 160 100 160 C90 160 82 154 82 142 C82 132 90 124 100 110Z" fill="${Y}"/>
    <path d="M48 104 C28 100 20 116 24 128 C32 132 40 126 44 118Z M152 104 C172 100 180 116 176 128 C168 132 160 126 156 118Z" fill="${Fo}" ${L3}/>
    <path d="M70 44 L130 44 L124 30 C110 24 90 24 76 30Z" fill="${H}" ${L3}/>
    ${caraArte(100, 96, o, .95, {dy: 24, enojo: true, colmillo: true})}`;
  },
  fogonazo: o => {
    const F = '#FF8A3D', Fo = '#C42E26', Y = '#FFD23F', W = '#FFF6D8';
    return `<g transform="translate(6 12) scale(.92)">
    <circle cx="100" cy="110" r="88" fill="${F}" opacity=".15"/>
    <path d="M100 -6 C112 18 132 26 140 4 C156 30 150 54 164 62 C182 52 186 40 190 30 C200 76 184 104 172 118 C184 132 186 160 168 178 L32 178 C14 160 16 132 28 118 C16 104 0 76 10 30 C14 40 18 52 36 62 C50 54 44 30 60 4 C68 26 88 18 100 -6Z" fill="${Fo}" ${L4}/>
    <path d="M100 40 C112 60 140 74 142 110 C144 146 124 170 100 170 C76 170 56 146 58 110 C60 74 88 60 100 40Z" fill="${F}"/>
    <path d="M100 104 C110 118 122 128 122 146 C122 160 112 170 100 170 C88 170 78 160 78 146 C78 128 90 118 100 104Z" fill="${Y}"/>
    <path d="M100 136 C104 142 108 146 108 152 C108 158 104 162 100 162 C96 162 92 158 92 152 C92 146 96 142 100 136Z" fill="${W}"/>
    <path d="M32 140 C10 140 2 160 10 176 L36 176Z M168 140 C190 140 198 160 190 176 L164 176Z" fill="${Fo}" ${L3}/>
    ${garras([[16, 176], [26, 178], [174, 178], [184, 176]], Y)}
    ${caraArte(100, 86, o, 1.05, {dy: 26, enojo: true, colmillo: true})}</g>`;
  },
  /* ---------- Ajicito → Ajipicante: el ají ---------- */
  ajicito: o => {
    const R = '#E2392E', D = '#A82620', G = '#4F9A3F';
    return `
    ${pie(84, 184, 22, '#3E7E3B')}${pie(116, 184, 22, '#3E7E3B')}
    <path d="M100 48 C138 48 150 80 146 112 C142 146 124 172 104 182 C92 186 82 178 74 166 C58 142 52 112 56 88 C60 62 76 48 100 48Z" fill="${R}" ${L4}/>
    <path d="M72 70 C68 90 70 112 76 128" fill="none" stroke="#FF8A7E" stroke-width="6" stroke-linecap="round"/>
    <path d="M70 56 C78 42 122 42 130 56 C120 62 112 58 100 62 C88 58 80 62 70 56Z" fill="${G}" ${L3}/>
    <path d="M100 48 C100 34 106 22 118 18" fill="none" stroke="${TK}" stroke-width="9" stroke-linecap="round"/><path d="M100 48 C100 34 106 22 118 18" fill="none" stroke="${G}" stroke-width="5" stroke-linecap="round"/>
    <path d="M56 104 C42 102 36 112 40 120 C46 120 52 116 56 114Z M144 104 C158 102 164 112 160 120 C154 120 148 116 144 114Z" fill="${R}" ${L3}/>
    ${caraArte(100, 100, o, .9, {dy: 22, colmillo: true})}`;
  },
  ajipicante: o => {
    const R = '#D02A22', D = '#961A16', G = '#3E7E3B', F = '#FF8A3D';
    return `
    ${pie(80, 188, 28, G)}${pie(120, 188, 28, G)}
    ${llamaG(44, 30, .55)}${llamaG(156, 30, .55)}
    <path d="M100 34 C150 34 166 76 160 116 C154 156 130 182 104 190 C88 194 74 184 64 168 C44 138 38 100 44 76 C50 50 70 34 100 34Z" fill="${R}" ${L4}/>
    <path d="M62 60 C56 84 58 112 66 132" fill="none" stroke="#FF8A7E" stroke-width="7" stroke-linecap="round"/>
    <path d="M62 44 C72 22 128 22 138 44 C126 52 114 46 100 52 C86 46 74 52 62 44Z" fill="${G}" ${L4}/>
    <path d="M100 34 C100 18 108 4 124 0" fill="none" stroke="${TK}" stroke-width="10" stroke-linecap="round"/><path d="M100 34 C100 18 108 4 124 0" fill="none" stroke="${G}" stroke-width="6" stroke-linecap="round"/>
    <path d="M44 96 C22 92 14 110 20 122 C28 124 36 118 42 112Z M160 96 C182 92 190 110 184 122 C176 124 168 118 162 112Z" fill="${R}" ${L3}/>
    ${garras([[20, 122], [184, 122]], '#FFFDF8')}
    ${envolverCara(`${llamaG(100, 146, .35)}`, 100, 100, o)}
    ${caraArte(100, 92, o, 1, {dy: 26, enojo: true, colmillo: true, boca: 12})}`;
  },
  /* ---------- Luz mala: fuego fatuo de la pampa (etapa única) ---------- */
  luzmala: o => {
    const C = '#7FF0C8', D = '#3FBF9A', W = '#E8FFF6';
    return `
    <circle cx="100" cy="96" r="80" fill="${C}" opacity=".14"/><circle cx="100" cy="96" r="60" fill="${C}" opacity=".16"/>
    <path d="M60 128 C40 148 46 172 70 178 C62 166 66 156 76 150 C74 168 90 186 108 182 C98 172 100 160 110 152 C118 170 140 176 152 160 C138 160 132 150 136 140Z" fill="${D}" ${L4}/>
    <path d="M100 18 C114 40 150 58 154 98 C158 134 132 150 100 150 C68 150 42 134 46 98 C50 58 86 40 100 18Z" fill="${C}" ${L4}/>
    <path d="M100 56 C112 72 128 84 128 104 C128 124 116 136 100 136 C84 136 72 124 72 104 C72 84 88 72 100 56Z" fill="${W}" opacity=".85"/>
    ${[[30, 60], [170, 50], [24, 130], [176, 130]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${C}" ${L3}/>`).join('')}
    ${envolverCara(`${ojosPar(82, 118, 98, .9, {...o, iris: '#2A9A7A'}, true)}<path d="M88 122 Q100 132 112 122" fill="none" ${L3}/>`, 100, 100, o)}`;
  },
  /* ---------- Brotecito → Yerbatín → Yerbatero: la yerba mate ---------- */
  brotecito: o => {
    const C = '#9BD36A', D = '#6AA63E', T = '#A86A3E';
    return `
    <ellipse cx="100" cy="176" rx="40" ry="10" fill="${T}" ${L3}/>
    ${hojaA(92, 72, -40, 1.1)}${hojaA(108, 72, 40, 1.1)}
    <path d="M100 86 V70" ${L4}/>
    <path d="M100 76 C134 76 148 104 146 132 C144 160 124 178 100 178 C76 178 56 160 54 132 C52 104 66 76 100 76Z" fill="${C}" ${L4}/>
    <path d="M74 96 C80 88 90 86 96 88" fill="none" stroke="#D8F2B8" stroke-width="5" stroke-linecap="round"/>
    ${caraArte(100, 126, o, .9, {dy: 22})}`;
  },
  yerbatin: o => {
    const C = '#7CC56A', D = '#4F9A3F', Ca = '#B98A5A', M = '#9C6A3A';
    return `
    ${pie(80, 184, 24, D)}${pie(120, 184, 24, D)}
    <path d="M100 98 C130 98 144 122 142 146 C140 168 124 182 100 182 C76 182 60 168 58 146 C56 122 70 98 100 98Z" fill="${C}" ${L4}/>
    <path d="M100 120 C114 120 122 134 120 150 C118 164 110 172 100 172 C90 172 82 164 80 150 C78 134 86 120 100 120Z" fill="#D8F2B8"/>
    <path d="M60 126 C44 116 34 124 36 136 C46 136 54 134 62 138Z" fill="${C}" ${L3}/>
    <path d="M138 130 C150 122 160 126 160 134 L156 160 C154 168 142 168 140 160Z" fill="${Ca}" ${L3}/><path d="M146 126 L162 92" stroke="#C9CED6" stroke-width="5" stroke-linecap="round"/><path d="M146 126 L162 92" ${L3} fill="none"/>
    ${hojaA(82, 46, -30, 1.1)}${hojaA(100, 40, 0, 1.2)}${hojaA(118, 46, 30, 1.1)}
    <path d="M100 38 C134 38 148 60 146 86 C144 110 124 122 100 122 C76 122 56 110 54 86 C52 60 66 38 100 38Z" fill="${C}" ${L4}/>
    ${caraArte(100, 82, o, .92, {dy: 22})}`;
  },
  yerbatero: o => {
    const C = '#5FAE5A', D = '#3E7E3B', Ca = '#A8784A', P = '#C9CED6', M = '#8AC85A';
    return `<g transform="translate(4 8) scale(.92)">
    ${pie(70, 188, 30, D)}${pie(130, 188, 30, D)}
    <path d="M100 86 C144 86 162 118 160 148 C158 174 134 190 100 190 C66 190 42 174 40 148 C38 118 56 86 100 86Z" fill="${C}" ${L4}/>
    <path d="M100 112 C120 112 132 130 130 152 C128 170 116 182 100 182 C84 182 72 170 70 152 C68 130 80 112 100 112Z" fill="#D8F2B8"/>
    <path d="M150 104 C166 96 186 100 186 114 L180 150 C178 162 158 164 154 152Z" fill="${Ca}" ${L4}/>
    <path d="M154 112 C164 106 176 106 180 112" fill="none" stroke="${M}" stroke-width="6"/>
    <path d="M168 108 L186 60" stroke="${P}" stroke-width="6" stroke-linecap="round"/><path d="M168 108 L186 60" ${L3} fill="none"/>
    <path d="M44 120 C24 112 14 126 18 140 C28 142 36 138 44 136Z" fill="${C}" ${L3}/>
    ${hojaA(66, 40, -50, 1.2)}${hojaA(82, 30, -20, 1.3)}${hojaA(100, 26, 0, 1.4)}${hojaA(118, 30, 20, 1.3)}${hojaA(134, 40, 50, 1.2)}
    <path d="M100 24 C140 24 156 50 154 80 C152 106 130 120 100 120 C70 120 48 106 46 80 C44 50 60 24 100 24Z" fill="${C}" ${L4}/>
    <path d="M60 50 C64 38 80 30 92 30" fill="none" stroke="#B8E890" stroke-width="5" stroke-linecap="round"/>
    ${caraArte(100, 74, o, .95, {dy: 24, enojo: true})}</g>`;
  },
  /* ---------- Jacarandita → Jacarandá ---------- */
  jacarandita: o => {
    const V = '#A07CE0', Vo = '#7A58C0', C = '#8BC86A', B = '#E8F5D8';
    const camp = (x, y, r) => `<path d="M0 0 C-8 0 -10 10 -8 18 L-4 14 L0 20 L4 14 L8 18 C10 10 8 0 0 0Z" transform="translate(${x} ${y}) rotate(${r})" fill="${V}" ${L3}/>`;
    return `
    ${pie(82, 184, 22, '#4F9A3F')}${pie(118, 184, 22, '#4F9A3F')}
    <path d="M100 110 C128 110 140 130 138 152 C136 172 120 182 100 182 C80 182 64 172 62 152 C60 130 72 110 100 110Z" fill="${C}" ${L4}/>
    <path d="M100 126 C112 126 120 140 118 156 C116 168 108 176 100 176 C92 176 84 168 82 156 C80 140 88 126 100 126Z" fill="${B}"/>
    <path d="M56 70 C44 40 70 20 100 22 C130 20 156 40 144 70 C160 86 150 112 130 112 L70 112 C50 112 40 86 56 70Z" fill="${V}" ${L4}/>
    <path d="M70 44 C80 34 94 32 104 34" fill="none" stroke="#C9B2F2" stroke-width="5" stroke-linecap="round"/>
    ${camp(58, 108, 10)}${camp(144, 108, -10)}${camp(100, 112, 0)}
    <path d="M100 58 C126 58 138 74 136 92 C134 110 120 120 100 120 C80 120 66 110 64 92 C62 74 74 58 100 58Z" fill="${B}" ${L4}/>
    ${caraArte(100, 88, o, .85, {dy: 20, dx: 18})}`;
  },
  jacaranda: o => {
    const V = '#9470DA', Vo = '#6E4CB8', T = '#8A5A35', B = '#E8F5D8';
    const camp = (x, y, r, s = 1) => `<path d="M0 0 C-8 0 -10 10 -8 18 L-4 14 L0 20 L4 14 L8 18 C10 10 8 0 0 0Z" transform="translate(${x} ${y}) rotate(${r}) scale(${s})" fill="${V}" ${L3}/>`;
    return `
    <ellipse cx="100" cy="182" rx="80" ry="10" fill="#C9B2F2" opacity=".6"/>
    ${[[30, 176, 30], [60, 184, -20], [150, 182, 40], [176, 172, -10]].map(([x, y, r]) => camp(x, y, r, .8)).join('')}
    <path d="M78 186 C80 160 84 140 86 118 L114 118 C116 140 120 160 122 186Z" fill="${T}" ${L4}/>
    <path d="M86 186 C88 176 70 172 62 182 M114 186 C112 176 130 172 138 182" fill="${T}" ${L3}/>
    <path d="M90 130 C92 150 92 166 94 180" fill="none" stroke="#6B4226" stroke-width="2.5"/>
    <path d="M86 122 C70 112 52 104 36 106 M114 122 C130 112 148 104 164 106" fill="none" stroke="${TK}" stroke-width="10" stroke-linecap="round"/>
    <path d="M86 122 C70 112 52 104 36 106 M114 122 C130 112 148 104 164 106" fill="none" stroke="${T}" stroke-width="5" stroke-linecap="round"/>
    <path d="M100 4 C140 0 168 18 172 44 C192 52 198 80 182 96 C176 116 148 120 130 108 C120 122 80 122 70 108 C52 120 24 116 18 96 C2 80 8 52 28 44 C32 18 60 0 100 4Z" fill="${V}" ${L4}/>
    <path d="M40 50 C52 32 72 24 92 22 M130 26 C146 30 158 40 162 52" fill="none" stroke="#C9B2F2" stroke-width="6" stroke-linecap="round"/>
    ${camp(24, 96, 20)}${camp(176, 96, -20)}${camp(70, 110, 6)}${camp(130, 110, -6)}${camp(50, 70, 0, .8)}${camp(152, 70, 0, .8)}
    <path d="M100 54 C124 54 136 70 134 88 C132 104 118 112 100 112 C82 112 68 104 66 88 C64 70 76 54 100 54Z" fill="${B}" ${L4}/>
    ${caraArte(100, 84, o, .82, {dy: 18, dx: 18, enojo: true})}`;
  },
};
Object.assign(INICIALES_V2, ARTE3);
