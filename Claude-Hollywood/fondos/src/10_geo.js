/* =====================================================================
   GEOMETRÍA CON SIGNIFICADO
   Una capa guarda piezas que saben lo que son; cada estilo decide cómo pintarlas:
     solid  · masa principal (muro, monte)        shade · plano en sombra (lateral)
     trim   · pieza de otro color (tejado, toldo)  line  · elemento lineal (cable, poste, barandilla)
     win    · ventana (hueco)                      lat   · celosía (torre de hierro)
     tree   · árbol (redondo, ciprés, pino, palmera)  glow · farol / luz puntual
   ===================================================================== */
class Lay {
  constructor(p, o = {}) { this.p = p; this.items = []; this.haze = o.haze ?? Math.max(0, .75 - p) * .9; this.name = o.name || ''; this.ink = o.ink ?? (p > .25); this.sway = o.sway || 0; this.shadow = o.shadow ?? 1; }
  solid(pts, c, o = {}) { this.items.push({ t: 'solid', pts, c, ink: o.ink ?? 1, wet: o.wet ?? 1, grad: o.grad ?? .12, land: !!o.land }); return this; }
  shade(pts, c) { this.items.push({ t: 'shade', pts, c }); return this; }
  trim(pts, c, o = {}) { this.items.push({ t: 'trim', pts, c, ink: o.ink ?? 0 }); return this; }
  line(pts, w, c, o = {}) { this.items.push({ t: 'line', pts, w, c, closed: !!o.closed, ink: o.ink ?? 1 }); return this; }
  win(x, y, w, h, o = {}) { this.items.push({ t: 'win', x, y, w, h, lit: R() < (o.lit ?? .55), g: R(), arch: !!o.arch, c: o.c, warm: o.warm }); return this; }
  lat(pts, nx, ny, c) { this.items.push({ t: 'lat', pts, nx, ny, c }); return this; }
  tree(x, y, h, kind, c) { this.items.push({ t: 'tree', x, y, h, kind, c, s: R() * 1000 }); return this; }
  glow(x, y, r, c) { this.items.push({ t: 'glow', x, y, r, c }); return this; }
}

/* ---------- edificios genéricos ----------
   x = borde izquierdo, gy = suelo, w = ancho, h = alto (hacia arriba). Devuelve la cota del tejado. */
const ROOFS = {};
function facade(L, x, gy, w, h, o = {}) {
  const c = o.c, top = gy - h, side = o.side ?? Math.min(18, w * .16), sideDir = o.sideDir ?? 1;
  /* lateral en sombra: da volumen (vista ligeramente oblicua) */
  if (side > 1) { const sx = sideDir > 0 ? x + w : x - side, k = sideDir > 0 ? 1 : -1; L.shade([[x + (sideDir > 0 ? w : 0), top], [x + (sideDir > 0 ? w : 0) + k * side, top + side * .35], [x + (sideDir > 0 ? w : 0) + k * side, gy], [x + (sideDir > 0 ? w : 0), gy]], shadeC(c, -.25)); }
  L.solid(rect(x, top, w, h), c, { ink: o.ink ?? 1 });
  /* tejado */
  const roof = o.roof || 'flat', rc = o.roofC || shadeC(c, -.18);
  let rt = top;
  if (roof === 'flat') { L.trim(rect(x - 2, top - 5, w + 4, 6), shadeC(c, -.12)); rt = top - 5; }
  else if (roof === 'gable') { const rh = o.rh ?? w * .32; L.trim([[x - 4, top + 2], [x + w / 2, top - rh], [x + w + 4, top + 2]], rc); rt = top - rh; }
  else if (roof === 'hip') { const rh = o.rh ?? w * .22; L.trim([[x - 5, top + 2], [x + w * .28, top - rh], [x + w * .72, top - rh], [x + w + 5, top + 2]], rc); rt = top - rh; }
  else if (roof === 'mansard') {   /* París: mansarda de zinc con buhardillas */
    const rh = o.rh ?? Math.min(46, h * .22);
    L.trim([[x - 3, top + 2], [x + 8, top - rh], [x + w - 8, top - rh], [x + w + 3, top + 2]], rc);
    const nd = Math.max(1, Math.floor((w - 20) / 34));
    for (let i = 0; i < nd; i++) { const dx = x + 14 + (i + .5) * (w - 28) / nd - 7; L.trim([[dx - 2, top - rh * .2], [dx - 2, top - rh * .72], [dx + 7, top - rh * .95], [dx + 16, top - rh * .72], [dx + 16, top - rh * .2]], shadeC(c, .05)); L.win(dx + 2, top - rh * .68, 10, rh * .42, { lit: o.lit }); }
    rt = top - rh;
  } else if (roof === 'tile') {   /* teja roja mediterránea */
    const rh = o.rh ?? 12; L.trim([[x - 6, top + 3], [x + w * .5, top - rh], [x + w + 6, top + 3]], rc); rt = top - rh;
    L.line([[x - 6, top + 3], [x + w + 6, top + 3]], 1.4, shadeC(rc, -.3));
  } else if (roof === 'setback') {   /* rascacielos escalonado (art déco) */
    let yy = top, ww = w, xx = x; const steps = o.steps ?? 3;
    for (let i = 0; i < steps; i++) { const sh = h * (.06 + .03 * i), nx = xx + ww * .12, nw = ww * .76; L.solid(rect(nx, yy - sh, nw, sh), c, { ink: 1 }); winGrid(L, nx, yy - sh, nw, sh, { ...o, rows: 2, cols: Math.max(2, Math.round(nw / 14)) }); yy -= sh; xx = nx; ww = nw; }
    rt = yy;
    if (o.spire) { L.line([[xx + ww / 2, yy], [xx + ww / 2, yy - o.spire]], 3, shadeC(c, -.3)); rt = yy - o.spire; }
  }
  /* sombra que proyecta el alero sobre la fachada */
  if (h > 40 && roof !== 'setback') L.shade(rect(x, top, w, Math.min(10, h * .08)), shadeC(c, -.2));
  /* cornisas y molduras: líneas de luz y sombra que dan escala */
  if (o.cornice !== false && h > 60) {
    const fl = o.floorH ?? 24, nf = Math.floor((h - (o.shop ? 28 : 0)) / fl);
    L.trim(rect(x - 3, top, w + 6, 4), shadeC(c, .18));
    if (o.belt) for (const f of o.belt) L.trim(rect(x - 1, gy - (o.shop ? 28 : 0) - f * fl, w + 2, 3), shadeC(c, .14));
  }
  /* ventanas */
  if (o.rows !== 0) winGrid(L, x, top, w, h, o);
  /* planta baja: tiendas con toldo */
  if (o.shop) {
    const n = Math.max(1, Math.round(w / 40));
    for (let i = 0; i < n; i++) { const sx = x + 4 + i * (w - 8) / n, sw = (w - 8) / n - 6; L.win(sx, gy - 24, sw, 20, { lit: (o.lit ?? .5) + .3, warm: 1 }); if (o.awning) L.trim([[sx - 2, gy - 27], [sx + sw + 2, gy - 27], [sx + sw + 6, gy - 19], [sx - 6, gy - 19]], o.awning[i % o.awning.length]); }
  }
  /* chimeneas y antenas */
  if (o.chim) for (let i = 0; i < o.chim; i++) { const cx = x + rnd(.1, .85) * w, ch = rnd(10, 22); L.trim(rect(cx, rt - ch + 4, rnd(6, 10), ch), shadeC(c, -.22)); }
  if (o.tank) { const tx = x + rnd(.2, .7) * w; waterTank(L, tx, rt, shadeC(c, -.35)); }
  if (o.antenna) L.line([[x + w * .6, rt], [x + w * .6, rt - o.antenna]], 1.4, shadeC(c, -.4));
  return rt;
}
function winGrid(L, x, top, w, h, o) {
  const fl = o.floorH ?? 24, wh = o.winH ?? fl * .55, ww = o.winW ?? 9, gap = o.winGap ?? 18;
  const usable = h - (o.shop ? 30 : 6) - 8, rows = o.rows ?? Math.max(1, Math.floor(usable / fl)), cols = o.cols ?? Math.max(1, Math.floor((w - 10) / gap));
  const mx = (w - cols * gap) / 2 + (gap - ww) / 2;
  for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) {
    const wx = x + mx + k * gap, wy = top + 9 + r * fl + (fl - wh) * .3;
    if (wy + wh > top + h - (o.shop ? 28 : 4)) continue;
    L.win(wx, wy, ww, wh, { lit: o.lit, arch: o.arch && r === 0 });
    if (o.balc && (r === 1 || (o.balc === 'all' && r > 0))) L.line([[wx - 3, wy + wh + 2], [wx + ww + 3, wy + wh + 2]], 1.6, shadeC(o.c, -.45));
    if (o.shutter) { L.trim(rect(wx - 4, wy, 3.5, wh), o.shutter); L.trim(rect(wx + ww + .5, wy, 3.5, wh), o.shutter); }
  }
  if (o.balc === 'long') for (let r = 1; r < rows; r += 3) { const yy = top + 9 + r * fl + wh + 2; L.line([[x + 3, yy], [x + w - 3, yy]], 2, shadeC(o.c, -.5)); }
}
function waterTank(L, x, y, c) {   /* depósito de agua de Nueva York */
  L.line([[x + 2, y], [x + 4, y - 9]], 1.2, c); L.line([[x + 14, y], [x + 12, y - 9]], 1.2, c);
  L.trim([[x, y - 9], [x + 16, y - 9], [x + 15, y - 22], [x + 1, y - 22]], c); L.trim([[x - 1, y - 22], [x + 8, y - 30], [x + 17, y - 22]], shadeC(c, -.2));
}
/* fila de edificios con variación: devuelve los techos */
function row(L, x0, x1, gy, o) {
  let x = x0; const tops = [];
  while (x < x1) { const w = rnd(o.w[0], o.w[1]), h = rnd(o.h[0], o.h[1]), c = pick(o.cols); const t = facade(L, x, gy, w, h, { ...o, cols: o.ncols, c, roof: typeof o.roof === 'function' ? o.roof() : o.roof, rh: o.rh, side: o.side ?? 0, chim: o.chim ? ri(0, o.chim) : 0, tank: o.tank && R() < o.tank, awning: o.awnings, antenna: o.antenna && R() < .3 ? rnd(10, 30) : 0 }); tops.push([x, w, t]); x += w + (o.gap ?? 0); }
  return tops;
}
/* colinas, montañas y orillas: perfil → polígono hasta el fondo */
function ridge(x0, x1, base, f, n = 80) { const o = [[x0, 560]]; for (let i = 0; i <= n; i++) { const x = lerp(x0, x1, i / n); o.push([x, base + f(x)]); } o.push([x1, 560]); return o; }
const peaks = (x, list) => list.reduce((m, [px, ph, pw]) => Math.min(m, -ph * Math.exp(-Math.pow(Math.abs(x - px) / pw, .9))), 0);
/* fila de árboles */
function trees(L, x0, x1, gy, o) { for (let x = x0; x < x1; x += rnd(o.gap[0], o.gap[1])) L.tree(x, gy, rnd(o.h[0], o.h[1]), typeof o.kind === 'function' ? o.kind() : o.kind, pick(o.cols)); }
/* farolas a lo largo de una calle */
function lamps(L, x0, x1, gy, step, h = 34, c = [40, 36, 40]) { for (let x = x0; x < x1; x += step) { L.line([[x, gy], [x, gy - h]], 1.6, c); L.line([[x, gy - h], [x + 5, gy - h - 3]], 1.4, c); L.glow(x + 5, gy - h - 1, 3.2, [255, 214, 150]); } }
/* barandilla de muelle o puente */
function railing(L, x0, x1, y, c, step = 7, hh = 8) { L.line([[x0, y - hh], [x1, y - hh]], 1.3, c); for (let x = x0; x <= x1; x += step) L.line([[x, y], [x, y - hh]], .9, c, { ink: 0 }); }
