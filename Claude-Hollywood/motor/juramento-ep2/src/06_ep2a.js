/* =====================================================================
   GUION — «EL JURAMENTO ROTO · EPISODIO II · LA DEUDA DE SANGRE» (≈ 10 min)
   Prólogo · I La luna llena · II La deuda · III El porche · Epílogo
   ===================================================================== */
const END = 612;
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
  T.push(() => { B.cell = genCell(401); });
  T.push(() => { B.parapet = genParapet(402); });
  T.push(() => { B.door = genDoorRoom(105); B.letter = genBurntLetter(106); B.hand = handPath(1); B.room = genRoom(SPAN, '44,32,28', 82, .16); });
  T.push(() => { B.snowC = genSnowCourt(104); });
  T.push(() => { B.manor = genManor(403); B.mtable = genManorTable(408); B.fire = genFireplace(81); });
  T.push(() => { B.tome = genTome(404); });
  T.push(() => { B.min = genMinistry(405); });
  T.push(() => { B.roofs = genRooftops(406); B.crag = genCrag(407); });
  T.push(() => {
    SPK = new Parts(600, { spr: [null] });
    duelInit();
    B.motes = new Parts(220, { spr: [genBlob('255,214,120', 991, 32, .45, 4)], size: 6, grav: -55, drag: .6, life: [2.5, 4.5], flip: false, fin: .3 });
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

/* ===================== PRÓLOGO (0–30) ===================== */
const PRO = [[-150, -290], [150, -290], [0, -165]]; // Damien, Anami, Joy
scene(0, 30, .01, .5, {
  draw(T) {
    CAM = { z: 1, x: 0, y: 0 }; L0();
    if (T > 1 && T < 2.42) { const f = ei(rg(T, 1, 2.4)), y = lerp(-620, -4, f); ctx.fillStyle = `rgba(${INK},.92)`; ctx.beginPath(); ctx.ellipse(0, y, 4.5, 6 + f * 12, 0, 0, TAU); ctx.fill(); }
    const ba = (1 - sm(rg(T, 4.5, 8)) * .85) * (1 - sm(rg(T, 11, 15)));
    if (T > 2.4) dS(B.bloom.sp, 0, 0, 1 + .2 * eo(rg(T, 2.4, 10)), 0, ba * .85, B.bloom.bl.get(eo(rg(T, 2.4, 7.5))));
    const out = 1 - sm(rg(T, 25, 29.5));
    // la luna llena se eleva detrás del triángulo
    const mr = eo(rg(T, 10, 20)), my = lerp(160, -250, mr), ma = sm(rg(T, 10, 13)) * out;
    if (ma > 0) { mode('source-over'); dS(B.moonBig, 0, my, 1.25, 0, .9 * ma); mode('multiply'); const beat = Math.pow(Math.max(0, Math.sin(T * 3.4)), 6); glowAt(0, my, 520, '190,50,56', (.06 + .14 * beat * sm(rg(T, 16, 20))) * ma); }
    // tres gotas: dos rojas y una verde
    const shake = T > 17 ? 1.5 * Math.sin(T * 40) * sm(rg(T, 17, 19)) : 0;
    mode('source-over');
    PRO.forEach(([x, y], i) => {
      const t0 = 3.4 + i * .7; if (T < t0) return; const bl = eo(rg(T, t0, t0 + 1.2)), xx = x + shake * (i - 1), aa = out;
      if (i === 1) { const g = sm(rg(T, 5.5, 7.5)); dS(B.drops[1].sp, xx, y, .9, i, aa * (1 - g), B.drops[1].bl.get(bl)); dS(B.green.sp, xx, y, .9, i, aa * g, B.green.bl.get(eo(rg(T, 5.5, 7)))); }
      else dS(B.drops[i].sp, xx, y, .9, i, aa, B.drops[i].bl.get(bl));
    });
    mode('multiply');
    // el hilo rojo los une y se tensa con la luna
    if (T > 7.5) {
      const p = eo(rg(T, 7.5, 10.5)), tight = sm(rg(T, 16, 20)), a = out;
      for (let e = 0; e < 3; e++) {
        const P = PRO[e], Q = PRO[(e + 1) % 3], pe = clamp(p * 3 - e);
        if (pe <= 0) continue; const q = [lerp(P[0], Q[0], pe), lerp(P[1], Q[1], pe)];
        hilo(P, q, T, a * (.7 + .3 * tight), { sag: lerp(34, 4, tight) * pe, w: 1.4 + tight * 1.2, ph: e });
      }
    }
  }
});

/* ===================== I · LA CELDA DEL MINISTERIO (28–74) ===================== */
scene(26, 76.5, 4, .5, {
  tin: 'bleed',
  enter() { SPK.clear(); },
  draw(T, dt) {
    const ins = fade(T, 52, 58.5, .5, .6);
    CAM = { z: 1.22 + .1 * rg(T, 28, 46) + (T > 59 ? .18 * eio(rg(T, 59, 66)) : 0), x: T < 46 ? lerp(150, 90, rg(T, 28, 46)) : lerp(90, -40, eio(rg(T, 46, 49))), y: lerp(-20, 20, rg(T, 28, 74)) };
    L(.05); dS(B.night); starsDraw(B.stars, T, .9);
    L(1); mode('source-over'); dS(B.moon, -405, -330, .55, 0, .95); mode('multiply');
    L(1); dS(B.cell);
    cellShaft(T, 1);
    // Damien: sentado, se levanta, entra en la luz, intenta una chispa, el hilo lo muerde
    let x = 230, p = { ...SIT, lean: .35, ht: .45 - .55 * eio(rg(T, 43.5, 45)), la: 1.1, le: 1.4, ra: 1.0, re: 1.5 }, fl = true;
    if (T > 46) { x = lerp(230, -30, eio(rg(T, 46, 49.2))); p = T < 49.2 ? (T < 46.6 ? mixP(p, POSE.stand, rg(T, 46, 46.6)) : walkW(x)) : POSE.stand; }
    if (T > 49.4) p = mixP(POSE.stand, { ...CAST_P, ra: 1.9, re: -.3 }, eio(rg(T, 49.4, 50.2)));
    if (T > 51) p = mixP(p, CLUTCH, eio(rg(T, 51, 51.5)));
    if (T > 59) p = mixP(CLUTCH, { ...POSE.stand, ht: -.55, lean: -.12, la: .4, le: .4, ra: .5, re: .5 }, eio(rg(T, 66.5, 68.5)));
    if (T > 68.5) { p = { ...p, lean: -.12 + Math.sin(T * 9) * .03 * (1 - rg(T, 70, 72)), ht: -.55 + Math.sin(T * 9) * .05 * (1 - rg(T, 70, 72)) }; }
    const F = M('damien', p, T, { wind: .08 }), moon = { x: -330, y: -260, c: '196,206,236', r: 300, a: .85 * rg(x, 200, -30) };
    dm('damien', F, x, 330, 2.55, fl, T, { light: [moon] });
    const W = wr(F, x, 330, 2.55, fl), H2 = figPt(F.W2, x, 330, 2.55, fl);
    // chispa fallida
    if (T > 50 && T < 51.4) { const k = rg(T, 50, 50.4) * (1 - rg(T, 50.7, 51.3)); orb(H2[0], H2[1], 2 + 3 * k * weak(T), 'blue', k, T); if (dt > 0 && R() < dt * 20) sparks(H2[0], H2[1], 2, 'blue', 90, 30); }
    L(1); wristRing(W, T, .45 + (T > 51 ? .55 * fade(T, 51, 60, .2, 3) : 0), 6);
    sparksDraw(dt, T);
    // inserto: la mano y el hilo que se aprieta
    if (ins > 0) {
      insertBg(ins * .96, '16,16,24'); L0(); glowAt(-520, -320, 760, '190,200,240', .22 * ins);
      const beat = Math.pow(Math.max(0, Math.sin(T * 3.4)), 6), tg = eo(rg(T, 52.6, 56.5));
      ctx.save(); ctx.translate(0, 120); ctx.scale(1.75, 1.75); ctx.globalAlpha = ins * SA; ctx.fillStyle = 'rgba(30,26,30,.95)'; ctx.shadowColor = 'rgba(90,140,240,.5)'; ctx.shadowBlur = LOWQ ? 0 : 18 * U; ctx.fill(B.hand); ctx.shadowBlur = 0;
      const fk = (1 - rg(T, 53.4, 56)) * (.6 + .4 * N2(T * 20, 2));
      for (const [fx, fy] of [[-18, -120], [-5, -138], [8, -132], [20, -108]]) orb(fx, fy, 2.2, 'blue', fk * ins, T);
      mode('source-over'); ctx.strokeStyle = `rgba(230,46,54,${(.6 + .4 * beat) * ins * SA})`; ctx.lineWidth = 2.6 + tg; ctx.shadowColor = 'rgba(255,60,60,.95)'; ctx.shadowBlur = LOWQ ? 0 : (10 + 24 * beat) * U; ctx.beginPath(); ctx.ellipse(0, 70, lerp(21, 15.5, tg), 5, 0, 0, TAU); ctx.stroke(); ctx.shadowBlur = 0; mode('multiply');
      ctx.restore(); ctx.globalAlpha = 1;
    }
  }
});

/* ===================== I · TORRE DE ASTRONOMÍA (72–114) ===================== */
scene(72, 116, 4, .5, {
  tin: 'sweep',
  enter() { SPK.clear(); },
  draw(T, dt) {
    const close = eio(rg(T, 89, 93)) * (1 - eio(rg(T, 103, 107)));
    CAM = { z: lerp(1.12 + .06 * rg(T, 72, 89), 1.62, close), x: lerp(lerp(-40, 40, rg(T, 72, 89)), -30, close), y: lerp(40, 150, close) };
    const mX = -420, mY = -250;
    L(.05); dS(B.night); starsDraw(B.stars, T, .9); L(.06); mode('source-over'); dS(B.moonBig, mX, mY, 1, 0, .95); mode('multiply'); moonGlow(mX, mY, T, 1);
    mtnDraw(0, .15, .6); mtnDraw(1, .28, .55); mistDraw(T, 0, 160, .3, .3, 5);
    L(.45); dS(B.castle.sp, 420, 185, .5, 0, .55); winGlow(B.castle.wins, T, .6, 420, 185, .5);
    mistDraw(T, 1, 200, .5, .35, 9);
    L(1); dS(B.parapet);
    // Anami practica; el escudo se apaga con la luna
    const ax = -80; let ap = DUEL, aWand = true, shA = 0;
    if (T > 74.6 && T < 75.6) ap = mixP(DUEL, LUNGE, Math.sin(rg(T, 74.6, 75.5) * PI));
    if (T > 76.8 && T < 77.8) ap = mixP(DUEL, LUNGE, Math.sin(rg(T, 76.8, 77.7) * PI));
    if (T > 79 && T < 83.6) { ap = BLOCK; shA = fade(T, 79.3, 83.6, .3, .05) * weak(T, rg(T, 80, 83.4)); }
    if (T > 83.6) ap = mixP(STAGGER, KNEELW, eio(rg(T, 84, 85.6)));
    if (T > 104) ap = mixP(KNEELW, POSE.stand, eio(rg(T, 105.6, 107.4)));
    if (T > 107.4) ap = mixP(POSE.stand, { ...POSE.stand, la: .9, le: 1.2 }, eio(rg(T, 109, 110.5)));
    if (T > 85) aWand = false;
    const AF = M('anami', ap, T, { wand: aWand, thread: aWand, wind: .7 });
    const atip = AF.tip ? figPt(AF.tip, ax, 330, 2.6, true) : null;
    // Draconida llega, se arrodilla, enciende su varita
    let cx = lerp(SW * .62, 70, eo(rg(T, 85.4, 88.6))), cp = T < 88.6 ? runP(cx / 60 * TAU) : mixP(POSE.stand, KNEEL2, eio(rg(T, 88.6, 89.4))), cfl = true, cWand = T > 89.2 && T < 105;
    if (T > 103.5) { cx = lerp(70, 40, rg(T, 104, 105)); cp = mixP(KNEEL2, { ...REACH, ra: .9, re: .1 }, eio(rg(T, 103.5, 105.2))); }
    if (T > 107.4) cp = mixP({ ...REACH, ra: .9, re: .1 }, { ...REACH, ra: 1.2 }, eio(rg(T, 108, 109.5)));
    const ck = sm(rg(T, 85.4, 86.4));
    const CF = M('draco', cp, T, { wand: cWand, wind: .7, vx: T > 85.4 && T < 88.6 ? 220 : 0, wandA: cWand ? .6 : undefined });
    const ctip = CF.tip ? figPt(CF.tip, cx, 330, 2.45, cfl) : null;
    const lights = [{ x: mX + 300, y: mY, c: '196,206,236', r: 400, a: .6 }];
    if (ctip) { const la = fade(T, 89.3, 105, .4, .6); orb(ctip[0], ctip[1], 4 + Math.sin(T * 5), 'sg', la * .9, T); lights.push({ x: ctip[0], y: ctip[1], c: '150,236,180', r: 260, a: la }); glowAt(ctip[0], ctip[1], 240, '140,230,170', .35 * la); }
    // hechizos de práctica y escudo
    if (atip) {
      for (const t0 of [74.9, 77.1]) if (T > t0 && T < t0 + .7) { const p = rg(T, t0, t0 + .25); beam(atip[0], atip[1], atip[0] - 520, atip[1] - 260, p, 'red', 1 - rg(T, t0 + .4, t0 + .7), T, 3.5, t0); lights.push({ x: atip[0] - 60, y: atip[1] - 30, c: '226,44,40', r: 200, a: 1 - rg(T, t0 + .3, t0 + .7) }); }
      if (shA > 0) { shield(atip[0] - 26, atip[1], 72, 'gold', shA, T, 0, -1); lights.push({ x: atip[0] - 26, y: atip[1], c: '240,182,72', r: 220, a: shA }); }
    }
    if (Math.abs(T - 83.6) < .045 && dt > 0 && atip) { sparks(atip[0] - 30, atip[1], 40, 'gold', 260); SHK = 6; }
    dm('anami', AF, ax, 330, 2.6, true, T, { light: lights, a: 1 });
    dm('draco', CF, cx, 330, 2.45, cfl, T, { a: ck, light: lights, glow: .85 });
    const W = wr(AF, ax, 330, 2.6, true);
    L(1); wristRing(W, T, .5 + .5 * fade(T, 83.4, 100, .15, 4), 6);
    if (T > 83.5 && T < 86) glowAt(W[0], W[1], 120, '230,50,56', .5 * (1 - rg(T, 83.5, 86)));
    sparksDraw(dt, T);
  }
});

/* ===================== I · JOY Y LA VELA (112–146) ===================== */
scene(112, 146, 4, 2.5, {
  tin: 'bleed2',
  enter() { SPK.clear(); },
  draw(T, dt) {
    const ins = fade(T, 123.4, 130.6, .7, .7);
    CAM = { z: 1.32 + .08 * rg(T, 112, 123), x: T < 131 ? lerp(-420, -380, rg(T, 112, 123)) : lerp(-380, -60, eio(rg(T, 131, 138))), y: 70 };
    L(.3); dS(B.room, 0, 0, 1, 0, 1); L(1); dS(B.door);
    L0(); mode('source-over'); ctx.fillStyle = `rgba(30,36,60,${.12 * SA})`; ctx.fillRect(-SW, -560, SW * 2, 1120); mode('multiply');
    L(1); glowAt(-900, -100, 800, '190,200,236', .26);
    const open = eio(rg(T, 138.4, 140.2));
    mode('source-over'); ctx.fillStyle = `rgba(255,214,150,${.75 * SA})`; ctx.fillRect(130, 326, 180, 5); if (open > 0) { ctx.fillStyle = `rgba(255,206,140,${.55 * open * SA})`; ctx.fillRect(122, -40, 190 * open, 370); } mode('multiply');
    if (open > 0) glowAt(140, 150, 500, '255,196,120', .35 * open);
    candle(-470, 96, T, 0);
    // Joy sentada a la mesa
    let jx = -620, jp = { ...SIT, lean: .3, ht: .3, la: 1.0, le: 1.3, ra: 1.1, re: 1.2 }, jw = false, jfl = false;
    if (T > 115.8 && T < 120.2) { jw = true; jp = mixP(jp, { ...SIT, lean: .25, ht: .05, la: 1.0, le: 1.3, ra: 1.5, re: .1 }, eio(rg(T, 115.8, 116.5))); }
    if (T > 119.8) jp = mixP({ ...SIT, lean: .25, ht: .05, la: 1.0, le: 1.3, ra: 1.5, re: .1 }, { ...SIT, lean: .45, ht: .6, la: 1.3, le: 1.6, ra: 1.0, re: 1.9 }, eio(rg(T, 119.8, 120.4)));
    if (T > 121) jp = mixP({ ...SIT, lean: .45, ht: .6, la: 1.3, le: 1.6, ra: 1.0, re: 1.9 }, { ...SIT, lean: .3, ht: .4, la: 1.2, le: .5, ra: 1.0, re: 1.5 }, eio(rg(T, 121, 122.5)));
    if (T > 131) { jp = mixP(jp, POSE.stand, eio(rg(T, 131, 132))); }
    if (T > 132.6) { jx = lerp(-620, 160, eio(rg(T, 132.6, 141))); jp = walkW(jx); }
    const lt = [{ x: -900, y: -100, c: '190,200,236', r: 400, a: .5 }];
    if (open > 0) lt.push({ x: 220, y: 100, c: '255,196,120', r: 400, a: open });
    const JF = M('joy', jp, T, { wand: jw, wind: .1 }), ja = 1 - sm(rg(T, 141, 143));
    dm('joy', JF, jx, 340, 2.6, jfl, T, { light: lt, glow: .7, a: ja });
    if (T > 120.2 && T < 146) wandAt(-500, 118, .1, 34, 1);
    if (JF.tip) { const tp = figPt(JF.tip, jx, 340, 2.6, jfl); for (const [t0, t1, k] of [[116.4, 117.4, .6], [118.4, 119.8, 1]]) if (T > t0 && T < t1) { const f = rg(T, t0, t0 + .3) * (1 - rg(T, t1 - .5, t1)); orb(tp[0], tp[1], 2 + 3 * k * f, 'gold', f * weak(T, .8), T); if (dt > 0 && R() < dt * 25 * k) sparks(tp[0], tp[1], 2, 'gold', 80, 20); } }
    if (T > 121.5 && T < 143) letterAt(figPt(JF.W1, jx, 340, 2.6, jfl), ja, .1, -.3);
    L(1); wristRing(wr(JF, jx, 340, 2.6, jfl), T, (.4 + .6 * fade(T, 119.6, 126, .15, 3)) * ja, 6);
    sparksDraw(dt, T);
    if (ins > 0) { insertBg(ins * .93, '30,26,32'); L0(); glowAt(-300, -200, 700, '200,210,240', .2 * ins); dS(B.letter, 0, 0, 1.3 + .03 * rg(T, 123.4, 130.6), -.04 + .012 * Math.sin(T * 1.3), ins); }
  }
});
