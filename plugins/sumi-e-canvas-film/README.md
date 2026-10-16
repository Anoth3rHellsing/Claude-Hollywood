# sumi-e-canvas-film · películas animadas en un solo HTML

Skill para Claude que hace películas, cortos, intros y fondos animados con **Canvas 2D y sonido 100 % sintetizado**. Todo va en un solo archivo HTML, sin librerías. Hay tres estilos:

- **Acuarela / sumi-e:** tinta que sangra, papel y siluetas.
- **Papel recortado:** cajas de luz y capas con sombra.
- **Mapas 3D detallados** (motor **Escenarios**):
  - luz de sol o luna por persianas, polvo en los haces, tela horneada y agua espejo;
  - personajes pixel con diálogos tipo RPG y bleeps de 8 bits;
  - música y foley procedurales.

Así se hicieron «Kurenai», la serie «El Juramento Roto» y «Entre el Vapor y el Bit · Crónica de dos Estrellas».

## Voces con ElevenLabs / Voices with ElevenLabs

- **🇪🇸** Con el conector de ElevenLabs en Claude, el skill puede dar voces reales a los personajes: las genera, mide su duración y las incrusta en el HTML. Sin el conector, todo el sonido es sintetizado.
- **🇬🇧** With the ElevenLabs connector in Claude, the skill can give characters real voices: it generates them, measures their length and embeds them in the HTML. Without it, all sound is synthesized.

## Instalar en Claude Code

```
/plugin marketplace add Anoth3rHellsing/Claude-Hollywood
/plugin install sumi-e-canvas-film@claude-hollywood
```

En una sola línea (Claude Code 2.1.275 o posterior):

```
/plugin install sumi-e-canvas-film --marketplace Anoth3rHellsing/Claude-Hollywood
```

Desde la terminal: `claude plugin marketplace add Anoth3rHellsing/Claude-Hollywood` y luego `claude plugin install sumi-e-canvas-film@claude-hollywood`.

Úsalo con `/sumi-e-canvas-film:sumi-e-canvas-film`, o simplemente pide una película. Admite un modo como argumento: `control` (por defecto), `auto` o `asistido`.

## Instalar en claude.ai o Claude Desktop

1. Descarga [`dist/sumi-e-canvas-film.zip`](../../dist/sumi-e-canvas-film.zip).
2. En Claude, abre **Customize → Skills**, pulsa **+ → Create skill → Upload a skill** y elige el zip.
3. Necesitas tener activadas la ejecución de código y la creación de archivos.

## Qué trae

| Ruta | Qué es |
|---|---|
| `skills/sumi-e-canvas-film/SKILL.md` | El procedimiento: guion, arquitectura, técnicas, cámara, sonido, verificación. |
| `…/assets/plantilla/` | Motor Escenarios completo y una escena de ejemplo de 20 s que funciona (`python build.py`). |
| `…/references/` | Manuales: `ESCENARIOS.md`, `FONDOS.md`, `RIG.md` y `LECCIONES.md` (el catálogo de errores). |
| `…/scripts/` | Herramientas de prueba con Playwright: capturas, hojas de contacto, audio, rendimiento. |
| `…/assets/tiquete.html` | Formulario opcional de pedido («tiquete de producción»). |

## Para quien mantiene el repo

El skill se sincroniza con el código vivo de `Claude-Hollywood/` y se vuelve a empaquetar el zip con:

```
python plugins/sumi-e-canvas-film/sync.py
claude plugin validate . && claude plugin validate plugins/sumi-e-canvas-film --strict
```

Sube `version` en `.claude-plugin/plugin.json` en cada publicación, para que los usuarios reciban la actualización.

## Aportar lecciones (opcional)

Al terminar tu primera película, el skill te preguntará **una sola vez** si quieres compartir lo que aprendan juntos.

- **Si aceptas:** cada lección se te enseña antes de enviarse, sin datos personales. Se manda como issue con la plantilla «Aportar una lección».
- **Si no:** no vuelve a preguntar, salvo que tú lo pidas.

