/* =====================================================================
   SPRITES EN PÍXELES NÍTIDOS · Brote (la maceta con audífonos), Tetera (la barista), el auto, palomas y gaviotas
   Lo mismo que Aguada: el mundo es acuarela en perspectiva y ellos son 8 bits; solo escalan con PS(z),
   con píxeles enteros y sin suavizado.
   ===================================================================== */
const PAL = { K: [30, 24, 28], R: [226, 134, 90], P: [200, 104, 66], Q: [156, 74, 50], g: [70, 128, 62], G: [128, 196, 94], H: [70, 62, 84], M: [240, 188, 74], m: [198, 142, 52], T: [250, 250, 250], E: [240, 150, 140],
  W: [242, 240, 232], C: [118, 196, 176], c: [78, 148, 134], w: [206, 232, 240, 90], Y: [252, 222, 130], L: [236, 120, 96], l: [180, 82, 66], S: [150, 150, 156], s: [96, 96, 104], B: [120, 86, 62], b: [86, 60, 44], F: [255, 236, 190] };
const BROTE = [
  '.....HHHHHHHHHHHH.....',
  '...HH....KK.KK....HH..',
  '..H.....KGGKGGK.....H.',
  '.H.....KGGgKgGGK....H.',
  '.H.....KGgKKKgGK....H.',
  '.H.....KgKggKKgK....H.',
  '.H......KKggKK......H.',
  'KKKKKKKKKKKKKKKKKKKKKK',
  'MmKRRRRRRRRRRRRRRRRKmM',
  'MmKKKKKKKKKKKKKKKKKKmM',
  'KK.KPPPPPPPPPPPPPPQKKK',
  '...KPPKKTPPPPKKTPPQK..',
  '...KPPKKKPPPPKKKPPQK..',
  '...KPEEPPPKKPPPEEPQK..',
  '....KPPPPPPPPPPPPQK...',
  '....KPPPPPPPPPPPPQK...',
  '....KQQPPPPPPPPQQQK...',
  '.....KKKKKKKKKKKKK....',
  '......KPQK...KPQK.....',
  '......KPQK...KPQK.....',
  '......KKKK...KKKK.....',
  '......................'];
const SP_PAD = 4;
/* fabrica una cuadrícula de 22×22 de Brote con su cuadro de animación */
function broteGrid(o) {
  const g = BROTE.map(r => r.split(''));
  const lift = (c0, c1, n) => { const old = g.map(r => r.slice()); for (let y = 18; y < 21; y++) for (let x = c0; x <= c1; x++) g[y - n][x] = old[y][x]; for (let y = 21 - n; y < 21; y++) for (let x = c0; x <= c1; x++) g[y][x] = '.'; };
  if (o.legL) lift(6, 9, o.legL); if (o.legR) lift(13, 16, o.legR);
  if (o.sit) { for (let y = 18; y < 21; y++) for (let x = 0; x < 22; x++) g[y][x] = '.'; }
  if (o.back) { for (let y = 11; y <= 13; y++) for (let x = 4; x <= 17; x++) if ('KTE'.includes(g[y][x])) g[y][x] = 'P'; g[12][9] = 'Q'; g[12][10] = 'Q'; g[13][9] = 'Q'; }
  else if (o.blink || o.sleep) for (const c of [6, 7, 8, 13, 14, 15]) { g[11][c] = 'P'; g[12][c] = c === 8 || c === 15 ? 'P' : 'K'; }
  if (o.happy) for (const c of [6, 7, 8, 13, 14, 15]) { g[11][c] = (c === 7 || c === 14) ? 'K' : 'P'; g[12][c] = (c === 7 || c === 14) ? 'P' : 'K'; }   // ojos ^ ^
  if (o.mouthO) { g[13][10] = 'K'; g[13][11] = 'K'; g[14][10] = 'K'; g[14][11] = 'K'; }
  if (o.leaf) {   // las hojas se mecen un píxel (solo las filas de arriba; el tallo queda)
    const d = o.leaf > 0 ? 1 : -1, old = g.map(r => r.slice()), isLeaf = (y, x) => y >= 1 && y <= 4 && x >= 7 && x <= 16 && 'GgK'.includes(old[y][x]);
    for (let y = 1; y <= 4; y++) for (let x = 7; x <= 16; x++) if (isLeaf(y, x)) g[y][x] = '.';
    for (let y = 1; y <= 4; y++) for (let x = 7; x <= 16; x++) if (isLeaf(y, x) && g[y][x + d] !== 'H') g[y][x + d] = old[y][x];
  }
  if (o.cup) {   // la taza de café apoyada en el borde de la maceta, a la derecha
    for (const [x, y, c] of [[15, 3, 'K'], [16, 3, 'K'], [17, 3, 'K'], [18, 3, 'K'], [15, 4, 'K'], [16, 4, 'W'], [17, 4, 'W'], [18, 4, 'K'], [19, 4, 'K'], [15, 5, 'K'], [16, 5, 'W'], [17, 5, 'W'], [18, 5, 'K'], [20, 5, 'K'], [15, 6, 'K'], [16, 6, 'W'], [17, 6, 'W'], [18, 6, 'K'], [19, 6, 'K'], [16, 7, 'K'], [17, 7, 'K']]) if (x < 22) g[y][x] = c;
    g[3][16] = 'b'; g[3][17] = 'b';
  }
  return g;
}
/* Tetera, la barista: tetera turquesa con tapa, pico y asa (20×20) */
const TETERA = [
  '........KK..........',
  '.......KYYK.........',
  '.....KKKKKKKK.......',
  '....KCCCCCCCCK......',
  '...KKKKKKKKKKKK.....',
  '..KCCCCCCCCCCCCK....',
  '.KCCCCCCCCCCCCCCK.KK',
  'KKCCKKTCCCCKKTCCKKCK',
  'KCKCKKKCCCCKKKCCCKCK',
  'KCKCCCCCCCCCCCCCKCK.',
  'KCKCLLCCCKKCCLLCKK..',
  '.KKCCCCCCCCCCCCcK...',
  '...KcCCCCCCCCccK....',
  '....KcccccccccK.....',
  '.....KKKKKKKKKK.....',
  '......KK....KK......',
  '......KK....KK......',
  '....................'];
function teteraGrid(o) { const g = TETERA.map(r => r.split('')); if (o.blink) for (const c of [4, 5, 6, 11, 12, 13]) { g[7][c] = 'C'; g[8][c] = c === 6 || c === 13 ? 'C' : 'K'; } if (o.tilt) { /* pico que vierte: una gota */ g[6][19] = 'b'; } return g; }
/* el auto: redondo, verde menta, de perfil (mira a la derecha); ventanas translúcidas para ver a Brote */
const CAR_W = 44, CAR_H = 22;
function carGrid(o = {}) {
  const g = []; for (let y = 0; y < CAR_H; y++) { g.push(Array(CAR_W).fill('.')); }
  const inBody = (x, y) => {
    const cx = x + .5, cy = y + .5;
    const lower = cy > 9 && cy < 18 && cx > 2 && cx < 42 && !(cy > 15 && ((cx - 11) ** 2 + (cy - 17.5) ** 2 < 22 || (cx - 33) ** 2 + (cy - 17.5) ** 2 < 22));
    const cabin = ((cx - 21) / 13) ** 2 + ((cy - 10) / 8.6) ** 2 < 1 && cy < 11;
    const noseR = cx >= 38 && cy > 9 && ((cx - 38) / 4.5) ** 2 + ((cy - 13.5) / 4.6) ** 2 < 1;
    const noseL = cx <= 6 && cy > 9 && ((cx - 6) / 4.6) ** 2 + ((cy - 13.5) / 4.6) ** 2 < 1;
    return cabin || (lower && (cx > 6 && cx < 38)) || noseR || noseL;
  };
  for (let y = 0; y < CAR_H; y++) for (let x = 0; x < CAR_W; x++) if (inBody(x, y)) g[y][x] = y > 14 ? 'c' : 'C';
  /* ventanas (translúcidas) y marco */
  for (let y = 4; y < 10; y++) for (let x = 11; x < 32; x++) { const cx = x + .5, cy = y + .5; if (((cx - 21) / 11) ** 2 + ((cy - 10.5) / 6.8) ** 2 < 1 && x !== 21 && x !== 22) g[y][x] = 'w'; }
  /* contorno */
  const o2 = g.map(r => r.slice());
  for (let y = 0; y < CAR_H; y++) for (let x = 0; x < CAR_W; x++) { if (o2[y][x] !== '.') continue; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const a = x + dx, b = y + dy; if (a >= 0 && b >= 0 && a < CAR_W && b < CAR_H && o2[b][a] !== '.' && o2[b][a] !== 'w') { g[y][x] = 'K'; break; } } }
  /* faro, piloto, manija, parachoques, franja */
  g[11][40] = 'Y'; g[12][40] = 'Y'; g[11][39] = 'Y'; g[11][3] = 'L'; g[12][3] = 'L'; g[11][26] = 'K'; g[11][27] = 'K';
  for (let x = 4; x < 40; x++) if (g[13][x] === 'C') g[13][x] = 'W';
  for (let x = 1; x < 6; x++) g[16][x] = g[16][x] === '.' ? '.' : 'S'; for (let x = 38; x < 43; x++) if (g[16][x] !== '.') g[16][x] = 'S';
  return g;
}
/* rueda (9×9) con radios que giran */
function wheelGrid(a) {
  const g = []; for (let y = 0; y < 9; y++) { g.push(Array(9).fill('.')); for (let x = 0; x < 9; x++) { const r = Math.hypot(x - 4, y - 4); if (r < 4.6) g[y][x] = r > 3.4 ? 'K' : r > 2.2 ? 's' : 'S'; } }
  for (let k = 0; k < 2; k++) { const an = a + k * PI / 2; for (let r = -2; r <= 2; r++) { const x = Math.round(4 + Math.cos(an) * r), y = Math.round(4 + Math.sin(an) * r); g[y][x] = 'K'; } }
  g[4][4] = 'W'; return g;
}
const PIGEON = [['..KK....', '.KSSK...', 'KTSSSK..', '.KSSSSKK', '..KSSSSK', '...KKKK.', '....K.K.'], ['........', '..KK....', '.KSSK.KK', 'KTSSSSSK', '..KSSSK.', '..KKKKK.', '...K.K..']];
const GULL = [['K.....K', '.K...K.', '..KWK..'], ['.......', 'KKKWKKK', '...K...']];
/* cuadrícula → lienzo (con caché) */
const SP_CACHE = new Map();
function gridCanvas(key, g) {
  let c = SP_CACHE.get(key); if (c) return c;
  const h = g.length, w = g[0].length, P = SP_PAD; c = mk(w + P * 2, h + P); const x = c.getContext('2d'), id = x.createImageData(c.width, c.height);
  for (let y = 0; y < h; y++) for (let i = 0; i < w; i++) { const col = PAL[g[y][i]]; if (!col) continue; const k = ((y + P) * c.width + i + P) * 4; id.data[k] = col[0]; id.data[k + 1] = col[1]; id.data[k + 2] = col[2]; id.data[k + 3] = col[3] ?? 255; }
  x.putImageData(id, 0, 0); c.grid = g; c.gw = w; c.gh = h; SP_CACHE.set(key, c); return c;
}
const broteCanvas = o => gridCanvas('b' + JSON.stringify(o), broteGrid(o));
const teteraCanvas = o => gridCanvas('t' + JSON.stringify(o), teteraGrid(o));
const carCanvas = () => gridCanvas('car', carGrid());
const wheelCanvas = a => { const k = Math.round(((a % (PI / 2)) + PI / 2) % (PI / 2) / (PI / 2) * 6) % 6; return gridCanvas('w' + k, wheelGrid(k / 6 * PI / 2)); };
/* dibuja con el pie (centro abajo) en px de dispositivo; cell = px por píxel del sprite (entero) */
function spBlit(c, fx, fy, cell, o = {}) {
  cell = Math.max(1, Math.round(cell));
  const sx = o.flip ? -1 : 1, sq = o.sq || 1, cx = o.cx ?? c.gw / 2;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingEnabled = false; ctx.globalAlpha = o.a ?? 1;
  const x0 = Math.round(fx - (SP_PAD + cx) * cell * sx), y0 = Math.round(fy - (c.gh + SP_PAD) * cell * sq);
  ctx.translate(x0, y0); ctx.scale(sx, sq); ctx.drawImage(c, 0, 0, c.width * cell, c.height * cell);
  ctx.restore(); T0();
}
/* en el mundo: pie en (x, y, z); celda en unidades de mundo */
const BR_CELL = 3.2;
function wFoot(x, y, z) { const p = PJ(x, -(y || 0), z); return [p[0] * U + W / 2 + SHX, p[1] * U + H / 2 + SHY]; }
function wCell(z, k = BR_CELL) { return Math.max(1, Math.round(k * PS(z) * U)); }
function spShadow(x, z, wCells, cell, lift = 1) {
  const p = PJ(x, 0, z), fx = Math.round(p[0] * U + W / 2 + SHX), fy = Math.round(p[1] * U + H / 2 + SHY), w = Math.round(wCells * lift + 2) * cell;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = `rgba(52,38,28,${.3 * lift})`; ctx.fillRect(fx - w / 2 + 3 * cell, fy - cell, w, cell * 2); ctx.restore(); T0();
}
function spReflect(c, x, y, z, t, cellK = BR_CELL, o = {}) {
  if (z - CAM.z < 40) return;
  const p = PJ(x, 0, z), cell = wCell(z, cellK), fx = Math.round(p[0] * U + W / 2 + SHX), fy = Math.round(p[1] * U + H / 2 + SHY), up = Math.round((y || 0) * PS(z) * U), sx = o.flip ? -1 : 1, cx = o.cx ?? c.gw / 2;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingEnabled = false; ctx.globalAlpha = o.a ?? .5;
  for (let r = 0; r < c.height; r++) { const off = Math.round(Math.sin(t * 4 + r * .9) * .6) * cell, dy = fy + up + (c.height - 1 - r - SP_PAD + 1) * cell; ctx.save(); ctx.translate(Math.round(fx - (SP_PAD + cx) * cell * sx) + off, dy); ctx.scale(sx, 1); ctx.drawImage(c, 0, r, c.width, 1, 0, 0, c.width * cell, cell); ctx.restore(); }
  ctx.restore(); T0();
}
/* chispas cuadradas */
function pixBurst(fx, fy, cell, age, n, seed, cols, spread = 14, up = 18) {
  if (age < 0 || age > 1.2) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  for (let i = 0; i < n; i++) { const a = -PI / 2 + (hsh(i, seed) - .5) * 2.6, v = (.5 + hsh(i, seed + 1)) * spread, x = fx + Math.cos(a) * v * age * cell * 2, y = fy + (Math.sin(a) * up * age + 30 * age * age) * cell; ctx.globalAlpha = 1 - sm(age / 1.2); ctx.fillStyle = cssc(cols[i % cols.length]); ctx.fillRect(Math.round(x / cell) * cell, Math.round(y / cell) * cell, cell, cell); }
  ctx.restore(); T0();
}
/* vapor del café: columnitas de píxeles que suben y se mecen */
function steamPix(fx, fy, cell, t, a = 1) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  for (let k = 0; k < 3; k++) for (let i = 0; i < 6; i++) { const ph = (t * .7 + k * .33 + i / 6) % 1, x = fx + (k - 1) * 2 * cell + Math.round(Math.sin(t * 2 + i + k) * 1.2) * cell, y = fy - ph * 14 * cell; ctx.globalAlpha = a * .7 * Math.sin(ph * PI); ctx.fillStyle = 'rgb(250,248,240)'; ctx.fillRect(Math.round(x / cell) * cell, Math.round(y / cell) * cell, cell, cell); }
  ctx.restore(); T0();
}
