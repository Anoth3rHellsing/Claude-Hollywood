/* =====================================================================
   ESCENA 2 · EL FRENESÍ DE LA CAFETERÍA (07:35)
   2a (61,5–86,6) calle Almagre: travelling, charco saltado, vapor de la rejilla, derrape frente a Molienda
   2b (86,6–122,6) dentro: la puerta y su campanilla, derrape sobre la baldosa hidráulica, Valeria, la Vaporetta
       con sus chorros de vapor, insertos de la vitrina y los jarabes, el vaso que se desliza por el mármol,
       las servilletas que salen volando, y Valeria que se queda negando con la cabeza.
   ===================================================================== */
const S2 = { A: 61.5, B: 86.6, END: 122.6, V: 410, X0: -300 };
const PUD_JUMP = 3000;
/* ---------- calle ---------- */
function teoCalle(t) {
  const base = { clogs: true, top: 'cuaderno' }, stopT = S2.A + (CA.END - 100 - S2.X0) / S2.V;
  if (t < stopT) { const x = S2.X0 + S2.V * (t - S2.A), j0 = PUD_JUMP - 160, j1 = PUD_JUMP + 160; let y = 0, f = runPose(t, { ...base, wide: Math.abs(t - 64.5) < 1.6 }, 1.1);
    if (x > j0 && x < j1) { const u = (x - j0) / (j1 - j0); y = hop(u, 62); f = { ...base, legL: 2, legR: 2, happy: true }; }
    return { x, y, z: CA.ZT, f, run: y === 0 }; }
  const a = t - stopT; if (a < .55) return { x: CA.END - 100 + 46 * (1 - Math.pow(1 - a / .55, 2)), y: 0, z: CA.ZT, f: { ...base, wide: true }, skid: a };
  const xs = CA.END - 54; if (t < 85.8) return { x: xs, y: 0, z: CA.ZT, f: { ...base, blink: (t * 3) % 1 < .1 } };
  const u = seg(t, 85.8, 86.6); return { x: lerp(xs, CA.END, u), y: 0, z: lerp(CA.ZT, CA.ZF - 20, u), f: runPose(t, base), back: true, run: true };
}
function camCalle(t) { const B = teoCalle(Math.min(t, 84.9)), k = sm((t - 83.4) / 2.2); return { x: lerp(B.x + 150, CA.END - 30, k), y: lerp(-120, -150, k), zoom: lerp(.86, 1.0, k), ty: lerp(150, 110, k) }; }
const gustGrate = t => { const tx = S2.A + (GRATE.x - S2.X0) / S2.V, d = t - tx; return d > 0 && d < 3 ? .9 * Math.exp(-d * 1.2) * Math.sin(Math.min(1, d * 4) * PI / 2) : 0; };
function drawCalleScene(t) {
  const B = teoCalle(t);
  drawCalle(t, {
    gust: gustGrate,
    refl: () => { if (!B.hide && B.y < 30) pxReflect('teo', B.f, B.x, B.y, B.z, t, { a: .45, flip: B.flip }); },
    items: put_ => put_(B.z - .5, () => { pxShadow('teo', B.x, B.z, B.y); pxDraw('teo', B.f, B.x, B.y, B.z, { flip: B.flip }); if (B.skid !== undefined) { const [fx, fy] = pxFoot(B.x, 0, B.z); pxBurst(fx - 10 * pxCell('teo', B.z), fy, pxCell('teo', B.z), B.skid, 10, 4, [[200, 200, 196], [150, 150, 150]], 10, 8, .6); } }),
    fx: t2 => { const tj = S2.A + (PUD_JUMP - 160 - S2.X0) / S2.V, tl = S2.A + (PUD_JUMP + 160 - S2.X0) / S2.V; for (const [ts, xx] of [[tj, PUD_JUMP - 150], [tl, PUD_JUMP + 150]]) { const a = t2 - ts; if (a > 0 && a < .8) { const [fx, fy] = pxFoot(xx, 0, CA.ZT), c = pxCell('teo', CA.ZT); pxBurst(fx, fy, c, a, 14, 9, [[200, 220, 236], [160, 184, 204], [240, 248, 252]], 12, 14, .8); } } },
  });
}
/* ---------- cafetería ---------- */
const CAFE = { door: [86.6, 114.2], cup0: 110.0, cup1: 110.55, nap: 114.3 };
function cafeDoor(t) { let a = 0; for (const t0 of CAFE.door) { const d = t - t0; if (d < 0 || d > 2.2) continue; a = Math.max(a, d < .3 ? 1.35 * eio(d / .3) : d < 1.2 ? 1.35 : 1.35 * (1 - eio((d - 1.2) / .6)) + (d > 1.8 ? .06 * Math.sin((d - 1.8) * 30) * Math.exp(-(d - 1.8) * 8) : 0)); } return Math.max(0, a); }
function teoCafe(t) {
  const base = { clogs: true, top: 'cuaderno' }, cup = t > CAFE.cup1;
  if (t < 86.8) return { hide: true };
  if (t < 88.4) { const u = seg(t, 86.8, 88.4); return { x: lerp(-640, 150, u), y: 0, z: lerp(670, 585, u), f: runPose(t, { ...base, wide: true }), run: true }; }
  if (t < 89.4) { const a = (t - 88.4) / 1.0; return { x: 150 + 150 * (1 - Math.pow(1 - a, 2.2)), y: 0, z: 585, f: { ...base, wide: true, legL: 1 }, skid: t - 88.4, rot: -.12 * (1 - a) }; }
  if (t < 109.2) { const look = t > 96.5 && t < 106 ? { happy: t > 100 } : { blink: (t * .45) % 1 < .05 }; return { x: 300, y: Math.abs(Math.sin(t * 6)) * (t > 92.6 && t < 94.5 ? 5 : 0), z: 585, f: { ...base, ...look, wide: t > 92.6 && t < 94.5 } }; }
  if (t < 109.7) { const u = seg(t, 109.2, 109.7); return { x: lerp(300, 430, u), y: lerp(0, 105, u) + hop(u, 40), z: lerp(585, 702, u), f: { ...base, legL: 2, legR: 2 } }; }
  if (t < 112.0) return { x: 430, y: 105, z: 702, f: { ...base, cup, happy: t > 110.7 }, counter: true };
  if (t < 112.5) { const u = seg(t, 112.0, 112.5); return { x: lerp(430, 470, u), y: lerp(105, 0, u) + hop(u, 30), z: lerp(702, 590, u), f: { ...base, cup, legL: 2, legR: 2 } }; }
  if (t < 114.9) { const u = seg(t, 112.6, 114.9); return { x: lerp(470, -700, u), y: 0, z: lerp(590, 670, u), f: runPose(t, { ...base, cup }, 1.2), run: true, flip: true }; }
  return { hide: true };
}
function valeriaAt(t) {
  const f = { blink: (t * .37 + .3) % 1 < .05 }; let x = 340, y = 105, z = 712;
  if (t > 89.6 && t < 92.4) f.happy = true; if (t > 95.0 && t < 97.6) f.wink = true;
  if (t > 96.4 && t < 101.2) { const u = seg(t, 96.4, 96.9), v = seg(t, 100.8, 101.2); x = lerp(340, 22, u) + (v > 0 ? (340 - 22) * v : 0); f.legL = Math.floor(t * 8) % 2 * (u > 0 && u < 1 ? 2 : 0); }
  if (t > 101.2 && t < 109) f.happy = (t % 3) < 1.4;
  if (t > 110.6 && t < 113) f.happy = true;
  if (t > 115.8) { f.tilt = Math.floor(t * 2.2) % 2 === 0 && t < 118.4; f.blink = t > 118.4 && t < 118.7; }
  return { x, y, z, f, flip: t > 96.4 && t < 101.2 && seg(t, 100.8, 101.2) < .5 };
}
const wandAt = t => t > 96.9 && t < 100.9 ? .08 + .5 * sm((t - 96.9) / .3) * (1 - sm((t - 100.5) / .4)) : .06;
function cupAt(t) { if (t < CAFE.cup0) return { x: 330, z: 704 }; const u = eio(seg(t, CAFE.cup0, CAFE.cup1)); return { x: lerp(330, 418, u), z: 704 }; }
function camCafe(t) {
  if (t < 89.6) return camKeys(t, [[86.6, { x: -260, y: -150, zoom: .9, ty: 40 }], [89.6, { x: -60, y: -150, zoom: .95, ty: 40 }]]);
  if (t < 96.4) return camKeys(t, [[89.6, { x: 320, y: -118, zoom: 1.95, ty: 96 }], [96.4, { x: 325, y: -118, zoom: 2.05, ty: 96 }]]);
  if (t < 101.2) return camKeys(t, [[96.4, { x: 150, y: -150, zoom: 3.0, ty: 30 }], [101.2, { x: 170, y: -150, zoom: 3.25, ty: 30 }]]);
  if (t < 103.6) return camKeys(t, [[101.2, { x: -180, y: -150, zoom: 3.2, ty: 30 }], [103.6, { x: -160, y: -150, zoom: 3.35, ty: 30 }]]);
  if (t < 106.0) return camKeys(t, [[103.6, { x: 470, y: -205, zoom: 2.7, ty: 0 }], [106.0, { x: 520, y: -205, zoom: 2.8, ty: 0 }]]);
  if (t < 109.0) return camKeys(t, [[106.0, { x: 260, y: -150, zoom: 1.15, ty: 40 }], [109.0, { x: 240, y: -150, zoom: 1.2, ty: 40 }]]);
  if (t < 112.5) return camKeys(t, [[109.0, { x: 370, y: -130, zoom: 2.0, ty: 66 }], [112.5, { x: 380, y: -130, zoom: 2.05, ty: 66 }]]);
  if (t < 115.6) { const B = teoCafe(Math.min(t, 114.7)); return { x: Math.max(-330, B.x - 120), y: -140, zoom: 1.15, ty: 50 }; }
  return camKeys(t, [[115.6, { x: 120, y: -140, zoom: 1.35, ty: 60 }], [122.6, { x: 260, y: -128, zoom: 1.7, ty: 70 }]]);
}
function drawCafeScene(t) {
  const B = teoCafe(t), V = valeriaAt(t), cp = cupAt(t);
  drawCafe(t, {
    doorAng: cafeDoor, opens: CAFE.door, wand: wandAt, napkins: CAFE.nap,
    refl: (X, Y, Wd, Ht, s) => { const c = Math.max(1, Math.round(s * U * 1.1)), vf = elencoCanvas('valeria', V.f); pxBlit(vf, X + Wd * (.88 - (V.x - 22) / 318 * .5), Y + Ht * .98, c, { flip: !V.flip, a: .55 }); if (B.counter) pxBlit(elencoCanvas('teo', B.f), X + Wd * .2, Y + Ht * .98, c, { flip: true, a: .5 }); },
    items: put_ => {
      put_(V.z - .5, () => { pxShadow('valeria', V.x, V.z, 0, { a: .2 }); pxDraw('valeria', V.f, V.x, V.y, V.z, { flip: V.flip }); });
      if (t < CAFE.cup1) put_(cp.z - .4, () => { const s = PS(cp.z), p = PJ(cp.x, MO.CT.top, cp.z); ctx.fillStyle = 'rgb(246,242,234)'; ctx.beginPath(); ctx.moveTo(p[0] - 7 * s, p[1]); ctx.lineTo(p[0] + 7 * s, p[1]); ctx.lineTo(p[0] + 9 * s, p[1] - 22 * s); ctx.lineTo(p[0] - 9 * s, p[1] - 22 * s); ctx.fill(); ctx.fillStyle = 'rgb(252,252,250)'; ctx.fillRect(p[0] - 10 * s, p[1] - 26 * s, 20 * s, 4 * s); ctx.fillStyle = 'rgb(186,142,96)'; ctx.fillRect(p[0] - 8 * s, p[1] - 15 * s, 16 * s, 6 * s); steamCols(t, { x: cp.x + 3, y: MO.CT.top - 26, z: cp.z }, { n: 2, h: 40, w: .8, a: .4, sway: 4, spread: 1 }); });
      if (!B.hide) put_(B.z - .5, () => { pxShadow('teo', B.x, B.z, B.counter ? 0 : B.y); pxDraw('teo', B.f, B.x, B.y, B.z, { flip: B.flip, rot: B.rot });
        if (B.f.cup) { const [fx, fy] = pxFoot(B.x, B.y, B.z), c = pxCell('teo', B.z); steamPixT(fx + (B.flip ? -9 : 9) * c, fy - 24 * c, c, t); }
        if (B.skid !== undefined) { const [fx, fy] = pxFoot(B.x, 0, B.z), c = pxCell('teo', B.z); pxBurst(fx - 8 * c, fy, c, B.skid % .5, 8, Math.floor(B.skid * 2), [[240, 230, 210], [200, 150, 100]], 9, 7, .5); } });
    },
  });
}
/* vapor de 8 bits saliendo del agujero de la tapa del vaso */
function steamPixT(fx, fy, cell, t) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); for (let i = 0; i < 6; i++) { const ph = (t * .8 + i / 6) % 1, x = fx + Math.round(Math.sin(t * 2.4 + i) * 1.2) * cell, y = fy - ph * 12 * cell; ctx.globalAlpha = .7 * Math.sin(ph * PI); ctx.fillStyle = 'rgb(250,248,240)'; ctx.fillRect(Math.round(x / cell) * cell, Math.round(y / cell) * cell, cell, cell); } ctx.restore(); T0(); }
const DLG2 = [
  { t: 64.0, who: 'teo', mood: 'prisa', txt: '¡Cortado doble, cortado doble, cortado doble!', face: { wide: true, clogs: true }, hold: .6 },
  { t: 79.6, who: 'teo', mood: 'prisa', txt: '¡Ya casi, ya casi!', face: { happy: true }, hold: .5 },
  { t: 89.6, who: 'valeria', mood: 'normal', txt: '¡Teo! ¿Lo de siempre? Cortado doble, sin azúcar.', face: { happy: true }, hold: .3 },
  { t: 92.6, who: 'teo', mood: 'prisa', txt: '¡Sí, sí, sí! ¡Hoy viene la Guía Brújula!', face: { wide: true }, hold: .4 },
  { t: 95.0, who: 'valeria', mood: 'normal', txt: 'Uy. Entonces que sea cortado TRIPLE.', face: { wink: true }, hold: .6 },
  { t: 110.7, who: 'valeria', mood: 'normal', txt: '¡Corre, cazo, corre!', face: { happy: true }, hold: .5 },
  { t: 112.6, who: 'teo', mood: 'prisa', txt: '¡Gracias, Vale!', face: { happy: true }, hold: .5 },
  { t: 116.2, who: 'valeria', mood: 'normal', txt: 'Ese cazo... algún día va a llegar temprano.', face: { tilt: true }, hold: 1.2 },
];
