/* =====================================================================
   ESCENA 4 · LAS DOS RECETAS (insertos a pantalla completa, en unidades de pantalla: alto 1000, origen al centro)
   A · la sartén de hierro: el corte cae, el aceite salta en microgotas que rebotan en el acero, humo; vuelta y vuelta;
       el coñac, la llamarada azul y naranja; el arroser: mantequilla que espuma y se tuesta, tomillo, ajo, la cuchara
       que baña la carne una y otra vez.
   B · el emplatado bajo las lámparas infrarrojas del pase: plato volcánico negro, lágrima de jugo que refleja las
       lámparas, láminas de carne, puntos de clorofila y azafrán, brotes y flores con pinzas, y la hoja de oro que
       tiembla con el aire acondicionado.
   ===================================================================== */
const RC = { drop: 216.6, flip: 221.4, pour: 226.3, ign: 227.55, butter: 233.2, baste: 234.4, endA: 244.0,
  plate: 256.4, tear: 259.6, slices: 262.6, green: 265.9, saff: 268.3, garn: 270.6, gold: 276.4, goldOff: 279.2, endB: 283.0 };
const RCX = {};
/* ---------- pintado una vez ---------- */
function rcPuff(col, n = 96) { const c = mk(n, n), g = c.getContext('2d'), gr = g.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2); gr.addColorStop(0, `rgba(${col},1)`); gr.addColorStop(.45, `rgba(${col},.45)`); gr.addColorStop(1, `rgba(${col},0)`); g.fillStyle = gr; g.fillRect(0, 0, n, n); return c; }
function rcSteak(crust) {   /* la cara de arriba del corte, en una caja de 440×240 px (elipse inscrita) */
  const w = 440, h = 240, c = mk(w, h), g = c.getContext('2d'), r = mulberry32(crust ? 501 : 502);
  g.fillStyle = crust ? 'rgb(104,52,24)' : 'rgb(176,48,54)'; g.fillRect(0, 0, w, h);
  if (!crust) { for (let k = 0; k < 220; k++) { g.strokeStyle = `rgba(${240 - r() * 20},${196 + r() * 30},${196 + r() * 20},${.15 + r() * .35})`; g.lineWidth = .6 + r() * 1.8; g.beginPath(); let x = r() * w, y = r() * h; g.moveTo(x, y); for (let j = 0; j < 5; j++) { x += (r() - .5) * 30; y += (r() - .5) * 14; g.lineTo(x, y); } g.stroke(); }
    for (let k = 0; k < 60; k++) { g.fillStyle = `rgba(120,20,30,${r() * .3})`; g.beginPath(); g.ellipse(r() * w, r() * h, 8 + r() * 30, 4 + r() * 12, r() * 3, 0, TAU); g.fill(); }
    const fat = g.createLinearGradient(0, 0, 0, 40); fat.addColorStop(0, 'rgba(244,228,206,1)'); fat.addColorStop(1, 'rgba(244,228,206,0)'); g.fillStyle = fat; g.fillRect(0, 0, w, 40); }
  else { for (let k = 0; k < 900; k++) { const d = r(); g.fillStyle = d < .45 ? `rgba(54,24,10,${.2 + r() * .5})` : d < .85 ? `rgba(160,92,40,${.2 + r() * .4})` : `rgba(255,236,200,${.3 + r() * .5})`; const s = d < .85 ? 2 + r() * 9 : .8 + r() * 1.6; g.beginPath(); g.ellipse(r() * w, r() * h, s, s * (.4 + r() * .6), r() * 3, 0, TAU); g.fill(); }
    for (let k = 0; k < 6; k++) { g.strokeStyle = 'rgba(50,22,10,.35)'; g.lineWidth = 6; g.beginPath(); g.moveTo(0, 30 + k * 36); g.lineTo(w, 50 + k * 36); g.stroke(); }   // marcas de la parrilla de hierro (rejilla)
    const fat = g.createLinearGradient(0, 0, 0, 40); fat.addColorStop(0, 'rgba(226,170,96,1)'); fat.addColorStop(1, 'rgba(226,170,96,0)'); g.fillStyle = fat; g.fillRect(0, 0, w, 40); }
  const v = g.createRadialGradient(w / 2, h / 2, h * .2, w / 2, h / 2, w * .55); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, crust ? 'rgba(30,12,4,.6)' : 'rgba(90,10,20,.35)'); g.fillStyle = v; g.fillRect(0, 0, w, h);
  return c; }
const STK = (() => { const o = []; for (let i = 0; i < 44; i++) { const a = i / 44 * TAU, k = 1 + .07 * Math.sin(3 * a + 1) + .05 * Math.sin(5 * a + 2) + .03 * Math.sin(7 * a); o.push([Math.cos(a) * k, Math.sin(a) * k]); } return o; })();
function rcPlate() {   /* plato de piedra volcánica: poros, borde de esmalte irregular */
  const n = 720, c = mk(n, n), g = c.getContext('2d'), r = mulberry32(503), R = n / 2 - 4;
  g.save(); g.beginPath(); g.arc(n / 2, n / 2, R, 0, TAU); g.clip();
  const gr = g.createRadialGradient(n / 2 - 60, n / 2 - 80, 20, n / 2, n / 2, R); gr.addColorStop(0, 'rgb(52,50,52)'); gr.addColorStop(.75, 'rgb(30,30,32)'); gr.addColorStop(.92, 'rgb(40,38,40)'); gr.addColorStop(1, 'rgb(70,66,66)'); g.fillStyle = gr; g.fillRect(0, 0, n, n);
  for (let k = 0; k < 5000; k++) { const x = r() * n, y = r() * n, s = .4 + r() * 1.6; g.fillStyle = r() < .55 ? `rgba(0,0,0,${.3 + r() * .5})` : `rgba(120,116,116,${.15 + r() * .3})`; g.beginPath(); g.arc(x, y, s, 0, TAU); g.fill(); }
  for (let k = 0; k < 260; k++) { const x = r() * n, y = r() * n, s = 1.4 + r() * 2.6; g.fillStyle = 'rgba(8,8,8,.85)'; g.beginPath(); g.arc(x, y, s, 0, TAU); g.fill(); g.strokeStyle = 'rgba(120,116,112,.35)'; g.lineWidth = .7; g.beginPath(); g.arc(x - .4, y - .4, s, PI * .9, PI * 1.6); g.stroke(); }
  g.restore();
  g.lineWidth = 7; g.strokeStyle = 'rgba(96,92,90,.8)'; g.beginPath(); for (let i = 0; i <= 120; i++) { const a = i / 120 * TAU, rr = R - 8 - Math.abs(Math.sin(a * 7) * Math.sin(a * 3)) * 9; i ? g.lineTo(n / 2 + Math.cos(a) * rr, n / 2 + Math.sin(a) * rr) : g.moveTo(n / 2 + Math.cos(a) * rr, n / 2 + Math.sin(a) * rr); } g.stroke();
  g.lineWidth = 3; g.strokeStyle = 'rgba(16,16,16,.9)'; g.beginPath(); g.arc(n / 2, n / 2, R - 1, 0, TAU); g.stroke();
  return c; }
function rcSlice(seed) {   /* lámina de carne vista desde el corte: costra, gris fino, rosado al centro */
  const w = 240, h = 110, c = mk(w, h), g = c.getContext('2d'), r = mulberry32(seed);
  const P = new Path2D(); P.moveTo(10, 30); P.bezierCurveTo(60, 4, 180, 2, 232, 26); P.bezierCurveTo(240, 60, 226, 96, 196, 104); P.bezierCurveTo(130, 110, 50, 106, 16, 90); P.bezierCurveTo(2, 70, 4, 44, 10, 30); P.closePath();
  g.fillStyle = 'rgb(78,36,16)'; g.fill(P); g.save(); g.clip(P);
  g.fillStyle = 'rgb(150,96,78)'; g.beginPath(); g.ellipse(w / 2, h / 2 + 2, w * .46, h * .38, -.03, 0, TAU); g.fill();
  const gr = g.createRadialGradient(w / 2, h / 2, 4, w / 2, h / 2, w * .42); gr.addColorStop(0, 'rgb(214,74,90)'); gr.addColorStop(.6, 'rgb(222,110,114)'); gr.addColorStop(1, 'rgba(200,120,110,.0)'); g.fillStyle = gr; g.beginPath(); g.ellipse(w / 2, h / 2 + 2, w * .43, h * .34, -.03, 0, TAU); g.fill();
  for (let k = 0; k < 40; k++) { g.strokeStyle = `rgba(250,220,220,${r() * .35})`; g.lineWidth = .6 + r(); g.beginPath(); const x = 30 + r() * 180, y = 25 + r() * 60; g.moveTo(x, y); g.quadraticCurveTo(x + 10, y + (r() - .5) * 10, x + 20 + r() * 20, y + (r() - .5) * 8); g.stroke(); }
  for (let k = 0; k < 30; k++) { g.fillStyle = 'rgba(255,255,255,.55)'; g.fillRect(40 + r() * 160, 30 + r() * 50, 1.4, 1.4); }   // jugo brillante
  g.restore(); g.strokeStyle = 'rgba(40,16,6,.8)'; g.lineWidth = 2; g.stroke(P);
  return c; }
function rcGarnish(type, seed) { const n = 90, c = mk(n, n), g = c.getContext('2d'), r = mulberry32(seed), cx = n / 2, cy = n / 2;
  if (type === 'sprig') { g.strokeStyle = 'rgb(150,200,110)'; g.lineWidth = 2; g.beginPath(); g.moveTo(cx - 20, cy + 26); g.quadraticCurveTo(cx - 4, cy + 6, cx + 6, cy - 14); g.stroke();
    for (const [x, y, a, s] of [[cx + 6, cy - 14, -.6, 1], [cx + 2, cy - 12, -2.4, .9], [cx - 6, cy + 4, -1.9, .7], [cx - 2, cy + 2, .2, .75]]) { g.save(); g.translate(x, y); g.rotate(a); const gr = g.createLinearGradient(0, -6, 0, 6); gr.addColorStop(0, 'rgb(150,214,90)'); gr.addColorStop(1, 'rgb(70,140,50)'); g.fillStyle = gr; g.beginPath(); g.ellipse(14 * s, 0, 15 * s, 7 * s, 0, 0, TAU); g.fill(); g.strokeStyle = 'rgba(40,90,30,.6)'; g.lineWidth = .8; g.beginPath(); g.moveTo(2, 0); g.lineTo(26 * s, 0); g.stroke(); g.restore(); } }
  else if (type === 'viola' || type === 'blossom') { const N = 5, col = type === 'viola' ? [[120, 60, 170], [70, 30, 120]] : [[252, 250, 244], [220, 214, 220]], rad = type === 'viola' ? 16 : 11;
    for (let k = 0; k < N; k++) { const a = k / N * TAU + r() * .3; g.save(); g.translate(cx, cy); g.rotate(a); const gr = g.createRadialGradient(0, rad, 1, 0, rad, rad * 1.1); gr.addColorStop(0, cssc(col[0])); gr.addColorStop(1, cssc(col[1])); g.fillStyle = gr; g.beginPath(); g.ellipse(0, rad, rad * .75, rad, 0, 0, TAU); g.fill();
      if (type === 'viola' && k > 1) { g.strokeStyle = 'rgba(30,10,50,.7)'; g.lineWidth = .8; for (let j = -1; j <= 1; j++) { g.beginPath(); g.moveTo(0, 3); g.lineTo(j * 4, rad * .9); g.stroke(); } } g.restore(); }
    g.fillStyle = type === 'viola' ? 'rgb(250,210,40)' : 'rgb(240,200,80)'; g.beginPath(); g.arc(cx, cy, type === 'viola' ? 5 : 3.5, 0, TAU); g.fill(); }
  else { const gr = g.createRadialGradient(cx - 6, cy - 6, 2, cx, cy, 22); gr.addColorStop(0, 'rgb(150,206,100)'); gr.addColorStop(1, 'rgb(64,130,56)'); g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, 20, 0, TAU); g.fill(); g.strokeStyle = 'rgba(220,250,200,.6)'; g.lineWidth = .9; for (let k = 0; k < 7; k++) { const a = k / 7 * TAU; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a) * 18, cy + Math.sin(a) * 18); g.stroke(); } }
  return c; }
function rcPaper() { const w = 520, h = 900, c = mk(w, h), g = c.getContext('2d'), r = mulberry32(504); g.fillStyle = 'rgb(232,234,232)'; g.fillRect(0, 0, w, h); for (let k = 0; k < 400; k++) { g.strokeStyle = `rgba(${r() < .5 ? '255,255,255' : '170,176,180'},${.2 + r() * .3})`; g.lineWidth = .8 + r() * 1.5; g.beginPath(); const x = r() * w, y = r() * h; g.moveTo(x, y); g.lineTo(x + (r() - .5) * 60, y + (r() - .5) * 20); g.stroke(); } for (let k = 0; k < 18; k++) { g.fillStyle = 'rgba(160,170,176,.12)'; g.beginPath(); g.ellipse(r() * w, r() * h, 40 + r() * 80, 20 + r() * 50, r() * 3, 0, TAU); g.fill(); } return c; }
function rcBox(seed) {   /* caja de acrílico con brotes y flores sobre papel húmedo */
  const w = 300, h = 220, c = mk(w, h), g = c.getContext('2d'), r = mulberry32(seed);
  g.fillStyle = 'rgba(236,244,246,.35)'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(214,224,222,.9)'; g.fillRect(10, 10, w - 20, h - 20);
  for (let k = 0; k < 70; k++) { const t = r(), x = 20 + r() * (w - 40), y = 20 + r() * (h - 40); const sp = RCX.garn ? RCX.garn[(t < .55 ? 0 : t < .75 ? 1 : t < .9 ? 2 : 3)] : null; if (sp) g.drawImage(sp, x - 26, y - 26, 52, 52); }
  g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 4; g.strokeRect(2, 2, w - 4, h - 4); g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(6, 6, w - 12, 10);
  return c; }
function recetasPaint() {
  RCX.smoke = rcPuff('200,198,204'); RCX.steam = rcPuff('255,255,255'); RCX.glow = rcPuff('255,170,90');
  RCX.raw = rcSteak(false); RCX.crust = rcSteak(true); RCX.plate = rcPlate();
  RCX.slices = [0, 1, 2, 3, 4].map(k => rcSlice(520 + k));
  RCX.garn = [rcGarnish('sprig', 530), rcGarnish('viola', 531), rcGarnish('blossom', 532), rcGarnish('leaf', 533), rcGarnish('sprig', 534)];
  RCX.paper = rcPaper(); RCX.boxes = [rcBox(540), rcBox(541)];
  RCX.steel = matSteel(1800, 1000, { seed: 545, c: [70, 72, 80], bands: [[.4, .1, .3]] }); RCX.passSteel = matSteel(1800, 1000, { seed: 546, c: [176, 180, 188], bands: [[.3, .08, .4], [.75, .05, .3]] });
}
/* ---------- utilidades de inserto ---------- */
function insBg(T, k = 1) { ctx.drawImage(T.c, -SW / 2, -500, SW, 1000); if (k < 1) { ctx.fillStyle = `rgba(0,0,0,${1 - k})`; ctx.fillRect(-SW / 2, -500, SW, 1000); } }
function puffAt(img, x, y, r, a) { if (a <= .003) return; ctx.globalAlpha = a; ctx.drawImage(img, x - r, y - r, r * 2, r * 2); ctx.globalAlpha = 1; }
function smokeWisps(t, cx, cy, w, amp, img = RCX.smoke, n = 30, rise = 700) { if (amp < .01) return; for (let i = 0; i < n; i++) { const P = 2.2 + hsh(i, 1) * 1.4, a = ((t + hsh(i, 2) * P) % P) / P, x = cx + (hsh(i, 3) - .5) * w + Math.sin(a * 4 + i) * 60 * a, y = cy - a * rise; puffAt(img, x, y, 40 + a * 230, amp * .2 * Math.sin(a * PI)); } }
/* pinzas largas de acero: punta en (x, y), entran desde el ángulo a; open 0–1 */
function tweezers(x, y, a, open = 0) { const L = 1100, d = [Math.cos(a), Math.sin(a)], nrm = [-d[1], d[0]], gap = 6 + open * 16;
  for (const sg of [-1, 1]) { const bx = x + nrm[0] * sg * gap * .5, by = y + nrm[1] * sg * gap * .5, ex = x + d[0] * L + nrm[0] * sg * 26, ey = y + d[1] * L + nrm[1] * sg * 26;
    const gr = ctx.createLinearGradient(bx + nrm[0] * 6, by + nrm[1] * 6, bx - nrm[0] * 6, by - nrm[1] * 6); gr.addColorStop(0, 'rgb(120,124,132)'); gr.addColorStop(.5, 'rgb(240,242,246)'); gr.addColorStop(1, 'rgb(110,114,122)');
    ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(bx - nrm[0] * 2, by - nrm[1] * 2); ctx.lineTo(bx + nrm[0] * 2, by + nrm[1] * 2); ctx.lineTo(ex + nrm[0] * 7, ey + nrm[1] * 7); ctx.lineTo(ex - nrm[0] * 7, ey - nrm[1] * 7); ctx.fill(); } }
/* Teo se asoma por el borde del inserto (pixel grande) */
function teoPeek(f, side = 1, show = 18, flip) { const c = elencoCanvas('teo', f), cell = Math.max(2, Math.round(H / 95)), fx = side > 0 ? W - 150 * (H / 1000) : 150 * (H / 1000), fy = H + (c.height - show) * cell; pxBlit(c, fx, fy, cell, { flip: flip ?? side > 0 }); }
/* ---------- A · la sartén ---------- */
const PAN = { x: 30, y: 90, rx: 560, ry: 270, wall: 70 };
function flameAmp(t) { if (t < RC.ign) return 0; const a = t - RC.ign; return a < .25 ? eio(a / .25) : Math.exp(-(a - .25) * .45); }
function sizzle(t) { if (t < RC.drop) return 0; let k = .55 + 1.4 * Math.exp(-(t - RC.drop) * 1.4); if (t > RC.flip + .5) k += 1.2 * Math.exp(-(t - RC.flip - .5) * 1.6); if (t > RC.butter) k = .35 + .2 * Math.sin(t * 3); return k; }
function steakPose(t) {   /* centro, escala, cara de arriba, volteo */
  const cx = PAN.x - 60, cy = PAN.y - 6; let y = cy, k = 1, sy = 1, top = 'raw', rot = -.06;
  if (t < RC.drop) { const u = clamp((t - (RC.drop - .4)) / .4); y = lerp(-900, cy, u * u); k = lerp(1.35, 1, u); }
  else if (t < RC.drop + .2) { const u = (t - RC.drop) / .2; sy = 1 - .12 * Math.sin(u * PI); }
  if (t >= RC.flip && t < RC.flip + .6) { const u = (t - RC.flip) / .6; y -= hop(u, 220); sy = Math.cos(u * PI); rot += Math.sin(u * PI) * .25; }
  if (t >= RC.flip + .3) top = 'crust';
  return { x: cx, y, k, sy, top, rot };
}
function drawSteak(S, t, sear, gloss = 0) {
  const rx = 225 * S.k, ry = 112 * S.k * Math.abs(S.sy), th = 46 * S.k * (.4 + .6 * Math.abs(S.sy)), img = S.top === 'crust' ? RCX.crust : RCX.raw;
  ctx.save(); ctx.translate(S.x, S.y); ctx.rotate(S.rot);
  const shape = (dy = 0) => { ctx.beginPath(); STK.forEach(([a, b], i) => i ? ctx.lineTo(a * rx, b * ry + dy) : ctx.moveTo(a * rx, b * ry + dy)); ctx.closePath(); };
  /* canto: costra abajo según el sellado, rosado arriba */
  shape(th); const sg = ctx.createLinearGradient(0, -ry, 0, ry + th); sg.addColorStop(0, S.top === 'crust' ? 'rgb(110,54,24)' : 'rgb(170,60,60)'); sg.addColorStop(.55, 'rgb(196,90,90)'); sg.addColorStop(1, cssc(mixc([186, 74, 70], [70, 32, 14], clamp(sear)))); ctx.fillStyle = sg; ctx.fill();
  ctx.fillStyle = sg; for (let k = 1; k < 6; k++) { shape(th * k / 6); ctx.fill(); }
  shape(); ctx.save(); ctx.clip(); ctx.drawImage(img, -rx, -ry, rx * 2, ry * 2);
  if (gloss > 0) { ctx.globalCompositeOperation = 'screen'; for (let i = 0; i < 14; i++) { const x = (hsh(i, 1) - .5) * rx * 1.5, y = (hsh(i, 2) - .5) * ry * 1.3; ctx.fillStyle = `rgba(255,200,120,${gloss * (.16 + .14 * Math.sin(t * 5 + i))})`; ctx.beginPath(); ctx.ellipse(x, y, 20 + hsh(i, 3) * 34, 2 + hsh(i, 4) * 3, -.15, 0, TAU); ctx.fill(); } }
  ctx.restore(); ctx.strokeStyle = 'rgba(40,14,6,.6)'; ctx.lineWidth = 2; shape(); ctx.stroke();
  ctx.restore();
}
/* microgotas de aceite: saltan del borde de la carne, caen y rebotan en el hierro */
function oilPop(t, S, amp) {
  if (amp < .02) return; const g = 2600, N = 110; ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < N; i++) { const P = .55 + hsh(i, 1) * .9, tt = t + hsh(i, 2) * P, cyc = Math.floor(tt / P), a = tt - cyc * P; if (hsh(i + cyc * 13.1, 5) > amp * .55) continue;
    const r1 = hsh(i + cyc * 7.3, 3), ang = r1 * TAU, ox = S.x + Math.cos(ang) * 230 * 1.02, oy = S.y + Math.sin(ang) * 115 * 1.02, sp = 140 + hsh(i + cyc, 4) * 420, vx = Math.cos(ang) * sp * (.6 + hsh(i, 9) * .6), vy = -(320 + hsh(i + cyc * 3.3, 6) * 760), yl = oy + 14 + hsh(i + cyc, 7) * 70;
    const tl = (-vy + Math.sqrt(vy * vy + 2 * g * (yl - oy))) / g; let x, y, vxx, vyy, alive = 1;
    if (a < tl) { x = ox + vx * a; y = oy + vy * a + g * a * a / 2; vxx = vx; vyy = vy + g * a; }
    else { const b = a - tl, v2 = -(vy + g * tl) * .3, h2 = 2 * -v2 / g; if (b > h2 + .25) continue; const bb = Math.min(b, h2); x = ox + vx * tl + vx * .45 * bb; y = yl + v2 * bb + g * bb * bb / 2; vxx = vx * .45; vyy = v2 + g * bb; alive = b > h2 ? 1 - (b - h2) / .25 : 1; }
    const s = 2.2 + hsh(i, 8) * 3.2, al = .85 * alive; ctx.strokeStyle = `rgba(255,232,180,${al * .6})`; ctx.lineWidth = s * .8; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - vxx * .018, y - vyy * .018); ctx.stroke(); ctx.fillStyle = `rgba(255,248,226,${al})`; ctx.beginPath(); ctx.arc(x, y, s * .6, 0, TAU); ctx.fill(); }
  ctx.restore();
}
function panBody(t, tilt, inner) {   /* la sartén de hierro fundido; inner() dibuja lo de dentro con el recorte del fondo */
  const { x, y, rx, ry, wall } = PAN;
  ctx.save(); ctx.translate(x, y); ctx.rotate(tilt); ctx.translate(-x, -y);
  /* mango */
  ctx.fillStyle = 'rgb(30,30,32)'; ctx.beginPath(); ctx.moveTo(x + rx - 30, y - 34); ctx.lineTo(x + rx + 520, y - 100); ctx.lineTo(x + rx + 540, y - 30); ctx.lineTo(x + rx - 20, y + 40); ctx.fill(); ctx.fillStyle = 'rgba(160,160,170,.25)'; ctx.fillRect(x + rx + 40, y - 70, 380, 6);
  /* cuerpo exterior y pared */
  const wg = ctx.createLinearGradient(x - rx, 0, x + rx, 0); wg.addColorStop(0, 'rgb(58,58,62)'); wg.addColorStop(.3, 'rgb(30,30,32)'); wg.addColorStop(1, 'rgb(20,20,22)');
  ctx.fillStyle = wg; ctx.beginPath(); ctx.ellipse(x, y + wall, rx, ry, 0, 0, PI); ctx.lineTo(x - rx, y); ctx.ellipse(x, y, rx, ry, 0, PI, 0, true); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgb(34,34,38)'; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(150,150,160,.35)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(x, y, rx - 3, ry - 2, 0, PI * 1.05, PI * 1.6); ctx.stroke();
  /* fondo con aceite */
  const ix = rx - 34, iy = ry - 18, fg = ctx.createRadialGradient(x - 80, y - 40, 20, x, y, ix); fg.addColorStop(0, 'rgb(40,36,30)'); fg.addColorStop(1, 'rgb(16,16,18)');
  ctx.save(); ctx.beginPath(); ctx.ellipse(x, y + 8, ix, iy, 0, 0, TAU); ctx.clip(); ctx.fillStyle = fg; ctx.fillRect(x - rx, y - ry, rx * 2, ry * 2);
  ctx.globalCompositeOperation = 'screen'; for (let i = 0; i < 9; i++) { const a = hsh(i, 1) * TAU, px = x + Math.cos(a) * ix * .7, py = y + Math.sin(a) * iy * .7; ctx.strokeStyle = `rgba(255,220,160,${.12 + .1 * Math.sin(t * 4 + i * 2)})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(px, py, 40 + hsh(i, 2) * 60, 8, a, 0, PI * .8); ctx.stroke(); }
  ctx.globalCompositeOperation = 'source-over'; if (inner) inner();
  ctx.restore();
  ctx.restore();
}
function burnerUnder(t, k) {   /* corona azul que asoma por delante de la sartén */
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 26; i++) { const a = lerp(.15, PI - .15, i / 25), bx = PAN.x + Math.cos(a) * (PAN.rx * .74), by = PAN.y + PAN.wall + Math.sin(a) * PAN.ry * .74 + 40, h = (40 + 26 * Math.sin(t * 19 + i * 2.1)) * k, gr = ctx.createLinearGradient(0, by, 0, by - h);
    gr.addColorStop(0, 'rgba(90,140,255,.9)'); gr.addColorStop(.7, 'rgba(60,90,255,.4)'); gr.addColorStop(1, 'rgba(255,180,120,0)'); ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(bx - 12, by); ctx.quadraticCurveTo(bx, by - h * 1.3, bx + 12, by); ctx.fill(); }
  ctx.restore(); }
function flameField(t, amp, cx, cy, w, h0, n = 60) {   /* llamarada: lenguas azules en la base, naranja y amarillo arriba */
  if (amp < .01) return; ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) { const bx = cx + (hsh(i, 1) - .5) * w, by = cy + (hsh(i, 2) - .5) * w * .3, fl = .75 + .25 * Math.sin(t * 11 + i * 1.7) + .1 * Math.sin(t * 23 + i), h = amp * h0 * (.45 + hsh(i, 3)) * fl, ww = (40 + hsh(i, 4) * 70) * (h0 / 700), sw = Math.sin(t * 7 + i) * 40 * (h0 / 700);
    const gr = ctx.createLinearGradient(0, by, 0, by - h); gr.addColorStop(0, `rgba(70,110,255,${.5 * amp})`); gr.addColorStop(.16, `rgba(255,110,30,${.36 * amp})`); gr.addColorStop(.55, `rgba(255,190,70,${.24 * amp})`); gr.addColorStop(1, 'rgba(255,240,180,0)');
    ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(bx - ww / 2, by); ctx.quadraticCurveTo(bx - ww * .7 + sw, by - h * .5, bx + sw * 1.5, by - h); ctx.quadraticCurveTo(bx + ww * .7 + sw, by - h * .5, bx + ww / 2, by); ctx.fill(); }
  ctx.restore(); }
function butterPool(t) {   /* espuma de mantequilla: rubia → avellana; burbujas que crecen y revientan, tomillo y ajo */
  const cx = PAN.x - 290, cy = PAN.y + 140, rx = 300, ry = 104, k = seg(t, RC.butter, RC.endA - 1), m = seg(t, RC.butter, RC.butter + 1.4);
  if (m <= 0) return; const col = mixc([250, 210, 100], [190, 112, 40], k);
  ctx.save(); ctx.beginPath(); ctx.ellipse(cx, cy, rx * (.4 + .6 * m), ry * (.4 + .6 * m), -.05, 0, TAU); ctx.clip();
  const gr = ctx.createRadialGradient(cx, cy, 10, cx, cy, rx); gr.addColorStop(0, cssc(shc(col, .1))); gr.addColorStop(1, cssc(shc(col, -.2))); ctx.fillStyle = gr; ctx.fillRect(cx - rx, cy - ry, rx * 2, ry * 2);
  for (let i = 0; i < 70 * k; i++) { ctx.fillStyle = 'rgba(110,60,20,.6)'; ctx.fillRect(cx + (hsh(i, 11) - .5) * rx * 1.8, cy + (hsh(i, 12) - .5) * ry * 1.6, 2.4, 2.4); }   // sólidos de leche tostados
  for (let i = 0; i < 180; i++) { const P = .35 + hsh(i, 1) * .8, a = ((t + hsh(i, 2) * P) % P) / P, bx = cx + (hsh(i, 3) - .5) * rx * 1.8, by = cy + (hsh(i, 4) - .5) * ry * 1.6, r = (2.5 + hsh(i, 5) * 11) * Math.sin(a * PI * .5) * m;
    ctx.fillStyle = cssc(shc(col, .25), .55); ctx.beginPath(); ctx.arc(bx, by, r, 0, TAU); ctx.fill(); ctx.strokeStyle = `rgba(255,250,232,${.75 * (1 - a * .4)})`; ctx.lineWidth = 1.1; ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.fillRect(bx - r * .45, by - r * .5, Math.max(1, r * .25), Math.max(1, r * .25));
    if (a > .94) { ctx.strokeStyle = 'rgba(255,250,232,.7)'; for (let j = 0; j < 4; j++) { const aa = j * PI / 2 + i; ctx.beginPath(); ctx.moveTo(bx + Math.cos(aa) * r, by + Math.sin(aa) * r); ctx.lineTo(bx + Math.cos(aa) * r * 1.8, by + Math.sin(aa) * r * 1.8); ctx.stroke(); } } }
  ctx.restore();
  if (t < RC.butter + 1.4) { const u = seg(t, RC.butter - .35, RC.butter), s = 70 * (1 - m * .8); ctx.fillStyle = 'rgb(252,236,170)'; ctx.fillRect(cx - s / 2, lerp(-700, cy - s * .6, u * u), s, s * .7); }   // el trozo de mantequilla que cae y se funde
  if (t > RC.butter + .4) { for (const [dx, dy, a] of [[-120, -10, .4], [60, 16, -.3]]) { ctx.save(); ctx.translate(cx + dx, cy + dy); ctx.rotate(a + Math.sin(t * 2) * .03); ctx.strokeStyle = 'rgb(70,96,50)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-60, 0); ctx.lineTo(60, 0); ctx.stroke(); for (let j = 0; j < 9; j++) { ctx.fillStyle = 'rgb(90,120,60)'; ctx.beginPath(); ctx.ellipse(-52 + j * 13, (j % 2 ? -6 : 6), 7, 3, j % 2 ? -.6 : .6, 0, TAU); ctx.fill(); } ctx.restore(); }
    for (const [dx, dy] of [[-30, -24], [110, -8]]) { ctx.fillStyle = 'rgb(236,214,170)'; ctx.beginPath(); ctx.ellipse(cx + dx, cy + dy, 24, 15, .4, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(150,110,60,.7)'; ctx.lineWidth = 2; ctx.stroke(); } }
}
function spoonBaste(t, S) {   /* la cuchara: hunde en la espuma, sube, baña la carne, vuelve */
  if (t < RC.baste) return 0; const P = 1.15, u = ((t - RC.baste) % P) / P, pool = [PAN.x - 300, PAN.y + 150], over = [S.x + 30, S.y - 120];
  let p, tilt = 0, full = 0;
  if (u < .25) { p = pool; full = u / .25; } else if (u < .5) { const v = eio((u - .25) / .25); p = [lerp(pool[0], over[0], v), lerp(pool[1], over[1], v) - Math.sin(v * PI) * 80]; full = 1; } else if (u < .82) { p = over; tilt = (u - .5) / .32; full = 1 - tilt; } else { const v = eio((u - .82) / .18); p = [lerp(over[0], pool[0], v), lerp(over[1], pool[1], v)]; }
  if (u > .52 && u < .84) for (let k = 0; k < 10; k++) { const ph = ((t * 5 + k / 10) % 1), x = p[0] + 40 + Math.sin(k * 3) * 10, y = p[1] + 10 + ph * 120; ctx.fillStyle = `rgba(214,160,80,${.85 * (1 - ph)})`; ctx.beginPath(); ctx.ellipse(x, y, 6, 9, 0, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,250,230,.8)'; ctx.fillRect(x - 2, y - 4, 2, 3); }
  ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(-.5 + tilt * .9);
  const hg = ctx.createLinearGradient(0, -8, 0, 8); hg.addColorStop(0, 'rgb(140,144,152)'); hg.addColorStop(.5, 'rgb(244,246,250)'); hg.addColorStop(1, 'rgb(120,124,132)'); ctx.fillStyle = hg; ctx.beginPath(); ctx.moveTo(-40, -7); ctx.lineTo(-900, -26); ctx.lineTo(-900, 4); ctx.lineTo(-40, 7); ctx.fill();
  const bg = ctx.createRadialGradient(10, -10, 4, 0, 0, 70); bg.addColorStop(0, 'rgb(250,252,255)'); bg.addColorStop(.6, 'rgb(170,174,182)'); bg.addColorStop(1, 'rgb(96,100,108)'); ctx.fillStyle = bg; ctx.beginPath(); ctx.ellipse(10, 0, 70, 40, 0, 0, TAU); ctx.fill();
  if (full > .05) { ctx.fillStyle = `rgba(206,150,74,${.9 * full})`; ctx.beginPath(); ctx.ellipse(12, 2, 56 * full, 28 * full, 0, 0, TAU); ctx.fill(); for (let k = 0; k < 6; k++) { ctx.strokeStyle = 'rgba(255,248,226,.8)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(-20 + k * 12, -4 + (k % 2) * 8, 3 + (k % 3), 0, TAU); ctx.stroke(); } }
  ctx.restore(); return u > .52 && u < .84 ? 1 : 0;
}
function bottlePour(t) {   /* el coñac: la botella entra, chorro ámbar que tiembla, salpica */
  const u0 = seg(t, RC.pour - .4, RC.pour), u1 = seg(t, RC.ign - .3, RC.ign + .1); if (u0 <= 0 || u1 >= 1) return; const k = eio(u0) * (1 - eio(u1)), nx = lerp(-1100, -260, k), ny = lerp(-760, -360, k), pour = t > RC.pour && t < RC.ign - .2;
  if (pour) { const ex = PAN.x - 80, ey = PAN.y - 10; ctx.strokeStyle = 'rgba(214,130,40,.85)'; ctx.lineWidth = 11; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(nx + 20, ny + 10); ctx.bezierCurveTo(nx + 90, ny + 60, ex - 40 + Math.sin(t * 30) * 6, ey - 200, ex, ey); ctx.stroke(); ctx.strokeStyle = 'rgba(255,230,170,.7)'; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 12; i++) { const ph = (t * 4 + i / 12) % 1, a = hsh(i, 1) * PI; ctx.fillStyle = `rgba(255,200,120,${1 - ph})`; ctx.beginPath(); ctx.arc(ex + Math.cos(a) * ph * 90, ey - Math.sin(a) * ph * 70 + ph * ph * 60, 3, 0, TAU); ctx.fill(); } ctx.restore(); }
  ctx.save(); ctx.translate(nx, ny); ctx.rotate(2.35); const bg = ctx.createLinearGradient(0, -60, 0, 60); bg.addColorStop(0, 'rgba(90,40,14,.95)'); bg.addColorStop(.4, 'rgba(180,96,30,.95)'); bg.addColorStop(1, 'rgba(60,24,8,.95)'); ctx.fillStyle = bg;
  ctx.beginPath(); ctx.moveTo(-20, -18); ctx.lineTo(-90, -24); ctx.quadraticCurveTo(-130, -60, -170, -64); ctx.lineTo(-560, -64); ctx.lineTo(-560, 64); ctx.lineTo(-170, 64); ctx.quadraticCurveTo(-130, 60, -90, 24); ctx.lineTo(-20, 18); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(255,240,210,.35)'; ctx.fillRect(-520, -48, 330, 10); ctx.fillStyle = 'rgb(240,232,214)'; ctx.fillRect(-420, -50, 150, 100); ctx.fillStyle = 'rgb(120,40,30)'; ctx.font = 'italic 700 30px "Playfair Display", serif'; ctx.save(); ctx.translate(-345, 0); ctx.rotate(PI / 2); ctx.textAlign = 'center'; ctx.fillText('Almagre', 0, 10); ctx.restore(); ctx.restore();
}
function insertPan(t) {
  T0(); insBg(RCX.steel, .9);
  /* rejilla de hierro del fogón */
  ctx.strokeStyle = 'rgb(18,18,20)'; ctx.lineWidth = 34; ctx.lineCap = 'butt'; for (const a of [.35, 1.2, 2.0, 2.8]) { ctx.beginPath(); ctx.moveTo(PAN.x + Math.cos(a) * 1200, PAN.y + 60 + Math.sin(a) * 600); ctx.lineTo(PAN.x - Math.cos(a) * 1200, PAN.y + 60 - Math.sin(a) * 600); ctx.stroke(); }
  const fA = flameAmp(t), arro = t >= RC.butter, tilt = arro ? -.1 * sm(seg(t, RC.butter - .2, RC.butter + .6)) : t > RC.pour - .6 && t < RC.ign + 1 ? -.06 * Math.sin(seg(t, RC.pour - .6, RC.ign + 1) * PI) : 0;
  burnerUnder(t, t < RC.drop - 1 ? .7 : 1);
  const S = steakPose(t), sear = seg(t, RC.drop, RC.flip) * .9 + (t > RC.flip ? .1 : 0), sz = sizzle(t);
  panBody(t, tilt, () => {
    if (arro) butterPool(t);
    if (t > RC.drop - .4) drawSteak(S, t, sear, arro ? seg(t, RC.baste, RC.baste + 3) : 0);
  });
  ctx.save(); ctx.translate(PAN.x, PAN.y); ctx.rotate(tilt); ctx.translate(-PAN.x, -PAN.y);
  if (arro) spoonBaste(t, S);
  ctx.restore();
  oilPop(t, S, sz);
  smokeWisps(t, S.x, S.y - 20, 420, clamp(sz * .7 + fA * .3), RCX.smoke, 30, 760);
  if (t >= RC.drop && t < RC.drop + .6) { const a = t - RC.drop; ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 40; i++) { const ang = -PI * hsh(i, 1), v = 400 + hsh(i, 2) * 900, x = S.x + Math.cos(ang) * (240 + v * a), y = S.y + Math.sin(ang) * v * a * .6 + 1800 * a * a; ctx.fillStyle = `rgba(255,236,190,${1 - a / .6})`; ctx.fillRect(x, y, 4, 4); } ctx.restore(); }
  bottlePour(t);
  if (fA > .01) { flameField(t, fA, PAN.x - 40, PAN.y, PAN.rx * 1.5, 900, 46); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = .28 * fA; ctx.fillStyle = 'rgb(255,130,50)'; ctx.fillRect(0, 0, W, H); ctx.restore(); T0(); }
  /* luz fría de arriba, viñeta caliente cuando hay fuego */
  const lg = ctx.createLinearGradient(0, -500, 0, 500); lg.addColorStop(0, 'rgba(210,226,255,.10)'); lg.addColorStop(1, 'rgba(0,0,0,.25)'); ctx.fillStyle = lg; ctx.fillRect(-SW / 2, -500, SW, 1000);
  /* Teo se asoma: concentrado; ojos como platos con la llamarada; feliz con el arroser */
  const f = t > RC.ign - .1 && t < RC.ign + 2.5 ? { wide: true, mouthO: true } : arro ? { happy: t % 3 < 1.6 } : { flat: true, blink: (t * .5) % 1 < .05 };
  teoPeek(f, 1, t > RC.ign && t < RC.ign + 2.5 ? 30 : 26);
}
/* ---------- B · el emplatado ---------- */
const PLT = { x: 150, y: 40, r: 330, sy: .86 };
const tearPt = s => { const a = lerp(2.5, 5.2, s), R = 214 + 26 * Math.sin(s * PI); return [PLT.x + Math.cos(a) * R, PLT.y + Math.sin(a) * R * PLT.sy]; };
const tearW = s => 38 * Math.pow(1 - s, .8) + 1.8;
function sauceTear(t) {
  const pr = eio(seg(t, RC.tear, RC.tear + 1.8)); if (pr <= 0) return null; const N = 60, L = [], R_ = [];
  for (let i = 0; i <= N; i++) { const s = i / N * pr, p = tearPt(s), q = tearPt(Math.min(1, s + .01)), d = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1, nx = -(q[1] - p[1]) / d, ny = (q[0] - p[0]) / d, w = tearW(s); L.push([p[0] + nx * w, p[1] + ny * w]); R_.push([p[0] - nx * w, p[1] - ny * w]); }
  const head = tearPt(0); ctx.fillStyle = 'rgb(66,24,12)'; ctx.beginPath(); L.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); for (let i = R_.length - 1; i >= 0; i--) ctx.lineTo(R_[i][0], R_[i][1]); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.arc(head[0], head[1], tearW(0), 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(130,56,24,.85)'; ctx.lineWidth = 6; ctx.beginPath(); for (let i = 0; i <= N; i++) { const p = tearPt(i / N * pr); i ? ctx.lineTo(p[0], p[1] - tearW(i / N * pr) * .35) : ctx.moveTo(p[0], p[1] - tearW(0) * .35); } ctx.stroke();
  /* las lámparas del pase reflejadas en la lágrima */
  ctx.save(); ctx.globalCompositeOperation = 'screen'; for (const [s, k] of [[.04, 1], [.22, .7], [.45, .5]]) { if (s > pr) continue; const p = tearPt(s), w = tearW(s); ctx.fillStyle = `rgba(255,150,110,${.7 * k})`; ctx.beginPath(); ctx.ellipse(p[0] - w * .25, p[1] - w * .45, w * .45, w * .16, -.4, 0, TAU); ctx.fill(); ctx.fillStyle = `rgba(255,255,250,${.9 * k})`; ctx.beginPath(); ctx.ellipse(p[0] - w * .3, p[1] - w * .5, w * .16, w * .06, -.4, 0, TAU); ctx.fill(); } ctx.restore();
  return tearPt(pr);
}
const SLICES = [0, 1, 2, 3, 4].map(k => ({ x: PLT.x + 6 + k * 46, y: PLT.y + 56 - k * 30, a: -.6 + k * .1 }));
const inward = (s, o) => { const p = tearPt(s), dx = PLT.x - p[0], dy = PLT.y - p[1], d = Math.hypot(dx, dy) || 1; return [p[0] + dx / d * (tearW(s) + o), p[1] + dy / d * (tearW(s) + o)]; };
const GREEN = [0, 1, 2, 3, 4, 5, 6].map(k => { const s = .06 + k * .13, [x, y] = inward(s, 24); return { x, y, r: 19 - k * 1.8, t: RC.green + k * .3 }; });
const SAFF = [0, 1, 2, 3, 4, 5].map(k => { const s = .13 + k * .14, [x, y] = inward(s, 62); return { x, y, r: 13 - k * 1.1, t: RC.saff + k * .34 }; });
const GARN = [[0, 120, -40, .4, 76], [1, 186, -66, 0, 58], [3, 70, 10, 0, 50], [2, 230, -20, .5, 40], [4, 30, 64, -1.2, 70], [2, 144, 20, 1.1, 34], [1, -40, -150, .2, 46]].map(([k, dx, dy, a, s], i) => ({ k, x: PLT.x + dx, y: PLT.y + dy, a, s, t: RC.garn + i * .78 }));
function dotDraw(x, y, r, c, sc) { if (sc <= 0) return; const rr = r * sc, gr = ctx.createRadialGradient(x - rr * .3, y - rr * .35, rr * .1, x, y, rr); gr.addColorStop(0, cssc(shc(c, .35))); gr.addColorStop(.6, cssc(c)); gr.addColorStop(1, cssc(shc(c, -.3))); ctx.fillStyle = gr; ctx.beginPath(); ctx.ellipse(x, y, rr, rr * .9, 0, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.beginPath(); ctx.ellipse(x - rr * .35, y - rr * .4, rr * .22, rr * .12, -.5, 0, TAU); ctx.fill(); }
function squeezeTip(x, y, col, press) { ctx.save(); ctx.translate(x + 6, y - 14 - (1 - press) * 20); ctx.rotate(.5); ctx.fillStyle = 'rgb(240,240,236)'; ctx.beginPath(); ctx.moveTo(-3, 0); ctx.lineTo(3, 0); ctx.lineTo(16, -120); ctx.lineTo(-16, -120); ctx.fill(); const bg = ctx.createLinearGradient(-60, 0, 60, 0); bg.addColorStop(0, cssc(shc(col, -.3), .9)); bg.addColorStop(.4, cssc(shc(col, .2), .9)); bg.addColorStop(1, cssc(shc(col, -.4), .9)); ctx.fillStyle = bg; ctx.fillRect(-62, -800, 124, 690); ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.fillRect(-40, -780, 14, 650); ctx.restore(); }
function goldLeaf(x, y, t, flut) { const N = 11; ctx.beginPath(); for (let i = 0; i < N; i++) { const a = i / N * TAU, r = 30 * (1 + .25 * Math.sin(a * 3 + 1) + .15 * Math.sin(a * 5)) + flut * 7 * Math.sin(t * 31 + i * 1.7); i ? ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r * .8) : ctx.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r * .8); } ctx.closePath();
  const sh = .5 + .5 * Math.sin(t * 9 + flut * 3), gr = ctx.createLinearGradient(x - 30, y - 30, x + 30, y + 30); gr.addColorStop(0, 'rgb(190,140,40)'); gr.addColorStop(clamp(.2 + sh * .6), 'rgb(255,236,150)'); gr.addColorStop(1, 'rgb(170,120,30)'); ctx.fillStyle = gr; ctx.fill(); ctx.strokeStyle = 'rgba(120,80,20,.6)'; ctx.lineWidth = 1; ctx.stroke();
  ctx.strokeStyle = 'rgba(255,250,220,.7)'; for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(x - 20 + k * 11, y - 14 + Math.sin(k) * 6); ctx.lineTo(x - 12 + k * 11, y + 10); ctx.stroke(); } }
const goldFlutter = t => t < RC.goldOff ? .15 : Math.exp(-(t - RC.goldOff) * .55) * (1.2 + .5 * Math.sin(t * 2.7));
function insertPlate(t) {
  T0(); insBg(RCX.passSteel);
  /* papel húmedo con las cajas de brotes y flores (a la izquierda) */
  ctx.drawImage(RCX.paper, -SW / 2 - 40, -520, 420, 1040); ctx.drawImage(RCX.boxes[0], -SW / 2 + 10, -430, 300, 220); ctx.drawImage(RCX.boxes[1], -SW / 2 + 30, -150, 300, 220);
  ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fillRect(-SW / 2 + 380, -500, 20, 1000);
  /* el plato entra deslizando */
  { ctx.save(); ctx.globalCompositeOperation = 'screen'; const rg = ctx.createRadialGradient(0, -380, 40, 0, -200, 1100); rg.addColorStop(0, 'rgba(255,90,40,.5)'); rg.addColorStop(1, 'rgba(255,60,30,0)'); ctx.fillStyle = rg; ctx.fillRect(-SW / 2, -500, SW, 1000); ctx.restore(); }
  const pin = eio(seg(t, RC.plate, RC.plate + 1.2)), px = lerp(1400, 0, pin);
  ctx.save(); ctx.translate(px, 0); ctx.translate(PLT.x, PLT.y); ctx.scale(1.32, 1.32); ctx.translate(-PLT.x, -PLT.y);
  ctx.fillStyle = 'rgba(20,10,10,.35)'; ctx.beginPath(); ctx.ellipse(PLT.x + 16, PLT.y + 24, PLT.r + 6, (PLT.r + 6) * PLT.sy, 0, 0, TAU); ctx.fill();
  ctx.drawImage(RCX.plate, PLT.x - PLT.r, PLT.y - PLT.r * PLT.sy, PLT.r * 2, PLT.r * 2 * PLT.sy);
  const tip = sauceTear(t);
  /* la cuchara que arrastra la lágrima */
  if (tip && t < RC.tear + 2.1) { ctx.save(); ctx.translate(tip[0], tip[1]); ctx.rotate(-.9); ctx.globalAlpha = 1 - seg(t, RC.tear + 1.8, RC.tear + 2.1); const bg = ctx.createRadialGradient(0, 0, 2, 0, 0, 40); bg.addColorStop(0, 'rgb(250,250,252)'); bg.addColorStop(1, 'rgb(120,124,132)'); ctx.fillStyle = bg; ctx.beginPath(); ctx.ellipse(0, -10, 26, 40, 0, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgb(200,204,212)'; ctx.fillRect(-5, -900, 10, 860); ctx.restore(); ctx.globalAlpha = 1; }
  /* láminas de carne, una a una con las pinzas */
  let tw = null;
  SLICES.forEach((S_, k) => { const t0 = RC.slices + k * .62; if (t < t0) return; const u = eio(seg(t, t0, t0 + .4)), x = lerp(PLT.x + 900, S_.x, u), y = lerp(-700, S_.y, u), img = RCX.slices[k];
    ctx.save(); ctx.translate(x, y); ctx.rotate(S_.a); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(6, 12, 82, 34, 0, 0, TAU); ctx.fill(); ctx.drawImage(img, -85, -39, 170, 78); ctx.restore(); if (u < 1 || t < t0 + .55) tw = [x + 30, y - 10, -.75, u < 1 ? 0 : seg(t, t0 + .4, t0 + .55)]; });
  /* puntos: clorofila y azafrán */
  let sq = null;
  for (const [L, col] of [[GREEN, [60, 160, 50]], [SAFF, [246, 184, 26]]]) L.forEach(d => { const sc = sm(seg(t, d.t, d.t + .16)); dotDraw(d.x, d.y, d.r, col, sc); if (t > d.t - .25 && t < d.t + .22) sq = [d.x, d.y, col, seg(t, d.t - .1, d.t + .05)]; });
  /* brotes y flores */
  GARN.forEach(G => { if (t < G.t) return; const u = eio(seg(t, G.t, G.t + .45)), x = lerp(-SW / 2 + 160, G.x, u), y = lerp(-320 + G.k * 60, G.y, u) - Math.sin(u * PI) * 120; ctx.save(); ctx.translate(x, y); ctx.rotate(G.a + (1 - u) * .6); ctx.drawImage(RCX.garn[G.k], -G.s * .7, -G.s * .7, G.s * 1.4, G.s * 1.4); ctx.restore(); if (u < 1 || t < G.t + .6) tw = [x - 6, y, -2.6, u < 1 ? 0 : seg(t, G.t + .45, G.t + .6)]; });
  /* la hoja de oro: llega con pinzas, se suelta y tiembla con el aire */
  if (t > RC.gold) { const u = eio(seg(t, RC.gold, RC.gold + 1.4)), gx = lerp(PLT.x + 700, SLICES[2].x + 6, u), gy = lerp(-640, SLICES[2].y - 6, u) - (t < RC.goldOff ? 10 + Math.sin(t * 3) * 3 : 0); goldLeaf(gx, gy, t, goldFlutter(t));
    if (t < RC.goldOff + .35) tw = [gx + 18, gy - 12, -.7, seg(t, RC.goldOff, RC.goldOff + .3)]; }
  if (sq) squeezeTip(sq[0], sq[1], sq[2], sq[3]);
  if (tw) tweezers(tw[0], tw[1], tw[2], tw[3]);
  ctx.restore();
  /* el rojo de las lámparas infrarrojas por encima */
  ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = 'rgba(255,80,40,.14)'; ctx.fillRect(-SW / 2, -500, SW, 1000); ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = `rgba(255,120,80,${.18 + .03 * Math.sin(t * 2)})`; ctx.beginPath(); ctx.ellipse(PLT.x + px - 120, PLT.y - 270, 150, 26, -.3, 0, TAU); ctx.fill(); ctx.restore();
  /* Teo se asoma desde abajo, conteniendo el aliento con el oro */
  const f = t > RC.gold ? { wide: t > RC.goldOff && t < RC.endB - .8, sweat: t > RC.goldOff, mouthO: false, flat: t < RC.goldOff, happy: t > RC.endB - .8 } : { flat: true, blink: (t * .4) % 1 < .05 };
  if (t > RC.tear) teoPeek(f, 1, 25);
}
/* el plato terminado en el mundo (sobre el pase) */
function plate3D(x, z, full, t) { const top = KI.PASS.top - .6, P = poly3(ellP(x, z, 30, 30, 28).map(([a, b]) => [a, top, b])); if (!P) return; ctx.fillStyle = 'rgb(34,32,34)'; ctx.fill(P); ctx.strokeStyle = 'rgba(110,104,104,.8)'; ctx.lineWidth = Math.max(1, PS(z) * .8); ctx.stroke(P);
  if (!full) { const c = PJ(x - 4, top, z - 4), s = PS(z); ctx.fillStyle = 'rgba(255,170,130,.35)'; ctx.beginPath(); ctx.ellipse(c[0], c[1], 12 * s, 3 * s, -.2, 0, TAU); ctx.fill(); return; }
  for (const [dx, dz, c, r] of [[-8, -6, 'rgb(70,26,14)', 6.4], [4, 2, 'rgb(210,90,96)', 5.2], [10, -4, 'rgb(210,90,96)', 4.8], [-12, 6, 'rgb(70,160,60)', 2.2], [-6, 10, 'rgb(246,184,26)', 2], [12, 10, 'rgb(120,60,170)', 2.4], [6, -2, 'rgb(250,220,120)', 2.6]]) { const p = PJ(x + dx, top - .5, z + dz), s = PS(z); ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(p[0], p[1], r * s, r * s * .4, 0, 0, TAU); ctx.fill(); }
  const g = PJ(x + 6, top - 1, z - 2); ctx.fillStyle = `rgba(255,230,140,${.7 + .3 * Math.sin(t * 6)})`; ctx.fillRect(g[0] - 1.4 * PS(z), g[1] - .8 * PS(z), 2.8 * PS(z), 1.2 * PS(z)); }
/* la sartén de hierro sobre el fogón, en el mundo (planos generales) */
function castIron3D(x, z, t, o = {}) {
  const top = KI.RANGE.top, s = PS(z), r = 26;
  const H_ = poly3([[x + r - 2, top - 7, z - 3], [x + r + 46, top - 9, z - 8], [x + r + 46, top - 6, z - 4], [x + r - 2, top - 3, z + 3]]); if (H_) { ctx.fillStyle = 'rgb(26,26,28)'; ctx.fill(H_); }
  const B = poly3(ellP(x, z, r, r, 24).map(([a, b]) => [a, top - 1, b])), Tp = poly3(ellP(x, z, r, r, 24).map(([a, b]) => [a, top - 8, b]));
  if (B) { ctx.fillStyle = 'rgb(22,22,24)'; ctx.fill(B); } if (Tp) { ctx.fillStyle = 'rgb(30,30,32)'; ctx.fill(Tp); ctx.strokeStyle = 'rgb(70,70,76)'; ctx.lineWidth = Math.max(1, s * 1.2); ctx.stroke(Tp); }
  if (o.steak) { const p = PJ(x - 3, top - 9, z), q = PS(z); ctx.fillStyle = o.crust ? 'rgb(110,54,24)' : 'rgb(170,60,60)'; ctx.beginPath(); ctx.ellipse(p[0], p[1], 13 * q, 4 * q, 0, 0, TAU); ctx.fill(); }
  if (o.smoke) steamCols(t, { x, y: top - 10, z }, { n: 4, h: 160, w: 6, a: .16 * o.smoke, sway: 20, spread: 16, drift: .1 });
}
function flame3D(t, x, z, amp) {   /* la llamarada en el plano general */
  if (amp < .01) return; const c = PJ(x, KI.RANGE.top - 10, z), s = PS(z); ctx.save(); ctx.translate(c[0], c[1]); ctx.scale(s, s); flameField(t, amp, 0, 0, 60, 120, 34); ctx.restore();
}
