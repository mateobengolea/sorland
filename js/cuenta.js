'use strict';
/* =====================================================================
   Cuenta: guardado local y en la nube, entrar, registrarse y salir.
   ===================================================================== */

function claveLocal(){ return usuarioId ? CLAVE + ':' + usuarioId : CLAVE; }
function leerLocal(clave){
  try { const t = localStorage.getItem(clave || claveLocal()); return t ? JSON.parse(t) : null; } catch(e){ return null; }
}
let timerGuardar = null;
function guardar(){
  if(!S) return;
  S.guardado = Date.now();
  try { localStorage.setItem(claveLocal(), JSON.stringify(S)); } catch(e){}
  clearTimeout(timerGuardar);
  timerGuardar = setTimeout(guardarNube, 1500);
}

/* ---------- Supabase: cuentas y guardado en la nube ---------- */
const CFG = window.SORLANDIA_CONFIG || {};
let recuperando = location.hash.includes('type=recovery');
db = (window.supabase && CFG.supabaseUrl) ? window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseKey) : null;
let emailUsuario = null, apodo = null, metaApodo = null, estadoNube = 'local'; // local | guardando | guardado | error
const RE_APODO = /^[A-Za-z0-9_ÁÉÍÓÚáéíóúÑñÜü]{3,16}$/;
const URL_JUEGO = location.origin + location.pathname;

async function guardarNube(){
  if(!db || !usuarioId || !S) return;
  estadoNube = 'guardando'; pintarCuenta();
  const { error } = await db.from('partidas').upsert({
    user_id: usuarioId, nombre: S.equipo[0] ? S.equipo[0].nombre : '', especie: S.equipo[0] ? S.equipo[0].esp : '', nivel: S.equipo[0] ? S.equipo[0].nivel : 1, data: S,
  });
  estadoNube = error ? 'error' : 'guardado'; pintarCuenta();
  if(!error && typeof actualizarFicha === 'function') actualizarFicha();
}

async function entrarAlJuego(){
  if(recuperando) return;
  // 1) apodo
  const { data: perfil, error: e1 } = await db.from('perfiles').select('apodo').eq('id', usuarioId).maybeSingle();
  if(e1){ pintarAcceso('entrar', 'No se pudo conectar con el servidor. Probá recargar la página.'); return; }
  if(!perfil){ pintarApodo(); return; }
  apodo = perfil.apodo;
  // 2) partida
  const { data, error } = await db.from('partidas').select('data').eq('user_id', usuarioId).maybeSingle();
  if(error){ estadoNube = 'error'; }
  const remoto = data && data.data;
  const local = leerLocal() || leerLocal(CLAVE); // CLAVE sola = partida jugada antes sin cuenta
  if(remoto && (!local || (remoto.guardado||0) >= (local.guardado||0))) S = remoto;
  else S = local;
  migrar(S);
  modo = null;
  if(S && S.entrenador){
    pintarJuego(); bonoDiario();
    if(S !== remoto) guardar();
    try { localStorage.removeItem(CLAVE); } catch(e){}
  } else pintarCreador();
  if(estadoNube !== 'error') estadoNube = 'guardado';
  pintarCuenta();
}

function conectarNube(){
  db.auth.onAuthStateChange((evento, sesion) => {
    if(evento === 'PASSWORD_RECOVERY'){ recuperando = true; setTimeout(() => pintarAcceso('nueva-clave'), 0); }
    const nuevoId = sesion && sesion.user ? sesion.user.id : null;
    if(nuevoId && nuevoId !== usuarioId){
      usuarioId = nuevoId; emailUsuario = sesion.user.email;
      metaApodo = (sesion.user.user_metadata || {}).apodo || null;
      if(recuperando){ setTimeout(() => pintarAcceso('nueva-clave'), 0); return; }
      setTimeout(entrarAlJuego, 0);
    } else if(!nuevoId){
      usuarioId = null; emailUsuario = null; apodo = null; estadoNube = 'local';
      if(typeof salirDelMundo === 'function') salirDelMundo();
      S = null; modo = null; B = null; vista = 'acceso'; cerrarHoja();
      setTimeout(() => pintarAcceso('entrar'), 0);
    }
  });
}

/* ---------- Pantallas de acceso ---------- */
function traducirError(e){
  const m = (e && e.message) || '';
  if(/Invalid login credentials/i.test(m)) return 'Mail o contraseña incorrectos.';
  if(/Email not confirmed/i.test(m)) return 'Todavía no confirmaste tu mail. Buscá el mail de Sorlandia (fijate en spam) y tocá el link.';
  if(/already registered/i.test(m)) return 'Ya hay una cuenta con ese mail. Probá entrar.';
  if(/Password should be/i.test(m) || /weak/i.test(m)) return 'La contraseña es muy débil. Usá al menos 8 caracteres, mezclando letras y números.';
  if(e && e.status === 429 || /rate limit/i.test(m)) return 'Se mandaron muchos mails seguidos. Esperá un rato y probá de nuevo.';
  if(/valid email/i.test(m)) return 'Ese mail no parece válido.';
  return 'Algo salió mal: ' + m;
}

/* ---------------- Logo de Sorlandia ---------------- */
function svgLogo(){
  return `<svg class="logo-sorlandia" viewBox="0 0 360 230" role="img" aria-label="Sorlandia">
    <defs>
      <linearGradient id="lg-cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FC8F0"/><stop offset="1" stop-color="#D6F0FB"/></linearGradient>
      <linearGradient id="lg-letras" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE45C"/><stop offset=".55" stop-color="#FFC23A"/><stop offset="1" stop-color="#F28A2E"/></linearGradient>
      <clipPath id="lg-circ"><circle cx="180" cy="98" r="86"/></clipPath>
      <path id="lg-arco" d="M4 168 Q180 52 356 168"/>
    </defs>
    <circle cx="180" cy="98" r="92" fill="#22304A"/>
    <g clip-path="url(#lg-circ)">
      <rect x="80" y="0" width="200" height="200" fill="url(#lg-cielo)"/>
      <g opacity=".55" stroke="#FFF6C8" stroke-width="10">${Array.from({length: 12}, (_, i) => `<path d="M180 70 L${180 + Math.cos(i * Math.PI / 6) * 140} ${70 + Math.sin(i * Math.PI / 6) * 140}"/>`).join('')}</g>
      <circle cx="180" cy="70" r="26" fill="#FFE45C" stroke="#22304A" stroke-width="3"/>
      <path d="M80 140 Q130 100 180 128 Q230 96 290 132 L290 200 L80 200Z" fill="#8DD17C" stroke="#22304A" stroke-width="3"/>
      <path d="M80 160 Q150 136 210 156 Q250 146 290 158 L290 200 L80 200Z" fill="#5FB45A" stroke="#22304A" stroke-width="3"/>
      <path d="M116 132 v-18 M110 116 l6 -6 l6 6" stroke="#6B4426" stroke-width="3" fill="none"/>
      <g transform="translate(116 104)">${[-40, 0, 40].map(r => `<path d="M0 0 C-6 -10 -2 -20 3 -22 C7 -16 7 -8 0 0Z" transform="rotate(${r})" fill="#E2493C" stroke="#22304A" stroke-width="1.5"/>`).join('')}</g>
    </g>
    <circle cx="180" cy="98" r="86" fill="none" stroke="#FFFDF8" stroke-width="4"/>
    <circle cx="180" cy="98" r="92" fill="none" stroke="#22304A" stroke-width="4"/>
    <text font-family="'Baloo 2', system-ui, sans-serif" font-weight="800" font-size="54" letter-spacing="1" text-anchor="middle" stroke="#22304A" stroke-width="13" stroke-linejoin="round" fill="#22304A"><textPath href="#lg-arco" startOffset="50%">SORLANDIA</textPath></text>
    <text font-family="'Baloo 2', system-ui, sans-serif" font-weight="800" font-size="54" letter-spacing="1" text-anchor="middle" stroke="#FFFDF8" stroke-width="5" stroke-linejoin="round" fill="url(#lg-letras)" paint-order="stroke"><textPath href="#lg-arco" startOffset="50%">SORLANDIA</textPath></text>
    <g transform="translate(180 196)">
      <path d="M-120 -16 H120 L108 0 L120 16 H-120 L-108 0Z" fill="#E2574C" stroke="#22304A" stroke-width="3" stroke-linejoin="round"/>
      <text y="6" text-anchor="middle" font-family="'Baloo 2', system-ui, sans-serif" font-weight="800" font-size="16" fill="#FFFDF8" letter-spacing="2">AVENTURAS EN LA PAMPA</text>
    </g>
    <g fill="#FFE45C" stroke="#22304A" stroke-width="2"><path d="M300 26 l5 12 l12 5 l-12 5 l-5 12 l-5 -12 l-12 -5 l12 -5z"/></g>
    <g fill="#FFE45C" stroke="#22304A" stroke-width="2"><path d="M54 52 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4z"/></g>
  </svg>`;
}
function pintarCargando(){
  $('#app').innerHTML = `<div class="eleccion"><div class="titulo">${svgLogo()}<h1 class="solo-lector">Sorlandia</h1><p>Cargando...</p></div></div>`;
}
function pintarAcceso(vista, aviso){
  const tabs = vista === 'entrar' || vista === 'registro';
  let form = '';
  if(vista === 'entrar') form = `
      <label for="mail">Mail</label><input id="mail" type="email" required autocomplete="email" placeholder="nombre@mail.com">
      <label for="clave">Contraseña</label><input id="clave" type="password" required autocomplete="current-password">
      <button class="grande" type="submit">Entrar</button>
      <button class="enlace" type="button" id="b-olvide" style="align-self:center">¿Te olvidaste la contraseña?</button>`;
  else if(vista === 'registro') form = `
      <label for="apodo">Apodo <span style="font-weight:600;color:var(--tinta-suave)">(lo ven los demás jugadores)</span></label>
      <input id="apodo" required minlength="3" maxlength="16" autocomplete="nickname" placeholder="3 a 16 letras o números">
      <label for="mail">Mail</label><input id="mail" type="email" required autocomplete="email" placeholder="nombre@mail.com">
      <label for="clave">Contraseña</label><input id="clave" type="password" required minlength="8" autocomplete="new-password" placeholder="Al menos 8 caracteres">
      <button class="grande" type="submit">Crear cuenta</button>`;
  else if(vista === 'olvide') form = `
      <p>Poné tu mail y te mandamos un link para elegir una contraseña nueva.</p>
      <label for="mail">Mail</label><input id="mail" type="email" required autocomplete="email">
      <button class="grande" type="submit">Mandarme el link</button>
      <button class="enlace" type="button" id="b-volver" style="align-self:center">Volver</button>`;
  else form = `
      <p>Elegí tu contraseña nueva.</p>
      <label for="clave">Contraseña nueva</label><input id="clave" type="password" required minlength="8" autocomplete="new-password" placeholder="Al menos 8 caracteres">
      <button class="grande" type="submit">Guardar contraseña</button>`;
  $('#app').innerHTML = `
    <div class="eleccion">
      <div class="titulo">${svgLogo()}<h1 class="solo-lector">Sorlandia</h1><p>Elegí tu criatura, recorré Sorlandia y ganá las ocho medallas.</p></div>
      <form class="panel ficha" id="form-acceso" novalidate>
        ${tabs ? `<div class="pestanas" role="tablist" style="margin:0">
          <button type="button" role="tab" data-v="entrar" aria-selected="${vista==='entrar'}">Entrar</button>
          <button type="button" role="tab" data-v="registro" aria-selected="${vista==='registro'}">Crear cuenta</button></div>` : ''}
        ${form}
        <p id="acceso-msg" style="font-weight:700" aria-live="polite"></p>
      </form>
    </div>`;
  if(aviso) $('#acceso-msg').textContent = aviso;
  document.querySelectorAll('[data-v]').forEach(b => b.onclick = () => pintarAcceso(b.dataset.v));
  const ol = $('#b-olvide'); if(ol) ol.onclick = () => pintarAcceso('olvide');
  const vu = $('#b-volver'); if(vu) vu.onclick = () => pintarAcceso('entrar');
  const msg = t => { $('#acceso-msg').textContent = t; };
  $('#form-acceso').onsubmit = async ev => {
    ev.preventDefault();
    const btn = $('#form-acceso .grande'), txt = btn.textContent;
    const val = id => ($('#'+id) ? $('#'+id).value.trim() : '');
    const mail = val('mail'), clave = $('#clave') ? $('#clave').value : '';
    if($('#mail') && !/^\S+@\S+\.\S+$/.test(mail)) return msg('Revisá el mail.');
    if(vista === 'registro' || vista === 'nueva-clave'){ if(clave.length < 8) return msg('La contraseña tiene que tener al menos 8 caracteres.'); }
    btn.disabled = true; btn.textContent = 'Un momento...';
    try {
      if(vista === 'entrar'){
        const { error } = await db.auth.signInWithPassword({ email: mail, password: clave });
        if(error) msg(traducirError(error)); else msg('');
      } else if(vista === 'registro'){
        const ap = val('apodo');
        if(!RE_APODO.test(ap)) { msg('El apodo va de 3 a 16 caracteres: letras, números o guion bajo, sin espacios.'); return; }
        const { data: libre } = await db.rpc('apodo_disponible', { p_apodo: ap });
        if(libre === false){ msg(`El apodo "${ap}" ya está tomado. Probá otro.`); return; }
        const { data, error } = await db.auth.signUp({ email: mail, password: clave, options: { data: { apodo: ap }, emailRedirectTo: URL_JUEGO } });
        if(error) msg(traducirError(error));
        else if(data.user && data.user.identities && data.user.identities.length === 0) msg('Ya hay una cuenta con ese mail. Probá entrar.');
        else if(!data.session) pintarAcceso('entrar', `¡Cuenta creada! Te mandamos un mail a ${mail} para confirmarla (fijate en spam). Después entrá con tu contraseña.`);
      } else if(vista === 'olvide'){
        const { error } = await db.auth.resetPasswordForEmail(mail, { redirectTo: URL_JUEGO });
        msg(error ? traducirError(error) : `Listo. Revisá ${mail} y tocá el link para elegir tu contraseña nueva.`);
      } else {
        const { error } = await db.auth.updateUser({ password: clave });
        if(error) msg(traducirError(error));
        else { recuperando = false; history.replaceState(null, '', URL_JUEGO); avisar('Contraseña actualizada'); entrarAlJuego(); }
      }
    } finally { if(document.body.contains(btn)){ btn.disabled = false; btn.textContent = txt; } }
  };
  const primero = document.querySelector('#form-acceso input'); if(primero && vista !== 'entrar') primero.focus();
}

function pintarApodo(aviso){
  $('#app').innerHTML = `
    <div class="eleccion">
      <div class="titulo"><h1>Sorlandia</h1><p>Un último paso antes de jugar.</p></div>
      <form class="panel ficha" id="form-apodo" novalidate>
        <h2 style="font-size:1.5rem">Elegí tu apodo</h2>
        <p>Es el nombre con el que te van a ver los demás jugadores en el mundo.</p>
        <label for="apodo">Apodo</label>
        <input id="apodo" maxlength="16" autocomplete="nickname" placeholder="3 a 16 letras o números">
        <button class="grande" type="submit">Listo</button>
        <p id="apodo-msg" style="font-weight:700" aria-live="polite"></p>
        <button class="enlace" type="button" id="b-salir2" style="align-self:center">Salir</button>
      </form>
    </div>`;
  $('#apodo').value = metaApodo || '';
  if(aviso) $('#apodo-msg').textContent = aviso;
  $('#b-salir2').onclick = salir;
  $('#form-apodo').onsubmit = async ev => {
    ev.preventDefault();
    const ap = $('#apodo').value.trim();
    if(!RE_APODO.test(ap)) { $('#apodo-msg').textContent = 'De 3 a 16 caracteres: letras, números o guion bajo, sin espacios.'; return; }
    const { error } = await db.from('perfiles').insert({ id: usuarioId, apodo: ap });
    if(error){ $('#apodo-msg').textContent = error.code === '23505' ? `"${ap}" ya está tomado. Probá otro.` : 'No se pudo guardar: ' + error.message; return; }
    entrarAlJuego();
  };
}

async function salir(){
  clearTimeout(timerGuardar);
  if(typeof salirDelMundo === 'function') salirDelMundo();
  if(typeof cortarOnline === 'function') cortarOnline();
  B = null;
  if(S) await guardarNube();
  if(db) await db.auth.signOut();
}

function pintarCuenta(){
  const el = $('#cuenta'); if(!el) return;
  if(!db || !usuarioId){ el.textContent = ''; return; }
  const est = {guardando:'Guardando...', guardado:'Guardado', error:'No se pudo guardar', local:''}[estadoNube];
  el.innerHTML = `Jugando como <b></b> · ${est} · <button class="enlace" id="b-salir">Salir</button>`;
  el.querySelector('b').textContent = apodo || emailUsuario || '';
  $('#b-salir').onclick = salir;
}

