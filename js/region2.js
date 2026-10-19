'use strict';
/* =====================================================================
   La Costa Oriental: segunda región.
   Se llega en ferry desde el muelle de Puerto Camalote con el Pasaje que
   te dan al ganar la primera Liga. Ocho pueblos con gimnasio, la Fortaleza
   del Cerro (segunda Liga), Isla de Lobos, la Quebrada de los Cuervos y la
   Gruta del Palacio, donde espera el Gaucho Eterno.
   Los niveles de esta región ya están puestos tal cual (no se estiran).
   ===================================================================== */
const PUEBLOS_R2 = ['colonia', 'termas', 'polonio', 'tacuarembo', 'valizas', 'quebrada', 'minas', 'capital', 'fortaleza'];
function enRegion2(id){
  let M = MAPAS[id || (S && S.mundo && S.mundo.mapa)], vueltas = 0;
  while(M && vueltas++ < 8){
    if(M.region === 2) return true;
    if(M.afuera) M = MAPAS[M.afuera.mapa];
    else { const casa = INTERIORES.find(x => x.id === M.id); M = casa ? MAPAS[casa.afuera.mapa] : null; }
  }
  return false;
}

/* ---------------- Medallas de la Costa Oriental ---------------- */
const MEDALLAS2 = [
  {id: 'platano', nom: 'Medalla Plátano', tipo: 'planta', ciudad: 'Colonia del Plátano', color: '#7CC46A', color2: '#7A5232'},
  {id: 'termal', nom: 'Medalla Termal', tipo: 'fuego', ciudad: 'Termas del Arapey', color: '#FF8A5A', color2: '#8FD3F7'},
  {id: 'loberia', nom: 'Medalla Lobería', tipo: 'agua', ciudad: 'Cabo Polonio', color: '#5AB4E8', color2: '#5E5046'},
  {id: 'facon', nom: 'Medalla Facón', tipo: 'normal', ciudad: 'Tacuarembó', color: '#D6D0C2', color2: '#7A5232'},
  {id: 'medano', nom: 'Medalla Médano', tipo: 'viento', ciudad: 'Barra de Valizas', color: '#F2E2B0', color2: '#5AB4E8'},
  {id: 'cuervo', nom: 'Medalla Cuervo', tipo: 'bicho', ciudad: 'Quebrada de los Cuervos', color: '#9DC43A', color2: '#22304A'},
  {id: 'agata', nom: 'Medalla Ágata', tipo: 'piedra', ciudad: 'Minas', color: '#B08AD9', color2: '#7A4FC9'},
  {id: 'rambla', nom: 'Medalla Rambla', tipo: 'rayo', ciudad: 'Montevideo Capital', color: '#FFD23F', color2: '#3B82D6'},
];
const cantMedallas2 = () => S && S.medallas ? MEDALLAS2.filter(m => S.medallas[m.id]).length : 0;
(() => {
  const orig = svgMedalla;
  svgMedalla = function(m, tam = 64, apagada = false){
    if(!m || !MEDALLAS2.includes(m)) return orig(m, tam, apagada);
    const T = '#22304A', c = TIPOS[m.tipo] ? TIPOS[m.tipo].color : m.color;
    const pts = [...Array(16)].map((_, i) => { const r = i % 2 ? 26 : 36, a = Math.PI * 2 * i / 16 - Math.PI / 2; return `${40 + Math.cos(a) * r},${40 + Math.sin(a) * r}`; }).join(' ');
    return `<svg viewBox="0 0 80 80" width="${tam}" height="${tam}" aria-hidden="true" style="${apagada ? 'filter:grayscale(1);opacity:.25' : ''}">
      <polygon points="${pts}" fill="${m.color}" stroke="${T}" stroke-width="4" stroke-linejoin="round"/>
      <circle cx="40" cy="40" r="17" fill="${m.color2}" stroke="${T}" stroke-width="3"/>
      <circle cx="40" cy="40" r="9" fill="${c}" stroke="${T}" stroke-width="2.5"/>
      <path d="M33 33 a9 9 0 0 1 9 -3" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></svg>`;
  };
})();

/* ---------------- Líderes ---------------- */
Object.assign(LIDERES, {
  platana: {id: 'platana', titulo: 'Líder', nombre: 'Doña Plátana Sombra', medalla: 'platano', mov: 'palmar', tipoGym: 'planta', premio: 2600, ropa: '#5DB86A', pelo: '#E9E2D3',
    equipo: [['ombuon', 60], ['butia', 60], ['capibara', 61], ['yasy', 62]],
    antes: ['Bienvenido a la Costa Oriental. Soy Plátana, la líder de Colonia.', 'Acá los árboles son más viejos que las calles empedradas. Y pegan más fuerte.'],
    despues: ['Me dejaste sin sombra.', 'Llevate la Medalla Plátano. Siguiendo al norte están las Termas del Arapey.'],
    yaGano: 'Ya tenés la Medalla Plátano. Las Termas quedan al norte.'},
  ester: {id: 'ester', titulo: 'Líder', nombre: 'Ester Mal', medalla: 'termal', mov: 'termas', tipoGym: 'fuego', premio: 2800, ropa: '#FF8A5A', pelo: '#3B2A22',
    equipo: [['termon', 63], ['teyu', 63], ['teyucito', 63], ['mboitata', 65]],
    antes: ['¡Ay, qué calorcito! Soy Ester Mal, la líder de las Termas.', 'Mis criaturas salen del agua hirviendo. ¿Aguantás el vapor?'],
    despues: ['¡Me bajaste la temperatura!', 'Tomá la Medalla Termal. Al norte, Cabo Polonio y su lobería.'],
    yaGano: 'Ya tenés la Medalla Termal. Andá a Cabo Polonio.'},
  marina: {id: 'marina', titulo: 'Líder', nombre: 'Marina Lobos', medalla: 'loberia', mov: 'loberia', tipoGym: 'agua', premio: 3000, ropa: '#3B82D6', pelo: '#F2B63D',
    equipo: [['lobazo', 66], ['franciscana', 66], ['yacare', 67], ['lobomar', 68]],
    antes: ['En el Cabo no hay luz eléctrica, pero hay lobos marinos. Muchos.', 'Soy Marina Lobos. ¡Que ruja la lobería!'],
    despues: ['¡Hasta los lobos te aplauden!', 'La Medalla Lobería es tuya. Al este, cruzando las piedras, está Isla de Lobos.'],
    yaGano: 'Ya tenés la Medalla Lobería. Seguí al norte, a Tacuarembó.'},
  facundo: {id: 'facundo', titulo: 'Líder', nombre: 'Don Facón Rebenque', medalla: 'facon', mov: 'llamada', tipoGym: 'normal', premio: 3200, ropa: '#7A5232', pelo: '#2A2420',
    equipo: [['candombe', 69], ['manopelon', 69], ['montes', 70], ['lobizon', 71]],
    antes: ['¡Buenas, gurí! Soy Don Facón Rebenque, gaucho de Tacuarembó.', 'Acá se pelea con el corazón y con el poncho bien puesto.'],
    despues: ['¡Ta bueno, ta bueno! Me ganaste en buena ley.', 'Llevate la Medalla Facón. Al oeste del pueblo está la entrada a la Gruta del Palacio... pero ahí no entra cualquiera.'],
    yaGano: 'Ya tenés la Medalla Facón. Valizas te espera al norte.'},
  duna: {id: 'duna', titulo: 'Líder', nombre: 'Duna Sopla', medalla: 'medano', mov: 'rambla', tipoGym: 'viento', premio: 3400, ropa: '#F2E2B0', pelo: '#C2702E',
    equipo: [['tero', 72], ['chaja', 72], ['gavioton', 73], ['carancho', 74]],
    antes: ['En Valizas el viento cambia los médanos de lugar cada noche.', 'Soy Duna Sopla. Mis criaturas vuelan con el temporal.'],
    despues: ['¡Me tapaste de arena!', 'La Medalla Médano es tuya. Al norte está la Quebrada de los Cuervos.'],
    yaGano: 'Ya tenés la Medalla Médano. La Quebrada queda al norte.'},
  cuervo: {id: 'cuervo', titulo: 'Líder', nombre: 'Aracely Ñas', medalla: 'cuervo', mov: 'quebrada', tipoGym: 'bicho', premio: 3600, ropa: '#4A6A2A', pelo: '#22304A',
    equipo: [['camoatazo', 75], ['candado', 75], ['tucura', 76], ['pomberito', 77]],
    antes: ['¿Escuchás el zumbido de la quebrada? Somos muchos acá abajo.', 'Soy Aracely Ñas, y mis bichos no te van a dejar salir tan fácil.'],
    despues: ['Te abriste paso entre el monte. Respeto.', 'La Medalla Cuervo es tuya. Al este está la Quebrada profunda, donde duerme el Yaguareté.'],
    yaGano: 'Ya tenés la Medalla Cuervo. Minas queda al norte.'},
  agata: {id: 'agata', titulo: 'Líder', nombre: 'Ágata Piedrabuena', medalla: 'agata', mov: 'serrania', tipoGym: 'piedra', premio: 3800, ropa: '#B08AD9', pelo: '#5A4A40',
    equipo: [['agata', 78], ['cantorrodado', 78], ['chiviton', 79], ['teyuyagua', 80]],
    antes: ['Las sierras de Minas son las más viejas del continente.', 'Soy Ágata Piedrabuena. Mis piedras tienen paciencia de millones de años.'],
    despues: ['Me partiste como una geoda... y adentro brillaba.', 'Tomá la Medalla Ágata. Al norte, la capital: Montevideo.'],
    yaGano: 'Ya tenés la Medalla Ágata. La capital queda al norte.'},
  volta: {id: 'volta', titulo: 'Líder', nombre: 'Volta Rambla', medalla: 'rambla', mov: 'apagon', tipoGym: 'rayo', premio: 4200, ropa: '#FFD23F', pelo: '#3B82D6',
    equipo: [['farol', 81], ['anguilazo', 81], ['benteveo', 82], ['farazo', 83]],
    antes: ['¡Bienvenido a la capital! Soy Volta Rambla.', 'Mis criaturas iluminan toda la rambla. Hoy te van a dejar a oscuras.'],
    despues: ['¡Apagón total! Me ganaste.', 'Con la Medalla Rambla tenés las ocho. La Fortaleza del Cerro está al norte: ahí te espera la Liga Oriental.'],
    yaGano: 'Ya tenés la Medalla Rambla. La Fortaleza del Cerro está al norte.'},
});
const ALUMNOS_R2 = {
  platana: [['Jardinero', 'Ramón Plátano', [['ombucito', 58], ['carpinchin', 59]], 900], ['Botánica', 'Hortensia Verde', [['butiacito', 59], ['ombuon', 59]], 950], ['Guardaparque', 'Bosco Nativo', [['capibara', 60], ['butia', 60]], 1000]],
  ester: [['Bañista', 'Termo Pérez', [['termalito', 61], ['teyucito', 61]], 1000], ['Masajista', 'Vapo Rosa', [['termon', 62], ['teyu', 62]], 1050], ['Bombero', 'Ígneo Ferrari', [['termon', 62], ['termalito', 63]], 1100]],
  marina: [['Pescador', 'Anzuelo Díaz', [['lobito', 64], ['franciscanita', 64]], 1100], ['Surfista', 'Ola Martínez', [['nutriecita', 65], ['lobazo', 65]], 1150], ['Guardavidas', 'Rescate Silva', [['yacarecito', 65], ['franciscana', 66]], 1200]],
  facundo: [['Payador', 'Milonga Ruiz', [['candombin', 67], ['montesito', 67]], 1200], ['Domador', 'Potro Acosta', [['chivito', 68], ['manopelada', 68]], 1250], ['Tamborilera', 'Chico Repique', [['candombe', 68], ['dulcelechon', 69]], 1300]],
  duna: [['Kitesurfista', 'Brisa Costa', [['gaviotita', 70], ['terito', 70]], 1300], ['Ornitólogo', 'Plumas Rocha', [['chajacito', 71], ['calandria', 71]], 1350], ['Pescadora', 'Red Valizas', [['tero', 71], ['gavioton', 72]], 1400]],
  cuervo: [['Entomóloga', 'Lupa Insecta', [['camoati', 73], ['tucurita', 73]], 1400], ['Explorador', 'Machete Monte', [['candadito', 74], ['camoatazo', 74]], 1450], ['Apicultor', 'Panal Camoatí', [['tucura', 74], ['candado', 75]], 1500]],
  agata: [['Minero', 'Pico Ferreira', [['agatin', 76], ['cantito', 76]], 1500], ['Joyera', 'Amatista Luz', [['agata', 77], ['chivito', 77]], 1550], ['Cantero', 'Granito Mena', [['cantorrodado', 77], ['chiviton', 78]], 1600]],
  volta: [['Electricista', 'Cable Suárez', [['farolito', 79], ['anguilita', 79]], 1600], ['Farero', 'Faro Méndez', [['farol', 80], ['benteveo', 80]], 1650], ['Ingeniera', 'Ohmia Volt', [['anguilazo', 80], ['farol', 81]], 1700]],
};
for(const [id, lista] of Object.entries(ALUMNOS_R2))
  ALUMNOS[id] = lista.map(([titulo, nombre, equipo, premio]) => [titulo, nombre, equipo, premio, ['¡A ver si llegás al líder!'], ['Pasá nomás. El líder te espera.']]);

/* ---------------- Pueblos ---------------- */
Object.assign(ZONAS, {
  colonia: {nom: 'Colonia del Plátano', niveles: [1, 1], aparecen: []}, termas: {nom: 'Termas del Arapey', niveles: [1, 1], aparecen: []},
  polonio: {nom: 'Cabo Polonio', niveles: [1, 1], aparecen: []}, tacuarembo: {nom: 'Tacuarembó', niveles: [1, 1], aparecen: []},
  valizas: {nom: 'Barra de Valizas', niveles: [1, 1], aparecen: []}, quebrada: {nom: 'Pueblo Quebrada', niveles: [1, 1], aparecen: []},
  minas: {nom: 'Minas', niveles: [1, 1], aparecen: []}, capital: {nom: 'Montevideo Capital', niveles: [1, 1], aparecen: []},
  fortaleza: {nom: 'Fortaleza del Cerro', niveles: [1, 1], aparecen: []},
});
Object.assign(ARENAS, {colonia_r: 'bosque', termas_r: 'volcan', polonio_r: 'rio', tacuarembo_r: 'pradera', valizas_r: 'sierras', quebrada_r: 'bosque',
  minas_r: 'sierras', capital_r: 'rio', isla_r: 'rio', quebradacueva: 'bosque', palacio: 'sierras', fortaleza_r: 'cumbres'});

const ent2 = (id, x, y, titulo, nombre, equipo, premio, antes, despues, ropa) => [id, x, y, titulo, nombre, equipo, premio, [antes], [despues], ropa];
const DEF_PUEBLOS_R2 = [
  {id: 'colonia', nombre: 'Colonia del Plátano', semilla: 8101, lider: 'platana', colorGym: '#5DB86A', colorCasa: '#C98A52', ruta: 'colonia_r',
    tema: {pasto: '#9ED68C', pastoAlto: '#5FB45A', brizna: '#3F9A45', tierra: '#D9C3A0', arbol: 'normal', fondo: '#3F6B3A'},
    salidas: [[13, 0, 'termas', 13, 22]],
    casa: {nombre: 'Casa del Faro Viejo', npc: {nombre: 'Doña Calle de los Suspiros', ropa: '#C98A52', pelo: '#E9E2D3', regalo: true,
      frases: ['Colonia tiene calles de piedra de hace trescientos años.', 'El ferry te trae y te lleva a Puerto Camalote cuando quieras.', 'Tomá, para que empieces bien en la Costa Oriental.']}},
    vecino: {nombre: 'Guía Turístico Empedrado', ropa: '#5DB86A', pelo: '#3B2A22',
      frases: ['¡Bienvenido a la Costa Oriental! Acá las criaturas son distintas.', 'Hay ocho gimnasios y una Liga en la Fortaleza del Cerro, al norte de la capital.']},
    entrenadores: [ent2('col_t1', 6, 6, 'Turista', 'Mochila Viajera', [['calandrita', 58], ['dulcito', 58]], 800, '¡Vine en el mismo ferry que vos!', '¡Qué viaje!', '#FF8FB1'),
                   ent2('col_t2', 21, 3, 'Ciclista', 'Rueda Ligera', [['montesito', 59], ['gaviotita', 59]], 850, 'Recorro toda la costa en bici.', 'Me pinchaste la rueda.', '#3B82D6')]},
  {id: 'termas', nombre: 'Termas del Arapey', semilla: 8202, lider: 'ester', colorGym: '#FF8A5A', colorCasa: '#8FD3F7', ruta: 'termas_r',
    tema: {pasto: '#C9D98E', pastoAlto: '#9AB86A', brizna: '#6E8A40', tierra: '#E2C59A', arbol: 'normal', fondo: '#6B5A3A'},
    salidas: [[13, 23, 'colonia', 13, 1], [13, 0, 'polonio', 13, 22]],
    casa: {nombre: 'Casa del Bañero', npc: {nombre: 'Bañero Agua Tibia', ropa: '#8FD3F7', pelo: '#3B2A22', regalo: true,
      frases: ['El agua de acá sale caliente de abajo de la tierra.', 'Ester Mal entrena con criaturas de Fuego. Llevá agua... o piedra.', 'Tomá, un regalito tibio.']}},
    vecino: {nombre: 'Señora Toalla Blanca', ropa: '#FFFFFF', pelo: '#C9C9C9',
      frases: ['Dicen que en las noches se ve a la Mboitatá cruzar los campos.', 'Contra el Fuego, el Agua y la Piedra funcionan bárbaro.']},
    entrenadores: [ent2('ter_t1', 6, 6, 'Bañista', 'Burbuja Gómez', [['termalito', 61], ['nacurutin', 61]], 900, '¡Salí del agua para pelear!', 'Me vuelvo a la pileta.', '#8FD3F7'),
                   ent2('ter_t2', 21, 3, 'Campesino', 'Arado López', [['teyucito', 62], ['manopelada', 62]], 950, 'Mi campo, mis reglas.', 'Me araste el campo.', '#C98A52')]},
  {id: 'polonio', nombre: 'Cabo Polonio', semilla: 8303, lider: 'marina', colorGym: '#5AB4E8', colorCasa: '#E2574C', ruta: 'polonio_r',
    tema: {pasto: '#F2E2B0', pastoAlto: '#D9C38A', brizna: '#B8A060', tierra: '#F2E6C4', arbol: 'pino', fondo: '#5A86A8'},
    salidas: [[13, 23, 'termas', 13, 1], [13, 0, 'tacuarembo', 13, 22], [27, 14, 'isla', 1, 10]],
    casa: {nombre: 'Casa del Farero', npc: {nombre: 'Farero Luz Giratoria', ropa: '#E2574C', pelo: '#FFFFFF', regalo: true,
      frases: ['En el Cabo no hay luz eléctrica. Solo el faro y las estrellas.', 'Al este, cruzando las rocas, está Isla de Lobos. Dicen que algo enorme nada abajo.', 'Tomá, para el camino.']}},
    vecino: {nombre: 'Pescadora Red Llena', ropa: '#3B82D6', pelo: '#3B2A22',
      frases: ['Los lobos marinos duermen todo el día en las rocas.', 'Contra el Agua, la Planta y el Rayo son lo mejor.']},
    entrenadores: [ent2('pol_t1', 6, 6, 'Hippie', 'Paz Arena', [['lobito', 63], ['butiacito', 63]], 1000, 'Peace and love… y piñas.', 'Todo bien, todo tranqui.', '#C77DFF'),
                   ent2('pol_t2', 21, 3, 'Pescador', 'Caña Larga', [['franciscanita', 64], ['gaviotita', 64]], 1050, '¡Picó una pelea!', 'Se me cortó la tanza.', '#3B82D6')]},
  {id: 'tacuarembo', nombre: 'Tacuarembó', semilla: 8404, lider: 'facundo', colorGym: '#A88A6A', colorCasa: '#7A5232', ruta: 'tacuarembo_r',
    tema: {pasto: '#A9D07A', pastoAlto: '#6FA850', brizna: '#4A8030', tierra: '#D9B88A', arbol: 'normal', fondo: '#4A6A30'},
    salidas: [[13, 23, 'polonio', 13, 1], [13, 0, 'valizas', 13, 22], [0, 14, 'palacio', 12, 21]],
    casa: {nombre: 'Rancho del Payador', npc: {nombre: 'Payador Verso Fácil', ropa: '#7A5232', pelo: '#2A2420', regalo: true,
      frases: ['Con la guitarra al hombro y el mate en la mano, te canto la historia del Gaucho Eterno.', 'Dicen que vive en el fondo de la Gruta del Palacio, al oeste, y que solo pelea con campeones de verdad.', 'Tomá, gurí. Que te vaya lindo.']}},
    vecino: {nombre: 'Doña China Mate', ropa: '#E07BA0', pelo: '#3B2A22',
      frases: ['Acá nació el tango, dicen algunos. Otros dicen que no.', 'La Gruta del Palacio está al oeste. Sin ser Campeón de la Liga Oriental, el Gaucho no te recibe.']},
    entrenadores: [ent2('tac_t1', 6, 6, 'Gaucho', 'Rebenque Sosa', [['montesito', 66], ['terito', 66]], 1100, '¡Desensillá que peleamos!', 'Me tumbaste del caballo.', '#7A5232'),
                   ent2('tac_t2', 21, 3, 'Tropero', 'Arreo Duarte', [['chivito', 67], ['candombin', 67]], 1150, 'Llevo la tropilla al norte.', 'Se me escapó la tropilla.', '#C98A52')]},
  {id: 'valizas', nombre: 'Barra de Valizas', semilla: 8505, lider: 'duna', colorGym: '#F2D27A', colorCasa: '#5AB4E8', ruta: 'valizas_r',
    tema: {pasto: '#F2E6C4', pastoAlto: '#D9C38A', brizna: '#B8A060', tierra: '#F7EBD0', arbol: 'normal', fondo: '#7A9AB0'},
    salidas: [[13, 23, 'tacuarembo', 13, 1], [13, 0, 'quebrada', 13, 22]],
    casa: {nombre: 'Casa de la Artesana', npc: {nombre: 'Artesana Caracola', ropa: '#5AB4E8', pelo: '#F2B63D', regalo: true,
      frases: ['Hago collares con caracoles de la playa.', 'Duna Sopla es la líder. Sus criaturas de Viento vuelan con el temporal.', 'Tomá, uno de mis collares... bueno, no, otra cosa.']}},
    vecino: {nombre: 'Guardavidas Silbato', ropa: '#E2302E', pelo: '#F2B63D',
      frases: ['No te metas al mar con bandera roja.', 'Contra el Viento: Rayo, Hielo o Piedra.']},
    entrenadores: [ent2('val_t1', 6, 6, 'Surfista', 'Tabla Ondas', [['gaviotita', 69], ['chajacito', 69]], 1200, '¡La ola perfecta es una pelea!', 'Me revolcó la ola.', '#5AB4E8'),
                   ent2('val_t2', 21, 3, 'Artesano', 'Mimbre Díaz', [['butia', 70], ['calandrita', 70]], 1250, 'Te tejo una derrota.', 'Se me desarmó el canasto.', '#C98A52')]},
  {id: 'quebrada', nombre: 'Pueblo Quebrada', semilla: 8606, lider: 'cuervo', colorGym: '#9DC43A', colorCasa: '#4A6A2A', ruta: 'quebrada_r',
    tema: {pasto: '#8EC46A', pastoAlto: '#4F8E3A', brizna: '#2F6E2A', tierra: '#C9B07A', arbol: 'normal', fondo: '#2F4A22'},
    salidas: [[13, 23, 'valizas', 13, 1], [13, 0, 'minas', 13, 22], [27, 14, 'quebradacueva', 1, 21]],
    casa: {nombre: 'Casa del Guardaparque', npc: {nombre: 'Guardaparque Hoja Seca', ropa: '#4A6A2A', pelo: '#3B2A22', regalo: true,
      frases: ['La quebrada es tan profunda que los cuervos anidan en las paredes.', 'Al este está la Quebrada profunda. Dicen que ahí duerme el Yaguareté.', 'Tomá, para el monte.']}},
    vecino: {nombre: 'Vecina Telaraña', ropa: '#22304A', pelo: '#9DC43A',
      frases: ['De noche se escucha silbar al Pombero. No le contestes.', 'Contra los Bicho: Fuego y Viento.']},
    entrenadores: [ent2('que_t1', 6, 6, 'Cazabichos', 'Red Mariposa', [['camoati', 72], ['tucurita', 72]], 1300, '¡Te atrapé!', 'Se me escapó.', '#9DC43A'),
                   ent2('que_t2', 21, 3, 'Explorador', 'Brújula Torres', [['candadito', 73], ['nacurutin', 73]], 1350, 'Me perdí... ¿peleamos?', 'Sigo perdido.', '#7A5232')]},
  {id: 'minas', nombre: 'Minas', semilla: 8707, lider: 'agata', colorGym: '#B08AD9', colorCasa: '#8C857A', ruta: 'minas_r', rocas: true,
    tema: {pasto: '#B8C98E', pastoAlto: '#7E9A5E', brizna: '#5A7A40', tierra: '#C9B79C', arbol: 'pino', fondo: '#5A5A4A'},
    salidas: [[13, 23, 'quebrada', 13, 1], [13, 0, 'capital', 13, 22]],
    casa: {nombre: 'Casa del Minero', npc: {nombre: 'Minero Veta Profunda', ropa: '#8C857A', pelo: '#2A2420', regalo: true,
      frases: ['Estas sierras tienen ágatas y amatistas por todos lados.', 'Ágata Piedrabuena es la líder. Paciente como la piedra.', 'Tomá, una piedrita... de las útiles.']}},
    vecino: {nombre: 'Doña Alfajor de Minas', ropa: '#C98A52', pelo: '#E9E2D3',
      frases: ['Los alfajores de acá son los mejores del mundo. No discutas.', 'Contra la Piedra: Agua y Planta.']},
    entrenadores: [ent2('min_t1', 6, 6, 'Alpinista', 'Soga Firme', [['chivito', 75], ['cantito', 75]], 1400, '¡Hasta la cumbre!', 'Me caí del cerro.', '#E2574C'),
                   ent2('min_t2', 21, 3, 'Geóloga', 'Estrato Gil', [['agatin', 76], ['granicito', 76]], 1450, 'Esta piedra tiene un millón de años.', 'Y yo me siento de un millón.', '#B08AD9')]},
  {id: 'capital', nombre: 'Montevideo Capital', semilla: 8808, lider: 'volta', colorGym: '#FFD23F', colorCasa: '#3B82D6', ruta: 'capital_r',
    tema: {pasto: '#A9D8C0', pastoAlto: '#6FB08A', brizna: '#4A8A6A', tierra: '#D9D0C1', arbol: 'normal', fondo: '#4A6A7A'},
    salidas: [[13, 23, 'minas', 13, 1], [13, 0, 'fortaleza', 15, 24]],
    casa: {nombre: 'Casa de la Rambla', npc: {nombre: 'Murguista Bombo Platillo', ropa: '#C77DFF', pelo: '#2A2420', regalo: true,
      frases: ['¡Llegó el carnaval más largo del mundo!', 'Volta Rambla es la líder. Electrifica toda la ciudad.', 'Tomá, para que festejes tu medalla.']}},
    vecino: {nombre: 'Señor Bizcocho', ropa: '#C98A52', pelo: '#C9C9C9',
      frases: ['Al norte, sobre el Cerro, está la Fortaleza. Ahí pelea la Liga Oriental.', 'Contra el Rayo: Piedra, solo Piedra.']},
    entrenadores: [ent2('cap_t1', 6, 6, 'Murguista', 'Retirada Vega', [['candombe', 78], ['farolito', 78]], 1500, '¡Y vamos con la retirada!', 'Me fui de murga.', '#C77DFF'),
                   ent2('cap_t2', 21, 3, 'Estudiante', 'Mochila Universidad', [['anguilita', 79], ['benteveo', 79]], 1550, 'Estudio criaturas en la facultad.', 'Me bocharon.', '#3B82D6')]},
];
const TEMA_R2 = M => { M.region = 2; return M; };
// El gimnasio Normal no existía: piso de madera y columnas de piedra.
if(!BORDE_GYM.normal) BORDE_GYM.normal = '#';
if(!PISO_GYM.normal) PISO_GYM.normal = ['#E8DCC8', '#DDCFB8'];
for(const c of DEF_PUEBLOS_R2){
  const M = TEMA_R2(pueblito(c));
  MAPAS[M.id] = M;
}

/* ---------------- El muelle y el ferry ---------------- */
// En Colonia: agua abajo, como un puerto.
(() => {
  const C = MAPAS.colonia;
  for(let x = 1; x < C.w - 1; x++) C.m[22][x] = '~';
  C.npc({id: 'capitan_colonia', x: 6, y: 20, tipo: 'vecino', nombre: 'Capitana Proa Celeste', suelo: ':', ropa: '#FFFFFF', pelo: '#2A2420', accion: hablarFerry});
  const P = MAPAS.camalote; if(!P) return;
  // En la plaza del puerto, justo donde empieza el muelle: bien a la vista.
  const sitio = !BLOQUEA.has(P.m[16][24]) ? [24, 16] : (lugarLibre(P, 24, 16) || [24, 16]);
  if(P.m[sitio[1]][sitio[0]] === ',') P.m[sitio[1]][sitio[0]] = ':';
  P.npc({id: 'capitan_camalote', x: sitio[0], y: sitio[1], tipo: 'vecino', nombre: 'Capitán del Ferry Ancla Firme', ropa: '#FFFFFF', pelo: '#3B2A22', accion: hablarFerry});
  P.ferry = {x: sitio[0], y: sitio[1]};
  C.ferry = {x: 6, y: 20};
})();
// Un barco y un cartel de FERRY para que se vea desde lejos.
(() => {
  const dib = dibujarSecretos;
  dibujarSecretos = function(ctx, M, camX, camY, t){
    if(dib) dib(ctx, M, camX, camY, t);
    if(!M || !M.ferry || (M.id !== 'camalote' && M.id !== 'colonia')) return;
    const f = M.ferry, bx = M.id === 'camalote' ? (f.x + 4.5) * TS - camX : (f.x - 2) * TS - camX, by = M.id === 'camalote' ? (f.y + 1.6) * TS - camY : (f.y + 2.7) * TS - camY;
    const meneo = Math.sin(t / 400) * 2;
    ctx.save(); ctx.translate(bx, by + meneo);
    ctx.fillStyle = '#FFFDF8'; ctx.strokeStyle = '#22304A'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(-34, 0); ctx.lineTo(34, 0); ctx.lineTo(26, 14); ctx.lineTo(-28, 14); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#3B82D6'; ctx.fillRect(-28, 6, 56, 4);
    ctx.fillStyle = '#FFFDF8'; ctx.beginPath(); ctx.rect(-16, -14, 30, 14); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#9FD4F5'; for(const x of [-12, -3, 6]) ctx.fillRect(x, -10, 6, 5);
    ctx.fillStyle = '#E2574C'; ctx.beginPath(); ctx.rect(2, -24, 8, 10); ctx.fill(); ctx.stroke();
    ctx.restore();
    etiqueta(ctx, '⛴ FERRY', (f.x + .5) * TS - camX, (f.y + 1) * TS - camY - 62, 'rgba(59,130,214,.95)');
  };
})();
async function hablarFerry(n){
  const enOriente = enRegion2(S.mundo.mapa);
  if(!enOriente){
    if(!S.campeon){ await dialogo(n.nombre, ['Este ferry va a la Costa Oriental, del otro lado del río.', 'Solo lleva a Campeones de Sorlandia. Ganá la Liga en la Cumbre Suprema y volvé.']); return; }
    if(!S.inv.objetos.pasaje){ S.inv.objetos.pasaje = 1; guardar(); await dialogo(n.nombre, ['¡Pero si es el Campeón! Tomá tu Pasaje del Ferry, invita la casa.']); }
  }
  const i = await elegirOpcion(n.nombre, enOriente ? '¿Volvés a Puerto Camalote?' : '¿Viajás a la Costa Oriental? Allá hay ocho gimnasios, otra Liga y criaturas que nunca viste.', ['¡Vamos!', 'Ahora no']);
  if(i !== 0) return;
  viajarFerry(enOriente ? 'camalote' : 'colonia');
}
function viajarFerry(destino){
  const capa = document.createElement('div');
  capa.className = 'capa-ferry';
  capa.innerHTML = `<div class="ferry-escena"><div class="ferry-barco">⛴️</div><div class="ferry-olas"></div><p>${destino === 'colonia' ? 'Cruzando el río hacia la Costa Oriental...' : 'Volviendo a Puerto Camalote...'}</p></div>`;
  document.body.appendChild(capa);
  setTimeout(() => {
    capa.remove();
    salirDelMundo();
    if(destino === 'colonia'){
      S.mundo = {mapa: 'colonia', x: 6, y: 21, mira: 'arriba'};
      const d = destinoVuelo('colonia'); if(d) S.respawn = {...d};
      S.visitados = S.visitados || {}; S.visitados.colonia = true;
    } else {
      const P = MAPAS.camalote, f = P.ferry || {x: 14, y: 14};
      S.mundo = {mapa: 'camalote', x: f.x, y: f.y + 1, mira: 'abajo'};
      const d = destinoVuelo('camalote'); if(d) S.respawn = {...d};
    }
    guardar(); pintarMundo();
    avisar(destino === 'colonia' ? '¡Llegaste a la Costa Oriental!' : 'Volviste a Puerto Camalote');
  }, 2600);
}

/* ---------------- Isla de Lobos ---------------- */
function mapaIsla(){
  const W = 26, H = 20;
  const M = nuevoMapa('isla', 'Isla de Lobos', W, H, 9301, '~', {pasto: '#F2E2B0', pastoAlto: '#D9C38A', brizna: '#B8A060', tierra: '#F2E6C4', arbol: 'pino', fondo: '#2E5A8A'});
  for(let y = 1; y <= 18; y++) for(let x = 1; x <= 24; x++){ const dx = (x - 13) / 12, dy = (y - 10) / 9; if(dx * dx + dy * dy < 1) M.m[y][x] = 's'; }
  for(let y = 3; y <= 16; y++) for(let x = 3; x <= 22; x++){ const dx = (x - 13) / 10.5, dy = (y - 10) / 7.5; if(dx * dx + dy * dy < 1) M.m[y][x] = '.'; }
  M.mancha(5, 4, 20, 15, 10, ',', 1.2, 2.4);
  M.salpicar(4, 4, 21, 15, .05, '#', ['.']);
  for(let x = 0; x <= 13; x++) M.m[10][x] = x < 3 ? 's' : '.';
  M.camino(1, 10, 13, 10); M.camino(13, 4, 13, 10);
  M.salida(0, 10, 'polonio', 26, 14);
  M.m[3][13] = 'A'; M.altares['13,3'] = 'marejadon';
  M.npc(entrenador('isla_t1', 9, 6, 'Buzo', 'Escafandra Ríos', [['lobazo', 77], ['franciscana', 77], ['nutria', 78]], 1700, ['Abajo del agua hay algo enorme. Lo vi.'], ['No me creés, ¿no?'], '#3B82D6'));
  M.npc(entrenador('isla_t2', 18, 13, 'Bióloga', 'Foca Marítima', [['lobomar', 79], ['yacare', 78]], 1800, ['Estudio a los lobos marinos. Y ellos me estudian a mí.'], ['Anotado en la libreta.'], '#4CC27A'));
  M.zonas = [['isla_r', 0, 0, W - 1, H - 1]]; M.zonaBase = 'isla_r';
  return TEMA_R2(M);
}

/* ---------------- Quebrada profunda ---------------- */
function mapaQuebradaCueva(){
  const W = 25, H = 23;
  const M = nuevoMapa('quebradacueva', 'Quebrada de los Cuervos', W, H, 9402, 'T', {pasto: '#6FA850', pastoAlto: '#4F8E3A', brizna: '#2F6E2A', tierra: '#8A7A5A', arbol: 'normal', fondo: '#1F3A1A'});
  const {callejones} = laberinto(M, W, H, [1, 21], 4747);
  for(let y = 1; y < H - 1; y++) for(let x = 1; x < W - 1; x++) if(M.m[y][x] === 'k' && M.r() < .35) M.m[y][x] = ',';
  M.salida(0, 21, 'quebrada', 26, 14); M.m[21][0] = 'k';
  const [ax, ay] = callejones[0];
  M.m[ay][ax] = 'A'; M.altares[ax + ',' + ay] = 'yaguarete';
  callejones.slice(1, 3).forEach(([x, y], i) => M.items.push({id: 'cofre_queb' + i, x, y, cofre: true, premio: {obj: i ? 'revivirmax' : 'jarabetotal', n: 2}}));
  const t = callejones.slice(3, 5);
  if(t[0]) M.npc({...entrenador('queb_t1', t[0][0], t[0][1], 'Naturalista', 'Musgo Ramírez', [['nacurutu', 79], ['camoatazo', 79], ['capibara', 80]], 1900, ['Este monte es mío y de los cuervos.'], ['Los cuervos se ríen de mí.'], '#4A6A2A'), suelo: 'k'});
  if(t[1]) M.npc({...entrenador('queb_t2', t[1][0], t[1][1], 'Cazadora', 'Huella Silvestre', [['pomberito', 80], ['candado', 80], ['ombusaurio', 80]], 1950, ['Sigo las huellas del Yaguareté hace años.'], ['Me ganaste… pero él es más fuerte.'], '#7A5232'), suelo: 'k'});
  M.zonas = [['quebradacueva', 0, 0, W - 1, H - 1]]; M.zonaBase = 'quebradacueva';
  return TEMA_R2(M);
}

/* ---------------- Gruta del Palacio y el Gaucho Eterno ---------------- */
function mapaPalacio(){
  const W = 25, H = 23;
  const M = nuevoMapa('palacio', 'Gruta del Palacio', W, H, 9503, '#', {pasto: '#8A6A4A', pastoAlto: '#8A6A4A', brizna: '#6E5032', tierra: '#7A5A3A', arbol: 'normal', fondo: '#1A120C', oscuro: true, cueva: true});
  const {callejones} = laberinto(M, W, H, [12, 21], 6161);
  M.salida(12, 22, 'tacuarembo', 1, 14); M.m[22][12] = 'k';
  // Columnas de piedra en la entrada, como en la gruta de verdad.
  for(const [x, y] of [[11, 20], [13, 20]]) if(M.m[y][x] === '#') M.m[y][x] = '#';
  const [gx, gy] = callejones[0];
  M.npc({id: 'gaucho_eterno', x: gx, y: gy, tipo: 'vecino', nombre: 'Gaucho Eterno', suelo: 'k', ropa: '#2A2420', pelo: '#E9E2D3', accion: hablarGauchoEterno});
  callejones.slice(1, 4).forEach(([x, y], i) => M.items.push({id: 'cofre_pal' + i, x, y, cofre: true, premio: [{obj: 'revivirmax', n: 3}, {obj: 'ultracapsula', n: 10}, {obj: 'jarabetotal', n: 5}][i]}));
  const t = callejones.slice(4, 6);
  if(t[0]) M.npc({...entrenador('pal_t1', t[0][0], t[0][1], 'Espeleólogo', 'Linterna Sombra', [['amatiston', 84], ['teyuyagua', 84], ['cantorrodado', 85]], 2200, ['Más adentro hay alguien que no envejece.'], ['Andá con cuidado.'], '#5A4A40'), suelo: 'k'});
  if(t[1]) M.npc({...entrenador('pal_t2', t[1][0], t[1][1], 'Discípulo', 'Poncho Gris', [['lobizon', 85], ['geiseron', 85], ['terazo', 86]], 2300, ['Soy discípulo del Gaucho Eterno. Primero pasás por mí.'], ['El maestro te espera.'], '#8C857A'), suelo: 'k'});
  M.zonas = [['palacio', 0, 0, W - 1, H - 1]]; M.zonaBase = 'palacio';
  M.afuera = {mapa: 'tacuarembo', x: 1, y: 14};
  M.entrada = {x: 12, y: 21};
  return TEMA_R2(M);
}
const GAUCHO_ETERNO = {id: 'gaucho_eterno', titulo: 'Leyenda', nombre: 'Gaucho Eterno', premio: 10000, ropa: '#2A2420', pelo: '#E9E2D3', lider: true,
  equipo: [['intiraya', 96], ['yacura', 97], ['huracanto', 97], ['uritorco', 98], ['ballenaria', 99], ['yaguarete', 100]],
  antes: ['...', 'Hace doscientos años que nadie llega hasta acá.', 'Soy el Gaucho Eterno. Entreno con las leyendas de las dos orillas.', 'Si me ganás, te doy lo único que vale más que la victoria. Vení.'],
  despues: ['...Ja. Hacía dos siglos que no perdía.', 'Te ganaste el Sol de Mayo. Cuidalo: es el último que queda.']};
async function hablarGauchoEterno(n){
  if(S.regalos && S.regalos.soldemayo){
    await dialogo(n.nombre, ['El Sol de Mayo está en buenas manos.', '¿Revancha? Cuando quieras. Las leyendas no se cansan.']);
    const i = await elegirOpcion(n.nombre, '¿Peleás otra vez contra el Gaucho Eterno?', ['¡Vamos!', 'Ahora no']);
    if(i === 0 && hayLuchadorEnPie()) lanzarPeleaEntrenador({...GAUCHO_ETERNO, id: 'gaucho_eterno_r', premio: 4000, antes: [], despues: ['Seguís siendo el mejor.']}, 'palacio');
    return;
  }
  if(!S.campeon2){ await dialogo(n.nombre, ['...', 'Todavía no sos Campeón de la Costa Oriental.', 'Ganá la Liga en la Fortaleza del Cerro y volvé. Acá te espero. Tengo tiempo.']); return; }
  if(!hayLuchadorEnPie()){ await dialogo(n.nombre, ['Tu equipo está agotado. Así no se pelea con una leyenda.']); return; }
  await dialogo(n.nombre, GAUCHO_ETERNO.antes);
  S.gauchoPendiente = true;
  lanzarPeleaEntrenador(GAUCHO_ETERNO, 'palacio');
}
// Después de ganarle: el regalo.
async function premioGauchoEterno(){
  if(!S.gauchoPendiente || !S.vencidos.gaucho_eterno || (S.regalos && S.regalos.soldemayo)) return;
  S.gauchoPendiente = false;
  S.regalos = S.regalos || {}; S.regalos.soldemayo = true;
  const c = nuevaCriatura('soldemayo', 70, {shiny: Math.random() < .1});
  if(S.equipo.length < MAX_EQUIPO) S.equipo.push(c); else S.reserva.push(c);
  S.album.vistos.soldemayo = true; S.album.capt.soldemayo = (S.album.capt.soldemayo || 0) + 1; if(c.shiny) S.album.shiny.soldemayo = true;
  guardar();
  await dialogo('Gaucho Eterno', ['Tomá. Es tuyo.', `¡Sol de Mayo se unió a ${S.equipo.includes(c) ? 'tu equipo' : 'tu casa'}!`]);
}

/* ---------------- Fortaleza del Cerro (Liga Oriental) ---------------- */
function mapaFortaleza(){
  const W = 30, H = 26;
  const M = nuevoMapa('fortaleza', 'Fortaleza del Cerro', W, H, 9604, '.', {pasto: '#9CCB8C', pastoAlto: '#5E9E6A', brizna: '#3A7A4A', tierra: '#D9C9A8', arbol: 'normal', fondo: '#3A5A4A'});
  M.mancha(1, 13, 28, 24, 14, ',', 1.4, 3);
  M.salpicar(1, 13, 28, 24, .07, 'T', ['.']);
  M.salpicar(1, 13, 28, 24, .04, '#', ['.']);
  M.rect(3, 2, 26, 11, ':');
  M.camino(15, 11, 15, 24);
  M.camino(4, 18, 26, 18);
  M.edificio(10, 2, 9, 'cuartel', {liga2: true}, {color: '#5A6E8A'});
  for(let x = 1; x < W - 1; x++) if(x !== 15) M.m[12][x] = 'T';
  M.edificio(4, 7, 5, 'centro', 'centro');
  M.edificio(21, 7, 5, 'market', 'market');
  M.borde('T');
  M.salida(15, 25, 'capital', 13, 1);
  M.npc({id: 'guardia_fortaleza', x: 15, y: 12, tipo: 'guardia', nombre: 'Guardia Celeste', requiere: () => cantMedallas2() >= MEDALLAS2.length, ropa: '#5AB4E8', pelo: '#2A2420',
    frases: ['Arriba está la Fortaleza del Cerro, donde pelea la Liga Oriental.', 'Solo pasan quienes tengan las ocho medallas de la Costa Oriental.'],
    abierto: ['¡Las ocho medallas orientales! Adelante.', 'Adentro te esperan cuatro miembros y el Campeón, sala por sala.']});
  M.npc(entrenador('fort_t1', 8, 21, 'As Oriental', 'Celeste Garra', [['tamborazo', 82], ['chajazo', 82], ['nutrion', 83]], 2000, ['Antes de la Fortaleza, pasás por mí.'], ['Andá, que te ganaste el paso.'], '#5AB4E8'));
  M.npc(entrenador('fort_t2', 22, 16, 'As Oriental', 'Charrúa Valiente', [['butiazal', 83], ['farazo', 83], ['lobomar', 84]], 2100, ['El Cerro no se regala.'], ['Buena pelea, de verdad.'], '#2A2420'));
  M.zonas = [['fortaleza', 3, 2, 26, 11], ['fortaleza_r', 1, 12, 28, 24]]; M.zonaBase = 'fortaleza_r';
  interioresDe(M);
  return TEMA_R2(M);
}
(() => {
  const orig = guardiaAbierto;
  guardiaAbierto = function(n){ return typeof n.requiere === 'function' ? !!n.requiere() : orig(n); };
})();

for(const f of [mapaIsla, mapaQuebradaCueva, mapaPalacio, mapaFortaleza]){ const M = f(); MAPAS[M.id] = M; }
// Centros, markets, gimnasios y casas de los pueblos nuevos.
crearEdificiosPorDentro();
INTERIORES.forEach((info, n) => { if(!MAPAS[info.id]){ const M = mapaInterior(info, n); MAPAS[M.id] = M; } });

/* ---------------- Segunda Liga: la Fortaleza por dentro ---------------- */
const CUARTEL2 = [
  {id: 'calofrio', titulo: 'Liga Oriental', nombre: 'Inés Calofrío', premio: 5000, ropa: '#BFE9FF', pelo: '#FFFFFF', cuartel2: true,
    equipo: [['granizon', 85], ['heladero', 86], ['pamperito', 86], ['glaciaro', 87]],
    antes: ['Bienvenido a la Fortaleza. Soy Inés, la primera de la Liga Oriental.', 'Acá adentro hace frío. Mucho.'], despues: ['Me derretiste.', 'Seguí. Te espera Rocco Granito.']},
  {id: 'granito', titulo: 'Liga Oriental', nombre: 'Rocco Granito', premio: 5400, ropa: '#8C857A', pelo: '#2A2420', cuartel2: true,
    equipo: [['amatiston', 86], ['cantorrodado', 87], ['teyuyagua', 87], ['cerrazo', 88]],
    antes: ['Estas murallas tienen doscientos años. Yo soy más duro.'], despues: ['Me derrumbaste.', 'Pasá. Marea Olivera te espera.']},
  {id: 'marea', titulo: 'Liga Oriental', nombre: 'Marea Olivera', premio: 5800, ropa: '#3B82D6', pelo: '#3B2A22', cuartel2: true,
    equipo: [['franciscana', 87], ['yacare', 88], ['escuerzo', 88], ['nutrion', 89]],
    antes: ['El río y el mar se juntan acá. Yo también junto fuerzas.'], despues: ['Me dejaste en bajamar.', 'Falta uno: Cielo Pampero.']},
  {id: 'pampero2', titulo: 'Liga Oriental', nombre: 'Cielo Pampero', premio: 6200, ropa: '#CFE3F7', pelo: '#E8C25A', cuartel2: true,
    equipo: [['terazo', 88], ['chajazo', 89], ['carancho', 89], ['gavioton', 90]],
    antes: ['¿Sentís el pampero? Es mi equipo llegando.'], despues: ['Me calmaste el viento.', 'El Campeón Oriental te espera en la última sala.']},
  {id: 'celeste', titulo: 'Campeón', nombre: 'José Celeste', premio: 12000, ropa: '#5AB4E8', pelo: '#2A2420', cuartel2: true, campeona: true,
    equipo: [['tamborazo', 91], ['geiseron', 92], ['ombusaurio', 92], ['farazo', 93], ['lobizon', 93], ['lobomar', 95]],
    antes: ['Así que llegaste a la última sala de la Fortaleza.', 'Soy José Celeste, Campeón de la Costa Oriental.', 'Mostrame lo que trajiste del otro lado del río.'],
    despues: ['...Qué pelea. Me ganaste.', '¡Sos el Campeón de la Costa Oriental! Dicen que en la Gruta del Palacio alguien te está esperando.']},
];
const SALAS_LIGA2 = [
  {tipo: 'hielo', piso: ['#E8F5FB', '#D7ECF6'], nombre: 'Sala Helada'},
  {tipo: 'piedra', piso: ['#E6DFD3', '#D9D0C1'], nombre: 'Sala de Granito'},
  {tipo: 'agua', piso: ['#DDEEFB', '#CDE4F5'], nombre: 'Sala del Río'},
  {tipo: 'viento', piso: ['#EEF4FB', '#DFE9F5'], nombre: 'Sala del Pampero'},
  {tipo: 'rayo', piso: ['#F2F6FF', '#E2EAFA'], nombre: 'Sala Celeste'},
];
function crearLiga2(){
  const F = MAPAS.fortaleza;
  const k = Object.keys(F.puertas).find(k => F.puertas[k] && F.puertas[k].liga2);
  const [px, py] = k.split(',').map(Number), afuera = {mapa: 'fortaleza', x: px, y: py + 1};
  const H = interiorBase('liga2_0', 'Fortaleza del Cerro · Patio de armas', LIGA_W, LIGA_H, ['#E6E0D3', '#D9D0C1'], afuera, 9910);
  H.mueble('mostrador', 2, 3, {col: '#FF8FB1'}); H.mueble('mostrador', 3, 3, {col: '#FF8FB1'});
  H.mueble('mostrador', 9, 3, {col: '#4CC27A'}); H.mueble('mostrador', 10, 3, {col: '#4CC27A'});
  H.mueble('estandarte', 4, 2, {col: '#5AB4E8'}); H.mueble('estandarte', 8, 2, {col: '#5AB4E8'});
  H.npc({id: 'liga2_enf', x: 2, y: 2, tipo: 'enfermera', nombre: 'Enfermera Carosor', suelo: 'p', ropa: '#FF8FB1', pelo: '#B5452B', peinado: 'colita', gorra: '#FFFFFF'});
  H.npc({id: 'liga2_vend', x: 10, y: 2, tipo: 'vendedor', nombre: 'Vendedor Elmer Cado', suelo: 'p', ropa: '#4CC27A', pelo: '#3B2A22', peinado: 'corto', gorra: '#4CC27A'});
  H.npc({id: 'liga2_portero', x: 5, y: 2, tipo: 'vecino', nombre: 'Centinela Murallón', suelo: 'p', ropa: '#5A6E8A', pelo: '#2A2420', accion: async n => {
    await dialogo(n.nombre, ['Bienvenido a la Fortaleza del Cerro.', 'Cinco salas: cuatro miembros de la Liga Oriental y el Campeón.', 'Si te curás en el medio, empezás de nuevo. Los jarabes sí valen.']);
  }});
  puertaLiga(H, 'liga2_1', () => true);
  MAPAS[H.id] = TEMA_R2(H);
  F.puertas[k] = {interior: H.id};
  CUARTEL2.forEach((rival, i) => {
    const n = i + 1, sala = SALAS_LIGA2[i], col = TIPOS[sala.tipo].color;
    const atras = {mapa: n === 1 ? 'liga2_0' : 'liga2_' + (n - 1), x: 6, y: 2};
    const M = interiorBase('liga2_' + n, `${sala.nombre} · ${rival.nombre}`, LIGA_W, LIGA_H, sala.piso, atras, 9910 + n * 41);
    M.zonaPelea = 'fortaleza_r';
    for(let y = 4; y <= 9; y++) for(const x of [3, 9]) M.mueble('columna', x, y, {col});
    for(let y = 4; y <= 9; y += 2) for(const x of [1, 11]) M.mueble('antorcha', x, y, {col});
    M.mueble('estandarte', 4, 2, {col}); M.mueble('estandarte', 8, 2, {col});
    M.muebles.push({tipo: 'podio', x: 6, y: 3, col});
    M.npc({id: 'liga2m_' + rival.id, x: 6, y: 3, tipo: 'vecino', nombre: rival.nombre, suelo: 'p', ropa: rival.ropa, pelo: rival.pelo, sala: n, accion: hablarMiembro2});
    const campeon = !!rival.campeona;
    puertaLiga(M, campeon ? 'liga2_6' : 'liga2_' + (n + 1), campeon ? () => !!(S.cuartel2 && S.cuartel2.fama) : () => !!(S.cuartel2 && S.cuartel2.racha >= n));
    MAPAS[M.id] = TEMA_R2(M);
  });
  const Fm = interiorBase('liga2_6', 'Salón de la Fama Oriental', LIGA_W, LIGA_H, ['#E6F3FF', '#D3E8FA'], afuera, 9999 + 7);
  for(let y = 3; y <= 9; y += 2) for(const x of [2, 10]) Fm.mueble('columna', x, y, {col: '#5AB4E8'});
  Fm.muebles.push({tipo: 'podio', x: 6, y: 3, col: '#5AB4E8'});
  Fm.npc({id: 'liga2_cronista', x: 6, y: 2, tipo: 'vecino', nombre: 'Cronista Oriental', suelo: 'p', ropa: '#5AB4E8', pelo: '#E9E2D3', accion: async n => {
    const f = S.salonFama2 || [];
    await dialogo(n.nombre, f.length ? [`Ganaste la Liga Oriental ${f.length === 1 ? 'una vez' : f.length + ' veces'}.`, 'Dicen que en la Gruta del Palacio, al oeste de Tacuarembó, el Gaucho Eterno espera a los Campeones.']
      : ['Acá quedan los Campeones de la Costa Oriental.', 'Todavía no está tu nombre.']);
  }});
  MAPAS[Fm.id] = TEMA_R2(Fm);
}
async function hablarMiembro2(n){
  const k = n.sala, rival = CUARTEL2[k - 1]; if(!rival) return;
  S.cuartel2 = S.cuartel2 || {racha: 0};
  const quien = `${rival.titulo} ${rival.nombre}`, r = S.cuartel2.racha || 0;
  if(rival.campeona && S.cuartel2.fama){ await dialogo(quien, [...rival.despues, 'Pasá al Salón de la Fama.']); return; }
  if(r >= k){ await dialogo(quien, [rival.despues[0], 'La puerta del fondo está abierta.']); return; }
  if(r < k - 1){ await dialogo(quien, ['Primero pasá por las salas anteriores.']); return; }
  if(!hayLuchadorEnPie()){ await dialogo(quien, ['Tu equipo está agotado.']); return; }
  await dialogo(quien, rival.antes);
  S.cuartel2.fama = false;
  lanzarPeleaEntrenador({...rival, lider: true, premio: S.campeon2 ? Math.round(rival.premio / 4) : rival.premio}, 'fortaleza_r');
}
crearLiga2();

/* ---------------- Altares de la región 2 ---------------- */
(() => {
  const orig = visitarAltar;
  visitarAltar = async function(id){
    const L = ESPECIES[id];
    if(!L || L.region !== 2) return orig(id);
    const estado = S.legendarios[id];
    if(estado && estado.capturada){ await dialogo('Altar oriental', ['El altar está en silencio.']); return; }
    if(cantMedallas2() < MEDALLAS2.length){ await dialogo('Altar oriental', ['Una piedra con dibujos charrúas. Se siente una energía rara...', '«Solo quien tenga las ocho medallas orientales será escuchado».']); return; }
    if(estado && estado.proxima > Date.now()){ const h = Math.ceil((estado.proxima - Date.now()) / 3600000); await dialogo('Altar oriental', [`El altar está frío. Volvé en unas ${h} hora${h > 1 ? 's' : ''}.`]); return; }
    if(!hayLuchadorEnPie()){ await dialogo('Altar oriental', ['Algo se mueve... pero tu equipo está agotado.']); return; }
    await dialogo('Altar oriental', ['Apoyás las ocho medallas orientales sobre la piedra...', '¡Algo enorme despierta!']);
    const stats = statsPorNivel(L.base, 85);
    const rival = {esp: id, nombre: L.nombre, nivel: 85, stats, hp: vidaMax(stats, 85), tipo: L.tipo, mult: 1, shiny: Math.random() < PROB_SHINY, escalado: true};
    salirDelMundo(); guardar();
    empezarCombate([rival], zonaEn(mapaActual(), S.mundo.x, S.mundo.y), null);
  };
})();

/* ---------------- Ganchos con el resto del juego ---------------- */
// Volver al mapa: abrir la puerta de la Liga Oriental y darle el regalo del Gaucho.
(() => {
  const orig = siguienteCuartel;
  siguienteCuartel = async function(){
    if(S.cuartel2 && S.cuartel2.continuar && /^liga2_[1-5]$/.test(S.mundo.mapa)){
      S.cuartel2.continuar = false;
      await dialogo('Fortaleza del Cerro', [S.cuartel2.fama ? 'Se abrió la puerta del Salón de la Fama Oriental.' : `Se abrió la puerta del fondo. Sala ${S.cuartel2.racha + 1} de 5.`]);
      return;
    }
    return orig.apply(this, arguments);
  };
  const origPintar = pintarMundo;
  pintarMundo = function(){
    const r = origPintar.apply(this, arguments);
    if(S && S.cuartel2 && S.cuartel2.continuar) setTimeout(() => { if(MW) siguienteCuartel(); }, 500);
    if(S && S.gauchoPendiente) setTimeout(() => { if(MW) premioGauchoEterno(); }, 600);
    return r;
  };
  // Curarse reinicia la Liga Oriental.
  const origCurar = curarEquipo;
  curarEquipo = function(){
    origCurar.apply(this, arguments);
    if(S.cuartel2 && S.cuartel2.racha > 0){ S.cuartel2.racha = 0; avisar('Te curaste: la Liga Oriental vuelve a empezar.'); }
  };
  const origLlegar = alLlegar;
  alLlegar = function(){
    const r = origLlegar.apply(this, arguments);
    if(S.mundo && S.mundo.mapa === 'liga2_6' && S.cuartel2 && S.cuartel2.fama){ S.cuartel2.fama = false; guardar(); }
    return r;
  };
})();

// Región: mapa y vuelo de la Costa Oriental.
const REGION2 = {colonia: [20, 90], termas: [14, 66], polonio: [44, 72], tacuarembo: [40, 48], valizas: [70, 56], quebrada: [70, 34], minas: [48, 24], capital: [24, 22], fortaleza: [24, 4],
  isla: [74, 82], quebradacueva: [90, 30], palacio: [14, 46]};
const RUTAS2 = [['colonia', 'termas'], ['termas', 'polonio'], ['polonio', 'tacuarembo'], ['tacuarembo', 'valizas'], ['valizas', 'quebrada'], ['quebrada', 'minas'], ['minas', 'capital'], ['capital', 'fortaleza', '8 medallas'],
  ['polonio', 'isla'], ['quebrada', 'quebradacueva'], ['tacuarembo', 'palacio']];
(() => {
  const origRegion = regionDe;
  regionDe = function(id){ if(REGION2[id]) return id; return origRegion(id); };
  const origMapa = abrirMapa;
  abrirMapa = function(){
    if(!enRegion2()) return origMapa.apply(this, arguments);
    hojaActual = 'mapa';
    const v = nuevoVelo();
    const vis = S.visitados || {}, aca = regionDe(S.mundo.mapa), M = mapaActual();
    const W = 340, H = 300, px = ([x, y]) => [14 + x / 100 * (W - 28), 18 + y / 100 * (H - 40)];
    let svg = `<svg viewBox="0 0 ${W} ${H}" class="mapa-region" aria-label="Mapa de la Costa Oriental"><rect width="${W}" height="${H}" rx="14" fill="#BFE6FB"/>
      <path d="M20 ${H - 10} C0 200 10 100 40 40 C70 0 200 0 260 30 C330 70 330 200 300 ${H - 20} C220 ${H} 100 ${H} 20 ${H - 10}Z" fill="#CFE8B0" stroke="#22304A" stroke-width="2.5"/>`;
    for(const [a, b, et] of RUTAS2){
      const [x1, y1] = px(REGION2[a]), [x2, y2] = px(REGION2[b]), ok = vis[a] && vis[b];
      svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${ok ? '#C98A52' : '#9AA3AE'}" stroke-width="5" stroke-dasharray="${ok ? '0' : '6 5'}" stroke-linecap="round"/>`;
      if(et){ const mx = (x1 + x2) / 2 + 40, my = (y1 + y2) / 2 + 4, puede = cantMedallas2() >= 8;
        svg += `<g transform="translate(${mx} ${my})"><rect x="-30" y="-9" width="60" height="18" rx="9" fill="${puede ? '#4CC27A' : '#FFFDF8'}" stroke="#22304A" stroke-width="1.8"/><text y="4" text-anchor="middle" font-size="9.5" font-weight="800" fill="#22304A">${et}</text></g>`; }
    }
    for(const [id, p] of Object.entries(REGION2)){
      const [x, y] = px(p), conocido = vis[id] || id === aca, L = Object.values(LIDERES).find(L => DEF_PUEBLOS_R2.some(c => c.id === id && c.lider === L.id));
      const med = L && S.medallas[L.medalla], vuela = tieneHab('vuelo') && vis[id] && id !== aca && PUEBLOS_R2.includes(id) && destinoVuelo(id) && MW && !MW.ocupado;
      svg += `<g transform="translate(${x} ${y})" ${vuela ? `data-volar="${id}" class="destino-mapa" role="button" tabindex="0"` : ''}>${vuela ? '<circle r="15" fill="#4CC27A" opacity=".35"/>' : ''}
        <circle r="${PUEBLOS_R2.includes(id) ? 11 : 8}" fill="${conocido ? (PUEBLOS_R2.includes(id) ? '#FFD23F' : '#6E5A4A') : '#D9DEE6'}" stroke="#22304A" stroke-width="2.5"/>
        ${med ? '<circle cx="9" cy="-9" r="5" fill="#FFD23F" stroke="#22304A" stroke-width="1.5"/>' : ''}
        <text y="25" text-anchor="middle" font-size="10" font-weight="800" fill="#22304A" stroke="#FFFDF8" stroke-width="3" paint-order="stroke">${conocido ? MAPAS[id].nombre : '???'}</text></g>`;
    }
    svg += '</svg>';
    v.innerHTML = `<div class="hoja hoja-mapa" role="dialog" aria-label="Mapa"><div class="hoja-cab"><h2>Mapa</h2><button class="cerrar" aria-label="Cerrar">×</button></div>
      <div class="pestanas" role="tablist"><button role="tab" data-tab="region" aria-selected="true">Costa Oriental</button><button role="tab" data-tab="zona" aria-selected="false">${esc(M.nombre)}</button></div>
      <div class="mapa-cuerpo" id="mapa-region">${svg}<p class="rotulo-chico">Medallas orientales: ${cantMedallas2()} de 8. Para volver a Sorlandia, tomá el ferry en Colonia.</p></div>
      <div class="mapa-cuerpo" id="mapa-zona" hidden><canvas id="minimapa"></canvas><p class="rotulo-chico">Punto rojo: vos. Flechas: salidas. Casitas: puertas.</p></div></div>`;
    v.querySelector('.cerrar').onclick = cerrarHoja;
    v.querySelectorAll('[data-volar]').forEach(g => g.onclick = () => volarA(g.dataset.volar));
    v.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => {
      v.querySelectorAll('[data-tab]').forEach(x => x.setAttribute('aria-selected', x === b));
      $('#mapa-region').hidden = b.dataset.tab !== 'region'; $('#mapa-zona').hidden = b.dataset.tab !== 'zona';
      if(b.dataset.tab === 'zona') pintarMinimapa();
    });
  };
  const origVuelo = abrirVuelo;
  abrirVuelo = function(){
    if(!enRegion2()) return origVuelo.apply(this, arguments);
    if(!tieneHab('vuelo') || !MW || MW.ocupado) return;
    hojaActual = 'vuelo';
    const v = nuevoVelo();
    v.innerHTML = `<div class="hoja" role="dialog" aria-label="Volar"><div class="hoja-cab"><h2>¿A dónde volás?</h2><button class="cerrar" aria-label="Cerrar">×</button></div>
      <p class="rotulo-chico">Volando no se cruza el río: para volver a Sorlandia, tomá el ferry en Colonia.</p>
      <div class="lista-online">${PUEBLOS_R2.map(id => { const ok = S.visitados && S.visitados[id] && destinoVuelo(id), aca = S.mundo.mapa === id;
        return `<button class="fila-online destino-vuelo" data-volar="${id}" ${ok && !aca ? '' : 'disabled'}><span class="fo-txt"><b>${MAPAS[id].nombre}</b><small>${aca ? 'Estás acá' : ok ? 'Tocá para volar' : 'Todavía no lo visitaste'}</small></span></button>`; }).join('')}</div></div>`;
    v.querySelector('.cerrar').onclick = cerrarHoja;
    v.querySelectorAll('[data-volar]').forEach(b => b.onclick = () => volarA(b.dataset.volar));
  };
})();

// El pasaje no se "usa" desde la mochila: se muestra en el ferry.
document.addEventListener('DOMContentLoaded', () => {
  if(typeof usarObjeto !== 'function') return;
  const orig = usarObjeto;
  usarObjeto = function(o, ...resto){
    const ob = typeof o === 'string' ? POR_ID[o] : o;
    if(ob && ob.usa === 'pasaje'){ avisar('Mostralo en el muelle: el capitán del ferry está en Puerto Camalote y en Colonia.'); return; }
    return orig.call(this, o, ...resto);
  };
});
(() => {
  const orig = iconoObjeto;
  iconoObjeto = function(o, tam = 40){
    if(!o || o.icono !== 'pasaje') return orig(o, tam);
    return `<svg viewBox="0 0 40 40" width="${tam}" height="${tam}" aria-hidden="true"><rect x="4" y="10" width="32" height="20" rx="3" fill="#FFFDF8" stroke="#22304A" stroke-width="2.5"/>
      <path d="M26 10 V30" stroke="#22304A" stroke-width="2" stroke-dasharray="2 2"/><path d="M9 22 h12 l-2 4 h-8z" fill="#3B82D6" stroke="#22304A" stroke-width="1.5"/><path d="M14 22 v-6 l5 4z" fill="#FFD23F" stroke="#22304A" stroke-width="1.2"/>
      <circle cx="31" cy="20" r="2.5" fill="#E2574C"/></svg>`;
  };
})();

// Tocar las medallas de arriba abre la pestaña de medallas.
document.addEventListener('click', e => { if(e.target.closest && e.target.closest('#medallas-top') && typeof abrirEquipo === 'function') abrirEquipo('medallas'); });
