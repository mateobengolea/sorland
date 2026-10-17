'use strict';
/* Evoluciones rediseñadas (2). Usa brazo6, rayo6, viento6 de arte6.js. */
const ARTE7 = {
  /* Yerbatero: bestia cuyo lomo es un mate con bombilla como cuerno, melena de yerba y vapor */
  yerbatero: o => {
    const C = '#5FAE5A', D = '#3E7E3B', Ca = '#A8784A', Cd = '#7E5530', P = '#C9CED6', M = '#8AC85A', V = '#E6F2FA';
    return `
    ${viento6('M150 24 C142 14 152 6 146 -4', V, 5)}${viento6('M166 30 C160 20 170 12 166 2', V, 4)}
    <path d="M60 156 C56 170 52 180 48 190 L78 190 C78 180 80 170 82 160Z M124 160 C126 170 128 180 130 190 L160 190 C156 180 150 168 144 156Z" fill="${D}" ${L4}/>
    ${garras([[54, 190], [64, 191], [72, 190], [136, 190], [146, 191], [154, 190]])}
    <path d="M96 78 C150 70 186 104 182 140 C178 170 148 184 104 182 C60 180 30 166 30 132 C30 100 56 82 96 78Z" fill="${C}" ${L4}/>
    <path d="M110 34 C150 30 176 58 172 92 C168 120 146 134 118 132 C92 130 76 110 78 84 C80 56 92 36 110 34Z" fill="${Ca}" ${L4}/>
    <path d="M86 70 C100 60 150 58 168 72" fill="none" stroke="${Cd}" stroke-width="3"/>
    <path d="M90 56 C108 42 146 40 164 54 C150 60 104 62 90 56Z" fill="${M}" ${L3}/>
    <path d="M150 54 L160 0" stroke="${TK}" stroke-width="10" stroke-linecap="round"/><path d="M150 54 L160 0" stroke="${P}" stroke-width="5" stroke-linecap="round"/>
    <path d="M154 2 L166 -2" stroke="${TK}" stroke-width="6" stroke-linecap="round"/>
    <path d="M94 104 C110 112 140 112 160 100" fill="none" stroke="${Cd}" stroke-width="3"/>
    <path d="M60 140 C76 152 120 156 150 148" fill="none" stroke="#D8F2B8" stroke-width="10" stroke-linecap="round"/>
    ${[[18, 70, -60], [22, 92, -90], [30, 50, -30], [48, 36, -10], [70, 34, 15], [26, 116, -120]].map(([x, y, r]) => hojaA(x + 22, y + 22, r, 1.1, '#7CC56A')).join('')}
    <path d="M52 52 C80 52 96 72 94 96 C92 118 74 132 52 132 C30 132 12 118 10 96 C8 72 24 52 52 52Z" fill="${C}" ${L4}/>
    <path d="M18 112 C28 124 48 128 64 124 C52 134 26 132 18 112Z" fill="#D8F2B8"/>
    ${caraArte(52, 92, o, .85, {dy: 24, dx: 16, enojo: true, boca: 9})}`;
  },
  /* Hongazo: guardián hongo con varios sombreros, escudo de sombrero y nube de esporas */
  hongazo: o => {
    const R = '#C42E26', B = '#F4E8D8', D = '#B89E80', S = '#E6D2F0';
    return `
    ${[[20, 40, 4], [180, 50, 5], [30, 100, 3], [172, 110, 4], [100, 4, 3]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${S}" ${L3}/>`).join('')}
    <path d="M72 156 C68 170 66 180 62 190 L90 190 C90 180 90 170 92 162Z M108 162 C110 170 110 180 110 190 L138 190 C134 180 132 170 128 156Z" fill="${D}" ${L4}/>
    <path d="M100 96 C136 96 152 124 150 152 C148 174 128 182 100 182 C72 182 52 174 50 152 C48 124 64 96 100 96Z" fill="${B}" ${L4}/>
    <path d="M70 120 Q100 132 130 120 M66 148 Q100 160 134 148" fill="none" stroke="${D}" stroke-width="2.5"/>
    ${brazo6('M54 116 C40 124 34 136 34 148', B, 12)}
    <path d="M146 110 C176 98 196 120 192 146 C188 168 168 176 150 168 C164 152 166 128 146 110Z" fill="${R}" ${L4}/>
    <circle cx="176" cy="132" r="6" fill="#FFFDF8" ${L3}/><circle cx="170" cy="154" r="4" fill="#FFFDF8" ${L3}/>
    <path d="M144 70 C146 50 166 42 180 52 C190 62 184 76 170 78Z" fill="#E6863A" ${L3}/>
    <path d="M30 68 C26 50 44 40 56 48 C62 56 58 68 46 72Z" fill="#E6863A" ${L3}/>
    <path d="M22 96 C16 46 56 12 100 12 C144 12 184 46 178 96 C156 112 44 112 22 96Z" fill="${R}" ${L4}/>
    ${[[56, 50, 11], [100, 30, 13], [144, 50, 11], [76, 84, 7], [124, 84, 7], [34, 82, 5], [166, 82, 5]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .8}" fill="#FFFDF8" ${L3}/>`).join('')}
    <path d="M28 98 Q100 126 172 98" fill="none" stroke="#8E1E18" stroke-width="3"/>
    ${caraArte(100, 134, o, .9, {dy: 22, dx: 18, boca: 10, enojo: true, colmillo: true})}`;
  },
  /* Pejerrey: pez rey saltando del agua, aletas como alas y corona de aleta */
  pejerrey: o => {
    const C = '#7AB2DC', D = '#3E7AAC', S = '#E6F2FA', Y = '#FFD23F', A = '#5AB4E8';
    return `
    <path d="M10 180 C40 168 70 186 100 176 C130 166 160 184 190 174" fill="none" stroke="${A}" stroke-width="6" stroke-linecap="round"/>
    ${[[34, 160], [60, 150], [150, 156], [170, 144]].map(([x, y]) => `<path d="M${x} ${y} q-5 -10 0 -16 q5 6 0 16Z" fill="${A}" ${L3}/>`).join('')}
    <g transform="rotate(-24 100 100)">
    <path d="M160 100 L204 64 C196 98 196 120 204 150Z" fill="${D}" ${L4}/>
    <path d="M60 64 C40 26 70 6 92 22 C96 40 92 56 84 66Z M110 64 C112 34 140 22 156 40 C152 56 140 66 126 70Z" fill="${S}" opacity=".9" ${L3}/>
    <path d="M92 54 C148 48 178 82 172 110 C166 140 136 158 92 158 C48 158 18 138 18 106 C18 78 48 56 92 54Z" fill="${C}" ${L4}/>
    <path d="M26 114 C48 146 106 154 154 136" fill="none" stroke="${S}" stroke-width="12" stroke-linecap="round"/>
    <path d="M30 104 C74 96 126 98 168 106" fill="none" stroke="#D0E2F0" stroke-width="6"/>
    ${[[100, 76], [122, 80], [144, 88], [112, 126], [136, 126]].map(([x, y]) => `<path d="M${x} ${y} q6 7 12 0" fill="none" stroke="${D}" stroke-width="2.4"/>`).join('')}
    <path d="M86 138 C66 166 76 186 96 182 L102 152Z" fill="${S}" opacity=".9" ${L3}/>
    <path d="M36 66 L40 44 L50 58 L58 38 L64 58 L74 44 L74 68Z" fill="${Y}" ${L3}/>
    ${caraArte(58, 98, o, .9, {dy: 24, dx: 18, boca: 10, enojo: true, colmillo: true})}</g>`;
  },
  /* Enchufón: robot-zapatilla eléctrica con manos de enchufe y cola de cable */
  enchufon: o => {
    const C = '#E8E8E2', D = '#B9BEC6', M = '#E6C35A', K = '#3A3A48', Y = '#FFE45C', R = '#E2493C';
    return `
    <circle cx="100" cy="100" r="90" fill="${Y}" opacity=".11"/>
    <path d="M70 158 L66 190 M130 158 L134 190" stroke="${TK}" stroke-width="16" stroke-linecap="round"/><path d="M70 158 L66 190 M130 158 L134 190" stroke="${K}" stroke-width="10" stroke-linecap="round"/>
    <rect x="50" y="182" width="32" height="12" rx="5" fill="${D}" ${L3}/><rect x="118" y="182" width="32" height="12" rx="5" fill="${D}" ${L3}/>
    <path d="M150 150 C184 156 198 130 186 112" fill="none" stroke="${TK}" stroke-width="11" stroke-linecap="round"/><path d="M150 150 C184 156 198 130 186 112" fill="none" stroke="${K}" stroke-width="6" stroke-linecap="round"/>
    <rect x="44" y="76" width="112" height="90" rx="16" fill="${C}" ${L4}/>
    ${[[70, 104], [100, 104], [130, 104]].map(([x, y]) => `<rect x="${x - 11}" y="${y - 10}" width="22" height="22" rx="6" fill="${D}" ${L3}/><rect x="${x - 6}" y="${y - 4}" width="3.5" height="9" fill="${K}"/><rect x="${x + 2.5}" y="${y - 4}" width="3.5" height="9" fill="${K}"/>`).join('')}
    <rect x="58" y="134" width="84" height="18" rx="6" fill="${D}" ${L3}/><circle cx="130" cy="143" r="5" fill="${R}" ${L3}/>
    ${brazo6('M48 100 C28 104 20 118 18 132', K, 8)}${brazo6('M152 100 C172 92 180 78 182 62', K, 8)}
    <rect x="4" y="128" width="28" height="22" rx="5" fill="${C}" ${L3}/><rect x="9" y="150" width="5" height="12" fill="${M}" ${L3}/><rect x="22" y="150" width="5" height="12" fill="${M}" ${L3}/>
    <rect x="168" y="44" width="28" height="22" rx="5" fill="${C}" ${L3}/><rect x="173" y="30" width="5" height="14" fill="${M}" ${L3}/><rect x="186" y="30" width="5" height="14" fill="${M}" ${L3}/>
    ${rayo6(180, 28, .8)}${rayo6(4, 176, .7)}
    <rect x="60" y="6" width="10" height="20" rx="3" fill="${M}" ${L3}/><rect x="130" y="6" width="10" height="20" rx="3" fill="${M}" ${L3}/>
    <path d="M66 20 H134 C146 20 152 28 152 40 V66 C152 80 138 86 100 86 C62 86 48 80 48 66 V40 C48 28 54 20 66 20Z" fill="${C}" ${L4}/>
    <path d="M56 32 V70" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>
    ${caraArte(100, 50, o, .85, {dy: 20, dx: 20, enojo: true, colmillo: true, boca: 9})}`;
  },
  /* Pilón: pila con brazos y piernas de cable, puños de borne */
  pilon: o => {
    const C = '#F2B53A', K = '#2E2E3A', M = '#C9CED6', Y = '#FFE45C';
    return `
    ${brazo6('M76 166 C70 176 66 184 60 190', K, 8)}${brazo6('M124 166 C130 176 134 184 140 190', K, 8)}
    <rect x="46" y="184" width="28" height="10" rx="4" fill="${M}" ${L3}/><rect x="126" y="184" width="28" height="10" rx="4" fill="${M}" ${L3}/>
    ${brazo6('M50 96 C30 92 18 76 16 60', K, 8)}${brazo6('M150 96 C170 104 180 120 182 136', K, 8)}
    <circle cx="16" cy="54" r="11" fill="${M}" ${L3}/><path d="M11 54 h10 M16 49 v10" stroke="${TK}" stroke-width="3"/>
    <circle cx="182" cy="142" r="11" fill="${M}" ${L3}/><path d="M177 142 h10" stroke="${TK}" stroke-width="3"/>
    <rect x="84" y="12" width="32" height="18" rx="4" fill="${M}" ${L3}/>
    <path d="M62 26 H138 C150 26 156 34 156 46 V160 C156 174 144 178 100 178 C56 178 44 174 44 160 V46 C44 34 50 26 62 26Z" fill="${K}" ${L4}/>
    <path d="M44 46 C44 34 50 26 62 26 H138 C150 26 156 34 156 46 V104 H44Z" fill="${C}" ${L4}/>
    <path d="M54 40 V96" stroke="#FFE7A8" stroke-width="6" stroke-linecap="round"/>
    <path d="M80 140 h40 M100 120 v40" stroke="${C}" stroke-width="7" stroke-linecap="round"/>
    ${rayo6(170, 40, .9)}${rayo6(20, 120, .8)}
    ${caraArte(100, 66, o, .92, {dy: 22, enojo: true, boca: 10})}`;
  },
  /* Voltazo: armadura de varias pilas, generador en el pecho y corona de rayos */
  voltazo: o => {
    const C = '#F2B53A', K = '#24242E', M = '#C9CED6', Y = '#FFE45C', E = '#7FD4FF';
    const pila = (x, y, w, h, r = 0) => `<g transform="rotate(${r} ${x + w / 2} ${y + h / 2})"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${K}" ${L3}/><rect x="${x}" y="${y}" width="${w}" height="${h * .45}" rx="6" fill="${C}" ${L3}/><rect x="${x + w * .3}" y="${y - 6}" width="${w * .4}" height="7" rx="2" fill="${M}" ${L3}/></g>`;
    return `
    <circle cx="100" cy="100" r="96" fill="${E}" opacity=".12"/>
    ${pila(56, 150, 30, 42)}${pila(114, 150, 30, 42)}
    ${pila(4, 82, 30, 54, -20)}${pila(166, 82, 30, 54, 20)}
    <rect x="4" y="128" width="30" height="22" rx="8" fill="${M}" ${L3}/><rect x="166" y="128" width="30" height="22" rx="8" fill="${M}" ${L3}/>
    <path d="M52 72 H148 C162 72 170 80 170 94 V150 C170 162 158 168 100 168 C42 168 30 162 30 150 V94 C30 80 38 72 52 72Z" fill="${K}" ${L4}/>
    <circle cx="100" cy="122" r="26" fill="${M}" ${L4}/><circle cx="100" cy="122" r="17" fill="${E}" ${L3}/>
    ${rayo6(94, 128, .8, Y)}
    <path d="M30 100 H170" stroke="${C}" stroke-width="6"/>
    <path d="M100 -4 L110 14 L104 14 L112 28 L92 12 L98 12Z M70 6 L78 22 L72 22 L78 34 L62 20 L68 20Z M130 6 L138 20 L132 20 L138 34 L122 22 L128 22Z" fill="${Y}" ${L3}/>
    <path d="M68 26 H132 C144 26 150 34 150 46 V66 C150 78 140 84 100 84 C60 84 50 78 50 66 V46 C50 34 56 26 68 26Z" fill="${C}" ${L4}/>
    <path d="M58 36 V70" stroke="#FFE7A8" stroke-width="6" stroke-linecap="round"/>
    ${rayo6(2, 40, 1, E)}${rayo6(178, 36, 1, E)}
    ${caraArte(100, 52, o, .85, {dy: 20, dx: 20, enojo: true, colmillo: true, boca: 10})}`;
  },
  /* Fosilón: esqueleto de tiranosaurio parado, con ámbar en el pecho */
  fosilon: o => {
    const P = '#E6DAC0', D = '#B8A584', H = '#9C8A6A', A = '#E6A23A';
    return `
    <path d="M120 140 C150 150 178 140 196 116 C200 134 190 160 160 172 C146 176 130 170 118 162Z" fill="${P}" ${L4}/>
    ${[[150, 152], [168, 146], [184, 134]].map(([x, y]) => `<path d="M${x} ${y - 10} V${y + 10}" stroke="${D}" stroke-width="3"/>`).join('')}
    <path d="M74 150 C70 166 64 178 58 190 L88 190 C88 180 90 168 92 156Z M112 156 C114 168 116 180 116 190 L146 190 C140 178 134 166 128 150Z" fill="${P}" ${L4}/>
    ${garras([[64, 190], [74, 191], [82, 190], [122, 190], [130, 191], [140, 190]], D)}
    <path d="M100 82 C134 82 150 108 148 138 C146 162 128 176 100 176 C72 176 54 162 52 138 C50 108 66 82 100 82Z" fill="${H}" ${L4}/>
    ${[100, 116, 132, 148].map(y => `<path d="M64 ${y} Q100 ${y + 10} 136 ${y}" fill="none" stroke="${P}" stroke-width="6" stroke-linecap="round"/>`).join('')}
    <path d="M100 90 V170" stroke="${P}" stroke-width="7" stroke-linecap="round"/>
    <path d="M100 116 L112 128 L100 144 L88 128Z" fill="${A}" ${L3}/><path d="M96 124 L100 120 L104 124" stroke="#FFE7A8" stroke-width="2.5" fill="none"/>
    ${brazo6('M58 108 C46 112 40 120 40 128', P, 8)}${brazo6('M142 108 C154 112 160 120 160 128', P, 8)}
    ${garras([[36, 130], [42, 132], [158, 132], [164, 130]], D)}
    <path d="M62 66 C62 26 90 10 120 12 C156 16 178 36 176 62 C174 84 152 94 124 94 L120 104 C96 108 70 96 62 66Z" fill="${P}" ${L4}/>
    <path d="M120 72 C140 74 160 72 176 64 L176 72 C160 82 140 86 120 84Z" fill="${D}" ${L3}/>
    ${[130, 142, 154, 166].map(x => `<path d="M${x} 70 l3 8 l3 -8" fill="#FFFDF8" ${L3}/>`).join('')}
    <path d="M78 30 C84 22 96 18 106 18" fill="none" stroke="#FFFDF8" stroke-width="4" stroke-linecap="round"/>
    <path d="M70 18 L62 0 L82 14Z M96 12 L94 -6 L108 10Z" fill="${H}" ${L3}/>
    ${caraArte(106, 46, o, .82, {boca: 0, dx: 20, enojo: true, sinMejillas: true})}`;
  },
  /* Cuarzón: gólem de cristal parado, hombreras y puños de cuarzo */
  cuarzon: o => {
    const C = '#D89AE0', P = '#958C80', D = '#6E675D';
    return `
    <path d="M70 150 L62 190 L92 190 L92 156Z M108 156 L108 190 L138 190 L130 150Z" fill="${P}" ${L4}/>
    <path d="M100 60 C140 60 160 90 158 126 C156 156 134 172 100 172 C66 172 44 156 42 126 C40 90 60 60 100 60Z" fill="${P}" ${L4}/>
    <path d="M64 100 L80 86 L98 98 L116 84 L136 100 M70 140 L90 130 L110 142 L130 130" fill="none" stroke="${D}" stroke-width="2.5"/>
    ${cristal4(100, 126, 34, 22, C)}
    ${brazo6('M48 104 L26 132', P, 18)}${brazo6('M152 104 L174 132', P, 18)}
    <path d="M10 130 L30 120 L40 146 L22 158 L8 148Z M190 130 L170 120 L160 146 L178 158 L192 148Z" fill="${C}" ${L4}/>
    ${cristal4(46, 80, 40, 20, C, -40)}${cristal4(154, 80, 40, 20, C, 40)}${cristal4(36, 92, 28, 14, C, -60)}${cristal4(164, 92, 28, 14, C, 60)}
    ${cristal4(78, 30, 30, 16, C, -20)}${cristal4(100, 22, 40, 20, C)}${cristal4(122, 30, 30, 16, C, 20)}
    <path d="M100 22 C128 22 142 40 140 62 C138 82 122 94 100 94 C78 94 62 82 60 62 C58 40 72 22 100 22Z" fill="${P}" ${L4}/>
    <path d="M70 36 C76 28 86 26 94 28" fill="none" stroke="#C3BBAD" stroke-width="4" stroke-linecap="round"/>
    ${caraArte(100, 58, o, .85, {dy: 22, dx: 18, enojo: true, boca: 9})}`;
  },
  /* Picaflor: colibrí elegante con cola larga de plumas tornasol y penacho */
  picaflor: o => {
    const C = '#2AAA88', D = '#1E7A62', B = '#E6F8F0', R = '#E2393C', V = '#7A58C0', W = '#CDEFFB';
    return `
    <path d="M96 128 C80 160 60 178 30 190 C54 178 70 160 82 132Z" fill="${V}" ${L3}/>
    <path d="M104 132 C106 164 96 182 76 198 C102 186 118 164 118 134Z" fill="${C}" ${L3}/>
    <path d="M112 128 C130 156 150 168 178 172 C154 160 138 146 126 124Z" fill="${V}" ${L3}/>
    <path d="M70 84 C24 30 -6 46 2 82 C10 112 50 112 76 100Z" fill="${W}" opacity=".9" ${L3}/>
    <path d="M130 84 C176 30 206 46 198 82 C190 112 150 112 124 100Z" fill="${W}" opacity=".9" ${L3}/>
    <path d="M16 62 L60 92 M8 84 L56 98 M184 62 L140 92 M192 84 L144 98" stroke="#8ED4E8" stroke-width="2"/>
    <path d="M100 56 C130 56 146 82 144 110 C142 136 124 150 100 150 C76 150 58 136 56 110 C54 82 70 56 100 56Z" fill="${C}" ${L4}/>
    <path d="M100 104 C116 104 124 118 122 134 C120 144 110 150 100 150 C90 150 80 144 78 134 C76 118 84 104 100 104Z" fill="${B}"/>
    <path d="M74 96 C84 110 116 110 126 96 C124 116 76 116 74 96Z" fill="${R}" ${L3}/>
    <path d="M88 60 C76 34 90 18 106 26 C112 12 132 14 130 30 C140 28 146 40 136 48 C124 52 112 54 108 60Z" fill="${V}" ${L3}/>
    ${caraArte(100, 80, o, .82, {boca: 0, dx: 20, enojo: true})}
    ${envolverCara(`<path d="M104 90 C124 88 160 88 194 90 C160 92 124 96 104 98Z" fill="#3A3A48" ${L3}/>`, 100, 84, o)}`;
  },
  /* Barriletazo: dragón-barrilete con alas de papel, cola de moños y bigotes de hilo */
  barriletazo: o => {
    const A = '#3E96D0', R = '#C42E26', Y = '#FFD23F', W = '#FFFDF8', V = '#BFE6FB';
    return `
    ${viento6('M10 40 C26 32 40 36 48 44', V)}${viento6('M150 18 C164 12 176 16 184 24', V)}
    <path d="M110 150 C130 170 110 182 132 196" fill="none" stroke="${TK}" stroke-width="3.5"/>
    ${[[112, 158, R], [124, 172, Y], [116, 184, A]].map(([x, y, c]) => `<path d="M${x} ${y} l12 -8 l0 16Z M${x} ${y} l-12 -8 l0 16Z" fill="${c}" ${L3}/>`).join('')}
    <path d="M70 90 L0 50 L18 110 L-2 130 L66 120Z" fill="${Y}" ${L4}/><path d="M70 90 L18 110 L66 120" fill="none" ${L3}/>
    <path d="M130 90 L200 50 L182 110 L202 130 L134 120Z" fill="${R}" ${L4}/><path d="M130 90 L182 110 L134 120" fill="none" ${L3}/>
    <path d="M100 30 L150 96 L100 160 L50 96Z" fill="${A}" ${L4}/>
    <path d="M100 30 V160 M50 96 H150" stroke="${TK}" stroke-width="3"/>
    <path d="M100 96 L150 96 L100 160Z" fill="#2E7AB0"/>
    <path d="M100 4 C126 4 140 20 138 42 C136 62 120 74 100 74 C80 74 64 62 62 42 C60 20 74 4 100 4Z" fill="${W}" ${L4}/>
    <path d="M70 12 L60 -6 L80 6Z M130 12 L140 -6 L120 6Z" fill="${R}" ${L3}/>
    ${envolverCara(`<path d="M76 56 C60 60 46 74 40 92 M124 56 C140 60 154 74 160 92" fill="none" stroke="${TK}" stroke-width="2.5" stroke-linecap="round"/>`, 100, 40, o)}
    ${caraArte(100, 36, o, .8, {dy: 22, dx: 18, boca: 9, enojo: true, colmillo: true})}`;
  },
  /* Pingüinazo: pingüino emperador caballero con lanza de hielo y corona */
  pinguinazo: o => {
    const K = '#24304A', W = '#FFFDF8', Y = '#F2B53A', H = '#BFE6FB', Hd = '#7EC0E8';
    return `
    ${pie(74, 188, 32, Y)}${pie(126, 188, 32, Y)}
    <path d="M178 10 L190 40 L184 40 L184 190 L174 190 L174 40 L168 40Z" fill="${H}" ${L4}/>
    <path d="M100 20 C146 20 168 64 166 116 C164 166 138 190 100 190 C62 190 36 166 34 116 C32 64 54 20 100 20Z" fill="${K}" ${L4}/>
    <path d="M100 52 C130 52 146 88 144 128 C142 166 124 184 100 184 C76 184 58 166 56 128 C54 88 70 52 100 52Z" fill="${W}"/>
    <path d="M70 52 C84 66 116 66 130 52 C124 62 112 70 100 70 C88 70 76 62 70 52Z" fill="${Y}" opacity=".8"/>
    <path d="M66 128 L100 118 L134 128 L130 156 L100 168 L70 156Z" fill="${H}" ${L4}/><path d="M100 122 V164 M72 140 L128 140" stroke="${Hd}" stroke-width="3"/>
    <path d="M38 86 C10 104 6 140 16 156 C30 148 40 130 46 112Z" fill="${K}" ${L4}/>
    <path d="M162 86 C176 92 182 104 180 116" fill="none" stroke="${TK}" stroke-width="24" stroke-linecap="round"/><path d="M162 86 C176 92 182 104 180 116" fill="none" stroke="${K}" stroke-width="18" stroke-linecap="round"/>
    <path d="M70 22 L74 0 L88 16 L100 -4 L112 16 L126 0 L130 22Z" fill="${H}" ${L3}/>
    ${caraArte(100, 42, o, .9, {boca: 0, dx: 20, enojo: true})}
    ${envolverCara(`<path d="M86 56 L114 56 L100 72Z" fill="${Y}" ${L3}/>`, 100, 46, o)}`;
  },
  /* Huemul: ciervo adulto majestuoso, cornamenta grande con nieve y melena */
  huemul: o => {
    const C = '#9C7448', D = '#6E5030', B = '#F2E2C8', A = '#E6D2B0', N = '#FFFFFF';
    const asta = 'M70 44 C56 26 40 18 22 18 M48 22 L36 2 M34 18 L12 4 M60 30 L54 8 M130 44 C144 26 160 18 178 18 M152 22 L164 2 M166 18 L188 4 M140 30 L146 8';
    return `
    <path d="M64 146 C62 164 62 178 64 190 L80 190 C80 176 80 162 80 152Z M136 150 C136 164 138 178 140 190 L156 190 C156 176 156 162 152 148Z M90 156 C90 170 92 180 94 190 L110 190 C110 180 110 170 108 158Z" fill="${D}" ${L4}/>
    <path d="M54 112 C88 96 150 102 168 128 C178 148 160 166 128 168 C96 170 62 164 52 146 C46 132 46 120 54 112Z" fill="${C}" ${L4}/>
    <path d="M60 146 C84 160 120 164 150 158 C130 168 94 168 68 160Z" fill="${B}"/>
    <path d="M164 118 C174 110 182 114 180 124 C178 130 172 130 166 128Z" fill="${B}" ${L3}/>
    <path d="M66 82 C70 108 90 128 112 128 C100 118 96 104 98 90Z" fill="${B}" ${L3}/>
    <path d="${asta}" fill="none" stroke="${TK}" stroke-width="10" stroke-linecap="round"/>
    <path d="${asta}" fill="none" stroke="${A}" stroke-width="5.5" stroke-linecap="round"/>
    ${[[22, 16], [36, 0], [178, 16], [164, 0], [12, 2], [188, 2]].map(([x, y]) => `<circle cx="${x}" cy="${y + 2}" r="4" fill="${N}" ${L3}/>`).join('')}
    <path d="M66 58 C50 48 48 34 58 32 C68 34 74 48 76 60Z M134 58 C150 48 152 34 142 32 C132 34 126 48 124 60Z" fill="${C}" ${L3}/>
    <path d="M100 38 C126 38 140 58 138 82 C136 104 122 118 100 118 C78 118 64 104 62 82 C60 58 74 38 100 38Z" fill="${C}" ${L4}/>
    <path d="M100 84 C116 84 124 94 122 106 C120 114 112 118 100 118 C88 118 80 114 78 106 C76 94 84 84 100 84Z" fill="${B}" ${L3}/>
    ${envolverCara(`<ellipse cx="100" cy="98" rx="7" ry="4.5" fill="${TK}"/>`, 100, 80, o)}
    ${caraArte(100, 72, o, .82, {dy: 36, dx: 18, boca: 7, enojo: true})}`;
  },
  /* Vaquitón: escarabajo guerrero parado, élitros abiertos como capa y alas */
  vaquiton: o => {
    const R = '#C42E26', K = '#24242E', Y = '#FFD23F', W = '#DCEEFF';
    return `
    <path d="M86 90 C40 40 4 60 10 100 C16 130 56 128 84 112Z M114 90 C160 40 196 60 190 100 C184 130 144 128 116 112Z" fill="${W}" opacity=".75" ${L3}/>
    <path d="M90 92 C50 96 22 130 26 172 C50 170 74 150 92 120Z" fill="${R}" ${L4}/>
    <path d="M110 92 C150 96 178 130 174 172 C150 170 126 150 108 120Z" fill="${R}" ${L4}/>
    ${[[48, 140, 10], [64, 116, 8], [44, 164, 6], [152, 140, 10], [136, 116, 8], [156, 164, 6]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${K}"/>`).join('')}
    ${patitas5([[86, 160, 74, 190], [114, 160, 126, 190]], K)}
    <path d="M100 84 C124 84 136 106 134 132 C132 154 118 168 100 168 C82 168 68 154 66 132 C64 106 76 84 100 84Z" fill="${K}" ${L4}/>
    <path d="M84 108 H116 M82 126 H118 M84 144 H116" stroke="#4A4A58" stroke-width="3"/>
    ${patitas5([[70, 104, 44, 92], [130, 104, 156, 92]], K)}
    <circle cx="40" cy="90" r="8" fill="${Y}" ${L3}/><circle cx="160" cy="90" r="8" fill="${Y}" ${L3}/>
    ${antenas5(84, 116, 34, 2, Y)}
    <path d="M100 24 C128 24 142 42 140 62 C138 82 122 92 100 92 C78 92 62 82 60 62 C58 42 72 24 100 24Z" fill="${K}" ${L4}/>
    <path d="M70 40 L56 26 L76 32Z M130 40 L144 26 L124 32Z" fill="${Y}" ${L3}/>
    ${envolverCara(`${ojosPar(86, 114, 56, .78, o, true)}${o.humor === 'feliz' ? `<path d="M92 72 Q100 80 108 72" fill="#E58AA0" stroke="#FFFDF8" stroke-width="2"/>` : `<path d="M92 74 Q100 76 108 74" fill="none" stroke="#FFFDF8" stroke-width="2"/>`}`, 100, 58, o)}`;
  },
  /* Abejorro: abejorro caballero, cuello de pelusa, corona y aguijón como lanza */
  abejorro: o => {
    const Y = '#F2B53A', K = '#24242E', W = '#DCEEFF', F = '#FFF1CF', P = '#C9CED6';
    return `
    ${alaBicho5(48, 64, 40, 20, -30, W)}${alaBicho5(152, 64, 40, 20, 30, W)}
    ${alaBicho5(40, 102, 28, 13, 20, W, .7)}${alaBicho5(160, 102, 28, 13, -20, W, .7)}
    <path d="M174 30 L182 30 L180 186 L176 186Z" fill="${P}" ${L3}/><path d="M170 34 L178 0 L186 34Z" fill="${P}" ${L3}/>
    ${patitas5([[84, 168, 74, 192], [116, 168, 126, 192]], K)}
    <path d="M100 96 C136 96 154 122 152 150 C150 174 128 186 100 186 C72 186 50 174 48 150 C46 122 64 96 100 96Z" fill="${Y}" ${L4}/>
    <path d="M50 132 Q100 146 150 132 L152 150 Q100 166 48 150Z M58 172 Q100 184 142 172 L132 182 Q100 192 68 182Z" fill="${K}"/>
    ${patitas5([[56, 120, 30, 136], [144, 116, 172, 104]], K)}
    <path d="M58 98 C70 84 130 84 142 98 C134 112 66 112 58 98Z" fill="${F}" ${L3}/>
    ${[66, 80, 94, 108, 122, 136].map(x => `<path d="M${x} 104 l3 6" stroke="#E6D2A8" stroke-width="2"/>`).join('')}
    ${antenas5(84, 116, 30, 2, Y)}
    <path d="M100 22 C134 22 148 44 146 68 C144 90 126 102 100 102 C74 102 56 90 54 68 C52 44 66 22 100 22Z" fill="${Y}" ${L4}/>
    <path d="M58 46 C70 34 130 34 142 46 C130 50 70 50 58 46Z" fill="${K}"/>
    <path d="M74 26 L78 10 L88 22 L100 6 L112 22 L122 10 L126 26Z" fill="#FFD23F" ${L3}/>
    ${caraArte(100, 66, o, .9, {dy: 22, enojo: true, colmillo: true})}`;
  },
};
Object.assign(INICIALES_V2, ARTE7);
