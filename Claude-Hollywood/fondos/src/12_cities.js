/* =====================================================================
   CIUDADES · cada una es una lista de capas (de lejos a cerca) con piezas con significado
   ===================================================================== */
const CITIES = [];
const C = h => hex(h);
/* gente diminuta: da escala a todo lo demás */
function person(L, x, gy, h, c, o = {}) {
  const hd = h * .13, sh = gy - h * .82;
  L.solid([[x - h * .1, sh], [x + h * .1, sh], [x + h * .13 + (o.coat ? h * .06 : 0), gy - h * .38], [x + h * .07, gy - h * .38], [x + h * .06, gy], [x + h * .01, gy], [x, gy - h * .3], [x - h * .01, gy], [x - h * .06, gy], [x - h * .07, gy - h * .38], [x - h * .13 - (o.coat ? h * .06 : 0), gy - h * .38]], c, { ink: 0, wet: 0 });
  L.solid(ell(x, sh - hd * .9, hd * .8, hd, 10), c, { ink: 0, wet: 0 });
  if (o.umb) L.trim([[x - h * .35, sh - hd * 1.3], [x, sh - hd * 3], [x + h * .35, sh - hd * 1.3]], o.umb);
}
/* torre de celosía (Eiffel, Tokio): perfil por alturas → paneles de celosía, plataformas y arco */
function latticeTower(L, cx, gy, Ht, prof, c, o = {}) {
  const X = (hf) => { for (let i = 0; i < prof.length - 1; i++) { const [h0, w0] = prof[i], [h1, w1] = prof[i + 1]; if (hf <= h1) return lerp(w0, w1, (hf - h0) / (h1 - h0)); } return prof[prof.length - 1][1]; };
  const Y = hf => gy - hf * Ht, plats = o.plats || [];
  /* patas: dos paneles por lado hasta la primera plataforma, con arco entre ellas */
  const h1 = plats[0] ? plats[0][0] : .2, legW = o.legW ?? .32;
  for (const sg of [-1, 1]) {
    const segs = 4;
    for (let s = 0; s < segs; s++) { const a = s / segs * h1, b = (s + 1) / segs * h1, oa = X(a), ob = X(b), ia = oa * (1 - legW * (1 + a / h1 * .5)), ib = ob * (1 - legW * (1 + b / h1 * .5));
      const q = sg < 0 ? [[cx - ob, Y(b)], [cx - ib, Y(b)], [cx - ia, Y(a)], [cx - oa, Y(a)]] : [[cx + ib, Y(b)], [cx + ob, Y(b)], [cx + oa, Y(a)], [cx + ia, Y(a)]];
      L.lat(q, 2, 2, c); }
    L.line([[cx + sg * X(0), gy], [cx + sg * X(h1), Y(h1)]], 2.2, shadeC(c, -.25));
  }
  if (o.arch) { const ia = X(0) * (1 - legW), pts = []; for (let i = 0; i <= 20; i++) { const a = PI + i / 20 * PI; pts.push([cx + Math.cos(a) * ia, Y(h1 * .1) + Math.sin(a) * Ht * h1 * .62]); } L.line(pts, 3.2, shadeC(c, -.15)); }
  /* cuerpo por encima de la primera plataforma: celosía que se afina */
  const bands = o.bands || [[h1, plats[1] ? plats[1][0] : .45, 4, 5], [plats[1] ? plats[1][0] : .45, .93, 2, 14]];
  for (const [a, b, nx, ny] of bands) { const oa = X(a), ob = X(b), n = ny, stepH = (b - a) / n;
    for (let k = 0; k < n; k++) { const ha = a + k * stepH, hb = ha + stepH, wa = X(ha), wb = X(hb); L.lat([[cx - wb, Y(hb)], [cx + wb, Y(hb)], [cx + wa, Y(ha)], [cx - wa, Y(ha)]], nx, 1, c); }
    L.line([[cx - oa, Y(a)], [cx - ob, Y(b)]], 1.8, shadeC(c, -.3)); L.line([[cx + oa, Y(a)], [cx + ob, Y(b)]], 1.8, shadeC(c, -.3)); }
  for (const [hp, th] of plats) { const w = X(hp) + 6; L.solid(rect(cx - w, Y(hp) - th, w * 2, th), shadeC(c, -.08)); L.line([[cx - w, Y(hp) - th], [cx + w, Y(hp) - th]], 1.2, shadeC(c, -.35)); for (let x = -w + 3; x < w; x += 5) L.line([[cx + x, Y(hp) - th], [cx + x, Y(hp) - th - 4]], .7, shadeC(c, -.35), { ink: 0 }); L.line([[cx - w, Y(hp) - th - 4], [cx + w, Y(hp) - th - 4]], .8, shadeC(c, -.35)); }
  const tw = X(.93); L.solid(rect(cx - tw - 2, Y(.95), tw * 2 + 4, Ht * .025), shadeC(c, -.1));
  L.line([[cx, Y(.95)], [cx, Y(1)]], 2, shadeC(c, -.3));
  return X;
}
function arches(L, x0, x1, deckY, waterY, n, c, o = {}) {   /* puente de piedra con arcos */
  const span = (x1 - x0) / n, th = o.th ?? 14;
  const pts = [[x0, deckY], [x1, deckY], [x1, waterY + 30]];
  for (let i = n - 1; i >= 0; i--) { const a = x0 + i * span, pw = span * (o.pier ?? .16), ax0 = a + pw / 2, ax1 = a + span - pw / 2, rise = (waterY - deckY - th) * (o.rise ?? .95);
    pts.push([ax1 + (i === n - 1 ? pw / 2 : 0), waterY + 30], [ax1, waterY]); for (let k = 1; k < 16; k++) { const t = k / 16; pts.push([lerp(ax1, ax0, t), waterY - Math.sin(t * PI) * rise]); } pts.push([ax0, waterY], [ax0 - (i === 0 ? pw / 2 : 0), waterY + 30]); }
  L.solid(pts, c, { grad: .3 });
  L.trim(rect(x0 - 4, deckY - 6, x1 - x0 + 8, 6), shadeC(c, .15));
  for (let i = 0; i < n; i++) { const a = x0 + i * span; L.line([[a + span * .08, waterY - 4], [a + span * .08, deckY + 6]], 1, shadeC(c, -.3)); }
}

/* ================================ PARÍS ================================ */
CITIES.push({
  id: 'paris', name: 'París', country: 'Francia', coord: '48,86° N · 2,35° E', accent: C('#2b4a7c'),
  focus: 140, focusR: 520, haze: C('#d9c8b4'), winC: C('#5a5a72'), gran: 1,
  sky: { day: [C('#8fa6c6'), C('#f2c79a')], night: [C('#1d2346'), C('#7a5e72')], hor: .55, sun: [600, -60, 26, C('#ffd9a0')], moon: [-540, -330, 18, C('#f2ecdc')], stars: true },
  night: lt => sm(rg(lt, .3, .9)) * .92, nightTint: C('#2a2c52'),
  pan: [-360, 300], zoom: 1.05, cloudY: [-430, -260], clouds: 4,
  water: { y: 238, p: .62, c: C('#7f8e9a'), cN: C('#1e2440'), after: 3, lights: [-500, -220, 60, 340, 620] },
  build() {
    const L0 = new Lay(.12, { name: 'montes', haze: .62 }), L1 = new Lay(.24, { name: 'lejos', haze: .48 }), L2 = new Lay(.33, { name: 'torre', haze: .28 }), L3 = new Lay(.55, { name: 'quai', haze: .12 }), L4 = new Lay(.72, { name: 'puente', haze: .05 }), L5 = new Lay(1, { name: 'cerca', haze: 0, sway: .0015 });
    /* Montmartre con el Sacré-Cœur */
    L0.solid(ridge(-1100, 1100, 160, x => peaks(x, [[-560, 120, 300], [300, 40, 400]])), C('#b9b2a8'), { land: true, ink: 0 });
    const sx = -560, sy = 40; const stone = C('#f1ebe0');
    L0.solid(rect(sx - 60, sy - 40, 120, 44), stone); L0.solid(rect(sx - 22, sy - 74, 44, 36), stone); L0.trim(ell(sx, sy - 74, 24, 30, 20, PI, TAU), stone); L0.line([[sx, sy - 104], [sx, sy - 116]], 2, stone);
    for (const dx of [-44, 44]) { L0.solid(rect(sx + dx - 8, sy - 54, 16, 16), stone); L0.trim(ell(sx + dx, sy - 54, 9, 12, 14, PI, TAU), stone); }
    L0.solid(rect(sx + 70, sy - 92, 16, 96), stone); L0.trim(ell(sx + 78, sy - 92, 9, 12, 12, PI, TAU), stone);
    seed(3); row(L0, -1100, 1100, 175, { w: [20, 40], h: [12, 34], cols: [C('#c4b8a8'), C('#bcae9c')], roof: 'flat', rows: 0, side: 0, cornice: false });
    /* ciudad lejana y los Inválidos */
    seed(5); row(L1, -1050, 1050, 196, { w: [26, 52], h: [30, 74], cols: [C('#d2c2a8'), C('#cbb99e'), C('#c7b49a')], roof: 'mansard', rh: 12, floorH: 13, winW: 3, winH: 6, winGap: 8, side: 0, cornice: false, lit: .5 });
    const ix = -300; L1.solid(rect(ix - 50, 120, 100, 40), C('#d8ccb6')); L1.solid(rect(ix - 22, 88, 44, 34), C('#d8ccb6')); L1.trim(ell(ix, 88, 26, 34, 20, PI, TAU), C('#d9b45a')); L1.line([[ix, 54], [ix, 36]], 2.2, C('#d9b45a'));
    /* la torre Eiffel */
    latticeTower(L2, 160, 210, 600, [[0, 84], [.06, 70], [.2, 47], [.42, 21], [.62, 13], [.85, 7], [.93, 4.5]], C('#7c5a44'), { arch: true, plats: [[.2, 12], [.42, 9]], legW: .3, bands: [[.2, .42, 5, 5], [.42, .93, 2, 15]] });
    for (let i = 0; i < 26; i++) { const hf = rnd(.05, .95), w = [[0, 84], [.2, 47], [.42, 21], [.93, 4.5]].reduce((a, b, k, arr) => k && hf <= b[0] && hf > arr[k - 1][0] ? lerp(arr[k - 1][1], b[1], (hf - arr[k - 1][0]) / (b[0] - arr[k - 1][0])) : a, 4); L2.glow(160 + (R() < .5 ? -1 : 1) * w * rnd(.6, 1), 210 - hf * 600, 1.4, C('#ffd890')); }
    /* el quai: edificios haussmannianos con mansarda, buhardillas, balcones corridos y tiendas */
    seed(8); const hq = { w: [64, 108], h: [100, 150], cols: [C('#e8dcc2'), C('#e2d3b6'), C('#ecdfc6'), C('#dccdb0')], roof: 'mansard', rh: 28, roofC: C('#7a8796'), floorH: 21, winW: 8, winH: 13, winGap: 16, balc: 'long', shop: true, awnings: [C('#8a2f2f'), C('#2f5a45'), C('#c9a24a')], chim: 3, side: 6, lit: .6, belt: [1] };
    row(L3, -1150, 30, 206, hq); row(L3, 300, 1150, 206, hq);
    /* esquinas con rotonda y cúpula, a los dos lados del hueco que deja ver la torre */
    for (const [rx, dir] of [[30, -1], [300, 1]]) { const rw = 46, rx0 = dir < 0 ? rx - rw / 2 : rx - rw / 2; facade(L3, rx0, 206, rw, 168, { c: C('#efe4cc'), roof: 'flat', floorH: 21, winW: 7, winH: 13, winGap: 14, balc: 'long', shop: true, awning: [C('#8a2f2f')], side: 0, lit: .6 }); L3.trim(ell(rx, 206 - 172, 26, 34, 20, PI, TAU), C('#6f7c8c')); L3.line([[rx, 206 - 206], [rx, 206 - 222]], 1.8, C('#5a5a62')); }
    /* el Campo de Marte: árboles bajos y el pie de la torre a la vista */
    trees(L3, 60, 280, 210, { gap: [24, 40], h: [34, 48], kind: 'round', cols: [C('#8f9a62'), C('#7f8c58')] });
    L3.solid(rect(-1150, 206, 2300, 34), C('#cbbca0'), { ink: 0 });   /* muro del muelle */
    for (let x = -1150; x < 1150; x += 26) L3.line([[x, 206], [x, 240]], .6, C('#9c8c74'), { ink: 0 });
    trees(L3, -1100, 1100, 206, { gap: [90, 160], h: [52, 74], kind: 'round', cols: [C('#8f9a62'), C('#a0a066'), C('#86915c')] });
    lamps(L3, -1080, 1100, 206, 140, 30);
    /* el puente */
    arches(L4, -1300, 1300, 262, 300, 7, C('#d7c8aa'), { th: 16, rise: .9 });
    railing(L4, -1300, 1300, 256, C('#6a5e52'), 6, 9);
    lamps(L4, -1250, 1300, 256, 190, 34, C('#3c3632'));
    seed(12); for (let i = 0; i < 14; i++) person(L4, rnd(-1100, 1200), 256, rnd(14, 17), C('#3a3236'), { coat: R() < .5 });
    /* primer plano: pretil de piedra, buquinistas, dos plátanos que enmarcan, farolas, gente */
    const PY = 404;
    L5.solid([[-1400, PY], [1400, PY], [1400, 560], [-1400, 560]], C('#c9b896'), { grad: .5 });
    L5.trim(rect(-1400, PY - 12, 2800, 13), C('#dccdac'));
    L5.shade(rect(-1400, PY + 1, 2800, 7), C('#a99a7c'));
    seed(13); for (let y = PY + 22; y < 560; y += 26) { const off = ((y / 26) % 2) * 29; for (let x = -1400 + off; x < 1400; x += 58) L5.line([[x, y - 26], [x, y]], .7, C('#9a8a6e'), { ink: 0 }); L5.line([[-1400, y], [1400, y]], .7, C('#9a8a6e'), { ink: 0 }); }
    for (let i = 0; i < 40; i++) { const x = rnd(-1380, 1380), y = rnd(PY + 14, 540); L5.trim(rect(x, y, rnd(14, 40), rnd(5, 12)), C('#bfae8c')); }
    seed(14); for (let x = -1300; x < 1300; x += rnd(250, 340)) { const w = rnd(76, 100), y0 = PY - 40; L5.trim(rect(x, y0, w, 28), C('#2f5a45')); L5.trim([[x - 3, y0], [x + w + 3, y0], [x + w - 4, y0 - 10], [x + 4, y0 - 10]], C('#3d6b54')); for (let k = 0; k < 4; k++) L5.trim(rect(x + 6 + k * (w - 12) / 4, y0 + 6, (w - 12) / 4 - 4, 10), pick([C('#b8483c'), C('#d9b26a'), C('#5a6a8e'), C('#e8dcc0')])); }
    for (const tx of [-1250, -880, 1120]) L5.tree(tx, PY - 12, rnd(250, 300), 'round', pick([C('#7f8c4e'), C('#8c9452'), C('#93964f')]));
    lamps(L5, -1060, 1300, PY - 12, 420, 70, C('#2e2a2a'));
    seed(15); for (let i = 0; i < 10; i++) person(L5, rnd(-1200, 1200), PY - 10, rnd(42, 50), pick([C('#2e2a30'), C('#4a3a3a'), C('#33384a')]), { coat: R() < .6 });
    return [L0, L1, L2, L3, L4, L5];
  },
  live: {
    3: (g, st) => { /* bateau-mouche */ const T = LT(.66), x = ((st.t * 22) % 2600) - 1300; liveShape(g, st, T, [[[x - 70, 262], [x + 80, 262], [x + 66, 276], [x - 64, 276]], rect(x - 50, 250, 96, 12)], st.style === 'wc' ? C('#e9e2d2') : C('#f4efe2')); },
    5: (g, st) => birds(g, st, 9, -230, 26, 4),
  },
});

/* ================================ PIEZAS COMUNES ================================ */
/* rascacielos: ventanas pequeñas y densas; corona según tipo */
function tower(L, x, gy, w, h, c, o = {}) {
  const top = gy - h, side = o.side ?? Math.min(22, w * .2);
  if (side) L.shade([[x + w, top], [x + w + side, top + side * .3], [x + w + side, gy], [x + w, gy]], shadeC(c, -.28));
  L.solid(rect(x, top, w, h), c);
  const fl = o.fl ?? 9, ww = o.ww ?? 3.2, gap = o.gap ?? 6.5, rows = Math.floor((h - 14) / fl), cols = Math.max(1, Math.floor((w - 6) / gap)), mx = (w - cols * gap) / 2 + (gap - ww) / 2;
  if (o.bands) for (let r = 0; r < rows; r++) L.trim(rect(x, top + 8 + r * fl + fl * .62, w, fl * .38), shadeC(c, -.12));   /* bandas horizontales (muro cortina) */
  for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) if (!o.sparse || R() > o.sparse) L.win(x + mx + k * gap, top + 8 + r * fl, ww, fl * .58, { lit: o.lit ?? .55, c: o.winC });
  if (o.ribs) for (let k = 1; k < cols; k++) L.line([[x + mx + k * gap - (gap - ww) / 2, top + 4], [x + mx + k * gap - (gap - ww) / 2, gy]], .6, shadeC(c, -.2), { ink: 0 });
  let rt = top;
  if (o.crown === 'box') { L.solid(rect(x + w * .2, top - 16, w * .6, 16), shadeC(c, -.05)); rt -= 16; }
  else if (o.crown === 'slant') { L.trim([[x, top + 1], [x + w, top - w * .45], [x + w, top + 1]], shadeC(c, -.15)); rt = top - w * .45; }
  else if (o.crown === 'steps') { let xx = x, ww2 = w, yy = top; for (let i = 0; i < 3; i++) { const sh = 18 - i * 3; xx += ww2 * .12; ww2 *= .76; L.solid(rect(xx, yy - sh, ww2, sh), c); yy -= sh; } rt = yy; }
  if (o.mast) { L.line([[x + w / 2, rt], [x + w / 2, rt - o.mast]], 1.6, shadeC(c, -.4)); L.glow(x + w / 2, rt - o.mast, 1.6, C('#ff5a4a')); }
  if (o.tank) waterTank(L, x + w * .3, top, shadeC(c, -.35));
  return rt;
}
/* cúpula con tambor, nervios y linterna */
function dome(L, cx, by, r, c, o = {}) {
  const dh = r * (o.tall ?? 1.15), drum = o.drum ?? r * .55;
  if (drum) { L.solid(rect(cx - r * .92, by - drum, r * 1.84, drum), o.drumC || shadeC(c, .1)); for (let k = -3; k <= 3; k++) { const x = cx + k * r * .25; L.win(x - r * .05, by - drum * .78, r * .1, drum * .5, { lit: .3, arch: true }); L.line([[x + r * .12, by - drum], [x + r * .12, by]], 1, shadeC(c, -.25), { ink: 0 }); } }
  const y0 = by - drum, pts = []; for (let i = 0; i <= 24; i++) { const a = PI + i / 24 * PI; pts.push([cx + Math.cos(a) * r, y0 + Math.sin(a) * dh * (1 - .12 * Math.pow(Math.cos(a), 2))]); }
  L.trim(pts, c); for (let k = -2; k <= 2; k++) { if (!k) continue; const rib = []; for (let i = 0; i <= 10; i++) { const t = i / 10; rib.push([cx + k / 3 * r * Math.cos(t * PI / 2), y0 - Math.sin(t * PI / 2) * dh * .96]); } L.line(rib, 1.1, shadeC(c, -.25)); }
  if (o.lantern !== false) { L.solid(rect(cx - r * .12, y0 - dh - r * .3, r * .24, r * .32), shadeC(c, .15)); L.trim(ell(cx, y0 - dh - r * .3, r * .13, r * .14, 10, PI, TAU), c); L.line([[cx, y0 - dh - r * .44], [cx, y0 - dh - r * .62]], 1.4, shadeC(c, -.3)); if (o.cross) L.line([[cx - r * .05, y0 - dh - r * .56], [cx + r * .05, y0 - dh - r * .56]], 1.1, shadeC(c, -.3)); }
  return y0 - dh;
}
/* minarete: fuste esbelto, balcones y punta de lápiz */
function minaret(L, cx, gy, h, c, o = {}) {
  const w = o.w ?? h * .05; L.solid([[cx - w, gy], [cx - w * .8, gy - h * .85], [cx + w * .8, gy - h * .85], [cx + w, gy]], c);
  for (const f of o.balc || [.45, .7]) { L.trim(rect(cx - w * 1.7, gy - h * f - 3, w * 3.4, 4), shadeC(c, -.15)); L.line([[cx - w * 1.6, gy - h * f - 3], [cx + w * 1.6, gy - h * f - 3]], .8, shadeC(c, -.35)); }
  L.trim([[cx - w * .85, gy - h * .85], [cx, gy - h], [cx + w * .85, gy - h * .85]], o.capC || shadeC(c, -.2)); L.line([[cx, gy - h], [cx, gy - h - h * .04]], 1, shadeC(c, -.4));
}
/* agujas góticas sobre una línea de cornisa */
function pinnacles(L, x0, x1, y, step, hh, c) { for (let x = x0; x <= x1; x += step) L.trim([[x - 2.5, y], [x - 2.5, y - hh * .5], [x, y - hh], [x + 2.5, y - hh * .5], [x + 2.5, y]], c); }
/* pagoda de cinco tejados */
function pagoda(L, cx, gy, h, c, roofC) {
  const tiers = 5, th = h * .8 / tiers; let y = gy;
  for (let i = 0; i < tiers; i++) { const w = h * (.2 - i * .025), ry = y - th; L.solid(rect(cx - w * .6, ry + th * .35, w * 1.2, th * .65), c); L.win(cx - w * .25, ry + th * .45, w * .5, th * .35, { lit: .8, warm: 1 });
    L.trim([[cx - w * 1.25, ry + th * .42], [cx - w * .9, ry + th * .3], [cx - w * .7, ry + th * .12], [cx + w * .7, ry + th * .12], [cx + w * .9, ry + th * .3], [cx + w * 1.25, ry + th * .42], [cx + w * .8, ry + th * .36], [cx - w * .8, ry + th * .36]], roofC); y = ry + th * .12; }
  L.line([[cx, y], [cx, gy - h]], 2, shadeC(roofC, -.2)); for (let k = 0; k < 6; k++) L.line([[cx - 3, y - 6 - k * 5], [cx + 3, y - 6 - k * 5]], 1.2, shadeC(roofC, -.2));
}
/* casa colonial: muro encalado, teja, balcón de madera, puerta de color */
function colonial(L, x, gy, w, h, o = {}) {
  const wall = o.wall || C('#f2ece0'), roof = o.roof || C('#b4532e'), wood = o.wood || pick([C('#2f5a45'), C('#3f5f8a'), C('#7a3a2a')]);
  L.solid(rect(x, gy - h, w, h), wall); L.trim(rect(x, gy - 10, w, 10), shadeC(wall, -.18));
  L.trim([[x - 8, gy - h + 4], [x + w + 8, gy - h + 4], [x + w + 2, gy - h - 12], [x - 2, gy - h - 12]], roof); L.shade(rect(x, gy - h + 4, w, 6), shadeC(wall, -.25));
  for (let i = 0; i < 6; i++) L.line([[x - 6 + i * (w + 12) / 5, gy - h + 4], [x - 1 + i * (w + 2) / 5, gy - h - 11]], .5, shadeC(roof, -.3), { ink: 0 });
  const dw = Math.min(16, w * .22); L.trim(rect(x + w * .15, gy - 30, dw, 30), wood); L.win(x + w * .15 + 2, gy - 28, dw - 4, 8, { lit: .4, warm: 1 });
  if (h > 60) { const bx = x + w * .45, bw = w * .45; L.win(bx + 4, gy - h + 20, bw - 8, 18, { lit: .5, warm: 1 }); L.trim(rect(bx, gy - h + 38, bw, 4), wood); for (let k = 0; k <= 8; k++) L.line([[bx + k * bw / 8, gy - h + 38], [bx + k * bw / 8, gy - h + 46]], 1, wood, { ink: 0 }); L.trim(rect(bx, gy - h + 46, bw, 3), wood); L.trim(rect(bx - 2, gy - h + 14, bw + 4, 3), wood); }
  else L.win(x + w * .55, gy - h + 18, w * .25, 14, { lit: .5, warm: 1 });
  L.win(x + w * .55, gy - 26, w * .25, 14, { lit: .45, warm: 1 });
  if (o.lamp) { L.line([[x + w - 4, gy - 34], [x + w + 4, gy - 38]], 1.2, C('#2a2624')); L.glow(x + w + 5, gy - 34, 2.4, C('#ffcf8a')); }
}
/* tejados de teja vistos desde arriba (Roma): muchas aguas superpuestas */
function rooftops(L, x0, x1, gy, o) { for (let x = x0; x < x1;) { const w = rnd(o.w[0], o.w[1]), h = rnd(o.h[0], o.h[1]), c = pick(o.cols); facade(L, x, gy - rnd(0, 30), w, h, { c, roof: R() < .7 ? 'tile' : 'hip', roofC: pick(o.roofs), rh: rnd(10, 18), floorH: 18, winW: 6, winH: 10, winGap: 14, shutter: R() < .6 ? pick(o.shutters) : 0, side: rnd(0, 10), chim: ri(0, 1), cornice: false, lit: .55 }); x += w - rnd(0, 8); } }
