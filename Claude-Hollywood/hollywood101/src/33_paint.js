/* =====================================================================
   BLOQUE 2 · la acuarela de verdad, paso a paso, en una hoja de papel:
   figura simple → deformación recursiva (×1 ×2 ×3) → 20 capas casi transparentes → bordes húmedos → el papel
   (la misma técnica con la que se pinta todo el mundo de la película)
   ===================================================================== */
const PNT = { c: [120, -30], R: 250, col: [200, 96, 34] };
/* una pasada de deformación: cada arista gana un punto medio empujado al azar (gaussiana acotada) */
function deformOnce(P, r, amt) {
  const o = [];
  for (let i = 0; i < P.length; i++) {
    const a = P[i], b = P[(i + 1) % P.length], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], l = Math.hypot(b[0] - a[0], b[1] - a[1]), v = (a[2] ?? 1);
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) - PI / 2 + gaussR(r) * .6, push = Math.abs(gaussR(r)) * l * amt * v;
    o.push(a, [m[0] + Math.cos(ang) * push, m[1] + Math.sin(ang) * push, clamp(v * (.75 + r() * .5), .3, 1.6), m[0], m[1]]);
  }
  return o;
}
let PAINT = null;
function paintInit() {
  const r = mulberry32(2024), base = [];
  for (let i = 0; i < 9; i++) { const a = -PI / 2 + i / 9 * TAU, rr = PNT.R * (.82 + r() * .3); base.push([PNT.c[0] + Math.cos(a) * rr, PNT.c[1] + Math.sin(a) * rr * .9, .6 + r() * .9]); }
  const D = [base]; for (let k = 0; k < 3; k++) D.push(deformOnce(D[k], r, .45));
  const layers = []; for (let k = 0; k < 20; k++) { const rr = mulberry32(900 + k); let P = D[3]; for (let j = 0; j < 3; j++) P = deformOnce(P, rr, .32); layers.push(P); }
  /* la misma pintura en un lienzo (para el caballete del mundo) */
  const S = 300, c = mk(S * 2, S * 2), g = c.getContext('2d'); g.setTransform(1, 0, 0, 1, S - PNT.c[0], S - PNT.c[1]);
  for (const P of layers) { g.fillStyle = cssc(PNT.col, .075); g.fill(pPolys([P])); }
  for (const P of layers.slice(0, 6)) { g.strokeStyle = cssc(shc(PNT.col, -.35), .07); g.lineWidth = 2.2; g.stroke(pPolys([P])); }
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-atop'; g.globalAlpha = .35; g.fillStyle = g.createPattern(GRAIN, 'repeat'); g.fillRect(0, 0, S * 2, S * 2);
  PAINT = { D, layers, c };
}
/* la hoja: papel con cinta en las esquinas (pantalla, en unidades de escena) */
function sheet(x, y, w, h, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  ctx.fillStyle = 'rgba(60,40,24,.28)'; ctx.fillRect(-w / 2 + 10, -h / 2 + 14, w, h);
  ctx.fillStyle = '#f5eedd'; ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = .16; ctx.fillStyle = ctx.createPattern(GRAIN, 'repeat'); ctx.fillRect(-w / 2, -h / 2, w, h); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'rgba(232,220,180,.75)'; for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { ctx.save(); ctx.translate(sx * (w / 2 - 20), sy * (h / 2 - 12)); ctx.rotate(sx * sy * .7); ctx.fillRect(-46, -14, 92, 28); ctx.restore(); }
  ctx.restore();
}
function drawPolyPts(P, k = 1) { const Q = P.map((p, i) => i & 1 && p[3] !== undefined ? [lerp(p[3], p[0], k), lerp(p[4], p[1], k)] : p); return Q; }
/* lt = tiempo desde el inicio del bloque (57.0 = L05) */
function paintDemo(t) {
  const D = PAINT.D, L = PAINT.layers, ink = 'rgba(42,33,28,.85)';
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#d9cdb4'; ctx.fillRect(0, 0, W, H); ctx.restore(); L0s();
  sheet(60, -10, SW * .78, 860, -.012);
  /* 1 · la figura simple: se traza arista por arista */
  const f0 = clamp((t - 57.6) / 1.8), defK = t < 62.4 ? 0 : t < 64.1 ? 1 : t < 65.8 ? 2 : 3;
  const mor = defK ? easeOut((t - [0, 62.4, 64.1, 65.8][defK]) / .9) : 1;
  const layerN = clamp(Math.floor((t - 68.8) / .31) + 1, 0, 20), lineA = 1 - sm((t - 69.5) / 2.5);
  /* las capas (fondo de todo) */
  for (let i = 0; i < layerN; i++) { const age = t - (68.8 + i * .31); ctx.fillStyle = cssc(PNT.col, .075 * sm(age / .2)); ctx.fill(pPolys([L[i]])); }
  /* bordes húmedos: el pigmento se acumula en el borde de cada capa */
  const wet = sm((t - 75.6) / 1.4);
  if (wet > .01) for (const P of L.slice(0, 10)) { ctx.strokeStyle = cssc(shc(PNT.col, -.4), .1 * wet); ctx.lineWidth = 3; ctx.stroke(pPolys([P])); }
  /* el papel que respira: grano solo donde hay pigmento */
  const pap = sm((t - 77.6) / 1.2);
  if (pap > .01 && layerN) { ctx.save(); ctx.clip(pPolys([L[0]])); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = .55 * pap; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = ctx.createPattern(GRAIN, 'repeat'); ctx.fillRect(0, 0, W, H); ctx.restore(); L0s(); }
  /* el contorno (figura y deformaciones) con sus vértices */
  if (lineA > .01 && t > 57.6) {
    const P = defK ? drawPolyPts(D[defK], mor) : D[0], n = P.length, upto = defK ? n : Math.floor(f0 * n);
    ctx.globalAlpha = lineA; ctx.strokeStyle = ink; ctx.lineWidth = 2.4; ctx.lineJoin = 'round'; ctx.beginPath();
    for (let i = 0; i <= upto; i++) { const p = P[i % n]; i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }
    if (!defK && upto < n) { const a = P[upto % n], b = P[(upto + 1) % n], fr = f0 * n - upto; ctx.lineTo(lerp(a[0], b[0], fr), lerp(a[1], b[1], fr)); }
    ctx.stroke();
    for (let i = 0; i < (defK ? n : upto + 1); i++) { const p = P[i % n], nu = defK && (i & 1); ctx.fillStyle = nu ? 'rgba(176,24,38,.9)' : ink; ctx.beginPath(); ctx.arc(p[0], p[1], nu ? 4.5 : 5.5 - defK * 1.2, 0, TAU); ctx.fill(); }
    ctx.globalAlpha = 1;
  }
  /* rótulos a mano */
  const lab = (txt, x, y, a, size = 40, col = 'rgba(42,33,28,.85)') => { if (a > .01) { ctx.save(); ctx.globalAlpha = a; hand(txt, x, y, size, col); ctx.restore(); } };
  lab('una figura simple', PNT.c[0], PNT.c[1] - 330, win(t, 58.4, 62.4, .4, .3));
  if (defK) lab('deformar ×' + defK, PNT.c[0], PNT.c[1] - 330, win(t, 62.4, 67.9, .3, .4), 46, 'rgba(176,24,38,.9)');
  if (layerN) lab('capa ' + layerN + ' / 20', PNT.c[0], PNT.c[1] - 330, win(t, 68.8, 75.4, .3, .4), 46, 'rgba(176,24,38,.9)');
  const arrow = (x0, y0, x1, y1, a) => { if (a < .01) return; ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = 'rgba(42,33,28,.8)'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo((x0 + x1) / 2, Math.min(y0, y1) - 40, x1, y1); ctx.stroke(); const d = nrm2([x1 - (x0 + x1) / 2, y1 - (Math.min(y0, y1) - 40)]); ctx.fillStyle = 'rgba(42,33,28,.8)'; ctx.beginPath(); ctx.moveTo(x1 + d[0] * 8, y1 + d[1] * 8); ctx.lineTo(x1 - d[1] * 6, y1 + d[0] * 6); ctx.lineTo(x1 + d[1] * 6, y1 - d[0] * 6); ctx.closePath(); ctx.fill(); ctx.restore(); };
  const ew = L[0][Math.floor(L[0].length * .12)];
  lab('borde húmedo', ew[0] + 230, ew[1] - 60, win(t, 75.8, 80.6, .4, .5), 40); arrow(ew[0] + 160, ew[1] - 55, ew[0] + 18, ew[1] - 4, win(t, 75.8, 80.6, .4, .5));
  lab('el papel respira', PNT.c[0] - 300, PNT.c[1] + 330, win(t, 77.7, 80.6, .4, .5), 40); arrow(PNT.c[0] - 200, PNT.c[1] + 305, PNT.c[0] - 70, PNT.c[1] + 160, win(t, 77.7, 80.6, .4, .5));
  T0();
}
/* el caballete en el mundo, con la pintura terminada */
const EASEL = { x: -560, z: 760 };
function drawEasel(t) {
  const { x, z } = EASEL, s = PS(z); if (z - CAM.z < 40) return;
  const leg = (dx0, dx1, y1) => { const a = PJ(x + dx0, 0, z), b = PJ(x + dx1, y1, z); ctx.strokeStyle = cssc(WOOD); ctx.lineWidth = Math.max(1, 5 * s); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke(); };
  leg(-50, -8, -230); leg(50, 8, -230); leg(0, 0, -215);
  const r = easelRect(); ctx.fillStyle = 'rgba(60,40,24,.25)'; ctx.fillRect(r[0] + 3 * s, r[1] + 4 * s, r[2], r[3]);
  ctx.fillStyle = '#f5eedd'; ctx.fillRect(...r);
  ctx.drawImage(PAINT.c, r[0] + r[2] * .06, r[1] + r[3] * .04, r[2] * .88, r[3] * .92);
  const tray = PJ(x - 66, -72, z), tray2 = PJ(x + 66, -66, z); ctx.fillStyle = cssc(shc(WOOD, -.15)); ctx.fillRect(tray[0], tray[1], tray2[0] - tray[0], 6 * s);
}
function easelRect() { const a = PJ(EASEL.x - 62, -200, EASEL.z - 4), b = PJ(EASEL.x + 62, -78, EASEL.z - 4); return [a[0], a[1], b[0] - a[0], b[1] - a[1]]; }
