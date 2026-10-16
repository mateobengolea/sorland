# Sorlandia

Juego web de mascotas: elegís a **Carosor** (fuego), **Matesor** (planta) o **Rufisor** (agua), lo cuidás, decorás su casa y lo preparás para los combates.

## Cómo está armado

- `index.html` — la página.
- `css/estilos.css` — el diseño.
- `js/config.js` — conexión a Supabase (URL y clave pública).
- `js/estado.js` — estado compartido y utilidades.
- `js/criaturas.js` — tipos, poderes, las 104 especies (101 normales + 3 legendarias), zonas, objetos y reglas de combate.
- `js/dibujos.js` — dibujos de criaturas (a mano y generadas por forma + rasgos), shiny, entrenador, peluches y vitrina.
- `js/cuenta.js` — cuentas y guardado.
- `js/combate.js` — equipo, combate, captura, evoluciones, álbum y medallas.
- `js/mapas.js` — regiones, casas con interior, centros, markets, entrenadores, líderes, objetos y altares.
- `js/mundo.js` — cámara, movimiento, diálogos y encuentros.
- `js/online.js` y `js/duelo.js` — jugadores en vivo y duelos.
- `js/juego.js` — creación del entrenador, la casa, el Market y el arranque.
- `supabase/` — estructura de la base de datos.

Se publica con **GitHub Pages** desde la rama `main`. Las cuentas y partidas viven en **Supabase**.
