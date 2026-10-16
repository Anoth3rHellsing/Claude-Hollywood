/* =====================================================================
   TRÁILER v2 — El Juramento Roto
   Fondos y escenas: las películas originales en acuarela (Ep. I · II · III)
   con los personajes cambiados al rig nuevo. Entre medias, primeros planos
   de manos dibujados con el motor nuevo sobre la capa superior.
   ===================================================================== */
function trReset() { }

/* punto de la mano en coordenadas de la escena (mismas cuentas que handRig) */
function handPt(o, p) { const ca = Math.cos(o.ang), sa = Math.sin(o.ang), x = p[0] * o.s, y = p[1] * o.s * (o.flip ? -1 : 1); return [o.x + x * ca - y * sa, o.y + x * sa + y * ca]; }
function sleeve(W_, ang, s, house) {
  const d = [Math.cos(ang), Math.sin(ang)], e = add(W_, d, -.19 * s);
  TINTA.fill([capsulePts(add(e, d, -900), e, .3 * s, .23 * s, 5)], 'cloth');
  if (house) { SC.house = house; TINTA.trim([[add(e, perp(d), .28 * s), add(e, perp(d), -.28 * s)]], house, 9); }
}

/* A · el juramento de los niños: tres manos con un corte en la palma; la sangre corre hacia las yemas,
   las tres gotas se juntan donde se tocan los dedos y caen como una sola */
function trOath3(t, ticks, lt) {
  bokehBG(t, 0, 0);
  const gl = ctx.createRadialGradient(0, -460, 0, 0, -460, 820); gl.addColorStop(0, 'rgba(255,200,130,.32)'); gl.addColorStop(1, 'rgba(255,200,130,0)'); ctx.fillStyle = gl; ctx.fillRect(-SW / 2, -500, SW, 1000);   // el farol, fuera de cuadro
  const S = TINTA; SC.sil = false; SC.rimCol = '255,206,140';
  const L = { d: nrm2([-.2, -1]), z: .1 }, s = 350, c = [0, 90];
  const come = eio(clamp((lt - .1) / 2.0)), press = eio(clamp((lt - 2.2) / .6));
  const HANDS = [{ a: PI / 2 - 1.05, flip: true }, { a: PI / 2, flip: false }, { a: PI / 2 + 1.05, flip: false }];
  const cutP = clamp((lt - 1.7) / .45), cuts = [];
  HANDS.forEach((h, i) => {
    const d = [Math.cos(h.a), Math.sin(h.a)], reach = lerp(1300, 1.12 * s, come) - .07 * s * press + 5 * Math.sin(t * 1.3 + i * 2) * (1 - press);
    const Wr = add(c, d, -reach), o = { x: Wr[0], y: Wr[1], s, ang: h.a, flip: h.flip };
    const R = handRig({ ...o, pose: mixHP({ ...HPOSE.abierta, sp: .35 }, HPOSE.relajada, .15 + press * .25) });
    renderHand(R, S, { L, sep: true }); sleeve(Wr, h.a, s, null);
    cuts.push({ a: handPt(o, [.1, -.07]), b: handPt(o, [.4, .08]), m: handPt(o, [.27, .01]), tip: R.fingers[2].tip });
  });
  /* el corte: una línea fina en cada palma (sugerido, sin herida) */
  if (cutP > 0) for (const k of cuts) {
    const e = L2(k.a, k.b, cutP);
    ctx.save(); ctx.lineCap = 'round'; ctx.shadowColor = 'rgba(226,40,52,.9)'; ctx.shadowBlur = 10 * U;
    ctx.strokeStyle = 'rgba(214,36,48,.95)'; ctx.lineWidth = 4.5; ctx.beginPath(); ctx.moveTo(...k.a); ctx.lineTo(...e); ctx.stroke(); ctx.restore();
  }
  /* las gotas bajan por los dedos hasta el punto donde se tocan */
  const drop = (q, r) => { ctx.fillStyle = 'rgb(176,24,38)'; ctx.beginPath(); ctx.moveTo(q[0], q[1] - r * 1.8); ctx.quadraticCurveTo(q[0] + r, q[1], q[0], q[1] + r); ctx.quadraticCurveTo(q[0] - r, q[1], q[0], q[1] - r * 1.8); ctx.fill(); };
  const f = clamp((lt - 2.9) / 1.1);
  if (lt > 2.5 && f < 1) for (const k of cuts) {
    const sw = sm((lt - 2.5) / .4), q = f < .6 ? L2(k.m, k.tip, eio(f / .6)) : L2(k.tip, c, eio((f - .6) / .4));
    ctx.save(); ctx.shadowColor = 'rgba(226,40,52,.7)'; ctx.shadowBlur = 8 * U; drop(q, 11 * sw); ctx.restore();
  }
  /* una sola gota: se forma, cae y florece abajo */
  const g = clamp((lt - 4.0) / .5), fall = clamp((lt - 4.5) / .55), land = [0, 270];
  if (lt > 4.0 && fall < 1) { const q = L2(c, land, fall * fall); ctx.save(); ctx.shadowColor = 'rgba(226,40,52,.8)'; ctx.shadowBlur = 12 * U; drop(add(q, [0, 8 + 10 * g]), 12 + 6 * g); ctx.restore(); }
  if (lt > 3.9) { const k = sm((lt - 3.9) / .4) * (1 - sm((lt - 5.4) / .8)), g2 = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], 160); g2.addColorStop(0, `rgba(255,214,150,${.35 * k})`); g2.addColorStop(1, 'rgba(255,214,150,0)'); ctx.fillStyle = g2; ctx.fillRect(c[0] - 160, c[1] - 160, 320, 320); }
  if (fall >= 1) inkBloom(land, 20 + 60 * sm((lt - 5.05) / .9), '176,24,38', .9 * (1 - sm((lt - 6) / .6)), 4);
}
/* B · las muñecas: el hilo rojo */
function trWrists(t, ticks, lt) {
  bokehBG(t, 0, -300);
  snow(t, 20, 1.2, .4);
  bigHands(t, { t0: t - lt, delay: -2, tClasp: 1e9, vein: 0, houseA: 'G', houseD: 'S' });
  const pulse = .5 + .5 * Math.sin(lt * 4); paperLight([0, 60], 4 + 6 * pulse, .5);
}
/* C · el perdón: las manos */
function trForgive(t, ticks, lt) {
  bokehBG(t, 1 - sm((lt - 4) / 3), 0); snow(t, 26, 1.1, .5);
  bigHands(t, { t0: t - lt, delay: .8, tClasp: t - lt + 3.4, tGold: t - lt + 3.5, vein: 1 - sm((lt - 3.4) / 2), houseA: 'S', houseD: 'R' });
}
/* final: las tres gotas y el título */
function trEnd(t) {
  const lt = t - FILM.ENDT;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(PAPER, 0, 0); L0s();
  const a = sm((lt - .3) / 1) * (1 - sm((lt - 6.4) / 1.4));
  bloodDrops([[-60, -260], [0, -270], [60, -260]], [0, -190], FILM.ENDT + .5, t, '176,24,38');
  if (lt > 2) goldMotes([[0, -190]], FILM.ENDT + 2, t, 20, 120);
  label('El Juramento Roto', 0, -10, { size: 84, it: false, w: '600', col: `rgba(36,26,30,${.92 * a})` });
  label('Una historia en tres lunas', 0, 50, { size: 34, col: `rgba(120,40,46,${.9 * a})` });
  label('Episodio I   —   Episodio II · La Deuda de Sangre   —   Episodio III · La Última Luna', 0, 120, { size: 22, it: false, col: `rgba(70,56,56,${.8 * sm((lt - 2.4) / 1) * (1 - sm((lt - 6.4) / 1.4))})` });
}

/* ---------- montaje ----------
   film: qué película (e1/e2/e3) y desde qué segundo; z: zoom de cámara (inicio→fin); o: centro del zoom (0..1) */
const SEGS = (() => {
  const L = [
    { d: 6.5, film: 'e1', f0: 64.5, z: [1.04, 1.22], o: [.53, .7] },            // porche, York
    { d: 6.5, draw: trOath3 },                                                     // las tres manos
    { d: 6, film: 'e1', f0: 104, z: [1, 1.12], o: [.62, .62] },                   // la orilla: Draconida
    { d: 4.5, film: 'e1', f0: 129.5, z: [1.12, 1.2], o: [.42, .66] },             // patio: inseparables
    { d: 6, film: 'e1', f0: 203, z: [1.18, 1.3], o: [.5, .64] },                  // «Solo eras conveniente»
    { d: 5, film: 'e1', f0: 362.5, z: [1.15, 1.25], o: [.52, .7] },               // nieve: escudos
    { d: 2.5, film: 'e1', f0: 404.0, z: [1.02, 1.06], o: [.5, .6], dip: .12 },    // ¡Slytherin!
    { d: 8, film: 'e1', f0: 499, z: [1.14, 1.24], o: [.6, .68] },                // el duelo
    { d: 6, draw: trWrists, dip: .4 },                                            // el hilo rojo
    { d: 5.5, film: 'e2', f0: 388, z: [1.12, 1.25], o: [.5, .7], dip: .4 },       // «Llegáis tarde»
    { d: 4.5, film: 'e2', f0: 413.5, z: [1.08, 1.16], o: [.5, .68] },             // a tres bandas
    { d: 5.5, film: 'e2', f0: 458, z: [1.14, 1.26], o: [.45, .72] },              // «Perdónanos»
    { d: 5.5, film: 'e3', f0: 371, z: [1, 1.12], o: [.55, .6], dip: .4 },         // la luna verde
    { d: 4, film: 'e3', f0: 385.5, z: [1.12, 1.2], o: [.5, .68] },                // ¡Expelliarmus!
    { d: 5, film: 'e3', f0: 423.5, z: [1.16, 1.28], o: [.48, .7] },               // Joy entrega su magia
    { d: 8, draw: trForgive },                                                     // «Te perdono»
    { d: 5, film: 'e3', f0: 472, z: [1.04, 1.12], o: [.5, .6] },                  // el juramento se rompe
    { d: 7, film: 'e3', f0: 529, z: [1.1, 1.2], o: [.45, .7], dip: .5 },          // primavera
  ];
  let t = 0; for (const s of L) { s.t0 = t; s.t1 = t + s.d; t += s.d; } return L;
})();
const ENDT = SEGS[SEGS.length - 1].t1;
const at = (i, ft) => SEGS[i].t0 + (ft - SEGS[i].f0);   // segundo de la película → segundo del tráiler

const FILM = {
  ENDT, DUR: ENDT + 8.5,
  reset: trReset,
  SHOTS: SEGS,
  SUBS: [
    [2, 6.2, 'Tres niños. Una sola luz.', ''],
    [9.2, 12.8, 'Nada nos separará.', 'los tres · York, 1879'],
    [14.4, 18.6, 'Nadie se fijó en la chica que los miraba desde la orilla.', ''],
    [at(4, 205.2), at(4, 208.9), 'Solo eras conveniente.', 'Damien'],
    [30.2, 34.2, 'Fría por fuera. Cálida por dentro.', ''],
    [46.2, 50.8, 'Un juramento de sangre no se rompe sin cobrar su precio.', ''],
    [at(9, 390.6), at(9, 393.3), 'Llegáis tarde. Como siempre.', 'Damien'],
    [at(11, 458.6), at(11, 463.3), 'Perdónanos. Demuéstrame que eres mejor que yo.', 'Damien'],
    [at(12, 373.2), at(12, 376.3), 'La luna llena salió verde.', ''],
    [SEGS[14].t0 + .4, SEGS[14].t1 - .2, 'No podía matarla. Pero sí podía quitarle algo.', ''],
    [SEGS[15].t0 + 4.2, SEGS[15].t0 + 7.6, 'Te perdono.', 'Anami'],
    [SEGS[17].t0 + 1.2, SEGS[17].t1 - .3, 'Ya no los unía ningún juramento.', ''],
  ],
  CARDS: [
    [.6, 4.4, 'Condado de York, 1879'], [SEGS[2].t0 + .3, SEGS[2].t0 + 3, 'Hogwarts, 1890'], [SEGS[7].t0 + .3, SEGS[7].t0 + 3, 'Episodio I'],
    [SEGS[9].t0 + .4, SEGS[9].t0 + 3.2, 'Episodio II · La Deuda de Sangre'], [SEGS[12].t0 + .4, SEGS[12].t0 + 3.2, 'Episodio III · La Última Luna'],
    [SEGS[17].t0 + .4, SEGS[17].t0 + 3, 'Primavera de 1896'],
  ],
  end: trEnd,
  wind: t => (t > SEGS[7].t0 && t < SEGS[8].t1) || (t > SEGS[9].t0 && t < SEGS[16].t1) ? .05 : .02,
  drone: t => t > SEGS[12].t0 && t < SEGS[15].t0 + 4 ? .1 * (1 - sm((t - SEGS[15].t0 - 2) / 2)) : t > SEGS[4].t0 && t < SEGS[4].t1 ? .05 : 0,
  pad: t => t < ENDT ? .5 : .55 * (1 - sm((t - ENDT - 5) / 3)),
  CHORDS: [
    [0, [57, 60, 64, 69]], [SEGS[2].t0, [53, 57, 60, 65]], [SEGS[3].t0, [55, 59, 62, 67]], [SEGS[4].t0, [52, 55, 58, 64]], [SEGS[5].t0, [50, 53, 57, 62]],
    [SEGS[6].t0, [52, 56, 59, 64]], [SEGS[7].t0, [50, 53, 57, 62]], [SEGS[8].t0, [45, 52, 57, 60]], [SEGS[9].t0, [52, 55, 58, 62]], [SEGS[11].t0, [48, 52, 55, 60]],
    [SEGS[12].t0, [50, 53, 56, 62]], [SEGS[15].t0, [48, 52, 55, 60]], [SEGS[15].t0 + 3.4, [53, 57, 60, 65]], [SEGS[17].t0, [53, 57, 60, 65]], [SEGS[17].t0 + 3.5, [48, 55, 60, 64]],
    [ENDT, [45, 52, 57, 64]], [ENDT + 3, [48, 52, 55, 60]],
  ],
  EVENTS: [
    [SEGS[1].t0 + 2.1, () => pluck([76, 75], .25)], [SEGS[1].t0 + 4.0, () => pluck([69, 72, 76], .35)], [SEGS[1].t0 + 5.05, () => thump(AU.ac.currentTime, .3)],
    [SEGS[2].t0 + 1, () => pluck([72, 74, 76, 79], .3)],
    [at(4, 205.4), () => pluck([64, 63], .7)], [SEGS[4].t1 - .3, () => { thump(AU.ac.currentTime, .5); whoosh(.3, .25); }],
    [SEGS[5].t0 + .4, () => chime([67, 74], .08)],
    [SEGS[6].t0 + .05, () => { thump(AU.ac.currentTime, .55); chime([71, 76, 83], .04); }],
    ...[0, .5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7].map(x => [SEGS[7].t0 + .2 + x, () => thump(AU.ac.currentTime, .2)]),
    [at(7, 500), () => whoosh(.35, .25)], [at(7, 506), () => { whoosh(.5, .25); thump(AU.ac.currentTime, .6); sparkle(6, .5); }],
    [SEGS[8].t0 + 1.2, () => pluck([57, 60, 64, 62], .5)], [at(9, 390.6), () => pluck([62, 61], .8)],
    ...[0, .6, 1.2, 1.8, 2.4, 3, 3.6].map(x => [SEGS[10].t0 + .2 + x, () => thump(AU.ac.currentTime, .22)]),
    [SEGS[12].t0 + 1.5, () => thump(AU.ac.currentTime, .4)], [at(13, 386.6), () => { whoosh(.35, .3); thump(AU.ac.currentTime, .4); }],
    [SEGS[14].t0 + 1.2, () => sparkle(10, 2)],
    [SEGS[15].t0 + 3.4, () => chime([72, 76, 79, 84], .16)], [SEGS[15].t0 + 5.5, () => sparkle(14, 2)],
    [SEGS[16].t0 + 1.5, () => sparkle(12, 2.5)], [SEGS[17].t0 + 2.4, () => chime([79, 84], .2)],
    [ENDT + 1.4, () => pluck([69, 72, 76, 81], .4)], [ENDT + 3.4, () => chime([72, 76, 79], .25)],
  ],
};
