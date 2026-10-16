/* =====================================================================
   EL DECORADO: dónde está cada cosa y cómo se dibuja todo en orden de profundidad
   ===================================================================== */
/* helechos [x, z, tamaño, semilla, quemado(t)] */
const FERNS = [[-250, 868, 70, 21, 37.62], [80, 880, 80, 22, 37.98], [-110, 752, 58, 23, 37.8], [240, 760, 54, 26, 38.2],
  [-600, 905, 92, 24], [590, 915, 96, 25], [-1010, 860, 104, 27], [1230, 875, 110, 28], [-330, 1010, 84, 29], [300, 1000, 90, 30],
  [-1250, 700, 96, 31], [1300, 690, 100, 32], [-320, 500, 100, 33], [420, 460, 118, 34], [-700, 430, 120, 35], [60, 1180, 70, 36]];
const TFERNS = [[-720, 985, 300, 3], [660, 965, 290, 5], [-1620, 1420, 340, 9], [1520, 1400, 320, 11], [-180, 1440, 300, 13]];
const BANANAS = [[-1980, 1530, 300, 1], [-520, 1540, 280, 2], [1120, 1530, 320, 3], [2000, 1510, 300, 4], [380, 1550, 260, 6]];
/* estado de las plantas en t: viento, temblor del trueno, quemadas, aplastadas, atraídas al centro */
function windAt(t) {
  let w = 0;
  if (t > 61.38 && t < 66) w -= 1.6 * Math.exp(-(t - 61.6) * 1.1) * sm((t - 61.38) / .25);   // la onda de B barre hacia la izquierda
  if (t > 111.6 && t < 150.5) w += (.9 + .45 * Math.sin(t * 1.7) + .25 * Math.sin(t * 4.3)) * sm((t - 111.6) / 1.2) * (1 - sm((t - 149) / 1.5));   // huracán de izquierda a derecha
  return w;
}
function thunderVib(t) { let v = 0; for (const [t0, , k] of BOLTS) { const d = t - t0 - .75; if (d > 0 && d < 3 && k > .55) v += k * Math.exp(-d * 2.2); } return v * Math.sin(t * 38); }
const PULSES = [126.8, 130.3, 133.8, 137.3, 140.8, 144.3, 147.6];
function pulseFlat(x, z, t) {   // los pulsos de la esfera aplastan la vegetación (más cerca, más)
  if (t < 124 || t > 153.3) return 0;
  let f = 0; for (const tp of PULSES) { const d = t - tp - Math.hypot(x, z - 800) / 1400; if (d > 0 && d < 1.6) f = Math.max(f, Math.exp(-d * 2.6)); }
  return f;
}
function plantO(x, z, t, burn) {
  const w = windAt(t), o = { vib: thunderVib(t) + (t > 124 && t < 150 ? .25 * Math.sin(t * 31 + x) : 0), sway: w * 1.6, windK: Math.abs(w), wither: 0, flat: pulseFlat(x, z, t) };
  if (burn && t > burn) o.wither = clamp((t - burn) / .5);
  if (WS.final) o.wither = Math.max(o.wither, .35 + hsh(x, z) * .4);
  if (t > 150 && t < 153.25) o.pull = [PJ(0, -120, 800), sm((t - 150) / 3) * 1.2];
  return o;
}
/* la mano de cada escena añade cosas a la lista de profundidad */
function drawSet(t, o = {}) {
  worldState(t); lightsBegin(); T0();
  drawSky(t);
  drawFarWall(t);
  if (o.wallFx) o.wallFx(t);
  T0(); drawRoof(t);
  drawFloor(t, o.refl);
  if (o.floorFx) o.floorFx(t);
  T0();
  const L = [];
  const put = (z, f) => L.push([z, f]);
  drawFallingWall && put(1590, () => drawFallingWall(t));
  for (const [x, z] of COLS) put(z, () => ironColumn(x, z, t));
  for (const [x, z, h, sd] of BANANAS) put(z, () => bananaAt(x, z, h, sd, plantO(x, z, t), t));
  for (const [x, z, h, sd] of TFERNS) put(z, () => treeFern(x, z, h, sd, plantO(x, z, t), t));
  for (const [x, z, sz, sd, burn] of FERNS) put(z, () => fernAt(x, z, sz, sd, { ...plantO(x, z, t, burn), lit: o.fernLit ? o.fernLit(x, z, t) : null }, t));
  TABLE_AT.forEach(([x, z], i) => put(z, () => drawSprite(TABLES[i], x, 0, z)));
  for (const S of SHELVES) put(S.z, () => drawShelf(S, t));
  put(1180, () => drawRoots(t));
  const wind = windAt(t);
  for (const V of VINES) { const z = ribP(V.x, V.th)[2]; put(z - 1, () => vineAt(V, t, wind + (t > 150 && t < 153.2 ? -Math.sign(V.x) * sm((t - 150) / 3) * 1.2 : 0) + pulseFlat(V.x, z, t) * Math.sign(V.x) * .8)); }
  if (o.items) o.items(put, t);
  put(o.lightZ ?? 805, () => { lightsComp(0); T0(); });
  L.sort((a, b) => b[0] - a[0]);
  for (const [, f] of L) { f(); T0(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; }
  if (o.fx) o.fx(t);
  T0(); lightsComp(1); T0();
}
