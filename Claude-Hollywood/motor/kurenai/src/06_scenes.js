/* =====================================================================
   GUION — «KURENAI · El Último Pétalo»   (≈ 6 min 26 s)
   Acto I  Planteamiento : prólogo · valle · cerezo · presagio · ejército · fuego
   Acto II Nudo          : camino bajo la lluvia · emboscada · duelo · clímax
   Acto III Desenlace    : lluvia · retorno · florecimiento · título
   ===================================================================== */
const END = 386;
const B = {};
const SC = [];
function scene(t0, t1, fi, fo, o) { SC.push(Object.assign({ t0, t1, fi, fo, on: false }, o)); }
const SUNX = 300, SUNY = -250, SUNR = 78;
let FLASH = 0, CUT = null, SPAN = 2600;
let BLOS = [], PET = [], SMOKE = [], INKD = [], LEAF = [];
const groundY = (x, y, s0, rough) => y - Math.abs(FBM(x * .004, s0, 3)) * rough * 2.2;

/* ---------- construcción (en la carga, por pasos) ---------- */
function buildTasks() {
  SPAN = SW * 1.45 + 200;
  const T = [];
  T.push(() => { GRAIN = makeGrain(); B.paper = makePaper(W, H); });
  T.push(() => { B.tex = makeTexture(Math.ceil(W / 2), Math.ceil(H / 2)); B.vig = makeVignette(Math.ceil(W / 4), Math.ceil(H / 4)); B.bars = genBars(); });
  T.push(() => {
    PET = ['176,24,40', '196,40,54', '160,18,34', '206,70,80', '186,30,46'].map((c, i) => genPetal(c, i + 1));
    BLOS = ['176,24,40', '196,46,58', '166,20,36', '208,78,88', '186,34,48', '150,16,30'].map((c, i) => genBlossom(c, i + 10));
    SMOKE = [0, 1, 2, 3].map(i => genBlob('60,56,56', 40 + i, 64, .1, 9));
    INKD = [0, 1, 2].map(i => genBlob('18,14,14', 60 + i, 24, .5, 5));
    B.ember = genEmber(); B.flames = [0, 1, 2].map(i => genFlame(80 + i));
    LEAF = [0, 1, 2].map(i => { const c = mk(64, 64), g = c.getContext('2d'); seed(200 + i); g.translate(32, 32); g.rotate(rnd(-.3, .3)); brush(g, [[-28, 0], [0, -3 + i], [28, 2]], { w: u => Math.sin(PI * u) * 9, col: '34,40,34', a: .85, bristles: 3, body: 1, dryStart: .95, seed: i }); return c; });
  });
  T.push(() => { B.bloom = genInkBloom(170, 11); B.sun = genSun(170); B.sunBl = new Bleed(B.sun, tmSeeds(B.sun, [{ x: -30, y: -20 }], { amp: .4, ns: .012, res: 3 }), { edge: .55, edgeCol: '120,10,20', soft: .08 }); });
  T.push(() => {
    seed(3); const pts = [], a0 = -2.05, sweep = 5.55;
    for (let i = 0; i <= 140; i++) { const u = i / 140, a = a0 + u * sweep, rr = 250 * (1 + .035 * Math.sin(u * 7 + 1) + .02 * N2(u * 5, 2)) - u * 14; pts.push([Math.cos(a) * rr, Math.sin(a) * rr]); }
    B.ensoPts = pts; B.ensoW = u => 44 * (.62 + .38 * Math.sin(PI * Math.min(1, u * 1.25 + .08))) * (1 - u * .45);
    B.enso = Spr(-330, -330, 330, 330, 1); brush(B.enso.g, pts, { w: B.ensoW, col: INK, a: .9, bristles: 16, body: .72, dryStart: .62, dryAll: .04, dryFreq: .03, seed: 77 });
  });
  const mc = [
    { seed: 11, n: 10, hmax: 230, wk: 110, y0: 40, depth: 260, rough: 26, col: '160,162,168', alpha: .05, band: 30, mist: .25, cun: 0 },
    { seed: 12, n: 8, hmax: 300, wk: 140, y0: 130, depth: 280, rough: 34, col: '118,118,122', alpha: .06, band: 40, mist: .35, cun: 1, cunW: .8, big: [-260] },
    { seed: 13, n: 7, hmax: 240, wk: 150, y0: 220, depth: 300, rough: 36, col: '86,82,82', alpha: .07, band: 46, mist: .45, cun: 1, cunW: 1 },
    { seed: 14, n: 6, hmax: 190, wk: 170, y0: 310, depth: 300, rough: 40, col: '56,50,48', alpha: .08, band: 50, mist: .5, cun: 1, cunW: 1.3 },
    { seed: 15, n: 5, hmax: 140, wk: 200, y0: 420, depth: 300, rough: 40, col: '32,28,26', alpha: .09, band: 50, mist: .6, cun: 1, cunW: 1.6 },
  ];
  B.mtn = [];
  mc.forEach((c, i) => T.push(() => { const m = genMount(Object.assign({ span: SPAN }, c)); m.bl = new Bleed(m.sp, tmSeeds(m.sp, m.peaks.map(p => ({ x: p.x, y: p.y, d: rnd(0, 120) })), { amp: .32, ns: .006, res: 5 }), { edge: .32, soft: .08, edgeCol: c.col.split(',').map(v => Math.round(v * .6)).join(',') }); B.mtn[i] = m; }));
  T.push(() => { B.mist = [1, 2, 3].map(s => genMist(1300, 70, s)); });
  T.push(() => { B.tree = genTree({ seed: 9, len: 210, w: 40, depth: 7, speed: 1, ang: -PI / 2 + .34, flS: 1.1 }); });
  T.push(() => { B.gC = genGround(SPAN, 340, '76,68,60', .055, 21, 26, 260); B.storm = genStorm(SPAN, 31); });
  T.push(() => { const F = fig(POSE.seiza, { sword: 'ground' }); B.seiza = figSprite(F, 2.9, { flip: true }); B.seizaBl = new Bleed(B.seiza, tmSeeds(B.seiza, [{ x: 0, y: -60 }], { amp: .5, ns: .03, res: 2 }), { soft: .1, edge: .6 }); B.seizaF = F; });
  T.push(() => { B.ridge = genGround(SPAN, 190, '26,22,22', .1, 33, 46, 520); B.sky2 = genSky(SPAN, '44,40,44', 34, -580, 260, .8); });
  T.push(() => { B.village = genVillage(SPAN * .9, 250, 41); B.gF = genGround(SPAN, 444, '28,24,22', .1, 42, 10, 220); });
  T.push(() => {
    B.bam = [];
    const cfg = [{ w: 9, col: '140,142,140', a: .38, h: 1250, leaves: 7 }, { w: 15, col: '78,82,78', a: .7, h: 1250, leaves: 9 }, { w: 34, col: '22,24,22', a: .95, h: 1500, leaves: 10 }];
    cfg.forEach((c, li) => { B.bam[li] = []; for (let v = 0; v < 4; v++) B.bam[li].push(genBamboo(Object.assign({ seed: 300 + li * 10 + v, q: li === 2 ? .7 : .6 }, c))); });
  });
  T.push(() => { B.splat = [0, 1, 2, 3, 4].map(i => genSplat(500 + i, i === 4 ? 70 : 46)); B.pool = [0, 1, 2].map(i => genPool(120, 600 + i)); });
  T.push(() => { B.night = genSky(SPAN, '30,28,36', 61, -560, 330, 1.25); B.moon = genMoon(250); B.gD = genGround(SPAN, 300, '20,18,20', .12, 71, 26, 420); });
  T.push(() => { B.skyR = genSky(SPAN, '120,118,126', 81, -560, 260, .5); B.gR = genGround(SPAN, 330, '56,52,54', .08, 82, 18, 300); });
  T.push(() => { B.skyD = genSky(SPAN, '214,168,140', 91, -560, 200, .45); B.gT = genGround(SPAN, 370, '74,66,60', .07, 92, 14, 260); });
  T.push(() => {
    B.pp = new Parts(320, { spr: PET, size: 7, grav: 16, drag: .55, life: [10, 18], fin: .6, floor: 620 });
    B.emb = new Parts(200, { spr: [B.ember], size: 4.2, grav: -48, drag: .45, life: [2.5, 5.5], flip: false, fin: .3 });
    B.smk = new Parts(90, { spr: SMOKE, size: 54, grav: -34, drag: .25, life: [7, 11], flip: false, fin: 1.5, grow: .35 });
    B.ink = new Parts(160, { spr: INKD, size: 3.5, grav: 260, drag: .9, life: [.8, 2], flip: false, fin: .05, resp: .05 });
    B.lf = new Parts(60, { spr: LEAF, size: 9, grav: 22, drag: .6, life: [5, 9], fin: .3, sy: .7 });
    B.tp = new Parts(260, { spr: PET, size: 7.5, grav: 7, drag: .4, life: [14, 22], fin: 1.2, floor: 640 });
    rainInit(520);
    B.G1 = grassInit(170, -SW * .8, SW * .8, 302, 40, 120, 5); B.G2 = grassInit(90, -SW * .8, SW * .8, 330, 70, 170, 6);
    B.GB = grassInit(260, -400, 2200, 404, 14, 46, 7); B.GC = grassInit(120, -SW * .7, SW * .7, 342, 8, 30, 8);
    seed(777); B.drips = []; for (let i = 0; i < 90; i++) B.drips.push({ x: rnd(-SW * .55, SW * .55), y: rnd(-380, 300), l: rnd(80, 420), w: rnd(1.5, 6), t: rnd(311, 316), a: rnd(.15, .4) });
    seed(55); B.drops = []; for (let i = 0; i < 16; i++) { const a = rnd(TAU), d = rnd(200, 330); B.drops.push({ x: Math.cos(a) * d, y: Math.sin(a) * d, r: rnd(2, 7) }); }
    seed(66); B.army = []; for (let i = 0; i < 30; i++) { const x = lerp(-SW * .62, SW * .62, i / 29) + rnd(-25, 25); B.army.push({ x, s: rnd(.5, .68), kasa: R() < .5, ban: R() < .45, red: R() < .5, spear: R() < .6, ph: rnd(TAU), t: 120.5 + Math.abs(x) / (SW * .6) * 6 + rnd(0, 1.2) }); }
  });
  return T;
}

/* ---------- utilidades de escena ---------- */
function mtnDraw(i, d, a = 1, p = 1) { L(d); const m = B.mtn[i]; dS(m.sp, 0, 0, 1, 0, a, m.bl.get(p)); }
function mistDraw(T, i, y, d, a, sp = 8) { mode('source-over'); L(d); const ms = B.mist[i % 3], w = 1300, off = ((T * sp + i * 517) % (SPAN + w)) - SPAN / 2 - w / 2; dS(ms, off, y, 1, 0, a); dS(ms, off - SPAN * .55, y + 18, .9, 0, a * .8); mode('multiply'); }
function sunDraw(x, y, s, a, p = 1) { dS(B.sun, x, y, s, 0, a, B.sunBl.get(p)); }
function treeDraw(T, x, y, s, o = {}) {
  const tr = B.tree; L(o.d ?? 1);
  const rot = (N2(T * .25, 3) * .008 + Math.sin(T * .9) * .003) * (o.sway ?? 1);
  dS(tr.sp, x, y, s, rot, o.a ?? 1, tr.bl.get(o.p ?? 1));
  if (o.dark) dS(tr.sp, x, y, s, rot, o.dark, tr.bl.get(o.p ?? 1));
  if (o.hz !== undefined && o.hz > 0) dS(tr.hz, x, y, s, rot, o.hza ?? .9, tr.hzb.get(o.hz));
  if (o.bt0 !== undefined) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    for (const f of tr.fl) {
      const tb = o.bt0 + f.t * o.bdur + (f.ph / TAU) * 2.5, k = eo(rg(T, tb, tb + 2.6)); if (k <= 0) continue;
      const sw = o.sway ?? 1, jx = N2(T * .7 + f.ph, 1) * 2 * sw, jy = N2(T * .6, f.ph) * 1.5 * sw, sz = 24 * f.s * (.25 + .75 * k);
      ctx.globalAlpha = SA * k * (o.ba ?? .95); ctx.save(); ctx.translate(f.x + jx, f.y + jy); ctx.rotate(f.r + N2(T * .3, f.ph) * .3); ctx.drawImage(BLOS[f.v], -sz / 2, -sz / 2, sz, sz); ctx.restore();
    }
    ctx.restore(); ctx.globalAlpha = 1;
  }
}
function petalsFromTree(T, dt, x, y, s, rate, t0) {
  const fl = B.tree.fl;
  B.pp.emit(dt, rate, () => { const f = fl[(R() * fl.length) | 0]; if (T < t0 + f.t * 12) return; B.pp.spawn(x + f.x * s, y + f.y * s, rnd(-10, 10), rnd(0, 10)); });
}
function hay(F, x, y, s, flip, T, o = {}) { drawFig(F, x, y, s, flip, Object.assign({ rib: { wind: o.wind ?? .7, sp: o.rsp ?? 5 }, t: T }, o)); }

/* ===================== PRÓLOGO (0–24) ===================== */
scene(0, 24.02, .01, .02, {
  draw(T) {
    CAM = { z: 1, x: 0, y: 0 }; L0();
    const k = eio(rg(T, 15, 22.5)), gx = lerp(0, SUNX, k), gy = lerp(0, SUNY, k), gs = lerp(1, SUNR / 170, k);
    if (T > 1.2 && T < 2.62) { const f = ei(rg(T, 1.2, 2.6)), y = lerp(-620, -4, f); ctx.fillStyle = `rgba(${INK},.92)`; ctx.beginPath(); ctx.ellipse(0, y, 4.5, 6 + f * 12, 0, 0, TAU); ctx.fill(); }
    const ba = 1 - sm(rg(T, 10.5, 18.5));
    if (T > 2.6 && ba > 0) {
      dS(B.bloom.sp, 0, 0, 1 + .18 * eo(rg(T, 2.6, 14)), 0, ba * .92, B.bloom.bl.get(eo(rg(T, 2.6, 9.5))));
      const dp = eo(rg(T, 2.6, 3.1)); ctx.fillStyle = `rgba(${INK},${.8 * ba * SA})`;
      for (const d of B.drops) { ctx.beginPath(); ctx.arc(d.x * dp, d.y * dp, d.r * (dp < 1 ? .7 : 1), 0, TAU); ctx.fill(); }
    }
    ctx.save(); ctx.translate(gx, gy); ctx.scale(gs, gs);
    const ep = rg(T, 7.2, 10.6), ea = 1 - sm(rg(T, 16.5, 21.5));
    if (ep > 0 && ea > 0) {
      if (ep < 1) { ctx.globalAlpha = ea * SA; brush(ctx, B.ensoPts, { w: B.ensoW, prog: eio(ep), col: INK, a: .9, bristles: 16, body: .72, dryStart: .62, dryAll: .04, dryFreq: .03, seed: 77 }); ctx.globalAlpha = 1; }
      else dS(B.enso, 0, 0, 1, 0, ea);
    }
    if (T > 10.4) sunDraw(0, 0, 1, 1, eo(rg(T, 10.4, 15.5)));
    ctx.restore();
  }
});

/* ===================== VALLE DE HOSHIMURA (17–64) ===================== */
const MD = [.12, .25, .45, .7, 1];
scene(17, 64, .5, 6, {
  draw(T) {
    CAM = { z: 1 + .07 * eio(rg(T, 17, 64)), x: lerp(-30, 40, rg(T, 17, 64)), y: lerp(0, 10, rg(T, 17, 64)) };
    if (T >= 24) { L(.05); sunDraw(SUNX, SUNY, SUNR / 170, 1); }
    const rt = [17, 19.5, 22.5, 26, 29.5];
    for (let i = 0; i < 5; i++) {
      mtnDraw(i, MD[i], 1, eo(rg(T, rt[i], rt[i] + 8)));
      if (i < 4) mistDraw(T, i, [80, 170, 260, 360][i], MD[i] + .05, .5 * rg(T, rt[i] + 2, rt[i] + 6), 6 + i * 3);
    }
    birds(T, { t0: 33, t1: 57, x0: -SW * .7, x1: SW * .5, y0: -180, y1: -300, n: 9, spread: 70, s: 9, seed: 3, d: .35 });
    birds(T, { t0: 44, t1: 62, x0: SW * .7, x1: -SW * .2, y0: -120, y1: -220, n: 4, spread: 40, s: 6, seed: 8, d: .2, a: .5 });
  }
});

/* ===================== EL CEREZO + PRESAGIO (58–124) ===================== */
const TX = () => -SW * .3, TY = 345, TSC = 1.05, HX1 = 170, GY = 345;
scene(58, 124, 6, 6, {
  enter(T) { B.pp.clear(); if (T > 82) B.pp.warm(4, T, (dt, t) => { WIND = cherryWind(t); petalsFromTree(t, dt, TX(), TY, TSC, cherryRate(t), 70); }); },
  draw(T, dt) {
    const om = rg(T, 104, 118);
    CAM = { z: 1 + .1 * eio(rg(T, 58, 104)) + .06 * eio(om), x: lerp(-40, 60, eio(rg(T, 58, 110))), y: lerp(0, 15, rg(T, 58, 110)) };
    WIND = cherryWind(T);
    SHK = om > 0 ? om * 2.2 * (N2(T * 2, 4) * .5 + .5) : 0;
    // cielo lejano
    L(.05); sunDraw(SUNX, SUNY, SUNR / 170, 1 - om * .6);
    mtnDraw(0, .12, .7, eo(rg(T, 58, 64))); mtnDraw(1, .25, .55, eo(rg(T, 59, 66)));
    mistDraw(T, 1, 200, .3, .5, 8 + om * 40);
    if (T > 104) { L(.2); dS(B.storm.sp, 0, 0, 1, 0, 1, B.storm.bl.get(eo(rg(T, 104.5, 119)))); }
    birds(T, { t0: 108.5, t1: 118, x0: SW * .75, x1: -SW * .8, y0: -260, y1: -150, n: 7, spread: 90, s: 13, seed: 21, d: .5, crow: 1, a: .9, fr: 11 });
    L(1); dS(B.gC, 0, 0, 1, 0, sm(rg(T, 58, 63)));
    SA *= sm(rg(T, 60, 66)); grassDraw(B.GC, T, 1, '50,46,40', .5, 1.2, .5 + om * 2); SA = fade(T, 58, 124, 6, 6);
    // árbol
    treeDraw(T, TX(), TY, TSC, { p: eo(rg(T, 60, 75)), bt0: 69, bdur: 13, hz: rg(T, 71, 88), sway: 1 + om * 6 });
    // Hayato
    hayatoCherry(T);
    // pétalos
    if (dt > 0) { petalsFromTree(T, dt, TX(), TY, TSC, cherryRate(T), 70); B.pp.update(dt, T); }
    B.pp.draw(1, 1);
  }
});
function cherryWind(T) { const om = rg(T, 103, 117); return { x: 18 + om * 190 + Math.sin(T * .3) * 6, y: -om * 8, g: 26 + om * 110 }; }
function cherryRate(T) { return T < 80 ? 0 : lerp(9, 16, rg(T, 80, 100)) + rg(T, 104, 114) * 45; }
function hayatoCherry(T) {
  const x = HX1, s = 2.9, om = rg(T, 103, 117);
  if (T < 112.5) {
    L(1); const img = B.seizaBl.get(rg(T, 64, 71.5)); dS(B.seiza, x, GY, 1, 0, 1, img);
    const ra = sm(rg(T, 69, 72)); if (ra > 0) { ctx.save(); ctx.translate(x, GY); ctx.scale(-s, s); const hb = ad(ad(B.seizaF.Hd, B.seizaF.hr, -5.5), B.seizaF.hu, 1.5); ctx.globalAlpha = ra * SA; ribbon(ctx, hb[0], hb[1], T, { wind: .35 + om * .65, sp: 3 + om * 6 }); ctx.restore(); ctx.globalAlpha = 1; }
  } else {
    let P, sw = 'ground';
    if (T < 114.3) P = mixP(POSE.seiza, POSE.kneel, eio(rg(T, 112.5, 114.3)));
    else { P = mixP(POSE.kneel, POSE.stand, eio(rg(T, 114.3, 116.6))); sw = 'sheath'; }
    if (T > 117) P = mixP(POSE.stand, POSE.ready, eio(rg(T, 117, 119)) * .5);
    L(1); hay(fig(P, { sword: sw }), x, GY, s, true, T, { wind: 1, rsp: 9 });
  }
}

/* ===================== EL CLAN DE LA SOMBRA (118–146) ===================== */
scene(118, 146, 6, 6, {
  draw(T, dt) {
    CAM = { z: 1 + .2 * eio(rg(T, 118, 146)), x: lerp(0, -10, rg(T, 118, 146)), y: lerp(-30, -70, eio(rg(T, 118, 146))) };
    WIND = { x: -60, y: 0, g: 40 };
    L(.12); dS(B.sky2); mtnDraw(1, .2, .55); L(.2); dS(B.storm.sp, 0, 0, 1, 0, .9);
    mistDraw(T, 2, 120, .3, .35, 30);
    // relámpago
    const lf = rg(T, 130.9, 131) * (1 - rg(T, 131, 131.8)) + rg(T, 131.25, 131.3) * (1 - rg(T, 131.3, 132.4));
    FLASH = Math.max(FLASH, lf * .75);
    // soldados en la cresta (detrás de la cresta: se dibujan antes)
    L(1);
    for (const a of B.army) {
      const k = sm(rg(T, a.t, a.t + 2)); if (k <= 0) continue;
      const gy = groundY(a.x, 190, 33, 46) + 6, P = mixP(POSE.stand, POSE.ready, .3 + Math.sin(T * .8 + a.ph) * .05);
      const F = fig(P, { kasa: a.kasa, helmet: !a.kasa, noHorns: true, sword: 'sheath' });
      drawFig(F, a.x, gy, a.s * 1.4, true, { a: k, halo: k < 1 ? lerp(14, 2.5, k) : 0, minor: 1 });
      const sx = a.x - 12 * a.s, top = gy - 150 * a.s;
      if (a.spear) { ctx.strokeStyle = `rgba(18,15,14,${.9 * k * SA})`; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(sx, gy - 40 * a.s); ctx.lineTo(sx + 4, top - 30 * a.s); ctx.stroke(); }
      if (a.ban) {
        const bx = a.x + 14 * a.s, bt = gy - 230 * a.s; ctx.strokeStyle = `rgba(18,15,14,${.9 * k * SA})`; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(bx, gy - 30 * a.s); ctx.lineTo(bx, bt); ctx.stroke();
        ctx.fillStyle = a.red ? `rgba(170,22,34,${.85 * k * SA})` : `rgba(22,18,16,${.85 * k * SA})`; ctx.beginPath(); ctx.moveTo(bx, bt);
        const fw = 26 * a.s * 1.4, fh = 90 * a.s * 1.4;
        for (let i = 0; i <= 8; i++) { const f = i / 8; ctx.lineTo(bx - fw - Math.sin(T * 4 + a.ph + f * 3) * 4 * f, bt + f * fh); }
        ctx.lineTo(bx, bt + fh); ctx.closePath(); ctx.fill();
      }
    }
    // Kagemaru sobre la cresta
    const kk = sm(rg(T, 129.4, 133.5));
    if (kk > 0) {
      const P = mixP(POSE.stand, POSE.ready, .25), F = fig(P, { helmet: 1, armor: 1, cape: 1, wind: .9, t: T, sword: 'sheath' });
      L(1); drawFig(F, 40, groundY(40, 190, 33, 46) + 14, 2.7, true, { a: kk, halo: lerp(40, 3, kk) });
    }
    L(1); dS(B.ridge);
  }
});

/* ===================== LA ALDEA ARDE (140–176) ===================== */
scene(140, 176, 6, 4, {
  enter(T) { B.emb.clear(); B.smk.clear(); if (T > 142) { B.emb.warm(3, T, (dt) => fireEmit(dt)); B.smk.warm(6, T, (dt) => fireEmit(dt)); } },
  draw(T, dt) {
    CAM = { z: 1.02 + .1 * eio(rg(T, 140, 176)), x: lerp(-20, 30, rg(T, 140, 176)), y: 0 };
    WIND = { x: 25, y: -10, g: 40 };
    const fl = .85 + .15 * N2(T * 3, 1);
    L(0); ctx.globalAlpha = SA;
    const gr = ctx.createLinearGradient(0, -500, 0, 500); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(.55, `rgba(214,110,80,${.45 * fl})`); gr.addColorStop(1, `rgba(170,40,30,${.65 * fl})`);
    ctx.fillStyle = gr; ctx.fillRect(-SW, -520, SW * 2, 1040); ctx.globalAlpha = 1;
    L(.12); dS(B.sky2, 0, 0, 1, 0, .7); mtnDraw(1, .25, .7); mtnDraw(2, .4, .5);
    if (dt > 0) { fireEmit(dt); B.smk.update(dt, T); B.emb.update(dt, T); }
    B.smk.draw(.6, .6);
    // aldea
    L(.7); dS(B.village.sp);
    let i = 0;
    for (const f of B.village.fires) {
      i++; const sc = f.s * 1.25 * (1 + .25 * N2(T * 2.5, i)), sy = 1 + .3 * N2(T * 4, i * 3);
      ctx.globalAlpha = SA * .55; ctx.drawImage(B.ember, f.x - 70 * sc, f.y - 120 * sc, 140 * sc, 160 * sc);
      ctx.globalAlpha = SA * .9; const fm = B.flames[i % 3]; ctx.drawImage(fm, f.x - 32 * sc, f.y - 128 * sc * sy, 64 * sc, 128 * sc * sy);
    }
    ctx.globalAlpha = 1;
    // cerezo en llamas
    const tx = -SW * .4, ty = 430, ts = .78;
    treeDraw(T, tx, ty, ts, { dark: .8, sway: 2 });
    L(1); i = 0;
    for (const tp of B.tree.tips) { if (i++ % 3) continue; const sc = .5 * (1 + .3 * N2(T * 3, i)), x = tx + tp.x * ts, y = ty + tp.y * ts; ctx.globalAlpha = SA * .8 * sm(rg(T, 142 + (i % 7), 146 + (i % 7))); ctx.drawImage(B.flames[i % 3], x - 32 * sc, y - 120 * sc, 64 * sc, 128 * sc); }
    ctx.globalAlpha = 1;
    B.emb.draw(.85, 1);
    L(1); dS(B.gF);
    const P = mixP(POSE.stand, POSE.ready, eio(rg(T, 162, 166)) * .6), F = fig(P, { sword: 'sheath' });
    hay(F, SW * .26, 436, 2.9, true, T, { wind: .8 });
  }
});
function fireEmit(dt) {
  const fs = B.village.fires;
  B.emb.emit(dt, 40, () => { const f = pick(fs); B.emb.spawn(f.x, f.y - 30 + rnd(-10, 10), rnd(-20, 20), rnd(-60, -20)); });
  B.smk.emit(dt, 7, () => { const f = pick(fs); B.smk.spawn(f.x, f.y - 60, rnd(-5, 5), -20); });
}

/* ===================== ACTO II — EL CAMINO DE BAMBÚ / EMBOSCADA (172–246) ===================== */
const HXS = 1011;
function hxWalk(T) { if (T < 205) return -300 + 38 * (T - 172); const d = Math.min(T, 208) - 205; return 954 + 38 * (d - d * d / 6); }
function hxPos(T) { if (T < 236) return hxWalk(T); const d = T - 236; return HXS + 38 * (d < 2 ? d * d / 4 : d - 1); }
let lastStep = 0;
scene(172, 246, 4, 6, {
  enter(T) { B.ink.clear(); B.lf.clear(); for (const n of NIN) n.fired = T > n.hit + .25; lastStep = Math.floor(hxPos(T) / 44); },
  draw(T, dt) {
    const hx = hxPos(T), camx = Math.min(hxWalk(T), HXS) + 70;
    CAM = { z: 1.04 + .08 * eio(rg(T, 209, 216)) - .06 * eio(rg(T, 226, 232)), x: camx, y: -10 };
    WIND = { x: 30, y: 0, g: 30 };
    // fondo brumoso
    L(0); ctx.globalAlpha = SA; const gr = ctx.createLinearGradient(0, -500, 0, 500); gr.addColorStop(0, 'rgba(150,150,150,.25)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = gr; ctx.fillRect(-SW, -520, SW * 2, 1040); ctx.globalAlpha = 1;
    bambooLayer(T, 0, .35, 330, 130, 1);
    mistDraw(T, 0, 210, .45, .6, 10); mistDraw(T, 2, 330, .5, .55, 14);
    bambooLayer(T, 1, .68, 395, 150, 1);
    mistDraw(T, 1, 380, .75, .45, 18);
    // suelo
    L(1); const g2 = ctx.createLinearGradient(0, 380, 0, 560); g2.addColorStop(0, `rgba(60,56,52,${.0 * SA})`); g2.addColorStop(.15, `rgba(60,56,52,${.35 * SA})`); g2.addColorStop(1, `rgba(30,28,26,${.75 * SA})`);
    ctx.fillStyle = g2; ctx.fillRect(camx - SW, 380, SW * 2, 300);
    grassDraw(B.GB, T, 1, '40,38,34', .55, 1.1, .6);
    ambush(T, dt);
    // Hayato
    const P = hayBamboo(T), F = fig(P.p, { kasa: 1, sword: P.sw });
    L(1); hay(F, hx, 404, 2.6, P.flip, T, { wind: .75 });
    if (T < 236 || T > 236.5) { const st = Math.floor(hx / 44); if (st !== lastStep && dt > 0 && (T < 208 || T > 236)) step(0, .05); lastStep = st; }
    bambooCut(T);
    if (dt > 0) { B.ink.update(dt, T); B.lf.update(dt, T); if (T > 225.3 && T < 233) B.lf.emit(dt, 6, () => B.lf.spawn(HXS + rnd(-200, 400), -520, rnd(-10, 10), 20)); }
    B.ink.draw(1, 1); B.lf.draw(1, .9);
    bambooLayer(T, 2, 1.4, 600, 520, 1);
    rainDraw(dt, .55 + rg(T, 210, 214) * .35 - rg(T, 228, 240) * .4, .16, .22);
  }
});
function bambooLayer(T, li, d, by, gap, a) {
  L(d); const vs = B.bam[li], cx = CAM.x * d, x0 = cx - SW * .75 / (1 + (CAM.z - 1) * d), x1 = cx + SW * .75;
  seed(li * 99 + 1);
  let x = -1600 * d - 400;
  while (x < 2600 * d + 800) {
    const sp = gap * rnd(.6, 1.5); x += sp;
    const v = (R() * 4) | 0, sc = rnd(.85, 1.15), yo = rnd(-10, 20), ph = rnd(TAU);
    if (x < x0 - 200 || x > x1 + 200) continue;
    if (li === 1 && Math.abs(x - (HXS + 170) * d) < 30) continue;
    const sk = (N2(x * .01, T * .3) * .035 + Math.sin(T * .9 + ph) * .012) * (li === 2 ? .6 : 1);
    ctx.save(); ctx.translate(x, by + yo); ctx.transform(1, 0, sk, 1, 0, 0); dS(vs[v], 0, 0, sc, 0, a); ctx.restore();
  }
}
function hayBamboo(T) {
  let p, sw = 'sheath', flip = false;
  const wp = walkP(hxPos(T) / 88 * TAU);
  if (T < 205) p = wp;
  else if (T < 209) p = mixP(wp, POSE.stand, eio(rg(T, 205.5, 208.5)));
  else if (T < 215.6) p = mixP(POSE.stand, POSE.ready, eio(rg(T, 212, 214)));
  else if (T < 216.3) p = mixP(POSE.ready, POSE.iai, eio(rg(T, 215.6, 216.25)));
  else if (T < 218) { p = mixP(POSE.iai, POSE.slash, eo(rg(T, 216.3, 216.46))); sw = T > 216.36 ? 'hand' : 'sheath'; }
  else if (T < 223.2) { p = mixP(POSE.slash, POSE.guard, eio(rg(T, 218, 219.6))); sw = 'hand'; }
  else if (T < 223.52) { p = mixP(POSE.guard, POSE.slash, eo(rg(T, 223.2, 223.38))); sw = 'hand'; }
  else if (T < 228) { p = mixP(POSE.guard, POSE.slash, eo(rg(T, 223.52, 223.66))); sw = 'hand'; flip = T < 226.5; if (T > 225.5) p = mixP(p, POSE.guard, eio(rg(T, 225.5, 226.5))); }
  else if (T < 230) { p = mixP(POSE.guard, POSE.low, eio(rg(T, 228, 229))); sw = 'hand'; }
  else if (T < 236) { p = mixP(POSE.low, POSE.stand, eio(rg(T, 230, 231.6))); sw = T < 231 ? 'hand' : 'sheath'; }
  else p = mixP(POSE.stand, wp, eio(rg(T, 236, 237)));
  return { p, sw, flip };
}
const NIN = [
  { px: 330, pool: [211.5, 213.5], rise: [213.2, 215], leap: [216.0, 216.45], hit: 216.45, splat: 0, ex: 90 },
  { px: 360, pool: [219.3, 221], rise: [220.5, 222.3], leap: [223.0, 223.38], hit: 223.38, splat: 1, ex: 70 },
  { px: -330, pool: [219.6, 221.2], rise: [220.8, 222.5], leap: [223.0, 223.64], hit: 223.64, splat: 2, ex: -70 },
];
function ambush(T, dt) {
  if (T < 211 || T > 246) return;
  L(1);
  for (const n of NIN) {
    const x0 = HXS + n.px, pa = 1 - sm(rg(T, n.hit + 1, n.hit + 6));
    dS(B.pool[NIN.indexOf(n)].sp, x0, 406, 1, 0, pa, B.pool[NIN.indexOf(n)].bl.get(eo(rg(T, n.pool[0], n.pool[1]))));
    if (T > n.rise[0] && T < n.hit + 1.2) {
      const k = sm(rg(T, n.rise[0], n.rise[1])), lp = rg(T, n.leap[0], n.leap[1]);
      let x = x0, y = 404 + (1 - k) * 50, P = POSE.crouch, a = k;
      const flip = n.px > 0;
      if (lp > 0) { const e = eio(lp); x = lerp(x0, HXS + n.ex, e); y = 404 - Math.sin(PI * e) * 140; P = mixP(POSE.crouch, POSE.leap, sm(lp * 2.5)); }
      if (T > n.hit) { a = 1 - rg(T, n.hit, n.hit + .9); x = HXS + n.ex; y = 404 - 10; P = POSE.leap; }
      const F = fig(P, { hood: 1, slim: 1, sword: 'hand', noSaya: 1, t: T });
      drawFig(F, x, y, 2.5, flip, { a, halo: T > n.hit ? 2.5 + rg(T, n.hit, n.hit + .9) * 30 : lerp(25, 2.5, k) });
    }
    // impacto
    if (T > n.hit && T < n.hit + 12) {
      const sp = B.splat[n.splat]; L(1); dS(sp.sp, HXS + n.ex * 1.1, 300, 1.2, n.splat, 1 - sm(rg(T, n.hit + 5, n.hit + 11)), sp.bl.get(eo(rg(T, n.hit, n.hit + .8))));
      if (!n.fired && dt > 0 && T - n.hit < .25) { n.fired = true; for (let i = 0; i < 45; i++) B.ink.spawn(HXS + n.ex, 330 + rnd(-40, 40), rnd(-260, 260), rnd(-320, 40)); SHK = 14; }
    }
  }
  // trazos de espada a través de la pantalla
  const sl = [[216.42, 520, -330, -470, 330, 60, 11], [223.36, 520, -380, -420, 330, 56, 12], [223.62, -500, -360, 470, 320, 56, 13]];
  for (const [t0, x1, y1, x2, y2, wd, sd] of sl) { if (T < t0 || T > t0 + 2.2) continue; mode('multiply'); slash(x1, y1, x2, y2, rg(T, t0, t0 + .14), 1 - sm(rg(T, t0 + .5, t0 + 2.2)), wd, sd, .1); }
  SHK *= Math.pow(.02, dt);
}
function bambooCut(T) {
  const bx = HXS + 170, sp = B.bam[1][1];
  L(1);
  const cutY = 250, c = rg(T, 225.2, 227.6), ang = ei(c) * 1.35, slide = eo(rg(T, 225.2, 225.8)) * 14;
  // parte inferior
  ctx.save(); ctx.beginPath(); ctx.rect(bx - 200, cutY + 404 - 404, 400, 400); ctx.clip(); ctx.translate(bx, 404); dS(sp, 0, 0, 1.15, 0, 1); ctx.restore();
  // parte superior: se desliza y cae
  ctx.save(); ctx.translate(bx + slide, cutY + slide * .4 + ei(c) * 120); ctx.rotate(ang);
  ctx.beginPath(); ctx.rect(-200, -1600, 400, 1600 + 1); ctx.clip(); ctx.translate(0, 404 - cutY); dS(sp, 0, 0, 1.15, 0, 1 - sm(rg(T, 227.4, 228.4)) * (c >= 1 ? 1 : 0)); ctx.restore();
}

/* ===================== EL DUELO · CLÍMAX (240–296) ===================== */
const DX = 230, DY = 300, DS = 2.5;
function lastPetal(T) { const u = rg(T, 257, 268); return { x: lerp(-SW * .52, 0, u) + Math.sin(u * 9) * 60 * (1 - u), y: lerp(-430, DY - 4, eio(u)) + Math.sin(u * 13) * 20 * (1 - u), r: T * 1.7, f: T * 2.3, on: T > 257 && T < 278 }; }
scene(240, 296, 6, 6, {
  enter() { B.ink.clear(); },
  draw(T, dt) {
    // cámara: plano general → primeros planos → general → embestida
    let z = 1, cx = 0, cy = -20;
    if (T < 250) { z = .97 + .03 * rg(T, 240, 250); }
    else if (T < 255.5) { z = 2.5 + .25 * rg(T, 250, 255.5); cx = -DX + 18; cy = DY - 60; }
    else if (T < 260) { z = 2.4 + .2 * rg(T, 255.5, 260); cx = DX - 5; cy = DY - 228; }
    else if (T < 268) { z = 1.0 + .25 * eio(rg(T, 263, 268)); cx = 0; cy = lerp(-20, 120, eio(rg(T, 263, 268))); }
    else if (T < 269.3) { z = lerp(1.25, 1.0, eo(rg(T, 268, 269.2))); cy = lerp(120, 40, eo(rg(T, 268, 269.2))); }
    else { z = 1.0 + .08 * eio(rg(T, 272, 290)); cx = lerp(0, -60, eio(rg(T, 276, 284))); cy = 40; }
    CAM = { z, x: cx, y: cy };
    WIND = { x: -40, y: -6, g: 30 };
    L(.1); dS(B.night); L(.08); dS(B.moon, 0, -140, 1, 0, 1);
    mtnDraw(1, .2, .5); mistDraw(T, 0, 220, .3, .25, 10);
    L(.9); dS(B.gD, 0, 0, 1, 0, 1);
    grassDraw(B.G1, T, .9, '20,18,22', .85, 1.5, 1);
    duelFigs(T, dt);
    // pétalo final
    const pp = lastPetal(T);
    if (pp.on) { L(1); ctx.save(); ctx.translate(pp.x, pp.y); ctx.rotate(pp.r); ctx.scale(9 * (Math.cos(pp.f) * .8 + .2), 9); ctx.globalAlpha = SA * (1 - sm(rg(T, 274, 278))); ctx.drawImage(PET[0], -1, -1, 2, 2); ctx.restore(); ctx.globalAlpha = 1; }
    grassDraw(B.G2, T, 1.15, '14,12,14', .92, 2.2, 1);
    if (dt > 0) B.ink.update(dt, T); B.ink.draw(1, 1);
    // el gran corte
    if (T > 269.25 && T < 276) { mode('multiply'); slash(SW * .62, -560, -SW * .62, 470, rg(T, 269.25, 269.5), 1 - sm(rg(T, 272.4, 275.5)), 80, 99, .06); }
    CUT = T > 269.5 && T < 273.4 ? { k: eo(rg(T, 269.5, 269.75)) * (1 - eio(rg(T, 272.2, 273.4))), a: Math.atan2(470 + 560, -SW * 1.24) } : null;
    if (T > 269.2 && T < 270.1) FLASH = Math.max(FLASH, .9 * (1 - eo(rg(T, 269.28, 270.1))));
    SHK *= Math.pow(.02, dt);
  }
});
function duelFigs(T, dt) {
  L(1);
  let hx = -DX, kx = DX, hp = POSE.stand, kp = POSE.stand, hsw = 'sheath', ksw = 'sheath', hf = false, kf = true, krot = 0, horn = true;
  if (T < 262) { hp = mixP(POSE.stand, POSE.ready, eio(rg(T, 255, 258)) * .6); kp = POSE.stand; }
  else if (T < 268) { hp = mixP(mixP(POSE.stand, POSE.ready, .6), POSE.iai, eio(rg(T, 262, 266))); kp = mixP(POSE.stand, POSE.iai, eio(rg(T, 263, 266.5))); }
  else if (T < 269.3) {
    const e = ei(rg(T, 268.3, 269.3)); hx = lerp(-DX, 170, e); kx = lerp(DX, -170, e); hp = POSE.iai; kp = POSE.iai;
    if (T > 268.3) { L(1); mode('multiply'); for (let i = 0; i < 3; i++) { brush(ctx, [[-DX + 30, DY - 40 - i * 22], [hx - 20, DY - 46 - i * 20]], { w: () => 8 - i * 2, col: INK, a: .25 * e, bristles: 6, body: .2, dryStart: .1, seed: i + 1 }); brush(ctx, [[DX - 30, DY - 50 - i * 22], [kx + 20, DY - 48 - i * 20]], { w: () => 8 - i * 2, col: INK, a: .25 * e, bristles: 6, body: .2, dryStart: .1, seed: i + 5 }); } }
  } else {
    hx = 170; kx = -170; hsw = 'hand'; ksw = 'hand';
    hp = mixP(POSE.slash, POSE.low, eio(rg(T, 274, 276))); kp = POSE.slash;
    if (T > 284) { hp = mixP(POSE.low, POSE.stand, eio(rg(T, 284, 286.5))); if (T > 285.3) hsw = 'sheath'; }
    if (T > 277.6) horn = false;
    if (T > 278.4) kp = mixP(POSE.slash, POSE.fallen, eio(rg(T, 278.4, 280.2)));
    krot = -ei(rg(T, 281, 282.7)) * 1.38;
  }
  // charco rojo bajo Kagemaru
  if (T > 282.4) { const sp = B.splat[4]; ctx.save(); ctx.translate(-170 - 120, DY + 4); ctx.scale(1.8, .38); dS(sp.sp, 0, 0, 1, 0, 1, sp.bl.get(eo(rg(T, 282.4, 287)))); ctx.restore(); }
  const KF = fig(kp, { helmet: 1, armor: 1, cape: 1, wind: .7, t: T, sword: ksw, noHorns: !horn });
  drawFig(KF, kx, DY, DS, kf, { rot: krot });
  if (!horn && T < 279.5) { // cuerno cortado que cae
    const k = rg(T, 277.6, 278.5), P = new Path2D(), b = [0, 0]; taperCurve(P, qbez(b, [10, -6], [5, -24], 10), 2.4, .3);
    ctx.save(); ctx.translate(-170 - (KF.Hd[0] + 6) * DS, DY + (KF.Hd[1] - 6) * DS + ei(k) * (-KF.Hd[1] * DS)); ctx.rotate(k * 4); ctx.scale(DS, DS); ctx.fillStyle = `rgba(18,15,14,${.9 * SA})`; ctx.fill(P); ctx.restore();
  }
  const HF = fig(hp, { sword: hsw, t: T });
  hay(HF, hx, DY, DS, hf, T, { wind: .8, rsp: 6 });
}

/* ===================== ACTO III — LLUVIA (290–322) ===================== */
scene(290, 322, 6, 5, {
  draw(T, dt) {
    CAM = { z: 1.35 + .12 * rg(T, 290, 322), x: 70, y: 165 };
    WIND = { x: 10, y: 0, g: 10 };
    L(.1); dS(B.skyR); mtnDraw(0, .12, .6); mtnDraw(1, .2, .45);
    mistDraw(T, 2, 240, .3, .5, 8);
    L(1); dS(B.gR);
    grassDraw(B.G1, T, .95, '40,38,40', .6, 1.4, .3);
    // Kagemaru tendido
    const KF = fig(mixP(POSE.lie, POSE.lieArm, eio(rg(T, 297, 301)) * (1 - eio(rg(T, 306, 309.5)))), { helmet: 1, noHorns: 1, sword: 'none' });
    L(1); drawFig(KF, 222, 330 - 7 * 2.5, 2.5, false, { rot: -PI / 2 });
    // Hayato arrodillado
    const P = mixP(POSE.kneel, POSE.kneelArm, eio(rg(T, 294, 298)) - eio(rg(T, 307, 311)) * .6), HF = fig(P, { sword: 'sheath' });
    hay(HF, -70, 330, 2.6, false, T, { wind: .25, rsp: 2 });
    // el cordón rojo pasa de mano en mano
    const kh = rotP(KF.W2, -PI / 2), kx = 222 + kh[0] * 2.5, ky = 312 + kh[1] * 2.5;
    const hh = [-70 + HF.W2[0] * 2.6, 330 + HF.W2[1] * 2.6], m = eio(rg(T, 302.5, 306.5));
    const cx = lerp(kx, hh[0], m), cy = lerp(ky, hh[1], m) - Math.sin(PI * m) * 30;
    L(1); ctx.save(); ctx.translate(cx, cy); ctx.scale(2.4, 2.4); ctx.globalAlpha = SA * sm(rg(T, 298, 300.5)); ribbon(ctx, 0, 0, T, { wind: .1, sp: 2, n: 9, sl: 3, rot: m * .4 }); ctx.restore(); ctx.globalAlpha = 1;
    rainDraw(dt, .7, .08, .2);
    // la lluvia lava la tinta
    L0(); mode('multiply');
    for (const d of B.drips) { const k = eo(rg(T, d.t, d.t + 4)); if (k <= 0) continue; const gr = ctx.createLinearGradient(0, d.y, 0, d.y + d.l * k); gr.addColorStop(0, `rgba(40,36,36,${d.a * SA})`); gr.addColorStop(1, 'rgba(40,36,36,0)'); ctx.fillStyle = gr; ctx.fillRect(d.x - d.w / 2, d.y, d.w, d.l * k); }
    if (T > 312) { mode('source-over'); L0(); ctx.fillStyle = `rgba(236,226,206,${sm(rg(T, 312, 321)) * .85 * SA})`; ctx.fillRect(-SW, -520, SW * 2, 1040); mode('multiply'); }
  }
});
const rotP = (p, a) => [p[0] * Math.cos(a) - p[1] * Math.sin(a), p[0] * Math.sin(a) + p[1] * Math.cos(a)];

/* ===================== RETORNO · EL CEREZO FLORECE (316–352) ===================== */
const RTX = () => -SW * .2, RTY = 372, RTS = .86;
scene(316, 352, 5, 6, {
  enter(T) { B.pp.clear(); if (T > 342) B.pp.warm(4, T, (dt, t) => petalsFromTree(t, dt, RTX(), RTY, RTS, 8, 328)); },
  draw(T, dt) {
    CAM = { z: 1.14 - .14 * eio(rg(T, 316, 350)), x: lerp(60, 0, rg(T, 316, 350)), y: 0 };
    WIND = { x: 22, y: -2, g: 24 };
    L(.05); dS(B.skyD); sunDraw(SUNX + 20, lerp(-40, -170, eio(rg(T, 316, 350))), .5, .75);
    mtnDraw(0, .12, .75); mtnDraw(1, .25, .65); mistDraw(T, 0, 180, .3, .55, 6); mtnDraw(2, .45, .55); mistDraw(T, 1, 280, .5, .5, 9);
    birds(T, { t0: 336, t1: 352, x0: -SW * .6, x1: SW * .4, y0: -260, y1: -330, n: 3, spread: 50, s: 9, seed: 41, d: .35 });
    L(1); dS(B.gT);
    const tx = RTX();
    treeDraw(T, tx, RTY, RTS, { dark: .35, bt0: 332, bdur: 9, hz: rg(T, 334, 346), sway: .8 });
    // espada clavada con el cordón rojo
    const sx = tx + 175, sk = sm(rg(T, 329.2, 330));
    if (sk > 0) {
      L(1); const P = new Path2D(); cap(P, [sx, RTY + 4], [sx, RTY - 96], 2.6, 3.1); cap(P, [sx - 9, RTY - 98], [sx + 9, RTY - 98], 2.6, 2.6); cap(P, [sx, RTY - 100], [sx, RTY - 126], 3.6, 3.6);
      ctx.globalAlpha = SA * sk; ctx.fillStyle = 'rgba(18,15,14,.92)'; ctx.shadowColor = 'rgba(20,16,14,.5)'; ctx.shadowBlur = 3 * U * CAM.z; ctx.fill(P); ctx.shadowBlur = 0;
      ctx.save(); ctx.translate(sx, RTY - 112); ctx.scale(2.4, 2.4); ctx.globalAlpha = SA * sm(rg(T, 330.4, 331.4)); ribbon(ctx, 0, 0, T, { wind: .85, sp: 4 }); ctx.restore(); ctx.globalAlpha = 1;
    }
    // Hayato vuelve
    let hx, P, sw = 'sheath';
    if (T < 327) { hx = lerp(SW * .62, tx + 265, rg(T, 318, 327)); P = walkP(hx / 88 * TAU); }
    else { hx = tx + 265; P = T < 329.5 ? mixP(POSE.stand, POSE.kneel, eio(rg(T, 327, 328.8))) : mixP(POSE.kneel, POSE.stand, eio(rg(T, 336, 338.5))); }
    if (T > 328.4) sw = 'none';
    if (T < 327) P = mixP(P, POSE.stand, eio(rg(T, 326, 327)));
    hay(fig(P, { sword: sw }), hx, RTY, 2.4, true, T, { wind: .6 });
    if (dt > 0) { petalsFromTree(T, dt, tx, RTY, RTS, T > 341 ? lerp(3, 14, rg(T, 341, 350)) : 0, 328); B.pp.update(dt, T); }
    B.pp.draw(1, 1);
  }
});

/* ===================== TÍTULO (346–fin) ===================== */
scene(346, 1e9, 4, .01, {
  enter(T) { B.tp.clear(); B.tp.warm(Math.min(6, T - 346), T, (dt, t) => titleEmit(dt, t)); },
  draw(T, dt) {
    CAM = { z: 1, x: 0, y: 0 };
    WIND = { x: T < 352 ? lerp(40, 240, rg(T, 346, 349)) * (1 - rg(T, 350, 354) * .85) : 34, y: -8, g: T < 352 ? 170 : 30 };
    L0(); dS(B.enso, 0, -40, 1.02, 0, .22 * sm(rg(T, 351, 357)));
    if (T > 351) sunDraw(0, -40, .62, .2 * sm(rg(T, 352, 358)));
    if (dt > 0) { titleEmit(dt, T); B.tp.update(dt, T); }
    B.tp.draw(1, 1);
  }
});
function titleEmit(dt, T) {
  const rate = T < 352 ? 70 : 6;
  B.tp.emit(dt, rate, () => { if (T < 352) B.tp.spawn(-SW * .55 - rnd(0, 300), rnd(-520, 520), rnd(80, 320), rnd(-90, 90)); else B.tp.spawn(rnd(-SW * .6, SW * .4), -540, rnd(10, 30), rnd(10, 30)); });
}

/* ===================== TEXTOS ===================== */
const CUES = [
  { t: 3.6, d: 5.4, k: 'narr', x: 'En la era de las espadas,' },
  { t: 9.2, d: 6.2, k: 'narr', x: 'la tinta y la sangre escribían la misma historia.' },
  { t: 25.5, d: 6, k: 'card', x: '<b>Primer acto</b><i>Planteamiento</i>' },
  { t: 34, d: 9, k: 'loc', x: '<b>Valle de Hoshimura</b><i>Primavera · año 1603</i>' },
  { t: 34.5, d: 9, k: 'kanji', x: '星村' },
  { t: 78, d: 7, k: 'narr', x: 'Hayato, último guardián del cerezo que plantó su padre,' },
  { t: 85.5, d: 6.5, k: 'narr', x: 'juró proteger la paz del valle.' },
  { t: 93.5, d: 8, k: 'narr', x: 'Cada primavera el árbol florecía… y el valle entero sonreía.' },
  { t: 106.5, d: 6.5, k: 'narr', x: 'Hasta que el viento trajo el olor del hierro.' },
  { t: 124, d: 6, k: 'narr light', x: 'El Clan de la Sombra.' },
  { t: 127, d: 12, k: 'kanji red', x: '影' },
  { t: 133.5, d: 7, k: 'narr light', x: 'Y a su frente… <em>Kagemaru</em>.' },
  { t: 146, d: 6.5, k: 'narr', x: 'En una sola noche, el valle ardió.' },
  { t: 154, d: 8, k: 'narr', x: 'Y el cerezo de su padre se volvió ceniza.' },
  { t: 164, d: 7, k: 'narr', x: 'Hayato tomó su espada y partió tras la sombra.' },
  { t: 175.5, d: 6, k: 'card', x: '<b>Segundo acto</b><i>Nudo</i>' },
  { t: 183, d: 7, k: 'narr', x: 'Siete días siguió el rastro del humo.' },
  { t: 192, d: 7, k: 'narr', x: 'La lluvia no logró lavar su furia.' },
  { t: 231, d: 7.5, k: 'narr', x: 'Las sombras tenían filo… pero su voluntad cortaba más hondo.' },
  { t: 243, d: 6.5, k: 'narr light', x: 'Bajo la luna roja, frente a frente,' },
  { t: 250, d: 6.5, k: 'narr light', x: 'el hombre al que una vez llamó hermano.' },
  { t: 259.5, d: 5.5, k: 'narr light voice', x: '«Has venido a morir, hermano pequeño.»' },
  { t: 286, d: 6, k: 'narr light', x: 'Un solo instante. Un solo corte.' },
  { t: 293.5, d: 6, k: 'card', x: '<b>Tercer acto</b><i>Desenlace</i>' },
  { t: 300.5, d: 7, k: 'narr', x: 'Con su último aliento, Kagemaru le devolvió el cordón rojo' },
  { t: 307.5, d: 6.5, k: 'narr', x: 'que ambos juraron llevar cuando eran niños.' },
  { t: 320.5, d: 6, k: 'narr', x: 'Hayato regresó al valle.' },
  { t: 333.5, d: 8.5, k: 'narr', x: 'Y sobre las cenizas… el cerezo volvió a florecer.' },
];
const CHAPTERS = [[0, 'Prólogo'], [25, 'I · Planteamiento'], [172, 'II · Nudo'], [268, 'Clímax'], [290, 'III · Desenlace'], [346, 'Título']];
