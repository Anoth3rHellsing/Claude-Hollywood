/* =====================================================================
   PESTAÑAS, CONTROLES Y BUCLE
   ===================================================================== */
const RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
const ST = {
  tab: 'rostro', who: 'joy', style: 'tinta', boil: true,
  rostro: { ex: 'neutral', feats: 'sin', fin: 'lavado', yaw: 35, pitch: 0, roll: 0, anim: !RM, az: 35, lz: .15, vol: false },
  manos: { pose: 'varita', anim: !RM, sep: true, fin: 'lavado', ang: -15, az: 60 },
  cuerpo: { fps: 12, crouch: .6, bones: false, fin: 'silueta' },
  estilos: { anim: !RM, ex: 'decidida', feats: 'sin' },
  efectos: { kind: 'ataque', slow: false },
  fisica: { auto: true, power: 2.6, fin: 'silueta', fps: 60, bones: false },
};
const deg = d => d * PI / 180;
let curEx = { ...EXPR.neutral };
function exStep(target, dt) { const k = 1 - Math.exp(-dt * 6), e = EXPR[target]; for (const key in e) curEx[key] = lerp(curEx[key], e[key], k); }
const lightOf = (az, lz) => ({ d: [Math.cos(deg(az)), -Math.sin(deg(az))], z: lz });
function label(txt, x, y, o = {}) {
  ctx.font = `${o.it === false ? '' : 'italic '}${o.size || 26}px "Cormorant Garamond", Georgia, serif`;
  ctx.textAlign = o.align || 'center'; ctx.fillStyle = o.col || 'rgba(40,30,32,.78)'; ctx.fillText(txt, x, y);
}
function lightGlyph(cx, cy, L, r) {
  const p = [clamp(cx + L.d[0] * r, -SW / 2 + 60, SW / 2 - 60), clamp(cy + L.d[1] * r, -440, 400)], back = L.z < 0;
  ctx.strokeStyle = 'rgba(150,96,40,.75)'; ctx.fillStyle = back ? 'rgba(240,182,72,.25)' : 'rgba(240,182,72,.85)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(p[0], p[1], 15, 0, TAU); ctx.fill(); ctx.stroke();
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; ctx.beginPath(); ctx.moveTo(p[0] + Math.cos(a) * 21, p[1] + Math.sin(a) * 21); ctx.lineTo(p[0] + Math.cos(a) * 29, p[1] + Math.sin(a) * 29); ctx.stroke(); }
  label(back ? 'luz (detrás)' : L.z > .6 ? 'luz (delante)' : 'luz', p[0], p[1] + 54, { size: 22 });
}

/* ---------- ROSTRO ---------- */
function drawRostro(t, ticks) {
  const o = ST.rostro, S = STYLES[ST.style]; SC.sil = ST.style === 'tinta' && o.fin === 'silueta'; SC.boil = ST.boil; SC.t = t;
  S.bg({ moon: [560, -270, 100] });
  const yaw = o.anim ? Math.sin(t * .55) * 1.05 + .08 * Math.sin(t * 1.7) : deg(o.yaw);
  const pitch = deg(o.pitch) + (o.anim ? .07 * Math.sin(t * .8) : 0), roll = deg(o.roll);
  const R = headRig({ x: -150, y: -20, s: 175, yaw, pitch, roll, bYaw: yaw * .35, who: ST.who, ex: curEx, key: 'rostro', ticks });
  const L = lightOf(o.az, o.lz);
  renderHead(R, S, { L, bust: true, feats: o.feats === 'min', ex: curEx });
  if (o.vol) {
    const v = R.vol, ln = (pts, c) => { ctx.strokeStyle = c; ctx.lineWidth = 2.4; ctx.setLineDash([9, 6]); ctx.stroke(pathOf([pts], false)); ctx.setLineDash([]); };
    ln(v.skull, 'rgba(40,110,200,.9)'); ln(v.jaw, 'rgba(200,40,50,.9)'); ln(v.keel, 'rgba(30,140,80,.95)'); ln(v.nose, 'rgba(230,140,20,.95)');
    ctx.fillStyle = '#222'; ctx.beginPath(); ctx.arc(R.pivot[0], R.pivot[1], 6, 0, TAU); ctx.fill();
    const lg = [['cráneo (elipsoide)', 'rgba(40,110,200,.95)'], ['mandíbula (envolvente)', 'rgba(200,40,50,.95)'], ['quilla del perfil', 'rgba(30,140,80,.95)'], ['nariz', 'rgba(230,140,20,.95)']];
    lg.forEach(([n, c], i) => { ctx.fillStyle = c; ctx.fillRect(-SW / 2 + 40, -440 + i * 36, 26, 6); label(n, -SW / 2 + 80, -430 + i * 36, { align: 'left', size: 24, it: false }); });
  }
  lightGlyph(-150, -120, L, 430);
  /* tira de comparación a escala de plano medio */
  const x0 = 470, y0 = 330; SC.sil = ST.style === 'tinta';
  label('plano medio: frente · ¾ · perfil', x0 + 70, y0 - 60, { size: 22 });
  [-0.02, .8, 1.45].forEach((yw, i) => {
    const r = headRig({ x: x0 - 60 + i * 130, y: y0 + 40, s: 34, yaw: yw, pitch: 0, roll: 0, bYaw: yw * .35, who: ST.who, ex: EXPR.neutral, key: 'mini' + i, ticks });
    renderHead(r, S, { L, bust: true, feats: false, ex: EXPR.neutral, rim: false });
  });
  SC.sil = false;
}

/* ---------- MANOS ---------- */
const PORDER = ['abierta', 'relajada', 'puño', 'señalar', 'varita', 'garra', 'alcanzar'];
function drawManos(t) {
  const o = ST.manos, S = STYLES[ST.style]; SC.sil = ST.style === 'tinta' && o.fin === 'silueta'; SC.boil = ST.boil; SC.t = t;
  S.bg({});
  let pose, name, wand;
  if (o.anim) { const per = 1.9, i = Math.floor(t / per) % PORDER.length, j = (i + 1) % PORDER.length, f = eio(clamp((t / per % 1 - .55) / .45)); pose = mixHP(HPOSE[PORDER[i]], HPOSE[PORDER[j]], f); name = f < .5 ? PORDER[i] : PORDER[j]; wand = name === 'varita'; }
  else { pose = HPOSE[o.pose]; name = o.pose; wand = o.pose === 'varita'; }
  const L = lightOf(o.az, .1);
  const Hd = handRig({ x: -260, y: 60, s: 500, ang: deg(o.ang), pose, wand });
  renderHand(Hd, S, { L, sep: o.sep });
  label(HPN[name], -170, -380, { size: 40 });
  lightGlyph(-60, 40, L, 400);
  /* escala real de película */
  const bx = 600, by = 120; SC.sil = ST.style === 'tinta';
  ctx.strokeStyle = 'rgba(40,30,32,.35)'; ctx.lineWidth = 1.5; ctx.strokeRect(bx - 170, by - 170, 340, 360);
  label('a escala de película', bx, by - 190, { size: 22 });
  const m = mittenRig({ x: bx - 90, y: by - 40, s: 30, ang: deg(o.ang) });
  S.fill(m.all, 'ink'); label('antes', bx - 90, by + 20, { size: 20 });
  const h2 = handRig({ x: bx + 50, y: by - 40, s: 30, ang: deg(o.ang), pose, wand });
  renderHand(h2, S, { L, sep: o.sep, rim: false }); label('ahora', bx + 70, by + 20, { size: 20 });
  const h3 = handRig({ x: bx - 60, y: by + 110, s: 75, ang: deg(o.ang), pose, wand });
  renderHand(h3, S, { L, sep: o.sep, rim: false }); label('plano medio', bx, by + 175, { size: 20 });
  SC.sil = false;
}

/* ---------- CUERPO ---------- */
const FIGS = [{ x0: -430, key: 'f60', cache: null, fq: -1, acc: 0 }, { x0: 330, key: 'f12', cache: null, fq: -1, acc: 0 }];
let DRAG = null;
function drawCuerpo(t, ticks) {
  const o = ST.cuerpo, S = STYLES[ST.style]; SC.sil = ST.style === 'tinta' && o.fin === 'silueta'; SC.boil = ST.boil; SC.t = t;
  const gy = 330, k = 5.1;
  S.bg({ moon: [0, -300, 80], ground: gy });
  const L = { d: nrm2([.15, -1]), z: -.5 };
  FIGS.forEach((F, i) => {
    const q = i === 0 ? t : Math.floor(t * o.fps) / o.fps, fr = Math.floor(t * o.fps);
    F.acc += ticks;
    if (i === 1 && F.cache && fr === F.fq) return renderFig(F.cache, S, L, o, i);
    const tg = DRAG ? [(DRAG[0] - F.x0) / k, (DRAG[1] - gy) / k] : [24 + 13 * Math.sin(q * .9), -64 + 22 * Math.sin(q * 1.3 + 1)];
    const ck = o.crouch * Math.pow(Math.sin(q * .7) * .5 + .5, 2);
    const B = bodyRig({ x0: F.x0, y0: gy, k, t: q, target: tg, hy: 47.5 - ck * 11, crouchK: ck, who: ST.who, key: F.key, ticks: i === 0 ? ticks : Math.min(8, F.acc), yawAdd: 0 });
    F.acc = 0; F.fq = fr; F.cache = B;
    renderFig(B, S, L, o, i);
  });
  label('60 FPS · suave', FIGS[0].x0, gy + 80, { size: 30 });
  label(`${o.fps} FPS · en ${o.fps === 12 ? 'doses' : 'treses'}`, FIGS[1].x0, gy + 80, { size: 30 });
  label(DRAG ? '' : 'arrastra sobre el lienzo para mover la mano', 0, gy + 140, { size: 22 });
}
function renderFig(B, S, L, o, i) {
  const house = B.head.house, all = [];
  SC.anchor = B.X([0, -50]); SC.house = house;
  B.parts.forEach((p, i) => {
    if (p.hand) renderHand(p.hand, S, { L, sep: true, rim: false }); else { S.fill(p.polys, p.k); if (p.trimLine) S.trim([p.trimLine], house, 4); }
    all.push(...p.polys);
    if (i === 0 && B.head.back.length) { S.fill(B.head.back, 'hair'); SC.anchor = B.X([0, -50]); }   // el pelo cae sobre la capa
  });
  renderHead(B.head, S, { L, bust: false, feats: false, ex: EXPR.neutral, rim: false, noBack: true });
  all.push(...B.head.headU, ...B.head.cap, ...B.head.front, ...B.head.mid, ...B.head.back);
  for (const p of B.near) { if (p.hand) renderHand(p.hand, S, { L, sep: true, rim: false }); else S.fill(p.polys, p.k); all.push(...p.polys); }
  S.rim(all, L.d, 6, SC.sil ? .7 : .4);
  if (o.bones && B.bones) {
    ctx.strokeStyle = 'rgba(204,42,46,.9)'; ctx.lineWidth = 3; ctx.fillStyle = 'rgba(204,42,46,.9)';
    for (const c of B.bones) { ctx.stroke(linePath(c)); for (const p of c) { ctx.beginPath(); ctx.arc(p[0], p[1], 5, 0, TAU); ctx.fill(); } }
  }
  const tg = B.target; if (!tg) return; ctx.strokeStyle = 'rgba(176,24,38,.8)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(tg[0], tg[1], 12, 0, TAU); ctx.moveTo(tg[0] - 20, tg[1]); ctx.lineTo(tg[0] + 20, tg[1]); ctx.moveTo(tg[0], tg[1] - 20); ctx.lineTo(tg[0], tg[1] + 20); ctx.stroke();
}


/* ---------- FÍSICA: ragdoll activo contra una pared ---------- */
const FIS = { rd: null, t0: 0, hit: false, shake: 0, cast: -9, impactsSeen: 0 };
function fisReset(t) { FIS.rd = ragdollNew(0); FIS.t0 = t; FIS.hit = false; FIS.cast = -9; }
function drawFisica(t, ticks) {
  const o = ST.fisica, S = STYLES[ST.style]; SC.sil = ST.style === 'tinta' && o.fin === 'silueta'; SC.boil = ST.boil; SC.t = t;
  const gy = 330, k = 5.1, vx0 = -60, ax0 = 600, wallF = -78, wallX = vx0 + wallF * k;
  if (!FIS.rd || t < FIS.t0) fisReset(t);
  let ph = t - FIS.t0;
  if (ph > 11.5 && o.auto) { const keep = FIS.t0 + 11.5; fisReset(keep); ph -= 11.5; }
  /* temblor de cámara tras el choque */
  FIS.shake *= Math.pow(.86, ticks || 0);
  SHX = (Math.sin(t * 71) * FIS.shake * 14) * U; SHY = (Math.cos(t * 53) * FIS.shake * 9) * U;
  S.bg({ moon: [180, -300, 70], ground: gy });
  /* pared de piedra */
  T0(); const wp = [[-SW / 2 - 40, -520], [wallX, -520], [wallX + N2(1, 2) * 3, gy], [-SW / 2 - 40, gy]];
  SC.anchor = [wallX, 0]; S.fill([wp], SC.sil ? 'ink' : 'stone');
  ctx.strokeStyle = SC.sil ? 'rgba(239,230,210,.12)' : 'rgba(239,230,210,.22)'; ctx.lineWidth = 2;
  for (let r = 0; r < 12; r++) { const y = -500 + r * 70; ctx.beginPath(); ctx.moveTo(-SW / 2, y); ctx.lineTo(wallX - 4, y + N2(r, 1) * 5); ctx.stroke(); for (let c = 0; c < 4; c++) { const x = wallX - 30 - c * 140 - (r % 2) * 70; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 3, y + 70); ctx.stroke(); } }
  /* atacante: levanta la varita, lanza, vuelve */
  const att = ST.who === 'damien' ? 'anami' : 'damien';
  const raise = sm((ph - 1.0) / .6) * (1 - sm((ph - 3.2) / .8));
  const tgA = [lerp(10, 30, raise), lerp(-26, -74, raise)];
  const A = bodyRig({ x0: ax0, y0: gy, k, t, target: tgA, hy: 47.5, crouchK: .15 * raise, who: att, key: 'fa', ticks, yawAdd: 0, flip: true, wand: true }); A.target = null;
  /* víctima */
  const rd = FIS.rd;
  if (!FIS.hit && ph >= 2.05) { FIS.hit = true; ragdollHit(rd, t, -1, o.power); }
  const J = ragdollStep(rd, t, ticks, { wall: wallF, onImpact: v => { FIS.shake = Math.min(1, FIS.shake + v / 5); } });
  const muscleLow = rd.muscle < .5;
  const V = dressBody(J, { k, x0: vx0, y0: gy, who: ST.who, key: 'fv', ticks, flip: false, nearPose: muscleLow ? HPOSE.abierta : HPOSE.relajada, farPose: muscleLow ? HPOSE.abierta : HPOSE.relajada, ex: EXPR.neutral, capeStiff: .17 });
  const L = { d: nrm2([.2, -1]), z: -.5 };
  renderFig(V, S, L, {}, 0);
  renderFig(A, S, L, {}, 1);
  /* impacto: polvo claro que se abre y astillas oscuras que salen despedidas (sugerido, nunca gráfico) */
  for (const im of rd.impacts) {
    const age = t - im.t, pw = Math.min(1.4, im.v / 2), cx = wallX, cy = gy + im.y * k, rr = mulberry32(Math.floor(im.t * 1000) + 7);
    const puff = 1 - sm(age / 1.6);
    for (let i = 0; i < 7; i++) { const an = (rr() - .5) * 2.2, d = (18 + rr() * 50) * eio(Math.min(1, age / .7)) * pw, rad = (14 + rr() * 22) * (0.5 + age) * pw, x = cx + 6 + Math.cos(an) * d, y = cy + Math.sin(an) * d - age * 18;
      const g = ctx.createRadialGradient(x, y, 0, x, y, rad); g.addColorStop(0, `rgba(226,214,190,${.55 * puff})`); g.addColorStop(1, 'rgba(226,214,190,0)'); ctx.fillStyle = g; ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2); }
    ctx.fillStyle = `rgba(20,16,20,${1 - sm(age / 1.2)})`;
    for (let i = 0; i < 9; i++) { const an = (rr() - .5) * 2.4, sp = (60 + rr() * 140) * pw, x = cx + 4 + Math.cos(an) * sp * age, y = cy + Math.sin(an) * sp * age + 260 * age * age, r = 2 + rr() * 4;
      if (y < gy) { ctx.beginPath(); ctx.moveTo(x - r, y); ctx.lineTo(x, y - r * 1.3); ctx.lineTo(x + r, y + r * .4); ctx.closePath(); ctx.fill(); } }
  }
  /* hechizo: destello en la punta y trazo hasta el pecho */
  if (A.wandTip) {
    const [x, y] = A.wandTip, hc = HOUSES[A.head.house];
    const glow = sm((ph - 1.4) / .4) * (1 - sm((ph - 2.2) / .3));
    if (glow > .01) { const r = 40 + 30 * glow, g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(255,244,214,${glow})`); g.addColorStop(.35, `rgba(${hc.g},${.6 * glow})`); g.addColorStop(1, `rgba(${hc.c},0)`); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
    const f = clamp((ph - 1.8) / .25), fade = 1 - sm((ph - 2.05) / .35);
    if (ph > 1.8 && fade > .01) {
      const tx = vx0 + 3 * k, ty = gy - 75 * k, hx = lerp(x, tx, f), hy = lerp(y, ty, f), tx0 = lerp(x, tx, Math.max(0, f - .35)), ty0 = lerp(y, ty, Math.max(0, f - .35));
      ctx.lineCap = 'round'; ctx.strokeStyle = `rgba(${hc.g},${.9 * fade})`; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(tx0, ty0); ctx.lineTo(hx, hy); ctx.stroke();
      ctx.strokeStyle = `rgba(255,248,230,${fade})`; ctx.lineWidth = 2.5; ctx.stroke();
      if (f >= 1) { const r = 90 * (1 - fade) + 20, g = ctx.createRadialGradient(tx, ty, 0, tx, ty, r); g.addColorStop(0, `rgba(255,244,214,${fade})`); g.addColorStop(1, `rgba(${hc.c},0)`); ctx.fillStyle = g; ctx.fillRect(tx - r, ty - r, r * 2, r * 2); }
    }
  }
  if (o.bones) {
    ctx.strokeStyle = 'rgba(204,42,46,.9)'; ctx.fillStyle = 'rgba(204,42,46,.9)'; ctx.lineWidth = 3; const X = V.X;
    for (const [a, b, , kind] of RBONES) { if (kind) continue; ctx.beginPath(); ctx.moveTo(...X(rd.p[a])); ctx.lineTo(...X(rd.p[b])); ctx.stroke(); }
    for (const j of RJ) { ctx.beginPath(); ctx.arc(...X(rd.p[j]), 5, 0, TAU); ctx.fill(); }
  }
  label(`músculo ${Math.round(rd.muscle * 100)} %`, vx0 + 40, gy + 80, { size: 26 });
  SHX = SHY = 0;
}

/* ---------- ESTILOS ---------- */
function drawEstilos(t, ticks) {
  const o = ST.estilos, S = STYLES[ST.style]; SC.sil = false; SC.boil = ST.boil; SC.t = t;
  S.bg({ moon: [560, -250, 110], hz: 360 });
  const yaw = o.anim ? .62 + .32 * Math.sin(t * .5) : .7, pitch = o.anim ? .06 + .06 * Math.sin(t * .7) : .08;
  const R = headRig({ x: -360, y: -40, s: 165, yaw, pitch, roll: 0, bYaw: yaw * .4, who: ST.who, ex: curEx, key: 'est', ticks });
  const L = { d: nrm2([560 + 360, -250 + 160]), z: -.15 };
  renderHead(R, S, { L, bust: true, feats: o.feats === 'min', ex: curEx });
  const ha = -1.25 + (o.anim ? .1 * Math.sin(t * .9) : 0), wx = 200, wy = 250;
  SC.anchor = [wx, wy]; SC.house = CAST[ST.who].house;
  const hd = [Math.cos(ha), Math.sin(ha)], cuff = [wx - hd[0] * .03 * 290, wy - hd[1] * .03 * 290];   // la manga va encima y termina en la muñeca
  const Hd = handRig({ x: wx, y: wy, s: 290, ang: ha, pose: mixHP(HPOSE.varita, HPOSE.puño, o.anim ? .15 + .15 * Math.sin(t * 1.3) : .1), wand: true });
  renderHand(Hd, S, { L, sep: true });
  SC.anchor = [wx, wy]; S.fill([capsulePts(add(cuff, hd, -620), cuff, 95, 60, 5)], 'cloth');
  if (Hd.wandTip && o.style !== 'boceto') {
    const [x, y] = Hd.wandTip, r = 60 + 8 * Math.sin(t * 3), g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'rgba(255,240,200,.95)'); g.addColorStop(.3, 'rgba(240,182,72,.45)'); g.addColorStop(1, 'rgba(240,182,72,0)'); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
}

/* ---------- controles ---------- */
const PANEL = document.getElementById('panel'), HUD = document.getElementById('hud');
const CHARS = Object.fromEntries(Object.entries(CAST).map(([k, v]) => [k, v.name]));
const UI = {
  rostro: [
    ['seg', 'Personaje', () => ST, 'who', CHARS],
    ['seg', 'Expresión', o => o, 'ex', EXN],
    ['seg', 'Rasgos', o => o, 'feats', { sin: 'Sin rasgos', min: 'Rasgos mínimos' }],
    ['seg', 'Acabado (tinta)', o => o, 'fin', { lavado: 'Lavado con sombra', silueta: 'Silueta' }, () => ST.style === 'tinta'],
    ['tog', 'Girar sola', o => o, 'anim'],
    ['rng', 'Giro', o => o, 'yaw', -90, 90, 1, '°', o => !o.anim],
    ['rng', 'Cabeceo', o => o, 'pitch', -30, 30, 1, '°'],
    ['rng', 'Inclinación', o => o, 'roll', -25, 25, 1, '°'],
    ['rng', 'Dirección de la luz', o => o, 'az', 0, 360, 1, '°'],
    ['rng', 'Luz: contraluz ↔ de frente', o => o, 'lz', -1, 1, .01, ''],
    ['tog', 'Ver volúmenes', o => o, 'vol'],
  ],
  manos: [
    ['tog', 'Recorrer posturas', o => o, 'anim'],
    ['seg', 'Postura', o => o, 'pose', HPN, o => !o.anim],
    ['tog', 'Línea de papel entre dedos', o => o, 'sep'],
    ['seg', 'Acabado (tinta)', o => o, 'fin', { lavado: 'Lavado con sombra', silueta: 'Silueta' }, () => ST.style === 'tinta'],
    ['rng', 'Giro de muñeca', o => o, 'ang', -90, 60, 1, '°'],
    ['rng', 'Dirección de la luz', o => o, 'az', 0, 360, 1, '°'],
  ],
  cuerpo: [
    ['seg', 'Personaje', () => ST, 'who', CHARS],
    ['seg', 'Ritmo de la derecha', o => o, 'fps', { 12: '12 FPS', 8: '8 FPS' }],
    ['rng', 'Agacharse', o => o, 'crouch', 0, 1, .01, ''],
    ['seg', 'Acabado (tinta)', o => o, 'fin', { silueta: 'Silueta', lavado: 'Lavado' }, () => ST.style === 'tinta'],
    ['tog', 'Ver huesos', o => o, 'bones'],
  ],
  efectos: [
    ['seg', 'Hechizo', o => o, 'kind', { ataque: 'Ataque', escudo: 'Escudo', maldicion: 'Maldición' }],
    ['tog', 'Cámara lenta', o => o, 'slow'],
    ['seg', 'Personaje', () => ST, 'who', CHARS],
  ],
  fisica: [
    ['btn', 'Lanzar hechizo ahora', () => { FIS.t0 = TT - 1.0; FIS.hit = false; }],
    ['tog', 'Repetir solo', o => o, 'auto'],
    ['seg', 'Personaje', () => ST, 'who', CHARS],
    ['rng', 'Fuerza del golpe', o => o, 'power', 1, 5, .1, ''],
    ['seg', 'Acabado (tinta)', o => o, 'fin', { silueta: 'Silueta', lavado: 'Lavado' }, () => ST.style === 'tinta'],
    ['tog', 'Ver huesos', o => o, 'bones'],
  ],
  estilos: [
    ['seg', 'Personaje', () => ST, 'who', CHARS],
    ['seg', 'Expresión', o => o, 'ex', EXN],
    ['seg', 'Rasgos', o => o, 'feats', { sin: 'Sin rasgos', min: 'Rasgos mínimos' }],
    ['tog', 'Animar', o => o, 'anim'],
  ],
};
const NOTES = {
  rostro: 'La cabeza son cuatro volúmenes en 3D proyectados y unidos. La sombra es la misma forma menos una copia desplazada hacia la luz; la nariz proyecta su propia sombra y las cuencas de los ojos se oscurecen con la luz cenital. En «Sin rasgos», las cejas existen solo como el borde de esa sombra.',
  manos: 'Cinco dedos de tres falanges en vista lateral. La línea de papel entre piezas es lo que hace legible un puño en silueta: apágala para ver la diferencia. A escala de plano general la mano mide unos 30u, así que el detalle solo se nota de plano medio hacia dentro.',
  cuerpo: 'Las piernas se resuelven con IK de dos huesos: la cadera sube y baja y los pies no se mueven. La capa y el pelo son la misma tela con resorte, cortada distinto. Izquierda y derecha son el mismo personaje; la derecha solo cambia de pose 12 veces por segundo, como la animación dibujada a mano.',
  efectos: 'Arriba, los efectos de ahora: brillos y líneas de luz, el lenguaje de un videojuego. Abajo, hechos del mismo material que el resto: el hechizo es una pincelada, la luz es papel sin pintar, el impacto es una flor de tinta con un fotograma invertido, y cada tipo tiene su forma (puntas, ensō, zarcillo). Los de abajo van a 12 FPS.',
  fisica: 'Al recibir el hechizo, el «músculo» que sujeta la pose cae a cero: el cuerpo pasa a ser física pura (huesos como varillas, gravedad, suelo y pared), choca, y el músculo vuelve poco a poco hasta que se levanta. La capa y el pelo reaccionan solos porque son tela.',
  estilos: 'El mismo rig pintado con tres pasadas distintas; el selector de arriba cambia el estilo en todas las pestañas. El temblor de línea no es ruido por fotograma: son tres variantes fijas que se alternan a 8 FPS.',
};
const STYLE_ROW = [['seg', 'Estilo (todas las pestañas)', () => ST, 'style', { tinta: 'Tinta y acuarela', papel: 'Papel recortado', boceto: 'Boceto' }], ['tog', 'Temblor de línea (8 FPS)', () => ST, 'boil']];
function buildPanel() {
  PANEL.innerHTML = '';
  const o = ST[ST.tab];
  const note = document.createElement('p'); note.className = 'note'; note.textContent = NOTES[ST.tab]; PANEL.appendChild(note);
  for (const [type, lab, objF, key, a, b, c, unit, en] of [...STYLE_ROW, ...UI[ST.tab]]) {
    const obj = objF(o), row = document.createElement('div'); row.className = 'ctl';
    const id = `c-${ST.tab}-${key}`;
    if (type === 'btn') {
      const bt = document.createElement('button'); bt.type = 'button'; bt.className = 'act'; bt.id = `${id}-btn`; bt.textContent = lab; bt.onclick = () => objF(); row.appendChild(bt); PANEL.appendChild(row); continue;
    }
    if (type === 'seg') {
      const enabled = typeof a === 'function' ? true : (b ? b(o) : true);
      const opts = a, cond = typeof b === 'function' ? b : null;
      const h = document.createElement('div'); h.className = 'lab'; h.textContent = lab; row.appendChild(h);
      const g = document.createElement('div'); g.className = 'seg'; g.setAttribute('role', 'group'); g.setAttribute('aria-label', lab);
      for (const [v, n] of Object.entries(opts)) {
        const bt = document.createElement('button'); bt.type = 'button'; bt.textContent = n; bt.id = `${id}-${v}`;
        const val = typeof obj[key] === 'number' ? +v : v;
        bt.setAttribute('aria-pressed', String(obj[key] === val));
        if (cond && !cond(o)) bt.disabled = true;
        bt.onclick = () => { obj[key] = val; if (key === 'who') SPR.clear(); buildPanel(); };
        g.appendChild(bt);
      }
      row.appendChild(g);
    } else if (type === 'tog') {
      const l = document.createElement('label'); l.className = 'tog'; l.htmlFor = id;
      const i = document.createElement('input'); i.type = 'checkbox'; i.id = id; i.checked = !!obj[key];
      i.onchange = () => { obj[key] = i.checked; buildPanel(); };
      const sp = document.createElement('span'); sp.textContent = lab; l.append(i, sp); row.appendChild(l);
    } else {
      const [mn, mx, st] = [a, b, c];
      const h = document.createElement('label'); h.className = 'lab'; h.htmlFor = id;
      const out = document.createElement('output'); const fmt = v => (st < 1 ? (+v).toFixed(2) : v) + unit;
      h.textContent = lab + ' '; out.textContent = fmt(obj[key]); h.appendChild(out);
      const i = document.createElement('input'); i.type = 'range'; i.id = id; i.min = mn; i.max = mx; i.step = st; i.value = obj[key];
      if (en && !en(o)) i.disabled = true;
      i.oninput = () => { obj[key] = +i.value; out.textContent = fmt(i.value); };
      row.append(h, i);
    }
    PANEL.appendChild(row);
  }
  for (const b of document.querySelectorAll('.tabs button')) b.setAttribute('aria-selected', String(b.dataset.tab === ST.tab));
  cv.style.touchAction = ST.tab === 'cuerpo' ? 'none' : 'auto';
}
for (const b of document.querySelectorAll('.tabs button')) b.onclick = () => { ST.tab = b.dataset.tab; try { history.replaceState(null, '', '#' + ST.tab); } catch (e) { } buildPanel(); };
{ const h = (location.hash || '').slice(1); if (UI[h]) ST.tab = h; }
const toUnits = e => { const r = cv.getBoundingClientRect(); return [((e.clientX - r.left) / r.width * W - W / 2) / U, ((e.clientY - r.top) / r.height * H - H / 2) / U]; };
cv.addEventListener('pointerdown', e => { if (ST.tab !== 'cuerpo') return; DRAG = toUnits(e); cv.setPointerCapture(e.pointerId); });
cv.addEventListener('pointermove', e => { if (DRAG) DRAG = toUnits(e); });
const endDrag = () => { DRAG = null; };
cv.addEventListener('pointerup', endDrag); cv.addEventListener('pointercancel', endDrag);

/* ---------- bucle ---------- */
let LAST = performance.now(), ACC = 0, TT = 0, FROZEN = null, EMA = 0, HUDT = 0, FPS = 0;
function draw(t, ticks, dt) {
  const ex = ST.tab === 'estilos' ? ST.estilos.ex : ST.rostro.ex; exStep(ex, dt);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; T0();
  if (ST.tab === 'rostro') drawRostro(t, ticks);
  else if (ST.tab === 'manos') drawManos(t);
  else if (ST.tab === 'cuerpo') drawCuerpo(t, ticks);
  else if (ST.tab === 'fisica') drawFisica(t, ticks);
  else if (ST.tab === 'efectos') drawEfectos(t, ticks);
  else drawEstilos(t, ticks);
}
function frame(now) {
  const raw = (now - LAST) / 1000, dt = Math.min(.1, raw); LAST = now; if (raw > 0) FPS = FPS ? lerp(FPS, 1 / raw, .05) : 1 / raw;
  resize();
  if (FROZEN === null) TT += dt;
  ACC += dt; let ticks = Math.floor(ACC * 60); ACC -= ticks / 60; ticks = Math.min(ticks, 4);
  const t0 = performance.now(); draw(FROZEN ?? TT, FROZEN === null ? ticks : 0, dt); const ms = performance.now() - t0;
  EMA = EMA ? lerp(EMA, ms, .05) : ms;
  if (now - HUDT > 400) { HUDT = now; HUD.textContent = `${Math.round(FPS)} FPS · ${EMA.toFixed(1)} ms de dibujo · ${W}×${H}`; }
  requestAnimationFrame(frame);
}
GRAIN = makeGrain(); WASHTEX = makeWashTex(); HATCH = makeHatch(9, -.8, 1.3, 'rgba(52,50,62,.75)'); HATCH2 = makeHatch(5, -.8, 1.5, 'rgba(40,38,50,.9)');
resize(); buildPanel(); requestAnimationFrame(frame);
window.__lab = {
  ST, set(tab, patch = {}, glob = {}) { ST.tab = tab; Object.assign(ST[tab], patch); Object.assign(ST, glob); SPR.clear(); buildPanel(); },
  shot(t, warm = 90) { FROZEN = null; resize(); const st = t - warm / 60; for (let i = 0; i < warm; i++) draw(st + i / 60, 1, 1 / 60); FROZEN = t; draw(t, 0, 1 / 60); },
  perf(n = 60) { const a = []; for (let i = 0; i < n; i++) { const t0 = performance.now(); draw(i / 60, 1, 1 / 60); a.push(performance.now() - t0); } a.sort((x, y) => x - y); return { med: a[n >> 1], p95: a[Math.floor(n * .95)] }; },
};
