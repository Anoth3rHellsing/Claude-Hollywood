/* =====================================================================
   ESCENA 4 · EL SANTUARIO DE ACERO: la cocina de Brasa y Bruma (dos estrellas Guía Brújula)
   Luz cenital blanca, fría, quirúrgica; solo la rompen el azul de los quemadores, el rojo del binchotan y de las
   lámparas del pase, y la llamarada del flambeado.
   Planta (cm): pared de azulejo z = 900 (puerta batiente al comedor en x 560…670, con ojo de buey) · campana x -420…380 (frente z 640, abajo y -210) · fogón x -420…380
     (z 700…880, sobre y -90) con quemadores, ollas de caldo y la robata · roners x -650…-450 · cobre colgado y
     barra de cuchillos · cucharones bajo la campana · pase de acero x -300…500 (z 420…560) con lámparas
     infrarrojas · reloj de pared Kronotek y estante sobre x 390…550
   ===================================================================== */
const KI = { ZB: 900, X0: -700, X1: 800, Y0: -330, ZF: 150, HOOD: { x0: -420, x1: 380, y0: -330, y1: -210, z0: 640 }, RANGE: { x0: -420, x1: 380, z0: 700, z1: 880, top: -90 }, PASS: { x0: -300, x1: 500, z0: 420, z1: 560, top: -95 }, ROB: { x0: 150, x1: 360, z: 790 }, DOOR: { x0: 560, x1: 670 }, CLK: [470, -292], PRN: -130, BELL: 462 };
const KIX = {};
const COLD = [196, 210, 228];
const BURN = [[-330, 750], [-180, 750], [-350, 835], [-110, 835]];
const POTS = [[-350, 835, 30, 62], [-110, 835, 36, 74]];
const LADLES = [[-380, 836], [-320, 840], [-260, 836], [-40, 832], [20, 838], [80, 834]];
/* ---------- pintores ---------- */
function paintCopperPan(seed, r_, long) { const S = spr([-r_ - 4, -10, r_ + 4, (long ? 70 : 50) + r_ * 2], 3), g = S.g, rr = mulberry32(seed);
  g.strokeStyle = 'rgb(70,60,52)'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, -8); g.lineTo(0, 4); g.stroke();
  const hl = long ? 64 : 44; g.fillStyle = 'rgb(150,150,156)'; g.fillRect(-3, 2, 6, hl); g.beginPath(); g.arc(0, 4, 4, 0, TAU); g.fill();
  const cy = hl + r_, gr = g.createRadialGradient(-r_ * .3, cy - r_ * .3, r_ * .1, 0, cy, r_); gr.addColorStop(0, 'rgb(250,190,140)'); gr.addColorStop(.4, 'rgb(206,112,64)'); gr.addColorStop(1, 'rgb(130,62,36)'); g.fillStyle = gr; g.beginPath(); g.arc(0, cy, r_, 0, TAU); g.fill();
  const sc = g.createRadialGradient(r_ * .2, cy + r_ * .3, 0, 0, cy, r_); sc.addColorStop(0, 'rgba(30,20,16,.75)'); sc.addColorStop(.5, 'rgba(60,34,20,.4)'); sc.addColorStop(1, 'rgba(60,34,20,0)'); g.fillStyle = sc; g.beginPath(); g.arc(0, cy, r_ * .82, 0, TAU); g.fill();   // fondo oscurecido por el uso
  for (let k = 0; k < 30; k++) { g.fillStyle = `rgba(255,220,180,${rr() * .25})`; g.beginPath(); g.arc((rr() - .5) * r_ * 1.4, cy + (rr() - .5) * r_ * 1.4, .8 + rr() * 1.4, 0, TAU); g.fill(); }   // martillado
  g.strokeStyle = 'rgba(90,44,24,.8)'; g.lineWidth = 1.4; g.beginPath(); g.arc(0, cy, r_, 0, TAU); g.stroke(); g.fillStyle = 'rgba(255,240,220,.6)'; g.beginPath(); g.ellipse(-r_ * .45, cy - r_ * .45, r_ * .18, r_ * .08, -.6, 0, TAU); g.fill();
  return S; }
function paintKnifeBar() {   /* barra magnética con siete cuchillos Tsukiyo de tamaño real (hoja de Damasco, mango octogonal) */
  const S = spr([-4, -8, 134, 44], 6), g = S.g;
  g.fillStyle = 'rgb(36,36,40)'; g.fillRect(0, -3, 130, 6); g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(0, -3, 130, 1);
  const K = [[24, 4.6, 1], [21, 4.8, 1], [18, 4.2, 0], [13, 3, 1], [17, 5.2, 2], [15, 4.6, 3], [27, 4.8, 1]];   // largo, ancho, forma (0 santoku, 1 gyuto, 2 nakiri, 3 deba)
  K.forEach(([L, bw, sh], i) => { const x = 10 + i * 18.4, top = 2;
    g.fillStyle = 'rgb(58,40,28)'; g.fillRect(x - 1.4, -9, 2.8, 7); g.fillStyle = 'rgb(180,170,150)'; g.fillRect(x - 1.5, -3, 3, 1.4);   // mango asomando y virola
    const P = sh === 2 ? [[x - bw / 2, top], [x + bw / 2, top], [x + bw / 2, top + L], [x - bw / 2, top + L]] : sh === 0 ? [[x - bw / 2, top], [x + bw / 2, top], [x + bw / 2, top + L * .8], [x - bw / 2 + .6, top + L], [x - bw / 2, top + L * .9]] : [[x - bw / 2, top], [x + bw / 2, top], [x + bw * .45, top + L * .7], [x - bw / 2 + .4, top + L], [x - bw / 2, top + L * .6]];
    const gr = g.createLinearGradient(x - bw / 2, 0, x + bw / 2, 0); gr.addColorStop(0, 'rgb(120,126,136)'); gr.addColorStop(.55, 'rgb(214,218,226)'); gr.addColorStop(.8, 'rgb(246,248,252)'); gr.addColorStop(1, 'rgb(150,156,166)'); g.fillStyle = gr; g.fill(pPolys([P]));
    g.save(); g.clip(pPolys([P])); g.strokeStyle = 'rgba(70,76,90,.35)'; g.lineWidth = .25; for (let k = 0; k < 14; k++) { g.beginPath(); for (let y = top; y < top + L; y += .8) g.lineTo(x - bw / 2 + Math.sin(y * .9 + k * 1.3) * .8 + k * bw / 12, y); g.stroke(); }   // ondas del Damasco
    g.fillStyle = 'rgba(255,255,255,.75)'; g.fillRect(x + bw * .36, top, .5, L * .75); g.restore();
    g.strokeStyle = 'rgba(40,44,52,.7)'; g.lineWidth = .3; g.stroke(pPolys([P])); });
  marcaLogo(g, 'tsukiyo', 112, 30, 10, { layout: 'emblema', mono: [200, 200, 206], monoBg: [228, 230, 232] });
  return S; }
function paintLadle(L) { const S = spr([-14, -4, 14, L + 30], 3), g = S.g; g.strokeStyle = 'rgb(176,180,188)'; g.lineWidth = 3; g.beginPath(); g.arc(0, 0, 3, PI, TAU); g.moveTo(3, 0); g.lineTo(2, L); g.stroke(); const gr = g.createLinearGradient(-12, 0, 12, 0); gr.addColorStop(0, 'rgb(120,124,132)'); gr.addColorStop(.4, 'rgb(236,238,242)'); gr.addColorStop(1, 'rgb(110,114,122)'); g.fillStyle = gr; g.beginPath(); g.ellipse(0, L + 12, 12, 12, 0, 0, PI); g.lineTo(-12, L + 12); g.fill(); g.fillRect(-12, L + 10, 24, 3); return S; }
function paintRangeFront() { const T = matSteel(800, 90, { seed: 101, bands: [[.15, .06, .5]] }), g = T.g;
  for (let k = 0; k < 4; k++) { const x = 60 + k * 190; g.fillStyle = 'rgb(40,40,44)'; g.fillRect(x, 36, 150, 48); g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(x + 6, 40, 138, 6); g.fillStyle = 'rgb(200,204,210)'; g.fillRect(x + 20, 30, 110, 4); }
  for (let k = 0; k < 8; k++) { const x = 50 + k * 96; g.fillStyle = 'rgb(30,30,34)'; g.beginPath(); g.arc(x, 16, 7, 0, TAU); g.fill(); g.fillStyle = 'rgb(210,214,220)'; g.fillRect(x - 1, 9, 2, 7); }
  return T; }
function paintHoodFront() { const T = matSteel(800, 120, { seed: 102, bands: [[.3, .08, .55], [.85, .05, .3]] }), g = T.g; for (let x = 20; x < 800; x += 40) { g.fillStyle = 'rgba(60,64,72,.6)'; g.fillRect(x, 90, 26, 4); } marcaLogo(g, 'brasa', 360, 30, 34, { mono: [80, 84, 92], monoBg: [190, 194, 200], sub: false }); return T; }
function paintRoner() { const S = spr([-60, -100, 60, 2], 3), g = S.g;
  g.fillStyle = 'rgba(160,200,220,.45)'; g.fillRect(-56, -70, 112, 70); g.strokeStyle = 'rgba(230,240,250,.8)'; g.lineWidth = 1.6; g.strokeRect(-56, -70, 112, 70); g.fillStyle = 'rgba(120,170,200,.45)'; g.fillRect(-55, -52, 110, 51);
  for (let k = 0; k < 3; k++) { g.fillStyle = 'rgba(200,120,110,.75)'; g.fillRect(-40 + k * 30, -40, 20, 26); g.fillStyle = 'rgba(255,255,255,.4)'; g.fillRect(-40 + k * 30, -40, 20, 3); }   // bolsas al vacío
  g.fillStyle = 'rgb(30,30,34)'; g.fillRect(28, -100, 22, 92); g.fillStyle = 'rgb(60,62,70)'; g.fillRect(30, -98, 18, 18);
  return S; }
function paintPassLamp() { const S = spr([-30, -120, 30, 4], 3), g = S.g; g.strokeStyle = 'rgb(40,40,44)'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, -120); g.lineTo(0, -30); g.stroke(); const gr = g.createLinearGradient(-26, 0, 26, 0); gr.addColorStop(0, 'rgb(60,60,66)'); gr.addColorStop(.5, 'rgb(170,174,180)'); gr.addColorStop(1, 'rgb(50,50,56)'); g.fillStyle = gr; g.beginPath(); g.moveTo(-8, -32); g.lineTo(8, -32); g.lineTo(26, 0); g.lineTo(-26, 0); g.fill(); g.fillStyle = 'rgb(255,120,60)'; g.fillRect(-20, -2, 40, 4); return S; }
function paintPassFront() { const T = matSteel(800, 95, { seed: 107, vert: true, c: [150, 154, 162] }), g = T.g, r = mulberry32(110);
  g.fillStyle = 'rgb(206,210,216)'; g.fillRect(0, 0, 800, 7); g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect(0, 1, 800, 1.2);
  g.fillStyle = 'rgb(34,36,42)'; g.fillRect(14, 14, 772, 58); g.fillStyle = 'rgb(120,124,132)'; g.fillRect(14, 44, 772, 3);
  for (let x = 24; x < 780;) { const kind = r(), w = kind < .5 ? 46 : kind < .8 ? 34 : 54;   // pilas de platos blancos, cuencos, platos negros
    for (const [y1, n] of [[43, 6 + (r() * 6 | 0)], [71, 5 + (r() * 7 | 0)]]) for (let k = 0; k < n; k++) { const y = y1 - k * 3; g.fillStyle = kind > .8 ? `rgb(${40 + k % 2 * 14},${40 + k % 2 * 14},${44 + k % 2 * 14})` : `rgb(${236 - k % 2 * 18},${238 - k % 2 * 18},${236 - k % 2 * 16})`; g.beginPath(); g.ellipse(x + w / 2, y, w / 2, 2.2, 0, 0, TAU); g.fill(); }
    x += w + 8 + r() * 14; }
  g.fillStyle = 'rgb(110,114,122)'; g.fillRect(0, 78, 800, 17); g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(0, 78, 800, 2);
  return T; }
function paintKitchenShelf(W_ = 600, seed = 111) { const S = spr([0, -70, W_, 4], 3), g = S.g, r = mulberry32(seed);
  g.fillStyle = 'rgb(170,174,182)'; g.fillRect(0, -2, W_, 5); g.fillStyle = 'rgba(255,255,255,.8)'; g.fillRect(0, -2, W_, 1);
  for (let x = 6; x < W_ - 60;) { const k = r(); if (k < .35) { const w = 30, h = 26 + r() * 20; g.fillStyle = 'rgba(220,232,236,.75)'; g.fillRect(x, -h, w, h); g.fillStyle = cssc([[200, 150, 60], [120, 70, 40], [220, 210, 180], [60, 110, 50]][r() * 4 | 0]); g.fillRect(x + 2, -h * .7, w - 4, h * .7 - 1); g.fillStyle = 'rgb(30,30,34)'; g.fillRect(x, -h - 4, w, 4); g.fillStyle = 'rgb(250,250,246)'; g.fillRect(x + 6, -h * .5, 18, 6); x += w + 4; }
    else if (k < .6) { for (let j = 0; j < 9; j++) { g.fillStyle = `rgb(${240 - j % 2 * 16},${240 - j % 2 * 16},${238 - j % 2 * 14})`; g.fillRect(x, -3 - j * 3, 44, 2.6); } x += 50; }
    else if (k < .8) { const h = 40 + r() * 16; const gr = g.createLinearGradient(x, 0, x + 26, 0); gr.addColorStop(0, 'rgba(120,80,40,.8)'); gr.addColorStop(.5, 'rgba(200,150,80,.85)'); gr.addColorStop(1, 'rgba(110,70,36,.8)'); g.fillStyle = gr; g.fillRect(x, -h, 26, h); g.fillStyle = 'rgb(40,40,44)'; g.fillRect(x + 8, -h - 8, 10, 8); x += 32; }
    else { g.fillStyle = 'rgb(206,210,216)'; g.fillRect(x, -22, 52, 22); g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(x, -22, 52, 3); g.fillStyle = 'rgb(250,248,240)'; g.fillRect(x + 8, -16, 22, 7); g.fillStyle = 'rgb(30,30,34)'; g.font = '5px monospace'; g.fillText(['FONDO', 'DEMI', 'SAL', 'ROUX'][r() * 4 | 0], x + 9, -10.5); x += 58; }
    x += r() * 10; }
  return S; }
function paintPrinter() { const S = spr([-24, -28, 24, 2], 4), g = S.g; g.fillStyle = 'rgb(40,42,48)'; g.fillRect(-22, -22, 44, 22); g.fillStyle = 'rgb(60,62,70)'; g.fillRect(-22, -26, 44, 6); g.fillStyle = 'rgb(20,20,24)'; g.fillRect(-14, -27, 28, 2); g.fillStyle = 'rgb(90,255,150)'; g.fillRect(14, -16, 3, 3); marcaLogo(g, 'tikket', -18, -12, 8, { sub: false, mono: [200, 204, 210], monoBg: [40, 42, 48] }); return S; }
function paintTicket(seed) { const S = spr([-9, 0, 9, 34], 4), g = S.g, r = mulberry32(seed); g.fillStyle = 'rgb(250,248,240)'; g.fillRect(-8, 0, 16, 34); g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(6, 0, 2, 34); g.fillStyle = 'rgb(40,40,44)'; g.fillRect(-6, 3, 9, 2); for (let k = 0; k < 8; k++) g.fillRect(-6, 8 + k * 3, 4 + r() * 8, 1); if (r() < .4) { g.fillStyle = 'rgb(200,40,40)'; g.fillRect(-6, 30, 12, 1.5); } return S; }
function paintPassItems() { const S = spr([0, -40, 800, 2], 3), g = S.g;
  for (const [x, c] of [[540, [70, 170, 70]], [556, [240, 196, 40]], [572, [140, 70, 40]], [588, [250, 248, 240]]]) { g.fillStyle = cssc(c); g.beginPath(); g.moveTo(x - 6, 0); g.lineTo(x + 6, 0); g.lineTo(x + 6, -26); g.lineTo(x + 2, -30); g.lineTo(x + 1, -38); g.lineTo(x - 1, -38); g.lineTo(x - 2, -30); g.lineTo(x - 6, -26); g.fill(); g.fillStyle = 'rgba(255,255,255,.45)'; g.fillRect(x - 4, -24, 2, 20); }
  g.fillStyle = 'rgba(240,244,246,.9)'; g.fillRect(596, -1, 120, 2); for (let k = 0; k < 4; k++) { const x = 600 + k * 28; g.fillStyle = 'rgba(220,236,240,.55)'; g.fillRect(x, -16, 24, 16); g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = .6; g.strokeRect(x, -16, 24, 16); for (let j = 0; j < 16; j++) { g.fillStyle = cssc([[80, 160, 70], [120, 190, 80], [200, 120, 220], [250, 220, 80], [250, 250, 250]][(k + j) % 5 === 0 ? 2 + k % 3 : j % 2]); g.beginPath(); g.arc(x + 3 + (j * 7.3) % 18, -3 - (j * 3.7) % 10, 1.6, 0, TAU); g.fill(); } }
  for (let k = 0; k < 2; k++) { for (let j = 0; j < 7; j++) { g.fillStyle = k ? `rgb(${30 + j % 2 * 12},${30 + j % 2 * 12},${34 + j % 2 * 12})` : `rgb(${244 - j % 2 * 14},${244 - j % 2 * 14},${240 - j % 2 * 12})`; g.beginPath(); g.ellipse(30 + k * 60, -2 - j * 2.6, 26, 3, 0, 0, TAU); g.fill(); } }
  g.fillStyle = 'rgb(200,170,90)'; g.beginPath(); g.arc(762, -8, 8, PI, TAU); g.fill(); g.fillStyle = 'rgb(60,60,64)'; g.fillRect(754, -8, 16, 8); g.fillStyle = 'rgb(240,230,200)'; g.fillRect(761, -18, 2, 4);   // campana del pase
  return S; }
function paintDining() {   /* el comedor a media luz, visto por la puerta: madera oscura, manteles, velas */
  const T = tex(110, 210, 3), g = T.g, r = mulberry32(112); const gr = g.createLinearGradient(0, 0, 0, 210); gr.addColorStop(0, 'rgb(40,28,24)'); gr.addColorStop(1, 'rgb(70,46,34)'); g.fillStyle = gr; g.fillRect(0, 0, 110, 210);
  for (let k = 0; k < 7; k++) { const x = r() * 110, y = 40 + r() * 80, rr = 6 + r() * 12, rg = g.createRadialGradient(x, y, 0, x, y, rr); rg.addColorStop(0, 'rgba(255,200,120,.8)'); rg.addColorStop(1, 'rgba(255,170,90,0)'); g.fillStyle = rg; g.fillRect(x - rr, y - rr, rr * 2, rr * 2); }
  g.fillStyle = 'rgb(236,228,214)'; g.fillRect(-4, 150, 70, 18); g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(-4, 168, 70, 42); g.fillStyle = 'rgb(236,228,214)'; g.fillRect(74, 140, 50, 14);
  return T; }
function paintSwingDoor() { const T = matSteel(110, 210, { seed: 103, vert: true, bands: [[.3, .1, .4]] }), g = T.g; g.fillStyle = 'rgb(40,40,44)'; g.beginPath(); g.arc(55, 70, 22, 0, TAU); g.fill(); g.fillStyle = 'rgba(200,180,140,.8)'; g.beginPath(); g.arc(55, 70, 18, 0, TAU); g.fill(); g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.arc(49, 64, 6, 0, TAU); g.fill(); g.fillStyle = 'rgb(150,154,160)'; g.fillRect(10, 150, 90, 40); return T; }
function paintWallClock() { const S = spr([-34, -34, 34, 34], 4), g = S.g; g.fillStyle = 'rgb(40,40,44)'; g.beginPath(); g.arc(0, 0, 33, 0, TAU); g.fill(); g.fillStyle = 'rgb(246,246,242)'; g.beginPath(); g.arc(0, 0, 29, 0, TAU); g.fill(); for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; g.fillStyle = 'rgb(30,30,34)'; g.save(); g.rotate(a); g.fillRect(-1, -27, 2, k % 3 ? 4 : 7); g.restore(); } marcaLogo(g, 'kronotek', -9, 8, 6, { sub: false }); return S; }
function cocinaPaint() {
  KIX.tile = matSubway(1500, 260, { seed: 91 }); KIX.plaster = matPlaster(1500, 70, { seed: 92, c: [236, 238, 236], cracks: 0 });
  KIX.floor = matQuarry(1500, 750, { seed: 97 }); KIX.ceil = matPlaster(1500, 750, { seed: 93, c: [226, 228, 230], cracks: 0 });
  KIX.wallL = matSubway(750, 330, { seed: 94 }); KIX.wallR = matSubway(750, 330, { seed: 95 });
  KIX.rangeF = paintRangeFront(); KIX.rangeTop = matSteel(800, 180, { seed: 104, c: [120, 124, 130], bands: [[.3, .1, .3]] });
  KIX.hoodF = paintHoodFront(); KIX.hoodB = matSteel(800, 260, { seed: 105, c: [150, 154, 160] });
  KIX.passTop = matSteel(800, 140, { seed: 106, bands: [[.25, .06, .55], [.7, .04, .35]] }); KIX.passF = paintPassFront(); KIX.shelf = paintKitchenShelf(160, 111); KIX.dining = paintDining(); KIX.printer = paintPrinter(); KIX.tickets = [0, 1, 2, 3, 4, 5].map(k => paintTicket(120 + k)); KIX.passItems = paintPassItems();
  KIX.side = matSteel(200, 200, { seed: 108, c: [160, 164, 170] }); KIX.counter = matSteel(200, 120, { seed: 109 });
  KIX.pans = [[0, 26, 1], [1, 20, 0], [2, 32, 1], [3, 16, 0], [4, 24, 1], [5, 18, 0], [6, 28, 1]].map(([s, r, l]) => paintCopperPan(300 + s, r, l));
  KIX.knives = paintKnifeBar(); KIX.ladles = [paintLadle(70), paintLadle(84), paintLadle(64)]; KIX.roner = paintRoner(); KIX.lamp = paintPassLamp(); KIX.door = paintSwingDoor(); KIX.clock = paintWallClock();
  for (const k of ['tile', 'floor', 'wallL', 'wallR', 'plaster', 'ceil']) texShade(KIX[k], COLD, .14);
}
/* ---------- vivos ---------- */
function burnerFlame(x, z, t, k = 1) {   /* corona de llamitas azules */
  const s = PS(z), c = PJ(x, KI.RANGE.top - 1, z);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 14; i++) { const a = i / 14 * TAU, px = x + Math.cos(a) * 14, pz = z + Math.sin(a) * 14, p = PJ(px, KI.RANGE.top - 1, pz), h = (6 + 3 * Math.sin(t * 17 + i * 2.3)) * k * s;
    const gr = ctx.createLinearGradient(0, p[1], 0, p[1] - h); gr.addColorStop(0, 'rgba(120,170,255,.95)'); gr.addColorStop(.6, 'rgba(60,110,255,.5)'); gr.addColorStop(1, 'rgba(255,200,120,0)'); ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(p[0] - 1.6 * s, p[1]); ctx.quadraticCurveTo(p[0], p[1] - h * 1.2, p[0] + 1.6 * s, p[1]); ctx.fill(); }
  ctx.restore(); LGT(c[0], c[1], 60 * s * k, '90,140,255', .5 * k);
}
function stockPot(x, z, r, h, t) {   /* olla grande de acero con el caldo borboteando lento */
  const s = PS(z), top = KI.RANGE.top - h;
  box3({ x0: x - r, x1: x + r, y0: top, y1: KI.RANGE.top, z0: z - r * .5, z1: z + r * .5 }, { front: KIX.side, left: [120, 124, 130], right: [130, 134, 140] });
  const c = PJ(x, top, z), rx = r * s, ry = rx * Math.max(.1, (top - CAM.y) / Math.max(60, z - CAM.z) * 1.2);
  if (CAM.y < top) { ctx.fillStyle = 'rgb(176,124,70)'; ctx.beginPath(); ctx.ellipse(c[0], c[1], rx * .92, ry * .92, 0, 0, TAU); ctx.fill(); for (let i = 0; i < 7; i++) { const ph = (t * .6 + i / 7 + hsh(i, x)) % 1, bx = c[0] + (hsh(i, 1) - .5) * rx * 1.4, by = c[1] + (hsh(i, 2) - .5) * ry; ctx.strokeStyle = `rgba(255,236,200,${.7 * Math.sin(ph * PI)})`; ctx.lineWidth = Math.max(.5, s * .8); ctx.beginPath(); ctx.ellipse(bx, by, ph * 5 * s, ph * 5 * s * ry / rx, 0, 0, TAU); ctx.stroke(); } }
  ctx.strokeStyle = 'rgb(210,214,220)'; ctx.lineWidth = Math.max(1, 2.5 * s); ctx.beginPath(); ctx.ellipse(c[0], c[1], rx, ry, 0, 0, TAU); ctx.stroke();
  steamCols(t, { x, y: top, z }, { n: 4, h: 200, w: 5, a: .28, sway: 16, spread: r, drift: -.15 });
}
function robata(t, flare = 0, fire = 1) {   /* parrilla robata: caja de ladrillo refractario, carbón binchotan al rojo, chispas que suben */
  const R = KI.ROB, top = KI.RANGE.top - 22;
  box3({ x0: R.x0, x1: R.x1, y0: top, y1: KI.RANGE.top, z0: R.z - 40, z1: R.z + 40 }, { front: [110, 70, 50], top: [60, 40, 34], left: [90, 60, 44] });
  for (let i = 0; i < 18; i++) { const x = R.x0 + 12 + (i % 9) * 22, z = R.z - 20 + Math.floor(i / 9) * 26, p = PJ(x, top - 2, z), s = PS(z), fl = .6 + .4 * Math.sin(t * (2 + hsh(i, 1) * 3) + i), gr = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 11 * s);
    gr.addColorStop(0, `rgba(255,${180 + 60 * fl | 0},${80 + 80 * fl | 0},1)`); gr.addColorStop(.5, `rgba(220,60,30,${.8 * fl})`); gr.addColorStop(1, 'rgba(60,20,20,.9)'); ctx.fillStyle = gr; ctx.fillRect(p[0] - 10 * s, p[1] - 4 * s, 20 * s, 8 * s); }
  if (fire < 1) { const P = poly3([[R.x0, top - 1, R.z - 40], [R.x1, top - 1, R.z - 40], [R.x1, top - 1, R.z + 40], [R.x0, top - 1, R.z + 40]]); if (P) { ctx.fillStyle = `rgba(40,30,30,${(1 - fire) * .85})`; ctx.fill(P); } }
  for (let k = 0; k < 9; k++) { const a = PJ(R.x0 + 4, top - 6, R.z - 30 + k * 7), b = PJ(R.x1 - 4, top - 6, R.z - 30 + k * 7); ctx.strokeStyle = 'rgb(60,60,64)'; ctx.lineWidth = Math.max(.6, PS(R.z) * 1.2); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
  for (let k = 0; k < 6; k++) { const x = R.x0 + 24 + k * 33, a = PJ(x, top - 9, R.z - 38), b = PJ(x, top - 9, R.z + 38), s = PS(R.z); ctx.strokeStyle = 'rgb(214,190,140)'; ctx.lineWidth = Math.max(1, s * 1.1); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();   // brochetas de bambú (yakitori)
    for (let j = 0; j < 4; j++) { const p = PJ(x, top - 10, R.z - 22 + j * 15); ctx.fillStyle = j % 2 ? 'rgb(150,80,40)' : 'rgb(176,104,54)'; ctx.beginPath(); ctx.ellipse(p[0], p[1], 5.5 * s, 3.4 * s, 0, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,220,170,.5)'; ctx.fillRect(p[0] - 3 * s, p[1] - 2.6 * s, 2.4 * s, 1 * s); } }
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 40 * fire; i++) { const ph = (t * (.35 + hsh(i, 3) * .4) + hsh(i, 4)) % 1, x = R.x0 + hsh(i, 5) * (R.x1 - R.x0) + Math.sin(ph * 9 + i) * 10, y = top - ph * (160 + 140 * flare) , z = R.z + (hsh(i, 6) - .5) * 60, p = PJ(x, y, z), s = PS(z); ctx.fillStyle = `rgba(255,${160 + 80 * hsh(i, 7) | 0},80,${(1 - ph) * .9})`; ctx.fillRect(p[0], p[1], Math.max(1.5, 2 * s), Math.max(1.5, 2 * s)); }
  ctx.restore();
  const c = PJ((R.x0 + R.x1) / 2, top - 4, R.z); LGT(c[0], c[1], 220 * PS(R.z), '255,90,40', (.55 + .1 * Math.sin(t * 3)) * fire); LGF(c[0], c[1], 60 * PS(R.z), '255,140,60', .35 * fire);
}
function zapperExit(t, zap, dark) {   /* matamoscas de luz UV en la pared izquierda y cartel de SALIDA sobre la puerta */
  const z0 = 500, z1 = 600, Z = poly3([[KI.X0 + 1, -270, z0], [KI.X0 + 1, -270, z1], [KI.X0 + 1, -236, z1], [KI.X0 + 1, -236, z0]]);
  if (Z) { ctx.fillStyle = 'rgb(46,48,56)'; ctx.fill(Z); const T = poly3([[KI.X0 + 2, -262, z0 + 6], [KI.X0 + 2, -262, z1 - 6], [KI.X0 + 2, -244, z1 - 6], [KI.X0 + 2, -244, z0 + 6]]); if (T) { ctx.fillStyle = `rgb(${150 + 100 * zap | 0},${170 + 80 * zap | 0},255)`; ctx.fill(T); } for (let k = 0; k < 8; k++) { const a = PJ(KI.X0 + 3, -263, z0 + 6 + k * 11), b = PJ(KI.X0 + 3, -243, z0 + 6 + k * 11); ctx.strokeStyle = 'rgba(30,30,36,.9)'; ctx.lineWidth = Math.max(1, PS(550) * .6); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
    const c = PJ(KI.X0 + 20, -252, 550); LGT(c[0], c[1], 260 * PS(550) * (1 + zap), '110,130,255', .2 + .45 * dark + .8 * zap); if (zap > .05) LGF(c[0], c[1], 40 * PS(550), '220,230,255', zap); }
  const Dr = KI.DOOR, cx = (Dr.x0 + Dr.x1) / 2, a = PJ(cx - 28, -240, KI.ZB - 1), b = PJ(cx + 28, -222, KI.ZB - 1);
  ctx.fillStyle = 'rgb(30,170,90)'; ctx.fillRect(a[0], a[1], b[0] - a[0], b[1] - a[1]); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const P = toPx(a), q = Math.max(1, Math.round((b[1] - a[1]) * U / 12)); pxText(ctx, 'SALIDA', P[0] + q * 3, P[1] + q * 2.5, q, '#f2fff6'); ctx.restore(); T0();
  const c2 = PJ(cx, -231, KI.ZB - 4); LGT(c2[0], c2[1], 130 * PS(KI.ZB), '40,255,120', .12 + .4 * dark);
}
function ronerDisplay(x, z, t) { const p = PJ(x + 30, -95 - 92, z), s = PS(z); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const P = toPx(p), h = 5.4 * s * U; ctx.fillStyle = 'rgb(10,14,12)'; ctx.fillRect(P[0] - 2 * s * U, P[1] - 2 * s * U, 21 * s * U, 9.5 * s * U); seg7(ctx, '62.5', P[0], P[1], h, 'rgb(90,255,150)', 'rgba(20,60,30,.4)'); ctx.restore(); T0(); LGT(p[0] + 8 * s, p[1] + 4 * s, 30 * s, '90,255,150', .3); }
/* ---------- la cocina en t ---------- */
function drawCocina(t, o = {}) {
  lightsBegin(); T0();
  const ZB = KI.ZB, HD = KI.HOOD, Rg = KI.RANGE, Pa = KI.PASS, flare = o.flare ? o.flare(t) : 0, PW = o.power ? o.power(t) : null, pw = k => PW ? PW[k] ?? 1 : 1, hum = Math.sin(t * 60) * .25 * pw('hood');
  /* techo con tiras LED, suelo, paredes */
  hplane(KIX.ceil, KI.X0, KI.X1, 20, ZB, KI.Y0);
  hplane(KIX.floor, KI.X0, KI.X1, 20, ZB, 0);
  vplane(KIX.plaster, [KI.X0, ZB], [KI.X1, ZB], KI.Y0, -260); vplane(KIX.tile, [KI.X0, ZB], [KI.X1, ZB], -260, 0);
  vplane(KIX.wallL, [KI.X0, 20], [KI.X0, ZB], KI.Y0, 0, { u0: 0, u1: 1 }); vplane(KIX.wallR, [KI.X1, ZB], [KI.X1, 20], KI.Y0, 0);
  for (const z of [380, 620]) { const P = poly3([[KI.X0 + 60, KI.Y0 + .5, z - 6], [KI.X1 - 60, KI.Y0 + .5, z - 6], [KI.X1 - 60, KI.Y0 + .5, z + 6], [KI.X0 + 60, KI.Y0 + .5, z + 6]]); if (P) { const k = pw(z === 380 ? 's1' : 's2'); ctx.fillStyle = `rgb(${lerp(120, 250, k) | 0},${lerp(126, 252, k) | 0},${lerp(136, 255, k) | 0})`; ctx.fill(P); } }
  if (o.floor) o.floor(t);
  /* puerta batiente con ojo de buey */
  const da = o.door ? o.door(t) : 0, Dr = KI.DOOR;
  vplane(KIX.dining, [Dr.x0, ZB - .3], [Dr.x1, ZB - .3], -210, 0);
  { const fr = poly3([[Dr.x0 - 6, -216, ZB - .4], [Dr.x1 + 6, -216, ZB - .4], [Dr.x1 + 6, 0, ZB - .4], [Dr.x1, 0, ZB - .4], [Dr.x1, -210, ZB - .4], [Dr.x0, -210, ZB - .4], [Dr.x0, 0, ZB - .4], [Dr.x0 - 6, 0, ZB - .4]]); if (fr) { ctx.fillStyle = 'rgb(150,154,162)'; ctx.fill(fr); } }
  /* oclusión: zócalo oscuro donde el suelo toca las paredes, sombra de la campana sobre el azulejo */
  ctx.save(); ctx.globalCompositeOperation = 'multiply';
  { const a = PJ(KI.X0, -26, ZB - .5), b = PJ(KI.X1, 0, ZB - .5), gr = ctx.createLinearGradient(0, a[1], 0, b[1]); gr.addColorStop(0, 'rgba(120,124,136,0)'); gr.addColorStop(1, 'rgba(90,94,106,.9)'); ctx.fillStyle = gr; ctx.fillRect(a[0], a[1], b[0] - a[0], b[1] - a[1]); }
  { const a = PJ(HD.x0 - 40, HD.y1, ZB - .5), b = PJ(HD.x1 + 40, HD.y1 + 70, ZB - .5), gr = ctx.createLinearGradient(0, a[1], 0, b[1]); gr.addColorStop(0, 'rgba(110,116,130,.85)'); gr.addColorStop(1, 'rgba(110,116,130,0)'); ctx.fillStyle = gr; ctx.fillRect(a[0], a[1], b[0] - a[0], b[1] - a[1]); }
  ctx.restore();
  /* reflejos fríos de las tiras en los azulejos */
  ctx.save(); ctx.globalCompositeOperation = 'screen'; for (const x of [-500, -100, 300, 650]) { const a = PJ(x, -250, ZB - 1), b = PJ(x + 60, -10, ZB - 1); ctx.fillStyle = 'rgba(220,236,255,.12)'; ctx.fillRect(a[0], a[1], b[0] - a[0], b[1] - a[1]); } ctx.restore();
  /* cobre colgado, cuchillos, reloj */
  const rail = (x0, x1) => { const a = PJ(x0, -262, ZB - 6), b = PJ(x1, -262, ZB - 6); ctx.strokeStyle = 'rgb(60,62,68)'; ctx.lineWidth = Math.max(1, 3 * PS(ZB)); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); };
  rail(-680, -440); rail(690, 790);
  [[-660, 0], [-610, 1], [-555, 2], [-500, 3], [-458, 4], [712, 5], [764, 6]].forEach(([x, k]) => bill(KIX.pans[k], x, -262, ZB - 8, { rot: Math.sin(t * .4 + k) * .01 + (flare > .3 ? Math.sin(t * 20 + k) * .01 * flare : 0), px: 0, py: 0 }));
  bill(KIX.knives, -6, -204, ZB - 4); bill(KIX.shelf, 392, -228, ZB - 6);
  bill(KIX.clock, KI.CLK[0], KI.CLK[1], ZB - 3); { const c = PJ(KI.CLK[0], KI.CLK[1], ZB - 4), s = PS(ZB), hm = o.clock ? o.clock(t) : [8.5, 30]; ctx.strokeStyle = 'rgb(30,30,34)'; ctx.lineCap = 'round'; for (const [a, L, w] of [[hm[0] / 12 * TAU, 15, 2.6], [hm[1] / 60 * TAU, 24, 1.6]]) { ctx.lineWidth = Math.max(1, w * s); ctx.beginPath(); ctx.moveTo(c[0], c[1]); ctx.lineTo(c[0] + Math.sin(a) * L * s, c[1] - Math.cos(a) * L * s); ctx.stroke(); } }
  /* cucharones colgados y sus sombras (la llamarada las proyecta enormes sobre el azulejo) */
  if (flare > .02) { const L = [o.flareX ?? -250, -118, 748]; ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = `rgba(80,40,30,${.55 * flare})`;
    for (const [lx, lz] of LADLES) { const pts = [[lx - 3, -205, lz], [lx + 3, -205, lz], [lx + 12, -110, lz], [lx - 12, -110, lz]].map(p => { const k = (ZB - .5 - L[2]) / (p[2] - L[2]); return [L[0] + (p[0] - L[0]) * k, L[1] + (p[1] - L[1]) * k, ZB - .5]; }); const P = poly3(pts); if (P) ctx.fill(P); } ctx.restore(); }
  LADLES.forEach(([x, z], i) => bill(KIX.ladles[i % 3], x, -205, z, { rot: Math.sin(t * .8 + i) * .02 + hum * .004, px: 0, py: 0 }));
  /* gotitas de condensación en los azulejos que brillan con la llamarada */
  if (flare > .05) { ctx.fillStyle = `rgba(255,240,200,${.9 * flare})`; for (let i = 0; i < 70; i++) { const p = PJ(-420 + hsh(i, 1) * 800, -250 + hsh(i, 2) * 160, ZB - 1); if (Math.sin(t * 6 + i) > -.2) ctx.fillRect(p[0], p[1], 1.6, 1.6); } }
  /* roners a la izquierda */
  box3({ x0: -680, x1: -440, y0: -92, y1: 0, z0: 760, z1: 890 }, { front: KIX.counter, right: KIX.side, top: KIX.counter });
  bill(KIX.roner, -610, -92, 830); bill(KIX.roner, -500, -92, 830); ronerDisplay(-610, 830, t); ronerDisplay(-500, 830, t);
  put(ZB - 2, () => { const Dr = KI.DOOR, de = [Dr.x0 + Math.cos(da) * 110, ZB - 1 - Math.sin(da) * 110]; vplane(KIX.door, [Dr.x0, ZB - 1], de, -210, 0, { n: da > .02 ? 12 : 1 }); });
  /* el fogón: frente, sobre, quemadores, ollas, robata; la campana encima (vibra un poco) */
  put(Rg.z0 + 1, () => {
    box3({ x0: Rg.x0, x1: Rg.x1, y0: Rg.top, y1: 0, z0: Rg.z0, z1: Rg.z1 }, { front: KIX.rangeF, top: KIX.rangeTop, left: KIX.side });
    for (const [x, z] of BURN) { const P = poly3(ellP(x, z, 20, 20, 16).map(([a, b]) => [a, Rg.top - .5, b])); if (P) { ctx.fillStyle = 'rgb(30,30,34)'; ctx.fill(P); } }
    for (const [x, z] of BURN.slice(0, 2)) burnerFlame(x, z, t, (o.burner ? o.burner(t) : .7) * pw('fire'));
    for (const [x, z] of BURN.slice(2)) burnerFlame(x, z, t, .5 * pw('fire'));
    for (const [x, z, r, h] of POTS) stockPot(x, z, r, h, t);
    robata(t, flare, pw('fire'));
    if (o.onRange) o.onRange(t);
  });
  put(HD.z0 - 1, () => { ctx.save(); ctx.translate(hum * .4, 0); box3({ x0: HD.x0, x1: HD.x1, y0: HD.y0, y1: HD.y1, z0: HD.z0, z1: ZB }, { front: KIX.hoodF, bottom: KIX.hoodB, left: KIX.side }); const a = PJ(HD.x0 + 10, HD.y1 + 1, HD.z0 + 8), b = PJ(HD.x1 - 10, HD.y1 + 1, HD.z0 + 8); ctx.fillStyle = pw('hood') > .5 ? 'rgba(250,252,255,.95)' : 'rgba(90,96,108,.9)'; ctx.fillRect(a[0], a[1] - 1.5, b[0] - a[0], 3); ctx.restore(); const c = PJ(-20, HD.y1 + 10, 780); LGT(c[0], c[1], 420 * PS(780), '230,240,255', .12 * pw('hood')); });
  /* el pase: mesa de acero con reflejo de las tiras, lámparas infrarrojas */
  put(Pa.z0, () => {
    box3({ x0: Pa.x0, x1: Pa.x1, y0: Pa.top, y1: 0, z0: Pa.z0, z1: Pa.z1 }, { front: KIX.passF, top: KIX.passTop, left: KIX.side, right: KIX.side });
    const band = PJ(CAM.x * .3, Pa.top - .5, 490); ctx.save(); ctx.globalCompositeOperation = 'screen'; const q = poly3([[Pa.x0, Pa.top - .5, 470], [Pa.x1, Pa.top - .5, 470], [Pa.x1, Pa.top - .5, 500], [Pa.x0, Pa.top - .5, 500]]); if (q) { ctx.fillStyle = 'rgba(230,240,255,.35)'; ctx.fill(q); } ctx.restore();
    { const sh = poly3([[Pa.x0, -.5, Pa.z0 - 2], [Pa.x1, -.5, Pa.z0 - 2], [Pa.x1 + 20, -.5, Pa.z0 - 40], [Pa.x0 - 20, -.5, Pa.z0 - 40]]); if (sh) { ctx.fillStyle = 'rgba(30,26,30,.35)'; ctx.fill(sh); } }
    bill(KIX.passItems, Pa.x0, Pa.top, 540); bill(KIX.printer, KI.PRN, Pa.top, 520);
    const pl = o.printer ? o.printer(t) : 0; if (pl > 0) { const a = PJ(KI.PRN, Pa.top - 26, 520), s = PS(520); ctx.fillStyle = 'rgb(250,248,240)'; ctx.fillRect(a[0] - 10 * s, a[1] - pl * s, 20 * s, pl * s); ctx.fillStyle = 'rgba(40,40,44,.6)'; for (let k = 4; k < pl; k += 4) ctx.fillRect(a[0] - 7 * s, a[1] - k * s, (5 + hsh(k, 3) * 9) * s, .9 * s); }
    if (o.onPass) o.onPass(t);
  });
  put(Pa.z0 - 2, () => {
    { const a = PJ(Pa.x0 + 20, -178, 500), b = PJ(Pa.x1 - 20, -178, 500), s = PS(500); ctx.fillStyle = 'rgb(176,180,188)'; ctx.fillRect(a[0], a[1] - 2 * s, b[0] - a[0], 4 * s); const nT = o.tickets ? o.tickets(t) : 5; for (let k = 0; k < nT; k++) bill(KIX.tickets[k % 6], -40 + (k * 44) % 300, -178, 500, { rot: Math.sin(t * 1.3 + k) * .03, px: 0, py: 0 }); }
    [-100, 140, 380].forEach((x, i) => { const k = pw('p' + i); bill(KIX.lamp, x, -200, 490); if (k < 1) { const a = PJ(x - 20, -202, 490), b = PJ(x + 20, -198, 490); ctx.fillStyle = `rgba(60,40,36,${1 - k})`; ctx.fillRect(a[0], a[1], b[0] - a[0], b[1] - a[1]); } const c = PJ(x, -200, 490); LGT(c[0], c[1] + 20 * PS(490), 80 * PS(490), '255,90,50', .32 * k); const g0 = PJ(x, Pa.top, 490); LGT(g0[0], g0[1], 70 * PS(490), '255,110,60', .26 * k); }); });
  if (o.items) o.items(put, t);
  flush();
  /* vapor acumulado y noche: la cocina se apaga; quedan el matamoscas azul, el cartel de salida y los roners */
  const fog = o.fog ? o.fog(t) : 0; if (fog > .01) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const gr = ctx.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, `rgba(236,240,244,${.7 * fog})`); gr.addColorStop(.6, `rgba(230,236,240,${.4 * fog})`); gr.addColorStop(1, `rgba(220,226,232,${.15 * fog})`); ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H); ctx.restore(); T0(); }
  const dark = o.dark ? o.dark(t) : 0; if (dark > .01) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = `rgba(10,14,30,${.84 * dark})`; ctx.fillRect(0, 0, W, H); ctx.restore(); T0(); }
  zapperExit(t, o.zap ? o.zap(t) : 0, dark);
  /* la llamarada ilumina todo de golpe */
  if (flare > .01) { const c = PJ(o.flareX ?? -250, -200, 740); LGT(c[0], c[1], 900 * PS(740) * (.6 + .4 * flare), '255,150,60', .9 * flare); LGF(c[0], c[1], 260 * PS(740) * flare, '255,200,120', .6 * flare); }
  if (o.fx) o.fx(t);
  lightsComp(0);
  if (flare > .01) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = .5 * flare; ctx.fillStyle = 'rgb(255,140,60)'; ctx.fillRect(0, 0, W, H); ctx.restore(); T0(); }
}
