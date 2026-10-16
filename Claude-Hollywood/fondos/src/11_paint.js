/* =====================================================================
   PINTORES · las mismas piezas, dos materiales
   ACUARELA  · se reserva el papel, lavados en dos veladuras mal registradas, borde húmedo,
               floraciones de otro color, granulado en el grano, plumilla con bordes perdidos,
               ventanas a pincel seco, más detalle cerca del punto focal.
   PAPEL     · cada capa es una hoja de color con fibras, bisel iluminado, sombra suave sobre
               la de detrás; las ventanas son huecos troquelados y la luz va detrás (caja de luz).
   ===================================================================== */
let CS = 1;                 // escala de la caché (px por unidad)
const FAR = 30000;
const hashS = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const INK = [52, 40, 36];

function itemBox(it) {
  if (it.t === 'win') return [it.x, it.y, it.x + it.w, it.y + it.h];
  if (it.t === 'tree') return [it.x - it.h * .6, it.y - it.h * 1.1, it.x + it.h * .6, it.y + 2];
  if (it.t === 'glow') return [it.x - it.r * 6, it.y - it.r * 6, it.x + it.r * 6, it.y + it.r * 6];
  return bbox(it.pts);
}
function layerBox(L) {
  let b = [1e9, 1e9, -1e9, -1e9];
  for (const it of L.items) { const q = itemBox(it); b = [Math.min(b[0], q[0]), Math.min(b[1], q[1]), Math.max(b[2], q[2]), Math.max(b[3], q[3])]; }
  const m = 24; return [b[0] - m, b[1] - m, b[2] + m, Math.min(b[3] + m, 560)];
}
function newCanvas(box, scale = 1) { const c = mk((box[2] - box[0]) * CS * scale, (box[3] - box[1]) * CS * scale), g = c.getContext('2d'); g.setTransform(CS * scale, 0, 0, CS * scale, -box[0] * CS * scale, -box[1] * CS * scale); return [c, g]; }
/* forma de árbol según tipo (compartida por los dos estilos) */
function treeShapes(it, k = 1) {
  const { x, y, h, kind } = it, s = it.s;
  if (kind === 'cypress') { const w = h * .17; return { trunk: null, crown: [ell(x, y - h * .5, w, h * .52, 26)].map(p => p.map(([px, py]) => [px + N2(py * .08, s) * w * .25 * k, py])) }; }
  if (kind === 'pine') { const cy = y - h * .82, cw = h * .62; const crown = []; for (let i = 0; i <= 26; i++) { const a = PI + i / 26 * PI, r = 1 + .14 * Math.abs(Math.sin(i * 1.7 + s)); crown.push([x + Math.cos(a) * cw * r, cy + Math.sin(a) * h * .2 * r]); } crown.push([x + cw * .7, cy + h * .06], [x - cw * .7, cy + h * .06]); return { trunk: [[x - 1.5, y], [x - .5, cy], [x + 2, cy], [x + 2.5, y]], crown: [crown], branches: [[[x, cy + h * .1], [x - cw * .4, cy + h * .02]], [[x + 1, cy + h * .14], [x + cw * .45, cy + h * .04]]] }; }
  if (kind === 'palm') {
    const tx = x + h * .12 * Math.sin(s), top = [tx, y - h], trunk = strip(sag([x, y], top, -h * .05, 10), h * .045);
    const fr = []; for (let i = 0; i < 7; i++) { const a = -PI / 2 + (i - 3) * .52 + N2(i, s) * .2, L = h * (.42 + .1 * Math.sin(i * 3 + s)), d = [Math.cos(a), Math.sin(a)], tip = [top[0] + d[0] * L, top[1] + d[1] * L * .55 + L * .32], mid = [top[0] + d[0] * L * .5, top[1] + d[1] * L * .35 - L * .08]; const pts = sag(top, tip, 0, 8).map((p, j) => { const t = j / 8; const q = [lerp(lerp(top[0], mid[0], t), lerp(mid[0], tip[0], t), t), lerp(lerp(top[1], mid[1], t), lerp(mid[1], tip[1], t), t)]; return q; }); fr.push(strip(pts, h * .05)); }
    return { trunk, crown: fr, palm: true };
  }
  /* redondo (plátano, castaño): copa lobulada */
  const r = h * .42, cy = y - h * .62, crown = [];
  for (let i = 0; i < 30; i++) { const a = i / 30 * TAU, rr = r * (1 + .13 * Math.abs(Math.sin(a * 3.5 + s)) + .06 * N2(a * 2, s)); crown.push([x + Math.cos(a) * rr * 1.05, cy + Math.sin(a) * rr * .92]); }
  return { trunk: [[x - 2, y], [x - 1.2, cy + r * .4], [x + 1.6, cy + r * .4], [x + 2.4, y]], crown: [crown] };
}
function detailW(L, city, x) { const fx = city.focus + (city.pan[0] + city.pan[1]) / 2 * L.p, d = (x - fx) / city.focusR; return .3 + .7 * Math.exp(-d * d); }

/* ============================ ACUARELA ============================ */
function inkLine(g, pts, w, a, s, lost = .15) {
  const D = densify(pts, 6, false).map((p, i) => [p[0] + N2(i * .3, s) * .7, p[1] + N2(i * .3 + 5, s) * .7]);
  g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = css(INK, a);
  let pen = false; g.beginPath();
  for (let i = 0; i < D.length; i++) { const on = N2(i * .17, s + 3) * .5 + .5 > lost; if (on) { if (pen) g.lineTo(D[i][0], D[i][1]); else { g.moveTo(D[i][0], D[i][1]); pen = true; } } else pen = false; }
  g.lineWidth = w; g.stroke();
}
function renderWC(L, city) {
  const box = layerBox(L), [cnv, g] = newCanvas(box), [lc, lg] = newCanvas(box);
  const hz = c => mixc(c, city.haze, L.haze), sd = hashS(city.id + L.name);
  seed(sd);
  /* 1 · en el orden en que se crearon (de atrás adelante): cada pieza reserva su papel y luego se lava */
  const knock = new Path2D();
  const reserve = pts => { const P = pathPolys([orient(pts)]); knock.addPath(P); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.fillStyle = css(PAPERC); g.fill(P); g.globalCompositeOperation = 'multiply'; };
  const wash = (it, a, cool = 0) => {
    const c0 = hz(it.c), c = cool ? mixc(c0, [70, 84, 130], cool) : c0, bb = bbox(it.pts), s = R() * 99;
    const amt = it.land ? 5 : 2.2 + L.p * 1.6, P1 = pathPolys([wobble(it.pts, amt, s, it.land ? .012 : .04)]);
    const gr = g.createLinearGradient(0, bb[1], 0, bb[3]); gr.addColorStop(0, css(shadeC(c, .1 * (it.grad ?? 1)), 1)); gr.addColorStop(1, css(shadeC(c, -.1 * (it.grad ?? 1)), 1));
    g.globalAlpha = a; g.fillStyle = gr; g.fill(P1);
    const ar = (bb[2] - bb[0]) * (bb[3] - bb[1]);
    if (ar > 400) {   /* segunda veladura, corrida: el registro imperfecto de un lavado real */
      const dx = rnd(-4.5, 4.5), dy = rnd(-3.5, 3.5), P2 = pathPolys([wobble(it.pts.map(p => [p[0] + dx, p[1] + dy]), amt * 1.4, s + 4, .03)]);
      g.globalAlpha = a * .45; g.fillStyle = css(c); g.fill(P2);
    }
    if (it.wet && ar > 1500 && R() < .85) {   /* mojado sobre mojado: otro color que florece dentro */
      g.save(); g.clip(P1); const px = rnd(bb[0], bb[2]), py = rnd(bb[1], bb[3]), rr = Math.max(bb[2] - bb[0], bb[3] - bb[1]) * rnd(.35, .8), cc = R() < .5 ? mixc(c, [196, 118, 84], .45) : mixc(c, [84, 104, 150], .45);
      const rgd = g.createRadialGradient(px, py, 0, px, py, rr); rgd.addColorStop(0, css(cc, .5)); rgd.addColorStop(1, css(cc, 0)); g.globalAlpha = 1; g.fillStyle = rgd; g.fillRect(px - rr, py - rr, rr * 2, rr * 2); g.restore();
    }
    /* borde húmedo: el pigmento se va al borde al secar */
    g.globalAlpha = .3; g.strokeStyle = css(shadeC(c, -.35)); g.lineWidth = it.land ? 2.6 : 1.6; g.stroke(P1);
    return P1;
  };
  const dab = it => {   /* ventana a pincel seco (más probable cerca del punto focal) */
    const dw = detailW(L, city, it.x); if (R() > .35 + .65 * dw) return;
    const c = it.c || mixc(hz(city.winC || [70, 74, 96]), [40, 40, 60], .2), j = () => rnd(-.5, .5);
    g.globalAlpha = rnd(.45, .8); g.fillStyle = css(c);
    g.beginPath(); g.moveTo(it.x + j(), it.y + j()); g.lineTo(it.x + it.w + j(), it.y + j() * 2); g.lineTo(it.x + it.w + j(), it.y + it.h + j()); g.lineTo(it.x + j(), it.y + it.h + j() * 2); g.closePath();
    if (it.arch) { g.moveTo(it.x, it.y + 1); g.arc(it.x + it.w / 2, it.y + 1, it.w / 2, PI, 0); }
    g.fill();
    if (L.ink && dw > .7 && R() < .25 && it.w > 5) { g.globalAlpha = .5; g.strokeStyle = css(INK); g.lineWidth = .6; g.strokeRect(it.x, it.y, it.w, it.h); }
  };
  g.globalCompositeOperation = 'multiply';
  for (const it of L.items) {
    if (it.t === 'win') dab(it);
    else if (it.t === 'solid') { reserve(it.pts); const dw = detailW(L, city, bbox(it.pts)[0]); wash(it, it.land ? .66 : (R() < .12 * dw ? .22 : rnd(.5, .72))); }
    else if (it.t === 'shade') { reserve(it.pts); wash(it, .6, .25); }
    else if (it.t === 'trim') { reserve(it.pts); wash(it, .72); }
    else if (it.t === 'lat') {   /* celosía: lavado claro + trama a plumilla (sin reservar: se ve el cielo) */
      wash(it, .28); const [a, b, c2, d] = it.pts;
      for (let i = 0; i <= it.ny; i++) { const t = i / it.ny, p = [lerp(a[0], d[0], t), lerp(a[1], d[1], t)], q = [lerp(b[0], c2[0], t), lerp(b[1], c2[1], t)]; inkLine(g, [p, q], .9, .6, i); if (i < it.ny) { const t2 = (i + 1) / it.ny, p2 = [lerp(a[0], d[0], t2), lerp(a[1], d[1], t2)], q2 = [lerp(b[0], c2[0], t2), lerp(b[1], c2[1], t2)]; inkLine(g, [p, q2], .6, .45, i + 50, .05); inkLine(g, [q, p2], .6, .45, i + 80, .05); } }
      g.globalCompositeOperation = 'multiply';
    }
    else if (it.t === 'tree') {   /* árboles: manchas húmedas con la sombra abajo */
      const T = treeShapes(it, 1.6), c = hz(it.c);
      for (const q of T.crown) reserve(q); if (T.trunk) reserve(T.trunk);
      if (T.trunk) { g.globalAlpha = .8; g.fillStyle = css(shadeC(c, -.45)); g.fill(pathPolys([T.trunk])); }
      for (const q of T.crown) {
        const P = pathPolys([wobble(q, T.palm ? .6 : 2.4, it.s, .06)]), bb = bbox(q);
        const gr = g.createLinearGradient(bb[0], bb[1], bb[2], bb[3]); gr.addColorStop(0, css(shadeC(c, .22))); gr.addColorStop(.55, css(c)); gr.addColorStop(1, css(shadeC(c, -.28)));
        g.globalAlpha = .78; g.fillStyle = gr; g.fill(P); g.globalAlpha = .3; g.strokeStyle = css(shadeC(c, -.4)); g.lineWidth = 1.4; g.stroke(P);
      }
      if (T.branches) for (const b of T.branches) { g.globalAlpha = .7; g.strokeStyle = css(shadeC(c, -.5)); g.lineWidth = 1.2; g.beginPath(); g.moveTo(...b[0]); g.lineTo(...b[1]); g.stroke(); }
      if (!T.palm && it.kind !== 'cypress') { g.globalAlpha = .35; g.fillStyle = css(shadeC(c, -.35)); const bb = bbox(T.crown[0]); for (let k = 0; k < 7; k++) { const px = rnd(bb[0] + 4, bb[2] - 4), py = rnd((bb[1] + bb[3]) / 2, bb[3] - 3); g.beginPath(); g.ellipse(px, py, rnd(2, 5), rnd(1.5, 3.5), rnd(TAU), 0, TAU); g.fill(); } }
    }
  }
  const masses = L.items.filter(it => it.t === 'solid' || it.t === 'shade' || it.t === 'trim');
  /* 3 · textura: manchas de densidad y granulado, solo donde hay pigmento */
  g.save(); g.clip(knock); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'multiply';
  g.globalAlpha = .55; g.fillStyle = g.createPattern(BLOT, 'repeat'); g.fillRect(0, 0, cnv.width, cnv.height);
  g.globalAlpha = .38 * (city.gran ?? 1); g.fillStyle = g.createPattern(GRAIN, 'repeat'); g.fillRect(0, 0, cnv.width, cnv.height);
  g.restore(); g.setTransform(CS, 0, 0, CS, -box[0] * CS, -box[1] * CS);
  /* 5 · plumilla: líneas con bordes perdidos */
  if (L.ink) {
    for (const it of L.items) {
      if (it.t === 'line' && !it.ink) { g.globalAlpha = .45; g.strokeStyle = css(shadeC(hz(it.c), -.1)); g.lineWidth = it.w; g.stroke(pathLine(wobble(it.pts, .5, R() * 9, .1, false))); g.globalAlpha = 1; }
      else if (it.t === 'line' && it.ink) inkLine(g, it.closed ? [...it.pts, it.pts[0]] : it.pts, Math.max(.7, Math.min(2.2, it.w * .8)), .78, R() * 99, .08);
      else if ((it.t === 'solid' || it.t === 'trim') && it.ink && !it.land) { const dw = detailW(L, city, bbox(it.pts)[0]); if (R() < .4 + .6 * dw) inkLine(g, [...it.pts, it.pts[0]], .9 + .5 * L.p, .55 + .3 * dw, R() * 99, .32 - .2 * dw); }
    }
  } else for (const it of L.items) if (it.t === 'line') { g.globalAlpha = .55; g.strokeStyle = css(shadeC(hz(it.c), -.2)); g.lineWidth = it.w; g.stroke(pathLine(it.pts)); }
  /* 6 · salpicaduras de pigmento en los planos cercanos */
  if (L.p > .7) { const bb = box; for (let i = 0; i < 40; i++) { const it = pick(masses); if (!it) break; const c = hz(it.c), q = it.pts[0]; g.globalAlpha = rnd(.2, .5); g.fillStyle = css(shadeC(c, -.2)); g.beginPath(); g.arc(q[0] + rnd(-40, 40), q[1] + rnd(-30, 30), rnd(.6, 2.2), 0, TAU); g.fill(); } }
  g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  /* luces de noche: papel reservado teñido de amarillo + halo */
  let nl = 0;
  for (const it of L.items) {
    if (it.t === 'win' && it.lit) { const wc = it.warm ? [255, 200, 130] : [255, 222, 150]; lg.globalAlpha = .95; lg.fillStyle = css(wc); lg.shadowColor = css(wc, .8); lg.shadowBlur = 5 * CS; lg.fillRect(it.x + .5, it.y + .5, it.w - 1, it.h - 1); nl++; }
    if (it.t === 'glow') { lg.shadowBlur = 0; const r = it.r * 6, gr = lg.createRadialGradient(it.x, it.y, 0, it.x, it.y, r); gr.addColorStop(0, css(it.c, .9)); gr.addColorStop(.15, css(it.c, .5)); gr.addColorStop(1, css(it.c, 0)); lg.globalAlpha = 1; lg.fillStyle = gr; lg.fillRect(it.x - r, it.y - r, r * 2, r * 2); lg.fillStyle = 'rgba(255,250,235,1)'; lg.beginPath(); lg.arc(it.x, it.y, it.r * .6, 0, TAU); lg.fill(); }
  }
  lg.shadowBlur = 0;
  return { box, img: cnv, light: lc };
}

/* ============================ PAPEL RECORTADO ============================ */
function cutEdge(pts, s, land) { return land ? wobble(pts, 3.2, s, .045) : wobble(pts, .45, s, .25); }
function renderPaper(L, city) {
  const box = layerBox(L), [cnv, g] = newCanvas(box), sd = hashS(city.id + L.name + 'p');
  seed(sd);
  const hz = c => mixc(c, city.hazeP || city.haze, L.haze * .85);
  const all = new Path2D();
  const piece = (pts, c, lift = 0, s = R() * 99, land = false) => {
    const q = orient(cutEdge(pts, s, land)), P = pathPolys([q]); all.addPath(P);
    if (lift) { g.save(); g.shadowColor = 'rgba(30,20,10,.35)'; g.shadowBlur = 2.2 * CS; g.shadowOffsetX = .8 * CS; g.shadowOffsetY = 1.2 * CS; }
    g.fillStyle = css(hz(c)); g.fill(P); if (lift) g.restore();
  };
  const punch = it => { g.save(); g.globalCompositeOperation = 'destination-out'; g.beginPath(); const j = () => rnd(-.25, .25); g.moveTo(it.x + j(), it.y + j()); g.lineTo(it.x + it.w + j(), it.y + j()); g.lineTo(it.x + it.w + j(), it.y + it.h + j()); g.lineTo(it.x + j(), it.y + it.h + j()); g.closePath(); if (it.arch) { g.moveTo(it.x, it.y + .5); g.arc(it.x + it.w / 2, it.y + .5, it.w / 2, PI, 0); } g.fill(); g.restore(); };
  for (const it of L.items) {
    if (it.t === 'win') punch(it);
    else if (it.t === 'solid') piece(it.pts, it.c, 0, R() * 99, it.land);
    else if (it.t === 'shade') piece(it.pts, it.c, 1);
    else if (it.t === 'lat') piece(it.pts, it.c, 0);
    else if (it.t === 'trim') piece(it.pts, it.c, 1);
    else if (it.t === 'line') piece(strip(it.closed ? [...it.pts, it.pts[0]] : it.pts, Math.max(1.1, it.w)), it.c, 1);
    else if (it.t === 'tree') {
      const T = treeShapes(it), c = it.c;
      if (T.trunk) piece(T.trunk, shadeC(c, -.45), 1);
      T.crown.forEach((q, i) => piece(q, i % 2 ? shadeC(c, -.12) : c, 1));
      if (!T.palm && it.kind !== 'cypress') { const q = T.crown[0], bb = bbox(q), cx = (bb[0] + bb[2]) / 2 - (bb[2] - bb[0]) * .12, cy = (bb[1] + bb[3]) / 2 - (bb[3] - bb[1]) * .12; piece(q.map(p => [cx + (p[0] - (bb[0] + bb[2]) / 2) * .62, cy + (p[1] - (bb[1] + bb[3]) / 2) * .58]), shadeC(c, .16), 1); }
    }
  }
  /* troquelado: ventanas y celosías son huecos */
  g.globalCompositeOperation = 'destination-out';
  for (const it of L.items) if (it.t === 'lat') {
    const [a, b, c2, d] = it.pts, P = (u, v) => { const top = [lerp(a[0], b[0], u), lerp(a[1], b[1], u)], bot = [lerp(d[0], c2[0], u), lerp(d[1], c2[1], u)]; return [lerp(top[0], bot[0], v), lerp(top[1], bot[1], v)]; };
    const m = .16;
    for (let i = 0; i < it.ny; i++) for (let k = 0; k < it.nx; k++) {
      const u0 = (k + m) / it.nx, u1 = (k + 1 - m) / it.nx, v0 = (i + m) / it.ny, v1 = (i + 1 - m) / it.ny, um = (u0 + u1) / 2, vm = (v0 + v1) / 2;
      for (const tri of [[P(u0, v0), P(u1, v0), P(um, vm)], [P(u1, v0 + .04 / it.ny), P(u1, v1), P(um + .03 / it.nx, vm)], [P(u0, v1), P(u1, v1), P(um, vm + .02 / it.ny)], [P(u0, v0 + .04 / it.ny), P(u0, v1), P(um - .03 / it.nx, vm)]]) { g.beginPath(); g.moveTo(...tri[0]); g.lineTo(...tri[1]); g.lineTo(...tri[2]); g.closePath(); g.fill(); }
    }
  }
  g.globalCompositeOperation = 'source-over';
  /* fibras del papel */
  const tex = mk(cnv.width, cnv.height), tg = tex.getContext('2d');
  tg.fillStyle = tg.createPattern(FIBER, 'repeat'); tg.fillRect(0, 0, tex.width, tex.height); tg.globalCompositeOperation = 'destination-in'; tg.drawImage(cnv, 0, 0);
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'overlay'; g.globalAlpha = .55; g.drawImage(tex, 0, 0); g.restore();
  /* bisel: borde iluminado arriba a la izquierda, oscuro abajo a la derecha */
  const d = Math.max(1, 1.1 * CS);
  for (const [dx, dy, col, a] of [[d, d, '255,250,236', .55], [-d, -d, '20,14,10', .35]]) {
    tg.globalCompositeOperation = 'source-over'; tg.clearRect(0, 0, tex.width, tex.height); tg.drawImage(cnv, 0, 0);
    tg.globalCompositeOperation = 'source-in'; tg.fillStyle = `rgb(${col})`; tg.fillRect(0, 0, tex.width, tex.height);
    tg.globalCompositeOperation = 'destination-out'; tg.drawImage(cnv, dx, dy);
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-atop'; g.globalAlpha = a; g.drawImage(tex, 0, 0); g.restore();
  }
  /* sombra que esta capa proyecta sobre la de detrás (media resolución, desenfocada) */
  const hs = .5, sh = mk(cnv.width * hs, cnv.height * hs), sg = sh.getContext('2d'), blur = (3 + 9 * L.p) * CS * hs;
  sg.shadowColor = 'rgba(20,12,8,1)'; sg.shadowBlur = blur; sg.shadowOffsetX = FAR; sg.drawImage(cnv, -FAR, 0, sh.width, sh.height);
  /* detrás de los huecos: de día el interior oscuro; de noche la luz */
  const [uc, ug] = newCanvas(box, .5), [gc, gg] = newCanvas(box, .5);
  for (const it of L.items) {
    if (it.t === 'win') { const pad = 1.5; ug.fillStyle = css(mixc(hz(city.winC || [70, 74, 96]), [20, 22, 34], .35)); ug.fillRect(it.x - pad, it.y - pad, it.w + pad * 2, it.h + pad * 2); if (it.lit) { const wc = it.warm ? [255, 196, 120] : [255, 218, 140]; gg.fillStyle = css(wc); gg.fillRect(it.x - pad, it.y - pad, it.w + pad * 2, it.h + pad * 2); } }
    if (it.t === 'lat') { ug.fillStyle = css(hz(city.sky.day[1]), .0); }
    if (it.t === 'glow') { const r = it.r * 5, gr = gg.createRadialGradient(it.x, it.y, 0, it.x, it.y, r); gr.addColorStop(0, css(it.c, 1)); gr.addColorStop(1, css(it.c, 0)); gg.fillStyle = gr; gg.fillRect(it.x - r, it.y - r, r * 2, r * 2); }
  }
  /* los faroles en papel: disco troquelado de luz encima */
  const [fc, fg] = newCanvas(box, .5); let nf = 0;
  for (const it of L.items) if (it.t === 'glow') { nf++; const r = it.r * 7, gr = fg.createRadialGradient(it.x, it.y, 0, it.x, it.y, r); gr.addColorStop(0, css(it.c, .85)); gr.addColorStop(.25, css(it.c, .35)); gr.addColorStop(1, css(it.c, 0)); fg.fillStyle = gr; fg.fillRect(it.x - r, it.y - r, r * 2, r * 2); fg.fillStyle = 'rgba(255,250,236,1)'; fg.beginPath(); fg.arc(it.x, it.y, it.r * .7, 0, TAU); fg.fill(); }
  return { box, img: cnv, shadow: sh, under: uc, glow: gc, flare: nf ? fc : null, off: [(2 + 7 * L.p) * L.shadow, (3 + 9 * L.p) * L.shadow] };
}

/* ============================ CIELO ============================ */
function skyWC(city, night) {
  const S = city.sky, c = mk(W, H), g = c.getContext('2d'), top = night ? S.night[0] : S.day[0], bot = night ? S.night[1] : S.day[1];
  seed(hashS(city.id + 'sky' + night));
  const gr = g.createLinearGradient(0, 0, 0, H * (S.hor ?? .62)); gr.addColorStop(0, css(top)); gr.addColorStop(1, css(bot));
  g.globalAlpha = .82; g.fillStyle = gr; g.fillRect(0, 0, W, H);
  /* floraciones grandes: nubes pintadas mojado sobre mojado */
  g.globalCompositeOperation = 'multiply';
  for (let i = 0; i < 9; i++) { const x = rnd(W), y = rnd(H * .05, H * .5), r = rnd(.12, .32) * W, cc = R() < .5 ? mixc(top, [120, 110, 140], .4) : mixc(bot, [200, 150, 120], .3); const rgd = g.createRadialGradient(x, y, 0, x, y, r); rgd.addColorStop(0, css(cc, .28)); rgd.addColorStop(.7, css(cc, .12)); rgd.addColorStop(1, css(cc, 0)); g.globalAlpha = 1; g.fillStyle = rgd; g.fillRect(x - r, y - r, r * 2, r * 2); }
  g.globalAlpha = .5; g.fillStyle = g.createPattern(BLOT, 'repeat'); g.fillRect(0, 0, W, H);
  g.globalAlpha = .1; g.fillStyle = g.createPattern(GRAIN, 'repeat'); g.fillRect(0, 0, W, H);
  /* papel levantado: claros donde la luz rompe */
  g.globalCompositeOperation = 'destination-out';
  g.save(); g.filter = `blur(${Math.round(14 * U)}px)`; for (let i = 0; i < 6; i++) { const x = rnd(W), y = rnd(H * .08, H * .45), rx = rnd(.05, .14) * W, ry = rx * rnd(.18, .32); const P = pathPolys([wobble(ell(x, y, rx, ry, 30), ry * .6, i * 7, .03)]); g.globalAlpha = rnd(.2, .45); g.fill(P); } g.restore();
  g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
  /* sol o luna: papel reservado con halo */
  const orb = night ? S.moon : S.sun;
  if (orb) { const x = W / 2 + orb[0] * U, y = H / 2 + orb[1] * U, r = orb[2] * U; const hg = g.createRadialGradient(x, y, r, x, y, r * 5); hg.addColorStop(0, css(orb[3], .45)); hg.addColorStop(1, css(orb[3], 0)); g.fillStyle = hg; g.fillRect(x - r * 5, y - r * 5, r * 10, r * 10); g.globalCompositeOperation = 'destination-out'; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); g.globalCompositeOperation = 'source-over'; g.globalAlpha = .55; g.fillStyle = css(orb[3]); g.beginPath(); g.arc(x, y, r * .98, 0, TAU); g.fill(); g.globalAlpha = 1; }
  if (night && S.stars) { g.fillStyle = 'rgba(255,250,236,.85)'; for (let i = 0; i < 120; i++) { g.globalAlpha = rnd(.2, .8); g.beginPath(); g.arc(rnd(W), rnd(H * .5), rnd(.5, 1.4) * U, 0, TAU); g.fill(); } g.globalAlpha = 1; }
  return c;
}
function skyPaper(city, night) {
  const S = city.sky, c = mk(W, H), g = c.getContext('2d'), top = night ? S.night[0] : S.day[0], bot = night ? S.night[1] : S.day[1];
  seed(hashS(city.id + 'skyp' + night));
  g.fillStyle = css(top); g.fillRect(0, 0, W, H);
  /* bandas de papel: cada una tapa a la de arriba y le echa sombra */
  const nb = 6;
  for (let i = 1; i <= nb; i++) {
    const t = i / nb, col = mixc(top, bot, Math.pow(t, .8)), y0 = H * (S.hor ?? .62) * (t * .9), pts = [[0, H]];
    for (let x = 0; x <= W; x += W / 40) pts.push([x, y0 + Math.sin(x / W * TAU * (1 + i * .3) + i * 2) * H * .012 + N2(x * .004, i) * H * .02]);
    pts.push([W, H]);
    g.save(); g.shadowColor = 'rgba(20,14,30,.28)'; g.shadowBlur = 6 * U; g.shadowOffsetY = -2 * U; g.fillStyle = css(col); g.fill(pathPolys([pts])); g.restore();
  }
  const tex = g.createPattern(FIBER, 'repeat'); g.globalCompositeOperation = 'overlay'; g.globalAlpha = .45; g.fillStyle = tex; g.fillRect(0, 0, W, H); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
  const orb = night ? S.moon : S.sun;
  if (orb) { const x = W / 2 + orb[0] * U, y = H / 2 + orb[1] * U, r = orb[2] * U; const hg = g.createRadialGradient(x, y, r, x, y, r * 4); hg.addColorStop(0, css(orb[3], .35)); hg.addColorStop(1, css(orb[3], 0)); g.fillStyle = hg; g.fillRect(x - r * 4, y - r * 4, r * 8, r * 8); g.save(); g.shadowColor = 'rgba(20,14,10,.35)'; g.shadowBlur = 5 * U; g.shadowOffsetX = 2 * U; g.shadowOffsetY = 3 * U; g.fillStyle = css(shadeC(orb[3], .2)); g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); g.restore(); g.fillStyle = css(shadeC(orb[3], .45)); g.beginPath(); g.arc(x - r * .12, y - r * .12, r * .78, 0, TAU); g.fill(); }
  if (night && S.stars) for (let i = 0; i < 110; i++) { const x = rnd(W), y = rnd(H * .5), r = rnd(.6, 1.6) * U; const hg = g.createRadialGradient(x, y, 0, x, y, r * 4); hg.addColorStop(0, 'rgba(255,240,200,.7)'); hg.addColorStop(1, 'rgba(255,240,200,0)'); g.fillStyle = hg; g.fillRect(x - r * 4, y - r * 4, r * 8, r * 8); g.fillStyle = 'rgba(255,252,240,1)'; g.beginPath(); g.arc(x, y, r * .7, 0, TAU); g.fill(); }
  return c;
}
/* nubes: sprites que derivan (unidades de mundo × CS) */
function cloudSprite(city, style, k) {
  seed(hashS(city.id + 'cloud' + style + k));
  const w = rnd(220, 380), h = w * rnd(.22, .32), c = mk(w * CS + 40, h * CS + 40), g = c.getContext('2d'), col = city.cloud || [236, 228, 216];
  g.translate(20, 20); g.scale(CS, CS);
  const blobs = []; for (let i = 0; i < 7; i++) blobs.push([rnd(w * .15, w * .85), rnd(h * .35, h * .7), rnd(h * .25, h * .5)]);
  if (style === 'wc') {
    const P = new Path2D(); for (const [x, y, r] of blobs) P.addPath(pathPolys([wobble(ell(x, y, r * 1.5, r, 22), r * .35, x, .04)]));
    g.save(); g.filter = 'blur(2px)'; g.fillStyle = css(shadeC(col, .1), .55); g.fill(P); g.restore();      /* papel levantado: borde blando */
    g.save(); g.clip(P); const gr = g.createLinearGradient(0, h * .2, 0, h); gr.addColorStop(0, css(col, 0)); gr.addColorStop(.6, css(mixc(col, [118, 112, 146], .5), .32)); gr.addColorStop(1, css(mixc(col, [96, 92, 130], .6), .55)); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.globalCompositeOperation = 'multiply'; g.globalAlpha = .5; g.fillStyle = g.createPattern(BLOT, 'repeat'); g.fillRect(0, 0, w, h); g.restore();
    g.strokeStyle = css(mixc(col, [96, 92, 130], .6), .22); g.lineWidth = 1.4; g.save(); g.beginPath(); g.rect(0, h * .55, w, h); g.clip(); g.stroke(P); g.restore();
  } else {
    for (let layer = 0; layer < 2; layer++) { const P = new Path2D(); for (const [x, y, r] of blobs) { const sc = layer ? .72 : 1; P.addPath(pathPolys([ell(x - (layer ? 6 : 0), y - (layer ? 5 : 0), r * 1.35 * sc, r * sc, 20, PI, TAU).concat([[x + r * 1.35 * sc, y + r * .5], [x - r * 1.35 * sc, y + r * .5]])])); }
      g.save(); g.shadowColor = 'rgba(30,24,40,.3)'; g.shadowBlur = 4; g.shadowOffsetY = 3; g.fillStyle = css(layer ? shadeC(col, .12) : shadeC(col, -.06)); g.fill(P); g.restore(); }
  }
  return { c, w, h };
}
