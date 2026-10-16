/* =====================================================================
   ESCENARIOS · AGUA QUIETA: estanques y charcos como espejo. Se recorta al contorno proyectado, se pinta el cielo,
   se reflejan los sprites (billMirror) y encima van las ondas concéntricas, los brillos y el tono del agua.
   o = {pts: [[x,z]…], y, sky: [arriba, abajo], tint, a, refl: fn, rings: [[t0, x, z]…], glitter}
   ===================================================================== */
function waterPlane(t, o) {
  const pts3 = o.pts.map(([x, z]) => [x, o.y || 0, z]), P = poly3(pts3); if (!P) return;
  ctx.save(); ctx.clip(P);
  const top = PJ(0, o.y || 0, 1e5)[1], gr = ctx.createLinearGradient(0, top, 0, 520); gr.addColorStop(0, cssc(o.sky ? o.sky[0] : [190, 214, 226])); gr.addColorStop(1, cssc(o.sky ? o.sky[1] : [120, 156, 170])); ctx.fillStyle = gr; ctx.fillRect(-SW, -600, SW * 2, 1200);
  if (o.refl) o.refl();
  /* ondas: anillos que crecen (los patos, una gota, una hoja) */
  for (const [t0, x, z, amp] of o.rings || []) { const a = t - t0; if (a < 0 || a > 4) continue;
    for (let k = 0; k < 3; k++) { const ak = a - k * .35; if (ak < 0) continue; const r = 6 + ak * 34, c = PJ(x, o.y || 0, z), s = PS(z), ry = Math.max(.08, ((o.y || 0) - CAM.y) / Math.max(40, z - CAM.z)) ; ctx.strokeStyle = `rgba(250,252,255,${(amp ?? .55) * Math.exp(-ak * .9)})`; ctx.lineWidth = Math.max(.6, 1.4 * s); ctx.beginPath(); ctx.ellipse(c[0], c[1], r * s, r * s * ry, 0, 0, TAU); ctx.stroke(); } }
  if (o.tint) { ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = cssc(o.tint, o.tintA ?? .35); ctx.fillRect(-SW, -600, SW * 2, 1200); ctx.globalCompositeOperation = 'source-over'; }
  /* brillos horizontales que se mueven despacio */
  if (o.glitter !== false) { ctx.fillStyle = 'rgba(255,255,250,.35)'; for (let i = 0; i < 40; i++) { const z = o.zg0 + hsh(i, 1) * (o.zg1 - o.zg0), x = CAM.x + (hsh(i, 2) - .5) * 2 * (SW / 2) / PS(z) + Math.sin(t * .7 + i) * 20, p = PJ(x, o.y || 0, z), w = (10 + hsh(i, 3) * 40) * PS(z); if (Math.sin(t * 1.3 + i * 2.1) < .2) continue; ctx.fillRect(p[0] - w / 2, p[1], w, Math.max(.6, .8 * PS(z))); } }
  ctx.restore();
  if (o.edge !== false) { ctx.strokeStyle = cssc(o.edgeC || [60, 70, 60], .5); ctx.lineWidth = Math.max(1, 2 * PS(o.pts[0][1])); ctx.stroke(P); }
}
