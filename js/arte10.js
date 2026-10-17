'use strict';
/* Arte a mano: Cachorrín y sus seis formas, peces de pesca, Uritorco y Ballenaria. Íconos de piedras y cañas. */
// Cachorrín sentado de frente; cada forma cambia orejas, cola, cuello y colores.
function cachorro(o, P){
  const {C, D, B, cola = '', orejas = '', cuello = '', frente = '', extra = '', enojo = false} = P;
  return `<g transform="translate(6 6) scale(.94)">
    ${cola}
    ${pie(74, 184, 24, D)}${pie(126, 184, 24, D)}
    <path d="M100 98 C134 98 148 124 146 150 C144 172 126 184 100 184 C74 184 56 172 54 150 C52 124 66 98 100 98Z" fill="${C}" ${L4}/>
    <path d="M100 118 C116 118 124 134 122 152 C120 168 112 178 100 178 C88 178 80 168 78 152 C76 134 84 118 100 118Z" fill="${B}"/>
    <path d="M84 150 C82 166 82 176 84 184 L96 184 C96 176 96 166 94 152Z M116 150 C118 166 118 176 116 184 L104 184 C104 176 104 166 106 152Z" fill="${C}" ${L3}/>
    ${cuello}
    ${orejas}
    <path d="M100 30 C136 30 152 52 150 80 C148 104 128 118 100 118 C72 118 52 104 50 80 C48 52 64 30 100 30Z" fill="${C}" ${L4}/>
    <path d="M100 84 C84 84 70 94 72 106 C76 116 124 116 128 106 C130 94 116 84 100 84Z" fill="${B}" ${L3}/>
    ${frente}
    ${envolverCara(`<ellipse cx="100" cy="94" rx="6" ry="4.2" fill="${TK}"/>`, 100, 80, o)}
    ${caraArte(100, 72, o, .9, {dy: 34, boca: 8, enojo, dx: 20})}
    ${extra}</g>`;
}
const orejasZorro = (C, I) => `<path d="M60 64 L48 14 L92 44Z M140 64 L152 14 L108 44Z" fill="${C}" ${L4}/><path d="M64 54 L56 26 L84 44Z M136 54 L144 26 L116 44Z" fill="${I}"/>`;
const ARTE10 = {
  cachorrin: o => cachorro(o, {C: '#E2B98A', D: '#B98A5A', B: '#FFF6EA',
    cola: `<path d="M136 160 C170 160 186 134 178 104 C192 112 198 140 186 160 C176 178 150 184 132 176Z" fill="#E2B98A" ${L4}/><path d="M178 104 C192 112 198 140 186 160 C182 150 180 132 172 120Z" fill="#FFF6EA" ${L3}/>`,
    orejas: orejasZorro('#E2B98A', '#8A5A35'),
    cuello: `<path d="M64 104 C70 122 86 128 100 124 C114 128 130 122 136 104 C128 116 118 112 112 120 C106 112 94 112 88 120 C82 112 72 116 64 104Z" fill="#FFF6EA" ${L3}/>`}),
  brasarrin: o => cachorro(o, {C: '#E8622E', D: '#B84418', B: '#FFD98A', enojo: true,
    cola: `<path d="M134 162 C176 168 196 132 184 96 C200 104 208 136 196 162 C182 190 150 192 128 180Z" fill="#E8622E" ${L4}/>${llamaG(186, 98, .9)}`,
    orejas: `<path d="M58 66 L40 8 L94 42Z M142 66 L160 8 L106 42Z" fill="#E8622E" ${L4}/>${llamaG(42, 12, .45)}${llamaG(158, 12, .45)}`,
    cuello: `<path d="M56 98 C50 120 70 136 100 132 C130 136 150 120 144 98 C136 108 128 104 124 114 C118 104 110 108 106 116 C100 104 94 108 92 116 C86 106 78 108 74 114 C70 104 62 108 56 98Z" fill="#FFD98A" ${L3}/>`,
    frente: `<path d="M92 32 C94 22 106 22 108 32 C104 30 96 30 92 32Z" fill="#FFD23F" ${L3}/>`}),
  olarrin: o => cachorro(o, {C: '#5AB4E8', D: '#3A8CC4', B: '#E6F6FF',
    cola: `<path d="M136 162 C170 166 188 150 190 126 C200 120 206 108 200 100 C196 110 186 112 180 108 C182 120 176 138 160 146 C152 150 142 150 132 148Z" fill="#5AB4E8" ${L4}/><path d="M190 126 C198 140 202 156 194 168 C188 158 182 152 176 150Z" fill="#8FD3F7" ${L3}/>`,
    orejas: `<path d="M62 62 C40 50 32 26 40 12 C56 22 70 36 82 46Z M138 62 C160 50 168 26 160 12 C144 22 130 36 118 46Z" fill="#8FD3F7" ${L4}/><path d="M48 24 L72 46 M152 24 L128 46" stroke="#3A8CC4" stroke-width="2.5"/>`,
    cuello: `<path d="M58 104 C66 124 84 130 100 126 C116 130 134 124 142 104 C130 112 116 110 100 116 C84 110 70 112 58 104Z" fill="#E6F6FF" ${L3}/>`,
    frente: `<path d="M100 26 C94 14 98 6 104 2 C110 10 108 20 102 28Z" fill="#8FD3F7" ${L3}/>`}),
  hojarrin: o => cachorro(o, {C: '#B6D98A', D: '#7EA84E', B: '#F4F8E6',
    cola: `<path d="M136 164 C168 168 192 146 192 114 C192 100 182 92 176 96 C186 110 184 132 168 144 C156 152 144 152 132 150Z" fill="#B6D98A" ${L4}/>${hojaA(182, 100, -20, 1.4, '#5FAE5A')}`,
    orejas: `${hojaA(66, 54, -38, 1.6, '#5FAE5A')}${hojaA(134, 54, 38, 1.6, '#5FAE5A')}`,
    cuello: `<path d="M62 106 C70 122 86 128 100 124 C114 128 130 122 138 106" fill="none" stroke="#5FAE5A" stroke-width="7" stroke-linecap="round"/>`,
    frente: `${hojaA(100, 40, 0, .9, '#5FAE5A')}`}),
  chisparrin: o => cachorro(o, {C: '#FFD23F', D: '#E2A21E', B: '#FFF6D8', enojo: true,
    cola: `<path d="M134 158 L160 150 L152 136 L178 128 L168 114 L192 100 L180 128 L188 136 L166 146 L174 158 L140 172Z" fill="#FFD23F" ${L4}/>`,
    orejas: `<path d="M60 62 L42 10 L74 34 L72 18 L92 44Z M140 62 L158 10 L126 34 L128 18 L108 44Z" fill="#FFD23F" ${L4}/>`,
    cuello: `<path d="M52 100 L66 108 L60 120 L76 116 L78 130 L90 120 L100 132 L110 120 L122 130 L124 116 L140 120 L134 108 L148 100 L130 102 L100 112 L70 102Z" fill="#FFF6D8" ${L3}/>`,
    frente: `<path d="M96 34 L104 24 L102 32 L110 30 L100 42 L102 34Z" fill="#E2A21E" ${L3}/>`}),
  nevarrin: o => cachorro(o, {C: '#BFE6FB', D: '#7EC0E8', B: '#FFFFFF',
    cola: `<path d="M136 162 C170 164 190 140 186 110 C198 120 200 146 186 164 C172 182 148 184 130 176Z" fill="#BFE6FB" ${L4}/>${cristal4(186, 110, 26, 12, '#E6F4FB', 10)}`,
    orejas: `<path d="M60 64 L46 16 L92 44Z M140 64 L154 16 L108 44Z" fill="#BFE6FB" ${L4}/>${cristal4(48, 22, 20, 10, '#FFFFFF', -18)}${cristal4(152, 22, 20, 10, '#FFFFFF', 18)}`,
    cuello: `<path d="M60 102 L72 118 L84 112 L92 126 L100 114 L108 126 L116 112 L128 118 L140 102 L120 108 L100 112 L80 108Z" fill="#FFFFFF" ${L3}/>`,
    frente: `<g transform="translate(100 40)" stroke="#7EC0E8" stroke-width="3" stroke-linecap="round"><path d="M0 -8 V8 M-7 -4 L7 4 M-7 4 L7 -4"/></g>`}),
  brisarrin: o => cachorro(o, {C: '#F4F8FB', D: '#B9D7F2', B: '#FFFFFF',
    cola: `<path d="M136 160 C164 150 188 156 198 140 C192 162 176 176 150 178 C176 182 188 190 192 198 C166 194 146 188 132 176Z" fill="#B9D7F2" ${L4}/>`,
    orejas: `<path d="M64 60 C36 54 14 32 10 12 C30 18 52 24 82 44Z M136 60 C164 54 186 32 190 12 C170 18 148 24 118 44Z" fill="#B9D7F2" ${L4}/><path d="M18 22 L60 46 M28 36 L64 52 M182 22 L140 46 M172 36 L136 52" stroke="#7FA6C8" stroke-width="2.5"/>`,
    cuello: `<path d="M58 104 C62 92 74 96 76 104 C80 94 92 96 94 106 C98 96 110 96 110 106 C114 96 126 94 128 104 C132 96 142 96 142 106 C134 124 66 124 58 104Z" fill="#FFFFFF" ${L3}/>`,
    frente: `${viento6('M86 40 C92 34 104 34 112 40', '#7FA6C8', 3.5)}`}),
  /* ---------- Peces de pesca ---------- */
  mojarrita: o => {
    const C = '#C9D8E6', D = '#8FA6BC', S = '#F4F8FB';
    return `
    <path d="M144 120 L182 94 C176 118 176 134 182 154Z" fill="${D}" ${L4}/>
    <path d="M96 80 L110 62 L124 86Z" fill="${D}" ${L3}/>
    <path d="M90 82 C130 80 152 104 150 124 C148 146 124 160 90 160 C56 160 34 144 34 122 C34 100 56 84 90 82Z" fill="${C}" ${L4}/>
    <path d="M42 128 C60 150 104 156 138 142" fill="none" stroke="${S}" stroke-width="10" stroke-linecap="round"/>
    <path d="M48 118 C84 112 118 114 146 120" fill="none" stroke="#E2B95A" stroke-width="3"/>
    <path d="M90 140 C84 152 88 162 98 160 L100 146Z" fill="${D}" ${L3}/>
    ${caraArte(64, 112, o, .78, {dy: 22, dx: 16, boca: 7})}`;
  },
  mojarron: o => {
    const C = '#B4C6D8', D = '#6E88A2', S = '#F4F8FB';
    return `
    <path d="M154 112 L198 72 C192 108 192 130 198 168Z" fill="${D}" ${L4}/>
    <path d="M66 62 L90 30 L104 50 L122 28 L134 66Z" fill="${D}" ${L4}/>
    <path d="M92 58 C150 54 178 92 172 126 C166 160 134 178 90 178 C44 178 14 156 14 120 C14 84 46 60 92 58Z" fill="${C}" ${L4}/>
    <path d="M22 130 C42 166 108 176 154 158" fill="none" stroke="${S}" stroke-width="12" stroke-linecap="round"/>
    ${[84, 104, 124, 144].map(x => `<path d="M${x} 74 C${x - 6} 100 ${x - 6} 130 ${x} 156" fill="none" stroke="${D}" stroke-width="3" opacity=".6"/>`).join('')}
    <path d="M28 116 C76 106 130 108 168 116" fill="none" stroke="#E2B95A" stroke-width="4"/>
    <path d="M88 154 C76 172 82 188 98 186 L104 162Z M140 146 C140 166 150 178 162 174 L156 152Z" fill="${D}" ${L3}/>
    ${caraArte(54, 106, o, .9, {dy: 26, dx: 18, boca: 12, enojo: true, colmillo: true})}`;
  },
  doradito: o => {
    const C = '#FFD23F', D = '#E2A21E', S = '#FFF3B0', K = '#C97A1C';
    return `
    <path d="M146 118 L184 90 C178 116 178 134 184 156Z" fill="${D}" ${L4}/>
    <path d="M86 84 L104 58 L126 88Z" fill="${D}" ${L3}/>
    <path d="M90 84 C132 80 154 104 152 124 C150 148 126 162 90 162 C54 162 32 146 32 122 C32 100 54 86 90 84Z" fill="${C}" ${L4}/>
    <path d="M40 130 C58 152 104 158 140 144" fill="none" stroke="${S}" stroke-width="10" stroke-linecap="round"/>
    ${[[100, 104], [116, 110], [104, 124], [124, 128], [132, 112]].map(([x, y]) => `<path d="M${x} ${y} q4 -5 8 0" fill="none" stroke="${K}" stroke-width="2.5"/>`).join('')}
    <path d="M90 142 C82 156 86 166 98 164 L100 148Z" fill="${D}" ${L3}/>
    ${caraArte(62, 112, o, .8, {dy: 22, dx: 16, boca: 9, colmillo: true})}`;
  },
  dorado: o => {
    const C = '#FFC93C', D = '#E89A1E', S = '#FFF3B0', K = '#B86A12', A = '#5AB4E8';
    return `
    <path d="M10 186 C40 172 70 190 100 180 C130 170 160 190 192 178" fill="none" stroke="${A}" stroke-width="6" stroke-linecap="round"/>
    ${[[30, 168], [170, 164], [56, 150]].map(([x, y]) => `<path d="M${x} ${y} q-5 -10 0 -16 q5 6 0 16Z" fill="${A}" ${L3}/>`).join('')}
    <g transform="rotate(-18 100 100)">
    <path d="M158 104 L202 60 C196 98 196 122 204 162Z" fill="${D}" ${L4}/>
    <path d="M60 58 L76 18 L92 42 L104 12 L118 42 L132 22 L138 64Z" fill="${D}" ${L4}/>
    <path d="M94 54 C152 50 182 88 176 122 C170 156 138 174 94 174 C46 174 14 152 14 116 C14 80 48 56 94 54Z" fill="${C}" ${L4}/>
    <path d="M22 126 C44 162 110 172 158 154" fill="none" stroke="${S}" stroke-width="12" stroke-linecap="round"/>
    ${[[100, 82], [122, 88], [144, 96], [110, 112], [134, 116], [152, 122], [120, 140]].map(([x, y]) => `<path d="M${x} ${y} q5 -6 10 0" fill="none" stroke="${K}" stroke-width="3"/>`).join('')}
    <path d="M86 150 C72 170 80 188 98 184 L104 160Z M142 142 C142 162 152 174 164 170 L158 148Z" fill="${D}" ${L3}/>
    ${caraArte(54, 104, o, .92, {dy: 26, dx: 18, boca: 13, enojo: true, colmillo: true})}</g>`;
  },
  /* ---------- Legendarias nuevas ---------- */
  uritorco: o => {
    const P = '#9A8C7C', D = '#6E6254', L = '#C9BDAA', Cr = '#7FD4FF', V = '#5FAE5A';
    return `<g transform="translate(4 8) scale(.96)">
    <circle cx="100" cy="100" r="96" fill="${Cr}" opacity=".12"/>
    <path d="M36 150 L28 192 L64 192 L66 158Z M134 158 L136 192 L172 192 L164 150Z" fill="${D}" ${L4}/>
    <path d="M58 158 L54 192 L84 192 L84 162Z M116 162 L116 192 L146 192 L142 158Z" fill="${P}" ${L4}/>
    ${garras([[34, 192], [44, 193], [54, 192], [146, 192], [156, 193], [166, 192]], L)}
    <path d="M10 140 C10 100 40 80 70 74 L100 30 L120 58 L136 42 L160 80 C184 92 196 116 192 144 C186 168 150 176 100 176 C50 176 12 168 10 140Z" fill="${P}" ${L4}/>
    <path d="M100 30 L120 58 L136 42 L150 64 L132 72 L112 66 L100 76 L84 64 L70 74Z" fill="#F4F7FB" ${L3}/>
    ${[[52, 96], [150, 100], [96, 92]].map(([x, y]) => cristal4(x, y, 26, 12, Cr, (x - 100) / 5)).join('')}
    <path d="M30 120 L70 110 L92 130 L130 118 L170 128" fill="none" stroke="${D}" stroke-width="3"/>
    ${[[40, 104], [168, 108], [124, 74]].map(([x, y]) => `<path d="M${x} ${y} l-6 -14 l6 4 l6 -10 l4 10 l6 -4 l-4 14Z" fill="${V}" ${L3}/>`).join('')}
    <path d="M60 120 C60 96 140 96 140 120 C140 150 124 166 100 166 C76 166 60 150 60 120Z" fill="${L}" ${L4}/>
    <path d="M72 106 L64 90 L84 100Z M128 106 L136 90 L116 100Z" fill="${D}" ${L3}/>
    ${envolverCara(`<path d="M74 118 L92 122 L74 128Z M126 118 L108 122 L126 128Z" fill="${Cr}" ${L3}/><circle cx="82" cy="122" r="2.5" fill="#fff"/><circle cx="118" cy="122" r="2.5" fill="#fff"/>
      <path d="M86 146 L94 140 L100 146 L106 140 L114 146" fill="none" ${L3}/>`, 100, 128, o)}</g>`;
  },
  ballenaria: o => {
    const C = '#3E6E9E', D = '#24486E', B = '#DDEBF5', Cr = '#8FD3F7', A = '#5AB4E8';
    return `
    <circle cx="100" cy="100" r="96" fill="${Cr}" opacity=".12"/>
    <path d="M70 26 C64 10 76 2 84 10 C86 2 98 2 98 12 C104 4 114 8 110 18 C104 26 90 30 78 30Z" fill="${Cr}" opacity=".9" ${L3}/>
    <path d="M86 40 C86 32 90 28 92 30" fill="none" stroke="${Cr}" stroke-width="4" stroke-linecap="round"/>
    <path d="M160 96 C186 84 198 60 196 40 C204 52 206 70 198 84 C204 92 206 106 200 116 C194 104 182 100 170 104Z" fill="${C}" ${L4}/>
    <path d="M14 124 C10 80 46 46 100 46 C150 46 178 80 174 118 C170 160 136 180 92 180 C46 180 18 158 14 124Z" fill="${C}" ${L4}/>
    <path d="M20 132 C30 166 66 178 100 176 C136 174 162 156 170 126 C150 150 110 160 72 156 C48 152 30 144 20 132Z" fill="${B}" ${L3}/>
    ${[136, 146, 156, 166].map((y, i) => `<path d="M${40 + i * 4} ${y} Q100 ${y + 8} ${150 - i * 6} ${y - 6}" fill="none" stroke="${D}" stroke-width="2" opacity=".5"/>`).join('')}
    ${[[110, 70], [134, 80], [150, 98], [92, 64]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${Cr}" ${L3}/>`).join('')}
    <path d="M66 50 L72 26 L84 46 L96 18 L104 46 L118 28 L120 52Z" fill="#E6F4FB" ${L3}/>
    <path d="M84 168 C74 184 80 196 96 192 L102 172Z" fill="${D}" ${L3}/>
    ${caraArte(58, 104, o, .95, {dy: 30, dx: 20, boca: 16, enojo: true})}`;
  },
};
Object.assign(INICIALES_V2, ARTE10);
// Las formas de Cachorrín miran de frente; los peces miran a la izquierda.
if(typeof MIRA_IZQ !== 'undefined') ['mojarrita', 'mojarron', 'doradito', 'dorado', 'ballenaria'].forEach(e => MIRA_IZQ.add(e));

/* ---------------- Íconos de los objetos nuevos ---------------- */
(() => {
  const original = iconoObjeto;
  iconoObjeto = function(o, tam = 40){
    const T = '#22304A', [c1, c2] = o.colores || ['#ccc', '#fff'];
    const ic = cuerpo => `<svg viewBox="0 0 60 60" width="${tam}" height="${tam}" aria-hidden="true"><g stroke="${T}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${cuerpo}</g></svg>`;
    if(o.icono === 'piedra') return ic(`<path d="M30 6 L50 22 L44 50 L16 50 L10 22Z" fill="${c1}"/><path d="M30 6 L30 50 M10 22 L50 22 M16 50 L30 22 L44 50" stroke-width="1.5" opacity=".6"/><path d="M20 18 L28 12" stroke="${c2}" stroke-width="4"/>`);
    if(o.icono === 'cana') return ic(`<path d="M10 54 L46 8" stroke="${c1}" stroke-width="5"/><path d="M10 54 L46 8" fill="none"/><path d="M46 8 C54 14 54 30 50 40" fill="none" stroke-width="1.5"/><circle cx="50" cy="44" r="4" fill="${c2}"/><circle cx="18" cy="44" r="6" fill="#9AA2AD"/>`);
    return original(o, tam);
  };
})();
