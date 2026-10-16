/* =====================================================================
   SUELO · losas de piedra pintadas una vez vistas desde arriba y dibujadas en franjas con perspectiva
   (cada franja es afín: drawImage con su propia escala). Encima, vivos: luz de las ventanas
   con las sombras líquidas de la lluvia, charcos con reflejo del muro, quemaduras, grietas.
   ===================================================================== */
const FLN = { x0: -1400, x1: 1400, z0: 120, z1: 720, d: 2.0 }, FLF = { x0: -2300, x1: 2300, z0: 700, z1: 1600, d: 1.0 }, FLL = { x0: -2100, x1: 2300, z0: 820, z1: 1600, d: .6 };
const ROOTZ = { x0: -260, x1: 260, z0: 1080, z1: 1260 };   // donde las raíces rompieron el pavimento (en el centro, tras el pasillo)
function floorTex(F, kind) {
  const w = (F.x1 - F.x0) * F.d, h = (F.z1 - F.z0) * F.d, c = mk(w, h), g = c.getContext('2d');
  g.setTransform(F.d, 0, 0, F.d, -F.x0 * F.d, -F.z0 * F.d);   // coordenadas (x, z)
  if (kind === 'light') { lightPaint(g); return { ...F, c }; }
  if (kind === 'riv') { return { ...F, c }; }
  g.fillStyle = 'rgb(30,30,34)'; g.fillRect(F.x0, F.z0, F.x1 - F.x0, F.z1 - F.z0);
  const stone = [[64, 66, 68], [70, 68, 64], [58, 62, 66], [66, 64, 70], [60, 64, 58]];
  /* losas cuadradas fuera del pasillo; en el pasillo central (z 690–910) baldosas hidráulicas en diagonal con cenefa */
  const AIS = [690, 910], S = 75;
  for (let z = Math.floor(F.z0 / S) * S; z < F.z1; z += S) for (let x = Math.floor(F.x0 / S) * S; x < F.x1; x += S) {
    if (z + S > AIS[0] && z < AIS[1]) continue;
    const h1 = hsh(x * .13, z * .07), inRoot = x + S / 2 > ROOTZ.x0 && x + S / 2 < ROOTZ.x1 && z + S / 2 > ROOTZ.z0 && z + S / 2 < ROOTZ.z1;
    let q = rectP(x + 2, z + 2, S - 4, S - 4);
    if (inRoot) { const a = (h1 - .5) * .6, c0 = [x + S / 2, z + S / 2]; q = q.map(p => [c0[0] + (p[0] - c0[0]) * Math.cos(a) - (p[1] - c0[1]) * Math.sin(a), c0[1] + (p[0] - c0[0]) * Math.sin(a) + (p[1] - c0[1]) * Math.cos(a)]); if (h1 < .35) continue; }
    if (h1 < .03) continue;
    if (h1 > .9) { const c0 = [x + S * (.3 + hsh(x, z) * .4), z + S * .5]; for (const [i, j] of [[0, 1], [1, 2], [2, 3], [3, 0]]) wcWash(g, [q[i], q[j], c0], mixc(stone[(h1 * 50 | 0) % 5], [40, 44, 40], (i + j) * .05), .95, { reserve: false, mode: 'source-over', amt: .8, seed: x + i, step: 10 }); continue; }   // losa partida
    const col = mixc(stone[Math.floor(h1 * 5) % 5], [52, 64, 50], hsh(x, z + 9) * .3);
    wcWash(g, q, col, .96, { reserve: false, mode: 'source-over', amt: 1.1, seed: x * .1 + z, edgeA: .45, top: .07, bot: .12, step: 10 });
    if (h1 > .4 && h1 < .46) wcWash(g, wob(ellP(x + S / 2 + (h1 - .43) * 300, z + S / 2, 20 + h1 * 30, 12 + h1 * 20, 16), 5, x, .06), [30, 32, 36], .16, { reserve: false, mode: 'multiply', amt: 6, seed: x });
  }
  if (F.z0 < AIS[1] && F.z1 > AIS[0]) {
    const T = 34, terr = [92, 50, 42], slate = [30, 30, 36], ochre = [118, 96, 62], cream = [128, 120, 104];
    g.save(); g.beginPath(); g.rect(F.x0, AIS[0] + 22, F.x1 - F.x0, AIS[1] - AIS[0] - 44); g.clip();
    for (let i = Math.floor((F.x0 - 200) / T); i < F.x1 / T + 4; i++) for (let j = 0; j < (AIS[1] - AIS[0]) / T + 2; j++) {
      const cx = i * T + (j & 1) * T / 2, cz = AIS[0] + 22 + j * T / 2, h1 = hsh(i, j + 3), r = T / 2 - 1.2;
      const dia = [[cx, cz - r], [cx + r, cz], [cx, cz + r], [cx - r, cz]];
      if (h1 < .04) continue;   // falta la baldosa
      const col = ((i + j) & 1) ? terr : (h1 > .85 ? ochre : slate);
      wcWash(g, dia, mixc(col, [52, 52, 50], h1 * .45), .95, { reserve: false, mode: 'source-over', amt: .5, seed: i * 3 + j, step: 6, edgeA: .25 });
      if (((i + j) & 1) && h1 > .6) { g.fillStyle = cssc(cream, .55); g.beginPath(); g.arc(cx, cz, 3.2, 0, TAU); g.fill(); }
    }
    g.restore();
    for (const zb of [AIS[0], AIS[1] - 22]) { wcWash(g, rectP(F.x0, zb, F.x1 - F.x0, 22), [40, 38, 42], .95, { reserve: false, mode: 'source-over', amt: .6, seed: zb, step: 30 }); for (let x = F.x0; x < F.x1; x += 22) { const h1 = hsh(x, zb); if (h1 < .05) continue; g.fillStyle = cssc(h1 > .5 ? cream : [120, 64, 48], .8); g.fillRect(x + 4, zb + 5, 14, 12); } }
  }
  /* verdín en las juntas */
  g.lineCap = 'round';
  for (let i = 0; i < (F.x1 - F.x0) * (F.z1 - F.z0) / 1100; i++) {
    const r = mulberry32(i * 13 + 5), along = r() < .5, z0 = F.z0 + r() * (F.z1 - F.z0), x0 = F.x0 + r() * (F.x1 - F.x0);
    if (z0 > 680 && z0 < 920) continue;
    const z = along ? Math.round(z0 / 75) * 75 : z0, x = along ? x0 : Math.round(x0 / 75) * 75, l = 10 + r() * 50;
    g.strokeStyle = `rgba(${54 + r() * 20},${78 + r() * 22},${48},${.3 + r() * .4})`; g.lineWidth = 1.5 + r() * 4.5; g.beginPath(); g.moveTo(x, z); g.lineTo(along ? x + l : x + (r() - .5) * 3, along ? z + (r() - .5) * 3 : z + l); g.stroke();
  }
  /* tierra y raíces donde se rompió el pavimento */
  if (F.z1 > ROOTZ.z0) {
    wcWash(g, wob(ellP(0, 1170, 280, 95, 30), 14, 3, .02), [56, 44, 34], .9, { reserve: false, mode: 'source-over', amt: 8, seed: 4, bloom: [44, 66, 40] });
    for (let k = 0; k < 9; k++) { const r = mulberry32(k + 50), a = r() * TAU, pts = []; let p = [r() * 160 - 80, 1170 + (r() - .5) * 60]; for (let i = 0; i < 12; i++) { pts.push(p); p = [p[0] + Math.cos(a + Math.sin(i * .7) * .8) * 26, p[1] + Math.sin(a + Math.sin(i * .7) * .8) * 12]; } g.fillStyle = 'rgba(40,30,26,.9)'; g.fill(pPolys([stripP(pts, f => 16 * (1 - f) + 2)])); }
  }
  wcTex(g, w, h, .5, .35);
  /* brillo de suelo mojado: papel levantado en vetas */
  g.globalCompositeOperation = 'screen'; g.fillStyle = 'rgb(120,126,140)';
  for (let i = 0; i < 70; i++) { const r = mulberry32(i * 3 + 1), x = F.x0 + r() * (F.x1 - F.x0), z = F.z0 + r() * (F.z1 - F.z0); g.globalAlpha = .06 + r() * .1; g.fill(pPolys([wob(ellP(x, z, 40 + r() * 120, 8 + r() * 20, 16), 6, i, .05)])); }
  g.globalCompositeOperation = 'multiply'; g.fillStyle = 'rgb(70,70,74)';
  for (let i = 0; i < 40; i++) { const r = mulberry32(i * 7 + 2), x = F.x0 + r() * (F.x1 - F.x0), z = F.z0 + r() * (F.z1 - F.z0); g.globalAlpha = .15 + r() * .2; g.fill(pPolys([wob(ellP(x, z, 60 + r() * 160, 20 + r() * 50, 18), 12, i, .03)])); }
  g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
  return { ...F, c };
}
/* la luz que entra por el muro de cristal, proyectada en el suelo (cada panel → un rombo de luz) */
const LK = { kx: .22, kz: 1.18 };
const wallToFloor = (x, y) => [x + LK.kx * -y, ZF - LK.kz * -y];
function lightPaint(g) {
  g.fillStyle = '#000'; g.fillRect(FLL.x0, FLL.z0, FLL.x1 - FLL.x0, FLL.z1 - FLL.z0);
  for (const p of PANES) {
    const q = [[p.x0 + 2, p.y0 + 3], [p.x1 - 2, p.y0 + 3], [p.x1 - 2, p.y1 - 3], [p.x0 + 2, p.y1 - 3]].map(([x, y]) => wallToFloor(x, y));
    const a = .45 + p.h * .4 - (p.r === 0 ? .25 : 0);
    g.fillStyle = `rgba(255,255,255,${a})`; g.fill(pPolys([wob(q, 2.4, p.id, .05, true, 8)]));
  }
  g.globalCompositeOperation = 'destination-out'; g.lineCap = 'round';
  for (let x = -2100; x <= 2100; x += 300) { g.lineWidth = 34; g.beginPath(); g.moveTo(...wallToFloor(x, -60)); g.lineTo(...wallToFloor(x, -600)); g.stroke(); }
  g.globalCompositeOperation = 'source-over';
}
/* sombras líquidas: regueros que bajan por el vidrio (textura repetible en z) */
function rivTex() {
  const F = FLL, w = Math.ceil((F.x1 - F.x0) * F.d), h = Math.ceil((F.z1 - F.z0) * F.d), c = mk(w, h * 2), g = c.getContext('2d'), r = mulberry32(8);
  g.fillStyle = '#fff'; g.fillRect(0, 0, w, h * 2);
  g.lineCap = 'round';
  for (let i = 0; i < w / 6; i++) { const x0 = r() * w, ph = r() * 9, wd = 1 + r() * 3.2, y0 = r() * h, l = 40 + r() * 200, a = .3 + r() * .35; for (const oy of [0, h, -h, 2 * h]) { g.strokeStyle = `rgba(30,34,46,${a})`; g.lineWidth = wd; g.beginPath(); for (let k = 0; k <= 16; k++) { const y = y0 + k / 16 * l + oy, x = x0 + Math.sin(y * .05 + ph) * 5 + Math.sin(y * .17 + ph) * 2; k ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); } }
  return { ...F, c };
}
let FTN = null, FTF = null, FTL = null, RIV = null;
function floorZAt(y) { return CAM.z + (-CAM.y) * FOC * CAM.zoom / Math.max(1e-3, y - CAM.ty); }
/* dibuja una textura del suelo en franjas: cada franja tiene su escala */
function floorStrips(F, zA, zB, n, alpha = 1, mode = 'source-over', srcOff = 0, srcMod = 0) {
  if (CAM.y >= 0) return;
  const za = Math.max(zA, F.z0, CAM.z + 30), zb = Math.min(zB, F.z1); if (zb <= za) return;
  const ya = Math.min(530, PJ(0, 0, za)[1]), yb = Math.max(-530, PJ(0, 0, zb)[1]); if (ya <= yb) return;
  ctx.save(); ctx.globalAlpha = alpha; ctx.globalCompositeOperation = mode; ctx.imageSmoothingEnabled = true;
  for (let i = 0; i < n; i++) {
    const y0 = lerp(yb, ya, i / n), y1 = lerp(yb, ya, (i + 1) / n);   // y0 lejos (arriba), y1 cerca
    if (y1 < -520 || y0 > 520) continue;
    const z0 = floorZAt(y0), z1 = floorZAt(y1), zm = floorZAt((y0 + y1) / 2), s = PS(zm);
    let xL = CAM.x + (-SW / 2 - 4 - CAM.tx) / s, xR = CAM.x + (SW / 2 + 4 - CAM.tx) / s;
    const cl = Math.max(xL, F.x0), cr = Math.min(xR, F.x1); if (cr <= cl) continue;
    const dx0 = (cl - CAM.x) * s + CAM.tx, dx1 = (cr - CAM.x) * s + CAM.tx;
    let sy = (z1 - F.z0) * F.d, sh = (z0 - z1) * F.d;
    if (srcMod) { sy = ((sy + srcOff) % srcMod + srcMod) % srcMod; }
    sy = Math.max(0, sy); sh = Math.max(.5, Math.min(sh, F.c.height - sy));
    ctx.drawImage(F.c, (cl - F.x0) * F.d, sy, (cr - cl) * F.d, sh, dx0, y0, dx1 - dx0, y1 - y0 + .7);
  }
  ctx.restore();
}
/* charcos: forma en el plano del suelo; el reflejo es el muro de cristal invertido */
const PUDDLES = [];
{ const r = mulberry32(61); const add_ = (x, z, rx, rz, o = {}) => { const pts = wob(ellP(x, z, rx, rz, 26), Math.min(rx, rz) * .35, x * .1, .02, true, 12); PUDDLES.push({ x, z, rx, rz, pts, ...o }); };
  /* en el camino del fuego (se evaporan) */
  for (const [x, z, rx, rz, te] of [[-300, 790, 60, 22, 37.55], [-150, 820, 90, 26, 37.75], [10, 785, 70, 20, 37.95], [150, 830, 55, 18, 38.15], [240, 790, 40, 14, 38.3]]) add_(x, z, rx, rz, { evap: te });
  for (let i = 0; i < 16; i++) add_(-1100 + r() * 2200, 520 + r() * 900, 30 + r() * 110, 10 + r() * 30);
  add_(-620, 700, 150, 38); add_(560, 640, 130, 30); add_(-80, 470, 120, 28, { moonP: true });
}
function puddleScale(P, t) { let k = 1; if (P.evap) k *= 1 - sm((t - P.evap) / .7); if (t > 154) k = P.evap ? .9 : 1.5; return k; }
function puddlePath(t) {
  const Pth = new Path2D(); let n = 0;
  for (const P of PUDDLES) {
    const k = puddleScale(P, t); if (k < .03) continue;
    if (P.z - CAM.z < 40) continue;
    const c = PJ(P.x, 0, P.z); if (c[0] < -SW / 2 - 300 || c[0] > SW / 2 + 300 || c[1] < -520 || c[1] > 560) continue;
    const pts = P.pts.map(([x, z]) => PJ(P.x + (x - P.x) * k, 0, P.z + (z - P.z) * k));
    Pth.moveTo(...pts[0]); for (const p of pts) Pth.lineTo(...p); Pth.closePath(); n++;
  }
  return n ? Pth : null;
}
function drawPuddles(t, refl) {
  const Pth = puddlePath(t); if (!Pth) return;
  ctx.save(); ctx.clip(Pth);
  if (refl && refl.full) { refl.full(); ctx.restore(); ctx.strokeStyle = 'rgba(14,14,18,.45)'; ctx.lineWidth = 2; ctx.stroke(Pth); return; }
  ctx.fillStyle = cssc(mixc([30, 36, 50], [232, 232, 226], WS.flash * .8)); ctx.fillRect(-SW / 2, -500, SW, 1000);
  if (WS.clear > .01 && SKYC.moon) {   // la luna en el agua (al final)
    const P = PUDDLES.find(p => p.moonP), c = PJ(P.x, 0, P.z), mr = 24 * PS(P.z) * .5;
    ctx.globalAlpha = WS.clear; const hg = ctx.createRadialGradient(c[0] + 30, c[1], 0, c[0] + 30, c[1], mr * 6); hg.addColorStop(0, 'rgba(200,210,236,.45)'); hg.addColorStop(1, 'rgba(200,210,236,0)'); ctx.fillStyle = hg; ctx.fillRect(c[0] - 300, c[1] - 200, 600, 400);
    if (refl && refl.moon) refl.moon(c, mr); ctx.globalAlpha = 1;
  }
  drawFarWall(t, true);
  /* reflejo de las columnas: barras oscuras que bajan desde su base */
  for (const [x, z] of COLS) { if (z - CAM.z < 60) continue; const p = PJ(x + 0, 0, z), s = PS(z); ctx.fillStyle = 'rgba(16,14,20,.75)'; ctx.fillRect(p[0] - 10 * s, p[1], 20 * s, 900 * s); }
  if (refl) refl.extra && refl.extra();
  /* gotas que caen del techo: anillos en el agua */
  for (let i = 0; i < 26; i++) { const P = PUDDLES[i % PUDDLES.length], per = 1.3 + hsh(i, 2) * 1.6, ph = (t + hsh(i, 3) * per) % per, a = 1 - ph / per; if (puddleScale(P, t) < .2) continue; const x = P.x + (hsh(i, 4) - .5) * P.rx, z = P.z + (hsh(i, 5) - .5) * P.rz, c = PJ(x, 0, z), s = PS(z), r = (4 + ph * 26) * s; ctx.strokeStyle = `rgba(214,220,232,${.4 * a})`; ctx.lineWidth = Math.max(.6, 1.2 * s); ctx.beginPath(); ctx.ellipse(c[0], c[1], r, r * (-CAM.y) / Math.max(60, z - CAM.z), 0, 0, TAU); ctx.stroke(); }
  ctx.restore();
  ctx.strokeStyle = 'rgba(14,14,18,.45)'; ctx.lineWidth = 2; ctx.stroke(Pth);
}
function drawFloor(t, refl) {
  const zFar = ZF;
  floorStrips(FTN, 0, 720, 70); floorStrips(FTF, 700, zFar, 44);
  /* luz de las ventanas + regueros */
  const Lt = WS.final ? 0 : .22 * WS.moon / .12 * .5 + .85 * WS.flash;
  if (Lt > .01) {
    floorStrips(FTL, 820, zFar, 30, Math.min(1, Lt) * .55, 'screen');
    floorStrips(RIV, 820, zFar, 30, Math.min(1, Lt) * .6, 'multiply', -t * 140 * RIV.d, RIV.c.height / 2);
  }
  if (WS.final) { ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = .18 * WS.clear; const p0 = PJ(0, 0, 1600)[1]; const gr = ctx.createLinearGradient(0, p0, 0, 520); gr.addColorStop(0, 'rgba(180,196,230,1)'); gr.addColorStop(1, 'rgba(180,196,230,.3)'); ctx.fillStyle = gr; ctx.fillRect(-SW / 2, p0, SW, 600); ctx.restore(); }
  drawPuddles(t, refl);
}
