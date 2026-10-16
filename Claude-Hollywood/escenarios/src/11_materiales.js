/* =====================================================================
   ESCENARIOS · MATERIALES: cada uno es un pintor que devuelve una textura (tex) en unidades de mundo.
   El detalle sale de pintar pieza por pieza lo que el material ES (cada ladrillo, cada tabla, cada hebra)
   y luego desgastarlo con lo que le pasó (cal vieja, salitre, hollín, pasos, rayones).
   ===================================================================== */
/* ---------- ladrillo visto desgastado ---------- */
function matBrick(w, h, o = {}) {
  const T = tex(w, h, o.d ?? 1.6), g = T.g, r = mulberry32(o.seed ?? 7);
  const mortar = o.mortar ?? [178, 166, 148], BW = o.bw ?? 21.5, BH = o.bh ?? 6.5, J = o.j ?? 1.3;
  const cols = o.cols ?? [[150, 70, 50], [168, 86, 58], [132, 60, 44], [182, 104, 72], [120, 56, 46], [158, 96, 76], [142, 78, 58], [174, 78, 52]];
  g.fillStyle = cssc(mortar); g.fillRect(0, 0, w, h);
  for (let i = 0; i < w * h / 22; i++) { g.fillStyle = `rgba(${r() < .5 ? '90,80,70' : '240,232,220'},${r() * .2})`; g.fillRect(r() * w, r() * h, .7, .7); }
  let row = 0;
  for (let y = h - BH - J / 2; y > -BH; y -= BH + J, row++) {
    const off = (row % 2) * (BW + J) / 2 + (o.bond === 'random' ? r() * BW : 0);
    for (let x = -off - BW; x < w; x += BW + J) {
      const bx = x + (r() - .5) * .5, by = y + (r() - .5) * .35, bw = BW + (r() - .5) * .9, bh = BH + (r() - .5) * .5;
      let c = cols[Math.floor(r() * cols.length)]; c = shc(c, (r() - .5) * .16);
      /* esquinas mordidas: el ladrillo viejo pierde los cantos */
      const k = () => r() < .35 ? .6 + r() * 1.6 : r() * .4;
      const P = [[bx + k(), by], [bx + bw - k(), by], [bx + bw, by + k()], [bx + bw, by + bh - k()], [bx + bw - k(), by + bh], [bx + k(), by + bh], [bx, by + bh - k()], [bx, by + k()]];
      const path = pPolys([P]), gr = g.createLinearGradient(0, by, 0, by + bh);
      gr.addColorStop(0, cssc(shc(c, .1))); gr.addColorStop(1, cssc(shc(c, -.14))); g.fillStyle = gr; g.fill(path);
      g.save(); g.clip(path);
      for (let m = 0; m < 4; m++) { g.fillStyle = cssc(shc(c, r() < .5 ? -.25 : .2), .22 + r() * .2); g.beginPath(); g.ellipse(bx + r() * bw, by + r() * bh, 1 + r() * 4, .6 + r() * 1.8, r() * 3, 0, TAU); g.fill(); }
      for (let m = 0; m < 10; m++) { g.fillStyle = `rgba(40,20,14,${r() * .35})`; g.fillRect(bx + r() * bw, by + r() * bh, .5, .5); }
      if (r() < .12) { g.fillStyle = 'rgba(60,30,24,.35)'; g.fillRect(bx, by, bw, bh); }   // ladrillo quemado
      g.restore();
      g.strokeStyle = 'rgba(255,236,214,.22)'; g.lineWidth = .5; g.beginPath(); g.moveTo(bx + 1, by + .3); g.lineTo(bx + bw - 1, by + .3); g.stroke();      // canto que recibe luz
      g.strokeStyle = 'rgba(40,24,20,.4)'; g.lineWidth = .8; g.beginPath(); g.moveTo(bx + .5, by + bh + .4); g.lineTo(bx + bw, by + bh + .4); g.lineTo(bx + bw + .4, by + .8); g.stroke();   // sombra en la junta
    }
  }
  /* cal vieja: restos de pintura blanca en zonas, con borde de pincel seco */
  if (o.whitewash !== false) {
    const lw = Math.ceil(w / 2), lh = Math.ceil(h / 2), m = mk(lw, lh), mg = m.getContext('2d'), im = mg.createImageData(lw, lh);
    for (let j = 0; j < lh; j++) for (let i = 0; i < lw; i++) { const v = FBM(i * .012 + 5, j * .018 + 2, 5) + N2(i * .2, j * .2) * .12 - (o.wash ?? .12), k = (j * lw + i) * 4; im.data[k] = 236; im.data[k + 1] = 228; im.data[k + 2] = 214; im.data[k + 3] = clamp(v * 4) * 200; }
    mg.putImageData(im, 0, 0); g.save(); g.globalAlpha = .75; g.drawImage(m, 0, 0, w, h); g.restore();
  }
  /* salitre abajo, hollín que chorrea desde arriba */
  const ef = g.createLinearGradient(0, h, 0, h - 60); ef.addColorStop(0, 'rgba(244,240,230,.45)'); ef.addColorStop(1, 'rgba(244,240,230,0)'); g.fillStyle = ef; g.fillRect(0, h - 60, w, 60);
  for (let i = 0; i < (o.soot ?? 6); i++) { const x = r() * w, ww = 8 + r() * 30, ll = 30 + r() * 120, sg = g.createLinearGradient(0, 0, 0, ll); sg.addColorStop(0, 'rgba(40,30,30,.3)'); sg.addColorStop(1, 'rgba(40,30,30,0)'); g.fillStyle = sg; g.globalCompositeOperation = 'multiply'; g.fillRect(x, 0, ww, ll); g.globalCompositeOperation = 'source-over'; }
  wcTex(g, T.c.width, T.c.height, .35, .3);
  return T;
}
/* ---------- yeso pintado (con paneles, grietas finas y roces) ---------- */
function matPlaster(w, h, o = {}) {
  const T = tex(w, h, o.d ?? 1.4), g = T.g, r = mulberry32(o.seed ?? 3), c = o.c ?? [232, 222, 202];
  const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, cssc(shc(c, .04))); gr.addColorStop(1, cssc(shc(c, -.08))); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  g.globalCompositeOperation = 'multiply';
  for (let i = 0; i < 40; i++) { const x = r() * w, y = r() * h, rr = 20 + r() * 90, rg = g.createRadialGradient(x, y, 0, x, y, rr), cc = r() < .5 ? [214, 200, 176] : [226, 214, 200]; rg.addColorStop(0, cssc(cc, .35)); rg.addColorStop(1, cssc(cc, 0)); g.fillStyle = rg; g.fillRect(x - rr, y - rr, rr * 2, rr * 2); }
  g.globalCompositeOperation = 'source-over';
  /* pasadas de llana */
  for (let i = 0; i < 70; i++) { const x = r() * w, y = r() * h, a = r() * TAU, l = 20 + r() * 50; g.strokeStyle = `rgba(${r() < .5 ? '255,250,240' : '150,130,110'},${.05 + r() * .06})`; g.lineWidth = 2 + r() * 5; g.beginPath(); g.arc(x, y, l, a, a + .5 + r() * .6); g.stroke(); }
  /* grietas capilares */
  for (let i = 0; i < (o.cracks ?? 4); i++) { let x = r() * w, y = r() * h * .8; const pts = [[x, y]]; for (let k = 0; k < 14; k++) { x += (r() - .3) * 9; y += 2 + r() * 7; pts.push([x, y]); } wcInk(g, pts, .5, .35, i * 7, .3, [90, 76, 64]); }
  if (o.panels) for (const px of o.panels) { g.fillStyle = 'rgba(120,100,80,.25)'; g.fillRect(px, 0, 1, h); g.fillStyle = 'rgba(255,250,240,.35)'; g.fillRect(px + 1, 0, 1, h); }
  /* roces y suciedad abajo */
  const sd = g.createLinearGradient(0, h, 0, h - 40); sd.addColorStop(0, 'rgba(110,90,70,.25)'); sd.addColorStop(1, 'rgba(110,90,70,0)'); g.fillStyle = sd; g.fillRect(0, h - 40, w, 40);
  for (let i = 0; i < 12; i++) { g.strokeStyle = `rgba(80,66,56,${.08 + r() * .1})`; g.lineWidth = .6 + r(); const x = r() * w, y = h - 10 - r() * 60; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 6 + r() * 20, y + (r() - .5) * 4); g.stroke(); }
  wcTex(g, T.c.width, T.c.height, .3, .25);
  return T;
}
/* ---------- madera: veta con nudos, por tablas ---------- */
function woodGrain(g, x, y, w, h, c, r, o = {}) {
  const gr = g.createLinearGradient(x, y, x, y + h); gr.addColorStop(0, cssc(shc(c, .08))); gr.addColorStop(1, cssc(shc(c, -.1))); g.fillStyle = gr; g.fillRect(x, y, w, h);
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  const n = Math.max(3, Math.round(h / (o.gap ?? 1.6))), ph = r() * 50, fq = o.fq ?? .02;
  for (let i = 0; i < n; i++) {
    const yy = y + (i + .5) * h / n, a = .06 + r() * .16, dk = r() < .7;
    g.strokeStyle = dk ? `rgba(70,40,24,${a})` : `rgba(255,236,200,${a * .7})`; g.lineWidth = .3 + r() * .7; g.beginPath();
    for (let xx = x; xx <= x + w; xx += 3) { const v = yy + N2(xx * fq + ph, i * .7) * (o.wave ?? 2.2) + Math.sin(xx * .01 + i) * .4; xx === x ? g.moveTo(xx, v) : g.lineTo(xx, v); } g.stroke();
  }
  if (o.knots !== false) for (let k = 0; k < (o.nk ?? 1); k++) if (r() < .45) { const kx = x + r() * w, ky = y + r() * h, kr = 1 + r() * 2.5; for (let j = 4; j > 0; j--) { g.strokeStyle = `rgba(70,40,24,${.12 + j * .05})`; g.lineWidth = .5; g.beginPath(); g.ellipse(kx, ky, kr * j * 1.8, kr * j * .7, 0, 0, TAU); g.stroke(); } g.fillStyle = 'rgba(60,34,20,.55)'; g.beginPath(); g.ellipse(kx, ky, kr * 1.2, kr * .6, 0, 0, TAU); g.fill(); }
  g.restore();
}
function matWood(w, h, o = {}) {
  const T = tex(w, h, o.d ?? 1.4), g = T.g, r = mulberry32(o.seed ?? 11), c = o.c ?? [150, 98, 62], pw = o.plank ?? h;
  for (let y = 0; y < h; y += pw) { const cc = shc(c, (r() - .5) * .14); woodGrain(g, 0, y, w, Math.min(pw, h - y), cc, r, o); if (y > 0) { g.fillStyle = 'rgba(40,22,14,.5)'; g.fillRect(0, y - .4, w, .8); } }
  if (o.scratch) for (let i = 0; i < o.scratch; i++) { const x = r() * w, y = r() * h, a = (r() - .5) * .6, l = 4 + r() * 18; g.strokeStyle = `rgba(250,226,190,${.2 + r() * .25})`; g.lineWidth = .4; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
  wcTex(g, T.c.width, T.c.height, .3, .22);
  return T;
}
/* ---------- parqué en espiga (vista desde arriba; u = x, v del fondo al frente) ---------- */
function matParquet(w, h, o = {}) {
  const T = tex(w, h, o.d ?? 1.3), g = T.g, r = mulberry32(o.seed ?? 21), pw = o.pw ?? 9, L = pw * (o.n ?? 5);
  const cols = o.cols ?? [[192, 140, 88], [176, 122, 76], [206, 158, 104], [168, 112, 70], [184, 130, 84], [156, 104, 64]];
  g.fillStyle = 'rgb(70,46,30)'; g.fillRect(0, 0, w, h);
  /* espiga ortogonal (H_i y V_i en escalera, períodos (pw,pw) y (L,-L)) girada 45° para que la espina corra hacia el fondo */
  const cx = w / 2, cy = h / 2, rot = o.spine === 'z' ? (x, y) => [cx + (x - y) * Math.SQRT1_2, cy + (x + y) * Math.SQRT1_2] : (x, y) => [cx + (x + y) * Math.SQRT1_2, cy + (y - x) * Math.SQRT1_2], Rn = Math.hypot(w, h) * .75;
  const plank = (x, y, ww, hh, horiz) => {
    const pts = [[x, y], [x + ww, y], [x + ww, y + hh], [x, y + hh]].map(p => rot(p[0], p[1])), bb = bbx(pts);
    if (bb[2] < -2 || bb[0] > w + 2 || bb[3] < -2 || bb[1] > h + 2) return;
    const c = shc(cols[Math.floor(r() * cols.length)], (r() - .5) * .1), P = pPolys([pts]);
    g.fillStyle = cssc(c); g.fill(P);
    g.save(); g.clip(P);
    /* veta a lo largo de la tabla */
    const a = pts[0], b = horiz ? pts[1] : pts[3], side = horiz ? pts[3] : pts[1], d = [b[0] - a[0], b[1] - a[1]], e = [(side[0] - a[0]), (side[1] - a[1])];
    for (let k = 0; k < 6; k++) { const f = (k + .5) / 6 + (r() - .5) * .08; g.strokeStyle = r() < .7 ? `rgba(90,56,30,${.12 + r() * .18})` : `rgba(250,220,170,${.1 + r() * .1})`; g.lineWidth = .3 + r() * .5; g.beginPath(); for (let s = 0; s <= 8; s++) { const u = s / 8, wv = N2(u * 3 + k, f * 9 + r()) * .07; g.lineTo(a[0] + d[0] * u + e[0] * (f + wv), a[1] + d[1] * u + e[1] * (f + wv)); } g.stroke(); }
    const sh = g.createLinearGradient(a[0], a[1], side[0], side[1]); sh.addColorStop(0, 'rgba(255,240,210,.12)'); sh.addColorStop(1, 'rgba(60,36,20,.12)'); g.fillStyle = sh; g.fill(P);
    g.restore();
    g.strokeStyle = 'rgba(52,32,20,.75)'; g.lineWidth = .55; g.stroke(P);
  };
  const N = Math.ceil(Rn / pw) + 2, M = Math.ceil(Rn / L) + 2;
  for (let m = -M; m <= M; m++) for (let i = -N; i <= N; i++) {
    plank(i * pw + m * L, i * pw - m * L, L, pw, true);
    plank(L + i * pw + m * L, pw - L + i * pw - m * L, pw, L, false);
  }
  /* barniz satinado, camino gastado, polvo en las juntas y rayones */
  g.globalCompositeOperation = 'multiply'; for (let i = 0; i < 18; i++) { const x = r() * w, y = r() * h, rr = 40 + r() * 140, rg = g.createRadialGradient(x, y, 0, x, y, rr); rg.addColorStop(0, `rgba(150,110,80,${.15 + r() * .15})`); rg.addColorStop(1, 'rgba(150,110,80,0)'); g.fillStyle = rg; g.fillRect(x - rr, y - rr, rr * 2, rr * 2); }
  g.globalCompositeOperation = 'source-over';
  if (o.path) { const [px0, py0, px1, py1, pr] = o.path; const lg = g.createLinearGradient(px0, py0, px1, py1); g.save(); g.lineCap = 'round'; g.strokeStyle = 'rgb(236,214,180)'; for (let k = 0; k < 6; k++) { g.globalAlpha = .025; g.lineWidth = pr * (1 - k * .14); g.beginPath(); g.moveTo(px0, py0); g.quadraticCurveTo((px0 + px1) / 2, py0 - 30, px1, py1); g.stroke(); } g.restore(); }
  for (let i = 0; i < 90; i++) { const x = r() * w, y = r() * h, a = r() * TAU, l = 3 + r() * 16; g.strokeStyle = `rgba(250,232,200,${.08 + r() * .14})`; g.lineWidth = .35; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
  wcTex(g, T.c.width, T.c.height, .3, .25);
  return T;
}
/* ---------- lino (sábanas): trama fina, irregularidades del hilo y arrugas suaves ---------- */
function matLinen(w, h, o = {}) {
  const T = tex(w, h, o.d ?? 1.6), g = T.g, r = mulberry32(o.seed ?? 5), c = o.c ?? [234, 228, 214];
  g.fillStyle = cssc(c); g.fillRect(0, 0, w, h);
  for (let y = 0; y < h; y += .9) { g.fillStyle = `rgba(${r() < .5 ? '120,110,96' : '255,252,244'},${.04 + r() * .05})`; g.fillRect(0, y, w, .45); }
  for (let x = 0; x < w; x += .9) { g.fillStyle = `rgba(120,110,96,${.03 + r() * .04})`; g.fillRect(x, 0, .45, h); }
  for (let i = 0; i < w * h / 60; i++) { g.fillStyle = `rgba(110,98,84,${.08 + r() * .1})`; g.fillRect(r() * w, r() * h, 2 + r() * 6, .5); }   // hilos gruesos (slubs)
  for (let i = 0; i < (o.folds ?? 10); i++) { const y = r() * h, a = .05 + r() * .08; g.strokeStyle = `rgba(150,136,120,${a})`; g.lineWidth = 2 + r() * 5; g.beginPath(); for (let x = 0; x <= w; x += 6) g.lineTo(x, y + N2(x * .02, i) * 14); g.stroke(); g.strokeStyle = `rgba(255,252,246,${a})`; g.lineWidth = 2; g.beginPath(); for (let x = 0; x <= w; x += 6) g.lineTo(x, y - 3 + N2(x * .02, i) * 14); g.stroke(); }
  wcTex(g, T.c.width, T.c.height, .22, .2);
  return T;
}
/* ---------- color liso pintado (para caras pequeñas) ---------- */
function matWash(w, h, c, o = {}) { const T = tex(w, h, o.d ?? 1.2), g = T.g; wcWash(g, rectP(0, 0, w, h), c, .95, { reserve: false, mode: 'source-over', amt: .3, seed: o.seed ?? 1, edge: false, step: 12 }); wcTex(g, T.c.width, T.c.height, .3, .25); return T; }
/* ---------- sombra ambiente horneada: el tono de la luz que no es sol (violeta de mañana, azul de noche) se multiplica
   UNA vez en la textura en vez de pintarse en cada cuadro ---------- */
function texShade(T, col, a) { const c = T.c, g = c.getContext('2d'); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'multiply'; g.globalAlpha = a; g.fillStyle = cssc(col); g.fillRect(0, 0, c.width, c.height); g.restore(); return T; }
function texShadeKeep(T, col, a) { const c = T.c, g = c.getContext('2d'); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-atop'; g.globalAlpha = a; g.fillStyle = cssc(col); g.globalCompositeOperation = 'multiply'; g.fillRect(0, 0, c.width, c.height); g.globalCompositeOperation = 'destination-in'; g.globalAlpha = 1; g.drawImage(c, 0, 0); g.restore(); return T; }
