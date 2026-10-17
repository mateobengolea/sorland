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
  {id:'brisa', titulo:'Cuartel Supremo', nombre:'Gaucha Elsa Pito', premio:1500, ropa:'#CFE3F7', pelo:'#E8C25A', cuartel:true,
    equipo:[['picaflor',29],['barriletazo',30],['horneron',30],['condoralto',31]],
    antes:['Bienvenido al Cuartel Supremo. Soy Brisa, la primera.', 'Mis criaturas de Viento te van a hacer volar.'],
    despues:['¡Qué ventarrón el tuyo!', 'Pasá a la siguiente sala. Te espera el Maestro Ezequiel Ado.']},
  {id:'escarcha', titulo:'Cuartel Supremo', nombre:'Maestro Ezequiel Ado', premio:1700, ropa:'#BFE9FF', pelo:'#FFFFFF', cuartel:true,
    equipo:[['escarchon',30],['pinguinazo',31],['huemul',31],['glaciaro',32]],
    antes:['Brrr. Llegaste hasta acá con el corazón caliente.', 'Vamos a ver cuánto aguanta el frío de la cumbre.'],
    despues:['Me derretiste. Increíble.', 'Seguí. Doña Mary Posa te espera en la sala verde.']},
  {id:'raiz', titulo:'Cuartel Supremo', nombre:'Doña Mary Posa', premio:1900, ropa:'#4F9A3F', pelo:'#6B4226', cuartel:true,
    equipo:[['jacaranda',31],['cardonal',31],['hormigazo',32],['yerbatero',33]],
    antes:['Las raíces más profundas aguantan cualquier tormenta.', 'Mi equipo tiene paciencia. ¿Y el tuyo?'],
    despues:['Me arrancaste de raíz, pibe.', 'Falta uno: el Coronel Elder Rumbe. Después, la Campeona.']},
  {id:'trueno', titulo:'Cuartel Supremo', nombre:'Coronel Elder Rumbe', premio:2100, ropa:'#4656A0', pelo:'#2A2420', cuartel:true,
    equipo:[['tormenton',32],['geodon',32],['voltazo',33],['cerrazo',34]],
    antes:['¡Firmes! Soy el Coronel Elder Rumbe, el último miembro del Cuartel.', 'Rayo y piedra: nada pasa por esta puerta.'],
    despues:['¡Retirada! Me ganaste en buena ley.', 'La Campeona Dolores Fuertes te espera en la sala del trono. Suerte.']},
  {id:'aurora', titulo:'Campeona', nombre:'Dolores Fuertes', premio:3500, ropa:'#FFD23F', pelo:'#B5452B', cuartel:true, campeona:true,
    equipo:[['nanduron',34],['sapucay',35],['carpinchon',35],['fogonazo',35],['zorrofogon',36],['tatupenon',36]],
    antes:['Así que llegaste hasta la sala del trono.', 'Soy Dolores Fuertes, la Campeona de Sorlandia. Hace años que nadie me gana.', 'Mostrame todo lo que aprendiste en el viaje.'],
    despues:['...Increíble. Me ganaste.', '¡Sos el nuevo Campeón de Sorlandia! Tu nombre queda en el Salón de la Fama.']},
];

const LIDERES = {
  flor:{id:'flor', titulo:'Líder', nombre:'Flor Cita', medalla:'ombu', mov:'selva', tipoGym:'planta', premio:250, ropa:'#4FA03C', pelo:'#E9709A',
    equipo:[['brotecito',7],['honguito',8],['ceibin',9]],
    antes:['¡Hola! Soy Flor Cita, la líder de Pueblo Ceibo.', 'Mis criaturas crecen al sol, como los ceibos. ¿Me mostrás cómo peleás?'],
    despues:['¡Me marchitaste!', 'Te ganaste la Medalla Ombú. Ahora andá a Villa Piedra, al norte del pueblo.'],
    yaGano:'Ya tenés la Medalla Ombú. Villa Piedra queda al norte.'},
  saltamontes:{id:'saltamontes', titulo:'Líder', nombre:'Elsa Ltamontes', medalla:'panal', mov:'tabano', tipoGym:'bicho', premio:550, ropa:'#8DBF3A', pelo:'#3B2A22',
    equipo:[['grillito',12],['abejita',13],['mamboreta',13],['hormigon',14]],
    antes:['¡Shh! ¿Escuchás el zumbido?', 'Soy Elsa Ltamontes. Los bichos parecen chiquitos, pero pican fuerte.'],
    despues:['¡Me dejaste patas para arriba!', 'Tomá la Medalla Panal. Con ella vas a poder iluminar la Cueva Oscura. Ahora seguí hacia Puerto Camalote, al este de Pueblo Ceibo.'],
    yaGano:'Ya tenés la Medalla Panal. ¡Zumbá para el puerto!'},
  tornado:{id:'tornado', titulo:'Líder', nombre:'Aitor Nado', medalla:'pampero', mov:'zonda', tipoGym:'viento', premio:850, ropa:'#9FD4F5', pelo:'#FFFFFF',
    equipo:[['picaflor',16],['barrilete',16],['condoralto',17],['hornero',18]],
    antes:['¿Sentís esa brisa? Soy yo calentando.', 'Soy Aitor Nado. Mis criaturas vuelan más alto que los barriletes.'],
    despues:['¡Me dejaste sin aire!', 'La Medalla Pampero es tuya. Al norte de Villa Barrilete está Cerro Tormenta.'],
    yaGano:'Ya volaste conmigo. Cerro Tormenta queda al norte de Villa Barrilete.'},
  patinaje:{id:'patinaje', titulo:'Líder', nombre:'Paty Naje', medalla:'glaciar', mov:'helada', tipoGym:'hielo', premio:1200, ropa:'#BFE9FF', pelo:'#5A6B8C',
    equipo:[['escarchin',20],['pinguinazo',21],['huemul',21],['escarchon',22]],
    antes:['Cuidado, que el piso resbala.', 'Soy Paty Naje. Patino sobre el hielo y congelo a quien se me ponga adelante.'],
    despues:['¡Me derretiste!', 'Te llevás la Medalla Glaciar. Al norte, pasando la Cueva Oscura, está Monte Fogón.'],
    yaGano:'Ya tenés la Medalla Glaciar. Monte Fogón queda al norte.'},
  tosca:{id:'tosca', titulo:'Líder', nombre:'Estela Gartija', medalla:'penasco', mov:'terremoto', tipoGym:'piedra', premio:400, ropa:'#8A8F99', pelo:'#C9C9C9',
    equipo:[['fosilito',10],['morrito',11],['tatupiedra',12]],
    antes:['¡Bienvenido al gimnasio de Villa Piedra!', 'Acá entrenamos duro, como las piedras de la sierra.', 'Si querés la Medalla Peñasco, vas a tener que romperme la defensa.'],
    despues:['¡Uf! Me rompiste el caparazón.', 'Te ganaste la Medalla Peñasco. Con ella, tus criaturas pueden correr la roca que tapa el camino al puerto.'],
    yaGano:'Ya tenés mi medalla. Seguí hacia Puerto Camalote, al este de Pueblo Ceibo.'},
  iara:{id:'iara', titulo:'Líder', nombre:'Capitana Elsa Lado', medalla:'camalote', mov:'torrente', tipoGym:'agua', premio:700, ropa:'#3B82D6', pelo:'#2A2420',
    equipo:[['ranacua',14],['bagrecito',15],['carpincho',16]],
    antes:['¡Ahoy! Soy la Capitana Elsa Lado.', 'En este puerto el agua manda. ¿Vas a nadar o te vas a hundir?'],
    despues:['¡Me dejaste a la deriva!', 'Tomá la Medalla Camalote. Con Surf vas a poder cruzar el canal hacia Cerro Tormenta.'],
    yaGano:'Ya navegaste conmigo. Cerro Tormenta queda al norte del puerto.'},
  fulgencio:{id:'fulgencio', titulo:'Líder', nombre:'Aitor Menta', medalla:'relampago', mov:'descarga', tipoGym:'rayo', premio:1000, ropa:'#4656A0', pelo:'#FFD23F',
    equipo:[['pilon',18],['nubarron',19],['chispon',19],['yaguarayo',20]],
    antes:['¿Sentís el aire cargado? Es mi equipo, que ya te tiene ganas.', 'Soy Aitor Menta. Si aguantás la tormenta, la medalla es tuya.'],
    despues:['¡Me dejaste sin batería!', 'La Medalla Relámpago es tuya. Al norte, pasando la Cueva Oscura, está Monte Fogón.'],
    yaGano:'Ya te ganaste el relámpago. Andá a Monte Fogón, al norte.'},
  rulo:{id:'rulo', titulo:'Líder', nombre:'Don Armando Bronca', medalla:'brasa', mov:'parrilla', tipoGym:'fuego', premio:1400, ropa:'#C2412B', pelo:'#3B2A22',
    equipo:[['fogonero',22],['ajipicante',23],['brasero',24],['zorrolumbre',25]],
    antes:['¡Pasá, pasá, que el fuego está a punto!', 'Soy Don Armando Bronca, el último líder de Sorlandia.', 'A ver si tu equipo aguanta el calor de la parrilla.'],
    despues:['¡Se me apagó el fogón!', 'Te llevás la Medalla Brasa.', 'Con las ocho medallas se abre el camino a la Cumbre Suprema. Y dicen que las leyendas de Sorlandia se dejan ver...'],
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
  casaConInterior(M, 20, 26, '#6BAF5B', {nombre: 'Casa de los Baeza', npc: {nombre: 'Abuelo Aquiles Baeza', ropa: '#7E5434', pelo: '#E9E2D3', regalo: true,
    frases: ['¡Hola, pibe! Pasá, pasá.', 'Yo de joven también recorría Sorlandia con mi Hornerito.', 'Tomá, llevate esto que a mí ya no me sirve.']}});
  M.borde('T');
  // Salidas: al norte (Villa Piedra, tapada por un arbolito: Cortar) y al este (Puerto Camalote, tapada por una roca: Fuerza)
  M.camino(11, 1, 11, 3);
  M.salida(11, 0, 'villapiedra', 15, 24);
  for(let x = 1; x <= 38; x++) if(x !== 11) M.m[1][x] = 'T';
  // El arbolito está justo donde llegás desde el norte: viniendo de Villa Piedra siempre se puede bajar.
  M.m[1][11] = 'c';
  for(let y = 14; y <= 28; y++) if(y !== 25) m[y][38] = 'T';
  M.camino(36, 25, 38, 25);
  M.salida(39, 25, 'camalote', 1, 14);
  M.m[25][37] = 'O';
  M.npc({id:'chela', x:14, y:24, tipo:'vecino', nombre:'Doña Susana Oria', ropa:'#E07BA0', pelo:'#BFBFBF',
    frases:['¡Hola, nene! ¿Así que saliste de aventura?', 'En Sorlandia hay cuatro líderes. Si les ganás, te dan una medalla cada uno.', 'El primero está en Villa Piedra, subiendo por el norte. Antes entrená bien en la pradera.', 'Si tu equipo queda cansado, andá al Centro de Rehabilitación. En el Market venden cápsulas.', 'Ah, y mirá bien el piso: a veces hay cosas tiradas.']});
  M.npc(entrenador('facu', 14, 17, 'Pibe', 'Elton Tito', [['pampito',4],['hornerito',4]], 60,
    ['¡Eh, vos! Recién empiezo, pero mis bichos ya están re entrenados.'], ['¡Qué bárbaro! Tengo que entrenar más.'], '#4CC27A'));
  M.npc(entrenador('juli', 33, 11, 'Exploradora', 'Mónica Minante', [['ceibin',6],['abejita',6]], 90,
    ['Shh... en este bosque viven criaturas rarísimas. Primero, una pelea.'], ['Dicen que acá vive un Yaguarayo. Yo nunca lo vi.'], '#F2B63D'));
  M.npc(entrenador('lolo', 5, 16, 'Cazabichos', 'Zacarías Flores', [['vaquitita',5],['grillito',5],['mariposita',6]], 80,
    ['¡Mirá mi colección de bichos! ¿Peleamos?'], ['Me tengo que conseguir más bichos.'], '#8FC77A'));
  M.npc(entrenador('sol', 26, 20, 'Pescadora', 'Ana Zuelo', [['renacuajin',7],['carpinchito',7]], 100,
    ['El río está lleno de criaturas. Probá las mías.'], ['Buena mano. En el puerto hay criaturas de agua más fuertes.'], '#3B82D6'));
  M.npc(entrenador('beto', 8, 7, 'Montañista', 'Andrés Calada', [['tatupiedra',8],['cardoncito',8]], 120,
    ['¡Las sierras son mías! Bueno, de mis bichos.'], ['Para Estela Gartija vas a necesitar ataques de Agua o de Planta, que a la Piedra le pegan fuerte.'], '#A9612F'));
  M.zonas = [['pueblo', 1, 21, 26, 28], ['sierras', 1, 1, 15, 10], ['bosque', 24, 1, 38, 13], ['rio', 24, 14, 38, 28], ['pradera', 1, 1, 23, 20]];
  M.zonaBase = 'pradera';
  M.edificio(4, 26, 7, 'gimnasio', {lider:'flor'}, {color:'#4FA03C', tipoGym:'planta'});
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
  casaConInterior(M, 4, 21, '#A9612F', {nombre: 'Casa de Rosa Rio', npc: {nombre: 'Doña Rosa Rio', ropa: '#E07BA0', pelo: '#3B2A22', regalo: true,
    frases: ['¿Venís a desafiar a Estela Gartija? Es durísima.', 'Mi nieto le ganó usando criaturas de Agua y de Planta.', 'Tomá, para el viaje.']}});
  M.borde('#');
  M.camino(15, 24, 15, 24);
  M.salida(15, 25, 'ceibo', 11, 1);
  M.npc({id:'vecino_vp', x:11, y:16, tipo:'vecino', nombre:'Don Armando Paredes', ropa:'#7E5434', pelo:'#E9E2D3', suelo:':',
    frases:['Villa Piedra, tierra de cardones y piedra dura.', 'Estela Gartija, la líder, usa criaturas de tipo Piedra.', 'Los ataques de Agua y de Planta le hacen mucho daño. Y el Rayo no le hace casi nada.']});
  M.npc(entrenador('cacho', 24, 6, 'Minero', 'Esteban Dido', [['fosilito',10],['cuarcito',11]], 150,
    ['Encontré estos fósiles cavando. ¡Y pelean!'], ['Me voy a seguir cavando.'], '#F2B63D'));
  M.npc(entrenador('ramiro', 4, 8, 'Gaucho', 'Armando Asado', [['nandusito',11],['peludito',11],['pampero',12]], 170,
    ['¡Epa, forastero! A ver esas criaturas.'], ['¡Qué pingo bravo el tuyo!'], '#7E5434'));
  M.npc(entrenador('ana', 13, 6, 'Escaladora', 'Lola Deras', [['morrito',10],['condorcito',10]], 140,
    ['¡Desde acá arriba te vi venir! A ver qué tan fuerte sos.'], ['Bien ahí. Estela Gartija te va a costar, pero podés.'], '#E2574C'));
  M.zonas = [['villapiedra', 1, 12, 28, 24], ['serrania', 1, 1, 28, 11]];
  M.zonaBase = 'serrania';
  // Desvío al este: el camino a Pueblo Panal.
  M.camino(23, 8, 28, 8);
  M.salida(29, 8, 'panal', 1, 14);
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
  casaConInterior(M, 19, 18, '#E2574C', {nombre: 'Casa del Capitán', npc: {nombre: 'Capitán Tito Burón', ropa: '#FFFFFF', pelo: '#BFBFBF', regalo: true,
    frases: ['Treinta años navegando este río...', 'Dicen que al final del muelle aparece el espíritu del río. Yo nunca lo vi.', 'Llevate esto, a mí ya no me hace falta.']}});
  M.borde('T');
  M.salida(0, 14, 'ceibo', 37, 25);
  M.m[17][32] = 'A'; M.altares['32,17'] = 'yacura';
  for(let x = 1; x <= 34; x++) if(x !== 14) M.m[1][x] = 'T';
  M.camino(14, 1, 14, 2);
  M.salida(14, 0, 'barrilete', 13, 22);
  // Un canal de agua separa el puerto del camino a Cerro Tormenta: hace falta Surf.
  for(let y = 3; y <= 4; y++) for(let x = 1; x <= 27; x++) M.m[y][x] = '~';
  M.npc({id:'nadador_cam', x:14, y:6, tipo:'vecino', nombre:'Bañero Esteban Ñadando', ropa:'#E2574C', pelo:'#C98A3C',
    frases:['Del otro lado del canal sale el camino a Cerro Tormenta.', 'Está muy hondo para cruzar a pie. Con Surf, que enseña la Capitana Elsa Lado, se cruza nadando.']});
  M.npc({id:'vecino_cam', x:21, y:16, tipo:'vecino', nombre:'Marinero César Dina', ropa:'#FFFFFF', pelo:'#22304A', suelo:':',
    frases:['La Capitana Elsa Lado pelea con criaturas de Agua.', 'Lo que mejor les pega es el Rayo y la Planta. Con Fuego, ni lo intentes.']});
  M.npc(entrenador('lu', 22, 5, 'Surfista', 'Mary Nera', [['ranacua',14],['tortuguin',15]], 230,
    ['¡Qué olas hoy! Ideal para una pelea.'], ['Me revolcó la ola.'], '#FF7FA3'));
  M.npc(entrenador('toto', 4, 24, 'Electricista', 'Kevin Tilador', [['enchufin',14],['pilita',15]], 230,
    ['Ojo que mis bichos dan patada.'], ['Se me saltaron los tapones.'], '#F2B63D'));
  M.npc(entrenador('lalo', 6, 6, 'Pescador', 'Elmer Luzo', [['bagrecito',13],['carpincho',13]], 200,
    ['¡Picó uno! Ah, no, sos vos. Bueno, peleemos igual.'], ['Hoy no pica nada...'], '#5E7E9E'));
  M.npc(entrenador('uma', 19, 24, 'Marinera', 'Elsa Lmón', [['hornero',14],['pejerrin',14]], 220,
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
  casaConInterior(M, 7, 18, '#5A6B9C', {nombre: 'Casa del Meteorólogo', npc: {nombre: 'Don Alan Brito Delgado', ropa: '#4656A0', pelo: '#E9E2D3', regalo: true,
    frases: ['Estudio las tormentas de este cerro hace cuarenta años.', 'Cuando truena fuerte, allá arriba se ve un ave enorme... Huracanto, le dicen.', 'Tomá, que lo vas a necesitar.']}});
  M.rect(13, 19, 15, 19, ':'); M.rect(17, 19, 19, 19, ':');
  M.borde('T');
  M.salida(16, 27, 'barrilete', 13, 1);
  M.m[3][5] = 'A'; M.altares['5,3'] = 'huracanto';
  for(let x = 1; x <= 30; x++) if(x !== 16) M.m[1][x] = 'T';
  M.camino(16, 1, 16, 2);
  M.salida(16, 0, 'escarcha', 13, 22);
  M.npc({id:'linterna_tor', x:18, y:3, tipo:'vecino', nombre:'Espeleólogo Armando Linterna', ropa:'#C98A3C', pelo:'#3B2A22',
    frases:['Al norte está Pueblo Escarcha y, pasándolo, la Cueva Oscura. Del otro lado está Monte Fogón.', 'Adentro de la cueva no se ve nada. Con Destello, que enseña Elsa Ltamontes en Pueblo Panal, se ilumina todo.', 'Y llevá Fuerza: hay rocas que tapan el paso.']});
  M.npc({id:'vecino_tor', x:12, y:20, tipo:'vecino', nombre:'Abuela Tere Moto', ropa:'#7A4FC9', pelo:'#E9E2D3', suelo:':',
    frases:['Aitor Menta usa criaturas de Rayo. Son rápidas como la luz.', 'Las de Piedra casi no sienten la electricidad. Pensalo.']});
  M.npc(entrenador('nieves', 26, 23, 'Esquiadora', 'Ivana Nieva', [['escarchin',17],['pinguinito',18]], 320,
    ['¡Qué frío! Calentemos con una pelea.'], ['Me congelé del todo.'], '#BFE9FF'));
  M.npc(entrenador('rafa', 5, 23, 'Guardaparques', 'Aitor Tuga', [['huemulito',18],['picaflor',18]], 320,
    ['Cuido a las criaturas del cerro. Y peleo con ellas.'], ['Cuidalas bien, eh.'], '#4F9A3F'));
  M.npc(entrenador('nubia', 8, 7, 'Meteoróloga', 'Olga Nizo', [['nubarron',17],['chispon',17]], 300,
    ['Mi pronóstico: tormenta fuerte sobre tu equipo.'], ['Le erré al pronóstico.'], '#8A93B8'));
  M.npc(entrenador('rayito', 24, 8, 'Pibe', 'Elvis Ible', [['pilon',18],['condorcito',18]], 320,
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
  casaConInterior(M, 7, 18, '#C2412B', {nombre: 'Casa de la Vulcanóloga', npc: {nombre: 'Doctora Ana Tomía', ropa: '#F2B63D', pelo: '#B5452B', regalo: true,
    frases: ['Mido la temperatura del volcán todos los días.', 'En el cráter hay una luz que no es lava. Los viejos le dicen Intiraya.', 'Tomá, para que no te quemes.']}});
  M.rect(13, 20, 15, 21, ':'); M.rect(17, 20, 19, 21, ':');
  M.borde('#');
  M.salida(16, 25, 'cueva', 13, 1);
  M.camino(27, 1, 27, 6);
  M.salida(27, 0, 'supremo', 15, 28);
  M.npc({id:'guardia_supremo', x:27, y:1, tipo:'guardia', nombre:'Guardiana Encarna Vales', requiere:'todas', ropa:'#C9A227', pelo:'#E9E2D3',
    frases:['Este sendero lleva a la Cumbre Suprema, donde está el Cuartel Supremo.', 'Solo pueden subir quienes tengan las ocho medallas de Sorlandia.'],
    abierto:['¡Las ocho medallas! Subí: en la cumbre te espera el Cuartel Supremo.', 'Allá vas a pelear contra los cuatro mejores entrenadores y el Campeón, uno tras otro.']});
  M.m[3][16] = 'A'; M.altares['16,3'] = 'intiraya';
  M.npc({id:'vecino_fog', x:12, y:21, tipo:'vecino', nombre:'Doña Lola Mento', ropa:'#F2B63D', pelo:'#3B2A22', suelo:':',
    frases:['Don Armando Bronca es el líder más fuerte de todos.', 'Sus criaturas de Fuego no aguantan el Agua ni la Piedra.']});
  M.npc(entrenador('juan', 27, 9, 'Bombero', 'Armando Mangueras', [['ranacua',22],['fogonero',23]], 420,
    ['¡Apago incendios y también criaturas!'], ['Me tiraste el balde encima.'], '#E2302E'));
  M.npc(entrenador('ema', 4, 5, 'Vulcanóloga', 'Inés Tallido', [['cuarzon',23],['fosilon',24],['ajipicante',24]], 450,
    ['Estas rocas tienen millones de años. Mis criaturas, también.'], ['Increíble. Sos un fenómeno geológico.'], '#7A4FC9'));
  M.npc(entrenador('pocha', 8, 8, 'Parrillera', 'Mary Nada', [['zorrolumbre',22],['brasero',22]], 400,
    ['¿Sentís el olorcito? Es mi equipo, que está que arde.'], ['Se me quemaron las achuras...'], '#C2412B'));
  M.npc(entrenador('baqueano', 23, 9, 'Baqueano', 'Elvis Cacha', [['morro',23],['tatupenon',23]], 420,
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
  M.npc({id:'vecino_sup', x:12, y:9, tipo:'vecino', nombre:'Cronista Elena Nito', ropa:'#7A4FC9', pelo:'#2A2420', suelo:':',
    frases:['Bienvenido a la Cumbre Suprema. Muy pocos llegan hasta acá.', 'En el Cuartel se pelea contra cinco entrenadores seguidos, sin curarse en el medio.', 'Si salís a curarte o perdés, tenés que empezar de nuevo. Llevá jarabes.']});
  M.npc(entrenador('veterano1', 9, 17, 'Veterano', 'Elvio Jito', [['ranacua',26],['pampero',26],['chispon',27]], 600,
    ['Hace veinte años que intento llegar al Cuartel. Practiquemos.'], ['Vos sí que vas a llegar.'], '#7E5434'));
  M.npc(entrenador('veterana2', 21, 23, 'Veterana', 'Ana Ciana', [['ceibal',27],['bagron',27],['condoralto',28]], 650,
    ['El Camino de la Victoria no perdona.'], ['Buen equipo. Cuidalo.'], '#E07BA0'));
  M.npc(entrenador('veterano3', 18, 14, 'As del Camino', 'Elmer Cenario', [['morro',28],['escarchon',28],['hormigon',29]], 700,
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
/* ---------------- Pueblos chicos con gimnasio propio ---------------- */
// Arriba un tramo de ruta con pasto alto; abajo la plaza con Centro, Market, gimnasio y una casa.
function pueblito(c){
  const W = 28, H = 24;
  const M = nuevoMapa(c.id, c.nombre, W, H, c.semilla, c.base || '.', c.tema);
  M.mancha(1, 2, 26, 8, 9, ',', 1.3, 2.6);
  M.salpicar(1, 1, 26, 8, .07, 'T', [c.base || '.']);
  if(c.rocas) M.salpicar(1, 1, 26, 8, .04, '#', [c.base || '.']);
  M.rect(3, 10, 24, 21, ':');
  M.camino(13, 1, 13, 22);
  M.camino(1, 14, 26, 14);
  M.camino(6, 4, 22, 4);
  M.edificio(4, 11, 5, 'centro', 'centro');
  M.edificio(19, 11, 5, 'market', 'market');
  M.edificio(10, 16, 7, 'gimnasio', {lider: c.lider}, {color: c.colorGym, tipoGym: LIDERES[c.lider].tipoGym});
  casaConInterior(M, 19, 17, c.colorCasa, c.casa);
  M.rect(13, 18, 13, 18, ':');
  M.borde('T');
  for(const [x, y, a, ax, ay] of c.salidas){ if(y === 0) M.camino(x, 1, x, 2); M.salida(x, y, a, ax, ay); }
  if(!c.salidas.some(([, y]) => y === 0)) for(let x = 1; x < W - 1; x++) M.m[1][x] = 'T';
  if(!c.salidas.some(([, y]) => y === H - 1)) M.m[H - 1][13] = 'T';
  M.npc({id: c.id + '_vecino', x: 9, y: 13, tipo: 'vecino', suelo: ':', ...c.vecino});
  c.entrenadores.forEach(([id, x, y, ...resto]) => M.npc(entrenador(id, x, y, ...resto)));
  M.zonas = [[c.id, 3, 10, 24, 21], [c.ruta, 1, 1, W - 2, H - 2]];
  M.zonaBase = c.ruta;
  return M;
}
function mapaPanal(){
  return pueblito({id: 'panal', nombre: 'Pueblo Panal', semilla: 5150, lider: 'saltamontes', colorGym: '#8DBF3A', colorCasa: '#E8B23A', ruta: 'bosquepanal',
    tema: {pasto:'#9CCB6A', pastoAlto:'#5E9E45', brizna:'#3E7A2E', tierra:'#C9B07A', arbol:'normal', fondo:'#3E6B30'},
    salidas: [[0, 14, 'villapiedra', 28, 8]],
    casa: {nombre: 'Casa de la Apicultora', npc: {nombre: 'Apicultora Melisa Panal', ropa: '#FFD23F', pelo: '#3B2A22', regalo: true,
      frases: ['Shh, que las abejas duermen la siesta.', 'Elsa Ltamontes entrena en el gimnasio de acá al lado. Sus bichos pican fuerte.', 'Tomá, un regalito con gusto a miel.']}},
    vecino: {nombre: 'Don Abel Lota', ropa: '#8DBF3A', pelo: '#C9C9C9',
      frases: ['Bienvenido a Pueblo Panal: acá hay más bichos que gente.', 'El Fuego y el Viento les ganan a los Bicho. La Planta, en cambio, sufre.']},
    entrenadores: [['panal_t1', 6, 6, 'Cazabichos', 'Benito Zumbido', [['grillito', 11], ['vaquitita', 12]], 140, ['¡Mirá el bicho que encontré!'], ['Se me escapó volando.'], '#8DBF3A'],
                   ['panal_t2', 21, 3, 'Jardinera', 'Rosa Polen', [['mariposita', 12], ['abejita', 12]], 150, ['Mis flores atraen a los bichos más lindos.'], ['Me marchitaste el jardín.'], '#FF8FB1']]});
}
function mapaBarrilete(){
  return pueblito({id: 'barrilete', nombre: 'Villa Barrilete', semilla: 6262, lider: 'tornado', colorGym: '#7FC8EE', colorCasa: '#5AB4E8', ruta: 'lomasventosas',
    tema: {pasto:'#A9D98E', pastoAlto:'#6FB36A', brizna:'#4A8F4E', tierra:'#D9C9A0', arbol:'normal', fondo:'#4A7A50'},
    salidas: [[13, 23, 'camalote', 14, 1], [13, 0, 'tormenta', 16, 26]],
    casa: {nombre: 'Casa del Barrilero', npc: {nombre: 'Barrilero Elio Cóptero', ropa: '#E2574C', pelo: '#2A2420', regalo: true,
      frases: ['Acá el viento sopla tan fuerte que los barriletes vuelan solos.', 'Aitor Nado es el líder. Con su medalla, tus criaturas te llevan volando.', 'Tomá, para el viaje.']}},
    vecino: {nombre: 'Doña Ventura Soplo', ropa: '#9FD4F5', pelo: '#E9E2D3',
      frases: ['Al norte de Villa Barrilete está Cerro Tormenta.', 'Contra las criaturas de Viento, probá con Rayo, Hielo o Piedra.']},
    entrenadores: [['barr_t1', 6, 6, 'Barrileteador', 'Cometa Pérez', [['barrilete', 15], ['hornerito', 15]], 200, ['¡Mirá cómo sube mi barrilete!'], ['Se me cortó el hilo.'], '#5AB4E8'],
                   ['barr_t2', 21, 3, 'Ornitóloga', 'Paloma Mensajera', [['picaflorcito', 16], ['condorcito', 16]], 220, ['Conozco todas las aves de las lomas.'], ['Me volaron todas.'], '#FFD23F']]});
}
function mapaEscarcha(){
  return pueblito({id: 'escarcha', nombre: 'Pueblo Escarcha', semilla: 7373, lider: 'patinaje', colorGym: '#9FD9F2', colorCasa: '#7FA9C9', ruta: 'vallehelado', rocas: true,
    tema: {pasto:'#E6F2F8', pastoAlto:'#BCD9E8', brizna:'#8DB6CC', tierra:'#D9E6EE', arbol:'pino', fondo:'#4E6E80'},
    salidas: [[13, 23, 'tormenta', 16, 1], [13, 0, 'cueva', 13, 29]],
    casa: {nombre: 'Casa del Esquiador', npc: {nombre: 'Esquiador Copo de Nieve', ropa: '#3B82D6', pelo: '#F2B63D', regalo: true,
      frases: ['Acá nieva todo el año. ¡Me encanta!', 'Paty Naje es la líder: congela todo lo que toca.', 'Tomá, para que no pases frío.']}},
    vecino: {nombre: 'Abuelo Témpano', ropa: '#BFE9FF', pelo: '#FFFFFF',
      frases: ['Al norte está la Cueva Oscura. Sin Destello, no vas a ver ni tus pies.', 'Contra el Hielo, el Fuego y la Piedra son lo mejor.']},
    entrenadores: [['esc_t1', 6, 6, 'Patinador', 'Elmer Engue', [['pinguinito', 19], ['escarchin', 19]], 260, ['¡Una pirueta y peleamos!'], ['Me resbalé.'], '#BFE9FF'],
                   ['esc_t2', 21, 3, 'Andinista', 'Nieves Eternas', [['huemulito', 20], ['pinguinazo', 20]], 290, ['Subí todas las montañas. Ahora te subo a vos.'], ['Me bajaste de la montaña.'], '#7FA9C9']]});
}
/* ---------------- Cueva Oscura: un laberinto entre Cerro Tormenta y Monte Fogón ---------------- */
function mapaCueva(){
  const W = 27, H = 31;
  const M = nuevoMapa('cueva', 'Cueva Oscura', W, H, 9091, '#',
    {pasto:'#5A4C40', pastoAlto:'#5A4C40', brizna:'#4A3E34', tierra:'#4E4136', arbol:'normal', fondo:'#120D0A', oscuro:true, cueva:true});
  const r = rng(424242);
  const dentro = (x, y) => x >= 0 && y >= 0 && x < W && y < H;
  // Laberinto: celdas en coordenadas impares, pasillos cavados con búsqueda en profundidad.
  const celda = (x, y) => x > 0 && y > 0 && x < W - 1 && y < H - 1;
  const vis = new Set(['13,29']), pila = [[13, 29]];
  M.m[29][13] = 'k';
  while(pila.length){
    const [x, y] = pila[pila.length - 1];
    const vec = [[2, 0], [-2, 0], [0, 2], [0, -2]].map(([dx, dy]) => [x + dx, y + dy, dx, dy]).filter(([nx, ny]) => celda(nx, ny) && !vis.has(nx + ',' + ny));
    if(!vec.length){ pila.pop(); continue; }
    const [nx, ny, dx, dy] = vec[Math.floor(r() * vec.length)];
    M.m[y + dy / 2][x + dx / 2] = 'k'; M.m[ny][nx] = 'k'; vis.add(nx + ',' + ny); pila.push([nx, ny]);
  }
  M.m[30][13] = 'k'; M.m[0][13] = 'k';
  const libre = (x, y) => M.m[y][x] === 'k';
  const bfs = desde => {
    const prev = {}, v = new Set([desde.join(',')]), q = [desde];
    while(q.length){ const [x, y] = q.shift();
      for(const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]){ const nx = x + dx, ny = y + dy, k = nx + ',' + ny;
        if(!dentro(nx, ny) || v.has(k) || !libre(nx, ny)) continue; v.add(k); prev[k] = [x, y]; q.push([nx, ny]); } }
    return {v, prev};
  };
  const llegaArriba = () => bfs([13, 29]).v.has('13,1');
  // Camino de abajo hacia arriba. En un laberinto perfecto, cada casillero del camino es paso obligado.
  const {prev} = bfs([13, 29]);
  const camino = []; let p = [13, 1];
  while(p && !(p[0] === 13 && p[1] === 29)){ camino.unshift(p); p = prev[p[0] + ',' + p[1]]; }
  const vecinosK = (x, y) => [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([dx, dy]) => dentro(x + dx, y + dy) && libre(x + dx, y + dy)).length;
  const medio = camino.filter(([x, y], i) => i > camino.length * .4 && i < camino.length * .6 && vecinosK(x, y) === 2);
  const roca = medio[Math.floor(medio.length / 2)] || camino[Math.floor(camino.length / 2)];
  M.m[roca[1]][roca[0]] = 'O';
  // Atajos y dos salas, solo si no dejan esquivar la roca.
  const probar = cambios => {
    const viejos = cambios.map(([x, y]) => [x, y, M.m[y][x]]);
    cambios.forEach(([x, y]) => { if(!(x === roca[0] && y === roca[1])) M.m[y][x] = 'k'; });
    if(llegaArriba()) viejos.forEach(([x, y, c]) => M.m[y][x] = c);
  };
  for(const [x0, y0] of [[3, 17], [17, 7], [15, 21]]){ const c = []; for(let y = y0; y < y0 + 3; y++) for(let x = x0; x < x0 + 5; x++) c.push([x, y]); probar(c); }
  for(let i = 0; i < 60; i++){
    const x = 1 + Math.floor(r() * (W - 2)), y = 1 + Math.floor(r() * (H - 2));
    if(M.m[y][x] === '#' && ((x % 2 === 0 && y % 2 === 1) || (x % 2 === 1 && y % 2 === 0))) probar([[x, y]]);
  }
  M.salida(13, 30, 'escarcha', 13, 1);
  M.salida(13, 0, 'fogon', 16, 24);
  M.m[30][13] = 'k'; M.m[0][13] = 'k';
  M.rocaCamino = roca;
  // Entrenadores en callejones sin salida.
  const enCamino = new Set(camino.map(([x, y]) => x + ',' + y));
  const callejones = [];
  for(let y = 1; y < H - 1; y++) for(let x = 1; x < W - 1; x++)
    if(libre(x, y) && !enCamino.has(x + ',' + y) && vecinosK(x, y) === 1) callejones.push([x, y]);
  const abajo = callejones.filter(([, y]) => y > 16), arriba = callejones.filter(([, y]) => y <= 14);
  const t1 = abajo[Math.floor(r() * abajo.length)], t2 = arriba[Math.floor(r() * arriba.length)];
  if(t1) M.npc({...entrenador('cueva_minero', t1[0], t1[1], 'Minero', 'Elmer Tillo', [['cuarzon', 20], ['morro', 20]], 380,
    ['¡Cuidado con la cabeza! Acá abajo pica todo.'], ['Me quedé sin pico.'], '#C98A3C'), suelo: 'k'});
  if(t2) M.npc({...entrenador('cueva_espeleo', t2[0], t2[1], 'Espeleóloga', 'Estela Ctita', [['fosilon', 21], ['hormigon', 21], ['chispon', 21]], 420,
    ['¿Viste las estalactitas? A todas les puse nombre.'], ['Me ganaste a oscuras.'], '#7A4FC9'), suelo: 'k'});
  M.zonas = [['cueva', 0, 0, W - 1, H - 1]]; M.zonaBase = 'cueva';
  return M;
}
[mapaCeibo, mapaVillaPiedra, mapaPanal, mapaCamalote, mapaBarrilete, mapaTormenta, mapaEscarcha, mapaFogon, mapaSupremo, mapaCueva].forEach(f => { const M = f(); repartirObjetos(M, 4); MAPAS[M.id] = M; });
INTERIORES.forEach((info, n) => { const M = mapaInterior(info, n); MAPAS[M.id] = M; });
const SALIDA_CASA = {mapa: 'ceibo', x: 11, y: 24};

/* ---------------- Centros, markets y gimnasios por dentro ---------------- */
// Los alumnos de cada gimnasio: hay que ganarles a los tres para poder desafiar al líder.
const ALUMNOS = {
  flor: [['Jardinera', 'Margarita Flores', [['brotecito', 5], ['honguito', 5]], 60, ['¿Te gustan las plantas? ¡A las mías les gusta pelear!'], ['Me podaste.']],
         ['Florista', 'Armando Macetas', [['ceibin', 6], ['cardoncito', 6]], 70, ['Cada maceta tiene una criatura adentro.'], ['Se me volcó la tierra.']],
         ['Huertera', 'Elsa Pallo', [['honguito', 6], ['jacarandita', 7]], 80, ['De mi huerta salen las criaturas más sanas.'], ['Me ganaste en buena ley. Y en buena huerta.']]],
  saltamontes: [['Cazamariposas', 'Mary Quita', [['mariposita', 10], ['vaquitita', 10]], 130, ['¡Te atrapé con la red!'], ['Se me escaparon todas.']],
                ['Grillero', 'Elvio Lín', [['grillito', 11], ['abejita', 11]], 140, ['Mis grillos tocan música… y pelean al ritmo.'], ['Me desafinaste.']],
                ['Hormiguera', 'Lola Rva', [['hormiguin', 11], ['hormigon', 12]], 150, ['De a poquito, como las hormigas, te voy a ganar.'], ['Se me desarmó el hormiguero.']]],
  tornado: [['Barrileteador', 'Remo Lino', [['barrilete', 14], ['picaflorcito', 14]], 190, ['¡Mirá cómo vuela mi barrilete!'], ['Se me cortó el hilo.']],
            ['Paracaidista', 'Elsa Lto', [['condorcito', 15], ['hornerito', 15]], 210, ['Salté de un avión para llegar acá. ¡Peleemos!'], ['Aterricé de cola.']],
            ['Meteorólogo', 'Rafa Ga', [['bichofeo', 15], ['barrilete', 16]], 230, ['Pronóstico: te va a soplar fuerte.'], ['Le erré al pronóstico.']]],
  patinaje: [['Esquiador', 'Tomás Frío', [['pinguinito', 18], ['escarchin', 18]], 260, ['¡Bajé la montaña en esquí para pelear con vos!'], ['Me fui de pista.']],
             ['Patinadora', 'Aurora Boreal', [['huemulito', 19], ['pinguinito', 19]], 280, ['Una pirueta y te congelo.'], ['Me caí de la pirueta.']],
             ['Andinista', 'Inés Calofrío', [['escarchon', 20], ['huemul', 20]], 310, ['Brrr… ¿tenés frío? Ya vas a tener.'], ['Me agarró la helada a mí.']]],
  tosca: [['Escalador', 'Aquiles Canto', [['cuarcito', 8], ['fosilito', 9]], 110, ['¡Acá se entrena duro como la piedra!'], ['Pasá. La líder te espera arriba.']],
          ['Picapedrera', 'Petra Lapiedra', [['fosilito', 9], ['cuarcito', 9]], 120, ['¿Venís a picar piedra conmigo?'], ['Me hiciste polvo.']],
          ['Geólogo', 'Elmo Lino', [['tatupiedra', 9], ['cuarzon', 10]], 140, ['Estudié todas las rocas de la sierra. ¡Y entrené con ellas!'], ['Sos más duro que el granito.']]],
  iara:  [['Nadadora', 'Ana Dando', [['pejerrin', 12], ['renacuajin', 12]], 170, ['¡Al agua, pato!'], ['Me dejaste haciendo la plancha.']],
          ['Bañero', 'Esteban Ñero', [['tortuguin', 13], ['ranacua', 13]], 180, ['Prohibido correr al lado de la pileta. Pelear sí.'], ['Silbato y bandera roja: perdí.']],
          ['Marinero', 'Paco Rriente', [['pejerrey', 14], ['tortugon', 14]], 200, ['La corriente siempre me lleva a ganar.'], ['Hoy la corriente iba para tu lado.']]],
  fulgencio: [['Electricista', 'Lucía Lumbrado', [['pilita', 16], ['enchufin', 16]], 240, ['¡Se me encendió la lamparita!'], ['Me dejaste a oscuras.']],
              ['Técnico', 'Aitor Nillo', [['enchufon', 17], ['pilita', 17]], 260, ['Te voy a ajustar como a un tornillo flojo.'], ['Se me zafó la rosca.']],
              ['Inventora', 'Dina Mo', [['tormentin', 17], ['pilon', 18], ['enchufon', 18]], 290, ['Pedaleo y genero rayos. ¿Te animás?'], ['Me quedé sin pilas.']]],
  rulo: [['Parrillero', 'Elsa Lamín', [['fogoncito', 20], ['ajicito', 20]], 320, ['¡Prendé el fuego que arranca el asado!'], ['Se me pasó la achura.']],
         ['Asador', 'Mario Llejas', [['fogonero', 21], ['ajipicante', 21]], 340, ['Las mollejas, bien doradas. Y vos, bien quemado.'], ['Me ganaste la vuelta y vuelta.']],
         ['Leñadora', 'Lola Ñita', [['luzmala', 21], ['fogonero', 22], ['ajipicante', 22]], 380, ['Con poquita leña hago un fuegazo.'], ['Me apagaste la brasa.']]],
};
const PISO_GYM = {piedra: ['#CFC7B8', '#C2B9A9'], agua: ['#CDEBF7', '#BCE1F2'], rayo: ['#DCE0EE', '#CDD3E6'], fuego: ['#EBCBB2', '#E2BEA2'],
  planta: ['#D6EDC4', '#C9E4B4'], bicho: ['#EFE4B8', '#E6D8A2'], viento: ['#E4F3FB', '#D4EAF6'], hielo: ['#EAF7FF', '#DCF0FB']};
const BORDE_GYM = {piedra: '#', agua: '~', rayo: 'm', fuego: '!', planta: 'T', bicho: 'panal', viento: 'molino', hielo: 'hielo'};
function interiorBase(id, nombre, w, h, piso, afuera, semilla){
  const M = nuevoMapa(id, nombre, w, h, semilla, 'p', {pasto: piso[0], pastoAlto: piso[0], brizna: piso[1], tierra: piso[0], arbol: 'normal', fondo: '#3B2A22', interior: true, piso});
  for(let x = 0; x < w; x++){ M.m[0][x] = 'W'; M.m[1][x] = 'W'; M.m[h - 1][x] = 'W'; }
  for(let y = 0; y < h; y++){ M.m[y][0] = 'W'; M.m[y][w - 1] = 'W'; }
  const sx = Math.floor(w / 2);
  M.salida(sx, h - 1, afuera.mapa, afuera.x, afuera.y);
  M.m[h - 1][sx] = 'x';
  M.entrada = {x: sx, y: h - 2};
  M.afuera = afuera;
  M.zonas = [['interior', 0, 0, w - 1, h - 1]]; M.zonaBase = 'interior';
  M.mueble = (tipo, x, y, extra = {}) => { M.m[y][x] = 'm'; M.muebles.push({tipo, x, y, ...extra}); };
  return M;
}
function mapaCentro(id, pueblo, afuera){
  const M = interiorBase(id, 'Centro de Rehabilitación · ' + pueblo, 13, 10, ['#F6E4EA', '#EED6DF'], afuera, 7100 + id.length * 31);
  for(let x = 4; x <= 8; x++) M.mueble('mostrador', x, 3, {col: '#FF8FB1'});
  M.mueble('maquina', 9, 2); M.mueble('maquina', 3, 2);
  M.mueble('camilla', 1, 2); M.mueble('camilla', 11, 2);
  M.mueble('planta', 1, 8); M.mueble('planta', 11, 8);
  for(const x of [2, 3, 9, 10]) M.mueble('banco', x, 6);
  M.muebles.push({tipo: 'alfombra', x: 6, y: 6});
  M.npc({id: id + '_enf', x: 6, y: 2, tipo: 'enfermera', nombre: 'Enfermera Carosor', suelo: 'p', ropa: '#FF8FB1', pelo: '#B5452B', peinado: 'colita', gorra: '#FFFFFF'});
  return M;
}
function mapaMarket(id, pueblo, afuera){
  const M = interiorBase(id, 'Market · ' + pueblo, 13, 10, ['#EAF2DE', '#DDE9CD'], afuera, 7300 + id.length * 17);
  for(const x of [1, 3, 4]) M.mueble('mostrador', x, 3, {col: '#4CC27A'});
  M.mueble('caja', 2, 3, {col: '#4CC27A'});
  for(let x = 7; x <= 10; x++){ M.mueble('gondola', x, 4); M.mueble('gondola', x, 6); }
  M.mueble('heladera', 10, 2); M.mueble('heladera', 11, 2); M.mueble('estante', 7, 2); M.mueble('estante', 8, 2);
  M.mueble('planta', 1, 8); M.mueble('planta', 11, 8);
  M.npc({id: id + '_vend', x: 3, y: 2, tipo: 'vendedor', nombre: 'Vendedor Elmer Cado', suelo: 'p', ropa: '#4CC27A', pelo: '#3B2A22', peinado: 'corto', gorra: '#4CC27A'});
  return M;
}
function mapaGimnasio(id, L, afuera, zonaAfuera){
  const tipo = L.tipoGym, w = 13, h = 16;
  const M = interiorBase(id, 'Gimnasio de ' + L.nombre, w, h, PISO_GYM[tipo], afuera, 7700 + id.length * 13);
  M.zonaPelea = zonaAfuera;
  const borde = BORDE_GYM[tipo];
  // Zonas de los costados con el terreno del tipo (rocas, pileta, bobinas o lava).
  for(let y = 4; y <= 12; y++) for(const x of [1, 2, 3, 9, 10, 11]){
    if((x + y) % 3 === 0) continue;
    if(borde === 'm') M.mueble('bobina', x, y);
    else if(borde.length > 1) M.mueble(borde, x, y);
    else M.m[y][x] = borde;
  }
  // Pasillo central entre columnas: los alumnos esperan al costado.
  const alumnos = ALUMNOS[L.id], lugares = [[5, 11], [7, 8], [5, 5]];
  for(let y = 4; y <= 12; y++) for(const x of [5, 7]){
    if(lugares.some(([lx, ly]) => lx === x && ly === y)) continue;
    M.mueble('columna', x, y, {col: TIPOS[tipo].color});
  }
  for(const x of [4, 8]) for(let y = 4; y <= 12; y++) if(M.m[y][x] === 'p' && (y % 2)) M.mueble('antorcha', x, y, {col: TIPOS[tipo].color});
  M.mueble('columna', 4, 3, {col: TIPOS[tipo].color}); M.mueble('columna', 8, 3, {col: TIPOS[tipo].color});
  M.mueble('estandarte', 3, 2, {col: TIPOS[tipo].color}); M.mueble('estandarte', 9, 2, {col: TIPOS[tipo].color});
  M.muebles.push({tipo: 'podio', x: 6, y: 3, col: TIPOS[tipo].color});
  const ids = alumnos.map(([titulo, nombre, equipo, premio, antes, despues], i) => {
    const [x, y] = lugares[i], nid = 'gym_' + L.id + '_' + i;
    M.npc({...entrenador(nid, x, y, titulo, nombre, equipo, premio, antes, despues, TIPOS[tipo].color), suelo: 'p'});
    return nid;
  });
  M.npc({id: 'lider_' + L.id, x: 6, y: 2, tipo: 'lider', lider: L.id, nombre: L.nombre, alumnos: ids, suelo: 'p', ropa: L.ropa, pelo: L.pelo});
  return M;
}
function crearEdificiosPorDentro(){
  for(const M of Object.values(MAPAS)){
    if(M.tema.interior) continue;
    for(const k of Object.keys(M.puertas)){
      const acc = M.puertas[k], [px, py] = k.split(',').map(Number);
      const afuera = {mapa: M.id, x: px, y: py + 1};
      let N = null;
      if(acc === 'centro') N = mapaCentro('centro_' + M.id, M.nombre, afuera);
      else if(acc === 'market') N = mapaMarket('market_' + M.id, M.nombre, afuera);
      else if(acc && acc.lider) N = mapaGimnasio('gym_' + acc.lider, LIDERES[acc.lider], afuera, M.zonas[0][0]);
      if(!N) continue;
      MAPAS[N.id] = N;
      M.puertas[k] = {interior: N.id};
    }
  }
}
crearEdificiosPorDentro();

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
/* ---------------- Habilidades de campo ---------------- */
// Las enseñan los líderes: con su medalla, tus criaturas las pueden usar fuera de combate.
const HABILIDADES = {
  cortar:   {nom: 'Cortar',   medalla: 'ombu',     lider: 'flor',        desc: 'Corta los arbolitos finitos que tapan el camino.'},
  fuerza:   {nom: 'Fuerza',   medalla: 'penasco',  lider: 'tosca',       desc: 'Corre las rocas grandes.'},
  destello: {nom: 'Destello', medalla: 'panal',    lider: 'saltamontes', desc: 'Ilumina las cuevas oscuras.'},
  surf:     {nom: 'Surf',     medalla: 'camalote', lider: 'iara',        desc: 'Cruza el agua nadando.'},
  vuelo:    {nom: 'Vuelo',    medalla: 'pampero',  lider: 'tornado',     desc: 'Te lleva volando a cualquier pueblo que ya visitaste.'},
};
const tieneHab = h => !!(typeof S !== 'undefined' && S && S.medallas && S.medallas[HABILIDADES[h].medalla]);
const OBSTACULO = {c: 'cortar', O: 'fuerza'};
const quitado = (M, x, y) => !!(S && S.quitados && S.quitados[M.id + ':' + x + ',' + y]);
function obstaculoEn(M, x, y){
  const c = M.m[y] && M.m[y][x];
  return OBSTACULO[c] && !quitado(M, x, y) ? OBSTACULO[c] : null;
}
function transitable(M, x, y){
  if(x < 0 || y < 0 || x >= M.w || y >= M.h || npcEn(M, x, y)) return false;
  const c = M.m[y][x];
  if(OBSTACULO[c]) return quitado(M, x, y);
  if(c === 'Y' && typeof bloqueoSecreto === 'function' && bloqueoSecreto(M, x, y)) return false;
  if(c === '~') return tieneHab('surf') && !M.tema.interior;
  return !BLOQUEA.has(c);
}
