/* =====================================================================
   GUION — «EL JURAMENTO ROTO · EPISODIO I»   (≈ 10 min 25 s)
   Prólogo · Acto I Planteamiento · Acto II La traición · Acto III Resolución · Epílogo
   ===================================================================== */
const END = 625;
const B = {};
const SC = [];
function scene(t0, t1, fi, fo, o) { SC.push(Object.assign({ t0, t1, fi, fo, on: false }, o)); }
let FLASH = 0, CUT = null, SPAN = 2600, FLASHC = '246,238,222';
const groundY = (x, y, s0, rough) => y - Math.abs(FBM(x * .004, s0, 3)) * rough * 2.2;
let SNOW = [];

function buildTasks() {
  SPAN = SW * 1.45 + 200;
  const T = [];
  T.push(async () => { try { await Promise.race([document.fonts.load(`60px 'Pinyon Script'`), new Promise(r => setTimeout(r, 2500))]); } catch (e) { } if (!document.fonts.check(`60px 'Pinyon Script'`)) HANDF = "'Snell Roundhand', 'Apple Chancery', 'Lucida Handwriting', 'Segoe Script', cursive"; });
  T.push(() => { GRAIN = makeGrain(); B.paper = makePaper(W, H); });
  T.push(() => { B.tex = makeTexture(Math.ceil(W / 2), Math.ceil(H / 2)); B.vig = makeVignette(Math.ceil(W / 4), Math.ceil(H / 4)); B.bars = genBars(); });
  T.push(() => { B.trans = { bleed: makeTrans('bleed', 1), sweep: makeTrans('sweep', 2), down: makeTrans('down', 3), bleed2: makeTrans('bleed', 4) }; });
  T.push(() => {
    B.bloom = genInkBloom(150, 11);
    B.drops = [0, 1, 2].map(i => genSplat(700 + i, 26, '170,20,34'));
    B.big = genSplat(710, 44, '168,18,32');
    B.green = genSplat(720, 30, '30,120,70');
    B.flames = [0, 1, 2].map(i => genFlame(80 + i)); B.ember = genEmber();
  });
  T.push(() => { B.night = genSky(SPAN, '26,30,50', 61, -580, 340, 1.35); B.dusk = genSky(SPAN, '190,128,96', 62, -580, 300, .55); B.day = genSky(SPAN, '150,170,190', 63, -580, 300, .35); B.moon = genMoonPale(70); B.stars = genStars(160, 9); });
  T.push(() => {
    B.mtn = [];
    B.mtn[0] = genMount({ seed: 11, span: SPAN, n: 10, hmax: 200, wk: 130, y0: 120, depth: 260, rough: 26, col: '70,76,100', alpha: .06, band: 30, mist: .3, cun: 0 });
    B.mtn[1] = genMount({ seed: 12, span: SPAN, n: 8, hmax: 240, wk: 160, y0: 210, depth: 280, rough: 30, col: '44,48,66', alpha: .07, band: 40, mist: .4, cun: 1, cunW: .8 });
    B.mist = [1, 2, 3].map(s => genMist(1300, 70, s));
  });
  T.push(() => { B.castle = genCastle(21); B.lake = genGround(SPAN, 200, '70,82,110', .07, 22, 2, 400); B.shore = genGround(SPAN, 430, '18,18,26', .12, 23, 14, 200); });
  T.push(() => { B.house = genHouse(31); B.gP = genGround(SPAN, 302, '24,26,30', .12, 32, 10, 300); });
  T.push(() => { B.study = genStudy(41); B.page = genPage(42); });
  T.push(() => { B.script = [['Joy', 120, -300, -150], ['Joy · Joy · Joy', 70, -330, -40], ['J.', 140, 120, 50], ['Joy', 80, -240, 170]].map(([s, z, x, y], i) => Object.assign(genScript(s, z, 50 + i), { x, y, z })); });
  T.push(() => { B.arcade = genArcade(51); B.arcadeD = genArcade(53, '96,90,92'); B.gA = genGround(SPAN, 330, '40,36,40', .08, 52, 6, 300); });
  T.push(() => { B.hall = genHall(61); B.corr = genCorridor(71); B.fire = genFireplace(81); B.room = genRoom(SPAN, '44,32,28', 82, .16); });
  T.push(() => { B.env = [0, 1, 2, 3].map(i => genEnvelope(90 + i)); B.crack = genCrack(7); B.splash = genSplat(730, 90, '160,16,30'); B.boomS = genSplat(740, 80, '226,110,40'); B.cuts = [0, 1, 2].map(i => genSplat(750 + i, 20, '170,18,30')); });
  T.push(() => { B.tour = genTournament(101); B.board = genBoard(102); B.lib = genLibrary(103); });
  T.push(() => { B.snowC = genSnowCourt(104); B.door = genDoorRoom(105); B.letter = genBurntLetter(106); B.hand = handPath(1); });
  T.push(() => {
    SPK = new Parts(500, { spr: [null] });
    duelInit();
    B.ink = new Parts(160, { spr: [genBlob('18,14,14', 60, 24, .5, 5)], size: 3.5, grav: 260, drag: .9, life: [.8, 2], flip: false, fin: .05, resp: .05 });
    B.emb = new Parts(160, { spr: [B.ember], size: 3.2, grav: -50, drag: .5, life: [1.5, 3.5], flip: false, fin: .2 });
    B.ff = []; seed(12); for (let i = 0; i < 40; i++) B.ff.push({ x: rnd(-900, 900), y: rnd(-100, 280), ph: rnd(TAU), sp: rnd(.2, .6) });
    rainInit(420);
    seed(77); SNOW = []; for (let i = 0; i < 260; i++) SNOW.push({ x: rnd(-1300, 1300), y: rnd(-560, 560), r: rnd(1, 3.2), v: rnd(30, 80), ph: rnd(TAU) });
    B.G = grassInit(220, -SW * .8, SW * .9, 304, 8, 34, 5);
  });
  return T;
}

/* ---------- utilidades ---------- */
function mtnDraw(i, d, a = 1) { L(d); dS(B.mtn[i].sp, 0, 0, 1, 0, a); }
function mistDraw(T, i, y, d, a, sp = 8) { mode('source-over'); L(d); const ms = B.mist[i % 3], w = 1300, off = ((T * sp + i * 517) % (SPAN + w)) - SPAN / 2 - w / 2; dS(ms, off, y, 1, 0, a); dS(ms, off - SPAN * .55, y + 18, .9, 0, a * .8); mode('multiply'); }
function nightBack(T, moonX = SW * .28, moonY = -300, a = 1) { L(.05); dS(B.night, 0, 0, 1, 0, a); starsDraw(B.stars, T, .9 * a); L(.04); mode('source-over'); dS(B.moon, moonX, moonY, 1, 0, .95 * a); mode('multiply'); }
function M(who, p, T, o = {}) { const c = CAST[who]; return mage(p, Object.assign({ sex: c.sex, hair: c.hair, t: T, wind: .45 }, o)); }
function dm(who, F, x, y, s, flip, T, o = {}) { L(1); drawMage(F, x, y, s, flip, Object.assign({ house: CAST[who].house, t: T }, o)); }
const SIT = { hy: 24, lean: .12, ht: .1, lt: 1.45, lk: 1.5, rt: 1.55, rk: 1.6, la: .8, le: 1.0, ra: .9, re: .95, sw: 0 };
const REACH = { hy: 49, lean: .08, ht: .05, lt: -.1, lk: .05, rt: .12, rk: .06, la: .1, le: .2, ra: 1.45, re: .1, sw: 0 };
const CAST_P = { hy: 48, lean: .1, ht: -.05, lt: -.3, lk: .15, rt: .32, rk: .2, la: .2, le: .4, ra: 1.55, re: -.05, sw: 0 };
const RAISE = { hy: 49, lean: -.05, ht: -.15, lt: -.2, lk: .08, rt: .22, rk: .1, la: .2, le: .4, ra: 2.5, re: -.2, sw: 0 };
const FLINCH = { hy: 46, lean: -.18, ht: -.3, lt: -.35, lk: .3, rt: .2, rk: .15, la: 1.6, le: 1.8, ra: 1.5, re: 1.9, sw: 0 };
const COWER = { hy: 26, lean: .55, ht: .5, lt: 1.4, lk: 1.6, rt: -.2, rk: 1.5, la: 1.4, le: 2.0, ra: 1.3, re: 2.1, sw: 0 };
const LEAN = { hy: 48, lean: .3, ht: .35, lt: -.1, lk: .05, rt: .14, rk: .08, la: .1, le: .3, ra: .2, re: .4, sw: 0 };
const STOMP = { hy: 47, lean: .05, ht: .4, lt: -.15, lk: .1, rt: 1.0, rk: 1.3, la: .2, le: .3, ra: .3, re: .3, sw: 0 };
const PAT = { hy: 48, lean: .2, ht: .4, lt: -.1, lk: .05, rt: .12, rk: .06, la: .5, le: 1.6, ra: .6, re: 1.7, sw: 0 }; // se busca la varita
const KNEEL2 = { hy: 26, lean: .25, ht: .35, lt: 1.45, lk: 1.55, rt: -.1, rk: 1.45, la: .9, le: .4, ra: 1.0, re: .3, sw: 0 };
function walkW(x) { return walkP(x / 70 * TAU, 0); }
function moonShafts(T, a) { mode('source-over'); L(1); for (let x = -1000; x <= 1000; x += 400) { const k = (.07 + .02 * Math.sin(T * .5 + x)) * a * SA; ctx.fillStyle = `rgba(200,210,236,${k})`; ctx.beginPath(); ctx.moveTo(x - 75, -40); ctx.lineTo(x + 75, -40); ctx.lineTo(x + 330, 560); ctx.lineTo(x + 40, 560); ctx.fill(); } mode('multiply'); }
function snowDraw(T, dt, a = 1) { L(1); mode('source-over'); ctx.fillStyle = `rgba(246,244,240,${.85 * a * SA})`; for (const f of SNOW) { if (dt > 0) { f.y += f.v * dt; f.x += Math.sin(T * .8 + f.ph) * 12 * dt + 6 * dt; if (f.y > 560) { f.y -= 1120; f.x = rnd(-1300, 1300); } } ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, TAU); ctx.fill(); } mode('multiply'); }
function insertBg(a, col = '239,229,207') { L0(); mode('source-over'); ctx.fillStyle = `rgba(${col},${a * SA})`; ctx.fillRect(-SW, -560, SW * 2, 1120); mode('multiply'); }
function txt(s, x, y, size, col, a, font = HANDF, align = 'center') { mode('source-over'); ctx.globalAlpha = a * SA; ctx.fillStyle = col; ctx.font = `${size}px ${font}`; ctx.textAlign = align; ctx.fillText(s, x, y); ctx.globalAlpha = 1; mode('multiply'); }
/* hilo verde que crece en el sello de Anami (cambio gradual) */
const GREEN = T => T < 340 ? 0 : T < 352 ? .08 * rg(T, 346, 352) : T < 392 ? lerp(.08, .62, rg(T, 356, 388)) : T < 404.5 ? lerp(.62, 1, rg(T, 396, 404)) : 0;
const ANAMI_HOUSE = T => T < 404.45 ? 'G' : { a: 'G', b: 'S', k: eio(rg(T, 404.45, 404.9)) };
const THREAD = T => T > 349.5;

function fort(T) {
  const fx = FORTX(), gy = 304, sk = Math.sin(T * .7) * 3;
  const pts = [[fx - 190, gy], [fx - 150, gy - 120], [fx - 60, gy - 200 + sk], [fx + 10, gy - 228], [fx + 80, gy - 196 - sk], [fx + 165, gy - 110], [fx + 200, gy]];
  const pth = new Path2D(); pth.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) { const p = pts[i - 1], q = pts[i]; pth.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2); } pth.lineTo(fx + 200, gy); pth.closePath();
  L(1); mode('source-over');
  const fl = .85 + .15 * N2(T * 4, 2), gr = ctx.createRadialGradient(fx, gy - 60, 10, fx, gy - 80, 230);
  gr.addColorStop(0, `rgba(250,214,150,${.95 * SA * fl})`); gr.addColorStop(.6, `rgba(214,160,96,${.9 * SA})`); gr.addColorStop(1, `rgba(150,100,60,${.9 * SA})`);
  ctx.fillStyle = gr; ctx.fill(pth);
  // sombras de los niños proyectadas sobre la tela
  ctx.save(); ctx.clip(pth); mode('multiply');
  const kids = [['damien', -70, 'swept', 'm'], ['joy', 10, 'braid', 'f'], ['anami', 85, 'short', 'm']];
  kids.forEach(([n, ox, hair, sex], i) => {
    let p = mixP(SIT, REACH, .2 + .2 * Math.sin(T * 1.2 + i * 2));
    if (n === 'damien') p = mixP(SIT, RAISE, .35 + .35 * Math.sin(T * 1.6));
    if (n === 'joy') p.ht += Math.sin(T * 5) * .08;
    const F = mage(p, { sex, hair, child: 1, t: T, noCape: 0, wind: .1 });
    ctx.save(); ctx.translate(fx + ox, gy - 6); ctx.scale(i === 1 ? 2.3 : -2.3, 2.3); ctx.globalAlpha = .45 * SA; ctx.shadowColor = 'rgba(60,30,20,.6)'; ctx.shadowBlur = 14 * U * CAM.z; ctx.fillStyle = 'rgba(70,40,30,.85)'; ctx.fill(F.C); ctx.fill(F.P); ctx.restore();
  });
  ctx.restore(); ctx.shadowBlur = 0; ctx.globalAlpha = 1;
  mode('multiply'); ctx.globalAlpha = SA;
  brush(ctx, catmull(pts.map(p => p.slice()), 6), { w: () => 3, col: '60,40,30', a: .8, bristles: 3, body: 1, dryStart: 1, seed: 3 });
  for (let i = 0; i < 4; i++) brush(ctx, [[fx - 40 + i * 28, gy - 200 + i * 10], [fx - 90 + i * 50, gy]], { w: () => 1.2, col: '120,80,50', a: .35, bristles: 1, body: 1, dryStart: 1, seed: i });
  ctx.globalAlpha = 1;
  glowAt(fx, gy - 30, 120, '255,200,120', .3 * fl);
}
function kidsPorch(T) {
  const porchY = HY0 + 232, gy = 304, k = sm(rg(T, 39, 42));
  L(1);
  // Damien: líder, en el porche, levanta el puño
  let dx = HX0 + 330, dp = mixP(REACH, RAISE, eio(rg(T, 42, 43.5)) * (1 - eio(rg(T, 46, 47.5))));
  if (T > 54) { dx = lerp(HX0 + 330, HX0 + 262, eio(rg(T, 54, 56.5))); dp = T < 56.5 ? walkW(dx, T) : mixP(POSE.stand, REACH, eio(rg(T, 57, 58.2))); }
  dm('damien', M('damien', dp, T, { child: 1 }), dx, porchY, 2.3, true, T, { a: k, child: 1 });
  // Joy: sobre la baranda, salta al jardín y vuelve
  let jx = HX0 + 80, jy = HY0 + 168, jp = POSE.stand, jf = false;
  const jt = rg(T, 47.5, 48.6);
  if (jt > 0) { jx = lerp(HX0 + 80, HX0 - 30, jt); jy = lerp(HY0 + 168, gy, jt) - Math.sin(jt * PI) * 70; jp = mixP(POSE.leap, POSE.crouch, jt); jf = true; }
  if (T > 48.6) { jy = gy; jp = mixP(POSE.crouch, POSE.stand, eio(rg(T, 48.6, 49.6))); }
  if (T > 51) { jx = lerp(HX0 - 30, HX0 + 205, eio(rg(T, 51, 55))); jp = T < 55 ? walkW(jx, T) : mixP(POSE.stand, REACH, eio(rg(T, 57, 58.2))); jf = false; jy = T < 53 ? gy : lerp(gy, porchY + 10, rg(T, 53, 55)); }
  dm('joy', M('joy', jp, T, { child: 1, hair: 'braid' }), jx, jy, 2.3, jf, T, { a: k, child: 1 });
  // Anami: estratega, sentado leyendo en los escalones
  const ax = HX0 + 300, ap = T < 54 ? SIT : mixP(SIT, T < 57 ? POSE.stand : REACH, eio(rg(T, 54, 55.5)) * (T < 57 ? 1 : 0) + (T >= 57 ? 1 : 0));
  const ay = T < 54 ? gy - 10 : lerp(gy - 10, porchY + 4, rg(T, 54, 55.5));
  const AF = M('anami', T >= 57 ? mixP(POSE.stand, REACH, eio(rg(T, 57, 58.2))) : ap, T, { child: 1 });
  dm('anami', AF, ax, ay, 2.3, true, T, { a: k, child: 1, after: F => { if (T < 54) { ctx.fillStyle = 'rgba(30,22,20,.9)'; ctx.fillRect(F.W2[0] - 1, F.W2[1] - 9, 10, 9); } } });
  // las manos se juntan: gota roja del juramento
  if (T > 58) { const hx = HX0 + 262 + 22, hy = porchY - 66, a = sm(rg(T, 58.2, 59)) * (1 - sm(rg(T, 62, 64))); glowAt(hx, hy, 90, '220,40,50', .5 * a); mode('source-over'); dS(B.big.sp, hx, hy, .25, 0, a, B.big.bl.get(eo(rg(T, 58.2, 60)))); mode('multiply'); }
}



/* ===================== PRÓLOGO (0–28) ===================== */
scene(0, 28, .01, .5, {
  draw(T) {
    CAM = { z: 1, x: 0, y: 0 }; L0();
    if (T > 1.2 && T < 2.62) { const f = ei(rg(T, 1.2, 2.6)), y = lerp(-620, -4, f); ctx.fillStyle = `rgba(${INK},.92)`; ctx.beginPath(); ctx.ellipse(0, y, 4.5, 6 + f * 12, 0, 0, TAU); ctx.fill(); }
    const ba = (1 - sm(rg(T, 5.5, 9)) * .82) * (1 - sm(rg(T, 13, 17)));
    if (T > 2.6) dS(B.bloom.sp, 0, 0, 1 + .2 * eo(rg(T, 2.6, 12)), 0, ba * .9, B.bloom.bl.get(eo(rg(T, 2.6, 8.5))));
    const pos = [[-120, -30], [0, 60], [120, -30]], mg = eio(rg(T, 9.2, 11.4)), al = 1 - sm(rg(T, 14, 18));
    mode('source-over');
    for (let i = 0; i < 3; i++) { const t0 = 6.2 + i * .8; if (T < t0) continue; const x = lerp(pos[i][0], 0, mg), y = lerp(pos[i][1], 0, mg); dS(B.drops[i].sp, x, y, 1 - mg * .3, i, al * (1 - sm(rg(T, 10.8, 11.6))), B.drops[i].bl.get(eo(rg(T, t0, t0 + 1.2)))); }
    if (T > 10.8) { dS(B.big.sp, 0, -100 * eio(rg(T, 13, 16)), 1 + .05 * Math.sin(T * 3), 0, 1 - sm(rg(T, 21, 24)), B.big.bl.get(eo(rg(T, 10.8, 12.5)))); glowAt(0, -100 * eio(rg(T, 13, 16)), 180, '200,40,50', .25 * (1 - sm(rg(T, 21, 24))) * sm(rg(T, 11, 13))); }
    mode('multiply');
  }
});

/* ===================== INFANCIA: FUERTE Y PORCHE (24–90) ===================== */
const HX0 = 40, HY0 = 52, FORTX = () => -SW * .34;
scene(24, 90, 4, .5, {
  tin: 'bleed',
  draw(T, dt) {
    const t = T - 12; // la coreografía de los niños se escribió para t
    const pan = eio(rg(T, 47, 54));
    CAM = { z: lerp(1.75, 1.22, pan) + .06 * rg(T, 54, 90), x: lerp(FORTX() + 30, 140, pan), y: lerp(170, 120, pan) };
    nightBack(T, -SW * .05, -330);
    mtnDraw(0, .2, .55); mistDraw(T, 0, 230, .3, .25, 5);
    L(1); dS(B.gP); grassDraw(B.G, T, 1, '20,22,26', .7, 1.2, .4);
    L(1); dS(B.house.sp, HX0, HY0); houseWins(B.house, T, HX0, HY0, 1);
    const lx = HX0 + 120, ly = HY0 - 30 + 70; ctx.strokeStyle = `rgba(20,18,20,${SA})`; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(lx, HY0 - 30); ctx.lineTo(lx, ly - 8); ctx.stroke();
    ctx.fillStyle = `rgba(20,18,20,${SA})`; ctx.fillRect(lx - 7, ly - 8, 14, 18);
    glowAt(lx, ly, 260, '255,196,110', .55 + .06 * N2(T * 3, 1)); glowAt(lx, ly, 40, '255,236,180', .9);
    fort(T);
    mode('source-over'); L(1);
    for (const f of B.ff) { const k = Math.max(0, Math.sin(T * 1.6 + f.ph)) * SA; if (k < .05) continue; const x = f.x + Math.sin(T * f.sp + f.ph) * 40, y = f.y + Math.cos(T * f.sp * 1.3 + f.ph) * 25; const gr = ctx.createRadialGradient(x, y, 0, x, y, 9); gr.addColorStop(0, `rgba(240,240,150,${k})`); gr.addColorStop(1, 'rgba(240,240,150,0)'); ctx.fillStyle = gr; ctx.fillRect(x - 9, y - 9, 18, 18); }
    mode('multiply');
    if (t > 39) kidsPorch(t, { x: lx, y: ly });
  }
});

/* ===================== HOGWARTS: LLEGADA Y LA CHICA DE LA ORILLA (86–124) ===================== */
scene(86, 124, 4, .5, {
  tin: 'sweep',
  draw(T, dt) {
    CAM = { z: 1.18 - .18 * eio(rg(T, 86, 102)) + .05 * rg(T, 102, 124), x: lerp(0, 40, rg(T, 102, 124)), y: lerp(-140, 0, eio(rg(T, 86, 102))) };
    nightBack(T, SW * .3, -320);
    mtnDraw(0, .15, .8); mtnDraw(1, .28, .7); mistDraw(T, 0, 120, .3, .3, 6);
    L(.5); dS(B.lake, 0, 0, 1, 0, .9);
    const cy = -70, cs = .85, wy = 205;
    ctx.save(); ctx.beginPath(); ctx.rect(-SW, wy, SW * 2, 400); ctx.clip();
    for (let i = 0; i < 9; i++) { const y0 = wy + i * 28; ctx.save(); ctx.beginPath(); ctx.rect(-SW, y0, SW * 2, 29); ctx.clip(); ctx.translate(Math.sin(T * 1.2 + i * .9) * (2 + i * .6), 2 * wy); ctx.scale(1, -1); dS(B.castle.sp, 0, cy, cs, 0, .22 - i * .014); ctx.restore(); }
    ctx.restore();
    L(.04); mode('source-over'); ctx.strokeStyle = `rgba(240,236,220,${.35 * SA})`; ctx.lineWidth = 1.4; ctx.beginPath(); for (let i = 0; i < 26; i++) { const y = wy + 8 + i * 9, w = 30 + 40 * (N2(i, T * .5) * .5 + .5), x = SW * .3 + N2(i * 3, T) * 20; ctx.moveTo(x - w / 2, y); ctx.lineTo(x + w / 2, y); } ctx.stroke(); mode('multiply');
    L(.5); dS(B.castle.sp, 0, cy, cs); winGlow(B.castle.wins, T, 1, 0, cy, cs);
    mistDraw(T, 1, 200, .55, .45, 10); mistDraw(T, 2, 140, .5, .3, -7);
    L(1); dS(B.shore);
    const k = sm(rg(T, 94, 98));
    for (const [n, off] of [['joy', -40], ['anami', -150], ['damien', 70]]) { const x = lerp(-SW * .75, SW * .05, rg(T, 90, 124)) + off; dm(n, M(n, walkW(x), T, { wind: .6, vx: 40 }), x, 432, 1.9, false, T, { a: k }); }
    // Draconida, sola sobre una roca de la orilla, los mira
    const dk = fade(T, 104, 124, 2.5, 1);
    if (dk > 0) { L(1); ctx.fillStyle = `rgba(16,16,22,${.9 * SA})`; ctx.beginPath(); ctx.ellipse(SW * .38, 432, 90, 26, 0, PI, TAU); ctx.fill(); dm('draco', M('draco', { ...POSE.stand, ht: .12 }, T, { wind: .7 }), SW * .38, 410, 1.9, true, T, { a: dk, glow: .7 }); }
  }
});

/* ===================== PATIO DE DÍA: AMISTAD (120–148) ===================== */
scene(120, 148, 4, 3, {
  tin: 'bleed2',
  draw(T, dt) {
    CAM = { z: 1.15 + .05 * rg(T, 120, 148), x: lerp(-60, 60, rg(T, 120, 148)), y: 80 };
    L(.05); dS(B.day); mtnDraw(0, .15, .45);
    L(1); dS(B.arcadeD); dS(B.gA, 0, 0, 1, 0, .7);
    // Joy salta del muro bajo; Damien hace chispas doradas; Anami lee en un banco
    L(1); ctx.fillStyle = `rgba(60,56,60,${.5 * SA})`; ctx.fillRect(-470, 250, 160, 80); ctx.fillRect(170, 290, 170, 14); ctx.fillRect(180, 304, 12, 26); ctx.fillRect(318, 304, 12, 26);
    const jt = (T - 122) % 8, jj = rg(jt, 1.5, 2.4);
    let jx = -390, jy = 250, jp = POSE.stand;
    if (jj > 0 && jj < 1) { jx = lerp(-390, -240, jj); jy = lerp(250, 330, jj) - Math.sin(jj * PI) * 90; jp = mixP(POSE.leap, POSE.crouch, jj); }
    else if (jt >= 2.4) { jx = lerp(-240, -390, rg(jt, 4.5, 7.5)); jy = jt < 4.5 ? 330 : lerp(330, 250, rg(jt, 4.5, 7.5)); jp = jt < 2.9 ? mixP(POSE.crouch, POSE.stand, rg(jt, 2.4, 2.9)) : jt < 4.5 ? mixP(POSE.stand, RAISE, Math.sin(rg(jt, 2.9, 4.4) * PI)) : walkW(jx); }
    dm('joy', M('joy', jp, T, { wind: .6 }), jx, jy, 2.4, jt >= 4.5, T);
    const dp = mixP(POSE.stand, RAISE, .5 + .5 * Math.sin(T * 1.3)), DF = M('damien', dp, T, { wand: true });
    dm('damien', DF, -70, 330, 2.5, false, T);
    if (DF.tip) { const tp = figPt(DF.tip, -70, 330, 2.5, false); orb(tp[0], tp[1], 3, 'gold', .8, T); if (dt > 0 && R() < dt * 20) sparks(tp[0], tp[1], 3, 'gold', 160, 80); }
    const look = T > 136, AF = M('anami', { ...SIT, ht: look ? -.25 : .15, la: .9, le: 1.1 }, T);
    dm('anami', AF, 255, 316, 2.4, look, T, { after: F => { if (!look) { ctx.fillStyle = 'rgba(30,22,20,.9)'; ctx.fillRect(F.W2[0] - 1, F.W2[1] - 9, 10, 9); } } });
    if (look) { const hp = figPt(AF.sig, 255, 316, 2.4, true); glowAt(hp[0], hp[1], 60 + 20 * Math.sin(T * 4), '240,120,110', .35 * rg(T, 136, 138)); }
    sparksDraw(dt, T);
  }
});

/* ===================== EL CUADERNO (144–178) ===================== */
scene(144, 178, 4, 3, {
  draw(T, dt) {
    CAM = { z: 1.15 + .1 * rg(T, 144, 178) + (T > 161 ? .2 * eio(rg(T, 161, 166)) : 0), x: T > 161 ? lerp(60, -180, eio(rg(T, 161, 166))) : 60, y: 40 };
    nightBack(T, -430, -200);
    L(1); dS(B.study);
    mode('source-over'); ctx.fillStyle = `rgba(200,210,236,${.07 * SA})`; ctx.beginPath(); ctx.moveTo(-580, 160); ctx.lineTo(-280, 160); ctx.lineTo(60, 560); ctx.lineTo(-420, 560); ctx.fill(); mode('multiply');
    const cx = 300, cyy = 116; ctx.fillStyle = `rgba(230,220,200,${SA})`; ctx.fillRect(cx - 5, cyy - 4, 10, 34);
    const fl = 1 + .15 * N2(T * 6, 3); mode('source-over'); ctx.fillStyle = `rgba(255,200,110,${SA})`; ctx.beginPath(); ctx.ellipse(cx, cyy - 12 * fl, 4, 10 * fl, N2(T * 3, 1) * .2, 0, TAU); ctx.fill(); mode('multiply');
    glowAt(cx, cyy - 12, 320 * fl, '255,190,110', .38); glowAt(cx, cyy - 12, 40, '255,236,190', .7);
    const wr = { hy: 24, lean: .42, ht: .35, lt: 1.45, lk: 1.55, rt: 1.55, rk: 1.6, la: .9, le: 1.1, ra: 1.25 + Math.sin(T * 9) * .05, re: .55 + Math.sin(T * 7) * .06, sw: 0 };
    L(1); ctx.fillStyle = `rgba(24,20,20,${.9 * SA})`; ctx.fillRect(-14, 200, 50, 10); ctx.fillRect(-14, 210, 8, 130); ctx.fillRect(28, 210, 8, 130);
    const candle = [{ x: cx, y: cyy - 12, c: '255,190,110', r: 300, a: .8 * fl }];
    dm('anami', M('anami', wr, T, { wind: .05 }), 10, 340, 2.5, false, T, { light: candle });
    const dk = sm(rg(T, 160, 163));
    if (dk > 0) dm('damien', M('damien', POSE.stand, T, { wind: .1 }), -760, 340, 2.6, false, T, { a: dk, glow: .55 });
    const pa = fade(T, 149.5, 160.5, .9, .9);
    if (pa > 0) {
      insertBg(pa);
      ctx.save(); const zs = 1.4 + .05 * rg(T, 149.5, 160.5); ctx.scale(zs, zs); dS(B.page, 0, 0, 1, 0, pa);
      ctx.save(); ctx.rotate(-.04);
      B.script.forEach((s, i) => { const t0 = 150.5 + i * 2.3, p = rg(T, t0, t0 + 1.8); if (p <= 0) return; const w = s.w * p; ctx.save(); ctx.beginPath(); ctx.rect(s.x - 10, s.y - s.z, w * .62 + 10, s.z * 2); ctx.clip(); ctx.globalAlpha = pa * SA; ctx.drawImage(s.c, s.x, s.y - s.c.height * .5 * .62, s.c.width * .62, s.c.height * .62); ctx.restore(); });
      ctx.restore(); ctx.restore(); ctx.globalAlpha = 1;
    }
  }
});

/* ===================== ACTO II — PATIO AL ATARDECER (176–224) ===================== */
scene(176, 224, 3, 3, {
  draw(T, dt) {
    const conf = rg(T, 198, 201);
    CAM = { z: lerp(1.05, 1.42, eio(conf)) + .04 * rg(T, 176, 198), x: lerp(40, 0, eio(conf)), y: lerp(20, 120, eio(conf)) };
    L(.05); dS(B.dusk); mtnDraw(0, .15, .5);
    L(1); dS(B.arcade); dS(B.gA);
    for (let x = -1125; x <= 1125; x += 250) glowAt(x + 30, -60, 150, '255,190,110', .3 + .05 * N2(T * 2, x));
    if (T < 199) {
      const k = sm(rg(T, 176, 179));
      let dx = -140, jx = 40, dp = POSE.stand, jp = POSE.stand;
      if (T > 182) dp = mixP(POSE.stand, REACH, eio(rg(T, 182, 183.5)) * (1 - eio(rg(T, 189, 190))));
      if (T > 186.5) jp = mixP(POSE.stand, REACH, eio(rg(T, 186.5, 187.5)) * (1 - eio(rg(T, 189, 190))));
      if (T > 191) { dx = lerp(-140, -SW * .8, rg(T, 191, 199)); jx = lerp(40, -SW * .8 + 120, rg(T, 191.5, 199.5)); dp = walkW(dx); jp = walkW(jx); }
      dm('damien', M('damien', dp, T), dx, 330, 2.5, T > 191, T, { a: k, after: F => { if (T > 182 && T < 189.5) { mode('source-over'); dS(B.drops[0].sp, F.W2[0] + 4, F.W2[1] - 4, .3, 0, 1); mode('multiply'); } } });
      dm('joy', M('joy', jp, T), jx, 330, 2.45, true, T, { a: k });
      const ak = sm(rg(T, 185, 186.5)), ax = lerp(SW * .65, 470, eo(rg(T, 185, 189.5)));
      if (ak > 0) dm('anami', M('anami', T < 189.5 ? walkW(ax) : POSE.stand, T), ax, 330, 2.5, true, T, { a: ak, glow: lerp(1, .5, rg(T, 190, 195)) });
    } else {
      const k = sm(rg(T, 199, 201)), lg = rg(T, 204.5, 210.5), shake = Math.sin(T * 26) * .06 * Math.sin(lg * PI);
      const dp = { ...POSE.stand, lean: -.1 + shake, ht: -.35 * Math.sin(lg * PI) };
      let dx = -120; if (T > 217.5) dx = lerp(-120, -SW * .7, rg(T, 217.5, 224));
      dm('damien', M('damien', T > 217.5 ? walkW(dx) : dp, T), dx, 330, 2.6, T > 217.5, T, { a: k });
      dm('anami', M('anami', mixP(POSE.stand, POSE.ready, .3), T), 130, 330, 2.6, true, T, { a: k });
      crackDraw(B.crack, eo(rg(T, 214, 215.4)), 1 - sm(rg(T, 221, 224)));
      if (T > 214 && T < 214.5) SHK = Math.max(SHK, 10);
    }
  }
});

/* ===================== LOS SUSURROS (222–244) ===================== */
scene(222, 244, 2, 3, {
  draw(T, dt) {
    CAM = { z: 1.35 + .1 * rg(T, 222, 244), x: 0, y: 110 };
    nightBack(T, -400, -250, .8);
    L(1); dS(B.corr); moonShafts(T, .8);
    const DF = M('damien', LEAN, T, { wind: .1 }), JF = M('joy', POSE.stand, T, { wind: .2 });
    dm('damien', DF, -70, 330, 2.6, false, T);
    dm('joy', JF, 40, 330, 2.5, false, T, { glow: .75 + .25 * Math.sin(T * 7) * rg(T, 231, 233) });
    const m = figPt(ad(DF.Hd, DF.hr, 6), -70, 330, 2.6, false), e = figPt(ad(JF.Hd, JF.hr, -2), 40, 330, 2.5, false);
    L(1); whisper(m[0], m[1], e[0], e[1], T, sm(rg(T, 223, 225)) * (1 - sm(rg(T, 240, 243))));
    const va = fade(T, 230.5, 242, 1.5, 2);
    if (va > 0) {
      L(1); const vx = 330, vy = 230, VF = M('anami', { ...POSE.kneel, la: .9, le: .5, ra: 1.1, re: .3 }, T, { wind: .1 });
      drawMage(VF, vx, vy, 2.3, true, { a: va * .55, house: 'G', t: T, halo: 9, haloA: .9, glow: .4, noShadow: 1 });
      const bx = vx - 95, by = vy - 30, lid = eio(rg(T, 237, 238.5));
      ctx.fillStyle = `rgba(40,30,30,${.6 * va * SA})`; ctx.fillRect(bx - 30, by, 60, 22);
      ctx.save(); ctx.translate(bx - 30, by); ctx.rotate(-1.2 * (1 - lid)); ctx.fillRect(0, -6, 60, 6); ctx.restore();
      if (T < 238) wandAt(lerp(vx - 30, bx, eio(rg(T, 233.5, 236.5))), lerp(vy - 40, by + 6, eio(rg(T, 233.5, 236.5))), .2, 34, va * .8);
      glowAt(vx - 40, vy - 60, 260, '170,160,200', .22 * va);
    }
  }
});

/* ===================== EL TORNEO DE VARITAS CRUZADAS (242–268) ===================== */
scene(242, 268, 4, 3, {
  tin: 'bleed',
  draw(T, dt) {
    CAM = { z: 1.1 + .12 * eio(rg(T, 250, 260)), x: lerp(0, -120, eio(rg(T, 250, 260))), y: 90 };
    L(.6); dS(B.tour);
    for (let i = 0; i < 6; i++) glowAt(-900 + i * 360, -140, 200, '255,196,110', .25);
    // duelistas lejanos sobre la tarima
    const t2 = T * 1.3;
    L(.6); for (const [x, f, h] of [[-120, false, 'R'], [120, true, 'S']]) { const F = mage(mixP(DUEL, LUNGE, .5 + .5 * Math.sin(t2 + x)), { sex: 'm', hair: 'short', t: T, wand: true }); drawMage(F, x, 250, 1.3, f, { house: h, t: T, minor: 1, halo: 0, glow: .6, noShadow: 1 }); }
    if (Math.sin(t2 * 1.7) > .6) { L(.6); beam(-95, 205, 95, 205, 1, 'violet', .6, T, 2.5, 7); }
    // tablón con el nombre de Joy tachado
    L(1); dS(B.board, 330, 110, 1.5);
    if (T > 251) { mode('multiply'); L(1); brush(ctx, [[262, 72], [400, 92]], { w: () => 9, prog: eo(rg(T, 251, 251.5)), col: '170,20,34', a: .9, bristles: 5, body: .8, dryStart: .7, seed: 12 }); }
    // Joy busca su varita; Damien a su lado le susurra un nombre; Anami al fondo
    const jp = T < 251 ? mixP(POSE.stand, PAT, .5 + .5 * Math.sin(T * 5)) : mixP(PAT, POSE.stand, rg(T, 251, 252.5));
    const JF = M('joy', jp, T), DF = M('damien', LEAN, T);
    dm('joy', JF, -400, 340, 2.6, T > 259.5, T, { glow: T > 251 ? .6 : 1 });
    dm('damien', DF, -550, 340, 2.7, false, T);
    const m = figPt(ad(DF.Hd, DF.hr, 6), -550, 340, 2.7, false), e = figPt(ad(JF.Hd, JF.hr, -2), -400, 340, 2.6, T > 259.5);
    whisper(m[0], m[1], e[0], e[1], T, fade(T, 254, 262, 1, 1.5));
    const ak = sm(rg(T, 256, 258));
    if (ak > 0) dm('anami', M('anami', POSE.stand, T), 540, 340, 2.4, true, T, { a: ak, glow: lerp(1, .45, rg(T, 260, 264)) });
  }
});

/* ===================== LAS CARTAS QUEMADAS (266–296) ===================== */
function fireplaceRoom(T, dt, low = 0) {
  CAM = { z: 1.2 + .06 * rg(T, 266, 312), x: 40, y: 80 };
  L(.3); dS(B.room, 0, 0, 1, 0, 1); L0(); ctx.fillStyle = `rgba(70,46,36,${(.75 + low * .05) * SA})`; ctx.fillRect(-SW, -560, SW * 2, 1120);
  L(1); dS(B.fire, 260, 10);
  const fl = (.85 + .15 * N2(T * 4, 1)) * (1 - low * .4);
  for (let i = 0; i < 5; i++) { const sc = (1.5 - Math.abs(i - 2) * .25) * (.9 + .2 * N2(T * 3, i)) * (1 - low * .5), sy = 1 + .3 * N2(T * 5, i * 4); mode('source-over'); ctx.globalAlpha = SA * .8; ctx.drawImage(B.flames[i % 3], 180 + i * 40 - 32 * sc, 332 - 128 * sc * sy, 64 * sc, 128 * sc * sy); }
  mode('multiply'); ctx.globalAlpha = 1; glowAt(260, 260, 760, '255,150,70', .5 * fl); glowAt(260, 280, 160, '255,220,150', .6 * fl);
  if (dt > 0) { B.emb.emit(dt, 14 * (1 - low * .8), () => B.emb.spawn(260 + rnd(-60, 60), 260, rnd(-10, 10), -60)); B.emb.update(dt, T); }
  B.emb.draw(1, 1);
  return [{ x: 260, y: 250, c: '255,150,70', r: 520, a: fl }];
}
scene(266, 296, 3, 1, {
  enter() { B.emb.clear(); },
  draw(T, dt) {
    const lt = fireplaceRoom(T, dt);
    let jp = POSE.stand; if (T > 280) jp = mixP(POSE.stand, CAST_P, eio(rg(T, 280, 280.6)) * (1 - eio(rg(T, 281.5, 282.5))));
    dm('joy', M('joy', jp, T, { wind: .25 }), -40, 340, 2.6, T > 289.5, T, { light: lt });
    if (T > 280.5 && T < 282) { const p = rg(T, 280.5, 281.6); ctx.save(); ctx.translate(lerp(10, 230, p), lerp(240, 280, p) - Math.sin(p * PI) * 60); ctx.rotate(p * 5); ctx.scale(.22, .22); dS(B.env[3].sp, 0, 0, 1, 0, 1 - p * .5); ctx.restore(); }
    const ak = fade(T, 287.5, 296, 1.2, 1);
    if (ak > 0) dm('anami', M('anami', mixP(POSE.stand, REACH, eio(rg(T, 288.5, 289.5)) * (1 - eio(rg(T, 290.5, 291.5)))), T), -SW * .42, 340, 2.6, false, T, { a: ak, glow: .7, light: lt });
    const ins = (t0, t1, envs, sp) => {
      const a = fade(T, t0, t1, .6, .6); if (a <= 0) return;
      insertBg(a * .9, '74,44,30');
      envs.forEach(([e, x, y, s, r, d]) => {
        const p = eio(rg(T, t0 + d, t0 + d + sp)), img = B.env[e].bl.get(p);
        mode('source-over'); if (img) dS(B.env[e].sp, x, y, s, r, a, img);
        glowAt(x, y + 80 * s * (1 - p) - 20, 220 * s, '255,140,50', .5 * a * Math.sin(Math.min(1, p * 1.2) * PI));
        for (let k = 0; k < 4 && p > 0 && p < .95; k++) { const sc = 1.1 * s * (1 + .3 * N2(T * 4, k + e)); ctx.globalAlpha = a * .8 * SA; ctx.drawImage(B.flames[k % 3], x - 130 * s + k * 85 * s - 32 * sc, y + (100 - p * 190) * s - 110 * sc, 64 * sc, 128 * sc); }
        ctx.globalAlpha = 1; mode('multiply');
      });
    };
    ins(271.8, 279.2, [[0, 0, 0, 1.9, -.05, .5]], 6.4);
    ins(283.2, 287.6, [[1, -260, -20, .9, .12, 0], [2, 40, 40, 1, -.08, .3], [3, 300, -40, .85, .1, .6]], 3);
  }
});
/* ===================== LA CARTA QUE NO ARDIÓ (294–312) ===================== */
scene(294, 312, 2, 3, {
  draw(T, dt) {
    const lt = fireplaceRoom(T, dt, 1);
    mode('source-over'); L0(); ctx.fillStyle = `rgba(20,24,40,${.1 * SA})`; ctx.fillRect(-SW, -560, SW * 2, 1120); mode('multiply');
    // Draconida se arrodilla junto a las brasas y rescata una carta
    let x = lerp(-SW * .6, 150, eo(rg(T, 295, 299))), p = T < 299 ? walkW(x) : mixP(POSE.stand, KNEEL2, eio(rg(T, 299, 300.5)) * (1 - eio(rg(T, 305, 306.5))));
    if (T > 306.5) { x = lerp(150, -SW * .6, rg(T, 306.5, 312)); p = walkW(x); }
    const DF = M('draco', p, T);
    dm('draco', DF, x, 340, 2.5, T > 306.5, T, { light: lt, glow: .75 });
    if (T > 300.5 && T < 306.6) { const h = figPt(DF.W2, x, 340, 2.5, false); ctx.save(); ctx.translate(h[0] + 6, h[1] - 4); ctx.rotate(-.3); ctx.scale(.16, .16); mode('source-over'); dS(B.env[1].sp, 0, 0, 1, 0, 1, B.env[1].bl.get(.45)); mode('multiply'); ctx.restore(); glowAt(h[0], h[1], 50, '255,150,70', .3); }
  }
});

/* ===================== EL FUEGO LENTO (310–336) ===================== */
scene(310, 336, 3, 3, {
  draw(T, dt) {
    CAM = { z: 1.5 + .12 * rg(T, 310, 336), x: -330, y: 30 };
    nightBack(T, -430, -230, .7);
    L(1); dS(B.study);
    mode('source-over'); ctx.fillStyle = `rgba(190,200,230,${.06 * SA})`; ctx.fillRect(-580, -330, 300, 490); mode('multiply');
    rainDraw(dt, .6, .1, .22);
    const p = mixP(POSE.stand, CAST_P, rg(T, 327, 328) * (1 - rg(T, 333, 334)));
    const AF = M('anami', p, T, { wind: .1, wand: T > 326.5 && T < 334 }), x = -300;
    const g = rg(T, 312, 332), c = figPt(AF.sig, x, 330, 2.7, true);
    dm('anami', AF, x, 330, 2.7, true, T, { light: [{ x: c[0], y: c[1], c: '220,60,40', r: 120 + g * 160, a: .3 + g * .5 }] });
    glowAt(c[0], c[1] + 10, 40 + g * 260, '220,50,40', .15 + g * .4 + .05 * Math.sin(T * 3));
    if (T > 327 && T < 334 && AF.tip) { const tp = figPt(AF.tip, x, 330, 2.7, true); orb(tp[0], tp[1], 3 + 2 * Math.sin(T * 9), 'red', .7, T); if (dt > 0 && R() < dt * 25) sparks(tp[0], tp[1], 3, 'red', 140, 60); }
    sparksDraw(dt, T);
  }
});

/* ===================== LA BIBLIOTECA: EL LIBRO SIN FIRMA (334–356) ===================== */
scene(334, 356, 3, 3, {
  tin: 'down',
  draw(T, dt) {
    CAM = { z: 1.25 + .1 * rg(T, 334, 356), x: 40, y: 70 };
    nightBack(T, 0, -250, .7);
    L(1); dS(B.lib);
    const lx = 150, ly = 150; ctx.fillStyle = `rgba(30,24,20,${SA})`; ctx.fillRect(lx - 8, ly + 6, 16, 16); mode('source-over'); ctx.fillStyle = `rgba(255,210,130,${.9 * SA})`; ctx.beginPath(); ctx.arc(lx, ly, 9, 0, TAU); ctx.fill(); mode('multiply');
    glowAt(lx, ly, 380, '255,196,110', .45 + .04 * N2(T * 3, 2));
    const lamp = [{ x: lx, y: ly, c: '255,196,110', r: 320, a: .9 }];
    // Draconida deja el libro y se aleja entre las estanterías
    const dx = T < 337 ? lerp(SW * .6, 330, eo(rg(T, 334.5, 337))) : T < 338.6 ? 330 : lerp(330, SW * .65, rg(T, 338.6, 343));
    const dp = T < 337 ? walkW(dx) : T < 338.6 ? mixP(POSE.stand, REACH, Math.sin(rg(T, 337, 338.6) * PI)) : walkW(dx);
    if (T < 343.5) dm('draco', M('draco', dp, T), dx, 340, 2.4, T < 338.6, T, { light: lamp, glow: .8 });
    // el libro
    const bk = T > 337.8;
    if (bk) { L(1); const bx = 300 - 140 * eio(rg(T, 340, 342)), open = rg(T, 343, 344); ctx.fillStyle = `rgba(60,36,30,${SA})`; ctx.fillRect(bx - 22, 158 - 4 * (1 - open), 44 + open * 40, 12 - open * 6); if (open > 0) { mode('source-over'); ctx.fillStyle = `rgba(236,224,196,${open * SA})`; ctx.fillRect(bx - 18, 156, 80, 5); ctx.strokeStyle = `rgba(70,200,120,${open * SA})`; ctx.lineWidth = 2; ctx.shadowColor = 'rgba(120,255,170,.9)'; ctx.shadowBlur = 8 * U * CAM.z; ctx.beginPath(); ctx.moveTo(bx + 22, 156); ctx.quadraticCurveTo(bx + 26, 180, bx + 18 + Math.sin(T * 2) * 4, 200); ctx.stroke(); ctx.shadowBlur = 0; mode('multiply'); } }
    // Anami lee, encuentra el libro y ata la cinta a su varita
    const ap = T < 346 ? { ...SIT, lean: .3, ht: T > 339 ? -.1 : .3, ra: 1.1, re: .7 } : { ...SIT, lean: .2, ht: .35, la: 1.2, le: 1.4, ra: 1.3, re: 1.2 };
    dm('anami', M('anami', ap, T, { wand: T > 346, thread: THREAD(T), wandA: -.4 }), -40, 340, 2.5, false, T, { light: lamp, green: GREEN(T) });
    // inserto: la cinta verde se enrolla en la varita
    const ia = fade(T, 346, 352.5, .6, .8);
    if (ia > 0) {
      insertBg(ia, '40,30,28'); L0(); glowAt(0, 0, 420, '255,196,110', .35 * ia);
      ctx.save(); ctx.rotate(-.15); ctx.fillStyle = `rgba(60,40,30,${ia * SA})`; const P = new Path2D(); cap(P, [-380, 0], [380, 0], 16, 7); ctx.fill(P);
      const pr = eio(rg(T, 346.8, 351.5)); mode('source-over'); ctx.strokeStyle = `rgba(70,200,120,${ia * SA})`; ctx.lineWidth = 7; ctx.shadowColor = 'rgba(120,255,170,.9)'; ctx.shadowBlur = 16 * U; ctx.beginPath();
      for (let i = 0; i <= 60 * pr; i++) { const f = i / 60, x = -300 + f * 160, y = Math.sin(f * TAU * 4) * 18, z2 = Math.cos(f * TAU * 4); if (z2 < 0 && i) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
      ctx.stroke(); if (pr > .95) { ctx.beginPath(); ctx.moveTo(-140, 0); ctx.quadraticCurveTo(-120, 60, -160 + Math.sin(T * 3) * 10, 120); ctx.stroke(); }
      ctx.shadowBlur = 0; mode('multiply'); ctx.restore();
    }
  }
});

/* ===================== ENTRENAMIENTO BAJO LA NIEVE (354–392) ===================== */
scene(354, 392, 3, .5, {
  enter() { SPK.clear(); },
  draw(T, dt) {
    CAM = { z: 1.15 + .08 * rg(T, 354, 392), x: lerp(-30, 30, rg(T, 354, 392)), y: 70 };
    nightBack(T, -300, -320, .9);
    L(1); dS(B.snowC);
    for (let x = -1080; x <= 1080; x += 360) glowAt(x, -200, 160, '255,196,110', .3 + .04 * N2(T * 2, x));
    const ax = -200, dx = 230, ph = T - 354;
    // tres rondas: falla el escudo, el escudo aguanta, él la desarma
    let ap = DUEL, dp = DUEL, shA = 0, hit = 0, fallA = 0, dWand = true;
    const r1 = rg(ph, 4, 5.2), r2 = rg(ph, 12, 13.2);
    if (ph > 4 && ph < 7) { const b = rg(ph, 4.4, 4.7); ap = mixP(BLOCK, STAGGER, eo(rg(ph, 4.7, 5))); fallA = rg(ph, 4.7, 5.6) * (1 - rg(ph, 6, 7)); }
    if (ph > 7 && ph < 9) ap = mixP(KNEEL2, DUEL, eio(rg(ph, 7, 8.5)));
    if (ph > 11 && ph < 16) { ap = BLOCK; shA = fade(ph, 11.5, 15.5, .3, .5); }
    if (ph > 19 && ph < 23) ap = mixP(DUEL, LUNGE, eio(rg(ph, 19, 19.5)) * (1 - eio(rg(ph, 21, 22.5))));
    if (ph > 19.6) dWand = ph > 27;
    if (ph > 23) { ap = mixP(DUEL, POSE.stand, eio(rg(ph, 23, 25))); dp = mixP(DUEL, { ...POSE.stand, lean: .25, ht: .35 }, eio(rg(ph, 23.5, 25.5))); }
    const green = GREEN(T);
    const AF = M('anami', fallA > .5 ? mixP(STAGGER, KNEEL2, fallA) : ap, T, { wand: true, thread: true });
    const DF = M('draco', dp, T, { wand: dWand });
    const atip = figPt(AF.tip, ax, 330, 2.6, false), dtip = DF.tip ? figPt(DF.tip, dx, 330, 2.5, true) : [dx - 40, 220];
    const lights = [];
    if (ph > 4.2 && ph < 4.8) { beam(dtip[0], dtip[1], atip[0] + 10, atip[1] - 20, rg(ph, 4.2, 4.5), 'sg', 1 - rg(ph, 4.6, 4.8), T, 3.5, 3); lights.push({ x: atip[0], y: atip[1], c: '120,226,160', r: 200, a: 1 }); }
    if (ph > 4.4 && ph < 4.8 && dt > 0 && R() < .3) sparks(atip[0], atip[1], 8, 'gold', 240);
    if (ph > 12.2 && ph < 12.8) { beam(dtip[0], dtip[1], atip[0] + 30, atip[1], rg(ph, 12.2, 12.45), 'sg', 1 - rg(ph, 12.6, 12.8), T, 3.5, 4); lights.push({ x: atip[0] + 30, y: atip[1], c: '240,182,72', r: 240, a: 1 }); }
    if (ph > 19.4 && ph < 20.2) { beam(atip[0], atip[1], dtip[0], dtip[1], rg(ph, 19.4, 19.6), 'red', 1 - rg(ph, 19.9, 20.2), T, 4, 5); lights.push({ x: dtip[0], y: dtip[1], c: '226,44,40', r: 220, a: 1 }); }
    if (Math.abs(ph - 19.6) < .04 && dt > 0) sparks(dtip[0], dtip[1], 30, 'red', 300);
    dm('anami', AF, ax, 330, 2.6, false, T, { green, light: lights });
    dm('draco', DF, dx, 330, 2.5, true, T, { light: lights });
    if (shA > 0) shield(atip[0] + 26, atip[1], 70, 'gold', shA, T, rg(ph, 12.45, 13.2) * (ph > 12.45 ? 1 : 0), 1);
    if (ph > 19.6 && ph < 27) { const f = rg(ph, 19.6, 21); wandAt(lerp(dtip[0], dx + 200, f), lerp(dtip[1], 336, f) - Math.sin(f * PI) * 120, f * 10, 34, 1); }
    snowDraw(T, dt, 1);
    sparksDraw(dt, T);
  }
});

/* ===================== LA SELECCIÓN (390–432) ===================== */
scene(390, 432, 3, 3, {
  tin: 'bleed2',
  draw(T, dt) {
    const bt = 404.5, burst = rg(T, bt, bt + .4);
    CAM = { z: 1.05 + .45 * eio(rg(T, 393, bt)) - .35 * eo(rg(T, bt + .2, bt + 2.5)) + .1 * rg(T, bt + 3, 432), x: 0, y: lerp(60, 140, rg(T, 390, bt)) };
    nightBack(T, 600, -300, .8);
    L(1); dS(B.hall.sp);
    const dim = rg(T, 397, 403.5) * (1 - rg(T, bt, bt + 2)), gk = fade(T, bt, bt + 6, .05, 3);
    for (const l of B.hall.lamps) { glowAt(l.x, l.y - 14 * l.s, 70 * l.s, '255,196,110', (.35 + .08 * N2(T * 3, l.x)) * (1 - dim * .8) * (1 - gk)); glowAt(l.x, l.y - 14 * l.s, 80 * l.s, '90,230,140', .45 * gk); }
    L0(); mode('multiply'); ctx.fillStyle = `rgba(30,30,44,${.45 * dim * SA})`; ctx.fillRect(-SW, -560, SW * 2, 1120);
    let jp = POSE.stand; if (T > bt + .8) jp = mixP(POSE.stand, FLINCH, eio(rg(T, bt + .8, bt + 1.6)) * (1 - eio(rg(T, bt + 7, bt + 9)) * .6));
    const AF = M('anami', { ...POSE.stand, ht: -.3 * eio(rg(T, 401, bt)) + .1 * rg(T, bt + 2, bt + 4) }, T, { wind: .2 + burst * 2.5 });
    const top = figPt(AF.sig, 0, 330, 2.7, false), L1 = [{ x: top[0], y: top[1], c: T < bt ? '240,182,72' : '90,230,140', r: 300 + gk * 400, a: (T < bt ? rg(T, 398, bt) * .8 : gk) }];
    dm('joy', M('joy', jp, T), -330, 330, 2.3, false, T, { light: L1 });
    dm('damien', M('damien', POSE.stand, T), 340, 330, 2.4, T < bt + 1.5, T, { glow: .8, light: L1 });
    // Draconida en su mesa: es la única que se levanta
    const drs = eio(rg(T, bt + 9, bt + 12));
    dm('draco', M('draco', mixP(SIT, POSE.stand, drs), T), 600, 330, 2.3, true, T, { light: L1, glow: .8 + gk });
    const fl = T < bt ? .35 * rg(T, 398, bt) : 2.2 * (1 - eo(rg(T, bt, bt + 2.5))) + .2 * gk;
    dm('anami', AF, 0, 330, 2.7, false, T, { house: ANAMI_HOUSE(T), green: GREEN(T), flare: fl, trimK: T < bt ? 0 : eio(rg(T, bt + .3, bt + 4.5)), glow: 1 + 1.5 * gk, light: [{ x: top[0], y: top[1] - 40, c: '120,240,160', r: 240, a: gk }] });
    // onda expansiva verde
    if (T > bt && T < bt + 2.2) { const rr = eo(rg(T, bt, bt + 2.2)) * 1400; mode('source-over'); ctx.strokeStyle = `rgba(120,240,160,${(1 - rg(T, bt, bt + 2.2)) * .8 * SA})`; ctx.lineWidth = 6 + 30 * (1 - rg(T, bt, bt + 2.2)); ctx.shadowColor = 'rgba(80,255,150,.9)'; ctx.shadowBlur = 30 * U * CAM.z; ctx.beginPath(); ctx.arc(top[0], top[1], rr, 0, TAU); ctx.stroke(); ctx.shadowBlur = 0; mode('multiply'); }
    if (Math.abs(T - bt) < .05 && dt > 0) { sparks(top[0], top[1], 90, 'green', 520, 60); sparks(top[0], top[1], 40, 'silver', 380, 30); SHK = 12; }
    if (T > bt && T < bt + .9) { FLASH = Math.max(FLASH, .6 * (1 - rg(T, bt, bt + .9))); FLASHC = '200,255,214'; }
    if (T > bt + 12 && T < bt + 20) { const a = fade(T, bt + 12, bt + 20, 1, 2); mode('source-over'); for (let k = 0; k < 3; k++) { const y = 330 - 40 - k * 70 + Math.sin(T * 2 + k) * 10; ctx.strokeStyle = `rgba(80,210,130,${.5 * a * SA})`; ctx.lineWidth = 2; ctx.shadowColor = 'rgba(120,255,170,.9)'; ctx.shadowBlur = 10 * U * CAM.z; ctx.beginPath(); ctx.ellipse(0, y, 70, 14, 0, (T * 3 + k) % TAU, (T * 3 + k) % TAU + 4); ctx.stroke(); } ctx.shadowBlur = 0; mode('multiply'); }
    sparksDraw(dt, T);
  }
});

/* ===================== SOLO UN ADORNO (430–462) ===================== */
scene(430, 462, 3, 3, {
  draw(T, dt) {
    CAM = { z: 1.2 + .15 * eio(rg(T, 442, 450)), x: lerp(-200, 140, eio(rg(T, 430, 444))), y: 90 };
    L(.05); dS(B.dusk); mtnDraw(0, .15, .5);
    L(1); dS(B.arcade); dS(B.gA);
    for (let x = -1125; x <= 1125; x += 250) glowAt(x + 30, -60, 150, '255,190,110', .32 + .05 * N2(T * 2, x));
    for (let i = 0; i < 4; i++) { const x = -700 + i * 420, F = mage(POSE.stand, { sex: i % 2 ? 'f' : 'm', hair: i % 2 ? 'sleek' : 'short', t: T, wind: .1 }); L(1); drawMage(F, x, 250, 1.3, i % 2 === 0, { a: .35, house: ['G', 'R', 'S', 'R'][i], minor: 1, halo: 0, glow: .5, noShadow: 1 }); }
    let dx = lerp(-500, 220, rg(T, 430, 444)), jx = dx - 120, dp = walkW(dx), jp = walkW(jx), dfl = false;
    if (T > 444) { dx = 220; jx = 100; dp = mixP(walkW(dx), POSE.stand, eio(rg(T, 444, 445))); jp = mixP(walkW(jx), POSE.stand, eio(rg(T, 444, 445))); }
    if (T > 445.5) { dfl = true; dp = mixP(POSE.stand, RAISE, eio(rg(T, 447, 449.5))); }
    if (T > 450) { dp = mixP(RAISE, POSE.stand, eio(rg(T, 450.4, 451.5))); jp = mixP(POSE.stand, COWER, eio(rg(T, 450, 450.4))); }
    if (T > 452.5) { dfl = false; dx = lerp(220, SW * .7, rg(T, 452.5, 462)); dp = walkW(dx); }
    dm('damien', M('damien', dp, T), dx, 330, 2.6, dfl, T);
    dm('joy', M('joy', jp, T), jx, 330, 2.45, false, T, { glow: T > 450 ? .55 : 1 });
    if (T > 449.9) { L0(); mode('multiply'); dS(B.splash.sp, 40, -20, 2.2, .3, 1 - sm(rg(T, 453, 458)), B.splash.bl.get(eo(rg(T, 449.9, 450.5)))); if (T < 450.2) SHK = 12; }
  }
});

/* ===================== ACTO III — EL DUELO (460–564) ===================== */
const DUEL_T = { j1: 468, d1: 469.6, j2: 471.2, d2: 473, d3: 475.2, av0: 479.5, ex1: 484.3, cl0: 487.6, clEnd: 496.7, pr: 497.6, ex2: 500, sec: 502.5, expu: 505.5, snap: 514 };
let DLIGHT = [];
scene(460, 566, 3, 4, {
  tin: 'sweep',
  enter() { SPK.clear(); B.ink.clear(); DEB.clear(); DUST.clear(); },
  draw(T, dt) {
    const slow = fade(T, 491.3, 495.2, .4, .6), dts = dt * (1 - slow * .78);
    let z = 1.05, cx = 60, cy = 80;
    if (T < 468) { z = 1.05; cx = 60; }
    else if (T < 476) { z = 1.25; cx = 80; cy = 95; }
    else if (T < 484.3) { z = lerp(1.25, 1.62, eio(rg(T, 476, 484.2))); cx = lerp(80, 110, rg(T, 476, 484)); cy = lerp(95, 70, rg(T, 476, 484)); }
    else if (T < 491) { z = 1.0; cx = 140; cy = 80; }
    else if (T < 497) { z = lerp(1.0, 1.4, eio(rg(T, 491, 494))) - .3 * eo(rg(T, 496.6, 497)); cx = lerp(140, 210, rg(T, 491, 494)); cy = lerp(80, 60, rg(T, 491, 494)); }
    else if (T < 508) { z = 1.0; cx = 120; cy = 80; }
    else if (T < 515) { z = 1.12; cx = lerp(120, -120, eio(rg(T, 508, 513))); cy = 90; }
    else { z = 1.05 + .1 * rg(T, 515, 566); cx = lerp(-120, 160, eio(rg(T, 515, 545))); cy = 85; }
    CAM = { z, x: cx, y: cy };
    nightBack(T, 500, -260, .9);
    L(1); dS(B.corr); moonShafts(T, 1);
    duel2(T, dts, slow);
    debrisDraw(dts, T); sparksDraw(dts, T);
    if (dts > 0) B.ink.update(dts, T); B.ink.draw(1, 1);
    if (slow > 0) { L0(); mode('multiply'); const gr = ctx.createRadialGradient(0, 0, 200, 0, 0, SW * .7); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(1, `rgba(30,30,50,${.55 * slow * SA})`); ctx.fillStyle = gr; ctx.fillRect(-SW, -560, SW * 2, 1120); }
  }
});
function duel2(T, dt, slow) {
  const D = DUEL_T, tw = T * (1 - slow * .7); // tiempo "lento" para ondulaciones
  L(1); const lights = [];
  // ---------------- Damien ----------------
  let dx = -60, dy = 330, dp = DUEL, dfl = false, drot = 0, dWand = true, dAng;
  if (T < 467.5) dp = mixP(POSE.stand, DUEL, rg(T, 462, 464));
  else if (T < 469.2) dp = BLOCK;
  else if (T < 470.3) dp = mixP(DUEL, LUNGE, Math.sin(rg(T, 469.4, 470.2) * PI));
  else if (T < 472.7) dp = T > D.j2 + .25 ? mixP(STAGGER, DUEL, rg(T, 471.8, 472.6)) : DUEL;
  else if (T < 476) dp = mixP(DUEL, LUNGE, Math.sin(rg(T, 472.8, 473.4) * PI) + Math.sin(rg(T, 475, 475.6) * PI));
  else if (T < 478) { dx = lerp(-60, 40, eio(rg(T, 476, 478))); dp = walkW(dx); }
  else if (T < D.ex1 + .15) { dx = 40; dp = mixP(POSE.stand, RAISE, eio(rg(T, 478, 479.3))); dp = mixP(dp, CAST_P, eio(rg(T, 481, 483))); }
  else if (T < 485) { dx = 40; dp = BLOCK; }
  else if (T < D.cl0) { dx = 40; dp = DUEL; }
  else if (T < D.clEnd) { dx = 40; dp = mixP(DUEL, LUNGE, .4 + .1 * Math.sin(tw * 3)); }
  else if (T < D.pr) { dx = lerp(40, 10, rg(T, D.clEnd, D.clEnd + .5)); dp = mixP(STAGGER, DUEL, rg(T, D.clEnd + .3, D.pr)); }
  else if (T < D.ex2) { dx = 10; dp = mixP(DUEL, LUNGE, Math.sin(rg(T, D.pr, D.pr + .7) * PI)); }
  else if (T < D.expu) { dx = 10; dWand = T < D.ex2 + .2; dp = T < D.sec + .2 ? mixP(DUEL, FLINCH, eio(rg(T, D.ex2 + .2, D.ex2 + .6))) : mixP(FLINCH, { ...STAGGER, lean: -.45 }, rg(T, D.sec + .2, D.sec + .8)); }
  else { dWand = false; const f = rg(T, D.expu + .15, D.expu + 1.2); dx = lerp(10, -560, eo(f)); dy = 330 - Math.sin(f * PI) * 130; dp = POSE.leap; drot = -f * 1.4; if (T > D.expu + 1.2) { dx = -560; dy = 340; dp = POSE.lie; drot = -PI / 2; } }
  if (T > 478 && T < D.ex1 + .15) dAng = lerp(-1.2, -.25, eio(rg(T, 481, 483)));
  const DF = M('damien', dp, T, { wand: dWand, wind: .5, wandA: dAng });
  const dtip = DF.tip ? figPt(DF.tip, dx, dy, 2.6, dfl, drot) : [dx + 60, 210];
  // ---------------- Joy ----------------
  let jx = 210, jy = 330, jp = DUEL, jWand = T < D.d3 + .25, jfl = true;
  if (T < 467.5) jp = mixP(POSE.stand, DUEL, rg(T, 462, 464));
  else if (T < 469.4) jp = mixP(DUEL, LUNGE, Math.sin(rg(T, 467.8, 468.6) * PI));
  else if (T < 470.4) { const f = rg(T, 469.5, 470.3); jx = lerp(210, 250, f); jy = 330 - Math.sin(f * PI) * 34; jp = DODGE; }
  else if (T < 472.8) { jx = 250; jp = mixP(DUEL, LUNGE, Math.sin(rg(T, 470.9, 471.8) * PI)); }
  else if (T < D.d3) { const f = rg(T, D.d2 + .25, D.d2 + 1.1); jx = lerp(250, 280, f); jp = T < D.d2 + .25 ? DUEL : mixP(STAGGER, DUEL, rg(T, 474.2, 475)); }
  else { jx = 280; jp = mixP(STAGGER, COWER, eio(rg(T, D.d3 + .3, D.d3 + 1))); if (T > 517.5 && T < 523) jp = mixP(COWER, { ...COWER, ra: .9, re: .1, ht: -.1, lean: .4 }, eio(rg(T, 517.5, 519)) * (1 - eio(rg(T, 521.5, 523)))); }
  const JF = M('joy', jp, T, { wand: jWand });
  const jtip = JF.tip ? figPt(JF.tip, jx, jy, 2.5, jfl) : [jx - 40, 230];
  // ---------------- Anami y Draconida ----------------
  const runIn = (x0, x1, t0, t1) => lerp(x0, x1, eo(rg(T, t0, t1)));
  let ax = runIn(SW * .62, 390, 480, 483.6), ap = T < 483.6 ? runP(ax / 60 * TAU) : DUEL, afl = true, aWand = T > 483.2;
  let cx = runIn(SW * .62 + 90, 480, 480.4, 484), cp = T < 484 ? runP(cx / 60 * TAU) : DUEL, cfl = true, cWand = T > 484;
  if (T > D.ex1 - .1 && T < D.ex1 + .7) ap = mixP(DUEL, LUNGE, Math.sin(rg(T, D.ex1 - .1, D.ex1 + .6) * PI));
  if (T > D.cl0 && T < D.clEnd) ap = mixP(DUEL, LUNGE, .45 - .1 * Math.sin(tw * 3) + .35 * eio(rg(T, 494.8, 496.4)));
  if (T > D.clEnd && T < D.pr + 1.5) ap = mixP(STAGGER, DUEL, rg(T, D.clEnd + .6, D.pr + 1.4));
  if (T > D.ex2 - .1 && T < D.ex2 + .7) ap = mixP(DUEL, LUNGE, Math.sin(rg(T, D.ex2 - .1, D.ex2 + .6) * PI));
  if (T > D.sec - .1 && T < D.sec + 1) ap = mixP(DUEL, LUNGE, Math.sin(rg(T, D.sec - .1, D.sec + .9) * PI));
  if (T > D.clEnd && T < D.pr + .3) { cx = lerp(480, 320, eio(rg(T, D.clEnd, D.pr + .2))); cp = T < D.pr + .2 ? runP(cx / 60 * TAU) : BLOCK; }
  if (T > D.pr + .2 && T < D.pr + 2) cp = BLOCK;
  if (T > D.pr + 2 && T < 509) { cx = lerp(320, 470, eio(rg(T, D.pr + 2, D.pr + 3.2))); cp = T < D.pr + 3.2 ? walkW(cx) : DUEL; }
  if (T > D.expu - .1 && T < D.expu + .8) cp = mixP(DUEL, LUNGE, Math.sin(rg(T, D.expu - .1, D.expu + .7) * PI));
  if (T > 508) { // Anami cruza hasta la varita y la parte
    ax = T < 513.4 ? lerp(390, -290, eio(rg(T, 508, 513.4))) : -290; ap = T < 513.4 ? walkW(ax) : mixP(POSE.stand, STOMP, eio(rg(T, 513.4, 513.85)) * (1 - eio(rg(T, 514.1, 514.7)))); aWand = false;
  }
  if (T > 515.5) { ax = lerp(-290, 390, eio(rg(T, 515.5, 524))); ap = T < 524 ? walkW(ax) : POSE.stand; afl = false; }
  if (T > 509) { cx = 470; cp = POSE.stand; cWand = false; }
  if (T > 529) cp = mixP(POSE.stand, { ...REACH, ra: 1.2 }, eio(rg(T, 530.5, 532)) * (1 - eio(rg(T, 537, 538))));
  if (T > 535) ap = mixP(POSE.stand, { ...POSE.stand, la: 1.0, le: 1.2 }, eio(rg(T, 535.5, 537)));
  if (T > 537.5) { cx = 470 - eio(rg(T, 537.5, 538.5)) * 50; cfl = false; }
  if (T > 540) { ax = lerp(390, SW * .78, rg(T, 540, 566)); ap = walkW(ax); afl = false; cx = lerp(420, SW * .78 + 40, rg(T, 540, 566)); cp = walkW(cx + 30); }
  const ak = sm(rg(T, 480, 481.5));
  const AF = M('anami', ap, T, { wand: aWand, wind: .45, thread: true, vx: T < 483.6 && T > 480 ? 200 : 0 }), CF = M('draco', cp, T, { wand: cWand, wind: .45, vx: T < 484 && T > 480 ? 200 : 0 });
  const atip = AF.tip ? figPt(AF.tip, ax, 330, 2.6, afl) : [ax - 50, 220], ctip = CF.tip ? figPt(CF.tip, cx, 330, 2.45, cfl) : [cx - 50, 225];
  // ---------------- hechizos ----------------
  const B1 = (t0, dur, from, to, kind, w = 4.5, sd = 1, hold = .35) => { if (T > t0 && T < t0 + dur + hold) { const p = rg(T, t0, t0 + dur); beam(from[0], from[1], to[0], to[1], p, kind, 1 - rg(T, t0 + dur, t0 + dur + hold), tw, w, sd); lights.push({ x: lerp(from[0], to[0], p), y: lerp(from[1], to[1], p), c: SPELL[kind][0], r: 260, a: 1 - rg(T, t0 + dur, t0 + dur + hold) }); } };
  const hitAt = (t, x, y, kind, n = 1, sh = 6) => { if (Math.abs(T - t) < .045 && dt > 0) { impact(x, y, kind, n); SHK = Math.max(SHK, sh); } };
  // Joy vs Damien
  B1(D.j1, .3, jtip, [dtip[0] + 20, dtip[1]], 'gold', 4, 1); hitAt(D.j1 + .3, dtip[0] + 26, dtip[1], 'gold', .6, 4);
  if (T > 467.6 && T < 469.2) shield(dtip[0] + 16, dtip[1], 64, 'blue', fade(T, 467.6, 469.2, .15, .4), tw, T > D.j1 + .3 ? 1 - rg(T, D.j1 + .3, D.j1 + 1) : 0, 1);
  B1(D.d1, .35, dtip, [440, 185], 'blue', 4, 2); hitAt(D.d1 + .35, 440, 185, 'blue', 1, 7);
  B1(D.j2, .25, jtip, [dx + 8, 225], 'gold', 4, 3); hitAt(D.j2 + .25, dx + 8, 225, 'gold', .5, 5);
  B1(D.d2, .25, dtip, [jx - 30, 336], 'blue', 4.5, 4); hitAt(D.d2 + .25, jx - 30, 330, 'blue', 1.2, 9);
  B1(D.d3, .25, dtip, jtip, 'blue', 4, 5); hitAt(D.d3 + .25, jtip[0], jtip[1], 'blue', .4, 6);
  if (T > D.d3 + .25 && T < 560) { const f = rg(T, D.d3 + .25, D.d3 + 1.3); wandAt(lerp(jtip[0], 560, f), lerp(jtip[1], 336, f) - Math.sin(f * PI) * 120, f * 11, 34, 1); }
  // la maldición se forma
  if (T > D.av0 && T < D.ex1 + .25) { const g = rg(T, D.av0, D.ex1); orb(dtip[0], dtip[1], 3 + g * 13, 'green', .4 + g * .6, tw); lights.push({ x: dtip[0], y: dtip[1], c: '60,214,96', r: 200 + g * 300, a: .4 + g * .6 }); if (dt > 0 && R() < dt * 30 * g) { const a = rnd(TAU); SPK.spawn(dtip[0] + Math.cos(a) * 60, dtip[1] + Math.sin(a) * 60, -Math.cos(a) * 100, -Math.sin(a) * 100, { col: SPELL.green[0], life: .5, s: 1.6 }); } }
  if (Math.abs(T - (D.ex1 + .2)) < .045 && dt > 0) sparks(dtip[0], dtip[1], 40, 'green', 300);
  // Expelliarmus bloqueado → rebota contra el muro
  B1(D.ex1, .2, atip, [dtip[0] + 18, dtip[1]], 'red', 5, 6, .25);
  if (T > D.ex1 + .1 && T < D.ex1 + 1.2) shield(dtip[0] + 14, dtip[1], 70, 'blue', fade(T, D.ex1 + .1, D.ex1 + 1.2, .1, .4), tw, T > D.ex1 + .2 ? 1 - rg(T, D.ex1 + .2, D.ex1 + .9) : 0, 1);
  B1(D.ex1 + .2, .2, [dtip[0] + 18, dtip[1]], [-260, -140], 'red', 4, 7, .25); hitAt(D.ex1 + .4, -260, -140, 'red', 1.3, 10);
  // choque de rayos
  if (T > D.cl0 && T < D.clEnd + .1) {
    const pushK = eio(rg(T, 494.8, 496.4)), j = .5 + .07 * Math.sin(tw * 3.1) + .04 * Math.sin(tw * 7.3) - .28 * pushK;
    const a = fade(T, D.cl0, D.clEnd + .1, .25, .1), J = clash(dtip, atip, j, 'blue', 'red', tw, a);
    lights.push({ x: J[0], y: J[1], c: '200,120,200', r: 420, a });
    if (dt > 0 && R() < dt * 40) sparks(J[0], J[1], 4, R() < .5 ? 'red' : 'blue', 260, 60);
    if (Math.abs(T - D.clEnd) < .05 && dt > 0) { impact(J[0], J[1], 'red', 1.5); SHK = 14; }
  }
  // ángulo ciego → ¡Protego!
  B1(D.pr, .35, dtip, [cx + 20, ctip[1]], 'blue', 4.5, 8, .3);
  if (T > D.pr + .1 && T < D.pr + 2) shield(ctip[0] - 14, ctip[1], 80, 'sg', fade(T, D.pr + .1, D.pr + 2, .12, .5), tw, T > D.pr + .35 ? 1 - rg(T, D.pr + .35, D.pr + 1.1) : 0, -1);
  hitAt(D.pr + .35, ctip[0] - 30, ctip[1], 'sg', .6, 7);
  // Expelliarmus, Sectumsempra, Expulso
  B1(D.ex2, .2, atip, dtip, 'red', 5, 9, .35); hitAt(D.ex2 + .2, dtip[0], dtip[1], 'red', .8, 9);
  let wx = -300, wy = 338, wr = 0;
  if (T > D.ex2 + .2 && T < D.ex2 + 1.6) { const f = rg(T, D.ex2 + .2, D.ex2 + 1.5); wx = lerp(dtip[0], -300, f); wy = lerp(dtip[1], 338, f) - Math.sin(f * PI) * 240; wr = f * 15; }
  if (T > D.ex2 + .2) wandAt(wx, wy, wr, 36, 1, T > D.snap ? Math.min(1, (T - D.snap) * 4) : 0);
  if (Math.abs(T - D.snap) < .05 && dt > 0) { sparks(-300, 335, 30, 'blue', 220, 40); SHK = 8; }
  B1(D.sec, .2, atip, [dx + 10, 230], 'silver', 3.5, 10, .5);
  [[.2, -60, -90, 70, 30], [.42, -40, 60, 80, -40], [.64, -80, -20, 60, 90]].forEach(([o, x1, y1, x2, y2], i) => {
    const t0 = D.sec + o; if (T < t0 || T > t0 + 3) return; mode('multiply'); slash(dx + x1, 200 + y1, dx + x2, 200 + y2, rg(T, t0, t0 + .1), 1 - sm(rg(T, t0 + 1, t0 + 3)), 14, 40 + i, .05, 1, '150,160,176');
    if (T < t0 + 2.6) { L(1); dS(B.cuts[i].sp, dx + (x1 + x2) / 2, 200 + (y1 + y2) / 2, 1, i, 1 - sm(rg(T, t0 + 1.5, t0 + 2.8)), B.cuts[i].bl.get(eo(rg(T, t0, t0 + .5)))); }
    if (Math.abs(T - t0) < .04 && dt > 0) SHK = 5;
  });
  B1(D.expu, .16, ctip, [10, 220], 'orange', 5, 11, .3);
  if (T > D.expu + .15 && T < D.expu + 5) { L(1); dS(B.boomS.sp, 10, 220, 2.2, 0, 1 - sm(rg(T, D.expu + 1, D.expu + 4.5)), B.boomS.bl.get(eo(rg(T, D.expu + .15, D.expu + .6)))); orb(10, 220, 30, 'orange', 1 - rg(T, D.expu + .15, D.expu + 1.1), tw); lights.push({ x: 10, y: 220, c: '240,140,60', r: 700, a: 1 - rg(T, D.expu + .15, D.expu + 1.5) }); }
  if (Math.abs(T - (D.expu + .17)) < .05 && dt > 0) { sparks(10, 220, 80, 'orange', 520, 60); impact(10, 220, 'orange', 1.5); for (let i = 0; i < 40; i++) B.ink.spawn(10, 220, rnd(-400, 200), rnd(-300, 100)); SHK = 16; }
  if (T > D.expu + .15 && T < D.expu + .7) { FLASH = Math.max(FLASH, .7 * (1 - rg(T, D.expu + .15, D.expu + .7))); FLASHC = '255,230,190'; }
  if (Math.abs(T - (D.expu + 1.2)) < .05 && dt > 0) { impact(-560, 330, 'blue', .8); SHK = 10; }
  // el auror en la puerta del fondo
  const uk = fade(T, 524, 566, 1.5, 3);
  if (uk > 0) { const ux = SW * .44, F = mage(POSE.stand, { sex: 'm', hair: 'short', t: T, wind: .1 }); L(1); drawMage(F, ux, 330, 2.5, true, { a: uk, noGlow: 1, after: G => { ctx.fillStyle = 'rgba(16,14,18,.95)'; ctx.fillRect(G.Hd[0] - 7, G.Hd[1] - 14, 14, 12); ctx.fillRect(G.Hd[0] - 11, G.Hd[1] - 4, 22, 3); } }); glowAt(ux - 30, 210, 160, '255,200,120', .5 * uk); lights.push({ x: ux - 30, y: 210, c: '255,200,120', r: 300, a: .6 * uk }); }
  // ---------------- personajes (con luz y sombra de los hechizos) ----------------
  const key = lights.reduce((m, l) => (!m || l.a > m.a) ? l : m, null), sh = key ? { x: key.x, y: key.y, a: key.a } : null;
  dm('damien', DF, dx, dy, 2.6, dfl, T, { rot: drot, glow: T > D.expu + 1.2 ? .3 : 1, light: lights, shadowFrom: sh });
  dm('joy', JF, jx, jy, 2.5, jfl, T, { glow: T > D.d3 + .5 ? .65 : 1, light: lights, shadowFrom: sh });
  dm('draco', CF, cx, 330, 2.45, cfl, T, { a: ak, light: lights, shadowFrom: sh });
  dm('anami', AF, ax, 330, 2.6, afl, T, { a: ak, house: 'S', glow: 1 + fade(T, D.ex2, D.expu + 2, .1, 2) + .8 * fade(T, D.cl0, D.clEnd, .5, .3), light: lights, shadowFrom: sh });
}

/* ===================== EPÍLOGO: LA CARTA QUE NO ARDIÓ (562–598) ===================== */
scene(562, 598, 3, 2, {
  tin: 'bleed',
  draw(T, dt) {
    CAM = { z: 1.2 + .1 * rg(T, 562, 586), x: lerp(-150, 0, eio(rg(T, 562, 572))), y: 60 };
    L(.3); dS(B.room, 0, 0, 1, 0, 1); L(1); dS(B.door);
    // luz bajo la puerta y la sombra de unos pies que pasan
    mode('source-over'); ctx.fillStyle = `rgba(255,214,150,${.8 * SA})`; ctx.fillRect(130, 326, 180, 5); mode('multiply');
    if (T > 565.5 && T < 569.5) { const f = rg(T, 565.5, 569.5); ctx.fillStyle = `rgba(20,16,20,${.9 * SA})`; for (const o of [0, 26]) ctx.fillRect(lerp(110, 320, f) + o + Math.sin(f * 20 + o) * 4, 325, 16, 7); glowAt(lerp(120, 330, f), 324, 60, '90,230,140', .35); }
    // la vela de Joy
    const cx = -520, cy = 100; ctx.fillStyle = `rgba(230,220,200,${SA})`; ctx.fillRect(cx - 5, cy - 4, 10, 30); mode('source-over'); ctx.fillStyle = `rgba(255,200,110,${SA})`; ctx.beginPath(); ctx.ellipse(cx, cy - 12, 4, 10, 0, 0, TAU); ctx.fill(); mode('multiply'); glowAt(cx, cy - 12, 340, '255,190,110', .4);
    const lt = [{ x: cx, y: cy - 12, c: '255,190,110', r: 360, a: .8 }];
    // la carta se desliza bajo la puerta
    let lx = lerp(200, 90, eo(rg(T, 567, 568.5))), ly = 332;
    let jx = -560, jp = { ...SIT, lean: .35, ht: .45, la: 1.0, le: 1.4, ra: 1.1, re: 1.4 }, jfl = false;
    if (T > 569.5) { jx = lerp(-560, 40, eio(rg(T, 569.8, 573))); jp = T < 573 ? walkW(jx) : mixP(POSE.stand, KNEEL2, eio(rg(T, 573, 574.2))); }
    if (T > 583) jp = mixP(KNEEL2, { ...KNEEL2, ht: .7, ra: 1.4, re: 1.8 }, eio(rg(T, 583, 585)));
    if (T > 567 && T < 574.2) { L(1); mode('source-over'); ctx.save(); ctx.translate(lx, ly - 4); ctx.scale(.3, .13); dS(B.env[2].sp, 0, 0, 1, 0, 1); ctx.restore(); mode('multiply'); glowAt(lx, ly - 6, 70, '255,214,150', .25); }
    dm('joy', M('joy', jp, T, { wind: .1 }), jx, 340, 2.6, jfl, T, { light: lt, glow: .8 });
    // inserto: la carta medio quemada
    const ia = fade(T, 574.5, 583, .8, .8);
    if (ia > 0) { insertBg(ia * .92, '44,32,28'); L0(); glowAt(-200, -100, 600, '255,190,110', .3 * ia); dS(B.letter, 0, 0, 1.25 + .04 * rg(T, 574.5, 583), -.03 + .01 * Math.sin(T), ia); }
    // inserto: las muñecas con el hilo rojo del juramento
    const ha = fade(T, 586, 597, 1, 1.2);
    if (ha > 0) {
      insertBg(ha * .95, '22,18,22'); L0();
      const beat = Math.pow(Math.max(0, Math.sin(T * 3.4)), 6);
      for (const [x, fl2, hc] of [[-250, -1, '240,182,72'], [250, 1, '120,226,160']]) {
        ctx.save(); ctx.translate(x, 140); ctx.scale(1.6 * fl2, 1.6); ctx.globalAlpha = ha * SA; ctx.fillStyle = 'rgba(30,24,28,.95)'; ctx.shadowColor = `rgba(${hc},.5)`; ctx.shadowBlur = 20 * U; ctx.fill(B.hand); ctx.shadowBlur = 0;
        mode('source-over'); ctx.strokeStyle = `rgba(220,40,50,${(.6 + .4 * beat) * ha * SA * sm(rg(T, 588, 590))})`; ctx.lineWidth = 3; ctx.shadowColor = 'rgba(255,60,60,.95)'; ctx.shadowBlur = (10 + 20 * beat) * U; ctx.beginPath(); ctx.ellipse(0, 70, 19, 5, 0, 0, TAU); ctx.stroke(); ctx.shadowBlur = 0; mode('multiply');
        ctx.restore();
      }
      const k = sm(rg(T, 590, 593)); if (k > 0) { mode('source-over'); ctx.strokeStyle = `rgba(220,40,50,${.5 * k * ha * SA})`; ctx.lineWidth = 1.6; ctx.shadowColor = 'rgba(255,60,60,.9)'; ctx.shadowBlur = 10 * U; ctx.beginPath(); ctx.moveTo(-220, 252); for (let i = 1; i <= 40; i++) { const f = i / 40; ctx.lineTo(-220 + f * 440 * k, 252 + Math.sin(f * 14 + T * 2) * 10 * (1 - Math.abs(f - .5) * 2) + 30 * Math.sin(f * PI)); } ctx.stroke(); ctx.shadowBlur = 0; mode('multiply'); }
    }
  }
});

/* ===================== FINAL: CONTINUARÁ (596–) ===================== */
scene(596, 1e9, 3, .01, {
  draw(T, dt) {
    CAM = { z: 1, x: 0, y: 0 }; L0();
    const a = sm(rg(T, 597, 600)), sep = eio(rg(T, 601, 605));
    mode('source-over');
    dS(B.drops[0].sp, -150, -250, .9, 0, a, B.drops[0].bl.get(eo(rg(T, 597, 598.5))));
    dS(B.drops[1].sp, -30, -250, .9, 1, a, B.drops[1].bl.get(eo(rg(T, 597.5, 599))));
    dS(B.drops[2].sp, 90 + sep * 70, -250, .9, 2, a * (1 - sep), B.drops[2].bl.get(eo(rg(T, 598, 599.5))));
    dS(B.green.sp, 90 + sep * 70, -250, .9, 2, a * sep, B.green.bl.get(eo(rg(T, 601, 603))));
    mode('multiply');
    if (T > 602) { ctx.globalAlpha = a; brush(ctx, [[30, -300], [24, -270], [36, -240], [28, -205]], { w: () => 2.4, prog: eo(rg(T, 602, 603)), col: '20,16,18', a: .9, bristles: 2, body: 1, dryStart: 1, seed: 9 }); ctx.globalAlpha = 1; }
    // el hilo rojo une débilmente las tres gotas
    if (T > 604) { mode('source-over'); ctx.strokeStyle = `rgba(200,30,40,${.5 * sm(rg(T, 604, 607)) * SA})`; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(-150, -250); ctx.quadraticCurveTo(-90, -200 + Math.sin(T * 2) * 6, -30, -250); ctx.quadraticCurveTo(60, -195 + Math.sin(T * 2 + 1) * 6, 160, -250); ctx.stroke(); mode('multiply'); }
  }
});

/* ===================== TEXTOS ===================== */
const CUES = [
  { t: 3.6, d: 5.6, k: 'narr', x: 'Antes de las varitas y de las casas, hubo tres niños.' },
  { t: 10, d: 4.8, k: 'narr', x: 'Y un juramento sellado con sangre.' },
  { t: 15, d: 7.5, k: 'ptitle', x: '<b>El Juramento Roto</b><i>Episodio I</i>' },
  { t: 28.5, d: 6, k: 'card light', x: '<b>Primer acto</b><i>Planteamiento</i>' },
  { t: 35, d: 8, k: 'loc light', x: '<b>Condado de York</b><i>1879 · tres amigos desde la infancia</i>' },
  { t: 36, d: 6, k: 'narr light', x: 'Construían fuertes con sábanas y una sola vela…' },
  { t: 42.3, d: 5.4, k: 'narr light', x: '…y se contaban secretos bajo las mantas hasta el amanecer.' },
  { t: 53.8, d: 5, k: 'narr light', x: '<em class="R">Damien</em>, el líder carismático.' },
  { t: 59, d: 5, k: 'narr light', x: '<em class="G">Joy</em>, el corazón salvaje.' },
  { t: 64.2, d: 5, k: 'narr light', x: '<em class="G">Anami</em>, el estratega silencioso.' },
  { t: 69.6, d: 6, k: 'narr light', x: 'Bajo la luz del porche, juraron con sangre que nada los separaría.' },
  { t: 92, d: 8, k: 'loc light', x: '<b>Hogwarts</b><i>Escocia · 1890</i>' },
  { t: 99.5, d: 5.5, k: 'narr light', x: 'Años después, Hogwarts los recibió.' },
  { t: 106, d: 6.5, k: 'narr light', x: 'Nadie se fijó en la chica de Slytherin que los miraba desde la orilla.' },
  { t: 113.5, d: 6.5, k: 'narr light', x: '<em class="S">Draconida Malfoy</em>. Fría por fuera, decían.' },
  { t: 124, d: 6, k: 'narr light', x: 'En Hogwarts siguieron siendo inseparables.' },
  { t: 130.5, d: 5.5, k: 'narr light', x: 'Damien encantaba a todos. Joy no le temía a nada.' },
  { t: 137, d: 6, k: 'narr light', x: 'Y Anami… solo la miraba a ella.' },
  { t: 161, d: 6, k: 'narr light', x: 'Damien lo vio escribir su nombre en su cuaderno…' },
  { t: 167.5, d: 6.5, k: 'narr light', x: '…y oyó cómo se le quebraba la voz cada vez que ella reía.' },
  { t: 177.5, d: 6, k: 'card', x: '<b>Segundo acto</b><i>La traición</i>' },
  { t: 183.5, d: 6, k: 'narr light', x: 'Así que Damien se adelantó.' },
  { t: 190, d: 7, k: 'narr light', x: 'La invitó a salir primero.' },
  { t: 199.5, d: 5, k: 'narr light', x: 'Cuando Anami lo enfrentó, Damien se rió.' },
  { t: 205, d: 7.5, k: 'narr light voice', x: '«¿Mejores amigos? ¿Nosotros? Por favor. Solo eras conveniente.»' },
  { t: 224, d: 7.5, k: 'narr light', x: 'Damien le susurró a Joy cosas que Anami jamás habría hecho…' },
  { t: 232, d: 8, k: 'narr light', x: '…como esconder su varita la noche antes del torneo de varitas cruzadas.' },
  { t: 244.5, d: 6, k: 'loc light', x: '<b>Torneo de varitas cruzadas</b><i>Clasificatorio nacional</i>' },
  { t: 246, d: 5, k: 'narr light', x: 'Sin varita, Joy no pudo competir.' },
  { t: 251.8, d: 5.5, k: 'narr light', x: 'Perdió su lugar en el campeonato nacional.' },
  { t: 257.8, d: 7, k: 'narr light', x: 'Y Damien le susurró un nombre: <em class="G">Anami</em>.' },
  { t: 268, d: 4.5, k: 'narr light', x: 'Anami le escribió, una y otra vez.' },
  { t: 273, d: 6, k: 'narr light', x: 'Ella quemó cada carta.' },
  { t: 284, d: 7, k: 'narr light', x: 'Y si la buscaba en persona, lo apartaba como si él no existiera.' },
  { t: 297, d: 6, k: 'narr light', x: 'Esa misma noche, alguien rescató una carta de las cenizas.' },
  { t: 303.5, d: 6.5, k: 'narr light', x: 'Nadie la vio. A ella nunca la veía nadie.' },
  { t: 312, d: 6, k: 'narr light', x: 'Despacio, Anami aprendió a odiarla.' },
  { t: 318.5, d: 7, k: 'narr light', x: 'Un fuego lento… con raíces tan hondas que nada podría apagarlo.' },
  { t: 326, d: 8, k: 'narr light', x: 'Jamás perdonaría. Jamás olvidaría. Y empezó a prepararse.' },
  { t: 336, d: 5, k: 'narr light', x: 'Una noche encontró un libro sobre su mesa. Sin firma.' },
  { t: 341.5, d: 4.5, k: 'narr light', x: 'Dentro, una cinta de seda verde.' },
  { t: 346.5, d: 5.5, k: 'narr light', x: 'La ató a su varita sin saber por qué.' },
  { t: 357, d: 6, k: 'narr', x: 'Ella lo encontró practicando solo. Y se quedó.' },
  { t: 364, d: 7, k: 'narr', x: 'Le enseñó a escudarse. A esperar. A no fallar.' },
  { t: 372, d: 6, k: 'narr', x: 'Fría por fuera. Cálida por dentro.' },
  { t: 379, d: 8, k: 'narr', x: 'Y algo en Anami empezó a cambiar de color.' },
  { t: 392, d: 6.5, k: 'narr light', x: 'Hasta que una noche, el Sombrero Seleccionador sintió lo que ya había cambiado…' },
  { t: 404.4, d: 4.6, k: 'spell S', x: '¡Slytherin!' },
  { t: 410, d: 6, k: 'narr light', x: '…y gritó una corrección que Hogwarts jamás había oído.' },
  { t: 416.5, d: 6.5, k: 'narr light', x: 'A Joy le dolió, aunque seguía apartándolo. A Damien, ni le importó.' },
  { t: 423.5, d: 6.5, k: 'narr light', x: 'Solo una persona se puso de pie.' },
  { t: 432, d: 6, k: 'narr light', x: 'Para Damien, Joy se volvió un adorno: algo que lucir.' },
  { t: 438.5, d: 5.5, k: 'narr light', x: 'Nunca un beso. Nunca tomarla de la mano.' },
  { t: 451.5, d: 7, k: 'narr light', x: 'Y cuando ella no le hablaba «como debía»… él la golpeaba.' },
  { t: 461, d: 6, k: 'card light', x: '<b>Tercer acto</b><i>Resolución</i>' },
  { t: 462.5, d: 5, k: 'narr light', x: 'Esa noche, Joy por fin le hizo frente.' },
  { t: 482.4, d: 1.95, k: 'spell A', x: '¡Avada Keda—' },
  { t: 484.3, d: 2.2, k: 'spell X', x: '¡Expelliarmus!' },
  { t: 488, d: 4, k: 'narr light', x: 'Damien no iba a rendirse tan fácil.' },
  { t: 497.6, d: 2.2, k: 'spell P', x: '¡Protego!' },
  { t: 500, d: 2.3, k: 'spell X', x: '¡Expelliarmus!' },
  { t: 502.5, d: 2.5, k: 'spell C', x: '¡Sectumsempra!' },
  { t: 505.5, d: 2.6, k: 'spell O', x: '¡Expulso!' },
  { t: 516.5, d: 6, k: 'narr light', x: 'Hizo lo correcto. Y nada más.' },
  { t: 524.5, d: 5, k: 'narr light', x: 'Alguien avisó a un auror.' },
  { t: 530.5, d: 5.5, k: 'narr light', x: '<em class="S">Draconida</em> le pidió el brazo.' },
  { t: 536.3, d: 5.5, k: 'narr light', x: 'Esta vez no tuvo que cuidarlo desde la distancia.' },
  { t: 542, d: 6, k: 'narr light', x: 'Y él se lo ofreció con gusto.' },
  { t: 566, d: 7, k: 'narr light', x: 'Días después, una carta medio quemada apareció bajo la puerta de Joy.' },
  { t: 583.5, d: 3.5, k: 'narr light', x: 'Joy entendió. Demasiado tarde.' },
  { t: 588, d: 8, k: 'narr light', x: 'Pero un juramento de sangre no se rompe sin cobrar su precio.' },
];
const CHAPTERS = [[0, 'Prólogo'], [28, 'I · Planteamiento'], [176, 'II · La traición'], [390, 'La Selección'], [460, 'III · Resolución'], [562, 'Epílogo']];



