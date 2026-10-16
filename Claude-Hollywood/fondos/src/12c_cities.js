/* ================================ TOKIO ================================ */
/* letreros verticales de neón con signos inventados (sin marcas ni texto real) */
function neonSign(L, x, y, w, h, col) { L.trim(rect(x, y, w, h), C('#2a2430')); for (let k = 0; k < Math.floor(h / (w * .9)); k++) { const yy = y + 3 + k * w * .9; L.win(x + 2, yy, w - 4, w * .7, { lit: 1, c: shadeC(col, -.4), warm: 0 }); } L.glow(x + w / 2, y + h / 2, w * .5, col); }
CITIES.push({
  id: 'tokio', name: 'Tokio', country: 'Japón', coord: '35,68° N · 139,69° E', accent: C('#c2302f'),
  focus: 40, focusR: 560, haze: C('#9aa0bc'), hazeP: C('#8e90b4'), winC: C('#3e4258'), gran: .9,
  sky: { day: [C('#4a5a8c'), C('#e2a6a0')], night: [C('#0d1030'), C('#3c2c56')], hor: .62, sun: null, moon: [-420, -330, 20, C('#f2eee2')], stars: true },
  night: lt => .72 + .28 * sm(rg(lt, 0, .5)), nightTint: C('#1a1c46'),
  pan: [-320, 320], zoom: 1.05, cloudY: [-430, -320], clouds: 2, cloud: C('#b8b0c8'), cloudA: .6,
  build() {
    const L0 = new Lay(.06, { name: 'fuji', haze: .5, shadow: .4 }), L1 = new Lay(.22, { name: 'torres', haze: .3 }), L2 = new Lay(.45, { name: 'barrio', haze: .12 }), L3 = new Lay(.72, { name: 'tren', haze: .04 }), L4 = new Lay(1, { name: 'calle', haze: 0, sway: .0015 });
    /* el Fuji con su nieve */
    const fj = x => -300 * Math.max(0, 1 - Math.pow(Math.abs(x - 520) / 520, 1.25));
    L0.solid(ridge(-200, 1200, 150, fj, 120), C('#6c6a92'), { land: true, ink: 0 });
    const snow = [[520 - 120, 150 + fj(400)]]; for (let x = 400; x <= 640; x += 12) snow.push([x, 150 + fj(x) - 1]); for (let x = 640; x >= 400; x -= 20) snow.push([x, 150 + fj(x) + 22 + Math.abs(Math.sin(x * .09)) * 26]);
    L0.trim(snow, C('#eceaf4'));
    L0.solid(ridge(-1100, 1100, 170, x => peaks(x, [[-600, 50, 300], [-150, 30, 260], [900, 40, 300]])), C('#5e5c84'), { land: true, ink: 0 });
    /* torres con luces rojas y la Torre de Tokio */
    seed(41); for (let x = -1050; x < 1050; x += rnd(40, 70)) { if (Math.abs(x - 180) < 70) continue; tower(L1, x, 190, rnd(30, 52), rnd(90, 250), pick([C('#7a7c96'), C('#6e7090'), C('#8486a0')]), { fl: 8, ww: 2.4, gap: 5.2, lit: .6, crown: pick(['box', 'flat', 'slant']), mast: R() < .4 ? rnd(10, 26) : 0, side: rnd(4, 9) }); }
    const tt = C('#d8582e'), tw = C('#ece6e0');
    const TT = latticeTower(L1, 180, 196, 470, [[0, 74], [.08, 56], [.3, 26], [.55, 13], [.8, 6], [.93, 3.5]], tt, { arch: false, plats: [[.3, 12], [.6, 8]], legW: .34, bands: [[.3, .6, 4, 6], [.6, .93, 2, 10]] });
    for (const [a, b] of [[.12, .17], [.38, .44], [.7, .76], [.86, .9]]) { const wa = TT(a), wb = TT(b); L1.trim([[180 - wb, 196 - b * 470], [180 + wb, 196 - b * 470], [180 + wa, 196 - a * 470], [180 - wa, 196 - a * 470]], tw); }
    for (let i = 0; i < 30; i++) { const hf = rnd(.04, .93), w = TT(hf); L1.glow(180 + (R() < .5 ? -1 : 1) * w * rnd(.5, 1), 196 - hf * 470, 1.6, C('#ffb070')); }
    /* barrio denso con letreros de neón */
    seed(42); const neon = [C('#ff4f9a'), C('#4fe0ff'), C('#ffcf4f'), C('#ff6a4a'), C('#9a7bff'), C('#5fffb0')];
    for (let x = -1080; x < 1080;) { const w = rnd(44, 76), h = rnd(80, 170), c = pick([C('#5a5468'), C('#6a6070'), C('#4e4c60'), C('#7a6a6a')]); tower(L2, x, 214, w, h, c, { fl: 13, ww: 6, gap: 11, lit: .7, crown: pick(['flat', 'box']), side: rnd(4, 10), bands: R() < .4 });
      if (R() < .75) neonSign(L2, x + rnd(4, w - 18), 214 - h + rnd(10, 40), rnd(10, 14), rnd(46, 90), pick(neon));
      if (R() < .4) { const bw = rnd(26, 40); L2.trim(rect(x + 4, 214 - h - 22, bw, 16), C('#2a2430')); L2.glow(x + 4 + bw / 2, 214 - h - 14, bw * .35, pick(neon)); }
      for (let k = 0; k < 3; k++) if (R() < .5) L2.trim(rect(x + rnd(4, w - 12), 214 - rnd(30, h - 10), 9, 6), C('#8a8890'));
      x += w + rnd(0, 6); }
    /* viaducto del tren con arcos de ladrillo */
    const vy = 244; L3.solid(rect(-1400, vy, 2800, 18), C('#6a5a56')); L3.trim(rect(-1400, vy - 6, 2800, 6), C('#857472'));
    for (let x = -1400; x < 1400; x += 92) { const P = [[x + 8, vy + 18]]; for (let i = 0; i <= 12; i++) { const a = PI + i / 12 * PI; P.push([x + 46 + Math.cos(a) * 36, vy + 66 + Math.sin(a) * 40]); } P.push([x + 84, vy + 18]); L3.solid([[x, vy + 18], [x + 92, vy + 18], [x + 92, 360], [x, 360]], C('#7a5e52')); L3.trim(P.concat([[x + 82, 360], [x + 10, 360]]), C('#2c2230')); L3.win(x + 22, vy + 70, 48, 30, { lit: .9, warm: 1 }); }
    for (let x = -1380; x < 1400; x += 60) { L3.line([[x, vy - 6], [x, vy - 46]], 1.6, C('#3a3438')); L3.line([[x - 8, vy - 40], [x + 8, vy - 40]], 1.2, C('#3a3438')); }
    L3.line([[-1400, vy - 38], [1400, vy - 38]], .8, C('#3a3438')); L3.line([[-1400, vy - 32], [1400, vy - 32]], .8, C('#3a3438'));
    /* calle: farolillos rojos, máquina expendedora, cerezo en flor que enmarca */
    const PY = 430; L4.solid([[-1400, PY], [1400, PY], [1400, 560], [-1400, 560]], C('#4a4450'), { grad: .5 });
    for (let x = -1400; x < 1400; x += 120) L4.trim(rect(x, PY + 50, 60, 5), C('#d8d4d0'));
    seed(43); for (let x = -1300; x < 1300; x += rnd(120, 200)) { L4.line([[x, PY - 120], [x + 160, PY - 128]], .8, C('#2a2428')); for (let k = 0; k < 4; k++) { const lx = x + 20 + k * 36, ly = PY - 116 - k * 2 + 6; L4.line([[lx, ly - 8], [lx, ly]], .6, C('#2a2428')); L4.trim(ell(lx, ly + 8, 7, 9, 12), C('#c8302c')); L4.glow(lx, ly + 8, 5, C('#ff7a4a')); } }
    for (const x of [-520, 640]) { L4.trim(rect(x, PY - 70, 40, 70), C('#d8dce4')); L4.win(x + 5, PY - 62, 30, 34, { lit: 1, c: C('#4a5a7a') }); L4.trim(rect(x + 8, PY - 22, 24, 8), C('#2a2a34')); L4.glow(x + 20, PY - 45, 14, C('#d8f2ff')); }
    const blossom = (cx, cy, r) => { for (let i = 0; i < 9; i++) L4.tree(cx + rnd(-r, r), cy + rnd(-r * .3, r * .4), rnd(r * .6, r), 'round', pick([C('#f2b8c8'), C('#e8a2b8'), C('#f6cad4')])); };
    L4.line([[-1400, PY - 300], [-1150, PY - 260], [-1000, PY - 300], [-900, PY - 330]], 7, C('#3a2a2a')); L4.line([[-1200, PY - 270], [-1100, PY - 360]], 5, C('#3a2a2a')); blossom(-1080, PY - 330, 110);
    L4.line([[1400, PY - 320], [1180, PY - 290], [1040, PY - 330]], 7, C('#3a2a2a')); blossom(1120, PY - 330, 100);
    seed(44); for (let i = 0; i < 12; i++) person(L4, rnd(-1100, 1150), PY + 2, rnd(42, 50), pick([C('#2a2430'), C('#3a3446'), C('#4a2e3a')]), { coat: R() < .5, umb: R() < .2 ? C('#e8e4ec') : 0 });
    return [L0, L1, L2, L3, L4];
  },
  live: {
    2: (g, st) => { /* el neón parpadea */ const T = LT(.45); g.save(); g.setTransform(T.s, 0, 0, T.s, T.ox, T.oy); g.globalCompositeOperation = 'lighter'; seed(9); for (let i = 0; i < 18; i++) { const x = rnd(-1000, 1000), y = rnd(60, 180), f = Math.sin(st.t * rnd(3, 9) + i) > .6 ? 1 : .2; g.globalAlpha = .25 * f * st.night; g.fillStyle = pick(['#ff4f9a', '#4fe0ff', '#ffcf4f']); g.fillRect(x, y, rnd(6, 12), rnd(20, 40)); } g.restore(); },
    3: (g, st) => { /* tren que cruza el viaducto */ const T = LT(.72), x = ((st.t * 120) % 3600) - 1800; const cars = []; for (let k = 0; k < 6; k++) cars.push(rect(x + k * 86, 206, 82, 32)); liveShape(g, st, T, cars, C('#c8ccd2')); liveShape(g, st, T, [rect(x, 228, 6 * 86, 4)], C('#3a9a5a')); g.save(); g.setTransform(T.s, 0, 0, T.s, T.ox, T.oy); for (let k = 0; k < 6; k++) for (let j = 0; j < 6; j++) { g.fillStyle = st.night > .4 ? 'rgba(255,236,190,.95)' : 'rgba(60,70,90,.8)'; g.fillRect(x + k * 86 + 6 + j * 13, 212, 9, 10); } g.restore(); },
  },
});

/* ================================ ROMA ================================ */
CITIES.push({
  id: 'roma', name: 'Roma', country: 'Italia', coord: '41,90° N · 12,50° E', accent: C('#a8502a'),
  focus: -120, focusR: 560, haze: C('#e8cfaa'), winC: C('#6a4e40'), gran: 1.2,
  sky: { day: [C('#86a8cc'), C('#f6d8a8')], night: [C('#1e2244'), C('#8a5a5a')], hor: .58, sun: [520, -150, 28, C('#fff0c8')], moon: [-520, -320, 16, C('#f4ecd8')], stars: true },
  night: lt => sm(rg(lt, .55, 1)) * .7, nightTint: C('#3a2c44'),
  pan: [-300, 300], zoom: 1.05, cloudY: [-430, -290], clouds: 3, cloud: C('#f6e8d6'),
  build() {
    const L0 = new Lay(.1, { name: 'colinas', haze: .55 }), L1 = new Lay(.26, { name: 'cupula', haze: .3 }), L2 = new Lay(.45, { name: 'coliseo', haze: .12 }), L3 = new Lay(.7, { name: 'tejados', haze: .04 }), L4 = new Lay(1, { name: 'terraza', haze: 0, sway: .0012 });
    L0.solid(ridge(-1100, 1100, 150, x => peaks(x, [[-500, 60, 340], [380, 50, 360]])), C('#a4a888'), { land: true, ink: 0 });
    seed(51); trees(L0, -1050, 1050, 150 - 20, { gap: [40, 90], h: [30, 46], kind: 'pine', cols: [C('#7c8a6a'), C('#86906e')] });
    /* San Pedro: cúpula con nervios sobre su tambor */
    const sp = C('#ece4d4'); L1.solid(rect(300, 110, 300, 80), C('#e6dcc8')); for (let k = 0; k < 14; k++) L1.line([[306 + k * 21, 112], [306 + k * 21, 188]], 1, C('#c8bca4'), { ink: 0 });
    L1.trim(rect(296, 104, 308, 8), C('#f2ecdc')); for (let x = 300; x < 600; x += 18) L1.trim(rect(x, 94, 6, 10), C('#e2d8c2'));
    dome(L1, 450, 104, 82, C('#9eb0b4'), { drum: 52, drumC: sp, tall: 1.12, cross: true });
    seed(52); row(L1, -1050, 280, 196, { w: [30, 56], h: [30, 70], cols: [C('#d8b48a'), C('#cc9c72'), C('#e0c09a')], roof: 'tile', roofC: C('#b8643c'), floorH: 13, winW: 4, winH: 7, winGap: 10, side: 0, cornice: false, lit: .5 });
    row(L1, 620, 1050, 196, { w: [30, 56], h: [30, 70], cols: [C('#d8b48a'), C('#cc9c72'), C('#e0c09a')], roof: 'tile', roofC: C('#b8643c'), floorH: 13, winW: 4, winH: 7, winGap: 10, side: 0, cornice: false, lit: .5 });
    for (const x of [-700, -260, 760]) { L1.solid(rect(x - 12, 40, 24, 150), C('#d8c0a0')); L1.trim([[x - 14, 42], [x, 14], [x + 14, 42]], C('#b8643c')); for (let r = 0; r < 4; r++) L1.win(x - 5, 54 + r * 30, 10, 16, { arch: true, lit: .4 }); }
    /* el Coliseo: tres órdenes de arcos y el ático, con el anillo exterior roto a un lado */
    const cx = -150, gy = 214, stone = C('#dcc4a0'), stD = shadeC(stone, -.15), wdt = 620, tiers = [[gy, 46], [gy - 46, 44], [gy - 90, 44]];
    const prof = x => { const u = (x - (cx - wdt / 2)) / wdt; return u < .62 ? 0 : (u - .62) / .38; };
    const topAt = x => gy - 168 + Math.pow(prof(x), 1.4) * 70;
    const sil = [[cx - wdt / 2, gy]]; for (let x = cx - wdt / 2; x <= cx + wdt / 2; x += 10) sil.push([x, topAt(x) + (prof(x) > 0 ? N2(x * .08, 3) * 8 : 0)]); sil.push([cx + wdt / 2, gy]);
    L2.solid(sil, stone, { grad: .4 });
    L2.shade([[cx + wdt / 2, gy], [cx + wdt / 2 + 30, gy], [cx + wdt / 2 + 30, gy - 60], [cx + wdt / 2, gy - 100]], shadeC(stone, -.2));
    const nA = 22, aw = wdt / nA;
    tiers.forEach(([by, th], ti) => { for (let k = 0; k < nA; k++) { const x0 = cx - wdt / 2 + k * aw, xm = x0 + aw / 2; if (topAt(xm) > by - th + 8) continue; L2.win(x0 + aw * .2, by - th * .78, aw * .6, th * .64, { arch: true, lit: .35, warm: 1 }); L2.line([[x0, by - th], [x0, by]], 1.2, stD); } L2.trim(rect(cx - wdt / 2, by - th - 4, wdt, 5), shadeC(stone, .1)); });
    for (let k = 0; k < nA * 2; k++) { const x = cx - wdt / 2 + (k + .5) * aw / 2, top = topAt(x); if (top < gy - 150) L2.win(x - 2, gy - 158, 4, 7, { lit: .2 }); }
    for (let x = cx - wdt / 2; x < cx + wdt / 2; x += 6) if (prof(x) > 0 && R() < .3) L2.trim(rect(x, topAt(x) - 3, 4, 3), stD);
    seed(53); trees(L2, -1050, -480, 214, { gap: [30, 60], h: [70, 110], kind: 'cypress', cols: [C('#4e6a4a'), C('#567452')] }); trees(L2, 200, 1050, 214, { gap: [40, 80], h: [70, 110], kind: () => R() < .5 ? 'cypress' : 'pine', cols: [C('#4e6a4a'), C('#5e7a50')] });
    L2.solid(rect(-1100, 214, 2200, 16), C('#c8b08a'), { ink: 0 });
    /* tejados de teja, muros de ocre y siena, persianas verdes */
    seed(54); rooftops(L3, -1300, 1300, 300, { w: [54, 96], h: [70, 130], cols: [C('#e2a86a'), C('#d4885a'), C('#e8c08c'), C('#c87850'), C('#ecd2a8')], roofs: [C('#b0522e'), C('#c0643a'), C('#a44a2a')], shutters: [C('#4a6a4a'), C('#5a7a56'), C('#8a5a3a')] });
    const ch = C('#efe2c8'); L3.solid([[540, 300], [540, 120], [600, 80], [660, 120], [660, 300]], ch); L3.trim([[536, 124], [600, 78], [664, 124], [600, 108]], shadeC(ch, -.1)); L3.win(586, 140, 28, 40, { arch: true, lit: .7, warm: 1 }); L3.trim(rect(588, 230, 24, 70), C('#5a3a2a')); L3.trim(ell(600, 200, 12, 12, 16), shadeC(ch, -.15));
    /* terraza con balaustrada, limoneros en macetas y geranios */
    const PY = 436; L4.solid([[-1400, PY], [1400, PY], [1400, 560], [-1400, 560]], C('#d4b48a'), { grad: .5 });
    L4.trim(rect(-1400, PY - 48, 2800, 8), C('#efe0c4')); L4.trim(rect(-1400, PY - 8, 2800, 8), C('#e0ccaa'));
    for (let x = -1396; x < 1400; x += 16) L4.trim([[x, PY - 40], [x + 9, PY - 40], [x + 11, PY - 30], [x + 7, PY - 22], [x + 10, PY - 10], [x - 1, PY - 10], [x + 2, PY - 22], [x - 2, PY - 30]], C('#ead8b8'));
    for (let x = -1250; x < 1300; x += 360) { L4.trim([[x - 22, PY - 48], [x + 22, PY - 48], [x + 16, PY - 80], [x - 16, PY - 80]], C('#b8643c')); L4.tree(x, PY - 78, 110, 'round', C('#5e7a3e')); seed(x | 0); for (let k = 0; k < 9; k++) L4.trim(ell(x + rnd(-36, 36), PY - 78 - rnd(40, 100), 4, 4, 8), C('#f2c43a')); }
    for (let x = -1100; x < 1300; x += 360) { L4.trim(rect(x - 30, PY - 64, 60, 16), C('#b8643c')); for (let k = 0; k < 10; k++) L4.trim(ell(x + rnd(-28, 28), PY - 66 - rnd(0, 10), 4, 4, 8), pick([C('#d8302a'), C('#e84a5a'), C('#f2f0e8')])); }
    return [L0, L1, L2, L3, L4];
  },
  live: { 4: (g, st) => birds(g, st, 12, -240, 34, 21) },
});

/* ================================ EL CAIRO ================================ */
CITIES.push({
  id: 'cairo', name: 'El Cairo', country: 'Egipto', coord: '30,04° N · 31,24° E', accent: C('#c08a2a'),
  focus: 80, focusR: 560, haze: C('#ecc898'), winC: C('#5a4636'), gran: 1.3,
  sky: { day: [C('#c48a72'), C('#f6cc86')], night: [C('#1c1c3c'), C('#6a4458')], hor: .62, sun: [520, 70, 40, C('#ffc070')], moon: [-480, -330, 18, C('#f6efd8')], stars: true },
  night: lt => sm(rg(lt, .5, 1)) * .85, nightTint: C('#2e2448'),
  pan: [-300, 300], zoom: 1.05, cloudY: [-420, -330], clouds: 2, cloud: C('#f2d2b2'), cloudA: .7,
  water: { y: 252, p: .6, c: C('#7c8a8c'), cN: C('#1a1e34'), after: 2, lights: [-560, -300, -20, 260, 520] },
  build() {
    const L0 = new Lay(.07, { name: 'piramides', haze: .5 }), L1 = new Lay(.24, { name: 'ciudadela', haze: .28 }), L2 = new Lay(.46, { name: 'ciudad', haze: .1 }), L3 = new Lay(.76, { name: 'orilla', haze: .03 }), L4 = new Lay(1, { name: 'juncos', haze: 0, sway: .002 });
    L0.solid(ridge(-1100, 1100, 170, x => -12 * Math.sin(x * .004) - 8), C('#e2b880'), { land: true, ink: 0 });
    for (const [x, h, w] of [[420, 150, 170], [600, 170, 190], [740, 90, 110]]) { L0.solid([[x - w, 172], [x, 172 - h], [x + w, 172]], C('#dcb07a'), { ink: 0 }); L0.shade([[x, 172 - h], [x + w, 172], [x + w * .2, 172]], C('#b98c5e')); }
    /* la Ciudadela con la gran mezquita: cúpula central, medias cúpulas, dos minaretes de lápiz */
    const ms = C('#e6d8c0'); L1.solid(ridge(-1100, -200, 200, x => peaks(x, [[-620, 50, 260]])), C('#c8a07a'), { land: true, ink: 0 });
    const mx = -620; L1.solid(rect(mx - 110, 60, 220, 90), ms); for (let k = 0; k < 9; k++) L1.win(mx - 100 + k * 24, 96, 10, 22, { arch: true, lit: .6 });
    for (const dx of [-70, 70]) dome(L1, mx + dx, 60, 30, C('#8e9a9a'), { drum: 0, lantern: false });
    dome(L1, mx, 40, 62, C('#8e9a9a'), { drum: 22, drumC: ms, tall: 1.05 });
    for (const dx of [-140, 140]) minaret(L1, mx + dx, 150, 300, ms, { w: 8, balc: [.5, .72], capC: C('#8e9a9a') });
    seed(61); row(L1, -180, 1050, 210, { w: [30, 60], h: [30, 90], cols: [C('#d8bc96'), C('#cdb08a'), C('#e2c8a2')], roof: 'flat', floorH: 13, winW: 4, winH: 7, winGap: 10, side: 0, cornice: false, lit: .5 });
    for (const [x, h] of [[-100, 150], [260, 170], [700, 140]]) minaret(L1, x, 210, h, C('#e2d0b2'), { w: 5, balc: [.6] });
    dome(L1, 330, 200, 34, C('#c8b494'), { drum: 14, lantern: false });
    /* la ciudad: azoteas planas, depósitos, antenas parabólicas, celosías de madera */
    seed(62); for (let x = -1080; x < 1080;) { const w = rnd(46, 84), h = rnd(70, 150), c = pick([C('#d2b48c'), C('#c4a07c'), C('#dcc4a0'), C('#b89474'), C('#e2cfae')]); facade(L2, x, 236, w, h, { c, roof: 'flat', floorH: 18, winW: 7, winH: 10, winGap: 15, side: rnd(4, 10), balc: R() < .4 ? 'all' : 0, lit: .6, shop: R() < .4, awning: [C('#7a4a2a'), C('#3a6a5a')] });
      if (R() < .5) { const tx = x + rnd(6, w - 20); L2.trim(rect(tx, 236 - h - 12, 14, 12), C('#6a6a70')); }
      if (R() < .55) { const dx = x + rnd(6, w - 14); L2.trim(ell(dx, 236 - h - 7, 7, 4, 10, PI * .9, TAU * 1.05), C('#ece8e0')); L2.line([[dx, 236 - h - 6], [dx + 2, 236 - h]], .8, C('#6a6a70')); }
      if (R() < .3) { const bx = x + w * .3; L2.trim(rect(bx, 236 - h + 24, 16, 26), C('#7a4a2a')); for (let k = 0; k < 4; k++) L2.line([[bx, 236 - h + 28 + k * 6], [bx + 16, 236 - h + 28 + k * 6]], .5, C('#4a2a1a'), { ink: 0 }); }
      x += w; }
    trees(L2, -1000, 1000, 236, { gap: [140, 260], h: [70, 100], kind: 'palm', cols: [C('#5e7a3a'), C('#6e8a42')] });
    L2.solid(rect(-1100, 236, 2200, 18), C('#bca07c'), { ink: 0 });
    /* orilla del Nilo: palmeras y una falúa amarrada */
    L3.solid([[-1400, 330], ...ridge(-1400, 1400, 330, x => -6 * Math.sin(x * .01)).slice(1, -1), [1400, 330], [1400, 380], [-1400, 380]], C('#a48a5e'), { land: true, ink: 0 });
    seed(63); trees(L3, -1300, 1300, 334, { gap: [110, 220], h: [130, 190], kind: 'palm', cols: [C('#4e6a2e'), C('#5a7a36')] });
    /* juncos y papiros en primer plano */
    const PY = 470; L4.solid([[-1400, PY], [1400, PY], [1400, 560], [-1400, 560]], C('#6e6a3e'), { land: true });
    seed(64); for (let x = -1400; x < 1400; x += rnd(8, 18)) { const h = rnd(40, 120), b = rnd(-12, 12); L4.line([[x, PY + 4], [x + b * .4, PY - h * .6], [x + b, PY - h]], 1.6, pick([C('#4e5a2a'), C('#5e6a30'), C('#6a7238')])); if (R() < .25) L4.trim(ell(x + b, PY - h - 6, 8, 6, 12), C('#7a8a42')); }
    for (const x of [-900, 700]) { L4.line([[x, PY], [x, PY - 70]], 2, C('#2a2420')); L4.trim(rect(x - 7, PY - 84, 14, 16), C('#4a3a2a')); L4.glow(x, PY - 76, 3.6, C('#ffc070')); }
    return [L0, L1, L2, L3, L4];
  },
  live: {
    2: (g, st) => { /* falúas con su vela triangular */ for (const [sp, off, y] of [[16, 0, 286], [11, 1300, 304], [20, 2100, 276]]) { const T = LT(.62), x = ((st.t * sp + off) % 2800) - 1400; liveShape(g, st, T, [[[x - 36, y], [x + 40, y], [x + 30, y + 10], [x - 28, y + 10]]], C('#5a4030')); liveShape(g, st, T, [[[x - 2, y - 2], [x - 2, y - 96], [x + 44, y - 8]], [[x - 6, y - 4], [x - 30, y - 70], [x - 6, y - 90]]], C('#f4ecd8')); } },
    4: (g, st) => birds(g, st, 8, -200, 24, 31),
  },
});

/* ================================ RÍO DE JANEIRO ================================ */
CITIES.push({
  id: 'rio', name: 'Río de Janeiro', country: 'Brasil', coord: '22,91° S · 43,17° O', accent: C('#1f8a5a'),
  focus: 160, focusR: 600, haze: C('#c4dde0'), winC: C('#4a6070'), gran: .9,
  sky: { day: [C('#5aa2d8'), C('#dff0ee')], night: [C('#101c40'), C('#5a4a72')], hor: .55, sun: [-560, -260, 30, C('#fffbe6')], moon: [480, -320, 16, C('#f0ecdc')], stars: true },
  night: lt => sm(rg(lt, .62, 1)) * .75, nightTint: C('#1c2a50'),
  pan: [-300, 320], zoom: 1.05, cloudY: [-430, -230], clouds: 5, cloud: C('#ffffff'),
  water: { y: 372, p: .85, c: C('#3a8aa8'), cN: C('#122038'), after: 3, lights: [-600, -200, 200, 600] },
  build() {
    const L0 = new Lay(.08, { name: 'montes', haze: .5 }), L1 = new Lay(.24, { name: 'pan-de-azucar', haze: .25 }), L2 = new Lay(.45, { name: 'copacabana', haze: .1 }), L3 = new Lay(.7, { name: 'playa', haze: .03 }), L4 = new Lay(1, { name: 'rocas', haze: 0, sway: .0015 });
    /* montes con selva; el Corcovado con la cima entre nubes */
    L0.solid(ridge(-1100, 1100, 180, x => peaks(x, [[-560, 330, 150], [-250, 120, 200], [250, 90, 250], [700, 150, 220]])), C('#5e8a6a'), { land: true, ink: 0 });
    for (let i = 0; i < 6; i++) L0.trim(wobble(ell(-560 + rnd(-90, 90), -150 + rnd(-20, 30), rnd(60, 110), rnd(16, 26), 24), 8, i, .05), C('#f2f6f6'));
    /* el Pan de Azúcar: dos monolitos redondeados, teleférico */
    const pa = C('#6e7e78'), mono = (x, h, w) => { const P = []; for (let i = 0; i <= 30; i++) { const t = i / 30, a = PI + t * PI; P.push([x + Math.cos(a) * w, 200 + Math.sin(a) * h * (1 - .12 * Math.pow(Math.cos(a), 6))]); } L1.solid(P, pa, { grad: .5, land: true }); L1.trim(P.slice(4, 14).map(([px, py]) => [px + 6, py + 10]).concat([[x - w * .1, 200 - h * .5]]), shadeC(pa, .15)); };
    mono(560, 300, 120); mono(300, 150, 100);
    L1.trim(wobble(ell(560, -90, 70, 16, 20, PI, TAU), 4, 1), C('#5e8a5a')); L1.trim(wobble(ell(300, 60, 60, 14, 20, PI, TAU), 4, 2), C('#5e8a5a'));
    L1.line(sag([300, 52], [560, -98], 30), .9, C('#2a2a2a'));
    L1.solid(ridge(-1100, 1100, 210, x => peaks(x, [[-700, 50, 200], [-100, 40, 260], [900, 60, 220]])), C('#6a9a6e'), { land: true, ink: 0 });
    seed(71); for (let i = 0; i < 70; i++) { const x = rnd(-1050, 140), y = 196 - rnd(0, 30); L1.solid(rect(x, y, rnd(8, 14), rnd(6, 10)), pick([C('#e8b86a'), C('#d86a5a'), C('#6aa8c8'), C('#f2ece0'), C('#c8d86a')]), { ink: 0 }); }
    /* Copacabana: torres blancas y pastel con balcones */
    seed(72); for (let x = -1080; x < 1080;) { const w = rnd(48, 80), h = rnd(110, 200), c = pick([C('#f2efe8'), C('#ece0cc'), C('#e0ece8'), C('#f2e4d8'), C('#e8e8f0')]); tower(L2, x, 280, w, h, c, { fl: 11, ww: 7, gap: 11, lit: .55, side: rnd(4, 10), crown: pick(['flat', 'box']) }); for (let r = 0; r < Math.floor((h - 20) / 11); r += 1) L2.line([[x + 2, 280 - h + 16 + r * 11], [x + w - 2, 280 - h + 16 + r * 11]], .7, shadeC(c, -.3), { ink: 0 }); x += w + rnd(4, 14); }
    trees(L2, -1050, 1050, 284, { gap: [60, 110], h: [60, 90], kind: 'palm', cols: [C('#3e7a3a'), C('#4a8a40')] });
    /* el paseo de ondas, la arena, sombrillas y quioscos */
    const py = 300; L3.solid(rect(-1400, py, 2800, 22), C('#f2ede2'), { ink: 0 });
    for (let x = -1400; x < 1400; x += 40) { const P = []; for (let k = 0; k <= 8; k++) P.push([x + k * 5, py + 11 + Math.sin(k / 8 * TAU) * 6]); L3.line(P, 2.4, C('#26262a'), { ink: 0 }); }
    L3.solid(rect(-1400, py + 22, 2800, 52), C('#ecd6a8'), { grad: .3 });
    seed(73); for (let x = -1300; x < 1300; x += rnd(60, 140)) { const c = pick([C('#e8443a'), C('#f2c43a'), C('#3a8ad8'), C('#2ab088'), C('#f28a3a')]); L3.line([[x, py + 60], [x + 2, py + 30]], 1.2, C('#5a4a3a')); L3.trim([[x - 22, py + 32], [x + 2, py + 18], [x + 26, py + 32]], c); if (R() < .5) person(L3, x + rnd(10, 30), py + 62, rnd(14, 18), pick([C('#8a5a3a'), C('#5a3a2a'), C('#c08a5a')])); }
    for (const x of [-700, 200, 900]) { L3.trim(rect(x - 16, py - 4, 32, 26), C('#f2f0e8')); L3.trim([[x - 22, py - 4], [x, py - 18], [x + 22, py - 4]], C('#2ab088')); }
    lamps(L3, -1300, 1300, py, 220, 40, C('#3a3a3a'));
    /* rocas y espuma en el primer plano */
    const PY = 470; seed(74); for (const [x, w, h] of [[-1250, 260, 110], [-980, 150, 60], [1050, 300, 130], [1300, 200, 80]]) { const P = wobble(ell(x, PY + 40, w, h, 26, PI, TAU).concat([[x + w, 560], [x - w, 560]]), 8, x, .03); L4.solid(P, C('#5a5a58'), { land: true }); L4.trim(P.slice(3, 11).map(([px, py2]) => [px + 10, py2 + 14]).concat([[x - w * .2, PY]]), C('#7a7a74')); }
    L4.solid([[-1400, 520], [1400, 520], [1400, 560], [-1400, 560]], C('#d8ecec'), { ink: 0 });
    return [L0, L1, L2, L3, L4];
  },
  live: {
    1: (g, st) => { /* el bondinho sube y baja */ const T = LT(.24), u = (Math.sin(st.t * .25) * .5 + .5), p = sag([300, 52], [560, -98], 30)[Math.round(u * 24)]; liveShape(g, st, T, [rect(p[0] - 5, p[1] + 2, 10, 8)], C('#e85a3a')); },
    3: (g, st) => { /* espuma que va y viene sobre la arena */ const T = LT(.85); g.save(); g.setTransform(T.s, 0, 0, T.s, T.ox, T.oy); const y = 376 + Math.sin(st.t * .8) * 4; g.fillStyle = st.style === 'wc' ? 'rgba(250,248,240,.8)' : 'rgb(250,250,246)'; if (st.style !== 'wc') { g.shadowColor = 'rgba(20,40,60,.35)'; g.shadowBlur = 4 * T.s; g.shadowOffsetY = 2 * T.s; } g.beginPath(); g.moveTo(-1600, y); for (let x = -1600; x <= 1600; x += 30) g.lineTo(x, y + Math.sin(x * .02 + st.t) * 4); g.lineTo(1600, y + 8); g.lineTo(-1600, y + 8); g.fill(); g.restore(); birds(g, st, 9, -220, 30, 41); },
  },
});

/* ================================ BOGOTÁ ================================ */
CITIES.push({
  id: 'bogota', name: 'Bogotá', country: 'Colombia', coord: '4,71° N · 74,07° O', accent: C('#c9a227'),
  focus: -60, focusR: 580, haze: C('#c2c6c4'), winC: C('#4e5258'), gran: 1.1,
  sky: { day: [C('#8a96a2'), C('#e2ddd0')], night: [C('#141a32'), C('#4a4660')], hor: .5, sun: null, moon: [480, -330, 15, C('#ece8dc')], stars: false },
  night: lt => sm(rg(lt, .4, .95)) * .82, nightTint: C('#24283e'),
  pan: [-320, 300], zoom: 1.05, cloudY: [-440, -200], clouds: 6, cloud: C('#e2e2de'),
  build() {
    const L0 = new Lay(.1, { name: 'cerros', haze: .38 }), L1 = new Lay(.26, { name: 'torres', haze: .24 }), L2 = new Lay(.46, { name: 'ladrillo', haze: .1 }), L3 = new Lay(.72, { name: 'candelaria', haze: .03 }), L4 = new Lay(1, { name: 'calle', haze: 0, sway: .0012 });
    /* los cerros orientales: Monserrate con su santuario y el teleférico */
    const hill = x => peaks(x, [[-380, 430, 260], [140, 380, 300], [-900, 300, 260], [700, 330, 320]]);
    L0.solid(ridge(-1100, 1100, 190, hill, 120), C('#56705a'), { land: true, ink: 0 });
    L0.solid(ridge(-1100, 1100, 196, x => hill(x) * .55 + 10 * Math.sin(x * .03)), C('#4a6250'), { land: true, ink: 0 });
    const sx = -380, sy = 190 + hill(-380); L0.solid(rect(sx - 26, sy - 22, 52, 24), C('#f2eee4')); L0.solid(rect(sx - 8, sy - 50, 16, 30), C('#f2eee4')); L0.trim([[sx - 10, sy - 50], [sx, sy - 64], [sx + 10, sy - 50]], C('#d8d2c4')); L0.line([[sx, sy - 64], [sx, sy - 72]], 1, C('#8a8274'));
    L0.line(sag([sx + 10, sy - 6], [sx + 340, 170], 40), .9, C('#2a2a2a'));
    for (let i = 0; i < 7; i++) L0.trim(wobble(ell(rnd(-1000, 1000), rnd(-120, 40), rnd(90, 220), rnd(10, 18), 24), 6, i, .05), C('#eceae4'));
    /* torres del centro (sin copiar ninguna): esbeltas, con coronas iluminadas */
    seed(81); for (let x = -1050; x < 1050; x += rnd(60, 120)) tower(L1, x, 210, rnd(32, 52), rnd(100, 230), pick([C('#9aa0a6'), C('#8a929a'), C('#a8aaa4'), C('#b8a48e')]), { fl: 8, ww: 2.6, gap: 5.6, lit: .55, crown: pick(['flat', 'box', 'slant']), mast: R() < .35 ? rnd(12, 28) : 0, side: rnd(4, 9) });
    const ct = 300; tower(L1, ct, 210, 46, 330, C('#a8b0b8'), { fl: 8, ww: 3, gap: 6, lit: .7, side: 10, crown: 'box', mast: 30 }); for (let k = 0; k < 6; k++) L1.glow(ct + 4 + k * 7.6, 210 - 334, 2.2, pick([C('#ffd84a'), C('#4a8aff'), C('#ff4a4a')]));
    /* el ladrillo bogotano: torres curvas de ladrillo, ventanas profundas */
    const brick = [C('#a85a3a'), C('#b8663e'), C('#9a4e34'), C('#c0724a')];
    seed(82); for (let x = -1080; x < 1080;) { const w = rnd(60, 110), h = rnd(90, 180), c = pick(brick), round = R() < .35;
      if (round) { const P = [[x, 250]]; for (let i = 0; i <= 12; i++) { const t = i / 12; P.push([x + w * t, 250 - h + Math.sin(t * PI) * -14 + (t > .5 ? (t - .5) * 50 : 0)]); } P.push([x + w, 250]); L2.solid(P, c); for (let r = 0; r < Math.floor((h - 30) / 16); r++) for (let k = 0; k < Math.floor(w / 14); k++) L2.win(x + 4 + k * 14, 250 - h + 22 + r * 16, 8, 9, { lit: .55 }); for (let r = 0; r < Math.floor((h - 30) / 16); r++) L2.line([[x + 2, 250 - h + 33 + r * 16], [x + w - 2, 250 - h + 33 + r * 16]], 1.6, shadeC(c, -.25), { ink: 0 }); }
      else facade(L2, x, 250, w, h, { c, roof: 'flat', floorH: 16, winW: 8, winH: 9, winGap: 14, side: rnd(4, 10), balc: R() < .5 ? 'all' : 0, lit: .6 });
      for (let y = 250 - h + 6; y < 250; y += 5) if (R() < .25) L2.line([[x + rnd(0, w * .5), y], [x + rnd(w * .5, w), y]], .5, shadeC(c, -.15), { ink: 0 });
      x += w + rnd(2, 10); }
    trees(L2, -1050, 1050, 252, { gap: [80, 160], h: [80, 120], kind: () => R() < .5 ? 'cypress' : 'round', cols: [C('#4e6a4a'), C('#5a7652')] });
    /* La Candelaria: casas coloniales encaladas, tejas, balcones de madera, la torre de la iglesia */
    seed(83); for (let x = -1300; x < 1300;) { const w = rnd(80, 130), h = rnd(54, 92); colonial(L3, x, 330 - (x + 1300) * .012, w, h, { wall: pick([C('#f2ece0'), C('#f2e6c8'), C('#e8eef0'), C('#f6e2d4'), C('#e2ecd8')]), lamp: R() < .4 }); x += w + 4; }
    const ch = C('#f2ece0'), cx = 380, cg = 330 - (cx + 1300) * .012; L3.solid(rect(cx - 30, cg - 190, 60, 190), ch); L3.trim([[cx - 34, cg - 190], [cx, cg - 236], [cx + 34, cg - 190]], C('#a84a2a')); for (let r = 0; r < 3; r++) L3.win(cx - 9, cg - 176 + r * 50, 18, 30, { arch: true, lit: .6, warm: 1 }); L3.trim(rect(cx - 34, cg - 92, 68, 6), shadeC(ch, -.12)); L3.line([[cx, cg - 236], [cx, cg - 252]], 1.2, C('#4a3a2a')); L3.line([[cx - 6, cg - 246], [cx + 6, cg - 246]], 1.2, C('#4a3a2a'));
    /* calle empedrada, faroles coloniales, cables, gente con paraguas */
    const PY = 444; L4.solid([[-1400, PY], [1400, PY - 16], [1400, 560], [-1400, 560]], C('#7a7068'), { grad: .5 });
    seed(84); for (let i = 0; i < 260; i++) { const x = rnd(-1400, 1400), y = rnd(PY, 556); L4.trim(ell(x, y, rnd(5, 9), rnd(3, 5), 8), pick([C('#8a8078'), C('#6a625a'), C('#948a80')])); }
    for (let x = -1250; x < 1300; x += 330) { L4.line([[x, PY - (x + 1400) * .006], [x, PY - 130]], 3, C('#1e1c1c')); L4.line([[x, PY - 128], [x + 16, PY - 132]], 2, C('#1e1c1c')); L4.trim(rect(x + 9, PY - 128, 14, 4), C('#1e1c1c')); L4.win(x + 11, PY - 124, 10, 14, { lit: 1, warm: 1, c: C('#3a3430') }); L4.line([[x + 9, PY - 124], [x + 9, PY - 110], [x + 23, PY - 110], [x + 23, PY - 124]], 1.6, C('#1e1c1c')); L4.trim([[x + 7, PY - 128], [x + 16, PY - 138], [x + 25, PY - 128]], C('#1e1c1c')); L4.glow(x + 16, PY - 117, 3.4, C('#ffcf8a')); }
    L4.line(sag([-1400, PY - 230], [1400, PY - 250], 60), 1.1, C('#1e1c1c')); L4.line(sag([-1400, PY - 210], [1400, PY - 236], 70), 1, C('#1e1c1c'));
    seed(85); for (let i = 0; i < 12; i++) person(L4, rnd(-1150, 1200), PY - 6, rnd(42, 50), pick([C('#2a2a30'), C('#4a2e2e'), C('#2e3a4a')]), { coat: 1, umb: R() < .7 ? pick([C('#22222a'), C('#c9a227'), C('#2b4a8a'), C('#b8302a')]) : 0 });
    return [L0, L1, L2, L3, L4];
  },
  live: {
    0: (g, st) => { /* la cabina del teleférico sube a Monserrate */ const T = LT(.1), u = (st.t * .03) % 1, sx = -380, sy = 190 + peaks(-380, [[-380, 430, 260], [140, 380, 300], [-900, 300, 260], [700, 330, 320]]); const p = sag([sx + 10, sy - 6], [sx + 340, 170], 40)[Math.round((1 - u) * 24)]; liveShape(g, st, T, [rect(p[0] - 4, p[1] + 2, 8, 7)], C('#d83a2a')); },
    4: (g, st) => rain(g, st, .3),
  },
});
