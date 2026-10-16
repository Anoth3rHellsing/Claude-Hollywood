/* =====================================================================
   RIG DE CABEZA 2.5D
   Volúmenes en 3D (unidades de cabeza: cráneo ≈ radio 1, y hacia abajo, z hacia el espectador):
   cráneo elipsoide + mandíbula (envolvente) + «quilla» (perfil: frente, nariz, labios, mentón) + orejas.
   Se proyectan y se unen: la silueta sale sola en frente, ¾ y perfil. Nada de cabeza-círculo.
   ===================================================================== */
const SK = { c: [0, -0.1, -0.1], r: [0.8, 1, 0.95] };
const HP = [0, 0.62, -0.22];                      // pivote (base del cráneo, sobre el cuello)
const JAW = [[0.62, 0.12, 0.38], [0.56, 0.52, 0.02], [0.33, 0.8, 0.48], [0.16, 0.97, 0.64], [0.6, -0.12, 0.15], [0.48, 0.46, -0.38], [0.3, 0.62, -0.3]];
const JAWALL = JAW.concat(JAW.map(p => [-p[0], p[1], p[2]]), [[0, 1.0, 0.68]]);
const KEEL = [[0, -0.8, 0.62], [0, -0.52, 0.83], [0, -0.25, 0.9], [0, -0.12, 0.85], [0, 0.02, 0.92], [0, 0.24, 1.08], [0, 0.31, 1.08], [0, 0.36, 0.98], [0, 0.4, 0.93], [0, 0.47, 0.97], [0, 0.54, 0.94], [0, 0.585, 0.95], [0, 0.66, 0.91], [0, 0.74, 0.86], [0, 0.85, 0.91], [0, 0.95, 0.84], [0, 1.0, 0.64], [0, 0.96, 0.4], [0, 0.5, 0.25], [0, -0.6, 0.2]];
const NOSE = [[0.07, 0.0, 0.87], [-0.07, 0.0, 0.87], [0, 0.27, 1.09], [0.13, 0.33, 0.92], [-0.13, 0.33, 0.92], [0, 0.385, 0.96], [0.05, 0.12, 0.96], [-0.05, 0.12, 0.96]];
const earPts = sg => { const o = []; for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; o.push([sg * (0.79 + 0.09 * (0.5 - 0.5 * Math.cos(a))), 0.05 + 0.23 * Math.sin(a), -0.12 + 0.12 * Math.cos(a)]); } return o; };
const EARS = [earPts(-1), earPts(1)];
/* superficie de la cara para colocar rasgos: perfil sin nariz menos curvatura lateral */
const FZY = [[-0.6, 0.8], [-0.3, 0.87], [-0.05, 0.83], [0.2, 0.86], [0.45, 0.91], [0.58, 0.93], [0.8, 0.86], [1.0, 0.75]];
function faceZ(x, y) { let z = FZY[0][1]; for (let i = 0; i < FZY.length - 1; i++) { const a = FZY[i], b = FZY[i + 1]; if (y >= a[0] && y <= b[0]) z = lerp(a[1], b[1], (y - a[0]) / (b[0] - a[0])); } if (y > 1) z = .75; return z - 1.05 * x * x; }

const HOUSES = { G: { c: '204,42,46', g: '240,182,72' }, R: { c: '60,104,210', g: '206,156,98' }, S: { c: '40,160,92', g: '214,224,224' } };
const CAST = {
  anami: { name: 'Anami', sex: 'm', hair: 'corto', house: 'G' },
  joy: { name: 'Joy', sex: 'f', hair: 'salvaje', house: 'G' },
  draco: { name: 'Draconida', sex: 'f', hair: 'raya', house: 'S', tilt: .2, hoops: true, hairCol: '226,200,140' },   // raya al lado, un lado tras la oreja, aros, cabeza ladeada
  damien: { name: 'Damien', sex: 'm', hair: 'peinado', house: 'R' },
};
/* pelo: casquete (malla sobre un elipsoide algo mayor, cortada en la línea del pelo) + mechones con resorte */
/* pelo = casquete (malla) + «mantas»: telas colgadas de la línea del pelo, cortadas para cada peinado.
   capa: back = detrás de cuerpo y cabeza · mid = delante del busto, detrás de la cara · front = encima de todo · auto = según hacia dónde mire */
const BACKU = [1.35, 1.75, 2.15, 2.55, 2.95, -2.95, -2.55, -2.15, -1.75, -1.35];
const HAIR = {
  /* chicos: volumen de casco, pocos gajos grandes (principio de forma tipo avatar, diseño propio) */
  corto: { k: 1.24, vol: 4, front: 1.05, side: 1.68, back: 2.0, zig: .06, zf: 9, sheets: [
    { us: [-.95, -.5, -.05, .4, .85], da: -.1, len: .3, shape: c => 1 + .25 * c, R: 2, cut: 'punta', tip: .3, stiff: .6, grav: .003, fl: .25, bf: .35, layer: 'front' },
    { bar: { c: [0, -0.95, -0.4], hw: .7, n: 6 }, len: .26, R: 2, cut: 'punta', tip: .38, stiff: .75, grav: .002, fl: 1.6, dy: -.7, layer: 'back' },
    { us: [1.2, 1.45, 1.7], da: -.15, len: .42, R: 2, cut: 'punta', tip: .22, stiff: .6, grav: .003, fl: .3, layer: 'auto' },
    { us: [-1.2, -1.45, -1.7], da: -.15, len: .42, R: 2, cut: 'punta', tip: .22, stiff: .6, grav: .003, fl: .3, layer: 'auto' },
    { bar: { c: [0, 0.15, -0.72], hw: .66, n: 5 }, len: .28, R: 2, cut: 'punta', tip: .2, stiff: .6, grav: .003, fl: .5, layer: 'back' }] },
  salvaje: { k: 1.17, front: 1.0, side: 1.8, back: 2.1, zig: .05, zf: 7, sheets: [
    { bar: { c: [0, -0.38, -0.5], hw: .88, n: 9 }, len: 1.8, shape: c => 1 - .15 * c * c, R: 6, cut: 'punta', tip: .34, stiff: .12, grav: .014, fl: .85, hs: 1, spread: .7, layer: 'back' },
    { us: [.72, .95, 1.18], da: -.06, len: 1.4, shape: c => 1 + .12 * c, R: 5, cut: 'punta', tip: .32, stiff: .13, grav: .012, fl: .8, hs: .9, spread: .9, layer: 'auto' },
    { us: [-.72, -.95, -1.18], da: -.06, len: 1.4, shape: c => 1 + .12 * c, R: 5, cut: 'punta', tip: .32, stiff: .13, grav: .012, fl: .8, hs: .9, spread: .9, layer: 'auto' }] },
  lacio: { k: 1.06, front: 1.06, side: 1.85, back: 2.2, zig: 0, zf: 1, sheets: [
    { bar: { c: [0, -0.2, -0.55], hw: .82, n: 8 }, len: 2.15, R: 6, cut: 'recto', tip: 0, stiff: .3, grav: .012, fl: .25, hs: .7, layer: 'back' },
    { us: [.62, .88, 1.14], da: -.05, len: 1.95, R: 6, cut: 'recto', tip: 0, stiff: .3, grav: .012, fl: .1, hs: .85, layer: 'auto' },
    { us: [-.62, -.88, -1.14], da: -.05, len: 1.95, R: 6, cut: 'recto', tip: 0, stiff: .3, grav: .012, fl: .1, hs: .85, layer: 'auto' }] },
  /* Draconida: raya al lado; el lado +u va recogido tras la oreja (la deja ver), el otro cae por delante del hombro */
  raya: { k: 1.06, front: 1.02, side: 1.85, sideTuck: 1.38, back: 2.2, zig: 0, zf: 1, sheets: [
    { bar: { c: [0, -0.25, -0.55], hw: .84, n: 8 }, len: 2.3, R: 6, cut: 'recto', tip: 0, stiff: .3, grav: .012, fl: .22, hs: .72, layer: 'back' },
    { us: [-.72, -.98, -1.25], da: -.04, len: 2.05, shape: c => 1 - .06 * c, R: 6, cut: 'recto', tip: 0, stiff: .28, grav: .012, fl: .3, hs: .9, bf: -.55, layer: 'auto' },
    { us: [-.12, -.42, -.72], da: -.02, len: .3, shape: c => .75 + .25 * (c + 1) / 2, R: 2, cut: 'recto', tip: 0, stiff: .7, grav: .003, fl: .2, bias: -.7, layer: 'front' }] },
  peinado: { k: 1.12, vol: 4, front: .92, side: 1.6, back: 1.95, zig: .09, zf: 5, sheets: [
    { us: [-.75, -.38, 0, .38, .75], da: .02, len: .9, shape: c => 1 - .3 * c * c, R: 3, cut: 'punta', tip: .14, stiff: .8, grav: .002, fl: .25, bf: -1.2, dy: -1.5, layer: 'front' },
    { bar: { c: [0, 0.12, -0.72], hw: .6, n: 5 }, len: .2, R: 2, cut: 'punta', tip: .2, stiff: .65, grav: .003, fl: .5, bf: -.4, layer: 'back' },
    { us: [1.25, 1.55], da: -.12, len: .26, R: 2, cut: 'punta', tip: .16, stiff: .6, grav: .003, fl: .2, layer: 'auto' },
    { us: [-1.25, -1.55], da: -.12, len: .26, R: 2, cut: 'punta', tip: .16, stiff: .6, grav: .003, fl: .2, layer: 'auto' }] },
};
function hairline(hs, u) {
  const au = Math.abs(u);
  const side = hs.sideTuck && u > 0 ? hs.sideTuck : hs.side;
  const base = au < PI / 2 ? lerp(hs.front, side, sm(au / (PI / 2))) : lerp(side, hs.back, sm((au - PI / 2) / (PI / 2)));
  return base + hs.zig * Math.sin(u * hs.zf) * (au < PI / 2 ? 1 : .5);
}
/* expresiones: cejas (dentro/fuera, + = baja), apertura de ojos, sonrisa, boca abierta, cabeceo e inclinación */
const EXPR = {
  neutral: { bi: 0, bo: 0, op: .8, sm: 0, mo: 0, pi: 0, ro: 0 },
  decidida: { bi: .95, bo: -.15, op: .6, sm: -.15, mo: 0, pi: -.07, ro: 0 },
  dolor: { bi: -.95, bo: .35, op: .35, sm: -.5, mo: .3, pi: -.1, ro: .09 },
  miedo: { bi: -.8, bo: -.7, op: 1.1, sm: -.3, mo: .6, pi: .06, ro: -.03 },
  ternura: { bi: -.3, bo: .15, op: .4, sm: .6, mo: 0, pi: -.08, ro: .13 },
};
const EXN = { neutral: 'Neutral', decidida: 'Decidida', dolor: 'Dolor', miedo: 'Miedo', ternura: 'Ternura' };

/* o: {x,y (pivote en pantalla), s (u por unidad de cabeza), yaw, pitch, roll, bYaw, who, ex, key, ticks, feats} */
function headRig(o) {
  const cw = CAST[o.who], hs = HAIR[cw.hair], fem = cw.sex === 'f', ex = o.ex;
  const yaw = o.yaw, pitch = o.pitch + (ex.pi || 0), roll = o.roll + (ex.ro || 0) + (cw.tilt || 0), s = o.s;   // tilt: gesto propio del personaje
  const cr = Math.cos(roll), sr = Math.sin(roll);
  const scr = q => { const x = q[0] * s, y = q[1] * s; return [o.x + x * cr - y * sr, o.y + x * sr + y * cr]; };
  const jx = fem ? .9 : 1;
  const Hd = p => { const q = rot3([p[0] - HP[0], p[1] - HP[1], p[2] - HP[2]], yaw, pitch); const v = scr(q); v.push(q[2]); return v; };
  const Nr = n => { const q = rot3(n, yaw, pitch); return [q[0] * cr - q[1] * sr, q[0] * sr + q[1] * cr, q[2]]; };
  const Bs = p => { const q = rot3([p[0] - HP[0], p[1] - HP[1], p[2] - HP[2]], o.bYaw, 0); return [o.x + q[0] * s, o.y + q[1] * s, q[2]]; };
  const rel = c => [c[0] - HP[0], c[1] - HP[1], c[2] - HP[2]];
  /* --- volúmenes --- */
  const skull = ellSil(rel(SK.c), SK.r, yaw, pitch, 44).map(scr);
  const jaw = hull(JAWALL.map(p => Hd([p[0] * jx, p[1], p[2]])));
  const keel = KEEL.map(p => Hd(fem && p[1] > .2 && p[1] < .4 ? [p[0], p[1], p[2] - .04] : p));
  const ears = EARS.map(e => e.map(Hd));
  const nose = hull(NOSE.map(Hd));
  const headU = [skull, jaw, keel, ...ears];
  /* cuello y busto (giran menos que la cabeza) */
  const nTop = ellSil(rel([0, 0.45, -0.22]), [0.3, 0.01, 0.3], o.bYaw, 0, 20).map(q => [o.x + q[0] * s, o.y + q[1] * s]);
  const nBot = ellSil(rel([0, 1.8, -0.12]), [0.4, 0.01, 0.36], o.bYaw, 0, 20).map(q => [o.x + q[0] * s, o.y + q[1] * s]);
  const neck = hull(nTop.concat(nBot));
  const BU = [[-0.4, 1.08, 0.04], [-1.0, 1.3, -0.12], [-1.55, 1.58, -0.2], [-1.82, 2.08, -0.2], [-1.95, 3.8, -0.2], [1.95, 3.8, -0.2], [1.82, 2.08, -0.2], [1.55, 1.58, -0.2], [1.0, 1.3, -0.12], [0.4, 1.08, 0.04], [0, 1.72, 0.42]].map(Bs);
  const trim = [[[-0.4, 1.08, 0.04], [0, 1.72, 0.42], [0.4, 1.08, 0.04]].map(Bs)];
  /* uniforme: camisa, cuello y corbata a rayas dentro de la V */
  const shirt = [[[-0.36, 1.12, 0.06], [0.36, 1.12, 0.06], [0, 1.72, 0.42]].map(Bs)];
  const collar = [[[-0.42, 1.05, 0.05], [-0.02, 1.3, 0.44], [-0.3, 1.46, 0.3]].map(Bs), [[0.42, 1.05, 0.05], [0.02, 1.3, 0.44], [0.3, 1.46, 0.3]].map(Bs)];
  const tie = [[[-0.07, 1.27, 0.45], [0.07, 1.27, 0.45], [0.06, 1.37, 0.45], [0.11, 1.74, 0.43], [0, 1.84, 0.43], [-0.11, 1.74, 0.43], [-0.06, 1.37, 0.45]].map(Bs)];
  const tieStripes = [0, 1, 2, 3].map(i => { const y = 1.42 + i * .09; return [[-0.1, y + .05, 0.45], [0.1, y - .03, 0.45]].map(Bs); });
  /* --- casquete de pelo: malla culled por normales --- */
  const NU = 28, NV = 7, G = [];
  for (let i = 0; i <= NU; i++) {
    const u = -PI + i / NU * TAU, hl = hairline(hs, u), col = [];
    for (let j = 0; j <= NV; j++) {
      const a = j / NV * hl, d = [Math.sin(a) * Math.sin(u), -Math.cos(a), Math.sin(a) * Math.cos(u)], kk = lerp(hs.k, 1.012, Math.pow(j / NV, hs.vol || 2.2));
      const p = [SK.c[0] + SK.r[0] * d[0] * kk, SK.c[1] + SK.r[1] * d[1] * kk, SK.c[2] + SK.r[2] * d[2] * kk];
      col.push({ v: Hd(p), nz: Nr(n3([d[0] / SK.r[0], d[1] / SK.r[1], d[2] / SK.r[2]]))[2] });
    }
    G.push(col);
  }
  const cap = [];
  for (let i = 0; i < NU; i++) for (let j = 0; j < NV; j++) {
    const a = G[i][j], b = G[i + 1][j], c = G[i + 1][j + 1], d = G[i][j + 1];
    if ((a.nz + b.nz + c.nz + d.nz) / 4 > -0.12) cap.push([a.v, b.v, c.v, d.v]);
  }
  /* --- mantas de pelo (tela con resorte) --- */
  const back = [], mid = [], front = [], face2 = Nr([0, 0, 1]);
  hs.sheets.forEach((sh, idx) => {
    const C = sh.bar ? sh.bar.n : sh.us.length, anchors = [], lens = []; let nzs = 0;
    if (sh.bar) {   // manta trasera: barra fija en pantalla detrás de la cabeza (nunca se pliega al girar)
      const ce = Hd(sh.bar.c), bw = sh.bar.hw * lerp(.4, 1, Math.abs(Math.cos(yaw)));
      for (let c = 0; c < C; c++) { const cn = c / (C - 1) * 2 - 1; anchors.push([ce[0] + cr * cn * bw * s, ce[1] + sr * cn * bw * s]); lens.push(sh.len * s * (sh.shape ? sh.shape(cn) : 1)); }
      nzs = -C;
    } else sh.us.forEach((u, c) => {
      const a = sh.a ?? (hairline(hs, u) + (sh.da || 0)), d = [Math.sin(a) * Math.sin(u), -Math.cos(a), Math.sin(a) * Math.cos(u)];
      const p = [SK.c[0] + SK.r[0] * d[0] * 1.03, SK.c[1] + SK.r[1] * d[1] * 1.03, SK.c[2] + SK.r[2] * d[2] * 1.03];
      const v = Hd(p); anchors.push([v[0], v[1]]); nzs += Nr(n3([d[0] / SK.r[0], d[1] / SK.r[1], d[2] / SK.r[2]]))[2];
      const cn = C > 1 ? c / (C - 1) * 2 - 1 : 0; lens.push(sh.len * s * (sh.shape ? sh.shape(cn) : 1));
    });
    const P = clothStep(o.key + ':m' + idx, anchors, sh.R, lens, { stiff: sh.stiff, grav: sh.grav * s, damp: .9, fl: sh.fl, hs: sh.hs ?? 1, spread: sh.spread || 0, dy: sh.dy ?? 1, bias: (sh.bias || 0) + (sh.bf || 0) * face2[0], hwMin: s * (sh.bar ? sh.bar.hw : .35) }, o.ticks);
    const poly = clothPoly(P, sh.cut, sh.tip * s), nz = nzs / C;
    (sh.layer === 'back' ? back : sh.layer === 'front' ? front : nz > .85 ? front : mid).push(poly);
  });
  /* --- rasgos (proyectados en la superficie de la cara) --- */
  const F = { eyes: [], brows: [], mouth: [], sockets: [], earLine: null };
  const fp = (x, y) => Hd([x, y, faceZ(x, y)]);
  const vis = x => sm((Nr(n3([2.1 * x, 0, 1]))[2] - 0.08) / 0.3);
  for (const sg of [-1, 1]) {
    const ex0 = sg * 0.3, ey = -0.04, op = ex.op, av = vis(ex0);
    const up = [], lo = [];
    for (let k = 0; k <= 6; k++) { const t = k / 3 - 1, x = ex0 + t * 0.13 * sg; up.push(fp(x, ey - (op * 0.075 - 0.018) * (1 - t * t) - (t * sg > 0 ? .01 : 0))); lo.push(fp(x, ey + op * 0.036 * (1 - t * t) + .006)); }
    const iris = op > .25 ? { c: fp(ex0 + (o.gaze || 0) * .05, ey - .004), r: 0.043 * s * Math.max(.35, Nr(n3([2.1 * ex0, 0, 1]))[2]) } : null;
    F.eyes.push({ up, lo, iris, a: av, op });
    const bi = ex.bi, bo = ex.bo;
    const br = [fp(sg * 0.13, -0.19 + bi * 0.065), fp(sg * 0.29, -0.235 + (bi + bo) * 0.022), fp(sg * 0.45, -0.19 + bo * 0.05)];
    F.brows.push({ pts: br, a: av });
    const so = [fp(sg * 0.11, -0.17 + bi * 0.06), fp(sg * 0.29, -0.215 + (bi + bo) * 0.02), fp(sg * 0.47, -0.17 + bo * 0.045), fp(sg * 0.46, -0.01), fp(sg * 0.3, 0.06), fp(sg * 0.14, 0.01)];
    F.sockets.push({ pts: so, a: av });
  }
  for (const sg of [-1, 1]) {
    const up = [], lo = [];
    for (let k = 0; k <= 4; k++) { const x = sg * k / 4 * 0.19, f = (x / 0.19) ** 2; up.push(fp(x, 0.575 - ex.sm * 0.045 * f)); lo.push(fp(x, 0.575 - ex.sm * 0.045 * f + ex.mo * 0.065 * (1 - f))); }
    F.mouth.push({ up, lo, a: vis(sg * 0.12), open: ex.mo });
  }
  const nearEar = Nr([-1, 0, 0])[2] > 0 ? 0 : 1, eA = sm((Math.abs(Nr([nearEar ? 1 : -1, 0, 0])[2]) - .25) / .4);
  if (eA > .01) { const e = EARS[nearEar].map(Hd), m = e.length; F.earLine = { pts: [e[1], e[3], e[5], e[7], e[8]], a: eA }; }
  /* aros: anillos en un plano casi lateral, colgando del lóbulo (de frente se ven de canto, de perfil redondos) */
  const hoops = [];
  if (cw.hoops) for (const sg of [-1, 1]) {
    const c = [sg * 0.84, 0.47, -0.1], pts = [];
    for (let i = 0; i <= 24; i++) { const th = i / 24 * TAU; pts.push(Hd([c[0] + sg * Math.sin(th) * .17 * .45, c[1] + Math.cos(th) * .17, c[2] + Math.sin(th) * .17 * .9])); }
    hoops.push({ pts, tucked: sg > 0 && !!hs.sideTuck, a: clamp(Nr([sg, 0, 0])[2] + .9) });
  }
  return { skull, jaw, keel, ears, nose, headU, neck, bust: [BU], trim, shirt, collar, tie, tieStripes, hoops, cap, back, mid, front, F, s, pivot: [o.x, o.y], face2, house: cw.house, who: o.who,
    vol: { skull, jaw, keel, nose } };
}
