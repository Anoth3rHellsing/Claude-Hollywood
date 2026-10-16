/* =====================================================================
   PINTORES: generan sprites de acuarela una sola vez (en la carga)
   ===================================================================== */

/* montañas sumi-e: picos afilados, tinta más densa arriba, se disuelven en niebla */
function genMount(o) {
  seed(o.seed);
  const span = o.span, xs = -span / 2, xe = span / 2, peaks = [];
  for (let k = 0; k < o.n; k++) peaks.push({ x: rnd(xs, xe), h: rnd(.35, 1) * o.hmax, w: rnd(.6, 1.6) * o.wk });
  if (o.big) peaks.push({ x: o.big[0], h: o.hmax * 1.15, w: o.wk * 1.2 });
  const hf = x => { let h = 0; for (const p of peaks) { const v = p.h * Math.exp(-Math.pow(Math.abs(x - p.x) / p.w, 0.85)); if (v > h) h = v; } return h; };
  const ridge = [];
  for (let x = xs; x <= xe; x += 5) ridge.push([x, o.y0 - hf(x) - FBM(x * .012, o.seed * .1, 4) * o.rough - Math.abs(N2(x * .05, o.seed)) * o.rough * .35, 0.3]);
  const top = o.y0 - o.hmax * 1.2 - 40, bot = o.y0 + o.depth;
  const sp = Spr(xs, top, xe, bot + 20, o.q ?? QB);
  const poly = ridge.concat([[xe, bot, 1.4], [xs, bot, 1.4]]);
  wash(sp.g, poly, o.col, { layers: o.layers ?? 16, alpha: o.alpha ?? .07, amt: .16, base: 1, per: 2 });
  // banda superior más densa (la tinta se acumula en la cresta)
  const band = ridge.concat(ridge.slice().reverse().map(p => [p[0], p[1] + o.band * (0.6 + .8 * (N2(p[0] * .01, 3) * .5 + .5)), 0.8]));
  wash(sp.g, band, o.col2 || o.col, { layers: 12, alpha: (o.alpha ?? .07) * .7, amt: .22, base: 2, per: 2 });
  // trazos de textura (cun) bajando por las laderas
  if (o.cun) for (const p of peaks) {
    const n = 3 + (R() * 4 | 0);
    for (let i = 0; i < n; i++) {
      const x0 = p.x + rnd(-p.w * .5, p.w * .5), y0 = o.y0 - hf(x0) + 4, dir = x0 < p.x ? -1 : 1, len = rnd(40, 140);
      const pts = catmull([[x0, y0], [x0 + dir * len * .25, y0 + len * .45], [x0 + dir * len * .55, y0 + len]], 10);
      brush(sp.g, pts, { w: u => 3.2 * (1 - u * .7) * o.cunW, col: o.col2 || o.col, a: .32, bristles: 4, dryStart: .3, seed: i * 31 + p.x | 0 });
    }
  }
  fadeOut(sp, o.y0 - o.hmax * o.mist, o.y0 + o.depth * .55);
  granulate(sp, .28);
  return { sp, peaks: peaks.map(p => ({ x: p.x, y: o.y0 - p.h })), y0: o.y0 };
}

function genSun(r, col = '188,28,36') {
  seed(91);
  const sp = Spr(-r * 1.4, -r * 1.4, r * 1.4, r * 1.4, .9);
  wash(sp.g, circlePts(0, 0, r, 40, .25), col, { layers: 28, alpha: .065, amt: .09, edge: .18, edgeW: 2 });
  wash(sp.g, circlePts(-r * .1, -r * .1, r * .7, 30, .4), '205,60,50', { layers: 10, alpha: .05, amt: .12 });
  granulate(sp, .18);
  return sp;
}

function genMist(w, h, s) {
  seed(s);
  const sp = Spr(-w / 2, -h, w / 2, h, .5), pts = [];
  for (let i = 0; i < 26; i++) { const a = i / 26 * TAU; pts.push([Math.cos(a) * w * .45, Math.sin(a) * h * .45 * (1 + N2(i * .4, s) * .4), 1]); }
  wash(sp.g, pts, '238,230,212', { layers: 26, alpha: .06, amt: .3 });
  return sp;
}

/* pétalo de cerezo: lágrima con muesca en la punta */
function petalPath(g, s) {
  g.beginPath(); g.moveTo(0, s);
  g.bezierCurveTo(s * .75, s * .55, s * .78, -s * .55, s * .42, -s * .92);
  g.quadraticCurveTo(s * .2, -s * .98, 0, -s * .7);
  g.quadraticCurveTo(-s * .2, -s * .98, -s * .42, -s * .92);
  g.bezierCurveTo(-s * .78, -s * .55, -s * .75, s * .55, 0, s);
  g.closePath();
}
function genPetal(col, s0) {
  seed(s0);
  const S = 40, c = mk(S * 2, S * 2), g = c.getContext('2d'); g.translate(S, S);
  for (let i = 0; i < 9; i++) { g.save(); g.translate(rnd(-1.5, 1.5), rnd(-1.5, 1.5)); g.rotate(rnd(-.06, .06)); g.scale(rnd(.92, 1.05), rnd(.92, 1.05)); petalPath(g, S * .82); g.fillStyle = `rgba(${col},.16)`; g.fill(); g.restore(); }
  petalPath(g, S * .8); g.strokeStyle = `rgba(${col},.35)`; g.lineWidth = 1.6; g.stroke();
  const gr = g.createRadialGradient(0, S * .6, 0, 0, S * .6, S * .9); gr.addColorStop(0, 'rgba(90,10,20,.35)'); gr.addColorStop(1, 'rgba(90,10,20,0)');
  g.globalCompositeOperation = 'source-atop'; g.fillStyle = gr; g.fillRect(-S, -S, S * 2, S * 2);
  return c;
}
/* flor de cinco pétalos con estambres */
function genBlossom(col, s0) {
  seed(s0);
  const S = 64, c = mk(S * 2, S * 2), g = c.getContext('2d'); g.translate(S, S);
  const rot = rnd(TAU);
  for (let k = 0; k < 5; k++) {
    g.save(); g.rotate(rot + k * TAU / 5 + rnd(-.12, .12)); g.translate(0, -S * .46);
    for (let i = 0; i < 6; i++) { g.save(); g.translate(rnd(-1, 1), rnd(-1, 1)); g.scale(rnd(.9, 1.05), rnd(.9, 1.05)); petalPath(g, S * .42); g.fillStyle = `rgba(${col},.2)`; g.fill(); g.restore(); }
    petalPath(g, S * .41); g.strokeStyle = `rgba(${col},.32)`; g.lineWidth = 1.4; g.stroke();
    g.restore();
  }
  g.fillStyle = 'rgba(110,12,22,.55)'; g.beginPath(); g.arc(0, 0, S * .13, 0, TAU); g.fill();
  g.strokeStyle = 'rgba(40,20,18,.55)'; g.lineWidth = 1.1;
  for (let k = 0; k < 9; k++) { const a = rnd(TAU), l = rnd(S * .18, S * .3); g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a) * l, Math.sin(a) * l); g.stroke(); g.fillStyle = 'rgba(40,20,18,.7)'; g.beginPath(); g.arc(Math.cos(a) * l, Math.sin(a) * l, 1.6, 0, TAU); g.fill(); }
  return c;
}
function genBlob(rgb, s0, sz = 64, a = .12, n = 8) { // mancha suave genérica (humo, gotas)
  seed(s0);
  const c = mk(sz * 2, sz * 2), g = c.getContext('2d'); g.translate(sz, sz);
  for (let i = 0; i < n; i++) {
    const r = sz * rnd(.45, .8), ox = rnd(-sz * .2, sz * .2), oy = rnd(-sz * .2, sz * .2);
    const gr = g.createRadialGradient(ox, oy, 0, ox, oy, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(.7, `rgba(${rgb},${a * .5})`); gr.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = gr; g.beginPath(); g.arc(ox, oy, r, 0, TAU); g.fill();
  }
  return c;
}
function genEmber() {
  const c = mk(32, 32), g = c.getContext('2d'), gr = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  gr.addColorStop(0, 'rgba(200,40,20,1)'); gr.addColorStop(.35, 'rgba(210,70,30,.6)'); gr.addColorStop(1, 'rgba(210,90,40,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 32, 32); return c;
}
function genFlame(s0) {
  seed(s0);
  const c = mk(128, 256), g = c.getContext('2d'); g.translate(64, 250);
  const flame = (wd, ht, col, a) => {
    const pts = []; const n = 24;
    for (let i = 0; i <= n; i++) { const u = i / n, y = -u * ht, wv = wd * Math.pow(Math.sin(PI * Math.min(1, u * 1.15 + .05)), .9) * (1 - u * .5); pts.push([wv + N2(u * 4, s0) * 8, y]); }
    for (let i = n; i >= 0; i--) { const u = i / n, y = -u * ht, wv = wd * Math.pow(Math.sin(PI * Math.min(1, u * 1.15 + .05)), .9) * (1 - u * .5); pts.push([-wv + N2(u * 4 + 9, s0) * 8, y]); }
    for (let l = 0; l < 10; l++) { const q = deform(pts.map(p => [p[0], p[1], .6]), 2, .2); g.fillStyle = `rgba(${col},${a})`; polyPath(g, q); g.fill(); }
  };
  flame(50, 230, '196,40,26', .07); flame(34, 170, '214,96,40', .07); flame(18, 90, '226,150,70', .08);
  return c;
}

/* ---------- cerezo ---------- */
function genTree(o) {
  seed(o.seed);
  const segs = [], tips = [], strokes = [];
  function branch(x, y, ang, len, w, depth, t0, chain) {
    const pts = [[x, y]]; let cx = x, cy = y, a = ang; const n = Math.max(3, Math.round(len / 18));
    for (let i = 0; i < n; i++) { a += gauss() * .17 + (o.lift ?? 0) * (depth > 1 ? .02 : 0); const l = len / n; const nx = cx + Math.cos(a) * l, ny = cy + Math.sin(a) * l; pts.push([nx, ny]); cx = nx; cy = ny; }
    const sm = catmull(pts, 4);
    const ws = w, we = w * .55, t1 = t0 + len / o.speed;
    strokes.push({ pts: sm, w0: ws, w1: we, depth, tip: depth <= 0 || w < 1.2 });
    for (let i = 1; i < sm.length; i++) { const u = i / sm.length; segs.push({ a: sm[i - 1], b: sm[i], w: lerp(ws, we, u), t: lerp(t0, t1, u) }); }
    if (depth <= 0 || w < 1.2) { tips.push({ x: cx, y: cy, t: t1, a }); return; }
    const k = depth > 4 ? 2 : (R() < .6 ? 3 : 2);
    for (let i = 0; i < k; i++) {
      const sp = (i - (k - 1) / 2) * rnd(.45, .8) + gauss() * .15;
      branch(cx, cy, a + sp, len * rnd(.6, .82), we * rnd(.68, .85), depth - 1, t1, chain);
    }
    // ramitas laterales
    if (depth < 5 && R() < .85) { const j = (sm.length * rnd(.3, .7)) | 0; const p = sm[j]; branch(p[0], p[1], a + (R() < .5 ? -1 : 1) * rnd(.6, 1.1), len * .45, we * .6, Math.max(0, depth - 2), lerp(t0, t1, j / sm.length), chain); }
  }
  branch(0, 0, o.ang ?? -PI / 2, o.len, o.w, o.depth, 0, 0);
  let tmax = 0; for (const s of segs) tmax = Math.max(tmax, s.t); for (const s of segs) s.t /= tmax; for (const t of tips) t.t /= tmax;
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const s of segs) { for (const p of [s.a, s.b]) { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); } }
  const pad = 40, sp = Spr(x0 - pad, y0 - pad, x1 + pad, y1 + pad, .85);
  // tronco y ramas: lavado gris debajo + pincel seco encima
  for (const s of strokes) brush(sp.g, s.pts, { w: u => lerp(s.w0, s.w1, u) * (1.7 + .5 * N2(u * 4, s.w0 * .3)), col: '96,86,78', a: .14, bristles: 3, body: 1, dryStart: .95, seed: 3 });
  for (const s of strokes) if (s.w0 > 10) brush(sp.g, s.pts, { w: u => lerp(s.w0, s.w1, u) * .45, col: '40,34,30', a: .35, bristles: 5, body: .6, dryStart: .7, dryAll: .3, dryFreq: .12, seed: 17 });
  for (const s of strokes) brush(sp.g, s.pts, { w: u => lerp(s.w0, s.w1, u) * (1 + .18 * N2(u * 6, s.w0)), col: o.col || '28,22,20', a: .85, bristles: Math.max(3, Math.min(16, s.w0 | 0)), body: s.w0 > 8 ? .78 : .9, dryStart: s.tip ? .8 : 1, dryAll: .12, dryFreq: .08, seed: (s.w0 * 100) | 0 });
  // nudos
  for (let i = 0; i < 18; i++) { const s = pick(strokes.filter(z => z.w0 > 6)); if (!s) break; const p = pick(s.pts); sp.g.fillStyle = 'rgba(20,16,14,.5)'; sp.g.beginPath(); sp.g.ellipse(p[0], p[1], rnd(1.5, 4), rnd(1, 2.5), rnd(TAU), 0, TAU); sp.g.fill(); }
  granulate(sp, .22);
  const tm = tmStrokes(sp, segs, { res: 3 });
  // flores: racimos alrededor de las puntas y algunas a lo largo de ramas finas
  const fl = [];
  for (const t of tips) { const n = 2 + (R() * 4 | 0); for (let i = 0; i < n; i++) fl.push({ x: t.x + gauss() * 14, y: t.y + gauss() * 12, s: rnd(.55, 1.15) * (o.flS ?? 1), v: R() * 6 | 0, t: t.t, r: rnd(TAU), ph: rnd(TAU) }); }
  for (const s of strokes) if (s.depth <= 2) for (let i = 0; i < 2; i++) { const p = pick(s.pts); fl.push({ x: p[0] + gauss() * 8, y: p[1] + gauss() * 8, s: rnd(.45, .85) * (o.flS ?? 1), v: R() * 6 | 0, t: .9, r: rnd(TAU), ph: rnd(TAU) }); }
  // halo rosado-carmesí (manchas difusas detrás de las flores)
  const hz = Spr(x0 - 80, y0 - 80, x1 + 80, y1 + 80, .5);
  for (const t of tips) if (R() < .8) wash(hz.g, circlePts(t.x + gauss() * 10, t.y + gauss() * 10, rnd(18, 40), 12, 1), pick(['190,40,52', '200,70,80', '170,30,44']), { layers: 6, alpha: .05, amt: .45, base: 1, per: 2 });
  const hzb = new Bleed(hz, tmSeeds(hz, tips.filter((_, i) => i % 3 === 0).map(t => ({ x: t.x, y: t.y, d: t.t * 60 })), { amp: .3 }), { edge: .3, edgeCol: '150,20,34' });
  return { sp, bl: new Bleed(sp, tm, { soft: .05, edge: .35 }), tips, fl, hz, hzb, strokes };
}

/* ---------- bambú ---------- */
function genBamboo(o) {
  seed(o.seed);
  const h = o.h, w = o.w, sp = Spr(-120, -h, 120, 10, o.q ?? .8), g = sp.g;
  let y = 0; const nodes = [];
  while (y > -h) { const seg = rnd(70, 120) * (w / 18); nodes.push([y, y - seg]); y -= seg; }
  for (const [ya, yb] of nodes) {
    const lean = N2(ya * .01, o.seed) * 3;
    brush(g, [[lean, ya - 3], [lean * .5, (ya + yb) / 2], [0, yb + 3]], { w: () => w, col: o.col, a: o.a * .55, bristles: 6, body: .9, dryStart: 1, dryAll: .03, seed: (ya | 0) + o.seed });
    g.fillStyle = `rgba(${o.col},${o.a * .25})`; g.fillRect(-w * .5, yb + 3, w * .18, ya - yb - 6);
    // nudo
    brush(g, [[-w * .62, yb + 1], [0, yb - 1.5], [w * .62, yb + 1]], { w: () => w * .16, col: o.col, a: o.a, bristles: 3, body: 1, dryStart: .9, seed: (yb | 0) });
  }
  // hojas: trazos largos afilados que cuelgan de los nudos superiores
  const lc = o.leaves ?? 16;
  for (let i = 0; i < lc; i++) {
    const [_, yb] = nodes[Math.min(nodes.length - 1, Math.floor(rnd(nodes.length * .55, nodes.length)))];
    const dir = R() < .5 ? -1 : 1, n = 2 + (R() * 3 | 0);
    for (let k = 0; k < n; k++) {
      const a = dir * rnd(.25, 1.2) + PI / 2 * .25, len = rnd(40, 80) * (w / 18 + .4);
      const x1 = dir * Math.cos(a - .2) * len, y1 = yb + Math.sin(a * dir * .8 + .4) * len * .5 + len * .15;
      const pts = catmull([[0, yb], [x1 * .45, yb + (y1 - yb) * .3 - 4], [x1, y1]], 8);
      brush(g, pts, { w: u => Math.pow(Math.sin(PI * Math.min(1, u * 1.05 + .04)), .7) * (1 - u * .6) * len * .085, col: o.col, a: o.a * .9, bristles: 2, body: 1, dryStart: .98, seed: i * 13 + k });
    }
  }
  granulate(sp, .2);
  return sp;
}

/* ---------- arquitectura (aldea) ---------- */
function roof(g, cx, y, w, h, col, a) {
  const pts = catmull([[cx - w * .55, y + 2], [cx - w * .4, y - h * .3], [cx - w * .22, y - h], [cx + w * .22, y - h], [cx + w * .4, y - h * .3], [cx + w * .55, y + 2]], 6);
  pts.push([cx + w * .42, y + h * .12], [cx - w * .42, y + h * .12]);
  wash(g, pts.map(p => [p[0], p[1], .35]), col, { layers: 9, alpha: a, amt: .1, base: 1, per: 2 });
}
function genVillage(span, y, s0) {
  seed(s0);
  const sp = Spr(-span / 2, y - 420, span / 2, y + 90, .7), g = sp.g, fires = [];
  let x = -span / 2 + 40;
  while (x < span / 2 - 60) {
    const w = rnd(110, 210), h = rnd(26, 46), by = y + rnd(-18, 22);
    if (R() < .13) { // pagoda
      let yy = by, ww = w * .8;
      for (let k = 0; k < 5; k++) { wash(g, [[x - ww * .3, yy + 4, .3], [x + ww * .3, yy + 4, .3], [x + ww * .3, yy + 40, .3], [x - ww * .3, yy + 40, .3]], '70,62,56', { layers: 5, alpha: .06, base: 1, per: 2, amt: .08 }); roof(g, x, yy, ww, 22, '34,28,26', .12); yy -= 44; ww *= .82; }
      g.strokeStyle = 'rgba(30,24,22,.8)'; g.lineWidth = 2.2; g.beginPath(); g.moveTo(x, yy + 20); g.lineTo(x, yy - 40); g.stroke();
      fires.push({ x, y: by + 30, s: 1.6 });
      x += w * .7;
    } else {
      wash(g, [[x - w * .38, by + 4, .3], [x + w * .38, by + 4, .3], [x + w * .38, by + 60, .3], [x - w * .38, by + 60, .3]], '92,84,76', { layers: 6, alpha: .07, base: 1, per: 2, amt: .06 });
      roof(g, x, by, w, h, '34,28,26', .14);
      if (R() < .75) fires.push({ x: x + rnd(-w * .3, w * .3), y: by + 50, s: rnd(.8, 1.3) });
      x += w * rnd(.75, 1.05);
    }
  }
  fadeOut(sp, y + 30, y + 90);
  granulate(sp, .2);
  return { sp, fires };
}

/* ---------- suelos, cielos y lunas ---------- */
function genGround(span, y, col, alpha, s0, rough = 18, depth = 400) {
  seed(s0);
  const sp = Spr(-span / 2, y - rough * 3, span / 2, y + depth, .55), pts = [];
  for (let x = -span / 2; x <= span / 2; x += 20) pts.push([x, y - Math.abs(FBM(x * .004, s0, 3)) * rough * 2.2, .4]);
  pts.push([span / 2, y + depth, 1], [-span / 2, y + depth, 1]);
  wash(sp.g, pts, col, { layers: 14, alpha, amt: .2, base: 1, per: 2 });
  granulate(sp, .25);
  return sp;
}
function genSky(span, col, s0, y0 = -560, y1 = 200, top = .9) { // lavado vertical (cielo nocturno, tormenta)
  seed(s0);
  const sp = Spr(-span / 2, y0, span / 2, y1, .4), g = sp.g;
  for (let i = 0; i < 18; i++) {
    const yy = lerp(y0, y1 * .6, i / 18), pts = [];
    for (let x = -span / 2 - 50; x <= span / 2 + 50; x += 60) pts.push([x, yy + FBM(x * .003, i + s0, 3) * 120, .8]);
    pts.push([span / 2 + 50, y0 - 50, 1], [-span / 2 - 50, y0 - 50, 1]);
    wash(g, pts, col, { layers: 2, alpha: .06 * top, amt: .25, base: 1, per: 2 });
  }
  fadeOut(sp, y1 * .2, y1);
  granulate(sp, .2);
  return sp;
}
function genStorm(span, s0) { // nube de tinta que se extiende por el cielo
  seed(s0);
  const sp = Spr(-span / 2, -620, span / 2, 260, .4), g = sp.g, seeds = [];
  for (let i = 0; i < 26; i++) {
    const cx = rnd(-span * .55, span * .5), cy = rnd(-520, -40), r = rnd(120, 300);
    wash(g, circlePts(cx, cy, r, 16, 1).map(p => [p[0], p[1] * .55 + cy * .45, 1]), pick(['40,36,36', '60,56,58', '30,28,28']), { layers: 6, alpha: .05, amt: .5, base: 1, per: 3 });
  }
  wash(g, [[-span / 2, -620, 1], [span / 2, -620, 1], [span / 2, -150, 1], [-span / 2, -100, 1]], '50,46,46', { layers: 8, alpha: .05, amt: .3 });
  fadeOut(sp, -60, 200);
  granulate(sp, .2);
  seeds.push({ x: span * .55, y: -380 }, { x: span * .3, y: -500, d: 200 });
  return { sp, bl: new Bleed(sp, tmSeeds(sp, seeds, { amp: .35, ns: .004, res: 5 }), { edge: .55 }) };
}
function genMoon(r) {
  seed(77);
  const sp = Spr(-r * 1.6, -r * 1.6, r * 1.6, r * 1.6, .6);
  const g = sp.g, gr = g.createRadialGradient(0, 0, r * .9, 0, 0, r * 1.6); gr.addColorStop(0, 'rgba(240,226,200,.5)'); gr.addColorStop(1, 'rgba(240,226,200,0)');
  g.fillStyle = gr; g.fillRect(-r * 1.6, -r * 1.6, r * 3.2, r * 3.2);
  wash(g, circlePts(0, 0, r, 40, .2), '241,224,196', { layers: 20, alpha: .09, amt: .06 });
  wash(g, circlePts(r * .15, r * .1, r * .9, 30, .5), '196,70,60', { layers: 16, alpha: .045, amt: .14, edge: .1 });
  for (let i = 0; i < 7; i++) wash(g, circlePts(rnd(-r * .6, r * .6), rnd(-r * .6, r * .6), rnd(r * .08, r * .25), 12, 1), '150,60,56', { layers: 5, alpha: .04, amt: .4, base: 1, per: 2 });
  return sp;
}
function genSplat(s0, r = 60, col = CRIM) { // salpicadura carmesí con dedos de sangrado
  seed(s0);
  const sp = Spr(-r * 3, -r * 3, r * 3, r * 3, .8), g = sp.g, seeds = [{ x: 0, y: 0 }];
  wash(g, circlePts(0, 0, r, 20, .9), col, { layers: 14, alpha: .08, amt: .35, edge: .2 });
  for (let i = 0; i < 14; i++) { const a = rnd(TAU), d = rnd(r * .9, r * 2.6), rr = rnd(3, 12) * (1 - d / (r * 3)); wash(g, circlePts(Math.cos(a) * d, Math.sin(a) * d, rr, 10, .8), col, { layers: 6, alpha: .14, amt: .3, base: 1, per: 2 }); }
  for (let i = 0; i < 5; i++) { const a = rnd(TAU); brush(g, [[Math.cos(a) * r * .6, Math.sin(a) * r * .6], [Math.cos(a) * r * 1.8, Math.sin(a) * r * 1.8]], { w: u => (1 - u) * 9, col, a: .5, bristles: 3, seed: i }); }
  return { sp, bl: new Bleed(sp, tmSeeds(sp, seeds, { amp: .45, ns: .03, res: 3 }), { edge: .6, edgeCol: '100,10,20', soft: .1 }) };
}
function genInkBloom(r, s0) {
  seed(s0);
  const sp = Spr(-r * 1.7, -r * 1.7, r * 1.7, r * 1.7, .8), g = sp.g;
  wash(g, circlePts(0, 0, r, 26, 1), '30,26,26', { layers: 22, alpha: .06, amt: .32, edge: .25 });
  wash(g, circlePts(rnd(-15, 15), rnd(-15, 15), r * .5, 14, 1.6), '14,12,12', { layers: 16, alpha: .05, amt: .55 });
  for (let i = 0; i < 18; i++) { const a = rnd(TAU), d = rnd(r * 1.05, r * 1.6), rr = rnd(2, 9); wash(g, circlePts(Math.cos(a) * d, Math.sin(a) * d, rr, 8, .8), '24,20,20', { layers: 5, alpha: .16, amt: .3, base: 1, per: 2 }); }
  granulate(sp, .2);
  return { sp, bl: new Bleed(sp, tmSeeds(sp, [{ x: 0, y: 0 }], { amp: .5, ns: .012, res: 3 }), { edge: .7, soft: .09 }) };
}
function genPool(w, s0) { // charco de tinta en el suelo (de donde surgen las sombras)
  seed(s0);
  const sp = Spr(-w, -w * .3, w, w * .3, .7);
  wash(sp.g, circlePts(0, 0, w * .8, 20, 1).map(p => [p[0], p[1] * .22, 1]), '16,14,14', { layers: 16, alpha: .08, amt: .3, edge: .2 });
  return { sp, bl: new Bleed(sp, tmSeeds(sp, [{ x: 0, y: 0, ky: 3 }], { amp: .4, ns: .02, res: 3 }), { edge: .6 }) };
}
function genBars() { // franjas cinematográficas con borde de pincel
  const sp = Spr(-SW / 2 - 40, -40, SW / 2 + 40, 80, .8), g = sp.g, pts = [];
  seed(5);
  for (let x = -SW / 2 - 40; x <= SW / 2 + 40; x += 8) pts.push([x, 60 + N2(x * .02, 1) * 3 + N2(x * .2, 2) * 1.2, .2]);
  pts.push([SW / 2 + 40, -40, .2], [-SW / 2 - 40, -40, .2]);
  wash(g, pts, '22,18,16', { layers: 10, alpha: .16, amt: .05, base: 1, per: 2 });
  return sp;
}
