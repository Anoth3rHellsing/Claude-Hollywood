/* =====================================================================
   ENTRE EL VAPOR Y EL BIT · la película (fase 1: Escena 1, el estudio, 07:15)
   ===================================================================== */
/* cámara por tramos: [t, {x, y, zoom, ty}] con interpolación suave */
function camKeys(t, K) {
  if (t <= K[0][0]) return K[0][1];
  for (let i = 0; i < K.length - 1; i++) { const [a, A] = K[i], [b, B] = K[i + 1]; if (t < b) { if (B.cut) return A; const u = eio((t - a) / (b - a)), o = {}; for (const k of ['x', 'y', 'zoom', 'ty']) o[k] = lerp(A[k], B[k], u); return o; } }
  return K[K.length - 1][1];
}
function camEstudio(t) {
  const B = teoAt(Math.max(28, Math.min(t, 35)));
  if (t < 7.5) return camKeys(t, [[0, { x: -300, y: -150, zoom: 1.18, ty: 30 }], [7.5, { x: -330, y: -140, zoom: 1.32, ty: 34 }]]);
  if (t < 14.2) return camKeys(t, [[7.5, { x: -250, y: -150, zoom: 1.04, ty: 20 }], [14.2, { x: 340, y: -150, zoom: 1.1, ty: 20 }]]);
  if (t < 19.4) return camKeys(t, [[14.2, { x: -502, y: -70, zoom: 4.1, ty: 10 }], [19.4, { x: -502, y: -70, zoom: 4.5, ty: 10 }]]);
  if (t < 24.9) return camKeys(t, [[19.4, { x: -320, y: -112, zoom: 2.25, ty: 70 }], [24.9, { x: -320, y: -112, zoom: 2.5, ty: 74 }]]);
  if (t < 28.0) return camKeys(t, [[24.9, { x: -280, y: -128, zoom: 1.32, ty: 70 }], [28.0, { x: -262, y: -122, zoom: 1.48, ty: 74 }]]);
  if (t < 32.2) return camKeys(t, [[28.0, { x: -210, y: -96, zoom: 2.0, ty: 116 }], [32.2, { x: -150, y: -96, zoom: 2.05, ty: 116 }]]);
  if (t < 35.2) { const b = teoAt(t); return { x: b.x + 110, y: -130, zoom: 1.55, ty: 84 }; }
  if (t < 38.2) return camKeys(t, [[35.2, { x: 410, y: -150, zoom: 2.3, ty: 84 }], [38.2, { x: 420, y: -150, zoom: 2.4, ty: 84 }]]);
  if (t < 41.2) return camKeys(t, [[38.2, { x: 520, y: -140, zoom: 1.65, ty: 60 }], [41.2, { x: 540, y: -140, zoom: 1.75, ty: 60 }]]);
  if (t < 45.8) return camKeys(t, [[41.2, { x: 120, y: -150, zoom: .98, ty: 30 }], [45.8, { x: 100, y: -150, zoom: 1.0, ty: 30 }]]);
  if (t < 51.6) return { x: 10, y: -160, zoom: .83, ty: 34 };
  return camKeys(t, [[51.6, { x: -60, y: -150, zoom: .9, ty: 30 }], [64, { x: -300, y: -132, zoom: 1.45, ty: 40 }]]);
}
const DLG1 = [
  { t: 4.2, who: 'teo', mood: 'sueno', txt: 'Zzz... un poquito más de mantequilla... zzz', face: { sleep: true }, hold: 1.2 },
  { t: 19.4, who: 'teo', mood: 'sueno', txt: 'Mmmh... cinco minutos más...', face: { tired: true, flat: true }, hold: .25 },
  { t: 23.0, who: 'teo', mood: 'prisa', txt: '¿¡LAS SIETE Y QUINCE!?', face: { wide: true, mouthO: true }, hold: .6 },
  { t: 28.3, who: 'teo', mood: 'prisa', txt: '¡Hoy viene la Guía Brújula! ¡Hoy no se llega tarde!', face: { wide: true }, hold: .6 },
  { t: 32.1, who: 'teo', mood: 'prisa', txt: '¡Zuecos, zuecos, zuecos!', face: { happy: true, clogs: true }, hold: .5 },
  { t: 36.3, who: 'teo', mood: 'prisa', txt: '¡Y el cuaderno de emplatados!', face: { wide: true }, hold: .4 },
  { t: 38.3, who: 'teo', mood: 'prisa', txt: '¡Allá voooy!', face: { happy: true }, hold: .5 },
  { t: 48.2, who: 'teo', mood: 'normal', txt: 'Perdón, Kronotek. Buenos días.', face: { happy: true }, hold: .7 },
];
const DLG = DLG1.concat(DLG2);
const LABELS = [{ t0: 14.5, t1: 19.3, big: '07:15 AM', small: 'EL ESTUDIO DE TEO' }, { t0: 62.0, t1: 66.6, big: '07:35 AM', small: 'CALLE ALMAGRE' }, { t0: 123.4, t1: 127.4, big: '07:50 AM', small: 'CONTINÚA: EL PARQUE', col: '#ffd84a' }];
const S1END = 60.4;
/* quién habla y dónde está (para subir la caja si está abajo) */
function speakerY(t) { const d = DLG.find(q => t >= q.t - .12 && t < q.end + .15); if (!d) return 0; let B;
  if (d.who === 'valeria') { const V = valeriaAt(t); B = V; } else B = t < S2.A ? teoAt(t) : t < S2.B ? teoCalle(t) : teoCafe(t);
  if (!B || B.hide) return 0; return pxFoot(B.x, (B.y || 0) + 40, B.z)[1]; }
function scene1(t) {
  estudioSol(false); SOL.on = 1; camSet(camEstudio(t));
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#120d10'; ctx.fillRect(0, 0, W, H); ctx.restore(); T0();
  lightsBegin(); T0(); drawEstudio(t); lightsComp(0);
  postFx(t, { tone: [255, 240, 222], vig: .6 }); slowVig(slowK(t));
}
function scene2a(t) { SOL.on = 0; camSet(camCalle(t)); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#c8d2d8'; ctx.fillRect(0, 0, W, H); ctx.restore(); T0(); drawCalleScene(t); postFx(t, { tone: [228, 240, 248], vig: .5 }); }
function scene2b(t) { SOL.on = 0; camSet(camCafe(t)); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#1c1210'; ctx.fillRect(0, 0, W, H); ctx.restore(); T0(); drawCafeScene(t); postFx(t, { tone: [255, 232, 206], vig: .62 }); }
function black() { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); ctx.restore(); T0(); }
const FILM = {
  DUR: 127.6, CHAPTERS: [[0, 'El estudio'], [14.4, 'La alarma'], [25, 'El salto'], [46, 'Vuelve'], [61.5, 'La calle'], [86.6, 'Molienda'], [109, 'El cortado']],
  fonts: ['700 20px "Playfair Display"', '20px "Bebas Neue"', '700 20px "Josefin Sans"', '20px "Pacifico"', '20px "Space Mono"', '600 20px "Caveat"'],
  load: [['Pintando el ladrillo, el yeso y el parqué…', () => estudioPaint()], ['Llenando la estantería de post-its…', () => utileriaPaint()], ['Tendiendo las sábanas de lino…', () => sheetBake()],
    ['Pintando la calle Almagre…', () => callePaint()], ['Encendiendo las bombillas de Molienda…', () => cafePaint()],
    ['Afinando los bleeps…', () => { FILM.bleeps = dlgPrep(DLG).concat(...LABELS.map(labelBleeps)); }]],
  door: doorAt, events: () => filmEvents(), audioInit: () => filmAudioInit(), beds: (t, n) => filmBeds(t, n), fade: t => 1 - sm((t - 123.0) / 4),
  draw(t) {
    if (t < S1END) scene1(t);
    else if (t < S2.A) pxWipe(() => scene1(t), () => scene2a(t), (t - S1END) / (S2.A - S1END), { dir: 'right' });
    else if (t < S2.B) scene2a(t);
    else if (t < S2.END) scene2b(t);
    else if (t < S2.END + 1) pxWipe(() => scene2b(t), black, t - S2.END, { dir: 'center' });
    else black();
    fadeTo('#000', 1 - sm(t / 2.6));
    dlgDraw(DLG, t, { anchor: () => speakerY(t) }); for (const L of LABELS) labelDraw(L, t);
  },
};
window.__tex = (k, w = 900) => { const c = (ESX[k] || PROPS[k]).c, o = mk(w, w * c.height / c.width); o.getContext('2d').drawImage(c, 0, 0, o.width, o.height); return o.toDataURL('image/png'); };
bootFilm();
