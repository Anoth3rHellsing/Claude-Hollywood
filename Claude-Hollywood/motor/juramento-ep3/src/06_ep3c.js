/* ===================== III · LA ÚLTIMA LUNA, EN EL PORCHE (328–522) ===================== */
const Q = { brk: 471.4, joyGrab: 410.5, ex: 386.6, fall: 375 };
scene(328, 522, 4, .5, {
  tin: 'bleed2',
  enter() { SPK.clear(); DEB.clear(); DUST.clear(); B.motes.clear(); },
  draw(T, dt) {
    const slow = Math.min(1, fade(T, 413, 424, .6, 1) + fade(T, Q.brk - .2, Q.brk + 2.5, .1, 1)), dts = dt * (1 - slow * .75);
    CAM = camPath(T);
    const mY = lerp(-150, -330, eio(rg(T, 330, 378))), mA = lerp(.5, 1, rg(T, 330, 372)), mGreen = fade(T, 372, Q.brk, 3, .2) * .8 + fade(T, Q.brk, Q.brk + 4, .1, 3);
    porch3(T, { sky: 'night', mA, mY, mGreen });
    lantern(T, 0, 1);
    porch3Cast(T, dts, dt, slow);
    debrisDraw(dts, T); sparksDraw(dts, T);
    if (dts > 0) B.motes.update(dts, T); motesDraw(B.motes);
    snowDraw(T, dts, .7, 8);
    if (slow > 0) { L0(); mode('multiply'); const gr = ctx.createRadialGradient(0, 0, 200, 0, 0, SW * .7); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(1, `rgba(24,34,30,${.5 * slow * SA})`); ctx.fillStyle = gr; ctx.fillRect(-SW, -560, SW * 2, 1120); }
  }
});
function camPath(T) {
  const K = [[328, 1.0, -100, 50], [343, 1.08, -170, 80], [356, 1.0, 0, 60], [372, 1.08, 120, 80], [386, .98, -40, 70], [398, 1.1, 150, 90], [410, 1.04, -40, 90], [418, 1.25, 0, 120], [436, .98, -40, 80], [446, 1.32, -330, 150], [Q.brk, .98, -120, 50], [480, 1.12, 20, 110], [500, .95, -330, 60], [514, .9, -220, 40]];
  let i = 0; while (i < K.length - 1 && T >= K[i + 1][0]) i++;
  const a = K[i], b = K[i + 1] || a, k = b === a ? 1 : eio(rg(T, a[0], a[0] + Math.min(3.2, b[0] - a[0])));
  const p = K[i - 1] || a, kk = eio(rg(T, a[0], a[0] + Math.min(3.2, (b[0] - a[0]) || 3)));
  return { z: lerp(p[1], a[1], kk), x: lerp(p[2], a[2], kk), y: lerp(p[3], a[3], kk) };
}
function porch3Cast(T, dt, rdt, slow) {
  const tw = T * (1 - slow * .7), lights = [{ x: 560, y: -300, c: '196,206,236', r: 600, a: .4 }];
  const brk = T > Q.brk, sw = (a, b) => Math.sin(rg(T, a, b) * PI);
  // ---------------- Damien ----------------
  let dx = 0, dp = { ...SIT, lean: .35, ht: .45, la: 1.0, le: 1.3, ra: 1.0, re: 1.4 }, dfl = false;
  if (T > 340) { dp = mixP(dp, POSE.stand, eio(rg(T, 340, 341))); dx = lerp(0, -445, eio(rg(T, 341, 344.4))); if (T > 341 && T < 344.4) { dp = walkW(dx); dfl = true; } }
  if (T > 344.4) dp = mixP(POSE.stand, { ...REACH, ra: .9, re: .6, ht: -.1 }, Math.sin(rg(T, 344.4, 355) * PI) * .7);
  if (T > 379.6) dp = mixP(POSE.stand, { ...REACH, ra: 1.45, re: .05, la: 1.3, le: .2, lean: -.25 }, eio(rg(T, 379.6, 380.6)));
  if (T > Q.ex + .2) dp = mixP({ ...STAGGER, lean: -.4 }, CLUTCH, eio(rg(T, Q.ex + .8, Q.ex + 2)));
  if (T > 394) dp = mixP(CLUTCH, { ...REACH, ra: 1.45, re: .05, la: 1.3, le: .2, lean: -.25 }, eio(rg(T, 394, 395.5)));
  if (T > 412) dp = mixP(dp, KNEELW, eio(rg(T, 412, 413.4)));
  if (T > 469.6) dp = mixP(KNEELW, { ...KNEEL2, ra: 1.3, re: .3 }, eio(rg(T, 469.6, 471)));
  if (brk) dp = mixP({ ...KNEEL2, ra: 1.3, re: .3 }, { ...KNEEL2, la: 1.6, le: 1.4, ht: .45, ra: .9, re: .3 }, eio(rg(T, 477, 479)));
  if (T > 485) dp = { ...KNEEL2, la: 1.2, le: 1.8, ra: 1.1, re: 1.9, ht: .6 + Math.sin(T * 8) * .05 * (1 - rg(T, 492, 496)), lean: .4 };
  if (T > 501) { dp = mixP(dp, POSE.stand, eio(rg(T, 501, 502.6))); dfl = true; }
  if (T > 503) { dx = lerp(-445, -580, eio(rg(T, 503, 507.6))); dp = T < 507.6 ? walkW(dx) : mixP(POSE.stand, CUFF, eio(rg(T, 508, 509.4))); }
  const DF = M('damien', dp, T, { wind: .45 });
  // ---------------- Joy ----------------
  let jx = -150, jp = POSE.stand, jfl = false, ja = sm(rg(T, 335.2, 336.2)), jIgn = 1, jGlow = .9;
  if (T > 408) { jx = lerp(-150, 60, eio(rg(T, 408, 410.6))); jp = T < 410.6 ? runP(jx / 60 * TAU) : jp; }
  if (T > 410.6) jp = mixP(POSE.stand, { ...RAISE, ra: 1.9, re: -.2, la: 1.9, le: -.1, lean: .2 }, eio(rg(T, 410.6, 411.2)));
  if (T > 418) jp = mixP({ ...RAISE, ra: 1.9, re: -.2, la: 1.9, le: -.1, lean: .2 }, { ...KNEEL2, ra: 1.8, re: -.1, la: 1.8, le: 0 }, eio(rg(T, 418, 421)));
  if (T > 428) jp = mixP(jp, COWER, eio(rg(T, 428, 431)));
  if (T > 488) jp = mixP(COWER, { ...KNEEL2, ht: .2 }, eio(rg(T, 488, 491)));
  if (T > 498) jp = mixP({ ...KNEEL2, ht: .2 }, { ...KNEEL2, ht: .2, ra: .6, re: 1.4, la: .7, le: 1.3 }, eio(rg(T, 498, 500)));
  const drain = rg(T, 414, 433); jIgn = 1 - drain; jGlow = lerp(.9, .1, drain);
  const JF = M('joy', jp, T, { wind: .5, vx: T > 408 && T < 410.6 ? 240 : 0 });
  // ---------------- Draconida ----------------
  let cx = 300, cp = POSE.stand, cfl = true, ca = sm(rg(T, 336.4, 337.4));
  if (T > Q.fall) cp = mixP(CLUTCH, KNEELW, eio(rg(T, Q.fall + .4, Q.fall + 1.4))), cp = T < Q.fall + .4 ? mixP(POSE.stand, CLUTCH, eio(rg(T, Q.fall, Q.fall + .4))) : cp;
  if (T > 399) cp = mixP(KNEELW, COWER, eio(rg(T, 399, 402)) * (1 - eio(rg(T, 418, 424)) * .7));
  if (brk) cp = mixP(cp, KNEEL2, eio(rg(T, Q.brk + 1, Q.brk + 3)));
  if (T > 480) { cp = mixP(KNEEL2, POSE.stand, eio(rg(T, 480, 481.6))); }
  if (T > 482) { cx = lerp(300, 215, eio(rg(T, 482, 484.6))); cp = T < 484.6 ? walkW(cx) : mixP(POSE.stand, KNEEL2, eio(rg(T, 484.6, 485.6))); }
  if (T > 498) cp = mixP(KNEEL2, { ...KNEEL2, ra: 1.3, re: .5 }, eio(rg(T, 498, 499.4)));
  const CF = M('draco', cp, T, { wind: .45 });
  // ---------------- Anami ----------------
  let ax = 440, ap = POSE.stand, afl = true, aa = sm(rg(T, 336.4, 337.4)), aW = false, avx = 0;
  if (T > 355.6) { ax = lerp(440, 200, eio(rg(T, 355.6, 358))); ap = T < 358 ? walkW(ax) : DUEL; aW = T > 358; }
  if (T > Q.ex - .1 && T < Q.ex + 1.6) ap = T < Q.ex + .3 ? mixP(DUEL, LUNGE, sw(Q.ex - .1, Q.ex + .5)) : mixP(FLINCH, DUEL, rg(T, Q.ex + .9, Q.ex + 1.6));
  if (T > 397) { ax = lerp(200, 410, eio(rg(T, 397, 399.6))); afl = T > 399.6; ap = T < 399.6 ? walkW(ax) : mixP(POSE.stand, KNEEL2, eio(rg(T, 399.6, 400.6))); aW = false; }
  if (T > 436.4) { afl = true; ax = lerp(410, -235, eio(rg(T, 436.6, 442))); ap = T < 436.6 ? mixP(KNEEL2, POSE.stand, rg(T, 436, 436.6)) : T < 442 ? walkW(ax) : mixP(POSE.stand, KNEEL2, eio(rg(T, 442, 443.2))); }
  if (T > 449) ap = mixP(KNEEL2, { ...KNEEL2, ra: 1.3, re: .25 }, eio(rg(T, 449, 450.6)));
  if (brk) ap = mixP({ ...KNEEL2, ra: 1.3, re: .25 }, KNEEL2, eio(rg(T, Q.brk + 2, Q.brk + 4)));
  if (T > 482) { ap = mixP(KNEEL2, POSE.stand, eio(rg(T, 482, 483.4))); afl = false; }
  if (T > 483.4) { ax = lerp(-235, -95, eio(rg(T, 483.4, 486.6))); ap = T < 486.6 ? walkW(ax) : mixP(POSE.stand, KNEEL2, eio(rg(T, 486.6, 487.6))); afl = false; }
  const AF = M('anami', ap, T, { wand: aW, thread: aW, wind: .45, vx: avx });
  const atip = AF.tip ? figPt(AF.tip, ax, 330, 2.55, afl) : null;
  // ---------------- muñecas, hilos y la maldición ----------------
  const JW = wr(JF, jx, 330, 2.5, jfl), AW = wr(AF, ax, 330, 2.55, afl), CW = wr(CF, cx, 330, 2.4, cfl), DW = wr(DF, dx, 330, 2.55, dfl);
  const JH = figPt(JF.W2, jx, 330, 2.5, jfl);
  const thrA = sm(rg(T, 337, 340)) * (brk ? 1 - sm(rg(T, Q.brk, Q.brk + 2.2)) : 1);
  const pull = fade(T, 380, 412, .6, 2), awake = fade(T, 372, Q.brk, 2, .1), pA = fade(T, 386.6, 388.6, .05, 1.5);
  const tightDA = pull * .9;
  const gold = brk ? sm(rg(T, Q.brk, Q.brk + .5)) : 0, col = gold ? '250,200,100' : '220,40,50', glow = gold ? '255,210,120' : '255,60,60';
  if (thrA > 0) {
    L(1);
    hilo(JW, DW, tw, thrA * .7, { sag: 50, w: 1.6, col, glow, ph: 2 });
    // el hilo D–A: de Joy en adelante, ella lo sujeta en medio
    const grab = T > Q.joyGrab;
    if (!grab) hilo(DW, AW, tw, thrA * (.7 + .3 * Math.max(pull, pA)), { sag: 60 - 50 * tightDA, w: 1.6 + tightDA, col, glow, ph: 1 });
    else { hilo(DW, JH, tw, thrA * .9, { sag: 30, w: 2, col, glow, ph: 1 }); hilo(JH, AW, tw, thrA * .9, { sag: 30, w: 2, col, glow, ph: 3 }); }
    hilo(AW, CW, tw, thrA * .8, { sag: 30, w: 1.4, col, glow, ph: 4 });
    // la vena verde corre hacia Draconida… y luego hacia las manos de Joy
    const toC = awake * (1 - sm(rg(T, 414, 424)) * .85);
    if (!grab) { vein(DW, AW, tw, toC, { sag: 60 - 50 * tightDA, speed: .35 + pull * .5, ph: 1 }); }
    else { vein(DW, JH, tw, awake, { sag: 30, speed: .6, ph: 1 }); vein(AW, JH, tw, awake * sm(rg(T, 412, 416)), { sag: 30, speed: .6, ph: 3 }); }
    vein(AW, CW, tw, toC, { sag: 30, speed: .4 + pull * .4, ph: 4 });
    wristRing(JW, tw, thrA, 6); wristRing(AW, tw, thrA, 6); wristRing(DW, tw, thrA, 6); wristRing(CW, tw, thrA * (.5 + .5 * awake), 5);
  }
  if (brk) { L(1); mode('source-over'); ctx.strokeStyle = `rgba(70,200,120,${.9 * SA})`; ctx.lineWidth = 2.2; ctx.shadowColor = 'rgba(120,255,170,.9)'; ctx.shadowBlur = LOWQ ? 0 : 8 * U * CAM.z; ctx.beginPath(); ctx.ellipse(AW[0], AW[1], 6, 2.8, .3, 0, TAU); ctx.stroke(); ctx.shadowBlur = 0; mode('multiply'); }
  // el estallido: los hilos se vuelven oro y se deshacen; la maldición sube a la luna
  if (brk && T < Q.brk + 3 && rdt > 0) { const n = T < Q.brk + .3 ? 16 : 3; for (const [p, q] of [[JW, DW], [DW, AW], [AW, CW]]) for (let i = 0; i < n * rdt * 10; i++) { const s = hiloPt(p, q, tw, R(), { sag: 40 }); B.motes.spawn(s[0], s[1], rnd(-40, 40), rnd(-90, -30)); } }
  if (T > Q.brk && T < Q.brk + 3) { const mX = 560 - (CAM.x + 190) * .95, p = rg(T, Q.brk + .2, Q.brk + 1.2); for (const src of [JH, CW]) beam(src[0], src[1] - 30, lerp(src[0], mX * 1.2, 1), -620, p, 'green', 1 - rg(T, Q.brk + 1.6, Q.brk + 3), tw, 5, src[0]); }
  if (T > Q.brk && T < Q.brk + .8) { FLASH = Math.max(FLASH, .7 * (1 - rg(T, Q.brk, Q.brk + .8))); FLASHC = '255,236,190'; }
  if (Math.abs(T - Q.brk) < .05 && rdt > 0) { SHK = 12; sparks(JH[0], JH[1], 60, 'gold', 360, 60); }
  // el hechizo de Anami contra Damien (y el hilo se lo devuelve)
  if (atip && T > Q.ex && T < Q.ex + .6) { const p = rg(T, Q.ex, Q.ex + .22); beam(atip[0], atip[1], dx + 20, 200, p, 'red', 1 - rg(T, Q.ex + .3, Q.ex + .6), tw, 4.5, 2); lights.push({ x: dx + 20, y: 200, c: '226,44,40', r: 300, a: 1 - rg(T, Q.ex + .3, Q.ex + .6) }); }
  if (Math.abs(T - (Q.ex + .22)) < .05 && rdt > 0) { impact(dx + 20, 200, 'red', .7); SHK = 7; }
  // la magia de Joy se va en motas doradas
  if (T > 415 && T < 433 && rdt > 0) { const c = figPt(JF.T, jx, 330, 2.5, jfl); const r = 18 * (1 - drain * .6); for (let i = 0; i < r * dt; i++) B.motes.spawn(c[0] + rnd(-30, 30), c[1] + rnd(-20, 60), rnd(-30, 30), rnd(-120, -60)); }
  // luz verde en el cuerpo de Draconida y de Joy
  const cPain = awake * (1 - sm(rg(T, 414, 426)) * .7), jPain = fade(T, Q.joyGrab, Q.brk, .5, .2);
  if (cPain > 0) lights.push({ x: cx, y: 200, c: '90,240,130', r: 320, a: .8 * cPain });
  if (jPain > 0) lights.push({ x: jx, y: 180, c: '90,240,130', r: 360, a: jPain });
  if (brk) lights.push({ x: 0, y: -100, c: '255,214,160', r: 700, a: .7 * fade(T, Q.brk, Q.brk + 5, .1, 3) });
  // aurores
  const ua = fade(T, 497, 540, 2, 2);
  if (ua > 0) { for (let i = 0; i < 2; i++) { const x = lerp(-SW * .9 - i * 90, -760 - i * 110, eo(rg(T, 497, 507))), y = 140 + Math.sin(T * 5 + i * 2) * 4; L(.85); glowAt(x, y, 110, '255,200,120', .55 * ua); } for (const [o, s] of [[0, 2.4], [-120, 2.35]]) { const ux = lerp(-SW * .85 + o, -730 + o, eo(rg(T, 500, 507))); auror(rg(T, 500, 507) < 1 ? walkW(ux) : POSE.stand, ux, 330, s, false, T, { a: sm(rg(T, 500, 501.5)), light: [{ x: ux + 30, y: 200, c: '255,200,120', r: 260, a: .7 }] }); } }
  // ---------------- dibujo ----------------
  appar(-150, 330, rg(T, 334, 336.4), 1, 1); appar(300, 330, rg(T, 335, 337.4), 1, 2); appar(440, 330, rg(T, 335.2, 337.6), 1, 3);
  const key = lights.reduce((m, l) => (!m || l.a > m.a) ? l : m, null), sh = key ? { x: key.x, y: key.y, a: key.a } : null;
  dm('damien', DF, dx, 330, 2.55, dfl, T, { light: lights, shadowFrom: sh, glow: .35, ignite: .4 });
  dm('draco', CF, cx, 330, 2.4, cfl, T, { a: ca, light: lights, shadowFrom: sh, glow: .9 });
  dm('anami', AF, ax, 330, 2.55, afl, T, { a: aa, light: lights, shadowFrom: sh, green: 1 });
  dm('joy', JF, jx, 330, 2.5, jfl, T, { a: ja, light: lights, shadowFrom: sh, glow: jGlow, ignite: Math.max(.05, jIgn) });
  chestPain(DF, dx, 330, 2.55, dfl, T, fade(T, 372, Q.brk, 2, .3));
  chestPain(CF, cx, 330, 2.4, cfl, T, cPain * .9);
  chestPain(JF, jx, 330, 2.5, jfl, T, jPain);
}
