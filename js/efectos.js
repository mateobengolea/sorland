'use strict';
/* =====================================================================
   Efectos de batalla: cada tipo de ataque tiene su animación.
   Todo se dibuja en una capa encima de la arena y se borra solo.
   ===================================================================== */

const MOVIMIENTO_REDUCIDO = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function capaEfectos(){
  const arena = document.querySelector('.arena'); if(!arena) return null;
  let capa = arena.querySelector('.efectos');
  if(!capa){ capa = document.createElement('div'); capa.className = 'efectos'; arena.appendChild(capa); }
  return capa;
}
function centroDe(id){
  const el = document.getElementById(id), arena = document.querySelector('.arena');
  if(!el || !arena) return {x: 0, y: 0};
  const a = arena.getBoundingClientRect(), r = el.getBoundingClientRect();
  return {x: r.left - a.left + r.width / 2, y: r.top - a.top + r.height * .55};
}
function particula(capa, html, x, y, clase = ''){
  const d = document.createElement('div');
  d.className = 'fx ' + clase; d.innerHTML = html;
  d.style.left = x + 'px'; d.style.top = y + 'px';
  capa.appendChild(d);
  return d;
}
const esperarAnim = (anim, el) => anim.finished.then(() => el && el.remove()).catch(() => el && el.remove());

// Vuela de un punto a otro, con una curva opcional.
function volar(el, de, a, dur, curva = 0, giro = 0, demora = 0){
  const mx = (de.x + a.x) / 2, my = (de.y + a.y) / 2 - curva;
  return el.animate([
    {transform: `translate(${de.x}px, ${de.y}px) translate(-50%, -50%) rotate(0deg) scale(.6)`, opacity: 0},
    {transform: `translate(${de.x}px, ${de.y}px) translate(-50%, -50%) scale(1)`, opacity: 1, offset: .08},
    {transform: `translate(${mx}px, ${my}px) translate(-50%, -50%) rotate(${giro / 2}deg) scale(1.05)`, opacity: 1},
    {transform: `translate(${a.x}px, ${a.y}px) translate(-50%, -50%) rotate(${giro}deg) scale(1)`, opacity: 1},
  ], {duration: dur, delay: demora, easing: 'cubic-bezier(.4,.1,.6,1)', fill: 'both'});
}
function estallido(capa, p, colores, cant = 10, dist = 46, tam = 10){
  const promesas = [];
  for(let i = 0; i < cant; i++){
    const ang = (i / cant) * Math.PI * 2 + Math.random() * .4, d = dist * (.6 + Math.random() * .6);
    const el = particula(capa, '', 0, 0, 'fx-punto');
    el.style.width = el.style.height = tam + 'px';
    el.style.background = colores[i % colores.length];
    const anim = el.animate([
      {transform: `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) scale(1)`, opacity: 1},
      {transform: `translate(${p.x + Math.cos(ang) * d}px, ${p.y + Math.sin(ang) * d}px) translate(-50%, -50%) scale(.2)`, opacity: 0},
    ], {duration: 480 + Math.random() * 200, easing: 'cubic-bezier(.1,.7,.3,1)', fill: 'both'});
    promesas.push(esperarAnim(anim, el));
  }
  return Promise.all(promesas);
}
function anillo(capa, p, color, tam = 90, dur = 520, demora = 0){
  const el = particula(capa, '', 0, 0, 'fx-anillo');
  el.style.borderColor = color;
  const anim = el.animate([
    {transform: `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) scale(.2)`, opacity: .95, width: tam + 'px', height: tam + 'px'},
    {transform: `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) scale(1)`, opacity: 0, width: tam + 'px', height: tam + 'px'},
  ], {duration: dur, delay: demora, easing: 'ease-out', fill: 'both'});
  return esperarAnim(anim, el);
}
function destelloArena(color = 'rgba(255,255,255,.75)', dur = 260){
  const capa = capaEfectos(); if(!capa) return Promise.resolve();
  const el = particula(capa, '', 0, 0, 'fx-flash'); el.style.background = color;
  return esperarAnim(el.animate([{opacity: 0}, {opacity: 1, offset: .3}, {opacity: 0}], {duration: dur}), el);
}
function sacudirArena(fuerte){
  const arena = document.querySelector('.arena'); if(!arena || MOVIMIENTO_REDUCIDO) return;
  const d = fuerte ? 9 : 5;
  arena.animate([{transform: 'translate(0,0)'}, {transform: `translate(${-d}px,${d / 2}px)`}, {transform: `translate(${d}px,${-d / 2}px)`},
                 {transform: `translate(${-d / 2}px,${d / 3}px)`}, {transform: 'translate(0,0)'}], {duration: 360});
}
function numeroDanio(id, danio, critico, ef){
  const capa = capaEfectos(); if(!capa) return;
  const p = centroDe(id), ancho = capa.clientWidth || 360;
  p.x = Math.max(70, Math.min(ancho - 70, p.x));
  const el = particula(capa, '', 0, 0, 'fx-numero' + (critico ? ' critico' : '') + (ef > 1 ? ' efectivo' : ef < 1 ? ' flojo' : ''));
  el.textContent = (critico ? '¡Crítico! ' : '') + '-' + danio;
  esperarAnim(el.animate([
    {transform: `translate(${p.x}px, ${p.y - 20}px) translate(-50%, -50%) scale(.5)`, opacity: 0},
    {transform: `translate(${p.x}px, ${p.y - 46}px) translate(-50%, -50%) scale(1.15)`, opacity: 1, offset: .25},
    {transform: `translate(${p.x}px, ${p.y - 70}px) translate(-50%, -50%) scale(1)`, opacity: 0},
  ], {duration: 1100, easing: 'ease-out', fill: 'both'}), el);
}

/* ---------------- Formas de los proyectiles ---------------- */
const FX = {
  bola: c => `<div class="fx-bola" style="background:radial-gradient(circle at 35% 35%, #FFF6B0, ${c[0]} 45%, ${c[1]})"></div>`,
  gota: () => `<svg width="16" height="20" viewBox="0 0 16 20"><path d="M8 0 C12 7 15 10 15 13 A7 7 0 0 1 1 13 C1 10 4 7 8 0Z" fill="#5AB4E8" stroke="#22304A" stroke-width="1.5"/><ellipse cx="6" cy="12" rx="2" ry="3" fill="#fff" opacity=".7"/></svg>`,
  hoja: () => `<svg width="24" height="16" viewBox="0 0 24 16"><path d="M1 8 C6 0 18 0 23 8 C18 16 6 16 1 8Z" fill="#7CC46A" stroke="#22304A" stroke-width="1.5"/><path d="M3 8 H21" stroke="#3F8A4A" stroke-width="1.5"/></svg>`,
  piedra: () => `<svg width="30" height="26" viewBox="0 0 30 26"><path d="M2 20 L5 8 L14 2 L25 6 L28 16 L24 24 L8 24Z" fill="#9AA2AD" stroke="#22304A" stroke-width="2" stroke-linejoin="round"/><path d="M5 8 L14 2 L15 12 L7 16Z" fill="#BCC3CC"/></svg>`,
  cristal: () => `<svg width="14" height="28" viewBox="0 0 14 28"><path d="M7 0 L14 12 L7 28 L0 12Z" fill="#CFF1FF" stroke="#22304A" stroke-width="1.5" stroke-linejoin="round"/><path d="M7 2 L7 26" stroke="#fff" stroke-width="1.5"/></svg>`,
  remolino: () => `<svg width="46" height="46" viewBox="0 0 46 46"><path d="M23 23 m-4 0 a4 4 0 1 1 8 0 a9 9 0 1 1 -17 2 a14 14 0 1 1 27 -4 a19 19 0 1 1 -36 -2" fill="none" stroke="#E6F2FB" stroke-width="3.5" stroke-linecap="round"/></svg>`,
  bichito: () => `<svg width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="6" r="4" fill="#3A4A2A" stroke="#22304A" stroke-width="1"/><ellipse cx="3" cy="3" rx="3" ry="2" fill="#DCEEFF" opacity=".9"/><ellipse cx="9" cy="3" rx="3" ry="2" fill="#DCEEFF" opacity=".9"/></svg>`,
  estrella: () => `<svg width="56" height="56" viewBox="0 0 56 56"><path d="M28 2 L34 20 L54 22 L38 34 L44 54 L28 42 L12 54 L18 34 L2 22 L22 20Z" fill="#FFF3A0" stroke="#22304A" stroke-width="2.5" stroke-linejoin="round"/></svg>`,
};

/* ---------------- Animación de cada ataque ---------------- */
async function animarAtaque(mov, idA, idD, acierta){
  if(MOVIMIENTO_REDUCIDO){ return; }
  const capa = capaEfectos(); if(!capa) return;
  const de = centroDe(idA), objetivo = centroDe(idD);
  const a = acierta ? objetivo : {x: objetivo.x + (objetivo.x - de.x) * .35, y: objetivo.y - 40};
  const esPropio = idA === 'b-propio';
  if(mov.efecto){
    // Gruñido: ondas que salen del atacante
    animar(idA, esPropio ? 'grita-propio' : 'grita-rival', 600);
    await Promise.all([0, 140, 280].map(d => anillo(capa, de, '#FFFFFF', 120, 620, d)));
    if(acierta) animar(idD, 'achica', 500);
    return;
  }
  const t = mov.tipo, fuerte = mov.poder >= 85;
  const lluvia = [];
  const tirar = (html, cant, separacion, dur, curva, giro, dispersion = 0, clase = '') => {
    for(let i = 0; i < cant; i++){
      const el = particula(capa, html, 0, 0, 'fx-proy ' + clase);
      const off = {x: (Math.random() - .5) * dispersion, y: (Math.random() - .5) * dispersion};
      lluvia.push(esperarAnim(volar(el, de, {x: a.x + off.x, y: a.y + off.y}, dur, curva, giro, i * separacion), el));
    }
  };
  if(t === 'normal'){
    animar(idA, esPropio ? 'embiste-propio' : 'embiste-rival', 420);
    await espera(220);
    if(acierta){ const el = particula(capa, FX.estrella(), 0, 0, 'fx-proy'); lluvia.push(esperarAnim(el.animate([
      {transform: `translate(${a.x}px, ${a.y}px) translate(-50%, -50%) scale(.3) rotate(0deg)`, opacity: 1},
      {transform: `translate(${a.x}px, ${a.y}px) translate(-50%, -50%) scale(${fuerte ? 1.6 : 1.1}) rotate(40deg)`, opacity: 0}], {duration: 380, fill: 'both'}), el));
      lluvia.push(estallido(capa, a, ['#FFFFFF', '#FFF3A0'], 8, 40, 8)); }
  } else if(t === 'fuego'){
    tirar(FX.bola(['#FF9F2E', '#E2302E']), fuerte ? 5 : 3, 90, 420, 30, 0, 18);
    await Promise.all(lluvia.splice(0));
    if(acierta){ lluvia.push(estallido(capa, a, ['#FFD23F', '#FF9F2E', '#E2302E'], fuerte ? 18 : 12, fuerte ? 70 : 50, 12)); if(fuerte) lluvia.push(destelloArena('rgba(255,150,60,.45)')); }
  } else if(t === 'agua'){
    tirar(FX.gota(), fuerte ? 16 : 10, 35, 380, 10, 0, 22);
    await Promise.all(lluvia.splice(0));
    if(acierta){ lluvia.push(anillo(capa, a, '#5AB4E8', 80), anillo(capa, a, '#BFE9FF', 110, 600, 120), estallido(capa, a, ['#5AB4E8', '#BFE9FF'], 10, 44, 8)); }
  } else if(t === 'planta'){
    tirar(FX.hoja(), fuerte ? 10 : 6, 60, 460, 40, 540, 26);
    await Promise.all(lluvia.splice(0));
    if(acierta){ for(let i = 0; i < 3; i++){ const el = particula(capa, '', 0, 0, 'fx-tajo'); lluvia.push(esperarAnim(el.animate([
      {transform: `translate(${a.x - 30}px, ${a.y - 24 + i * 16}px) rotate(-25deg) scaleX(0)`, opacity: 1},
      {transform: `translate(${a.x - 30}px, ${a.y - 24 + i * 16}px) rotate(-25deg) scaleX(1)`, opacity: 0}], {duration: 300, delay: i * 70, fill: 'both'}), el)); } }
  } else if(t === 'rayo'){
    const el = particula(capa, `<svg width="70" height="${Math.max(80, a.y + 10)}" viewBox="0 0 70 200" preserveAspectRatio="none"><path d="M40 0 L22 70 L42 70 L18 140 L50 120 L30 200" fill="none" stroke="#FFE45C" stroke-width="9" stroke-linejoin="round"/><path d="M40 0 L22 70 L42 70 L18 140 L50 120 L30 200" fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round"/></svg>`, 0, 0, 'fx-proy');
    lluvia.push(esperarAnim(el.animate([
      {transform: `translate(${a.x}px, 0px) translate(-50%, 0)`, opacity: 0}, {opacity: 1, offset: .1}, {opacity: .2, offset: .3}, {opacity: 1, offset: .5}, {opacity: .2, offset: .7}, {transform: `translate(${a.x}px, 0px) translate(-50%, 0)`, opacity: 0}], {duration: 520, fill: 'both'}), el));
    lluvia.push(destelloArena('rgba(255,240,140,.55)', 320));
    if(acierta) lluvia.push(estallido(capa, a, ['#FFE45C', '#FFFFFF'], 12, 50, 7));
  } else if(t === 'piedra'){
    for(let i = 0; i < (fuerte ? 6 : 3); i++){
      const el = particula(capa, FX.piedra(), 0, 0, 'fx-proy');
      const x = a.x + (Math.random() - .5) * 50;
      lluvia.push(esperarAnim(el.animate([
        {transform: `translate(${x}px, -30px) translate(-50%, -50%) rotate(0deg)`, opacity: 1},
        {transform: `translate(${x}px, ${a.y}px) translate(-50%, -50%) rotate(${180 + i * 40}deg)`, opacity: 1, offset: .75},
        {transform: `translate(${x}px, ${a.y - 10}px) translate(-50%, -50%) rotate(${200 + i * 40}deg)`, opacity: 0}], {duration: 560, delay: i * 110, easing: 'ease-in', fill: 'both'}), el));
    }
    await Promise.all(lluvia.splice(0));
    if(acierta) lluvia.push(estallido(capa, {x: a.x, y: a.y + 20}, ['#C9B79C', '#9C8460'], 12, 50, 10));
  } else if(t === 'viento'){
    tirar(FX.remolino(), fuerte ? 4 : 2, 140, 560, -20, 720, 10);
    await Promise.all(lluvia.splice(0));
    if(acierta) animar(idD, 'tambalea', 600);
  } else if(t === 'hielo'){
    tirar(FX.cristal(), fuerte ? 10 : 6, 55, 400, 0, 0, 30);
    await Promise.all(lluvia.splice(0));
    if(acierta){ lluvia.push(estallido(capa, a, ['#FFFFFF', '#BFE9FF', '#8FD3F7'], 14, 52, 8), anillo(capa, a, '#BFE9FF', 100)); if(fuerte) lluvia.push(destelloArena('rgba(200,240,255,.55)')); }
  } else if(t === 'bicho'){
    for(let i = 0; i < (fuerte ? 14 : 9); i++){
      const el = particula(capa, FX.bichito(), 0, 0, 'fx-proy');
      const z = (Math.random() - .5) * 60;
      lluvia.push(esperarAnim(el.animate([
        {transform: `translate(${de.x}px, ${de.y}px)`, opacity: 0},
        {transform: `translate(${(de.x * 2 + a.x) / 3}px, ${(de.y * 2 + a.y) / 3 + z}px)`, opacity: 1, offset: .33},
        {transform: `translate(${(de.x + a.x * 2) / 3}px, ${(de.y + a.y * 2) / 3 - z}px)`, opacity: 1, offset: .66},
        {transform: `translate(${a.x + (Math.random() - .5) * 30}px, ${a.y + (Math.random() - .5) * 30}px)`, opacity: 0}], {duration: 600, delay: i * 40, fill: 'both'}), el));
    }
  }
  await Promise.all(lluvia);
}

// Una cápsula que vuela del entrenador hacia la criatura.
async function animarCapsula(o){
  if(MOVIMIENTO_REDUCIDO) return;
  const capa = capaEfectos(); if(!capa) return;
  const arena = document.querySelector('.arena').getBoundingClientRect();
  const de = {x: 30, y: arena.height - 30}, a = centroDe('b-rival');
  const el = particula(capa, iconoObjeto(o, 34), 0, 0, 'fx-proy');
  await esperarAnim(volar(el, de, a, 520, 110, 720), el);
  await destelloArena('rgba(255,255,255,.6)', 200);
}
