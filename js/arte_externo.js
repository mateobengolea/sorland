'use strict';
/* =====================================================================
   Arte externo: si en assets/arte.json hay una imagen para una criatura,
   un objeto, una medalla o un fondo, el juego usa esa imagen en lugar del dibujo.
   Formato esperado (ver ARTE-LEEME): PNG con fondo transparente.
   ===================================================================== */
const ARTE_EXT = {criaturas: {}, objetos: {}, medallas: {}, fondos: {}, otros: {}, listo: false};
const rutaArte = (carpeta, archivo) => `assets/${carpeta}/${archivo}${ARTE_EXT.v ? '?v=' + ARTE_EXT.v : ''}`;
fetch('assets/arte.json?v=' + Date.now()).then(r => r.ok ? r.json() : null).then(j => {
  if(!j) return;
  Object.assign(ARTE_EXT, j, {listo: true});
  for(const a of Object.values(ARTE_EXT.criaturas || {})) if(a.frente) probarArte(a.frente);
  if(typeof _criaturaCache !== 'undefined') for(const k of Object.keys(_criaturaCache)) delete _criaturaCache[k];
  if(typeof vista !== 'undefined' && vista === 'casa' && typeof pintarJuego === 'function') pintarJuego();
}).catch(() => {});
// Cada imagen se prueba antes de usarla: si no carga (celular viejo, red, archivo roto), queda el dibujo de siempre.
const ARTE_OK = {};
function probarArte(f){
  if(f in ARTE_OK) return ARTE_OK[f];
  ARTE_OK[f] = null;
  const im = new Image();
  im.onload = () => { ARTE_OK[f] = im.naturalWidth > 0; if(ARTE_OK[f]) refrescarArte(); };
  im.onerror = () => { ARTE_OK[f] = false; };
  im.src = rutaArte('criaturas', f);
  return null;
}
let _refrescoArte = 0;
function refrescarArte(){
  clearTimeout(_refrescoArte);
  _refrescoArte = setTimeout(() => {
    if(typeof _criaturaCache !== 'undefined') for(const k of Object.keys(_criaturaCache)) delete _criaturaCache[k];
    // Cambia en el lugar los dibujos que ya estaban en pantalla.
    document.querySelectorAll('svg[data-esp]').forEach(el => {
      const esp = el.dataset.esp, o = JSON.parse(el.dataset.o || '{}');
      const x = archivoCriatura(esp, o.vista || 'frente', o.shiny);
      if(x && ARTE_OK[x.f]){ const t = document.createElement('div'); t.innerHTML = svgEspecie(esp, o); if(t.firstElementChild) el.replaceWith(t.firstElementChild); }
    });
  }, 120);
}
// Elige el archivo de la vista pedida; si no hay, usa el de frente.
function archivoCriatura(esp, vista, shiny){
  const a = ARTE_EXT.criaturas[esp]; if(!a) return null;
  if(shiny && a['shiny_' + vista]) return {f: a['shiny_' + vista], filtro: false};
  if(shiny && a.shiny) return {f: a.shiny, filtro: false};
  return {f: a[vista] || a.frente, filtro: !!shiny, espejo: vista === 'lado' && !a.lado};
}
// Para el combate y el álbum: si la imagen todavía no cargó o falló, el dibujo original.
function arteListo(x){ if(!x) return false; const ok = probarArte(x.f); return ok === true; }
(() => {
  const original = svgEspecie;
  svgEspecie = function(esp, o = {}){
    const x = archivoCriatura(esp, o.vista || 'frente', o.shiny);
    if(!arteListo(x)){
      const sv = original(esp, o);
      return x ? sv.replace('<svg', `<svg data-esp="${esp}" data-o='${JSON.stringify({vista: o.vista, shiny: o.shiny, humor: o.humor, aura: o.aura}).replace(/'/g, '')}'`) : sv;
    }
    const e = ESPECIES[esp], aura = o.aura === false ? '' : auraTipo(e.tipo);
    const filtro = x.filtro ? ' style="filter:hue-rotate(155deg) saturate(1.35)"' : '';
    const img = `<image href="${rutaArte('criaturas', x.f)}" x="0" y="0" width="200" height="200" preserveAspectRatio="xMidYMax meet"${x.espejo ? ' transform="translate(200 0) scale(-1 1)"' : ''}/>`;
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${SOMBRA}${aura}<g class="cuerpo vivo"${filtro}>${img}</g></svg>`;
  };
  // En el mapa las criaturas se dibujan en canvas: ahí la imagen se carga directo.
  const origImg = imagenCriatura;
  const cache = {};
  imagenCriatura = function(esp, shiny, vista = 'frente'){
    const x = archivoCriatura(esp, vista, shiny);
    if(!arteListo(x)) return origImg(esp, shiny, vista);
    const k = esp + shiny + vista;
    if(!cache[k]){
      const im = new Image(); im.src = rutaArte('criaturas', x.f);
      if(!x.filtro) cache[k] = im;
      else {
        // Shiny: la misma imagen con los colores girados, pintada en un lienzo aparte.
        const cv = document.createElement('canvas'); cv.complete = false; cv.naturalWidth = 0; cache[k] = cv;
        im.onload = () => { cv.width = im.naturalWidth; cv.height = im.naturalHeight; const g = cv.getContext('2d');
          g.filter = 'hue-rotate(155deg) saturate(1.35)'; g.drawImage(im, 0, 0); cv.complete = true; cv.naturalWidth = im.naturalWidth; };
      }
    }
    return cache[k];
  };
  const origIcono = iconoObjeto;
  iconoObjeto = function(o, tam = 40){
    const f = o && ARTE_EXT.objetos[o.id];
    return f ? `<img src="${rutaArte('objetos', f)}" width="${tam}" height="${tam}" alt="" style="object-fit:contain">` : origIcono(o, tam);
  };
  const origMed = svgMedalla;
  svgMedalla = function(m, tam = 64, apagada = false){
    const f = m && ARTE_EXT.medallas[m.id];
    return f ? `<img src="${rutaArte('medallas', f)}" width="${tam}" height="${tam}" alt="" style="object-fit:contain${apagada ? ';filter:grayscale(1) brightness(.4);opacity:.5' : ''}">` : origMed(m, tam, apagada);
  };
  const origFondo = svgFondoArena;
  svgFondoArena = function(tipo){
    const f = ARTE_EXT.fondos[tipo];
    return f ? `<img class="fondo-arena" src="${rutaArte('fondos_combate', f)}" alt="" style="object-fit:cover">` : origFondo(tipo);
  };
})();
