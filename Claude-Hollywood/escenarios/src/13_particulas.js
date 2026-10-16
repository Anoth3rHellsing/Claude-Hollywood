/* =====================================================================
   ESCENARIOS · PARTÍCULAS SIN ESTADO (cada una es función de t: se puede saltar a cualquier instante)
   polvo del aire (casi invisible en la sombra, chispea al cruzar un haz), nubes de polvo que se levantan
   (sábanas, colchón), y un helper para dibujarlas repartidas en la lista de profundidad.
   ===================================================================== */
/* motas en una caja 3D B = {x0,x1,y0,y1,z0,z1}; deriva lenta y giro de aire */
function dustAmbient(t, B, n = 240, seed = 1) {
  const o = [];
  for (let i = 0; i < n; i++) {
    const h = k => hsh(i + seed * 97, k), sx = B.x1 - B.x0, sy = B.y1 - B.y0;
    const x = B.x0 + ((h(1) * sx + t * (3 + h(4) * 5) + Math.sin(t * .23 + h(5) * 9) * 18) % sx + sx) % sx;
    const y = B.y0 + ((h(2) * sy + Math.sin(t * .31 + h(6) * 7) * 22 - t * (h(7) - .45) * 2) % sy + sy) % sy;
    const z = B.z0 + h(3) * (B.z1 - B.z0) + Math.sin(t * .19 + h(8) * 5) * 14;
    o.push({ x, y, z, r: .5 + h(9) * 1.1, tw: h(10) });
  }
  return o;
}
/* nube que se levanta en t0 desde un volumen (sábana que vuela): sale rápido, frena, flota y se asienta */
function dustBurst(t, t0, src, n = 380, seed = 7, o = {}) {
  const a = t - t0; if (a < 0) return [];
  const out = [], life = o.life ?? 16;
  for (let i = 0; i < n; i++) {
    const h = k => hsh(i + seed * 131, k), st = h(11) * (o.spread ?? .5); const aa = a - st; if (aa < 0) continue;
    const fade = 1 - sm((aa - life * (.5 + .5 * h(12))) / 3); if (fade <= 0) continue;
    const vx = (h(1) - .5) * (o.vx ?? 260) + (o.wx ?? 0), vy = -(.3 + h(2)) * (o.vy ?? 170), vz = (h(3) - .5) * (o.vz ?? 200), k = 2.2 + h(4) * 1.8, e = (1 - Math.exp(-k * aa)) / k;
    const x = src.x0 + h(5) * (src.x1 - src.x0) + vx * e + Math.sin(aa * .5 + h(6) * 9) * 10 * Math.min(1, aa);
    const y = src.y0 + h(7) * (src.y1 - src.y0) + vy * e + aa * (2 + h(8) * 4) + Math.sin(aa * .4 + h(9) * 7) * 6;
    const z = src.z0 + h(10) * (src.z1 - src.z0) + vz * e;
    out.push({ x, y: Math.min(y, -1), z, r: .5 + h(13) * 1.4, tw: h(14), a: fade * (o.a ?? 1) });
  }
  return out;
}
/* dibuja motas: brillo según el haz (solIn) y el tono; reparte en franjas de profundidad en la lista */
function dustPut(motes, o = {}) {
  const bands = o.bands ?? [[0, 450], [450, 620], [620, 2000]];
  for (const [za, zb] of bands) put((za + zb) / 2 + .1, () => {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter';
    for (const m of motes) { if (m.z < za || m.z >= zb || m.z - CAM.z < 20) continue;
      const lit = o.lit === false ? 0 : solIn([m.x, m.y, m.z]), base = o.dim ?? .1, al = (base + lit * (o.bright ?? .85) * (.6 + .4 * Math.sin(T * 3 + m.tw * 30))) * (m.a ?? 1);
      if (al < .02) continue; const p = toPx(PJ(m.x, m.y, m.z)), r = Math.max(.6, m.r * PS(m.z) * U * (o.size ?? 1));
      ctx.fillStyle = cssc(lit > .5 ? (o.col || SOL.col) : (o.dcol || [200, 190, 210]), clamp(al)); ctx.fillRect(p[0] - r, p[1] - r, r * 2, r * 2); }
    ctx.restore(); T0();
  });
}
/* vapor en columnas estrechas (no en manchas redondas): cada columna es un trazo que sube y se abre;
   las ondulaciones viajan hacia arriba con el tiempo. src = {x, y, z}; o = {n, h, w, col, a, drift, mode} */
function steamCols(t, src, o = {}) {
  if (src.z - CAM.z < 20) return;
  const n = o.n ?? 4, H = o.h ?? 120, w0 = o.w ?? 2, s = PS(src.z), col = o.col || [246, 246, 244], A = (o.a ?? .3) * (o.k ?? 1);
  if (A < .01) return;
  ctx.save(); ctx.globalCompositeOperation = o.mode || 'source-over'; ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const ph = hsh(i, src.x * .01 + 3) * 9, sp = .7 + hsh(i, 5) * .6, dx0 = (hsh(i, 7) - .5) * (o.spread ?? 6);
    for (let seg = 0; seg < 3; seg++) {   /* tres pasadas: cuerpo ancho y tenue, medio, hilo brillante */
      const ww = [3.2, 1.8, .7][seg], aa = [.25, .45, .8][seg];
      ctx.beginPath();
      for (let k = 0; k <= 14; k++) { const u = k / 14, y = src.y - u * H, wob = Math.sin(u * 6 + ph - t * 3 * sp) * u * (o.sway ?? 14) + N2(u * 2 - t * .8 * sp, i * 3) * u * 18 + (o.drift ?? 0) * u * u * H, x = src.x + dx0 + wob, p = PJ(x, y, src.z); k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }
      const top = PJ(src.x, src.y - H, src.z), bot = PJ(src.x, src.y, src.z), gr = ctx.createLinearGradient(0, bot[1], 0, top[1]);
      gr.addColorStop(0, cssc(col, A * aa)); gr.addColorStop(.35, cssc(col, A * aa * .8)); gr.addColorStop(1, cssc(col, 0));
      ctx.strokeStyle = gr; ctx.lineWidth = Math.max(.6, w0 * ww * s * (1 + .3 * i % 2)); ctx.stroke();
    }
  }
  ctx.restore();
}
/* komorebi: manchas de sol que se cuelan entre las copas y tiemblan con el viento, sobre un plano horizontal.
   R = {x0, x1, z0, z1, y}; devuelve una función luz(x, z) para iluminar a los personajes que pasan por debajo */
function dappleAt(x, z, t, o = {}) { const cs = o.cell ?? 70, i = Math.floor(x / cs), j = Math.floor(z / cs); let v = 0;
  for (let di = -1; di <= 1; di++) for (let dj = -1; dj <= 1; dj++) { const a = i + di, b = j + dj; if (hsh(a, b) > (o.dens ?? .55)) continue; const cx = (a + .5) * cs + (hsh(a, b + 1) - .5) * cs * .8 + Math.sin(t * (.9 + hsh(a, 3)) + a) * 8, cz = (b + .5) * cs + (hsh(a + 2, b) - .5) * cs * .8, r = cs * (.18 + hsh(a, b + 5) * .3), d = Math.hypot(x - cx, (z - cz) * .9) / r; if (d < 1) v = Math.max(v, (1 - d * d) * (.6 + .4 * Math.sin(t * 2.3 + a * 1.7 + b))); }
  return v; }
function dapple(t, R, o = {}) {
  const cs = o.cell ?? 70, s0 = PS(R.z0), xs0 = Math.max(R.x0, CAM.x + (-SW / 2 - 40) / PS(R.z1)), xs1 = Math.min(R.x1, CAM.x + (SW / 2 + 40) / PS(R.z1));
  ctx.save(); ctx.globalCompositeOperation = o.mode || 'screen';
  for (let a = Math.floor(xs0 / cs); a * cs < xs1; a++) for (let b = Math.floor(R.z0 / cs); b * cs < R.z1; b++) {
    if (hsh(a, b) > (o.dens ?? .55)) continue;
    const cx = (a + .5) * cs + (hsh(a, b + 1) - .5) * cs * .8 + Math.sin(t * (.9 + hsh(a, 3)) + a) * 8, cz = (b + .5) * cs + (hsh(a + 2, b) - .5) * cs * .8; if (cz < R.z0 || cz > R.z1 || cz - CAM.z < 30) continue;
    const r = cs * (.18 + hsh(a, b + 5) * .3), p = PJ(cx, R.y, cz), s = PS(cz), rx = r * s, ry = rx * Math.max(.08, (R.y - CAM.y) / Math.max(40, cz - CAM.z) * 1.1), k = (.6 + .4 * Math.sin(t * 2.3 + a * 1.7 + b)) * (o.a ?? .5);
    const gr = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], rx); gr.addColorStop(0, cssc(o.col || [255, 236, 170], k)); gr.addColorStop(.6, cssc(o.col || [255, 236, 170], k * .55)); gr.addColorStop(1, cssc(o.col || [255, 236, 170], 0));
    ctx.fillStyle = gr; ctx.save(); ctx.translate(p[0], p[1]); ctx.scale(1, ry / rx); ctx.translate(-p[0], -p[1]); ctx.fillRect(p[0] - rx, p[1] - rx, rx * 2, rx * 2); ctx.restore();
  }
  ctx.restore();
}
/* rayos entre las copas: columnas inclinadas de luz en el aire húmedo (se mecen y respiran) */
function godRays(t, list, o = {}) {
  ctx.save(); ctx.globalCompositeOperation = 'screen';
  for (const [x, z, w, ph] of list) {
    const k = (o.a ?? .1) * (.6 + .4 * Math.sin(t * .5 + ph)), dx = o.dx ?? 260, y0 = o.y0 ?? -900, sw = Math.sin(t * .3 + ph) * 20;
    const P = poly3([[x - w / 2 + sw, y0, z], [x + w / 2 + sw, y0, z], [x + w / 2 + dx, 0, z - (o.dz ?? 120)], [x - w / 2 + dx, 0, z - (o.dz ?? 120)]]); if (!P) continue;
    const a = PJ(x, y0, z), b = PJ(x + dx, 0, z), gr = ctx.createLinearGradient(a[0], a[1], b[0], b[1]); gr.addColorStop(0, cssc(o.col || [255, 240, 190], k)); gr.addColorStop(1, cssc(o.col || [255, 240, 190], k * .15)); ctx.fillStyle = gr; ctx.fill(P);
  }
  ctx.restore();
}
/* piedritas y hojas secas que levantan los pasos: steps = [[t, x, z, dir]]; sin estado */
function kickBits(t, steps, o = {}) {
  const LC = [[204, 140, 52], [186, 96, 40], [220, 176, 70], [170, 60, 36]];
  for (const [ts, x0, z0, dir] of steps) { const a = t - ts; if (a < 0 || a > 1.6) continue;
    for (let i = 0; i < (o.n ?? 4); i++) { const h = k => hsh(i + ts * 13, k), leaf = h(1) < (o.leafP ?? .35);
      if (!leaf) { const vx = (dir || 1) * -(40 + h(2) * 90), vy = 90 + h(3) * 160, vz = (h(4) - .5) * 60, tt = Math.min(a, 2 * vy / 980), y = -(vy * tt - 490 * tt * tt), x = x0 + vx * tt, z = z0 + vz * tt; if (a > 1.2) continue;
        const p = PJ(x, y, z), r = Math.max(.7, (1 + h(5) * 1.5) * PS(z)); ctx.fillStyle = cssc(pick3(() => h(6), [[150, 140, 128], [176, 168, 156], [120, 110, 100]])); ctx.fillRect(p[0] - r, p[1] - r, r * 2, r * 1.6); }
      else { const vx = (dir || 1) * -(30 + h(2) * 70), vy = 120 + h(3) * 160, k = 2.5, e = (1 - Math.exp(-k * a)) / k, y = Math.min(0, -(vy * e) + 60 * a * a), x = x0 + vx * e + Math.sin(a * 6 + i) * 10 * a, z = z0 + (h(4) - .5) * 80 * e, rot = a * (6 + h(5) * 6) * (h(6) < .5 ? -1 : 1), fl = Math.cos(a * 9 + i);
        const p = PJ(x, y, z), s = (4 + h(7) * 3) * PS(z); ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(rot); ctx.scale(1, Math.max(.2, Math.abs(fl))); ctx.fillStyle = cssc(LC[(h(8) * 4) | 0]); ctx.beginPath(); ctx.moveTo(-s, 0); ctx.quadraticCurveTo(0, -s * .55, s, 0); ctx.quadraticCurveTo(0, s * .55, -s, 0); ctx.fill(); ctx.restore(); }
    } }
}
