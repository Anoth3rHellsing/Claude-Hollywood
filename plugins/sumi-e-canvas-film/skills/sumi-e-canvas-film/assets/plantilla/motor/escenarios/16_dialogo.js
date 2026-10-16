/* =====================================================================
   ESCENARIOS · DIÁLOGO PIXEL (estilo caja de RPG de 8 bits) y RÓTULOS DE HORA
   Fuente propia de 5×7 (con minúsculas, descendentes, tildes, ñ, ¿ ¡) dibujada en píxeles enteros.
   Cada línea se escribe letra a letra; cada letra dispara un bleep sintetizado cuya altura, onda y ritmo
   dependen del personaje (ELENCO[id].voz) y del ánimo: prisa (rápido y agudo), normal, técnico, sueño/agotado
   (lento, grave y con bostezos). Los tiempos se calculan una vez: la caja es función de t y el audio lee la lista.
   ===================================================================== */
const FONT5 = (() => {
  const G = {
    A: '.XXX.|X...X|X...X|XXXXX|X...X|X...X|X...X', B: 'XXXX.|X...X|X...X|XXXX.|X...X|X...X|XXXX.', C: '.XXX.|X...X|X....|X....|X....|X...X|.XXX.', D: 'XXXX.|X...X|X...X|X...X|X...X|X...X|XXXX.',
    E: 'XXXXX|X....|X....|XXXX.|X....|X....|XXXXX', F: 'XXXXX|X....|X....|XXXX.|X....|X....|X....', G: '.XXX.|X...X|X....|X.XXX|X...X|X...X|.XXXX', H: 'X...X|X...X|X...X|XXXXX|X...X|X...X|X...X',
    I: '.XXX.|..X..|..X..|..X..|..X..|..X..|.XXX.', J: '..XXX|...X.|...X.|...X.|...X.|X..X.|.XX..', K: 'X...X|X..X.|X.X..|XX...|X.X..|X..X.|X...X', L: 'X....|X....|X....|X....|X....|X....|XXXXX',
    M: 'X...X|XX.XX|X.X.X|X.X.X|X...X|X...X|X...X', N: 'X...X|XX..X|X.X.X|X..XX|X...X|X...X|X...X', O: '.XXX.|X...X|X...X|X...X|X...X|X...X|.XXX.', P: 'XXXX.|X...X|X...X|XXXX.|X....|X....|X....',
    Q: '.XXX.|X...X|X...X|X...X|X.X.X|X..X.|.XX.X', R: 'XXXX.|X...X|X...X|XXXX.|X.X..|X..X.|X...X', S: '.XXXX|X....|X....|.XXX.|....X|....X|XXXX.', T: 'XXXXX|..X..|..X..|..X..|..X..|..X..|..X..',
    U: 'X...X|X...X|X...X|X...X|X...X|X...X|.XXX.', V: 'X...X|X...X|X...X|X...X|X...X|.X.X.|..X..', W: 'X...X|X...X|X...X|X.X.X|X.X.X|X.X.X|.X.X.', X: 'X...X|X...X|.X.X.|..X..|.X.X.|X...X|X...X',
    Y: 'X...X|X...X|.X.X.|..X..|..X..|..X..|..X..', Z: 'XXXXX|....X|...X.|..X..|.X...|X....|XXXXX',
    a: '.....|.....|.XXX.|....X|.XXXX|X...X|.XXXX', b: 'X....|X....|XXXX.|X...X|X...X|X...X|XXXX.', c: '.....|.....|.XXX.|X....|X....|X...X|.XXX.', d: '....X|....X|.XXXX|X...X|X...X|X...X|.XXXX',
    e: '.....|.....|.XXX.|X...X|XXXXX|X....|.XXX.', f: '..XX.|.X..X|.X...|XXX..|.X...|.X...|.X...', g: '.....|.....|.XXXX|X...X|X...X|X...X|.XXXX|....X|.XXX.', h: 'X....|X....|XXXX.|X...X|X...X|X...X|X...X',
    i: '..X..|.....|.XX..|..X..|..X..|..X..|.XXX.', j: '...X.|.....|..XX.|...X.|...X.|...X.|...X.|X..X.|.XX..', k: 'X....|X....|X..X.|X.X..|XX...|X.X..|X..X.', l: '.XX..|..X..|..X..|..X..|..X..|..X..|.XXX.',
    m: '.....|.....|XX.X.|X.X.X|X.X.X|X.X.X|X.X.X', n: '.....|.....|XXXX.|X...X|X...X|X...X|X...X', o: '.....|.....|.XXX.|X...X|X...X|X...X|.XXX.', p: '.....|.....|XXXX.|X...X|X...X|X...X|XXXX.|X....|X....',
    q: '.....|.....|.XXXX|X...X|X...X|X...X|.XXXX|....X|....X', r: '.....|.....|X.XX.|XX..X|X....|X....|X....', s: '.....|.....|.XXXX|X....|.XXX.|....X|XXXX.', t: '.X...|.X...|XXXX.|.X...|.X...|.X..X|..XX.',
    u: '.....|.....|X...X|X...X|X...X|X..XX|.XX.X', v: '.....|.....|X...X|X...X|X...X|.X.X.|..X..', w: '.....|.....|X...X|X...X|X.X.X|X.X.X|.X.X.', x: '.....|.....|X...X|.X.X.|..X..|.X.X.|X...X',
    y: '.....|.....|X...X|X...X|X...X|X...X|.XXXX|....X|.XXX.', z: '.....|.....|XXXXX|...X.|..X..|.X...|XXXXX',
    0: '.XXX.|X...X|X..XX|X.X.X|XX..X|X...X|.XXX.', 1: '..X..|.XX..|..X..|..X..|..X..|..X..|.XXX.', 2: '.XXX.|X...X|....X|...X.|..X..|.X...|XXXXX', 3: 'XXXX.|....X|....X|.XXX.|....X|....X|XXXX.',
    4: '...X.|..XX.|.X.X.|X..X.|XXXXX|...X.|...X.', 5: 'XXXXX|X....|XXXX.|....X|....X|X...X|.XXX.', 6: '.XXX.|X....|X....|XXXX.|X...X|X...X|.XXX.', 7: 'XXXXX|....X|...X.|..X..|.X...|.X...|.X...',
    8: '.XXX.|X...X|X...X|.XXX.|X...X|X...X|.XXX.', 9: '.XXX.|X...X|X...X|.XXXX|....X|....X|.XXX.',
    '!': '..X..|..X..|..X..|..X..|..X..|.....|..X..', '¡': '..X..|.....|..X..|..X..|..X..|..X..|..X..', '?': '.XXX.|X...X|....X|...X.|..X..|.....|..X..', '¿': '..X..|.....|..X..|.X...|X....|X...X|.XXX.',
    '.': '.....|.....|.....|.....|.....|.....|..X..', ',': '.....|.....|.....|.....|.....|.....|..X..|.X...', ':': '.....|..X..|.....|.....|.....|..X..|.....', ';': '.....|..X..|.....|.....|.....|..X..|.X...',
    '-': '.....|.....|.....|.XXX.|.....|.....|.....', "'": '..X..|..X..|.....|.....|.....|.....|.....', '"': '.X.X.|.X.X.|.....|.....|.....|.....|.....', '(': '...X.|..X..|.X...|.X...|.X...|..X..|...X.',
    ')': '.X...|..X..|...X.|...X.|...X.|..X..|.X...', '/': '....X|...X.|...X.|..X..|.X...|.X...|X....', '*': '.....|X.X.X|.XXX.|XXXXX|.XXX.|X.X.X|.....', '·': '.....|.....|.....|..X..|.....|.....|.....',
    '%': 'XX..X|XX.X.|...X.|..X..|.X...|.X.XX|X..XX', '+': '.....|..X..|..X..|XXXXX|..X..|..X..|.....', '♥': '.....|.X.X.|XXXXX|XXXXX|.XXX.|..X..|.....', '▶': 'X....|XX...|XXX..|XXXX.|XXX..|XX...|X....', '~': '.....|.....|.XX.X|X.XX.|.....|.....|.....', ' ': '.....',
  };
  const AC = { '´': ['...X.', '..X..'], '~': ['.XX.X', 'X.XX.'], '¨': ['.X.X.', '.....'] };
  const comp = { 'á': ['a', '´'], 'é': ['e', '´'], 'í': ['i', '´'], 'ó': ['o', '´'], 'ú': ['u', '´'], 'ñ': ['n', '~'], 'ü': ['u', '¨'], 'Á': ['A', '´'], 'É': ['E', '´'], 'Í': ['I', '´'], 'Ó': ['O', '´'], 'Ú': ['U', '´'], 'Ñ': ['N', '~'] };
  const out = {};
  const rows = s => { const r = s.split('|'); while (r.length < 9) r.push('.....'); return ['.....', '.....'].concat(r); };   // 11 filas: 2 para tildes
  for (const k in G) out[k] = rows(G[k]);
  for (const k in comp) { const [b, a] = comp[k], r = out[b].slice(), lower = b === b.toLowerCase(); const at = lower ? 2 : 0; r[at] = AC[a][0]; r[at + 1] = AC[a][1]; out[k] = r; }
  /* atlas blanco: 6 px de avance, 11 de alto */
  const keys = Object.keys(out), c = mk(keys.length * 6, 11), g = c.getContext('2d'), idx = {}; g.fillStyle = '#fff';
  keys.forEach((k, n) => { idx[k] = n; out[k].forEach((row, y) => { for (let x = 0; x < 5; x++) if (row[x] === 'X') g.fillRect(n * 6 + x, y, 1, 1); }); });
  return { c, idx };
})();
/* dibuja texto en px de dispositivo; p = tamaño de píxel; col = color css; o.shake = temblor por letra (prisa) */
function pxText(g, s, x, y, p, col, o = {}) {
  const F = FONT5; let tc = F.tint && F.tint[col]; if (!tc) { tc = mk(F.c.width, F.c.height); const tg = tc.getContext('2d'); tg.drawImage(F.c, 0, 0); tg.globalCompositeOperation = 'source-in'; tg.fillStyle = col; tg.fillRect(0, 0, tc.width, tc.height); F.tint = F.tint || {}; F.tint[col] = tc; }
  g.save(); g.imageSmoothingEnabled = false;
  for (let i = 0; i < s.length; i++) { const n = F.idx[s[i]] ?? F.idx[s[i].toLowerCase()] ?? F.idx['?']; if (s[i] === ' ') continue;
    let dx = 0, dy = 0; if (o.shake) { dx = Math.round((hsh(i, o.shake) - .5) * 1.4) * p; dy = Math.round((hsh(i + 9, o.shake) - .5) * 1.4) * p; }
    g.drawImage(tc, n * 6, 0, 5, 11, Math.round(x + i * 6 * p + dx), Math.round(y + dy), 5 * p, 11 * p); }
  g.restore();
}
/* ---------- ánimos ---------- */
const MOODS = {
  prisa: { cps: 30, every: 2, pitch: 1.28, wave: 'square', vol: .05, shake: true, dur: .045 },
  normal: { cps: 22, every: 2, pitch: 1, wave: 'square', vol: .045, dur: .05 },
  tecnico: { cps: 17, every: 2, pitch: .9, wave: 'pulse', vol: .04, dur: .05 },
  sueno: { cps: 11, every: 1, pitch: .66, wave: 'triangle', vol: .055, dur: .11, glide: .82, pause: 2 },
  agotado: { cps: 7, every: 1, pitch: .58, wave: 'triangle', vol: .055, dur: .13, glide: .78, pause: 2.6 },
};
/* prepara la lista de diálogos: tiempos de cada letra y los bleeps. D = [{t, who, txt, mood, hold, face}] */
function dlgPrep(D) {
  const BL = [];
  for (const d of D) {
    const M = MOODS[d.mood || 'normal'], V = ELENCO[d.who] ? ELENCO[d.who].voz : { base: 440, onda: 'square' }, rev = [];
    let tt = 0, k = 0; const s = d.txt;
    for (let i = 0; i < s.length; i++) {
      const ch = s[i]; rev.push(tt);
      if (ch !== ' ' && !'.,!?¡¿…'.includes(ch)) { if (k % M.every === 0) { const code = ch.toLowerCase().charCodeAt(0), f = V.base * M.pitch * (1 + ((code % 7) - 3) * .028); BL.push({ t: d.t + tt, f, wave: M.wave === 'square' ? (V.onda === 'triangle' ? 'triangle' : 'square') : M.wave, vol: M.vol, dur: M.dur, glide: M.glide }); } k++; }
      tt += 1 / M.cps;
      if (ch === ',') tt += .14 * (M.pause || 1); if ('.!?'.includes(ch) && s[i + 1] === ' ') tt += .3 * (M.pause || 1); if (ch === '…') tt += .45 * (M.pause || 1);
    }
    d.rev = rev; d.tw = tt; d.end = d.t + tt + (d.hold ?? 1.6);
  }
  return BL;
}
/* parte el texto en líneas que caben (en caracteres) */
function dlgWrap(s, n) { const w = s.split(' '), L = []; let cur = ''; for (const x of w) { if ((cur + ' ' + x).trim().length > n) { L.push(cur.trim()); cur = x; } else cur += ' ' + x; } if (cur.trim()) L.push(cur.trim()); return L; }
/* la caja (abajo, borde blanco grueso, fondo negro, retrato pixel a la izquierda, «* » al inicio) */
function dlgDraw(D, t, o = {}) {
  const d = D.find(q => t >= q.t - .12 && t < q.end + .15); if (!d) return;
  const p = Math.max(2, Math.round(H / 240)), bw = Math.min(W - 2 * Math.round(W * .05), 164 * p * 1.25), bh = 50 * p, bx = Math.round((W - bw) / 2), low = o.anchor ? o.anchor(d) > H * .5 : false, by = low ? Math.round(H * .045) : Math.round(H - bh - H * .045);
  const inA = clamp((t - (d.t - .12)) / .12), outA = clamp((d.end + .15 - t) / .15), a = Math.min(inA, outA);
  const g = ctx; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a;
  const grow = sm(inA), hh = Math.round(bh * (.3 + .7 * grow));
  const yy = by + Math.round((bh - hh) / 2);
  g.fillStyle = '#000'; g.fillRect(bx, yy, bw, hh); g.fillStyle = '#fff'; const bd = p * 2;
  g.fillRect(bx, yy, bw, bd); g.fillRect(bx, yy + hh - bd, bw, bd); g.fillRect(bx, yy, bd, hh); g.fillRect(bx + bw - bd, yy, bd, hh);
  if (grow < .98) { g.restore(); return; }
  let tx = bx + 9 * p;
  if (d.face !== false && ELENCO[d.who]) { const f = elencoFace(d.who, d.face || {}), fs = Math.max(1, Math.round(p * 1.7)), fw = f.width * fs, fh = f.height * fs; g.imageSmoothingEnabled = false; g.drawImage(f, bx + 7 * p, by + Math.round((bh - fh) / 2), fw, fh); tx = bx + 7 * p + fw + 7 * p; }
  const cpl = Math.floor((bx + bw - 8 * p - tx) / (6 * p)) - 2, lines = dlgWrap(d.txt, cpl);
  const shown = d.rev.filter(r => t - d.t >= r).length, M = MOODS[d.mood || 'normal'];
  /* caben tres líneas: si el texto es más largo, sube como en los RPG (se ven las tres últimas que se están escribiendo) */
  const parts = []; let left = shown; for (const L of lines) { if (left <= 0) break; parts.push(L.slice(0, left)); left -= L.length + 1; }
  const first = Math.max(0, parts.length - 3);
  pxText(g, '*', tx, by + 9 * p, p, first ? '#888' : '#fff');
  parts.slice(first).forEach((s, i) => pxText(g, s, tx + 12 * p, by + 9 * p + i * 13 * p, p, o.col || '#fff', { shake: M.shake && shown < d.txt.length + 8 ? Math.floor(t * 14) : 0 }));
  g.restore(); T0();
}
/* rótulo de hora (arriba a la izquierda): «07:15 AM» grande y el lugar debajo; aparece letra a letra */
function labelDraw(L, t) {
  if (t < L.t0 || t > L.t1) return;
  const p = Math.max(2, Math.round(H / 260)), big = L.big, small = L.small || '', cps = 16, tb = t - L.t0, out = clamp((L.t1 - t) / .35);
  const nb = Math.min(big.length, Math.floor(tb * cps)), ns = Math.min(small.length, Math.floor(Math.max(0, tb - big.length / cps - .15) * cps * 1.4));
  const w = Math.max(big.length * 12 * p, small.length * 6 * p) + 14 * p, h = 22 * p + (small ? 14 * p : 0) + 10 * p, x = Math.round(W * .04), y = Math.round(H * .055);
  const g = ctx; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = out * clamp(tb / .15);
  g.fillStyle = 'rgba(0,0,0,.9)'; g.fillRect(x, y, w, h); g.fillStyle = '#fff'; const bd = p * 2; g.fillRect(x, y, w, bd); g.fillRect(x, y + h - bd, w, bd); g.fillRect(x, y, bd, h); g.fillRect(x + w - bd, y, bd, h);
  pxText(g, big.slice(0, nb), x + 7 * p, y + 4 * p, p * 2, L.col || '#ff5a4a');
  if (small) pxText(g, small.slice(0, ns), x + 7 * p, y + 26 * p, p, '#fff');
  g.restore(); T0();
}
function labelBleeps(L) { const o = []; for (let i = 0; i < L.big.length; i++) if (L.big[i] !== ' ') o.push({ t: L.t0 + i / 16, f: 880 + (i % 3) * 110, wave: 'square', vol: .03, dur: .035 }); for (let i = 0; i < (L.small || '').length; i += 2) o.push({ t: L.t0 + L.big.length / 16 + .15 + i / 22.4, f: 660, wave: 'square', vol: .022, dur: .03 }); return o; }
