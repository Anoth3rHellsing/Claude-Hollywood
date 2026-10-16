/* =====================================================================
   EL AUTO · Brote maneja ~36 s por la carretera de la costa (vista de perfil con paralaje)
   capas: cielo de tarde · montañas lejanas · mar (aparece) · colinas con árboles · postes y árboles cercanos · carretera · pasto delante
   todo depende de la distancia recorrida d(t): se puede saltar a cualquier instante
   ===================================================================== */
const DR0 = 120, DR1 = 156, DR_V = 260, DR_STOP = 150;
function driveD(t) { const a = Math.min(t, DR_STOP) - DR0, b = Math.max(0, t - DR_STOP), T = DR1 - DR_STOP; return DR_V * Math.max(0, a) + DR_V * (b - b * b / (2 * T + 2)); }
function driveV(t) { return t < DR_STOP ? DR_V : DR_V * Math.max(0, 1 - (t - DR_STOP) / (DR1 - DR_STOP + 1)); }
const SEA_AT = 2100;   // en la capa del mar (f = .25, como las colinas): dónde empieza la costa
let DRSKY = null, DRMTN = null, DRHILL = null;
function driveInit() {
  /* cielo de tarde dorada con nubes */
  { const w = 1600, h = 900, c = mk(w, h), g = c.getContext('2d'), r = mulberry32(9);
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgb(150,176,204)'); gr.addColorStop(.55, 'rgb(236,214,186)'); gr.addColorStop(1, 'rgb(250,206,150)'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 12; i++) { const x = r() * w, y = h * (.08 + r() * .4), rx = 80 + r() * 200, ry = rx * .22; g.globalAlpha = .5; g.fillStyle = 'rgb(255,236,214)'; g.fill(pPolys([wob(ellP(x, y, rx, ry, 30), ry * .5, i, .02)])); g.globalAlpha = .25; g.fillStyle = 'rgb(210,170,170)'; g.fill(pPolys([wob(ellP(x + 10, y + ry * .5, rx * .9, ry * .5, 30), ry * .4, i + 9, .02)])); }
    g.globalAlpha = .3; g.globalCompositeOperation = 'multiply'; g.fillStyle = g.createPattern(BLOT, 'repeat'); g.fillRect(0, 0, w, h); DRSKY = c; }
  /* montañas lejanas (una tira de 3200 que se repite) */
  { const S = spr([0, -420, 3200, 10], .6), g = S.g;
    for (const [col, a, hh, sd] of [[[150, 150, 186], .55, 380, 1], [[130, 128, 160], .7, 300, 2]]) { const pts = [[0, 0]]; for (let x = 0; x <= 3200; x += 40) pts.push([x, -hh * (.35 + .45 * Math.abs(N2(x * .0012 + sd, sd)) + .2 * Math.abs(N2(x * .004, sd + 3)))]); pts[pts.length - 1][1] = pts[1][1]; pts.push([3200, 0]); wcWash(g, pts, col, a, { reserve: false, mode: 'source-over', amt: 2, seed: sd, step: 30 }); }
    DRMTN = S; }
  /* colinas con árboles de otoño (tira de 4000) */
  { const S = spr([0, -360, 4000, 10], .8), g = S.g, r = mulberry32(21);
    const pts = [[0, 0]]; for (let x = 0; x <= 4000; x += 40) pts.push([x, -140 - 90 * Math.sin(x * .0016 * PI * 2 / 2.5) - 40 * N2(x * .003, 1)]); pts[pts.length - 1][1] = pts[1][1]; pts.push([4000, 0]);
    wcWash(g, pts, [176, 160, 96], .95, { reserve: false, mode: 'source-over', amt: 3, seed: 3, step: 30, bloom: [150, 120, 60] });
    for (let i = 0; i < 70; i++) { const x = r() * 4000, gy = -140 - 90 * Math.sin(x * .0016 * PI * 2 / 2.5) - 40 * N2(x * .003, 1), rr = 18 + r() * 26; wcWash(g, ellP(x, gy - rr * .6, rr, rr * .8, 14), AUT[Math.floor(r() * AUT.length)], .85, { reserve: false, mode: 'source-over', amt: rr * .2, seed: i, step: 6 }); g.fillStyle = 'rgba(60,44,34,.8)'; g.fillRect(x - 1.5, gy - rr * .2, 3, rr * .3); }
    for (let i = 0; i < 6; i++) { const x = 300 + i * 640 + r() * 200, gy = -140 - 90 * Math.sin(x * .0016 * PI * 2 / 2.5) - 40 * N2(x * .003, 1); wcWash(g, rectP(x, gy - 40, 46, 40), [236, 226, 206], .95, { reserve: false, mode: 'source-over', amt: .5, seed: x, step: 8 }); wcWash(g, [[x - 6, gy - 40], [x + 52, gy - 40], [x + 23, gy - 66]], [170, 70, 56], .95, { reserve: false, mode: 'source-over', amt: .5, seed: x + 1, step: 8 }); }   // casitas
    wcTex(g, S.c.width, S.c.height, .35, .25); DRHILL = S; }
}
/* pinta una tira repetida con desplazamiento (unidades de pantalla) */
function stripRepeat(S, off, y, k = 1, a = 1) { const TW = (S.box[2] - S.box[0]) * k, h = (S.box[3] - S.box[1]) * k; ctx.globalAlpha = a; for (let x = -((off % TW) + TW) % TW - SW / 2; x < SW / 2; x += TW) ctx.drawImage(S.c, x, y + S.box[1] * k, TW + 1, h); ctx.globalAlpha = 1; }
const ROADY = 280;
function drawDrive(t, o = {}) {
  const d = driveD(t), zoom = o.zoom || 1, fx = o.fx ?? -150;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(DRSKY, 0, 0, DRSKY.width, DRSKY.height, 0, 0, W, H); ctx.restore();
  L0s(); ctx.save();
  /* el zoom se hace alrededor del auto */
  const ax = fx + 150, ay = ROADY - 80; ctx.translate(ax, ay); ctx.scale(zoom, zoom); ctx.translate(-ax, -ay);
  /* sol bajo a la derecha */
  const sg = ctx.createRadialGradient(560, -220, 30, 560, -220, 420); sg.addColorStop(0, 'rgba(255,240,200,.95)'); sg.addColorStop(.12, 'rgba(255,226,170,.6)'); sg.addColorStop(1, 'rgba(255,226,170,0)'); ctx.fillStyle = sg; ctx.fillRect(-SW, -700, SW * 2, 1400);
  ctx.fillStyle = 'rgb(255,248,226)'; ctx.beginPath(); ctx.arc(560, -220, 46, 0, TAU); ctx.fill();
  stripRepeat(DRMTN, d * .05, 60, 1, .9);
  /* el mar entra por la derecha (capa .12): banda azul con destellos */
  const seaX = SEA_AT - d * .25; if (seaX < SW / 2 + 200) {
    const x0 = Math.max(-SW, seaX), gr = ctx.createLinearGradient(0, 40, 0, 200); gr.addColorStop(0, 'rgb(120,150,176)'); gr.addColorStop(1, 'rgb(70,110,140)'); ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(x0 + 60, 40); ctx.lineTo(SW * 2, 40); ctx.lineTo(SW * 2, 220); ctx.lineTo(x0 - 40, 220); ctx.quadraticCurveTo(x0 - 20, 120, x0 + 60, 40); ctx.fill();
    ctx.fillStyle = 'rgba(255,240,200,.85)'; for (let i = 0; i < 80; i++) { const x = x0 + 40 + hsh(i, 1) * 1600, y = 50 + hsh(i, 2) * 150, f = Math.sin(t * 3 + i * 1.7); if (x < x0 + 20 || f < .3) continue; ctx.fillRect(x, y, 10 + hsh(i, 3) * 20, 2); }
    /* faro a lo lejos */
    const lx = seaX + 620; ctx.fillStyle = 'rgb(150,126,110)'; ctx.beginPath(); ctx.moveTo(lx - 120, 46); ctx.quadraticCurveTo(lx, -10, lx + 140, 46); ctx.fill(); ctx.fillStyle = 'rgb(244,238,226)'; ctx.fillRect(lx - 7, -40, 14, 58); ctx.fillStyle = 'rgb(176,60,52)'; for (let k = 0; k < 3; k++) ctx.fillRect(lx - 7, -32 + k * 18, 14, 7); ctx.fillStyle = 'rgb(255,226,150)'; ctx.fillRect(lx - 5, -50, 10, 10);
  }
  /* colinas: se van al llegar al mar */
  ctx.save(); ctx.beginPath(); ctx.rect(-SW * 2, -800, seaX + 40 + SW * 2, 1600); ctx.clip(); stripRepeat(DRHILL, d * .25, 150, 1, 1); ctx.restore();
  if (seaX < SW / 2 + 200) { ctx.fillStyle = 'rgb(176,160,110)'; ctx.beginPath(); ctx.moveTo(seaX - 60, 220); ctx.quadraticCurveTo(seaX + 20, 120, seaX + 40, 150); ctx.lineTo(seaX + 140, 220); ctx.fill(); }
  /* el pueblo al salir (capa .25) */
  for (let i = 0; i < 9; i++) { const B = BLD[i + 10]; if (!B) break; const x = i * 230 - d * .42 - 200, s = .32; if (x > SW / 2 + 200 || x < -SW / 2 - 300) continue; ctx.drawImage(B.S.c, x + B.S.box[0] * s, 180 + B.S.box[1] * s, (B.S.box[2] - B.S.box[0]) * s, (B.S.box[3] - B.S.box[1]) * s); }
  /* hierba al borde, guardarraíl, postes con cables (capa .6) */
  ctx.fillStyle = 'rgb(150,140,80)'; ctx.fillRect(-SW, 200, SW * 2, ROADY - 200);
  wcStrip(t, d);
  const P = 520; for (let k = Math.floor((d * .6 - SW) / P); k * P < d * .6 + SW; k++) {
    const x = k * P - d * .6; if (x < -SW / 2 - 60 || x > SW / 2 + 60) continue;
    ctx.fillStyle = 'rgb(88,64,48)'; ctx.fillRect(x - 5, -170, 10, ROADY - 10 + 170); ctx.fillRect(x - 26, -150, 52, 6);
    const nx = x + P; ctx.strokeStyle = 'rgba(40,36,40,.55)'; ctx.lineWidth = 1.4; for (const dy of [-148, -128]) { ctx.beginPath(); ctx.moveTo(x + (dy < -140 ? -22 : 22), dy); ctx.quadraticCurveTo((x + nx) / 2, dy + 40, nx + (dy < -140 ? -22 : 22), dy); ctx.stroke(); }
    if (hsh(k, 4) < .45) { const T = CTREES[((k % 6) + 6) % 6], s = .75, tx = x + 200; ctx.drawImage(T.c, tx + T.box[0] * s, ROADY - 20 + T.box[1] * s, (T.box[2] - T.box[0]) * s, (T.box[3] - T.box[1]) * s); }
  }
  /* guardarraíl */
  ctx.fillStyle = 'rgb(196,196,190)'; ctx.fillRect(-SW, ROADY - 44, SW * 2, 9); ctx.fillStyle = 'rgba(80,80,84,.6)'; ctx.fillRect(-SW, ROADY - 35, SW * 2, 3);
  for (let k = Math.floor((d * .9 - SW) / 160); k * 160 < d * .9 + SW; k++) { const x = k * 160 - d * .9; ctx.fillStyle = 'rgb(150,150,148)'; ctx.fillRect(x - 3, ROADY - 44, 6, 40); }
  /* carretera */
  const rg = ctx.createLinearGradient(0, ROADY, 0, ROADY + 160); rg.addColorStop(0, 'rgb(92,88,90)'); rg.addColorStop(1, 'rgb(64,62,66)'); ctx.fillStyle = rg; ctx.fillRect(-SW, ROADY, SW * 2, 160);
  ctx.fillStyle = 'rgba(244,236,214,.85)'; for (let k = Math.floor((d - SW) / 120); k * 120 < d + SW; k++) { const x = k * 120 - d; ctx.fillRect(x, ROADY + 92, 60, 7); }
  ctx.fillStyle = 'rgba(200,192,170,.5)'; ctx.fillRect(-SW, ROADY + 2, SW * 2, 4);
  /* hojas en el asfalto que el auto levanta */
  const LP = LEAFC.map(() => new Path2D());
  for (let i = 0; i < 40; i++) { const lx0 = i * 97 % 2400, x = ((lx0 - d) % 2400 + 2400) % 2400 - 1200, rel = x - fx; let y = ROADY + 20 + hsh(i, 1) * 120, xx = x;
    if (rel < 160 && rel > -700) { const k = clamp((160 - rel) / 860); xx = x - k * 80; y -= Math.sin(k * PI) * (60 + hsh(i, 3) * 80); }
    leafShape(LP[i % LEAFC.length], xx, y, 8 + hsh(i, 2) * 5, i + t * (rel < 160 && rel > -700 ? 6 : 0), .5); }
  LP.forEach((Q, j) => { ctx.fillStyle = cssc(LEAFC[j], .9); ctx.fill(Q); });
  ctx.restore(); T0();
  /* el auto con Brote (en píxeles, con el mismo zoom) */
  const cell = Math.max(1, Math.round(H / 104 * zoom)), bob = (Math.sin(d * .045) > .85 ? 1 : 0) + (driveV(t) > 20 && Math.sin(t * 11) > .7 ? 1 : 0);
  const sx = (v) => W / 2 + ((v - ax) * zoom + ax) * U, sy = (v) => H / 2 + ((v - ay) * zoom + ay) * U;
  const cfx = Math.round(sx(fx + 150) / cell) * cell, cfy = Math.round(sy(ROADY + 64) / cell) * cell - bob * cell;
  /* Brote dentro: se ve por la ventana; mueve la cabeza al ritmo */
  const beat = beatPhase(t), hb = beat < .22 ? 1 : 0;
  spBlit(broteCanvas({ cup: true, leaf: Math.floor(t * 2.67) % 2 ? 1 : -1, blink: (t * .37) % 1 < .04 }), cfx - 2 * cell, cfy - 4 * cell + hb * cell, cell);
  spBlit(carCanvas(), cfx, cfy, cell);
  const ang = -d / 24; for (const wx of [11, 33]) spBlit(wheelCanvas(ang), cfx + (wx - CAR_W / 2) * cell, cfy + 2 * cell, cell);
  /* humito del escape */
  for (let i = 0; i < 6; i++) { const ph = (t * 1.6 + i / 6) % 1; ctx.fillStyle = `rgba(236,232,224,${.55 * (1 - ph) * clamp(driveV(t) / 80)})`; const px = cfx - (CAR_W / 2 + 2 + ph * 14) * cell, py = cfy - (4 + ph * 4 + Math.sin(i + t * 3)) * cell; ctx.fillRect(Math.round(px / cell) * cell, Math.round(py / cell) * cell, cell * (ph > .5 ? 2 : 1), cell * (ph > .5 ? 2 : 1)); }
  steamPix(cfx + 6 * cell, cfy - 21 * cell + hb * cell, cell, t, .8);
  /* pasto y flores delante (capa 1,5), pasan rápido */
  L0s(); ctx.fillStyle = 'rgb(126,124,70)'; ctx.fillRect(-SW, ROADY + 160, SW * 2, 600); for (let i = 0; i < 26; i++) { const x = ((i * 173 - d * 1.5) % 2600 + 2600) % 2600 - 1300; ctx.fillStyle = 'rgba(96,110,56,.95)'; ctx.beginPath(); ctx.ellipse(x, 480, 60, 26, 0, PI, TAU); ctx.fill(); if (i % 3 === 0) { ctx.fillStyle = cssc([[232, 150, 40], [214, 96, 40], [240, 200, 70]][i % 3 === 0 ? (i >> 1) % 3 : 0]); ctx.beginPath(); ctx.arc(x - 10, 470, 7, 0, TAU); ctx.fill(); } }
  T0();
}
/* franja de hierba con matas (detrás del guardarraíl) */
function wcStrip(t, d) { ctx.fillStyle = 'rgba(120,120,60,.8)'; for (let i = 0; i < 60; i++) { const x = ((i * 89 - d * .6) % 2600 + 2600) % 2600 - 1300; ctx.beginPath(); ctx.ellipse(x, ROADY - 30, 30 + hsh(i, 1) * 30, 14, 0, PI, TAU); ctx.fill(); } }
