/* =====================================================================
   LOS MAGOS (rig nuevo, en silueta)
   A: capa pesada hasta el suelo, pelo lacio largo, magia cálida (fuego, oro, carmesí, esmeralda)
   B: capa corta, pelo salvaje, ágil; magia fría (azul eléctrico, cian, violeta, cobalto)
   ===================================================================== */
HOUSES.A = { c: '206,92,40', g: '238,182,96' }; HOUSES.B = { c: '62,110,212', g: '150,204,232' };
CAST.magoA = { name: 'Mago A', sex: 'm', hair: 'lacio', house: 'A' };
CAST.magoB = { name: 'Mago B', sex: 'f', hair: 'salvaje', house: 'B' };
/* pose en unidades de figura (pies en el origen, mirando a +x) */
function mJ(o) {
  const kn = o.kn || 0, hy = (o.hy ?? 47.5) - kn * 23, lean = (o.lean ?? .06) + kn * .06, Hp = [o.hx || 0, -hy];
  const u = [Math.sin(lean), -Math.cos(lean)], r = [Math.cos(lean), Math.sin(lean)];
  const tp = (a, b) => [Hp[0] + r[0] * a + u[0] * b, Hp[1] + r[1] * a + u[1] * b];
  const F1 = L2([o.f1 ?? -7, o.f1y ?? 0], [-27, -.5], kn), F2 = L2([o.f2 ?? 9, o.f2y ?? 0], [23, 0], kn);
  let K1 = ik2(Hp, F1, 24, 25, -1).E; if (kn > .5) K1 = L2(K1, [-4, -2], sm((kn - .5) * 2));
  const K2 = ik2(Hp, F2, 24, 25, -1).E;
  const Sn = tp(1.5, 27.5), Sf = tp(-1.2, 28);
  const arm = (S, a, rr) => [S[0] + Math.cos(a) * rr, S[1] + Math.sin(a) * rr];
  const A = ik2(Sn, o.Wn || arm(Sn, o.na ?? 1.5, o.nr ?? 25.5), 14.5, 13.5, 1), B = ik2(Sf, o.Wf || arm(Sf, o.fa ?? 1.62, o.fr ?? 25.5), 14.5, 13.5, 1);
  return { Hp, lean, K1, F1, K2, F2, Sn, En: A.E, Wn: A.W, Sf, Ef: B.E, Wf: B.W, t: o.t || 0 };
}
/* fotogramas clave: los números se interpolan (eio por defecto; e: 'lin' | 'sm' | 'snap' en la clave de llegada) */
function kf(keys, t) {
  if (t <= keys[0].t) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1]; if (t >= b.t) continue;
    let f = clamp((t - a.t) / (b.t - a.t)); f = b.e === 'lin' ? f : b.e === 'sm' ? sm(f) : b.e === 'snap' ? 1 - Math.pow(1 - f, 4) : b.e === 'in' ? f * f * f : eio(f);
    const o = { t }; for (const k in b) if (k !== 't' && k !== 'e') o[k] = typeof a[k] === 'number' && typeof b[k] === 'number' ? lerp(a[k], b[k], f) : (f < .5 ? (a[k] ?? b[k]) : b[k]);
    for (const k in a) if (!(k in o)) o[k] = a[k];
    return o;
  }
  return keys[keys.length - 1];
}
function kfNorm(keys) { for (let i = 1; i < keys.length; i++) for (const k in keys[i - 1]) if (k !== 'e' && !(k in keys[i])) keys[i][k] = keys[i - 1][k]; return keys; }
const NA = 1.42, FA = 1.62;   // brazos en reposo: paralelos al torso (Nico: un antebrazo horizontal se lee como garra)
/* --- Mago A --- */
const KA = [
  { t: 0, x: -450, z: 800, y: 0, hy: 47.5, lean: .05, na: NA, nr: 25.5, fa: FA, fr: 25.5, f1: -8, f2: 10, kn: 0, pitch: 0 },
  { t: 30.6, na: NA, nr: 25.5, lean: .05 },
  { t: 32.4, na: -.95, nr: 27, lean: .02, pitch: -.25, e: 'sm' },
  { t: 36.7, na: -1.3, nr: 26, lean: -.06, pitch: -.15 },
  { t: 37.2, na: .45, nr: 27.5, lean: .2, pitch: .05, e: 'snap' },
  { t: 38.6, na: .2, nr: 27, lean: .16 },
  { t: 44, na: NA - .3, nr: 25, lean: .1, pitch: 0 },
  /* dos pasos: el pie que avanza se levanta; al pasar el peso, cuerpo y pies se mueven juntos y los pies no patinan */
  { t: 52.5, x: -450, f1: -8, f2: 10, f2y: 0, f1y: 0, lean: .1 },
  { t: 52.9, x: -450, f2: 25, f2y: -7, lean: .11, e: 'sm' },
  { t: 53.3, x: -450, f2: 40, f2y: 0, lean: .12, e: 'sm' },
  { t: 54.1, x: -420, f1: -38, f2: 10, lean: .14, e: 'sm' },
  { t: 54.5, x: -420, f1: -23, f1y: -7, lean: .12, e: 'sm' },
  { t: 54.9, x: -420, f1: -8, f1y: 0, lean: .11, e: 'sm' },
  { t: 55.3, x: -420, f2: 25, f2y: -7, e: 'sm' },
  { t: 55.7, x: -420, f2: 40, f2y: 0, e: 'sm' },
  { t: 56.5, x: -390, f1: -38, f2: 10, e: 'sm' },
  { t: 56.9, x: -390, f1: -23, f1y: -7, e: 'sm' },
  { t: 57.3, x: -390, f1: -8, f1y: 0, lean: .1, e: 'sm' },
  { t: 61.0, lean: .1, na: NA - .3, fa: FA },
  { t: 61.8, lean: .28, na: -.4, nr: 22, fa: -.2, fr: 18, pitch: .25, e: 'snap' },
  { t: 65.5, lean: .18, na: .2, nr: 25, fa: FA - .2, fr: 25, pitch: .1 },
  { t: 77.6, na: .2, nr: 25, lean: .1, pitch: 0 },
  { t: 78.9, na: -1.35, nr: 27, lean: -.02, pitch: -.15 },
  { t: 79.7, na: .55, nr: 27.5, lean: .14, pitch: .05, e: 'sm' },
  { t: 80.3, na: -.15, nr: 27.5, lean: .12 },
  { t: 87.5, na: -.1, nr: 27, lean: .1 },
  { t: 89.5, na: NA - .4, nr: 25, lean: .08, kn: 0 },
  { t: 90.4, na: -1.1, nr: 26, kn: .25, lean: .1, pitch: -.1 },
  { t: 91.2, kn: 1, na: 1.0, nr: 27.5, lean: .32, pitch: .35, e: 'in' },
  { t: 97.5, kn: 1, na: 1.0, nr: 27.5, lean: .3 },
  { t: 99.5, kn: 0, na: NA, nr: 25.5, lean: .08, pitch: 0 },
  { t: 112, lean: .1, na: NA, fa: FA },
  { t: 113, lean: .24, na: .9, nr: 22, pitch: .2 },
  { t: 119.9, x: -390, lean: .2, na: .9 },
  { t: 120, x: -300, lean: .1, na: NA, nr: 25.5, pitch: 0, e: 'snap' },
  { t: 121.9, x: -300, na: -.2, nr: 26, lean: .06 },
  { t: 122.6, na: 0, nr: 28, lean: .18, f1: -14, f2: 12, e: 'snap' },
  { t: 149.8, na: 0, nr: 28, lean: .22, x: -300 },
  { t: 153.2, na: -.05, nr: 28, lean: .3, x: -270 },
  { t: 153.25, x: -270, e: 'snap' },
  { t: 153.9, x: -600, y: 0, lean: -.2, na: -1, fa: -1.2, kn: 0, e: 'snap' },
  { t: 155.5, x: -610, hy: 40, lean: .78, na: NA - .5, nr: 22, fa: FA - .3, fr: 21, f1: -10, f2: 12, pitch: .4 },
  { t: 180, x: -610, hy: 40, lean: .76, na: NA - .5, nr: 22, fa: FA - .3, fr: 21, f1: -10, f2: 12, pitch: .4 },
];
/* --- Mago B (mira hacia la izquierda: flip) --- */
const TABY = -84;   // altura del tablero de las mesas bajas del pasillo
const KB = [
  { t: 0, x: 450, z: 800, y: 0, hy: 46.5, lean: .1, na: NA - .15, nr: 25, fa: FA, fr: 25.5, f1: -10, f2: 12, kn: 0, pitch: 0, cir: 0 },
  { t: 37.9, hy: 46.5, lean: .1, na: NA - .15 },
  { t: 38.4, hy: 44, lean: .16, na: -1.2, nr: 25, pitch: -.1 },
  { t: 38.6, hy: 34, lean: .5, na: 1.15, nr: 28, pitch: .35, e: 'snap' },
  { t: 39.6, hy: 42, lean: .22, na: -.3, nr: 26, pitch: .05 },
  { t: 44, hy: 45, lean: .14, na: -.2, nr: 25 },
  { t: 59.6, na: -.2, nr: 25, lean: .14 },
  { t: 60.2, na: -.9, nr: 26, lean: .1, e: 'sm' },
  { t: 61.3, na: -.9, cir: 1, nr: 26, lean: .16, e: 'lin' },
  { t: 62.2, na: .1, nr: 27.5, lean: .26, pitch: .1, e: 'snap' },
  { t: 69.6, na: .1, nr: 26, lean: .14, pitch: 0 },
  { t: 70.3, na: -1.38, nr: 28, lean: -.08, pitch: -.6, e: 'snap' },
  { t: 74.6, na: -1.3, nr: 28, lean: -.06, pitch: -.5 },
  { t: 75.2, na: -.5, nr: 26, lean: .05, pitch: -.3, e: 'snap' },
  { t: 77.6, na: -.7, nr: 26, lean: .02, pitch: -.2 },
  { t: 78.2, na: .05, nr: 28, lean: .26, pitch: 0, f1: -14, f2: 14, e: 'snap' },
  { t: 90, na: -.1, nr: 26, lean: .14, f1: -10, f2: 12 },
  /* salta hacia atrás entre las mesas lanzando cortes */
  { t: 97.9, x: 450, y: 0, hy: 44, lean: .2, na: -.3 },
  { t: 98.2, x: 470, y: 0, hy: 36, lean: .4, na: -1.1, e: 'sm' },
  { t: 98.9, x: 720, y: TABY, hy: 40, lean: .1, na: .8, nr: 28, e: 'lin' },
  { t: 99.3, x: 725, y: TABY, hy: 36, lean: .3, na: -1.2 },
  { t: 99.9, x: 900, y: 0, hy: 42, lean: .15, na: .7, e: 'lin' },
  { t: 100.3, x: 905, y: 0, hy: 36, lean: .35, na: -1.25 },
  { t: 100.9, x: 1040, y: TABY, hy: 42, lean: .12, na: .75, e: 'lin' },
  { t: 101.3, x: 1045, y: TABY, hy: 36, lean: .3, na: -1.3 },
  { t: 101.9, x: 1180, y: 0, hy: 40, lean: .2, na: .8, e: 'lin' },
  { t: 102.6, x: 1180, y: 0, hy: 45, lean: .12, na: -.1 },
  { t: 109.2, x: 1150, na: -.1, lean: .12 },
  { t: 109.4, x: 1150, na: -1.35, nr: 28, lean: .05 },
  { t: 109.7, x: 1150, na: .7, nr: 28, lean: .3, e: 'snap' },
  { t: 112.5, x: 1150, na: NA - .2, nr: 25, lean: .2 },
  { t: 113, lean: .3, na: .6, nr: 22, pitch: .2 },
  { t: 119.9, x: 1150, lean: .3 },
  { t: 120, x: 300, y: 0, hy: 46.5, lean: .1, na: NA, nr: 25.5, pitch: 0, e: 'snap' },
  { t: 121.9, na: -.2, nr: 26, lean: .06 },
  { t: 122.6, na: 0, nr: 28, lean: .2, f1: -14, f2: 12, e: 'snap' },
  { t: 149.8, na: 0, nr: 28, lean: .24, x: 300 },
  { t: 153.2, na: -.05, nr: 28, lean: .3, x: 270 },
  { t: 153.25, x: 270, e: 'snap' },
  { t: 153.9, x: 600, lean: -.2, na: -1, fa: -1.2, e: 'snap' },
  { t: 155.5, x: 620, hy: 41, lean: .72, na: NA - .5, nr: 22, fa: FA - .3, fr: 21, f1: -10, f2: 12, pitch: .45 },
  { t: 180, x: 620, hy: 41, lean: .7, na: NA - .5, nr: 22, fa: FA - .3, fr: 21, f1: -10, f2: 12, pitch: .45 },
];
kfNorm(KA); kfNorm(KB);
/* el salto: arco de la cadera entre las claves de vuelo */
function hopLift(t) { for (const [a, b] of [[98.2, 98.9], [99.3, 99.9], [100.3, 100.9], [101.3, 101.9]]) if (t > a && t < b) { const f = (t - a) / (b - a); return 4 * f * (1 - f); } return 0; }
function mageState(who, t) {
  const P = kf(who === 'magoA' ? KA : KB, t);
  /* respiración, jadeo final, temblor al empujar el haz */
  P.lean += Math.sin(t * 1.3 + (who === 'magoA' ? 0 : 2)) * .012;
  if (t > 154.5) { P.lean += Math.sin(t * 5.6 + (who === 'magoA' ? 0 : 1.3)) * .045; P.hy += Math.sin(t * 5.6) * .6; }
  if (t > 122.6 && t < 153.2) P.na += Math.sin(t * 31 + (who === 'magoA' ? 0 : 1)) * .025 + Math.sin(t * 7.3) * .02;
  if (who === 'magoB') { const h = hopLift(t); P.lift = h; P.hy += h * 4; P.na += (P.cir || 0) * TAU; }
  return P;
}
const MAGE = {};
/* dibuja un mago en su sitio del mundo. light = { d, rim, col } */
function drawMage(who, t, ticks, light, keyx = '') {
  const P = mageState(who, t), z = P.z, s = PS(z), base = PJ(P.x, P.y - (P.lift || 0) * 90, z), k = 1.8 * s;
  const tuck = P.lift || 0, J = mJ({ ...P, f1: (P.f1 ?? -7) + tuck * 8, f2: (P.f2 ?? 9) - tuck * 2, f1y: (P.f1y || 0) - tuck * 16, f2y: (P.f2y || 0) - tuck * 12, t });
  const A = who === 'magoA';
  /* durante el choque, la presión de la esfera empuja capa y pelo hacia fuera; al final, el punto negro los aspira */
  const W0 = WIND.x;
  if (t > TBEAM && t < TCOLL) { const out = clashLight(t) * (1.5 + .5 * Math.sin(t * 6.3 + (A ? 0 : 2))), suck = t > 150 ? sm((t - 150) / 2.5) : 0; WIND.x = (A ? -1 : 1) * (out * (1 - suck) - 2.6 * suck); }
  const B = dressBody(J, { k, x0: base[0], y0: base[1], who, key: who + keyx, ticks, flip: !A, nearPose: HPOSE.varita, farPose: HPOSE.relajada, wand: true, pitch: P.pitch || 0, yawAdd: 0, capeStiff: A ? .2 : .12, capeLen: A ? 1.22 : .62 });
  WIND.x = W0;
  /* sombra de contacto */
  const g0 = PJ(P.x, 0, z), sh = 1 - Math.min(1, (P.y ? 84 : 0) / 200 + tuck * .6);
  ctx.fillStyle = `rgba(10,10,14,${.45 * sh})`; ctx.beginPath(); ctx.ellipse(g0[0], g0[1] + 2 * s, 34 * s, 7 * s, 0, 0, TAU); ctx.fill();
  SC.sil = true; SC.rimCol = light.col || '190,200,224';
  drawFig(B, { d: light.d || nrm2([0, -1]), z: -.5 }, light.rim ?? .4);
  SC.sil = false;
  MAGE[who] = { B, P, tip: B.wandTip, k, s, base, chest: B.X([2, -62]), head: B.X([2, -88]) };
  return MAGE[who];
}
