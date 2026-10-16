/* =====================================================================
   LA PELÍCULA: planos, cámara, luz sobre los magos, títulos
   ===================================================================== */
const CHAPTERS = [[0, 'La calma'], [30, 'El primer destello'], [60, 'El contraataque'], [90, 'Botánica y derrumbe'], [120, 'El choque de haces'], [150, 'Colapso y silencio']];
const lin = (a, b, f) => a + (b - a) * clamp(f);
/* luz de borde de cada mago según lo que brille cerca */
function mageLight(who, t) {
  const A = who === 'magoA'; let rim = .32 + WS.flash * .9, col = '186,198,226', d = nrm2([A ? -.3 : .3, -1]);
  if (t > 32.4 && t < 40.5 && A) { const k = sm((t - 32.4) / 1.5) * (1 - sm((t - 39.5) / 1)); rim += k * .8; col = '255,168,96'; d = nrm2([.4, -1]); }
  if (t > 37.2 && t < 41 && !A) { const k = sm((t - 38.6) / .5) * (1 - sm((t - 40.2) / .8)); rim += k * .9; col = '255,168,96'; d = nrm2([-1, -.3]); }
  if (t > 60.2 && t < 62.5 && !A) { rim += .7; col = '150,190,255'; }
  if (t > 79.3 && t < 89 && A) { rim += .5 * (1 - sm((t - 87.6) / 1.4)); col = '255,214,140'; d = nrm2([.6, -1]); }
  if (t > 91.2 && t < 98 && A) { rim += .6 * (1 - sm((t - 96) / 2)); col = '120,240,160'; d = nrm2([.5, 1]); }
  const cl = clashLight(t); if (cl > .02) { rim = .5 + cl * 1.1; col = '236,222,255'; d = nrm2([A ? 1 : -1, -.25]); }
  if (t > 154) { rim = .45 * WS.clear + .2; col = '196,208,236'; d = nrm2([.2, -1]); }
  return { rim, col, d };
}
/* lo que cada plano añade a la lista de profundidad */
let TICKS = 0;
function stdItems(key) {
  return (put, t) => {
    put(800, () => drawMage('magoA', t, TICKS, mageLight('magoA', t), 'A' + key));
    put(799.5, () => drawMage('magoB', t, TICKS, mageLight('magoB', t), 'B' + key));
    for (const S of SLABS) put(S.z, () => drawSlab(S, t));
    put(800.5, () => domeHalf(t, false)); put(799.8, () => domeHalf(t, true));
    for (const R of GROOTS) put(R.P[1][2] + 1, () => grootDraw(R, t));
  };
}
function stdFloor(t) { scorchFloor(t); slabHoles(t); crackFloor(t); webFloor(t); hardShadows(t); }
function stdFx(t) {
  godRays(t); dustFx(t); dripsFx(t);
  steamFx(t); smokeFx(t); ashFx(t); soilFx(t);
  fireFx(t); jetFx(t); slabImpactFx(t); jarBurstFx(t); embersFx(t);
  shockFx(t); rainInFx(t); cyanBoltFx(t); glassFx(t); domeFx(t);
  grootDust(t); slicesFx(t); slashFx(t); sapFx(t); rivetFx(t); wallDebrisFx(t); hurricaneFx(t);
  orbitFx(t); beamFx(t); pulseFx(t); implodeFx(t); afterFx(t);
  if (t > 32.4 && t < 37.4 && MAGE.magoA) { const k = sm((t - 32.4) / 1.6) * (1 - sm((t - 37.2) / .2)), c = MAGE.magoA.tip; inkBloom(c, (6 + 10 * k) * MAGE.magoA.s, FIRE, .8 * k, Math.floor(t * 12), .6, 7); paperLight(c, 3.5 * k * MAGE.magoA.s, k); LGF(c[0], c[1], 130 * MAGE.magoA.s, '255,150,70', .9 * k); LGT(c[0], c[1], 260 * MAGE.magoA.s, '255,130,50', .6 * k); }
}
/* ---------- planos especiales ---------- */
function shotHand(t, ticks) {   // primer plano: la mano de A, la chispa naranja y las nervaduras que se encienden
  const lt = t - 33.5, k = sm((lt - .3) / 1.6); worldState(t);
  camSet({ x: -200, y: -170, zoom: 2.2, ty: 60 }); drawSet(t, { floorFx: stdFloor });
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = `blur(${Math.round(9 * U)}px)`; ctx.drawImage(cv, 0, 0); ctx.filter = 'none'; ctx.restore(); T0();
  tint('120,104,96', .55);
  for (let i = 0; i < 18; i++) { const x = -SW / 2 + hsh(i, 5) * SW, y = 260 + hsh(i, 6) * 220, r = 10 + hsh(i, 7) * 30, warm = hsh(i, 8) < .6; ctx.fillStyle = warm ? `rgba(255,150,70,${.12 + .3 * k * hsh(i, 9)})` : `rgba(140,170,210,${.12 * hsh(i, 9)})`; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
  /* hojas de helecho grandes detrás de la mano: las nervaduras se encienden */
  const Pd = new Path2D(), Pl = new Path2D(), Ps = new Path2D();
  const fr = [[[420, 520], -1.9, 760], [[620, 520], -2.35, 620], [[-80, 540], -1.2, 520]].map(([b, a, L], i) => frond(b, a + Math.sin(t * .8 + i) * .02, L, { vib: thunderVib(t) * .3 }, Pd, Pl, Ps, 40 + i * 9));
  ctx.fillStyle = 'rgba(26,38,30,.97)'; ctx.fill(Pd); ctx.fillStyle = 'rgba(44,62,46,.95)'; ctx.fill(Pl); ctx.strokeStyle = 'rgba(20,26,22,.9)'; ctx.lineWidth = 3; ctx.stroke(Ps);
  if (k > .01) { ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.strokeStyle = `rgba(255,150,70,${.85 * k})`; ctx.lineWidth = 2.4; ctx.stroke(Ps); ctx.fillStyle = `rgba(255,120,40,${.22 * k})`; ctx.fill(Pl); ctx.restore(); }
  /* la mano, grande; el antebrazo solo asoma desde el borde */
  SC.sil = false; const S = TINTA, s = 390, W_ = [-560 + 30 * sm(lt / 1.2), 300 - 40 * sm(lt / 1.2)], ang = -.62 + .05 * Math.sin(t * 2);
  const Hd = handRig({ x: W_[0], y: W_[1], s, ang, pose: HPOSE.varita, wand: true });
  const d = [Math.cos(ang), Math.sin(ang)], e = add(W_, d, -70);
  SC.house = 'A'; SC.anchor = W_; SC.sil = true; SC.rimCol = '255,168,96';
  S.fill([capsulePts(add(e, d, -900), e, 160, 120, 5)], 'cloth');
  renderHand(Hd, S, { L: { d: nrm2([.6, -1]), z: .1 }, sep: false });
  S.rim(Hd.all, nrm2([.8, -.6]), 16, .6 + .9 * k);
  SC.sil = false;
  const tip = Hd.wandTip || add(W_, [Math.cos(ang - .27), Math.sin(ang - .27)], 2 * s);
  lightsBegin();
  inkBloom(tip, 20 + 70 * k + 8 * Math.sin(t * 30), FIRE, .85 * k, Math.floor(t * 12), .7, 8);
  paperLight(tip, 4 + 22 * k, Math.min(1, k * 1.5));
  LGF(tip[0], tip[1], 300 + 500 * k, '255,150,70', 1.1 * k); LGF(tip[0], tip[1], 900, '255,120,50', .35 * k);
  for (let i = 0; i < 14; i++) { const a = hsh(i, 1) * TAU + t * 2, r = 60 + ((t * 80 + hsh(i, 2) * 200) % 200); const p = [tip[0] + Math.cos(a) * r * (1 - k * .3), tip[1] + Math.sin(a) * r]; ctx.fillStyle = `rgba(255,190,110,${.8 * k * (1 - r / 260)})`; ctx.beginPath(); ctx.arc(p[0], p[1], 2.4, 0, TAU); ctx.fill(); }
  lightsComp(1);
}
function shotDrops(t, ticks, key) {   // cámara lenta: gotas de condensación caen desde la viga por delante de un helecho
  drawSet(t, { items: (put) => { stdItems(key)(put, t); put(560, () => fernAt(-210, 560, 150, 91, plantO(-210, 560, t), t)); }, floorFx: stdFloor, fx: t2 => { dustFx(t2, .6); } });
  const slow = .16, base = 25.5;
  for (let i = 0; i < 9; i++) {
    const t0 = base - .6 + i * .5 + hsh(i, 3) * .3, tau = Math.max(0, (t - t0)) * slow, y = -340 + .5 * GRAV * tau * tau * 7, x = -520 + hsh(i, 1) * 330, z = 470 + hsh(i, 2) * 90;
    if (t < t0) { const p = PJ(x, -340, z), s = PS(z), g = sm((t - t0 + 1.5) / 1.5); ctx.fillStyle = `rgba(214,224,236,${.8 * g})`; ctx.beginPath(); ctx.arc(p[0], p[1] + 4 * s * g, 3.2 * s * g, 0, TAU); ctx.fill(); continue; }
    if (y > -60) continue;
    const p = PJ(x, y, z), s = PS(z), r = 7 * s, l = r * (1.4 + tau * 2.4); LGF(p[0], p[1], r * 4, '200,214,236', .25);
    ctx.fillStyle = 'rgba(206,218,232,.6)'; ctx.beginPath(); ctx.moveTo(p[0], p[1] - l); ctx.quadraticCurveTo(p[0] + r, p[1], p[0], p[1] + r); ctx.quadraticCurveTo(p[0] - r, p[1], p[0], p[1] - l); ctx.fill();
    ctx.strokeStyle = 'rgba(30,34,44,.4)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = 'rgba(252,252,246,.95)'; ctx.beginPath(); ctx.arc(p[0] - r * .35, p[1] - r * .1, r * .3, 0, TAU); ctx.fill();
    /* reflejo diminuto del invernadero dentro de la gota */
    ctx.strokeStyle = 'rgba(20,22,28,.5)'; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(p[0] - r * .5, p[1] + r * .3); ctx.lineTo(p[0] + r * .5, p[1] + r * .3); ctx.moveTo(p[0], p[1] - r * .2); ctx.lineTo(p[0], p[1] + r * .7); ctx.stroke();
  }
}
/* el charco con la luna, visto casi desde arriba: en el agua se reflejan el cielo abierto, la luna,
   la costilla retorcida y el último trozo de vidrio, que cae, entra en cuadro y rompe el reflejo */
const TSHARD = 171.0, TSPLASH = 172.45, MOONP = [-80, 470];
function puddleRefl() {
  const t = WS.t, P = PUDDLES.find(p => p.moonP), c = PJ(P.x, 0, P.z), s = PS(P.z), rip = t > TSPLASH ? Math.exp(-(t - TSPLASH) * .6) : 0;
  const wob = (y, k = 1) => rip * k * Math.sin(y * .05 + t * 10) * 26 * s * Math.exp(-Math.abs(y - c[1]) * .002);
  const gr = ctx.createLinearGradient(0, c[1] - 200, 0, c[1] + 200); gr.addColorStop(0, 'rgb(44,54,82)'); gr.addColorStop(1, 'rgb(16,20,34)'); ctx.fillStyle = gr; ctx.fillRect(-SW / 2, -500, SW, 1000);
  for (let i = 0; i < 40; i++) { ctx.fillStyle = `rgba(236,236,226,${.3 + hsh(i, 9) * .5})`; ctx.beginPath(); ctx.arc(c[0] + (hsh(i, 7) - .5) * 900 * s * .5 + wob(c[1]), c[1] + (hsh(i, 8) - .5) * 160 * s * .5, 1.1, 0, TAU); ctx.fill(); }
  for (let k = 0; k < 3; k++) { const pts = []; for (let i = 0; i <= 14; i++) { const f = i / 14, y = c[1] + 70 * s * .5 - f * 150 * s * .5; pts.push([c[0] + (k - 1) * 220 * s * .5 + Math.sin(f * 3 + k) * 40 * s * .5 + f * f * 60 * s * .5 * (k - 1) + wob(y), y]); } ctx.strokeStyle = 'rgba(10,10,14,.85)'; ctx.lineWidth = (5 - k) * s * .5; ctx.stroke(pLine(pts)); }
  /* nubes que se abren, reflejadas */
  for (let i = 0; i < 6; i++) { const x = c[0] - 600 + hsh(i, 1) * 1200 + t * 4, y = c[1] - 140 + hsh(i, 2) * 280, r = 120 + hsh(i, 3) * 160; ctx.fillStyle = 'rgba(96,104,130,.35)'; ctx.beginPath(); ctx.ellipse(x + wob(y), y, r, r * .3, 0, 0, TAU); ctx.fill(); }
  /* la luna (papel reservado) en franjas, para que el agua la rompa */
  const mx = c[0] + 60 * s, my = c[1] - 8 * s, mr = 15 * s;
  const hg = ctx.createRadialGradient(mx, my, mr, mx, my, mr * 6); hg.addColorStop(0, 'rgba(206,214,236,.4)'); hg.addColorStop(1, 'rgba(206,214,236,0)'); ctx.fillStyle = hg; ctx.fillRect(mx - mr * 6, my - mr * 6, mr * 12, mr * 12);
  const N = 36; for (let i = -N / 2; i <= N / 2; i++) { const f = i / (N / 2), y = my + f * mr * .62, w = Math.sqrt(Math.max(0, 1 - f * f)) * mr, dx = wob(y, 1.2) + rip * Math.sin(f * 9 + t * 11) * mr * .9; ctx.fillStyle = `rgba(238,240,248,${.9 - rip * .3})`; ctx.beginPath(); ctx.ellipse(mx + dx, y, w + rip * mr * .3, mr * .62 / N * 1.4, 0, 0, TAU); ctx.fill(); }
  /* borde mojado del charco */
  ctx.strokeStyle = 'rgba(14,16,22,.5)'; ctx.lineWidth = 10 * s * .5;
  /* la costilla retorcida y el vidrio que cuelga (en el agua aparecen invertidos) */
  const beam = []; for (let i = 0; i <= 20; i++) { const f = i / 20, y = c[1] - 200 * s + f * 400 * s; beam.push([c[0] - 260 * s + f * 380 * s + Math.sin(f * 4) * 30 * s + wob(y), y]); }
  ctx.fillStyle = 'rgba(12,12,16,.92)'; ctx.fill(pPolys([stripP(beam, f => (12 + 5 * Math.sin(f * 7)) * s)]));
  if (t < TSPLASH) { const tau = Math.max(0, t - TSHARD), q = L2([c[0] - 10 * s, c[1] + 60 * s], [c[0] + 20 * s, c[1] - 4 * s], clamp(tau * tau / ((TSPLASH - TSHARD) ** 2))); ctx.fillStyle = 'rgba(200,214,226,.8)'; ctx.beginPath(); ctx.moveTo(q[0], q[1] - 14 * s); ctx.lineTo(q[0] + 5 * s, q[1] + 6 * s); ctx.lineTo(q[0] - 4 * s, q[1] + 8 * s); ctx.closePath(); ctx.fill(); }
  /* brasas y savia flotando en el agua */
  for (let i = 0; i < 12; i++) { const x = c[0] + (hsh(i, 1) - .5) * 500 * s, y = c[1] + (hsh(i, 2) - .5) * 60 * s + Math.sin(t + i) * 3, warm = i % 3; ctx.fillStyle = warm ? 'rgba(255,160,80,.9)' : 'rgba(140,236,220,.9)'; ctx.beginPath(); ctx.arc(x, y, 2.4 * s * .5, 0, TAU); ctx.fill(); LGF(x, y, 26, warm ? '255,140,60' : '110,230,214', .35); }
  /* ondas */
  if (t > TSPLASH) { const age = t - TSPLASH, sp = [c[0] + 20 * s, c[1] - 4 * s]; for (let k = 0; k < 5; k++) { const ak = age - k * .22; if (ak < 0) continue; const r = (6 + ak * 70) * s; ctx.strokeStyle = `rgba(226,232,246,${.6 * Math.exp(-ak * .8)})`; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(sp[0], sp[1], r, r * .55, 0, 0, TAU); ctx.stroke(); } }
}
function shotPuddle(t, ticks, key) {
  drawSet(t, { refl: { full: puddleRefl }, floorFx: stdFloor, fx: t2 => {
    const P = PUDDLES.find(p => p.moonP), c = PJ(P.x, 0, P.z), s = PS(P.z);
    /* el vidrio real cae desde arriba del cuadro y entra en el agua */
    if (t2 > TSHARD && t2 < TSPLASH) { const f = (t2 - TSHARD) / (TSPLASH - TSHARD), y = lerp(-560, c[1] - 4 * s, f * f), x = c[0] + 20 * s, a = f * 6; ctx.fillStyle = 'rgba(220,232,240,.9)'; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * 18 * s, y + Math.sin(a) * 18 * s); ctx.lineTo(x + Math.cos(a + 2.5) * 8 * s, y + Math.sin(a + 2.5) * 8 * s); ctx.lineTo(x + Math.cos(a + 3.6) * 9 * s, y + Math.sin(a + 3.6) * 9 * s); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,250,.9)'; ctx.lineWidth = 1; ctx.stroke(); }
    if (t2 > TSPLASH && t2 < TSPLASH + 1.2) { const age = t2 - TSPLASH, sp = [c[0] + 20 * s, c[1] - 4 * s]; for (let i = 0; i < 16; i++) { const a = -PI * (.15 + hsh(i, 1) * .7), v = (60 + hsh(i, 2) * 140) * s; const x = sp[0] + Math.cos(a) * v * age, y = sp[1] + Math.sin(a) * v * age + 260 * s * age * age; if (y > sp[1] + 2) continue; ctx.fillStyle = 'rgba(226,234,244,.9)'; ctx.beginPath(); ctx.arc(x, y, 1.8 * s * .6, 0, TAU); ctx.fill(); } }
    dustFx(t2, .3);
  } });
}
/* ---------- la lista de planos ---------- */
const SHOTS = [
  { t0: 0, t1: 12, cam: lt => ({ x: lin(-640, 260, lt / 12), y: -165, zoom: lin(1.0, 1.06, lt / 12), ty: 30 }) },
  { t0: 12, t1: 19, cam: lt => ({ x: lin(-1480, -820, lt / 7), y: -100, zoom: 1.45, ty: 10 }) },
  { t0: 19, t1: 25.5, cam: lt => ({ x: 0, y: -150, zoom: lin(.98, 1.04, lt / 6.5), ty: 20 }) },
  { t0: 25.5, t1: 30, cam: lt => ({ x: -360, y: -190, zoom: 1.7, ty: 0 }), draw: shotDrops },
  { t0: 30, t1: 33.5, cam: lt => ({ x: lin(-385, -395, lt / 3.5), y: -128, zoom: lin(2.9, 3.1, lt / 3.5), ty: 40 }) },
  { t0: 33.5, t1: 36.5, draw: shotHand, cut: .15 },
  { t0: 36.5, t1: 45, cam: lt => ({ x: lin(-60, 10, lt / 8.5), y: -150, zoom: lin(1.06, 1.12, lt / 8.5), ty: 10 }) },
  { t0: 45, t1: 52, cam: lt => ({ x: lin(430, 410, lt / 7), y: -118, zoom: 2.35, ty: 30 }) },
  { t0: 52, t1: 60, cam: lt => ({ x: lin(-140, -40, lt / 8), y: -150, zoom: 1.0, ty: 30 }) },
  { t0: 60, t1: 66, cam: lt => ({ x: lin(390, 370, lt / 6), y: -125, zoom: 2.5, ty: 20 }) },
  { t0: 66, t1: 70, cam: lt => ({ x: lin(-60, -20, lt / 4), y: -150, zoom: 1.0, ty: 30 }) },
  { t0: 70, t1: 74, cam: lt => ({ x: 170, y: -40, zoom: 1.08, ty: lin(500, 540, lt / 4) }) },
  { t0: 74, t1: 80, cam: lt => ({ x: lin(-60, -120, lt / 6), y: -150, zoom: 1.0, ty: 140 }) },
  { t0: 80, t1: 90, cam: lt => ({ x: lin(-430, -400, lt / 10), y: -150, zoom: 1.85, ty: 50 }) },
  { t0: 90, t1: 95, cam: lt => ({ x: lin(-320, -280, lt / 5), y: -92, zoom: 2.3, ty: 0 }) },
  { t0: 95, t1: 103, cam: lt => ({ x: lin(-60, 520, sm((lt - 2.5) / 5.5)), y: -150, zoom: .98, ty: 60 }) },
  { t0: 103, t1: 109, cam: lt => ({ x: lin(160, 220, lt / 6), y: -230, zoom: 1.6, ty: 40 }) },
  { t0: 109, t1: 120, cam: lt => ({ x: lin(640, 420, sm((lt - 4) / 7)), y: -150, zoom: .95, ty: 60 }) },
  { t0: 120, t1: 124, cam: lt => ({ x: 0, y: -150, zoom: lin(1.2, 1.15, lt / 4), ty: 20 }) },
  { t0: 124, t1: 131, cam: lt => ({ x: 0, y: -150, zoom: lin(1.0, 1.08, lt / 7), ty: 30 }) },
  { t0: 131, t1: 138, cam: lt => ({ x: lin(-60, 60, lt / 7), y: -55, zoom: 1.5, ty: -40 }) },
  { t0: 138, t1: 143, cam: lt => ({ x: 0, y: -125, zoom: lin(3.0, 3.3, lt / 5), ty: 40 }) },
  { t0: 143, t1: 150, cam: lt => ({ x: 0, y: -150, zoom: .96, ty: 40 }) },
  { t0: 150, t1: 154.6, cam: lt => ({ x: 0, y: -150, zoom: lin(1.0, 1.14, sm(lt / 3.2)), ty: 30 }) },
  { t0: 154.6, t1: 167, cam: lt => ({ x: 0, y: -150, zoom: .92, ty: 90 }) },
  { t0: 167, t1: 180, cam: lt => ({ x: lin(-40, -30, lt / 8), y: -420, zoom: lin(1.45, 1.55, lt / 8), ty: -1500 }), draw: shotPuddle },
];
SHOTS.forEach((s, i) => s.i = i);
const FILM = {
  DUR: 180, CHAPTERS,
  reset() { },
  draw(t, ticks) {
    const sh = SHOTS.find(s => t >= s.t0 && t < s.t1) || SHOTS[SHOTS.length - 1];
    const [sx, sy] = shakeAt(t); SHX = sx * U; SHY = sy * U; T0();
    if (sh.cam) camSet(sh.cam(t - sh.t0, t));
    WIND.x = windAt(t) * 2.4 + (t > 61.4 && t < 63 ? -2.5 * (1 - sm((t - 61.4) / 1.6)) : 0) + (t > 153.25 && t < 154.5 ? 4 : 0);
    const key = 's' + sh.i; TICKS = ticks;
    if (sh.draw) sh.draw(t, ticks, key);
    else drawSet(t, { items: stdItems(key), floorFx: stdFloor, wallFx: sapWall, fx: stdFx });
    FILM._ticks = ticks;
    /* destellos invertidos en los impactos (1–2 fotogramas) */
    for (const ti of [WHIPHIT, TBOLT + .07, 110.22, TBEAM + .26]) if (t > ti && t < ti + .045) fullInvert();
    whiteOut(t);
    /* cortes: un parpadeo de tinta muy breve */
    for (const s of SHOTS) { const dd = Math.abs(t - s.t0); if (s.t0 > 0 && dd < (s.cut ?? .1) && !(s.t0 > 153 && s.t0 < 155)) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = (1 - dd / (s.cut ?? .1)) * .55; ctx.fillStyle = 'rgb(12,10,14)'; ctx.fillRect(0, 0, W, H); ctx.restore(); T0(); } }
    post(t);
    titles(t);
  },
};
/* títulos */
function titles(t) {
  ctx.save(); L0s();
  const a = win(t, 1.6, 8.6, 1.4, 1.6);
  if (a > .01) { ctx.globalAlpha = a; ctx.textAlign = 'center'; ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 18 * U; ctx.fillStyle = 'rgba(240,232,214,.95)'; ctx.font = '500 66px "Cormorant Garamond", Georgia, serif'; ctx.fillText('El Invernadero de Cristal y Ceniza', 0, -300 + (1 - a) * 8); }
  const e = clamp((t - 174.4) / 2);
  if (e > 0) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = e; ctx.fillStyle = 'rgb(8,7,10)'; ctx.fillRect(0, 0, W, H); L0s(); const b = win(t, 176.6, 181, 1.2, 1); ctx.globalAlpha = b; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(236,228,210,.9)'; ctx.font = 'italic 500 40px "Cormorant Garamond", Georgia, serif'; ctx.fillText('El Invernadero de Cristal y Ceniza', 0, -20); ctx.font = '500 26px "Cormorant Garamond", Georgia, serif'; ctx.fillStyle = 'rgba(236,228,210,.6)'; ctx.fillText('Fin', 0, 40); }
  ctx.restore(); T0();
}
