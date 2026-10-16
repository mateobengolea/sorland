'use strict';
/* =====================================================================
   Equipo, combate por turnos, captura y álbum.
   ===================================================================== */

const MAX_EQUIPO = 6;

/* ---------------- Equipo ---------------- */
function comoLuchador(c){
  const max = vidaMax(c.stats, c.nivel);
  return {ref: c, esp: c.esp, nombre: c.nombre, nivel: c.nivel, stats: c.stats, tipo: tipoDe(c.esp), shiny: !!c.shiny, hp: c.hp == null ? max : Math.min(c.hp, max), max};
}
const capturadaComoLuchador = comoLuchador;
function equipoLuchadores(){ return S.equipo.map(comoLuchador); }
function hayLuchadorEnPie(){ return equipoLuchadores().some(l => l.hp > 0); }
function guardarHp(l){ l.ref.hp = l.hp >= l.max ? null : l.hp; }
function curarEquipo(){ S.equipo.forEach(c => c.hp = null); S.reserva.forEach(c => c.hp = null); }
const brillo = l => l.shiny ? ' ✦' : '';

/* ---------------- Combate ---------------- */
let B = null;
const espera = ms => new Promise(r => setTimeout(r, ms));

const ARENAS = {pradera:'pradera', bosque:'bosque', rio:'rio', costa:'rio', sierras:'sierras', serrania:'sierras', cumbres:'cumbres', volcan:'volcan'};
function empezarCombate(rivales, zona, ent){
  vista = 'combate';
  cerrarHoja();
  rivales.forEach(r => { r.max = r.hp; });
  const salvaje = rivales[0];
  const lista = equipoLuchadores();
  const i = lista.findIndex(l => l.hp > 0);
  B = {salvaje, rivales, ri: 0, ent: ent || null, zona, lista, i, ocupado: true, forzado: false, fin: false, legendaria: ESPECIES[salvaje.esp].legendaria ? salvaje.esp : null};
  S.album.vistos[salvaje.esp] = true;
  pintarCombate();
  (async () => {
    if(ent){
      await mensaje(`¡${ent.titulo} ${ent.nombre} te desafía!`, 1100);
      await mensaje(`${ent.nombre} sacó a ${salvaje.nombre}.`);
    } else {
      if(B.legendaria) await mensaje(`¡${salvaje.nombre} apareció delante tuyo!`, 1600);
      else await mensaje(`¡Apareció un ${salvaje.nombre} salvaje!`);
      if(salvaje.shiny){ animar('b-rival', 'destello', 1200); await mensaje(`¡Brilla! ¡Es un ${salvaje.nombre} shiny, de otro color!`, 1700); }
      else if(ESPECIES[salvaje.esp].captura <= .18 && !B.legendaria) await mensaje('¡Es rarísimo verlo por acá!');
    }
    await mensaje(`¡Dale, ${activo().nombre}!`);
    B.ocupado = false; menu('principal');
  })();
}
const activo = () => B.lista[B.i];

function pintarCombate(){
  const z = B.zona;
  $('#app').innerHTML = `
    <section class="combate">
      ${B.ent ? `<div class="banda-ent">${B.ent.lider ? 'Gimnasio · ' : ''}${B.ent.titulo} <b></b> · <span id="cuenta-rivales"></span></div>` : ''}
      <div class="arena arena-${ARENAS[z] || 'ciudad'}">
        <div class="nube n1"></div><div class="nube n2"></div>
        <div class="plataforma rival"></div><div class="plataforma propio"></div>
        <div class="ficha-luch rival" id="f-rival"></div>
        <div class="bicho-combate rival" id="b-rival"></div>
        <div class="bicho-combate propio" id="b-propio"></div>
        <div class="ficha-luch propio" id="f-propio"></div>
      </div>
      <div class="panel texto-combate" id="t-combate" aria-live="polite"></div>
      <div class="menu-combate" id="menu-combate"></div>
    </section>`;
  if(B.ent) $('.banda-ent b').textContent = B.ent.nombre;
  $('#b-rival').innerHTML = svgEspecie(B.salvaje.esp, {humor: 'bien', shiny: B.salvaje.shiny});
  pintarPropio();
  fichas();
  animar('b-rival', 'entra-rival', 700); animar('b-propio', 'entra-propio', 700);
}
const nomRival = () => B.ent ? `${B.salvaje.nombre} de ${B.ent.nombre}` : `${B.salvaje.nombre} salvaje`;
function pintarPropio(){
  const l = activo();
  $('#b-propio').innerHTML = svgEspecie(l.esp, {humor: 'bien', shiny: l.shiny});
}
function fichaHTML(l, propio){
  const pct = Math.max(0, l.hp / l.max * 100);
  const col = pct > 50 ? 'var(--verde)' : pct > 20 ? 'var(--ambar)' : 'var(--rojo)';
  return `<div class="fl-cab"><b></b><span>Nv ${l.nivel}</span></div>
    <span class="chip-tipo" style="background:${TIPOS[l.tipo].color}">${TIPOS[l.tipo].nom}</span>
    <div class="barra fl-barra"><i style="width:${pct}%;background:${col}"></i></div>
    ${propio ? `<div class="fl-num">${l.hp} / ${l.max}</div>` : ''}`;
}
function fichas(){
  if(!$('#f-rival')) return;
  $('#f-rival').innerHTML = fichaHTML(B.salvaje, false); $('#f-rival b').textContent = B.salvaje.nombre + brillo(B.salvaje);
  $('#f-propio').innerHTML = fichaHTML(activo(), true); $('#f-propio b').textContent = activo().nombre + brillo(activo());
  const cr = $('#cuenta-rivales');
  if(cr) cr.innerHTML = B.rivales.map(r => `<i class="pip ${r.hp > 0 ? '' : 'caido'}"></i>`).join('');
}
async function mensaje(t, ms = 950){
  const el = $('#t-combate'); if(!el) return;
  el.textContent = t;
  await espera(ms);
}
function animar(id, clase, ms = 500){
  const el = $('#' + id); if(!el) return;
  el.classList.remove(clase); void el.offsetWidth; el.classList.add(clase);
  setTimeout(() => el.classList.remove(clase), ms);
}

function menu(tipo){
  const m = $('#menu-combate'); if(!m || !B) return;
  const l = activo();
  if(tipo === 'principal'){
    $('#t-combate').textContent = `¿Qué hace ${l.nombre}?`;
    m.className = 'menu-combate grilla-2';
    m.innerHTML = `<button data-a="pelear" class="mc-pelear">Pelear</button><button data-a="mochila">Mochila</button>
                   <button data-a="equipo">Equipo</button><button data-a="huir">Huir</button>`;
    m.querySelector('[data-a=pelear]').onclick = () => menu('pelear');
    m.querySelector('[data-a=mochila]').onclick = () => menu('mochila');
    m.querySelector('[data-a=equipo]').onclick = () => menu('equipo');
    m.querySelector('[data-a=huir]').onclick = () => turno({tipo: 'huir'});
  } else if(tipo === 'pelear'){
    m.className = 'menu-combate grilla-2';
    m.innerHTML = poderesDe(l.esp, l.nivel).map(id => {
      const mv = MOVS[id], ef = mv.poder ? efectividad(mv.tipo, B.salvaje.tipo) : 1;
      return `<button data-m="${id}" class="mc-mov" style="--tipo:${TIPOS[mv.tipo].color}">
        <b>${mv.nom}</b><small>${TIPOS[mv.tipo].nom} · ${mv.poder ? 'Poder ' + mv.poder : 'Especial'}${ef > 1 ? ' · ¡Efectivo!' : ef < 1 ? ' · Poco efectivo' : ''}</small></button>`;
    }).join('') + `<button class="mc-volver" data-v>Volver</button>`;
    m.querySelectorAll('[data-m]').forEach(b => b.onclick = () => turno({tipo: 'atacar', mov: b.dataset.m}));
    m.querySelector('[data-v]').onclick = () => menu('principal');
  } else if(tipo === 'mochila'){
    const objs = OBJETOS.filter(o => S.inv.objetos[o.id] > 0);
    m.className = 'menu-combate grilla-2';
    m.innerHTML = (objs.length ? objs.map(o => `<button data-o="${o.id}" class="mc-obj">${iconoObjeto(o, 30)}<span><b>${o.nom}</b><small>Tenés ${S.inv.objetos[o.id]}</small></span></button>`).join('')
      : `<p class="mc-vacio">No tenés cápsulas ni jarabes. Comprá en la tienda.</p>`) + `<button class="mc-volver" data-v>Volver</button>`;
    m.querySelectorAll('[data-o]').forEach(b => b.onclick = () => turno({tipo: 'objeto', obj: b.dataset.o}));
    m.querySelector('[data-v]').onclick = () => menu('principal');
  } else if(tipo === 'equipo'){
    m.className = 'menu-combate lista';
    m.innerHTML = B.lista.map((x, i) => {
      const pct = x.hp / x.max * 100;
      return `<button data-i="${i}" class="mc-eq" ${x.hp <= 0 || i === B.i ? 'disabled' : ''}>
        <span class="mc-mini">${svgEspecie(x.esp, {humor: x.hp > 0 ? 'bien' : 'mal'})}</span>
        <span class="mc-eq-txt"><b></b><small>Nv ${x.nivel} · ${x.hp <= 0 ? 'Debilitado' : x.hp + '/' + x.max}${i === B.i ? ' · Peleando' : ''}</small>
        <span class="barra"><i style="width:${pct}%;background:${pct > 50 ? 'var(--verde)' : pct > 20 ? 'var(--ambar)' : 'var(--rojo)'}"></i></span></span></button>`;
    }).join('') + (B.forzado ? '' : `<button class="mc-volver" data-v>Volver</button>`);
    m.querySelectorAll('[data-i]').forEach((b, k) => { b.querySelector('b').textContent = B.lista[k].nombre; b.onclick = () => turno({tipo: 'cambio', i: +b.dataset.i}); });
    const v = m.querySelector('[data-v]'); if(v) v.onclick = () => menu('principal');
    if(B.forzado) $('#t-combate').textContent = '¿Quién sale a pelear?';
  } else {
    m.className = 'menu-combate'; m.innerHTML = '';
  }
}

async function turno(acc){
  if(!B || B.ocupado || B.fin) return;
  B.ocupado = true; menu('nada');
  const yo = activo(), el = B.salvaje;
  try {
    if(acc.tipo === 'cambio'){
      const vuelve = yo.nombre;
      B.i = acc.i; pintarPropio(); fichas(); animar('b-propio', 'entra-propio', 700);
      if(B.forzado){ B.forzado = false; await mensaje(`¡Dale, ${activo().nombre}!`); return; }
      await mensaje(`¡Volvé, ${vuelve}! ¡Dale, ${activo().nombre}!`);
      if(await turnoRival()) return;
    } else if(acc.tipo === 'huir' && B.ent){
      await mensaje('¡No podés escaparte de una pelea entre entrenadores!', 1100); return;
    } else if(acc.tipo === 'huir'){
      const prob = Math.max(.25, Math.min(.95, .55 + (yo.stats.velocidad - el.stats.velocidad) * .05));
      if(Math.random() < prob){ await mensaje('¡Escaparon sin problemas!'); return terminarCombate(); }
      await mensaje('¡No pudieron escapar!');
      if(await turnoRival()) return;
    } else if(acc.tipo === 'objeto'){
      const o = OBJETOS.find(x => x.id === acc.obj);
      if(o.captura && B.ent){ await mensaje('¡No se le tira una cápsula a la criatura de otro entrenador!', 1200); return; }
      if(o.captura){ if(await tirarCapsula(o)) return; }
      else {
        if(yo.hp >= yo.max){ await mensaje(`${yo.nombre} ya tiene la vida llena.`, 800); return; }
        S.inv.objetos[o.id]--;
        const antes = yo.hp; yo.hp = Math.min(yo.max, yo.hp + o.cura); fichas();
        await mensaje(`${yo.nombre} tomó ${o.nom} y recuperó ${yo.hp - antes} de vida.`);
      }
      if(await turnoRival()) return;
    } else {
      const mov = MOVS[acc.mov];
      const velYo = yo.stats.velocidad * (yo.penal || 1), velEl = el.stats.velocidad;
      const primeroYo = velYo > velEl || (velYo === velEl && Math.random() < .5);
      if(primeroYo){
        await atacar(yo, el, mov, true); if(el.hp <= 0) return ganarCombate();
        if(await turnoRival()) return;
      } else {
        if(await turnoRival()) return;
        await atacar(yo, el, mov, true); if(el.hp <= 0) return ganarCombate();
      }
    }
  } finally {
    if(B && !B.fin){ B.ocupado = false; menu(B.forzado ? 'equipo' : 'principal'); }
  }
}

// Devuelve true si el combate se interrumpió (tu criatura cayó).
async function turnoRival(){
  const el = B.salvaje, yo = activo();
  const movs = poderesDe(el.esp, el.nivel);
  let id = movs[Math.floor(Math.random() * movs.length)];
  if(MOVS[id].efecto && Math.random() < .5) id = movs.find(m => !MOVS[m].efecto) || id;
  if(B.ent && Math.random() < (B.ent.lider ? .75 : .55)){
    const valor = m => MOVS[m].poder * (MOVS[m].tipo === el.tipo ? 1.25 : 1) * efectividad(MOVS[m].tipo, yo.tipo) * MOVS[m].prec / 100;
    id = movs.reduce((a, b) => valor(b) > valor(a) ? b : a);
  }
  await atacar(el, yo, MOVS[id], false);
  if(yo.hp <= 0){ await propioCaido(); return true; }
  return false;
}

async function atacar(a, d, mov, esPropio){
  const quien = esPropio ? a.nombre : nomRival();
  const idA = esPropio ? 'b-propio' : 'b-rival', idD = esPropio ? 'b-rival' : 'b-propio';
  await mensaje(`${quien} usó ${mov.nom}.`, 420);
  const acierta = Math.random() * 100 < mov.prec;
  await animarAtaque(mov, idA, idD, acierta);
  if(!acierta){ await mensaje('¡Pero falló!'); return; }
  if(mov.efecto === 'bajaFuerza'){
    d.modFuerza = Math.max(.5, (d.modFuerza || 1) * .75);
    await mensaje(`Le bajó la fuerza a ${esPropio ? nomRival() : d.nombre}.`);
    return;
  }
  const {danio, ef, critico} = calcularDanio(a, d, mov);
  d.hp = Math.max(0, d.hp - danio);
  animar(idD, 'golpeado', 500);
  numeroDanio(idD, danio, critico, ef);
  if(critico || ef > 1) sacudirArena(critico && ef > 1);
  fichas();
  await espera(450);
  if(critico) await mensaje('¡Golpe crítico!', 750);
  if(ef > 1) await mensaje('¡Es muy efectivo!', 750);
  else if(ef < 1) await mensaje('No es muy efectivo...', 750);
}

async function ganarCombate(){
  const el = B.salvaje, yo = activo();
  B.fin = true;
  animar('b-rival', 'desmayo', 900);
  await mensaje(`${nomRival()} se debilitó.`);
  fichas();
  const xp = Math.round((el.nivel * 12 + 8) * (B.ent ? 1.5 : 1));
  await darXP(yo, xp);
  // ¿El entrenador tiene otra criatura?
  if(B.ent && B.ri < B.rivales.length - 1){
    B.ri++; B.salvaje = B.rivales[B.ri];
    S.album.vistos[B.salvaje.esp] = true;
    await mensaje(`${B.ent.nombre} sacó a ${B.salvaje.nombre}.`);
    $('#b-rival').innerHTML = svgEspecie(B.salvaje.esp, {humor: 'bien', shiny: B.salvaje.shiny});
    animar('b-rival', 'sale', 400);
    fichas();
    B.fin = false; B.ocupado = false; menu('principal');
    return;
  }
  if(B.ent){
    const e = B.ent;
    S.vencidos[e.id] = true;
    ganar(e.premio); $('#mon') && ($('#mon').textContent = S.monedas);
    await mensaje(`¡Le ganaste a ${e.titulo} ${e.nombre}!`, 1100);
    for(const l of e.despues) await mensaje(`${e.nombre}: «${l}»`, 1700);
    await mensaje(`Ganaste ${e.premio} monedas.`);
    if(e.medalla && !S.medallas[e.medalla]){
      S.medallas[e.medalla] = Date.now();
      const m = MEDALLAS.find(x => x.id === e.medalla);
      mostrarMedalla(m);
      await mensaje(`¡Conseguiste la ${m.nom}!`, 2400);
      if(MEDALLAS.every(x => S.medallas[x.id])) await mensaje('¡Tenés las cuatro medallas! ¡Sos campeón de Sorlandia!', 2400);
    }
  } else if(B.legendaria){
    S.legendarios[B.legendaria] = {proxima: Date.now() + 24 * 3600 * 1000};
    await mensaje(`${el.nombre} se desvaneció en el aire... Quizás vuelva mañana.`, 1900);
  } else {
    const mon = el.nivel * 6;
    ganar(mon); $('#mon') && ($('#mon').textContent = S.monedas);
    await mensaje(`Ganaste ${mon} monedas.`);
  }
  terminarCombate();
}
function mostrarMedalla(m){
  const d = document.createElement('div');
  d.className = 'medalla-premio';
  d.innerHTML = `${svgMedalla(m, 140)}<b>${m.nom}</b>`;
  const arena = document.querySelector('.arena'); if(arena) arena.appendChild(d);
}

async function darXP(l, xp){
  await mensaje(`${l.nombre} ganó ${xp} de experiencia.`, 800);
  const movsAntes = poderesDe(l.esp, l.nivel);
  const c = l.ref; c.xp = (c.xp || 0) + xp;
  let subio = false;
  while(c.xp >= xpPara(c.nivel)){ c.xp -= xpPara(c.nivel); c.nivel++; c.stats.vida += 2; c.stats.fuerza += 1; c.stats.velocidad += 1; subio = true; }
  if(subio){
    const nuevoMax = vidaMax(c.stats, c.nivel);
    l.hp = Math.min(nuevoMax, l.hp + (nuevoMax - l.max)); l.max = nuevoMax; l.nivel = c.nivel;
    await mensaje(`¡${l.nombre} subió a nivel ${c.nivel}!`);
  }
  for(const m of poderesDe(l.esp, l.nivel)) if(!movsAntes.includes(m)) await mensaje(`¡${l.nombre} aprendió ${MOVS[m].nom}!`);
  if(evolucionPendiente(c)) await animarEvolucion(l);
}
async function animarEvolucion(l){
  const c = l.ref, antes = c.nombre;
  await mensaje(`¿Eh? ¡${antes} está evolucionando!`, 1300);
  animar('b-propio', 'evoluciona', 1800);
  await espera(900);
  const nueva = evolucionar(c);
  Object.assign(l, comoLuchador(c), {hp: l.hp});
  l.max = vidaMax(c.stats, c.nivel); l.hp = Math.min(l.max, l.hp + 10);
  S.album.vistos[c.esp] = true; S.album.capt[c.esp] = (S.album.capt[c.esp] || 0) + 1;
  if(c.shiny) S.album.shiny[c.esp] = true;
  pintarPropio(); fichas();
  await espera(900);
  await mensaje(`¡${antes} evolucionó en ${nueva.nombre}!`, 1700);
}

async function propioCaido(){
  const yo = activo();
  animar('b-propio', 'desmayo', 900);
  await mensaje(`${yo.nombre} se debilitó.`);
  if(B.lista.some(l => l.hp > 0)){ B.forzado = true; return; }
  B.fin = true;
  const perdida = Math.floor(S.monedas * .1);
  S.monedas -= perdida;
  const posada = S.respawn && MAPAS[S.respawn.mapa];
  if(B.legendaria) S.legendarios[B.legendaria] = {proxima: Date.now() + 24 * 3600 * 1000};
  await mensaje(`Tu equipo quedó agotado. Volvés corriendo ${posada ? 'al Centro de Rehabilitación' : 'a casa'}${perdida ? ` y se te caen ${perdida} monedas` : ''}.`, 1700);
  B.lista.forEach(guardarHp);
  curarEquipo();
  B = null;
  if(posada){ S.mundo = {...S.respawn}; guardar(); pintarMundo(); avisar('Tu equipo se recuperó en el Centro de Rehabilitación.'); }
  else { S.mundo = {...SALIDA_CASA}; guardar(); pintarJuego(); }
}

async function tirarCapsula(o){
  const el = B.salvaje;
  S.inv.objetos[o.id]--;
  await mensaje(`Tiraste una ${o.nom}...`, 600);
  const rival = $('#b-rival'), guardado = rival.innerHTML;
  await animarCapsula(o);
  rival.innerHTML = `<div class="capsula-tirada">${iconoObjeto(o, 90)}</div>`;
  const minimo = B.legendaria ? .005 : .05;
  const prob = Math.max(minimo, Math.min(.95, ESPECIES[el.esp].captura * (1.3 - el.hp / el.max) * o.captura));
  const exito = Math.random() < prob;
  const sacudidas = exito ? 3 : Math.floor(Math.random() * 3);
  for(let k = 0; k < sacudidas; k++){ await espera(250); animar('b-rival', 'tiembla', 520); await espera(600); }
  if(exito){
    B.fin = true;
    await mensaje(`¡Atrapaste a ${el.nombre}!`, 1300);
    const nueva = nuevaCriatura(el.esp, el.nivel, {stats: {...el.stats}, hp: el.hp, shiny: !!el.shiny});
    const primera = !S.album.capt[el.esp];
    S.album.capt[el.esp] = (S.album.capt[el.esp] || 0) + 1;
    if(el.shiny) S.album.shiny[el.esp] = true;
    if(B.legendaria){ S.legendarios[B.legendaria] = {capturada: true}; await mensaje(`¡Increíble! ${el.nombre} es tuyo. Muy pocos entrenadores lo lograron.`, 2200); }
    if(S.equipo.length < MAX_EQUIPO){ S.equipo.push(nueva); await mensaje(`${el.nombre} se sumó a tu equipo.`); }
    else { S.reserva.push(nueva); await mensaje(`Tu equipo está lleno: ${el.nombre} se fue a vivir a tu casa.`); }
    if(primera) await mensaje(`¡${el.nombre} es nuevo en tu álbum!`);
    terminarCombate();
    return true;
  }
  rival.innerHTML = guardado;
  animar('b-rival', 'sale', 400);
  if(B.legendaria && Math.random() < .25){
    await mensaje(`${el.nombre} se libró de la cápsula... y se desvaneció.`, 1800);
    S.legendarios[B.legendaria] = {proxima: Date.now() + 24 * 3600 * 1000};
    B.fin = true; terminarCombate(); return true;
  }
  await mensaje(sacudidas === 0 ? `¡${el.nombre} se escapó enseguida!` : sacudidas === 1 ? '¡Uy, casi!' : '¡Le faltó tan poquito!');
  return false;
}

function terminarCombate(){
  if(!B) return;
  B.lista.forEach(guardarHp);
  if(B.legendaria && !S.legendarios[B.legendaria]) S.legendarios[B.legendaria] = {proxima: Date.now() + 24 * 3600 * 1000};
  B = null;
  guardar();
  setTimeout(() => pintarMundo(), 300);
}

/* ---------------- Hoja de criaturas: equipo, casa, álbum y medallas ---------------- */
function abrirEquipo(tab){
  if(tab) pestana.equipo = tab;
  hojaActual = 'equipo';
  nuevoVelo();
  pintarEquipo();
}
function barraVida(pct){ return `<div class="barra"><i style="width:${pct}%;background:${pct > 50 ? 'var(--verde)' : pct > 20 ? 'var(--ambar)' : 'var(--rojo)'}"></i></div>`; }
function tarjetaCriatura(l, acciones){
  const sp = ESPECIES[l.esp], pct = l.hp / l.max * 100;
  const evo = sp.evol ? `Evoluciona en nivel ${sp.evol.nivel}` : sp.de ? 'Última evolución' : 'No evoluciona';
  return `<div class="item criatura ${l.shiny ? 'es-shiny' : ''}">
    <div class="cr-cab"><span class="cr-mini">${svgEspecie(l.esp, {humor: l.hp > 0 ? 'feliz' : 'mal', shiny: l.shiny})}</span>
      <span class="cr-txt"><h3 class="cr-nom"></h3><small>${l.nombre !== sp.nombre ? sp.nombre + ' · ' : ''}Nv ${l.nivel} <span class="chip-tipo" style="background:${TIPOS[l.tipo].color}">${TIPOS[l.tipo].nom}</span></small></span></div>
    ${barraVida(pct)}
    <p>Vida ${l.hp}/${l.max} · Fuerza ${l.stats.fuerza} · Velocidad ${l.stats.velocidad}</p>
    <p><b>Poderes:</b> ${poderesDe(l.esp, l.nivel).map(m => MOVS[m].nom).join(', ')}</p>
    <p class="cr-evo">${evo}${l.shiny ? ' · ✦ Shiny' : ''}</p>
    ${acciones}</div>`;
}
function pintarEquipo(){
  const v = $('#velo'); if(!v) return;
  const t = pestana.equipo || 'equipo';
  const tabs = [['equipo', 'Equipo'], ['casa', 'En casa'], ['album', 'Álbum'], ['medallas', 'Medallas']];
  let cuerpo = '';
  const jarabe = OBJETOS.filter(o => o.cura).find(o => S.inv.objetos[o.id] > 0);
  const nombres = [];
  if(t === 'equipo'){
    const lista = equipoLuchadores();
    cuerpo = lista.map((l, i) => { nombres.push(l.nombre + brillo(l)); return tarjetaCriatura(l,
      `${l.hp < l.max && jarabe ? `<button class="btn" data-jarabe="${i}">Darle ${jarabe.nom}</button>` : ''}
       ${i > 0 ? `<button class="btn btn-2" data-primero="${i}">Que pelee primero</button>` : '<span class="etiqueta" style="margin-top:4px">Pelea primero</span>'}
       ${lista.length > 1 ? `<button class="btn btn-2" data-acasa="${i}">Mandar a casa</button>` : ''}`); }).join('');
    cuerpo += `<p class="vacio" style="grid-column:1/-1;padding:6px">Tu equipo: ${lista.length} de ${MAX_EQUIPO}. Tu casa y los Centros de Rehabilitación curan a todos.</p>`;
  } else if(t === 'casa'){
    cuerpo = S.reserva.length ? S.reserva.map((c, i) => { nombres.push(c.nombre + (c.shiny ? ' ✦' : '')); return tarjetaCriatura(comoLuchador(c),
      `<button class="btn" data-alequipo="${i}" ${S.equipo.length >= MAX_EQUIPO ? 'disabled' : ''}>${S.equipo.length >= MAX_EQUIPO ? 'Equipo lleno' : 'Sumar al equipo'}</button>`); }).join('')
      : '<div class="vacio">Acá viven las criaturas que no entran en tu equipo.</div>';
  } else if(t === 'medallas'){
    const n = cantMedallas();
    cuerpo = `<p class="vacio" style="grid-column:1/-1;padding:4px">${n === 4 ? '¡Campeón de Sorlandia! Ahora las leyendas te esperan.' : `Medallas: ${n} de 4`}</p>` + MEDALLAS.map(m => {
      const L = Object.values(LIDERES).find(l => l.medalla === m.id), tiene = S.medallas[m.id];
      return `<div class="item album"><span class="cr-album" style="display:grid;place-items:center">${svgMedalla(m, 96, !tiene)}</span>
        <h3>${m.nom}</h3><span class="chip-tipo" style="background:${TIPOS[m.tipo].color}">${TIPOS[m.tipo].nom}</span>
        <p>${tiene ? `Se la ganaste a ${L.nombre} en ${m.ciudad}.` : `La da ${L.nombre}, líder de ${m.ciudad}.`}</p></div>`;
    }).join('');
  } else {
    const atrapadas = NORMALES.filter(e => S.album.capt[e]).length, vistas = NORMALES.filter(e => S.album.vistos[e]).length;
    cuerpo = `<p class="vacio" style="grid-column:1/-1;padding:4px">Atrapadas ${atrapadas} de ${NORMALES.length} · Vistas ${vistas} · Legendarias ${LEGENDARIAS.filter(e => S.album.capt[e]).length} de 3</p>` + ORDEN_ALBUM.map((e, i) => {
      const sp = ESPECIES[e], capt = S.album.capt[e], visto = S.album.vistos[e];
      const num = sp.legendaria ? '★' : '#' + String(i + 1).padStart(3, '0');
      if(!visto) return `<div class="item album chico"><span class="num">${num}</span><span class="cr-album" style="filter:brightness(0);opacity:.1">${svgEspecie(e)}</span><h3>???</h3></div>`;
      return `<div class="item album chico ${sp.legendaria ? 'legendaria' : ''}"><span class="num">${num}${S.album.shiny[e] ? ' ✦' : ''}</span><span class="cr-album" ${capt ? '' : 'style="filter:brightness(0);opacity:.3"'}>${svgEspecie(e, {humor: 'feliz'})}</span>
        <h3>${sp.nombre}</h3><span class="chip-tipo" style="background:${TIPOS[sp.tipo].color}">${TIPOS[sp.tipo].nom}</span>
        ${capt ? `<p>${sp.desc}</p>` : '<p>La viste, pero todavía no la atrapaste.</p>'}</div>`;
    }).join('');
  }
  v.innerHTML = `<div class="hoja" role="dialog" aria-label="Criaturas"><div class="hoja-cab"><h2>Criaturas</h2><button class="cerrar" aria-label="Cerrar">×</button></div>
    <div class="pestanas" role="tablist">${tabs.map(([k, n]) => `<button role="tab" data-tab="${k}" aria-selected="${t === k}">${n}</button>`).join('')}</div>
    <div class="grilla ${t === 'album' ? 'grilla-album' : ''}">${cuerpo}</div></div>`;
  v.querySelectorAll('.cr-nom').forEach((h, i) => h.textContent = nombres[i] || '');
  v.querySelector('.cerrar').onclick = cerrarHoja;
  v.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { pestana.equipo = b.dataset.tab; pintarEquipo(); });
  v.querySelectorAll('[data-jarabe]').forEach(b => b.onclick = () => {
    const l = equipoLuchadores()[+b.dataset.jarabe];
    S.inv.objetos[jarabe.id]--; l.hp = Math.min(l.max, l.hp + jarabe.cura); guardarHp(l);
    guardar(); avisar(`${l.nombre} recuperó vida`); pintarEquipo();
  });
  v.querySelectorAll('[data-primero]').forEach(b => b.onclick = () => {
    const [c] = S.equipo.splice(+b.dataset.primero, 1); S.equipo.unshift(c); guardar(); pintarEquipo();
    if(vista === 'casa') pintarJuego(), abrirEquipo('equipo');
    if(MW) MW.imgLider = null;
  });
  v.querySelectorAll('[data-acasa]').forEach(b => b.onclick = () => {
    if(S.equipo.length <= 1) return;
    const [c] = S.equipo.splice(+b.dataset.acasa, 1); S.reserva.push(c); guardar(); pintarEquipo();
    if(MW) MW.imgLider = null;
  });
  v.querySelectorAll('[data-alequipo]').forEach(b => b.onclick = () => {
    if(S.equipo.length >= MAX_EQUIPO) return;
    const [c] = S.reserva.splice(+b.dataset.alequipo, 1); S.equipo.push(c); guardar(); pintarEquipo();
  });
}
