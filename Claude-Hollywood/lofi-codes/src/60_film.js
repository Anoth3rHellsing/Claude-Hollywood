/* =====================================================================
   LO-FI CODES · la película (sin textos): Brote despierta en el invernadero, cruza la ciudad en otoño,
   pide un café, maneja hacia la costa y mira el atardecer en el muelle.
   0 invernadero · 33.5 ciudad · 84 el carrito de café (98–110 latte) · 118.6 el auto · 155.5 el mar · 212.5 fin
   ===================================================================== */
const CHAPTERS = [[0, 'Invernadero'], [33.5, 'Ciudad'], [84, 'Café'], [119, 'Carretera'], [156, 'El mar']];
const STEPT = BEAT / 2;   // un paso por cada corchea
const CAR_PARK = { x: 4620, z: 600 }, SEA_CAR = { x: -560, z: 500 };
function legs(st) { return { legL: st % 2 ? 0 : 1, legR: st % 2 ? 1 : 0 }; }
const beatBob = t => { const F = FORM[Math.min(FORM.length - 1, Math.floor(t / BAR))]; return F && F.d && beatPhase(t) < .2 ? 1 : 0; };
const leafAt = t => (Math.floor(t / (BEAT * 2)) % 2 ? 1 : -1);
/* dónde está Brote y cómo se ve en t */
function walkerAt(t) {
  const blink = (t * .41 + .2) % 1 < .045, base = { blink, leaf: leafAt(t) };
  if (t < 13.0) { const f = t < 7.2 ? { sleep: true } : { ...base, happy: t > 10 && t < 11.6 }; return { x: -760, z: 632, y: 84, f, sq: t > 8.6 && t < 9.6 ? 1 + .14 * Math.sin((t - 8.6) * PI) : 1, gh: false, zz: t < 7.2 }; }
  if (t < 13.8) { const u = clamp((t - 13.0) / .6); return { x: lerp(-760, -700, u), z: lerp(632, 600, u), y: lerp(84, 0, u) + Math.sin(u * PI) * 50, f: base, gh: true }; }
  if (t < 33.5) { const st = Math.floor((t - 13.8) / STEPT), u = (t - 13.8) / (33.5 - 13.8); return { x: lerp(-700, 760, u), z: 600, y: (st % 2) * BR_CELL, f: { ...base, ...legs(st) }, walk: true, step: st, gh: true }; }
  if (t < 84) { const st = Math.floor((t - 33.5) / STEPT), u = (t - 33.5) / (84 - 33.5); return { x: lerp(-700, CAFE_X - 120, u), z: CZ.path, y: (st % 2) * BR_CELL, f: { ...base, ...legs(st) }, walk: true, step: st, city: true }; }
  if (t < 112.4) { const hop = t > 86.2 && t < 86.7 ? Math.sin((t - 86.2) / .5 * PI) * 40 : t > 111 && t < 111.45 ? Math.sin((t - 111) / .45 * PI) * 46 : 0;
    return { x: CAFE_X - 120, z: CZ.path, y: hop, f: { ...base, cup: t > 110.6, happy: t > 110.8 && t < 112.4 }, city: true, insert: t > 98.6 && t < 109.8 }; }
  if (t < 118.6) { const st = Math.floor((t - 112.4) / STEPT), u = (t - 112.4) / (118.6 - 112.4); return { x: lerp(CAFE_X - 120, CAR_PARK.x - 60, u), z: lerp(CZ.path, CAR_PARK.z + 30, u), y: (st % 2) * BR_CELL, f: { ...base, cup: true, ...legs(st) }, walk: true, step: st, city: true }; }
  if (t < 157.4) return { hide: true };
  if (t < 162.0) { const st = Math.floor((t - 157.4) / STEPT), u = (t - 157.4) / (162 - 157.4); return { x: lerp(SEA_CAR.x + 90, -40, u), z: lerp(SEA_CAR.z + 20, SEA.bench - 20, u), y: (st % 2) * BR_CELL, f: { ...base, cup: true, ...legs(st) }, walk: true, step: st, sea: true }; }
  if (t < 162.8) { const u = clamp((t - 162.0) / .6); return { x: lerp(-40, 0, u), z: lerp(SEA.bench - 20, SEA.bench + 4, u), y: lerp(0, 46, u) + Math.sin(u * PI) * 40, f: { ...base, cup: true }, sea: true }; }
  /* se sube al respaldo, se da vuelta y sonríe a la cámara; luego vuelve a sentarse */
  if (t > 185.8 && t < 191.8) { const up = clamp((t - 185.8) / .45), dn = clamp((t - 191.35) / .45), u = up - dn, hop = (up > 0 && up < 1 ? Math.sin(up * PI) : 0) + (dn > 0 && dn < 1 ? Math.sin(dn * PI) : 0);
    return { x: 0, z: lerp(SEA.bench + 4, SEA.bench - 34, u), y: lerp(46, 112, u) + hop * 36, f: { ...base, cup: true, back: u < .5, happy: u > .5 && t > 186.6 }, sea: true }; }
  return { x: 0, z: SEA.bench + 4, y: 46 + beatBob(t) * BR_CELL * .5, f: { ...base, cup: true, sit: true, back: true }, sea: true };
}
/* Brote en el mundo (pie en x, y, z) */
function drawBrote(B, t) {
  if (!B || B.hide || B.insert || B.z - CAM.z < 40) return;
  const cell = wCell(B.z), bob = B.walk ? 0 : beatBob(t) * (B.f.sit ? 0 : 1);
  if ((B.y || 0) < 60 && !B.f.sit) spShadow(B.x, B.z, 13, cell, clamp(1 - (B.y || 0) / 120));
  const [fx, fy] = wFoot(B.x, B.y, B.z), c = broteCanvas(B.f);
  spBlit(c, fx, fy + bob * cell, cell, { sq: B.sq });
  if (B.f.cup) steamPix(fx + 6 * cell, fy - 20 * cell + bob * cell, cell, t, .7);
  if (B.zz) for (let k = 0; k < 3; k++) { const ph = (t * .45 + k / 3) % 1, x = fx + (9 + ph * 8) * cell, y = fy - (24 + ph * 14) * cell; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = Math.sin(ph * PI) * .85; ctx.fillStyle = 'rgb(70,62,84)'; for (const [dx, dy] of [[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]) ctx.fillRect(Math.round(x / cell + dx) * cell, Math.round(y / cell + dy) * cell, cell, cell); ctx.restore(); }
}
/* pasos → ondas en los charcos */
let STEPS = [];
function stepsInit() { STEPS = []; let last = null; for (let t = 0; t < FILM.DUR; t += 1 / 60) { const A = walkerAt(t); if (!A || !A.walk) { last = null; continue; } if (last !== null && A.step !== last) STEPS.push([t, A.x + (A.step & 1 ? -12 : 12), A.z, A.city ? 'c' : A.sea ? 's' : 'g']); last = A.step; } }
function inPud(list, x, z) { for (const P of list) if (((x - P.x) / P.rx) ** 2 + ((z - P.z) / P.rz) ** 2 < 1.1) return true; return false; }
function ripples(t, list, kind) {
  for (const [ts, x, z, k] of STEPS) { if (k !== kind) continue; const age = t - ts; if (age < 0 || age > 1.8 || !inPud(list, x, z)) continue; const c = PJ(x, 0, z), s = PS(z);
    for (let j = 0; j < 3; j++) { const ak = age - j * .16; if (ak < 0) continue; const r = (5 + ak * 60) * s; ctx.strokeStyle = `rgba(250,248,240,${.75 * Math.exp(-ak * 1.6)})`; ctx.lineWidth = Math.max(.8, 1.6 * s); ctx.beginPath(); ctx.ellipse(c[0], c[1], r, r * (-CAM.y + 10) / Math.max(60, z - CAM.z) * 1.4, 0, 0, TAU); ctx.stroke(); } }
}
function puddleFx(t) { const B = walkerAt(t); if (B && B.gh && !B.hide) spReflect(broteCanvas(B.f), B.x, B.y, B.z, t); ripples(t, PUDDLES, 'g'); }
/* Tetera detrás del carrito; la taza que viaja hasta el borde de Brote */
function teteraAt(t) { const x = CAFE_X + (t > 92 && t < 97.6 ? 70 * sm((t - 92) / .6) * (1 - sm((t - 97) / .6)) : 10); return { x, y: 96 + (beatPhase(t) < .2 && t > 108 ? 2 : 0), z: CZ.cart + 12 }; }
function drawTetera(t) { const T = teteraAt(t), cell = wCell(T.z, 4.2), [fx, fy] = wFoot(T.x, T.y, T.z); spBlit(teteraCanvas({ blink: (t * .33) % 1 < .05, tilt: t > 93 && t < 96 }), fx, fy, cell, { flip: t > 92 && t < 97.6 }); if (t > 93 && t < 96.4) steamPix(fx + 30 * cell, fy - 30 * cell, cell, t, .9); }
function flyingCup(t) { if (t < 110.0 || t > 110.6) return; const u = (t - 110) / .6, B = walkerAt(110.6), a = [CAFE_X - 30, -150, CZ.cart - 10], b = [B.x + 6 * BR_CELL, -(B.y + 70), B.z]; const q = [lerp(a[0], b[0], u), lerp(a[1], b[1], u) - Math.sin(u * PI) * 60, lerp(a[2], b[2], u)]; const cell = wCell(q[2]), [fx, fy] = wFoot(q[0], -q[1], q[2]); spBlit(gridCanvas('cup', ICONS.cup), fx, fy, cell); }
function drawParkedCar(x, z, t, withBrote) { const cell = wCell(z), [fx, fy] = wFoot(x, 0, z); spShadow(x, z, 40, cell, 1); if (withBrote) spBlit(broteCanvas({ cup: true, leaf: leafAt(t) }), fx - 2 * cell, fy - 4 * cell, cell); spBlit(carCanvas(), fx, fy, cell); for (const wx of [11, 33]) spBlit(wheelCanvas(0), fx + (wx - CAR_W / 2) * cell, fy + 2 * cell, cell); }
/* ---------- cámara ---------- */
function camKeys(t, K) {
  if (t <= K[0][0]) return K[0][1];
  for (let i = 0; i < K.length - 1; i++) { const [a, A] = K[i], [b, B] = K[i + 1]; if (t < b) { const u = eio((t - a) / (b - a)); const o = {}; for (const k of ['x', 'y', 'zoom', 'ty']) o[k] = lerp(A[k] ?? (k === 'zoom' ? 1 : k === 'y' ? -150 : 0), B[k] ?? (k === 'zoom' ? 1 : k === 'y' ? -150 : 0), u); return o; } }
  return K[K.length - 1][1];
}
function camGreen(t) {
  const B = walkerAt(t);
  if (t < 6.5) return camKeys(t, [[0, { x: -1180, y: -122, zoom: 2.3, ty: 30 }], [6.5, { x: -790, y: -122, zoom: 2.45, ty: 25 }]]);
  if (t < 13) return camKeys(t, [[6.5, { x: -770, y: -126, zoom: 3.1, ty: -20 }], [13, { x: -765, y: -126, zoom: 3.25, ty: -20 }]]);
  if (t < 23) return { x: B.x + 90, y: -55, zoom: 2.1, ty: 15 };
  return { x: B.x + 180, y: -150, zoom: 1.15, ty: 25 };
}
function camCity(t) {
  const B = walkerAt(Math.min(t, 83.9));
  if (t < 48) return { x: B.x + 250, y: -230, zoom: .92, ty: 20 };
  if (t < 60) return { x: B.x + 70, y: -45, zoom: 2.2, ty: 10 };
  if (t < 72) return { x: B.x + 40, y: -24, zoom: 1.7, ty: 100 };
  if (t < 84) return camKeys(t, [[72, { x: B.x + 200, y: -200, zoom: 1.0, ty: 30 }], [84, { x: CAFE_X - 40, y: -170, zoom: 1.35, ty: 30 }]]);
  if (t < 110) return camKeys(t, [[84, { x: CAFE_X - 40, y: -170, zoom: 1.35, ty: 30 }], [87, { x: CAFE_X - 40, y: -110, zoom: 1.4, ty: -50 }], [98, { x: CAFE_X - 30, y: -110, zoom: 1.5, ty: -50 }], [110, { x: CAFE_X - 30, y: -110, zoom: 1.5, ty: -50 }]]);
  return camKeys(t, [[110, { x: CAFE_X - 30, y: -110, zoom: 1.5, ty: -50 }], [113, { x: CAFE_X + 80, y: -110, zoom: 1.45, ty: -40 }], [118.6, { x: CAR_PARK.x - 30, y: -110, zoom: 1.55, ty: -30 }], [121, { x: CAR_PARK.x, y: -110, zoom: 1.6, ty: -30 }]]);
}
function camSea(t) {
  return camKeys(t, [[155.5, { x: -300, y: -150, zoom: 1.2, ty: 50 }], [161, { x: -200, y: -150, zoom: 1.25, ty: 50 }], [163.4, { x: 0, y: -110, zoom: 1.7, ty: 110 }], [177.6, { x: 0, y: -110, zoom: 1.85, ty: 110 }], [179, { x: 60, y: -160, zoom: .95, ty: 60 }], [185.6, { x: 60, y: -160, zoom: .97, ty: 60 }], [186.6, { x: 0, y: -150, zoom: 2.4, ty: 10 }], [191.4, { x: 0, y: -150, zoom: 2.45, ty: 10 }], [193, { x: 0, y: -120, zoom: 1.6, ty: 90 }], [210, { x: 20, y: -180, zoom: .9, ty: 70 }]]);
}
const DRZ = [[120, 1], [131.5, 1], [133, 2.1], [139, 2.15], [140.6, .85], [149.5, .85], [151, 1]];
function drZoom(t) { const k = DRZ; if (t <= k[0][0]) return k[0][1]; for (let i = 0; i < k.length - 1; i++) if (t < k[i + 1][0]) return lerp(k[i][1], k[i + 1][1], eio((t - k[i][0]) / (k[i + 1][0] - k[i][0]))); return k[k.length - 1][1]; }
/* ---------- escenas ---------- */
function sceneGreen(t) {
  camSet(camGreen(t)); WIND.x = windAt(t) * .8; const B = walkerAt(t);
  drawSet(t, { items: put => put(B.z - .5, () => drawBrote(B, t)), floorFx: t2 => floorLeaves(t2), fx: t2 => { sunRays(t2, 1.2); leavesFall(t2, .8); } });
  tint('255,226,190', .16 * (1 - sm((t - 20) / 12)), 'multiply');   // luz de mañana
  post(t);
}
function sceneCity(t) {
  camSet(camCity(t)); WIND.x = .3; const B = walkerAt(t);
  drawCity(t, { refl: t2 => { if (B && B.city && !B.hide) spReflect(broteCanvas(B.f), B.x, B.y, B.z, t2); ripples(t2, CPUD, 'c'); },
    items: put => { put(CZ.cart + 12, () => drawTetera(t)); put(B.z - .5, () => drawBrote(B, t)); put(CAR_PARK.z, () => drawParkedCar(CAR_PARK.x, CAR_PARK.z, t, t > 118.6)); put(CZ.cart - 20, () => flyingCup(t)); },
    fx: t2 => { sunRays(t2, .8); leavesFall(t2, 1); if (t > 86.2 && t < 89.6) { const [fx, fy] = wFoot(B.x, B.y + 76, B.z); bubble(fx + 4 * wCell(B.z), fy, wCell(B.z) * .8, 'cup', win(t, 86.2, 89.6, .15, .3), 1); } if (t > 111 && t < 113.4) { const [fx, fy] = wFoot(B.x, B.y + 80, B.z); bubble(fx, fy, wCell(B.z) * .8, 'heart', win(t, 111, 113.4, .15, .3)); } } });
  post(t);
}
function sceneDrive(t) { drawDrive(t, { zoom: drZoom(t), fx: -150 }); post(t); }
function sceneSea(t) {
  camSet(camSea(t)); const B = walkerAt(t);
  drawSea(t, { items: put => { put(SEA_CAR.z, () => drawParkedCar(SEA_CAR.x, SEA_CAR.z, t, t < 157.4)); put(B.z - .5, () => drawBrote(B, t)); }, fx: t2 => { leavesFall(t2, .5, 250, 700); } });
  post(t);
}
const FILM = {
  DUR: 216, CHAPTERS,
  load() { floorLeavesInit(); cityInit(); driveInit(); seaInit(); stepsInit(); pigeonsInit(walkerAt); },
  draw(t) {
    T0();
    if (t < 33.5) inkWipe(() => { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(PAPER, 0, 0, W, H); T0(); }, () => sceneGreen(t), clamp(t / 3), 'abre', 'center', .38, .5);
    else if (t < 35.5) inkWipe(() => sceneGreen(t), () => sceneCity(t), (t - 33.5) / 2, 'ciudad', 'sweep');
    else if (t < 98) sceneCity(t);
    else if (t < 99.2) inkWipe(() => sceneCity(t), () => latteInsert(t), (t - 98) / 1.2, 'latte', 'center', .5, .5);
    else if (t < 109.2) latteInsert(t);
    else if (t < 110.4) inkWipe(() => latteInsert(t), () => sceneCity(t), (t - 109.2) / 1.2, 'latte2', 'center', .5, .5);
    else if (t < 118.6) sceneCity(t);
    else if (t < 120.6) inkWipe(() => sceneCity(t), () => sceneDrive(t), (t - 118.6) / 2, 'auto', 'sweep');
    else if (t < 155.5) sceneDrive(t);
    else if (t < 157.5) inkWipe(() => sceneDrive(t), () => sceneSea(t), (t - 155.5) / 2, 'mar', 'sweep');
    else sceneSea(t);
    /* fundido final al papel */
    const e = sm((t - 212.4) / 3.2); if (e > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = e; ctx.drawImage(PAPER, 0, 0, W, H); ctx.restore(); T0(); }
  },
};
