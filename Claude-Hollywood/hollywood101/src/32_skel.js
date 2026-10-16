/* =====================================================================
   BLOQUE 1 · el esqueleto del mundo: la misma escena, pero solo las líneas de la cámara 3D
   (suelo en cuadrícula, costillas, columnas, muro, mesas, charcos y Aguada como cuadrícula de píxeles)
   ===================================================================== */
const SKC = '38,50,98';
function skLine(a, b, al = .8, w = 1.3) { al = Math.min(1, al * 1.45); w *= 1.5; if (a[2] - CAM.z < 30 || b[2] - CAM.z < 30) return; const p = PJ(...a), q = PJ(...b); ctx.strokeStyle = `rgba(${SKC},${al})`; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(...p); ctx.lineTo(...q); ctx.stroke(); }
function skPoly(pts3, al = .8, w = 1.3, close = false) { al = Math.min(1, al * 1.45); w *= 1.5; const P = []; for (const q of pts3) { if (q[2] - CAM.z < 30) return; P.push(PJ(...q)); } ctx.strokeStyle = `rgba(${SKC},${al})`; ctx.lineWidth = w; ctx.beginPath(); P.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); if (close) ctx.closePath(); ctx.stroke(); }
/* k: cuánto del esqueleto se ve (0–1); las piezas aparecen de lejos a cerca */
function drawSkeleton(t, k, ag) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(PAPER, 0, 0, W, H); ctx.restore(); T0();
  const show = (h, z) => k * 1.25 - (1 - (z - 120) / 1500) * .35 - h * .25 > 0;
  ctx.lineCap = 'round';
  /* horizonte */
  const hy = PJ(0, 0, 1e6)[1]; ctx.strokeStyle = `rgba(${SKC},.25)`; ctx.setLineDash([6, 8]); ctx.beginPath(); ctx.moveTo(-SW / 2, hy); ctx.lineTo(SW / 2, hy); ctx.stroke(); ctx.setLineDash([]);
  /* suelo en cuadrícula */
  for (let x = -2250; x <= 2250; x += 150) if (show(hsh(x, 1), 1200)) skLine([x, 0, Math.max(130, CAM.z + 40)], [x, 0, ZF], .45, 1);
  for (let z = 150; z <= ZF; z += 100) if (z - CAM.z > 40 && show(hsh(z, 2), z)) skLine([-2300, 0, z], [2300, 0, z], .35 + .2 * (z === 700), 1);
  /* muro del fondo */
  if (show(.1, ZF)) {
    for (const y of TRANS) skLine([WALLX[0], y, ZF], [WALLX[1], y, ZF], .6, 1.2);
    for (let x = WALLX[0]; x <= WALLX[1]; x += 100) skLine([x, -60, ZF], [x, -600, ZF], .35, 1);
    for (let x = -2100; x <= 2100; x += 300) { const pts = []; for (let k = 0; k <= 16; k++) { const a = PI + k / 16 * PI; pts.push([x + 150 + Math.cos(a) * 142, -470 + Math.sin(a) * 110, ZF]); } skPoly(pts, .45, 1); }
    if (WS.gone) { ctx.save(); ctx.setLineDash([3, 5]); skPoly([[300, 0, ZF], [300, -600, ZF], [900, -600, ZF], [900, 0, ZF]], .6, 1.2); ctx.restore(); }
  }
  /* costillas del techo */
  for (let i = 0; i < RIBX.length; i += 2) { if (!show(hsh(i, 3), 1000)) continue; const pts = []; for (let j = 0; j <= 24; j++) { const q = ribP(RIBX[i], j / 24 * PI); if (q[2] - CAM.z < 40) break; pts.push(q); } if (pts.length > 1) skPoly(pts, .5, 1.1); }
  /* columnas */
  for (const [x, z] of COLS) if (show(hsh(x, 4), z)) { skLine([x - 9, 0, z], [x - 9, -1150, z], .75, 1.4); skLine([x + 9, 0, z], [x + 9, -1150, z], .75, 1.4); }
  /* mesas como cajas */
  TABLE_AT.forEach(([x, z, , w], i) => { if (!show(hsh(i, 5), z)) return; const d = 34, h = 84, X = [x - w / 2, x + w / 2]; for (const zz of [z - d, z + d]) skPoly([[X[0], 0, zz], [X[0], -h, zz], [X[1], -h, zz], [X[1], 0, zz]], .55, 1); for (const xx of X) skLine([xx, -h, z - d], [xx, -h, z + d], .55, 1); });
  /* plantas: su eje y un abanico de líneas */
  for (const [x, z, sz] of FERNS) if (show(hsh(x, 6), z)) for (let a = -1; a <= 1; a += .5) skLine([x, 0, z], [x + Math.sin(a) * sz, -Math.cos(a) * sz * .8, z], .4, 1);
  for (const [x, z, h] of TFERNS) if (show(hsh(x, 7), z)) { skLine([x, 0, z], [x, -h, z], .55, 1.2); for (let a = -1.4; a <= 1.4; a += .7) skLine([x, -h, z], [x + Math.sin(a) * h * .5, -h + Math.cos(a) * -h * .1 + h * .25, z], .4, 1); }
  /* charcos: su contorno en el plano del suelo */
  for (const P of PUDDLES) if (show(hsh(P.x, 8), P.z) && P.z - CAM.z > 40) skPoly(P.pts.map(([x, z]) => [x, 0, z]), .5, 1, true);
  /* Aguada: la cuadrícula de 22 × 22 píxeles (solo las celdas con color) */
  if (ag && k > .3) {
    const c = agCanvas(ag.f || {}), g = c.grid, cell = AG_CELL, x0 = ag.x - 8.5 * cell, y0 = -(AG_CH) * cell;
    const P = new Path2D(); for (let y = 0; y < AG_CH; y++) for (let i = 0; i < AG_CW; i++) { if (g[y][i] === '.') continue; const a = PJ(x0 + i * cell, y0 + y * cell, ag.z), b = PJ(x0 + (i + 1) * cell, y0 + (y + 1) * cell, ag.z); P.rect(a[0], a[1], b[0] - a[0], b[1] - a[1]); }
    ctx.strokeStyle = `rgba(176,24,38,${.85 * sm((k - .3) / .3)})`; ctx.lineWidth = 1.2; ctx.stroke(P);
  }
}
/* ejes en el pie de Aguada y la fórmula de la perspectiva escrita a mano */
function skAxes(ag, a) {
  if (a < .01) return; ctx.save(); ctx.globalAlpha = a;
  const o = [ag.x + 60, 0, ag.z], L = 120, col = 'rgba(176,24,38,.9)';
  for (const [d, lab] of [[[L, 0, 0], 'x'], [[0, -L, 0], 'y'], [[0, 0, L * 2.2], 'z']]) {
    const p = PJ(...o), q = PJ(o[0] + d[0], o[1] + d[1], o[2] + d[2]); ctx.strokeStyle = col; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(...p); ctx.lineTo(...q); ctx.stroke();
    const dir = nrm2(sub(q, p)); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(...add(q, dir, 9)); ctx.lineTo(...add(q, perp(dir), 5)); ctx.lineTo(...add(q, perp(dir), -5)); ctx.closePath(); ctx.fill();
    hand(lab, ...add(q, dir, 26), 40, col);
  }
  ctx.restore();
}
function skFormula(a) {
  if (a < .01) return; ctx.save(); L0s(); ctx.globalAlpha = a;
  hand('pantalla = (x − cámara) · f / z', -SW / 2 + 80, -380, 46, `rgba(${SKC},.9)`, { align: 'left' });
  hand('lo lejano se encoge: así se lee en 3D', -SW / 2 + 84, -330, 32, `rgba(${SKC},.7)`, { align: 'left' });
  ctx.restore(); T0();
}
/* contador de fotogramas (60 por segundo) y el nombre de la capa que se está pintando */
function frameCounter(t, t0, a, label) {
  if (a < .01) return; ctx.save(); L0s(); ctx.globalAlpha = a;
  const n = Math.max(0, Math.floor((t - t0) * 60)) + 1;
  hand('fotograma ' + String(n).padStart(4, '0'), SW / 2 - 70, -400, 44, 'rgba(176,24,38,.85)', { align: 'right' });
  if (label) hand(label, SW / 2 - 70, -350, 36, `rgba(${SKC},.85)`, { align: 'right' });
  ctx.restore(); T0();
}
