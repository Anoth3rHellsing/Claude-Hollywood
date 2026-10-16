/* ===================== III · TRÍPTICO: TRES CAMINOS, UNA LUNA (338–362) ===================== */
scene(338, 364, 4, .5, {
  tin: 'bleed2',
  draw(T, dt) {
    const pw = SW / 3;
    for (let i = 0; i < 3; i++) {
      const t0 = 339.4 + i * 1.5, pa = eo(rg(T, t0, t0 + 1.6)), out = 1 - sm(rg(T, 355.5, 359)); if (pa <= 0 || out <= 0) continue;
      const pc = -SW / 2 + pw * (i + .5);
      L0(); ctx.save(); ctx.beginPath(); ctx.rect(pc - pw / 2 + 7, -560, pw - 14, 1120 * pa); ctx.clip();
      const z = .78, oa = SA; SA = oa * out;
      CAM = { z, x: -pc / z, y: 40 };
      L(.05); dS(B.night); starsDraw(B.stars, T, .9);
      L(1); mode('source-over'); dS(B.moon, 0, -300, 1, 0, .95); mode('multiply'); L(1); glowAt(0, -300, 260, '200,70,70', .08);
      const mv = (T - 338) * 40;
      if (i === 0) { // Joy por un camino de cercas
        mtnDraw(0, .2, .6); L(1); dS(B.gP, -mv % 600 + 300, 0, 1, 0, .9);
        L(1); ctx.fillStyle = `rgba(24,22,26,${SA})`; for (let k = -6; k <= 6; k++) { const x = ((k * 130 - mv) % 1560 + 1560) % 1560 - 780; ctx.fillRect(x - 4, 270, 8, 64); } ctx.fillRect(-900, 288, 1800, 4);
        dm('joy', M('joy', walkP(T * 4.2, 0), T, { wind: .7, vx: 60 }), 0, 336, 2.1, false, T);
      } else if (i === 1) { // Anami y Draconida cruzan el páramo
        mtnDraw(1, .3, .7); mistDraw(T, 1, 160, .5, .4, 14); L(1); dS(B.snowG, -mv % 600 + 300, 0, 1, 0, 1);
        dm('draco', M('draco', walkP(T * 4.2 + 1, 0), T, { wind: .7, vx: 60 }), 60, 336, 2.0, false, T);
        dm('anami', M('anami', walkP(T * 4.2, 0), T, { wind: .7, vx: 60 }), -50, 336, 2.1, false, T);
      } else { // Damien sobre los tejados
        L(.6); dS(B.roofs, -mv * .5 % 400 + 100, 160, 1, 0, .8);
        L(1); solid2(-900, 336, 900, 600); ctx.fillStyle = `rgba(22,22,30,${SA})`; for (let k = -3; k <= 3; k++) { const x = ((k * 300 - mv) % 2100 + 2100) % 2100 - 1050; ctx.fillRect(x - 14, 250, 28, 86); }
        dm('damien', M('damien', walkP(T * 4.2, 0), T, { wind: .8, vx: 60 }), 0, 336, 2.1, false, T);
      }
      SA = oa; ctx.restore();
      L0(); mode('multiply'); ctx.strokeStyle = `rgba(22,18,20,${.8 * SA * out})`; ctx.lineWidth = 3; ctx.strokeRect(pc - pw / 2 + 7, -560, pw - 14, 1120 * pa);
    }
    // las tres lunas se vuelven una
    const m1 = sm(rg(T, 356, 359)); if (m1 > 0) { CAM = { z: 1, x: 0, y: 0 }; L0(); mode('source-over'); dS(B.moonBig, 0, -230, lerp(.5, .9, m1), 0, .9 * m1); mode('multiply'); glowAt(0, -230, 400, '200,70,70', .12 * m1); }
  }
});
function solid2(x0, y0, x1, y1) { ctx.fillStyle = `rgba(26,26,34,${.9 * SA})`; ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x0, y0); for (let x = x0; x <= x1; x += 60) ctx.lineTo(x, y0 + Math.sin(x * .02) * 2); ctx.lineTo(x1, y1); ctx.fill(); }

/* ===================== III · EL PORCHE DE YORK (360–520) ===================== */
const HX = -283, HY = -48, HS = 1.35, PFY = HY + 232 * HS, LX = HX + 150 * HS, LY = HY + 62 * HS;
const PT = { j1: 403, ex: 405.5, r1: 410.2, r2: 411.4, r3: 412.6, r4: 413.8, cl: 415.6, cj: 417, burst: 422.6, rise: 425.5, ch: 427.5, run: 430.4, av: 432.6, cat: 432.9, up: 433.2, shat: 433.7, snap: 434.0, join: 471.3, gone: 500.6 };
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
scene(360, 522, 4, .5, {
  tin: 'bleed',
  enter() { SPK.clear(); DEB.clear(); DUST.clear(); B.motes.clear(); },
  draw(T, dt) {
    const slow = Math.min(1, fade(T, 418, PT.burst, .4, .25) + fade(T, 431.8, 434.8, .3, .6)), dts = dt * (1 - slow * .78);
    let z = 1, cx = -150, cy = 60;
    if (T < 372) { z = 1.0; cx = lerp(-220, -130, rg(T, 360, 372)); cy = 40; }
    else if (T < 386) { const k = eio(rg(T, 372, 375)); z = lerp(1.0, 1.28, k); cx = lerp(-130, -40, k); cy = lerp(40, 110, k); }
    else if (T < 398) { const k = eio(rg(T, 386, 389)); z = lerp(1.28, .92, k); cx = lerp(-40, -170, k); cy = lerp(110, 50, k); }
    else if (T < 418) { z = .98 + .04 * Math.sin(T * .4); cx = -190; cy = 80; }
    else if (T < 422.8) { const k = eio(rg(T, 418, 422)); z = lerp(1, 1.3, k); cx = lerp(-190, -230, k); cy = lerp(80, 120, k); }
    else if (T < 431.6) { z = 1.0 - .05 * eo(rg(T, 422.6, 424)); cx = -230; cy = 80; }
    else if (T < 435) { const k = eio(rg(T, 431.6, 433)); z = lerp(.95, 1.15, k); cx = lerp(-230, -330, k); cy = 100; }
    else if (T < 448) { z = 1.08; cx = lerp(-330, -360, rg(T, 435, 448)); cy = 100; }
    else if (T < 494.6) { const k = eio(rg(T, 448, 452)); z = lerp(1.08, 1.28, k) + .08 * eio(rg(T, 466, 471)); cx = lerp(-360, -380, k); cy = lerp(100, 130, k); }
    else { const k = eio(rg(T, 494.6, 512)); z = lerp(1.2, .9, k); cx = lerp(-380, -120, k); cy = lerp(120, 50, k); }
    CAM = { z, x: cx, y: cy };
    const unveil = sm(rg(T, 390.5, 395));
    porchBack(T, 0, unveil);
    const lit = T < PT.shat ? sm(rg(T, 374.8, 375.6)) * (T > PT.burst && T < PT.burst + 1.2 ? .3 + .7 * Math.abs(N2(T * 30, 4)) : 1) : 0;
    lantern(T, lit, T > PT.shat);
    porchCast(T, dts, dt, slow, lit, unveil);
    debrisDraw(dts, T); sparksDraw(dts, T);
    if (dts > 0) B.motes.update(dts, T); motesDraw(B.motes);
    snowDraw(T, dts, .7, 10);
    if (slow > 0) { L0(); mode('multiply'); const gr = ctx.createRadialGradient(0, 0, 200, 0, 0, SW * .7); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(1, `rgba(30,24,40,${.5 * slow * SA})`); ctx.fillStyle = gr; ctx.fillRect(-SW, -560, SW * 2, 1120); }
    ribbonInsert(T);
  }
});
function porchCast(T, dt, rdt, slow, lit, unveil) {
  const P = PT, tw = T * (1 - slow * .7), lights = [];
  if (lit > 0) lights.push({ x: LX, y: LY, c: '255,196,110', r: 380, a: lit });
  lights.push({ x: 560, y: -300, c: '196,206,236', r: 600, a: .35 * unveil });
  const sw = (a, b) => Math.sin(rg(T, a, b) * PI);
  // ---------------- Joy ----------------
  let jx = -430, jy = 330, jp = POSE.stand, jfl = false, jW = false, ja = sm(rg(T, 362.8, 363.8));
  if (T > 365.5) { jx = lerp(-430, -40, eio(rg(T, 365.5, 369))); jp = walkW(jx); }
  if (T > 369) { jx = lerp(-40, -70, rg(T, 369, 370.4)); jy = lerp(330, PFY, eio(rg(T, 369, 370.4))); jp = walkW(jx + 30); }
  if (T > 370.4) { jx = lerp(-70, -175, eio(rg(T, 370.4, 372.1))); jp = walkW(jx); jfl = true; }
  if (T > 372.1) { jx = -175; jfl = false; jp = POSE.stand; }
  if (T > 372.4 && T < 375.8) { jW = true; jp = mixP(POSE.stand, { ...RAISE, ra: 2.15, re: -.1 }, eio(rg(T, 372.4, 373)) * (1 - eio(rg(T, 375.2, 375.8)))); }
  if (T > 386.6) jfl = true;
  if (T > 398.5) { jW = true; jp = mixP(POSE.stand, DUEL, eio(rg(T, 398.5, 399.5))); }
  if (T > 402.5 && T < 404.6) jp = T < P.j1 + .35 ? BLOCK : mixP(STAGGER, DUEL, rg(T, 403.9, 404.6));
  if (T > P.r2 - .1 && T < P.r2 + .9) jp = T < P.r2 + .3 ? mixP(DUEL, LUNGE, sw(P.r2 - .1, P.r2 + .5)) : mixP(FLINCH, DUEL, rg(T, P.r2 + .4, P.r2 + .9));
  if (T > P.r4 - .2 && T < P.r4 + .8) jp = BLOCK;
  if (T > P.cj - .2 && T < P.burst) jp = mixP(DUEL, LUNGE, .45 + .08 * Math.sin(tw * 3.3));
  if (T > P.burst) { jp = mixP(STAGGER, KNEEL2, eio(rg(T, P.burst, P.burst + .8))); jW = T < P.burst + .2; }
  if (T > 428) jp = mixP(KNEEL2, COWER, eio(rg(T, 432, 432.8)) * (1 - eio(rg(T, 440, 442))));
  if (T > 447.5) { jx = lerp(-175, -30, eio(rg(T, 447.5, 449.8))); jp = mixP(KNEEL2, walkW(jx), rg(T, 447.5, 448.2)); jfl = false; }
  if (T > 449.8) { jx = lerp(-30, 0, rg(T, 449.8, 450.8)); jy = lerp(PFY, 330, rg(T, 449.8, 450.8)); jp = walkW(jx); }
  if (T > 450.8) { jx = lerp(0, -255, eio(rg(T, 450.8, 452.6))); jy = 330; jp = walkW(jx); jfl = true; }
  if (T > 452.6) jp = mixP(POSE.stand, { ...REACH, ra: 1.15, re: .2 }, eio(rg(T, 452.6, 453.8)));
  if (T > 475) jp = mixP({ ...REACH, ra: 1.15, re: .2 }, POSE.stand, eio(rg(T, 475, 476.5)));
  if (T > 501) jp = mixP(POSE.stand, { ...POSE.stand, la: 1.6, le: 1.4, ht: .35 }, eio(rg(T, 503, 505)));
  const JF = M('joy', jp, T, { wand: jW, wind: .45 });
  const jtip = JF.tip ? figPt(JF.tip, jx, jy, 2.5, jfl) : [jx - 40, jy - 100];
  // ---------------- Anami ----------------
  let ax = 330, ay = 330, ap = POSE.stand, afl = true, aW = false, aa = sm(rg(T, 363.6, 364.6)), avx = 0;
  if (T > 398.5) { ax = lerp(330, 200, eio(rg(T, 398.5, 400.5))); ap = T < 400.5 ? walkW(ax) : DUEL; aW = true; }
  if (T > P.ex - .1 && T < P.ex + 1.5) ap = T < P.ex + .3 ? mixP(DUEL, LUNGE, sw(P.ex - .1, P.ex + .5)) : mixP(FLINCH, DUEL, rg(T, P.ex + .7, P.ex + 1.5));
  if (T > P.r1 + .25 && T < P.r1 + 1.1) ap = mixP(STAGGER, DUEL, rg(T, P.r1 + .5, P.r1 + 1.1));
  if (T > P.r3 - .1 && T < P.r3 + 1) ap = T < P.r3 + .3 ? mixP(DUEL, LUNGE, sw(P.r3 - .1, P.r3 + .5)) : mixP(FLINCH, DUEL, rg(T, P.r3 + .4, P.r3 + 1));
  if (T > P.cl - .1 && T < P.burst) ap = mixP(DUEL, LUNGE, .45 - .08 * Math.sin(tw * 3));
  if (T > P.burst) { ax = lerp(200, 260, eo(rg(T, P.burst, P.burst + .5))); ap = mixP(STAGGER, KNEEL2, eio(rg(T, P.burst, P.burst + .8))); }
  if (T > 429) ap = mixP(KNEEL2, POSE.stand, eio(rg(T, 429, 430.3)));
  if (T > P.run) { ax = lerp(260, -385, eio(rg(T, P.run, P.av - .05))); ap = T < P.av - .05 ? runP(ax / 60 * TAU) : mixP(FLINCH, { ...FLINCH, la: 2.4, ra: 2.4, le: .3, re: .3 }, eio(rg(T, P.cat, P.cat + .3))); avx = T < P.av ? 300 : 0; aW = false; }
  if (T > 434.3) ap = mixP({ ...FLINCH, la: 2.4, ra: 2.4, le: .3, re: .3 }, KNEEL2, eio(rg(T, 434.3, 435.4)));
  if (T > 462) ap = mixP(KNEEL2, POSE.stand, eio(rg(T, 462, 464.3)));
  if (T > 464.4) afl = T < 466.8;
  if (T > 466.8) { afl = false; }
  if (T > 470.4) ap = mixP(POSE.stand, { ...REACH, ra: 1.15, re: .2 }, eio(rg(T, 470.4, 471.3)) * (1 - eio(rg(T, 475, 476.5))));
  if (T > 477.4 && T < 480.2) afl = true;
  if (T > 482.6) ap = mixP(POSE.stand, { ...POSE.stand, la: .9, le: 1.0 }, eio(rg(T, 482.6, 484)));
  const AF = M('anami', ap, T, { wand: aW, thread: aW && T < 484, wind: .45, vx: avx });
  const atip = AF.tip ? figPt(AF.tip, ax, ay, 2.6, afl) : [ax - 40, ay - 110];
  // ---------------- Draconida ----------------
  let cx = 465, cp = POSE.stand, cfl = true, ca = sm(rg(T, 363.6, 364.6)), cW = false, cvx = 0;
  if (T > 398.5) { cp = mixP(POSE.stand, { ...DUEL, ra: 1.0 }, eio(rg(T, 398.8, 400))); cW = true; }
  if (T > 408.2 && T < 410.4) { cx = T < 409.1 ? lerp(465, 400, eio(rg(T, 408.2, 409.1))) : lerp(400, 480, eo(rg(T, 409.1, 409.8))); cp = T < 409.1 ? walkW(cx) : mixP(STAGGER, DUEL, rg(T, 409.6, 410.4)); }
  if (T > 410.4) cx = 480;
  if (T > 436) { cW = false; cx = lerp(480, -495, eio(rg(T, 436, 439.2))); cp = T < 439.2 ? runP(cx / 60 * TAU) : mixP(POSE.stand, KNEEL2, eio(rg(T, 439.2, 440.2))); cvx = T < 439.2 ? 260 : 0; }
  if (T > 439.2) cfl = false;
  if (T > 462) cp = mixP(KNEEL2, { ...REACH, ra: .7, re: .3 }, eio(rg(T, 462, 464.3)));
  if (T > 466) cp = mixP({ ...REACH, ra: .7, re: .3 }, POSE.stand, eio(rg(T, 466, 467)));
  if (T > 482.6) { cx = lerp(-495, -455, eio(rg(T, 482.6, 484))); cp = mixP(POSE.stand, { ...REACH, ra: 1.0, re: .4 }, eio(rg(T, 482.6, 484))); }
  if (T > 495) cp = mixP({ ...REACH, ra: 1.0, re: .4 }, { ...REACH, ra: .7, re: .9 }, eio(rg(T, 495, 496.5)));
  const CF = M('draco', cp, T, { wand: cW, wind: .45, vx: cvx });
  // ---------------- Damien ----------------
  let dx = -SW * .75, dy = 330, dp = POSE.stand, dfl = false, dW = false, drot = 0, da = sm(rg(T, 386.4, 388.2)), dAng, dsx = 1;
  if (T > 386.4) { dx = lerp(-SW * .75, -610, eo(rg(T, 386.4, 390.4))); dp = T < 390.4 ? walkW(dx) : POSE.stand; }
  if (T > 398.5) { dW = true; dp = mixP(POSE.stand, DUEL, eio(rg(T, 398.5, 399.5))); }
  if (T > P.j1 - .2 && T < P.j1 + 1.6) dp = T < P.j1 + .3 ? mixP(DUEL, LUNGE, sw(P.j1 - .2, P.j1 + .5)) : mixP(CLUTCH, DUEL, rg(T, P.j1 + 1, P.j1 + 1.6));
  if (T > P.ex + .2 && T < P.ex + 1.4) dp = mixP(STAGGER, DUEL, rg(T, P.ex + .7, P.ex + 1.4));
  if (T > P.r1 - .1 && T < P.r1 + 1) dp = T < P.r1 + .3 ? mixP(DUEL, LUNGE, sw(P.r1 - .1, P.r1 + .5)) : mixP(CLUTCH, DUEL, rg(T, P.r1 + .5, P.r1 + 1));
  if (T > P.r2 + .2 && T < P.r2 + 1) dp = mixP(STAGGER, DUEL, rg(T, P.r2 + .5, P.r2 + 1));
  if (T > P.r3 && T < P.r3 + .9) dp = BLOCK;
  if (T > P.r4 - .1 && T < P.r4 + 1) dp = T < P.r4 + .3 ? mixP(DUEL, LUNGE, sw(P.r4 - .1, P.r4 + .5)) : mixP(CLUTCH, DUEL, rg(T, P.r4 + .5, P.r4 + 1));
  if (T > P.cl - .1 && T < P.burst) dp = mixP(DUEL, LUNGE, .45 + .08 * Math.sin(tw * 3));
  if (T > P.burst) { dx = lerp(-610, -665, eo(rg(T, P.burst, P.burst + .5))); dp = mixP(STAGGER, KNEEL2, eio(rg(T, P.burst, P.burst + .8))); }
  if (T > P.rise) dp = mixP(KNEEL2, POSE.stand, eio(rg(T, P.rise, P.rise + 1.4)));
  if (T > P.ch - .5) dp = mixP(POSE.stand, CAST_P, eio(rg(T, P.ch - .5, P.ch + .5)));
  if (T > P.av - .1 && T < P.snap) dp = mixP(CAST_P, LUNGE, sw(P.av - .1, P.av + .7) * .6 + .2);
  if (T > P.snap) { dW = false; const f = rg(T, P.snap, P.snap + 1); dx = lerp(-665, -790, eo(f)); dy = 330 - Math.sin(f * PI) * 70; dp = POSE.leap; drot = -f * 1.4; if (T > P.snap + 1) { dy = 340; dp = POSE.lie; drot = -PI / 2; } }
  if (T > 440) { dy = 330; drot = 0; dp = mixP(POSE.lie, KNEEL2, eio(rg(T, 440, 441.6))); if (T < 440.5) { dy = 340; drot = -PI / 2 * (1 - rg(T, 440, 440.5)); } }
  if (T > 457) dp = { ...KNEEL2, ht: -.3 + Math.sin(T * 9) * .06 * (1 - rg(T, 457, 459.5)), lean: .05 };
  if (T > 474.4) dp = mixP(KNEEL2, POSE.stand, eio(rg(T, 474.4, 476)));
  if (T > 476.5) dp = mixP(POSE.stand, { ...REACH, ra: 1.25, re: .15 }, eio(rg(T, 476.5, 477.6)) * (1 - eio(rg(T, 481, 482.2))));
  if (T > 497) dp = mixP(POSE.stand, { ...POSE.stand, ht: -.3, lean: -.1 }, eio(rg(T, 497.5, 498.5)));
  if (T > 499.4) { const k = rg(T, 499.4, 501.6); dsx = 1 - eio(rg(T, 500, 501.1)) * .9; da *= 1 - sm(rg(T, 500.5, 501.2)); }
  if (dW && T > P.ch - .5 && T < P.snap) { const sh = [dx + 10, dy - 150], tg = figPt(JF.T, jx, jy, 2.5, jfl); dAng = Math.atan2(tg[1] - sh[1], tg[0] - sh[0]); }
  const DF = M('damien', dp, T, { wand: dW, wind: .45, wandA: dAng });
  const dtip = DF.tip ? figPt(DF.tip, dx, dy, 2.55, dfl, drot) : [dx + 40, dy - 110];
  // ---------------- muñecas e hilos ----------------
  const JW = wr(JF, jx, jy, 2.5, jfl), AW = wr(AF, ax, ay, 2.6, afl), DWr = wr(DF, dx, dy, 2.55, dfl, drot);
  const hurt = (t0) => fade(T, t0, t0 + 1.4, .05, 1);
  const hJ = hurt(P.r2 + .1), hA = Math.max(hurt(P.ex + .1), hurt(P.r3 + .1)), hD = Math.max(hurt(P.j1 + .1), hurt(P.r1 + .1), hurt(P.r4 + .1));
  const ign = T > 392 ? eo(rg(T, 392, 395)) : 0, clashK = fade(T, P.cl, P.burst + .4, 1, .2), catchK = fade(T, P.cat, P.cat + 2.4, .05, 1.4);
  const B1 = (t0, dur, from, to, kind, w = 4, sd = 1, hold = .3, wk = .55) => { if (T > t0 && T < t0 + dur + hold) { const p = rg(T, t0, t0 + dur), al = (1 - rg(T, t0 + dur, t0 + dur + hold)) * weak(T, wk); beam(from[0], from[1], to[0], to[1], p, kind, al, tw, w, sd); lights.push({ x: lerp(from[0], to[0], p), y: lerp(from[1], to[1], p), c: SPELL[kind][0], r: 240, a: al }); } };
  const hitAt = (t, x, y, kind, n = 1, sh = 6) => { if (Math.abs(T - t) < .045 && dt > 0) { impact(x, y, kind, n); SHK = Math.max(SHK, sh); } };
  // Damien → Joy (escudo débil)
  B1(P.j1, .35, dtip, [jtip[0] - 26, jtip[1]], 'blue', 4, 1); hitAt(P.j1 + .35, jtip[0] - 26, jtip[1], 'blue', .7, 6);
  if (T > 402.6 && T < 404.2) shield(jtip[0] - 22, jtip[1], 66, 'gold', fade(T, 402.6, 404.2, .15, .3) * weak(T, .8), tw, T > P.j1 + .35 ? 1 - rg(T, P.j1 + .35, P.j1 + 1) : 0, -1);
  // Anami → Damien (¡Expelliarmus!, débil: no lo desarma)
  B1(P.ex, .22, atip, [dx + 18, dy - 120], 'red', 4.5, 2); hitAt(P.ex + .22, dx + 18, dy - 120, 'red', .7, 6);
  // intercambio rápido
  B1(P.r1, .25, dtip, [ax - 10, ay - 110], 'blue', 4, 3); hitAt(P.r1 + .25, ax - 10, ay - 110, 'blue', .6, 5);
  B1(P.r2, .22, jtip, [dx + 20, dy - 130], 'gold', 4, 4); hitAt(P.r2 + .22, dx + 20, dy - 130, 'gold', .6, 5);
  B1(P.r3, .22, atip, [dtip[0] + 16, dtip[1]], 'red', 4, 5);
  if (T > P.r3 && T < P.r3 + .9) shield(dtip[0] + 16, dtip[1], 60, 'blue', fade(T, P.r3, P.r3 + .9, .1, .3) * weak(T, .6), tw, T > P.r3 + .22 ? 1 - rg(T, P.r3 + .22, P.r3 + .8) : 0, 1);
  B1(P.r4, .25, dtip, [jx + 30, jy - 140], 'blue', 4, 6); hitAt(P.r4 + .25, jx + 40, jy - 150, 'blue', .8, 6);
  if (T > P.r4 - .2 && T < P.r4 + .8) shield(jtip[0] - 22, jtip[1], 62, 'gold', fade(T, P.r4 - .2, P.r4 + .8, .1, .3) * weak(T, .8), tw, T > P.r4 + .25 ? 1 - rg(T, P.r4 + .25, P.r4 + .8) : 0, -1);
  // Draconida intenta entrar en el triángulo y el hilo la rechaza
  if (Math.abs(T - 409.1) < .045 && rdt > 0) { sparks(cx - 30, 230, 30, 'red', 260); SHK = Math.max(SHK, 5); }
  // triple choque de rayos
  let J = null;
  if (T > P.cl && T < P.burst + .1) {
    const a = fade(T, P.cl, P.burst + .1, .25, .1), j = .5 + .06 * Math.sin(tw * 3.1) + .04 * Math.sin(tw * 7.3);
    J = clash(dtip, atip, j, 'blue', 'red', tw, a * weak(T, .35));
    if (T > P.cj) { const p = rg(T, P.cj, P.cj + .4); beam(jtip[0], jtip[1], J[0], J[1], p, 'gold', a * weak(T, .35), tw, 4, 9); orb(J[0], J[1], 18 + 14 * rg(T, P.cj, P.burst) + 6 * Math.sin(tw * 19), 'gold', a * .8, tw); }
    lights.push({ x: J[0], y: J[1], c: '240,160,140', r: 520, a });
    if (rdt > 0 && R() < dt * 40) sparks(J[0], J[1], 4, pick(['red', 'blue', 'gold']), 260, 60);
  }
  if (Math.abs(T - P.burst) < .05 && rdt > 0) { const c = [(dtip[0] + atip[0] + jtip[0]) / 3, (dtip[1] + atip[1] + jtip[1]) / 3]; impact(c[0], c[1], 'red', 1.6); impact(c[0], c[1], 'gold', 1); SHK = 16; }
  if (T > P.burst && T < P.burst + .7) { FLASH = Math.max(FLASH, .6 * (1 - rg(T, P.burst, P.burst + .7))); FLASHC = '255,214,200'; }
  // la maldición
  if (T > P.ch && T < P.av + .3) { const g = rg(T, P.ch, P.av); orb(dtip[0], dtip[1], 3 + g * 13, 'green', (.4 + g * .6), tw); lights.push({ x: dtip[0], y: dtip[1], c: '60,214,96', r: 200 + g * 300, a: .4 + g * .6 }); if (rdt > 0 && R() < dt * 30 * g) { const an = rnd(TAU); SPK.spawn(dtip[0] + Math.cos(an) * 60, dtip[1] + Math.sin(an) * 60, -Math.cos(an) * 100, -Math.sin(an) * 100, { col: SPELL.green[0], life: .5, s: 1.6 }); } }
  const KP = figPt(AF.T, ax, ay, 2.6, afl), knot = [KP[0] - 46, KP[1] + 10];
  if (T > P.av && T < P.up + .5) { const p = rg(T, P.av, P.cat); beam(dtip[0], dtip[1], knot[0], knot[1], p, 'green', 1 - rg(T, P.up, P.up + .5), tw, 6, 12); lights.push({ x: knot[0], y: knot[1], c: '60,214,96', r: 600, a: 1 }); }
  if (T > P.up && T < P.up + 1.2) { const p = rg(T, P.up, P.up + .35); beam(knot[0], knot[1], knot[0] + 300, -640, p, 'green', 1 - rg(T, P.up + .6, P.up + 1.2), tw, 7, 13); }
  if (T > P.cat && T < P.cat + 2.4) { // el hilo forma un nudo que atrapa la maldición
    const k = catchK; L(1); mode('source-over'); ctx.lineCap = 'round';
    for (let i = 0; i < 5; i++) { ctx.strokeStyle = `rgba(255,${80 + i * 20},${90 + i * 10},${.8 * k * SA})`; ctx.lineWidth = 2.4 - i * .3; ctx.shadowColor = 'rgba(255,60,60,.95)'; ctx.shadowBlur = LOWQ ? 0 : 18 * U * CAM.z; ctx.beginPath(); ctx.ellipse(knot[0], knot[1], 30 + i * 9 + 6 * Math.sin(tw * 8 + i), 52 + i * 10, tw * (i % 2 ? 2 : -2) + i, 0, TAU); ctx.stroke(); }
    ctx.shadowBlur = 0; mode('multiply'); orb(knot[0], knot[1], 22, 'red', k, tw);
  }
  if (Math.abs(T - P.cat) < .05 && rdt > 0) { sparks(knot[0], knot[1], 60, 'green', 380); sparks(knot[0], knot[1], 40, 'red', 300); SHK = 14; }
  if (T > P.cat && T < P.cat + .8) { FLASH = Math.max(FLASH, .55 * (1 - rg(T, P.cat, P.cat + .8))); FLASHC = '200,255,214'; }
  if (Math.abs(T - P.shat) < .05 && rdt > 0) { sparks(LX, LY, 50, 'orange', 300); for (let i = 0; i < 14; i++) DEB.spawn(LX + rnd(-8, 8), LY + rnd(-8, 8), rnd(-200, 200), rnd(-300, 0)); }
  if (Math.abs(T - P.snap) < .05 && rdt > 0) { sparks(dtip[0], dtip[1], 30, 'blue', 260); impact(dx, dy - 100, 'green', .7); }
  if (T > P.snap && T < 520) { const f = rg(T, P.snap, P.snap + 1.2); wandAt(lerp(dtip[0], -560, f), lerp(dtip[1], 336, f) - Math.sin(f * PI) * 110, f * 9, 34, 1, Math.min(1, (T - P.snap) * 4)); }
  // ---------------- hilos ----------------
  if (ign > 0) {
    const flareAll = Math.max(clashK * .8, catchK);
    const col = catchK > .05 ? '255,120,130' : '220,40,50';
    const e = (p, q, k, o = {}) => { if (k <= .01) return; const pe = ign; hilo(p, [lerp(p[0], q[0], pe), lerp(p[1], q[1], pe)], tw, k, Object.assign({ sag: 60 * (1 - flareAll * .8), w: 2.2 + flareAll * 1.8, col }, o)); };
    // J–A: se disuelve en luz dorada cuando Anami perdona a Joy
    const jaK = T < P.join ? 1 : 1 - sm(rg(T, P.join, P.join + 2.6));
    e(JW, AW, (.55 + .45 * Math.max(hJ, hA, flareAll)) * jaK, T > P.join ? { col: '250,190,90', glow: '255,210,120', gap: [14 + 30 * rg(T, P.join, P.join + 2.6), 10 + 40 * rg(T, P.join, P.join + 2.6)] } : {});
    if (T > P.join && T < P.join + 3 && rdt > 0) { for (let i = 0; i < 4; i++) { const f = R(), q = hiloPt(JW, AW, tw, f, { sag: 60 }); if (R() < dt * 30) B.motes.spawn(q[0], q[1], rnd(-20, 20), rnd(-60, -20)); } }
    // D–A y D–J: tras la desaparición, se estiran en la oscuridad
    const DEND = T < P.gone ? DWr : [lerp(DWr[0], -SW * .9, eo(rg(T, P.gone, P.gone + 3))), lerp(DWr[1], -560, eo(rg(T, P.gone, P.gone + 3)))];
    const tightDA = fade(T, 480.2, 484, .4, 2);
    e(AW, DEND, .55 + .45 * Math.max(hA, hD, flareAll, tightDA), Object.assign({ ph: 1 }, tightDA > 0 ? { sag: 60 - 50 * tightDA, w: 1.5 + tightDA } : {}, T > P.gone ? { gap: [30, 8], sag: 120 } : {}));
    e(DEND, JW, .55 + .45 * Math.max(hJ, hD, flareAll), Object.assign({ ph: 2 }, T > P.gone ? { gap: [30, 8], sag: 120 } : {}));
    L(1); for (const W of [JW, AW]) wristRing(W, tw, .6 + .4 * flareAll, 6); if (T < P.gone) wristRing(DWr, tw, (.6 + .4 * flareAll) * da, 6);
  }
  // ---------------- aurores que llegan por la colina ----------------
  const ua = fade(T, 495.5, 530, 2, 2);
  if (ua > 0) { for (let i = 0; i < 3; i++) { const x = lerp(1150 + i * 90, 760 + i * 120, eo(rg(T, 495.5, 516))), y = 150 + Math.sin(T * 5 + i * 2) * 4 + i * 12; L(.85); glowAt(x, y, 110, '255,200,120', .55 * ua); glowAt(x, y, 14, '255,240,200', .9 * ua); } }
  const uk = fade(T, 509, 540, 1.5, 2);
  if (uk > 0) for (const [o, s] of [[0, 2.4], [130, 2.35]]) { const ux = lerp(SW * .55 + 300 + o, 560 + o, eo(rg(T, 509, 516))); auror(rg(T, 509, 516) < 1 ? walkW(ux) : POSE.stand, ux, 330, s, true, T, { a: uk, light: [{ x: ux - 30, y: 200, c: '255,200,120', r: 260, a: .7 }] }); }
  // ---------------- fantasmas de la infancia ----------------
  const ga = fade(T, 376.2, 386.5, 1.6, 2.6); if (ga > 0) ghostKids(T, ga, 45, PFY, 2.0);
  // ---------------- dibujo (con luz y sombra) ----------------
  const key = lights.reduce((m, l) => (!m || l.a > m.a) ? l : m, null), sh = key ? { x: key.x, y: key.y, a: key.a } : null;
  appar(-430, 330, rg(T, 361.6, 364), 1, 1); appar(330, 330, rg(T, 362.6, 365), 1, 2); appar(465, 330, rg(T, 362.8, 365.2), 1, 3);
  appar(dx, 330, rg(T, 499.4, 501.8), 1, 4);
  if (Math.abs(T - 409.1) < 1) { L(1); glowAt(cx - 30, 230, 140, '230,50,56', .5 * (1 - Math.abs(T - 409.1))); }
  dm('draco', CF, cx, 330, 2.45, cfl, T, { a: ca, light: lights, shadowFrom: sh, glow: .9 });
  dm('joy', JF, jx, jy, 2.5, jfl, T, { a: ja, light: lights, shadowFrom: sh, glow: T > P.join && T < P.join + 6 ? 1 + fade(T, P.join, P.join + 6, .3, 3) : .9 });
  dm('anami', AF, ax, ay, 2.6, afl, T, { a: aa, light: lights, shadowFrom: sh, green: 1, glow: 1 + .8 * catchK });
  if (da > 0) { L(1); ctx.translate(dx, 0); ctx.scale(dsx, 1); ctx.translate(-dx, 0); drawMage(DF, dx, dy, 2.55, dfl, { house: 'R', t: T, glow: .45, ignite: .5, light: lights, shadowFrom: sh, a: da, rot: drot }); }
  // la gota de sangre en la palma de Joy
  if (T > 453 && T < 476) { const h = figPt(JF.W2, jx, jy, 2.5, jfl); L(1); mode('source-over'); dS(B.drops[0].sp, h[0] - 6, h[1] - 4, .16, 0, fade(T, 453, 476, .6, 1), B.drops[0].bl.get(eo(rg(T, 453, 454.5)))); mode('multiply'); }
  // brillo dorado al unir las manos
  if (T > P.join - .1 && T < P.join + 4) { const h = figPt(JF.W2, jx, jy, 2.5, jfl); glowAt(h[0] - 10, h[1], 260, '255,210,120', .6 * fade(T, P.join, P.join + 4, .2, 2.5)); }
}
/* inserto: la cinta verde sobre el hilo rojo */
function ribbonInsert(T) {
  const ia = fade(T, 484.2, 494.6, .7, .8); if (ia <= 0) return;
  insertBg(ia * .95, '20,22,24'); L0(); glowAt(300, -200, 700, '120,230,160', .14 * ia); glowAt(-300, 200, 600, '230,60,60', .1 * ia);
  const beat = Math.pow(Math.max(0, Math.sin(T * 3.4)), 6);
  // mano de Anami
  ctx.save(); ctx.translate(-120, 150); ctx.scale(1.75, 1.75); ctx.globalAlpha = ia * SA; ctx.fillStyle = 'rgba(30,24,28,.95)'; ctx.shadowColor = 'rgba(120,226,160,.45)'; ctx.shadowBlur = LOWQ ? 0 : 18 * U; ctx.fill(B.hand); ctx.shadowBlur = 0;
  mode('source-over'); ctx.strokeStyle = `rgba(230,46,54,${(.6 + .4 * beat) * ia * SA})`; ctx.lineWidth = 3; ctx.shadowColor = 'rgba(255,60,60,.95)'; ctx.shadowBlur = LOWQ ? 0 : (10 + 20 * beat) * U; ctx.beginPath(); ctx.ellipse(0, 70, 19, 5, 0, 0, TAU); ctx.stroke(); ctx.shadowBlur = 0;
  // la cinta verde se enrolla
  const pr = eio(rg(T, 485.6, 491.6)); ctx.strokeStyle = `rgba(70,200,120,${ia * SA})`; ctx.lineWidth = 4.2; ctx.shadowColor = 'rgba(120,255,170,.9)'; ctx.shadowBlur = LOWQ ? 0 : 12 * U; ctx.lineCap = 'round';
  ctx.beginPath(); const N = 70; let pen = false;
  for (let i = 0; i <= N * pr; i++) { const f = i / N, y = 36 + f * 70, a = f * TAU * 3.2, x = Math.sin(a) * 20, back = Math.cos(a) < -.2; if (back) { pen = false; continue; } if (!pen) { ctx.moveTo(x, y); pen = true; } else ctx.lineTo(x, y); }
  ctx.stroke();
  if (pr > .97) { const k = rg(T, 491.6, 492.6); ctx.beginPath(); ctx.moveTo(14, 104); ctx.quadraticCurveTo(40, 120, 48 + Math.sin(T * 3) * 4, 150 * k + 104 * (1 - k)); ctx.moveTo(14, 104); ctx.quadraticCurveTo(-10, 130, -4 + Math.sin(T * 2.6) * 4, 160 * k + 104 * (1 - k)); ctx.stroke(); }
  ctx.shadowBlur = 0; mode('multiply'); ctx.restore();
  // la mano de Draconida que la ata (desde la derecha)
  const hx = lerp(520, 210, eio(rg(T, 484.6, 486))) - 30 * eio(rg(T, 491.8, 493.4)) * -1;
  ctx.save(); ctx.translate(hx, 260); ctx.rotate(-1.15); ctx.scale(-1.6, 1.6); ctx.globalAlpha = ia * SA; ctx.fillStyle = 'rgba(44,40,46,.92)'; ctx.shadowColor = 'rgba(214,224,224,.4)'; ctx.shadowBlur = LOWQ ? 0 : 14 * U; ctx.fill(B.hand); ctx.shadowBlur = 0; ctx.restore(); ctx.globalAlpha = 1;
}
