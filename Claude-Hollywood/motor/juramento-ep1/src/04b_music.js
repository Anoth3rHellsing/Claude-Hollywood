/* =====================================================================
   MÚSICA Y SONIDO (Re menor, vals en 3/4): caja de música, arpa,
   cuerdas, coro, campana, hechizos, varita rota. Todo sintetizado.
   ===================================================================== */
Object.assign(NOTE, { Fs3: 185, Fs4: 369.99, Fs5: 739.99, B4: 493.88, Eb3: 155.56, Eb2: 77.78 });
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

/* niveles continuos según T */
function auBeds(T, dt) {
  if (!AU.ok) return;
  const t = AU.ac.currentTime, set = (p, v, k = .5) => p.setTargetAtTime(AU.muted ? 0 : v, t, k);
  const sil = rg(T, 483.9, 484.15) * (1 - rg(T, 484.3, 484.5));
  const wind = (fade(T, 0, 28, 3, 4) * .08 + fade(T, 86, 124, 3, 4) * .2 + fade(T, 176, 224, 3, 3) * .08 + fade(T, 354, 392, 3, 3) * .16 + fade(T, 460, 566, 3, 6) * .06 + fade(T, 596, 640, 3, 8) * .06) * (1 - sil);
  set(AU.wind.g.gain, wind); set(AU.wind.f.frequency, 380 + (N2(T * .25, 1) * .5 + .5) * 600, .8); set(AU.wind2.g.gain, wind * .2);
  const rain = fade(T, 310, 336, 3, 4) * .26; set(AU.rain.g.gain, rain * .4); set(AU.rain2.g.gain, rain);
  const fire = fade(T, 266, 312, 2, 3) * (T > 294 ? .18 : .45); set(AU.fire.g.gain, fire);
  if (fire > .05 && Math.random() < fire * dt * 20) crackle();
  const cr = fade(T, 26, 88, 3, 4); if (cr > .05 && Math.random() < cr * dt * 2.2) cricket(0);
  const crowd = fade(T, 242, 268, 3, 3) * .9 + fade(T, 390, 432, 3, 4) * (1 - rg(T, 403.8, 404.4) * (1 - rg(T, 406, 410)) * .9);
  set(AU.crowd.g.gain, crowd * .22); set(AU.crowd.f.frequency, 420 + Math.random() * 260, .1);
  const lib = fade(T, 334, 356, 2, 2); if (lib > .1) { if (Math.floor(T) !== Math.floor(T - dt) && dt > 0) tick(0, .025 * lib); }
  const drone = (fade(T, 6, 86, 4, 6) * .03 + fade(T, 176, 460, 6, 4) * .06 + fade(T, 460, 566, 2, 6) * .08 + fade(T, 586, 640, 2, 8) * .05) * (1 - sil);
  set(AU.drone.gain, drone, .8);
  set(AU.tens.gain, (fade(T, 198, 222, 3, 3) * .5 + fade(T, 396, 404.5, 3, .2) * .6 + fade(T, 476, 484.3, 3, .1) * 1 + fade(T, 586, 598, 2, 3) * .4) * (1 - sil));
}

/* partitura */
const EV = [];
const ev = (t, f) => EV.push({ t, f });
function score() {
  // Prólogo
  ev(2.6, () => { drop(0, .3); boom(.02, .25, 3); });
  ev(6.2, () => mbox(0, NOTE.A5, .09)); ev(7.0, () => mbox(0, NOTE.F5, .09)); ev(7.8, () => mbox(0, NOTE.D5, .09));
  ev(10.2, () => { arp(0, ['D3', 'A3', 'D4', 'F4', 'A4'], .14, .22); strings(.2, ['D3', 'A3', 'F4'], 6, .035); });
  ev(15, () => { bell(0, NOTE.D3, .2, 7); choir(.3, ['D3', 'A3', 'F4'], 7, .04); });
  // Infancia
  ev(30, () => { mel(0, THEME_A, .42, 'box', .09); waltzBass(0, 8, .42, .07); });
  ev(42, () => { mel(0, THEME_B, .42, 'box', .09); waltzBass(0, 4, .42, .07, ['G2', 'A2', 'A2', 'D3']); owl(3); });
  ev(54, () => strings(0, ['D3', 'F3', 'A3'], 4, .04));
  ev(59, () => sparkle(0, .06));
  ev(64, () => { koto(0, 'D3', .25); koto(.6, 'A3', .2); koto(1.2, 'F4', .2); });
  ev(69.5, () => { strings(0, ['D3', 'A3', 'D4', 'F4'], 6, .05); bell(.4, NOTE.D4, .12, 5); mel(.6, THEME_A.slice(0, 9), .45, 'box', .08); });
  // Hogwarts y Draconida en la orilla
  ev(88, () => { choir(0, ['D3', 'A3', 'F4'], 10, .04); strings(0, ['D2', 'A2', 'D3', 'F3'], 12, .05, 900); });
  ev(91, () => bell(0, NOTE.D3, .22, 7)); ev(94, () => bell(0, NOTE.A2, .18, 7));
  ev(97, () => { mel(0, THEME_A.slice(0, 12), .5, 'harp', .09); strings(0, ['Bb2', 'F3', 'D4'], 4, .04); strings(4, ['A2', 'E3', 'Cs4'], 4, .04); });
  ev(106.5, () => dracoTheme(0, .62, .06));
  // Patio de día
  ev(121, () => { mel(0, THEME_A, .36, 'box', .09); waltzBass(0, 8, .36, .08, ['D3', 'G2', 'A2', 'D3']); });
  ev(130, () => { sparkle(0, .05); sparkle(1.4, .05); });
  ev(137, () => { strings(0, ['F3', 'A3', 'D4'], 6, .035, 1000); mbox(.5, NOTE.A5, .07); mbox(1.2, NOTE.F5, .06); });
  // Cuaderno
  ev(147, () => mel(0, THEME_A.slice(0, 9), .62, 'box', .07));
  ev(158, () => strings(0, ['F3', 'A3', 'D4'], 8, .03, 800));
  ev(162, () => { koto(0, 'A2', .25); koto(1, 'Bb2', .25); });
  // Acto II
  ev(177, () => { strings(0, ['D2', 'A2', 'F3'], 14, .05, 700); for (let i = 0; i < 12; i++) koto(i * .9, ['D3', 'A3', 'F3', 'A3'][i % 4], .16); });
  ev(188, () => mel(0, lowT(THEME_B), .5, 'harp', .07));
  ev(201, () => { strings(0, ['D2', 'Eb4'], 10, .04, 600); heart(1.5, .4); heart(3, .45); heart(4.4, .5); });
  ev(206, () => laugh(0, .05)); ev(214, () => shatter(0, .22));
  ev(223, () => { for (let i = 0; i < 9; i++) hiss(i * 2, 1.4, .035); strings(0, ['A2', 'Bb2', 'E3'], 18, .04, 700); });
  ev(234, () => zap(0, 600, 120, 1.2, .05, 'triangle'));
  // Torneo
  ev(243, () => { for (let i = 0; i < 16; i++) taiko(i * .75, .25, 1.2); brass(0, ['D3', 'A3', 'D4'], .8, .05); });
  ev(251, () => { boom(0, .3, 1.2); strings(0, ['D2', 'Eb3'], 6, .05, 600); });
  ev(257.5, () => { hiss(0, 2, .04); koto(1, 'Cs4', .2); });
  // Cartas y ceniza
  ev(267, () => { mel(0, lowT(THEME_A).slice(0, 9), .66, 'harp', .08); strings(0, ['D3', 'F3', 'Bb3'], 10, .035, 800); });
  ev(274, () => whoosh(0, 1.5, .12, 300, 1200)); ev(283.5, () => whoosh(0, 1.5, .12, 300, 1200));
  ev(296, () => dracoTheme(0, .66, .07));
  // Fuego lento
  ev(310, () => { strings(0, ['D2', 'A2', 'D3'], 24, .05, 600); thunder(4, .3); });
  ev(318, () => { koto(0, 'D3', .2); koto(1.5, 'Cs4', .2); koto(3, 'F3', .2); });
  ev(326, () => { heart(0, .35); heart(1.2, .4); heart(2.3, .45); heart(3.3, .5); });
  // Biblioteca
  ev(336, () => dracoTheme(0, .58, .07));
  ev(346.5, () => { sparkle(0, .05); strings(0, ['A2', 'E3', 'C4'], 6, .035, 1000); });
  // Entrenamiento bajo la nieve (tema de Draconida completo)
  ev(356, () => dracoTheme(0, .55, .08, 1));
  ev(358.4, () => { zap(0, 900, 300, .4, .08, 'triangle'); }); ev(358.7, () => { boom(0, .3, .6); });
  ev(366.2, () => zap(0, 900, 300, .4, .08, 'triangle')); ev(366.45, () => { shing(0, .06); });
  ev(371, () => dracoTheme(0, .55, .08, 1));
  ev(373.4, () => { zap(0, 300, 1800, .35, .12); whoosh(0, .3, .4, 400, 4000); });
  ev(381, () => { mel(0, THEME_D2, .55, 'harp', .08); strings(0, ['D3', 'A3', 'F4'], 6, .04); });
  // La Selección
  ev(392, () => strings(0, ['D3', 'F3', 'A3'], 6, .035));
  ev(396, () => { bell(0, NOTE.D3, .22, 6); swell(2, 6, .14); });
  ev(400, () => bell(0, NOTE.A2, .2, 6));
  ev(404.5, () => { boom(0, .8, 3.5); choir(0, ['D3', 'Bb3', 'Eb4', 'A4'], 5, .08); brass(0, ['D2', 'A2', 'D3', 'F3'], 1.4, .08); zap(0, 200, 1600, .8, .08); sparkle(.3, .07); });
  ev(405.5, () => gasp(0, .14)); ev(407, () => strings(0, ['G2', 'D3', 'Bb3'], 10, .05, 800));
  ev(418, () => mel(0, lowT(THEME_B), .55, 'harp', .07));
  ev(423.5, () => dracoTheme(0, .5, .06));
  // Adorno
  ev(431, () => { mel(0, THEME_A, .5, 'box', .06); waltzBass(0, 8, .5, .05, ['D3', 'Bb2', 'G2', 'A2']); });
  ev(446, () => strings(0, ['D2', 'Eb3'], 6, .04, 600)); ev(450, () => slap(0, .28));
  ev(452, () => { koto(0, 'D3', .2); koto(2, 'Cs4', .15); });
  // Acto III: el duelo
  ev(461, () => { strings(0, ['D2', 'A2'], 8, .05, 600); });
  ev(466, () => { ostinato(0, ['D3', 'D3', 'A3', 'F3'], 52, .19, .14); for (let i = 0; i < 12; i++) taiko(i * .76, .3 + (i % 4 ? 0 : .2), 1); });
  ev(468, () => { zap(0, 400, 1600, .3, .12); }); ev(468.3, () => { clank(0, .05); boom(0, .2, .5); });
  ev(469.6, () => { zap(0, 900, 200, .35, .12); }); ev(469.95, () => { boom(0, .45, 1.2); shatter(0, .1); });
  ev(471.2, () => zap(0, 400, 1600, .25, .12)); ev(471.45, () => boom(0, .25, .6));
  ev(473, () => zap(0, 900, 200, .25, .12)); ev(473.25, () => { boom(0, .6, 1.5); shatter(0, .12); });
  ev(475.2, () => zap(0, 900, 300, .25, .12)); ev(475.5, () => whoosh(0, .9, .2, 2000, 400));
  ev(476.5, () => brass(0, ['D3', 'Eb3', 'A3'], 1.5, .05));
  for (let i = 0; i < 10; i++) ev(478 + i * (.75 - i * .03), () => heart(0, .45 + i * .03));
  ev(479.5, () => hum(0, 4.8, .12));
  ev(480, () => { for (let i = 0; i < 8; i++) step(i * .3, .08); });
  ev(484.3, () => { zap(0, 300, 2400, .25, .2); whoosh(0, .2, .5, 400, 4000); });
  ev(484.5, () => { clank(0, .08); boom(0, .4, 1); }); ev(484.7, () => { boom(0, .6, 1.8); shatter(0, .15); });
  ev(486, () => { brass(0, ['D3', 'A3', 'D4'], .6, .06); brass(.8, ['Eb3', 'Bb3', 'Eb4'], .6, .06); ostinato(.5, ['D3', 'F3', 'A3', 'D4'], 40, .16, .13); });
  ev(487.6, () => { zap(0, 200, 600, 9, .07, 'sawtooth'); zap(0, 260, 700, 9, .06, 'square'); swell(0, 9, .12); });
  ev(491.3, () => { heart(0, .6); heart(1.4, .6); heart(2.8, .65); });
  ev(494.8, () => { brass(0, ['D3', 'F3', 'A3', 'D4'], 1.5, .07); });
  ev(496.7, () => { boom(0, .8, 2); shatter(0, .2); });
  ev(497.6, () => zap(0, 900, 200, .35, .12)); ev(497.95, () => { clank(0, .07); zap(0, 1200, 2400, .3, .05, 'triangle'); });
  ev(499, () => brass(0, ['F3', 'A3', 'C4'], .6, .06));
  ev(500, () => { zap(0, 300, 2400, .2, .2); whoosh(0, .2, .5, 400, 4000); }); ev(500.2, () => { boom(0, .4, 1); whoosh(.2, .9, .2, 2000, 400); });
  ev(502.5, () => { shing(0, .1); whoosh(.25, .14, .5); whoosh(.45, .14, .5); whoosh(.65, .14, .5); });
  ev(505.5, () => { zap(0, 200, 1200, .2, .1); }); ev(505.67, () => { boom(0, 1, 3); zap(0, 120, 60, .6, .2); shatter(.1, .15); });
  ev(506.7, () => { boom(0, .5, 1.2); clank(0, .06); });
  ev(508, () => { strings(0, ['D2', 'A2', 'D3'], 6, .05, 600); for (let i = 0; i < 9; i++) step(i * .6, .06); });
  ev(514, () => snap(0, .6));
  ev(516, () => { strings(0, ['D3', 'F3', 'A3'], 14, .04, 800); mel(1, lowT(THEME_A), .6, 'harp', .07); });
  ev(524, () => { step(0, .06); step(.6, .06); step(1.2, .06); });
  ev(530.5, () => dracoTheme(0, .55, .08));
  ev(536, () => { strings(0, ['D3', 'Fs3', 'A3', 'D4'], 10, .05, 1200); mbox(.5, NOTE.Fs5, .07); mbox(1, NOTE.A5, .07); mbox(1.5, NOTE.D6, .07); });
  for (let i = 0; i < 18; i++) ev(540 + i * .62, () => step(0, .045));
  // Epílogo
  ev(563, () => { strings(0, ['D3', 'A3'], 10, .03, 700); });
  ev(567, () => { whoosh(0, .8, .05, 800, 300); });
  ev(575, () => { mel(0, THEME_A.slice(0, 9), .7, 'box', .07); strings(0, ['D3', 'F3', 'A3'], 8, .035, 900); });
  ev(586, () => { boom(0, .3, 3); for (let i = 0; i < 8; i++) heart(1 + i * 1.3, .4); });
  ev(590, () => { choir(0, ['D3', 'A3', 'Eb4'], 6, .05); });
  // Final
  ev(597, () => { bell(0, NOTE.D3, .2, 7); strings(0, ['D2', 'A2', 'D3', 'F3', 'A3'], 9, .05); choir(.5, ['A3', 'D4', 'F4'], 8, .04); });
  ev(601, () => mel(0, THEME_A.slice(0, 9), .5, 'box', .08));
  ev(608, () => { strings(0, ['A2', 'E3', 'G3', 'D4'], 8, .05, 900); mbox(0, NOTE.A5, .08); mbox(.6, NOTE.D6, .06); });
  ev(612, () => dracoTheme(0, .6, .05));
}
