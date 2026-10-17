'use strict';
/* Evoluciones rediseñadas (3): Carosaurio, Rufisaurio y Morro. */
const ARTE8 = {
  /* Carosaurio: dragón adolescente, cuello largo, cresta de fuego, púas y alitas */
  carosaurio: o => {
    const C = '#E8622E', D = '#B84418', B = '#FFD98A', Cu = '#FFF0D0', W = '#F2A07A';
    return `<g transform="translate(6 12) scale(.93)">
    <path d="M124 150 C156 158 182 146 190 118 C194 104 204 110 200 126 C192 166 158 184 120 176Z" fill="${C}" ${L4}/>
    ${llamaG(198, 108, 1)}
    <path d="M66 82 C40 56 20 62 18 84 C30 82 34 92 44 90 C42 100 52 104 60 98Z M134 82 C160 56 180 62 182 84 C170 82 166 92 156 90 C158 100 148 104 140 98Z" fill="${W}" ${L4}/>
    <path d="M72 158 C68 170 64 180 60 190 L90 190 C90 180 90 170 92 162Z M108 162 C110 170 110 180 110 190 L140 190 C136 180 132 170 128 158Z" fill="${D}" ${L4}/>
    ${garras([[66, 190], [76, 191], [84, 190], [116, 190], [126, 191], [134, 190]], Cu)}
    <path d="M100 84 C134 84 150 110 148 140 C146 166 126 180 100 180 C74 180 54 166 52 140 C50 110 66 84 100 84Z" fill="${C}" ${L4}/>
    <path d="M100 96 C118 96 128 116 126 140 C124 160 114 174 100 174 C86 174 76 160 74 140 C72 116 82 96 100 96Z" fill="${B}" ${L3}/>
    <path d="M82 116 Q100 122 118 116 M80 134 Q100 140 120 134 M82 152 Q100 158 118 152" fill="none" stroke="#E8B860" stroke-width="2.5" stroke-linecap="round"/>
    ${brazo6('M56 112 C40 118 32 130 30 142', C, 13)}${brazo6('M144 112 C160 118 168 130 170 142', C, 13)}
    ${garras([[24, 146], [32, 148], [38, 146], [162, 146], [168, 148], [176, 146]], Cu)}
    <path d="M84 92 C82 74 86 62 92 54 L108 54 C114 62 118 74 116 92Z" fill="${C}" ${L4}/>
    <path d="M92 60 L84 50 L96 54Z M108 60 L116 50 L104 54Z" fill="${Cu}" ${L3}/>
    <path d="M62 30 C54 14 58 0 68 -2 C70 12 76 20 84 24Z M138 30 C146 14 142 0 132 -2 C130 12 124 20 116 24Z" fill="${Cu}" ${L3}/>
    ${llamaG(86, 10, .45)}${llamaG(100, 4, .6)}${llamaG(114, 10, .45)}
    <path d="M100 14 C136 14 152 34 150 58 C148 80 130 92 100 92 C70 92 52 80 50 58 C48 34 64 14 100 14Z" fill="${C}" ${L4}/>
    ${envolverCara(`<path d="M100 60 C126 60 140 68 138 80 C136 90 122 94 100 94 C78 94 64 90 62 80 C60 68 74 60 100 60Z" fill="${B}" ${L3}/>
      <ellipse cx="91" cy="68" rx="2.6" ry="1.9" fill="${TK}"/><ellipse cx="109" cy="68" rx="2.6" ry="1.9" fill="${TK}"/>
      <ellipse cx="60" cy="62" rx="7" ry="4.5" fill="#FF8FAE" opacity=".7"/><ellipse cx="140" cy="62" rx="7" ry="4.5" fill="#FF8FAE" opacity=".7"/>
      ${ojosPar(78, 122, 44, 1, o, true)}${bocaCaricatura(100, 80, o, 12, true)}`, 100, 56, o)}</g>`;
  },
  /* Rufisaurio: perro de agua erguido, pelo largo como ola, aleta en la cabeza y collar de burbujas */
  rufisaurio: o => {
    const A = '#3E86D0', Ao = '#2A63A8', K = '#E2AE6C', Ko = '#C98A47', Ag = '#8FD3F7', W = '#E6F6FF';
    return `
    <path d="M136 150 C164 152 182 136 184 112 L198 100 L194 126 C190 156 166 172 136 170Z" fill="${A}" ${L4}/>
    <path d="M184 112 C190 98 200 96 204 104" fill="none" stroke="${Ag}" stroke-width="4" stroke-linecap="round"/>
    <path d="M74 160 C70 172 66 182 62 190 L92 190 C92 180 92 172 94 164Z M106 164 C108 172 108 182 108 190 L138 190 C134 182 130 172 126 160Z" fill="${K}" ${L4}/>
    ${garras([[68, 190], [78, 191], [86, 190], [114, 190], [124, 191], [132, 190]])}
    <path d="M56 80 C30 110 26 150 44 176 C54 166 60 170 66 160 C72 172 82 168 86 158Z M144 80 C170 110 174 150 156 176 C146 166 140 170 134 160 C128 172 118 168 114 158Z" fill="${A}" ${L4}/>
    <path d="M44 120 Q52 140 46 160 M156 120 Q148 140 154 160" fill="none" stroke="${Ao}" stroke-width="2.5" opacity=".8"/>
    <path d="M100 90 C130 90 144 116 142 142 C140 164 124 178 100 178 C76 178 60 164 58 142 C56 116 70 90 100 90Z" fill="${K}" ${L4}/>
    <path d="M100 108 C116 108 124 124 122 144 C120 160 112 170 100 170 C88 170 80 160 78 144 C76 124 84 108 100 108Z" fill="#F6D7A6"/>
    ${brazo6('M62 116 C46 122 40 136 40 148', K, 13)}${brazo6('M138 116 C154 122 160 136 160 148', K, 13)}
    ${[[70, 96], [84, 100], [100, 102], [116, 100], [130, 96]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="${W}" ${L3}/>`).join('')}
    <path d="M100 22 C92 6 98 -4 108 -6 C112 6 112 16 106 24Z" fill="${Ag}" ${L3}/>
    <path d="M56 50 L36 10 C54 14 68 28 76 40Z M144 50 L164 10 C146 14 132 28 124 40Z" fill="${Ag}" ${L3}/>
    <path d="M100 20 C136 20 154 42 152 70 C150 94 130 108 100 108 C70 108 50 94 48 70 C46 42 64 20 100 20Z" fill="${K}" ${L4}/>
    <path d="M54 62 C58 34 82 24 100 26 C118 24 142 34 146 62 C134 48 118 46 100 52 C82 46 66 48 54 62Z" fill="${A}" ${L3}/>
    <path d="M50 70 C44 96 50 114 62 122 C60 106 62 94 66 86Z M150 70 C156 96 150 114 138 122 C140 106 138 94 134 86Z" fill="${Ko}" ${L3}/>
    ${envolverCara(`<path d="M100 78 C118 78 128 86 126 96 C124 104 114 108 100 108 C86 108 76 104 74 96 C72 86 82 78 100 78Z" fill="#F6D7A6" ${L3}/>
      <ellipse cx="100" cy="83" rx="7" ry="5" fill="${TK}"/><ellipse cx="98" cy="81.5" rx="2.2" ry="1.4" fill="#fff" opacity=".8"/>
      <ellipse cx="64" cy="80" rx="7" ry="4.5" fill="#FF8FAE" opacity=".6"/><ellipse cx="136" cy="80" rx="7" ry="4.5" fill="#FF8FAE" opacity=".6"/>
      ${ojosPar(80, 120, 64, 1, o, true)}${bocaCaricatura(100, 94, o, 10, true)}`, 100, 72, o)}`;
  },
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
