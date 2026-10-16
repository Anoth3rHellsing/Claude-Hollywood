/* =====================================================================
   PARTÍCULAS Y EFECTOS ORGÁNICOS (pétalos, brasas, humo, lluvia, aves, hierba)
   ===================================================================== */
let WIND = { x: 20, y: 0, g: 30 };
class Parts {
  constructor(n, o = {}) { this.n = n; this.o = o; this.p = []; for (let i = 0; i < n; i++) this.p.push({ on: false }); this.acc = 0; }
  clear() { for (const q of this.p) q.on = false; this.acc = 0; }
  spawn(x, y, vx = 0, vy = 0, extra) {
    for (const q of this.p) if (!q.on) {
      Object.assign(q, { on: true, x, y, vx, vy, r: rnd(TAU), vr: rnd(-2, 2), f: rnd(TAU), vf: rnd(1.5, 4), s: rnd(.6, 1.25) * (this.o.size || 10), v: (R() * (this.o.spr.length)) | 0, age: 0, life: rnd(this.o.life?.[0] ?? 10, this.o.life?.[1] ?? 16), a: rnd(.65, 1) });
      if (extra) Object.assign(q, extra); return q;
    }
  }
  emit(dt, rate, fn) { this.acc += rate * dt; while (this.acc >= 1) { this.acc -= 1; fn(); } }
  update(dt, T) {
    const o = this.o, drag = o.drag ?? .9, grav = o.grav ?? 12;
    for (const q of this.p) {
      if (!q.on) continue; q.age += dt; if (q.age > q.life || q.y > (o.floor ?? 700) || q.y < -800) { q.on = false; continue; }
      const nx = N2(q.x * .004 + T * .15, q.y * .004) , ny = N2(q.y * .004 - T * .1, q.x * .004 + 50);
      const tx = WIND.x + nx * WIND.g, ty = WIND.y + ny * WIND.g * .6 + grav;
      const k = 1 - Math.pow(1 - drag, dt);   // relajación hacia el flujo del aire
      q.vx += (tx - q.vx) * k * (o.resp ?? 1); q.vy += (ty - q.vy) * k * (o.resp ?? 1);
      q.x += q.vx * dt; q.y += q.vy * dt; q.r += q.vr * dt * (1 + Math.abs(nx) * 2); q.f += q.vf * dt;
    }
  }
  draw(d = 1, alpha = 1) {
    const o = this.o; L(d); const m = ctx.getTransform();
    for (const q of this.p) {
      if (!q.on) continue;
      const fa = Math.min(1, q.age / (o.fin ?? .8)) * Math.min(1, (q.life - q.age) / 1.5) * q.a * alpha * SA; if (fa <= .01) continue;
      const fl = o.flip === false ? 1 : Math.cos(q.f) * .8 + (Math.cos(q.f) >= 0 ? .2 : -.2);
      const gs = 1 + q.age * (o.grow || 0), c = Math.cos(q.r), s = Math.sin(q.r), sx = q.s * fl * gs, sy = q.s * (o.sy ?? 1) * gs;
      const a = m.a, e = m.e, f = m.f, dd = m.d;
      ctx.setTransform(a * c * sx, a * s * sx, -a * s * sy, dd * c * sy, e + a * q.x, f + dd * q.y);
      ctx.globalAlpha = fa; const im = o.spr[q.v % o.spr.length]; ctx.drawImage(im, -1, -1, 2, 2);
    }
    ctx.globalAlpha = 1; ctx.setTransform(m);
  }
  warm(sec, T, fnEmit) { const st = 1 / 20; for (let t = 0; t < sec; t += st) { if (fnEmit) fnEmit(st, T - sec + t); this.update(st, T - sec + t); } }
}

/* lluvia: trazos finos de tinta inclinados por el viento */
const RAIN = [];
function rainInit(n) { RAIN.length = 0; seed(4242); for (let i = 0; i < n; i++) RAIN.push({ x: rnd(-1200, 1200), y: rnd(-600, 600), l: rnd(18, 46), v: rnd(900, 1400), d: rnd(.5, 1.3) }); }
function rainDraw(dt, amt, slant = .18, a = .2) {
  if (amt <= 0) return; L0(); mode('multiply');
  ctx.strokeStyle = `rgba(40,38,40,${a * SA})`; ctx.lineWidth = 1.1; ctx.beginPath();
  const n = Math.floor(RAIN.length * amt * (LOWQ ? .55 : 1)), hw = SW / 2 + 100;
  for (let i = 0; i < n; i++) {
    const q = RAIN[i]; q.y += q.v * q.d * dt; q.x += q.v * q.d * slant * dt;
    if (q.y > 560) { q.y -= 1150; q.x = rnd(-hw - 200, hw); } if (q.x > hw) q.x -= hw * 2;
    ctx.moveTo(q.x, q.y); ctx.lineTo(q.x - q.l * q.d * slant, q.y - q.l * q.d);
  }
  ctx.stroke();
}

/* aves: trazos en V que aletean */
function birds(T, o) {
  const p = rg(T, o.t0, o.t1); if (p <= 0 || p >= 1) return;
  L(o.d ?? .4); seed(o.seed);
  ctx.strokeStyle = `rgba(${o.col || '30,26,24'},${(o.a ?? .8) * SA * fade(T, o.t0, o.t1, 1.5, 1.5)})`; ctx.lineCap = 'round';
  for (let i = 0; i < o.n; i++) {
    const ox = rnd(-1, 1) * o.spread * (1 + i * .05), oy = rnd(-1, 1) * o.spread * .45, lag = rnd(0, .08);
    const q = clamp(p - lag * (1 - p));
    const x = lerp(o.x0, o.x1, q) + ox + Math.sin(T * .7 + i) * 8, y = lerp(o.y0, o.y1, q) + oy + Math.sin(T * 1.3 + i * 2) * 6;
    const fl = Math.sin(T * (o.fr ?? 9) + i * 1.7), w = o.s * rnd(.8, 1.2);
    ctx.lineWidth = w * .16;
    ctx.beginPath(); ctx.moveTo(x - w, y - fl * w * .5); ctx.quadraticCurveTo(x - w * .4, y - w * .15 - fl * w * .2, x, y);
    ctx.quadraticCurveTo(x + w * .4, y - w * .15 - fl * w * .2, x + w, y - fl * w * .5); ctx.stroke();
    if (o.crow) { ctx.fillStyle = ctx.strokeStyle; ctx.beginPath(); ctx.ellipse(x, y + w * .05, w * .22, w * .1, 0, 0, TAU); ctx.fill(); }
  }
}

/* hierba susuki: hojas largas que se mecen con ruido */
function grassInit(n, x0, x1, y, h0, h1, s0) { seed(s0); const g = []; for (let i = 0; i < n; i++) g.push({ x: rnd(x0, x1), y: y + rnd(-6, 14), h: rnd(h0, h1), c: rnd(-.25, .25), ph: rnd(TAU), plume: R() < .35 }); return g; }
function grassDraw(G, T, d, col, a, w = 1.4, sway = 1) {
  L(d); ctx.strokeStyle = `rgba(${col},${a * SA})`; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath();
  const plumes = [];
  for (const b of G) {
    const s = (Math.sin(T * 1.4 + b.x * .012 + b.ph) * .12 + N2(b.x * .004, T * .35) * .35 * sway + WIND.x * .002) + b.c;
    const tx = b.x + Math.sin(s) * b.h, ty = b.y - Math.cos(s) * b.h;
    ctx.moveTo(b.x, b.y); ctx.quadraticCurveTo(b.x + Math.sin(s * .4) * b.h * .5, b.y - b.h * .55, tx, ty);
    if (b.plume) plumes.push([tx, ty, s]);
  }
  ctx.stroke();
  ctx.lineWidth = w * 1.1; ctx.strokeStyle = `rgba(${col},${a * .35 * SA})`; ctx.beginPath();
  for (const [x, y, s] of plumes) for (let k = -2; k <= 2; k++) { const a2 = s + k * .22 + .3; ctx.moveTo(x, y); ctx.quadraticCurveTo(x + Math.sin(a2) * 8, y - Math.cos(a2) * 8, x + Math.sin(a2 + .6) * 16, y - Math.cos(a2 + .6) * 12 + 6); }
  ctx.stroke();
}

/* trazo de corte: pincelada rápida dramática */
function slash(x1, y1, x2, y2, prog, a, wd, sd, bend = .12, layer = 0, col = INK) {
  if (prog <= 0 || a <= 0) return;
  if (layer === 0) L0(); else L(layer);
  const mx = (x1 + x2) / 2 - (y2 - y1) * bend, my = (y1 + y2) / 2 + (x2 - x1) * bend;
  const pts = qbez([x1, y1], [mx, my], [x2, y2], 60);
  ctx.globalAlpha = a * SA;
  brush(ctx, pts, { w: u => wd * Math.pow(Math.sin(PI * Math.min(1, u * .9 + .1)), .5) * (1 - u * .35), prog: eo(prog), col, a: .92, bristles: 14, body: .7, dryStart: .55, dryAll: .05, dryFreq: .03, seed: sd });
  ctx.globalAlpha = 1;
}
