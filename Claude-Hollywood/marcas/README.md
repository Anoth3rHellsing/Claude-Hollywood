# Marcas de Almagre

Identidades ficticias del mundo Clawd para decorar las películas (como las marcas inventadas de un mundo de Rockstar): un letrero, una taza, un lomo, una placa. Cada marca tiene **nombre, rubro, personalidad, lema, paleta, tipografía y un emblema dibujado con código**. Nada copia logos reales: son genéricas en la forma y con alma en el carácter.

- `src/marcas.js` contiene `MARCAS` (las fichas) y `marcaLogo(g, id, x, y, h, o)`, que dibuja emblema + nombre en cualquier lienzo. Opciones:
  - `layout: 'h' | 'v' | 'emblema'`;
  - `mono: [r,g,b]` para grabado, sello o neón, con `monoBg` para los huecos;
  - `dark` (sobre fondo oscuro);
  - `sub: false` (sin la línea de abajo).
- `catalogo.html` es el libro de marcas. Se reconstruye con `python build.py`.

| Marca | Qué es | Dónde sale |
|---|---|---|
| Molienda Reserva | cafeterías de especialidad | escena 2, la taza del estudio |
| Vaporetta | máquinas de espresso | la cafetera cromada |
| Guía Brújula | guía gastronómica (estrellas) | diploma del estudio, puerta del restaurante |
| Brasa y Bruma | restaurante, dos estrellas | chaqueta de Teo, la cocina |
| Kronotek | relojes y electrónica de 1983 | despertador, reloj de la cocina |
| Sobremesa | editorial gastronómica (con 15 títulos) | lomos de la estantería |
| Láminas del Gabinete | láminas botánicas | pósters |
| Tsukiyo Hamono | cuchillos | lámina, barras magnéticas |
| Firme | zuecos de cocina | los zuecos de Teo |
| Cobre Valdés | fundición de cazos de cobre | sartenes; el taller donde nació Teo |
| Ciudad de Almagre | escudo municipal | parquímetros, hidrantes, farolas, bancos |
| Nimbo | portátiles | laptops de la cafetería |
| Hotel Medialuna | neón | la luz de noche en la ventana |
| Tikket | impresoras de comandas | escena 5 |

**Para añadir una marca:**

1. Pon una ficha en `MARCAS`.
2. Dibuja su emblema en `MEMB[id](g, P)`, en un cuadrado de lado 1 con la paleta `P`.
3. Reconstruye el catálogo.

Las fuentes vienen de Google Fonts (Playfair Display, Josefin Sans, Bebas Neue, Pacifico, Space Mono), con pilas de reserva.
