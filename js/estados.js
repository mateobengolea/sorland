'use strict';
/* =====================================================================
   Estados alterados: quemado, dormido, paralizado, congelado y confundido.
   Duran lo que dura la pelea. Algunos ataques los causan con una chance,
   y hay poderes que solo sirven para causarlos.
   Todas las funciones reciben rnd para que los duelos sigan siendo iguales
   en los dos navegadores.
   ===================================================================== */
const ESTADOS = {
  quemado:    {nom: 'Quemado', corto: 'QUE', color: '#FF8A3D', al: 'se quemó', sigue: 'sufre por la quemadura'},
  dormido:    {nom: 'Dormido', corto: 'DOR', color: '#9AA6D6', al: 'se quedó dormido', sigue: 'está dormido'},
  paralizado: {nom: 'Paralizado', corto: 'PAR', color: '#F2C23A', al: 'quedó paralizado', sigue: 'está paralizado y no se puede mover'},
  congelado:  {nom: 'Congelado', corto: 'CON', color: '#8FD3F7', al: 'quedó congelado', sigue: 'está congelado'},
  confundido: {nom: 'Confundido', corto: 'CNF', color: '#C77DFF', al: 'quedó confundido', sigue: 'está confundido'},
};
// Chances de causar estado en los ataques que ya existían.
Object.assign(MOVS.brasa, {estado: 'quemado', prob: .1});
Object.assign(MOVS.llamarada, {estado: 'quemado', prob: .2});
Object.assign(MOVS.erupcion, {estado: 'quemado', prob: .3});
Object.assign(MOVS.parrilla, {estado: 'quemado', prob: .2});
Object.assign(MOVS.chispazo, {estado: 'paralizado', prob: .1});
Object.assign(MOVS.trueno, {estado: 'paralizado', prob: .2});
Object.assign(MOVS.fulminante, {estado: 'paralizado', prob: .3});
Object.assign(MOVS.descarga, {estado: 'paralizado', prob: .2});
Object.assign(MOVS.escarcha, {estado: 'congelado', prob: .08});
Object.assign(MOVS.granizo, {estado: 'congelado', prob: .12});
Object.assign(MOVS.ventisca, {estado: 'congelado', prob: .18});
Object.assign(MOVS.helada, {estado: 'congelado', prob: .15});
Object.assign(MOVS.remolino, {estado: 'confundido', prob: .15});
Object.assign(MOVS.huracan, {estado: 'confundido', prob: .25});
Object.assign(MOVS.enjambre, {estado: 'confundido', prob: .15});
if(MOVS.termas) Object.assign(MOVS.termas, {estado: 'quemado', prob: .25});
if(MOVS.apagon) Object.assign(MOVS.apagon, {estado: 'paralizado', prob: .25});
// Poderes que solo causan un estado.
Object.assign(MOVS, {
  somnifero:  {nom: 'Somnífero', tipo: 'planta', poder: 0, prec: 75, estado: 'dormido', prob: 1, pp: 10},
  ondatrueno: {nom: 'Onda trueno', tipo: 'rayo', poder: 0, prec: 90, estado: 'paralizado', prob: 1, pp: 15},
  fuegofatuo: {nom: 'Fuego fatuo', tipo: 'fuego', poder: 0, prec: 85, estado: 'quemado', prob: 1, pp: 12},
  mareo:      {nom: 'Mareo', tipo: 'viento', poder: 0, prec: 90, estado: 'confundido', prob: 1, pp: 12},
  cancion:    {nom: 'Canción de cuna', tipo: 'normal', poder: 0, prec: 60, estado: 'dormido', prob: 1, pp: 12},
  polen:      {nom: 'Polen picante', tipo: 'bicho', poder: 0, prec: 85, estado: 'confundido', prob: 1, pp: 12},
  aliento:    {nom: 'Aliento helado', tipo: 'hielo', poder: 0, prec: 70, estado: 'congelado', prob: 1, pp: 8},
  bruma:      {nom: 'Bruma', tipo: 'agua', poder: 0, prec: 85, estado: 'confundido', prob: 1, pp: 12},
});
const MOV_ESTADO_TIPO = {planta: 'somnifero', rayo: 'ondatrueno', fuego: 'fuegofatuo', viento: 'mareo', normal: 'cancion', bicho: 'polen', hielo: 'aliento', agua: 'bruma'};
for(const e of Object.values(ESPECIES)){
  const m = MOV_ESTADO_TIPO[e.tipo];
  if(!m || e.legendaria || !Array.isArray(e.aprende) || e.aprende.some(([, x]) => x === m)) continue;
  e.aprende = [...e.aprende, [24, m]].sort((a, b) => a[0] - b[0]);
}
// Objeto que cura cualquier estado.
OBJETOS.push({id: 'yuyos', nom: 'Té de yuyos', precio: 150, medallas: 2, usa: 'estado', icono: 'taza', enCombate: true, tipoObj: 'cura', colores: ['#7CC46A', '#FFF3B0'],
  desc: 'Cura quemaduras, sueño, parálisis, congelamiento y confusión. Sirve en combate.'});

function aplicarEstado(d, estado, rnd = Math.random){
  if(!d || d.hp <= 0 || d.estado || !ESTADOS[estado]) return false;
  // Nadie se quema siendo de Fuego, ni se congela siendo de Hielo, ni se paraliza siendo de Rayo.
  if((estado === 'quemado' && d.tipo === 'fuego') || (estado === 'congelado' && d.tipo === 'hielo') || (estado === 'paralizado' && d.tipo === 'rayo')) return false;
  d.estado = estado;
  d.turnosEstado = estado === 'dormido' ? 1 + Math.floor(rnd() * 3) : estado === 'confundido' ? 2 + Math.floor(rnd() * 3) : 0;
  return true;
}
// ¿Puede actuar este turno? Devuelve los mensajes y si se lastimó solo.
function chequeoEstado(l, rnd = Math.random){
  const r = {actua: true, msgs: [], danio: 0, curado: false};
  const e = l.estado; if(!e) return r;
  if(e === 'dormido'){
    if(l.turnosEstado > 0){ l.turnosEstado--; r.actua = false; r.msgs.push('está dormido'); }
    else { l.estado = null; r.curado = true; r.msgs.push('se despertó'); }
  } else if(e === 'congelado'){
    if(rnd() < .25){ l.estado = null; r.curado = true; r.msgs.push('se descongeló'); }
    else { r.actua = false; r.msgs.push('está congelado'); }
  } else if(e === 'paralizado'){
    if(rnd() < .25){ r.actua = false; r.msgs.push('está paralizado y no se puede mover'); }
  } else if(e === 'confundido'){
    if(l.turnosEstado <= 0){ l.estado = null; r.curado = true; r.msgs.push('ya no está confundido'); }
    else {
      l.turnosEstado--;
      r.msgs.push('está confundido');
      if(rnd() < .33){ r.actua = false; r.danio = Math.max(1, Math.round(l.max / 8)); r.msgs.push('¡se golpeó a sí mismo!'); }
    }
  }
  return r;
}
const danioQuemadura = l => l && l.hp > 0 && l.estado === 'quemado' ? Math.max(1, Math.round(l.max / 16)) : 0;
const chipEstado = l => l && l.estado && ESTADOS[l.estado] ? `<span class="chip-estado" style="background:${ESTADOS[l.estado].color}" title="${ESTADOS[l.estado].nom}">${ESTADOS[l.estado].corto}</span>` : '';

/* ---------------- Inteligencia de los rivales ----------------
   Calcula qué tan bueno es cada poder contra lo que tiene enfrente.
   listo: 0 = salvaje distraído, 1 = líder de la Liga.               */
function valorPoder(a, d, id){
  const m = MOVS[id]; if(!m) return 0;
  if(!m.poder){
    if(m.estado){
      if(d.estado) return 0;
      if((m.estado === 'quemado' && d.tipo === 'fuego') || (m.estado === 'congelado' && d.tipo === 'hielo') || (m.estado === 'paralizado' && d.tipo === 'rayo')) return 0;
      const base = {dormido: 70, congelado: 70, paralizado: 55, confundido: 45, quemado: d.stats.fuerza > a.stats.fuerza ? 60 : 40}[m.estado];
      return base * m.prec / 100 * (d.hp / d.max > .4 ? 1 : .4);
    }
    if(m.efecto === 'bajaFuerza') return (d.modFuerza || 1) >= 1 ? 25 : 0;
    return 0;
  }
  const v = m.poder * (m.tipo === a.tipo ? 1.25 : 1) * efectividad(m.tipo, d.tipo) * m.prec / 100;
  // Si con este golpe lo deja fuera de combate, mucho mejor.
  const est = calcularDanio(a, d, m, () => .5).danio;
  return v * (est >= d.hp ? 2.2 : 1);
}
function elegirPoderRival(a, d, movs, listo, rnd = Math.random){
  const validos = movs.filter(id => MOVS[id]);
  if(!validos.length) return 'forcejeo';
  if(rnd() < listo){
    let mejor = validos[0], vm = -1;
    for(const id of validos){ const v = valorPoder(a, d, id) * (.9 + rnd() * .2); if(v > vm){ vm = v; mejor = id; } }
    return mejor;
  }
  // Distraído: cualquiera, pero evita los que no sirven para nada.
  const utiles = validos.filter(id => valorPoder(a, d, id) > 0);
  const lista = utiles.length ? utiles : validos;
  return lista[Math.floor(rnd() * lista.length)];
}
// Fuera de combate no hay estados: el té se guarda para la próxima pelea.
document.addEventListener('DOMContentLoaded', () => {
  if(typeof usarObjeto !== 'function') return;
  const orig = usarObjeto;
  usarObjeto = function(o, ...resto){
    const ob = typeof o === 'string' ? POR_ID[o] : o;
    if(ob && ob.usa === 'estado'){ avisar('El Té de yuyos se usa en las peleas, cuando una criatura está quemada, dormida, paralizada, congelada o confundida.'); return; }
    return orig.call(this, o, ...resto);
  };
});
