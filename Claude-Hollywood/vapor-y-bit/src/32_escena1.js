/* =====================================================================
   ESCENA 1 · EL DESPERTAR (0:00–1:07): coreografía de Teo, la sábana que vuela, el polvo en los haces,
   la puerta que rebota, el diploma que tiembla, el despertador que nadie apaga… hasta que Teo vuelve.
   Tiempo «físico» con cámara lenta: entre 25,3 y 27,8 s la acción va al 30 % (sábana, polvo y salto).
   ===================================================================== */
const SL0 = 25.3, SL1 = 27.8, SLK = .3;
const phys = t => t < SL0 ? t : t < SL1 ? SL0 + (t - SL0) * SLK : SL0 + (SL1 - SL0) * SLK + (t - SL1);
const slowK = t => sm((t - SL0) / .3) * (1 - sm((t - SL1 + .3) / .3));
const TJ = 25.0;                                     // el salto (tiempo físico)
const TEO_BED = { x: -330, z: 668 }, LAND = { x: -238, z: 522 }, CLOGS = { x: -150, z: 546 }, DESK = { x: 372, z: 712, y: 76 }, KNOB = { x: 600, z: 762 };
const NIGHT = { x0: -540, x1: -462, z0: 650, z1: 726, top: -56 };
const STEP = .1;
/* ---------- Teo en el tiempo t: posición, cuadro, mirada ---------- */
function runPose(t, f, k = 1) { const st = Math.floor(t / (STEP / k)); return { ...f, legL: st % 2 ? 0 : 2, legR: st % 2 ? 2 : 0 }; }
const seg = (t, a, b) => clamp((t - a) / (b - a));
function hop(u, h) { return Math.sin(clamp(u) * PI) * h; }
function teoAt(t) {
  const p = phys(t), blink = (t * .43) % 1 < .05, clogs = t > 31.45, top = t > 36.2 ? 'cuaderno' : undefined, base = { clogs, top };
  if (t < 22.4) return { hide: true, x: TEO_BED.x, y: 55, z: TEO_BED.z };
  if (p < TJ) { const u = seg(t, 22.4, 22.8); const cr = lerp(0, 17, sm(u)); return { x: TEO_BED.x, y: 95 + (cr - 24) * 3.2, z: TEO_BED.z, crop: cr, f: t < 22.95 ? { blink: true } : { wide: true, mouthO: t > 23 && t < 24.6 }, under: true }; }
  if (p < TJ + .75) { const u = (p - TJ) / .75; return { x: lerp(TEO_BED.x, LAND.x, u), y: lerp(55, 0, u) + hop(u, 150), z: lerp(TEO_BED.z, LAND.z, u), f: { wide: true, mouthO: true, legL: 2, legR: 2 }, air: true, rot: Math.sin(u * PI) * .12 }; }
  if (t < 28.2) { const a = p - TJ - .75; return { x: LAND.x, y: 0, z: LAND.z, f: { wide: true }, sq: 1 - .25 * Math.exp(-a * 9) * Math.cos(a * 22) }; }
  if (t < 30.6) return { x: LAND.x, y: Math.abs(Math.sin(t * 9)) * 6, z: LAND.z, f: { wide: true, blink, legL: Math.sin(t * 18) > 0 ? 1 : 0, legR: Math.sin(t * 18) > 0 ? 0 : 1 } };
  if (t < 31.1) { const u = seg(t, 30.6, 31.1); return { x: lerp(LAND.x, CLOGS.x - 10, u), y: 0, z: lerp(LAND.z, CLOGS.z, u), f: runPose(t, { wide: true }), run: true }; }
  if (t < 31.6) { const u = seg(t, 31.1, 31.6); return { x: lerp(CLOGS.x - 10, CLOGS.x, u), y: hop(u, 26), z: CLOGS.z, f: { happy: u > .5, clogs: u > .7, legL: 2, legR: 2 } }; }
  if (t < 32.2) return { x: CLOGS.x, y: 0, z: CLOGS.z, f: { happy: true, clogs, legL: Math.floor(t * 12) % 2, legR: 1 - Math.floor(t * 12) % 2 } };
  if (t < 35.0) { const u = seg(t, 32.2, 35.0); return { x: lerp(CLOGS.x, DESK.x - 40, u), y: 0, z: lerp(CLOGS.z, DESK.z - 50, u), f: runPose(t, { ...base, blink }), run: true }; }
  if (t < 35.6) { const u = seg(t, 35.0, 35.6); return { x: lerp(DESK.x - 40, DESK.x - 6, u), y: lerp(0, DESK.y, u) + hop(u, 40), z: lerp(DESK.z - 50, DESK.z, u), f: { ...base, legL: 2, legR: 2 } }; }
  if (t < 37.6) return { x: DESK.x - 6, y: DESK.y, z: DESK.z, f: { ...base, wide: t > 36.2 && t < 36.4, happy: t > 37 }, desk: true };
  if (t < 38.1) { const u = seg(t, 37.6, 38.1); return { x: lerp(DESK.x - 6, 470, u), y: lerp(DESK.y, 0, u) + hop(u, 30), z: lerp(DESK.z, 650, u), f: { ...base, legL: 2, legR: 2 } }; }
  if (t < 39.1) { const u = seg(t, 38.2, 39.1); return { x: lerp(470, 572, u), y: 0, z: lerp(650, 724, u), f: runPose(t, { ...base }), run: true }; }
  if (t < 40.0) { const u = seg(t, 39.3, 39.9); return { x: 572, y: hop(u, 108) + (u >= 1 ? 0 : 0), z: 724, f: { ...base, wide: t > 39.6, legL: 2, legR: 2 }, back: true }; }
  if (t < 40.9) { const u = seg(t, 40.0, 40.9); return { x: lerp(572, 566, u), y: 0, z: lerp(724, 880, u), f: runPose(t, { ...base }), run: true, back: true }; }
  if (t < 46.0) return { hide: true, x: 566, y: 0, z: 900 };
  /* vuelve a toda velocidad, apaga el despertador, se disculpa y se va */
  if (t < 47.5) { const u = sm(seg(t, 46.0, 47.5)); return { x: lerp(566, NIGHT.x1 + 14, u), y: 0, z: lerp(880, NIGHT.z0 - 18, u), f: runPose(t, { ...base, wide: true }, 1.8), run: true, flip: true, trail: true }; }
  if (t < 47.9) { const u = seg(t, 47.5, 47.9); return { x: lerp(NIGHT.x1 + 14, -486, u), y: lerp(0, 56, u) + hop(u, 40), z: lerp(NIGHT.z0 - 18, 688, u), f: { ...base, legL: 2, legR: 2 }, flip: true }; }
  if (t < 49.6) return { x: -486, y: 56, z: 688, f: { ...base, happy: t > 48.0, blink }, flip: t < 48.3 };
  if (t < 51.4) { const u = sm(seg(t, 49.6, 51.4)); return { x: lerp(-486, 566, u), y: u < .08 ? hop(u / .08, 20) + 56 * (1 - u / .08) : 0, z: lerp(688, 900, u), f: runPose(t, { ...base }, 1.8), run: true, trail: true, back: u > .9 }; }
  return { hide: true, x: 566, y: 0, z: 900 };
}
/* ---------- la puerta, el diploma y el aire ---------- */
function doorAt(t) { if (t < 39.95) return 0; if (t < 40.25) return 1.72 * eio((t - 39.95) / .3); const a = t - 40.25; return 1.12 + .6 * Math.cos(a * 9) * Math.exp(-a * 2.4); }
function diplomaRot(t) { if (t < 40.27) return 0; const a = t - 40.27; return .1 * Math.sin(a * 24) * Math.exp(-a * 2.2) + .055 * sm(a / .5); }
const gustAt = t => t < 40.0 ? 0 : 1.6 * Math.exp(-(t - 40.0) * 1.1) * sm((t - 40.0) / .15) + (t > 46 && t < 52 ? .25 * Math.sin((t - 46) / 6 * PI) : 0);
/* ---------- sábana horneada ---------- */
let SHEET = null;
function sheetBake() {
  const mat = { t: 'box', x0: BED.x0 + 4, x1: BED.x1 - 4, y0: BED.top, y1: 0, z0: BED.z0 + 4, z1: BED.z1 - 4 };
  SHEET = clothBake({ nx: 19, ny: 13, t0: TJ - .02, t1: TJ + 6.5, settle: 2.6, iter: 7, drag: .9, friction: .6, bend: .2, g: 1.05,
    at: (u, v) => [lerp(BED.x0 + 14, BED.x1 + 22, u), BED.top - 52, lerp(BED.z0 - 22, BED.z1 + 2, v)],
    colliders: t => { const o = [mat, { t: 'box', x0: -1e4, x1: 1e4, y0: -1e4, y1: -282, z0: -1e4, z1: 1e4 }, { t: 'box', x0: -1e4, x1: 1e4, y0: -1e4, y1: 1e4, z0: 758, z1: 1e4 }, { t: 'box', x0: -1e4, x1: BED.x0 + 2, y0: -125, y1: 0, z0: 0, z1: 1e4 }];
      if (t < TJ + .12) o.push({ t: 'sph', c: [TEO_BED.x, BED.top - 10 - (t > TJ ? (t - TJ) * 900 : 0), TEO_BED.z], r: 30 }); return o; },
    kick: (t, i, j, x, y, z) => { if (t < TJ || t >= TJ + 1 / 240) return null; const d = Math.hypot(x - TEO_BED.x, z - TEO_BED.z), k = Math.exp(-d * d / (2 * 110 * 110)); return [90 * k + 40, -430 * k - 80, -250 * k - 50]; },
  });
}
const sheetBump = t => (x, y, z) => { const d = Math.hypot(x - TEO_BED.x, z - TEO_BED.z); if (d > 70) return 0; const k = Math.exp(-d * d / 1500); return k * (-2.2 * Math.sin(t * 1.4) - (t > 19.6 && t < 21.6 ? 10 * Math.abs(Math.sin((t - 19.6) * 7)) : 0)); };
/* ---------- muebles en la lista de profundidad ---------- */
function drawBed(t, o = {}) {
  /* cabecera de listones (plano en x = -440) */
  vplane(PROPS.head, [BED.x0, BED.z1], [BED.x0, BED.z0], -122, 0); amb3([[BED.x0, -122, BED.z1], [BED.x0, -122, BED.z0], [BED.x0, 0, BED.z0], [BED.x0, 0, BED.z1]], .38);
  /* armazón y colchón */
  box3({ x0: BED.x0, x1: BED.x1, y0: -30, y1: 0, z0: BED.z0, z1: BED.z1 }, { front: PROPS.woodA, right: PROPS.woodB, top: [120, 80, 52] });
  amb3([[BED.x0, -30, BED.z0], [BED.x1, -30, BED.z0], [BED.x1, 0, BED.z0], [BED.x0, 0, BED.z0]], .3);
  box3({ x0: BED.x0 + 4, x1: BED.x1 - 4, y0: BED.top, y1: -30, z0: BED.z0 + 4, z1: BED.z1 - 4 }, { front: PROPS.mattress, right: PROPS.mattress, top: PROPS.mattTop });
  amb3([[BED.x0 + 4, BED.top, BED.z0 + 4], [BED.x1 - 4, BED.top, BED.z0 + 4], [BED.x1 - 4, -30, BED.z0 + 4], [BED.x0 + 4, -30, BED.z0 + 4]], .22);
  solOn({ id: 'matt', t: 'h', y: BED.top, x0: BED.x0 + 4, x1: BED.x1 - 4, z0: BED.z0 + 4, z1: BED.z1 - 4, ambA: .12, occ: [{ pts: [[BED.x0, -122, BED.z0], [BED.x0, -122, BED.z1], [BED.x0, 0, BED.z1], [BED.x0, 0, BED.z0]], a: .9 }] });
  /* almohadas en la cabecera */
  bill(PROPS.pillow[0], BED.x0 + 46, BED.top - (o.pb ? o.pb(0) : 0), BED.z1 - 40); bill(PROPS.pillow[1], BED.x0 + 40, BED.top - (o.pb ? o.pb(1) : 0), BED.z0 + 60);
}
function drawNightstand(t) {
  const N = NIGHT; box3({ x0: N.x0, x1: N.x1, y0: N.top, y1: 0, z0: N.z0, z1: N.z1 }, { front: PROPS.night, right: PROPS.woodB, top: PROPS.woodA });
  amb3([[N.x0, N.top, N.z0], [N.x1, N.top, N.z0], [N.x1, 0, N.z0], [N.x0, 0, N.z0]], .32);
  /* vaso de agua y un libro */
  box3({ x0: N.x0 + 6, x1: N.x0 + 30, y0: N.top - 4, y1: N.top, z0: N.z0 + 26, z1: N.z0 + 60 }, { front: [118, 36, 40], top: [228, 216, 190], right: [236, 226, 206] });
  drawClock(t);
}
function clockText(t) { if (t > 400) return t < S6.ZERO - 26 ? '23:58' : t < S6.ZERO ? '23:59' : '00:00'; return t < 14.4 ? '07:14' : t < 58 ? '07:15' : '07:16'; }
const alarmOn = t => t >= 14.4 && t < 47.9;
function drawClock(t) {
  const x0 = -526, x1 = -478, z = 682, y0 = -80, y1 = -56;
  box3({ x0, x1, y0, y1, z0: z, z1: z + 18 }, { top: [56, 56, 62], right: [36, 36, 40] });
  vplane(PROPS.clock, [x0, z], [x1, z], y0, y1);
  const blinkOn = !alarmOn(t) || Math.floor(t * 2.2) % 2 === 0, a = PJ(x0 + 3, y0 + 3, z), b = PJ(x1 - 3, y0 + 16, z), hh = (b[1] - a[1]) * .78;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const A = toPx(a), B = toPx(b), hp = (B[1] - A[1]) * .78;
  seg7(ctx, clockText(t), A[0] + (B[0] - A[0]) * .1, A[1] + (B[1] - A[1]) * .11, hp, blinkOn ? 'rgb(255,60,48)' : 'rgba(120,20,20,.6)', 'rgba(90,14,14,.35)'); ctx.restore(); T0();
  if (blinkOn) { const c = PJ((x0 + x1) / 2, y0 + 9, z); LGT(c[0], c[1], (alarmOn(t) ? 90 : 50) * PS(z), '255,60,40', alarmOn(t) ? .7 : .35); }
}
function drawShelf() {
  const X0 = 90, X1 = 300, Z0 = 726, Z1 = 760, Y0 = -228;
  box3({ x0: X0, x1: X1, y0: Y0, y1: 0, z0: Z0, z1: Z1 }, { front: PROPS.shelf, left: PROPS.woodB, top: [110, 74, 50] });
  amb3([[X0, Y0, Z0], [X1, Y0, Z0], [X1, 0, Z0], [X0, 0, Z0]], .28); amb3([[X0, Y0, Z1], [X0, Y0, Z0], [X0, 0, Z0], [X0, 0, Z1]], .45);
}
function drawDesk(t, T_) {
  const X0 = 320, X1 = 470, Z0 = 690, Z1 = 760, Y0 = -76, wood = PROPS.woodA;
  for (const [x, z] of [[X0 + 4, Z0 + 4], [X1 - 8, Z0 + 4], [X0 + 4, Z1 - 8], [X1 - 8, Z1 - 8]]) box3({ x0: x, x1: x + 5, y0: Y0 + 4, y1: 0, z0: z, z1: z + 5 }, { front: [86, 56, 38], left: [70, 46, 32], right: [70, 46, 32] });
  box3({ x0: X0, x1: X1, y0: Y0 + 4, y1: Y0 + 14, z0: Z0 + 2, z1: Z1 }, { front: wood });
  box3({ x0: X0 - 2, x1: X1 + 2, y0: Y0, y1: Y0 + 4, z0: Z0, z1: Z1 }, { front: [92, 60, 40], top: PROPS.desk, left: [80, 52, 36] });
  amb3([[X0 - 2, Y0, Z0], [X1 + 2, Y0, Z0], [X1 + 2, Y0 + 14, Z0], [X0 - 2, Y0 + 14, Z0]], .3); amb3([[X0 - 2, Y0, Z1], [X1 + 2, Y0, Z1], [X1 + 2, Y0, Z0], [X0 - 2, Y0, Z0]], .2);
  if (t < 36.2) hplane(PROPS.note, DESK.x - 6, DESK.x + 38, 702, 732, Y0 - .5);
  const wob = t > 36.1 && t < 37.4 ? Math.sin((t - 36.1) * 30) * .12 * Math.exp(-(t - 36.1) * 3) : 0;
  bill(PROPS.mug, 430, Y0, 730, { rot: wob, px: 0, py: 0 });
}
function drawWallDecor(t) {
  bill(PROPS.cuts, -240, -112, 756); bill(PROPS.knives, -95, -150, 756);
  solOn({ id: 'poster', t: 'vz', z: 755.5, x0: -300, x1: -40, y0: -262, y1: -112, ambA: 0, occ: ESX.occWall || [] });
  const r = diplomaRot(t); bill(PROPS.diploma, 655, -206, 757, { rot: r, px: 0, py: 0 });
  const nail = PJ(655, -206, 757); ctx.fillStyle = 'rgb(60,50,44)'; ctx.beginPath(); ctx.arc(nail[0], nail[1], Math.max(.6, PS(757) * 1), 0, TAU); ctx.fill();
  bill(PROPS.jacket, 498, -196, 757, { rot: Math.sin(t * .6) * .01 + gustAt(t) * .03 * Math.sin(t * 7), px: 0, py: 0 });
}
/* ---------- Teo ---------- */
function drawTeo(t, B) {
  if (B.hide) return;
  const id = 'teo', f = { ...(B.f || {}) }, lit = solIn([B.x, -(B.y || 0) - 40, B.z]);
  if (!B.air && !B.under && !B.desk) pxShadow(id, B.x, B.z, B.y || 0);
  if (B.desk || (B.y > 50 && Math.abs(B.x + 486) < 30)) pxShadow(id, B.x, B.z, 0, { a: .25 });
  if (B.trail) for (let k = 1; k <= 3; k++) { const P = teoAt(t - k * .035); if (P.hide) continue; pxDraw(id, P.f, P.x, P.y, P.z, { flip: P.flip, a: .28 - k * .07 }); }
  pxDraw(id, f, B.x, B.y, B.z, { flip: B.flip, crop: B.crop !== undefined ? B.crop + 6 : undefined, sq: B.sq, rot: B.rot, lit: lit * SOL.k });
}
/* ---------- la escena completa en t ---------- */
function drawEstudio(t) {
  const p = phys(t), B = teoAt(t), gust = gustAt(t);
  /* sombras dinámicas: monstera, sábana, Teo */
  ESX.occWall = monOcc(t, gust);
  SOL.dyn = clothOcc(SHEET, p, .55).concat(B.hide ? [] : [pxOcc('teo', B.x, B.y || 0, B.z, { w: 18, h: 22 })]);
  ESX.occFloor = [{ pts: [[BED.x0, BED.top, BED.z1], [BED.x1, BED.top, BED.z1], [BED.x1, BED.top, BED.z0], [BED.x0, BED.top, BED.z0]], a: .9 }, { pts: [[BED.x0, BED.top, BED.z0], [BED.x1, BED.top, BED.z0], [BED.x1, 0, BED.z0], [BED.x0, 0, BED.z0]], a: .9 }];
  estudioShell(t);
  drawWallDecor(t);
  put(740, drawShelf); put(725, () => drawDesk(t)); put(705, () => drawMonstera(t, gust)); put(700, () => drawBed(t)); put(690, () => drawNightstand(t));
  if (t < 31.45) put(CLOGS.z + 2, () => bill(PROPS.clogs, CLOGS.x, 0, CLOGS.z));
  put(626, () => bill(PROPS.clothes, -185, 0, 626));
  /* la sábana (encima de la cama mientras está; al volar, su centro decide) y Teo */
  const Pf = clothAt(SHEET, p); let zc = 0; for (let k = 2; k < Pf.length; k += 3) zc += Pf[k]; zc /= Pf.length / 3;
  let yc = 0; for (let k = 1; k < Pf.length; k += 3) yc += Pf[k]; yc /= Pf.length / 3;
  put(yc > -22 ? 699 : Math.min(zc, 669), () => clothDraw(SHEET, p, { bump: p < TJ ? sheetBump(t) : null, c: [242, 238, 228] }));
  put(B.under ? 669.5 : B.z - .5, () => drawTeo(t, B));
  /* polvo: el del aire, el de la sábana, el que cae del marco y del suelo al aterrizar la sábana */
  const room = { x0: -560, x1: 700, y0: -290, y1: -5, z0: 300, z1: 755 }, gx = gust * 30;
  let motes = dustAmbient(t, room, 320, 1).map(m => (m.x += gx * (1 - Math.abs(m.z - 700) / 500), m));
  motes = motes.concat(dustBurst(p, TJ + .03, { x0: BED.x0 + 20, x1: BED.x1 - 10, y0: BED.top - 30, y1: BED.top - 5, z0: BED.z0, z1: BED.z1 - 10 }, 520, 7, { vx: 220, vy: 230, vz: 170, wx: -40, life: 20, spread: .35 }));
  motes = motes.concat(dustBurst(p, TJ + 1.35, { x0: BED.x0 - 40, x1: BED.x1 + 40, y0: -12, y1: -2, z0: 520, z1: 600 }, 160, 9, { vx: 160, vy: 80, vz: 90, life: 14 }));
  motes = motes.concat(dustBurst(t, 40.3, { x0: 630, x1: 680, y0: -210, y1: -200, z0: 750, z1: 756 }, 40, 3, { vx: 30, vy: -20, vz: 20, life: 8, a: .8 }));
  dustPut(motes, { bands: [[0, 560], [560, 650], [650, 2000]], dim: .07, bright: .95 });
  flush();
  solShafts(ES.ZB, SOL.shaft * (1 + .5 * clamp(dustDens(p))));
}
const dustDens = p => p < TJ ? 0 : Math.exp(-(p - TJ - 1) * .25);
