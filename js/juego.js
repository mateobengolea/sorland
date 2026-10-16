(() => {
'use strict';

/* ======================= Datos del juego ======================= */
const ESPECIES = {
  carosor:{nombre:'Carosor',tipo:'fuego',tipoNom:'Fuego',
    desc:'Cabeza dura y cola encendida. Le encanta entrenar y no le hace asco a nada que salga de la parrilla.',
    base:{vida:20,fuerza:7,velocidad:5}},
  matesor:{nombre:'Matesor',tipo:'planta',tipoNom:'Planta',
    desc:'Tiene un brote de yerba en la cabeza. Tranquilo, compañero, aguanta de todo y nunca dice que no a un mate.',
    base:{vida:24,fuerza:5,velocidad:5}},
  rufisor:{nombre:'Rufisor',tipo:'agua',tipoNom:'Agua',
    desc:'Escurridizo y juguetón, con aletas en la cresta. Corre más rápido que nadie y vive pidiendo baño.',
    base:{vida:20,fuerza:5,velocidad:7}},
};

const COMIDAS = [
  {id:'croquetas',nom:'Croquetas',em:'🥣',precio:10,hambre:20,animo:0,nivel:1,desc:'Lo básico. Llena sin lujos.'},
  {id:'medialuna',nom:'Medialuna',em:'🥐',precio:15,hambre:15,animo:10,nivel:1,desc:'De manteca, recién horneada.'},
  {id:'mate',nom:'Mate amargo',em:'🧉',precio:15,hambre:5,animo:12,energia:15,nivel:1,gusta:'planta',desc:'Despierta a cualquiera.'},
  {id:'empanada',nom:'Empanada',em:'🥟',precio:25,hambre:35,animo:5,nivel:1,gusta:'fuego',desc:'De carne, cortada a cuchillo.'},
  {id:'pescadito',nom:'Pescadito',em:'🐟',precio:25,hambre:30,animo:5,nivel:1,gusta:'agua',desc:'Fresquito del río.'},
  {id:'alfajor',nom:'Alfajor',em:'🍪',precio:20,hambre:10,animo:20,nivel:2,desc:'Triple, de dulce de leche.'},
  {id:'ensalada',nom:'Ensalada de rúcula',em:'🥗',precio:20,hambre:25,animo:5,nivel:2,gusta:'planta',desc:'Verde, crocante y con limón.'},
  {id:'helado',nom:'Helado',em:'🍨',precio:30,hambre:10,animo:30,nivel:2,gusta:'agua',desc:'Dulce de leche granizado.'},
  {id:'asado',nom:'Asadito',em:'🍖',precio:60,hambre:60,animo:20,nivel:3,gusta:'fuego',desc:'Para un domingo largo.'},
  {id:'chori',nom:'Choripán',em:'🌭',precio:35,hambre:40,animo:10,nivel:3,desc:'Con chimichurri, obvio.'},
];
const MUEBLES = [
  {id:'planta',nom:'Cactus',em:'🌵',tam:72,precio:40,nivel:1,desc:'Un toque verde que no hay que regar.'},
  {id:'silla',nom:'Silla',em:'🪑',tam:84,precio:50,nivel:1,desc:'Para sentarse a charlar.'},
  {id:'cuadro',nom:'Cuadro',em:'🖼️',tam:54,precio:60,nivel:1,pared:true,desc:'Va colgado en la pared.'},
  {id:'peluche',nom:'Osito de peluche',em:'🧸',tam:62,precio:70,nivel:2,desc:'Para dormir abrazado.'},
  {id:'lampara',nom:'Lámpara',em:'🪔',tam:86,precio:80,nivel:2,desc:'Luz cálida de noche.'},
  {id:'reloj',nom:'Reloj de pared',em:'🕰️',tam:54,precio:90,nivel:2,pared:true,desc:'Tic, tac.'},
  {id:'sillon',nom:'Sillón',em:'🛋️',tam:124,precio:150,nivel:3,desc:'Mullido y enorme.'},
  {id:'guitarra',nom:'Guitarra',em:'🎸',tam:92,precio:120,nivel:3,desc:'Para el fogón.'},
  {id:'tele',nom:'Tele',em:'📺',tam:96,precio:200,nivel:4,desc:'Partidos y dibujitos.'},
  {id:'cama',nom:'Cama',em:'🛏️',tam:132,precio:220,nivel:4,desc:'Dormir como se debe.'},
  {id:'trofeo',nom:'Trofeo',em:'🏆',tam:58,precio:300,nivel:5,desc:'Para cuando empiecen los combates.'},
];
const ACCESORIOS = [
  {id:'mono',nom:'Moño',em:'🎀',precio:60,nivel:1,desc:'Coqueto.'},
  {id:'gorra',nom:'Gorra',em:'🧢',precio:80,nivel:2,desc:'Para el sol.'},
  {id:'anteojos',nom:'Anteojos de sol',em:'🕶️',precio:100,nivel:3,ojos:true,desc:'Facha total.'},
  {id:'galera',nom:'Galera',em:'🎩',precio:150,nivel:4,desc:'De gala.'},
  {id:'corona',nom:'Corona',em:'👑',precio:400,nivel:6,desc:'Solo para la realeza.'},
];
const FONDOS = [
  {id:'durazno',nom:'Durazno',precio:0,nivel:1,pared:'#FBDCC4',piso:'repeating-linear-gradient(90deg,#D49A62 0 46px,#C68A52 46px 48px)',desc:'La casa de siempre.'},
  {id:'menta',nom:'Menta',precio:120,nivel:2,pared:'repeating-linear-gradient(90deg,#CFEEDC 0 22px,#C1E6D1 22px 44px)',piso:'repeating-linear-gradient(90deg,#B98B6A 0 46px,#A87B5B 46px 48px)',desc:'Rayas frescas.'},
  {id:'lavanda',nom:'Lavanda',precio:160,nivel:3,pared:'radial-gradient(circle at 12px 12px,#D3C6F0 3px,transparent 4px) 0 0/24px 24px,#E6DEF8',piso:'repeating-conic-gradient(#F2EEF9 0 25%,#CFC4E6 0 50%) 0 0/40px 40px',desc:'Lunares y damero.'},
  {id:'cancha',nom:'Canchita',precio:220,nivel:4,pared:'linear-gradient(#9FD4F5,#D8F0FF)',piso:'repeating-linear-gradient(90deg,#5DBB63 0 40px,#4FAE56 40px 80px)',desc:'Para correr un rato.'},
  {id:'estrellas',nom:'Noche estrellada',precio:300,nivel:5,pared:'radial-gradient(circle at 30px 20px,#FFF6B0 2px,transparent 3px) 0 0/70px 60px,radial-gradient(circle at 10px 45px,#fff 1.5px,transparent 2.5px) 0 0/50px 70px,#2C3A73',piso:'repeating-linear-gradient(90deg,#4A3E6E 0 46px,#3D3260 46px 48px)',desc:'Siempre de noche.'},
];
const POR_ID = {};
[...COMIDAS,...MUEBLES,...ACCESORIOS,...FONDOS].forEach(x => POR_ID[x.id] = x);

const NEC = [
  {k:'hambre',nom:'Panza'},
  {k:'limpieza',nom:'Limpieza'},
  {k:'animo',nom:'Ánimo'},
  {k:'energia',nom:'Energía'},
];
// pérdida por hora
const DECAE = {hambre:7,limpieza:4,animo:5,energia:3};

/* ======================= Estado y guardado ======================= */
const CLAVE = 'sorlandia-partida-v1';
let S = null;            // estado del juego
let modo = null;         // null | 'banio' | 'jugar' | 'decorar'
let usuarioId = null, db = null;

const hoy = () => { const d = new Date(); return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate(); };
const clamp = (v,a=0,b=100) => Math.max(a,Math.min(b,v));
const xpPara = n => 40 + n*25;

function nuevaPartida(especie, nombre){
  const e = ESPECIES[especie];
  const fav = COMIDAS.find(c => c.gusta === e.tipo && c.nivel === 1);
  return {
    v:1, especie, nombre: nombre || e.nombre, creada: Date.now(), ultimo: Date.now(), guardado: Date.now(),
    nivel:1, xp:0, monedas:100,
    nec:{hambre:70,limpieza:60,animo:70,energia:80},
    stats:{...e.base},
    inv:{comida:{croquetas:3,[fav.id]:2}, muebles:{planta:1}, accesorios:[], fondos:['durazno']},
    casa:[{id:'planta',x:86,y:90}], puesto:null, fondo:'durazno',
    durmiendo:false, ultimoBono:null,
  };
}

function leerLocal(){
  try { const t = localStorage.getItem(CLAVE); return t ? JSON.parse(t) : null; } catch(e){ return null; }
}
let timerGuardar = null;
function guardar(){
  if(!S) return;
  S.guardado = Date.now();
  try { localStorage.setItem(CLAVE, JSON.stringify(S)); } catch(e){}
  clearTimeout(timerGuardar);
  timerGuardar = setTimeout(guardarNube, 1500);
}
/* ---------- Supabase: cuentas y guardado en la nube ---------- */
const CFG = window.SORLANDIA_CONFIG || {};
db = (window.supabase && CFG.supabaseUrl) ? window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseKey) : null;
let emailUsuario = null, estadoNube = 'local'; // local | guardando | guardado | error

async function guardarNube(){
  if(!db || !usuarioId || !S) return;
  estadoNube = 'guardando'; pintarCuenta();
  const { error } = await db.from('partidas').upsert({
    user_id: usuarioId, nombre: S.nombre, especie: S.especie, nivel: S.nivel, data: S,
  });
  estadoNube = error ? 'error' : 'guardado'; pintarCuenta();
}
async function sincronizar(){
  if(!db || !usuarioId) return;
  const { data, error } = await db.from('partidas').select('data').eq('user_id', usuarioId).maybeSingle();
  if(error){ estadoNube = 'error'; pintarCuenta(); return; }
  if(data && data.data){
    const remoto = data.data;
    if(!S || (remoto.guardado||0) >= (S.guardado||0)){
      S = remoto;
      try { localStorage.setItem(CLAVE, JSON.stringify(S)); } catch(e){}
      avanzarTiempo(); salirModoSilencioso(); pintarJuego(); bonoDiario();
    } else guardarNube();
  } else if(S) guardarNube();
  else pintarEleccion();
  estadoNube = estadoNube === 'error' ? 'error' : 'guardado'; pintarCuenta();
}
async function conectarNube(){
  if(!db) return;
  db.auth.onAuthStateChange((evento, sesion) => {
    const nuevoId = sesion && sesion.user ? sesion.user.id : null;
    if(nuevoId && nuevoId !== usuarioId){
      usuarioId = nuevoId; emailUsuario = sesion.user.email;
      setTimeout(sincronizar, 0);
    } else if(!nuevoId && usuarioId){
      usuarioId = null; emailUsuario = null; estadoNube = 'local';
      try { localStorage.removeItem(CLAVE); } catch(e){}
      S = null; cerrarHoja(); pintarEleccion();
    }
    pintarCuenta();
  });
}
function salirModoSilencioso(){ modo = null; }

/* ---------- Entrar con mail ---------- */
function abrirLogin(){
  if(!db){ avisar('Falta configurar Supabase'); return; }
  let velo = $('#velo');
  if(!velo){
    velo = document.createElement('div'); velo.id = 'velo'; velo.className = 'velo';
    velo.onclick = e => { if(e.target === velo) cerrarHoja(); };
    document.body.appendChild(velo);
  }
  hojaActual = 'login';
  velo.innerHTML = `<div class="hoja" role="dialog" aria-label="Entrar">
    <div class="hoja-cab"><h2>Entrar a Sorlandia</h2><button class="cerrar" aria-label="Cerrar">×</button></div>
    <form class="ficha" id="form-login" style="padding:0">
      <p>Poné tu mail y te mandamos un link para entrar, sin contraseña. Tu partida queda guardada y la seguís desde cualquier dispositivo.</p>
      <label for="mail">Tu mail</label>
      <input id="mail" type="email" required autocomplete="email" placeholder="nombre@mail.com">
      <button class="grande" type="submit" id="enviar-link">Mandarme el link</button>
      <p id="login-msg" style="font-weight:700"></p>
    </form></div>`;
  velo.querySelector('.cerrar').onclick = cerrarHoja;
  $('#form-login').onsubmit = async ev => {
    ev.preventDefault();
    const mail = $('#mail').value.trim();
    const btn = $('#enviar-link'); btn.disabled = true; btn.textContent = 'Enviando...';
    const { error } = await db.auth.signInWithOtp({ email: mail, options: { emailRedirectTo: location.origin + location.pathname } });
    btn.disabled = false; btn.textContent = 'Mandarme el link';
    $('#login-msg').textContent = error
      ? (error.status === 429 ? 'Se pidieron muchos links seguidos. Esperá un rato y probá de nuevo.' : 'No se pudo enviar: ' + error.message)
      : `Listo. Revisá ${mail} (y la carpeta de spam) y tocá el link desde este mismo navegador.`;
  };
  setTimeout(() => $('#mail') && $('#mail').focus(), 50);
}
async function salir(){ if(db) await db.auth.signOut(); }

function pintarCuenta(){
  const el = $('#cuenta'); if(!el) return;
  if(!db){ el.textContent = 'Tu partida se guarda en este navegador.'; return; }
  if(!usuarioId){
    el.innerHTML = `Jugando sin cuenta: la partida queda solo en este navegador. <button class="enlace" id="b-entrar">Entrar con mail</button>`;
    $('#b-entrar').onclick = abrirLogin;
    return;
  }
  const est = {guardando:'Guardando...', guardado:'Guardado en la nube', error:'No se pudo guardar en la nube', local:''}[estadoNube];
  el.innerHTML = `<span></span> · ${est} · <button class="enlace" id="b-salir">Salir</button>`;
  el.querySelector('span').textContent = emailUsuario || 'Con cuenta';
  $('#b-salir').onclick = salir;
}

/* ======================= Paso del tiempo ======================= */
function avanzarTiempo(){
  if(!S) return;
  const ahora = Date.now();
  const horas = Math.max(0, (ahora - S.ultimo) / 3600000);
  S.ultimo = ahora;
  if(horas <= 0) return;
  const f = S.durmiendo ? .5 : 1;
  S.nec.hambre = clamp(S.nec.hambre - DECAE.hambre*horas*f);
  S.nec.limpieza = clamp(S.nec.limpieza - DECAE.limpieza*horas*f);
  S.nec.animo = clamp(S.nec.animo - DECAE.animo*horas*f - (S.nec.hambre<20 ? 4*horas : 0));
  if(S.durmiendo){
    S.nec.energia = clamp(S.nec.energia + 30*horas);
  } else S.nec.energia = clamp(S.nec.energia - DECAE.energia*horas);
}

function sumarXP(n){
  S.xp += n;
  let subio = false;
  while(S.xp >= xpPara(S.nivel)){
    S.xp -= xpPara(S.nivel); S.nivel++; S.monedas += 50; subio = true;
    S.stats.vida += 2; S.stats.fuerza += 1; S.stats.velocidad += 1;
  }
  if(subio){
    const nuevos = [...COMIDAS,...MUEBLES,...ACCESORIOS,...FONDOS].filter(x => x.nivel === S.nivel).length;
    avisar(`¡${S.nombre} subió a nivel ${S.nivel}! +50 monedas` + (nuevos ? ` · ${nuevos} cosas nuevas en la tienda` : ''), 'nivel');
  }
}
function ganar(m){ S.monedas += m; }

/* ======================= Dibujo de las criaturas ======================= */
const COL = {
  carosor:{main:'#F47A45',osc:'#D85A2A',panza:'#FFD98A'},
  matesor:{main:'#72C25B',osc:'#4FA03C',panza:'#E5F5C6'},
  rufisor:{main:'#4EA8E3',osc:'#2E86C4',panza:'#D6EFFF'},
};
function svgCriatura(esp, o = {}){
  const c = COL[esp], T = '#22304A';
  const humor = o.humor || 'bien';
  let atras = '', cabeza = '', cola = '';
  if(esp === 'carosor'){
    cola = `<path d="M60 160 Q30 162 22 140" fill="none" stroke="${T}" stroke-width="18" stroke-linecap="round"/>
            <path d="M60 160 Q30 162 22 140" fill="none" stroke="${c.main}" stroke-width="11" stroke-linecap="round"/>
            <g class="llama"><path d="M16 136 C2 122 12 104 18 96 C20 108 30 110 28 124 C27 132 22 138 16 136Z" fill="#FF9F2E" stroke="${T}" stroke-width="3"/>
            <path d="M17 132 C11 124 15 114 18 110 C20 118 25 120 23 127 C22 131 20 133 17 132Z" fill="#FFE36B"/></g>`;
    cabeza = `<path d="M74 48 L80 28 L90 44Z" fill="#FFD98A" stroke="${T}" stroke-width="3.5" stroke-linejoin="round"/>
              <path d="M110 44 L120 28 L126 48Z" fill="#FFD98A" stroke="${T}" stroke-width="3.5" stroke-linejoin="round"/>`;
  } else if(esp === 'matesor'){
    cola = `<ellipse cx="50" cy="160" rx="18" ry="11" fill="${c.main}" stroke="${T}" stroke-width="3.5" transform="rotate(-20 50 160)"/>`;
    cabeza = `<path d="M100 42 Q99 30 102 20" fill="none" stroke="${T}" stroke-width="4" stroke-linecap="round"/>
              <path d="M101 24 C88 10 72 16 70 22 C82 30 94 30 101 24Z" fill="#9BDB6E" stroke="${T}" stroke-width="3"/>
              <path d="M102 22 C110 6 128 8 132 14 C122 24 110 26 102 22Z" fill="#9BDB6E" stroke="${T}" stroke-width="3"/>`;
    atras = `<circle cx="66" cy="128" r="6" fill="${c.osc}"/><circle cx="138" cy="122" r="5" fill="${c.osc}"/><circle cx="142" cy="150" r="4" fill="${c.osc}"/>`;
  } else {
    cola = `<path d="M58 162 Q34 168 26 156" fill="none" stroke="${T}" stroke-width="16" stroke-linecap="round"/>
            <path d="M58 162 Q34 168 26 156" fill="none" stroke="${c.main}" stroke-width="9" stroke-linecap="round"/>
            <path d="M28 158 L6 140 L12 162 L4 178 Z" fill="#8FD3F7" stroke="${T}" stroke-width="3" stroke-linejoin="round"/>`;
    cabeza = `<path d="M70 52 Q74 30 86 40 Q90 22 102 36 Q110 18 120 38 Q132 30 130 52Z" fill="#8FD3F7" stroke="${T}" stroke-width="3.5" stroke-linejoin="round"/>`;
  }
  let ojos, boca, cejas = '';
  if(o.dormido){
    ojos = `<path d="M74 82 Q82 88 90 82" fill="none" stroke="${T}" stroke-width="3.5" stroke-linecap="round"/><path d="M110 82 Q118 88 126 82" fill="none" stroke="${T}" stroke-width="3.5" stroke-linecap="round"/>`;
    boca = `<ellipse cx="100" cy="102" rx="4" ry="3" fill="${T}"/>`;
  } else {
    const oy = humor === 'mal' ? 84 : 80;
    ojos = `<ellipse cx="82" cy="${oy}" rx="6.5" ry="8.5" fill="${T}"/><circle cx="84.5" cy="${oy-3}" r="2.4" fill="#fff"/>
            <ellipse cx="118" cy="${oy}" rx="6.5" ry="8.5" fill="${T}"/><circle cx="120.5" cy="${oy-3}" r="2.4" fill="#fff"/>`;
    if(humor === 'feliz') boca = `<path d="M88 97 Q100 114 112 97 Z" fill="#B8364F" stroke="${T}" stroke-width="3" stroke-linejoin="round"/>`;
    else if(humor === 'bien') boca = `<path d="M89 99 Q100 108 111 99" fill="none" stroke="${T}" stroke-width="3.5" stroke-linecap="round"/>`;
    else { boca = `<path d="M90 106 Q100 97 110 106" fill="none" stroke="${T}" stroke-width="3.5" stroke-linecap="round"/>`;
      cejas = `<path d="M72 70 L88 74" stroke="${T}" stroke-width="3" stroke-linecap="round"/><path d="M128 70 L112 74" stroke="${T}" stroke-width="3" stroke-linecap="round"/>`; }
  }
  const suc = o.sucio || 0;
  const manchas = suc > .05 ? `<g opacity="${Math.min(.85,suc)}" fill="#8A6440"><ellipse cx="70" cy="150" rx="9" ry="6"/><ellipse cx="128" cy="160" rx="10" ry="6"/><ellipse cx="118" cy="62" rx="7" ry="5"/><ellipse cx="80" cy="112" rx="6" ry="4"/></g>` : '';
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="100" cy="188" rx="54" ry="8" fill="rgba(34,48,74,.16)"/>
    <g class="cuerpo">
      ${cola}
      <ellipse cx="76" cy="178" rx="17" ry="10" fill="${c.osc}" stroke="${T}" stroke-width="3.5"/>
      <ellipse cx="124" cy="178" rx="17" ry="10" fill="${c.osc}" stroke="${T}" stroke-width="3.5"/>
      <ellipse cx="100" cy="140" rx="52" ry="42" fill="${c.main}" stroke="${T}" stroke-width="4"/>
      ${atras}
      <ellipse cx="100" cy="148" rx="31" ry="27" fill="${c.panza}"/>
      <ellipse cx="52" cy="136" rx="9" ry="14" fill="${c.main}" stroke="${T}" stroke-width="3.5" transform="rotate(30 52 136)"/>
      <ellipse cx="148" cy="136" rx="9" ry="14" fill="${c.main}" stroke="${T}" stroke-width="3.5" transform="rotate(-30 148 136)"/>
      ${cabeza}
      <ellipse cx="100" cy="82" rx="50" ry="42" fill="${c.main}" stroke="${T}" stroke-width="4"/>
      <ellipse cx="68" cy="96" rx="8" ry="5" fill="#FF8FAE" opacity=".8"/>
      <ellipse cx="132" cy="96" rx="8" ry="5" fill="#FF8FAE" opacity=".8"/>
      ${cejas}${ojos}${boca}${manchas}
    </g>
  </svg>`;
}

/* ======================= Utilidades de interfaz ======================= */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function avisar(txt, clase = ''){
  const d = document.createElement('div');
  d.className = 'aviso ' + clase; d.textContent = txt;
  $('#avisos').appendChild(d);
  setTimeout(() => d.remove(), clase === 'nivel' ? 3600 : 2200);
}
function flotar(txt, x, y, color = '#FF7FA3'){
  const esc_ = $('#escenario'); if(!esc_) return;
  const d = document.createElement('div');
  d.className = 'flota'; d.textContent = txt; d.style.left = x + 'px'; d.style.top = y + 'px'; d.style.color = color;
  d.style.webkitTextStroke = '1.5px #22304A';
  esc_.appendChild(d); setTimeout(() => d.remove(), 1100);
}
function humor(){
  const n = S.nec, prom = (n.hambre + n.limpieza + n.animo + n.energia) / 4;
  if(n.hambre < 20 || n.animo < 20 || prom < 35) return 'mal';
  if(prom > 68 && n.animo > 60) return 'feliz';
  return 'bien';
}
function frase(){
  const n = S.nec;
  if(S.durmiendo) return null;
  if(n.hambre < 25) return '¡Tengo hambre!';
  if(n.energia < 20) return 'Tengo sueño...';
  if(n.limpieza < 25) return 'Necesito un baño';
  if(n.animo < 25) return '¿Jugamos?';
  return null;
}
function colorBarra(v){ return v > 60 ? 'var(--verde)' : v > 30 ? 'var(--ambar)' : 'var(--rojo)'; }

/* ======================= Pantalla de elección ======================= */
let elegido = null;
function pintarEleccion(){
  $('#app').innerHTML = `
    <div class="eleccion">
      <div class="titulo"><h1>Sorlandia</h1><p>Elegí a tu primer compañero. Lo vas a cuidar, malcriar y, más adelante, entrenar para pelear.</p></div>
      <div class="iniciales">
        ${Object.keys(ESPECIES).map(k => `<button class="inicial" data-esp="${k}" aria-pressed="false">
          ${svgCriatura(k,{humor:'feliz'})}<h2>${ESPECIES[k].nombre}</h2><span class="tipo ${ESPECIES[k].tipo}">${ESPECIES[k].tipoNom}</span></button>`).join('')}
      </div>
      <div class="panel ficha" id="ficha"><p style="text-align:center;font-weight:700;color:var(--tinta-suave)">Tocá uno para conocerlo.</p></div>
      <p class="pie" id="cuenta"></p>
    </div>`;
  pintarCuenta();
  document.querySelectorAll('.inicial').forEach(b => b.onclick = () => {
    elegido = b.dataset.esp;
    document.querySelectorAll('.inicial').forEach(x => x.setAttribute('aria-pressed', x === b));
    const e = ESPECIES[elegido];
    const fav = COMIDAS.filter(c => c.gusta === e.tipo).map(c => c.nom.toLowerCase()).join(' y ');
    $('#ficha').innerHTML = `
      <h2 style="font-size:1.6rem">${e.nombre} <span class="tipo ${e.tipo}">${e.tipoNom}</span></h2>
      <p>${e.desc}</p>
      <p style="font-size:.88rem;color:var(--tinta-suave)"><b>Comida favorita:</b> ${fav}. <b>Arranca con:</b> Vida ${e.base.vida} · Fuerza ${e.base.fuerza} · Velocidad ${e.base.velocidad}</p>
      <label for="nombre">¿Cómo le vas a decir?</label>
      <input id="nombre" maxlength="16" value="${e.nombre}" autocomplete="off">
      <button class="grande" id="empezar">¡Elegir a ${e.nombre}!</button>`;
    $('#empezar').onclick = () => {
      const nom = $('#nombre').value.trim().slice(0,16);
      S = nuevaPartida(elegido, nom);
      guardar(); pintarJuego(); bonoDiario();
      avisar(`¡${S.nombre} ya vive con vos!`);
    };
  });
}

/* ======================= Pantalla principal ======================= */
function pintarJuego(){
  const e = ESPECIES[S.especie];
  $('#app').innerHTML = `
    <header class="panel top">
      <div class="quien"><h1 id="nom"></h1><span class="tipo ${e.tipo}">${e.nombre} · ${e.tipoNom}</span></div>
      <div class="nivel"><b id="niv"></b><div class="xpbar" title="Experiencia"><i id="xp"></i></div></div>
      <div class="monedas" title="Monedas"><span class="moneda">$</span><span id="mon"></span></div>
    </header>
    <section class="escenario" id="escenario" aria-label="La casa">
      <div class="pared" id="pared"><div class="ventana"></div></div>
      <div class="piso" id="piso"></div>
      <div id="muebles"></div>
      <div class="bichito" id="bichito" role="button" aria-label="Acariciar"></div>
      <div id="extra"></div>
      <div class="oscuro"></div>
    </section>
    <section class="panel necesidades">
      ${NEC.map(n => `<div class="nec"><header><span>${n.nom}</span><span id="v-${n.k}"></span></header><div class="barra"><i id="b-${n.k}"></i></div></div>`).join('')}
      <div class="stats"><span class="rotulo">Para los combates que vienen</span>
        <span class="chip">Vida <b id="s-vida"></b></span><span class="chip">Fuerza <b id="s-fuerza"></b></span><span class="chip">Velocidad <b id="s-velocidad"></b></span></div>
    </section>
    <nav class="acciones">
      <button class="accion" id="a-comer"><span class="ic">🍽️</span>Comer</button>
      <button class="accion" id="a-banio"><span class="ic">🛁</span>Bañar</button>
      <button class="accion" id="a-jugar"><span class="ic">⚽</span>Jugar</button>
      <button class="accion" id="a-entrenar"><span class="ic">💪</span>Entrenar</button>
      <button class="accion" id="a-dormir"><span class="ic">🌙</span>Dormir</button>
    </nav>
    <nav class="nav">
      <button id="n-tienda">Tienda</button>
      <button id="n-mochila">Mochila</button>
      <button id="n-decorar">Decorar</button>
    </nav>
    <p class="pie">Tocá a tu bicho para mimarlo.</p>
    <p class="pie" id="cuenta"></p>`;
  $('#bichito').onclick = acariciar;
  $('#a-comer').onclick = () => abrirHoja('comida');
  $('#a-banio').onclick = empezarBanio;
  $('#a-jugar').onclick = empezarJuego;
  $('#a-entrenar').onclick = entrenar;
  $('#a-dormir').onclick = dormir;
  $('#n-tienda').onclick = () => abrirHoja('tienda');
  $('#n-mochila').onclick = () => abrirHoja('mochila');
  $('#n-decorar').onclick = () => modo === 'decorar' ? salirModo() : empezarDecorar();
  claveBicho = '';
  pintarTodo(); pintarCuenta();
}

let claveBicho = '';
function pintarTodo(){
  if(!S){ pintarEleccion(); return; }
  if(!$('#escenario')){ pintarJuego(); return; }
  $('#nom').textContent = S.nombre;
  $('#niv').textContent = 'Nivel ' + S.nivel;
  $('#xp').style.width = (S.xp / xpPara(S.nivel) * 100) + '%';
  $('#mon').textContent = S.monedas;
  NEC.forEach(n => {
    const v = Math.round(S.nec[n.k]);
    $('#v-'+n.k).textContent = v;
    const b = $('#b-'+n.k); b.style.width = v + '%'; b.style.background = colorBarra(v);
  });
  ['vida','fuerza','velocidad'].forEach(k => $('#s-'+k).textContent = Math.floor(S.stats[k]));
  // fondo
  const f = POR_ID[S.fondo] || FONDOS[0];
  $('#pared').style.background = f.pared; $('#piso').style.background = f.piso;
  $('#escenario').classList.toggle('noche', S.durmiendo);
  // botones
  const ocupado = modo === 'banio' || modo === 'jugar';
  ['comer','banio','jugar','entrenar'].forEach(k => $('#a-'+k).disabled = S.durmiendo || ocupado);
  $('#a-dormir').disabled = ocupado;
  $('#a-dormir').classList.toggle('activa', S.durmiendo);
  $('#a-dormir').innerHTML = S.durmiendo ? '<span class="ic">☀️</span>Despertar' : '<span class="ic">🌙</span>Dormir';
  $('#n-decorar').textContent = modo === 'decorar' ? 'Listo' : 'Decorar';
  pintarBicho();
  if(modo !== 'decorar') pintarMuebles();
}

function pintarBicho(){
  const sucio = modo === 'banio' ? 0 : clamp((60 - S.nec.limpieza) / 60, 0, 1);
  const h = humor();
  const fr = modo ? null : frase();
  const clave = [S.especie,h,S.durmiendo,Math.round(sucio*4),S.puesto,fr].join('|');
  if(clave === claveBicho) return;
  claveBicho = clave;
  const b = $('#bichito');
  b.innerHTML = svgCriatura(S.especie, {humor:h, dormido:S.durmiendo, sucio});
  if(S.puesto){
    const a = POR_ID[S.puesto];
    const d = document.createElement('div');
    d.className = 'accesorio'; d.textContent = a.em;
    d.style.top = a.ojos ? '27%' : '-6%';
    if(a.ojos) d.style.fontSize = '52px';
    b.appendChild(d);
  }
  const extra = $('#extra');
  extra.querySelectorAll('.globo,.zzz').forEach(x => x.remove());
  if(S.durmiendo){ const z = document.createElement('div'); z.className = 'zzz'; z.textContent = 'z z'; extra.appendChild(z); }
  else if(fr){ const g = document.createElement('div'); g.className = 'globo'; g.textContent = fr; extra.appendChild(g); }
}

function pintarMuebles(){
  const cont = $('#muebles'); cont.innerHTML = '';
  S.casa.forEach((m, i) => {
    const it = POR_ID[m.id]; if(!it) return;
    const d = document.createElement('div');
    d.className = 'mueble' + (it.pared ? ' pared-item' : '');
    m.y = it.pared ? clamp(m.y, 14, 60) : clamp(m.y, 74, 99);
    d.style.left = m.x + '%'; d.style.top = m.y + '%';
    d.style.fontSize = (it.tam || 64) + 'px';
    d.dataset.i = i; d.textContent = it.em;
    d.style.zIndex = it.pared ? 1 : (m.y > 85 ? 5 : 2);
    if(modo === 'decorar'){
      const q = document.createElement('button');
      q.className = 'quitar'; q.textContent = '×'; q.setAttribute('aria-label', 'Guardar ' + it.nom);
      q.onpointerdown = ev => ev.stopPropagation();
      q.onclick = ev => { ev.stopPropagation(); S.casa.splice(i,1); S.inv.muebles[m.id] = (S.inv.muebles[m.id]||0) + 1; guardar(); pintarMuebles(); };
      d.appendChild(q);
      d.onpointerdown = arrastrar;
    }
    cont.appendChild(d);
  });
}

/* ======================= Acciones ======================= */
let ultimaCaricia = 0;
function acariciar(ev){
  if(modo || S.durmiendo) return;
  const r = $('#escenario').getBoundingClientRect();
  flotar('♥', ev.clientX - r.left - 8, ev.clientY - r.top - 20);
  if(Date.now() - ultimaCaricia < 3000) return;
  ultimaCaricia = Date.now();
  S.nec.animo = clamp(S.nec.animo + 3); sumarXP(1);
  guardar(); pintarTodo();
}

function darComida(id){
  const c = POR_ID[id];
  if(!S.inv.comida[id]) return;
  if(S.nec.hambre >= 95){ avisar(`${S.nombre} está lleno, no quiere más`); return; }
  S.inv.comida[id]--; if(!S.inv.comida[id]) delete S.inv.comida[id];
  const fav = c.gusta === ESPECIES[S.especie].tipo;
  S.nec.hambre = clamp(S.nec.hambre + c.hambre);
  S.nec.animo = clamp(S.nec.animo + c.animo + (fav ? 10 : 0));
  if(c.energia) S.nec.energia = clamp(S.nec.energia + c.energia);
  S.stats.vida += fav ? .6 : .3;
  sumarXP(fav ? 6 : 4);
  cerrarHoja();
  const b = $('#bichito'); b.classList.remove('saltando'); void b.offsetWidth; b.classList.add('saltando');
  setTimeout(() => b.classList.remove('saltando'), 1400);
  const r = $('#escenario').getBoundingClientRect();
  flotar(c.em, r.width/2 - 14, 110, '#22304A');
  if(fav) setTimeout(() => flotar('♥ ¡Mi favorita!', r.width/2 - 60, 90), 250);
  guardar(); pintarTodo();
}

function entrenar(){
  if(S.nec.energia < 20){ avisar(`${S.nombre} está muy cansado para entrenar`); return; }
  if(S.nec.hambre < 20){ avisar(`Con la panza vacía no se entrena`); return; }
  S.nec.energia = clamp(S.nec.energia - 15);
  S.nec.hambre = clamp(S.nec.hambre - 8);
  S.nec.limpieza = clamp(S.nec.limpieza - 6);
  const bien = S.nec.animo > 50 ? 1 : .5;
  S.stats.fuerza += bien;
  sumarXP(8); ganar(5);
  const b = $('#bichito'); b.classList.remove('entrenando'); void b.offsetWidth; b.classList.add('entrenando');
  setTimeout(() => b.classList.remove('entrenando'), 1900);
  const r = $('#escenario').getBoundingClientRect();
  flotar(bien === 1 ? '+1 Fuerza' : '+½ Fuerza', r.width/2 - 40, 100, '#F47A45');
  if(bien < 1) setTimeout(() => avisar('Entrena mejor cuando está de buen ánimo'), 400);
  guardar(); pintarTodo();
}

function dormir(){
  S.durmiendo = !S.durmiendo;
  avisar(S.durmiendo ? `Buenas noches, ${S.nombre}` : `¡Arriba, ${S.nombre}!`);
  guardar(); pintarTodo();
}

/* ---- Baño: frotar las manchas ---- */
let manchas = [];
function empezarBanio(){
  if(S.nec.limpieza >= 92){ avisar(`${S.nombre} ya está limpito`); return; }
  modo = 'banio'; claveBicho = '';
  pintarTodo();
  const esc_ = $('#escenario'), r = esc_.getBoundingClientRect();
  const cx = r.width/2, base = r.height - 16 - 190;
  const n = Math.max(3, Math.round((100 - S.nec.limpieza) / 12));
  const puntos = [[70,150],[128,160],[118,62],[80,112],[100,140],[140,120],[62,80],[132,90],[96,170],[110,40]];
  manchas = [];
  const extra = $('#extra');
  for(let i = 0; i < n && i < puntos.length; i++){
    const [px,py] = puntos[i];
    const x = cx - 95 + px*.95, y = base + py*.95;
    const d = document.createElement('div'); d.className = 'mancha';
    d.style.left = (x - 15) + 'px'; d.style.top = (y - 12) + 'px';
    extra.appendChild(d); manchas.push({x, y, vida:1, el:d});
  }
  barraModo(`Frotá las manchas · ${manchas.length}`, 'Terminar', terminarBanio);
  esc_.style.touchAction = 'none';
  esc_.addEventListener('pointerdown', frotar); esc_.addEventListener('pointermove', frotar);
}
function frotar(ev){
  if(modo !== 'banio') return;
  if(ev.type === 'pointermove' && ev.buttons === 0 && ev.pointerType === 'mouse') return;
  const r = $('#escenario').getBoundingClientRect();
  const x = ev.clientX - r.left, y = ev.clientY - r.top;
  manchas.forEach(m => {
    if(m.vida <= 0) return;
    if(Math.hypot(m.x - x, m.y - y) < 30){
      m.vida -= .12; m.el.style.opacity = Math.max(0, m.vida * .85);
      if(Math.random() < .35){
        const e = document.createElement('div'); e.className = 'espuma';
        e.style.left = (x - 7 + (Math.random()*20-10)) + 'px'; e.style.top = (y - 7) + 'px';
        $('#extra').appendChild(e); setTimeout(() => e.remove(), 900);
      }
      if(m.vida <= 0){ m.el.remove(); ganar(4); flotar('+4', m.x - 8, m.y - 20, '#E8A900'); $('#mon').textContent = S.monedas; }
    }
  });
  const quedan = manchas.filter(m => m.vida > 0).length;
  const t = $('.barra-modo span'); if(t) t.textContent = quedan ? `Frotá las manchas · ${quedan}` : '¡Reluciente!';
  if(!quedan) terminarBanio();
}
function terminarBanio(){
  if(modo !== 'banio') return;
  const limpias = manchas.filter(m => m.vida <= 0).length, total = manchas.length;
  const esc_ = $('#escenario');
  esc_.removeEventListener('pointerdown', frotar); esc_.removeEventListener('pointermove', frotar);
  esc_.style.touchAction = '';
  S.nec.limpieza = clamp(S.nec.limpieza + (100 - S.nec.limpieza) * (total ? limpias/total : 1));
  if(S.especie === 'rufisor' && limpias === total) { S.nec.animo = clamp(S.nec.animo + 12); avisar('A Rufisor le encanta el agua: +ánimo'); }
  sumarXP(3 + limpias);
  salirModo(); guardar();
}

/* ---- Jugar: atrapar la pelota ---- */
let juego = null;
function empezarJuego(){
  if(S.nec.energia < 15){ avisar(`${S.nombre} no tiene energía para jugar`); return; }
  modo = 'jugar'; claveBicho = ''; pintarTodo();
  const esc_ = $('#escenario');
  const p = document.createElement('button'); p.className = 'pelota'; p.setAttribute('aria-label','Pelota');
  $('#extra').appendChild(p);
  juego = {toques:0, fin: Date.now() + 15000, pel:p};
  const mover = () => {
    const r = esc_.getBoundingClientRect();
    p.style.left = (30 + Math.random()*(r.width - 60)) + 'px';
    p.style.top = (60 + Math.random()*(r.height - 100)) + 'px';
  };
  mover();
  const vel = Math.max(520, 950 - S.stats.velocidad * 12);
  juego.int = setInterval(mover, vel);
  p.onpointerdown = ev => {
    ev.preventDefault();
    juego.toques++; ganar(2);
    const r = esc_.getBoundingClientRect();
    flotar('+2', ev.clientX - r.left - 8, ev.clientY - r.top - 24, '#E8A900');
    $('#mon').textContent = S.monedas; mover();
  };
  barraModo('¡Atrapá la pelota! 15', 'Parar', terminarJuego);
  juego.reloj = setInterval(() => {
    const s = Math.max(0, Math.ceil((juego.fin - Date.now())/1000));
    const t = $('.barra-modo span'); if(t) t.textContent = `¡Atrapá la pelota! ${s} · ${juego.toques} toques`;
    if(s <= 0) terminarJuego();
  }, 250);
}
function terminarJuego(){
  if(modo !== 'jugar' || !juego) return;
  clearInterval(juego.int); clearInterval(juego.reloj);
  const t = juego.toques; juego = null;
  S.nec.animo = clamp(S.nec.animo + Math.min(35, 8 + t*2));
  S.nec.energia = clamp(S.nec.energia - 12);
  S.nec.hambre = clamp(S.nec.hambre - 5);
  S.nec.limpieza = clamp(S.nec.limpieza - 5);
  const vel = t >= 12 ? 1 : t >= 6 ? .5 : 0;
  S.stats.velocidad += vel;
  sumarXP(4 + t);
  salirModo(); guardar();
  avisar(`${t} toques · +${t*2} monedas` + (vel ? ` · +${vel === 1 ? 1 : '½'} Velocidad` : ''));
}

/* ---- Decorar: arrastrar muebles ---- */
function empezarDecorar(){
  cerrarHoja();
  modo = 'decorar'; claveBicho = '';
  $('#escenario').classList.add('decorando');
  barraModo('Arrastrá los muebles', 'Listo', salirModo);
  pintarTodo(); pintarMuebles();
}
function arrastrar(ev){
  const el = ev.currentTarget, i = +el.dataset.i, m = S.casa[i];
  const esc_ = $('#escenario'), r = esc_.getBoundingClientRect();
  ev.preventDefault();
  el.setPointerCapture(ev.pointerId);
  el.style.cursor = 'grabbing';
  const mover = e => {
    m.x = clamp((e.clientX - r.left) / r.width * 100, 6, 94);
    const y = (e.clientY - r.top + 20) / r.height * 100;
    m.y = POR_ID[m.id].pared ? clamp(y, 14, 60) : clamp(y, 74, 99);
    el.style.left = m.x + '%'; el.style.top = m.y + '%';
  };
  const soltar = () => {
    el.removeEventListener('pointermove', mover); el.removeEventListener('pointerup', soltar); el.removeEventListener('pointercancel', soltar);
    el.style.cursor = ''; guardar(); pintarMuebles();
  };
  el.addEventListener('pointermove', mover); el.addEventListener('pointerup', soltar); el.addEventListener('pointercancel', soltar);
}

function barraModo(txt, btn, fn){
  $('#extra').querySelectorAll('.barra-modo').forEach(x => x.remove());
  const d = document.createElement('div'); d.className = 'barra-modo';
  d.innerHTML = `<span></span><button></button>`;
  d.querySelector('span').textContent = txt; d.querySelector('button').textContent = btn;
  d.querySelector('button').onclick = ev => { ev.stopPropagation(); fn(); };
  d.onpointerdown = ev => ev.stopPropagation();
  $('#extra').appendChild(d);
}
function salirModo(){
  modo = null; claveBicho = '';
  const esc_ = $('#escenario'); if(esc_) esc_.classList.remove('decorando');
  const ex = $('#extra'); if(ex) ex.querySelectorAll('.barra-modo,.mancha,.pelota,.espuma').forEach(x => x.remove());
  pintarTodo();
}

/* ======================= Hojas: comida, tienda, mochila ======================= */
let hojaActual = null, pestana = {tienda:'comida', mochila:'comida'};
function abrirHoja(tipo){
  if(modo === 'decorar' && tipo !== 'mochila') salirModo();
  hojaActual = tipo;
  let velo = $('#velo');
  if(!velo){
    velo = document.createElement('div'); velo.id = 'velo'; velo.className = 'velo';
    velo.onclick = e => { if(e.target === velo) cerrarHoja(); };
    document.body.appendChild(velo);
  }
  pintarHoja();
}
function cerrarHoja(){ const v = $('#velo'); if(v) v.remove(); hojaActual = null; }
document.addEventListener('keydown', e => { if(e.key === 'Escape') cerrarHoja(); });

function pintarHoja(){
  const v = $('#velo'); if(!v) return;
  const tipoBicho = ESPECIES[S.especie].tipo;
  let titulo, pest = '', cuerpo = '';
  const mon = `<div class="monedas"><span class="moneda">$</span><span>${S.monedas}</span></div>`;
  if(hojaActual === 'comida'){
    titulo = '¿Qué le das?';
    const ids = Object.keys(S.inv.comida);
    cuerpo = ids.length ? ids.map(id => {
      const c = POR_ID[id], fav = c.gusta === tipoBicho;
      return `<div class="item ${fav?'favorito':''}"><span class="em">${c.em}</span><h3>${c.nom}</h3>
        ${fav ? '<span class="etiqueta">Favorita</span>' : ''}
        <p>Panza +${c.hambre}${c.animo?` · Ánimo +${c.animo + (fav?10:0)}`:''}${c.energia?` · Energía +${c.energia}`:''}</p>
        <p class="precio">Tenés ${S.inv.comida[id]}</p>
        <button class="btn" data-dar="${id}">Darle</button></div>`;
    }).join('') : `<div class="vacio">No tenés comida. Pasá por la tienda.</div>`;
    cuerpo += `<button class="item" data-ir="tienda" style="justify-content:center;align-items:center;background:var(--cielo)"><span class="em">🛒</span><h3>Comprar más</h3></button>`;
  } else if(hojaActual === 'tienda'){
    titulo = 'Tienda';
    const tabs = [['comida','Comida'],['muebles','Muebles'],['accesorios','Accesorios'],['fondos','Casa']];
    pest = `<div class="pestanas" role="tablist">${tabs.map(([k,n]) => `<button role="tab" data-tab="${k}" aria-selected="${pestana.tienda===k}">${n}</button>`).join('')}</div>`;
    const lista = {comida:COMIDAS, muebles:MUEBLES, accesorios:ACCESORIOS, fondos:FONDOS}[pestana.tienda];
    cuerpo = lista.map(it => {
      const bloq = S.nivel < it.nivel;
      const tiene = (pestana.tienda === 'accesorios' && S.inv.accesorios.includes(it.id)) || (pestana.tienda === 'fondos' && S.inv.fondos.includes(it.id));
      const fav = it.gusta === tipoBicho;
      let btn;
      if(bloq) btn = `<button class="btn" disabled>Nivel ${it.nivel}</button>`;
      else if(tiene) btn = `<button class="btn" disabled>Ya lo tenés</button>`;
      else btn = `<button class="btn" data-comprar="${it.id}" ${S.monedas < it.precio ? 'disabled' : ''}>${S.monedas < it.precio ? 'No alcanza' : 'Comprar'}</button>`;
      const muestra = pestana.tienda === 'fondos'
        ? `<span style="display:block;width:100%;height:42px;border:2px solid var(--tinta);border-radius:8px;background:linear-gradient(transparent 62%,transparent 62%),${it.pared};position:relative;overflow:hidden"><span style="position:absolute;inset:62% 0 0 0;background:${it.piso};border-top:2px solid var(--tinta)"></span></span>`
        : `<span class="em" style="${bloq?'filter:grayscale(1);opacity:.5':''}">${it.em}</span>`;
      return `<div class="item ${fav?'favorito':''}">${muestra}<h3>${it.nom}</h3>${fav?'<span class="etiqueta">Favorita</span>':''}<p>${it.desc}</p>
        <span class="precio"><span class="moneda">$</span>${it.precio}</span>${btn}</div>`;
    }).join('');
  } else {
    titulo = 'Mochila';
    const tabs = [['comida','Comida'],['muebles','Muebles'],['accesorios','Accesorios'],['fondos','Casa']];
    pest = `<div class="pestanas" role="tablist">${tabs.map(([k,n]) => `<button role="tab" data-tab="${k}" aria-selected="${pestana.mochila===k}">${n}</button>`).join('')}</div>`;
    const t = pestana.mochila;
    if(t === 'comida'){
      const ids = Object.keys(S.inv.comida);
      cuerpo = ids.length ? ids.map(id => { const c = POR_ID[id]; return `<div class="item"><span class="em">${c.em}</span><h3>${c.nom}</h3><p class="precio">Tenés ${S.inv.comida[id]}</p><button class="btn" data-dar="${id}" ${S.durmiendo?'disabled':''}>Darle</button></div>`; }).join('') : '<div class="vacio">Sin comida guardada.</div>';
    } else if(t === 'muebles'){
      const ids = Object.keys(S.inv.muebles).filter(id => S.inv.muebles[id] > 0);
      const max = 4 + S.nivel*2, lleno = S.casa.length >= max;
      cuerpo = `<p class="vacio" style="padding:4px;grid-column:1/-1">En la casa: ${S.casa.length} de ${max} lugares. Cada nivel suma 2.</p>` +
        (ids.length ? ids.map(id => { const m = POR_ID[id]; return `<div class="item"><span class="em">${m.em}</span><h3>${m.nom}</h3><p class="precio">Guardados: ${S.inv.muebles[id]}</p><button class="btn" data-poner="${id}" ${lleno?'disabled':''}>${lleno?'Casa llena':'Poner en la casa'}</button></div>`; }).join('') : '<div class="vacio">Todo lo que compraste ya está en la casa.</div>');
    } else if(t === 'accesorios'){
      cuerpo = S.inv.accesorios.length ? S.inv.accesorios.map(id => { const a = POR_ID[id], puesto = S.puesto === id; return `<div class="item ${puesto?'favorito':''}"><span class="em">${a.em}</span><h3>${a.nom}</h3><button class="btn" data-poner-acc="${id}">${puesto?'Sacárselo':'Ponérselo'}</button></div>`; }).join('') : '<div class="vacio">Todavía no tenés accesorios.</div>';
    } else {
      cuerpo = S.inv.fondos.map(id => { const f = POR_ID[id], usado = S.fondo === id; return `<div class="item ${usado?'favorito':''}"><span style="display:block;width:100%;height:42px;border:2px solid var(--tinta);border-radius:8px;background:${f.pared};position:relative;overflow:hidden"><span style="position:absolute;inset:62% 0 0 0;background:${f.piso};border-top:2px solid var(--tinta)"></span></span><h3>${f.nom}</h3><button class="btn" data-fondo="${id}" ${usado?'disabled':''}>${usado?'Puesto':'Usar'}</button></div>`; }).join('');
    }
  }
  v.innerHTML = `<div class="hoja" role="dialog" aria-label="${titulo}"><div class="hoja-cab"><h2>${titulo}</h2>${mon}<button class="cerrar" aria-label="Cerrar">×</button></div>${pest}<div class="grilla">${cuerpo}</div></div>`;
  v.querySelector('.cerrar').onclick = cerrarHoja;
  v.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { pestana[hojaActual] = b.dataset.tab; pintarHoja(); });
  v.querySelectorAll('[data-dar]').forEach(b => b.onclick = () => darComida(b.dataset.dar));
  v.querySelectorAll('[data-ir]').forEach(b => b.onclick = () => { hojaActual = b.dataset.ir; pestana.tienda = 'comida'; pintarHoja(); });
  v.querySelectorAll('[data-comprar]').forEach(b => b.onclick = () => comprar(b.dataset.comprar));
  v.querySelectorAll('[data-poner]').forEach(b => b.onclick = () => ponerMueble(b.dataset.poner));
  v.querySelectorAll('[data-poner-acc]').forEach(b => b.onclick = () => { const id = b.dataset.ponerAcc; S.puesto = S.puesto === id ? null : id; claveBicho=''; guardar(); pintarTodo(); pintarHoja(); });
  v.querySelectorAll('[data-fondo]').forEach(b => b.onclick = () => { S.fondo = b.dataset.fondo; guardar(); pintarTodo(); pintarHoja(); });
}

function comprar(id){
  const it = POR_ID[id];
  if(S.monedas < it.precio || S.nivel < it.nivel) return;
  S.monedas -= it.precio;
  if(COMIDAS.includes(it)) S.inv.comida[id] = (S.inv.comida[id]||0) + 1;
  else if(MUEBLES.includes(it)) S.inv.muebles[id] = (S.inv.muebles[id]||0) + 1;
  else if(ACCESORIOS.includes(it)) S.inv.accesorios.push(id);
  else { S.inv.fondos.push(id); S.fondo = id; }
  sumarXP(2);
  avisar(`Compraste: ${it.nom}`);
  guardar(); pintarTodo(); pintarHoja();
}
function ponerMueble(id){
  if(!S.inv.muebles[id]) return;
  if(S.casa.length >= 4 + S.nivel*2) return;
  S.inv.muebles[id]--; if(!S.inv.muebles[id]) delete S.inv.muebles[id];
  const it = POR_ID[id];
  S.casa.push({id, x: 20 + Math.random()*60, y: it.pared ? 40 : 88});
  guardar(); empezarDecorar();
}

/* ======================= Bono diario y reloj ======================= */
function bonoDiario(){
  if(!S || S.ultimoBono === hoy()) return;
  const primera = !S.ultimoBono;
  S.ultimoBono = hoy();
  if(!primera){ S.monedas += 60; avisar('Bono del día: +60 monedas'); }
  guardar(); pintarTodo();
}
setInterval(() => {
  if(!S) return;
  avanzarTiempo();
  if(S.durmiendo && S.nec.energia >= 100){ S.durmiendo = false; avisar(`${S.nombre} se despertó descansado`); }
  pintarTodo(); guardar();
}, 15000);
document.addEventListener('visibilitychange', () => { if(!document.hidden && S){ avanzarTiempo(); bonoDiario(); pintarTodo(); } });

/* ======================= Arranque ======================= */
S = leerLocal();
if(S){ avanzarTiempo(); pintarJuego(); bonoDiario(); }
else pintarEleccion();
conectarNube();
})();
