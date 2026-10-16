/* =====================================================================
   ESCENARIOS · ACABADO: papel encima de todo, viñeta, grado de color por escena, temblor, fundidos
   ===================================================================== */
let POSTPAT2 = null, VIG2 = null;
/* papel + viñeta (+ tono) en UNA pasada: el lienzo se arma cuando cambia el tamaño o el tono */
function postFx(t, o = {}) {
  const key = (o.tone || [255, 255, 255]).join(',') + (o.vig ?? .6);
  if (!VIG2 || VIG2.width !== W || VIG2.height !== H || VIG2.key !== key) {
    VIG2 = mk(W, H); VIG2.key = key; const g = VIG2.getContext('2d'), tn = o.tone || [255, 255, 255], e = mixc([255, 255, 255], [150, 120, 140], o.vig ?? .6);
    const gr = g.createRadialGradient(W / 2, H * .47, H * .32, W / 2, H / 2, Math.hypot(W, H) * .6); gr.addColorStop(0, cssc(tn)); gr.addColorStop(1, cssc(mixc(e, tn, .3))); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = 'multiply'; g.globalAlpha = o.paper ?? .16; g.fillStyle = g.createPattern(BLOT, 'repeat'); g.fillRect(0, 0, W, H);
    g.globalAlpha = .08; g.fillStyle = g.createPattern(GRAIN, 'repeat'); g.fillRect(0, 0, W, H);
  }
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'multiply'; ctx.drawImage(VIG2, 0, 0); ctx.restore(); T0();
}
/* fundido a un color (negro, papel) */
function fadeTo(col, a) { if (a <= .003) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = clamp(a); if (col === 'paper') ctx.drawImage(PAPER, 0, 0, W, H); else { ctx.fillStyle = col; ctx.fillRect(0, 0, W, H); } ctx.restore(); T0(); }
/* destello de cámara lenta: viñeta más oscura en los bordes */
function slowVig(k) { if (k < .01) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const gr = ctx.createRadialGradient(W / 2, H / 2, H * .3, W / 2, H / 2, Math.hypot(W, H) * .55); gr.addColorStop(0, 'rgba(20,10,30,0)'); gr.addColorStop(1, `rgba(20,10,30,${.45 * k})`); ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H); ctx.restore(); T0(); }
