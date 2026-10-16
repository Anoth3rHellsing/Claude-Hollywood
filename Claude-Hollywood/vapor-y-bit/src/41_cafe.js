/* =====================================================================
   ESCENA 2b · MOLIENDA RESERVA (por dentro): ámbar, cálido y saturado frente al cian de la calle
   Planta (cm): pared del fondo z = 1000 · pared izquierda x = -650 con ventanales y la puerta de vidrio (z 620…720)
     mostrador x -320…470 (frente z = 640, alto 105, sobre de mármol) · vitrina x -300…-40 · Vaporetta x 60…290
     molinillo x 300…350 · Valeria trabaja de pie sobre el mostrador · mesas: junto a la puerta (servilletas),
     delante a la derecha (fuera de foco), al fondo a la derecha · bombillas Edison en dos filas · ductos de cobre
   ===================================================================== */
const MO = { ZB: 1000, X0: -650, X1: 750, Y0: -340, ZF: 150, CT: { x0: -320, x1: 470, z0: 640, z1: 760, top: -105 }, DOOR: { z0: 620, z1: 720, h: 220 } };
const MOX = {};
const AMBER = [255, 188, 110];
/* ---------- texturas y sprites ---------- */
function paintWainscot() { const T = matWood(1400, 110, { seed: 201, c: [92, 58, 38], plank: 110, gap: 1.6 }), g = T.g; for (let x = 0; x < 1400; x += 70) { g.fillStyle = 'rgba(30,16,10,.4)'; g.fillRect(x, 0, 2, 110); g.fillStyle = 'rgba(255,220,180,.12)'; g.fillRect(x + 6, 10, 58, 3); } g.fillStyle = 'rgb(176,140,70)'; g.fillRect(0, 0, 1400, 4); return T; }
function paintChalk(lines, title, seed) {
  const T = tex(240, 150, 4), g = T.g, r = mulberry32(seed);
  g.fillStyle = 'rgb(40,44,42)'; g.fillRect(0, 0, 240, 150);
  for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(230,230,220,${r() * .06})`; g.beginPath(); g.ellipse(r() * 240, r() * 150, 10 + r() * 40, 4 + r() * 10, r() * 3, 0, TAU); g.fill(); }   // borrones
  const pastel = [[250, 210, 220], [200, 236, 214], [250, 236, 180], [200, 220, 250], [255, 255, 250]];
  g.textBaseline = 'alphabetic';
  g.font = `700 20px "Caveat", ${MFONT.script}`; g.fillStyle = cssc(pastel[4]); g.fillText(title, 14, 26);
  g.strokeStyle = cssc(pastel[2], .8); g.lineWidth = 1.2; g.beginPath(); g.moveTo(14, 31); g.quadraticCurveTo(70, 34, 130, 30); g.stroke();
  lines.forEach((L, i) => { g.font = `600 13px "Caveat", ${MFONT.script}`; g.fillStyle = cssc(pastel[i % 4]); g.fillText(L, 16, 52 + i * 22); });
  /* garabatos: taza con vapor y estrellita */
  g.strokeStyle = cssc(pastel[4], .8); g.lineWidth = 1.4; g.strokeRect(196, 110, 22, 18); g.beginPath(); g.arc(220, 119, 5, -PI / 2, PI / 2); g.stroke(); for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(201 + k * 6, 106); g.quadraticCurveTo(197 + k * 6, 98, 203 + k * 6, 92); g.stroke(); }
  g.fillStyle = cssc(pastel[2]); mStar(g, 210, 22, 7, 3, 5); g.fill();
  /* textura de tiza: el grano se come el trazo */
  g.globalCompositeOperation = 'destination-out'; for (let i = 0; i < 2600; i++) { g.fillStyle = `rgba(0,0,0,${r() * .5})`; g.fillRect(r() * 240, r() * 150, .6, .6); } g.globalCompositeOperation = 'destination-over'; g.fillStyle = 'rgb(40,44,42)'; g.fillRect(0, 0, 240, 150); g.globalCompositeOperation = 'source-over';
  g.strokeStyle = 'rgb(120,84,52)'; g.lineWidth = 6; g.strokeRect(0, 0, 240, 150);
  return T;
}
function paintShelfItems() {   /* estantes de la pared del fondo: bolsas kraft, prensas francesas, jarabes (un sprite de 420 × 260) */
  const S = spr([0, -260, 420, 4], 2.4), g = S.g, r = mulberry32(211);
  for (const y of [-180, -90, 0]) { woodGrain(g, 0, y - 4, 420, 6, [110, 72, 46], r, { knots: false, gap: 1.4 }); g.fillStyle = 'rgba(20,10,6,.35)'; g.fillRect(0, y + 2, 420, 3); for (const x of [20, 400]) { g.fillStyle = 'rgb(30,26,26)'; g.fillRect(x - 2, y + 2, 4, 10); } }
  /* balda alta: bolsas kraft con sello */
  for (let k = 0; k < 8; k++) { const x = 14 + k * 50 + r() * 6, h = 54 + r() * 10, c = shc([186, 142, 96], (r() - .5) * .1); g.fillStyle = cssc(c); g.beginPath(); g.moveTo(x, -184); g.lineTo(x + 36, -184); g.lineTo(x + 34, -184 - h); g.lineTo(x + 28, -184 - h - 6); g.lineTo(x + 8, -184 - h - 6); g.lineTo(x + 2, -184 - h); g.closePath(); g.fill(); g.fillStyle = 'rgba(90,60,30,.3)'; g.fillRect(x + 24, -184 - h, 10, h); g.fillStyle = 'rgb(240,232,214)'; g.fillRect(x + 6, -184 - h * .62, 24, 20); marcaLogo(g, 'molienda', x + 12, -184 - h * .6, 11, { layout: 'emblema', mono: [110, 36, 48], monoBg: [240, 232, 214] }); }
  /* balda media: prensas francesas de vidrio con café */
  for (let k = 0; k < 5; k++) { const x = 20 + k * 80, h = 58; g.fillStyle = 'rgba(70,40,20,.85)'; g.fillRect(x + 4, -94 - h * .55, 30, h * .55); g.fillStyle = 'rgba(220,236,240,.28)'; g.fillRect(x, -94 - h, 38, h); g.strokeStyle = 'rgba(240,250,255,.7)'; g.lineWidth = 1.4; g.strokeRect(x, -94 - h, 38, h); g.fillStyle = 'rgb(40,40,44)'; g.fillRect(x - 2, -94 - h - 6, 42, 6); g.fillRect(x + 18, -94 - h - 22, 3, 18); g.beginPath(); g.arc(x + 19.5, -94 - h - 24, 5, 0, TAU); g.fill(); g.fillStyle = 'rgba(255,255,255,.6)'; g.fillRect(x + 4, -94 - h + 4, 3, h - 8); }
  /* balda baja: jarabes (líquidos ámbar, rubí, verde) */
  const syr = [[224, 140, 40], [180, 40, 50], [236, 180, 60], [120, 160, 50], [200, 100, 30], [240, 200, 120], [150, 60, 30]];
  for (let k = 0; k < 9; k++) { const x = 14 + k * 45, c = syr[k % syr.length]; g.fillStyle = cssc(c, .9); g.beginPath(); g.moveTo(x, -4); g.lineTo(x + 30, -4); g.lineTo(x + 30, -56); g.quadraticCurveTo(x + 30, -66, x + 20, -68); g.lineTo(x + 20, -82); g.lineTo(x + 10, -82); g.lineTo(x + 10, -68); g.quadraticCurveTo(x, -66, x, -56); g.closePath(); g.fill();
    g.fillStyle = 'rgb(30,26,26)'; g.fillRect(x + 8, -90, 14, 9); g.fillStyle = 'rgb(240,232,214)'; g.fillRect(x + 4, -40, 22, 18); g.fillStyle = cssc(c); g.fillRect(x + 8, -34, 14, 2); g.fillStyle = 'rgba(255,255,240,.55)'; g.fillRect(x + 4, -60, 3, 52); g.fillStyle = 'rgba(255,240,200,.35)'; g.beginPath(); g.ellipse(x + 15, -12, 10, 4, 0, 0, TAU); g.fill(); }
  return S;
}
function paintPastries() {   /* el interior de la vitrina: croissants con almíbar, muffins, sándwiches en papel encerado (300 × 70) */
  const S = spr([0, -72, 280, 2], 3.2), g = S.g, r = mulberry32(221);
  for (const [y, n] of [[-40, 6], [0, 7]]) { g.fillStyle = 'rgba(236,236,240,.55)'; g.fillRect(0, y - 2, 280, 3);
    for (let k = 0; k < n; k++) { const x = 14 + k * (260 / n) + r() * 6, kind = (k + (y ? 1 : 0)) % 3;
      if (kind === 0) { /* croissant: medialuna dorada con brillo de almíbar */ g.save(); g.translate(x + 14, y - 8); for (let s = -3; s <= 3; s++) { g.fillStyle = cssc(shc([214, 150, 70], -Math.abs(s) * .05)); g.beginPath(); g.ellipse(s * 5, Math.abs(s) * 1.8, 6.5 - Math.abs(s) * .9, 7 - Math.abs(s), s * .25, 0, TAU); g.fill(); g.strokeStyle = 'rgba(120,60,20,.5)'; g.lineWidth = .6; g.stroke(); } g.fillStyle = 'rgba(255,250,220,.75)'; g.beginPath(); g.ellipse(-3, -4, 6, 1.6, -.3, 0, TAU); g.fill(); g.beginPath(); g.ellipse(6, -3, 3, 1, .3, 0, TAU); g.fill(); g.restore(); }
      else if (kind === 1) { /* muffin con pepitas */ g.fillStyle = 'rgb(226,220,206)'; g.beginPath(); g.moveTo(x + 4, y); g.lineTo(x + 24, y); g.lineTo(x + 26, y - 12); g.lineTo(x + 2, y - 12); g.fill(); g.fillStyle = 'rgb(140,84,44)'; g.beginPath(); g.ellipse(x + 14, y - 15, 14, 9, 0, 0, TAU); g.fill(); g.fillStyle = 'rgb(60,34,20)'; for (let q = 0; q < 6; q++) { g.beginPath(); g.arc(x + 6 + r() * 16, y - 19 + r() * 8, 1.4, 0, TAU); g.fill(); } g.fillStyle = 'rgba(255,240,220,.4)'; g.beginPath(); g.ellipse(x + 9, y - 20, 5, 2, -.3, 0, TAU); g.fill(); }
      else { /* sándwich envuelto en papel encerado con cordel */ g.fillStyle = 'rgb(236,226,196)'; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 30, y); g.lineTo(x + 28, y - 14); g.lineTo(x + 2, y - 16); g.fill(); g.fillStyle = 'rgba(200,180,140,.5)'; g.beginPath(); g.moveTo(x + 2, y - 16); g.lineTo(x + 15, y - 8); g.lineTo(x + 28, y - 14); g.fill(); g.strokeStyle = 'rgb(150,90,60)'; g.lineWidth = .8; g.beginPath(); g.moveTo(x + 14, y); g.lineTo(x + 14, y - 15); g.stroke(); g.fillStyle = 'rgba(80,140,60,.8)'; g.fillRect(x + 2, y - 4, 26, 2); } } }
  return S;
}
function paintMachine() {   /* la Vaporetta: cuerpo cromado, grupos, portafiltros, lancetas, bandeja (230 × 80 + tazas) */
  const S = spr([-12, -112, 242, 2], 3), g = S.g;
  const chrome = (x, y, w, h) => { const gr = g.createLinearGradient(x, 0, x + w, 0); gr.addColorStop(0, 'rgb(110,112,118)'); gr.addColorStop(.18, 'rgb(236,238,242)'); gr.addColorStop(.35, 'rgb(150,152,160)'); gr.addColorStop(.6, 'rgb(220,222,228)'); gr.addColorStop(.85, 'rgb(96,98,106)'); gr.addColorStop(1, 'rgb(190,192,200)'); g.fillStyle = gr; g.fillRect(x, y, w, h); };
  chrome(0, -78, 230, 60);
  g.fillStyle = 'rgb(179,36,31)'; g.fillRect(0, -82, 230, 6); g.fillRect(0, -20, 230, 5);
  /* tazas calentándose arriba */
  for (let k = 0; k < 7; k++) { const x = 14 + k * 30; g.fillStyle = 'rgb(240,236,228)'; g.beginPath(); g.moveTo(x, -82); g.lineTo(x + 20, -82); g.lineTo(x + 17, -100); g.lineTo(x + 3, -100); g.fill(); g.strokeStyle = 'rgba(100,90,90,.5)'; g.lineWidth = .8; g.stroke(); }
  marcaLogo(g, 'vaporetta', 82, -60, 16, { mono: [179, 36, 31], monoBg: [220, 222, 228], sub: false });
  /* manómetros */
  for (const x of [30, 200]) { g.fillStyle = 'rgb(250,248,240)'; g.beginPath(); g.arc(x, -48, 9, 0, TAU); g.fill(); g.strokeStyle = 'rgb(60,60,66)'; g.lineWidth = 2; g.stroke(); g.lineWidth = 1; g.beginPath(); g.moveTo(x, -48); g.lineTo(x + 5, -53); g.stroke(); }
  /* grupos y portafiltros con mango de madera */
  for (const x of [70, 160]) { chrome(x - 14, -18, 28, 10); g.fillStyle = 'rgb(60,60,66)'; g.fillRect(x - 16, -9, 32, 6); g.fillStyle = 'rgb(110,70,46)'; g.beginPath(); g.moveTo(x + 14, -7); g.lineTo(x + 46, -2); g.lineTo(x + 46, 3); g.lineTo(x + 14, -2); g.fill(); g.fillStyle = 'rgb(240,236,228)'; g.fillRect(x - 9, 2, 18, 13); }
  /* lancetas de vapor a los lados */
  g.strokeStyle = 'rgb(200,204,210)'; g.lineWidth = 3.5; g.lineCap = 'round'; g.beginPath(); g.moveTo(8, -30); g.quadraticCurveTo(-6, -10, -4, 8); g.moveTo(222, -30); g.quadraticCurveTo(236, -10, 234, 8); g.stroke();
  /* bandeja de goteo */
  g.fillStyle = 'rgb(70,72,78)'; g.fillRect(10, 14, 210, -6); for (let x = 14; x < 218; x += 6) { g.fillStyle = 'rgb(140,144,150)'; g.fillRect(x, 9, 3, 4); }
  S.panel = [6, -76, 218, 52];   // la zona cromada que refleja el local
  return S;
}
function paintReflPlate() {   /* lo que ve la cafetera delante de ella: ventanales cian, bombillas, siluetas, mesas (se deforma en vivo) */
  const c = mk(600, 160), g = c.getContext('2d'), r = mulberry32(231);
  const gr = g.createLinearGradient(0, 0, 0, 160); gr.addColorStop(0, 'rgb(80,50,36)'); gr.addColorStop(.6, 'rgb(150,96,60)'); gr.addColorStop(1, 'rgb(70,46,34)'); g.fillStyle = gr; g.fillRect(0, 0, 600, 160);
  for (let k = 0; k < 3; k++) { g.fillStyle = 'rgba(150,200,220,.8)'; g.fillRect(40 + k * 110, 30, 90, 80); g.fillStyle = 'rgba(60,70,80,.6)'; g.fillRect(40 + k * 110, 70, 90, 6); }
  for (let k = 0; k < 14; k++) { const x = r() * 600, y = 10 + r() * 50, rg = g.createRadialGradient(x, y, 0, x, y, 16); rg.addColorStop(0, 'rgba(255,240,200,1)'); rg.addColorStop(.3, 'rgba(255,190,110,.6)'); rg.addColorStop(1, 'rgba(255,190,110,0)'); g.fillStyle = rg; g.fillRect(x - 16, y - 16, 32, 32); }
  for (let k = 0; k < 6; k++) { const x = 60 + k * 95 + r() * 20; g.fillStyle = 'rgba(40,24,18,.85)'; g.beginPath(); g.ellipse(x, 96, 12, 14, 0, 0, TAU); g.fill(); g.fillRect(x - 20, 108, 40, 50); }
  g.fillStyle = 'rgba(30,20,16,.7)'; g.fillRect(0, 140, 600, 20);
  g.globalCompositeOperation = 'saturation'; g.fillStyle = 'rgb(128,128,128)'; g.globalAlpha = .55; g.fillRect(0, 0, 600, 160); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  return c;
}
function paintGrinder() { const S = spr([-26, -86, 26, 2], 3), g = S.g; g.fillStyle = 'rgb(40,40,44)'; g.fillRect(-18, -36, 36, 36); g.fillStyle = 'rgb(200,204,210)'; g.fillRect(-12, -46, 24, 10); g.fillStyle = 'rgba(120,70,40,.85)'; g.beginPath(); g.moveTo(-16, -46); g.lineTo(16, -46); g.lineTo(20, -84); g.lineTo(-20, -84); g.fill(); g.fillStyle = 'rgba(230,240,250,.3)'; g.beginPath(); g.moveTo(-16, -46); g.lineTo(16, -46); g.lineTo(20, -84); g.lineTo(-20, -84); g.fill(); g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(-14, -82, 4, 34); return S; }
function paintPerson(seed, o = {}) {   /* silueta de cliente (desenfocada después): cabeza, hombros, brazos hacia el portátil */
  const S = spr([-50, -150, 50, 2], 2), g = S.g, r = mulberry32(seed), c = o.c || pick3(r, [[70, 44, 34], [90, 60, 48], [56, 40, 40], [110, 70, 50]]);
  g.fillStyle = cssc(c); g.beginPath(); g.ellipse(0, -128, 13, 16, 0, 0, TAU); g.fill();
  g.beginPath(); g.moveTo(-34, 0); g.lineTo(-30, -84); g.quadraticCurveTo(0, -112, 30, -84); g.lineTo(34, 0); g.fill();
  if (r() < .5) { g.fillStyle = cssc(shc(c, -.3)); g.beginPath(); g.ellipse(0, -138, 15, 10, 0, PI, TAU); g.fill(); }   // pelo o gorro
  g.strokeStyle = cssc(c); g.lineWidth = 10; g.lineCap = 'round'; g.beginPath(); g.moveTo(-24, -76); g.lineTo(-20, -40); g.lineTo(0, -34); g.moveTo(24, -76); g.lineTo(20, -40); g.lineTo(4, -34); g.stroke();
  return sprBlur(S, o.blur ?? 4);
}
function paintLaptop() { const S = spr([-24, -30, 24, 2], 4), g = S.g; g.fillStyle = 'rgb(200,204,210)'; g.beginPath(); g.moveTo(-20, 0); g.lineTo(20, 0); g.lineTo(18, -28); g.lineTo(-18, -28); g.fill(); g.fillStyle = 'rgb(150,154,160)'; g.fillRect(-22, 0, 44, 2.5); marcaLogo(g, 'nimbo', -6, -20, 12, { layout: 'emblema', mono: [170, 210, 255], monoBg: [200, 204, 210] }); return S; }
function paintTable() { const S = spr([-46, -80, 46, 2], 2.4), g = S.g; const mt = g.createLinearGradient(-44, 0, 44, 0); mt.addColorStop(0, 'rgb(220,214,206)'); mt.addColorStop(.5, 'rgb(246,242,236)'); mt.addColorStop(1, 'rgb(200,194,186)'); g.fillStyle = mt; g.beginPath(); g.ellipse(0, -74, 44, 7, 0, 0, TAU); g.fill(); g.fillStyle = 'rgb(160,154,146)'; g.fillRect(-44, -74, 88, 4); g.fillStyle = 'rgb(30,28,30)'; g.fillRect(-3, -70, 6, 66); g.beginPath(); g.ellipse(0, -2, 24, 4, 0, 0, TAU); g.fill(); g.strokeStyle = 'rgba(150,150,160,.5)'; g.lineWidth = .7; g.beginPath(); g.moveTo(-30, -76); g.quadraticCurveTo(0, -70, 34, -75); g.stroke(); return S; }
function paintGlassDoor() {   /* puerta de vidrio con marco de acero negro (100 × 220): el vidrio es casi transparente */
  const T = tex(100, 220, 2), g = T.g;
  g.fillStyle = 'rgba(170,210,226,.22)'; g.fillRect(0, 0, 100, 220);
  g.fillStyle = 'rgba(255,255,255,.25)'; g.beginPath(); g.moveTo(14, 200); g.lineTo(60, 20); g.lineTo(76, 20); g.lineTo(30, 200); g.fill();
  g.fillStyle = 'rgb(26,24,26)'; g.fillRect(0, 0, 100, 9); g.fillRect(0, 211, 100, 9); g.fillRect(0, 0, 8, 220); g.fillRect(92, 0, 8, 220); g.fillRect(0, 150, 100, 7);
  g.fillStyle = 'rgb(176,140,70)'; g.fillRect(12, 96, 4, 44);
  g.save(); g.translate(50, 60); g.scale(-1, 1); marcaLogo(g, 'molienda', -40, -12, 22, { mono: [214, 176, 96], monoBg: [0, 0, 0] }); g.restore();
  return T;
}
function paintWindowView() {   /* la calle fría vista por los ventanales */
  const T = tex(600, 260, 1), g = T.g, r = mulberry32(241), gr = g.createLinearGradient(0, 0, 0, 260); gr.addColorStop(0, 'rgb(170,196,212)'); gr.addColorStop(1, 'rgb(120,140,156)'); g.fillStyle = gr; g.fillRect(0, 0, 600, 260);
  let x = 0; while (x < 600) { const w = 80 + r() * 100, h = 120 + r() * 140; g.fillStyle = cssc(mixc([120, 100, 100], [150, 170, 186], .5 + r() * .3)); g.fillRect(x, 260 - h, w, h); for (let y = 260 - h + 14; y < 230; y += 34) for (let k = x + 10; k < x + w - 20; k += 28) { g.fillStyle = 'rgba(200,220,236,.5)'; g.fillRect(k, y, 14, 20); } x += w + 6; }
  g.filter = 'blur(2px)'; g.drawImage(T.c, 0, 0, T.c.width, T.c.height, 0, 0, 600, 260); g.filter = 'none';
  return T;
}
function cafePaint() {
  MOX.floor = matHydraulic(1400, 850, { seed: 51 });
  MOX.wall = matPlaster(1400, 340, { seed: 61, c: [70, 92, 92], cracks: 2 }); MOX.wains = paintWainscot();
  MOX.wallL = matPlaster(850, 340, { seed: 62, c: [84, 100, 100], cracks: 1 }); MOX.wallR = matBrick(850, 340, { seed: 63, wash: .3, soot: 3 });
  MOX.ceil = matWood(1400, 850, { seed: 64, c: [70, 46, 34], plank: 22 });
  MOX.marble = matMarble(790, 120, { seed: 65 }); MOX.marbleEdge = matMarble(790, 6, { seed: 66, veins: 4 });
  MOX.walnut = matWood(790, 105, { seed: 67, c: [96, 60, 38], plank: 105, gap: 1.2 });
  MOX.chalkA = paintChalk(['Etiopía · Yirgacheffe — floral, bergamota', 'Colombia · Huila — panela, cereza', 'Guatemala · Antigua — cacao, nuez', 'Kenia · Nyeri — grosella, pomelo'], 'ORÍGENES', 3);
  MOX.chalkB = paintChalk(['Cortado .................. 2,40', 'Flat white ............. 3,10', 'V60 del día ........... 3,60', 'Cold brew .............. 3,20'], 'BEBIDAS', 7);
  MOX.shelf = paintShelfItems(); MOX.pastry = paintPastries(); MOX.machine = paintMachine(); MOX.refl = paintReflPlate(); MOX.grinder = paintGrinder();
  MOX.people = [paintPerson(1, { blur: 2.5 }), paintPerson(2, { c: [60, 44, 52], blur: 3 }), paintPerson(3, { blur: 6 }), paintPerson(4, { blur: 3 })]; MOX.laptop = paintLaptop(); MOX.laptopB = sprBlur(paintLaptop(), 4);
  MOX.table = paintTable(); MOX.tableB = sprBlur(paintTable(), 5); MOX.door = paintGlassDoor(); MOX.view = paintWindowView();
  const A = [150, 100, 70], k = .22; for (const T of [MOX.floor, MOX.wall, MOX.wains, MOX.wallR, MOX.ceil, MOX.walnut]) texShade(T, A, k); texShade(MOX.wallL, [110, 120, 140], .2); texShade(MOX.ceil, A, .3);
}
/* ---------- piezas vivas ---------- */
/* bombillas Edison: cordón, ampolla con filamento y halo; la luz va a la capa LGT */
function edison(x, z, len, t, k = 1) {
  const top = PJ(x, MO.Y0, z), b = PJ(x, MO.Y0 + len, z), s = PS(z), sw = Math.sin(t * .8 + x) * .6;
  ctx.strokeStyle = 'rgba(30,24,22,.9)'; ctx.lineWidth = Math.max(.5, s * .8); ctx.beginPath(); ctx.moveTo(top[0], top[1]); ctx.lineTo(b[0] + sw * s, b[1]); ctx.stroke();
  ctx.fillStyle = 'rgb(60,50,40)'; ctx.fillRect(b[0] + sw * s - 3 * s, b[1], 6 * s, 6 * s);
  const c = [b[0] + sw * s, b[1] + 13 * s], fl = .9 + .1 * Math.sin(t * 13 + x);
  const gr = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], 9 * s); gr.addColorStop(0, 'rgba(255,246,210,1)'); gr.addColorStop(.5, 'rgba(255,200,120,.85)'); gr.addColorStop(1, 'rgba(255,170,90,.3)'); ctx.fillStyle = gr; ctx.beginPath(); ctx.ellipse(c[0], c[1], 6 * s, 8 * s, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(255,250,230,.95)'; ctx.lineWidth = Math.max(.4, .6 * s); ctx.beginPath(); ctx.moveTo(c[0] - 2 * s, c[1] + 3 * s); for (let i = 0; i < 6; i++) ctx.lineTo(c[0] - 2 * s + i * .8 * s, c[1] + (i % 2 ? -3 : 1) * s); ctx.stroke();
  LGT(c[0], c[1], 190 * s * k, '255,180,100', .5 * fl * k); LGF(c[0], c[1], 22 * s, '255,230,180', .5 * fl * k);
}
/* ducto de cobre (cilindro horizontal a lo largo de x) */
function duct(z, y, r, t) {
  const a = PJ(MO.X0, y - r, z), b = PJ(MO.X1, y + r, z), gr = ctx.createLinearGradient(0, a[1], 0, b[1]);
  gr.addColorStop(0, 'rgb(120,62,36)'); gr.addColorStop(.3, 'rgb(236,160,100)'); gr.addColorStop(.55, 'rgb(170,90,52)'); gr.addColorStop(1, 'rgb(70,36,24)');
  ctx.fillStyle = gr; ctx.fillRect(a[0], a[1], b[0] - a[0], b[1] - a[1]);
  for (let x = MO.X0 + 120; x < MO.X1; x += 240) { const p = PJ(x, y - r - 2, z), q = PJ(x + 8, y + r + 2, z); ctx.fillStyle = 'rgba(80,40,26,.9)'; ctx.fillRect(p[0], p[1], q[0] - p[0], q[1] - p[1]); }
}
/* la Vaporetta con su cromo que refleja (deformado) todo el local y lo que pasa delante */
function drawMachine(t, o = {}) {
  const x0 = 60, z = 742, S = MOX.machine, y0 = MO.CT.top;
  bill(S, x0, y0, z);
  const s = PS(z), p = PJ(x0, y0, z), [px, py, pw, ph] = S.panel, X = p[0] + px * s, Y = p[1] + py * s, Wd = pw * s, Ht = ph * s;
  ctx.save(); ctx.beginPath(); ctx.rect(X, Y, Wd, Ht); ctx.clip();
  /* reflejo: la placa del local en tiras con compresión cilíndrica (los bordes se aprietan) y un temblor de vapor */
  const R = MOX.refl, n = 28, sh = (CAM.x - 175) * .4;
  for (let i = 0; i < n; i++) { const u0 = i / n, u1 = (i + 1) / n, f = v => .5 + .5 * Math.sin((v - .5) * PI * .92) / Math.sin(PI * .46), sx = ((f(u0) * .7 + .15) * R.width + sh) % R.width, sw = (f(u1) - f(u0)) * .7 * R.width;
    ctx.globalAlpha = 1; ctx.drawImage(R, Math.max(0, Math.min(R.width - 2, sx)), 0, Math.max(1, sw), R.height, X + u0 * Wd, Y + Math.sin(t * 2 + i * .5) * .4 * s, Wd / n + 1, Ht); }
  if (o.refl) o.refl(X, Y, Wd, Ht, s);
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'multiply'; const cg = ctx.createLinearGradient(X, 0, X + Wd, 0); cg.addColorStop(0, 'rgb(90,92,100)'); cg.addColorStop(.3, 'rgb(210,212,220)'); cg.addColorStop(.5, 'rgb(150,152,160)'); cg.addColorStop(.75, 'rgb(220,222,230)'); cg.addColorStop(1, 'rgb(80,82,90)'); ctx.fillStyle = cg; ctx.fillRect(X, Y, Wd, Ht);
  ctx.globalCompositeOperation = 'source-over'; ctx.strokeStyle = 'rgba(40,40,46,.5)'; ctx.lineWidth = Math.max(1, s * 1.2); ctx.strokeRect(X, Y, Wd, Ht);
  ctx.globalCompositeOperation = 'screen'; for (const [u, w, a] of [[.08, .02, .5], [.16, .04, .85], [.21, .012, 1], [.5, .03, .3], [.62, .06, .45], [.86, .025, .7], [.9, .01, .9]]) { ctx.fillStyle = `rgba(255,250,240,${a})`; ctx.fillRect(X + u * Wd, Y, w * Wd, Ht); }
  ctx.restore();
  /* el logo y los manómetros quedan encima del reflejo */
  ctx.save(); const sb = S.box, sx0 = p[0] + sb[0] * s, sy0 = p[1] + sb[1] * s, sw = (sb[2] - sb[0]) * s, shh = (sb[3] - sb[1]) * s;
  for (const [a, b, c, d] of [[80, -64, 100, 22], [18, -60, 24, 24], [188, -60, 24, 24]]) { ctx.save(); ctx.beginPath(); ctx.rect(p[0] + a * s, p[1] + b * s, c * s, d * s); ctx.clip(); ctx.drawImage(S.c, sx0, sy0, sw, shh); ctx.restore(); }
  ctx.restore();
  const tl = PJ(x0 + 112, y0 - 30, z); LGT(tl[0], tl[1], 140 * s, '255,210,150', .25);
}
/* campanilla sobre la puerta: oscila amortiguada cada vez que la puerta se abre */
function bellAng(t, opens) { let a = 0; for (const t0 of opens) { const d = t - t0; if (d > 0 && d < 4) a += .7 * Math.exp(-d * 1.4) * Math.sin(d * 14); } return a; }
function drawBell(t, opens) {
  const z = MO.DOOR.z0 + 6, x = MO.X0 + 2, y = -MO.DOOR.h - 18, piv = PJ(x, y, z), s = PS(z), a = bellAng(t, opens);
  ctx.strokeStyle = 'rgb(40,36,34)'; ctx.lineWidth = Math.max(.8, 1.6 * s); ctx.beginPath(); ctx.moveTo(piv[0] - 14 * s, piv[1] - 8 * s); ctx.quadraticCurveTo(piv[0] - 4 * s, piv[1] - 10 * s, piv[0], piv[1]); ctx.stroke();
  ctx.save(); ctx.translate(piv[0], piv[1]); ctx.rotate(a);
  ctx.strokeStyle = 'rgb(60,50,40)'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 8 * s); ctx.stroke();
  const gr = ctx.createLinearGradient(-6 * s, 0, 6 * s, 0); gr.addColorStop(0, 'rgb(150,110,40)'); gr.addColorStop(.4, 'rgb(250,214,120)'); gr.addColorStop(1, 'rgb(120,86,30)'); ctx.fillStyle = gr;
  ctx.beginPath(); ctx.moveTo(-3 * s, 8 * s); ctx.quadraticCurveTo(-4 * s, 14 * s, -7 * s, 18 * s); ctx.lineTo(7 * s, 18 * s); ctx.quadraticCurveTo(4 * s, 14 * s, 3 * s, 8 * s); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgb(90,66,30)'; ctx.beginPath(); ctx.arc(Math.sin(a * 2) * 3 * s, 19 * s, 1.6 * s, 0, TAU); ctx.fill();
  ctx.restore();
}
/* servilletas de papel que salen volando con la corriente de aire */
function napkinAt(i, t, t0, p0) {
  const a = t - t0; if (a < 0) return { x: p0[0] + (i - 1) * 9, y: p0[1], z: p0[2] + (i % 2) * 6, rot: i * .3, fl: 1 };
  const vx = -60 - hsh(i, 1) * 90, vy = -170 - hsh(i, 2) * 120, vz = -120 - hsh(i, 3) * 140, k = 1.4, e = (1 - Math.exp(-k * a)) / k;
  const y = Math.min(0, p0[1] + vy * e + 45 * a * a * (a < 2.5 ? 1 : 0) + (a > 2.5 ? 45 * 6.25 + 60 * (a - 2.5) : 0));
  return { x: p0[0] + (i - 1) * 9 + vx * e + Math.sin(a * 3 + i) * 20 * Math.min(1, a), y, z: p0[2] + vz * e, rot: a * (2 + i) + i, fl: Math.cos(a * (5 + i * 1.3)), down: y >= -.5 };
}
function drawNapkin(N) {
  const s = 14, pts = [[-s, -s], [s, -s], [s, s], [-s, s]].map(([u, v]) => { const c = Math.cos(N.rot), si = Math.sin(N.rot); const lu = u * c - v * si, lv = u * si + v * c; return N.down ? [N.x + lu, -.6, N.z + lv * .9] : [N.x + lu, N.y + lv * N.fl * .6, N.z + lv * .3]; });
  const P = poly3(pts); if (!P) return; ctx.fillStyle = cssc(mixc([250, 248, 240], [200, 190, 180], N.fl < 0 ? .3 : 0)); ctx.fill(P); ctx.strokeStyle = 'rgba(160,150,140,.6)'; ctx.lineWidth = .8; ctx.stroke(P);
}
/* ---------- la cafetería en t ---------- */
function drawCafe(t, o = {}) {
  lightsBegin(); T0();
  const C = MO.CT, ZB = MO.ZB;
  /* exterior por los ventanales y la puerta */
  vplane(MOX.view, [-900, 200], [-900, 1000], -300, 20);
  /* techo, ductos, suelo */
  hplane(MOX.ceil, MO.X0, MO.X1, MO.ZF, ZB, MO.Y0);
  hplane(MOX.floor, MO.X0, MO.X1, MO.ZF, ZB, 0);
  /* pared del fondo: zócalo de nogal, yeso verde petróleo, pizarras, estantes */
  vplane(MOX.wall, [MO.X0, ZB], [MO.X1, ZB], MO.Y0, -110); vplane(MOX.wains, [MO.X0, ZB], [MO.X1, ZB], -110, 0);
  vplane(MOX.chalkA, [-420, ZB - 2], [-180, ZB - 2], -300, -150); vplane(MOX.chalkB, [-150, ZB - 2], [90, ZB - 2], -300, -150);
  bill(MOX.shelf, 300, -120, ZB - 4);
  /* pared izquierda: ventanales (huecos sobre la vista) y la puerta de vidrio; pared derecha de ladrillo */
  const uz = z => (z - MO.ZF) / (ZB - MO.ZF), wl = (z0, z1, y0, y1) => vplane(MOX.wallL, [MO.X0, z0], [MO.X0, z1], y0, y1, { u0: uz(z0), u1: uz(z1), v0: (y0 - MO.Y0) / -MO.Y0, v1: (y1 - MO.Y0) / -MO.Y0 });
  const D = MO.DOOR, WN = [[220, 560]];
  wl(MO.ZF, WN[0][0], MO.Y0, 0); wl(WN[0][1], D.z0, MO.Y0, 0); wl(D.z1, ZB, MO.Y0, 0); wl(WN[0][0], WN[0][1], MO.Y0, -260); wl(WN[0][0], WN[0][1], -60, 0); wl(D.z0, D.z1, MO.Y0, -D.h);
  for (const [z0, z1] of WN) for (const z of [z0, (z0 + z1) / 2, z1]) { const P = poly3([[MO.X0, -260, z - 3], [MO.X0, -260, z + 3], [MO.X0, -60, z + 3], [MO.X0, -60, z - 3]]); if (P) { ctx.fillStyle = 'rgb(26,24,26)'; ctx.fill(P); } }
  const da = o.doorAng ? o.doorAng(t) : 0, hb = [MO.X0, D.z1], de = [MO.X0 + Math.sin(da) * (D.z1 - D.z0), D.z1 - Math.cos(da) * (D.z1 - D.z0)];
  put(D.z0 + 1, () => { vplane(MOX.door, de, hb, -D.h, 0, { n: da > .02 ? 16 : 1 }); });
  vplane(MOX.wallR, [MO.X1, ZB], [MO.X1, MO.ZF], MO.Y0, 0);
  const vw = PJ(MO.X0, -160, 400); LGT(vw[0], vw[1], 400 * PS(400), '150,200,230', .35);
  duct(880, MO.Y0 + 26, 14, t); duct(560, MO.Y0 + 30, 16, t);
  /* mostrador: frente de nogal con barra de latón, sobre de mármol */
  put(C.z0 + 2, () => {
    vplane(MOX.walnut, [C.x0, C.z0], [C.x1, C.z0], C.top + 4, 0);
    hplane(MOX.marble, C.x0 - 4, C.x1 + 4, C.z0 - 6, C.z1, C.top);
    vplane(MOX.marbleEdge, [C.x0 - 4, C.z0 - 6], [C.x1 + 4, C.z0 - 6], C.top, C.top + 5);
    const a = PJ(C.x0, -14, C.z0 - 12), b = PJ(C.x1, -14, C.z0 - 12); ctx.strokeStyle = 'rgb(214,176,96)'; ctx.lineWidth = Math.max(1, 3 * PS(C.z0)); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    const e = PJ(C.x0, 0, C.z0 - 6), f = PJ(C.x0, C.top, C.z0 - 6); ctx.fillStyle = 'rgb(60,40,28)'; ctx.fillRect(e[0] - 2 * PS(C.z0), f[1], 4 * PS(C.z0), e[1] - f[1]);
    /* reflejo de las bombillas en el mármol */
    for (let x = -500; x <= 650; x += 160) { const q = PJ(x + 20, C.top - .5, 700); ctx.fillStyle = 'rgba(255,220,170,.25)'; ctx.beginPath(); ctx.ellipse(q[0], q[1], 8 * PS(700), 1.5 * PS(700), 0, 0, TAU); ctx.fill(); }
  });
  /* vitrina curva con dulces, vidrio empañado en las esquinas de abajo */
  put(C.z0 + 1, () => drawVitrine(t));
  put(745, () => drawMachine(t, o));
  put(744, () => { bill(MOX.grinder, 320, C.top, 730); steamCols(t, { x: 64, y: C.top - 20, z: 742 }, { n: 5, h: 230, w: 3, a: o.wand ? o.wand(t) : .08, sway: 10, spread: 6, drift: .1 }); steamCols(t, { x: 285, y: C.top - 20, z: 742 }, { n: 3, h: 200, w: 2.5, a: .07, sway: 8, spread: 4 }); });
  /* bombillas Edison */
  for (let x = -560; x <= 700; x += 150) { put(850, () => edison(x, 850, 90 + (x / 150 % 3 + 3) % 3 * 20, t)); put(640, () => edison(x + 75, 640, 120 + (x / 150 % 2 + 2) % 2 * 25, t, .8)); }
  /* mesas y clientes con portátiles */
  const custo = [[-470, 470, 0, true], [600, 830, 1, false], [520, 300, 2, true]];
  for (const [x, z, k, lap] of custo) put(z, () => {
    const P = MOX.people[k], tb = z < 400 ? MOX.tableB : MOX.table;
    bill(P, x, 0, z + 30); bill(tb, x, 0, z);
    if (lap) { const L = z < 400 ? MOX.laptopB : MOX.laptop; bill(L, x + 4, -76, z - 8); const g0 = PJ(x + 4, -96, z - 8); const near = z < 400 ? .35 : 1; LGT(g0[0], g0[1], 170 * PS(z) * near, '110,160,255', .8 * near); LGF(g0[0], g0[1], 30 * PS(z) * near, '170,210,255', .4 * near); }
    else { const c = PJ(x, -80, z); ctx.fillStyle = 'rgb(240,236,226)'; ctx.fillRect(c[0] - 4 * PS(z), c[1] - 6 * PS(z), 8 * PS(z), 6 * PS(z)); }
  });
  /* servilletas */
  if (o.napkins) for (let i = 0; i < 3; i++) { const N = napkinAt(i, t, o.napkins, [-470, -76, 470]); put(N.z - 1, () => drawNapkin(N)); }
  put(D.z0 + .5, () => drawBell(t, o.opens || []));
  if (o.items) o.items(put, t);
  flush();
  if (o.fx) o.fx(t);
  lightsComp(0);
}
function drawVitrine(t) {
  const x0 = -300, x1 = -40, z0 = 652, z1 = 744, top = MO.CT.top, h = 66;
  bill(MOX.pastry, x0 + 6, top - 8, 700);
  /* vidrio curvo: frente con brillo, esquinas empañadas */
  const P = poly3([[x0, top - h, z0 + 30], [x1, top - h, z0 + 30], [x1, top, z0], [x0, top, z0]]);
  if (P) { ctx.save(); ctx.fillStyle = 'rgba(220,236,240,.12)'; ctx.fill(P); ctx.clip(P);
    for (const cx of [x0 + 18, x1 - 18]) { const c = PJ(cx, top - 6, z0 + 6), s = PS(z0), rg = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], 40 * s); rg.addColorStop(0, 'rgba(240,244,246,.75)'); rg.addColorStop(1, 'rgba(240,244,246,0)'); ctx.fillStyle = rg; ctx.fillRect(c[0] - 40 * s, c[1] - 40 * s, 80 * s, 80 * s); }
    const a = PJ(x0 + 60, top - h, z0 + 30), b = PJ(x0 + 30, top, z0); ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.lineWidth = 6 * PS(z0); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore();
    ctx.strokeStyle = 'rgba(40,30,26,.9)'; ctx.lineWidth = Math.max(1, 2 * PS(z0)); ctx.stroke(P); }
  box3({ x0, x1, y0: top - h - 4, y1: top - h, z0: z0 + 26, z1 }, { front: [60, 40, 28], top: [70, 48, 34] });
  const c = PJ((x0 + x1) / 2, top - 30, 700); LGT(c[0], c[1], 200 * PS(700), '255,210,150', .35);
}
