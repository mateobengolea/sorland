'use strict';
/* =====================================================================
   Criaturas nuevas:
   - Cachorrín: evoluciona con piedras en seis formas (Fuego, Agua, Planta, Rayo, Hielo, Viento).
   - Peces que solo se consiguen pescando: Mojarrita → Mojarrón, Doradito → Dorado.
   - Dos legendarias más: Uritorco (Mina Abandonada) y Ballenaria (Gruta de las Ballenas).
   - Piedras evolutivas, cañas de pescar y zonas nuevas.
   ===================================================================== */
linea({ids: ['cachorrin'], nombres: ['Cachorrín'], tipo: 'normal', niveles: [], base: [17, 6, 7], forma: 'cuadrupedo', col: ['#E8C9A0', '#C9A06A', '#FFF3E2', '#8A5A35'], captura: [.3],
  descs: ['Un cachorro de zorro de la pampa. Cambia de forma según la piedra que toque.']});
const FORMAS_CACHORRIN = {
  fuego: {id: 'brasarrin', nombre: 'Brasarrín', piedra: 'piedra_fuego', base: [20, 10, 8], desc: 'Tocó una Piedra Brasa. Su pelo largo es fuego vivo.'},
  agua: {id: 'olarrin', nombre: 'Olarrín', piedra: 'piedra_agua', base: [26, 7, 7], desc: 'Tocó una Piedra Ola. Se disuelve en el agua y aparece en otra orilla.'},
  planta: {id: 'hojarrin', nombre: 'Hojarrín', piedra: 'piedra_hoja', base: [22, 8, 8], desc: 'Tocó una Piedra Hoja. Le crecen hojas en la cola y huele a monte.'},
  rayo: {id: 'chisparrin', nombre: 'Chisparrín', piedra: 'piedra_trueno', base: [18, 8, 11], desc: 'Tocó una Piedra Trueno. Se le eriza el pelo y tira chispas.'},
  hielo: {id: 'nevarrin', nombre: 'Nevarrín', piedra: 'piedra_hielo', base: [22, 8, 8], desc: 'Tocó una Piedra Escarcha. Deja huellas de hielo al caminar.'},
  viento: {id: 'brisarrin', nombre: 'Brisarrín', piedra: 'piedra_viento', base: [19, 8, 10], desc: 'Tocó una Piedra Pluma. Sus orejas son alas y planea con el viento.'},
};
ESPECIES.cachorrin.evolPiedra = {};
for(const [tipo, f] of Object.entries(FORMAS_CACHORRIN)){
  const m = MULT_ETAPA[2];
  ESPECIES[f.id] = {id: f.id, nombre: f.nombre, tipo, etapa: 2, base: {vida: Math.round(f.base[0] * m), fuerza: Math.round(f.base[1] * m), velocidad: Math.round(f.base[2] * m)},
    captura: .2, aprende: aprendeDe(tipo), desc: f.desc, evol: null, de: 'cachorrin', dib: {forma: 'cuadrupedo', col: ['#E8C9A0', '#C9A06A', '#FFF3E2', '#8A5A35'], rasgos: []}};
  ESPECIES.cachorrin.evolPiedra[f.piedra] = f.id;
  ORDEN_ALBUM.push(f.id);
}
linea({ids: ['mojarrita', 'mojarron'], nombres: ['Mojarrita', 'Mojarrón'], tipo: 'agua', niveles: [20], base: [12, 5, 9], forma: 'pez', col: ['#C9D8E6', '#8FA6BC', '#F4F8FB', '#5E7E9E'],
  descs: ['El pez más común de cualquier muelle. Pica con cualquier carnada.', 'Una mojarra que no paró de comer. Ahora es la más grande del cardumen.']});
linea({ids: ['doradito', 'dorado'], nombres: ['Doradito', 'Dorado'], tipo: 'agua', niveles: [28], base: [16, 8, 9], forma: 'pez', col: ['#FFD23F', '#E8A21E', '#FFF3B0', '#C97A1C'],
  descs: ['El tigre del río, en chiquito. Los pescadores sueñan con sacar uno.', 'El rey del Paraná. Salta fuera del agua y brilla como el oro.']});
// Las que no son legendarias van al álbum normal.
for(const id of ['cachorrin', ...Object.values(FORMAS_CACHORRIN).map(f => f.id), 'mojarrita', 'mojarron', 'doradito', 'dorado']) if(!NORMALES.includes(id)) NORMALES.push(id);
// El orden del álbum: las legendarias siempre al final.
ORDEN_ALBUM = ORDEN_ALBUM.filter(id => !ESPECIES[id].legendaria);
legendaria('uritorco', 'Uritorco', 'piedra', 'cuadrupedo', ['#9A8C7C', '#6E6254', '#E6DACA', '#7FD4FF'], ['aura', 'corona'],
  [[1, 'avalancha'], [1, 'terremoto'], [1, 'trueno'], [1, 'golpazo']], 'Leyenda. El cerro dormido de la Mina Abandonada. Dicen que de noche le brillan los ojos.');
legendaria('ballenaria', 'Ballenaria', 'agua', 'pez', ['#3E6E9E', '#24486E', '#DDEBF5', '#8FD3F7'], ['aura', 'corona'],
  [[1, 'maremoto'], [1, 'ventisca'], [1, 'ola'], [1, 'golpazo']], 'Leyenda. La ballena gigante del fin del mundo. Su canto se escucha a cien leguas.');
LEGENDARIAS.push('uritorco', 'ballenaria');
ORDEN_ALBUM = ORDEN_ALBUM.concat(LEGENDARIAS);

/* ---------------- Objetos nuevos ---------------- */
const PIEDRAS = [
  {id: 'piedra_fuego', nom: 'Piedra Brasa', colores: ['#FF8A3D', '#FFD23F']},
  {id: 'piedra_agua', nom: 'Piedra Ola', colores: ['#3B82D6', '#BFE6FB']},
  {id: 'piedra_hoja', nom: 'Piedra Hoja', colores: ['#4FA03C', '#B6E3A1']},
  {id: 'piedra_trueno', nom: 'Piedra Trueno', colores: ['#F2B53A', '#FFF3B0']},
  {id: 'piedra_hielo', nom: 'Piedra Escarcha', colores: ['#7EC0E8', '#FFFFFF']},
  {id: 'piedra_viento', nom: 'Piedra Pluma', colores: ['#B9D7F2', '#FFFFFF']},
];
for(const p of PIEDRAS) OBJETOS.push({...p, precio: 1200, medallas: 5, usa: 'piedra', icono: 'piedra', tipoObj: 'cura', enCombate: false,
  desc: 'Una piedra que brilla. Si la toca un Cachorrín, evoluciona.'});
OBJETOS.push({id: 'cana', nom: 'Caña de pescar', precio: 0, medallas: 99, usa: 'cana', icono: 'cana', clave: true, tipoObj: 'cura', enCombate: false, colores: ['#8A5A35', '#E2574C'],
  desc: 'Mirando al agua, usala para pescar. Salen peces chicos.'});
OBJETOS.push({id: 'supercana', nom: 'Súper caña', precio: 0, medallas: 99, usa: 'cana', icono: 'cana', clave: true, tipoObj: 'cura', enCombate: false, colores: ['#3B82D6', '#FFD23F'],
  desc: 'La caña de los pescadores de la Bahía. Pican los peces grandes, hasta Dorados.'});

/* ---------------- Zonas nuevas ---------------- */
Object.assign(ZONAS, {
  pesca: {nom: 'Pesca', niveles: [8, 16], aparecen: [['mojarrita', 40], ['pejerrin', 22], ['renacuajin', 14], ['bagrecito', 14], ['doradito', 6], ['tortuguin', 4]]},
  pescagrande: {nom: 'Pesca', niveles: [22, 32], aparecen: [['mojarron', 18], ['doradito', 18], ['pejerrey', 14], ['bagron', 12], ['tortugon', 10], ['sapucay', 8], ['dorado', 7], ['ranacua', 8]]},
  malbec: {nom: 'Pueblo Malbec', niveles: [1, 1], aparecen: []},
  rutavino: {nom: 'Ruta del Vino', niveles: [14, 20], aparecen: [['cachorrin', 10], ['zorrolumbre', 10], ['cardoncito', 12], ['ajicito', 12], ['condorcito', 10], ['peludito', 10], ['huemulito', 8], ['nandu', 10], ['jacarandita', 8]]},
  mina: {nom: 'Mina Abandonada', niveles: [20, 26], aparecen: [['cuarzon', 16], ['morro', 14], ['fosilito', 12], ['tatupiedra', 12], ['chispon', 10], ['pilon', 10], ['geodon', 4], ['cachorrin', 6]]},
  bahia: {nom: 'Bahía Ballena', niveles: [1, 1], aparecen: []},
  costasur: {nom: 'Costa del Sur', niveles: [24, 30], aparecen: [['pinguinito', 14], ['pinguinazo', 8], ['escarchon', 10], ['carpincho', 8], ['cachorrin', 8], ['huemul', 6], ['condoralto', 6], ['nevarrin', 2], ['olarrin', 2]]},
  ballenas: {nom: 'Gruta de las Ballenas', niveles: [28, 34], aparecen: [['pejerrey', 14], ['bagron', 12], ['glaciaro', 8], ['pinguinazo', 10], ['tortugon', 10], ['mojarron', 12], ['dorado', 4]]},
});
