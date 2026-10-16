/* =====================================================================
   MAGOS v2: siluetas suaves (curvas), capa que reacciona al movimiento,
   luz de hechizos sobre el cuerpo, sombras en el suelo y medallones
   de casa animados (diseños originales).
   ===================================================================== */
const HOUSE = {
  G: { c: [204, 42, 46], g: [240, 182, 72] },     // carmesí y oro
  R: { c: [60, 104, 210], g: [206, 156, 98] },    // azul y bronce
  S: { c: [40, 160, 92], g: [214, 224, 224] },    // verde y plata
};
const mixC = (a, b, k) => a.map((v, i) => Math.round(lerp(v, b[i], k)));
const rgb = (c, a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const hcol = (h) => { const hA = typeof h === 'string' ? { a: h, b: h, k: 0 } : h; return { hA, c: mixC(HOUSE[hA.a].c, HOUSE[hA.b].c, hA.k), g: mixC(HOUSE[hA.a].g, HOUSE[hA.b].g, hA.k) }; };

function sPoly(P, pts) { // polígono suavizado con cuadráticas (misma orientación que fPoly)
  let s = 0; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; s += a[0] * b[1] - b[0] * a[1]; }
  if (s < 0) pts = pts.slice().reverse();
  const n = pts.length, md = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], s0 = md(pts[n - 1], pts[0]);
  P.moveTo(s0[0], s0[1]);
  for (let i = 0; i < n; i++) { const p = pts[i], m = md(p, pts[(i + 1) % n]); P.quadraticCurveTo(p[0], p[1], m[0], m[1]); }
  P.closePath();
}

/* o: {sex, hair, child, t, wind, vx, wand, wandA, thread, hemUp, noCape} */
function mage(p, o = {}) {
  const P = new Path2D(), C = new Path2D(), TR = new Path2D(), t = o.t || 0, ch = !!o.child, fem = o.sex === 'f';
  const TL = ch ? 21 : fem ? 28 : 30, UL = ch ? 16 : fem ? 23 : 24, LL = ch ? 16 : fem ? 24 : 25, UA = ch ? 10.5 : 14.5, LA = ch ? 9.5 : 13.5, HR = ch ? 6.6 : fem ? 5.8 : 6.2;
  const hy = p.hy * (UL + LL) / 49;
  const H = [p.hx || 0, -hy], u = [Math.sin(p.lean), -Math.cos(p.lean)], r = [Math.cos(p.lean), Math.sin(p.lean)];
  const T = ad(H, u, TL), hl = p.lean + p.ht, hu = [Math.sin(hl), -Math.cos(hl)], hr = [Math.cos(hl), Math.sin(hl)];
  const Hd = ad(T, hu, HR + 4.2);
  const tp = (a, b) => [T[0] + r[0] * a + u[0] * b, T[1] + r[1] * a + u[1] * b];
  const leg = (th, kn) => { const K = ad(H, D(th), UL), F = ad(K, D(th - kn), LL); return [K, F]; };
  const [K1, F1] = leg(p.lt, p.lk), [K2, F2] = leg(p.rt, p.rk);
  const S = ad(T, u, -2);
  const arm = (a, e) => { const E = ad(S, D(a + p.lean), UA), Wr = ad(E, D(a + p.lean + e), LA); return [E, Wr]; };
  const [E1, W1] = arm(p.la, p.le), [E2, W2] = arm(p.ra, p.re);
  const vx = o.vx || 0, wd = (o.wind ?? .5) + Math.min(.8, Math.max(0, vx) * .01), g = [0, 1];
  const footY = Math.max(F1[1], F2[1]);
  const hemY = footY - (o.hemUp ?? (fem ? 1.5 : ch ? 7 : 9));
  if (!o.noCape) {
    const cl = hemY - S[1] + 1, pts = [tp(2.5, .5), tp(-6.5, 1.5)];
    const N = 10;
    for (let j = 1; j <= N; j++) { const f = j / N, wv = Math.sin(t * 2.4 + f * 4.2 - vx * .01) * 3.2 * f * (.4 + wd); pts.push([S[0] - r[0] * (7.5 + f * (5 + wd * 18)) - f * f * wd * 9 + wv * .5, S[1] + f * cl * (1 - wd * .12 * f) + wv * .55]); }
    const last = pts[pts.length - 1];
    for (let j = 1; j <= 4; j++) { const f = j / 4; pts.push([lerp(last[0], H[0] + r[0] * 3, f) + Math.sin(t * 2.2 + j) * 1.6, lerp(last[1], hemY - 1, f) + Math.sin(t * 3 + j * 2) * 1.3 + Math.sin(f * PI) * 2]); }
    sPoly(C, pts);
    TR.moveTo(pts[1][0], pts[1][1]); for (let i = 2; i < pts.length - 3; i++) TR.lineTo(pts[i][0], pts[i][1]);
    fCirc(P, ...tp(-6.5, -.5), ch ? 4 : 5.4);
  }
  cap(P, H, K1, 3.8, 3.2); cap(P, K1, F1, 3.2, 2.6); cap(P, H, K2, 3.8, 3.2); cap(P, K2, F2, 3.2, 2.6);
  sPoly(P, [[F1[0] - 2.4, F1[1] - 2.6], [F1[0] + 6.2, F1[1] - 1.4], [F1[0] + 6.5, F1[1] + .8], [F1[0] - 2.6, F1[1] + 1.4]]);
  sPoly(P, [[F2[0] - 2.4, F2[1] - 2.6], [F2[0] + 6.2, F2[1] - 1.4], [F2[0] + 6.5, F2[1] + .8], [F2[0] - 2.6, F2[1] + 1.4]]);
  const wW = fem ? 5.5 : 7.3, flare = fem ? 10 : ch ? 3 : 5.5, fl = Math.sin(t * 2 + 1) * 1.5 * wd;
  const kf = K1[0] > K2[0] ? K1 : K2, kb = K1[0] > K2[0] ? K2 : K1;
  const fx = Math.max(F1[0], F2[0]), bx = Math.min(F1[0], F2[0]);
  const rp = [ad(H, r, wW + .5), [Math.max(kf[0] + 3.5, H[0] + wW), kf[1]], [fx + 3 + flare * .6, hemY]];
  for (let k = 1; k <= 3; k++) { const f = k / 4; rp.push([lerp(fx + 3 + flare * .6, bx - 5 - flare - fl, f), hemY + Math.sin(f * PI * 3 + t * 1.5) * 1.1]); }
  rp.push([bx - 5 - flare - fl, hemY + .5], [Math.min(kb[0] - 3.5, H[0] - wW), kb[1]], ad(H, r, -wW - .5));
  sPoly(P, rp);
  const tor = fem ? [tp(-2.2, 2.3), tp(-7, .4), tp(-7.4, -6), tp(-5.3, -TL + 6), tp(-6.4, -TL + .5), tp(6, -TL + .5), tp(4.7, -TL + 6), tp(6.9, -10), tp(5.6, -3), tp(2.2, 2.3)]
    : [tp(-2.6, 2.6), tp(-8.6, .6), tp(-8.9, -7), tp(-7.8, -TL + 1.5), tp(6.7, -TL + 1.5), tp(7.3, -10), tp(6.2, -2), tp(2.6, 2.6)];
  if (ch) for (const q of tor) { q[0] = lerp(T[0], q[0], .85); }
  sPoly(P, tor);
  cap(P, T, Hd, 2.7, 2.5);
  fCirc(P, Hd[0], Hd[1], HR);
  const hair = o.hair || 'short';
  if (hair === 'wild') {
    const len = ch ? 15 : 24, pts = [ad(ad(Hd, hu, HR * .95), hr, HR * .7), ad(ad(Hd, hu, HR * 1.22), hr, -HR * .3), ad(ad(Hd, hu, HR * .75), hr, -HR * 1.3)];
    const n = 8;
    for (let j = 1; j <= n; j++) { const f = j / n, wv = Math.sin(t * 3 - f * 5) * 2.2 * f * (.5 + wd); pts.push([Hd[0] - hr[0] * (HR * 1.25 + f * (2 + wd * 4.5)) + wv * .6 + Math.sin(f * 11) * 1.4, Hd[1] + f * len - f * f * wd * 2 + wv * .5]); }
    for (let j = n; j >= 0; j--) { const f = j / n, wv = Math.sin(t * 3 - f * 5 + .8) * 1.8 * f; pts.push([Hd[0] - hr[0] * (-HR * .1 + f * (wd * 2)) + wv * .3, Hd[1] + HR * .6 + f * (len - 5) + wv * .5]); }
    sPoly(P, pts);
    for (let k = 0; k < 3; k++) { const b = ad(ad(Hd, hu, -HR * .4 - k * 2), hr, -HR * 1.1), tip = [b[0] - hr[0] * (5 + k * 2 + wd * 6) + Math.sin(t * 4 + k) * 2, b[1] + 14 + k * 5 + Math.cos(t * 3 + k) * 2]; taperCurve(P, qbez(b, [lerp(b[0], tip[0], .6), b[1] + 2], tip, 8), 1.7, .25); }
  } else if (hair === 'sleek') {
    const len = 38, pts = [ad(ad(Hd, hu, HR * 1.06), hr, HR * .55), ad(ad(Hd, hu, HR * 1.1), hr, -HR * .6), ad(Hd, hr, -HR * 1.15)];
    for (let j = 1; j <= 6; j++) { const f = j / 6; pts.push([Hd[0] - hr[0] * (HR * 1.08 + f * (1 + wd * 4)) + Math.sin(t * 2 - f * 3) * f * 1.2, Hd[1] + f * len]); }
    pts.push([Hd[0] - hr[0] * (HR * .2 + wd * 2), Hd[1] + len - 1], ad(Hd, hu, -HR * .6));
    sPoly(P, pts);
    sPoly(P, [tp(-3.4, 1), tp(-3.8, 6.5), tp(1.8, 6.8), tp(3, 1)]);
  } else if (hair === 'swept') {
    sPoly(P, [ad(ad(Hd, hu, HR * .7), hr, HR * 1.08), ad(ad(Hd, hu, HR * 1.5), hr, HR * .35), ad(ad(Hd, hu, HR * 1.35), hr, -HR * .9), ad(ad(Hd, hu, HR * .25), hr, -HR * 1.38), ad(ad(Hd, hu, -HR * .25), hr, -HR * .85)]);
  } else if (hair === 'short') {
    const pts = [];
    for (let k = 0; k <= 10; k++) { const th = -.15 + k / 10 * (PI + .5), rr = HR * (k % 2 ? 1.08 : 1.22); pts.push(ad(ad(Hd, hr, Math.cos(th) * rr), hu, Math.sin(th) * rr)); }
    pts.push(ad(ad(Hd, hr, -HR * .9), hu, -HR * .5)); fPoly(P, pts);
  } else if (hair === 'braid') {
    fCirc(P, ...ad(ad(Hd, hu, HR * .25), hr, -HR * .2), HR * 1.12);
    const b = ad(Hd, hr, -HR); taperCurve(P, qbez(b, [b[0] - 6 - wd * 4, b[1] + 6], [b[0] - 4 - wd * 8 + Math.sin(t * 3) * 2, b[1] + 16], 8), 2.2, 1.2);
  }
  const sleeve = (E, Wr) => sPoly(P, [ad(E, r, 1.6), ad(E, g, 3.2), ad(ad(Wr, g, 7.5), r, -2.5 - wd * 2.5), ad(Wr, g, 1.5), Wr]);
  cap(P, S, E1, 4, 3.3); cap(P, E1, W1, 3, 2.4); sleeve(E1, W1); fCirc(P, W1[0], W1[1], 2.5);
  cap(P, S, E2, 4, 3.3); cap(P, E2, W2, 3, 2.4); sleeve(E2, W2); fCirc(P, W2[0], W2[1], 2.5);
  let tip = null, thread = null, sd = null;
  if (o.wand) {
    const a = o.wandA ?? (Math.atan2(W2[1] - E2[1], W2[0] - E2[0])); sd = [Math.cos(a), Math.sin(a)];
    tip = ad(W2, sd, 19); cap(P, ad(W2, sd, -3), tip, 1.05, .45, 1); cap(P, ad(W2, sd, -3), ad(W2, sd, 3), 1.5, 1.3);
    if (o.thread) thread = ad(W2, sd, 4.5);
  }
  const sig = ad(ad(T, u, -9), r, fem ? .5 : 1);
  return { P, C, TR, Hd, hu, hr, S, T, H, W1, W2, F1, F2, tip, sig, hemY, thread, sd, t };
}

/* ---------- medallón de casa (diseño original) ---------- */
function glyph(g, h) {
  g.beginPath();
  if (h === 'G') { g.moveTo(0, -.66); g.quadraticCurveTo(.42, -.05, .38, .42); g.lineTo(-.38, .42); g.quadraticCurveTo(-.42, -.05, 0, -.66); g.moveTo(0, -.1); g.lineTo(0, .42); }
  else if (h === 'R') { g.arc(-.05, 0, .55, .7, TAU - .7); g.moveTo(.42, -.1); g.arc(.32, -.1, .1, 0, TAU); }
  else { g.moveTo(-.5, -.42); g.lineTo(0, .22); g.lineTo(.5, -.42); g.moveTo(0, .22); g.lineTo(0, .7); g.moveTo(-.28, .5); g.lineTo(.28, .5); }
  g.stroke();
}
function medallion(x, y, sz, house, z, o = {}) {
  const A = (o.a ?? 1) * SA; if (A <= .01) return;
  const { hA, c, g: gl } = hcol(house), t = o.t || 0, pulse = .82 + .18 * Math.sin(t * 2.4 + (o.ph || 0)), fl = o.flare || 0;
  const prev = ctx.globalCompositeOperation; mode('source-over');
  const R0 = sz * (3.6 + fl * 9);
  const gr = ctx.createRadialGradient(x, y, 0, x, y, R0); gr.addColorStop(0, rgb(gl, Math.min(1, (.42 + fl * .6) * A * pulse))); gr.addColorStop(.4, rgb(c, Math.min(1, (.18 + fl * .3) * A * pulse))); gr.addColorStop(1, rgb(c, 0));
  ctx.fillStyle = gr; ctx.fillRect(x - R0, y - R0, R0 * 2, R0 * 2);
  ctx.save(); ctx.translate(x, y); ctx.scale(sz, sz); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.shadowColor = rgb(gl, .95); ctx.shadowBlur = LOWQ ? 0 : sz * z * (1.5 + fl * 3) * pulse;
  const ig = o.ignite ?? 1;
  if (ig < 1) ctx.setLineDash([7 * ig, 7]);
  ctx.globalAlpha = A; ctx.strokeStyle = rgb(c, 1); ctx.lineWidth = .16; ctx.beginPath(); ctx.arc(0, 0, 1, -PI / 2, -PI / 2 + TAU); ctx.stroke(); ctx.shadowBlur = fl > 0 && !LOWQ ? sz * z * 2 : 0;
  ctx.strokeStyle = rgb(gl, .85); ctx.lineWidth = .06; ctx.beginPath(); ctx.arc(0, 0, .8, 0, TAU); ctx.stroke();
  ctx.save(); ctx.rotate(t * .35 * (hA.a === 'R' ? -1 : 1)); ctx.strokeStyle = rgb(gl, .8); ctx.lineWidth = .07;
  ctx.beginPath(); for (let k = 0; k < 12; k++) { const a = k / 12 * TAU, l = k % 3 ? 1.22 : 1.36; ctx.moveTo(Math.cos(a) * 1.1, Math.sin(a) * 1.1); ctx.lineTo(Math.cos(a) * l, Math.sin(a) * l); } ctx.stroke(); ctx.restore();
  ctx.setLineDash([]);
  const drawG = (h, al) => { if (al <= .01) return; ctx.save(); ctx.scale(.78, .78); ctx.globalAlpha = al * A * Math.min(1, ig * 1.4); ctx.strokeStyle = rgb(c, 1); ctx.lineWidth = .2; glyph(ctx, h); ctx.strokeStyle = rgb(gl, .95); ctx.lineWidth = .08; glyph(ctx, h); ctx.restore(); };
  drawG(hA.a, 1 - hA.k); if (hA.k > 0) drawG(hA.b, hA.k);
  if (o.green > 0) { ctx.globalAlpha = A; ctx.strokeStyle = rgb(HOUSE.S.c, 1); ctx.shadowColor = rgb(HOUSE.S.g, .95); ctx.lineWidth = .14; ctx.beginPath(); ctx.arc(0, 0, 1.18, -PI / 2, -PI / 2 + TAU * clamp(o.green)); ctx.stroke(); }
  if (fl > 0) { ctx.globalAlpha = A * Math.min(1, fl); ctx.strokeStyle = rgb(gl, 1); ctx.lineWidth = .08; ctx.beginPath(); for (let k = 0; k < 16; k++) { const a = k / 16 * TAU + t * .5, l = 2 + (k % 2 ? 2.5 : 5) * fl; ctx.moveTo(Math.cos(a) * 1.5, Math.sin(a) * 1.5); ctx.lineTo(Math.cos(a) * l, Math.sin(a) * l); } ctx.stroke(); }
  ctx.restore(); ctx.globalAlpha = 1; ctx.shadowBlur = 0; mode(prev);
}

/* o: {house, glow, a, rot, halo, minor, noGlow, light:[{x,y,c,r,a}], shadowFrom:{x,y,a}, green, flare, trimK, ignite, noShadow} */
function drawMage(F, x, y, s, flip, o = {}) {
  const a = (o.a ?? 1) * SA; if (a <= .003) return;
  const z = (1 + (CAM.z - 1) * (o.d ?? 1)) * U * s, rot = o.rot || 0;
  const toLocal = (wx, wy) => { const dx = wx - x, dy = wy - y, c = Math.cos(-rot), sn = Math.sin(-rot); const lx = (dx * c - dy * sn) / s, ly = (dx * sn + dy * c) / s; return [flip ? -lx : lx, ly]; };
  ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot); ctx.scale(flip ? -s : s, s);
  if (!o.noShadow && !rot) {
    ctx.globalAlpha = a * .35; ctx.fillStyle = 'rgba(10,8,12,.8)'; ctx.beginPath(); ctx.ellipse(0, 0, 20, 3.2, 0, 0, TAU); ctx.fill();
    if (o.shadowFrom && (o.shadowFrom.a ?? 1) > .02) { const L2 = toLocal(o.shadowFrom.x, o.shadowFrom.y), k = clamp((0 - L2[0]) / Math.max(40, -L2[1] + 60), -2.4, 2.4); ctx.save(); ctx.transform(1, 0, k, -.22, 0, 0); ctx.globalAlpha = a * .3 * (o.shadowFrom.a ?? 1); ctx.fillStyle = 'rgba(8,6,10,.9)'; ctx.fill(F.C); ctx.fill(F.P); ctx.restore(); }
  }
  ctx.globalAlpha = a; const hb = (o.halo ?? 2.4) * z;
  if (hb > .5 && !(LOWQ && o.minor)) { ctx.shadowColor = `rgba(16,14,20,${o.haloA ?? .55})`; ctx.shadowBlur = hb; }
  ctx.fillStyle = `rgba(${o.ink || '16,14,18'},${o.inkA ?? .94})`; ctx.fill(F.C); ctx.fill(F.P);
  ctx.shadowBlur = 0;
  if (o.light && o.light.length && !(LOWQ && o.minor)) {
    const prev = ctx.globalCompositeOperation; ctx.save(); const UP = new Path2D(); UP.addPath(F.C); UP.addPath(F.P); ctx.clip(UP); mode('source-over');
    for (const l of o.light) { if (!(l.a > .01)) continue; const [lx, ly] = toLocal(l.x, l.y), rr = Math.min(l.r || 160, 220) / s; const gr = ctx.createRadialGradient(lx, ly, 0, lx, ly, rr); gr.addColorStop(0, `rgba(${l.c},${Math.min(1, .5 * l.a * a)})`); gr.addColorStop(.4, `rgba(${l.c},${Math.min(1, .12 * l.a * a)})`); gr.addColorStop(1, `rgba(${l.c},0)`); ctx.fillStyle = gr; ctx.fillRect(lx - rr, ly - rr, rr * 2, rr * 2); }
    ctx.restore(); mode(prev);
  }
  if (o.house && !o.noGlow) {
    const { c, g: gl } = hcol(o.house), gw = o.glow ?? 1;
    const prev = ctx.globalCompositeOperation; mode('source-over');
    ctx.globalAlpha = Math.min(1, gw * (o.a ?? 1) * SA); ctx.strokeStyle = rgb(c, .8); ctx.lineWidth = .8; ctx.shadowColor = rgb(gl, .8); ctx.shadowBlur = LOWQ ? 0 : 4 * z * gw;
    ctx.stroke(F.TR);
    if (o.trimK > 0) { ctx.strokeStyle = rgb(HOUSE.S.c, .95); ctx.shadowColor = rgb(HOUSE.S.g, .9); ctx.lineWidth = 1.1; ctx.setLineDash([300 * clamp(o.trimK), 400]); ctx.stroke(F.TR); ctx.setLineDash([]); }
    ctx.shadowBlur = 0; ctx.globalAlpha = 1; mode(prev);
    medallion(F.sig[0], F.sig[1], o.child ? 3.4 : 4.3, o.house, z, { a: (o.a ?? 1) * gw, t: F.t, ph: x * .01, green: o.green, flare: o.flare, ignite: o.ignite });
  }
  if (F.thread) {
    const prev = ctx.globalCompositeOperation; mode('source-over'); const p0 = F.thread, tt = F.t;
    ctx.globalAlpha = a; ctx.strokeStyle = 'rgba(70,200,120,.95)'; ctx.lineWidth = 1.1; ctx.shadowColor = 'rgba(120,255,170,.9)'; ctx.shadowBlur = LOWQ ? 0 : 5 * z;
    ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.quadraticCurveTo(p0[0] - 4, p0[1] + 6 + Math.sin(tt * 4) * 1.5, p0[0] - 2 + Math.sin(tt * 3) * 2, p0[1] + 12); ctx.stroke(); ctx.shadowBlur = 0; ctx.globalAlpha = 1; mode(prev);
  }
  if (o.after) o.after(F);
  ctx.restore(); ctx.globalAlpha = 1;
}
function figPt(p, x, y, s, flip, rot = 0) { const lx = (flip ? -p[0] : p[0]) * s, ly = p[1] * s, c = Math.cos(rot), sn = Math.sin(rot); return [x + lx * c - ly * sn, y + lx * sn + ly * c]; }

const CAST = {
  joy: { sex: 'f', hair: 'wild', house: 'G' },
  damien: { sex: 'm', hair: 'swept', house: 'R' },
  anami: { sex: 'm', hair: 'short', house: 'G' },
  draco: { sex: 'f', hair: 'sleek', house: 'S' },
};
const DUEL = { hy: 45, lean: .14, ht: -.08, lt: -.45, lk: .3, rt: .5, rk: .45, la: .5, le: .9, ra: 1.45, re: .05, sw: 0 };
const LUNGE = { hy: 40, lean: .4, ht: -.25, lt: -.75, lk: .25, rt: .95, rk: 1.05, la: -.2, le: .3, ra: 1.6, re: -.1, sw: 0 };
const BLOCK = { hy: 46, lean: -.05, ht: -.12, lt: -.4, lk: .3, rt: .45, rk: .4, la: .6, le: 1.2, ra: 2.1, re: -.6, sw: 0 };
const DODGE = { hy: 42, lean: -.35, ht: -.2, lt: -.6, lk: .5, rt: .3, rk: .6, la: 1.2, le: .6, ra: 1.0, re: .3, sw: 0 };
const STAGGER = { hy: 46, lean: -.32, ht: -.4, lt: -.5, lk: .2, rt: .25, rk: .3, la: 1.6, le: .5, ra: 1.3, re: .6, sw: 0 };
function runP(ph) { const s = Math.sin(ph), c = Math.cos(ph); return { hy: 46 + Math.abs(c) * 2.5, lean: .28, ht: -.15, lt: .75 * s, lk: .25 + Math.max(0, c) * 1.1, rt: -.75 * s, rk: .25 + Math.max(0, -c) * 1.1, la: -.7 * s, le: .9, ra: .7 * s + .3, re: .9, sw: 0 }; }
