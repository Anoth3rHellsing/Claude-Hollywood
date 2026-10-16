/* =====================================================================
   AGUADA · la tacita con boina (diseño de Nico), en píxeles nítidos.
   No se adapta al mundo: es 2D de 8 bits y solo cambia de tamaño con la distancia (PS(z)).
   El mundo sí reacciona a ella: sombra cuadrada, ondas en los charcos, reflejo pixelado, hojas que se apartan.
   ===================================================================== */
const AG_GRID = [
  '...........KKKKK.KK...',
  '..........KBBBBXKXK...',
  '.........KBBBBBBXK....',
  '..........KBBBBXXDK...',
  'KKKKKKKKKKKKKKKKXXDK..',
  'K..............KXDDK..',
  'K...............KDDK..',
  'K................KK...',
  'KOOKKTOOOOOOKKTOSK.K..',
  'KOOKKKOOOOOOKKKOSKK.K.',
  'KOOKKKOOOOOOKKKOSK.K.K',
  'KOOOOOOOOOOOOOOOSK.K.K',
  'KOOOOOOOOOOOOOOOSK.K.K',
  'KOOOOOOOOOOOOOOOSKK.K.',
  'KOOOOOOOOOOOOOOOSK.K..',
  'KOOOOOOOOOOOOOOOSKK...',
  'KKOOSKKKKKKKKOOSKK....',
  '.KOOSK......KOOSK.....',
  '.KOOSK......KOOSK.....',
  '.KOOSK......KOOSK.....',
  '.KOOSK......KOOSK.....',
  '.KKKKK......KKKKK.....'];
const AG_PAL = { K: [30, 24, 28], B: [200, 112, 24], X: [72, 40, 0], D: [40, 24, 0], O: [112, 224, 248], T: [248, 248, 248], S: [24, 168, 200], W: [238, 244, 244], G: [128, 122, 116], g: [86, 80, 76], Q: [206, 236, 246], A: [255, 252, 240] };
const AG_CW = 22, AG_CH = 22, AG_PAD = 4;   // margen para salpicaduras y la piedra
const AG_CELL = 3.4;                         // unidades de mundo por píxel del sprite (≈ 75 de alto con la boina)
/* el vacío del vaso y el interior de la manilla son blancos en pantalla: se rellenan los '.' que no tocan el borde */
const AG_BASE = (() => {
  const g = AG_GRID.map(r => r.padEnd(AG_CW, '.').split('')), seen = g.map(r => r.map(() => false)), st = [];
  for (let y = 0; y < AG_CH; y++) for (let x = 0; x < AG_CW; x++) if ((x === 0 || y === 0 || x === AG_CW - 1 || y === AG_CH - 1) && g[y][x] === '.') { seen[y][x] = true; st.push([x, y]); }
  while (st.length) { const [x, y] = st.pop(); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const a = x + dx, b = y + dy; if (a < 0 || b < 0 || a >= AG_CW || b >= AG_CH || seen[b][a] || g[b][a] !== '.') continue; seen[b][a] = true; st.push([a, b]); } }
  for (let y = 0; y < AG_CH; y++) for (let x = 0; x < AG_CW; x++) if (g[y][x] === '.' && !seen[y][x]) g[y][x] = 'W';
  return g;
})();
/* un cuadro de animación a partir de la cuadrícula: piernas, parpadeo, agua que se mueve, piedra dentro */
function agFrame(o) {
  const g = AG_BASE.map(r => r.slice());
  const lift = (c0, c1, n) => { const old = g.map(r => r.slice()); for (let y = 17; y < AG_CH; y++) for (let x = c0; x <= c1; x++) g[y - n][x] = old[y][x]; for (let y = AG_CH - n; y < AG_CH; y++) for (let x = c0; x <= c1; x++) g[y][x] = '.'; };
  if (o.legL) lift(1, 5, o.legL);
  if (o.legR) lift(12, 16, o.legR);
  if (o.blink) { for (const c of [3, 4, 5, 12, 13, 14]) { g[8][c] = 'O'; g[9][c] = 'K'; g[10][c] = 'O'; } }
  if (o.look) {   // la mirada se desplaza un píxel (hacia arriba con "Uy")
    for (const c of [3, 4, 5, 12, 13, 14]) for (const r of [8, 9, 10]) if (g[r][c] === 'K' || g[r][c] === 'T') g[r][c] = 'O';
    const dy = o.look < 0 ? -1 : 0;
    for (const c0 of [3, 12]) { g[8 + dy + 1][c0] = 'K'; g[8 + dy + 1][c0 + 1] = 'K'; g[9 + dy + 1][c0] = 'K'; g[9 + dy + 1][c0 + 1] = 'K'; g[8 + dy + 1][c0 + 1] = 'T'; }
  }
  if (o.slosh) { const L = o.slosh > 0; for (let x = L ? 1 : 8; x <= (L ? 7 : 15); x++) if (g[7][x] === 'W') g[7][x] = 'O'; }
  if (o.full) { for (let x = 1; x <= 15; x++) for (const y of [6, 7]) if (g[y][x] === 'W') g[y][x] = 'O'; }
  if (o.stone) { for (const [x, y, c] of [[6, 5, 'G'], [7, 5, 'G'], [8, 5, 'g'], [5, 6, 'G'], [6, 6, 'G'], [7, 6, 'g'], [8, 6, 'g'], [9, 6, 'g'], [6, 4, 'G'], [7, 4, 'g']]) g[y][x] = c; }
  if (o.sweat) { for (const [x, y] of [[20, 2], [20, 3], [21, 3], [20, 4]]) g[y][x] = 'Q'; }
  return g;
}
const AG_CACHE = new Map();
function agCanvas(o) {
  const key = JSON.stringify(o); let c = AG_CACHE.get(key); if (c) return c;
  const g = agFrame(o), P = AG_PAD; c = mk(AG_CW + P * 2, AG_CH + P); const x = c.getContext('2d'), id = x.createImageData(c.width, c.height);
  for (let y = 0; y < AG_CH; y++) for (let i = 0; i < AG_CW; i++) { const ch = g[y][i], col = AG_PAL[ch]; if (!col) continue; const k = ((y + P) * c.width + i + P) * 4; id.data[k] = col[0]; id.data[k + 1] = col[1]; id.data[k + 2] = col[2]; id.data[k + 3] = 255; }
  x.putImageData(id, 0, 0); c.grid = g; AG_CACHE.set(key, c); return c;
}
/* dibuja a Aguada con el pie (centro de la base) en px de dispositivo (fx, fy); cell = px por píxel del sprite */
function agBlit(c, fx, fy, cell, o = {}) {
  cell = Math.max(1, Math.round(cell));
  const w = c.width * cell, h = c.height * cell, sx = o.flip ? -1 : 1, sqY = o.sq || 1;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingEnabled = false; ctx.globalAlpha = o.a ?? 1;
  const x0 = Math.round(fx - (AG_PAD + 8.5) * cell * sx), y0 = Math.round(fy - (AG_CH + AG_PAD) * cell * sqY);
  if (o.appear !== undefined && o.appear < 1) {   // aparece píxel a píxel (blip 8 bits)
    const g = c.grid; ctx.translate(x0, y0); ctx.scale(sx, 1);
    for (let y = 0; y < AG_CH; y++) for (let i = 0; i < AG_CW; i++) { const col = AG_PAL[g[y][i]]; if (!col) continue; const th = hsh(i * 1.7, y * 2.3); if (th > o.appear) continue; const pop = clamp((o.appear - th) * 6); ctx.fillStyle = cssc(pop < 1 ? mixc([255, 255, 255], col, pop) : col); ctx.fillRect((i + AG_PAD) * cell, (y + AG_PAD) * cell * sqY, cell, Math.ceil(cell * sqY)); }
  } else { ctx.translate(x0, y0); ctx.scale(sx, sqY); ctx.drawImage(c, 0, 0, w, h); }
  ctx.restore(); T0();
}
/* estado de Aguada en el tiempo t (coreografía por bloques; ver AGK en 36_film) */
function agCell(z) { return AG_CELL * PS(z) * U; }
function agFoot(st) { const p = PJ(st.x, -(st.y || 0), st.z); return [p[0] * U + W / 2 + SHX, p[1] * U + H / 2 + SHY]; }
/* sombra cuadrada en el suelo (en píxeles del sprite: no se deforma con la perspectiva) */
function agShadow(st) {
  const p = PJ(st.x, 0, st.z), cell = Math.max(1, Math.round(agCell(st.z))), lift = clamp(1 - (st.y || 0) / 120);
  const fx = Math.round(p[0] * U + W / 2 + SHX), fy = Math.round(p[1] * U + H / 2 + SHY), w = Math.round(18 * lift + 2) * cell;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = `rgba(52,38,28,${.32 * lift})`;
  ctx.fillRect(fx - w / 2 + 4 * cell, fy - cell, w, cell * 2); ctx.fillStyle = `rgba(52,38,28,${.18 * lift})`; ctx.fillRect(fx - w / 2 + 3 * cell, fy - cell * 2, w + cell * 2, cell);   // la luz viene de la izquierda: la sombra se corre a la derecha
  ctx.restore(); T0();
}
function agDraw(st) {
  if (!st || st.hide) return;
  if (st.z - CAM.z < 40) return;
  agShadow(st);
  const [fx, fy] = agFoot(st), c = agCanvas(st.f || {});
  agBlit(c, fx, fy, agCell(st.z), { flip: st.flip, sq: st.sq, appear: st.appear, a: st.a });
  if (st.extra) st.extra(fx, fy, Math.max(1, Math.round(agCell(st.z))));
}
/* reflejo pixelado en los charcos (se llama con el recorte de los charcos ya puesto) */
function agReflect(st, t) {
  if (!st || st.hide || st.z - CAM.z < 40) return;
  const p = PJ(st.x, 0, st.z), c = agCanvas(st.f || {}), cell = Math.max(1, Math.round(agCell(st.z)));
  const fx = Math.round(p[0] * U + W / 2 + SHX), fy = Math.round(p[1] * U + H / 2 + SHY), up = Math.round((st.y || 0) * PS(st.z) * U);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingEnabled = false; ctx.globalAlpha = .55;
  const rows = c.height, sx = st.flip ? -1 : 1;
  for (let r = 0; r < rows; r++) {   // fila por fila, invertida, con un vaivén que respeta la cuadrícula
    const off = Math.round(Math.sin(t * 5 + r * .9) * .6 + (st.rip || 0) * Math.sin(t * 14 + r * 1.3) * 1.5) * cell;
    const dy = fy + up + (rows - 1 - r - AG_PAD + 1) * cell;
    ctx.save(); ctx.translate(Math.round(fx - (AG_PAD + 8.5) * cell * sx) + off, dy); ctx.scale(sx, 1);
    ctx.drawImage(c, 0, r, c.width, 1, 0, 0, c.width * cell, cell); ctx.restore();
  }
  ctx.restore(); T0();
}
/* chispas cuadradas (aparecer, salpicar, golpes): estrellitas de 1 píxel del sprite */
function pixBurst(fx, fy, cell, age, n, seed, cols, spread = 14, up = 18) {
  if (age < 0 || age > 1.2) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  for (let i = 0; i < n; i++) {
    const a = -PI / 2 + (hsh(i, seed) - .5) * 2.6, v = (.5 + hsh(i, seed + 1)) * spread, x = fx + Math.cos(a) * v * age * cell * 2, y = fy + (Math.sin(a) * up * age + 30 * age * age) * cell;
    ctx.globalAlpha = 1 - sm(age / 1.2); ctx.fillStyle = cssc(cols[i % cols.length]); ctx.fillRect(Math.round(x / cell) * cell, Math.round(y / cell) * cell, cell, cell);
  }
  ctx.restore(); T0();
}
