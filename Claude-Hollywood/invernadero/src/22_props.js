/* =====================================================================
   UTILERÍA Y PLANTAS
   · mesas de madera podrida con macetas de barro, frascos de alquimia y herramientas: sprites en acuarela
   · estanterías de metal con frascos (vivas: se funden y los frascos estallan)
   · helechos, helechos arborescentes, plataneras, palmeras, enredaderas que cuelgan del techo y raíces
     con enredaderas luminiscentes: vivos, reaccionan al viento, al trueno, al fuego y a los pulsos
   ===================================================================== */
const WOOD = [70, 52, 40], TERRA = [126, 74, 56], RUST = [104, 64, 46], GLASSC = [150, 170, 168], LEAF = [44, 66, 50], ASH = [26, 24, 26];
/* ---------- frascos de alquimia (vidrio: contorno a plumilla + tinte + brillo de papel reservado) ---------- */
function drawFlask(g, x, y, kind, h, r) {
  const ink = (pts, w = .8, a = .8) => wcInk(g, pts, w, a, x * .3 + h, .06, [22, 26, 30]);
  let body;
  if (kind === 0) { const rr = h * .32; body = ellP(x, y - rr, rr, rr, 22, -PI * .62, PI * 1.62).concat([[x - rr * .22, y - rr * 2 - h * .45], [x + rr * .22, y - rr * 2 - h * .45]]).reverse(); }   // matraz redondo de cuello largo
  else if (kind === 1) body = [[x - h * .34, y], [x + h * .34, y], [x + h * .1, y - h * .62], [x + h * .1, y - h], [x - h * .1, y - h], [x - h * .1, y - h * .62]];   // cónico
  else if (kind === 2) body = rectP(x - h * .12, y - h, h * .24, h);   // probeta
  else { const rr = h * .3; body = ellP(x, y - rr, rr * 1.1, rr, 20).concat([]); }   // retorta (bola) + cuello curvo aparte
  g.save(); g.globalCompositeOperation = 'source-over'; g.fillStyle = cssc(mixc(GLASSC, [60, 70, 76], r() * .5), .28 + r() * .2); g.fill(pPolys([body])); g.restore();
  if (r() < .5) { g.save(); g.clip(pPolys([body])); g.fillStyle = cssc(r() < .5 ? [80, 96, 60] : [110, 70, 80], .45); g.fillRect(x - h, y - h * .16, h * 2, h * .2); g.restore(); }   // residuo seco
  ink([...body, body[0]], .9, .75);
  if (kind === 3) ink([[x + h * .2, y - h * .5], [x + h * .55, y - h * .75], [x + h * .95, y - h * .5]], 1.6, .8);
  g.save(); g.globalCompositeOperation = 'source-over'; g.strokeStyle = 'rgba(244,240,228,.75)'; g.lineWidth = Math.max(.8, h * .05); g.lineCap = 'round'; g.beginPath(); g.moveTo(x - h * .12, y - h * .25); g.quadraticCurveTo(x - h * .16, y - h * .45, x - h * .08, y - h * .58); g.stroke(); g.restore();
  if (r() < .35) { g.fillStyle = 'rgba(80,58,40,.9)'; g.fillRect(x - h * .07, y - h * (kind === 0 ? 1.12 : 1.06), h * .14, h * .1); }   // corcho
}
function drawPot(g, x, y, h, r, o = {}) {
  const w = h * (.8 + r() * .3), tilt = o.tipped ? (r() < .5 ? -1 : 1) * 1.45 : 0;
  g.save(); g.translate(x, y); g.rotate(tilt); if (tilt) g.translate(0, -w * .4 + h * .5);
  const body = [[-w * .38, 0], [w * .38, 0], [w * .5, -h * .82], [-w * .5, -h * .82]], rim = rectP(-w * .56, -h, w * 1.12, h * .2);
  wcWash(g, body, mixc(TERRA, [90, 70, 60], r() * .4), .9, { amt: .5, seed: x + h, bloom: r() < .4 ? [70, 96, 60] : null, step: 4 });
  wcWash(g, rim, shc(TERRA, -.08), .92, { amt: .4, seed: x + 3, step: 4 });
  wcInk(g, [...body.slice(1), body[0]], .8, .6, x, .2, [40, 22, 18]);
  if (o.crack) wcInk(g, [[w * .1, -h * .8], [w * .02, -h * .5], [w * .14, -h * .3], [w * .06, -h * .05]], .9, .8, x + 9, .05, [30, 18, 16]);
  if (o.broken) { g.save(); g.globalCompositeOperation = 'destination-out'; g.beginPath(); g.moveTo(w * .1, -h * 1.02); g.lineTo(w * .6, -h * 1.02); g.lineTo(w * .6, -h * .4); g.lineTo(w * .32, -h * .62); g.lineTo(w * .22, -h * .78); g.closePath(); g.fill(); g.restore(); }
  /* tierra y lo que queda de la planta */
  if (!o.tipped) {
    if (o.dead) { for (let k = 0; k < 3 + (r() * 3 | 0); k++) { const a = -PI / 2 + (r() - .5) * 1.4, l = h * (.6 + r() * .9); wcInk(g, [[(r() - .5) * w * .3, -h], [Math.cos(a) * l * .5, -h + Math.sin(a) * l * .5], [Math.cos(a + (r() - .5)) * l, -h + Math.sin(a) * l]], .9, .8, x + k, .05, [46, 36, 30]); } }
    else if (o.plant) { for (let k = 0; k < 6; k++) { const a = -PI / 2 + (k - 2.5) * .38, l = h * (.7 + r() * .6), tip = [Math.cos(a) * l, -h + Math.sin(a) * l], mid = [tip[0] * .5 + (r() - .5) * 4, -h + (tip[1] + h) * .6]; wcWash(g, [[0, -h], [mid[0] - 3, mid[1]], tip, [mid[0] + 3, mid[1]]], mixc(LEAF, [70, 96, 64], r()), .85, { amt: .4, seed: k + x, step: 3 }); } }
  } else { g.fillStyle = 'rgba(52,40,32,.85)'; g.beginPath(); g.ellipse(0, -h * 1.1, w * .5, h * .18, 0, 0, TAU); g.fill(); }
  g.restore();
}
function drawTool(g, x, y, kind, r) {
  const ink = (p, w, a = .9, c = [30, 22, 20]) => wcInk(g, p, w, a, x + kind, .05, c);
  if (kind === 0) { /* desplantador */ wcWash(g, [[x, y - 3], [x + 30, y - 6], [x + 46, y - 3], [x + 30, y]], RUST, .9, { amt: .4, seed: x, step: 3 }); ink([[x - 26, y - 4], [x, y - 3.5]], 4, .9, [70, 50, 34]); }
  else if (kind === 1) { /* tijeras de podar abiertas */ ink([[x, y - 2], [x + 34, y - 14]], 2.6, .9, [80, 52, 40]); ink([[x, y - 2], [x + 36, y - 1]], 2.6, .9, [80, 52, 40]); ink([[x - 4, y - 1], [x - 26, y + 1]], 4, .85, [60, 40, 30]); ink([[x - 4, y - 3], [x - 24, y - 9]], 4, .85, [60, 40, 30]); }
  else if (kind === 2) { /* rastrillo de mano */ ink([[x, y - 70], [x + 4, y]], 3.2, .9, [70, 50, 34]); for (let k = -2; k <= 2; k++) ink([[x - 1 + k * 6, y - 74], [x + k * 7.5, y - 92]], 1.6, .9, RUST); ink([[x - 14, y - 74], [x + 14, y - 74]], 2.6, .9, RUST); }
  else { /* regadera */ const b = [[x - 22, y], [x + 18, y], [x + 16, y - 34], [x - 20, y - 34]]; wcWash(g, b, mixc(RUST, [70, 84, 84], .4), .9, { amt: .5, seed: x, step: 4 }); ink([[x + 14, y - 10], [x + 46, y - 40]], 3, .9, [60, 60, 60]); ink(ellP(x - 2, y - 40, 14, 12, 12, PI, TAU), 2, .8, [60, 60, 60]); }
}
/* mesa de madera podrida con lo que hay encima (sprite) */
function makeTable(seed, w = 200, d = 2.2) {
  const r = mulberry32(seed), hT = 84, box = [-w / 2 - 50, -hT - 140, w / 2 + 50, 6], S = spr(box, d), g = S.g;
  /* patas y travesaño (las del fondo más claras: neblina) */
  for (const [x, back] of [[-w / 2 + 16, 1], [w / 2 - 22, 1], [-w / 2 + 8, 0], [w / 2 - 14, 0]]) wcWash(g, [[x, -hT + 6], [x + 9, -hT + 6], [x + 10 + (r() - .5) * 2, 0], [x - 1, 0]], back ? mixc(WOOD, [90, 92, 96], .3) : WOOD, .92, { amt: .4, seed: x + seed, step: 6 });
  wcWash(g, rectP(-w / 2 + 6, -hT * .36, w - 14, 7), shc(WOOD, -.1), .9, { amt: .5, seed: seed + 2, step: 6 });
  /* estante bajo con macetas apiladas */
  for (let k = 0; k < 3; k++) drawPot(g, -w * .3 + k * 30 + r() * 10, -hT * .36, 22 + r() * 6, r, { tipped: k === 2 && r() < .5 });
  /* tablero alabeado y comido por la humedad */
  const top = [[-w / 2, -hT], [w / 2, -hT - 2], [w / 2 + 2, -hT + 9], [w / 2 - 30, -hT + 10], [w / 2 - 40, -hT + 14], [w / 2 - 56, -hT + 9], [-w / 2 - 2, -hT + 10]];
  wcWash(g, top, mixc(WOOD, [96, 74, 54], .3), .95, { amt: .6, seed: seed + 5, bloom: [60, 80, 54], step: 6 });
  for (let k = 0; k < 3; k++) wcInk(g, [[-w / 2 + 6, -hT + 3 + k * 2.5], [w / 2 - 20 - r() * 40, -hT + 3 + k * 2.2]], .6, .45, seed + k, .3, [36, 24, 18]);
  wcWash(g, ellP(-w * .2 + r() * w * .3, -hT + 1, 30 + r() * 30, 5, 12), [60, 84, 52], .55, { amt: 2, seed: seed + 9 });   // musgo
  /* encima: macetas, frascos y herramientas */
  let x = -w / 2 + 14 + r() * 10;
  while (x < w / 2 - 20) {
    const k = r();
    if (k < .38) { const h = 24 + r() * 26; drawPot(g, x + h * .5, -hT, h, r, { dead: r() < .55, plant: r() < .4, crack: r() < .3, broken: r() < .2, tipped: r() < .12 }); x += h * 1.05 + r() * 8; }
    else if (k < .75) { const h = 28 + r() * 34; drawFlask(g, x + h * .3, -hT, r() * 4 | 0, h, r); x += h * .7 + r() * 6; }
    else if (k < .9) { drawTool(g, x + 22, -hT, r() < .5 ? 0 : 1, r); x += 64; }
    else { /* bandeja de semillero */ wcWash(g, rectP(x, -hT - 9, 46, 9), shc(WOOD, -.15), .9, { amt: .4, seed: x, step: 4 }); x += 54; }
  }
  if (r() < .6) drawTool(g, w / 2 + 6, 0, r() < .5 ? 2 : 3, r);   // apoyada en la pata
  /* telarañas entre pata y tablero */
  g.strokeStyle = 'rgba(220,220,214,.35)'; g.lineWidth = .4; for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(-w / 2 + 12, -hT + 10 + k * 5); g.quadraticCurveTo(-w / 2 + 22 + k * 3, -hT + 16, -w / 2 + 14 + k * 7, -hT + 10); g.stroke(); }
  wcTex(g, S.c.width, S.c.height, .45, .3);
  nightBake(S, '112,118,146');
  return S;
}
function jarSprites() {
  const out = [];
  for (let i = 0; i < 10; i++) { const r = mulberry32(900 + i), h = 18 + r() * 18, S = spr([-h * .7, -h * 1.25, h * 1.1, 2], 3.2); drawFlask(S.g, 0, 0, i % 4, h, r); nightBake(S, '150,156,180'); out.push({ S, h }); }
  return out;
}
let TABLES = [], JARS = [];
/* dónde está cada cosa: [x, z, semilla, ancho] */
const TABLE_AT = [[-900, 1130, 11, 220], [900, 1150, 12, 200], [-1700, 1180, 13, 220], [1650, 1160, 14, 220], [-1150, 620, 15, 210], [-800, 640, 16, 190], [850, 600, 17, 200], [-1450, 610, 18, 200], [720, 812, 19, 150], [1040, 830, 20, 170]];
function drawSprite(S, x, y, z, a = 1) {
  const s = PS(z), p = PJ(x, y, z); if (z - CAM.z < 30) return;
  const w = (S.box[2] - S.box[0]) * s; if (p[0] + S.box[2] * s < -SW / 2 || p[0] + S.box[0] * s > SW / 2) return;
  ctx.globalAlpha = a; ctx.drawImage(S.c, p[0] + S.box[0] * s, p[1] + S.box[1] * s, w, (S.box[3] - S.box[1]) * s); ctx.globalAlpha = 1;
}
/* ---------- estanterías de metal (se funden, los frascos estallan) ---------- */
const SHELVES = [{ x: 150, z: 1320, tHit: 39.75, hit: [40, -150] }, { x: 960, z: 1260, tHit: 39.85, hit: [-30, -90] }, { x: -1250, z: 1300 }];
for (const S of SHELVES) { S.jars = []; const r = mulberry32(S.x); for (let sh = 0; sh < 4; sh++) for (let k = 0; k < 7; k++) { const jx = -66 + k * 22 + (r() - .5) * 6, jy = -46 - sh * 58; S.jars.push({ x: jx, y: jy, v: r() * 10 | 0, tb: S.tHit ? S.tHit + .08 + Math.hypot(jx - S.hit[0], jy - S.hit[1]) * .004 + r() * .5 : 1e9 }); } }
function shelfMelt(S, t) { return S.tHit ? sm((t - S.tHit) / 1.6) : 0; }
function drawShelf(S, t) {
  const z = S.z, s = PS(z), m = shelfMelt(S, t), heat = S.tHit ? clamp((t - S.tHit) / .3) * (1 - sm((t - S.tHit - 2) / 6)) : 0;
  const sag = (x, y) => S.tHit ? m * 60 * Math.exp(-((x - S.hit[0]) ** 2 + (y - S.hit[1]) ** 2) / 5000) : 0;
  const P = (x, y) => PJ(S.x + x, y + sag(x, y), z);
  const p0 = P(0, 0); if (p0[0] < -SW / 2 - 200 || p0[0] > SW / 2 + 200) return;
  ctx.strokeStyle = cssc(mixc(IRON, [60, 58, 62], .3)); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const line = (pts, w) => { ctx.lineWidth = Math.max(.7, w * s); ctx.stroke(pLine(pts)); };
  for (const x of [-80, 80]) { const pts = []; for (let k = 0; k <= 12; k++) pts.push(P(x, -k * 20)); line(pts, 5); }
  for (let sh = 0; sh < 4; sh++) { const y = -42 - sh * 58, pts = []; for (let k = 0; k <= 16; k++) pts.push(P(-82 + k * 164 / 16, y)); line(pts, 4); }
  /* metal al rojo donde pegó el chorro */
  if (heat > .01) { const c = P(S.hit[0], S.hit[1]); LGT(c[0], c[1], 160 * s, '255,140,60', .7 * heat); }
  for (const j of S.jars) {
    if (t >= j.tb) continue;
    const J = JARS[j.v]; drawSprite(J.S, S.x + j.x, j.y + sag(j.x, j.y) - 2, z);
  }
}
/* ---------- plantas vivas ---------- */
/* fronda: espina curva con folíolos alternos. o: sway, vib, wither, flat, pull (hacia un punto) */
function frond(base, ang, Lf, o, Pd, Pl, Ps, seed) {
  const n = 16, pts = [];
  const wither = o.wither || 0, droop = .55 + wither * .5 + (o.flat || 0) * 1.2;
  let a = ang, p = base;
  for (let i = 0; i <= n; i++) {
    pts.push(p); const f = i / n;
    a += droop * .12 * (Math.cos(ang) >= 0 ? 1 : -1) + (o.sway || 0) * .05 * f + (o.vib || 0) * Math.sin(seed * 7 + i * 2.3) * .07;
    p = [p[0] + Math.cos(a) * Lf / n * (1 - wither * .55), p[1] + Math.sin(a) * Lf / n * (1 - wither * .55)];
  }
  if (o.pull) { for (let i = 1; i <= n; i++) { const f = i / n, d = sub(o.pull[0], pts[i]), l = len(d) || 1; pts[i] = add(pts[i], d, Math.min(l * .6, o.pull[1] * f * 80) / l); } }
  Ps.moveTo(...pts[0]); for (const q of pts) Ps.lineTo(...q);
  const lw = Lf * (o.pin || .11);
  for (let i = 2; i < n; i++) {
    if (wither > .4 && hsh(seed + i, 3) < (wither - .4) * 1.6) continue;   // se caen los folíolos quemados
    const q = pts[i], d = nrm2(sub(pts[i + 1], pts[i - 1])), nn = [-d[1], d[0]], size = lw * Math.sin((i / n) * PI) * (1 + .2 * hsh(seed, i));
    for (const sg of [-1, 1]) { const P = (nn[1] * sg < 0) ? Pl : Pd, dir = add([d[0] * .55, d[1] * .55], nn, sg), tip = add(q, dir, size); P.moveTo(...q); P.lineTo(...add(add(q, d, size * .25), nn, sg * size * .25)); P.lineTo(...tip); P.lineTo(...add(q, d, -size * .2)); P.closePath(); }
  }
  return pts;
}
function fernAt(x, z, size, seed, o, t) {
  const s = PS(z), b = PJ(x, 0, z); if (z - CAM.z < 30 || b[0] < -SW / 2 - size * s * 1.5 || b[0] > SW / 2 + size * s * 1.5) return;
  const Pd = new Path2D(), Pl = new Path2D(), Ps = new Path2D(), nF = 9;
  for (let k = 0; k < nF; k++) { const ang = -PI / 2 + (k / (nF - 1) - .5) * 2.4 + Math.sin(t * .8 + seed + k) * .03 * (1 + (o.windK || 0) * 4), Lf = size * (.7 + .4 * hsh(seed, k)) * s; frond(b, ang, Lf, { ...o, sway: (o.sway || 0) }, Pd, Pl, Ps, seed + k * 13); }
  const wc = o.wither || 0, c1 = mixc(mixc(LEAF, [30, 40, 34], .3), ASH, wc), c2 = mixc(mixc(LEAF, [72, 98, 70], .35), mixc(ASH, [60, 56, 52], .3), wc);
  ctx.fillStyle = cssc(c1, .95); ctx.fill(Pd); ctx.fillStyle = cssc(c2, .92); ctx.fill(Pl);
  ctx.strokeStyle = cssc(shc(c1, -.3), .9); ctx.lineWidth = Math.max(.5, 1.6 * s); ctx.stroke(Ps);
  if (o.lit) { ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = `rgba(${o.lit[0]},${o.lit[1]})`; ctx.fill(Pl); ctx.strokeStyle = `rgba(${o.lit[0]},${o.lit[1] * .9})`; ctx.stroke(Ps); ctx.restore(); }
}
function treeFern(x, z, h, seed, o, t) {
  const s = PS(z), b = PJ(x, 0, z); if (z - CAM.z < 30 || b[0] < -SW / 2 - h * s * 1.6 || b[0] > SW / 2 + h * s * 1.6) return;
  const top = PJ(x + Math.sin(seed) * 14 + (o.lean || 0) * h, -h, z), tr = [];
  for (let k = 0; k <= 10; k++) { const f = k / 10; tr.push([lerp(b[0], top[0], f) + Math.sin(f * 3 + seed) * 6 * s, lerp(b[1], top[1], f)]); }
  ctx.fillStyle = cssc([34, 28, 26]); ctx.fill(pPolys([stripP(tr, f => (16 - f * 5) * s)]));
  ctx.strokeStyle = 'rgba(70,54,44,.6)'; ctx.lineWidth = Math.max(.5, 1.2 * s); for (let k = 1; k < 10; k++) { const p = tr[k]; ctx.beginPath(); ctx.moveTo(p[0] - 7 * s, p[1]); ctx.lineTo(p[0] + 6 * s, p[1] - 3 * s); ctx.stroke(); }
  const Pd = new Path2D(), Pl = new Path2D(), Ps = new Path2D(), nF = 14;
  for (let k = 0; k < nF; k++) { const ang = -PI / 2 + (k / (nF - 1) - .5) * 3.9 + Math.sin(t * .7 + seed + k) * .025 * (1 + (o.windK || 0) * 4) + (o.sway || 0) * .05, Lf = h * (.55 + .3 * hsh(seed, k)) * s; frond(top, ang, Lf, { ...o, pin: .14 }, Pd, Pl, Ps, seed + k * 7); }
  /* báculos enroscados en el centro de la copa */
  ctx.strokeStyle = 'rgba(40,52,40,.95)'; ctx.lineWidth = Math.max(.6, 2.2 * s); for (let k = 0; k < 3; k++) { const sp = []; for (let i = 0; i <= 14; i++) { const a = -PI / 2 + (k - 1) * .5 + i / 14 * 5.5, r = (14 - i * .8) * s; sp.push([top[0] + (k - 1) * 10 * s + Math.cos(a) * r, top[1] - 22 * s + i * -.5 * s + Math.sin(a) * r * .8]); } ctx.stroke(pLine(sp)); }
  const wc = o.wither || 0, c1 = mixc([30, 44, 36], ASH, wc), c2 = mixc([56, 78, 58], ASH, wc);
  ctx.fillStyle = cssc(c1, .96); ctx.fill(Pd); ctx.fillStyle = cssc(c2, .93); ctx.fill(Pl); ctx.strokeStyle = cssc(c1, .9); ctx.lineWidth = Math.max(.5, 2 * s); ctx.stroke(Ps);
  if (o.lit) { ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = `rgba(${o.lit[0]},${o.lit[1]})`; ctx.fill(Pl); ctx.restore(); }
}
/* platanera: hojas largas y anchas que salen a distintas alturas del pseudotallo, se arquean y se rasgan */
function bananaAt(x, z, h, seed, o, t) {
  const s = PS(z), b = PJ(x, 0, z); if (z - CAM.z < 30 || b[0] < -SW / 2 - h * s * 1.2 || b[0] > SW / 2 + h * s * 1.2) return;
  const top = PJ(x + 8, -h * .55, z), stem = [b, L2(b, top, .5), top];
  ctx.fillStyle = cssc([38, 44, 36]); ctx.fill(pPolys([stripP(stem, f => (18 - f * 6) * s)]));
  for (let k = 0; k < 5; k++) {
    const side = k % 2 ? 1 : -1, hy = .55 + k * .1, base = PJ(x + 8, -h * hy, z);
    const a = -PI / 2 + side * (.35 + k * .12) + Math.sin(t * .9 + k + seed) * .04 * (1 + (o.windK || 0) * 5) + (o.sway || 0) * .08 + (o.flat || 0) * side * .7;
    const L = h * (.6 + .2 * hsh(seed, k)) * s, pts = []; let p = base, aa = a;
    for (let i = 0; i <= 12; i++) { pts.push(p); aa += side * (.09 + (o.wither || 0) * .08); p = [p[0] + Math.cos(aa) * L / 12, p[1] + Math.sin(aa) * L / 12]; }
    const wf = f => Math.sin(Math.min(1, f * 1.05 + .04) * PI) * L * .17 * (f < .12 ? f / .12 : 1);
    const poly = stripP(pts, wf);
    ctx.fillStyle = cssc(mixc(mixc([34, 54, 40], [62, 86, 58], hsh(seed, k + 3) * .7), ASH, o.wither || 0), .94); ctx.fill(pPolys([poly]));
    ctx.strokeStyle = 'rgba(20,26,22,.75)'; ctx.lineWidth = Math.max(.5, 1.6 * s); ctx.stroke(pLine(pts));
    /* rasgados: tajos oscuros siguiendo las nervaduras */
    ctx.lineWidth = Math.max(.4, .8 * s); ctx.strokeStyle = 'rgba(16,20,18,.8)';
    for (let i = 2; i < 12; i++) { if (hsh(seed + k, i) > .45) continue; const q = pts[i], d = nrm2(sub(pts[i + 1], pts[i - 1])), w = wf(i / 12) * .5, sg = hsh(seed, i + k) < .5 ? 1 : -1; ctx.beginPath(); ctx.moveTo(q[0] - d[1] * w * sg * .2, q[1] + d[0] * w * sg * .2); ctx.lineTo(q[0] - d[1] * w * sg + d[0] * w * .7, q[1] + d[0] * w * sg + d[1] * w * .7); ctx.stroke(); }
  }
}
/* enredaderas que cuelgan de las costillas del techo: péndulo + viento, hojas en corazón */
const VINES = []; { const r = mulberry32(71); for (let i = 0; i < 26; i++) { const th = .35 + r() * 1.6, x = -1500 + r() * 3000; VINES.push({ x, th, L: 180 + r() * 420, ph: r() * 9, seed: i }); } }
function vineAt(V, t, wind) {
  const a0 = ribP(V.x, V.th); if (a0[2] - CAM.z < 60) return;
  const n = 14, pts = [];
  for (let i = 0; i <= n; i++) { const f = i / n, sw = Math.sin(t * (.9 + V.seed % 3 * .2) + V.ph + f * 1.5) * 18 * f + wind * f * f * 260 + Math.sin(t * 7 + V.seed + f * 4) * Math.abs(wind) * 20 * f; pts.push(PJ(a0[0] + sw, a0[1] + f * V.L, a0[2])); }
  const s = PS(a0[2]); if (pts[0][0] < -SW / 2 - 200 && pts[n][0] < -SW / 2 - 200) return; if (pts[0][0] > SW / 2 + 200 && pts[n][0] > SW / 2 + 200) return;
  ctx.strokeStyle = 'rgba(24,28,24,.95)'; ctx.lineWidth = Math.max(.7, 2.6 * s); ctx.stroke(pLine(pts));
  const P = new Path2D();
  for (let i = 1; i <= n; i++) { const q = pts[i], sz = (12 + 6 * hsh(V.seed, i)) * s, sg = i & 1 ? 1 : -1, c = [q[0] + sg * sz * .8, q[1] + sz * .3]; P.moveTo(...q); P.quadraticCurveTo(c[0] + sg * sz * .8, c[1] - sz * .8, c[0], c[1] + sz * .7); P.quadraticCurveTo(c[0] - sg * sz * .9, c[1] - sz * .2, q[0], q[1]); }
  ctx.fillStyle = 'rgba(40,58,44,.92)'; ctx.fill(P);
}
/* raíces gruesas que rompieron el pavimento, con enredaderas luminiscentes */
const ROOTS = []; { const r = mulberry32(81); for (let i = 0; i < 6; i++) { const x0 = -230 + r() * 200 + i * 60, z0 = 1100 + r() * 140, x1 = x0 + 90 + r() * 160, z1 = z0 + (r() - .5) * 80, h = 50 + r() * 90; ROOTS.push({ x0, z0, x1, z1, h, w: 13 + r() * 10, seed: i }); } }
function rootTube(R, k = 1) {
  const pts = [], ws = [];
  for (let i = 0; i <= 16; i++) { const f = i / 16, x = lerp(R.x0, R.x1, f), z = lerp(R.z0, R.z1, f), y = -Math.sin(f * PI) * R.h * k + N2(f * 3, R.seed) * 8; pts.push(PJ(x, y, z)); ws.push(R.w * (1 - Math.abs(f - .5) * .6) * PS(z)); }
  return { pts, ws };
}
function drawRoots(t) {
  for (const R of ROOTS) {
    const { pts, ws } = rootTube(R); if (pts[0][0] > SW / 2 + 200 || pts[16][0] < -SW / 2 - 200) continue;
    ctx.fillStyle = 'rgb(40,32,28)'; ctx.fill(pPolys([stripP(pts, f => ws[Math.round(f * 16)])]));
    ctx.strokeStyle = 'rgba(96,78,62,.5)'; ctx.lineWidth = 1; ctx.stroke(pLine(pts.map((p, i) => [p[0], p[1] - ws[i] * .3])));
    /* enredadera luminiscente enroscada: bulbos de luz (papel reservado teñido) que laten despacio */
    const vine = []; for (let i = 0; i <= 32; i++) { const f = i / 32, j = Math.min(15, Math.floor(f * 16)), q = L2(pts[j], pts[j + 1], f * 16 - j), w = ws[j]; vine.push([q[0] + Math.cos(f * 22 + R.seed) * w * .55, q[1] + Math.sin(f * 22 + R.seed) * w * .4]); }
    ctx.strokeStyle = 'rgba(40,70,64,.9)'; ctx.lineWidth = 1.4; ctx.stroke(pLine(vine));
    for (let i = 2; i < 32; i += 3) { const q = vine[i], pulse = .55 + .45 * Math.sin(t * 1.4 + i * .7 + R.seed), r = (2.2 + 1.4 * hsh(i, R.seed)) * PS(R.z0); LGT(q[0], q[1], r * 7, '120,230,200', .32 * pulse * BIOLUM); ctx.fillStyle = `rgba(206,246,226,${.75 * pulse * BIOLUM + .1})`; ctx.beginPath(); ctx.arc(q[0], q[1], r, 0, TAU); ctx.fill(); }
  }
}
let BIOLUM = 1;
