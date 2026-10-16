/* =====================================================================
   ESCENA 6 · REGRESO NOCTURNO Y COLAPSO (23:30 → 00:00) — 365 a 478 s
   el parque de noche: farolas ámbar con halo de niebla y polillas, árboles azul oscuro, el invernadero a oscuras
   con luz de luna y un brillo verde bioluminiscente que «respira», los patos dormidos · Teo arrastra los zuecos,
   bleeps lentos y graves, bostezos · el estudio con la luna por la persiana y el neón del Hotel Medialuna que
   parpadea (cian/magenta) · se deja caer en la cama: la sábana se hunde, las almohadas rebotan, polvo plateado en
   el rayo de luna · 23:59 → 00:00 · último bleep grave · por la ventana, dos estrellas · fin.
   ===================================================================== */
const S6 = { A: 365.0, PEND: 410.0, ROOM: 411.0, FLOP: 431.4, ZERO: 441.0, STARS: 452.0, BLACK: 460.0, CARD: 460.6, END: 478.0 };
/* ---------- cielo y luz de la noche en el parque ---------- */
function nightSky(t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgb(6,9,26)'); g.addColorStop(.55, 'rgb(20,26,58)'); g.addColorStop(1, 'rgb(46,50,86)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const ox = (-CAM.x * .004 % W + W) % W;
  for (let i = 0; i < 220; i++) { const x = (hsh(i, 1) * W * 1.2 + ox) % (W * 1.2) - W * .1, y = hsh(i, 2) * H * .55, tw = .5 + .5 * Math.sin(t * (1 + hsh(i, 3) * 3) + i), a = (.25 + .6 * hsh(i, 4)) * (.6 + .4 * tw); ctx.fillStyle = `rgba(230,236,255,${a})`; const s = hsh(i, 5) < .08 ? 2 : 1; ctx.fillRect(Math.round(x), Math.round(y), s * (H / 720), s * (H / 720)); }
  const mx = W * .78 - (CAM.x * .002 % 80), my = H * .16, mr = H * .055, mg = ctx.createRadialGradient(mx, my, mr * .6, mx, my, mr * 5); mg.addColorStop(0, 'rgba(200,214,255,.35)'); mg.addColorStop(1, 'rgba(200,214,255,0)'); ctx.fillStyle = mg; ctx.fillRect(mx - mr * 5, my - mr * 5, mr * 10, mr * 10);
  ctx.fillStyle = 'rgb(236,238,226)'; ctx.beginPath(); ctx.arc(mx, my, mr, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(160,166,170,.35)'; for (const [dx, dy, r] of [[-.3, -.2, .22], [.25, .1, .16], [-.05, .35, .12], [.35, -.35, .09]]) { ctx.beginPath(); ctx.arc(mx + dx * mr, my + dy * mr, r * mr, 0, TAU); ctx.fill(); }
  ctx.restore(); T0();
}
function moonReflect(t) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const mx = W * .78 - (CAM.x * .002 % 80); ctx.globalCompositeOperation = 'screen'; for (let k = 0; k < 14; k++) { const y = H * (.62 + k * .02), w = W * (.04 + .012 * Math.sin(t * 1.3 + k)) * (1 - k * .03); ctx.fillStyle = `rgba(220,230,255,${.28 - k * .016})`; ctx.fillRect(mx - w / 2 + Math.sin(t * 2 + k * 1.7) * W * .006, y, w, H * .006); } ctx.restore(); T0(); }
function lampNight(t, x, z) {   /* farola: halo ámbar en la niebla y polillas que giran */
  const c = PJ(x, -341, z), s = PS(z); LGT(c[0], c[1], 300 * s, '255,160,70', .75); LGT(c[0], c[1] + 340 * s, 260 * s, '255,150,70', .4); LGF(c[0], c[1], 40 * s, '255,214,150', .85);
  LAMPS_N.push([x, z]);
}
let LAMPS_N = [];
function mothsAt(t, x, z) { const c = PJ(x, -341, z), s = PS(z); for (let i = 0; i < 7; i++) { const w = 2.2 + hsh(i, x) * 2.8, r = (18 + hsh(i, 1) * 30) * s, a = t * w + i * 2.1, px = c[0] + Math.cos(a) * r, py = c[1] + Math.sin(a * 1.31) * r * .7 - 6 * s, fl = Math.sin(t * 40 + i * 3) > 0; ctx.fillStyle = `rgba(255,236,200,${fl ? .95 : .6})`; ctx.fillRect(px, py, Math.max(1.2, 1.6 * s), Math.max(1.2, (fl ? 1.6 : .8) * s)); } }
function parkNightPost(t, B) {
  /* noche azul sobre todo lo pintado; después solo lo que brilla */
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgb(84,96,156)'; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = 'rgba(8,12,34,.18)'; ctx.fillRect(0, 0, W, H); ctx.restore(); T0();
  /* Teo se lee siempre: un poco de él por encima de la noche (y más cerca de una farola) */
  if (B && !B.hide) { let near = 0; for (const [x] of LAMPS_N) near = Math.max(near, 1 - Math.abs(x - B.x) / 500); pxDraw('teo', B.f, B.x, B.y || 0, B.z, { flip: B.flip, a: .42 + .4 * clamp(near) }); }
  /* el invernadero: brillo verde bioluminiscente que respira (más fuerte cuando Teo le habla) */
  const GH = PK.GH; if (CAM.x > GH.x0 - 3000 && CAM.x < GH.x1 + 3000) { const br = .55 + .25 * Math.sin(t * .9) + .5 * sm(seg(t, 393.4, 394.6)) * (1 - sm(seg(t, 397.5, 399.5)));
    for (let i = 0; i < 22; i++) { const x = GH.x0 + 120 + hsh(i, 1) * (GH.x1 - GH.x0 - 240), y = -60 - hsh(i, 2) * 380, p = PJ(x, y, GH.z + 30), r = (90 + hsh(i, 3) * 160) * PS(GH.z), k = br * (.5 + .5 * Math.sin(t * (.6 + hsh(i, 4)) + i)); LGT(p[0], p[1], r, i % 4 ? '80,255,160' : '120,255,220', .7 * k); }
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 70; i++) { const ph = (t * (.05 + hsh(i, 5) * .08) + hsh(i, 6)) % 1, x = GH.x0 + hsh(i, 7) * (GH.x1 - GH.x0) + Math.sin(t * .7 + i) * 30, y = -40 - ph * 520, p = PJ(x, y, GH.z + 10), a = Math.sin(ph * PI) * (.4 + .4 * Math.sin(t * 3 + i)) * br; ctx.fillStyle = `rgba(150,255,190,${a})`; ctx.fillRect(p[0], p[1], 2 * PS(GH.z), 2 * PS(GH.z)); } ctx.restore();
    /* la luna en la bóveda */
    for (let k = 0; k < 4; k++) { const p = PJ(GH.x0 + 500 + k * 900 + Math.sin(t * .1 + k) * 40, -GH.h - 120, GH.z + 300); LGT(p[0], p[1], 260 * PS(GH.z), '170,190,255', .22); } }
  /* luciérnagas sobre el césped */
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 26; i++) { const x = CAM.x + (hsh(i, 1) - .5) * 2400 + Math.sin(t * .4 + i) * 60, z = 300 + hsh(i, 2) * 500, y = -20 - hsh(i, 3) * 90 - Math.sin(t * .8 + i * 2) * 20, p = PJ(x, y, z), a = Math.max(0, Math.sin(t * (1.2 + hsh(i, 4)) + i * 2.3)); if (a < .1) continue; ctx.fillStyle = `rgba(210,255,120,${a * .9})`; ctx.fillRect(p[0], p[1], Math.max(1.5, 2 * PS(z)), Math.max(1.5, 2 * PS(z))); LGF(p[0], p[1], 14 * PS(z), '200,255,120', .3 * a); } ctx.restore();
  for (const [x, z] of LAMPS_N) mothsAt(t, x, z); LAMPS_N = [];
  /* zzz de los patos dormidos */
  if (Math.abs(CAM.x - 3500) < 1500) for (let i = 0; i < 3; i++) { const D = duck6(t, i), [fx, fy] = pxFoot(D.x, 0, D.z), c = pxCell('ramiro', D.z, D.k); for (let k = 0; k < 2; k++) { const ph = (t * .35 + k * .5 + i * .3) % 1; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = Math.sin(ph * PI) * .8; pxText(ctx, 'z', fx + (6 + ph * 8) * c, fy - (16 + ph * 14) * c, Math.max(1, Math.round(c * (i ? .5 : .8))), '#dfe8ff'); ctx.restore(); T0(); } }
}
/* ---------- Teo vuelve a casa (de derecha a izquierda), arrastrando los zuecos ---------- */
const TEO6 = [[365.5, 10300, 'walk'], [374.0, 9350, 'walk'], [374.01, 8700, 'walk'], [380.2, 8150, 'stop'], [382.4, 8150, 'walk'], [387.0, 7700, 'walk'], [387.01, 7000, 'walk'], [393.2, 6300, 'stop'], [400.0, 6300, 'walk'], [400.01, 3960, 'walk'], [404.6, 3600, 'stop'], [410.5, 3600, 'stop']];
function teo6park(t) {
  if (t < TEO6[0][0]) return { hide: true };
  let i = 0; while (i < TEO6.length - 2 && t >= TEO6[i + 1][0]) i++;
  const [ta, xa, m] = TEO6[i], [tb, xb] = TEO6[i + 1], x = lerp(xa, xb, clamp((t - ta) / (tb - ta))), base = { clogs: true, tired: true };
  if (m === 'stop') { const f = { ...base }; if (t > 380.4 && t < 381.8) { f.tired = false; f.mouthO = true; f.blink = true; } if (t > 393.4 && t < 397.6) { f.tired = false; f.happy = true; } if (t > 405 && t < 409) f.flat = true; return { x, y: 0, z: PK.ZT, f, flip: true }; }
  const st = Math.floor(t / .42); return { x, y: Math.abs(Math.sin(t * PI / .42)) * 1.5, z: PK.ZT, f: { ...base, legL: st % 2 ? 0 : 1, legR: st % 2 ? 1 : 0 }, flip: true, walk: true };
}
function duck6(t, i) { const off = [[0, 0], [-46, 22], [-86, 34]][i]; return { x: 3460 + off[0] + Math.sin(t * .3 + i) * 3, z: 860 + off[1], f: { blink: true, chick: i > 0 }, k: i ? .55 : 1, flip: false, bob: Math.sin(t * .9 + i * 1.3) * .5 }; }
function camNight(t) {
  const B = teo6park(Math.min(t, 410));
  if (t < 374) return camKeys(t, [[365, { x: 9700, y: -200, zoom: .95, ty: 80 }], [374, { x: 9450, y: -200, zoom: 1.0, ty: 80 }]]);
  if (t < 387) return { x: B.x - 120, y: -170, zoom: 1.1, ty: 60 };
  if (t < 400) return camKeys(t, [[387, { x: 6700, y: -300, zoom: .56, ty: 200 }], [400, { x: 6550, y: -300, zoom: .6, ty: 200 }]]);
  return camKeys(t, [[400, { x: 3640, y: -200, zoom: 1.1, ty: -100 }], [410, { x: 3600, y: -200, zoom: 1.2, ty: -100 }]]);
}
function scene6park(t) { SOL.on = 0; camSet(camNight(t)); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#0c1028'; ctx.fillRect(0, 0, W, H); ctx.restore(); T0();
  drawParque(t, { night: true, teo: teo6park, duck: duck6, rings: t2 => [[Math.floor(t2 / 3) * 3, 3500, 900, .2]] }); postFx(t, { tone: [200, 210, 255], vig: .7 }); }
/* ---------- el estudio de noche ---------- */
function estudioOutsideNight(neon) {   /* azoteas de noche, ventanas encendidas, la luna y el letrero del Hotel Medialuna */
  const T = tex(700, 360, 1.2), g = T.g, r = mulberry32(55);
  const sk = g.createLinearGradient(0, 0, 0, 360); sk.addColorStop(0, 'rgb(8,12,32)'); sk.addColorStop(.7, 'rgb(28,32,70)'); sk.addColorStop(1, 'rgb(60,50,90)'); g.fillStyle = sk; g.fillRect(0, 0, 700, 360);
  for (let i = 0; i < 140; i++) { g.fillStyle = `rgba(230,236,255,${.3 + r() * .6})`; g.fillRect(r() * 700, r() * 200, 1, 1); }
  for (const [x, y] of [[300, 60], [350, 44]]) { const sg = g.createRadialGradient(x, y, 0, x, y, 10); sg.addColorStop(0, 'rgba(255,255,240,1)'); sg.addColorStop(1, 'rgba(255,255,240,0)'); g.fillStyle = sg; g.fillRect(x - 10, y - 10, 20, 20); g.fillStyle = '#fff'; g.fillRect(x - 4, y - .5, 8, 1); g.fillRect(x - .5, y - 4, 1, 8); }   // las dos estrellas
  const mg = g.createRadialGradient(560, 80, 6, 560, 80, 70); mg.addColorStop(0, 'rgba(220,230,255,.5)'); mg.addColorStop(1, 'rgba(220,230,255,0)'); g.fillStyle = mg; g.fillRect(490, 10, 140, 140); g.fillStyle = 'rgb(236,238,226)'; g.beginPath(); g.arc(560, 80, 18, 0, TAU); g.fill();
  let x = -10; while (x < 700) { const w = 50 + r() * 90, h = 70 + r() * 110; g.fillStyle = 'rgb(30,30,52)'; g.fillRect(x, 360 - h, w, h); for (let k = 0; k < 10; k++) if (r() < .45) { g.fillStyle = `rgba(255,${200 + r() * 40 | 0},120,${.5 + r() * .4})`; g.fillRect(x + 6 + (k % 4) * w / 4.5, 360 - h + 10 + Math.floor(k / 4) * 22, 7, 10); } x += w + 4; }
  x = -20; while (x < 700) { const w = 80 + r() * 120, h = 40 + r() * 70; g.fillStyle = 'rgb(16,16,30)'; g.fillRect(x, 360 - h, w, h); x += w + 10; }
  /* el letrero de neón sobre un edificio */
  g.fillStyle = 'rgb(20,20,34)'; g.fillRect(170, 150, 270, 90); g.font = '46px "Pacifico", cursive'; g.textAlign = 'center';
  if (neon) { g.shadowColor = 'rgba(80,255,255,1)'; g.shadowBlur = 18; g.fillStyle = 'rgb(170,255,255)'; g.fillText('Medialuna', 318, 212); g.shadowColor = 'rgba(255,80,220,1)'; g.fillStyle = 'rgb(255,170,240)'; g.lineWidth = 5; g.strokeStyle = 'rgb(255,120,230)'; g.beginPath(); g.arc(200, 190, 22, PI * .3, PI * 1.7); g.stroke(); g.shadowBlur = 0; }
  else { g.fillStyle = 'rgba(120,130,150,.5)'; g.fillText('Medialuna', 318, 212); g.strokeStyle = 'rgba(130,110,130,.5)'; g.lineWidth = 5; g.beginPath(); g.arc(200, 190, 22, PI * .3, PI * 1.7); g.stroke(); }
  g.font = '700 13px "Josefin Sans", sans-serif'; g.fillStyle = neon ? 'rgb(255,200,240)' : 'rgba(150,140,160,.6)'; g.fillText('H O T E L', 318, 168);
  return T; }
/* el neón parpadea como los neones viejos: largo encendido, tartamudeos */
const neonOn = t => { const c = (t * .37) % 1, k = Math.floor(t * 18); return c < .82 ? true : (hsh(k, 3) > .55); };
let SHEET2 = null;
function sheet2Bake() {
  const F = S6.FLOP, mat = { t: 'box', x0: BED.x0 + 4, x1: BED.x1 - 4, y0: BED.top, y1: 0, z0: BED.z0 + 4, z1: BED.z1 - 4 }, ctr = [-322, BED.top - 20, 668];
  SHEET2 = clothBake({ nx: 19, ny: 13, t0: F - .6, t1: F + 6, settle: 3, iter: 7, drag: .9, friction: .6, bend: .22, g: 1.05,
    at: (u, v) => [lerp(BED.x0 + 30, BED.x1 + 14, u), BED.top - 3, lerp(BED.z0 - 8, BED.z1 - 30, v)],
    colliders: t => { const o = [mat, { t: 'box', x0: -1e4, x1: BED.x0 + 2, y0: -125, y1: 0, z0: 0, z1: 1e4 }]; if (t > F - .12) o.push({ t: 'sph', c: [ctr[0], lerp(BED.top - 70, ctr[1], clamp((t - F + .12) / .12)), ctr[2]], r: 26 }); return o; },
    kick: (t, i, j, x, y, z) => { if (t < F || t >= F + 1 / 240) return null; const d = Math.hypot(x - ctr[0], z - ctr[2]), k = sm(clamp((d - 30) / 90)); return [(x - ctr[0]) / (d || 1) * 60 * k, -330 * k, (z - ctr[2]) / (d || 1) * 60 * k]; } });
}
function door6(t) { return t < 411.6 ? 0 : 1.3 * eio(seg(t, 411.6, 412.8)) + .05 * Math.sin((t - 411.6) * 4) * Math.exp(-(t - 412.8) * 2) * (t > 412.8 ? 1 : 0); }
function teo6room(t) {
  const base = { clogs: true, tired: true }, wk = (a, b, P0, P1, k = .3) => { const u = seg(t, a, b), st = Math.floor(t / .48); return { x: lerp(P0[0], P1[0], u), y: 0, z: lerp(P0[1], P1[1], u), f: { ...base, legL: st % 2 ? 0 : 1, legR: st % 2 ? 1 : 0 }, flip: P1[0] < P0[0] }; };
  if (t < 412.4) return { hide: true };
  if (t < 415.0) return wk(412.4, 415.0, [566, 900], [560, 700]);
  if (t < 419.4) return wk(415.0, 419.4, [560, 700], [300, 640]);
  if (t < 422.6) { const f = { ...base }; if (t > 419.6 && t < 421.2) { f.tired = false; f.mouthO = true; f.blink = true; } return { x: 300, y: 0, z: 640, f, flip: true }; }
  if (t < 428.4) return wk(422.6, 428.4, [300, 640], [-150, 628]);
  if (t < 430.6) { const sway = Math.sin((t - 428.4) * 2.4) * .08 * seg(t, 428.4, 429.4); return { x: -150, y: 0, z: 628, f: { ...base, tired: t < 429.6, sleep: t >= 429.6 }, flip: true, rot: sway }; }
  if (t < S6.FLOP) { const u = eio(seg(t, 430.6, S6.FLOP)); return { x: lerp(-150, -300, u), y: lerp(0, 22, u) + hop(u, 40), z: lerp(628, 668, u), f: { ...base, sleep: true, tired: false }, flip: true, rot: -1.5 * u * u }; }
  const a = t - S6.FLOP, bounce = 8 * Math.exp(-a * 5) * Math.abs(Math.sin(a * 14));
  return { x: -300, y: 22 + bounce, z: 668, f: { clogs: true, sleep: true }, flip: true, rot: -1.5, sleep: true };
}
const pillowB = t => i => { const a = t - S6.FLOP - (i ? .06 : 0); return a > 0 && a < 1.6 ? 14 * Math.exp(-a * 3.2) * Math.abs(Math.sin(a * 9)) : 0; };
function camRoom(t) {
  if (t < 420) return camKeys(t, [[411, { x: 30, y: -160, zoom: .83, ty: 34 }], [420, { x: 80, y: -160, zoom: .9, ty: 34 }]]);
  if (t < 428.6) { const B = teo6room(t); return { x: B.x - 60, y: -120, zoom: 1.55, ty: 70 }; }
  if (t < 436) return camKeys(t, [[428.6, { x: -250, y: -128, zoom: 1.4, ty: 70 }], [436, { x: -290, y: -128, zoom: 1.55, ty: 74 }]]);
  if (t < 446) return camKeys(t, [[436, { x: -502, y: -70, zoom: 4.1, ty: 10 }], [446, { x: -502, y: -70, zoom: 4.5, ty: 10 }]]);
  return camKeys(t, [[446, { x: -300, y: -128, zoom: 1.5, ty: 74 }], [452, { x: -120, y: -160, zoom: .95, ty: 40 }]]);
}
function drawEstudioNight(t) {
  const B = teo6room(t), on = neonOn(t), save = ESX.out; ESX.out = on ? ESX.outN1 : ESX.outN0;
  ESX.occWall = monOcc(t, 0);
  SOL.dyn = clothOcc(SHEET2, t, .5).concat(B.hide ? [] : [pxOcc('teo', B.x, B.y || 0, B.z, { w: 18, h: 22 })]);
  ESX.occFloor = [{ pts: [[BED.x0, BED.top, BED.z1], [BED.x1, BED.top, BED.z1], [BED.x1, BED.top, BED.z0], [BED.x0, BED.top, BED.z0]], a: .9 }, { pts: [[BED.x0, BED.top, BED.z0], [BED.x1, BED.top, BED.z0], [BED.x1, 0, BED.z0], [BED.x0, 0, BED.z0]], a: .9 }];
  estudioShell(t); ESX.out = save;
  drawWallDecor(t);
  put(740, drawShelf); put(725, () => drawDesk(t)); put(705, () => drawMonstera(t, 0)); put(700, () => drawBed(t, { pb: pillowB(t) })); put(690, () => drawNightstand(t));
  put(626, () => bill(PROPS.clothes, -185, 0, 626));
  put(699, () => clothDraw(SHEET2, t, { c: [236, 234, 228] }));
  if (!B.hide) put(B.sleep ? 698.5 : B.z - .5, () => drawTeo(t, B));
  const room = { x0: -560, x1: 700, y0: -290, y1: -5, z0: 300, z1: 755 };
  let motes = dustAmbient(t, room, 220, 3).concat(dustBurst(t, S6.FLOP + .02, { x0: BED.x0 + 20, x1: BED.x1 - 10, y0: BED.top - 30, y1: BED.top - 5, z0: BED.z0, z1: BED.z1 - 10 }, 520, 13, { vx: 240, vy: 260, vz: 170, wx: 30, life: 18, spread: .3 }));
  dustPut(motes, { bands: [[0, 560], [560, 650], [650, 2000]], dim: .1, bright: 1 });
  flush();
  solShafts(ES.ZB, SOL.shaft * (1 + 1.5 * Math.exp(-Math.max(0, t - S6.FLOP) * .3) * (t > S6.FLOP ? 1 : 0)));
  /* el neón se cuela por la ventana: cian y magenta que tartamudean */
  if (on) { const c = PJ(-540, -160, 490), zk = Math.max(1, CAM.zoom), s = PS(490) / zk, mg = (Math.floor(t * .5) % 2) ? '255,90,220' : '90,255,255'; LGT(c[0], c[1], 300 * s, mg, .24 / zk); const f = PJ(-420, 0, 520); LGT(f[0], f[1], 240 * s, mg, .14 / zk); }
  /* zzz que suben de Teo dormido */
  if (B.sleep && t > S6.FLOP + 1.2) { const [fx, fy] = pxFoot(B.x + 10, B.y + 30, B.z), c = pxCell('teo', B.z); for (let k = 0; k < 3; k++) { const ph = ((t - S6.FLOP) * .3 + k / 3) % 1; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = Math.sin(ph * PI) * .9; pxText(ctx, 'z', fx + (4 + ph * 10 + k * 3) * c, fy - (6 + ph * 22) * c, Math.max(1, Math.round(c * (.6 + k * .2))), '#e6ecff'); ctx.restore(); T0(); } }
}
function scene6room(t) {
  estudioSol(true); SOL.on = 1; SOL.ambA = .25; camSet(camRoom(t));
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#05060f'; ctx.fillRect(0, 0, W, H); ctx.restore(); T0();
  lightsBegin(); T0(); drawEstudioNight(t);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgb(96,104,170)'; ctx.fillRect(0, 0, W, H); ctx.restore(); T0();
  lightsComp(0);
  postFx(t, { tone: [206, 214, 255], vig: .72 });
}
/* ---------- por la ventana, dos estrellas ---------- */
function windowStars(t) {
  const u = t - S6.STARS; T0();
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgb(4,6,20)'); g.addColorStop(.7, 'rgb(18,22,54)'); g.addColorStop(1, 'rgb(40,36,74)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 260; i++) { const x = hsh(i, 1) * W, y = hsh(i, 2) * H * .7, a = (.2 + .5 * hsh(i, 3)) * (.6 + .4 * Math.sin(t * (1 + hsh(i, 4) * 2) + i)); ctx.fillStyle = `rgba(230,236,255,${a})`; ctx.fillRect(Math.round(x), Math.round(y), H / 720, H / 720); }
  /* la ciudad dormida y el neón */
  const r = mulberry32(77); let x = -20; while (x < W) { const w = (60 + r() * 110) * H / 720, h = (80 + r() * 140) * H / 720; ctx.fillStyle = 'rgb(14,14,30)'; ctx.fillRect(x, H - h, w, h); for (let k = 0; k < 8; k++) if (r() < .3) { ctx.fillStyle = 'rgba(255,214,140,.6)'; ctx.fillRect(x + 8 + (k % 4) * w / 4.4, H - h + 14 + Math.floor(k / 4) * 26 * H / 720, 6 * H / 720, 9 * H / 720); } x += w + 6; }
  if (neonOn(t)) { ctx.font = `${Math.round(H * .07)}px "Pacifico", cursive`; ctx.textAlign = 'center'; ctx.shadowBlur = H * .03; ctx.shadowColor = 'rgba(80,255,255,1)'; ctx.fillStyle = 'rgb(180,255,255)'; ctx.fillText('Medialuna', W * .7, H * .86); ctx.shadowBlur = 0; }
  /* las dos estrellas: brillan juntas, como dos estrellas de guía */
  const st = [[W * .42, H * .26, 0], [W * .55, H * .2, .8]];
  for (const [sx, sy, d] of st) { const k = sm(clamp((u - 1.2 - d) / 1.2)), tw = 1 + .25 * Math.sin(t * 5 + d * 4), R = H * .05 * k * tw;
    if (k <= 0) continue; const gl = ctx.createRadialGradient(sx, sy, 0, sx, sy, R * 3); gl.addColorStop(0, `rgba(255,250,220,${.8 * k})`); gl.addColorStop(.3, `rgba(255,220,140,${.25 * k})`); gl.addColorStop(1, 'rgba(255,220,140,0)'); ctx.fillStyle = gl; ctx.fillRect(sx - R * 3, sy - R * 3, R * 6, R * 6);
    ctx.fillStyle = `rgba(255,255,245,${k})`; ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU - PI / 2, rr = i % 2 ? R * .18 : R; i ? ctx.lineTo(sx + Math.cos(a) * rr, sy + Math.sin(a) * rr) : ctx.moveTo(sx + Math.cos(a) * rr, sy + Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); }
  /* las lamas de la persiana, en primer plano, que se abren un poco */
  const open = .72 + .2 * sm(clamp(u / 4)), n = 9, P = H / n;
  for (let k = 0; k <= n; k++) { const th = P * (1 - open), y = k * P - th / 2; ctx.fillStyle = 'rgb(20,20,30)'; ctx.fillRect(0, y, W, th); ctx.fillStyle = 'rgba(170,190,255,.35)'; ctx.fillRect(0, y + th - 2, W, 2); }
  ctx.restore(); T0();
  postFx(t, { tone: [220, 226, 255], vig: .8 });
}
function endCard(t) {
  const u = t - S6.CARD; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#07070c'; ctx.fillRect(0, 0, W, H);
  const a1 = sm(clamp((u - .3) / 1.5)), a2 = sm(clamp((u - 1.8) / 1.5)), a3 = sm(clamp((u - 4) / 1.5)), a4 = sm(clamp((u - 6) / 1.5)), out = 1 - sm(clamp((t - (S6.END - 2.2)) / 2));
  ctx.textAlign = 'center'; ctx.globalAlpha = a1 * out; ctx.fillStyle = '#f3ead6'; ctx.font = `700 ${Math.round(H * .085)}px "Playfair Display", serif`; ctx.fillText('Entre el Vapor y el Bit', W / 2, H * .38);
  ctx.globalAlpha = a2 * out; ctx.fillStyle = '#ffd84a'; ctx.font = `600 ${Math.round(H * .06)}px "Caveat", cursive`; ctx.fillText('Crónica de dos Estrellas', W / 2, H * .48);
  for (const [dx, d] of [[-.05, 0], [.05, .3]]) { const k = sm(clamp((u - 2.6 - d) / .8)) * out, sx = W * (.5 + dx), sy = H * .57, R = H * .022 * k; ctx.globalAlpha = 1; ctx.fillStyle = `rgba(255,216,74,${k})`; ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = i / 10 * TAU - PI / 2, rr = i % 2 ? R * .42 : R; i ? ctx.lineTo(sx + Math.cos(a) * rr, sy + Math.sin(a) * rr) : ctx.moveTo(sx + Math.cos(a) * rr, sy + Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); }
  const p = Math.max(2, Math.round(H / 240)); ctx.globalAlpha = a3 * out; const fin = 'FIN'; pxText(ctx, fin, W / 2 - fin.length * 3 * p * 2, H * .64, p * 2, '#fff');
  ctx.globalAlpha = a4 * out * .8; const cr = ['Teo Cazorla · Rosa Mijares · Valeria Ocampo · Ramiro Lagos', 'Dibujo, voces y música hechos solo con código'];
  cr.forEach((s, i) => pxText(ctx, s, W / 2 - s.length * 3 * p, H * (.76 + i * .05), p, i ? '#9aa0b8' : '#dfe4f4'));
  ctx.restore(); T0();
}
const DLG6 = [
  { t: 376.4, who: 'teo', mood: 'agotado', txt: '...mis zuecos... pesan... como ollas de caldo...', face: { tired: true }, hold: .6 },
  { t: 393.6, who: 'teo', mood: 'agotado', txt: '...buenas noches... viejo amigo.', face: { happy: true }, hold: .8 },
  { t: 405.2, who: 'teo', mood: 'agotado', txt: '...shhh... buenas noches, Ramiro.', face: { flat: true }, hold: .4 },
  { t: 408.4, who: 'ramiro', mood: 'sueno', txt: '...cuac.', face: { blink: true }, hold: .8 },
  { t: 423.0, who: 'teo', mood: 'agotado', txt: '...cama... cama... cama...', face: { tired: true }, hold: .4 },
];
const LABELS6 = [{ t0: 365.6, t1: 370.6, big: '11:30 PM', small: 'PARQUE DEL INVERNADERO', col: '#8ab4ff' }, { t0: 411.6, t1: 416.4, big: '11:58 PM', small: 'EL ESTUDIO DE TEO', col: '#8ab4ff' }];
