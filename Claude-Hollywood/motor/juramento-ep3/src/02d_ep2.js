/* =====================================================================
   EPISODIO II — escenarios y utilidades nuevas: celda del Ministerio,
   torre de Astronomía, mansión Malfoy, el libro de pactos, pasillo del
   Ministerio, casa de York nevada, árboles desnudos, tejados, risco,
   hilo rojo del juramento, remolino de aparición, fantasmas.
   ===================================================================== */

/* ---------- celda de custodia ---------- */
function genCell(s0) {
  seed(s0);
  const sp = Spr(-1150, -560, 1150, 560, .6), g = sp.g, ink2 = '22,22,30';
  wash(g, rectP(-1190, -600, 1190, 600, 1), '50,50,60', { layers: 13, alpha: .12, amt: .06 });
  // hiladas de piedra
  g.strokeStyle = 'rgba(24,24,32,.22)'; g.lineWidth = 1.6;
  for (let y = -520, r = 0; y < 330; y += 58, r++) { g.beginPath(); g.moveTo(-1190, y + rnd(-2, 2)); g.lineTo(1190, y + rnd(-2, 2)); g.stroke(); for (let x = -1190 + (r % 2) * 55; x < 1190; x += 110 + rnd(-10, 10)) { g.beginPath(); g.moveTo(x, y); g.lineTo(x + rnd(-3, 3), y + 58); g.stroke(); } }
  // ventana alta con barrotes (hueco: se ve el cielo detrás)
  const win = arch(-420, -140, 170, 300, 16);
  g.save(); g.globalCompositeOperation = 'destination-out'; polyPath(g, win); g.fill(); g.restore();
  g.strokeStyle = 'rgba(20,20,26,.92)'; g.lineWidth = 12; polyPath(g, win); g.stroke();
  g.lineWidth = 7; g.lineCap = 'round'; g.beginPath(); for (let k = -2; k <= 2; k++) { g.moveTo(-420 + k * 32, -140); g.lineTo(-420 + k * 32, -430 + Math.abs(k) * 22); } g.moveTo(-505, -260); g.lineTo(-335, -260); g.stroke();
  // banco de piedra
  solid(g, rectP(20, 262, 440, 280), ink2, .26, 6); solid(g, rectP(40, 280, 70, 330), ink2, .26, 4); solid(g, rectP(390, 280, 420, 330), ink2, .26, 4);
  // argolla y cadena
  g.strokeStyle = 'rgba(30,30,36,.7)'; g.lineWidth = 3; g.beginPath(); g.arc(560, 90, 12, 0, TAU); g.stroke(); g.beginPath(); for (let k = 0; k < 7; k++) g.ellipse(560 + Math.sin(k) * 3, 110 + k * 16, 4, 8, 0, 0, TAU); g.stroke();
  // puerta enrejada
  solid(g, rectP(680, -40, 930, 330), '36,30,30', .24, 8);
  g.strokeStyle = 'rgba(16,14,18,.9)'; g.lineWidth = 5; g.strokeRect(740, 30, 130, 90); g.beginPath(); for (let k = 1; k < 4; k++) { g.moveTo(740 + k * 32.5, 30); g.lineTo(740 + k * 32.5, 120); } g.stroke();
  g.lineWidth = 7; g.beginPath(); for (const y of [-10, 170, 300]) { g.moveTo(680, y); g.lineTo(930, y); } g.stroke(); fCircG(g, 712, 150, 7, '120,110,90', .7);
  // suelo
  wash(g, rectP(-1190, 330, 1190, 600, .5), '30,30,38', { layers: 10, alpha: .16, amt: .1 });
  g.strokeStyle = 'rgba(20,20,28,.25)'; g.lineWidth = 1.5; for (let y = 368; y < 560; y += 50) { g.beginPath(); g.moveTo(-1190, y); g.lineTo(1190, y); g.stroke(); }
  granulate(sp, .24);
  return sp;
}
/* rayo de luna que entra por los barrotes */
function cellShaft(T, a, bx = 0) {
  if (a * SA <= .01) return; L(1); mode('source-over');
  const top = [[-505, -330], [-335, -330], [-335, -140], [-505, -140]], dx = .62;
  const proj = (p, y) => [p[0] + (y - p[1]) * dx, y];
  const A = [-505, -300], Bp = [-335, -300], fl = .9 + .1 * N2(T * .5, 3);
  const C = proj(Bp, 560), D2 = proj(A, 560);
  const gr = ctx.createLinearGradient(A[0], A[1], (C[0] + D2[0]) / 2, 560); gr.addColorStop(0, `rgba(196,206,236,${.2 * a * SA * fl})`); gr.addColorStop(1, `rgba(196,206,236,${.07 * a * SA * fl})`);
  ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(Bp[0], Bp[1]); ctx.lineTo(C[0] + bx, C[1]); ctx.lineTo(D2[0] + bx, D2[1]); ctx.fill();
  mode('multiply'); ctx.strokeStyle = `rgba(30,30,44,${.32 * a * SA})`; ctx.lineWidth = 9;
  ctx.beginPath(); for (let k = -2; k <= 2; k++) { const p = [-420 + k * 32, -300], q = proj(p, 560); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0] + bx, q[1]); } ctx.stroke();
  // mancha de luz en el suelo
  mode('source-over'); ctx.fillStyle = `rgba(206,214,240,${.12 * a * SA * fl})`; ctx.beginPath(); ctx.ellipse((C[0] + D2[0]) / 2 - 60, 400, 190, 40, 0, 0, TAU); ctx.fill(); mode('multiply');
}

/* ---------- torre de Astronomía: almenas y telescopio ---------- */
function genParapet(s0) {
  seed(s0);
  const sp = Spr(-1250, 40, 1250, 600, .6), g = sp.g, ink = '40,40,54', ink2 = '24,24,34';
  solid(g, rectP(-1250, 190, 1250, 312), ink, .34, 12);
  for (let x = -1240; x < 1250; x += 150) solid(g, rectP(x, 122, x + 84, 196), ink, .34, 10);
  g.strokeStyle = 'rgba(20,20,30,.3)'; g.lineWidth = 1.5; for (let y = 220; y < 312; y += 34) { g.beginPath(); g.moveTo(-1250, y); g.lineTo(1250, y); g.stroke(); }
  wash(g, rectP(-1290, 312, 1290, 640, .4), '56,58,74', { layers: 10, alpha: .14, amt: .08 });
  g.strokeStyle = 'rgba(24,24,34,.3)'; g.lineWidth = 1.5; for (let y = 350; y < 600; y += 46) { g.beginPath(); g.moveTo(-1290, y); g.lineTo(1290, y); g.stroke(); }
  // telescopio de latón sobre trípode
  g.lineCap = 'round'; g.strokeStyle = 'rgba(26,24,30,.9)'; g.lineWidth = 6; g.beginPath(); g.moveTo(640, 80); g.lineTo(590, 330); g.moveTo(640, 80); g.lineTo(700, 330); g.moveTo(640, 80); g.lineTo(650, 336); g.stroke();
  const P = new Path2D(); cap(P, [560, 120], [780, -10], 15, 10); cap(P, [520, 140], [560, 120], 8, 8); g.fillStyle = 'rgba(40,34,30,.88)'; g.fill(P);
  g.strokeStyle = 'rgba(190,150,80,.55)'; g.lineWidth = 2; g.beginPath(); g.moveTo(600, 100); g.lineTo(606, 112); g.moveTo(700, 40); g.lineTo(706, 52); g.stroke();
  granulate(sp, .2);
  return sp;
}

/* ---------- mansión Malfoy: biblioteca con fuego verde ---------- */
function genManor(s0) {
  seed(s0);
  const sp = Spr(-1150, -560, 1150, 560, .6), g = sp.g, ink2 = '18,22,20';
  wash(g, rectP(-1190, -600, 1190, 600, 1), '40,48,46', { layers: 13, alpha: .13, amt: .06 });
  const wins = [arch(-780, 200, 190, 640, 18), arch(-470, 200, 190, 640, 18)];
  g.save(); g.globalCompositeOperation = 'destination-out'; for (const w of wins) { polyPath(g, w); g.fill(); } g.restore();
  for (const w of wins) {
    g.save(); polyPath(g, w); g.clip(); g.strokeStyle = 'rgba(18,22,20,.55)'; g.lineWidth = 2;
    const cx = w[0][0] + 95; g.beginPath(); for (let k = -16; k <= 16; k++) { g.moveTo(cx - 120 + k * 30, -480); g.lineTo(cx + 120 + k * 30, 220); g.moveTo(cx + 120 + k * 30, -480); g.lineTo(cx - 120 + k * 30, 220); } g.stroke(); g.restore();
    g.strokeStyle = 'rgba(18,22,20,.92)'; g.lineWidth = 11; polyPath(g, w); g.stroke(); g.lineWidth = 5; g.beginPath(); g.moveTo(w[0][0] + 95, 200); g.lineTo(w[0][0] + 95, -380); g.stroke();
  }
  // estanterías de suelo a techo
  solid(g, rectP(420, -560, 1150, 330), ink2, .2, 8);
  for (let sh = -540; sh < 300; sh += 96) { let x = 440; while (x < 1130) { const w = rnd(10, 22), h = rnd(54, 84); solid(g, rectP(x, sh + 88 - h, x + w, sh + 88), pick(['38,58,46', '56,40,36', '30,36,44', '64,58,40', '26,44,34']), .22, 3); x += w + rnd(1, 3); } solid(g, rectP(430, sh + 88, 1140, sh + 96), ink2, .3, 3); }
  // retrato oscuro
  g.strokeStyle = 'rgba(150,130,80,.45)'; g.lineWidth = 6; g.beginPath(); g.ellipse(40, -470, 80, 100, 0, 0, TAU); g.stroke(); g.fillStyle = 'rgba(20,24,22,.5)'; g.fill();
  wash(g, rectP(-1190, 330, 1190, 600, .5), '24,30,28', { layers: 10, alpha: .16, amt: .1 });
  g.strokeStyle = 'rgba(18,22,20,.25)'; g.lineWidth = 1.5; for (let y = 364; y < 560; y += 44) { g.beginPath(); g.moveTo(-1190, y); g.lineTo(1190, y); g.stroke(); }
  granulate(sp, .22);
  return sp;
}
function genManorTable(s0) { seed(s0); const sp = Spr(-350, 186, 340, 340, .7), g = sp.g, ink2 = '18,22,20'; solid(g, rectP(-330, 200, 320, 218), ink2, .3, 6); solid(g, rectP(-310, 218, -292, 330), ink2, .28, 3); solid(g, rectP(282, 218, 300, 330), ink2, .28, 3); return sp; }
function greenFlame(c) { // recolorea una llama naranja → verde (fuego de la mansión)
  const o = mk(c.width, c.height), g = o.getContext('2d'); g.drawImage(c, 0, 0);
  const im = g.getImageData(0, 0, o.width, o.height), d = im.data;
  for (let i = 0; i < d.length; i += 4) { const r = d[i], gg = d[i + 1], b = d[i + 2]; d[i] = Math.min(255, b * 1.3 + 20); d[i + 1] = Math.min(255, r * .95); d[i + 2] = Math.min(255, gg * .75 + 30); }
  g.putImageData(im, 0, 0); return o;
}

/* ---------- el libro: Pactum Sanguinis ---------- */
function inkDrop(g, x, y, r, col, a) { g.fillStyle = `rgba(${col},${a})`; g.beginPath(); g.moveTo(x, y - r * 1.9); g.quadraticCurveTo(x + r * 1.1, y - r * .4, x + r, y + r * .1); g.arc(x, y + r * .1, r, 0, PI); g.quadraticCurveTo(x - r * 1.1, y - r * .4, x, y - r * 1.9); g.fill(); }
function genTome(s0) {
  seed(s0);
  const sp = Spr(-580, -380, 580, 380, 1), g = sp.g;
  wash(g, rectP(-560, -350, 560, 360, .2), '40,30,26', { layers: 8, alpha: .2, amt: .03 }); // tapa
  for (const sx of [-1, 1]) { const pts = [[0, -322], [sx * 255, -336], [sx * 528, -322], [sx * 534, 330], [sx * 255, 342], [0, 330]]; wash(g, pts.map(p => [p[0], p[1], .12]), '238,226,198', { layers: 12, alpha: .22, amt: .02 }); }
  g.fillStyle = 'rgba(160,120,80,.13)'; g.fillRect(-528, -330, 1056, 660);
  const gr = g.createLinearGradient(-60, 0, 60, 0); gr.addColorStop(0, 'rgba(60,40,30,0)'); gr.addColorStop(.5, 'rgba(60,40,30,.42)'); gr.addColorStop(1, 'rgba(60,40,30,0)'); g.fillStyle = gr; g.fillRect(-60, -330, 120, 660);
  g.strokeStyle = 'rgba(90,70,50,.4)'; g.lineWidth = 1.2; for (let k = 1; k < 5; k++) { g.beginPath(); g.moveTo(-530, 330 + k * 4); g.lineTo(-10, 330 + k * 3); g.moveTo(10, 330 + k * 3); g.lineTo(534, 330 + k * 4); g.stroke(); }
  // página izquierda: título y diagrama
  g.textAlign = 'center'; g.fillStyle = 'rgba(40,28,30,.88)'; g.font = `46px 'IM Fell English SC', 'IM Fell English', Georgia, serif`; g.fillText('Pactum Sanguinis', -265, -240);
  g.font = `italic 22px 'IM Fell English', Georgia, serif`; g.fillStyle = 'rgba(60,40,36,.7)'; g.fillText('de vinculis quae non solvuntur', -265, -204);
  const cx = -265, cy = 40, r = 150;
  g.strokeStyle = 'rgba(40,28,30,.6)'; g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, r + 30, 0, TAU); g.stroke(); g.lineWidth = 1; g.beginPath(); g.arc(cx, cy, r + 40, 0, TAU); g.stroke();
  g.beginPath(); for (let k = 0; k < 24; k++) { const a = k / 24 * TAU, l = k % 2 ? 6 : 14; g.moveTo(cx + Math.cos(a) * (r + 40), cy + Math.sin(a) * (r + 40)); g.lineTo(cx + Math.cos(a) * (r + 40 + l), cy + Math.sin(a) * (r + 40 + l)); } g.stroke();
  const V = [-PI / 2, PI / 6, 5 * PI / 6].map(a => [cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  g.strokeStyle = 'rgba(150,20,30,.75)'; g.lineWidth = 2.4; g.beginPath(); V.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath(); g.stroke();
  for (const p of V) inkDrop(g, p[0], p[1] + 8, 13, '160,20,32', .85);
  // farol en el centro
  g.fillStyle = 'rgba(40,28,30,.8)'; g.fillRect(cx - 10, cy - 18, 20, 30); g.beginPath(); g.moveTo(cx - 14, cy - 18); g.lineTo(cx, cy - 32); g.lineTo(cx + 14, cy - 18); g.fill(); g.strokeStyle = 'rgba(40,28,30,.6)'; g.lineWidth = 1.4; g.beginPath(); for (let k = 0; k < 8; k++) { const a = k / 8 * TAU; g.moveTo(cx + Math.cos(a) * 26, cy - 3 + Math.sin(a) * 26); g.lineTo(cx + Math.cos(a) * 40, cy - 3 + Math.sin(a) * 40); } g.stroke();
  g.font = `italic 18px 'IM Fell English', Georgia, serif`; g.fillStyle = 'rgba(60,40,36,.7)'; g.fillText('locus · tres · venia', cx, cy + r + 80);
  granulate(sp, .12);
  const lines = [['Lo que se jura con sangre', -270], ['solo se desata donde se juró,', -190], ['con los tres presentes', -110], ['y el agravio perdonado.', -30]]
    .map(([s, y], i) => Object.assign(genScript(s, 38, 600 + i, '36,26,30'), { x: 40, y }));
  const note = [['…o cuando uno de los tres', 70], ['deje de respirar.', 130]].map(([s, y], i) => Object.assign(genScript(s, 34, 620 + i, '150,18,30'), { x: 120, y }));
  return { sp, lines, note, V };
}

/* ---------- pasillo del Ministerio ---------- */
function genMinistry(s0) {
  seed(s0);
  const sp = Spr(-1250, -560, 1250, 560, .6), g = sp.g, ink2 = '14,20,18', lamps = [];
  wash(g, rectP(-1290, -600, 1290, 600, 1), '30,40,38', { layers: 14, alpha: .13, amt: .06 });
  for (let x = -1050; x <= 1050; x += 420) {
    solid(g, rectP(x - 120, -300, x + 120, 330), '18,24,22', .2, 7);                 // puertas altas
    g.strokeStyle = 'rgba(170,140,70,.35)'; g.lineWidth = 3; g.strokeRect(x - 104, -284, 208, 614);
    lamps.push({ x: x + 210, y: -180 });
  }
  for (let x = -1260; x <= 1260; x += 420) { solid(g, rectP(x + 170, -560, x + 250, 330), ink2, .22, 7); solid(g, rectP(x + 160, -330, x + 260, -300), ink2, .26, 4); solid(g, rectP(x + 160, 300, x + 260, 330), ink2, .26, 4); }
  wash(g, rectP(-1290, 330, 1290, 600, .3), '16,22,20', { layers: 10, alpha: .2, amt: .06 });
  g.strokeStyle = 'rgba(160,140,90,.18)'; g.lineWidth = 1.4; for (let y = 352; y < 560; y += 38) { g.beginPath(); g.moveTo(-1290, y); g.lineTo(1290, y); g.stroke(); }
  for (let x = -1300; x < 1300; x += 90) { g.beginPath(); g.moveTo(x, 330); g.lineTo(x * 1.6, 600); g.stroke(); }
  granulate(sp, .2);
  return { sp, lamps };
}
function hangLamp(x, y, T, a = 1, col = '255,206,130') { // lámpara colgante dorada
  L(1); ctx.strokeStyle = `rgba(20,20,22,${SA})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, -560); ctx.lineTo(x, y - 14); ctx.stroke();
  ctx.fillStyle = `rgba(30,26,22,${SA})`; ctx.beginPath(); ctx.moveTo(x - 16, y - 14); ctx.lineTo(x + 16, y - 14); ctx.lineTo(x + 10, y + 10); ctx.lineTo(x - 10, y + 10); ctx.fill();
  const fl = .85 + .15 * N2(T * 3, x); glowAt(x, y, 360, col, .42 * a * fl); glowAt(x, y, 30, '255,240,200', .85 * a * fl);
}

/* ---------- casa de York, abandonada y nevada ---------- */
function genHouseSnow(s0) {
  const h = genHouse(s0), g = h.sp.g; seed(s0 + 5);
  g.save(); g.globalCompositeOperation = 'destination-out';
  // nieve sobre el tejado principal y el del porche
  const band = (pts, th) => { g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); for (let i = pts.length - 1; i >= 0; i--) g.lineTo(pts[i][0] + rnd(-2, 2), pts[i][1] + th + rnd(0, th * .6)); g.closePath(); g.fill(); };
  const ridge = []; for (let k = 0; k <= 20; k++) { const f = k / 20; ridge.push([lerp(-20, 210, f), lerp(-140, -330, f)]); } for (let k = 1; k <= 20; k++) { const f = k / 20; ridge.push([lerp(210, 440, f), lerp(-330, -140, f)]); }
  band(ridge, 12); band([[-40, -30], [100, -31], [300, -30], [460, -31]], 9);
  g.fillRect(300, -340, 30, 9);
  // baranda rota
  g.fillRect(36, 160, 72, 76);
  g.restore();
  solid(g, rectP(36, 160, 108, 236), '50,46,52', .11, 10);
  g.strokeStyle = 'rgba(28,26,32,.85)'; g.lineWidth = 3; g.beginPath(); g.moveTo(36, 168); g.lineTo(58, 190); g.moveTo(108, 200); g.lineTo(88, 226); g.stroke();
  g.lineWidth = 1.6; g.beginPath(); g.moveTo(50, 232); g.lineTo(62, 206); g.stroke();
  return h;
}
function houseWinsDark(h, T, x0, y0, s, lit = 0) { // ventanas oscuras con reflejo de luna (o luz débil al amanecer)
  mode('source-over');
  for (const w of h.wins) {
    const x = x0 + w.x * s, y = y0 + w.y * s, ww = w.w * s, hh = w.h * s;
    ctx.fillStyle = `rgba(${lit ? '230,170,100' : '40,46,66'},${(lit ? .35 * lit : .55) * SA})`; ctx.fillRect(x - ww / 2, y - hh / 2, ww, hh);
    ctx.fillStyle = `rgba(200,210,236,${.12 * SA})`; ctx.beginPath(); ctx.moveTo(x - ww / 2, y - hh / 2); ctx.lineTo(x - ww / 2 + ww * .35, y - hh / 2); ctx.lineTo(x - ww / 2, y - hh / 2 + hh * .45); ctx.fill();
    ctx.strokeStyle = `rgba(30,26,30,${.85 * SA})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y - hh / 2); ctx.lineTo(x, y + hh / 2); if (!w.door) { ctx.moveTo(x - ww / 2, y); ctx.lineTo(x + ww / 2, y); } ctx.stroke();
    if (w.ph === 3) { ctx.lineWidth = 7; ctx.strokeStyle = `rgba(40,30,26,${.95 * SA})`; ctx.beginPath(); ctx.moveTo(x - ww / 2 - 4, y - hh / 2 + 6); ctx.lineTo(x + ww / 2 + 4, y + hh / 2 - 10); ctx.moveTo(x - ww / 2 - 4, y + hh / 2 - 4); ctx.lineTo(x + ww / 2 + 4, y - hh / 2 + 14); ctx.stroke(); }
  }
  mode('multiply');
}
function genBareTree(s0, hgt = 420) {
  seed(s0);
  const sp = Spr(-300, -hgt - 140, 300, 40, .7), g = sp.g;
  const branch = (x, y, a, len, w, d) => {
    const pts = [[x, y]]; let px = x, py = y, aa = a;
    for (let k = 1; k <= 6; k++) { aa += rnd(-.18, .18); px += Math.sin(aa) * len / 6; py -= Math.cos(aa) * len / 6; pts.push([px, py]); }
    brush(g, pts, { w: u => w * (1 - u * .55), col: '24,22,28', a: .85, bristles: Math.max(2, Math.round(w)), body: .95, dryStart: .9, seed: s0 + d * 13 + (x | 0) });
    if (d < 5) { const n = d < 2 ? 2 : pick([2, 2, 3]); for (let i = 0; i < n; i++) branch(px, py, aa + rnd(-.75, .75), len * rnd(.55, .75), w * .62, d + 1); }
  };
  branch(0, 30, rnd(-.08, .08), hgt * .55, 16, 0);
  granulate(sp, .15);
  return sp;
}
/* tejados de una ciudad (panel de Damien) */
function genRooftops(s0) {
  seed(s0);
  const sp = Spr(-700, -200, 700, 600, .6), g = sp.g;
  let x = -720; while (x < 720) { const w = rnd(110, 200), y = rnd(60, 200); solid(g, [[x, 600], [x, y], [x + w / 2, y - rnd(50, 90)], [x + w, y], [x + w, 600]], '26,26,36', .2, 6); if (R() < .7) solid(g, rectP(x + w * .65, y - 70, x + w * .65 + 20, y - 10), '20,20,28', .24, 3); x += w - 6; }
  granulate(sp, .2);
  return sp;
}
/* risco del páramo (epílogo de Damien) */
function genCrag(s0) {
  seed(s0);
  const sp = Spr(-500, -40, 900, 620, .6), g = sp.g, pts = [];
  for (let x = -500; x <= 900; x += 20) { let y = x < -80 ? lerp(420, 190, sm((x + 500) / 420)) : x < 380 ? 186 + Math.abs(FBM(x * .01, 3, 3)) * 18 : lerp(190, 560, sm((x - 380) / 420)); y += FBM(x * .03, 7, 3) * 14; pts.push([x, y, .5]); }
  pts.push([900, 620, 1], [-500, 620, 1]);
  wash(g, pts, '22,22,30', { layers: 14, alpha: .12, amt: .1, base: 1, per: 2 });
  for (let i = 0; i < 20; i++) { const x = rnd(-300, 700), y = rnd(240, 520); brush(g, [[x, y], [x + rnd(-30, 30), y + rnd(30, 80)]], { w: u => 3 * (1 - u), col: '16,16,22', a: .35, bristles: 3, seed: i }); }
  granulate(sp, .2);
  return sp;
}

/* ---------- el hilo rojo del juramento ---------- */
function hilo(p, q, T, a, o = {}) {
  if (a * SA <= .01) return; const col = o.col || '220,40,50', beat = o.beat ?? Math.pow(Math.max(0, Math.sin(T * 3.4 + (o.ph || 0))), 6);
  const mx = (p[0] + q[0]) / 2 + (o.bx || 0), my = (p[1] + q[1]) / 2 + (o.sag ?? 40) + Math.sin(T * 1.7 + (o.ph || 0)) * 6;
  const prev = ctx.globalCompositeOperation; mode('source-over'); ctx.lineCap = 'round';
  const z = U * CAM.z, w = o.w || 2;
  if (o.gap) { ctx.setLineDash(o.gap); ctx.lineDashOffset = -T * 30; }
  for (const [lw, al, bl] of [[w * 3.4, .22, 16], [w, .95, 6]]) {
    ctx.strokeStyle = `rgba(${col},${al * a * SA * (.65 + .35 * beat)})`; ctx.lineWidth = lw * (1 + beat * .4); ctx.shadowColor = `rgba(${o.glow || '255,60,60'},.95)`; ctx.shadowBlur = LOWQ ? 0 : (bl + 14 * beat) * z;
    ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.quadraticCurveTo(mx, my, q[0], q[1]); ctx.stroke();
  }
  ctx.setLineDash([]); ctx.shadowBlur = 0; mode(prev);
  return [mx, my];
}
function hiloPt(p, q, T, f, o = {}) { const mx = (p[0] + q[0]) / 2 + (o.bx || 0), my = (p[1] + q[1]) / 2 + (o.sag ?? 40) + Math.sin(T * 1.7 + (o.ph || 0)) * 6, u = 1 - f; return [u * u * p[0] + 2 * u * f * mx + f * f * q[0], u * u * p[1] + 2 * u * f * my + f * f * q[1]]; }
/* anillo del hilo en una muñeca */
function wristRing(w, T, a, r = 6) { if (a * SA <= .01) return; const beat = Math.pow(Math.max(0, Math.sin(T * 3.4)), 6); mode('source-over'); ctx.strokeStyle = `rgba(230,50,56,${(.6 + .4 * beat) * a * SA})`; ctx.lineWidth = 1.6; ctx.shadowColor = 'rgba(255,60,60,.95)'; ctx.shadowBlur = LOWQ ? 0 : (6 + 10 * beat) * U * CAM.z; ctx.beginPath(); ctx.ellipse(w[0], w[1], r, r * .45, .3, 0, TAU); ctx.stroke(); ctx.shadowBlur = 0; mode('multiply'); }

/* ---------- aparición / desaparición: remolino de tinta ---------- */
function appar(x, y, k, a = 1, sd = 1, col = '20,16,20') {
  if (k <= 0 || k >= 1 || a <= 0) return; L(1);
  const env = Math.sin(k * PI), prev = ctx.globalCompositeOperation; mode('multiply'); ctx.lineCap = 'round';
  for (let i = 0; i < 9; i++) {
    const r0 = (40 + i * 22) * (1 - k * .85), a0 = k * 9 * (i % 2 ? 1 : -1) + i * 1.7 + sd, len = 1.6 + .4 * Math.sin(i);
    ctx.strokeStyle = `rgba(${col},${.55 * env * a * SA})`; ctx.lineWidth = (6 - i * .45) * (1 - k * .5);
    ctx.beginPath(); for (let j = 0; j <= 16; j++) { const f = j / 16, an = a0 + f * len, rr = r0 * (1 - f * .25); const px = x + Math.cos(an) * rr, py = y - 110 + Math.sin(an) * rr * 1.25; j ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke();
  }
  mode(prev);
  if (k > .55 && k < .9) glowAt(x, y - 110, 160, '220,214,240', .5 * Math.sin(rg(k, .55, .9) * PI) * a);
}

/* ---------- fantasmas de los niños bajo el farol ---------- */
function ghostKids(T, a, x0, y0, s = 2.1) {
  if (a * SA <= .01) return;
  const kids = [['damien', -70, 'swept', 'm', true], ['joy', 0, 'braid', 'f', false], ['anami', 70, 'short', 'm', true]];
  for (const [n, ox, hair, sex, fl] of kids) {
    const F = mage({ ...REACH, ra: 1.45 + .05 * Math.sin(T * 2 + ox) }, { sex, hair, child: 1, t: T, wind: .2 });
    L(1); mode('source-over');
    drawMage(F, x0 + ox, y0, s, fl, { a: a * (.55 + .1 * Math.sin(T * 1.3 + ox)), ink: '255,222,168', inkA: .32, halo: 10, haloA: 0, noShadow: 1, house: CAST[n].house, glow: .5, child: 1 });
    mode('multiply');
  }
  glowAt(x0, y0 - 120, 260, '255,214,150', .25 * a);
}

/* ---------- auror con sombrero de copa ---------- */
function auror(p, x, y, s, flip, T, o = {}) {
  const F = mage(p, { sex: 'm', hair: 'short', t: T, wind: .15, wand: o.wand, wandA: o.wandA });
  L(1); drawMage(F, x, y, s, flip, Object.assign({ noGlow: 1, after: G => { ctx.fillStyle = 'rgba(16,14,18,.95)'; ctx.fillRect(G.Hd[0] - 7, G.Hd[1] - 14, 14, 12); ctx.fillRect(G.Hd[0] - 11, G.Hd[1] - 4, 22, 3); } }, o));
  return F;
}
/* motas doradas (luciérnagas del perdón): gradientes en vez de sprites (más rápido) */
function motesDraw(P, a = 1) {
  L(1); mode('source-over');
  for (const q of P.p) { if (!q.on) continue; const fa = Math.min(1, q.age / .3) * Math.min(1, (q.life - q.age) / 1.5) * q.a * a * SA * (.75 + .25 * Math.sin(q.f * 3)); if (fa <= .01) continue; const r = q.s * 1.6; ctx.fillStyle = `rgba(255,200,100,${fa * .22})`; ctx.beginPath(); ctx.arc(q.x, q.y, r, 0, TAU); ctx.fill(); ctx.fillStyle = `rgba(255,236,170,${fa})`; ctx.beginPath(); ctx.arc(q.x, q.y, r * .35, 0, TAU); ctx.fill(); }
  mode('multiply');
}
