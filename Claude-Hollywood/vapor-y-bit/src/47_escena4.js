/* =====================================================================
   ESCENA 4 · BRASA Y BRUMA (08:30 → 13:00) — 182 a 312 s
   Teo entra por la puerta batiente y derrapa sobre el pase · Rosa Mijares, segunda de cocina, lo espera con el reloj
   («Llegas tarde, Cazorla») · la Guía Brújula viene a la una, mesa siete · mise en place: cuchillos Tsukiyo, roners a
   62,5 °C, binchotan · RECETA 1 (inserto A): sellado, vuelta, coñac y llamarada (plano general: la cocina se enciende
   de naranja, los cucharones proyectan sombras enormes en el azulejo), arroser · salto a las 13:00: la comanda de la
   mesa siete · RECETA 2 (inserto B): el emplatado bajo las lámparas · «¡Servicio!» · la espera · el plato vuelve limpio.
   ===================================================================== */
const S4 = { A: 182.0, END: 312.0, IN: 184.5 };
const PASSY = -KI.PASS.top, RANGEY = -KI.RANGE.top;
const CAMDBG = (() => { const q = new URLSearchParams(location.search).get('cam'); return q ? q.split(',').map(Number) : null; })();
/* ---------- quién está dónde ---------- */
function teo4(t) {
  const base = { clogs: true }, carry = { clogs: true, top: 'cuaderno', cup: true };
  if (t < S4.IN + .15) return { hide: true };
  /* sale por la puerta del fondo, corre hacia el pase por detrás (lo tapa), salta encima y derrapa sobre el acero */
  if (t < 185.5) { const u = seg(t, S4.IN + .15, 185.5); return { x: lerp(615, 540, u), y: 0, z: lerp(880, 640, u), f: runPose(t, { ...carry, wide: true }, 1.2), run: true, on: 'floor', flip: true }; }
  if (t < 186.0) { const u = seg(t, 185.5, 186.0); return { x: lerp(540, 470, u), y: 0, z: lerp(640, 600, u), f: runPose(t, carry, 1.2), run: true, on: 'floor', flip: true }; }
  if (t < 186.6) { const u = seg(t, 186.0, 186.6); return { x: lerp(470, 440, u), y: lerp(0, PASSY, u) + hop(u, 70), z: lerp(600, 480, u), f: { ...carry, legL: 2, legR: 2, happy: true }, on: u < .55 ? 'floor' : 'pass', flip: true }; }
  if (t < 187.6) { const a = t - 186.6; return { x: 440 - 400 * (1 - Math.pow(1 - a, 2.2)), y: PASSY, z: 480, f: { ...carry, wide: true, legL: 1 }, skid: a, rot: .1 * (1 - a), on: 'pass', flip: true }; }
  if (t < 202.9) { const f = { ...(t < 188.6 ? carry : base), blink: (t * .45) % 1 < .05 }; if (t > 192.2 && t < 197.2) { f.wide = t < 194.6; f.sweat = true; } if (t > 197.2 && t < 202.8) f.wide = t > 197.6 && t < 199.4; if (t > 201.8) { f.happy = true; f.wide = false; }
    return { x: 40, y: PASSY + (t < 189 ? Math.abs(Math.sin(t * 7)) * 4 : 0), z: 480, f, on: 'pass' }; }
  if (t < 249.6) { const f = { ...base }; if (t < 216.6) f.flat = true; else if (t < 217.4) f.wide = true; else if (t > RC.ign && t < RC.ign + 2.6) { f.wide = true; f.mouthO = t < RC.ign + 1; } else if (t > RC.butter) f.happy = (t % 3) < 1.6; else f.blink = (t * .5) % 1 < .05;
    return { x: -255, y: RANGEY, z: 712, f, flip: true, on: 'range' }; }
  if (t < 251.4) { const u = seg(t, 249.6, 251.4); return { x: lerp(-260, 160, u), y: PASSY, z: 480, f: runPose(t, { ...base, wide: true }), run: true, on: 'pass' }; }
  const f = { ...base, blink: (t * .45) % 1 < .05 };
  if (t < 256.4) { f.flat = true; return { x: 160, y: PASSY, z: 480, f, on: 'pass' }; }
  if (t < 292) { f.sweat = t > 284.6; f.wide = t > 284.6 && t < 286; return { x: 160, y: PASSY, z: 480, f, on: 'pass' }; }
  if (t < 300.6) { f.flat = true; f.sweat = true; f.blink = false; return { x: 160, y: PASSY + (t > 297.4 && t < 297.8 ? 6 : 0), z: 480, f, on: 'pass' }; }
  if (t < 302.2) return { x: 160, y: PASSY, z: 480, f: { ...base, wide: true, mouthO: true }, on: 'pass' };
  const jump = t > 306.6 && t < 308.6 ? Math.abs(Math.sin((t - 306.6) * PI * 2)) * 34 : 0;
  return { x: 160, y: PASSY + jump, z: 480, f: { ...base, happy: true, legL: jump > 4 ? 2 : 0, legR: jump > 4 ? 2 : 0 }, on: 'pass' };
}
function rosa4(t) {
  const f = { clogs: true, blink: (t * .37 + .2) % 1 < .05 }; let x = 230, y = PASSY; const flip = t < 249.6 ? t > 186.6 : true;
  const walk = (a, b, x0, x1) => { const u = seg(t, a, b); if (u > 0 && u < 1) { f.legL = Math.floor(t * 6) % 2 ? 2 : 0; f.legR = f.legL ? 0 : 2; } return lerp(x0, x1, u); };
  if (t < 202.9) x = walk(182.4, 184.2, 330, 230);
  else if (t < 249.6) x = walk(203.0, 204.4, 230, 430);
  else x = t < 283.4 ? walk(249.8, 251.0, 430, 400) : t < 285.4 ? walk(283.4, 283.9, 400, KI.BELL - 12) : walk(285.4, 286.4, KI.BELL - 12, 360);
  if (t > 184.6 && t < 186.6) f.wide = true;
  if (t > 190.4 && t < 192.0) f.tired = true;   // la mirada por encima de las gafas
  if (t > 229.0 && t < 233) f.happy = true;
  if (t > 253.6 && t < 256) f.happy = true;
  if (t > 283.9 && t < 284.6) y = PASSY + hop(seg(t, 283.9, 284.4), 26);
  if (t > 299 && t < 302) f.tired = true;
  if (t > 302.2) f.happy = true;
  return { x, y, z: 490, f, flip };
}
/* el plato: aparece al terminar el emplatado, sale por el extremo del pase (lo recoge el camarero) y vuelve limpio */
function plate4(t) { if (t < RC.endB) return null; if (t < 287.4) return { x: 280, full: true }; if (t < 288.4) return { x: lerp(280, 620, eio(seg(t, 287.4, 288.4))), full: true }; if (t < 297.6) return null; return { x: lerp(620, 280, eio(seg(t, 297.6, 298.7))), full: false }; }
const DOOR4 = [S4.IN, 288.5, 297.0];
function door4(t) { let a = 0; for (const t0 of DOOR4) { const d = t - t0; if (d > 0 && d < 4) a += 1.3 * Math.exp(-d * 1.5) * Math.sin(d * 5.5); } return Math.max(0, a); }
function clock4(t) { let m;   /* minutos desde la medianoche */
  if (t < 194.3) m = 8 * 60 + 29 + Math.max(0, t - 182) / 60; else if (t < 244) m = 510 + (t - 194.3) / 49.7 * 22; else if (t < 247.2) m = lerp(532, 780, eio(seg(t, 244, 247.2))); else m = 780 + (t - 247.2) / 65 * 20;
  const h = Math.floor(m / 60), mm = m - h * 60; return [(h % 12) + mm / 60, mm]; }
function printer4(t) { if (t > 247.2 && t < 249.3) return 42 * seg(t, 247.3, 248.8); if (t > 305) return 40 + (t - 305) * 22; return 0; }
function tickets4(t) { return t < 249.3 ? 5 : t < 305 ? 3 : 3 + Math.min(3, Math.floor((t - 305) / 1.5)); }
const flare4 = t => t >= 228.4 && t < 233.2 ? Math.min(1, flameAmp(t) * 1.3) : 0;
/* ---------- cámara ---------- */
const WIDE4 = { x: 0, y: -240, zoom: .78, ty: -24 };
function camCocina(t) {
  if (CAMDBG) return { x: CAMDBG[0], y: CAMDBG[1], zoom: CAMDBG[2], ty: CAMDBG[3] };
  const C = KI.CLK;
  if (t < 186.4) return camKeys(t, [[182, { x: -60, y: -250, zoom: .84, ty: -30 }], [186.4, { x: 40, y: -240, zoom: .9, ty: -28 }]]);
  if (t < 189.4) return camKeys(t, [[186.4, { x: 40, y: -240, zoom: .9, ty: -28 }], [189.4, { x: 100, y: -200, zoom: 1.3, ty: -10 }]]);
  if (t < 193.8) return camKeys(t, [[189.4, { x: 135, y: -150, zoom: 1.9, ty: 20 }], [193.8, { x: 135, y: -150, zoom: 1.98, ty: 20 }]]);
  if (t < 195.2) return { x: C[0], y: C[1], zoom: 5.4, ty: 0 };
  if (t < 202.9) return camKeys(t, [[195.2, { x: 135, y: -150, zoom: 2.0, ty: 20 }], [202.9, { x: 135, y: -150, zoom: 2.14, ty: 20 }]]);
  if (t < 205.4) return camKeys(t, [[202.9, { x: 40, y: -190, zoom: 6.2, ty: 40 }], [205.4, { x: 80, y: -190, zoom: 6.5, ty: 40 }]]);
  if (t < 207.8) return camKeys(t, [[205.4, { x: -560, y: -150, zoom: 3.5, ty: 20 }], [207.8, { x: -560, y: -150, zoom: 3.75, ty: 20 }]]);
  if (t < 210.4) return camKeys(t, [[207.8, { x: 230, y: -260, zoom: 3.0, ty: -600 }], [210.4, { x: 270, y: -260, zoom: 3.2, ty: -640 }]]);
  if (t < 228.4) return camKeys(t, [[210.4, { x: -270, y: -230, zoom: 2.3, ty: -300 }], [216, { x: -270, y: -230, zoom: 2.5, ty: -330 }]]);
  if (t < 233.2) return { x: -120, y: -232, zoom: .96, ty: -26 };
  if (t < 247.2) return camKeys(t, [[244, { x: C[0], y: C[1], zoom: 5.0, ty: 0 }], [247.2, { x: C[0], y: C[1], zoom: 5.6, ty: 0 }]]);
  if (t < 249.6) return { x: KI.PRN + 5, y: -118, zoom: 4.2, ty: 0 };
  if (t < 292) return camKeys(t, [[249.6, { x: 280, y: -150, zoom: 1.95, ty: 20 }], [256.4, { x: 280, y: -150, zoom: 2.05, ty: 20 }], [283, { x: 290, y: -150, zoom: 2.05, ty: 20 }], [292, { x: 290, y: -150, zoom: 2.2, ty: 20 }]]);
  if (t < 303.4) return camKeys(t, [[292, { x: 250, y: -175, zoom: 1.28, ty: 0 }], [303.4, { x: 260, y: -175, zoom: 1.45, ty: 0 }]]);
  return WIDE4;
}
const ins4 = t => (t >= 216 && t < 228.4) || (t >= 233.2 && t < 244) ? 'A' : t >= 256.4 && t < 283 ? 'B' : null;
/* ---------- personajes pixel sobre los muebles ---------- */
function pxShadowOn(id, x, y, z, a = .3) { const cell = pxCell(id, z), [fx, fy] = pxFoot(x, y, z), w = 14 * cell; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = `rgba(30,30,40,${a})`; ctx.fillRect(Math.round(fx - w / 2), Math.round(fy - cell * .5), w, cell * 2); ctx.restore(); T0(); }
function drawPx4(id, B, t, base) { if (!B || B.hide) return; pxShadowOn(id, B.x, base, B.z, .3 * clamp(1 - (B.y - base) / 60)); pxDraw(id, B.f, B.x, B.y, B.z, { flip: B.flip, rot: B.rot });
  if (B.skid !== undefined) { const [fx, fy] = pxFoot(B.x, B.y, B.z), c = pxCell(id, B.z); pxBurst(fx - 8 * c, fy, c, B.skid % .5, 10, Math.floor(B.skid * 2), [[255, 255, 255], [200, 210, 220]], 10, 8, .5); } }
function passProps(t) { if (t < 188.6) return; const s = PS(470), c = PJ(-225, KI.PASS.top, 470); ctx.fillStyle = 'rgb(246,242,234)'; ctx.beginPath(); ctx.moveTo(c[0] - 4 * s, c[1]); ctx.lineTo(c[0] + 4 * s, c[1]); ctx.lineTo(c[0] + 5 * s, c[1] - 12 * s); ctx.lineTo(c[0] - 5 * s, c[1] - 12 * s); ctx.fill(); ctx.fillStyle = 'rgb(252,252,250)'; ctx.fillRect(c[0] - 5.5 * s, c[1] - 14 * s, 11 * s, 2.4 * s); ctx.fillStyle = 'rgb(186,142,96)'; ctx.fillRect(c[0] - 4.5 * s, c[1] - 8 * s, 9 * s, 3 * s);
  const P = poly3([[-280, KI.PASS.top - .5, 455], [-246, KI.PASS.top - .5, 452], [-244, KI.PASS.top - .5, 476], [-278, KI.PASS.top - .5, 479]]); if (P) { ctx.fillStyle = 'rgb(244,238,222)'; ctx.fill(P); ctx.strokeStyle = 'rgb(40,40,46)'; ctx.lineWidth = Math.max(1, s * .6); ctx.stroke(P); } }
function scene4(t) {
  const ins = ins4(t);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = ins ? '#141416' : '#aab0b8'; ctx.fillRect(0, 0, W, H); ctx.restore(); T0();
  if (ins === 'A') { const fa = flameAmp(t); if (fa > .3) { SHX = Math.sin(t * 61) * 4 * fa * (H / 720); SHY = Math.cos(t * 47) * 3 * fa * (H / 720); } insertPan(t); postFx(t, { tone: [255, 236, 220], vig: .72 }); return; }
  if (ins === 'B') { insertPlate(t); postFx(t, { tone: [255, 230, 220], vig: .72 }); return; }
  SOL.on = 0; camSet(camCocina(t)); const fl = flare4(t); if (fl > .3) { SHX = Math.sin(t * 53) * 3 * fl * (H / 720); SHY = Math.cos(t * 41) * 2 * fl * (H / 720); }
  const Bt = teo4(t), Br = rosa4(t), pl = plate4(t);
  drawCocina(t, {
    flare: flare4, flareX: -330, door: door4, clock: clock4, printer: printer4, tickets: tickets4,
    burner: t2 => t2 > 210 ? 1 : .7,
    onRange: t2 => { castIron3D(-330, 750, t2, { steak: t2 > RC.drop, crust: t2 > RC.flip + .3, smoke: t2 > 210 ? (t2 > RC.drop ? 1 : .5) : 0 }); flame3D(t2, -330, 750, fl); if (Bt.on === 'range') drawPx4('teo', Bt, t2, RANGEY); },
    onPass: t2 => { passProps(t2); if (pl && pl.x < 512) plate3D(pl.x, 480, pl.full, t2); drawPx4('rosa', Br, t2, PASSY); if (Bt.on === 'pass') drawPx4('teo', Bt, t2, PASSY); },
    items: (put_, t2) => { if (Bt.on === 'floor' && !Bt.hide) put_(Bt.z, () => drawPx4('teo', Bt, t2, 0)); },
  });
  postFx(t, { tone: [232, 240, 255], vig: .5 });
}
/* ---------- diálogos y rótulos ---------- */
const DLG4 = [
  { t: 188.0, who: 'teo', mood: 'prisa', txt: '¡Llegué! ¡Llegué! ¡Buenos días, chef!', face: { wide: true }, hold: .3 },
  { t: 190.4, who: 'rosa', mood: 'normal', txt: 'Llegas tarde, Cazorla.', face: { tired: true }, hold: .5 },
  { t: 192.3, who: 'teo', mood: 'prisa', txt: '¡Son las ocho y veintinueve!', face: { wide: true, sweat: true }, hold: .3 },
  { t: 195.4, who: 'rosa', mood: 'tecnico', txt: 'Ocho y treinta.', face: {}, hold: .7 },
  { t: 197.3, who: 'rosa', mood: 'tecnico', txt: 'La Guía Brújula llega a la una. Mesa siete.', face: {}, hold: .25 },
  { t: 200.6, who: 'rosa', mood: 'tecnico', txt: 'Lo de siempre... pero perfecto.', face: { happy: true }, hold: .2 },
  { t: 203.1, who: 'teo', mood: 'tecnico', txt: 'Sí, chef. Cuchillos Tsukiyo, afilados.', face: { happy: true }, hold: .1 },
  { t: 205.6, who: 'teo', mood: 'tecnico', txt: 'Roners a sesenta y dos y medio.', face: {}, hold: .1 },
  { t: 208.0, who: 'teo', mood: 'tecnico', txt: 'Binchotan al rojo.', face: {}, hold: .7 },
  { t: 211.2, who: 'teo', mood: 'tecnico', txt: 'Sartén de hierro, humeando. Ahora.', face: { flat: true }, hold: 1.4 },
  { t: 222.2, who: 'teo', mood: 'tecnico', txt: 'Vuelta... y costra perfecta.', face: { happy: true }, hold: .8 },
  { t: 225.0, who: 'teo', mood: 'prisa', txt: '¡Coñac! ¡Atrás todos!', face: { wide: true }, hold: .4 },
  { t: 229.2, who: 'rosa', mood: 'normal', txt: '¡Eso es, cazo!', face: { happy: true }, hold: 1.0 },
  { t: 235.0, who: 'teo', mood: 'tecnico', txt: 'Arroser: mantequilla noisette... y bañar, bañar, bañar.', face: { happy: true }, hold: .8 },
  { t: 247.7, who: 'rosa', mood: 'normal', txt: '¡Mesa siete, marchando! Es ella: la Guía.', face: { wide: true }, hold: .6 },
  { t: 251.0, who: 'teo', mood: 'tecnico', txt: 'Respira, Teo. Es solo un plato...', face: { flat: true, sweat: true }, hold: .3 },
  { t: 253.7, who: 'rosa', mood: 'normal', txt: 'Es TU plato. Hazlo como tú sabes.', face: { happy: true }, hold: .6 },
  { t: 260.8, who: 'teo', mood: 'tecnico', txt: 'Lágrima de jugo.', face: { flat: true }, hold: 1.2 },
  { t: 266.0, who: 'teo', mood: 'tecnico', txt: 'Clorofila... azafrán.', face: { flat: true }, hold: 1.4 },
  { t: 276.7, who: 'teo', mood: 'sueno', txt: '...y el oro. No respires.', face: { flat: true, sweat: true }, hold: .8 },
  { t: 284.6, who: 'rosa', mood: 'prisa', txt: '¡SERVICIO! ¡Mesa siete!', face: { wide: true }, hold: .8 },
  { t: 299.0, who: 'rosa', mood: 'sueno', txt: '...Plato limpio.', face: { tired: true }, hold: .2 },
  { t: 300.8, who: 'teo', mood: 'prisa', txt: '¿¡LE GUSTÓ!?', face: { wide: true, mouthO: true }, hold: .3 },
  { t: 302.3, who: 'rosa', mood: 'normal', txt: 'No te emociones, cazo. Quedan sesenta cubiertos.', face: { happy: true }, hold: .6 },
  { t: 306.9, who: 'teo', mood: 'prisa', txt: '¡Sí, chef!', face: { happy: true }, hold: .8 },
];
const LABELS4 = [{ t0: 182.6, t1: 187.6, big: '08:30 AM', small: 'BRASA Y BRUMA' }, { t0: 244.6, t1: 249.4, big: '01:00 PM', small: 'MESA 7 · GUÍA BRÚJULA', col: '#ff8a5a' }];
