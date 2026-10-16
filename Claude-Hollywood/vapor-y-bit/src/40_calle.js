/* =====================================================================
   ESCENA 2a · LA CALLE ALMAGRE (07:35): travelling lateral rápido con cuatro planos de profundidad
   1 · primer plano fuera de foco en el bordillo (z ≈ 320): parquímetros, bocas de incendio, postes con cables
   2 · Teo corriendo por la acera de concreto agrietada (z = 560), charcos que reflejan el cielo y las fachadas
   2b · la calzada (z 760…1180) con taxis, coches, furgonetas de reparto y el autobús; alcantarillas que humean;
        la acera de enfrente con vecinos que caminan
   3 · fachadas de ladrillo con escaleras de incendio que humean por las calderas de la mañana (z = 1400)
   4 · la ciudad lejana en la neblina fría (z = 9000)
   Tonos fríos cian y gris; al final, la fachada cálida de Molienda Reserva.
   ===================================================================== */
const CA = { ZF: 1400, ZT: 560, ZC: 300, R0: 760, R1: 1180, LA: 900, LB: 1060, END: 9640, X0: -1600, X1: 11600 };
const CAX = {};
const COOL = [132, 150, 172];
/* ---------- un edificio (sprite en cm, base en y = 0) ---------- */
function paintBuilding(seed, w, h, o = {}) {
  const r = mulberry32(seed), S = spr([-10, -h - 60, w + 10, 2], o.d ?? .9), g = S.g, kind = o.kind ?? (r() < .65 ? 'brick' : 'stucco');
  const wall = kind === 'brick' ? pick3(r, [[150, 76, 60], [128, 70, 58], [170, 96, 72], [118, 64, 56]]) : pick3(r, [[196, 184, 160], [170, 176, 168], [186, 160, 138]]);
  g.fillStyle = cssc(wall); g.fillRect(0, -h, w, h);
  if (kind === 'brick') { g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = g.createPattern(CAX.brickTile.c, 'repeat'); g.translate(r() * 100, r() * 100); g.fillRect(-200, -h - 200, w + 400, h + 400); g.restore(); g.save(); g.globalAlpha = .45; g.fillStyle = cssc(wall); g.fillRect(0, -h, w, h); g.restore(); }
  else wcWash(g, rectP(0, -h, w, h), wall, .6, { reserve: false, amt: 2, seed, edge: false, step: 40, bloom: shc(wall, -.15) });
  /* cornisa, impostas por piso */
  const FL = 300, nf = Math.floor((h - 360) / FL);
  g.fillStyle = cssc(shc(wall, -.3)); g.fillRect(-6, -h - 14, w + 12, 18); g.fillStyle = cssc(shc(wall, .15)); g.fillRect(-6, -h - 18, w + 12, 5);
  for (let f = 0; f <= nf; f++) { g.fillStyle = cssc(shc(wall, -.18), .7); g.fillRect(0, -360 - f * FL, w, 6); }
  /* ventanas */
  const cols = Math.max(2, Math.floor(w / 190)), gap = w / cols;
  for (let f = 0; f < nf; f++) for (let c = 0; c < cols; c++) {
    const wx = gap * (c + .5) - 45, wy = -360 - f * FL - 220, lit = r() < .3, glass = lit ? [255, 214, 150] : [90, 110, 130];
    g.fillStyle = cssc(shc(wall, .22)); g.fillRect(wx - 8, wy - 10, 106, 10); g.fillRect(wx - 8, wy + 160, 106, 8);   // dintel y alféizar
    const gr = g.createLinearGradient(0, wy, 0, wy + 160); gr.addColorStop(0, cssc(shc(glass, .2))); gr.addColorStop(1, cssc(shc(glass, -.25))); g.fillStyle = gr; g.fillRect(wx, wy, 90, 160);
    if (!lit) { g.fillStyle = 'rgba(200,220,236,.35)'; g.beginPath(); g.moveTo(wx + 8, wy + 150); g.lineTo(wx + 50, wy + 8); g.lineTo(wx + 70, wy + 8); g.lineTo(wx + 28, wy + 150); g.fill(); }
    if (r() < .4) { g.fillStyle = cssc(pick3(r, [[200, 120, 120], [220, 210, 180], [120, 150, 170], [180, 160, 200]]), .8); g.fillRect(wx + (r() < .5 ? 0 : 55), wy, 35, 150); }   // cortinas
    g.strokeStyle = 'rgba(240,236,226,.9)'; g.lineWidth = 4; g.strokeRect(wx, wy, 90, 160); g.beginPath(); g.moveTo(wx, wy + 80); g.lineTo(wx + 90, wy + 80); g.stroke();
    if (r() < .18) { g.fillStyle = 'rgb(200,200,196)'; g.fillRect(wx + 15, wy + 95, 60, 40); g.fillStyle = 'rgba(80,80,86,.6)'; for (let k = 0; k < 6; k++) g.fillRect(wx + 18, wy + 100 + k * 6, 54, 2); }   // aire acondicionado
    if (r() < .3) { g.fillStyle = 'rgb(120,74,50)'; g.fillRect(wx - 4, wy + 160, 98, 12); for (let k = 0; k < 7; k++) { g.fillStyle = cssc(pick3(r, [[200, 60, 50], [90, 140, 70], [240, 180, 60]])); g.beginPath(); g.arc(wx + 6 + k * 13, wy + 156, 7, 0, TAU); g.fill(); } }
  }
  /* planta baja: tienda (lavandería, colmado, cortina metálica) o portal con escalinata */
  const shop = o.shop ?? ['laundry', 'bodega', 'shutter', 'door'][(r() * 4) | 0], sx = 30, sw = w - 60;
  g.fillStyle = cssc(shc(wall, -.35)); g.fillRect(0, -360, w, 360);
  if (shop === 'laundry') { g.fillStyle = 'rgb(214,226,232)'; g.fillRect(sx, -290, sw, 230); for (let k = 0; k < Math.floor(sw / 90); k++) { const cx = sx + 50 + k * 90, cy = -150; g.fillStyle = 'rgb(236,240,240)'; g.fillRect(cx - 38, cy - 50, 76, 100); g.fillStyle = 'rgb(70,90,110)'; g.beginPath(); g.arc(cx, cy, 28, 0, TAU); g.fill(); g.fillStyle = cssc(pick3(r, [[220, 80, 80], [80, 120, 200], [240, 220, 120]]), .8); g.beginPath(); g.arc(cx - 4, cy + 6, 18, 0, TAU); g.fill(); g.strokeStyle = 'rgb(180,186,190)'; g.lineWidth = 5; g.beginPath(); g.arc(cx, cy, 30, 0, TAU); g.stroke(); } g.fillStyle = 'rgb(40,110,160)'; g.fillRect(sx - 10, -350, sw + 20, 50); }
  else if (shop === 'bodega') { g.fillStyle = 'rgb(236,214,160)'; g.fillRect(sx, -290, sw, 230); for (let k = 0; k < 12; k++) { g.fillStyle = cssc(pick3(r, [[200, 60, 50], [230, 160, 40], [110, 160, 70], [240, 220, 120]])); g.fillRect(sx + 10 + r() * (sw - 40), -150 + r() * 60, 26, 26); } for (let k = 0; k < 5; k++) { const bx = sx + 20 + k * (sw - 40) / 5; g.fillStyle = 'rgb(140,100,60)'; g.fillRect(bx, -60, 70, 40); for (let q = 0; q < 6; q++) { g.fillStyle = cssc(pick3(r, [[220, 60, 50], [240, 170, 40], [120, 170, 60]])); g.beginPath(); g.arc(bx + 10 + q * 10, -64, 7, 0, TAU); g.fill(); } } g.fillStyle = 'rgb(46,96,70)'; g.fillRect(sx - 10, -350, sw + 20, 50); }
  else if (shop === 'shutter') { g.fillStyle = 'rgb(150,154,160)'; g.fillRect(sx, -300, sw, 300); for (let y = -300; y < 0; y += 9) { g.fillStyle = 'rgba(60,64,70,.5)'; g.fillRect(sx, y, sw, 2); } g.lineWidth = 9; g.lineCap = 'round'; for (let k = 0; k < 3; k++) { g.strokeStyle = cssc(pick3(r, [[220, 70, 120], [70, 180, 200], [240, 200, 60]]), .85); g.beginPath(); const x0 = sx + 40 + r() * (sw - 200); g.moveTo(x0, -120 - r() * 60); g.bezierCurveTo(x0 + 60, -260, x0 + 100, -40, x0 + 170, -180); g.stroke(); } }
  else { g.fillStyle = 'rgb(70,46,36)'; g.fillRect(w / 2 - 55, -280, 110, 250); g.fillStyle = 'rgba(255,214,150,.5)'; g.fillRect(w / 2 - 45, -270, 90, 50); for (let k = 0; k < 3; k++) { g.fillStyle = cssc(shc(wall, .1 - k * .05)); g.fillRect(w / 2 - 90 - k * 12, -30 + k * 10, 180 + k * 24, 12); } }
  /* escalera de incendios: plataformas, barandillas, escaleras en zigzag, escalera colgante */
  if (o.escape !== false && nf >= 2) {
    const ex = w * (.15 + r() * .2), ew = Math.min(w * .6, 420), iron = 'rgb(34,32,36)';
    g.strokeStyle = iron; g.fillStyle = iron;
    for (let f = 0; f < nf; f++) { const py = -360 - f * FL - 40;
      g.fillRect(ex, py, ew, 7); for (let x = ex; x <= ex + ew; x += 14) g.fillRect(x, py, 2, 6);
      g.lineWidth = 3; g.beginPath(); g.moveTo(ex, py - 90); g.lineTo(ex + ew, py - 90); g.moveTo(ex, py - 45); g.lineTo(ex + ew, py - 45); g.stroke();
      g.lineWidth = 1.6; for (let x = ex; x <= ex + ew; x += 16) { g.beginPath(); g.moveTo(x, py); g.lineTo(x, py - 90); g.stroke(); }
      if (f < nf - 1) { const lx0 = f % 2 ? ex + ew - 40 : ex + 40, lx1 = f % 2 ? ex + 60 : ex + ew - 60; g.lineWidth = 3; g.beginPath(); g.moveTo(lx0, py); g.lineTo(lx1, py - FL); g.moveTo(lx0 + 22, py); g.lineTo(lx1 + 22, py - FL); g.stroke(); g.lineWidth = 2; for (let k = 1; k < 14; k++) { const u = k / 14; g.beginPath(); g.moveTo(lerp(lx0, lx1, u), lerp(py, py - FL, u)); g.lineTo(lerp(lx0, lx1, u) + 22, lerp(py, py - FL, u)); g.stroke(); } } }
    g.lineWidth = 3; const dl = ex + ew - 50; g.beginPath(); g.moveTo(dl, -400); g.lineTo(dl, -250); g.moveTo(dl + 26, -400); g.lineTo(dl + 26, -250); g.stroke(); for (let y = -400; y < -250; y += 14) { g.beginPath(); g.moveTo(dl, y); g.lineTo(dl + 26, y); g.stroke(); }
    S.escape = { x: ex, w: ew };
  }
  /* bajantes y manchas de humedad */
  g.fillStyle = 'rgba(60,60,66,.8)'; g.fillRect(w - 18, -h, 8, h);
  g.globalCompositeOperation = 'multiply'; for (let k = 0; k < 5; k++) { const x = r() * w, ll = 100 + r() * 300, sg = g.createLinearGradient(0, -h, 0, -h + ll); sg.addColorStop(0, 'rgba(70,64,70,.35)'); sg.addColorStop(1, 'rgba(70,64,70,0)'); g.fillStyle = sg; g.fillRect(x, -h, 20 + r() * 40, ll); } g.globalCompositeOperation = 'source-over';
  wcTex(g, S.c.width, S.c.height, .3, .25);
  S.w = w; S.h = h; S.vents = [[w * (.2 + r() * .6), -h - 20], [S.escape ? S.escape.x + 30 : w * .3, -400 - FL * (r() * 2 | 0)], [w * (.55 + r() * .3), -360 - FL - 60]];
  return S;
}
/* ---------- la fachada de Molienda Reserva (cálida, al final de la calle) ---------- */
function paintMoliendaFront() {
  const w = 900, h = 1150, S = spr([-20, -h - 80, w + 20, 2], .9), g = S.g;
  g.fillStyle = 'rgb(46,40,40)'; g.fillRect(0, -h, w, h);
  g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = g.createPattern(CAX.brickTile.c, 'repeat'); g.fillRect(0, -h, w, h); g.restore();
  for (let f = 0; f < 2; f++) for (let c = 0; c < 4; c++) { const wx = 40 + c * 220, wy = -520 - f * 300 - 160; g.fillStyle = 'rgba(255,200,140,.6)'; g.fillRect(wx, wy, 120, 170); g.strokeStyle = 'rgb(30,28,30)'; g.lineWidth = 6; g.strokeRect(wx, wy, 120, 170); }
  /* escaparate: interior ámbar, siluetas, bombillas Edison */
  const gx = 30, gw = w - 60, gy = -380, gh = 340;
  const amb = g.createLinearGradient(0, gy, 0, gy + gh); amb.addColorStop(0, 'rgb(255,190,110)'); amb.addColorStop(1, 'rgb(150,80,40)'); g.fillStyle = amb; g.fillRect(gx, gy, gw, gh);
  for (let k = 0; k < 9; k++) { const bx = gx + 40 + k * (gw - 80) / 8; g.strokeStyle = 'rgba(40,30,20,.7)'; g.lineWidth = 2; g.beginPath(); g.moveTo(bx, gy); g.lineTo(bx, gy + 60 + (k % 3) * 18); g.stroke(); const rg = g.createRadialGradient(bx, gy + 66 + (k % 3) * 18, 1, bx, gy + 66 + (k % 3) * 18, 40); rg.addColorStop(0, 'rgba(255,240,200,1)'); rg.addColorStop(.2, 'rgba(255,200,120,.6)'); rg.addColorStop(1, 'rgba(255,200,120,0)'); g.fillStyle = rg; g.fillRect(bx - 40, gy + 26 + (k % 3) * 18, 80, 80); }
  for (let k = 0; k < 5; k++) { const px = gx + 120 + k * 150, ph = 120 + (k % 2) * 30; g.fillStyle = 'rgba(70,36,24,.65)'; g.beginPath(); g.ellipse(px, gy + gh - ph, 26, 30, 0, 0, TAU); g.fill(); g.fillRect(px - 40, gy + gh - ph + 24, 80, ph - 24); }
  g.fillStyle = 'rgba(110,60,40,.8)'; g.fillRect(gx, gy + gh - 90, gw, 14);
  g.strokeStyle = 'rgb(24,22,24)'; g.lineWidth = 10; g.strokeRect(gx, gy, gw, gh); for (let k = 1; k < 4; k++) { g.beginPath(); g.moveTo(gx + k * gw / 4, gy); g.lineTo(gx + k * gw / 4, gy + gh); g.stroke(); }
  g.fillStyle = 'rgba(255,255,255,.12)'; g.beginPath(); g.moveTo(gx + 20, gy + gh); g.lineTo(gx + 160, gy); g.lineTo(gx + 230, gy); g.lineTo(gx + 90, gy + gh); g.fill();
  /* toldo y letrero */
  for (let k = 0; k < 18; k++) { const x0 = -10 + k * (w + 20) / 18; g.fillStyle = k % 2 ? 'rgb(110,36,48)' : 'rgb(90,28,38)'; g.beginPath(); g.moveTo(x0, -470); g.lineTo(x0 + (w + 20) / 18, -470); g.lineTo(x0 + (w + 20) / 18 + 4, -400); g.quadraticCurveTo(x0 + (w + 20) / 36, -388, x0 - 2, -400); g.fill(); }
  g.fillStyle = 'rgb(30,26,26)'; g.fillRect(w * .2, -600, w * .6, 110);
  marcaLogo(g, 'molienda', w * .2 + 30, -585, 80, { dark: true });
  wcTex(g, S.c.width, S.c.height, .25, .2);
  /* la puerta de vidrio con marco de acero negro, tirador y campanilla */
  { const dx = 620, dw = 120; g.fillStyle = 'rgb(22,20,22)'; g.fillRect(dx - 8, -340, dw + 16, 340); const dg = g.createLinearGradient(0, -330, 0, 0); dg.addColorStop(0, 'rgb(255,196,120)'); dg.addColorStop(1, 'rgb(170,96,50)'); g.fillStyle = dg; g.fillRect(dx, -330, dw, 322);
    g.fillStyle = 'rgba(70,36,24,.7)'; g.beginPath(); g.ellipse(dx + 70, -180, 22, 26, 0, 0, TAU); g.fill(); g.fillRect(dx + 44, -158, 52, 150);   // alguien dentro, en la barra
    g.fillStyle = 'rgba(255,255,255,.16)'; g.beginPath(); g.moveTo(dx + 10, -8); g.lineTo(dx + 60, -330); g.lineTo(dx + 84, -330); g.lineTo(dx + 34, -8); g.fill();
    g.fillStyle = 'rgb(190,170,120)'; g.fillRect(dx + 14, -200, 6, 90); g.fillStyle = 'rgb(240,232,214)'; g.fillRect(dx + 34, -120, 54, 18); g.fillStyle = 'rgb(40,30,26)'; g.font = '700 11px "Space Mono", monospace'; g.fillText('ABIERTO', dx + 37, -107);
    g.fillStyle = 'rgb(200,170,90)'; g.beginPath(); g.arc(dx + dw - 10, -326, 7, 0, PI); g.fill(); g.fillStyle = 'rgb(60,56,52)'; g.fillRect(dx - 14, -2, dw + 28, 8); }   // campanilla y umbral
  S.door = { x: 620, w: 120 };
  return S;
}
/* ---------- vehículos (de perfil, mirando a la izquierda; las ruedas se dibujan vivas) ---------- */
function paintVehicle(kind, col, seed, brand, right) {   /* right: mira a la derecha (la carrocería se refleja; los rótulos no) */
  const L = kind === 'bus' ? 1100 : kind === 'van' ? 520 : 450, Ht = kind === 'bus' ? 300 : kind === 'van' ? 220 : 150, S = spr([-10, -Ht - 30, L + 10, 4], 1.4), g = S.g, r = mulberry32(seed), c = col;
  if (right) { g.translate(L, 0); g.scale(-1, 1); }
  const unflip = (cx, f) => { g.save(); if (right) { g.translate(cx, 0); g.scale(-1, 1); g.translate(-cx, 0); } f(); g.restore(); };
  const body = g.createLinearGradient(0, -Ht, 0, -20); body.addColorStop(0, cssc(shc(c, .25))); body.addColorStop(.45, cssc(c)); body.addColorStop(1, cssc(shc(c, -.3)));
  g.fillStyle = body; g.beginPath();
  if (kind === 'sedan' || kind === 'taxi') { g.moveTo(6, -36); g.lineTo(4, -78); g.quadraticCurveTo(8, -94, 40, -98); g.lineTo(130, -102); g.quadraticCurveTo(160, -104, 190, -146); g.quadraticCurveTo(205, -152, 300, -150); g.quadraticCurveTo(345, -146, 380, -104); g.lineTo(440, -98); g.quadraticCurveTo(452, -92, 450, -60); g.lineTo(446, -36); g.closePath(); }
  else if (kind === 'van') { g.moveTo(6, -36); g.lineTo(4, -90); g.quadraticCurveTo(10, -104, 50, -112); g.lineTo(110, -200); g.quadraticCurveTo(120, -214, 150, -214); g.lineTo(510, -214); g.quadraticCurveTo(520, -212, 520, -196); g.lineTo(518, -36); g.closePath(); }
  else { g.moveTo(4, -40); g.lineTo(2, -270); g.quadraticCurveTo(4, -296, 40, -298); g.lineTo(1080, -298); g.quadraticCurveTo(1098, -296, 1098, -276); g.lineTo(1096, -40); g.closePath(); }
  g.fill(); g.strokeStyle = 'rgba(20,20,26,.8)'; g.lineWidth = 2.5; g.stroke();
  const glass = (pts) => { const gg = g.createLinearGradient(0, -300, 0, -90); gg.addColorStop(0, 'rgb(170,196,214)'); gg.addColorStop(.6, 'rgb(90,110,130)'); gg.addColorStop(1, 'rgb(60,70,86)'); g.fillStyle = gg; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.fill(); g.fillStyle = 'rgba(255,255,255,.3)'; g.beginPath(); g.moveTo(pts[0][0] + 20, pts[0][1]); g.lineTo(pts[1][0] + 10, pts[1][1]); g.lineTo(pts[1][0] + 30, pts[1][1]); g.lineTo(pts[0][0] + 40, pts[0][1]); g.fill(); };
  if (kind === 'sedan' || kind === 'taxi') { glass([[150, -104], [196, -142], [262, -144], [262, -104]]); glass([[272, -104], [272, -144], [300, -144], [356, -104]]); g.fillStyle = cssc(shc(c, -.4)); g.fillRect(262, -146, 10, 44);
    g.strokeStyle = 'rgba(20,20,26,.5)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(268, -100); g.lineTo(268, -40); g.moveTo(150, -100); g.lineTo(150, -44); g.moveTo(376, -100); g.lineTo(380, -44); g.stroke(); g.fillStyle = 'rgba(30,30,34,.8)'; g.fillRect(212, -86, 20, 4); g.fillRect(320, -86, 20, 4); g.fillRect(138, -116, 14, 10); }
  else if (kind === 'van') { glass([[60, -110], [114, -196], [150, -200], [150, -110]]); g.fillStyle = cssc(shc(c, -.15)); g.fillRect(170, -196, 330, 140); g.strokeStyle = 'rgba(20,20,26,.4)'; g.lineWidth = 1.5; g.strokeRect(170, -196, 330, 140); }
  else { for (let k = 0; k < 8; k++) glass([[60 + k * 125, -190], [60 + k * 125, -270], [170 + k * 125, -270], [170 + k * 125, -190]]); g.fillStyle = 'rgb(30,30,34)'; g.fillRect(10, -270, 40, 230); g.fillStyle = cssc(shc(c, -.25)); g.fillRect(60, -170, 1000, 110); }
  if (kind === 'taxi') { g.fillStyle = 'rgb(30,30,34)'; for (let k = 0; k < 24; k++) if (k % 2) g.fillRect(40 + k * 16, -76, 16, 8); else g.fillRect(40 + k * 16, -68, 16, 8); g.fillStyle = 'rgb(250,246,230)'; g.fillRect(222, -166, 64, 16); unflip(254, () => { g.fillStyle = 'rgb(30,30,34)'; g.font = '700 14px "Josefin Sans", sans-serif'; g.fillText('TAXI', 234, -153); }); unflip(205, () => { g.font = '700 10px "Josefin Sans", sans-serif'; g.fillStyle = 'rgb(30,30,34)'; g.fillText('ALMAGRE · 24 h', 160, -50); }); }
  if (brand) { const bx = kind === 'bus' ? 120 : 196, by = kind === 'bus' ? -158 : -184, bh = kind === 'bus' ? 80 : 100; const pw = kind === 'bus' ? 860 : 290; g.fillStyle = 'rgba(250,248,240,.95)'; g.fillRect(bx - 10, by - 6, pw, bh + 12); unflip(bx - 10 + pw / 2, () => marcaLogo(g, brand, bx, by, bh)); }
  g.fillStyle = 'rgb(250,240,200)'; g.fillRect(4, kind === 'bus' ? -110 : -84, 10, 14); g.fillStyle = 'rgb(200,40,36)'; g.fillRect(L - 10, kind === 'bus' ? -110 : -84, 8, 16);   // faro y piloto
  g.fillStyle = 'rgb(40,40,46)'; g.fillRect(0, -42, L, 10);   // parachoques/estribo
  const wr = kind === 'bus' ? 46 : 34, wx = kind === 'bus' ? [170, 900] : kind === 'van' ? [92, 420] : [86, 366];
  for (const x of wx) { g.fillStyle = 'rgb(24,24,28)'; g.beginPath(); g.arc(x, -wr, wr + 8, PI, TAU); g.fill(); }   // pasos de rueda
  wcTex(g, S.c.width, S.c.height, .15, .15);
  S.L = L; S.wr = wr; S.wx = right ? wx.map(x => L - x) : wx; return S;
}
const LANES = [
  { z: CA.LA, dir: 1, cars: [['sedan', [176, 46, 40], 0, 1180], ['taxi', [246, 196, 40], 1500, 1260], ['van', [236, 230, 218], 3100, 1000, 'molienda'], ['sedan', [170, 176, 184], 4600, 1150]] },
  { z: CA.LB, dir: -1, cars: [['bus', [60, 110, 150], 400, 820, 'kronotek'], ['taxi', [246, 196, 40], 2300, 1150], ['sedan', [52, 70, 104], 3500, 1080], ['van', [214, 220, 226], 4900, 960, 'nimbo']] },
];
function vehiclesPaint() { let k = 0; for (const Ln of LANES) for (const C of Ln.cars) C.S = paintVehicle(C[0], C[1], 600 + k++, C[4], Ln.dir > 0); for (const Ln of LANES) for (const C of Ln.cars) texShadeKeep(C.S, COOL, .22); }
const WRAP = 7200;
function vehicleAt(Ln, C, t) { const w0 = CAM.x - 3200, raw = C[2] + Ln.dir * C[3] * (t - 61.5); return { x: w0 + ((raw - w0) % WRAP + WRAP) % WRAP, z: Ln.z }; }
function vehicleDraw(Ln, C, t) {
  const S = C.S, P = vehicleAt(Ln, C, t), x0 = P.x - S.L / 2, flip = Ln.dir > 0, bob = Math.sin(t * 9 + C[2]) * .8;
  const sh = poly3([[P.x - S.L / 2, 14.5, P.z - 20], [P.x + S.L / 2, 14.5, P.z - 20], [P.x + S.L / 2 + 30, 14.5, P.z + 50], [P.x - S.L / 2 + 30, 14.5, P.z + 50]]); if (sh) { ctx.fillStyle = 'rgba(30,32,40,.4)'; ctx.fill(sh); }
  bill(S, x0, 15 + bob, P.z);
  const s = PS(P.z), rot = -Ln.dir * (t * C[3] / S.wr);
  for (const wx of S.wx) { const cxw = x0 + wx, c = PJ(cxw, 15 - S.wr, P.z), R_ = S.wr * s; ctx.fillStyle = 'rgb(28,28,32)'; ctx.beginPath(); ctx.arc(c[0], c[1], R_, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgb(150,154,162)'; ctx.beginPath(); ctx.arc(c[0], c[1], R_ * .55, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgb(80,84,92)'; ctx.lineWidth = Math.max(1, R_ * .12); for (let k = 0; k < 5; k++) { const a = rot + k * TAU / 5; ctx.beginPath(); ctx.moveTo(c[0], c[1]); ctx.lineTo(c[0] + Math.cos(a) * R_ * .5, c[1] + Math.sin(a) * R_ * .5); ctx.stroke(); } }
  /* estela de velocidad tenue detrás */
  ctx.strokeStyle = 'rgba(220,226,232,.25)'; ctx.lineWidth = Math.max(1, 2 * s); for (let k = 0; k < 3; k++) { const yy = -40 - k * 30, a = PJ(flip ? x0 : x0 + S.L, yy, P.z), b = PJ(flip ? x0 - 160 : x0 + S.L + 160, yy, P.z); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
}
/* ---------- alcantarillas (el único vapor de la calle) ---------- */
const MANHOLES = [{ x: 2300, z: 930, y: 14.5 }, { x: 7600, z: 1080, y: 14.5 }, { x: 6000, z: 590, y: -.4, walk: true }];
function manholeDraw(M) { const P = poly3(ellP(M.x, M.z, 38, 30, 22).map(([x, z]) => [x, M.y, z])); if (!P) return; ctx.fillStyle = 'rgb(52,50,50)'; ctx.fill(P); ctx.strokeStyle = 'rgb(110,106,100)'; ctx.lineWidth = Math.max(1, 2 * PS(M.z)); ctx.stroke(P);
  for (let k = -2; k <= 2; k++) { const a = PJ(M.x - 26, M.y - .2, M.z + k * 9), b = PJ(M.x + 26, M.y - .2, M.z + k * 9); ctx.strokeStyle = 'rgba(130,126,120,.7)'; ctx.lineWidth = Math.max(.6, PS(M.z)); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); } }
/* ---------- vecinos: caminan por la acera de enfrente; algunos esperan en la nuestra y miran pasar a Teo ---------- */
const WALKERS = Array.from({ length: 22 }, (_, i) => ({ id: NPCS[i % NPCS.length], x0: -1200 + i * 520 + hsh(i, 1) * 300, z: 1240 + hsh(i, 2) * 110, dir: hsh(i, 3) < .5 ? 1 : -1, v: 80 + hsh(i, 4) * 60 }));
const STANDERS = [{ id: 'carmen', x: 1900, z: 700 }, { id: 'mateo', x: 2050, z: 715 }, { id: 'anselmo', x: 4500, z: 705 }, { id: 'nora', x: 7000, z: 700 }, { id: 'ivan', x: 7150, z: 712 }, { id: 'lucia', x: 8450, z: 705 }];
function npcWalkDraw(N, t) { const x = N.x0 + N.dir * N.v * (t - 61.5); if (Math.abs(x - CAM.x) > 2600) return; const st = Math.floor(t / (.36 - N.v / 1000)) + N.x0; pxDraw(N.id, { legL: st % 2, legR: (st + 1) % 2, blink: (t * .4 + N.x0) % 1 < .05 }, x, Math.abs(Math.sin(t * 8 + N.x0)) * 1.5, N.z, { flip: N.dir < 0 }); }
function npcStandDraw(N, t, teoX) { if (Math.abs(N.x - CAM.x) > 2600) return; const d = teoX - N.x, near = Math.abs(d) < 260; pxShadow(N.id, N.x, N.z, 0, { a: .22 }); pxDraw(N.id, { wide: near, blink: !near && (t * .3 + N.x) % 1 < .05, happy: !near && d < -260 && d > -900 }, N.x, near ? 4 : 0, N.z, { flip: d < 0 }); }
/* ---------- objetos del bordillo (se desenfocan una vez) ---------- */
function paintMeter() { const S = spr([-20, -135, 20, 2], 3), g = S.g; g.fillStyle = 'rgb(60,64,70)'; g.fillRect(-3, -90, 6, 90); g.fillStyle = 'rgb(70,90,110)'; g.beginPath(); g.ellipse(0, -110, 14, 22, 0, 0, TAU); g.fill(); g.fillStyle = 'rgb(200,220,230)'; g.beginPath(); g.ellipse(0, -114, 9, 10, 0, 0, TAU); g.fill(); g.fillStyle = 'rgb(220,60,40)'; g.fillRect(-4, -116, 8, 3); marcaLogo(g, 'almagre', -5, -98, 10, { layout: 'emblema' }); return S; }
function paintHydrant() { const S = spr([-26, -80, 26, 2], 3), g = S.g, c = [196, 50, 40]; wcWash(g, [[-14, 0], [14, 0], [12, -52], [16, -56], [10, -66], [-10, -66], [-16, -56], [-12, -52]], c, .98, { reserve: false, mode: 'source-over', amt: .4, seed: 3, step: 6 }); g.fillStyle = cssc(shc(c, -.2)); g.fillRect(-22, -46, 44, 12); g.beginPath(); g.ellipse(0, -66, 10, 8, 0, PI, TAU); g.fill(); g.fillStyle = 'rgba(255,255,255,.3)'; g.fillRect(-9, -50, 4, 46); return S; }
function paintPole() { const S = spr([-60, -760, 60, 2], 1.2), g = S.g; const wd = g.createLinearGradient(-9, 0, 9, 0); wd.addColorStop(0, 'rgb(70,54,44)'); wd.addColorStop(.5, 'rgb(110,86,66)'); wd.addColorStop(1, 'rgb(60,46,38)'); g.fillStyle = wd; g.fillRect(-9, -740, 18, 740); g.fillStyle = 'rgb(50,44,40)'; g.fillRect(-55, -700, 110, 10); for (const x of [-45, -15, 15, 45]) { g.fillStyle = 'rgb(220,220,210)'; g.fillRect(x - 3, -712, 6, 12); } g.fillStyle = 'rgb(80,84,90)'; g.fillRect(-20, -620, 40, 50); return S; }
function paintSkyline() {
  const S = spr([-14000, -2600, 30000, 40], .1), g = S.g, r = mulberry32(17);
  let x = -14000; while (x < 30000) { const w = 300 + r() * 700, h = 600 + r() * 1900, c = mixc([150, 168, 188], [196, 206, 214], r() * .6); g.fillStyle = cssc(c); g.fillRect(x, -h, w, h + 40); g.fillStyle = cssc(shc(c, .12)); for (let y = -h + 40; y < -40; y += 70) for (let k = x + 30; k < x + w - 40; k += 60) if (r() < .5) g.fillRect(k, y, 30, 34); if (r() < .2) { g.fillStyle = cssc(c); g.fillRect(x + w * .45, -h - 300, 20, 300); } x += w + r() * 80; }
  return S;
}
function paintSkyCool() {
  const c = mk(1400, 900), g = c.getContext('2d'), r = mulberry32(23), gr = g.createLinearGradient(0, 0, 0, 900); gr.addColorStop(0, 'rgb(120,150,176)'); gr.addColorStop(.6, 'rgb(196,210,218)'); gr.addColorStop(1, 'rgb(226,226,220)'); g.fillStyle = gr; g.fillRect(0, 0, 1400, 900);
  for (let i = 0; i < 14; i++) wcWash(g, ellP(r() * 1400, 60 + r() * 400, 90 + r() * 200, 14 + r() * 20, 24), [236, 240, 244], .5, { reserve: false, mode: 'source-over', amt: 8, seed: i, edge: false });
  for (let i = 0; i < 8; i++) wcWash(g, ellP(r() * 1400, 120 + r() * 300, 120 + r() * 200, 20 + r() * 20, 24), [150, 164, 182], .3, { reserve: false, mode: 'source-over', amt: 10, seed: i + 50, edge: false });
  return { c };
}
function callePaint() {
  CAX.brickTile = matBrick(300, 240, { seed: 71, soot: 0, wash: .4, whitewash: false, d: .9 });
  CAX.sky = paintSkyCool(); CAX.skyline = paintSkyline();
  CAX.walk = matConcrete(1200, 1100, { seed: 31, c: [164, 168, 172] }); CAX.curb = matWash(1200, 18, [150, 152, 156], { seed: 4 });
  CAX.road = matAsphalt(1200, 420, { seed: 41, lineY: 205 }); CAX.curbF = matWash(1200, 18, [176, 178, 180], { seed: 5 });
  CAX.blds = []; const r = mulberry32(5); let x = CA.X0;
  const shops = ['bodega', 'laundry', 'door', 'shutter', 'bodega', 'door', 'laundry', 'shutter'];
  for (let i = 0; x < CA.END - 500; i++) { const w = 640 + r() * 300, h = 1100 + r() * 450, S = paintBuilding(100 + i, w, h, { shop: shops[i % shops.length] }); CAX.blds.push({ x, S }); x += w + (r() < .2 ? 40 : 0); }
  CAX.molienda = { x: CA.END - 680, S: paintMoliendaFront() };
  x = CA.END - 680 + 900; for (let i = 0; x < CA.X1; i++) { const w = 700, S = paintBuilding(300 + i, w, 1300); CAX.blds.push({ x, S }); x += w; }
  CAX.meter = sprBlur(paintMeter(), 6); CAX.hydrant = sprBlur(paintHydrant(), 6); CAX.pole = sprBlur(paintPole(), 2);
  for (const k of ['walk', 'curb', 'road', 'curbF']) texShade(CAX[k], COOL, .22);
  vehiclesPaint();
  for (const B of CAX.blds) texShadeKeep(B.S, COOL, .3);
}
/* ---------- charcos (en la acera, por donde corre Teo) ---------- */
const CPUD2 = []; { const add = (x, z, rx, rz) => CPUD2.push({ x, z, rx, rz, pts: wob(ellP(x, z, rx, rz, 26), Math.min(rx, rz) * .35, x * .1, .02, true, 12) }); add(1400, 640, 120, 26); add(3000, 570, 150, 34); add(4700, 650, 90, 20); add(7300, 600, 130, 30); add(8900, 640, 100, 24); }
const GRATE = { x: 6000, z: 590 };
function callePuddles(t, refl) {
  const P = new Path2D(); let n = 0;
  for (const D of CPUD2) { const c = PJ(D.x, 0, D.z); if (c[0] < -SW / 2 - 400 || c[0] > SW / 2 + 400) continue; const pts = D.pts.map(([x, z]) => PJ(x, 0, z)); P.moveTo(...pts[0]); for (const p of pts) P.lineTo(...p); P.closePath(); n++; }
  if (!n) return;
  ctx.save(); ctx.clip(P);
  const top = PJ(0, 0, CA.ZF)[1], gr = ctx.createLinearGradient(0, top, 0, 500); gr.addColorStop(0, 'rgb(150,166,180)'); gr.addColorStop(1, 'rgb(206,216,222)'); ctx.fillStyle = gr; ctx.fillRect(-SW, -500, SW * 2, 1000);
  for (const B of CAX.blds) billMirror(B.S, B.x, CA.ZF, .55);
  billMirror(CAX.molienda.S, CAX.molienda.x, CA.ZF, .6);
  if (refl) refl();
  ctx.restore();
  ctx.strokeStyle = 'rgba(60,64,70,.45)'; ctx.lineWidth = 1.6; ctx.stroke(P);
}
/* ---------- la calle en t ---------- */
function drawCalle(t, o = {}) {
  lightsBegin(); T0();
  /* cielo y ciudad lejana */
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(CAX.sky.c, (-CAM.x * .01 % 200) - 100, -40, W + 200, H * .8); ctx.restore(); T0();
  ctx.fillStyle = 'rgb(214,220,222)'; ctx.fillRect(-SW, PJ(0, 0, 9000)[1] - 10, SW * 2, 600);
  bill(CAX.skyline.S || CAX.skyline, 0, 0, 9000, { a: .85 });
  const hz = PJ(0, -400, 6000)[1]; const mist = ctx.createLinearGradient(0, hz - 200, 0, hz + 120); mist.addColorStop(0, 'rgba(220,226,230,0)'); mist.addColorStop(1, 'rgba(220,226,230,.85)'); ctx.fillStyle = mist; ctx.fillRect(-SW, hz - 200, SW * 2, 400);
  /* fachadas */
  for (const B of CAX.blds) bill(B.S, B.x, 0, CA.ZF);
  bill(CAX.molienda.S, CAX.molienda.x, 0, CA.ZF);
  /* luz cálida del escaparate de Molienda sobre la acera */
  const mg = PJ(CAX.molienda.x + 450, -150, CA.ZF); LGT(mg[0], mg[1], 520 * PS(CA.ZF), '255,190,110', .55);
  /* suelo: asfalto (delante), bordillo, acera */
  for (let k = Math.floor((CAM.x - 4000) / 1200); k * 1200 < CAM.x + 4000; k++) { const a = k * 1200, b = a + 1200; hplane(CAX.walk, a, b, CA.R1, CA.ZF, 0); hplane(CAX.road, a, b, CA.R0, CA.R1, 15); vplane(CAX.curbF, [a, CA.R1], [b, CA.R1], 0, 15); hplane(CAX.walk, a, b, 20, CA.R0, 0); }
  for (const M of MANHOLES) if (!M.walk) manholeDraw(M);
  callePuddles(t, o.refl);
  /* la tapa de registro de la acera (de ahí sale el vapor que cruza Teo) */
  manholeDraw(MANHOLES[2]);
  if (o.floorFx) o.floorFx(t);
  if (o.items) o.items(put, t);
  put(GRATE.z - 1, () => steamCols(t, { x: GRATE.x, y: 0, z: GRATE.z }, { n: 7, h: 260, w: 8, a: .4, sway: 26, spread: 30, drift: o.gust ? o.gust(t) : 0 }));
  for (const M of MANHOLES) if (!M.walk && Math.abs(M.x - CAM.x) < 3000) put(M.z - 1, () => steamCols(t, { x: M.x, y: M.y, z: M.z }, { n: 6, h: 300, w: 9, a: .38, sway: 30, spread: 26, drift: .25 }));
  /* tráfico y vecinos */
  for (const Ln of LANES) for (const C of Ln.cars) { const P = vehicleAt(Ln, C, t); if (Math.abs(P.x - CAM.x) < 2800) put(P.z + (Ln.dir > 0 ? .1 : .2), () => vehicleDraw(Ln, C, t)); }
  for (const N of WALKERS) put(N.z, () => npcWalkDraw(N, t));
  const tx = o.teoX ? o.teoX(t) : -1e5; for (const N of STANDERS) put(N.z, () => npcStandDraw(N, t, tx));
  /* primer plano del bordillo: parquímetros, bocas de incendio, postes y cables */
  for (let k = Math.floor((CAM.x - 1500) / 380); k * 380 < CAM.x + 1500; k++) { const x = k * 380 + 200; put(250, () => bill(hsh(k, 9) < .25 ? CAX.hydrant : CAX.meter, x, 0, 250)); }
  for (let k = Math.floor((CAM.x - 3000) / 1300); k * 1300 < CAM.x + 3000; k++) { const x = k * 1300 + 900; put(420, () => { bill(CAX.pole, x, 0, 420); }); }
  put(410, () => { ctx.save(); ctx.lineCap = 'round'; for (let k = Math.floor((CAM.x - 3000) / 1300); k * 1300 < CAM.x + 3000; k++) { const x0 = k * 1300 + 900, x1 = x0 + 1300; for (const [dy, sag] of [[-470, 210], [-450, 250], [-420, 290], [-480, 170]]) { const pts = []; for (let i = 0; i <= 24; i++) { const u = i / 24; pts.push(PJ(lerp(x0 + 9, x1 + 9, u), dy + sag * 4 * u * (1 - u), 420)); } ctx.strokeStyle = 'rgba(28,28,34,.9)'; ctx.lineWidth = Math.max(1, 1.5 * PS(420)); ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); } } ctx.restore(); });
  flush();
  if (o.fx) o.fx(t);
  lightsComp(0);
}
