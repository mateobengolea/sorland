'use strict';
/* =====================================================================
   El Cuartel Supremo por dentro, como la Liga: un hall con enfermera y
   market, y después cinco salas seguidas. En cada sala espera un miembro;
   cuando le ganás se abre la puerta del fondo. La última es la de la
   Campeona y detrás está el Salón de la Fama.
   Curarse (centro, casa, volar) sigue reiniciando el recorrido.
   ===================================================================== */
const SALAS_LIGA = [
  {tipo: 'viento', piso: ['#DDEEFB', '#CFE4F7'], nombre: 'Sala del Viento'},
  {tipo: 'hielo', piso: ['#E8F5FB', '#D7ECF6'], nombre: 'Sala del Hielo'},
  {tipo: 'planta', piso: ['#E3F1DA', '#D3E7C6'], nombre: 'Sala Verde'},
  {tipo: 'rayo', piso: ['#E6E8F4', '#D6DAEC'], nombre: 'Sala del Trueno'},
  {tipo: 'fuego', piso: ['#F7EBC8', '#F0E0B4'], nombre: 'Sala del Trono'},
];
const LIGA_W = 13, LIGA_H = 12;

function puertaLiga(M, siguiente, abierta){
  M.salida(6, 1, siguiente, 6, LIGA_H - 2);
  M.m[1][6] = 'x';
  M.puertaLiga = {x: 6, y: 1, abierta};
}

function crearLiga(){
  const sup = MAPAS.supremo; if(!sup) return;
  const kPuerta = Object.keys(sup.puertas).find(k => sup.puertas[k] && sup.puertas[k].cuartel);
  if(!kPuerta) return;
  const [px, py] = kPuerta.split(',').map(Number);
  const afuera = {mapa: 'supremo', x: px, y: py + 1};

  // Hall de entrada
  const H = interiorBase('liga0', 'Cuartel Supremo · Hall', LIGA_W, LIGA_H, ['#F4ECDA', '#EADFC8'], afuera, 9900);
  H.mueble('mostrador', 2, 3, {col: '#FF8FB1'}); H.mueble('mostrador', 3, 3, {col: '#FF8FB1'});
  H.mueble('mostrador', 9, 3, {col: '#4CC27A'}); H.mueble('mostrador', 10, 3, {col: '#4CC27A'});
  H.mueble('planta', 1, 9); H.mueble('planta', 11, 9);
  H.mueble('estandarte', 4, 2, {col: '#C9A227'}); H.mueble('estandarte', 8, 2, {col: '#C9A227'});
  H.muebles.push({tipo: 'alfombra', x: 6, y: 6});
  H.npc({id: 'liga_enf', x: 2, y: 2, tipo: 'enfermera', nombre: 'Enfermera Carosor', suelo: 'p', ropa: '#FF8FB1', pelo: '#B5452B', peinado: 'colita', gorra: '#FFFFFF'});
  H.npc({id: 'liga_vend', x: 10, y: 2, tipo: 'vendedor', nombre: 'Vendedor Elmer Cado', suelo: 'p', ropa: '#4CC27A', pelo: '#3B2A22', peinado: 'corto', gorra: '#4CC27A'});
  H.npc({id: 'liga_portero', x: 5, y: 2, tipo: 'vecino', nombre: 'Portero Aquiles Pero', suelo: 'p', ropa: '#C9A227', pelo: '#2A2420', accion: hablarPortero});
  puertaLiga(H, 'liga1', () => true);
  MAPAS.liga0 = H;
  sup.puertas[kPuerta] = {interior: 'liga0'};

  // Las cinco salas
  CUARTEL.forEach((rival, i) => {
    const k = i + 1, sala = SALAS_LIGA[i] || SALAS_LIGA[0], col = TIPOS[sala.tipo] ? TIPOS[sala.tipo].color : '#C9A227';
    const atras = k === 1 ? {mapa: 'liga0', x: 6, y: 2} : {mapa: 'liga' + (k - 1), x: 6, y: 2};
    const M = interiorBase('liga' + k, `${sala.nombre} · ${rival.nombre}`, LIGA_W, LIGA_H, sala.piso, atras, 9900 + k * 37);
    M.zonaPelea = 'supremo';
    for(let y = 4; y <= 9; y++) for(const x of [3, 9]) M.mueble('columna', x, y, {col});
    for(let y = 4; y <= 9; y += 2) for(const x of [1, 11]) M.mueble('antorcha', x, y, {col});
    M.mueble('estandarte', 4, 2, {col}); M.mueble('estandarte', 8, 2, {col});
    M.muebles.push({tipo: 'podio', x: 6, y: 3, col});
    M.npc({id: 'liga_' + rival.id, x: 6, y: 3, tipo: 'vecino', nombre: rival.nombre, suelo: 'p', ropa: rival.ropa, pelo: rival.pelo, sala: k, accion: hablarMiembro});
    const campeona = !!rival.campeona;
    puertaLiga(M, campeona ? 'liga6' : 'liga' + (k + 1), campeona ? () => !!(S.cuartel && S.cuartel.fama) : () => !!(S.cuartel && S.cuartel.racha >= k));
    MAPAS[M.id] = M;
  });

  // Salón de la Fama: la salida te deja afuera, en la cumbre.
  const F = interiorBase('liga6', 'Salón de la Fama', LIGA_W, LIGA_H, ['#FFF4D6', '#F7E7BE'], afuera, 9999);
  for(let y = 3; y <= 9; y += 2) for(const x of [2, 10]) M_estatua(F, x, y);
  F.mueble('estandarte', 4, 2, {col: '#C9A227'}); F.mueble('estandarte', 8, 2, {col: '#C9A227'});
  F.muebles.push({tipo: 'podio', x: 6, y: 3, col: '#C9A227'});
  F.npc({id: 'liga_cronista', x: 6, y: 2, tipo: 'vecino', nombre: 'Cronista del Salón', suelo: 'p', ropa: '#7A4FC9', pelo: '#E9E2D3', accion: hablarSalon});
  MAPAS.liga6 = F;
}
function M_estatua(M, x, y){ M.mueble('columna', x, y, {col: '#C9A227'}); }

async function hablarPortero(n){
  const r = (S.cuartel && S.cuartel.racha) || 0;
  await dialogo(n.nombre, S.campeon
    ? ['¡Campeón! ¿Venís por la revancha?', 'Son cinco salas seguidas. En cada una te espera un miembro del Cuartel; al final, la Campeona.', 'Si te curás en el medio, empezás de nuevo. Los jarabes sí se pueden usar.']
    : ['Bienvenido al Cuartel Supremo.', 'Atrás de esa puerta hay cinco salas. En cada una te espera un miembro del Cuartel, y en la última, la Campeona.', 'Cuando le ganás a uno, se abre la puerta a la sala siguiente.', 'Si te curás en el medio, empezás de nuevo. Los jarabes sí se pueden usar. Acá tenés enfermera y market para prepararte.']);
  if(r > 0) await dialogo(n.nombre, [`Vas por la sala ${r + 1} de 5. ¡Seguí!`]);
}

async function hablarMiembro(n){
  const k = n.sala, rival = CUARTEL[k - 1]; if(!rival) return;
  if(!S.cuartel) S.cuartel = {racha: 0};
  const quien = `${rival.titulo} ${rival.nombre}`, r = S.cuartel.racha || 0;
  if(rival.campeona && S.cuartel.fama){ await dialogo(quien, [...rival.despues, 'Pasá al Salón de la Fama.']); return; }
  if(r >= k){ await dialogo(quien, [rival.despues[0], 'La puerta del fondo está abierta. Seguí.']); return; }
  if(r < k - 1){ await dialogo(quien, ['Primero tenés que pasar por las salas anteriores.', 'Volvé al hall y empezá desde la primera.']); return; }
  if(!hayLuchadorEnPie()){ await dialogo(quien, ['Tu equipo está agotado. Así no se puede pelear.']); return; }
  await dialogo(quien, rival.antes);
  S.cuartel.fama = false;
  lanzarPeleaEntrenador({...rival, lider: true, premio: S.campeon ? Math.round(rival.premio / 4) : rival.premio}, 'supremo');
}

async function hablarSalon(n){
  const fama = S.salonFama || [];
  if(!fama.length){ await dialogo(n.nombre, ['Acá quedan los equipos de los Campeones de Sorlandia.', 'Todavía no está el tuyo.']); return; }
  const ult = fama[fama.length - 1];
  await dialogo(n.nombre, [
    `Ganaste la Liga ${fama.length === 1 ? 'una vez' : fama.length + ' veces'}.`,
    `Tu último equipo campeón: ${ult.equipo.map(c => `${c.nombre} (Nv ${c.nivel})`).join(', ')}.`,
    'Su nombre queda acá para siempre. La salida te lleva de vuelta a la cumbre.']);
}

// Después de ganarle a un miembro: en vez de lanzar la próxima pelea, se abre la puerta.
siguienteCuartel = async function(){
  if(!S.cuartel) return;
  const enLiga = /^liga[1-5]$/.test(S.mundo.mapa);
  if(!enLiga) return;
  if(S.cuartel.fama) await dialogo('Cuartel Supremo', ['Se abrió la puerta del Salón de la Fama.']);
  else await dialogo('Cuartel Supremo', [`Se abrió la puerta del fondo. Sala ${S.cuartel.racha + 1} de 5.`]);
};

// Las puertas del fondo están cerradas hasta que le ganás al de la sala.
(() => {
  const orig = transitable;
  transitable = function(M, x, y){
    const p = M && M.puertaLiga;
    if(p && p.x === x && p.y === y && !p.abierta()) return false;
    return orig(M, x, y);
  };
  const origLlegar = alLlegar;
  alLlegar = function(){
    const r = origLlegar.apply(this, arguments);
    if(S.mundo && S.mundo.mapa === 'liga6' && S.cuartel && S.cuartel.fama){ S.cuartel.fama = false; guardar(); }
    return r;
  };
})();

crearLiga();
// Partidas que habían quedado a mitad de camino con el sistema viejo.
if(typeof S !== 'undefined' && S && S.cuartel) S.cuartel.continuar = false;
