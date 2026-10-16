/* =====================================================================
   EPISODIO III — escenarios y utilidades nuevas: sala común bajo el lago,
   ruina del páramo, carta de Damien, fases de luna, cuervo, vena verde
   de la maldición dentro del hilo, porche en primavera.
   ===================================================================== */

/* ---------- sala común de Slytherin, bajo el lago ---------- */
const CR_WINS = [[-470, 300], [-20, 300]]; // centro x, ancho
function genCommonRoom(s0) {
  seed(s0);
  const sp = Spr(-1150, -560, 1150, 560, .6), g = sp.g, ink2 = '14,22,18';
  wash(g, rectP(-1190, -600, 1190, 600, 1), '30,44,40', { layers: 13, alpha: .13, amt: .06 });
  g.strokeStyle = 'rgba(14,22,18,.2)'; g.lineWidth = 1.5;
  for (let y = -520, r = 0; y < 330; y += 64, r++) { g.beginPath(); g.moveTo(-1190, y); g.lineTo(1190, y); g.stroke(); for (let x = -1190 + (r % 2) * 60; x < 1190; x += 120) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 64); g.stroke(); } }
  const wins = CR_WINS.map(([x, w]) => arch(x, 160, w, 600, 18));
  g.save(); g.globalCompositeOperation = 'destination-out'; for (const w of wins) { polyPath(g, w); g.fill(); } g.restore();
  for (const [i, w] of wins.entries()) {
    const cx = CR_WINS[i][0];
    g.strokeStyle = 'rgba(14,22,18,.92)'; g.lineWidth = 14; polyPath(g, w); g.stroke();
    g.lineWidth = 6; g.beginPath(); g.moveTo(cx, 160); g.lineTo(cx, -420); for (let y = 60; y > -380; y -= 110) { g.moveTo(cx - 150, y); g.lineTo(cx + 150, y); } g.stroke();
  }
  // sofá Chesterfield
  solid(g, [[250, 330], [250, 240], [270, 226], [300, 240], [300, 200], [560, 200], [560, 240], [590, 226], [610, 240], [610, 330]], ink2, .3, 9);
  solid(g, rectP(290, 268, 570, 286), '10,16,14', .3, 5);
  // chimenea baja con escudo vacío (marco)
  solid(g, rectP(720, -40, 1060, 330), '24,34,30', .22, 8);
  solid(g, arch(890, 330, 220, 220, 12), '8,12,10', .4, 10);
  wash(g, rectP(-1190, 330, 1190, 600, .5), '20,30,26', { layers: 10, alpha: .16, amt: .1 });
  g.strokeStyle = 'rgba(14,22,18,.25)'; g.lineWidth = 1.5; for (let y = 366; y < 560; y += 44) { g.beginPath(); g.moveTo(-1190, y); g.lineTo(1190, y); g.stroke(); }
  granulate(sp, .22);
  return { sp, lamps: [{ x: -245, y: -190 }, { x: 205, y: -210 }, { x: 640, y: -170 }] };
}
/* agua del lago detrás de las ventanas: degradado + cáusticas + algas */
function waterBack(T, a = 1, moon = .6) {
  L(1); mode('source-over');
  for (const [cx, w] of CR_WINS) {
    const x0 = cx - w / 2 - 20, x1 = cx + w / 2 + 20, gr = ctx.createLinearGradient(0, -460, 0, 170);
    gr.addColorStop(0, `rgba(${Math.round(70 + 60 * moon)},${Math.round(120 + 60 * moon)},${Math.round(110 + 50 * moon)},${a * SA})`); gr.addColorStop(1, `rgba(16,40,36,${a * SA})`);
    ctx.fillStyle = gr; ctx.fillRect(x0, -470, x1 - x0, 650);
    ctx.strokeStyle = `rgba(200,240,224,${.16 * a * SA * (.6 + .4 * moon)})`; ctx.lineWidth = 2;
    for (let k = 0; k < 9; k++) { ctx.beginPath(); const y0 = -440 + k * 34; for (let x = x0; x <= x1; x += 12) { const y = y0 + Math.sin(x * .03 + T * 1.3 + k) * 8 + Math.sin(x * .011 - T * .7 + k * 2) * 6; x === x0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); }
  }
  mode('multiply'); ctx.strokeStyle = `rgba(14,30,24,${.5 * a * SA})`; ctx.lineCap = 'round';
  for (const [cx, w] of CR_WINS) for (let k = 0; k < 4; k++) { const bx = cx - w / 2 + 40 + k * (w - 80) / 3 + (k % 2) * 17; ctx.lineWidth = 2.6 - (k % 2); ctx.beginPath(); ctx.moveTo(bx, 170); for (let j = 1; j <= 5 + k % 3; j++) { const y = 170 - j * (26 + (k % 3) * 8); ctx.lineTo(bx + Math.sin(T * 1.2 + j * .6 + k) * j * 2.2, y); } ctx.stroke(); }
}
function greenLamp(x, y, T, a = 1) { hangLamp(x, y, T, a, '120,230,160'); }

/* ---------- ruina en el páramo (refugio de Damien) ---------- */
function genRuin(s0) {
  seed(s0);
  const sp = Spr(-800, -560, 800, 600, .6), g = sp.g, ink = '34,32,40', ink2 = '20,20,26';
  const jag = (x0, x1, top, base) => { const pts = [[x0, base]]; for (let x = x0; x <= x1; x += 18) pts.push([x, top + rnd(-40, 40) + Math.abs(N2(x * .02, s0)) * 60]); pts.push([x1, base]); return pts; };
  solid(g, jag(-560, -300, -360, 330), ink, .36, 14);
  solid(g, jag(-300, 260, -120, 330), ink, .26, 12);
  solid(g, jag(260, 470, -260, 330), ink, .36, 14);
  g.save(); g.globalCompositeOperation = 'destination-out'; polyPath(g, arch(-20, 120, 150, 260, 12)); g.fill(); polyPath(g, arch(-430, -60, 70, 150, 10)); g.fill(); g.restore();
  for (let i = 0; i < 24; i++) { const x = rnd(-700, 700), w = rnd(16, 46); solid(g, [[x, 336], [x + rnd(-6, 6), 336 - w * .6], [x + w, 336 - w * .4], [x + w * 1.1, 336]], ink2, .28, 3); }
  wash(g, rectP(-840, 330, 840, 640, .5), '24,22,28', { layers: 10, alpha: .18, amt: .1 });
  granulate(sp, .22);
  return sp;
}
function campfire(x, y, T, a = 1, s = .7) {
  for (let i = 0; i < 3; i++) { const sc = s * (1 - Math.abs(i - 1) * .25) * (.9 + .2 * N2(T * 3, i)), sy = 1 + .3 * N2(T * 5, i * 4); mode('source-over'); ctx.globalAlpha = SA * .85 * a; ctx.drawImage(B.flames[i % 3], x - 30 + i * 30 - 32 * sc, y - 128 * sc * sy, 64 * sc, 128 * sc * sy); }
  ctx.globalAlpha = 1; mode('multiply'); const fl = .85 + .15 * N2(T * 4, 2); glowAt(x, y - 40, 420 * fl, '255,150,70', .45 * a); glowAt(x, y - 30, 70, '255,220,150', .6 * a);
}

/* ---------- la carta de Damien ---------- */
function genBlackLetter(s0) {
  seed(s0);
  const sp = Spr(-330, -250, 330, 250, 1), g = sp.g;
  wash(g, rectP(-300, -220, 300, 220, .15), '230,222,206', { layers: 12, alpha: .22, amt: .02 });
  g.strokeStyle = 'rgba(16,14,20,.9)'; g.lineWidth = 10; g.strokeRect(-286, -206, 572, 412); g.lineWidth = 2; g.strokeRect(-268, -188, 536, 376);
  const L = [['En la última luna,', 40, -220, -120], ['en el porche.', 40, -190, -60], ['Los tres.', 44, -160, 10], ['O ella pagará', 40, -220, 80], ['por todos nosotros.', 40, -190, 140], ['— D.', 40, 120, 170]];
  for (const [s, z, x, y] of L) { const t = genScript(s, z, 640 + x, '26,30,70'); g.drawImage(t.c, x, y - t.c.height * .5, t.c.width, t.c.height); }
  wash(g, circlePts(200, -150, 24, 16, .4), '50,80,170', { layers: 12, alpha: .16, amt: .12 });
  granulate(sp, .12);
  return sp;
}

/* ---------- luna en fase (prólogo, sobre papel) ---------- */
function moonPhase(x, y, s, ph, a) {
  if (a * SA <= .01) return; const r = 128 * s;
  glowAt(x, y, r * 2.2, '236,232,214', .25 * a * (ph === 1 ? 1 : .5));
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.clip();
  if (ph < 1) { ctx.beginPath(); ctx.rect(x - r * 3, y - r * 3, r * 6, r * 6); ctx.arc(x + r * 2 * ph, y, r * 1.04, 0, TAU); ctx.clip('evenodd'); }
  mode('source-over'); dS(B.moonBig, x, y, s, 0, .95 * a); ctx.restore(); mode('multiply');
}
/* ---------- cuervo posado ---------- */
function raven(x, y, s, T, a = 1) {
  L(1); ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = `rgba(14,12,16,${.95 * a * SA})`;
  ctx.beginPath(); ctx.ellipse(0, -14, 16, 10, -.3, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(14, -24, 6.5, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(19, -25); ctx.lineTo(29 + Math.sin(T * 6) * 1, -22); ctx.lineTo(19, -21); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-12, -12); ctx.lineTo(-34, -4); ctx.lineTo(-30, -14); ctx.fill();
  ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(-2, -5); ctx.lineTo(-4, 4); ctx.moveTo(4, -5); ctx.lineTo(5, 4); ctx.stroke();
  ctx.restore();
}

/* ---------- la maldición: vena verde que recorre el hilo ---------- */
function vein(p, q, T, a, o = {}) {
  if (a * SA <= .01) return;
  const sp = o.speed ?? .45, len = o.len ?? .22, n = o.n ?? 2, prev = ctx.globalCompositeOperation; mode('source-over'); ctx.lineCap = 'round';
  for (let k = 0; k < n; k++) {
    const head = ((T * sp + k / n + (o.ph || 0)) % 1) * (1 + len), f0 = Math.max(0, head - len), f1 = Math.min(1, head); if (f1 <= f0) continue;
    const pts = []; for (let i = 0; i <= 16; i++) pts.push(hiloPt(p, q, T, lerp(f0, f1, i / 16), o));
    for (const [lw, al, bl] of [[7, .25, 18], [2.6, .95, 8]]) { ctx.strokeStyle = `rgba(${al > .5 ? '170,255,190' : '60,214,96'},${al * a * SA})`; ctx.lineWidth = lw; ctx.shadowColor = 'rgba(60,240,110,.95)'; ctx.shadowBlur = LOWQ ? 0 : bl * U * CAM.z; ctx.beginPath(); pts.forEach((pt, i) => i ? ctx.lineTo(pt[0], pt[1]) : ctx.moveTo(pt[0], pt[1])); ctx.stroke(); }
  }
  ctx.shadowBlur = 0; mode(prev);
}
/* dolor en el pecho: brillo verde en el torso */
function chestPain(F, x, y, s, fl, T, k) { if (k <= .01) return; const c = figPt(F.T, x, y, s, fl), beat = Math.pow(Math.max(0, Math.sin(T * 3.4)), 4); L(1); glowAt(c[0], c[1] + 10, 46 + 30 * beat, '80,230,120', Math.min(.55, (.16 + .26 * beat) * k)); }

/* ---------- porche (Ep. III): cielo, luna y casa configurables ---------- */
function porch3(T, o) {
  const sky = o.sky || 'night';
  if (sky === 'night') { L(.05); dS(B.night); starsDraw(B.stars, T, .9); }
  else { L(.05); dS(B.dusk); L(.05); glowAt(SW * .5, 160, 1000, '255,186,140', .35); }
  if (o.mA > 0) { const mX = (o.mX ?? 560) - (CAM.x + 190) * .95; L(.06); mode('source-over'); dS(B.moonBig, mX, o.mY ?? -320, .82, 0, .95 * o.mA); mode('multiply'); if (o.mGreen > 0) { L(.06); glowAt(mX, o.mY ?? -320, 260, '90,240,130', .5 * o.mGreen); } moonGlow(mX, o.mY ?? -320, T, o.mA); }
  mtnDraw(0, .15, .5); mistDraw(T, 1, 230, .35, .3, 4);
  L(1); dS(B.tree[0], -1000, 330, 1.1); dS(B.tree[1], 860, 330, 1);
  if (o.spring) { L(1); dS(B.gGrass); dS(B.house.sp, HX, HY, HS); houseWinsDark(B.house, T, HX, HY, HS, o.lit || 0); grassDraw(B.G, T, 1, '30,36,26', .7, 1.3, .5); }
  else { L(1); dS(B.snowG); dS(B.hs.sp, HX, HY, HS); houseWinsDark(B.hs, T, HX, HY, HS, 0); }
}
/* luciérnagas (primavera) */
function fireflies(T, a) { if (a <= 0) return; mode('source-over'); L(1); for (const f of B.ff) { const k = Math.max(0, Math.sin(T * 1.6 + f.ph)) * SA * a; if (k < .05) continue; const x = f.x + Math.sin(T * f.sp + f.ph) * 40, y = f.y + Math.cos(T * f.sp * 1.3 + f.ph) * 25; const gr = ctx.createRadialGradient(x, y, 0, x, y, 9); gr.addColorStop(0, `rgba(240,240,150,${k})`); gr.addColorStop(1, 'rgba(240,240,150,0)'); ctx.fillStyle = gr; ctx.fillRect(x - 9, y - 9, 18, 18); } mode('multiply'); }
