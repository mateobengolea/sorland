'use strict';
/* Arte a mano, tanda 2: Yaguarayo, Morrito, Cardoncito, Cóndor, Bagre, Nubarrón y Zorro de lumbre. */
const rayoA = (x, y, s = 1, col = '#FFE45C') => `<path d="M${x} ${y} l${8 * s} ${-14 * s} l${-2 * s} ${10 * s} l${10 * s} ${-2 * s} l${-14 * s} ${20 * s} l${2 * s} ${-10 * s}Z" fill="${col}" ${L3}/>`;
const manchas = (pts, col) => pts.map(([x, y, r = 5]) => `<path d="M${x - r} ${y} C${x - r} ${y - r * 1.2} ${x + r} ${y - r * 1.2} ${x + r} ${y} C${x + r} ${y + r} ${x - r} ${y + r} ${x - r} ${y}Z M${x - r * .4} ${y} a${r * .4} ${r * .4} 0 1 0 ${r * .8} 0 a${r * .4} ${r * .4} 0 1 0 ${-r * .8} 0" fill="${col}" fill-rule="evenodd"/>`).join('');

const ARTE2 = {
  /* ---------- Yaguarayo: yaguareté eléctrico (etapa única) ---------- */
  yaguarayo: o => {
    const C = '#F2B53A', D = '#C98A1E', B = '#FFF1CF', M = '#5A3A1E', E = '#7FD4FF';
    return `
    <path d="M150 144 C176 140 188 118 184 98 L196 92 L188 112 L198 112 C196 140 176 162 148 164Z" fill="${C}" ${L4}/>
    ${rayoA(186, 96, .8, E)}
    <path d="M64 120 C92 104 142 108 158 132 C170 152 158 172 130 174 C102 176 74 170 60 156 C50 144 52 128 64 120Z" fill="${C}" ${L4}/>
    ${manchas([[96, 130, 6], [120, 126, 6], [142, 140, 5], [110, 150, 5], [80, 146, 5]], M)}
    <path d="M70 156 C88 166 116 170 140 166 C120 174 92 174 74 166Z" fill="${B}"/>
    <path d="M136 160 C138 172 140 180 142 188 L162 188 C160 176 156 166 152 156Z M66 152 C64 166 64 178 66 188 L86 188 C86 176 86 166 84 156Z" fill="${D}" ${L4}/>
    <path d="M94 160 C94 172 94 180 96 188 L116 188 C116 178 114 168 112 162Z" fill="${C}" ${L4}/>${garras([[72, 188], [80, 188], [100, 188], [108, 188], [148, 188], [156, 188]])}
    <path d="M38 52 L34 22 L60 40Z M108 52 L114 22 L88 40Z" fill="${C}" ${L3}/><path d="M42 46 L40 30 L54 40Z M104 46 L108 30 L94 40Z" fill="${M}"/>
    <path d="M72 34 C108 34 124 56 122 82 C120 106 100 120 72 120 C44 120 24 106 22 82 C20 56 36 34 72 34Z" fill="${C}" ${L4}/>
    ${manchas([[50, 50, 4], [96, 50, 4], [72, 42, 3.5]], M)}
    <path d="M72 84 C92 84 104 94 102 106 C100 116 88 120 72 120 C56 120 44 116 42 106 C40 94 52 84 72 84Z" fill="${B}" ${L3}/>
    ${envolverCara(`<path d="M66 88 L78 88 L72 95Z" fill="#B8364F" ${L3}/><path d="M44 98 h-22 M44 104 h-18 M100 98 h22 M100 104 h18" stroke="${TK}" stroke-width="2" stroke-linecap="round"/>`, 72, 80, o)}
    ${rayoA(30, 68, .7, E)}
    ${caraArte(72, 70, o, .85, {enojo: true, colmillo: true, dy: 34, boca: 8, dx: 18})}`;
  },
  /* ---------- Morrito → Morro → Cerrazo: piedra viva de la sierra ---------- */
  morrito: o => {
    const P = '#A9A094', D = '#7E766B', L = '#CFC7BA';
    return `
    ${pie(78, 184, 24, D)}${pie(122, 184, 24, D)}
    <path d="M100 52 L140 62 L160 102 L156 150 L130 180 L70 180 L44 150 L40 102 L60 62Z" fill="${P}" ${L4}/>
    <path d="M60 62 L80 80 L100 52 M140 62 L120 80 L100 52 M80 80 L120 80 M44 150 L66 140 L70 180 M156 150 L134 140 L130 180" fill="none" stroke="${D}" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M68 70 L92 60 L84 76Z" fill="${L}"/>
    <path d="M40 108 C24 112 18 126 26 136 C34 140 42 132 46 124Z M160 108 C176 112 182 126 174 136 C166 140 158 132 154 124Z" fill="${P}" ${L3}/>
    <path d="M86 52 C88 40 98 36 104 42 C100 44 100 48 102 52Z" fill="#7CC56A" ${L3}/>
    ${caraArte(100, 108, o, .95, {dy: 24})}`;
  },
  cerrazo: o => {
    const P = '#8C8377', D = '#5E584F', L = '#C3BBAD', N = '#F4F7FB', V = '#7CC56A';
    return `
    ${pie(64, 188, 34, D)}${pie(136, 188, 34, D)}
    <path d="M100 6 L132 30 L150 22 L178 70 L186 140 L156 186 L44 186 L14 140 L22 70 L50 22 L68 30Z" fill="${P}" ${L4}/>
    <path d="M100 6 L132 30 L118 40 L100 30 L82 40 L68 30Z" fill="${N}" ${L3}/>
    <path d="M50 22 L60 34 L40 44Z M150 22 L140 34 L160 44Z" fill="${N}" ${L3}/>
    <path d="M22 70 L50 82 L44 120 L14 140 M178 70 L150 82 L156 120 L186 140 M50 82 L150 82 M44 186 L56 150 L44 120 M156 186 L144 150 L156 120" fill="none" stroke="${D}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M30 150 C36 140 44 144 46 150 C40 150 36 154 34 158Z M160 154 C164 146 172 146 174 154Z" fill="${V}" ${L3}/>
    <path d="M18 88 C-6 92 -10 126 4 146 C12 158 30 156 34 142 C36 128 32 110 26 100Z" fill="${P}" ${L4}/>
    <path d="M182 88 C206 92 210 126 196 146 C188 158 170 156 166 142 C164 128 168 110 174 100Z" fill="${P}" ${L4}/>
    ${garras([[2, 146], [12, 152], [188, 152], [198, 146]], L)}
    <path d="M62 140 L80 152 L100 144 L120 152 L138 140 L130 164 L70 164Z" fill="${D}" ${L3}/>
    ${caraArte(100, 110, o, 1.05, {dy: 0, enojo: true, boca: 0})}`;
  },
  /* ---------- Cardoncito → Cardonal: cactus del noroeste ---------- */
  cardoncito: o => {
    const C = '#5FAE5A', D = '#3E7E3B', B = '#C8E8B0', F = '#FF8FB1';
    const espinas = (pts) => pts.map(([x, y, a]) => `<path d="M${x} ${y} l${Math.cos(a) * 8} ${Math.sin(a) * 8}" stroke="#FFF6D8" stroke-width="2.4" stroke-linecap="round"/>`).join('');
    return `
    <path d="M66 176 C64 186 136 186 134 176 L130 160 L70 160Z" fill="#D9774A" ${L4}/><path d="M64 164 H136" ${L3}/>
    <path d="M100 38 C128 38 140 60 140 92 V150 C140 166 126 172 100 172 C74 172 60 166 60 150 V92 C60 60 72 38 100 38Z" fill="${C}" ${L4}/>
    <path d="M80 60 V160 M120 60 V160" stroke="${D}" stroke-width="2.5" opacity=".6"/>
    <path d="M62 110 C44 110 36 100 36 84 C36 74 50 72 50 84 C50 92 54 96 62 96Z" fill="${C}" ${L3}/>
    <path d="M138 122 C156 122 164 112 164 96 C164 86 150 84 150 96 C150 104 146 108 138 108Z" fill="${C}" ${L3}/>
    ${espinas([[62, 70, 3.6], [140, 70, -.5], [56, 130, 3.2], [144, 140, 0], [40, 78, 3.6], [162, 92, -.6]])}
    <circle cx="100" cy="36" r="9" fill="${F}" ${L3}/><circle cx="100" cy="36" r="3.5" fill="#FFD23F"/>
    ${caraArte(100, 92, o, .9, {dy: 24})}`;
  },
  cardonal: o => {
    const C = '#4F9E4C', D = '#336F31', F = '#FF8FB1', F2 = '#FFD23F';
    const espinas = (pts) => pts.map(([x, y, a]) => `<path d="M${x} ${y} l${Math.cos(a) * 9} ${Math.sin(a) * 9}" stroke="#FFF6D8" stroke-width="2.6" stroke-linecap="round"/>`).join('');
    return `
    ${pie(78, 188, 30, D)}${pie(122, 188, 30, D)}
    <path d="M100 18 C134 18 148 44 148 82 V158 C148 178 130 186 100 186 C70 186 52 178 52 158 V82 C52 44 66 18 100 18Z" fill="${C}" ${L4}/>
    <path d="M76 40 V176 M100 22 V184 M124 40 V176" stroke="${D}" stroke-width="2.5" opacity=".55"/>
    <path d="M54 118 C26 118 14 104 14 80 V50 C14 38 32 38 32 50 V80 C32 92 40 98 54 98Z" fill="${C}" ${L4}/>
    <path d="M146 132 C174 132 186 118 186 94 V66 C186 54 168 54 168 66 V94 C168 106 160 112 146 112Z" fill="${C}" ${L4}/>
    ${garras([[16, 44], [24, 40], [32, 44], [168, 60], [176, 56], [184, 60]])}
    ${espinas([[52, 60, 3.5], [148, 60, -.4], [50, 150, 3.0], [150, 160, .2], [14, 64, 3.5], [186, 80, -.4], [100, 18, -1.57]])}
    <circle cx="80" cy="22" r="9" fill="${F}" ${L3}/><circle cx="80" cy="22" r="3.5" fill="${F2}"/>
    <circle cx="122" cy="26" r="7" fill="${F}" ${L3}/><circle cx="122" cy="26" r="3" fill="${F2}"/>
    <circle cx="24" cy="36" r="7" fill="${F}" ${L3}/><circle cx="178" cy="52" r="7" fill="${F}" ${L3}/>
    ${caraArte(100, 82, o, 1, {dy: 26, enojo: true, colmillo: true})}`;
  },
  /* ---------- Condorcito → Cóndor alto ---------- */
  condorcito: o => {
    const N = '#3A3A48', D = '#24242E', W = '#F4F7FB', P = '#E7A7A0';
    return `
    <path d="M86 172 v12 M78 188 l8 -4 l8 4 M114 172 v12 M106 188 l8 -4 l8 4" stroke="#7E766B" stroke-width="4" stroke-linecap="round" fill="none"/>
    <path d="M100 86 C136 86 152 112 150 140 C148 164 128 180 100 180 C72 180 52 164 50 140 C48 112 64 86 100 86Z" fill="${N}" ${L4}/>
    <path d="M100 130 C114 130 122 142 120 156 C118 168 110 176 100 176 C90 176 82 168 80 156 C78 142 86 130 100 130Z" fill="#5A5A6C"/>
    <path d="M52 116 C30 120 22 146 32 164 C38 156 44 160 48 150 C52 156 58 150 60 140Z M148 116 C170 120 178 146 168 164 C162 156 156 160 152 150 C148 156 142 150 140 140Z" fill="${D}" ${L3}/>
    <path d="M60 98 C70 84 130 84 140 98 C132 110 68 110 60 98Z" fill="${W}" ${L3}/>
    <path d="M100 24 C128 24 140 44 138 66 C136 86 120 96 100 96 C80 96 64 86 62 66 C60 44 72 24 100 24Z" fill="${P}" ${L4}/>
    <path d="M90 26 C92 14 102 10 108 18 C104 20 104 24 106 28Z" fill="${N}" ${L3}/>
    ${envolverCara(`<path d="M90 66 C90 58 112 58 112 68 C112 76 104 82 100 88 C98 80 90 74 90 66Z" fill="#F4E2C8" ${L3}/>`, 100, 62, o)}
    ${caraArte(100, 56, o, .85, {boca: 0, dy: -40, dx: 20})}`;
  },
  condoralto: o => {
    const N = '#2E2E3A', D = '#1C1C26', W = '#F4F7FB', P = '#DE8F86';
    return `
    <path d="M90 150 C60 120 20 112 -4 128 C10 132 18 140 24 148 C10 150 4 158 2 168 C22 160 34 162 44 168 C40 174 40 182 44 188 C64 176 80 168 96 168Z" fill="${N}" ${L4}/>
    <path d="M30 140 L60 150 M22 160 L58 162" stroke="#6A6A80" stroke-width="2.5"/>
    <path d="M110 150 C140 120 180 112 204 128 C190 132 182 140 176 148 C190 150 196 158 198 168 C178 160 166 162 156 168 C160 174 160 182 156 188 C136 176 120 168 104 168Z" fill="${N}" ${L4}/>
    <path d="M170 140 L140 150 M178 160 L142 162" stroke="#6A6A80" stroke-width="2.5"/>
    <path d="M100 82 C130 82 144 108 142 136 C140 162 124 182 100 182 C76 182 60 162 58 136 C56 108 70 82 100 82Z" fill="${N}" ${L4}/>
    <path d="M58 94 C70 78 130 78 142 94 C134 108 66 108 58 94Z" fill="${W}" ${L4}/>
    <path d="M100 18 C130 18 142 40 140 62 C138 82 120 92 100 92 C80 92 62 82 60 62 C58 40 70 18 100 18Z" fill="${P}" ${L4}/>
    <path d="M82 20 C82 4 96 -2 106 6 C112 0 122 4 118 16 C112 18 106 20 104 24Z" fill="#B8364F" ${L3}/>
    ${envolverCara(`<path d="M88 62 C88 52 114 52 114 64 C114 74 104 80 100 90 C96 80 88 72 88 62Z" fill="#F4E2C8" ${L3}/>`, 100, 58, o)}
    ${caraArte(100, 50, o, .85, {boca: 0, dy: -40, dx: 20, enojo: true})}`;
  },
  /* ---------- Bagrecito → Bagrón: el bagre del Paraná ---------- */
  bagrecito: o => {
    const C = '#8C9FB0', D = '#5E7286', B = '#E2EBF2';
    return `
    <path d="M150 124 L184 96 C190 116 190 140 184 158Z" fill="${D}" ${L4}/>
    <path d="M90 64 L110 40 L120 70Z" fill="${D}" ${L3}/>
    <path d="M100 66 C140 66 160 98 156 128 C152 160 128 176 96 176 C62 176 36 156 36 122 C36 90 60 66 100 66Z" fill="${C}" ${L4}/>
    <path d="M44 132 C56 160 92 172 126 166 C102 176 64 172 48 152Z" fill="${B}"/>
    <path d="M86 150 C76 164 80 176 92 176 L98 160Z" fill="${D}" ${L3}/>
    ${[[110, 90], [128, 104], [118, 124], [138, 130]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="${D}"/>`).join('')}
    ${envolverCara(`<path d="M50 126 C34 130 22 144 18 160 M56 130 C46 140 42 152 44 164 M70 128 C80 140 82 152 76 164" fill="none" stroke="${TK}" stroke-width="3" stroke-linecap="round"/>`, 70, 110, o)}
    ${caraArte(70, 104, o, .85, {dy: 20, dx: 18, boca: 9})}`;
  },
  /* ---------- Nubarrón → Tormentón: nube de tormenta ---------- */
  nubarron: o => {
    const C = '#8F9BB8', L = '#C9D3E8', Y = '#FFE45C';
    return `
    ${rayoA(70, 160, 1.1, Y)}${rayoA(122, 168, .9, Y)}
    <g fill="#7FB4E8" opacity=".8"><path d="M96 168 q-4 8 0 10 q4 -2 0 -10Z"/><path d="M150 160 q-4 8 0 10 q4 -2 0 -10Z"/></g>
    <path d="M52 140 C26 140 18 112 38 100 C34 74 60 60 80 72 C88 50 124 46 136 70 C160 62 180 84 170 104 C188 114 182 142 160 142Z" fill="${C}" ${L4}/>
    <path d="M56 86 C62 76 74 74 80 80 M94 64 C104 56 120 58 126 66" fill="none" stroke="${L}" stroke-width="5" stroke-linecap="round"/>
    ${caraArte(104, 106, o, .9, {dy: 20})}`;
  },
  /* ---------- Zorrolumbre → Zorrofogón: zorro con cola de fuego ---------- */
  zorrolumbre: o => {
    const C = '#E8743A', D = '#B8521E', B = '#FFF1DE';
    return `
    <path d="M136 156 C164 160 180 140 176 112 C186 118 192 132 188 148 C182 172 156 182 132 176Z" fill="${C}" ${L4}/>
    ${llamaG(176, 112, .7)}
    ${pie(80, 184, 22, '#4A3428')}${pie(120, 184, 22, '#4A3428')}
    <path d="M100 108 C130 108 144 130 142 152 C140 172 122 184 100 184 C78 184 60 172 58 152 C56 130 70 108 100 108Z" fill="${C}" ${L4}/>
    <path d="M100 122 C114 122 120 140 118 156 C116 170 108 178 100 178 C92 178 84 170 82 156 C80 140 86 122 100 122Z" fill="${B}"/>
    <path d="M62 64 L50 18 L90 50Z M138 64 L150 18 L110 50Z" fill="${C}" ${L4}/><path d="M64 56 L56 30 L80 50Z M136 56 L144 30 L120 50Z" fill="#4A3428"/>
    <path d="M100 42 C134 42 150 62 148 88 C146 110 126 122 100 122 C74 122 54 110 52 88 C50 62 66 42 100 42Z" fill="${C}" ${L4}/>
    <path d="M100 82 C80 82 64 96 70 110 C80 120 120 120 130 110 C136 96 120 82 100 82Z" fill="${B}" ${L3}/>
    ${envolverCara(`<ellipse cx="100" cy="100" rx="6" ry="4" fill="${TK}"/>`, 100, 84, o)}
    ${caraArte(100, 78, o, .9, {dy: 34, boca: 7})}`;
  },
};
Object.assign(INICIALES_V2, ARTE2);
