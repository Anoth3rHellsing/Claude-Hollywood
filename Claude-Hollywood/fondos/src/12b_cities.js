/* ================================ LONDRES ================================ */
CITIES.push({
  id: 'londres', name: 'Londres', country: 'Reino Unido', coord: '51,51° N · 0,13° O', accent: C('#9a2a2a'),
  focus: 110, focusR: 520, haze: C('#c9c8c2'), winC: C('#565a66'), gran: 1.2,
  sky: { day: [C('#99a2ac'), C('#e4dac6')], night: [C('#1c2236'), C('#4c4a5c')], hor: .58, sun: [420, -230, 28, C('#f6eed8')], moon: [-480, -300, 16, C('#eae6da')], stars: false },
  night: lt => sm(rg(lt, .45, .95)) * .78, nightTint: C('#262a40'),
  pan: [-320, 300], zoom: 1.05, cloudY: [-440, -230], clouds: 5, cloud: C('#dcd8d0'),
  water: { y: 226, p: .56, c: C('#8c9590'), cN: C('#1d2232'), after: 2, lights: [-640, -380, -120, 140, 420] },
  build() {
    const L0 = new Lay(.12, { name: 'lejos', haze: .62 }), L1 = new Lay(.28, { name: 'puente-torre', haze: .4 }), L2 = new Lay(.45, { name: 'westminster', haze: .18 }), L3 = new Lay(.72, { name: 'puente', haze: .05 }), L4 = new Lay(1, { name: 'cerca', haze: 0, sway: .0012 });
    const far = C('#b8b8b6');
    seed(21); row(L0, -1100, 1100, 172, { w: [24, 46], h: [20, 60], cols: [far, shadeC(far, -.05)], roof: 'flat', rows: 0, side: 0, cornice: false });
    dome(L0, -480, 150, 38, C('#c4c2bc'), { drum: 26, cross: true }); L0.solid(rect(-540, 150, 120, 26), C('#c4c2bc'));
    L0.solid([[300, 172], [328, -150], [356, 172]], C('#a9b2b8')); L0.line([[328, -150], [328, -170]], 1, C('#8a9298'));
    L0.solid([[420, 172], [414, 96], [428, 50], [446, 50], [460, 96], [454, 172]], C('#a0aaa8'));
    for (const [x, h] of [[200, 150], [240, 120], [500, 110], [-300, 90]]) tower(L0, x, 172, 30, h, C('#b4b6b6'), { side: 0, fl: 7, ww: 2, gap: 5, lit: .4 });
    /* Tower Bridge: torres góticas, pasarelas altas, cadenas */
    const tb = (x) => { L1.solid(rect(x - 26, 6, 52, 196), C('#cfc6b2')); L1.trim([[x - 30, 8], [x, -46], [x + 30, 8]], C('#6e7a80')); for (const dx of [-26, 26]) L1.trim([[dx + x - 6, 8], [dx + x, -18], [dx + x + 6, 8]], C('#6e7a80')); for (let r = 0; r < 4; r++) L1.win(x - 8, 30 + r * 38, 16, 24, { arch: true, lit: .6 }); L1.trim(rect(x - 34, 120, 68, 8), C('#bfb6a0')); };
    tb(560); tb(780);
    for (const y of [26, 36]) L1.trim(rect(586, y, 168, 6), C('#7d9fb8'));
    L1.trim(rect(500, 150, 340, 9), C('#7d9fb8'));
    L1.line(sag([340, 150], [534, 60], 30), 2.2, C('#5f8fb0')); L1.line(sag([806, 60], [1000, 150], 30), 2.2, C('#5f8fb0'));
    seed(22); row(L1, -1050, 470, 198, { w: [40, 70], h: [40, 80], cols: [C('#c2b49a'), C('#b8a68c')], roof: 'flat', floorH: 14, winW: 4, winH: 7, winGap: 10, side: 0, cornice: false, lit: .5 });
    row(L1, 860, 1100, 198, { w: [40, 70], h: [40, 80], cols: [C('#c2b49a'), C('#b8a68c')], roof: 'flat', floorH: 14, winW: 4, winH: 7, winGap: 10, side: 0, cornice: false, lit: .5 });
    /* Palacio de Westminster: fachada gótica larga, torre Victoria y torre del reloj */
    const st = C('#d6c494'), stD = shadeC(st, -.12), rf = C('#6f7f7c');
    L2.solid(rect(-950, 98, 1020, 110), st); L2.trim([[-950, 100], [-930, 80], [50, 80], [70, 100]], rf);
    pinnacles(L2, -945, 65, 98, 16, 22, stD);
    for (let x = -940; x < 60; x += 16) { L2.line([[x, 100], [x, 208]], .8, stD, { ink: 0 }); for (let r = 0; r < 3; r++) L2.win(x + 4, 112 + r * 30, 7, 18, { arch: true, lit: .55 }); }
    L2.solid(rect(-860, -110, 86, 318), st); pinnacles(L2, -860, -774, -110, 28, 30, stD); for (let r = 0; r < 7; r++) for (let k = 0; k < 3; k++) L2.win(-850 + k * 26, -84 + r * 40, 12, 26, { arch: true, lit: .5 });
    const ex = 120;   /* torre Elizabeth */
    L2.shade([[ex + 23, -20], [ex + 33, -16], [ex + 33, 208], [ex + 23, 208]], shadeC(st, -.25));
    L2.solid(rect(ex - 23, -20, 46, 228), st); for (let r = 0; r < 6; r++) L2.win(ex - 6, 20 + r * 30, 12, 18, { arch: true, lit: .5 }); for (const dx of [-17, 17]) L2.line([[ex + dx, -20], [ex + dx, 208]], 1, stD);
    L2.solid(rect(ex - 30, -82, 60, 64), st); L2.trim(ell(ex, -50, 22, 22, 26), C('#efe6cf'));
    for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; L2.line([[ex + Math.cos(a) * 17, -50 + Math.sin(a) * 17], [ex + Math.cos(a) * 20, -50 + Math.sin(a) * 20]], .9, C('#3a3028')); }
    L2.line([[ex, -50], [ex + 9, -56]], 1.3, C('#2a221c')); L2.line([[ex, -50], [ex - 2, -64]], 1, C('#2a221c'));
    L2.solid(rect(ex - 26, -122, 52, 40), st); for (let k = 0; k < 3; k++) L2.win(ex - 20 + k * 15, -116, 10, 26, { arch: true, lit: .9, warm: 1 });
    L2.trim([[ex - 28, -122], [ex, -196], [ex + 28, -122]], C('#56645e')); L2.line([[ex, -196], [ex, -222]], 1.6, C('#c9a24a'));
    pinnacles(L2, ex - 26, ex + 26, -122, 52, 26, stD); pinnacles(L2, ex - 30, ex + 30, -82, 60, 16, stD);
    seed(23); row(L2, 240, 1100, 208, { w: [50, 80], h: [60, 110], cols: [C('#cdbfa2'), C('#d6c9ad'), C('#c4b292')], roof: 'flat', floorH: 18, winW: 6, winH: 10, winGap: 13, side: 6, chim: 3, lit: .55 });
    L2.solid(rect(-1100, 208, 2200, 22), C('#b8ad96'), { ink: 0 }); trees(L2, 180, 1100, 208, { gap: [70, 120], h: [40, 56], kind: 'round', cols: [C('#86906a'), C('#7a8762')] });
    /* puente de Westminster, pintado de verde */
    arches(L3, -1300, 1300, 262, 296, 7, C('#5f8a72'), { th: 12, rise: .55, pier: .12 }); railing(L3, -1300, 1300, 256, C('#2e4a3a'), 6, 9); lamps(L3, -1240, 1300, 256, 170, 30, C('#26352c'));
    seed(24); for (let i = 0; i < 16; i++) person(L3, rnd(-1100, 1200), 256, rnd(14, 17), C('#2e2a30'), { coat: 1, umb: R() < .5 ? pick([C('#2b2b33'), C('#8a2b2b'), C('#2b4a6a')]) : 0 });
    /* malecón del Támesis */
    const PY = 412; L4.solid([[-1400, PY], [1400, PY], [1400, 560], [-1400, 560]], C('#9a9a94'), { grad: .5 }); L4.trim(rect(-1400, PY - 12, 2800, 13), C('#b6b4ac')); L4.shade(rect(-1400, PY + 1, 2800, 7), C('#7c7c78'));
    seed(25); for (let y = PY + 24; y < 560; y += 24) { L4.line([[-1400, y], [1400, y]], .7, C('#76766f'), { ink: 0 }); const off = ((y / 24) % 2) * 34; for (let x = -1400 + off; x < 1400; x += 68) L4.line([[x, y - 24], [x, y]], .7, C('#76766f'), { ink: 0 }); }
    for (let x = -1300; x < 1350; x += 280) { L4.line([[x, PY - 12], [x, PY - 80]], 3, C('#2a2c2a')); L4.trim(rect(x - 6, PY - 92, 12, 14), C('#2a2c2a')); L4.glow(x, PY - 86, 3.4, C('#ffd79a')); L4.trim(rect(x - 8, PY - 26, 16, 14), C('#2a2c2a')); }
    for (const x of [-700, 380]) { L4.trim(rect(x, PY - 34, 46, 4), C('#4a3a2c')); L4.trim(rect(x, PY - 46, 46, 3), C('#4a3a2c')); L4.line([[x + 4, PY - 34], [x + 4, PY - 12]], 2, C('#2a2624')); L4.line([[x + 42, PY - 34], [x + 42, PY - 12]], 2, C('#2a2624')); }
    L4.trim(rect(-120, PY - 50, 18, 38), C('#b8302a')); L4.trim(ell(-111, PY - 50, 10, 6, 10, PI, TAU), C('#a02822'));
    L4.tree(-1150, PY - 12, 280, 'round', C('#7c8a5a')); L4.tree(1120, PY - 12, 260, 'round', C('#86905e'));
    seed(26); for (let i = 0; i < 9; i++) person(L4, rnd(-1100, 1200), PY - 10, rnd(42, 50), pick([C('#2e2a30'), C('#33384a'), C('#3a3030')]), { coat: 1, umb: R() < .6 ? pick([C('#22222a'), C('#8a2b2b'), C('#2b4a6a'), C('#d9b26a')]) : 0 });
    return [L0, L1, L2, L3, L4];
  },
  live: {
    3: (g, st) => { const T = LT(.72); for (const [sp, off, col, big] of [[34, 0, C('#c0302a'), 1], [26, 900, C('#1e1e22'), 0], [40, 1700, C('#c0302a'), 1]]) { const x = ((st.t * sp + off) % 2700) - 1350; liveShape(g, st, T, big ? [rect(x - 26, 222, 52, 32), rect(x - 26, 216, 52, 6)] : [[[x - 16, 254], [x - 14, 242], [x - 6, 236], [x + 8, 236], [x + 14, 244], [x + 16, 254]]], col); if (big) { liveShape(g, st, T, [rect(x - 22, 226, 44, 6), rect(x - 22, 240, 44, 6)], st.night > .4 ? C('#ffd690') : C('#e6dcc6')); } } },
    4: (g, st) => { rain(g, st, .22); birds(g, st, 6, -260, 22, 8); },
  },
});

/* ================================ NUEVA YORK ================================ */
CITIES.push({
  id: 'nyc', name: 'Nueva York', country: 'Estados Unidos', coord: '40,71° N · 74,01° O', accent: C('#c2913a'),
  focus: 0, focusR: 560, haze: C('#e2c6a6'), winC: C('#4e5468'), gran: 1,
  sky: { day: [C('#6f86b0'), C('#f0b98a')], night: [C('#0f1430'), C('#4c3f62')], hor: .6, sun: [-560, 40, 30, C('#ffc890')], moon: [520, -340, 15, C('#f0ecdc')], stars: true },
  night: lt => sm(rg(lt, .15, .75)), nightTint: C('#20244a'),
  pan: [-300, 320], zoom: 1.05, cloudY: [-440, -300], clouds: 3, cloud: C('#efcfb6'),
  water: { y: 232, p: .55, c: C('#6f7c90'), cN: C('#12162c'), after: 2, lights: [-560, -300, -60, 170, 420, 660] },
  build() {
    const L0 = new Lay(.1, { name: 'lejos', haze: .66 }), L1 = new Lay(.25, { name: 'midtown', haze: .34 }), L2 = new Lay(.44, { name: 'downtown', haze: .14 }), L3 = new Lay(.72, { name: 'puente', haze: .04 }), L4 = new Lay(1, { name: 'muelle', haze: 0, sway: .0012 });
    seed(31); for (let x = -1100; x < 1100; x += rnd(26, 44)) tower(L0, x, 176, rnd(22, 36), rnd(60, 190), C('#c9b9b0'), { side: 0, fl: 7, ww: 2, gap: 5, lit: .5, sparse: .3 });
    /* Midtown: Empire State y Chrysler entre muchas torres */
    const tones = [C('#b9a898'), C('#a89a92'), C('#c4b2a0'), C('#9c948e'), C('#b0a296')];
    seed(32); for (let x = -1050; x < 1050; x += rnd(40, 70)) { if (Math.abs(x + 140) < 70 || Math.abs(x - 160) < 50) continue; tower(L1, x, 196, rnd(34, 58), rnd(110, 300), pick(tones), { fl: 8, ww: 2.6, gap: 5.6, lit: .55, crown: pick(['box', 'flat', 'steps', 'slant', 'box']), mast: R() < .2 ? rnd(14, 30) : 0, side: rnd(4, 10) }); }
    const es = C('#c8b9a4'), ex = -140;   /* Empire State */
    L1.shade([[ex + 40, -100], [ex + 52, -96], [ex + 52, 196], [ex + 40, 196]], shadeC(es, -.3));
    L1.solid(rect(ex - 40, -100, 80, 296), es); for (let r = 0; r < 30; r++) for (let k = 0; k < 11; k++) L1.win(ex - 36 + k * 7, -92 + r * 9.6, 3, 5.5, { lit: .6 });
    L1.solid(rect(ex - 30, -160, 60, 62), es); for (let r = 0; r < 6; r++) for (let k = 0; k < 8; k++) L1.win(ex - 27 + k * 7, -154 + r * 9.6, 3, 5.5, { lit: .6 });
    L1.solid(rect(ex - 18, -196, 36, 38), es); L1.solid(rect(ex - 10, -222, 20, 28), shadeC(es, .06)); L1.solid([[ex - 6, -222], [ex - 3, -262], [ex + 3, -262], [ex + 6, -222]], shadeC(es, .1));
    for (let k = -1; k <= 1; k++) L1.line([[ex + k * 6, -196], [ex + k * 6, -158]], .8, shadeC(es, -.25), { ink: 0 });
    L1.line([[ex, -262], [ex, -306]], 1.6, C('#6a6058')); L1.glow(ex, -306, 1.8, C('#ff5a4a')); L1.glow(ex, -228, 4, C('#d8f0ff'));
    const cx2 = 160, cc = C('#cfc7ba');   /* Chrysler: corona de arcos con ventanas triangulares */
    L1.solid(rect(cx2 - 30, -40, 60, 236), cc); for (let r = 0; r < 24; r++) for (let k = 0; k < 8; k++) L1.win(cx2 - 26 + k * 7, -34 + r * 9.6, 3, 5.5, { lit: .6 });
    L1.solid(rect(cx2 - 22, -64, 44, 26), cc);
    for (let i = 0; i < 6; i++) { const r = 22 - i * 3.4, y = -64 - i * 13; const arc = ell(cx2, y, r, 16, 16, PI, TAU); L1.trim([[cx2 - r, y], ...arc, [cx2 + r, y]], shadeC(C('#d8d4cc'), i % 2 ? .1 : -.04)); for (let k = -2; k <= 2; k++) L1.win(cx2 + k * r * .36 - 1.4, y - 9, 2.8, 5, { lit: .95, c: C('#3a3e52') }); }
    L1.line([[cx2, -142], [cx2, -210]], 1.8, C('#b8b6b0'));
    /* Downtown, ladrillo y depósitos de agua */
    seed(33); for (let x = -1080; x < 1080; x += rnd(44, 80)) { const w = rnd(40, 74), h = rnd(70, 170); tower(L2, x, 214, w, h, pick([C('#a87a64'), C('#b68e72'), C('#9a7466'), C('#c8b8a0'), C('#8e8a88')]), { fl: 12, ww: 4.5, gap: 9, lit: .55, crown: pick(['flat', 'flat', 'box']), tank: R() < .45, side: rnd(4, 12), bands: R() < .3 }); }
    L2.solid(rect(-1100, 214, 2200, 18), C('#7e7468'), { ink: 0 });
    for (let x = -1080; x < 1100; x += 22) L2.line([[x, 214], [x, 232]], 1.2, C('#4a4038'), { ink: 0 });
    /* puente de Brooklyn: torres de piedra con arcos ojivales y cables */
    const bc = C('#b49c80'), cable = C('#4a4642');
    const btower = x => { L3.solid([[x - 40, 300], [x - 36, -60], [x + 36, -60], [x + 40, 300]], bc); L3.trim(rect(x - 44, -72, 88, 14), shadeC(bc, .12)); for (const dx of [-16, 16]) { const P = [[dx + x - 11, 120]]; for (let i = 0; i <= 12; i++) { const a = PI + i / 12 * PI; P.push([dx + x + Math.cos(a) * 11, 40 + Math.sin(a) * 30]); } P.push([dx + x + 11, 120]); L3.trim(P, C('#3a3a48')); } L3.trim(rect(x - 44, 120, 88, 10), shadeC(bc, -.1)); for (let r = 0; r < 4; r++) L3.line([[x - 38, 150 + r * 30], [x + 38, 150 + r * 30]], .7, shadeC(bc, -.3), { ink: 0 }); };
    btower(-420); btower(560);
    L3.solid(rect(-1300, 250, 2600, 14), C('#5e5450')); L3.trim(rect(-1300, 244, 2600, 6), C('#7a6e66'));
    const main = [[-1300, 240], ...sag([-1300, 240], [-420, -56], -120, 24).slice(1), ...sag([-420, -56], [560, -56], 230, 40).slice(1), ...sag([560, -56], [1300, 240], -100, 20).slice(1)];
    L3.line(sag([-420, -56], [560, -56], 230, 40), 2.4, cable); L3.line(sag([-1300, 236], [-420, -56], -60, 20), 2.4, cable); L3.line(sag([560, -56], [1300, 236], -60, 20), 2.4, cable);
    const sagY = x => { const t = (x + 420) / 980; return -56 + 230 * 4 * t * (1 - t); };
    for (let x = -400; x < 545; x += 14) L3.line([[x, sagY(x)], [x, 246]], .6, cable, { ink: 0 });
    for (const [x0, dir] of [[-420, 1], [-420, -1], [560, 1], [560, -1]]) for (let k = 1; k <= 7; k++) L3.line([[x0, -40], [x0 + dir * k * 52, 246]], .5, cable, { ink: 0 });
    lamps(L3, -1250, 1300, 244, 150, 22, C('#2c2826'));
    /* muelle de Brooklyn en primer plano */
    const PY = 420; L4.solid([[-1400, PY], [1400, PY], [1400, 560], [-1400, 560]], C('#6e5a4a'), { grad: .6 });
    for (let x = -1400; x < 1400; x += 22) L4.line([[x, PY], [x, 560]], .8, C('#4a3a30'), { ink: 0 });
    L4.trim(rect(-1400, PY - 4, 2800, 6), C('#8a7462')); railing(L4, -1400, 1400, PY - 2, C('#2a2624'), 16, 28);
    for (let x = -1300; x < 1350; x += 300) { L4.line([[x, PY], [x, PY - 96]], 3, C('#26221f')); L4.line([[x, PY - 96], [x + 10, PY - 100]], 2, C('#26221f')); L4.glow(x + 11, PY - 96, 3.6, C('#ffd59a')); }
    for (const x of [-860, 200, 940]) { L4.trim(rect(x, PY - 34, 60, 5), C('#5a4636')); L4.trim(rect(x, PY - 50, 60, 4), C('#5a4636')); L4.line([[x + 6, PY - 34], [x + 6, PY - 4]], 2.2, C('#26221f')); L4.line([[x + 54, PY - 34], [x + 54, PY - 4]], 2.2, C('#26221f')); }
    L4.tree(-1180, PY - 2, 270, 'round', C('#6e7f52')); L4.tree(1160, PY - 2, 250, 'round', C('#7a8656'));
    seed(34); for (let i = 0; i < 10; i++) person(L4, rnd(-1150, 1200), PY - 2, rnd(42, 50), pick([C('#262228'), C('#36384a'), C('#4a2e2e')]), { coat: R() < .5 });
    return [L0, L1, L2, L3, L4];
  },
  live: {
    3: (g, st) => { if (st.night < .2) return; const T = LT(.72); g.save(); g.setTransform(T.s, 0, 0, T.s, T.ox, T.oy); for (let i = 0; i < 14; i++) { const dir = i % 2 ? 1 : -1, x = (((st.t * 60 * dir + i * 190) % 2600) + 2600) % 2600 - 1300; g.globalAlpha = st.night; g.fillStyle = dir > 0 ? 'rgba(255,236,190,.95)' : 'rgba(255,90,70,.9)'; g.beginPath(); g.arc(x, 252, 1.6, 0, TAU); g.fill(); } g.restore(); },
    4: (g, st) => birds(g, st, 7, -250, 30, 11),
  },
});
