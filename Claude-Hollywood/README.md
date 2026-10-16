# Claude-Hollywood

Cortometrajes en tinta y acuarela hechos con código: un solo archivo HTML por película, Canvas 2D sin librerías y sonido sintetizado en el navegador.

## Qué hay aquí

| Carpeta | Contenido |
|---|---|
| `peliculas/` | Las películas terminadas. Doble clic para verlas (Chrome o Edge, con sonido). |
| `PLAN.md` | Plan para refinar el motor: fases, criterios de «listo» y lo que no vamos a hacer. |
| `cine/` | Motor de escenas sobre el laboratorio: utilidades comunes (`07_cine.js`), una película por archivo (`08_trailer.js`, `08_perdon.js`), sonido y reproductor. |
| `cambio-personajes/` | Las películas originales con los personajes del rig nuevo: `build.py` cambia solo los personajes (fondos, cámara, música y efectos intactos) y `trailer/` monta el tráiler v2 a partir de las tres. |
| `laboratorio/` | `laboratorio.html` (pruebas de rostro, manos, cuerpo y estilos), su código en `src/` y `build.py`. |
| `ESCENARIOS.md` | **El estándar nuevo para mapas** (desde «Entre el Vapor y el Bit»): superficies 3D con texturas pintadas una vez, sol por la persiana con sombras proyectadas, polvo, tela horneada, personajes pixel, diálogo con bleeps y rótulos de hora. Código en `escenarios/`. |
| `marcas/` | **Marcas ficticias del mundo** (Molienda, Vaporetta, Guía Brújula, Kronotek…): identidad, personalidad, paleta y emblema dibujado con código; libro en `marcas/catalogo.html`. |
| `personajes/` | **Elenco pixel** compartido (Teo Cazorla, Rosa Mijares, Brote, Tetera, Aguada): fichas, cuadros y voz de bleeps; galería en `personajes/catalogo.html`. |
| `FONDOS.md` | *(legacy)* **Cómo hacer fondos con mucho detalle**: geometría con significado y dos materiales (acuarela y papel recortado), profundidad, día y noche, rendimiento y lo que falta. Código en `fondos/`. |
| `RIG.md` | **Manual técnico del rig nuevo**: unidades, articulaciones, cabeza, manos, física, estilos, magia, escenas, el adaptador para las películas viejas, el tráiler y cómo comprobarlo. |
| `LECCIONES.md` | **Todo lo aprendido**: flujo de trabajo, cómo está hecho el motor, acuarela, personajes, magia, sonido, rendimiento, verificación, catálogo de errores y arreglos, notas de dirección y lo pendiente para el Episodio III. |
| `juramento-roto/BIBLIA.md` | Biblia de la serie: personajes y guiones por tiempos de los tres episodios. |
| `motor/` | Código fuente de cada película y `build.py` para reconstruirlas. |
| `herramientas/` | Scripts de prueba: capturas, hojas de contacto, rendimiento, audio, notas. |
| `capturas/episodio-2/`, `capturas/episodio-3/` | Hojas de contacto usadas para revisar el Ep. II y el Ep. III. |
| `skill/SKILL.md` | La skill `sumi-e-canvas-film` tal como está guardada (versión condensada para Claude). |

## Películas

- `kurenai.html` — **Kurenai · El Último Pétalo** (samurái, 6:26).
- `juramento-roto-ep1-v1.html` — **El Juramento Roto · Ep. I**, primera versión (6:36).
- `juramento-roto-ep1-v2.html` — **El Juramento Roto · Ep. I**, versión mejorada (10:25).
- `juramento-roto-ep2-la-deuda-de-sangre.html` — **Ep. II · La Deuda de Sangre** (10:12).
- `juramento-roto-trailer.html` — **Tráiler** de la serie con escenas de los tres episodios hechas con el motor nuevo (1:14). Código en `cine/` (`python build.py trailer`).
- `juramento-roto-ep3-escena-el-perdon.html` — **«El Perdón»**, el clímax del Ep. III rehecho con el motor nuevo (0:52). Código en `cine/` (`python build.py perdon`).
- `juramento-roto-ep3-la-ultima-luna.html` — **Ep. III · La Última Luna** (10:08), final de la serie.
- `juramento-roto-ep1-rig-nuevo.html`, `-ep2-`, `-ep3-` — los tres episodios **con los fondos originales y los personajes del rig nuevo** (para comparar).
- `el-invernadero-de-cristal-y-ceniza.html` — **El Invernadero de Cristal y Ceniza** (3:00): duelo de dos magos en un invernadero victoriano bajo la tormenta, todo con el motor nuevo (rig, magia de tinta, interior en perspectiva viva). Código en `invernadero/`, guion en `invernadero/GUION.md`.
- `atlas-de-ciudades.html` — **Atlas de ciudades**: ocho ciudades en acuarela y papel recortado, del día a la noche, con modo comparar (prueba de fondos; código en `fondos/`).
- `claude-hollywood-101.html` — **Claude Hollywood 101** (3:26): Aguada, una tacita en 8 bits, explica cómo se hacen estas películas (voz de ElevenLabs). Código en `hollywood101/`.
- `lo-fi-codes.html` — **Lo-Fi Codes** (3:36): video musical lo-fi con Brote; canción y dibujos 100 % código, sin voces. Código en `lofi-codes/` (con la canción en MP3). *La música lo-fi fue una prueba de música sin inferencia de terceros; no es el color de todas las películas. Sus fondos de ciudad, carretera y mar quedan como legacy.*
- `entre-el-vapor-y-el-bit.html` — **Entre el Vapor y el Bit · Crónica de dos Estrellas**, fases 1–3 (3:06): **el estudio** (Teo se despierta tarde), **la calle Almagre**, **la cafetería Molienda** con Valeria y **el parque y el Invernadero** con Ramiro el pato. Primer mapa del motor **Escenarios**; diálogos con bleeps de 8 bits. Código en `vapor-y-bit/`, guion en `vapor-y-bit/GUION.md`.
- `juramento-roto-trailer-v2.html` — **Tráiler v2** (1:49): escenas de las tres películas con personajes nuevos + primeros planos de manos (juramento de los niños, el hilo rojo, el perdón).

Controles: espacio pausa, ← → salta 10 s, M silencia, F pantalla completa. Las fuentes se cargan de Google Fonts: sin internet se ve con las de reserva.

## Reconstruir una película

Requiere Python 3 (y Node para comprobar la sintaxis).

```
cd motor
python build.py juramento-ep3        # o kurenai, juramento-ep1, juramento-ep2
node --check juramento-ep2/dist/_all.js
```

Sale en `motor/<pelicula>/dist/`: el `.html` completo y una variante `-artifact.html` para publicar. `build.py` reproduce exactamente las películas de `peliculas/` (comprobado byte a byte). El código de la v1 del Ep. I no se incluye: la v2 la reemplaza.

## Cambiar los personajes de las películas originales

```
cd cambio-personajes
python build.py juramento-ep1      # y ep2, ep3 → dist/<película>-nuevo.html (+ -artifact.html)
cd trailer && python build.py      # tráiler v2 → trailer/dist/trailer-v2.html (necesita los tres de arriba)
python shoot.py capturas/a 3 10 26 # fotogramas del tráiler en esos segundos
```

Usa `motor/` y `laboratorio/src` de esta misma carpeta.

## Probar

Requiere `pip install playwright pillow` y `playwright install chromium`.

```
python herramientas/capturas.py ruta/pelicula.html prueba 30 90 175     # fotogramas en esos segundos
python herramientas/hoja.py prueba hoja.png 30 90 175                   # hoja de contactos
python herramientas/rendimiento.py ruta/pelicula.html 30 90 420         # ms por fotograma (CPU)
python herramientas/audio.py ruta/pelicula.html                         # todos los eventos de sonido + reproducción a saltos
node herramientas/notas.js motor/juramento-ep2/dist/_all.js             # notas que faltan en NOTE
```

Cualquier película acepta `?t=SEGUNDOS` en la URL para abrir en modo prueba en ese instante.

## Motores legacy

`motor/` (películas originales), `fondos/` (Atlas de ciudades) y los fondos de `lofi-codes/` siguen funcionando, pero ya no se amplían. Los mapas nuevos se hacen con `escenarios/` (ver `ESCENARIOS.md`).

## Para empezar un episodio nuevo

1. Escribir el guion por tiempos en la biblia.
2. Copiar `motor/juramento-ep3` a una carpeta nueva y añadirla a `ORDER` y `NAME` en `build.py`.
3. Escenarios nuevos en un `02x_*.js`, escenas en `06_*.js`, partitura en `04b_music.js`.
4. Revisar con capturas, audio y rendimiento (ver `LECCIONES.md` §9 y §10).
