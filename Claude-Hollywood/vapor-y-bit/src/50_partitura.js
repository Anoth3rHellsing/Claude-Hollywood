/* =====================================================================
   ENTRE EL VAPOR Y EL BIT · SONIDO DE LA ESCENA 1 (nada de lo-fi: cada escena tendrá su propio color)
   · «Dos estrellas»: el motivo de Teo en caja de música (FM de campana), con un colchón suave, al amanecer
   · «Prisa»: chiptune a 150 BPM (pulso 25 % de melodía, arpegio de pulso 12 %, triángulo de bajo, ruido de batería)
   · el despertador Kronotek, los bleeps de la voz, y el foley: lino, cobre, zuecos, papel, cerámica, la puerta
     que rebota en el tope de goma y el marco que traquetea; pájaros por la ventana y el tono de la habitación
   ===================================================================== */
/* ---------- instrumentos ---------- */
function mbox(n, at, v = 1) {   /* caja de música: campana FM con un brillo inarmónico */
  const ac = AU.ac, f = NT(n), g = ac.createGain(), end = at + 2.6;
  g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(.075 * v, at + .004); g.gain.setTargetAtTime(0, at + .02, .55);
  const c = ac.createOscillator(); c.type = 'sine'; c.frequency.value = f; const m = ac.createOscillator(), mg = ac.createGain(); m.frequency.value = f * 3.5; mg.gain.setValueAtTime(f * 1.2, at); mg.gain.setTargetAtTime(f * .1, at, .12); m.connect(mg); mg.connect(c.frequency);
  c.connect(g); g.connect(AU.bM); c.start(at); m.start(at); c.stop(end); m.stop(end);
  tone(f * 5.95, at, .25, .012 * v, 'sine', null, AU.bM);
}
function pad(ns, at, dur, v = 1) { for (const n of ns) for (const dt of [-6, 6]) { const ac = AU.ac, o = ac.createOscillator(), g = ac.createGain(); o.type = 'triangle'; o.frequency.value = NT(n); o.detune.value = dt; g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(.008 * v, at + dur * .35); g.gain.setTargetAtTime(0, at + dur * .7, dur * .15); o.connect(g); g.connect(AU.bM); o.start(at); o.stop(at + dur + 1); } }
function lead(n, at, dur, v = 1, type = 'pulse') { const ac = AU.ac, o = ac.createOscillator(), g = ac.createGain(); oscW(o, type); o.frequency.value = NT(n); const vib = ac.createOscillator(), vg = ac.createGain(); vib.frequency.value = 6; vg.gain.setValueAtTime(0, at); vg.gain.linearRampToValueAtTime(10, at + dur); vib.connect(vg); vg.connect(o.detune); g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(.036 * v, at + .005); g.gain.setValueAtTime(.036 * v, at + dur * .8); g.gain.linearRampToValueAtTime(0, at + dur); o.connect(g); g.connect(AU.bM); o.start(at); vib.start(at); o.stop(at + dur + .02); vib.stop(at + dur + .02); }
function tri(n, at, dur, v = 1) { const ac = AU.ac, o = ac.createOscillator(), g = ac.createGain(); o.type = 'triangle'; o.frequency.value = NT(n); g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(.08 * v, at + .004); g.gain.setValueAtTime(.08 * v, at + dur * .85); g.gain.linearRampToValueAtTime(0, at + dur); o.connect(g); g.connect(AU.bM); o.start(at); o.stop(at + dur + .02); }
function nkick(at, v = 1) { tone(150, at, .14, .22 * v, 'sine', 45, AU.bM); }
function nsnare(at, v = 1) { noiseHit(at, .12, { type: 'highpass', f: 1800, vol: .1 * v, dest: AU.bM }); tone(220, at, .06, .05 * v, 'triangle', 140, AU.bM); }
function nhat(at, v = 1) { noiseHit(at, .03, { type: 'highpass', f: 7000, vol: .04 * v, dest: AU.bM }); }
function copperTonk(at, v = 1) { for (const [f, d, a] of [[520, .6, .07], [1310, .35, .03], [2210, .2, .015]]) tone(f, at, d, a * v, 'sine', f * .99); thump(at, .25 * v, 120); }
function ceramic(at, v = 1) { tone(3100, at, .15, .025 * v, 'sine'); tone(4700, at, .08, .012 * v, 'sine'); }
function latch(at) { noiseHit(at, .02, { type: 'bandpass', f: 3200, q: 6, vol: .08 }); tone(900, at, .03, .03, 'square', 600); }
function snooze(at) { noiseHit(at, .02, { type: 'bandpass', f: 2400, q: 4, vol: .1 }); tone(1046, at + .05, .12, .04, 'square'); tone(1568, at + .17, .2, .035, 'square'); }
function tapeDive(at) { noiseHit(at, .4, { type: 'bandpass', f: 1600, f2: 200, q: 2, vol: .05, dest: AU.bM }); tone(587, at, .4, .03, 'triangle', 90, AU.bM); }
function slowSweep(at, down) { noiseHit(at, .7, { type: 'bandpass', f: down ? 3000 : 300, f2: down ? 250 : 3200, q: 1.5, vol: .05, atk: .3, dest: AU.bS }); tone(down ? 420 : 140, at, .8, .035, 'sine', down ? 110 : 520, AU.bS, .3); }
/* ---------- la partitura ---------- */
const BEAT2 = 60 / 150, S16 = BEAT2 / 4;
const PRISA = { start: 28.0, end: 40.25 };
const CH = [[50, [62, 66, 69]], [45, [61, 64, 69]], [47, [62, 66, 71]], [43, [62, 67, 71]]];   // D · A · Bm · G
const MEL = [[0, 74, 2], [2, 78, 2], [4, 81, 3], [8, 83, 2], [10, 81, 2], [12, 78, 4], [16, 76, 2], [18, 78, 2], [20, 74, 3], [24, 73, 2], [26, 76, 2], [28, 69, 4]];
const MOTIF = [[0, 74, 1], [1, 78, 1], [2, 81, 1], [3, 83, 1.5], [4.5, 81, .5], [5, 78, 1], [6, 76, 2], [8, 74, 3]];   // «dos estrellas» (en negras a 84)
function filmEvents() {
  const E = [], q = 60 / 84;
  /* amanecer: caja de música dos veces con colchón */
  for (const off of [1.2, 1.2 + 9 * q]) { for (const [b, n] of MOTIF) E.push([off + b * q, at => mbox(n, at, .9)]); E.push([off, at => pad([50, 57, 62, 66], at, 9 * q, .9)]); }
  E.push([14.38, at => tapeDive(at)]);
  /* prisa: 8 compases (se corta con el portazo) */
  for (let bar = 0; bar < 8; bar++) { const t0 = PRISA.start + bar * BEAT2 * 4, ch = CH[bar % 4];
    for (let s = 0; s < 16; s++) { const at0 = t0 + s * S16; if (at0 >= PRISA.end) break;
      if (s % 4 === 0) E.push([at0, at => nkick(at, s === 0 ? 1 : .7)]); if (s === 4 || s === 12) E.push([at0, at => nsnare(at)]); if (s % 2 === 0) E.push([at0, at => nhat(at, s % 4 ? .6 : 1)]);
      if (s % 2 === 0) E.push([at0, at => tri(ch[0] + (s % 4 === 2 ? 12 : 0), at, S16 * 1.8)]);
      E.push([at0, at => lead(ch[1][s % 3] + 12, at, S16 * .8, .35, 'pulse12')]); }
    if (bar >= 2) for (const [s, n, d] of MEL) { if ((s >> 4) !== bar % 2) continue; const at0 = t0 + (s % 16) * S16; if (at0 < PRISA.end) E.push([at0, at => lead(n, at, d * S16 * .95, .9)]); } }
  /* vuelve corriendo: la prisa al doble, y el «bonk» del botón */
  for (let k = 0; k < 14; k++) { const n = MEL[k % MEL.length][1]; E.push([46.0 + k * .11, at => lead(n + 12, at, .09, .5)]); }
  E.push([47.9, at => snooze(at)]);
  for (let k = 0; k < 10; k++) E.push([49.6 + k * .16, at => lead(MEL[(k + 3) % MEL.length][1] + 12, at, .12, .45)]);
  /* calma: la caja de música otra vez, más lenta, termina suspendida */
  { const off = 53.2, q2 = q * 1.25; for (const [b, n] of MOTIF.slice(0, 7)) E.push([off + b * q2, at => mbox(n, at, .7)]); E.push([off, at => pad([50, 57, 62, 64], at, 10, .8)]); E.push([off + 8 * q2, at => { mbox(76, at, .6); mbox(81, at + .02, .5); mbox(86, at + .04, .4); }]); }
  /* despertador: cuatro pitidos por segundo hasta que Teo lo apaga */
  for (let t = 14.4; t < 47.85; t += 1) E.push([t, at => alarmBeep(at, 4)]);
  /* voz */
  for (const b of FILM.bleeps) E.push([b.t, at => bleep(at, b)]);
  E.push([18.7, at => yawn(at, 260)]);
  /* foley */
  for (let t = 1.0; t < 44; t += 1.6 + hsh(t, 3) * 2.4) E.push([t, at => chirp(at, .8)]);
  E.push([19.6, at => cloth(at, .6, .6)]); E.push([20.6, at => cloth(at, .5, .5)]); E.push([22.4, at => cloth(at, .4, .5)]);
  E.push([24.95, at => creak(at, 1.2)]); E.push([25.0, at => whoosh(at, 1.6, 1.4, 260, 1500)]); E.push([25.0, at => cloth(at, 1.2, 1)]);
  E.push([SL0, at => slowSweep(at, true)]); E.push([SL1 - .35, at => slowSweep(at, false)]);
  E.push([SL0 + (TJ + .75 - SL0) / SLK, at => copperTonk(at, 1)]);
  E.push([SL1 + (TJ + 1.35 - (SL0 + (SL1 - SL0) * SLK)), at => { cloth(at, .5, .8); thump(at, .3, 70); }]);
  /* pasos: cada cambio de pierna mientras corre (zuecos después de 31,45) */
  let last = null; for (let t = 28; t < 51.5; t += 1 / 60) { const B = teoAt(t); if (!B.run || B.hide) { last = null; continue; } const st = Math.floor(t / (STEP / (B.trail ? 1.8 : 1))); if (last !== null && st !== last) { const cl = t > 31.45; E.push([t, at => cl ? clogClack(at, .6) : stepTap(at, .8, 2200)]); } last = st; }
  E.push([31.42, at => { clogClack(at, 1); clogClack(at + .09, 1); }]);
  E.push([35.0, at => tone(300, at, .25, .04, 'square', 900)]); E.push([35.6, at => { clogClack(at, 1.2); copperTonk(at, .4); }]);
  E.push([36.2, at => paperFlip(at)]); for (let k = 0; k < 4; k++) E.push([36.2 + k * .14, at => ceramic(at, 1 - k * .2)]);
  E.push([37.6, at => tone(300, at, .2, .035, 'square', 700)]); E.push([38.1, at => clogClack(at, 1.2)]);
  E.push([39.3, at => tone(300, at, .3, .04, 'square', 1000)]); E.push([39.9, at => latch(at)]); E.push([39.95, at => whoosh(at, .35, 1.2, 500, 2600)]);
  E.push([40.25, at => { doorSlam(at, 1); doorStop(at + .02, 1.2); }]); E.push([40.28, at => frameRattle(at, 1.2, 12)]); E.push([40.9, at => frameRattle(at, .5, 5)]);
  for (let k = 0; k < 6; k++) E.push([40.5 + k * .16, at => clogClack(at, .5 - k * .07)]);
  E.push([46.0, at => whoosh(at, .5, 1, 800, 3000)]); E.push([47.5, at => tone(300, at, .2, .04, 'square', 900)]); E.push([47.85, at => clogClack(at, 1)]);
  E.push([49.6, at => whoosh(at, .5, 1, 800, 3000)]);
  return E.concat(scene2Events(), scene3Events(), scene4Events(), scene5Events(), scene6Events());
}
/* ---------- escena 2 ---------- */
function bellDing(at, v = 1) { for (const [f, d, a] of [[2637, 1.4, .05], [3951, .9, .025], [5274, .5, .012]]) tone(f, at, d, a * v, 'sine', f * .998); }
function squeak(at) { const ac = AU.ac, o = ac.createOscillator(), g = ac.createGain(), l = ac.createOscillator(), lg = ac.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(1500, at); o.frequency.exponentialRampToValueAtTime(820, at + .8); l.frequency.value = 23; lg.gain.value = 60; l.connect(lg); lg.connect(o.frequency); g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(.04, at + .03); g.gain.setTargetAtTime(0, at + .7, .08); o.connect(g); g.connect(AU.bS); o.start(at); l.start(at); o.stop(at + 1.1); l.stop(at + 1.1); noiseHit(at, .8, { type: 'bandpass', f: 2400, f2: 900, q: 1.5, vol: .05 }); }
function grinder(at, dur) { const ac = AU.ac, o = ac.createOscillator(), g = ac.createGain(), f = ac.createBiquadFilter(); o.type = 'sawtooth'; o.frequency.setValueAtTime(90, at); o.frequency.linearRampToValueAtTime(130, at + .3); f.type = 'bandpass'; f.frequency.value = 700; f.Q.value = 1.2; g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(.05, at + .2); g.gain.setValueAtTime(.05, at + dur - .3); g.gain.linearRampToValueAtTime(0, at + dur); o.connect(f); f.connect(g); g.connect(AU.bS); o.start(at); o.stop(at + dur + .05); noiseHit(at, dur, { type: 'bandpass', f: 3000, q: .8, vol: .03, atk: .2 }); }
function steamHiss(at, dur, v = 1) { noiseHit(at, dur, { type: 'highpass', f: 2800, vol: .07 * v, atk: .15 }); noiseHit(at, dur * .8, { type: 'bandpass', f: 600, q: 2, vol: .03 * v, atk: .2 }); }
function cupSlide(at, dur) { noiseHit(at, dur, { type: 'bandpass', f: 900, f2: 1300, q: 3, vol: .05, atk: .05 }); }
function splash(at, v = 1) { for (let k = 0; k < 6; k++) noiseHit(at + k * .03, .12, { type: 'bandpass', f: 1200 + Math.random() * 2000, q: 2, vol: .05 * v }); tone(500, at, .12, .03 * v, 'sine', 900); }
function horn(at) { tone(330, at, .5, .03, 'sawtooth', 320, AU.bA); tone(415, at, .5, .02, 'sawtooth', 405, AU.bA); }
const VBPM = 96, VB = 60 / VBPM, VSW = VB * .5 * .34;   // tema de Valeria: 96 BPM con swing
const VMEL = [[0, 69, .5], [.5, 72, .5], [1, 77, 1], [2, 76, .5], [2.5, 74, .5], [3, 72, 1], [4, 70, .5], [4.5, 72, .5], [5, 74, 1.5], [6.5, 72, .5], [7, 69, 1], [8, 69, .5], [8.5, 72, .5], [9, 77, 1], [10, 79, .5], [10.5, 77, .5], [11, 76, 1], [12, 74, .5], [12.5, 76, .5], [13, 72, 2.5]];
const VBASS = [[41, 45, 48, 45], [46, 50, 53, 50], [48, 52, 55, 52], [41, 48, 45, 48]], VCH = [[57, 60, 64], [58, 62, 65], [55, 60, 64], [57, 60, 65]];
function scene2Events() {
  const E = [];
  /* calle: la prisa de Teo otra vez (arpegio en corcheas para aliviar), un tono más arriba a la mitad */
  for (let bar = 0; bar < 15; bar++) { const t0 = 61.6 + bar * BEAT2 * 4, ch = CH[bar % 4], up = bar >= 8 ? 2 : 0; if (t0 > 85) break;
    for (let s = 0; s < 16; s += 2) { const at0 = t0 + s * S16; if (at0 >= 85.0) break;
      if (s % 4 === 0) E.push([at0, at => nkick(at, s === 0 ? 1 : .7)]); if (s === 4 || s === 12) E.push([at0, at => nsnare(at)]); E.push([at0, at => nhat(at, s % 4 ? .6 : 1)]);
      E.push([at0, at => tri(ch[0] + up + (s % 4 === 2 ? 12 : 0), at, S16 * 1.8)]); E.push([at0, at => lead(ch[1][(s / 2) % 3] + 12 + up, at, S16 * 1.4, .3, 'pulse12')]); }
    if (bar >= 1) for (const [sx, n, d] of MEL) { if ((sx >> 4) !== bar % 2) continue; const at0 = t0 + (sx % 16) * S16; if (at0 < 85.0) E.push([at0, at => lead(n + up, at, d * S16 * .95, .9)]); } }
  E.push([85.0, at => { squeak(at); lead(86, at, .12, .7); lead(81, at + .12, .12, .6); lead(74, at + .24, .3, .6); }]);
  /* pasos de zuecos en la calle y el café, charco, rejilla, bocinas */
  let last = null; for (let t = 61.5; t < 115; t += 1 / 60) { const B = t < S2.B ? teoCalle(t) : teoCafe(t); if (!B || B.hide || !B.run) { last = null; continue; } const st = Math.floor(t / (STEP / 1.15)); if (last !== null && st !== last) E.push([t, at => clogClack(at, .45)]); last = st; }
  const tj = S2.A + (PUD_JUMP - 160 - S2.X0) / S2.V, tl = S2.A + (PUD_JUMP + 160 - S2.X0) / S2.V; E.push([tj, at => { splash(at, .6); tone(300, at, .25, .04, 'square', 900); }]); E.push([tl, at => splash(at, 1)]);
  E.push([S2.A + (GRATE.x - S2.X0) / S2.V - .6, at => steamHiss(at, 2.2, 1.2)]);
  E.push([68.4, at => horn(at)]); E.push([81.2, at => horn(at)]); E.push([73.0, at => { tone(2800, at, .4, .025, 'sine'); tone(2800, at + .16, .5, .025, 'sine'); }]);
  /* cafetería: puerta y campanilla, derrape, molinillo, vapor, vaso, servilletas */
  for (const t0 of CAFE.door) { E.push([t0, at => { bellDing(at); whoosh(at, .4, .6, 400, 1800); }]); E.push([t0 + 1.75, at => thump(at, .25, 110)]); }
  E.push([88.4, at => squeak(at)]);
  E.push([93.9, at => grinder(at, 1.9)]); E.push([96.9, at => steamHiss(at, 4.0, 1)]); E.push([101.4, at => { for (let k = 0; k < 8; k++) tone(900 + Math.random() * 400, at + k * .09, .05, .006, 'sine', 600); }]);
  E.push([109.2, at => tone(300, at, .25, .04, 'square', 900)]); E.push([109.7, at => clogClack(at, 1)]);
  E.push([CAFE.cup0, at => cupSlide(at, .55)]); E.push([CAFE.cup1, at => ceramic(at, 1.2)]);
  E.push([112.0, at => tone(300, at, .2, .035, 'square', 700)]); E.push([112.5, at => clogClack(at, 1)]);
  for (let k = 0; k < 3; k++) E.push([CAFE.nap + k * .12, at => paperFlip(at, .8)]);
  for (let t = 88; t < 121; t += 1.8 + hsh(t, 7) * 2.6) E.push([t, at => ceramic(at, .35)]);   // tazas y cucharitas al fondo
  for (let t = 104; t < 109; t += .16 + hsh(t, 3) * .2) E.push([t, at => noiseHit(at, .015, { type: 'bandpass', f: 3500, q: 6, vol: .015 })]);   // teclados
  /* el tema de Valeria: 14 compases de 4 tiempos con swing */
  const v0 = 87.0;
  for (let bar = 0; bar < 14; bar++) { const t0 = v0 + bar * VB * 4, b4 = bar % 4, sw = x => x + ((x / (VB * .5)) % 2 >= 1 ? VSW : 0); if (t0 > 121.6) break;
    for (let q = 0; q < 4; q++) E.push([t0 + q * VB, at => tri(VBASS[b4][q], at, VB * .9, .9)]);
    E.push([t0, at => { for (const n of VCH[b4]) mbox(n + 12, at, .35); }]);
    for (let q = 0; q < 8; q++) E.push([t0 + q * VB * .5 + (q % 2 ? VSW : 0), at => nhat(at, q % 4 === 2 ? .7 : .35)]);
    if (bar >= 1 && bar < 13) for (const [b, n, d] of VMEL) { if (Math.floor(b / 4) !== b4) continue; const bb = b - b4 * 4, at0 = t0 + bb * VB + ((bb * 2) % 2 === 1 ? VSW : 0); E.push([at0, at => lead(n + 12, at, d * VB * .9, .55, 'pulse12')]); } }
  E.push([v0 + 13 * VB * 4, at => { for (const n of [65, 69, 72, 76]) mbox(n + 12, at, .5); }]);
  return E;
}
/* ---------- escena 3: el parque ---------- */
function crunch(at, v = 1) { noiseHit(at, .05, { type: 'bandpass', f: 2200 + Math.random() * 1600, q: 1.4, vol: .06 * v }); noiseHit(at + .012, .03, { type: 'highpass', f: 5000, vol: .025 * v }); }
function quack(at, v = 1, f = 300) { const ac = AU.ac, o = ac.createOscillator(), g = ac.createGain(), bp = ac.createBiquadFilter(); o.type = 'sawtooth'; o.frequency.setValueAtTime(f, at); o.frequency.linearRampToValueAtTime(f * .78, at + .16); bp.type = 'bandpass'; bp.frequency.value = 1100; bp.Q.value = 3; g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(.06 * v, at + .015); g.gain.setTargetAtTime(0, at + .14, .03); o.connect(bp); bp.connect(g); g.connect(AU.bS); o.start(at); o.stop(at + .3); }
function peep(at, v = 1) { tone(2400, at, .07, .02 * v, 'sine', 3000); }
function plop(at, v = 1) { tone(420, at, .12, .04 * v, 'sine', 900); noiseHit(at, .05, { type: 'bandpass', f: 1600, q: 3, vol: .02 * v }); }
function slurp(at) { noiseHit(at, .5, { type: 'bandpass', f: 600, f2: 2400, q: 4, vol: .05, atk: .1 }); tone(330, at, .4, .02, 'square', 660, AU.bV); }
const PBPM = 120, PB = 60 / PBPM;
const PCH = [[43, [59, 62, 67]], [38, [57, 62, 66]], [40, [59, 64, 67]], [36, [60, 64, 67]]];   // G · D · Em · C
function scene3Events() {
  const E = [], q = PB;
  /* tema del parque: el motivo «dos estrellas» transportado a sol, más rápido, flauta de triángulo + pizzicato */
  const sec = (a, b, full) => { for (let bar = 0; ; bar++) { const t0 = a + bar * q * 4; if (t0 >= b) break; const ch = PCH[bar % 4];
    E.push([t0, at => tri(ch[0], at, q * 1.8, .8)]); E.push([t0 + q * 2, at => tri(ch[0] + 7, at, q * 1.8, .7)]);
    for (let s = 0; s < 8; s++) { const at0 = t0 + s * q / 2; if (at0 >= b) break; E.push([at0, at => lead(ch[1][s % 3] + 12, at, q * .22, .28, 'pulse12')]); if (s % 2) E.push([at0, at => noiseHit(at, .04, { type: 'highpass', f: 8000, vol: .025, dest: AU.bM })]); }
    if (full) { E.push([t0, at => nkick(at, .5)]); if (bar % 2 === 0) for (const [b_, n, d] of MOTIF) { const at0 = t0 + b_ * q * .5; if (at0 < b) E.push([at0, at => lead(n - 7 + 12, at, d * q * .45, .7, 'triangle')]); } } } };
  sec(124.0, 134.6, true); sec(134.6, 141.4, false); sec(141.4, 146.6, true); sec(152.0, 169.6, true);
  /* «ocho y media en la cocina»: vuelve la prisa */
  for (let bar = 0; bar < 6; bar++) { const t0 = 169.6 + bar * BEAT2 * 4, ch = CH[bar % 4]; for (let s_ = 0; s_ < 16; s_ += 2) { const at0 = t0 + s_ * S16; if (at0 >= 179.6) break; if (s_ % 4 === 0) E.push([at0, at => nkick(at, .8)]); if (s_ === 4 || s_ === 12) E.push([at0, at => nsnare(at, .8)]); E.push([at0, at => tri(ch[0] + 5 + (s_ % 4 === 2 ? 12 : 0), at, S16 * 1.8)]); E.push([at0, at => lead(ch[1][(s_ / 2) % 3] + 17, at, S16 * 1.4, .28, 'pulse12')]); } for (const [sx, n, d] of MEL) { if ((sx >> 4) !== bar % 2) continue; const at0 = t0 + (sx % 16) * S16; if (at0 < 179.6) E.push([at0, at => lead(n + 5, at, d * S16 * .95, .85)]); } }
  /* el invernadero se revela: acorde amplio y arpegio de caja de música */
  E.push([146.6, at => pad([43, 50, 59, 62, 66], at, 5.6, 1.4)]); for (let k = 0; k < 16; k++) E.push([146.8 + k * .3, at => mbox([67, 71, 74, 78, 79, 83][k % 6] + (k > 8 ? 12 : 0), at, .45)]);
  E.push([179.6, at => { for (const n of [67, 71, 74, 79]) mbox(n + 12, at, .5); pad([43, 55, 62, 71], at, 3, 1); }]);
  /* Ramiro: «cuac» + los patitos; el fagot del «lo mismo digo» */
  E.push([138.0, at => quack(at, 1.2, 260)]); for (let k = 0; k < 5; k++) E.push([136.2 + k * .7 + hsh(k, 3) * .3, at => peep(at, .8)]);
  E.push([141.0, at => { tri(43, at, .25, .9); tri(38, at + .3, .5, .9); }]);
  for (let t = 126; t < 176; t += 4 + hsh(t, 5) * 5) E.push([t, at => quack(at, .35, 300 + Math.random() * 60)]);
  for (const [ts] of duckRings(150).concat(duckRings(137))) if (ts > 124 && ts < 180) E.push([ts, at => plop(at, .4)]);
  /* pasos en la grava, sorbos, «quema», el riego */
  for (const [ts] of STEPS3) E.push([ts, at => crunch(at, .8)]);
  E.push([129.6, at => slurp(at)]); E.push([160.3, at => slurp(at)]);
  for (let k = 0; k < 10; k++) E.push([130.65 + k * .09, at => tone(1200 + k * 120, at, .05, .02, 'square', null, AU.bV)]);
  E.push([158.2, at => noiseHit(at, 15, { type: 'highpass', f: 4000, vol: .03, atk: 3 })]);
  for (let t = 124; t < 181; t += .9 + hsh(t, 1) * 1.6) E.push([t, at => chirp(at, 1)]);
  return E;
}
/* ---------- escena 4: Brasa y Bruma ---------- */
function crackle(at, dur, dens = 40, v = 1, f = 3200) { for (let k = 0; k < dur * dens; k++) { const a = at + Math.random() * dur; noiseHit(a, .008 + Math.random() * .02, { type: 'bandpass', f: f * (.6 + Math.random() * .9), q: 3, vol: (.012 + Math.random() * .03) * v }); } }
function sizzleOn(at, dur, v = 1) { noiseHit(at, dur, { type: 'highpass', f: 3800, vol: .06 * v, atk: .03 }); noiseHit(at, dur * .7, { type: 'bandpass', f: 1400, q: .8, vol: .03 * v, atk: .05 }); crackle(at, dur, 60, v); }
function whoomp(at, v = 1) { noiseHit(at, 1.2, { type: 'lowpass', f: 220, f2: 900, vol: .3 * v, atk: .08, brown: true }); thump(at + .05, .8 * v, 60); noiseHit(at + .1, 4.5, { type: 'bandpass', f: 500, q: .6, vol: .09 * v, atk: .2, brown: true }); crackle(at + .1, 3.5, 45, .9 * v, 2400); }
function metalClank(at, v = 1) { tone(1860, at, .35, .03 * v, 'sine', 1830); tone(2940, at, .2, .015 * v, 'sine'); noiseHit(at, .03, { type: 'bandpass', f: 3000, q: 3, vol: .06 * v }); }
function knifeShing(at, v = 1) { noiseHit(at, .45, { type: 'bandpass', f: 4000, f2: 9000, q: 6, vol: .05 * v, atk: .05 }); tone(5200, at + .1, .4, .008 * v, 'sine', 5600); }
function printerChat(at, dur, v = 1) { for (let k = 0; k < dur * 26; k++) noiseHit(at + k / 26, .022, { type: 'bandpass', f: 2200 + (k % 3) * 300, q: 5, vol: .05 * v }); tone(140, at, dur, .012 * v, 'square', null, AU.bS, .01); }
function paperTear(at) { noiseHit(at, .18, { type: 'highpass', f: 2000, f2: 5000, vol: .07, atk: .01 }); }
function tick(at, v = 1) { noiseHit(at, .012, { type: 'bandpass', f: 4200, q: 8, vol: .05 * v }); tone(2100, at, .02, .01 * v, 'square'); }
function glug(at, v = 1) { for (let k = 0; k < 4; k++) tone(260 + k * 30, at + k * .22, .14, .03 * v, 'sine', 420 + k * 40); noiseHit(at, 1, { type: 'bandpass', f: 900, q: 2, vol: .02 * v, atk: .2 }); }
function swingDoor(at, v = 1) { whoosh(at, .35, .5 * v, 300, 1400); for (let k = 0; k < 3; k++) thump(at + .3 + k * .55, .16 * v * Math.exp(-k), 120 - k * 10); }
const RBPM = 92, RB = 60 / RBPM;
const RMEL = [[0, 72, 1], [1, 77, 1], [2, 76, 1], [3, 74, 2], [5, 72, 1], [6, 70, 1], [7, 72, 1], [8, 74, 1], [9, 72, 3], [12, 72, 1], [13, 77, 1], [14, 79, 1], [15, 81, 2], [17, 79, 1], [18, 77, 1], [19, 76, 1], [20, 74, 1], [21, 77, 3]];
const RCH = [[41, [65, 69, 72]], [46, [65, 70, 74]], [48, [64, 67, 72]], [41, [65, 69, 72]], [41, [65, 69, 72]], [46, [65, 70, 74]], [48, [64, 67, 70]], [41, [65, 69, 72]]];   // F · Bb · C · F · F · Bb · C7 · F
const KBPM = 104, KB = 60 / KBPM;
const KCH = [45, 41, 43, 40];   // Am · F · G · E
const KMEL = [[0, 76, 1], [1, 79, .5], [1.5, 76, .5], [2, 74, 1], [3, 72, 1], [4, 72, 1], [5, 74, .5], [5.5, 76, .5], [6, 77, 2], [8, 79, 1], [9, 77, .5], [9.5, 76, .5], [10, 74, 1], [11, 76, 1], [12, 71, 2], [14, 68, 1], [15, 71, 1]];
function scene4Events() {
  const E = [];
  /* el tema de Rosa: un vals de panadería (tri de bajo, caja de música suave, flauta de triángulo) */
  { const r0 = 189.0; for (let bar = 0; bar < 8; bar++) { const t0 = r0 + bar * RB * 3, [b, ch] = RCH[bar]; E.push([t0, at => tri(b, at, RB * .9, .8)]); for (const q of [1, 2]) E.push([t0 + q * RB, at => { for (const n of ch) mbox(n, at, .22); }]); }
    for (const [b, n, d] of RMEL) E.push([r0 + b * RB, at => lead(n, at, d * RB * .92, .6, 'triangle')]);
    E.push([r0 + 24 * RB, at => { for (const n of [65, 69, 72, 77]) mbox(n + 12, at, .35); }]); }
  /* «Servicio»: el tema de la cocina (la menor, 104) */
  const groove = (a, b, o = {}) => { for (let bar = 0; ; bar++) { const t0 = a + bar * KB * 4; if (t0 >= b) break; const r = KCH[bar % 4];
    for (let e = 0; e < 8; e++) { const at0 = t0 + e * KB / 2; if (at0 >= b) break; E.push([at0, at => tri(r + [0, 12, 0, 7, 0, 12, 10, 7][e], at, KB * .42, .62 * (o.v ?? 1))]); E.push([at0, at => nhat(at, (e % 2 ? .4 : .7) * (o.v ?? 1))]); }
    if (o.drums) { E.push([t0, at => nkick(at, .8)]); E.push([t0 + 2 * KB, at => nkick(at, .6)]); for (const q of [1, 3]) E.push([t0 + q * KB, at => noiseHit(at, .03, { type: 'bandpass', f: 1900, q: 3, vol: .07, dest: AU.bM })]); }
    if (o.mel) for (const [bb, n, d] of KMEL) { if (Math.floor(bb / 4) !== bar % 4) continue; const at0 = t0 + (bb % 4) * KB; if (at0 < b) E.push([at0, at => lead(n, at, d * KB * .9, .55)]); } } };
  groove(202.9, 216.0, { drums: true }); groove(217.4, 226.3, { v: .55 }); groove(228.4, 233.2, { drums: true, v: 1.1 }); groove(233.2, 244.0, { drums: true, mel: true });
  E.push([226.3, at => slowSweep(at, false)]); E.push([227.0, at => tone(220, at, .6, .03, 'sawtooth', 880, AU.bM)]);
  E.push([228.0, at => { pad([45, 52, 57, 64], at, 2.4, 1.6); for (let k = 0; k < 8; k++) mbox([69, 72, 76, 81, 84, 88, 84, 81][k], at + k * .07, .4); }]);
  for (let k = 0; k < 24; k++) E.push([244.0 + 3.2 * (1 - Math.pow(1 - k / 24, .6)), at => lead([69, 72, 76, 79][k % 4] + 12, at, .08, .35)]);
  E.push([244.0, at => tapeDive(at)]);
  /* suspense: la comanda de la Guía */
  E.push([247.6, at => pad([45, 52, 59, 64], at, 8.8, 1)]);
  /* el emplatado: un dron y notas sueltas de pentatónica; con el oro casi silencio; al posarse, un acorde de cristal */
  E.push([256.4, at => pad([45, 52, 57], at, 10, .9)]); E.push([266.4, at => pad([45, 52, 60], at, 10, .9)]);
  for (let t = 257.0, k = 0; t < 275.6; t += 1.3 + hsh(k, 2) * .9, k++) { const n = [69, 72, 74, 76, 79, 81][(k * 5 + 2) % 6]; E.push([t, at => mbox(n, at, .4)]); }
  for (let t = 256.6; t < 276; t += KB * 8) E.push([t, at => tri(33, at, KB * 6, .5)]);
  E.push([276.4, at => tone(1760, at, 2.8, .006, 'sine', 1700, AU.bM, .8)]);
  E.push([282.5, at => { for (const n of [81, 84, 88, 93]) mbox(n, at, .45); pad([57, 60, 64, 69], at, 3, 1.1); }]);
  /* ¡servicio!: un compás del tema y se corta con la puerta */
  groove(284.6, 288.5, { drums: true, v: .8 });
  /* la espera: latido y reloj */
  for (let t = 292.0; t < 297.4; t += .86) { E.push([t, at => nkick(at, .55)]); E.push([t + .2, at => nkick(at, .35)]); }
  E.push([292.0, at => pad([33, 40, 45], at, 5.5, .7)]);
  /* ¡le gustó!: «dos estrellas» brillante, con bajo y caja de música */
  { const q = 60 / 120, off = 302.3; for (const [b, n, d] of MOTIF) E.push([off + b * q, at => lead(n, at, d * q * .9, .8)]); for (const [k, r] of [[0, 50], [2, 45], [4, 47], [6, 43], [8, 50]]) E.push([off + k * q, at => tri(r, at, q * 1.8, .9)]); E.push([off, at => pad([62, 66, 69, 74], at, 5.5, 1)]); for (let k = 0; k < 10; k++) E.push([off + 4.6 + k * .1, at => mbox([74, 78, 81, 86][k % 4] + 12, at, .35)]); }
  /* foley */
  for (const t0 of DOOR4) E.push([t0, at => swingDoor(at, 1)]);
  let last = null; for (let t = S4.A; t < S4.END; t += 1 / 60) { const B = teo4(t); if (!B || B.hide || !B.run) { last = null; continue; } const st = Math.floor(t / (STEP / 1.2)); if (last !== null && st !== last) E.push([t, at => B.on === 'floor' ? clogClack(at, .5) : metalClank(at, .25)]); last = st; }
  E.push([186.0, at => tone(300, at, .25, .04, 'square', 900)]); E.push([186.6, at => { metalClank(at, 1); squeak(at); }]);
  for (const [a, b] of [[182.4, 184.2], [203.0, 204.4], [249.8, 251.0], [283.4, 283.9], [285.4, 286.4]]) for (let t = a; t < b; t += .34) E.push([t, at => stepTap(at, .4, 1500)]);
  E.push([194.3, at => { tick(at, 2); latch(at); }]); for (let t = 193.9; t < 195.2; t += 1) E.push([t, at => tick(at, 1.2)]);
  for (let k = 0; k < 30; k++) E.push([244.0 + k * .107, at => tick(at, .8)]);
  E.push([202.95, at => knifeShing(at)]); E.push([205.5, at => { tone(2093, at, .08, .03, 'square'); tone(2093, at + .14, .08, .03, 'square'); }]);
  E.push([207.8, at => crackle(at, 2.6, 30, .9, 1800)]);
  E.push([210.6, at => { latch(at); latch(at + .18); noiseHit(at + .3, .8, { type: 'lowpass', f: 300, f2: 900, vol: .12, atk: .1, brown: true }); }]);
  E.push([RC.drop, at => { sizzleOn(at, 9.6, 1.2); thump(at, .3, 140); }]); E.push([RC.flip, at => whoosh(at, .4, .7, 500, 2200)]); E.push([RC.flip + .55, at => { thump(at, .25, 130); sizzleOn(at, 4.2, .9); }]);
  E.push([RC.pour + .05, at => glug(at, 1)]); E.push([RC.ign, at => whoomp(at, 1)]);
  E.push([RC.butter, at => { plop(at, .8); sizzleOn(at, 10.6, .6); }]);
  for (let t = RC.baste; t < RC.endA; t += 1.15) { E.push([t + .05, at => tone(2600, at, .06, .012, 'sine')]); E.push([t + .62, at => crackle(at, .4, 60, .8, 3600)]); }
  E.push([247.3, at => printerChat(at, 1.5)]); E.push([249.0, at => paperTear(at)]);
  E.push([RC.plate, at => cupSlide(at, 1.1)]); E.push([RC.plate + 1.15, at => { ceramic(at, .8); thump(at, .12, 160); }]);
  E.push([RC.tear, at => noiseHit(at, 1.8, { type: 'bandpass', f: 700, f2: 400, q: 2, vol: .03, atk: .3 })]);
  for (let k = 0; k < 5; k++) { const t0 = RC.slices + k * .62; E.push([t0 + .38, at => tone(3400, at, .02, .012, 'square')]); E.push([t0 + .4, at => thump(at, .05, 200)]); }
  for (const d of GREEN.concat(SAFF)) E.push([d.t, at => noiseHit(at, .06, { type: 'lowpass', f: 900, vol: .05 })]);
  for (const G of GARN) E.push([G.t + .45, at => tone(3600, at, .02, .01, 'square')]);
  E.push([RC.goldOff, at => { for (const n of [93, 96, 100]) mbox(n, at, .2); }]); E.push([RC.goldOff - .5, at => noiseHit(at, 4, { type: 'highpass', f: 5000, vol: .02, atk: 1.2 })]);
  for (let t = 279.0; t < 282.6; t += 1) E.push([t, at => tick(at, .6)]);
  E.push([284.35, at => bellDing(at, 1.3)]);
  E.push([287.4, at => cupSlide(at, 1)]); E.push([297.6, at => cupSlide(at, 1.1)]); E.push([298.7, at => ceramic(at, 1)]);
  for (let t = 292.0; t < 299; t += 1) E.push([t, at => tick(at, .7)]);
  for (const t0 of [306.6, 307.1, 307.6, 308.1]) E.push([t0, at => tone(400, at, .18, .03, 'square', 1000)]);
  E.push([305.0, at => printerChat(at, 7.2, .8)]);
  return E;
}
/* ---------- escena 5: el turno en avance rápido ---------- */
function clack(at, v = 1) { noiseHit(at, .025, { type: 'bandpass', f: 1700, q: 4, vol: .16 * v }); thump(at, .22 * v, 170); }
function zapSnd(at) { noiseHit(at, .25, { type: 'highpass', f: 2500, vol: .12, atk: .002 }); crackle(at, .25, 160, 1.4, 5000); tone(3200, at, .2, .03, 'sawtooth', 900); }
function scene5Events() {
  const E = [];
  /* «Servicio» con la cinta acelerada: doble de tempo, un tono más alto; luego frena */
  E.push([312.2, at => slowSweep(at, false)]);
  { let t = 312.6, step = KB / 4, k = 0; const end = S5.SLOW - .6; while (t < end) { const bar = Math.floor(k / 8), r = KCH[bar % 4] + 5, e = k % 8, slow = t > S5.CLEAN ? 1 + 2.2 * seg(t, S5.CLEAN, end) : 1, v = t > S5.CLEAN ? 1 - .6 * seg(t, S5.CLEAN, end) : 1, dn = t > S5.CLEAN ? -Math.round(5 * seg(t, S5.CLEAN, end)) : 0;
    const n = r + [0, 12, 0, 7, 0, 12, 10, 7][e] + dn; E.push([t, at => tri(n, at, step * slow * .8, .6 * v)]); E.push([t, at => nhat(at, .5 * v)]); if (e % 4 === 0) E.push([t, at => nkick(at, .7 * v)]); if (e === 4) E.push([t, at => noiseHit(at, .03, { type: 'bandpass', f: 1900, q: 3, vol: .06 * v, dest: AU.bM })]);
    if (t < S5.CLEAN) { const m = KMEL[(k >> 1) % KMEL.length]; if (k % 2 === 0) E.push([t, at => lead(m[1] + 5, at, step * 1.6, .45, 'pulse12')]); }
    t += step * slow; k++; } }
  E.push([S5.SLOW - 1.2, at => tapeDive(at)]);
  /* Rosa se despide: su vals, lento y bajito */
  { const r0 = 350.8, q = RB * 1.3; for (const [b, n, d] of RMEL.slice(0, 9)) E.push([r0 + b * q, at => lead(n - 12, at, d * q * .9, .4, 'triangle')]); for (let bar = 0; bar < 4; bar++) E.push([r0 + bar * q * 3, at => tri(RCH[bar][0], at, q * 2.6, .6)]); }
  /* el motivo de Teo, cansado: caja de música lenta y una octava abajo (sigue en la noche) */
  { const q = 60 / 52, off = 356.6; for (const [b, n] of MOTIF.slice(0, 6)) E.push([off + b * q, at => mbox(n - 12, at, .55)]); }
  /* foley */
  for (const t0 of DOOR5) if (t0 < S5.CLEAN + 3) E.push([t0, at => whoosh(at, .25, .3, 400, 1600)]);
  E.push([355.3, at => swingDoor(at, .8)]); E.push([363.0, at => swingDoor(at, 1)]);
  for (const [t0] of FLASH5) E.push([t0, at => whoomp(at, .28)]);
  E.push([312.5, at => printerChat(at, S5.CLEAN - 312.5, .45)]);
  for (let t = 313; t < S5.CLEAN; t += .5 + hsh(t, 8) * .9) E.push([t, at => ceramic(at, .5)]);
  for (let t = 313; t < S5.CLEAN; t += .2 + hsh(t, 9) * .4) E.push([t, at => metalClank(at, .12)]);
  for (let t = S5.CLEAN; t < S5.CLEAN + 4.5; t += .35) E.push([t, at => noiseHit(at, .3, { type: 'bandpass', f: 800, f2: 1600, q: 1, vol: .04, atk: .1 })]);   // trapeo y agua
  for (const k in LIGHTS5) E.push([LIGHTS5[k], at => clack(at, 1)]);
  for (const t0 of ZAPS) E.push([t0, at => zapSnd(at)]);
  for (let t = 360.6; t < 363.2; t += .55) { E.push([t, at => clogClack(at, .35)]); E.push([t + .05, at => noiseHit(at, .25, { type: 'bandpass', f: 600, q: 1, vol: .03 })]); }
  E.push([360.4, at => yawn(at, 230)]);
  return E;
}
/* ---------- escena 6: la noche ---------- */
function cricket(at, v = 1) { const f = 4300 + Math.random() * 500; for (let k = 0; k < 3; k++) tone(f, at + k * .045, .03, .006 * v, 'sine', null, AU.bA); }
function owl(at) { tone(392, at, .5, .02, 'sine', 370, AU.bA, .08); tone(392, at + .7, .9, .018, 'sine', 360, AU.bA, .1); }
function breath(at, v = 1) { noiseHit(at, 1.6, { type: 'lowpass', f: 380, vol: .05 * v, atk: .9, brown: true }); noiseHit(at + 1.7, 1.2, { type: 'lowpass', f: 260, vol: .035 * v, atk: .3, brown: true }); }
function lowBleep(at) { const ac = AU.ac, o = ac.createOscillator(), g = ac.createGain(); oscW(o, 'triangle'); o.frequency.setValueAtTime(196, at); o.frequency.exponentialRampToValueAtTime(98, at + 1.1); g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(.07, at + .02); g.gain.setTargetAtTime(0, at + .5, .3); o.connect(g); g.connect(AU.bV); o.start(at); o.stop(at + 2); }
function scene6Events() {
  const E = [], q = 60 / 58;
  /* nana: «Dos estrellas» en caja de música, lenta, con colchones de re mayor */
  const lull = (off, v, oct = 0) => { for (const [b, n] of MOTIF) E.push([off + b * q, at => mbox(n + oct, at, v)]); };
  lull(366.5, .66); E.push([366.5, at => pad([50, 57, 62, 66], at, 9 * q, .8)]);
  lull(377.5, .58, -12); E.push([377.5, at => pad([43, 50, 59, 62], at, 9 * q, .7)]);
  E.push([387.4, at => pad([45, 52, 57, 64], at, 12, .9)]); for (let k = 0; k < 14; k++) E.push([393.6 + k * .24, at => mbox([74, 78, 81, 85, 86, 90][k % 6] + 12, at, .22)]);   // el invernadero responde
  lull(400.6, .55); E.push([400.6, at => pad([50, 57, 62, 66], at, 9, .7)]);
  /* el estudio: la nana se detiene; solo la habitación, el neón y la respiración */
  E.push([412.4, at => pad([38, 45, 50, 57], at, 17, .9)]); lull(433.6, .55, -12); E.push([433.6, at => pad([43, 50, 59, 62], at, 9 * q, .9)]); E.push([S6.ZERO + .05, at => mbox(74, at, .5)]);
  E.push([411.6, at => creak(at, .9)]); E.push([412.0, at => creak(at, .5)]);
  for (let t = 412.6; t < 428.4; t += .48) if (!(t > 419.4 && t < 422.6)) { E.push([t, at => clogClack(at, .28)]); E.push([t + .04, at => noiseHit(at, .3, { type: 'bandpass', f: 500, q: 1, vol: .025 })]); }
  E.push([419.6, at => yawn(at, 220)]); E.push([380.4, at => yawn(at, 240)]);
  E.push([430.6, at => creak(at, .7)]); E.push([S6.FLOP, at => { thump(at, .9, 80); cloth(at, 1.4, 1.2); creak(at + .05, 1.2); }]); E.push([S6.FLOP + .1, at => { thump(at, .25, 140); thump(at + .22, .15, 150); }]);
  for (let k = 0; k < 10; k++) E.push([S6.FLOP + .4 + k * .18, at => mbox([86, 90, 93, 98][k % 4], at, .14)]);   // polvo de plata
  for (let t = S6.FLOP + 2.4; t < S6.STARS + 4; t += 4.2) E.push([t, at => breath(at, 1.7)]);
  for (let t = 436.4; t < 446; t += 1) E.push([t, at => tick(at, .5)]); E.push([S6.ZERO, at => { latch(at); tone(1046, at + .02, .08, .01, 'square'); }]);
  E.push([S6.ZERO + 1.5, at => lowBleep(at)]);
  /* las dos estrellas y el final */
  E.push([S6.STARS + .2, at => pad([50, 57, 62, 66, 69], at, 7.5, 1)]); E.push([S6.STARS + 1.3, at => mbox(86, at, .5)]); E.push([S6.STARS + 2.1, at => mbox(90, at, .5)]);
  { const off = S6.CARD + .6, q2 = 60 / 72; for (const [b, n] of MOTIF) E.push([off + b * q2, at => mbox(n, at, .9)]); E.push([off, at => pad([50, 57, 62, 66], at, 9 * q2, 1)]); E.push([off + 9 * q2, at => { for (const n of [74, 78, 81, 86]) mbox(n, at, .45); pad([50, 57, 62, 66, 69], at, 6, 1); }]); }
  /* ambiente de la noche */
  for (let t = 365.4; t < 410; t += .35 + hsh(t, 2) * .7) E.push([t, at => cricket(at, 1)]);
  E.push([383.0, at => owl(at)]);
  for (let t = 401; t < 410; t += 2.4) E.push([t, at => plop(at, .15)]);
  E.push([409.0, at => quack(at, .25, 240)]);
  for (let t = 365.6; t < 410; t += .55) { const B = teo6park(t); if (B.walk) { E.push([t, at => crunch(at, .45)]); E.push([t + .06, at => noiseHit(at, .25, { type: 'bandpass', f: 1400, q: 1, vol: .02 })]); } }
  return E;
}
/* ---------- lechos ---------- */
function filmAudioInit() {
  auBed('room', AU.brown, 'lowpass', 180, .5); auBed('city', AU.brown, 'bandpass', 420, .7); auBed('hiss', AU.white, 'highpass', 7000, .5); auBed('hall', AU.brown, 'lowpass', 300, .6);
  auBed('traffic', AU.brown, 'lowpass', 260, .6); auBed('wind', AU.white, 'bandpass', 900, .5); auBed('murmur', AU.white, 'bandpass', 620, 2.4); auBed('cafe', AU.brown, 'lowpass', 400, .6); auBed('leaves', AU.white, 'bandpass', 2600, .4); auBed('water', AU.brown, 'bandpass', 320, .8); auBed('hood', AU.brown, 'lowpass', 130, .7); auBed('zap', AU.white, 'bandpass', 120, 12); auBed('sizzle', AU.white, 'highpass', 4200, .5);
}
function filmBeds(t, n) {
  const s1 = t < S1END + .5, s2a = t >= S1END && t < S2.B, s2b = t >= S2.B;
  bedSet('room', s1 ? .05 : 0, n); bedSet('hiss', .004, n);
  bedSet('city', s1 ? .028 * (1 - slowK(t) * .7) : 0, n);
  bedSet('hall', s1 && t > 40 ? .03 : 0, n);
  bedSet('traffic', s2a ? .07 : s2b ? .015 : 0, n); bedSet('wind', s2a ? .012 : 0, n);
  const s3 = t >= S3.A - .5 && t < S4.A, s4 = t >= S4.A - .5 && t < S6.A - .5, ins = s4 ? ins4(t) : null;
  const s6p = t >= S6.A - .5 && t < S6.PEND + .5, s6r = t >= S6.PEND + .5 && t < S6.CARD;
  const s5 = t >= S5.A, hoodOn = t < LIGHTS5.hood; bedSet('hood', s4 && hoodOn ? (ins ? .05 : .09) : 0, n); if (s5) bedSet('sizzle', .02 * chaos(t), n); bedSet('zap', s5 && t < S5.END + .5 ? .006 + .02 * dark5(t) : s6r ? .004 * (neonOn(t) ? 1 : 0) : 0, n); if (!s5) bedSet('sizzle', s4 ? (ins === 'A' ? .03 : .006) : 0, n); if (s4) { bedSet('hall', ins === 'B' ? .01 : .02, n); bedSet('traffic', 0, n); } bedSet('murmur', s2b && t < S3.A - .5 ? .016 : 0, n); bedSet('cafe', s2b && t < S3.A - .5 ? .04 : 0, n);
  bedSet('leaves', s3 ? .012 + .006 * Math.sin(t * .4) : 0, n); bedSet('water', s3 && t < 152 ? .03 : 0, n); if (s3) bedSet('traffic', .01, n);
  if (t >= S6.A - .5) { bedSet('wind', s6p ? .008 : 0, n); bedSet('leaves', s6p ? .006 : 0, n); bedSet('water', t > 399 && t < 410.5 ? .02 : 0, n); bedSet('room', s6r ? .06 : 0, n); bedSet('city', s6r ? .012 : s6p ? .008 : 0, n); bedSet('hall', s6r && t < 430 ? .015 : 0, n); }
  if (AU.bedL.murmur) AU.bedL.murmur.fl.frequency.setTargetAtTime(560 + 140 * Math.sin(t * .7), n, .3);
  const k = slowK(t); AU.sfx.gain.setTargetAtTime(1 - .4 * k, n, .1);
}
