# Fondos con mucho detalle: lo que aprendí con el «Atlas de ciudades»

Prueba del 15-10-2026: ocho ciudades (París, Londres, Nueva York, Tokio, Roma, El Cairo, Río de Janeiro y Bogotá) pintadas en **acuarela** y en **papel recortado**. El objetivo era investigar cómo hacer mejores fondos que los de las películas. El código está en `fondos/` (`python build.py` genera `dist/atlas.html`) y la película en `peliculas/atlas-de-ciudades.html`.

## 1. La idea que lo ordena todo: geometría con significado, dos materiales

Igual que con el rig, la ciudad se describe **una sola vez** con piezas que saben lo que son, y cada estilo decide cómo pintarlas:

| Pieza | Acuarela | Papel recortado |
|---|---|---|
| `solid` (muro, monte) | se reserva el papel y se lava en dos veladuras | hoja de color con fibras, borde de cúter |
| `shade` (lateral en sombra) | veladura fría encima | otra hoja más oscura pegada encima (sombra corta) |
| `trim` (tejado, toldo, moldura) | lavado más intenso | pieza pegada con su propia sombra mínima |
| `line` (cable, poste, barandilla) | plumilla con bordes perdidos | tira fina de papel |
| `win` (ventana) | toque de pincel seco; de noche papel reservado teñido de amarillo | **hueco troquelado**: de día se ve el interior oscuro, de noche la luz que hay detrás |
| `lat` (celosía: Eiffel, Torre de Tokio) | lavado claro + trama a plumilla | cientos de triángulos troquelados |
| `tree` | mancha húmeda con la sombra abajo | copa recortada en dos tonos |
| `glow` (farol) | papel reservado + halo | disco de luz con halo |

Escribir una ciudad es escribir **qué hay**, no cómo se ve. Con eso salen dos películas, y cualquier estilo nuevo (boceto, grabado, vitral) solo necesita su propio pintor.

## 2. Profundidad

- **Capas con paralaje** de 0,06 a 1, de cinco a seis por ciudad. Cada capa tiene su **neblina** (`haze`): se mezcla con el color del aire, más en las lejanas. La perspectiva atmosférica hace más que cualquier detalle.
- **El primer plano enmarca**: un árbol o una roca en un borde y una franja baja (pretil, terraza, calle). No debe ocupar más de una quinta parte del cuadro; con el 40 % el fondo se aplasta.
- **Hay que abrir huecos hacia el punto focal**: en París la fila de edificios se corta para que se vea el pie de la torre (el Campo de Marte). Una fila continua de la misma altura es monótona.
- **Escala humana**: gente diminuta, farolas, toldos, buquinistas y bancos dicen enseguida lo grande que es todo.

## 3. Acuarela: lo que la hace creíble

1. **Reservar el papel antes de lavar.** Sin reserva, una pieza deja ver la de detrás como si fuera vidrio. Cada pieza, en orden de atrás adelante, se rellena primero del color del papel y luego se lava.
2. **El orden de pintado importa**, también para las ventanas: si se pintan al final, las de un edificio de detrás se ven a través del de delante (pasó con la torre Victoria de Westminster).
3. **Dos veladuras mal registradas** (la segunda corrida unas unidades) más un borde que «tiembla» con ruido: es el registro imperfecto de un lavado real.
4. **Borde húmedo**: el contorno se refuerza con el mismo color más oscuro, porque el pigmento se va al borde al secar.
5. **Mojado sobre mojado**: dentro de cada masa grande florece otro color, más cálido o más frío.
6. **Granulado**: se multiplica por la textura de grano (el pigmento se asienta en los valles), solo donde hay pintura. En el cielo, muy poco; si no, parece ruido digital.
7. **Blancos reservados**: alguna cara iluminada se deja casi sin pintar, sobre todo cerca del punto focal.
8. **Plumilla con bordes perdidos**: las líneas se cortan donde el ruido lo decide. La pluma da el detalle (ventanas, molduras, cables) y el color se queda suelto, como en el *urban sketching*.
9. **Detalle concentrado en el punto focal**: ventanas y líneas más probables cerca del foco y menos lejos. El ojo lo lee como «mucho detalle» sin que lo haya en todas partes.
10. **Reflejos**: la ciudad invertida **en baja resolución** (un séptimo) se escala y queda blanda como un lavado. Encima, franjas que ondulan, trazos verticales de pincel arrastrado y rayas de papel sin pintar. Copiar los reflejos en resolución completa parece una foto borrosa.
11. **Las nubes no son óvalos pálidos**: son papel levantado con el borde desenfocado y una sombra mojada abajo, con el borde de abajo más marcado.

## 4. Papel recortado: lo que lo hace creíble

1. **Cada capa es una hoja**: color plano, fibras en *overlay* y un **bisel** en el borde (luz arriba a la izquierda, oscuro abajo a la derecha), sacado de la propia silueta desplazada 1 px.
2. **Sombra sobre la capa de detrás**: la silueta desenfocada a media resolución, desplazada más cuanto más cerca está la capa. Es lo que convierte un dibujo plano en un diorama.
3. **Piezas pegadas encima** (tejados, toldos, persianas) con una sombra mínima propia: se nota que son otra hoja.
4. **Caja de luz**: las ventanas son agujeros. Detrás va una capa con el interior oscuro (día) y otra con luz cálida (noche). **El momento más bonito de toda la prueba es una ciudad de papel de noche**: Nueva York y Tokio.
5. **Cielo en bandas** de papel ondulado, cada una con sombra hacia arriba, y estrellas como puntos de luz. El agua también en bandas que se mecen, con el reflejo de la luna en tiras.
6. **Borde de cúter**: ruido fino de alta frecuencia en los edificios y bordes rasgados más grandes en montes y orillas.
7. **Las celosías troqueladas** (Eiffel, Torre de Tokio) son lo que más detalle aparenta por menos trabajo.

## 5. Día y noche

- La noche **no** es un filtro sobre todo: cada capa se tiñe por separado (con su neblina) y las luces se pintan encima sin teñir. Así las ventanas y los faroles brillan de verdad.
- Las ventanas encendidas se eligen al crear la ciudad (`lit`, una probabilidad): la misma ventana está encendida en los dos estilos.

## 6. Rendimiento

- Cada capa se pinta **una sola vez** al cargar la ciudad (unos 2 s por ciudad, los dos estilos, en Chromium sin GPU). Cada fotograma solo pega imágenes con paralaje.
- Se guardan en memoria dos ciudades como mucho (la actual y la siguiente, que se prepara mientras se ve la actual).
- Si la pantalla cambia de tamaño mientras se pinta, el resultado se descarta (si no, queda una franja sin pintar).
- Sin GPU, un fotograma cuesta unos 80–270 ms (comparar dibuja los dos estilos). Con GPU debería ir fluido; hay que medirlo en un PC de verdad.

## 7. Qué falta para «mucho más detalle»

- **Textura dentro de las paredes**: grietas de estuco, hiladas de ladrillo, sillares, manchas de humedad. Hoy las paredes son lisas.
- **Desorden en las azoteas**: más antenas, tendederos, plantas, depósitos, escaleras.
- **Vegetación por hojas** (grupos de hojas recortadas o toques de pincel), no copas enteras.
- **Más vida a nivel de calle**: coches, carteles, gente que camina (con el rig nuevo en pequeño).
- **Luz direccional**: sombras proyectadas de un edificio sobre otro a la hora dorada.
- **Primer plano con interior**: ver la ciudad desde una ventana o un balcón da un marco con muchísimo detalle cerca.
- **Lupa**: pintar una zona a resolución doble para planos cerrados.

## 8. Cómo llevarlo a las películas

- Los fondos de las películas pueden escribirse con estas piezas. Así la serie podría tener una versión en papel recortado sin redibujar nada.
- Para «El Juramento Roto», el porche, Hogwarts y York son candidatos directos. La caja de luz encaja perfecto con faroles y ventanas de noche.

## 9. Interiores en perspectiva viva («El Invernadero de Cristal y Ceniza»)

Cuando el escenario es un interior por el que la cámara se mueve (o que se destruye), las capas planas con paralaje se quedan cortas. Se hizo así (`invernadero/src/20_world.js` y `21_floor.js`):

- **Cámara de verdad:** `PJ(x, y, z)` con `CAM = {x, y, z, zoom, tx, ty}`. Mover `ty` desplaza la imagen sin inclinar la cámara: sirve para contrapicados («mirar al techo») y para mirar un charco casi desde arriba.
- **Arquitectura viva:**
  - las costillas del techo son arcos en el plano y–z proyectados (se abren hacia la cámara);
  - las correas son líneas horizontales;
  - los paneles son cuadriláteros agrupados por tono (cuatro rellenos por fotograma);
  - doblar una columna o retorcer costillas es mover puntos antes de proyectar.
- **Lo plano, una vez:**
  - muro de cristal del fondo en dos versiones (entero y roto) con recorte por paneles;
  - suelo pintado visto desde arriba y dibujado en franjas afines (solo la parte visible; textura cercana más densa).
- **Reflejos exactos en charcos:** el muro del fondo con la escala Y invertida, recortado a los charcos, más barras oscuras bajo cada columna.
- **Luz de ventana en el suelo:** los paneles proyectados con la dirección de la luz, en una textura del suelo; una textura de regueros en movimiento da las sombras líquidas de la lluvia.
- **Orden de pintado:** una lista de profundidad por fotograma (`put(z, f)`) mezcla columnas, plantas, mesas, estanterías, raíces, losas y personajes.
