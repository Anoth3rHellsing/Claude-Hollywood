# Claude Hollywood 101

Corto de 3:26 en el que Aguada, la tacita con boina de Nico (8 bits), explica cómo se hacen estas películas.
La voz es de ElevenLabs (Fruna, eleven_v4); todo lo demás es código: Canvas 2D sin librerías y sonido sintetizado.

```
python build.py            # → dist/claude-hollywood-101.html (+ -artifact.html para publicar)
python build.py --subs     # además imprime cómo quedaron partidos los subtítulos
```

`build.py` incrusta la voz (`../../voz/L01–L18.mp3`), mide su duración real, parte cada línea en subtítulos
según sus pausas (ffmpeg silencedetect) y calcula el volumen a 30 Hz (el agua de Aguada se mueve al hablar
y la onda de L15 sale de ahí). Si falta un MP3, la línea queda solo con subtítulo.

| Archivo | Qué hace |
|---|---|
| `src/19_wc.js`–`24_set.js` | El motor del Invernadero pasado a **día de otoño**: cielo con sol, bosque amarillo/rojo/naranja detrás del vidrio, vidrio claro, rombos de sol en el suelo, flores, raíces bajas. `drawSet` acepta `stage` para pintar por capas. |
| `src/30_aguada.js` | Aguada: cuadrícula de Nico, cuadros de animación (andar, parpadeo, agua, piedra, sudor, mirada), sombra cuadrada y reflejo pixelado en los charcos. |
| `src/31_fx.js` | Hojas que caen y que se apartan, rayos de sol, poste oxidado, piedra, esquirlas balísticas con trayectoria, polvo, ondas de pasos, pantallas colgantes (B3), caja de cultivo que suena (B5), transición de tinta. |
| `src/32_skel.js` | B1: el esqueleto del mundo (cámara 3D en líneas), ejes, fórmula y contador de fotogramas. |
| `src/33_paint.js` | B2: figura simple → deformación ×3 → 20 capas → borde húmedo → papel; el caballete. |
| `src/34_ticket.js` | B6: tiquete, sellos de modo, pincelada y tarjeta final. |
| `src/35_audio.js` | Sonido: lechos, música en Fa lidio, efectos, voz con ducking; buses que se tiran al saltar. |
| `src/36_film.js` | Tiempos de la voz (`VO`), coreografía de Aguada (`agAt`), cámaras y planos por bloque. |
| `assets/*.jpg` | Fotogramas reales de Kurenai (4:28), El Juramento Roto ep. I v2 (0:30) y el Invernadero (0:40). |

Modo prueba: `?t=SEG` y `window.__seek(t)`, `__perf(t)`, `__audioTest()`.
