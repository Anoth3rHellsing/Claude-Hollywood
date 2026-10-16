/* =====================================================================
   LA CIUDAD EN OTOÑO · el mismo motor en perspectiva del invernadero, otro decorado
   fachadas en acuarela (pintadas una vez) en z = 1500, bulevar de adoquines que se repite cada 1200,
   árboles de otoño con su sombra moteada, faroles, bancos, macetas con flores, charcos con reflejo,
   palomas que se espantan y el carrito de café de Tetera.
   ===================================================================== */
const CZ = { fac: 1500, curb: 1350, tree: 930, lamp: 770, path: 690, cart: 790 };
const CITY_X0 = -1700, CITY_X1 = 7000, CAFE_X = 4300;
const FACC = [[214, 176, 120], [196, 120, 86], [232, 210, 170], [150, 166, 132], [140, 156, 176], [200, 150, 110], [226, 190, 150], [176, 108, 92]];
const SHUT = [[70, 110, 96], [70, 92, 130], [150, 70, 56], [90, 100, 70]];
let BLD = [], SKYLINE = null, CFLOOR = null, CTREES = [];
/* una fachada: cuerpo lavado, cornisa, ventanas con contraventanas y jardineras, planta baja con tienda y toldo */
function makeBuilding(seed, w, h) {
  const r = mulberry32(seed), d = .9, box = [-w / 2 - 20, -h - 80, w / 2 + 20, 6], S = spr(box, d), g = S.g;
  const col = FACC[Math.floor(r() * FACC.length)], sh = SHUT[Math.floor(r() * SHUT.length)];
  wcWash(g, rectP(-w / 2, -h, w, h), col, .95, { reserve: true, amt: 1.2, seed, step: 24, bloom: r() < .5 ? shc(col, -.15) : null, edgeA: .3 });
  /* zócalo y cornisa */
  wcWash(g, rectP(-w / 2, -60, w, 60), shc(col, -.25), .9, { reserve: false, amt: .8, seed: seed + 1, step: 24 });
  wcWash(g, rectP(-w / 2 - 12, -h - 18, w + 24, 22), shc(col, -.3), .95, { reserve: false, amt: .6, seed: seed + 2, step: 24 });
  /* techo: mansarda de pizarra o terraza con chimeneas */
  if (r() < .55) { wcWash(g, [[-w / 2 - 6, -h - 18], [w / 2 + 6, -h - 18], [w / 2 - 20, -h - 70], [-w / 2 + 20, -h - 70]], [74, 78, 92], .92, { reserve: false, amt: .8, seed: seed + 3, step: 20 }); for (let x = -w / 2 + 50; x < w / 2 - 40; x += 90) wcWash(g, rectP(x, -h - 66, 26, 34), [232, 226, 214], .9, { reserve: false, amt: .4, seed: seed + x, step: 8 }); }
  else for (let k = 0; k < 2; k++) { const x = -w / 2 + 40 + r() * (w - 80); wcWash(g, rectP(x, -h - 60, 22, 44), [150, 88, 70], .92, { reserve: false, amt: .5, seed: seed + k * 9, step: 8 }); }
  /* ventanas por piso */
  const floors = Math.floor((h - 150) / 120), cols = Math.max(2, Math.floor(w / 95)), gap = w / cols;
  for (let f = 0; f < floors; f++) for (let c = 0; c < cols; c++) {
    const x = -w / 2 + gap * (c + .5), y = -170 - f * 120 - 30, ww = 34, wh = 62;
    g.save(); g.globalCompositeOperation = 'source-over';
    const gr = g.createLinearGradient(0, y - wh / 2, 0, y + wh / 2); gr.addColorStop(0, 'rgba(176,196,206,.95)'); gr.addColorStop(1, 'rgba(110,128,146,.95)'); g.fillStyle = gr; g.fillRect(x - ww / 2, y - wh / 2, ww, wh);
    g.fillStyle = 'rgba(255,255,255,.55)'; g.beginPath(); g.moveTo(x - ww / 2 + 4, y + wh / 2 - 6); g.lineTo(x - ww / 2 + 14, y - wh / 2 + 4); g.lineTo(x - ww / 2 + 20, y - wh / 2 + 4); g.lineTo(x - ww / 2 + 8, y + wh / 2 - 6); g.fill();
    g.strokeStyle = 'rgba(248,244,236,.95)'; g.lineWidth = 3; g.strokeRect(x - ww / 2, y - wh / 2, ww, wh); g.beginPath(); g.moveTo(x, y - wh / 2); g.lineTo(x, y + wh / 2); g.moveTo(x - ww / 2, y - 4); g.lineTo(x + ww / 2, y - 4); g.stroke();
    if (r() < .55) { g.fillStyle = cssc(sh, .92); g.fillRect(x - ww / 2 - 16, y - wh / 2, 14, wh); g.fillRect(x + ww / 2 + 2, y - wh / 2, 14, wh); g.strokeStyle = cssc(shc(sh, -.3), .6); g.lineWidth = 1; for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(x - ww / 2 - 16, y - wh / 2 + 6 + k * 10); g.lineTo(x - ww / 2 - 2, y - wh / 2 + 6 + k * 10); g.moveTo(x + ww / 2 + 2, y - wh / 2 + 6 + k * 10); g.lineTo(x + ww / 2 + 16, y - wh / 2 + 6 + k * 10); g.stroke(); } }
    if (r() < .4) { g.fillStyle = 'rgba(120,80,56,.95)'; g.fillRect(x - ww / 2 - 4, y + wh / 2, ww + 8, 9); for (let k = 0; k < 7; k++) { g.fillStyle = cssc([[214, 70, 60], [240, 170, 60], [236, 120, 150], [110, 160, 80]][(k + c) % 4], .95); g.beginPath(); g.arc(x - ww / 2 + 2 + k * 6, y + wh / 2 - 2 - r() * 6, 3.6, 0, TAU); g.fill(); } }
    if (r() < .18) { g.fillStyle = 'rgba(30,24,28,.85)'; g.fillRect(x - ww / 2 - 8, y + wh / 2 + 10, ww + 16, 3); for (let k = 0; k < 6; k++) g.fillRect(x - ww / 2 - 8 + k * (ww + 16) / 5, y + wh / 2 - 8, 2, 18); }   // balconcito
    g.restore();
  }
  /* planta baja: tienda con toldo y escaparate cálido, o puerta con escalones */
  if (r() < .6) {
    const sw = w * .7, aw = [[196, 70, 60], [60, 110, 100], [214, 150, 60], [80, 90, 140]][Math.floor(r() * 4)];
    g.save(); const gw = g.createLinearGradient(0, -130, 0, -20); gw.addColorStop(0, 'rgba(255,226,170,.95)'); gw.addColorStop(1, 'rgba(214,160,100,.95)'); g.fillStyle = gw; g.fillRect(-sw / 2, -128, sw, 108);
    g.fillStyle = 'rgba(80,50,36,.5)'; for (let k = 0; k < 5; k++) { g.fillRect(-sw / 2 + 20 + k * (sw - 40) / 4 - 8, -54, 16, 30); g.beginPath(); g.arc(-sw / 2 + 20 + k * (sw - 40) / 4, -60, 9, 0, TAU); g.fill(); }   // cosas en el escaparate
    g.strokeStyle = 'rgba(40,30,26,.9)'; g.lineWidth = 4; g.strokeRect(-sw / 2, -128, sw, 108);
    for (let k = 0; k < 9; k++) { g.fillStyle = k % 2 ? 'rgba(244,238,226,.97)' : cssc(aw, .97); g.beginPath(); const x0 = -sw / 2 - 14 + k * (sw + 28) / 9, x1 = x0 + (sw + 28) / 9; g.moveTo(x0, -150); g.lineTo(x1, -150); g.lineTo(x1 + 4, -118); g.quadraticCurveTo((x0 + x1) / 2 + 2, -108, x0 + 4, -118); g.closePath(); g.fill(); }
    g.restore();
  } else { wcWash(g, rectP(-30, -150, 60, 130), shc(sh, -.15), .95, { reserve: false, amt: .5, seed: seed + 7, step: 10 }); g.fillStyle = 'rgba(240,200,120,.95)'; g.beginPath(); g.arc(20, -86, 3, 0, TAU); g.fill(); wcWash(g, rectP(-44, -20, 88, 14), [150, 140, 128], .95, { reserve: false, amt: .4, seed: seed + 8, step: 10 }); }
  /* plumilla con bordes perdidos en las aristas */
  wcInk(g, [[-w / 2, 0], [-w / 2, -h], [w / 2, -h], [w / 2, 0]], 1.4, .55, seed, .25, [60, 40, 36]);
  wcTex(g, S.c.width, S.c.height, .4, .22);
  return S;
}
function makeSkyline() {   /* hilera lejana: siluetas lavadas y brumosas (se repite) */
  const S = spr([0, -1300, 4000, 4], .45), g = S.g, r = mulberry32(12);
  let x = 0; while (x < 4000) { const w = 160 + r() * 260, h = 380 + r() * 820; wcWash(g, rectP(x, -h, w, h), mixc([170, 160, 160], [196, 186, 176], r()), .7, { reserve: false, mode: 'source-over', amt: 1, seed: x, step: 30 }); if (r() < .3) wcWash(g, rectP(x + w * .4, -h - 120, 18, 120), [160, 150, 150], .7, { reserve: false, mode: 'source-over', amt: .5, seed: x + 1, step: 20 }); x += w + r() * 20; }
  return S;
}
function cityInit() {
  const r = mulberry32(31); BLD = []; let x = CITY_X0;
  while (x < CITY_X1) { const w = 280 + r() * 260, h = 520 + r() * 420; BLD.push({ x: x + w / 2, w, h, S: makeBuilding(500 + BLD.length, w, h) }); x += w + (r() < .25 ? 30 + r() * 60 : 0); }
  SKYLINE = makeSkyline();
  CTREES = []; for (let k = 0; k < 6; k++) CTREES.push(makeTree(700 + k, 400 + k * 18));
  CFLOOR = cityFloorTex();
}
/* el bulevar: una baldosa de 1200 × (150…1500) que se repite en x */
const CF = { x0: 0, x1: 1200, z0: 150, z1: 1500, d: 1.1 };
function cityFloorTex() {
  const F = CF, w = (F.x1 - F.x0) * F.d, h = (F.z1 - F.z0) * F.d, c = mk(w, h), g = c.getContext('2d');
  g.setTransform(F.d, 0, 0, F.d, -F.x0 * F.d, -F.z0 * F.d);
  g.fillStyle = 'rgb(120,110,98)'; g.fillRect(F.x0, F.z0, F.x1 - F.x0, F.z1 - F.z0);
  const S = 50, stone = [[176, 166, 150], [186, 174, 156], [168, 162, 150], [180, 170, 160], [172, 168, 148]];
  for (let z = F.z0; z < CZ.curb; z += S * .7) for (let x = F.x0 - ((z / (S * .7)) & 1) * S / 2; x < F.x1; x += S) {
    const h1 = hsh(x * .11, z * .07), q = rectP(x + 2, z + 2, S - 4, S * .7 - 4);
    wcWash(g, q, mixc(stone[Math.floor(h1 * 5) % 5], [140, 150, 120], hsh(x, z + 3) * .25), .96, { reserve: false, mode: 'source-over', amt: .8, seed: x * .1 + z, edgeA: .35, step: 10 });
  }
  /* alcorques de los árboles (cada 600) */
  for (const tx of [150, 750]) { wcWash(g, rectP(tx - 60, CZ.tree - 40, 120, 80), [86, 64, 48], .96, { reserve: false, mode: 'source-over', amt: 1, seed: tx, step: 10 }); g.strokeStyle = 'rgba(40,32,30,.7)'; g.lineWidth = 2; for (let k = 0; k < 9; k++) { g.beginPath(); g.ellipse(tx, CZ.tree, 20 + k * 5, 14 + k * 3, 0, 0, TAU); g.stroke(); } }
  /* bordillo y franja junto a las fachadas */
  wcWash(g, rectP(F.x0, CZ.curb, F.x1 - F.x0, F.z1 - CZ.curb), [150, 140, 130], .96, { reserve: false, mode: 'source-over', amt: .6, seed: 4, step: 30 });
  g.fillStyle = 'rgba(70,60,56,.5)'; g.fillRect(F.x0, CZ.curb - 4, F.x1 - F.x0, 6);
  /* manchas de hojas viejas y verdín */
  for (let i = 0; i < 260; i++) { const r = mulberry32(i * 7 + 3), x = F.x0 + r() * (F.x1 - F.x0), z = F.z0 + r() * (CZ.curb - F.z0); g.fillStyle = cssc(LEAFC[i % LEAFC.length], .25 + r() * .3); g.beginPath(); g.ellipse(x, z, 4 + r() * 5, 2 + r() * 3, r() * TAU, 0, TAU); g.fill(); }
  wcTex(g, w, h, .45, .3);
  return { ...F, c };
}
function cityFloorStrips(n = 120) {
  const F = CFLOOR; if (CAM.y >= 0) return;
  const za = Math.max(F.z0, CAM.z + 30), zb = F.z1, ya = Math.min(530, PJ(0, 0, za)[1]), yb = Math.max(-530, PJ(0, 0, zb)[1]); if (ya <= yb) return;
  const TW = F.x1 - F.x0;
  for (let i = 0; i < n; i++) {
    const y0 = lerp(yb, ya, i / n), y1 = lerp(yb, ya, (i + 1) / n); if (y1 < -520 || y0 > 520) continue;
    const z0 = floorZAt(y0), z1 = floorZAt(y1), zm = floorZAt((y0 + y1) / 2), s = PS(zm);
    const xL = CAM.x + (-SW / 2 - 4 - CAM.tx) / s, xR = CAM.x + (SW / 2 + 4 - CAM.tx) / s;
    const sy = Math.max(0, (z1 - F.z0) * F.d), sh = Math.max(.5, Math.min((z0 - z1) * F.d, F.c.height - sy));
    for (let k = Math.floor(xL / TW); k * TW < xR; k++) {
      const a = Math.max(xL, k * TW), b = Math.min(xR, (k + 1) * TW); if (b <= a) continue;
      const dx0 = (a - CAM.x) * s + CAM.tx, dx1 = (b - CAM.x) * s + CAM.tx;
      ctx.drawImage(F.c, (a - k * TW) * F.d, sy, (b - a) * F.d, sh, dx0, y0, dx1 - dx0 + .6, y1 - y0 + 1.2);
    }
  }
}
/* sombra moteada de los árboles en el suelo (se mece con el viento) */
function treeShade(t) {
  ctx.save(); ctx.globalCompositeOperation = 'multiply';
  for (let k = Math.floor((CAM.x - 2400) / 600); k * 600 < CAM.x + 2400; k++) {
    const tx = k * 600 + 150 + 220, z = CZ.tree - 60; if (z - CAM.z < 40) continue;
    for (let j = 0; j < 7; j++) { const x = tx + (hsh(k, j) - .5) * 300 + Math.sin(t * .6 + j + k) * 8, zz = z + (hsh(k, j + 3) - .5) * 260, p = PJ(x, 0, zz), s = PS(zz), r = (40 + hsh(k, j + 7) * 50) * s;
      ctx.fillStyle = 'rgba(150,130,120,.35)'; ctx.beginPath(); ctx.ellipse(p[0], p[1], r, r * Math.max(.12, (-CAM.y) / (zz - CAM.z) * 1.3), 0, 0, TAU); ctx.fill(); }
  }
  ctx.restore();
}
function cityTree(k, t) {
  const x = k * 600 + 150, z = CZ.tree, T = CTREES[((k % 6) + 6) % 6], s = PS(z), p = PJ(x, 0, z); if (z - CAM.z < 40 || p[0] < -SW / 2 - 500 || p[0] > SW / 2 + 500) return;
  const wind = .03 * Math.sin(t * .9 + k) + .02 * Math.sin(t * 2.1 + k * 2);
  ctx.save(); ctx.translate(p[0], p[1]); ctx.transform(s, 0, -wind * s, s, 0, 0); ctx.drawImage(T.c, T.box[0], T.box[1], T.box[2] - T.box[0], T.box[3] - T.box[1]); ctx.restore();
}
function cityLamp(x, z, t, lit = 0) {
  const s = PS(z), b = PJ(x, 0, z), top = PJ(x, -330, z); if (z - CAM.z < 40 || b[0] < -SW / 2 - 100 || b[0] > SW / 2 + 100) return;
  ctx.fillStyle = cssc(IRON); ctx.fillRect(b[0] - 5 * s, top[1], 10 * s, b[1] - top[1]); ctx.fillRect(b[0] - 12 * s, b[1] - 30 * s, 24 * s, 30 * s);
  const L = PJ(x, -352, z); ctx.fillStyle = cssc(IRON); ctx.beginPath(); ctx.moveTo(L[0] - 18 * s, L[1] - 10 * s); ctx.lineTo(L[0] + 18 * s, L[1] - 10 * s); ctx.lineTo(L[0], L[1] - 30 * s); ctx.fill();
  ctx.fillStyle = lit > .05 ? `rgba(255,214,140,${.6 + lit * .4})` : 'rgba(226,226,210,.7)'; ctx.fillRect(L[0] - 12 * s, L[1] - 10 * s, 24 * s, 30 * s); ctx.strokeStyle = cssc(IRON); ctx.lineWidth = Math.max(.8, 3 * s); ctx.strokeRect(L[0] - 12 * s, L[1] - 10 * s, 24 * s, 30 * s);
  if (lit > .05) LGF(L[0], L[1] + 5 * s, 160 * s, '255,200,120', .5 * lit);
}
function cityBench(x, z) {
  const s = PS(z); if (z - CAM.z < 40) return; const a = PJ(x - 80, -42, z), b = PJ(x + 80, -42, z), c = PJ(x - 80, -84, z + 10); if (b[0] < -SW / 2 || a[0] > SW / 2) return;
  ctx.fillStyle = 'rgba(120,80,52,.95)'; for (let k = 0; k < 3; k++) { const y = lerp(a[1], c[1], k / 3); ctx.fillRect(a[0], y, b[0] - a[0], 7 * s); }
  ctx.fillStyle = cssc(IRON); for (const dx of [-70, 66]) { const p = PJ(x + dx, 0, z), q = PJ(x + dx, -86, z); ctx.fillRect(p[0], q[1], 6 * s, p[1] - q[1]); }
}
/* el carrito de café de Tetera: madera, toldo a rayas, cafetera de cromo y guirnalda de luces */
function coffeeCart(t, lit = 1) {
  const x = CAFE_X, z = CZ.cart, s = PS(z), P = (dx, dy) => PJ(x + dx, dy, z); if (z - CAM.z < 40) return; const c0 = P(0, 0); if (c0[0] < -SW / 2 - 400 || c0[0] > SW / 2 + 400) return;
  /* ruedas y caja */
  const box = [P(-140, -120), P(140, -30)];
  ctx.fillStyle = 'rgb(150,96,62)'; ctx.fillRect(box[0][0], box[0][1], box[1][0] - box[0][0], box[1][1] - box[0][1]);
  ctx.strokeStyle = 'rgba(80,50,32,.7)'; ctx.lineWidth = Math.max(.6, 2 * s); for (let k = 1; k < 7; k++) { const xx = lerp(box[0][0], box[1][0], k / 7); ctx.beginPath(); ctx.moveTo(xx, box[0][1]); ctx.lineTo(xx, box[1][1]); ctx.stroke(); }
  ctx.fillStyle = 'rgb(108,66,42)'; const top = [P(-156, -132), P(156, -118)]; ctx.fillRect(top[0][0], top[0][1], top[1][0] - top[0][0], top[1][1] - top[0][1]);
  for (const dx of [-100, 100]) { const w = P(dx, -22); ctx.fillStyle = cssc(IRON); ctx.beginPath(); ctx.arc(w[0], w[1], 22 * s, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgb(170,150,120)'; ctx.beginPath(); ctx.arc(w[0], w[1], 9 * s, 0, TAU); ctx.fill(); }
  /* letrero de pizarra con una taza dibujada (sin letras) */
  const bd = P(-200, -110); ctx.fillStyle = 'rgb(48,52,50)'; ctx.fillRect(bd[0] - 34 * s, bd[1], 68 * s, 80 * s); ctx.strokeStyle = 'rgb(130,90,60)'; ctx.lineWidth = Math.max(1, 4 * s); ctx.strokeRect(bd[0] - 34 * s, bd[1], 68 * s, 80 * s);
  ctx.strokeStyle = 'rgba(240,236,224,.85)'; ctx.lineWidth = Math.max(.8, 2.4 * s); ctx.beginPath(); ctx.moveTo(bd[0] - 16 * s, bd[1] + 30 * s); ctx.lineTo(bd[0] - 12 * s, bd[1] + 58 * s); ctx.lineTo(bd[0] + 12 * s, bd[1] + 58 * s); ctx.lineTo(bd[0] + 16 * s, bd[1] + 30 * s); ctx.closePath(); ctx.stroke(); ctx.beginPath(); ctx.arc(bd[0] + 20 * s, bd[1] + 42 * s, 7 * s, -PI / 2, PI / 2); ctx.stroke();
  for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(bd[0] - 8 * s + k * 8 * s, bd[1] + 24 * s); ctx.quadraticCurveTo(bd[0] - 12 * s + k * 8 * s, bd[1] + 16 * s, bd[0] - 6 * s + k * 8 * s, bd[1] + 8 * s); ctx.stroke(); }
  /* cafetera */
  const m0 = P(50, -132), m1 = P(110, -200); ctx.fillStyle = 'rgb(186,190,196)'; ctx.fillRect(m0[0], m1[1], m1[0] - m0[0], m0[1] - m1[1]); ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fillRect(m0[0] + 6 * s, m1[1] + 6 * s, 6 * s, m0[1] - m1[1] - 12 * s); ctx.fillStyle = 'rgb(60,60,66)'; ctx.fillRect(m0[0] + 16 * s, m1[1] + 40 * s, 30 * s, 10 * s);
  /* tazas */
  for (let k = 0; k < 3; k++) { const c = P(-110 + k * 24, -132); ctx.fillStyle = 'rgb(244,240,232)'; ctx.fillRect(c[0], c[1] - 16 * s, 16 * s, 16 * s); ctx.strokeStyle = 'rgba(60,40,30,.6)'; ctx.lineWidth = 1; ctx.strokeRect(c[0], c[1] - 16 * s, 16 * s, 16 * s); }
  /* postes y toldo a rayas */
  ctx.fillStyle = cssc(IRON); for (const dx of [-150, 150]) { const a = P(dx, -132), b = P(dx, -300); ctx.fillRect(a[0] - 3 * s, b[1], 6 * s, a[1] - b[1]); }
  for (let k = 0; k < 10; k++) { const a = P(-176 + k * 35.2, -300), b = P(-176 + (k + 1) * 35.2, -300), cc = P(-176 + (k + .5) * 35.2, -262); ctx.fillStyle = k % 2 ? 'rgb(244,236,222)' : 'rgb(178,64,56)'; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(b[0], b[1] + 30 * s); ctx.quadraticCurveTo(cc[0], cc[1] + 12 * s, a[0], a[1] + 30 * s); ctx.closePath(); ctx.fill(); }
  ctx.fillStyle = 'rgb(150,50,44)'; const ta = P(-176, -320), tb = P(176, -300); ctx.fillRect(ta[0], ta[1], tb[0] - ta[0], tb[1] - ta[1]);
  /* guirnalda de bombillas */
  const pts = []; for (let k = 0; k <= 20; k++) { const u = k / 20; pts.push(P(-176 + u * 352, -296 + Math.sin(u * PI) * 26)); }
  ctx.strokeStyle = 'rgba(40,30,26,.8)'; ctx.lineWidth = 1; ctx.stroke(pLine(pts));
  for (let k = 1; k < 20; k += 2) { const p = pts[k], on = .6 + .4 * Math.sin(t * 2 + k); ctx.fillStyle = `rgba(255,220,150,${.9 * lit})`; ctx.beginPath(); ctx.arc(p[0], p[1] + 4 * s, 4 * s, 0, TAU); ctx.fill(); LGF(p[0], p[1] + 4 * s, 40 * s, '255,200,120', .25 * on * lit); }
}
/* palomas: picotean hasta que Brote pasa cerca y entonces se van volando (cuándo, se calcula una vez) */
const PIGEONS = []; { const r = mulberry32(88); for (let i = 0; i < 6; i++) PIGEONS.push({ x: 1900 + r() * 360, z: 640 + r() * 120, ph: r() * 9, tf: 1e9, flip: r() < .5, vx: 120 + r() * 160, vy: 220 + r() * 120 }); }
function pigeonsInit(walkerAt) { for (const P of PIGEONS) for (let t = 30; t < 90; t += .05) { const B = walkerAt(t); if (B && B.city && Math.abs(B.x - P.x) < 150) { P.tf = t + hsh(P.x, 3) * .35; break; } } }
function pigeonsDraw(put, t) {
  for (const P of PIGEONS) {
    const f = t - P.tf, flying = f > 0, x = P.x + (flying ? P.vx * f : 0), y = flying ? P.vy * f + 40 * f * f : 0, z = P.z + (flying ? 220 * f : 0);
    if (flying && f > 4) continue;
    put(z, () => { const cell = wCell(z, 2.6), [fx, fy] = wFoot(x, y, z), fr = flying ? (Math.floor(t * 10) % 2 ? GULL[0] : GULL[1]) : (Math.sin(t * 3 + P.ph) > .6 ? PIGEON[1] : PIGEON[0]); if (!flying) spShadow(x, z, 6, cell, 1);
      spBlit(gridCanvas('pg' + (flying ? 'f' + (Math.floor(t * 10) % 2) : Math.sin(t * 3 + P.ph) > .6 ? 1 : 0), fr), fx, fy, cell, { flip: flying ? false : P.flip }); });
  }
}
/* charcos del bulevar (en el camino de Brote) con el cielo y las fachadas reflejadas */
const CPUD = []; { const add_ = (x, z, rx, rz) => CPUD.push({ x, z, rx, rz, pts: wob(ellP(x, z, rx, rz, 26), Math.min(rx, rz) * .35, x * .1, .02, true, 12) }); add_(780, 700, 110, 26); add_(1500, 668, 80, 20); add_(2750, 705, 130, 30); add_(3400, 690, 70, 18); add_(5200, 700, 120, 28); }
function cityPuddles(t, refl) {
  const Pth = new Path2D(); let n = 0;
  for (const P of CPUD) { if (P.z - CAM.z < 40) continue; const c = PJ(P.x, 0, P.z); if (c[0] < -SW / 2 - 300 || c[0] > SW / 2 + 300) continue; const pts = P.pts.map(([x, z]) => PJ(x, 0, z)); Pth.moveTo(...pts[0]); for (const p of pts) Pth.lineTo(...p); Pth.closePath(); n++; }
  if (!n) return;
  ctx.save(); ctx.clip(Pth);
  const g0 = PJ(0, 0, 4000)[1], gs = ctx.createLinearGradient(0, g0, 0, 520); gs.addColorStop(0, 'rgb(220,214,196)'); gs.addColorStop(1, 'rgb(126,156,178)'); ctx.fillStyle = gs; ctx.fillRect(-SW / 2, -500, SW, 1000);
  drawFacades(t, true);
  if (refl) refl(t);
  ctx.restore();
  ctx.strokeStyle = 'rgba(70,60,50,.4)'; ctx.lineWidth = 2; ctx.stroke(Pth);
}
function drawFacades(t, mirror = false) {
  const z = CZ.fac, s = PS(z); if (z - CAM.z < 40) return;
  for (const B of BLD) {
    const p = PJ(B.x, 0, z), S = B.S, w = (S.box[2] - S.box[0]) * s; if (p[0] + S.box[2] * s < -SW / 2 || p[0] + S.box[0] * s > SW / 2) continue;
    if (mirror) { ctx.save(); ctx.translate(p[0], p[1]); ctx.scale(1, -1); ctx.globalAlpha = .55; ctx.drawImage(S.c, S.box[0] * s, S.box[1] * s, w, (S.box[3] - S.box[1]) * s); ctx.restore(); }
    else ctx.drawImage(S.c, p[0] + S.box[0] * s, p[1] + S.box[1] * s, w, (S.box[3] - S.box[1]) * s);
  }
}
function drawSkyline() {
  const z = 3400, s = PS(z), TW = 4000, p0 = PJ(0, 0, z), S = SKYLINE;
  for (let k = Math.floor((CAM.x - 6000) / TW); k * TW < CAM.x + 6000; k++) { const p = PJ(k * TW, 0, z); ctx.globalAlpha = .8; ctx.drawImage(S.c, p[0], p[1] + S.box[1] * s, TW * s, (S.box[3] - S.box[1]) * s); }
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'rgba(236,226,206,.35)'; ctx.fillRect(-SW, -600, SW * 2, p0[1] + 600);   // neblina
}
/* la ciudad completa en t; items(put) añade lo que la película quiera (Brote, Tetera, el auto) */
function drawCity(t, o = {}) {
  lightsBegin(); T0();
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(PAPER, 0, 0, W, H); ctx.restore(); T0();
  drawSky(t, true);
  drawSkyline();
  drawFacades(t);
  /* base de las fachadas */
  cityFloorStrips(); treeShade(t);
  cityPuddles(t, o.refl);
  if (o.floorFx) o.floorFx(t);
  T0();
  const L = [], put = (z, f) => L.push([z, f]);
  for (let k = Math.floor((CAM.x - 2600) / 600); k * 600 < CAM.x + 2600; k++) { put(CZ.tree, () => cityTree(k, t)); put(CZ.lamp, () => cityLamp(k * 600 + 450, CZ.lamp, t, o.lamps || 0)); if (k % 3 === 0) put(CZ.tree + 20, () => cityBench(k * 600 + 380, CZ.tree + 20)); }
  for (const F of CFLOW) put(F.z, () => flowerAt(F, t));
  put(CZ.cart, () => coffeeCart(t));
  pigeonsDraw(put, t);
  if (o.items) o.items(put, t);
  /* árboles de primer plano que enmarcan (pasan rápido) */
  for (let k = Math.floor((CAM.x - 2000) / 1500); k * 1500 < CAM.x + 2000; k++) { const x = k * 1500 + 700; put(300, () => { const T = CTREES[((k % 6) + 6) % 6], z = 300, s = PS(z), p = PJ(x, 0, z); if (z - CAM.z < 40 || p[0] < -SW / 2 - 900 || p[0] > SW / 2 + 900) return; ctx.save(); ctx.translate(p[0], p[1]); ctx.transform(s * 1.4, 0, 0, s * 1.4, 0, 0); ctx.globalAlpha = .96; ctx.drawImage(T.c, T.box[0], T.box[1], T.box[2] - T.box[0], T.box[3] - T.box[1]); ctx.restore(); }); }
  L.sort((a, b) => b[0] - a[0]);
  for (const [, f] of L) { f(); T0(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; }
  if (o.fx) o.fx(t);
  T0(); lightsComp(1); T0();
}
const CFLOW = []; { const r = mulberry32(64); for (let x = CITY_X0; x < CITY_X1; x += 260 + r() * 300) for (let k = 0; k < 5; k++) CFLOW.push({ x: x + r() * 60, z: CZ.curb + 40 + r() * 30, h: 22 + r() * 22, c: [[232, 150, 40], [214, 96, 40], [150, 110, 190], [240, 200, 70], [196, 60, 60]][Math.floor(r() * 5)], s: r() * 9 }); }
