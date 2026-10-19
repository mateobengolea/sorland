'use strict';
/* =====================================================================
   Sorlandia más grande: rutas nuevas, más entrenadores y casas con desafíos.
   - Laguna del Sauce (al oeste de Pueblo Ceibo): Casa de los Huevos, el Coleccionista
     y las Ruinas del Sol con tres tablas-rompecabezas.
   - Estancia El Ombú (al norte de Pueblo Panal): la Torre del Hornero (4 pisos),
     la Profesora de Tipos y el que te pide ver criaturas.
   - Entrenadores nuevos repartidos por todos los pueblos.
   ===================================================================== */
BLOQUEA.add('G');

Object.assign(ZONAS, {
  laguna: {nom: 'Laguna del Sauce', niveles: [6, 12], aparecen: [['renacuajin', 16], ['pejerrin', 14], ['carpinchito', 12], ['tortuguin', 10], ['bagrecito', 10], ['mariposita', 10], ['jacarandita', 8], ['hornerito', 8], ['honguito', 6], ['luzmala', 2]]},
  estancia: {nom: 'Estancia El Ombú', niveles: [12, 18], aparecen: [['nandu', 12], ['pampito', 10], ['peludito', 10], ['cuisito', 10], ['hornero', 10], ['yerbatin', 10], ['vaquitita', 8], ['grillon', 8], ['abejorro', 6], ['bichofeo', 3]]},
  ruinas: {nom: 'Ruinas del Sol', niveles: [14, 20], aparecen: [['fosilito', 18], ['cuarcito', 16], ['tatupiedra', 14], ['morrito', 12], ['luzmala', 8], ['yaguarayo', 4], ['geodon', 2]]},
  torre: {nom: 'Torre del Hornero', niveles: [1, 1], aparecen: []},
});
Object.assign(ARENAS, {laguna: 'rio', estancia: 'pradera', ruinas: 'sierras', torre: 'cumbres'});

/* ---------------- Utilidades ---------------- */
// Casillero libre cerca de (x, y), alcanzable, que no tape pasillos ni puertas.
function lugarLibre(M, x0, y0){
  const salida = Object.keys(M.salidas)[0]; if(!salida) return [x0, y0];
  const [sx, sy] = salida.split(',').map(Number), alc = new Set([sx + ',' + sy]), q = [[sx, sy]];
  const pisable = (x, y) => M.m[y] && M.m[y][x] !== undefined && !BLOQUEA.has(M.m[y][x]) && !OBSTACULO[M.m[y][x]] && M.m[y][x] !== '~';
  while(q.length){ const [x, y] = q.shift(); for(const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]){ const nx = x + dx, ny = y + dy, k = nx + ',' + ny;
    if(alc.has(k) || !pisable(nx, ny) || M.npcs.some(n => n.x === nx && n.y === ny)) continue; alc.add(k); q.push([nx, ny]); } }
  const ok = (x, y) => alc.has(x + ',' + y) && ['.', ',', 's', 'f', 'v', ':'].includes(M.m[y][x]) && !M.salidas[x + ',' + y]
    && !M.npcs.some(n => Math.abs(n.x - x) + Math.abs(n.y - y) < 3) && !M.items.some(i => i.x === x && i.y === y)
    && !Object.keys(M.puertas).some(k => { const [px, py] = k.split(',').map(Number); return Math.abs(px - x) + Math.abs(py - y) < 3; })
    && [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([dx, dy]) => pisable(x + dx, y + dy)).length >= 3;
  for(let r = 0; r < 10; r++) for(let dy = -r; dy <= r; dy++) for(let dx = -r; dx <= r; dx++)
    if(Math.max(Math.abs(dx), Math.abs(dy)) === r && ok(x0 + dx, y0 + dy)) return [x0 + dx, y0 + dy];
  return null;
}
function sumarEntrenador(M, id, x, y, ...resto){
  const p = lugarLibre(M, x, y); if(!p) return;
  M.npc(entrenador(id, p[0], p[1], ...resto));
}
function regalarCriatura(esp, nivel, extra = {}){
  const c = nuevaCriatura(esp, typeof nivelProgresivo === 'function' ? nivelProgresivo(nivel) : nivel, extra);
  const enEquipo = S.equipo.length < MAX_EQUIPO;
  if(enEquipo) S.equipo.push(c); else S.reserva.push(c);
  S.album.vistos[esp] = true; S.album.capt[esp] = (S.album.capt[esp] || 0) + 1; if(c.shiny) S.album.shiny[esp] = true;
  guardar();
  return enEquipo ? 'tu equipo' : 'tu casa';
}
// Pregunta con opciones en una hoja. Devuelve el índice elegido o -1.
function elegirOpcion(titulo, pregunta, opciones){
  return new Promise(res => {
    hojaActual = 'opcion';
    const v = nuevoVelo(false);
    v.innerHTML = `<div class="hoja" role="dialog" aria-label="${esc(titulo)}"><div class="hoja-cab"><h2>${esc(titulo)}</h2></div>
      <p class="rotulo-chico" style="font-size:1rem">${esc(pregunta)}</p>
      <div class="menu-combate lista">${opciones.map((o, i) => `<button data-op="${i}">${esc(o)}</button>`).join('')}</div></div>`;
    v.querySelectorAll('[data-op]').forEach(b => b.onclick = () => { cerrarHoja(); res(+b.dataset.op); });
  });
}
const hoyM2 = () => new Date().toISOString().slice(0, 10);
const SEC2 = () => { S.secretos = S.secretos || {}; return S.secretos; };

/* ---------------- Laguna del Sauce ---------------- */
function mapaLaguna(){
  const W = 36, H = 28;
  const M = nuevoMapa('laguna', 'Laguna del Sauce', W, H, 8181, '.', {pasto: '#93D18A', pastoAlto: '#5FAE6A', brizna: '#3E8E50', tierra: '#E2CC98', arbol: 'sauce', fondo: '#3E7E5B'});
  M.mancha(2, 2, 33, 25, 16, ',', 1.4, 3);
  M.salpicar(1, 1, 34, 26, .06, 'T', ['.']);
  M.salpicar(1, 1, 34, 26, .05, 'f', ['.']);
  for(let y = 7; y <= 19; y++) for(let x = 8; x <= 28; x++) if(((x - 18) / 9) ** 2 + ((y - 13) / 5.5) ** 2 <= 1) M.m[y][x] = '~';
  M.borde('T');
  M.camino(3, 22, 34, 22);
  M.camino(3, 5, 32, 5);
  M.camino(3, 5, 3, 22);
  M.camino(32, 5, 32, 22);
  M.camino(18, 5, 18, 22); // cruza la laguna por un puente
  M.salida(35, 22, 'ceibo', 1, 18);
  M.edificio(15, 2, 7, 'ruinas', {interior: 'ruinas'}, {color: '#A89A84'});
  M.rect(15, 4, 21, 4, '.'); M.camino(18, 4, 18, 5);
  casaConInterior(M, 5, 20, '#F2B63D', {nombre: 'Casa de los Huevos', npc: {nombre: 'Doña Clara Yema', ropa: '#FFD23F', pelo: '#E9E2D3', accion: casaHuevos}});
  casaConInterior(M, 24, 20, '#7A4FC9', {nombre: 'Casa del Coleccionista', npc: {nombre: 'Coleccionista Álvaro Lbum', ropa: '#7A4FC9', pelo: '#2A2420', accion: coleccionista}});
  M.zonas = [['laguna', 0, 0, W - 1, H - 1]]; M.zonaBase = 'laguna';
  M.npc({id: 'pescador_laguna', x: 26, y: 23, tipo: 'vecino', nombre: 'Pescador Elmer Lusa', ropa: '#5E7E9E', pelo: '#BFBFBF', suelo: '.',
    frases: ['Las Ruinas del Sol, al norte, tienen tres tablas de piedra con dibujos desordenados.', 'Dicen que si las armás, las ruinas te devuelven el favor.']});
  sumarEntrenador(M, 'lag_t1', 9, 24, 'Pescador', 'Dante Lada', [['pejerrin', 10], ['bagrecito', 10]], 150, ['¡Shh! Me espantás los peces. Peleemos.'], ['Ni un pique, ni una pelea.'], '#5E7E9E');
  sumarEntrenador(M, 'lag_t2', 27, 3, 'Remera', 'Olga Leta', [['renacuajin', 11], ['tortuguin', 11]], 160, ['¡Remé toda la laguna! Estoy en forma.'], ['Me dejaste sin remos.'], '#3B82D6');
  sumarEntrenador(M, 'lag_t3', 6, 10, 'Botánica', 'Margarita Flores', [['jacarandita', 11], ['honguito', 12]], 170, ['Las flores de la laguna son las más lindas.'], ['Me deshojaste.'], '#E07BA0');
  sumarEntrenador(M, 'lag_t4', 30, 12, 'Cazabichos', 'Bruno Mosca', [['mariposita', 12], ['grillito', 12], ['abejita', 12]], 180, ['Tengo la red lista.'], ['Se me rompió la red.'], '#8FC77A');
  sumarEntrenador(M, 'lag_t5', 12, 3, 'Arqueóloga', 'Indiana Joven', [['fosilito', 13], ['cuarcito', 13]], 200, ['Vengo a estudiar las Ruinas del Sol.'], ['Las ruinas guardan secretos. Probá armar las tablas.'], '#C98A3C');
  return M;
}
/* ---------------- Ruinas del Sol (rompecabezas de piedra) ---------------- */
const TABLAS = {
  '3,3': {id: 't1', esp: 'carotitan', premio: {obj: 'caramelo', n: 2}},
  '7,2': {id: 't2', esp: 'matetitan', premio: {obj: 'libro', n: 2}},
  '11,3': {id: 't3', esp: 'rufititan', premio: {obj: 'revivirmax', n: 3}},
};
function mapaRuinas(){
  const plano = [
    '###############',
    '#####kkkkk#####',
    '##kkkkkGkkkkk##',
    '##kGkkkkkkkGk##',
    '#kkkkkkkkkkkkk#',
    '#kk##kkkkk##kk#',
    '#kk##kkkkk##kk#',
    '#kkkkkkkkkkkkk#',
    '##kkkkkkkkkkk##',
    '######kkk######',
    '#######k#######',
  ];
  const W = plano[0].length, H = plano.length;
  const M = nuevoMapa('ruinas', 'Ruinas del Sol', W, H, 4545, 'k', {pasto: '#B8A584', pastoAlto: '#B8A584', brizna: '#9C8A6A', tierra: '#C9B898', arbol: 'normal', fondo: '#2A2016', cueva: true, tinte: 'rgba(255,190,90,.12)'});
  plano.forEach((f, y) => { for(let x = 0; x < W; x++) M.m[y][x] = f[x]; });
  M.salida(7, 10, 'laguna', 18, 4); M.m[10][7] = 'k';
  M.npc({id: 'guardian_ruinas', x: 7, y: 5, tipo: 'vecino', nombre: 'Guardián Inti Paz', ropa: '#E6A23A', pelo: '#2A2420', suelo: 'k', accion: guardianRuinas});
  M.zonas = [['ruinas', 0, 0, W - 1, H - 1]]; M.zonaBase = 'ruinas';
  M.entrada = {x: 7, y: 9};
  M.afuera = {mapa: 'laguna', x: 18, y: 4};
  return M;
}
async function guardianRuinas(n){
  const sec = SEC2(), hechas = Object.values(TABLAS).filter(t => sec['tabla_' + t.id]).length;
  if(hechas < 3){ await dialogo(n.nombre, ['Hace siglos que cuido estas ruinas.', `Las tres tablas de piedra están desarmadas. Ya armaste ${hechas} de 3.`, 'Tocá una tabla para intentarlo. Si armás las tres, te voy a dar algo que guardé mucho tiempo.']); return; }
  if(sec.guardian){ await dialogo(n.nombre, ['Las tablas brillan otra vez. Gracias, entrenador.']); return; }
  await dialogo(n.nombre, ['¡Las tres tablas brillan! Hacía siglos que no pasaba.', 'Esta criatura nació de una piedra de las ruinas. Cuidala.']);
  const donde = regalarCriatura('geodon', 25);
  sec.guardian = true; guardar();
  await dialogo('¡Regalo!', [`¡Geodón se unió a ${donde}!`]);
}
function rompecabezas(t){
  return new Promise(res => {
    hojaActual = 'puzzle';
    const v = nuevoVelo(false);
    // Mezcla con movimientos válidos para que siempre tenga solución.
    let p = [0, 1, 2, 3, 4, 5, 6, 7, 8], vacio = 8, ultimo = -1;
    const vecinos = i => [i - 3, i + 3, i % 3 ? i - 1 : -1, i % 3 < 2 ? i + 1 : -1].filter(j => j >= 0 && j < 9);
    for(let k = 0; k < 60; k++){ const ops = vecinos(vacio).filter(j => j !== ultimo); const j = ops[Math.floor(Math.random() * ops.length)]; [p[vacio], p[j]] = [p[j], p[vacio]]; ultimo = vacio; vacio = j; }
    if(p.every((x, i) => x === i)){ [p[7], p[8]] = [p[8], p[7]]; vacio = 7; }
    let movs = 0;
    const img = svgEspecie(t.esp, {humor: 'feliz', aura: false});
    const pintar = () => {
      const listo = p.every((x, i) => x === i);
      v.innerHTML = `<div class="hoja" role="dialog" aria-label="Tabla de piedra"><div class="hoja-cab"><h2>Tabla de piedra</h2><button class="cerrar" aria-label="Cerrar">×</button></div>
        <p class="rotulo-chico">${listo ? '¡La tabla está completa!' : 'Tocá una pieza al lado del hueco para moverla. Armá el dibujo.'} Movimientos: ${movs}</p>
        <div class="puzzle${listo ? ' listo' : ''}">${p.map((x, i) => x === 8 && !listo ? `<button class="pieza hueco" disabled aria-label="Hueco"></button>`
          : `<button class="pieza" data-i="${i}" aria-label="Pieza ${x + 1}"><span style="left:${-(x % 3) * 100}%;top:${-Math.floor(x / 3) * 100}%">${img}</span></button>`).join('')}</div></div>`;
      v.querySelector('.cerrar').onclick = () => { cerrarHoja(); res(false); };
      if(listo){ setTimeout(() => { cerrarHoja(); res(true); }, 1100); return; }
      v.querySelectorAll('.pieza[data-i]').forEach(b => b.onclick = () => {
        const i = +b.dataset.i, h = p.indexOf(8);
        if(!vecinos(h).includes(i)) return;
        [p[h], p[i]] = [p[i], p[h]]; movs++; pintar();
      });
    };
    pintar();
  });
}
async function tocarTabla(M, x, y){
  const t = TABLAS[x + ',' + y]; if(!t) return;
  const sec = SEC2();
  if(sec['tabla_' + t.id]){ await dialogo('Tabla de piedra', [`La tabla muestra a ${ESPECIES[t.esp].nombre}. Brilla suavemente.`]); return; }
  await dialogo('Tabla de piedra', ['Una tabla de piedra con un dibujo partido en pedazos...', 'Parece que las piezas se pueden mover.']);
  const ok = await rompecabezas(t);
  if(!ok){ await dialogo('Tabla de piedra', ['Dejaste la tabla como estaba.']); return; }
  sec['tabla_' + t.id] = true;
  const txt = darPremio(t.premio); guardar();
  await dialogo('Tabla de piedra', [`¡La tabla brilla! Es ${ESPECIES[t.esp].nombre}.`, `Detrás de la piedra había ${txt}.`]);
}
/* ---------------- Casas con desafíos ---------------- */
async function casaHuevos(n){
  const sec = SEC2();
  if(sec.huevo){ await dialogo(n.nombre, ['¿Cómo anda la criatura que te di? Cuidala mucho, ¿eh?', 'Si encontrás más huevos por ahí, traémelos.']); return; }
  await dialogo(n.nombre, ['¡Hola, tesoro! Acá cuido huevos de criaturas que encuentro en la laguna.', 'Este acaba de nacer y necesita un entrenador bueno. ¿Te lo llevás?']);
  const raros = ['yaguarayo', 'luzmala', 'mamboreta', 'bichofeo', 'tormentin'], esp = raros[Math.floor(Math.random() * raros.length)];
  const donde = regalarCriatura(esp, 5, {shiny: Math.random() < .05});
  sec.huevo = true; guardar();
  await dialogo('¡Nació!', [`¡Un ${ESPECIES[esp].nombre} se unió a ${donde}!`, 'Es rarísimo: casi nadie lo encuentra en estado salvaje.']);
}
const METAS_ALBUM = [
  {n: 10, premio: {obj: 'supercapsula', n: 5}, txt: '5 súper cápsulas'},
  {n: 25, premio: {obj: 'caramelo', n: 2}, txt: '2 Caramelos de dulce de leche'},
  {n: 45, premio: {obj: 'libro', n: 2}, txt: '2 Libros de técnica'},
  {n: 65, premio: {obj: 'ultracapsula', n: 5}, txt: '5 ultra cápsulas'},
  {n: 85, premio: {monedas: 5000}, txt: '5000 monedas'},
];
async function coleccionista(n){
  const sec = SEC2(), cant = Object.keys(S.album.capt).filter(e => S.album.capt[e]).length;
  const yaDadas = sec.colec || 0, nuevas = METAS_ALBUM.filter((m, i) => i >= yaDadas && cant >= m.n);
  if(!nuevas.length){
    const prox = METAS_ALBUM[yaDadas];
    await dialogo(n.nombre, ['¡Bienvenido a mi colección! Me encantan los entrenadores con el álbum lleno.', prox ? `Tenés ${cant} especies atrapadas. Cuando llegues a ${prox.n}, te doy ${prox.txt}.` : '¡Ya te di todos mis premios! Sos un coleccionista de verdad.']);
    return;
  }
  await dialogo(n.nombre, [`¡${cant} especies atrapadas! ¡Qué álbum!`]);
  for(const m of nuevas){ const txt = darPremio(m.premio); await dialogo('¡Premio!', [`Por llegar a ${m.n} especies te llevás ${txt}.`]); }
  sec.colec = METAS_ALBUM.indexOf(nuevas[nuevas.length - 1]) + 1; guardar();
}
async function profeTipos(n){
  const sec = SEC2();
  if(sec.quiz === hoyM2()){ await dialogo(n.nombre, ['La clase de hoy terminó. Volvé mañana para otra prueba.']); return; }
  await dialogo(n.nombre, ['¡Bienvenido a la Escuela de Tipos! Te hago tres preguntas.', 'Si acertás todas, te llevás un premio. Una prueba por día.']);
  const tipos = Object.keys(TIPOS).filter(t => t !== 'normal');
  let bien = 0;
  for(let q = 0; q < 3; q++){
    // Buscamos un ataque que sea muy efectivo contra un tipo, y tres que no lo sean.
    let def, buenos = [];
    for(let k = 0; k < 30 && !buenos.length; k++){ def = tipos[Math.floor(Math.random() * tipos.length)]; buenos = tipos.filter(a => efectividad(a, def) > 1); }
    if(!buenos.length) continue;
    const correcto = buenos[Math.floor(Math.random() * buenos.length)];
    const malos = tipos.filter(a => efectividad(a, def) <= 1).sort(() => Math.random() - .5).slice(0, 3);
    const ops = [correcto, ...malos].sort(() => Math.random() - .5);
    const r = await elegirOpcion(`Pregunta ${q + 1} de 3`, `¿Qué tipo de ataque es muy efectivo contra el tipo ${TIPOS[def].nom}?`, ops.map(t => TIPOS[t].nom));
    if(ops[r] === correcto){ bien++; await dialogo(n.nombre, ['¡Correcto!']); }
    else await dialogo(n.nombre, [`No... la respuesta era ${TIPOS[correcto].nom}.`]);
  }
  sec.quiz = hoyM2(); guardar();
  if(bien === 3){ const txt = darPremio({obj: 'libro', n: 1}); await dialogo(n.nombre, ['¡Tres de tres! Sos un genio de los tipos.', `Te ganaste ${txt}.`]); }
  else await dialogo(n.nombre, [`Acertaste ${bien} de 3. ¡Estudiá y volvé mañana!`]);
}
const PEDIDOS = ['pampito', 'hornerito', 'cuisito', 'vaquitita', 'grillito', 'mariposita', 'chispulo', 'carpinchito', 'renacuajin', 'tatupiedra', 'ceibin', 'honguito', 'abejita', 'pejerrin', 'nandusito', 'brotecito'];
async function mostrame(n){
  const sec = SEC2(), d = new Date(), dia = d.getFullYear() * 400 + d.getMonth() * 31 + d.getDate();
  const esp = PEDIDOS[dia % PEDIDOS.length];
  if(sec.mostrame === hoyM2()){ await dialogo(n.nombre, ['¡Gracias por mostrarme tu criatura hoy! Mañana te pido otra.']); return; }
  const tiene = S.equipo.some(c => c.esp === esp);
  if(!tiene){ await dialogo(n.nombre, ['¡Hola! Me encanta ver criaturas de cerca.', `Hoy tengo ganas de ver un ${ESPECIES[esp].nombre}. Si traés uno en tu equipo, te doy un premio.`, 'Cada día te pido una distinta.']); return; }
  sec.mostrame = hoyM2();
  const txt = darPremio(premioAleatorio(true)); ganar(400); guardar();
  await dialogo(n.nombre, [`¡¡Un ${ESPECIES[esp].nombre}!! ¡Qué lindo es!`, `Tomá: ${txt} y 400 monedas. ¡Volvé mañana!`]);
}
/* ---------------- Estancia El Ombú ---------------- */
function mapaEstancia(){
  const W = 32, H = 26;
  const M = nuevoMapa('estancia', 'Estancia El Ombú', W, H, 6464, '.', {pasto: '#B5D98A', pastoAlto: '#7EB85E', brizna: '#5A9640', tierra: '#E2CC98', arbol: 'normal', fondo: '#4A7A40'});
  M.mancha(2, 5, 29, 23, 14, ',', 1.4, 3);
  M.salpicar(1, 1, 30, 24, .05, 'T', ['.']);
  M.salpicar(1, 1, 30, 24, .04, 'f', ['.']);
  M.borde('T');
  M.camino(16, 4, 16, 24);
  M.camino(3, 17, 28, 17);
  M.camino(4, 8, 28, 8);
  M.salida(16, 25, 'panal', 13, 1);
  M.edificio(13, 2, 7, 'torre', {interior: 'torre1'}, {color: '#8A5A35'});
  M.rect(13, 4, 19, 4, '.'); M.m[4][16] = '=';
  casaConInterior(M, 4, 15, '#3B82D6', {nombre: 'Escuela de Tipos', npc: {nombre: 'Profesora Ana Lítica', ropa: '#3B82D6', pelo: '#3B2A22', accion: profeTipos}});
  casaConInterior(M, 23, 15, '#E07BA0', {nombre: 'Casa de Don Elvis', npc: {nombre: 'Don Elvis Tazo', ropa: '#E07BA0', pelo: '#BFBFBF', accion: mostrame}});
  M.npc({id: 'gaucho_est', x: 14, y: 10, tipo: 'vecino', nombre: 'Gaucho Martín Fierrito', ropa: '#7E5434', pelo: '#2A2420', suelo: '.',
    frases: ['¡Bienvenido a la Estancia El Ombú!', 'La torre es del viejo Hornero Sabio. Dicen que arriba de todo te espera con un regalo.', 'Pero antes hay que ganarle a sus aprendices, piso por piso.']});
  sumarEntrenador(M, 'est_t1', 7, 6, 'Gaucho', 'Facundo Rastrillo', [['nandu', 15], ['pampito', 15]], 220, ['¡Ah, pero mire quién llegó a la estancia!'], ['Me dejó de a pie.'], '#7E5434');
  sumarEntrenador(M, 'est_t2', 25, 6, 'Domadora', 'Yegua Brava', [['peludito', 15], ['cuisito', 16]], 230, ['¡A ver si me aguantás!'], ['Me volteaste.'], '#C98A3C');
  sumarEntrenador(M, 'est_t3', 9, 21, 'Apicultor', 'Panal Panal', [['abejita', 15], ['abejorro', 17]], 250, ['¡Bzzz! Cuidado que pican.'], ['Me picaste vos.'], '#FFD23F');
  sumarEntrenador(M, 'est_t4', 24, 21, 'Puestero', 'Ramón Tranquera', [['hornero', 16], ['yerbatin', 16]], 240, ['Pasá, pero primero una pelea.'], ['Pase, pase.'], '#4CC27A');
  sumarEntrenador(M, 'est_t5', 20, 12, 'Payador', 'Rima Verso', [['grillon', 17], ['chispon', 17]], 260, ['Con mi guitarra y mis bichos, te canto una derrota.'], ['Me desafinaste.'], '#7A4FC9');
  M.zonas = [['estancia', 0, 0, W - 1, H - 1]]; M.zonaBase = 'estancia';
  return M;
}
/* ---------------- Torre del Hornero: cuatro pisos ---------------- */
function pisoTorre(n){
  const M = nuevoMapa('torre' + n, `Torre del Hornero · Piso ${n}`, 13, 11, 7000 + n, 'p',
    {pasto: '#C9A06A', pastoAlto: '#C9A06A', brizna: '#A87E4A', tierra: '#C9A06A', arbol: 'normal', fondo: '#3B2A22', interior: true, piso: ['#C9A06A', '#BE9560']});
  for(let x = 0; x < 13; x++){ M.m[0][x] = 'W'; M.m[1][x] = 'W'; M.m[10][x] = 'W'; }
  for(let y = 0; y < 11; y++){ M.m[y][0] = 'W'; M.m[y][12] = 'W'; }
  const mueble = (tipo, x, y) => { M.m[y][x] = 'm'; M.muebles.push({tipo, x, y}); };
  const sube = (x, y, a, ax, ay) => { M.m[y][x] = 'U'; M.salidas[x + ',' + y] = {mapa: a, x: ax, y: ay}; };
  const baja = (x, y, a, ax, ay) => { M.m[y][x] = 'V'; M.salidas[x + ',' + y] = {mapa: a, x: ax, y: ay}; };
  if(n === 1){
    M.salida(6, 10, 'estancia', 16, 4); M.m[10][6] = 'x';
    sube(11, 2, 'torre2', 10, 2);
    for(let x = 1; x <= 8; x++) mueble('estante', x, 5);
    M.npc({...entrenador('torre_a1', 4, 7, 'Aprendiz', 'Pluma Ligera', [['hornerito', 17], ['picaflorcito', 17]], 260, ['Esta es la Torre del Hornero. Para subir, me tenés que ganar.'], ['Subí nomás.'], '#C98A3C'), suelo: 'p'});
    M.npc({...entrenador('torre_a2', 10, 6, 'Aprendiz', 'Ala Delta', [['condorcito', 18], ['pampito', 18]], 270, ['El viento sopla fuerte acá adentro.'], ['Me desplumaste.'], '#9FD4F5'), suelo: 'p'});
    M.entrada = {x: 6, y: 9};
  } else if(n === 2){
    baja(11, 2, 'torre1', 10, 2); sube(1, 2, 'torre3', 2, 2);
    for(let y = 2; y <= 7; y++) mueble(y % 2 ? 'planta' : 'estante', 6, y);
    M.npc({...entrenador('torre_a3', 9, 7, 'Aprendiz', 'Nido Firme', [['hornero', 19], ['nandu', 19]], 290, ['Segundo piso. Ya no es tan fácil.'], ['Pasá al tercero.'], '#A8622F'), suelo: 'p'});
    M.npc({...entrenador('torre_a4', 3, 8, 'Aprendiz', 'Brisa Suave', [['barrilete', 19], ['pampero', 20]], 300, ['Mi barrilete nunca baja.'], ['Se me cayó.'], '#5AB4E8'), suelo: 'p'});
  } else if(n === 3){
    baja(1, 2, 'torre2', 2, 2); sube(11, 9, 'torre4', 10, 2);
    for(let x = 3; x <= 11; x++) mueble('estante', x, 4);
    for(let x = 1; x <= 9; x++) mueble('estante', x, 7);
    M.npc({...entrenador('torre_a5', 6, 5, 'Maestro', 'Viento Norte', [['horneron', 22], ['condoralto', 22]], 350, ['Pocos llegan al tercer piso.'], ['El Sabio te espera arriba.'], '#4656A0'), suelo: 'p'});
    M.npc({...entrenador('torre_a6', 5, 9, 'Maestra', 'Pluma Blanca', [['picaflor', 22], ['barriletazo', 23]], 370, ['¡Último aprendiz! Dame todo.'], ['Subí. El Sabio sabe que llegaste.'], '#FFFFFF'), suelo: 'p'});
  } else {
    baja(11, 2, 'torre3', 10, 9);
    mueble('planta', 1, 2); mueble('planta', 1, 8); mueble('planta', 11, 8);
    M.muebles.push({tipo: 'alfombra', x: 5, y: 6});
    M.npc({id: 'sabio_torre', x: 6, y: 4, tipo: 'vecino', nombre: 'Hornero Sabio', ropa: '#8A5A35', pelo: '#FFFFFF', suelo: 'p', accion: sabioTorre});
  }
  M.zonas = [['torre', 0, 0, 12, 10]]; M.zonaBase = 'torre'; M.zonaPelea = 'torre';
  M.afuera = {mapa: 'estancia', x: 16, y: 4};
  return M;
}
async function sabioTorre(n){
  const sec = SEC2();
  if(sec.sabio){ await dialogo(n.nombre, ['Desde acá arriba se ve toda Sorlandia.', 'Volvé cuando quieras a charlar con este viejo.']); return; }
  if(!S.vencidos.sabio_pelea){
    await dialogo(n.nombre, ['Llegaste a la cima. Ganaste a todos mis aprendices.', 'Ahora mostrame lo que aprendiste. ¡Una última pelea!']);
    if(!hayLuchadorEnPie()){ await dialogo(n.nombre, ['Tu equipo está cansado. Descansá y volvé.']); return; }
    lanzarPeleaEntrenador({id: 'sabio_pelea', titulo: 'Sabio', nombre: 'Hornero Sabio', ropa: '#8A5A35', pelo: '#FFFFFF', premio: 1200,
      equipo: [['horneron', 25], ['pampero', 25], ['condoralto', 26], ['picaflor', 26]], antes: [], despues: ['Volá alto, entrenador.']}, 'torre');
    return;
  }
  await dialogo(n.nombre, ['Peleaste como el viento. Te ganaste mi regalo.']);
  const txt = darPremio({obj: 'caramelo', n: 3}); const txt2 = darPremio({obj: 'energizantemax', n: 2});
  sec.sabio = true; guardar();
  await dialogo('¡Regalo!', [`El Hornero Sabio te dio ${txt} y ${txt2}.`]);
}
/* ---------------- Armado: mapas nuevos y conexiones ---------------- */
(function armarMundoGrande(){
  const L = mapaLaguna(); repartirObjetos(L, 5); MAPAS.laguna = L;
  const E = mapaEstancia(); repartirObjetos(E, 4); MAPAS.estancia = E;
  MAPAS.ruinas = mapaRuinas();
  for(let n = 1; n <= 4; n++){ const T = pisoTorre(n); MAPAS[T.id] = T; }
  // Interiores de las casas nuevas
  INTERIORES.forEach((info, n) => { if(!MAPAS[info.id]){ const M = mapaInterior(info, n); MAPAS[M.id] = M; } });
  // Pueblo Ceibo: salida al oeste hacia la laguna
  const C = MAPAS.ceibo;
  C.camino(1, 18, 6, 18); C.salida(0, 18, 'laguna', 34, 22);
  // Pueblo Panal: salida al norte hacia la estancia
  const P = MAPAS.panal;
  P.m[1][13] = '='; P.m[2][13] = '='; P.salida(13, 0, 'estancia', 16, 24);
  // En el mapa de la región
  REGION.laguna = [6, 78]; REGION.estancia = [52, 40];
  RUTAS.push(['laguna', 'ceibo'], ['panal', 'estancia']);
  // Más entrenadores en los pueblos de siempre
  const mas = {
    ceibo: [['ceibo_x1', 20, 8, 'Corredora', 'Vera Nito', [['pampito', 6], ['nandusito', 6]], 90, ['¡Te corro una carrera! Bueno, una pelea.'], ['Me pasaste por la derecha.'], '#FF7FA3'],
            ['ceibo_x2', 30, 18, 'Nadador', 'Delfín Bueno', [['renacuajin', 7], ['pejerrin', 7]], 100, ['El río está fresquito.'], ['Me ahogaste en la orilla.'], '#3B82D6']],
    villapiedra: [['vp_x1', 6, 6, 'Picapiedras', 'Pedro Pica', [['tatupiedra', 10], ['morrito', 11]], 150, ['¡Piedra libre!'], ['Me hiciste polvo.'], '#9AA2AD'],
                  ['vp_x2', 22, 6, 'Geóloga', 'Roca Dura', [['cuarcito', 11], ['fosilito', 11]], 160, ['Cada piedra tiene una historia.'], ['Me rompiste las piedras.'], '#C98A3C']],
    panal: [['panal_x1', 4, 3, 'Floricultor', 'Jazmín Silvestre', [['ceibin', 12], ['jacarandita', 12]], 160, ['¿Viste mis jacarandás?'], ['Se me secaron.'], '#7A4FC9']],
    camalote: [['cam_x1', 4, 9, 'Velero', 'Viento Popa', [['barrilete', 14], ['pejerrin', 14]], 210, ['¡Viento a favor!'], ['Viento en contra.'], '#FFFFFF'],
               ['cam_x2', 21, 9, 'Buzo', 'Esnórquel Pérez', [['bagrecito', 15], ['tortuguin', 15]], 220, ['Abajo del agua hay de todo.'], ['Me quedé sin aire.'], '#3B82D6']],
    barrilete: [['barr_x1', 3, 3, 'Meteoróloga', 'Nube Gris', [['nubarron', 16], ['chispulo', 16]], 230, ['Pronóstico: derrota para vos.'], ['Se me nubló.'], '#9AA2AD']],
    tormenta: [['tor_x1', 8, 8, 'Cazarrayos', 'Ray Ito', [['pilita', 18], ['enchufin', 18]], 260, ['¡Los rayos me encantan!'], ['Me cortaste la luz.'], '#F2B63D'],
               ['tor_x2', 24, 14, 'Montañera', 'Cumbre Alta', [['morro', 18], ['tatupenon', 18]], 270, ['Estas laderas son mías.'], ['Me desbarrancaste.'], '#A9612F']],
    escarcha: [['esc_x1', 4, 3, 'Esquiadora', 'Pista Negra', [['escarchin', 20], ['pinguinito', 21]], 290, ['¡Bajo la montaña en un segundo!'], ['Me caí de cola.'], '#E2574C']],
    fogon: [['fog_x1', 6, 8, 'Asador', 'Chori Pan', [['fogonero', 23], ['ajicito', 23]], 330, ['¡El asado está listo! Primero, una pelea.'], ['Se me quemó la carne.'], '#C9372B'],
            ['fog_x2', 24, 10, 'Bombera', 'Manguera Larga', [['ranacua', 23], ['carpincho', 23]], 330, ['Apago cualquier fuego. Hasta el tuyo.'], ['Me mojaste vos.'], '#E2574C']],
    supremo: [['sup_x1', 6, 24, 'Ex Campeón', 'Glorio Pasado', [['carotitan', 30], ['matetitan', 30], ['rufititan', 30]], 900, ['Yo también fui Campeón, hace mucho.'], ['Los nuevos vienen con todo.'], '#C9A227']],
  };
  for(const [id, lista] of Object.entries(mas)){ const M = MAPAS[id]; if(!M) continue; for(const t of lista) sumarEntrenador(M, ...t); }
})();

/* ---------------- Ganchos: tablas, escaleras y dibujos ---------------- */
(() => {
  const toca = tocarSecreto;
  tocarSecreto = function(M, x, y){
    if(M.m[y] && M.m[y][x] === 'G'){ tocarTabla(M, x, y); return true; }
    return toca(M, x, y);
  };
  const dib = dibujarSecretos;
  dibujarSecretos = function(ctx, M, camX, camY, t){
    dib(ctx, M, camX, camY, t);
    for(const k of Object.keys(M.salidas)){
      const [x, y] = k.split(',').map(Number);
      if(M.m[y][x] === 'U') escaleraSube(ctx, x * TS - camX, y * TS - camY);
    }
    for(const k of Object.keys(TABLAS)) if(M.id === 'ruinas'){ const [x, y] = k.split(',').map(Number); tablaPiedra(ctx, x * TS - camX, y * TS - camY, !!SEC2()['tabla_' + TABLAS[k].id], t); }
  };
})();
function escaleraSube(ctx, sx, sy){
  ctx.strokeStyle = '#22304A'; ctx.lineWidth = 2.5;
  ctx.fillStyle = '#8A5A35'; ctx.fillRect(sx + 4, sy + 2, 24, 28); ctx.strokeRect(sx + 4, sy + 2, 24, 28);
  ctx.fillStyle = '#C07A44'; for(let i = 0; i < 5; i++){ ctx.fillRect(sx + 6, sy + 26 - i * 6, 20, 4); ctx.strokeRect(sx + 6, sy + 26 - i * 6, 20, 4); }
  ctx.fillStyle = '#FFFDF8'; ctx.beginPath(); ctx.moveTo(sx + 16, sy - 6); ctx.lineTo(sx + 22, sy + 1); ctx.lineTo(sx + 10, sy + 1); ctx.closePath(); ctx.fill(); ctx.stroke();
}
function tablaPiedra(ctx, sx, sy, lista, t){
  ctx.fillStyle = 'rgba(20,20,30,.3)'; ctx.beginPath(); ctx.ellipse(sx + 16, sy + 29, 13, 4, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = '#22304A'; ctx.lineWidth = 2.5;
  ctx.fillStyle = '#A89A84'; ctx.beginPath(); ctx.moveTo(sx + 4, sy + 28); ctx.lineTo(sx + 4, sy + 6); ctx.quadraticCurveTo(sx + 16, sy - 6, sx + 28, sy + 6); ctx.lineTo(sx + 28, sy + 28); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = 'rgba(34,48,74,.5)'; ctx.lineWidth = 1.5;
  for(const [a, b, c, d] of [[8, 12, 24, 12], [8, 20, 24, 20], [16, 6, 16, 26]]){ ctx.beginPath(); ctx.moveTo(sx + a, sy + b); ctx.lineTo(sx + c, sy + d); ctx.stroke(); }
  if(lista){ const p = (Math.sin(t / 300) + 1) / 2; ctx.fillStyle = `rgba(255,220,90,${.25 + p * .35})`; ctx.fillRect(sx + 5, sy + 6, 22, 22); }
}
