/* =====================================================================
   ESCENA 5 · AVANCE RÁPIDO DEL TURNO (13:20 → 23:00) — 312 a 364 s, cámara fija (el general de la cocina)
   el reloj vuela · la Tikket escupe comandas en serpentina que cruzan el pase y se amontonan en el suelo ·
   Teo y Rosa son estelas · llamaradas que van y vienen · el vapor llena la cocina · manchas en el suelo y el pase ·
   torres de platos · limpieza: todo queda limpio y mojado · Rosa se despide · las luces se apagan una a una
   con un «clack» · quedan el matamoscas azul y el cartel de salida · Teo arrastra los zuecos hasta la puerta.
   ===================================================================== */
const S5 = { A: 312.0, CLEAN: 343.5, SLOW: 349.5, END: 364.0 };
const ff = t => sm(seg(t, S5.A, S5.A + 3)) * (1 - sm(seg(t, S5.SLOW - 3, S5.SLOW - .6)));   // cuánto «vuela» el tiempo
function clock5(t) { const m = t < S5.SLOW + 1 ? lerp(800, 1376, eio(seg(t, S5.A, S5.SLOW + 1))) : 1376 + (t - S5.SLOW - 1) / 60 * 6; const h = Math.floor(m / 60), mm = m - h * 60; return [(h % 12) + mm / 60, mm, h]; }
const hhmm = t => { const [, mm, h] = clock5(t), H12 = ((h + 11) % 12) + 1; return `${String(H12).padStart(2, '0')}:${String(Math.floor(mm)).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`; };
/* caos que crece y limpieza */
const chaos = t => sm(seg(t, S5.A, S5.CLEAN - 6)) * (1 - sm(seg(t, S5.CLEAN, S5.CLEAN + 4.5)));
const LIGHTS5 = { s1: 357.4, s2: 357.9, hood: 358.4, p0: 358.9, p1: 359.15, p2: 359.4 };
function power5(t) { const o = {}; for (const k in LIGHTS5) o[k] = t < LIGHTS5[k] ? 1 : 0; o.fire = t < S5.SLOW ? (.65 + .35 * Math.sin(t * 9)) * (t < S5.CLEAN + 2 ? 1 : 1 - seg(t, S5.CLEAN + 2, S5.SLOW)) : 0; return o; }
const dark5 = t => t < LIGHTS5.s1 ? 0 : t < LIGHTS5.p2 + .2 ? .25 + .55 * seg(t, LIGHTS5.s1, LIGHTS5.p2) : .8 + .2 * seg(t, LIGHTS5.p2, LIGHTS5.p2 + 1.5);
const ZAPS = [360.3, 362.6];
const zap5 = t => { let z = 0; for (const t0 of ZAPS) { const d = t - t0; if (d > 0 && d < .35) z = Math.max(z, (d < .05 ? 1 : .5 * Math.exp(-(d - .05) * 12)) * (Math.sin(d * 140) > -.3 ? 1 : .3)); } return z; };
/* llamaradas de servicio durante el avance */
const FLASH5 = (() => { const o = []; for (let t = S5.A + 2.2, k = 0; t < S5.CLEAN - 1; t += 1.1 + hsh(k, 4) * 1.9, k++) o.push([t, hsh(k, 5) < .5 ? -330 : -180]); return o; })();
function flare5(t) { let a = 0, x = -330; for (const [t0, fx] of FLASH5) { const d = t - t0; if (d > 0 && d < .7) { const v = d < .06 ? d / .06 : Math.exp(-(d - .06) * 5); if (v > a) { a = v; x = fx; } } } FLARE5X = x; return a * .7; }
let FLARE5X = -330;
const DOOR5 = (() => { const o = []; for (let t = S5.A + 1.4, k = 0; t < S5.CLEAN + 3; t += .8 + hsh(k, 6) * 1.4, k++) o.push(t); o.push(355.3, 363.0); return o; })();
function door5(t) { let a = 0; for (const t0 of DOOR5) { const d = t - t0; if (d > 0 && d < 3) a += 1.2 * Math.exp(-d * 1.8) * Math.sin(d * 6); } return Math.max(0, Math.min(1.4, a)); }
/* manchas: salsa, aceite y agua en el suelo (lado izquierdo, visible) y sobre el pase; se van con la limpieza */
const STAINS = Array.from({ length: 46 }, (_, i) => { const onPass = i % 3 === 0; return { onPass, x: onPass ? -280 + hsh(i, 1) * 760 : -470 + hsh(i, 1) * 160, z: onPass ? 432 + hsh(i, 2) * 120 : 440 + hsh(i, 2) * 440, r: (onPass ? 5 : 12) + hsh(i, 3) * (onPass ? 9 : 26), c: [[96, 40, 22], [150, 110, 40], [70, 90, 60], [200, 170, 120]][(hsh(i, 4) * 4) | 0], t0: S5.A + 1 + hsh(i, 5) * (S5.CLEAN - S5.A - 3), t1: S5.CLEAN + .3 + hsh(i, 6) * 4 }; });
function stainDraw(S, t, y) { if (t < S.t0 || t > S.t1 + .5) return; const a = clamp((t - S.t0) / .25) * (1 - clamp((t - S.t1) / .5)), P = poly3(ellP(S.x, S.z, S.r, S.r * .7, 14).map(([x, z], j) => [x + Math.sin(j * 2.3 + S.x) * S.r * .18, y, z])); if (!P) return; ctx.fillStyle = cssc(S.c, .55 * a); ctx.fill(P); }
/* suelo mojado y acero brillante al final de la limpieza */
const wet5 = t => sm(seg(t, S5.CLEAN + 1, S5.CLEAN + 4)) * (1 - .5 * sm(seg(t, 357.4, 360)));
/* torres de platos sucios en la zona de friegue (suelo, a la izquierda) y en el extremo del pase */
const TOWERS = [[-450, 560, 0], [-410, 500, 0], [-372, 600, 0], [-430, 660, 0], [445, 470, 1], [470, 520, 1]];
function towerDraw(x, z, n, y0) { const s = PS(z); for (let k = 0; k < n; k++) { const p = PJ(x, y0 - 2.4 * k, z), dirty = hsh(k, x) < .35; ctx.fillStyle = dirty ? `rgb(${226 - k % 2 * 12},${214 - k % 2 * 12},${196 - k % 2 * 10})` : `rgb(${246 - k % 2 * 16},${246 - k % 2 * 16},${244 - k % 2 * 14})`; ctx.beginPath(); ctx.ellipse(p[0] + Math.sin(k * 1.7 + x) * .6 * s, p[1], 15 * s, 4 * s, 0, 0, TAU); ctx.fill(); if (dirty && k % 3 === 0) { ctx.fillStyle = 'rgba(120,60,30,.6)'; ctx.fillRect(p[0] - 6 * s, p[1] - 1 * s, 5 * s, 1.4 * s); } } }
const towerN = (t, i) => Math.round(Math.min(30, 34 * sm(seg(t, S5.A + 2 + i * 1.3, S5.CLEAN - 2))) * (1 - sm(seg(t, S5.CLEAN + i * .35, S5.CLEAN + 1.4 + i * .35))));
/* la serpentina de comandas: sale de la Tikket, serpentea por el pase, cae por el borde y se enrolla en el suelo */
const RIB = (() => { const P = [], pr = KI.PRN, top = KI.PASS.top; P.push([pr, top - 24, 520], [pr - 2, top - 40, 516], [pr - 14, top - 30, 506]);
  for (let k = 0; k <= 14; k++) { const u = k / 14; P.push([pr - 20 - u * 150, top - 1, 495 - Math.sin(u * PI * 3) * 26]); }
  P.push([KI.PASS.x0 - 4, top + 6, 472], [KI.PASS.x0 - 10, -50, 470], [KI.PASS.x0 - 16, -6, 468]);
  for (let k = 0; k < 90; k++) { const a = k * .55, r = 22 + Math.sin(k * .37) * 4; P.push([KI.PASS.x0 - 50 + Math.cos(a) * r, -1 - k * .28, 470 + Math.sin(a) * r * .6]); }
  const L = [0]; for (let i = 1; i < P.length; i++) L.push(L[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1], P[i][2] - P[i - 1][2])); return { P, L }; })();
const ribLen = t => RIB.L[RIB.L.length - 1] * sm(seg(t, S5.A + 1, S5.CLEAN - 2)) * (t < S5.CLEAN + 1.2 ? 1 : 0);
function ribbonDraw(t) { const len = ribLen(t); if (len <= 0) return; const { P, L } = RIB; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (let i = 1; i < P.length && L[i - 1] < len; i++) { const a = PJ(...P[i - 1]), bP = L[i] <= len ? P[i] : P[i - 1].map((v, j) => lerp(v, P[i][j], (len - L[i - 1]) / (L[i] - L[i - 1]))), b = PJ(...bP), s = PS(P[i][2]);
    ctx.strokeStyle = i % 2 ? 'rgb(250,248,240)' : 'rgb(236,234,226)'; ctx.lineWidth = Math.max(1.5, 8 * s); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); if (i % 3 === 0) { ctx.strokeStyle = 'rgba(40,40,44,.55)'; ctx.lineWidth = Math.max(.6, 1 * s); ctx.beginPath(); ctx.moveTo(lerp(a[0], b[0], .2), lerp(a[1], b[1], .2) - 1.5 * s); ctx.lineTo(lerp(a[0], b[0], .7), lerp(a[1], b[1], .7) - 1.5 * s); ctx.stroke(); } } }
/* Teo y Rosa a toda velocidad: estelas */
function zipAt(who, t) { if (who === 'teo') { const st = Math.floor(t * 1.7), on = hsh(st, 9) < .45 ? 'range' : 'pass'; return on === 'range' ? { x: -380 + ((t * 230) % 640 + 640) % 640, z: 712, base: RANGEY, on } : { x: -260 + (Math.sin(t * 6.1) * .5 + .5) * 700, z: 480, base: PASSY, on }; } return { x: -200 + (Math.sin(t * 4.3 + 1) * .5 + .5) * 640, z: 490, base: PASSY, on: 'pass' }; }
function zipDraw(who, t, on) { const k = ff(t); for (let j = 3; j >= 0; j--) { const tt = t - j * .012 * (1 + k), B = zipAt(who, tt); if (B.on !== on) continue; const f = who === 'teo' ? { clogs: true, legL: Math.floor(tt * 30) % 2 * 2, legR: (Math.floor(tt * 30) + 1) % 2 * 2, wide: hsh(Math.floor(tt * 2), 3) < .4 } : { clogs: true, legL: Math.floor(tt * 26) % 2 * 2, happy: hsh(Math.floor(tt * 2), 4) < .5 }; pxDraw(who, f, B.x, B.base + Math.abs(Math.sin(tt * 20)) * 8, B.z, { a: j ? .18 + .1 * (3 - j) : 1, flip: Math.cos(tt * 6.1) < 0 }); } }
/* después del avance: Teo y Rosa vuelven a su velocidad */
function teo5(t) { if (t < S5.SLOW - .6) return null; const f = { clogs: true, tired: true };
  if (t < 360.6) { if (t > 360.3 && t < 361) { f.wide = true; f.tired = false; } return { x: 120, y: PASSY, z: 480, f, on: 'pass' }; }
  if (t < 361.6) { const u = seg(t, 360.6, 361.6); return { x: lerp(120, 380, u), y: PASSY + hop(u, 16), z: 480, f: runPose(t, f, .45), on: 'pass' }; }
  if (t < 362.2) { const u = seg(t, 361.6, 362.2); return { x: lerp(380, 520, u), y: lerp(PASSY, 0, u) + hop(u, 20), z: lerp(480, 620, u), f: { ...f, legL: 2, legR: 2 }, on: 'floor' }; }
  if (t < 363.2) { const u = seg(t, 362.2, 363.2); return { x: lerp(520, 612, u), y: 0, z: lerp(620, 885, u), f: runPose(t, f, .4), on: 'floor', back: true }; }
  return null; }
function rosa5(t) { if (t < S5.SLOW - .6) return null; const f = { clogs: true, happy: t > 352 && t < 354.6, blink: (t * .37) % 1 < .05 };
  if (t < 353.8) return { x: 330, y: PASSY, z: 490, f, flip: true };
  if (t < 354.6) { const u = seg(t, 353.8, 354.6); return { x: lerp(330, 480, u), y: PASSY, z: 490, f: { ...f, legL: Math.floor(t * 6) % 2 ? 2 : 0 } }; }
  if (t < 355.2) { const u = seg(t, 354.6, 355.2); return { x: lerp(480, 560, u), y: lerp(PASSY, 0, u) + hop(u, 18), z: lerp(490, 640, u), f, on: 'floor' }; }
  if (t < 355.9) { const u = seg(t, 355.2, 355.9); return { x: lerp(560, 615, u), y: 0, z: lerp(640, 885, u), f: { ...f, legL: Math.floor(t * 6) % 2 ? 2 : 0 }, on: 'floor' }; }
  return null; }
function scene5(t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#aab0b8'; ctx.fillRect(0, 0, W, H); ctx.restore(); T0();
  SOL.on = 0; camSet(WIDE4); const fl = flare5(t), c = chaos(t), k = ff(t);
  if (fl > .3) { SHX = Math.sin(t * 53) * 2 * fl * (H / 720); }
  const Bt = teo5(t), Br = rosa5(t);
  drawCocina(t, {
    flare: () => fl, flareX: FLARE5X, door: door5, clock: t2 => clock5(t2), power: power5, dark: dark5, zap: zap5,
    fog: t2 => .55 * c, printer: t2 => k > .05 ? 18 + (t2 * 40) % 30 : 0, tickets: t2 => t2 < S5.CLEAN ? 3 + Math.floor((t2 * 3) % 4) : t2 < S5.CLEAN + 2 ? 2 : 0, burner: t2 => .6 + .5 * k * Math.abs(Math.sin(t2 * 7)),
    floor: t2 => { for (const S of STAINS) if (!S.onPass) stainDraw(S, t2, -.4); const w = wet5(t2); if (w > .01) { ctx.save(); ctx.globalCompositeOperation = 'screen'; for (let i = 0; i < 9; i++) { const P = poly3([[-690 + i * 44, -.3, 260], [-670 + i * 44, -.3, 260], [-640 + i * 44, -.3, 880], [-660 + i * 44, -.3, 880]]); if (P) { ctx.fillStyle = `rgba(200,220,255,${.12 * w})`; ctx.fill(P); } } ctx.restore(); } },
    onRange: t2 => { castIron3D(-330, 750, t2, { smoke: c }); if (k > .02) zipDraw('teo', t2, 'range'); },
    onPass: t2 => { for (const S of STAINS) if (S.onPass) stainDraw(S, t2, KI.PASS.top - .4); TOWERS.forEach(([x, z, p], i) => { if (p) towerDraw(x, z, towerN(t2, i), KI.PASS.top); }); ribbonDraw(t2);
      const w = wet5(t2); if (w > .01) { ctx.save(); ctx.globalCompositeOperation = 'screen'; for (const x of [-200, 40, 260]) { const P = poly3([[x, KI.PASS.top - .3, 440], [x + 40, KI.PASS.top - .3, 440], [x + 90, KI.PASS.top - .3, 550], [x + 50, KI.PASS.top - .3, 550]]); if (P) { ctx.fillStyle = `rgba(230,240,255,${.35 * w})`; ctx.fill(P); } } ctx.restore(); }
      if (k > .02) { zipDraw('rosa', t2, 'pass'); zipDraw('teo', t2, 'pass'); }
      if (Br && Br.on !== 'floor') drawPx4('rosa', Br, t2, PASSY); if (Bt && Bt.on === 'pass') drawPx4('teo', Bt, t2, PASSY); },
    items: (put_, t2) => { TOWERS.forEach(([x, z, p], i) => { if (!p) put_(z, () => towerDraw(x, z, towerN(t2, i), 0)); }); if (Bt && Bt.on === 'floor') put_(Bt.z, () => drawPx4('teo', Bt, t2, 0)); if (Br && Br.on === 'floor') put_(Br.z, () => drawPx4('rosa', Br, t2, 0)); },
    fx: t2 => { if (c > .05) for (const [x, z] of [[-350, 835], [-110, 835], [-330, 750], [255, 790]]) steamCols(t2, { x, y: -170, z }, { n: 5, h: 260, w: 10, a: .2 * c, sway: 30, spread: 40, drift: -.2 }); },
  });
  postFx(t, { tone: dark5(t) > .3 ? [214, 222, 255] : [232, 240, 255], vig: .5 + .3 * dark5(t) });
  /* rótulo del reloj: corre con el avance */
  if (t > S5.A + .4 && t < 350.9) labelDraw({ t0: Math.min(t - 2, S5.A + .4), t1: 350.9, big: hhmm(t), small: t < S5.SLOW ? '▶▶ EL TURNO' : 'FIN DEL TURNO', col: t < S5.SLOW ? '#ffd84a' : '#8ab4ff' }, t);
}
const DLG5 = [
  { t: 351.0, who: 'rosa', mood: 'normal', txt: 'Buenas noches, cazo. Mañana a las ocho y media...', face: { happy: true }, hold: .2 },
  { t: 353.7, who: 'rosa', mood: 'normal', txt: '...EN PUNTO.', face: { tired: true }, hold: .6 },
  { t: 356.2, who: 'teo', mood: 'agotado', txt: '...en punto... chef...', face: { tired: true }, hold: .6 },
];
