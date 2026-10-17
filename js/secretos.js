'use strict';
/* =====================================================================
   Secretos de Sorlandia: dungeons escondidas y easter eggs.
   - Gruta del Pombero: un árbol de mentira en el rincón del bosque de Pueblo Ceibo.
   - Templo Sumergido: una escalera en un islote de Puerto Camalote (hace falta Surf).
   - Estudio del Creador: detrás de un árbol en la Cumbre Suprema, solo para Campeones.
   - La Luz Mala: aparece de noche (de 0 a 6) en la pradera de Pueblo Ceibo.
   - El Pozo de los Deseos en la plaza de Pueblo Ceibo.
   - Doña Susana Oria tiene algo para quien la escuche muchas veces.
   - Y un código de los de antes: ↑ ↑ ↓ ↓ ← → ← → B A.
   ===================================================================== */
BLOQUEA.add('P');
const SECRETO = () => { S.secretos = S.secretos || {}; return S.secretos; };

/* ---------------- Zonas de criaturas de las dungeons ---------------- */
Object.assign(ZONAS, {
  gruta: {nom: 'Gruta del Pombero', niveles: [22, 28], aparecen: [['luzmala', 14], ['yaguarayo', 12], ['mamboreta', 12], ['bichofeo', 10], ['tormentin', 10], ['zorrolumbre', 10], ['honguito', 8], ['hongazo', 6], ['jacaranda', 6]]},
  templo: {nom: 'Templo Sumergido', niveles: [26, 32], aparecen: [['bagron', 14], ['pejerrey', 14], ['tortugon', 12], ['sapucay', 10], ['carpinchon', 8], ['ranacua', 10], ['pinguinazo', 8], ['glaciaro', 4]]},
  estudio: {nom: 'Estudio del Creador', niveles: [1, 1], aparecen: []},
});
Object.assign(ARENAS, {gruta: 'bosque', templo: 'rio', estudio: 'ciudad'});

/* ---------------- Gruta del Pombero ---------------- */
function mapaGruta(){
  const W = 23, H = 21;
  const M = nuevoMapa('gruta', 'Gruta del Pombero', W, H, 7171, '#',
    {pasto: '#4E5A40', pastoAlto: '#4E5A40', brizna: '#3E4A34', tierra: '#45503A', arbol: 'normal', fondo: '#0A0F08', oscuro: true, cueva: true});
  const r = rng(777);
  const celda = (x, y) => x > 0 && y > 0 && x < W - 1 && y < H - 1;
  const ini = [11, 19], vis = new Set([ini.join(',')]), pila = [ini];
  M.m[ini[1]][ini[0]] = 'k';
  while(pila.length){
    const [x, y] = pila[pila.length - 1];
    const vec = [[2, 0], [-2, 0], [0, 2], [0, -2]].map(([dx, dy]) => [x + dx, y + dy, dx, dy]).filter(([nx, ny]) => celda(nx, ny) && !vis.has(nx + ',' + ny));
    if(!vec.length){ pila.pop(); continue; }
    const [nx, ny, dx, dy] = vec[Math.floor(r() * vec.length)];
    M.m[y + dy / 2][x + dx / 2] = 'k'; M.m[ny][nx] = 'k'; vis.add(nx + ',' + ny); pila.push([nx, ny]);
  }
  // Algunos atajos para que no sea un laberinto tan largo.
  for(let i = 0; i < 18; i++){ const x = 1 + Math.floor(r() * (W - 2)), y = 1 + Math.floor(r() * (H - 2)); if((x + y) % 2 === 1) M.m[y][x] = 'k'; }
  M.salida(11, 20, 'ceibo', 36, 4);
  M.m[20][11] = 'k';
  // Distancias desde la entrada: el cofre va en el callejón más lejano y el Pombero en el segundo.
  const dist = {}, q = [ini]; dist[ini.join(',')] = 0;
  while(q.length){ const [x, y] = q.shift();
    for(const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]){ const nx = x + dx, ny = y + dy, k = nx + ',' + ny;
      if(!celda(nx, ny) || dist[k] !== undefined || M.m[ny][nx] !== 'k') continue; dist[k] = dist[x + ',' + y] + 1; q.push([nx, ny]); } }
  const vecinos = (x, y) => [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([dx, dy]) => M.m[y + dy] && M.m[y + dy][x + dx] === 'k').length;
  const callejones = Object.entries(dist).map(([k, d]) => [...k.split(',').map(Number), d]).filter(([x, y]) => vecinos(x, y) === 1).sort((a, b) => b[2] - a[2]);
  const [cx, cy] = callejones[0], [px, py] = callejones[1] || callejones[0];
  M.items.push({id: 'cofre_gruta', x: cx, y: cy, cofre: true, premio: {obj: 'caramelo', n: 3}});
  M.npc({...entrenador('pombero', px, py, 'Duende', 'El Pombero', [['luzmala', 30], ['mamboreta', 30], ['yaguarayo', 31], ['bichofeo', 31], ['zorrofogon', 32]], 2500,
    ['¡Jijiji! ¿Quién se metió en mi gruta?', 'Nadie encuentra el árbol de mentira... salvo vos.', 'Si me ganás, te dejo llevarte el tesoro. Si no, ¡te escondo las medias!'],
    ['Está bien, está bien... ganaste.', 'El cofre del fondo es tuyo. Y no le cuentes a nadie dónde está la gruta, ¿eh?'], '#6B4426'), suelo: 'k', pelo: '#2A2420'});
  if(callejones[2]) M.items.push({id: 'gruta_it1', x: callejones[2][0], y: callejones[2][1]});
  if(callejones[3]) M.items.push({id: 'gruta_it2', x: callejones[3][0], y: callejones[3][1]});
  M.zonas = [['gruta', 0, 0, W - 1, H - 1]]; M.zonaBase = 'gruta';
  return M;
}

/* ---------------- Templo Sumergido ---------------- */
function mapaTemplo(){
  const plano = [
    '###################',
    '#######kkkkk#######',
    '#######kkkkk#######',
    '#######kkkkk#######',
    '#########O#########',
    '#kkkk~~~kkk~~~kkkk#',
    '#k~~~~~~kkk~~~~~~k#',
    '#k~kk~~~kkk~~~kk~k#',
    '#k~kk~~~kkk~~~kk~k#',
    '#k~~~~~~kkk~~~~~~k#',
    '#kkkkkkkkkkkkkkkkk#',
    '####kkkk###kkkk####',
    '#kkkkkkk###kkkkkkk#',
    '#kkk##kkkkkkk##kkk#',
    '#kkk##kkkkkkk##kkk#',
    '#kkkkkkkkkkkkkkkkk#',
    '#########k#########',
  ];
  const W = plano[0].length, H = plano.length;
  const M = nuevoMapa('templo', 'Templo Sumergido', W, H, 3131, 'k',
    {pasto: '#6E8FA8', pastoAlto: '#6E8FA8', brizna: '#58788F', tierra: '#7E9AB0', arbol: 'normal', fondo: '#0E2A40', cueva: true, tinte: 'rgba(40,120,200,.16)'});
  plano.forEach((fila, y) => { for(let x = 0; x < W; x++) M.m[y][x] = fila[x]; });
  M.salida(9, 16, 'camalote', 31, 23);
  M.m[16][9] = 'k';
  M.items.push({id: 'cofre_templo1', x: 3, y: 7, cofre: true, premio: {obj: 'revivirmax', n: 3}});
  M.items.push({id: 'cofre_templo2', x: 15, y: 8, cofre: true, premio: {obj: 'libro', n: 2}});
  M.npc({id: 'espiritu_rio', x: 9, y: 2, tipo: 'vecino', nombre: 'Espíritu del Río', ropa: '#8FD3F7', pelo: '#E6F6FF', suelo: 'k', espiritu: true,
    frases: ['...Hacía cien años que nadie bajaba hasta acá.', 'Corriste la piedra, cruzaste el agua... tenés el corazón de un verdadero entrenador.']});
  M.npc({...entrenador('buzo_templo', 6, 13, 'Buzo', 'Armando Burbujas', [['tortugon', 29], ['pejerrey', 29], ['bagron', 30]], 900,
    ['¡Blub! Vine a buscar el tesoro del templo. ¡Es mío!'], ['Blub... me quedé sin aire.'], '#3B82D6'), suelo: 'k'});
  M.npc({...entrenador('sirena_templo', 12, 13, 'Sirena', 'Marina Ola', [['sapucay', 30], ['carpinchon', 30], ['ranacua', 31]], 950,
    ['Este templo lo cuidamos las sirenas. Mostrame que lo merecés.'], ['Pasá. El Espíritu del Río te está esperando.'], '#FF8FB1'), suelo: 'k'});
  M.zonas = [['templo', 0, 0, W - 1, H - 1]]; M.zonaBase = 'templo';
  return M;
}

/* ---------------- Estudio del Creador ---------------- */
function mapaEstudio(){
  const M = nuevoMapa('estudio', 'Estudio del Creador', 13, 10, 2026, 'p',
    {pasto: '#E2C29A', pastoAlto: '#E2C29A', brizna: '#C9A06A', tierra: '#E2C29A', arbol: 'normal', fondo: '#1B2244', interior: true, piso: ['#3B4A8C', '#34437F']});
  for(let x = 0; x < 13; x++){ M.m[0][x] = 'W'; M.m[1][x] = 'W'; M.m[9][x] = 'W'; }
  for(let y = 0; y < 10; y++){ M.m[y][0] = 'W'; M.m[y][12] = 'W'; }
  [['tele', 2, 2], ['tele', 3, 2], ['tele', 9, 2], ['tele', 10, 2], ['estante', 5, 2], ['estante', 7, 2], ['planta', 1, 8], ['planta', 11, 8], ['sillon', 2, 6], ['mesa', 10, 6]]
    .forEach(([tipo, x, y]) => { M.m[y][x] = 'm'; M.muebles.push({tipo, x, y}); });
  M.muebles.push({tipo: 'alfombra', x: 5, y: 5});
  M.salida(6, 9, 'supremo', 27, 7);
  M.m[9][6] = 'x';
  M.npc({...entrenador('creador', 6, 3, 'Creador de Sorlandia', 'Mateo B.', [['carotitan', 50], ['matetitan', 50], ['rufititan', 50], ['intiraya', 52], ['yacura', 52], ['huracanto', 52]], 9999,
    ['¡Uh! ¿Cómo llegaste hasta acá? Este es mi estudio: acá dibujo cada criatura de Sorlandia.', 'Sos Campeón, así que te ganaste el último desafío: pelear contra el equipo del creador.', '¿Listo? ¡No me la hagas fácil!'],
    ['¡Increíble! Le ganaste al que inventó el juego.', 'Gracias por jugar Sorlandia. En serio.', 'Ahora andá a completar el álbum... ¡faltan un montón!'], '#22304A'), suelo: 'p', pelo: '#3B2A22', peinado: 'corto'});
  M.zonas = [['estudio', 0, 0, 12, 9]]; M.zonaBase = 'estudio';
  M.entrada = {x: 6, y: 8};
  return M;
}

/* ---------------- Entradas secretas en los mapas de siempre ---------------- */
(function sembrarSecretos(){
  // Pueblo Ceibo: el rincón del bosque tiene un árbol que no es un árbol.
  const C = MAPAS.ceibo;
  C.m[3][36] = 'T'; C.m[3][37] = 'T'; C.m[3][38] = 'T'; C.m[5][36] = 'T'; C.m[5][37] = 'T'; C.m[5][38] = 'T'; C.m[4][38] = 'T';
  C.m[4][36] = '.';
  C.m[4][37] = 'Y'; C.salidas['37,4'] = {mapa: 'gruta', x: 11, y: 19};
  // Plaza de Pueblo Ceibo: el pozo de los deseos.
  C.m[27][15] = 'P'; C.pozo = {x: 15, y: 27};
  // Pradera de noche: la luz mala.
  C.luzMala = {x: 7, y: 15}; if(BLOQUEA.has(C.m[15][7])) C.m[15][7] = ',';
  // Doña Susana da pistas.
  const susana = C.npcs.find(n => n.id === 'chela'); if(susana) susana.charlable = true;
  const juli = C.npcs.find(n => n.id === 'juli'); if(juli) juli.despues = [...juli.despues, 'Ah, y otra cosa: en el rincón de arriba a la derecha hay un árbol que no da sombra. Raro, ¿no?'];

  // Puerto Camalote: un islote en el río con una escalera que baja.
  const K = MAPAS.camalote;
  for(const [x, y] of [[31, 22], [32, 22], [31, 23], [32, 23]]) K.m[y][x] = 's';
  K.m[22][32] = 'V'; K.salidas['32,22'] = {mapa: 'templo', x: 9, y: 15};
  const capitan = INTERIORES.find(i => i.def && i.def.npc && i.def.npc.nombre === 'Capitán Tito Burón');
  if(capitan && MAPAS[capitan.id]){ const n = MAPAS[capitan.id].npcs[0]; if(n) n.frases = [...n.frases.slice(0, 2), 'Dicen que en el islote del río hay una escalera que baja al fondo del agua.', ...n.frases.slice(2)]; }

  // Cumbre Suprema: un seto de pinos, y uno se deja atravesar si sos Campeón.
  const U = MAPAS.supremo;
  for(let y = 2; y <= 12; y++) U.m[y][28] = 'T';
  U.m[7][27] = '.'; U.m[7][28] = 'Y'; U.salidas['28,7'] = {mapa: 'estudio', x: 6, y: 8};
  U.reqY = {'28,7': () => !!(S && S.campeon)};

  for(const f of [mapaGruta, mapaTemplo, mapaEstudio]){ const M = f(); MAPAS[M.id] = M; }
})();

/* ---------------- Ganchos que usa el mundo ---------------- */
function bloqueoSecreto(M, x, y){
  const k = x + ',' + y;
  return !!(M.reqY && M.reqY[k] && !M.reqY[k]());
}
const esDeNoche = () => { const h = new Date().getHours(); return h >= 0 && h < 6; };
const hoySec = () => new Date().toISOString().slice(0, 10);

// Al chocar contra algo: devuelve true si era un secreto.
function tocarSecreto(M, x, y){
  if(M.reqY && M.reqY[x + ',' + y] && !M.reqY[x + ',' + y]()){
    dialogo('', ['Se escucha un tecleo detrás de este pino...', 'Hay un cartelito clavado en la corteza: «Solo Campeones. Volvé cuando le ganes a Dolores Fuertes».']);
    return true;
  }
  if(M.pozo && M.pozo.x === x && M.pozo.y === y){ pozoDeseos(); return true; }
  return false;
}
async function pozoDeseos(){
  if(S.monedas < 50){ await dialogo('Pozo de los Deseos', ['Un pozo viejo con un cartel: «Tirá 50 monedas y pedí un deseo».', 'No te alcanza. ¡Qué pena!']); return; }
  S.monedas -= 50; $('#mon') && ($('#mon').textContent = S.monedas);
  const r = Math.random(), sec = SECRETO();
  let res;
  if(r < .5) res = ['Plop. La moneda cayó al fondo... y no pasó nada.', 'Bueno, por lo menos sonó lindo.'];
  else if(r < .78){ const txt = darPremio(premioAleatorio(true)); res = ['¡Del fondo del pozo salió flotando algo!', `Conseguiste ${txt}.`]; }
  else if(r < .93){ sec.suerte = 'buena'; res = ['El agua brilla con todos los colores...', 'Sentís que la próxima criatura salvaje puede ser shiny. (¡Una chance enorme!)']; }
  else { ganar(400); $('#mon') && ($('#mon').textContent = S.monedas); res = ['¡El pozo te devolvió la moneda... y 400 más!', 'Hoy es tu día de suerte.']; }
  guardar();
  await dialogo('Pozo de los Deseos', ['Tirás 50 monedas y cerrás los ojos...', ...res]);
}
// Al pisar un casillero: devuelve true si arrancó algo (combate).
function alPisarSecreto(M, x, y){
  if(M.luzMala && M.luzMala.x === x && M.luzMala.y === y && esDeNoche() && SECRETO().luzMala !== hoySec() && hayLuchadorEnPie()){
    SECRETO().luzMala = hoySec();
    MW.teclas.clear();
    dialogo('', ['Una lucecita verde flota sobre el pasto...', '¡Es la Luz Mala! Y no parece contenta.']).then(() => {
      const sp = ESPECIES.luzmala, nivel = 24, stats = statsPorNivel(sp.base, nivel);
      salirDelMundo(); guardar();
      empezarCombate([{esp: 'luzmala', nombre: sp.nombre, nivel, stats, hp: vidaMax(stats, nivel), tipo: sp.tipo, salvaje: true, shiny: Math.random() < .2}], zonaEn(M, x, y), null);
    });
    return true;
  }
  return false;
}
// Suerte acumulada (pozo o código): la próxima salvaje puede brillar.
function suerteSalvaje(salvaje){
  const sec = SECRETO();
  if(!sec.suerte) return;
  if(sec.suerte === 'segura' || Math.random() < .35) salvaje.shiny = true;
  delete sec.suerte;
}
// Charlas especiales: devuelve true si se ocupó.
async function charlaSecreta(n){
  const sec = SECRETO();
  if(n.espiritu){
    if(sec.espiritu){ await dialogo(n.nombre, ['El río sigue cantando. Cuidá mucho a tu nueva compañía.']); return true; }
    await dialogo(n.nombre, n.frases);
    const opciones = ['carosor', 'matesor', 'rufisor'].filter(e => !S.album.capt[e]);
    const esp = (opciones.length ? opciones : ['carosor', 'matesor', 'rufisor'])[Math.floor(Math.random() * (opciones.length || 3))];
    const c = nuevaCriatura(esp, 15, {shiny: true});
    if(S.equipo.length < MAX_EQUIPO) S.equipo.push(c); else S.reserva.push(c);
    S.album.vistos[esp] = true; S.album.capt[esp] = (S.album.capt[esp] || 0) + 1; S.album.shiny[esp] = true;
    sec.espiritu = true; guardar();
    await dialogo(n.nombre, [`Te confío a este ${ESPECIES[esp].nombre}. Nació del brillo del río: es de un color que nadie vio.`, `¡${ESPECIES[esp].nombre} shiny se unió a ${S.equipo.includes(c) ? 'tu equipo' : 'tu casa'}!`]);
    return true;
  }
  if(n.charlable){
    sec.charlas = sec.charlas || {};
    const v = sec.charlas[n.id] = (sec.charlas[n.id] || 0) + 1;
    if(v === 10){
      S.inv.objetos.caramelo = (S.inv.objetos.caramelo || 0) + 1; guardar();
      await dialogo(n.nombre, ['¿Otra vez vos? ¡Diez veces ya me viniste a escuchar!', 'Nadie me tiene tanta paciencia. Tomá, un Caramelo de dulce de leche, que lo hice yo.', 'Y te cuento un secreto: el pozo de la plaza a veces cumple deseos.']);
      return true;
    }
    if(v > 3 && v < 10){ await dialogo(n.nombre, [['¿Te conté de cuando mi abuelo vio un Yaguarayo? ¿No? Bueno, otro día.', 'Qué lindo día, ¿no?', 'Vos sí que sabés escuchar, ¿eh?', 'Ay, me olvidé lo que te iba a decir.', '¿Sabías que el Hornero hace su casa con barro y paja?', 'Si seguís viniendo, te voy a tener que dar algo.'][v % 6]]); return true; }
  }
  return false;
}

/* ---------------- Dibujos de los secretos ---------------- */
function dibujarSecretos(ctx, M, camX, camY, t){
  for(const it of M.items) if(it.cofre) cofreMapa(ctx, it.x * TS - camX, it.y * TS - camY, !!S.recogidos[it.id], t);
  if(M.pozo) pozoMapa(ctx, M.pozo.x * TS - camX, M.pozo.y * TS - camY, t);
  for(const k of Object.keys(M.salidas)){
    const [x, y] = k.split(',').map(Number);
    if(M.m[y][x] === 'V') escaleraMapa(ctx, x * TS - camX, y * TS - camY, t);
  }
  if(M.luzMala && esDeNoche() && SECRETO().luzMala !== hoySec()){
    const sx = M.luzMala.x * TS - camX + 16, sy = M.luzMala.y * TS - camY + 10 + Math.sin(t / 300) * 4, p = (Math.sin(t / 120) + 1) / 2;
    const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, 22);
    g.addColorStop(0, `rgba(170,255,220,${.7 + p * .3})`); g.addColorStop(.4, 'rgba(90,240,190,.35)'); g.addColorStop(1, 'rgba(90,240,190,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(sx, sy, 22, 0, 7); ctx.fill();
  }
}
function cofreMapa(ctx, sx, sy, abierto, t){
  ctx.fillStyle = 'rgba(20,20,30,.3)'; ctx.beginPath(); ctx.ellipse(sx + 16, sy + 27, 12, 4, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = '#22304A'; ctx.lineWidth = 2.5; ctx.lineJoin = 'round';
  ctx.fillStyle = '#A8622F'; ctx.fillRect(sx + 5, sy + 13, 22, 13); ctx.strokeRect(sx + 5, sy + 13, 22, 13);
  ctx.fillStyle = '#C07A44';
  if(abierto){ ctx.beginPath(); ctx.moveTo(sx + 5, sy + 13); ctx.lineTo(sx + 9, sy + 4); ctx.lineTo(sx + 31, sy + 4); ctx.lineTo(sx + 27, sy + 13); ctx.closePath(); ctx.fill(); ctx.stroke(); }
  else {
    ctx.beginPath(); ctx.moveTo(sx + 5, sy + 13); ctx.quadraticCurveTo(sx + 16, sy + 2, sx + 27, sy + 13); ctx.closePath(); ctx.fill(); ctx.stroke();
    const p = (Math.sin(t / 250) + 1) / 2; ctx.fillStyle = `rgba(255,230,120,${.3 + p * .5})`; ctx.beginPath(); ctx.arc(sx + 16, sy + 6, 3 + p * 2, 0, 7); ctx.fill();
  }
  ctx.fillStyle = '#FFD23F'; ctx.fillRect(sx + 14, sy + 15, 4, 6); ctx.strokeRect(sx + 14, sy + 15, 4, 6);
}
function pozoMapa(ctx, sx, sy, t){
  ctx.fillStyle = 'rgba(20,30,40,.25)'; ctx.beginPath(); ctx.ellipse(sx + 16, sy + 28, 14, 4, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = '#22304A'; ctx.lineWidth = 2.5;
  ctx.fillStyle = '#9AA2AD'; ctx.beginPath(); ctx.ellipse(sx + 16, sy + 22, 13, 6, 0, 0, Math.PI); ctx.lineTo(sx + 3, sy + 14); ctx.ellipse(sx + 16, sy + 14, 13, 6, 0, Math.PI, 0, true); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#3B82D6'; ctx.beginPath(); ctx.ellipse(sx + 16, sy + 14, 10, 4, 0, 0, 7); ctx.fill(); ctx.stroke();
  const p = (Math.sin(t / 400) + 1) / 2; ctx.fillStyle = `rgba(255,255,255,${.3 + p * .4})`; ctx.beginPath(); ctx.ellipse(sx + 13, sy + 13, 3, 1.2, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#8A5A35'; ctx.fillRect(sx + 3, sy - 2, 3, 16); ctx.fillRect(sx + 26, sy - 2, 3, 16); ctx.strokeRect(sx + 3, sy - 2, 3, 16); ctx.strokeRect(sx + 26, sy - 2, 3, 16);
  ctx.fillStyle = '#E2574C'; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + 16, sy - 9); ctx.lineTo(sx + 32, sy); ctx.closePath(); ctx.fill(); ctx.stroke();
}
function escaleraMapa(ctx, sx, sy, t){
  ctx.fillStyle = '#1B2244'; ctx.strokeStyle = '#22304A'; ctx.lineWidth = 2.5;
  ctx.fillRect(sx + 4, sy + 4, 24, 24); ctx.strokeRect(sx + 4, sy + 4, 24, 24);
  ctx.fillStyle = '#9AA2AD'; for(let i = 0; i < 4; i++){ ctx.fillRect(sx + 6 + i * 2, sy + 6 + i * 5, 20 - i * 4, 3); }
  const p = (Math.sin(t / 350) + 1) / 2; ctx.fillStyle = `rgba(143,211,247,${.15 + p * .25})`; ctx.fillRect(sx + 4, sy + 4, 24, 24);
}

/* ---------------- El código de siempre ---------------- */
(() => {
  const CODIGO = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let i = 0;
  document.addEventListener('keydown', e => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    i = k === CODIGO[i] ? i + 1 : (k === CODIGO[0] ? 1 : 0);
    if(i < CODIGO.length) return;
    i = 0;
    if(typeof S === 'undefined' || !S) return;
    const sec = SECRETO();
    if(sec.codigo === hoySec()){ avisar('El código ya funcionó hoy. Volvé mañana.'); return; }
    sec.codigo = hoySec(); sec.suerte = 'segura'; guardar();
    lluviaConfeti();
    avisar('¡Código secreto! La próxima criatura salvaje que encuentres va a ser shiny.', 'nivel');
  });
})();
function lluviaConfeti(){
  const d = document.createElement('div'); d.className = 'confeti';
  const cols = ['#E2574C', '#FFD23F', '#4CC27A', '#3B82D6', '#FF8FB1', '#7A4FC9'];
  d.innerHTML = Array.from({length: 60}, (_, i) => `<i style="left:${Math.random() * 100}%;background:${cols[i % 6]};animation-delay:${Math.random() * .8}s;animation-duration:${1.8 + Math.random() * 1.4}s"></i>`).join('');
  document.body.appendChild(d); setTimeout(() => d.remove(), 3600);
}
