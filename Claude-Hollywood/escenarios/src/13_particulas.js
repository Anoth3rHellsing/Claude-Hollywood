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
