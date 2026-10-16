/* El Perdón — Ep. III, 7:26 (motor nuevo, v2: sin primeros planos de cara, manos grandes, porche a escala) */
/* ---------- los planos ---------- */
const GREEN = t => 1 - sm((t - 36) / 5);   // la luna deja de ser verde
const CURSE = t => 1 - sm((t - 34) / 3);   // la vena verde deja los hilos
function shotWide(t, ticks, opt) {
  const gy = 300, k = opt.k || 3.4, green = GREEN(t);
  nightSky(green);
  moon(opt.moon[0], opt.moon[1], opt.moon[2], green);
  /* la maldición sube a la luna como zarcillo de humo verde que se deshace */
  if (t > 33.5 && t < 41) {
    const a = win(t, 33.5, 41, .8, 2), base = [opt.dx + 20, gy - 140], top = [opt.moon[0], opt.moon[1] + opt.moon[2]];
    const pts = []; for (let i = 0; i <= 40; i++) { const f = i / 40; pts.push([lerp(base[0], top[0], f) + Math.sin(f * 9 + t * 2) * 40 * (1 - f), lerp(base[1], top[1], f)]); }
    const g = clamp((t - 33.5) / 3);
    inkStroke(pts, { w: tt => 16 * (1 - tt * .6), col: '70,190,120', a: .75 * a, prog: g, from: clamp((t - 37) / 3.5), dry: .8, seed: 9, bristles: 5 });
    if (t > 36) inkBloom(top, 30 + 80 * sm((t - 36) / 3), '120,220,160', .35 * (1 - sm((t - 38.5) / 2.5)), 3);
  }
  snow(t, 70, .55, .8);
  porch(gy, k, { x0: opt.dx - 120, facade: 1.6 });
  lantern(opt.lantX ?? opt.dx + 20, gy, k, 1);
  const L = { d: nrm2([-.4, -1]), z: -.5 };
  SC.sil = true; SC.rimCol = '255,206,140';
  /* Damien de rodillas (mira a +x) · Anami (mira a -x) · Joy de rodillas junto a Draconida tumbada */
  const dx = opt.dx, kn = opt.anamiKneel(t);
  const Dm = figure(poseJ({ kneel: 1, lean: .1 - .12 * sm((t - 40) / 3), hand: opt.dmHand(t), handF: [-6, -30], t }), { k, x: dx - 230, y: gy, who: 'damien', key: 'w' + opt.key + 'd', ticks, nearPose: HPOSE.relajada, pitch: -.15 - .2 * sm((t - 40) / 3) });
  const An = figure(poseJ({ kneel: kn, hand: opt.anHand(t, kn), t }), { k, x: dx + opt.anX(t), y: gy, who: 'anami', key: 'w' + opt.key + 'a', ticks, flip: true, nearPose: HPOSE.alcanzar, pitch: -.1 * kn });
  const Dr = figure(lyingJ(sm((t - 38.5) / 3) * .6), { k, x: dx + 520, y: gy, who: 'draco', key: 'w' + opt.key + 'r', ticks, capeStiff: .2 });
  const Jy = figure(poseJ({ kneel: 1, lean: .25 - .15 * sm((t - 39) / 2), hand: [24, -18], handF: [18, -16], t }), { k, x: dx + 340, y: gy, who: 'joy', key: 'w' + opt.key + 'j', ticks, nearPose: HPOSE.relajada, pitch: .2 - .35 * sm((t - 39) / 2) });
  for (const F of [Dr, Jy, Dm, An]) drawFig(F, L, .75);
  /* hilos: Damien–Anami y Damien–Joy */
  const wD = Dm.X(poseJ({ kneel: 1, hand: opt.dmHand(t) }).Wn), wA = An.X(poseJ({ kneel: kn, hand: opt.anHand(t, kn) }).Wn), wJ = Jy.X([24, -18]);
  const gold = sm((t - 28) / 4), dis = sm((t - 33) / 2.5);
  const p1 = thread(wD, wA, t, { gold, dis, vein: CURSE(t), sag: 40, from: .5 });
  const p2 = thread(wD, wJ, t, { gold: sm((t - 29.5) / 4), dis: sm((t - 33.6) / 2.5), vein: CURSE(t), sag: 90, from: 0 });
  goldMotes(p1, 33, t); goldMotes(p2, 33.6, t);
  SC.sil = false;
}
/* de rodillas, hablan: plano medio-general más cerrado */
function shotKneel(t, ticks) {
  shotWide(t, ticks, { k: 5.2, dx: 120, key: 'b', lantX: -420, moon: [-150, -260, 52], anX: () => -0, anamiKneel: tt => eio(clamp((tt - 15) / 2.4)), dmHand: tt => [22, -30 + 4 * Math.sin(tt * 2)], anHand: (tt, kn) => [14, lerp(-34, -28, kn)] });
}

/* plano medio en silueta (de cintura arriba): el motor brilla aquí, no en el primer plano de cara */
function shotMedium(t, ticks, o) {
  const gy = o.gy ?? 700, k = 7.2, green = GREEN(t);
  nightSky(green); moon(o.moon[0], o.moon[1], 56, green); snow(t, 50, .8, .7);
  const lp = [o.lantX, gy - 118 * k]; const g = ctx.createRadialGradient(lp[0], -200, 0, lp[0], -200, 700); g.addColorStop(0, 'rgba(255,200,130,.25)'); g.addColorStop(1, 'rgba(255,200,130,0)'); ctx.fillStyle = g; ctx.fillRect(-SW / 2, -500, SW, 1000);
  SC.sil = true; SC.rimCol = o.rim;
  const F = figW(o.J(t), { k, x: o.x, y: gy, who: o.who, key: o.key, ticks, flip: o.flip, yawAdd: o.yawAdd ? o.yawAdd(t) : 0, pitch: o.pitch ? o.pitch(t) : 0, nearPose: o.pose || HPOSE.relajada });
  drawFig(F, o.L, .9);
  if (o.after) o.after(t, F);
  snow(t, 22, 1.5, .8);
}
const FILM = {
  DUR: 52,
  SHOTS: [
    { t0: 0, t1: 7, draw: (t, k) => shotWide(t, k, { k: 3.9, dx: -60, key: 'a', moon: [-380, -270, 58], lantX: -40, anX: tt => lerp(330, 300, sm((tt - 4) / 2)), anamiKneel: () => 0, dmHand: tt => [22, -30 + 4 * Math.sin(tt * 2)], anHand: () => [12, -36] }) },
    { t0: 7, t1: 14, draw: (t, k) => shotMedium(t, k, { who: 'anami', key: 'mA', x: -120, flip: false, moon: [480, -260], lantX: -600, rim: '170,230,190', L: { d: nrm2([1, -.6]), z: -.6 }, J: tt => poseJ({ hand: [12, -34], t: tt }), yawAdd: tt => -1.9 * eio(clamp((tt - 9.2) / 2)), pitch: tt => -.1 - .1 * sm((tt - 11) / 2) }) },
    { t0: 14, t1: 23, draw: (t, k) => shotWide(t, k, { k: 5.4, dx: 120, key: 'b', lantX: -420, moon: [-150, -270, 50], anX: () => 0, anamiKneel: tt => eio(clamp((tt - 15) / 2.4)), dmHand: tt => [22, -30 + 4 * Math.sin(tt * 2)], anHand: (tt, kn) => [14, lerp(-34, -28, kn)] }) },
    { t0: 23, t1: 33, draw: (t, k) => { bokehBG(t, GREEN(t), 0); snow(t, 30, 1.1, .5); bigHands(t, { t0: 23, delay: 1.6, tClasp: 27.6, tGold: 28, vein: CURSE(t), houseA: 'G', houseD: 'R' }); snow(t, 18, 1.6, .7); } },
    { t0: 33, t1: 42, draw: (t, k) => shotWide(t, k, { k: 3.9, dx: -60, key: 'c', moon: [-380, -270, 58], lantX: -40, anX: () => 150, anamiKneel: () => 1, dmHand: () => [30, -34], anHand: () => [30, -34] }) },
    { t0: 42, t1: 48, draw: (t, k) => shotMedium(t, k, { who: 'damien', key: 'mD', x: 60, gy: 470, flip: true, moon: [-420, -260], lantX: 600, rim: '240,236,220', L: { d: nrm2([-1, -.5]), z: -.6 }, J: tt => poseJ({ kneel: 1, lean: .25, hand: [16, -24], t: tt }), pitch: tt => -.25 - .2 * sm((tt - 42.5) / 3), after: (tt) => goldMotes([[-300, 300], [100, 380], [400, 320]], 41.5, tt, 22, 240) }) },
  ],
  SUBS: [
    [17.6, 19.8, 'Te perdono.', 'Anami'],
    [20.3, 22.6, '¿Por qué?', 'Damien'],
    [23.4, 26.6, 'Porque ella vale más que mi odio.', 'Anami'],
  ],
  end: t => { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(PAPER, 0, 0); L0s(); const a = win(t, 48.3, 52, 1, 1.2);
    label('El Juramento Roto', 0, -30, { size: 64, it: false, col: `rgba(40,30,32,${.9 * a})` });
    label('Ep. III · «Te perdono» — escena rehecha con el motor nuevo', 0, 30, { size: 30, col: `rgba(90,60,60,${.85 * a})` }); },
  wind: t => (t < 7 || (t > 14 && t < 23) || (t > 33 && t < 42)) ? .05 : .025,
  drone: t => .1 * CURSE(t) * (t < 48 ? 1 : 0),
  pad: t => t < 48.5 ? .55 : .3 * (1 - sm((t - 50) / 2)),
  CHORDS: [[0, [57, 60, 64, 69]], [7, [53, 57, 60, 65]], [14, [50, 53, 57, 62]], [23, [52, 56, 59, 64]], [28.2, [48, 52, 55, 60]], [33, [53, 57, 60, 65]], [38, [48, 55, 60, 64]], [42, [45, 52, 57, 60]], [46, [48, 52, 55, 64]]],
  EVENTS: [[17.6, () => pluck([76, 74, 72], .42)], [23.4, () => pluck([69, 72, 76, 74], .5)], [28.0, () => chime([72, 76, 79, 84], .16)], [33.0, () => sparkle(18, 2.6)], [36.5, () => chime([79, 84, 88], .3)], [41.0, () => pluck([64, 67, 72], .6)]],
};
