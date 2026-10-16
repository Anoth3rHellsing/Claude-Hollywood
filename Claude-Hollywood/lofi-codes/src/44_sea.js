/* =====================================================================
   EL MAR AL ATARDECER · el mismo motor en perspectiva: muelle de tablas (suelo que se repite), barandilla,
   banco, farol que se enciende, el auto aparcado, y delante el mar hasta el horizonte:
   cielo de atardecer pintado una vez, sol que baja (vivo), estela de brillos, olas, faro, gaviotas, estrellas
   ===================================================================== */
const SEA = { rail: 720, bench: 560, x0: -2400, x1: 2400 };
const SUN0 = 156, SUN1 = 211;
let SSKY = null, PIERF = null, SCLIFF = null;
function seaInit() {
  /* cielo de atardecer (más alto que la pantalla, para poder mover la cámara) */
  { const w = 1800, h = 1500, c = mk(w, h), g = c.getContext('2d'), r = mulberry32(17);
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgb(64,74,128)'); gr.addColorStop(.35, 'rgb(150,120,160)'); gr.addColorStop(.62, 'rgb(236,150,128)'); gr.addColorStop(.8, 'rgb(252,190,120)'); gr.addColorStop(1, 'rgb(255,214,150)'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 16; i++) { const x = r() * w, y = h * (.2 + r() * .5), rx = 100 + r() * 260, ry = rx * (.12 + r() * .08); g.globalAlpha = .55; g.fillStyle = y > h * .5 ? 'rgb(255,170,120)' : 'rgb(196,120,150)'; g.fill(pPolys([wob(ellP(x, y, rx, ry, 30), ry * .6, i, .02)])); g.globalAlpha = .45; g.fillStyle = 'rgb(255,226,180)'; g.fill(pPolys([wob(ellP(x, y + ry * .4, rx * .8, ry * .3, 30), ry * .3, i + 7, .02)])); }
    g.globalAlpha = .3; g.globalCompositeOperation = 'multiply'; g.fillStyle = g.createPattern(BLOT, 'repeat'); g.fillRect(0, 0, w, h); SSKY = c; }
  /* muelle: tablas de madera que se repiten cada 1200 en x */
  { const F = { x0: 0, x1: 1200, z0: 150, z1: SEA.rail + 20, d: 1.1 }, w = (F.x1 - F.x0) * F.d, h = (F.z1 - F.z0) * F.d, c = mk(w, h), g = c.getContext('2d');
    g.setTransform(F.d, 0, 0, F.d, 0, -F.z0 * F.d); g.fillStyle = 'rgb(70,50,40)'; g.fillRect(0, F.z0, 1200, F.z1 - F.z0);
    for (let z = F.z0; z < F.z1; z += 26) { let x = -hsh(z, 1) * 300; while (x < 1200) { const L = 260 + hsh(x, z) * 360; wcWash(g, rectP(x + 1, z + 1, L - 2, 23), mixc([166, 116, 80], [128, 90, 66], hsh(x * .3, z * .2)), .96, { reserve: false, mode: 'source-over', amt: .6, seed: x + z, step: 30, edgeA: .4 }); g.fillStyle = 'rgba(40,28,22,.6)'; g.fillRect(x + 6, z + 8, 3, 3); g.fillRect(x + L - 10, z + 8, 3, 3); x += L; } }
    wcTex(g, w, h, .4, .3); PIERF = { ...F, c }; }
  /* acantilados lejanos con el faro (perfil a contraluz) */
  { const S = spr([-3000, -700, 3000, 10], .5), g = S.g;
    const L = [[-3000, 0], [-3000, -260], [-2400, -380], [-1900, -300], [-1500, -120], [-1200, 0]], R = [[1300, 0], [1500, -160], [1900, -330], [2500, -420], [3000, -380], [3000, 0]];
    for (const P of [L, R]) wcWash(g, dens(P, 30), [112, 84, 104], .92, { reserve: false, mode: 'source-over', amt: 6, seed: P[1][0], step: 20 });
    wcWash(g, rectP(2140, -660, 50, 260), [236, 226, 214], .95, { reserve: false, mode: 'source-over', amt: .6, seed: 4, step: 10 }); for (let k = 0; k < 3; k++) wcWash(g, rectP(2140, -620 + k * 80, 50, 26), [176, 64, 60], .9, { reserve: false, mode: 'source-over', amt: .4, seed: k, step: 10 });
    wcWash(g, rectP(2130, -700, 70, 44), [60, 50, 60], .95, { reserve: false, mode: 'source-over', amt: .4, seed: 9, step: 10 });
    SCLIFF = S; }
}
const sunY = t => lerp(-300, 40, sm((t - SUN0) / (SUN1 - SUN0)));   // en unidades de pantalla (cámara de referencia)
const dusk = t => sm((t - 192) / 18);                                // oscurece hacia el final
function seaFloorStrips(n = 90) {
  const F = PIERF; if (CAM.y >= 0) return;
  const za = Math.max(F.z0, CAM.z + 30), zb = F.z1, ya = Math.min(530, PJ(0, 0, za)[1]), yb = Math.max(-530, PJ(0, 0, zb)[1]); if (ya <= yb) return;
  for (let i = 0; i < n; i++) { const y0 = lerp(yb, ya, i / n), y1 = lerp(yb, ya, (i + 1) / n); if (y1 < -520 || y0 > 520) continue;
    const z0 = floorZAt(y0), z1 = floorZAt(y1), zm = floorZAt((y0 + y1) / 2), s = PS(zm), xL = CAM.x + (-SW / 2 - 4 - CAM.tx) / s, xR = CAM.x + (SW / 2 + 4 - CAM.tx) / s;
    const sy = Math.max(0, (z1 - F.z0) * F.d), sh = Math.max(.5, Math.min((z0 - z1) * F.d, F.c.height - sy));
    for (let k = Math.floor(xL / 1200); k * 1200 < xR; k++) { const a = Math.max(xL, k * 1200), b = Math.min(xR, (k + 1) * 1200); if (b <= a) continue; ctx.drawImage(F.c, (a - k * 1200) * F.d, sy, (b - a) * F.d, sh, (a - CAM.x) * s + CAM.tx, y0, (b - a) * s + .6, y1 - y0 + 1.2); } }
}
function drawSea(t, o = {}) {
  lightsBegin(); T0();
  const hy = PJ(0, 0, 1e7)[1], dk = dusk(t);
  /* cielo (se desplaza un poco con la cámara) */
  ctx.fillStyle = 'rgb(64,74,128)'; ctx.fillRect(-SW, -700, SW * 2, 1400); ctx.drawImage(SSKY, -SW / 2 - 40 - CAM.x * .02, hy - 1200, SW + 80, 1300);
  /* estrellas al final */
  if (dk > .01) { ctx.fillStyle = `rgba(255,250,236,${.8 * dk})`; for (let i = 0; i < 90; i++) { const x = -SW / 2 + hsh(i, 1) * SW, y = -500 + hsh(i, 2) * (hy + 420); if (Math.sin(t * 2 + i) > -.3) ctx.fillRect(x, y, 2.2, 2.2); } }
  /* sol que baja y se esconde en el horizonte */
  const sx = 120 - CAM.x * .02, sy = hy + sunY(t) - 40;
  ctx.save(); ctx.beginPath(); ctx.rect(-SW, -600, SW * 2, hy + 600); ctx.clip();
  const sg = ctx.createRadialGradient(sx, sy, 30, sx, sy, 520); sg.addColorStop(0, `rgba(255,236,190,${.9 - dk * .5})`); sg.addColorStop(.2, `rgba(255,190,120,${.5 - dk * .3})`); sg.addColorStop(1, 'rgba(255,190,120,0)'); ctx.fillStyle = sg; ctx.fillRect(-SW, -600, SW * 2, 1200);
  ctx.fillStyle = 'rgb(255,244,214)'; ctx.beginPath(); ctx.arc(sx, sy, 58, 0, TAU); ctx.fill(); ctx.restore();
  /* acantilados y faro (con su luz) */
  const cs = PS(9000) * 4.2, cp = PJ(0, 0, 9000); ctx.drawImage(SCLIFF.c, cp[0] + SCLIFF.box[0] * cs, hy + SCLIFF.box[1] * cs, (SCLIFF.box[2] - SCLIFF.box[0]) * cs, (SCLIFF.box[3] - SCLIFF.box[1]) * cs);
  const lh = [cp[0] + 2165 * cs, hy - 680 * cs], beam = sm((t - 190) / 2);
  if (beam > .01) { const a = t * .9; ctx.save(); ctx.globalCompositeOperation = 'screen'; for (const sg2 of [1, -1]) { const dx = Math.cos(a) * sg2, g2 = ctx.createLinearGradient(lh[0], lh[1], lh[0] + dx * 700, lh[1]); g2.addColorStop(0, `rgba(255,236,180,${.5 * beam * Math.abs(dx)})`); g2.addColorStop(1, 'rgba(255,236,180,0)'); ctx.fillStyle = g2; ctx.beginPath(); ctx.moveTo(lh[0], lh[1]); ctx.lineTo(lh[0] + dx * 700, lh[1] - 40); ctx.lineTo(lh[0] + dx * 700, lh[1] + 40); ctx.closePath(); ctx.fill(); } ctx.restore(); LGF(lh[0], lh[1], 60, '255,226,160', .9 * beam); }
  /* el mar: del horizonte al muelle, bandas que reflejan el cielo */
  const yNear = PJ(0, 0, SEA.rail + 40)[1], gr = ctx.createLinearGradient(0, hy, 0, Math.max(hy + 10, yNear)); gr.addColorStop(0, cssc(mixc([226, 160, 140], [70, 70, 110], dk))); gr.addColorStop(.25, 'rgb(150,110,130)'); gr.addColorStop(1, 'rgb(60,72,104)');
  ctx.fillStyle = gr; ctx.fillRect(-SW, hy, SW * 2, Math.max(0, yNear - hy) + 600);
  /* estela del sol: rayitas que brillan bajo el sol */
  const P = new Path2D(); for (let i = 0; i < 160; i++) { const u = hsh(i, 1), y = hy + 2 + Math.pow(u, 1.6) * Math.max(0, yNear - hy), spread = 18 + (y - hy) * .45, x = sx + (hsh(i, 2) - .5) * spread * 2, on = Math.sin(t * 2.6 + i * 1.3); if (on < .1) continue; const w = (6 + (y - hy) * .08) * (.5 + hsh(i, 3)); P.rect(x - w / 2, y, w, 1.6 + (y - hy) * .006); }
  ctx.fillStyle = `rgba(255,232,180,${.85 - dk * .4})`; ctx.fill(P);
  /* olas: trazos claros y oscuros que avanzan (sin estado) */
  for (let i = 0; i < 60; i++) { const zz = 900 + Math.pow(hsh(i, 4), 2) * 9000, ph = ((t * .08 + hsh(i, 5)) % 1), z = zz - ph * 300, x = CAM.x + (hsh(i, 6) - .5) * 2.4 * (z - CAM.z), p = PJ(x, 0, z), s = PS(z), L = (60 + hsh(i, 7) * 120) * s; if (p[1] < hy || p[1] > yNear) continue; ctx.strokeStyle = i % 2 ? `rgba(250,220,190,${.35 * Math.sin(ph * PI)})` : `rgba(40,44,70,${.25 * Math.sin(ph * PI)})`; ctx.lineWidth = Math.max(.6, 2.4 * s); ctx.beginPath(); ctx.moveTo(p[0] - L, p[1]); ctx.quadraticCurveTo(p[0], p[1] - 3 * s, p[0] + L, p[1]); ctx.stroke(); }
  /* gaviotas */
  for (let i = 0; i < 5; i++) { const per = 16 + i * 3, ph = ((t + i * 5.3) % per) / per, x = lerp(-SW / 2 - 100, SW / 2 + 100, ph) * (i % 2 ? 1 : -1), y = -300 + i * 50 + Math.sin(t * .8 + i) * 30, cell = Math.max(1, Math.round(H / 260)); spBlit(gridCanvas('gl' + (Math.floor(t * 4 + i) % 2), GULL[Math.floor(t * 4 + i) % 2]), W / 2 + x * U, H / 2 + y * U, cell, { flip: i % 2 === 0 }); }
  T0();
  /* muelle */
  seaFloorStrips();
  if (o.floorFx) o.floorFx(t);
  T0();
  const L = [], put = (z, f) => L.push([z, f]);
  /* barandilla */
  put(SEA.rail, () => { for (let x = Math.floor((CAM.x - 2400) / 140) * 140; x < CAM.x + 2400; x += 140) { const a = PJ(x, 0, SEA.rail), b = PJ(x, -95, SEA.rail), s = PS(SEA.rail); ctx.fillStyle = 'rgb(84,58,44)'; ctx.fillRect(a[0] - 5 * s, b[1], 10 * s, a[1] - b[1]); } const l = PJ(CAM.x - 2600, -95, SEA.rail), r = PJ(CAM.x + 2600, -95, SEA.rail), s = PS(SEA.rail); ctx.fillStyle = 'rgb(108,76,56)'; ctx.fillRect(l[0], l[1] - 6 * s, r[0] - l[0], 10 * s); ctx.fillRect(l[0], l[1] + 40 * s, r[0] - l[0], 6 * s); });
  /* banco */
  put(SEA.bench + 30, () => { const s = PS(SEA.bench); for (const [dy, dz] of [[-42, 0], [-46, 12], [-50, 24]]) { const a = PJ(-110, dy, SEA.bench + dz), b = PJ(110, dy, SEA.bench + dz); ctx.fillStyle = 'rgb(150,102,66)'; ctx.fillRect(a[0], a[1], b[0] - a[0], 8 * s); } ctx.fillStyle = cssc(IRON); for (const dx of [-100, 96]) { const p = PJ(dx, 0, SEA.bench + 10), q = PJ(dx, -44, SEA.bench + 10); ctx.fillRect(p[0], q[1], 7 * s, p[1] - q[1]); } });
  /* respaldo (del lado de la cámara: Brote mira al mar) */
  put(SEA.bench - 30, () => { const s = PS(SEA.bench - 30); for (const k of [0, 1, 2]) { const a = PJ(-110, -64 - k * 16, SEA.bench - 30), b = PJ(110, -64 - k * 16, SEA.bench - 30); ctx.fillStyle = 'rgb(136,92,60)'; ctx.fillRect(a[0], a[1], b[0] - a[0], 9 * s); } ctx.fillStyle = cssc(IRON); for (const dx of [-100, 96]) { const p = PJ(dx, 0, SEA.bench - 30), q = PJ(dx, -110, SEA.bench - 30); ctx.fillRect(p[0], q[1], 7 * s, p[1] - q[1]); } });
  /* farol que se enciende */
  put(600, () => cityLamp(-300, 600, t, sm((t - 193) / 1.5)));
  /* árbol de primer plano a la izquierda */
  put(320, () => { const T = CTREES[2], z = 320, s = PS(z), p = PJ(-980, 0, z); if (z - CAM.z < 40) return; ctx.save(); ctx.translate(p[0], p[1]); ctx.transform(s * 1.5, 0, -(.02 * Math.sin(t * .8)) * s, s * 1.5, 0, 0); ctx.drawImage(T.c, T.box[0], T.box[1], T.box[2] - T.box[0], T.box[3] - T.box[1]); ctx.restore(); });
  if (o.items) o.items(put, t);
  L.sort((a, b) => b[0] - a[0]);
  for (const [, f] of L) { f(); T0(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; }
  if (o.fx) o.fx(t);
  /* el anochecer: un velo azul (las luces quedan encima) */
  if (dk > .01) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = dk * .55; ctx.fillStyle = 'rgb(90,96,150)'; ctx.fillRect(0, 0, W, H); ctx.restore(); T0(); }
  T0(); lightsComp(1); T0();
}
