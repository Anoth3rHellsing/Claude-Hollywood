/* =====================================================================
   CINE · utilidades comunes de las escenas hechas con el motor nuevo
   (cielo, luna, nieve, farol, porche a escala, poses, hilos, motas, reproductor)
   ===================================================================== */
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
function lantern(x, gy, k, on = 1) {   // farol a escala: la caja queda por encima de la cabeza (≈ 1,15 alturas)
  const s = k / 2.6, y = gy - 118 * k, warm = '255,206,130';
  if (on > .01) { for (const [r, a] of [[260, .1], [150, .14], [70, .2]]) { const g = ctx.createRadialGradient(x, y, 0, x, y, r * s); g.addColorStop(0, `rgba(${warm},${a * on})`); g.addColorStop(1, `rgba(${warm},0)`); ctx.fillStyle = g; ctx.fillRect(x - r * s, y - r * s, r * 2 * s, r * 2 * s); } }
  ctx.fillStyle = 'rgb(16,14,18)';
  ctx.fillRect(x - 4 * s, y + 22 * s, 8 * s, gy - y + 600);
  ctx.beginPath(); ctx.moveTo(x - 22 * s, y - 26 * s); ctx.lineTo(x + 22 * s, y - 26 * s); ctx.lineTo(x, y - 44 * s); ctx.closePath(); ctx.fill();
  ctx.fillRect(x - 20 * s, y + 18 * s, 40 * s, 7 * s);
  if (on > .01) paperLight([x, y - 2 * s], 13 * s, on);
  ctx.strokeStyle = 'rgb(16,14,18)'; ctx.lineWidth = 3.4 * s; ctx.strokeRect(x - 17 * s, y - 24 * s, 34 * s, 44 * s); ctx.beginPath(); ctx.moveTo(x, y - 24 * s); ctx.lineTo(x, y + 20 * s); ctx.stroke();
  return [x, y];
}
/* porche: tejado, postes, barandilla, suelo de tablas, escalones y nieve */
function porch(gy, k, o = {}) {   // a escala de los personajes: techo ≈ 1,5 alturas, postes cada ≈ 2,6 alturas
  const ink = 'rgb(18,16,22)', top = Math.max(-560, gy - 150 * k), sp = 260 * k, x0 = o.x0 ?? 0;
  ctx.fillStyle = 'rgba(20,18,26,.95)'; ctx.fillRect(-SW / 2, top - 200, SW, 200);
  if (o.snow !== false) { ctx.fillStyle = 'rgba(232,228,214,.85)'; ctx.beginPath(); ctx.moveTo(-SW / 2, top); for (let x = -SW / 2; x <= SW / 2; x += 40) ctx.lineTo(x, top + 4 + N2(x * .01, 3) * 5); ctx.lineTo(SW / 2, top); ctx.closePath(); ctx.fill(); }
  const fx = x0 + (o.facade ?? .55) * sp;
  ctx.fillStyle = 'rgba(26,24,33,.97)'; ctx.fillRect(fx, top, SW, gy - top);
  const wx = fx + .35 * sp, ww = .42 * k * 100 * .55, wh = .62 * k * 100 * .55;
  ctx.fillStyle = `rgba(255,196,120,${o.window ?? .35})`; ctx.fillRect(wx, gy - 105 * k, ww, wh); ctx.fillStyle = ink; ctx.fillRect(wx + ww / 2 - 3, gy - 105 * k, 6, wh); ctx.fillRect(wx, gy - 105 * k + wh * .45, ww, 6);
  for (let px = x0 - 2 * sp; px < SW / 2 + sp; px += sp) { if (px > fx - 10 && px < fx + 20) continue; ctx.fillStyle = ink; ctx.fillRect(px - 3 * k, top, 6 * k, gy - top); }
  const rh = gy - 34 * k; ctx.strokeStyle = ink; ctx.lineWidth = 2 * k;
  const railEnd = x0 - 1.2 * sp; ctx.beginPath(); ctx.moveTo(-SW / 2, rh); ctx.lineTo(railEnd, rh); ctx.stroke();
  ctx.lineWidth = k; for (let x = -SW / 2 + 10; x < railEnd; x += 10 * k) { ctx.beginPath(); ctx.moveTo(x, rh); ctx.lineTo(x, gy); ctx.stroke(); }
  ctx.fillStyle = 'rgba(34,28,30,.95)'; ctx.fillRect(-SW / 2, gy, SW, 520 - gy);
  ctx.strokeStyle = 'rgba(80,66,60,.5)'; ctx.lineWidth = 2; for (let i = 1; i < 6; i++) { const y = gy + i * i * 7; ctx.beginPath(); ctx.moveTo(-SW / 2, y); ctx.lineTo(SW / 2, y); ctx.stroke(); }
  if (o.snow !== false) { ctx.fillStyle = 'rgba(236,232,220,.8)'; ctx.beginPath(); ctx.moveTo(-SW / 2, gy + 2); for (let x = -SW / 2; x <= railEnd; x += 30) ctx.lineTo(x, gy - 3 - Math.abs(N2(x * .02, 1)) * 8); ctx.lineTo(railEnd, gy + 10); ctx.lineTo(-SW / 2, gy + 10); ctx.fill(); }
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

function bokehBG(t, green, warmX = -500) {
  nightSky(green);
  for (let i = 0; i < 9; i++) { const x = -SW / 2 + rnd01(i * 3.3) * SW, y = -380 + rnd01(i * 7.7) * 520, r = 30 + rnd01(i) * 70; ctx.fillStyle = `rgba(255,${200 + rnd01(i * 2) * 30},140,${.07 + rnd01(i * 5) * .08})`; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
  const g = ctx.createRadialGradient(warmX, -150, 0, warmX, -150, 700); g.addColorStop(0, 'rgba(255,200,130,.22)'); g.addColorStop(1, 'rgba(255,200,130,0)'); ctx.fillStyle = g; ctx.fillRect(-SW / 2, -500, SW, 1000);
}

/* ---------- más poses y piezas ---------- */
function sitJ(o = {}) {   // sentado en el escalón: cadera baja, rodillas arriba, manos sobre las rodillas
  const Hp = [0, -16], lean = .08 + (o.lean || 0), u = [Math.sin(lean), -Math.cos(lean)], r = [Math.cos(lean), Math.sin(lean)];
  const tp = (a, b) => [Hp[0] + r[0] * a + u[0] * b, Hp[1] + r[1] * a + u[1] * b];
  const F1 = [21, 0], F2 = [27, 0], K1 = ik2(Hp, F1, 24, 25, -1).E, K2 = ik2(Hp, F2, 24, 25, -1).E;
  const Sn = tp(1.5, 27.5), Sf = tp(-1.2, 28), A = ik2(Sn, o.hand || add(K2, [-2, -3]), 14.5, 13.5, 1), B = ik2(Sf, o.handF || add(K1, [-4, -2]), 14.5, 13.5, 1);
  return { Hp, lean, K1, F1, K2, F2, Sn, En: A.E, Wn: A.W, Sf, Ef: B.E, Wf: B.W, t: o.t || 0 };
}
function figW(J, o) { return dressBody(J, { k: o.k, x0: o.x, y0: o.y, who: o.who, key: o.key, ticks: o.ticks, flip: o.flip, nearPose: o.nearPose, farPose: o.farPose, ex: o.ex, pitch: o.pitch || 0, yawAdd: o.yawAdd || 0, capeStiff: o.capeStiff, wand: o.wand }); }
function skyGrad(top, bot, a = .92) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(PAPER, 0, 0); T0();
  const g = ctx.createLinearGradient(0, -500, 0, 500); g.addColorStop(0, `rgba(${top},${a})`); g.addColorStop(1, `rgba(${bot},${a})`);
  ctx.fillStyle = g; ctx.fillRect(-SW / 2, -500, SW, 1000);
  if (!TINTA.tex) TINTA.tex = ctx.createPattern(WASHTEX, 'repeat');
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = .4; ctx.fillStyle = TINTA.tex; ctx.fillRect(-SW / 2, -500, SW, 1000); ctx.restore();
}
function fullInvert() { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'difference'; ctx.fillStyle = 'rgb(239,230,210)'; ctx.fillRect(0, 0, W, H); ctx.restore(); T0(); }
function sun(x, y, r, col, a = 1) { const g = ctx.createRadialGradient(x, y, 0, x, y, r * 4); g.addColorStop(0, `rgba(${col},${.5 * a})`); g.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = g; ctx.fillRect(x - r * 4, y - r * 4, r * 8, r * 8); paperLight([x, y], r, a); }
/* gotas de sangre (tinta roja) que caen y se funden */
function bloodDrops(pts, target, t0, t, col = '176,24,38') {
  const f = clamp((t - t0) / .9);
  pts.forEach((p, i) => { const q = L2(p, target, eio(f)), r = 9 * (1 - f * .3); if (f < 1) { ctx.fillStyle = `rgb(${col})`; ctx.beginPath(); ctx.moveTo(q[0], q[1] - r * 1.8); ctx.quadraticCurveTo(q[0] + r, q[1], q[0], q[1] + r); ctx.quadraticCurveTo(q[0] - r, q[1], q[0], q[1] - r * 1.8); ctx.fill(); } });
  if (f >= 1) inkBloom(target, 18 + 26 * sm((t - t0 - .9) / .8), col, .9 * (1 - sm((t - t0 - 2.5) / 1.5)), 4);
}
/* grieta de tinta que parte el papel de arriba abajo */
function inkCrack(x, prog, a = 1) {
  if (prog <= 0) return; const pts = [], rr = mulberry32(31);
  for (let y = -520; y <= 520; y += 34) pts.push([x + (rr() - .5) * 46 + Math.sin(y * .02) * 14, y]);
  const n = Math.max(2, Math.round(pts.length * prog)), sp = pts.slice(0, n);
  ctx.strokeStyle = `rgba(16,12,16,${a})`; ctx.lineWidth = 14; ctx.lineJoin = 'miter'; ctx.stroke(linePath(sp));
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = paperPat(); ctx.lineWidth = 4; ctx.stroke(linePath(sp)); ctx.restore();
  for (let i = 2; i < n; i += 3) { const p = sp[i], d = (i % 2 ? 1 : -1); ctx.strokeStyle = `rgba(16,12,16,${a * .8})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(...p); ctx.lineTo(p[0] + d * (20 + rr() * 30), p[1] + 10 + rr() * 20); ctx.stroke(); }
}
/* primer plano de manos, grandes: los antebrazos solo asoman desde los bordes */
function bigHands(t, o) {
  const meet = eio(clamp((t - o.t0 - (o.delay ?? 1.2)) / 2.6)), clasp = sm((t - o.tClasp) / .8);
  const S = TINTA; SC.sil = false;
  const L = { d: nrm2([-.6, -1]), z: .1 }, s = 400, c = o.c || [0, 20];
  const dW = L2([-900, -480], [c[0] - 270, c[1] - 120], meet), aW = L2([900, 520], [c[0] + 270, c[1] + 150], meet);
  const dA = Math.atan2(c[1] - dW[1], c[0] - dW[0]), aA = Math.atan2(c[1] - aW[1], c[0] - aW[0]);
  const Ha = handRig({ x: aW[0], y: aW[1], s, ang: aA, flip: true, pose: mixHP(HPOSE.alcanzar, HPOSE.puño, clasp * .85) });
  const Hd = handRig({ x: dW[0], y: dW[1], s, ang: dA, pose: mixHP(HPOSE.alcanzar, HPOSE.varita, clasp) });
  const ring = (W_, ang) => add(W_, [Math.cos(ang), Math.sin(ang)], -42);
  const gold = o.tGold ? sm((t - o.tGold) / 3) : 0;
  thread(ring(dW, dA), ring(aW, aA), t, { gold, from: .5, vein: (o.vein ?? 1) * (1 - clasp * .6), sag: lerp(220, 50, meet), w: 10, a: o.threadA ?? 1 });
  const cuff = (W_, ang, house) => { const d = [Math.cos(ang), Math.sin(ang)], e = add(W_, d, -76); SC.house = house; S.fill([capsulePts(add(e, d, -900), e, 150, 112, 5)], 'cloth'); S.trim([[add(e, perp(d), 112), add(e, perp(d), -112)]], house, 9); };
  SC.house = o.houseA || 'G'; renderHand(Ha, S, { L, sep: true }); cuff(aW, aA, o.houseA || 'G');
  SC.house = o.houseD || 'R'; renderHand(Hd, S, { L, sep: true }); cuff(dW, dA, o.houseD || 'R');
  for (const [W_, ang] of [[dW, dA], [aW, aA]]) { const cc = ring(W_, ang), gc = [lerp(176, 236, gold), lerp(24, 192, gold), lerp(38, 96, gold)].map(Math.round).join(','); ctx.strokeStyle = `rgb(${gc})`; ctx.lineWidth = 11; ctx.beginPath(); ctx.ellipse(cc[0], cc[1], 17, 52, ang, 0, TAU); ctx.stroke(); }
  if (o.tGold && t > o.tGold) { paperLight(c, 46 * sm((t - o.tGold) / .6) * (1 - sm((t - o.tGold - 2) / 2)) + 2, 1 - sm((t - o.tGold - 2.5) / 2)); goldMotes([c, add(c, [-90, -10]), add(c, [90, 30])], o.tGold + .2, t, 30, 180); }
}

/* ---------- reproductor de película: FILM = {DUR, SHOTS, SUBS, CARDS, wind(t), drone(t), CHORDS, EVENTS, end(t)} ---------- */
function drawFilm(t, ticks) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; SHX = SHY = 0;
  const sh = FILM.SHOTS.find(s => t >= s.t0 && t < s.t1);
  if (sh) sh.draw(t, ticks, t - sh.t0); else FILM.end(t);
  for (const s of FILM.SHOTS) { const d = Math.min(Math.abs(t - s.t0), Math.abs(t - s.t1)); if (d < (s.cut ?? .3)) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = (1 - d / (s.cut ?? .3)) * .6; ctx.fillStyle = 'rgb(16,14,20)'; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; } }
  for (const [a, b, txt, who] of FILM.SUBS) subtitle(txt, win(t, a, b, .35, .4), who);
  for (const [a, b, txt, pos] of (FILM.CARDS || [])) { const al = win(t, a, b, .5, .5); if (al > .01) { ctx.save(); L0s(); ctx.globalAlpha = al; ctx.font = '600 30px "Cormorant Garamond", Georgia, serif'; ctx.textAlign = pos === 'c' ? 'center' : 'left'; ctx.fillStyle = 'rgba(244,236,218,.9)'; ctx.shadowColor = 'rgba(0,0,0,.8)'; ctx.shadowBlur = 10 * U; ctx.fillText(txt.toUpperCase(), pos === 'c' ? 0 : -SW / 2 + 60, pos === 'c' ? 0 : -420); ctx.restore(); } }
  T0();
}
