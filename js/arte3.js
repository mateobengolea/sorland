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
