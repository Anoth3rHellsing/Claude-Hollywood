/* =====================================================================
   ESCENARIOS · LUZ QUE ENTRA POR UNA VENTANA CON PERSIANA (sol de mañana, luna de noche)
   La luz es paralela (dirección SOL.dir). Cada rendija entre lamas se proyecta en 3D sobre cada superficie
   receptora (suelo, pared, sobre de mesa…) y se recorta a sus bordes: así las franjas doradas caen en su
   sitio con la perspectiva correcta. Los objetos (hojas de la monstera, la sábana, el personaje) proyectan
   su sombra con la misma dirección. Cada receptor se ilumina en su turno de la lista de profundidad, así lo
   que está delante lo tapa bien. Haces en el aire (volumen) y prueba «¿este punto está en un haz?» para el polvo.
   ===================================================================== */
const SOL = {
  dir: [1, .4, .34], win: { x: -560, z0: 380, z1: 600, y0: -236, y1: -98 }, n: 13, open: .55,
  col: [255, 206, 140], k: 1, amb: [118, 100, 150], ambA: .3, on: 1, shaft: .07,
};
function solNorm() { const d = SOL.dir, l = Math.hypot(d[0], d[1], d[2]); SOL.d = [d[0] / l, d[1] / l, d[2] / l]; }
/* rendijas de la persiana (cuadriláteros 3D en el plano de la ventana) */
function solSlits() {
  const W_ = SOL.win, P = (W_.y1 - W_.y0) / SOL.n, o = [];
  for (let k = 0; k < SOL.n; k++) { const a = W_.y0 + k * P + P * (1 - SOL.open), b = W_.y0 + (k + 1) * P;
    o.push([[W_.x, a, W_.z0], [W_.x, a, W_.z1], [W_.x, b, W_.z1], [W_.x, b, W_.z0]]); }
  if (SOL.gapTop) o.push([[W_.x, W_.y0 - SOL.gapTop, W_.z0], [W_.x, W_.y0 - SOL.gapTop, W_.z1], [W_.x, W_.y0, W_.z1], [W_.x, W_.y0, W_.z0]]);
  return o;
}
/* proyección paralela de un punto sobre el plano del receptor */
function solProj(p, R) {
  const d = SOL.d, t = R.t === 'h' ? (R.y - p[1]) / d[1] : R.t === 'vz' ? (R.z - p[2]) / d[2] : (R.x - p[0]) / d[0];
  return [p[0] + d[0] * t, p[1] + d[1] * t, p[2] + d[2] * t, t];
}
/* recorte de un polígono contra un semiplano (eje i, valor v, lado s = +1 conserva >= v) */
function clipAx(P, i, v, s) {
  const o = []; for (let k = 0; k < P.length; k++) { const a = P[k], b = P[(k + 1) % P.length], ia = (a[i] - v) * s >= 0, ib = (b[i] - v) * s >= 0;
    if (ia) o.push(a); if (ia !== ib) { const t = (v - a[i]) / (b[i] - a[i]); o.push(a.map((q, j) => lerp(q, b[j], t))); } }
  return o;
}
function clipRecv(P, R) {
  const ax = R.t === 'h' ? [[0, R.x0, R.x1], [2, R.z0, R.z1]] : R.t === 'vz' ? [[0, R.x0, R.x1], [1, R.y0, R.y1]] : [[2, R.z0, R.z1], [1, R.y0, R.y1]];
  for (const [i, a, b] of ax) { P = clipAx(P, i, a, 1); if (P.length < 3) return P; P = clipAx(P, i, b, -1); if (P.length < 3) return P; }
  return P;
}
/* contorno del receptor en 3D (para el tono de sombra) */
function recvPoly(R) {
  if (R.t === 'h') return [[R.x0, R.y, R.z1], [R.x1, R.y, R.z1], [R.x1, R.y, R.z0], [R.x0, R.y, R.z0]];
  if (R.t === 'vz') return [[R.x0, R.y0, R.z], [R.x1, R.y0, R.z], [R.x1, R.y1, R.z], [R.x0, R.y1, R.z]];
  return [[R.x, R.y0, R.z0], [R.x, R.y0, R.z1], [R.x, R.y1, R.z1], [R.x, R.y1, R.z0]];
}
let SLC = null, slc = null;
function solBuf() { if (!SLC || SLC.width !== Math.ceil(W / 2) || SLC.height !== Math.ceil(H / 2)) { SLC = mk(W / 2, H / 2); slc = SLC.getContext('2d'); } }
/* ilumina un receptor recién dibujado: tono de sombra (violeta) + franjas de sol menos las sombras de los oclusores.
   R = {t:'h'|'vz'|'vx', bordes…, occ: [polígonos 3D], k: intensidad, amb: tono} ; occ dinámicos en SOL.dyn */
function solOn(R) {
  if (!SOL.d) solNorm();
  const ambA = (R.ambA ?? SOL.ambA);
  if (ambA > .01) { ctx.save(); const P = poly3(recvPoly(R)); if (P) { ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = ambA; ctx.fillStyle = cssc(R.amb || SOL.amb); ctx.fill(P); } ctx.restore(); }
  const k = SOL.on * (R.k ?? 1) * SOL.k; if (k < .01) return;
  solBuf(); const g = slc; g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; if (SLC.dirty) g.clearRect(...SLC.dirty); else g.clearRect(0, 0, SLC.width, SLC.height);
  g.setTransform(U / 2, 0, 0, U / 2, W / 4 + SHX / 2, H / 4 + SHY / 2);
  let any = false, bx0 = 1e9, by0 = 1e9, bx1 = -1e9, by1 = -1e9; g.fillStyle = 'rgb(255,255,255)';
  for (const s of solSlits()) {
    const q = s.map(p => solProj(p, R)); if (q.some(p => p[3] < 0)) continue;
    const c = clipRecv(q, R); if (c.length < 3) continue; const cn = clipNear(c); if (cn.length < 3) continue;
    const sp = pj3(cn); for (const p of sp) { bx0 = Math.min(bx0, p[0]); bx1 = Math.max(bx1, p[0]); by0 = Math.min(by0, p[1]); by1 = Math.max(by1, p[1]); }
    g.fill(pPolys([sp])); any = true;
  }
  if (!any) return;
  /* solo se trabaja en el rectángulo donde cae luz (px del búfer a media resolución) */
  const hx0 = clamp(Math.floor((bx0 * U + W / 2 + SHX) / 2) - 2, 0, SLC.width), hx1 = clamp(Math.ceil((bx1 * U + W / 2 + SHX) / 2) + 2, 0, SLC.width), hy0 = clamp(Math.floor((by0 * U + H / 2 + SHY) / 2) - 2, 0, SLC.height), hy1 = clamp(Math.ceil((by1 * U + H / 2 + SHY) / 2) + 2, 0, SLC.height), bw = hx1 - hx0, bh = hy1 - hy0;
  if (bw < 1 || bh < 1) return;
  /* sombras proyectadas (penumbra: dos pasadas algo corridas) */
  g.globalCompositeOperation = 'destination-out';
  const occ = (R.occ || []).concat(SOL.dyn || []);
  for (const O of occ) { if (O.only && !O.only.includes(R.id)) continue;
    const q = O.pts.map(p => solProj(p, R)); if (q.some(p => p[3] < 0)) continue; const cn = clipNear(q); if (cn.length < 3) continue;
    const polys = [pj3(cn)]; if (O.holes) for (const h of O.holes) { const qh = clipNear(h.map(p => solProj(p, R))); if (qh.length > 2) polys.push(pj3(qh)); }
    g.globalAlpha = O.a ?? .92; g.fill(pPolys(polys), 'evenodd'); }
  g.globalAlpha = 1; g.globalCompositeOperation = 'source-in'; g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = cssc(R.col || SOL.col); g.fillRect(hx0, hy0, bw, bh);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = clamp(.62 * k); ctx.drawImage(SLC, hx0, hy0, bw, bh, hx0 * 2, hy0 * 2, bw * 2, bh * 2);
  ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = clamp(.42 * k); ctx.drawImage(SLC, hx0, hy0, bw, bh, hx0 * 2, hy0 * 2, bw * 2, bh * 2);
  ctx.restore(); T0();
  SLC.dirty = [hx0, hy0, bw, bh];
}
/* ¿el punto p está dentro de un haz? (vuelve por el rayo hasta la ventana) → 0..1 */
function solIn(p) {
  if (!SOL.d) solNorm(); const d = SOL.d, W_ = SOL.win, t = (W_.x - p[0]) / d[0]; if (t > 0) return 0;
  const y = p[1] + d[1] * t, z = p[2] + d[2] * t; if (z < W_.z0 || z > W_.z1 || y < W_.y0 || y > W_.y1) return 0;
  const P = (W_.y1 - W_.y0) / SOL.n, f = ((y - W_.y0) / P) % 1; return f > 1 - SOL.open ? 1 : 0;
}
/* haces en el aire: volumen de cada rendija hasta el primer plano que toca (suelo o pared del fondo) */
function solShafts(zBack, a = SOL.shaft) {
  if (!SOL.d) solNorm(); const k = a * SOL.on * SOL.k; if (k < .005) return;
  const d = SOL.d, hit = p => { const tf = (0 - p[1]) / d[1], tb = (zBack - p[2]) / d[2], t = Math.min(tf, tb); return [p[0] + d[0] * t, p[1] + d[1] * t, p[2] + d[2] * t]; };
  ctx.save(); ctx.globalCompositeOperation = 'screen';
  for (const s of solSlits()) {
    const e = s.map(hit), all = clipNear(s.concat(e)); if (all.length < 3) continue;
    const sp = pj3(all), h = hull2(sp), w0 = PJ(...s[0]), w1 = PJ(...e[0]), gr = ctx.createLinearGradient(w0[0], w0[1], w1[0], w1[1]);
    gr.addColorStop(0, cssc(SOL.col, k)); gr.addColorStop(.6, cssc(SOL.col, k * .55)); gr.addColorStop(1, cssc(SOL.col, k * .15));
    ctx.fillStyle = gr; ctx.fill(pPolys([h]));
  }
  ctx.restore();
}
/* envolvente convexa 2D (cadena monótona) */
function hull2(P) {
  const p = P.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]), cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]), lo = [], up = [];
  for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  up.pop(); lo.pop(); return lo.concat(up);
}
/* tono de sombra para caras que no reciben sol (muebles, lados) */
function amb3(pts, a = SOL.ambA) { const P = poly3(pts); if (!P) return; ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = a; ctx.fillStyle = cssc(SOL.amb); ctx.fill(P); ctx.restore(); }
