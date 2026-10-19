'use strict';
/* =====================================================================
   Criaturas de la Costa Oriental (región 2).
   Bichos, aves y mitos del Río de la Plata. Evolucionan a niveles altos
   porque se encuentran después de ganar la primera Liga.
   ===================================================================== */
const ESPECIES_R2 = [];
function linea2(o){
  linea(o);
  for(const id of o.ids){ ESPECIES_R2.push(id); ESPECIES[id].region = 2; }
}
const C2 = (vida, fuerza, vel) => [vida, fuerza, vel];

// ---- Líneas de tres etapas
linea2({ids: ['lobito', 'lobazo', 'lobomar'], nombres: ['Lobito', 'Lobazo', 'Lobomar'], tipo: 'agua', niveles: [62, 74], base: C2(24, 8, 6), forma: 'redondo',
  col: ['#8C7A6B', '#5E5046', '#D9CCBF', '#3B3029'], rasgos: ['bigotes', 'aletas'], extra: [[], ['collar'], ['collar', 'corona']],
  descs: ['Cachorro de lobo marino. Duerme panza arriba sobre las rocas de Cabo Polonio.', 'Ruge desde la orilla y espanta a los pescadores.', 'El rey de la lobería. Cuando ruge, el mar se calma.']});
linea2({ids: ['termalito', 'termon', 'geiseron'], nombres: ['Termalito', 'Termón', 'Géiserón'], tipo: 'fuego', niveles: [62, 74], base: C2(22, 9, 6), forma: 'llama',
  col: ['#FF9F5A', '#D9562B', '#FFE3B0', '#8FD3F7'], rasgos: ['burbujas'], extra: [[], ['cuerno'], ['cuernos', 'aura']],
  descs: ['Nace en el agua caliente de las termas. Siempre echa vapor.', 'Si te metés en su pileta, salís más relajado que nunca.', 'Un géiser con patas. Cuando estalla, empapa a todo el pueblo.']});
linea2({ids: ['terito', 'tero', 'terazo'], nombres: ['Terito', 'Tero', 'Terazo'], tipo: 'viento', niveles: [62, 74], base: C2(19, 8, 10), forma: 'ave',
  col: ['#E9E5DA', '#5A6070', '#FFFFFF', '#E2302E'], rasgos: ['cresta'], extra: [[], ['alitas'], ['alas', 'pinchos']],
  descs: ['Pichón de tero. Grita en un lado para que no encuentres su nido en el otro.', 'Te pasa rozando la cabeza si te acercás a su nido.', 'Sus espolones brillan. Ningún perro se anima a cruzar su campo.']});
linea2({ids: ['candombin', 'candombe', 'tamborazo'], nombres: ['Candombín', 'Candombe', 'Tamborazo'], tipo: 'normal', niveles: [62, 74], base: C2(22, 9, 7), forma: 'redondo',
  col: ['#E2B13C', '#9A5A2A', '#FFF0C9', '#2A6FDB'], rasgos: ['rayas'], extra: [[], ['collar'], ['collar', 'corona']],
  descs: ['Un tamborcito que salió solo a la calle. Toca chico, piano y repique.', 'Cuando pasa por el barrio, todos salen a bailar.', 'Su llamada se escucha en toda la rambla. Nadie se queda quieto.']});
linea2({ids: ['ombucito', 'ombuon', 'ombusaurio'], nombres: ['Ombucito', 'Ombuón', 'Ombusaurio'], tipo: 'planta', niveles: [62, 74], base: C2(26, 7, 4), forma: 'planta',
  col: ['#6FB35A', '#4A8A3A', '#E3F2C9', '#7A5232'], rasgos: ['hojas'], extra: [[], ['hojas', 'flor'], ['hojas', 'cuernos', 'aura']],
  descs: ['Un brote de ombú. Da sombra aunque sea chiquito.', 'Bajo su copa se arman mateadas enteras.', 'Un ombú centenario que camina. Las raíces le hacen de patas.']});
linea2({ids: ['butiacito', 'butia', 'butiazal'], nombres: ['Butiacito', 'Butiá', 'Butiazal'], tipo: 'planta', niveles: [62, 74], base: C2(21, 8, 7), forma: 'planta',
  col: ['#8DBF4A', '#5E8A2E', '#FFE7A0', '#F2A23A'], rasgos: ['hojas', 'manchas'], extra: [[], ['cola_hoja'], ['cola_hoja', 'corona']],
  descs: ['Palmerita de Rocha con frutitos naranjas.', 'Con sus frutos se hace licor. Nadie le dice que no.', 'Un palmar entero en una sola criatura. Huele a verano.']});
linea2({ids: ['chajacito', 'chaja', 'chajazo'], nombres: ['Chajacito', 'Chajá', 'Chajazo'], tipo: 'viento', niveles: [62, 74], base: C2(21, 8, 8), forma: 'ave',
  col: ['#9AA3AE', '#5E6670', '#E6E8EC', '#E2302E'], rasgos: ['cresta', 'collar'], extra: [[], ['alitas'], ['alas', 'pinchos']],
  descs: ['Pichón de chajá. Ya grita "¡chajá!" con todas sus fuerzas.', 'Hace de alarma del bañado: avisa a todos si viene alguien.', 'Tiene espolones en las alas y vuela altísimo en círculos.']});
linea2({ids: ['farolito', 'farol', 'farazo'], nombres: ['Farolito', 'Farol', 'Farazo'], tipo: 'rayo', niveles: [62, 74], base: C2(20, 9, 8), forma: 'cristal',
  col: ['#FFF3B0', '#E8A900', '#FFFFFF', '#E2302E'], rasgos: ['rayas'], extra: [[], ['aura'], ['aura', 'corona']],
  descs: ['Una lucecita que guía a los barcos chicos.', 'Gira la cabeza toda la noche para que nadie choque contra las rocas.', 'El faro más grande de la costa. Su luz llega hasta la otra orilla.']});
linea2({ids: ['agatin', 'agata', 'amatiston'], nombres: ['Agatín', 'Ágata', 'Amatistón'], tipo: 'piedra', niveles: [62, 74], base: C2(23, 9, 4), forma: 'cristal',
  col: ['#C9A0E8', '#7A4FC9', '#F2E6FF', '#D97AB0'], rasgos: ['cristales'], extra: [[], ['cuerno'], ['cuernos', 'aura']],
  descs: ['Una piedrita de Artigas con rayas de colores.', 'Por dentro brilla como un caleidoscopio.', 'Una geoda de amatista gigante. Los mineros la buscan hace cien años.']});
linea2({ids: ['nutriecita', 'nutria', 'nutrion'], nombres: ['Nutriecita', 'Nutria', 'Nutrión'], tipo: 'agua', niveles: [62, 74], base: C2(21, 8, 8), forma: 'cuadrupedo',
  col: ['#8A6646', '#5E4430', '#D9BFA0', '#F2A23A'], rasgos: ['bigotes', 'orejas_redondas'], extra: [[], ['cola_esponja'], ['cola_esponja', 'collar']],
  descs: ['Nada en los arroyos con la cabecita afuera.', 'Construye diques con ramitas. Muy prolija.', 'Muestra los dientes naranjas y el arroyo entero le hace caso.']});

// ---- Líneas de dos etapas
linea2({ids: ['yacarecito', 'yacare'], nombres: ['Yacarecito', 'Yacaré'], tipo: 'agua', niveles: [66], base: C2(24, 9, 5), forma: 'cuadrupedo',
  col: ['#5E8A4A', '#3E6230', '#C9D9A0', '#2F4A22'], rasgos: ['pinchos', 'rayas'], extra: [[], ['cuernos']],
  descs: ['Yacaré bebé. Toma sol con la boca abierta.', 'Flota quieto como un tronco... hasta que no.']});
linea2({ids: ['teyucito', 'teyu'], nombres: ['Teyucito', 'Teyú'], tipo: 'fuego', niveles: [66], base: C2(21, 9, 7), forma: 'cuadrupedo',
  col: ['#C2702E', '#7A3E1A', '#F2C27A', '#FFD23F'], rasgos: ['rayas', 'cola_llama'], extra: [[], ['pinchos']],
  descs: ['Lagarto overo que se calienta en las piedras.', 'Cuando se enoja, la cola le arde como una brasa.']});
linea2({ids: ['camoati', 'camoatazo'], nombres: ['Camoatí', 'Camoatazo'], tipo: 'bicho', niveles: [66], base: C2(18, 9, 9), forma: 'bicho',
  col: ['#C9A23A', '#5E4420', '#FFE8A0', '#DCEEFF'], rasgos: ['alitas', 'antenas', 'aguijon'], extra: [[], ['rayas']],
  descs: ['Avispita que arma nidos de cartón en los árboles.', 'Su nido es tan grande como una pelota de fútbol.']});
linea2({ids: ['candadito', 'candado'], nombres: ['Candadito', 'Candado'], tipo: 'bicho', niveles: [66], base: C2(22, 8, 6), forma: 'bicho',
  col: ['#3B8A6E', '#22304A', '#9FE0C4', '#C9A23A'], rasgos: ['antenas', 'caparazon'], extra: [[], ['cuernos']],
  descs: ['Bicho candado de caparazón brillante.', 'Nadie le puede abrir el caparazón. Por eso el nombre.']});
linea2({ids: ['tucurita', 'tucura'], nombres: ['Tucurita', 'Tucura'], tipo: 'bicho', niveles: [66], base: C2(18, 8, 10), forma: 'bicho',
  col: ['#8DBF3A', '#5E8A2E', '#E3F2A0', '#7A5232'], rasgos: ['antenas', 'alitas'], extra: [[], ['pinchos']],
  descs: ['Langostita que salta tres metros de un brinco.', 'Cuando vienen en manga, tapan el sol.']});
linea2({ids: ['franciscanita', 'franciscana'], nombres: ['Franciscanita', 'Franciscana'], tipo: 'agua', niveles: [66], base: C2(20, 8, 9), forma: 'pez',
  col: ['#C9C2B8', '#8C857A', '#F2EEE8', '#5E86A8'], rasgos: ['aletas'], extra: [[], ['corona']],
  descs: ['El delfín más chiquito del Río de la Plata.', 'Tiene el pico larguísimo y nada en el agua marrón como si nada.']});
linea2({ids: ['gaviotita', 'gavioton'], nombres: ['Gaviotita', 'Gaviotón'], tipo: 'viento', niveles: [66], base: C2(18, 8, 10), forma: 'ave',
  col: ['#FFFFFF', '#9AA3AE', '#F2F4F7', '#F2A23A'], rasgos: ['pico'], extra: [[], ['alas']],
  descs: ['Gaviota de la rambla. Te roba el bizcocho de la mano.', 'Planea sobre el puerto sin mover un ala.']});
linea2({ids: ['manopelada', 'manopelon'], nombres: ['Manopelada', 'Manopelón'], tipo: 'normal', niveles: [66], base: C2(20, 8, 8), forma: 'cuadrupedo',
  col: ['#8C857A', '#4A4540', '#E6E0D6', '#22304A'], rasgos: ['mascara', 'rayas'], extra: [[], ['collar']],
  descs: ['Lava la comida en el arroyo antes de comer. Muy higiénico.', 'Abre cualquier canasta de picnic. Nadie sabe cómo.']});
linea2({ids: ['montesito', 'montes'], nombres: ['Montesito', 'Montés'], tipo: 'normal', niveles: [66], base: C2(19, 9, 10), forma: 'cuadrupedo',
  col: ['#C9A06A', '#7A5A2A', '#F2E2C4', '#22304A'], rasgos: ['manchas', 'orejas_punta'], extra: [[], ['bigotes']],
  descs: ['Gatito montés de los montes del río.', 'Silencioso como la noche. Lo ves solo si él quiere.']});
linea2({ids: ['nacurutin', 'nacurutu'], nombres: ['Ñacurutín', 'Ñacurutú'], tipo: 'viento', niveles: [66], base: C2(20, 8, 8), forma: 'ave',
  col: ['#A8865E', '#6E5232', '#EADBC4', '#FFC93C'], rasgos: ['orejas_punta', 'rayas'], extra: [[], ['alas']],
  descs: ['Pichón de búho con los ojos más grandes que la cara.', 'Ulula toda la noche desde el monte. Ve todo.']});
linea2({ids: ['calandrita', 'calandria'], nombres: ['Calandrita', 'Calandria'], tipo: 'viento', niveles: [66], base: C2(17, 7, 11), forma: 'ave',
  col: ['#B8A88C', '#7A6A52', '#F2EAD8', '#5A4A3A'], rasgos: ['cresta'], extra: [[], ['alitas']],
  descs: ['Pajarito que imita a cualquier otro pájaro.', 'Su canto es tan lindo que los gauchos le componen milongas.']});
linea2({ids: ['dulcito', 'dulcelechon'], nombres: ['Dulcito', 'Dulcelechón'], tipo: 'normal', niveles: [66], base: C2(24, 7, 6), forma: 'redondo',
  col: ['#C98A4A', '#8A5A2A', '#F2D2A0', '#FFF3E2'], rasgos: ['orejas_redondas'], extra: [[], ['corona']],
  descs: ['Un tarrito de dulce de leche que cobró vida. Pegajoso pero adorable.', 'Discute con los argentinos de dónde es. Nunca pierde.']});
linea2({ids: ['chivito', 'chiviton'], nombres: ['Chivito', 'Chivitón'], tipo: 'normal', niveles: [66], base: C2(22, 9, 7), forma: 'cuadrupedo',
  col: ['#F2E2CC', '#B8945E', '#FFFFFF', '#7A5232'], rasgos: ['cuernos', 'orejas_largas'], extra: [[], ['collar']],
  descs: ['Cabrito de las sierras. Come de todo, hasta sánguches.', 'Trepa los cerros de Minas sin despeinarse.']});
linea2({ids: ['granicito', 'granizon'], nombres: ['Granicito', 'Granizón'], tipo: 'hielo', niveles: [66], base: C2(19, 9, 8), forma: 'cristal',
  col: ['#E6F6FF', '#9CCFE0', '#FFFFFF', '#5AB4E8'], rasgos: ['escarcha'], extra: [[], ['pinchos', 'aura']],
  descs: ['Una piedrita de granizo que se olvidó de derretirse.', 'Cae del cielo en tormentas de verano y abolla los techos.']});
linea2({ids: ['heladito', 'heladero'], nombres: ['Heladito', 'Heladero'], tipo: 'hielo', niveles: [66], base: C2(20, 8, 8), forma: 'redondo',
  col: ['#FFD6E6', '#F2A0C0', '#FFFFFF', '#8A5A35'], rasgos: ['escarcha'], extra: [[], ['corona']],
  descs: ['Un cucurucho de dulce de leche granizado. Se derrite al sol.', 'Recorre la playa en verano. Todos lo persiguen.']});
linea2({ids: ['anguilita', 'anguilazo'], nombres: ['Anguilita', 'Anguilazo'], tipo: 'rayo', niveles: [66], base: C2(19, 9, 9), forma: 'pez',
  col: ['#3E6E5A', '#22403A', '#9FD9C0', '#FFE45C'], rasgos: ['cola_rayo', 'rayas'], extra: [[], ['aura']],
  descs: ['Anguila de los bañados. Te da una patadita eléctrica.', 'Puede prender las luces de todo un barco.']});
linea2({ids: ['cantito', 'cantorrodado'], nombres: ['Cantito', 'Cantorrodado'], tipo: 'piedra', niveles: [66], base: C2(25, 8, 4), forma: 'redondo',
  col: ['#C9C2B8', '#8C857A', '#F2EEE8', '#5E86A8'], rasgos: ['rayas'], extra: [[], ['pinchos']],
  descs: ['Piedrita redonda que el río pulió durante mil años.', 'Rueda por los arroyos de Minas y nadie lo frena.']});
linea2({ids: ['escuercito', 'escuerzo'], nombres: ['Escuercito', 'Escuerzo'], tipo: 'agua', niveles: [66], base: C2(23, 9, 5), forma: 'redondo',
  col: ['#7A9A4A', '#4A6A2A', '#D9E8A0', '#E2302E'], rasgos: ['manchas', 'cuernos'], extra: [[], ['aura']],
  descs: ['Sapito gordo con cuernitos. Dicen que si te muerde no te suelta.', 'El terror de los cuentos de las abuelas. Pura leyenda… ¿o no?']});
linea2({ids: ['carpinchin', 'capibara'], nombres: ['Carpinchín', 'Capibara'], tipo: 'planta', niveles: [66], base: C2(26, 7, 5), forma: 'cuadrupedo',
  col: ['#9A7A52', '#6E5232', '#D9C2A0', '#5FB45A'], rasgos: ['orejas_redondas', 'hojas'], extra: [[], ['flor']],
  descs: ['Primo oriental del Carpincho, con plantitas en el lomo.', 'Lleva un jardín encima. Las mariposas lo adoran.']});

// ---- Criaturas raras (una sola etapa)
linea2({ids: ['lobizon'], nombres: ['Lobizón'], tipo: 'normal', niveles: [], base: C2(26, 12, 10), forma: 'cuadrupedo',
  col: ['#5A5050', '#2A2420', '#9A8C8C', '#FFE45C'], rasgos: ['orejas_punta', 'melena', 'aura'], captura: [.08],
  descs: ['El séptimo hijo varón que se convierte en las noches de luna llena. Muy raro.']});
linea2({ids: ['mboitata'], nombres: ['Mboitatá'], tipo: 'fuego', niveles: [], base: C2(24, 12, 11), forma: 'pez',
  col: ['#FF6A2E', '#C2412B', '#FFD23F', '#FFE45C'], rasgos: ['cola_llama', 'aura'], captura: [.08],
  descs: ['La víbora de fuego que cuida los campos de noche. Muy rara.']});
linea2({ids: ['yasy'], nombres: ['Yasy Yateré'], tipo: 'planta', niveles: [], base: C2(22, 11, 12), forma: 'bipedo',
  col: ['#F2D27A', '#C9A23A', '#FFF3C9', '#E2302E'], rasgos: ['flor', 'melena'], captura: [.08],
  descs: ['El duendecito rubio de la siesta, con su bastón de oro. Muy raro.']});
linea2({ids: ['carancho'], nombres: ['Carancho'], tipo: 'viento', niveles: [], base: C2(23, 11, 10), forma: 'ave',
  col: ['#5E4430', '#22304A', '#F2E6D0', '#F2A23A'], rasgos: ['cresta', 'alas'], captura: [.12],
  descs: ['El halcón de la pampa. Mira desde los postes con cara de pocos amigos.']});
linea2({ids: ['benteveo'], nombres: ['Benteveo'], tipo: 'rayo', niveles: [], base: C2(19, 10, 12), forma: 'ave',
  col: ['#FFD23F', '#5E4430', '#FFFFFF', '#22304A'], rasgos: ['mascara', 'cresta'], captura: [.14],
  descs: ['Grita "¡bien te veo!" y se le eriza la cresta de chispas.']});
linea2({ids: ['pomberito'], nombres: ['Pomberito'], tipo: 'bicho', niveles: [], base: C2(20, 11, 11), forma: 'bipedo',
  col: ['#7A5232', '#4A3020', '#C9A07A', '#5FB45A'], rasgos: ['orejas_largas', 'hojas'], captura: [.1],
  descs: ['Hijo del Pombero. Silba en el monte para que te pierdas.']});
linea2({ids: ['teyuyagua'], nombres: ['Teyú Yaguá'], tipo: 'piedra', niveles: [], base: C2(28, 12, 6), forma: 'cuadrupedo',
  col: ['#8C7A5A', '#5E4430', '#D9C9A0', '#E2302E'], rasgos: ['pinchos', 'cristales', 'aura'], captura: [.08],
  descs: ['El lagarto con cabeza de perro que guarda tesoros en las grutas. Muy raro.']});
linea2({ids: ['pamperito'], nombres: ['Pamperito'], tipo: 'hielo', niveles: [], base: C2(21, 10, 12), forma: 'redondo',
  col: ['#CFE8FF', '#7FA9D9', '#FFFFFF', '#3B82D6'], rasgos: ['nube', 'escarcha'], captura: [.12],
  descs: ['Un pedacito del viento pampero helado. Cuando llega, baja la temperatura diez grados.']});

// ---- Legendarias de la Costa Oriental
legendaria('yaguarete', 'Yaguareté', 'planta', 'cuadrupedo', ['#F2B63D', '#7A4A1C', '#FFF0CF', '#4FA03C'], ['manchas', 'orejas_redondas', 'hojas', 'aura', 'corona'],
  [[1, 'hojarasca'], [1, 'mordisco'], [1, 'golpazo'], [1, 'derrumbe']], 'Leyenda. El rey del monte. Duerme en lo más profundo de la Quebrada de los Cuervos.');
legendaria('marejadon', 'Marejadón', 'agua', 'pez', ['#2E5A8A', '#1C3A5E', '#BFE6FB', '#FFFFFF'], ['aletas', 'cresta', 'burbujas', 'aura', 'corona'],
  [[1, 'maremoto'], [1, 'ventisca'], [1, 'ola'], [1, 'golpazo']], 'Leyenda. Las olas de Isla de Lobos se levantan cuando nada debajo.');
// La ultra rara: solo la regala el Gaucho Eterno de la Gruta del Palacio.
legendaria('soldemayo', 'Sol de Mayo', 'fuego', 'llama', ['#FFD23F', '#F2A23A', '#FFF6C9', '#FFFFFF'], ['melena', 'corona', 'aura'],
  [[1, 'erupcion'], [1, 'fulminante'], [1, 'llamarada'], [1, 'golpazo']], 'Ultra rara. Un sol con cara que bajó del cielo. Solo se la da el Gaucho Eterno a quien le gana.');
ESPECIES.soldemayo.base = {vida: 66, fuerza: 28, velocidad: 24};
ESPECIES.soldemayo.ultra = true;
for(const id of ['yaguarete', 'marejadon', 'soldemayo']){ ESPECIES[id].region = 2; ESPECIES_R2.push(id); }

// Álbum: las nuevas después de las de la región 1 y antes de las legendarias.
for(const id of ESPECIES_R2) if(!ESPECIES[id].legendaria && !NORMALES.includes(id)) NORMALES.push(id);
ORDEN_ALBUM = ORDEN_ALBUM.filter(id => !ESPECIES[id].legendaria);
LEGENDARIAS.push('yaguarete', 'marejadon', 'soldemayo');
ORDEN_ALBUM = ORDEN_ALBUM.concat(LEGENDARIAS);

/* ---------------- Movimientos de los líderes orientales ---------------- */
Object.assign(MOVS, {
  rambla:   {nom: 'Viento de la rambla', tipo: 'viento', poder: 100, prec: 95, lider: true},
  termas:   {nom: 'Vapor termal', tipo: 'fuego', poder: 100, prec: 95, lider: true},
  loberia:  {nom: 'Rugido de lobería', tipo: 'agua', poder: 100, prec: 95, lider: true},
  llamada:  {nom: 'Llamada de tambores', tipo: 'normal', poder: 100, prec: 95, lider: true},
  palmar:   {nom: 'Palmar de Rocha', tipo: 'planta', poder: 100, prec: 95, lider: true},
  quebrada: {nom: 'Enjambre de la quebrada', tipo: 'bicho', poder: 100, prec: 95, lider: true},
  serrania: {nom: 'Alud de Minas', tipo: 'piedra', poder: 100, prec: 95, lider: true},
  apagon:   {nom: 'Apagón capitalino', tipo: 'rayo', poder: 100, prec: 95, lider: true},
});

/* ---------------- Pasaje del ferry ---------------- */
OBJETOS.push({id: 'pasaje', nom: 'Pasaje del Ferry', precio: 0, medallas: 99, usa: 'pasaje', icono: 'pasaje', clave: true, tipoObj: 'cura', enCombate: false,
  colores: ['#3B82D6', '#FFD23F'], desc: 'Sirve para tomar el ferry del muelle de Puerto Camalote a la Costa Oriental, ida y vuelta.'});

/* ---------------- Zonas salvajes de la Costa Oriental ---------------- */
Object.assign(ZONAS, {
  colonia_r:   {nom: 'Ruta de los Plátanos', niveles: [58, 63], aparecen: [['ombucito', 14], ['ombuon', 6], ['montesito', 12], ['chivito', 10], ['calandrita', 12], ['tucurita', 10], ['dulcito', 8], ['gaviotita', 10], ['carpinchin', 10], ['pamperito', 2]]},
  termas_r:    {nom: 'Campos Termales', niveles: [60, 66], aparecen: [['termalito', 16], ['teyucito', 14], ['manopelada', 10], ['tucurita', 10], ['chivito', 10], ['nacurutin', 10], ['termon', 6], ['teyu', 6], ['mboitata', 2]]},
  polonio_r:   {nom: 'Dunas del Cabo', niveles: [62, 68], aparecen: [['lobito', 16], ['gaviotita', 14], ['franciscanita', 12], ['terito', 10], ['butiacito', 10], ['lobazo', 6], ['gavioton', 6], ['heladito', 8]]},
  tacuarembo_r:{nom: 'Campo Gaucho', niveles: [64, 70], aparecen: [['terito', 14], ['tero', 8], ['carancho', 6], ['montes', 8], ['manopelon', 8], ['candombin', 12], ['chivito', 10], ['dulcito', 10], ['lobizon', 2]]},
  valizas_r:   {nom: 'Médanos de Valizas', niveles: [66, 72], aparecen: [['butia', 10], ['butiacito', 10], ['chajacito', 14], ['chaja', 6], ['calandria', 8], ['gavioton', 10], ['pamperito', 6], ['nutriecita', 10], ['benteveo', 4]]},
  quebrada_r:  {nom: 'Monte de la Quebrada', niveles: [68, 74], aparecen: [['camoati', 14], ['candadito', 12], ['tucura', 8], ['nacurutu', 8], ['yacarecito', 10], ['anguilita', 10], ['pomberito', 4], ['yasy', 2], ['escuercito', 10]]},
  minas_r:     {nom: 'Sierras de Minas', niveles: [70, 76], aparecen: [['agatin', 14], ['agata', 6], ['cantito', 12], ['chiviton', 8], ['granicito', 10], ['carancho', 6], ['montes', 8], ['teyuyagua', 2], ['escuerzo', 6]]},
  capital_r:   {nom: 'Rambla Capital', niveles: [72, 78], aparecen: [['farolito', 14], ['farol', 6], ['candombe', 10], ['gavioton', 10], ['anguilazo', 8], ['heladero', 8], ['benteveo', 6], ['granizon', 6], ['dulcelechon', 6]]},
  isla_r:      {nom: 'Isla de Lobos', niveles: [76, 82], aparecen: [['lobazo', 14], ['lobomar', 6], ['franciscana', 12], ['nutria', 10], ['yacare', 8], ['anguilazo', 8], ['escuerzo', 8]]},
  quebradacueva:{nom: 'Quebrada de los Cuervos', niveles: [74, 80], aparecen: [['nacurutu', 12], ['candado', 10], ['camoatazo', 10], ['tucura', 10], ['pomberito', 6], ['nutrion', 6], ['capibara', 8], ['ombusaurio', 4]]},
  palacio:     {nom: 'Gruta del Palacio', niveles: [80, 88], aparecen: [['amatiston', 10], ['cantorrodado', 12], ['teyuyagua', 4], ['agata', 12], ['geiseron', 6], ['farazo', 6], ['tamborazo', 6], ['terazo', 6], ['chajazo', 6], ['butiazal', 6]]},
  fortaleza_r: {nom: 'Camino a la Fortaleza', niveles: [80, 86], aparecen: [['lobomar', 8], ['geiseron', 8], ['terazo', 8], ['tamborazo', 8], ['ombusaurio', 8], ['butiazal', 8], ['chajazo', 8], ['farazo', 8], ['amatiston', 8], ['nutrion', 8]]},
  ferry:       {nom: 'Ferry', niveles: [1, 1], aparecen: []},
});
