'use strict';
/* =====================================================================
   Criaturas de Sorlandia: tipos, poderes, las 104 especies, zonas,
   objetos, medallas y reglas de combate.
   ===================================================================== */

const TIPOS = {
  normal:{nom:'Normal', color:'#D6D0C2'},
  fuego: {nom:'Fuego',  color:'#FFB089'},
  planta:{nom:'Planta', color:'#B6E3A1'},
  agua:  {nom:'Agua',   color:'#A9D8F5'},
  rayo:  {nom:'Rayo',   color:'#FFE27A'},
  piedra:{nom:'Piedra', color:'#C9B79C'},
  viento:{nom:'Viento', color:'#CFE3F7'},
  hielo: {nom:'Hielo',  color:'#D4F1F7'},
  bicho: {nom:'Bicho',  color:'#D9E58C'},
};
// A qué tipos le pega fuerte cada tipo (x2). Si el defensor le pega fuerte al atacante, el golpe rinde la mitad.
const VENTAJA = {
  fuego:['planta','hielo','bicho'],
  agua:['fuego','piedra'],
  planta:['agua','piedra'],
  rayo:['agua','viento'],
  piedra:['fuego','rayo','viento','hielo','bicho'],
  viento:['planta','bicho'],
  hielo:['planta','viento'],
  bicho:['planta'],
  normal:[],
};
function efectividad(tipoAtaque, tipoDefensor){
  if(tipoAtaque === 'normal') return 1;
  if((VENTAJA[tipoAtaque] || []).includes(tipoDefensor)) return 2;
  if((VENTAJA[tipoDefensor] || []).includes(tipoAtaque)) return .5;
  return 1;
}

/* ---------------- Poderes ---------------- */
const MOVS = {
  embestida:{nom:'Embestida', tipo:'normal', poder:40, prec:100},
  rasgunio: {nom:'Rasguño', tipo:'normal', poder:35, prec:100},
  mordisco: {nom:'Mordisco', tipo:'normal', poder:55, prec:95},
  golpazo:  {nom:'Golpazo', tipo:'normal', poder:85, prec:90},
  grunido:  {nom:'Gruñido', tipo:'normal', poder:0, prec:100, efecto:'bajaFuerza'},
  brasa:    {nom:'Brasa', tipo:'fuego', poder:40, prec:100},
  llamarada:{nom:'Llamarada', tipo:'fuego', poder:75, prec:85},
  erupcion: {nom:'Erupción', tipo:'fuego', poder:95, prec:80},
  hojita:   {nom:'Hoja filosa', tipo:'planta', poder:40, prec:100},
  latigo:   {nom:'Látigo de yerba', tipo:'planta', poder:65, prec:95},
  hojarasca:{nom:'Tormenta de hojas', tipo:'planta', poder:95, prec:80},
  chorrito: {nom:'Chorrito', tipo:'agua', poder:40, prec:100},
  ola:      {nom:'Ola', tipo:'agua', poder:70, prec:90},
  maremoto: {nom:'Maremoto', tipo:'agua', poder:95, prec:80},
  chispazo: {nom:'Chispazo', tipo:'rayo', poder:40, prec:100},
  trueno:   {nom:'Trueno', tipo:'rayo', poder:75, prec:85},
  fulminante:{nom:'Rayo fulminante', tipo:'rayo', poder:95, prec:80},
  pedrada:  {nom:'Pedrada', tipo:'piedra', poder:45, prec:95},
  derrumbe: {nom:'Derrumbe', tipo:'piedra', poder:75, prec:85},
  avalancha:{nom:'Avalancha', tipo:'piedra', poder:95, prec:80},
  rafaga:   {nom:'Ráfaga', tipo:'viento', poder:40, prec:100},
  remolino: {nom:'Remolino', tipo:'viento', poder:65, prec:90},
  huracan:  {nom:'Huracán', tipo:'viento', poder:95, prec:80},
  escarcha: {nom:'Escarcha', tipo:'hielo', poder:40, prec:100},
  granizo:  {nom:'Granizo', tipo:'hielo', poder:65, prec:95},
  ventisca: {nom:'Ventisca', tipo:'hielo', poder:95, prec:80},
  picadura: {nom:'Picadura', tipo:'bicho', poder:40, prec:100},
  enjambre: {nom:'Enjambre', tipo:'bicho', poder:65, prec:95},
  plaga:    {nom:'Plaga', tipo:'bicho', poder:95, prec:80},
  // Movimientos que enseñan los líderes de gimnasio (pegan fuerte y casi no fallan).
  terremoto:{nom:'Terremoto serrano', tipo:'piedra', poder:90, prec:95, lider:true},
  torrente: {nom:'Torrente del puerto', tipo:'agua', poder:90, prec:95, lider:true},
  descarga: {nom:'Descarga de tormenta', tipo:'rayo', poder:90, prec:95, lider:true},
  parrilla: {nom:'Fuego de parrilla', tipo:'fuego', poder:90, prec:95, lider:true},
  selva:    {nom:'Selva misionera', tipo:'planta', poder:90, prec:95, lider:true},
  tabano:   {nom:'Ataque de tábanos', tipo:'bicho', poder:90, prec:95, lider:true},
  zonda:    {nom:'Viento zonda', tipo:'viento', poder:90, prec:95, lider:true},
  helada:   {nom:'Helada patagónica', tipo:'hielo', poder:90, prec:95, lider:true},
};
const MOV_TIPO = {
  fuego:['brasa','llamarada','erupcion'], planta:['hojita','latigo','hojarasca'], agua:['chorrito','ola','maremoto'],
  rayo:['chispazo','trueno','fulminante'], piedra:['pedrada','derrumbe','avalancha'], viento:['rafaga','remolino','huracan'],
  hielo:['escarcha','granizo','ventisca'], bicho:['picadura','enjambre','plaga'], normal:['rasgunio','mordisco','golpazo'],
};
function aprendeDe(tipo){
  const [b, m, f] = MOV_TIPO[tipo];
  return tipo === 'normal'
    ? [[1,'embestida'],[1,'rasgunio'],[5,'grunido'],[12,'mordisco'],[30,'golpazo']]
    : [[1,'embestida'],[1,b],[5,'grunido'],[11,'mordisco'],[17,m],[30,f]];
}

/* ---------------- Especies ---------------- */
// Cada línea evolutiva: nombres por etapa, niveles de evolución, stats de la etapa 1 y dibujo.
const MULT_ETAPA = [0, 1, 1.45, 1.9];
const CAPTURA_ETAPA = [0, .5, .3, .15];
const ESPECIES = {};
let ORDEN_ALBUM = [];
function linea(o){
  o.ids.forEach((id, i) => {
    const etapa = i + 1, m = MULT_ETAPA[etapa];
    ESPECIES[id] = {
      id, nombre: o.nombres[i], tipo: o.tipo, etapa,
      base: {vida: Math.round(o.base[0] * m), fuerza: Math.round(o.base[1] * m), velocidad: Math.round(o.base[2] * m)},
      captura: o.captura ? o.captura[i] : CAPTURA_ETAPA[etapa],
      aprende: aprendeDe(o.tipo),
      desc: o.descs[i],
      evol: o.ids[i + 1] ? {a: o.ids[i + 1], nivel: o.niveles[i]} : null,
      de: o.ids[i - 1] || null,
      dib: o.mano ? {mano: o.mano, col: o.col} : {forma: o.forma, col: o.col, rasgos: [...(o.rasgos || []), ...((o.extra && o.extra[i]) || [])]},
      inicial: !!o.inicial && etapa === 1,
    };
    ORDEN_ALBUM.push(id);
  });
}

// --- Iniciales
linea({ids:['carosor','carosaurio','carotitan'], nombres:['Tizoncito','Tizonazo','Tizontitán'], tipo:'fuego', niveles:[16,32], base:[20,7,5], mano:'carosor', col:['#F47A45','#D85A2A','#FFD98A','#FFD23F'], inicial:true,
  descs:['Cabeza dura y cola encendida. Le encanta entrenar.', 'Ya no cabe en la mochila. Cuando se emociona, le salen llamas de la cabeza.', 'Dicen que una vez prendió una parrilla con solo mirarla.']});
linea({ids:['matesor','matesaurio','matetitan'], nombres:['Ombucito','Ombuzón','Ombutitán'], tipo:'planta', niveles:[16,32], base:[24,6,5], mano:'matesor', col:['#72C25B','#4FA03C','#E5F5C6','#9BDB6E'], inicial:true,
  descs:['Tiene un brote de yerba en la cabeza. Tranquilo y compañero.', 'Le florece la espalda y huele a mate recién cebado.', 'Un bosque entero le crece encima. Aguanta lo que le tiren.']});
linea({ids:['rufisor','rufisaurio','rufititan'], nombres:['Rufisor','Rufisaurio','Rufititán'], tipo:'agua', niveles:[16,32], base:[20,6,7], mano:'rufisor', col:['#4EA8E3','#2E86C4','#D6EFFF','#8FD3F7'], inicial:true,
  descs:['Un perrito yorkie de agua: chiquito, peinado con moño y con más carácter que un perro grande.', 'Se sacude al salir del agua y moja a todos. Su flequillo nunca se despeina.', 'Cuando ladra, el río sube un metro.']});

// --- Especies de las primeras regiones y sus evoluciones
linea({ids:['pampito','pampero'], nombres:['Pampito','Pampero'], tipo:'normal', niveles:[18], base:[16,5,8], mano:'pampito', col:['#D9C3A0','#B79D78','#F4E8D2','#8C6E4A'],
  descs:['Corre por el pasto en zigzag. Si lo perdés de vista, ya está a dos cuadras.', 'Corre tan rápido que levanta viento. Por eso le dicen así.']});
linea({ids:['hornerito','hornero','horneron'], nombres:['Hornerito','Hornero','Hornerón'], tipo:'viento', niveles:[14,30], base:[15,5,9], mano:'hornerito', col:['#C9783F','#A9612F','#F2D7B5','#9C5A2C'],
  descs:['Arma su nido de barro en cualquier poste. El más laburante de la pradera.', 'Su nido tiene dos ambientes y patio.', 'Construye casas de barro tan grandes que viven familias adentro.']});
linea({ids:['chispulo','chispon'], nombres:['Chispulo','Chispón'], tipo:'rayo', niveles:[20], base:[14,6,9], mano:'chispulo', col:['#4656A0','#2F3C7A','#FFE45C','#FFE45C'],
  descs:['Luciérnaga cargada de electricidad. De noche titila entre los árboles.', 'Ilumina un potrero entero. Los grillos lo siguen a todos lados.']});
linea({ids:['ceibin','ceibal'], nombres:['Ceibín','Ceibal'], tipo:'planta', niveles:[18], base:[18,5,5], mano:'ceibin', col:['#79C266','#4E9A3F','#D7F0C4','#E63B4B'],
  descs:['Le florecen ceibos rojos en la cabeza.', 'Cuando florece entero, todo el bosque se pone colorado.']});
linea({ids:['carpinchito','carpincho','carpinchon'], nombres:['Carpinchito','Carpincho','Carpinchón'], tipo:'agua', niveles:[15,32], base:[22,5,4], mano:'carpinchito', col:['#A8784E','#7E5434','#C79A6E','#8FD3F7'],
  descs:['Nada le cambia el humor. Los demás se le suben encima a descansar.', 'Puede pasar un día entero en el agua sin mover un pelo.', 'Una isla con patas. Sobre su lomo crecen camalotes.']});
linea({ids:['tatupiedra','tatupenon'], nombres:['Tatupiedra','Tatupeñón'], tipo:'piedra', niveles:[22], base:[20,7,3], mano:'tatupiedra', col:['#9AA3AE','#6E7884','#E7C9A5','#C9B79C'],
  descs:['Su caparazón es de piedra de la sierra. Se hace bolita y rueda.', 'Cuando rueda cuesta abajo, arrastra media montaña.']});
linea({ids:['brasita','brasero'], nombres:['Brasita','Brasero'], tipo:'fuego', niveles:[22], base:[15,7,7], mano:'brasita', col:['#E2492E','#B8331F','#FFB36B','#FFD23F'],
  descs:['Salamandra que vive entre piedras calientes. Deja huellitas humeantes.', 'Su lomo siempre está a punto para hacer un asado.']});
linea({ids:['yaguarayo'], nombres:['Yaguarayo'], tipo:'rayo', niveles:[], base:[20,9,9], mano:'yaguarayo', col:['#F2B63D','#7A4A1C','#FFF0CF'], captura:[.15],
  descs:['Muy raro. Sus manchas brillan antes de una tormenta.']});
linea({ids:['morrito','morro','cerrazo'], nombres:['Morrito','Morro','Cerrazo'], tipo:'piedra', niveles:[16,34], base:[22,7,3], mano:'morrito', col:['#A9B1BC','#7E8793','#C3C9D1','#79B95F'],
  descs:['Una piedra con musgo que un día se despertó.', 'Duerme parado y ronca como un trueno.', 'Tan grande que los cóndores lo usan de mirador.']});
linea({ids:['cardoncito','cardonal'], nombres:['Cardoncito','Cardonal'], tipo:'planta', niveles:[20], base:[20,6,4], mano:'cardoncito', col:['#5BAE5B','#3F8A4A','#F4F0D0','#FF7FA3'],
  descs:['Cardón chiquito de los cerros. Si lo abrazás despacito, no pincha.', 'Florece una vez por año y esa noche nadie duerme en el cerro.']});
linea({ids:['condorcito','condoralto'], nombres:['Condorcito','Cóndoralto'], tipo:'viento', niveles:[26], base:[18,7,8], mano:'condorcito', col:['#3B3F4A','#2E323C','#5A5F6B','#FFFFFF'],
  descs:['Pichón de cóndor. Todavía no sabe planear, pero se tira igual.', 'Planea sobre la cordillera sin mover las alas en todo el día.']});
linea({ids:['bagrecito','bagron'], nombres:['Bagrecito','Bagrón'], tipo:'agua', niveles:[22], base:[21,6,5], mano:'bagrecito', col:['#7FA0C0','#5E7E9E','#DCE8F2','#5E7E9E'],
  descs:['Bagre bigotudo del puerto. Con los bigotes siente quién se acerca.', 'Sus bigotes miden un metro. Los pescadores le tienen respeto.']});
linea({ids:['nubarron','tormenton'], nombres:['Nubarrón','Tormentón'], tipo:'rayo', niveles:[28], base:[19,8,7], mano:'nubarron', col:['#8A93B8','#6D769C','#C9CEE6','#FFE45C'],
  descs:['Nube de tormenta con mal genio. Cuando se enoja, llueve solo encima de él.', 'Si aparece en el cielo, mejor entrar la ropa.']});
linea({ids:['zorrolumbre','zorrofogon'], nombres:['Zorrolumbre','Zorrofogón'], tipo:'fuego', niveles:[30], base:[19,9,8], mano:'zorrolumbre', col:['#E8743B','#3B2A22','#FFF3E2','#FFD23F'],
  descs:['Zorro colorado con la cola prendida fuego. Te roba la merienda y se va riendo.', 'Su cola deja un rastro de chispas por todo el volcán.']});

// --- Especies nuevas
linea({ids:['cuisito','cuison'], nombres:['Cuisito','Cuisón'], tipo:'normal', niveles:[16], base:[16,5,7], forma:'redondo', col:['#C9A27E','#9C7552','#F2E2CC'], rasgos:['orejas_redondas','bigotes'], extra:[[],['collar']],
  descs:['Cuis curioso que se mete en cualquier agujero.', 'Guarda semillas para todo el invierno en los cachetes.']});
linea({ids:['nandusito','nandu','nanduron'], nombres:['Ñandusito','Ñandú','Ñandurón'], tipo:'normal', niveles:[16,32], base:[17,6,9], forma:'ave', col:['#B8B2A6','#8C857A','#ECE7DC','#6E685F'], rasgos:['cresta'], extra:[[],['collar'],['collar','alas']],
  descs:['Pichón de ñandú. Corre antes de aprender a caminar.', 'Cruza la pampa en un ratito. No vuela, pero no le hace falta.', 'Cuando corre, la tierra tiembla como si pasara una tropilla.']});
linea({ids:['peludito','peludon'], nombres:['Peludito','Peludón'], tipo:'normal', niveles:[20], base:[20,6,4], forma:'cuadrupedo', col:['#B58E6A','#8A6646','#E6D2B8','#9C7A5A'], rasgos:['caparazon','orejas_punta'], extra:[[],['pinchos']],
  descs:['Mulita peluda que cava túneles bajo la pradera.', 'Su caparazón es tan duro que se usa de escudo.']});
linea({ids:['fogoncito','fogonero','fogonazo'], nombres:['Fogoncito','Fogonero','Fogonazo'], tipo:'fuego', niveles:[14,30], base:[15,7,6], forma:'llama', col:['#FF8A3D','#C2412B','#FFE36B','#FFD23F'], rasgos:[], extra:[[],['cuerno'],['cuernos','aura']],
  descs:['Un fueguito de campamento que se escapó del fogón.', 'Cuida a los que acampan en la sierra. Si hace frío, se acerca.', 'Una fogata gigante que camina. Las brasas le hacen de ojos.']});
linea({ids:['ajicito','ajipicante'], nombres:['Ajicito','Ajipicante'], tipo:'fuego', niveles:[22], base:[14,8,8], forma:'planta', col:['#E2302E','#9E1E1C','#FF8A6A','#4F9A3F'], rasgos:['hojas'], extra:[[],['llamas_cabeza']],
  descs:['Ají del cerro con mucho carácter. No lo muerdas.', 'Pica tanto que hasta Zorrolumbre le tiene miedo.']});
linea({ids:['luzmala'], nombres:['Luz Mala'], tipo:'fuego', niveles:[], base:[18,10,10], forma:'llama', col:['#8FE3FF','#3E7FB8','#E6FAFF','#BFE9FF'], rasgos:['aura'], captura:[.12],
  descs:['Una luz que aparece de noche en el campo. Nadie sabe de dónde viene.']});
linea({ids:['brotecito','yerbatin','yerbatero'], nombres:['Brotecito','Yerbatín','Yerbatero'], tipo:'planta', niveles:[14,30], base:[17,5,6], forma:'planta', col:['#7CC46A','#4E9A3F','#D7F0C4','#B97A4A'], rasgos:['hojas'], extra:[[],['flor'],['flor','cola_hoja']],
  descs:['Un brote de yerba que salió caminando de la maceta.', 'Si te sentás al lado, te ceba un mate.', 'Un yerbal entero en una sola criatura.']});
linea({ids:['jacarandita','jacaranda'], nombres:['Jacarandita','Jacarandá'], tipo:'planta', niveles:[20], base:[16,6,7], forma:'bipedo', col:['#9C7CD4','#6E52A8','#E6DCF7','#C77DFF'], rasgos:['flor','orejas_punta'], extra:[[],['hojas','cola_hoja']],
  descs:['Cuando camina, va dejando florcitas violetas.', 'En noviembre se pone toda violeta y no hay quien no la mire.']});
linea({ids:['honguito','hongazo'], nombres:['Hongüito','Hongazo'], tipo:'planta', niveles:[22], base:[20,6,3], forma:'redondo', col:['#F2E2CC','#C9A27E','#FFFFFF','#E2492E'], rasgos:['hongo'], extra:[[],['manchas']],
  descs:['Aparece después de la lluvia en el bosque.', 'Suelta esporas que dan sueño. Mejor no respirar cerca.']});
linea({ids:['renacuajin','ranacua','sapucay'], nombres:['Renacuajín','Ranacuá','Sapucay'], tipo:'agua', niveles:[14,30], base:[16,5,8], forma:'redondo', col:['#6CC08A','#3F8F5A','#E6F5DA','#2F6E4A'], rasgos:['manchas'], extra:[[],['aletas'],['aletas','cuernos']],
  descs:['Renacuajo inquieto que no para de nadar.', 'Croa tan fuerte que se escucha en todo el río.', 'Su grito retumba en la costa como un sapucay de fiesta.']});
linea({ids:['pejerrin','pejerrey'], nombres:['Pejerrín','Pejerrey'], tipo:'agua', niveles:[18], base:[15,6,9], forma:'pez', col:['#B8D8EC','#7FA6C2','#EEF6FB','#5E86A8'], rasgos:['rayas'], extra:[[],['corona']],
  descs:['Pececito plateado que nada en cardumen.', 'El rey del río. Se deja ver solo en los días de sol.']});
linea({ids:['tortuguin','tortugon'], nombres:['Tortuguín','Tortugón'], tipo:'agua', niveles:[24], base:[24,5,3], forma:'cuadrupedo', col:['#8FC77A','#5E9A4C','#E6F5D0','#7E9A5A'], rasgos:['caparazon'], extra:[[],['pinchos']],
  descs:['Tortuguita de agua que toma sol en los troncos.', 'Lleva cien años nadando el mismo río.']});
linea({ids:['enchufin','enchufon'], nombres:['Enchufín','Enchufón'], tipo:'rayo', niveles:[20], base:[15,7,8], forma:'redondo', col:['#F2F2F2','#B8B8B8','#FFFFFF','#FFE45C'], rasgos:['enchufe','cola_rayo'], extra:[[],['cuernos']],
  descs:['Se mete en los enchufes a comer electricidad.', 'Si se enoja, corta la luz de todo el puerto.']});
linea({ids:['pilita','pilon','voltazo'], nombres:['Pilita','Pilón','Voltazo'], tipo:'rayo', niveles:[16,32], base:[16,7,7], forma:'cristal', col:['#FFD23F','#E8A900','#FFF3B0','#22304A'], rasgos:['enchufe'], extra:[[],['cola_rayo'],['cola_rayo','aura']],
  descs:['Una pila que se cargó de más y salió caminando.', 'Puede cargar un celular en un segundo.', 'Tiene más energía que la represa.']});
linea({ids:['tormentin'], nombres:['Tormentín'], tipo:'rayo', niveles:[], base:[17,10,11], forma:'redondo', col:['#5A6B9C','#3A4878','#9CA8D6','#FFE45C'], rasgos:['nube','cola_rayo','alitas'], captura:[.14],
  descs:['Raro. Aparece solo en lo más alto del cerro cuando truena.']});
linea({ids:['fosilito','fosilon'], nombres:['Fosilito','Fosilón'], tipo:'piedra', niveles:[24], base:[19,8,4], forma:'bipedo', col:['#D9C9A8','#A89470','#F2EAD8','#8A7650'], rasgos:['cresta','rayas'], extra:[[],['cuernos','pinchos']],
  descs:['Un dinosaurio de piedra que se despertó después de millones de años.', 'Los paleontólogos lo persiguen con pincelitos.']});
linea({ids:['cuarcito','cuarzon','geodon'], nombres:['Cuarcito','Cuarzón','Geodón'], tipo:'piedra', niveles:[16,32], base:[18,7,5], forma:'cristal', col:['#E8C9F2','#A879C2','#FFFFFF','#D8B4F0'], rasgos:['cristales'], extra:[[],['cuerno'],['cuerno','aura']],
  descs:['Un cristal de las sierras que brilla al sol.', 'Por dentro tiene una cueva llena de cristales violetas.', 'Una geoda gigante. Si brilla, es que está contento.']});
linea({ids:['picaflorcito','picaflor'], nombres:['Picaflorcito','Picaflor'], tipo:'viento', niveles:[20], base:[13,6,11], forma:'ave', col:['#3FB98A','#2A8A66','#C9F2E0','#E2492E'], rasgos:['alitas'], extra:[[],['cresta']],
  descs:['Mueve las alas tan rápido que zumba.', 'Puede quedarse quieto en el aire. Visita mil flores por día.']});
linea({ids:['bichofeo'], nombres:['Bichofeo'], tipo:'viento', niveles:[], base:[17,8,9], forma:'ave', col:['#E8C23A','#7A5A2A','#FFF2B0','#22304A'], rasgos:['mascara','cresta'], captura:[.3],
  descs:['Grita su propio nombre todo el día. Feo no es, ¡es simpático!']});
linea({ids:['barrilete','barriletazo'], nombres:['Barrilete','Barriletazo'], tipo:'viento', niveles:[22], base:[14,6,10], forma:'cristal', col:['#FF7FA3','#C2416E','#FFE0EA','#3B82D6'], rasgos:['cola_hoja'], extra:[[],['alas']],
  descs:['Un barrilete que se cortó el hilo y aprendió a volar solo.', 'Vuela tan alto que se le pierde el rastro entre las nubes.']});
linea({ids:['pinguinito','pinguinazo'], nombres:['Pingüinito','Pingüinazo'], tipo:'hielo', niveles:[22], base:[18,6,6], forma:'redondo', col:['#2E3A52','#1C2638','#FFFFFF','#F0A93B'], rasgos:['pico'], extra:[[],['collar']],
  descs:['Pichón de pingüino que se perdió del sur. Le encanta el frío.', 'Se tira de panza por la nieve a toda velocidad.']});
linea({ids:['escarchin','escarchon','glaciaro'], nombres:['Escarchín','Escarchón','Glaciaro'], tipo:'hielo', niveles:[16,32], base:[16,7,8], forma:'cuadrupedo', col:['#DFF4FA','#9CCFE0','#FFFFFF','#BFE9FF'], rasgos:['orejas_punta','cola_esponja'], extra:[[],['cristales'],['cristales','collar']],
  descs:['Zorrito de las cumbres. Donde pisa, deja escarcha.', 'Su aliento congela los charcos en un segundo.', 'Dicen que de su cola nacen los glaciares.']});
linea({ids:['huemulito','huemul'], nombres:['Huemulito','Huemul'], tipo:'hielo', niveles:[22], base:[19,7,8], forma:'cuadrupedo', col:['#A8865E','#7A5E3E','#EADBC4','#F4E8D2'], rasgos:['orejas_punta'], extra:[[],['cuernos','escarcha']],
  descs:['Ciervito de la montaña nevada. Muy tímido.', 'Su cornamenta brilla con la escarcha de la mañana.']});
linea({ids:['vaquitita','vaquiton'], nombres:['Vaquitita','Vaquitón'], tipo:'bicho', niveles:[16], base:[14,5,7], forma:'bicho', col:['#E2302E','#22304A','#FFFFFF','#22304A'], rasgos:['manchas','antenas'], extra:[[],['alitas']],
  descs:['Vaquita de San Antonio. Si se te posa en la mano, trae suerte.', 'Tiene tantas manchas que nadie las pudo contar.']});
linea({ids:['hormiguin','hormigon','hormigazo'], nombres:['Hormiguín','Hormigón','Hormigazo'], tipo:'bicho', niveles:[14,30], base:[15,7,6], forma:'bicho', col:['#B8452B','#7A2A1C','#E28A6A','#22304A'], rasgos:['antenas'], extra:[[],['cuernos'],['cuernos','pinchos']],
  descs:['Hormiga colorada. Levanta diez veces su peso.', 'Construye hormigueros con túneles de un kilómetro.', 'La reina de la colonia. Nadie le discute.']});
linea({ids:['grillito','grillon'], nombres:['Grillito','Grillón'], tipo:'bicho', niveles:[18], base:[13,6,9], forma:'bicho', col:['#5E8A3A','#3E6A26','#B8D88A','#2F4A1C'], rasgos:['antenas','alitas'], extra:[[],['pinchos']],
  descs:['Canta toda la noche en la pradera.', 'Su canto se escucha a tres cuadras. Ideal para dormir... o no.']});
linea({ids:['mariposita','mariposon'], nombres:['Mariposita','Mariposón'], tipo:'bicho', niveles:[18], base:[13,6,8], forma:'bicho', col:['#F2B63D','#C27A1C','#FFE8B0','#5AB4E8'], rasgos:['alas','antenas'], extra:[[],['flor']],
  descs:['Revolotea entre las flores de la pradera.', 'Sus alas tienen los colores de un atardecer.']});
linea({ids:['mamboreta'], nombres:['Mamboretá'], tipo:'bicho', niveles:[], base:[16,10,9], forma:'bicho', col:['#7CC46A','#4E9A3F','#D7F0C4','#3F8A4A'], rasgos:['antenas','alitas','pinchos'], captura:[.25],
  descs:['Rezador del bosque. Se queda quieto horas, hasta que ataca.']});
linea({ids:['abejita','abejorro'], nombres:['Abejita','Abejorro'], tipo:'bicho', niveles:[18], base:[13,7,8], forma:'bicho', col:['#FFD23F','#22304A','#FFF3B0','#DCEEFF'], rasgos:['alitas','antenas','aguijon'], extra:[[],['rayas']],
  descs:['Junta miel de las flores del bosque. Muy trabajadora.', 'Zumba tan fuerte que asusta. Pero solo pica si la molestás.']});

// --- Legendarias: solo tres, muy difíciles de conseguir.
function legendaria(id, nombre, tipo, forma, col, rasgos, aprende, desc){
  ESPECIES[id] = {id, nombre, tipo, etapa: 1, legendaria: true, base: {vida: 58, fuerza: 24, velocidad: 20}, captura: .025,
    aprende, desc, evol: null, de: null, dib: {forma, col, rasgos}};
}
legendaria('intiraya', 'Intiraya', 'fuego', 'cuadrupedo', ['#FFC93C','#E8742B','#FFF3B0','#FF9F2E'], ['melena','orejas_punta','cola_llama','aura','corona'],
  [[1,'llamarada'],[1,'mordisco'],[1,'erupcion'],[1,'golpazo']], 'Leyenda. Dicen que es un pedazo del sol que se quedó en Monte Fogón.');
legendaria('yacura', 'Yacurá', 'agua', 'pez', ['#3FB8B0','#1F7A82','#D6F5F2','#8FE3FF'], ['aletas','cresta','burbujas','aura','corona'],
  [[1,'ola'],[1,'maremoto'],[1,'mordisco'],[1,'granizo']], 'Leyenda. El espíritu del río, que se deja ver al final del muelle de Camalote.');
legendaria('huracanto', 'Huracanto', 'viento', 'ave', ['#7A4FC9','#4B2E8A','#E6DCF7','#FFE45C'], ['alas','cresta','cola_rayo','aura','corona'],
  [[1,'huracan'],[1,'fulminante'],[1,'remolino'],[1,'golpazo']], 'Leyenda. El ave de la tormenta. Cuando bate las alas, llueve en todo Cerro Tormenta.');
const LEGENDARIAS = ['intiraya', 'yacura', 'huracanto'];
ORDEN_ALBUM = ORDEN_ALBUM.concat(LEGENDARIAS);
const NORMALES = Object.keys(ESPECIES).filter(id => !ESPECIES[id].legendaria);

/* ---------------- Zonas del mundo ---------------- */
const ZONAS = {
  pueblo:{nom:'Pueblo Ceibo', niveles:[1,1], aparecen:[]},
  pradera:{nom:'Pradera', niveles:[2,5], aparecen:[['pampito',18],['hornerito',14],['cuisito',14],['vaquitita',12],['grillito',11],['mariposita',10],['chispulo',8],['nandusito',8],['peludito',5]]},
  bosque:{nom:'Bosque de Ceibos', niveles:[4,8], aparecen:[['ceibin',16],['chispulo',12],['honguito',12],['hormiguin',12],['brotecito',10],['abejita',10],['mariposita',8],['jacarandita',8],['mamboreta',4],['yaguarayo',2]]},
  rio:{nom:'Orillas del Río', niveles:[4,8], aparecen:[['carpinchito',24],['renacuajin',20],['pejerrin',14],['tortuguin',14],['hornerito',10],['enchufin',10],['jacarandita',8]]},
  sierras:{nom:'Sierras', niveles:[5,9], aparecen:[['tatupiedra',22],['brasita',14],['cardoncito',14],['fosilito',12],['cuarcito',12],['ajicito',12],['fogoncito',10],['peludito',4]]},
  villapiedra:{nom:'Villa Piedra', niveles:[1,1], aparecen:[]},
  serrania:{nom:'Serranía Alta', niveles:[8,12], aparecen:[['morrito',16],['cardoncito',10],['condorcito',10],['cuarcito',10],['fosilito',10],['picaflorcito',10],['barrilete',10],['nandusito',8],['peludito',8],['bichofeo',4],['pampero',4]]},
  camalote:{nom:'Puerto Camalote', niveles:[1,1], aparecen:[]},
  costa:{nom:'Costa del Puerto', niveles:[11,15], aparecen:[['bagrecito',16],['carpincho',10],['pejerrin',10],['ranacua',10],['tortuguin',10],['pilita',12],['enchufin',10],['pinguinito',10],['hornero',6],['luzmala',2]]},
  tormenta:{nom:'Cerro Tormenta', niveles:[1,1], aparecen:[]},
  cumbres:{nom:'Cumbres Nevadas', niveles:[15,19], aparecen:[['nubarron',14],['condorcito',10],['escarchin',14],['huemulito',12],['pinguinito',10],['pilita',10],['chispon',8],['picaflor',6],['barrilete',6],['tormentin',3],['yaguarayo',3]]},
  fogon:{nom:'Monte Fogón', niveles:[1,1], aparecen:[]},
  volcan:{nom:'Laderas del Volcán', niveles:[19,24], aparecen:[['zorrolumbre',16],['brasita',8],['brasero',8],['morro',10],['fogonero',10],['ajipicante',8],['tatupenon',8],['fosilon',6],['cuarzon',6],['hormigon',6],['luzmala',3]]},
  interior:{nom:'', niveles:[1,1], aparecen:[]},
  supremo:{nom:'Cumbre Suprema', niveles:[1,1], aparecen:[]},
  cueva:{nom:'Cueva Oscura', niveles:[18,22], aparecen:[['cuarcito',22],['fosilon',14],['morro',14],['hormigon',14],['grillon',10],['chispon',10],['cuarzon',10],['geodon',3]]},
  victoria:{nom:'Camino de la Victoria', niveles:[24,30], aparecen:[['carpincho',8],['hornero',7],['chispon',7],['ceibal',6],['morro',7],['cardonal',6],['condoralto',5],['bagron',6],['tormenton',4],['pampero',7],['nandu',7],['ranacua',6],['yerbatin',6],['cuarzon',5],['pilon',6],['escarchon',5],['hormigon',6],['mariposon',5],['abejorro',5],['grillon',5],['vaquiton',5],['tormentin',2],['luzmala',2]]},
};

/* ---------------- Medallas ---------------- */
const MEDALLAS = [
  {id:'ombu', nom:'Medalla Ombú', tipo:'planta', ciudad:'Pueblo Ceibo', color:'#5DB86A', color2:'#8A5A35'},
  {id:'penasco', nom:'Medalla Peñasco', tipo:'piedra', ciudad:'Villa Piedra', color:'#9AA3AE', color2:'#6E7884'},
  {id:'panal', nom:'Medalla Panal', tipo:'bicho', ciudad:'Villa Piedra', color:'#FFD23F', color2:'#8A5A35'},
  {id:'camalote', nom:'Medalla Camalote', tipo:'agua', ciudad:'Puerto Camalote', color:'#5AB4E8', color2:'#7C5CC4'},
  {id:'pampero', nom:'Medalla Pampero', tipo:'viento', ciudad:'Puerto Camalote', color:'#CFEBFA', color2:'#5AB4E8'},
  {id:'relampago', nom:'Medalla Relámpago', tipo:'rayo', ciudad:'Cerro Tormenta', color:'#FFD23F', color2:'#4656A0'},
  {id:'glaciar', nom:'Medalla Glaciar', tipo:'hielo', ciudad:'Cerro Tormenta', color:'#E4F6FF', color2:'#7FD3F7'},
  {id:'brasa', nom:'Medalla Brasa', tipo:'fuego', ciudad:'Monte Fogón', color:'#F47A45', color2:'#FFD23F'},
];
const cantMedallas = () => S ? MEDALLAS.filter(m => S.medallas[m.id]).length : 0;

/* ---------------- Objetos de aventura ---------------- */
// medallas: cuántas medallas hacen falta para comprarlo en el Market.
const OBJETOS = [
  {id:'capsula', nom:'Cápsula', precio:40, medallas:0, captura:1, desc:'Para atrapar criaturas. Funciona mejor si están debilitadas.', colores:['#F2545B','#FFFFFF']},
  {id:'supercapsula', nom:'Súper cápsula', precio:100, medallas:1, captura:1.6, desc:'Atrapa mejor que la común.', colores:['#3B82D6','#FFFFFF']},
  {id:'ultracapsula', nom:'Ultra cápsula', precio:220, medallas:3, captura:2.4, desc:'Casi nada se le escapa.', colores:['#7A4FC9','#FFD24A']},
  {id:'jarabe', nom:'Jarabe', precio:30, medallas:0, cura:25, desc:'Recupera 25 de vida.', colores:['#FF7FA3']},
  {id:'jarabemax', nom:'Jarabe grande', precio:80, medallas:1, cura:70, desc:'Recupera 70 de vida.', colores:['#4CC27A']},
  {id:'jarabetotal', nom:'Jarabe total', precio:180, medallas:2, cura:999, desc:'Recupera toda la vida.', colores:['#7A4FC9']},
  {id:'revivir', nom:'Revivir', precio:150, medallas:1, revive:.5, icono:'revivir', desc:'Levanta a una criatura debilitada con la mitad de la vida. Sirve en combate.', colores:['#FFD23F', '#FFF3B0']},
  {id:'revivirmax', nom:'Revivir máximo', precio:400, medallas:3, revive:1, icono:'revivir', desc:'Levanta a una criatura debilitada con toda la vida.', colores:['#FF8FB1', '#FFE1EA']},
  {id:'repelente', nom:'Repelente de citronela', precio:60, medallas:0, usa:'repelente', pasos:150, icono:'spray', desc:'Por 150 pasos no te salen criaturas salvajes.', colores:['#4CC27A', '#FFD23F']},
  {id:'silbato', nom:'Silbato de vuelta', precio:90, medallas:0, usa:'silbato', icono:'silbato', desc:'Te lleva al último Centro de Rehabilitación donde te curaste.', colores:['#5AB4E8']},
  {id:'alfajor', nom:'Alfajor de fuerza', precio:280, medallas:1, usa:'stat', stat:'fuerza', mas:2, icono:'alfajor', desc:'+2 de Fuerza para siempre a la criatura que se lo come.', colores:['#8A5A35']},
  {id:'matecocido', nom:'Mate cocido veloz', precio:280, medallas:1, usa:'stat', stat:'velocidad', mas:2, icono:'taza', desc:'+2 de Velocidad para siempre.', colores:['#C98A52']},
  {id:'guiso', nom:'Guiso de lentejas', precio:280, medallas:1, usa:'stat', stat:'vida', mas:4, icono:'guiso', desc:'+4 de Vida para siempre.', colores:['#C2412B']},
  {id:'caramelo', nom:'Caramelo de dulce de leche', precio:600, medallas:2, usa:'nivel', icono:'caramelo', desc:'Sube un nivel a la criatura que lo come.', colores:['#D9A066', '#FFFDF8']},
];
OBJETOS.forEach(o => {
  o.tipoObj = o.captura ? 'capsula' : 'cura';
  if(!o.usa) o.usa = o.captura ? 'capsula' : o.revive ? 'revivir' : 'cura';
  o.enCombate = ['capsula', 'cura', 'revivir'].includes(o.usa);
});

/* ---------------- Reglas de combate ---------------- */
// Hasta 4 poderes: los que aprendió por nivel y, si tiene, el que le enseñó un líder.
function poderesDe(esp, nivel, extra){
  const def = ESPECIES[esp];
  const ext = (Array.isArray(extra) ? extra : []).filter(m => MOVS[m]).slice(0, 1);
  const lista = [...new Set(def.aprende.filter(([n]) => n <= nivel).map(([, m]) => m))].filter(m => !ext.includes(m));
  return [...lista.slice(-(4 - ext.length)), ...ext];
}
function tipoDe(esp){ return ESPECIES[esp].tipo; }
function nombreEspecie(esp){ return ESPECIES[esp].nombre; }
function vidaMax(stats, nivel){ return Math.round(14 + stats.vida * 1.2 + nivel * 4); }
function statsPorNivel(base, nivel){
  return {vida: base.vida + (nivel-1)*2, fuerza: Math.round(base.fuerza + (nivel-1)*.8), velocidad: Math.round(base.velocidad + (nivel-1)*.8)};
}
function calcularDanio(atacante, defensor, mov, rnd = Math.random){
  const atk = atacante.stats.fuerza * (atacante.modFuerza || 1);
  const def = 4 + defensor.stats.vida * .35 + defensor.nivel * .5;
  const stab = mov.tipo === atacante.tipo ? 1.25 : 1;
  const ef = efectividad(mov.tipo, defensor.tipo);
  const azar = .85 + rnd() * .15;
  const critico = rnd() < .06 ? 1.5 : 1;
  const base = (mov.poder * (2 + atacante.nivel * .25) * atk / def) / 10 + 2;
  const salvaje = atacante.salvaje ? .62 : (atacante.mult || 1);
  return { danio: Math.max(1, Math.round(base * stab * ef * azar * critico * salvaje)), ef, critico: critico > 1 };
}
const PROB_SHINY = 1 / 200;
function nuevaCriatura(esp, nivel, extra = {}){
  const sp = ESPECIES[esp], stats = statsPorNivel(sp.base, nivel);
  return {uid: Date.now().toString(36) + Math.random().toString(36).slice(2, 7), esp, nombre: sp.nombre, nivel, xp: 0, stats, hp: null, shiny: false, ...extra};
}
function crearSalvaje(zonaId){
  const z = ZONAS[zonaId];
  const total = z.aparecen.reduce((s, [, p]) => s + p, 0);
  let r = Math.random() * total, esp = z.aparecen[0][0];
  for(const [e, p] of z.aparecen){ if((r -= p) < 0){ esp = e; break; } }
  const sp = ESPECIES[esp];
  const raro = sp.captura <= .18 ? 2 : 0;
  const nivel = z.niveles[0] + Math.floor(Math.random() * (z.niveles[1] - z.niveles[0] + 1)) + raro;
  const stats = statsPorNivel(sp.base, nivel);
  return {esp, nombre: sp.nombre, nivel, stats, hp: vidaMax(stats, nivel), tipo: sp.tipo, salvaje: true, shiny: Math.random() < PROB_SHINY};
}
// Si la criatura llegó al nivel, devuelve la especie a la que evoluciona.
function evolucionPendiente(c){
  const e = ESPECIES[c.esp];
  return e.evol && c.nivel >= e.evol.nivel ? e.evol.a : null;
}
function evolucionar(c){
  const a = evolucionPendiente(c); if(!a) return null;
  const viejo = ESPECIES[c.esp], nuevo = ESPECIES[a];
  if(c.nombre === viejo.nombre) c.nombre = nuevo.nombre;
  c.stats.vida += nuevo.base.vida - viejo.base.vida;
  c.stats.fuerza += nuevo.base.fuerza - viejo.base.fuerza;
  c.stats.velocidad += nuevo.base.velocidad - viejo.base.velocidad;
  c.esp = a;
  return nuevo;
}
