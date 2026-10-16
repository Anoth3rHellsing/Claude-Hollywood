/* =====================================================================
   MÚSICA Y SONIDO (Re menor, vals en 3/4): caja de música, arpa,
   cuerdas, coro, campana, hechizos, varita rota. Todo sintetizado.
   ===================================================================== */
Object.assign(NOTE, { Fs3: 185, Fs4: 369.99, Fs5: 739.99, B4: 493.88, Eb3: 155.56, Eb2: 77.78, B3: 246.94, B2: 123.47, Cs3: 138.59, E2: 82.41, Fs2: 92.5, A1: 55, G1: 49, Bb1: 58.27, D1: 36.71, Eb1: 38.89 });
function mbox(d, f, v = .1) { // caja de música / celesta
  if (!AU.ok) return; const ac = AU.ac, t = now(d);
  for (const [m, k, dec] of [[1, 1, 1.6], [4.02, .22, .35], [2.01, .12, .8]]) { const o = ac.createOscillator(); o.type = 'sine'; o.frequency.value = f * m; const g = ac.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v * k, t + .004); g.gain.exponentialRampToValueAtTime(.0001, t + dec); o.connect(g); send(g, .55); o.start(t); o.stop(t + dec + .05); }
}
function mel(d, notes, beat = .42, inst = 'box', v = .1) { // [nota, beats]
  let tt = 0; for (const [n, b] of notes) { if (n) { if (inst === 'box') mbox(d + tt, NOTE[n], v); else koto(d + tt, n, v * 3); } tt += b * beat; } return tt;
}
function strings(d, notes, dur, v = .05, bright = 1100) {
  if (!AU.ok) return; const ac = AU.ac, t = now(d), lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = bright; lp.Q.value = .6;
  const g = ac.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(v, t + Math.min(1.6, dur * .4)); g.gain.setValueAtTime(v, t + dur * .75); g.gain.linearRampToValueAtTime(.0001, t + dur + 1.8);
  lp.connect(g); send(g, .65);
  for (const n of notes) for (const dt of [-.004, .004]) { const o = ac.createOscillator(); o.type = 'sawtooth'; o.frequency.value = NOTE[n] * (1 + dt); const vib = ac.createOscillator(); vib.frequency.value = 5 + Math.random(); const vg = ac.createGain(); vg.gain.value = NOTE[n] * .003; vib.connect(vg); vg.connect(o.frequency); const gg = ac.createGain(); gg.gain.value = .5 / notes.length; o.connect(gg); gg.connect(lp); o.start(t); vib.start(t); o.stop(t + dur + 2); vib.stop(t + dur + 2); }
}
function choir(d, notes, dur, v = .05) {
  if (!AU.ok) return; const ac = AU.ac, t = now(d), g = ac.createGain();
  g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(v, t + Math.min(2, dur * .45)); g.gain.linearRampToValueAtTime(.0001, t + dur + 2); send(g, .8);
  for (const fq of [720, 1150, 2500]) { const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = fq; bp.Q.value = 6; const bg = ac.createGain(); bg.gain.value = fq === 2500 ? .4 : 1; bp.connect(bg); bg.connect(g);
    for (const n of notes) for (const dt of [-.006, 0, .006]) { const o = ac.createOscillator(); o.type = 'sawtooth'; o.frequency.value = NOTE[n] * (1 + dt); const vib = ac.createOscillator(); vib.frequency.value = 4.5 + Math.random(); const vg = ac.createGain(); vg.gain.value = NOTE[n] * .006; vib.connect(vg); vg.connect(o.frequency); const gg = ac.createGain(); gg.gain.value = .35 / notes.length; o.connect(gg); gg.connect(bp); o.start(t); vib.start(t); o.stop(t + dur + 2.2); vib.stop(t + dur + 2.2); } }
}
function bell(d, f = 146.83, v = .25, dec = 6) { // campana FM (torre del castillo)
  if (!AU.ok) return; const ac = AU.ac, t = now(d), c = ac.createOscillator(), m = ac.createOscillator(), mg = ac.createGain(), g = ac.createGain();
  c.frequency.value = f; m.frequency.value = f * 1.4; mg.gain.setValueAtTime(f * 3, t); mg.gain.exponentialRampToValueAtTime(f * .2, t + dec); m.connect(mg); mg.connect(c.frequency);
  g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + dec); c.connect(g); send(g, .7); c.start(t); m.start(t); c.stop(t + dec); m.stop(t + dec);
}
function sparkle(d, v = .05, up = 1) { const sc = ['D5', 'F5', 'A5', 'D6', 'A5', 'F5']; for (let i = 0; i < 6; i++) mbox(d + i * .055, NOTE[sc[up ? i : 5 - i]] * (i > 3 ? 1 : 1), v * (1 - i * .1)); }
function zap(d, f0, f1, dur, v = .2, type = 'sawtooth') {
  if (!AU.ok) return; const ac = AU.ac, t = now(d), o = ac.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  const m = ac.createOscillator(); m.frequency.value = 37; const mg = ac.createGain(); mg.gain.value = f0 * .4; m.connect(mg); mg.connect(o.frequency);
  const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3200; const g = ac.createGain(); envG(g, t, .02, v, dur * .5, dur * .6); o.connect(lp); lp.connect(g); send(g, .5); o.start(t); m.start(t); o.stop(t + dur * 1.3 + .1); m.stop(t + dur * 1.3 + .1);
}
function hum(d, dur, v = .12) { // energía verde acumulándose (disonante, creciente)
  if (!AU.ok) return; const ac = AU.ac, t = now(d), g = ac.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + dur); g.gain.setValueAtTime(.0001, t + dur + .02); send(g, .5);
  for (const f of [55, 58.3, 110, 164.8]) { const o = ac.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 2.2, t + dur); const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(200, t); lp.frequency.exponentialRampToValueAtTime(2400, t + dur); o.connect(lp); lp.connect(g); o.start(t); o.stop(t + dur + .05); }
}
function snap(d, v = .5) { // varita partida
  if (!AU.ok) return; const ac = AU.ac;
  for (const [o, f, k] of [[0, 3500, 1], [.03, 1800, .7], [.07, 900, .5]]) { const t = now(d + o), n = nsrc(t, .06, 1), bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f; bp.Q.value = 1.5; const g = ac.createGain(); envG(g, t, .001, v * k, .005, .05); n.connect(bp); bp.connect(g); send(g, .4); }
  boom(d, .3, .5);
}
function laugh(d, v = .05) { // risa seca y fría
  if (!AU.ok) return; for (let i = 0; i < 5; i++) { const ac = AU.ac, t = now(d + i * .17), o = ac.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime(150 - i * 6, t); o.frequency.exponentialRampToValueAtTime(120 - i * 6, t + .1); const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 850; bp.Q.value = 4; const n = nsrc(t, .12), nb = ac.createBiquadFilter(); nb.type = 'bandpass'; nb.frequency.value = 1400; const g = ac.createGain(); envG(g, t, .01, v * (1 - i * .12), .05, .07); o.connect(bp); bp.connect(g); n.connect(nb); nb.connect(g); send(g, .6); o.start(t); o.stop(t + .2); }
}
function slap(d, v = .3) { if (!AU.ok) return; const ac = AU.ac, t = now(d), n = nsrc(t, .1, 1), bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1800; bp.Q.value = .8; const g = ac.createGain(); envG(g, t, .001, v, .01, .06); n.connect(bp); bp.connect(g); send(g, .5); boom(d, .2, .4); }
function gasp(d, v = .1) { if (!AU.ok) return; const ac = AU.ac, t = now(d), n = nsrc(t, .8), bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1300; bp.Q.value = 1.2; const g = ac.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + .18); g.gain.exponentialRampToValueAtTime(.0001, t + .7); n.connect(bp); bp.connect(g); send(g, .6); }
function cricket(d) { if (!AU.ok) return; for (let i = 0; i < 3; i++) { const ac = AU.ac, t = now(d + i * .045), o = ac.createOscillator(); o.frequency.value = 4400 + Math.random() * 300; const g = ac.createGain(); envG(g, t, .003, .012, .015, .01); o.connect(g); send(g, .3); o.start(t); o.stop(t + .05); } }
function owl(d) { if (!AU.ok) return; for (const [o, l] of [[0, .35], [.55, .9]]) { const ac = AU.ac, t = now(d + o), s = ac.createOscillator(); s.frequency.setValueAtTime(390, t); s.frequency.linearRampToValueAtTime(350, t + l); const g = ac.createGain(); envG(g, t, .06, .05, l * .6, .2); s.connect(g); send(g, .7); s.start(t); s.stop(t + l + .4); } }
function shatter(d, v = .2) { if (!AU.ok) return; for (let i = 0; i < 9; i++) clank(d + Math.random() * .25, v * .4 * Math.random()); whoosh(d, .2, v, 2000, 8000); boom(d, v * 2, 1.5); }
function hiss(d, dur = 1.2, v = .05) { if (!AU.ok) return; const ac = AU.ac, t = now(d), n = nsrc(t, dur + .2, 1), bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 5200; bp.Q.value = 2; const g = ac.createGain(); g.gain.setValueAtTime(.0001, t); for (let k = 0; k < 6; k++) g.gain.linearRampToValueAtTime(v * Math.random(), t + dur * (k + 1) / 7); g.gain.linearRampToValueAtTime(.0001, t + dur); n.connect(bp); bp.connect(g); send(g, .6); }

const THEME_A = [['D5', 1], ['F5', 1], ['A5', 1], ['G5', 2], ['F5', 1], ['E5', 1], ['D5', 1], ['Cs5', 1], ['D5', 3], ['A4', 1], ['D5', 1], ['F5', 1], ['E5', 2], ['D5', 1], ['C5', 1], ['Bb4', 1], ['A4', 1], ['A4', 3]];
const THEME_B = [['Bb4', 1], ['D5', 1], ['G5', 1], ['F5', 2], ['E5', 1], ['D5', 1], ['E5', 1], ['Cs5', 1], ['D5', 3]];
const octDown = n => n.replace(/(\d)$/, (m, d) => String(+d - 1));
const lowT = th => th.map(([n, b]) => [n ? octDown(n) : n, b]);
function waltzBass(d, bars, beat = .42, v = .1, chords = ['D3', 'A2', 'D3', 'A2']) { for (let b = 0; b < bars; b++) { koto(d + b * 3 * beat, chords[b % chords.length], v * 3); } }

/* ---------- instrumentos v2 ---------- */
function brass(d, notes, dur = .5, v = .06) { // golpes de metales (sierras con filtro que se abre y cierra)
  if (!AU.ok) return; const ac = AU.ac, t = now(d), lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 2; lp.frequency.setValueAtTime(300, t); lp.frequency.exponentialRampToValueAtTime(2400, t + .06); lp.frequency.exponentialRampToValueAtTime(500, t + dur);
  const g = ac.createGain(); envG(g, t, .02, v, dur * .5, dur * .7); lp.connect(g); send(g, .45);
  for (const n of notes) for (const dt of [-.005, .005]) { const o = ac.createOscillator(); o.type = 'sawtooth'; o.frequency.value = NOTE[n] * (1 + dt); o.connect(lp); o.start(t); o.stop(t + dur * 1.4 + .1); }
}
function ostinato(d, notes, n, step = .18, v = .12) { for (let i = 0; i < n; i++) koto(d + i * step, notes[i % notes.length], v * (i % 4 ? .7 : 1)); }
function tick(d, v = .03) { if (!AU.ok) return; const ac = AU.ac, t = now(d), n = nsrc(t, .03, 1), bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 3800; bp.Q.value = 6; const g = ac.createGain(); envG(g, t, .001, v, .004, .02); n.connect(bp); bp.connect(g); send(g, .3); }
const THEME_D = [['A4', 1], ['B4', 1], ['C5', 1], ['E5', 2], ['D5', 1], ['C5', 1], ['B4', 1], ['G4', 1], ['A4', 3]]; // tema de Draconida (dórico)
const THEME_D2 = [['E5', 1], ['D5', 1], ['C5', 1], ['B4', 2], ['C5', 1], ['A4', 1], ['B4', 1], ['Cs5', 1], ['D5', 3]];
function dracoTheme(d, beat = .5, v = .08, full = 0) { mel(d, THEME_D, beat, 'harp', v); mel(d + .01, THEME_D, beat, 'box', v * .55); if (full) { strings(d, ['A2', 'E3', 'C4'], beat * 9, .035, 900); strings(d + beat * 9, ['D3', 'A3', 'F4'], beat * 9, .035, 900); } }

/* tema de la deuda (Re frigio: el juramento que cobra) */
const THEME_X = [['D4', 1], ['Eb4', 1], ['D4', 1], ['C4', 1], ['Bb3', 2], ['A3', 3]];
function debtTheme(d, beat = .6, v = .08, full = 0) { mel(d, THEME_X, beat, 'harp', v); if (full) { strings(d, ['D2', 'A2', 'F3'], beat * 5, .04, 700); strings(d + beat * 5, ['Eb2', 'Bb2', 'G3'], beat * 4, .04, 700); } }
function crackA(d, v = .4) { boom(d, v, .8); whoosh(d, .25, v * .6, 3000, 300); } // aparición
function fizz(d, v = .04) { zap(d, 900, 260, .25, v, 'triangle'); hiss(d + .05, .35, v * .8); }

/* niveles continuos según T */
function auBeds(T, dt) {
  if (!AU.ok) return;
  const t = AU.ac.currentTime, set = (p, v, k = .5) => p.setTargetAtTime(AU.muted ? 0 : v, t, k);
  const sil = rg(T, 432.1, 432.35) * (1 - rg(T, 432.55, 432.8));
  const wind = (fade(T, 0, 30, 3, 4) * .05 + fade(T, 26, 76, 3, 3) * .05 + fade(T, 72, 116, 3, 3) * .22 + fade(T, 144, 206, 3, 3) * .14 + fade(T, 300, 342, 3, 3) * .08 + fade(T, 338, 364, 3, 3) * .14
    + fade(T, 360, 522, 3, 3) * .12 + fade(T, 518, 554, 3, 3) * .07 + fade(T, 550, 582, 3, 4) * .28 + fade(T, 580, 640, 3, 8) * .05) * (1 - sil);
  set(AU.wind.g.gain, wind); set(AU.wind.f.frequency, 380 + (N2(T * .25, 1) * .5 + .5) * 600, .8); set(AU.wind2.g.gain, wind * .2);
  set(AU.rain.g.gain, 0); set(AU.rain2.g.gain, 0);
  const fire = fade(T, 202, 260, 3, 3) * .3; set(AU.fire.g.gain, fire);
  if (fire > .05 && Math.random() < fire * dt * 20) crackle();
  set(AU.crowd.g.gain, 0);
  const clock = fade(T, 202, 258, 2, 2) + fade(T, 112, 144, 2, 2) * .6; if (clock > .1 && Math.floor(T) !== Math.floor(T - dt) && dt > 0) tick(0, .025 * clock);
  const drone = (fade(T, 4, 30, 4, 3) * .03 + fade(T, 26, 76, 3, 3) * .05 + fade(T, 256, 304, 3, 3) * .07 + fade(T, 386, 448, 3, 4) * .08 + fade(T, 550, 582, 3, 3) * .06 + fade(T, 580, 640, 2, 8) * .04) * (1 - sil);
  set(AU.drone.gain, drone, .8);
  set(AU.tens.gain, (fade(T, 49, 58, 1, 3) * .4 + fade(T, 168, 176, 2, 2) * .5 + fade(T, 264, 272, 1, 2) * .5 + fade(T, 386, 398, 2, 2) * .45 + fade(T, 427, 432.6, 2, .1) * 1 + fade(T, 476, 484, 2, 2) * .35 + fade(T, 556, 578, 3, 3) * .3) * (1 - sil));
}

/* partitura */
const EV = [];
const ev = (t, f) => EV.push({ t, f });
function score() {
  // Prólogo
  ev(2.4, () => { drop(0, .3); boom(.02, .25, 3); });
  ev(3.4, () => mbox(0, NOTE.A5, .09)); ev(4.1, () => mbox(0, NOTE.F5, .09)); ev(4.8, () => mbox(0, NOTE.D5, .09));
  ev(5.6, () => { koto(0, 'D3', .2); mbox(.1, NOTE.E5, .06); });
  ev(7.6, () => { arp(0, ['D3', 'A3', 'D4', 'F4', 'A4'], .14, .2); strings(.2, ['D3', 'A3', 'F4'], 5, .03); });
  ev(10, () => { strings(0, ['D2', 'A2', 'D3'], 9, .045, 800); bell(.5, NOTE.D3, .18, 7); });
  for (let i = 0; i < 8; i++) ev(15.5 + i * (.9 - i * .05), () => heart(0, .35 + i * .04));
  ev(18.6, () => { bell(0, NOTE.D3, .22, 8); choir(.2, ['D3', 'A3', 'Eb4'], 7, .045); debtTheme(.6, .62, .07); });
  // I · la celda
  ev(27, () => { strings(0, ['D2', 'A2', 'F3'], 14, .04, 650); });
  ev(33, () => debtTheme(0, .7, .06));
  ev(41, () => { koto(0, 'D3', .18); koto(1.2, 'A2', .18); });
  ev(50, () => fizz(0, .05)); ev(51, () => { heart(0, .5); boom(0, .25, 1); hiss(0, 1.6, .05); strings(.2, ['D3', 'Eb3'], 6, .04, 700); });
  ev(52.6, () => { heart(0, .45); heart(1, .5); heart(2, .55); heart(3, .55); });
  ev(56.5, () => bell(0, NOTE.A2, .14, 6));
  ev(61.6, () => mel(0, lowT(THEME_X), .7, 'harp', .07));
  ev(68.4, () => laugh(0, .055));
  // I · la torre
  ev(73, () => { strings(0, ['A2', 'E3', 'C4'], 10, .035, 900); });
  ev(74.9, () => zap(0, 300, 1800, .3, .1)); ev(77.1, () => zap(0, 300, 1800, .3, .1));
  ev(79.3, () => { shing(0, .05); swell(0, 4, .08); });
  ev(83.6, () => { shatter(0, .12); boom(0, .4, 1.2); heart(.3, .5); }); ev(85.4, () => { for (let i = 0; i < 6; i++) step(i * .5, .06); });
  ev(89.3, () => { sparkle(0, .05); }); ev(91.6, () => dracoTheme(0, .62, .07));
  ev(104, () => dracoTheme(0, .55, .07, 1));
  // I · Joy
  ev(112.5, () => mel(0, THEME_A.slice(0, 9), .7, 'box', .06));
  ev(116.4, () => fizz(0, .035)); ev(118.4, () => fizz(0, .05)); ev(119.8, () => { heart(0, .4); hiss(0, 1, .04); }); ev(120.3, () => clank(0, .05));
  ev(124, () => strings(0, ['D3', 'F3', 'A3'], 8, .03, 800));
  ev(130.4, () => mel(0, THEME_A.slice(9), .62, 'box', .07));
  ev(138.4, () => { whoosh(0, 1.2, .06, 200, 600); for (let i = 0; i < 4; i++) step(.4 + i * .55, .05); });
  // II · la carta bajo la nieve
  ev(145, () => { bell(0, NOTE.D3, .18, 6); strings(0, ['D2', 'A2', 'D3', 'F3'], 10, .04, 800); });
  ev(146, () => { for (let i = 0; i < 9; i++) step(i * .7, .045); });
  ev(151.2, () => mel(0, lowT(THEME_B), .58, 'harp', .07));
  ev(157.4, () => { strings(0, ['Bb2', 'F3', 'D4'], 6, .035, 900); mbox(.5, NOTE.D5, .06); mbox(1.4, NOTE.F5, .05); });
  ev(164.6, () => { koto(0, 'A2', .22); koto(.8, 'Bb2', .2); });
  ev(170.3, () => { for (let i = 0; i < 4; i++) step(i * .6, .05); });
  ev(172.8, () => { boom(0, .6, 2); zap(0, 200, 1400, .5, .08); shatter(0, .1); choir(0, ['D3', 'Eb3', 'A3'], 4, .06); heart(.4, .6); heart(1.4, .6); });
  ev(180.8, () => hiss(0, 2.4, .04));
  ev(186.6, () => dracoTheme(0, .58, .07));
  ev(197, () => { for (let i = 0; i < 10; i++) step(i * .6, .04); });
  // II · mansión Malfoy
  ev(203, () => { strings(0, ['A2', 'E3', 'C4'], 12, .035, 800); });
  ev(206.6, () => whoosh(0, .5, .06, 300, 900)); ev(213.4, () => { boom(0, .2, .6); sparkle(0, .04, 0); });
  ev(216.2, () => { choir(0, ['D3', 'A3', 'F4'], 10, .035); debtTheme(.4, .7, .07); });
  ev(228.4, () => { strings(0, ['D3', 'Eb3', 'A3'], 6, .045, 600); heart(.8, .5); heart(2, .5); });
  ev(235.5, () => boom(0, .3, .8)); ev(236.2, () => koto(0, 'D3', .22));
  ev(239.6, () => mel(0, lowT(THEME_A).slice(0, 9), .66, 'harp', .06));
  ev(246, () => { for (let i = 0; i < 8; i++) step(i * .7, .045); });
  // II · la fuga
  ev(257, () => { strings(0, ['D2', 'A2'], 10, .045, 600); for (let i = 0; i < 14; i++) { step(i * .66, .06); if (i % 2 === 0) taiko(i * .66, .15, .8); } });
  ev(266.2, () => gasp(0, .08)); ev(267.05, () => { clank(0, .07); shatter(0, .06); });
  ev(267.5, () => { zap(0, 300, 2000, .2, .16); }); ev(267.7, () => { boom(0, .45, 1.2); whoosh(0, .7, .2, 1800, 300); });
  ev(268.65, () => zap(0, 900, 200, .25, .12)); ev(268.85, () => { clank(0, .07); boom(0, .2, .6); });
  ev(269.6, () => zap(0, 300, 2000, .2, .16)); ev(269.8, () => { boom(0, .45, 1.2); whoosh(0, .7, .2, 1800, 300); });
  ev(270.6, () => boom(0, .3, .8)); ev(268.6, () => boom(0, .3, .8));
  ev(272.5, () => { strings(0, ['D3', 'Eb3', 'A3'], 12, .035, 700); });
  ev(278, () => { heart(0, .45); heart(1.1, .5); heart(2.2, .55); debtTheme(.5, .66, .07); });
  ev(284.4, () => laugh(.6, .05));
  ev(291.3, () => { whoosh(0, 1.4, .25, 200, 2200); swell(0, 1.3, .12); }); ev(292.6, () => crackA(0, .55));
  // II · la orilla
  ev(301, () => { strings(0, ['D3', 'Fs3', 'A3'], 10, .035, 1100); chirp(1, .025); chirp(4, .02); });
  ev(303, () => mel(0, THEME_A.slice(0, 12), .62, 'harp', .07));
  ev(309.4, () => dracoTheme(0, .6, .07));
  ev(316.4, () => { strings(0, ['G2', 'D3', 'B3'], 6, .04, 1100); mbox(.5, NOTE.B4, .05); mbox(1.2, NOTE.D5, .05); });
  ev(322.8, () => { mbox(0, NOTE.Fs5, .06); mbox(.6, NOTE.A5, .06); mbox(1.2, NOTE.D6, .05); });
  ev(329, () => dracoTheme(0, .56, .08, 1));
  // III · tres caminos
  ev(338.5, () => { brass(0, ['D3', 'A3', 'D4'], 1.2, .045); ostinato(.4, ['D3', 'A3', 'F3', 'A3'], 96, .2, .11); for (let i = 0; i < 26; i++) taiko(.4 + i * .8, .12 + (i % 4 ? 0 : .1), 1); strings(0, ['D2', 'A2', 'D3'], 18, .04, 700); });
  ev(345.6, () => bell(0, NOTE.D3, .14, 5)); ev(349.4, () => bell(0, NOTE.A2, .14, 5)); ev(353.2, () => { bell(0, NOTE.D3, .16, 6); swell(1, 4, .1); });
  // III · el porche
  ev(361.6, () => crackA(0, .4)); ev(362.6, () => crackA(0, .35)); ev(362.9, () => crackA(0, .3));
  ev(365.5, () => { for (let i = 0; i < 8; i++) step(i * .5, .05); });
  ev(366.6, () => { strings(0, ['D3', 'A3'], 8, .03, 800); bell(0, NOTE.D4, .08, 5); });
  ev(373.4, () => fizz(0, .04)); ev(374.6, () => { zap(0, 600, 1200, .2, .05, 'triangle'); swell(.2, 2, .06); });
  ev(376.2, () => { mel(0, THEME_A, .42, 'box', .08); waltzBass(0, 8, .42, .06); choir(1, ['D4', 'F4', 'A4'], 8, .02); });
  ev(386.4, () => { for (let i = 0; i < 7; i++) step(i * .58, .07); strings(0, ['D2', 'Eb3'], 10, .04, 600); });
  ev(390.6, () => { koto(0, 'D3', .2); koto(1.2, 'Cs4', .15); });
  ev(392, () => { zap(0, 200, 900, 1.5, .06); choir(0, ['D3', 'Eb3', 'A3'], 5, .05); heart(.5, .5); heart(1.5, .55); heart(2.5, .55); });
  ev(395.4, () => { bell(0, NOTE.D3, .2, 7); debtTheme(.5, .55, .07, 1); });
  // el duelo a tres bandas
  ev(398.5, () => { ostinato(0, ['D3', 'D3', 'A3', 'Eb3'], 92, .19, .13); for (let i = 0; i < 22; i++) taiko(i * .76, .28 + (i % 4 ? 0 : .2), 1); brass(0, ['D3', 'A3', 'D4'], .8, .05); });
  ev(403, () => zap(0, 900, 200, .35, .11)); ev(403.35, () => { clank(0, .06); boom(0, .35, 1); heart(.1, .45); });
  ev(405.5, () => { zap(0, 300, 2200, .22, .15); whoosh(0, .2, .35, 400, 3500); }); ev(405.72, () => { boom(0, .4, 1); heart(.1, .45); });
  ev(408.2, () => brass(0, ['Eb3', 'Bb3', 'Eb4'], .6, .05)); ev(409.1, () => { shatter(0, .07); zap(0, 1500, 300, .2, .05, 'triangle'); });
  for (const [t, a, b] of [[410.2, 900, 200], [411.4, 400, 1600], [412.6, 300, 2200], [413.8, 900, 200]]) { ev(t, () => zap(0, a, b, .25, .11)); ev(t + .25, () => { boom(0, .35, .9); heart(.05, .4); }); }
  ev(415.6, () => { zap(0, 200, 600, 7, .06, 'sawtooth'); zap(0, 260, 700, 7, .05, 'square'); swell(0, 7, .12); });
  ev(417, () => { zap(0, 330, 880, 5.6, .045, 'triangle'); brass(0, ['D3', 'F3', 'A3', 'D4'], 1.4, .06); });
  ev(418.2, () => { heart(0, .6); heart(1.4, .65); heart(2.8, .7); });
  ev(422.6, () => { boom(0, 1, 3); shatter(0, .22); choir(0, ['D3', 'Bb3', 'Eb4'], 3, .06); });
  ev(425.5, () => strings(0, ['D2', 'A2'], 7, .05, 600));
  ev(427.5, () => hum(0, 4.9, .12));
  for (let i = 0; i < 8; i++) ev(427.8 + i * (.66 - i * .04), () => heart(0, .45 + i * .03));
  ev(430.4, () => { for (let i = 0; i < 7; i++) step(i * .28, .09); });
  ev(432.6, () => { zap(0, 200, 1200, .3, .14); whoosh(0, .3, .5, 400, 3000); });
  ev(432.9, () => { boom(0, 1, 3.5); shatter(0, .2); choir(0, ['D3', 'A3', 'D4', 'F4'], 5, .08); zap(0, 2400, 120, 1.2, .08); });
  ev(433.7, () => { shatter(0, .14); clank(0, .06); }); ev(434, () => snap(0, .5)); ev(435, () => boom(0, .35, 1.2));
  ev(436.6, () => { strings(0, ['D3', 'F3', 'A3'], 12, .04, 800); mel(1.5, lowT(THEME_A).slice(0, 9), .7, 'harp', .06); });
  ev(443, () => bell(0, NOTE.D3, .12, 6));
  // la elección
  ev(448.6, () => strings(0, ['Bb2', 'F3', 'D4'], 8, .035, 900));
  ev(453.4, () => mel(0, THEME_A.slice(0, 9), .66, 'box', .07));
  ev(457.2, () => laugh(0, .055)); ev(458.2, () => strings(0, ['D2', 'Eb3'], 6, .035, 600));
  ev(464.6, () => dracoTheme(0, .6, .07));
  ev(471.3, () => { choir(0, ['D3', 'Fs3', 'A3', 'D4'], 7, .07); strings(0, ['D2', 'A2', 'Fs3', 'D4'], 9, .05, 1300); bell(.1, NOTE.D4, .14, 7); sparkle(.2, .06); sparkle(1.2, .05); sparkle(2.4, .04); });
  ev(477.4, () => koto(0, 'Cs4', .18)); ev(480.2, () => { heart(0, .55); heart(.9, .55); strings(0, ['D3', 'Eb3', 'A3'], 4, .045, 600); });
  ev(484.6, () => { dracoTheme(0, .6, .07, 1); mbox(.3, NOTE.Fs5, .05); });
  ev(496.4, () => { for (let i = 0; i < 10; i++) step(i * .7, .03); });
  ev(499.4, () => laugh(0, .05)); ev(500.6, () => crackA(0, .5));
  ev(502, () => { strings(0, ['D2', 'A2', 'Eb3'], 10, .045, 700); debtTheme(1, .7, .06); });
  ev(512, () => bell(0, NOTE.A2, .12, 6));
  // epílogo
  ev(519, () => { chirp(0, .025); chirp(3, .02); chirp(7, .025); strings(0, ['D3', 'F3', 'A3'], 12, .03, 900); });
  ev(520.6, () => mel(0, THEME_A.slice(0, 9), .74, 'box', .065));
  ev(526.4, () => { koto(0, 'A2', .18); koto(1.4, 'D3', .16); });
  ev(533, () => mel(0, THEME_D, .6, 'harp', .06)); ev(538.2, () => { mbox(0, NOTE.E5, .06); mbox(.7, NOTE.C5, .05); mbox(1.4, NOTE.A4, .05); });
  ev(546, () => bell(0, NOTE.D4, .08, 5));
  ev(551, () => { strings(0, ['D2', 'A2', 'Eb3'], 14, .045, 600); });
  ev(553, () => debtTheme(0, .72, .07)); ev(556, () => { crow(0, .06); crow(2.3, .05); crow(6, .05); });
  ev(560.2, () => { heart(0, .5); heart(1, .55); }); ev(566, () => { choir(0, ['D3', 'A3', 'Eb4'], 6, .05); bell(.5, NOTE.D3, .15, 7); }); ev(568.2, () => laugh(0, .05));
  // final
  ev(581, () => drop(0, .22)); ev(581.5, () => drop(0, .2)); ev(582, () => drop(0, .2));
  ev(583.5, () => { strings(0, ['D2', 'A2', 'D3', 'F3'], 9, .045, 900); heart(.5, .35); heart(1.5, .35); });
  ev(585, () => { sparkle(0, .04, 0); mbox(1, NOTE.A5, .05); });
  ev(589, () => { bell(0, NOTE.D3, .2, 8); choir(.4, ['A3', 'D4', 'F4'], 7, .04); debtTheme(1, .6, .07); });
  ev(594.4, () => { strings(0, ['A2', 'E3', 'G3', 'D4'], 8, .045, 900); mbox(0, NOTE.A5, .07); mbox(.6, NOTE.D6, .05); });
  ev(597.5, () => dracoTheme(0, .6, .05));
}
