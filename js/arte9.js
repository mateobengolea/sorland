'use strict';
/* =====================================================================
   Los tres iniciales: cada etapa cambia de silueta, postura y rasgos.
   Carosor (bebé) → Carosaurio (dragón joven y feroz, de perfil) → Carotitán (dragón alado).
   Matesor (brotecito) → Matesaurio (dino de cuatro patas con placas de yerba) → Matetitán (tortuga ombú).
   Rufisor (yorkie) → Rufisaurio (perro de agua saltando) → Rufititán (lobo marino guardián, melena de ola).
   ===================================================================== */
const ARTE9 = {
  /* Carosaurio: flaco, alto, inclinado hacia adelante, hocico largo y cuerno hacia atrás */
  carosaurio: o => {
    const C = '#E24A2A', D = '#A8301A', B = '#FFD08A', Bo = '#E8A84A', Cu = '#FFF0D0';
    return `<g transform="translate(4 6) scale(.95)">
    <path d="M148 156 C178 156 194 134 188 104 C186 90 196 84 200 96 C206 126 194 176 148 182Z" fill="${C}" ${L4}/>
    ${llamaG(196, 90, 1.05)}
    ${brazo6('M134 112 C150 104 160 92 164 78', D, 11)}${garras([[160, 72], [166, 72], [170, 78]], Cu)}
    <path d="M124 170 C128 180 130 188 130 194 L160 194 C158 184 150 172 144 164Z" fill="${D}" ${L4}/>
    <path d="M112 96 C146 96 164 124 160 154 C156 178 136 188 112 186 C86 184 70 168 72 142 C74 116 88 96 112 96Z" fill="${C}" ${L4}/>
    ${[[150, 108], [160, 126], [164, 146], [160, 166]].map(([x, y]) => `<path d="M${x - 8} ${y - 6} L${x + 14} ${y - 10} L${x - 2} ${y + 8}Z" fill="${Cu}" ${L3}/>`).join('')}
    <path d="M96 110 C80 124 78 156 92 176 C104 182 118 172 118 150 C118 130 112 116 96 110Z" fill="${B}" ${L3}/>
    <path d="M86 132 Q100 136 116 130 M84 150 Q100 154 117 148 M88 166 Q100 170 112 164" fill="none" stroke="${Bo}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M84 168 C80 180 74 188 70 194 L100 194 C100 184 102 176 104 170Z" fill="${C}" ${L4}/>
    ${garras([[132, 194], [142, 195], [152, 194], [74, 194], [84, 195], [94, 194]], Cu)}
    ${brazo6('M94 124 C76 124 60 116 48 104', C, 12)}${garras([[42, 98], [40, 106], [44, 112]], Cu)}
    <path d="M94 88 C98 102 106 112 114 120 L138 108 C130 98 126 86 126 72Z" fill="${C}" ${L4}/>
    <path d="M110 38 C126 20 148 12 168 16 C154 22 140 32 128 46Z" fill="${Cu}" ${L4}/>
    <path d="M94 34 C98 18 108 8 120 8 C112 16 108 26 106 36Z" fill="${Cu}" ${L3}/>
    ${[[124, 54], [130, 70], [132, 86]].map(([x, y]) => `<path d="M${x - 4} ${y - 6} L${x + 12} ${y - 4} L${x} ${y + 6}Z" fill="${Cu}" ${L3}/>`).join('')}
    <path d="M100 30 C126 32 136 54 130 76 C126 92 110 100 92 100 L52 98 C36 98 24 90 26 80 C28 70 40 64 54 62 C58 42 76 30 100 30Z" fill="${C}" ${L4}/>
    ${envolverCara(`<path d="M28 86 C40 96 70 100 96 96 C88 104 48 104 32 96Z" fill="${B}" ${L3}/>
      <ellipse cx="34" cy="74" rx="3" ry="2" fill="${TK}"/>
      <ellipse cx="104" cy="72" rx="7" ry="4.5" fill="#FF8FAE" opacity=".6"/>
      ${ojosPar(66, 96, 56, .85, o, true)}${bocaCaricatura(54, 88, o, 11, true)}`, 80, 64, o)}</g>`;
  },
  /* Matesaurio: dino de cuatro patas, placas de hojas de yerba en el lomo y gorguera de hojas */
  matesaurio: o => {
    const C = '#5FAE5A', D = '#3E7E3B', B = '#D8F2B8', L = '#9BD36A', Ca = '#A8784A';
    const placa = (x, y, r, s) => `<path d="M0 0 C${-14 * s} ${-12 * s} ${-12 * s} ${-36 * s} 0 ${-46 * s} C${12 * s} ${-36 * s} ${14 * s} ${-12 * s} 0 0Z M0 ${-6 * s} V${-38 * s}" transform="translate(${x} ${y}) rotate(${r})" fill="${L}" ${L3}/>`;
    return `<g transform="translate(2 8) scale(.96)">
    <path d="M150 142 L156 186 L176 186 L172 140Z M70 146 L64 186 L84 186 L88 148Z" fill="${D}" ${L4}/>
    <path d="M166 128 C186 120 196 104 198 88 C206 110 198 140 176 152Z" fill="${C}" ${L4}/>
    <path d="M196 86 L206 74 L200 92Z M200 100 L212 96 L202 108Z" fill="${L}" ${L3}/>
    ${placa(78, 100, -30, 1)}${placa(102, 92, -10, 1.2)}${placa(128, 92, 8, 1.25)}${placa(152, 100, 26, 1.05)}${placa(172, 116, 44, .8)}
    <path d="M110 92 C160 92 180 118 176 142 C172 164 148 172 110 172 C74 172 50 164 46 142 C42 118 60 92 110 92Z" fill="${C}" ${L4}/>
    <path d="M58 150 C80 168 140 170 166 152 C150 172 74 174 58 150Z" fill="${B}"/>
    ${[[92, 118], [118, 112], [142, 120], [104, 140], [132, 142]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${D}" opacity=".45"/>`).join('')}
    <path d="M128 152 L124 190 L146 190 L150 152Z M80 154 L76 190 L98 190 L100 156Z" fill="${C}" ${L4}/>
    ${garras([[80, 190], [88, 191], [94, 190], [128, 190], [136, 191], [142, 190]])}
    <path d="M62 112 C48 96 50 74 62 64 C70 84 78 96 90 104Z" fill="${C}" ${L4}/>
    ${[-70, -40, -10, 20].map((r, i) => `<path d="M0 0 C-8 -8 -6 -22 0 -28 C6 -22 8 -8 0 0Z" transform="translate(60 ${96 - i * 4}) rotate(${r})" fill="${L}" ${L3}/>`).join('')}
    <path d="M42 62 C68 62 80 80 78 100 C76 120 60 130 42 130 C20 130 6 118 6 100 C6 80 18 62 42 62Z" fill="${C}" ${L4}/>
    <path d="M36 62 C34 46 40 36 48 34 M48 50 C58 40 70 40 76 46 M34 54 C24 44 14 44 10 50" fill="none" stroke="${D}" stroke-width="3" stroke-linecap="round"/>
    ${hojaA(48, 36, 10, .8, L)}${hojaA(76, 48, 50, .7, L)}${hojaA(10, 52, -50, .7, L)}
    ${envolverCara(`<path d="M10 108 C18 124 48 128 66 118 C58 132 22 132 10 108Z" fill="${B}" ${L3}/>
      <ellipse cx="14" cy="104" rx="6" ry="4" fill="#FF8FAE" opacity=".6"/><ellipse cx="68" cy="104" rx="6" ry="4" fill="#FF8FAE" opacity=".6"/>
      ${ojosPar(28, 56, 94, .78, o, true)}${bocaCaricatura(42, 112, o, 9, false)}`, 42, 96, o)}</g>`;
  },
  /* Rufisaurio: perro de agua de cuatro patas en pleno salto, crin de ola y cola de aleta */
  rufisaurio: o => {
    const A = '#3E86D0', Ao = '#2A63A8', K = '#E2AE6C', Ko = '#C98A47', Ag = '#8FD3F7', W = '#E6F6FF', H = '#F6D7A6';
    return `
    <path d="M20 182 C40 170 60 186 84 176 C108 166 128 186 156 176 C170 172 184 178 196 184" fill="none" stroke="${Ag}" stroke-width="6" stroke-linecap="round"/>
    ${[[50, 166], [70, 156], [120, 160], [146, 150]].map(([x, y]) => `<path d="M${x} ${y} q-5 -10 0 -16 q5 6 0 16Z" fill="${Ag}" ${L3}/>`).join('')}
    ${brazo6('M136 132 C150 146 164 154 182 158', Ko, 12)}${brazo6('M78 124 C64 136 46 140 28 138', Ko, 12)}
    <path d="M160 108 C180 110 192 98 196 84 C202 102 196 120 180 128 C190 132 196 142 194 152 C180 146 168 136 158 126Z" fill="${A}" ${L4}/>
    <path d="M62 98 C82 80 140 80 160 98 C176 114 168 136 146 140 C120 144 84 140 66 132 C50 124 48 110 62 98Z" fill="${K}" ${L4}/>
    <path d="M74 128 C96 138 130 140 152 134" fill="none" stroke="${H}" stroke-width="8" stroke-linecap="round"/>
    <path d="M64 92 C80 64 120 62 150 74 C170 82 184 74 194 60 C196 80 184 98 162 102 C140 92 100 90 70 106Z" fill="${A}" ${L4}/>
    <path d="M90 78 C110 70 134 72 150 80 M166 88 C176 86 184 80 190 72" fill="none" stroke="${Ag}" stroke-width="4" stroke-linecap="round"/>
    ${brazo6('M140 128 C150 144 160 156 174 168', K, 12)}${brazo6('M82 120 C68 128 52 130 36 128', K, 12)}
    <path d="M22 122 C18 116 22 108 30 110 L40 130 C32 134 24 130 22 122Z M168 168 C170 176 180 180 186 174 L178 160Z" fill="${Ag}" ${L3}/>
    <path d="M34 50 L16 8 C34 14 48 28 52 40Z M70 44 L90 6 C74 12 62 26 58 38Z" fill="${Ag}" ${L4}/>
    <path d="M54 36 C84 36 96 56 94 78 C92 98 76 110 54 110 C32 110 16 98 14 78 C12 56 26 36 54 36Z" fill="${K}" ${L4}/>
    <path d="M18 70 C22 46 42 38 54 40 C66 38 86 46 90 70 C80 60 68 58 56 62 C44 58 30 60 18 70Z" fill="${A}" ${L3}/>
    <path d="M56 40 C52 28 56 20 62 16 C66 26 64 34 58 42Z" fill="${Ag}" ${L3}/>
    ${envolverCara(`<path d="M36 82 C52 82 60 90 58 98 C56 106 48 110 36 110 C24 110 14 106 14 98 C14 88 22 82 36 82Z" fill="${H}" ${L3}/>
      <ellipse cx="22" cy="88" rx="6" ry="4.5" fill="${TK}"/>
      <ellipse cx="78" cy="88" rx="6" ry="4" fill="#FF8FAE" opacity=".6"/>
      ${ojosPar(40, 68, 68, .82, o, true)}${bocaCaricatura(38, 100, o, 9, true)}`, 54, 74, o)}`;
  },
  /* Rufititán: lobo marino guardián sentado, melena de ola rompiendo, placas de aleta y cola de ballena */
  rufititan: o => {
    const A = '#2A63A8', Ao = '#1E4A84', K = '#D69A55', Ko = '#B07A3A', Ag = '#8FD3F7', W = '#E6F6FF', H = '#F6D7A6';
    return `<g transform="translate(10 16) scale(.9)">
    ${[[18, 40, 7], [184, 30, 6], [10, 120, 5], [192, 110, 5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${Ag}" ${L3}/><circle cx="${x - r * .35}" cy="${y - r * .35}" r="${r * .3}" fill="#fff"/>`).join('')}
    <path d="M30 130 C-4 90 8 20 70 4 C60 22 66 36 80 42 C88 14 128 -4 160 14 C144 22 140 38 150 48 C178 34 206 58 198 96 C186 86 172 88 168 100 C192 110 196 138 172 152 L36 152Z" fill="${Ag}" ${L4}/>
    <path d="M40 92 C34 70 44 48 62 40 M160 58 C176 62 184 74 182 84 M110 22 C126 18 140 22 146 30" fill="none" stroke="${W}" stroke-width="5" stroke-linecap="round"/>
    ${[[30, 70], [62, 34], [170, 74], [146, 40]].map(([x, y]) => `<path d="M${x} ${y} a7 7 0 1 1 10 6" fill="none" stroke="${W}" stroke-width="3" stroke-linecap="round"/>`).join('')}
    <path d="M150 166 C182 168 196 150 192 128 C202 120 204 104 196 98 C192 110 184 114 176 112 C182 120 182 134 174 142 C168 150 158 152 150 150Z" fill="${A}" ${L4}/>
    <ellipse cx="46" cy="162" rx="26" ry="22" fill="${A}" ${L4}/><ellipse cx="154" cy="162" rx="26" ry="22" fill="${A}" ${L4}/>
    <path d="M100 74 C144 74 164 110 160 148 C156 176 134 188 100 188 C66 188 44 176 40 148 C36 110 56 74 100 74Z" fill="${A}" ${L4}/>
    <path d="M100 100 C122 100 136 118 134 148 L66 148 C64 118 78 100 100 100Z" fill="${H}" ${L3}/>
    ${[112, 126, 140].map(y => `<path d="M${78 + (y - 112) * .1} ${y} L100 ${y + 9} L${122 - (y - 112) * .1} ${y}" fill="none" stroke="${Ko}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}
    <path d="M66 140 C66 160 64 174 64 186 L94 186 C92 172 92 160 92 146Z M134 140 C134 160 136 174 136 186 L106 186 C108 172 108 160 108 146Z" fill="${A}" ${L4}/>
    <path d="M60 190 C58 180 98 180 98 190Z M102 190 C102 180 142 180 140 190Z" fill="${K}" ${L3}/>
    ${garras([[70, 190], [79, 191], [88, 190], [112, 190], [121, 191], [130, 190]])}
    <path d="M52 64 C40 92 42 116 52 130 C58 114 62 100 68 88Z M148 64 C160 92 158 116 148 130 C142 114 138 100 132 88Z" fill="${A}" ${L4}/>
    <path d="M62 40 L42 -4 C62 2 76 18 80 32Z M138 40 L158 -4 C138 2 124 18 120 32Z" fill="${Ag}" ${L4}/>
    <path d="M100 26 C94 8 100 -4 110 -6 C114 8 112 18 106 28Z" fill="${Ag}" ${L3}/>
    <path d="M100 22 C138 22 154 46 152 72 C150 94 130 106 100 106 C70 106 50 94 48 72 C46 46 62 22 100 22Z" fill="${A}" ${L4}/>
    <path d="M56 70 C62 50 82 44 100 48 C118 44 138 50 144 70 C130 62 116 62 100 68 C84 62 70 62 56 70Z" fill="${K}" ${L3}/>
    ${envolverCara(`<path d="M100 72 C120 72 130 84 128 98 C126 110 114 116 100 116 C86 116 74 110 72 98 C70 84 80 72 100 72Z" fill="${H}" ${L3}/>
      <ellipse cx="100" cy="80" rx="8" ry="5.5" fill="${TK}"/><ellipse cx="97" cy="78.5" rx="2.4" ry="1.5" fill="#fff" opacity=".8"/>
      <ellipse cx="64" cy="84" rx="7" ry="4.5" fill="#FF8FAE" opacity=".5"/><ellipse cx="136" cy="84" rx="7" ry="4.5" fill="#FF8FAE" opacity=".5"/>
      ${ojosPar(78, 122, 60, .95, o, true)}${bocaCaricatura(100, 100, o, 12, true)}`, 100, 70, o)}</g>`;
  },
};
Object.assign(INICIALES_V2, ARTE9);
