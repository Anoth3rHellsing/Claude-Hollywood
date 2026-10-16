/* =====================================================================
   RIG DE CUERPO
   1) La pose sale de articulaciones J (cadera, cuello, rodillas, pies, codos, muñecas).
      Las da la IK (bodyRig) o la física (ragdoll): el vestido es el mismo.
   2) dressBody convierte J en piezas: capa (tela), piernas, túnica, cabeza 2.5D, brazos y manos.
   Unidades de figura: alto ≈ 100, suelo en y = 0, mirando a +x (flip la refleja).
   ===================================================================== */
function figX(o) { const sg = o.flip ? -1 : 1; return p => [o.x0 + sg * p[0] * o.k, o.y0 + p[1] * o.k]; }
function bodyRig(o) {
  const t = o.t, T = o.target;
  const F1 = [-7, 0], F2 = [9, 0];
  const Hp = [1.2 * Math.sin(t * .7), -o.hy];
  const lean = .06 + .14 * clamp((T[0] - 12) / 40, -1, 1) + o.crouchK * .25;
  const u = [Math.sin(lean), -Math.cos(lean)], r = [Math.cos(lean), Math.sin(lean)];
  const tp = (a, b) => [Hp[0] + r[0] * a + u[0] * b, Hp[1] + r[1] * a + u[1] * b];
  const L1 = ik2(Hp, F1, 24, 25, -1), L2 = ik2(Hp, F2, 24, 25, -1);
  const Sn = tp(1.5, 27.5), Sf = tp(-1.2, 28);
  const A = ik2(Sn, T, 14.5, 13.5, 1);
  const Tf = [Sf[0] + 2.5 + 1.5 * Math.sin(t * 1.1), Sf[1] + 26];
  const B = ik2(Sf, Tf, 14.5, 13.5, 1);
  const J = { Hp, lean, K1: L1.E, F1, K2: L2.E, F2, Sn, En: A.E, Wn: A.W, Sf, Ef: B.E, Wf: B.W, t };
  const eyeY = tp(0, 38)[1];
  const D = dressBody(J, { ...o, pitch: clamp(-(T[1] - eyeY) / 70, -.35, .45), nearPose: o.wand ? HPOSE.varita : mixHP(HPOSE.relajada, HPOSE.alcanzar, sm((A.reach - .55) / .35)) });
  D.bones = [[Hp, L1.E, F1], [Hp, L2.E, F2], [Sn, A.E, A.W], [Sf, B.E, B.W], [Hp, tp(0, 30)]].map(c => c.map(D.X));
  D.target = D.X(T);
  return D;
}
function dressBody(J, o) {
  const k = o.k, X = figX(o), cw = CAST[o.who], fem = cw.sex === 'f', fl = !!o.flip, t = J.t;
  const { Hp, lean } = J;
  const u = [Math.sin(lean), -Math.cos(lean)], r = [Math.cos(lean), Math.sin(lean)];
  const tp = (a, b) => [Hp[0] + r[0] * a + u[0] * b, Hp[1] + r[1] * a + u[1] * b];
  const parts = [];
  /* capa: la misma tela que el pelo (anclas en pantalla, así sirve con flip) */
  const anc = [tp(2.5, 29.6), tp(-.6, 30.2), tp(-3.6, 30.2), tp(-6.6, 29.6)].map(X);
  const sgn = fl ? -1 : 1;
  const CP = clothStep(o.key + ':capa', anc, 7, [60, 63, 66, 69].map(v => v * k * (o.capeLen || 1)), { stiff: o.capeStiff ?? .14, grav: .02 * k, damp: .92, fl: .35, bias: sgn * (-.16 - lean * .4), hs: 1, spread: 1.4, floor: o.y0 }, o.ticks);
  parts.push({ k: 'cloth', polys: [clothPoly(CP, 'recto', 0)], trimLine: CP.map(row => row[row.length - 1]) });
  const arm = (S, E, Wr) => {
    const d = nrm2(sub(X(Wr), X(E))), pp = perp(d), q = fl ? -1 : 1;
    const sleeve = [add(X(E), pp, 3.4 * k * q), add(X(Wr), pp, 4.6 * k * q), add(add(X(Wr), d, 1.5 * k), pp, -5.8 * k * q), add(X(E), pp, -3.4 * k * q)];
    return { k: 'cloth', polys: [capsulePts(X(S), X(E), 4 * k, 3.4 * k, 4), sleeve] };
  };
  const hand = (E, Wr, pose, wand, wandTo) => { const a = X(E), b = X(Wr); return handRig({ x: b[0], y: b[1], s: 8.5 * k, ang: Math.atan2(b[1] - a[1], b[0] - a[0]), pose, flip: fl, wand, wandTo, noWrist: true }); };
  const hf = hand(J.Ef, J.Wf, o.farPose || HPOSE.relajada, false);
  parts.push(arm(J.Sf, J.Ef, J.Wf), { k: 'skin', polys: hf.all, hand: hf });
  /* piernas y zapatos (el pie gira con la espinilla: sirve tumbado) */
  for (const [K, F] of [[J.K1, J.F1], [J.K2, J.F2]]) {
    const d = nrm2(sub(F, K)), fw = [d[1], -d[0]];
    const shoe = [add(add(F, fw, -2.4), d, -2.8), add(add(F, fw, 6.4), d, -1.6), add(add(F, fw, 6.8), d, .6), add(add(F, fw, -2.6), d, .8)];
    parts.push({ k: 'ink', polys: [capsulePts(X(Hp), X(K), 3.8 * k, 3.2 * k, 4), capsulePts(X(K), X(F), 3.2 * k, 2.5 * k, 4), shoe.map(X)] });
  }
  /* túnica: torso + faldón en el marco del torso, siguiendo a las rodillas */
  const fwd = (K) => K[0] * r[0] + K[1] * r[1];
  const kf = fwd(J.K1) > fwd(J.K2) ? [J.K1, J.F1] : [J.K2, J.F2], kb = kf[0] === J.K1 ? [J.K2, J.F2] : [J.K1, J.F1];
  const sw = Math.sin(t * 1.6) * .8, hf_ = [lerp(kf[0][0], kf[1][0], .42), lerp(kf[0][1], kf[1][1], .42)], hb_ = [lerp(kb[0][0], kb[1][0], .42), lerp(kb[0][1], kb[1][1], .42)];
  const skirt = [tp(-7.6, 3), tp(6.8, 3), add(kf[0], r, 4.5), add(hf_, r, 6 + sw), [(hf_[0] + hb_[0]) / 2, (hf_[1] + hb_[1]) / 2], add(hb_, r, -8 - sw), add(kb[0], r, -4.5)];
  const torso = fem ? [tp(-6.6, 0), tp(-7.4, 9), tp(-6.2, 22), tp(-5, 29.5), tp(4.5, 29.5), tp(6.4, 24), tp(5.6, 12), tp(5.8, 0)]
    : [tp(-7, 0), tp(-8.2, 10), tp(-7.8, 24), tp(-5, 29.5), tp(4.5, 29.5), tp(7, 25), tp(6.8, 12), tp(6.2, 0)];
  const n0 = tp(.5, 31.5), neckTop = J.Head ? [lerp(n0[0], J.Head[0], .7), lerp(n0[1], J.Head[1], .7)] : n0;
  parts.push({ k: 'cloth', polys: [skirt.map(X), torso.map(X), capsulePts(X(tp(0, 28)), X(neckTop), 2.6 * k, 2.4 * k, 3)] });
  /* cabeza */
  const piv = X(J.Head ? J.Head : tp(1.7, 33.6));
  const head = headRig({ x: piv[0], y: piv[1], s: 6.4 * k * (o.headK || 1), yaw: (1.0 + (o.yawAdd || 0)) * sgn, pitch: o.pitch || 0, roll: (J.headRoll ?? lean * .4) * sgn, bYaw: .9 * sgn, who: o.who, ex: o.ex || EXPR.neutral, key: o.key + ':h', ticks: o.ticks });
  /* brazo cercano y mano */
  const hn = hand(J.En, J.Wn, o.nearPose || HPOSE.relajada, !!o.wand, o.wandTo);
  const near = [arm(J.Sn, J.En, J.Wn), { k: 'skin', polys: hn.all, hand: hn }];
  return { parts, head, near, X, wandTip: hn.wandTip };
}

/* =====================================================================
   RAGDOLL ACTIVO: las articulaciones son partículas Verlet unidas por huesos.
   «Músculo» = resorte hacia la pose animada. Golpe → músculo a 0 → cae, choca, se levanta.
   ===================================================================== */
const RJ = ['Hp', 'N', 'Head', 'K1', 'F1', 'K2', 'F2', 'En', 'Wn', 'Ef', 'Wf'];
const RBONES = [['Hp', 'N', 30], ['N', 'Head', 4.8], ['Hp', 'Head', 33.6], ['Hp', 'K1', 24], ['K1', 'F1', 25], ['Hp', 'K2', 24], ['K2', 'F2', 25],
  ['N', 'En', 14.5], ['En', 'Wn', 13.5], ['N', 'Ef', 14.5], ['Ef', 'Wf', 13.5], ['K1', 'K2', 4, 'min'], ['Hp', 'F1', 18, 'min'], ['Hp', 'F2', 18, 'min']];
function standPose(x, t, hy = 47.5, lean = .04) {   // de pie (hy 47.5) o agachado (hy ~30, inclinado)
  const Hp = [x, -hy], u = [Math.sin(lean), -Math.cos(lean)], r = [Math.cos(lean), Math.sin(lean)];
  const tp = (a, b) => [Hp[0] + r[0] * a + u[0] * b, Hp[1] + r[1] * a + u[1] * b];
  const L1 = ik2(Hp, [x - 7, 0], 24, 25, -1), L2 = ik2(Hp, [x + 9, 0], 24, 25, -1), N = tp(.5, 29);
  const A = ik2(N, [N[0] + 9, N[1] + 22 + Math.sin(t * 1.3)], 14.5, 13.5, 1), B = ik2(N, [N[0] + 2, N[1] + 26], 14.5, 13.5, 1);
  return { Hp, N, Head: tp(1.7, 33.6), K1: L1.E, F1: [x - 7, 0], K2: L2.E, F2: [x + 9, 0], En: A.E, Wn: A.W, Ef: B.E, Wf: B.W };
}
function ragdollNew(x) { const P = standPose(x, 0), st = { p: {}, q: {}, muscle: 1, hitT: -99, impacts: [], home: x }; for (const j of RJ) { st.p[j] = P[j].slice(); st.q[j] = P[j].slice(); } return st; }
function ragdollStep(st, t, ticks, env) {
  for (let n = 0; n < ticks; n++) {
    const since = t - st.hitT;
    const was = st.muscle;
    st.muscle = since < 2.0 ? 0 : clamp((since - 2.0) / 5.0);   // 2 s en el suelo + 5 s para levantarse
    if (was === 0 && st.muscle > 0) st.home = Math.max(env.wall + 16, st.p.Hp[0]);   // se levanta donde cayó
    const st_ = standPose(st.home, t), cr = standPose(st.home, t, 31, .55), w = sm((st.muscle - .45) / .4), target = {}, damp = .985 - .06 * st.muscle;
    for (const j of RJ) target[j] = [lerp(cr[j][0], st_[j][0], w), lerp(cr[j][1], st_[j][1], w)];   // primero agachado, luego de pie
    for (const j of RJ) {   // integrar
      const p = st.p[j], q = st.q[j], vx = (p[0] - q[0]) * damp, vy = (p[1] - q[1]) * damp;
      q[0] = p[0]; q[1] = p[1]; p[0] += vx; p[1] += vy + .07 * (1 - st.muscle * .9);
      // músculo: mezcla cinemática hacia la pose (mueve p y q a la vez: no mete velocidad, no rebota)
      const m = st.muscle * st.muscle * (j === 'F1' || j === 'F2' ? .3 : .1);
      if (m > 0) { const dx = (target[j][0] - p[0]) * m, dy = (target[j][1] - p[1]) * m; p[0] += dx; p[1] += dy; q[0] += dx; q[1] += dy; }
    }
    for (let it = 0; it < 4; it++) {
      for (const [a, b, L, kind] of RBONES) {
        const A = st.p[a], B = st.p[b], d = sub(B, A), l = len(d) || 1e-6;
        if (kind === 'min' && l >= L) continue;
        const e = (l - L) / l * .5; A[0] += d[0] * e; A[1] += d[1] * e; B[0] -= d[0] * e; B[1] -= d[1] * e;
      }
      for (const [H, K, F] of [['Hp', 'K1', 'F1'], ['Hp', 'K2', 'F2']]) {   // la rodilla no se dobla al revés
        const h = st.p[H], kk = st.p[K], f = st.p[F], d = sub(f, h), c = d[0] * (kk[1] - h[1]) - d[1] * (kk[0] - h[0]);
        if (c > 0) { const l2 = d[0] * d[0] + d[1] * d[1] || 1, tt = ((kk[0] - h[0]) * d[0] + (kk[1] - h[1]) * d[1]) / l2, m = add(h, d, tt); kk[0] = lerp(kk[0], 2 * m[0] - kk[0], .5); kk[1] = lerp(kk[1], 2 * m[1] - kk[1], .5); }
      }
      for (const j of RJ) {   // suelo y pared
        const p = st.p[j], q = st.q[j], rad = j === 'Head' ? 7 : j === 'N' || j === 'Hp' ? 6 : 3;
        if (p[1] > -rad * .4) { p[1] = -rad * .4; q[0] = lerp(q[0], p[0], .25); }
        if (p[0] < env.wall + rad) {
          const v = q[0] - p[0];
          if (v > .9 && st.impacts.length < 6 && t - (st.lastImp || -9) > .25) { st.impacts.push({ x: env.wall, y: p[1], t, v }); st.lastImp = t; env.onImpact && env.onImpact(v); }
          p[0] = env.wall + rad; q[0] = p[0] + v * .12; q[1] = lerp(q[1], p[1], .3);
        }
      }
    }
  }
  st.impacts = st.impacts.filter(i => t - i.t < 3);
  const P = st.p, dn = sub(P.N, P.Hp), lean = Math.atan2(dn[0], -dn[1]);
  const r = [Math.cos(lean), Math.sin(lean)], u = [Math.sin(lean), -Math.cos(lean)];
  const S = add(add(P.Hp, u, 27.5), r, 1.5), Sf = add(add(P.Hp, u, 28), r, -1.2);
  const dh = sub(P.Head, P.N), headRoll = Math.atan2(dh[0], -dh[1]);
  return { Hp: P.Hp, lean, K1: P.K1, F1: P.F1, K2: P.K2, F2: P.F2, Sn: S, En: P.En, Wn: P.Wn, Sf, Ef: P.Ef, Wf: P.Wf, Head: P.Head, headRoll, t };
}
function ragdollHit(st, t, dir, power) {
  st.hitT = t;
  const kick = { Head: 1.25, N: 1.15, En: 1, Ef: 1, Wn: .9, Wf: .9, Hp: .65, K1: .3, K2: .3, F1: .08, F2: .08 };
  for (const j of RJ) { const v = power * kick[j]; st.q[j][0] = st.p[j][0] - dir * v; st.q[j][1] = st.p[j][1] + v * .35; }
}
