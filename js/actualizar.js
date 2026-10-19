'use strict';
/* =====================================================================
   Actualización forzada.
   Cuando se publica una versión nueva y se cambia assets/version.json,
   cada jugador conectado guarda su partida y recarga el juego solo.
   Si está en una pelea o un duelo, espera a que termine.
   ===================================================================== */
const ACT = {cargada: null, pendiente: null, mostrando: false};
async function leerVersion(){
  try {
    const r = await fetch('assets/version.json?t=' + Date.now(), {cache: 'no-store'});
    if(!r.ok) return null;
    return await r.json();
  } catch(e){ return null; }
}
async function revisarVersion(){
  const v = await leerVersion(); if(!v || !v.v) return;
  if(ACT.cargada === null){ ACT.cargada = v.v; return; }
  if(v.v !== ACT.cargada) { ACT.pendiente = v; intentarActualizar(); }
}
const ocupadoParaActualizar = () => (typeof vista !== 'undefined' && ['combate', 'duelo', 'mirando'].includes(vista))
  || (typeof DU !== 'undefined' && DU) || (typeof B !== 'undefined' && B);
async function intentarActualizar(){
  if(!ACT.pendiente || ACT.mostrando) return;
  if(ocupadoParaActualizar()){ setTimeout(intentarActualizar, 5000); return; }
  ACT.mostrando = true;
  // Guardar todo antes de recargar.
  try { if(typeof guardar === 'function' && typeof S !== 'undefined' && S) guardar(); } catch(e){}
  try { if(typeof guardarNube === 'function') await guardarNube(true); } catch(e){}
  const capa = document.createElement('div');
  capa.className = 'capa-actualizar';
  capa.innerHTML = `<div class="panel caja-actualizar"><h2>¡Hay una versión nueva!</h2>
    <p>Guardamos tu partida. El juego se va a recargar para que tengas todo lo nuevo.</p>
    <p class="rotulo-chico" id="act-msg"></p>
    <button class="grande" id="act-ya">Actualizar ahora</button></div>`;
  document.body.appendChild(capa);
  if(ACT.pendiente.msg) capa.querySelector('#act-msg').textContent = ACT.pendiente.msg;
  let quedan = 8;
  const b = capa.querySelector('#act-ya');
  const reloj = setInterval(() => { quedan--; b.textContent = `Actualizar ahora (${quedan})`; if(quedan <= 0) recargarJuego(); }, 1000);
  b.onclick = () => { clearInterval(reloj); recargarJuego(); };
}
async function recargarJuego(){
  // Pide de nuevo la página sin caché para que traiga los archivos nuevos.
  try { await fetch(location.pathname + '?r=' + Date.now(), {cache: 'reload'}); } catch(e){}
  try { await fetch(location.pathname, {cache: 'reload'}); } catch(e){}
  location.reload();
}
revisarVersion();
setInterval(revisarVersion, 60000);
document.addEventListener('visibilitychange', () => { if(document.visibilityState === 'visible') revisarVersion(); });
