'use strict';
/* =====================================================================
   Mapas de Sorlandia: regiones, edificios, personajes y salidas.
   Cada mapa se arma con una semilla fija: sale igual para todos.
   ===================================================================== */

function rng(semilla){ let s = semilla >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

function nuevoMapa(id, nombre, w, h, semilla, base, tema){
  const r = rng(semilla);
  const M = {id, nombre, w, h, tema, r, base, m: Array.from({length: h}, () => Array(w).fill(base)),
             edificios: [], puertas: {}, npcs: [], salidas: {}, zonas: [], zonaBase: null};
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
const BLOQUEA = new Set(['T', '~', '#', 'R', 'H', '!']);

/* ---------------- Personajes ---------------- */
// tipo: vecino (charla), entrenador (pelea una vez), guardia (corta el paso sin medalla).
function entrenador(id, x, y, titulo, nombre, equipo, premio, antes, despues, ropa){
  return {id, x, y, tipo: 'entrenador', titulo, nombre, equipo, premio, antes, despues, ropa};
}

/* ---------------- Líderes ---------------- */
const LIDERES = {
  tosca:{id:'tosca', titulo:'Líder', nombre:'Tosca', medalla:'penasco', premio:400, ropa:'#8A8F99', pelo:'#C9C9C9',
    equipo:[['morrito',8],['tatupiedra',9]],
    antes:['¡Bienvenido al gimnasio de Villa Piedra!', 'Acá entrenamos duro, como las piedras de la sierra.', 'Si querés la Medalla Peñasco, vas a tener que romperme la defensa.'],
    despues:['¡Uf! Me rompiste el caparazón.', 'Te ganaste la Medalla Peñasco. Con ella, el guardia del camino al puerto te deja pasar.'],
    yaGano:'Ya tenés mi medalla. Seguí hacia Puerto Camalote, al este de Pueblo Ceibo.'},
  iara:{id:'iara', titulo:'Líder', nombre:'Capitana Iara', medalla:'camalote', premio:700, ropa:'#3B82D6', pelo:'#2A2420',
    equipo:[['bagrecito',12],['carpinchito',12],['bagrecito',13]],
    antes:['¡Ahoy! Soy la Capitana Iara.', 'En este puerto el agua manda. ¿Vas a nadar o te vas a hundir?'],
    despues:['¡Me dejaste a la deriva!', 'Tomá la Medalla Camalote. El camino al norte, a Cerro Tormenta, ya está abierto.'],
    yaGano:'Ya navegaste conmigo. Cerro Tormenta queda al norte del puerto.'},
  fulgencio:{id:'fulgencio', titulo:'Líder', nombre:'Fulgencio', medalla:'relampago', premio:1000, ropa:'#4656A0', pelo:'#FFD23F',
    equipo:[['chispulo',15],['nubarron',16],['yaguarayo',17]],
    antes:['¿Sentís el aire cargado? Es mi equipo, que ya te tiene ganas.', 'Soy Fulgencio. Si aguantás la tormenta, la medalla es tuya.'],
    despues:['¡Me dejaste sin batería!', 'La Medalla Relámpago es tuya. Al norte, en Monte Fogón, te espera el último líder.'],
    yaGano:'Ya te ganaste el relámpago. Andá a Monte Fogón, al norte.'},
  rulo:{id:'rulo', titulo:'Líder', nombre:'Don Rulo', medalla:'brasa', premio:1400, ropa:'#C2412B', pelo:'#3B2A22',
    equipo:[['brasita',19],['zorrolumbre',20],['zorrolumbre',21]],
    antes:['¡Pasá, pasá, que el fuego está a punto!', 'Soy Don Rulo, el último líder de Sorlandia.', 'A ver si tu equipo aguanta el calor de la parrilla.'],
    despues:['¡Se me apagó el fogón!', 'Te llevás la Medalla Brasa. ¡Con las cuatro medallas sos campeón de Sorlandia!'],
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
  M.edificio(16, 21, 5, 'casa', null, {color:'#6BAF5B'});
  M.edificio(2, 21, 5, 'casa', null, {color:'#4F86C6'});
  M.edificio(20, 26, 5, 'casa', null, {color:'#6BAF5B'});
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
    frases:['¡Hola, nene! ¿Así que saliste de aventura?', 'En Sorlandia hay cuatro líderes. Si les ganás, te dan una medalla cada uno.', 'El primero está en Villa Piedra, subiendo por el norte. Antes entrená bien en la pradera.', 'Y acordate: si tu equipo queda cansado, volvé a casa que se recupera.']});
  M.npc(entrenador('facu', 14, 17, 'Pibe', 'Facu', [['pampito',3],['hornerito',3]], 60,
    ['¡Eh, vos! Recién empiezo, pero mis bichos ya están re entrenados.'], ['¡Qué bárbaro! Tengo que entrenar más.'], '#4CC27A'));
  M.npc(entrenador('juli', 33, 11, 'Exploradora', 'Juli', [['ceibin',5],['chispulo',5]], 90,
    ['Shh... en este bosque viven criaturas rarísimas. Primero, una pelea.'], ['Dicen que acá vive un Yaguarayo. Yo nunca lo vi.'], '#F2B63D'));
  M.npc(entrenador('beto', 8, 7, 'Montañista', 'Beto', [['tatupiedra',6],['cardoncito',6]], 120,
    ['¡Las sierras son mías! Bueno, de mis bichos.'], ['Para Tosca vas a necesitar ataques de Agua o de Planta, que a la Piedra le pegan fuerte.'], '#A9612F'));
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
  M.edificio(4, 17, 5, 'posada', 'posada');
  M.edificio(21, 17, 5, 'almacen', 'almacen');
  M.edificio(4, 21, 5, 'casa', null, {color:'#A9612F'});
  M.borde('#');
  M.camino(15, 24, 15, 24);
  M.salida(15, 25, 'ceibo', 11, 1);
  M.npc({id:'vecino_vp', x:11, y:16, tipo:'vecino', nombre:'Don Ernesto', ropa:'#7E5434', pelo:'#E9E2D3', suelo:':',
    frases:['Villa Piedra, tierra de cardones y piedra dura.', 'Tosca, la líder, usa criaturas de tipo Piedra.', 'Los ataques de Agua y de Planta le hacen mucho daño. Y el Rayo no le hace casi nada.']});
  M.npc(entrenador('ana', 13, 6, 'Escaladora', 'Ana', [['morrito',7],['condorcito',7]], 140,
    ['¡Desde acá arriba te vi venir! A ver qué tan fuerte sos.'], ['Bien ahí. Tosca te va a costar, pero podés.'], '#E2574C'));
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
  M.edificio(8, 13, 5, 'posada', 'posada');
  M.edificio(16, 13, 5, 'almacen', 'almacen');
  M.edificio(10, 18, 7, 'gimnasio', {lider:'iara'}, {color:'#3B82D6', tipoGym:'agua'});
  M.rect(10, 20, 16, 21, ':');
  M.borde('T');
  M.salida(0, 14, 'ceibo', 37, 25);
  for(let x = 1; x <= 34; x++) if(x !== 14) M.m[1][x] = 'T';
  M.camino(14, 1, 14, 2);
  M.salida(14, 0, 'tormenta', 16, 26);
  M.npc({id:'guardia_camalote', x:14, y:2, tipo:'guardia', nombre:'Guardia Nelly', requiere:'camalote', ropa:'#2F4A7A', pelo:'#7E5434',
    frases:['Más allá está Cerro Tormenta. Cae cada rayo que da miedo.', 'Solo pasa quien tenga la Medalla Camalote de la Capitana Iara.'],
    abierto:['Con esa medalla vas a aguantar la tormenta. ¡Pasá!']});
  M.npc({id:'vecino_cam', x:21, y:16, tipo:'vecino', nombre:'Marinero Coco', ropa:'#FFFFFF', pelo:'#22304A', suelo:':',
    frases:['La Capitana Iara pelea con criaturas de Agua.', 'Lo que mejor les pega es el Rayo y la Planta. Con Fuego, ni lo intentes.']});
  M.npc(entrenador('lalo', 6, 6, 'Pescador', 'Lalo', [['bagrecito',10],['carpinchito',10]], 200,
    ['¡Picó uno! Ah, no, sos vos. Bueno, peleemos igual.'], ['Hoy no pica nada...'], '#5E7E9E'));
  M.npc(entrenador('uma', 19, 24, 'Marinera', 'Uma', [['hornerito',11],['bagrecito',11]], 220,
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
  M.edificio(7, 13, 5, 'posada', 'posada');
  M.edificio(20, 13, 5, 'almacen', 'almacen');
  M.edificio(13, 17, 7, 'gimnasio', {lider:'fulgencio'}, {color:'#4656A0', tipoGym:'rayo'});
  M.rect(13, 19, 15, 19, ':'); M.rect(17, 19, 19, 19, ':');
  M.borde('T');
  M.salida(16, 27, 'camalote', 14, 1);
  for(let x = 1; x <= 30; x++) if(x !== 16) M.m[1][x] = 'T';
  M.camino(16, 1, 16, 2);
  M.salida(16, 0, 'fogon', 16, 24);
  M.npc({id:'guardia_tormenta', x:16, y:2, tipo:'guardia', nombre:'Guardia Tito', requiere:'relampago', ropa:'#2F4A7A', pelo:'#C9C9C9',
    frases:['El camino a Monte Fogón quema, literalmente.', 'Volvé cuando tengas la Medalla Relámpago de Fulgencio.'],
    abierto:['¡Una Medalla Relámpago! Pasá, y llevá agua que allá hace calor.']});
  M.npc({id:'vecino_tor', x:11, y:18, tipo:'vecino', nombre:'Abuela Rayén', ropa:'#7A4FC9', pelo:'#E9E2D3', suelo:':',
    frases:['Fulgencio usa criaturas de Rayo. Son rápidas como la luz.', 'Las de Piedra casi no sienten la electricidad. Pensalo.']});
  M.npc(entrenador('nubia', 8, 7, 'Meteoróloga', 'Nubia', [['nubarron',14],['chispulo',14]], 300,
    ['Mi pronóstico: tormenta fuerte sobre tu equipo.'], ['Le erré al pronóstico.'], '#8A93B8'));
  M.npc(entrenador('rayito', 24, 8, 'Pibe', 'Rayito', [['chispulo',15],['condorcito',15]], 320,
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
  M.edificio(7, 13, 5, 'posada', 'posada');
  M.edificio(20, 13, 5, 'almacen', 'almacen');
  M.edificio(13, 18, 7, 'gimnasio', {lider:'rulo'}, {color:'#C2412B', tipoGym:'fuego'});
  M.rect(13, 20, 15, 21, ':'); M.rect(17, 20, 19, 21, ':');
  M.borde('#');
  M.salida(16, 25, 'tormenta', 16, 1);
  M.npc({id:'vecino_fog', x:11, y:19, tipo:'vecino', nombre:'Doña Pocha', ropa:'#F2B63D', pelo:'#3B2A22', suelo:':',
    frases:['Don Rulo es el líder más fuerte de todos.', 'Sus criaturas de Fuego no aguantan el Agua ni la Piedra.']});
  M.npc(entrenador('pocha', 8, 8, 'Parrillera', 'Mirta', [['zorrolumbre',18],['brasita',18]], 400,
    ['¿Sentís el olorcito? Es mi equipo, que está que arde.'], ['Se me quemaron las achuras...'], '#C2412B'));
  M.npc(entrenador('baqueano', 23, 9, 'Baqueano', 'Tito', [['morrito',19],['tatupiedra',19]], 420,
    ['Conozco cada piedra de este volcán. Y mis bichos también.'], ['Buena pelea, gurí.'], '#7E5434'));
  M.zonas = [['fogon', 1, 12, 30, 24], ['volcan', 1, 1, 30, 11]];
  M.zonaBase = 'volcan';
  return M;
}

const MAPAS = {};
[mapaCeibo, mapaVillaPiedra, mapaCamalote, mapaTormenta, mapaFogon].forEach(f => { const M = f(); MAPAS[M.id] = M; });
const SALIDA_CASA = {mapa: 'ceibo', x: 11, y: 24};

function zonaEn(M, x, y){
  for(const [z, x0, y0, x1, y1] of M.zonas) if(x >= x0 && x <= x1 && y >= y0 && y <= y1) return z;
  return M.zonaBase;
}
function npcEn(M, x, y){ return M.npcs.find(n => n.x === x && n.y === y && !(n.tipo === 'guardia' && guardiaAbierto(n))); }
function guardiaAbierto(n){ return typeof S !== 'undefined' && S && S.medallas && S.medallas[n.requiere]; }
function transitable(M, x, y){
  return x >= 0 && y >= 0 && x < M.w && y < M.h && !BLOQUEA.has(M.m[y][x]) && !npcEn(M, x, y);
}
