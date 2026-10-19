'use strict';
/* =====================================================================
   Revanchas: después de ser Campeón, cada líder acepta una revancha por
   semana con su equipo evolucionado al máximo. Sorlandia en nivel 72-80,
   la Costa Oriental en 92-100. Premios mejores que la primera vez.
   ===================================================================== */
const semanaActual = () => Math.floor((Date.now() / 86400000 + 3) / 7);
function evolucionFinal(esp){ let e = ESPECIES[esp], n = 0; while(e && e.evol && n++ < 4) e = ESPECIES[e.evol.a]; return e ? e.id : esp; }
function equipoRevancha(L, oriental){
  const base = oriental ? 92 : 72;
  const lista = L.equipo.map(([esp], i) => [evolucionFinal(esp), base + i * 2]);
  // Un as bajo la manga: la criatura más fuerte de su tipo que no tenía.
  const extra = Object.values(ESPECIES).filter(e => e.tipo === L.tipoGym && !e.legendaria && !e.evol && !lista.some(([x]) => x === e.id))
    .sort((a, b) => (b.base.vida + b.base.fuerza * 3 + b.base.velocidad * 2) - (a.base.vida + a.base.fuerza * 3 + a.base.velocidad * 2))[0];
  if(extra) lista.push([extra.id, base + lista.length * 2]);
  return lista.slice(-6);
}
(() => {
  const orig = hablarConLider;
  hablarConLider = async function(n){
    const L = LIDERES[n.lider];
    const oriental = typeof MEDALLAS2 !== 'undefined' && MEDALLAS2.some(m => m.id === L.medalla);
    const campeon = oriental ? S.campeon2 : S.campeon;
    if(!L || !S.medallas[L.medalla] || !campeon || (L.mov && !S.discos[L.mov])) return orig.apply(this, arguments);
    S.revanchas = S.revanchas || {};
    const quien = `${L.titulo} ${L.nombre}`;
    if(S.revanchas[L.id] === semanaActual()){ await dialogo(quien, ['Ya tuvimos nuestra revancha esta semana.', 'Volvé la semana que viene: voy a estar todavía más fuerte.']); return; }
    const i = await elegirOpcion(quien, `¡${oriental ? 'Campeón Oriental' : 'Campeón'}! ¿Querés la revancha? Esta vez peleo con todo, una vez por semana.`, ['¡Revancha!', 'Ahora no']);
    if(i !== 0) return;
    if(!hayLuchadorEnPie()){ await dialogo(quien, ['Tu equipo está agotado. Curate y volvé.']); return; }
    await dialogo(quien, ['¡Así me gusta! Sin miedo.']);
    S.revanchas.pendiente = L.id; guardar();
    PELEA_NIVEL_FIJO = true;
    const M = mapaActual();
    lanzarPeleaEntrenador({id: 'revancha_' + L.id + '_' + semanaActual(), titulo: 'Revancha', nombre: L.nombre, lider: true, tipoGym: L.tipoGym,
      premio: L.premio * 3, equipo: equipoRevancha(L, oriental), antes: [], despues: ['¡Qué nivel! Te ganaste el premio.', 'Nos vemos la semana que viene.'], ropa: L.ropa},
      M.zonaPelea || M.zonas[0][0]);
  };
  const origPintar = pintarMundo;
  pintarMundo = function(){
    const r = origPintar.apply(this, arguments);
    const id = S && S.revanchas && S.revanchas.pendiente;
    if(id){
      S.revanchas.pendiente = null;
      if(S.vencidos['revancha_' + id + '_' + semanaActual()]){
        S.revanchas[id] = semanaActual();
        const premios = [{obj: 'ultracapsula', n: 3}, {obj: 'jarabetotal', n: 2}, {obj: 'revivirmax', n: 1}, {obj: 'yuyos', n: 3}, {obj: 'energizante', n: 2}];
        const txt = darPremio(premios[Math.floor(Math.random() * premios.length)]);
        guardar();
        setTimeout(() => { if(MW) dialogo('¡Premio de revancha!', [`Además del dinero, te llevás ${txt}.`]); }, 700);
      } else guardar();
    }
    return r;
  };
})();
