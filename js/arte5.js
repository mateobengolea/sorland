'use strict';
/* Arte a mano, tanda 5: Bichofeo, Barrilete, Pingüino, Escarcha, Huemul, Vaquita, Hormiga, Grillo, Mariposa, Mamboretá y Abeja. */
const alaBicho5 = (x, y, rx, ry, r, col, op = .85) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${r} ${x} ${y})" fill="${col}" opacity="${op}" ${L3}/>`;
const antenas5 = (x1, x2, y, top, col = '#3A3A48') => `<path d="M${x1} ${y} Q${x1 - 6} ${top + 10} ${x1 - 14} ${top} M${x2} ${y} Q${x2 + 6} ${top + 10} ${x2 + 14} ${top}" fill="none" stroke="${TK}" stroke-width="3.5" stroke-linecap="round"/><circle cx="${x1 - 14}" cy="${top}" r="5" fill="${col}" ${L3}/><circle cx="${x2 + 14}" cy="${top}" r="5" fill="${col}" ${L3}/>`;
const patitas5 = (pts, col = '#3A3A48') => pts.map(([x1, y1, x2, y2]) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${TK}" stroke-width="7" stroke-linecap="round"/><path d="M${x1} ${y1} L${x2} ${y2}" stroke="${col}" stroke-width="3.5" stroke-linecap="round"/>`).join('');
const copo5 = (x, y, s = 1, col = '#FFFFFF') => `<g transform="translate(${x} ${y}) scale(${s})" stroke="${col}" stroke-width="3" stroke-linecap="round"><path d="M0 -10 V10 M-9 -5 L9 5 M-9 5 L9 -5"/></g>`;

const ARTE5 = {
  /* ---------- Bichofeo: el benteveo (etapa única) ---------- */
  bichofeo: o => {
    const C = '#8A6A3E', Y = '#FFD23F', W = '#FFFDF8', K = '#2E2E3A';
    return `
    <path d="M86 170 v14 M78 188 l8 -4 l8 4 M114 170 v14 M106 188 l8 -4 l8 4" stroke="#5A4A40" stroke-width="4" stroke-linecap="round" fill="none"/>
    <path d="M140 130 C164 136 182 150 186 166 C172 164 162 168 154 160Z" fill="${C}" ${L3}/>
    <path d="M100 64 C140 64 158 94 156 126 C154 156 132 176 100 176 C68 176 46 156 44 126 C42 94 60 64 100 64Z" fill="${Y}" ${L4}/>
    <path d="M150 96 C166 110 168 140 152 160 C140 150 136 130 140 110Z M50 96 C34 110 32 140 48 160 C60 150 64 130 60 110Z" fill="${C}" ${L3}/>
    <path d="M100 18 C136 18 152 42 150 70 C148 94 128 106 100 106 C72 106 52 94 50 70 C48 42 64 18 100 18Z" fill="${W}" ${L4}/>
    <path d="M51 60 C52 34 70 18 100 18 C130 18 148 34 149 60 C130 52 70 52 51 60Z" fill="${K}" ${L3}/>
    <path d="M52 78 C62 72 74 74 80 80 M148 78 C138 72 126 74 120 80" fill="none" stroke="${K}" stroke-width="6" stroke-linecap="round"/>
    <path d="M86 20 C90 10 110 10 114 20 Z" fill="${Y}" ${L3}/>
    ${caraArte(100, 82, o, .85, {boca: 0, dx: 20, enojo: true, sinMejillas: true})}
    ${envolverCara(`<path d="M90 94 L110 94 L100 110Z" fill="#3A3A48" ${L3}/>`, 100, 86, o)}`;
  },
  /* ---------- Barrilete → Barriletazo: el barrilete vivo ---------- */
  barrilete: o => {
    const A = '#5AB4E8', R = '#E2493C', Y = '#FFD23F', W = '#FFFDF8';
    return `
    <path d="M100 160 C90 172 110 178 100 190" fill="none" stroke="${TK}" stroke-width="3"/>
    ${[[92, 172, R], [106, 182, Y]].map(([x, y, c]) => `<path d="M${x} ${y} l8 -6 l0 12Z" fill="${c}" ${L3}/>`).join('')}
    <path d="M100 14 L170 86 L100 162 L30 86Z" fill="${A}" ${L4}/>
    <path d="M100 14 L170 86 L100 86Z" fill="${Y}" ${L3}/><path d="M30 86 L100 162 L100 86Z" fill="${R}" ${L3}/>
    <path d="M100 14 V162 M30 86 H170" stroke="${TK}" stroke-width="2.5"/>
    <path d="M30 86 C14 80 8 92 12 100 M170 86 C186 80 192 92 188 100" fill="none" stroke="${TK}" stroke-width="4" stroke-linecap="round"/>
    <path d="M100 58 C122 58 132 72 130 88 C128 104 116 112 100 112 C84 112 72 104 70 88 C68 72 78 58 100 58Z" fill="${W}" ${L4}/>
    ${caraArte(100, 82, o, .78, {dy: 22, dx: 16, boca: 8})}`;
  },
  barriletazo: o => {
    const A = '#3E96D0', R = '#C42E26', Y = '#FFD23F', W = '#FFFDF8', V = '#BFE6FB';
    return `
    <path d="M20 40 C34 32 46 36 52 44 M150 30 C164 24 176 28 182 36 M10 150 C24 144 36 146 42 154" fill="none" stroke="${V}" stroke-width="5" stroke-linecap="round"/>
    <path d="M100 168 C80 178 120 184 96 196" fill="none" stroke="${TK}" stroke-width="3.5"/>
    ${[[80, 176, R], [108, 184, Y], [88, 194, A]].map(([x, y, c]) => `<path d="M${x} ${y} l10 -8 l0 16Z" fill="${c}" ${L3}/>`).join('')}
    <path d="M100 2 L188 84 L100 172 L12 84Z" fill="${A}" ${L4}/>
    <path d="M100 2 L188 84 L100 84Z" fill="${Y}" ${L3}/><path d="M12 84 L100 172 L100 84Z" fill="${R}" ${L3}/>
    <path d="M100 2 V172 M12 84 H188" stroke="${TK}" stroke-width="3"/>
    <path d="M12 84 L0 64 L22 76Z M188 84 L200 64 L178 76Z M12 84 L0 104 L22 92Z M188 84 L200 104 L178 92Z" fill="${W}" ${L3}/>
    <path d="M100 50 C126 50 138 66 136 86 C134 104 120 114 100 114 C80 114 66 104 64 86 C62 66 74 50 100 50Z" fill="${W}" ${L4}/>
    ${caraArte(100, 80, o, .85, {dy: 22, dx: 18, boca: 9, enojo: true, colmillo: true})}`;
  },
  /* ---------- Pingüinito → Pingüinazo ---------- */
  pinguinito: o => {
    const K = '#2E3A50', W = '#FFFDF8', Y = '#F2B53A';
    return `
    ${pie(82, 184, 24, Y)}${pie(118, 184, 24, Y)}
    <path d="M100 40 C140 40 158 76 156 116 C154 156 132 182 100 182 C68 182 46 156 44 116 C42 76 60 40 100 40Z" fill="${K}" ${L4}/>
    <path d="M100 64 C126 64 138 92 136 124 C134 156 120 176 100 176 C80 176 66 156 64 124 C62 92 74 64 100 64Z" fill="${W}"/>
    <path d="M48 104 C30 116 26 136 32 148 C42 144 50 132 54 120Z M152 104 C170 116 174 136 168 148 C158 144 150 132 146 120Z" fill="${K}" ${L3}/>
    <path d="M60 52 C70 44 84 42 94 44" fill="none" stroke="#5A6A88" stroke-width="5" stroke-linecap="round"/>
    ${envolverCara(`<path d="M90 106 L110 106 L100 118Z" fill="${Y}" ${L3}/>`, 100, 96, o)}
    ${caraArte(100, 92, o, .9, {boca: 0, dx: 20})}`;
  },
  pinguinazo: o => {
    const K = '#24304A', W = '#FFFDF8', Y = '#F2B53A', H = '#BFE6FB';
    return `
    ${pie(74, 188, 32, Y)}${pie(126, 188, 32, Y)}
    <path d="M100 24 C150 24 174 70 170 118 C166 166 138 190 100 190 C62 190 34 166 30 118 C26 70 50 24 100 24Z" fill="${K}" ${L4}/>
    <path d="M100 56 C132 56 148 90 146 128 C144 164 126 184 100 184 C74 184 56 164 54 128 C52 90 68 56 100 56Z" fill="${W}"/>
    <path d="M34 92 C8 110 2 140 10 156 C24 150 34 134 40 118Z M166 92 C192 110 198 140 190 156 C176 150 166 134 160 118Z" fill="${K}" ${L4}/>
    <path d="M70 24 L76 4 L88 22 L100 0 L112 22 L124 4 L130 24Z" fill="${H}" ${L3}/>
    <path d="M60 140 C80 150 120 150 140 140" fill="none" stroke="${H}" stroke-width="4" stroke-linecap="round"/>
    ${copo5(24, 60, 1, H)}${copo5(178, 52, .9, H)}
    ${envolverCara(`<path d="M86 100 L114 100 L100 116Z" fill="${Y}" ${L3}/>`, 100, 88, o)}
    ${caraArte(100, 84, o, .95, {boca: 0, dx: 22, enojo: true})}`;
  },
  /* ---------- Escarchín → Escarchón → Glaciaro ---------- */
  escarchin: o => {
    const C = '#BFE6FB', D = '#7EC0E8', W = '#FFFFFF';
    return `
    <path d="M100 30 L116 60 L148 56 L136 86 L160 108 L130 120 L132 152 L100 140 L68 152 L70 120 L40 108 L64 86 L52 56 L84 60Z" fill="${C}" ${L4}/>
    <path d="M100 30 L100 140 M52 56 L148 152 M148 56 L52 152" stroke="${W}" stroke-width="3" opacity=".7"/>
    <circle cx="100" cy="98" r="34" fill="${C}" ${L4}/>
    ${pie(86, 182, 18, D)}${pie(114, 182, 18, D)}<path d="M92 150 V170 M108 150 V170" ${L3}/>
    ${copo5(30, 160, .8, D)}${copo5(170, 40, .8, D)}
    ${caraArte(100, 94, o, .85, {dy: 20, dx: 16, boca: 8})}`;
  },
  escarchon: o => {
    const C = '#A8DAF8', D = '#5EA8D8', W = '#FFFFFF';
    return `
    ${pie(74, 188, 28, D)}${pie(126, 188, 28, D)}
    <path d="M100 74 C142 74 162 104 160 140 C158 170 134 188 100 188 C66 188 42 170 40 140 C38 104 58 74 100 74Z" fill="${C}" ${L4}/>
    <path d="M100 110 C120 110 132 128 130 150 C128 168 116 180 100 180 C84 180 72 168 70 150 C68 128 80 110 100 110Z" fill="${W}" opacity=".8"/>
    <path d="M42 120 L14 104 L30 132 L10 140 L44 146Z M158 120 L186 104 L170 132 L190 140 L156 146Z" fill="${C}" ${L3}/>
    <path d="M58 40 L50 8 L76 30 Z M100 30 L100 -2 L114 26Z M142 40 L150 8 L124 30Z" fill="${W}" ${L3}/>
    <path d="M100 26 C140 26 156 52 154 80 C152 106 130 120 100 120 C70 120 48 106 46 80 C44 52 60 26 100 26Z" fill="${C}" ${L4}/>
    <path d="M64 44 C72 36 86 34 96 36" fill="none" stroke="${W}" stroke-width="5" stroke-linecap="round"/>
    ${caraArte(100, 74, o, .92, {dy: 22, enojo: true})}`;
  },
  glaciaro: o => {
    const C = '#8CC8F0', D = '#4A90C8', W = '#FFFFFF', I = '#DDF1FD';
    return `<g transform="translate(8 16) scale(.92)">
    ${pie(60, 190, 36, D)}${pie(140, 190, 36, D)}
    <path d="M100 58 C156 58 186 98 182 142 C178 176 146 192 100 192 C54 192 22 176 18 142 C14 98 44 58 100 58Z" fill="${C}" ${L4}/>
    ${[[40, 70, 50, -30], [70, 52, 56, -12], [100, 46, 64, 0], [130, 52, 56, 12], [160, 70, 50, 30]].map(([x, y, h, r]) => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M-12 0 L0 ${-h} L12 0Z" fill="${I}" ${L3}/><path d="M0 ${-h} V0" stroke="${W}" stroke-width="2"/></g>`).join('')}
    <path d="M100 104 C126 104 142 124 140 150 C138 172 122 186 100 186 C78 186 62 172 60 150 C58 124 74 104 100 104Z" fill="${I}" opacity=".85"/>
    <path d="M24 112 C-4 108 -8 136 4 152 C14 156 24 148 28 138Z M176 112 C204 108 208 136 196 152 C186 156 176 148 172 138Z" fill="${C}" ${L4}/>
    ${garras([[2, 152], [12, 156], [188, 156], [198, 152]], I)}
    <path d="M48 84 C56 72 70 66 82 66" fill="none" stroke="${W}" stroke-width="6" stroke-linecap="round"/>
    ${copo5(20, 40, 1, W)}${copo5(182, 30, 1, W)}
    ${caraArte(100, 102, o, 1, {dy: 24, enojo: true, colmillo: true, boca: 12})}</g>`;
  },
  /* ---------- Huemulito → Huemul ---------- */
  huemulito: o => {
    const C = '#B08A5E', D = '#86663E', B = '#F2E2C8';
    return `
    <path d="M64 140 C62 160 64 176 66 186 L80 186 C80 174 80 160 80 148Z M120 148 C120 162 122 176 124 186 L138 186 C138 172 138 160 136 146Z" fill="${D}" ${L4}/>
    <path d="M60 112 C88 100 136 104 148 128 C156 146 140 160 116 160 C90 160 64 156 56 140 C52 128 52 118 60 112Z" fill="${C}" ${L4}/>
    ${[[90, 124], [112, 120], [128, 134]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.5" fill="${B}"/>`).join('')}
    <path d="M144 120 C152 112 160 114 158 124 C156 130 150 130 146 128Z" fill="${B}" ${L3}/>
    <path d="M34 50 C18 40 16 26 26 24 C36 26 42 40 44 52Z M100 50 C116 40 118 26 108 24 C98 26 92 40 90 52Z" fill="${C}" ${L3}/>
    <path d="M67 36 C96 36 110 56 108 80 C106 102 90 116 67 116 C44 116 28 102 26 80 C24 56 38 36 67 36Z" fill="${C}" ${L4}/>
    <path d="M67 82 C84 82 92 92 90 104 C88 112 78 116 67 116 C56 116 46 112 44 104 C42 92 50 82 67 82Z" fill="${B}" ${L3}/>
    ${envolverCara(`<ellipse cx="67" cy="96" rx="6" ry="4" fill="${TK}"/>`, 67, 80, o)}
    ${caraArte(67, 70, o, .82, {dy: 34, dx: 16, boca: 7})}`;
  },
  huemul: o => {
    const C = '#9C7448', D = '#6E5030', B = '#F2E2C8', A = '#E6D2B0';
    return `
    <path d="M62 140 C60 160 62 178 64 190 L80 190 C80 176 80 160 80 148Z M136 146 C136 162 138 178 140 190 L156 190 C156 174 156 160 152 144Z M90 152 C90 166 92 180 94 190 L110 190 C110 178 110 166 108 154Z" fill="${D}" ${L4}/>
    <path d="M58 108 C92 92 150 98 166 124 C176 144 158 162 128 164 C98 166 66 160 56 142 C50 128 50 116 58 108Z" fill="${C}" ${L4}/>
    <path d="M62 140 C86 154 120 158 150 152 C130 162 96 162 70 154Z" fill="${B}"/>
    <path d="M162 114 C172 106 180 110 178 120 C176 126 170 126 164 124Z" fill="${B}" ${L3}/>
    <path d="M48 36 C40 20 26 12 16 14 M40 24 L28 6 M30 18 L14 2 M80 36 C88 20 102 12 112 14 M88 24 L100 6 M98 18 L114 2" fill="none" stroke="${TK}" stroke-width="10" stroke-linecap="round"/>
    <path d="M48 36 C40 20 26 12 16 14 M40 24 L28 6 M30 18 L14 2 M80 36 C88 20 102 12 112 14 M88 24 L100 6 M98 18 L114 2" fill="none" stroke="${A}" stroke-width="5.5" stroke-linecap="round"/>
    <path d="M30 56 C14 46 12 32 22 30 C32 32 38 46 40 58Z M98 56 C114 46 116 32 106 30 C96 32 90 46 88 58Z" fill="${C}" ${L3}/>
    <path d="M64 38 C94 38 108 60 106 84 C104 108 88 122 64 122 C40 122 24 108 22 84 C20 60 34 38 64 38Z" fill="${C}" ${L4}/>
    <path d="M64 88 C82 88 90 98 88 110 C86 118 76 122 64 122 C52 122 42 118 40 110 C38 98 46 88 64 88Z" fill="${B}" ${L3}/>
    ${envolverCara(`<ellipse cx="64" cy="102" rx="7" ry="4.5" fill="${TK}"/>`, 64, 84, o)}
    ${caraArte(64, 74, o, .82, {dy: 36, dx: 16, boca: 7, enojo: true})}`;
  },
  /* ---------- Vaquitita → Vaquitón: la vaquita de San Antonio ---------- */
  vaquitita: o => {
    const R = '#E2392E', K = '#2E2E3A';
    return `
    ${patitas5([[70, 160, 58, 182], [100, 166, 100, 186], [130, 160, 142, 182]])}
    <path d="M100 74 C144 74 164 108 160 140 C156 166 132 178 100 178 C68 178 44 166 40 140 C36 108 56 74 100 74Z" fill="${R}" ${L4}/>
    <path d="M100 80 V176" stroke="${TK}" stroke-width="3"/>
    ${[[70, 118, 10], [130, 118, 10], [76, 152, 8], [124, 152, 8]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${K}"/>`).join('')}
    <path d="M64 96 C70 88 80 84 88 86" fill="none" stroke="#FF8A7E" stroke-width="5" stroke-linecap="round"/>
    ${antenas5(86, 114, 52, 22, K)}
    <path d="M100 40 C126 40 138 56 136 74 C134 92 120 100 100 100 C80 100 66 92 64 74 C62 56 74 40 100 40Z" fill="${K}" ${L4}/>
    ${envolverCara(`${ojosPar(88, 112, 72, .72, o, false)}${o.humor === 'feliz' ? `<path d="M94 86 Q100 92 106 86" fill="#E58AA0" stroke="#FFFDF8" stroke-width="2"/>` : `<path d="M94 88 Q100 90 106 88" fill="none" stroke="#FFFDF8" stroke-width="2"/>`}`, 100, 72, o)}`;
  },
  vaquiton: o => {
    const R = '#C42E26', K = '#24242E', Y = '#FFD23F';
    return `
    ${patitas5([[56, 160, 34, 186], [100, 170, 100, 192], [144, 160, 166, 186], [60, 130, 22, 136], [140, 130, 178, 136]])}
    <path d="M100 56 C156 56 182 98 178 138 C174 172 144 188 100 188 C56 188 26 172 22 138 C18 98 44 56 100 56Z" fill="${R}" ${L4}/>
    <path d="M100 62 V186" stroke="${TK}" stroke-width="3.5"/>
    ${[[62, 106, 14], [138, 106, 14], [56, 148, 11], [144, 148, 11], [82, 172, 8], [118, 172, 8]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${K}"/>`).join('')}
    <path d="M48 82 C58 70 74 64 86 66" fill="none" stroke="#FF8A7E" stroke-width="6" stroke-linecap="round"/>
    ${antenas5(82, 118, 34, 2, Y)}
    <path d="M100 18 C132 18 146 38 144 60 C142 82 124 92 100 92 C76 92 58 82 56 60 C54 38 68 18 100 18Z" fill="${K}" ${L4}/>
    <path d="M66 40 L52 28 L72 32Z M134 40 L148 28 L128 32Z" fill="${Y}" ${L3}/>
    ${envolverCara(`${ojosPar(84, 116, 52, .8, o, true)}${o.humor === 'feliz' ? `<path d="M90 70 Q100 80 110 70" fill="#E58AA0" stroke="#FFFDF8" stroke-width="2"/>` : `<path d="M90 72 Q100 74 110 72" fill="none" stroke="#FFFDF8" stroke-width="2"/>`}`, 100, 54, o)}`;
  },
  /* ---------- Hormiguín → Hormigón → Hormigazo ---------- */
  hormiguin: o => {
    const C = '#C0503A', D = '#8A3424';
    return `
    ${patitas5([[86, 130, 60, 150], [86, 140, 66, 170], [114, 130, 140, 150], [114, 140, 134, 170]], D)}
    <ellipse cx="100" cy="160" rx="30" ry="24" fill="${C}" ${L4}/>
    <ellipse cx="100" cy="126" rx="18" ry="16" fill="${C}" ${L4}/>
    ${antenas5(86, 114, 52, 18, C)}
    <path d="M100 46 C130 46 142 64 140 86 C138 106 122 116 100 116 C78 116 62 106 60 86 C58 64 70 46 100 46Z" fill="${C}" ${L4}/>
    <path d="M74 60 C80 54 90 52 96 54" fill="none" stroke="#E8846E" stroke-width="4" stroke-linecap="round"/>
    ${caraArte(100, 82, o, .85, {dy: 20, dx: 18, boca: 8})}`;
  },
  hormigon: o => {
    const C = '#A8402E', D = '#6E2A1C', A = '#9AA2AD';
    return `
    ${patitas5([[80, 126, 46, 140], [80, 140, 50, 176], [120, 126, 154, 140], [120, 140, 150, 176]], D)}
    <ellipse cx="100" cy="164" rx="40" ry="26" fill="${C}" ${L4}/>
    <path d="M70 156 Q100 168 130 156" fill="none" stroke="${D}" stroke-width="3"/>
    <ellipse cx="100" cy="124" rx="24" ry="20" fill="${C}" ${L4}/>
    ${antenas5(82, 118, 40, 4, C)}
    <path d="M100 34 C136 34 152 56 150 82 C148 106 128 118 100 118 C72 118 52 106 50 82 C48 56 64 34 100 34Z" fill="${C}" ${L4}/>
    <path d="M70 108 L58 124 L76 116Z M130 108 L142 124 L124 116Z" fill="${A}" ${L3}/>
    <path d="M66 50 C74 42 86 40 94 42" fill="none" stroke="#D86E58" stroke-width="5" stroke-linecap="round"/>
    ${caraArte(100, 76, o, .92, {dy: 22, enojo: true})}`;
  },
  hormigazo: o => {
    const C = '#8A2E20', D = '#5A1C14', A = '#C9CED6', Y = '#FFD23F';
    return `
    ${patitas5([[70, 132, 24, 146], [72, 146, 30, 186], [130, 132, 176, 146], [128, 146, 170, 186]], D)}
    <ellipse cx="100" cy="166" rx="50" ry="28" fill="${C}" ${L4}/>
    <path d="M60 156 Q100 170 140 156 M64 176 Q100 188 136 176" fill="none" stroke="${D}" stroke-width="3"/>
    <path d="M70 116 C70 100 130 100 130 116 L130 140 C130 152 70 152 70 140Z" fill="${C}" ${L4}/>
    <path d="M76 120 H124" stroke="${Y}" stroke-width="4"/>
    <path d="M70 116 L36 92 L30 108 L56 120Z M130 116 L164 92 L170 108 L144 120Z" fill="${C}" ${L4}/>
    <path d="M36 92 L22 76 L40 84 Z M164 92 L178 76 L160 84Z" fill="${A}" ${L3}/>
    ${antenas5(80, 120, 30, -2, Y)}
    <path d="M100 22 C140 22 158 46 156 74 C154 100 132 114 100 114 C68 114 46 100 44 74 C42 46 60 22 100 22Z" fill="${C}" ${L4}/>
    <path d="M62 104 L44 128 L72 114Z M138 104 L156 128 L128 114Z" fill="${A}" ${L4}/>
    <path d="M60 40 C68 30 82 28 92 30" fill="none" stroke="#C25844" stroke-width="5" stroke-linecap="round"/>
    ${caraArte(100, 68, o, .98, {dy: 24, enojo: true, colmillo: true})}`;
  },
  /* ---------- Grillito → Grillón ---------- */
  grillito: o => {
    const C = '#6E9A3E', D = '#4A6E26', B = '#D8E8A8';
    return `
    ${patitas5([[70, 150, 54, 182], [130, 150, 146, 182]], D)}
    <path d="M128 140 L170 118 L180 182" fill="none" stroke="${TK}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M128 140 L170 118 L180 182" fill="none" stroke="${C}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M100 100 C134 100 150 124 148 150 C146 170 128 180 100 180 C72 180 54 170 52 150 C50 124 66 100 100 100Z" fill="${C}" ${L4}/>
    <path d="M60 120 C80 108 130 108 146 128 C130 120 80 120 62 134Z" fill="${D}" ${L3}/>
    <path d="M100 140 C114 140 122 150 120 162 C118 172 110 176 100 176 C90 176 82 172 80 162 C78 150 86 140 100 140Z" fill="${B}"/>
    <path d="M84 50 Q70 20 40 14 M116 50 Q130 20 160 14" fill="none" stroke="${TK}" stroke-width="3" stroke-linecap="round"/>
    <path d="M100 42 C132 42 146 62 144 86 C142 108 124 120 100 120 C76 120 58 108 56 86 C54 62 68 42 100 42Z" fill="${C}" ${L4}/>
    ${caraArte(100, 80, o, .9, {dy: 22})}`;
  },
  grillon: o => {
    const C = '#5A862E', D = '#3A5A1C', B = '#D8E8A8', M = '#8A5A35';
    return `
    ${patitas5([[64, 150, 40, 186], [136, 150, 160, 186]], D)}
    <path d="M136 132 L184 100 L196 186" fill="none" stroke="${TK}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M136 132 L184 100 L196 186" fill="none" stroke="${C}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M64 132 L16 100 L4 186" fill="none" stroke="${TK}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M64 132 L16 100 L4 186" fill="none" stroke="${C}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M100 88 C140 88 160 116 158 146 C156 172 134 186 100 186 C66 186 44 172 42 146 C40 116 60 88 100 88Z" fill="${C}" ${L4}/>
    <path d="M48 112 C72 94 130 94 154 118 C134 110 74 110 50 128Z" fill="${M}" ${L3}/>
    <path d="M62 112 L70 102 M80 106 L86 96 M100 104 V94 M120 106 L114 96 M138 112 L130 102" stroke="${TK}" stroke-width="2.5"/>
    <path d="M100 132 C118 132 128 146 126 162 C124 176 114 182 100 182 C86 182 76 176 74 162 C72 146 82 132 100 132Z" fill="${B}"/>
    <path d="M82 36 Q60 4 20 0 M118 36 Q140 4 180 0" fill="none" stroke="${TK}" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M100 28 C136 28 152 50 150 76 C148 100 128 114 100 114 C72 114 52 100 50 76 C48 50 64 28 100 28Z" fill="${C}" ${L4}/>
    ${caraArte(100, 70, o, .95, {dy: 24, enojo: true, colmillo: true})}`;
  },
  /* ---------- Mariposita → Mariposón ---------- */
  mariposita: o => {
    const A = '#FF9FCF', A2 = '#FFD23F', C = '#5A4A6E';
    return `
    <path d="M90 100 C50 40 6 56 14 96 C20 122 60 124 90 114Z M110 100 C150 40 194 56 186 96 C180 122 140 124 110 114Z" fill="${A}" ${L4}/>
    <path d="M90 118 C56 124 34 150 46 168 C58 180 84 164 94 136Z M110 118 C144 124 166 150 154 168 C142 180 116 164 106 136Z" fill="${A}" ${L4}/>
    <circle cx="48" cy="88" r="12" fill="${A2}" ${L3}/><circle cx="152" cy="88" r="12" fill="${A2}" ${L3}/>
    <circle cx="62" cy="152" r="7" fill="#FFFDF8" ${L3}/><circle cx="138" cy="152" r="7" fill="#FFFDF8" ${L3}/>
    <path d="M100 96 C110 96 114 120 112 148 C110 168 106 178 100 178 C94 178 90 168 88 148 C86 120 90 96 100 96Z" fill="${C}" ${L4}/>
    ${antenas5(90, 110, 50, 20, C)}
    <path d="M100 44 C122 44 132 58 130 76 C128 92 116 100 100 100 C84 100 72 92 70 76 C68 58 78 44 100 44Z" fill="${C}" ${L4}/>
    ${envolverCara(`${ojosPar(88, 112, 70, .75, o, false)}${o.humor === 'feliz' ? `<path d="M94 84 Q100 90 106 84" fill="#E58AA0" stroke="#FFFDF8" stroke-width="2"/>` : `<path d="M94 86 Q100 88 106 86" fill="none" stroke="#FFFDF8" stroke-width="2"/>`}`, 100, 72, o)}`;
  },
  mariposon: o => {
    const A = '#9A6AE0', A2 = '#FF8FB1', A3 = '#FFD23F', C = '#3A2E50';
    return `
    <path d="M90 96 C40 8 -14 34 4 92 C14 126 62 126 90 112Z M110 96 C160 8 214 34 196 92 C186 126 138 126 110 112Z" fill="${A}" ${L4}/>
    <path d="M90 118 C40 122 12 160 30 182 C46 196 82 174 94 138Z M110 118 C160 122 188 160 170 182 C154 196 118 174 106 138Z" fill="${A}" ${L4}/>
    <path d="M30 60 C40 46 60 46 70 60 C60 80 40 80 30 60Z M170 60 C160 46 140 46 130 60 C140 80 160 80 170 60Z" fill="${A2}" ${L3}/>
    <circle cx="50" cy="62" r="7" fill="${A3}" ${L3}/><circle cx="150" cy="62" r="7" fill="${A3}" ${L3}/>
    <path d="M40 160 C48 150 62 150 68 160 C62 170 46 170 40 160Z M160 160 C152 150 138 150 132 160 C138 170 154 170 160 160Z" fill="${A2}" ${L3}/>
    <path d="M12 92 C30 104 60 106 84 100 M188 92 C170 104 140 106 116 100" fill="none" stroke="#C8A8F2" stroke-width="3"/>
    <path d="M100 92 C112 92 118 120 116 150 C114 174 108 186 100 186 C92 186 86 174 84 150 C82 120 88 92 100 92Z" fill="${C}" ${L4}/>
    <path d="M88 120 H112 M86 140 H114 M88 160 H112" stroke="#6A5A88" stroke-width="3"/>
    ${antenas5(88, 112, 40, 4, A3)}
    <path d="M100 34 C126 34 138 50 136 70 C134 88 120 98 100 98 C80 98 66 88 64 70 C62 50 74 34 100 34Z" fill="${C}" ${L4}/>
    ${envolverCara(`${ojosPar(86, 114, 64, .82, o, true)}${o.humor === 'feliz' ? `<path d="M92 80 Q100 88 108 80" fill="#E58AA0" stroke="#FFFDF8" stroke-width="2"/>` : `<path d="M92 82 Q100 84 108 82" fill="none" stroke="#FFFDF8" stroke-width="2"/>`}`, 100, 66, o)}`;
  },
  /* ---------- Mamboretá: la mantis (etapa única) ---------- */
  mamboreta: o => {
    const C = '#7CC56A', D = '#4F9A3F', B = '#D8F2B8';
    return `
    ${patitas5([[86, 150, 64, 186], [114, 150, 136, 186], [94, 156, 92, 188], [106, 156, 110, 188]], D)}
    <path d="M100 110 C120 110 128 130 126 150 C124 168 112 180 100 180 C88 180 76 168 74 150 C72 130 80 110 100 110Z" fill="${C}" ${L4}/>
    <path d="M100 126 C108 126 114 140 112 154 C110 166 106 172 100 172 C94 172 90 166 88 154 C86 140 92 126 100 126Z" fill="${B}"/>
    <path d="M126 130 C146 120 172 130 182 150 C166 152 148 150 126 148Z" fill="${C}" opacity=".7" ${L3}/>
    <path d="M100 84 V114" stroke="${TK}" stroke-width="14" stroke-linecap="round"/><path d="M100 84 V114" stroke="${C}" stroke-width="9" stroke-linecap="round"/>
    <path d="M90 96 L56 84 L44 120 M110 96 L144 84 L156 120" fill="none" stroke="${TK}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M90 96 L56 84 L44 120 M110 96 L144 84 L156 120" fill="none" stroke="${C}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M44 120 l-6 -8 M44 120 l-8 2 M156 120 l6 -8 M156 120 l8 2" stroke="${TK}" stroke-width="3" stroke-linecap="round"/>
    <path d="M82 30 Q70 6 52 2 M118 30 Q130 6 148 2" fill="none" stroke="${TK}" stroke-width="3" stroke-linecap="round"/>
    <path d="M56 40 C62 24 138 24 144 40 C146 62 120 92 100 92 C80 92 54 62 56 40Z" fill="${C}" ${L4}/>
    ${caraArte(100, 50, o, .8, {dy: 26, dx: 26, boca: 6, enojo: true, sinMejillas: true})}`;
  },
  /* ---------- Abejita → Abejorro ---------- */
  abejita: o => {
    const Y = '#FFD23F', K = '#2E2E3A', W = '#DCEEFF';
    return `
    ${alaBicho5(66, 92, 26, 16, -30, W)}${alaBicho5(134, 92, 26, 16, 30, W)}
    <path d="M100 176 L94 190 L106 190Z" fill="${K}" ${L3}/>
    <path d="M100 100 C130 100 146 124 144 148 C142 168 124 180 100 180 C76 180 58 168 56 148 C54 124 70 100 100 100Z" fill="${Y}" ${L4}/>
    <path d="M60 130 Q100 140 140 130 L142 146 Q100 156 58 146Z M64 162 Q100 172 136 162 L128 174 Q100 182 72 174Z" fill="${K}"/>
    ${antenas5(86, 114, 52, 22, K)}
    <path d="M100 42 C130 42 144 62 142 86 C140 108 122 120 100 120 C78 120 60 108 58 86 C56 62 70 42 100 42Z" fill="${Y}" ${L4}/>
    ${caraArte(100, 82, o, .88, {dy: 20})}`;
  },
  abejorro: o => {
    const Y = '#F2B53A', K = '#24242E', W = '#DCEEFF', F = '#FFE7A8';
    return `
    ${alaBicho5(46, 70, 40, 22, -30, W)}${alaBicho5(154, 70, 40, 22, 30, W)}
    ${alaBicho5(40, 110, 28, 14, 20, W, .7)}${alaBicho5(160, 110, 28, 14, -20, W, .7)}
    <path d="M100 182 L90 200 L110 200Z" fill="${K}" ${L3}/>
    <path d="M100 90 C142 90 164 120 162 150 C160 176 136 190 100 190 C64 190 40 176 38 150 C36 120 58 90 100 90Z" fill="${Y}" ${L4}/>
    <path d="M42 126 Q100 140 158 126 L162 146 Q100 162 38 146Z M48 168 Q100 182 152 168 L140 182 Q100 194 60 182Z" fill="${K}"/>
    <path d="M70 100 C82 94 120 94 130 100" fill="none" stroke="${F}" stroke-width="5" stroke-linecap="round"/>
    <path d="M40 140 C20 140 12 156 18 168 C26 170 34 164 40 158Z M160 140 C180 140 188 156 182 168 C174 170 166 164 160 158Z" fill="${K}" ${L3}/>
    ${antenas5(82, 118, 36, 4, Y)}
    <path d="M100 26 C136 26 152 50 150 76 C148 100 128 112 100 112 C72 112 52 100 50 76 C48 50 64 26 100 26Z" fill="${Y}" ${L4}/>
    <path d="M60 40 L100 30 L140 40 C130 50 70 50 60 40Z" fill="${K}"/>
    ${caraArte(100, 72, o, .95, {dy: 22, enojo: true, colmillo: true})}`;
  },
};
Object.assign(INICIALES_V2, ARTE5);
