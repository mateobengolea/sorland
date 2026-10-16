# Sorlandia

Juego web de mascotas: elegís a **Carosor** (fuego), **Matesor** (planta) o **Rufisor** (agua), lo cuidás, decorás su casa y lo preparás para los combates.

## Cómo está armado

- `index.html` — la página.
- `css/estilos.css` — el diseño.
- `js/juego.js` — toda la lógica del juego.
- `js/config.js` — conexión a Supabase (URL y clave pública).
- `supabase/` — estructura de la base de datos (partidas y perfiles).

Se publica con **GitHub Pages** desde la rama `main`. Las cuentas y las partidas viven en **Supabase**: cada jugador se registra con mail, contraseña y un apodo único, y solo puede leer y modificar su propia partida.

## Hoja de ruta

1. ✅ Base: elegir inicial, cuidar, tienda, casa, niveles.
2. ✅ Cuentas con mail, contraseña y apodo.
3. ✅ Mundo para recorrer (pueblo, pradera, bosque, río, sierras), combate por turnos, cápsulas, jarabes, equipo y álbum.
4. Online: ver a otros jugadores en el mapa, frases y chat, duelos.
5. Evoluciones, más especies, intercambios.

## Archivos del juego

- `js/criaturas.js` — tipos, poderes, especies salvajes, zonas, objetos y dibujos.
- `js/mundo.js` — el mapa, la cámara y el movimiento.
- `js/combate.js` — equipo, combate, captura y álbum.
