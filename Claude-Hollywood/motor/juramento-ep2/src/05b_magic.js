/* =====================================================================
   MAGIA: haces de hechizo, orbes, explosiones, chispas, grieta, susurros
   ===================================================================== */
const SPELL = { red: ['226,44,40', '255,190,150'], green: ['60,214,96', '200,255,200'], silver: ['200,214,230', '255,255,255'], orange: ['240,120,40', '255,214,140'], blue: ['90,140,240', '220,236,255'], gold: ['236,180,70', '255,236,180'] };
/* haz ondulante desde la varita hasta el objetivo */
function beam(x1, y1, x2, y2, prog, kind, a, T, wd = 5, sd = 1) {
  if (prog <= 0 || a <= 0) return; const [c, cc] = SPELL[kind], A = a * SA;
  const n = 40, hx = lerp(x1, x2, prog), hy = lerp(y1, y2, prog), dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
  const pts = []; for (let i = 0; i <= n; i++) { const f = i / n, w = Math.sin(f * PI) * (6 + 4 * Math.sin(T * 30 + i)) * (1 - f * .3); pts.push([lerp(x1, hx, f) + nx * Math.sin(f * 18 - T * 40 + sd) * w * .6, lerp(y1, hy, f) + ny * Math.sin(f * 18 - T * 40 + sd) * w * .6]); }
  const prev = ctx.globalCompositeOperation; mode('source-over'); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const z = U * CAM.z;
  for (const [lw, col, al, bl] of [[wd * 3.2, c, .28, 22], [wd * 1.4, c, .75, 12], [wd * .5, cc, .95, 6]]) {
    ctx.strokeStyle = `rgba(${col},${al * A})`; ctx.lineWidth = lw; ctx.shadowColor = `rgba(${c},.9)`; ctx.shadowBlur = bl * z;
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (const p of pts) ctx.lineTo(p[0], p[1]); ctx.stroke();
  }
  ctx.shadowBlur = 0; mode(prev);
  orb(hx, hy, wd * 3, kind, a * .9, T);
}
function orb(x, y, r, kind, a, T) {
  if (a * SA <= .01) return; const [c, cc] = SPELL[kind], A = a * SA, pul = 1 + .15 * Math.sin(T * 14);
  const prev = ctx.globalCompositeOperation; mode('source-over');
  const gr = ctx.createRadialGradient(x, y, 0, x, y, r * 4 * pul); gr.addColorStop(0, `rgba(${cc},${.95 * A})`); gr.addColorStop(.18, `rgba(${c},${.75 * A})`); gr.addColorStop(.5, `rgba(${c},${.22 * A})`); gr.addColorStop(1, `rgba(${c},0)`);
  ctx.fillStyle = gr; ctx.fillRect(x - r * 4 * pul, y - r * 4 * pul, r * 8 * pul, r * 8 * pul); mode(prev);
}
/* chispas luminosas */
let SPK = null;
function sparks(x, y, n, kind, sp = 220, up = 0) { for (let i = 0; i < n; i++) { const a = rnd(TAU), v = rnd(.2, 1) * sp; SPK.spawn(x, y, Math.cos(a) * v, Math.sin(a) * v - up, { col: SPELL[kind][0], life: rnd(.4, 1.3), s: rnd(.8, 2.2) }); } }
function sparksDraw(dt, T) {
  if (dt > 0) for (const q of SPK.p) { if (!q.on) continue; q.age += dt; if (q.age > q.life) { q.on = false; continue; } q.vx *= Math.pow(.15, dt); q.vy = q.vy * Math.pow(.15, dt) + 120 * dt; q.x += q.vx * dt; q.y += q.vy * dt; }
  L(1); mode('source-over');
  for (const q of SPK.p) { if (!q.on) continue; const k = (1 - q.age / q.life) * SA; ctx.fillStyle = `rgba(${q.col},${k})`; ctx.beginPath(); ctx.arc(q.x, q.y, q.s, 0, TAU); ctx.fill(); ctx.fillStyle = `rgba(255,250,230,${k * .8})`; ctx.beginPath(); ctx.arc(q.x, q.y, q.s * .45, 0, TAU); ctx.fill(); }
  mode('multiply');
}
/* grieta de tinta que atraviesa la pantalla (la amistad se rompe) */
function genCrack(s0) {
  seed(s0); const main = []; let x = -SW / 2 - 40, y = rnd(-80, 40);
  while (x < SW / 2 + 40) { main.push([x, y]); x += rnd(30, 70); y += rnd(-45, 45); y = clamp(y, -260, 260); }
  const br = []; for (let i = 2; i < main.length - 2; i += 2) if (R() < .7) { const p = main[i], b = [p.slice()]; let bx = p[0], by = p[1]; const dir = R() < .5 ? -1 : 1; for (let k = 0; k < 3; k++) { bx += rnd(10, 40); by += dir * rnd(15, 45); b.push([bx, by]); } br.push({ b, t: i / main.length }); }
  return { main, br };
}
function crackDraw(cr, prog, a) {
  if (prog <= 0 || a <= 0) return; L0(); mode('multiply'); ctx.globalAlpha = a * SA;
  brush(ctx, cr.main, { w: u => 4.5 * (1 - u * .4), prog, col: '18,14,16', a: .95, bristles: 3, body: .9, dryStart: 1, seed: 4 });
  for (const b of cr.br) { const p = clamp((prog - b.t) * 4); if (p > 0) brush(ctx, b.b, { w: u => 2.4 * (1 - u), prog: p, col: '18,14,16', a: .9, bristles: 2, body: 1, dryStart: 1, seed: 5 }); }
  ctx.globalAlpha = 1;
}
/* susurros: zarcillos de tinta que van de la boca de uno al oído de otro */
function whisper(x1, y1, x2, y2, T, a) {
  if (a <= 0) return; ctx.save(); mode('source-over'); ctx.lineCap = 'round'; ctx.shadowColor = 'rgba(150,130,190,.8)'; ctx.shadowBlur = 8 * U * CAM.z;
  for (let k = 0; k < 5; k++) {
    const ph = (T * .35 + k / 5) % 1, al = Math.sin(ph * PI) * a * SA;
    const mx = lerp(x1, x2, .5) + Math.sin(T * 1.3 + k) * 20, my = Math.min(y1, y2) - 40 - k * 6;
    const pts = qbez([x1, y1], [mx, my], [x2, y2], 30), m = Math.floor(ph * 30);
    ctx.strokeStyle = `rgba(150,136,180,${al * .55})`; ctx.lineWidth = 3.2 - k * .3; ctx.beginPath();
    for (let i = Math.max(0, m - 10); i <= m; i++) { const p = pts[i]; const w = Math.sin(i * .6 + T * 3 + k) * 4; if (i === Math.max(0, m - 10)) ctx.moveTo(p[0], p[1] + w); else ctx.lineTo(p[0], p[1] + w); }
    ctx.stroke();
  }
  ctx.restore();
}
/* varita suelta (girando por el aire o rota) */
function wandAt(x, y, ang, len, a, broken = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.fillStyle = `rgba(30,22,18,${.95 * a * SA})`;
  if (!broken) { const P = new Path2D(); cap(P, [-len / 2, 0], [len / 2, 0], 2.4, 1.1, 3); ctx.fill(P); }
  else { const P = new Path2D(); cap(P, [-len / 2 - broken * 6, broken * 3], [-2 - broken * 6, broken * 8], 2.4, 1.8, 3); cap(P, [2 + broken * 6, broken * 8], [len / 2 + broken * 6, broken * 2], 1.8, 1.1, 3); ctx.fill(P); }
  ctx.restore();
}
