'use strict';
/* =====================================================================
   Amigos: perfil de jugadores, solicitudes, lista con estado online
   e invitaciones a duelo desde cualquier lugar de Sorlandia.
   (Tabla y funciones en supabase/006_amigos.sql)
   ===================================================================== */
const AM = {lista: [], cargado: 0, pestana: 'amigos', error: false};

async function cargarAmigos(){
  if(!db || !usuarioId) return [];
  try {
    const {data, error} = await db.rpc('sl_mis_amigos');
    AM.error = !!error;
    if(!error) AM.lista = data || [];
  } catch(e){ AM.error = true; }
  AM.cargado = Date.now();
  pintarAvisoAmigos();
  return AM.lista;
}
const solicitudesRecibidas = () => AM.lista.filter(a => a.estado === 'pendiente' && !a.yo_pedi);
const esAmigo = id => AM.lista.some(a => a.id === id && a.estado === 'aceptada');
const estadoAmistad = id => { const a = AM.lista.find(x => x.id === id); return !a ? null : a.estado === 'aceptada' ? 'amigos' : a.yo_pedi ? 'enviada' : 'recibida'; };
function presenciaDe(id){
  const l = ONG.estado && ONG.estado[id];
  return l && l.length ? l[l.length - 1] : null;
}
// Puntito rojo con la cantidad de solicitudes en los botones de Amigos y en el contador de online.
function pintarAvisoAmigos(){
  const n = solicitudesRecibidas().length;
  document.querySelectorAll('[data-aviso-amigos]').forEach(el => { el.dataset.cant = n || ''; el.classList.toggle('con-aviso', n > 0); });
}
// Avisarle al otro por el canal global (le llega esté donde esté).
function avisarA(id, evento, extra = {}){
  if(ONG.canal) ONG.canal.send({type: 'broadcast', event: evento, payload: {para: id, de: usuarioId, apodo, ...extra}});
}
function alRecibirAmistad(p){
  if(p.para !== usuarioId) return;
  if(p.tipo === 'pedido') avisar(`${p.apodo} te mandó una solicitud de amistad`, 'nivel');
  else if(p.tipo === 'aceptada') avisar(`¡${p.apodo} aceptó tu solicitud! Ya son amigos.`, 'nivel');
  cargarAmigos().then(() => { if(hojaActual === 'amigos') pintarAmigos(); });
}

/* ---------------- Acciones ---------------- */
async function pedirAmistad(id, apodoOtro){
  if(!db || !usuarioId){ avisar('Necesitás cuenta para tener amigos'); return null; }
  const {data, error} = await db.rpc('sl_pedir_amistad', {p_otro: id});
  if(error){ avisar('No se pudo mandar la solicitud. Probá de nuevo más tarde.'); return null; }
  if(data === 'pendiente'){ avisar(`Le mandaste una solicitud a ${apodoOtro}`); avisarA(id, 'amistad', {tipo: 'pedido'}); }
  else if(data === 'aceptada'){ avisar(`¡Ya son amigos con ${apodoOtro}!`, 'nivel'); avisarA(id, 'amistad', {tipo: 'aceptada'}); }
  else if(data === 'lleno') avisar('Llegaste al máximo de amigos.');
  await cargarAmigos();
  return data;
}
async function responderAmistad(id, acepta){
  const a = AM.lista.find(x => x.id === id);
  const {error} = await db.rpc('sl_responder_amistad', {p_de: id, p_acepta: acepta});
  if(error){ avisar('No se pudo responder. Probá de nuevo.'); return; }
  if(acepta && a){ avisar(`¡Ahora sos amigo de ${a.apodo}!`, 'nivel'); avisarA(id, 'amistad', {tipo: 'aceptada'}); }
  await cargarAmigos();
}
async function quitarAmistad(id){
  await db.rpc('sl_quitar_amistad', {p_otro: id});
  await cargarAmigos();
}
function invitarADuelo(id, apodoOtro){
  const pr = presenciaDe(id);
  if(!pr){ avisar(`${apodoOtro} no está conectado`); return; }
  if(/batalla|duelo/i.test(pr.donde || '')){ avisar(`${apodoOtro} está peleando ahora`); return; }
  if(vista !== 'mundo' && vista !== 'casa'){ avisar('Terminá lo que estás haciendo primero'); return; }
  cerrarHoja();
  pedirDuelo({id, apodo: apodoOtro});
}

/* ---------------- Perfil de un jugador ---------------- */
async function abrirPerfil(id, base = {}){
  if(id === usuarioId) return;
  hojaActual = 'perfil';
  const v = nuevoVelo();
  const pr = presenciaDe(id) || {};
  let f = {apodo: base.apodo || pr.apodo || '…', medallas: base.medallas ?? pr.medallas ?? 0, puntos: base.puntos ?? pr.puntos ?? null, campeon: base.campeon ?? pr.campeon, ent: base.ent || pr.ent};
  const pintar = () => {
    if(hojaActual !== 'perfil') return;
    const est = f.amistad || estadoAmistad(id), online = !!presenciaDe(id), donde = (presenciaDe(id) || {}).donde;
    const nivel = base.nivel || pr.nivel;
    v.innerHTML = `<div class="hoja" role="dialog" aria-label="Perfil"><div class="hoja-cab"><h2 id="pf-nom"></h2><button class="cerrar" aria-label="Cerrar">×</button></div>
      <div class="ficha-jugador perfil">
        <span class="cr-mini" style="width:64px;height:90px">${svgEntrenador(f.ent || undefined)}</span>
        <div>
          <p class="pf-estado ${online ? 'on' : ''}"><i class="punto-online"></i>${online ? esc(donde || 'Online') : 'Desconectado'}</p>
          <p>${nivel ? `<b>Nivel ${nivel}</b> · ` : ''}${f.puntos != null ? chipRango(f.puntos) : ''}${f.campeon ? '<span class="titulo-campeon">Campeón</span>' : ''}</p>
          <p class="medallas-mini">${MEDALLAS.map((m, i) => svgMedalla(m, 20, i >= (f.medallas || 0))).join('')}</p>
          ${f.album != null ? `<p class="rotulo-chico" style="margin:2px 0 0">Álbum: ${f.album} criaturas · Duelos: ${f.ganados || 0} ganados</p>` : ''}
        </div></div>
      <div class="acciones-jugador">
        ${est === 'amigos' ? `<button class="grande" id="pf-duelo" ${online ? '' : 'disabled'}>${online ? 'Invitar a duelo' : 'No está conectado'}</button><button class="btn btn-2" id="pf-quitar">Quitar de amigos</button>`
          : est === 'enviada' ? '<button class="grande" disabled>Solicitud enviada</button>'
          : est === 'recibida' ? '<button class="grande" id="pf-aceptar">Aceptar solicitud</button><button class="btn btn-2" id="pf-rechazar">Rechazar</button>'
          : '<button class="grande" id="pf-agregar">Agregar a amigos</button>'}
      </div></div>`;
    v.querySelector('#pf-nom').textContent = f.apodo;
    v.querySelector('.cerrar').onclick = cerrarHoja;
    const b = sel => v.querySelector(sel);
    if(b('#pf-agregar')) b('#pf-agregar').onclick = async () => { b('#pf-agregar').disabled = true; const r = await pedirAmistad(id, f.apodo); f.amistad = r === 'aceptada' ? 'amigos' : r === 'pendiente' ? 'enviada' : f.amistad; pintar(); };
    if(b('#pf-aceptar')) b('#pf-aceptar').onclick = async () => { await responderAmistad(id, true); f.amistad = 'amigos'; pintar(); };
    if(b('#pf-rechazar')) b('#pf-rechazar').onclick = async () => { await responderAmistad(id, false); f.amistad = null; pintar(); };
    if(b('#pf-quitar')) b('#pf-quitar').onclick = async () => { await quitarAmistad(id); f.amistad = null; avisar(`Ya no son amigos con ${f.apodo}`); pintar(); };
    if(b('#pf-duelo')) b('#pf-duelo').onclick = () => invitarADuelo(id, f.apodo);
  };
  pintar();
  if(db && usuarioId){
    try {
      const {data} = await db.rpc('sl_ficha', {p_id: id});
      if(data){ f = {...f, ...data, nivel: f.nivel}; if(!AM.cargado) await cargarAmigos(); pintar(); }
    } catch(e){}
  }
}

/* ---------------- Lista de amigos (y online) ---------------- */
async function abrirAmigos(pestana){
  if(vista === 'combate' || vista === 'duelo') return;
  if(pestana) AM.pestana = pestana;
  hojaActual = 'amigos';
  nuevoVelo();
  pintarAmigos();
  await cargarAmigos();
  if(hojaActual === 'amigos') pintarAmigos();
}
function pintarAmigos(){
  const v = $('#velo'); if(!v || hojaActual !== 'amigos') return;
  const tab = AM.pestana;
  let cuerpo = '';
  if(tab === 'amigos'){
    if(!db || !usuarioId) cuerpo = '<p class="rotulo-chico">Los amigos son para jugadores con cuenta.</p>';
    else if(AM.error) cuerpo = '<p class="rotulo-chico">No se pudo cargar la lista de amigos. Probá de nuevo en un rato.</p>';
    else {
      const recibidas = solicitudesRecibidas(), amigos = AM.lista.filter(a => a.estado === 'aceptada'), enviadas = AM.lista.filter(a => a.estado === 'pendiente' && a.yo_pedi);
      amigos.sort((a, b) => !!presenciaDe(b.id) - !!presenciaDe(a.id) || a.apodo.localeCompare(b.apodo));
      const fila = (a, extra) => { const pr = presenciaDe(a.id);
        return `<div class="fila-online fila-amigo" data-perfil="${a.id}"><span class="cr-mini" style="width:38px;height:52px">${svgEntrenador((pr && pr.ent) || a.ent || undefined)}</span>
          <span class="fo-txt"><b data-apodo="${a.id}"></b><small class="${pr ? 'on' : ''}"><i class="punto-online"></i>${pr ? esc(pr.donde || 'Online') : 'Desconectado'}</small></span>
          <span class="fo-acc">${extra}</span></div>`; };
      if(recibidas.length) cuerpo += `<p class="sub-amigos">Solicitudes</p>` + recibidas.map(a => fila(a, `<button class="btn" data-aceptar="${a.id}">Aceptar</button><button class="btn btn-2" data-rechazar="${a.id}">×</button>`)).join('');
      cuerpo += `<p class="sub-amigos">Amigos (${amigos.length})</p>` + (amigos.length ? amigos.map(a => { const pr = presenciaDe(a.id), peleando = pr && /batalla|duelo/i.test(pr.donde || '');
          return fila(a, pr ? `<button class="btn" data-invitar="${a.id}" ${peleando ? 'disabled' : ''}>${peleando ? 'Peleando' : 'Duelo'}</button>` : `<span class="chip-rango" style="--rc:#eee;--rb:#bbb">${a.medallas} ★</span>`); }).join('')
        : '<p class="rotulo-chico">Todavía no tenés amigos. Tocá a otro jugador en el mapa (o en la pestaña Online) y mandale una solicitud.</p>');
      if(enviadas.length) cuerpo += `<p class="sub-amigos">Esperando respuesta</p>` + enviadas.map(a => fila(a, '<small>Enviada</small>')).join('');
    }
  } else {
    const lista = jugadoresOnline().sort((a, b) => (b.id === usuarioId) - (a.id === usuarioId) || b.medallas - a.medallas);
    cuerpo = `<p class="rotulo-chico">${lista.length || 1} jugador${lista.length === 1 ? '' : 'es'} en Sorlandia en este momento. Tocá a alguien para ver su perfil.</p>`
      + lista.map(p => `<div class="fila-online" ${p.id !== usuarioId ? `data-perfil="${p.id}"` : ''}><span class="cr-mini" style="width:38px;height:52px">${svgEntrenador(p.ent)}</span>
        <span class="fo-txt"><b data-apodo="${p.id}"></b><small>${esc(p.donde || '')}</small></span>
        <span class="fo-med">${p.puntos != null ? chipRango(p.puntos, false) : ''}${p.campeon ? '<span class="titulo-campeon">Campeón</span>' : ''}<br>${p.medallas ? '★ ' + p.medallas : ''}${esAmigo(p.id) ? ' · amigo' : ''}</span></div>`).join('');
  }
  v.innerHTML = `<div class="hoja" role="dialog" aria-label="Amigos"><div class="hoja-cab"><h2>Amigos</h2><button class="cerrar" aria-label="Cerrar">×</button></div>
    <div class="pestanas" role="tablist"><button role="tab" data-tab="amigos" aria-selected="${tab === 'amigos'}">Amigos</button><button role="tab" data-tab="online" aria-selected="${tab === 'online'}">Online ahora</button></div>
    <div class="lista-online">${cuerpo}</div>
    <button class="btn btn-2" id="ver-ranking" style="margin-top:10px">Ver ranking</button></div>`;
  // Los apodos van como texto, nunca como HTML.
  const nombres = {};
  AM.lista.forEach(a => nombres[a.id] = a.apodo);
  jugadoresOnline().forEach(p => nombres[p.id] = p.apodo + (p.id === usuarioId ? ' (vos)' : ''));
  v.querySelectorAll('[data-apodo]').forEach(b => b.textContent = nombres[b.dataset.apodo] || '');
  v.querySelector('.cerrar').onclick = cerrarHoja;
  v.querySelector('#ver-ranking').onclick = abrirRanking;
  v.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { AM.pestana = b.dataset.tab; pintarAmigos(); });
  v.querySelectorAll('[data-perfil]').forEach(f => f.onclick = ev => {
    if(ev.target.closest('button')) return;
    const id = f.dataset.perfil, a = AM.lista.find(x => x.id === id) || {};
    abrirPerfil(id, a);
  });
  v.querySelectorAll('[data-aceptar]').forEach(b => b.onclick = async () => { b.disabled = true; await responderAmistad(b.dataset.aceptar, true); pintarAmigos(); });
  v.querySelectorAll('[data-rechazar]').forEach(b => b.onclick = async () => { b.disabled = true; await responderAmistad(b.dataset.rechazar, false); pintarAmigos(); });
  v.querySelectorAll('[data-invitar]').forEach(b => b.onclick = () => { const a = AM.lista.find(x => x.id === b.dataset.invitar); if(a) invitarADuelo(a.id, a.apodo); });
}
