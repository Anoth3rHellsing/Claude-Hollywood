/* =====================================================================
   ESCENARIOS · EL MUNDO EN PERSPECTIVA VIVA (estándar desde «Entre el Vapor y el Bit»)
   Un solo contrato para todos los mapas, compatible con el Invernadero:
     x a lo ancho (izq → der) · y hacia abajo (suelo = 0) · z profundidad desde la cámara · 1 unidad ≈ 1 cm.
     PJ(x, y, z) → pantalla (unidades: alto = 1000, origen al centro). CAM = {x, y, z, zoom, tx, ty}.
   Toda superficie es una TEXTURA PINTADA UNA VEZ puesta en un rectángulo 3D:
     vplane(T, [xa,za], [xb,zb], yTop, yBot)  · pared / puerta / frente de mueble (vertical, cualquier orientación)
     hplane(T, x0, x1, z0, z1, y)            · suelo, techo, sobre de mesa (horizontal)
     box3({x0,x1,y0,y1,z0,z1}, caras)        · mueble con las caras que la cámara ve
   y todo lo que tiene profundidad se ordena junto en la lista put(z, f) → flush().
   ===================================================================== */
const FOC = 1155;
const CAM = { x: 0, y: -150, z: 0, zoom: 1, tx: 0, ty: 0 };
function camSet(o) { CAM.x = o.x ?? 0; CAM.y = o.y ?? -150; CAM.z = o.z ?? 0; CAM.zoom = o.zoom ?? 1; CAM.tx = o.tx ?? 0; CAM.ty = o.ty ?? 0; }
const PS = z => FOC * CAM.zoom / Math.max(6, z - CAM.z);
const PJ = (x, y, z) => { const s = PS(z); return [(x - CAM.x) * s + CAM.tx, (y - CAM.y) * s + CAM.ty]; };
const hsh = (a, b = 0) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
/* pantalla (unidades) → px de dispositivo */
const toPx = p => [p[0] * U + W / 2 + SHX, p[1] * U + H / 2 + SHY];
const pj3 = pts => pts.map(p => PJ(p[0], p[1], p[2]));
/* recorta un polígono 3D contra el plano cercano (z > CAM.z + near) */
function clipNear(pts, near = 8) {
  const zc = CAM.z + near, o = [];
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length], ia = a[2] >= zc, ib = b[2] >= zc;
    if (ia) o.push(a); if (ia !== ib) { const t = (zc - a[2]) / (b[2] - a[2]); o.push([lerp(a[0], b[0], t), lerp(a[1], b[1], t), zc]); } }
  return o;
}
function poly3(pts) { const q = clipNear(pts); if (q.length < 3) return null; return pPolys([pj3(q)]); }

/* ---------- lista de profundidad ---------- */
let DLIST = [];
const put = (z, f) => DLIST.push([z, f]);
function flush() { DLIST.sort((a, b) => b[0] - a[0]); const L = DLIST; DLIST = []; for (const [, f] of L) { f(); T0(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none'; } }

/* ---------- texturas: un lienzo que cubre w × h unidades de mundo ---------- */
function tex(w, h, d = 1.3) { const c = mk(w * d, h * d), g = c.getContext('2d'); g.setTransform(d, 0, 0, d, 0, 0); return { c, g, w, h, d }; }
/* pega una tira de la textura (u0..u1, v0..v1 en 0–1) en el paralelogramo p0 (arriba-izq), p1 (arriba-der), p2 (abajo-izq) */
function texStrip(T, u0, u1, v0, v1, p0, p1, p2, ov = .6) {
  const sw = T.c.width, sh = T.c.height, sx = u0 * sw, sy = v0 * sh, w = Math.max(.5, (u1 - u0) * sw), h = Math.max(.5, (v1 - v0) * sh);
  ctx.save(); ctx.transform((p1[0] - p0[0]) / w, (p1[1] - p0[1]) / w, (p2[0] - p0[0]) / h, (p2[1] - p0[1]) / h, p0[0], p0[1]);
  ctx.drawImage(T.c, sx, sy, Math.min(w + ov, sw - sx), Math.min(h + ov, sh - sy), 0, 0, Math.min(w + ov, sw - sx), Math.min(h + ov, sh - sy));
  ctx.restore();
}
/* pared vertical entre dos puntos del suelo a (izq) y b (der); la textura va de a a b y de yTop a yBot */
function vplane(T, a, b, y0, y1, o = {}) {
  const u0 = o.u0 ?? 0, u1 = o.u1 ?? 1, v0 = o.v0 ?? 0, v1 = o.v1 ?? 1, flat = Math.abs(a[1] - b[1]) < .5, n = o.n ?? (flat ? 1 : 40);
  if (o.a !== undefined) ctx.globalAlpha = o.a;
  for (let i = 0; i < n; i++) {
    const f0 = i / n, f1 = (i + 1) / n, xa = lerp(a[0], b[0], f0), za = lerp(a[1], b[1], f0), xb = lerp(a[0], b[0], f1), zb = lerp(a[1], b[1], f1);
    if (Math.min(za, zb) - CAM.z < 8) continue;
    const p0 = PJ(xa, y0, za), p1 = PJ(xb, y0, zb), p2 = PJ(xa, y1, za);
    if (Math.max(p0[0], p1[0]) < -SW / 2 - 2 || Math.min(p0[0], p1[0]) > SW / 2 + 2) continue;
    texStrip(T, lerp(u0, u1, f0), lerp(u0, u1, f1), v0, v1, p0, p1, p2);
  }
  ctx.globalAlpha = 1;
}
/* plano horizontal a la altura y; la textura: u a lo largo de x (x0→x1), v desde el fondo (z1, arriba de la imagen) al frente (z0) */
function hplane(T, x0, x1, z0, z1, y, o = {}) {
  const dy = y - CAM.y; if (Math.abs(dy) < .5) return;
  const zn = Math.max(z0, CAM.z + 12); if (zn >= z1) return;
  const Ya = PJ(0, y, z1)[1], Yb = PJ(0, y, zn)[1], n = o.n ?? Math.max(4, Math.min(140, Math.ceil(Math.abs(Yb - Ya) / 9)));
  const zOf = Y => CAM.z + dy * FOC * CAM.zoom / (Y - CAM.ty);
  if (o.a !== undefined) ctx.globalAlpha = o.a;
  for (let i = 0; i < n; i++) {
    const Y0 = lerp(Ya, Yb, i / n), Y1 = lerp(Ya, Yb, (i + 1) / n); if (Math.max(Y0, Y1) < -520 || Math.min(Y0, Y1) > 520) continue;
    const za = clamp(zOf(Y0), zn, z1), zb = clamp(zOf(Y1), zn, z1), sa = PS(za), sb = PS(zb), Xr = SW / 2 + 6 - CAM.tx;
    /* la tira es un paralelogramo: el borde derecho del lado cercano se queda corto; se estira para cubrir la pantalla */
    const xl = Math.max(x0, CAM.x + (-SW / 2 - 6 - CAM.tx) / Math.min(sa, sb)), xr = Math.min(x1, Math.max(CAM.x + Xr / sa, xl + (Xr - (xl - CAM.x) * sb) / sa)); if (xr <= xl) continue;
    /* el ancho se toma del borde cercano (el más largo): así dos trozos de suelo contiguos se solapan un poco en vez de dejar triángulos vacíos */
    const p0 = PJ(xl, y, za), p2 = PJ(xl, y, zb), q = PJ(xr, y, zb), p1 = [p0[0] + Math.max(q[0] - p2[0], PJ(xr, y, za)[0] - p0[0]), p0[1]];
    texStrip(T, (xl - x0) / (x1 - x0), (xr - x0) / (x1 - x0), (z1 - za) / (z1 - z0), (z1 - zb) / (z1 - z0), p0, p1, p2, .8);
  }
  ctx.globalAlpha = 1;
}
/* mueble: caja con caras (cada cara: textura {c..} o color [r,g,b] o función) — solo se dibujan las que se ven */
function box3(B, F = {}) {
  const { x0, x1, y0, y1, z0, z1 } = B;
  const face = (k, draw, pts) => { const f = F[k]; if (!f) return; if (f.c) draw(f); else if (typeof f === 'function') f(pts); else { const P = poly3(pts); if (P) { ctx.fillStyle = cssc(f); ctx.fill(P); } } };
  if (CAM.x < x0 && F.left) face('left', T => vplane(T, [x0, z1], [x0, z0], y0, y1), [[x0, y0, z1], [x0, y0, z0], [x0, y1, z0], [x0, y1, z1]]);
  if (CAM.x > x1 && F.right) face('right', T => vplane(T, [x1, z0], [x1, z1], y0, y1), [[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]]);
  if (CAM.y < y0 && F.top) face('top', T => hplane(T, x0, x1, z0, z1, y0), [[x0, y0, z1], [x1, y0, z1], [x1, y0, z0], [x0, y0, z0]]);
  if (CAM.y > y1 && F.bottom) face('bottom', T => hplane(T, x0, x1, z0, z1, y1), [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]]);
  if (F.front) face('front', T => vplane(T, [x0, z0], [x1, z0], y0, y1), [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]);
}
/* sprite pintado parado en el mundo (billboard): S = spr(...) en unidades de mundo con la base en y = 0 */
function bill(S, x, y, z, o = {}) {
  if (z - CAM.z < 10) return;
  const s = PS(z) * (o.k ?? 1), p = PJ(x, y, z), b = S.box;
  if (p[0] + b[2] * s < -SW / 2 || p[0] + b[0] * s > SW / 2) return;
  if (o.a !== undefined) ctx.globalAlpha = o.a;
  if (o.rot || o.sx) { ctx.save(); ctx.translate(p[0] + (o.px ?? 0) * s, p[1] + (o.py ?? 0) * s); ctx.rotate(o.rot || 0); ctx.scale(o.sx ?? 1, 1); ctx.drawImage(S.c, (b[0] - (o.px ?? 0)) * s, (b[1] - (o.py ?? 0)) * s, (b[2] - b[0]) * s, (b[3] - b[1]) * s); ctx.restore(); }
  else ctx.drawImage(S.c, p[0] + b[0] * s, p[1] + b[1] * s, (b[2] - b[0]) * s, (b[3] - b[1]) * s);
  ctx.globalAlpha = 1;
}
/* recorte de pantalla a un polígono 3D (para pintar luz o sombra solo en una cara) */
function clip3(pts) { const P = poly3(pts); if (!P) return false; ctx.clip(P); return true; }
/* sprite reflejado bajo su base (charcos, estanques, suelos pulidos): o.y = altura del espejo, o.k = escala */
function billMirror(S, x, z, a = .5, o = {}) { const s = PS(z) * (o.k ?? 1), p = PJ(x, o.y || 0, z), b = S.box; if (p[0] + b[2] * s < -SW / 2 || p[0] + b[0] * s > SW / 2) return; ctx.save(); ctx.translate(p[0], p[1]); ctx.scale(1, -1); ctx.globalAlpha = a; ctx.drawImage(S.c, b[0] * s, b[1] * s, (b[2] - b[0]) * s, (b[3] - b[1]) * s); ctx.restore(); }
