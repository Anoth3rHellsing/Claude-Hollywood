/* ===================== II · LA CARTA BAJO LA NIEVE (144–204) ===================== */
scene(144, 206, 3, .5, {
  enter() { SPK.clear(); },
  draw(T, dt) {
    const conf = eio(rg(T, 154, 158)) * (1 - eio(rg(T, 196, 200)));
    CAM = { z: lerp(1.08 + .04 * rg(T, 144, 154), 1.34, conf), x: lerp(lerp(160, 40, rg(T, 144, 154)), -30, conf), y: lerp(70, 115, conf) };
    nightBack(T, -260, -320, .9);
    L(1); dS(B.snowC);
    for (let x = -1080; x <= 1080; x += 360) glowAt(x, -200, 170, '255,196,110', .32 + .04 * N2(T * 2, x));
    // Anami y Draconida llegan del brazo
    let ax = lerp(SW * .7, 220, eo(rg(T, 145.5, 152.2))), ap = T < 152.2 ? walkW(ax) : POSE.stand, afl = true;
    let cx = ax + 110, cp = T < 152.2 ? walkW(cx + 20) : POSE.stand, cfl = true, cWand = false;
    if (T > 152.2) cx = 330;
    // Joy espera con la carta
    let jx = -300, jp = POSE.stand, jfl = false; const G0 = 172.8;
    if (T > 153) { jx = lerp(-300, -80, eio(rg(T, 153, 156))); jp = T < 156 ? walkW(jx) : mixP(POSE.stand, REACH, eio(rg(T, 156, 157))); }
    if (T > 168.6) jp = mixP(REACH, POSE.stand, eio(rg(T, 168.6, 169.6)));
    // él pasa de largo; ella le toma la muñeca → el hilo estalla
    if (T > 170.3) { ax = lerp(220, -150, eio(rg(T, 170.3, G0))) - 120 * eo(rg(T, G0, G0 + 1.2)); ap = T < G0 ? walkW(ax) : mixP(FLINCH, CLUTCH, eio(rg(T, G0 + 1, G0 + 2.5))); if (T < G0 + 1 && T > G0) ap = mixP(walkW(ax), FLINCH, eio(rg(T, G0, G0 + .3))); }
    if (T > G0) jx = -80 + 90 * eo(rg(T, G0, G0 + 1.2));
    if (T > 171.4) { jfl = true; jp = T < G0 ? mixP(POSE.stand, { ...REACH, ra: 1.25 }, eio(rg(T, 171.6, G0))) : mixP({ ...REACH, ra: 1.25 }, FLINCH, eio(rg(T, G0 + .05, G0 + .4))); }
    if (T > G0 + 1.6) jp = mixP(FLINCH, POSE.stand, eio(rg(T, G0 + 1.6, G0 + 3.5)));
    if (T > 178.5) { ap = mixP(CLUTCH, POSE.stand, eio(rg(T, 186, 188))); afl = false; }
    // Draconida se interpone y examina los hilos
    if (T > 178.8) { cx = lerp(330, -125, eio(rg(T, 178.8, 182))); cp = T < 182 ? walkW(cx) : mixP(POSE.stand, { ...RAISE, ra: 1.9 }, eio(rg(T, 182.3, 183.4))); cWand = T > 182.6 && T < 196; }
    if (T > 189) cp = mixP({ ...RAISE, ra: 1.9 }, POSE.stand, eio(rg(T, 189, 190.5)));
    if (T > 197) { cx = lerp(-125, SW * .75, rg(T, 197, 206)); cp = walkW(cx); cfl = false; }
    if (T > 198.2) { ax = lerp(-270, SW * .75, rg(T, 198.2, 207)); ap = walkW(ax); afl = false; }
    if (T > 199.6) { jx = lerp(10, SW * .7, rg(T, 199.6, 209)); jp = walkW(jx); jfl = false; }
    const AF = M('anami', ap, T, { wind: .5 }), JF = M('joy', jp, T, { wind: .5 }), CF = M('draco', cp, T, { wind: .5, wand: cWand, wandA: cWand ? -.35 : undefined });
    const flare = fade(T, G0, G0 + 6, .05, 3), lamp = [{ x: -360, y: -200, c: '255,196,110', r: 400, a: .35 }];
    if (flare > 0) lamp.push({ x: -110, y: 230, c: '230,50,56', r: 300, a: flare });
    let ctip = null;
    if (CF.tip) { ctip = figPt(CF.tip, cx, 330, 2.45, cfl); const la = fade(T, 182.6, 196, .3, .6); orb(ctip[0], ctip[1], 4, 'sg', la, T); lamp.push({ x: ctip[0], y: ctip[1], c: '150,236,180', r: 260, a: la }); }
    dm('draco', CF, cx, 330, 2.45, cfl, T, { light: lamp, glow: .85 });
    dm('anami', AF, ax, 330, 2.6, afl, T, { light: lamp });
    dm('joy', JF, jx, 330, 2.5, jfl, T, { light: lamp });
    const JW = wr(JF, jx, 330, 2.5, jfl), AW = wr(AF, ax, 330, 2.6, afl);
    if (T > 153 && T < 199.6) letterAt(figPt(JF.W2, jx, 330, 2.5, jfl), 1, .09, jfl ? .3 : -.3);
    L(1);
    const hk = .35 + .65 * flare + .25 * fade(T, 182.6, 196, .5, 1);
    if (T > G0 - .05) { hilo(JW, AW, T, hk, { sag: 20 + 20 * (1 - flare), w: 1.4 + flare * 1.6 }); const rr = eo(rg(T, G0, G0 + 1.2)); for (const W of [JW, AW]) hilo(W, [lerp(W[0], -SW * .75, rr), lerp(W[1], -520, rr)], T, hk * .8, { sag: 90, w: 1.2, ph: W[0], gap: [26, 10] }); }
    wristRing(JW, T, .4 + .6 * flare, 6); wristRing(AW, T, .4 + .6 * flare, 6);
    if (Math.abs(T - G0) < .045 && dt > 0) { sparks((JW[0] + AW[0]) / 2, (JW[1] + AW[1]) / 2, 50, 'red', 300, 40); SHK = 9; }
    if (T > G0 && T < G0 + .7) { FLASH = Math.max(FLASH, .4 * (1 - rg(T, G0, G0 + .7))); FLASHC = '255,170,170'; }
    snowDraw(T, dt, .9);
    sparksDraw(dt, T);
  }
});

/* ===================== II · MANSIÓN MALFOY: PACTUM SANGUINIS (202–258) ===================== */
scene(202, 260, 4, .5, {
  tin: 'down',
  enter() { DUST.clear(); SPK.clear(); },
  draw(T, dt) {
    CAM = { z: 1.12 + .06 * rg(T, 202, 258), x: lerp(-40, 80, rg(T, 202, 258)), y: 80 };
    nightBack(T, -600, -280, .9);
    L(1); dS(B.manor);
    // luz de luna por las ventanas
    mode('source-over'); for (const wx of [-780, -470]) { ctx.fillStyle = `rgba(190,210,220,${.07 * SA})`; ctx.beginPath(); ctx.moveTo(wx - 90, -300); ctx.lineTo(wx + 90, -300); ctx.lineTo(wx + 330, 560); ctx.lineTo(wx + 60, 560); ctx.fill(); } mode('multiply');
    L(1); dS(B.fire, 40, 10);
    const fl = .85 + .15 * N2(T * 4, 1);
    for (let i = 0; i < 5; i++) { const sc = (1.5 - Math.abs(i - 2) * .25) * (.9 + .2 * N2(T * 3, i)), sy = 1 + .3 * N2(T * 5, i * 4); mode('source-over'); ctx.globalAlpha = SA * .85; ctx.drawImage(B.gflames[i % 3], -40 + i * 40 - 32 * sc, 332 - 128 * sc * sy, 64 * sc, 128 * sc * sy); }
    ctx.globalAlpha = 1; mode('multiply'); glowAt(40, 270, 560, '70,220,130', .3 * fl); glowAt(40, 290, 150, '200,255,220', .45 * fl);
    const lt = [{ x: 40, y: 250, c: '90,230,150', r: 520, a: .8 * fl }];
    // Draconida baja el libro de la estantería
    let cx = 150, cp = POSE.stand, cfl = false, book = 0;
    if (T < 206.5) { cx = lerp(150, 520, eio(rg(T, 202.6, 206.5))); cp = walkW(cx); }
    else if (T < 208.6) { cx = 520; cp = mixP(POSE.stand, { ...RAISE, ra: 2.7 }, Math.sin(rg(T, 206.5, 208.6) * PI)); book = T > 207.6 ? 1 : 0; }
    else if (T < 211.6) { cx = lerp(520, 60, eio(rg(T, 208.6, 211.6))); cp = walkW(cx); cfl = true; book = 1; }
    else { cx = 60; cp = mixP(POSE.stand, { ...REACH, ra: 1.1, re: .5, lean: .25, ht: .4 }, eio(rg(T, 211.6, 212.6)) * (1 - eio(rg(T, 236, 237.5)) * .5)); cfl = true; book = 2; }
    const CF = M('draco', cp, T, { wind: .1 });
    dm('draco', CF, cx, 330, 2.45, cfl, T, { light: lt, glow: .9 });
    if (book === 1) { const h = figPt(CF.W2, cx, 330, 2.45, cfl); L(1); ctx.fillStyle = `rgba(40,30,26,${SA})`; ctx.fillRect(h[0] - 18, h[1] - 6, 36, 12); }
    // la mesa (delante de Draconida) con dos velas y el libro
    L(1); dS(B.mtable); candle(-230, 176, T, 1, 30); candle(270, 176, T, 1, 30);
    if (book === 2) { const op = eio(rg(T, 213.2, 214.2)) * (1 - eio(rg(T, 235.4, 236))); ctx.fillStyle = `rgba(40,30,26,${SA})`; ctx.fillRect(40 - 22 - op * 22, 192, 44 + op * 44, 9 - op * 3); if (op > 0) { mode('source-over'); ctx.fillStyle = `rgba(236,224,196,${op * SA})`; ctx.fillRect(40 - 40 * op, 189, 80 * op, 4); mode('multiply'); glowAt(40, 186, 60, '255,214,160', .3 * op); } }
    if (Math.abs(T - 213.4) < .05 && dt > 0) for (let i = 0; i < 6; i++) DUST.spawn(40 + rnd(-30, 30), 186, rnd(-30, 30), rnd(-40, -10));
    // Joy junto a la ventana; Anami contra las estanterías, de brazos cruzados
    let jx = -560, jp = POSE.stand; if (T > 244) { jx = lerp(-560, -390, eio(rg(T, 244, 246.4))); jp = T < 246.4 ? walkW(jx) : mixP(POSE.stand, { ...REACH, ra: .9 }, Math.sin(rg(T, 246.6, 249.5) * PI) * .8); }
    let ax = 380, ap = ARMS, afl = true; if (T > 236.5) { ap = mixP(ARMS, POSE.stand, eio(rg(T, 236.5, 237.6))); afl = T < 238.4; }
    if (T > 245.6) { ax = lerp(380, SW * .7, rg(T, 245.6, 254)); ap = walkW(ax); afl = false; }
    const lj = [{ x: -620, y: -200, c: '190,210,220', r: 340, a: .6 }];
    dm('joy', M('joy', jp, T, { wind: .1 }), jx, 330, 2.5, false, T, { light: lj, glow: .8 });
    const AF = M('anami', ap, T, { wind: .1 });
    dm('anami', AF, ax, 330, 2.6, afl, T, { light: lt });
    debrisDraw(dt, T);
    // inserto: el libro de pactos de sangre
    const ia = fade(T, 215, 233.4, .8, .8);
    if (ia > 0) {
      insertBg(ia * .94, '30,24,22'); L0(); glowAt(-200, -120, 700, '255,200,130', .3 * ia); glowAt(400, 300, 600, '80,220,130', .14 * ia);
      const zs = .92 + .05 * rg(T, 215, 233.4); ctx.save(); ctx.scale(zs, zs); ctx.rotate(-.02); mode('source-over'); dS(B.tome.sp, 0, 0, 1, 0, ia); mode('multiply'); glowAt(-250, 40, 260, '200,40,50', .1 * ia * sm(rg(T, 216, 218)));
      // el triángulo del diagrama late
      const V = B.tome.V; for (let e = 0; e < 3; e++) hilo(V[e], V[(e + 1) % 3], T, ia * .55 * sm(rg(T, 216, 218)), { sag: 0, w: 1.2, ph: e });
      const rev = (s, t0, dur, sc = .8) => { const p = rg(T, t0, t0 + dur); if (p <= 0) return; ctx.save(); ctx.beginPath(); ctx.rect(s.x - 10, s.y - 40, s.w * sc * p + 10, 80); ctx.clip(); ctx.globalAlpha = ia * SA; ctx.drawImage(s.c, s.x, s.y - s.c.height * .5 * sc, s.c.width * sc, s.c.height * sc); ctx.restore(); };
      B.tome.lines.forEach((s, i) => rev(s, 216.4 + i * 2.6, 2.1, .9));
      ctx.save(); ctx.rotate(-.06); ctx.translate(10, 40); B.tome.note.forEach((s, i) => rev(s, 228.6 + i * 1.6, 1.4, .85)); ctx.restore();
      ctx.restore(); ctx.globalAlpha = 1;
    }
  }
});

/* ===================== II · LA FUGA (256–302) ===================== */
scene(256, 304, 4, .5, {
  tin: 'sweep',
  enter() { SPK.clear(); DEB.clear(); DUST.clear(); },
  draw(T, dt) {
    const D0 = lerp(-560, 60, rg(T, 256.6, 266.2)), push = eio(rg(T, 275, 282)) * (1 - eio(rg(T, 293.6, 297)));
    CAM = { z: lerp(1.02, 1.5, push), x: lerp(lerp(-460, 60, eio(rg(T, 256, 266.5))), 60, push), y: lerp(80, 150, push) };
    L(1); dS(B.min.sp); for (const l of B.min.lamps) hangLamp(l.x, l.y, T);
    const lt = B.min.lamps.map(l => ({ x: l.x, y: l.y, c: '255,206,130', r: 300, a: .5 }));
    // Damien esposado entre dos aurores
    let dx = D0, dp = CUFF, dfl = false, dWand = false, dsx = 1, da = 1;
    if (T < 266.2) dp = mixP(walkW(dx), CUFF, .7);
    else if (T < 267) dp = mixP(CUFF, { ...KNEEL2, hy: 38, lean: .55 }, Math.sin(rg(T, 266.2, 267) * PI) * .8);
    else if (T < 271) { dfl = T < 268.5; dWand = T > 267.15; dp = T < 267.5 ? POSE.stand : mixP(DUEL, LUNGE, Math.sin(rg(T, 267.5, 268) * PI) + Math.sin(rg(T, 269.6, 270.1) * PI)); if (T > 268.5 && T < 269.4) dp = BLOCK; }
    else { dWand = true; dp = mixP(DUEL, { ...POSE.stand, la: 1.7, le: 1.6, ht: .35, lean: .1 }, eio(rg(T, 272, 273.5)) * (1 - eio(rg(T, 284, 285.5)))); if (T > 285.5) dp = mixP(POSE.stand, { ...POSE.stand, ht: -.35, lean: -.08 }, eio(rg(T, 286, 287.5))); }
    if (T > 291.3) { const k = rg(T, 291.3, 293.5); dsx = 1 - eio(rg(T, 292, 293.1)) * .9; da = 1 - sm(rg(T, 292.5, 293.2)); dp = mixP(dp, { ...POSE.stand, la: .6, ra: .6 }, eio(k)); }
    const DF = M('damien', dp, T, { wand: dWand, wind: .3 + (T > 291.3 && T < 293.5 ? 1.5 : 0) });
    const dtip = DF.tip ? figPt(DF.tip, dx, 330, 2.55, dfl) : null;
    // auror de detrás: intenta sujetarlo, pierde la varita, sale despedido
    let bx = D0 - 180, bp = walkW(bx), bfl = false, brot = 0, by = 330, bWand = false;
    if (T > 266.2) { bx = lerp(D0 - 180, D0 - 95, eio(rg(T, 266.3, 266.9))); bp = mixP(walkW(bx), REACH, eio(rg(T, 266.4, 266.9))); bWand = T < 267.15; }
    if (T > 267.7) { const f = rg(T, 267.7, 268.6); bx = lerp(D0 - 95, D0 - 470, eo(f)); by = 330 - Math.sin(f * PI) * 90; bp = POSE.leap; brot = -f * 1.3; if (T > 268.6) { bx = D0 - 470; by = 340; bp = POSE.lie; brot = -PI / 2; } }
    // auror de delante: se gira, ataca, cae
    let fx = D0 + 200, fp = walkW(fx), ffl = false, frot = 0, fy = 330, fWand = T > 268.1;
    if (T > 267.9) { ffl = true; fp = mixP(POSE.stand, DUEL, eio(rg(T, 267.9, 268.4))); if (T > 268.6 && T < 269.2) fp = mixP(DUEL, LUNGE, Math.sin(rg(T, 268.6, 269.1) * PI)); }
    if (T > 269.8) { fWand = false; const f = rg(T, 269.8, 270.6); fx = lerp(D0 + 200, D0 + 540, eo(f)); fy = 330 - Math.sin(f * PI) * 80; fp = POSE.leap; frot = f * 1.3; if (T > 270.6) { fx = D0 + 540; fy = 340; fp = POSE.lie; frot = PI / 2; } }
    const lights = lt.slice();
    const AF1 = mage(bp, { sex: 'm', hair: 'short', t: T, wind: .2, wand: bWand }), AF2 = mage(fp, { sex: 'm', hair: 'short', t: T, wind: .2, wand: fWand });
    const ftip = AF2.tip ? figPt(AF2.tip, fx, fy, 2.5, ffl, frot) : null;
    const B1 = (t0, dur, from, to, kind) => { if (from && T > t0 && T < t0 + dur + .3) { const p = rg(T, t0, t0 + dur); beam(from[0], from[1], to[0], to[1], p, kind, 1 - rg(T, t0 + dur, t0 + dur + .3), T, 4.5, t0); lights.push({ x: lerp(from[0], to[0], p), y: lerp(from[1], to[1], p), c: SPELL[kind][0], r: 260, a: 1 - rg(T, t0 + dur, t0 + dur + .3) }); } };
    const hitAt = (t, x, y, kind, n = 1, sh = 6) => { if (Math.abs(T - t) < .045 && dt > 0) { impact(x, y, kind, n); SHK = Math.max(SHK, sh); } };
    B1(267.5, .18, dtip, [D0 - 95, 220], 'red'); hitAt(267.68, D0 - 95, 220, 'red', .7, 7);
    B1(268.65, .2, ftip, dtip ? [dtip[0] + 16, dtip[1]] : [0, 0], 'blue');
    if (dtip && T > 268.5 && T < 269.5) shield(dtip[0] + 16, dtip[1], 64, 'blue', fade(T, 268.5, 269.5, .12, .35), T, T > 268.85 ? 1 - rg(T, 268.85, 269.4) : 0, 1);
    B1(269.6, .18, dtip, [D0 + 200, 220], 'red'); hitAt(269.78, D0 + 200, 220, 'red', .7, 7);
    if (Math.abs(T - 267.05) < .05 && dt > 0) { const h = figPt(DF.W1, dx, 330, 2.55, dfl); sparks(h[0], h[1], 26, 'silver', 220); }
    if (T > 270.6) hitAt(270.6, D0 + 540, 330, 'blue', .4, 4); if (T > 268.6) hitAt(268.6, D0 - 470, 330, 'blue', .4, 4);
    L(1); drawMage(AF1, bx, by, 2.5, bfl, { rot: brot, noGlow: 1, light: lights, after: G => { ctx.fillStyle = 'rgba(16,14,18,.95)'; ctx.fillRect(G.Hd[0] - 7, G.Hd[1] - 14, 14, 12); ctx.fillRect(G.Hd[0] - 11, G.Hd[1] - 4, 22, 3); } });
    L(1); drawMage(AF2, fx, fy, 2.5, ffl, { rot: frot, noGlow: 1, light: lights, after: G => { ctx.fillStyle = 'rgba(16,14,18,.95)'; ctx.fillRect(G.Hd[0] - 7, G.Hd[1] - 14, 14, 12); ctx.fillRect(G.Hd[0] - 11, G.Hd[1] - 4, 22, 3); } });
    // Damien (con el remolino de la desaparición)
    appar(dx, 330, rg(T, 291.3, 293.6), 1, 3);
    if (da > 0) { L(1); ctx.translate(dx, 0); ctx.scale(dsx, 1); ctx.translate(-dx, 0); drawMage(DF, dx, 330, 2.55, dfl, { house: 'R', t: T, glow: .45, ignite: .5, light: lights, a: da }); }
    L(1); wristRing(wr(DF, dx, 330, 2.55, dfl), T, (.35 + .45 * fade(T, 272.5, 285, .8, 1)) * da, 6);
    if (dtip && T > 271 && T < 291.5) orb(dtip[0], dtip[1], 2.5, 'blue', .5, T);
    debrisDraw(dt, T); sparksDraw(dt, T);
  }
});

/* ===================== II · LA ORILLA AL AMANECER (300–340) ===================== */
scene(300, 342, 4, .5, {
  tin: 'bleed',
  draw(T, dt) {
    const RX = SW * .3;
    CAM = { z: 1.3 + .06 * rg(T, 300, 340), x: lerp(RX - 220, RX - 40, eio(rg(T, 300, 318))), y: 150 };
    L(.05); dS(B.dusk); L(.05); glowAt(-SW * .1, 160, 900, '255,186,140', .3 + .15 * rg(T, 300, 340));
    mtnDraw(0, .15, .7); mtnDraw(1, .28, .6); mistDraw(T, 0, 120, .3, .3, 6);
    L(.5); dS(B.lake, 0, 0, 1, 0, .8);
    const cy = -70, cs = .85, wy = 205;
    ctx.save(); ctx.beginPath(); ctx.rect(-SW, wy, SW * 2, 400); ctx.clip();
    for (let i = 0; i < 9; i++) { const y0 = wy + i * 28; ctx.save(); ctx.beginPath(); ctx.rect(-SW, y0, SW * 2, 29); ctx.clip(); ctx.translate(Math.sin(T * 1.2 + i * .9) * (2 + i * .6), 2 * wy); ctx.scale(1, -1); dS(B.castle.sp, 0, cy, cs, 0, .2 - i * .013); ctx.restore(); }
    ctx.restore();
    L(.5); dS(B.castle.sp, 0, cy, cs); winGlow(B.castle.wins, T, .35, 0, cy, cs);
    mistDraw(T, 1, 200, .55, .45, 10); mistDraw(T, 2, 150, .5, .3, -7);
    L(1); dS(B.shore);
    L(1); ctx.fillStyle = `rgba(16,16,22,${.92 * SA})`; ctx.beginPath(); ctx.ellipse(RX + 20, 432, 150, 30, 0, PI, TAU); ctx.fill();
    const sun = [{ x: RX - 600, y: 150, c: '255,190,140', r: 500, a: .4 + .3 * rg(T, 300, 340) }];
    // Anami sentado en la roca; ella llega y se sienta a su lado
    let ap = { ...SIT, lean: .32, ht: .35, la: 1.1, le: 1.3, ra: 1.0, re: 1.4 }, afl = true, ax = RX - 20, ay = 412;
    if (T > 329.3) { afl = false; ap = { ...SIT, lean: .15, ht: 0 }; }
    if (T > 331.6) { ap = mixP({ ...SIT, lean: .15, ht: 0 }, POSE.stand, eio(rg(T, 331.6, 332.8))); ay = lerp(412, 432, eio(rg(T, 331.6, 332.8))); }
    if (T > 333) ap = mixP(POSE.stand, { ...REACH, ra: 1.1, re: .2 }, eio(rg(T, 333, 334.2)));
    let cx = lerp(RX + 620, RX + 80, eo(rg(T, 308.8, 315.6))), cp = T < 315.6 ? walkW(cx) : mixP(POSE.stand, SIT, eio(rg(T, 315.6, 316.8))), cy2 = T < 315.6 ? 432 : lerp(432, 412, eio(rg(T, 315.6, 316.8))), ck = sm(rg(T, 308.8, 310));
    if (T > 334.4) { cp = mixP(SIT, { ...REACH, ra: 1.0, re: .2 }, eio(rg(T, 334.4, 335.8))); cy2 = lerp(412, 432, eio(rg(T, 334.4, 335.8))); }
    if (T > 336.5) cp = mixP({ ...REACH, ra: 1.0, re: .2 }, POSE.stand, eio(rg(T, 336.5, 337.5)));
    dm('anami', M('anami', ap, T, { wind: .4 }), ax, ay, 2.45, afl, T, { light: sun });
    dm('draco', M('draco', cp, T, { wind: .45 }), cx, cy2, 2.35, true, T, { a: ck, light: sun, glow: .85 });
  }
});
