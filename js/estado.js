'use strict';
/* =====================================================================
   Estado compartido y utilidades. Se carga primero.
   ===================================================================== */
const CLAVE = 'sorlandia-partida-v1';
let S = null;            // la partida
let modo = null;         // null | 'decorar'
let vista = 'cargando';  // acceso | creador | casa | mundo | combate | duelo
let usuarioId = null, db = null;

const hoy = () => { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };
const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
const xpPara = n => 40 + n * 25;
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function avisar(txt, clase = ''){
  const d = document.createElement('div');
  d.className = 'aviso ' + clase; d.textContent = txt;
  $('#avisos').appendChild(d);
  setTimeout(() => d.remove(), clase === 'nivel' ? 3600 : 2400);
}
function ganar(m){ S.monedas += m; }
