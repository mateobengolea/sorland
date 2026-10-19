'use strict';
/* =====================================================================
   Los Cuatreros: una banda que roba criaturas.
   Tres escondites: el Galpón de Pueblo Panal, la Estancia de Pueblo
   Escarcha y el Depósito del puerto de Montevideo. En cada pueblo hay un
   vigía; si le ganás, te deja la llave del escondite. Adentro hay
   cuatreros, un jefe y una jaula con criaturas robadas para liberar.
   ===================================================================== */
const ESCONDITES = [
  {id: 'galpon', pueblo: 'panal', cerca: [21, 20], medallas: 2, region2: false, nombre: 'Galpón de los Cuatreros', piso: ['#C9B08A', '#BDA37C'],
    vigia: {nombre: 'Cuatrero Vigía Poncho Sucio', equipo: [['cuisito', 12], ['grillito', 12]], premio: 250},
    reclutas: [['cuisito', 13], ['peludito', 13]], reclutas2: [['hormiguin', 13], ['tatupiedra', 14]], reclutas3: [['zorrolumbre', 14], ['cuison', 14]],
    jefe: {nombre: 'Capataz Rebenque', titulo: 'Cuatrero', equipo: [['peludon', 15], ['hormigon', 16], ['zorrolumbre', 17]], premio: 900,
      antes: ['¡Así que vos sos el que anda metiendo la nariz!', 'Las criaturas de la Apicultora ya son nuestras. Andate o te vas llorando.'],
      despues: ['¡Retirada, muchachos! Esto no queda así.', 'El Matrero se va a enterar...']},
    jaula: {criatura: 'abejita', nivel: 15, txt: ['En la jaula había abejitas robadas. ¡Las liberaste!', 'Una de ellas no se quiere ir: te sigue a todos lados.']},
    contexto: ['¿Qué mirás? Acá no pasa nada.', 'Bueno... sí pasa. Los Cuatreros nos llevamos las abejitas de la Apicultora. ¿Y?']},
  {id: 'estancia', pueblo: 'escarcha', cerca: [21, 20], medallas: 6, region2: false, nombre: 'Estancia de los Cuatreros', piso: ['#D9D0C1', '#CFC4B2'],
    vigia: {nombre: 'Cuatrera Vigía Lazo Largo', equipo: [['pinguinito', 20], ['zorrolumbre', 20], ['hornero', 21]], premio: 600},
    reclutas: [['escarchin', 21], ['morro', 21]], reclutas2: [['carpincho', 21], ['ajipicante', 22]], reclutas3: [['brasero', 22], ['huemul', 22]],
    jefe: {nombre: 'El Matrero', titulo: 'Jefe Cuatrero', equipo: [['zorrofogon', 24], ['tormenton', 24], ['cerrazo', 25], ['peludon', 25]], premio: 2000,
      antes: ['Así que vos sos el que le arruinó el negocio al Capataz.', 'Soy El Matrero, jefe de los Cuatreros. Robo criaturas porque nadie las cuida como yo.', 'Dale. Mostrame si las cuidás mejor.'],
      despues: ['...Está bien. Por ahora.', 'Pero del otro lado del río también tenemos amigos. Nos vemos, campeón.']},
    jaula: {criatura: 'montesito', nivel: 22, txt: ['En la jaula había criaturas de todo Sorlandia. ¡Volvieron a sus casas!', 'Un gatito montés que nadie conocía se quedó con vos. Dicen que viene de la Costa Oriental.']},
    contexto: ['Ni se te ocurra pasar. Esta estancia es del Matrero.', 'Adentro tenemos criaturas de todo Sorlandia. Las vendemos al mejor postor.']},
  {id: 'deposito', pueblo: 'capital', cerca: [21, 20], medallas: 4, region2: true, nombre: 'Depósito del Puerto', piso: ['#C9CFD6', '#BCC3CB'],
    vigia: {nombre: 'Cuatrero Vigía Gorra Celeste', equipo: [['manopelon', 74], ['gavioton', 74], ['teyu', 75]], premio: 2500},
    reclutas: [['montes', 75], ['escuerzo', 75]], reclutas2: [['candado', 76], ['anguilazo', 76]], reclutas3: [['carancho', 77], ['chiviton', 77]],
    jefe: {nombre: 'El Matrero', titulo: 'Jefe Cuatrero', equipo: [['lobizon', 80], ['mboitata', 80], ['teyuyagua', 81], ['zorrofogon', 81], ['tormenton', 82]], premio: 8000,
      antes: ['Te dije que teníamos amigos de este lado del río.', 'Esta vez traje lo mejor de la Costa Oriental. Lobizón, Mboitatá... ¿te asustan las leyendas?'],
      despues: ['...Me rindo. De verdad.', 'Los Cuatreros se disuelven. Voy a devolver todo. Quizás... aprenda a cuidar criaturas como vos.']},
    jaula: {criatura: 'yasy', nivel: 70, txt: ['El depósito estaba lleno de criaturas robadas. ¡Todas libres!', 'Un duendecito rubio con bastón de oro se acerca: es Yasy Yateré, y quiere viajar con vos.']},
    contexto: ['Circulando, circulando. Esto es un depósito de mercadería.', 'Mercadería... con patas. Pero eso no te importa.']},
];
const SEC_CUAT = () => { S.cuatreros = S.cuatreros || {}; return S.cuatreros; };

function mapaEscondite(E, afuera){
  const W = 15, H = 13, id = 'esc_' + E.id;
  const M = interiorBase(id, E.nombre, W, H, E.piso, afuera, 9700 + E.id.length * 13);
  // Pasillos entre pilas de cajas.
  for(const x of [3, 4, 10, 11]) for(let y = 3; y <= 9; y++) if(!(y === 6 && (x === 4 || x === 10))) M.mueble(y % 3 === 0 ? 'estante' : 'cajon', x, y);
  for(let x = 5; x <= 9; x++) if(x !== 7) M.mueble('cajon', x, 8);
  M.mueble('mesa', 1, 3); M.mueble('mesa', 13, 3);
  if(E.region2) M.region = 2;
  const ent = (n, x, y, eq) => M.npc({...entrenador(`cuat_${E.id}_${n}`, x, y, 'Cuatrero', ['Recluta Facón', 'Recluta Boleadora', 'Recluta Espuela'][n], eq, Math.round(E.vigia.premio * .8),
    ['¡Un intruso! ¡Agárrenlo!'], ['Uy... avisale al jefe.'], '#5A4A40'), suelo: 'p'});
  ent(0, 8, 9, E.reclutas); ent(1, 2, 6, E.reclutas2); ent(2, 12, 6, E.reclutas3);
  M.npc({id: 'cuat_jefe_' + E.id, x: 7, y: 3, tipo: 'vecino', nombre: E.jefe.nombre, suelo: 'p', ropa: '#2A2420', pelo: '#5A4A40', accion: n => hablarJefeCuatrero(E)});
  // La jaula es un mueble: se abre hablándole de frente (desde abajo o los costados).
  M.mueble('jaula', 7, 2);
  M.jaula = E;
  M.zonaPelea = MAPAS[afuera.mapa] ? (MAPAS[afuera.mapa].zonaBase || 'pradera') : 'pradera';
  M.entrada = {x: 7, y: H - 2};
  return M;
}
async function hablarJefeCuatrero(E){
  const sec = SEC_CUAT(), quien = `${E.jefe.titulo} ${E.jefe.nombre}`;
  if(sec[E.id]){ await dialogo(quien, [E.jefe.despues[E.jefe.despues.length - 1]]); return; }
  const faltan = [0, 1, 2].filter(n => !S.vencidos[`cuat_${E.id}_${n}`]).length;
  if(faltan){ await dialogo(quien, ['Primero pasá por mis muchachos, si podés.', faltan === 1 ? 'Te falta uno.' : `Te faltan ${faltan}.`]); return; }
  if(!hayLuchadorEnPie()){ await dialogo(quien, ['Volvé cuando tu equipo pueda tenerse en pie.']); return; }
  await dialogo(quien, E.jefe.antes);
  sec.pendiente = E.id; guardar();
  lanzarPeleaEntrenador({id: 'cuat_jefe_' + E.id, titulo: E.jefe.titulo, nombre: E.jefe.nombre, premio: E.jefe.premio, equipo: E.jefe.equipo, antes: [], despues: E.jefe.despues, lider: true, ropa: '#2A2420'},
    mapaActual().zonaPelea || 'pradera');
}
async function abrirJaula(E){
  const sec = SEC_CUAT();
  if(!sec[E.id]){ await dialogo('Jaula', ['Una jaula con candado. Adentro se escuchan criaturas asustadas.', 'La llave la tiene el jefe de los Cuatreros.']); return; }
  if(sec['jaula_' + E.id]){ await dialogo('Jaula', ['La jaula está vacía. Todas volvieron a casa.']); return; }
  sec['jaula_' + E.id] = true;
  await dialogo('Jaula', E.jaula.txt);
  const c = nuevaCriatura(E.jaula.criatura, E.region2 ? E.jaula.nivel : nivelProgresivo(E.jaula.nivel));
  if(S.equipo.length < MAX_EQUIPO) S.equipo.push(c); else S.reserva.push(c);
  S.album.vistos[c.esp] = true; S.album.capt[c.esp] = (S.album.capt[c.esp] || 0) + 1;
  const txt = darPremio({obj: E.region2 ? 'ultracapsula' : 'supercapsula', n: 5});
  guardar();
  await dialogo('¡Regalo!', [`¡${c.nombre} se unió a ${S.equipo.includes(c) ? 'tu equipo' : 'tu casa'}!`, `Entre las cosas robadas también encontraste ${txt}.`]);
}
async function hablarVigia(E, n){
  const sec = SEC_CUAT(), med = E.region2 ? cantMedallas2() : cantMedallas();
  if(med < E.medallas){ await dialogo(n.nombre, ['Circulá, circulá. Acá no hay nada que ver.']); return; }
  if(sec[E.id]){ await dialogo(n.nombre, ['Ya no somos Cuatreros. Ahora... ehm... vendemos empanadas.']); return; }
  if(S.vencidos['vigia_' + E.id]){
    await dialogo(n.nombre, ['Está bien, está bien. La puerta está atrás de esa pila de leña.', 'Entrá si te animás.']);
    const M = MAPAS['esc_' + E.id]; if(!M) return;
    salirDelMundo(); S.mundo = {mapa: M.id, x: M.entrada.x, y: M.entrada.y, mira: 'arriba'}; guardar(); pintarMundo();
    return;
  }
  if(!hayLuchadorEnPie()){ await dialogo(n.nombre, ['Volvé con el equipo sano, así no tiene gracia.']); return; }
  await dialogo(n.nombre, E.contexto);
  lanzarPeleaEntrenador({id: 'vigia_' + E.id, titulo: 'Cuatrero', nombre: n.nombre, premio: E.vigia.premio, equipo: E.vigia.equipo, antes: [], despues: ['¡Ay! Bueno, bueno... hablale de nuevo y te digo dónde está la puerta.'], ropa: '#5A4A40'},
    MAPAS[E.pueblo].zonaBase || 'pradera');
}
// Al volver de pelear con el jefe.
(() => {
  const orig = pintarMundo;
  pintarMundo = function(){
    const r = orig.apply(this, arguments);
    const sec = S && S.cuatreros;
    if(sec && sec.pendiente){
      const id = sec.pendiente; sec.pendiente = null;
      if(S.vencidos['cuat_jefe_' + id]){ sec[id] = true; guardar(); setTimeout(() => { if(MW) dialogo('Escondite', ['¡Los Cuatreros huyeron! Abrí la jaula para liberar a las criaturas robadas.']); }, 700); }
    }
    return r;
  };
})();
for(const E of ESCONDITES){
  const P = MAPAS[E.pueblo]; if(!P) continue;
  const sitio = lugarLibre(P, E.cerca[0], E.cerca[1]) || E.cerca;
  P.npc({id: 'vigia_' + E.id, x: sitio[0], y: sitio[1], tipo: 'vecino', nombre: E.vigia.nombre, ropa: '#5A4A40', pelo: '#2A2420', accion: n => hablarVigia(E, n)});
  const M = mapaEscondite(E, {mapa: E.pueblo, x: sitio[0], y: sitio[1] + 1 < P.h - 1 && !BLOQUEA.has(P.m[sitio[1] + 1][sitio[0]]) ? sitio[1] + 1 : sitio[1] - 1});
  MAPAS[M.id] = M;
}
// Cajones de madera y la jaula: muebles propios de los escondites.
(() => {
  const orig = muebleInterior;
  muebleInterior = function(ctx, sx, sy, tipo, mb = {}, t = 0){
    if(tipo === 'cajon'){
      ctx.fillStyle = '#B9874F'; ctx.strokeStyle = '#22304A'; ctx.lineWidth = 2.5;
      ctx.fillRect(sx + 2, sy - 2, 28, 30); ctx.strokeRect(sx + 2, sy - 2, 28, 30);
      ctx.strokeStyle = '#7A5232'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(sx + 4, sy); ctx.lineTo(sx + 28, sy + 26); ctx.moveTo(sx + 28, sy); ctx.lineTo(sx + 4, sy + 26); ctx.stroke();
      return;
    }
    if(tipo === 'jaula'){
      ctx.fillStyle = 'rgba(34,48,74,.15)'; ctx.fillRect(sx + 2, sy - 6, 28, 34);
      ctx.strokeStyle = '#5A6070'; ctx.lineWidth = 3;
      for(let x = 4; x <= 28; x += 6){ ctx.beginPath(); ctx.moveTo(sx + x, sy - 6); ctx.lineTo(sx + x, sy + 28); ctx.stroke(); }
      ctx.strokeRect(sx + 2, sy - 6, 28, 34);
      ctx.fillStyle = '#FFD23F'; ctx.fillRect(sx + 13, sy + 8, 6, 6);
      return;
    }
    return orig.apply(this, arguments);
  };
})();
// Chocar contra la jaula = intentar abrirla.
(() => {
  const origObs = obstaculoEn, origUsar = usarHabilidad;
  obstaculoEn = function(M, x, y){
    if(M && M.jaula && x === 7 && y === 2) return 'jaula';
    return origObs.apply(this, arguments);
  };
  usarHabilidad = function(obs, M){
    if(obs === 'jaula'){ if(MW){ MW.ocupado = true; abrirJaula(M.jaula).finally(() => { if(MW) MW.ocupado = false; }); } return; }
    return origUsar.apply(this, arguments);
  };
})();
