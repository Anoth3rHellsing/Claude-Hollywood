/* =====================================================================
   PASADAS DE ESTILO. El rig entrega polígonos con etiqueta (piel, pelo, tela…);
   cada estilo decide cómo pintarlos con las mismas primitivas:
   fill · shade (núcleo de sombra) · rim (luz de borde) · stroke · blob · trim · bg
   ===================================================================== */
const SC = { sil: false, boil: false, t: 0, anchor: [0, 0], house: 'G', who: 'joy' };
let PAPERPAT = null;
function paperPat() { // el papel del fondo como patrón alineado a la pantalla: «recortar» con papel exacto
  if (!PAPERPAT || PAPERPAT._w !== W) { PAPERPAT = ctx.createPattern(PAPER, 'no-repeat'); PAPERPAT._w = W; }
  PAPERPAT.setTransform(new DOMMatrix([1 / U, 0, 0, 1 / U, -W / 2 / U, -H / 2 / U])); return PAPERPAT;
}
let FXB = [0, 0, 1, 1];                            // caja en píxeles de la pasada actual (solo se limpia y compone eso)
function bboxPx(polys, pad = 0) {
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const q of polys) for (const p of q) { if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]; if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; }
  const a = Math.max(0, Math.floor((x0 - pad) * U + W / 2)), b = Math.max(0, Math.floor((y0 - pad) * U + H / 2));
  return [a, b, Math.min(W, Math.ceil((x1 + pad) * U + W / 2)) - a, Math.min(H, Math.ceil((y1 + pad) * U + H / 2)) - b];
}
function fxBegin(polys) { FXB = polys ? bboxPx(polys, 12) : [0, 0, W, H]; fx.setTransform(1, 0, 0, 1, 0, 0); fx.globalCompositeOperation = 'source-over'; fx.globalAlpha = 1; fx.clearRect(FXB[0], FXB[1], FXB[2], FXB[3]); T0(fx); }
function fxEnd(mode, a) { const [x, y, w, h] = FXB; if (w <= 0 || h <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = mode; ctx.globalAlpha = clamp(a); ctx.drawImage(FX, x, y, w, h, x, y, w, h); ctx.restore(); }
/* forma menos forma desplazada: núcleo de sombra (hacia la luz) o luz de borde (alejándose de la luz) */
/* relleno solo-sombra: dibuja la forma muy lejos y trae su sombra desenfocada de vuelta (borde suave sin filtros) */
const FAR = 20000;
function softFill(g, P, dx, dy, blurPx, col = '#000') {
  if (blurPx < .6) { g.save(); g.translate(dx, dy); if (col !== '#000') g.fillStyle = col; g.fill(P); g.restore(); return; }
  g.save(); g.translate(dx + FAR, dy); g.fillStyle = '#000'; g.shadowColor = col; g.shadowBlur = blurPx; g.shadowOffsetX = -FAR * g.getTransform().a; g.shadowOffsetY = -FAR * g.getTransform().b; g.fill(P); g.restore();
}
function fxSoft(P, shift, blurU) { fx.fillStyle = '#000'; fx.fill(P); fx.globalCompositeOperation = 'destination-out'; softFill(fx, P, shift[0], shift[1], blurU * U); fx.globalCompositeOperation = 'source-over'; }
function fxCrescent(P, shift, passes) {
  fx.fillStyle = '#000'; fx.fill(P); fx.globalCompositeOperation = 'destination-out';
  for (const [k, a] of passes) { fx.save(); fx.translate(shift[0] * k, shift[1] * k); fx.globalAlpha = a; fx.fill(P); fx.restore(); }
  fx.globalCompositeOperation = 'source-over'; fx.globalAlpha = 1;
}
function fxFinish(clipP, style) { fx.globalCompositeOperation = 'destination-in'; fx.fill(clipP); fx.globalCompositeOperation = 'source-in'; fx.fillStyle = style; fx.setTransform(1, 0, 0, 1, 0, 0); if (typeof style !== 'string') { T0(fx); fx.fillRect(-SW, -1000, SW * 2, 2000); } else fx.fillRect(FXB[0], FXB[1], FXB[2], FXB[3]); T0(fx); }
function varPoly(pts, wf) {
  const L = [], Rr = [], n = pts.length;
  for (let i = 0; i < n; i++) { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], d = nrm2(sub(b, a)), w = wf(i / (n - 1)) / 2; L.push([pts[i][0] - d[1] * w, pts[i][1] + d[0] * w]); Rr.push([pts[i][0] + d[1] * w, pts[i][1] - d[0] * w]); }
  return L.concat(Rr.reverse());
}
const circ = (c, r, n = 14) => { const o = []; for (let i = 0; i < n; i++) { const a = i / n * TAU; o.push([c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r]); } return o; };
const boilK = () => SC.boil ? Math.floor(SC.t * 8) % 3 : 0;

/* ---------------- TINTA Y ACUARELA ---------------- */
const TINTA = {
  name: 'Tinta y acuarela',
  pal: { skin: '232,212,182', hair: '30,24,28', cloth: '42,40,60', ink: '22,18,22', stone: '58,54,62', wood: '86,60,40', eyeW: '246,240,228', iris: '24,20,24', line: '36,26,30', mouthIn: '96,40,46' },
  col(k) { return SC.sil ? '16,14,18' : specialCol(k) || this.pal[k] || this.pal.ink; },
  P(polys) { return pathOf(polys, true); },
  fill(polys, k, o = {}) {
    if (!polys.length) return;
    const P = this.P(polys);
    if (o.sep) { ctx.lineWidth = o.sepW || 2.4; ctx.lineJoin = 'round'; ctx.strokeStyle = paperPat(); ctx.stroke(P); }
    if (!SC.sil && (k === 'skin' || k === 'cloth') && !o.sep) { ctx.strokeStyle = k === 'skin' ? 'rgba(150,96,92,.4)' : 'rgba(10,8,16,.45)'; ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.stroke(P); }
    ctx.fillStyle = `rgb(${this.col(k)})`; ctx.fill(P);
    if (SC.sil) return;
    if (!this.tex) { this.tex = ctx.createPattern(WASHTEX, 'repeat'); }
    this.tex.setTransform(new DOMMatrix().translate(SC.anchor[0], SC.anchor[1]).scale(.9));
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = k === 'skin' ? .7 : .45; ctx.fillStyle = this.tex; ctx.fill(P); ctx.restore();
  },
  shade(pu, pc, shift, extras, amt) {
    if (SC.sil || amt <= .01) return;
    fxBegin(pc); const P = this.P(pu);
    fxSoft(P, shift, len(shift) * .32 + 2);
    if (extras) extras(fx, p => this.P(p));
    fxFinish(this.P(pc), 'rgb(128,92,118)'); fxEnd('multiply', amt);
  },
  rim(polys, d, w, amt, col = SC.rimCol || '255,214,150') {
    if (amt <= .01) return;
    fxBegin(polys); const P = this.P(polys);
    fxSoft(P, [-d[0] * w, -d[1] * w], w * .5);
    fxFinish(P, `rgb(${col})`); fxEnd(SC.sil ? 'source-over' : 'screen', amt);
  },
  stroke(pts, wf, k, a) { if (a <= .01) return; ctx.fillStyle = `rgba(${this.col(k)},${a * .92})`; ctx.fill(pathOf([varPoly(pts, wf)], true)); },
  blob(polys, k, a) { if (a <= .01) return; ctx.fillStyle = `rgba(${this.col(k)},${a})`; ctx.fill(this.P(polys)); },
  trim(lines, house, w) { if (SC.sil) return; const h = HOUSES[house]; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; for (const l of lines) { ctx.strokeStyle = `rgba(${h.g},.85)`; ctx.lineWidth = w; ctx.stroke(linePath(l)); ctx.strokeStyle = `rgba(${h.c},.9)`; ctx.lineWidth = w * .45; ctx.stroke(linePath(l)); } },
  bg(sc) {
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(PAPER, 0, 0); T0();
    const g = ctx.createLinearGradient(0, -500, 0, sc.hz ?? 500); g.addColorStop(0, 'rgba(58,66,92,.3)'); g.addColorStop(1, 'rgba(58,66,92,.02)');
    ctx.fillStyle = g; ctx.fillRect(-SW / 2, -500, SW, 1000);
    if (sc.moon) { const [x, y, r] = sc.moon, m = ctx.createRadialGradient(x, y, r * .2, x, y, r * 1.6); m.addColorStop(0, 'rgba(250,244,230,.95)'); m.addColorStop(.6, 'rgba(250,244,230,.8)'); m.addColorStop(.66, 'rgba(250,244,230,.25)'); m.addColorStop(1, 'rgba(250,244,230,0)'); ctx.fillStyle = m; ctx.fillRect(x - r * 1.6, y - r * 1.6, r * 3.2, r * 3.2); }
    if (sc.ground !== undefined) { const gy = sc.ground; ctx.fillStyle = 'rgba(40,34,40,.16)'; ctx.fillRect(-SW / 2, gy, SW, 500 - gy); ctx.strokeStyle = 'rgba(30,24,28,.45)'; ctx.lineWidth = 2.5; ctx.beginPath(); for (let x = -SW / 2; x <= SW / 2; x += 20) ctx.lineTo(x, gy + N2(x * .004, 3) * 6); ctx.stroke(); }
  },
};

/* ---------------- PAPEL RECORTADO ---------------- */
const PAPEL = {
  name: 'Papel recortado',
  pal: { skin: '238,208,172', hair: '54,38,44', cloth: '64,74,116', ink: '40,32,40', stone: '74,72,88', wood: '120,82,52', eyeW: '250,244,232', iris: '40,30,36', line: '58,36,40', mouthIn: '120,46,52' },
  clothBy: { G: '128,32,40', S: '34,96,66', R: '44,66,128' },
  col(k) { return k === 'cloth' ? this.clothBy[SC.house] : specialCol(k) || this.pal[k] || this.pal.ink; },
  jit() { const v = boilK() * 17.3, ax = SC.anchor[0], ay = SC.anchor[1]; return (x, y) => [N2((x - ax) * .11 + v, (y - ay) * .11) * 2.6, N2((x - ax) * .11 + 40 + v, (y - ay) * .11) * 2.6]; },
  P(polys) { return pathOf(polys, false, this.jit(), 6); },
  fill(polys, k, o = {}) {
    if (!polys.length) return;
    const P = this.P(polys);
    ctx.save(); ctx.translate(4, 6); ctx.fillStyle = 'rgba(24,16,12,.26)'; ctx.fill(P); ctx.restore();
    ctx.fillStyle = `rgb(${this.col(k)})`; ctx.fill(P);
    if (o.sep) { ctx.lineWidth = 1.2; ctx.strokeStyle = 'rgba(255,248,236,.55)'; ctx.stroke(P); }
    if (!this.gp) this.gp = ctx.createPattern(GRAIN, 'repeat');
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = .55; ctx.fillStyle = this.gp; ctx.fill(P); ctx.restore();
  },
  shade(pu, pc, shift, extras, amt) {
    if (amt <= .01) return;
    fxBegin(pc); const P = this.P(pu);
    fxCrescent(P, shift, [[1.05, 1]]);
    if (extras) extras(fx, p => this.P(p));
    fxFinish(this.P(pc), 'rgb(150,96,104)'); fxEnd('multiply', amt * .9);
  },
  rim(polys, d, w, amt) {
    if (amt <= .01) return;
    fxBegin(polys); const P = this.P(polys);
    fxCrescent(P, [-d[0] * w * 1.2, -d[1] * w * 1.2], [[1, 1]]);
    fxFinish(P, 'rgb(255,234,186)'); fxEnd('source-over', amt * .85);
  },
  stroke(pts, wf, k, a) { if (a <= .01) return; ctx.fillStyle = `rgba(${this.col(k)},${a})`; ctx.fill(pathOf([varPoly(pts, t => wf(t) * 1.15 + .8)], false)); },
  blob(polys, k, a) { if (a <= .01) return; ctx.fillStyle = `rgba(${this.col(k)},${a})`; ctx.fill(pathOf(polys, false)); },
  trim(lines, house, w) { const h = HOUSES[house]; ctx.lineCap = 'butt'; ctx.lineJoin = 'miter'; for (const l of lines) { ctx.strokeStyle = `rgb(${h.g})`; ctx.lineWidth = w * 1.1; ctx.stroke(linePath(l)); } },
  bg(sc) {
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#2e3854'; ctx.fillRect(0, 0, W, H); T0();
    if (!this.gp) this.gp = ctx.createPattern(GRAIN, 'repeat');
    const lay = (polys, c) => { const P = pathOf(polys, false, this.jit(), 8); ctx.save(); ctx.translate(5, 7); ctx.fillStyle = 'rgba(10,8,16,.3)'; ctx.fill(P); ctx.restore(); ctx.fillStyle = c; ctx.fill(P); ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = .5; ctx.fillStyle = this.gp; ctx.fill(P); ctx.restore(); };
    if (sc.moon) { const [x, y, r] = sc.moon; lay([circ([x, y], r * 1.25, 40)], 'rgb(66,78,112)'); lay([circ([x, y], r, 40)], 'rgb(240,226,184)'); }
    const hz = sc.hz ?? 330, hill = (y0, amp, f, ph) => { const o = [[-SW / 2 - 20, 520]]; for (let x = -SW / 2 - 20; x <= SW / 2 + 20; x += 40) o.push([x, y0 + Math.sin(x * f + ph) * amp + N2(x * .01, ph) * amp * .6]); o.push([SW / 2 + 20, 520]); return o; };
    lay([hill(hz - 40, 40, .004, 1)], 'rgb(56,68,98)'); lay([hill(hz + 30, 28, .006, 4)], 'rgb(38,46,70)');
    if (sc.ground !== undefined) lay([[[-SW / 2 - 20, sc.ground], [SW / 2 + 20, sc.ground], [SW / 2 + 20, 520], [-SW / 2 - 20, 520]]], 'rgb(30,36,54)');
  },
};

/* ---------------- BOCETO (grafito) ---------------- */
const BOCETO = {
  name: 'Boceto',
  pal: { line: '52,50,62', iris: '52,50,62', mouthIn: '70,60,70', eyeW: '246,242,232', wood: '70,66,74' },
  col(k) { return this.pal[k] || this.pal.line; },
  jit(seed) { const v = boilK() * 9.1 + seed, ax = SC.anchor[0], ay = SC.anchor[1]; return (x, y) => [N2((x - ax) * .028 + v, (y - ay) * .028) * 4, N2((x - ax) * .028 + 30 + v, (y - ay) * .028) * 4]; },
  P(polys) { return pathOf(polys, true); },
  fill(polys, k, o = {}) {
    if (!polys.length) return;
    const P = this.P(polys);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(52,50,62,.55)'; ctx.lineWidth = 3.4; ctx.stroke(pathOf(polys, true, this.jit(0), 7));
    ctx.strokeStyle = 'rgba(52,50,62,.4)'; ctx.lineWidth = 2.2; ctx.stroke(pathOf(polys, true, this.jit(5.5), 7));
    ctx.fillStyle = paperPat(); ctx.fill(P);
    if (!this.h1) { this.h1 = ctx.createPattern(HATCH, 'repeat'); this.h2 = ctx.createPattern(HATCH2, 'repeat'); }
    const pat = (k === 'hair' && !SC.hairCol) || k === 'ink' ? this.h2 : k === 'cloth' || k === 'stone' || k === 'hair' || k === 'tie' ? this.h1 : null;
    if (pat) { pat.setTransform(new DOMMatrix().translate(SC.anchor[0], SC.anchor[1]).scale(.55)); ctx.save(); ctx.globalAlpha = k === 'cloth' ? .55 : .85; ctx.fillStyle = pat; ctx.fill(P); ctx.restore(); }
    if (k === 'wood') { ctx.fillStyle = 'rgba(52,50,62,.6)'; ctx.fill(P); }
  },
  shade(pu, pc, shift, extras, amt) {
    if (amt <= .01) return;
    fxBegin(pc); const P = this.P(pu);
    fxSoft(P, shift, 3);
    if (extras) extras(fx, p => this.P(p));
    if (!this.h1) { this.h1 = ctx.createPattern(HATCH, 'repeat'); this.h2 = ctx.createPattern(HATCH2, 'repeat'); }
    this.h1.setTransform(new DOMMatrix().translate(SC.anchor[0], SC.anchor[1]).scale(.5));
    fxFinish(this.P(pc), this.h1); fxEnd('source-over', amt * 1.3);
  },
  rim() { },
  stroke(pts, wf, k, a) { if (a <= .01) return; ctx.lineCap = 'round'; ctx.strokeStyle = `rgba(${this.col(k)},${a * .75})`; ctx.lineWidth = Math.max(1.6, wf(.5) * .45); const j = this.jit(2); ctx.stroke(linePath(pts.map(p => { const d = j(p[0], p[1]); return [p[0] + d[0] * .3, p[1] + d[1] * .3]; }))); },
  blob(polys, k, a) { if (a <= .01) return; if (k === 'eyeW') { ctx.fillStyle = paperPat(); ctx.globalAlpha = a; ctx.fill(this.P(polys)); ctx.globalAlpha = 1; return; } ctx.fillStyle = `rgba(${this.col(k)},${a * .8})`; ctx.fill(this.P(polys)); },
  trim(lines, house, w) { ctx.strokeStyle = 'rgba(52,50,62,.5)'; ctx.lineWidth = 1.6; for (const l of lines) ctx.stroke(linePath(l)); },
  bg(sc) {
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(PAPER, 0, 0); ctx.fillStyle = 'rgba(250,247,238,.45)'; ctx.fillRect(0, 0, W, H); T0();
    ctx.lineCap = 'round';
    if (sc.moon) { const [x, y, r] = sc.moon; for (let k = 0; k < 2; k++) { ctx.strokeStyle = `rgba(52,50,62,${.4 - k * .12})`; ctx.lineWidth = 2.2 - k * .6; ctx.stroke(pathOf([circ([x, y], r, 36)], true, this.jit(k * 7), 8)); } }
    const hz = sc.ground ?? sc.hz ?? 330; ctx.strokeStyle = 'rgba(52,50,62,.35)'; ctx.lineWidth = 1.6;
    for (let i = 0; i < 9; i++) { const y = hz + i * 9 + (i ? 10 : 0), x0 = -SW / 2 + 40 + (i * 137 % 300), x1 = SW / 2 - 60 - (i * 89 % 260); ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y + N2(i, 2) * 6); ctx.stroke(); }
  },
};
const STYLES = { tinta: TINTA, papel: PAPEL, boceto: BOCETO };
function specialCol(k) {   // colores que dependen del personaje o de la casa
  if (k === 'hair' && SC.hairCol) return SC.hairCol;
  if (k === 'tie') return HOUSES[SC.house].c;
  if (k === 'houseG' || k === 'gold') return k === 'gold' ? '214,176,96' : HOUSES[SC.house].g;
  if (k === 'shirt') return '226,220,206';
  return null;
}

/* ---------------- render de cabeza / mano / figura con cualquier estilo ---------------- */
function lightAmts(L) { return { core: L.z > .95 ? 0 : .62, rim: SC.sil ? .55 + .4 * clamp(-L.z + .3) : .25 + .55 * clamp(-L.z + .2) }; }
function renderHead(R, S, st) {
  const L = st.L, s = R.s, la = lightAmts(L);
  SC.anchor = R.pivot; SC.house = R.house; SC.hairCol = CAST[R.who].hairCol || null;
  if (R.back.length && !st.noBack) S.fill(R.back, 'hair');
  if (st.bust) {
    S.fill([R.neck], 'skin');
    S.shade([R.neck], [R.neck], [L.d[0] * s * .55 * (1.25 - L.z), L.d[1] * s * .55 * (1.25 - L.z)], (g, mk) => {
      g.globalAlpha = .8; softFill(g, mk(R.headU), -L.d[0] * s * .18, -L.d[1] * s * .12 + s * .3, s * .08 * U); g.globalAlpha = 1;
    }, la.core);
    S.fill(R.shirt, 'shirt'); S.fill(R.collar, 'shirt'); S.fill(R.tie, 'tie');   // la túnica va encima y recorta todo a la V
    for (const l of R.tieStripes) S.stroke(l, () => s * .028, 'houseG', 1);
    S.fill(R.bust, 'cloth'); S.trim(R.trim, R.house, s * .07);
  }
  const hoop = h => S.stroke(h.pts, () => s * .026, 'gold', h.a);
  for (const h of R.hoops) if (!h.tucked) hoop(h);
  if (R.mid.length) S.fill(R.mid, 'hair');
  S.fill(R.headU, 'skin');
  const m = s * (1.15 - .95 * L.z), above = clamp(.3 - L.d[1] * .7);
  S.shade(R.headU, R.headU, [L.d[0] * m, L.d[1] * m], (g, mk) => {
    g.globalAlpha = .6 * (.6 + .4 * (1 - L.z)); softFill(g, mk([R.nose]), -L.d[0] * s * .13, -L.d[1] * s * .13 + s * .035, s * .03 * U);
    const sa = (st.feats ? .3 : .6) * (.3 + .7 * above) * (1 + Math.max(0, st.ex.bi) * .4);
    for (const so of R.F.sockets) { g.globalAlpha = sa * so.a; softFill(g, mk([so.pts]), 0, s * .01, s * .05 * U); }
    g.globalAlpha = 1;
  }, la.core * (st.coreK ?? 1));
  if (st.feats && !SC.sil) renderFeats(R.F, S, s);
  if (R.F.earLine && !SC.sil) S.stroke(R.F.earLine.pts, t => s * .016 * Math.sin(t * PI + .2), 'line', R.F.earLine.a * .5);
  S.fill(R.cap, 'hair'); if (R.front.length) S.fill(R.front, 'hair');
  for (const h of R.hoops) if (h.tucked) hoop(h);
  if (st.rim !== false) S.rim([...R.headU, ...R.cap, ...R.front, ...R.mid, ...R.back, ...(st.bust ? [R.neck, ...R.bust] : [])], L.d, s * .05 * (1.3 - L.z * .5), la.rim);
}
function renderFeats(F, S, s) {
  for (const e of F.eyes) {
    if (e.a < .02) continue;
    const alm = e.up.concat(e.lo.slice().reverse());
    if (e.op > .25) {
      S.blob([alm], 'eyeW', e.a * .85);
      if (e.iris) { ctx.save(); ctx.clip(pathOf([alm], true)); S.blob([circ(e.iris.c, e.iris.r)], 'iris', e.a); ctx.restore(); }
    }
    S.stroke(e.up, t => s * (.007 + .022 * Math.sin(t * PI) ** .6), 'line', e.a);
    if (e.op > .3) S.stroke(e.lo, t => s * .008 * Math.sin(t * PI), 'line', e.a * .45);
  }
  for (const b of F.brows) S.stroke(b.pts, t => s * lerp(.034, .012, t), 'line', b.a * .9);
  for (const m of F.mouth) {
    if (m.open > .05) S.blob([m.up.concat(m.lo.slice().reverse())], 'mouthIn', m.a * .9);
    S.stroke(m.up, t => s * lerp(.014, .004, t), 'line', m.a * .75);
  }
}
function renderHand(Hd, S, st) {
  const L = st.L, la = lightAmts(L);
  SC.anchor = [Hd.pieces[0].polys[0][0][0], Hd.pieces[0].polys[0][0][1]];
  for (const p of Hd.pieces) S.fill(p.polys, p.k, { sep: st.sep && p.sep, sepW: Hd.s * .014 });
  S.shade(Hd.all, Hd.all, [L.d[0] * Hd.s * .3 * (1.2 - L.z), L.d[1] * Hd.s * .3 * (1.2 - L.z)], null, la.core * .8);
  if (st.rim !== false) S.rim(Hd.all, L.d, Hd.s * .035, la.rim);
}
