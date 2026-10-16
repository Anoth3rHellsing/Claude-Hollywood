/* =====================================================================
   FX (2): onda, rayo cian, cristales que se paran en el aire, cúpula hexagonal,
   grietas verdes, raíces gigantes y cortes violetas, savia, remaches, huracán,
   haces que chocan, esfera, sombras duras, telaraña, órbitas, pulsos, colapso y silencio
   ===================================================================== */
/* punta de la varita en un instante pasado (para estelas) */
function tipAt(who, tt) {
  const P = mageState(who, tt), z = P.z, s = PS(z), base = PJ(P.x, P.y - (P.lift || 0) * 90, z), k = 1.8 * s, sg = who === 'magoA' ? 1 : -1;
  const J = mJ({ ...P, t: tt }), X = p => [base[0] + sg * p[0] * k, base[1] + p[1] * k], W_ = X(J.Wn), E = X(J.En), d = nrm2(sub(W_, E)), a = Math.atan2(d[1], d[0]) - .27 * sg;
  return [W_[0] + Math.cos(a) * 15 * k, W_[1] + Math.sin(a) * 15 * k];
}
function trail(who, t0, t1, t, col, w, o = {}) {
  if (t < t0 || t > t1 + (o.fade ?? .8)) return;
  const pts = []; for (let i = 0; i <= 36; i++) { const tt = lerp(t0, Math.min(t, t1), i / 36); pts.push(tipAt(who, tt)); }
  const fr = clamp((t - t1) / (o.fade ?? .8));
  inkStroke(pts, { w: f => w * (.4 + .6 * Math.sin(f * PI)), col, a: .92, prog: 1, from: fr, dry: .86, core: .3, seed: 11, bristles: 6 });
}
/* ---------- bloque 3: onda azul ---------- */
const ELEC = '72,140,236', CYAN = '96,214,232', GOLD = '236,186,92', EMER = '60,200,110', VIOL = '150,92,232', CRIM = '190,30,46', COBA = '40,72,200';
/* rayito quebrado entre dos puntos (a 12 FPS) */
function zig(a, b, seed, jit, n = 7) { const r = mulberry32(seed), pts = [a]; for (let i = 1; i < n; i++) { const f = i / n, d = sub(b, a), nn = nrm2([-d[1], d[0]]), o = (r() - .5) * jit * Math.sin(f * PI); pts.push([a[0] + d[0] * f + nn[0] * o, a[1] + d[1] * f + nn[1] * o]); } pts.push(b); return pts; }
function bolts(list, col, w, a) { ctx.lineCap = 'round'; ctx.lineJoin = 'round'; const P = new Path2D(); for (const L of list) { P.moveTo(...L[0]); for (const p of L) P.lineTo(...p); } ctx.strokeStyle = `rgba(${col},${a * .35})`; ctx.lineWidth = w * 3.2; ctx.stroke(P); ctx.strokeStyle = `rgba(${col},${a})`; ctx.lineWidth = w; ctx.stroke(P); ctx.strokeStyle = `rgba(246,250,255,${a})`; ctx.lineWidth = w * .4; ctx.stroke(P); }
/* B se carga de electricidad mientras traza el círculo y la descarga por la varita */
const TCHG = 60.2, TREL = 61.38;
function chargeFx(t) {
  if (t < TCHG || t > TREL + .5 || !MAGE.magoB) return;
  const M = MAGE.magoB, J = mJ({ ...mageState('magoB', t), t }), sg = -1, X = p => [M.base[0] + sg * p[0] * M.k, M.base[1] + p[1] * M.k];
  const ch = sm((t - TCHG) / (TREL - TCHG)), tq = Math.floor(t * 12), body = [J.Hp, J.Sn, J.Sf, J.En, J.Wn, J.K1, J.K2, [J.Hp[0], J.Hp[1] - 40]].map(X), tip = M.tip;
  if (t < TREL) {
    const L = [], r = mulberry32(tq);
    /* chispas que reptan por el cuerpo; cada vez más, y más largas */
    for (let i = 0; i < 2 + ch * 9; i++) { const a = body[Math.floor(r() * body.length)], b = add(a, [(r() - .5) * 80 * M.k / 2.6, (r() - .5) * 80 * M.k / 2.6]); L.push(zig(a, b, tq * 31 + i, 22 * M.k / 2.6, 5)); }
    /* por el brazo hasta la punta */
    L.push(zig(X(J.Sn), X(J.En), tq + 3, 14, 4).concat(zig(X(J.En), tip, tq + 4, 14, 4)));
    bolts(L, ELEC, 1.6 + ch * 1.4, .55 + ch * .45);
    inkBloom(tip, (6 + 26 * ch) * M.k / 2.6, ELEC, .75, tq, .9, 6); paperLight(tip, (2 + 7 * ch) * M.k / 2.6, ch);
    LGF(tip[0], tip[1], (80 + 260 * ch) * M.k / 2.6, '140,190,255', .4 + ch * .6); LGT(M.chest[0], M.chest[1], 300 * M.k / 2.6, '120,170,255', .5 * ch);
  } else {   /* la descarga: un estallido de rayos desde la punta */
    const age = t - TREL, L = [];
    for (let i = 0; i < 12; i++) { const an = i / 12 * TAU + tq, l = (120 + 380 * easeOut(age / .25)) * M.k / 2.6; L.push(zig(tip, add(tip, [Math.cos(an) * l, Math.sin(an) * l * .7]), tq * 7 + i, 50, 7)); }
    bolts(L, ELEC, 2.6, 1 - sm(age / .5)); paperLight(tip, 18 * (1 - age * 2) + 1, 1 - age * 2); LGF(tip[0], tip[1], 700, '170,210,255', 1.2 * (1 - sm(age / .45)));
  }
}
function shockFx(t) {
  trail('magoB', 60.2, 61.3, t, ELEC, 18 * PS(800) / 1.44, { fade: .7 });
  chargeFx(t);
  const age = t - TREL; if (age < 0 || age > 1.6) return;
  const c = MAGE.magoB ? MAGE.magoB.tip : PJ(450, -100, 800), e = easeOut(age / 1.3), rx = 60 + 1700 * e, ry = rx * .55, a = 1 - sm(age / 1.5);
  ctx.save(); ctx.lineCap = 'round';
  const pts = []; for (let i = 0; i <= 60; i++) { const an = PI * .35 + i / 60 * PI * 1.3; pts.push([c[0] + Math.cos(an) * rx * (1 + .05 * N2(i * .3, age * 3)), c[1] + Math.sin(an) * ry]); }
  inkStroke(pts, { w: f => 26 * a * Math.sin(f * PI) + 1, col: ELEC, a: .8 * a, dry: .85, core: .4, seed: 4, bristles: 6 });
  ctx.restore();
  LGF(c[0], c[1], 300, '140,190,255', .8 * (1 - sm(age / .6)));
}
/* ---------- rayo cian que perfora la cúpula ---------- */
const ROOFHIT = ribP(60, PI * 6 / 14), TBOLT = 70.6;
function cyanBoltFx(t) {
  const age = t - TBOLT; if (age < -.05 || age > 1.2) return;
  const a0 = MAGE.magoB ? MAGE.magoB.tip : PJ(400, -230, 800), b = PJ(...ROOFHIT), r = mulberry32(7), pts = [];
  for (let i = 0; i <= 22; i++) { const f = i / 22, j = (i > 0 && i < 22) ? (r() - .5) * 70 * Math.sin(f * PI) : 0; pts.push([lerp(a0[0], b[0], f) + j, lerp(a0[1], b[1], f) + j * .4]); }
  const pr = clamp((age + .05) / .12), fr = clamp((age - .25) / .6);
  inkStroke(pts, { w: f => 22 * (1 - f * .5), col: CYAN, a: .95, prog: pr, from: fr, dry: .9, core: .38, seed: 9, bristles: 5 });
  if (age > .07) { const e = age - .07; inkBloom(b, 40 + 160 * easeOut(e / .5), CYAN, .8 * (1 - sm(e / 1)), 6, 1.2, 9); paperLight(b, 30 * (1 - sm(e / .5)) + 1, 1 - sm(e / .6)); LGF(b[0], b[1], 600, '170,236,250', 1.1 * (1 - sm(e / .8))); }
  LGF(a0[0], a0[1], 200, '170,236,250', .8 * (1 - sm(age / .5)));
}
/* ---------- cristales: caen, se paran en el aire, giran hacia A y vuelan contra la cúpula ---------- */
const TFREEZE = 75.2, TTHROW = 78.2, NGL = 230;
const GLS = []; { for (let i = 0; i < NGL; i++) { const h = k => hsh(i, k + 40), x = -300 + h(1) * 600, th = PI * (3.2 + h(2) * 5.8) / 14, p = ribP(x, th); GLS.push({ p, ts: 70.75 + (h(3) < .4 ? h(4) * .6 : h(4) * 3.9), v0: 50 + h(5) * 80, dx: (h(6) - .5) * 70, dz: (h(7) - .5) * 90, L: 10 + h(8) * 22, rot: h(9) * TAU, spin: (h(10) - .5) * 9, dly: h(11) * .7, h: h(12) }); } }
function domeCenter() { const P = mageState('magoA', 80); return [P.x + 16, -24, 800]; }
const DOMER = 178;
function glassPos(g, t) {   // posición, ángulo y fase de un cristal en t
  if (t < g.ts) return null;
  const fall = tt => { const tau = Math.max(0, tt - g.ts); return [g.p[0] + g.dx * tau, Math.min(0, g.p[1] + g.v0 * tau + 24 * tau * tau), g.p[2] + g.dz * tau]; };
  if (t < TFREEZE || g.ts > TFREEZE) { const q = fall(t); return { q, ang: g.rot + g.spin * (t - g.ts), ph: q[1] >= 0 ? 'floor' : 'fall' }; }
  const q0 = fall(TFREEZE); if (q0[1] >= 0) return { q: q0, ang: g.rot, ph: 'floor' };
  const hover = [q0[0] + Math.sin(t * 2 + g.h * 9) * 3, q0[1] + Math.sin(t * 1.6 + g.h * 7) * 4, q0[2]];
  const C = domeCenter(), d3 = [q0[0] - C[0], q0[1] - C[1], q0[2] - C[2]], l3 = Math.hypot(...d3) || 1, dir = [d3[0] / l3, d3[1] / l3], target = [C[0] + d3[0] / l3 * DOMER, C[1] + d3[1] / l3 * DOMER, C[2] + d3[2] / l3 * DOMER];
  const aim = Math.atan2(C[1] - q0[1], C[0] - q0[0]), tf = TTHROW + g.dly;
  if (t < tf) { const k = sm((t - 77.2) / 1); return { q: hover, ang: lerp(g.rot + g.spin * (TFREEZE - g.ts), aim, k), ph: 'hover' }; }
  const f = (t - tf) / .42; if (f < 1) return { q: [lerp(hover[0], target[0], f * f), lerp(hover[1], target[1], f * f), lerp(hover[2], target[2], f * f)], ang: aim, ph: 'fly' };
  return { q: target, ang: aim, ph: 'dust', ti: tf + .42 };
}
/* cuatro clases de esquirla: astilla, trozo de cuatro lados, aguja y curva (de los arcos de abanico) */
function shardShape(g, p, a, L) {
  const k = Math.floor(g.h * 4), c = Math.cos(a), sn = Math.sin(a), T = (u, v) => [p[0] + c * u * L - sn * v * L, p[1] + sn * u * L + c * v * L];
  if (k === 0) return [T(0, -.22), T(1, 0), T(0, .13)];
  if (k === 1) return [T(-.3, -.28), T(.85, -.12), T(.6, .3), T(-.42, .18)];
  if (k === 2) return [T(-.5, -.05), T(1.5, 0), T(-.5, .06)];
  const o = []; for (let i = 0; i <= 5; i++) { const f = i / 5, an = -.9 + f * 1.8; o.push(T(Math.sin(an) * .9, .5 - Math.cos(an) * .55)); } for (let i = 5; i >= 0; i--) { const f = i / 5, an = -.9 + f * 1.8; o.push(T(Math.sin(an) * .75, .5 - Math.cos(an) * .4)); } return o;
}
function glassFx(t) {
  if (t < 70.75 || t > 96) return;
  const Pg = new Path2D(), Pe = new Path2D(), Pd = new Path2D(), lit = .45 + WS.flash * .55;
  for (const g of GLS) {
    const S = glassPos(g, t); if (!S) continue;
    if (S.ph === 'dust') {   /* polvo de cristal que cae como nieve luminosa sobre el musgo */
      for (let k = 0; k < 5; k++) { const age = t - S.ti, x = S.q[0] + (hsh(k, g.h * 99) - .5) * 60 + Math.sin(age * 1.3 + k) * 14, y = Math.min(0, S.q[1] + age * (28 + hsh(k, g.h) * 26) - 10), p = PJ(x, y, 800 + (hsh(k, 7) - .5) * 60), a = 1 - sm((age - 6) / 4); if (a <= 0) continue; dotP(Pd, p[0], p[1], 1.6 + hsh(k, 3)); if (k === 0 && age < 1.2) LGF(p[0], p[1], 26, '255,236,180', .5 * (1 - age / 1.2)); }
      if (t - S.ti < .2) { const p = PJ(...S.q); LGF(p[0], p[1], 60, '255,230,170', 1 - (t - S.ti) / .2); }
      continue;
    }
    if (S.ph === 'floor' && t > 92) continue;
    const p = PJ(...S.q), s = PS(S.q[2]), L = g.L * s * (S.ph === 'fly' ? 1.6 : 1), a = S.ang;
    const sh = shardShape(g, p, a, L); Pg.moveTo(...sh[0]); for (const q of sh) Pg.lineTo(...q); Pg.closePath();
    Pe.moveTo(...sh[0]); Pe.lineTo(...sh[1]);
    if (S.ph === 'fly') { Pe.moveTo(...p); Pe.lineTo(p[0] - Math.cos(a) * L * 2.5, p[1] - Math.sin(a) * L * 2.5); }
  }
  ctx.fillStyle = `rgba(200,220,232,${.45 * lit + .2})`; ctx.fill(Pg);
  ctx.strokeStyle = `rgba(250,252,250,${.55 * lit + .25})`; ctx.lineWidth = 1; ctx.stroke(Pe);
  ctx.fillStyle = 'rgba(255,240,200,.9)'; ctx.fill(Pd);
  /* la orden de parar: un pulso de tinta azul pálida recorre la nube */
  const fa = t - TFREEZE; if (fa > 0 && fa < 1) { const c = PJ(0, -520, 950); inkBloom(c, 80 + 600 * easeOut(fa), '170,214,240', .25 * (1 - fa), 3); }
}
/* la lluvia que entra por el hueco del techo */
function rainInFx(t, heavy = 1) {
  if (!WS.rain || WS.final) return;
  const P = new Path2D(), sp = 1500;
  for (let i = 0; i < 240 * heavy; i++) {
    const x = -300 + hsh(i, 1) * 600 + windDisp(t) * 0, z = 860 + hsh(i, 2) * 360, per = 1200 / sp, ph = ((t + hsh(i, 3) * per) % per) / per, y = -1150 + ph * 1150 + hsh(i, 4) * 30;
    if (z - CAM.z < 50) continue; const w = windAt(t) * 160, a = PJ(x + w * ph, y, z), b = PJ(x + w * (ph + .03), y + 46, z); P.moveTo(...a); P.lineTo(...b);
  }
  ctx.strokeStyle = `rgba(206,218,232,${.32 + WS.flash * .4})`; ctx.lineWidth = 1; ctx.stroke(P);
  const Q = new Path2D(); for (let i = 0; i < 50; i++) { const per = .5 + hsh(i, 6) * .5, ph = ((t + hsh(i, 7)) % per) / per, x = -300 + hsh(i, 8) * 600, z = 860 + hsh(i, 9) * 360, c = PJ(x, 0, z), s = PS(z), r = (3 + ph * 16) * s; Q.moveTo(c[0] + r, c[1]); Q.ellipse(c[0], c[1], r, r * .25, 0, 0, TAU); }
  ctx.strokeStyle = 'rgba(214,224,236,.35)'; ctx.stroke(Q);
}
/* cúpula de A, en 3D: celdas hexagonales sobre una esfera en perspectiva. La mitad de atrás se dibuja
   detrás del mago y la de delante encima; la esfera gira despacio y cada impacto manda una onda por la superficie */
const DOMEC = []; {
  const rows = 11; for (let j = 0; j < rows; j++) { const la = -PI / 2 + (j + .5) / rows * PI * .62, n = Math.max(3, Math.round(Math.cos(la) * 26)); for (let i = 0; i < n; i++) DOMEC.push({ la, lo: (i + (j & 1) * .5) / n * TAU, dl: PI * .62 / rows, dn: TAU / n, h: hsh(i, j + 60) }); }
}
function domeImpacts(t) { const L = []; for (const g of GLS) { const S = glassPos(g, t); if (S && S.ph === 'dust' && t - S.ti < 1.4) L.push([S.q, S.ti]); } return L; }
function domeHalf(t, front) {
  if (t < 79.55 || t > 89.6) return;
  const C = domeCenter(), R = DOMER, rot = (t - 79.6) * .22, out = sm((t - 87.6) / 1.8), imp = domeImpacts(t);
  const cam = [CAM.x, CAM.y, CAM.z], Pf = new Path2D(), Pl = new Path2D(), Pw = new Path2D();
  const sph = (la, lo) => { const c = Math.cos(la); return [Math.cos(lo + rot) * c, Math.sin(la), Math.sin(lo + rot) * c]; };   // y < 0 = arriba
  let lit = 0;
  for (const cell of DOMEC) {
    const n = sph(cell.la, cell.lo), P = [C[0] + n[0] * R, C[1] + n[1] * R, C[2] + n[2] * R]; if (P[1] > -2) continue;
    const v = nrm2([P[0] - cam[0], P[2] - cam[2]]), facing = -(n[0] * (P[0] - cam[0]) + n[1] * (P[1] - cam[1]) + n[2] * (P[2] - cam[2])) / Math.hypot(P[0] - cam[0], P[1] - cam[1], P[2] - cam[2]);
    if ((facing > 0) !== front) continue;
    /* aparece de abajo arriba siguiendo el arco; se deshace celda a celda */
    const grow = sm((t - 79.6 - (1 + n[1]) * .25) / .25), fade = 1 - sm((out * 1.4 - cell.h * .4) / .4), vis = grow * fade; if (vis < .02) continue;
    let wave = 0; for (const [q, ti] of imp) { const d = [q[0] - C[0], q[1] - C[1], q[2] - C[2]], l = Math.hypot(...d) || 1, ang = Math.acos(clamp((d[0] * n[0] + d[1] * n[1] + d[2] * n[2]) / l, -1, 1)), age = t - ti; wave += Math.exp(-((ang - age * 2.2) ** 2) / .03) * Math.exp(-age * 2.2); }
    wave = Math.min(1, wave);
    const bul = 1 + wave * .05, hx = .44;
    const pts = []; for (let k = 0; k < 6; k++) { const a = k / 6 * TAU + PI / 6, la = cell.la + Math.sin(a) * cell.dl * hx * 1.15, lo = cell.lo + Math.cos(a) * cell.dn * hx * 1.15; const m = sph(la, lo); pts.push(PJ(C[0] + m[0] * R * bul, Math.min(0, C[1] + m[1] * R * bul), C[2] + m[2] * R * bul)); }
    const T = wave > .15 ? Pw : (cell.h < .18 ? Pf : Pl); T.moveTo(...pts[0]); for (const p of pts) T.lineTo(...p); T.closePath();
    lit += wave;
    cell._vis = vis; cell._fr = Math.abs(facing);
  }
  const a = (front ? 1 : .45) * (1 - out);
  ctx.save(); ctx.lineJoin = 'round';
  ctx.fillStyle = `rgba(${GOLD},${.1 * a})`; ctx.fill(Pf);
  ctx.strokeStyle = `rgba(${GOLD},${.55 * a})`; ctx.lineWidth = Math.max(.8, 1.6 * PS(800) / 1.44); ctx.stroke(Pl); ctx.stroke(Pf);
  ctx.fillStyle = `rgba(255,232,170,${.5 * a})`; ctx.fill(Pw); ctx.strokeStyle = `rgba(255,246,220,${.9 * a})`; ctx.stroke(Pw);
  ctx.restore();
  if (front && lit > .5) { const c = PJ(...C); LGF(c[0], c[1] - DOMER * PS(800) * .4, DOMER * PS(800) * 1.4, '255,220,150', Math.min(.6, lit * .02)); }
}
function domeFx(t) {
  if (t < 79.25 || t > 90) return;
  trail('magoA', 78.9, 79.7, t, GOLD, 16, { fade: .5 });
  const C = domeCenter(), c = PJ(...C), s = PS(800), R = DOMER * s, out = sm((t - 87.6) / 1.8), pr = clamp((t - 79.3) / .45);
  /* el contorno de la esfera: un ensō dorado que solo cubre lo que está sobre el suelo */
  const ring = []; for (let i = 0; i <= 64; i++) { const a = PI * 1.02 + i / 64 * PI * .96; ring.push([c[0] + Math.cos(a) * R * (1 + .012 * Math.sin(i * 1.3)), c[1] + Math.sin(a) * R]); }
  inkStroke(ring, { w: f => (13 - 7 * Math.abs(f - .5)) * s, col: GOLD, a: .9 * (1 - out), prog: pr, dry: .85, core: .3, seed: 2, bristles: 6 });
  /* donde la cúpula toca el suelo: un anillo de luz en perspectiva */
  const fl = PJ(C[0], 0, C[2]), rx = Math.sqrt(Math.max(0, DOMER ** 2 - C[1] ** 2)) * s, ry = rx * (-CAM.y) / Math.max(60, C[2] - CAM.z) * .9;
  ctx.strokeStyle = `rgba(${GOLD},${.6 * pr * (1 - out)})`; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.ellipse(fl[0], fl[1], rx, ry, 0, 0, TAU); ctx.stroke();
  for (const g of GLS) { const S = glassPos(g, t); if (!S || S.ph !== 'dust') continue; const age = t - S.ti; if (age > .5) continue; const p = PJ(...S.q); paperLight(p, 10 * s * (1 - age * 2) + .5, 1 - age * 2); }
  LGF(c[0], c[1], R * 1.6, '255,214,140', .3 * (1 - out)); LGT(fl[0], fl[1], R * 1.4, '255,200,120', .35 * (1 - out));
}
/* ---------- bloque 4: grietas esmeralda y raíces gigantes ---------- */
const CRK = []; { for (let i = 0; i <= 15; i++) { const x = lerp(-405, 430, i / 15); CRK.push([x, 800 + (i % 2 ? 1 : -1) * (24 + hsh(i, 2) * 26) * (i > 0 && i < 15 ? 1 : 0)]); } }
const TCRK = 91.2;
function crackFloor(t) {
  if (t < TCRK) return;
  const pr = clamp((t - TCRK) / 2.2), glow = 1 - sm((t - 96) / 5), n = Math.max(2, Math.ceil(pr * CRK.length)), pts = CRK.slice(0, n).map(([x, z]) => PJ(x, 0, z));
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = 'rgba(20,18,16,.9)'; ctx.lineWidth = 7; ctx.stroke(pLine(pts));
  if (glow > .01) { inkStroke(pts, { w: f => 9, col: EMER, a: .95 * glow, prog: 1, dry: .95, core: .4, seed: 5, bristles: 3 }); for (let i = 0; i < n; i += 2) LGT(pts[i][0], pts[i][1], 160, '90,230,140', .5 * glow); const h = pts[n - 1]; LGF(h[0], h[1], 120, '120,255,170', .8 * glow * (pr < 1 ? 1 : .3)); }
  for (let i = 1; i < n - 1; i += 2) { const [x, z] = CRK[i], r = mulberry32(i), br = [[x, z]]; for (let k = 0; k < 4; k++) br.push([br[k][0] + (r() - .5) * 60, br[k][1] + (r() - .5) * 50]); const bp = br.map(([a, b]) => PJ(a, 0, b)); ctx.strokeStyle = glow > .01 ? `rgba(${EMER},${.7 * glow})` : 'rgba(20,18,16,.8)'; ctx.lineWidth = 2; ctx.stroke(pLine(bp)); }
}
/* raíces: [inicio, control, fin] en el mundo, grosor, nacimiento, corte {t, f, lado} */
const GROOTS = [
  { P: [[-610, 0, 1012], [-520, -440, 1000], [-405, 0, 1030]], w: 40, tb: 95.2, cut: { t: 101.6, f: .5, sd: 1, ang: 1.05 } },
  { P: [[-265, 0, 790], [-170, -360, 800], [-55, 0, 812]], w: 42, tb: 94.2, cut: { t: 100.6, f: .46, sd: -1, ang: -1.15 } },
  { P: [[-60, 0, 832], [60, -500, 842], [196, 0, 852]], w: 50, tb: 94.7, cut: { t: 99.6, f: .52, sd: 1, ang: 1.25 } },
  { P: [[214, 0, 776], [262, -400, 768], [306, 0, 770]], w: 40, tb: 95.6, cut: { t: 98.62, f: .55, sd: 1, ang: -.85 } },
  { P: [[300, 0, 945], [320, -560, 952], [420, -660, 958]], w: 46, tb: 96.4, spike: 1, cut: { t: 109.72, f: .5, sd: 1, toCol: 1, ang: .55 } },
];
const groot = (R, f) => { const [a, c, b] = R.P, u = 1 - f; return [u * u * a[0] + 2 * u * f * c[0] + f * f * b[0], u * u * a[1] + 2 * u * f * c[1] + f * f * b[1], u * u * a[2] + 2 * u * f * c[2] + f * f * b[2]]; };
function grootDraw(R, t) {
  if (t < R.tb) return;
  const g = easeOut((t - R.tb) / 1.5), cutT = R.cut && t > R.cut.t ? R.cut : null, fEnd = Math.min(g, cutT ? R.cut.f : 1);
  const seg = (f0, f1, xf) => { const pts = [], ws = [], n = 30, sd = R.tb; for (let i = 0; i <= n; i++) { const f = lerp(f0, f1, i / n); let q = groot(R, f); q = [q[0] + N2(f * 4, sd) * 26 * Math.sin(f * PI), q[1] + N2(f * 4 + 9, sd) * 14, q[2]]; if (xf) q = xf(q); if (q[2] - CAM.z < 30) return null; pts.push(PJ(...q)); const base = R.spike ? (1 - f * .88) : (.55 + .45 * Math.sin(f * PI)) * (f < .08 || f > .92 ? .7 : 1); ws.push(R.w * base * (1 + .28 * N2(f * 9, sd + 3) + .18 * Math.pow(Math.abs(Math.sin(f * 17 + sd)), 8)) * PS(q[2])); } return { pts, ws }; };
  const draw = (S, cutEnd) => {
    if (!S) return;
    ctx.fillStyle = 'rgb(34,27,23)'; ctx.fill(pPolys([stripP(S.pts, f => S.ws[Math.round(f * (S.ws.length - 1))])]));
    ctx.strokeStyle = 'rgba(92,74,58,.6)'; ctx.lineWidth = 1.4; ctx.stroke(pLine(S.pts.map((p, i) => [p[0], p[1] - S.ws[i] * .25])));
    /* espinas */
    const P = new Path2D(); for (let i = 2; i < S.pts.length - 1; i += 2) { const p = S.pts[i], d = nrm2(sub(S.pts[i + 1], S.pts[i - 1])), nn = [-d[1], d[0]], w = S.ws[i] * .5, sg = i % 4 ? 1 : -1, l = w * 1.1; P.moveTo(p[0] + nn[0] * w * sg - d[0] * w * .3, p[1] + nn[1] * w * sg - d[1] * w * .3); P.lineTo(p[0] + nn[0] * (w + l) * sg + d[0] * l * .4, p[1] + nn[1] * (w + l) * sg + d[1] * l * .4); P.lineTo(p[0] + nn[0] * w * sg + d[0] * w * .3, p[1] + nn[1] * w * sg + d[1] * w * .3); P.closePath(); }
    ctx.fillStyle = 'rgb(30,24,20)'; ctx.fill(P);
    /* raicillas que salen del cuerpo y corteza a plumilla */
    ctx.strokeStyle = 'rgba(30,24,20,.95)'; ctx.lineCap = 'round';
    for (let i = 3; i < S.pts.length - 2; i += 5) { const p = S.pts[i], d = nrm2(sub(S.pts[i + 1], S.pts[i - 1])), nn = [-d[1], d[0]], w = S.ws[i] * .5, sg = (i * 7) % 3 === 0 ? -1 : 1, l = w * (1.6 + (i % 4) * .6); ctx.lineWidth = Math.max(1, w * .22); ctx.beginPath(); ctx.moveTo(p[0] + nn[0] * w * .8 * sg, p[1] + nn[1] * w * .8 * sg); ctx.quadraticCurveTo(p[0] + nn[0] * (w + l * .6) * sg + d[0] * l * .3, p[1] + nn[1] * (w + l * .6) * sg + d[1] * l * .3, p[0] + nn[0] * (w + l) * sg + d[0] * l * .9, p[1] + nn[1] * (w + l) * sg + d[1] * l * .9); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(80,64,50,.5)'; ctx.lineWidth = 1;
    for (let k = -1; k <= 1; k += 2) ctx.stroke(pLine(S.pts.map((p, i) => { const d = nrm2(sub(S.pts[Math.min(S.pts.length - 1, i + 1)], S.pts[Math.max(0, i - 1)])); return [p[0] - d[1] * S.ws[i] * .22 * k, p[1] + d[0] * S.ws[i] * .22 * k]; })));
  };
  /* cara del corte: elipse a lo largo de la línea del tajo; cuanto más oblicuo el tajo, más larga */
  const face = (pc, tang, ang, w) => { const rel = Math.abs(Math.sin(Math.atan2(tang[1], tang[0]) - ang)), maj = w * .5 / Math.max(.4, rel), mn = w * .2;
    ctx.save(); ctx.translate(pc[0], pc[1]); ctx.rotate(ang); const gr = ctx.createRadialGradient(0, 0, 0, 0, 0, maj); gr.addColorStop(0, 'rgb(150,126,88)'); gr.addColorStop(1, 'rgb(104,84,60)'); ctx.fillStyle = gr; ctx.beginPath(); ctx.ellipse(0, 0, maj, mn, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = 'rgba(70,54,38,.7)'; ctx.lineWidth = 1; for (const k of [.35, .65]) { ctx.beginPath(); ctx.ellipse(0, 0, maj * k, mn * k, 0, 0, TAU); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(110,224,220,.85)'; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.ellipse(0, 0, maj, mn, 0, 0, TAU); ctx.stroke(); ctx.restore(); };
  const halfClip = (pc, ang, keep) => { const d = [Math.cos(ang), Math.sin(ang)], n = [-d[1], d[0]], sg = Math.sign((keep[0] - pc[0]) * n[0] + (keep[1] - pc[1]) * n[1]) || 1, F = 5000; ctx.beginPath(); ctx.moveTo(pc[0] - d[0] * F, pc[1] - d[1] * F); ctx.lineTo(pc[0] + d[0] * F, pc[1] + d[1] * F); ctx.lineTo(pc[0] + d[0] * F + n[0] * F * sg, pc[1] + d[1] * F + n[1] * F * sg); ctx.lineTo(pc[0] - d[0] * F + n[0] * F * sg, pc[1] - d[1] * F + n[1] * F * sg); ctx.closePath(); ctx.clip(); };
  if (!cutT) { draw(seg(0, fEnd), 0); return; }
  const c0 = groot(R, cutT.f), pc = PJ(...c0), q0 = PJ(...groot(R, cutT.f - .04)), q1 = PJ(...groot(R, cutT.f + .04)), tang = nrm2(sub(q1, q0)), wC = R.w * (R.spike ? 1 - cutT.f * .88 : (.55 + .45 * Math.sin(cutT.f * PI))) * PS(c0[2]);
  ctx.save(); halfClip(pc, cutT.ang, PJ(...groot(R, cutT.f - .15))); draw(seg(0, Math.min(1, cutT.f + .1)), 0); ctx.restore();
  face(pc, tang, cutT.ang, wC);
  if (cutT) {   /* la rodaja cae: gira sobre el corte y baja hasta el suelo */
    const tau = t - cutT.t, c0 = groot(R, cutT.f), fallK = cutT.toCol ? clamp(tau / .48) : clamp(tau / .6);
    const ang = cutT.sd * (cutT.toCol ? 1.15 : 1.3) * fallK * fallK, drop = Math.min(-c0[1] * .78, .5 * GRAV * tau * tau * (cutT.toCol ? .55 : 1));
    const shift = cutT.toCol ? [Math.min(70, tau * 140), 0, Math.min(80, tau * 180)] : [cutT.sd * Math.min(30, tau * 60), 0, 0];
    /* primero resbala por el plano del corte, luego cae */
    const sl = Math.min(26, tau * 170) * (cutT.toCol ? .4 : 1), dC = [Math.cos(cutT.ang) * Math.sign(Math.cos(cutT.ang) * cutT.sd || 1), Math.sin(cutT.ang) * Math.sign(Math.cos(cutT.ang) * cutT.sd || 1)];
    const xf = q => { const dx = q[0] - c0[0], dy = q[1] - c0[1]; return [c0[0] + dx * Math.cos(ang) - dy * Math.sin(ang) + shift[0] + dC[0] * sl, Math.min(-4, c0[1] + dx * Math.sin(ang) + dy * Math.cos(ang) + drop + dC[1] * sl), q[2] + shift[2]]; };
    const pc2 = PJ(...xf(c0));
    ctx.save(); halfClip(pc2, cutT.ang + ang, PJ(...xf(groot(R, Math.min(1, cutT.f + .15))))); draw(seg(Math.max(0, cutT.f - .1), 1, xf), 0); ctx.restore();
    if (tau < .5) face(pc2, tang, cutT.ang + ang, wC);
  }
}
/* rodajas limpias que salen volando de cada corte y quedan en el suelo */
function slicesFx(t) {
  for (const R of GROOTS) { const C = R.cut, age = t - C.t; if (age < 0) continue;
    const c0 = groot(R, C.f), w = R.w * (R.spike ? 1 - C.f * .88 : (.55 + .45 * Math.sin(C.f * PI)));
    for (let k = 0; k < 2; k++) {
      const vx = C.sd * (150 + 120 * hsh(k, C.t)) * (k ? -.4 : 1), vy = -(260 + 140 * hsh(k + 3, C.t)), vz = (hsh(k, 9) - .5) * 160, tl = (-vy + Math.sqrt(vy * vy + 2 * GRAV * -c0[1])) / GRAV, ta = Math.min(age, tl);
      const q = [c0[0] + vx * ta, Math.min(0, c0[1] + vy * ta + .5 * GRAV * ta * ta), c0[2] + vz * ta], p = PJ(...q), s = PS(q[2]), spin = age < tl ? age * (14 + k * 5) : tl * (14 + k * 5);
      const ry = age < tl ? Math.abs(Math.cos(spin)) * .9 + .1 : .28, rx = w * .5 * s, r2 = rx * ry, rot = age < tl ? C.ang + spin * .3 : .05;
      ctx.save(); ctx.translate(p[0], p[1] - (age >= tl ? r2 * .6 : 0)); ctx.rotate(rot);
      ctx.fillStyle = 'rgb(30,24,20)'; ctx.beginPath(); ctx.ellipse(0, 0, rx * 1.06, r2 * 1.06 + 1.2 * s, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = 'rgb(140,116,80)'; ctx.beginPath(); ctx.ellipse(0, -.8 * s, rx, r2, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = 'rgba(70,54,38,.7)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(0, -.8 * s, rx * .55, r2 * .55, 0, 0, TAU); ctx.stroke();
      ctx.strokeStyle = 'rgba(110,224,220,.8)'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.ellipse(0, -.8 * s, rx, r2, 0, 0, TAU); ctx.stroke(); ctx.restore();
    } }
}
function grootDust(t) {   // tierra y polvo al brotar y al caer las rodajas
  const Pd = new Path2D();
  for (const R of GROOTS) {
    for (const [tb, at] of [[R.tb, R.P[0]], [R.tb + .3, R.P[2][1] === 0 ? R.P[2] : R.P[0]], ...(R.cut ? [[R.cut.t + .55, groot(R, Math.min(1, R.cut.f + .3))]] : [])]) {
      const age = t - tb; if (age < 0 || age > 4) continue;
      for (let i = 0; i < 14; i++) { const vx = (hsh(i, tb) - .5) * 360, vy = -200 - hsh(i, tb + 1) * 420, y = vy * age + .5 * GRAV * age * age; if (y > 0 && age > .15) continue; const p = PJ(at[0] + vx * age, Math.min(0, y), at[2]), r = (2 + hsh(i, 5) * 4) * PS(at[2]); dotP(Pd, p[0], p[1], r); }
      for (let i = 0; i < 4; i++) { const p = PJ(at[0] + (hsh(i, tb + 4) - .5) * 160 + age * 30, -40 - age * 40, at[2]), r = (60 + age * 70) * PS(at[2]), a = .3 * (1 - age / 4); const gr = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], r); gr.addColorStop(0, `rgba(96,86,74,${a})`); gr.addColorStop(1, 'rgba(96,86,74,0)'); ctx.fillStyle = gr; ctx.fillRect(p[0] - r, p[1] - r, r * 2, r * 2); }
    }
  }
  ctx.fillStyle = 'rgba(46,36,28,.95)'; ctx.fill(Pd);
}
/* cortes de luz violeta */
const SLASHES = [98.55, 99.55, 100.55, 101.55, 109.66];
function slashFx(t) {
  for (const ts of SLASHES) {
    const age = t - ts; if (age < 0 || age > .45) continue;
    const R = GROOTS.find(r => r.cut && Math.abs(r.cut.t - ts) < .2), c = R ? PJ(...groot(R, R.cut.f)) : PJ(300, -200, 800), s = PS(800);
    const tip = tipAt('magoB', ts), mid = L2(tip, c, .5), pts = [];
    for (let i = 0; i <= 30; i++) { const f = i / 30, a = lerp(-1.1, 1.1, f); pts.push([c[0] + Math.cos(a + PI * .5) * 120 * s - (c[0] - mid[0]) * .2 * (1 - Math.abs(f - .5)), c[1] + Math.sin(a + PI * .5) * 40 * s + lerp(-220, 220, f) * s]); }
    inkStroke(pts, { w: f => 20 * s * Math.sin(f * PI), col: VIOL, a: .92 * (1 - sm(age / .45)), prog: clamp(age / .12), from: clamp((age - .15) / .3), dry: .9, core: .35, seed: 13, bristles: 5 });
    LGF(c[0], c[1], 260 * s, '190,140,255', .9 * (1 - age / .45));
  }
}
/* savia fosforescente: gotas que salen del corte y manchas en el vidrio */
const SAPSTAIN = []; { const r = mulberry32(5); for (const R of GROOTS) for (let k = 0; k < 7; k++) { const c = groot(R, R.cut.f); SAPSTAIN.push({ x: c[0] + (r() - .5) * 700, y: -80 - r() * 420, t: R.cut.t + .5 + r() * .4, r: 6 + r() * 16, seed: k }); } }
function sapFx(t) {
  const P = new Path2D();
  for (const R of GROOTS) { const age = t - R.cut.t; if (age < 0 || age > 1.6) continue; const c = groot(R, R.cut.f);
    for (let i = 0; i < 16; i++) { const vx = (hsh(i, R.tb) - .5) * 600, vy = -150 - hsh(i, R.tb + 2) * 380, vz = hsh(i, 4) * 500, y = c[1] + vy * age + .5 * GRAV * age * age; if (y > 0) continue; const p = PJ(c[0] + vx * age, y, c[2] + vz * age), r = (2.5 + hsh(i, 6) * 3) * PS(c[2] + vz * age); dotP(P, p[0], p[1], r); } }
  ctx.fillStyle = 'rgba(150,240,236,.95)'; ctx.fill(P);
}
function sapWall(t) {   // manchas de savia que brillan en el vidrio del fondo (hasta el final)
  for (const S of SAPSTAIN) { const age = t - S.t; if (age < 0) continue; if (S.x > 300 && S.x < 900 && t > 111) continue;
    const c = PJ(S.x, S.y + Math.min(40, age * 6), ZF), s = PS(ZF), a = Math.min(1, age * 6) * (.65 + .35 * Math.sin(t * 1.3 + S.seed));
    inkBloom(c, S.r * s * Math.min(1, .3 + age * 4), '110,220,214', .55 * a, S.seed, .4, 6);
    ctx.strokeStyle = `rgba(110,220,214,${.4 * a})`; ctx.lineWidth = Math.max(.6, 1.6 * s); ctx.beginPath(); ctx.moveTo(c[0], c[1]); ctx.lineTo(c[0] + Math.sin(S.seed) * 3 * s, c[1] + Math.min(90, age * 20) * s); ctx.stroke();
    LGT(c[0], c[1], S.r * 5 * s, '110,230,214', .25 * a);
  }
}
/* remaches que saltan como balas al ceder la columna */
function rivetFx(t) {
  const age = t - 110.25; if (age < 0 || age > .6) return;
  ctx.lineCap = 'round';
  for (let i = 0; i < 14; i++) { const y0 = -180 - hsh(i, 1) * 420, a = hsh(i, 2) * TAU, sp = 900 + hsh(i, 3) * 900, p0 = PJ(450, y0, ZC), x = 450 + Math.cos(a) * sp * age, y = y0 + Math.sin(a) * sp * age * .7, z = ZC - Math.abs(Math.sin(a)) * sp * age * .5, p = PJ(x, y, z), q = PJ(x - Math.cos(a) * 70, y - Math.sin(a) * 50, z);
    ctx.strokeStyle = `rgba(20,18,20,${1 - age / .6})`; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(...q); ctx.lineTo(...p); ctx.stroke(); ctx.fillStyle = 'rgba(255,220,160,.9)'; ctx.beginPath(); ctx.arc(p[0], p[1], 1.6, 0, TAU); ctx.fill(); }
  if (age < .12) { const p0 = PJ(450, -330, ZC); LGF(p0[0], p0[1], 50, '255,210,150', .7 * (1 - age / .12)); }
  /* el chirrido visual: líneas de tensión a tinta alrededor del doblez */
  const c = PJ(450, -330, ZC); for (let i = 0; i < 9; i++) { const a = i / 9 * TAU + .2, r1 = 30 + age * 200, r2 = r1 + 40 + hsh(i, 9) * 40; ctx.strokeStyle = `rgba(16,14,18,${.8 * (1 - age / .6)})`; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(c[0] + Math.cos(a) * r1, c[1] + Math.sin(a) * r1); ctx.lineTo(c[0] + Math.cos(a) * r2, c[1] + Math.sin(a) * r2); ctx.stroke(); }
}
/* el muro al caer: cristales que se esparcen por el suelo */
function wallDebrisFx(t) {
  const age = t - 113.6; if (age < 0 || age > 3) return;
  const P = new Path2D();
  for (let i = 0; i < 90; i++) { const x = 300 + hsh(i, 1) * 600, z = 1450 - hsh(i, 2) * 500, vx = (hsh(i, 3) - .5) * 300, vy = -100 - hsh(i, 4) * 400, y = vy * age + .5 * GRAV * age * age; const q = [x + vx * age, Math.min(0, y), z - age * 60], p = PJ(...q), s = PS(q[2]), L = (6 + hsh(i, 5) * 14) * s, a = hsh(i, 6) * TAU + age * 6 * (y < 0 ? 1 : 0); P.moveTo(p[0], p[1]); P.lineTo(p[0] + Math.cos(a) * L, p[1] + Math.sin(a) * L); P.lineTo(p[0] + Math.cos(a + .4) * L * .5, p[1] + Math.sin(a + .4) * L * .5); P.closePath(); }
  ctx.fillStyle = `rgba(210,224,232,${.75 * (1 - sm((age - 2) / 1))})`; ctx.fill(P);
}
/* huracán: hojas, papeles y tierra en remolino de izquierda a derecha */
function hurricaneFx(t) {
  const k = sm((t - 111.8) / 1.5) * (1 - sm((t - 149.5) / 1.5)); if (k < .01) return;
  const Pl = new Path2D(), Pp = new Path2D(), Pd = new Path2D();
  for (let i = 0; i < 140; i++) {
    const z = 480 + hsh(i, 1) * 950, span = 3400, sp = 380 + hsh(i, 2) * 520, x = ((hsh(i, 3) * span + sp * (t - 111.8)) % span) - span / 2 + CAM.x, sw = Math.sin(t * (1.1 + hsh(i, 4)) + i), y = -60 - hsh(i, 5) * 620 + sw * 90 + Math.cos(t * 2.3 + i) * 30;
    const p = PJ(x, y, z), s = PS(z); if (p[0] < -SW / 2 - 30 || p[0] > SW / 2 + 30) continue;
    const r = (4 + hsh(i, 6) * 8) * s, a = t * (3 + hsh(i, 7) * 6) + i, kind = i % 5;
    if (kind < 2) { Pl.moveTo(p[0] + Math.cos(a) * r, p[1] + Math.sin(a) * r); Pl.quadraticCurveTo(p[0] + Math.cos(a + 1.6) * r * .6, p[1] + Math.sin(a + 1.6) * r * .6, p[0] - Math.cos(a) * r, p[1] - Math.sin(a) * r); Pl.quadraticCurveTo(p[0] - Math.cos(a + 1.6) * r * .6, p[1] - Math.sin(a + 1.6) * r * .6, p[0] + Math.cos(a) * r, p[1] + Math.sin(a) * r); }
    else if (kind === 2) { const wv = r * 1.3 * Math.cos(a), hv = r; Pp.moveTo(p[0] - wv, p[1] - hv); Pp.lineTo(p[0] + wv, p[1] - hv * .8); Pp.lineTo(p[0] + wv, p[1] + hv); Pp.lineTo(p[0] - wv, p[1] + hv * .9); Pp.closePath(); }
    else dotP(Pd, p[0], p[1], r * .35);
  }
  ctx.globalAlpha = k; ctx.fillStyle = 'rgba(64,74,44,.9)'; ctx.fill(Pl); ctx.fillStyle = 'rgba(210,200,176,.85)'; ctx.fill(Pp); ctx.fillStyle = 'rgba(52,42,34,.8)'; ctx.fill(Pd); ctx.globalAlpha = 1;
}
/* ---------- bloque 5: haces, esfera, sombras duras, telaraña, órbitas, pulsos ---------- */
const TBEAM = 122.6, TCOLL = 153.25, CEN = [0, -112, 800];
function sphereR(t) { if (t < TBEAM + .25) return 0; if (t < 150) return (34 + 9 * Math.sin(t * 17) + 7 * N2(t * 9, 1)) * Math.min(1, (t - TBEAM - .25) * 4); return lerp(40, 3, eio((t - 150) / 3)); }
function flick(t) { return t < 150 ? .72 + .28 * N2(t * 23, 3) + .1 * Math.sin(t * 61) : 1 - sm((t - 150) / 1.2); }
function beamFx(t) {
  if (t < TBEAM || t > TCOLL) return;
  const c = PJ(...CEN), s = PS(800), pr = clamp((t - TBEAM) / .25), suck = t > 150 ? sm((t - 150) / 3) : 0;
  for (const [who, col] of [['magoA', CRIM], ['magoB', COBA]]) {
    const M = MAGE[who]; if (!M) continue; const a0 = M.tip, pts = [];
    for (let i = 0; i <= 30; i++) { const f = i / 30; pts.push([lerp(a0[0], c[0], f), lerp(a0[1], c[1], f) + Math.sin(f * 14 - t * 30) * 6 * s * Math.sin(f * PI)]); }
    const tq = Math.floor(t * 12) / 12;
    inkStroke(pts, { w: f => (22 + 8 * N2(f * 6, tq * 3)) * s * (1 - suck * .7) * (.55 + .45 * f), col, a: .92, prog: pr, from: suck * .9, dry: .97, core: .16, coreA: .7, seed: (who === 'magoA' ? 2 : 8) + Math.floor(tq * 12) % 3, bristles: 9 });
    for (let k = 0; k < 2; k++) { const q = pts.map((p, i) => [p[0], p[1] + N2(i * .25 + k * 5, tq * 4) * 22 * s * Math.sin(i / 30 * PI)]); inkStroke(q, { w: () => 2.2 * s, col, a: .45, prog: pr, from: suck * .9, dry: .9, seed: 20 + k, bristles: 2 }); }
    LGF(a0[0], a0[1], 90 * s, who === 'magoA' ? '255,120,120' : '140,170,255', .5);
  }
  const r = sphereR(t) * s, fl = flick(t);
  const rings = front => { if (t > 150 || r < 2) return; for (let k = 0; k < 3; k++) { const tilt = .25 + k * .32 + Math.sin(t * .7 + k) * .08, rot = t * (1.6 + k * .9) * (k % 2 ? -1 : 1), R2 = r * (2.1 + k * .45), pts = []; for (let i = 0; i <= 40; i++) { const a = (front ? 0 : PI) + i / 40 * PI; const x = Math.cos(a) * R2, y = Math.sin(a) * R2 * tilt; pts.push([c[0] + x * Math.cos(rot * .15) - y * Math.sin(rot * .15), c[1] + x * Math.sin(rot * .15) + y * Math.cos(rot * .15)]); } inkStroke(pts, { w: f => (front ? 4 : 2.5) * Math.sin(f * PI) * s * 1.2, col: k === 1 ? '236,214,255' : '170,120,240', a: (front ? .8 : .45) * fl, dry: .9, seed: k + Math.floor(t * 12), bristles: 3 }); } };
  rings(false);
  if (r > 2 && t < 150) { const tq = Math.floor(t * 12), L = []; for (let i = 0; i < 6; i++) { const an = hsh(i, tq) * TAU, l = r * (1.8 + hsh(i + 3, tq) * 2.6); L.push(zig([c[0] + Math.cos(an) * r * .9, c[1] + Math.sin(an) * r * .9], [c[0] + Math.cos(an) * l, c[1] + Math.sin(an) * l * .8], tq * 13 + i, r * .5, 6)); } bolts(L, '190,150,255', 1.4 * s, .75 * fl); }
  if (r > .5) {
    if (t < 150) { inkBloom(c, r * 2.4, '120,64,190', .55 * fl, Math.floor(t * 12), .7, 7); inkBloom(c, r * 1.6, '200,170,250', .55 * fl, Math.floor(t * 12) + 3, .3, 11); paperLight(c, r * .8, 1); ctx.save(); ctx.beginPath(); ctx.arc(c[0], c[1], r * .82, 0, TAU); ctx.clip(); const tq = Math.floor(t * 12) / 12; for (let k = 0; k < 4; k++) { const a0 = tq * (5 + k * 2) * (k % 2 ? -1 : 1) + k * 1.7, pts = []; for (let i = 0; i <= 14; i++) { const a = a0 + i / 14 * 2.2, rr = r * (.25 + .5 * (i / 14)); pts.push([c[0] + Math.cos(a) * rr, c[1] + Math.sin(a) * rr]); } inkStroke(pts, { w: f => r * .12 * Math.sin(f * PI), col: k % 2 ? '150,90,220' : '110,70,180', a: .55 * fl, dry: .8, seed: k, bristles: 3 }); } ctx.restore(); ctx.strokeStyle = `rgba(60,30,90,${.5 * fl})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(c[0], c[1], r * .85, 0, TAU); ctx.stroke(); }
    else { const f = (t - 150) / 3.25; ctx.fillStyle = `rgba(4,2,8,${.6 + f * .4})`; ctx.beginPath(); ctx.arc(c[0], c[1], r * 1.4, 0, TAU); ctx.fill(); ctx.strokeStyle = `rgba(236,226,255,${.8 * (1 - f * .5)})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(c[0], c[1], r * 1.4 + 3, 0, TAU); ctx.stroke(); }
    rings(true);
    LGF(c[0], c[1], 700 * s, '200,180,255', .55 * fl * (t < 150 ? 1 : 1 - sm((t - 150) / 1))); LGF(c[0], c[1], 140 * s, '255,250,255', .6 * fl * (t < 150 ? 1 : 0)); LGT(c[0], c[1], 1400 * s, '210,196,255', .7 * fl * (t < 150 ? 1 : 0));
  }
}
function clashLight(t) { if (t < TBEAM + .2 || t > 151.5) return 0; return flick(t) * Math.min(1, (t - TBEAM - .2) * 3); }
/* sombras duras de toda la estructura, hacia los bordes del encuadre */
function hardShadows(t) {
  const L = clashLight(t); if (L < .02) return;
  ctx.fillStyle = `rgba(6,4,10,${.72 * L})`;
  const cf = [0, 800];
  const shadowFrom = (x, z, w) => { const d = nrm2([x - cf[0], (z - cf[1]) * .5]), n = [-d[1], d[0]], len = 1800, q = [[x + n[0] * w, z + n[1] * w], [x - n[0] * w, z - n[1] * w], [x - n[0] * w * 2.4 + d[0] * len, z - n[1] * w * 2.4 + d[1] * len], [x + n[0] * w * 2.4 + d[0] * len, z + n[1] * w * 2.4 + d[1] * len]].map(([a, b]) => PJ(a, 0, Math.max(CAM.z + 40, b))); ctx.fill(pPolys([q])); };
  for (const [x, z] of COLS) if (z > CAM.z + 60) shadowFrom(x, z, 12);
  for (const who of ['magoA', 'magoB']) { const P = mageState(who, t); shadowFrom(P.x, P.z, 22); }
  for (const [x, z] of TFERNS.map(a => [a[0], a[1]])) shadowFrom(x, z, 10);
}
/* telaraña de grietas bajo el punto de choque */
function webFloor(t) {
  if (t < 131 || WS.final) return;
  const g = easeOut((t - 131) / 2.4), r = mulberry32(3), rays = [];
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (let i = 0; i < 16; i++) { const a = i / 16 * TAU + (r() - .5) * .3, pts = [[0, 800]]; for (let k = 1; k <= 8; k++) { const rr = k / 8 * 320 * g; pts.push([Math.cos(a + (r() - .5) * .25) * rr, 800 + Math.sin(a + (r() - .5) * .25) * rr * .55]); } rays.push(pts); }
  const pl = L => L.map(([x, z]) => PJ(x, 0, z)), glow = clashLight(t);
  ctx.strokeStyle = 'rgba(8,6,10,.95)'; ctx.lineWidth = 4.5 * PS(800) / 1.44; for (const R of rays) ctx.stroke(pLine(pl(R)));
  for (const [k, tk] of [[2, 131.6], [4, 132.3], [6, 133]]) { if (t < tk) continue; const ring = rays.map(R => R[k]); ring.push(ring[0]); ctx.stroke(pLine(pl(ring))); }
  if (glow > .02) { ctx.strokeStyle = `rgba(210,180,255,${.75 * glow})`; ctx.lineWidth = 1.6; for (const R of rays) ctx.stroke(pLine(pl(R))); }
}
/* guijarros, vidrio y gotas que levitan en anillos irregulares */
function orbitFx(t) {
  if (t < 131 || t > TCOLL) return;
  const Pp = new Path2D(), Pg = new Path2D(), Pw = new Path2D(), rise = sm((t - 131) / 2.6), suck = t > 150 ? eio((t - 150) / 3.2) : 0;
  for (let i = 0; i < 80; i++) {
    const R0 = 70 + hsh(i, 1) * 200, R = R0 * (1 + .12 * Math.sin(t * 2 + i)) * (1 - suck), tilt = (hsh(i, 2) - .5) * .9, w = (1.1 + hsh(i, 3) * 1.4) * (1 + suck * 4) * (i % 2 ? 1 : -1), a = w * (t - 131) + hsh(i, 4) * TAU;
    const orb = [CEN[0] + Math.cos(a) * R, CEN[1] + Math.sin(a) * R * .28 + Math.cos(a) * R * tilt * .4, CEN[2] + Math.sin(a) * R * .7];
    const home = [(hsh(i, 5) - .5) * 520, 0, 800 + (hsh(i, 6) - .5) * 300], q = L2(home, orb, rise).concat([lerp(home[2], orb[2], rise)]);
    const p = PJ(q[0], q[1], q[2]), s = PS(q[2]), k = i % 3;
    if (k === 0) dotP(Pp, p[0], p[1], (2 + hsh(i, 7) * 3) * s);
    else if (k === 1) { const L = (5 + hsh(i, 8) * 6) * s, an = t * 4 + i; Pg.moveTo(p[0] + Math.cos(an) * L, p[1] + Math.sin(an) * L); Pg.lineTo(p[0] + Math.cos(an + 2.5) * L * .5, p[1] + Math.sin(an + 2.5) * L * .5); Pg.lineTo(p[0] + Math.cos(an + 3.6) * L * .5, p[1] + Math.sin(an + 3.6) * L * .5); Pg.closePath(); }
    else dotP(Pw, p[0], p[1], (1.5 + hsh(i, 9) * 1.5) * s);
  }
  ctx.fillStyle = 'rgba(30,28,30,.95)'; ctx.fill(Pp); ctx.fillStyle = 'rgba(226,236,244,.85)'; ctx.fill(Pg); ctx.fillStyle = 'rgba(190,214,240,.8)'; ctx.fill(Pw);
}
function pulseFx(t) {
  for (const tp of PULSES) {
    const age = t - tp; if (age < 0 || age > 1.1) continue;
    const c = PJ(...CEN), e = easeOut(age / 1), rx = 30 + 1900 * e, ry = rx * .6, a = 1 - sm(age / 1.1);
    ctx.save(); ctx.lineWidth = 34 * a + 2; ctx.strokeStyle = `rgba(236,230,250,${.3 * a})`; ctx.beginPath(); ctx.ellipse(c[0], c[1], rx, ry, 0, 0, TAU); ctx.stroke();
    ctx.lineWidth = 3; ctx.strokeStyle = `rgba(30,20,40,${.5 * a})`; ctx.beginPath(); ctx.ellipse(c[0], c[1], rx + 20, ry + 12, 0, 0, TAU); ctx.stroke(); ctx.restore();
    if (age < .2) LGF(c[0], c[1], 600, '240,230,255', 1 - age / .2);
  }
  /* los últimos paneles del fondo estallan: lluvia de vidrio */
  if (t > 141 && t < 152) { const P = new Path2D(); for (let i = 0; i < 120; i++) { const tb = 141 + Math.floor(hsh(i, 1) * 6) * 1.6 + hsh(i, 2) * .3, age = t - tb; if (age < 0 || age > 1.4) continue; const x = -1100 + hsh(i, 3) * 2200, y = -560 + hsh(i, 4) * 480 + .5 * GRAV * age * age, z = ZF - 20 - age * 260 * hsh(i, 5); if (y > 0) continue; const p = PJ(x, y, z), s = PS(z), L = (6 + hsh(i, 6) * 10) * s, a = age * 8 + i; P.moveTo(p[0], p[1]); P.lineTo(p[0] + Math.cos(a) * L, p[1] + Math.sin(a) * L); P.lineTo(p[0] + Math.cos(a + .5) * L * .5, p[1] + Math.sin(a + .5) * L * .5); P.closePath(); } ctx.fillStyle = 'rgba(214,226,236,.8)'; ctx.fill(P); }
}
/* ---------- bloque 6: el punto negro, la onda blanca, el silencio ---------- */
function implodeFx(t) {
  if (t < 150 || t > TCOLL + .05) return;
  const f = sm((t - 150) / 3.2), c = PJ(...CEN);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const cx = W / 2 + c[0] * U, cy = H / 2 + c[1] * U, gr = ctx.createRadialGradient(cx, cy, 10 * U, cx, cy, Math.hypot(W, H) * .7);
  gr.addColorStop(0, `rgba(6,4,10,${.2 * f})`); gr.addColorStop(.25, `rgba(6,4,10,${.75 * f})`); gr.addColorStop(1, `rgba(4,2,6,${.94 * f})`);
  ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H); ctx.restore(); T0();
  /* el último hilo de luz que cae hacia el punto */
  for (let i = 0; i < 18; i++) { const a = i / 18 * TAU + t * 3, r1 = 900 * (1 - f) + 30, pts = []; for (let k = 0; k <= 12; k++) { const q = k / 12, rr = lerp(r1, 6, q), an = a + q * 2.2; pts.push([c[0] + Math.cos(an) * rr, c[1] + Math.sin(an) * rr * .7]); } ctx.strokeStyle = `rgba(226,214,250,${.25 * f})`; ctx.lineWidth = 1.2; ctx.stroke(pLine(pts)); }
}
function whiteOut(t) {   // la onda silenciosa de luz blanca; luego se disipa
  if (t < TCOLL || t > 160) return;
  const c = PJ(...CEN), e = (t - TCOLL) / .38;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (e < 1) { const r = Math.hypot(W, H) * e * 1.1, cx = W / 2 + c[0] * U, cy = H / 2 + c[1] * U; const gr = ctx.createRadialGradient(cx, cy, r * .7, cx, cy, r); gr.addColorStop(0, 'rgba(250,247,238,1)'); gr.addColorStop(1, 'rgba(250,247,238,0)'); ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H); }
  else { ctx.globalAlpha = 1 - sm((t - 154.6) / 4.8); ctx.fillStyle = 'rgb(250,247,238)'; ctx.fillRect(0, 0, W, H); }
  ctx.restore(); T0();
}
/* después: brasas y savia flotando en los charcos, hilos de humo de las varitas */
function afterFx(t) {
  if (t < 154) return;
  const Pe = new Path2D(), Ps = new Path2D();
  for (let i = 0; i < 46; i++) { const P = PUDDLES[3 + i % (PUDDLES.length - 3)], x = P.x + (hsh(i, 1) - .5) * P.rx * 1.6 + Math.sin(t * .3 + i) * 8, z = P.z + (hsh(i, 2) - .5) * P.rz * 1.2, y = -3 - Math.abs(Math.sin(t * .8 + i)) * 4, p = PJ(x, y, z), s = PS(z), r = (1.6 + hsh(i, 3) * 2) * s, pulse = .6 + .4 * Math.sin(t * 2 + i * 1.3);
    if (i % 3) { dotP(Pe, p[0], p[1], r); LGF(p[0], p[1], r * 9, '255,140,60', .35 * pulse); } else { dotP(Ps, p[0], p[1], r); LGF(p[0], p[1], r * 9, '110,230,214', .35 * pulse); } }
  ctx.fillStyle = 'rgba(255,170,90,.95)'; ctx.fill(Pe); ctx.fillStyle = 'rgba(150,240,226,.95)'; ctx.fill(Ps);
  /* hilos de humo gris que suben despacio dibujando curvas suaves */
  for (const who of ['magoA', 'magoB']) { const M = MAGE[who]; if (!M) continue; const a0 = M.tip, age = t - 155.5; if (age < 0) continue;
    const len = Math.min(900, age * 70), pts = []; for (let i = 0; i <= 40; i++) { const f = i / 40, y = -f * len; pts.push([a0[0] + Math.sin(f * 5 + t * .6 + (who === 'magoA' ? 0 : 2)) * 26 * f * M.s / 2.2 + f * f * 40, a0[1] + y * M.s / 2.6]); }
    inkStroke(pts, { w: f => (3 + 6 * f) * M.s / 2.4, col: '150,146,150', a: .55, prog: 1, from: 0, dry: .95, seed: who === 'magoA' ? 4 : 6, bristles: 3 }); }
}
