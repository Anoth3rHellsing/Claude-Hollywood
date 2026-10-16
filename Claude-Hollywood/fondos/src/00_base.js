'use strict';
/* =====================================================================
   FONDOS · base: utilidades, ruido, papel y lienzo
   Unidades: alto de pantalla = 1000u, origen en el centro, y hacia abajo.
   ===================================================================== */
const TAU = Math.PI * 2, PI = Math.PI;
const clamp = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x;
const lerp = (a, b, t) => a + (b - a) * t;
const sm = t => { t = clamp(t); return t * t * (3 - 2 * t); };
const eio = t => { t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const rg = (t, a, b) => clamp((t - a) / (b - a));
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
let R = mulberry32(1);
const seed = s => { R = mulberry32(s); };
const rnd = (a = 1, b) => b === undefined ? R() * a : a + R() * (b - a);
const ri = (a, b) => Math.floor(rnd(a, b + 1));
const pick = arr => arr[Math.floor(R() * arr.length)];

const NZ = (() => {
  const p = new Uint8Array(512), r = mulberry32(1337), perm = [...Array(256).keys()];
  for (let i = 255; i > 0; i--) { const j = (r() * (i + 1)) | 0; [perm[i], perm[j]] = [perm[j], perm[i]]; }
  for (let i = 0; i < 512; i++) p[i] = perm[i & 255];
  const g = (h, x, y) => { switch (h & 7) { case 0: return x + y; case 1: return -x + y; case 2: return x - y; case 3: return -x - y; case 4: return x; case 5: return -x; case 6: return y; default: return -y; } };
  const f = t => t * t * t * (t * (t * 6 - 15) + 10);
  function n2(x, y) {
    let X = Math.floor(x), Y = Math.floor(y); x -= X; y -= Y; X &= 255; Y &= 255;
    const u = f(x), v = f(y), a = p[X] + Y, b = p[X + 1] + Y;
    return lerp(lerp(g(p[a], x, y), g(p[b], x - 1, y), u), lerp(g(p[a + 1], x, y - 1), g(p[b + 1], x - 1, y - 1), u), v) * 0.75;
  }
  function fbm(x, y, o = 4) { let s = 0, a = .5, fr = 1; for (let i = 0; i < o; i++) { s += a * n2(x * fr, y * fr); fr *= 2.03; a *= .5; } return s; }
  return { n2, fbm };
})();
const N2 = NZ.n2, FBM = NZ.fbm;
function mk(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; }

/* colores: [r,g,b] */
const mixc = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const css = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const shadeC = (c, k) => k < 0 ? mixc(c, [0, 0, 0], -k) : mixc(c, [255, 255, 255], k);
const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const PAPERC = [241, 233, 214];

/* ---------- geometría 2D ---------- */
const add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const nrm2 = v => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l]; };
function area(pts) { let s = 0; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; s += a[0] * b[1] - b[0] * a[1]; } return s / 2; }
const orient = pts => area(pts) < 0 ? pts.slice().reverse() : pts;
function densify(P, mx, closed = true) {
  const o = [], n = P.length;
  for (let i = 0; i < (closed ? n : n - 1); i++) { const a = P[i], b = P[(i + 1) % n], d = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.ceil(d / mx)); for (let j = 0; j < k; j++) o.push([lerp(a[0], b[0], j / k), lerp(a[1], b[1], j / k)]); }
  if (!closed) o.push(P[n - 1]);
  return o;
}
const rect = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];   // (x,y) = esquina superior izquierda
function ell(cx, cy, rx, ry, n = 28, a0 = 0, a1 = TAU) { const o = []; for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n); o.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return o; }
function bbox(pts) { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const p of pts) { if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]; if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; } return [x0, y0, x1, y1]; }
/* tira con grosor a lo largo de una polilínea (cables, barandillas) */
function strip(pts, w) {
  const L = [], Rr = [];
  for (let i = 0; i < pts.length; i++) { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], d = nrm2(sub(b, a)), n = [-d[1] * w / 2, d[0] * w / 2]; L.push(add(pts[i], n)); Rr.push(sub(pts[i], n)); }
  return L.concat(Rr.reverse());
}
/* catenaria aproximada entre dos puntos */
function sag(a, b, s, n = 24) { const o = []; for (let i = 0; i <= n; i++) { const t = i / n; o.push([lerp(a[0], b[0], t), lerp(a[1], b[1], t) + s * 4 * t * (1 - t)]); } return o; }
function pathPolys(polys) { const P = new Path2D(); for (const q of polys) { if (q.length < 2) continue; P.moveTo(q[0][0], q[0][1]); for (let i = 1; i < q.length; i++) P.lineTo(q[i][0], q[i][1]); P.closePath(); } return P; }
function pathLine(pts) { const P = new Path2D(); P.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) P.lineTo(pts[i][0], pts[i][1]); return P; }
/* contorno «a mano»: desplaza los puntos con ruido suave (amt en unidades) */
function wobble(pts, amt, s0 = 0, f = .02, closed = true) {
  const D = densify(pts, 14, closed);
  return D.map((p, i) => [p[0] + N2(p[0] * f + s0, p[1] * f) * amt, p[1] + N2(p[1] * f + 7 + s0, p[0] * f) * amt]);
}

/* ---------- papel y texturas (una vez por tamaño de pantalla) ---------- */
let W = 0, H = 0, U = 1, SW = 1, PAPER = null, GRAIN = null, BLOT = null, FIBER = null;
function makePaper(w, h) {
  const c = mk(w, h), x = c.getContext('2d');
  const g = x.createRadialGradient(w * .5, h * .42, 0, w * .5, h * .5, Math.hypot(w, h) * .62);
  g.addColorStop(0, '#f3ebd8'); g.addColorStop(.6, '#ebe0c7'); g.addColorStop(1, '#d9c7a4');
  x.fillStyle = g; x.fillRect(0, 0, w, h);
  const lw = Math.ceil(w / 10), lh = Math.ceil(h / 10), lc = mk(lw, lh), lg = lc.getContext('2d'), im = lg.createImageData(lw, lh);
  for (let j = 0; j < lh; j++) for (let i = 0; i < lw; i++) { const v = FBM(i * .035 + 3, j * .035 + 9, 5), k = (j * lw + i) * 4; im.data[k] = 150; im.data[k + 1] = 118; im.data[k + 2] = 70; im.data[k + 3] = clamp(v * 1.6 + .3) * 46; }
  lg.putImageData(im, 0, 0); x.globalCompositeOperation = 'multiply'; x.drawImage(lc, 0, 0, w, h); x.globalCompositeOperation = 'source-over';
  return c;
}
/* grano de papel prensado en frío: el pigmento se asienta en los valles (granulado) */
function makeGrain() {
  const s = 256, c = mk(s, s), x = c.getContext('2d'), id = x.createImageData(s, s), d = id.data, r = mulberry32(9);
  for (let j = 0; j < s; j++) for (let i = 0; i < s; i++) {
    const k = (j * s + i) * 4, n = N2(i * .3, j * .3) * .5 + .5, q = r(), v = clamp(n * n * 1.2 + (q > .7 ? (q - .7) * 1.6 : 0));
    d[k] = d[k + 1] = d[k + 2] = 255 - v * 120; d[k + 3] = 255;
  }
  x.putImageData(id, 0, 0); return c;
}
/* manchas de lavado (densidad irregular del pigmento), sin costuras por espejo */
function makeBlot() {
  const s = 384, c = mk(s, s), x = c.getContext('2d'), id = x.createImageData(s, s), d = id.data;
  for (let j = 0; j < s; j++) for (let i = 0; i < s; i++) { const k = (j * s + i) * 4, v = clamp(.5 + FBM(i * .011, j * .011, 4) * 1.1 + N2(i * .09, j * .09) * .12); d[k] = d[k + 1] = d[k + 2] = 255 - v * 70; d[k + 3] = 255; }
  x.putImageData(id, 0, 0);
  const m = mk(s * 2, s * 2), g = m.getContext('2d');
  for (const [sx, sy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) { g.save(); g.translate(sx < 0 ? s * 2 : 0, sy < 0 ? s * 2 : 0); g.scale(sx, sy); g.drawImage(c, 0, 0); g.restore(); }
  return m;
}
/* fibras de papel de color (para el papel recortado) */
function makeFiber() {
  const s = 256, c = mk(s, s), x = c.getContext('2d'), r = mulberry32(31);
  x.fillStyle = '#808080'; x.fillRect(0, 0, s, s);
  const id = x.getImageData(0, 0, s, s), d = id.data;
  for (let j = 0; j < s; j++) for (let i = 0; i < s; i++) { const k = (j * s + i) * 4, v = 128 + N2(i * .5, j * .5) * 22 + (r() - .5) * 14; d[k] = d[k + 1] = d[k + 2] = v; }
  x.putImageData(id, 0, 0);
  x.lineCap = 'round';
  for (let i = 0; i < 260; i++) { const px = r() * s, py = r() * s, a = r() * TAU, l = 4 + r() * 16, b = r() < .5; x.strokeStyle = b ? 'rgba(255,255,255,.22)' : 'rgba(0,0,0,.14)'; x.lineWidth = .6 + r() * .7; x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + Math.cos(a + 1) * l * .5, py + Math.sin(a + 1) * l * .5, px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke(); }
  return c;
}
function resizeTo(w, h) {
  W = w; H = h; U = H / 1000; SW = W / U;
  PAPER = makePaper(W, H);
  if (!GRAIN) { GRAIN = makeGrain(); BLOT = makeBlot(); FIBER = makeFiber(); }
}
