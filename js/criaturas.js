'use strict';
/* =====================================================================
   Criaturas de Sorlandia: tipos, poderes, especies salvajes y dibujos.
   ===================================================================== */

const TIPOS = {
  normal:{nom:'Normal', color:'#C9C2B4'},
  fuego: {nom:'Fuego',  color:'#FFB089'},
  planta:{nom:'Planta', color:'#B6E3A1'},
  agua:  {nom:'Agua',   color:'#A9D8F5'},
  rayo:  {nom:'Rayo',   color:'#FFE27A'},
  piedra:{nom:'Piedra', color:'#C9B79C'},
  viento:{nom:'Viento', color:'#CFE3F7'},
};
// A qué tipos le pega fuerte cada tipo (x2). Si el defensor le pega fuerte al atacante, el golpe rinde la mitad.
const VENTAJA = {
  fuego:['planta'],
  agua:['fuego','piedra'],
  planta:['agua','piedra'],
  rayo:['agua','viento'],
  piedra:['fuego','rayo','viento'],
  viento:['planta'],
  normal:[],
};
function efectividad(tipoAtaque, tipoDefensor){
  if(tipoAtaque === 'normal') return 1;
  if((VENTAJA[tipoAtaque] || []).includes(tipoDefensor)) return 2;
  if((VENTAJA[tipoDefensor] || []).includes(tipoAtaque)) return .5;
  return 1;
}

/* ---------------- Poderes ---------------- */
const MOVS = {
  embestida:{nom:'Embestida', tipo:'normal', poder:40, prec:100, desc:'Se tira de cabeza contra el rival.'},
  rasgunio: {nom:'Rasguño',   tipo:'normal', poder:35, prec:100, desc:'Un zarpazo rápido.'},
  mordisco: {nom:'Mordisco',  tipo:'normal', poder:55, prec:95,  desc:'Muerde con ganas.'},
  grunido:  {nom:'Gruñido',   tipo:'normal', poder:0,  prec:100, efecto:'bajaFuerza', desc:'Asusta al rival: le baja la fuerza.'},
  brasa:    {nom:'Brasa',     tipo:'fuego',  poder:40, prec:100, desc:'Escupe una brasa encendida.'},
  llamarada:{nom:'Llamarada', tipo:'fuego',  poder:75, prec:85,  desc:'Una llamarada que pega fuerte pero a veces erra.'},
  hojita:   {nom:'Hoja filosa', tipo:'planta', poder:40, prec:100, desc:'Lanza hojas que cortan como papel.'},
  latigo:   {nom:'Látigo de yerba', tipo:'planta', poder:65, prec:95, desc:'Un ramazo de yerba bien cargado.'},
  chorrito: {nom:'Chorrito',  tipo:'agua',   poder:40, prec:100, desc:'Un chorro de agua a presión.'},
  ola:      {nom:'Ola',       tipo:'agua',   poder:70, prec:90,  desc:'Arma una ola y la tira encima.'},
  chispazo: {nom:'Chispazo',  tipo:'rayo',   poder:40, prec:100, desc:'Una chispa que hace saltar.'},
  trueno:   {nom:'Trueno',    tipo:'rayo',   poder:75, prec:85,  desc:'Un rayo del cielo. Potente, pero impreciso.'},
  pedrada:  {nom:'Pedrada',   tipo:'piedra', poder:45, prec:95,  desc:'Revolea una piedra.'},
  derrumbe: {nom:'Derrumbe',  tipo:'piedra', poder:75, prec:85,  desc:'Le hace caer media sierra encima.'},
  rafaga:   {nom:'Ráfaga',    tipo:'viento', poder:40, prec:100, desc:'Un golpe de viento.'},
  remolino: {nom:'Remolino',  tipo:'viento', poder:65, prec:90,  desc:'Lo hace girar como trompo.'},
};

/* ---------------- Especies (iniciales + salvajes) ---------------- */
// base: stats de nivel 1. aprende: [nivel, poder]. captura: facilidad base (0 a 1).
const ESPECIES_COMBATE = {
  carosor:{tipo:'fuego', aprende:[[1,'embestida'],[1,'brasa'],[4,'grunido'],[8,'mordisco'],[12,'llamarada']]},
  matesor:{tipo:'planta',aprende:[[1,'embestida'],[1,'hojita'],[4,'grunido'],[8,'mordisco'],[12,'latigo']]},
  rufisor:{tipo:'agua',  aprende:[[1,'embestida'],[1,'chorrito'],[4,'grunido'],[8,'mordisco'],[12,'ola']]},
};
const SALVAJES = {
  pampito:{nombre:'Pampito', tipo:'normal', base:{vida:16,fuerza:5,velocidad:8}, captura:.6,
    aprende:[[1,'rasgunio'],[3,'grunido'],[6,'embestida'],[10,'mordisco']],
    desc:'Corre por el pasto en zigzag. Si lo perdés de vista un segundo, ya está a dos cuadras.'},
  hornerito:{nombre:'Hornerito', tipo:'viento', base:{vida:15,fuerza:5,velocidad:9}, captura:.55,
    aprende:[[1,'rafaga'],[3,'grunido'],[7,'embestida'],[11,'remolino']],
    desc:'Arma su nido de barro en cualquier poste. El más laburante de la pradera.'},
  chispulo:{nombre:'Chispulo', tipo:'rayo', base:{vida:14,fuerza:6,velocidad:9}, captura:.45,
    aprende:[[1,'chispazo'],[4,'rasgunio'],[9,'trueno']],
    desc:'Luciérnaga cargada de electricidad. De noche se lo ve titilar entre los árboles.'},
  ceibin:{nombre:'Ceibín', tipo:'planta', base:{vida:18,fuerza:5,velocidad:5}, captura:.55,
    aprende:[[1,'hojita'],[3,'grunido'],[8,'latigo']],
    desc:'Le florecen ceibos rojos en la cabeza. Si está contento, se le abren todos de golpe.'},
  carpinchito:{nombre:'Carpinchito', tipo:'agua', base:{vida:22,fuerza:5,velocidad:4}, captura:.5,
    aprende:[[1,'chorrito'],[4,'embestida'],[9,'ola']],
    desc:'Nada le cambia el humor. Los demás bichos se le suben encima a descansar.'},
  tatupiedra:{nombre:'Tatupiedra', tipo:'piedra', base:{vida:20,fuerza:7,velocidad:3}, captura:.45,
    aprende:[[1,'pedrada'],[4,'grunido'],[9,'derrumbe']],
    desc:'Su caparazón es de piedra de la sierra. Cuando se asusta, se hace bolita y rueda.'},
  brasita:{nombre:'Brasita', tipo:'fuego', base:{vida:15,fuerza:7,velocidad:7}, captura:.35,
    aprende:[[1,'brasa'],[5,'rasgunio'],[10,'llamarada']],
    desc:'Salamandra que vive entre las piedras calientes. Deja huellitas humeantes.'},
  yaguarayo:{nombre:'Yaguarayo', tipo:'rayo', base:{vida:20,fuerza:9,velocidad:9}, captura:.18,
    aprende:[[1,'chispazo'],[1,'mordisco'],[8,'trueno']],
    desc:'Muy raro. Dicen que sus manchas brillan antes de una tormenta.'},
  morrito:{nombre:'Morrito', tipo:'piedra', base:{vida:22,fuerza:7,velocidad:3}, captura:.4,
    aprende:[[1,'embestida'],[1,'pedrada'],[6,'grunido'],[11,'derrumbe']],
    desc:'Una piedra con musgo que un día se despertó. Duerme parado y ronca como un trueno.'},
  cardoncito:{nombre:'Cardoncito', tipo:'planta', base:{vida:20,fuerza:6,velocidad:4}, captura:.45,
    aprende:[[1,'hojita'],[5,'grunido'],[9,'latigo']],
    desc:'Cardón chiquito de los cerros. Tiene espinas, pero si lo abrazás despacito no pinchan.'},
  condorcito:{nombre:'Condorcito', tipo:'viento', base:{vida:18,fuerza:7,velocidad:8}, captura:.35,
    aprende:[[1,'rafaga'],[1,'rasgunio'],[10,'remolino'],[14,'mordisco']],
    desc:'Pichón de cóndor con collar de plumas blancas. Todavía no sabe planear, pero se tira igual.'},
  bagrecito:{nombre:'Bagrecito', tipo:'agua', base:{vida:21,fuerza:6,velocidad:5}, captura:.45,
    aprende:[[1,'chorrito'],[1,'embestida'],[9,'mordisco'],[12,'ola']],
    desc:'Bagre bigotudo del puerto. Con los bigotes siente quién se acerca, aunque el agua esté turbia.'},
  nubarron:{nombre:'Nubarrón', tipo:'rayo', base:{vida:19,fuerza:8,velocidad:7}, captura:.35,
    aprende:[[1,'chispazo'],[1,'rafaga'],[13,'trueno']],
    desc:'Nube de tormenta con mal genio. Cuando se enoja, llueve solo encima de él.'},
  zorrolumbre:{nombre:'Zorrolumbre', tipo:'fuego', base:{vida:19,fuerza:9,velocidad:8}, captura:.3,
    aprende:[[1,'brasa'],[1,'mordisco'],[15,'llamarada']],
    desc:'Zorro colorado con la cola prendida fuego. Pícaro: te roba la merienda y se va riendo.'},
};

/* ---------------- Zonas del mundo ---------------- */
const ZONAS = {
  pueblo:{nom:'Pueblo Ceibo', niveles:[1,1], aparecen:[]},
  pradera:{nom:'Pradera', niveles:[1,3], aparecen:[['pampito',55],['hornerito',32],['chispulo',13]]},
  bosque:{nom:'Bosque de Ceibos', niveles:[3,6], aparecen:[['ceibin',45],['chispulo',35],['pampito',15],['yaguarayo',5]]},
  rio:{nom:'Orillas del Río', niveles:[3,6], aparecen:[['carpinchito',60],['hornerito',20],['ceibin',20]]},
  sierras:{nom:'Sierras', niveles:[4,7], aparecen:[['tatupiedra',55],['brasita',25],['cardoncito',20]]},
  villapiedra:{nom:'Villa Piedra', niveles:[1,1], aparecen:[]},
  serrania:{nom:'Serranía Alta', niveles:[6,9], aparecen:[['morrito',35],['cardoncito',30],['tatupiedra',20],['condorcito',15]]},
  camalote:{nom:'Puerto Camalote', niveles:[1,1], aparecen:[]},
  costa:{nom:'Costa del Puerto', niveles:[9,12], aparecen:[['bagrecito',45],['carpinchito',25],['hornerito',15],['ceibin',15]]},
  tormenta:{nom:'Cerro Tormenta', niveles:[1,1], aparecen:[]},
  cumbres:{nom:'Cumbres', niveles:[13,16], aparecen:[['nubarron',40],['condorcito',30],['chispulo',25],['yaguarayo',5]]},
  fogon:{nom:'Monte Fogón', niveles:[1,1], aparecen:[]},
  volcan:{nom:'Laderas del Volcán', niveles:[17,20], aparecen:[['zorrolumbre',35],['brasita',30],['morrito',25],['tatupiedra',10]]},
};

/* ---------------- Medallas ---------------- */
const MEDALLAS = [
  {id:'penasco', nom:'Medalla Peñasco', tipo:'piedra', ciudad:'Villa Piedra', color:'#9AA3AE', color2:'#6E7884'},
  {id:'camalote', nom:'Medalla Camalote', tipo:'agua', ciudad:'Puerto Camalote', color:'#5AB4E8', color2:'#7C5CC4'},
  {id:'relampago', nom:'Medalla Relámpago', tipo:'rayo', ciudad:'Cerro Tormenta', color:'#FFD23F', color2:'#4656A0'},
  {id:'brasa', nom:'Medalla Brasa', tipo:'fuego', ciudad:'Monte Fogón', color:'#F47A45', color2:'#FFD23F'},
];
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

/* ---------------- Objetos de aventura ---------------- */
const OBJETOS = [
  {id:'capsula', nom:'Cápsula', precio:40, nivel:1, captura:1, desc:'Para atrapar criaturas. Funciona mejor si están debilitadas.', colores:['#F2545B','#FFFFFF']},
  {id:'supercapsula', nom:'Súper cápsula', precio:100, nivel:3, captura:1.6, desc:'Atrapa mejor que la común.', colores:['#3B82D6','#FFFFFF']},
  {id:'ultracapsula', nom:'Ultra cápsula', precio:220, nivel:6, captura:2.4, desc:'Casi nada se le escapa.', colores:['#7A4FC9','#FFD24A']},
  {id:'jarabe', nom:'Jarabe', precio:30, nivel:1, cura:25, desc:'Recupera 25 de vida.', colores:['#FF7FA3']},
  {id:'jarabemax', nom:'Jarabe grande', precio:80, nivel:3, cura:70, desc:'Recupera 70 de vida.', colores:['#4CC27A']},
];
OBJETOS.forEach(o => o.tipoObj = o.captura ? 'capsula' : 'cura');

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

/* ---------------- Reglas de combate ---------------- */
function poderesDe(esp, nivel){
  const def = SALVAJES[esp] || ESPECIES_COMBATE[esp];
  const lista = def.aprende.filter(([n]) => n <= nivel).map(([, m]) => m);
  return [...new Set(lista)].slice(-4);
}
function tipoDe(esp){ return (SALVAJES[esp] || ESPECIES_COMBATE[esp]).tipo; }
function nombreEspecie(esp){ return SALVAJES[esp] ? SALVAJES[esp].nombre : ESPECIES[esp].nombre; }
function vidaMax(stats, nivel){ return Math.round(14 + stats.vida * 1.2 + nivel * 4); }
function statsPorNivel(base, nivel){
  return {vida: base.vida + (nivel-1)*2, fuerza: Math.round(base.fuerza + (nivel-1)*.8), velocidad: Math.round(base.velocidad + (nivel-1)*.8)};
}
function calcularDanio(atacante, defensor, mov){
  const atk = atacante.stats.fuerza * (atacante.modFuerza || 1) * (atacante.penal || 1);
  const def = 4 + defensor.stats.vida * .35 + defensor.nivel * .5;
  const stab = mov.tipo === atacante.tipo ? 1.25 : 1;
  const ef = efectividad(mov.tipo, defensor.tipo);
  const azar = .85 + Math.random() * .15;
  const critico = Math.random() < .06 ? 1.5 : 1;
  const base = (mov.poder * (2 + atacante.nivel * .25) * atk / def) / 10 + 2;
  const salvaje = atacante.salvaje ? .62 : (atacante.mult || 1);
  return { danio: Math.max(1, Math.round(base * stab * ef * azar * critico * salvaje)), ef, critico: critico > 1 };
}
function crearSalvaje(zonaId){
  const z = ZONAS[zonaId];
  const total = z.aparecen.reduce((s, [, p]) => s + p, 0);
  let r = Math.random() * total, esp = z.aparecen[0][0];
  for(const [e, p] of z.aparecen){ if((r -= p) < 0){ esp = e; break; } }
  const sp = SALVAJES[esp];
  const nivel = z.niveles[0] + Math.floor(Math.random() * (z.niveles[1] - z.niveles[0] + 1)) + (esp === 'yaguarayo' ? 2 : 0);
  const stats = statsPorNivel(sp.base, nivel);
  return { esp, nombre: sp.nombre, nivel, stats, hp: vidaMax(stats, nivel), tipo: sp.tipo, salvaje: true };
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

function svgEspecie(esp, o = {}){
  if(ESPECIES[esp]) return svgCriatura(esp, o);
  const humor = o.humor === 'mal' ? {enojo:true} : {};
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${SOMBRA}<g class="cuerpo">${DIBUJOS[esp]({...humor, ...o})}</g></svg>`;
}

/* ---------------- Especies de las regiones nuevas ---------------- */
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
