/* =====================================================================
   BASE DEL EPISODIO III: carga, utilidades, poses, porche (de Ep. II)
   ===================================================================== */
const END = 608;
const B = {};
const SC = [];
function scene(t0, t1, fi, fo, o) { SC.push(Object.assign({ t0, t1, fi, fo, on: false }, o)); }
let FLASH = 0, CUT = null, SPAN = 2600, FLASHC = '246,238,222';
let SNOW = [];
CAST.anami.house = 'S';

function buildTasks() {
  SPAN = SW * 1.45 + 200;
  const T = [];
  T.push(async () => {
    const fams = [`60px 'Pinyon Script'`, `40px 'IM Fell English SC'`, `40px 'IM Fell English'`, `italic 40px 'IM Fell English'`];
    try { await Promise.race([Promise.all(fams.map(f => document.fonts.load(f))), new Promise(r => setTimeout(r, 2500))]); } catch (e) { }
    if (!document.fonts.check(`60px 'Pinyon Script'`)) HANDF = "'Snell Roundhand', 'Apple Chancery', 'Lucida Handwriting', 'Segoe Script', cursive";
  });
  T.push(() => { GRAIN = makeGrain(); B.paper = makePaper(W, H); });
  T.push(() => { B.tex = makeTexture(Math.ceil(W / 2), Math.ceil(H / 2)); B.vig = makeVignette(Math.ceil(W / 4), Math.ceil(H / 4)); B.bars = genBars(); });
  T.push(() => { B.trans = { bleed: makeTrans('bleed', 1), sweep: makeTrans('sweep', 2), down: makeTrans('down', 3), bleed2: makeTrans('bleed', 4) }; });
  T.push(() => {
    B.bloom = genInkBloom(150, 11);
    B.drops = [0, 1, 2].map(i => genSplat(700 + i, 26, '170,20,34'));
    B.green = genSplat(720, 30, '30,120,70'); B.gold = genSplat(725, 26, '200,150,50');
    B.flames = [0, 1, 2].map(i => genFlame(80 + i)); B.gflames = B.flames.map(greenFlame);
  });
  T.push(() => { B.night = genSky(SPAN, '26,30,50', 61, -580, 340, 1.35); B.dusk = genSky(SPAN, '196,132,100', 62, -580, 300, .55); B.moon = genMoonPale(70); B.moonBig = genMoonPale(130); B.stars = genStars(160, 9); });
  T.push(() => {
    B.mtn = [];
    B.mtn[0] = genMount({ seed: 11, span: SPAN, n: 10, hmax: 200, wk: 130, y0: 120, depth: 260, rough: 26, col: '70,76,100', alpha: .06, band: 30, mist: .3, cun: 0 });
    B.mtn[1] = genMount({ seed: 12, span: SPAN, n: 8, hmax: 240, wk: 160, y0: 210, depth: 280, rough: 30, col: '44,48,66', alpha: .07, band: 40, mist: .4, cun: 1, cunW: .8 });
    B.mist = [1, 2, 3].map(s => genMist(1300, 70, s));
  });
  T.push(() => { B.castle = genCastle(21); B.lake = genGround(SPAN, 200, '70,82,110', .07, 22, 2, 400); B.shore = genGround(SPAN, 430, '18,18,26', .12, 23, 14, 200); });
  T.push(() => { B.hs = genHouseSnow(31); B.snowG = genGround(SPAN, 330, '150,158,184', .05, 212, 6, 300); B.gP = genGround(SPAN, 330, '24,26,30', .12, 32, 10, 300); });
  T.push(() => { B.tree = [genBareTree(301, 470), genBareTree(302, 380)]; });
  T.push(() => { B.parapet = genParapet(402); B.day = genSky(SPAN, '150,166,186', 63, -580, 300, .35); });
  T.push(() => { B.door = genDoorRoom(105); B.hand = handPath(1); B.room = genRoom(SPAN, '44,32,28', 82, .16); B.bletter = genBlackLetter(409); B.letter = genBurntLetter(106); });
  T.push(() => { B.snowC = genSnowCourt(104); });
  T.push(() => { B.common = genCommonRoom(410); });
  T.push(() => { B.ruin = genRuin(411); B.corr = genCorridor(71); });
  T.push(() => { B.house = genHouse(31); B.gGrass = genGround(SPAN, 330, '58,70,46', .08, 33, 8, 300); B.G = grassInit(240, -SW * .9, SW * .9, 334, 8, 30, 5); seed(12); B.ff = []; for (let i = 0; i < 40; i++) B.ff.push({ x: rnd(-900, 900), y: rnd(-60, 300), ph: rnd(TAU), sp: rnd(.2, .6) }); });
  T.push(() => {
    SPK = new Parts(600, { spr: [null] });
    duelInit();
    B.motes = new Parts(260, { spr: [genBlob('255,214,120', 991, 32, .45, 4)], size: 6, grav: -55, drag: .6, life: [2.5, 4.5], flip: false, fin: .3 });
    seed(77); SNOW = []; for (let i = 0; i < 260; i++) SNOW.push({ x: rnd(-1300, 1300), y: rnd(-560, 560), r: rnd(1, 3.2), v: rnd(30, 80), ph: rnd(TAU) });
  });
  return T;
}

/* ---------- utilidades ---------- */
function mtnDraw(i, d, a = 1) { L(d); dS(B.mtn[i].sp, 0, 0, 1, 0, a); }
function mistDraw(T, i, y, d, a, sp = 8) { mode('source-over'); L(d); const ms = B.mist[i % 3], w = 1300, off = ((T * sp + i * 517) % (SPAN + w)) - SPAN / 2 - w / 2; dS(ms, off, y, 1, 0, a); dS(ms, off - SPAN * .55, y + 18, .9, 0, a * .8); mode('multiply'); }
function nightBack(T, moonX = SW * .28, moonY = -300, a = 1, big = 0) { L(.05); dS(B.night, 0, 0, 1, 0, a); starsDraw(B.stars, T, .9 * a); L(.04); mode('source-over'); dS(big ? B.moonBig : B.moon, moonX, moonY, 1, 0, .95 * a); mode('multiply'); }
function M(who, p, T, o = {}) { const c = CAST[who]; return mage(p, Object.assign({ sex: c.sex, hair: c.hair, t: T, wind: .45 }, o)); }
function dm(who, F, x, y, s, flip, T, o = {}) { L(1); drawMage(F, x, y, s, flip, Object.assign({ house: CAST[who].house, t: T }, who === 'damien' ? { glow: .45, ignite: .5 } : {}, o)); }
const wr = (F, x, y, s, fl, rot = 0) => figPt(F.W1, x, y, s, fl, rot);
const SIT = { hy: 24, lean: .12, ht: .1, lt: 1.45, lk: 1.5, rt: 1.55, rk: 1.6, la: .8, le: 1.0, ra: .9, re: .95, sw: 0 };
const REACH = { hy: 49, lean: .08, ht: .05, lt: -.1, lk: .05, rt: .12, rk: .06, la: .1, le: .2, ra: 1.45, re: .1, sw: 0 };
const CAST_P = { hy: 48, lean: .1, ht: -.05, lt: -.3, lk: .15, rt: .32, rk: .2, la: .2, le: .4, ra: 1.55, re: -.05, sw: 0 };
const RAISE = { hy: 49, lean: -.05, ht: -.15, lt: -.2, lk: .08, rt: .22, rk: .1, la: .2, le: .4, ra: 2.5, re: -.2, sw: 0 };
const FLINCH = { hy: 46, lean: -.18, ht: -.3, lt: -.35, lk: .3, rt: .2, rk: .15, la: 1.6, le: 1.8, ra: 1.5, re: 1.9, sw: 0 };
const COWER = { hy: 26, lean: .55, ht: .5, lt: 1.4, lk: 1.6, rt: -.2, rk: 1.5, la: 1.4, le: 2.0, ra: 1.3, re: 2.1, sw: 0 };
const KNEEL2 = { hy: 26, lean: .25, ht: .35, lt: 1.45, lk: 1.55, rt: -.1, rk: 1.45, la: .9, le: .4, ra: 1.0, re: .3, sw: 0 };
const CLUTCH = { hy: 45, lean: .32, ht: .35, lt: -.25, lk: .25, rt: .3, rk: .3, la: 1.15, le: 1.5, ra: .9, re: 1.75, sw: 0 }; // se agarra la muñeca
const ARMS = { hy: 49, lean: .02, ht: .08, lt: -.13, lk: .06, rt: .15, rk: .08, la: 1.25, le: 2.1, ra: 1.25, re: 2.1, sw: 0 };  // brazos cruzados
const CUFF = { hy: 48, lean: .1, ht: .15, lt: -.13, lk: .06, rt: .15, rk: .08, la: 1.05, le: .5, ra: 1.1, re: .45, sw: 0 }; // manos esposadas
const KNEELW = { hy: 26, lean: .3, ht: .45, lt: 1.45, lk: 1.55, rt: -.1, rk: 1.45, la: 1.2, le: 1.4, ra: .9, re: 1.8, sw: 0 }; // de rodillas, mano en la muñeca
function walkW(x) { return walkP(x / 70 * TAU, 0); }
function snowDraw(T, dt, a = 1, wind = 6) { L(1); mode('source-over'); ctx.fillStyle = `rgba(246,244,240,${.85 * a * SA})`; for (const f of SNOW) { if (dt > 0) { f.y += f.v * dt; f.x += Math.sin(T * .8 + f.ph) * 12 * dt + wind * dt; if (f.y > 560) { f.y -= 1120; f.x = rnd(-1300, 1300); } } ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, TAU); ctx.fill(); } mode('multiply'); }
function insertBg(a, col = '239,229,207') { L0(); mode('source-over'); ctx.fillStyle = `rgba(${col},${a * SA})`; ctx.fillRect(-SW, -560, SW * 2, 1120); mode('multiply'); }
function moonGlow(x, y, T, a, d = .06) { L(d); const beat = Math.pow(Math.max(0, Math.sin(T * 3.4)), 6); glowAt(x, y, 420, '200,70,70', (.06 + .1 * beat) * a); }
/* candela: cuerpo + llama (si arde) */
function candle(x, y, T, lit, h = 28) { L(1); ctx.fillStyle = `rgba(230,220,200,${SA})`; ctx.fillRect(x - 5, y - h + 24, 10, h); if (lit > 0) { const fl = 1 + .15 * N2(T * 6, x); mode('source-over'); ctx.fillStyle = `rgba(255,200,110,${lit * SA})`; ctx.beginPath(); ctx.ellipse(x, y - h + 12 * (1 - fl) + 12, 4, 10 * fl, N2(T * 3, x) * .2, 0, TAU); ctx.fill(); mode('multiply'); glowAt(x, y - h + 12, 300 * fl, '255,190,110', .36 * lit); glowAt(x, y - h + 12, 36, '255,236,190', .7 * lit); } }
/* hechizo debilitado por la luna: parpadea */
const weak = (T, k = 1) => 1 - k * (.45 + .45 * N2(T * 22, 7.3));
/* la carta medio quemada en la mano */
function letterAt(p, a = 1, s = .1, r = -.2) { L(1); ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(r); mode('source-over'); dS(B.letter, 0, 0, s, 0, a); mode('multiply'); ctx.restore(); }

function solid2(x0, y0, x1, y1) { ctx.fillStyle = `rgba(26,26,34,${.9 * SA})`; ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x0, y0); for (let x = x0; x <= x1; x += 60) ctx.lineTo(x, y0 + Math.sin(x * .02) * 2); ctx.lineTo(x1, y1); ctx.fill(); }
const HX = -283, HY = -48, HS = 1.35, PFY = HY + 232 * HS, LX = HX + 150 * HS, LY = HY + 62 * HS;
function lantern(T, lit, broken = 0) {
  L(1); ctx.strokeStyle = `rgba(20,18,20,${SA})`; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(LX, HY + 10 * HS); ctx.lineTo(LX, LY - 16); ctx.stroke();
  ctx.fillStyle = `rgba(20,18,20,${SA})`; ctx.beginPath(); ctx.moveTo(LX - 13, LY - 12); ctx.lineTo(LX, LY - 20); ctx.lineTo(LX + 13, LY - 12); ctx.fill(); ctx.fillRect(LX - 11, LY + 12, 22, 4);
  if (!broken) { mode('source-over'); ctx.fillStyle = lit > 0 ? `rgba(255,214,140,${(.25 + .7 * lit) * SA})` : `rgba(60,60,80,${.4 * SA})`; ctx.fillRect(LX - 9, LY - 11, 18, 23); mode('multiply'); }
  ctx.strokeStyle = `rgba(20,18,20,${SA})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.rect(LX - 9, LY - 11, 18, 23); if (broken) { ctx.moveTo(LX - 9, LY); ctx.lineTo(LX - 3, LY + 4); ctx.lineTo(LX + 2, LY - 4); } ctx.stroke();
  if (lit > 0) { const fl = .88 + .12 * N2(T * 3, 1); glowAt(LX, LY, 380 * fl, '255,196,110', .5 * lit); glowAt(LX, LY, 44, '255,236,180', .9 * lit); }
}
function porchBack(T, dawn, unveil) {
  if (!dawn) { L(.05); dS(B.night); starsDraw(B.stars, T, .9); }
  else { L(.05); dS(B.dusk); glowAt(SW * .6, 150, 1000, '255,186,140', .38); }
  const mY = dawn ? -60 : lerp(-180, -330, eio(rg(T, 372, 394))), mX = dawn ? -600 : 560 - (CAM.x + 190) * .95, ma = dawn ? .35 : lerp(.35, 1, unveil);
  L(.06); mode('source-over'); dS(dawn ? B.moon : B.moonBig, mX, mY, dawn ? .9 : .82, 0, .95 * ma); mode('multiply');
  if (!dawn) { moonGlow(mX, mY, T, unveil); mistDraw(T, 2, mY - 30, .07, .55 * (1 - unveil), 5); mistDraw(T, 0, mY + 40, .08, .4 * (1 - unveil), -4); }
  mtnDraw(0, .15, .5); mistDraw(T, 1, 230, .35, .3, 4);
  L(1); dS(B.tree[0], -1000, 330, 1.1); dS(B.tree[1], 860, 330, 1);
  L(1); dS(B.snowG); dS(B.hs.sp, HX, HY, HS); houseWinsDark(B.hs, T, HX, HY, HS, 0);
}
