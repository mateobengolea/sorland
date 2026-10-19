'use strict';
/* =====================================================================
   Rompecabezas:
   - Lago Congelado (Pueblo Escarcha): en el hielo patinás hasta chocar.
   - Cantera de las Rocas (Villa Piedra): empujá rocas a los pozos (con Fuerza).
   - Templo de las Palancas (Minas): tres palancas abren y cierran rejas.
   Al final de cada uno hay un cofre. Un guía en cada pueblo te lleva,
   y adentro otro te deja empezar de nuevo si te trabás.
   ===================================================================== */
for(const c of ['I', 'Q', '0', 'J', 'Z']) if(['Q', '0', 'J', 'Z'].includes(c)) BLOQUEA.add(c);
const PUZZLES = {
  lago: {nombre: 'Lago Congelado', pueblo: 'escarcha', cerca: [6, 20], tema: {pasto: '#E6F2F8', pastoAlto: '#E6F2F8', brizna: '#BCD9E8', tierra: '#E6F2F8', arbol: 'pino', fondo: '#4E6E80'},
    plano: ['###############', '#######s#######', '#II#IIII#IIIII#', '#IIIIII#I#IIII#', '#IIII#I#I#IIII#', '#III#I##IIIIII#', '##IIIIIIIIIIII#', '#II#IIIIIIIIII#', '#IIIIIIII#IIII#', '#IIIIIIII#IIII#', '#II#IIIIIIIIII#', '#sssssssssssss#', '#######s#######'],
    cofre: [7, 1], premio: {obj: 'ultracapsula', n: 5}, extra: {obj: 'piedra_hielo', n: 1}, salida: [7, 12], entrada: [7, 11],
    guia: ['¿Ves ese lago? Está congelado de punta a punta.', 'En el hielo no podés frenar: patinás hasta chocar con una piedra.', 'Del otro lado hay un cofre que nadie pudo alcanzar. ¿Te animás?']},
  cantera: {nombre: 'Cantera de las Rocas', pueblo: 'villapiedra', cerca: [6, 20], tema: {pasto: '#CFC7B8', pastoAlto: '#CFC7B8', brizna: '#B8AE9C', tierra: '#D9D0C1', arbol: 'normal', fondo: '#5A4C40'},
    plano: ['#############', '######k######', '######0######', '######0######', '###...0...###', '###.Q...Q.###', '###...Q...###', '###.......###', '###.......###', '######k######'],
    cofre: [6, 1], premio: {obj: 'revivirmax', n: 2}, extra: {obj: 'alfajor', n: 2}, salida: [6, 9], entrada: [6, 8], fuerza: true,
    guia: ['La cantera tiene tres pozos que tapan el paso al cofre del capataz.', 'Con Fuerza podés empujar las rocas. Si una roca cae en un pozo, lo tapa.', 'Ojo: si la trabás contra una pared, ya no la sacás. Hablá con el cantero de adentro para empezar de nuevo.']},
  palancas: {nombre: 'Templo de las Palancas', pueblo: 'minas', cerca: [6, 20], tema: {pasto: '#C9B79C', pastoAlto: '#C9B79C', brizna: '#A89470', tierra: '#D9C9A8', arbol: 'normal', fondo: '#3A2E24'}, region2: true,
    plano: ['###############', '#######k#######', '#######Z#######', '#######Z#######', '#######Z#######', '#J.....k.....J#', '#.............#', '#.............#', '#...J.........#', '#.............#', '#######k#######'],
    cofre: [7, 1], premio: {obj: 'jarabetotal', n: 3}, extra: {obj: 'energizante', n: 3}, salida: [7, 10], entrada: [7, 9],
    // Cada palanca cambia algunas rejas (de abajo hacia arriba: 0, 1 y 2).
    palancas: {'1,5': [0, 1], '13,5': [1], '4,8': [2, 0]}, rejas: [[7, 4], [7, 3], [7, 2]],
    guia: ['Un templo charrúa con tres rejas y tres palancas.', 'La inscripción dice: «Cada palanca mueve rejas distintas. Abrilas todas».', 'Si te mareás, el cuidador de adentro deja todo como estaba.']},
};
const SEC_PUZ = () => { S.puzzles = S.puzzles || {}; return S.puzzles; };

function armarPuzzle(id){
  const P = PUZZLES[id], H = P.plano.length, W = P.plano[0].length, pueblo = MAPAS[P.pueblo];
  const M = nuevoMapa('puz_' + id, P.nombre, W, H, 9800 + id.length, 'k', P.tema);
  M.m = P.plano.map(f => f.split(''));
  M.original = P.plano.map(f => f.split(''));
  M.puzzle = id;
  const sitio = P.sitio;
  M.salida(P.salida[0], P.salida[1], P.pueblo, sitio[0], sitio[1] + 1);
  M.items.push({id: 'cofre_puz_' + id, x: P.cofre[0], y: P.cofre[1], cofre: true, premio: P.premio});
  M.entrada = {x: P.entrada[0], y: P.entrada[1]};
  M.afuera = {mapa: P.pueblo, x: sitio[0], y: sitio[1] + 1};
  M.zonas = [['interior', 0, 0, W - 1, H - 1]]; M.zonaBase = 'interior';
  if(P.region2) M.region = 2;
  // El que reinicia: parado al lado de la entrada.
  const rx = P.entrada[0] + (M.m[P.entrada[1]][P.entrada[0] + 1] && !BLOQUEA.has(M.m[P.entrada[1]][P.entrada[0] + 1]) && M.m[P.entrada[1]][P.entrada[0] + 1] !== 'I' ? 1 : -1);
  M.npc({id: 'puz_reinicio_' + id, x: rx, y: P.entrada[1], tipo: 'vecino', nombre: id === 'cantera' ? 'Cantero Pico Viejo' : id === 'lago' ? 'Patinadora Hoja de Hielo' : 'Cuidador del Templo', suelo: M.m[P.entrada[1]][rx],
    ropa: '#7A5232', pelo: '#E9E2D3', accion: async n => {
      const i = await elegirOpcion(n.nombre, '¿Querés que deje todo como estaba al principio?', ['Sí, empezar de nuevo', 'No, sigo']);
      if(i === 0){ reiniciarPuzzle(M); await dialogo(n.nombre, ['Listo. Todo en su lugar.']); }
    }});
  if(P.palancas) M.estadoRejas = [false, false, false];
  return M;
}
function reiniciarPuzzle(M){
  M.m = M.original.map(f => [...f]);
  if(M.estadoRejas) M.estadoRejas = [false, false, false];
}
async function hablarGuiaPuzzle(id, n){
  const P = PUZZLES[id], sec = SEC_PUZ();
  if(sec[id]){ await dialogo(n.nombre, ['¡Ya lo resolviste! Sos de los pocos.', '¿Querés entrar igual a dar una vuelta?']); }
  else await dialogo(n.nombre, P.guia);
  if(P.fuerza && !tieneHab('fuerza')){ await dialogo(n.nombre, ['Pero sin Fuerza no vas a mover ni una piedrita. Volvé con la medalla de Estela Gartija.']); return; }
  const i = await elegirOpcion(n.nombre, `¿Entrás a ${P.nombre}?`, ['Entrar', 'Ahora no']);
  if(i !== 0) return;
  const M = MAPAS['puz_' + id];
  reiniciarPuzzle(M);
  salirDelMundo(); S.mundo = {mapa: M.id, x: M.entrada.x, y: M.entrada.y, mira: 'arriba'}; guardar(); pintarMundo();
}
for(const [id, P] of Object.entries(PUZZLES)){
  const pueblo = MAPAS[P.pueblo]; if(!pueblo) continue;
  P.sitio = lugarLibre(pueblo, P.cerca[0], P.cerca[1]) || P.cerca;
  pueblo.npc({id: 'puz_guia_' + id, x: P.sitio[0], y: P.sitio[1], tipo: 'vecino', nombre: {lago: 'Guía del Lago', cantera: 'Capataz de la Cantera', palancas: 'Arqueóloga Piedra Antigua'}[id],
    ropa: '#4F86C6', pelo: '#3B2A22', accion: n => hablarGuiaPuzzle(id, n)});
  const M = armarPuzzle(id); MAPAS[M.id] = M;
}
// Cuando el cofre se abre, queda resuelto (y hay un regalo extra).
(() => {
  const orig = alLlegar;
  alLlegar = function(){
    const M = mapaActual(), antes = M && M.puzzle && S.recogidos['cofre_puz_' + M.puzzle];
    const r = orig.apply(this, arguments);
    if(M && M.puzzle && !antes && S.recogidos['cofre_puz_' + M.puzzle]){
      const P = PUZZLES[M.puzzle]; SEC_PUZ()[M.puzzle] = true;
      const txt = darPremio(P.extra); guardar();
      setTimeout(() => { if(MW && !MW.dlg) dialogo('¡Resuelto!', [`Debajo del cofre había algo más: ${txt}.`]); }, 1200);
    }
    // Hielo: si caíste sobre hielo, seguís patinando.
    if(!r && MW && !MW.hacia){
      const N = mapaActual(), {x, y} = MW.pos;
      if(N && N.m[y] && N.m[y][x] === 'I'){
        const [dx, dy] = {arriba: [0, -1], abajo: [0, 1], izq: [-1, 0], der: [1, 0]}[MW.mira] || [0, 0];
        const nx = x + dx, ny = y + dy;
        if((dx || dy) && transitable(N, nx, ny)){ MW.desde = {...MW.pos}; MW.hacia = {x: nx, y: ny}; MW.t = 0; MW.segDesde = {...MW.seg}; MW.seg = {...MW.pos}; }
      }
    }
    return r;
  };
})();
// Rocas y palancas: chocar contra ellas las empuja o las mueve.
(() => {
  const origObs = obstaculoEn, origUsar = usarHabilidad;
  obstaculoEn = function(M, x, y){
    if(M && M.puzzle && M.m[y]){
      const c = M.m[y][x];
      if(c === 'Q') return 'roca_puz';
      if(c === 'J') return 'palanca';
      if(c === 'Z') return 'reja';
      if(c === '0') return 'pozo';
    }
    return origObs.apply(this, arguments);
  };
  usarHabilidad = function(obs, M, x, y){
    if(obs === 'roca_puz'){
      if(!tieneHab('fuerza')){ dialogo('', ['Una roca pesada. Con Fuerza se podría empujar.']); return; }
      const dx = Math.sign(x - MW.pos.x), dy = Math.sign(y - MW.pos.y), bx = x + dx, by = y + dy;
      const destino = M.m[by] && M.m[by][bx];
      if(destino === '0'){ M.m[y][x] = 'k'; M.m[by][bx] = 'k'; avisar('¡La roca tapó el pozo!'); return; }
      if(destino === undefined || BLOQUEA.has(destino) || npcEn(M, bx, by)) { avisar('No se mueve: hay algo del otro lado.'); return; }
      M.m[by][bx] = 'Q'; M.m[y][x] = 'k';
      return;
    }
    if(obs === 'palanca'){
      const P = PUZZLES[M.puzzle], cambia = P.palancas[x + ',' + y] || [];
      for(const i of cambia) M.estadoRejas[i] = !M.estadoRejas[i];
      P.rejas.forEach(([rx, ry], i) => { M.m[ry][rx] = M.estadoRejas[i] ? 'k' : 'Z'; });
      M.palancaBaja = M.palancaBaja || {}; M.palancaBaja[x + ',' + y] = !M.palancaBaja[x + ',' + y];
      avisar(M.estadoRejas.every(Boolean) ? '¡Se abrieron todas las rejas!' : `Clac. Rejas abiertas: ${M.estadoRejas.filter(Boolean).length} de 3.`);
      return;
    }
    if(obs === 'reja'){ dialogo('', ['Una reja de hierro. Alguna palanca la abre.']); return; }
    if(obs === 'pozo'){ dialogo('', ['Un pozo hondo. Si una roca cayera adentro, se podría pasar.']); return; }
    return origUsar.apply(this, arguments);
  };
})();
// Dibujo: hielo, rocas, pozos, palancas y rejas.
(() => {
  const dib = dibujarSecretos;
  dibujarSecretos = function(ctx, M, camX, camY, t){
    if(dib) dib(ctx, M, camX, camY, t);
    if(!M || !M.puzzle) return;
    for(let y = 0; y < M.h; y++) for(let x = 0; x < M.w; x++){
      const c = M.m[y][x], sx = x * TS - camX, sy = y * TS - camY;
      if(sx < -TS || sy < -TS || sx > ctx.canvas.width || sy > ctx.canvas.height) continue;
      if(c === 'I'){
        ctx.fillStyle = (x + y) % 2 ? '#CFEFFF' : '#BFE6FA'; ctx.fillRect(sx, sy, TS, TS);
        ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx + 6, sy + 22); ctx.lineTo(sx + 14, sy + 10); ctx.stroke();
      } else if(c === 's'){ ctx.fillStyle = '#F4FAFD'; ctx.fillRect(sx, sy, TS, TS); }
      else if(c === '0'){ ctx.fillStyle = '#2A1E14'; ctx.beginPath(); ctx.ellipse(sx + 16, sy + 17, 13, 11, 0, 0, 7); ctx.fill(); }
      else if(c === 'Q'){
        ctx.fillStyle = '#9AA3AE'; ctx.strokeStyle = '#22304A'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(sx + 16, sy + 17, 13, 0, 7); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#C3C9D1'; ctx.beginPath(); ctx.arc(sx + 12, sy + 12, 4, 0, 7); ctx.fill();
      } else if(c === 'J'){
        const baja = M.palancaBaja && M.palancaBaja[x + ',' + y];
        ctx.fillStyle = '#5A4A40'; ctx.fillRect(sx + 8, sy + 20, 16, 8);
        ctx.strokeStyle = '#22304A'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(sx + 16, sy + 22); ctx.lineTo(sx + (baja ? 26 : 6), sy + 6); ctx.stroke();
        ctx.fillStyle = baja ? '#4CC27A' : '#E2574C'; ctx.beginPath(); ctx.arc(sx + (baja ? 26 : 6), sy + 6, 4, 0, 7); ctx.fill();
      } else if(c === 'Z'){
        ctx.strokeStyle = '#3A3A44'; ctx.lineWidth = 3;
        for(let k = 5; k < TS; k += 7){ ctx.beginPath(); ctx.moveTo(sx + k, sy); ctx.lineTo(sx + k, sy + TS); ctx.stroke(); }
        ctx.beginPath(); ctx.moveTo(sx, sy + 8); ctx.lineTo(sx + TS, sy + 8); ctx.stroke();
      }
    }
  };
})();
