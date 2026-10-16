/* =====================================================================
   EFECTOS DEL DÍA DE OTOÑO · todo en función de t (sin estado: se puede saltar a cualquier instante)
   hojas que caen y hojas en el suelo, rayos de sol, motas, poste oxidado, piedra, esquirlas de vidrio,
   polvo del derrumbe, ondas en los charcos, pantallas en el muro, caja de cultivo que suena, transición de tinta
   ===================================================================== */
let WDT = null;
function windDisp(t) {   // desplazamiento acumulado por el viento (integral de windAt)
  if (!WDT) { WDT = new Float32Array(Math.ceil(FILM.DUR + 5) * 30); let a = 0; for (let i = 0; i < WDT.length; i++) { WDT[i] = a; a += windAt(i / 30) / 30; } }
  const f = clamp(t * 30, 0, WDT.length - 2), i = Math.floor(f); return lerp(WDT[i], WDT[i + 1], f - i);
}
const LEAFC = [[214, 140, 40], [192, 76, 34], [226, 112, 40], [170, 52, 36], [236, 180, 64], [150, 96, 40]];
/* una hoja de otoño (forma de gota con nervio) en px de pantalla-unidad */
function leafShape(P, x, y, r, a, flip) {
  const c = Math.cos(a), s = Math.sin(a), q = (u, v) => [x + (u * c - v * s), y + (u * s + v * c)];
  const p0 = q(-r, 0), p1 = q(r, 0), c1 = q(0, -r * .62 * flip), c2 = q(0, r * .62 * flip);
  P.moveTo(...p0); P.quadraticCurveTo(...c1, ...p1); P.quadraticCurveTo(...c2, ...p0);
}
/* hojas que caen detrás y delante del vidrio; con el muro roto, una corriente entra por el hueco */
function leavesFall(t, k = 1, zMin = 300, zMax = 1500) {
  const wd = windDisp(t) * 260, buckets = LEAFC.map(() => new Path2D());
  const n = Math.round(90 * k);
  for (let i = 0; i < n; i++) {
    const z = zMin + hsh(i, 1) * (zMax - zMin); if (z - CAM.z < 40) continue;
    const per = 9 + hsh(i, 2) * 7, ph = ((t + hsh(i, 3) * per) % per) / per, span = 3200;
    const x = ((hsh(i, 4) * span + wd + ph * 160 + Math.sin(t * .8 + i) * 50) % span + span) % span - span / 2 + CAM.x * .7;
    const y = lerp(-900, 10, ph) + Math.sin(t * 1.7 + i * 2.1) * 26;
    if (y > 0) continue;
    const p = PJ(x, y, z), s = PS(z); if (p[0] < -SW / 2 - 40 || p[0] > SW / 2 + 40 || p[1] < -540 || p[1] > 540) continue;
    const spin = t * (1.4 + hsh(i, 5) * 2) + i, flip = Math.sin(spin) > 0 ? 1 : -1;
    leafShape(buckets[i % LEAFC.length], p[0], p[1], (6 + hsh(i, 6) * 5) * s, spin * .7, flip * Math.max(.25, Math.abs(Math.sin(spin))));
  }
  buckets.forEach((P, j) => { ctx.fillStyle = cssc(LEAFC[j], .88); ctx.fill(P); });
  /* por el hueco del muro entra una corriente de hojas (desde el derrumbe) */
  if (WS.gone) {
    const P = new Path2D(), age = t - T_WALL;
    for (let i = 0; i < 46; i++) {
      const t0 = hsh(i, 9) * 9, per = 7 + hsh(i, 8) * 4, ph = ((age + t0) % per) / per; if (age + t0 < t0 + .4 && age < 1) continue;
      const x = 300 + hsh(i, 7) * 600 + ph * (200 + 300 * hsh(i, 6)) + Math.sin(t * 2 + i) * 40, z = lerp(1640, 520, ph), y = lerp(-520 + hsh(i, 5) * 300, 0, Math.pow(ph, 1.6)) + Math.sin(t * 2.6 + i) * 30;
      if (z - CAM.z < 40 || y > -2) continue; const p = PJ(x, y, z), s = PS(z), spin = t * 3 + i;
      leafShape(P, p[0], p[1], (6 + hsh(i, 4) * 5) * s, spin, Math.sin(spin) > 0 ? 1 : -.4);
    }
    ctx.fillStyle = 'rgba(208,110,40,.9)'; ctx.fill(P);
  }
}
/* hojas en el suelo: se apartan cuando Aguada pasa cerca (el instante y la dirección se calculan una vez) */
const FLEAVES = [];
function floorLeavesInit() {
  const r = mulberry32(77);
  for (let i = 0; i < 150; i++) { const x = -1300 + r() * 2600, z = 480 + r() * 900; FLEAVES.push({ x, z, a: r() * TAU, c: Math.floor(r() * LEAFC.length), r: 6 + r() * 6, tp: 1e9, d: [0, 0] }); }
  for (let i = 0; i < 40; i++) { const x = -900 + r() * 800, z = 525 + r() * 85; FLEAVES.push({ x, z, a: r() * TAU, c: Math.floor(r() * LEAFC.length), r: 6 + r() * 5, tp: 1e9, d: [0, 0] }); }   // en el camino de Aguada
  for (let t = 0; t < FILM.DUR; t += .05) {
    const A = agAt(t); if (!A || A.hide || A.insert) continue;
    for (const L of FLEAVES) { if (L.tp < 1e9) continue; const dx = L.x - A.x, dz = (L.z - A.z) * 2.2; if (Math.hypot(dx, dz) < 44) { L.tp = t; const l = Math.hypot(dx, dz) || 1; L.d = [dx / l * (40 + 30 * hsh(L.x, 1)), dz / l * 12]; } }
  }
}
function floorLeaves(t) {
  const P = LEAFC.map(() => new Path2D());
  for (const L of FLEAVES) {
    if (L.z - CAM.z < 40) continue;
    const f = easeOut((t - L.tp) / .45), x = L.x + L.d[0] * f, z = L.z + L.d[1] * f, p = PJ(x, 0, z), s = PS(z);
    if (p[0] < -SW / 2 - 20 || p[0] > SW / 2 + 20 || p[1] > 540) continue;
    const hop = f > 0 && f < 1 ? Math.sin(f * PI) * 14 * s : 0;
    leafShape(P[L.c], p[0], p[1] - hop, L.r * s, L.a + f * 2, .35);
  }
  P.forEach((Q, j) => { ctx.fillStyle = cssc(shc(LEAFC[j], -.08), .85); ctx.fill(Q); });
}
/* rayos de sol diagonales a través del vidrio (papel levantado, cálido) y motas que flotan dentro */
function sunRays(t, k = 1) {
  ctx.save(); ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < 6; i++) {
    const x = -1500 + i * 560 + Math.sin(t * .05 + i) * 30, a = PJ(x, -620, 1580), b = PJ(x + 150, -620, 1580), c = PJ(x + 150 + 640, 0, 760), d = PJ(x + 640, 0, 760);
    const gr = ctx.createLinearGradient(a[0], a[1], d[0], d[1]); const al = (.07 + .04 * Math.sin(t * .4 + i * 1.7)) * k;
    gr.addColorStop(0, `rgba(255,224,160,${al})`); gr.addColorStop(1, 'rgba(255,224,160,0)');
    ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.lineTo(...c); ctx.lineTo(...d); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
  const P = new Path2D(), wd = windDisp(t) * 60;
  for (let i = 0; i < 140 * k; i++) {
    const z = 420 + hsh(i, 1) * 1000; if (z - CAM.z < 40) continue;
    const x = ((hsh(i, 2) * 2600 + Math.sin(t * .2 + i) * 50 + wd) % 2600 + 2600) % 2600 - 1300 + CAM.x * .3, y = -60 - hsh(i, 3) * 600 + Math.sin(t * .3 + i * 1.3) * 30;
    const p = PJ(x, y, z); if (p[0] < -SW / 2 || p[0] > SW / 2) continue; dotP(P, p[0], p[1], Math.max(.6, (.8 + hsh(i, 4)) * PS(z)));
  }
  ctx.fillStyle = `rgba(255,246,220,${.45 * k})`; ctx.fill(P);
}

/* ---------------- bloque 4: el poste oxidado, la piedra, el derrumbe ---------------- */
const POST = { x: 560, z: 1450, h: 430 };
const STONE0 = [-150, 568];
function postAng(t) {   // ángulo de caída hacia la derecha (rad)
  if (t < T_HIT) return 0;
  if (t < T_POSTF) return .035 * Math.sin((t - T_HIT) * 26) * Math.exp(-(t - T_HIT) * 3);
  if (t < T_WALL) { const f = (t - T_POSTF) / (T_WALL - T_POSTF); return .62 * f * f; }
  const f = clamp((t - T_WALL) / 1.5); return lerp(.62, PI / 2 - .04, f * f) + (f >= 1 ? 0 : 0);
}
function postTop(t) { const a = postAng(t); return [POST.x + Math.sin(a) * POST.h, -Math.cos(a) * POST.h, POST.z + Math.sin(a) * 60]; }
function drawPost(t) {
  const a = postAng(t), n = 18, pts = [], ws = [];
  for (let i = 0; i <= n; i++) { const f = i / n, L = f * POST.h, q = [POST.x + Math.sin(a) * L, -Math.cos(a) * L, POST.z + Math.sin(a) * 60 * f]; if (q[2] - CAM.z < 40) return; pts.push(PJ(...q)); ws.push(lerp(22, 15, f) * PS(q[2])); }
  const p0 = pts[0]; if (p0[0] < -SW / 2 - 600 || p0[0] > SW / 2 + 600) return;
  ctx.fillStyle = 'rgb(92,50,34)'; ctx.fill(pPolys([stripP(pts, f => ws[Math.round(f * n)])])); ctx.fillStyle = 'rgba(176,96,52,.55)'; ctx.fill(pPolys([stripP(pts.map((p, i) => [p[0] - ws[i] * .25, p[1]]), f => ws[Math.round(f * n)] * .35)]));
  ctx.strokeStyle = 'rgba(60,30,18,.75)'; ctx.lineWidth = Math.max(.6, 2 * PS(POST.z)); ctx.stroke(pLine(pts.map((p, i) => [p[0] + ws[i] * .3, p[1]])));
  ctx.fillStyle = 'rgba(170,96,52,.8)'; for (let i = 2; i < n; i += 3) { const p = pts[i]; ctx.beginPath(); ctx.arc(p[0] - ws[i] * .2, p[1], Math.max(.6, 1.6 * PS(POST.z)), 0, TAU); ctx.fill(); }
  /* base y farol roto arriba (ménsula en espiral) */
  const s = PS(POST.z), b = PJ(POST.x, 0, POST.z); ctx.fillStyle = cssc(shc(RUSTC, -.3)); ctx.fillRect(b[0] - 22 * s, b[1] - 16 * s, 44 * s, 16 * s);
  const tp = pts[n], d = nrm2(sub(pts[n], pts[n - 2])), nn = [-d[1], d[0]];
  ctx.strokeStyle = cssc(shc(RUSTC, -.35)); ctx.lineWidth = Math.max(.8, 3 * s); ctx.lineCap = 'round';
  const sp = []; for (let k = 0; k <= 16; k++) { const u = k / 16 * 4, r = 26 * (1 - k / 20) * s; sp.push(add(add(tp, nn, (30 - Math.cos(u) * r / s) * s), d, -Math.sin(u) * r - 6 * s)); } ctx.stroke(pLine(sp));
  const lamp = add(add(tp, nn, 46 * s), d, -18 * s); ctx.fillStyle = 'rgba(60,40,30,.9)'; ctx.fillRect(lamp[0] - 9 * s, lamp[1] - 4 * s, 18 * s, 26 * s); ctx.fillStyle = 'rgba(230,226,206,.55)'; ctx.fillRect(lamp[0] - 6 * s, lamp[1], 12 * s, 18 * s);
}
/* la piedra: en el suelo, dentro de la taza, en el aire, rebota en el poste y cae */
function stoneAt(t, ag) {
  if (t < 125.75) return [STONE0[0], -3, STONE0[1], 'floor'];
  if (t < T_THROW) return null;   // va dentro de Aguada (se dibuja en su sprite)
  const a0 = [ag.x + 6, -70, ag.z], a1 = postTop(T_HIT), P1 = [POST.x + Math.sin(.02) * 330, -330, POST.z];
  if (t < T_HIT) { const f = (t - T_THROW) / (T_HIT - T_THROW); return [lerp(a0[0], P1[0], f), lerp(a0[1], P1[1], f) - Math.sin(f * PI) * 260, lerp(a0[2], P1[2], f), 'air']; }
  const g = t - T_HIT; if (g < 1.2) { const y = P1[1] - 160 * g + .5 * GRAV * g * g; return [P1[0] - 120 * g, Math.min(-3, y), P1[2] - 80 * g, 'air']; }
  return [P1[0] - 144, -3, P1[2] - 96, 'floor'];
}
function drawStone(q) {
  if (!q || q[2] - CAM.z < 40) return;
  const p = PJ(q[0], q[1], q[2]), s = PS(q[2]), r = 10 * s;
  if (q[3] === 'air') { const tail = PJ(q[0] - 30, q[1] + 18, q[2] - 20); ctx.strokeStyle = 'rgba(90,80,70,.35)'; ctx.lineWidth = r * 1.2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(...tail); ctx.lineTo(...p); ctx.stroke(); }
  if (q[3] === 'floor') { ctx.fillStyle = 'rgba(52,40,30,.3)'; ctx.beginPath(); ctx.ellipse(p[0] + r * .4, p[1] + r * .2, r * 1.3, r * .4, 0, 0, TAU); ctx.fill(); }
  ctx.fillStyle = 'rgb(118,112,104)'; ctx.beginPath(); ctx.ellipse(p[0], p[1] - r * .55, r * 1.1, r * .8, .2, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(232,226,212,.6)'; ctx.beginPath(); ctx.ellipse(p[0] - r * .35, p[1] - r * .85, r * .35, r * .2, .2, 0, TAU); ctx.fill();
}
/* esquirlas de la sección del muro: cada una con su salida, su velocidad y su giro (balística pura) */
const SHARDS = []; { const r = mulberry32(404); for (let i = 0; i < 150; i++) { const x = 300 + r() * 600, y = -600 + r() * 540, hgt = -y; SHARDS.push({ x, y, z: 1600, t0: T_WALL + .15 + Math.pow(hgt / 600, .7) * 1.6 * r() + .2 * r(), vx: (r() - .5) * 260, vy: -60 - r() * 260, vz: -(120 + r() * 520), sp: (r() - .5) * 14, k: Math.floor(r() * 4), sz: 6 + r() * 16, glint: r() }); } }
function shardPos(S, t) {
  const tau = t - S.t0; if (tau < 0) return null;
  const tl = (-S.vy + Math.sqrt(S.vy * S.vy + 2 * GRAV * -S.y)) / GRAV;   // cuándo toca el suelo
  const tt = Math.min(tau, tl), x = S.x + S.vx * tt, y = S.y + S.vy * tt + .5 * GRAV * tt * tt, z = S.z + S.vz * tt;
  const slide = Math.max(0, tau - tl), sl = 1 - Math.exp(-slide * 4);
  return [x + S.vx * .08 * sl, Math.min(-1, y), z + S.vz * .08 * sl, tau < tl ? S.sp * tau : S.sp * tl, tau >= tl];
}
function shardShape(P, c, s, a, k) {
  const pts = [[[0, -1], [.5, .6], [-.4, .4]], [[0, -1], [.25, -.2], [.15, 1], [-.2, .3]], [[-.6, -.5], [.7, -.3], [.4, .5], [-.5, .6]], [[0, -1.2], [.12, 1], [-.12, .9]]][k];
  pts.forEach(([u, v], i) => { const x = c[0] + (u * Math.cos(a) - v * Math.sin(a)) * s, y = c[1] + (u * Math.sin(a) + v * Math.cos(a)) * s; i ? P.lineTo(x, y) : P.moveTo(x, y); }); P.closePath();
}
function shardsFx(t, trails = 0) {
  if (t < T_WALL) return;
  const Pa = new Path2D(), Pb = new Path2D(), Pg = new Path2D();
  for (let i = 0; i < SHARDS.length; i++) {
    const S = SHARDS[i], q = shardPos(S, t); if (!q || q[2] - CAM.z < 40) continue;
    const p = PJ(q[0], q[1], q[2]), s = PS(q[2]);
    shardShape(S.glint > .8 ? Pg : i & 1 ? Pa : Pb, p, S.sz * s * .5, q[3], S.k);
  }
  ctx.fillStyle = 'rgba(200,218,214,.55)'; ctx.fill(Pa); ctx.fillStyle = 'rgba(176,200,196,.5)'; ctx.fill(Pb);
  ctx.strokeStyle = 'rgba(70,84,84,.55)'; ctx.lineWidth = .8; ctx.stroke(Pa); ctx.stroke(Pb);
  ctx.fillStyle = 'rgba(255,250,232,.95)'; ctx.fill(Pg);
  /* las trayectorias (bloque 4, L13): parábolas punteadas a tinta, cada una por su cuenta */
  if (trails > .01) {
    ctx.save(); ctx.setLineDash([5, 6]); ctx.lineCap = 'round';
    for (let i = 0; i < SHARDS.length; i += 5) {
      const S = SHARDS[i], tau = t - S.t0; if (tau < 0) continue;
      const pts = []; for (let k = 0; k <= 30; k++) { const q = shardPos(S, S.t0 + k / 30 * Math.min(tau, 1.6)); if (!q) break; pts.push(PJ(q[0], q[1], q[2])); }
      if (pts.length > 1) { ctx.strokeStyle = `rgba(52,40,96,${.8 * trails})`; ctx.lineWidth = 2.4; ctx.stroke(pLine(pts)); const e = pts[pts.length - 1]; ctx.fillStyle = `rgba(52,40,96,${.7 * trails})`; ctx.beginPath(); ctx.arc(e[0], e[1], 2.2, 0, TAU); ctx.fill(); }
    }
    ctx.restore();
  }
}
/* polvo del derrumbe: nubes de lavado beige que suben y se abren (sin estado) */
function dustCloud(t) {
  const age = t - T_WALL - .4; if (age < 0 || age > 7) return;
  for (let i = 0; i < 16; i++) {
    const x = 300 + hsh(i, 1) * 600 + (hsh(i, 2) - .3) * 260 * easeOut(age / 3), z = 1560 - hsh(i, 3) * 220 * easeOut(age / 4), y = -20 - 160 * easeOut(age / 4) * hsh(i, 4);
    if (z - CAM.z < 40) continue; const p = PJ(x, y, z), r = (60 + 140 * easeOut(age / 3)) * PS(z) * (.6 + hsh(i, 5) * .6), a = .28 * (1 - sm(age / 7)) * sm(age / .3);
    const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], r); g.addColorStop(0, `rgba(214,196,164,${a})`); g.addColorStop(1, 'rgba(214,196,164,0)'); ctx.fillStyle = g; ctx.fillRect(p[0] - r, p[1] - r, r * 2, r * 2);
  }
}

/* ---------------- charcos: ondas donde pisa Aguada, reflejo pixelado ---------------- */
let STEPS = [];
function stepsInit() {
  STEPS = []; let last = null;
  for (let t = 0; t < FILM.DUR; t += 1 / 60) { const A = agAt(t); if (!A || A.insert || A.hide) { last = null; continue; } const k = A.step | 0; if (last !== null && k !== last && A.walk) STEPS.push([t, A.x + (k & 1 ? -14 : 14), A.z]); last = k; }
}
function inPuddle(x, z) { for (const P of PUDDLES) if (((x - P.x) / P.rx) ** 2 + ((z - P.z) / P.rz) ** 2 < 1.1) return true; return false; }
function puddleFx(t) {
  for (const [ts, x, z] of STEPS) {
    const age = t - ts; if (age < 0 || age > 1.8 || !inPuddle(x, z)) continue;
    const c = PJ(x, 0, z), s = PS(z);
    for (let k = 0; k < 3; k++) { const ak = age - k * .16; if (ak < 0) continue; const r = (5 + ak * 60) * s; ctx.strokeStyle = `rgba(250,248,240,${.75 * Math.exp(-ak * 1.6)})`; ctx.lineWidth = Math.max(.8, 1.6 * s); ctx.beginPath(); ctx.ellipse(c[0], c[1], r, r * (-CAM.y + 10) / Math.max(60, z - CAM.z) * 1.4, 0, 0, TAU); ctx.stroke(); }
  }
  if (FILM.agNow) agReflect(FILM.agNow, t);
  hangingScreens(t, true);
}

/* ---------------- bloque 3: tres cristales viejos cuelgan del techo y se encienden como pantallas ---------------- */
const SCREENS = [{ x: -620, key: 'kurenai', t: 98.4 }, { x: 0, key: 'juramento', t: 100.5 }, { x: 620, key: 'invernadero', t: 103.3 }];
const SCR_Z = 950, SCR_W = 300, SCR_H = 169, SCR_Y1 = -330;   // borde de abajo
let SCRIMG = {};
function screensLoad() { for (const S of SCREENS) { const im = new Image(); im.src = FRAMES[S.key]; SCRIMG[S.key] = im; } }
function screenOn(S, t) { return sm((t - S.t) / .9) * (1 - sm((t - 110.6) / 1.4)); }
function screenRect(S, mirror) { const y0 = SCR_Y1 - SCR_H, a = PJ(S.x - SCR_W / 2, mirror ? -y0 : y0, SCR_Z), b = PJ(S.x + SCR_W / 2, mirror ? -SCR_Y1 : SCR_Y1, SCR_Z); return [a[0], a[1], b[0] - a[0], b[1] - a[1]]; }
function hangingScreens(t, mirror = false) {
  if (t < 86 || t > 113 || SCR_Z - CAM.z < 40) return;
  const s = PS(SCR_Z), vis = sm((t - 86) / 1.5) * (1 - sm((t - 111.5) / 1.5));
  for (const S of SCREENS) {
    const [x, y, w, h] = screenRect(S, mirror), on = screenOn(S, t), im = SCRIMG[S.key];
    if (x > SW / 2 + 50 || x + w < -SW / 2 - 50) continue;
    ctx.save(); ctx.globalAlpha = vis * (mirror ? .55 : 1);
    if (!mirror) { ctx.strokeStyle = cssc(IRON, .85); ctx.lineWidth = Math.max(.7, 1.6 * s); for (const dx of [.1, .9]) { ctx.beginPath(); ctx.setLineDash([3 * s, 2 * s]); ctx.moveTo(x + w * dx, y); ctx.lineTo(x + w * dx + (dx - .5) * 30 * s, -560); ctx.stroke(); } ctx.setLineDash([]); }
    /* vidrio viejo apagado: verde grisáceo con brillo */
    ctx.fillStyle = 'rgba(176,192,184,.55)'; ctx.fillRect(x, y, w, h);
    if (on > .01 && im && im.complete) {   /* se enciende como tinta que sangra desde el centro */
      ctx.save(); ctx.beginPath(); const R = Math.hypot(w, h) * .62 * easeOut((t - S.t) / 1.3); for (let k = 0; k <= 40; k++) { const a = k / 40 * TAU, rr = R * (1 + .18 * N2(Math.cos(a) * 2 + S.t, Math.sin(a) * 2)); ctx.lineTo(x + w / 2 + Math.cos(a) * rr, y + h / 2 + Math.sin(a) * rr * .7); } ctx.closePath(); ctx.clip();
      const z = 1 + .05 * clamp((t - S.t) / 10); ctx.globalAlpha = vis * on * (mirror ? .5 : 1);
      if (mirror) { ctx.translate(0, y + h / 2); ctx.scale(1, -1); ctx.translate(0, -(y + h / 2)); }
      ctx.drawImage(im, x - w * (z - 1) / 2, y - h * (z - 1) / 2, w * z, h * z); ctx.restore();
    }
    ctx.globalAlpha = vis * (mirror ? .55 : 1);
    const gx = x + ((t * 60 * s) % (w * 2)) - w * .5, gr = ctx.createLinearGradient(gx, y, gx + w * .3, y + h); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(.5, `rgba(255,252,240,${.1 + .1 * on})`); gr.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = gr; ctx.fillRect(x, y, w, h);
    /* marco y parteluz de hierro */
    ctx.strokeStyle = cssc(IRON, .95); ctx.lineWidth = Math.max(1, 6 * s); ctx.strokeRect(x, y, w, h); ctx.lineWidth = Math.max(.7, 2.4 * s); ctx.beginPath(); ctx.moveTo(x + w / 3, y); ctx.lineTo(x + w / 3, y + h); ctx.moveTo(x + w * 2 / 3, y); ctx.lineTo(x + w * 2 / 3, y + h); ctx.moveTo(x, y + h / 2); ctx.lineTo(x + w, y + h / 2); ctx.stroke();
    ctx.restore();
    if (!mirror && on > .05) LGF(x + w / 2, y + h / 2, 260 * s, '255,236,200', .22 * on);
  }
}
/* ---------------- bloque 5: la caja de cultivo con tapas de vidrio (un xilófono de cristal) ---------------- */
const CFZ = 560, CFL = [];   // tapas: x, ancho, nota
{ const xs = [-300, -210, -122, -36, 48, 130, 210], ws = [86, 82, 78, 74, 70, 66, 62], NOTES = [72, 74, 76, 79, 81, 84, 86]; xs.forEach((x, i) => CFL.push({ x, w: ws[i], n: NOTES[i], h: 46 - i * 2.5 })); }
let CFHITS = [];   // [t, índice] lo llena la película
function coldFrame(t) {
  const s = PS(CFZ); if (CFZ - CAM.z < 40) return;
  /* caja de madera */
  const a = PJ(-350, 0, CFZ), b = PJ(250, -24, CFZ);
  ctx.fillStyle = cssc(WOOD); ctx.fillRect(a[0], b[1], b[0] - a[0], a[1] - b[1]);
  ctx.strokeStyle = 'rgba(40,28,20,.6)'; ctx.lineWidth = Math.max(.6, 1.2 * s); for (let k = 1; k < 3; k++) { const y = lerp(b[1], a[1], k / 3); ctx.beginPath(); ctx.moveTo(a[0], y); ctx.lineTo(b[0], y); ctx.stroke(); }
  CFL.forEach((L, i) => {
    let glow = 0, press = 0; for (const [th, j] of CFHITS) if (j === i) { const d = t - th; if (d >= 0 && d < 1.6) { glow = Math.max(glow, Math.exp(-d * 2.6)); press = Math.max(press, d < .18 ? Math.sin(d / .18 * PI) : 0); } }
    const x0 = L.x - L.w / 2, x1 = L.x + L.w / 2, yb = -28 + press * 3, yt = yb - L.h;
    const q = [PJ(x0, yb, CFZ - 6), PJ(x1, yb, CFZ - 6), PJ(x1, yt, CFZ + 30), PJ(x0, yt, CFZ + 30)];
    ctx.fillStyle = `rgba(${lerp(226, 255, glow) | 0},${lerp(236, 232, glow) | 0},${lerp(232, 160, glow) | 0},${.62 + glow * .35})`;
    ctx.beginPath(); q.forEach((p, k) => k ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = cssc(shc(WOOD, -.2)); ctx.lineWidth = Math.max(.8, 3 * s); ctx.stroke();
    ctx.strokeStyle = `rgba(255,255,248,${.5 + glow * .5})`; ctx.lineWidth = Math.max(.6, 1.2 * s); ctx.beginPath(); ctx.moveTo(...L2(q[0], q[3], .2)); ctx.lineTo(...L2(q[1], q[2], .5)); ctx.stroke();
    if (glow > .02) { const c = L2(q[0], q[2], .5); LGF(c[0], c[1], 90 * s, '255,226,150', .5 * glow); }
  });
}
/* notas que suben de cada tapa (glifos a tinta) */
function notesFx(t) {
  for (const [th, j] of CFHITS) {
    const d = t - th; if (d < 0 || d > 2.4) continue; const L = CFL[j], p = PJ(L.x + Math.sin(d * 3 + j) * 10, -80 - d * 90, CFZ), s = PS(CFZ);
    ctx.save(); ctx.globalAlpha = (1 - sm(d / 2.4)) * sm(d / .15); hand(j % 2 ? '♪' : '♫', p[0], p[1], 34 * s, 'rgba(60,40,96,.9)', { serif: true }); ctx.restore();
  }
}

/* ---------------- transición de tinta: B aparece sobre A desde un mapa de llegada (centro o barrido) ---------------- */
const WIPE = {};
function wipeMap(key, mode, cx = .5, cy = .5) {
  const w = Math.ceil(W / 6), h = Math.ceil(H / 6), id = key + w + 'x' + h; if (WIPE[id]) return WIPE[id];
  const A = new Float32Array(w * h); let mx = 0;
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const u = i / w, v = j / h, n = FBM(u * 4 + key.length * 3.1, v * 4, 4) * .5 + FBM(u * 13, v * 13 + 7, 3) * .12;
    const d = mode === 'sweep' ? u * .9 + Math.abs(v - .5) * .15 : Math.hypot((u - cx) * 1.6, v - cy);
    const a = d + n * (mode === 'sweep' ? .5 : .6); A[j * w + i] = a; if (a > mx) mx = a;
  }
  let mn = 1e9; for (const a of A) mn = Math.min(mn, a); for (let k = 0; k < A.length; k++) A[k] = (A[k] - mn) / (mx - mn);
  const m = mk(w, h), r = mk(w, h);
  return (WIPE[id] = { A, w, h, m, r, mi: m.getContext('2d').createImageData(w, h), ri: r.getContext('2d').createImageData(w, h) });
}
let BUFA = null, BUFB = null;
function onResize() { BUFA = mk(W, H); BUFB = mk(W, H); }
/* drawA y drawB dibujan en ctx; p de 0 a 1 */
function inkWipe(drawA, drawB, p, key = 'a', mode = 'center', cx, cy) {
  if (p <= 0) { drawA(); return; } if (p >= 1) { drawB(); return; }
  drawA(); BUFA.getContext('2d').drawImage(cv, 0, 0);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  drawB(); const gb = BUFB.getContext('2d'); gb.globalCompositeOperation = 'source-over'; gb.drawImage(cv, 0, 0);
  const M = wipeMap(key, mode, cx, cy), th = p * 1.18 - .09, md = M.mi.data, rd = M.ri.data;
  for (let k = 0; k < M.A.length; k++) { const e = (th - M.A[k]) / .045, a = clamp(e), ring = e > -.3 && e < 1.6 ? Math.exp(-((e - .5) ** 2) * 2.5) : 0; md[k * 4 + 3] = a * 255; rd[k * 4] = 150; rd[k * 4 + 1] = 112; rd[k * 4 + 2] = 76; rd[k * 4 + 3] = ring * 110; }
  M.m.getContext('2d').putImageData(M.mi, 0, 0); M.r.getContext('2d').putImageData(M.ri, 0, 0);
  gb.globalCompositeOperation = 'destination-in'; gb.imageSmoothingEnabled = true; gb.drawImage(M.m, 0, 0, W, H); gb.globalCompositeOperation = 'source-over';
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(BUFA, 0, 0); ctx.drawImage(BUFB, 0, 0);
  ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = .9; ctx.drawImage(M.r, 0, 0, W, H); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; T0();
}
