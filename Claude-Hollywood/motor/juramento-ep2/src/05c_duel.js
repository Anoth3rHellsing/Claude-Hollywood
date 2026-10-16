/* =====================================================================
   DUELO v2: escudos, choque de rayos, escombros, polvo
   ===================================================================== */
Object.assign(SPELL, { sg: ['120,226,160', '232,255,240'], violet: ['150,110,230', '236,226,255'] });
let DEB = null, DUST = null;
function duelInit() {
  const rocks = [0, 1, 2, 3].map(i => { const c = mk(24, 24), g = c.getContext('2d'); seed(900 + i); g.translate(12, 12); g.fillStyle = 'rgba(40,36,44,.95)'; g.beginPath(); for (let k = 0; k < 6; k++) { const a = k / 6 * TAU, r = rnd(5, 11); g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.fill(); return c; });
  DEB = new Parts(120, { spr: rocks, size: 3.2, grav: 900, drag: .02, life: [1.2, 2.2], flip: false, fin: .02, resp: .02, floor: 345 });
  DUST = new Parts(80, { spr: [genBlob('120,114,124', 990, 64, .14, 8)], size: 26, grav: -10, drag: .6, life: [1.5, 3], flip: false, fin: .3, grow: .6 });
}
function impact(x, y, kind, n = 1) { sparks(x, y, 40 * n, kind, 380); for (let i = 0; i < 14 * n; i++) DEB.spawn(x + rnd(-10, 10), y + rnd(-10, 10), rnd(-260, 260), rnd(-420, -60)); for (let i = 0; i < 5 * n; i++) DUST.spawn(x + rnd(-30, 30), y + rnd(-20, 20), rnd(-40, 40), rnd(-30, 10)); }
function debrisDraw(dt, T) { if (dt > 0) { DEB.update(dt, T); DUST.update(dt, T); for (const q of DEB.p) if (q.on && q.y > 340) { q.y = 340; q.vy *= -.25; q.vx *= .6; } } mode('multiply'); DUST.draw(1, .7); DEB.draw(1, 1); }
/* escudo: cúpula de luz delante del lanzador */
function shield(x, y, r, kind, a, T, hit = 0, face = 1) {
  if (a * SA <= .01) return; const [c, cc] = SPELL[kind], A = a * SA, prev = ctx.globalCompositeOperation; mode('source-over');
  ctx.save(); ctx.translate(x, y); ctx.scale(face, 1);
  const a0 = -1.15, a1 = 1.15, wob = 1 + .03 * Math.sin(T * 9);
  const gr = ctx.createRadialGradient(-r * .2, 0, r * .3, 0, 0, r * 1.05); gr.addColorStop(0, `rgba(${c},0)`); gr.addColorStop(.75, `rgba(${c},${.12 * A})`); gr.addColorStop(1, `rgba(${cc},${.35 * A})`);
  ctx.fillStyle = gr; ctx.beginPath(); ctx.ellipse(0, 0, r * .55 * wob, r * wob, 0, a0, a1); ctx.closePath(); ctx.fill();
  ctx.lineCap = 'round'; ctx.shadowColor = `rgba(${c},.95)`; ctx.shadowBlur = LOWQ ? 0 : 14 * U * CAM.z;
  ctx.strokeStyle = `rgba(${cc},${.85 * A})`; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.ellipse(0, 0, r * .55 * wob, r * wob, 0, a0, a1); ctx.stroke();
  ctx.strokeStyle = `rgba(${c},${.4 * A})`; ctx.lineWidth = 1; for (let k = 1; k < 5; k++) { ctx.beginPath(); ctx.ellipse(-k * 3, 0, r * .55 * wob - k * 6, r * wob - k * 9, 0, a0 + .1, a1 - .1); ctx.stroke(); }
  if (hit > 0) for (let k = 0; k < 3; k++) { const rr = (1 - hit) * 90 + k * 22; ctx.strokeStyle = `rgba(${cc},${hit * (1 - k * .3) * A})`; ctx.lineWidth = 3 - k; ctx.beginPath(); ctx.ellipse(r * .5, 0, rr * .35, rr, 0, 0, TAU); ctx.stroke(); }
  ctx.restore(); ctx.shadowBlur = 0; mode(prev);
}
/* choque de rayos: dos haces que se empujan en un punto */
function clash(ta, tb, j, ka, kb, T, a) {
  const J = [lerp(ta[0], tb[0], j), lerp(ta[1], tb[1], j) - Math.sin(T * 7) * 6];
  beam(ta[0], ta[1], J[0], J[1], 1, ka, a, T, 5, 1); beam(tb[0], tb[1], J[0], J[1], 1, kb, a, T, 5, 2);
  orb(J[0], J[1], 14 + 5 * Math.sin(T * 23), ka, a, T); orb(J[0], J[1], 9, kb, a * .8, T + 1);
  return J;
}
