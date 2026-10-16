/* ===================== II · EL SECRETO DE DRACONIDA (120–150) ===================== */
scene(120, 150, 4, .5, {
  tin: 'down',
  draw(T, dt) {
    const ins = fade(T, 130, 138.6, .6, .7);
    CAM = { z: 1.3 + .1 * rg(T, 120, 150), x: lerp(-260, -80, rg(T, 120, 150)), y: 110 };
    nightBack(T, -400, -250, .8);
    L(1); dS(B.corr);
    mode('source-over'); L(1); for (let x = -1000; x <= 1000; x += 400) { const k = (.07 + .02 * Math.sin(T * .5 + x)) * SA; ctx.fillStyle = `rgba(200,210,236,${k})`; ctx.beginPath(); ctx.moveTo(x - 75, -40); ctx.lineTo(x + 75, -40); ctx.lineTo(x + 330, 560); ctx.lineTo(x + 40, 560); ctx.fill(); } mode('multiply');
    let cx = lerp(-560, -100, eo(rg(T, 120.5, 126))), cp = T < 126 ? walkW(cx) : POSE.stand, cfl = false;
    if (T > 127) cp = mixP(POSE.stand, { ...POSE.stand, la: 1.6, le: 1.4, ht: .4, lean: .08 }, eio(rg(T, 127, 128.4)) * (1 - eio(rg(T, 139, 140.4))));
    if (T > 140.6 && T < 143) cfl = true;
    if (T > 143.4) { cx = lerp(-100, SW * .6, rg(T, 143.4, 152)); cp = walkW(cx); cfl = false; }
    const CF = M('draco', cp, T, { wind: .2 });
    dm('draco', CF, cx, 330, 2.5, cfl, T, { light: [{ x: 80, y: 100, c: '200,210,236', r: 400, a: .5 }], glow: .9 });
    if (T > 127.5 && T < 140) { L(1); wristRing(wr(CF, cx, 330, 2.5, cfl), T, .9, 5); }
    if (ins > 0) {
      insertBg(ins * .95, '20,20,30'); L0(); glowAt(-300, -260, 700, '200,210,236', .2 * ins);
      const beat = Math.pow(Math.max(0, Math.sin(T * 3.4)), 6), tr = Math.sin(T * 13) * .6;
      ctx.save(); ctx.translate(tr, 150); ctx.scale(1.7, 1.7); ctx.globalAlpha = ins * SA; ctx.fillStyle = 'rgba(40,38,46,.95)'; ctx.shadowColor = 'rgba(214,224,224,.4)'; ctx.shadowBlur = LOWQ ? 0 : 16 * U; ctx.fill(B.hand); ctx.shadowBlur = 0;
      mode('source-over'); ctx.strokeStyle = `rgba(230,46,54,${(.45 + .4 * beat) * ins * SA})`; ctx.lineWidth = 1.6; ctx.shadowColor = 'rgba(255,60,60,.95)'; ctx.shadowBlur = LOWQ ? 0 : (8 + 16 * beat) * U; ctx.beginPath(); ctx.ellipse(0, 70, 18, 5, 0, 0, TAU); ctx.stroke(); ctx.shadowBlur = 0;
      const g = .5 + .5 * Math.sin(T * 2.2); ctx.strokeStyle = `rgba(90,240,130,${.4 * g * ins * SA})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(0, 70, 22, 7, 0, 0, TAU); ctx.stroke(); mode('multiply');
      ctx.restore(); ctx.globalAlpha = 1;
    }
  }
});

/* ===================== II · LA SEGUNDA LUNA (148–198) ===================== */
scene(148, 200, 4, .5, {
  tin: 'bleed',
  enter() { SPK.clear(); },
  draw(T, dt) {
    const k = eio(rg(T, 157, 160)) * (1 - eio(rg(T, 192, 196)));
    CAM = { z: lerp(1.1, 1.38, k), x: lerp(lerp(240, 120, rg(T, 148, 157)), 60, k), y: lerp(70, 125, k) };
    nightBack(T, 260, -330, .9, 1); moonGlow(260, -330, T, 1, .04);
    L(1); dS(B.snowC);
    for (let x = -1080; x <= 1080; x += 360) glowAt(x, -200, 170, '255,196,110', .3 + .04 * N2(T * 2, x));
    // llegan del brazo; ella cae
    let ax = lerp(SW * .7, 95, eo(rg(T, 148.5, 155))), ap = T < 155 ? walkW(ax) : POSE.stand, afl = true;
    let cx = ax + 120, cp = T < 155 ? walkW(cx + 20) : POSE.stand, cfl = true;
    if (T > 155) cx = 265;
    if (T > 158) cp = mixP(CLUTCH, KNEELW, eio(rg(T, 158.4, 159.4))), cp = T < 158.4 ? mixP(POSE.stand, CLUTCH, eio(rg(T, 158, 158.4))) : cp;
    if (T > 159) { afl = false; ap = mixP(POSE.stand, { ...KNEEL2, ra: 1.3, re: .3 }, eio(rg(T, 159.2, 160.6))); }
    if (T > 190) { ap = mixP({ ...KNEEL2, ra: 1.3, re: .3 }, { ...REACH, ra: 1.0, re: .3 }, eio(rg(T, 190, 191.6))); cp = mixP(KNEELW, { ...POSE.stand, la: .8, le: 1.0 }, eio(rg(T, 191, 192.8))); }
    // Joy llega corriendo con el libro
    let jx = lerp(-SW * .72, -250, eo(rg(T, 166, 169.6))), jp = T < 169.6 ? runP(jx / 60 * TAU) : mixP(POSE.stand, { ...REACH, ra: 1.0, re: 1.2 }, eio(rg(T, 170, 171)));
    if (T > 184) jp = mixP({ ...REACH, ra: 1.0, re: 1.2 }, { ...POSE.stand, ht: .4 }, eio(rg(T, 184, 185.5)));
    const ja = sm(rg(T, 166, 167));
    const lt = [{ x: 260, y: -330, c: '200,210,236', r: 500, a: .5 }], pain = fade(T, 158, 196, .3, 4);
    if (pain > 0) lt.push({ x: 260, y: 200, c: '90,240,130', r: 300, a: .7 * pain });
    const AF = M('anami', ap, T, { wind: .4 }), CF = M('draco', cp, T, { wind: .4 }), JF = M('joy', jp, T, { wind: .5, vx: T < 169.6 ? 220 : 0 });
    dm('draco', CF, cx, 330, 2.4, cfl, T, { light: lt, glow: .8 });
    dm('anami', AF, ax, 330, 2.55, afl, T, { light: lt, green: 1 });
    if (ja > 0) { dm('joy', JF, jx, 330, 2.5, false, T, { a: ja, light: lt }); if (T > 169.6 && T < 185) { L(1); const h = figPt(JF.W2, jx, 330, 2.5, false); ctx.fillStyle = `rgba(50,34,28,${SA})`; ctx.fillRect(h[0] - 6, h[1] - 12, 22, 14); } }
    const AW = wr(AF, ax, 330, 2.55, afl), CW = wr(CF, cx, 330, 2.4, cfl);
    chestPain(CF, cx, 330, 2.4, cfl, T, pain * 1.3); chestPain(AF, ax, 330, 2.55, afl, T, pain * .5);
    L(1); if (T > 158) { hilo(AW, CW, T, .6 + .3 * pain, { sag: 30, w: 1.4 }); vein(AW, CW, T, pain, { sag: 30, speed: .45 }); }
    wristRing(AW, T, .7, 6); if (T > 158) wristRing(CW, T, .5 + .5 * pain, 5);
    if (T > 158 && T < 158.8) { FLASH = Math.max(FLASH, .35 * (1 - rg(T, 158, 158.8))); FLASHC = '200,255,214'; }
    if (Math.abs(T - 158.2) < .05 && dt > 0) sparks(CW[0], CW[1], 30, 'green', 220);
    snowDraw(T, dt, .8); sparksDraw(dt, T);
  }
});

/* ===================== II · LA CARTA DE DAMIEN (196–234) ===================== */
scene(196, 234, 4, .5, {
  tin: 'down',
  enter() { SPK.clear(); },
  draw(T, dt) {
    const ins = fade(T, 207, 220, .7, .8);
    CAM = { z: 1.22 + .08 * rg(T, 196, 234), x: lerp(-20, 80, rg(T, 196, 234)), y: 60 };
    L(.05); dS(B.day); mtnDraw(0, .15, .7); mtnDraw(1, .28, .6); mistDraw(T, 0, 160, .3, .35, 5);
    L(.45); dS(B.castle.sp, 420, 185, .5, 0, .55);
    L(1); dS(B.parapet);
    birds(T, { t0: 196.5, t1: 201.2, n: 1, x0: -900, x1: 330, y0: -260, y1: 110, spread: 1, s: 22, d: 1, seed: 3, crow: 1, fr: 7 });
    if (T > 201 && T < 213) raven(330, 124, 1.6, T, fade(T, 201, 213, .2, .6));
    // la carta cae y Anami la recoge
    let lx = 300, ly = lerp(118, 330, ei(rg(T, 202.4, 203.4))), held = T > 205.4;
    let ap = POSE.stand, afl = false;
    if (T > 203.6 && T < 206.4) ap = mixP(POSE.stand, KNEEL2, Math.sin(rg(T, 203.6, 206.4) * PI));
    if (T > 206.4) ap = mixP(POSE.stand, { ...REACH, ra: 1.1, re: .7, ht: .3 }, eio(rg(T, 206.4, 207.2)));
    if (T > 221) ap = mixP({ ...REACH, ra: 1.1, re: .7, ht: .3 }, { ...CAST_P, la: 1.1, le: .7 }, eio(rg(T, 221, 221.6)));
    if (T > 228) ap = mixP(ap, POSE.stand, eio(rg(T, 228, 229.5)));
    const AF = M('anami', ap, T, { wind: .6, wand: T > 221 && T < 228, thread: true });
    const ax = 200; dm('anami', AF, ax, 330, 2.55, afl, T, { green: 1, light: [{ x: 200, y: -200, c: '220,226,236', r: 400, a: .4 }] });
    const h = figPt(AF.W1, ax, 330, 2.55, afl);
    if (!held && T > 202.4) { L(1); mode('source-over'); dS(B.bletter, lx, ly - 4, .08, 1.2 * rg(T, 202.4, 203.4), 1); mode('multiply'); }
    const burn = rg(T, 222, 225.5);
    if (held && burn < 1) { L(1); mode('source-over'); ctx.save(); ctx.translate(h[0] + 4, h[1] - 6); ctx.rotate(-.3); ctx.beginPath(); ctx.rect(-40, -30 + burn * 60, 80, 60); ctx.clip(); dS(B.bletter, 0, 0, .1, 0, 1); ctx.restore(); mode('multiply'); }
    if (burn > 0 && burn < 1) { L(1); for (let i = 0; i < 3; i++) { const sc = .35 * (.9 + .2 * N2(T * 4, i)); mode('source-over'); ctx.globalAlpha = SA * .9; ctx.drawImage(B.flames[i], h[0] - 18 + i * 12 - 32 * sc, h[1] + 6 - 128 * sc, 64 * sc, 128 * sc); } ctx.globalAlpha = 1; mode('multiply'); glowAt(h[0], h[1] - 10, 160, '255,150,70', .6); if (dt > 0 && R() < dt * 30) sparks(h[0], h[1] - 20, 3, 'orange', 120, 80); }
    if (AF.tip && T > 221.4 && T < 222.4) { const tp = figPt(AF.tip, ax, 330, 2.55, afl); beam(tp[0], tp[1], h[0], h[1], rg(T, 221.4, 221.7), 'red', 1 - rg(T, 222, 222.4), T, 3, 2); }
    sparksDraw(dt, T);
    if (ins > 0) { insertBg(ins * .93, '34,30,34'); L0(); glowAt(-300, -200, 700, '220,226,236', .2 * ins); mode('source-over'); dS(B.bletter, 0, 0, 1.25 + .03 * rg(T, 207, 220), -.03 + .01 * Math.sin(T), ins); mode('multiply'); }
  }
});

/* ===================== II · DEL MISMO LADO (232–286) ===================== */
scene(232, 286, 4, .5, {
  tin: 'sweep',
  enter() { SPK.clear(); },
  draw(T, dt) {
    const push = eio(rg(T, 270, 276));
    CAM = { z: lerp(1.08, 1.6, push), x: lerp(lerp(40, 80, rg(T, 232, 270)), -260, push), y: lerp(80, 150, push) };
    L(.05); dS(B.dusk); L(.05); glowAt(-SW * .3, 120, 900, '255,186,140', .3);
    L(1); dS(B.snowC);
    const jx = -260, ax = -60, cx = 420;
    let jp = DUEL, ap = DUEL, cp = DUEL, sJ = 0, sA = 0, big = 0, jW = true, aW = true, cW = true, jfl = false;
    if (T > 235.6 && T < 238.4) { jp = BLOCK; sJ = fade(T, 235.8, 238.4, .2, .4); }
    if (T > 239.6 && T < 242.4) { ap = BLOCK; sA = fade(T, 239.8, 242.4, .2, .4); }
    if (T > 244.6 && T < 249.4) { jp = BLOCK; ap = BLOCK; big = fade(T, 244.8, 249.4, .3, .6); }
    if (T > 250) { jp = mixP(DUEL, POSE.stand, eio(rg(T, 250, 251.5))); ap = jp; cp = mixP(DUEL, POSE.stand, eio(rg(T, 250, 251.5))); jW = aW = cW = T < 251; }
    if (T > 252) jfl = false;
    if (T > 258.6) ap = mixP(POSE.stand, { ...POSE.stand, ht: -.1 }, 1);
    let ax2 = ax, cx2 = cx, afl = false, cfl = true;
    if (T > 266) { ax2 = lerp(ax, SW * .7, rg(T, 266, 276)); cx2 = lerp(cx, SW * .7 + 120, rg(T, 266.4, 276)); ap = walkW(ax2); cp = walkW(cx2); afl = cfl = false; }
    if (T > 270.5) { jW = true; jp = mixP(POSE.stand, { ...REACH, ra: 1.3, re: .9, ht: .45, lean: .1 }, eio(rg(T, 270.5, 272))); }
    const JF = M('joy', jp, T, { wand: jW, wind: .4 }), AF = M('anami', ap, T, { wand: aW, thread: aW, wind: .4 }), CF = M('draco', cp, T, { wand: cW, wind: .4 });
    const jt = JF.tip ? figPt(JF.tip, jx, 330, 2.5, jfl) : null, at = AF.tip ? figPt(AF.tip, ax2, 330, 2.55, afl) : null, ct = CF.tip ? figPt(CF.tip, cx2, 330, 2.45, cfl) : null;
    const lt = [{ x: -SW * .3, y: 120, c: '255,186,140', r: 500, a: .4 }];
    const B1 = (t0, to, kind) => { if (ct && to && T > t0 && T < t0 + .7) { const p = rg(T, t0, t0 + .25); beam(ct[0], ct[1], to[0], to[1], p, kind, 1 - rg(T, t0 + .4, t0 + .7), T, 3.5, t0); lights(lt, ct, to, p, kind); } };
    if (jt) B1(236.2, [jt[0] + 28, jt[1]], 'sg'); if (at) B1(240.2, [at[0] + 28, at[1]], 'sg');
    if (at && T > 245.2 && T < 249) { const p = rg(T, 245.2, 245.5); beam(ct[0], ct[1], at[0] + 70, at[1] - 10, p, 'violet', 1 - rg(T, 248.4, 249), T, 6, 5); }
    if (jt && sJ > 0) shield(jt[0] + 26, jt[1], 66, 'gold', sJ, T, T > 236.45 ? 1 - rg(T, 236.45, 237.2) : 0, 1);
    if (at && sA > 0) shield(at[0] + 26, at[1], 66, 'red', sA, T, T > 240.45 ? 1 - rg(T, 240.45, 241.2) : 0, 1);
    if (at && jt && big > 0) { const mx = (at[0] + jt[0]) / 2 + 80, my = (at[1] + jt[1]) / 2; shield(mx, my, 150, 'gold', big, T, T > 245.5 ? .4 + .3 * Math.sin(T * 9) : 0, 1); shield(mx + 8, my, 140, 'red', big * .7, T, 0, 1); lt.push({ x: mx, y: my, c: '240,160,90', r: 400, a: big }); if (dt > 0 && R() < dt * 30 && T > 245.5) sparks(mx + 60, my, 4, pick(['gold', 'red', 'violet']), 200, 40); }
    dm('draco', CF, cx2, 330, 2.45, cfl, T, { light: lt, glow: .9, a: 1 - sm(rg(T, 274, 277)) });
    dm('anami', AF, ax2, 330, 2.55, afl, T, { light: lt, green: 1, a: 1 - sm(rg(T, 274, 277)) });
    dm('joy', JF, jx, 330, 2.5, jfl, T, { light: lt });
    if (JF.tip && T > 271) { const tp = figPt(JF.tip, jx, 330, 2.5, jfl); orb(tp[0], tp[1], 3, 'gold', .6 + .2 * Math.sin(T * 3), T); }
    snowDraw(T, dt, .4, 3); sparksDraw(dt, T);
  }
});
function lights(lt, a, b, p, kind) { lt.push({ x: lerp(a[0], b[0], p), y: lerp(a[1], b[1], p), c: SPELL[kind][0], r: 240, a: 1 }); }

/* ===================== II · LA VÍSPERA, EN LA TORRE (284–332) ===================== */
scene(284, 332, 4, .5, {
  tin: 'bleed',
  draw(T, dt) {
    const close = eio(rg(T, 294, 299));
    CAM = { z: lerp(1.15, 1.5, close), x: lerp(-60, -20, close), y: lerp(40, 130, close) };
    const mX = -420, mY = -250;
    L(.05); dS(B.night); starsDraw(B.stars, T, .9); L(.06); moonPhase(mX, mY, 1, .84, 1);
    mtnDraw(0, .15, .6); mtnDraw(1, .28, .55); mistDraw(T, 0, 160, .3, .3, 5);
    L(.45); dS(B.castle.sp, 420, 185, .5, 0, .55); winGlow(B.castle.wins, T, .6, 420, 185, .5);
    L(1); dS(B.parapet);
    const ax = -110, cx = 70;
    let afl = T < 296, cfl = true, ap = POSE.stand, cp = POSE.stand;
    if (T > 291.5) cp = mixP(POSE.stand, { ...POSE.stand, ht: .3 }, eio(rg(T, 291.5, 292.5)));
    if (T > 298.6) cp = mixP(POSE.stand, { ...POSE.stand, ht: -.05 }, 1);
    if (T > 308.6) { ap = mixP(POSE.stand, { ...REACH, ra: .7, re: .2 }, eio(rg(T, 308.6, 310))); cp = mixP(cp, { ...REACH, ra: .7, re: .2 }, eio(rg(T, 309, 310.4))); }
    if (T > 316) { afl = true; cfl = true; }
    const lt = [{ x: mX + 300, y: mY, c: '200,210,236', r: 500, a: .6 }];
    const AF = M('anami', ap, T, { wind: .6 }), CF = M('draco', cp, T, { wind: .6 });
    dm('anami', AF, ax, 330, 2.55, afl, T, { light: lt, green: 1 });
    dm('draco', CF, cx, 330, 2.45, cfl, T, { light: lt, glow: .9 });
    const AW = wr(AF, ax, 330, 2.55, afl), CW = wr(CF, cx, 330, 2.45, cfl);
    L(1); wristRing(AW, T, .7, 6); wristRing(CW, T, .55, 5); hilo(AW, CW, T, .45, { sag: 40, w: 1.2 });
    if (T > 310) { const h = figPt(AF.W2, ax, 330, 2.55, afl); glowAt(h[0] + 20, h[1], 120, '255,214,160', .25 * sm(rg(T, 310, 312))); }
  }
});
