/* =====================================================================
   ESCENARIOS · PERSONAJES PIXEL EN EL MUNDO PINTADO (elenco: personajes/src/elenco.js)
   Se escalan con PS(z) en píxeles enteros y sin suavizado; sombra cuadrada; reflejo pixelado fila a fila;
   el mundo reacciona a ellos (polvo, sombras de sol, charcos). pie = centro de la base en (x, y↑, z).
   ===================================================================== */
const pxCell = (id, z, k = 1) => Math.max(1, Math.round(ELENCO[id].cell * k * PS(z) * U));
function pxFoot(x, y, z) { return toPx(PJ(x, -(y || 0), z)); }
/* dibuja un cuadro (lienzo de elencoCanvas) con el pie en px de dispositivo */
function pxBlit(c, fx, fy, cell, o = {}) {
  cell = Math.max(1, Math.round(cell));
  const sx = o.flip ? -1 : 1, sq = o.sq || 1, cx = (c.foot ?? c.width / 2) + .5;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingEnabled = false; ctx.globalAlpha = o.a ?? 1;
  if (o.rot) { ctx.translate(Math.round(fx), Math.round(fy - c.height * cell * .45)); ctx.rotate(o.rot); ctx.translate(-Math.round(fx), -Math.round(fy - c.height * cell * .45)); }
  const x0 = Math.round(fx - cx * cell * sx), y0 = Math.round(fy - c.height * cell * sq);
  ctx.translate(x0, y0); ctx.scale(sx, sq);
  const rows = Math.max(1, Math.min(c.height, Math.round(o.crop ?? c.height)));   // crop: filas visibles desde arriba (asomarse)
  ctx.drawImage(c, 0, 0, c.width, rows, 0, 0, c.width * cell, rows * cell);
  ctx.restore(); T0();
}
/* en el mundo */
function pxDraw(id, f, x, y, z, o = {}) {
  if (z - CAM.z < 15) return;
  const c = elencoCanvas(id, f), cell = pxCell(id, z, o.k), [fx, fy] = pxFoot(x, y, z);
  pxBlit(c, fx, fy, cell, o);
  if (o.lit) pxLight(c, fx, fy, cell, o, o.lit);
}
/* el personaje cruzando un haz de sol: se le suma la luz cálida solo sobre sus píxeles */
let PXL = null;
function pxLight(c, fx, fy, cell, o, k) {
  if (k < .02) return;
  if (!PXL || PXL.width < c.width || PXL.height < c.height) PXL = mk(64, 64);
  const g = PXL.getContext('2d'); g.clearRect(0, 0, PXL.width, PXL.height); g.globalCompositeOperation = 'source-over'; g.drawImage(c, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = cssc(SOL.col); g.fillRect(0, 0, c.width, c.height);
  const cx = (c.foot ?? c.width / 2) + .5, sx = o.flip ? -1 : 1;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingEnabled = false; ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = .45 * k;
  ctx.translate(Math.round(fx - cx * cell * sx), Math.round(fy - c.height * cell)); ctx.scale(sx, 1); ctx.drawImage(PXL, 0, 0, c.width, c.height, 0, 0, c.width * cell, c.height * cell);
  ctx.restore(); T0();
}
/* sombra de contacto: bloque de píxeles bajo los pies (se encoge al saltar) */
function pxShadow(id, x, z, y = 0, o = {}) {
  if (z - CAM.z < 15) return;
  const cell = pxCell(id, z), [fx, fy] = pxFoot(x, 0, z), lift = clamp(1 - y / 120), w = Math.round((o.w ?? 14) * (.5 + .5 * lift)) * cell;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = `rgba(${o.col || '46,30,40'},${(o.a ?? .32) * lift})`; ctx.fillRect(Math.round(fx - w / 2), Math.round(fy - cell * .5), w, cell * 2); ctx.restore(); T0();
}
/* sombra proyectada por el sol: el contorno del sprite como oclusor de los receptores (aprox. caja) */
function pxOcc(id, x, y, z, o = {}) {
  const E = ELENCO[id], w = (o.w ?? 18) * E.cell / 2, h = (o.h ?? 24) * E.cell;
  return { pts: [[x - w, -y - h, z], [x + w, -y - h, z], [x + w, -y, z], [x - w, -y, z]], a: o.a ?? .8 };
}
/* reflejo pixelado (charcos, acero, vidrio): filas invertidas con ondulación */
function pxReflect(id, f, x, y, z, t, o = {}) {
  if (z - CAM.z < 15) return;
  const c = elencoCanvas(id, f), cell = pxCell(id, z), [fx, fy] = pxFoot(x, 0, z), up = Math.round((y || 0) * PS(z) * U), sx = o.flip ? -1 : 1, cx = (c.foot ?? c.width / 2) + .5;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingEnabled = false; ctx.globalAlpha = o.a ?? .45;
  for (let r = 0; r < c.height; r++) { const off = Math.round(Math.sin(t * (o.w ?? 4) + r * .9) * (o.amp ?? .6)) * cell + (o.dx ? Math.round(o.dx(r)) * cell : 0), dy = fy + up + (c.height - 1 - r) * cell;
    ctx.save(); ctx.translate(Math.round(fx - cx * cell * sx) + off, dy); ctx.scale(sx, 1); ctx.drawImage(c, 0, r, c.width, 1, 0, 0, c.width * cell, cell); ctx.restore(); }
  ctx.restore(); T0();
}
/* chispas / motas cuadradas en px (saltos, aterrizajes) */
function pxBurst(fx, fy, cell, age, n, seed, cols, spread = 14, up = 18, life = 1.2) {
  if (age < 0 || age > life) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  for (let i = 0; i < n; i++) { const a = -PI / 2 + (hsh(i, seed) - .5) * 2.8, v = (.5 + hsh(i, seed + 1)) * spread, x = fx + Math.cos(a) * v * age * cell * 2, y = fy + (Math.sin(a) * up * age + 30 * age * age) * cell; ctx.globalAlpha = 1 - sm(age / life); ctx.fillStyle = cssc(cols[i % cols.length]); ctx.fillRect(Math.round(x / cell) * cell, Math.round(y / cell) * cell, cell, cell); }
  ctx.restore(); T0();
}
