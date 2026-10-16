/* =====================================================================
   SONIDO: viento (ruido filtrado), acordes de pad, zumbido de la maldición,
   campanas al tomarse la mano y chispas al deshacerse los hilos. Todo sintetizado.
   ===================================================================== */
const AU = { ac: null, last: -1 };
const NT = n => 440 * Math.pow(2, (n - 69) / 12);
const CHORDS = [[0, [57, 60, 64, 69]], [7, [53, 57, 60, 65]], [14, [50, 53, 57, 62]], [23, [52, 56, 59, 64]], [28.2, [48, 52, 55, 60]], [33, [53, 57, 60, 65]], [38, [48, 55, 60, 64]], [42, [45, 52, 57, 60]], [46, [48, 52, 55, 64]]];
const EVENTS = [
  [17.6, () => pluck([76, 74, 72], .42)],          // «Te perdono.»
  [23.4, () => pluck([69, 72, 76, 74], .5)],
  [28.0, () => chime([72, 76, 79, 84], .16)],      // se toman la mano
  [33.0, () => sparkle(18, 2.6)],                   // los hilos se deshacen
  [36.5, () => chime([79, 84, 88], .3)],
  [41.0, () => pluck([64, 67, 72], .6)],
];
function auInit() {
  const ac = new (window.AudioContext || window.webkitAudioContext)(); AU.ac = ac;
  const comp = ac.createDynamicsCompressor(); comp.connect(ac.destination);
  AU.master = ac.createGain(); AU.master.gain.value = 0; AU.master.connect(comp);
  const rev = ac.createConvolver(), len = ac.sampleRate * 2.6, ir = ac.createBuffer(2, len, ac.sampleRate);
  for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.4); }
  rev.buffer = ir; AU.rev = ac.createGain(); AU.rev.gain.value = .5; AU.rev.connect(rev); rev.connect(AU.master);
  /* viento */
  const nb = ac.createBuffer(1, ac.sampleRate * 3, ac.sampleRate), nd = nb.getChannelData(0); let b = 0; for (let i = 0; i < nd.length; i++) { b = b * .985 + (Math.random() * 2 - 1) * .015; nd[i] = b * 6; }
  const ns = ac.createBufferSource(); ns.buffer = nb; ns.loop = true; AU.wf = ac.createBiquadFilter(); AU.wf.type = 'bandpass'; AU.wf.Q.value = .8; AU.wf.frequency.value = 500;
  AU.wind = ac.createGain(); AU.wind.gain.value = .0; ns.connect(AU.wf); AU.wf.connect(AU.wind); AU.wind.connect(AU.master); ns.start();
  /* pad: 4 voces de dos osciladores desafinados */
  AU.pad = ac.createGain(); AU.pad.gain.value = .0; const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1400; AU.pad.connect(lp); lp.connect(AU.master); lp.connect(AU.rev);
  AU.voices = [0, 1, 2, 3].map(() => { const o1 = ac.createOscillator(), o2 = ac.createOscillator(), g = ac.createGain(); o1.type = 'triangle'; o2.type = 'sine'; o2.detune.value = 7; g.gain.value = .07; o1.connect(g); o2.connect(g); g.connect(AU.pad); o1.start(); o2.start(); return [o1, o2]; });
  /* zumbido grave de la maldición */
  AU.drone = ac.createGain(); AU.drone.gain.value = 0; const d1 = ac.createOscillator(), d2 = ac.createOscillator(), lfo = ac.createOscillator(), lg = ac.createGain();
  d1.frequency.value = 55; d2.frequency.value = 82.4; d2.type = 'triangle'; lfo.frequency.value = .7; lg.gain.value = .04; lfo.connect(lg); lg.connect(AU.drone.gain);
  d1.connect(AU.drone); d2.connect(AU.drone); AU.drone.connect(AU.master); d1.start(); d2.start(); lfo.start();
}
function tone(f, at, dur, vol, type = 'sine', rev = .6) {
  const ac = AU.ac, o = ac.createOscillator(), o2 = ac.createOscillator(), g = ac.createGain();
  o.type = type; o.frequency.value = f; o2.type = 'sine'; o2.frequency.value = f * 2.001;
  const g2 = ac.createGain(); g2.gain.value = .25; o2.connect(g2); g2.connect(g); o.connect(g);
  g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(vol, at + .012); g.gain.exponentialRampToValueAtTime(.0005, at + dur);
  g.connect(AU.master); const r = ac.createGain(); r.gain.value = rev; g.connect(r); r.connect(AU.rev);
  o.start(at); o2.start(at); o.stop(at + dur + .05); o2.stop(at + dur + .05);
}
function pluck(ns, gap) { const t = AU.ac.currentTime; ns.forEach((n, i) => tone(NT(n), t + i * gap, 2.4, .09, 'triangle')); }
function chime(ns, gap) { const t = AU.ac.currentTime; ns.forEach((n, i) => { tone(NT(n), t + i * gap, 3.5, .07); tone(NT(n) * 2.76, t + i * gap, 1.6, .015); }); }
function sparkle(n, span) { const t = AU.ac.currentTime, pent = [72, 74, 76, 79, 81, 84, 86, 88, 91]; for (let i = 0; i < n; i++) tone(NT(pent[Math.floor(Math.random() * pent.length)]), t + Math.random() * span, 1.2, .025); }
function auUpdate(t, playing) {
  if (!AU.ac) return;
  const ac = AU.ac, now = ac.currentTime, k = .25;
  AU.master.gain.setTargetAtTime(playing ? .9 * Math.min(1, t / 1.5) * (1 - sm((t - 49) / 3)) : 0, now, .1);
  const wide = SHOTS.find(s => t >= s.t0 && t < s.t1 && (s.t0 === 0 || s.t0 === 14 || s.t0 === 33));
  AU.wind.gain.setTargetAtTime(wide ? .05 : .025, now, .5); AU.wf.frequency.setTargetAtTime(420 + 260 * Math.sin(t * .37) + 120 * Math.sin(t * 1.1), now, .3);
  AU.drone.gain.setTargetAtTime(.1 * CURSE(t) * (t < 48 ? 1 : 0), now, .4);
  AU.pad.gain.setTargetAtTime(t < 48.5 ? .55 : .3 * (1 - sm((t - 50) / 2)), now, .5);
  let ch = CHORDS[0][1]; for (const [t0, c] of CHORDS) if (t >= t0) ch = c;
  AU.voices.forEach(([o1, o2], i) => { o1.frequency.setTargetAtTime(NT(ch[i]), now, k); o2.frequency.setTargetAtTime(NT(ch[i]), now, k); });
  if (playing) for (const [te, fn] of EVENTS) if (AU.last < te && t >= te && t - te < .5) fn();
  AU.last = t;
}
