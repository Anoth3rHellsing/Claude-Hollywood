/* =====================================================================
   ESCENA 3 · CARRERA POR EL PARQUE Y EL INVERNADERO (07:50) — 123,6 a 181 s
   corre por la grava levantando piedras y hojas · sorbo que quema · saluda a Ramiro y sus patitos («Cuac.») ·
   el invernadero se revela enorme · su reflejo corre a su lado panel a panel · el riego empaña los vidrios ·
   sale hacia la cocina
   ===================================================================== */
const S3 = { A: 123.6, END: 181.0 };
/* recorrido de Teo: [t, x, modo] (modo: run, sip, stand, jog) */
const TEO3 = [[123.6, -320, 'run'], [129.4, 1550, 'run'], [130.6, 1700, 'sip'], [131.0, 1760, 'run'], [134.6, 3220, 'run'], [135.0, 3300, 'stop'], [141.4, 3300, 'stand'], [146.6, 4800, 'run'], [152.0, 5420, 'jog'], [160.2, 6700, 'jog'], [161.2, 6790, 'sip'], [166.0, 7600, 'jog'], [170.0, 8500, 'run'], [176.0, 10100, 'run']];
function teoParque(t) {
  const K = TEO3; let i = 0; while (i < K.length - 2 && t >= K[i + 1][0]) i++;
  const [ta, xa, ma] = K[i], [tb, xb] = K[i + 1], u = clamp((t - ta) / (tb - ta)), x = lerp(xa, xb, u), v = (xb - xa) / (tb - ta), base = { clogs: true, top: 'cuaderno', cup: true };
  if (t >= K[K.length - 1][0]) return { hide: true };
  if (ma === 'sip') return { x, y: 0, z: PK.ZT, f: { ...base, sip: true, happy: true, legL: Math.floor(t * 6) % 2 }, sip: true };
  if (ma === 'stop' || ma === 'stand') { const f = { ...base, blink: (t * .4) % 1 < .05 }; if (t > 135.2 && t < 137.6) f.happy = true; if (t > 138.0 && t < 139.3) { f.wide = true; } return { x, y: Math.abs(Math.sin(t * 5)) * (t < 135.6 ? 6 : 0), z: PK.ZT, f, flip: false }; }
  const speedK = clamp(Math.abs(v) / 360, .45, 1.2), hot = t > 130.6 && t < 133.0;
  return { x, y: hot ? Math.abs(Math.sin(t * 14)) * 10 : 0, z: PK.ZT, f: runPose(t, { ...base, wide: hot }, speedK), run: true, k: speedK };
}
/* Ramiro y sus patitos */
function duckAt(t, i) {
  const off = [[0, 0], [-46, 22], [-86, 34]][i], arr = sm(seg(t, 132.6, 136.2)), lea = sm(seg(t, 141.4, 152));
  const x = lerp(3920, 3460, arr) + lerp(0, -900, lea) + off[0] + Math.sin(t * .8 + i) * 6, z = 860 + off[1] + Math.sin(t * .5 + i * 2) * 8;
  const quack = i === 0 && t > 138.0 && t < 138.5;
  return { x, z, f: { quack, chick: i > 0, blink: (t * .3 + i) % 1 < .05 }, k: i ? .55 : 1, flip: lea > .02 && lea < .99, bob: Math.sin(t * 2.2 + i * 1.3) };
}
function duckRings(t) { const o = []; for (let i = 0; i < 3; i++) for (let k = 0; k < 5; k++) { const ts = Math.floor(t / .9) * .9 - k * .9 + i * .3; const D = duckAt(ts, i); o.push([ts, D.x - 20 * (D.flip ? -1 : 1), D.z, i ? .3 : .45]); } o.push([137.0, 3360, 800, .4], [150.2, 2100, 1300, .3], [127.5, 900, 1100, .35]); return o; }
const mistAt = t => sm((t - 158.2) / 4) * (1 - sm((t - 175) / 5));
/* pasos para las piedras y hojas */
let STEPS3 = [];
function steps3Init() { STEPS3 = []; let last = null; for (let t = S3.A; t < S3.END; t += 1 / 60) { const B = teoParque(t); if (!B.run || B.hide) { last = null; continue; } const st = Math.floor(t / (STEP / B.k)); if (last !== null && st !== last) STEPS3.push([t, B.x, B.z + (st % 2 ? 8 : -8), 1]); last = st; } }
/* ---------- la escena en t ---------- */
function drawParque(t, o = {}) {
  lightsBegin(); T0();
  const GH = PK.GH, B = o.teo ? o.teo(t) : teoParque(t), N = !!o.night, DUCK = o.duck || duckAt;
  /* cielo, ciudad lejana y neblina húmeda */
  if (N) nightSky(t); else { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(PKX.sky.c, (-CAM.x * .008 % 200) - 100, -60, W + 200, H * .85); ctx.restore(); T0(); }
  bill(CAX.skyline, 0, 0, 9000, { a: .7 });
  const hz = PJ(0, -300, 6000)[1], mist = ctx.createLinearGradient(0, hz - 260, 0, hz + 160); mist.addColorStop(0, N ? 'rgba(70,80,120,0)' : 'rgba(236,240,236,0)'); mist.addColorStop(1, N ? 'rgba(80,90,130,.8)' : 'rgba(236,240,232,.9)'); ctx.fillStyle = mist; ctx.fillRect(-SW, hz - 260, SW * 2, 800);
  /* orilla lejana con árboles y sauces */
  for (let k = Math.floor((CAM.x - 6000) / 2000); k * 2000 < CAM.x + 6000; k++) hplane(PKX.far, k * 2000, (k + 1) * 2000, 1700, 2600, 6);
  for (let k = Math.floor((CAM.x - 6000) / 900); k * 900 < CAM.x + 6000; k++) bill(PKX.trees[((k % 4) + 4) % 4], k * 900 + 200 + hsh(k, 1) * 300, 0, 2500 + hsh(k, 2) * 300);
  for (let k = Math.floor((CAM.x - 4000) / 820); k * 820 < CAM.x + 4000; k++) { const x = k * 820 + 500 + hsh(k, 3) * 200; if (x > GH.x0 - 300 && x < GH.x1 + 300) continue; if (hsh(k, 4) < .45) bill(PKX.willows[((k % 3) + 3) % 3], x, 0, 1850 + hsh(k, 5) * 80, { rot: Math.sin(t * .5 + k) * .012, px: 0, py: 0 }); else bill(PKX.trees[((k % 4) + 4) % 4], x, 0, 1880 + hsh(k, 6) * 120, { k: .8 }); }
  ctx.fillStyle = N ? 'rgba(40,50,90,.25)' : 'rgba(240,244,236,.22)'; ctx.fillRect(-SW, -600, SW * 2, 1200);   // humedad de la mañana sobre lo lejano
  for (let k = Math.floor((CAM.x - 6000) / 2000); k * 2000 < CAM.x + 6000; k++) hplane(PKX.far, k * 2000, (k + 1) * 2000, PK.ZW, 1700, 0);
  /* el estanque: espejo de sauces, árboles y rascacielos, roto por ondas */
  waterPlane(t, { pts: POND, y: 6, sky: N ? [[14, 20, 48], [40, 50, 90]] : [[160, 196, 222], [214, 228, 226]], tint: [120, 150, 130], tintA: .3, zg0: 900, zg1: 1600, rings: o.rings ? o.rings(t) : duckRings(t), glitter: !N,
    refl: () => { billMirror(CAX.skyline, 0, 9000, .6, { y: 6 }); for (let k = Math.floor((CAM.x - 4000) / 820); k * 820 < CAM.x + 4000; k++) { const x = k * 820 + 500 + hsh(k, 3) * 200; if (x > 4500) continue; if (hsh(k, 4) < .45) billMirror(PKX.willows[((k % 3) + 3) % 3], x, 1850 + hsh(k, 5) * 80, .8, { y: 6 }); else billMirror(PKX.trees[((k % 4) + 4) % 4], x, 1880 + hsh(k, 6) * 120, .75, { y: 6, k: .8 }); }
      for (let i = 0; i < 3; i++) { const D = DUCK(t, i); pxReflect('ramiro', D.f, D.x, 0, D.z, t, { a: .4, flip: D.flip, amp: 1 }); } if (N) moonReflect(t); } });
  /* el invernadero: bóveda, pabellón central, muro de vidrio */
  if (CAM.x > GH.x0 - 3000) {
    const can = { T: PKX.ghCan, ux0: GH.x0, ux1: GH.x1 };
    ghRoof(t, GH.x0, GH.cx0, -GH.h, GH.z, 520, can); ghRoof(t, GH.cx1, GH.x1, -GH.h, GH.z, 520, can); ghEnds(t); ghRoof(t, GH.cx0, GH.cx1, -GH.ch, GH.z, 380, { ...can, vk: .85 });
    vplane(PKX.gh, [GH.x0, GH.z], [GH.x1, GH.z], -GH.ch, 0);
    const wallP = [[GH.x0, -GH.h, GH.z], [GH.cx0, -GH.h, GH.z], [GH.cx0, -GH.ch, GH.z], [GH.cx1, -GH.ch, GH.z], [GH.cx1, -GH.h, GH.z], [GH.x1, -GH.h, GH.z], [GH.x1, -60, GH.z], [GH.x0, -60, GH.z]];
    ctx.save(); if (clip3(wallP)) {
      /* reflejo de Teo: corre detrás del vidrio (a la distancia del espejo), deformado panel por panel */
      if (!B.hide && B.x > GH.x0 - 200 && B.x < GH.x1 + 200) { const zr = 2 * GH.z - B.z; for (let c = Math.floor((B.x - 160 - GH.x0) / 120); c <= Math.floor((B.x + 160 - GH.x0) / 120); c++) { const xa = GH.x0 + c * 120; ctx.save(); if (clip3([[xa, -GH.ch, GH.z], [xa + 120, -GH.ch, GH.z], [xa + 120, 0, GH.z], [xa, 0, GH.z]])) pxDraw('teo', B.f, B.x + Math.sin(c * 2.1) * 9, (B.y || 0) + Math.sin(c * 1.3) * 3, zr, { flip: B.flip, a: .32, sq: 1 + Math.sin(c * 3.7) * .06 }); ctx.restore(); } }
      /* destellos del sol que barren los vidrios */
      ctx.globalCompositeOperation = 'screen'; for (let k = 0; k < 3; k++) { const gx = GH.x0 + ((t * 120 + k * 1300 - CAM.x * .3) % 3600 + 3600) % 3600, a = PJ(gx, -GH.ch, GH.z), b = PJ(gx + 260, 0, GH.z), gr = ctx.createLinearGradient(a[0], 0, b[0], 0); gr.addColorStop(0, 'rgba(255,250,230,0)'); gr.addColorStop(.5, 'rgba(255,250,230,.35)'); gr.addColorStop(1, 'rgba(255,250,230,0)'); ctx.fillStyle = gr; ctx.fillRect(a[0], a[1], b[0] - a[0] + 60 * PS(GH.z), b[1] - a[1]); }
      ctx.globalCompositeOperation = 'source-over';
      /* el riego: niebla fina que sube por dentro y empaña los vidrios de abajo, gotas que bajan */
      const m = mistAt(t); if (m > .01) { const top = PJ(0, -300, GH.z)[1], bot = PJ(0, -60, GH.z)[1], fg = ctx.createLinearGradient(0, bot, 0, top - 80 * m); fg.addColorStop(0, `rgba(240,248,250,${.75 * m})`); fg.addColorStop(.6, `rgba(236,246,248,${.45 * m})`); fg.addColorStop(1, 'rgba(236,246,248,0)'); ctx.fillStyle = fg; ctx.fillRect(-SW, top - 120, SW * 2, bot - top + 140);
        for (let i = 0; i < 160; i++) { const x = GH.x0 + hsh(i, 1) * (GH.x1 - GH.x0), p0 = ((t * (.15 + hsh(i, 2) * .25) + hsh(i, 3)) % 1), y = -70 - p0 * 280, p = PJ(x + Math.sin(t + i) * 8, y, GH.z + 4); ctx.fillStyle = `rgba(255,255,255,${.6 * m * Math.sin(p0 * PI)})`; ctx.fillRect(p[0], p[1], 1.4, 1.4); }
        for (let i = 0; i < 40; i++) { const x = GH.x0 + hsh(i, 9) * (GH.x1 - GH.x0), d = ((t - 159) * (20 + hsh(i, 4) * 40)) % 220, a = PJ(x, -300 + d, GH.z), b = PJ(x, -300 + d + 12, GH.z); ctx.strokeStyle = `rgba(200,224,232,${.7 * m})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); } }
    } ctx.restore();
    if (!N) { const sun = PJ(GH.x0 + 600, -520, GH.z); LGT(sun[0], sun[1], 900 * PS(GH.z), '255,244,210', .35); }
  }
  /* suelos: orilla de césped, el camino de grava, césped delante */
  for (let k = Math.floor((CAM.x - 4000) / 1200); k * 1200 < CAM.x + 4000; k++) { const x0 = k * 1200, x1 = x0 + 1200;
    hplane(PKX.bank, x0, x1, PK.Z1, x0 >= GH.x0 - 1200 && x0 < GH.x1 ? GH.z : PK.ZW, 0);
    hplane(PKX.path, x0, x1, PK.Z0, PK.Z1, 0); hplane(PKX.grass, x0, x1, 120, PK.Z0, 0); }
  /* komorebi en el camino (bajo los árboles) y arcoíris de los vidrios sobre la grava (junto al invernadero) */
  if (!N && (CAM.x < GH.x0 + 600 || CAM.x > GH.x1 - 300)) dapple(t, { x0: -2000, x1: GH.x0 - 100, z0: 150, z1: PK.ZW, y: 0 }, { a: .55, cell: 64, dens: .5 }), dapple(t, { x0: GH.x1 + 100, x1: 14000, z0: 150, z1: PK.ZW, y: 0 }, { a: .55, cell: 64, dens: .5 });
  if (!N && CAM.x > GH.x0 - 1200 && CAM.x < GH.x1 + 1200) { ctx.save(); ctx.globalCompositeOperation = 'screen'; for (let i = 0; i < 26; i++) { const x = GH.x0 + 60 + i * 140 + Math.sin(i * 2.3) * 40, z = 580 + hsh(i, 2) * 180, k = .5 + .5 * Math.sin(t * 1.5 + i * 1.9); if (k < .3) continue; const a = PJ(x, -.5, z), b = PJ(x + 70, -.5, z + 8), gr = ctx.createLinearGradient(a[0], a[1], b[0], b[1]); for (const [s, c] of [[0, '255,60,60'], [.2, '255,170,40'], [.4, '255,250,80'], [.6, '80,230,120'], [.8, '80,140,255'], [1, '170,80,240']]) gr.addColorStop(s, `rgba(${c},${.45 * k})`); ctx.fillStyle = gr; const w = (b[0] - a[0]), hh = Math.max(1.5, 7 * PS(z) * .35); ctx.save(); ctx.translate(a[0], a[1]); ctx.rotate(-.12); ctx.fillRect(0, -hh, w, hh * 2); ctx.restore(); } ctx.restore(); }
  /* lista de profundidad */
  for (let k = Math.floor((CAM.x - 3000) / 1800); k * 1800 < CAM.x + 3000; k++) { const x = k * 1800 + 700; if (x > GH.x0 - 300 && x < GH.x1 + 300) continue; put(700, () => bill(PKX.bench, x, 0, 700)); }
  for (let k = Math.floor((CAM.x - 3000) / 1400); k * 1400 < CAM.x + 3000; k++) { const x = k * 1400 + 1100; put(720, () => { bill(PKX.lamp, x, 0, 720); if (N) lampNight(t, x, 720); }); }
  for (let i = 0; i < 3; i++) { const D = DUCK(t, i); put(D.z, () => { const c = pxCell('ramiro', D.z, D.k), [fx, fy] = pxFoot(D.x, 0, D.z); pxBlit(elencoCanvas('ramiro', D.f), fx, fy + Math.round(D.bob) * c, c, { flip: D.flip, crop: 6 + 11 }); }); }
  if (!B.hide) put(B.z - .5, () => { const lit = N ? 0 : CAM.x < GH.x0 || B.x > GH.x1 ? dappleAt(B.x, B.z, t, { cell: 64, dens: .5 }) : .6; pxShadow('teo', B.x, B.z, B.y || 0); pxDraw('teo', B.f, B.x, B.y || 0, B.z, { flip: B.flip, lit: lit * .9 });
    const [fx, fy] = pxFoot(B.x, B.y || 0, B.z), c = pxCell('teo', B.z); if (B.f.cup) steamPixT(fx + (B.f.sip ? 7 : 9) * c, fy - (B.f.sip ? 28 : 24) * c, c, t);
    if (t > 130.6 && t < 133.0) for (let k = 0; k < 3; k++) { const ph = (t * 2 + k / 3) % 1; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1 - ph; ctx.fillStyle = 'rgb(255,120,60)'; ctx.fillRect(Math.round(fx + (k - 1) * 6 * c), Math.round(fy - (30 + ph * 10) * c), c * 2, c * 2); ctx.restore(); T0(); } });
  if (!N) put(PK.ZT - 20, () => kickBits(t, STEPS3, { n: 4, leafP: .4 }));
  for (let k = Math.floor((CAM.x - 1600) / 520); k * 520 < CAM.x + 1600; k++) { const x = k * 520 + 160; if (x > GH.x0 + 200 && x < GH.x1 - 200) continue; put(280, () => bill(PKX.fg[((k % 3) + 3) % 3], x, 0, 280)); }
  for (let k = Math.floor((CAM.x - 2400) / 1500); k * 1500 < CAM.x + 2400; k++) { const x = k * 1500 + 400; if (x > GH.x0 + 400 && x < GH.x1 - 400) continue; put(330, () => bill(PKX.canopy[((k % 2) + 2) % 2], x, -560, 330, { rot: Math.sin(t * .6 + k) * .015, px: 0, py: 0 })); }
  put(620, () => drawGate(t));
  flush();
  if (N) { parkNightPost(t, B); lightsComp(0); return; }
  if (CAM.x < GH.x0 + 400 || CAM.x > GH.x1 - 200) godRays(t, [[CAM.x - 500, 900, 120, 1], [CAM.x + 200, 1000, 90, 2.3], [CAM.x + 700, 850, 140, 4.1], [CAM.x - 1100, 950, 100, 5.7]], { a: .09, dx: 300, y0: -900 });
  const sg = PJ(CAM.x - 900, -900, 3000); LGT(sg[0], sg[1], 1200 * PS(3000), '255,236,180', .4);
  lightsComp(0);
}
function camParque(t) {
  const B = teoParque(Math.min(t, 175.8));
  if (t < 131.0) return { x: Math.max(B.x + 380, 60), y: -260, zoom: .78, ty: -60 };
  if (t < 134.6) return { x: B.x + 120, y: -110, zoom: 1.25, ty: 150 };
  if (t < 141.4) return camKeys(t, [[134.6, { x: 3470, y: -200, zoom: 1.1, ty: -100 }], [141.4, { x: 3490, y: -200, zoom: 1.18, ty: -100 }]]);
  if (t < 146.6) return { x: B.x + 160, y: -80, zoom: 1.4, ty: 170 };
  if (t < 152.0) return camKeys(t, [[146.6, { x: 5000, y: -110, zoom: 1.2, ty: 150 }], [152.0, { x: 6500, y: -300, zoom: .52, ty: 210 }]]);
  if (t < 166.0) return { x: B.x + 90, y: -120, zoom: 1.12, ty: 120 };
  if (t < 176.0) return camKeys(t, [[166.0, { x: 7300, y: -200, zoom: .72, ty: 170 }], [176.0, { x: 9300, y: -150, zoom: .85, ty: 140 }]]);
  return camKeys(t, [[176.0, { x: 9300, y: -150, zoom: .85, ty: 140 }], [181, { x: 9420, y: -150, zoom: .88, ty: 140 }]]);
}
const DLG3 = [
  { t: 130.7, who: 'teo', mood: 'prisa', txt: '*sorbo* ...¡QUEMA, QUEMA, QUEMA!', face: { wide: true, mouthO: true }, hold: .5 },
  { t: 135.3, who: 'teo', mood: 'normal', txt: '¡Buenos días, Ramiro! ¡Buenos días, patitos!', face: { happy: true }, hold: .4 },
  { t: 138.0, who: 'ramiro', mood: 'sueno', txt: 'Cuac.', face: { quack: true }, hold: .9 },
  { t: 139.6, who: 'teo', mood: 'normal', txt: '...Lo mismo digo.', face: { tired: true, flat: true }, hold: .8 },
  { t: 153.4, who: 'teo', mood: 'normal', txt: 'Hola, viejo amigo. ¡Cuántos cristales nuevos!', face: { happy: true }, hold: .8 },
  { t: 162.4, who: 'teo', mood: 'normal', txt: '¡Je! Se empañó todo.', face: { happy: true }, hold: .8 },
  { t: 169.6, who: 'teo', mood: 'prisa', txt: 'Ocho y media en la cocina... ¡corre, Teo!', face: { wide: true }, hold: .6 },
];
/* la reja de salida del parque, con el escudo de Almagre */
function drawGate(t) {
  const x0 = 9700, z = 620, iron = 'rgb(28,30,30)', s = PS(z); if (Math.abs(x0 - CAM.x) > 3000) return;
  for (const px of [x0 - 30, x0 + 330]) { box3({ x0: px - 18, x1: px + 18, y0: -260, y1: 0, z0: z - 18, z1: z + 18 }, { front: [150, 140, 126], left: [120, 112, 100], top: [170, 160, 146] }); }
  ctx.strokeStyle = iron; ctx.lineWidth = Math.max(1, 2.4 * s);
  for (let x = x0; x <= x0 + 300; x += 20) { const a = PJ(x, -4, z), b = PJ(x, -210 - Math.sin((x - x0) / 300 * PI) * 30, z); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.fillStyle = 'rgb(200,170,90)'; ctx.beginPath(); ctx.arc(b[0], b[1], 2.2 * s, 0, TAU); ctx.fill(); }
  for (const y of [-30, -170]) { const a = PJ(x0, y, z), b = PJ(x0 + 300, y, z); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
  const c = PJ(x0 + 150, -190, z); ctx.save(); ctx.translate(c[0] - 22 * s, c[1] - 26 * s); marcaLogo(ctx, 'almagre', 0, 0, 44 * s, { layout: 'emblema' }); ctx.restore();
}
