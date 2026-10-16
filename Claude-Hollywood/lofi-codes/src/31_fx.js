/* =====================================================================
   EFECTOS (de Claude Hollywood 101): hojas que caen y en el suelo, rayos de sol, motas, transición de tinta
   ===================================================================== */
let WDT = null;
function windDisp(t) {   // desplazamiento acumulado por el viento (integral de windAt)
  if (!WDT) { WDT = new Float32Array(Math.ceil(FILM.DUR + 5) * 30); let a = 0; for (let i = 0; i < WDT.length; i++) { WDT[i] = a; a += windAt(i / 30) / 30; } }
  const f = clamp(t * 30, 0, WDT.length - 2), i = Math.floor(f); return lerp(WDT[i], WDT[i + 1], f - i);
}
const LEAFC = [[214, 140, 40], [192, 76, 34], [226, 112, 40], [170, 52, 36], [236, 180, 64], [150, 96, 40]];
/* una hoja de otoño (forma de gota con nervio) en px de pantalla-unidad */
function leafShape(P, x, y, r, a, flip) {
  const c = Math.cos(a), s = Math.sin(a), q = (u, v) => [x + (u * c - v * s), y + (u * s + v * c)];
  const p0 = q(-r, 0), p1 = q(r, 0), c1 = q(0, -r * .62 * flip), c2 = q(0, r * .62 * flip);
  P.moveTo(...p0); P.quadraticCurveTo(...c1, ...p1); P.quadraticCurveTo(...c2, ...p0);
}
/* hojas que caen detrás y delante del vidrio; con el muro roto, una corriente entra por el hueco */
function leavesFall(t, k = 1, zMin = 300, zMax = 1500) {
  const wd = windDisp(t) * 260, buckets = LEAFC.map(() => new Path2D());
  const n = Math.round(90 * k);
  for (let i = 0; i < n; i++) {
    const z = zMin + hsh(i, 1) * (zMax - zMin); if (z - CAM.z < 40) continue;
    const per = 9 + hsh(i, 2) * 7, ph = ((t + hsh(i, 3) * per) % per) / per, span = 3200;
    const x = ((hsh(i, 4) * span + wd + ph * 160 + Math.sin(t * .8 + i) * 50) % span + span) % span - span / 2 + CAM.x * .7;
    const y = lerp(-900, 10, ph) + Math.sin(t * 1.7 + i * 2.1) * 26;
    if (y > 0) continue;
    const p = PJ(x, y, z), s = PS(z); if (p[0] < -SW / 2 - 40 || p[0] > SW / 2 + 40 || p[1] < -540 || p[1] > 540) continue;
    const spin = t * (1.4 + hsh(i, 5) * 2) + i, flip = Math.sin(spin) > 0 ? 1 : -1;
    leafShape(buckets[i % LEAFC.length], p[0], p[1], (6 + hsh(i, 6) * 5) * s, spin * .7, flip * Math.max(.25, Math.abs(Math.sin(spin))));
  }
  buckets.forEach((P, j) => { ctx.fillStyle = cssc(LEAFC[j], .88); ctx.fill(P); });
  /* por el hueco del muro entra una corriente de hojas (desde el derrumbe) */
  if (false) {
    const P = new Path2D(), age = t - T_WALL;
    for (let i = 0; i < 46; i++) {
      const t0 = hsh(i, 9) * 9, per = 7 + hsh(i, 8) * 4, ph = ((age + t0) % per) / per; if (age + t0 < t0 + .4 && age < 1) continue;
      const x = 300 + hsh(i, 7) * 600 + ph * (200 + 300 * hsh(i, 6)) + Math.sin(t * 2 + i) * 40, z = lerp(1640, 520, ph), y = lerp(-520 + hsh(i, 5) * 300, 0, Math.pow(ph, 1.6)) + Math.sin(t * 2.6 + i) * 30;
      if (z - CAM.z < 40 || y > -2) continue; const p = PJ(x, y, z), s = PS(z), spin = t * 3 + i;
      leafShape(P, p[0], p[1], (6 + hsh(i, 4) * 5) * s, spin, Math.sin(spin) > 0 ? 1 : -.4);
    }
    ctx.fillStyle = 'rgba(208,110,40,.9)'; ctx.fill(P);
  }
}
/* hojas en el suelo: se apartan cuando Aguada pasa cerca (el instante y la dirección se calculan una vez) */
const FLEAVES = [];
function floorLeavesInit() {
  const r = mulberry32(77);
  for (let i = 0; i < 150; i++) { const x = -1300 + r() * 2600, z = 480 + r() * 900; FLEAVES.push({ x, z, a: r() * TAU, c: Math.floor(r() * LEAFC.length), r: 6 + r() * 6, tp: 1e9, d: [0, 0] }); }
  for (let i = 0; i < 40; i++) { const x = -900 + r() * 800, z = 525 + r() * 85; FLEAVES.push({ x, z, a: r() * TAU, c: Math.floor(r() * LEAFC.length), r: 6 + r() * 5, tp: 1e9, d: [0, 0] }); }   // en el camino de Aguada
  for (let t = 0; t < FILM.DUR; t += .05) {
    const A = walkerAt(t); if (!A || A.hide || A.insert || !A.gh) continue;
    for (const L of FLEAVES) { if (L.tp < 1e9) continue; const dx = L.x - A.x, dz = (L.z - A.z) * 2.2; if (Math.hypot(dx, dz) < 44) { L.tp = t; const l = Math.hypot(dx, dz) || 1; L.d = [dx / l * (40 + 30 * hsh(L.x, 1)), dz / l * 12]; } }
  }
}
function floorLeaves(t) {
  const P = LEAFC.map(() => new Path2D());
  for (const L of FLEAVES) {
    if (L.z - CAM.z < 40) continue;
    const f = easeOut((t - L.tp) / .45), x = L.x + L.d[0] * f, z = L.z + L.d[1] * f, p = PJ(x, 0, z), s = PS(z);
    if (p[0] < -SW / 2 - 20 || p[0] > SW / 2 + 20 || p[1] > 540) continue;
    const hop = f > 0 && f < 1 ? Math.sin(f * PI) * 14 * s : 0;
    leafShape(P[L.c], p[0], p[1] - hop, L.r * s, L.a + f * 2, .35);
  }
  P.forEach((Q, j) => { ctx.fillStyle = cssc(shc(LEAFC[j], -.08), .85); ctx.fill(Q); });
}
/* rayos de sol diagonales a través del vidrio (papel levantado, cálido) y motas que flotan dentro */
function sunRays(t, k = 1) {
  ctx.save(); ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < 6; i++) {
    const x = -1500 + i * 560 + Math.sin(t * .05 + i) * 30, a = PJ(x, -620, 1580), b = PJ(x + 150, -620, 1580), c = PJ(x + 150 + 640, 0, 760), d = PJ(x + 640, 0, 760);
    const gr = ctx.createLinearGradient(a[0], a[1], d[0], d[1]); const al = (.07 + .04 * Math.sin(t * .4 + i * 1.7)) * k;
    gr.addColorStop(0, `rgba(255,224,160,${al})`); gr.addColorStop(1, 'rgba(255,224,160,0)');
    ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.lineTo(...c); ctx.lineTo(...d); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
  const P = new Path2D(), wd = windDisp(t) * 60;
  for (let i = 0; i < 140 * k; i++) {
    const z = 420 + hsh(i, 1) * 1000; if (z - CAM.z < 40) continue;
    const x = ((hsh(i, 2) * 2600 + Math.sin(t * .2 + i) * 50 + wd) % 2600 + 2600) % 2600 - 1300 + CAM.x * .3, y = -60 - hsh(i, 3) * 600 + Math.sin(t * .3 + i * 1.3) * 30;
    const p = PJ(x, y, z); if (p[0] < -SW / 2 || p[0] > SW / 2) continue; dotP(P, p[0], p[1], Math.max(.6, (.8 + hsh(i, 4)) * PS(z)));
  }
  ctx.fillStyle = `rgba(255,246,220,${.45 * k})`; ctx.fill(P);
}

/* ---------------- transición de tinta: B aparece sobre A desde un mapa de llegada (centro o barrido) ---------------- */
const WIPE = {};
function wipeMap(key, mode, cx = .5, cy = .5) {
  const w = Math.ceil(W / 6), h = Math.ceil(H / 6), id = key + w + 'x' + h; if (WIPE[id]) return WIPE[id];
  const A = new Float32Array(w * h); let mx = 0;
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const u = i / w, v = j / h, n = FBM(u * 4 + key.length * 3.1, v * 4, 4) * .5 + FBM(u * 13, v * 13 + 7, 3) * .12;
    const d = mode === 'sweep' ? u * .9 + Math.abs(v - .5) * .15 : Math.hypot((u - cx) * 1.6, v - cy);
    const a = d + n * (mode === 'sweep' ? .5 : .6); A[j * w + i] = a; if (a > mx) mx = a;
  }
  let mn = 1e9; for (const a of A) mn = Math.min(mn, a); for (let k = 0; k < A.length; k++) A[k] = (A[k] - mn) / (mx - mn);
  const m = mk(w, h), r = mk(w, h);
  return (WIPE[id] = { A, w, h, m, r, mi: m.getContext('2d').createImageData(w, h), ri: r.getContext('2d').createImageData(w, h) });
}
let BUFA = null, BUFB = null;
function onResize() { BUFA = mk(W, H); BUFB = mk(W, H); }
/* drawA y drawB dibujan en ctx; p de 0 a 1 */
function inkWipe(drawA, drawB, p, key = 'a', mode = 'center', cx, cy) {
  if (p <= 0) { drawA(); return; } if (p >= 1) { drawB(); return; }
  drawA(); BUFA.getContext('2d').drawImage(cv, 0, 0);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  drawB(); const gb = BUFB.getContext('2d'); gb.globalCompositeOperation = 'source-over'; gb.drawImage(cv, 0, 0);
  const M = wipeMap(key, mode, cx, cy), th = p * 1.18 - .09, md = M.mi.data, rd = M.ri.data;
  for (let k = 0; k < M.A.length; k++) { const e = (th - M.A[k]) / .045, a = clamp(e), ring = e > -.3 && e < 1.6 ? Math.exp(-((e - .5) ** 2) * 2.5) : 0; md[k * 4 + 3] = a * 255; rd[k * 4] = 150; rd[k * 4 + 1] = 112; rd[k * 4 + 2] = 76; rd[k * 4 + 3] = ring * 110; }
  M.m.getContext('2d').putImageData(M.mi, 0, 0); M.r.getContext('2d').putImageData(M.ri, 0, 0);
  gb.globalCompositeOperation = 'destination-in'; gb.imageSmoothingEnabled = true; gb.drawImage(M.m, 0, 0, W, H); gb.globalCompositeOperation = 'source-over';
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(BUFA, 0, 0); ctx.drawImage(BUFB, 0, 0);
  ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = .9; ctx.drawImage(M.r, 0, 0, W, H); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; T0();
}
