# Claude-Hollywood — todo lo aprendido

Cinco películas hechas a mano en Canvas 2D, cada una en un solo HTML sin librerías, con sonido 100 % sintetizado:

| Película | Duración | Qué estrenó |
|---|---|---|
| **Kurenai · El Último Pétalo** (samurái) | 6:26 | El motor: acuarela por deformación recursiva, sangrado de tinta, pincel con cerdas, siluetas por esqueleto, corte de pantalla, shakuhachi/koto/taiko |
| **El Juramento Roto · Ep. I (v1)** | 6:36 | Mundo mágico victoriano: castillo, capas, sellos de casa, haces de hechizo, vals en caja de música |
| **El Juramento Roto · Ep. I (v2)** | 10:25 | Figuras suaves (curvas), capa que reacciona a la velocidad, luz de hechizo sobre el cuerpo, sombras proyectadas, transiciones de tinta, duelo coreografiado con escudos y choque de rayos, cámara lenta |
| **El Juramento Roto · Ep. II · La Deuda de Sangre** | 10:12 | Hilo rojo del juramento, insertos de libro y muñecas, tríptico, aparición en remolino, fantasmas de luz, duelo a tres bandas, motas doradas |
| **El Juramento Roto · Ep. III · La Última Luna** (final) | 10:08 | Vena verde que viaja por el hilo, fases de luna, sala común bajo el lago con agua y cáusticas, ruina del páramo, cuervo, magia que se drena en motas, porche en primavera con luciérnagas |

Este documento es el manual de producción: cómo se trabaja, cómo está hecho el motor, qué falla y cómo se arregló. La versión condensada para Claude está en `skill/SKILL.md` (skill `sumi-e-canvas-film`).

---

## 1. Flujo de trabajo que funciona

1. **Guion antes que código.** Tabla de tiempos absolutos: escena, inicio, fin, transición, narración, eventos de sonido. Se escribe en la biblia (`juramento-roto/BIBLIA.md`) antes de tocar el motor.
2. **Reutilizar el motor.** Copiar la carpeta del episodio anterior y escribir solo lo nuevo: un archivo de escenarios (`02d_ep2.js`) y archivos de escenas (`06_ep2a…d.js`). El núcleo (`01_core`, `02_paint`, `03_fig`) no cambió entre el Ep. I v2 y el Ep. II.
3. **Escenarios y utilidades → escenas → textos → partitura.** La partitura va al final, cuando los tiempos ya no se mueven.
4. **Verificar con capturas por escena** (hojas de contacto), corregir, repetir. Después rendimiento y audio.
5. **Entregar:** artifact publicado + el `.html` completo + resumen honesto de lo que no se pudo verificar (balance de audio, FPS con GPU real, fuentes sin internet).

Duraciones que funcionaron: prólogo 25–30 s; tres actos; clímax en un instante (silencio → hechizo → destello); cierre de 25–30 s que queda quieto en «Fin» o «Continuará…». 10 minutos es el techo práctico por sesión: más allá, el coste de verificar cada escena crece más que la película.

---

## 2. Arquitectura del motor

Módulos concatenados por `motor/build.py` en un orden fijo. Sale un HTML completo y una variante sin doctype para publicar como artifact.

| Módulo | Contenido |
|---|---|
| `01_core` | Matemáticas, easings, `rg`, `fade`, RNG con semilla (mulberry32), ruido + fbm, sprites en **unidades** (alto de escena = 1000u, origen en el centro), cámara `L(depth)` con parallax, `L0()` = coordenadas de pantalla, `wash`, `brush`, `Bleed`, papel |
| `02_paint`, `02b_hp`, `02c_hp2`, `02d_ep2` | Generadores de escenarios pintados **una vez** en la carga |
| `03_fig`, `03b_mage` | Esqueleto paramétrico → `Path2D`; vestuario de mago, sellos, luz y sombra sobre la figura |
| `04_audio`, `04b_music` | Primitivas de síntesis; instrumentos del mundo; `auBeds` (lechos continuos) y `score` (eventos) |
| `05_fx`, `05b_magic`, `05c_duel` | Partículas, lluvia, aves, hierba; haces, orbes, chispas; escudos, choque, escombros |
| `06_*` | `scene(t0, t1, fadeIn, fadeOut, {tin, enter, draw})`, `CUES`, `CHAPTERS` |
| `07_main` | Bucle, postproceso, textos DOM, controles, modo prueba `?t=` |

Reglas de oro:
- **Todo es función del tiempo absoluto T.** Así se puede saltar en la línea de tiempo y capturar cualquier fotograma. Lo que tiene estado (partículas) se limpia en `enter()`.
- **Composición:** papel `source-over` → pintura `multiply` → luz y brillos `source-over` → textura `soft-light` → viñeta `multiply` → franjas de cine.
- **Todo lo que brilla va en `source-over`** (velas, luna, sellos, hechizos, fuego). En `multiply` no se ve sobre fondo oscuro.
- Antes de dibujar llama a `L(depth)`: un helper que deja la transformación en pantalla (`L0`) manda lo siguiente fuera de cuadro.

### Transiciones de tinta (`tin`)
La escena nueva se dibuja en un búfer y se enmascara con un mapa de tiempo de llegada a 1/6 de resolución (`bleed`, `bleed2`, `sweep`, `down`) con un anillo de tinta en el frente.
**Regla aprendida en el Ep. II:** la escena anterior debe durar al menos hasta `t0 + fadeIn` de la nueva, y con `fadeOut` corto (0,5 s). Si termina antes, la transición revela **papel en blanco** a mitad del sangrado.

### Cámara
`CAM = {z, x, y}` por escena; planos generales, primeros planos (z 1,6–2,6), insertos a pantalla completa (`insertBg` + objeto), empujes lentos, sacudida `SHK`, destello `FLASH`/`FLASHC`. Cámara lenta: escalar `dt` de partículas y ondulaciones (`dts = dt * (1 − slow * 0,78)`) sin cambiar la coreografía.

---

## 3. Acuarela

- **Lavado por deformación recursiva** (Tyler Hobbs): polígono → `deform` → 15–30 capas de alfa 0,04–0,09. Siempre `densify` (aristas ≤ 36u, 24u en arquitectura) y `gauss` limitado a ±2; si no, salen cuñas y picos fantasma.
- **Arquitectura:** `amt` ~0,03 y pocas capas → bordes rectos pero suaves. Arco ojival equilátero. Ventanas recortadas con `destination-out` para ver el cielo detrás.
- **Nieve sobre tejados:** `destination-out` en bandas sobre el sprite deja ver el papel = nieve. Una baranda rota: recortar y **volver a pintar el muro detrás**, o queda un rectángulo blanco.
- **`Bleed`** (sangrado): mapa de llegada (distancia a semillas + fbm) a baja resolución; máscara `destination-in` + anillo húmedo `source-atop`. Modo `inv` = papel que se quema (cartas ardiendo).
- **Pincel:** cuerpo de ancho variable + 6–16 cerdas; pincel seco por umbral de ruido; semilla fija.
- **Recolorear un sprite** (fuego naranja → fuego verde de la mansión Malfoy): una vez en la carga, `getImageData` y permutar canales.
- **Los sprites son translúcidos:** el suelo no tapa la luna ni el muro tapa lo de detrás. Para ocultar algo hay que subir la opacidad del lavado (más capas, más alfa) o hacerlo aparecer con un fundido, no confiar en que «quede detrás».
- **Insertos claros sobre fondo oscuro** (libro, carta): dibujar el objeto en `source-over`. En `multiply` la página clara se oscurece y no se lee.

---

## 4. Personajes

- **Esqueleto** con poses nombradas (stand, DUEL, LUNGE, BLOCK, DODGE, STAGGER, KNEEL2, SIT, REACH, CAST_P, RAISE, FLINCH, COWER, CLUTCH, ARMS, CUFF…), interpolación `mixP`, marcha `walkW(x)` y carrera `runP`.
- **v2 (`mage`)**: contorno suavizado con cuadráticas (`sPoly`), capa que ondula y se abre con la velocidad (`vx`), peinados como identidad (wild, sleek, swept, short, braid), varita con cinta (`thread`).
- **`drawMage`**: sombra de contacto + sombra proyectada sesgada hacia la luz principal (`shadowFrom`); luz de hechizos **recortada al cuerpo** (`light: [{x,y,c,r,a}]`); ribete de capa y **sello de casa original** (anillo, marcas que giran, runa propia, `green` = arco verde que crece, `flare` = estallido, `ignite < 1` = sello roto/apagado, usado para Damien expulsado; `trimK` = el verde sangrando por la capa).
- **Fantasmas** (niños del recuerdo): la misma figura dibujada en `source-over` con tinta pálida (`ink`, `inkA` ~0,3) y sin halo.
- **Aparecer y desaparecer:** remolino de trazos de tinta que se cierra (`appar`) + la figura aplastada en X (`scale(1 − k, 1)`) y desvanecida.
- Auror = figura genérica con sombrero de copa en `after`.
- Puntos del cuerpo en el mundo con `figPt` (punta de varita, muñeca `W1`, torso `T`).
- **No amontonar personajes:** después de un contacto, separarlos (empujones del hechizo, pasos atrás). Cuatro siluetas negras juntas se leen como una mancha.
- Todos los subtrazados con la misma orientación o el relleno *nonzero* deja huecos.

---

## 5. Magia y duelos

- **Haz:** 3 pasadas (halo ancho, núcleo de color, centro blanco) con onda y orbe en la cabeza. **Choque:** dos haces que se empujan en un punto; en el Ep. II un tercer haz entra al punto de choque (triple choque).
- **Escudo:** cúpula elíptica con anillos internos y ondas de impacto.
- **Impacto:** chispas + escombros con rebote + polvo.
- **Hechizo débil** (luna llena): alfa multiplicado por ruido rápido `weak(T, k)` → el haz parpadea.
- **El hilo rojo** (`hilo`): cuadrática con caída, doble pasada con resplandor, latido sincronizado con el corazón del audio; trazos discontinuos que corren (`gap`) cuando se estira hacia alguien fuera de cuadro; `wristRing` para el anillo en la muñeca.
- **La maldición atrapada:** el haz verde se detiene en un nudo de anillos rojos que giran y se desvía hacia el cielo; el farol estalla; la varita robada se parte.
- **Motas doradas** del perdón: partículas que suben, dibujadas con degradado radial (ver rendimiento).
- La regla de mundo que hace interesante el clímax del Ep. II: **todo hechizo contra otro de los tres hiere también al que lo lanza.**

---

## 6. Sonido procedural

Base: compresor + reverb por convolución con impulso generado. **Lechos** continuos (viento, lluvia, fuego con chasquidos, reloj, multitud, grillos, drone, tensión) con `setTargetAtTime` según T. **Eventos** cuando T cruza su tiempo. Silencio total justo antes del golpe del clímax. El audio arranca con el botón Comenzar.

Instrumentos: shakuhachi, koto (Karplus-Strong), taiko, caja de música, arpa, cuerdas, coro por formantes, campana FM, metales, ostinato, hechizo (`zap`), energía que se acumula (`hum`), varita rota (`snap`), risa fría, golpe, jadeo, búho, cuervos, pasos, chispa fallida (`fizz`), crack de aparición (`crackA`).

Temas de la serie:
- **THEME_A** — vals de la infancia en Re menor (caja de música; en arpa grave para la nostalgia).
- **THEME_B** — respuesta del vals.
- **THEME_D** — tema de Draconida (dórico).
- **THEME_X** — tema de la deuda (Re frigio: D Eb D C Bb A).
- Un acorde mayor inesperado para el momento cálido (el perdón: D F# A).

**Errores de audio aprendidos:** una nota que no está en `NOTE` produce un `AudioParam` no finito y rompe el evento sin aviso. Ampliar `NOTE` con `Object.assign` antes de `auInit` y comprobar con `herramientas/notas.js` y `herramientas/audio.py` (dispara los 170 eventos uno por uno). No llamar a ninguna función gráfica igual que una de audio (`drop` ya existe en audio).

---

## 7. Textos e interfaz

- Capa DOM: narración, carteles de acto, ubicación, voces, gritos de hechizo (`spell` con clases S/A/X/C/O/P), título del prólogo y título final.
- **Legibilidad según el fondo de cada escena:** texto claro (`light`) en noche e interiores; **texto oscuro sobre nieve y papel**. Las voces tienen variante oscura (`.voice:not(.light)`). Revisar cada escena en capturas: es el error más fácil de pasar por alto.
- Al cambiar la duración: actualizar en `07_main.js` los tiempos del título final (`s1…s6`) y la retirada de las franjas, y el tiempo total en `shell.html`.
- Fuentes de Google con pila de reserva; para texto dibujado en canvas, esperar la fuente con tiempo límite. Sin internet (o en el entorno de pruebas) salen las de reserva.

---

## 8. Rendimiento

- Resolución interna ≤ ~1,9 Mpx, DPR ≤ 1,25; sprites grandes a calidad 0,4–0,75.
- Calidad adaptativa `LOWQ`: si la media de fotograma pasa de ~26 ms durante 3 s, se quitan la textura soft-light y los blur de figuras secundarias y sellos.
- `shadowBlur` es caro: solo en protagonistas, sellos y hechizos; en el sello, solo el anillo exterior.
- **Hallazgo del Ep. II:** partículas dibujadas con `drawImage` de un sprite pequeño llegaron a costar 110 ms por fotograma en ciertos contextos; dibujarlas como degradados radiales bajó a 1 ms. Si un instante va lento, desactiva sistemas uno a uno en la página (`B.motes.draw = () => {}`) hasta encontrar el culpable.
- La primera medición de un instante puede incluir un pico de calentamiento: repetir antes de optimizar.
- Sin GPU real las cifras solo sirven para comparar entre escenas o versiones.

---

## 9. Verificación

- Modo prueba `?t=SEG`: construye, precalienta 1,5 s y expone `__seek(t)` y `__perf(n)`.
- `herramientas/capturas.py` + `hoja.py` → hojas de contacto por escena. Revisar:
  - transiciones a mitad del sangrado (¿papel en blanco?),
  - legibilidad de cada texto,
  - personajes amontonados o fuera de cuadro,
  - objetos tapados por parallax (la luna detrás del tejado al mover la cámara: la luna debe compensar el desplazamiento de cámara),
  - escenas demasiado oscuras o lavadas,
  - insertos oscuros, haces que no aparecen, referencias `B.x` vs `B.x.sp`.
- `herramientas/audio.py`: todos los eventos + reproducción a saltos.
- `herramientas/rendimiento.py`: coste por instante.
- La primera captura puede mostrar la pantalla de inicio desvaneciéndose: es del modo prueba, no un fallo.

---

## 10. Catálogo de errores y arreglos

| Síntoma | Causa | Arreglo |
|---|---|---|
| Cuñas y triángulos fantasma en lavados | Aristas largas al deformar | `densify` ≤ 36u, `gauss` ±2 |
| Huecos en siluetas | Subtrazados con orientación distinta | Corregir por el signo del área |
| Personaje desaparece | Helper dejó la transformación en pantalla | `L(depth)` antes de cada dibujo |
| `SPELL is undefined` | `Object.assign(SPELL…)` en un módulo cargado antes | Moverlo a un módulo posterior (`05c`) |
| Luces con aspecto de rayos X | Trazo de los bordes de subtrazados | Sin trazo; menos alfa y radio ≤ 220 |
| Personajes teñidos por completo | Luz demasiado intensa | Degradado 0,5 → 0,12 → 0 |
| Estallido de la Selección en rojo/dorado | Cambio de casa demasiado lento | Interpolar la casa en 0,45 s |
| Texto ilegible | Variante clara sobre fondo claro (o al revés) | Elegir variante por escena |
| AudioParam no finito | Nota inexistente en `NOTE` | Ampliar `NOTE`; `notas.js` |
| Papel en blanco a mitad de transición | La escena anterior terminaba antes de `t0 + fi` | `t1 ≥ t0_nueva + fi`, `fo` 0,5 |
| Libro/carta oscuros en el inserto | Dibujados en `multiply` sobre fondo oscuro | `source-over` |
| Luna «eclipsada» por el tejado | Parallax: la cámara mueve la casa y no la luna | Compensar la posición de la luna con `CAM.x` |
| Muro que deja ver el castillo de detrás | Lavado demasiado transparente | Más capas y más alfa |
| Rectángulo blanco en la baranda rota | `destination-out` dejó ver el papel | Repintar el muro detrás |
| Personajes amontonados | Posiciones finales demasiado cercanas | Separarlos tras el contacto |
| Escena a 110 ms por fotograma | `drawImage` de partículas | Degradados radiales |
| Choque de nombres | `drop()` gráfico vs `drop()` de audio | Renombrar (`inkDrop`) |

---

## 10 bis. Lo aprendido en el Episodio III

- **Amontonar personajes otra vez fue el fallo principal.** Al juntar cuatro figuras arrodilladas en una escena emotiva se fundieron en una mancha. Regla práctica: ≥ 150u entre figuras arrodilladas y ≥ 110u entre figuras de pie; si dos se tocan (una mano tendida), que el resto esté lejos.
- **Fases de luna:** recortar el sprite de la luna con dos clips (disco de la luna y, con `evenodd`, un rectángulo menos un círculo desplazado). Tapar con un círculo de color de papel o de cielo se nota.
- **Brillo verde por personaje (dolor):** fácil de pasarse; con varios personajes a la vez se convierte en manchas. Radio ~50u y alfa ≤ 0,55.
- **Agua tras una ventana:** degradado + líneas onduladas claras (cáusticas) + pocas algas cortas; muchas algas verticales parecen barrotes.
- **Una chimenea recortada con `destination-out` deja ver el papel blanco**: píntala oscura y pon el fuego encima.
- **Ruinas y muros que deben tapar la luna:** más capas y alfa; con el valor por defecto la luna se ve a través.
- **Picos de rendimiento al medir:** 100 ms en un instante que, tras 5 fotogramas de calentamiento, costaba 3 ms. Mide siempre después de calentar (`__perf(5)` y luego `__perf(20)`).
- **Partículas de luz:** dos círculos (halo suave + núcleo) son más baratos que un degradado por partícula; limita el número (≈ 250).
- **Prueba de audio:** los 121 eventos del Ep. III pasaron sin errores a la primera porque `notas.js` se ejecutó antes.

## 11. Contenido y propiedad intelectual

- No se dibujan escudos oficiales, logos ni personajes conocidos (el Sombrero Seleccionador solo como voz y luz). Los sellos de casa son **diseños originales** en los colores de cada casa. Nombres, Hogwarts y hechizos sí aparecen en la narración.
- La violencia se insinúa (mancha de tinta roja, corte de pantalla, figura que sale despedida), nunca es gráfica.
- Los personajes no tienen rostro: se reconocen por el pelo, el porte y el sello.

---

## 12. Dirección y narrativa

- **Motivos que abren y cierran:** tres gotas de sangre (dos rojas, una verde), el hilo rojo, la cinta verde de Draconida, el porche y el farol de York, la carta medio quemada.
- **Callbacks** pagan: la roca de la orilla desde donde Draconida miraba (Ep. I) es donde por fin se sienta a su lado (Ep. II); «le pidió el brazo» (Ep. I) → «fue ella quien lo levantó» (Ep. II); los fantasmas de los niños bajo el mismo farol.
- **Una regla de mundo clara hace el clímax:** la luna llena apaga la magia; cada hechizo contra los otros vuelve al que lo lanza; el juramento no deja que se maten.
- **Finales abiertos con una pregunta concreta** para el siguiente episodio: dos hilos siguen rojos y Damien sigue suelto.

### Cómo se resolvió en el Episodio III · *La Última Luna*
- La maldición quedó atrapada en el hilo; no puede matar a uno de los tres, así que busca a quien se ató sin ser de los tres: Draconida (por la cinta). Joy le entrega su magia para ganar tiempo; Anami perdona a Damien y el juramento se rompe. Damien, por primera vez, no huye. Joy enciende el farol con una cerilla.
- Lección de guion: la solución salió de piezas que ya estaban en pantalla (la cinta, el perdón pendiente, la regla del hilo). Antes de inventar algo nuevo para resolver un final, revisar lo que ya se sembró.

### (Notas previas al Episodio III)
- El libro dice «…o cuando uno de los tres deje de respirar», pero el hilo impidió la maldición: el Ep. III tiene que explicar **qué cobra realmente la deuda**.
- Joy sigue atada a Damien; Anami también. ¿Quién perdona a quién, o qué precio se paga?
- Validado por Nico en su PC (14-10-2026): imagen, sonido y fluidez del Ep. II sin problemas; el final dejó intriga, que era el objetivo.
- Nico quiere episodios más largos (hasta 30 min) cuando tenga el plan Max: dividir en partes de ~10 min que compartan el motor y la biblia.

---

## 13. Laboratorio · fase 1 (rostro, manos, cuerpo, estilos)

Código en `laboratorio/src`, plan en `PLAN.md`. Lo que funcionó y lo que falló al construirlo:

- **Cabeza 2.5D = volúmenes unidos, no un dibujo que se deforma.** Cráneo (elipsoide, contorno exacto con la matriz P·Pᵀ), mandíbula (envolvente convexa de puntos 3D), «quilla» del perfil (frente-nariz-labios-mentón en el plano medio) y orejas. Se proyectan y se rellenan juntos con la regla nonzero (todos los polígonos con la misma orientación). De frente la quilla mide cero y desaparece; de perfil aparece sola.
- **El pelo no puede ser una envolvente convexa**: tapaba la frente. Se hace como malla sobre un elipsoide algo mayor, cortada en la línea del pelo y descartando los cuadros que miran hacia atrás. El grosor del pelo debe ir a 1,0 en la línea del pelo; si no, sale una visera.
- **Los cuadros de una malla no se suavizan**: el suavizado con cuadráticas redondea cada cuadro y abre agujeros. `pathOf` solo suaviza polígonos de más de 4 puntos.
- **Sombra de forma = forma menos copia desplazada hacia la luz.** Con pasadas escalonadas se ven bandas. El borde suave sale con el truco de la sombra lejana: dibujar la forma 20 000u fuera y traer solo su `shadowBlur` con `shadowOffsetX` (en píxeles, no le afecta la transformación). Sirve para el núcleo de sombra, la luz de borde, las cuencas de los ojos y la sombra de la nariz.
- **Contorno solo por fuera de una unión:** trazar primero y rellenar después; el relleno tapa la mitad interior del trazo y las líneas internas (círculos de las articulaciones, borde del cráneo dentro de la cara).
- **Un relleno al 96 % deja ver lo de debajo** (fantasmas de las cápsulas). Las siluetas, al 100 %.
- **Línea de papel entre dedos:** trazar con el propio papel del fondo como patrón alineado a la pantalla (`DOMMatrix([1/U,0,0,1/U,-W/2U,-H/2U])`). Sin ella, un puño en silueta es una mancha.
- **Pulgar:** en vista lateral se apoya delante del puño casi horizontal; si se dobla como los demás dedos, cuelga como una salchicha.
- **Textura de acuarela en figuras:** un patrón pegado al personaje (`setTransform` con su ancla) y en espejo ×4 para que no se vean costuras.
- **Orden de capas:** el cuello va antes que el busto; si va después, su rectángulo se ve sobre la ropa en el estilo boceto.
- **Mechones sueltos = tentáculos** (lo vio Nico). El pelo funciona como **manta**: una tela Verlet (filas × columnas, rigidez que baja hacia abajo, restricción horizontal entre columnas) colgada de anclas, que se pinta de una vez y se «corta» (recto, puntas, flecos) para cada peinado. La capa usa el mismo `clothStep`.
- **Una manta anclada a lo largo de la nuca en 3D se pliega al girar la cabeza** (las anclas se cruzan en pantalla y sale un lazo retorcido). La manta trasera cuelga de una **barra en pantalla** detrás de la cabeza, cuyo ancho se encoge con |cos(giro)|. Las mantas delanteras abarcan poco ángulo (3 anclas) y no se pliegan.
- **Orden del pelo:** trasera antes del busto · delantera después del busto y antes de la cara (enmarca sin taparla) · flequillo encima. Si la delantera mira de frente al espectador (nz > 0,72), pasa encima de la cara.
- **Abrir la manta con mesura:** con apertura alta el pelo salvaje parece un sombrero de ala en silueta.
- **Pelo de chico con volumen** (principio de forma de los avatares tipo Mii, sin copiar peinados): casquete bastante mayor que el cráneo que no se aplana hasta muy cerca de la línea del pelo (exponente `vol` 4), y **pocos gajos grandes**: flequillo de 5 gajos ladeado hacia donde mira, corona de puntas hacia arriba (`dy` negativo), mechones sobre las orejas. Damien: tupé como manta que sube y se va hacia atrás.
- **Las puntas se redondean** con el suavizado por cuadráticas y parecen gotas. Los vértices marcados como afilados (`[x, y, true]`) se dibujan con `lineTo`; el corte en puntas los marca.
- **Una manta delgada vista de canto desaparece** (el tupé de Damien de perfil). Ahí manda el casquete; pendiente si hace falta más.
- **Medir:** en Chromium sin GPU el coste aparece donde se fuerza el dibujo (cada pasada en el lienzo auxiliar), no donde se hace el trabajo. Por eso el laboratorio muestra también los FPS reales del navegador, que es la cifra que vale.
- **Lo que decide la escala:** a 30u una mano de cinco dedos y una manopla se ven igual. El detalle nuevo solo paga en plano medio y primer plano.

- **Varita:** se coge como un puntero (foto de referencia de Nico): índice estirado a lo largo, pulgar al lado, los otros tres dedos la envuelven y el mango asoma bajo el meñique. La varita va en la línea del antebrazo, no perpendicular.
- **Pose y vestido separados:** el cuerpo sale de articulaciones J; la IK o la física las rellenan y `dressBody` las viste igual (capa, túnica, cabeza, manos). Así el ragdoll no duplica nada y el flip (mirar a la izquierda) es reflejar X.
- **Ragdoll activo:** el «músculo» debe mover a la vez la posición actual y la anterior de cada partícula (mezcla cinemática). Si solo tira de la actual, Verlet lo convierte en velocidad y el personaje sale saltando al levantarse.
- **Dónde se levanta:** fijar la posición de «casa» una vez, cuando el músculo empieza a volver; si sigue a la cadera actual, el cuerpo deriva solo.
- **Ritmo de la recuperación** (Nico): menos de 4 s se siente falso. Ahora: 2 s en el suelo, luego 5 s de músculo que vuelve, pasando por una pose agachada antes de ponerse de pie (≈ 7 s en total).
- **El cuello debe salir de la cabeza física**, no del torso; si no, al separarse la cabeza queda flotando. Largo de los huesos = distancias exactas de la pose de pie.
- **Tela con suelo:** sin colisión con el suelo, la capa de un cuerpo tumbado cuelga atravesando el piso.
- **Impacto sugerido:** polvo claro que se abre + astillas oscuras con parábola + temblor de cámara (en `T0`, para que el lienzo auxiliar tiemble igual). Nada de sangre.
- **Efectos: los brillos radiales y las líneas de luz son lenguaje de videojuego**; en tinta y papel desentonan. El hechizo como pincelada (`inkStroke`: cuerpo + cerdas + pincel seco) sí pertenece al mundo.
- **El centro del trazo:** continuo y nítido parece neón; a rayas, una carretera; en vetas finas con el patrón del papel se ve pixelado (Nico). Lo que funciona es lo de la acuarela real: bordes con pigmento acumulado (trazo oscuro fino) y el centro «levantado» con un relleno claro desenfocado.
- **Nunca una flor roja sobre un cuerpo**: se lee como sangre. Los impactos usan el color secundario de la casa (oro, bronce, plata) y papel reservado en el centro.
- **Fotograma de impacto:** `difference` con el color del papel sobre la franja durante 1–2 fotogramas a 12 FPS. Barato y muy efectivo.
- **Forma por tipo de hechizo:** ataque en puntas (estrella), escudo como ensō (el círculo zen de un solo trazo, abierto), maldición como zarcillo lento que se arrastra y trepa enroscándose. El tiempo también es forma: la maldición crece despacio, el ataque es seco.
- **Rendimiento real (Nico, 14-10-2026):** 144 FPS y ~2 ms de dibujo en su PC con la pestaña Física; los ~30 ms de las pruebas son de Chromium sin GPU.
- **`softFill` dibuja con el color de la sombra, no con el del relleno.** Si no se le pasa color, sale negro aunque el `fillStyle` sea claro (el núcleo del hechizo salió oscuro por esto).
- **Nunca `lerp` con puntos:** `lerp([x,y],[x,y],t)` da `NaN`, y el navegador se salta esos vértices sin avisar: el faldón se estiraba hasta el borde de la pantalla al mover la mano. Para puntos, una función propia (`lerp2`).
- **Escudo:** el ensō debe encerrar al mago entero (Nico); un aro pequeño delante se lee como un objeto, no como protección.
- **Maldición ≠ maldición asesina:** el zarcillo lento que trepa sirve para maldiciones que dañan con el tiempo; un rayo que mata de golpe necesitaría otro lenguaje (y en esta serie se insinúa, no se muestra).
- **Estilos = pasadas de dibujo, no shaders de GPU.** Hacen el papel de un shader (misma geometría, distinta forma de pintarla), pero son funciones de Canvas 2D. Papel y boceto cuestan más (borde dentado densificado, tramas) que la tinta.
- **Mano y manga:** el muñón de la muñeca va corto (0,16 de la mano) y la manga se dibuja encima terminando en la muñeca. Con el muñón largo y la manga debajo, en papel recortado la mano parece flotar (Nico).
- **Mano que «flota» en papel recortado:** el muñón de muñeca se dibujaba encima de la manga y la sombra de cada pieza lo despegaba. Con manga, la mano va sin muñeca (`noWrist`) y la manga se dibuja encima hasta el puño.
- **Personalidad en el rig:** cada personaje puede llevar un gesto fijo (`tilt`: cabeza ladeada), accesorios que definen la silueta (aros: anillos 3D casi laterales, de canto de frente y redondos de perfil) y color de pelo para los estilos con color (`hairCol`).
- **Mechones delanteros que tapan la cara:** si una manta delantera mira al espectador, empujarla hacia atrás respecto a la cara (`bf` negativo); y estrechar sus anclas para que empiece en la sien, no cerca del centro.
- **Cuello de camisa y corbata:** se dibujan antes que la túnica; la túnica, con la V recortada, los enmarca y recorta lo que sobresale al girar.

### Primera escena con el motor nuevo · «El Perdón» (Ep. III, 7:26)
- **Plano general en silueta, primeros planos en lavado con sombra:** la serie conserva su identidad en los planos abiertos y la luz esculpe las caras sin rasgos en los cerrados.
- **El primer plano de manos es el corazón de la escena:** las manos que se acercan con el hilo entre las muñecas y el oro que nace en el apretón cuentan el perdón sin palabras. Era imposible con la manopla.
- **La luna detrás de la fachada no se ve:** revisar que lo importante del cielo caiga en el hueco entre los postes. Fachadas opacas (~0,97); a 0,78 se transparentan.
- **El farol en medio de los personajes corta la composición:** en planos cerrados, moverlo detrás de uno de ellos (contraluz).
- **Nieve sin estado** (posición = función del tiempo) permite saltar a cualquier instante para las capturas.
- **Sonido guiado por el tiempo de la escena:** parámetros continuos (viento, pad, zumbido de la maldición que se apaga con ella) y eventos al cruzar un instante (campanas, chispas). Pausar o saltar no rompe nada.

### Tráiler y «El Perdón» v2 (15-10-2026)
- **Primeros planos de cara: todavía no** (Nico). Con el motor actual se ven raros; se cambian por **planos medios en silueta** (figura grande, recortada por abajo, luz de borde), que es donde el motor brilla.
- **Manos en primer plano: la cámara cerca de las manos**, que solo asomen los antebrazos desde el borde. Brazos largos con manos pequeñas se ven raros.
- **Escala del escenario atada a la de los personajes:** el porche se dibuja en función de `k` (techo ≈ 1,5 alturas, postes cada ≈ 2,6 alturas, farol ≈ 1,15 alturas). Un farol más bajo que la cabeza delata el error de escala enseguida.
- **Película = objeto FILM** (planos, subtítulos, rótulos, acordes, eventos, viento, zumbido) sobre un motor común; el tráiler y la escena comparten todo lo demás.
- **Para capturar un instante con física hay que simular desde el inicio del plano** (`__seek` calienta desde `t0` del plano), si no el ragdoll y las telas no están donde deberían.
- **El epílogo de primavera es de tres, no de cuatro:** Damien se entregó a los aurores. Revisar la biblia antes de poner a alguien en un plano.

### Cambio de personajes y tráiler v2 (15-10-2026)
- **Lo más débil del tráiler v1 eran los fondos** (Nico): rehechos a mano para el motor nuevo perdían todo el detalle de la acuarela. Solución: no rehacer escenas, **cambiar solo los personajes** de las películas originales.
- **Un solo punto de entrada para los personajes:** las películas viejas dibujan a cada mago con `dm()`. Sustituir esa función (adaptador `nr_adapter.js`) basta para que las tres películas usen el rig nuevo: la pose vieja (cadera, torso, hombros, manos, pies, cabeza) se traduce a articulaciones nuevas con IK para codos y rodillas. Fondos, cámara, música, efectos y sellos quedan intactos.
- **Dos motores en una página:** el laboratorio va dentro de `const NR = (() => {...})()` para que sus nombres no choquen con los del motor viejo. Se dibuja en una capa aparte con la transformación de la cámara (`sync`) y se compone con el alfa de la escena.
- **Sombras de `softFill` con zoom:** el desplazamiento de la sombra va en píxeles de pantalla; hay que multiplicarlo por la escala real del contexto (`getTransform().a/.b`), no por `U`. Con la cámara de las películas (zoom) salían figuras negras duplicadas arriba a la izquierda. Arreglado también en el laboratorio.
- **Sellos de casa mixtos** (`{a, b, k}` mientras cambian de casa) rompían el rig nuevo: el adaptador elige la casa visible (`nrHouse`).
- **Tráiler que «conduce» películas:** cada episodio va en un iframe del mismo origen y el tráiler les dice en qué segundo están y las dibuja él (`__ctl.drive`), así todo va sincronizado con un solo reloj y sin sonido propio. Los primeros planos van en una capa encima con el motor nuevo.
- **Al saltar, calentar medio segundo** (varios fotogramas antes del corte) para que partículas y telas estén en su sitio; el parpadeo de tinta del corte lo tapa.
- **Zoom de cámara con CSS** (`scale` lento sobre el iframe) acerca a personajes pequeños sin re-renderizar; por encima de ~1,3 se nota blando.
- **Juramento de los niños sin posición rara:** primer plano de tres manos con un corte en la palma; la sangre baja por los dedos, las tres gotas se juntan donde se tocan las yemas y caen como una sola (las dos ideas de Nico juntas). La gravedad manda: las gotas no suben.
- **Los hechizos de las películas (texto DOM) se dejan visibles** en el tráiler; el resto del texto se oculta y los subtítulos los pone el tráiler.

### Arreglos tras la revisión de Nico (15-10-2026)
- **Pelo y capa congelados a 120/144 Hz:** los pasos de física se calculaban redondeando el tiempo del fotograma a pasos de 60 Hz. A 144 Hz cada fotograma dura 0,42 pasos → redondeo 0 → la tela nunca avanzaba y se quedaba estirada como una bandera. Ahora se acumula el resto entre fotogramas (como el reproductor del laboratorio). **Probar siempre a 60, 144 y 240 Hz** (`dbg/hz.py`): en las capturas de prueba (pasos fijos) el fallo no se ve.
- **Manos en «garra»:** la pose «de pie» del motor viejo lleva el antebrazo hacia delante en horizontal; con mangas anchas parecía reposo, con manos de verdad es una garra. Si el brazo cuelga (no hay gesto), el antebrazo se estira paralelo al torso. Se corrige en la pose (`mage`), no en el dibujo, para que cartas, libros e hilos que van en la muñeca sigan a la mano.
- **Magia con el material nuevo:** `beam`, `orb`, `shield`, `hilo`, `vein` y `wristRing` se sustituyen por pincelada con alma de papel, flor de tinta, ensō que envuelve al mago entero (centrado en el cuerpo, no en la punta de la varita) e hilo de tinta sin brillo. Los tiempos de cada escena no cambian.
- **Queda en estilo viejo:** efectos que cada escena dibuja a mano (estallido de la Selección, motas, chispas, brillos de luz), los insertos de manos de las películas y los niños del fuerte de sábanas.
- **Cuellos larguísimos en los niños (Ep. I):** el motor viejo hace a los niños con torso corto (21) pero la cabeza a distancia de adulto; el adaptador escala el torso a talla de adulto y estiraba también el cuello un 50 %. La cabeza se coloca ahora a distancia de adulto del torso (a los adultos no les cambia nada).
- **Niños que se leen como niños:** piernas al 76 % (la cadera baja y el cuerpo con ella) y cabeza 1,38 veces más grande (`headK` en `dressBody`), con el pivote de la cabeza a distancia de adulto (subirla más alargó el cuello otra vez). **Las manos bajan con el cuerpo**: la primera versión las dejaba donde estaban para no despegar los objetos que sostienen y los brazos se doblaban hacia el pecho como un T-rex (Nico). Lo que la escena dibuja en la mano (`after`) y el sello se desplazan lo mismo.
- **Fantasmas de los niños (Ep. II y III)** también con el rig nuevo: tinta clara y translúcida (`ghostKids` llama a `dm` con `ink`).

> Manual de uso del rig nuevo, el adaptador y el tráiler: `RIG.md`.

> Fondos con mucho detalle (acuarela y papel recortado, «Atlas de ciudades»): `FONDOS.md`.

### «El Invernadero de Cristal y Ceniza» (15-10-2026)
Prueba de 3:00 con todo lo nuevo: el rig, la magia de tinta y fondos con mucho detalle. Es un duelo de dos magos en un invernadero victoriano bajo la tormenta. Código en `invernadero/`, película en `peliculas/el-invernadero-de-cristal-y-ceniza.html`, guion en `invernadero/GUION.md`.

**El escenario**
- **Interior en perspectiva viva en vez de capas planas.** Con una cámara de verdad (`PJ(x, y, z)`: x a lo largo de la nave, z en profundidad, una unidad ≈ 1 cm), el paralaje sale solo y la cámara puede ser baja, hacer contrapicado (desplazando la imagen con `ty`) o un travelling sin repintar nada.
  - Lo que se rompe o se dobla se dibuja vivo cada fotograma: costillas del techo, paneles, columnas, plantas.
  - Lo plano se pinta una sola vez: el muro de cristal del fondo y el suelo visto desde arriba.
- **El suelo en perspectiva con Canvas 2D:** se pinta visto desde arriba y se dibuja en franjas horizontales. Cada franja es afín y lleva su propia escala.
  - Las franjas se reparten solo por lo visible del suelo; si no, cerca de la cámara quedan muy altas y sale un suelo «de ladrillos» roto.
  - Hay dos texturas: una cercana más densa y otra lejana.
- **Muro de cristal = dos sprites (entero y roto).** Se dibuja el roto y encima el entero recortado a los paneles que siguen enteros. Romper paneles es cambiar la lista del recorte.
  - El reflejo en los charcos es ese mismo muro con la escala Y invertida: es exacto y cuesta un `drawImage`.
- **El rayo atraviesa el vidrio sucio:** papel en «screen» solo dentro de los paneles, y el hierro queda negro. Las siluetas a contraluz salen solas.
- **La luz de las ventanas en el suelo** son los paneles proyectados con la dirección de la luz. Las «sombras líquidas» son una textura de regueros que se desplaza en z (en el cristal las gotas bajan, así que su sombra se aleja de la cámara).
- **Pasillo central con baldosas hidráulicas en diagonal y cenefa:** da perspectiva y lugar. Las losas lisas en hileras se leían como tablones.
- **Plantas reconocibles:**
  - una platanera con las hojas en abanico desde un punto parece una hoja de marihuana; las hojas tienen que salir a alturas distintas del tallo y arquearse;
  - en los helechos arborescentes, los folíolos de dos tonos alternos hacían un ajedrezado: el tono va por la cara de arriba o la de abajo, no alterno.
- **No pongas columnas de primer plano donde caen los planos importantes:** una tapó el golpe a la columna principal. Hay que revisar las posiciones con las cámaras de todos los planos.

**Efectos (todos en función del tiempo, sin estado: se puede saltar)**
- **Fuego líquido:** la primera versión era un tubo naranja con alma de papel («salchicha»). Funciona mejor con tres hebras finas que se enroscan, una flor de fuego en la punta y lenguas curvas que se quedan atrás. Las púas regulares parecían una oruga.
- **Vapor:** son columnas estrechas que suben (elipses altas, poca opacidad). Las manchas redondas grandes tapaban la escena como niebla sucia.
- **Losas que se levantan:**
  - son bloques gruesos (30) con el borde de arriba apenas roto y oscuros;
  - finos, claros y con el borde dentado parecían bolsas de papel;
  - la base siempre en el suelo: con el rebote flotaban y las raíces parecían patas de mueble.
- **Cristales que se paran en el aire:** tienen que caer despacio (velocidad límite) y desprenderse durante varios segundos. Con gravedad real ya estaban en el suelo cuando B los detiene.
- **Haces que chocan:** con una hélice regular parecían bastones de caramelo; mejor una pincelada con cerdas y ruido. La esfera necesita remolinos de tinta dentro o es solo un disco blanco.
- **Brillo:** con una luz radial a toda intensidad, el centro del cuadro queda blanco y se pierde la tinta. La luz del entorno tiene que ser más ancha y suave, y la del hechizo pequeña.
- **Cortes en las raíces (rodajas):** la cara del corte tiene que ser tono medio. En color claro, decenas de discos claros dominan todos los planos siguientes.
- **La detonación es silenciosa:** el master baja a 0 en 15 ms y vuelven primero la lluvia, luego las respiraciones.

**Personajes**
- **Viento en las telas:** `WIND.x` (global, en pantalla) suma una fuerza con ráfagas e inclina la forma de reposo de la tela. Solo con la fuerza, la rigidez gana y la capa sigue colgando. Medido igual a 60, 144 y 240 Hz.
- **`capeLen`** en `dressBody`: capa larga y pesada (1,22) o corta (0,62). Distingue a los dos magos en silueta tanto como el pelo.
- **La estela de un gesto** (el círculo de B, el arco de A) se calcula con la pose en instantes pasados (`tipAt`), sin guardar historial: así funciona igual al saltar.

**Rendimiento** (Chromium sin GPU, 1280×720): 70–115 ms por fotograma. Pesan las pasadas a pantalla completa (cielo, muro, dos capas de luz, papel) y los dos magos. Con GPU debería ir fluido; falta medirlo en un PC de verdad. Las capas de luz solo se componen si algo dibujó en ellas.

**Revisión de Nico (v2)**
- **Pies que no patinan:** al caminar, en cada paso cuerpo y pies se mueven con la misma interpolación, así el pie apoyado queda fijo en el mundo (x + f1 constante). El pie que avanza se levanta (`f1y`/`f2y`).
- **Una carga tiene que leerse como carga:** el círculo de B parecía un ataque que no salió. Ahora, mientras traza el círculo, le reptan chispas por el cuerpo y el brazo, la punta crece, y al terminar descarga un estallido de rayos del que nace la onda. Llevan el mismo sonido: chisporroteo que crece y un chasquido.
- **Lo 2D se lee 3D si tiene profundidad de verdad:**
  - la cúpula hexagonal es una esfera proyectada con la cámara del mundo (celdas en latitud y longitud), que gira despacio;
  - la mitad de atrás va en la lista de profundidad detrás del mago y la de delante encima;
  - las celdas brillan según el ángulo, y cada impacto manda una onda por la superficie (distancia angular);
  - un anillo de luz marca donde toca el suelo.
  - La esfera del choque usa el mismo truco: anillos cuya mitad trasera va antes del núcleo y la delantera después, y tentáculos de energía.
- **Cortes:** la cara del corte sigue el ángulo del tajo (más larga cuanto más oblicuo). Tocón y trozo que cae se recortan por ese plano; el trozo primero resbala por el corte y luego cae. De cada corte salen dos rodajas que giran y quedan en el suelo.
- **Variedad en lo repetido:** cuatro clases de esquirla (astilla, trozo de cuatro lados, aguja y curva de los arcos de abanico).
- **Capas en el choque:** la presión de la esfera las empuja hacia fuera (viento por mago, no global) y el punto negro las aspira.

## Claude Hollywood 101 (Aguada, día de otoño)
- **ElevenLabs desde la nube: una llamada a la vez.** 17 en paralelo dieron 429 y luego «Free Tier disabled» (temporal). Secuencial, esperando cada una, funcionó. Las etiquetas `[excited]` cuentan como caracteres.
- **La voz real es más lenta que el cálculo:** ~10 car/s con eleven_v4 (no 14,5). Medir cada MP3 y sacar de ahí los tiempos; partir los subtítulos en las pausas (silencedetect).
- **De día el vidrio casi no se ve:** un hueco en el muro solo se lee si faltan los hierros y hay polvo y esquirlas; despejar las plantas delante.
- **Lo que está detrás de las palmeras no existe para el espectador:** las pantallas de B3 pasaron del muro a cristales colgados del techo.
- **Personaje pixel art en mundo 3D:** escala `PS(z)` redondeada a píxeles enteros, `imageSmoothingEnabled = false`, sombra y reflejo también en la cuadrícula.
- **Saltar en la línea de tiempo con audio programado:** todos los sonidos van a buses que se reemplazan al saltar o pausar; los eventos se programan con 0,2 s de anticipación.

## Lo-Fi Codes (música 100 % sintetizada, varios escenarios)
- **Grabar la música sin conexión** (`OfflineAudioContext`) sirve para medir niveles y exportar MP3. Ojo: el bucle de la página sigue llamando a `auUpdate` y le pone automatizaciones al grafo de la grabación; bloquearlo con una bandera (`AU.offline`).
- **Medir el balance por bandas** antes de entregar: la primera mezcla tenía los graves 28 dB por encima de los medios (bombo y bajo tapaban el piano). Objetivo lo-fi cálido: graves ≈ bajo-medios, medios −3 a −15, presencia y brillo ≈ −20. Integrado −14 LUFS.
- **Wow & flutter barato:** un solo oscilador lento (0,42 Hz + 6,3 Hz) conectado al `detune` de cada nota; desconectarlo en `onended` para no acumular nodos.
- **El bombo hace respirar al teclado:** bajar la ganancia del bus de teclado en cada bombo (`setValueAtTime` + `setTargetAtTime`).
- **Otro escenario con el mismo motor:** cambiar el decorado y conservar `PJ/PS`, las franjas de suelo (aquí con baldosa que se repite en x) y la lista de profundidad. La carretera, en cambio, va mejor en 2D con capas de paralaje.
- **Personajes pixel art que miran al mar:** hace falta una vista de espaldas (misma cuadrícula sin cara). El respaldo del banco va del lado de la cámara.

## Entre el Vapor y el Bit · fase 1 (motor Escenarios, el estudio)
- **Nuevo estándar de mapas:** cada superficie es una textura pintada una vez sobre un rectángulo 3D (`vplane`, `hplane`, `box3`); todo lo que tiene profundidad va a la lista `put/flush`. El Atlas y los fondos de Lo-Fi quedan como legacy.
- **Las tiras de un plano horizontal son paralelogramos:** el borde derecho del lado cercano se queda corto y la pantalla se ve dentada. Hay que estirar `xr` para cubrir la pantalla en los dos bordes de la tira, y dibujar las paredes *después* del suelo y del techo para que tapen los bordes.
- **La espiga de parqué hacia el fondo se lee como arcos** (moiré en perspectiva); con la espina a lo ancho se lee como espiga.
- **Sol por la persiana:** cada rendija se proyecta en 3D sobre cada receptor y se recorta a sus bordes. Las sombras son los oclusores proyectados con la misma dirección, y las hojas de monstera tienen agujeros (`evenodd`). Una luz rasante (`dir = [1, .22, .6]`) dibuja franjas en diagonal sobre la pared. Para que el polvo de la sábana brille, la cama tiene que estar en el camino de los haces: la planta del cuarto se decide con la luz.
- **El búfer de luz por receptor era carísimo** a pantalla completa (dos composiciones por receptor). Limitado al rectángulo donde cae la luz, y con la sombra ambiente **horneada** en las texturas, el plano general pasó de ~120 a ~60 ms en CPU.
- **Tela horneada:** se simula una vez en la carga y se guarda a 60 Hz (función de t, se puede saltar). **El impulso se aplica UNA vez:** sumarlo en cada subpaso durante 0,1 s lo multiplica por 24 y la sábana atraviesa el techo. Pon también un techo de colisión.
- **El sombreado por cara sale en damero:** se suaviza con normales promediadas por vértice y el sol medio de las esquinas.
- **Una tela en el suelo se ordena como suelo;** si no, tapa al personaje que está encima.
- **Caja de diálogo pixel:** si el que habla está en la mitad de abajo del cuadro, la caja va arriba (como en los RPG de 8 bits). Para asomarse de debajo de la sábana basta un recorte de filas del sprite (`crop`) y una posición que sube con el recorte.
- **Cámara lenta con tiempo físico:** `phys(t)` estira un tramo; tela, polvo y salto usan el tiempo físico y el resto (diálogos, cámara, música) el real.
- **Audio:** la primera mezcla salió a −31 LUFS. Con el volumen general en 2,0 y un compresor firme (umbral −20, razón 8) queda en −15,8 LUFS. La caja de música de la intro ya llena sola los medios: bajarla.
- **Marcas y elenco compartidos:** `marcas/` y `personajes/` se meten en cada película desde `build.py`; los nombres de personajes nuevos son realistas y al azar.

## Entre el Vapor y el Bit · fase 2 (la calle y Molienda)
- **`ctx.filter` por cuadro es veneno:** un `blur(1.5px)` en unos cables subió la calle de 26 a 300 ms por cuadro (CPU). Todo desenfoque se hornea en la carga (`sprBlur`).
- **Travelling en cuatro planos con el mismo motor:** no hacen falta tiras repetidas. Basta poner las cosas a su profundidad (bordillo z 250, Teo 560, fachadas 1400, ciudad 9000) y mover la cámara en x. El paralaje sale solo.
- **Para ver las escaleras de incendio y su vapor** hubo que bajar el zoom (0,86) y empujar la imagen hacia abajo (`ty` = 150). Los cables cuelgan bajo (comba de 2–3 m) para entrar en cuadro.
- **El cromo no es vidrio:** un reflejo con colores saturados (ventanas cian, siluetas) se lee como vitrina. Funciona desaturar la placa, multiplicar un degradado gris con bandas, sumar 5–7 franjas especulares y repintar encima el logo y los manómetros.
- **Ladrillo a distancia:** una baldosa de ladrillo como patrón multiplicado y teñida por edificio. Pintar ladrillo a ladrillo cada fachada lejana costaría segundos de carga.
- **Personajes del mundo con su tema:** Valeria (barista) tiene un tema corto a 96 BPM con swing (pulso 12 %, bajo caminante en triángulo, acordes de caja de música, escobillas). Es liviano: unos 30 eventos por compás.
- **La caja de diálogo sabe quién habla:** el ancla busca al hablante del diálogo activo (Teo en su escena o Valeria) para decidir si va arriba o abajo.

## Entre el Vapor y el Bit · fase 3 (el parque y el Invernadero de día)
- **Un estanque se ve solo si la cámara lo mira desde arriba:** con la cámara a la altura de Teo el agua era una tira. Hay que subirla (`y` −260) y compensar con `ty` negativo para que el personaje no se salga por abajo.
- **El reflejo de alguien que corre junto a un vidrio** va a la profundidad del espejo (`2·z_vidrio − z_personaje`) a la misma x, con poca opacidad y recortado por paneles, cada uno algo corrido (vidrios curvos). Se lee de inmediato.
- **Una hilera de un solo tipo de árbol parece papel tapiz:** hay que alternar sauces y árboles redondos con altura y profundidad al azar, también en el reflejo.
- **Los círculos de color desenfocados en primer plano distraen** (parecen manchas de la lente); en primer plano, verdes.
- **Un parque largo necesita un final:** la reja de salida con el escudo de la ciudad cierra el recorrido.
- **Personajes de paso:** un pato que solo dice «Cuac.» (voz de pulso grave, ánimo de sueño) y la respuesta seca de Teo funcionan mejor que un diálogo largo.
