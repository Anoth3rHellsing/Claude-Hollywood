/* =====================================================================
   LUZ · dos capas a media resolución que se suman con «screen»:
   LGT = luz que cae sobre el escenario (se compone antes de los personajes: ellos quedan en silueta)
   LGF = luz de los hechizos (se compone al final, encima de todo)
   ===================================================================== */
let LCA = null, lca = null, LCB = null, lcb = null, LUSE = [1, 1], LDIRTY = [1, 1];
function lightsInit() { LCA = mk(W / 2, H / 2); lca = LCA.getContext('2d'); LCB = mk(W / 2, H / 2); lcb = LCB.getContext('2d'); }
function lightsBegin() {
  if (!LCA || LCA.width !== Math.ceil(W / 2) || LCA.height !== Math.ceil(H / 2)) lightsInit();
  [lca, lcb].forEach((g, i) => { g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; if (LDIRTY[i]) g.clearRect(0, 0, LCA.width, LCA.height); LDIRTY[i] = 0; LUSE[i] = 0; g.setTransform(U / 2, 0, 0, U / 2, W / 4 + SHX / 2, H / 4 + SHY / 2); g.globalCompositeOperation = 'lighter'; });
}
function radial(g, x, y, r, col, a) {
  if (a <= .005 || r < 1) return;
  const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${col},${Math.min(1, a)})`); gr.addColorStop(.35, `rgba(${col},${Math.min(1, a) * .45})`); gr.addColorStop(1, `rgba(${col},0)`);
  g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
}
const LGT = (x, y, r, col, a) => { if (a > .005) { LUSE[0] = LDIRTY[0] = 1; radial(lca, x, y, r, col, a); } };
const LGF = (x, y, r, col, a) => { if (a > .005) { LUSE[1] = LDIRTY[1] = 1; radial(lcb, x, y, r, col, a); } };
function lightsComp(which) {
  if (!LUSE[which ? 1 : 0]) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = 1;
  ctx.drawImage(which ? LCB : LCA, 0, 0, W, H); ctx.restore();
}
/* tinte global (oscurecer o calentar todo el cuadro) */
function tint(col, a, mode = 'multiply') { if (a <= .005) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = mode; ctx.globalAlpha = clamp(a); ctx.fillStyle = `rgb(${col})`; ctx.fillRect(0, 0, W, H); ctx.restore(); T0(); }
/* papel y viñeta: la película está pintada en una hoja fija */
let POSTPAT = null, VIG = null;
function post(t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (!POSTPAT) POSTPAT = ctx.createPattern(BLOT, 'repeat');
  ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = .2; ctx.fillStyle = POSTPAT; ctx.fillRect(0, 0, W, H);
  if (!VIG || VIG.width !== W) { VIG = mk(W, H); const g = VIG.getContext('2d'), gr = g.createRadialGradient(W / 2, H * .48, H * .35, W / 2, H / 2, Math.hypot(W, H) * .62); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(184,160,128,1)'); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
  ctx.globalAlpha = .7; ctx.drawImage(VIG, 0, 0);
  ctx.restore(); T0();
}
