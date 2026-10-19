'use strict';
/* =====================================================================
   Mirar duelos ajenos.
   El que mira se suma al canal del duelo y pide el estado. Cualquiera de los
   dos duelistas le contesta con los equipos, la semilla y las jugadas hechas.
   Como resolverTurno es una función pura, el que mira rearma la pelea y
   después sigue cada turno a medida que llegan las jugadas de los dos.
   ===================================================================== */
let MD = null;

// Lo llama el duelista cuando alguien pide mirar.
function contarleAlQueMira(p){
  if(!DU || DU.fin || !DU.canal || !p || !p.de || p.de === usuarioId || p.de === DU.rival.id) return;
  const yo = {id: usuarioId, apodo}, el = {id: DU.rival.id, apodo: DU.rival.apodo};
  const A = DU.lado === 'A' ? yo : el, Bj = DU.lado === 'A' ? el : yo;
  const accA = DU.lado === 'A' ? DU.mias : DU.suyas, accB = DU.lado === 'A' ? DU.suyas : DU.mias;
  DU.canal.send({type: 'broadcast', event: 'estado', payload: {de: usuarioId, para: p.de, seed: DU.seed,
    A: {...A, equipo: DU.eqA}, B: {...Bj, equipo: DU.eqB}, acc: {A: accA, B: accB}}});
}

function mirarDuelo(o){
  if(!o || !o.pelea || !o.pelea.sala) return;
  if(DU || MD || (typeof B !== 'undefined' && B)){ avisar('Ahora no podés mirar'); return; }
  if(typeof salirDelMundo === 'function') salirDelMundo();
  cerrarHoja();
  vista = 'mirando';
  MD = {sala: o.pelea.sala, listo: false, buffer: [], fin: false, ocupado: false};
  $('#app').innerHTML = `<section class="combate"><div class="banda-ent">Buscando el duelo de <b id="md-quien"></b>...</div>
    <div class="panel texto-combate" id="t-combate">Conectando...</div>
    <div class="menu-combate grilla-2" id="menu-combate"><button class="mc-volver" id="md-salir">Volver al mapa</button></div></section>`;
  $('#md-quien').textContent = o.apodo;
  $('#md-salir').onclick = dejarDeMirar;
  const canal = db.channel(MD.sala, {config: {private: true, broadcast: {self: false}}});
  MD.canal = canal;
  canal.on('broadcast', {event: 'estado'}, ({payload}) => { if(MD && !MD.listo && payload.para === usuarioId) arrancarMirada(payload); })
       .on('broadcast', {event: 'accion'}, ({payload}) => { if(!MD) return; if(MD.listo) jugadaVista(payload); else MD.buffer.push(payload); })
       .on('broadcast', {event: 'chau'}, ({payload}) => { if(MD && MD.listo && !MD.fin) seFueDuelista(payload.de); })
       .subscribe(estado => {
         if(estado !== 'SUBSCRIBED' || !MD) return;
         for(const ms of [0, 1200, 2600, 4500]) setTimeout(() => { if(MD && !MD.listo) canal.send({type: 'broadcast', event: 'mirar', payload: {de: usuarioId}}); }, ms);
       });
  setTimeout(() => { if(MD && !MD.listo){ avisar('Ese duelo ya terminó'); dejarDeMirar(); } }, 9000);
}

function dejarDeMirar(){
  if(MD && MD.canal){ const c = MD.canal; setTimeout(() => { try { db.removeChannel(c); } catch(e){} }, 200); }
  MD = null;
  if(vista === 'mirando') pintarMundo();
}

function arrancarMirada(e){
  MD.listo = true;
  MD.seed = e.seed | 0;
  MD.ids = {A: e.A.id, B: e.B.id};
  MD.ap = {A: String(e.A.apodo || '?').slice(0, 16), B: String(e.B.apodo || '?').slice(0, 16)};
  MD.st = {A: armarLado(e.A.equipo), B: armarLado(e.B.equipo)};
  MD.acc = {A: {...(e.acc && e.acc.A)}, B: {...(e.acc && e.acc.B)}};
  for(const p of MD.buffer) guardarJugada(p);
  MD.buffer = [];
  MD.turno = 1;
  // Pone al día la pelea en silencio, sin animaciones.
  while(MD.acc.A[MD.turno] && MD.acc.B[MD.turno]){
    const ev = resolverTurno(MD.st, {A: MD.acc.A[MD.turno], B: MD.acc.B[MD.turno]}, mulberry32(MD.seed + MD.turno * 7919));
    MD.turno++;
    const fin = ev.find(x => x.t === 'fin');
    if(fin){ MD.fin = true; break; }
  }
  pintarMirada();
  if(MD.fin){ mensaje('Ese duelo ya terminó.', 10); return; }
  (async () => {
    MD.ocupado = true;
    await mensaje(`Estás mirando el duelo de ${MD.ap.A} contra ${MD.ap.B}.`, 1400);
    MD.ocupado = false;
    if(MD) mensaje('Esperando las jugadas...', 10);
    seguirMirada();
  })();
}

function guardarJugada(p){
  const lado = p.de === MD.ids.A ? 'A' : p.de === MD.ids.B ? 'B' : null;
  if(!lado || !p.acciones) return;
  for(const k in p.acciones) if(!MD.acc[lado][k]) MD.acc[lado][k] = p.acciones[k];
}
function jugadaVista(p){ guardarJugada(p); seguirMirada(); }

async function seguirMirada(){
  if(!MD || MD.ocupado || MD.fin) return;
  const n = MD.turno, a = MD.acc.A[n], b = MD.acc.B[n];
  if(!a || !b) return;
  MD.ocupado = true;
  const ev = resolverTurno(MD.st, {A: a, B: b}, mulberry32(MD.seed + n * 7919));
  await reproducirMirada(ev);
  if(!MD) return;
  MD.turno++;
  MD.ocupado = false;
  const fin = ev.find(x => x.t === 'fin');
  if(fin) return finMirada(`¡Ganó ${MD.ap[fin.ganador]}!`);
  mensaje('Esperando las jugadas...', 10);
  seguirMirada();
}

const actMd = l => MD.st[l].lista[MD.st[l].i];
const nomMd = l => `${actMd(l).nombre} de ${MD.ap[l]}`;
function pintarMirada(){
  const tema = tipoDominante(MD.st.B.lista);
  $('#app').innerHTML = `
    <section class="combate mirando">
      <div class="banda-ent">👀 <b id="md-a"></b> contra <b id="md-b"></b></div>
      <div class="arena arena-ciudad con-estadio est-${tema}">
        <div class="escena">
          ${estadioHTML(tema)}
          <div class="nube n1"></div><div class="nube n2"></div>
          <div class="plataforma rival"></div><div class="plataforma propio"></div>
          <div class="bicho-combate rival" id="b-rival"></div>
          <div class="bicho-combate propio" id="b-propio"></div>
        </div>
        <div class="ficha-luch rival" id="f-rival"></div>
        <div class="ficha-luch propio" id="f-propio"></div>
      </div>
      <div class="panel texto-combate" id="t-combate" aria-live="polite"></div>
      <div class="menu-combate grilla-2" id="menu-combate"><button class="mc-volver" id="md-salir">Dejar de mirar</button></div>
    </section>`;
  $('#md-a').textContent = MD.ap.A; $('#md-b').textContent = MD.ap.B;
  $('#md-salir').onclick = dejarDeMirar;
  dibujarMirada();
}
function dibujarMirada(){
  $('#b-rival').innerHTML = svgEspecie(actMd('B').esp, {humor: 'bien', shiny: actMd('B').shiny});
  $('#b-propio').innerHTML = svgEspecie(actMd('A').esp, {humor: 'bien', shiny: actMd('A').shiny, vista: 'lado'});
  fichasMirada();
}
function fichasMirada(){
  if(!$('#f-rival')) return;
  const r = actMd('B'), p = actMd('A');
  $('#f-rival').innerHTML = fichaHTML(r, false); $('#f-rival b').textContent = `${r.nombre} (${MD.ap.B})`;
  $('#f-propio').innerHTML = fichaHTML(p, false); $('#f-propio b').textContent = `${p.nombre} (${MD.ap.A})`;
}

async function reproducirMirada(eventos){
  for(let k = 0; k < eventos.length; k++){
    const e = eventos[k];
    if(!MD) return;
    const abajo = e.lado === 'A', idB = abajo ? 'b-propio' : 'b-rival';
    if(e.t === 'usa'){
      await mensaje(`${nomMd(e.lado)} usó ${MOVS[e.mov].nom}.`, 420);
      const sig = eventos[k + 1];
      await animarAtaque(MOVS[e.mov], idB, abajo ? 'b-rival' : 'b-propio', !(sig && sig.t === 'falla'));
    } else if(e.t === 'falla') await mensaje('¡Pero falló!', 800);
    else if(e.t === 'baja') await mensaje(`Le bajó la fuerza a ${nomMd(e.lado)}.`, 900);
    else if(e.t === 'golpe'){
      animar(idB, 'golpeado', 500); numeroDanio(idB, e.danio || 0, e.crit, e.ef);
      if(e.crit || e.ef > 1) sacudirArena(e.crit && e.ef > 1);
      fichasMirada(); await espera(450);
      if(e.crit) await mensaje('¡Golpe crítico!', 700);
      if(e.ef > 1) await mensaje('¡Es muy efectivo!', 700); else if(e.ef < 1) await mensaje('No es muy efectivo...', 700);
    } else if(e.t === 'debil'){
      animar(idB, 'desmayo', 900); await mensaje(`${nomMd(e.lado)} se debilitó.`, 1000);
    } else if(e.t === 'cambio'){
      dibujarMirada(); animar(idB, 'sale', 400);
      await mensaje(`${MD.ap[e.lado]} sacó a ${actMd(e.lado).nombre}.`, 1000);
    } else if(e.t === 'estmsg'){ await mensaje(e.txt.startsWith('¡') ? e.txt : `${nomMd(e.lado)} ${e.txt}.`, 800);
    } else if(e.t === 'autogolpe' || e.t === 'quema'){
      animar(idB, 'golpeado', 400); numeroDanio(idB, e.danio, false, 1); fichasMirada();
      if(e.t === 'quema') await mensaje(`${nomMd(e.lado)} sufre por la quemadura.`, 800); else await espera(400);
    } else if(e.t === 'estado'){ fichasMirada(); await mensaje(`¡${nomMd(e.lado)} ${ESTADOS[e.estado].al}!`, 1000);
    } else if(e.t === 'sinEfecto'){ await mensaje('No hizo efecto.', 800);
    } else if(e.t === 'cura'){
      animar(idB, 'sale', 400); fichasMirada();
      await mensaje(`${nomMd(e.lado)} tomó ${OBJETOS.find(o => o.id === e.obj).nom} y recuperó vida.`, 1100);
    } else if(e.t === 'rinde'){
      await mensaje(`${MD.ap[e.lado]} se rindió.`, 1100);
    }
  }
}

function seFueDuelista(id){
  const lado = id === MD.ids.A ? 'A' : id === MD.ids.B ? 'B' : null; if(!lado) return;
  finMirada(`${MD.ap[lado]} se fue del duelo. Ganó ${MD.ap[lado === 'A' ? 'B' : 'A']}.`);
}
async function finMirada(texto){
  if(!MD || MD.fin) return;
  MD.fin = true;
  await mensaje(texto, 10);
  const m = $('#menu-combate');
  if(m){ m.innerHTML = `<button class="mc-pelear" id="md-volver">Volver al mapa</button>`; $('#md-volver').onclick = dejarDeMirar; }
}
