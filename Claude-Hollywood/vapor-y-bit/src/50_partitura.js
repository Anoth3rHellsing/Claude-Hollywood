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
  return E.concat(scene2Events(), scene3Events());
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
/* ---------- lechos ---------- */
function filmAudioInit() {
  auBed('room', AU.brown, 'lowpass', 180, .5); auBed('city', AU.brown, 'bandpass', 420, .7); auBed('hiss', AU.white, 'highpass', 7000, .5); auBed('hall', AU.brown, 'lowpass', 300, .6);
  auBed('traffic', AU.brown, 'lowpass', 260, .6); auBed('wind', AU.white, 'bandpass', 900, .5); auBed('murmur', AU.white, 'bandpass', 620, 2.4); auBed('cafe', AU.brown, 'lowpass', 400, .6); auBed('leaves', AU.white, 'bandpass', 2600, .4); auBed('water', AU.brown, 'bandpass', 320, .8);
}
function filmBeds(t, n) {
  const s1 = t < S1END + .5, s2a = t >= S1END && t < S2.B, s2b = t >= S2.B;
  bedSet('room', s1 ? .05 : 0, n); bedSet('hiss', .004, n);
  bedSet('city', s1 ? .028 * (1 - slowK(t) * .7) : 0, n);
  bedSet('hall', s1 && t > 40 ? .03 : 0, n);
  bedSet('traffic', s2a ? .07 : s2b ? .015 : 0, n); bedSet('wind', s2a ? .012 : 0, n);
  const s3 = t >= S3.A - .5; bedSet('murmur', s2b && !s3 ? .016 : 0, n); bedSet('cafe', s2b && !s3 ? .04 : 0, n);
  bedSet('leaves', s3 ? .012 + .006 * Math.sin(t * .4) : 0, n); bedSet('water', s3 && t < 152 ? .03 : 0, n); if (s3) bedSet('traffic', .01, n);
  if (AU.bedL.murmur) AU.bedL.murmur.fl.frequency.setTargetAtTime(560 + 140 * Math.sin(t * .7), n, .3);
  const k = slowK(t); AU.sfx.gain.setTargetAtTime(1 - .4 * k, n, .1);
}
