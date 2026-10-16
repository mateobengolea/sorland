'use strict';
/* ======================= Dibujo de las criaturas ======================= */
const COL = {
  carosor:{main:'#F47A45',osc:'#D85A2A',panza:'#FFD98A'},
  matesor:{main:'#72C25B',osc:'#4FA03C',panza:'#E5F5C6'},
  rufisor:{main:'#4EA8E3',osc:'#2E86C4',panza:'#D6EFFF'},
};
function cuerpoInicial(esp, o = {}){
  const c = COL[esp], T = '#22304A';
  const humor = o.humor || 'bien';
  let atras = '', cabeza = '', cola = '';
  if(esp === 'carosor'){
    cola = `<path d="M60 160 Q30 162 22 140" fill="none" stroke="${T}" stroke-width="18" stroke-linecap="round"/>
            <path d="M60 160 Q30 162 22 140" fill="none" stroke="${c.main}" stroke-width="11" stroke-linecap="round"/>
            <g class="llama"><path d="M16 136 C2 122 12 104 18 96 C20 108 30 110 28 124 C27 132 22 138 16 136Z" fill="#FF9F2E" stroke="${T}" stroke-width="3"/>
            <path d="M17 132 C11 124 15 114 18 110 C20 118 25 120 23 127 C22 131 20 133 17 132Z" fill="#FFE36B"/></g>`;
    cabeza = `<path d="M74 48 L80 28 L90 44Z" fill="#FFD98A" stroke="${T}" stroke-width="3.5" stroke-linejoin="round"/>
              <path d="M110 44 L120 28 L126 48Z" fill="#FFD98A" stroke="${T}" stroke-width="3.5" stroke-linejoin="round"/>`;
  } else if(esp === 'matesor'){
    cola = `<ellipse cx="50" cy="160" rx="18" ry="11" fill="${c.main}" stroke="${T}" stroke-width="3.5" transform="rotate(-20 50 160)"/>`;
    cabeza = `<path d="M100 42 Q99 30 102 20" fill="none" stroke="${T}" stroke-width="4" stroke-linecap="round"/>
              <path d="M101 24 C88 10 72 16 70 22 C82 30 94 30 101 24Z" fill="#9BDB6E" stroke="${T}" stroke-width="3"/>
              <path d="M102 22 C110 6 128 8 132 14 C122 24 110 26 102 22Z" fill="#9BDB6E" stroke="${T}" stroke-width="3"/>`;
    atras = `<circle cx="66" cy="128" r="6" fill="${c.osc}"/><circle cx="138" cy="122" r="5" fill="${c.osc}"/><circle cx="142" cy="150" r="4" fill="${c.osc}"/>`;
  } else {
    cola = `<path d="M58 162 Q34 168 26 156" fill="none" stroke="${T}" stroke-width="16" stroke-linecap="round"/>
            <path d="M58 162 Q34 168 26 156" fill="none" stroke="${c.main}" stroke-width="9" stroke-linecap="round"/>
            <path d="M28 158 L6 140 L12 162 L4 178 Z" fill="#8FD3F7" stroke="${T}" stroke-width="3" stroke-linejoin="round"/>`;
    cabeza = `<path d="M70 52 Q74 30 86 40 Q90 22 102 36 Q110 18 120 38 Q132 30 130 52Z" fill="#8FD3F7" stroke="${T}" stroke-width="3.5" stroke-linejoin="round"/>`;
  }
  let ojos, boca, cejas = '';
  if(o.dormido){
    ojos = `<path d="M74 82 Q82 88 90 82" fill="none" stroke="${T}" stroke-width="3.5" stroke-linecap="round"/><path d="M110 82 Q118 88 126 82" fill="none" stroke="${T}" stroke-width="3.5" stroke-linecap="round"/>`;
    boca = `<ellipse cx="100" cy="102" rx="4" ry="3" fill="${T}"/>`;
  } else {
    const oy = humor === 'mal' ? 84 : 80;
    ojos = `<ellipse cx="82" cy="${oy}" rx="6.5" ry="8.5" fill="${T}"/><circle cx="84.5" cy="${oy-3}" r="2.4" fill="#fff"/>
            <ellipse cx="118" cy="${oy}" rx="6.5" ry="8.5" fill="${T}"/><circle cx="120.5" cy="${oy-3}" r="2.4" fill="#fff"/>`;
    if(humor === 'feliz') boca = `<path d="M88 97 Q100 114 112 97 Z" fill="#B8364F" stroke="${T}" stroke-width="3" stroke-linejoin="round"/>`;
    else if(humor === 'bien') boca = `<path d="M89 99 Q100 108 111 99" fill="none" stroke="${T}" stroke-width="3.5" stroke-linecap="round"/>`;
    else { boca = `<path d="M90 106 Q100 97 110 106" fill="none" stroke="${T}" stroke-width="3.5" stroke-linecap="round"/>`;
      cejas = `<path d="M72 70 L88 74" stroke="${T}" stroke-width="3" stroke-linecap="round"/><path d="M128 70 L112 74" stroke="${T}" stroke-width="3" stroke-linecap="round"/>`; }
  }
  const suc = o.sucio || 0;
  const manchas = suc > .05 ? `<g opacity="${Math.min(.85,suc)}" fill="#8A6440"><ellipse cx="70" cy="150" rx="9" ry="6"/><ellipse cx="128" cy="160" rx="10" ry="6"/><ellipse cx="118" cy="62" rx="7" ry="5"/><ellipse cx="80" cy="112" rx="6" ry="4"/></g>` : '';
  return `<g class="cuerpo">
      ${cola}
      <ellipse cx="76" cy="178" rx="17" ry="10" fill="${c.osc}" stroke="${T}" stroke-width="3.5"/>
      <ellipse cx="124" cy="178" rx="17" ry="10" fill="${c.osc}" stroke="${T}" stroke-width="3.5"/>
      <ellipse cx="100" cy="140" rx="52" ry="42" fill="${c.main}" stroke="${T}" stroke-width="4"/>
      ${atras}
      <ellipse cx="100" cy="148" rx="31" ry="27" fill="${c.panza}"/>
      <ellipse cx="52" cy="136" rx="9" ry="14" fill="${c.main}" stroke="${T}" stroke-width="3.5" transform="rotate(30 52 136)"/>
      <ellipse cx="148" cy="136" rx="9" ry="14" fill="${c.main}" stroke="${T}" stroke-width="3.5" transform="rotate(-30 148 136)"/>
      ${cabeza}
      <ellipse cx="100" cy="82" rx="50" ry="42" fill="${c.main}" stroke="${T}" stroke-width="4"/>
      <ellipse cx="68" cy="96" rx="8" ry="5" fill="#FF8FAE" opacity=".8"/>
      <ellipse cx="132" cy="96" rx="8" ry="5" fill="#FF8FAE" opacity=".8"/>
      ${cejas}${ojos}${boca}${manchas}
    </g>`;
}


/* ---------------- Dibujos de especies salvajes ---------------- */
const TINTA = '#22304A';
function carita(cx, cy, o = {}){
  const s = o.esc || 1, dx = 17*s, T = TINTA;
  let ojos;
  if(o.dormido || o.chill){
    ojos = `<path d="M${cx-dx-7} ${cy} Q${cx-dx} ${cy+(o.chill?-4:5)} ${cx-dx+7} ${cy}" fill="none" stroke="${T}" stroke-width="3.5" stroke-linecap="round"/>
            <path d="M${cx+dx-7} ${cy} Q${cx+dx} ${cy+(o.chill?-4:5)} ${cx+dx+7} ${cy}" fill="none" stroke="${T}" stroke-width="3.5" stroke-linecap="round"/>`;
    if(o.chill) ojos += `<path d="M${cx-dx-7} ${cy} h14 M${cx+dx-7} ${cy} h14" stroke="${T}" stroke-width="3.5" stroke-linecap="round"/>`;
  } else {
    ojos = `<ellipse cx="${cx-dx}" cy="${cy}" rx="${6*s}" ry="${8*s}" fill="${T}"/><circle cx="${cx-dx+2.5*s}" cy="${cy-3*s}" r="${2.3*s}" fill="#fff"/>
            <ellipse cx="${cx+dx}" cy="${cy}" rx="${6*s}" ry="${8*s}" fill="${T}"/><circle cx="${cx+dx+2.5*s}" cy="${cy-3*s}" r="${2.3*s}" fill="#fff"/>`;
  }
  const my = cy + 17*s;
  const boca = o.enojo
    ? `<path d="M${cx-8} ${my+4} Q${cx} ${my-4} ${cx+8} ${my+4}" fill="none" stroke="${T}" stroke-width="3.5" stroke-linecap="round"/>`
    : `<path d="M${cx-9} ${my} Q${cx} ${my+9} ${cx+9} ${my}" fill="none" stroke="${T}" stroke-width="3.5" stroke-linecap="round"/>`;
  const mejillas = o.sinMejillas ? '' : `<ellipse cx="${cx-dx-12*s}" cy="${cy+12*s}" rx="${7*s}" ry="${4.5*s}" fill="#FF8FAE" opacity=".75"/><ellipse cx="${cx+dx+12*s}" cy="${cy+12*s}" rx="${7*s}" ry="${4.5*s}" fill="#FF8FAE" opacity=".75"/>`;
  return mejillas + ojos + (o.sinBoca ? '' : boca);
}
const SOMBRA = `<ellipse cx="100" cy="188" rx="54" ry="8" fill="rgba(34,48,74,.16)"/>`;
const sw = 'stroke="#22304A" stroke-width="4"';
const sw3 = 'stroke="#22304A" stroke-width="3.5"';

const DIBUJOS = {
  pampito: o => `
    <ellipse cx="148" cy="150" rx="16" ry="12" fill="#EFE3CC" ${sw3}/>
    <ellipse cx="80" cy="178" rx="15" ry="9" fill="#B79D78" ${sw3}/><ellipse cx="120" cy="178" rx="15" ry="9" fill="#B79D78" ${sw3}/>
    <ellipse cx="100" cy="142" rx="46" ry="38" fill="#D9C3A0" ${sw}/>
    <ellipse cx="100" cy="150" rx="27" ry="24" fill="#F4E8D2"/>
    <ellipse cx="76" cy="46" rx="11" ry="34" fill="#D9C3A0" ${sw3} transform="rotate(-14 76 46)"/>
    <ellipse cx="76" cy="50" rx="5" ry="24" fill="#F5B9C6" transform="rotate(-14 76 50)"/>
    <ellipse cx="124" cy="46" rx="11" ry="34" fill="#D9C3A0" ${sw3} transform="rotate(14 124 46)"/>
    <ellipse cx="124" cy="50" rx="5" ry="24" fill="#F5B9C6" transform="rotate(14 124 50)"/>
    <ellipse cx="100" cy="92" rx="45" ry="37" fill="#D9C3A0" ${sw}/>
    <path d="M66 98 Q100 86 134 98 L134 108 Q100 96 66 108Z" fill="#3B3A3A" opacity=".85"/>
    <path d="M72 103 Q100 94 128 103" fill="none" stroke="#fff" stroke-width="3" opacity=".8"/>
    ${carita(100, 82, o)}
    <path d="M58 108 h-18 M58 114 h-16 M142 108 h18 M142 114 h16" stroke="${TINTA}" stroke-width="2" stroke-linecap="round"/>`,

  hornerito: o => `
    <path d="M150 122 L184 104 L176 128 L188 140 L152 140Z" fill="#9C5A2C" ${sw3} stroke-linejoin="round"/>
    <path d="M86 176 v10 M80 186 h12 M114 176 v10 M108 186 h12" stroke="#E59A3B" stroke-width="4" stroke-linecap="round"/>
    <circle cx="100" cy="118" r="60" fill="#C9783F" ${sw}/>
    <ellipse cx="100" cy="140" rx="36" ry="32" fill="#F2D7B5"/>
    <ellipse cx="50" cy="128" rx="14" ry="26" fill="#A9612F" ${sw3} transform="rotate(16 50 128)"/>
    <path d="M90 60 Q96 40 108 50 Q104 58 100 60" fill="#C9783F" ${sw3}/>
    <path d="M70 92 Q100 82 130 92" fill="none" stroke="#F2D7B5" stroke-width="7" stroke-linecap="round"/>
    ${carita(100, 100, {...o, sinBoca:true})}
    <path d="M90 116 L112 116 L100 130Z" fill="#F0A93B" ${sw3} stroke-linejoin="round"/>`,

  chispulo: o => `
    <circle class="brillo" cx="100" cy="150" r="46" fill="#FFF3A0" opacity=".55"/>
    <ellipse cx="58" cy="108" rx="26" ry="16" fill="#DCEEFF" opacity=".85" ${sw3} transform="rotate(-25 58 108)"/>
    <ellipse cx="142" cy="108" rx="26" ry="16" fill="#DCEEFF" opacity=".85" ${sw3} transform="rotate(25 142 108)"/>
    <ellipse cx="100" cy="150" rx="34" ry="30" fill="#FFE45C" ${sw}/>
    <path d="M70 140 Q100 150 130 140 M72 156 Q100 166 128 156" fill="none" stroke="#E0B820" stroke-width="3"/>
    <path d="M84 52 Q76 28 64 26 M116 52 Q124 28 136 26" fill="none" stroke="${TINTA}" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="63" cy="25" r="7" fill="#FFE45C" ${sw3}/><circle cx="137" cy="25" r="7" fill="#FFE45C" ${sw3}/>
    <circle cx="100" cy="88" r="40" fill="#4656A0" ${sw}/>
    ${carita(100, 84, {...o, sinMejillas:false})}`,

  ceibin: o => `
    <ellipse cx="80" cy="178" rx="15" ry="9" fill="#4E9A3F" ${sw3}/><ellipse cx="120" cy="178" rx="15" ry="9" fill="#4E9A3F" ${sw3}/>
    <path d="M56 136 C30 120 30 100 38 92 C50 104 58 116 62 132Z" fill="#7CC46A" ${sw3}/>
    <path d="M144 136 C170 120 170 100 162 92 C150 104 142 116 138 132Z" fill="#7CC46A" ${sw3}/>
    <ellipse cx="100" cy="144" rx="42" ry="38" fill="#79C266" ${sw}/>
    <ellipse cx="100" cy="152" rx="24" ry="22" fill="#D7F0C4"/>
    <g fill="#E63B4B" ${sw3}>
      <ellipse cx="70" cy="56" rx="14" ry="26" transform="rotate(-30 70 56)"/>
      <ellipse cx="130" cy="56" rx="14" ry="26" transform="rotate(30 130 56)"/>
      <ellipse cx="100" cy="42" rx="14" ry="28"/>
      <ellipse cx="84" cy="46" rx="12" ry="24" transform="rotate(-12 84 46)"/>
      <ellipse cx="116" cy="46" rx="12" ry="24" transform="rotate(12 116 46)"/>
    </g>
    <ellipse cx="100" cy="94" rx="42" ry="36" fill="#8AD27A" ${sw}/>
    ${carita(100, 92, o)}`,

  carpinchito: o => `
    <ellipse cx="72" cy="178" rx="15" ry="9" fill="#7E5434" ${sw3}/><ellipse cx="128" cy="178" rx="15" ry="9" fill="#7E5434" ${sw3}/>
    <ellipse cx="100" cy="138" rx="64" ry="44" fill="#A8784E" ${sw}/>
    <ellipse cx="100" cy="150" rx="36" ry="24" fill="#C79A6E"/>
    <circle cx="66" cy="58" r="10" fill="#8E6440" ${sw3}/><circle cx="134" cy="58" r="10" fill="#8E6440" ${sw3}/>
    <rect x="52" y="54" width="96" height="76" rx="38" fill="#A8784E" ${sw}/>
    <rect x="70" y="92" width="60" height="38" rx="18" fill="#8E6440" ${sw3}/>
    <ellipse cx="88" cy="104" rx="4" ry="3" fill="${TINTA}"/><ellipse cx="112" cy="104" rx="4" ry="3" fill="${TINTA}"/>
    <path d="M92 118 Q100 123 108 118" fill="none" stroke="${TINTA}" stroke-width="3" stroke-linecap="round"/>
    ${carita(100, 76, {...o, esc:.85, sinBoca:true})}
    <path d="M76 68 h14 M110 68 h14" stroke="${TINTA}" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="146" cy="36" r="10" fill="#FFC93C" ${sw3}/><path d="M154 36 l8 -2 l-8 6z" fill="#F08A2B"/><circle cx="148" cy="34" r="1.8" fill="${TINTA}"/>`,

  tatupiedra: o => `
    <ellipse cx="72" cy="178" rx="15" ry="9" fill="#C9A47E" ${sw3}/><ellipse cx="128" cy="178" rx="15" ry="9" fill="#C9A47E" ${sw3}/>
    <ellipse cx="100" cy="150" rx="46" ry="30" fill="#E7C9A5" ${sw}/>
    <path d="M30 140 C30 70 170 70 170 140 Q100 158 30 140Z" fill="#9AA3AE" ${sw}/>
    <path d="M52 96 Q100 108 148 96 M40 118 Q100 132 160 118" fill="none" stroke="${TINTA}" stroke-width="3"/>
    <path d="M76 84 l8 6 M108 80 l-6 8 M130 104 l6 6 M64 124 l8 -4" stroke="#6E7884" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="74" cy="118" rx="10" ry="8" fill="#E7C9A5" ${sw3}/><ellipse cx="126" cy="118" rx="10" ry="8" fill="#E7C9A5" ${sw3}/>
    <ellipse cx="100" cy="142" rx="30" ry="26" fill="#E7C9A5" ${sw}/>
    <ellipse cx="100" cy="160" rx="9" ry="6" fill="#C98F7A" ${sw3}/>
    ${carita(100, 136, {...o, esc:.8, sinBoca:true})}`,

  brasita: o => `
    <path d="M140 160 Q182 166 176 132 Q172 118 160 124" fill="none" stroke="${TINTA}" stroke-width="16" stroke-linecap="round"/>
    <path d="M140 160 Q182 166 176 132 Q172 118 160 124" fill="none" stroke="#E2492E" stroke-width="9" stroke-linecap="round"/>
    <ellipse cx="74" cy="178" rx="15" ry="9" fill="#B8331F" ${sw3}/><ellipse cx="126" cy="178" rx="15" ry="9" fill="#B8331F" ${sw3}/>
    <ellipse cx="100" cy="142" rx="46" ry="36" fill="#E2492E" ${sw}/>
    <ellipse cx="100" cy="150" rx="28" ry="24" fill="#FFB36B"/>
    <g class="llama-salvaje">
      <path d="M70 66 C62 50 70 38 76 32 C78 44 88 46 86 60Z" fill="#FFB02E" ${sw3}/>
      <path d="M92 58 C86 38 96 26 102 20 C104 34 114 36 110 56Z" fill="#FFD23F" ${sw3}/>
      <path d="M116 62 C112 48 122 38 128 34 C128 46 136 50 132 64Z" fill="#FFB02E" ${sw3}/>
    </g>
    <ellipse cx="100" cy="96" rx="44" ry="34" fill="#E2492E" ${sw}/>
    <circle cx="70" cy="128" r="5" fill="#FFD23F"/><circle cx="132" cy="134" r="4" fill="#FFD23F"/>
    ${carita(100, 92, o)}`,

  yaguarayo: o => `
    <path d="M144 158 Q186 150 180 112" fill="none" stroke="${TINTA}" stroke-width="16" stroke-linecap="round"/>
    <path d="M144 158 Q186 150 180 112" fill="none" stroke="#F2B63D" stroke-width="9" stroke-linecap="round"/>
    <ellipse cx="74" cy="178" rx="16" ry="10" fill="#E3A12B" ${sw3}/><ellipse cx="126" cy="178" rx="16" ry="10" fill="#E3A12B" ${sw3}/>
    <ellipse cx="100" cy="142" rx="48" ry="38" fill="#F2B63D" ${sw}/>
    <ellipse cx="100" cy="152" rx="26" ry="22" fill="#FFF0CF"/>
    <g fill="none" stroke="#7A4A1C" stroke-width="3.5">
      <circle cx="66" cy="132" r="7"/><circle cx="136" cy="128" r="7"/><circle cx="130" cy="160" r="5"/><circle cx="70" cy="160" r="5"/>
    </g>
    <circle cx="64" cy="58" r="15" fill="#F2B63D" ${sw3}/><circle cx="64" cy="58" r="7" fill="#7A4A1C"/>
    <circle cx="136" cy="58" r="15" fill="#F2B63D" ${sw3}/><circle cx="136" cy="58" r="7" fill="#7A4A1C"/>
    <ellipse cx="100" cy="92" rx="48" ry="40" fill="#F2B63D" ${sw}/>
    <path d="M100 52 L92 70 L102 70 L96 86 L112 64 L102 64 L108 52Z" fill="#FFF07A" ${sw3} stroke-linejoin="round"/>
    <ellipse cx="100" cy="112" rx="18" ry="12" fill="#FFF0CF"/>
    ${carita(100, 92, {...o, sinMejillas:true})}
    <path d="M30 70 l10 8 l-6 4 l12 10 M168 80 l-10 6 l6 4 l-12 10" fill="none" stroke="#FFD200" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`,
};



Object.assign(DIBUJOS, {
  morrito: o => `
    <ellipse cx="72" cy="180" rx="16" ry="9" fill="#7E8793" ${sw3}/><ellipse cx="128" cy="180" rx="16" ry="9" fill="#7E8793" ${sw3}/>
    <ellipse cx="44" cy="132" rx="14" ry="18" fill="#9AA3AE" ${sw3}/><ellipse cx="156" cy="132" rx="14" ry="18" fill="#9AA3AE" ${sw3}/>
    <path d="M40 150 C30 96 60 46 104 46 C150 46 172 96 160 150 C152 178 52 180 40 150Z" fill="#A9B1BC" ${sw}/>
    <path d="M62 66 C80 50 116 46 138 62 C124 70 110 60 96 70 C84 76 72 70 62 66Z" fill="#79B95F" ${sw3}/>
    <path d="M128 120 l10 10 l-4 10 M70 140 l-10 6" fill="none" stroke="#6E7884" stroke-width="3.5" stroke-linecap="round"/>
    <ellipse cx="80" cy="150" rx="8" ry="5" fill="#C3C9D1"/>
    ${carita(100, 104, o)}`,

  cardoncito: o => `
    <ellipse cx="82" cy="182" rx="14" ry="8" fill="#3F8A4A" ${sw3}/><ellipse cx="118" cy="182" rx="14" ry="8" fill="#3F8A4A" ${sw3}/>
    <path d="M60 130 h-18 a8 8 0 0 1 -8 -8 v-30 a10 10 0 0 1 20 0 v20 h8" fill="#5BAE5B" ${sw3} stroke-linejoin="round"/>
    <path d="M140 116 h18 a8 8 0 0 0 8 -8 v-24 a10 10 0 0 0 -20 0 v14 h-8" fill="#5BAE5B" ${sw3} stroke-linejoin="round"/>
    <rect x="58" y="44" width="84" height="140" rx="42" fill="#5BAE5B" ${sw}/>
    <path d="M80 56 v118 M100 46 v132 M120 56 v118" stroke="#3F8A4A" stroke-width="3" opacity=".7"/>
    <g fill="#F4F0D0">${[[72,70],[128,74],[70,150],[130,150],[110,160],[90,58]].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="2.4"/>`).join('')}</g>
    <g fill="#FF7FA3" ${sw3}><ellipse cx="100" cy="34" rx="7" ry="11"/><ellipse cx="90" cy="40" rx="9" ry="6" transform="rotate(-20 90 40)"/><ellipse cx="110" cy="40" rx="9" ry="6" transform="rotate(20 110 40)"/></g>
    <circle cx="100" cy="40" r="4" fill="#FFE45C"/>
    ${carita(100, 98, o)}`,

  condorcito: o => `
    <path d="M86 178 v10 M80 188 h12 M114 178 v10 M108 188 h12" stroke="#C9A47E" stroke-width="4" stroke-linecap="round"/>
    <path d="M52 110 C20 112 14 150 30 168 C40 150 52 140 60 138Z" fill="#2E323C" ${sw3} stroke-linejoin="round"/>
    <path d="M148 110 C180 112 186 150 170 168 C160 150 148 140 140 138Z" fill="#2E323C" ${sw3} stroke-linejoin="round"/>
    <ellipse cx="100" cy="138" rx="50" ry="46" fill="#3B3F4A" ${sw}/>
    <ellipse cx="100" cy="150" rx="26" ry="26" fill="#5A5F6B"/>
    <path d="M58 104 C70 90 80 100 88 92 C94 102 106 102 112 92 C120 100 130 90 142 104 C130 118 70 118 58 104Z" fill="#FFFFFF" ${sw3} stroke-linejoin="round"/>
    <ellipse cx="100" cy="70" rx="38" ry="34" fill="#D9A497" ${sw}/>
    <path d="M90 38 Q100 24 110 38" fill="#B5786C" ${sw3}/>
    ${carita(100, 66, {...o, sinBoca:true, esc:.85})}
    <path d="M92 84 Q100 80 108 84 Q110 98 100 102 Q104 92 92 88Z" fill="#E8D7A8" ${sw3} stroke-linejoin="round"/>`,

  bagrecito: o => `
    <path d="M150 128 L188 104 L182 136 L190 164 L150 146Z" fill="#5E7E9E" ${sw3} stroke-linejoin="round"/>
    <path d="M86 86 L100 54 L118 88Z" fill="#5E7E9E" ${sw3} stroke-linejoin="round"/>
    <ellipse cx="96" cy="132" rx="62" ry="46" fill="#7FA0C0" ${sw}/>
    <ellipse cx="96" cy="152" rx="40" ry="22" fill="#DCE8F2"/>
    <ellipse cx="60" cy="160" rx="14" ry="8" fill="#5E7E9E" ${sw3} transform="rotate(25 60 160)"/>
    <ellipse cx="134" cy="160" rx="14" ry="8" fill="#5E7E9E" ${sw3} transform="rotate(-25 134 160)"/>
    <path d="M76 132 Q40 130 30 160 M78 138 Q52 146 50 172 M116 132 Q152 130 160 156" fill="none" stroke="${TINTA}" stroke-width="3.5" stroke-linecap="round"/>
    ${carita(96, 112, {...o, sinBoca:true})}
    <path d="M78 134 Q96 146 114 134" fill="none" stroke="${TINTA}" stroke-width="4" stroke-linecap="round"/>`,

  nubarron: o => `
    <g class="lluvia" stroke="#5AB4E8" stroke-width="3.5" stroke-linecap="round"><path d="M60 158 l-4 12 M86 166 l-4 12 M140 160 l-4 12"/></g>
    <path d="M112 140 L98 168 L110 168 L100 192 L124 160 L112 160 L120 140Z" fill="#FFE45C" ${sw3} stroke-linejoin="round"/>
    <path d="M44 140 C22 140 18 108 42 104 C40 78 70 66 86 80 C94 54 136 54 142 84 C170 80 184 110 164 128 C176 144 160 156 146 146 C130 160 64 160 44 140Z" fill="#8A93B8" ${sw}/>
    <path d="M58 132 C74 142 130 144 146 132" fill="none" stroke="#6D769C" stroke-width="3"/>
    ${carita(100, 104, {...o, enojo: o.enojo || !o.humor || o.humor === 'bien'})}
    <path d="M72 88 L90 96 M128 88 L110 96" stroke="${TINTA}" stroke-width="3.5" stroke-linecap="round"/>`,

  zorrolumbre: o => `
    <g class="llama-salvaje" style="transform-origin:150px 150px">
      <path d="M140 160 C176 172 196 134 182 104 C176 120 166 116 168 96 C150 108 150 126 146 132 C142 124 138 120 132 118 C130 138 128 150 140 160Z" fill="#FF9F2E" ${sw3} stroke-linejoin="round"/>
      <path d="M146 152 C168 156 180 136 174 120 C168 130 162 128 162 118 C154 128 154 138 146 152Z" fill="#FFE36B"/>
    </g>
    <ellipse cx="76" cy="180" rx="14" ry="8" fill="#3B2A22" ${sw3}/><ellipse cx="122" cy="180" rx="14" ry="8" fill="#3B2A22" ${sw3}/>
    <ellipse cx="100" cy="144" rx="42" ry="36" fill="#E8743B" ${sw}/>
    <ellipse cx="100" cy="154" rx="24" ry="22" fill="#FFF3E2"/>
    <path d="M58 70 L54 22 L88 52Z" fill="#E8743B" ${sw3} stroke-linejoin="round"/><path d="M62 60 L60 34 L78 52Z" fill="#3B2A22"/>
    <path d="M142 70 L146 22 L112 52Z" fill="#E8743B" ${sw3} stroke-linejoin="round"/><path d="M138 60 L140 34 L122 52Z" fill="#3B2A22"/>
    <path d="M52 86 C52 52 148 52 148 86 C148 110 124 124 100 124 C76 124 52 110 52 86Z" fill="#E8743B" ${sw}/>
    <path d="M60 96 C70 120 90 122 100 112 C110 122 130 120 140 96 C126 104 112 102 100 108 C88 102 74 104 60 96Z" fill="#FFF3E2"/>
    <ellipse cx="100" cy="110" rx="6" ry="4" fill="${TINTA}"/>
    ${carita(100, 84, {...o, sinBoca:true, sinMejillas:true})}`,
});

function iconoObjeto(o, tam = 40){
  const T = '#22304A';
  if(o.captura){
    const [a, b] = o.colores;
    return `<svg viewBox="0 0 60 60" width="${tam}" height="${tam}" aria-hidden="true">
      <g transform="rotate(-30 30 30)">
        <path d="M10 30 a12 12 0 0 1 12 -12 h8 v24 h-8 a12 12 0 0 1 -12 -12z" fill="${a}" stroke="${T}" stroke-width="3"/>
        <path d="M30 18 h8 a12 12 0 0 1 0 24 h-8z" fill="${b}" stroke="${T}" stroke-width="3"/>
        <rect x="27" y="16" width="6" height="28" rx="2" fill="${T}"/>
        <ellipse cx="18" cy="25" rx="4" ry="2.5" fill="#fff" opacity=".6"/>
      </g></svg>`;
  }
  return `<svg viewBox="0 0 60 60" width="${tam}" height="${tam}" aria-hidden="true">
    <rect x="24" y="6" width="12" height="9" rx="2" fill="#E9E2D3" stroke="${T}" stroke-width="3"/>
    <path d="M22 15 h16 v6 c6 3 9 8 9 14 v13 a6 6 0 0 1 -6 6 h-22 a6 6 0 0 1 -6 -6 v-13 c0 -6 3 -11 9 -14z" fill="#fff" stroke="${T}" stroke-width="3"/>
    <path d="M14 36 h32 v12 a5 5 0 0 1 -5 5 h-22 a5 5 0 0 1 -5 -5z" fill="${o.colores[0]}"/>
    <path d="M26 41 h8 M30 37 v8" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>`;
}


function svgMedalla(m, tam = 64, apagada = false){
  const T = '#22304A';
  const formas = {
    penasco:`<polygon points="40,6 70,23 70,57 40,74 10,57 10,23" fill="${m.color}" stroke="${T}" stroke-width="4"/>
             <path d="M18 54 L32 30 L40 42 L48 26 L62 54Z" fill="${m.color2}" stroke="${T}" stroke-width="3" stroke-linejoin="round"/>
             <path d="M45 33 L48 26 L52 33Z" fill="#fff"/>`,
    camalote:`<path d="M40 6 C56 26 66 38 66 50 A26 26 0 0 1 14 50 C14 38 24 26 40 6Z" fill="${m.color}" stroke="${T}" stroke-width="4"/>
              <circle cx="40" cy="50" r="9" fill="${m.color2}" stroke="${T}" stroke-width="3"/>
              <g fill="#C9B6F2" stroke="${T}" stroke-width="2.5"><ellipse cx="40" cy="36" rx="5" ry="8"/><ellipse cx="28" cy="52" rx="8" ry="5"/><ellipse cx="52" cy="52" rx="8" ry="5"/></g>
              <circle cx="40" cy="50" r="4" fill="#FFD23F"/>`,
    relampago:`<polygon points="40,4 49,28 74,28 54,44 62,70 40,54 18,70 26,44 6,28 31,28" fill="${m.color2}" stroke="${T}" stroke-width="4" stroke-linejoin="round"/>
               <path d="M44 16 L32 42 L41 42 L35 62 L52 34 L43 34 L49 16Z" fill="${m.color}" stroke="${T}" stroke-width="2.5" stroke-linejoin="round"/>`,
    brasa:`<path d="M40 74 C20 74 12 58 16 44 C20 32 30 30 30 16 C42 24 44 34 42 40 C48 36 50 28 50 22 C64 34 68 48 64 58 C60 68 52 74 40 74Z" fill="${m.color}" stroke="${T}" stroke-width="4" stroke-linejoin="round"/>
           <path d="M40 66 C31 66 27 58 30 51 C32 46 37 44 38 38 C46 44 50 52 48 58 C46 63 44 66 40 66Z" fill="${m.color2}"/>`,
  };
  return `<svg viewBox="0 0 80 80" width="${tam}" height="${tam}" aria-hidden="true" style="${apagada ? 'filter:grayscale(1);opacity:.25' : ''}">${formas[m.id]}</svg>`;
}


/* =====================================================================
   Generador de criaturas: formas de cuerpo + rasgos.
   Cada especie nueva elige una forma, una paleta y una lista de rasgos.
   ===================================================================== */
const T_ = '#22304A';
const st = (w = 3.5) => `stroke="${T_}" stroke-width="${w}"`;

const FORMAS = {
  bipedo: c => ({
    cuerpo: `<ellipse cx="76" cy="178" rx="16" ry="9" fill="${c[1]}" ${st()}/><ellipse cx="124" cy="178" rx="16" ry="9" fill="${c[1]}" ${st()}/>
      <ellipse cx="100" cy="142" rx="46" ry="38" fill="${c[0]}" ${st(4)}/><ellipse cx="100" cy="150" rx="28" ry="24" fill="${c[2]}"/>
      <ellipse cx="54" cy="138" rx="9" ry="14" fill="${c[0]}" ${st()} transform="rotate(30 54 138)"/><ellipse cx="146" cy="138" rx="9" ry="14" fill="${c[0]}" ${st()} transform="rotate(-30 146 138)"/>`,
    cabeza: `<ellipse cx="100" cy="86" rx="46" ry="40" fill="${c[0]}" ${st(4)}/>`,
    cara: [100, 86, 1], a: {top: [100, 48], izq: [58, 70], der: [142, 70], cola: [146, 160], cuerpo: [100, 142], ancho: 46},
  }),
  redondo: c => ({
    cuerpo: `<ellipse cx="78" cy="180" rx="14" ry="8" fill="${c[1]}" ${st()}/><ellipse cx="122" cy="180" rx="14" ry="8" fill="${c[1]}" ${st()}/>`,
    cabeza: `<ellipse cx="100" cy="122" rx="62" ry="58" fill="${c[0]}" ${st(4)}/><ellipse cx="100" cy="146" rx="36" ry="26" fill="${c[2]}"/>`,
    cara: [100, 108, 1], a: {top: [100, 66], izq: [46, 92], der: [154, 92], cola: [160, 150], cuerpo: [100, 140], ancho: 58},
  }),
  cuadrupedo: c => ({
    cuerpo: `<ellipse cx="146" cy="176" rx="11" ry="9" fill="${c[1]}" ${st()}/><ellipse cx="166" cy="168" rx="10" ry="8" fill="${c[1]}" ${st()}/>
      <ellipse cx="122" cy="138" rx="58" ry="34" fill="${c[0]}" ${st(4)}/><ellipse cx="118" cy="152" rx="36" ry="15" fill="${c[2]}"/>
      <ellipse cx="88" cy="178" rx="12" ry="9" fill="${c[1]}" ${st()}/><ellipse cx="112" cy="180" rx="12" ry="9" fill="${c[1]}" ${st()}/>`,
    cabeza: `<circle cx="72" cy="98" r="38" fill="${c[0]}" ${st(4)}/><ellipse cx="66" cy="116" rx="18" ry="12" fill="${c[2]}" ${st(3)}/><ellipse cx="66" cy="110" rx="5" ry="3.5" fill="${T_}"/>`,
    cara: [72, 90, .85], a: {top: [72, 62], izq: [44, 76], der: [100, 70], cola: [176, 124], cuerpo: [124, 136], ancho: 50},
  }),
  ave: c => ({
    cuerpo: `<path d="M86 172 v14 M80 186 h12 M114 172 v14 M108 186 h12" stroke="#E59A3B" stroke-width="4" stroke-linecap="round"/>`,
    cabeza: `<circle cx="100" cy="120" r="56" fill="${c[0]}" ${st(4)}/><ellipse cx="100" cy="140" rx="34" ry="30" fill="${c[2]}"/>
      <ellipse cx="48" cy="128" rx="13" ry="26" fill="${c[1]}" ${st()} transform="rotate(16 48 128)"/><ellipse cx="152" cy="128" rx="13" ry="26" fill="${c[1]}" ${st()} transform="rotate(-16 152 128)"/>`,
    cara: [100, 102, 1], pico: true, a: {top: [100, 66], izq: [58, 80], der: [142, 80], cola: [150, 166], cuerpo: [100, 140], ancho: 54},
  }),
  pez: c => ({
    cuerpo: `<path d="M150 118 L188 92 L182 118 L188 146Z" fill="${c[1]}" ${st()} stroke-linejoin="round"/>
      <path d="M78 80 L96 50 L116 80Z" fill="${c[1]}" ${st()} stroke-linejoin="round"/><path d="M84 156 L96 178 L110 156Z" fill="${c[1]}" ${st()} stroke-linejoin="round"/>`,
    cabeza: `<ellipse cx="96" cy="118" rx="62" ry="44" fill="${c[0]}" ${st(4)}/><ellipse cx="92" cy="136" rx="40" ry="18" fill="${c[2]}"/>
      <ellipse cx="120" cy="128" rx="12" ry="7" fill="${c[1]}" ${st(3)} transform="rotate(-25 120 128)"/>`,
    cara: [82, 108, .95], a: {top: [96, 76], izq: [50, 94], der: [128, 88], cola: [168, 118], cuerpo: [96, 120], ancho: 56},
  }),
  bicho: c => ({
    cuerpo: `<g stroke="${T_}" stroke-width="4" stroke-linecap="round" fill="none"><path d="M78 118 L52 108 L42 124"/><path d="M76 128 L48 136 L42 154"/><path d="M80 138 L60 160 L62 178"/>
      <path d="M122 118 L148 108 L158 124"/><path d="M124 128 L152 136 L158 154"/><path d="M120 138 L140 160 L138 178"/></g>
      <ellipse cx="100" cy="154" rx="40" ry="30" fill="${c[1]}" ${st(4)}/><path d="M68 150 Q100 160 132 150 M72 166 Q100 176 128 166" fill="none" stroke="${c[2]}" stroke-width="4"/>
      <ellipse cx="100" cy="120" rx="30" ry="22" fill="${c[0]}" ${st(4)}/>`,
    cabeza: `<circle cx="100" cy="82" r="36" fill="${c[0]}" ${st(4)}/>`,
    cara: [100, 84, .95], a: {top: [100, 48], izq: [68, 62], der: [132, 62], cola: [100, 184], cuerpo: [100, 152], ancho: 38},
  }),
  planta: c => ({
    cuerpo: `<path d="M66 150 H134 L126 186 H74Z" fill="${c[3] || '#C97B4A'}" ${st(4)} stroke-linejoin="round"/><rect x="60" y="144" width="80" height="12" rx="4" fill="${c[3] || '#C97B4A'}" ${st()}/>`,
    cabeza: `<ellipse cx="100" cy="108" rx="46" ry="42" fill="${c[0]}" ${st(4)}/><ellipse cx="100" cy="124" rx="24" ry="14" fill="${c[2]}"/>`,
    cara: [100, 104, 1], a: {top: [100, 68], izq: [56, 96], der: [144, 96], cola: [140, 140], cuerpo: [100, 120], ancho: 46},
  }),
  cristal: c => ({
    cuerpo: `<ellipse cx="80" cy="180" rx="13" ry="8" fill="${c[1]}" ${st()}/><ellipse cx="120" cy="180" rx="13" ry="8" fill="${c[1]}" ${st()}/>`,
    cabeza: `<path d="M100 36 L154 98 L134 176 H66 L46 98Z" fill="${c[0]}" ${st(4)} stroke-linejoin="round"/>
      <path d="M100 36 L84 98 L100 176 L116 98Z M46 98 H154" fill="none" stroke="${c[1]}" stroke-width="3" opacity=".7"/>
      <path d="M72 130 L100 118 L128 130 L118 164 H82Z" fill="${c[2]}" opacity=".8"/>`,
    cara: [100, 112, .95], a: {top: [100, 38], izq: [54, 96], der: [146, 96], cola: [150, 160], cuerpo: [100, 140], ancho: 50},
  }),
  llama: c => ({
    cuerpo: '',
    cabeza: `<path class="llama-salvaje" d="M100 30 C130 60 160 84 156 128 C152 168 124 184 100 184 C76 184 48 168 44 128 C40 96 70 82 76 50 C88 68 96 60 100 30Z" fill="${c[0]}" ${st(4)} stroke-linejoin="round"/>
      <path d="M100 96 C116 112 130 124 126 148 C122 168 112 174 100 174 C88 174 76 166 74 148 C72 130 90 120 100 96Z" fill="${c[2]}"/>`,
    cara: [100, 126, .95], a: {top: [100, 40], izq: [56, 110], der: [144, 110], cola: [150, 160], cuerpo: [100, 150], ancho: 50},
  }),
};

function hoja(x, y, rot, color, tam = 1){
  return `<path d="M0 0 C-14 -10 -14 -30 0 -40 C14 -30 14 -10 0 0Z M0 -4 V-34" transform="translate(${x} ${y}) rotate(${rot}) scale(${tam})" fill="${color}" ${st(3)} stroke-linejoin="round"/>`;
}
function llamita(x, y, tam = 1){
  return `<g class="llama-salvaje" style="transform-origin:${x}px ${y}px"><path d="M${x} ${y} c-14 0 -18 -14 -12 -24 c4 -8 10 -10 10 -22 c10 6 14 16 12 22 c4 -2 6 -8 6 -12 c8 10 8 22 4 28 c-4 6 -10 8 -20 8z" transform="translate(${x} ${y}) scale(${tam}) translate(${-x} ${-y})" fill="#FF9F2E" ${st(3)} stroke-linejoin="round"/></g>`;
}
function rayito(x, y, tam = 1, color = '#FFE45C'){
  return `<path d="M0 0 L-8 16 L0 16 L-6 32 L10 10 L2 10 L8 0Z" transform="translate(${x} ${y}) scale(${tam})" fill="${color}" ${st(3)} stroke-linejoin="round"/>`;
}
function cristalito(x, y, rot, tam = 1, color = '#BFE9FF'){
  return `<path d="M0 0 L-7 -10 L0 -30 L7 -10Z" transform="translate(${x} ${y}) rotate(${rot}) scale(${tam})" fill="${color}" ${st(3)} stroke-linejoin="round"/>`;
}

// Cada rasgo devuelve {atras, frente}. a = anclas de la forma, c = paleta.
const RASGOS = {
  orejas_punta: (a, c) => ({atras: `<path d="M${a.izq[0]-6} ${a.izq[1]+16} L${a.izq[0]-10} ${a.izq[1]-30} L${a.izq[0]+24} ${a.izq[1]-2}Z" fill="${c[0]}" ${st()} stroke-linejoin="round"/><path d="M${a.izq[0]-2} ${a.izq[1]+8} L${a.izq[0]-5} ${a.izq[1]-18} L${a.izq[0]+14} ${a.izq[1]-2}Z" fill="${c[1]}"/>
      <path d="M${a.der[0]+6} ${a.der[1]+16} L${a.der[0]+10} ${a.der[1]-30} L${a.der[0]-24} ${a.der[1]-2}Z" fill="${c[0]}" ${st()} stroke-linejoin="round"/><path d="M${a.der[0]+2} ${a.der[1]+8} L${a.der[0]+5} ${a.der[1]-18} L${a.der[0]-14} ${a.der[1]-2}Z" fill="${c[1]}"/>`}),
  orejas_redondas: (a, c) => ({atras: `<circle cx="${a.izq[0]}" cy="${a.izq[1]-6}" r="16" fill="${c[0]}" ${st()}/><circle cx="${a.izq[0]}" cy="${a.izq[1]-6}" r="8" fill="${c[1]}"/>
      <circle cx="${a.der[0]}" cy="${a.der[1]-6}" r="16" fill="${c[0]}" ${st()}/><circle cx="${a.der[0]}" cy="${a.der[1]-6}" r="8" fill="${c[1]}"/>`}),
  orejas_largas: (a, c) => ({atras: `<ellipse cx="${a.izq[0]+6}" cy="${a.izq[1]-30}" rx="11" ry="32" fill="${c[0]}" ${st()} transform="rotate(-14 ${a.izq[0]+6} ${a.izq[1]-30})"/>
      <ellipse cx="${a.der[0]-6}" cy="${a.der[1]-30}" rx="11" ry="32" fill="${c[0]}" ${st()} transform="rotate(14 ${a.der[0]-6} ${a.der[1]-30})"/>`}),
  cuernos: (a, c) => ({atras: `<path d="M${a.top[0]-20} ${a.top[1]+8} C${a.top[0]-34} ${a.top[1]-6} ${a.top[0]-30} ${a.top[1]-26} ${a.top[0]-18} ${a.top[1]-30} C${a.top[0]-18} ${a.top[1]-14} ${a.top[0]-10} ${a.top[1]-4} ${a.top[0]-6} ${a.top[1]+6}Z" fill="#F4E8D2" ${st(3)}/>
      <path d="M${a.top[0]+20} ${a.top[1]+8} C${a.top[0]+34} ${a.top[1]-6} ${a.top[0]+30} ${a.top[1]-26} ${a.top[0]+18} ${a.top[1]-30} C${a.top[0]+18} ${a.top[1]-14} ${a.top[0]+10} ${a.top[1]-4} ${a.top[0]+6} ${a.top[1]+6}Z" fill="#F4E8D2" ${st(3)}/>`}),
  cuerno: (a, c) => ({frente: `<path d="M${a.top[0]-9} ${a.top[1]+10} L${a.top[0]} ${a.top[1]-22} L${a.top[0]+9} ${a.top[1]+10}Z" fill="${c[3] || '#F4E8D2'}" ${st(3)} stroke-linejoin="round"/>`}),
  cresta: (a, c) => ({atras: `<path d="M${a.top[0]-26} ${a.top[1]+10} L${a.top[0]-18} ${a.top[1]-16} L${a.top[0]-6} ${a.top[1]+2} L${a.top[0]+2} ${a.top[1]-24} L${a.top[0]+12} ${a.top[1]+2} L${a.top[0]+22} ${a.top[1]-14} L${a.top[0]+28} ${a.top[1]+10}Z" fill="${c[3] || c[1]}" ${st()} stroke-linejoin="round"/>`}),
  antenas: (a, c) => ({atras: `<path d="M${a.top[0]-12} ${a.top[1]+6} Q${a.top[0]-22} ${a.top[1]-20} ${a.top[0]-34} ${a.top[1]-26} M${a.top[0]+12} ${a.top[1]+6} Q${a.top[0]+22} ${a.top[1]-20} ${a.top[0]+34} ${a.top[1]-26}" fill="none" stroke="${T_}" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="${a.top[0]-35}" cy="${a.top[1]-27}" r="6" fill="${c[3] || c[1]}" ${st(3)}/><circle cx="${a.top[0]+35}" cy="${a.top[1]-27}" r="6" fill="${c[3] || c[1]}" ${st(3)}/>`}),
  alas: (a, c) => ({atras: `<path d="M${a.cuerpo[0]-30} ${a.cuerpo[1]-14} C${a.cuerpo[0]-90} ${a.cuerpo[1]-60} ${a.cuerpo[0]-96} ${a.cuerpo[1]+10} ${a.cuerpo[0]-40} ${a.cuerpo[1]+16}Z" fill="${c[3] || c[1]}" ${st()} stroke-linejoin="round"/>
      <path d="M${a.cuerpo[0]+30} ${a.cuerpo[1]-14} C${a.cuerpo[0]+90} ${a.cuerpo[1]-60} ${a.cuerpo[0]+96} ${a.cuerpo[1]+10} ${a.cuerpo[0]+40} ${a.cuerpo[1]+16}Z" fill="${c[3] || c[1]}" ${st()} stroke-linejoin="round"/>`}),
  alitas: (a, c) => ({atras: `<ellipse cx="${a.cuerpo[0]-44}" cy="${a.cuerpo[1]-26}" rx="22" ry="13" fill="#DCEEFF" opacity=".9" ${st(3)} transform="rotate(-25 ${a.cuerpo[0]-44} ${a.cuerpo[1]-26})"/>
      <ellipse cx="${a.cuerpo[0]+44}" cy="${a.cuerpo[1]-26}" rx="22" ry="13" fill="#DCEEFF" opacity=".9" ${st(3)} transform="rotate(25 ${a.cuerpo[0]+44} ${a.cuerpo[1]-26})"/>`}),
  aletas: (a, c) => ({atras: `<path d="M${a.izq[0]+8} ${a.izq[1]+6} L${a.izq[0]-24} ${a.izq[1]-10} L${a.izq[0]-12} ${a.izq[1]+24}Z" fill="${c[3] || c[1]}" ${st(3)} stroke-linejoin="round"/>
      <path d="M${a.der[0]-8} ${a.der[1]+6} L${a.der[0]+24} ${a.der[1]-10} L${a.der[0]+12} ${a.der[1]+24}Z" fill="${c[3] || c[1]}" ${st(3)} stroke-linejoin="round"/>`}),
  cola_llama: (a) => ({atras: llamita(a.cola[0] + 10, a.cola[1] + 6, 1.2)}),
  cola_hoja: (a, c) => ({atras: hoja(a.cola[0], a.cola[1], 60, c[3] || '#7CC46A', 1)}),
  cola_rayo: (a) => ({atras: rayito(a.cola[0] + 6, a.cola[1] - 26, 1.3)}),
  cola_esponja: (a, c) => ({atras: `<circle cx="${a.cola[0]+8}" cy="${a.cola[1]}" r="16" fill="${c[2]}" ${st()}/>`}),
  aguijon: (a) => ({atras: `<path d="M${a.cola[0]-8} ${a.cola[1]-6} L${a.cola[0]} ${a.cola[1]+14} L${a.cola[0]+8} ${a.cola[1]-6}Z" fill="#22304A"/>`}),
  manchas: (a, c) => ({frente: `<g fill="${c[1]}" opacity=".85"><circle cx="${a.cuerpo[0]-a.ancho*.55}" cy="${a.cuerpo[1]-6}" r="6"/><circle cx="${a.cuerpo[0]+a.ancho*.6}" cy="${a.cuerpo[1]-10}" r="5"/><circle cx="${a.cuerpo[0]+a.ancho*.45}" cy="${a.cuerpo[1]+14}" r="4"/></g>`}),
  rayas: (a, c) => ({frente: `<path d="M${a.cuerpo[0]-a.ancho*.7} ${a.cuerpo[1]-12} l12 6 M${a.cuerpo[0]+a.ancho*.7} ${a.cuerpo[1]-12} l-12 6 M${a.cuerpo[0]-a.ancho*.75} ${a.cuerpo[1]+4} l12 4 M${a.cuerpo[0]+a.ancho*.75} ${a.cuerpo[1]+4} l-12 4" stroke="${c[1]}" stroke-width="4" stroke-linecap="round"/>`}),
  hojas: (a, c) => ({atras: hoja(a.top[0] - 6, a.top[1] + 6, -30, c[3] || '#9BDB6E') + hoja(a.top[0] + 6, a.top[1] + 6, 30, c[3] || '#9BDB6E')}),
  flor: (a, c) => ({frente: `<g ${st(3)}>${[0, 72, 144, 216, 288].map(r => `<ellipse cx="${a.top[0]}" cy="${a.top[1]-14}" rx="7" ry="12" fill="${c[3] || '#C77DFF'}" transform="rotate(${r} ${a.top[0]} ${a.top[1]})"/>`).join('')}</g><circle cx="${a.top[0]}" cy="${a.top[1]}" r="7" fill="#FFE45C" ${st(3)}/>`}),
  hongo: (a, c) => ({frente: `<path d="M${a.top[0]-46} ${a.top[1]+16} C${a.top[0]-46} ${a.top[1]-40} ${a.top[0]+46} ${a.top[1]-40} ${a.top[0]+46} ${a.top[1]+16}Z" fill="${c[3] || '#E2492E'}" ${st(4)}/>
      <g fill="#fff"><circle cx="${a.top[0]-22}" cy="${a.top[1]-6}" r="7"/><circle cx="${a.top[0]+18}" cy="${a.top[1]-14}" r="8"/><circle cx="${a.top[0]+30}" cy="${a.top[1]+6}" r="5"/><circle cx="${a.top[0]-4}" cy="${a.top[1]+8}" r="5"/></g>`}),
  caparazon: (a, c) => ({frente: `<ellipse cx="${a.cuerpo[0]+4}" cy="${a.cuerpo[1]-10}" rx="${a.ancho*1.05}" ry="30" fill="${c[3] || '#7E9A5A'}" ${st(4)}/>
      <path d="M${a.cuerpo[0]-30} ${a.cuerpo[1]-10} h68 M${a.cuerpo[0]+4} ${a.cuerpo[1]-38} v56 M${a.cuerpo[0]-20} ${a.cuerpo[1]-30} l48 40 M${a.cuerpo[0]+28} ${a.cuerpo[1]-30} l-48 40" stroke="${T_}" stroke-width="2.5" opacity=".5"/>`}),
  pinchos: (a, c) => ({atras: [-40, -20, 0, 20, 40].map(dx => `<path d="M${a.cuerpo[0]+dx-9} ${a.cuerpo[1]-a.ancho*.55} L${a.cuerpo[0]+dx} ${a.cuerpo[1]-a.ancho*.55-26} L${a.cuerpo[0]+dx+9} ${a.cuerpo[1]-a.ancho*.55}Z" fill="${c[3] || c[1]}" ${st(3)} stroke-linejoin="round"/>`).join('')}),
  cristales: (a, c) => ({atras: cristalito(a.top[0], a.top[1] + 8, 0, 1.2, c[3]) + cristalito(a.top[0] - 22, a.top[1] + 12, -30, .9, c[3]) + cristalito(a.top[0] + 22, a.top[1] + 12, 30, .9, c[3])}),
  bigotes: (a) => ({frente: `<path d="M${a.izq[0]-2} ${a.izq[1]+36} h-22 M${a.izq[0]-2} ${a.izq[1]+42} h-18 M${a.der[0]+2} ${a.der[1]+36} h22 M${a.der[0]+2} ${a.der[1]+42} h18" stroke="${T_}" stroke-width="2" stroke-linecap="round"/>`}),
  collar: (a, c) => ({frente: `<path d="M${a.cuerpo[0]-40} ${a.cuerpo[1]-36} C${a.cuerpo[0]-30} ${a.cuerpo[1]-50} ${a.cuerpo[0]-16} ${a.cuerpo[1]-40} ${a.cuerpo[0]-8} ${a.cuerpo[1]-48} C${a.cuerpo[0]} ${a.cuerpo[1]-38} ${a.cuerpo[0]+12} ${a.cuerpo[1]-48} ${a.cuerpo[0]+20} ${a.cuerpo[1]-40} C${a.cuerpo[0]+30} ${a.cuerpo[1]-50} ${a.cuerpo[0]+40} ${a.cuerpo[1]-36} ${a.cuerpo[0]+40} ${a.cuerpo[1]-30} C${a.cuerpo[0]+10} ${a.cuerpo[1]-20} ${a.cuerpo[0]-10} ${a.cuerpo[1]-20} ${a.cuerpo[0]-40} ${a.cuerpo[1]-30}Z" fill="${c[3] || '#fff'}" ${st(3)} stroke-linejoin="round"/>`}),
  enchufe: (a) => ({atras: `<rect x="${a.top[0]-14}" y="${a.top[1]-26}" width="7" height="22" rx="2" fill="#C9C9C9" ${st(3)}/><rect x="${a.top[0]+7}" y="${a.top[1]-26}" width="7" height="22" rx="2" fill="#C9C9C9" ${st(3)}/>`}),
  nube: (a) => ({atras: `<path d="M${a.top[0]-40} ${a.top[1]+6} c-12 0 -14 -20 2 -22 c0 -16 22 -20 30 -8 c6 -14 30 -12 32 4 c16 -2 22 22 6 26Z" fill="#E6EAF5" ${st(3)}/>`}),
  burbujas: (a) => ({frente: `<g fill="#DFF4FF" ${st(2.5)}><circle cx="${a.der[0]+26}" cy="${a.der[1]-6}" r="7"/><circle cx="${a.der[0]+38}" cy="${a.der[1]-22}" r="4.5"/><circle cx="${a.izq[0]-26}" cy="${a.izq[1]+4}" r="5"/></g>`}),
  escarcha: (a) => ({atras: cristalito(a.izq[0] + 4, a.izq[1] + 2, -40, 1) + cristalito(a.der[0] - 4, a.der[1] + 2, 40, 1), frente: `<path d="M${a.cuerpo[0]} ${a.cuerpo[1]-12} v24 M${a.cuerpo[0]-11} ${a.cuerpo[1]-6} l22 12 M${a.cuerpo[0]+11} ${a.cuerpo[1]-6} l-22 12" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>`}),
  llamas_cabeza: (a) => ({atras: llamita(a.top[0] - 20, a.top[1] + 14, .9) + llamita(a.top[0], a.top[1] + 4, 1.15) + llamita(a.top[0] + 20, a.top[1] + 14, .9)}),
  melena: (a, c) => ({atras: `<g fill="${c[3] || c[1]}" ${st(3)}>${Array.from({length: 12}, (_, i) => { const ang = i * 30 * Math.PI / 180, x = a.top[0] + Math.cos(ang) * 42, y = a.top[1] + 36 + Math.sin(ang) * 42; return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="16"/>`; }).join('')}</g>`}),
  pico: (a, c, f) => ({frente: `<path d="M${f[0]-11} ${f[1]+14} L${f[0]+11} ${f[1]+14} L${f[0]} ${f[1]+30}Z" fill="${c[3] && c[3] !== c[1] ? '#F0A93B' : '#F0A93B'}" ${st(3)} stroke-linejoin="round"/>`}),
  corona: (a) => ({frente: `<path d="M${a.top[0]-22} ${a.top[1]+4} L${a.top[0]-24} ${a.top[1]-20} L${a.top[0]-10} ${a.top[1]-8} L${a.top[0]} ${a.top[1]-26} L${a.top[0]+10} ${a.top[1]-8} L${a.top[0]+24} ${a.top[1]-20} L${a.top[0]+22} ${a.top[1]+4}Z" fill="#FFD23F" ${st(3)} stroke-linejoin="round"/><circle cx="${a.top[0]}" cy="${a.top[1]-6}" r="4" fill="#E63B4B"/>`}),
  aura: (a, c) => ({atras: `<circle class="brillo" cx="100" cy="112" r="92" fill="${c[3] || '#FFF3A0'}" opacity=".35"/>`}),
  mascara: (a, c, f) => ({frente: `<path d="M${f[0]-34} ${f[1]-8} Q${f[0]} ${f[1]-18} ${f[0]+34} ${f[1]-8} L${f[0]+30} ${f[1]+8} Q${f[0]} ${f[1]} ${f[0]-30} ${f[1]+8}Z" fill="${c[1]}" opacity=".85"/>`}),
};

// Rasgos que se suman al evolucionar, según el tipo.
const RASGOS_EVO = {
  fuego: [['llamas_cabeza'], ['llamas_cabeza', 'cola_llama', 'melena']],
  planta: [['hojas'], ['hojas', 'flor', 'cola_hoja']],
  agua: [['aletas'], ['aletas', 'cresta', 'burbujas']],
  rayo: [['enchufe'], ['cola_rayo', 'cresta', 'enchufe']],
  piedra: [['cuerno'], ['cuerno', 'pinchos', 'cristales']],
  viento: [['alitas'], ['alas', 'cresta']],
  hielo: [['cristales'], ['cristales', 'escarcha', 'collar']],
  bicho: [['antenas'], ['antenas', 'alitas', 'aguijon']],
  normal: [['cresta'], ['cuernos', 'collar']],
};

function dibujoGenerado(d, o, etapa){
  const f = FORMAS[d.forma](d.col);
  const lista = [...(d.rasgos || [])];
  if(f.pico) lista.push('pico');
  let atras = '', frente = '';
  for(const r of lista){
    const g = RASGOS[r]; if(!g) continue;
    const res = g(f.a, d.col, f.cara);
    atras += res.atras || ''; frente += res.frente || '';
  }
  const [cx, cy, esc] = f.cara;
  const ceno = etapa >= 3 ? `<path d="M${cx-30*esc} ${cy-16*esc} l14 5 M${cx+30*esc} ${cy-16*esc} l-14 5" stroke="${T_}" stroke-width="3.5" stroke-linecap="round"/>` : '';
  return atras + f.cuerpo + f.cabeza + frente + ceno + carita(cx, cy, {...o, esc: esc * (etapa >= 3 ? .9 : 1), sinBoca: !!f.pico});
}

// Evolución de una especie dibujada a mano: el mismo dibujo, más grande y con rasgos nuevos.
const EVO_ANCLAS = {top: [100, 44], izq: [56, 70], der: [144, 70], cola: [152, 160], cuerpo: [100, 140], ancho: 48};
function dibujoEvolucionado(interior, tipo, etapa, col){
  const extras = RASGOS_EVO[tipo][etapa - 2] || [];
  let atras = '', frente = '';
  for(const r of extras){ const res = RASGOS[r](EVO_ANCLAS, col, [100, 86]); atras += res.atras || ''; frente += res.frente || ''; }
  const filtro = etapa === 2 ? 'saturate(1.15) brightness(.97)' : 'saturate(1.3) brightness(.93)';
  return atras + `<g style="filter:${filtro}">${interior}</g>` + frente;
}

/* ---------------- Dibujo de cualquier especie ---------------- */
function interiorEspecie(esp, o = {}){
  const e = ESPECIES[esp]; if(!e) return '';
  const d = e.dib;
  if(d.mano){
    const base = d.mano;
    const humor = o.humor === 'mal' ? {enojo: true} : {};
    const inner = COL[base] ? cuerpoInicial(base, o).replace(/^<g class="cuerpo">|<\/g>$/g, '') : DIBUJOS[base]({...humor, ...o});
    return e.etapa > 1 ? dibujoEvolucionado(inner, e.tipo, e.etapa, d.col || ['#999', '#666', '#ddd']) : inner;
  }
  return dibujoGenerado(d, o.humor === 'mal' ? {...o, enojo: true} : o, e.etapa);
}
const ESCALA_ETAPA = [1, 1, 1.07, 1.14];
function svgEspecie(esp, o = {}){
  const e = ESPECIES[esp];
  if(!e) return '';
  const esc = (e.legendaria ? 1.08 : ESCALA_ETAPA[e.etapa] || 1) * (o.escala || 1);
  const shiny = o.shiny ? ' style="filter:hue-rotate(155deg) saturate(1.35)"' : '';
  const brillos = o.shiny ? `<g fill="#FFE45C" ${st(2)}><path d="M28 40 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4z"/><path d="M168 30 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3z"/><path d="M172 150 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3z"/></g>` : '';
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${SOMBRA}
    <g transform="translate(100 188) scale(${esc}) translate(-100 -188)"><g class="cuerpo"${shiny}>${interiorEspecie(esp, o)}</g></g>${brillos}</svg>`;
}
// Compatibilidad: los iniciales se dibujaban con svgCriatura.
function svgCriatura(esp, o = {}){ return svgEspecie(esp, o); }

/* =====================================================================
   Entrenador, peluches y vitrina de medallas.
   ===================================================================== */
const ASPECTO = {
  piel: ['#F5D3B3', '#E8B48C', '#C98E62', '#8D5A3B'],
  pelo: ['#2A2420', '#6B4226', '#C98A3C', '#E8C25A', '#B5452B', '#5A6B8C'],
  peinado: ['corto', 'largo', 'colita', 'rulos', 'rapado'],
  ropa: ['#E2574C', '#3B82D6', '#4CC27A', '#F2B63D', '#7A4FC9', '#22304A', '#FF7FA3'],
  gorra: ['ninguna', '#E2574C', '#3B82D6', '#22304A', '#F2B63D'],
};
const NOMBRES_PEINADO = {corto: 'Corto', largo: 'Largo', colita: 'Colita', rulos: 'Rulos', rapado: 'Rapado'};
function aspectoPorDefecto(){ return {piel: ASPECTO.piel[0], pelo: ASPECTO.pelo[1], peinado: 'corto', ropa: ASPECTO.ropa[0], gorra: ASPECTO.gorra[1]}; }

// dir: 'abajo' (de frente), 'arriba' (de espaldas) o 'lado' (perfil mirando a la derecha). paso: 0 quieto, 1 y 2 caminando.
function svgEntrenador(e, tam, dir = 'abajo', paso = 0){
  e = e || aspectoPorDefecto();
  const T = '#22304A', s = 'stroke="#22304A" stroke-width="3"', pelo = e.pelo, piel = e.piel, ropa = e.ropa;
  const pantalon = '#3B4A6B', mochila = '#8A5A35';
  const conGorra = e.gorra && e.gorra !== 'ninguna';
  const bob = paso ? -1.5 : 0;
  const w = tam ? `width="${tam * .72}" height="${tam}"` : '';
  let cuerpo = '';
  if(dir === 'lado'){
    const zancada = paso === 1 ? 9 : paso === 2 ? -9 : 0;
    const pierna = (dx, color) => `<g transform="rotate(${dx} 50 100)"><rect x="45" y="98" width="11" height="28" rx="4" fill="${color}" ${s}/><ellipse cx="54" cy="128" rx="9" ry="5" fill="${T}"/></g>`;
    let peloAtras = '';
    if(e.peinado === 'largo') peloAtras = `<path d="M30 34 C24 60 32 78 44 82 L52 70 C46 58 44 44 46 34Z" fill="${pelo}" ${s}/>`;
    if(e.peinado === 'colita') peloAtras = `<ellipse cx="25" cy="46" rx="9" ry="15" fill="${pelo}" ${s} transform="rotate(-25 25 46)"/>`;
    let peloArriba;
    if(e.peinado === 'rulos') peloArriba = `<g fill="${pelo}" ${s}>${[[30,36],[34,24],[46,18],[58,20],[30,48]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10"/>`).join('')}</g>`;
    else if(e.peinado === 'rapado') peloArriba = `<path d="M27 40 C27 20 66 18 70 34 C58 28 40 30 27 40Z" fill="${pelo}" opacity=".85"/>`;
    else peloArriba = `<path d="M26 50 C20 22 46 10 66 20 C74 24 76 32 74 36 C64 30 52 32 46 36 C44 44 40 50 26 50Z" fill="${pelo}" ${s} stroke-linejoin="round"/>`;
    const gorra = conGorra ? `<path d="M26 34 C26 10 72 10 72 32Z" fill="${e.gorra}" ${s}/><path d="M66 28 C76 28 88 30 90 35 C82 38 72 36 64 34Z" fill="${e.gorra}" ${s}/>` : '';
    cuerpo = `${peloAtras}${pierna(-zancada, '#2C3854')}
      <rect x="26" y="66" width="14" height="30" rx="5" fill="${mochila}" ${s}/>
      <path d="M38 70 C38 62 62 62 62 70 L64 104 H36Z" fill="${ropa}" ${s} stroke-linejoin="round"/>
      ${pierna(zancada, pantalon)}
      <g transform="rotate(${-zancada * 1.6} 50 72)"><ellipse cx="52" cy="86" rx="7" ry="15" fill="${ropa}" ${s}/><circle cx="52" cy="100" r="6" fill="${piel}" ${s}/></g>
      <circle cx="50" cy="42" r="24" fill="${piel}" ${s}/>
      <path d="M72 44 q5 3 0 6" fill="${piel}" ${s}/>
      ${peloArriba}${gorra}
      <ellipse cx="44" cy="46" rx="4" ry="5" fill="${piel}" ${s}/>
      <ellipse cx="63" cy="45" rx="3.2" ry="4.2" fill="${T}"/><circle cx="64" cy="43.5" r="1.2" fill="#fff"/>
      <ellipse cx="62" cy="54" rx="4" ry="2.5" fill="#FF8FAE" opacity=".7"/>
      <path d="M66 56 q3 1.5 5 -1" fill="none" stroke="${T}" stroke-width="2.5" stroke-linecap="round"/>`;
  } else {
    const izq = paso === 1 ? -4 : 0, der = paso === 2 ? -4 : 0;
    const brazoI = paso === 1 ? 22 : paso === 2 ? 2 : 12, brazoD = paso === 2 ? -22 : paso === 1 ? -2 : -12;
    const piernas = `<rect x="37" y="${98 + izq}" width="11" height="28" rx="4" fill="${pantalon}" ${s}/><rect x="52" y="${98 + der}" width="11" height="28" rx="4" fill="${pantalon}" ${s}/>
      <ellipse cx="42" cy="${129 + izq}" rx="9" ry="5" fill="${T}"/><ellipse cx="58" cy="${129 + der}" rx="9" ry="5" fill="${T}"/>`;
    const brazos = `<ellipse cx="27" cy="84" rx="8" ry="16" fill="${ropa}" ${s} transform="rotate(${brazoI} 27 72)"/><ellipse cx="73" cy="84" rx="8" ry="16" fill="${ropa}" ${s} transform="rotate(${brazoD} 73 72)"/>`;
    const manos = `<circle cx="24" cy="99" r="6" fill="${piel}" ${s} transform="rotate(${brazoI} 27 72)"/><circle cx="76" cy="99" r="6" fill="${piel}" ${s} transform="rotate(${brazoD} 73 72)"/>`;
    if(dir === 'arriba'){
      let peloEspalda;
      if(e.peinado === 'rulos') peloEspalda = `<g fill="${pelo}" ${s}>${[[28,34],[36,22],[50,18],[64,22],[72,34],[34,48],[50,52],[66,48]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="11"/>`).join('')}</g>`;
      else if(e.peinado === 'rapado') peloEspalda = `<circle cx="50" cy="42" r="24" fill="${pelo}" opacity=".55"/>`;
      else peloEspalda = `<path d="M26 44 C22 14 78 14 74 44 C74 56 64 64 50 64 C36 64 26 56 26 44Z" fill="${pelo}" ${s}/>`;
      const largo = e.peinado === 'largo' ? `<path d="M26 44 C24 72 32 86 40 88 L60 88 C68 86 76 72 74 44Z" fill="${pelo}" ${s}/>` : '';
      const colita = e.peinado === 'colita' ? `<ellipse cx="50" cy="72" rx="9" ry="15" fill="${pelo}" ${s}/>` : '';
      const gorra = conGorra ? `<path d="M26 34 C26 10 74 10 74 34Z" fill="${e.gorra}" ${s}/><rect x="40" y="30" width="20" height="5" rx="2" fill="${T}" opacity=".6"/>` : '';
      cuerpo = `${piernas}${brazos}${manos}
        <path d="M32 70 C32 62 68 62 68 70 L70 104 H30Z" fill="${ropa}" ${s} stroke-linejoin="round"/>
        <rect x="36" y="68" width="28" height="30" rx="6" fill="${mochila}" ${s}/><path d="M36 80 H64" stroke="${T}" stroke-width="2.5"/><rect x="46" y="84" width="8" height="6" rx="2" fill="#FFD23F" ${s}/>
        <circle cx="50" cy="42" r="24" fill="${piel}" ${s}/>
        <ellipse cx="25" cy="46" rx="4" ry="5" fill="${piel}" ${s}/><ellipse cx="75" cy="46" rx="4" ry="5" fill="${piel}" ${s}/>
        ${largo}${peloEspalda}${colita}${gorra}`;
    } else {
      let peloAtras = '', peloFrente = '';
      if(e.peinado === 'largo') peloAtras = `<path d="M24 40 C22 74 30 84 38 86 L62 86 C70 84 78 74 76 40Z" fill="${pelo}" ${s}/>`;
      if(e.peinado === 'colita') peloAtras = `<ellipse cx="78" cy="48" rx="10" ry="16" fill="${pelo}" ${s} transform="rotate(25 78 48)"/>`;
      if(e.peinado === 'rulos') peloFrente = `<g fill="${pelo}" ${s}>${[[28,34],[36,22],[50,18],[64,22],[72,34]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10"/>`).join('')}</g>`;
      else if(e.peinado === 'rapado') peloFrente = `<path d="M27 38 C27 20 73 20 73 38 C64 32 36 32 27 38Z" fill="${pelo}" opacity=".85"/>`;
      else peloFrente = `<path d="M25 42 C23 14 77 14 75 42 C70 30 60 26 54 30 C48 24 34 28 25 42Z" fill="${pelo}" ${s} stroke-linejoin="round"/>`;
      const gorra = conGorra ? `<path d="M26 32 C26 10 74 10 74 32Z" fill="${e.gorra}" ${s}/><path d="M48 30 C60 28 80 28 86 34 C76 38 60 36 48 34Z" fill="${e.gorra}" ${s}/><circle cx="50" cy="13" r="3" fill="#fff"/>` : '';
      cuerpo = `${peloAtras}${piernas}${brazos}${manos}
        <path d="M32 70 C32 62 68 62 68 70 L70 104 H30Z" fill="${ropa}" ${s} stroke-linejoin="round"/>
        <path d="M32 84 H68" stroke="#fff" stroke-width="4" opacity=".55"/>
        <path d="M42 66 L50 74 L58 66" fill="none" stroke="#fff" stroke-width="3" opacity=".8"/>
        <path d="M34 66 L40 92 M66 66 L60 92" stroke="${mochila}" stroke-width="4" stroke-linecap="round"/>
        <circle cx="50" cy="42" r="24" fill="${piel}" ${s}/>
        ${peloFrente}${gorra}
        <ellipse cx="41" cy="46" rx="3.2" ry="4.2" fill="${T}"/><ellipse cx="59" cy="46" rx="3.2" ry="4.2" fill="${T}"/>
        <circle cx="42" cy="44.5" r="1.2" fill="#fff"/><circle cx="60" cy="44.5" r="1.2" fill="#fff"/>
        <ellipse cx="35" cy="53" rx="4" ry="2.5" fill="#FF8FAE" opacity=".7"/><ellipse cx="65" cy="53" rx="4" ry="2.5" fill="#FF8FAE" opacity=".7"/>
        <path d="M45 55 Q50 59 55 55" fill="none" stroke="${T}" stroke-width="2.5" stroke-linecap="round"/>`;
    }
  }
  return `<svg viewBox="0 0 100 140" ${w} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="50" cy="134" rx="24" ry="5" fill="rgba(34,48,74,.18)"/><g transform="translate(0 ${bob})">${cuerpo}</g></svg>`;
}

// Imágenes listas para dibujar en el mapa: 3 vistas x 3 pasos, nítidas en pantallas de alta resolución.
const _spritesCache = {};
function imagenSvg(svg, w, h){
  const i = new Image();
  i.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.replace('<svg ', `<svg width="${w}" height="${h}" `));
  return i;
}
function spritesEntrenador(e){
  const k = JSON.stringify(e || {});
  if(!_spritesCache[k]){
    const set = {};
    for(const dir of ['abajo', 'arriba', 'lado']) set[dir] = [0, 1, 2].map(p => imagenSvg(svgEntrenador(e, 0, dir, p), 108, 150));
    _spritesCache[k] = set;
  }
  return _spritesCache[k];
}
const _criaturaCache = {};
function imagenCriatura(esp, shiny){
  const k = esp + (shiny ? '*' : '');
  if(!_criaturaCache[k]) _criaturaCache[k] = imagenSvg(svgEspecie(esp, {humor: 'feliz', shiny}), 144, 144);
  return _criaturaCache[k];
}
// Dibuja un entrenador en el canvas. mira: abajo, arriba, izq o der.
function dibujarEntrenador(ctx, sprites, cx, piso, mira, paso, alto = 48){
  const dir = mira === 'izq' || mira === 'der' ? 'lado' : mira || 'abajo';
  const img = sprites[dir][paso || 0], ancho = alto * .72;
  ctx.save(); ctx.translate(cx, piso);
  if(mira === 'izq') ctx.scale(-1, 1);
  if(img.complete && img.naturalWidth) ctx.drawImage(img, -ancho / 2, -alto + 2, ancho, alto);
  ctx.restore();
}

function svgPeluche(esp){
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${SOMBRA}
    <g transform="translate(100 188) scale(.92) translate(-100 -188)"><g style="filter:saturate(.8) brightness(1.06)">${interiorEspecie(esp, {humor: 'feliz'})}</g></g>
    <path d="M60 120 q40 10 80 0" fill="none" stroke="#fff" stroke-width="2.5" stroke-dasharray="5 5" opacity=".8"/>
    <rect x="132" y="150" width="30" height="18" rx="4" fill="#FF7FA3" stroke="#22304A" stroke-width="2.5"/>
    <path d="M147 154 c-3 -4 -9 -1 -6 3 l6 6 l6 -6 c3 -4 -3 -7 -6 -3z" fill="#fff"/></svg>`;
}

function svgVitrina(medallas){
  const pos = [[30, 34], [70, 34], [30, 82], [70, 82]];
  const items = MEDALLAS.map((m, i) => `<g transform="translate(${pos[i][0] - 17} ${pos[i][1] - 17}) scale(.425)" style="${medallas[m.id] ? '' : 'filter:grayscale(1);opacity:.22'}">${svgMedalla(m, 80).replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g>`).join('');
  return `<svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="50" cy="126" rx="44" ry="4" fill="rgba(34,48,74,.18)"/>
    <rect x="6" y="6" width="88" height="116" rx="6" fill="#8A5A35" stroke="#22304A" stroke-width="3"/>
    <rect x="12" y="12" width="76" height="98" rx="3" fill="#DFF1FA" stroke="#22304A" stroke-width="2.5"/>
    <path d="M12 58 H88" stroke="#8A5A35" stroke-width="4"/>
    ${items}
    <path d="M20 18 L36 18 L18 46Z" fill="#fff" opacity=".45"/>
    <rect x="30" y="112" width="40" height="7" rx="2" fill="#FFD23F" stroke="#22304A" stroke-width="2"/>
  </svg>`;
}
