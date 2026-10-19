'use strict';
/* =====================================================================
   Equipo, combate por turnos, captura y álbum.
   ===================================================================== */

const MAX_EQUIPO = 6;

/* ---------------- Equipo ---------------- */
function comoLuchador(c){
  const max = vidaMax(c.stats, c.nivel);
  return {ref: c, esp: c.esp, nombre: c.nombre, nivel: c.nivel, stats: c.stats, tipo: tipoDe(c.esp), shiny: !!c.shiny, movs: movsDe(c), hp: c.hp == null ? max : Math.min(c.hp, max), max};
}
const capturadaComoLuchador = comoLuchador;
function equipoLuchadores(){ return S.equipo.map(comoLuchador); }
function hayLuchadorEnPie(){ return equipoLuchadores().some(l => l.hp > 0); }
function guardarHp(l){ l.ref.hp = l.hp >= l.max ? null : l.hp; }
function curarEquipo(){ [...S.equipo, ...S.reserva].forEach(c => { c.hp = null; delete c.ppUsado; }); }
const brillo = l => l.shiny ? ' ✦' : '';

/* ---------------- Combate ---------------- */
let B = null;
const espera = ms => new Promise(r => setTimeout(r, ms));

const ARENAS = {pradera:'pradera', bosque:'bosque', rio:'rio', costa:'rio', sierras:'sierras', serrania:'sierras', cumbres:'cumbres', volcan:'volcan',
  bosquepanal:'bosque', lomasventosas:'pradera', vallehelado:'cumbres', cueva:'sierras'};
function empezarCombate(rivales, zona, ent){
  vista = 'combate';
  if(typeof marcarPelea === 'function') marcarPelea('combate');
  cerrarHoja();
  rivales.forEach(r => { r.max = r.hp; });
  const salvaje = rivales[0];
  const lista = equipoLuchadores();
  const i = lista.findIndex(l => l.hp > 0);
  B = {salvaje, rivales, ri: 0, ent: ent || null, zona, lista, i, peleo: new Set([i]), ocupado: true, forzado: false, fin: false, legendaria: ESPECIES[salvaje.esp].legendaria ? salvaje.esp : null};
  S.album.vistos[salvaje.esp] = true;
  pintarCombate();
  (async () => {
    if(ent){
      await mensaje(`¡${ent.titulo} ${ent.nombre} te desafía!`, 1300);
      const m1 = mensaje(`${ent.nombre} sacó a ${salvaje.nombre}.`, 1200);
      await sacarCriatura('rival'); await m1;
    } else {
      if(B.legendaria) await mensaje(`¡${salvaje.nombre} apareció delante tuyo!`, 1600);
      else await mensaje(`¡Apareció un ${salvaje.nombre} salvaje!`);
      if(salvaje.shiny){ animar('b-rival', 'destello', 1200); await mensaje(`¡Brilla! ¡Es un ${salvaje.nombre} shiny, de otro color!`, 1700); }
      else if(ESPECIES[salvaje.esp].captura <= .18 && !B.legendaria) await mensaje('¡Es rarísimo verlo por acá!');
    }
    const m2 = mensaje(`¡Dale, ${activo().nombre}!`, 1100);
    await sacarCriatura('propio'); await m2;
    B.ocupado = false; menu('principal');
  })();
}
/* ---------------- Entrenadores: sacan y guardan a sus criaturas ---------------- */
async function popCapsula(cr){
  const arena = $('.arena'); if(!arena || !cr) return;
  const r = cr.getBoundingClientRect(), a = arena.getBoundingClientRect();
  const d = document.createElement('div'); d.className = 'capsula-pop';
  d.style.left = (r.left - a.left + r.width / 2) + 'px'; d.style.top = (r.top - a.top + r.height * .62) + 'px';
  d.innerHTML = iconoObjeto(OBJETOS[0], 34) + '<i></i>';
  arena.appendChild(d); await espera(420); d.remove();
}
async function sacarCriatura(lado){
  const ent = $('#e-' + lado), cr = $('#b-' + lado);
  if(ent && !ent.classList.contains('se-va')){ ent.classList.add('lanza'); await espera(280); ent.classList.add('se-va'); }
  await popCapsula(cr);
  if(cr){ cr.classList.remove('oculto'); animar('b-' + lado, lado === 'propio' ? 'sale-propio' : 'sale', 450); }
  await espera(380);
}
// La criatura vuelve a la cápsula y el entrenador vuelve a entrar.
async function guardarCriatura(lado, conEntrenador = true){
  const cr = $('#b-' + lado), ent = $('#e-' + lado);
  if(cr && !cr.classList.contains('oculto')){ cr.classList.add(lado === 'propio' ? 'vuelve-propio' : 'vuelve'); await espera(480); cr.classList.add('oculto'); }
  if(ent && conEntrenador){ ent.classList.remove('se-va', 'lanza'); ent.classList.add('regresa'); await espera(460); }
}
const activo = () => B.lista[B.i];

function pintarCombate(){
  const z = B.zona;
  if(B.ent) B.tema = B.ent.tipoGym && TEMAS_ESTADIO[B.ent.tipoGym] ? B.ent.tipoGym : tipoDominante(B.rivales);
  $('#app').innerHTML = `
    <section class="combate">
      ${B.ent ? `<div class="banda-ent">${B.ent.lider ? 'Gimnasio · ' : ''}${B.ent.titulo} <b></b> · <span id="cuenta-rivales"></span></div>` : ''}
      <div class="arena arena-${ARENAS[z] || 'ciudad'} ${B.ent ? 'con-estadio est-' + B.tema : 'salvaje'}">
        <div class="escena">
          ${B.ent ? estadioHTML(B.tema) : svgFondoArena(ARENAS[z] || 'ciudad') + svgCampo(ARENAS[z] || 'ciudad', false)}
          <div class="nube n1"></div><div class="nube n2"></div>
          <div class="plataforma rival"></div><div class="plataforma propio"></div>
          ${B.ent ? `<div class="ent-combate rival" id="e-rival">${svgEntrenador(aspectoNpc(B.ent))}</div>` : ''}
          <div class="ent-combate propio" id="e-propio">${svgEntrenador(S.entrenador, undefined, 'arriba')}</div>
          <div class="bicho-combate rival${B.ent ? ' oculto' : ''}" id="b-rival"></div>
          <div class="bicho-combate propio oculto" id="b-propio"></div>
        </div>
        <div class="ficha-luch rival" id="f-rival"></div>
        <div class="ficha-luch propio" id="f-propio"></div>
      </div>
      <div class="panel texto-combate" id="t-combate" aria-live="polite"></div>
      <div class="menu-combate" id="menu-combate"></div>
    </section>`;
  if(B.ent) $('.banda-ent b').textContent = B.ent.nombre;
  $('#b-rival').innerHTML = svgEspecie(B.salvaje.esp, {humor: 'bien', shiny: B.salvaje.shiny});
  pintarPropio();
  fichas();
  if(!B.ent) animar('b-rival', 'entra-rival', 700);
}
const nomRival = () => B.ent ? `${B.salvaje.nombre} de ${B.ent.nombre}` : `${B.salvaje.nombre} salvaje`;
function pintarPropio(){
  const l = activo();
  $('#b-propio').innerHTML = svgEspecie(l.esp, {humor: 'bien', shiny: l.shiny, vista: 'lado'});
}
function fichaHTML(l, propio){
  const pct = Math.max(0, l.hp / l.max * 100);
  const col = pct > 50 ? 'var(--verde)' : pct > 20 ? 'var(--ambar)' : 'var(--rojo)';
  return `<div class="fl-cab"><b></b><span>Nv ${l.nivel}</span></div>
    <span class="chip-tipo" style="background:${TIPOS[l.tipo].color}">${TIPOS[l.tipo].nom}</span>
    <div class="barra fl-barra"><i style="width:${pct}%;background:${col}"></i></div>
    ${propio ? `<div class="fl-num">${l.hp} / ${l.max}</div>` : ''}
    ${propio && l.ref && l.ref.xp !== undefined ? (() => { const p = Math.min(100, Math.floor((l.ref.xp || 0) / xpPara(l.ref.nivel) * 100));
      return `<div class="fl-xp" title="Experiencia: ${p}%"><i style="width:${p}%"></i></div><div class="fl-xp-txt">Faltan ${100 - p}% para Nv ${l.ref.nivel + 1}</div>`; })() : ''}`;
}
function fichas(){
  if(!$('#f-rival')) return;
  $('#f-rival').innerHTML = fichaHTML(B.salvaje, false); $('#f-rival b').textContent = B.salvaje.nombre + brillo(B.salvaje);
  if(S.album.capt[B.salvaje.esp]) $('#f-rival .fl-cab b').insertAdjacentHTML('beforeend', `<span class="ya-tenes" title="Ya la atrapaste">${iconoObjeto(OBJETOS[0], 16)}</span>`);
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
    const movs = movsDe(l), sinUsos = movs.every(id => ppDe(l.ref, id) <= 0);
    // Si no le queda ningún uso, solo puede forcejear.
    m.innerHTML = (sinUsos ? ['forcejeo'] : movs).map(id => {
      const mv = MOVS[id], ef = mv.poder ? efectividad(mv.tipo, B.salvaje.tipo) : 1, quedan = id === 'forcejeo' ? null : ppDe(l.ref, id), max = id === 'forcejeo' ? null : ppMax(l.ref, id);
      return `<button data-m="${id}" class="mc-mov${quedan === 0 ? ' agotado' : quedan !== null && quedan <= max / 4 ? ' pocos' : ''}" style="--tipo:${TIPOS[mv.tipo].color}" ${quedan === 0 ? 'disabled' : ''}>
        <b>${mv.nom}</b><small>${TIPOS[mv.tipo].nom} · ${mv.poder ? 'Poder ' + mv.poder : 'Especial'}${ef > 1 ? ' · ¡Efectivo!' : ef < 1 ? ' · Poco efectivo' : ''}</small>
        ${quedan !== null ? `<span class="usos">${quedan}/${max}</span>` : '<span class="usos">Sin usos: forcejea</span>'}</button>`;
    }).join('') + `<button class="mc-volver" data-v>Volver</button>`;
    m.querySelectorAll('[data-m]').forEach(b => b.onclick = () => turno({tipo: 'atacar', mov: b.dataset.m}));
    m.querySelector('[data-v]').onclick = () => menu('principal');
  } else if(tipo === 'mochila'){
    const objs = OBJETOS.filter(o => S.inv.objetos[o.id] > 0 && o.enCombate);
    m.className = 'menu-combate grilla-2';
    m.innerHTML = (objs.length ? objs.map(o => `<button data-o="${o.id}" class="mc-obj">${iconoObjeto(o, 30)}<span><b>${o.nom}</b><small>Tenés ${S.inv.objetos[o.id]}</small></span></button>`).join('')
      : `<p class="mc-vacio">No tenés cápsulas, jarabes ni revivir. Comprá en el Market.</p>`) + `<button class="mc-volver" data-v>Volver</button>`;
    m.querySelectorAll('[data-o]').forEach(b => b.onclick = () => {
      const o = OBJETOS.find(x => x.id === b.dataset.o);
      if(o.revive) menu('revivir:' + o.id); else if(o.usa === 'pp') menu('pp:' + o.id); else turno({tipo: 'objeto', obj: o.id});
    });
    m.querySelector('[data-v]').onclick = () => menu('principal');
  } else if(tipo.startsWith('pp:')){
    const id = tipo.slice(3), c = l.ref;
    m.className = 'menu-combate grilla-2';
    m.innerHTML = movsDe(l).map(mid => `<button data-pp="${mid}" class="mc-mov" style="--tipo:${TIPOS[MOVS[mid].tipo].color}" ${ppDe(c, mid) >= ppMax(c, mid) ? 'disabled' : ''}><b>${MOVS[mid].nom}</b><small>Usos ${ppDe(c, mid)}/${ppMax(c, mid)}</small></button>`).join('')
      + `<button class="mc-volver" data-v>Volver</button>`;
    m.querySelectorAll('[data-pp]').forEach(b => b.onclick = () => turno({tipo: 'objeto', obj: id, mov: b.dataset.pp}));
    m.querySelector('[data-v]').onclick = () => menu('mochila');
  } else if(tipo.startsWith('revivir:')){
    const id = tipo.slice(8), caidos = B.lista.map((x, i) => [x, i]).filter(([x]) => x.hp <= 0);
    m.className = 'menu-combate lista';
    m.innerHTML = (caidos.length ? caidos.map(([x, i]) => `<button data-r="${i}" class="mc-obj"><span><b></b><small>Debilitada · Nv ${x.nivel}</small></span></button>`).join('')
      : `<p class="mc-vacio">No hay ninguna criatura debilitada.</p>`) + `<button class="mc-volver" data-v>Volver</button>`;
    m.querySelectorAll('[data-r]').forEach(b => { b.querySelector('b').textContent = B.lista[+b.dataset.r].nombre; b.onclick = () => turno({tipo: 'objeto', obj: id, dest: +b.dataset.r}); });
    m.querySelector('[data-v]').onclick = () => menu('mochila');
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
      const vuelve = yo.nombre, forzado = B.forzado;
      if(!forzado){ mensaje(`¡Volvé, ${vuelve}!`, 600); await guardarCriatura('propio', false); }
      $('#b-propio').classList.remove('vuelve-propio', 'desmayo');
      B.i = acc.i; B.peleo.add(B.i); pintarPropio(); fichas();
      const m3 = mensaje(`¡Dale, ${activo().nombre}!`, 900);
      await sacarCriatura('propio'); await m3;
      if(forzado){ B.forzado = false; return; }
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
      else if(o.usa === 'pp' || o.usa === 'ppmax'){
        const c = yo.ref, movs = movsDe(yo);
        if(o.usa === 'pp'){
          if(!acc.mov || ppDe(c, acc.mov) >= ppMax(c, acc.mov)) return;
          S.inv.objetos[o.id]--; recargarPP(c, acc.mov, o.cant);
          await mensaje(`${yo.nombre} recargó usos de ${MOVS[acc.mov].nom}.`);
        } else {
          if(movs.every(id => ppDe(c, id) >= ppMax(c, id))){ await mensaje(`${yo.nombre} tiene todos los usos llenos.`, 900); return; }
          S.inv.objetos[o.id]--; recargarPP(c, null);
          await mensaje(`¡${yo.nombre} recargó todos sus poderes!`);
        }
      }
      else if(o.revive){
        const l = B.lista[acc.dest];
        if(!l || l.hp > 0) return;
        S.inv.objetos[o.id]--;
        l.hp = Math.max(1, Math.round(l.max * o.revive)); guardarHp(l);
        await mensaje(`¡${l.nombre} se levantó con ${l.hp} de vida!`);
      } else {
        if(yo.hp >= yo.max){ await mensaje(`${yo.nombre} ya tiene la vida llena.`, 800); return; }
        S.inv.objetos[o.id]--;
        const antes = yo.hp; yo.hp = Math.min(yo.max, yo.hp + o.cura); fichas();
        await mensaje(`${yo.nombre} tomó ${o.nom} y recuperó ${yo.hp - antes} de vida.`);
      }
      if(await turnoRival()) return;
    } else {
      const mov = MOVS[acc.mov];
      if(acc.mov !== 'forcejeo'){
        if(ppDe(yo.ref, acc.mov) <= 0){ await mensaje(`¡A ${yo.nombre} no le quedan usos de ${mov.nom}!`); return; }
        gastarPP(yo.ref, acc.mov);
      } else await mensaje(`¡A ${yo.nombre} no le quedan usos de ningún poder!`, 900);
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
  // Gana experiencia toda criatura que peleó contra este rival y sigue en pie.
  const ganan = [...B.peleo].map(i => B.lista[i]).filter(l => l && l.hp > 0);
  if(!ganan.includes(yo) && yo.hp > 0) ganan.unshift(yo);
  for(const l of ganan) await darXP(l, xp);
  // ¿El entrenador tiene otra criatura?
  if(B.ent && B.ri < B.rivales.length - 1){
    B.ri++; B.salvaje = B.rivales[B.ri]; B.peleo = new Set([B.i]);
    S.album.vistos[B.salvaje.esp] = true;
    const br = $('#b-rival'); br.classList.add('oculto'); br.classList.remove('desmayo');
    br.innerHTML = svgEspecie(B.salvaje.esp, {humor: 'bien', shiny: B.salvaje.shiny});
    fichas();
    const m4 = mensaje(`${B.ent.nombre} sacó a ${B.salvaje.nombre}.`, 1100);
    await sacarCriatura('rival'); await m4;
    B.fin = false; B.ocupado = false; menu('principal');
    return;
  }
  if(B.ent){
    const e = B.ent;
    S.vencidos[e.id] = true;
    await guardarCriatura('rival');
    ganar(e.premio); $('#mon') && ($('#mon').textContent = S.monedas);
    await mensaje(`¡Le ganaste a ${e.titulo} ${e.nombre}!`, 1100);
    for(const l of e.despues) await mensaje(`${e.nombre}: «${l}»`, 1700);
    await mensaje(`Ganaste ${e.premio} monedas.`);
    if(e.cuartel){
      S.cuartel.racha++;
      if(e.campeona){
        S.cuartel.racha = 0;
        const primera = !S.campeon;
        S.campeon = S.campeon || Date.now();
        S.salonFama = S.salonFama || [];
        S.salonFama.push({fecha: Date.now(), equipo: S.equipo.map(c => ({esp: c.esp, nombre: c.nombre, nivel: c.nivel, shiny: !!c.shiny}))});
        mostrarCorona();
        await mensaje(primera ? '¡Sos el nuevo Campeón de Sorlandia!' : '¡Defendiste el título de Campeón!', 2600);
        if(primera){ S.inv.muebles.copa = (S.inv.muebles.copa || 0) + 1; await mensaje('Te dieron la Copa del Campeón para tu casa.', 1800); }
      } else S.cuartel.continuar = true;
    }
    if(e.medalla && !S.medallas[e.medalla]){
      S.medallas[e.medalla] = Date.now();
      const m = MEDALLAS.find(x => x.id === e.medalla);
      mostrarMedalla(m);
      await mensaje(`¡Conseguiste la ${m.nom}!`, 2400);
      if(e.mov && MOVS[e.mov]){
        S.discos[e.mov] = true; S.ensenar = e.mov;
        await mensaje(`${e.nombre} te regaló su movimiento: ${MOVS[e.mov].nom}.`, 2200);
      }
      const hab = Object.values(HABILIDADES).find(h => h.medalla === e.medalla);
      if(hab) await mensaje(`Con la ${m.nom}, tus criaturas pueden usar ${hab.nom} fuera de combate. ${hab.desc}`, 2600);
      if(MEDALLAS.every(x => S.medallas[x.id])) await mensaje('¡Tenés las ocho medallas! El camino a la Cumbre Suprema está abierto.', 2400);
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
function mostrarCorona(){
  const d = document.createElement('div');
  d.className = 'medalla-premio';
  d.innerHTML = `${svgCopa(150)}<b>¡Campeón de Sorlandia!</b>`;
  const arena = document.querySelector('.arena'); if(arena) arena.appendChild(d);
}
function mostrarMedalla(m){
  const d = document.createElement('div');
  d.className = 'medalla-premio';
  d.innerHTML = `${svgMedalla(m, 140)}<b>${m.nom}</b>`;
  const arena = document.querySelector('.arena'); if(arena) arena.appendChild(d);
}

async function darXP(l, xp){
  await mensaje(`${l.nombre} ganó ${xp} de experiencia.`, 800);
  const c = l.ref; asegurarMovs(c);
  const nivelAntes = c.nivel;
  c.xp = (c.xp || 0) + xp;
  let subio = false;
  while(c.xp >= xpPara(c.nivel)){ c.xp -= xpPara(c.nivel); c.nivel++; c.stats.vida += 2; c.stats.fuerza += 1; c.stats.velocidad += 1; subio = true; }
  if(subio){
    const nuevoMax = vidaMax(c.stats, c.nivel);
    l.hp = Math.min(nuevoMax, l.hp + (nuevoMax - l.max)); l.max = nuevoMax; l.nivel = c.nivel;
  }
  // La ficha se actualiza en el momento: nivel, vida máxima y experiencia.
  if(B && activo() === l){
    fichas();
    if(subio){ animar('f-propio', 'sube-nivel', 900); animar('b-propio', 'sube-nivel-bicho', 900); }
    await espera(450);
  }
  if(subio) await mensaje(`¡${l.nombre} subió a nivel ${c.nivel}!`);
  for(const m of nuevosEnNivel(c.esp, nivelAntes, c.nivel)) await aprenderPoder(c, m, l);
  if(evolucionPendiente(c)){
    await animarEvolucion(l);
    for(const m of nuevosEnNivel(c.esp, c.nivel - 1, c.nivel)) await aprenderPoder(c, m, l);
  }
}
/* ---------------- Aprender un poder nuevo (con elección si ya sabe 4) ---------------- */
async function aprenderPoder(c, mov, l){
  asegurarMovs(c);
  if(!MOVS[mov] || c.movs.includes(mov)) return;
  const nom = MOVS[mov].nom;
  const decir = (t, ms) => vista === 'combate' && $('#t-combate') ? mensaje(t, ms) : (avisar(t, 'nivel'), Promise.resolve());
  if(c.movs.length < 4){ c.movs.push(mov); if(l) l.movs = c.movs; await decir(`¡${c.nombre} aprendió ${nom}!`, 1100); return; }
  const i = await elegirOlvido(c, mov);
  if(i >= 0){
    const viejo = MOVS[c.movs[i]].nom;
    if(c.ppUsado) delete c.ppUsado[c.movs[i]];
    if(c.ppExtra) delete c.ppExtra[c.movs[i]];
    c.movs[i] = mov; if(l) l.movs = c.movs;
    await decir(`1, 2 y… ¡puf! ${c.nombre} olvidó ${viejo} y aprendió ${nom}.`, 1600);
  } else await decir(`${c.nombre} no aprendió ${nom}.`, 1100);
}
function tarjetaPoder(id, extra = ''){
  const mv = MOVS[id];
  return `<b>${mv.nom}</b><small>${TIPOS[mv.tipo].nom} · ${mv.poder ? 'Poder ' + mv.poder : 'Especial'}${mv.prec ? ' · Precisión ' + mv.prec : ''}${extra}</small>`;
}
// Devuelve el índice del poder a olvidar, o -1 si decidís no aprender el nuevo.
function elegirOlvido(c, nuevo){
  return new Promise(res => {
    const m = $('#menu-combate');
    if(vista === 'combate' && m){
      const t = $('#t-combate'); if(t) t.textContent = `${c.nombre} quiere aprender ${MOVS[nuevo].nom}, pero ya sabe 4 poderes. ¿Cuál olvida?`;
      m.className = 'menu-combate lista olvidar';
      m.innerHTML = `<div class="mc-nuevo" style="--tipo:${TIPOS[MOVS[nuevo].tipo].color}"><span>Nuevo</span>${tarjetaPoder(nuevo)}</div>`
        + c.movs.map((id, i) => `<button data-olv="${i}" class="mc-mov" style="--tipo:${TIPOS[MOVS[id].tipo].color}">${tarjetaPoder(id, ' · Olvidar')}</button>`).join('')
        + `<button class="mc-volver" data-no>No aprender ${MOVS[nuevo].nom}</button>`;
      m.querySelectorAll('[data-olv]').forEach(b => b.onclick = () => { m.innerHTML = ''; res(+b.dataset.olv); });
      m.querySelector('[data-no]').onclick = () => { m.innerHTML = ''; res(-1); };
      return;
    }
    hojaActual = 'olvidar';
    const v = nuevoVelo(false);
    v.innerHTML = `<div class="hoja" role="dialog" aria-label="Aprender poder"><div class="hoja-cab"><h2>¿Qué poder olvida?</h2></div>
      <p class="rotulo-chico"><b class="ol-nom"></b> quiere aprender <b>${MOVS[nuevo].nom}</b>, pero ya sabe 4 poderes.</p>
      <div class="menu-combate lista olvidar">
        <div class="mc-nuevo" style="--tipo:${TIPOS[MOVS[nuevo].tipo].color}"><span>Nuevo</span>${tarjetaPoder(nuevo)}</div>
        ${c.movs.map((id, i) => `<button data-olv="${i}" class="mc-mov" style="--tipo:${TIPOS[MOVS[id].tipo].color}">${tarjetaPoder(id, ' · Olvidar')}</button>`).join('')}
        <button class="mc-volver" data-no>No aprender ${MOVS[nuevo].nom}</button></div></div>`;
    v.querySelector('.ol-nom').textContent = c.nombre;
    const fin = i => { cerrarHoja(); res(i); };
    v.querySelectorAll('[data-olv]').forEach(b => b.onclick = () => fin(+b.dataset.olv));
    v.querySelector('[data-no]').onclick = () => fin(-1);
  });
}
async function animarEvolucion(l){
  const c = l.ref, antes = c.nombre, espAntes = c.esp;
  await mensaje(`¿Eh? ¡${antes} está evolucionando!`, 900);
  const nueva = evolucionar(c);
  await escenaEvolucion(espAntes, c.esp, antes, c.shiny);
  Object.assign(l, comoLuchador(c), {hp: l.hp});
  l.max = vidaMax(c.stats, c.nivel); l.hp = Math.min(l.max, l.hp + 10);
  S.album.vistos[c.esp] = true; S.album.capt[c.esp] = (S.album.capt[c.esp] || 0) + 1;
  if(c.shiny) S.album.shiny[c.esp] = true;
  if(activo() === l){ pintarPropio(); animar('b-propio', 'sale-propio', 450); }
  fichas();
  await mensaje(`¡${antes} ahora es ${nueva.nombre}!`, 1200);
}
/* ---------------- Escena de evolución (pantalla completa, estilo clásico) ---------------- */
function escenaEvolucion(espA, espB, nombre, shiny){
  return new Promise(async res => {
    const d = document.createElement('div');
    d.className = 'evo-escena';
    d.innerHTML = `<div class="evo-rayos"></div><div class="evo-cr"><div class="evo-a">${svgEspecie(espA, {humor: 'bien', shiny, aura: false})}</div>
      <div class="evo-b">${svgEspecie(espB, {humor: 'feliz', shiny, aura: false})}</div></div>
      <div class="evo-chispas">${Array.from({length: 14}, (_, i) => `<i style="--a:${i * 360 / 14}deg;--d:${(i % 3) * .12}s"></i>`).join('')}</div>
      <p class="evo-texto"></p><button class="evo-seguir" hidden>Seguir</button>`;
    document.body.appendChild(d);
    const t = d.querySelector('.evo-texto'), a = d.querySelector('.evo-a'), b = d.querySelector('.evo-b');
    t.textContent = `¿Eh? ¡${nombre} está evolucionando!`;
    await espera(1300);
    d.classList.add('brillando');
    await espera(900);
    // Alterna entre la forma vieja y la nueva cada vez más rápido.
    let ms = 520;
    let nueva = false;
    while(ms > 55){ nueva = !nueva; a.classList.toggle('fuera', nueva); b.classList.toggle('dentro', nueva); await espera(ms); ms *= .8; }
    a.classList.add('fuera'); b.classList.add('dentro');
    d.classList.add('destello');
    await espera(350);
    d.classList.remove('brillando'); d.classList.add('listo');
    t.textContent = `¡Felicitaciones! ¡${nombre} evolucionó en ${ESPECIES[espB].nombre}!`;
    const btn = d.querySelector('.evo-seguir'); btn.hidden = false; btn.focus();
    let hecho = false;
    const cerrar = () => { if(hecho) return; hecho = true; d.classList.add('cierra'); setTimeout(() => { d.remove(); res(); }, 300); };
    btn.onclick = cerrar; setTimeout(cerrar, 4500);
  });
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
  if(S.cuartel){ S.cuartel.racha = 0; S.cuartel.continuar = false; }
  await guardarCriatura('propio');
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
  if($('#e-propio')) guardarCriatura('propio').then(() => setTimeout(() => { if(vista === 'combate') pintarMundo(); }, 350));
  else setTimeout(() => pintarMundo(), 300);
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
  const evo = sp.evol ? `Evoluciona en nivel ${sp.evol.nivel}` : sp.evolPiedra ? 'Evoluciona con piedras' : sp.de ? 'Última evolución' : 'No evoluciona';
  return `<div class="item criatura ${l.shiny ? 'es-shiny' : ''}">
    <div class="cr-cab"><span class="cr-mini">${svgEspecie(l.esp, {humor: l.hp > 0 ? 'feliz' : 'mal', shiny: l.shiny})}</span>
      <span class="cr-txt"><h3 class="cr-nom"></h3><small>${l.nombre !== sp.nombre ? sp.nombre + ' · ' : ''}Nv ${l.nivel} <span class="chip-tipo" style="background:${TIPOS[l.tipo].color}">${TIPOS[l.tipo].nom}</span></small></span></div>
    ${barraVida(pct)}
    <p>Vida ${l.hp}/${l.max} · Fuerza ${l.stats.fuerza} · Velocidad ${l.stats.velocidad}</p>
    <p class="poderes-ficha"><b>Poderes:</b> ${movsDe(l).map(m => `<span>${MOVS[m].nom} <small>${ppDe(l.ref || l, m)}/${ppMax(l.ref || l, m)}</small></span>`).join('')}</p>
    <p class="cr-evo">${evo}${l.shiny ? ' · ✦ Shiny' : ''}</p>
    ${acciones}</div>`;
}
// Ponerle (o cambiarle) el nombre a una criatura. Vacío = vuelve al nombre de la especie.
function renombrarCriatura(c){
  const v = $('#velo'); if(!v) return;
  const sp = ESPECIES[c.esp];
  v.innerHTML = `<div class="hoja" role="dialog" aria-label="Cambiar nombre"><div class="hoja-cab"><h2>Cambiar nombre</h2><button class="cerrar" aria-label="Cerrar">×</button></div>
    <form class="form-renombrar" id="f-renombrar">
      <span class="cr-mini" style="width:96px;height:96px;margin:0 auto;display:block">${svgEspecie(c.esp, {humor: 'feliz', shiny: c.shiny})}</span>
      <label for="nuevo-nombre">¿Cómo se llama tu ${esc(sp.nombre)}?</label>
      <input id="nuevo-nombre" maxlength="16" autocomplete="off" placeholder="${esc(sp.nombre)}">
      <p class="rotulo-chico">Hasta 16 letras. Si lo dejás vacío, vuelve a llamarse ${esc(sp.nombre)}.</p>
      <div class="acciones-jugador"><button class="grande" type="submit">Listo</button><button class="btn btn-2" type="button" id="rn-volver">Volver</button></div>
    </form></div>`;
  const inp = v.querySelector('#nuevo-nombre'); inp.value = c.nombre; inp.focus(); inp.select();
  v.querySelector('.cerrar').onclick = cerrarHoja;
  v.querySelector('#rn-volver').onclick = pintarEquipo;
  v.querySelector('#f-renombrar').onsubmit = ev => {
    ev.preventDefault();
    const nuevo = inp.value.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 16) || sp.nombre;
    const antes = c.nombre; c.nombre = nuevo; guardar();
    if(nuevo !== antes) avisar(`Ahora se llama ${nuevo}`);
    if(MW) MW.imgLider = null;
    pintarEquipo();
  };
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
       ${lista.length > 1 ? `<button class="btn btn-2" data-acasa="${i}">Mandar a casa</button>` : ''}
       <button class="btn btn-2" data-renombrar="equipo:${i}">Cambiar nombre</button>`); }).join('');
    cuerpo += `<p class="vacio" style="grid-column:1/-1;padding:6px">Tu equipo: ${lista.length} de ${MAX_EQUIPO}. Tu casa y los Centros de Rehabilitación curan a todos.</p>`;
  } else if(t === 'casa'){
    cuerpo = S.reserva.length ? S.reserva.map((c, i) => { nombres.push(c.nombre + (c.shiny ? ' ✦' : '')); return tarjetaCriatura(comoLuchador(c),
      `<button class="btn" data-alequipo="${i}" ${S.equipo.length >= MAX_EQUIPO ? 'disabled' : ''}>${S.equipo.length >= MAX_EQUIPO ? 'Equipo lleno' : 'Sumar al equipo'}</button>
       <button class="btn btn-2" data-renombrar="casa:${i}">Cambiar nombre</button>`); }).join('')
      : '<div class="vacio">Acá viven las criaturas que no entran en tu equipo.</div>';
  } else if(t === 'medallas'){
    const n = cantMedallas();
    cuerpo = `<div class="item habilidades" style="grid-column:1/-1"><h3>Habilidades de campo</h3>${Object.values(HABILIDADES).map(h => `<p class="${tieneHab(Object.keys(HABILIDADES).find(k => HABILIDADES[k] === h)) ? 'hab-si' : 'hab-no'}"><b>${h.nom}</b> · ${h.desc} <small>(${MEDALLAS.find(m => m.id === h.medalla).nom})</small></p>`).join('')}</div>`
      + `<p class="vacio" style="grid-column:1/-1;padding:4px">${n === MEDALLAS.length ? '¡Tenés las ocho! Te esperan la Cumbre Suprema y las leyendas.' : `Medallas: ${n} de ${MEDALLAS.length}`}</p>` + MEDALLAS.map(m => {
      const L = Object.values(LIDERES).find(l => l.medalla === m.id), tiene = S.medallas[m.id];
      return `<div class="item album"><span class="cr-album" style="display:grid;place-items:center">${svgMedalla(m, 96, !tiene)}</span>
        <h3>${m.nom}</h3><span class="chip-tipo" style="background:${TIPOS[m.tipo].color}">${TIPOS[m.tipo].nom}</span>
        <p>${tiene ? `Se la ganaste a ${L.nombre} en ${m.ciudad}.` : `La da ${L.nombre}, líder de ${m.ciudad}.`}</p></div>`;
    }).join('');
  } else {
    const atrapadas = NORMALES.filter(e => S.album.capt[e]).length, vistas = NORMALES.filter(e => S.album.vistos[e]).length;
    cuerpo = `<p class="vacio" style="grid-column:1/-1;padding:4px">Atrapadas ${atrapadas} de ${NORMALES.length} · Vistas ${vistas} · Legendarias ${LEGENDARIAS.filter(e => S.album.capt[e]).length} de ${LEGENDARIAS.length}</p>` + ORDEN_ALBUM.map((e, i) => {
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
  v.querySelectorAll('[data-renombrar]').forEach(b => b.onclick = () => {
    const [donde, i] = b.dataset.renombrar.split(':'), c = (donde === 'casa' ? S.reserva : S.equipo)[+i];
    if(c) renombrarCriatura(c);
  });
  v.querySelectorAll('[data-alequipo]').forEach(b => b.onclick = () => {
    if(S.equipo.length >= MAX_EQUIPO) return;
    const [c] = S.reserva.splice(+b.dataset.alequipo, 1); S.equipo.push(c); guardar(); pintarEquipo();
  });
}
