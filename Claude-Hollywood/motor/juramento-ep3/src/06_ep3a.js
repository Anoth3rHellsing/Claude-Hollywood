/* =====================================================================
   GUION — «EL JURAMENTO ROTO · EPISODIO III · LA ÚLTIMA LUNA» (≈ 10 min)
   Prólogo · I La primera luna · II La segunda luna · III La última luna · Epílogo
   ===================================================================== */

/* ===================== PRÓLOGO (0–30) ===================== */
const P3 = [[-160, -300], [160, -300], [0, -180]]; // Damien, Anami, Joy
scene(0, 30, .01, .5, {
  draw(T) {
    CAM = { z: 1, x: 0, y: 0 }; L0();
    if (T > 1 && T < 2.42) { const f = ei(rg(T, 1, 2.4)), y = lerp(-620, -4, f); ctx.fillStyle = `rgba(${INK},.92)`; ctx.beginPath(); ctx.ellipse(0, y, 4.5, 6 + f * 12, 0, 0, TAU); ctx.fill(); }
    const ba = (1 - sm(rg(T, 4.5, 8)) * .85) * (1 - sm(rg(T, 11, 15)));
    if (T > 2.4) dS(B.bloom.sp, 0, 0, 1 + .2 * eo(rg(T, 2.4, 10)), 0, ba * .85, B.bloom.bl.get(eo(rg(T, 2.4, 7.5))));
    // las tres gotas y los dos hilos que quedaron
    const da = sm(rg(T, 3.2, 4.4)) * (1 - sm(rg(T, 12.5, 15)));
    if (da > 0) {
      mode('source-over');
      dS(B.drops[0].sp, P3[0][0], P3[0][1], .85, 0, da, B.drops[0].bl.get(eo(rg(T, 3.2, 4.4))));
      dS(B.green.sp, P3[1][0], P3[1][1], .85, 1, da, B.green.bl.get(eo(rg(T, 3.6, 4.8))));
      dS(B.drops[2].sp, P3[2][0], P3[2][1], .85, 2, da, B.drops[2].bl.get(eo(rg(T, 4, 5.2))));
      mode('multiply');
      const k = sm(rg(T, 4.6, 6)) * da;
      hilo(P3[0], P3[2], T, .8 * k, { sag: 24, w: 1.5 }); hilo(P3[0], P3[1], T, .8 * k, { sag: -30, w: 1.5, ph: 1 });
      vein(P3[0], P3[2], T, k * sm(rg(T, 6.5, 8)), { sag: 24, speed: .35 }); vein(P3[1], P3[0], T, k * sm(rg(T, 7, 8.5)), { sag: -30, ph: .5, speed: .35 });
      mode('source-over'); for (let i = 0; i < 12; i++) { const f = (i + .5) / 12, q = [lerp(P3[2][0], P3[1][0], f), lerp(P3[2][1], P3[1][1], f) - ((T * 8 + i * 7) % 40) * .5]; ctx.fillStyle = `rgba(236,180,80,${k * .45 * (.5 + .5 * Math.sin(T * 3 + i)) * SA})`; ctx.beginPath(); ctx.arc(q[0], q[1], 2, 0, TAU); ctx.fill(); } mode('multiply');
    }
    // tres lunas: creciente, media, llena
    const ma = 1 - sm(rg(T, 26, 29.5));
    [[-320, .62, 12.5], [0, .32, 14], [320, 1, 15.5]].forEach(([x, ph, t0]) => { const a = sm(rg(T, t0, t0 + 1.6)) * ma; if (a <= 0) return; L0(); moonPhase(x, -230, .7, ph, a); if (ph === 1) glowAt(x, -230, 160, '90,240,130', .18 * a * sm(rg(T, 17, 19))); });
  }
});

/* ===================== I · LA SALA COMÚN BAJO EL LAGO (26–64) ===================== */
scene(26, 66, 4, .5, {
  tin: 'bleed',
  draw(T, dt) {
    const k1 = eio(rg(T, 44, 46.5)), k2 = eio(rg(T, 56, 58.5)) * (1 - eio(rg(T, 62, 65)));
    CAM = { z: lerp(lerp(1.12, 1.35, k1), 1.75, k2), x: lerp(lerp(lerp(-160, 120, rg(T, 26, 44)), 320, k1), 250, k2), y: lerp(lerp(60, 120, k1), 190, k2) };
    waterBack(T, 1, .85);
    L(1); dS(B.common.sp);
    for (const l of B.common.lamps) greenLamp(l.x, l.y, T);
    for (let i = 0; i < 3; i++) { const sc = .55 * (.9 + .2 * N2(T * 3, i)); mode('source-over'); ctx.globalAlpha = SA * .85; ctx.drawImage(B.gflames[i], 860 + i * 30 - 32 * sc, 332 - 128 * sc, 64 * sc, 128 * sc); } ctx.globalAlpha = 1; mode('multiply'); glowAt(890, 290, 300, '70,220,130', .35);
    const lt = [{ x: -245, y: -190, c: '120,230,160', r: 360, a: .6 }, { x: 205, y: -210, c: '120,230,160', r: 360, a: .6 }, { x: -20, y: -100, c: '170,230,220', r: 400, a: .4 }];
    // Anami lee en el sofá; el dolor lo dobla
    const pain = fade(T, 44, 66, .4, 3);
    const ap = mixP({ ...SIT, lean: .25, ht: .35, la: 1.1, le: 1.3, ra: 1.0, re: 1.4 }, { ...SIT, lean: .55, ht: .6, la: 1.2, le: 1.7, ra: 1.0, re: 1.9 }, eio(rg(T, 44, 44.6)) * (1 - .5 * eio(rg(T, 54, 57))));
    const AF = M('anami', ap, T, { wind: .1 });
    dm('anami', AF, 430, 330, 2.5, true, T, { light: lt, green: 1 });
    if (T < 44) { L(1); const h = figPt(AF.W2, 430, 330, 2.5, true); ctx.fillStyle = `rgba(30,22,20,${.9 * SA})`; ctx.fillRect(h[0] - 12, h[1] - 9, 14, 9); }
    chestPain(AF, 430, 330, 2.5, true, T, pain);
    L(1); wristRing(wr(AF, 430, 330, 2.5, true), T, .5 + .5 * pain, 6); if (pain > .1) { const W = wr(AF, 430, 330, 2.5, true); glowAt(W[0], W[1], 40, '80,240,120', .5 * pain); }
    // Draconida en la ventana; corre a su lado y se arrodilla
    let cx = 70, cp = POSE.stand, cfl = true;
    if (T > 46.5) { cx = lerp(70, 320, eio(rg(T, 46.5, 49.4))); cp = T < 49.4 ? walkW(cx) : mixP(POSE.stand, KNEEL2, eio(rg(T, 49.4, 50.4))); cfl = false; }
    if (T > 52.5) cp = mixP(KNEEL2, { ...KNEEL2, ra: 1.5, re: .2 }, eio(rg(T, 52.5, 53.5)) * (1 - eio(rg(T, 57.6, 58.4))));
    if (T > 58.2) cp = mixP(KNEEL2, { ...KNEEL2, la: 1.3, le: 1.6, ra: 1.0, re: 1.8 }, eio(rg(T, 58.2, 59)));
    const CF = M('draco', cp, T, { wind: .1 });
    dm('draco', CF, cx, 330, 2.4, cfl, T, { light: lt, glow: .9 });
    // la marca que esconde bajo la manga
    if (T > 55.5 && T < 60) { L(1); wristRing(wr(CF, cx, 330, 2.4, cfl), T, .9 * fade(T, 55.5, 60, .4, .8), 5); }
  }
});

/* ===================== I · JOY, SOLA (62–90) ===================== */
scene(62, 90, 4, .5, {
  tin: 'sweep',
  enter() { SPK.clear(); },
  draw(T, dt) {
    const push = eio(rg(T, 76, 80));
    CAM = { z: lerp(1.35, 1.75, push), x: lerp(-470, -560, push), y: lerp(70, 160, push) };
    L(.3); dS(B.room, 0, 0, 1, 0, 1); L(1); dS(B.door);
    L0(); mode('source-over'); ctx.fillStyle = `rgba(30,36,60,${.12 * SA})`; ctx.fillRect(-SW, -560, SW * 2, 1120); mode('multiply');
    L(1); glowAt(-900, -100, 800, '190,200,236', .24);
    const lit = sm(rg(T, 68.4, 69));
    candle(-470, 96, T, lit);
    // libro abierto sobre la mesa
    if (T > 70) { L(1); const op = eio(rg(T, 70, 71)); ctx.fillStyle = `rgba(40,30,26,${SA})`; ctx.fillRect(-640, 112, 70 + op * 30, 8); mode('source-over'); ctx.fillStyle = `rgba(236,224,196,${op * SA})`; ctx.fillRect(-636, 108, 90 * op, 4); mode('multiply'); }
    let jp = { ...SIT, lean: .3, ht: .3, la: 1.0, le: 1.3, ra: 1.1, re: 1.2 }, jw = false;
    if (T > 64 && T < 67.5) jp = mixP(jp, { ...SIT, lean: .55, ht: .6, la: 1.2, le: 1.7, ra: 1.0, re: 1.9 }, Math.sin(rg(T, 64, 67.5) * PI));
    if (T > 67.6 && T < 69.4) { jw = true; jp = mixP(jp, { ...SIT, lean: .25, ht: .05, la: 1.0, le: 1.3, ra: 1.5, re: .1 }, Math.sin(rg(T, 67.6, 69.4) * PI)); }
    if (T > 70.5) jp = { ...SIT, lean: .45, ht: .55, la: 1.2, le: .6, ra: 1.1, re: .7 };
    if (T > 77) jp = mixP(jp, { ...SIT, lean: .3, ht: .45, la: 1.8, le: 1.3, ra: 1.1, re: .7 }, eio(rg(T, 77, 78.4)));
    const JF = M('joy', jp, T, { wand: jw, wind: .1 });
    const lt = [{ x: -900, y: -100, c: '190,200,236', r: 400, a: .5 }]; if (lit) lt.push({ x: -470, y: 84, c: '255,190,110', r: 360, a: .8 * lit });
    dm('joy', JF, -620, 340, 2.6, false, T, { light: lt, glow: .8 });
    if (JF.tip && T > 68 && T < 69) { const tp = figPt(JF.tip, -620, 340, 2.6, false); orb(tp[0], tp[1], 4, 'gold', weak(T, .5), T); }
    const W = wr(JF, -620, 340, 2.6, false), pain = fade(T, 64, 90, .3, 4);
    chestPain(JF, -620, 340, 2.6, false, T, pain * .8);
    L(1); wristRing(W, T, .6 + .4 * pain, 6); glowAt(W[0], W[1], 50, '80,240,120', .45 * pain * (.5 + .5 * Math.sin(T * 3.4)));
  }
});

/* ===================== I · LA RUINA DEL PÁRAMO (86–124) ===================== */
scene(86, 124, 4, .5, {
  tin: 'bleed2',
  draw(T, dt) {
    const vis = fade(T, 99, 114, 1.5, 1.5);
    CAM = { z: 1.12 + .12 * eio(rg(T, 92, 98)), x: lerp(-40, 60, rg(T, 86, 124)), y: 70 };
    nightBack(T, SW * .3, -320, 1, 1);
    mtnDraw(0, .15, .7); mistDraw(T, 0, 120, .25, .4, 12); mtnDraw(1, .28, .6);
    L(1); dS(B.ruin);
    campfire(80, 334, T, 1);
    const lt = [{ x: 80, y: 290, c: '255,150,70', r: 420, a: .9 }];
    let dp = POSE.stand, dx = -120, dfl = false;
    if (T > 92) dp = mixP(POSE.stand, CLUTCH, eio(rg(T, 92, 92.6)));
    if (T > 93.4) dp = mixP(CLUTCH, KNEELW, eio(rg(T, 93.4, 94.4)));
    if (T > 95.4) dp = mixP(KNEELW, COWER, eio(rg(T, 95.4, 96.4)) * (1 - eio(rg(T, 100, 101.5))));
    if (T > 101.5) dp = mixP(KNEELW, { ...KNEEL2, ra: 1.45, re: .1, ht: -.1 }, eio(rg(T, 102.5, 104)) * (1 - eio(rg(T, 112, 113.5))));
    if (T > 115) { dp = { ...KNEEL2, ht: -.35 + Math.sin(T * 9) * .06 * (1 - rg(T, 115, 118)), lean: .05 }; }
    if (T > 118.5) dp = mixP(dp, { ...POSE.stand, ht: -.25 }, eio(rg(T, 118.5, 120.5)));
    const DF = M('damien', dp, T, { wind: .5 });
    dm('damien', DF, dx, 330, 2.55, dfl, T, { light: lt });
    const pain = fade(T, 92, 124, .3, 6);
    chestPain(DF, dx, 330, 2.55, dfl, T, pain * 1.6);
    const W = wr(DF, dx, 330, 2.55, dfl); L(1); wristRing(W, T, .6 + .4 * pain, 6);
    // la visión: la maldición busca una cuarta muñeca
    if (vis > 0) {
      const gx = 470, F = mage({ ...POSE.stand, la: .5, le: .3 }, { sex: 'f', hair: 'sleek', t: T, wind: .6 });
      L(1); mode('source-over'); drawMage(F, gx, 330, 2.4, true, { a: vis * .6, ink: '150,240,180', inkA: .3, halo: 0, noShadow: 1, house: 'S', glow: .6 }); mode('multiply');
      const GW = figPt(F.W1, gx, 330, 2.4, true);
      L(1); hilo(W, GW, T, .7 * vis, { sag: 70, w: 1.5, gap: [20, 8] }); vein(W, GW, T, vis, { sag: 70, speed: .5, n: 3 });
      wristRing(GW, T, vis, 5); glowAt(gx, 160, 300, '90,240,130', .18 * vis);
    }
  }
});
