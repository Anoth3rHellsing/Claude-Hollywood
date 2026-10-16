'use strict';
/* =====================================================================
   LABORATORIO · base: utilidades, ruido, papel, lienzo, geometría
   Unidades: alto de escena = 1000u, origen en el centro (como el motor).
   ===================================================================== */
const TAU = Math.PI * 2, PI = Math.PI;
const clamp = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x;
const lerp = (a, b, t) => a + (b - a) * t;
const sm = t => { t = clamp(t); return t * t * (3 - 2 * t); };
const eio = t => { t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
let R = mulberry32(1);
const rnd = (a = 1, b) => b === undefined ? R() * a : a + R() * (b - a);

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

/* ---------- lienzo ---------- */
const cv = document.getElementById('cv'), ctx = cv.getContext('2d');
let W = 0, H = 0, U = 1, SW = 1, PAPER = null, FX = null, fx = null;
let GRAIN = null, WASHTEX = null, HATCH = null, HATCH2 = null;
let SHX = 0, SHY = 0;                               // temblor de cámara (px)
function T0(g = ctx) { g.setTransform(U, 0, 0, U, W / 2 + SHX, H / 2 + SHY); }
function resize() {
  const r = cv.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = Math.max(320, Math.round(r.width * dpr)), h = Math.max(180, Math.round(r.height * dpr));
  if (w === W && h === H) return;
  W = cv.width = w; H = cv.height = h; U = H / 1000; SW = W / U;
  PAPER = makePaper(W, H); FX = mk(W, H); fx = FX.getContext('2d');
}
function makePaper(w, h) {
  const c = mk(w, h), x = c.getContext('2d');
  const g = x.createRadialGradient(w * .5, h * .42, 0, w * .5, h * .5, Math.hypot(w, h) * .62);
  g.addColorStop(0, '#f1e8d4'); g.addColorStop(.6, '#e9ddc3'); g.addColorStop(1, '#d6c4a0');
  x.fillStyle = g; x.fillRect(0, 0, w, h);
  const lw = Math.ceil(w / 10), lh = Math.ceil(h / 10), lc = mk(lw, lh), lg = lc.getContext('2d'), im = lg.createImageData(lw, lh);
  for (let j = 0; j < lh; j++) for (let i = 0; i < lw; i++) {
    const v = FBM(i * .035 + 3, j * .035 + 9, 5), k = (j * lw + i) * 4, s = clamp(v * 1.6 + .3);
    im.data[k] = 150; im.data[k + 1] = 118; im.data[k + 2] = 70; im.data[k + 3] = s * 52;
  }
  lg.putImageData(im, 0, 0);
  x.globalCompositeOperation = 'multiply'; x.imageSmoothingQuality = 'high'; x.drawImage(lc, 0, 0, w, h);
  x.globalCompositeOperation = 'source-over';
  const rr = mulberry32(5), nf = (w * h) / 1400;
  x.lineWidth = Math.max(.6, h / 1400);
  for (let i = 0; i < nf; i++) { const px = rr() * w, py = rr() * h, a = rr() * TAU, l = 3 + rr() * 9; x.strokeStyle = `rgba(120,96,60,${.05 + rr() * .07})`; x.beginPath(); x.moveTo(px, py); x.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke(); }
  return c;
}
function makeGrain() {
  const c = mk(256, 256), x = c.getContext('2d'), id = x.createImageData(256, 256), d = id.data, r = mulberry32(9);
  for (let j = 0; j < 256; j++) for (let i = 0; i < 256; i++) {
    const k = (j * 256 + i) * 4, n = N2(i * .35, j * .35) * .5 + .5, q = r();
    d[k] = d[k + 1] = d[k + 2] = 40; d[k + 3] = (q > .62 ? (q - .62) * 2.6 * 255 : 0) * .5 + n * n * 60;
  }
  x.putImageData(id, 0, 0); return c;
}
/* textura de acuarela para las figuras: manchas que se pegan al personaje */
function makeWashTex() {
  const s = 512, c = mk(s, s), x = c.getContext('2d'), r = mulberry32(21);
  x.fillStyle = '#fff'; x.fillRect(0, 0, s, s);
  for (let i = 0; i < 70; i++) {
    const px = r() * s, py = r() * s, rad = 30 + r() * 120, g = x.createRadialGradient(px, py, 0, px, py, rad), a = .05 + r() * .09;
    g.addColorStop(0, `rgba(120,96,90,${a})`); g.addColorStop(.7, `rgba(120,96,90,${a * .6})`); g.addColorStop(1, 'rgba(120,96,90,0)');
    x.fillStyle = g; x.fillRect(px - rad, py - rad, rad * 2, rad * 2);
  }
  const id = x.getImageData(0, 0, s, s), d = id.data;
  for (let j = 0; j < s; j++) for (let i = 0; i < s; i++) { const k = (j * s + i) * 4, n = FBM(i * .012, j * .012, 4) * 40 + N2(i * .3, j * .3) * 10; d[k] -= n; d[k + 1] -= n; d[k + 2] -= n * .8; }
  x.putImageData(id, 0, 0);
  const m = mk(s * 2, s * 2), mg = m.getContext('2d');            // espejo ×4: textura sin costuras
  for (const [sx, sy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) { mg.save(); mg.translate(sx < 0 ? s * 2 : 0, sy < 0 ? s * 2 : 0); mg.scale(sx, sy); mg.drawImage(c, 0, 0); mg.restore(); }
  return m;
}
function makeHatch(gap, ang, w, col) {
  const s = 64, c = mk(s, s), x = c.getContext('2d');
  x.strokeStyle = col; x.lineWidth = w; x.lineCap = 'round';
  x.translate(s / 2, s / 2); x.rotate(ang);
  for (let k = -s; k <= s; k += gap) { x.beginPath(); x.moveTo(-s, k + Math.sin(k) * .4); x.lineTo(s, k - Math.sin(k) * .4); x.stroke(); }
  return c;
}

/* ---------- geometría 2D ---------- */
const add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const len = v => Math.hypot(v[0], v[1]);
const nrm2 = v => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l]; };
const perp = v => [-v[1], v[0]];
function area(pts) { let s = 0; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; s += a[0] * b[1] - b[0] * a[1]; } return s; }
function orient(pts) { return area(pts) < 0 ? pts.slice().reverse() : pts; }
function hull(pts) {
  const p = pts.map(q => [q[0], q[1]]).sort((a, b) => a[0] - b[0] || a[1] - b[1]); if (p.length < 3) return p;
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  up.pop(); lo.pop(); return lo.concat(up);
}
function densify(P, mx) {
  const o = [];
  for (let i = 0; i < P.length; i++) {
    const a = P[i], b = P[(i + 1) % P.length], l = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(l / mx));
    for (let k = 0; k < n; k++) { const t = k / n; o.push(k ? [lerp(a[0], b[0], t), lerp(a[1], b[1], t)] : [a[0], a[1], a[2]]); }
  }
  return o;
}
function capsulePts(a, b, ra, rb, n = 5) { // cápsula cónica como polígono
  const d = nrm2(sub(b, a)), ang = Math.atan2(d[1], d[0]), o = [];
  for (let i = 0; i <= n; i++) { const t = ang + PI / 2 + i / n * PI; o.push([a[0] + Math.cos(t) * ra, a[1] + Math.sin(t) * ra]); }
  for (let i = 0; i <= n; i++) { const t = ang - PI / 2 + i / n * PI; o.push([b[0] + Math.cos(t) * rb, b[1] + Math.sin(t) * rb]); }
  return o;
}
function taperPts(chain, w0, w1) { // mechón: curva con grosor que se afila
  const L = [], Rr = [], n = chain.length;
  for (let i = 0; i < n; i++) {
    const a = chain[Math.max(0, i - 1)], b = chain[Math.min(n - 1, i + 1)], d = nrm2(sub(b, a)), w = lerp(w0, w1, i / (n - 1));
    L.push([chain[i][0] - d[1] * w, chain[i][1] + d[0] * w]); Rr.push([chain[i][0] + d[1] * w, chain[i][1] - d[0] * w]);
  }
  return L.concat(Rr.reverse());
}

/* camino a partir de polígonos: unión por regla nonzero (todos con la misma orientación).
   jit: desplazamiento por posición (no por índice) → los vértices compartidos se mueven igual y no se abren huecos */
function pathOf(polys, smooth = true, jit = null, dens = 0) {
  const P = new Path2D();
  for (let q of polys) {
    if (!q || q.length < 3) continue;
    if (jit) { if (dens) q = densify(q, dens); q = q.map(p => { const d = jit(p[0], p[1]); return [p[0] + d[0], p[1] + d[1], p[2]]; }); }
    q = orient(q);
    const n = q.length;
    if (!smooth || n <= 4) { P.moveTo(q[0][0], q[0][1]); for (let i = 1; i < n; i++) P.lineTo(q[i][0], q[i][1]); P.closePath(); continue; }
    const md = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], s0 = md(q[n - 1], q[0]);
    P.moveTo(s0[0], s0[1]);
    for (let i = 0; i < n; i++) { const p = q[i], m = md(p, q[(i + 1) % n]); if (p[2] === true) { P.lineTo(p[0], p[1]); P.lineTo(m[0], m[1]); } else P.quadraticCurveTo(p[0], p[1], m[0], m[1]); }
    P.closePath();
  }
  return P;
}
function linePath(pts) { const P = new Path2D(); P.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) P.lineTo(pts[i][0], pts[i][1]); return P; }

/* ---------- 3D mínimo: giro (yaw, eje y) y cabeceo (pitch, eje x) ---------- */
function rot3(p, yaw, pitch) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw), x1 = p[0] * cy + p[2] * sy, z1 = -p[0] * sy + p[2] * cy;
  const cp = Math.cos(pitch), sp = Math.sin(pitch);
  return [x1, p[1] * cp - z1 * sp, p[1] * sp + z1 * cp];
}
const n3 = v => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
/* contorno exacto de un elipsoide girado (proyección ortográfica): elipse con matriz P·Pᵀ */
function ellSil(c, r, yaw, pitch, n = 40) {
  const a = rot3([r[0], 0, 0], yaw, pitch), b = rot3([0, r[1], 0], yaw, pitch), d = rot3([0, 0, r[2]], yaw, pitch), C = rot3(c, yaw, pitch);
  const m11 = a[0] * a[0] + b[0] * b[0] + d[0] * d[0], m12 = a[0] * a[1] + b[0] * b[1] + d[0] * d[1], m22 = a[1] * a[1] + b[1] * b[1] + d[1] * d[1];
  const dt = Math.sqrt(Math.max(1e-12, m11 * m22 - m12 * m12)), t = Math.sqrt(m11 + m22 + 2 * dt);
  const s11 = (m11 + dt) / t, s12 = m12 / t, s22 = (m22 + dt) / t, o = [];
  for (let i = 0; i < n; i++) { const th = i / n * TAU, co = Math.cos(th), si = Math.sin(th); o.push([C[0] + s11 * co + s12 * si, C[1] + s12 * co + s22 * si]); }
  return o;
}

/* ---------- IK de dos huesos (ley del coseno) ---------- */
function ik2(S, T, l1, l2, bend) {
  const dx = T[0] - S[0], dy = T[1] - S[1], d0 = Math.hypot(dx, dy) || 1e-6;
  const d = clamp(d0, Math.abs(l1 - l2) + 1e-3, l1 + l2 - 1e-3), a = Math.atan2(dy, dx);
  const A = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1)), ang = a + bend * A;
  const E = [S[0] + Math.cos(ang) * l1, S[1] + Math.sin(ang) * l1], Wr = [S[0] + dx / d0 * d, S[1] + dy / d0 * d];
  return { E, W: Wr, reach: d0 / (l1 + l2) };
}

/* ---------- resortes: cadenas Verlet (pelo, capa) ---------- */
const SPR = new Map();
function chainStep(key, root, rest, n, seg, o, ticks) {
  let st = SPR.get(key);
  if (!st || st.p.length !== n + 1) {
    const p = [root.slice()]; for (let i = 1; i <= n; i++) p.push(add(p[i - 1], rest(i), seg));
    st = { p, q: p.map(v => v.slice()) }; SPR.set(key, st);
  }
  const P = st.p, Q = st.q, damp = o.damp ?? .9, g = o.grav ?? 0, stiff = o.stiff ?? .2;
  for (let t = 0; t < ticks; t++) {
    P[0] = root.slice(); Q[0] = root.slice();
    for (let i = 1; i <= n; i++) {
      const vx = (P[i][0] - Q[i][0]) * damp, vy = (P[i][1] - Q[i][1]) * damp;
      Q[i][0] = P[i][0]; Q[i][1] = P[i][1]; P[i][0] += vx + (o.wind || 0); P[i][1] += vy + g;
    }
    for (let i = 1; i <= n; i++) {
      const k = stiff * (1 - .55 * (i - 1) / n), tg = add(P[i - 1], rest(i), seg);
      P[i][0] = lerp(P[i][0], tg[0], k); P[i][1] = lerp(P[i][1], tg[1], k);
      const d = sub(P[i], P[i - 1]), l = len(d) || 1;
      P[i] = add(P[i - 1], d, seg / l);
    }
  }
  if (!ticks) P[0] = root.slice();
  return P;
}

/* ---------- tela: rejilla Verlet colgada de una fila de anclas (pelo-manta y capa) ----------
   anchors: puntos en pantalla de la fila superior (fijos); lens: largo de cada columna en unidades.
   o: {stiff, grav, damp, fl (abre hacia fuera), bias (empuje lateral), hs (ancho de filas / ancho arriba), spread} */
const WIND = { x: 0 };   // viento en pantalla (múltiplos de la gravedad de cada tela)
function clothStep(key, anchors, R, lens, o, ticks) {
  const C = anchors.length;
  const cx = anchors.reduce((a, p) => a + p[0], 0) / C;
  let hw = o.hwMin || 1; for (const p of anchors) hw = Math.max(hw, Math.abs(p[0] - cx));
  const dir = c => nrm2([(o.fl || 0) * (anchors[c][0] - cx) / hw + (o.bias || 0) + WIND.x * .3 * (o.windK ?? 1), o.dy ?? 1]);
  let st = SPR.get(key);
  if (!st || st.C !== C || st.R !== R) {
    const P = []; for (let r = 0; r <= R; r++) P.push(anchors.map((a, c) => add(a, dir(c), lens[c] * r / R)));
    st = { P, Q: P.map(row => row.map(v => v.slice())), C, R }; SPR.set(key, st);
  }
  const P = st.P, Q = st.Q, damp = o.damp ?? .9, g = o.grav ?? 0, stiff = o.stiff ?? .2, hs = o.hs ?? 1, wf = WIND.x * (o.grav || .012) * (o.windK ?? 1);
  const restH = []; for (let c = 0; c < C - 1; c++) restH.push(len(sub(anchors[c + 1], anchors[c])) * hs);
  for (let t = 0; t < ticks; t++) {
    for (let c = 0; c < C; c++) { P[0][c] = anchors[c].slice(); Q[0][c] = anchors[c].slice(); }
    for (let r = 1; r <= R; r++) for (let c = 0; c < C; c++) {
      const p = P[r][c], q = Q[r][c], vx = (p[0] - q[0]) * damp, vy = (p[1] - q[1]) * damp;
      q[0] = p[0]; q[1] = p[1]; p[0] += vx; p[1] += vy + g;
      if (wf) { const fl = 1 + .8 * N2((st.n || 0) * .09 + c * .35, r * .6); p[0] += wf * fl * r / R; p[1] -= Math.abs(wf) * .25 * fl * r / R; }
    }
    st.n = (st.n || 0) + 1;
    for (let it = 0; it < 2; it++) {
      for (let r = 1; r <= R; r++) {
        const k = stiff * (1 - .5 * (r - 1) / R), grow = 1 + (o.spread || 0) * r / R;
        for (let c = 0; c < C; c++) {
          const seg = lens[c] / R, tg = add(P[r - 1][c], dir(c), seg), p = P[r][c];
          p[0] = lerp(p[0], tg[0], k); p[1] = lerp(p[1], tg[1], k);
          const d = sub(p, P[r - 1][c]), l = len(d) || 1; P[r][c] = add(P[r - 1][c], d, seg / l);
          if (o.floor !== undefined && P[r][c][1] > o.floor) { P[r][c][1] = o.floor; Q[r][c][0] = lerp(Q[r][c][0], P[r][c][0], .3); }
        }
        for (let c = 0; c < C - 1; c++) {
          const a = P[r][c], b = P[r][c + 1], d = sub(b, a), l = len(d) || 1, e = (l - restH[c] * grow) / l * .5 * (o.hk ?? .6);
          a[0] += d[0] * e; a[1] += d[1] * e; b[0] -= d[0] * e; b[1] -= d[1] * e;
        }
      }
    }
  }
  if (!ticks) for (let c = 0; c < C; c++) P[0][c] = anchors[c].slice();
  return P;
}
/* contorno de la tela con su «corte»: recto, en puntas o en flecos alternos */
function clothPoly(P, cut, tip) {
  const R = P.length - 1, C = P[0].length, o = [];
  for (let r = 0; r <= R; r++) o.push(P[r][0]);
  for (let c = 0; c < C; c++) {
    if (c > 0) o.push(P[R][c]);
    if (c < C - 1 && tip > 0 && cut !== 'recto') {
      const a = P[R][c], b = P[R][c + 1], d = nrm2(add(sub(a, P[R - 1][c]), sub(b, P[R - 1][c + 1])));
      const tl = tip * (cut === 'flecos' ? (c % 2 ? 1 : .55) : (.75 + .25 * Math.sin(c * 2.7)));
      const tp_ = add([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], d, tl); tp_.push(true); o.push(tp_);
    }
  }
  for (let r = R - 1; r >= 0; r--) o.push(P[r][C - 1]);
  for (let c = C - 2; c >= 1; c--) o.push(P[0][c]);
  return o;
}
