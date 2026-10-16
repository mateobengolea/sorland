'use strict';
/* =====================================================================
   Equipo, combate por turnos, captura y álbum.
   ===================================================================== */

const MAX_EQUIPO = 5; // capturadas que acompañan al inicial (6 en total)

/* ---------------- Equipo ---------------- */
function inicialComoLuchador(){
  const st = {vida: Math.floor(S.stats.vida), fuerza: Math.floor(S.stats.fuerza), velocidad: Math.floor(S.stats.velocidad)};
  const max = vidaMax(st, S.nivel);
  const hp = S.hpIni == null ? max : Math.min(S.hpIni, max);
  return {ref: 'ini', esp: S.especie, nombre: S.nombre, nivel: S.nivel, stats: st, tipo: ESPECIES_COMBATE[S.especie].tipo, hp, max};
}
function capturadaComoLuchador(c){
  const max = vidaMax(c.stats, c.nivel);
  return {ref: c, esp: c.esp, nombre: c.nombre, nivel: c.nivel, stats: c.stats, tipo: tipoDe(c.esp), hp: c.hp == null ? max : Math.min(c.hp, max), max};
}
function equipoLuchadores(){ return [inicialComoLuchador(), ...S.equipo.map(capturadaComoLuchador)]; }
function hayLuchadorEnPie(){ return equipoLuchadores().some(l => l.hp > 0); }
function guardarHp(l){ const v = l.hp >= l.max ? null : l.hp; if(l.ref === 'ini') S.hpIni = v; else l.ref.hp = v; }
function curarEquipo(){ S.hpIni = null; S.equipo.forEach(c => c.hp = null); S.reserva.forEach(c => c.hp = null); }

/* ---------------- Combate ---------------- */
let B = null;
const espera = ms => new Promise(r => setTimeout(r, ms));

function empezarCombate(salvaje, zona){
  vista = 'combate';
  cerrarHoja();
  salvaje.max = salvaje.hp;
  const lista = equipoLuchadores();
  const i = lista.findIndex(l => l.hp > 0);
  lista[0].penal = (S.nec.hambre < 20 || S.nec.energia < 15) ? .8 : 1;
  B = {salvaje, zona, lista, i, ocupado: true, forzado: false, fin: false};
  S.album.vistos[salvaje.esp] = true;
  pintarCombate();
  (async () => {
    await mensaje(`¡Apareció un ${salvaje.nombre} salvaje!`);
    if(salvaje.esp === 'yaguarayo') await mensaje('¡Es rarísimo verlo por acá!');
    await mensaje(`¡Dale, ${activo().nombre}!`);
    if(B.i === 0 && lista[0].penal < 1) await mensaje(`${S.nombre} tiene ${S.nec.hambre < 20 ? 'hambre' : 'sueño'} y va a pelear peor.`);
    B.ocupado = false; menu('principal');
  })();
}
const activo = () => B.lista[B.i];

function pintarCombate(){
  const z = B.zona;
  $('#app').innerHTML = `
    <section class="combate">
      <div class="arena arena-${z}">
        <div class="ficha-luch rival" id="f-rival"></div>
        <div class="bicho-combate rival" id="b-rival"></div>
        <div class="bicho-combate propio" id="b-propio"></div>
        <div class="ficha-luch propio" id="f-propio"></div>
      </div>
      <div class="panel texto-combate" id="t-combate" aria-live="polite"></div>
      <div class="menu-combate" id="menu-combate"></div>
    </section>`;
  $('#b-rival').innerHTML = svgEspecie(B.salvaje.esp, {humor: 'bien'});
  pintarPropio();
  fichas();
}
function pintarPropio(){
  const l = activo();
  $('#b-propio').innerHTML = svgEspecie(l.esp, {humor: 'bien'});
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
  $('#f-rival').innerHTML = fichaHTML(B.salvaje, false); $('#f-rival b').textContent = B.salvaje.nombre;
  $('#f-propio').innerHTML = fichaHTML(activo(), true); $('#f-propio b').textContent = activo().nombre;
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
      B.i = acc.i; pintarPropio(); fichas();
      if(B.forzado){ B.forzado = false; await mensaje(`¡Dale, ${activo().nombre}!`); return; }
      await mensaje(`¡Volvé, ${vuelve}! ¡Dale, ${activo().nombre}!`);
      if(await turnoRival()) return;
    } else if(acc.tipo === 'huir'){
      const prob = Math.max(.25, Math.min(.95, .55 + (yo.stats.velocidad - el.stats.velocidad) * .05));
      if(Math.random() < prob){ await mensaje('¡Escaparon sin problemas!'); return terminarCombate(); }
      await mensaje('¡No pudieron escapar!');
      if(await turnoRival()) return;
    } else if(acc.tipo === 'objeto'){
      const o = OBJETOS.find(x => x.id === acc.obj);
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
  await atacar(el, yo, MOVS[id], false);
  if(yo.hp <= 0){ await propioCaido(); return true; }
  return false;
}

async function atacar(a, d, mov, esPropio){
  const quien = esPropio ? a.nombre : `${a.nombre} salvaje`;
  animar(esPropio ? 'b-propio' : 'b-rival', esPropio ? 'embiste-propio' : 'embiste-rival', 400);
  await mensaje(`${quien} usó ${mov.nom}.`, 700);
  if(Math.random() * 100 >= mov.prec){ await mensaje('¡Pero falló!'); return; }
  if(mov.efecto === 'bajaFuerza'){
    d.modFuerza = Math.max(.5, (d.modFuerza || 1) * .75);
    await mensaje(`Le bajó la fuerza a ${esPropio ? d.nombre + ' salvaje' : d.nombre}.`);
    return;
  }
  const {danio, ef, critico} = calcularDanio(a, d, mov);
  d.hp = Math.max(0, d.hp - danio);
  animar(esPropio ? 'b-rival' : 'b-propio', 'golpeado', 500);
  fichas();
  await espera(350);
  if(critico) await mensaje('¡Golpe crítico!', 750);
  if(ef > 1) await mensaje('¡Es muy efectivo!', 750);
  else if(ef < 1) await mensaje('No es muy efectivo...', 750);
}

async function ganarCombate(){
  const el = B.salvaje, yo = activo();
  B.fin = true;
  animar('b-rival', 'desmayo', 900);
  await mensaje(`${el.nombre} salvaje se debilitó.`);
  const xp = Math.round(el.nivel * 9 + 6), mon = el.nivel * 6;
  await darXP(yo, xp);
  ganar(mon); $('#mon') && ($('#mon').textContent = S.monedas);
  await mensaje(`Ganaste ${mon} monedas.`);
  S.nec.animo = clamp(S.nec.animo + 4);
  terminarCombate();
}

async function darXP(l, xp){
  await mensaje(`${l.nombre} ganó ${xp} de experiencia.`, 800);
  const movsAntes = poderesDe(l.esp, l.nivel);
  if(l.ref === 'ini'){
    const antes = S.nivel;
    sumarXP(xp);
    if(S.nivel > antes){
      l.nivel = S.nivel;
      await mensaje(`¡${l.nombre} subió a nivel ${S.nivel}!`);
      const st = inicialComoLuchador(); l.hp = Math.min(st.max, l.hp + (st.max - l.max)); l.max = st.max;
    }
  } else {
    const c = l.ref; c.xp = (c.xp || 0) + xp;
    let subio = false;
    while(c.xp >= xpPara(c.nivel)){ c.xp -= xpPara(c.nivel); c.nivel++; c.stats.vida += 2; c.stats.fuerza += 1; c.stats.velocidad += 1; subio = true; }
    if(subio){
      const nuevoMax = vidaMax(c.stats, c.nivel);
      l.hp = Math.min(nuevoMax, l.hp + (nuevoMax - l.max)); l.max = nuevoMax; l.nivel = c.nivel;
      await mensaje(`¡${l.nombre} subió a nivel ${c.nivel}!`);
    }
  }
  for(const m of poderesDe(l.esp, l.nivel)) if(!movsAntes.includes(m)) await mensaje(`¡${l.nombre} aprendió ${MOVS[m].nom}!`);
}

async function propioCaido(){
  const yo = activo();
  animar('b-propio', 'desmayo', 900);
  await mensaje(`${yo.nombre} se debilitó.`);
  if(B.lista.some(l => l.hp > 0)){ B.forzado = true; return; }
  B.fin = true;
  const perdida = Math.floor(S.monedas * .1);
  S.monedas -= perdida;
  await mensaje(`Tu equipo quedó agotado. Volvés corriendo a casa${perdida ? ` y se te caen ${perdida} monedas` : ''}.`, 1600);
  B.lista.forEach(guardarHp);
  curarEquipo();
  S.mundo = {...SALIDA_CASA};
  B = null; guardar(); pintarJuego();
}

async function tirarCapsula(o){
  const el = B.salvaje;
  S.inv.objetos[o.id]--;
  await mensaje(`Tiraste una ${o.nom}...`, 600);
  const rival = $('#b-rival'), guardado = rival.innerHTML;
  rival.innerHTML = `<div class="capsula-tirada">${iconoObjeto(o, 90)}</div>`;
  const prob = Math.max(.05, Math.min(.95, SALVAJES[el.esp].captura * (1.3 - el.hp / el.max) * o.captura));
  const exito = Math.random() < prob;
  const sacudidas = exito ? 3 : Math.floor(Math.random() * 3);
  for(let k = 0; k < sacudidas; k++){ await espera(250); animar('b-rival', 'tiembla', 520); await espera(600); }
  if(exito){
    B.fin = true;
    await mensaje(`¡Atrapaste a ${el.nombre}!`, 1300);
    const nueva = {uid: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), esp: el.esp, nombre: el.nombre,
                   nivel: el.nivel, xp: 0, stats: {...el.stats}, hp: el.hp};
    const primera = !S.album.capt[el.esp];
    S.album.capt[el.esp] = (S.album.capt[el.esp] || 0) + 1;
    if(S.equipo.length < MAX_EQUIPO){ S.equipo.push(nueva); await mensaje(`${el.nombre} se sumó a tu equipo.`); }
    else { S.reserva.push(nueva); await mensaje(`Tu equipo está lleno: ${el.nombre} se fue a vivir a tu casa.`); }
    if(primera) await mensaje(`¡${el.nombre} es nuevo en tu álbum!`);
    sumarXP(5);
    terminarCombate();
    return true;
  }
  rival.innerHTML = guardado;
  animar('b-rival', 'sale', 400);
  await mensaje(sacudidas === 0 ? `¡${el.nombre} se escapó enseguida!` : sacudidas === 1 ? '¡Uy, casi!' : '¡Le faltó tan poquito!');
  return false;
}

function terminarCombate(){
  if(!B) return;
  B.lista.forEach(guardarHp);
  S.nec.energia = clamp(S.nec.energia - 4);
  S.nec.hambre = clamp(S.nec.hambre - 3);
  B = null;
  guardar();
  setTimeout(() => pintarMundo(), 300);
}

/* ---------------- Hoja de equipo, casa y álbum ---------------- */
function abrirEquipo(tab){
  if(tab) pestana.equipo = tab;
  hojaActual = 'equipo';
  let velo = $('#velo');
  if(!velo){
    velo = document.createElement('div'); velo.id = 'velo'; velo.className = 'velo';
    velo.onclick = e => { if(e.target === velo) cerrarHoja(); };
    document.body.appendChild(velo);
  }
  pintarEquipo();
}
function tarjetaCriatura(l, acciones){
  const pct = l.hp / l.max * 100;
  return `<div class="item criatura">
    <div class="cr-cab"><span class="cr-mini">${svgEspecie(l.esp, {humor: l.hp > 0 ? 'feliz' : 'mal'})}</span>
      <span class="cr-txt"><h3 class="cr-nom"></h3><small>Nv ${l.nivel} <span class="chip-tipo" style="background:${TIPOS[l.tipo].color}">${TIPOS[l.tipo].nom}</span></small></span></div>
    <div class="barra"><i style="width:${pct}%;background:${pct > 50 ? 'var(--verde)' : pct > 20 ? 'var(--ambar)' : 'var(--rojo)'}"></i></div>
    <p>Vida ${l.hp}/${l.max} · Fuerza ${l.stats.fuerza} · Velocidad ${l.stats.velocidad}</p>
    <p><b>Poderes:</b> ${poderesDe(l.esp, l.nivel).map(m => MOVS[m].nom).join(', ')}</p>
    ${acciones}</div>`;
}
function pintarEquipo(){
  const v = $('#velo'); if(!v) return;
  const t = pestana.equipo || 'equipo';
  const tabs = [['equipo', 'Equipo'], ['casa', 'En casa'], ['album', 'Álbum']];
  let cuerpo = '';
  const jarabe = OBJETOS.filter(o => o.cura).find(o => S.inv.objetos[o.id] > 0);
  if(t === 'equipo'){
    const lista = equipoLuchadores();
    cuerpo = lista.map((l, i) => tarjetaCriatura(l,
      `${l.hp < l.max && jarabe ? `<button class="btn" data-jarabe="${i}">Darle ${jarabe.nom}</button>` : ''}
       ${i > 0 ? `<button class="btn btn-2" data-acasa="${i - 1}">Mandar a casa</button>` : '<span class="etiqueta" style="margin-top:4px">Tu compañero</span>'}`)).join('');
    cuerpo += `<p class="vacio" style="grid-column:1/-1;padding:6px">Tu equipo: ${lista.length} de ${MAX_EQUIPO + 1}. Entrar a tu casa cura a todos.</p>`;
  } else if(t === 'casa'){
    cuerpo = S.reserva.length ? S.reserva.map((c, i) => tarjetaCriatura(capturadaComoLuchador(c),
      `<button class="btn" data-alequipo="${i}" ${S.equipo.length >= MAX_EQUIPO ? 'disabled' : ''}>${S.equipo.length >= MAX_EQUIPO ? 'Equipo lleno' : 'Sumar al equipo'}</button>`)).join('')
      : '<div class="vacio">Acá viven las criaturas que no entran en tu equipo.</div>';
  } else {
    const ids = Object.keys(SALVAJES), atrapadas = ids.filter(e => S.album.capt[e]).length;
    cuerpo = `<p class="vacio" style="grid-column:1/-1;padding:4px">Atrapadas: ${atrapadas} de ${ids.length}</p>` + ids.map(e => {
      const sp = SALVAJES[e], capt = S.album.capt[e], visto = S.album.vistos[e];
      if(!visto) return `<div class="item album"><span class="cr-album" style="filter:brightness(0);opacity:.12">${svgEspecie(e)}</span><h3>???</h3><p>Todavía no la viste.</p></div>`;
      return `<div class="item album"><span class="cr-album" ${capt ? '' : 'style="filter:brightness(0);opacity:.3"'}>${svgEspecie(e, {humor: 'feliz'})}</span>
        <h3>${sp.nombre}</h3><span class="chip-tipo" style="background:${TIPOS[sp.tipo].color}">${TIPOS[sp.tipo].nom}</span>
        <p>${capt ? sp.desc : 'La viste, pero todavía no la atrapaste.'}</p>
        ${capt ? `<p><b>Poderes:</b> ${[...new Set(sp.aprende.map(([, m]) => MOVS[m].nom))].join(', ')}</p>` : ''}</div>`;
    }).join('');
  }
  v.innerHTML = `<div class="hoja" role="dialog" aria-label="Equipo"><div class="hoja-cab"><h2>Criaturas</h2><button class="cerrar" aria-label="Cerrar">×</button></div>
    <div class="pestanas" role="tablist">${tabs.map(([k, n]) => `<button role="tab" data-tab="${k}" aria-selected="${t === k}">${n}</button>`).join('')}</div>
    <div class="grilla">${cuerpo}</div></div>`;
  if(t === 'equipo') v.querySelectorAll('.cr-nom').forEach((h, i) => h.textContent = equipoLuchadores()[i].nombre);
  if(t === 'casa') v.querySelectorAll('.cr-nom').forEach((h, i) => h.textContent = S.reserva[i].nombre);
  v.querySelector('.cerrar').onclick = cerrarHoja;
  v.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { pestana.equipo = b.dataset.tab; pintarEquipo(); });
  v.querySelectorAll('[data-jarabe]').forEach(b => b.onclick = () => {
    const l = equipoLuchadores()[+b.dataset.jarabe];
    S.inv.objetos[jarabe.id]--; l.hp = Math.min(l.max, l.hp + jarabe.cura); guardarHp(l);
    guardar(); avisar(`${l.nombre} recuperó vida`); pintarEquipo();
  });
  v.querySelectorAll('[data-acasa]').forEach(b => b.onclick = () => {
    const [c] = S.equipo.splice(+b.dataset.acasa, 1); S.reserva.push(c); guardar(); pintarEquipo();
  });
  v.querySelectorAll('[data-alequipo]').forEach(b => b.onclick = () => {
    if(S.equipo.length >= MAX_EQUIPO) return;
    const [c] = S.reserva.splice(+b.dataset.alequipo, 1); S.equipo.push(c); guardar(); pintarEquipo();
  });
}
