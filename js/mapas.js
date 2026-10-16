'use strict';
/* =====================================================================
   Mapas de Sorlandia: regiones, edificios, personajes y salidas.
   Cada mapa se arma con una semilla fija: sale igual para todos.
   ===================================================================== */

function rng(semilla){ let s = semilla >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

function nuevoMapa(id, nombre, w, h, semilla, base, tema){
  const r = rng(semilla);
  const M = {id, nombre, w, h, tema, r, base, m: Array.from({length: h}, () => Array(w).fill(base)),
             edificios: [], puertas: {}, npcs: [], salidas: {}, zonas: [], zonaBase: null, items: [], altares: {}, muebles: []};
  const en = (x, y) => x > 0 && y > 0 && x < w - 1 && y < h - 1;
  M.set = (x, y, c) => { if(en(x, y)) M.m[y][x] = c; };
  M.rect = (x0, y0, x1, y1, c) => { for(let y = y0; y <= y1; y++) for(let x = x0; x <= x1; x++) M.set(x, y, c); };
  M.mancha = (x0, y0, x1, y1, cant, c, rmin = 1, rmax = 3) => {
    for(let i = 0; i < cant; i++){
      const cx = x0 + Math.floor(r() * (x1 - x0 + 1)), cy = y0 + Math.floor(r() * (y1 - y0 + 1));
      const rad = rmin + r() * (rmax - rmin);
      for(let y = Math.floor(cy - rad); y <= cy + rad; y++)
        for(let x = Math.floor(cx - rad); x <= cx + rad; x++)
          if(x >= x0 && x <= x1 && y >= y0 && y <= y1 && Math.hypot(x - cx, y - cy) <= rad) M.set(x, y, c);
    }
  };
  M.salpicar = (x0, y0, x1, y1, prob, c, sobre = null) => {
    for(let y = y0; y <= y1; y++) for(let x = x0; x <= x1; x++)
      if(r() < prob && (!sobre || sobre.includes(M.m[y][x]))) M.set(x, y, c);
  };
  M.camino = (x0, y0, x1, y1, c = '=') => {
    for(let y = Math.min(y0, y1); y <= Math.max(y0, y1); y++)
      for(let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++)
        if(en(x, y)) M.m[y][x] = M.m[y][x] === '~' ? 'b' : c;
  };
  // Edificio: techo en y0, pared en y0+1, puerta en el medio.
  M.edificio = (x0, y0, ancho, tipo, accion, extra = {}) => {
    for(let x = x0; x < x0 + ancho; x++){ M.m[y0][x] = 'R'; M.m[y0 + 1][x] = 'H'; }
    const px = x0 + Math.floor(ancho / 2);
    M.edificios.push({x: x0, y: y0, ancho, tipo, ...extra});
    if(accion){ M.m[y0 + 1][px] = 'D'; M.puertas[px + ',' + (y0 + 1)] = accion; }
  };
  M.borde = c => {
    for(let x = 0; x < w; x++){ M.m[0][x] = c; M.m[h - 1][x] = c; }
    for(let y = 0; y < h; y++){ M.m[y][0] = c; M.m[y][w - 1] = c; }
  };
  M.salida = (x, y, a, ax, ay) => { M.m[y][x] = '='; M.salidas[x + ',' + y] = {mapa: a, x: ax, y: ay}; };
  M.npc = (n) => { if(BLOQUEA.has(M.m[n.y][n.x]) || M.m[n.y][n.x] === ',') M.m[n.y][n.x] = n.suelo || '.'; M.npcs.push(n); };
  return M;
}
const BLOQUEA = new Set(['T', '~', '#', 'R', 'H', '!', 'W', 'm', 'A']);

/* ---------------- Personajes ---------------- */
// tipo: vecino (charla), entrenador (pelea una vez), guardia (corta el paso sin medalla).
function entrenador(id, x, y, titulo, nombre, equipo, premio, antes, despues, ropa){
  return {id, x, y, tipo: 'entrenador', titulo, nombre, equipo, premio, antes, despues, ropa};
}

/* ---------------- Líderes ---------------- */
// El Cuartel Supremo: cuatro miembros y la campeona, en fila y sin curarse en el medio.
const CUARTEL = [
  {id:'brisa', titulo:'Cuartel Supremo', nombre:'Gaucha Brisa', premio:1500, ropa:'#CFE3F7', pelo:'#E8C25A', cuartel:true,
    equipo:[['picaflor',29],['barriletazo',30],['horneron',30],['condoralto',31]],
    antes:['Bienvenido al Cuartel Supremo. Soy Brisa, la primera.', 'Mis criaturas de Viento te van a hacer volar.'],
    despues:['¡Qué ventarrón el tuyo!', 'Pasá a la siguiente sala. Te espera el Maestro Escarcha.']},
  {id:'escarcha', titulo:'Cuartel Supremo', nombre:'Maestro Escarcha', premio:1700, ropa:'#BFE9FF', pelo:'#FFFFFF', cuartel:true,
    equipo:[['escarchon',30],['pinguinazo',31],['huemul',31],['glaciaro',32]],
    antes:['Brrr. Llegaste hasta acá con el corazón caliente.', 'Vamos a ver cuánto aguanta el frío de la cumbre.'],
    despues:['Me derretiste. Increíble.', 'Seguí. Doña Raíz te espera en la sala verde.']},
  {id:'raiz', titulo:'Cuartel Supremo', nombre:'Doña Raíz', premio:1900, ropa:'#4F9A3F', pelo:'#6B4226', cuartel:true,
    equipo:[['jacaranda',31],['cardonal',31],['hormigazo',32],['yerbatero',33]],
    antes:['Las raíces más profundas aguantan cualquier tormenta.', 'Mi equipo tiene paciencia. ¿Y el tuyo?'],
    despues:['Me arrancaste de raíz, pibe.', 'Falta uno: el Coronel Trueno. Después, la Campeona.']},
  {id:'trueno', titulo:'Cuartel Supremo', nombre:'Coronel Trueno', premio:2100, ropa:'#4656A0', pelo:'#2A2420', cuartel:true,
    equipo:[['tormenton',32],['geodon',32],['voltazo',33],['cerrazo',34]],
    antes:['¡Firmes! Soy el Coronel Trueno, el último miembro del Cuartel.', 'Rayo y piedra: nada pasa por esta puerta.'],
    despues:['¡Retirada! Me ganaste en buena ley.', 'La Campeona Aurora te espera en la sala del trono. Suerte.']},
  {id:'aurora', titulo:'Campeona', nombre:'Aurora', premio:3500, ropa:'#FFD23F', pelo:'#B5452B', cuartel:true, campeona:true,
    equipo:[['nanduron',34],['sapucay',35],['carpinchon',35],['fogonazo',35],['zorrofogon',36],['tatupenon',36]],
    antes:['Así que llegaste hasta la sala del trono.', 'Soy Aurora, la Campeona de Sorlandia. Hace años que nadie me gana.', 'Mostrame todo lo que aprendiste en el viaje.'],
    despues:['...Increíble. Me ganaste.', '¡Sos el nuevo Campeón de Sorlandia! Tu nombre queda en el Salón de la Fama.']},
];

const LIDERES = {
  tosca:{id:'tosca', titulo:'Líder', nombre:'Graciela', medalla:'penasco', premio:400, ropa:'#8A8F99', pelo:'#C9C9C9',
    equipo:[['fosilito',10],['morrito',11],['tatupiedra',12]],
    antes:['¡Bienvenido al gimnasio de Villa Piedra!', 'Acá entrenamos duro, como las piedras de la sierra.', 'Si querés la Medalla Peñasco, vas a tener que romperme la defensa.'],
    despues:['¡Uf! Me rompiste el caparazón.', 'Te ganaste la Medalla Peñasco. Con ella, el guardia del camino al puerto te deja pasar.'],
    yaGano:'Ya tenés mi medalla. Seguí hacia Puerto Camalote, al este de Pueblo Ceibo.'},
  iara:{id:'iara', titulo:'Líder', nombre:'Capitana Vero', medalla:'camalote', premio:700, ropa:'#3B82D6', pelo:'#2A2420',
    equipo:[['ranacua',14],['bagrecito',15],['carpincho',16]],
    antes:['¡Ahoy! Soy la Capitana Vero.', 'En este puerto el agua manda. ¿Vas a nadar o te vas a hundir?'],
    despues:['¡Me dejaste a la deriva!', 'Tomá la Medalla Camalote. El camino al norte, a Cerro Tormenta, ya está abierto.'],
    yaGano:'Ya navegaste conmigo. Cerro Tormenta queda al norte del puerto.'},
  fulgencio:{id:'fulgencio', titulo:'Líder', nombre:'Gustavo', medalla:'relampago', premio:1000, ropa:'#4656A0', pelo:'#FFD23F',
    equipo:[['pilon',18],['nubarron',19],['chispon',19],['yaguarayo',20]],
    antes:['¿Sentís el aire cargado? Es mi equipo, que ya te tiene ganas.', 'Soy Gustavo. Si aguantás la tormenta, la medalla es tuya.'],
    despues:['¡Me dejaste sin batería!', 'La Medalla Relámpago es tuya. Al norte, en Monte Fogón, te espera el último líder.'],
    yaGano:'Ya te ganaste el relámpago. Andá a Monte Fogón, al norte.'},
  rulo:{id:'rulo', titulo:'Líder', nombre:'Don Rubén', medalla:'brasa', premio:1400, ropa:'#C2412B', pelo:'#3B2A22',
    equipo:[['fogonero',22],['ajipicante',23],['brasero',24],['zorrolumbre',25]],
    antes:['¡Pasá, pasá, que el fuego está a punto!', 'Soy Don Rubén, el último líder de Sorlandia.', 'A ver si tu equipo aguanta el calor de la parrilla.'],
    despues:['¡Se me apagó el fogón!', 'Te llevás la Medalla Brasa. ¡Con las cuatro medallas sos campeón de Sorlandia!', 'Dicen que con las cuatro medallas, las leyendas de Sorlandia se dejan ver...'],
    yaGano:'¡Campeón! Volvé cuando quieras a comer un asadito.'},
};

/* ---------------- Pueblo Ceibo ---------------- */
function mapaCeibo(){
  const M = nuevoMapa('ceibo', 'Pueblo Ceibo', 40, 30, 20261016, '.', {pasto:'#8DD17C', pastoAlto:'#5FB45A', brizna:'#3F9A45', tierra:'#DFC48E', arbol:'ceibo', fondo:'#3E8E4B'});
  const {m} = M;
  // Sierras
  for(let y = 1; y <= 10; y++) for(let x = 1; x <= 15; x++) m[y][x] = 's';
  M.mancha(2, 2, 14, 9, 7, ',', 1.5, 2.8);
  M.salpicar(1, 1, 15, 10, .16, '#', ['s']);
  // Pradera
  M.mancha(2, 2, 22, 19, 16, ',', 1.6, 3.2);
  M.salpicar(16, 1, 23, 20, .04, 'T', ['.']);
  M.salpicar(1, 11, 23, 20, .03, 'T', ['.']);
  M.salpicar(1, 11, 23, 20, .06, 'f', ['.']);
  // Bosque
  M.mancha(25, 2, 37, 12, 8, ',', 1.2, 2.3);
  M.salpicar(24, 1, 38, 13, .5, 'T', ['.']);
  // Río
  for(let y = 14; y <= 28; y++){
    const off = Math.round(Math.sin(y * .55) * 1.2);
    for(let x = 29 + off; x <= 31 + off; x++) M.set(x, y, '~');
  }
  M.mancha(24, 15, 28, 27, 5, ',', 1.2, 2.2);
  M.mancha(32, 15, 38, 27, 6, ',', 1.2, 2.4);
  M.salpicar(24, 14, 38, 28, .05, 'T', ['.']);
  // Pueblo
  for(let y = 21; y <= 28; y++) for(let x = 1; x <= 26; x++) m[y][x] = '.';
  M.salpicar(1, 21, 26, 28, .07, 'f');
  M.camino(11, 24, 11, 3);
  M.camino(3, 25, 36, 25);
  M.camino(35, 25, 35, 3);
  M.camino(5, 6, 11, 6);
  M.camino(11, 14, 22, 14);
  M.edificio(9, 22, 5, 'mia', 'casa');
  M.edificio(16, 21, 5, 'centro', 'centro');
  M.edificio(2, 21, 5, 'market', 'market');
  casaConInterior(M, 20, 26, '#6BAF5B', {nombre: 'Casa de los Pérez', npc: {nombre: 'Abuelo Tito', ropa: '#7E5434', pelo: '#E9E2D3', regalo: true,
    frases: ['¡Hola, pibe! Pasá, pasá.', 'Yo de joven también recorría Sorlandia con mi Hornerito.', 'Tomá, llevate esto que a mí ya no me sirve.']}});
  M.borde('T');
  // Salidas: al norte (Villa Piedra) y al este (Puerto Camalote), con guardia
  M.camino(11, 1, 11, 3);
  M.salida(11, 0, 'villapiedra', 15, 24);
  for(let y = 14; y <= 28; y++) if(y !== 25) m[y][38] = 'T';
  M.camino(36, 25, 38, 25);
  M.salida(39, 25, 'camalote', 1, 14);
  M.npc({id:'guardia_ceibo', x:38, y:25, tipo:'guardia', nombre:'Guardia Ramón', requiere:'penasco', ropa:'#2F4A7A', pelo:'#22304A',
    frases:['Alto ahí. El camino al puerto está cortado por un derrumbe.', 'Solo dejo pasar a quien tenga la Medalla Peñasco, del gimnasio de Villa Piedra.', 'Villa Piedra queda subiendo por el camino del norte, pasando las sierras.'],
    abierto:['¡Esa es la Medalla Peñasco! Adelante, el camino al puerto está despejado.']});
  M.npc({id:'chela', x:14, y:24, tipo:'vecino', nombre:'Doña Chela', ropa:'#E07BA0', pelo:'#BFBFBF',
    frases:['¡Hola, nene! ¿Así que saliste de aventura?', 'En Sorlandia hay cuatro líderes. Si les ganás, te dan una medalla cada uno.', 'El primero está en Villa Piedra, subiendo por el norte. Antes entrená bien en la pradera.', 'Si tu equipo queda cansado, andá al Centro de Rehabilitación. En el Market venden cápsulas.', 'Ah, y mirá bien el piso: a veces hay cosas tiradas.']});
  M.npc(entrenador('facu', 14, 17, 'Pibe', 'Facu', [['pampito',4],['hornerito',4]], 60,
    ['¡Eh, vos! Recién empiezo, pero mis bichos ya están re entrenados.'], ['¡Qué bárbaro! Tengo que entrenar más.'], '#4CC27A'));
  M.npc(entrenador('juli', 33, 11, 'Exploradora', 'Juli', [['ceibin',6],['abejita',6]], 90,
    ['Shh... en este bosque viven criaturas rarísimas. Primero, una pelea.'], ['Dicen que acá vive un Yaguarayo. Yo nunca lo vi.'], '#F2B63D'));
  M.npc(entrenador('lolo', 5, 16, 'Cazabichos', 'Lolo', [['vaquitita',5],['grillito',5],['mariposita',6]], 80,
    ['¡Mirá mi colección de bichos! ¿Peleamos?'], ['Me tengo que conseguir más bichos.'], '#8FC77A'));
  M.npc(entrenador('sol', 26, 20, 'Pescadora', 'Sol', [['renacuajin',7],['carpinchito',7]], 100,
    ['El río está lleno de criaturas. Probá las mías.'], ['Buena mano. En el puerto hay criaturas de agua más fuertes.'], '#3B82D6'));
  M.npc(entrenador('beto', 8, 7, 'Montañista', 'Beto', [['tatupiedra',8],['cardoncito',8]], 120,
    ['¡Las sierras son mías! Bueno, de mis bichos.'], ['Para Graciela vas a necesitar ataques de Agua o de Planta, que a la Piedra le pegan fuerte.'], '#A9612F'));
  M.zonas = [['pueblo', 1, 21, 26, 28], ['sierras', 1, 1, 15, 10], ['bosque', 24, 1, 38, 13], ['rio', 24, 14, 38, 28], ['pradera', 1, 1, 23, 20]];
  M.zonaBase = 'pradera';
  return M;
}

/* ---------------- Villa Piedra ---------------- */
function mapaVillaPiedra(){
  const M = nuevoMapa('villapiedra', 'Villa Piedra', 30, 26, 777, 's', {pasto:'#CFD58E', pastoAlto:'#B9A65E', brizna:'#8C7432', tierra:'#DFC48E', arbol:'cardon', fondo:'#B08C5E'});
  // Serranía (norte)
  M.mancha(1, 1, 28, 11, 14, ',', 1.4, 2.8);
  M.salpicar(1, 1, 28, 11, .12, '#', ['s']);
  M.salpicar(1, 1, 28, 11, .05, 'T', ['s']);
  // Pueblo de piedra
  M.rect(3, 13, 26, 23, ':');
  M.salpicar(3, 14, 26, 23, .05, 'f', [':']);
  M.camino(15, 13, 15, 24);
  M.camino(4, 20, 25, 20);
  M.camino(8, 2, 8, 13);
  M.camino(22, 2, 22, 13);
  M.camino(8, 3, 22, 3);
  M.edificio(12, 11, 7, 'gimnasio', {lider:'tosca'}, {color:'#8A8F99', tipoGym:'piedra'});
  M.rect(12, 13, 18, 13, ':');
  M.edificio(4, 17, 5, 'centro', 'centro');
  M.edificio(21, 17, 5, 'market', 'market');
  casaConInterior(M, 4, 21, '#A9612F', {nombre: 'Casa de Rosa', npc: {nombre: 'Señora Rosa', ropa: '#E07BA0', pelo: '#3B2A22', regalo: true,
    frases: ['¿Venís a desafiar a Graciela? Es durísima.', 'Mi nieto le ganó usando criaturas de Agua y de Planta.', 'Tomá, para el viaje.']}});
  M.borde('#');
  M.camino(15, 24, 15, 24);
  M.salida(15, 25, 'ceibo', 11, 1);
  M.npc({id:'vecino_vp', x:11, y:16, tipo:'vecino', nombre:'Don Ernesto', ropa:'#7E5434', pelo:'#E9E2D3', suelo:':',
    frases:['Villa Piedra, tierra de cardones y piedra dura.', 'Graciela, la líder, usa criaturas de tipo Piedra.', 'Los ataques de Agua y de Planta le hacen mucho daño. Y el Rayo no le hace casi nada.']});
  M.npc(entrenador('cacho', 24, 6, 'Minero', 'Cacho', [['fosilito',10],['cuarcito',11]], 150,
    ['Encontré estos fósiles cavando. ¡Y pelean!'], ['Me voy a seguir cavando.'], '#F2B63D'));
  M.npc(entrenador('ramiro', 4, 8, 'Gaucho', 'Ramiro', [['nandusito',11],['peludito',11],['pampero',12]], 170,
    ['¡Epa, forastero! A ver esas criaturas.'], ['¡Qué pingo bravo el tuyo!'], '#7E5434'));
  M.npc(entrenador('ana', 13, 6, 'Escaladora', 'Ana', [['morrito',10],['condorcito',10]], 140,
    ['¡Desde acá arriba te vi venir! A ver qué tan fuerte sos.'], ['Bien ahí. Graciela te va a costar, pero podés.'], '#E2574C'));
  M.zonas = [['villapiedra', 1, 12, 28, 24], ['serrania', 1, 1, 28, 11]];
  M.zonaBase = 'serrania';
  return M;
}

/* ---------------- Puerto Camalote ---------------- */
function mapaCamalote(){
  const M = nuevoMapa('camalote', 'Puerto Camalote', 36, 28, 4242, '.', {pasto:'#93D6A0', pastoAlto:'#5FB47A', brizna:'#3D9460', tierra:'#E9D7A8', arbol:'sauce', fondo:'#3E8E6B'});
  // Agua al este
  for(let y = 1; y <= 26; y++){ const off = Math.round(Math.sin(y * .4) * 1.5); for(let x = 27 + off; x <= 34; x++) M.set(x, y, '~'); }
  M.rect(25, 2, 26, 25, 's');
  // Costa: pasto alto al norte y al sur
  M.mancha(2, 2, 24, 9, 10, ',', 1.4, 2.8);
  M.mancha(2, 23, 24, 26, 6, ',', 1.2, 2.2);
  M.salpicar(1, 1, 24, 10, .05, 'T', ['.']);
  M.salpicar(1, 23, 24, 26, .05, 'T', ['.']);
  // Puerto
  M.rect(6, 12, 24, 21, ':');
  M.camino(1, 14, 6, 14);
  M.camino(14, 1, 14, 12);
  M.camino(7, 22, 7, 25);
  M.camino(20, 22, 20, 25);
  M.camino(25, 17, 31, 17);
  M.edificio(8, 13, 5, 'centro', 'centro');
  M.edificio(16, 13, 5, 'market', 'market');
  M.edificio(10, 18, 7, 'gimnasio', {lider:'iara'}, {color:'#3B82D6', tipoGym:'agua'});
  M.rect(10, 20, 16, 21, ':');
  casaConInterior(M, 19, 18, '#E2574C', {nombre: 'Casa del Capitán', npc: {nombre: 'Capitán Retirado', ropa: '#FFFFFF', pelo: '#BFBFBF', regalo: true,
    frases: ['Treinta años navegando este río...', 'Dicen que al final del muelle aparece el espíritu del río. Yo nunca lo vi.', 'Llevate esto, a mí ya no me hace falta.']}});
  M.borde('T');
  M.salida(0, 14, 'ceibo', 37, 25);
  M.m[17][32] = 'A'; M.altares['32,17'] = 'yacura';
  for(let x = 1; x <= 34; x++) if(x !== 14) M.m[1][x] = 'T';
  M.camino(14, 1, 14, 2);
  M.salida(14, 0, 'tormenta', 16, 26);
  M.npc({id:'guardia_camalote', x:14, y:2, tipo:'guardia', nombre:'Guardia Nelly', requiere:'camalote', ropa:'#2F4A7A', pelo:'#7E5434',
    frases:['Más allá está Cerro Tormenta. Cae cada rayo que da miedo.', 'Solo pasa quien tenga la Medalla Camalote de la Capitana Vero.'],
    abierto:['Con esa medalla vas a aguantar la tormenta. ¡Pasá!']});
  M.npc({id:'vecino_cam', x:21, y:16, tipo:'vecino', nombre:'Marinero Coco', ropa:'#FFFFFF', pelo:'#22304A', suelo:':',
    frases:['La Capitana Vero pelea con criaturas de Agua.', 'Lo que mejor les pega es el Rayo y la Planta. Con Fuego, ni lo intentes.']});
  M.npc(entrenador('lu', 22, 5, 'Surfista', 'Lu', [['ranacua',14],['tortuguin',15]], 230,
    ['¡Qué olas hoy! Ideal para una pelea.'], ['Me revolcó la ola.'], '#FF7FA3'));
  M.npc(entrenador('toto', 4, 24, 'Electricista', 'Toto', [['enchufin',14],['pilita',15]], 230,
    ['Ojo que mis bichos dan patada.'], ['Se me saltaron los tapones.'], '#F2B63D'));
  M.npc(entrenador('lalo', 6, 6, 'Pescador', 'Lalo', [['bagrecito',13],['carpincho',13]], 200,
    ['¡Picó uno! Ah, no, sos vos. Bueno, peleemos igual.'], ['Hoy no pica nada...'], '#5E7E9E'));
  M.npc(entrenador('uma', 19, 24, 'Marinera', 'Cami', [['hornero',14],['pejerrin',14]], 220,
    ['¡Todos a bordo! Primero tenés que pasar por mí.'], ['¡Hombre al agua! Bah, criatura al agua.'], '#E2574C'));
  M.zonas = [['camalote', 1, 11, 24, 22], ['costa', 1, 1, 34, 26]];
  M.zonaBase = 'costa';
  return M;
}

/* ---------------- Cerro Tormenta ---------------- */
function mapaTormenta(){
  const M = nuevoMapa('tormenta', 'Cerro Tormenta', 32, 28, 9090, '.', {pasto:'#86BE93', pastoAlto:'#4F8E66', brizna:'#2F6E4A', tierra:'#C9B79C', arbol:'pino', fondo:'#2F5E48', tinte:'rgba(40,50,110,.14)'});
  M.mancha(1, 2, 30, 11, 14, ',', 1.4, 3);
  M.salpicar(1, 2, 30, 11, .1, 'T', ['.']);
  M.salpicar(1, 2, 30, 11, .05, '#', ['.']);
  M.mancha(1, 21, 30, 25, 6, ',', 1.2, 2.2);
  M.salpicar(1, 21, 30, 26, .08, 'T', ['.']);
  M.rect(6, 12, 25, 20, ':');
  M.camino(16, 2, 16, 26);
  M.camino(6, 16, 25, 16);
  M.camino(5, 4, 27, 4);
  M.edificio(7, 13, 5, 'centro', 'centro');
  M.edificio(20, 13, 5, 'market', 'market');
  M.edificio(13, 17, 7, 'gimnasio', {lider:'fulgencio'}, {color:'#4656A0', tipoGym:'rayo'});
  casaConInterior(M, 7, 18, '#5A6B9C', {nombre: 'Casa del Meteorólogo', npc: {nombre: 'Don Alberto', ropa: '#4656A0', pelo: '#E9E2D3', regalo: true,
    frases: ['Estudio las tormentas de este cerro hace cuarenta años.', 'Cuando truena fuerte, allá arriba se ve un ave enorme... Huracanto, le dicen.', 'Tomá, que lo vas a necesitar.']}});
  M.rect(13, 19, 15, 19, ':'); M.rect(17, 19, 19, 19, ':');
  M.borde('T');
  M.salida(16, 27, 'camalote', 14, 1);
  M.m[3][5] = 'A'; M.altares['5,3'] = 'huracanto';
  for(let x = 1; x <= 30; x++) if(x !== 16) M.m[1][x] = 'T';
  M.camino(16, 1, 16, 2);
  M.salida(16, 0, 'fogon', 16, 24);
  M.npc({id:'guardia_tormenta', x:16, y:2, tipo:'guardia', nombre:'Guardia Tito', requiere:'relampago', ropa:'#2F4A7A', pelo:'#C9C9C9',
    frases:['El camino a Monte Fogón quema, literalmente.', 'Volvé cuando tengas la Medalla Relámpago de Gustavo.'],
    abierto:['¡Una Medalla Relámpago! Pasá, y llevá agua que allá hace calor.']});
  M.npc({id:'vecino_tor', x:12, y:20, tipo:'vecino', nombre:'Abuela Norma', ropa:'#7A4FC9', pelo:'#E9E2D3', suelo:':',
    frases:['Gustavo usa criaturas de Rayo. Son rápidas como la luz.', 'Las de Piedra casi no sienten la electricidad. Pensalo.']});
  M.npc(entrenador('nieves', 26, 23, 'Esquiadora', 'Nieves', [['escarchin',17],['pinguinito',18]], 320,
    ['¡Qué frío! Calentemos con una pelea.'], ['Me congelé del todo.'], '#BFE9FF'));
  M.npc(entrenador('rafa', 5, 23, 'Guardaparques', 'Rafa', [['huemulito',18],['picaflor',18]], 320,
    ['Cuido a las criaturas del cerro. Y peleo con ellas.'], ['Cuidalas bien, eh.'], '#4F9A3F'));
  M.npc(entrenador('nubia', 8, 7, 'Meteoróloga', 'Flor', [['nubarron',17],['chispon',17]], 300,
    ['Mi pronóstico: tormenta fuerte sobre tu equipo.'], ['Le erré al pronóstico.'], '#8A93B8'));
  M.npc(entrenador('rayito', 24, 8, 'Pibe', 'Rayito', [['pilon',18],['condorcito',18]], 320,
    ['¡Bzzz! ¡Te voy a dejar con los pelos parados!'], ['Me quedé sin chispa...'], '#FFD23F'));
  M.zonas = [['tormenta', 1, 12, 30, 20], ['cumbres', 1, 1, 30, 26]];
  M.zonaBase = 'cumbres';
  return M;
}

/* ---------------- Monte Fogón ---------------- */
function mapaFogon(){
  const M = nuevoMapa('fogon', 'Monte Fogón', 32, 26, 31337, 'v', {pasto:'#9A8676', pastoAlto:'#6E5A4A', brizna:'#4A3A30', tierra:'#9A8676', arbol:'seco', fondo:'#4A3A30'});
  M.mancha(2, 2, 29, 4, 3, '!', 1, 2);
  M.mancha(1, 3, 30, 11, 14, ',', 1.4, 2.8);
  M.salpicar(1, 2, 30, 11, .08, '#', ['v']);
  M.salpicar(1, 2, 30, 11, .05, 'T', ['v']);
  M.rect(6, 12, 25, 21, ':');
  M.camino(16, 4, 16, 24);
  M.camino(6, 17, 25, 17);
  M.camino(5, 6, 27, 6);
  M.edificio(7, 13, 5, 'centro', 'centro');
  M.edificio(20, 13, 5, 'market', 'market');
  M.edificio(13, 18, 7, 'gimnasio', {lider:'rulo'}, {color:'#C2412B', tipoGym:'fuego'});
  casaConInterior(M, 7, 18, '#C2412B', {nombre: 'Casa de la Vulcanóloga', npc: {nombre: 'Doctora Lava', ropa: '#F2B63D', pelo: '#B5452B', regalo: true,
    frases: ['Mido la temperatura del volcán todos los días.', 'En el cráter hay una luz que no es lava. Los viejos le dicen Intiraya.', 'Tomá, para que no te quemes.']}});
  M.rect(13, 20, 15, 21, ':'); M.rect(17, 20, 19, 21, ':');
  M.borde('#');
  M.salida(16, 25, 'tormenta', 16, 1);
  M.camino(27, 1, 27, 6);
  M.salida(27, 0, 'supremo', 15, 28);
  M.npc({id:'guardia_supremo', x:27, y:1, tipo:'guardia', nombre:'Guardiana Susana', requiere:'todas', ropa:'#C9A227', pelo:'#E9E2D3',
    frases:['Este sendero lleva a la Cumbre Suprema, donde está el Cuartel Supremo.', 'Solo pueden subir quienes tengan las cuatro medallas de Sorlandia.'],
    abierto:['¡Las cuatro medallas! Subí: en la cumbre te espera el Cuartel Supremo.', 'Allá vas a pelear contra los cuatro mejores entrenadores y el Campeón, uno tras otro.']});
  M.m[3][16] = 'A'; M.altares['16,3'] = 'intiraya';
  M.npc({id:'vecino_fog', x:12, y:21, tipo:'vecino', nombre:'Doña Pocha', ropa:'#F2B63D', pelo:'#3B2A22', suelo:':',
    frases:['Don Rubén es el líder más fuerte de todos.', 'Sus criaturas de Fuego no aguantan el Agua ni la Piedra.']});
  M.npc(entrenador('juan', 27, 9, 'Bombero', 'Juan', [['ranacua',22],['fogonero',23]], 420,
    ['¡Apago incendios y también criaturas!'], ['Me tiraste el balde encima.'], '#E2302E'));
  M.npc(entrenador('ema', 4, 5, 'Vulcanóloga', 'Ema', [['cuarzon',23],['fosilon',24],['ajipicante',24]], 450,
    ['Estas rocas tienen millones de años. Mis criaturas, también.'], ['Increíble. Sos un fenómeno geológico.'], '#7A4FC9'));
  M.npc(entrenador('pocha', 8, 8, 'Parrillera', 'Mirta', [['zorrolumbre',22],['brasero',22]], 400,
    ['¿Sentís el olorcito? Es mi equipo, que está que arde.'], ['Se me quemaron las achuras...'], '#C2412B'));
  M.npc(entrenador('baqueano', 23, 9, 'Baqueano', 'Tito', [['morro',23],['tatupenon',23]], 420,
    ['Conozco cada piedra de este volcán. Y mis bichos también.'], ['Buena pelea, gurí.'], '#7E5434'));
  M.zonas = [['fogon', 1, 12, 30, 24], ['volcan', 1, 1, 30, 11]];
  M.zonaBase = 'volcan';
  return M;
}

/* ---------------- Cumbre Suprema (secreta) ---------------- */
function mapaSupremo(){
  const M = nuevoMapa('supremo', 'Cumbre Suprema', 30, 30, 4444, '.', {pasto:'#9CCB8C', pastoAlto:'#5E9E6A', brizna:'#3A7A4A', tierra:'#D9C9A8', arbol:'pino', fondo:'#2F5E48', tinte:'rgba(255,170,90,.10)'});
  // Camino de la Victoria: pasto alto con criaturas fuertes
  M.mancha(1, 14, 28, 27, 16, ',', 1.4, 3);
  M.salpicar(1, 14, 28, 28, .09, 'T', ['.']);
  M.salpicar(1, 14, 28, 28, .05, '#', ['.']);
  M.camino(15, 12, 15, 28);
  M.camino(5, 20, 25, 20);
  // Ciudad en la cumbre
  M.rect(3, 2, 26, 12, ':');
  M.edificio(10, 2, 9, 'cuartel', {cuartel: true}, {color:'#C9A227'});
  M.edificio(4, 7, 5, 'centro', 'centro');
  M.edificio(21, 7, 5, 'market', 'market');
  M.salpicar(3, 5, 26, 12, .05, 'f', [':']);
  M.borde('T');
  M.salida(15, 29, 'fogon', 27, 1);
  M.npc({id:'vecino_sup', x:12, y:9, tipo:'vecino', nombre:'Cronista Romina', ropa:'#7A4FC9', pelo:'#2A2420', suelo:':',
    frases:['Bienvenido a la Cumbre Suprema. Muy pocos llegan hasta acá.', 'En el Cuartel se pelea contra cinco entrenadores seguidos, sin curarse en el medio.', 'Si salís a curarte o perdés, tenés que empezar de nuevo. Llevá jarabes.']});
  M.npc(entrenador('veterano1', 9, 17, 'Veterano', 'Osvaldo', [['ranacua',26],['pampero',26],['chispon',27]], 600,
    ['Hace veinte años que intento llegar al Cuartel. Practiquemos.'], ['Vos sí que vas a llegar.'], '#7E5434'));
  M.npc(entrenador('veterana2', 21, 23, 'Veterana', 'Marta', [['ceibal',27],['bagron',27],['condoralto',28]], 650,
    ['El Camino de la Victoria no perdona.'], ['Buen equipo. Cuidalo.'], '#E07BA0'));
  M.npc(entrenador('veterano3', 18, 14, 'As del Camino', 'Rolo', [['morro',28],['escarchon',28],['hormigon',29]], 700,
    ['Soy el último antes de la cumbre. ¡No pasás!'], ['Pasá nomás. Te ganaste el lugar.'], '#22304A'));
  M.zonas = [['supremo', 1, 1, 28, 12], ['victoria', 1, 13, 28, 28]];
  M.zonaBase = 'victoria';
  return M;
}

const MAPAS = {};
const INTERIORES = [];
// Casa del pueblo con interior propio: la puerta lleva a un mapa chiquito con un vecino y quizás algo en el piso.
function casaConInterior(M, x0, y0, color, def){
  const id = 'int_' + M.id + '_' + (INTERIORES.length + 1);
  M.edificio(x0, y0, 5, 'casa', {interior: id}, {color});
  INTERIORES.push({id, def, afuera: {mapa: M.id, x: x0 + 2, y: y0 + 2}});
}
function mapaInterior(info, n){
  const {id, def, afuera} = info;
  const M = nuevoMapa(id, def.nombre, 11, 9, 5000 + n * 97, 'p', {pasto:'#E2C29A', pastoAlto:'#E2C29A', brizna:'#C9A06A', tierra:'#E2C29A', arbol:'normal', fondo:'#3B2A22', interior:true});
  for(let x = 0; x < 11; x++){ M.m[0][x] = 'W'; M.m[1][x] = 'W'; M.m[8][x] = 'W'; }
  for(let y = 0; y < 9; y++){ M.m[y][0] = 'W'; M.m[y][10] = 'W'; }
  const opciones = [['cama', 1, 2], ['estante', 3, 2], ['estante', 4, 2], ['tele', 7, 2], ['planta', 9, 2], ['mesa', 6, 5], ['planta', 1, 7], ['sillon', 8, 6]];
  opciones.forEach(([tipo, x, y]) => { if(M.r() < .7){ M.m[y][x] = 'm'; M.muebles.push({tipo, x, y}); } });
  M.muebles.push({tipo: 'alfombra', x: 4, y: 5});
  M.salida(5, 8, afuera.mapa, afuera.x, afuera.y);
  M.m[8][5] = 'x';
  M.npc({id: id + '_npc', x: 3, y: 4, tipo: 'vecino', suelo: 'p', ...def.npc});
  if(M.r() < .6) M.items.push({id: id + '_it', x: 8, y: 4});
  M.zonas = [['interior', 0, 0, 10, 8]]; M.zonaBase = 'interior';
  return M;
}
// Objetos tirados en el piso: lugares fijos (salen de la semilla), contenido sorpresa.
function repartirObjetos(M, cant){
  const r = rng(M.w * 1000 + M.h * 37 + M.id.length * 7);
  // Solo lugares a los que se puede llegar caminando desde la primera salida.
  const [sx, sy] = Object.keys(M.salidas)[0].split(',').map(Number);
  const alcanzable = new Set([sx + ',' + sy]), cola = [[sx, sy]];
  while(cola.length){
    const [x, y] = cola.shift();
    for(const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const nx = x + dx, ny = y + dy, k = nx + ',' + ny;
      if(nx < 0 || ny < 0 || nx >= M.w || ny >= M.h || alcanzable.has(k) || BLOQUEA.has(M.m[ny][nx])) continue;
      alcanzable.add(k); cola.push([nx, ny]);
    }
  }
  const libres = [];
  for(let y = 2; y < M.h - 2; y++) for(let x = 2; x < M.w - 2; x++){
    const c = M.m[y][x];
    if(!['.', ',', 's', 'v', 'f'].includes(c) || !alcanzable.has(x + ',' + y)) continue;
    if(M.npcs.some(n => Math.abs(n.x - x) + Math.abs(n.y - y) < 2)) continue;
    if(M.puertas[x + ',' + (y - 1)]) continue;
    libres.push([x, y]);
  }
  for(let i = 0; i < cant && libres.length; i++){
    const [x, y] = libres.splice(Math.floor(r() * libres.length), 1)[0];
    M.items.push({id: 'it_' + M.id + '_' + i, x, y});
  }
}
[mapaCeibo, mapaVillaPiedra, mapaCamalote, mapaTormenta, mapaFogon, mapaSupremo].forEach(f => { const M = f(); repartirObjetos(M, 4); MAPAS[M.id] = M; });
INTERIORES.forEach((info, n) => { const M = mapaInterior(info, n); MAPAS[M.id] = M; });
const SALIDA_CASA = {mapa: 'ceibo', x: 11, y: 24};

function zonaEn(M, x, y){
  for(const [z, x0, y0, x1, y1] of M.zonas) if(x >= x0 && x <= x1 && y >= y0 && y <= y1) return z;
  return M.zonaBase;
}
function npcEn(M, x, y){ return M.npcs.find(n => n.x === x && n.y === y && !(n.tipo === 'guardia' && guardiaAbierto(n))); }
function itemEn(M, x, y){ return M.items.find(it => it.x === x && it.y === y && !(S && S.recogidos[it.id])); }
function guardiaAbierto(n){
  if(typeof S === 'undefined' || !S || !S.medallas) return false;
  return n.requiere === 'todas' ? MEDALLAS.every(m => S.medallas[m.id]) : !!S.medallas[n.requiere];
}
function transitable(M, x, y){
  return x >= 0 && y >= 0 && x < M.w && y < M.h && !BLOQUEA.has(M.m[y][x]) && !npcEn(M, x, y);
}
