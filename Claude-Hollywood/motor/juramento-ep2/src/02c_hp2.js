/* =====================================================================
   ESCENARIOS NUEVOS (v2): torneo, biblioteca, patio nevado, puerta de Joy,
   carta medio quemada, manos con el hilo rojo, mapas de transición
   ===================================================================== */

function genTournament(s0) {
  seed(s0);
  const sp = Spr(-1100, -560, 1100, 560, .6), g = sp.g, ink2 = '22,20,24';
  wash(g, rectP(-1140, -600, 1140, 600, 1), '50,42,44', { layers: 12, alpha: .12, amt: .06 });
  // estandartes de colores de casa (rectángulos lisos) colgando del muro
  const cols = ['176,40,44', '56,92,176', '40,140,84', '200,160,60'];
  for (let i = 0; i < 8; i++) { const x = -900 + i * 255; solid(g, [[x - 34, -520], [x + 34, -520], [x + 34, -230], [x, -195], [x - 34, -230]], cols[i % 4], .14, 7); }
  // gradas con público (siluetas)
  for (const [y0, sc, al] of [[-60, .7, .16], [40, .85, .2], [140, 1, .24]]) {
    solid(g, rectP(-1140, y0, 1140, y0 + 18), ink2, al, 4);
    for (let x = -1100; x < 1100; x += rnd(22, 32) * sc) { if (Math.abs(x) < 330 && y0 > 100) continue; const h = rnd(30, 42) * sc; solid(g, [[x - 9 * sc, y0], [x - 8 * sc, y0 - h * .55], [x, y0 - h * .65], [x + 8 * sc, y0 - h * .55], [x + 9 * sc, y0]], ink2, al * .9, 3); fCircG(g, x, y0 - h * .8, 6.2 * sc, ink2, al * 1.3); }
  }
  // tarima de duelo
  solid(g, rectP(-320, 250, 320, 300), '40,34,34', .2, 6);
  for (let k = 0; k < 3; k++) solid(g, rectP(-340 - k * 20, 300 + k * 12, 340 + k * 20, 312 + k * 12), ink2, .2, 4);
  wash(g, rectP(-1140, 330, 1140, 600, .5), '30,26,28', { layers: 10, alpha: .14, amt: .1 });
  granulate(sp, .22);
  return sp;
}
function genBoard(s0) { // tablón con nombres del torneo
  seed(s0);
  const sp = Spr(-120, -150, 120, 150, 1), g = sp.g;
  wash(g, rectP(-110, -140, 110, 140, .2), '70,50,36', { layers: 10, alpha: .16, amt: .03 });
  wash(g, rectP(-96, -126, 96, 126, .2), '226,212,184', { layers: 10, alpha: .2, amt: .03 });
  g.fillStyle = 'rgba(40,30,30,.85)'; g.font = `italic 26px ${HANDF}`; g.textAlign = 'center';
  g.fillText('Torneo de', 0, -88); g.fillText('varitas cruzadas', 0, -60);
  g.font = `22px ${HANDF}`; ['Joy', 'Damien', 'Hollis', 'Vane', 'Corrigan'].forEach((n, i) => g.fillText(n, 0, -16 + i * 30));
  return sp;
}
function genLibrary(s0) {
  seed(s0);
  const sp = Spr(-1100, -560, 1100, 560, .6), g = sp.g, ink2 = '20,18,20';
  wash(g, rectP(-1140, -600, 1140, 600, 1), '46,38,34', { layers: 12, alpha: .12, amt: .06 });
  g.save(); g.globalCompositeOperation = 'destination-out'; polyPath(g, arch(0, -60, 220, 480, 18)); g.fill(); g.restore();
  g.strokeStyle = 'rgba(20,18,20,.9)'; g.lineWidth = 8; polyPath(g, arch(0, -60, 220, 480, 18)); g.stroke(); g.lineWidth = 3; g.beginPath(); g.moveTo(0, -60); g.lineTo(0, -470); for (let y = -120; y > -430; y -= 75) { g.moveTo(-110, y); g.lineTo(110, y); } g.stroke();
  for (const [x0, x1, d] of [[-1100, -330, 1], [330, 1100, 1]]) {
    solid(g, rectP(x0, -520, x1, 330), ink2, .2, 8);
    for (let sh = -500; sh < 300; sh += 92) { let x = x0 + 20; while (x < x1 - 20) { const w = rnd(9, 20), h = rnd(52, 80); solid(g, rectP(x, sh + 84 - h, x + w, sh + 84), pick(['72,42,34', '40,52,46', '64,52,30', '34,34,46', '80,62,44']), .22, 3); x += w + rnd(1, 3); } solid(g, rectP(x0 + 10, sh + 84, x1 - 10, sh + 92), ink2, .3, 3); }
  }
  // escalera apoyada
  g.strokeStyle = 'rgba(30,24,22,.85)'; g.lineWidth = 5; g.beginPath(); g.moveTo(-480, 330); g.lineTo(-420, -300); g.moveTo(-420, 330); g.lineTo(-360, -300); g.stroke(); g.lineWidth = 3; g.beginPath(); for (let y = 280; y > -280; y -= 50) { const f = (330 - y) / 630; g.moveTo(-480 + f * 60, y); g.lineTo(-420 + f * 60, y); } g.stroke();
  // mesa larga
  solid(g, rectP(-320, 170, 340, 186), ink2, .26, 5); solid(g, rectP(-300, 186, -284, 330), ink2, .26, 3); solid(g, rectP(306, 186, 322, 330), ink2, .26, 3);
  wash(g, rectP(-1140, 330, 1140, 600, .5), '30,24,22', { layers: 10, alpha: .15, amt: .1 });
  granulate(sp, .22);
  return sp;
}
function genSnowCourt(s0) {
  seed(s0);
  const sp = Spr(-1150, -560, 1150, 560, .6), g = sp.g, ink2 = '26,28,38';
  wash(g, rectP(-1190, -600, 1190, 600, 1), '58,62,82', { layers: 12, alpha: .1, amt: .06 });
  g.save(); g.globalCompositeOperation = 'destination-out'; for (let x = -900; x <= 900; x += 360) { polyPath(g, arch(x, 230, 200, 470, 16)); g.fill(); } g.restore();
  g.strokeStyle = 'rgba(26,28,38,.85)'; g.lineWidth = 7; for (let x = -900; x <= 900; x += 360) { polyPath(g, arch(x, 230, 200, 470, 16)); g.stroke(); }
  for (let x = -1080; x <= 1080; x += 360) solid(g, rectP(x - 28, -300, x + 28, 240), ink2, .2, 6);
  // nieve acumulada (blanco papel por encima, se pinta con destination-out → deja ver el papel)
  g.save(); g.globalCompositeOperation = 'destination-out';
  for (let x = -1080; x <= 1080; x += 360) { g.beginPath(); g.ellipse(x, -300, 40, 9, 0, 0, TAU); g.fill(); }
  const pts = []; for (let x = -1190; x <= 1190; x += 30) pts.push([x, 300 - Math.abs(FBM(x * .006, 2, 3)) * 30]); pts.push([1190, 640], [-1190, 640]);
  polyPath(g, pts); g.fill(); g.restore();
  wash(g, pts.map(p => [p[0], p[1] + 8, .5]), '170,176,196', { layers: 8, alpha: .06, amt: .1 });
  granulate(sp, .2);
  return sp;
}
function genDoorRoom(s0) {
  seed(s0);
  const sp = Spr(-1000, -560, 1000, 560, .6), g = sp.g, ink2 = '24,20,22';
  wash(g, rectP(-1040, -600, 1040, 600, 1), '52,42,40', { layers: 12, alpha: .12, amt: .06 });
  solid(g, arch(220, 330, 200, 470, 14), '40,30,26', .22, 8);
  g.strokeStyle = 'rgba(24,20,22,.8)'; g.lineWidth = 2; for (let k = -2; k <= 2; k++) { g.beginPath(); g.moveTo(220 + k * 36, 330); g.lineTo(220 + k * 36, -40 + Math.abs(k) * 20); g.stroke(); }
  fCircG(g, 290, 150, 6, '160,130,70', .8);
  solid(g, rectP(-700, 120, -420, 140), ink2, .26, 4); solid(g, rectP(-690, 140, -676, 330), ink2, .26, 3); solid(g, rectP(-444, 140, -430, 330), ink2, .26, 3);
  wash(g, rectP(-1040, 330, 1040, 600, .5), '30,24,22', { layers: 10, alpha: .15, amt: .1 });
  granulate(sp, .22);
  return sp;
}
function genBurntLetter(s0) {
  seed(s0);
  const sp = Spr(-330, -230, 330, 230, 1), g = sp.g;
  wash(g, rectP(-300, -200, 300, 200, .2), '236,224,198', { layers: 12, alpha: .22, amt: .03 });
  g.fillStyle = 'rgba(160,110,60,.15)'; g.fillRect(-300, -200, 600, 400);
  const L = [['Joy:', 40, -230, -110], ['nunca fui yo.', 46, -200, -30], ['Fue Damien.', 46, -150, 50], ['— A.', 40, 60, 130]];
  for (const [s, z, x, y] of L) { const t = genScript(s, z, 300 + x, '40,28,30'); g.drawImage(t.c, x, y - t.c.height * .5, t.c.width, t.c.height); }
  // borde quemado: quitamos papel desde abajo-derecha con ruido y oscurecemos el borde
  const ed = []; for (let x = -320; x <= 320; x += 8) ed.push([x, 120 + x * .25 + FBM(x * .02, 4, 3) * 50]);
  g.save(); g.globalCompositeOperation = 'destination-out'; polyPath(g, ed.concat([[330, 260], [-330, 260]])); g.fill(); g.restore();
  g.save(); g.globalCompositeOperation = 'source-atop'; g.strokeStyle = 'rgba(60,24,10,.85)'; g.lineWidth = 14; g.filter = 'blur(4px)'; g.beginPath(); ed.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.stroke(); g.filter = 'none'; g.restore();
  granulate(sp, .15);
  return sp;
}
function handPath(dir = 1) { // mano y muñeca estilizadas, apuntando hacia arriba
  const P = new Path2D();
  sPoly(P, [[-16, 200], [-17, 40], [-22, -20], [-14, -60], [14, -60], [24, -16], [18, 40], [16, 200]]);
  [[-14, -58, -18, -120], [-4, -60, -5, -138], [6, -60, 8, -132], [15, -54, 20, -108]].forEach(([x0, y0, x1, y1]) => cap(P, [x0, y0], [x1, y1], 5.2, 4.2));
  cap(P, [20 * dir, -20], [40 * dir, -62], 6, 4.6);
  return P;
}
/* mapas de transición en espacio de pantalla (sangrado de tinta entre escenas) */
function makeTrans(kind, s0) {
  const w = Math.ceil(W / 6), h = Math.ceil(H / 6), t = new Float32Array(w * h); let mn = 1e9, mx = -1e9;
  const cx = w * (.35 + (s0 % 3) * .15), cy = h * (.45 + (s0 % 2) * .1);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    let d;
    if (kind === 'bleed') d = Math.hypot(i - cx, j - cy) / w;
    else if (kind === 'sweep') d = i / w + j / h * .25;
    else d = j / h + Math.abs(i / w - .5) * .3;
    const v = d + FBM(i * .045 + s0 * 7.1, j * .045 + s0 * 3.3, 4) * .42; t[j * w + i] = v; if (v < mn) mn = v; if (v > mx) mx = v;
  }
  for (let k = 0; k < t.length; k++) t[k] = (t[k] - mn) / (mx - mn);
  const m = mk(w, h), r = mk(w, h);
  return { t, w, h, m, mg: m.getContext('2d'), r, rg: r.getContext('2d'), img: m.getContext('2d').createImageData(w, h), rimg: r.getContext('2d').createImageData(w, h) };
}
function transMask(tr, p) {
  const S = .12, T = p * (1 + S * 1.5) - S * .5, md = tr.img.data, rd = tr.rimg.data, t = tr.t;
  for (let k = 0, j = 0; k < t.length; k++, j += 4) {
    const a = clamp((T - t[k]) / S); md[j + 3] = a * 255;
    rd[j] = 24; rd[j + 1] = 20; rd[j + 2] = 22; const ring = a > 0 && a < 1 ? a * (1 - a) * 4 : 0; rd[j + 3] = ring * 150;
  }
  tr.mg.putImageData(tr.img, 0, 0); tr.rg.putImageData(tr.rimg, 0, 0);
}
