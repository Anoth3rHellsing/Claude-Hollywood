/* =====================================================================
   EL CAFÉ · el pedido (un globito en píxeles con una taza: sin letras) y el plano cenital del latte art:
   la leche cae, se abre en un círculo y el chorro lo cruza hasta hacer un corazón, todo en capas de acuarela.
   ===================================================================== */
/* globito de diálogo en píxeles con un dibujo (cup | heart | note) */
const ICONS = {
  cup: ['..K.K.K...', '...K.K.K..', 'KKKKKKKK..', 'KWWWWWWKKK', 'KWbbbbWK.K', 'KWWWWWWKKK', '.KWWWWK...', '..KKKK....'],
  heart: ['.KK..KK.', 'KLLKKLLK', 'KLLLLLLK', '.KLLLLK.', '..KLLK..', '...KK...'],
  note: ['...KKK', '...KbK', '...K..', '...K..', '.KKK..', 'KKKK..', '.KK...'] };
function bubble(fx, fy, cell, icon, a = 1, pop = 1) {
  if (a < .01) return; const I = ICONS[icon], iw = I[0].length, ih = I.length, bw = iw + 6, bh = ih + 5;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a;
  const c = Math.max(1, Math.round(cell * pop)), x0 = Math.round(fx - bw * c / 2), y0 = Math.round(fy - (bh + 3) * c);
  ctx.fillStyle = 'rgb(30,24,28)'; ctx.fillRect(x0 + c, y0, (bw - 2) * c, bh * c); ctx.fillRect(x0, y0 + c, bw * c, (bh - 2) * c);
  ctx.fillStyle = 'rgb(252,250,244)'; ctx.fillRect(x0 + 2 * c, y0 + c, (bw - 4) * c, (bh - 2) * c); ctx.fillRect(x0 + c, y0 + 2 * c, (bw - 2) * c, (bh - 4) * c);
  ctx.fillStyle = 'rgb(30,24,28)'; ctx.fillRect(x0 + Math.round(bw / 2 - 1) * c, y0 + bh * c, 2 * c, c); ctx.fillRect(x0 + Math.round(bw / 2 - 1) * c, y0 + (bh + 1) * c, c, c);
  for (let y = 0; y < ih; y++) for (let x = 0; x < iw; x++) { const col = PAL[I[y][x]]; if (!col) continue; ctx.fillStyle = cssc(col); ctx.fillRect(x0 + (3 + x) * c, y0 + (2.5 + y) * c | 0, c, c); }
  ctx.restore(); T0();
}
/* corazón ↔ círculo (forma de la leche) */
function milkShape(cx, cy, R, e) {
  const P = []; for (let i = 0; i < 64; i++) { const a = i / 64 * TAU; let x = Math.cos(a), y = Math.sin(a);
    const hx = 16 * Math.pow(Math.sin(a), 3) / 16, hy = -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) / 16;
    P.push([cx + lerp(x, hx, e) * R, cy + lerp(y, hy + .1, e) * R]); }
  return P;
}
function deformFixed(P, seed, amt) { const r = mulberry32(seed); let Q = P.map(p => [p[0], p[1], 1]); for (let k = 0; k < 2; k++) Q = deformOnce(Q, r, amt); return Q; }
function deformOnce(P, r, amt) {
  const o = [];
  for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], l = Math.hypot(b[0] - a[0], b[1] - a[1]), v = (a[2] ?? 1);
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) - PI / 2 + gaussR(r) * .6, push = Math.abs(gaussR(r)) * l * amt * v; o.push(a, [m[0] + Math.cos(ang) * push, m[1] + Math.sin(ang) * push, clamp(v * (.75 + r() * .5), .3, 1.6)]); }
  return o;
}
let WOODTEX = null;
function woodTex() {   /* la mesa de madera vista desde arriba (pintada una vez) */
  const w = 1200, h = 700, c = mk(w, h), g = c.getContext('2d'), r = mulberry32(4);
  for (let k = 0; k < 9; k++) { const y = k * 80 - 20; wcWash(g, rectP(-20, y, w + 40, 78), mixc([150, 100, 64], [176, 124, 82], r()), .95, { reserve: false, mode: 'source-over', amt: 1.2, seed: k, step: 40 }); for (let j = 0; j < 14; j++) { const yy = y + 6 + r() * 66; g.strokeStyle = `rgba(90,56,34,${.15 + r() * .2})`; g.lineWidth = 1 + r() * 2; g.beginPath(); g.moveTo(0, yy); for (let x = 0; x <= w; x += 40) g.lineTo(x, yy + Math.sin(x * .01 + j) * 4); g.stroke(); } }
  wcTex(g, w, h, .4, .3); return c;
}
/* t de 98 a 110 */
function latteInsert(t) {
  if (!WOODTEX) WOODTEX = woodTex();
  const lt = t - 98, zoom = 1.06 - lt * .006, rot = -.04 + lt * .004;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(WOODTEX, 0, 0, WOODTEX.width, WOODTEX.height, 0, 0, W, H); ctx.restore();
  L0s(); ctx.save(); ctx.scale(zoom, zoom); ctx.rotate(rot);
  const cx = 30, cy = 10, R = 250;
  /* platito y sombra */
  ctx.fillStyle = 'rgba(70,40,24,.35)'; ctx.beginPath(); ctx.ellipse(cx + 24, cy + 30, R * 1.55, R * 1.5, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgb(240,236,226)'; ctx.beginPath(); ctx.arc(cx, cy, R * 1.5, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(160,150,140,.5)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, R * 1.3, 0, TAU); ctx.stroke();
  /* asa */
  ctx.fillStyle = 'rgb(246,244,236)'; ctx.beginPath(); ctx.ellipse(cx + R * 1.12, cy + 20, 70, 34, .2, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(150,140,130,.6)'; ctx.stroke();
  ctx.fillStyle = 'rgb(214,200,180)'; ctx.beginPath(); ctx.ellipse(cx + R * 1.16, cy + 22, 34, 14, .2, 0, TAU); ctx.fill();
  /* taza */
  ctx.fillStyle = 'rgb(250,248,242)'; ctx.beginPath(); ctx.arc(cx, cy, R * 1.12, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(150,140,130,.55)'; ctx.lineWidth = 2; ctx.stroke();
  /* café con crema */
  const cg = ctx.createRadialGradient(cx - 30, cy - 30, 10, cx, cy, R); cg.addColorStop(0, 'rgb(196,134,78)'); cg.addColorStop(.7, 'rgb(150,92,50)'); cg.addColorStop(1, 'rgb(96,56,30)');
  ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.clip();
  /* la leche: crece, se vuelve corazón, en 14 capas de acuarela */
  const grow = easeOut((t - 99.2) / 4), e = sm((t - 103.6) / 2.2), Rm = R * .2 + R * .52 * grow, wob = Math.sin(t * 1.4) * 4;
  if (t > 99.2) for (let k = 0; k < 14; k++) { const P = deformFixed(milkShape(cx + wob, cy - 10 + e * 20, Rm * (1 - k * .012), e), 300 + k, .05); ctx.fillStyle = `rgba(252,246,232,${.11})`; ctx.fill(pPolys([P])); }
  if (t > 99.2) { const P = milkShape(cx + wob, cy - 10 + e * 20, Rm, e); ctx.strokeStyle = 'rgba(200,150,100,.4)'; ctx.lineWidth = 3; ctx.stroke(pPolys([deformFixed(P, 77, .03)])); }
  /* anillos del vertido (se abren hacia afuera) */
  for (let k = 0; k < 4; k++) { const ph = ((t - 99.2) * .5 + k * .25) % 1; if (t < 99.2 || t > 104.5) break; ctx.strokeStyle = `rgba(250,240,220,${.25 * (1 - ph)})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx + wob, cy - 10, Rm * (.3 + ph * .7), 0, TAU); ctx.stroke(); }
  ctx.restore();
  /* el chorro de leche desde arriba (sale del cuadro) */
  const pourA = win(t, 98.6, 106.4, .5, .6); if (pourA > .01) {
    const tipY = e > 0 ? lerp(cy - 10, cy + Rm * .9, sm((t - 104.4) / 1.6)) : cy - 10, pts = [];
    for (let i = 0; i <= 20; i++) { const u = i / 20; pts.push([cx + wob + Math.sin(u * 3 + t * 2) * 6 * u, lerp(-560, tipY, u)]); }
    ctx.globalAlpha = pourA; ctx.fillStyle = 'rgba(252,248,238,.96)'; ctx.fill(pPolys([stripP(pts, u => lerp(34, 14, u))])); ctx.strokeStyle = 'rgba(200,180,150,.5)'; ctx.lineWidth = 2; ctx.stroke(pLine(pts.map(p => [p[0] - 14, p[1]]))); ctx.globalAlpha = 1;
  }
  /* vapor: hebras suaves que suben */
  for (let k = 0; k < 5; k++) { const ph = (t * .18 + k / 5) % 1, pts = []; for (let i = 0; i <= 14; i++) { const u = i / 14; pts.push([cx - 120 + k * 60 + Math.sin(u * 4 + t + k) * 30, cy - 40 - ph * 520 - u * 160]); } ctx.strokeStyle = `rgba(255,255,255,${.22 * Math.sin(ph * PI)})`; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.stroke(pLine(pts)); }
  ctx.restore(); T0();
  /* Brote se asoma por la esquina a mirar */
  const peek = easeOut((t - 105.6) / .8) * (1 - sm((t - 109.2) / .6)); if (peek > .01) { const cell = Math.round(H / 70); spBlit(broteCanvas({ happy: t > 106.8, leaf: Math.floor(t * 2) % 2 ? 1 : -1 }), W * .86, H + (1 - peek) * 14 * cell + 7 * cell, cell); }
}
