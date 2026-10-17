'use strict';
/* Evoluciones rediseñadas (3): Carosaurio, Rufisaurio y Morro. */
const ARTE8 = {
  /* Carosaurio: dragón adolescente, cuello largo, cresta de fuego, púas y alitas */
  /* Rufisaurio: perro de agua erguido, pelo largo como ola, aleta en la cabeza y collar de burbujas */
  /* Morro: gólem de roca erguido, piernas y puños de peñasco, musgo arriba y grieta brillante */
  morro: o => {
    const P = '#9A9184', D = '#6E675D', L = '#C9C1B3', V = '#7CC56A', Y = '#F2B53A';
    return `
    <path d="M60 150 L52 190 L88 190 L90 156Z M110 156 L112 190 L148 190 L140 150Z" fill="${D}" ${L4}/>
    <path d="M52 190 L60 184 L70 190 M112 190 L120 184 L130 190" fill="none" ${L3}/>
    <path d="M100 52 L148 66 L164 110 L156 156 L120 170 L80 170 L44 156 L36 110 L52 66Z" fill="${P}" ${L4}/>
    <path d="M52 66 L74 92 L100 52 L126 92 L148 66 M74 92 L126 92 L120 130 L80 130Z M36 110 L74 92 M164 110 L126 92 M44 156 L80 130 M156 156 L120 130" fill="none" stroke="${D}" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M92 132 L100 146 L96 158 L104 168" fill="none" stroke="${Y}" stroke-width="4" stroke-linecap="round"/>
    ${brazo6('M44 100 L24 130', P, 18)}${brazo6('M156 100 L176 130', P, 18)}
    <path d="M4 128 L24 118 L44 130 L40 156 L16 160 L4 148Z M196 128 L176 118 L156 130 L160 156 L184 160 L196 148Z" fill="${L}" ${L4}/>
    <path d="M14 132 L26 140 M186 132 L174 140" stroke="${D}" stroke-width="2.5"/>
    <path d="M70 58 C74 40 92 32 100 40 C108 30 128 38 130 58 C116 52 84 52 70 58Z" fill="${V}" ${L3}/>
    <path d="M86 40 C88 30 96 26 100 32" fill="none" stroke="#4F9A3F" stroke-width="3" stroke-linecap="round"/>
    <path d="M60 74 L90 64 L80 82Z" fill="${L}"/>
    ${caraArte(100, 104, o, .95, {dy: 22, enojo: true, colmillo: true, boca: 11})}`;
  },
};
Object.assign(INICIALES_V2, ARTE8);
/* Carotitán: dragón adulto imponente — alas enormes de membrana, cuello largo,
   cabeza alargada con cuernos hacia atrás, melena de fuego, placas doradas y llamarada en la boca. */
INICIALES_V2.carotitan = o => {
  const C = '#B8321C', D = '#7E1E10', B = '#F2B860', Bo = '#C98A2E', Cu = '#FFF0D0', A = '#4A2A78', Am = '#7A52B8', Y = '#FFD23F';
  const ala = (s) => `<g transform="translate(100 0) scale(${s} 1) translate(-100 0)">
    <path d="M78 96 C60 52 30 22 2 14 C10 30 8 44 0 56 C14 56 18 66 10 80 C24 76 30 86 24 100 C38 94 46 102 44 116 C56 108 66 110 70 120Z" fill="${A}" ${L4}/>
    <path d="M76 98 L4 16 M66 104 L8 58 M62 110 L22 92 M64 116 L44 112" stroke="${Am}" stroke-width="3" stroke-linecap="round"/>
    <path d="M78 96 C60 52 30 22 2 14" fill="none" stroke="${TK}" stroke-width="8" stroke-linecap="round"/><path d="M78 96 C60 52 30 22 2 14" fill="none" stroke="${C}" stroke-width="4" stroke-linecap="round"/>
    ${garras([[2, 14]], Cu)}</g>`;
  return `<g transform="translate(10 16) scale(.9)">
    ${ala(1)}${ala(-1)}
    <path d="M128 160 C160 172 186 164 194 140 C198 128 206 134 202 148 C194 178 160 192 124 182Z" fill="${C}" ${L4}/>
    ${[[160, 168], [178, 160], [190, 148]].map(([x, y]) => `<path d="M${x - 6} ${y - 2} L${x} ${y - 14} L${x + 6} ${y - 2}Z" fill="${Bo}" ${L3}/>`).join('')}
    ${llamaG(200, 128, 1.1)}
    <path d="M68 160 C62 172 56 182 50 192 L86 192 C88 182 90 172 92 164Z M108 164 C110 172 112 182 114 192 L150 192 C144 182 138 172 132 160Z" fill="${D}" ${L4}/>
    ${garras([[56, 192], [68, 193], [80, 192], [120, 192], [132, 193], [144, 192]], Cu)}
    <path d="M100 96 C142 96 162 126 160 154 C158 176 134 186 100 186 C66 186 42 176 40 154 C38 126 58 96 100 96Z" fill="${C}" ${L4}/>
    <path d="M100 104 C120 104 132 124 130 150 C128 170 116 182 100 182 C84 182 72 170 70 150 C68 124 80 104 100 104Z" fill="${B}" ${L3}/>
    ${[120, 138, 156, 172].map(y => `<path d="M${76 + (y - 120) * .05} ${y} Q100 ${y + 7} ${124 - (y - 120) * .05} ${y}" fill="none" stroke="${Bo}" stroke-width="3" stroke-linecap="round"/>`).join('')}
    ${brazo6('M46 122 C28 130 20 146 20 160', C, 16)}${brazo6('M154 122 C172 130 180 146 180 160', C, 16)}
    ${garras([[12, 164], [20, 167], [28, 164], [172, 164], [180, 167], [188, 164]], Cu)}
    <path d="M80 106 C76 86 82 68 90 56 L110 56 C118 68 124 86 120 106Z" fill="${C}" ${L4}/>
    <path d="M88 96 Q100 100 112 96 M90 80 Q100 84 110 80 M92 66 Q100 70 108 66" fill="none" stroke="${Bo}" stroke-width="2.5"/>
    ${[[66, 36, .55], [76, 22, .6], [124, 22, .6], [134, 36, .55], [58, 52, .45], [142, 52, .45]].map(([x, y, s]) => llamaG(x, y, s)).join('')}
    <path d="M70 26 C58 12 40 8 28 14 C40 18 48 26 54 38Z M130 26 C142 12 160 8 172 14 C160 18 152 26 146 38Z" fill="${Cu}" ${L4}/>
    <path d="M100 12 C132 12 148 30 148 52 C148 64 142 72 132 76 L68 76 C58 72 52 64 52 52 C52 30 68 12 100 12Z" fill="${C}" ${L4}/>
    <path d="M100 2 L108 16 L100 14 L92 16Z" fill="${Bo}" ${L3}/>
    ${envolverCara(`<path d="M70 62 C70 54 130 54 130 62 L128 84 C126 96 114 100 100 100 C86 100 74 96 72 84Z" fill="${C}" ${L4}/>
      <path d="M76 82 C88 90 112 90 124 82 C122 94 112 98 100 98 C88 98 78 94 76 82Z" fill="${B}" ${L3}/>
      <ellipse cx="90" cy="66" rx="3" ry="2" fill="${TK}"/><ellipse cx="110" cy="66" rx="3" ry="2" fill="${TK}"/>
      ${ojosPar(80, 120, 40, .92, o, true)}
      ${o.humor === 'feliz' ? `<path d="M82 76 Q100 92 118 76 Q100 84 82 76Z" fill="#7A1A10" ${L3}/><path d="M86 77 l3 6 l3 -5 M108 77 l3 5 l3 -6" fill="${Cu}" ${L3}/>` : `<path d="M84 78 Q100 84 116 78" fill="none" ${L3}/><path d="M88 78 l3 5 l3 -4 M106 78 l3 4 l3 -5" fill="${Cu}" ${L3}/>`}
      <path d="M60 34 L84 40 M140 34 L116 40" stroke="${D}" stroke-width="4" stroke-linecap="round"/>`, 100, 54, o)}</g>`;
};
