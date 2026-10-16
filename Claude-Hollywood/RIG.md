# El rig nuevo: guía técnica

Cómo están hechos los personajes del motor nuevo (laboratorio), cómo se usan en una escena y cómo se meten en las películas viejas. Las razones de cada decisión y los errores ya resueltos están en `LECCIONES.md` (§13 en adelante). Esto es el manual de uso.

**Estado (15-10-2026):** el rig está en el laboratorio y en el motor de escenas (`cine/`). Las tres películas originales lo usan mediante el adaptador (`cambio-personajes/`). La serie sigue **sin rasgos**; los *rasgos mínimos* quedan reservados para un estilo de papel recortado.

---

## 1. Mapa de archivos

| Archivo | Qué hace |
|---|---|
| `laboratorio/src/01_base.js` | Lienzo y unidades, papel, ruido, geometría (cápsulas, envolventes, `pathOf`), `ik2`, telas (`clothStep`, `clothPoly`) y cadenas con resorte. |
| `02_head.js` | Cabeza 2.5D (`headRig`): cráneo, mandíbula, quilla del perfil, orejas, pelo (casquete + mantas), rasgos, expresiones. `CAST` y `HAIR`. |
| `03_hand.js` | Mano de cinco dedos (`handRig`), poses `HPOSE`, `mixHP`, agarre de varita. |
| `04_body.js` | Cuerpo: `bodyRig` (IK hacia un objetivo), `dressBody(J, o)` (viste unas articulaciones), ragdoll activo. |
| `05_styles.js` | Estilos de pintura como pasadas de dibujo: `TINTA`, `PAPEL`, `BOCETO`; `renderHead`, `renderHand`, `softFill`, `rim`. |
| `05b_fx.js` | Magia hecha de tinta y papel: `inkStroke`, `inkBloom`, `paperLight`, `bez`, `impactFrame`. |
| `06_main.js` | La interfaz del laboratorio (pestañas Rostro, Manos, Cuerpo, Física, Estilos, Efectos). |
| `cine/src/07_cine.js` | Utilidades de escena sobre el rig: poses (`poseJ`, `sitJ`, `lyingJ`), `figW`/`drawFig`, porche y farol a escala, hilo, motas, `bigHands`, reproductor `drawFilm`. |
| `cine/src/08_*.js` | Una película por archivo, como objeto `FILM`. |
| `cambio-personajes/nr_adapter.js` | Puente entre las películas viejas y el rig nuevo. |
| `cambio-personajes/trailer/` | Tráiler que conduce a las tres películas desde fuera. |

## 2. Unidades y espacios

- **Pantalla:** alto = 1000u, origen en el centro (`T0()` pone `U = H/1000`).
- **Figura:** unidades de figura con los pies en el origen, mirando a +x y la y hacia abajo. Cadera a 47,5 de altura, torso de 30, muslo 24, pierna 25, brazo 14,5 y antebrazo 13,5. `k` = escala de figura a pantalla: un adulto mide unas 100·k de alto.
- **`figX(o)`** convierte de figura a pantalla: `[x0 + ±p.x·k, y0 + p.y·k]` (con `flip`, el signo de x se invierte).
- **Las telas viven en pantalla**: sus anclas pasan por `X()`. Por eso un `flip` o un salto brusco de posición se notan en la tela; hay que darle pasos de física para que se recoloque.

## 3. Articulaciones J (la pose)

Un cuerpo es un objeto J; quien lo rellene (pose escrita a mano, IK, ragdoll o adaptador) da igual: `dressBody` lo viste siempre igual.

```
J = { Hp, lean, K1, F1, K2, F2,      // cadera, inclinación del torso, rodillas y pies
      Sn, En, Wn,  Sf, Ef, Wf,        // hombro, codo y muñeca: n = brazo cercano, f = lejano
      Head?, headRoll?, t }           // pivote de la cabeza y su giro (opcionales)
```

- Pose de pie, sentada o tumbada: `poseJ({hand, handF, kneel, lean, t})`, `sitJ()` y `lyingJ(lift)` en `07_cine.js`.
- Codos y rodillas siempre por `ik2(S, T, l1, l2, curva)`: curva `+1` en los brazos y `-1` en las piernas.
- **Brazos en reposo = paralelos al torso.** Un antebrazo en horizontal con la mano relajada se lee como una garra (Nico).

## 4. Vestir: `dressBody(J, o)`

```
dressBody(J, { k, x0, y0, who, key, ticks, flip,
               nearPose, farPose,    // HPOSE de cada mano
               wand, wandTo,         // varita en la mano cercana; wandTo = punto donde debe quedar la punta
               ex, pitch, yawAdd,    // expresión e inclinación/giro de la cabeza
               capeStiff,            // rigidez de la capa (0,14 por defecto)
               headK,                // escala de la cabeza (1; niños 1,38)
               capeLen })            // largo de la capa (1; capa pesada 1,22; corta 0,62)
→ { parts, head, near, X, wandTip }
```

**Orden de dibujo:**
1. `parts`: capa (tela con suelo en `y0`), brazo lejano, piernas, túnica con faldón y cuello.
2. Cabeza (`head`). Antes, en `drawFig`, se pinta la manta trasera del pelo después de la primera pieza.
3. `near`: brazo y mano cercanos.

`drawFig(B, L, rim)` en `07_cine.js` hace todo el recorrido con el estilo TINTA.

**Uniforme:** la camisa, el cuello y la corbata con los colores de la casa se dibujan antes que la túnica; la V de la túnica los enmarca.

## 5. La cabeza: `headRig`

- Volúmenes unidos con la regla *nonzero* (todos en la misma orientación): cráneo elipsoide, mandíbula convexa, quilla del perfil y orejas. De frente la quilla desaparece sola.
- `yaw`, `pitch`, `roll` y `s` (≈ 6,4·k). `CAST[who].tilt` = gesto propio (Draconida ladea la cabeza unos 11°).
- **Pelo = casquete + mantas** (`HAIR[estilo]`):
  - casquete: malla sobre un elipsoide algo mayor, cortada en la línea del pelo (`k` = tamaño, `vol` = cuánto tarda en aplanarse, `front`/`side`/`back` = línea del pelo);
  - mantas: telas Verlet (`clothStep`) colgadas de anclas en la línea del pelo (`us`) o de una **barra en pantalla** detrás de la cabeza (`bar`, para que no se plieguen al girar);
  - cada manta tiene `len`, `R` (filas), `cut` (recto, punta o flecos), `tip`, `stiff`, `grav`, `fl` (apertura), `bias`/`bf` (empuje lateral o hacia atrás respecto a la cara), `dy` (negativo = sube, para tupés y coronas), `spread` y `layer` (back, mid, front o auto).
- **Peinados:**
  - `corto` (Anami): volumen tipo Mii, flequillo de 5 gajos y corona de puntas;
  - `salvaje` (Joy);
  - `peinado` (Damien): tupé que sube y se va hacia atrás;
  - `raya` (Draconida): raya al lado, un lado tras la oreja y el otro por delante del hombro, con aros;
  - `lacio`.
- `hairCol` da el color en los estilos con color, `hoops` los aros y `EXPR` las expresiones (para los rasgos mínimos).

## 6. La mano: `handRig`

```
handRig({ x, y, s, ang, flip, pose, wand, wandTo, noWrist }) → { pieces, all, fingers, thumb, wandTip }
```

- El origen es la muñeca y los dedos salen hacia +x. Escala `s`: 8,5·k en el cuerpo y unas 300–400u en primer plano.
- `HPOSE`: abierta, relajada, puño, señalar, varita, garra y alcanzar. `mixHP(a, b, t)` mezcla dos poses.
- **Varita:** se coge como un puntero (índice a lo largo, pulgar al lado, mango bajo el meñique) y va en la línea del antebrazo. `wandTo` obliga a la punta a ir a un punto: así encajan los hechizos de una escena escrita para otro motor.
- `noWrist` se usa con manga: la manga tapa la muñeca y la mano no flota en papel recortado.
- **Primer plano de manos:** grandes (s ≈ 400) y con los antebrazos asomando solo desde el borde (`bigHands`). Brazos largos con manos pequeñas se ven raros.

## 7. Física

- **`clothStep(key, anchors, R, lens, o, ticks)`:** rejilla Verlet guardada en `SPR` por `key`. `ticks` = pasos de 1/60 s.
  - **Calcula los pasos acumulando el resto**, nunca redondeando: a 144 Hz el redondeo da 0 y la tela se congela.
  - Con `ticks = 0` solo se mueve la fila de anclas.
  - `floor` = suelo.
- **Viento:** `WIND.x` (global, en pantalla, + a la derecha) empuja todas las telas (capa y pelo) proporcionalmente a su gravedad, con ráfagas, e inclina su forma de reposo (`windK` por tela, 1 por defecto). Se fija cada fotograma antes de dibujar.
- **Claves únicas por figura y escena:** si dos figuras comparten clave, se roban la tela.
- **Ragdoll activo:** `ragdollNew`, `ragdollHit(st, t, dir, power)` y `ragdollStep(st, t, ticks, {wall, onImpact})` devuelven J.
  - El músculo mueve a la vez la posición actual y la anterior.
  - Pasa 2 s en el suelo y tarda unos 5 s en levantarse, pasando por agachado.
  - El cuello sale de la cabeza física.

## 8. Estilos (pasadas de dibujo, no shaders)

- **`TINTA`:** siluetas al 100 %, luz de borde (`rim(polys, dirLuz, ancho, cantidad, color)`), núcleo de sombra con `softFill`, textura de acuarela pegada al personaje y trazo de casa en la capa (`trim`). Con `SC.sil = true` es la silueta de la serie.
- **`PAPEL`:** papel recortado con sombra y borde dentado.
- **`BOCETO`:** tramas y líneas.
- **`softFill(g, P, dx, dy, blurPx, col)`:** la forma se dibuja 20 000u fuera y se trae solo su sombra. El desplazamiento de la sombra va en píxeles: `-FAR · getTransform().a` (y `.b`), **nunca `-FAR · U`**, porque con zoom de cámara sale una copia negra desplazada.
- `paperPat()` es el papel del fondo alineado a la pantalla; sirve para «recortar» con papel exacto (la línea entre dedos o la luz).

## 9. Magia (lenguaje del motor nuevo)

| Qué | Cómo | Nota |
|---|---|---|
| Ataque | `inkStroke` en arco con el color de la casa, alma de papel (`core`) y cerdas | Seco y rápido; puntas en el impacto |
| Impacto | `inkBloom` en oro, bronce o plata + `paperLight` + `impactFrame` 1–2 fotogramas | **Nunca rojo sobre un cuerpo** |
| Escudo | **Ensō** (círculo de un trazo, abierto) que **envuelve al mago entero** | Centrado en el cuerpo, no en la varita |
| Maldición | Zarcillo lento que se arrastra y trepa enroscándose | No es un rayo instantáneo |
| Hilo del pacto | Tinta sin brillo; el pulso levanta papel en el centro | Vena verde = `inkStroke` corto que recorre el hilo |
| Luz | `paperLight` = papel sin pintar | Los degradados radiales son lenguaje de videojuego |

Los efectos van a 12 FPS («en doses»): cuantiza el tiempo de las ondulaciones con `floor(T·12)/12`.

## 10. Escenas nuevas (`cine/`)

Cada película es un objeto:

```
FILM = { DUR, SHOTS: [{t0, t1, draw(t, ticks, lt)}], SUBS, CARDS,
         wind(t), drone(t), pad(t), CHORDS, EVENTS, end(t), reset() }
```

- Cada plano dibuja en función del tiempo. La física recibe `ticks` del reproductor, que acumula el resto.
- **El escenario va a escala de los personajes:** el porche se dibuja con `k` (techo ≈ 1,5 alturas, postes cada ≈ 2,6, farol ≈ 1,15).
- **Los fondos pintados a mano en el motor nuevo salieron pobres** (Nico). Para escenas de la serie, mejor reutilizar los fondos de las películas (§11).
- **Encuadres:**
  - planos generales en silueta;
  - planos medios en silueta (figura grande, cortada abajo, luz de borde);
  - primeros planos de manos.
  - **Primeros planos de cara: todavía no.**

## 11. El adaptador: rig nuevo en las películas viejas

Las películas viejas dibujan a cada personaje con `dm(who, F, x, y, s, flip, T, o)`. El adaptador sustituye esa función y algunas más. Fondos, cámara, música, textos y tiempos no se tocan.

**El laboratorio dentro de la película:** se envuelve en `const NR = (() => {...})()` para que sus nombres no choquen con los del motor viejo. Se le pasa el lienzo y la cámara con `NR.sync(g, W, H, U, SW, papel, matriz)`.

**De la pose vieja a J**, para cada figura:
- normaliza por el largo del torso (`c = torso/30`, o `/28` en mujeres);
- calcula codos y rodillas con IK;
- pone la cabeza a distancia de adulto del torso (los niños viejos tienen el torso corto y el cuello salía estirado).

**Niños:** piernas al 76 %, `headK` 1,38 y todo el cuerpo baja con la cadera, **manos incluidas**. Si las manos se quedan arriba, los brazos se doblan como un T-rex. Lo que la escena dibuja en la mano (`after`) y el sello bajan lo mismo.

**Brazos en reposo:** se envuelve `mage()`, que fabrica las poses viejas. Si el brazo cuelga (|ángulo del brazo| < 0,5, sin correr), el antebrazo se estira; entre 0,5 y 0,95 se mezcla. Se corrige en la pose, así cartas, libros e hilos de la muñeca siguen a la mano.

**Cómo se pinta:**
- capa aparte del tamaño del lienzo, compuesta con el alfa de la escena (`SA`);
- `o.ink` tiñe la capa (fantasmas);
- la sombra de contacto se dibuja aparte;
- el sello es el `medallion` original.

**Física en las películas:** los pasos se acumulan por figura con la clave `who@escena#n`; tras un salto se dan 4 pasos.

**Magia:**
- `beam`, `orb`, `shield`, `hilo`, `vein` y `wristRing` se sustituyen por las versiones de §9, con los mismos parámetros;
- los fantasmas de los niños (`ghostKids`) usan `dm` con tinta clara;
- sigue en estilo viejo lo que cada escena dibuja a mano (estallido de la Selección, motas, chispas, quemaduras) y los insertos de manos de las películas.

**Construir:**
```
cd cambio-personajes
python build.py juramento-ep1        # y ep2, ep3 → dist/<película>-nuevo.html y -nuevo-artifact.html
```

## 12. El tráiler que conduce películas

- Cada episodio va en un `iframe` `srcdoc` del mismo origen. Se le inyecta `__ctl.drive(t, dt, warm)`: el tráiler decide el segundo y dibuja él, así todo va con un solo reloj.
- La película no se dibuja sola (`render` vacío) y no suena (`auInit` vacío); el texto se oculta salvo los gritos de hechizo.
- **Al cortar:** saltar y calentar medio segundo en pasos de 1/20 bajo un parpadeo de tinta.
- **Zoom con CSS** (`scale` lento sobre el iframe): hasta 1,3 sin que se note blando.
- **Encima, una capa del motor nuevo:** primeros planos, subtítulos, rótulos, franjas y cortes. La música es la de `FILM`.
- `trailer/build.py` mete las tres películas como JSON con `<` escapado.

## 13. Comprobar

**Capturas:**
- `film.py` / `trailer/shoot.py`: fotogramas por segundo exacto (modo prueba, pasos fijos).
- **`dbg/play.py archivo prefijo HZ t…`:** reproduce 3 s seguidos a una frecuencia real con fotogramas irregulares antes de cada captura. Es la prueba que destapa los fallos de tela y tiempo.
- `dbg/hz.py`: el mismo instante a 60, 144 y 240 Hz. Deben verse iguales.
- `dbg/sheet.py 'patrón' salida.jpg columnas`: hoja de contactos.

**Qué revisar en cada personaje:**
- manos (¿garra, T-rex, flotando?);
- largo del cuello;
- pelo y capa (¿congelados, en bandera, atravesando el suelo?);
- escala respecto al escenario;
- que nadie flote ni se amontone.

**Rendimiento:** Chromium sin GPU marca unos 30–90 ms por fotograma; en el PC de Nico el laboratorio va a 144 FPS con unos 2 ms. Solo sirve para comparar.

## 14. Notas de dirección de Nico

- **Personajes:**
  - sin rostro: se reconocen por pelo, porte y sello;
  - pelo como **manta**, no mechones sueltos;
  - chicos con volumen de casco (tipo Mii, diseño propio);
  - Draconida con raya al lado, aros y cabeza ladeada;
  - niños peques (cabeza grande, piernas cortas).
- **Manos:**
  - en reposo, paralelas al torso;
  - la varita, como un puntero;
  - en primer plano, grandes, con los antebrazos solo asomando.
- **Magia:**
  - el escudo envuelve al mago entero;
  - la maldición no es un rayo instantáneo;
  - el centro de los rayos, nunca pixelado ni neón.
- **Cuerpo:** recuperación de una caída de unos 7 s.
- **Escenarios y propiedad intelectual:**
  - los fondos de las películas originales son mejores que los rehechos;
  - nada de escudos oficiales, sombrero parlante ni diseños copiados: solo principios de forma.
