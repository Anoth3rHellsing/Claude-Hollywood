/* =====================================================================
   TRÁILER — El Juramento Roto (Ep. I · II · III) con el motor nuevo
   ===================================================================== */
const NIGHT = '30,36,58', DUSK_T = '92,70,92', DUSK_B = '214,146,102';
const RD = { r: null, t0: 0 };   // ragdoll del duelo
function trReset() { RD.r = null; }

/* A · York, 1879: el juramento de los niños */
function trOath(t, ticks, lt) {
  const gy = 330, k = 2.5;
  skyGrad(DUSK_T, DUSK_B, .9);
  sun(380, 120, 60, '255,190,120', .9);
  porch(gy, 4.2, { snow: false, window: .5, facade: .9, x0: -500 });
  const lp = lantern(-470, gy, 4.2, sm((lt - .5) / 1.5));
  SC.sil = true; SC.rimCol = '255,190,120';
  const L = { d: nrm2([.8, -.3]), z: -.6 }, meet = [0, gy - 84 * k], up = sm((lt - 1.4) / 1.4);
  const kid = (who, x, flip, key) => { const X = p => [x + (flip ? -1 : 1) * p[0] * k, gy + p[1] * k]; const local = [((meet[0] - x) / k) * (flip ? -1 : 1), (meet[1] - gy) / k]; return figW(poseJ({ hand: L2([10, -26], local, up), t }), { k, x, y: gy, who, key, ticks, flip, nearPose: mixHP(HPOSE.relajada, HPOSE.abierta, up) }); };
  const D = kid('damien', -100, false, 'tA_d'), Jy = kid('joy', 0, false, 'tA_j'), A = kid('anami', 100, true, 'tA_a');
  for (const F of [D, A, Jy]) drawFig(F, L, .8);
  if (lt > 3) bloodDrops([add(meet, [-14, 4]), add(meet, [0, 0]), add(meet, [14, 4])], [0, gy - 6], 3.2, lt);
}
/* B · Hogwarts, 1890: la orilla; Draconida mira desde la roca */
function trShore(t, ticks, lt) {
  const gy = 290, k = 3.3;
  skyGrad('150,164,176', '226,214,190', .7);
  ctx.fillStyle = 'rgba(40,40,52,.55)';   // castillo lejano
  ctx.beginPath(); ctx.moveTo(-900, 120); ctx.quadraticCurveTo(-300, -40, 300, 110); ctx.lineTo(300, 140); ctx.lineTo(-900, 140); ctx.fill();
  for (const [x, w, h] of [[-420, 34, 230], [-360, 60, 150], [-280, 28, 260], [-220, 70, 170], [-130, 30, 210], [-60, 90, 120]]) { ctx.fillRect(x, 40 - h + 60, w, h); ctx.beginPath(); ctx.moveTo(x - 6, 100 - h); ctx.lineTo(x + w / 2, 100 - h - w * 1.3); ctx.lineTo(x + w + 6, 100 - h); ctx.fill(); }
  ctx.fillStyle = 'rgba(96,112,128,.55)'; ctx.fillRect(-SW / 2, 120, SW, gy - 120);   // lago
  ctx.strokeStyle = 'rgba(240,236,224,.45)'; ctx.lineWidth = 2; for (let i = 0; i < 9; i++) { const y = 140 + i * 16, x = -600 + ((i * 173 + t * 12) % 900); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 120 + i * 9, y); ctx.stroke(); }
  ctx.fillStyle = 'rgba(52,48,46,.92)'; ctx.fillRect(-SW / 2, gy, SW, 300);   // orilla
  ctx.fillStyle = 'rgb(28,26,30)'; ctx.beginPath(); ctx.moveTo(400, gy + 4); ctx.quadraticCurveTo(430, gy - 120, 560, gy - 112); ctx.quadraticCurveTo(700, gy - 90, 720, gy + 4); ctx.fill();   // roca
  SC.sil = true; SC.rimCol = '255,236,200';
  const L = { d: nrm2([-.5, -1]), z: -.3 };
  const sway = Math.sin(t * .8) * .03;
  const D = figW(poseJ({ lean: sway, hand: [12, -30], t }), { k, x: -560, y: gy, who: 'damien', key: 'tB_d', ticks });
  const Jy = figW(poseJ({ lean: -sway, hand: [16, -40 + 6 * Math.sin(t * 2)], t }), { k, x: -360, y: gy, who: 'joy', key: 'tB_j', ticks, flip: true, nearPose: HPOSE.abierta });
  const A = figW(poseJ({ hand: [6, -26], t }), { k, x: -180, y: gy, who: 'anami', key: 'tB_a', ticks, flip: true, yawAdd: -.6 * sm((lt - 3) / 1.5) });
  const Dr = figW(sitJ({ t }), { k: k * .9, x: 545, y: gy - 105, who: 'draco', key: 'tB_r', ticks, flip: true });
  for (const F of [Dr, D, Jy, A]) drawFig(F, L, .6);
}
/* C · la traición: «Solo eras conveniente» y la grieta */
function trBetray(t, ticks, lt) {
  const gy = 330, k = 4.4;
  skyGrad('22,24,36', '40,40,56', .95);
  for (const x of [-560, -60, 440]) { ctx.fillStyle = 'rgba(140,150,180,.16)'; ctx.beginPath(); ctx.moveTo(x, -340); ctx.lineTo(x + 120, -340); ctx.lineTo(x + 300, gy); ctx.lineTo(x + 100, gy); ctx.fill(); ctx.fillStyle = 'rgba(200,210,230,.28)'; ctx.beginPath(); ctx.moveTo(x, -200); ctx.arc(x + 60, -340, 60, PI, 0); ctx.lineTo(x + 120, -200); ctx.fill(); }
  ctx.fillStyle = 'rgb(20,18,24)'; ctx.fillRect(-SW / 2, gy, SW, 300);
  SC.sil = true; SC.rimCol = '200,214,240';
  const L = { d: nrm2([.2, -1]), z: -.5 };
  const D = figW(poseJ({ lean: -.04, hand: [14, -36], t }), { k, x: 300, y: gy, who: 'damien', key: 'tC_d', ticks, flip: true, pitch: .1 });
  const Jy = figW(poseJ({ lean: .05 + .08 * sm((lt - 3.6) / .4), hand: [10, -28], t }), { k, x: -260, y: gy, who: 'joy', key: 'tC_j', ticks, pitch: -.1 * sm((lt - 3.6) / .6) });
  drawFig(Jy, L, .8); drawFig(D, L, .8);
  const cr = clamp((lt - 4.2) / .5);
  if (cr > 0) { inkCrack(20, cr); if (lt > 4.2 && lt < 4.4) fullInvert(); }
}
/* D · el duelo: el ataque de Damien choca con el escudo de Draconida; el de Anami lo lanza contra el muro */
function trDuel(t, ticks, lt) {
  const gy = 330, k = 3.6, wallF = -62, dx = 470;
  skyGrad('24,28,44', '44,46,62', .95);
  moon(-120, -310, 44, 0);
  snow(t, 40, .5, .5);
  const wallX = dx + -wallF * k;   // el muro queda detrás de Damien (a la derecha)
  ctx.fillStyle = 'rgb(22,20,26)'; ctx.fillRect(wallX, -520, SW, 900);
  ctx.strokeStyle = 'rgba(239,230,210,.1)'; ctx.lineWidth = 2; for (let r = 0; r < 12; r++) { const y = -500 + r * 70; ctx.beginPath(); ctx.moveTo(wallX + 4, y); ctx.lineTo(SW / 2, y); ctx.stroke(); }
  ctx.fillStyle = 'rgb(24,22,28)'; ctx.fillRect(-SW / 2, gy, SW, 300);
  SC.sil = true; SC.rimCol = '210,220,240';
  const L = { d: nrm2([-.4, -1]), z: -.5 };
  const tAtk = 1.3, tShield = .9, tExp = 4.6, tHit = 5.1;
  /* izquierda a derecha: Anami, Joy, Draconida (escudo), Damien */
  const anRaise = sm((lt - 3.9) / .6), drRaise = sm((lt - .6) / .4) * (1 - sm((lt - 3.6) / .6));
  const An = figW(poseJ({ hand: L2([10, -26], [33, -72], anRaise), t }), { k, x: -700, y: gy, who: 'anami', key: 'tD_a', ticks, wand: true });
  const Jy = figW(poseJ({ lean: -.08 * sm((lt - 1.5) / .3), hand: [14, -40], handF: [10, -44], t }), { k, x: -420, y: gy, who: 'joy', key: 'tD_j', ticks, nearPose: HPOSE.abierta });
  const Dr = figW(poseJ({ hand: L2([10, -26], [26, -82], drRaise), t }), { k, x: -150, y: gy, who: 'draco', key: 'tD_r', ticks, wand: true });
  for (const F of [An, Jy, Dr]) drawFig(F, L, .7);
  let Dm, tip;
  if (lt < tHit) {
    const dmRaise = sm((lt - .3) / .5) * (1 - sm((lt - 2.6) / .8));
    Dm = bodyRig({ x0: dx, y0: gy, k, t, target: [lerp(10, 33, dmRaise), lerp(-26, -70, dmRaise)], hy: 47.5, crouchK: 0, who: 'damien', key: 'tD_d', ticks, yawAdd: 0, flip: true, wand: true }); Dm.target = null;
    drawFig(Dm, L, .7); tip = Dm.wandTip;
  } else {
    if (!RD.r) { RD.r = ragdollNew(0); RD.t0 = t; ragdollHit(RD.r, t, -1, 3.0); }
    const J = ragdollStep(RD.r, t, ticks, { wall: wallF, onImpact: v => { RD.shake = Math.min(1, (RD.shake || 0) + v / 4); } });
    Dm = dressBody(J, { k, x0: dx, y0: gy, who: 'damien', key: 'tD_d', ticks, flip: true, nearPose: HPOSE.abierta, farPose: HPOSE.abierta, ex: EXPR.neutral });
    drawFig(Dm, L, .7);
    /* la varita se parte: dos trozos que giran */
    const age = t - RD.t0; ctx.save(); ctx.strokeStyle = 'rgb(16,14,18)'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    for (const [vx, vy, sp] of [[260, -420, 9], [380, -300, -12]]) { const x = dx + 60 + vx * age, y = gy - 260 + vy * age + 900 * age * age; if (y < gy) { ctx.save(); ctx.translate(x, y); ctx.rotate(sp * age); ctx.beginPath(); ctx.moveTo(-26, 0); ctx.lineTo(26, 0); ctx.stroke(); ctx.restore(); } }
    ctx.restore();
  }
  /* el ensō de Draconida */
  const sc = Dr.X([4, -50]), R = 52 * k, RY = 60 * k, pr = clamp((lt - tShield) / .4), fade = sm((lt - 3.4) / .6), hc = HOUSES.S;
  if (pr > 0 && fade < 1) { const ring = []; for (let s = 0; s <= 60; s++) { const an = -PI * .62 + s / 60 * TAU * .97; ring.push([sc[0] + Math.cos(an) * R * (1 + .035 * Math.sin(s * .8)), sc[1] + Math.sin(an) * RY]); } inkStroke(ring, { w: tt => 30 * Math.min(1, tt * 12) * (1 - tt * .55), col: hc.c, a: .92 * (1 - fade), prog: pr, dry: .62, seed: 7, core: .3, coreA: 1 - fade, bristles: 9 }); }
  /* ataque de Damien contra el escudo */
  if (tip && lt > tAtk && lt < 2.4) { const hit = add(sc, [R * .98, -14]), f = clamp((lt - tAtk) / .3), bolt = bez(tip, [lerp(tip[0], hit[0], .5), Math.min(tip[1], hit[1]) - 50], hit, 24);
    inkStroke(bolt, { w: tt => 30 * Math.min(1, tt * 8) * (1 - tt * .5), col: HOUSES.R.c, a: .92 * (1 - sm((lt - 1.75) / .5)), prog: f, from: sm((lt - 1.6) / .5), dry: .7, seed: 2, core: .3 });
    if (lt > tAtk + .3) inkBloom(hit, 16 + 30 * sm((lt - tAtk - .3) / .3), HOUSES.R.g, .8 * (1 - sm((lt - 1.9) / .5)), 9, .8, 5);
    if (lt > tAtk + .3 && lt < tAtk + .42) fullInvert(); }
  /* «¡Expulso!» de Anami: pincelada en arco hasta el pecho de Damien */
  const tipA = An.wandTip;
  if (tipA && lt > tExp && lt < tHit + 1.2) { const chest = [dx - 2 * k, gy - 62 * k], f = clamp((lt - tExp) / (tHit - tExp)), path = bez(tipA, [lerp(tipA[0], chest[0], .5), Math.min(tipA[1], chest[1]) - 160], chest, 34);
    inkStroke(path, { w: tt => 40 * Math.min(1, tt * 8) * (1 - tt * .5) * (1 + .2 * Math.sin(tt * 11)), col: HOUSES.G.c, a: .93 * (1 - sm((lt - tHit - .2) / .8)), prog: f, from: sm((lt - tHit - .1) / .9) * .9, dry: .62, seed: 3, core: .3, bristles: 10 });
    if (lt > tHit) inkBloom(chest, 24 + 60 * sm((lt - tHit) / .35), HOUSES.G.g, .8 * (1 - sm((lt - tHit - .3) / .8)), 4, .9, 7); }
  if (lt > tHit && lt < tHit + .12) fullInvert();
  RD.shake = (RD.shake || 0) * .9; SHX = Math.sin(t * 71) * (RD.shake || 0) * 12 * U; SHY = Math.cos(t * 53) * (RD.shake || 0) * 8 * U;
}
/* E · las muñecas: el hilo rojo */
function trWrists(t, ticks, lt) {
  bokehBG(t, 0, -300);
  snow(t, 20, 1.2, .4);
  bigHands(t, { t0: t - lt, delay: -2, tClasp: 1e9, vein: 0, houseA: 'G', houseD: 'G' });
  const pulse = .5 + .5 * Math.sin(lt * 4); paperLight([0, 60], 4 + 6 * pulse, .5);
}
/* F · Ep. II: el triángulo de hilo rojo bajo la luna llena */
function trTriangle(t, ticks, lt) {
  const gy = 330, k = 3.4;
  nightSky(0); moon(-120, -300, 70, 0);
  snow(t, 60, .55, .8);
  porch(gy, k, { x0: -300, facade: 1.2 });
  lantern(-560, gy, k, 1);
  SC.sil = true; SC.rimCol = '235,232,214';
  const L = { d: nrm2([-.2, -1]), z: -.6 }, emerge = sm((lt - .4) / 1.6);
  const Jy = figW(poseJ({ hand: [18, -36], t }), { k, x: -620, y: gy, who: 'joy', key: 'tF_j', ticks });
  const A = figW(poseJ({ hand: [16, -36], t }), { k, x: 560, y: gy, who: 'anami', key: 'tF_a', ticks, flip: true });
  const Dr = figW(poseJ({ hand: [8, -28], t }), { k, x: 720, y: gy, who: 'draco', key: 'tF_r', ticks, flip: true });
  const D = figW(poseJ({ hand: [12, -40], handF: [-8, -40], t }), { k: k * .92, x: 0, y: gy - 40, who: 'damien', key: 'tF_d', ticks, yawAdd: -1 });
  ctx.save(); ctx.globalAlpha = .25 + .75 * emerge; drawFig(D, L, .8); ctx.restore();
  drawFig(Dr, L, .7); drawFig(Jy, L, .8); drawFig(A, L, .8);
  const wJ = Jy.X(poseJ({ hand: [18, -36] }).Wn), wA = A.X(poseJ({ hand: [16, -36] }).Wn), wD = D.X(poseJ({ hand: [12, -40] }).Wn), tg = sm((lt - 1.4) / 1.2);
  if (tg > 0) { ctx.save(); ctx.globalAlpha = tg; thread(wJ, wD, t, { vein: 0, sag: 30 }); thread(wD, wA, t, { vein: 0, sag: 30 }); thread(wJ, wA, t, { vein: 0, sag: 90 }); ctx.restore(); }
}
/* G · Ep. III: la luna verde; la maldición trepa hasta Draconida y la derriba; Joy tira del hilo y entrega su magia */
function trCurse(t, ticks, lt) {
  const gy = 330, k = 3.6;
  nightSky(1); moon(-60, -320, 64, 1);
  snow(t, 60, .55, .8);
  porch(gy, k, { x0: -200, facade: 1.4 });
  lantern(-640, gy, k, 1);
  SC.sil = true; SC.rimCol = '160,230,180';
  const L = { d: nrm2([.3, -1]), z: -.6 };
  const Jy = figW(poseJ({ kneel: sm((lt - 4.2) / .8), lean: .1, hand: [24, -40], handF: [20, -42], t }), { k, x: -420, y: gy, who: 'joy', key: 'tG_j', ticks, nearPose: HPOSE.puño, farPose: HPOSE.puño });
  const A = figW(poseJ({ hand: L2([10, -26], [30, -46], sm((lt - 3) / .6)), t }), { k, x: 200, y: gy, who: 'anami', key: 'tG_a', ticks, nearPose: HPOSE.alcanzar });
  const fall = sm((lt - 3.1) / 1.1), Jd = fall < 1 ? poseJ({ kneel: fall, lean: -.3 * fall, hand: [14, -30], t }) : lyingJ(0);
  const Dr = figW(fall < .98 ? Jd : lyingJ(0), { k, x: 520, y: gy, who: 'draco', key: 'tG_r', ticks, flip: fall < .98, capeStiff: .2 });
  for (const F of [A, Dr, Jy]) drawFig(F, L, .8);
  /* zarcillo verde por el suelo hasta Draconida */
  const gr = clamp((lt - .2) / 2.8), feet = [520, gy - 4], chest = [520, gy - 60 * k];
  const pts = []; for (let s = 0; s <= 40; s++) { const x = lerp(-300, feet[0] - 10, s / 40); pts.push([x, gy - 4 - Math.abs(Math.sin(s * .55)) * 9]); } for (let s = 1; s <= 20; s++) { const f = s / 20; pts.push([feet[0] + Math.sin(f * TAU * 2) * 24, lerp(feet[1], chest[1], f)]); }
  inkStroke(pts, { w: tt => 9 + 5 * Math.sin(tt * 40), col: '60,190,110', a: .9 * (1 - sm((lt - 5.6) / 1)), prog: gr, dry: .93, seed: 5, bristles: 4 });
  /* el hilo de Joy, que ella agarra con las dos manos: oro que sale de ella */
  const wJ = Jy.X(poseJ({ kneel: sm((lt - 4.2) / .8), lean: .1, hand: [24, -40] }).Wn);
  const p = thread(wJ, [chest[0] - 30, chest[1] + 20], t, { vein: 1 - sm((lt - 5) / 1), gold: sm((lt - 4.8) / 1.5), from: 0, sag: 60 });
  goldMotes([wJ, add(wJ, [0, -30]), add(wJ, [10, -60])], t - lt + 4.9, t, 34, 260);
}
/* H · el perdón: las manos */
function trForgive(t, ticks, lt) {
  bokehBG(t, 1 - sm((lt - 4) / 3), 0); snow(t, 26, 1.1, .5);
  bigHands(t, { t0: t - lt, delay: .8, tClasp: t - lt + 3.4, tGold: t - lt + 3.5, vein: 1 - sm((lt - 3.4) / 2), houseA: 'G', houseD: 'R' });
}
/* I · epílogo de primavera: Joy enciende el farol con una cerilla; los tres juntos */
function trSpring(t, ticks, lt) {
  const gy = 330, k = 3.8;
  skyGrad('120,140,150', '232,214,180', .75);
  sun(520, -60, 50, '255,220,160', .7);
  porch(gy, k, { snow: false, x0: -260, facade: 1.3, window: .25 });
  const lit = sm((lt - 2.4) / .8);
  const lp = lantern(-470, gy, k, lit);
  SC.sil = true; SC.rimCol = '255,224,170';
  const L = { d: nrm2([.9, -.4]), z: -.4 };
  const reach = sm((lt - .6) / 1.2) * (1 - sm((lt - 3.4) / .8));
  const Jy = figW(poseJ({ hand: L2([10, -26], [((lp[0] - -620) / k) - 2, (lp[1] - gy) / k + 6], reach), t }), { k, x: -620, y: gy, who: 'joy', key: 'tI_j', ticks, nearPose: HPOSE.varita });
  const A = figW(sitJ({ t }), { k, x: -20, y: gy, who: 'anami', key: 'tI_a', ticks });
  const Dr = figW(sitJ({ t, lean: -.06 }), { k, x: 300, y: gy, who: 'draco', key: 'tI_r', ticks, flip: true });
  for (const F of [A, Dr, Jy]) drawFig(F, L, .7);
  const hand = Jy.X(poseJ({ hand: L2([10, -26], [((lp[0] - -620) / k) - 2, (lp[1] - gy) / k + 6], reach) }).Wn);
  if (lt > 1.3 && lt < 3.4) { const f = 1 - sm((lt - 3) / .4); paperLight(add(hand, [6, -10]), 5 + 3 * Math.sin(lt * 30), f); }
  /* la cinta verde: muñecas de Anami y Draconida */
  const wA = A.X(sitJ().Wn), wR = Dr.X(sitJ().Wn); ctx.strokeStyle = 'rgba(70,170,110,.95)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(...wA); ctx.quadraticCurveTo((wA[0] + wR[0]) / 2, Math.max(wA[1], wR[1]) + 16, ...wR); ctx.stroke();
}
function trEnd(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(PAPER, 0, 0); L0s();
  const a = win(t, 66.4, 74, 1, 1.2);
  bloodDrops([[-60, -260], [0, -270], [60, -260]], [0, -190], 66.6, t, '176,24,38');
  if (t > 68) goldMotes([[0, -190]], 68, t, 20, 120);
  label('El Juramento Roto', 0, -10, { size: 84, it: false, w: '600', col: `rgba(36,26,30,${.92 * a})` });
  label('Una historia en tres lunas', 0, 50, { size: 34, col: `rgba(120,40,46,${.9 * a})` });
  label('Episodio I   —   Episodio II · La Deuda de Sangre   —   Episodio III · La Última Luna', 0, 120, { size: 22, it: false, col: `rgba(70,56,56,${.8 * sm((t - 68.4) / 1)})` });
}
const FILM = {
  DUR: 74,
  reset: trReset,
  SHOTS: [
    { t0: 0, t1: 7.5, draw: trOath },
    { t0: 7.5, t1: 14.5, draw: trShore },
    { t0: 14.5, t1: 21, draw: trBetray },
    { t0: 21, t1: 28.5, draw: (t, k, lt) => { if (lt < .05) RD.r = null; trDuel(t, k, lt); } },
    { t0: 28.5, t1: 34.5, draw: trWrists },
    { t0: 34.5, t1: 41.5, draw: trTriangle },
    { t0: 41.5, t1: 49.5, draw: trCurse },
    { t0: 49.5, t1: 57.5, draw: trForgive },
    { t0: 57.5, t1: 66, draw: trSpring },
  ],
  SUBS: [
    [4.4, 7.2, 'Nada nos separará.', 'los tres, York, 1879'],
    [10, 13.8, 'Tres amigos. Un juramento de sangre.', ''],
    [15.6, 18.4, 'Solo eras conveniente.', 'Damien'],
    [29.5, 34.2, 'Un juramento de sangre no se rompe sin cobrar su precio.', ''],
    [36.6, 39.6, 'Llegáis tarde. Como siempre.', 'Damien'],
    [53.3, 55.6, 'Te perdono.', 'Anami'],
  ],
  CARDS: [
    [.4, 3.6, 'York, 1879', 'l'], [7.9, 10.4, 'Hogwarts, 1890', 'l'], [21.3, 23.5, 'Episodio I', 'l'],
    [34.8, 37.2, 'Episodio II · La Deuda de Sangre', 'l'], [41.8, 44.2, 'Episodio III · La Última Luna', 'l'],
  ],
  end: trEnd,
  wind: t => (t > 34.5 && t < 49.5) || (t > 21 && t < 28.5) ? .05 : .02,
  drone: t => t > 41.5 && t < 53 ? .1 * (1 - sm((t - 51) / 2)) : t > 14.5 && t < 21 ? .05 : 0,
  pad: t => t < 66 ? .5 : .55 * (1 - sm((t - 71) / 3)),
  CHORDS: [[0, [57, 60, 64, 69]], [7.5, [53, 57, 60, 65]], [14.5, [52, 55, 58, 64]], [21, [50, 53, 57, 62]], [28.5, [45, 52, 57, 60]], [34.5, [52, 55, 58, 62]], [41.5, [50, 53, 56, 62]], [53, [48, 52, 55, 60]], [57.5, [53, 57, 60, 65]], [62, [48, 55, 60, 64]], [66, [45, 52, 57, 64]], [69, [48, 52, 55, 60]]],
  EVENTS: [
    [3.2, () => pluck([69, 72, 76], .35)], [10, () => pluck([72, 74, 76, 79], .3)],
    [15.6, () => pluck([64, 63], .7)], [18.7, () => { thump(AU.ac.currentTime, .5); whoosh(.3, .25); }],
    ...[21.4, 21.9, 22.4, 22.9, 23.4, 23.9, 24.4, 24.9, 25.4, 25.9, 26.4, 26.9].map(x => [x, () => thump(AU.ac.currentTime, .22)]),
    [22.3, () => whoosh(.35, .2)], [22.6, () => chime([67, 74], .05)], [25.6, () => whoosh(.5, .25)], [26.1, () => { thump(AU.ac.currentTime, .6); sparkle(6, .5); }],
    [29.5, () => pluck([57, 60, 64, 62], .5)], [36.6, () => pluck([62, 61], .8)],
    [44.5, () => thump(AU.ac.currentTime, .4)], [46.3, () => sparkle(10, 2)],
    [53, () => chime([72, 76, 79, 84], .16)], [56, () => sparkle(14, 2)],
    [59.9, () => chime([79, 84], .2)], [66.6, () => pluck([69, 72, 76, 81], .4)], [69, () => chime([72, 76, 79], .25)],
  ],
};
