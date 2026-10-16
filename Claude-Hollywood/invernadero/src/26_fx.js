/* =====================================================================
   FX (1): aire, agua, fuego, piedra, cristal — todo en función del tiempo (sin estado: se puede saltar)
   Los hechizos son pinceladas del color pedido con el alma levantada a papel; la luz es papel y halo suave.
   ===================================================================== */
const GRAV = 980;
let WDT = null;
function windDisp(t) {   // desplazamiento acumulado por el viento (integral de windAt)
  if (!WDT) { WDT = new Float32Array(181 * 30); let a = 0; for (let i = 0; i < WDT.length; i++) { WDT[i] = a; a += windAt(i / 30) / 30; } }
  const f = clamp(t * 30, 0, WDT.length - 2), i = Math.floor(f); return lerp(WDT[i], WDT[i + 1], f - i);
}
const dotP = (P, x, y, r) => { P.moveTo(x + r, y); P.arc(x, y, r, 0, TAU); };
const easeOut = f => 1 - Math.pow(1 - clamp(f), 3);
/* pincelada a partir de puntos del mundo (ancho en unidades de mundo) */
function inkW(ptsW, wf, o) {
  const pts = [], ss = []; for (const p of ptsW) { if (p[2] - CAM.z < 20) continue; pts.push(PJ(p[0], p[1], p[2])); ss.push(PS(p[2])); }
  if (pts.length < 2) return pts;
  const sa = ss.reduce((a, b) => a + b, 0) / ss.length;
  inkStroke(pts, { ...o, w: f => wf(f) * sa });
  return pts;
}
/* sacudida de cámara */
const SHAKES = [[37.25, 4, 6], [38.62, 7, 7], [39.42, 12, 5], [70.62, 8, 6], [95.0, 10, 3], [98.6, 4, 6], [110.2, 14, 4], [112.6, 10, 2], [122.62, 10, 4], [153.25, 22, 2.5]];
function shakeAt(t) {
  let sx = 0, sy = 0;
  for (const [t0, a, d] of SHAKES) { const dt = t - t0; if (dt < 0 || dt > 2.5) continue; const e = a * Math.exp(-dt * d); sx += Math.sin(dt * 61) * e; sy += Math.cos(dt * 47) * e; }
  for (const tp of PULSES) { const dt = t - tp; if (dt > 0 && dt < 1) { const e = 6 * Math.exp(-dt * 5); sx += Math.sin(dt * 70) * e; sy += Math.cos(dt * 53) * e; } }
  if (t > 122.6 && t < 153.2) { sx += Math.sin(t * 43) * 1.2; sy += Math.cos(t * 37) * 1.2; }
  return [sx, sy];
}
/* ---------- aire: polvo y esporas (los revela el rayo) ---------- */
function dustFx(t, k = 1) {
  const wd = windDisp(t) * 420, lit = WS.flash, Pd = new Path2D(), Pb = new Path2D();
  for (let i = 0; i < 300 * k; i++) {
    const z = 450 + hsh(i, 1) * 1050; if (z - CAM.z < 40) continue;
    const span = 2600, x = ((hsh(i, 2) * span + Math.sin(t * .17 + i) * 40 + wd + t * 6) % span + span) % span - span / 2 + CAM.x * .2, y = -40 - hsh(i, 3) * 700 + Math.sin(t * .23 + i * 1.7) * 30 + ((t * 4 * hsh(i, 5)) % 60);
    const p = PJ(x, y, z), r = (1 + hsh(i, 4) * 1.6) * PS(z) * .9; if (p[0] < -SW / 2 || p[0] > SW / 2 || p[1] < -500 || p[1] > 500) continue;
    dotP(hsh(i, 6) < .5 ? Pd : Pb, p[0], p[1], Math.max(.5, r));
  }
  ctx.fillStyle = `rgba(226,230,214,${.1 + lit * .75})`; ctx.fill(Pd);
  ctx.fillStyle = `rgba(196,226,190,${.08 + lit * .6})`; ctx.fill(Pb);
}
/* haces de luz del rayo a través del vidrio sucio */
function godRays(t) {
  const L = WS.flash; if (L < .03) return;
  ctx.save(); ctx.globalCompositeOperation = 'screen';
  for (let x = -1950; x <= 1950; x += 300) {
    const a = PJ(x + 30, -560, ZF), b = PJ(x + 260, -560, ZF), fb = wallToFloor(x + 260, -80), fa = wallToFloor(x + 30, -80), c = PJ(fb[0], 0, fb[1]), d = PJ(fa[0], 0, fa[1]);
    const gr = ctx.createLinearGradient(0, a[1], 0, c[1]); gr.addColorStop(0, `rgba(220,226,236,${.16 * L})`); gr.addColorStop(1, 'rgba(220,226,236,0)');
    ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.lineTo(...c); ctx.lineTo(...d); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}
/* gotas de condensación que caen de las vigas (slow = factor de cámara lenta) */
function dripsFx(t, slow = 1, big = 1) {
  ctx.lineCap = 'round';
  for (let i = 0; i < 22; i++) {
    const per = 2.2 + hsh(i, 7) * 2.5, x = -900 + hsh(i, 1) * 1800, z = 520 + hsh(i, 2) * 700, y0 = -560 - hsh(i, 3) * 40;
    const tt = t * slow + hsh(i, 4) * per, ph = tt % per; const tau = ph; const y = y0 + .5 * GRAV * tau * tau; if (y > 0) continue;
    const v = GRAV * tau * slow, p = PJ(x, y, z), s = PS(z), r = 2.4 * s * big, l = Math.max(r * 1.3, v * .018 * s);
    if (p[0] < -SW / 2 || p[0] > SW / 2) continue;
    ctx.fillStyle = 'rgba(214,224,236,.75)'; ctx.beginPath(); ctx.moveTo(p[0], p[1] - l); ctx.quadraticCurveTo(p[0] + r, p[1], p[0], p[1] + r); ctx.quadraticCurveTo(p[0] - r, p[1], p[0], p[1] - l); ctx.fill();
    ctx.fillStyle = 'rgba(250,250,244,.9)'; ctx.beginPath(); ctx.arc(p[0] - r * .3, p[1] - r * .1, r * .32, 0, TAU); ctx.fill();
  }
}
/* ---------- fuego: chispa, látigo, chorros ---------- */
const FIRE = '232,104,36', FIREH = '255,196,96';
function fireWhipPath(t) {
  const pts = [], A = [-395, -128, 800], E = [318, -76, 792];
  for (let i = 0; i <= 40; i++) { const f = i / 40, und = Math.sin(f * 9 - t * 16) * 22 * (1 - f * .6) * (1 - f) + Math.sin(f * 3.3 + 1) * 30 * Math.sin(f * PI); pts.push([lerp(A[0], E[0], f), lerp(A[1], E[1], f) + und, lerp(A[2], E[2], f) + Math.sin(f * 5) * 18]); }
  return pts;
}
const WHIP0 = 37.2, WHIPHIT = 38.25 + 1.15;   // sale al cortar; llega a las losas en 39,4
function whipHead(t) { return easeOut((t - WHIP0) / (WHIPHIT - WHIP0)) ; }
function fireFx(t) {
  if (t < WHIP0 || t > 41.5) return;
  const pr = whipHead(t), fr = clamp((t - WHIPHIT + .15) / .7), tq = Math.floor(t * 12) / 12;
  if (fr < 1) {
    /* tres hebras de fuego líquido que se enroscan; delgadas en la varita, gruesas en la cabeza */
    for (let k = 0; k < 3; k++) {
      const pts = fireWhipPath(tq + k * .07).map((p, i) => { const f = i / 40; return [p[0], p[1] + Math.sin(f * 14 + tq * 20 + k * 2.1) * 9 * f, p[2] + Math.cos(f * 11 + k) * 8]; });
      const head = pr, wf = f => { const d = Math.max(0, f - (head - .35)) / .35; return (3 + 22 * Math.pow(Math.min(1, d), 1.4)) * (f > head - .02 ? .3 : 1) * (1 - k * .22); };
      inkW(pts, wf, { col: k === 1 ? FIREH : FIRE, a: k === 1 ? .8 : .9, prog: pr, from: fr, dry: .7, core: k === 0 ? .18 : 0, seed: 3 + k * 4, bristles: 6 });
    }
    /* lenguas de fuego que se desprenden hacia arriba (a 12 FPS) */
    const pts = fireWhipPath(tq), hi = Math.round(pr * 40);
    for (let i = Math.max(2, hi - 24); i < hi; i += 3) {
      if (hsh(i, Math.floor(tq * 12)) < .45) continue;
      const b = pts[i], l = 18 + hsh(i, tq) * 46, sw = -20 - hsh(i + 3, tq) * 30, tongue = []; for (let k = 0; k <= 6; k++) { const f = k / 6; tongue.push([b[0] + sw * f * f + Math.sin(f * 5 + i + tq * 9) * 6, b[1] - l * f, b[2]]); }
      inkW(tongue, f => 7 * (1 - f) * (f < .2 ? f / .2 : 1), { col: hsh(i, 9) < .5 ? FIRE : FIREH, a: .6, prog: 1, dry: .4, seed: i, bristles: 2 });
    }
    /* la punta del látigo: una flor de fuego que restalla */
    const hp0 = PJ(...pts[Math.min(40, hi)]), s0 = PS(pts[Math.min(40, hi)][2]);
    inkBloom(hp0, (22 + 6 * Math.sin(tq * 40)) * s0, FIRE, .85, Math.floor(tq * 12), .9, 6); inkBloom(hp0, 12 * s0, FIREH, .9, Math.floor(tq * 12) + 1, .5, 5); paperLight(hp0, 5 * s0, .9);
    const h = pts[Math.min(40, hi)], hp = PJ(...h), s = PS(h[2]);
    LGF(hp[0], hp[1], 200 * s, '255,140,60', .75); LGT(hp[0], hp[1], 600 * s, '255,130,50', .7);
    for (let i = Math.max(0, hi - 30); i <= hi; i += 4) { const q = PJ(...pts[i]); LGT(q[0], q[1], 200 * s, '255,120,40', .22); }
  }
  /* brasas que deja el látigo */
  const Pe = new Path2D();
  for (let i = 0; i < 90; i++) { const f = hsh(i, 1), tb = WHIP0 + (WHIPHIT - WHIP0) * Math.pow(f, 1.6), age = t - tb; if (age < 0 || age > 2.4) continue; const b = fireWhipPath(tb)[Math.round(f * 40)], x = b[0] + (hsh(i, 2) - .5) * 60 * age, y = b[1] - age * (60 + hsh(i, 3) * 90) + age * age * 30, p = PJ(x, y, b[2]), r = (1.4 + hsh(i, 4) * 2.4) * PS(b[2]) * (1 - age / 2.4); dotP(Pe, p[0], p[1], Math.max(.4, r)); }
  ctx.fillStyle = 'rgba(255,170,80,.9)'; ctx.fill(Pe);
}
/* chorros laterales tras el choque con las losas → funden las estanterías */
const JETS = [{ to: [190, -150, 1320], c: [320, -420, 1050], tHit: 39.75 }, { to: [930, -90, 1260], c: [620, -40, 980], tHit: 39.85 }];
function jetFx(t) {
  if (t < WHIPHIT - .02 || t > 41.6) return;
  const o = [326, -80, 792];
  for (const J of JETS) {
    const pr = clamp((t - WHIPHIT) / (J.tHit - WHIPHIT)), fr = clamp((t - J.tHit - .05) / .9), pts = [];
    for (let i = 0; i <= 24; i++) { const f = i / 24, u = 1 - f; pts.push([u * u * o[0] + 2 * u * f * J.c[0] + f * f * J.to[0], u * u * o[1] + 2 * u * f * J.c[1] + f * f * J.to[1] + Math.sin(f * 12 - t * 18) * 8, u * u * o[2] + 2 * u * f * J.c[2] + f * f * J.to[2]]); }
    if (fr < 1) { inkW(pts, f => 22 - 8 * f, { col: FIRE, a: .92, prog: easeOut(pr), from: fr, dry: .8, core: .3, seed: 7, bristles: 7 }); const h = PJ(...pts[Math.round(easeOut(pr) * 24)]); LGF(h[0], h[1], 180, '255,150,60', .7); LGT(h[0], h[1], 420, '255,130,50', .5); }
    if (t > J.tHit) { const age = t - J.tHit, c = PJ(...J.to), s = PS(J.to[2]); inkBloom(c, (30 + 70 * easeOut(age / .5)) * s, '236,176,80', .8 * (1 - sm(age / 1.4)), 2, .6); paperLight(c, 18 * s * (1 - sm(age / .8)) + .5, 1 - sm(age / .8)); LGF(c[0], c[1], 300 * s, '255,170,80', .8 * (1 - sm(age / 1.2))); }
  }
}
/* frascos que estallan en las estanterías */
function jarBurstFx(t) {
  const Pg = new Path2D(), Ps = new Path2D();
  for (const S of SHELVES) { if (!S.tHit || t < S.tHit) continue;
    S.jars.forEach((j, n) => { const age = t - j.tb; if (age < 0 || age > 1.6) return;
      for (let k = 0; k < 7; k++) { const vx = (hsh(n, k) - .5) * 420, vy = -120 - hsh(n, k + 9) * 320, vz = (hsh(n, k + 3) - .5) * 200, x = S.x + j.x + vx * age, y = Math.min(0, j.y + vy * age + .5 * GRAV * age * age), z = S.z + vz * age, p = PJ(x, y, z), s = PS(z), r = (1.5 + hsh(n, k + 5) * 2.5) * s; const a = hsh(n, k + 7) * TAU + age * 9; Pg.moveTo(p[0] + Math.cos(a) * r * 2, p[1] + Math.sin(a) * r * 2); Pg.lineTo(p[0] + Math.cos(a + 2.2) * r, p[1] + Math.sin(a + 2.2) * r); Pg.lineTo(p[0] + Math.cos(a + 4) * r, p[1] + Math.sin(a + 4) * r); Pg.closePath(); }
      if (age < .25) { const p = PJ(S.x + j.x, j.y, S.z); dotP(Ps, p[0], p[1], (6 + age * 40) * PS(S.z)); LGF(p[0], p[1], 90 * PS(S.z), '255,220,170', .9 * (1 - age / .25)); }
    }); }
  ctx.fillStyle = 'rgba(214,232,236,.85)'; ctx.fill(Pg); ctx.fillStyle = 'rgba(255,236,200,.8)'; ctx.fill(Ps);
}
/* ---------- vapor y humo ---------- */
function steamFx(t) {
  const wd = windDisp(t) * 520;
  for (const P of PUDDLES) { if (!P.evap || t < P.evap) continue;
    for (let k = 0; k < 14; k++) { const tb = P.evap + k * .05 + hsh(k, 2) * .3, age = t - tb; if (age < 0 || age > 8) continue;
      const x = P.x + (hsh(k, P.x) - .5) * P.rx * 1.8 + (wd - windDisp(tb) * 520) + Math.sin(age * 1.3 + k) * 12, y = -15 - age * (90 + hsh(k, 3) * 60) / (1 + age * .2), z = P.z + (hsh(k, 4) - .5) * 30, p = PJ(x, y, z), s = PS(z);
      const rx = (12 + 40 * easeOut(age / 3)) * s, ry = rx * (1.8 + hsh(k, 5)), a = .26 * sm(age / .25) * (1 - sm(age / 8)), warm = clamp(1 - (t - 39.6) / 2.5);
      const c = `${lerp(214, 255, warm) | 0},${lerp(216, 186, warm) | 0},${lerp(220, 140, warm) | 0}`;
      ctx.save(); ctx.translate(p[0], p[1]); ctx.scale(1, ry / rx);
      const gr = ctx.createRadialGradient(0, 0, 0, 0, 0, rx); gr.addColorStop(0, `rgba(${c},${a})`); gr.addColorStop(.55, `rgba(${c},${a * .5})`); gr.addColorStop(1, `rgba(${c},0)`); ctx.fillStyle = gr; ctx.fillRect(-rx, -rx, rx * 2, rx * 2); ctx.restore();
    } }
}
function smokeFx(t) {   // humo que se queda colgado tras el fuego; la onda de B lo barre
  if (t < 39.5 || t > 70) return;
  const wd = windDisp(t) * 900, a0 = sm((t - 39.5) / 3) * (1 - sm((t - 64) / 5));
  for (let i = 0; i < 14; i++) { const x = -500 + hsh(i, 1) * 1400 + wd - windDisp(39.5) * 900 + Math.sin(t * .2 + i) * 40, y = -200 - hsh(i, 2) * 460, z = 700 + hsh(i, 3) * 600, p = PJ(x, y, z), s = PS(z), r = (140 + hsh(i, 4) * 180) * s;
    const gr = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], r); gr.addColorStop(0, `rgba(70,66,70,${.22 * a0})`); gr.addColorStop(1, 'rgba(70,66,70,0)'); ctx.fillStyle = gr; ctx.fillRect(p[0] - r, p[1] - r * .6, r * 2, r * 1.2); }
}
function embersFx(t, t0 = 39.6, t1 = 62, n = 60) {   // brasas que caen despacio
  if (t < t0 || t > t1 + 3) return;
  const Pe = new Path2D(), wd = windDisp(t) * 500;
  for (let i = 0; i < n; i++) { const per = 5 + hsh(i, 1) * 4, tb = t0 + hsh(i, 2) * (t1 - t0), age = t - tb; if (age < 0 || age > per) continue;
    const x = -200 + hsh(i, 3) * 1300 + Math.sin(age * 1.7 + i) * 30 + (wd - windDisp(tb) * 500), y = -560 + age * (90 + hsh(i, 4) * 60), z = 600 + hsh(i, 5) * 700, p = PJ(x, y, z), r = (1.2 + hsh(i, 6) * 2) * PS(z);
    if (y > 0) continue; dotP(Pe, p[0], p[1], Math.max(.5, r)); if (i % 4 === 0) LGF(p[0], p[1], r * 7, '255,140,60', .25); }
  ctx.fillStyle = 'rgba(255,172,90,.9)'; ctx.fill(Pe);
}
/* ceniza de las plantas quemadas */
function ashFx(t) {
  const Pa = new Path2D();
  for (const [x0, z0, sz, sd, burn] of FERNS) { if (!burn || t < burn || t > burn + 6) continue;
    for (let i = 0; i < 16; i++) { const age = t - burn - hsh(i, sd) * .5; if (age < 0) continue; const x = x0 + (hsh(i, sd + 1) - .5) * sz * 1.4 + Math.sin(age * 2 + i) * 14 + age * 30, y = -sz * .5 * hsh(i, sd + 2) - age * 60 + age * age * 12, z = z0, p = PJ(x, Math.min(0, y), z), s = PS(z), r = 2.2 * s; Pa.moveTo(p[0] - r, p[1]); Pa.lineTo(p[0], p[1] - r * .6); Pa.lineTo(p[0] + r * 1.2, p[1] + r * .3); Pa.closePath(); } }
  ctx.fillStyle = 'rgba(24,22,24,.85)'; ctx.fill(Pa);
}
/* quemadura del látigo en el suelo */
function scorchFloor(t) {
  if (t < WHIP0) return;
  const hx = lerp(-395, 318, whipHead(t)), pts = [];
  for (let x = -380; x <= Math.min(hx, 318); x += 20) pts.push([x, 800 + Math.sin(x * .02) * 14 + N2(x * .01, 3) * 10]);
  if (pts.length < 2) return;
  const L = pts.map(([x, z]) => PJ(x, 0, z - 18)), R = pts.map(([x, z]) => PJ(x, 0, z + 18)).reverse();
  ctx.fillStyle = `rgba(18,14,14,${.6})`; ctx.fill(pPolys([L.concat(R)]));
  const glow = 1 - sm((t - 39.5) / 6);
  if (glow > .01) { ctx.strokeStyle = `rgba(255,120,40,${.5 * glow})`; ctx.lineWidth = 2; ctx.stroke(pLine(pts.map(([x, z]) => PJ(x, 0, z)))); }
}
/* ---------- piedra: tres losas que se levantan como escudo ---------- */
let SLABTEX = null;
const SLABS = [{ x: 330, z: 764, w: 96, h: 96, yaw: .62, tb: 38.66 }, { x: 366, z: 806, w: 112, h: 112, yaw: .42, tb: 38.73 }, { x: 350, z: 852, w: 92, h: 92, yaw: .72, tb: 38.8 }];
function slabRise(S, t) { const f = clamp((t - S.tb) / .26); return f < 1 ? easeOut(f) * 1.08 : 1.08 - .08 * sm((t - S.tb - .26) / .3); }
function drawSlab(S, t) {
  if (t < S.tb) return;
  const r = slabRise(S, t), b = Math.max(0, S.h * (1 - r)), top = S.h * (1 - r) - S.h, bot = 0, tilt = .08 * sm((t - S.tb) / .5);
  const N = [-Math.cos(S.yaw), 0, -Math.sin(S.yaw)], Wv = [Math.sin(S.yaw), 0, -Math.cos(S.yaw)], th = 30;
  const P3 = (u, y, n) => { const lean = (-y) * tilt; return PJ(S.x + Wv[0] * u - N[0] * (n + lean), y, S.z + Wv[2] * u - N[2] * (n + lean)); };
  const hw = S.w / 2;
  /* borde superior roto (la losa se partió al arrancarla) */
  const brk = u => top + 5 * N2(u * .05 + S.x, 1) + (Math.abs(u) > hw * .75 ? 4 * hsh(u, S.z) : 0);
  const us = []; for (let i = 0; i <= 8; i++) us.push(-hw + i * S.w / 8);
  const front = [...us.map(u => P3(u, brk(u), 0)), P3(hw, bot, 0), P3(-hw, bot, 0)], topF = [...us.map(u => P3(u, brk(u), 0)), ...us.slice().reverse().map(u => P3(u, brk(u), th))], side = [P3(hw, brk(hw), 0), P3(hw, brk(hw), th), P3(hw, bot, th), P3(hw, bot, 0)];
  const s = PS(S.z), heat = t > WHIPHIT ? clamp((t - WHIPHIT) / .2) * (1 - sm((t - WHIPHIT - 1) / 5)) : 0;
  ctx.fillStyle = cssc([30, 30, 32]); ctx.fill(pPolys([side]));
  ctx.fillStyle = cssc([70, 70, 68]); ctx.fill(pPolys([topF]));
  const FP = pPolys([front]); ctx.fillStyle = cssc(mixc([42, 44, 44], [96, 52, 30], heat * .5)); ctx.fill(FP);
  if (!SLABTEX) SLABTEX = ctx.createPattern(BLOT, 'repeat');
  ctx.save(); ctx.clip(FP); ctx.globalCompositeOperation = 'multiply'; SLABTEX.setTransform(new DOMMatrix().translate(front[0][0], front[0][1]).scale(s * .6)); ctx.fillStyle = SLABTEX; ctx.fill(FP);
  ctx.globalCompositeOperation = 'source-over'; const b0 = P3(0, bot, 0), gr = ctx.createLinearGradient(0, b0[1], 0, b0[1] - 40 * s); gr.addColorStop(0, 'rgba(40,30,24,.9)'); gr.addColorStop(1, 'rgba(40,30,24,0)'); ctx.fillStyle = gr; ctx.fill(FP);
  ctx.strokeStyle = 'rgba(16,14,16,.7)'; ctx.lineWidth = Math.max(.6, 1.4 * s); ctx.beginPath(); ctx.moveTo(...P3(-hw * .5, top + 6, -1)); ctx.lineTo(...P3(-hw * .2, top + S.h * .35, -1)); ctx.lineTo(...P3(-hw * .35, top + S.h * .7, -1)); ctx.moveTo(...P3(-hw * .2, top + S.h * .35, -1)); ctx.lineTo(...P3(hw * .3, top + S.h * .5, -1)); ctx.stroke();
  ctx.restore();
  ctx.strokeStyle = 'rgba(14,12,14,.85)'; ctx.lineWidth = Math.max(.7, 1.8 * s); ctx.lineJoin = 'round'; for (const q of [front, topF, side]) ctx.stroke(pPolys([q]));
  ctx.lineWidth = Math.max(.5, 1 * s); ctx.strokeStyle = 'rgba(30,28,30,.5)'; ctx.beginPath(); ctx.moveTo(...P3(-hw * .3, top + 10, 0)); ctx.lineTo(...P3(-hw * .1, top + S.h * .4, 0)); ctx.lineTo(...P3(hw * .2, top + S.h * .55, 0)); ctx.stroke();
  /* raíces que tiran de la losa y se rompen */
  const snap = S.tb + .3; ctx.strokeStyle = 'rgba(46,34,28,.95)'; ctx.lineCap = 'round';
  for (let k = 0; k < 4; k++) { const u = -hw + (k + .5) * S.w / 4, a = P3(u, bot, th * .5); ctx.lineWidth = Math.max(.7, (3 + k % 2 * 2) * s);
    if (t < snap) { const fl = PJ(S.x + Wv[0] * u, 0, S.z + Wv[2] * u + 10); ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...fl); ctx.stroke(); }
    else if (bot >= -1) { const sw = Math.sin(t * 5 + k) * 6 * s, l = (20 + k * 9) * s * (1 - sm((t - snap) / 3) * .3); ctx.beginPath(); ctx.moveTo(...a); ctx.quadraticCurveTo(a[0] + sw, a[1] + l * .6, a[0] + sw * 1.5 + 4 * s, a[1] + l); ctx.stroke(); } }
  if (heat > .01) { const c = P3(0, top + S.h * .45, -4); LGT(c[0], c[1], 160 * s, '255,130,50', .6 * heat); }
}
function slabHoles(t) {   // donde estaban las losas queda tierra
  for (const S of SLABS) { if (t < S.tb) continue; const Wv = [Math.sin(S.yaw), 0, -Math.cos(S.yaw)], hw = S.w / 2, q = [[-hw, -14], [hw, -14], [hw, 26], [-hw, 26]].map(([u, n]) => PJ(S.x + Wv[0] * u + Math.cos(S.yaw) * n, 0, S.z + Wv[2] * u + Math.sin(S.yaw) * n)); ctx.fillStyle = 'rgba(40,30,24,.95)'; ctx.fill(pPolys([q])); }
}
function soilFx(t) {   // tierra húmeda que salta al arrancar las losas
  const Pd = new Path2D();
  for (const S of SLABS) { const age0 = t - S.tb; if (age0 < 0 || age0 > 2) continue;
    for (let i = 0; i < 22; i++) { const age = age0 - hsh(i, 3) * .1; if (age < 0) continue; const vx = (hsh(i, S.x) - .5) * 500, vy = -260 - hsh(i, S.z) * 560, vz = (hsh(i, 9) - .5) * 260, y = vy * age + .5 * GRAV * age * age; if (y > 0 && age > .2) continue; const p = PJ(S.x + vx * age, Math.min(0, y), S.z + vz * age), r = (2 + hsh(i, 5) * 4.5) * PS(S.z); dotP(Pd, p[0], p[1], r); } }
  ctx.fillStyle = 'rgba(44,32,26,.95)'; ctx.fill(Pd);
}
/* impacto del fuego contra las losas */
function slabImpactFx(t) {
  const age = t - WHIPHIT; if (age < 0 || age > 2) return;
  const c = PJ(318, -80, 792), s = PS(792);
  inkBloom(c, (40 + 110 * easeOut(age / .5)) * s, '236,176,80', .8 * (1 - sm(age / 1.5)), 4, .45, 9);
  paperLight(c, (30 * (1 - sm(age / .6)) + 1) * s, 1 - sm(age / .7));
  LGF(c[0], c[1], 520 * s, '255,180,90', 1.2 * (1 - sm(age / 1.2))); LGT(c[0], c[1], 900 * s, '255,140,60', .9 * (1 - sm(age / 2)));
}
