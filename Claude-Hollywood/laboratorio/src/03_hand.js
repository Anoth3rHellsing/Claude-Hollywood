/* =====================================================================
   RIG DE MANO: palma + 5 dedos de 3 falanges, vista lateral (pulgar hacia el espectador).
   Unidades de mano: muñeca en (0,0), dedos hacia +x, palma hacia +y. Largo muñeca→punta ≈ 1.
   Ángulos positivos doblan hacia la palma.
   ===================================================================== */
const FING = [ // base, largos de falanges, grosor, abanico
  { b: [0.40, 0.11], L: [0.16, 0.10, 0.08], w: .062, sp: .5 },   // meñique
  { b: [0.44, 0.045], L: [0.22, 0.135, 0.095], w: .07, sp: .2 }, // anular
  { b: [0.46, -0.025], L: [0.245, 0.15, 0.1], w: .074, sp: -.08 }, // medio
  { b: [0.44, -0.09], L: [0.215, 0.13, 0.095], w: .07, sp: -.36 }, // índice
];
const THUMB = { b: [0.1, 0.03], L: [0.2, 0.15, 0.115], w: .085, a0: .15 };
/* curl: [pulgar, índice, medio, anular, meñique]; claw: garra (base recta, puntas dobladas) */
const HPOSE = {
  abierta: { c: [-.1, -.05, -.05, -.05, -.05], sp: 1, claw: 0, th: -.6 },
  relajada: { c: [.2, .22, .3, .36, .44], sp: .35, claw: .1, th: -.2 },
  puño: { c: [.6, 1, 1, 1, 1], sp: 0, claw: 0, th: .05 },
  señalar: { c: [.6, -.05, 1, 1, 1], sp: .1, claw: 0, th: .1 },
  varita: { c: [.22, .16, .8, .88, .93], sp: 0, claw: .1, th: -.08 },
  garra: { c: [.5, .55, .6, .66, .72], sp: .8, claw: 1, th: -.4 },
  alcanzar: { c: [.05, .08, .14, .2, .27], sp: .75, claw: 0, th: -.45 },
};
const HPN = { abierta: 'Abierta', relajada: 'Relajada', puño: 'Puño', señalar: 'Señalar', varita: 'Varita', garra: 'Garra', alcanzar: 'Alcanzar' };
function mixHP(a, b, t) { return { c: a.c.map((v, i) => lerp(v, b.c[i], t)), sp: lerp(a.sp, b.sp, t), claw: lerp(a.claw, b.claw, t), th: lerp(a.th, b.th, t) }; }

/* o: {x,y, s, ang, flip, pose, wand} → piezas ordenadas de atrás adelante */
function handRig(o) {
  const ca = Math.cos(o.ang), sa = Math.sin(o.ang), fy = o.flip ? -1 : 1, s = o.s, ps = o.pose;
  const T = p => { const x = p[0] * s, y = p[1] * s * fy; return [o.x + x * ca - y * sa, o.y + x * sa + y * ca]; };
  const finger = (f, curl, spread, claw) => {
    const j = [curl * (1.45 - claw * .95), curl * (1.5 + claw * .55), curl * (1.0 + claw * .5)];
    let th = f.sp * spread * .9 + curl * .1, p = f.b; const polys = [], pts = [p];
    for (let k = 0; k < 3; k++) { th += j[k]; const q = [p[0] + Math.cos(th) * f.L[k], p[1] + Math.sin(th) * f.L[k]]; polys.push(capsulePts(T(p), T(q), f.w * s * (1 - k * .1), f.w * s * (.9 - k * .12), 4)); pts.push(q); p = q; }
    return { polys, tip: T(p), pts: pts.map(T) };
  };
  const fingers = FING.map((f, i) => finger(f, ps.c[4 - i], ps.sp, ps.claw));
  const tc = ps.c[0], tj = [tc * .15, tc * .45, tc * .6];
  let th = THUMB.a0 + ps.th, p = THUMB.b; const tpolys = [];
  for (let k = 0; k < 3; k++) { th += tj[k]; const q = [p[0] + Math.cos(th) * THUMB.L[k], p[1] + Math.sin(th) * THUMB.L[k]]; tpolys.push(capsulePts(T(p), T(q), THUMB.w * s * (1.15 - k * .15), THUMB.w * s * (.95 - k * .12), 4)); p = q; }
  const thumb = { polys: tpolys, tip: T(p) };
  const palm = [[-.02, -.12], [.14, -.15], [.32, -.13], [.47, -.1], [.5, -.02], [.47, .07], [.42, .15], [.22, .175], [.06, .15], [-.02, .12]].map(T);
  const wrist = capsulePts(T([-.16, 0]), T([0, 0]), .13 * s, .12 * s, 4);   // muñón corto: el resto lo tapa la manga
  const pieces = [
    ...(o.noWrist ? [] : [{ k: 'skin', polys: [wrist], sep: false }]),   // con manga, la muñeca la tapa la tela: sin ella la mano no «flota»
    ...fingers.slice(0, 3).map(f => ({ k: 'skin', polys: f.polys, sep: true })),
    { k: 'skin', polys: [palm], sep: true },
  ];
  if (o.wand) {   // agarre de puntero: el índice va a lo largo, el pulgar al lado, el mango asoma por debajo del meñique
    const L = (x, y) => T([x, y]), dl = nrm2([.6, -.17]), at = (d) => [.5 + dl[0] * d, .03 + dl[1] * d];
    let butt = L(-.14, .2), hEnd = L(...at(.3)), tip = L(...at(2.0));
    if (o.wandTo) { const g = L(...at(.12)), d = nrm2(sub(o.wandTo, g)); tip = o.wandTo; butt = add(g, d, -.32 * s); hEnd = add(g, d, .16 * s); }   // la punta va donde la escena la necesita
    const polys = [capsulePts(butt, hEnd, .05 * s, .042 * s, 3), capsulePts(hEnd, tip, .032 * s, .013 * s, 3)];
    for (const d of [.62, 1.05, 1.45]) { const f = (d - .3) / 1.7; polys.push(circ([lerp(hEnd[0], tip[0], f), lerp(hEnd[1], tip[1], f)], (.04 - d * .008) * s, 8)); }
    pieces.push({ k: 'wood', polys, sep: true, tip });
  }
  pieces.push({ k: 'skin', polys: fingers[3].polys, sep: true }, { k: 'skin', polys: thumb.polys, sep: true });
  const all = pieces.flatMap(p => p.polys);
  return { pieces, all, fingers, thumb, s, wandTip: o.wand ? pieces.find(p => p.k === 'wood').tip : null };
}
/* «manopla»: la mano de las películas actuales (para comparar a escala de plano general) */
function mittenRig(o) {
  const ca = Math.cos(o.ang), sa = Math.sin(o.ang), s = o.s;
  const T = p => { const x = p[0] * s, y = p[1] * s; return [o.x + x * ca - y * sa, o.y + x * sa + y * ca]; };
  const c = [T([0, 0]), 0.25 * s];
  return { all: [capsulePts(T([-.3, 0]), T([.2, .02]), .15 * s, .2 * s, 5)] };
}
