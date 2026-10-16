/* =====================================================================
   EL PERDÓN — El Juramento Roto · Ep. III, 7:26 — rehecho con el motor nuevo
   Porche nevado de York bajo la luna verde. Anami se arrodilla ante Damien:
   «Te perdono». Se toman la mano; los hilos se vuelven oro y se deshacen;
   la maldición sube a la luna y se disuelve.
   ===================================================================== */
const DUR = 52;
const HOUSE_OF = { anami: 'G', joy: 'G', damien: 'R', draco: 'S' };
const sub2 = (a, b) => [a[0] - b[0], a[1] - b[1]];
const L2 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
let EX = { ...EXPR.neutral };

/* ---------- utilidades de escena ---------- */
function label(txt, x, y, o = {}) {
  ctx.font = `${o.it === false ? '' : 'italic '}${o.w || ''} ${o.size || 26}px "Cormorant Garamond", Georgia, serif`;
  ctx.textAlign = o.align || 'center'; ctx.fillStyle = o.col || 'rgba(40,30,32,.78)'; ctx.fillText(txt, x, y);
}
function subtitle(txt, a, who) {
  if (a <= .01) return;
  ctx.save(); L0s(); ctx.globalAlpha = a;
  ctx.font = 'italic 40px "Cormorant Garamond", Georgia, serif'; ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0,0,0,.85)'; ctx.shadowBlur = 14 * U;
  ctx.fillStyle = 'rgba(244,236,218,.96)'; ctx.fillText(txt, 0, 420);
  if (who) { ctx.font = '22px "Cormorant Garamond", Georgia, serif'; ctx.fillStyle = 'rgba(244,236,218,.6)'; ctx.fillText(who.toUpperCase(), 0, 452); }
  ctx.restore();
}
function L0s() { ctx.setTransform(U, 0, 0, U, W / 2, H / 2); }
const win = (t, a, b, fi = .4, fo = .4) => Math.min(sm((t - a) / fi), sm((b - t) / fo));

/* nieve sin estado: posición = función del tiempo */
function snow(t, n, depth, a = 1) {
  const rr = mulberry32(17 + depth * 100);
  for (let i = 0; i < n; i++) {
    const x0 = rr() * (SW + 200) - SW / 2 - 100, y0 = rr() * 1100 - 550, sp = (18 + rr() * 30) * depth, sz = (1.2 + rr() * 2.2) * depth;
    const y = ((y0 + t * sp + 550) % 1100 + 1100) % 1100 - 550, x = ((x0 + Math.sin(t * .6 + i) * 18 * depth - t * 6 * depth + SW / 2 + 100) % (SW + 200) + SW + 200) % (SW + 200) - SW / 2 - 100;
    ctx.fillStyle = `rgba(246,240,226,${(.35 + .45 * rr()) * a})`; ctx.beginPath(); ctx.arc(x, y, sz, 0, TAU); ctx.fill();
  }
}
/* luna: verde mientras dura la maldición, luego plata */
function moon(x, y, r, green, glow = 1) {
  const c = [lerp(238, 150, green), lerp(234, 214, green), lerp(214, 150, green)].map(Math.round).join(',');
  const g = ctx.createRadialGradient(x, y, r * .6, x, y, r * 3.2);
  g.addColorStop(0, `rgba(${c},${.35 * glow})`); g.addColorStop(1, `rgba(${c},0)`); ctx.fillStyle = g; ctx.fillRect(x - r * 3.2, y - r * 3.2, r * 6.4, r * 6.4);
  ctx.fillStyle = `rgb(${c})`; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  ctx.fillStyle = `rgba(90,110,96,${.12 + .1 * green})`; for (const [dx, dy, rr] of [[-.3, -.2, .22], [.25, .15, .16], [-.05, .35, .12]]) { ctx.beginPath(); ctx.arc(x + dx * r, y + dy * r, rr * r, 0, TAU); ctx.fill(); }
}
/* cielo de noche lavado */
function nightSky(green) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(PAPER, 0, 0); T0();
  const g = ctx.createLinearGradient(0, -500, 0, 500);
  g.addColorStop(0, `rgba(${Math.round(lerp(34, 30, green))},${Math.round(lerp(40, 52, green))},${Math.round(lerp(62, 52, green))},.93)`); g.addColorStop(1, 'rgba(46,50,70,.86)');
  ctx.fillStyle = g; ctx.fillRect(-SW / 2, -500, SW, 1000);
  if (!TINTA.tex) TINTA.tex = ctx.createPattern(WASHTEX, 'repeat');
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = .45; ctx.fillStyle = TINTA.tex; ctx.fillRect(-SW / 2, -500, SW, 1000); ctx.restore();
}
/* farol de York: poste, caja de cristal y luz cálida (papel reservado + lavado ámbar) */
function lantern(x, y, s, on = 1) {
  const warm = '255,206,130';
  if (on > .01) { for (const [r, a] of [[260, .1], [150, .14], [70, .2]]) { const g = ctx.createRadialGradient(x, y, 0, x, y, r * s); g.addColorStop(0, `rgba(${warm},${a * on})`); g.addColorStop(1, `rgba(${warm},0)`); ctx.fillStyle = g; ctx.fillRect(x - r * s, y - r * s, r * 2 * s, r * 2 * s); } }
  ctx.fillStyle = 'rgb(16,14,18)';
  ctx.fillRect(x - 4 * s, y + 22 * s, 8 * s, 600);
  ctx.beginPath(); ctx.moveTo(x - 22 * s, y - 26 * s); ctx.lineTo(x + 22 * s, y - 26 * s); ctx.lineTo(x, y - 44 * s); ctx.closePath(); ctx.fill();
  ctx.fillRect(x - 20 * s, y + 18 * s, 40 * s, 7 * s);
  if (on > .01) paperLight([x, y - 2 * s], 13 * s, on);
  ctx.strokeStyle = 'rgb(16,14,18)'; ctx.lineWidth = 3.4 * s; ctx.strokeRect(x - 17 * s, y - 24 * s, 34 * s, 44 * s); ctx.beginPath(); ctx.moveTo(x, y - 24 * s); ctx.lineTo(x, y + 20 * s); ctx.stroke();
}
/* porche: tejado, postes, barandilla, suelo de tablas, escalones y nieve */
function porch(gy, k) {
  const ink = 'rgb(18,16,22)';
  ctx.fillStyle = 'rgba(20,18,26,.9)'; ctx.fillRect(-SW / 2, -500, SW, 120);                 // alero
  ctx.fillStyle = 'rgba(232,228,214,.85)'; ctx.beginPath(); ctx.moveTo(-SW / 2, -380); for (let x = -SW / 2; x <= SW / 2; x += 40) ctx.lineTo(x, -380 + 7 + N2(x * .01, 3) * 6); ctx.lineTo(SW / 2, -380); ctx.closePath(); ctx.fill();   // nieve en el alero
  ctx.fillStyle = 'rgba(26,24,33,.97)'; ctx.fillRect(160, -380, SW / 2, gy + 380);           // fachada de la casa
  ctx.fillStyle = 'rgba(255,196,120,.35)'; ctx.fillRect(560, -250, 120, 170); ctx.fillStyle = ink; ctx.fillRect(616, -250, 8, 170); ctx.fillRect(560, -170, 120, 7);   // ventana encendida
  for (const px of [-700, 140, 860]) { ctx.fillStyle = ink; ctx.fillRect(px - 9, -380, 18, gy + 380); }   // postes
  ctx.strokeStyle = ink; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-SW / 2, gy - 120); ctx.lineTo(-700, gy - 120); ctx.moveTo(860, gy - 120); ctx.lineTo(SW / 2, gy - 120); ctx.stroke();
  ctx.lineWidth = 3; for (let x = -SW / 2 + 20; x < -700; x += 34) { ctx.beginPath(); ctx.moveTo(x, gy - 120); ctx.lineTo(x, gy); ctx.stroke(); }
  ctx.fillStyle = 'rgba(34,28,30,.95)'; ctx.fillRect(-SW / 2, gy, SW, 500 - gy);             // suelo
  ctx.strokeStyle = 'rgba(80,66,60,.5)'; ctx.lineWidth = 2; for (let i = 1; i < 6; i++) { const y = gy + i * i * 7; ctx.beginPath(); ctx.moveTo(-SW / 2, y); ctx.lineTo(SW / 2, y); ctx.stroke(); }
  ctx.fillStyle = 'rgba(236,232,220,.8)'; ctx.beginPath(); ctx.moveTo(-SW / 2, gy + 2); for (let x = -SW / 2; x <= -620; x += 30) ctx.lineTo(x, gy - 4 - Math.abs(N2(x * .02, 1)) * 10); ctx.lineTo(-620, gy + 12); ctx.lineTo(-SW / 2, gy + 12); ctx.fill();   // nieve que entró
}

/* ---------- poses (articulaciones en unidades de figura, mirando a +x) ---------- */
function poseJ(o) {
  const kn = o.kneel || 0, hy = lerp(47.5, 24.5, kn), lean = lerp(.06, .12, kn) + (o.lean || 0);
  const Hp = [0, -hy], u = [Math.sin(lean), -Math.cos(lean)], r = [Math.cos(lean), Math.sin(lean)];
  const tp = (a, b) => [Hp[0] + r[0] * a + u[0] * b, Hp[1] + r[1] * a + u[1] * b];
  const sF1 = [-7, 0], sF2 = [9, 0], kF1 = [-27, -.5], kF2 = [23, 0];
  const F1 = L2(sF1, kF1, kn), F2 = L2(sF2, kF2, kn);
  const K1 = kn > .5 ? L2(ik2(Hp, F1, 24, 25, -1).E, [-4, -2], sm((kn - .5) * 2)) : ik2(Hp, F1, 24, 25, -1).E;
  const K2 = ik2(Hp, F2, 24, 25, -1).E;
  const Sn = tp(1.5, 27.5), Sf = tp(-1.2, 28);
  const A = ik2(Sn, o.hand || [Sn[0] + 4, Sn[1] + 26], 14.5, 13.5, 1), B = ik2(Sf, o.handF || [Sf[0] + 3, Sf[1] + 26], 14.5, 13.5, 1);
  return { Hp, lean, K1, F1, K2, F2, Sn, En: A.E, Wn: A.W, Sf, Ef: B.E, Wf: B.W, t: o.t || 0 };
}
function lyingJ(lift = 0) {   // tumbada de espaldas, cabeza hacia -x; lift levanta el torso
  const lean = -PI / 2 + lift * .55, Hp = [0, -6], u = [Math.sin(lean), -Math.cos(lean)], r = [Math.cos(lean), Math.sin(lean)];
  const tp = (a, b) => [Hp[0] + r[0] * a + u[0] * b, Hp[1] + r[1] * a + u[1] * b];
  const Sn = tp(-1.5, 27.5), Sf = tp(1.2, 28);
  return { Hp, lean, K1: [20, -12], F1: [42, -2], K2: [23, -6], F2: [47, -2], Sn, En: add(Sn, [9, 5]), Wn: add(Sn, [16, -2]), Sf, Ef: add(Sf, [6, 7]), Wf: add(Sf, [-6, 9]), headRoll: lean * .9, t: 0 };
}
function figure(J, o) { return dressBody(J, { k: o.k, x0: o.x, y0: o.y, who: o.who, key: o.key, ticks: o.ticks, flip: o.flip, nearPose: o.nearPose, farPose: o.farPose, ex: o.ex, pitch: o.pitch || 0, yawAdd: o.yawAdd || 0, capeStiff: o.capeStiff }); }
function drawFig(B, L, rim = .7) {
  const S = TINTA, all = []; SC.anchor = B.X([0, -50]); SC.house = B.head.house;
  B.parts.forEach((p, i) => { if (p.hand) renderHand(p.hand, S, { L, sep: true, rim: false }); else { S.fill(p.polys, p.k); if (p.trimLine) S.trim([p.trimLine], B.head.house, 3); } all.push(...p.polys); if (i === 0 && B.head.back.length) S.fill(B.head.back, 'hair'); });
  renderHead(B.head, S, { L, bust: false, feats: false, ex: EX, rim: false, noBack: true });
  all.push(...B.head.headU, ...B.head.cap, ...B.head.front, ...B.head.mid, ...B.head.back);
  for (const p of B.near) { if (p.hand) renderHand(p.hand, S, { L, sep: true, rim: false }); else S.fill(p.polys, p.k); all.push(...p.polys); }
  S.rim(all, L.d, 5, rim);
}
/* hilo rojo entre dos muñecas, con la vena verde que lo recorre; gold 0..1 lo vuelve oro desde «from»; dis 0..1 lo deshace */
function thread(a, b, t, o = {}) {
  const sag = o.sag ?? 60, mid = [(a[0] + b[0]) / 2, Math.max(a[1], b[1]) + sag], pts = bez(a, mid, b, 40);
  const g = o.gold || 0, dis = o.dis || 0, Lp = polyLen(pts), tot = Lp[Lp.length - 1];
  for (let i = 0; i < pts.length - 1; i++) {
    const f = i / (pts.length - 1), gd = clamp((g * 1.25 - Math.abs(f - (o.from ?? .5)) * 1.1) * 3);
    if (rnd01(i * 7.1) < dis * 1.15) continue;
    const c = [lerp(176, 236, gd), lerp(24, 192, gd), lerp(38, 96, gd)].map(Math.round).join(',');
    ctx.strokeStyle = `rgba(${c},${(1 - dis * .7) * (o.a ?? 1)})`; ctx.lineWidth = (o.w || 3.2) * (1 + gd * .4); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(...pts[i]); ctx.lineTo(...pts[i + 1]); ctx.stroke();
  }
  if ((o.vein ?? 1) > .01) {   // la vena verde avanza por el hilo
    for (let v = 0; v < 2; v++) {
      const ph = (t * .35 + v * .5) % 1, i0 = Math.floor(ph * (pts.length - 6));
      inkStroke(pts.slice(i0, i0 + 7), { w: () => (o.w || 3.2) * 1.8, col: '60,200,120', a: .85 * o.vein, dry: .9, seed: v, bristles: 2 });
    }
  }
  return pts;
}
const rnd01 = x => { const s = Math.sin(x * 127.1) * 43758.5453; return s - Math.floor(s); };
/* motas doradas que suben (papel + oro) */
function goldMotes(pts, t0, t, n = 40, rise = 220) {
  const age = t - t0; if (age < 0 || age > 5) return;
  for (let i = 0; i < n; i++) {
    const p = pts[Math.floor(rnd01(i * 3.7) * (pts.length - 1))], d = age * (.6 + rnd01(i) * .8), x = p[0] + Math.sin(i * 2.1 + age * 1.4) * 14 * d, y = p[1] - d * rise * (.6 + rnd01(i * 5.3) * .6);
    const a = (1 - sm(age / 4.5)) * sm(age / .3), r = 2 + rnd01(i * 9.1) * 4;
    ctx.fillStyle = `rgba(240,200,110,${.55 * a})`; ctx.beginPath(); ctx.arc(x, y, r * 2.2, 0, TAU); ctx.fill();
    ctx.fillStyle = `rgba(252,246,230,${a})`; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  }
}

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
  porch(gy, k);
  lantern(opt.lantX ?? opt.dx + 20, gy - 190, 1.25, 1);
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
function bokehBG(t, green, warmX = -500) {
  nightSky(green);
  for (let i = 0; i < 9; i++) { const x = -SW / 2 + rnd01(i * 3.3) * SW, y = -380 + rnd01(i * 7.7) * 520, r = 30 + rnd01(i) * 70; ctx.fillStyle = `rgba(255,${200 + rnd01(i * 2) * 30},140,${.07 + rnd01(i * 5) * .08})`; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
  const g = ctx.createRadialGradient(warmX, -150, 0, warmX, -150, 700); g.addColorStop(0, 'rgba(255,200,130,.22)'); g.addColorStop(1, 'rgba(255,200,130,0)'); ctx.fillStyle = g; ctx.fillRect(-SW / 2, -500, SW, 1000);
}
/* plano medio de Anami: mira a Draconida, se vuelve hacia Damien */
function shotAnami(t, ticks) {
  const lt = t - 7;
  bokehBG(t, GREEN(t), -560);
  snow(t, 40, .9, .6);
  const turn = eio(clamp((lt - 2.2) / 2));
  EX = { ...EXPR.neutral }; const e1 = EXPR.dolor, e2 = EXPR.decidida, f = clamp((lt - 3.5) / 2);
  for (const k in EX) EX[k] = lerp(e1[k], e2[k], f);
  SC.sil = false; SC.rimCol = '150,230,170';
  const R = headRig({ x: 60, y: -10, s: 168, yaw: lerp(.85, -.95, turn), pitch: lerp(-.05, -.12, f), roll: 0, bYaw: lerp(.35, -.35, turn), who: 'anami', ex: EX, key: 'cuA', ticks });
  renderHead(R, TINTA, { L: { d: nrm2([-1, -.35]), z: .05 }, bust: true, feats: false, ex: EX });
  snow(t, 25, 1.4, .8);
}
/* de rodillas, hablan: plano medio-general más cerrado */
function shotKneel(t, ticks) {
  shotWide(t, ticks, { k: 5.2, dx: 120, key: 'b', lantX: -420, moon: [-150, -260, 52], anX: () => -0, anamiKneel: tt => eio(clamp((tt - 15) / 2.4)), dmHand: tt => [22, -30 + 4 * Math.sin(tt * 2)], anHand: (tt, kn) => [14, lerp(-34, -28, kn)] });
}
/* las manos se encuentran */
function shotHands(t, ticks) {
  const lt = t - 23;
  bokehBG(t, GREEN(t), 0);
  snow(t, 30, 1.1, .5);
  const meet = eio(clamp((lt - 2) / 3)), clasp = sm((lt - 4.6) / .8);
  const S = TINTA; SC.sil = false;
  const L = { d: nrm2([-.6, -1]), z: .1 };
  const dW = L2([-640, -300], [-150, -40], meet), aW = L2([640, 330], [150, 70], meet);
  const dA = Math.atan2(15 - dW[1], 0 - dW[0]), aA = Math.atan2(15 - aW[1], 0 - aW[0]);
  const dPose = mixHP(HPOSE.alcanzar, HPOSE.varita, clasp), aPose = mixHP(HPOSE.alcanzar, HPOSE.puño, clasp * .85);
  const Ha = handRig({ x: aW[0], y: aW[1], s: 250, ang: aA, flip: true, pose: aPose });
  const Hd = handRig({ x: dW[0], y: dW[1], s: 250, ang: dA, pose: dPose });
  const ring = (W_, ang) => add(W_, [Math.cos(ang), Math.sin(ang)], -26);
  /* el hilo entre las dos muñecas; se afloja y se vuelve oro al tomarse la mano */
  const gold = sm((t - 28) / 3.5);
  thread(ring(dW, dA), ring(aW, aA), t, { gold, from: .5, vein: CURSE(t) * (1 - clasp * .6), sag: lerp(160, 40, meet), w: 7 });
  const cuff = (W_, ang, house) => { const d = [Math.cos(ang), Math.sin(ang)], e = add(W_, d, -48); SC.house = house; S.fill([capsulePts(add(e, d, -900), e, 110, 70, 5)], 'cloth'); S.trim([[add(e, perp(d), 70), add(e, perp(d), -70)]], house, 7); };
  SC.house = 'G'; renderHand(Ha, S, { L, sep: true }); cuff(aW, aA, 'G');
  SC.house = 'R'; renderHand(Hd, S, { L, sep: true }); cuff(dW, dA, 'R');
  /* el hilo atado en cada muñeca */
  for (const [W_, ang] of [[dW, dA], [aW, aA]]) { const c = ring(W_, ang), gc = [lerp(176, 236, gold), lerp(24, 192, gold), lerp(38, 96, gold)].map(Math.round).join(','); ctx.strokeStyle = `rgb(${gc})`; ctx.lineWidth = 7; ctx.beginPath(); ctx.ellipse(c[0], c[1], 11, 33, ang, 0, TAU); ctx.stroke(); }
  if (t > 28) { paperLight([0, 15], 30 * sm((t - 28) / .6) * (1 - sm((t - 30) / 2)) + 2, 1 - sm((t - 30.5) / 2)); goldMotes([[0, 15], [-60, 0], [60, 30]], 28.2, t, 26, 160); }
  snow(t, 18, 1.6, .7);
}
/* cierre: Damien, cabeza baja, a la luz del farol */
function shotDamien(t, ticks) {
  const lt = t - 42;
  bokehBG(t, 0, 520);
  snow(t, 40, .9, .6);
  EX = { ...EXPR.dolor };
  SC.sil = false; SC.rimCol = '235,232,214';
  const R = headRig({ x: -80, y: 0, s: 160, yaw: lerp(-.55, -.75, lt / 6), pitch: lerp(-.1, -.32, sm(lt / 3)), roll: lerp(0, .08, sm(lt / 4)), bYaw: -.2, who: 'damien', ex: EX, key: 'cuD', ticks });
  renderHead(R, TINTA, { L: { d: nrm2([1, -.25]), z: .15 }, bust: true, feats: false, ex: EX });
  goldMotes([[-300, 300], [100, 380], [400, 320]], 41.5, t, 22, 240);
  snow(t, 25, 1.4, .8);
}

const SHOTS = [
  { t0: 0, t1: 7, draw: (t, k) => shotWide(t, k, { k: 3.2, dx: -80, key: 'a', moon: [-330, -250, 62], anX: tt => lerp(260, 230, sm((tt - 4) / 2)), anamiKneel: () => 0, dmHand: tt => [22, -30 + 4 * Math.sin(tt * 2)], anHand: () => [12, -36] }) },
  { t0: 7, t1: 14, draw: shotAnami },
  { t0: 14, t1: 23, draw: shotKneel },
  { t0: 23, t1: 33, draw: shotHands },
  { t0: 33, t1: 42, draw: (t, k) => shotWide(t, k, { k: 3.2, dx: -80, key: 'c', moon: [-330, -250, 62], anX: () => 120, anamiKneel: () => 1, dmHand: () => [30, -34], anHand: () => [30, -34] }) },
  { t0: 42, t1: 48, draw: shotDamien },
];
const SUBS = [
  [17.6, 19.8, 'Te perdono.', 'Anami'],
  [20.3, 22.6, '¿Por qué?', 'Damien'],
  [23.4, 26.6, 'Porque ella vale más que mi odio.', 'Anami'],
];
function drawScene(t, ticks) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  const sh = SHOTS.find(s => t >= s.t0 && t < s.t1);
  if (sh) sh.draw(t, ticks);
  else {   // cartela final
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(PAPER, 0, 0); L0s();
    const a = win(t, 48.3, 52, 1, 1.2);
    label('El Juramento Roto', 0, -30, { size: 64, it: false, col: `rgba(40,30,32,${.9 * a})` });
    label('Ep. III · «Te perdono» — escena rehecha con el motor nuevo', 0, 30, { size: 30, col: `rgba(90,60,60,${.85 * a})` });
  }
  /* cortes con fundido corto al papel */
  for (const s of SHOTS) { const d = Math.min(Math.abs(t - s.t0), Math.abs(t - s.t1)); if (d < .35) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = (1 - d / .35) * .55; ctx.fillStyle = 'rgb(18,16,22)'; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; } }
  for (const [a, b, txt, who] of SUBS) subtitle(txt, win(t, a, b, .35, .4), who);
  const fin = sm((t - 47.2) / 1.1) * (1 - sm((t - 48.3) / .01)); if (fin > 0 && t < 48.3) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = fin; ctx.drawImage(PAPER, 0, 0); ctx.globalAlpha = 1; }
  T0();
}
