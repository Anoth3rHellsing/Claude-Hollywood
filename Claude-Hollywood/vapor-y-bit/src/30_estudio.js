/* =====================================================================
   ESCENA 1 · EL ESTUDIO DE TEO (07:15) — el primer mapa del motor Escenarios
   Loft pequeño: ladrillo visto con cal vieja, un panel de yeso con láminas enmarcadas, parqué en espiga,
   vigas en el techo. La ventana de la izquierda (persiana veneciana entreabierta) deja entrar el sol bajo:
   franjas doradas en diagonal sobre la pared y la cama, sombras violetas en todo lo demás.
   Planta (cm):  pared del fondo z = 760 · ventana en la pared izquierda x = -560 · pared derecha x = 700
     cama x -440…-210 (cabecera a la izquierda) · mesita y reloj junto a la cabecera · monstera x -160
     panel de yeso y láminas sobre la cama · estantería x 90…300 · escritorio x 320…470 · puerta x 520…610
   ===================================================================== */
const ES = { ZB: 760, X0: -560, X1: 700, Y0: -300, ZF: 150, DOOR: [520, 610, -208] };
const ESX = {};
const BED = { x0: -440, x1: -210, z0: 590, z1: 750, top: -55 };
function estudioSol(night) {
  SOL.win = { x: -560, z0: 380, z1: 600, y0: -236, y1: -98 }; SOL.dir = [1, .22, .6]; SOL.d = null; SOL.n = 12; SOL.open = .5; SOL.gapTop = 0;
  if (night) { SOL.col = [150, 190, 255]; SOL.k = .55; SOL.amb = [60, 70, 140]; SOL.ambA = .62; SOL.shaft = .05; }
  else { SOL.col = [255, 202, 128]; SOL.k = 1.25; SOL.amb = [120, 98, 160]; SOL.ambA = 0; SOL.shaft = .16; }
  SOL.bake = night ? [60, 70, 140] : [120, 98, 160]; SOL.bakeA = night ? .62 : .32;
}
/* ---------- pintar (una vez) ---------- */
function estudioPaint() {
  estudioSol(false);
  ESX.wall = matBrick(1260, 300, { seed: 7, soot: 7, wash: .18 });
  ESX.wallL = matBrick(460, 300, { seed: 8, soot: 3, wash: .05 });
  ESX.wallR = matBrick(460, 300, { seed: 9, soot: 4, wash: .25 });
  ESX.plaster = matPlaster(390, 185, { seed: 4, panels: [130, 260], cracks: 3 });
  ESX.floor = estudioFloor();
  ESX.ceil = matWood(1260, 610, { seed: 3, c: [214, 200, 178], plank: 16, gap: 2.2, knots: true, nk: 2 });
  ESX.beam = matWood(1260, 22, { seed: 31, c: [96, 64, 44], plank: 22, gap: 1.4 });
  ESX.out = estudioOutside();
  ESX.trim = matWash(60, 60, [232, 226, 214], { seed: 2 });
  ESX.hall = matPlaster(240, 300, { seed: 12, c: [150, 130, 120], cracks: 1 });
  ESX.hallF = matWood(240, 240, { seed: 13, c: [96, 66, 46], plank: 14 });
  /* sombra ambiente horneada (la del sol se suma en vivo con solOn) */
  const B = SOL.bake, A = SOL.bakeA; texShade(ESX.wall, B, A); texShade(ESX.floor, B, A); texShade(ESX.plaster, B, A * .9);
  texShade(ESX.wallL, B, A + .3); texShade(ESX.wallR, B, A + .26); texShade(ESX.ceil, B, A + .32); texShade(ESX.beam, B, A); texShade(ESX.hall, [70, 56, 80], .5); texShade(ESX.hallF, [70, 56, 80], .5);
}
/* suelo: espiga con una alfombra kilim delante de la cama y el camino gastado hacia la puerta */
function estudioFloor() {
  const T = matParquet(1260, 610, { seed: 21, path: [400, 380, 1120, 330, 120] }), g = T.g, r = mulberry32(44);
  /* alfombra (x -390…-130, z 410…560 → en la textura: u = x + 560, v = 760 - z) */
  const ax = -390 + 560, ay = 760 - 560, aw = 260, ah = 150, cols = [[160, 66, 56], [58, 70, 108], [206, 166, 100], [230, 216, 192], [120, 50, 50]];
  g.save(); g.translate(ax, ay);
  wcWash(g, rectP(0, 0, aw, ah), cols[0], .96, { reserve: false, mode: 'source-over', amt: .8, seed: 3, step: 10 });
  wcWash(g, rectP(10, 10, aw - 20, ah - 20), cols[1], .95, { reserve: false, mode: 'source-over', amt: .6, seed: 4, step: 10 });
  wcWash(g, rectP(22, 22, aw - 44, ah - 44), cols[0], .95, { reserve: false, mode: 'source-over', amt: .6, seed: 5, step: 10 });
  for (let i = 0; i < 4; i++) { const cx = 50 + i * 53, cy = ah / 2; for (const [k, c] of [[30, cols[2]], [20, cols[3]], [10, cols[1]]]) { g.fillStyle = cssc(c, .95); g.beginPath(); g.moveTo(cx, cy - k * 1.2); g.lineTo(cx + k, cy); g.lineTo(cx, cy + k * 1.2); g.lineTo(cx - k, cy); g.closePath(); g.fill(); } }
  for (let k = 0; k < 2; k++) for (let x = 14; x < aw - 14; x += 9) { g.fillStyle = cssc(cols[2], .9); g.beginPath(); const y = k ? ah - 16 : 16; g.moveTo(x, y - 3); g.lineTo(x + 4.5, y); g.lineTo(x, y + 3); g.lineTo(x - 4.5, y); g.fill(); }
  for (const y of [-6, ah]) for (let x = 2; x < aw; x += 4) { g.strokeStyle = 'rgba(236,222,196,.9)'; g.lineWidth = .8; g.beginPath(); g.moveTo(x, y < 0 ? 0 : ah); g.lineTo(x + (r() - .5) * 2, y < 0 ? -6 : ah + 6); g.stroke(); }   // flecos
  for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(${r() < .5 ? '40,20,30' : '255,240,220'},${r() * .15})`; g.fillRect(r() * aw, r() * ah, 1, 1); }
  g.restore();
  wcTex(g, T.c.width, T.c.height, .2, .2);
  return T;
}
/* lo que se ve por la ventana: cielo de mañana, azoteas de ladrillo, un depósito de agua y una chimenea que humea */
function estudioOutside() {
  const T = tex(700, 360, 1.2), g = T.g, r = mulberry32(5);
  const sk = g.createLinearGradient(0, 0, 0, 360); sk.addColorStop(0, 'rgb(150,184,214)'); sk.addColorStop(.55, 'rgb(250,226,186)'); sk.addColorStop(1, 'rgb(255,214,160)'); g.fillStyle = sk; g.fillRect(0, 0, 700, 360);
  const sg = g.createRadialGradient(140, 210, 4, 140, 210, 220); sg.addColorStop(0, 'rgba(255,250,226,1)'); sg.addColorStop(.12, 'rgba(255,236,190,.8)'); sg.addColorStop(1, 'rgba(255,220,170,0)'); g.fillStyle = sg; g.fillRect(0, 0, 700, 360);
  for (let i = 0; i < 6; i++) wcWash(g, ellP(80 + r() * 560, 40 + r() * 110, 50 + r() * 70, 8 + r() * 6, 20), [255, 246, 230], .55, { reserve: false, mode: 'source-over', amt: 4, seed: i, edge: false });
  /* azoteas lejanas (claras, con neblina) y cercanas (contraluz) */
  let x = -10; while (x < 700) { const w = 50 + r() * 90, h = 70 + r() * 110; wcWash(g, rectP(x, 360 - h, w, h), mixc([200, 170, 160], [250, 220, 190], .5), .8, { reserve: false, mode: 'source-over', amt: 1, seed: x, edge: false }); x += w + 4; }
  x = -20; while (x < 700) { const w = 80 + r() * 120, h = 40 + r() * 70; wcWash(g, rectP(x, 360 - h, w, h), [150, 96, 84], .95, { reserve: false, mode: 'source-over', amt: .8, seed: x + 3 });
    for (let k = 0; k < 4; k++) { g.fillStyle = 'rgba(255,214,150,.5)'; g.fillRect(x + 10 + k * w / 4, 360 - h + 14, 8, 12); } x += w + 10; }
  /* depósito de agua de madera sobre patas y chimenea */
  const tx = 470; g.strokeStyle = 'rgb(84,60,52)'; g.lineWidth = 3; for (const dx of [0, 22, 44]) { g.beginPath(); g.moveTo(tx + dx, 300); g.lineTo(tx + 22 + (dx - 22) * .6, 250); g.stroke(); }
  wcWash(g, rectP(tx - 4, 200, 52, 52), [130, 92, 70], .97, { reserve: false, mode: 'source-over', amt: .6, seed: 9 }); wcWash(g, [[tx - 8, 202], [tx + 22, 176], [tx + 52, 202]], [96, 70, 60], .97, { reserve: false, mode: 'source-over', amt: .5, seed: 10 });
  for (let k = 0; k < 4; k++) { g.fillStyle = 'rgba(60,40,30,.6)'; g.fillRect(tx - 4, 210 + k * 12, 52, 1.6); }
  wcWash(g, rectP(250, 230, 18, 70), [130, 80, 70], .97, { reserve: false, mode: 'source-over', amt: .4, seed: 11 });
  return T;
}
/* ---------- la persiana: lamas finas, inclinadas, con borde que brilla ---------- */
function blinds(t) {
  const W_ = SOL.win, P = (W_.y1 - W_.y0) / SOL.n;
  for (let k = 0; k < SOL.n; k++) {
    const y = W_.y0 + k * P + P * (1 - SOL.open) * .5, th = P * (1 - SOL.open), q = [[W_.x + 5, y - th * .4, W_.z0], [W_.x + 5, y - th * .4, W_.z1], [W_.x + 1, y + th * .6, W_.z1], [W_.x + 1, y + th * .6, W_.z0]];
    const Pq = poly3(q); if (!Pq) continue; ctx.fillStyle = cssc(mixc([226, 216, 196], SOL.amb, .25)); ctx.fill(Pq);
    const a = PJ(W_.x + 5, y - th * .4, W_.z0), b = PJ(W_.x + 5, y - th * .4, W_.z1); ctx.strokeStyle = cssc(SOL.col, .8 * SOL.on * SOL.k); ctx.lineWidth = Math.max(.6, PS(W_.z0) * 1.2); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
  }
  /* cordones */
  for (const z of [W_.z0 + 30, W_.z1 - 30]) { const a = PJ(W_.x + 6, W_.y0 - 6, z), b = PJ(W_.x + 6, W_.y1 + 30, z); ctx.strokeStyle = 'rgba(230,220,200,.8)'; ctx.lineWidth = Math.max(.5, PS(z) * .8); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
  const c = PJ(W_.x + 6, W_.y1 + 30, W_.z1 - 30); ctx.fillStyle = 'rgb(200,180,150)'; ctx.beginPath(); ctx.arc(c[0], c[1], Math.max(1, PS(W_.z1) * 2.5), 0, TAU); ctx.fill();
}
/* ---------- la arquitectura (fondo, paredes, suelo, techo, ventana, pasillo y puerta) ---------- */
const doorAng = t => (typeof FILM !== 'undefined' && FILM.door) ? FILM.door(t) : 0;
function estudioShell(t, o = {}) {
  const ZB = ES.ZB, [dx0, dx1, dy] = ES.DOOR, u = x => (x - ES.X0) / (ES.X1 - ES.X0), v = y => (y - ES.Y0) / -ES.Y0;
  /* fuera de la ventana (detrás de la pared izquierda) */
  vplane(ESX.out, [-760, 220], [-760, 720], -330, 40);
  /* pasillo detrás de la puerta: penumbra con una lámpara cálida al fondo */
  if (doorAng(t) > .01) {
    hplane(ESX.hallF, dx0 - 20, dx1 + 40, ZB, ZB + 240, 0);
    vplane(ESX.hall, [dx0 - 20, ZB + 240], [dx1 + 40, ZB + 240], -300, 0);
    vplane(ESX.hall, [dx1 + 40, ZB], [dx1 + 40, ZB + 240], -300, 0, { u1: .9 });
    
    const L = PJ(dx0 + 60, -190, ZB + 236); LGT(L[0], L[1], 120 * PS(ZB + 236), '255,190,120', .5);
  }
  /* la puerta (gira hacia el pasillo sobre la bisagra izquierda) */
  put(ZB + 1, () => drawDoor(t));
  /* techo de tablas con vigas */
  hplane(ESX.ceil, ES.X0, ES.X1, ES.ZF, ZB, ES.Y0);
  for (const z of [710, 520, 330]) box3({ x0: ES.X0, x1: ES.X1, y0: ES.Y0, y1: ES.Y0 + 22, z0: z - 9, z1: z + 9 }, { front: ESX.beam, bottom: [70, 48, 36] });
  /* suelo */
  hplane(ESX.floor, ES.X0, ES.X1, ES.ZF, ZB, 0);
  solOn({ id: 'floor', t: 'h', y: 0, x0: ES.X0, x1: ES.X1, z0: ES.ZF, z1: ZB, occ: ESX.occFloor || [] });
  /* pared del fondo en tres piezas alrededor de la puerta */
  vplane(ESX.wall, [ES.X0, ZB], [dx0, ZB], ES.Y0, 0, { u1: u(dx0) });
  vplane(ESX.wall, [dx0, ZB], [dx1, ZB], ES.Y0, dy, { u0: u(dx0), u1: u(dx1), v1: v(dy) });
  vplane(ESX.wall, [dx1, ZB], [ES.X1, ZB], ES.Y0, 0, { u0: u(dx1) });
  /* marco de la puerta */
  for (const q of [[[dx0 - 8, dy - 8, ZB - 1], [dx1 + 8, dy - 8, ZB - 1], [dx1 + 8, dy, ZB - 1], [dx0 - 8, dy, ZB - 1]], [[dx0 - 8, dy, ZB - 1], [dx0, dy, ZB - 1], [dx0, 0, ZB - 1], [dx0 - 8, 0, ZB - 1]], [[dx1, dy, ZB - 1], [dx1 + 8, dy, ZB - 1], [dx1 + 8, 0, ZB - 1], [dx1, 0, ZB - 1]]]) { const P = poly3(q); if (P) { ctx.fillStyle = 'rgb(214,204,186)'; ctx.fill(P); ctx.strokeStyle = 'rgba(80,60,50,.5)'; ctx.lineWidth = .8; ctx.stroke(P); } }
  solOn({ id: 'wall', t: 'vz', z: ZB, x0: ES.X0, x1: ES.X1, y0: ES.Y0, y1: 0, occ: ESX.occWall || [] });
  /* panel de yeso (algo delante del ladrillo) */
  const pz = ZB - 2; vplane(ESX.plaster, [-330, pz], [60, pz], -280, -95);
  const ps = poly3([[60, -280, pz], [62, -278, pz], [62, -93, pz], [-328, -93, pz], [-330, -95, pz], [60, -95, pz]]); if (ps) { ctx.fillStyle = 'rgba(60,40,40,.25)'; ctx.fill(ps); }
  solOn({ id: 'panel', t: 'vz', z: pz, x0: -330, x1: 60, y0: -280, y1: -95, occ: ESX.occWall || [], ambA: 0 });
  /* pared izquierda con el hueco de la ventana */
  const W_ = SOL.win, uz = z => (z - 300) / 460, ZL = [-560, 300], wl = (z0, z1, y0, y1) => vplane(ESX.wallL, [-560, z0], [-560, z1], y0, y1, { u0: uz(z0), u1: uz(z1), v0: v(y0), v1: v(y1) });
  wl(300, W_.z0, ES.Y0, 0); wl(W_.z1, ZB, ES.Y0, 0); wl(W_.z0, W_.z1, ES.Y0, W_.y0); wl(W_.z0, W_.z1, W_.y1, 0);
  /* derrame del hueco (grosor del muro) y alféizar */
  const rv = (pts, c) => { const P = poly3(pts); if (P) { ctx.fillStyle = cssc(c); ctx.fill(P); } };
  rv([[-560, W_.y0, W_.z1], [-580, W_.y0, W_.z1], [-580, W_.y1, W_.z1], [-560, W_.y1, W_.z1]], [176, 156, 150]);
  rv([[-560, W_.y0, W_.z0], [-580, W_.y0, W_.z0], [-580, W_.y0, W_.z1], [-560, W_.y0, W_.z1]], [150, 130, 130]);
  rv([[-548, W_.y1, W_.z0 - 10], [-548, W_.y1, W_.z1 + 10], [-580, W_.y1, W_.z1 + 10], [-580, W_.y1, W_.z0 - 10]], [226, 214, 196]);
  rv([[-548, W_.y1, W_.z0 - 10], [-548, W_.y1, W_.z1 + 10], [-548, W_.y1 + 5, W_.z1 + 10], [-548, W_.y1 + 5, W_.z0 - 10]], [190, 176, 160]);
  /* resplandor de la ventana */
  const wc = PJ(W_.x, (W_.y0 + W_.y1) / 2, (W_.z0 + W_.z1) / 2); LGT(wc[0], wc[1], 300 * PS(W_.z1), '255,222,160', .58 * SOL.on * SOL.k); const wf = PJ(W_.x + 260, -60, (W_.z0 + W_.z1) / 2 + 150); LGT(wf[0], wf[1], 420 * PS(W_.z1), '255,200,140', .18 * SOL.on * SOL.k);
  /* pared derecha */
  vplane(ESX.wallR, [ES.X1, ZB], [ES.X1, 300], ES.Y0, 0);
  /* zócalo */
  rv([[ES.X0, -9, ZB - 1], [dx0 - 8, -9, ZB - 1], [dx0 - 8, 0, ZB - 1], [ES.X0, 0, ZB - 1]], [110, 80, 62]); rv([[dx1 + 8, -9, ZB - 1], [ES.X1, -9, ZB - 1], [ES.X1, 0, ZB - 1], [dx1 + 8, 0, ZB - 1]], [110, 80, 62]);
  /* vigas (delante del techo, en la lista) */
  put(W_.z0 - 1, () => blinds(t));
}
function drawDoor(t) {
  const [dx0, dx1, dy] = ES.DOOR, a = doorAng(t), w = dx1 - dx0, b = [dx0 + Math.cos(a) * w, ES.ZB + Math.sin(a) * w];
  ctx.save(); if (a > .02) clip3([[dx0, dy, ES.ZB], [dx1, dy, ES.ZB], [dx1, 0, ES.ZB], [dx0, 0, ES.ZB]]);
  if (ESX.door) vplane(ESX.door, [dx0, ES.ZB + .5], b, dy, 0, { n: a > .02 ? 24 : 1 });
  else { const P = poly3([[dx0, dy, ES.ZB], [b[0], dy, b[1]], [b[0], 0, b[1]], [dx0, 0, ES.ZB]]); if (P) { ctx.fillStyle = 'rgb(120,78,50)'; ctx.fill(P); } }
  if (a > .02) amb3([[dx0, dy, ES.ZB + .5], [b[0], dy, b[1]], [b[0], 0, b[1]], [dx0, 0, ES.ZB + .5]], .3 * clamp(a));
  ctx.restore();
}
