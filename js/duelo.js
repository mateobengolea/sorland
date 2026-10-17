'use strict';
/* =====================================================================
   Duelos entre jugadores.
   Los dos navegadores resuelven cada turno con la misma semilla, así
   que el resultado sale idéntico en ambos sin un servidor de por medio.
   ===================================================================== */

let DU = null;

function mulberry32(a){ return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
// Los pedidos de duelo van por el canal global: así se puede invitar a un amigo que está en otro mapa.
function enviarMapa(payload){ const c = (typeof ONG !== 'undefined' && ONG.canal && ONG.listo) ? ONG.canal : ON.canal; if(c) c.send({type: 'broadcast', event: 'duelo', payload: {...payload, de: usuarioId, apodo}}); }
const puedeDuelo = () => (vista === 'mundo' || (vista === 'casa' && S.mundo)) && !DU && !(MW && MW.dlg);

const POR_DUELO = 3;
function todasMisCriaturas(){ return [...S.equipo, ...S.reserva]; }
function paraDuelo(c){ return {esp: c.esp, nombre: String(c.nombre).slice(0, 16), nivel: c.nivel, stats: {...c.stats}, tipo: tipoDe(c.esp), shiny: !!c.shiny, extra: (c.extra || []).slice(0, 1)}; }
// Si no llegás a elegir a tiempo, van las 3 de más nivel.
function equipoDuelo(){
  return [...todasMisCriaturas()].sort((a, b) => b.nivel - a.nivel).slice(0, POR_DUELO).map(paraDuelo);
}

/* ---------------- Elegir las 3 criaturas del duelo ---------------- */
// Devuelve la lista elegida (en orden de salida), o null si cancelás.
function elegirParaDuelo(rival, segundos, alVencer){
  return new Promise(res => {
    hojaActual = 'elegir-duelo';
    const v = nuevoVelo(false);
    const todas = todasMisCriaturas(), meta = Math.min(POR_DUELO, todas.length);
    const elegidas = [];
    let quedan = segundos, cerrado = false;
    const terminar = lista => { if(cerrado) return; cerrado = true; clearInterval(reloj); cerrarHoja(); res(lista); };
    const pintar = () => {
      v.innerHTML = `<div class="hoja hoja-elegir" role="dialog" aria-label="Elegí tus criaturas">
        <div class="hoja-cab"><h2>Elegí ${meta} para el duelo</h2><span class="reloj-duelo" id="ed-reloj">${quedan}s</span></div>
        <p class="rotulo-chico">Contra <b id="ed-rival"></b>. Tocá en el orden en que van a salir: la 1 arranca la pelea. Todas pelean con la vida llena.</p>
        <div class="grilla-elegir">${todas.map((c, i) => {
          const n = elegidas.indexOf(i);
          return `<button class="elegible${n >= 0 ? ' elegida' : ''}${c.shiny ? ' es-shiny' : ''}" data-i="${i}" style="--tipo:${TIPOS[tipoDe(c.esp)].color}">
            ${n >= 0 ? `<span class="orden">${n + 1}</span>` : ''}
            <span class="el-img">${svgEspecie(c.esp, {humor: 'feliz', shiny: c.shiny})}</span>
            <b data-nom="${i}"></b><small>Nv ${c.nivel} · ${TIPOS[tipoDe(c.esp)].nom}</small></button>`;
        }).join('')}</div>
        <div class="acciones-jugador">
          <button class="grande" id="ed-listo" ${elegidas.length < meta ? 'disabled' : ''}>${elegidas.length < meta ? `Elegí ${meta - elegidas.length} más` : '¡A pelear!'}</button>
          <button class="btn btn-2" id="ed-cancelar">Cancelar</button></div></div>`;
      v.querySelector('#ed-rival').textContent = rival;
      todas.forEach((c, i) => { v.querySelector(`[data-nom="${i}"]`).textContent = c.nombre + (c.shiny ? ' ✦' : ''); });
      v.querySelectorAll('[data-i]').forEach(b => b.onclick = () => {
        const i = +b.dataset.i, n = elegidas.indexOf(i);
        if(n >= 0) elegidas.splice(n, 1); else if(elegidas.length < meta) elegidas.push(i);
        pintar();
      });
      v.querySelector('#ed-listo').onclick = () => { if(elegidas.length >= meta) terminar(elegidas.map(i => paraDuelo(todas[i]))); };
      v.querySelector('#ed-cancelar').onclick = () => terminar(null);
    };
    pintar();
    const reloj = setInterval(() => {
      quedan--;
      const r = document.getElementById('ed-reloj'); if(r){ r.textContent = quedan + 's'; r.classList.toggle('apurado', quedan <= 5); }
      if(quedan <= 0){
        // Se acabó el tiempo: completa con las de más nivel que falten.
        if(!alVencer) return terminar(null);
        const resto = todas.map((c, i) => i).filter(i => !elegidas.includes(i)).sort((a, b) => todas[b].nivel - todas[a].nivel);
        while(elegidas.length < meta && resto.length) elegidas.push(resto.shift());
        terminar(elegidas.map(i => paraDuelo(todas[i])));
      }
    }, 1000);
  });
}
function armarLado(equipo){
  const lista = (equipo || []).slice(0, POR_DUELO).map(c => {
    const nivel = Math.max(1, Math.min(100, c.nivel | 0));
    const stats = {vida: Math.min(999, c.stats.vida | 0), fuerza: Math.min(999, c.stats.fuerza | 0), velocidad: Math.min(999, c.stats.velocidad | 0)};
    const max = vidaMax(stats, nivel);
    if(!ESPECIES[c.esp]) c.esp = 'carosor';
    const extra = (Array.isArray(c.extra) ? c.extra : []).filter(m => MOVS[m] && MOVS[m].lider).slice(0, 1);
    return {esp: c.esp, nombre: c.nombre, nivel, stats, tipo: tipoDe(c.esp), shiny: !!c.shiny, extra, hp: max, max, modFuerza: 1};
  });
  return {lista, i: 0};
}

/* ---------------- Pedidos ---------------- */
async function pedirDuelo(o){
  if(DU){ avisar('Ya estás en un duelo'); return; }
  if(ON.pedido){ avisar('Esperá la respuesta de tu otro pedido'); return; }
  const equipo = await elegirParaDuelo(o.apodo, 60, false);
  if(!equipo) return;
  if(DU || ON.pedido) return;
  ON.pedido = {para: o.id, apodo: o.apodo, equipo};
  enviarMapa({tipo: 'pedido', para: o.id, nivel: nivelEntrenador()});
  avisar(`Le pediste un duelo a ${o.apodo}. Esperando respuesta...`);
  esperarRespuesta(o.id, o.apodo, 25000);
}
function esperarRespuesta(id, quien, ms){
  clearTimeout(ON.timerPedido);
  ON.timerPedido = setTimeout(() => { if(ON.pedido && ON.pedido.para === id){ ON.pedido = null; avisar(`${quien} no respondió`); } }, ms);
}

function recibirDuelo(p){
  if(p.tipo === 'pedido'){
    const hojaLibre = !$('#velo') || ['amigos', 'online', 'ranking', 'perfil', 'mochila', 'tienda'].includes(hojaActual);
    if(!puedeDuelo() || !hojaLibre){ enviarMapa({tipo: 'rechazo', para: p.de, motivo: 'ocupado'}); return; }
    cerrarHoja();
    mostrarPedido(p);
  } else if(p.tipo === 'acepta'){
    if(!ON.pedido || ON.pedido.para !== p.de) return;
    const propio = ON.pedido.equipo || equipoDuelo();
    ON.pedido = null; clearTimeout(ON.timerPedido);
    if(!puedeDuelo()){ enviarMapa({tipo: 'cancelado', para: p.de}); avisar('No pudiste arrancar el duelo porque estabas ocupado'); return; }
    DU = {lado: 'A', sala: p.sala, seed: p.seed | 0, rival: {id: p.de, apodo: p.apodo}};
    for(const ms of [0, 700, 1500, 2600]) setTimeout(() => enviarMapa({tipo: 'inicio', para: p.de, sala: p.sala, equipo: propio}), ms);
    empezarDuelo(propio, p.equipo);
  } else if(p.tipo === 'eligiendo'){
    if(!ON.pedido || ON.pedido.para !== p.de) return;
    avisar(`${p.apodo} aceptó y está eligiendo sus criaturas...`);
    esperarRespuesta(p.de, p.apodo, 45000);
  } else if(p.tipo === 'inicio'){
    if(!DU || !DU.esperandoInicio || DU.sala !== p.sala) return;
    DU.esperandoInicio = false;
    empezarDuelo(p.equipo, DU.equipoPropio);
  } else if(p.tipo === 'cancelado'){
    if(DU && DU.esperandoInicio && DU.rival.id === p.de){ DU = null; avisar(`${p.apodo} no pudo arrancar el duelo`); }
  } else if(p.tipo === 'rechazo'){
    if(!ON.pedido || ON.pedido.para !== p.de) return;
    ON.pedido = null; clearTimeout(ON.timerPedido);
    avisar(p.motivo === 'ocupado' ? `${p.apodo} está ocupado ahora` : `${p.apodo} no quiso pelear`);
  }
}

function mostrarPedido(p){
  hojaActual = 'pedido-duelo';
  let velo = $('#velo');
  if(!velo){ velo = document.createElement('div'); velo.id = 'velo'; velo.className = 'velo'; document.body.appendChild(velo); }
  velo.onclick = null;
  velo.innerHTML = `<div class="hoja" role="dialog" aria-label="Pedido de duelo">
    <div class="hoja-cab"><h2>¡Te desafían!</h2></div>
    <p class="pedido-txt"><b id="pd-nom"></b> (nivel ${p.nivel | 0})${typeof esAmigo === 'function' && esAmigo(p.de) ? ', tu amigo,' : ''} quiere pelear un duelo con vos.</p>
    <p class="rotulo-chico">Duelo 3 contra 3: si aceptás, elegís tus 3 criaturas. Arrancan con toda la vida, no se usan objetos y tu equipo no se cansa.</p>
    <div class="acciones-jugador"><button class="grande" id="pd-si">Aceptar</button><button class="btn btn-2" id="pd-no">Ahora no</button></div></div>`;
  $('#pd-nom').textContent = p.apodo;
  let respondido = false;
  const responder = async si => {
    if(respondido) return; respondido = true; cerrarHoja();
    if(!si){ enviarMapa({tipo: 'rechazo', para: p.de}); return; }
    enviarMapa({tipo: 'eligiendo', para: p.de});
    const equipo = await elegirParaDuelo(p.apodo, 30, true);
    if(!equipo || !puedeDuelo()){ enviarMapa({tipo: 'rechazo', para: p.de}); return; }
    const sala = 'sl:duelo:' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    const seed = Math.floor(Math.random() * 2147483647);
    DU = {lado: 'B', sala, seed, rival: {id: p.de, apodo: p.apodo}, equipoPropio: equipo, esperandoInicio: true};
    enviarMapa({tipo: 'acepta', para: p.de, sala, seed, equipo});
    avisar('Preparando el duelo...');
    setTimeout(() => { if(DU && DU.esperandoInicio && DU.sala === sala){ DU = null; avisar('No se pudo arrancar el duelo. Probá de nuevo.'); } }, 10000);
  };
  $('#pd-si').onclick = () => responder(true);
  $('#pd-no').onclick = () => responder(false);
  setTimeout(() => responder(false), 20000);
}

/* ---------------- Duelo ---------------- */
function empezarDuelo(equipoA, equipoB){
  if(!DU) return;
  if(typeof salirDelMundo === 'function') salirDelMundo();
  cerrarHoja();
  vista = 'duelo';
  Object.assign(DU, {st: {A: armarLado(equipoA), B: armarLado(equipoB)}, turno: 1, mias: {}, suyas: {}, ocupado: false, fin: false,
                     ultimaActividad: Date.now()});
  DU.otro = DU.lado === 'A' ? 'B' : 'A';
  if(typeof registrarDuelo === 'function') registrarDuelo(DU.sala, DU.rival.id);
  if(typeof marcarPelea === 'function') marcarPelea('duelo', DU.rival.apodo);
  const canal = db.channel(DU.sala, {config: {private: true, broadcast: {self: false}}});
  DU.canal = canal;
  canal.on('broadcast', {event: 'accion'}, ({payload}) => recibirAccion(payload))
       .on('broadcast', {event: 'chau'}, ({payload}) => { if(DU && payload.de === DU.rival.id && !DU.fin && !DU.ocupado) rivalSeFue(); })
       .subscribe();
  DU.reenvio = setInterval(reenviar, 2500);
  pintarDuelo();
  (async () => {
    DU.ocupado = true;
    await mensaje(`¡Duelo contra ${DU.rival.apodo}!`, 1100);
    await mensaje(`${DU.rival.apodo} sacó a ${actDu(DU.otro).nombre}. ¡Dale, ${actDu(DU.lado).nombre}!`, 1200);
    DU.ocupado = false;
    menuDuelo('principal');
    intentarResolver();
  })();
}
const actDu = lado => DU.st[lado].lista[DU.st[lado].i];
function nomDu(lado){ const l = actDu(lado); return lado === DU.lado ? l.nombre : `${l.nombre} de ${DU.rival.apodo}`; }

function pintarDuelo(){
  $('#app').innerHTML = `
    <section class="combate">
      <div class="banda-ent">Duelo contra <b id="du-rival"></b> <span id="cuenta-rivales"></span></div>
      <div class="arena arena-ciudad">
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
  $('#du-rival').textContent = DU.rival.apodo;
  dibujarBichosDuelo();
}
function dibujarBichosDuelo(){
  $('#b-rival').innerHTML = svgEspecie(actDu(DU.otro).esp, {humor: 'bien', shiny: actDu(DU.otro).shiny});
  $('#b-propio').innerHTML = svgEspecie(actDu(DU.lado).esp, {humor: 'bien', shiny: actDu(DU.lado).shiny});
  fichasDuelo();
}
function fichasDuelo(){
  if(!$('#f-rival')) return;
  const r = actDu(DU.otro), p = actDu(DU.lado);
  $('#f-rival').innerHTML = fichaHTML(r, false); $('#f-rival b').textContent = r.nombre;
  $('#f-propio').innerHTML = fichaHTML(p, true); $('#f-propio b').textContent = p.nombre;
  $('#cuenta-rivales').innerHTML = DU.st[DU.otro].lista.map(x => `<i class="pip ${x.hp > 0 ? '' : 'caido'}"></i>`).join('');
}

function menuDuelo(tipo){
  const m = $('#menu-combate'); if(!m || !DU || DU.fin) return;
  const yo = actDu(DU.lado);
  m.className = 'menu-combate grilla-2';
  if(tipo === 'principal'){
    $('#t-combate').textContent = `¿Qué hace ${yo.nombre}?`;
    m.innerHTML = `<button class="mc-pelear" data-a="pelear">Pelear</button><button data-a="equipo">Equipo</button>
                   <button class="mc-volver" data-a="rendirse">Rendirse</button>`;
    m.querySelector('[data-a=pelear]').onclick = () => menuDuelo('pelear');
    m.querySelector('[data-a=equipo]').onclick = () => menuDuelo('equipo');
    m.querySelector('[data-a=rendirse]').onclick = () => menuDuelo('rendirse');
  } else if(tipo === 'pelear'){
    const rival = actDu(DU.otro);
    m.innerHTML = poderesDe(yo.esp, yo.nivel, yo.extra).map(id => {
      const mv = MOVS[id], ef = mv.poder ? efectividad(mv.tipo, rival.tipo) : 1;
      return `<button data-m="${id}" class="mc-mov" style="--tipo:${TIPOS[mv.tipo].color}"><b>${mv.nom}</b><small>${TIPOS[mv.tipo].nom} · ${mv.poder ? 'Poder ' + mv.poder : 'Especial'}${ef > 1 ? ' · ¡Efectivo!' : ef < 1 ? ' · Poco efectivo' : ''}</small></button>`;
    }).join('') + `<button class="mc-volver" data-v>Volver</button>`;
    m.querySelectorAll('[data-m]').forEach(b => b.onclick = () => elegirDuelo({tipo: 'atacar', mov: b.dataset.m}));
    m.querySelector('[data-v]').onclick = () => menuDuelo('principal');
  } else if(tipo === 'equipo'){
    m.className = 'menu-combate lista';
    const lado = DU.st[DU.lado];
    m.innerHTML = lado.lista.map((x, i) => `<button data-i="${i}" class="mc-eq" ${x.hp <= 0 || i === lado.i ? 'disabled' : ''}>
        <span class="mc-mini">${svgEspecie(x.esp, {humor: x.hp > 0 ? 'bien' : 'mal'})}</span>
        <span class="mc-eq-txt"><b></b><small>Nv ${x.nivel} · ${x.hp <= 0 ? 'Debilitado' : x.hp + '/' + x.max}${i === lado.i ? ' · Peleando' : ''}</small></span></button>`).join('')
      + `<button class="mc-volver" data-v>Volver</button>`;
    m.querySelectorAll('[data-i]').forEach((b, k) => { b.querySelector('b').textContent = lado.lista[k].nombre; b.onclick = () => elegirDuelo({tipo: 'cambio', i: +b.dataset.i}); });
    m.querySelector('[data-v]').onclick = () => menuDuelo('principal');
  } else if(tipo === 'rendirse'){
    $('#t-combate').textContent = '¿Seguro que te rendís?';
    m.innerHTML = `<button data-s class="mc-pelear">Sí, me rindo</button><button data-v>No, sigo</button>`;
    m.querySelector('[data-s]').onclick = () => elegirDuelo({tipo: 'rendirse'});
    m.querySelector('[data-v]').onclick = () => menuDuelo('principal');
  } else if(tipo === 'esperando'){
    $('#t-combate').textContent = `Esperando a ${DU.rival.apodo}...`;
    m.innerHTML = '';
    clearTimeout(DU.timerAbandono);
    DU.timerAbandono = setTimeout(() => {
      if(!DU || DU.fin || !DU.mias[DU.turno] || DU.suyas[DU.turno]) return;
      $('#t-combate').textContent = `${DU.rival.apodo} no responde hace un rato.`;
      m.innerHTML = `<button class="mc-pelear" data-g>Dar el duelo por ganado</button><button data-e>Seguir esperando</button>`;
      m.querySelector('[data-g]').onclick = () => terminarDuelo(DU.lado, 'abandono');
      m.querySelector('[data-e]').onclick = () => menuDuelo('esperando');
    }, 60000);
  }
}

function elegirDuelo(acc){
  if(!DU || DU.fin || DU.ocupado || DU.mias[DU.turno]) return;
  DU.mias[DU.turno] = acc;
  reenviar();
  menuDuelo('esperando');
  intentarResolver();
}
function reenviar(){
  if(!DU || !DU.canal || DU.fin) return;
  const n = DU.turno, acciones = {};
  if(DU.mias[n - 1]) acciones[n - 1] = DU.mias[n - 1];
  if(DU.mias[n]) acciones[n] = DU.mias[n];
  if(Object.keys(acciones).length) DU.canal.send({type: 'broadcast', event: 'accion', payload: {de: usuarioId, acciones}});
}
function recibirAccion(p){
  if(!DU || p.de !== DU.rival.id) return;
  for(const k in p.acciones) if(!DU.suyas[k]) DU.suyas[k] = p.acciones[k];
  DU.ultimaActividad = Date.now();
  intentarResolver();
}

async function intentarResolver(){
  if(!DU || DU.ocupado || DU.fin) return;
  const n = DU.turno;
  if(!DU.mias[n] || !DU.suyas[n]) return;
  DU.ocupado = true;
  clearTimeout(DU.timerAbandono);
  const acc = DU.lado === 'A' ? {A: DU.mias[n], B: DU.suyas[n]} : {A: DU.suyas[n], B: DU.mias[n]};
  const eventos = resolverTurno(DU.st, acc, mulberry32(DU.seed + n * 7919));
  await reproducir(eventos);
  if(!DU) return;
  DU.turno++;
  DU.ocupado = false;
  const fin = eventos.find(e => e.t === 'fin');
  if(fin) return terminarDuelo(fin.ganador);
  menuDuelo('principal');
  reenviar();
  intentarResolver();
}

// Resuelve un turno. Es una función pura: misma entrada y misma semilla, mismo resultado.
function resolverTurno(st, acc, rnd){
  const ev = [], otro = l => l === 'A' ? 'B' : 'A';
  for(const l of ['A', 'B']) if(acc[l].tipo === 'rendirse'){ ev.push({t: 'rinde', lado: l}, {t: 'fin', ganador: otro(l)}); return ev; }
  for(const l of ['A', 'B']){
    const a = acc[l];
    if(a.tipo === 'cambio'){
      const dest = st[l].lista[a.i | 0];
      if(dest && dest.hp > 0 && (a.i | 0) !== st[l].i){ st[l].i = a.i | 0; ev.push({t: 'cambio', lado: l, i: st[l].i}); }
    }
  }
  const atacan = ['A', 'B'].filter(l => acc[l].tipo === 'atacar').map(l => ({l, i: st[l].i}));
  const vel = x => st[x.l].lista[x.i].stats.velocidad;
  atacan.sort((x, y) => vel(y) - vel(x) || 0);
  if(atacan.length === 2 && vel(atacan[0]) === vel(atacan[1]) && rnd() < .5) atacan.reverse();
  for(const {l, i} of atacan){
    const a = st[l].lista[i];
    if(st[l].i !== i || a.hp <= 0) continue;
    const dl = otro(l), d = st[dl].lista[st[dl].i];
    const permitidos = poderesDe(a.esp, a.nivel, a.extra);
    const id = permitidos.includes(acc[l].mov) ? acc[l].mov : permitidos[0];
    const mov = MOVS[id];
    ev.push({t: 'usa', lado: l, mov: id});
    if(rnd() * 100 >= mov.prec){ ev.push({t: 'falla'}); continue; }
    if(mov.efecto === 'bajaFuerza'){ d.modFuerza = Math.max(.5, (d.modFuerza || 1) * .75); ev.push({t: 'baja', lado: dl}); continue; }
    const r = calcularDanio(a, d, mov, rnd);
    d.hp = Math.max(0, d.hp - r.danio);
    ev.push({t: 'golpe', lado: dl, hp: d.hp, ef: r.ef, crit: r.critico, danio: r.danio});
    if(d.hp <= 0){
      ev.push({t: 'debil', lado: dl});
      const sig = st[dl].lista.findIndex(x => x.hp > 0);
      if(sig < 0){ ev.push({t: 'fin', ganador: l}); return ev; }
      st[dl].i = sig; ev.push({t: 'cambio', lado: dl, i: sig, auto: true});
    }
  }
  return ev;
}

async function reproducir(eventos){
  for(let k = 0; k < eventos.length; k++){
    const e = eventos[k];
    if(!DU) return;
    const mio = e.lado === DU.lado, idB = mio ? 'b-propio' : 'b-rival';
    if(e.t === 'usa'){
      await mensaje(`${nomDu(e.lado)} usó ${MOVS[e.mov].nom}.`, 420);
      const sig = eventos[k + 1];
      await animarAtaque(MOVS[e.mov], idB, mio ? 'b-rival' : 'b-propio', !(sig && sig.t === 'falla'));
    } else if(e.t === 'falla') await mensaje('¡Pero falló!', 800);
    else if(e.t === 'baja') await mensaje(`Le bajó la fuerza a ${nomDu(e.lado)}.`, 900);
    else if(e.t === 'golpe'){
      animar(idB, 'golpeado', 500); numeroDanio(idB, e.danio || 0, e.crit, e.ef);
      if(e.crit || e.ef > 1) sacudirArena(e.crit && e.ef > 1);
      fichasDuelo(); await espera(450);
      if(e.crit) await mensaje('¡Golpe crítico!', 700);
      if(e.ef > 1) await mensaje('¡Es muy efectivo!', 700); else if(e.ef < 1) await mensaje('No es muy efectivo...', 700);
    } else if(e.t === 'debil'){
      animar(idB, 'desmayo', 900); await mensaje(`${nomDu(e.lado)} se debilitó.`, 1000);
    } else if(e.t === 'cambio'){
      dibujarBichosDuelo(); animar(idB, 'sale', 400);
      await mensaje(mio ? `¡Dale, ${actDu(e.lado).nombre}!` : `${DU.rival.apodo} sacó a ${actDu(e.lado).nombre}.`, 1000);
    } else if(e.t === 'rinde'){
      await mensaje(mio ? 'Te rendiste.' : `${DU.rival.apodo} se rindió.`, 1100);
    }
  }
}

function rivalSeFue(){ if(DU && !DU.fin) terminarDuelo(DU.lado, 'abandono'); }

async function terminarDuelo(ganador, motivo){
  if(!DU || DU.fin) return;
  DU.fin = true;
  clearInterval(DU.reenvio); clearTimeout(DU.timerAbandono);
  const gane = ganador === DU.lado, rival = DU.rival.apodo;
  if(!S.duelos) S.duelos = {ganados: 0, perdidos: 0};
  const m = $('#menu-combate'); if(m) m.innerHTML = '';
  if(gane){
    S.duelos.ganados++;
    const premio = motivo === 'abandono' ? 0 : 100;
    ganar(premio);
    await mensaje(motivo === 'abandono' ? `${rival} se fue del duelo. Ganaste.` : `¡Le ganaste el duelo a ${rival}!${premio ? ` Ganaste ${premio} monedas.` : ''}`, 1800);
  } else {
    S.duelos.perdidos++;
    ganar(20);
    await mensaje(`${rival} ganó el duelo. Por la buena pelea te llevás 20 monedas.`, 1800);
  }
  const canal = DU.canal, sala = DU.sala, rivalId = DU.rival.id;
  setTimeout(() => { try { db.removeChannel(canal); } catch(e){} }, 1500);
  if(typeof reportarDuelo === 'function'){
    const antes = RK.ficha ? RK.ficha.puntos : null;
    reportarDuelo(sala, gane ? usuarioId : rivalId).then(async r => {
      if(!r) return;
      if(r.estado === 'listo'){
        const f = await actualizarFicha(true);
        const d = r.delta | 0;
        if(!d) avisar('Duelo repetido contra el mismo rival: hoy ya no suma puntos de ranking.');
        else {
          const subio = f && antes != null && rangoDe(f.puntos).id !== rangoDe(antes).id;
          avisar(`Ranking: ${gane ? '+' : '−'}${d} puntos${f ? ` (${f.puntos})` : ''}`, subio ? 'nivel' : '');
          if(subio) setTimeout(() => avisar(`¡${gane ? 'Subiste' : 'Bajaste'} a ${rangoDe(f.puntos).nom}!`, 'nivel'), 900);
        }
      } else if(r.estado === 'pendiente') avisar('El resultado se va a sumar al ranking en unos minutos.');
      else if(r.estado === 'conflicto') avisar('Este duelo no cuenta para el ranking (los resultados no coincidieron).');
    });
  }
  DU = null;
  guardar();
  pintarMundo();
}

// Si cerrás la pestaña en medio de un duelo, el otro jugador se entera y gana.
window.addEventListener('pagehide', () => {
  if(DU && DU.canal && !DU.fin){ try { DU.canal.send({type: 'broadcast', event: 'chau', payload: {de: usuarioId}}); } catch(e){} }
});
