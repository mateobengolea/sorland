'use strict';
/* =====================================================================
   Misiones diarias y logros.
   - Cada día hay 3 misiones nuevas (iguales para todos ese día). Al
     cumplirlas se cobran desde el menú. Si cumplís las 3, hay bono.
   - Los logros son para siempre: dan monedas una vez y se muestran en
     tu perfil.
   ===================================================================== */
const ST = () => { S.stats = S.stats || {}; return S.stats; };
const hoyMis = () => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
const TIPOS_MISION = ['agua', 'fuego', 'planta', 'rayo', 'piedra', 'viento', 'hielo', 'bicho', 'normal'];
const PLANTILLAS_MISION = [
  {ev: 'captura', meta: [3, 5], txt: n => `Atrapá ${n} criaturas`, premio: 500},
  {ev: 'captura', filtro: true, meta: [2, 2], txt: (n, t) => `Atrapá ${n} criaturas de tipo ${TIPOS[t].nom}`, premio: 700},
  {ev: 'debilitar', meta: [8, 15], txt: n => `Debilitá ${n} criaturas salvajes`, premio: 500},
  {ev: 'debilitar', filtro: true, meta: [4, 6], txt: (n, t) => `Debilitá ${n} criaturas de tipo ${TIPOS[t].nom}`, premio: 600},
  {ev: 'entrenador', meta: [2, 4], txt: n => `Ganale a ${n} entrenadores`, premio: 700},
  {ev: 'paso', meta: [300, 600], txt: n => `Caminá ${n} pasos`, premio: 400},
  {ev: 'duelo', meta: [1, 2], txt: n => `Ganá ${n} duelo${n > 1 ? 's' : ''} contra otros jugadores`, premio: 1200},
  {ev: 'evolucion', meta: [1, 1], txt: () => 'Hacé evolucionar a una criatura', premio: 800},
  {ev: 'torre', meta: [3, 5], txt: n => `Ganá ${n} pisos en la Torre de Batalla`, premio: 1500, req: () => S.campeon},
];
const PREMIOS_MISION = [{obj: 'jarabemax', n: 2}, {obj: 'supercapsula', n: 3}, {obj: 'yuyos', n: 2}, {obj: 'ultracapsula', n: 2}, {obj: 'energizante', n: 1}, {obj: 'revivir', n: 1}];
function semillaDia(s){ let h = 2166136261; for(const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; }; }
function misionesDeHoy(){
  const dia = hoyMis();
  if(S.misiones && S.misiones.dia === dia) return S.misiones;
  const r = semillaDia(dia), usadas = new Set(), lista = [];
  const pool = PLANTILLAS_MISION.filter(p => !p.req || p.req());
  while(lista.length < 3){
    const k = Math.floor(r() * pool.length); if(usadas.has(k)) continue; usadas.add(k);
    const p = pool[k], meta = p.meta[0] + Math.floor(r() * (p.meta[1] - p.meta[0] + 1));
    const filtro = p.filtro ? TIPOS_MISION[Math.floor(r() * TIPOS_MISION.length)] : null;
    lista.push({ev: p.ev, filtro, meta, prog: 0, txt: p.txt(meta, filtro), monedas: p.premio, premio: PREMIOS_MISION[Math.floor(r() * PREMIOS_MISION.length)], cobrada: false});
  }
  S.misiones = {dia, lista, bono: false};
  return S.misiones;
}
// Lo llaman los distintos ganchos del juego.
function registrar(ev, datos = {}){
  if(!S) return;
  const st = ST(); st[ev] = (st[ev] || 0) + (datos.n || 1);
  if(datos.shiny) st.shinyCapt = (st.shinyCapt || 0) + 1;
  const m = misionesDeHoy();
  for(const x of m.lista){
    if(x.ev !== ev || x.prog >= x.meta || (x.filtro && datos.tipo !== x.filtro)) continue;
    x.prog = Math.min(x.meta, x.prog + (datos.n || 1));
    if(x.prog >= x.meta) setTimeout(() => avisar(`¡Misión cumplida: ${x.txt}! Cobrala en el menú Misiones.`, 'nivel'), 600);
  }
  revisarLogros();
}

/* ---------------- Logros ---------------- */
const especiesAtrapadas = () => Object.keys((S.album && S.album.capt) || {}).length;
const LOGROS = [
  {id: 'primera', nom: 'Primera captura', txt: 'Atrapá tu primera criatura.', ok: () => (ST().captura || 0) >= 1, monedas: 200},
  {id: 'album50', nom: 'Coleccionista', txt: 'Tené 50 especies distintas en el álbum.', ok: () => especiesAtrapadas() >= 50, monedas: 2000},
  {id: 'album100', nom: 'Gran coleccionista', txt: 'Tené 100 especies distintas en el álbum.', ok: () => especiesAtrapadas() >= 100, monedas: 5000},
  {id: 'album150', nom: 'Enciclopedia viviente', txt: 'Tené 150 especies distintas en el álbum.', ok: () => especiesAtrapadas() >= 150, monedas: 10000},
  {id: 'shiny', nom: 'Brillito', txt: 'Atrapá una criatura shiny.', ok: () => Object.keys((S.album && S.album.shiny) || {}).length >= 1, monedas: 1500},
  {id: 'med8', nom: 'Ocho medallas', txt: 'Ganá las 8 medallas de Sorlandia.', ok: () => cantMedallas() >= 8, monedas: 2000},
  {id: 'campeon', nom: 'Campeón de Sorlandia', txt: 'Ganá la Liga del Cuartel Supremo.', ok: () => !!S.campeon, monedas: 3000},
  {id: 'med16', nom: 'Dieciséis medallas', txt: 'Ganá las 8 medallas de la Costa Oriental.', ok: () => typeof cantMedallas2 === 'function' && cantMedallas2() >= 8, monedas: 4000},
  {id: 'campeon2', nom: 'Campeón Oriental', txt: 'Ganá la Liga de la Fortaleza del Cerro.', ok: () => !!S.campeon2, monedas: 6000},
  {id: 'gaucho', nom: 'Leyenda viva', txt: 'Ganale al Gaucho Eterno.', ok: () => !!(S.regalos && S.regalos.soldemayo), monedas: 10000},
  {id: 'rival', nom: 'Rival superado', txt: 'Ganale a Mati Carpo 8 veces.', ok: () => S.rival && ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8'].every(k => S.rival[k] === true), monedas: 4000},
  {id: 'cuatreros', nom: 'Justiciero', txt: 'Desbaratá los tres escondites de los Cuatreros.', ok: () => S.cuatreros && ['galpon', 'estancia', 'deposito'].every(k => S.cuatreros[k]), monedas: 5000},
  {id: 'puzzles', nom: 'Mente brillante', txt: 'Resolvé los tres rompecabezas.', ok: () => S.puzzles && ['lago', 'cantera', 'palancas'].every(k => S.puzzles[k]), monedas: 3000},
  {id: 'torre10', nom: 'Torre de 10', txt: 'Ganá 10 pisos seguidos en la Torre de Batalla.', ok: () => ((S.torre && S.torre.mejor) || 0) >= 10, monedas: 3000},
  {id: 'torre25', nom: 'Torre de 25', txt: 'Ganá 25 pisos seguidos en la Torre de Batalla.', ok: () => ((S.torre && S.torre.mejor) || 0) >= 25, monedas: 8000},
  {id: 'duelista', nom: 'Duelista', txt: 'Ganá 10 duelos contra otros jugadores.', ok: () => ((S.duelos && S.duelos.ganados) || 0) >= 10, monedas: 3000},
  {id: 'cazador', nom: 'Cazador', txt: 'Debilitá 500 criaturas salvajes.', ok: () => (ST().debilitar || 0) >= 500, monedas: 3000},
  {id: 'caminante', nom: 'Caminante', txt: 'Caminá 10.000 pasos.', ok: () => (ST().paso || 0) >= 10000, monedas: 2000},
  {id: 'misionero', nom: 'Trabajador', txt: 'Cumplí las tres misiones del día 7 veces.', ok: () => (ST().diasCompletos || 0) >= 7, monedas: 4000},
  {id: 'jefe', nom: 'Contra el gigante', txt: 'Participá en la caída de un jefe cooperativo.', ok: () => (ST().jefes || 0) >= 1, monedas: 3000},
];
function revisarLogros(){
  S.logros = S.logros || {};
  for(const L of LOGROS){
    if(S.logros[L.id]) continue;
    let ok = false; try { ok = L.ok(); } catch(e){}
    if(!ok) continue;
    S.logros[L.id] = Date.now();
    ganar(L.monedas);
    setTimeout(() => avisar(`🏆 Logro: ${L.nom} (+${L.monedas} monedas)`, 'nivel'), 900);
  }
}
const cantLogros = () => Object.keys(S.logros || {}).length;

/* ---------------- Hoja de Misiones y Logros ---------------- */
let pestanaMis = 'misiones';
function abrirMisiones(){
  hojaActual = 'misiones';
  nuevoVelo();
  pintarMisiones();
}
function pintarMisiones(){
  const v = $('#velo'); if(!v || hojaActual !== 'misiones') return;
  const m = misionesDeHoy(); revisarLogros();
  const todas = m.lista.every(x => x.cobrada);
  const cuerpo = pestanaMis === 'misiones'
    ? m.lista.map((x, i) => {
        const p = Math.round(x.prog / x.meta * 100), lista = x.prog >= x.meta;
        return `<div class="item mision ${x.cobrada ? 'cobrada' : lista ? 'lista' : ''}"><h3></h3>
          <div class="barra"><i style="width:${p}%;background:${lista ? 'var(--verde)' : 'var(--ambar)'}"></i></div>
          <p>${x.prog} / ${x.meta} · Premio: ${x.monedas} monedas + ${x.premio.n} ${POR_ID[x.premio.obj] ? POR_ID[x.premio.obj].nom : x.premio.obj}</p>
          ${x.cobrada ? '<span class="etiqueta">Cobrada ✓</span>' : `<button class="btn" data-cobrar="${i}" ${lista ? '' : 'disabled'}>${lista ? 'Cobrar' : 'En progreso'}</button>`}</div>`;
      }).join('') + `<p class="vacio" style="grid-column:1/-1;padding:6px">${todas ? (m.bono ? '¡Cumpliste todo hoy! Mañana hay misiones nuevas.' : '') : 'Si cumplís las tres, te llevás un bono de 2 Ultra cápsulas.'} Las misiones cambian todos los días a medianoche.</p>`
    : `<p class="vacio" style="grid-column:1/-1;padding:6px">Logros: ${cantLogros()} de ${LOGROS.length}. Se muestran en tu perfil.</p>` + LOGROS.map(L => {
        const ok = S.logros && S.logros[L.id];
        return `<div class="item logro ${ok ? 'ok' : ''}"><h3>${ok ? '🏆' : '🔒'} ${L.nom}</h3><p>${L.txt}</p><small>${ok ? 'Conseguido' : L.monedas + ' monedas'}</small></div>`;
      }).join('');
  v.innerHTML = `<div class="hoja" role="dialog" aria-label="Misiones"><div class="hoja-cab"><h2>Misiones</h2><button class="cerrar" aria-label="Cerrar">×</button></div>
    <div class="pestanas" role="tablist"><button role="tab" data-tab="misiones" aria-selected="${pestanaMis === 'misiones'}">Del día</button><button role="tab" data-tab="logros" aria-selected="${pestanaMis === 'logros'}">Logros</button></div>
    <div class="grilla">${cuerpo}</div></div>`;
  if(pestanaMis === 'misiones') v.querySelectorAll('.mision h3').forEach((h, i) => h.textContent = m.lista[i].txt);
  v.querySelector('.cerrar').onclick = cerrarHoja;
  v.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { pestanaMis = b.dataset.tab; pintarMisiones(); });
  v.querySelectorAll('[data-cobrar]').forEach(b => b.onclick = () => {
    const x = m.lista[+b.dataset.cobrar]; if(!x || x.cobrada || x.prog < x.meta) return;
    x.cobrada = true; ganar(x.monedas); const txt = darPremio(x.premio);
    avisar(`Cobraste ${x.monedas} monedas y ${txt}`);
    if(m.lista.every(y => y.cobrada) && !m.bono){ m.bono = true; ST().diasCompletos = (ST().diasCompletos || 0) + 1; darPremio({obj: 'ultracapsula', n: 2}); setTimeout(() => avisar('¡Bono por cumplir las tres: 2 Ultra cápsulas!', 'nivel'), 900); revisarLogros(); }
    guardar(); pintarMisiones();
  });
}

/* ---------------- Ganchos ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  // Criaturas debilitadas y entrenadores vencidos.
  const origGanar = ganarCombate;
  ganarCombate = async function(){
    const el = B && B.salvaje, ent = B && B.ent, antes = ent && S.vencidos[ent.id];
    if(el && !ent) registrar('debilitar', {tipo: el.tipo});
    const r = await origGanar.apply(this, arguments);
    if(ent && !antes && S.vencidos[ent.id] && !ent.torre) registrar('entrenador');
    return r;
  };
  // Capturas.
  const origCap = tirarCapsula;
  tirarCapsula = async function(o){
    const el = B && B.salvaje, antes = el && (S.album.capt[el.esp] || 0);
    const r = await origCap.apply(this, arguments);
    if(el && (S.album.capt[el.esp] || 0) > antes) registrar('captura', {tipo: el.tipo, shiny: el.shiny});
    return r;
  };
  // Evoluciones.
  const origEvo = animarEvolucion;
  animarEvolucion = async function(){ const r = await origEvo.apply(this, arguments); registrar('evolucion'); return r; };
  // Duelos ganados.
  if(typeof terminarDuelo === 'function'){
    const origDu = terminarDuelo;
    terminarDuelo = async function(ganador){ const gane = DU && ganador === DU.lado; const r = await origDu.apply(this, arguments); if(gane) registrar('duelo'); return r; };
  }
  // La ficha del ranking lleva la cantidad de logros (se ve en el perfil).
  if(typeof actualizarFicha === 'function'){
    const origF = actualizarFicha;
    actualizarFicha = async function(){
      const ent = S && S.entrenador;
      if(S && ent) S.entrenador = {...ent, logros: cantLogros()};
      try { return await origF.apply(this, arguments); } finally { if(S && ent) S.entrenador = ent; }
    };
  }
});
(() => {
  const orig = alLlegar;
  alLlegar = function(){ if(S) registrar('paso'); return orig.apply(this, arguments); };
})();
