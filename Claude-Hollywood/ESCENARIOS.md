# ESCENARIOS · el estándar nuevo para mapas

Desde «Entre el Vapor y el Bit», los mapas se hacen desde cero con este motor (`escenarios/src/`). Apunta al nivel de detalle del Invernadero y lo convierte en un kit reutilizable. El Atlas (`fondos/`) y los fondos de Lo-Fi Codes (`lofi-codes/`) quedan como **motores legacy**. Siguen funcionando, pero no se amplían.

## La idea en una frase

Toda superficie es una **textura pintada una vez** puesta en un **rectángulo 3D**. Todo lo que tiene profundidad se ordena junto. La luz se calcula de verdad: el sol entra por una ventana y se proyecta sobre cada superficie con su perspectiva. Los personajes son **pixel art nítido** que el mundo ilumina, sombrea y refleja.

## El contrato (igual que el Invernadero)

- `x` va de izquierda a derecha, `y` hacia abajo (el suelo es 0) y `z` es la profundidad desde la cámara. **1 unidad ≈ 1 cm.**
- `PJ(x, y, z)` proyecta a pantalla: alto = 1000 unidades, origen en el centro.
- La cámara es `CAM = {x, y, z, zoom, tx, ty}` y se fija con `camSet({...})`.
- `put(z, f)` añade algo a la lista de profundidad; `flush()` la dibuja de atrás adelante.
- Los personajes vienen de `personajes/src/elenco.js` y las marcas de `marcas/src/marcas.js`.

## Módulos (`escenarios/src/`, en orden)

| Archivo | Qué hace |
|---|---|
| `00_wc.js` | Acuarela para pintar una vez. Reservar papel, dos veladuras, borde húmedo, floración, granulado, plumilla con bordes perdidos. Lienzos de sprite en unidades de mundo (`spr`). |
| `01_luces.js` | Capas de luz aditiva a media resolución: `LGT` (escenario) y `LGF` (encima de todo). |
| `10_mundo.js` | Cámara y lista de profundidad. **`vplane`**: pared, puerta o frente de mueble en cualquier orientación. **`hplane`**: suelo, techo o sobre de mesa. **`box3`**: mueble con las caras que se ven. **`bill`**: sprite pintado de pie, con giro sobre un pivote. `clipNear`, `poly3`, `clip3`. |
| `11_materiales.js` | Pintores de material: ladrillo visto con cal vieja, salitre y hollín; yeso con llana y grietas; madera con veta y nudos; parqué en espiga; lino; concreto de acera (juntas, grietas con hierba, chicles); grava suelta sobre tierra con hojas secas; césped; asfalto con parches; baldosa hidráulica (roseta de 8 puntas); mármol veteado; azulejo biselado de metro (`matSubway`); acero cepillado con bandas de brillo (`matSteel`); baldosa de barro cocido (`matQuarry`); lavado liso. **`texShade`** hornea la sombra ambiente en la textura. **`sprBlur`** desenfoca un sprite una vez (primer plano fuera de foco). |
| `12_sol.js` | Sol (o luna) por una ventana con persiana. Rendijas proyectadas sobre cada receptor (`solOn`), sombras de oclusores con agujeros (hojas de monstera), haces en el aire (`solShafts`) y la pregunta «¿este punto está en un haz?» (`solIn`). |
| `13_particulas.js` | Polvo sin estado: el ambiente y las nubes que se levantan (`dustBurst`). Brilla solo dentro de los haces y se reparte en la lista de profundidad. **`dapple`/`dappleAt`**: komorebi, manchas de sol entre las copas que tiemblan (y la luz que reciben los personajes). **`godRays`**: rayos en el aire húmedo. **`kickBits`**: piedritas y hojas secas que levantan los pasos. **`steamCols`**: vapor en columnas estrechas cuyas ondas suben con el tiempo (calderas, rejillas, lancetas de cafetera, vasos). |
| `14_tela.js` | **Tela horneada**: malla Verlet 3D simulada una vez en la carga (reposo, golpe, caída) y guardada a 60 Hz. Colisiones con cajas, esferas y suelo; sombreado por normal suavizada; proyecta sombra. |
| `15_pixel.js` | Personajes pixel en el mundo: escala en píxeles enteros, sombra cuadrada, recorte (asomarse), giro, estela, luz del haz sobre sus píxeles, reflejo fila a fila. |
| `16_dialogo.js` | **Fuente pixel propia** (5×7 con minúsculas, tildes, ñ, ¿ ¡). Caja de diálogo estilo RPG con retrato y bleeps por letra según el ánimo, y **rótulos de hora**. |
| `17_audio.js` | Núcleo WebAudio: buses (música, efectos, voz, ambiente), reverb, lechos, voz de 8 bits, bostezo y foley (pasos, zuecos, golpes, tela, puerta, tope de goma, marco que traquetea, despertador). Programación con anticipación y grabación sin conexión. |
| `18_post.js` | Papel, grano, viñeta y tono en una sola pasada, más fundidos y viñeta de cámara lenta. |
| `21_agua.js` | **`waterPlane`**: agua quieta como espejo (estanques, charcos grandes): cielo, reflejos (`billMirror`), ondas concéntricas, brillos y tono. |
| `20_transiciones.js` | **`pxWipe`**: transición de mosaico pixel entre dos escenas (desde un borde o desde el centro, con ruido). |
| `19_reproductor.js` | Carga por pasos (`FILM.load`), bucle, controles y modo prueba (`?t=`, `__seek`, `__perf`, `__audioTest`, `__renderSong`). La película llama a `bootFilm()` al final. |

## Cómo hacer un mapa nuevo

1. **Planta en cm**, escrita arriba del archivo del mapa: paredes, ventanas, muebles y el recorrido del personaje.
2. **Pintar** las texturas una vez (`tex`, `mat*`) y los sprites (`spr` + `wcWash`). El detalle sale de pintar **pieza por pieza lo que el material es**: cada ladrillo, cada tabla, cada libro, cada post-it. Después se desgasta con lo que le pasó.
3. **Hornear la sombra ambiente** (`texShade` y `texShadeKeep` para sprites con transparencia). El sol se suma en vivo.
4. **Arquitectura primero**: lo de fuera de la ventana, techo, vigas y suelo; luego las paredes. Las paredes van *después* del suelo y del techo y tapan sus bordes.
5. **Receptores de sol** (`solOn`) justo después de pintar cada superficie, con sus oclusores (`occ`) y los dinámicos (`SOL.dyn`: tela, personaje).
6. **Muebles y personajes** a la lista con `put(z, …)`. Lo que está en el suelo (una sábana caída) se ordena como suelo.
7. **Polvo y haces** al final.

## Diálogos y voz

```js
const DLG = [{ t: 23.0, who: 'teo', mood: 'prisa', txt: '¿¡LAS SIETE Y QUINCE!?', face: { wide: true, mouthO: true }, hold: .6 }];
FILM.bleeps = dlgPrep(DLG);   // tiempos de cada letra + un bleep por letra (o cada 2)
dlgDraw(DLG, t, { anchor: d => yEnPantallaDelQueHabla });   // la caja sube arriba si el personaje está abajo
```

| Ánimo | Letras/s | Altura | Onda | Nota |
|---|---|---|---|---|
| prisa | 30 | ×1,28 | cuadrada | letras que tiemblan |
| normal | 22 | ×1 | — | — |
| tecnico | 17 | ×0,9 | pulso 25 % | — |
| sueno | 11 | ×0,66 | triángulo | bajada |
| agotado | 7 | ×0,58 | triángulo | pausas largas |

La voz base de cada personaje está en su ficha (`ELENCO[id].voz`).

## Rendimiento (lo que se aprendió)

- **Nunca uses `ctx.filter` en cada cuadro.** Un `blur(1.5px)` en los cables de la calle subió el cuadro de 26 a 300 ms. Desenfoca una vez en la carga (`sprBlur`).

- **La luz del sol trabaja solo en el rectángulo donde cae.** Componer un búfer a pantalla completa por receptor costaba más de 100 ms en CPU; con el rectángulo, unos 60.
- **Sombra ambiente horneada**, no multiplicada cada cuadro.
- **Papel, grano, viñeta y tono** en un solo lienzo que se arma al cambiar el tamaño.
- **Las tiras del suelo se estiran:** son paralelogramos y el borde del lado cercano se queda corto; se estiran hasta cubrir la pantalla.
- **Luces aditivas y zoom:** el radio de `LGT` va en unidades de mundo; en un primer plano una luz cubre toda la pantalla. Bájale el alfa o el radio en los planos cerrados.
- Sin GPU las cifras solo sirven para comparar. Planos cerrados: 3–16 ms; abiertos con sol y polvo: ~60 ms.
