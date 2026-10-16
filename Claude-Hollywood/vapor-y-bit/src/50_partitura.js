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
  return E;
}
/* ---------- lechos ---------- */
function filmAudioInit() {
  auBed('room', AU.brown, 'lowpass', 180, .5); auBed('city', AU.brown, 'bandpass', 420, .7); auBed('hiss', AU.white, 'highpass', 7000, .5); auBed('hall', AU.brown, 'lowpass', 300, .6);
}
function filmBeds(t, n) {
  bedSet('room', .05, n); bedSet('hiss', .004, n);
  bedSet('city', .028 * (1 - slowK(t) * .7), n);
  bedSet('hall', t > 40 ? .03 : 0, n);
  /* cámara lenta: todo se apaga un poco y se oscurece */
  const k = slowK(t); AU.master && AU.sfx.gain.setTargetAtTime(1 - .4 * k, n, .1);
}
