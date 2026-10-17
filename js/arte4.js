'use strict';
/* Arte a mano, tanda 4: Hongo, Sapo, Pejerrey, Tortuga, Enchufe, Pila, Tormentín, Fósil, Cuarzo y Picaflor. */
const rayo4 = (x, y, s = 1, col = '#FFE45C') => `<path d="M${x} ${y} l${8 * s} ${-14 * s} l${-2 * s} ${10 * s} l${10 * s} ${-2 * s} l${-14 * s} ${20 * s} l${2 * s} ${-10 * s}Z" fill="${col}" ${L3}/>`;
const lunares4 = (pts, col = '#FFFDF8') => pts.map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .8}" fill="${col}" ${L3}/>`).join('');
const cristal4 = (x, y, h, w, col, r = 0) => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M0 ${-h} L${w / 2} ${-h + w * .6} L${w / 2} 0 L${-w / 2} 0 L${-w / 2} ${-h + w * .6}Z" fill="${col}" ${L3}/><path d="M0 ${-h} L0 0" stroke="#FFFFFF" stroke-width="2" opacity=".5"/></g>`;

const ARTE4 = {
  /* ---------- Honguito → Hongazo ---------- */
  honguito: o => {
    const R = '#E2493C', B = '#F4E8D8', D = '#C9B49A';
    return `
    ${pie(84, 184, 20, D)}${pie(116, 184, 20, D)}
    <path d="M100 100 C124 100 134 120 132 144 C130 166 118 180 100 180 C82 180 70 166 68 144 C66 120 76 100 100 100Z" fill="${B}" ${L4}/>
    <path d="M30 104 C26 60 60 34 100 34 C140 34 174 60 170 104 C150 116 50 116 30 104Z" fill="${R}" ${L4}/>
    ${lunares4([[60, 70, 9], [100, 52, 10], [140, 72, 9], [80, 96, 6], [124, 96, 6]])}
    <path d="M40 104 Q100 122 160 104" fill="none" stroke="#B5302A" stroke-width="3"/>
    ${caraArte(100, 136, o, .82, {dy: 20, dx: 16, boca: 8})}`;
  },
  /* ---------- Renacuajín → Ranacuá → Sapucay ---------- */
  renacuajin: o => {
    const C = '#5A9C7A', B = '#C8EAD4', A = '#7FC8F0';
    return `
    <ellipse cx="100" cy="170" rx="70" ry="12" fill="${A}" opacity=".5"/>
    <path d="M130 130 C160 118 180 140 194 124 C190 150 170 166 132 158Z" fill="${C}" ${L4}/>
    <path d="M150 132 C164 130 176 140 186 132" fill="none" stroke="#8CD0AC" stroke-width="3"/>
    <path d="M90 64 C128 64 146 92 144 124 C142 154 120 172 90 172 C60 172 40 154 38 124 C36 92 54 64 90 64Z" fill="${C}" ${L4}/>
    <path d="M90 120 C110 120 120 134 118 150 C116 164 104 170 90 170 C76 170 64 164 62 150 C60 134 70 120 90 120Z" fill="${B}"/>
    <path d="M64 78 C72 70 84 68 92 70" fill="none" stroke="#8CD0AC" stroke-width="5" stroke-linecap="round"/>
    ${[[30, 70], [40, 46], [160, 60]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="none" stroke="${A}" stroke-width="2.5"/>`).join('')}
    ${caraArte(90, 108, o, .9, {dy: 22})}`;
  },
  ranacua: o => {
    const C = '#4FA86A', D = '#2F7A48', B = '#D8F2C8', Y = '#FFD23F';
    return `
    <path d="M40 164 C20 160 10 176 22 186 L60 186 C62 176 54 168 40 164Z M160 164 C180 160 190 176 178 186 L140 186 C138 176 146 168 160 164Z" fill="${C}" ${L4}/>
    ${garras([[18, 186], [30, 188], [170, 188], [182, 186]], Y)}
    <path d="M100 82 C144 82 166 112 164 144 C162 172 136 186 100 186 C64 186 38 172 36 144 C34 112 56 82 100 82Z" fill="${C}" ${L4}/>
    <path d="M100 124 C126 124 140 142 138 160 C136 176 120 184 100 184 C80 184 64 176 62 160 C60 142 74 124 100 124Z" fill="${B}"/>
    ${[[62, 102, 6], [140, 108, 7], [120, 92, 4]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${D}" opacity=".7"/>`).join('')}
    <circle cx="70" cy="62" r="24" fill="${C}" ${L4}/><circle cx="130" cy="62" r="24" fill="${C}" ${L4}/>
    <path d="M40 100 C40 72 160 72 160 100" fill="${C}"/>
    ${envolverCara(`${ojosPar(70, 130, 60, 1.05, o, false)}<path d="M54 106 Q100 132 146 106" fill="none" ${L4}/>${o.humor === 'feliz' ? `<path d="M80 114 Q100 124 120 114 Q100 140 80 114Z" fill="#E58AA0" ${L3}/>` : ''}<ellipse cx="44" cy="96" rx="8" ry="5" fill="#FF8FAE" opacity=".7"/><ellipse cx="156" cy="96" rx="8" ry="5" fill="#FF8FAE" opacity=".7"/>`, 100, 80, o)}`;
  },
  sapucay: o => {
    const C = '#3E8C58', D = '#1E5A34', B = '#E8EFC0', Y = '#F2B53A', A = '#7FC8F0';
    return `
    <ellipse cx="100" cy="184" rx="94" ry="10" fill="${A}" opacity=".5"/>
    <path d="M30 156 C4 150 -6 172 8 186 L56 186 C58 172 48 160 30 156Z M170 156 C196 150 206 172 192 186 L144 186 C142 172 152 160 170 156Z" fill="${C}" ${L4}/>
    ${garras([[6, 186], [20, 188], [180, 188], [194, 186]], Y)}
    <path d="M100 60 C156 60 186 98 182 138 C178 172 146 188 100 188 C54 188 22 172 18 138 C14 98 44 60 100 60Z" fill="${C}" ${L4}/>
    <path d="M100 116 C134 116 152 138 150 160 C148 178 128 186 100 186 C72 186 52 178 50 160 C48 138 66 116 100 116Z" fill="${B}"/>
    <path d="M60 140 Q100 152 140 140 M58 160 Q100 172 142 160" fill="none" stroke="#C8D498" stroke-width="2.5"/>
    ${[[40, 96, 8], [160, 100, 9], [134, 78, 6], [56, 120, 5], [150, 128, 5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${Y}" ${L3}/>`).join('')}
    <circle cx="64" cy="40" r="28" fill="${C}" ${L4}/><circle cx="136" cy="40" r="28" fill="${C}" ${L4}/>
    <path d="M30 84 C30 52 170 52 170 84" fill="${C}"/>
    <path d="M44 44 C44 26 84 26 84 44 M116 44 C116 26 156 26 156 44" fill="none" stroke="${D}" stroke-width="5" stroke-linecap="round"/>
    ${envolverCara(`${ojosPar(64, 136, 42, 1.15, o, true)}<path d="M36 92 Q100 126 164 92" fill="none" ${L4}/>${o.humor === 'feliz' ? `<path d="M70 102 Q100 116 130 102 Q100 138 70 102Z" fill="#B8364F" ${L3}/>` : ''}`, 100, 70, o)}`;
  },
  /* ---------- Pejerrín → Pejerrey ---------- */
  pejerrin: o => {
    const C = '#9CC8E6', D = '#5E96C0', S = '#E6F2FA', F = '#5E96C0';
    return `
    <path d="M150 116 L188 88 C184 110 184 128 188 150Z" fill="${F}" ${L4}/>
    <path d="M90 76 L104 54 L118 80Z" fill="${F}" ${L3}/>
    <path d="M90 74 C134 70 162 98 158 120 C154 144 128 160 92 160 C56 160 30 142 30 118 C30 94 54 76 90 74Z" fill="${C}" ${L4}/>
    <path d="M40 126 C58 150 104 156 140 142" fill="none" stroke="${S}" stroke-width="10" stroke-linecap="round"/>
    <path d="M42 118 C80 112 120 114 152 118" fill="none" stroke="#D0E2F0" stroke-width="5"/>
    ${[[100, 96], [118, 100], [134, 106], [110, 132], [126, 134]].map(([x, y]) => `<path d="M${x} ${y} q5 6 10 0" fill="none" stroke="${D}" stroke-width="2"/>`).join('')}
    <path d="M86 140 C78 154 84 166 96 164 L100 148Z" fill="${F}" ${L3}/>
    ${caraArte(68, 110, o, .82, {dy: 22, dx: 16, boca: 8})}`;
  },
  /* ---------- Tortuguín → Tortugón ---------- */
  tortuguin: o => {
    const C = '#8CCB7A', D = '#5E9E4E', Ca = '#C98A4A', Cd = '#9C6430';
    return `
    ${pie(56, 182, 22, D)}${pie(80, 184, 22, D)}${pie(126, 184, 22, D)}${pie(150, 182, 22, D)}
    <path d="M168 160 C182 158 186 166 184 172 C176 170 170 170 164 168Z" fill="${C}" ${L3}/>
    <path d="M40 166 C36 110 70 84 108 84 C146 84 176 110 172 166Z" fill="${Ca}" ${L4}/>
    <path d="M108 98 L132 112 L132 138 L108 152 L84 138 L84 112Z" fill="${Cd}" ${L3}/>
    <path d="M84 112 L60 104 M132 112 L156 104 M84 138 L58 150 M132 138 L158 150 M108 152 V166 M108 98 V86" stroke="${TK}" stroke-width="2.6"/>
    <path d="M40 166 H172" ${L4}/>
    <path d="M60 76 C88 76 102 94 100 116 C98 136 82 148 60 148 C38 148 22 136 20 116 C18 94 32 76 60 76Z" fill="${C}" ${L4}/>
    ${caraArte(62, 112, o, .82, {dy: 22, dx: 16, boca: 8})}`;
  },
  tortugon: o => {
    const C = '#6EB25C', D = '#467A3A', Ca = '#3E8AB8', Cd = '#2A6890', A = '#BFE6FB';
    return `
    ${pie(46, 188, 30, D)}${pie(78, 190, 30, D)}${pie(132, 190, 30, D)}${pie(164, 188, 30, D)}
    <path d="M180 156 C198 152 204 164 200 172 C190 170 180 170 172 166Z" fill="${C}" ${L3}/>
    <path d="M22 168 C16 92 64 54 112 54 C160 54 200 92 194 168Z" fill="${Ca}" ${L4}/>
    <path d="M112 70 L144 88 L144 124 L112 142 L80 124 L80 88Z" fill="${Cd}" ${L3}/>
    <path d="M80 88 L50 78 M144 88 L174 78 M80 124 L44 142 M144 124 L180 142 M112 142 V168 M112 70 V56" stroke="${TK}" stroke-width="3"/>
    <path d="M36 100 C40 88 50 80 58 78" fill="none" stroke="${A}" stroke-width="5" stroke-linecap="round"/>
    ${[[60, 46], [112, 36], [164, 46]].map(([x, y]) => `<path d="M${x - 8} ${y + 14} C${x - 12} ${y} ${x + 2} ${y - 10} ${x + 6} ${y - 4} C${x + 4} ${y + 2} ${x + 8} ${y + 8} ${x + 8} ${y + 14}Z" fill="${A}" ${L3}/>`).join('')}
    <path d="M22 168 H194" ${L4}/>
    <path d="M52 66 C82 66 98 88 96 112 C94 136 76 150 52 150 C28 150 10 136 8 112 C6 88 22 66 52 66Z" fill="${C}" ${L4}/>
    <path d="M20 132 Q52 146 86 132" fill="none" stroke="${D}" stroke-width="3"/>
    ${caraArte(54, 104, o, .85, {dy: 24, dx: 16, boca: 9, enojo: true, colmillo: true})}`;
  },
  /* ---------- Enchufín → Enchufón ---------- */
  enchufin: o => {
    const C = '#F4F4EE', D = '#C9CED6', M = '#E6C35A', K = '#3A3A48';
    return `
    ${pie(84, 184, 22, '#9AA2AD')}${pie(116, 184, 22, '#9AA2AD')}
    <path d="M100 172 C80 180 60 186 40 182 C24 178 18 164 26 156" fill="none" stroke="${TK}" stroke-width="9" stroke-linecap="round"/>
    <path d="M100 172 C80 180 60 186 40 182 C24 178 18 164 26 156" fill="none" stroke="${K}" stroke-width="5" stroke-linecap="round"/>
    <rect x="78" y="22" width="12" height="32" rx="3" fill="${M}" ${L3}/><rect x="110" y="22" width="12" height="32" rx="3" fill="${M}" ${L3}/>
    <path d="M60 50 H140 C152 50 158 58 158 70 V146 C158 166 140 178 100 178 C60 178 42 166 42 146 V70 C42 58 48 50 60 50Z" fill="${C}" ${L4}/>
    <path d="M52 70 V140" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>
    <path d="M46 150 Q100 164 154 150" fill="none" stroke="${D}" stroke-width="3"/>
    ${rayo4(150, 40, .8)}${rayo4(32, 80, .7)}
    ${caraArte(100, 104, o, .95, {dy: 24})}`;
  },
  /* ---------- Pilita → Pilón → Voltazo: la pila ---------- */
  pilita: o => {
    const C = '#F2B53A', K = '#3A3A48', M = '#C9CED6';
    return `
    ${pie(84, 184, 20, K)}${pie(116, 184, 20, K)}
    <rect x="90" y="36" width="20" height="14" rx="3" fill="${M}" ${L3}/>
    <path d="M66 48 H134 C144 48 148 54 148 62 V166 C148 176 140 180 100 180 C60 180 52 176 52 166 V62 C52 54 56 48 66 48Z" fill="${K}" ${L4}/>
    <path d="M52 62 C52 54 56 48 66 48 H134 C144 48 148 54 148 62 V112 H52Z" fill="${C}" ${L4}/>
    <path d="M62 60 V104" stroke="#FFE7A8" stroke-width="5" stroke-linecap="round"/>
    <path d="M90 140 h20 M100 130 v20" stroke="${C}" stroke-width="5" stroke-linecap="round"/>
    <path d="M52 110 C40 108 34 118 38 126 C44 126 50 122 52 118Z M148 110 C160 108 166 118 162 126 C156 126 150 122 148 118Z" fill="${K}" ${L3}/>
    ${caraArte(100, 82, o, .85, {dy: 20, dx: 18, boca: 8})}`;
  },
  /* ---------- Tormentín: espíritu del viento eléctrico (etapa única) ---------- */
  tormentin: o => {
    const C = '#A8C8F0', D = '#6E92C8', W = '#E6F2FF', Y = '#FFE45C';
    return `
    <path d="M100 176 C80 170 76 156 92 150 C76 146 70 132 84 124" fill="none" stroke="${TK}" stroke-width="12" stroke-linecap="round"/>
    <path d="M100 176 C80 170 76 156 92 150 C76 146 70 132 84 124" fill="none" stroke="${C}" stroke-width="7" stroke-linecap="round"/>
    <path d="M100 36 C138 36 156 62 152 94 C148 124 126 138 100 138 C74 138 52 124 48 94 C44 62 62 36 100 36Z" fill="${C}" ${L4}/>
    <path d="M60 50 C40 40 30 54 36 68 C26 70 22 84 32 92 M140 50 C160 40 170 54 164 68 C174 70 178 84 168 92" fill="none" stroke="${TK}" stroke-width="9" stroke-linecap="round"/>
    <path d="M60 50 C40 40 30 54 36 68 C26 70 22 84 32 92 M140 50 C160 40 170 54 164 68 C174 70 178 84 168 92" fill="none" stroke="${W}" stroke-width="5" stroke-linecap="round"/>
    <path d="M70 52 C80 44 96 42 106 46" fill="none" stroke="${W}" stroke-width="5" stroke-linecap="round"/>
    ${rayo4(92, 30, .9, Y)}${rayo4(20, 120, .8, Y)}${rayo4(170, 120, .8, Y)}
    ${caraArte(100, 90, o, .95, {dy: 22, colmillo: true})}`;
  },
  /* ---------- Fosilito → Fosilón ---------- */
  fosilito: o => {
    const P = '#C9B898', D = '#9C8A6A', H = '#F4ECDC';
    return `
    ${pie(80, 184, 22, D)}${pie(120, 184, 22, D)}
    <path d="M140 150 C162 150 178 140 184 124 C190 136 184 158 160 170 C152 172 144 168 140 160Z" fill="${P}" ${L3}/>
    <path d="M100 100 C130 100 146 124 144 150 C142 172 124 184 100 184 C76 184 58 172 56 150 C54 124 70 100 100 100Z" fill="${P}" ${L4}/>
    <path d="M78 128 Q100 136 122 128 M76 146 Q100 154 124 146 M80 164 Q100 170 120 164 M100 116 V174" fill="none" stroke="${H}" stroke-width="4" stroke-linecap="round"/>
    <path d="M100 34 C138 34 156 56 154 82 C152 106 130 118 100 118 C70 118 48 106 46 82 C44 56 62 34 100 34Z" fill="${P}" ${L4}/>
    <path d="M58 54 C62 44 72 40 80 42 M120 42 C128 40 138 44 142 54" fill="none" stroke="${H}" stroke-width="4" stroke-linecap="round"/>
    <path d="M70 40 L64 24 L82 34Z M100 34 L100 16 L112 32Z M130 40 L138 24 L120 34Z" fill="${D}" ${L3}/>
    ${caraArte(100, 78, o, .92, {dy: 22, colmillo: true})}`;
  },
  /* ---------- Cuarcito → Cuarzón → Geodón ---------- */
  cuarcito: o => {
    const C = '#E8B4E8', D = '#B47AC8', P = '#A9A094';
    return `
    ${pie(82, 184, 22, '#7E766B')}${pie(118, 184, 22, '#7E766B')}
    <path d="M100 96 C134 96 150 120 148 148 C146 170 128 182 100 182 C72 182 54 170 52 148 C50 120 66 96 100 96Z" fill="${P}" ${L4}/>
    ${cristal4(72, 70, 34, 18, C, -20)}${cristal4(100, 58, 48, 22, C)}${cristal4(128, 70, 34, 18, C, 20)}
    <path d="M60 100 Q100 84 140 100" fill="${P}"/>
    <path d="M100 76 C134 76 148 98 146 124 C144 146 126 158 100 158 C74 158 56 146 54 124 C52 98 66 76 100 76Z" fill="${P}" ${L4}/>
    <path d="M66 96 C72 88 82 84 90 86" fill="none" stroke="#CFC7BA" stroke-width="4" stroke-linecap="round"/>
    ${caraArte(100, 118, o, .92, {dy: 22})}`;
  },
  geodon: o => {
    const C = '#C47ADC', L = '#F0C8FA', P = '#7E766B', In = '#6A3A90';
    return `
    ${pie(56, 190, 34, '#5E584F')}${pie(144, 190, 34, '#5E584F')}
    ${cristal4(26, 92, 50, 22, C, -50)}${cristal4(174, 92, 50, 22, C, 50)}
    <path d="M100 10 C160 10 194 56 190 110 C186 160 150 190 100 190 C50 190 14 160 10 110 C6 56 40 10 100 10Z" fill="${P}" ${L4}/>
    <path d="M100 30 C146 30 170 66 166 108 C162 146 136 168 100 168 C64 168 38 146 34 108 C30 66 54 30 100 30Z" fill="${In}" ${L4}/>
    ${[[56, 150, 28, -30], [80, 160, 34, -10], [120, 160, 34, 10], [144, 150, 28, 30], [44, 110, 26, -70], [156, 110, 26, 70], [60, 60, 26, -130], [140, 60, 26, 130], [100, 40, 22, 180]].map(([x, y, h, r]) => cristal4(x, y, h, 14, C, r)).join('')}
    <path d="M100 52 C130 52 146 72 144 98 C142 122 124 136 100 136 C76 136 58 122 56 98 C54 72 70 52 100 52Z" fill="${L}" ${L4}/>
    ${caraArte(100, 92, o, .92, {dy: 24, enojo: true, colmillo: true})}`;
  },
  /* ---------- Picaflorcito → Picaflor ---------- */
  picaflorcito: o => {
    const C = '#3FBF9A', D = '#2A8A6E', B = '#E6F8F0', R = '#E2493C', W = '#CDEFFB';
    return `
    <path d="M58 104 C30 80 14 96 22 114 C30 128 52 126 66 118Z M142 104 C170 80 186 96 178 114 C170 128 148 126 134 118Z" fill="${W}" opacity=".9" ${L3}/>
    <path d="M100 150 L88 182 L100 174 L112 182Z" fill="${D}" ${L3}/>
    <path d="M100 66 C132 66 148 92 146 120 C144 148 126 164 100 164 C74 164 56 148 54 120 C52 92 68 66 100 66Z" fill="${C}" ${L4}/>
    <path d="M100 112 C116 112 124 126 122 142 C120 154 110 162 100 162 C90 162 80 154 78 142 C76 126 84 112 100 112Z" fill="${B}"/>
    <path d="M82 104 C90 112 110 112 118 104 C114 116 86 116 82 104Z" fill="${R}" ${L3}/>
    <path d="M92 66 C92 52 104 48 110 56 C104 58 104 62 106 66Z" fill="${D}" ${L3}/>
    ${caraArte(100, 86, o, .82, {boca: 0, dx: 20})}
    ${envolverCara(`<path d="M104 98 C120 96 144 96 168 98 C144 100 120 104 104 106Z" fill="#3A3A48" ${L3}/>`, 100, 90, o)}`;
  },
};
Object.assign(INICIALES_V2, ARTE4);
