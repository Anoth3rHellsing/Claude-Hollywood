/* =====================================================================
   CLAUDE HOLLYWOOD 101 · utilidades comunes (las que el Invernadero tomaba de cine/ y de los efectos)
   ===================================================================== */
const L2 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
function L0s() { ctx.setTransform(U, 0, 0, U, W / 2, H / 2); }
const win = (t, a, b, fi = .4, fo = .4) => Math.min(sm((t - a) / fi), sm((b - t) / fo));
const GRAV = 980;
const dotP = (P, x, y, r) => { P.moveTo(x + r, y); P.arc(x, y, r, 0, TAU); };
const easeOut = f => 1 - Math.pow(1 - clamp(f), 3);
const lin = (a, b, f) => a + (b - a) * clamp(f);
function fullInvert() { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'difference'; ctx.fillStyle = 'rgb(239,230,210)'; ctx.fillRect(0, 0, W, H); ctx.restore(); T0(); }
/* gaussiana acotada (Tyler Hobbs: la varianza por vértice no pasa de ±2) */
function gaussR(r) { let u = 0; for (let i = 0; i < 6; i++) u += r(); return clamp((u - 3) / Math.sqrt(.5), -2, 2) * .5; }
/* texto a mano (Caveat) o de libro (Cormorant) en unidades de escena */
function hand(txt, x, y, size, col, o = {}) { ctx.font = `${o.w || 600} ${size}px ${o.serif ? '"Cormorant Garamond", Georgia, serif' : '"Caveat", "Comic Sans MS", cursive'}`; ctx.textAlign = o.align || 'center'; ctx.textBaseline = o.base || 'alphabetic'; ctx.fillStyle = col; ctx.fillText(txt, x, y); }
