'use strict';
/* =====================================================================
   KURENAI · 紅 — motor de acuarela / sumi-e en Canvas 2D (vanilla JS)
   ===================================================================== */
const TAU = Math.PI * 2, PI = Math.PI;
const clamp = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x;
const lerp = (a, b, t) => a + (b - a) * t;
const sm = t => { t = clamp(t); return t * t * (3 - 2 * t); };
const eio = t => { t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const eo = t => 1 - Math.pow(1 - clamp(t), 3);
const ei = t => Math.pow(clamp(t), 3);
const rg = (t, a, b) => clamp((t - a) / (b - a));
const fade = (t, a, b, fi = 1, fo = 1) => Math.min(sm((t - a) / fi), sm((b - t) / fo));

function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
let R = mulberry32(1);
const seed = s => { R = mulberry32(s); };
const rnd = (a = 1, b) => b === undefined ? R() * a : a + R() * (b - a);
const pick = a => a[(R() * a.length) | 0];
function gauss() { let u = 0, v = 0; while (!u) u = R(); while (!v) v = R(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v); }

/* ---------- ruido de gradiente 2D ---------- */
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

/* ---------- estado global de render ---------- */
let cv, ctx, W = 0, H = 0, U = 1, SW = 1;         // px, px por unidad, ancho de escena en unidades (alto = 1000u)
const QB = 0.72;                                   // calidad de sprites grandes (la acuarela es suave)
let CAM = { z: 1, x: 0, y: 0 }, SHK = 0, SX = 0, SY = 0, SA = 1, LOWQ = false;
const INK = '24,20,18', CRIM = '176,24,38';

/* capa con parallax: coordenadas en unidades, (0,0) = centro de pantalla */
function L(d = 1) {
  const z = 1 + (CAM.z - 1) * d, s = U * z;
  ctx.setTransform(s, 0, 0, s, W / 2 - CAM.x * d * s + SX * d, H / 2 - CAM.y * d * s + SY * d);
}
function L0() { ctx.setTransform(U, 0, 0, U, W / 2, H / 2); }
function mode(m) { ctx.globalCompositeOperation = m; }

/* sprite en unidades */
function Spr(x0, y0, x1, y1, q = QB) {
  const k = U * q, c = mk((x1 - x0) * k, (y1 - y0) * k), g = c.getContext('2d');
  g.setTransform(k, 0, 0, k, -x0 * k, -y0 * k);
  return { c, g, x0, y0, x1, y1, k, w: x1 - x0, h: y1 - y0 };
}
function dS(sp, x = 0, y = 0, s = 1, r = 0, a = 1, img) {
  const im = img === undefined ? sp.c : img; if (!im) return;
  const al = a * SA; if (al <= 0.003) return;
  ctx.globalAlpha = Math.min(1, al);
  if (r || s !== 1 || x || y) { ctx.save(); ctx.translate(x, y); if (r) ctx.rotate(r); if (s !== 1) ctx.scale(s, s); ctx.drawImage(im, sp.x0, sp.y0, sp.w, sp.h); ctx.restore(); }
  else ctx.drawImage(im, sp.x0, sp.y0, sp.w, sp.h);
  ctx.globalAlpha = 1;
}

/* ---------- geometría ---------- */
function polyPath(g, q) { g.beginPath(); g.moveTo(q[0][0], q[0][1]); for (let i = 1; i < q.length; i++) g.lineTo(q[i][0], q[i][1]); g.closePath(); }
function circlePts(cx, cy, r, n = 32, v = 1) { const o = []; for (let i = 0; i < n; i++) { const a = i / n * TAU; o.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r, v]); } return o; }
function catmull(P, seg = 8) {
  const o = [];
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
    for (let s = 0; s < seg; s++) {
      const t = s / seg, t2 = t * t, t3 = t2 * t;
      o.push([.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
              .5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)]);
    }
  }
  o.push(P[P.length - 1].slice(0, 2));
  return o;
}

/* ---------- acuarela: deformación recursiva (lavado por capas) ---------- */
function deform(P, depth, amt) {
  for (let d = 0; d < depth; d++) {
    const N = [];
    for (let i = 0; i < P.length; i++) {
      const a = P[i], b = P[(i + 1) % P.length];
      N.push(a);
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]), v = Math.min(1.6, (a[2] + b[2]) / 2), ang = R() * TAU, m = clamp(gauss(), -2, 2) * len * amt * v;
      N.push([(a[0] + b[0]) / 2 + Math.cos(ang) * m, (a[1] + b[1]) / 2 + Math.sin(ang) * m, v * (0.65 + R() * 0.5)]);
    }
    P = N;
  }
  return P;
}
function densify(P, mx) {
  const o = [];
  for (let i = 0; i < P.length; i++) {
    const a = P[i], b = P[(i + 1) % P.length], l = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.ceil(l / mx);
    for (let k = 0; k < n; k++) { const t = k / n; o.push([lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]); }
  }
  return o;
}
function wash(g, pts, col, o = {}) {
  const L = o.layers ?? 22, A = o.alpha ?? 0.05, amt = o.amt ?? 0.4;
  const base = deform(densify(pts.map(p => [p[0], p[1], p[2] ?? 1]), o.seg ?? 36), o.base ?? 2, amt);
  g.fillStyle = `rgb(${col})`;
  for (let l = 0; l < L; l++) {
    const q = deform(base, o.per ?? 3, amt);
    g.globalAlpha = A * (0.6 + R() * 0.8);
    polyPath(g, q); g.fill();
  }
  if (o.edge) { // oscurecimiento de borde (pigmento acumulado al secar)
    g.strokeStyle = `rgb(${col})`; g.lineJoin = 'round';
    for (let i = 0; i < 3; i++) { const q = deform(base, 1, amt * .3); g.globalAlpha = o.edge * (0.5 + R() * .5); g.lineWidth = o.edgeW ?? 1.2; polyPath(g, q); g.stroke(); }
  }
  g.globalAlpha = 1;
}
/* granulación: poros del papel retirando pigmento */
let GRAIN = null;
function granulate(sp, a = 0.35) {
  const g = sp.g; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'destination-out'; g.globalAlpha = a;
  g.fillStyle = g.createPattern(GRAIN, 'repeat'); g.fillRect(0, 0, sp.c.width, sp.c.height); g.restore();
}
function fadeOut(sp, y0, y1, dir = 1) { // borra hacia abajo (dir 1) o arriba (-1): niebla
  const g = sp.g; g.save(); g.globalCompositeOperation = 'destination-out';
  const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,1)');
  g.fillStyle = gr; if (dir > 0) g.fillRect(sp.x0, y0, sp.w, sp.y1 - y0); else g.fillRect(sp.x0, sp.y0, sp.w, y0 - sp.y0);
  g.restore();
}

/* ---------- pincel caligráfico con cerdas y pincel seco ---------- */
function brush(g, pts, o = {}) {
  const n = pts.length; if (n < 2) return;
  const Ls = new Float32Array(n); for (let i = 1; i < n; i++) Ls[i] = Ls[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  const tot = Ls[n - 1] || 1, endL = tot * (o.prog ?? 1); if (endL <= 0) return;
  const Wf = o.w || (() => 4), dryS = o.dryStart ?? 0.7, col = o.col || INK, A = o.a ?? 0.9, body = o.body ?? 0.82;
  const rr = mulberry32(o.seed || 7);
  const nx = new Float32Array(n), ny = new Float32Array(n);
  for (let i = 0; i < n; i++) { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)]; let tx = b[0] - a[0], ty = b[1] - a[1]; const l = Math.hypot(tx, ty) || 1; nx[i] = -ty / l; ny[i] = tx / l; }
  let m = 0; while (m < n - 1 && Ls[m + 1] <= endL) m++;
  let maxW = 0; for (let i = 0; i <= m; i++) maxW = Math.max(maxW, Wf(Ls[i] / tot));
  const bodyW = u => Wf(u) * body * (1 - sm((u - dryS) / (1 - dryS + 1e-6))) * 0.5;
  g.fillStyle = `rgba(${col},${A})`;
  g.beginPath();
  for (let i = 0; i <= m; i++) { const w = bodyW(Ls[i] / tot); g.lineTo(pts[i][0] + nx[i] * w, pts[i][1] + ny[i] * w); }
  for (let i = m; i >= 0; i--) { const w = bodyW(Ls[i] / tot); g.lineTo(pts[i][0] - nx[i] * w, pts[i][1] - ny[i] * w); }
  g.closePath(); g.fill();
  const B = o.bristles ?? 8, sd = o.seed || 1, step = o.step || 1;
  g.lineCap = 'round';
  for (let b = 0; b < B; b++) {
    const off = (B === 1 ? 0 : (b / (B - 1) * 2 - 1)) * 0.92 + (rr() - .5) * 0.12;
    g.lineWidth = o.bw ?? Math.max(0.25, maxW / B * 1.25);
    g.strokeStyle = `rgba(${col},${A * (0.25 + rr() * 0.5)})`;
    g.beginPath(); let pen = false;
    for (let i = 0; i <= m; i += step) {
      const u = Ls[i] / tot, dry = u > dryS ? (u - dryS) / (1 - dryS) : 0;
      const vis = N2(b * 7.31 + sd, Ls[i] * (o.dryFreq ?? 0.045)) * 0.5 + 0.5 > dry * 0.85 + (o.dryAll ?? 0.06);
      const w = Wf(u) * 0.5 * off, x = pts[i][0] + nx[i] * w, y = pts[i][1] + ny[i] * w;
      if (vis) { if (pen) g.lineTo(x, y); else { g.moveTo(x, y); pen = true; } } else pen = false;
    }
    g.stroke();
  }
}

/* ---------- SANGRADO DE TINTA: mapas de tiempo de llegada ---------- */
function alphaLow(sp, w, h) {
  const c = mk(w, h), g = c.getContext('2d'); g.drawImage(sp.c, 0, 0, w, h);
  const d = g.getImageData(0, 0, w, h).data, a = new Uint8Array(w * h);
  for (let i = 0; i < a.length; i++) a[i] = d[i * 4 + 3];
  return a;
}
// semillas: [{x,y,d}] en unidades; d = retraso en unidades de distancia
function tmSeeds(sp, seeds, o = {}) {
  const res = o.res ?? 4, w = Math.ceil(sp.c.width / res), h = Math.ceil(sp.c.height / res);
  const a = alphaLow(sp, w, h), t = new Float32Array(w * h), up = sp.w / w, amp = o.amp ?? 0.22, ns = o.ns ?? 0.01;
  let mn = 1e9, mx = -1e9;
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const k = j * w + i; if (a[k] < 5) { t[k] = Infinity; continue; }
    const ux = sp.x0 + (i + .5) * up, uy = sp.y0 + (j + .5) * up;
    let best = 1e9; for (const s of seeds) { const d = Math.hypot((ux - s.x) * (s.kx || 1), (uy - s.y) * (s.ky || 1)) + (s.d || 0); if (d < best) best = d; }
    t[k] = best;
    if (best < mn) mn = best; if (best > mx) mx = best;
  }
  const span = Math.max(1, mx - mn);
  mn = 1e9; mx = -1e9;
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const k = j * w + i; if (t[k] === Infinity) continue;
    const ux = sp.x0 + (i + .5) * up, uy = sp.y0 + (j + .5) * up;
    const v = t[k] / span + FBM(ux * ns + 13.1, uy * ns + 7.7, 4) * amp;
    t[k] = v; if (v < mn) mn = v; if (v > mx) mx = v;
  }
  const sp2 = mx - mn || 1; for (let k = 0; k < t.length; k++) if (t[k] !== Infinity) t[k] = (t[k] - mn) / sp2;
  return { t, w, h };
}
// trazos: [{a:[x,y], b:[x,y], w, t}] — el pincel "crece" a lo largo de las ramas
function tmStrokes(sp, segs, o = {}) {
  const res = o.res ?? 4, w = Math.ceil(sp.c.width / res), h = Math.ceil(sp.c.height / res);
  const a = alphaLow(sp, w, h), c = mk(w, h), g = c.getContext('2d'), s = w / sp.w;
  g.setTransform(s, 0, 0, s, -sp.x0 * s, -sp.y0 * s); g.lineCap = 'round';
  const S = segs.slice().sort((p, q) => q.t - p.t);
  for (const q of S) { const v = Math.round(clamp(q.t) * 250) + 2; g.strokeStyle = `rgb(${v},${v},${v})`; g.lineWidth = q.w * 1.5 + 3 / s; g.beginPath(); g.moveTo(q.a[0], q.a[1]); g.lineTo(q.b[0], q.b[1]); g.stroke(); }
  const d = g.getImageData(0, 0, w, h).data, t = new Float32Array(w * h), up = sp.w / w, amp = o.amp ?? 0.04;
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const k = j * w + i; if (a[k] < 5) { t[k] = Infinity; continue; }
    const v = d[k * 4 + 3] > 20 ? (d[k * 4] - 2) / 250 : 1;
    t[k] = clamp(v * (1 - amp) + (N2((sp.x0 + i * up) * .05, (sp.y0 + j * up) * .05) * .5 + .5) * amp);
  }
  return { t, w, h };
}
class Bleed {
  constructor(sp, tm, o = {}) {
    this.sp = sp; this.tm = tm; this.soft = o.soft ?? 0.07; this.edge = o.edge ?? 0.5;
    const ec = (o.edgeCol || INK).split(',').map(Number); this.ec = ec;
    this.out = null; this.lp = -1;
  }
  alloc() {
    const { w, h } = this.tm;
    this.mask = mk(w, h); this.mg = this.mask.getContext('2d'); this.img = this.mg.createImageData(w, h);
    this.ring = mk(w, h); this.rg = this.ring.getContext('2d'); this.rimg = this.rg.createImageData(w, h);
    this.out = mk(this.sp.c.width, this.sp.c.height); this.og = this.out.getContext('2d');
    const d = this.rimg.data; for (let i = 0; i < d.length; i += 4) { d[i] = this.ec[0]; d[i + 1] = this.ec[1]; d[i + 2] = this.ec[2]; }
  }
  free() { if (this.out) { this.out.width = this.out.height = 1; this.out = null; this.lp = -1; } }
  get(p) {
    if (p <= 0) return null;
    if (p >= 1) { if (this.out) this.free(); return this.sp.c; }
    if (!this.out) this.alloc();
    if (Math.abs(p - this.lp) < 0.0007) return this.out;
    this.lp = p;
    const S = this.soft, T = p * (1 + S * 1.5) - S * 0.5, t = this.tm.t, md = this.img.data, rd = this.rimg.data, E = this.edge * 255, inv = 1 / S;
    for (let k = 0, j = 3; k < t.length; k++, j += 4) {
      const tk = t[k]; if (tk === Infinity) { md[j] = 0; rd[j] = 0; continue; }
      let a = (T - tk) * inv; if (a <= 0) { md[j] = 0; rd[j] = 0; continue; }
      if (a >= 1) { md[j] = 255; const r = (a - 1) * 1.6; rd[j] = r < 1 ? E * (1 - r) * (1 - r) * .55 : 0; continue; }
      md[j] = a * 255; rd[j] = E * a;
    }
    this.mg.putImageData(this.img, 0, 0); this.rg.putImageData(this.rimg, 0, 0);
    const g = this.og, W2 = this.out.width, H2 = this.out.height;
    g.globalCompositeOperation = 'copy'; g.drawImage(this.sp.c, 0, 0);
    g.globalCompositeOperation = 'destination-in'; g.drawImage(this.mask, 0, 0, W2, H2);
    g.globalCompositeOperation = 'source-atop'; g.drawImage(this.ring, 0, 0, W2, H2);
    g.globalCompositeOperation = 'source-over';
    return this.out;
  }
}

/* ---------- papel ---------- */
function makePaper(w, h) {
  const c = mk(w, h), x = c.getContext('2d');
  const g = x.createRadialGradient(w * .5, h * .42, 0, w * .5, h * .5, Math.hypot(w, h) * .62);
  g.addColorStop(0, '#f1e8d4'); g.addColorStop(.6, '#e9ddc3'); g.addColorStop(1, '#d6c4a0');
  x.fillStyle = g; x.fillRect(0, 0, w, h);
  // manchas de baja frecuencia (pergamino envejecido)
  const lw = Math.ceil(w / 10), lh = Math.ceil(h / 10), lc = mk(lw, lh), lg = lc.getContext('2d'), im = lg.createImageData(lw, lh);
  for (let j = 0; j < lh; j++) for (let i = 0; i < lw; i++) {
    const v = FBM(i * .035 + 3, j * .035 + 9, 5), k = (j * lw + i) * 4, s = clamp(v * 1.6 + .3);
    im.data[k] = 150; im.data[k + 1] = 118; im.data[k + 2] = 70; im.data[k + 3] = s * 52;
  }
  lg.putImageData(im, 0, 0);
  x.globalCompositeOperation = 'multiply'; x.imageSmoothingQuality = 'high'; x.drawImage(lc, 0, 0, w, h);
  x.globalCompositeOperation = 'source-over';
  // fibras
  const nf = (w * h) / 900;
  for (let i = 0; i < nf; i++) {
    const px = R() * w, py = R() * h, l = 3 + R() * 18, a = R() * TAU, b = (R() - .5) * 0.8;
    x.strokeStyle = R() < .55 ? `rgba(110,85,50,${.03 + R() * .05})` : `rgba(255,252,240,${.06 + R() * .1})`;
    x.lineWidth = .4 + R() * .9;
    x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + Math.cos(a + b) * l * .5, py + Math.sin(a + b) * l * .5, px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke();
  }
  // grano por píxel
  const id = x.getImageData(0, 0, w, h), d = id.data;
  for (let i = 0; i < d.length; i += 4) { const n = (R() - .5) * 14; d[i] += n; d[i + 1] += n; d[i + 2] += n * .9; }
  x.putImageData(id, 0, 0);
  return c;
}
function makeTexture(w, h) { // textura neutra (gris 50%) para soft-light sobre la pintura
  const c = mk(w, h), x = c.getContext('2d'); x.fillStyle = '#808080'; x.fillRect(0, 0, w, h);
  const nf = (w * h) / 700;
  for (let i = 0; i < nf; i++) {
    const px = R() * w, py = R() * h, l = 2 + R() * 14, a = R() * TAU;
    x.strokeStyle = R() < .5 ? `rgba(40,30,20,${.08 + R() * .1})` : `rgba(255,255,255,${.1 + R() * .12})`;
    x.lineWidth = .5 + R(); x.beginPath(); x.moveTo(px, py); x.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke();
  }
  const id = x.getImageData(0, 0, w, h), d = id.data;
  for (let i = 0; i < d.length; i += 4) { const n = (R() - .5) * 46; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
  x.putImageData(id, 0, 0);
  return c;
}
function makeVignette(w, h) {
  const c = mk(w, h), x = c.getContext('2d');
  const g = x.createRadialGradient(w / 2, h / 2, Math.min(w, h) * .32, w / 2, h / 2, Math.hypot(w, h) * .6);
  g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(120,95,60,0.55)');
  x.fillStyle = '#fff'; x.fillRect(0, 0, w, h); x.fillStyle = g; x.fillRect(0, 0, w, h);
  return c;
}
function makeGrain() {
  const c = mk(256, 256), x = c.getContext('2d'), id = x.createImageData(256, 256), d = id.data;
  for (let j = 0; j < 256; j++) for (let i = 0; i < 256; i++) {
    const k = (j * 256 + i) * 4, n = N2(i * .35, j * .35) * .5 + .5, r = R();
    d[k] = d[k + 1] = d[k + 2] = 0; d[k + 3] = (r > .62 ? (r - .62) * 2.6 * 255 : 0) * .6 + n * n * 70;
  }
  x.putImageData(id, 0, 0); return c;
}
