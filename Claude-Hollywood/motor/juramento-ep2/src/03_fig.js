/* =====================================================================
   PERSONAJES: esqueleto paramétrico → silueta de tinta (Path2D)
   origen = pies sobre el suelo, mirando a +x, alto ≈ 100u
   ===================================================================== */
const D = a => [Math.sin(a), Math.cos(a)];
function fPoly(P, pts) {
  let s = 0; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; s += a[0] * b[1] - b[0] * a[1]; }
  if (s < 0) pts = pts.slice().reverse();
  P.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) P.lineTo(pts[i][0], pts[i][1]); P.closePath();
}
function fCirc(P, x, y, r) { P.moveTo(x + r, y); P.arc(x, y, r, 0, TAU); }
function hull(pts) {
  const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]); if (p.length < 3) return p;
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  up.pop(); lo.pop(); return lo.concat(up);
}
function cap(P, a, b, ra, rb, ends = 3) {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1e-6, nx = -dy / l, ny = dx / l;
  fPoly(P, [[a[0] + nx * ra, a[1] + ny * ra], [b[0] + nx * rb, b[1] + ny * rb], [b[0] - nx * rb, b[1] - ny * rb], [a[0] - nx * ra, a[1] - ny * ra]]);
  if (ends & 1) fCirc(P, a[0], a[1], ra); if (ends & 2) fCirc(P, b[0], b[1], rb);
}
function taperCurve(P, pts, r0, r1) {
  const L = [], R2 = [], n = pts.length;
  for (let i = 0; i < n; i++) { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, r = lerp(r0, r1, i / (n - 1)); L.push([pts[i][0] - dy / l * r, pts[i][1] + dx / l * r]); R2.push([pts[i][0] + dy / l * r, pts[i][1] - dx / l * r]); }
  fPoly(P, L.concat(R2.reverse()));
}
const ad = (p, v, k = 1) => [p[0] + v[0] * k, p[1] + v[1] * k];
function qbez(a, c, b, n = 10) { const o = []; for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t; o.push([u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]]); } return o; }

const POSE = {
  stand: { hy: 49, lean: .03, ht: 0, lt: -.13, lk: .06, rt: .15, rk: .08, la: .05, le: .25, ra: .35, re: 1.25, sw: 0 },
  ready: { hy: 45, lean: .14, ht: -.06, lt: -.36, lk: .28, rt: .42, rk: .38, la: .3, le: 1.25, ra: .75, re: 1.05, sw: 0 },
  iai: { hy: 37, lean: .42, ht: -.4, lt: -.95, lk: .32, rt: 1.05, rk: 1.3, la: .55, le: 1.35, ra: .95, re: .55, sw: 0 },
  slash: { hy: 35, lean: .5, ht: -.5, lt: -1.05, lk: .25, rt: 1.15, rk: 1.4, la: -.5, le: .2, ra: 1.75, re: .15, sw: -.35 },
  guard: { hy: 44, lean: .1, ht: -.05, lt: -.4, lk: .3, rt: .45, rk: .4, la: .9, le: .9, ra: 1.0, re: .8, sw: -.75 },
  low: { hy: 39, lean: .32, ht: -.2, lt: -.8, lk: .4, rt: .9, rk: 1.1, la: .3, le: .4, ra: .25, re: .1, sw: 2.6 }, // espada hacia atrás y abajo
  seiza: { hy: 12, lean: -.02, ht: .22, lt: 1.45, lk: 2.95, rt: 1.42, rk: 2.92, la: .3, le: .95, ra: .42, re: .95, sw: 0 },
  kneel: { hy: 28, lean: .12, ht: .3, lt: 1.5, lk: 1.55, rt: -.1, rk: 1.45, la: .25, le: .6, ra: .55, re: .7, sw: 0 },
  kneelArm: { hy: 28, lean: .3, ht: .45, lt: 1.5, lk: 1.55, rt: -.1, rk: 1.45, la: .4, le: .3, ra: .8, re: .25, sw: 0 },
  crouch: { hy: 30, lean: .5, ht: -.3, lt: -.6, lk: 1.3, rt: 1.2, rk: 2.0, la: .9, le: .8, ra: 1.3, re: .2, sw: -.2 },
  leap: { hy: 50, lean: .35, ht: -.2, lt: .9, lk: 1.7, rt: -.2, rk: 1.0, la: 2.4, le: .4, ra: 2.6, re: .3, sw: -2.3 },
  lie: { hy: 49, lean: 0, ht: .25, lt: .25, lk: .5, rt: -.05, rk: .15, la: .25, le: .2, ra: .1, re: .3, sw: 0 },
  lieArm: { hy: 49, lean: .05, ht: .45, lt: .25, lk: .5, rt: -.05, rk: .15, la: .25, le: .2, ra: 1.75, re: -.35, sw: 0 },
  fallen: { hy: 30, lean: .6, ht: .5, lt: 1.4, lk: 1.4, rt: 1.3, rk: 1.6, la: .1, le: .1, ra: -.1, re: .2, sw: 0 },
};
const PK = Object.keys(POSE.stand);
function mixP(a, b, t) { const o = {}; for (const k of PK) o[k] = lerp(a[k], b[k], t); return o; }
function walkP(ph, carry = 1) {
  const s = Math.sin(ph), c = Math.cos(ph);
  return { hy: 48 + Math.abs(c) * 1.4, lean: .07, ht: .02, lt: .42 * s, lk: .12 + Math.max(0, c) * .65, rt: -.42 * s, rk: .12 + Math.max(0, -c) * .65, la: -.32 * s, le: .3, ra: carry ? .35 : .3 * s, re: carry ? 1.25 : .3, sw: 0 };
}

/* o: {kasa, helmet, cape, hood, slim, armor, sword:'sheath'|'hand'|'ground'|'none', t, wind} */
function fig(p, o = {}) {
  const P = new Path2D(), t = o.t || 0;
  const H = [p.hx || 0, -p.hy], u = [Math.sin(p.lean), -Math.cos(p.lean)], r = [Math.cos(p.lean), Math.sin(p.lean)];
  const T = ad(H, u, 30), hl = p.lean + p.ht, hu = [Math.sin(hl), -Math.cos(hl)], hr = [Math.cos(hl), Math.sin(hl)];
  const Hd = ad(T, hu, 10.5);
  const leg = (th, kn) => { const K = ad(H, D(th), 24), F = ad(K, D(th - kn), 25); return [K, F]; };
  const [K1, F1] = leg(p.lt, p.lk), [K2, F2] = leg(p.rt, p.rk);
  const S = ad(T, u, -2);
  const arm = (a, e) => { const E = ad(S, D(a + p.lean), 15), Wr = ad(E, D(a + p.lean + e), 14); return [E, Wr]; };
  const [E1, W1] = arm(p.la, p.le), [E2, W2] = arm(p.ra, p.re);
  const rh = o.slim ? 4.8 : 7.5, rk = o.slim ? 4 : 7.2, rf = o.slim ? 3.2 : 10;
  // capa (detrás de todo)
  if (o.cape) {
    const wd = o.wind ?? .6, cl = Math.max(30, p.hy + 24), pts = [ad(S, r, 2), ad(S, r, -8)];
    for (let j = 1; j <= 7; j++) { const f = j / 7, wv = Math.sin(t * 3.1 + f * 5) * 3.5 * f; pts.push([S[0] - r[0] * (8 + f * (14 + wd * 22)) - f * wd * 6 + wv * .4, S[1] + f * cl + wv - f * f * wd * 10]); }
    const last = pts[pts.length - 1];
    for (let j = 1; j <= 3; j++) { const f = j / 3; pts.push([lerp(last[0], H[0] + r[0] * 3, f) + Math.sin(t * 2.7 + j) * 2, lerp(last[1], H[1] + 20 + cl * .3, f) + Math.sin(t * 3.3 + j * 2) * 2]); }
    fPoly(P, pts);
  }
  // hakama / piernas
  cap(P, H, K1, rh, rk, 1); cap(P, K1, F1, rk, rf, 1);
  cap(P, H, K2, rh, rk, 1); cap(P, K2, F2, rk, rf, 1);
  fPoly(P, hull([ad(H, r, rh), ad(H, r, -rh), K1, K2]));
  if (!o.slim) fPoly(P, hull([K1, K2, [(K1[0] + F1[0]) / 2, (K1[1] + F1[1]) / 2], [(K2[0] + F2[0]) / 2, (K2[1] + F2[1]) / 2]]));
  cap(P, F1, [F1[0] + 5, F1[1]], 2.4, 2.1); cap(P, F2, [F2[0] + 5, F2[1]], 2.4, 2.1);
  // torso
  const sb = o.armor ? 11.5 : 9.5;
  fPoly(P, hull([ad(T, r, -sb), ad(T, r, 7.5), ad(H, r, rh * 1.05), ad(H, r, -rh * 1.05), ad(ad(T, u, -12), r, -sb * .95)]));
  if (o.armor) { // sode (hombreras)
    fPoly(P, [ad(S, r, -12), ad(S, r, 5), ad(ad(S, r, 4), [0, 1], 13), ad(ad(S, r, -13), [0, 1], 12)]);
    fPoly(P, hull([ad(H, r, -rh * 1.4), ad(H, r, rh * 1.4), ad(ad(H, r, rh * 1.6), [0, 1], 14), ad(ad(H, r, -rh * 1.6), [0, 1], 14)]));
  }
  cap(P, T, Hd, 3.2, 3);
  // cabeza
  if (o.helmet) {
    fCirc(P, ...ad(Hd, hu, .8), 8);
    fPoly(P, [ad(ad(Hd, hr, 1), hu, 1), ad(ad(Hd, hr, -12), hu, -7), ad(ad(Hd, hr, -10), hu, -10), ad(ad(Hd, hr, 2), hu, -5)]);
    if (!o.noHorns) {
      const b = ad(ad(Hd, hr, 4), hu, 6.5);
      taperCurve(P, qbez(b, ad(ad(b, hr, 14), hu, 7), ad(ad(b, hr, 6), hu, 27), 12), 2.4, .25);
      taperCurve(P, qbez(b, ad(ad(b, hr, 2), hu, 9), ad(ad(b, hr, -7), hu, 25), 12), 2.2, .25);
      fCirc(P, ...b, 2.8);
    }
  } else {
    fCirc(P, Hd[0], Hd[1], 6.3);
    if (o.hood) fPoly(P, [ad(ad(Hd, hr, -4), hu, 2), ad(ad(Hd, hr, -13), hu, -6 + Math.sin(t * 6) * 1.5), ad(ad(Hd, hr, -11), hu, -8), ad(ad(Hd, hr, -2), hu, -4)]);
    else if (!o.kasa) cap(P, ad(ad(Hd, hu, 5.2), hr, -1.5), ad(ad(Hd, hu, 6.8), hr, -6.5), 2.1, 1.5);
    if (o.kasa) fPoly(P, [ad(Hd, hu, 11), ad(ad(Hd, hr, 18), hu, -.5), ad(ad(Hd, hr, 17), hu, -2), ad(ad(Hd, hr, -17), hu, -2), ad(ad(Hd, hr, -18), hu, -.5)]);
  }
  // brazos con mangas
  const sleeve = (E, Wr) => { if (o.slim) return; const g = [o.sleeveWind ?? -.15, 1]; fPoly(P, [ad(S, r, 2), E, ad(E, g, 8.5), ad(ad(S, g, 6), r, -3)]); };
  sleeve(E1, W1); cap(P, S, E1, 4.2, 3.5); cap(P, E1, W1, 3.3, 2.7); fCirc(P, W1[0], W1[1], 3);
  sleeve(E2, W2); cap(P, S, E2, 4.2, 3.5); cap(P, E2, W2, 3.3, 2.7); fCirc(P, W2[0], W2[1], 3);
  // espada
  const sw = o.sword || 'sheath';
  const hipF = ad(ad(H, r, 5), u, 3);
  if (sw !== 'ground' && sw !== 'none' && !o.noSaya) { const back = [-r[0] * .94, -r[1] * .94 + .34]; cap(P, hipF, ad(hipF, back, 40), 1.8, 1.5); }
  let tip = null;
  if (sw === 'sheath') { const hi = ad(ad(hipF, r, 11), u, 4.5); cap(P, hipF, hi, 1.9, 1.9); cap(P, ad(ad(hipF, r, 1.5), u, 3), ad(ad(hipF, r, 1.5), u, -3), 1.1, 1.1); }
  else if (sw === 'hand') {
    const a = p.sw, sd = [Math.cos(a), Math.sin(a)], nn = [-sd[1], sd[0]], W = W2;
    cap(P, ad(W, sd, -8), ad(W, sd, 2), 1.9, 1.9);
    cap(P, ad(ad(W, sd, 2.6), nn, 3.2), ad(ad(W, sd, 2.6), nn, -3.2), 1.1, 1.1);
    const b0 = ad(W, sd, 3), b1 = ad(W, sd, 47); tip = b1;
    taperCurve(P, qbez(b0, ad(ad(W, sd, 25), nn, 1.8), b1, 14), 1.35, .2);
  } else if (sw === 'ground') { cap(P, [10, -1.8], [20, -1.8], 1.9, 1.9); cap(P, [20, -1.8], [60, -1.6], 1.6, 1.3); }
  return { P, Hd, hu, hr, S, H, T, W1, W2, F1, F2, tip, hipF };
}

/* cinta roja (hachimaki) con dos colas al viento */
function ribbon(g, ax, ay, t, o = {}) {
  const n = o.n ?? 11, sl = o.sl ?? 3.4, wd = o.wind ?? .7, sp = o.sp ?? 5;
  g.fillStyle = `rgba(${o.col || '186,26,36'},${o.a ?? .92})`;
  for (let k = 0; k < (o.tails ?? 2); k++) {
    let x = ax, y = ay; const L = [], Rr = [];
    const base = lerp(PI / 2 + .15, PI - .05, wd) + (o.rot || 0) + k * .18;
    for (let i = 0; i <= n; i++) {
      const f = i / n, w = (o.w ?? 1.7) * (1 - f * .45);
      const a = base + Math.sin(t * sp - i * .62 + k * 1.7) * .42 * f * (.4 + wd) + N2(t * .7 + k * 3, i * .2) * .3 * f;
      const nx = -Math.sin(a), ny = Math.cos(a);
      L.push([x + nx * w, y + ny * w]); Rr.push([x - nx * w, y - ny * w]);
      x += Math.cos(a) * sl * (1 + k * .1); y += Math.sin(a) * sl * (1 + k * .1);
    }
    const pts = L.concat(Rr.reverse());
    g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (const q of pts) g.lineTo(q[0], q[1]); g.closePath(); g.fill();
  }
}

/* dibuja una figura en la capa actual con halo de tinta húmeda */
function drawFig(F, x, y, s, flip, o = {}) {
  const a = (o.a ?? 1) * SA; if (a <= .003) return;
  ctx.save(); ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot); ctx.scale(flip ? -s : s, s);
  const z = (1 + (CAM.z - 1) * (o.d ?? 1)) * U * s;
  ctx.globalAlpha = a; const hb0 = (o.halo ?? 2.5) * z; if (hb0 > .5 && !(LOWQ && o.minor)) { ctx.shadowColor = `rgba(20,16,14,${o.haloA ?? .55})`; ctx.shadowBlur = hb0; }
  ctx.fillStyle = `rgba(${o.ink || '18,15,14'},${o.inkA ?? .93})`; ctx.fill(F.P);
  ctx.shadowBlur = 0;
  if (o.rib) { const hb = ad(ad(F.Hd, F.hr, -5.5), F.hu, 1.5); ribbon(ctx, hb[0], hb[1], o.t || 0, Object.assign({ a: .9 }, o.rib)); }
  if (o.after) o.after(F);
  ctx.restore(); ctx.globalAlpha = 1;
}
function figSprite(F, s, o = {}) { // estática → sprite (para sangrado de aparición)
  const sp = Spr(-70 * s, -120 * s, 80 * s, 14 * s, 1);
  const g = sp.g; g.save(); g.scale(o.flip ? -s : s, s);
  g.shadowColor = 'rgba(20,16,14,.6)'; g.shadowBlur = 3 * sp.k * s; g.fillStyle = 'rgba(18,15,14,.93)'; g.fill(F.P); g.restore();
  return sp;
}
