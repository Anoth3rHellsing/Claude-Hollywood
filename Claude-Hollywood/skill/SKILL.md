---
name: "sumi-e-canvas-film"
description: "Crear cortometrajes, intros o fondos animados en un solo HTML con Canvas 2D en estilo acuarela / sumi-e o papel recortado (tinta que sangra, papel, siluetas, cajas de luz), con guion en actos y sonido procedural. Modos: control (por defecto), auto y asistido; lee el tiquete de producción."
---

# Cortometraje sumi-e / acuarela en Canvas (un solo HTML)

Procedimiento probado en «Kurenai» (samurái, 6:26) y en la serie «El Juramento Roto»: Ep. I v1 (magos victorianos, 6:36) y v2 (10:25), Ep. II «La Deuda de Sangre» (10:12) y Ep. III «La Última Luna» (10:08). Después vinieron un motor de personajes nuevo (rig 2.5D: cabeza, manos de cinco dedos, cuerpo con física, estilos y magia de tinta; §4 bis), una escena y un tráiler hechos con él, las tres películas con los personajes cambiados al rig nuevo, el «Atlas de ciudades» (ocho ciudades en acuarela y en papel recortado, del día a la noche; §4 ter) y «El Invernadero de Cristal y Ceniza» (3:00, duelo en un interior en perspectiva viva que se destruye; §4 quater, **el estándar actual para escenas de acción**). Produce una película animada de 3–10 min, autónoma (HTML + CSS + JS vanilla, sin librerías), que imita pintura de tinta y acuarela en movimiento, con sonido 100 % sintetizado. Sirve para cualquier mundo.

Si el usuario tiene la carpeta `Claude-Hollywood`, es la referencia: reutiliza su código y sus herramientas y añade ahí lo nuevo al terminar. Contiene:
- `motor/`: el motor original y las películas;
- `laboratorio/`: el rig nuevo;
- `cine/`: escenas con el rig nuevo;
- `cambio-personajes/`: el adaptador y el tráiler v2;
- `fondos/`: el motor de fondos en acuarela y papel recortado;
- `invernadero/`: el motor de escenas dinámicas en perspectiva viva (punto de partida para la siguiente película de acción);
- la biblia, `LECCIONES.md` (todo lo aprendido, con el catálogo de errores), **`RIG.md`** (manual técnico del rig nuevo) y **`FONDOS.md`** (cómo hacer fondos con mucho detalle);
- `tiquetes/`: la plantilla del tiquete de producción (§0 bis);
- las herramientas de prueba.

Lee `RIG.md` antes de tocar personajes y `FONDOS.md` antes de pintar escenarios.

## 0. Antes de empezar
- Si el pedido incluye diseños o personajes protegidos de una franquicia (escudos/logos oficiales, mascotas, personajes conocidos como un sombrero parlante), no se dibujan: avisa en una frase y sustitúyelos por diseños originales (sellos/runas propias en los colores del grupo; el personaje conocido como voz + estallido de luz). La historia, nombres y hechizos pueden ir en la narración.
- Violencia sensible (golpes, maldiciones): implícita y estilizada (mancha de tinta roja, corte de pantalla, figura despedida), nunca gráfica.
- Idioma de narración: el de la conversación salvo que pidan otro.
- Reutiliza el motor de la película anterior: copia la carpeta y escribe solo un archivo de escenarios nuevo (`02x_*.js`) y los de escenas (`06_*.js`). El núcleo no necesita cambios entre episodios.
- **Dirección acordada con Nico (serie «El Juramento Roto»):**
  - personajes sin rostro (se reconocen por pelo, porte y sello);
  - sin primeros planos de cara con el motor actual; sí planos medios en silueta y primeros planos de manos grandes;
  - fondos: los de las películas originales en acuarela, mejores que los rehechos a mano;
  - de otros artistas solo se toman principios de forma, nunca diseños.
- Para una serie, mantén una **biblia** (personajes, siluetas, sellos, motivos, guiones por tiempos de cada episodio) y escribe en ella el guion del episodio nuevo antes de programar.

## 0 bis. Modos de trabajo y tiquete de producción
El modo llega como argumento (`/sumi-e-canvas-film control|auto|asistido`) o en el campo «modo» del tiquete; sin nada, **control**.

**El tiquete** es un artifact de Nico («Tiquete de producción», `https://claude.ai/artifact/LevsRuMzxQErni6vzonKsY`; fuente en `tiquetes/tiquete.html` de su carpeta):
- **Cómo leerlo:** con `ArtifactData` → `list` de la colección `tickets` (un documento por tiquete; el que está en estado `listo` es el pedido). Si Nico pega un bloque que empieza por `# TIQUETE`, ese es el mismo contenido.
- **Campos:**
  - ficha: título, duración, estilo, universo, estado, modo;
  - `logline` y `tono`;
  - `sagrado` (no se toca) y `noquiero`;
  - `personajes[]` (nombre, silueta, pelo, magia, quién es);
  - `lugares[]` (cuándo, cómo, qué reacciona);
  - `bloques[]` (desde, hasta, prioridad 1–3, qué se ve, qué se oye, cámara);
  - técnica, `refs` y `notas`;
  - `claude` (`nota`, `preguntas[{q, a}]`, `supuestos[]`), que es donde escribe Claude.
- **Escribir en él:** `update` del documento con el `if_version` leído, cambiando solo `claude` y `estado` y poniendo `updatedAt` a la hora actual (ISO), o la página no lo toma. Nunca se reescriben los campos de Nico.

**Control (por defecto)**
1. Lee el pedido o el tiquete. Si falta algo que cambia el resultado, haz **una sola ronda de 3–5 preguntas** (en el chat y también en `claude.preguntas`). Lo que se pueda decidir sin cambiar mucho, no lo preguntes.
2. Con las respuestas, o sin ellas si no llegan o no convencen, **toma el control**: completa los huecos para que se sienta entero.
3. Deja **a la vista lo que decidiste** antes de construir, en `claude.supuestos` y en una lista corta al empezar. Así se corrige pronto.

**Auto**
- Bastan la idea y lo sagrado. Puedes cambiar casi todo: planos, efectos, escenas nuevas, música, orden de bloques, personajes secundarios.
- **Lo sagrado y lo de «NO quiero» no se tocan sin permiso.** Si una idea lo necesita, o si el resultado se aleja de la `logline`, para y manda un pitch de dos líneas (qué cambia y por qué mejora) y espera el sí.
- Si nadie responde, sigue por el camino que no lo toca.

**Asistido**
- No se construye nada todavía. Primero se conversa:
  - propuesta de enfoque (aspecto, personajes, decorado, guion por planos);
  - riesgos técnicos y lo que el motor aún no hace bien.
- Se itera hasta que los dos estén conformes, rellenando juntos el tiquete.
- **Solo con un sí explícito** («listo», «dale») empieza la creación, ya en modo control con el plan aprobado.

**En los tres:** al entregar, pon el tiquete en `entregado` y escribe en `claude.nota` qué se hizo y dónde está.

## 1. Guion antes que código
- Tres actos como tabla de tiempos absolutos: escena, inicio, fin, transición, narración, eventos de sonido.
- Proporciones que funcionaron (≈10 min): prólogo 25–30 s; Acto I ~2 min (presentar el conflicto en cada personaje por separado); Acto II ~3–4 min; Acto III ~3 min con el clímax en un instante (silencio → hechizo/embestida → destello); epílogo ~1 min; cierre de 25–30 s que queda quieto («Fin» o «Continuará…» + título del siguiente episodio). 10 min es el techo práctico por sesión: verificar cada escena cuesta más que escribirla.
- **Una regla de mundo clara hace el clímax** (p. ej. «con luna llena la magia se apaga»; «todo hechizo contra otro de los tres hiere al que lo lanza»). Muéstrala antes de usarla.
- **Motivos que abren y cierran** (tres gotas de sangre, un hilo rojo, una cinta verde, un farol) y **callbacks** del episodio anterior (el mismo lugar, el mismo gesto invertido).
- Final abierto = una pregunta concreta para el siguiente episodio; anótala en la biblia.
- **Si el usuario trae un guion por bloques** (como el del Invernadero): cada frase con un hecho físico visible (qué se rompe, hacia dónde sopla, qué ilumina qué) se convierte en un plano o en un efecto con su tiempo. Respétalo al pie de la letra en lo que pasa y en el ritmo, y traduce solo el lenguaje visual (neón → tinta) avisando antes.
- Paleta: papel cálido, tinta (24,20,18), grises lavados y pocos acentos con significado (carmesí 176,24,38; colores de facción; vela 255,196,110; luna 200,210,236).

## 2. Arquitectura del archivo
Módulos concatenados por un script de build en orden fijo → un HTML completo + una variante sin doctype/head/body para publicar como artifact. Comprobar con `node --check` sobre el JS concatenado.
1. `core`: clamp/lerp/easings, `rg(t,a,b)`, `fade(t,a,b,fi,fo)`, RNG con semilla (mulberry32), ruido + fbm, sprites en **unidades** (alto de escena = 1000u, origen en el centro), cámara `L(depth)` con parallax, `L0()` = pantalla, `wash`, `brush`, `Bleed`, papel.
2. `paint` (+ uno por mundo/episodio): generadores de sprites pintados **una vez** en la carga.
3. `fig` (+ vestuarios como `mage`): personajes por esqueleto paramétrico → `Path2D`.
4. `audio` (primitivas) + `music` (instrumentos, temas, `auBeds`, `score`).
5. `fx` (+ `magic`, `duel`): partículas, lluvia, aves, hierba, trazos; haces, orbes, chispas; escudos, choque, escombros.
6. `scenes`: `scene(t0,t1,fadeIn,fadeOut,{tin,enter,draw})` + `CUES` + `CHAPTERS`. Si es largo, divídelo en varios archivos por acto.
7. `main`: bucle rAF, postproceso (corte, destello `FLASH`/`FLASHC`, textura, viñeta, franjas), transiciones, textos DOM, controles, modo prueba `?t=`.

- Las tareas de carga pueden ser `async` (esperar fuentes con timeout); el build hace `await` con `setTimeout(0)` entre tareas.
- Cada escena dibuja en función del **tiempo absoluto T** (determinista → se puede saltar). Lo con estado (partículas) se limpia en `enter()`.
- Un objeto global se amplía (`Object.assign(SPELL, …)`) solo en un módulo cargado **después** del que lo declara.
- No reutilices nombres entre módulos: una función gráfica `drop()` pisa a la de audio. Busca el nombre antes de declararlo.

### Transiciones de tinta
La escena nueva (`tin: 'bleed'|'bleed2'|'sweep'|'down'`) se dibuja en un búfer y se enmascara con un mapa de tiempo de llegada a 1/6 de resolución con anillo de tinta en el frente. **La escena anterior debe durar hasta `t0 + fadeIn` de la nueva, con `fadeOut` ≈ 0,5**; si termina antes, se ve papel en blanco a mitad del sangrado. Sin `tin`, las dos escenas se funden a través del papel.

## 3. Técnicas de acuarela
- **Lavado por deformación recursiva** (Tyler Hobbs): polígono → `deform` 1–2 niveles → 15–30 capas deformadas 2–3 niveles más, alfa 0,04–0,09. Siempre `densify` (aristas ≤ ~36u; 24u en arquitectura) y `gauss()` limitado a ±2 (varianza por vértice ≤ 1,6), o salen cuñas y picos fantasma.
- **Arquitectura:** `amt` ~0,03 y pocas capas → bordes rectos pero suaves. Arco ojival equilátero. Ventanas con `destination-out` para ver cielo y luna detrás (dibújalos en ese hueco a `L(1)` si deben verse por la ventana).
- **Nieve:** `destination-out` en bandas sobre tejados deja ver el papel. Si recortas algo (baranda rota), repinta lo que hay detrás o queda un rectángulo blanco.
- **Los lavados son translúcidos:** nada «tapa» de verdad (el suelo no oculta la luna, un muro deja ver el castillo). Para ocultar, sube capas y alfa o usa fundidos.
- **Sangrado (`Bleed`):** mapa de llegada a baja resolución (distancia a semillas + fbm; o segmentos rasterizados para ramas); máscara `destination-in` + anillo húmedo `source-atop`; cachear al terminar. **Modo `inv`** = papel que se quema.
- **Pincel caligráfico:** cuerpo de ancho variable + 6–16 cerdas; pincel seco por umbral de ruido; semilla fija.
- **Recolorear** un sprite (fuego naranja → verde): una vez en la carga con `getImageData` permutando canales.
- Montañas: picos `exp(-|x−p|^0.85/w)`, trazos *cun*, borrado hacia abajo = niebla, capas con bandas de niebla en `source-over`.
- Composición: papel `source-over` → pintura `multiply` → luz `source-over` → textura `soft-light` → viñeta `multiply` → franjas de cine.
- **Luz:** todo lo que brilla va en `source-over` (en `multiply` no se ve sobre oscuro). Haces de luna = polígonos pálidos alfa 0,06–0,09; rayo con barrotes = polígono + franjas oscuras en `multiply`. Reflejos en agua: sprite invertido en ≤ 10 franjas con desplazamiento senoidal.
- **Insertos** a pantalla completa (página, carta, libro, mano): fondo opaco (`insertBg`) y el objeto claro en `source-over`; en `multiply` se oscurece y no se lee. Texto manuscrito pre-renderizado por línea y revelado con un clip.
- **Luna y parallax:** si la cámara se desplaza mucho, la casa se mueve y la luna no; compensa la posición de la luna con `CAM.x` para que no quede detrás del tejado.

## 4. Personajes en silueta
- Esqueleto con poses nombradas (stand, ready, sit, reach, cast, raise, flinch, cower, kneel, crouch, leap, lie; duelo: DUEL, LUNGE, BLOCK, DODGE, STAGGER; gestos: CLUTCH = agarrarse la muñeca, ARMS = brazos cruzados, CUFF = esposado) e interpolación `mixP`; marcha y carrera procedurales. Proporciones por variante (adulto, mujer, niño).
- **Figura v2:** contorno suavizado con cuadráticas, capa que ondula y se abre con la velocidad (`vx`), peinado como identidad (salvaje, liso largo, hacia atrás, corto, trenza), varita con cinta.
- **Dibujo v2:** sombra de contacto + sombra proyectada sesgada hacia la luz principal; luz de hechizos **recortada al cuerpo** (degradado 0,5 → 0,12 → 0, radio ≤ 220, sin trazo de bordes: si no, parece rayos X o tiñe toda la figura).
- **Sello de facción original:** anillo + marcas que giran + runa propia en `source-over` con `shadowBlur` del color secundario; parámetros para un arco de otro color que crece (cambio gradual de bando), estallido (`flare`), sello roto/apagado (`ignite < 1`, p. ej. un expulsado), color de otra casa que sangra por la capa. Cambio de casa = interpolar colores y fundir runas en < 0,5 s.
- **Fantasmas/recuerdos:** la misma figura en `source-over` con tinta pálida (alfa ~0,3) y sin halo. Teatro de sombras: recortar con la tela iluminada y pintar con alfa ~0,45 + blur.
- **Aparecer/desaparecer:** remolino de trazos de tinta que se cierra + la figura aplastada en X y desvanecida.
- Personajes secundarios genéricos con un accesorio en `after` (sombrero de copa del auror).
- `figPt(local, x, y, s, flip, rot)` para punta de varita, muñecas, torso, cabeza. Un ángulo de varita en coordenadas locales: con `flip` se refleja.
- **No los amontones:** tras un contacto, sepáralos; cuatro siluetas negras juntas se leen como una mancha. Revisa que nadie quede cortado en el borde del cuadro.
- Todos los subtrazados con la misma orientación o el relleno nonzero deja huecos. Un mechón muy horizontal parece un cuerno.

## 4 bis. Rig nuevo (laboratorio) y cómo meterlo en películas
Detalle completo en `RIG.md` de la carpeta del usuario. Lo esencial:

- **Pose y vestido separados.** Un cuerpo es un objeto de articulaciones J: cadera, inclinación, rodillas, pies, hombro/codo/muñeca cercanos y lejanos, cabeza. Puede venir de una pose escrita, de IK (`ik2`), de un ragdoll o de un adaptador; `dressBody(J, {k, x0, y0, who, key, ticks, flip, nearPose, farPose, wand, wandTo, headK, capeLen})` lo viste siempre igual (capa, túnica, uniforme, piernas, cabeza, manos). El `flip` refleja X. `capeLen` distingue siluetas (capa pesada 1,22, corta 0,62); `WIND.x` (global, en pantalla) empuja capa y pelo e inclina su forma de reposo.
- **Cabeza 2.5D:** volúmenes unidos con *nonzero* (cráneo elipsoide, mandíbula convexa, quilla del perfil, orejas).
- **Pelo:** casquete en malla cortado en la línea del pelo, más **mantas**: telas Verlet colgadas de la línea del pelo, o de una barra en pantalla detrás de la cabeza para que no se plieguen al girar. Mechones sueltos parecen tentáculos. Chicos con volumen de casco y pocos gajos grandes (principio de forma tipo Mii, diseño propio).
- **Mano de cinco dedos** con poses mezclables:
  - la varita se coge como un puntero, en la línea del antebrazo;
  - `wandTo` lleva la punta a donde la escena la necesita;
  - con manga, sin muñeca (`noWrist`);
  - en reposo, **paralela al torso**: un antebrazo horizontal con la mano relajada se lee como una garra.
- **Telas y ragdoll:**
  - **los pasos de física se acumulan** (`acc += dt; ticks = floor(acc·60); acc -= ticks/60`), nunca se redondean: a 144 Hz el redondeo da 0 y el pelo y la capa se congelan estirados;
  - cada figura necesita una clave propia;
  - la capa colisiona con el suelo;
  - en el ragdoll, el músculo mueve la posición actual y la anterior; ~7 s para levantarse.
- **Estilos = pasadas de Canvas 2D** (tinta/silueta, papel recortado, boceto), no shaders.
- **`softFill`** usa el truco de la sombra lejana. El desplazamiento de la sombra va en píxeles: `-FAR·getTransform().a` (y `.b`), no `-FAR·U`, o con zoom sale una copia negra desplazada.
- **Niños:** cabeza ×1,38, piernas al 76 %, cabeza a distancia de adulto del torso y **todo el cuerpo baja con la cadera, manos incluidas** (si las manos se quedan arriba, brazos de T-rex).
- **Escala:** el detalle de manos y cabeza solo paga en plano medio y primer plano. Ata el escenario a la escala del personaje: el farol, más alto que la cabeza.
- **Escenas con el rig nuevo (`cine/`):** cada película es un objeto `FILM` (`DUR`, `SHOTS` con `draw(t, ticks, lt)`, `SUBS`, `CARDS`, `CHORDS`, `EVENTS`, viento, zumbido, pad). Primeros planos de manos con `bigHands`: manos grandes (s ≈ 400) y antebrazos que solo asoman.
- **Cambiar los personajes de películas ya hechas sin tocar fondos ni tiempos:**
  - sustituye la función única que dibuja a cada personaje (`dm`) por un adaptador que traduce la pose vieja a J (normaliza por el largo del torso e IK para codos y rodillas);
  - mete el motor nuevo en un IIFE (`const NR = (() => {...})()`) para que no choquen los nombres;
  - pinta en una capa con la matriz de la cámara (`sync`) y compón con el alfa de la escena.
- **Corrige las poses en su origen** (envolviendo la función que las fabrica) y no en el dibujo, así lo que la escena dibuja en la mano (cartas, libros, hilos) sigue en su sitio.
- **Tráiler o montaje de varias películas:**
  - cada una en un iframe `srcdoc` del mismo origen;
  - se le inyecta un `drive(t, dt, warm)` y se anula su `render` y su audio, para que un solo reloj las dibuje;
  - en cada corte, saltar y calentar medio segundo bajo un parpadeo de tinta;
  - zoom con CSS `scale` hasta ~1,3;
  - primeros planos, subtítulos y música en una capa encima.

## 4 ter. Fondos con mucho detalle (acuarela y papel recortado)
Detalle completo en `FONDOS.md`.
- **Geometría con significado, dos materiales:** la escena se describe una vez con piezas que saben lo que son (muro, lateral en sombra, tejado, cable, ventana, celosía, árbol, farol). Cada estilo tiene su pintor; un estilo nuevo es un pintor nuevo.
- **Profundidad:** capas con paralaje y neblina propia; primer plano que enmarca y no pasa de 1/5 del cuadro; huecos abiertos hacia el punto focal; gente diminuta para la escala.
- **Acuarela creíble:**
  - reservar el papel de cada pieza antes de lavarla, en orden de atrás adelante (ventanas incluidas);
  - dos veladuras mal registradas, borde húmedo, otro color que florece dentro, granulado solo donde hay pigmento;
  - blancos reservados;
  - plumilla con bordes perdidos para el detalle, concentrado en el punto focal;
  - reflejos a baja resolución.
- **Papel creíble:**
  - hojas con fibras y bisel;
  - sombra desenfocada sobre la capa de detrás, mayor cuanto más cerca;
  - piezas pegadas encima con sombra mínima;
  - **ventanas troqueladas con la luz detrás (caja de luz)**;
  - cielo y agua en bandas;
  - celosías troqueladas.
- **Noche:** cada capa se tiñe por separado y las luces van encima sin teñir.
- **Rendimiento:** cada capa se pinta una vez por ciudad; cada fotograma solo pega imágenes. Si la pantalla cambia de tamaño mientras se pinta, se descarta.

## 4 quater. Escenas dinámicas en perspectiva viva (estándar desde «El Invernadero»)
Código en `invernadero/`; detalles en `FONDOS.md` §9 y `LECCIONES.md`. Para una escena de acción nueva, copia `invernadero/` y cambia el decorado (`20_world`–`24_set`), la coreografía (`25_cast`), los efectos (`26_fx`, `27_fx2`) y los planos (`28_film`).
- **Cámara 3D simple:** `PJ(x, y, z)` con `CAM = {x, y, z, zoom, tx, ty}` (1 unidad ≈ 1 cm; un mago mide 180; `k = 1,8·PS(z)`). `ty` desplaza la imagen para contrapicados o para mirar un charco casi desde arriba.
- **Vivo lo que cambia; una vez lo plano:**
  - vivos: costillas, paneles, columnas que se doblan, plantas;
  - pintados una vez: muro del fondo en dos versiones (entero y roto, recorte por paneles) y suelo visto desde arriba dibujado en franjas afines (solo lo visible).
- **Reflejos exactos en charcos:** el muro del fondo con la escala Y invertida y recortado a los charcos.
- **Lista de profundidad por fotograma** (`put(z, f)`): decorado, personajes y efectos con cuerpo (losas, raíces) se ordenan juntos.
- **2D que se lee 3D:** lo que rodea a un personaje (cúpula, anillos de energía) se modela en 3D y se parte en dos: la mitad de atrás va en la lista detrás del personaje y la de delante encima. Brillo según el ángulo, giro lento y ondas por la superficie en los impactos.
- **Efectos sin estado:** cada partícula es función de t (balística, congelada, redirigida), así se puede saltar y no depende de los Hz. Las estelas de gestos se calculan con la pose en instantes pasados.
- **Variedad en lo repetido:** 3–4 formas por tipo de partícula (cristales: astilla, trozo, aguja, curva).
- **Viento:** `WIND.x` global; por mago cuando una fuente empuja hacia fuera (la esfera del choque).
- **Pies que no patinan:** al pasar el peso, la x del cuerpo y la del pie se interpolan juntas; el pie que avanza se levanta.
- **Cargas legibles:** un gesto que acumula poder necesita chispas que crecen en el cuerpo y una descarga visible; si no, parece un ataque fallido.
- **Errores ya vistos:**
  - fuego como tubo con alma de papel (mejor hebras + flor en la punta + lenguas);
  - vapor en manchas redondas (mejor columnas estrechas);
  - losas finas y claras (parecen bolsas de papel);
  - platanera en abanico desde un punto (parece hoja de marihuana);
  - helecho con tonos alternos (ajedrezado);
  - columnas de primer plano tapando el plano clave;
  - cortes con cara clara y sin ángulo;
  - brillos radiales a tope (centro blanco).

## 5. Animación, cámara y efectos
- Partículas con relajación hacia un campo de viento + ruido (pétalos, brasas, humo, gotas de tinta, chispas, escombros con rebote y polvo).
- Cámara por escena: generales, primeros planos (zoom 1,6–2,6), insertos, empujes lentos, sacudida en impactos. **Cámara lenta:** escala el `dt` de partículas y ondulaciones (`dts = dt·(1 − 0,78·slow)`) y oscurece los bordes; la coreografía sigue en T real.
- Clímax con espadas: trazo que cruza la pantalla, destello y **corte de pantalla** (dos mitades desplazadas por la diagonal con línea carmesí).
- **Magia con el motor nuevo** (preferida: pertenece al mundo de tinta y papel). Los brillos radiales y las líneas de neón son lenguaje de videojuego.
  - **Ataque:** pincelada (`inkStroke`) en arco, del color de la casa, con bordes de pigmento y el centro «levantado» a papel. Nunca un núcleo pixelado ni de neón.
  - **Impacto:** flor de tinta (`inkBloom`) en oro, bronce o plata, papel reservado en el centro y 1–2 fotogramas invertidos (`difference`). **Nunca rojo sobre un cuerpo.**
  - **Escudo:** ensō (círculo de un trazo, abierto) que **envuelve al mago entero**, centrado en el cuerpo.
  - **Maldición:** zarcillo lento que se arrastra y trepa enroscándose, no un rayo instantáneo.
  - **Hilo:** tinta sin brillo cuyo pulso levanta papel.
  - Efectos a 12 FPS.
- Magia del motor original: haz en 3 pasadas (halo, núcleo, centro blanco) con orbe; escudo de cúpula con ondas al recibir; **choque de rayos** (dos haces que se empujan en un punto; un tercero puede unirse = triple choque); energía que se acumula con chispas que convergen; varita que sale girando; tajos plateados + salpicaduras; explosión con splat naranja + figura lanzada y rotada.
- **Magia debilitada:** multiplica el alfa del haz por ruido rápido para que parpadee.
- **Hilo de un pacto:** cuadrática con caída y resplandor que late al ritmo del corazón del audio; discontinua y corriendo cuando se estira hacia alguien fuera de cuadro; anillo en la muñeca. Un nudo de anillos que giran puede «atrapar» un hechizo y desviarlo.
- Motas de luz que suben (perdón, recuerdo): dibújalas con degradado radial, no con sprites.
- Revelaciones: grieta de tinta con ramas; susurros como zarcillos; visión-mentira translúcida con blur; tríptico (tres paneles recortados con su propia cámara, que se funden en uno).
- Si el objetivo de un hechizo puede desaparecer, dale un punto de respaldo.
- Error frecuente: un helper que deja la transformación en `L0` y lo siguiente se dibuja fuera de cuadro; llama a `L(depth)` antes de cada dibujo.

## 6. Sonido procedural
Base: compresor + reverb por convolución con impulso generado. **Lechos** continuos (viento, lluvia, fuego con chasquidos, reloj, multitud, grillos, drone, tensión disonante) con `setTargetAtTime` según T; **eventos** cuando T cruza su tiempo. Silencio total justo antes del golpe del clímax. El audio arranca con el botón Comenzar. La partitura se escribe al final, cuando los tiempos ya no cambian.
- Japón: shakuhachi (ataque *meri*, escala miyako-bushi), koto Karplus-Strong, taiko, latidos, *shing*, whoosh, boom, trueno, cuervos.
- Mágico/victoriano: caja de música, arpa, cuerdas, coro por formantes (720/1150/2500 Hz), campana FM, metales, ostinato, hechizo (sierra con barrido + FM), energía que se acumula, varita rota, risa fría, golpe, jadeo, búho, pasos, chispa fallida, crack de aparición.
- **Temas por personaje o idea** y reutilizarlos con otro instrumento u octava según la emoción (infancia en caja de música, nostalgia en arpa grave; un tema frigio para la amenaza). Un acorde mayor inesperado para el momento cálido; final suspendido para «Continuará».
- Toda nota usada (incluidas las octavas graves de un tema transpuesto) debe existir en la tabla `NOTE`, ampliada con `Object.assign` antes de `auInit`; si falta, el evento falla con un AudioParam no finito.

## 7. Textos y UI
- Narración, carteles de acto, ubicación, nombres coloreados por facción, voces citadas, gritos de hechizo y títulos en capa DOM con aparición tipo tinta (`blur` → 0 + filtro SVG de bordes rugosos).
- **Legibilidad por escena:** variante clara en noche e interiores; **oscura sobre nieve, papel y cielos claros** (también para las voces). Es el fallo más fácil de pasar por alto: revisa cada texto en las capturas.
- Gritos de hechizo: texto grande con `text-shadow` del color del hechizo, entrada rápida (escala 1,25 → 1).
- Kanji verticales: un `<span>` por carácter en columna flex.
- Pantalla inicial con carga por pasos, controles autoocultables, capítulos en la línea de tiempo, teclado, «Ver de nuevo». Al cambiar la duración, actualiza los tiempos del título final, la retirada de las franjas y el tiempo total mostrado.
- Fuentes de Google con pila de reserva; para texto en canvas, espera la fuente con timeout.

## 8. Rendimiento
- Resolución interna ≤ ~1,9 Mpx, DPR ≤ 1,25; sprites grandes a calidad 0,4–0,75.
- Calidad adaptativa: si la media pasa de ~26 ms durante 3 s, quita la textura soft-light y los blur de figuras secundarias, sellos y ribetes.
- `shadowBlur` solo en protagonistas, sellos (solo el anillo exterior) y hechizos; nunca en multitudes.
- `drawImage` de muchos sprites pequeños puede dispararse a >100 ms por fotograma en algunos contextos; los degradados radiales cuestan ~1 ms. Para encontrar un pico, desactiva sistemas uno a uno en la página (`objeto.draw = () => {}`) y mide.
- La primera medición de un instante puede incluir calentamiento: repítela antes de optimizar. Sin GPU, las cifras solo sirven para comparar.

## 9. Verificación
- Modo prueba `?t=SEG` que construye, precalienta 1,5 s y expone `__seek(t)` y `__perf(n)`; Playwright captura fotogramas por escena y se revisan en hojas de contacto (varias escenas por hoja).
- Revisa en cada hoja:
  - transiciones a mitad del sangrado (¿papel en blanco?);
  - legibilidad de cada texto;
  - personajes amontonados, cortados o que faltan;
  - objetos tapados por parallax;
  - escenas demasiado oscuras o lavadas, insertos oscuros;
  - artefactos de lavado, bordes de sprite al hacer zoom;
  - haces que no aparecen, referencias `B.x` vs `B.x.sp`.
- Audio: llama a **todos** los eventos de la partitura uno por uno y recoge excepciones; después reproduce a saltos por la línea de tiempo. Comprueba que no falte ninguna nota.
- Rendimiento por instante en las escenas más cargadas.
- La primera captura puede mostrar la pantalla de inicio desvaneciéndose (es del modo prueba). Sin internet, las fuentes salen de reserva.
- **Las capturas con pasos fijos esconden los fallos de tiempo.** Reproduce unos segundos seguidos a una frecuencia real (60, 144 y 240 Hz, con algún fotograma irregular) antes de capturar, y compara: el pelo y la capa deben verse igual.
- **Con personajes del rig nuevo, revisa en un recorte a 1920×1080:**
  - manos (¿garra, T-rex, flotando?);
  - largo del cuello;
  - pelo y capa (¿congelados, en bandera, atravesando el suelo?);
  - escala frente al escenario;
  - figuras que flotan;
  - objetos que la escena pone en la mano.

  A 960 px no se ven.
- **Verifica lo que el usuario señala reproduciendo exactamente ese plano.** Sus capturas suelen venir de una pantalla de alta frecuencia y de reproducción real, no del modo prueba.
- Entregar: publicar como artifact y enviar también el `.html` completo; resumir actos y escenas y avisar de lo no verificable (balance de audio sin escuchar, FPS con GPU real, fuentes). Si existe la carpeta del usuario, copiar ahí película, código, biblia y lecciones nuevas.
