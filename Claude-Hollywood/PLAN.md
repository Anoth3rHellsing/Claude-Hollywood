# Plan · Refinar el motor

Objetivo: que el motor aguante **planos cercanos** (primeros planos, manos, gestos) y que se le puedan cambiar **estilos** sin rehacer los personajes. Todo se prueba primero en el laboratorio (`laboratorio/laboratorio.html`) y solo pasa al motor cuando funciona y no cuesta rendimiento.

## Por qué esto y no otra cosa

En los tres episodios, una cabeza en plano general mide unos 12u: **unos 13 píxeles a 1080p**. A ese tamaño, una cara con ojos o unas manos con cinco dedos no se ven. Por eso las películas evitaron los primeros planos: la figura no los aguantaba. La mejora real no es añadir detalle a todo. Es poder **acercar la cámara** cuando la escena lo pide (Joy agarrando la mano de Anami, la cara de Draconida al caer) y que lo que se vea esté a la altura.

Consecuencia práctica: el detalle depende de la escala. Plano general → silueta actual. Plano medio → mano simplificada y cabeza con perfil. Primer plano → rostro con sombra y mano completa.

## Fases

### Fase 0 · Laboratorio ✔ (en curso)
Página con pestañas, deslizadores y medidor de ms por fotograma. Regla: **el rig produce formas (listas de puntos con etiqueta), los estilos solo las pintan.** Así un mismo personaje sirve para tinta, papel recortado o boceto.

### Fase 1 · Anatomía
| Pieza | Cómo | Listo cuando |
|---|---|---|
| Cabeza | Volúmenes 3D (cráneo elipsoide, mandíbula, «quilla» del perfil) proyectados y unidos. Nada de cabeza-círculo. Giro y cabeceo reales. | Se reconoce frente, ¾ y perfil sin que salte la forma. |
| Sombra de rostro | Forma menos forma desplazada hacia la luz (núcleo de sombra), luz de borde, sombra que proyecta la nariz, cuencas de los ojos. Todo recortado a la cabeza. | La luz se mueve y la cabeza «gira» de volumen, sin manchas fuera de la forma. |
| Rasgos | **Decidido (14-10-2026): la serie va *sin rasgos*** (es su esencia): la expresión sale de la inclinación, la luz y las cejas como borde de la sombra. 📌 *Rasgos mínimos* (ojos, cejas, boca) queda guardado para un estilo futuro; encaja con el papel recortado. | ✔ |
| Manos | Palma y 5 dedos de 3 falanges, posturas mezclables, línea de separación de papel entre dedos. | Puño, señalar, sujetar varita y alcanzar se leen en silueta. |
| IK de dos huesos | Brazo y pierna resueltos hacia un objetivo; pies clavados al suelo. | Arrastrar el objetivo y el codo nunca se rompe. |
| Pelo-manta | Idea de Nico: el pelo es **tela**, no mechones. Casquete + mantas (rejilla Verlet) colgadas de la línea del pelo o de una barra detrás de la cabeza, con un «corte» (recto, puntas, flecos) que define el peinado. Mismo motor que la capa. Capas: trasera (tras los hombros), delantera (sobre la capa, tras la cara) y encima. | ✔ Los cuatro peinados salen de cortar mantas; sin «tentáculos» al girar. |
| Física (ragdoll activo) | Idea de Nico: que el cuerpo choque con el entorno. Articulaciones = partículas Verlet unidas por huesos; «músculo» = mezcla hacia la pose animada. Golpe → músculo a 0 → vuela, choca con suelo y pared, y se levanta. El mismo vestido (`dressBody`) sirve para IK y para física. | ✔ Demo de duelo: hechizo, choque contra la pared, polvo y astillas, se levanta. |
| Ritmo | Pose animada a 12 FPS («en doses»), cámara y partículas a 60. | Comparar en la misma pantalla. |

### Fase 2 · Estilos
Tres pasadas sobre el mismo rig: **tinta y acuarela** (la actual, con lavado), **papel recortado** (capas planas, borde dentado, sombra proyectada) y **boceto** (grafito, trazos repetidos, sombra con tramado). Temblor de línea precalculado (3 variantes a 8 FPS), no ruido por fotograma.

### Fase 2b · Efectos del mismo material ✔ (laboratorio)
Hechizo = pincelada (cuerpo, cerdas, pincel seco, vetas de papel); luz = papel reservado; impacto = flor de tinta en el color secundario de la casa + 1–2 fotogramas invertidos; forma por tipo (ataque en puntas, escudo ensō, maldición zarcillo enroscado); a 12 FPS.

### Siguiente · Biblioteca de acciones
~8 acciones base (levantarse boca arriba / boca abajo con un brazo, tambalearse, caer de rodillas, retroceder, esquivar, lanzar, protegerse) como 3–4 poses clave; la física elige cuál según cómo cayó; ajustes por escena (lento, lado, pausa) y capa de personalidad por personaje. A mano solo los momentos firma.

### Fase 3 · Escena de prueba
Un corto de 20-30 s con un primer plano, una mano y un cambio de luz, rehaciendo un momento del Ep. III (el porche) para comparar antes y después.

### Fase 4 · Integración
Pasar al motor lo que funcione (`03c_rig.js`, `05d_styles.js`), actualizar `LECCIONES.md` y la skill.

## Lo que no vamos a hacer (y por qué)
- **Filtros SVG o `ctx.filter` por fotograma**: caros y muy distintos entre navegadores. Las sombras suaves se hacen con varias pasadas desplazadas.
- **Three.js / WebGL**: rompe el «un HTML, sin librerías» y el aspecto de pintura plana.
- **Seguimiento por senos desfasados para el pelo**: se nota mecánico. Verlet cuesta casi lo mismo y responde al movimiento real.
- **Detalle en planos generales**: no se ve y cuesta. El detalle va con la escala.

## Ideas de Gemini, con veredicto
Sí: rig separado del estilo, animar a 12/8 FPS, paralaje facial 2.5D, `Sx = 1/Sy` en aplastar y estirar, nada de cabezas de círculo, sombras recortadas a la forma, `new Path2D("datos svg")` como puente para formas dibujadas a mano.
No: filtros SVG por fotograma, su receta de acuarela, el seno desfasado, Three.js.


## Siguiente (acordado con Nico, 15-10-2026)
- **El Invernadero es el nuevo estándar** para escenas dinámicas (`invernadero/`, `SKILL.md` §4 quater).
- Próxima exploración: **cámara que se mueve dentro de la acción** (por ejemplo, girar alrededor del choque de haces). El motor ya proyecta en 3D; falta que la cámara gire (rotar x–z alrededor de un punto antes de proyectar) y que los sprites planos (muro del fondo, suelo) aguanten el giro o se cambien por geometría viva.
- Pendientes menores del Invernadero: arcos de las raíces más variados, la esfera del choque (sigue «meh») y el plano final del charco.
