# Entre el Vapor y el Bit · Crónica de dos Estrellas

Un día entero de **Teo Cazorla**, cazo de cobre y jefe de partida en *Brasa y Bruma* (dos estrellas en la Guía Brújula): del despertar con prisa al colapso de medianoche.

- **Sin voces de IA:** diálogos con bleeps de 8 bits y cajas de texto pixel cuyo ritmo sigue al ánimo.
- **Rótulos de hora** en cada escena.
- Todo con el motor **Escenarios** (ver `../ESCENARIOS.md`).
- Duración prevista: **≈ 8:30**.

## Plan por escenas

| Tiempo | Escena | Estado |
|---|---|---|
| 0:00–1:07 | **1. El estudio, 07:15.** Sol por la persiana, alarma Kronotek, la sábana que vuela con polvo dorado, zuecos, cuaderno de emplatados, puerta que rebota en el tope y diploma que tiembla; vuelve a apagar el despertador. | **Fase 1 · hecha** |
| 1:10–1:40 | 2a. La calle (travelling en 4 capas): parquímetros, hidrantes y cables desenfocados; acera agrietada con charcos; escaleras de incendio que humean. | pendiente |
| 1:40–2:40 | 2b. Molienda Reserva: puerta de vidrio con campanilla, derrape en baldosa hidráulica, cafetera Vaporetta que refleja el local, vitrina empañada, pizarras de tiza, siluetas con laptops Nimbo, servilletas que vuelan. | pendiente |
| 2:40–3:40 | 3. Parque e Invernadero: komorebi, grava, estanque con patos que refleja los sauces y los rascacielos; el invernadero de día con parches nuevos, musgo, condensación, arcoíris y riego; su reflejo panel a panel. | pendiente |
| 3:40–6:00 | 4. La cocina de dos estrellas: acero, azulejo biselado, cobre de Cobre Valdés, cuchillos Tsukiyo, robata con binchotan, roner a 62,5 °C. Receta 1: sellado, flambeado y arroser. Receta 2: emplatado bajo las lámparas del pase. | pendiente |
| 6:00–6:50 | 5. Fast forward del turno: reloj a toda velocidad, comandas Tikket en serpentina, vapor, suelo manchado, torres de platos; luces que se apagan con un clack. | pendiente |
| 6:50–8:30 | 6. Regreso nocturno: el parque de noche (farolas con polillas, invernadero con brillo verde, pasos pesados, bleeps graves con bostezos). El estudio a la luz de la luna y el neón del Hotel Medialuna. Se tira a la cama, polvo plateado, 23:59 → 00:00, último bleep. Por la ventana, dos estrellas. | pendiente |

## Escena 1 por tiempos (hecha)

| s | Plano | Qué pasa | Sonido |
|---|---|---|---|
| 0–7,5 | general de la ventana y la cama | amanecer, polvo en los haces; «Zzz… un poquito más de mantequilla… zzz» | caja de música «Dos estrellas», pájaros |
| 7,5–14,2 | paneo a la derecha | láminas, estantería con post-its, escritorio, chaqueta, puerta, diploma | — |
| 14,2–19,4 | primer plano del Kronotek | 07:14 → 07:15, parpadeo rojo, rótulo «07:15 AM» | la cinta se frena; pitidos |
| 19,4–24,9 | la cama | se revuelve, bostezo, se asoma: «¿¡LAS SIETE Y QUINCE!?» | bleeps de sueño, luego de prisa |
| 24,9–28 | general bajo, **cámara lenta** | salta; la sábana de lino vuela; nube de polvo dorado | crujido, golpe de tela, barridos de cámara lenta, «tonk» de cobre |
| 28–32 | medio | «¡Hoy viene la Guía Brújula!», salta a sus zuecos | chiptune «Prisa», zuecos |
| 32–38 | seguimiento y escritorio | corre, sube, se lleva el cuaderno, la taza tiembla | papel, cerámica |
| 38–41 | puerta | «¡Allá voooy!», salta al pomo, la puerta rebota en el tope y el diploma tiembla | pestillo, portazo, «doiing», marco que traquetea |
| 41–46 | general vacío | polvo que se asienta, el despertador sigue sonando | pitidos en la habitación vacía |
| 46–51,4 | general amplio | vuelve a toda velocidad, apaga la alarma: «Perdón, Kronotek. Buenos días.» y se va | prisa al doble, «bonk» |
| 51,4–67 | acercamiento a la cama | calma; fundido; rótulo «07:35 AM · Continúa: la cafetería» | caja de música lenta, acorde suspendido |

## Construir y probar

```
python build.py                       # dist/entre-el-vapor-y-el-bit.html (+ -artifact.html)
# ?t=SEGUNDOS abre en modo prueba; window.__seek(t), __perf(t), __audioTest(), __renderSong(0, 67.5)
```
