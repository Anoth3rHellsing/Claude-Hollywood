/* =====================================================================
   EL INVERNADERO · utilidades de acuarela para pintar sprites una vez
   (lo aprendido en el Atlas: reservar papel, dos veladuras mal registradas,
    borde húmedo, floración, granulado solo donde hay pigmento, plumilla con bordes perdidos)
   ===================================================================== */
const PAPC = [241, 233, 214], INKC = [30, 24, 28];
const cssc = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const mixc = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const shc = (c, k) => k < 0 ? mixc(c, [0, 0, 0], -k) : mixc(c, [255, 255, 255], k);
let BLOT = null;
function makeBlot() {
  const s = 384, c = mk(s, s), x = c.getContext('2d'), id = x.createImageData(s, s), d = id.data;
  for (let j = 0; j < s; j++) for (let i = 0; i < s; i++) { const k = (j * s + i) * 4, v = clamp(.5 + FBM(i * .011, j * .011, 4) * 1.1 + N2(i * .09, j * .09) * .12); d[k] = d[k + 1] = d[k + 2] = 255 - v * 70; d[k + 3] = 255; }
  x.putImageData(id, 0, 0);
  const m = mk(s * 2, s * 2), g = m.getContext('2d');
  for (const [sx, sy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) { g.save(); g.translate(sx < 0 ? s * 2 : 0, sy < 0 ? s * 2 : 0); g.scale(sx, sy); g.drawImage(c, 0, 0); g.restore(); }
  return m;
}
function dens(P, mx, closed = true) {
  const o = [], n = P.length;
  for (let i = 0; i < (closed ? n : n - 1); i++) { const a = P[i], b = P[(i + 1) % n], d = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.ceil(d / mx)); for (let j = 0; j < k; j++) o.push([lerp(a[0], b[0], j / k), lerp(a[1], b[1], j / k)]); }
  if (!closed) o.push(P[n - 1]);
  return o;
}
function wob(pts, amt, s0 = 0, f = .02, closed = true, step = 8) {
  return dens(pts, step, closed).map(p => [p[0] + N2(p[0] * f + s0, p[1] * f) * amt, p[1] + N2(p[1] * f + 7 + s0, p[0] * f) * amt]);
}
function pPolys(polys) { const P = new Path2D(); for (const q of polys) { if (q.length < 2) continue; P.moveTo(q[0][0], q[0][1]); for (let i = 1; i < q.length; i++) P.lineTo(q[i][0], q[i][1]); P.closePath(); } return P; }
function pLine(pts) { const P = new Path2D(); P.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) P.lineTo(pts[i][0], pts[i][1]); return P; }
function bbx(pts) { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const p of pts) { if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]; if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; } return [x0, y0, x1, y1]; }
const rectP = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
function ellP(cx, cy, rx, ry, n = 28, a0 = 0, a1 = TAU) { const o = []; for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n); o.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return o; }
function stripP(pts, w) {
  const L = [], Rr = [];
  for (let i = 0; i < pts.length; i++) { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], d = nrm2(sub(b, a)), ww = typeof w === 'function' ? w(i / (pts.length - 1)) : w, n = [-d[1] * ww / 2, d[0] * ww / 2]; L.push(add(pts[i], n)); Rr.push(sub(pts[i], n)); }
  return L.concat(Rr.reverse());
}
/* lavado: reserva de papel + dos veladuras + borde húmedo (+ floración opcional) */
function wcWash(g, pts, col, a, o = {}) {
  const s = o.seed ?? Math.random() * 99, amt = o.amt ?? 1.6, f = o.f ?? .05, bb = bbx(pts);
  const P1 = pPolys([wob(pts, amt, s, f, true, o.step ?? 6)]);
  if (o.reserve !== false) { g.save(); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.fillStyle = cssc(o.paper || PAPC); g.fill(P1); g.restore(); }
  g.save(); g.globalCompositeOperation = o.mode || 'multiply';
  const gr = g.createLinearGradient(bb[0], bb[1], o.gx ? bb[2] : bb[0], bb[3]);
  gr.addColorStop(0, cssc(shc(col, o.top ?? .1))); gr.addColorStop(1, cssc(shc(col, -(o.bot ?? .12))));
  g.globalAlpha = a; g.fillStyle = gr; g.fill(P1);
  const ar = (bb[2] - bb[0]) * (bb[3] - bb[1]);
  if (ar > 60 && o.glaze !== false) { const dx = (N2(s, 1) * 2) * amt * 1.6, dy = (N2(s, 2) * 2) * amt * 1.2; const P2 = pPolys([wob(pts.map(p => [p[0] + dx, p[1] + dy]), amt * 1.3, s + 4, f * .8, true, o.step ?? 6)]); g.globalAlpha = a * .4; g.fillStyle = cssc(col); g.fill(P2); }
  if (o.bloom && ar > 200) { g.save(); g.clip(P1); const px = lerp(bb[0], bb[2], .3 + .4 * (N2(s, 3) + .5)), py = lerp(bb[1], bb[3], .3 + .4 * (N2(s, 4) + .5)), rr = Math.max(bb[2] - bb[0], bb[3] - bb[1]) * .6, cc = o.bloom; const rgd = g.createRadialGradient(px, py, 0, px, py, rr); rgd.addColorStop(0, cssc(cc, .45)); rgd.addColorStop(1, cssc(cc, 0)); g.globalAlpha = 1; g.fillStyle = rgd; g.fillRect(px - rr, py - rr, rr * 2, rr * 2); g.restore(); }
  if (o.edge !== false) { g.globalAlpha = (o.edgeA ?? .32) * Math.min(1, a * 1.4); g.strokeStyle = cssc(shc(col, -.4)); g.lineWidth = o.edgeW ?? 1.2; g.stroke(P1); }
  g.restore();
  return P1;
}
/* textura de acuarela sobre lo pintado (multiplica manchas y grano solo donde hay pigmento) */
function wcTex(g, w, h, a = .5, gr = .3) {
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-atop';
  const tmp = mk(w, h), tg = tmp.getContext('2d');
  tg.fillStyle = tg.createPattern(BLOT, 'repeat'); tg.fillRect(0, 0, w, h);
  tg.globalAlpha = gr / Math.max(.01, a); tg.globalCompositeOperation = 'multiply'; tg.fillStyle = tg.createPattern(GRAIN, 'repeat'); tg.fillRect(0, 0, w, h);
  tg.globalAlpha = 1; tg.globalCompositeOperation = 'destination-in'; tg.drawImage(g.canvas, 0, 0);   // solo donde hay pigmento
  g.globalCompositeOperation = 'multiply'; g.globalAlpha = a; g.drawImage(tmp, 0, 0);
  g.restore();
}
/* plumilla con bordes perdidos */
function wcInk(g, pts, w, a, s, lost = .15, col = INKC) {
  const D = dens(pts, 5, false).map((p, i) => [p[0] + N2(i * .3, s) * .5, p[1] + N2(i * .3 + 5, s) * .5]);
  g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = cssc(col, a); g.lineWidth = w;
  let pen = false; g.beginPath();
  for (let i = 0; i < D.length; i++) { const on = N2(i * .17, s + 3) * .5 + .5 > lost; if (on) { if (pen) g.lineTo(D[i][0], D[i][1]); else { g.moveTo(D[i][0], D[i][1]); pen = true; } } else pen = false; }
  g.stroke();
}
/* lienzo de sprite en unidades de mundo: box = [x0,y0,x1,y1], d = px por unidad */
function spr(box, d) { const c = mk((box[2] - box[0]) * d, (box[3] - box[1]) * d), g = c.getContext('2d'); g.setTransform(d, 0, 0, d, -box[0] * d, -box[1] * d); return { c, g, box, d }; }
/* oscurecer un sprite ya pintado (luz de noche) sin tocar lo transparente */
function nightBake(S, col, a = 1) {
  const c = S.c, t = mk(c.width, c.height), g = t.getContext('2d');
  g.fillStyle = `rgb(${col})`; g.fillRect(0, 0, c.width, c.height); g.globalCompositeOperation = 'destination-in'; g.drawImage(c, 0, 0);
  const sg = c.getContext('2d'); sg.save(); sg.setTransform(1, 0, 0, 1, 0, 0); sg.globalCompositeOperation = 'multiply'; sg.globalAlpha = a; sg.drawImage(t, 0, 0); sg.restore();
}
