/* =====================================================================
   PLANTILLA · «La mañana» (20 s): una habitación con el sol entrando por la persiana, polvo dorado en los haces
   y Teo (del elenco) que cruza, se detiene y habla. Sirve de punto de partida: cambia el mapa, la coreografía,
   los diálogos y el sonido; el motor (motor/) no se toca.
   Planta (cm): pared del fondo z = 760 · pared izquierda x = -560 con ventana (z 380…600, y -236…-98) ·
   suelo de espiga · Teo camina por z = 560.
   ===================================================================== */
const RM = { ZB: 760, X0: -560, X1: 700, Y0: -300 };
const RX = {};
function demoPaint() {
  SOL.win = { x: -560, z0: 380, z1: 600, y0: -236, y1: -98 }; SOL.dir = [1, .22, .6]; SOL.d = null; SOL.n = 12; SOL.open = .5;
  SOL.col = [255, 202, 128]; SOL.k = 1.25; SOL.amb = [120, 98, 160]; SOL.ambA = 0; SOL.shaft = .16;
  RX.wall = matBrick(1260, 300, { seed: 7, soot: 5, wash: .18 }); RX.side = matPlaster(460, 300, { seed: 4, cracks: 2 });
  RX.floor = matParquet(1260, 610, { seed: 21 }); RX.ceil = matWood(1260, 610, { seed: 3, c: [214, 200, 178], plank: 16 });
  RX.out = tex(400, 300, 1); { const g = RX.out.g, gr = g.createLinearGradient(0, 0, 0, 300); gr.addColorStop(0, 'rgb(150,184,214)'); gr.addColorStop(1, 'rgb(255,214,160)'); g.fillStyle = gr; g.fillRect(0, 0, 400, 300); }
  for (const k of ['wall', 'side', 'floor', 'ceil']) texShade(RX[k], [120, 98, 160], .3);
}
/* Teo: entra caminando desde la derecha, se para junto al haz y mira a cámara */
function teoDemo(t) {
  if (t < 3) return { hide: true };
  const u = Math.min(1, (t - 3) / 5), x = 640 - 520 * u, walking = u < 1, st = Math.floor(t / .14);
  return { x, z: 560, flip: true, f: walking ? { legL: st % 2 ? 2 : 0, legR: st % 2 ? 0 : 2 } : { happy: t > 12 && t < 15, blink: (t * .4) % 1 < .05 } };
}
function drawRoom(t) {
  lightsBegin(); T0();
  vplane(RX.out, [-700, 300], [-700, 700], -330, 40);   // fuera de la ventana
  hplane(RX.ceil, RM.X0, RM.X1, 150, RM.ZB, RM.Y0);
  hplane(RX.floor, RM.X0, RM.X1, 150, RM.ZB, 0);
  solOn({ id: 'floor', t: 'h', y: 0, x0: RM.X0, x1: RM.X1, z0: 150, z1: RM.ZB });
  vplane(RX.wall, [RM.X0, RM.ZB], [RM.X1, RM.ZB], RM.Y0, 0);
  solOn({ id: 'wall', t: 'vz', z: RM.ZB, x0: RM.X0, x1: RM.X1, y0: RM.Y0, y1: 0 });
  /* pared izquierda con el hueco de la ventana: cuatro trozos alrededor */
  const W_ = SOL.win, wl = (z0, z1, y0, y1) => vplane(RX.side, [RM.X0, z0], [RM.X0, z1], y0, y1, { u0: (z0 - 150) / 610, u1: (z1 - 150) / 610 });
  wl(150, W_.z0, RM.Y0, 0); wl(W_.z1, RM.ZB, RM.Y0, 0); wl(W_.z0, W_.z1, RM.Y0, W_.y0); wl(W_.z0, W_.z1, W_.y1, 0);
  /* lamas de la persiana */
  const P = (W_.y1 - W_.y0) / SOL.n; for (let k = 0; k < SOL.n; k++) { const y = W_.y0 + k * P + P * (1 - SOL.open) * .5, th = P * (1 - SOL.open), q = poly3([[W_.x + 5, y, W_.z0], [W_.x + 5, y, W_.z1], [W_.x + 1, y + th, W_.z1], [W_.x + 1, y + th, W_.z0]]); if (q) { ctx.fillStyle = 'rgb(226,216,196)'; ctx.fill(q); } }
  /* Teo en la lista de profundidad, con la luz del haz sobre sus píxeles */
  const B = teoDemo(t);
  if (!B.hide) put(B.z, () => { pxShadow('teo', B.x, B.z); pxDraw('teo', B.f, B.x, 0, B.z, { flip: B.flip, lit: solIn([B.x, -40, B.z]) * SOL.k }); });
  dustPut(dustAmbient(t, { x0: -560, x1: 700, y0: -290, y1: -5, z0: 300, z1: 755 }, 320, 1));
  flush();
  solShafts(RM.ZB, SOL.shaft);
  lightsComp(0);
}
const DLGD = [
  { t: 8.6, who: 'teo', mood: 'normal', txt: 'Buenos días. Esto es una plantilla del motor Escenarios.', face: { happy: true }, hold: .6 },
  { t: 12.6, who: 'teo', mood: 'prisa', txt: '¡Cambia el mapa, la coreografía y el sonido!', face: { wide: true }, hold: .8 },
];
const LABELSD = [{ t0: 1.2, t1: 6, big: '07:15 AM', small: 'LA MAÑANA' }];
const MOTIFD = [[0, 74, 1], [1, 78, 1], [2, 81, 1], [3, 83, 1.5], [4.5, 81, .5], [5, 78, 1], [6, 76, 2], [8, 74, 3]];
const FILM = {
  DUR: 20, CHAPTERS: [[0, 'La mañana'], [8.6, 'Hola']],
  fonts: ['20px "Space Mono"'],
  load: [['Pintando la habitación…', () => demoPaint()], ['Afinando los bleeps…', () => { FILM.bleeps = dlgPrep(DLGD).concat(...LABELSD.map(labelBleeps)); }]],
  events: () => { const E = [], q = 60 / 84; for (const [b, n, d] of MOTIFD) E.push([1.2 + b * q, at => tone(NT(n), at, d * q, .05, 'triangle', null, AU.bM)]); for (const b of FILM.bleeps) E.push([b.t, at => bleep(at, b)]);
    for (let t = 3; t < 8; t += .28) E.push([t, at => stepTap(at, .6, 1900)]); for (let t = .8; t < 19; t += 1.6 + hsh(t, 3) * 2) E.push([t, at => chirp(at, .7)]); return E; },
  audioInit: () => auBed('room', AU.brown, 'lowpass', 180, .5), beds: (t, n) => bedSet('room', .05, n), fade: t => 1 - sm((t - 18) / 2),
  draw(t) {
    camSet({ x: 40, y: -150, zoom: 1.02, ty: 30 });
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#120d10'; ctx.fillRect(0, 0, W, H); ctx.restore(); T0();
    drawRoom(t); postFx(t, { tone: [255, 240, 222], vig: .6 });
    fadeTo('#000', 1 - sm(t / 2)); fadeTo('#000', sm((t - 18.4) / 1.6));
    dlgDraw(DLGD, t, { anchor: () => H * .7 }); for (const L of LABELSD) labelDraw(L, t);
  },
};
bootFilm();
