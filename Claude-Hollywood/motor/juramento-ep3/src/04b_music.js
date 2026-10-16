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
  const sil = rg(T, 470.4, 470.9) * (1 - rg(T, 471.3, 471.6));
  const wind = (fade(T, 0, 30, 3, 4) * .04 + fade(T, 86, 124, 3, 3) * .26 + fade(T, 120, 150, 3, 3) * .04 + fade(T, 148, 200, 3, 3) * .14 + fade(T, 196, 234, 3, 3) * .2 + fade(T, 232, 286, 3, 3) * .1
    + fade(T, 284, 332, 3, 3) * .2 + fade(T, 328, 522, 3, 3) * .12 + fade(T, 518, 582, 3, 3) * .05 + fade(T, 578, 640, 3, 8) * .04) * (1 - sil);
  set(AU.wind.g.gain, wind); set(AU.wind.f.frequency, 380 + (N2(T * .25, 1) * .5 + .5) * 600, .8); set(AU.wind2.g.gain, wind * .2);
  set(AU.rain.g.gain, 0); set(AU.rain2.g.gain, 0); set(AU.crowd.g.gain, 0);
  const fire = fade(T, 86, 124, 3, 3) * .3 + fade(T, 26, 66, 3, 3) * .1; set(AU.fire.g.gain, fire);
  if (fire > .05 && Math.random() < fire * dt * 20) crackle();
  const clock = fade(T, 62, 90, 2, 2); if (clock > .1 && Math.floor(T) !== Math.floor(T - dt) && dt > 0) tick(0, .025 * clock);
  const cr = fade(T, 540, 582, 3, 4); if (cr > .05 && Math.random() < cr * dt * 2.2) cricket(0);
  const drone = (fade(T, 4, 30, 4, 3) * .03 + fade(T, 26, 66, 3, 3) * .06 + fade(T, 86, 124, 3, 3) * .05 + fade(T, 372, Q.brk, 3, .5) * .08 + fade(T, 578, 640, 2, 8) * .04) * (1 - sil);
  set(AU.drone.gain, drone, .8);
  set(AU.tens.gain, (fade(T, 44, 52, 1, 3) * .3 + fade(T, 92, 100, 1, 3) * .4 + fade(T, 158, 168, 1, 3) * .4 + fade(T, 372, 410, 3, 2) * .6 + fade(T, 446, 471, 3, .3) * .5) * (1 - sil));
}

/* partitura */
const EV = [];
const ev = (t, f) => EV.push({ t, f });
function score() {
  // Prólogo
  ev(2.4, () => { drop(0, .3); boom(.02, .25, 3); });
  ev(3.2, () => mbox(0, NOTE.A5, .08)); ev(3.6, () => mbox(0, NOTE.F5, .08)); ev(4, () => mbox(0, NOTE.D5, .08));
  ev(4.6, () => { strings(0, ['D3', 'A3'], 6, .03, 800); koto(.2, 'D3', .2); });
  ev(6.5, () => { zap(0, 120, 300, 4, .03, 'triangle'); heart(.5, .35); heart(1.6, .35); });
  ev(12.5, () => bell(0, NOTE.A2, .12, 5)); ev(14, () => bell(0, NOTE.D3, .14, 5)); ev(15.5, () => { bell(0, NOTE.D2 * 2, .16, 7); choir(.3, ['D3', 'Eb3', 'A3'], 4, .03); });
  ev(19, () => { bell(0, NOTE.D3, .2, 8); choir(.2, ['D3', 'A3', 'F4'], 7, .04); debtTheme(.6, .62, .07); });
  // I · sala común
  ev(27, () => strings(0, ['A2', 'E3', 'C4'], 14, .03, 800));
  ev(30, () => dracoTheme(0, .7, .06));
  ev(44, () => { heart(0, .5); heart(.9, .5); hiss(0, 1.4, .04); strings(.1, ['D3', 'Eb3', 'A3'], 6, .04, 700); });
  ev(47, () => { for (let i = 0; i < 5; i++) step(i * .5, .05); });
  ev(52, () => mel(0, THEME_D, .62, 'box', .06));
  ev(56.6, () => { mbox(0, NOTE.E5, .05); mbox(.9, NOTE.Eb5, .04); });
  // I · Joy
  ev(63, () => { heart(0, .4); heart(.9, .4); }); ev(68.4, () => { zap(0, 600, 1200, .2, .04, 'triangle'); sparkle(.1, .03); });
  ev(70, () => mel(0, THEME_A.slice(0, 9), .72, 'box', .06)); ev(77, () => strings(0, ['D3', 'Eb3'], 7, .035, 700));
  // I · ruina
  ev(87, () => strings(0, ['D2', 'A2'], 12, .045, 600));
  ev(92, () => { heart(0, .55); heart(.8, .6); heart(1.6, .65); boom(.3, .35, 1.2); });
  ev(95.4, () => thunder(0, .25));
  ev(99, () => { choir(0, ['D3', 'Eb3', 'A3'], 8, .05); swell(0, 6, .08); });
  ev(104, () => debtTheme(0, .7, .07)); ev(115.2, () => laugh(0, .05));
  // II · el secreto
  ev(121.4, () => bell(0, NOTE.D3, .16, 6)); ev(123, () => dracoTheme(0, .68, .06));
  ev(130, () => { heart(0, .3); heart(1.1, .3); mbox(.4, NOTE.A5, .04); }); ev(139.2, () => strings(0, ['A2', 'E3', 'C4'], 7, .03, 800));
  // II · la segunda luna
  ev(149, () => { strings(0, ['D2', 'A2', 'D3', 'F3'], 10, .04, 800); for (let i = 0; i < 9; i++) step(i * .7, .045); });
  ev(158, () => { boom(0, .45, 1.6); gasp(0, .1); choir(0, ['D3', 'Eb3', 'A3'], 5, .06); heart(.4, .55); heart(1.3, .55); });
  ev(166, () => { for (let i = 0; i < 9; i++) step(i * .38, .07); });
  ev(171.2, () => strings(0, ['Bb2', 'F3', 'D4'], 8, .035, 900));
  ev(178.8, () => mel(0, THEME_D, .66, 'harp', .07)); ev(184.6, () => bell(0, NOTE.A2, .14, 6));
  // II · la carta de Damien
  ev(197, () => crow(0, .06)); ev(200.6, () => crow(0, .05)); ev(202.4, () => whoosh(0, .7, .06, 900, 300));
  ev(207, () => { strings(0, ['D2', 'Eb3'], 10, .04, 600); debtTheme(1.5, .66, .07); });
  ev(221.4, () => zap(0, 300, 1800, .25, .1)); ev(222, () => { whoosh(0, 1.5, .1, 300, 1200); });
  ev(226.2, () => bell(0, NOTE.D3, .12, 6));
  // II · del mismo lado
  ev(233, () => { mel(0, THEME_A, .4, 'box', .07); waltzBass(0, 8, .4, .06); });
  ev(236.2, () => zap(0, 900, 300, .3, .08, 'triangle')); ev(236.45, () => shing(0, .05));
  ev(240.2, () => zap(0, 900, 300, .3, .08, 'triangle')); ev(240.45, () => shing(0, .05));
  ev(245.2, () => { brass(0, ['D3', 'A3', 'D4'], 1.2, .05); zap(0, 200, 700, 3.5, .05); swell(0, 3.5, .1); }); ev(249, () => boom(0, .3, 1));
  ev(251.8, () => strings(0, ['F3', 'A3', 'D4'], 8, .035, 900)); ev(258.6, () => koto(0, 'A2', .22));
  ev(262.6, () => mel(0, lowT(THEME_A).slice(0, 9), .7, 'harp', .06)); ev(274.2, () => bell(0, NOTE.D4, .08, 5));
  // II · la víspera
  ev(285, () => strings(0, ['A2', 'E3', 'C4'], 10, .03, 900)); ev(291.6, () => dracoTheme(0, .62, .07));
  ev(298.6, () => { mbox(0, NOTE.E5, .05); mbox(.6, NOTE.C5, .05); });
  ev(305.4, () => { choir(0, ['D3', 'Fs3', 'A3'], 6, .04); strings(0, ['D3', 'Fs3', 'A3', 'D4'], 8, .04, 1200); });
  ev(310.6, () => mel(0, THEME_D2, .6, 'harp', .07)); ev(316.4, () => bell(0, NOTE.A2, .1, 6));
  // III · el porche
  ev(331.4, () => { bell(0, NOTE.D3, .18, 7); strings(0, ['D2', 'A2', 'D3'], 12, .045, 700); });
  ev(334, () => crackA(0, .4)); ev(335, () => crackA(0, .35)); ev(335.2, () => crackA(0, .3));
  ev(341, () => { for (let i = 0; i < 6; i++) step(i * .58, .06); });
  ev(343, () => debtTheme(0, .7, .06)); ev(356, () => { for (let i = 0; i < 4; i++) step(i * .55, .06); }); ev(361.8, () => { heart(0, .4); heart(.9, .4); });
  ev(372, () => { choir(0, ['D3', 'Eb3', 'A3'], 8, .06); swell(0, 3, .12); zap(0, 120, 400, 3, .05); });
  ev(375, () => { gasp(0, .12); boom(0, .4, 1.4); heart(.5, .55); });
  ev(380, () => { ostinato(0, ['D3', 'D3', 'A3', 'Eb3'], 150, .19, .12); for (let i = 0; i < 38; i++) taiko(i * .76, .22 + (i % 4 ? 0 : .15), 1); });
  ev(386.6, () => { zap(0, 300, 2200, .22, .15); whoosh(0, .2, .35, 400, 3500); }); ev(386.85, () => { boom(0, .4, 1); heart(.1, .5); });
  ev(392, () => brass(0, ['Eb3', 'Bb3', 'Eb4'], .8, .05)); ev(399, () => gasp(0, .1)); ev(404, () => bell(0, NOTE.D2 * 2, .14, 6));
  ev(408, () => { for (let i = 0; i < 6; i++) step(i * .4, .08); });
  ev(410.5, () => { boom(0, .7, 2.5); choir(0, ['D3', 'A3', 'Eb4'], 6, .07); zap(0, 200, 900, 1.2, .06); swell(0, 3, .12); });
  for (let i = 0; i < 8; i++) ev(416 + i * 2, () => sparkle(0, .04, 0));
  ev(418, () => { heart(0, .6); heart(1.6, .6); heart(3.2, .6); });
  ev(425, () => { strings(0, ['D3', 'F3', 'A3'], 9, .045, 800); mel(.5, lowT(THEME_A).slice(0, 9), .7, 'harp', .06); });
  ev(433, () => boom(0, .25, 1)); ev(436.6, () => { for (let i = 0; i < 9; i++) step(i * .6, .055); });
  ev(443, () => strings(0, ['Bb2', 'F3', 'D4'], 12, .035, 900));
  ev(449, () => mel(0, THEME_A.slice(0, 9), .74, 'harp', .07));
  ev(455, () => { bell(0, NOTE.D4, .1, 6); koto(.3, 'D3', .2); });
  ev(460.4, () => koto(0, 'Cs4', .15)); ev(464.4, () => dracoTheme(0, .6, .06));
  ev(Q.brk, () => { boom(0, 1, 4); choir(0, ['D3', 'Fs3', 'A3', 'D4'], 9, .09); strings(0, ['D2', 'A2', 'Fs3', 'D4'], 11, .06, 1400); bell(.1, NOTE.D4, .16, 8); sparkle(.2, .06); sparkle(1.2, .05); sparkle(2.4, .04); zap(0, 400, 2400, 1.6, .06); });
  ev(476, () => mel(0, THEME_D2, .7, 'harp', .07));
  ev(489.4, () => strings(0, ['D3', 'F3', 'A3'], 8, .035, 900)); ev(493.6, () => koto(0, 'A2', .2));
  ev(497, () => { for (let i = 0; i < 10; i++) step(i * .7, .035); }); ev(503.4, () => strings(0, ['D2', 'A2', 'F3'], 10, .04, 700));
  ev(508.6, () => clank(0, .05)); ev(510.4, () => bell(0, NOTE.A2, .12, 7));
  // epílogo
  ev(519, () => { chirp(0, .025); chirp(3, .02); chirp(7, .025); });
  ev(520.6, () => { mel(0, THEME_A, .46, 'box', .08); waltzBass(0, 8, .46, .06); strings(0, ['D3', 'F3', 'A3'], 12, .03, 1000); });
  ev(525.6, () => { tick(0, .05); whoosh(0, .3, .05, 2000, 600); });
  ev(529, () => { for (let i = 0; i < 10; i++) step(i * .7, .04); });
  ev(535.6, () => dracoTheme(0, .6, .07)); ev(544.6, () => strings(0, ['D3', 'Fs3', 'A3', 'D4'], 10, .04, 1200));
  ev(550, () => { mbox(0, NOTE.Fs5, .06); mbox(.6, NOTE.A5, .06); mbox(1.2, NOTE.D6, .05); });
  ev(560.6, () => choir(0, ['D3', 'Fs3', 'A3'], 7, .035)); ev(566.4, () => mel(0, THEME_D2, .64, 'harp', .07));
  // final
  ev(579, () => drop(0, .22)); ev(579.5, () => drop(0, .2)); ev(580, () => drop(0, .2)); ev(581.5, () => drop(0, .14));
  ev(583, () => { strings(0, ['D2', 'A2', 'D3', 'Fs3'], 9, .045, 1100); });
  ev(586, () => { bell(0, NOTE.D3, .2, 8); choir(.4, ['D3', 'Fs3', 'A3', 'D4'], 7, .045); });
  ev(588.4, () => mel(0, THEME_A.slice(0, 9), .56, 'box', .07));
  ev(591.4, () => { strings(0, ['D2', 'A2', 'Fs3', 'D4'], 9, .05, 1200); mbox(0, NOTE.Fs5, .06); mbox(.6, NOTE.A5, .06); mbox(1.2, NOTE.D6, .06); });
  ev(595, () => dracoTheme(0, .62, .05));
}
