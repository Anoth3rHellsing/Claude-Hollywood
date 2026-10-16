/* =====================================================================
   ESCENARIOS · TRANSICIONES: mosaico pixel (cuadros que se encienden desde un borde con ruido, a juego con el 8 bits)
   ===================================================================== */
let TRA = null, TRB = null;
function pxWipe(drawA, drawB, u, o = {}) {
  if (!TRA || TRA.width !== W || TRA.height !== H) { TRA = mk(W, H); TRB = mk(W, H); }
  /* cada escena se dibuja en el lienzo principal y se copia a su búfer */
  const grab = (cnv, f) => { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; T0(); f(); const g = cnv.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(cv, 0, 0); };
  grab(TRA, drawA); grab(TRB, drawB);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(TRA, 0, 0);
  const cs = Math.max(8, Math.round(H / (o.cells ?? 18))), nx = Math.ceil(W / cs), ny = Math.ceil(H / cs);
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const d = (o.dir === 'left' ? 1 - i / nx : o.dir === 'center' ? Math.hypot(i / nx - .5, (j / ny - .5) * .6) * 1.6 : i / nx) * .7 + hsh(i, j) * .3, k = clamp((u * 1.3 - d) * 6);
    if (k <= 0) continue;
    if (k >= 1) ctx.drawImage(TRB, i * cs, j * cs, cs, cs, i * cs, j * cs, cs, cs);
    else { const m = Math.max(1, Math.round(cs * k)); ctx.drawImage(TRB, i * cs + (cs - m) / 2, j * cs + (cs - m) / 2, m, m, i * cs + (cs - m) / 2, j * cs + (cs - m) / 2, m, m); ctx.fillStyle = `rgba(255,255,255,${.25 * (1 - k)})`; ctx.fillRect(i * cs + (cs - m) / 2, j * cs + (cs - m) / 2, m, m); }
  }
  ctx.restore(); T0();
}
