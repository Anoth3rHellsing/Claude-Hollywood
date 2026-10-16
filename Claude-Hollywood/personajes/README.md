# Elenco pixel del mundo Clawd

Todos los personajes de este mundo son **sprites de 8 bits nítidos** sobre escenarios en acuarela:

- contorno `K`;
- sin suavizado;
- escalan con la distancia en píxeles enteros;
- el mundo los ilumina, los sombrea y los refleja.

Al crear un personaje nuevo se le da un **nombre realista** al azar.

- `src/elenco.js` contiene:
  - `ELENCO`: una ficha por personaje con nombre, rol, película, voz de bleeps, paleta, cuadrícula, tamaño en cm por píxel y centro del pie;
  - `frame(o)`: arma un cuadro de animación;
  - `elencoCanvas(id, o)`: el cuadro en un lienzo, con caché;
  - `elencoFace(id, o)`: el retrato para las cajas de diálogo.
- **Opciones de cuadro comunes:** `legL/legR` (correr), `blink`, `sleep`, `happy`, `tired`, `wide` (sorpresa), `mouthO`, `flat`. Teo además tiene `clogs`, `top: 'cuaderno'` y `cup`.
- `catalogo.html` es la galería. Se reconstruye con `python build.py`.

| Personaje | Qué es | Película |
|---|---|---|
| **Teo Cazorla** | Cazo de cobre con gorro de chef; el mango es su colita, con cinta roja. Jefe de partida en Brasa y Bruma. Voz 523 Hz, cuadrada. | Entre el Vapor y el Bit |
| **Valeria Ocampo** | Jarrita de leche de acero con delantal de Molienda; barista, trabaja de pie sobre el mostrador. Voz 698 Hz, triángulo. Tema propio con swing. | Entre el Vapor y el Bit |
| **Rosa Mijares** | Pancito de masa madre con gorro; segunda de cocina. Voz 392 Hz, triángulo. | Entre el Vapor y el Bit |
| Brote | maceta con audífonos | Lo-Fi Codes |
| Tetera | barista del carrito de café | Lo-Fi Codes |
| Aguada | tacita con boina (diseño de Nico) | Claude Hollywood 101 |
