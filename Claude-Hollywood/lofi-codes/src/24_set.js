/* =====================================================================
   EL DECORADO: dónde está cada cosa y cómo se dibuja todo en orden de profundidad
   ===================================================================== */
/* helechos [x, z, tamaño, semilla] */
const FERNS = [[-250, 868, 70, 21], [80, 880, 80, 22], [-110, 752, 58, 23], [240, 760, 54, 26],
  [-600, 905, 92, 24], [590, 915, 96, 25], [-1010, 860, 104, 27], [1230, 875, 110, 28], [-330, 1010, 84, 29], [300, 1000, 90, 30],
  [-1250, 700, 96, 31], [1300, 690, 100, 32], [-1320, 500, 100, 33], [1420, 460, 118, 34], [-1700, 430, 120, 35], [60, 1180, 70, 36]];
const TFERNS = [[-720, 985, 300, 3], [1120, 990, 290, 5], [-1620, 1420, 340, 9], [1520, 1400, 320, 11], [-180, 1440, 300, 13]];
const BANANAS = [[-1980, 1530, 300, 1], [-520, 1540, 280, 2], [1120, 1530, 320, 3], [2000, 1510, 300, 4], [1560, 1500, 260, 6]];
/* viento de un día de otoño: brisa suave; una ráfaga entra por el hueco del muro (bloque 4) y otra cuando Aguada nombra el viento (bloque 5) */
const GUSTS = [];
function windAt(t) {
  let w = .22 + .12 * Math.sin(t * .37) + .07 * Math.sin(t * 1.13 + 1);
  for (const [t0, a, d] of GUSTS) { const f = (t - t0) / d; if (f > 0 && f < 1) w += a * Math.sin(f * PI) * (1 + .3 * Math.sin(t * 6)); }
  return w;
}
function thunderVib(t) { return 0; }
const PULSES = [];
function pulseFlat(x, z, t) { return 0; }
function plantO(x, z, t) {
  const w = windAt(t);
  return { vib: 0, sway: w * 1.2, windK: Math.abs(w) * .6, wither: 0, flat: 0 };
}
/* la mano de cada escena añade cosas a la lista de profundidad */
/* o.stage: para «pintar desde cero» por capas (bloque 1): 0 papel · 1 cielo y bosque · 2 muro · 3 techo y columnas · 4 suelo y charcos · 5 plantas y utilería · 6 personajes y efectos */
function drawSet(t, o = {}) {
  const S = o.stage ?? 9;
  worldState(t); lightsBegin(); T0();
  if (S < 9) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(PAPER, 0, 0, W, H); ctx.restore(); T0(); }
  if (S >= 1) drawSky(t);
  if (S >= 2) { drawFarWall(t); if (o.wallFx) o.wallFx(t); }
  T0(); if (S >= 3) drawRoof(t);
  if (S >= 4) { drawFloor(t, o.refl); if (o.floorFx) o.floorFx(t); }
  T0();
  const L = [];
  const put = (z, f) => L.push([z, f]);
  if (S >= 2) put(1590, () => drawFallingWall(t));
  if (S >= 3) for (const [x, z] of COLS) put(z, () => ironColumn(x, z, t));
  if (S >= 5) {
    for (const [x, z, h, sd] of BANANAS) put(z, () => bananaAt(x, z, h, sd, plantO(x, z, t), t));
    for (const [x, z, h, sd] of TFERNS) put(z, () => treeFern(x, z, h, sd, plantO(x, z, t), t));
    for (const [x, z, sz, sd] of FERNS) put(z, () => fernAt(x, z, sz, sd, plantO(x, z, t), t));
    TABLE_AT.forEach(([x, z], i) => put(z, () => drawSprite(TABLES[i], x, 0, z)));
    for (const F of FLOWERS) put(F.z, () => flowerAt(F, t));
    for (const S_ of SHELVES) put(S_.z, () => drawShelf(S_, t));
    put(1180, () => drawRoots(t));
    const wind = windAt(t);
    for (const V of VINES) { const z = ribP(V.x, V.th)[2]; put(z - 1, () => vineAt(V, t, wind * .5)); }
    if (o.props) o.props(put, t);
  }
  if (S >= 6 && o.items) o.items(put, t);
  put(o.lightZ ?? 805, () => { lightsComp(0); T0(); });
  L.sort((a, b) => b[0] - a[0]);
  for (const [, f] of L) { f(); T0(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; }
  if (S >= 6 && o.fx) o.fx(t);
  T0(); lightsComp(1); T0();
}
