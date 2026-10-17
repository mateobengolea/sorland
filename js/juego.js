'use strict';
/* =====================================================================
   La casa del entrenador, la creación del personaje, el Market, la
   mochila y el arranque del juego. Se carga último.
   ===================================================================== */

const INICIALES = ['carosor', 'matesor', 'rufisor'];

/* ---------------- Decoración ---------------- */
const PELUCHES = ['carosor', 'matesor', 'rufisor', 'chispulo', 'carpinchito', 'pampito', 'nubarron', 'pinguinito', 'vaquitita', 'zorrolumbre', 'honguito', 'yaguarayo'];
const MUEBLES = [
  {id:'planta', nom:'Cactus', em:'🌵', tam:72, precio:40, desc:'Un toque verde que no hay que regar.'},
  {id:'silla', nom:'Silla', em:'🪑', tam:84, precio:50, desc:'Para sentarse a charlar.'},
  {id:'cuadro', nom:'Cuadro', em:'🖼️', tam:54, precio:60, pared:true, desc:'Va colgado en la pared.'},
  {id:'lampara', nom:'Lámpara', em:'🪔', tam:86, precio:80, desc:'Luz cálida de noche.'},
  {id:'reloj', nom:'Reloj de pared', em:'🕰️', tam:54, precio:90, pared:true, desc:'Tic, tac.'},
  {id:'guitarra', nom:'Guitarra', em:'🎸', tam:92, precio:120, desc:'Para el fogón.'},
  {id:'sillon', nom:'Sillón', em:'🛋️', tam:124, precio:150, desc:'Mullido y enorme.'},
  {id:'tele', nom:'Tele', em:'📺', tam:96, precio:200, medallas:1, desc:'Partidos y dibujitos.'},
  {id:'cama', nom:'Cama', em:'🛏️', tam:132, precio:220, medallas:1, desc:'Dormir como se debe.'},
  {id:'trofeo', nom:'Trofeo', em:'🏆', tam:58, precio:300, medallas:2, desc:'Para lucirse.'},
  {id:'copa', nom:'Copa del Campeón', svg:() => svgCopa(100), tam:96, precio:0, oculto:true, desc:'Solo para quien le gana a la Campeona.'},
  {id:'vitrina', nom:'Vitrina de medallas', svg:() => svgVitrina(S.medallas), tam:120, precio:250, desc:'Muestra las medallas que vas ganando.'},
  ...PELUCHES.map((e, i) => ({id:'peluche_' + e, nom:'Peluche de ' + ESPECIES[e].nombre, peluche:true, svg:() => svgPeluche(e), tam:78,
    precio: 120 + (i % 4) * 30 + (e === 'yaguarayo' ? 200 : 0), medallas: e === 'yaguarayo' ? 3 : i >= 8 ? 2 : i >= 4 ? 1 : 0, desc:'Suavecito, para decorar la casa.'})),
];
const FONDOS = [
  {id:'durazno', nom:'Durazno', precio:0, pared:'#FBDCC4', piso:'repeating-linear-gradient(90deg,#D49A62 0 46px,#C68A52 46px 48px)', desc:'La casa de siempre.'},
  {id:'menta', nom:'Menta', precio:120, pared:'repeating-linear-gradient(90deg,#CFEEDC 0 22px,#C1E6D1 22px 44px)', piso:'repeating-linear-gradient(90deg,#B98B6A 0 46px,#A87B5B 46px 48px)', desc:'Rayas frescas.'},
  {id:'lavanda', nom:'Lavanda', precio:160, medallas:1, pared:'radial-gradient(circle at 12px 12px,#D3C6F0 3px,transparent 4px) 0 0/24px 24px,#E6DEF8', piso:'repeating-conic-gradient(#F2EEF9 0 25%,#CFC4E6 0 50%) 0 0/40px 40px', desc:'Lunares y damero.'},
  {id:'cancha', nom:'Canchita', precio:220, medallas:2, pared:'linear-gradient(#9FD4F5,#D8F0FF)', piso:'repeating-linear-gradient(90deg,#5DBB63 0 40px,#4FAE56 40px 80px)', desc:'Para correr un rato.'},
  {id:'estrellas', nom:'Noche estrellada', precio:300, medallas:3, pared:'radial-gradient(circle at 30px 20px,#FFF6B0 2px,transparent 3px) 0 0/70px 60px,radial-gradient(circle at 10px 45px,#fff 1.5px,transparent 2.5px) 0 0/50px 70px,#2C3A73', piso:'repeating-linear-gradient(90deg,#4A3E6E 0 46px,#3D3260 46px 48px)', desc:'Siempre de noche.'},
];
const POR_ID = {};
[...MUEBLES, ...FONDOS, ...OBJETOS].forEach(x => POR_ID[x.id] = x);
const bloqueado = it => (it.medallas || 0) > cantMedallas();

/* ---------------- Partida nueva y migración ---------------- */
function nuevaPartida(entrenador, especie, nombre){
  const c = nuevaCriatura(especie, 5, {nombre: nombre || ESPECIES[especie].nombre});
  return migrar({
    v: 3, entrenador, creada: Date.now(), guardado: Date.now(), monedas: 300,
    equipo: [c], reserva: [], album: {vistos: {[especie]: true}, capt: {[especie]: 1}, shiny: {}},
    inv: {objetos: {capsula: 5, jarabe: 3}, muebles: {silla: 1}, fondos: ['durazno']},
    casa: [{id: 'planta', x: 86, y: 90}], fondo: 'durazno', mundo: null,
    vencidos: {}, medallas: {}, respawn: null, recogidos: {}, regalos: {}, legendarios: {}, ultimoBono: null, duelos: {ganados: 0, perdidos: 0},
  });
}
// Pasa partidas de versiones anteriores al formato actual.
function migrar(p){
  if(!p) return p;
  p.inv = p.inv || {};
  if(!p.inv.objetos) p.inv.objetos = {capsula: 5, jarabe: 3};
  if(!p.inv.muebles) p.inv.muebles = {};
  if(!p.inv.fondos) p.inv.fondos = ['durazno'];
  if(!p.equipo) p.equipo = [];
  if(!p.reserva) p.reserva = [];
  if(!p.album) p.album = {vistos: {}, capt: {}};
  if(!p.album.shiny) p.album.shiny = {};
  if(!p.mundo) p.mundo = null;
  if(p.mundo && !p.mundo.mapa) p.mundo.mapa = 'ceibo';
  for(const k of ['vencidos', 'medallas', 'recogidos', 'regalos', 'legendarios']) if(!p[k]) p[k] = {};
  if(p.respawn === undefined) p.respawn = null;
  if(!p.duelos) p.duelos = {ganados: 0, perdidos: 0};
  if(!p.casa) p.casa = [];
  if(!p.fondo) p.fondo = 'durazno';
  if(!p.discos) p.discos = {};
  // Los iniciales de fuego y planta cambiaron de nombre: si no les pusiste apodo, se actualiza.
  const NOMBRES_VIEJOS = {Carosor: 'carosor', Carosaurio: 'carosaurio', 'Carotitán': 'carotitan', Matesor: 'matesor', Matesaurio: 'matesaurio', 'Matetitán': 'matetitan'};
  for(const c of [...p.equipo, ...p.reserva]) if(NOMBRES_VIEJOS[c.nombre] && ESPECIES[c.esp] && NOMBRES_VIEJOS[c.nombre] === c.esp) c.nombre = ESPECIES[c.esp].nombre;
  if((p.v || 1) < 3){
    // Antes el inicial era la mascota: ahora es la primera criatura del equipo.
    if(p.especie && ESPECIES[p.especie]){
      const st = p.stats || ESPECIES[p.especie].base;
      const ini = {uid: 'ini' + (p.creada || Date.now()).toString(36), esp: p.especie, nombre: p.nombre || ESPECIES[p.especie].nombre,
                   nivel: Math.max(5, p.nivel || 1), xp: p.xp || 0, hp: null, shiny: false,
                   stats: {vida: Math.floor(st.vida), fuerza: Math.floor(st.fuerza), velocidad: Math.floor(st.velocidad)}};
      if(ini.nivel > (p.nivel || 1)) Object.assign(ini.stats, statsPorNivel(ESPECIES[p.especie].base, ini.nivel));
      p.equipo.unshift(ini);
      p.album.capt[p.especie] = (p.album.capt[p.especie] || 0) + 1;
      p.album.vistos[p.especie] = true;
    }
    for(const c of [...p.equipo, ...p.reserva]){ if(c.shiny === undefined) c.shiny = false; if(!c.uid) c.uid = Math.random().toString(36).slice(2); }
    while(p.equipo.length > MAX_EQUIPO) p.reserva.push(p.equipo.pop());
    ['especie', 'nombre', 'nivel', 'xp', 'stats', 'hpIni', 'nec', 'durmiendo', 'puesto', 'ultimo'].forEach(k => delete p[k]);
    if(p.inv.comida) delete p.inv.comida;
    p.casa = p.casa.filter(m => POR_ID[m.id]);
    p.entrenador = p.entrenador || null;
    p.monedas = (p.monedas || 0) + 150;
  }
  // Evoluciones pendientes (por si una criatura subió de nivel en una versión vieja)
  for(const c of [...p.equipo, ...p.reserva]) while(ESPECIES[c.esp] && evolucionPendiente(c)) evolucionar(c);
  p.v = 3;
  return p;
}

/* ---------------- Crear el entrenador ---------------- */
let creador = null;
function pintarCreador(){
  vista = 'creador';
  const soloAspecto = !!(S && S.equipo && S.equipo.length);
  creador = creador || {paso: 'aspecto', aspecto: (S && S.entrenador) || aspectoPorDefecto(), inicial: null, soloAspecto};
  creador.soloAspecto = soloAspecto;
  const a = creador.aspecto;
  if(creador.paso === 'aspecto'){
    const fila = (clave, titulo, valores, muestra) => `<div class="cr-fila"><span class="rotulo-chico">${titulo}</span><div class="cr-opciones">
      ${valores.map(v => `<button data-k="${clave}" data-v="${v}" aria-pressed="${a[clave] === v}" aria-label="${titulo} ${esc(v)}">${muestra(v)}</button>`).join('')}</div></div>`;
    const color = v => `<span class="punto" style="background:${v}"></span>`;
    $('#app').innerHTML = `
      <div class="eleccion">
        <div class="titulo"><h1>Tu entrenador</h1><p>${soloAspecto ? 'Ahora sos un entrenador que viaja con su equipo. ¿Cómo te ves?' : 'Así te van a ver los demás jugadores en el mapa.'}</p></div>
        <div class="creador panel">
          <div class="cr-vista" id="cr-vista">${svgEntrenador(a)}</div>
          <div class="cr-controles">
            ${fila('piel', 'Piel', ASPECTO.piel, color)}
            ${fila('peinado', 'Peinado', ASPECTO.peinado, v => NOMBRES_PEINADO[v])}
            ${fila('pelo', 'Pelo', ASPECTO.pelo, color)}
            ${fila('ropa', 'Remera', ASPECTO.ropa, color)}
            ${fila('gorra', 'Gorra', ASPECTO.gorra, v => v === 'ninguna' ? 'Sin gorra' : color(v))}
          </div>
        </div>
        <button class="grande" id="cr-seguir">${soloAspecto ? '¡Listo!' : 'Seguir: elegí tu criatura'}</button>
        <p class="pie" id="cuenta"></p>
      </div>`;
    document.querySelectorAll('.cr-opciones button').forEach(b => b.onclick = () => {
      a[b.dataset.k] = b.dataset.v;
      document.querySelectorAll(`[data-k="${b.dataset.k}"]`).forEach(x => x.setAttribute('aria-pressed', x === b));
      $('#cr-vista').innerHTML = svgEntrenador(a);
    });
    $('#cr-seguir').onclick = () => {
      if(soloAspecto){ S.entrenador = {...a}; creador = null; guardar(); pintarJuego(); bonoDiario(); avisar('¡Listo! Ahora recorrés Sorlandia como entrenador.'); return; }
      creador.paso = 'inicial'; pintarCreador();
    };
  } else {
    $('#app').innerHTML = `
      <div class="eleccion">
        <div class="titulo"><h1>Tu primera criatura</h1><p>Te va a acompañar en todo el viaje. Elegí con el corazón.</p></div>
        <div class="iniciales">
          ${INICIALES.map(k => `<button class="inicial" data-esp="${k}" aria-pressed="${creador.inicial === k}">
            ${svgEspecie(k, {humor: 'feliz'})}<h2>${ESPECIES[k].nombre}</h2><span class="tipo ${ESPECIES[k].tipo}">${TIPOS[ESPECIES[k].tipo].nom}</span></button>`).join('')}
        </div>
        <div class="panel ficha" id="ficha"><p style="text-align:center;font-weight:700;color:var(--tinta-suave)">Tocá una para conocerla.</p></div>
        <button class="enlace" id="cr-volver" style="align-self:center">Volver al entrenador</button>
        <p class="pie" id="cuenta"></p>
      </div>`;
    $('#cr-volver').onclick = () => { creador.paso = 'aspecto'; pintarCreador(); };
    document.querySelectorAll('.inicial').forEach(b => b.onclick = () => { creador.inicial = b.dataset.esp; fichaInicial(); document.querySelectorAll('.inicial').forEach(x => x.setAttribute('aria-pressed', x === b)); });
    if(creador.inicial) fichaInicial();
  }
  pintarCuenta();
}
function fichaInicial(){
  const e = ESPECIES[creador.inicial], evo = [e.id, e.evol.a, ESPECIES[e.evol.a].evol.a].map(x => ESPECIES[x].nombre).join(' → ');
  $('#ficha').innerHTML = `
    <h2 style="font-size:1.6rem">${e.nombre} <span class="tipo ${e.tipo}">${TIPOS[e.tipo].nom}</span></h2>
    <p>${e.desc}</p>
    <p style="font-size:.88rem;color:var(--tinta-suave)"><b>Evoluciona:</b> ${evo}</p>
    <label for="nombre">¿Le querés poner un nombre?</label>
    <input id="nombre" maxlength="16" value="${e.nombre}" autocomplete="off">
    <button class="grande" id="empezar">¡Arrancar con ${e.nombre}!</button>`;
  $('#empezar').onclick = () => {
    const nom = $('#nombre').value.trim().slice(0, 16);
    S = nuevaPartida({...creador.aspecto}, creador.inicial, nom);
    creador = null;
    guardar(); pintarJuego(); bonoDiario();
    avisar(`¡${S.equipo[0].nombre} ya viaja con vos!`);
  };
}

/* ---------------- La casa ---------------- */
function cabeceraHTML(){
  const n = cantMedallas();
  return `<header class="panel top">
      <span class="top-avatar">${svgEntrenador(S.entrenador)}</span>
      <div class="quien"><h1 id="nom"></h1>${S.campeon ? '<span class="titulo-campeon">Campeón</span>' : ''}${typeof RK !== 'undefined' && RK.ficha ? `<span id="rango-top">${chipRango(RK.ficha.puntos)}</span>` : '<span id="rango-top"></span>'}<span class="medallas-top">${MEDALLAS.map(m => svgMedalla(m, 20, !S.medallas[m.id])).join('')}<small>${n}/4</small></span></div>
      <div class="top-der"><div class="monedas" title="Monedas"><span class="moneda">$</span><span id="mon"></span></div>
      <button class="online-badge" id="online-badge" hidden></button></div>
    </header>`;
}
function pintarJuego(){
  if(typeof salirDelMundo === 'function') salirDelMundo();
  if(S.cuartel && S.cuartel.racha > 0){ S.cuartel.racha = 0; S.cuartel.continuar = false; }
  if(typeof dejarCanal === 'function') dejarCanal();
  vista = 'casa'; modo = null;
  curarEquipo();
  const lider = S.equipo[0];
  $('#app').innerHTML = `
    ${cabeceraHTML()}
    <section class="escenario" id="escenario" aria-label="Tu casa">
      <div class="pared" id="pared"><div class="ventana"></div></div>
      <div class="piso" id="piso"></div>
      <div id="muebles"></div>
      <div class="ent-casa">${svgEntrenador(S.entrenador)}</div>
      <div class="bichito" id="bichito" role="button" aria-label="Saludar">${lider ? svgEspecie(lider.esp, {humor: 'feliz', shiny: lider.shiny}) : ''}</div>
      <div id="extra"></div>
    </section>
    <button class="explorar" id="n-explorar">Salir a explorar</button>
    <nav class="nav">
      <button id="n-equipo">Criaturas</button>
      <button id="n-mochila">Mochila</button>
      <button id="n-decorar">Decorar</button>
      <button id="n-ranking">Ranking</button>
    </nav>
    <p class="pie">Tu casa: decorala con lo que compres en el Market de cada pueblo. Entrar acá cura a todo tu equipo.</p>
    <p class="pie" id="cuenta"></p>`;
  $('#bichito').onclick = () => { const b = $('#bichito'); b.classList.remove('saltando'); void b.offsetWidth; b.classList.add('saltando'); };
  $('#n-explorar').onclick = () => { if(modo) salirModo(); guardar(); pintarMundo(); };
  $('#n-equipo').onclick = () => abrirEquipo('equipo');
  $('#n-mochila').onclick = () => abrirHoja('mochila');
  $('#n-decorar').onclick = () => modo === 'decorar' ? salirModo() : empezarDecorar();
  pintarTodo(); pintarCuenta();
  if(typeof conectarGlobal === 'function'){ conectarGlobal(); avisarDondeEstoy(); prepararBadge(); }
}
function prepararBadge(){
  const r = $('#n-ranking'); if(r) r.onclick = abrirRanking;
  if(typeof actualizarFicha === 'function') actualizarFicha();
  const b = $('#online-badge'); if(!b) return;
  b.onclick = abrirOnline;
  actualizarOnline();
}
function pintarTodo(){
  if(!S) return;
  if($('#nom')){ $('#nom').textContent = apodo || 'Entrenador'; $('#mon').textContent = S.monedas; }
  if(vista !== 'casa' || !$('#escenario')) return;
  const f = POR_ID[S.fondo] || FONDOS[0];
  $('#pared').style.background = f.pared; $('#piso').style.background = f.piso;
  $('#n-decorar').textContent = modo === 'decorar' ? 'Listo' : 'Decorar';
  if(modo !== 'decorar') pintarMuebles();
}
function pintarMuebles(){
  const cont = $('#muebles'); if(!cont) return;
  cont.innerHTML = '';
  S.casa.forEach((m, i) => {
    const it = POR_ID[m.id]; if(!it) return;
    const d = document.createElement('div');
    d.className = 'mueble' + (it.svg ? ' mueble-svg' : '');
    m.y = it.pared ? clamp(m.y, 14, 60) : clamp(m.y, 74, 99);
    d.style.left = m.x + '%'; d.style.top = m.y + '%';
    if(it.svg){ d.innerHTML = it.svg(); d.style.width = it.tam + 'px'; d.style.height = it.tam + 'px'; }
    else { d.textContent = it.em; d.style.fontSize = (it.tam || 64) + 'px'; }
    d.dataset.i = i;
    d.style.zIndex = it.pared ? 1 : (m.y > 85 ? 5 : 2);
    if(modo === 'decorar'){
      const q = document.createElement('button');
      q.className = 'quitar'; q.textContent = '×'; q.setAttribute('aria-label', 'Guardar ' + it.nom);
      q.onpointerdown = ev => ev.stopPropagation();
      q.onclick = ev => { ev.stopPropagation(); S.casa.splice(i, 1); S.inv.muebles[m.id] = (S.inv.muebles[m.id] || 0) + 1; guardar(); pintarMuebles(); };
      d.appendChild(q);
      d.onpointerdown = arrastrar;
    }
    cont.appendChild(d);
  });
}
function empezarDecorar(){
  cerrarHoja();
  if(vista !== 'casa') pintarJuego();
  modo = 'decorar';
  $('#escenario').classList.add('decorando');
  barraModo('Arrastrá los muebles', 'Listo', salirModo);
  pintarTodo(); pintarMuebles();
}
function arrastrar(ev){
  const el = ev.currentTarget, i = +el.dataset.i, m = S.casa[i];
  const r = $('#escenario').getBoundingClientRect();
  ev.preventDefault();
  el.setPointerCapture(ev.pointerId);
  const mover = e => {
    m.x = clamp((e.clientX - r.left) / r.width * 100, 6, 94);
    const y = (e.clientY - r.top + 20) / r.height * 100;
    m.y = POR_ID[m.id].pared ? clamp(y, 14, 60) : clamp(y, 74, 99);
    el.style.left = m.x + '%'; el.style.top = m.y + '%';
  };
  const soltar = () => {
    el.removeEventListener('pointermove', mover); el.removeEventListener('pointerup', soltar); el.removeEventListener('pointercancel', soltar);
    guardar(); pintarMuebles();
  };
  el.addEventListener('pointermove', mover); el.addEventListener('pointerup', soltar); el.addEventListener('pointercancel', soltar);
}
function barraModo(txt, btn, fn){
  $('#extra').querySelectorAll('.barra-modo').forEach(x => x.remove());
  const d = document.createElement('div'); d.className = 'barra-modo';
  d.innerHTML = `<span></span><button></button>`;
  d.querySelector('span').textContent = txt; d.querySelector('button').textContent = btn;
  d.querySelector('button').onclick = ev => { ev.stopPropagation(); fn(); };
  $('#extra').appendChild(d);
}
function salirModo(){
  modo = null;
  const e = $('#escenario'); if(e) e.classList.remove('decorando');
  const ex = $('#extra'); if(ex) ex.querySelectorAll('.barra-modo').forEach(x => x.remove());
  pintarTodo();
}

/* ---------------- Hojas: Market y mochila ---------------- */
let hojaActual = null, pestana = {tienda: 'aventura', mochila: 'aventura', equipo: 'equipo'};
function nuevoVelo(cerrable = true){
  let velo = $('#velo');
  if(!velo){ velo = document.createElement('div'); velo.id = 'velo'; velo.className = 'velo'; document.body.appendChild(velo); }
  velo.onclick = cerrable ? (e => { if(e.target === velo) cerrarHoja(); }) : null;
  return velo;
}
function abrirHoja(tipo){
  if(vista === 'combate' || vista === 'duelo') return;
  if(modo === 'decorar' && tipo !== 'mochila') salirModo();
  hojaActual = tipo;
  nuevoVelo();
  pintarHoja();
}
function cerrarHoja(){ const v = $('#velo'); if(v) v.remove(); hojaActual = null; }
document.addEventListener('keydown', e => { if(e.key === 'Escape' && hojaActual !== 'pedido-duelo') cerrarHoja(); });

const muestraFondo = f => `<span class="muestra-fondo" style="background:${f.pared}"><span style="background:${f.piso}"></span></span>`;
function iconoItem(it, tam = 44){
  if(it.tipoObj) return iconoObjeto(it, tam);
  if(it.svg) return `<span style="display:inline-block;width:${tam + 8}px;height:${tam + 8}px">${it.svg()}</span>`;
  return `<span style="font-size:${tam * .8}px;line-height:1">${it.em}</span>`;
}
function pintarHoja(){
  const v = $('#velo'); if(!v) return;
  let titulo, pest = '', cuerpo = '';
  const mon = `<div class="monedas"><span class="moneda">$</span><span>${S.monedas}</span></div>`;
  const pestanas = (lista, actual) => `<div class="pestanas" role="tablist">${lista.map(([k, n]) => `<button role="tab" data-tab="${k}" aria-selected="${actual === k}">${n}</button>`).join('')}</div>`;
  if(hojaActual === 'tienda'){
    titulo = 'Market';
    pest = pestanas([['aventura', 'Aventura'], ['muebles', 'Muebles'], ['peluches', 'Peluches'], ['fondos', 'Casa']], pestana.tienda);
    const t = pestana.tienda;
    const lista = t === 'aventura' ? OBJETOS : t === 'muebles' ? MUEBLES.filter(m => !m.peluche && !m.oculto) : t === 'peluches' ? MUEBLES.filter(m => m.peluche) : FONDOS;
    cuerpo = lista.map(it => {
      const bloq = bloqueado(it), tiene = t === 'fondos' && S.inv.fondos.includes(it.id);
      let btn;
      if(bloq) btn = `<button class="btn" disabled>Con ${it.medallas} medalla${it.medallas > 1 ? 's' : ''}</button>`;
      else if(tiene) btn = `<button class="btn" disabled>Ya lo tenés</button>`;
      else btn = `<button class="btn" data-comprar="${it.id}" ${S.monedas < it.precio ? 'disabled' : ''}>${S.monedas < it.precio ? 'No alcanza' : 'Comprar'}</button>`;
      const muestra = t === 'fondos' ? muestraFondo(it) : `<span class="em" style="${bloq ? 'filter:grayscale(1);opacity:.5' : ''}">${iconoItem(it)}</span>`;
      const cant = t === 'aventura' ? `<p class="precio" style="margin:0">Tenés ${S.inv.objetos[it.id] || 0}</p>` : '';
      return `<div class="item">${muestra}<h3>${it.nom}</h3><p>${it.desc}</p>${cant}<span class="precio"><span class="moneda">$</span>${it.precio}</span>${btn}</div>`;
    }).join('');
  } else {
    titulo = 'Mochila';
    pest = pestanas([['aventura', 'Aventura'], ['movs', 'Movimientos'], ['muebles', 'Muebles'], ['fondos', 'Casa']], pestana.mochila);
    const t = pestana.mochila;
    if(t === 'aventura'){
      const ids = OBJETOS.filter(o => S.inv.objetos[o.id] > 0);
      cuerpo = ids.length ? ids.map(o => `<div class="item"><span class="em">${iconoObjeto(o, 40)}</span><h3>${o.nom}</h3><p>${o.desc}</p><p class="precio">Tenés ${S.inv.objetos[o.id]}</p></div>`).join('')
        + `<p class="vacio" style="grid-column:1/-1;padding:4px">Las cápsulas se usan en combate. Los jarabes, en combate o desde Criaturas.</p>`
        : '<div class="vacio">No tenés cápsulas ni jarabes. Pasá por un Market.</div>';
    } else if(t === 'movs'){
      const ids = Object.keys(S.discos || {}).filter(m => MOVS[m]);
      cuerpo = ids.length ? ids.map(m => { const mv = MOVS[m], quien = [...S.equipo, ...S.reserva].filter(c => (c.extra || [])[0] === m).map(c => c.nombre);
          return `<div class="item"><span class="em"><span class="disco-mov" style="--tipo:${TIPOS[mv.tipo].color}"></span></span><h3>${mv.nom}</h3><p>${TIPOS[mv.tipo].nom} · poder ${mv.poder}${quien.length ? `<br>Lo sabe: ${esc(quien.join(', '))}` : ''}</p><button class="btn" data-ensenar="${m}">Enseñar</button></div>`; }).join('')
        : '<div class="vacio">Ganale a un líder de gimnasio y te regala su movimiento.</div>';
    } else if(t === 'muebles'){
      const ids = Object.keys(S.inv.muebles).filter(id => S.inv.muebles[id] > 0 && POR_ID[id]);
      const max = 6 + cantMedallas() * 2, lleno = S.casa.length >= max;
      cuerpo = `<p class="vacio" style="padding:4px;grid-column:1/-1">En la casa: ${S.casa.length} de ${max} lugares. Cada medalla suma 2.</p>` +
        (ids.length ? ids.map(id => { const m = POR_ID[id]; return `<div class="item"><span class="em">${iconoItem(m)}</span><h3>${m.nom}</h3><p class="precio">Guardados: ${S.inv.muebles[id]}</p><button class="btn" data-poner="${id}" ${lleno ? 'disabled' : ''}>${lleno ? 'Casa llena' : 'Poner en la casa'}</button></div>`; }).join('')
          : '<div class="vacio">Todo lo que compraste ya está en la casa.</div>');
    } else {
      cuerpo = S.inv.fondos.map(id => { const f = POR_ID[id], usado = S.fondo === id; return `<div class="item ${usado ? 'favorito' : ''}">${muestraFondo(f)}<h3>${f.nom}</h3><button class="btn" data-fondo="${id}" ${usado ? 'disabled' : ''}>${usado ? 'Puesto' : 'Usar'}</button></div>`; }).join('');
    }
  }
  v.innerHTML = `<div class="hoja" role="dialog" aria-label="${titulo}"><div class="hoja-cab"><h2>${titulo}</h2>${mon}<button class="cerrar" aria-label="Cerrar">×</button></div>${pest}<div class="grilla">${cuerpo}</div></div>`;
  v.querySelector('.cerrar').onclick = cerrarHoja;
  v.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { pestana[hojaActual] = b.dataset.tab; pintarHoja(); });
  v.querySelectorAll('[data-comprar]').forEach(b => b.onclick = () => comprar(b.dataset.comprar));
  v.querySelectorAll('[data-poner]').forEach(b => b.onclick = () => ponerMueble(b.dataset.poner));
  v.querySelectorAll('[data-ensenar]').forEach(b => b.onclick = () => elegirAprendiz(b.dataset.ensenar));
  v.querySelectorAll('[data-fondo]').forEach(b => b.onclick = () => { S.fondo = b.dataset.fondo; guardar(); pintarTodo(); pintarHoja(); });
}
/* ---------------- Movimientos de líder: enseñarlos ---------------- */
function elegirAprendiz(mov){
  const mv = MOVS[mov]; if(!mv) return;
  hojaActual = 'aprender';
  const v = nuevoVelo();
  const todas = [...S.equipo, ...S.reserva];
  v.innerHTML = `<div class="hoja hoja-elegir" role="dialog" aria-label="Enseñar movimiento">
    <div class="hoja-cab"><h2>¿Quién aprende ${esc(mv.nom)}?</h2><button class="cerrar" aria-label="Cerrar">×</button></div>
    <p class="rotulo-chico">Tipo ${TIPOS[mv.tipo].nom} · poder ${mv.poder}. Cada criatura puede tener un movimiento de líder: si ya sabe otro, lo reemplaza. El disco queda en tu mochila para enseñarlo de nuevo.</p>
    <div class="grilla-elegir">${todas.map((c, i) => {
      const ya = (c.extra || [])[0];
      return `<button class="elegible${ya === mov ? ' elegida' : ''}${c.shiny ? ' es-shiny' : ''}" data-i="${i}" style="--tipo:${TIPOS[tipoDe(c.esp)].color}">
        <span class="el-img">${svgEspecie(c.esp, {humor: 'feliz', shiny: c.shiny})}</span><b data-nom="${i}"></b>
        <small>${ya === mov ? 'Ya lo sabe' : ya ? 'Sabe ' + MOVS[ya].nom : 'Nv ' + c.nivel + ' · ' + TIPOS[tipoDe(c.esp)].nom}</small></button>`;
    }).join('')}</div>
    <div class="acciones-jugador"><button class="btn btn-2" id="ap-despues">Más tarde (queda en la Mochila)</button></div></div>`;
  todas.forEach((c, i) => { v.querySelector(`[data-nom="${i}"]`).textContent = c.nombre + (c.shiny ? ' ✦' : ''); });
  v.querySelectorAll('[data-i]').forEach(b => b.onclick = () => {
    const c = todas[+b.dataset.i];
    if((c.extra || [])[0] === mov) return;
    c.extra = [mov]; guardar(); cerrarHoja();
    avisar(`¡${c.nombre} aprendió ${mv.nom}!`, 'nivel');
  });
  v.querySelector('.cerrar').onclick = cerrarHoja;
  v.querySelector('#ap-despues').onclick = cerrarHoja;
}
function comprar(id){
  const it = POR_ID[id];
  if(S.monedas < it.precio || bloqueado(it)) return;
  S.monedas -= it.precio;
  if(OBJETOS.includes(it)) S.inv.objetos[id] = (S.inv.objetos[id] || 0) + 1;
  else if(MUEBLES.includes(it)) S.inv.muebles[id] = (S.inv.muebles[id] || 0) + 1;
  else { S.inv.fondos.push(id); }
  avisar(`Compraste: ${it.nom}`);
  guardar(); pintarTodo(); pintarHoja();
}
function ponerMueble(id){
  if(!S.inv.muebles[id]) return;
  if(S.casa.length >= 6 + cantMedallas() * 2) return;
  if(vista !== 'casa') pintarJuego();
  S.inv.muebles[id]--; if(!S.inv.muebles[id]) delete S.inv.muebles[id];
  const it = POR_ID[id];
  S.casa.push({id, x: 20 + Math.random() * 60, y: it.pared ? 40 : 88});
  guardar(); empezarDecorar();
}

/* ---------------- Bono diario y arranque ---------------- */
function bonoDiario(){
  if(!S || S.ultimoBono === hoy()) return;
  const primera = !S.ultimoBono;
  S.ultimoBono = hoy();
  if(!primera){ S.monedas += 60; avisar('Bono del día: +60 monedas'); }
  guardar(); pintarTodo();
}
document.addEventListener('visibilitychange', () => { if(!document.hidden && S){ bonoDiario(); } });

if(db){ pintarCargando(); conectarNube(); }
else {
  S = migrar(leerLocal());
  if(S && S.entrenador){ pintarJuego(); bonoDiario(); } else pintarCreador();
}
