/* =====================================================================
   PINTORES DEL MUNDO MÁGICO (1879–1895): castillo, lago, casa con porche,
   fuerte de sábanas, estudio, cuaderno, arcadas, gran comedor, pasillo,
   sobres, chimenea. Todo original, pintado una vez en la carga.
   ===================================================================== */
function rectP(x0, y0, x1, y1, v = .25) { return [[x0, y0, v], [x1, y0, v], [x1, y1, v], [x0, y1, v]]; }
function arch(cx, yb, w, h, n = 14) { // arco ojival equilátero: base yb, ancho w, alto total h
  const ys = yb - Math.max(0, h - .866 * w), pts = [[cx - w / 2, yb]];
  for (let i = 0; i <= n; i++) { const th = PI - i / n * PI / 3; pts.push([cx + w / 2 + w * Math.cos(th), ys - w * Math.sin(th)]); }
  for (let i = n; i >= 0; i--) { const th = PI - i / n * PI / 3; pts.push([cx - w / 2 - w * Math.cos(th), ys - w * Math.sin(th)]); }
  pts.push([cx + w / 2, yb]);
  return pts;
}
function solid(g, pts, col, a = .14, L = 8, amt = .03) { wash(g, pts.map(p => [p[0], p[1], p[2] ?? .3]), col, { layers: L, alpha: a, amt, base: 1, per: 2, seg: 24 }); }

/* ---------- castillo sobre el acantilado ---------- */
function genCastle(s0) {
  seed(s0);
  const sp = Spr(-760, -600, 760, 300, .8), g = sp.g, wins = [], ink = '38,40,54', ink2 = '26,26,36';
  // acantilado rocoso
  const cl = [];
  for (let x = -760; x <= 760; x += 12) {
    let y = x < -420 ? lerp(240, 60, sm((x + 760) / 340)) : x > 440 ? lerp(50, 230, sm((x - 440) / 320)) : 50;
    y += FBM(x * .02, 3, 3) * 26 + Math.abs(N2(x * .07, 9)) * 12; cl.push([x, y, .5]);
  }
  cl.push([760, 300, 1], [-760, 300, 1]);
  wash(g, cl, ink2, { layers: 14, alpha: .09, amt: .12, base: 1, per: 2 });
  for (let i = 0; i < 26; i++) { const x = rnd(-600, 600), y = rnd(70, 220); brush(g, [[x, y], [x + rnd(-20, 20), y + rnd(30, 70)]], { w: u => 3 * (1 - u), col: '20,20,26', a: .35, bristles: 3, seed: i }); }
  const tower = (x, w, top, spire, base = 52, roof = true) => {
    solid(g, rectP(x - w / 2, top, x + w / 2, base), ink, .15, 9);
    if (roof) solid(g, [[x - w / 2 - 6, top + 2], [x, top - spire], [x + w / 2 + 6, top + 2]], ink2, .17, 9);
    else for (let k = 0; k < 4; k++) solid(g, rectP(x - w / 2 + k * w / 3.5, top - 9, x - w / 2 + k * w / 3.5 + w / 7, top), ink2, .2, 4);
    g.strokeStyle = 'rgba(20,20,26,.8)'; g.lineWidth = 1.4; if (roof) { g.beginPath(); g.moveTo(x, top - spire); g.lineTo(x, top - spire - 18); g.stroke(); }
    for (let yy = top + 26; yy < base - 20; yy += rnd(34, 56)) if (R() < .75) wins.push({ x: x + rnd(-w * .2, w * .2), y: yy, w: 5, h: 10, ph: rnd(TAU) });
  };
  // murallas almenadas
  solid(g, rectP(-400, -40, 430, 52), ink, .13, 8);
  for (let x = -400; x < 430; x += 18) solid(g, rectP(x, -52, x + 9, -40), ink2, .2, 3);
  // gran salón con tejado a dos aguas
  solid(g, rectP(-120, -120, 170, 52), ink, .16, 9);
  solid(g, [[-128, -118], [-60, -190], [110, -190], [178, -118]], ink2, .17, 9);
  for (let k = 0; k < 6; k++) wins.push({ x: -95 + k * 48, y: -82, w: 8, h: 22, ph: rnd(TAU), big: 1 });
  tower(-210, 52, -310, 120); tower(215, 70, -250, 110); tower(-330, 40, -150, 70); tower(-40, 36, -210, 72);
  tower(330, 42, -170, 76); tower(405, 34, -100, 60); tower(90, 30, -240, 64); tower(-280, 26, -230, 58, 52, false);
  // puente de arcos hacia la izquierda
  solid(g, rectP(-760, 70, -400, 88), ink, .15, 6);
  for (let x = -740; x < -410; x += 52) { solid(g, rectP(x, 88, x + 10, 260), ink, .14, 6); }
  granulate(sp, .2);
  return { sp, wins };
}
function winGlow(wins, T, a = 1, dx = 0, dy = 0, s = 1) { // ventanas encendidas que titilan
  const prev = ctx.globalCompositeOperation; mode('source-over');
  for (const w of wins) {
    const fl = (.75 + .25 * N2(T * 1.3 + w.ph, w.x * .01)) * a * SA; if (fl <= .02) continue;
    const x = dx + w.x * s, y = dy + w.y * s, r = (w.big ? 26 : 16) * s;
    const gr = ctx.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(255,206,120,${.45 * fl})`); gr.addColorStop(1, 'rgba(255,190,100,0)');
    ctx.fillStyle = gr; ctx.fillRect(x - r, y - r, r * 2, r * 2);
    ctx.fillStyle = `rgba(255,214,140,${.95 * fl})`; ctx.beginPath(); ctx.moveTo(x - w.w / 2 * s, y + w.h / 2 * s); ctx.lineTo(x - w.w / 2 * s, y - w.h * .2 * s); ctx.quadraticCurveTo(x, y - w.h * .75 * s, x + w.w / 2 * s, y - w.h * .2 * s); ctx.lineTo(x + w.w / 2 * s, y + w.h / 2 * s); ctx.fill();
  }
  mode(prev);
}
function glowAt(x, y, r, col, a) { // halo de luz cálida (velas, faroles)
  if (a * SA <= .01) return; const prev = ctx.globalCompositeOperation; mode('source-over');
  const gr = ctx.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${col},${a * SA})`); gr.addColorStop(.35, `rgba(${col},${a * .4 * SA})`); gr.addColorStop(1, `rgba(${col},0)`);
  ctx.fillStyle = gr; ctx.fillRect(x - r, y - r, r * 2, r * 2); mode(prev);
}
function genMoonPale(r) {
  seed(78); const sp = Spr(-r * 2.2, -r * 2.2, r * 2.2, r * 2.2, .6), g = sp.g;
  const gr = g.createRadialGradient(0, 0, r * .8, 0, 0, r * 2.2); gr.addColorStop(0, 'rgba(236,232,214,.45)'); gr.addColorStop(1, 'rgba(236,232,214,0)'); g.fillStyle = gr; g.fillRect(-r * 2.2, -r * 2.2, r * 4.4, r * 4.4);
  wash(g, circlePts(0, 0, r, 36, .15), '244,238,220', { layers: 22, alpha: .12, amt: .05 });
  for (let i = 0; i < 6; i++) wash(g, circlePts(rnd(-r * .5, r * .5), rnd(-r * .5, r * .5), rnd(r * .1, r * .3), 12, 1), '196,192,184', { layers: 5, alpha: .05, amt: .4, base: 1, per: 2 });
  return sp;
}
function genStars(n, s0) { seed(s0); const st = []; for (let i = 0; i < n; i++) st.push({ x: rnd(-1300, 1300), y: rnd(-560, 40), r: rnd(.6, 2), ph: rnd(TAU) }); return st; }
function starsDraw(st, T, a, d = .05) { L(d); mode('source-over'); for (const s of st) { const k = (.5 + .5 * Math.sin(T * 1.7 + s.ph)) * a * SA; if (k < .03) continue; ctx.fillStyle = `rgba(250,244,226,${k})`; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, TAU); ctx.fill(); } mode('multiply'); }

/* ---------- casa victoriana con porche ---------- */
function genHouse(s0) {
  seed(s0);
  const sp = Spr(-80, -380, 520, 280, .8), g = sp.g, ink = '50,46,52', ink2 = '30,28,34', wins = [];
  solid(g, rectP(0, -150, 420, 250), ink, .11, 10);
  solid(g, [[-20, -140], [210, -330], [440, -140]], ink2, .16, 10);
  solid(g, rectP(300, -330, 330, -250), ink2, .2, 5); // chimenea
  solid(g, [[-60, 10], [-40, -30], [460, -30], [480, 10]], ink2, .17, 8); // techo del porche
  for (const x of [-30, 120, 300, 450]) solid(g, rectP(x - 5, 10, x + 5, 232), ink2, .22, 5);
  g.strokeStyle = 'rgba(28,26,32,.8)'; g.lineWidth = 3; for (const y of [168, 200]) { g.beginPath(); g.moveTo(-30, y); g.lineTo(170, y); g.moveTo(250, y); g.lineTo(450, y); g.stroke(); }
  g.lineWidth = 1.6; for (let x = -26; x < 450; x += 14) if (x < 170 || x > 250) { g.beginPath(); g.moveTo(x, 168); g.lineTo(x, 232); g.stroke(); }
  for (let k = 0; k < 4; k++) solid(g, rectP(170 - k * 8, 232 + k * 12, 250 + k * 8, 244 + k * 12), ink2, .2, 4); // escalones
  wins.push({ x: 210, y: 150, w: 54, h: 150, ph: 1, door: 1 }, { x: 70, y: 90, w: 60, h: 80, ph: 2 }, { x: 350, y: 90, w: 60, h: 80, ph: 3 }, { x: 210, y: -80, w: 50, h: 70, ph: 4 });
  granulate(sp, .2);
  return { sp, wins, lantern: [120, 40] };
}
function houseWins(h, T, x0, y0, a) {
  mode('source-over');
  for (const w of h.wins) {
    const fl = (.8 + .2 * N2(T * 2 + w.ph, 1)) * a * SA;
    ctx.fillStyle = `rgba(250,196,110,${.75 * fl})`; ctx.fillRect(x0 + w.x - w.w / 2, y0 + w.y - w.h / 2, w.w, w.h);
    ctx.strokeStyle = `rgba(40,30,30,${.8 * a * SA})`; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x0 + w.x, y0 + w.y - w.h / 2); ctx.lineTo(x0 + w.x, y0 + w.y + w.h / 2); if (!w.door) { ctx.moveTo(x0 + w.x - w.w / 2, y0 + w.y); ctx.lineTo(x0 + w.x + w.w / 2, y0 + w.y); } ctx.stroke();
  }
  mode('multiply');
}

/* ---------- interiores ---------- */
function genRoom(span, col, s0, a = .1) { seed(s0); const sp = Spr(-span / 2, -560, span / 2, 560, .4); wash(sp.g, rectP(-span / 2 - 40, -600, span / 2 + 40, 600, 1), col, { layers: 14, alpha: a, amt: .08 }); granulate(sp, .3); return sp; }
function genStudy(s0) {
  seed(s0);
  const sp = Spr(-1250, -560, 950, 560, .7), g = sp.g, ink = '38,30,28', ink2 = '24,20,20';
  // muro con ventana ojival (hueco recortado: la luz de luna se pinta debajo)
  wash(g, rectP(-1290, -600, 990, 600, 1), '58,46,40', { layers: 12, alpha: .1, amt: .06 });
  g.save(); g.globalCompositeOperation = 'destination-out'; polyPath(g, arch(-430, 160, 300, 560, 18)); g.fill(); g.restore();
  g.strokeStyle = 'rgba(24,20,20,.9)'; g.lineWidth = 10; polyPath(g, arch(-430, 160, 300, 560, 18)); g.stroke();
  g.lineWidth = 4; g.beginPath(); g.moveTo(-430, 160); g.lineTo(-430, -330); for (let y = 100; y > -300; y -= 85) { g.moveTo(-580, y); g.lineTo(-280, y); } g.stroke();
  // estantería
  solid(g, rectP(520, -500, 900, 340), ink2, .16, 8);
  for (let sh = -470; sh < 300; sh += 110) { let x = 540; while (x < 880) { const w = rnd(10, 24), h = rnd(60, 95); solid(g, rectP(x, sh + 100 - h, x + w, sh + 100), pick(['70,40,34', '40,50,46', '60,50,30', '30,30,40']), .2, 3); x += w + rnd(1, 4); } solid(g, rectP(530, sh + 100, 890, sh + 108), ink2, .25, 3); }
  // escritorio y silla
  solid(g, rectP(-120, 150, 420, 168), ink2, .22, 6); solid(g, rectP(-100, 168, -80, 340), ink2, .22, 4); solid(g, rectP(380, 168, 400, 340), ink2, .22, 4);
  solid(g, rectP(-60, 120, 380, 150), ink, .1, 4);
  // suelo
  wash(g, rectP(-1290, 330, 990, 600, .6), '34,28,26', { layers: 10, alpha: .12, amt: .1 });
  granulate(sp, .2);
  return sp;
}
function genPage(s0) {
  seed(s0);
  const sp = Spr(-520, -330, 520, 330, 1), g = sp.g;
  g.save(); g.rotate(-.04);
  wash(g, rectP(-470, -300, 470, 300, .15), '238,228,204', { layers: 10, alpha: .2, amt: .02 });
  g.fillStyle = 'rgba(160,120,80,.12)'; g.fillRect(-470, -300, 940, 600);
  g.strokeStyle = 'rgba(80,110,160,.25)'; g.lineWidth = 1.4; for (let y = -220; y < 290; y += 48) { g.beginPath(); g.moveTo(-450, y); g.lineTo(450, y); g.stroke(); }
  g.strokeStyle = 'rgba(176,40,40,.35)'; g.beginPath(); g.moveTo(-370, -290); g.lineTo(-370, 290); g.stroke();
  g.restore(); granulate(sp, .15);
  return sp;
}
function genScript(text, size, s0, col = '30,26,34', font = HANDF) { // línea manuscrita (para revelarla con la pluma)
  const c = mk(size * text.length * .62 + 40, size * 1.6), g = c.getContext('2d');
  g.font = `${size}px ${font}`; g.textBaseline = 'middle'; g.fillStyle = `rgba(${col},.9)`;
  seed(s0); let x = 14; for (const ch of text) { g.save(); g.translate(x, size * .8 + rnd(-1.5, 1.5)); g.rotate(rnd(-.05, .05)); g.fillText(ch, 0, 0); g.restore(); x += g.measureText(ch).width * rnd(.96, 1.04); }
  return { c, w: x + 10 };
}
function genArcade(s0, col = '62,58,62') {
  seed(s0);
  const sp = Spr(-1100, -560, 1100, 560, .6), g = sp.g, ink2 = '34,32,38';
  wash(g, rectP(-1140, -600, 1140, 260, 1), col, { layers: 10, alpha: .12, amt: .06 });
  g.save(); g.globalCompositeOperation = 'destination-out';
  for (let x = -1000; x <= 1000; x += 250) { polyPath(g, arch(x, 250, 170, 430, 16)); g.fill(); }
  g.restore();
  g.strokeStyle = 'rgba(30,28,34,.8)'; g.lineWidth = 6; for (let x = -1000; x <= 1000; x += 250) { polyPath(g, arch(x, 250, 170, 430, 16)); g.stroke(); }
  for (let x = -1125; x <= 1125; x += 250) solid(g, rectP(x - 22, -200, x + 22, 262), ink2, .2, 6);
  wash(g, rectP(-1140, 250, 1140, 600, .5), '52,48,50', { layers: 10, alpha: .12, amt: .1 });
  g.strokeStyle = 'rgba(30,28,32,.25)'; g.lineWidth = 1.5; for (let y = 290; y < 560; y += 40) { g.beginPath(); g.moveTo(-1140, y); g.lineTo(1140, y); g.stroke(); }
  granulate(sp, .25);
  return sp;
}
function genHall(s0) {
  seed(s0);
  const sp = Spr(-1100, -560, 1100, 560, .6), g = sp.g, ink = '40,34,34', ink2 = '22,20,22', lamps = [];
  wash(g, rectP(-1140, -600, 1140, 600, 1), '54,44,42', { layers: 12, alpha: .12, amt: .06 });
  g.save(); g.globalCompositeOperation = 'destination-out'; for (let x = -900; x <= 900; x += 300) { polyPath(g, arch(x, 0, 130, 520, 16)); g.fill(); } g.restore();
  g.strokeStyle = 'rgba(24,20,22,.85)'; g.lineWidth = 6; for (let x = -900; x <= 900; x += 300) { polyPath(g, arch(x, 0, 130, 520, 16)); g.stroke(); g.lineWidth = 2.5; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, -420); for (let y = -60; y > -400; y -= 70) { g.moveTo(x - 65, y); g.lineTo(x + 65, y); } g.stroke(); g.lineWidth = 6; }
  // mesas largas con alumnos sentados (siluetas)
  for (const [ty, sc, al] of [[150, .7, .2], [300, 1, .26]]) {
    solid(g, rectP(-1140, ty, 1140, ty + 14 * sc), ink2, al, 5);
    for (let x = -1100; x < 1100; x += rnd(26, 40) * sc) { if (Math.abs(x) < 120 && sc === 1) continue; const h = rnd(36, 46) * sc; solid(g, [[x - 9 * sc, ty], [x - 8 * sc, ty - h * .6], [x, ty - h * .7], [x + 8 * sc, ty - h * .6], [x + 9 * sc, ty]], ink2, al * .9, 3); fCircG(g, x, ty - h * .85, 6.5 * sc, ink2, al * 1.4); }
    for (let x = -1050; x < 1100; x += 140) lamps.push({ x: x + rnd(-20, 20), y: ty - 6 * sc, s: sc });
  }
  wash(g, rectP(-1140, 330, 1140, 600, .5), '30,26,26', { layers: 10, alpha: .14, amt: .1 });
  granulate(sp, .22);
  return { sp, lamps };
}
function fCircG(g, x, y, r, col, a) { g.fillStyle = `rgba(${col},${a})`; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); }
function genCorridor(s0) {
  seed(s0);
  const sp = Spr(-1200, -560, 1200, 560, .6), g = sp.g, ink2 = '20,18,24';
  wash(g, rectP(-1240, -600, 1240, 600, 1), '40,38,50', { layers: 14, alpha: .13, amt: .06 });
  g.save(); g.globalCompositeOperation = 'destination-out'; for (let x = -1000; x <= 1000; x += 400) { polyPath(g, arch(x, -40, 150, 440, 16)); g.fill(); } g.restore();
  g.strokeStyle = 'rgba(20,18,24,.9)'; g.lineWidth = 7; for (let x = -1000; x <= 1000; x += 400) { polyPath(g, arch(x, -40, 150, 440, 16)); g.stroke(); g.lineWidth = 3; g.beginPath(); g.moveTo(x, -40); g.lineTo(x, -400); g.moveTo(x - 75, -200); g.lineTo(x + 75, -200); g.stroke(); g.lineWidth = 7; }
  for (let x = -1200; x <= 1200; x += 400) solid(g, rectP(x - 30, -560, x + 30, 330), ink2, .2, 6);
  wash(g, rectP(-1240, 330, 1240, 600, .4), '26,24,30', { layers: 10, alpha: .16, amt: .1 });
  g.strokeStyle = 'rgba(20,18,24,.3)'; g.lineWidth = 1.5; for (let y = 360; y < 560; y += 46) { g.beginPath(); g.moveTo(-1240, y); g.lineTo(1240, y); g.stroke(); }
  granulate(sp, .22);
  return sp;
}
function genFireplace(s0) {
  seed(s0);
  const sp = Spr(-330, -360, 330, 330, .8), g = sp.g, ink2 = '30,26,26';
  solid(g, rectP(-300, -330, 300, 320), '66,58,56', .14, 10);
  g.save(); g.globalCompositeOperation = 'destination-out'; polyPath(g, arch(0, 320, 300, 300, 14)); g.fill(); g.restore();
  solid(g, rectP(-330, -360, 330, -320), ink2, .22, 5);
  for (let y = -300; y < 320; y += 42) for (let x = -300 + ((y / 42) % 2) * 30; x < 300; x += 62) { g.strokeStyle = 'rgba(30,26,26,.25)'; g.lineWidth = 1.4; g.strokeRect(x, y, 60, 40); }
  granulate(sp, .2);
  return sp;
}
function genEnvelope(s0) {
  seed(s0);
  const sp = Spr(-170, -110, 170, 110, 1), g = sp.g;
  wash(g, rectP(-160, -100, 160, 100, .12), '234,222,196', { layers: 12, alpha: .22, amt: .02 });
  g.fillStyle = 'rgba(150,110,70,.18)'; g.fillRect(-160, -100, 320, 200);
  g.strokeStyle = 'rgba(110,80,60,.55)'; g.lineWidth = 2; g.beginPath(); g.moveTo(-160, -100); g.lineTo(0, 15); g.lineTo(160, -100); g.moveTo(-160, 100); g.lineTo(-30, 0); g.moveTo(160, 100); g.lineTo(30, 0); g.stroke();
  wash(g, circlePts(0, 15, 22, 16, .4), '160,24,30', { layers: 12, alpha: .14, amt: .12 });
  g.font = `italic 22px ${HANDF}`; g.fillStyle = 'rgba(40,30,30,.75)'; g.fillText('Para Joy', -60, 70);
  return { sp, bl: new Bleed(sp, tmSeeds(sp, [{ x: rnd(-140, 140), y: 100 }, { x: rnd(-150, -60), y: -90, d: 80 }], { amp: .35, ns: .02, res: 2 }), { edge: .95, edgeCol: '70,24,8', soft: .1, inv: true }) };
}
let HANDF = "'Pinyon Script', 'Snell Roundhand', 'Apple Chancery', 'Lucida Handwriting', cursive";
