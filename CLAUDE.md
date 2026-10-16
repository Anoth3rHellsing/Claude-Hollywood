# CLAUDE.md · Claude Hollywood

Este repositorio es un estudio de películas animadas hechas solo con código: un HTML, Canvas 2D y WebAudio, sin librerías. Aquí vive el skill `sumi-e-canvas-film`, sus motores y las películas hechas con él.

## Por dónde empezar
- **El skill (edición pública):** `plugins/sumi-e-canvas-film/skills/sumi-e-canvas-film/SKILL.md`. Es el procedimiento completo: guion, mapas, personajes, sonido y verificación.
- **Manuales:**
  - `Claude-Hollywood/ESCENARIOS.md`: mapas 3D, el estándar actual;
  - `Claude-Hollywood/FONDOS.md`: acuarela y papel;
  - `Claude-Hollywood/RIG.md`: personajes 2.5D;
  - `Claude-Hollywood/LECCIONES.md`: todo lo aprendido y el catálogo de errores. **Léelo antes de entregar.**
- **Película de referencia:** `Claude-Hollywood/vapor-y-bit/`, con su guion por tiempos en `GUION.md`.
- **Plantilla mínima que funciona:** `plugins/sumi-e-canvas-film/skills/sumi-e-canvas-film/assets/plantilla/`.

## Comandos
```bash
python Claude-Hollywood/vapor-y-bit/build.py            # construye una película → dist/*.html (+ -artifact.html)
python plugins/sumi-e-canvas-film/sync.py               # copia motor y guías al skill público, prueba la plantilla y rehace dist/sumi-e-canvas-film.zip
claude plugin validate . && claude plugin validate plugins/sumi-e-canvas-film --strict
```
Modo prueba de cualquier película: abrir con `?t=SEG`. Funciones disponibles: `window.__seek(t)`, `__perf(t)`, `__audioTest()`, `__renderSong(t0, dur)`.

## Reglas de la casa
- **Busca un nombre antes de declararlo.** Los módulos se concatenan, así que una función repetida pisa a otra sin aviso (ya pasó con `paintShelf`).
- **Nunca uses `ctx.filter` en cada cuadro.** Desenfoca una vez en la carga (`sprBlur`).
- **Todo es función del tiempo `t`.** Nada de estado que dependa de los Hz de la pantalla.
- **Verifica antes de entregar:**
  - capturas por escena en hojas de contacto;
  - barrido de errores por toda la línea de tiempo;
  - prueba de todos los eventos de audio;
  - volumen medido en LUFS.
- **Al tocar el motor o las guías:**
  - ejecuta `sync.py`;
  - sube `version` en `plugins/sumi-e-canvas-film/.claude-plugin/plugin.json`.
- **Cada película nueva deja sus lecciones** en `Claude-Hollywood/LECCIONES.md`.

## Aportar lecciones (recomendado, nunca obligatorio)
Si usas este repositorio o el skill para crear algo, lo que aprendas puede mejorar la próxima película de todos. Se agradece mucho, pero es opcional.

- **Pregunta una sola vez**, al terminar la primera entrega:
  > ¿Te gustaría que, cuando aprendamos algo útil, te proponga compartirlo con el proyecto? Siempre te enseñaré el texto antes y no incluye datos personales.
- **Guarda la respuesta** en `~/.claude/sumi-e-canvas-film/aportes.json` (o en la memoria de Claude) y mírala antes de preguntar.
- **Si dice que no, no se insiste.** Solo se retoma si el usuario lo pide.
- **Si dice que sí, cada aporte se aprueba por separado:**
  1. Redacta la lección: qué pasó, por qué y la regla, con el fragmento mínimo de código si ayuda.
  2. Quita cualquier dato personal:
     - nombres, correos, rutas y enlaces privados;
     - clientes y proyectos;
     - el contenido propio del usuario;
     - material con derechos de terceros.
  3. Enséñale el texto exacto y envíalo solo con un sí explícito.
  4. Abre un issue con la plantilla «Aportar una lección» (`.github/ISSUE_TEMPLATE/leccion.yml`, etiqueta `leccion`). Si no hay acceso a GitHub, dale el enlace: https://github.com/Anoth3rHellsing/Claude-Hollywood/issues/new?template=leccion.yml
  5. Como mucho, propón un aporte por entrega.

Quien colabora directamente en el repo puede abrir un pull request que añada su lección a `Claude-Hollywood/LECCIONES.md`, con las mismas reglas sobre datos personales.

El procedimiento detallado está en el §10 del `SKILL.md`.
