/* =====================================================================
   PERSONAJES NUEVOS SOBRE LAS PELÍCULAS ORIGINALES
   Sustituye dm() (el único punto donde las películas dibujan a un personaje):
   la pose vieja (mage) se convierte en articulaciones para el rig nuevo, que se pinta
   en una capa aparte y se compone con la transición de la escena (SA). Fondos, cámara,
   música y efectos quedan exactamente como estaban.
   ===================================================================== */
const NRA = { layer: null, g: null, cur: null, frameT: -1, count: {}, acc: {} };
function nrLayer() { if (!NRA.layer || NRA.layer.width !== W || NRA.layer.height !== H) { NRA.layer = mk(W, H); NRA.g = NRA.layer.getContext('2d'); } return NRA.g; }
for (const s of SC) { const d = s.draw; s.draw = function (...a) { NRA.cur = s; return d.apply(this, a); }; }
const NR_DEF_L = { d: [-.28, -.96], z: -.5 };
const nrHouse = h => typeof h === 'string' ? h : (h && h.a ? (h.k > .5 ? h.b : h.a) : 'G');   // sello en transición (Anami: carmesí → verde)
dm = function (who, F, x, y, s, flip, T, o = {}) {
  if (!CAST[who] || !F || !F.H) return;
  if (T !== NRA.frameT) { NRA.frameT = T; NRA.count = {}; }
  const sc = NRA.cur ? NRA.cur.t0 : 0, base = who + '@' + sc, n = (NRA.count[base] = (NRA.count[base] || 0) + 1), key = base + '#' + n;
  /* pasos de física a 60 por segundo, acumulando el resto: a 120/144 Hz un fotograma dura menos de un paso
     y redondear daba 0 pasos siempre (el pelo y la capa se quedaban congelados y estirados) */
  let st = NRA.acc[key], ticks;
  if (!st || T < st.t || T - st.t > .5) { ticks = 4; NRA.acc[key] = { t: T, a: 0 }; }
  else { st.a += T - st.t; st.t = T; ticks = Math.min(4, Math.floor(st.a * 60 + 1e-6)); st.a = Math.min(st.a - ticks / 60, 2 / 60); }
  const a = (o.a ?? 1) * SA; if (a <= .003) return;
  /* pose vieja → articulaciones (unidades de figura, pies en el origen, mirando a +x) */
  const tl = Math.hypot(F.T[0] - F.H[0], F.T[1] - F.H[1]), c = clamp(tl / (CAST[who].sex === 'f' ? 28 : 30), .55, 1.1);
  const rot = o.rot || 0, sg = flip ? -1 : 1, cr = Math.cos(rot), sr = Math.sin(rot);
  const P = p => { const q = [sg * p[0] / c, p[1] / c], r2 = [q[0] * cr - q[1] * sr, q[0] * sr + q[1] * cr]; return [sg * r2[0], r2[1]]; };
  const Hp = P(F.H), Tt = P(F.T), F1 = P(F.F1), F2 = P(F.F2), S = P(F.S), W1 = P(F.W1), W2 = P(F.W2), Hd = P(F.Hd);
  const lean = Math.atan2(Tt[0] - Hp[0], -(Tt[1] - Hp[1])), r = [Math.cos(lean), Math.sin(lean)];
  const hu = P([F.Hd[0] + F.hu[0] * c, F.Hd[1] + F.hu[1] * c]), hv = [hu[0] - Hd[0], hu[1] - Hd[1]], hl = Math.hypot(hv[0], hv[1]) || 1;
  /* la cabeza a distancia de adulto del torso: los niños del motor viejo tienen el torso corto pero el cuello de adulto,
     y al escalar el torso a talla de adulto el cuello salía estirado */
  const tv = [Hd[0] - Tt[0], Hd[1] - Tt[1]], tvl = Math.hypot(tv[0], tv[1]) || 1, hOff = CAST[who].sex === 'f' ? 10 : 10.4, HdA = [Tt[0] + tv[0] / tvl * hOff, Tt[1] + tv[1] / tvl * hOff];
  const J = { Hp, lean, F1, F2, K1: NR.ik2(Hp, F1, 24, 25, -1).E, K2: NR.ik2(Hp, F2, 24, 25, -1).E,
    Sn: [S[0] + r[0] * 1.5, S[1] + r[1] * 1.5], Sf: [S[0] - r[0] * 1.2, S[1] - r[1] * 1.2], Wn: W2, Wf: W1, t: T,
    Head: [HdA[0] - hv[0] / hl * 4.6, HdA[1] - hv[1] / hl * 4.6], headRoll: Math.atan2(hv[0], -hv[1]) };
  /* niños: piernas más cortas y cabeza más grande (proporciones de niño para contar la historia).
     Todo el cuerpo baja con la cadera, manos incluidas (si se quedaban arriba, los brazos se doblaban como un T-rex);
     lo que la escena dibuja en la mano (after) y el sello bajan lo mismo. */
  let kdy = 0, headK = 1;
  if (o.child) {
    const LK = .76, gy0 = Math.max(F1[1], F2[1], J.K1[1], J.K2[1]), sc2 = q => [Hp[0] + (q[0] - Hp[0]) * LK, Hp[1] + (q[1] - Hp[1]) * LK];
    const nk1 = sc2(J.K1), nk2 = sc2(J.K2), nf1 = sc2(F1), nf2 = sc2(F2);
    kdy = gy0 - Math.max(nf1[1], nf2[1], nk1[1], nk2[1]); headK = 1.38;
    const dn = q => [q[0], q[1] + kdy];
    Object.assign(J, { Hp: dn(Hp), K1: dn(nk1), K2: dn(nk2), F1: dn(nf1), F2: dn(nf2), Sn: dn(J.Sn), Sf: dn(J.Sf), Wn: dn(J.Wn), Wf: dn(J.Wf), Head: dn(J.Head) });
  }
  J.En = NR.ik2(J.Sn, J.Wn, 14.5, 13.5, 1).E; J.Ef = NR.ik2(J.Sf, J.Wf, 14.5, 13.5, 1).E;
  /* luz: la del hechizo más fuerte, o la del cielo */
  L(1); const m = ctx.getTransform();
  let Lt = NR_DEF_L, rimCol = '246,232,204', rimA = .55;
  if (o.light && o.light.length) { const l = o.light.reduce((b, q) => (q.a || 0) > (b.a || 0) ? q : b); if ((l.a || 0) > .05) { const ch = figPt(F.T, x, y, s, flip, rot); Lt = { d: NR.nrm2([l.x - ch[0], l.y - ch[1]]), z: -.4 }; rimCol = l.c; rimA = Math.min(1, .45 + .5 * l.a); } }
  const tip = F.tip ? figPt(F.tip, x, y, s, flip, rot) : null;
  /* sombra en el suelo (como antes) */
  if (!o.noShadow && !rot) { ctx.save(); ctx.globalAlpha = .3 * a; ctx.fillStyle = 'rgba(10,8,12,.8)'; ctx.beginPath(); ctx.ellipse(x, y, 20 * s, 3.2 * s, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  /* figura nueva en su capa */
  const g = nrLayer(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.clearRect(0, 0, W, H);
  NR.sync(g, W, H, U, SW, B.paper, m);
  NR.draw(J, { k: s * c, x0: x, y0: y, who, key, ticks, flip, wand: !!tip, wandTo: tip, L: Lt, rimCol, rimA, headK, house: nrHouse(o.house || CAST[who].house) });
  if (o.ink) { g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-atop'; g.fillStyle = `rgba(${o.ink},${o.inkA ?? .9})`; g.fillRect(0, 0, W, H); g.globalCompositeOperation = 'source-over'; }
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = Math.min(1, a * (o.inkA && o.ink ? 1 : 1)); ctx.drawImage(NRA.layer, 0, 0); ctx.restore();
  /* sello de casa (medallón original) y lo que la escena dibuje después */
  if ((o.house || CAST[who].house) && !o.noGlow) {
    L(1); ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot); ctx.scale(flip ? -s : s, s);
    const z = (1 + (CAM.z - 1) * (o.d ?? 1)) * U * s, gw = o.glow ?? 1;
    medallion(F.sig[0], F.sig[1] + kdy * c, o.child ? 3.4 : 4.3, o.house || CAST[who].house, z, { a: (o.a ?? 1) * gw, t: F.t, ph: x * .01, green: o.green, flare: o.flare, ignite: o.ignite });
    if (o.after) { ctx.translate(0, kdy * c); o.after(F); }
    ctx.restore();
  } else if (o.after) { L(1); ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot); ctx.scale(flip ? -s : s, s); ctx.translate(0, kdy * c); o.after(F); ctx.restore(); }
  L(1);
};

/* ---------- brazos en reposo ----------
   La pose «de pie» de las películas lleva el antebrazo hacia delante, en horizontal: con las mangas anchas
   del motor viejo se leía como una mano en reposo; con manos de verdad parece una garra que agarra el aire.
   Si el brazo cuelga (no está haciendo un gesto), el antebrazo se estira y queda paralelo al torso.
   Se corrige en la pose misma (mage), así los objetos y los hilos que van en la muñeca la siguen. */
const mage0 = mage;
function nrRest(p) {
  if (!p || p.lean > .26) return p;   // corriendo o lanzándose: los brazos doblados son naturales
  let q = null;
  for (const [a, e] of [['la', 'le'], ['ra', 're']]) {
    const r = 1 - sm((Math.abs(p[a]) - .5) / .45);
    if (r <= 0 || !(p[e] > .2)) continue;
    q = q || { ...p };
    q[e] = lerp(p[e], .14, r); q[a] = lerp(p[a], clamp(p[a], -.1, .12), r * .7);
  }
  return q || p;
}
mage = function (p, o) { return mage0(nrRest(p), o); };

/* ---------- magia con el material nuevo ----------
   Mismo lenguaje que el laboratorio: el hechizo es una pincelada con alma de papel, la luz es papel sin pintar,
   el golpe es una flor de tinta, el escudo es un ensō que envuelve al mago entero, el hilo es tinta sin brillo.
   Sustituye las funciones de dibujo (beam, orb, shield, hilo, vein, wristRing); los tiempos de cada escena no cambian. */
const q12 = T => Math.floor(T * 12) / 12;   // los efectos van «en doses» (12 FPS)
const spc = k => SPELL[k] || (k === 'sg' ? ['60,170,110', '220,232,232'] : k === 'violet' ? ['150,90,210', '226,206,255'] : SPELL.silver);
function nrFx() { const m = ctx.getTransform(); NR.sync(ctx, W, H, U, SW, B.paper, m); return m; }
function nrDone(m, prev) { ctx.globalAlpha = 1; ctx.globalCompositeOperation = prev; ctx.setTransform(m); }
beam = function (x1, y1, x2, y2, prog, kind, a, T, wd = 5, sd = 1) {
  const A = a * SA; if (prog <= 0 || A <= .005) return;
  const [c, cc] = spc(kind), prev = ctx.globalCompositeOperation, m = nrFx(); ctx.globalCompositeOperation = 'source-over';
  const p0 = [x1, y1], p1 = [x2, y2], dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy) || 1;
  let n = [-dy / l, dx / l]; if (n[1] > 0) n = [-n[0], -n[1]];   // el arco siempre hacia arriba
  const mid = [(x1 + x2) / 2 + n[0] * l * .09, (y1 + y2) / 2 + n[1] * l * .09], path = NR.bez(p0, mid, p1, 30), tq = q12(T);
  NR.inkStroke(path, { w: t => wd * 6.4 * Math.min(1, t * 8) * (1 - t * .45) * (1 + .2 * Math.sin(t * 11 + tq * 9 + sd) * Math.sin(t * 4.3 + sd)), col: c, a: .93 * A, prog, dry: .66, seed: sd, core: .3, coreA: A, bristles: 9 });
  if (prog < 1) NR.paperLight(path[Math.min(30, Math.round(prog * 30))], wd * 1.6, A * .9);
  else NR.inkBloom(p1, wd * (2.6 + .4 * Math.sin(tq * 17)), cc, .55 * A, sd * 3 + 1, .7, 6);
  nrDone(m, prev);
};
orb = function (x, y, r, kind, a, T) {
  const A = a * SA; if (A <= .01 || r <= 0) return;
  const [c] = spc(kind), prev = ctx.globalCompositeOperation, m = nrFx(), tq = q12(T); ctx.globalCompositeOperation = 'source-over';
  NR.inkBloom([x, y], r * 1.7 * (1 + .08 * Math.sin(tq * 14)), c, .7 * A, Math.round(x * .05) % 9 + 1, r > 10 ? .7 : 0, 7);
  NR.paperLight([x, y], Math.max(1.5, r * .6), A);
  nrDone(m, prev);
};
shield = function (x, y, r, kind, a, T, hit = 0, face = 1) {
  const A = a * SA; if (A <= .01) return;
  const [c, cc] = spc(kind), prev = ctx.globalCompositeOperation, m = nrFx(); ctx.globalCompositeOperation = 'source-over';
  /* el escudo nace en la punta de la varita; el ensō se centra en el cuerpo del mago y lo envuelve entero */
  const ce = [x - face * (r > 100 ? 80 : r * .95 + 8), y + 45], RY = Math.max(128, r * 1.25), R = RY * .8, pr = clamp(a * 1.6), ring = [], bw = 16 + r * .12;
  for (let s = 0; s <= 60; s++) { const an = -PI * .62 + s / 60 * TAU * .97; ring.push([ce[0] + face * Math.cos(an) * R * (1 + .035 * Math.sin(s * .8)), ce[1] + Math.sin(an) * RY]); }
  NR.inkStroke(ring, { w: t => bw * Math.min(1, t * 12) * (1 - t * .55) * (1 + .15 * Math.sin(t * 13)), col: c, a: .9 * A, prog: pr, dry: .62, seed: 7, core: .22, coreA: .9 * A, bristles: 10 });
  if (hit > 0) { const rp = 1 - hit; ctx.strokeStyle = `rgba(${cc},${.75 * hit * A})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(ce[0], ce[1], R * (1 + rp * .3), RY * (1 + rp * .3), 0, 0, TAU); ctx.stroke();
    NR.inkBloom([ce[0] + face * R * .98, y], 14 + 22 * rp, c, .7 * hit * A, 9, .8, 5); }
  nrDone(m, prev);
};
if (typeof hilo === 'function') {
  hilo = function (p, q, T, a, o = {}) {
    const A = a * SA; if (A <= .01) return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    const col = o.col || '220,40,50', beat = o.beat ?? Math.pow(Math.max(0, Math.sin(T * 3.4 + (o.ph || 0))), 6);
    const mx = (p[0] + q[0]) / 2 + (o.bx || 0), my = (p[1] + q[1]) / 2 + (o.sag ?? 40) + Math.sin(T * 1.7 + (o.ph || 0)) * 6, w = (o.w || 2) * 1.25;
    const prev = ctx.globalCompositeOperation; mode('source-over'); ctx.lineCap = 'round'; ctx.shadowBlur = 0;
    if (o.gap) { ctx.setLineDash(o.gap); ctx.lineDashOffset = -T * 30; }
    for (const [lw, al] of [[w * 3.2, .2], [w * (1 + beat * .5), .95]]) { ctx.strokeStyle = `rgba(${col},${al * A * (.75 + .25 * beat)})`; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.quadraticCurveTo(mx, my, q[0], q[1]); ctx.stroke(); }
    if (beat > .2 && !o.gap) { ctx.strokeStyle = `rgba(250,243,226,${.5 * beat * A})`; ctx.lineWidth = w * .45; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.quadraticCurveTo(mx, my, q[0], q[1]); ctx.stroke(); }   // el pulso: papel que se levanta en el centro
    ctx.setLineDash([]); mode(prev);
    return [mx, my];
  };
}
if (typeof vein === 'function') {
  vein = function (p, q, T, a, o = {}) {
    const A = a * SA; if (A <= .01) return;
    const sp = o.speed ?? .45, len = o.len ?? .22, n = o.n ?? 2, prev = ctx.globalCompositeOperation, m = nrFx(); ctx.globalCompositeOperation = 'source-over';
    for (let k = 0; k < n; k++) {
      const head = ((T * sp + k / n + (o.ph || 0)) % 1) * (1 + len), f0 = Math.max(0, head - len), f1 = Math.min(1, head); if (f1 <= f0) continue;
      const pts = []; for (let i = 0; i <= 16; i++) pts.push(hiloPt(p, q, T, lerp(f0, f1, i / 16), o));
      NR.inkStroke(pts, { w: t => 7 * Math.sin(Math.min(1, t * 1.1) * PI * .9 + .2), col: '50,180,96', a: .92 * A, dry: .8, seed: k + 2, bristles: 3 });
    }
    nrDone(m, prev);
  };
}
if (typeof wristRing === 'function') {
  wristRing = function (w, T, a, r = 6) {
    const A = a * SA; if (A <= .01) return; const beat = Math.pow(Math.max(0, Math.sin(T * 3.4)), 6);
    mode('source-over'); ctx.shadowBlur = 0; ctx.strokeStyle = `rgba(214,40,52,${(.75 + .25 * beat) * A})`; ctx.lineWidth = 1.8 + beat;
    ctx.beginPath(); ctx.ellipse(w[0], w[1], r, r * .45, .3, 0, TAU); ctx.stroke(); mode('multiply');
  };
}

/* fantasmas de los tres niños (Ep. II y III): también con el rig nuevo, en tinta clara y translúcidos */
if (typeof ghostKids === 'function') {
  ghostKids = function (T, a, x0, y0, s = 2.1) {
    if (a * SA <= .01) return;
    for (const [n, ox, hair, sex, fl] of [['damien', -70, 'swept', 'm', true], ['joy', 0, 'braid', 'f', false], ['anami', 70, 'short', 'm', true]]) {
      const F = mage({ ...REACH, ra: 1.45 + .05 * Math.sin(T * 2 + ox) }, { sex, hair, child: 1, t: T, wind: .2 });
      dm(n, F, x0 + ox, y0, s, fl, T, { a: a * (.5 + .1 * Math.sin(T * 1.3 + ox)), ink: '255,226,178', inkA: .8, noShadow: 1, house: CAST[n].house, glow: .5, child: 1 });
    }
    L(1); glowAt(x0, y0 - 120, 260, '255,214,150', .25 * a);
  };
}
