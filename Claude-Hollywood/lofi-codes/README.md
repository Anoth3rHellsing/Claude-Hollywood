# Lo-Fi Codes

Video musical lo-fi de 3:36, sin textos y sin ninguna voz ni sonido externo: **la canción y los dibujos son 100 % código**
(WebAudio y Canvas 2D, sin librerías ni modelos de terceros). Tiquete en modo **auto**.

**Brote** (personaje nuevo, 22×22 px): una maceta de barro con un brote verde y audífonos amarillos. Viene del invernadero.

| Tiempo | Escena | Música (80 BPM, 1 compás = 3 s) |
|---|---|---|
| 0:00 | Invernadero de mañana: duerme entre las macetas, despierta, se estira | Intro: piano eléctrico filtrado + vinilo |
| 0:12 | Salta de la mesa y camina por el pasillo (mueve la cabeza al ritmo) | Entra la batería boom-bap y el bajo |
| 0:33 | Ciudad en otoño: fachadas, árboles, faroles, palomas que se espantan, charcos | Melodía (A) y luego la progresión B |
| 1:24 | El carrito de café de **Tetera** (la barista): pide con un globito | Respiro: solo aro y platillos |
| 1:38 | Plano cenital: la leche cae y forma un corazón en acuarela | Kalimba, muy tranquilo |
| 1:50 | La taza vuela al borde de su maceta | Vuelve la batería |
| 2:00 | **36 s manejando** por la costa: pueblo → colinas → aparece el mar | Groove completo, melodía una octava arriba al final |
| 2:36 | Muelle al atardecer: banco, sol que baja, faro, gaviotas; se sube al respaldo y sonríe | Batería suave, kalimba, el filtro se oscurece |
| 3:24 | Anochece, la cinta se frena, fundido al papel | Acorde final que baja de afinación |

`musica/lo-fi-codes.mp3` es la canción grabada sin conexión desde el mismo código (−14 LUFS, pico −2 dBFS).

## Escenarios reutilizables (todos sobre la cámara en perspectiva del Invernadero)
- `20_world`–`24_set`: el **invernadero de día en otoño** (de Claude Hollywood 101).
- `41_city.js`: **ciudad en otoño**: fachadas en acuarela generadas (`makeBuilding`), bulevar que se repite (`cityFloorStrips`), sombra moteada, faroles, bancos, flores, charcos con reflejo, palomas, carrito de café.
- `43_drive.js`: **carretera de perfil** con paralaje de 7 capas y un auto en píxeles (ruedas que giran, rebote, humo, hojas que levanta).
- `44_sea.js`: **muelle al atardecer**: cielo, sol que baja, estela, olas sin estado, acantilados con faro, anochecer.
- `30_sprite.js`: sprites nítidos (Brote, Tetera, auto, ruedas, palomas, gaviotas), sombra cuadrada, reflejo pixelado, vapor.
- `42_cafe.js`: globitos de diálogo en píxeles con íconos y el latte art por capas.
- `50_audio.js`: el motor lo-fi: Rhodes FM, batería con swing y humanizado, bajo, melodía con delay, kalimba, vinilo, wow & flutter, bombeo con el bombo, ambientes. `FORM` es la canción compás a compás.

```
python build.py                     # → dist/lo-fi-codes.html
```
Prueba: `?t=SEG`, `__seek(t)`, `__perf(t)`, `__audioTest()`, `__renderSong(t0, dur, sr)` (graba la canción sin conexión).
