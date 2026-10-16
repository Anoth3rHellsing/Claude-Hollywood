/* =====================================================================
   ESCENA 3 · EL PARQUE DEL INVERNADERO (07:50): explosión de verdes, komorebi, humedad de la mañana
   Planta (cm): camino de grava z 440…640 (Teo en 540) · césped delante (z 150…440) con plantas fuera de foco ·
     bancos y faroles junto al estanque (z 680) · estanque z 780…1700 (agua en y = 6) con patos · orilla y sauces
     en z 1800 · la ciudad en z 9000 · el Invernadero de Cristal y Hierro: muro de vidrio en z = 800, x 4800…8400,
     con el pabellón central más alto (x 6300…6900) y la bóveda curva que se va hacia atrás.
   ===================================================================== */
const PK = { Z0: 440, Z1: 640, ZT: 540, ZW: 780, ZB: 1800, GH: { x0: 4800, x1: 8400, z: 800, h: 460, cx0: 6300, cx1: 6900, ch: 720 }, END: 9800 };
const PKX = {};
const POND = [[-900, 790], [600, 770], [2200, 785], [3600, 775], [4500, 800], [4650, 1100], [4500, 1700], [2000, 1760], [-900, 1720]];
/* ---------- pintores ---------- */
function paintWillow(seed) {
  const S = spr([-420, -1000, 420, 10], .55), g = S.g, r = mulberry32(seed);
  g.strokeStyle = 'rgb(70,56,44)'; g.lineCap = 'round'; g.lineWidth = 28; g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(-10, -300, 30, -500, 0, -700); g.stroke();
  for (let k = 0; k < 7; k++) { const a = -PI / 2 + (k - 3) * .38; g.lineWidth = 10 - k % 3 * 2; g.beginPath(); g.moveTo(0, -560 - k * 20); g.quadraticCurveTo(Math.cos(a) * 200, -720 - k * 10, Math.cos(a) * 340, -760 + Math.abs(k - 3) * 40); g.stroke(); }
  /* frondas que cuelgan: cientos de trazos finos con hojitas */
  const greens = [[150, 176, 78], [120, 160, 70], [170, 190, 96], [100, 140, 64], [190, 196, 110]];
  for (let i = 0; i < 260; i++) { const x0 = (r() - .5) * 760, y0 = -930 + Math.abs(x0) * .45 + r() * 120, L = 260 + r() * 460, c = pick3(r, greens), sw = (r() - .5) * 40;
    g.strokeStyle = cssc(shc(c, -.2), .55); g.lineWidth = 1.6; g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo(x0 + sw, y0 + L * .5, x0 + sw * 1.6, y0 + L); g.stroke();
    g.fillStyle = cssc(c, .75); for (let k = 0; k < L / 14; k++) { const u = k * 14 / L, x = x0 + sw * 1.6 * u * u + sw * .4 * u, y = y0 + L * u; g.beginPath(); g.ellipse(x + (k % 2 ? 3 : -3), y, 2.2, 6, k % 2 ? .4 : -.4, 0, TAU); g.fill(); } }
  wcTex(g, S.c.width, S.c.height, .2, .2);
  return S;
}
function paintParkTree(seed, o = {}) {
  const w = o.w ?? 700, S = spr([-w / 2 - 40, -1100, w / 2 + 40, 10], o.d ?? .5), g = S.g, r = mulberry32(seed), gs = o.cols || [[64, 120, 60], [86, 140, 66], [110, 156, 70], [52, 100, 56], [150, 170, 80]];
  g.strokeStyle = 'rgb(66,52,42)'; g.lineCap = 'round'; g.lineWidth = 34; g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(10, -200, -20, -400, 0, -560); g.stroke(); g.lineWidth = 14; for (const a of [-1, 1]) { g.beginPath(); g.moveTo(0, -420); g.quadraticCurveTo(a * 120, -560, a * 200, -700); g.stroke(); }
  for (let i = 0; i < 46; i++) { const x = (r() - .5) * w * .9, y = -620 - r() * 400 + Math.abs(x) * .4, rr = 70 + r() * 110, c = pick3(r, gs); wcWash(g, wob(ellP(x, y, rr, rr * .8, 20), rr * .25, i + seed, .02, true, 14), c, .7, { reserve: false, mode: 'source-over', amt: 2, seed: i, edge: true, edgeA: .2, step: 14 }); }
  /* claros por donde entra el sol (komorebi en la copa) */
  g.globalCompositeOperation = 'destination-out'; for (let i = 0; i < 26; i++) { g.fillStyle = `rgba(0,0,0,${.5 + r() * .5})`; g.beginPath(); g.ellipse((r() - .5) * w * .8, -650 - r() * 350, 6 + r() * 16, 4 + r() * 10, r() * 3, 0, TAU); g.fill(); } g.globalCompositeOperation = 'source-over';
  for (let i = 0; i < 70; i++) { g.fillStyle = cssc(pick3(r, [[220, 236, 140], [200, 220, 120]]), .5); g.beginPath(); g.ellipse((r() - .5) * w * .8, -700 - r() * 350, 3 + r() * 6, 2 + r() * 4, 0, 0, TAU); g.fill(); }
  if (o.autumn) for (let i = 0; i < 40; i++) { g.fillStyle = cssc(pick3(r, [[214, 140, 50], [196, 96, 40], [230, 180, 70]]), .7); g.beginPath(); g.ellipse((r() - .5) * w * .8, -650 - r() * 380, 8 + r() * 14, 6 + r() * 10, 0, 0, TAU); g.fill(); }
  wcTex(g, S.c.width, S.c.height, .25, .25);
  return S;
}
function paintCanopy(seed) {   /* hojas del primer plano que enmarcan arriba (se desenfocan) */
  const S = spr([-700, -500, 700, 10], .6), g = S.g, r = mulberry32(seed);
  for (let i = 0; i < 90; i++) { const x = (r() - .5) * 1400, y = -480 + r() * 300, s = 22 + r() * 30, c = pick3(r, [[40, 84, 44], [60, 110, 56], [80, 130, 60], [30, 64, 40]]); g.save(); g.translate(x, y); g.rotate(r() * TAU); g.fillStyle = cssc(c, .95); g.beginPath(); g.moveTo(-s, 0); g.quadraticCurveTo(0, -s * .6, s, 0); g.quadraticCurveTo(0, s * .6, -s, 0); g.fill(); g.restore(); }
  g.strokeStyle = 'rgb(56,44,36)'; g.lineWidth = 8; g.beginPath(); g.moveTo(-700, -330); g.quadraticCurveTo(0, -260, 700, -380); g.stroke();
  return sprBlur(S, 5);
}
function paintPlantsFG(seed) {   /* helechos, hierba alta y flores en primer plano (fuera de foco) */
  const S = spr([-160, -150, 160, 4], 1.2), g = S.g, r = mulberry32(seed);
  for (let i = 0; i < 26; i++) { const x = (r() - .5) * 280, L = 60 + r() * 90, a = -PI / 2 + (r() - .5) * 1.2, c = pick3(r, [[70, 120, 56], [96, 146, 66], [60, 100, 50]]); g.strokeStyle = cssc(c); g.lineWidth = 3; g.beginPath(); g.moveTo(x, 0); g.quadraticCurveTo(x + Math.cos(a) * L * .5, -L * .6, x + Math.cos(a) * L, Math.sin(a) * L); g.stroke();
    if (r() < .5) for (let k = 1; k < 8; k++) { const u = k / 8, px = x + Math.cos(a) * L * u, py = Math.sin(a) * L * u; g.lineWidth = 1.5; g.beginPath(); g.moveTo(px, py); g.lineTo(px - 10 * (1 - u), py - 6); g.moveTo(px, py); g.lineTo(px + 10 * (1 - u), py - 6); g.stroke(); } }
  for (let i = 0; i < 2; i++) { g.fillStyle = cssc(pick3(r, [[240, 220, 120], [250, 250, 240]]), .7); g.beginPath(); g.arc((r() - .5) * 260, -40 - r() * 40, 3 + r() * 2, 0, TAU); g.fill(); }
  return sprBlur(S, 4);
}
function paintBench() {   /* banco de hierro fundido negro con listones de madera húmedos de rocío */
  const S = spr([-100, -90, 100, 2], 2.6), g = S.g, iron = 'rgb(28,26,28)';
  for (const x of [-86, 80]) { g.fillStyle = iron; g.beginPath(); g.moveTo(x - 4, 0); g.quadraticCurveTo(x - 8, -24, x - 2, -44); g.lineTo(x + 6, -44); g.quadraticCurveTo(x + 2, -24, x + 6, 0); g.fill(); g.beginPath(); g.moveTo(x - 2, -44); g.quadraticCurveTo(x - 10, -66, x, -86); g.lineTo(x + 6, -86); g.quadraticCurveTo(x - 2, -66, x + 6, -44); g.fill(); g.strokeStyle = iron; g.lineWidth = 2; g.beginPath(); g.arc(x + 2, -30, 8, 0, TAU); g.stroke(); }
  for (const [y, h] of [[-48, 6], [-42, 6], [-60, 6], [-70, 6], [-80, 6]]) { const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, 'rgb(112,76,50)'); gr.addColorStop(1, 'rgb(70,46,32)'); g.fillStyle = gr; g.fillRect(-94, y, 188, h - 1); }
  const r = mulberry32(7); for (let i = 0; i < 70; i++) { const x = -92 + r() * 184, y = pick3(r, [-48, -42, -60, -70, -80]) + 1 + r() * 3; g.fillStyle = 'rgba(230,244,250,.85)'; g.beginPath(); g.arc(x, y, .5 + r() * .9, 0, TAU); g.fill(); g.fillStyle = 'rgba(255,255,255,.95)'; g.fillRect(x - .2, y - .3, .4, .4); }   // gotas de rocío
  return S;
}
function paintLampPark() { const S = spr([-24, -360, 24, 2], 1.8), g = S.g, iron = 'rgb(30,28,30)'; g.fillStyle = iron; g.fillRect(-4, -330, 8, 330); g.fillRect(-12, -24, 24, 24); g.beginPath(); g.moveTo(-16, -330); g.lineTo(16, -330); g.lineTo(10, -352); g.lineTo(-10, -352); g.fill(); g.fillStyle = 'rgba(236,236,220,.85)'; g.fillRect(-9, -350, 18, 18); g.beginPath(); g.moveTo(-14, -352); g.lineTo(14, -352); g.lineTo(0, -362); g.fill(); marcaLogo(g, 'almagre', -5, -120, 10, { layout: 'emblema', mono: [140, 120, 80], monoBg: [30, 28, 30] }); return S; }
/* el muro de vidrio del invernadero: textura de 3600 × 460 con el interior (helechos, palmeras, enredaderas
   que presionan el vidrio), los paneles en distintos estados y el zócalo de piedra */
const GHP = [];   // estado de cada panel: [col, fila, tipo]  tipo: 0 limpio · 1 nuevo (parche) · 2 condensación · 3 musgo · 4 rajado
function paintGreenhouseWall() {
  const GH = PK.GH, w = GH.x1 - GH.x0, h = GH.ch, T = tex(w, h, .9), g = T.g, r = mulberry32(301), PW = 120, PH = 66;
  /* el interior: luz verde dorada, siluetas de plantas prehistóricas */
  const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgb(170,200,170)'); gr.addColorStop(.5, 'rgb(96,140,96)'); gr.addColorStop(1, 'rgb(40,70,44)'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 26; i++) { const x = r() * w, yb = h, L = 300 + r() * 380, c = pick3(r, [[40, 80, 46], [56, 100, 54], [30, 60, 38]]); for (let k = 0; k < 9; k++) { const a = -PI / 2 + (k - 4) * .32 + (r() - .5) * .1, ex = x + Math.cos(a) * L, ey = yb - 160 + Math.sin(a) * L * .9; g.strokeStyle = cssc(c, .85); g.lineWidth = 6; g.beginPath(); g.moveTo(x, yb - 160); g.quadraticCurveTo((x + ex) / 2, ey - 60, ex, ey); g.stroke(); for (let q = 1; q < 14; q++) { const u = q / 14, px = lerp(x, ex, u), py = lerp(yb - 160, ey, u) - Math.sin(u * PI) * 60; g.lineWidth = 3; g.beginPath(); g.moveTo(px, py); g.lineTo(px + Math.cos(a + 1.3) * 34 * (1 - u * .6), py + Math.sin(a + 1.3) * 34 * (1 - u * .6)); g.moveTo(px, py); g.lineTo(px + Math.cos(a - 1.3) * 34 * (1 - u * .6), py + Math.sin(a - 1.3) * 34 * (1 - u * .6)); g.stroke(); } } }   // helechos arborescentes
  for (let i = 0; i < 10; i++) { const x = r() * w; g.strokeStyle = 'rgba(60,50,40,.9)'; g.lineWidth = 10; g.beginPath(); g.moveTo(x, h); g.lineTo(x + 20, 120); g.stroke(); for (let k = 0; k < 8; k++) { const a = -PI + k * PI / 7; g.strokeStyle = 'rgba(50,96,52,.9)'; g.lineWidth = 7; g.beginPath(); g.moveTo(x + 20, 120); g.quadraticCurveTo(x + 20 + Math.cos(a) * 120, 60 + Math.sin(a) * 40, x + 20 + Math.cos(a) * 220, 140 + Math.abs(Math.cos(a)) * 40); g.stroke(); } }   // palmeras
  /* hojas pegadas al vidrio (más oscuras y nítidas) y enredaderas */
  for (let i = 0; i < 40; i++) { const x = r() * w, y = 100 + r() * (h - 140), s = 30 + r() * 50; g.save(); g.translate(x, y); g.rotate(r() * TAU); g.fillStyle = cssc(pick3(r, [[34, 76, 40], [50, 100, 50], [70, 120, 56]]), .95); g.beginPath(); g.moveTo(-s, 0); g.quadraticCurveTo(0, -s * .7, s, 0); g.quadraticCurveTo(0, s * .7, -s, 0); g.fill(); g.strokeStyle = 'rgba(150,200,120,.4)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(-s, 0); g.lineTo(s, 0); g.stroke(); g.restore(); }
  for (let i = 0; i < 8; i++) { let x = r() * w, y = h - 60; g.strokeStyle = 'rgba(56,96,48,.95)'; g.lineWidth = 4; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 30; k++) { x += (r() - .5) * 40; y -= 14; g.lineTo(x, y); if (k % 3 === 0) { g.fillStyle = 'rgba(70,120,56,.95)'; g.beginPath(); g.ellipse(x + 8, y, 10, 6, .5, 0, TAU); g.fill(); g.beginPath(); g.moveTo(x, y); } } g.stroke(); }
  /* paneles: cada uno con su estado */
  const top = h - GH.h;
  for (let c = 0; c * PW < w; c++) { const x = c * PW, central = GH.x0 + x >= GH.cx0 && GH.x0 + x < GH.cx1, y0 = central ? 0 : top;
    for (let row = 0; y0 + row * PH < h - 60; row++) { const y = y0 + row * PH, ty = r() < .16 ? 1 : r() < .2 ? 2 : r() < .25 && y > h - 260 ? 3 : r() < .04 ? 4 : 0; GHP.push([c, row, ty, central]);
      g.fillStyle = ['rgba(220,236,240,.16)', 'rgba(240,250,255,.06)', 'rgba(236,240,240,.32)', 'rgba(220,236,240,.2)', 'rgba(220,236,240,.2)'][ty]; g.fillRect(x, y, PW, PH);
      if (ty === 1) { g.strokeStyle = 'rgba(150,150,140,.9)'; g.lineWidth = 3; g.strokeRect(x + 3, y + 3, PW - 6, PH - 6); }   // masilla nueva
      if (ty === 2) { const cg = g.createLinearGradient(0, y + PH, 0, y); cg.addColorStop(0, 'rgba(250,252,250,.6)'); cg.addColorStop(1, 'rgba(250,252,250,.1)'); g.fillStyle = cg; g.fillRect(x, y, PW, PH); for (let k = 0; k < 8; k++) { g.fillStyle = 'rgba(90,120,100,.35)'; g.fillRect(x + 6 + r() * (PW - 12), y + r() * PH * .4, 1.6, 10 + r() * 30); } }
      if (ty === 3) { for (let k = 0; k < 40; k++) { g.fillStyle = cssc(pick3(r, [[80, 150, 50], [110, 170, 60], [60, 120, 40]]), .85); g.beginPath(); g.arc(x + (r() < .5 ? r() * 30 : PW - r() * 30), y + PH - r() * 24, 2 + r() * 4, 0, TAU); g.fill(); } }
      if (ty === 4) { g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 1; const cx = x + PW * (.3 + r() * .4), cy = y + PH * (.3 + r() * .4); for (let k = 0; k < 6; k++) { const a = r() * TAU; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a) * 40, cy + Math.sin(a) * 30); g.stroke(); } }
      g.fillStyle = 'rgba(255,255,255,.1)'; g.beginPath(); g.moveTo(x + 10, y + PH); g.lineTo(x + 50, y); g.lineTo(x + 66, y); g.lineTo(x + 26, y + PH); g.fill(); } }
  /* hierro forjado: montantes, travesaños, columnas con capitel, y el zócalo de piedra */
  g.fillStyle = 'rgb(36,48,46)'; for (let x = 0; x <= w; x += PW) { const central = GH.x0 + x >= GH.cx0 && GH.x0 + x <= GH.cx1; g.fillRect(x - 3, central ? 0 : top, 6, h); if ((x / PW) % 4 === 0) { g.fillRect(x - 7, central ? 0 : top, 14, h); g.fillRect(x - 12, (central ? 0 : top) + 20, 24, 8); } }
  for (let c = 0; c * PW < w; c++) { const x = c * PW, central = GH.x0 + x >= GH.cx0 && GH.x0 + x < GH.cx1, y0 = central ? 0 : top; for (let y = y0; y < h; y += PH) g.fillRect(x, y - 2, PW, 4); g.fillRect(x, y0 - 8, PW, 10); }
  /* el arco del pabellón central con su abanico */
  const ax = GH.cx0 - GH.x0, aw = GH.cx1 - GH.cx0; g.strokeStyle = 'rgb(36,48,46)'; g.lineWidth = 8; g.beginPath(); g.arc(ax + aw / 2, 230, aw / 2 - 20, PI, TAU); g.stroke(); for (let k = 0; k <= 10; k++) { const a = PI + k * PI / 10; g.lineWidth = 3; g.beginPath(); g.moveTo(ax + aw / 2, 230); g.lineTo(ax + aw / 2 + Math.cos(a) * (aw / 2 - 20), 230 + Math.sin(a) * (aw / 2 - 20)); g.stroke(); }
  const pl = g.createLinearGradient(0, h - 60, 0, h); pl.addColorStop(0, 'rgb(186,176,158)'); pl.addColorStop(1, 'rgb(140,130,116)'); g.fillStyle = pl; g.fillRect(0, h - 60, w, 60); g.fillStyle = 'rgba(80,120,60,.6)'; for (let i = 0; i < 400; i++) g.fillRect(r() * w, h - 20 - r() * 40, 2 + r() * 4, 1 + r() * 3);
  /* fuera del pabellón central, por encima del muro no hay nada (la bóveda va en 3D) */
  g.save(); g.setTransform(T.d, 0, 0, T.d, 0, 0); g.clearRect(0, 0, GH.cx0 - GH.x0, top - 8); g.clearRect(GH.cx1 - GH.x0, 0, GH.x1 - GH.cx1, top - 8); g.restore();
  wcTex(g, T.c.width, T.c.height, .2, .2);
  return T;
}
function paintParkSky() { const c = mk(1400, 900), g = c.getContext('2d'), r = mulberry32(29), gr = g.createLinearGradient(0, 0, 0, 900); gr.addColorStop(0, 'rgb(120,170,214)'); gr.addColorStop(.55, 'rgb(206,226,232)'); gr.addColorStop(1, 'rgb(252,236,200)'); g.fillStyle = gr; g.fillRect(0, 0, 1400, 900); for (let i = 0; i < 12; i++) wcWash(g, ellP(r() * 1400, 60 + r() * 380, 100 + r() * 200, 16 + r() * 18, 24), [250, 248, 244], .55, { reserve: false, mode: 'source-over', amt: 8, seed: i, edge: false }); return { c }; }
function parquePaint() {
  PKX.sky = paintParkSky(); PKX.path = matGravel(1200, 200, { seed: 71 }); PKX.grass = matGrass(1200, 300, { seed: 81 }); PKX.bank = matGrass(1200, 140, { seed: 82, c: [100, 140, 70] }); PKX.far = matGrass(2000, 200, { seed: 83, c: [110, 150, 76] });
  PKX.willows = [paintWillow(11), paintWillow(12), paintWillow(13)]; PKX.trees = [paintParkTree(21), paintParkTree(22, { autumn: true }), paintParkTree(23), paintParkTree(24, { w: 900 })];
  PKX.canopy = [paintCanopy(31), paintCanopy(32)]; PKX.fg = [paintPlantsFG(41), paintPlantsFG(42), paintPlantsFG(43)]; PKX.bench = paintBench(); PKX.lamp = paintLampPark();
  PKX.gh = paintGreenhouseWall(); PKX.ghCan = paintGhCanopy();
}
/* el follaje que se ve a través del techo: copas, frondas de palmera y enredaderas pegadas al vidrio, con huecos
   de cielo que se abren poco a poco hacia arriba (nunca un salto brusco de «hay plantas» a «no hay nada») */
function paintGhCanopy() {
  const w = PK.GH.x1 - PK.GH.x0, h = 640, T = tex(w, h, .35), g = T.g, r = mulberry32(311);
  const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgb(150,186,170)'); gr.addColorStop(.35, 'rgb(96,142,100)'); gr.addColorStop(1, 'rgb(44,82,50)'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 70; i++) { const x = r() * w, y = 60 + r() * 300, rr = 60 + r() * 90; g.fillStyle = `rgba(206,226,224,${.25 + r() * .3})`; g.beginPath(); g.ellipse(x, y * .7, rr, rr * .5, 0, 0, TAU); g.fill(); }   // claros de cielo, suaves
  for (let i = 0; i < 260; i++) { const x = r() * w, y = 80 + Math.pow(r(), .7) * (h - 60), rr = 30 + r() * 70, c = pick3(r, [[40, 84, 46], [58, 108, 58], [76, 128, 64], [34, 70, 40], [92, 140, 72]]); g.fillStyle = cssc(c, .9); for (let k = 0; k < 6; k++) { g.beginPath(); g.ellipse(x + (r() - .5) * rr, y + (r() - .5) * rr * .6, rr * (.4 + r() * .4), rr * (.25 + r() * .25), r() * 3, 0, TAU); g.fill(); } }   // copas
  for (let i = 0; i < 46; i++) { const x = r() * w, y = h - r() * 260, c = pick3(r, [[38, 80, 44], [52, 100, 52]]); for (let k = 0; k < 9; k++) { const a = -PI / 2 + (k - 4) * .34, L = 120 + r() * 120, ex = x + Math.cos(a) * L, ey = y + Math.sin(a) * L; g.strokeStyle = cssc(c, .9); g.lineWidth = 5; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo((x + ex) / 2, ey - 30, ex, ey); g.stroke(); for (let q = 1; q < 10; q++) { const u = q / 10, px = lerp(x, ex, u), py = lerp(y, ey, u) - Math.sin(u * PI) * 30; g.lineWidth = 2.5; g.beginPath(); g.moveTo(px, py); g.lineTo(px + Math.cos(a + 1.2) * 22, py + Math.sin(a + 1.2) * 22); g.moveTo(px, py); g.lineTo(px + Math.cos(a - 1.2) * 22, py + Math.sin(a - 1.2) * 22); g.stroke(); } } }   // frondas
  for (let i = 0; i < 90; i++) { const x = r() * w, y = r() * h, s = 18 + r() * 34; g.save(); g.translate(x, y); g.rotate(r() * TAU); g.fillStyle = cssc(pick3(r, [[30, 70, 36], [46, 96, 46], [64, 116, 52]]), .95); g.beginPath(); g.moveTo(-s, 0); g.quadraticCurveTo(0, -s * .7, s, 0); g.quadraticCurveTo(0, s * .7, -s, 0); g.fill(); g.restore(); }   // hojas pegadas al vidrio
  return T; }
/* testeros y laterales de vidrio: el arco cerrado (con plantas detrás) para que la estructura no quede hueca */
function ghFace(x, pts, t, seed) {
  const P = poly3(pts.map(([y, z]) => [x, y, z])); if (!P) return; const yTop = Math.min(...pts.map(p => p[0])), zs = pts.map(p => p[1]), z0 = Math.min(...zs), z1 = Math.max(...zs);
  ctx.save(); ctx.clip(P); const a = PJ(x, yTop, z0), b = PJ(x, 0, z0), gr = ctx.createLinearGradient(0, a[1], 0, b[1]); gr.addColorStop(0, 'rgb(150,184,170)'); gr.addColorStop(.4, 'rgb(84,130,90)'); gr.addColorStop(1, 'rgb(40,74,46)'); ctx.fillStyle = gr; ctx.fill(P);
  for (let i = 0; i < 40; i++) { const y = lerp(yTop * .95, -40, hsh(i, seed)), z = lerp(z0, z1, hsh(i, seed + 1)), c = PJ(x, y, z), rr = (30 + hsh(i, seed + 2) * 60) * PS(z); ctx.fillStyle = `rgba(${40 + hsh(i, 3) * 40 | 0},${84 + hsh(i, 4) * 50 | 0},${44 + hsh(i, 5) * 24 | 0},.85)`; ctx.beginPath(); ctx.ellipse(c[0], c[1], rr, rr * .6, hsh(i, 6) * 3, 0, TAU); ctx.fill(); }
  ctx.fillStyle = 'rgba(214,230,236,.18)'; ctx.fill(P);
  ctx.strokeStyle = 'rgb(36,48,46)'; for (let z = z0; z <= z1; z += 60) { const p = PJ(x, 0, z), q = PJ(x, yTop - 40, z); ctx.lineWidth = Math.max(.6, 2 * PS(z)); ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); }
  for (let y = -66; y > yTop; y -= 66) { const p = PJ(x, y, z0), q = PJ(x, y, z1); ctx.lineWidth = Math.max(.6, 1.6 * PS(z0)); ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); }
  ctx.restore(); ctx.strokeStyle = 'rgb(36,48,46)'; ctx.lineWidth = Math.max(1, 4 * PS(z0)); ctx.stroke(P);
}
function ghEnds(t) {
  const GH = PK.GH, z0 = GH.z, arch = (yb, R, a0, a1, n = 10) => { const o = []; for (let k = 0; k <= n; k++) { const a = lerp(a0, a1, k / n); o.push([yb - R * Math.sin(a), z0 + R * (1 - Math.cos(a)) * 1.4]); } return o; };
  const lo = arch(-GH.h, 520, 0, 1.25), zb = lo[lo.length - 1][1], end = [[0, z0]].concat(lo, [[lo[lo.length - 1][0], zb], [0, zb]]);
  ghFace(GH.x0, end, t, 11); ghFace(GH.x1, end, t, 21);
  const hi = arch(-GH.ch, 380, 0, 1.25), zp = hi[hi.length - 1][1], aMeet = Math.acos(1 - (zp - z0) / (1.4 * 520)), side = [[-GH.h, z0]].concat(hi, [[-GH.h - 520 * Math.sin(aMeet), zp]], arch(-GH.h, 520, aMeet, 0, 8));
  ghFace(GH.cx0, side, t, 31); ghFace(GH.cx1, side, t, 41);
}
/* la bóveda curva: filas de paneles en 3D que se van hacia atrás */
function ghRoof(t, x0, x1, yb, z0, R, o = {}) {
  const PW = 120, rows = 8;
  for (let i = 0; i < rows; i++) { const a0 = i / rows * 1.25, a1 = (i + 1) / rows * 1.25, Y = a => yb - R * Math.sin(a), Z = a => z0 + R * (1 - Math.cos(a)) * 1.4;
    for (let x = x0; x < x1; x += PW) { const q = [[x, Y(a1), Z(a1)], [x + PW, Y(a1), Z(a1)], [x + PW, Y(a0), Z(a0)], [x, Y(a0), Z(a0)]], P = poly3(q); if (!P) continue;
      const h = hsh(x * .01, i), ty = h < .14 ? 1 : h < .3 ? 2 : 0, sky = mixc([190, 214, 232], [250, 244, 226], i / rows);
      if (o.T) { const u0 = (x - o.ux0) / (o.ux1 - o.ux0), u1 = (x + PW - o.ux0) / (o.ux1 - o.ux0), v = k => 1 - (k / rows) * (o.vk ?? 1); texStrip(o.T, u0, u1, v(i + 1), v(i), PJ(x, Y(a1), Z(a1)), PJ(x + PW, Y(a1), Z(a1)), PJ(x, Y(a0), Z(a0)), .8);
        ctx.fillStyle = cssc(ty === 1 ? shc(sky, .12) : ty === 2 ? [244, 248, 246] : sky, ty === 2 ? .45 : ty === 1 ? .22 : .14); ctx.fill(P); }
      else { ctx.fillStyle = cssc(ty === 1 ? shc(sky, .12) : ty === 2 ? mixc(sky, [240, 244, 240], .5) : mixc(sky, [120, 160, 120], .35), .92); ctx.fill(P); }
      const glint = Math.max(0, Math.sin((x - CAM.x) * .004 + i * .7 - t * .6)); if (glint > .92) { ctx.fillStyle = `rgba(255,255,240,${(glint - .92) * 8})`; ctx.fill(P); }
      ctx.strokeStyle = 'rgb(36,48,46)'; ctx.lineWidth = Math.max(.6, 2.4 * PS(Z(a0))); ctx.stroke(P); } }
}
