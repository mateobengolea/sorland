'use strict';
/* =====================================================================
   Más Sorlandia:
   - Pueblo Malbec y la Ruta del Vino (al norte de la Laguna del Sauce) con la Mina Abandonada.
   - Bahía Ballena (al este de Pueblo Escarcha) con la Gruta de las Ballenas.
   - Pesca con caña, piedras evolutivas y casas con regalos.
   ===================================================================== */
// Convierte las puertas de Centro y Market de un mapa en interiores.
function interioresDe(M){
  for(const k of Object.keys(M.puertas)){
    const acc = M.puertas[k], [px, py] = k.split(',').map(Number), afuera = {mapa: M.id, x: px, y: py + 1};
    let N = null;
    if(acc === 'centro') N = mapaCentro('centro_' + M.id, M.nombre, afuera);
    else if(acc === 'market') N = mapaMarket('market_' + M.id, M.nombre, afuera);
    if(N){ MAPAS[N.id] = N; M.puertas[k] = {interior: N.id}; }
  }
}
function laberinto(M, W, H, ini, semilla){
  const r = rng(semilla), celda = (x, y) => x > 0 && y > 0 && x < W - 1 && y < H - 1;
  const vis = new Set([ini.join(',')]), pila = [ini];
  M.m[ini[1]][ini[0]] = 'k';
  while(pila.length){
    const [x, y] = pila[pila.length - 1];
    const vec = [[2, 0], [-2, 0], [0, 2], [0, -2]].map(([dx, dy]) => [x + dx, y + dy, dx, dy]).filter(([nx, ny]) => celda(nx, ny) && !vis.has(nx + ',' + ny));
    if(!vec.length){ pila.pop(); continue; }
    const [nx, ny, dx, dy] = vec[Math.floor(r() * vec.length)];
    M.m[y + dy / 2][x + dx / 2] = 'k'; M.m[ny][nx] = 'k'; vis.add(nx + ',' + ny); pila.push([nx, ny]);
  }
  const dist = {}, prev = {}, q = [ini]; dist[ini.join(',')] = 0;
  while(q.length){ const [x, y] = q.shift();
    for(const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]){ const nx = x + dx, ny = y + dy, k = nx + ',' + ny;
      if(!celda(nx, ny) || dist[k] !== undefined || M.m[ny][nx] !== 'k') continue; dist[k] = dist[x + ',' + y] + 1; prev[k] = [x, y]; q.push([nx, ny]); } }
  const vecinos = (x, y) => [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([dx, dy]) => M.m[y + dy] && M.m[y + dy][x + dx] === 'k').length;
  const callejones = Object.entries(dist).map(([k, d]) => [...k.split(',').map(Number), d]).filter(([x, y]) => vecinos(x, y) === 1).sort((a, b) => b[2] - a[2]);
  return {dist, prev, callejones, vecinos};
}

/* ---------------- Pueblo Malbec y la Ruta del Vino ---------------- */
function mapaMalbec(){
  const W = 34, H = 30;
  const M = nuevoMapa('malbec', 'Pueblo Malbec', W, H, 9393, '.', {pasto: '#B9D98E', pastoAlto: '#7EAE5E', brizna: '#5A8A40', tierra: '#E2C59A', arbol: 'normal', fondo: '#5A6E3E'});
  M.mancha(2, 15, 31, 27, 12, ',', 1.4, 3);
  M.salpicar(1, 15, 32, 28, .04, 'T', ['.']);
  // Viñedos: hileras de parras
  for(const y of [17, 20, 23, 26]) for(let x = 3; x <= 30; x++) if((x < 14 || x > 18) && x % 9 !== 0) M.m[y][x] = 'T';
  M.borde('T');
  M.rect(4, 4, 29, 13, ':');
  M.camino(16, 4, 16, 28);
  M.camino(4, 8, 29, 8);
  M.salida(16, 29, 'laguna', 3, 1);
  M.edificio(13, 2, 7, 'mina', {interior: 'mina'}, {color: '#5A4A40'});
  M.edificio(5, 4, 5, 'centro', 'centro');
  M.edificio(24, 4, 5, 'market', 'market');
  casaConInterior(M, 5, 10, '#8E2A4A', {nombre: 'Bodega Don Tinto', npc: {nombre: 'Bodeguero Tinto Reserva', ropa: '#8E2A4A', pelo: '#BFBFBF', accion: bodeguero}});
  casaConInterior(M, 24, 10, '#7A6A9E', {nombre: 'Casa del Piedrero', npc: {nombre: 'Piedrero Ónix Brillante', ropa: '#7A6A9E', pelo: '#2A2420', accion: piedrero}});
  M.npc({id: 'vecina_malbec', x: 12, y: 9, tipo: 'vecino', nombre: 'Doña Uva Pasa', ropa: '#B03A5E', pelo: '#E9E2D3', suelo: ':',
    frases: ['¡Bienvenido a Pueblo Malbec, tierra de viñedos!', 'Al norte está la Mina Abandonada. Adentro hay piedras que brillan... y algo más grande que duerme.', 'Llevá Fuerza: hay rocas tapando los pasillos.']});
  M.zonas = [['malbec', 4, 2, 29, 13], ['rutavino', 1, 14, 32, 28]]; M.zonaBase = 'rutavino';
  interioresDe(M);
  return M;
}
function mapaMina(){
  const W = 25, H = 23;
  const M = nuevoMapa('mina', 'Mina Abandonada', W, H, 5252, '#', {pasto: '#6E5E50', pastoAlto: '#6E5E50', brizna: '#5A4C40', tierra: '#5A4C40', arbol: 'normal', fondo: '#0E0A08', oscuro: true, cueva: true});
  const {prev, callejones, vecinos} = laberinto(M, W, H, [12, 21], 3131);
  M.salida(12, 22, 'malbec', 16, 4); M.m[22][12] = 'k';
  const [ax, ay] = callejones[0];
  M.m[ay][ax] = 'A'; M.altares[ax + ',' + ay] = 'uritorco';
  // Dos rocas en el camino al altar: hace falta Fuerza.
  const camino = []; let p = prev[ax + ',' + ay];
  while(p){ camino.unshift(p); p = prev[p[0] + ',' + p[1]]; }
  const medio = camino.filter(([x, y], i) => i > 3 && vecinos(x, y) === 2);
  for(const f of [.35, .7]){ const c = medio[Math.floor(medio.length * f)]; if(c) M.m[c[1]][c[0]] = 'O'; }
  const piedras = ['piedra_fuego', 'piedra_trueno', 'piedra_hoja'];
  callejones.slice(1, 4).forEach(([x, y], i) => M.items.push({id: 'cofre_mina' + i, x, y, cofre: true, premio: {obj: piedras[i], n: 1}}));
  const [t1, t2] = [callejones[4], callejones[5]];
  if(t1) M.npc({...entrenador('mina_t1', t1[0], t1[1], 'Minero', 'Carbón Negrete', [['cuarzon', 23], ['morro', 23], ['pilon', 24]], 420, ['¡Esta veta es mía!'], ['Me quedé sin pico otra vez.'], '#5A4A40'), suelo: 'k'});
  if(t2) M.npc({...entrenador('mina_t2', t2[0], t2[1], 'Geóloga', 'Esmeralda Veta', [['geodon', 24], ['fosilon', 24]], 450, ['Encontré una geoda gigante. ¿Peleamos por ella?'], ['Te la regalo. Bah, no.'], '#4CC27A'), suelo: 'k'});
  M.zonas = [['mina', 0, 0, W - 1, H - 1]]; M.zonaBase = 'mina';
  M.afuera = {mapa: 'malbec', x: 16, y: 4};
  M.entrada = {x: 12, y: 21};
  return M;
}
async function bodeguero(n){
  const sec = SEC2();
  if(sec.cachorro){ await dialogo(n.nombre, ['¿Cómo anda el Cachorrín? Acordate: con una piedra distinta, se transforma en algo distinto.', 'Las piedras se venden en los Market cuando tenés cinco medallas. Y en la mina hay algunas escondidas.']); return; }
  await dialogo(n.nombre, ['¡Pasá, pasá! Entre los barriles de la bodega vive una familia de Cachorrines.', 'Son especiales: según la piedra que toquen, cambian de forma. ¡Hay seis formas distintas!', 'Este se encariñó con vos. Llevátelo.']);
  const donde = regalarCriatura('cachorrin', 10, {shiny: Math.random() < .05});
  sec.cachorro = true; guardar();
  await dialogo('¡Regalo!', [`¡Cachorrín se unió a ${donde}!`]);
}
async function piedrero(n){
  const sec = SEC2();
  if(sec.piedrero){ await dialogo(n.nombre, ['Brasa, Ola, Hoja, Trueno, Escarcha y Pluma: seis piedras, seis formas de Cachorrín.', 'Si no las encontrás, el Market las vende a quienes tienen cinco medallas.']); return; }
  const p = PIEDRAS[Math.floor(Math.random() * PIEDRAS.length)];
  await dialogo(n.nombre, ['Colecciono piedras que brillan. Algunas tienen poder de verdad.', `Tomá, te regalo una ${p.nom}. Dásela a un Cachorrín y vas a ver.`]);
  S.inv.objetos[p.id] = (S.inv.objetos[p.id] || 0) + 1; sec.piedrero = true; guardar();
}

/* ---------------- Bahía Ballena y la Gruta de las Ballenas ---------------- */
function mapaBahia(){
  const W = 36, H = 28;
  const M = nuevoMapa('bahia', 'Bahía Ballena', W, H, 7676, '.', {pasto: '#E6F2F8', pastoAlto: '#BCD9E8', brizna: '#8DB6CC', tierra: '#D9E6EE', arbol: 'pino', fondo: '#4E6E80'});
  M.mancha(2, 1, 24, 5, 6, ',', 1.2, 2.4);
  M.mancha(2, 21, 24, 26, 6, ',', 1.2, 2.4);
  M.salpicar(1, 1, 25, 26, .05, 'T', ['.']);
  for(let y = 1; y <= 26; y++){ const off = Math.round(Math.sin(y * .5) * 1.4); for(let x = 26 + off; x <= 34; x++) M.set(x, y, '~'); }
  for(const [x, y] of [[31, 7], [32, 7], [33, 7], [31, 8], [32, 8], [33, 8], [31, 9], [32, 9], [33, 9]]) M.m[y][x] = 's';
  M.borde('T');
  M.rect(4, 6, 22, 20, ':');
  M.camino(1, 14, 22, 14);
  M.camino(13, 2, 13, 25);
  M.camino(22, 14, 29, 14); // muelle
  M.salida(0, 14, 'escarcha', 26, 4);
  M.m[8][32] = 'V'; M.salidas['32,8'] = {mapa: 'ballenas', x: 10, y: 15};
  M.edificio(5, 7, 5, 'centro', 'centro');
  M.edificio(16, 7, 5, 'market', 'market');
  casaConInterior(M, 5, 16, '#3B82D6', {nombre: 'Casa del Pescador del Sur', npc: {nombre: 'Pescador Elmer Luza', ropa: '#3B82D6', pelo: '#E9E2D3', accion: pescadorSur}});
  casaConInterior(M, 16, 16, '#5E7E9A', {nombre: 'Casa del Ballenero', npc: {nombre: 'Ballenero Jonás Ballena', ropa: '#24486E', pelo: '#BFBFBF', accion: ballenero}});
  M.npc({id: 'vecino_bahia', x: 10, y: 12, tipo: 'vecino', nombre: 'Marinera Brisa Salada', ropa: '#FFFFFF', pelo: '#E2574C', suelo: ':',
    frases: ['¡Bienvenido a Bahía Ballena, la ciudad del fin del mundo!', 'En el islote del este hay una gruta. Dicen que adentro canta una ballena gigante.', 'Con Surf llegás nadando desde el muelle.']});
  M.zonas = [['bahia', 4, 6, 22, 20], ['costasur', 1, 1, 34, 26]]; M.zonaBase = 'costasur';
  interioresDe(M);
  return M;
}
function mapaBallenas(){
  const plano = [
    '#####################',
    '#kkk#~~~~~~~~~#kkAkk#',
    '#kkk#~~~~~~~~~#kkkkk#',
    '#kk~~~~###~~~~~~kkkk#',
    '#kk~~~~#k#~~~~~~~kkk#',
    '#~~~~~~~~~~~~~##~~~~#',
    '#~~~kk~~~~~~~~##~~~~#',
    '#~~~kk~~~###~~~~~~kk#',
    '#~~~~~~~~#k#~~~~~~kk#',
    '#kkk~~~~~~~~~~~~~~~~#',
    '#kkk~~~~~~~##~~~~kkk#',
    '#kk##~~~~~~##~~~~kkk#',
    '#kk##~~kkkk~~~~~~~~~#',
    '#kkkk~~kkkk~~~~~~~kk#',
    '#kkkkk~~~~~~~~kkkkkk#',
    '#kkkkkkkkkkkkkkkkkkk#',
    '##########k##########',
  ];
  const W = plano[0].length, H = plano.length;
  const M = nuevoMapa('ballenas', 'Gruta de las Ballenas', W, H, 8484, 'k', {pasto: '#7E9AB0', pastoAlto: '#7E9AB0', brizna: '#5E7E9A', tierra: '#8EA8BC', arbol: 'normal', fondo: '#0E2A40', cueva: true, tinte: 'rgba(60,140,220,.14)'});
  plano.forEach((f, y) => { for(let x = 0; x < W; x++) M.m[y][x] = f[x]; });
  M.salida(10, 16, 'bahia', 32, 9); M.m[16][10] = 'k';
  M.altares['17,1'] = 'ballenaria';
  M.items.push({id: 'cofre_ball1', x: 8, y: 4, cofre: true, premio: {obj: 'piedra_agua', n: 1}});
  M.items.push({id: 'cofre_ball2', x: 10, y: 8, cofre: true, premio: {obj: 'piedra_hielo', n: 1}});
  M.items.push({id: 'cofre_ball3', x: 4, y: 6, cofre: true, premio: {obj: 'piedra_viento', n: 1}});
  M.npc({...entrenador('ball_t1', 2, 13, 'Buzo', 'Coral Arrecife', [['pejerrey', 29], ['tortugon', 29], ['bagron', 30]], 600, ['¡Bajé a ver la ballena y me encontré con vos!'], ['Me hundiste.'], '#3B82D6'), suelo: 'k'});
  M.npc({...entrenador('ball_t2', 18, 13, 'Exploradora', 'Polar Austral', [['pinguinazo', 30], ['glaciaro', 31]], 650, ['El frío de esta gruta no es normal.'], ['La ballena está más al norte, cruzando el agua.'], '#BFE9FF'), suelo: 'k'});
  M.zonas = [['ballenas', 0, 0, W - 1, H - 1]]; M.zonaBase = 'ballenas';
  M.afuera = {mapa: 'bahia', x: 32, y: 9};
  M.entrada = {x: 10, y: 15};
  return M;
}
async function pescadorSur(n){
  if(S.inv.objetos.supercana){ await dialogo(n.nombre, ['¿Ya sacaste un Dorado con la Súper caña? Tirá en aguas hondas, que ahí están los grandes.']); return; }
  await dialogo(n.nombre, ['Cuarenta años pescando en la Bahía. Los peces de acá son de otro tamaño.', 'Con una caña común no sacás nada grande. Tomá la mía: una Súper caña.']);
  S.inv.objetos.supercana = 1; guardar();
  await dialogo('¡Objeto clave!', ['Conseguiste la Súper caña. Usala desde el menú, mirando al agua.']);
}
async function ballenero(n){
  const sec = SEC2();
  await dialogo(n.nombre, ['Mi abuelo vio a Ballenaria, la ballena gigante del fin del mundo.', 'Vive en la Gruta de las Ballenas, del otro lado del agua. Solo aparece ante quien tiene las ocho medallas.']);
  if(!sec.ballenero){ S.inv.objetos.piedra_hielo = (S.inv.objetos.piedra_hielo || 0) + 1; sec.ballenero = true; guardar(); await dialogo(n.nombre, ['Tomá, esta Piedra Escarcha la encontré en la panza de un pez. Es tuya.']); }
}
async function pescadorLaguna(n){
  if(S.inv.objetos.cana){ await dialogo(n.nombre, ['¿Ya probaste la caña? Mirá al agua y elegí «Pescar» en el menú.', 'Las Ruinas del Sol, al norte, tienen tablas de piedra para armar.']); return; }
  await dialogo(n.nombre, ['¡Pique bárbaro hoy! ¿Vos no pescás?', 'Tomá, tengo una caña de más. Mirando al agua, elegí «Pescar» en el menú.']);
  S.inv.objetos.cana = 1; guardar();
  await dialogo('¡Objeto clave!', ['Conseguiste la Caña de pescar. En la Laguna salen Mojarritas y hasta algún Doradito.']);
}

/* ---------------- Pesca ---------------- */
const DIR_MIRA = {arriba: [0, -1], abajo: [0, 1], izq: [-1, 0], der: [1, 0]};
const esAgua = c => c === '~' || c === 'b';
async function pescar(){
  if(!MW || MW.ocupado || vista !== 'mundo') return;
  const cana = S.inv.objetos.supercana ? 'supercana' : S.inv.objetos.cana ? 'cana' : null;
  if(!cana){ avisar('Necesitás una caña de pescar.'); return; }
  const M = mapaActual(), [dx, dy] = DIR_MIRA[MW.mira] || [0, 1];
  const tx = MW.pos.x + dx, ty = MW.pos.y + dy;
  if(!(M.m[ty] && esAgua(M.m[ty][tx])) && !esAgua(M.m[MW.pos.y][MW.pos.x])){ await dialogo('', ['Para pescar, pará al lado del agua y mirá hacia ella.']); return; }
  if(!hayLuchadorEnPie()){ await dialogo('', ['Tu equipo está agotado. Andá a curarlo antes de pescar.']); return; }
  MW.ocupado = true; MW.teclas.clear();
  MW.pesca = {x: esAgua(M.m[ty] && M.m[ty][tx]) ? tx : MW.pos.x, y: esAgua(M.m[ty] && M.m[ty][tx]) ? ty : MW.pos.y, desde: performance.now(), pica: false};
  await espera(900 + Math.random() * 1600);
  const pica = Math.random() < (cana === 'supercana' ? .8 : .7);
  if(MW && MW.pesca) MW.pesca.pica = pica;
  await espera(500);
  if(!MW){ return; }
  MW.ocupado = false;
  if(!pica){ MW.pesca = null; await dialogo('', ['...', 'No pica nada. Probá de nuevo.']); return; }
  await dialogo('', ['¡Picó algo! ¡Tirá, tirá!']);
  MW.pesca = null;
  const z = cana === 'supercana' ? 'pescagrande' : 'pesca';
  const pez = crearSalvaje(z); if(typeof suerteSalvaje === 'function') suerteSalvaje(pez);
  salirDelMundo(); guardar();
  empezarCombate([pez], 'rio', null);
}
Object.assign(ARENAS, {pesca: 'rio', pescagrande: 'rio', rutavino: 'pradera', malbec: 'pradera', mina: 'sierras', bahia: 'cumbres', costasur: 'cumbres', ballenas: 'rio'});

/* ---------------- Piedras y cañas desde la mochila ---------------- */
function envolverUsarObjeto(){
  const original = usarObjeto;
  usarObjeto = function(id){
    const o = OBJETOS.find(x => x.id === id); if(!o || !(S.inv.objetos[id] > 0)) return;
    if(o.usa === 'cana'){
      if(vista !== 'mundo'){ avisar('La caña se usa mientras explorás, mirando al agua.'); return; }
      cerrarHoja(); pescar(); return;
    }
    if(o.usa === 'piedra'){ usarPiedra(o); return; }
    return original(id);
  };
}
// juego.js (donde vive usarObjeto) carga después que este archivo.
if(typeof usarObjeto === 'function') envolverUsarObjeto(); else window.addEventListener('DOMContentLoaded', envolverUsarObjeto);
function usarPiedra(o){
  const todas = [...S.equipo, ...S.reserva];
  const sirve = c => ESPECIES[c.esp].evolPiedra && ESPECIES[c.esp].evolPiedra[o.id];
  hojaActual = 'usar';
  const v = nuevoVelo();
  v.innerHTML = `<div class="hoja hoja-elegir" role="dialog" aria-label="Usar ${esc(o.nom)}">
    <div class="hoja-cab"><h2>¿Quién toca la ${esc(o.nom)}?</h2><button class="cerrar" aria-label="Cerrar">×</button></div>
    <p class="rotulo-chico">${esc(o.desc)}</p>
    <div class="grilla-elegir">${todas.map((c, i) => `<button class="elegible${c.shiny ? ' es-shiny' : ''}" data-i="${i}" ${sirve(c) ? '' : 'disabled'} style="--tipo:${TIPOS[tipoDe(c.esp)].color}">
      <span class="el-img">${svgEspecie(c.esp, {humor: 'feliz', shiny: c.shiny})}</span><b data-nom="${i}"></b><small>${sirve(c) ? `¡Puede evolucionar en ${ESPECIES[sirve(c)].nombre}!` : 'No reacciona'}</small></button>`).join('')}</div></div>`;
  todas.forEach((c, i) => { v.querySelector(`[data-nom="${i}"]`).textContent = c.nombre; });
  v.querySelector('.cerrar').onclick = cerrarHoja;
  v.querySelectorAll('[data-i]').forEach(b => b.onclick = async () => {
    const c = todas[+b.dataset.i], a = sirve(c); if(!a) return;
    S.inv.objetos[o.id]--; if(!S.inv.objetos[o.id]) delete S.inv.objetos[o.id];
    cerrarHoja();
    const viejo = ESPECIES[c.esp], nuevo = ESPECIES[a], antes = c.nombre, espAntes = c.esp;
    if(c.nombre === viejo.nombre) c.nombre = nuevo.nombre;
    c.stats.vida += nuevo.base.vida - viejo.base.vida; c.stats.fuerza += nuevo.base.fuerza - viejo.base.fuerza; c.stats.velocidad += nuevo.base.velocidad - viejo.base.velocidad;
    c.esp = a;
    S.album.vistos[a] = true; S.album.capt[a] = (S.album.capt[a] || 0) + 1; if(c.shiny) S.album.shiny[a] = true;
    // Aprende el poder básico de su nuevo tipo.
    asegurarMovs(c);
    const nuevoMov = aprendeDe(nuevo.tipo).find(([n]) => n <= c.nivel);
    guardar();
    await escenaEvolucion(espAntes, a, antes, c.shiny);
    if(nuevoMov) await aprenderPoder(c, nuevoMov[1]);
    guardar();
    if(vista === 'casa') pintarJuego(); else if(MW) MW.imgLider = null;
  });
}

/* ---------------- Armado ---------------- */
(function armarMasMundo(){
  for(const f of [mapaMalbec, mapaMina, mapaBahia, mapaBallenas]){ const M = f(); MAPAS[M.id] = M; }
  repartirObjetos(MAPAS.malbec, 4); repartirObjetos(MAPAS.bahia, 4);
  INTERIORES.forEach((info, n) => { if(!MAPAS[info.id]){ const M = mapaInterior(info, n); MAPAS[M.id] = M; } });
  const L = MAPAS.laguna;
  L.camino(3, 1, 3, 5); L.salida(3, 0, 'malbec', 16, 28);
  const pesc = L.npcs.find(n => n.id === 'pescador_laguna'); if(pesc) pesc.accion = pescadorLaguna;
  const E = MAPAS.escarcha;
  E.camino(22, 4, 26, 4); E.salida(27, 4, 'bahia', 1, 14);
  REGION.malbec = [6, 52]; REGION.bahia = [94, 34];
  RUTAS.push(['laguna', 'malbec'], ['escarcha', 'bahia']);
  const mas = {
    malbec: [['mal_t1', 6, 18, 'Vendimiadora', 'Uva Moscatel', [['jacarandita', 16], ['hojarrin', 17]], 260, ['¡Época de cosecha! Y de peleas.'], ['Me pisaste las uvas.'], '#8E2A4A'],
             ['mal_t2', 26, 19, 'Sommelier', 'Cabernet Sauvignon', [['zorrolumbre', 17], ['cachorrin', 17]], 270, ['Este combate tiene notas a victoria.'], ['Sabor amargo.'], '#5A2A3A'],
             ['mal_t3', 10, 25, 'Arriero', 'Mula Terca', [['nandu', 18], ['peludito', 18]], 280, ['¡Arre, arre!'], ['Mi mula no quiere más.'], '#8A5A35'],
             ['mal_t4', 24, 25, 'Andinista', 'Aconcagua Pérez', [['condorcito', 18], ['huemulito', 18]], 290, ['Bajé de la cordillera para pelear.'], ['Me vuelvo a la montaña.'], '#4656A0']],
    bahia: [['bah_t1', 6, 3, 'Pescadora', 'Merluza Fresca', [['mojarron', 26], ['doradito', 26]], 380, ['¡Recién sacados del mar!'], ['Se me escaparon.'], '#3B82D6'],
            ['bah_t2', 20, 3, 'Guardaparque', 'Pingüino Rey', [['pinguinazo', 27], ['escarchon', 27]], 390, ['Cuido a todos los pingüinos de la costa.'], ['Ellos me van a consolar.'], '#4CC27A'],
            ['bah_t3', 8, 24, 'Surfista', 'Ola Gigante', [['olarrin', 27], ['ranacua', 27]], 400, ['¡Qué olas hay en el sur!'], ['Me revolcó.'], '#5AB4E8'],
            ['bah_t4', 20, 24, 'Faquira', 'Nevada Blanca', [['nevarrin', 28], ['glaciaro', 28]], 420, ['El frío no me hace nada.'], ['Ahora sí tengo frío.'], '#BFE9FF']],
  };
  for(const [id, lista] of Object.entries(mas)){ const M = MAPAS[id]; for(const t of lista) sumarEntrenador(M, ...t); }
})();

/* ---------------- Dibujos: la caña y el corcho ---------------- */
(() => {
  const dib = dibujarSecretos;
  dibujarSecretos = function(ctx, M, camX, camY, t){
    dib(ctx, M, camX, camY, t);
    if(MW && MW.pesca){
      const p = MW.pesca, px = (MW.pos.x + .5) * TS - camX, py = (MW.pos.y + .3) * TS - camY;
      const bx = (p.x + .5) * TS - camX, by = (p.y + .55) * TS - camY + (p.pica ? Math.sin(t / 60) * 3 + 3 : Math.sin(t / 400) * 1.5);
      ctx.strokeStyle = '#FFFDF8'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(px + 6, py - 8); ctx.quadraticCurveTo((px + bx) / 2, Math.min(py, by) - 20, bx, by); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(bx, by + 4, 8 + Math.sin(t / 200) * 2, 3, 0, 0, 7); ctx.stroke();
      ctx.fillStyle = '#E2574C'; ctx.strokeStyle = '#22304A'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(bx, by, 4, Math.PI, 0); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#FFFDF8'; ctx.beginPath(); ctx.arc(bx, by, 4, 0, Math.PI); ctx.fill(); ctx.stroke();
      if(p.pica){ ctx.fillStyle = '#E2492E'; ctx.font = '800 18px "Baloo 2", sans-serif'; ctx.textAlign = 'center'; ctx.fillText('!', px, py - 46); }
    }
  };
})();
