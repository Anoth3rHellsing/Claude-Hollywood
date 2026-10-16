/* =====================================================================
   SONIDO procedural: lluvia sobre el vidrio, truenos, viento y huracán, fuego, piedra,
   cristal (cientos de tintineos), raíces, metal que cede, el zumbido del choque,
   la succión del punto negro y el silencio de la detonación. Todo sintetizado.
   ===================================================================== */
const AU = { ac: null, last: -1 };
const NT = n => 440 * Math.pow(2, (n - 69) / 12);
function auInit() {
  const ac = new (window.AudioContext || window.webkitAudioContext)(); AU.ac = ac;
  const comp = ac.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 4; comp.connect(ac.destination);
  AU.master = ac.createGain(); AU.master.gain.value = 0; AU.master.connect(comp);
  const rev = ac.createConvolver(), len = ac.sampleRate * 3.2, ir = ac.createBuffer(2, len, ac.sampleRate);
  for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
  rev.buffer = ir; AU.rev = ac.createGain(); AU.rev.gain.value = .55; AU.rev.connect(rev); rev.connect(AU.master);
  /* ruidos base */
  const mkNoise = (sec, brown) => { const b = ac.createBuffer(1, ac.sampleRate * sec, ac.sampleRate), d = b.getChannelData(0); let l = 0; for (let i = 0; i < d.length; i++) { const w = Math.random() * 2 - 1; if (brown) { l = (l + .02 * w) / 1.02; d[i] = l * 3.5; } else d[i] = w; } return b; };
  AU.white = mkNoise(4, false); AU.brown = mkNoise(4, true);
  const bed = (buf, type, f, q, dest = AU.master) => { const s = ac.createBufferSource(); s.buffer = buf; s.loop = true; const fl = ac.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q; const g = ac.createGain(); g.gain.value = 0; s.connect(fl); fl.connect(g); g.connect(dest); s.start(); return { g, fl }; };
  AU.rain = bed(AU.white, 'bandpass', 2600, .5); AU.rainLo = bed(AU.brown, 'lowpass', 500, .7);
  AU.wind = bed(AU.brown, 'bandpass', 420, 1.1); AU.fire = bed(AU.brown, 'lowpass', 900, .6);
  /* zumbido grave y tensión */
  AU.drone = ac.createGain(); AU.drone.gain.value = 0; AU.drone.connect(AU.master);
  for (const [f, ty] of [[55, 'sine'], [82.4, 'triangle'], [55.6, 'sine']]) { const o = ac.createOscillator(); o.type = ty; o.frequency.value = f; o.connect(AU.drone); o.start(); }
  /* el choque de los haces: dos sierras que pelean, con trémolo */
  AU.clash = ac.createGain(); AU.clash.gain.value = 0; const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900; AU.clashF = lp; lp.connect(AU.clash); AU.clash.connect(AU.master); AU.clash.connect(AU.rev);
  const trem = ac.createOscillator(), tg = ac.createGain(); trem.frequency.value = 7; tg.gain.value = .35; trem.connect(tg); tg.connect(AU.clash.gain); trem.start();
  AU.clashO = [[98, 'sawtooth'], [104, 'sawtooth'], [196.5, 'square']].map(([f, ty]) => { const o = ac.createOscillator(), g = ac.createGain(); o.type = ty; o.frequency.value = f; g.gain.value = ty === 'square' ? .04 : .12; o.connect(g); g.connect(lp); o.start(); return o; });
  /* pad de cuerdas: 4 voces */
  AU.pad = ac.createGain(); AU.pad.gain.value = 0; const plp = ac.createBiquadFilter(); plp.type = 'lowpass'; plp.frequency.value = 1300; AU.pad.connect(plp); plp.connect(AU.master); plp.connect(AU.rev);
  AU.voices = [0, 1, 2, 3].map(() => { const o1 = ac.createOscillator(), o2 = ac.createOscillator(), g = ac.createGain(); o1.type = 'sawtooth'; o2.type = 'triangle'; o2.detune.value = 9; g.gain.value = .035; o1.connect(g); o2.connect(g); g.connect(AU.pad); o1.start(); o2.start(); return [o1, o2]; });
  /* zumbido de oído tras la detonación */
  AU.ring = ac.createGain(); AU.ring.gain.value = 0; const ro = ac.createOscillator(); ro.frequency.value = 4186; ro.connect(AU.ring); AU.ring.connect(AU.master); ro.start();
  buildEvents();
}
/* ---------- primitivas ---------- */
function nz(at, dur, o = {}) {
  const ac = AU.ac, s = ac.createBufferSource(); s.buffer = o.brown ? AU.brown : AU.white; s.loop = true;
  const f = ac.createBiquadFilter(); f.type = o.type || 'bandpass'; f.frequency.setValueAtTime(o.f || 1000, at); if (o.f2) f.frequency.exponentialRampToValueAtTime(o.f2, at + dur); f.Q.value = o.q ?? 1;
  const g = ac.createGain(), v = o.vol ?? .2, atk = o.atk ?? .005; g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(v, at + atk); g.gain.exponentialRampToValueAtTime(.0005, at + Math.max(dur, atk + .01));
  s.connect(f); f.connect(g); g.connect(AU.master); if (o.rev) { const r = ac.createGain(); r.gain.value = o.rev; g.connect(r); r.connect(AU.rev); }
  s.start(at, Math.random() * 2); s.stop(at + dur + .05);
}
function tone(f, at, dur, vol, type = 'sine', rev = .5, f2, atk = .008) {
  const ac = AU.ac, o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.setValueAtTime(f, at); if (f2) o.frequency.exponentialRampToValueAtTime(f2, at + dur);
  g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(vol, at + atk); g.gain.exponentialRampToValueAtTime(.0005, at + Math.max(dur, atk + .01));
  o.connect(g); g.connect(AU.master); if (rev) { const r = ac.createGain(); r.gain.value = rev; g.connect(r); r.connect(AU.rev); }
  o.start(at); o.stop(at + dur + .05);
}
function bell(f, at, dur, vol) {   // campana FM
  const ac = AU.ac, c = ac.createOscillator(), m = ac.createOscillator(), mg = ac.createGain(), g = ac.createGain();
  c.frequency.value = f; m.frequency.value = f * 3.5; mg.gain.setValueAtTime(f * 2.2, at); mg.gain.exponentialRampToValueAtTime(f * .1, at + dur);
  m.connect(mg); mg.connect(c.frequency); g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(vol, at + .005); g.gain.exponentialRampToValueAtTime(.0005, at + dur);
  c.connect(g); g.connect(AU.master); const r = ac.createGain(); r.gain.value = .7; g.connect(r); r.connect(AU.rev);
  c.start(at); m.start(at); c.stop(at + dur + .05); m.stop(at + dur + .05);
}
const now = () => AU.ac.currentTime;
function thunder(at, k) { nz(at, 3.5 + k * 2, { brown: true, type: 'lowpass', f: 260, f2: 70, vol: .55 * k, atk: .25, rev: .4 }); nz(at + .15, 2.5, { brown: true, type: 'lowpass', f: 120, vol: .4 * k, atk: .4 }); }
function boom(at, vol = .6) { tone(110, at, .9, vol, 'sine', .3, 32); nz(at, 1.4, { brown: true, type: 'lowpass', f: 400, f2: 60, vol: vol * .7, rev: .5 }); }
function thump(at, vol = .4) { tone(140, at, .45, vol, 'sine', .2, 45); nz(at, .3, { type: 'lowpass', f: 300, vol: vol * .5 }); }
function whoosh(at, dur = .5, vol = .25, f1 = 300, f2 = 2600) { nz(at, dur, { type: 'bandpass', f: f1, f2, q: 1.2, vol, atk: dur * .5, rev: .3 }); }
function tinkle(at, n, span, vol = .06) { for (let i = 0; i < n; i++) { const t = at + Math.pow(Math.random(), 1.6) * span, f = 2400 + Math.random() * 4200; tone(f, t, .15 + Math.random() * .35, vol * (.5 + Math.random()), 'sine', .6); if (Math.random() < .3) tone(f * 1.51, t, .1, vol * .4, 'sine', .4); } }
function shatter(at, vol = .5, n = 40, span = 1.4) { nz(at, .5, { type: 'highpass', f: 2500, vol: vol * .7, rev: .6 }); nz(at, .25, { type: 'bandpass', f: 900, vol: vol * .5 }); tinkle(at + .02, n, span, .05 * vol / .5); }
function crackle(at, dur, dens = 30, vol = .08) { for (let i = 0; i < dur * dens; i++) { const t = at + Math.random() * dur; nz(t, .02 + Math.random() * .04, { type: 'bandpass', f: 1500 + Math.random() * 3000, q: 2, vol: vol * Math.random() }); } }
function grind(at, dur, vol = .3) { nz(at, dur, { brown: true, type: 'bandpass', f: 180, f2: 420, q: 3, vol, atk: .05, rev: .2 }); crackle(at, dur, 40, .06); }
function creak(at, dur, f = 90, f2 = 60, vol = .14) { const ac = AU.ac, o = ac.createOscillator(), fl = ac.createBiquadFilter(), g = ac.createGain(); o.type = 'sawtooth'; o.frequency.setValueAtTime(f, at); o.frequency.linearRampToValueAtTime(f2, at + dur); fl.type = 'bandpass'; fl.frequency.value = f * 6; fl.Q.value = 6; g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(vol, at + dur * .2); g.gain.exponentialRampToValueAtTime(.0005, at + dur); o.connect(fl); fl.connect(g); g.connect(AU.master); const r = ac.createGain(); r.gain.value = .4; g.connect(r); r.connect(AU.rev); o.start(at); o.stop(at + dur + .05); }
function clang(at, vol = .35) { for (const [r, d] of [[1, 2.4], [2.76, 1.6], [5.4, 1.1], [8.9, .7]]) tone(170 * r, at, d, vol / (1 + r * .4), 'sine', .6); nz(at, .2, { type: 'highpass', f: 3000, vol: vol * .4 }); }
function screech(at, dur = 1.2, vol = .12) { const ac = AU.ac, o = ac.createOscillator(), m = ac.createOscillator(), mg = ac.createGain(), g = ac.createGain(); o.type = 'sawtooth'; o.frequency.setValueAtTime(900, at); o.frequency.exponentialRampToValueAtTime(240, at + dur); m.frequency.value = 37; mg.gain.value = 140; m.connect(mg); mg.connect(o.frequency); g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(vol, at + .05); g.gain.exponentialRampToValueAtTime(.0005, at + dur); o.connect(g); g.connect(AU.master); const r = ac.createGain(); r.gain.value = .5; g.connect(r); r.connect(AU.rev); o.start(at); m.start(at); o.stop(at + dur + .05); m.stop(at + dur + .05); }
function zap(at, f1, f2, dur = .35, vol = .2) { tone(f1, at, dur, vol, 'sawtooth', .5, f2); tone(f1 * 1.5, at, dur * .7, vol * .5, 'square', .4, f2 * 1.5); }
function breath(at, f = 1100, vol = .05) { nz(at, .5, { type: 'bandpass', f, q: 1.5, vol, atk: .18 }); }
/* ---------- la partitura ---------- */
function buildEvents() {
  const E = [];
  for (const [t0, , k] of BOLTS) { if (k > .8) E.push([t0, () => nz(now(), .35, { type: 'highpass', f: 1500, vol: .3 * k, rev: .7 })]); E.push([t0 + .55 + (1 - k) * 1.2, () => thunder(now(), k)]); }
  for (let t = 1.2; t < 30; t += 1.3 + (t * 7 % 1.1)) E.push([t, () => tone(1400 + Math.random() * 1400, now(), .25, .03, 'sine', .8)]);
  E.push([25.6, () => { for (let i = 0; i < 7; i++) tone(900 + i * 140, now() + i * .55, 1.6, .045, 'sine', .9, 700 + i * 120); }]);
  /* bloque 2 */
  E.push([32.4, () => { tone(220, now(), 4.8, .05, 'sine', .6, 880); tone(330, now() + .2, 4.6, .03, 'triangle', .6, 1320); crackle(now() + 1, 3.6, 18, .05); }]);
  E.push([37.2, () => { whoosh(now(), .35, .35, 400, 3800); nz(now(), .12, { type: 'highpass', f: 2200, vol: .4 }); }]);
  E.push([37.5, () => { nz(now(), 1.2, { type: 'highpass', f: 3000, vol: .18, atk: .1, rev: .3 }); crackle(now(), 2, 50, .09); }]);
  E.push([38.6, () => { thump(now(), .55); grind(now() + .05, .6, .35); }]);
  E.push([38.96, () => crackle(now(), .4, 60, .12)]);
  E.push([WHIPHIT, () => { boom(now(), .7); nz(now(), .6, { type: 'bandpass', f: 600, vol: .3, rev: .6 }); }]);
  E.push([39.75, () => { clang(now(), .2); creak(now() + .1, 2.2, 70, 45, .12); }]);
  for (const S of SHELVES) if (S.tHit) for (const j of S.jars) E.push([j.tb, () => { nz(now(), .08, { type: 'highpass', f: 3500, vol: .12 }); tinkle(now(), 3, .25, .04); }]);
  /* bloque 3 */
  E.push([60.2, () => { zap(now(), 110, 440, 1.15, .08); nz(now(), 1.15, { type: 'bandpass', f: 400, f2: 2400, q: 4, vol: .12, atk: 1 }); for (let i = 0; i < 26; i++) nz(now() + Math.pow(Math.random(), .6) * 1.15, .03, { type: 'highpass', f: 3000 + Math.random() * 3000, vol: .05 + Math.random() * .08 }); }]);
  E.push([61.38, () => { nz(now(), .25, { type: 'highpass', f: 1800, vol: .45, rev: .6 }); zap(now(), 900, 120, .4, .16); whoosh(now() + .02, 1.4, .55, 1800, 120); thump(now(), .45); }]);
  E.push([TBOLT, () => { zap(now(), 1800, 300, .3, .22); nz(now(), .2, { type: 'highpass', f: 2000, vol: .4 }); }]);
  E.push([70.75, () => { shatter(now(), .85, 90, 2.6); boom(now() + .05, .35); }]);
  E.push([72.3, () => tinkle(now(), 30, 2.6, .035)]);
  E.push([TFREEZE - .6, () => nz(now(), .7, { type: 'bandpass', f: 200, f2: 4000, q: 2, vol: .2, atk: .6 })]);
  E.push([TFREEZE, () => { tone(1760, now(), 3, .025, 'sine', .9); tone(2637, now(), 3, .015, 'sine', .9); }]);
  E.push([TTHROW, () => whoosh(now(), .9, .45, 200, 3000)]);
  E.push([78.6, () => { for (let i = 0; i < 26; i++) bell(1200 + Math.random() * 1600, now() + Math.random() * 1.2, .5, .025); }]);
  E.push([79.4, () => { for (const [n, d] of [[69, 0], [73, .06], [76, .12], [81, .18]]) bell(NT(n), now() + d, 3.5, .06); }]);
  /* bloque 4 */
  E.push([TCRK, () => { boom(now(), .5); crackle(now() + .1, 2.2, 45, .1); nz(now(), 2.3, { brown: true, type: 'lowpass', f: 160, vol: .35, atk: .3 }); }]);
  for (const R of GROOTS) { E.push([R.tb, () => { grind(now(), 1.4, .4); creak(now() + .2, 1.6, 60 + Math.random() * 30, 40, .12); nz(now(), 1.6, { brown: true, type: 'lowpass', f: 120, vol: .4, atk: .2 }); }]); E.push([R.cut.t + .58, () => thump(now(), .6)]); }
  for (const ts of SLASHES) E.push([ts, () => { whoosh(now(), .22, .45, 900, 7000); tone(3200, now() + .05, .4, .03, 'sine', .7, 2400); }]);
  E.push([110.2, () => { clang(now(), .45); screech(now() + .05, 1.6, .14); boom(now(), .4); }]);
  E.push([110.25, () => { for (let i = 0; i < 12; i++) nz(now() + Math.random() * .4, .03, { type: 'highpass', f: 2500, vol: .25 }); }]);
  E.push([111.2, () => { creak(now(), 1.6, 55, 35, .16); }]);
  E.push([113.4, () => { shatter(now(), 1, 120, 3); boom(now(), .5); }]);
  /* bloque 5 */
  E.push([TBEAM, () => { whoosh(now(), .3, .5, 300, 5000); boom(now() + .2, .45); }]);
  for (const tp of PULSES) E.push([tp, () => { tone(70, now(), 1, .5, 'sine', .3, 38); nz(now(), .8, { type: 'bandpass', f: 300, f2: 2000, vol: .18, rev: .5 }); if (tp > 140) shatter(now() + .1, .5, 25, 1); }]);
  E.push([131, () => { crackle(now(), 2.5, 40, .1); grind(now(), 2.4, .25); }]);
  /* bloque 6: la succión, el silencio */
  E.push([150, () => { nz(now(), 3.25, { type: 'bandpass', f: 120, f2: 5200, q: 2.5, vol: .35, atk: 3.1 }); tone(60, now(), 3.25, .3, 'sawtooth', .2, 900, 3.1); }]);
  E.push([155.6, () => { for (let k = 0; k < 18; k++) { const tt = now() + k * .62; breath(tt, 950, .045 * Math.exp(-k * .08)); breath(tt + .31, 1250, .04 * Math.exp(-k * .08)); } }]);
  E.push([TSHARD, () => tone(3100, now(), .12, .04, 'sine', .8)]);
  E.push([TSPLASH, () => { tone(520, now(), .25, .14, 'sine', .7, 180); nz(now(), .35, { type: 'bandpass', f: 1400, vol: .12, rev: .9 }); tone(1046, now() + .05, 2.5, .03, 'sine', .9); }]);
  E.push([176.6, () => { for (const [n, d] of [[57, 0], [64, .4], [69, .8], [71, 1.2], [72, 1.9]]) bell(NT(n), now() + d, 4, .045); }]);
  AU.EV = E.sort((a, b) => a[0] - b[0]);
}
const CHORDS = [[0, [50, 57, 62, 65]], [19, [50, 57, 60, 65]], [30, [46, 53, 58, 62]], [37, [49, 52, 55, 58]], [45, [46, 53, 56, 61]], [60, [47, 54, 57, 62]], [70, [45, 52, 57, 60]], [79.4, [45, 52, 57, 61]], [90, [43, 50, 55, 58]], [110, [44, 51, 56, 59]], [122, [45, 52, 55, 58]], [140, [46, 52, 55, 61]], [157, [50, 57, 64, 69]], [167, [46, 53, 57, 62]], [174, [45, 52, 57, 64]]];
function auUpdate(t, playing) {
  if (!AU.ac) return;
  const ac = AU.ac, n = ac.currentTime;
  const silent = t > TCOLL && t < 155.4;   // la onda es silenciosa
  AU.master.gain.setTargetAtTime(playing ? (silent ? 0 : .9 * Math.min(1, t / 1.2) * (1 - sm((t - 178.5) / 1.5))) : 0, n, silent ? .015 : .12);
  const duck = t > 150 && t < TCOLL ? 1 - sm((t - 150) / 2.5) : 1;
  const inside = t > 70.75 && t < 153.2 ? 1.6 : 1, calm = 1 - sm((t - 156) / 10) * .8, back = t > TCOLL ? sm((t - 155.4) / 4) : 1;
  AU.rain.g.gain.setTargetAtTime(.16 * inside * calm * duck * back, n, .4);
  AU.rainLo.g.gain.setTargetAtTime(.22 * inside * calm * duck * back, n, .4);
  AU.rain.fl.frequency.setTargetAtTime(2400 + 600 * Math.sin(t * .7), n, .5);
  const w = Math.abs(windAt(t)); AU.wind.g.gain.setTargetAtTime((.05 + w * .32) * duck * (t > TCOLL ? .4 : 1), n, .3); AU.wind.fl.frequency.setTargetAtTime(300 + w * 380 + 120 * Math.sin(t * 1.3), n, .3);
  AU.fire.g.gain.setTargetAtTime(t > 37.2 && t < 44 ? .35 * (1 - sm((t - 40) / 4)) : 0, n, .2);
  AU.drone.gain.setTargetAtTime((t > 30 && t < 150 ? .07 + (t > 110 ? .04 : 0) : t < 30 ? .04 : 0) * duck, n, .8);
  const clashOn = t > TBEAM && t < TCOLL ? 1 : 0, suck = t > 150 ? sm((t - 150) / 3.2) : 0;
  AU.clash.gain.setTargetAtTime(clashOn * (.22 + suck * .25), n, clashOn ? .05 : .01);
  AU.clashO[0].frequency.setTargetAtTime(98 * (1 + suck * 3) + Math.sin(t * 3) * 2, n, .1); AU.clashO[1].frequency.setTargetAtTime(104 * (1 + suck * 3.1), n, .1); AU.clashO[2].frequency.setTargetAtTime(196.5 * (1 + suck * 3), n, .1);
  AU.clashF.frequency.setTargetAtTime(700 + 600 * clashLight(t) + suck * 3000, n, .05);
  AU.ring.gain.setTargetAtTime(t > TCOLL + .2 && t < 158 ? .012 * (1 - sm((t - 154) / 4)) : 0, n, .3);
  AU.pad.gain.setTargetAtTime((t > 150 && t < 157 ? 0 : t > 157 ? .6 : .45) * (1 - sm((t - 176) / 3)), n, .8);
  let ch = CHORDS[0][1]; for (const [t0, c] of CHORDS) if (t >= t0) ch = c;
  AU.voices.forEach(([o1, o2], i) => { o1.frequency.setTargetAtTime(NT(ch[i]), n, .4); o2.frequency.setTargetAtTime(NT(ch[i]), n, .4); });
  if (playing && AU.EV) for (const [te, fn] of AU.EV) if (AU.last < te && t >= te && t - te < .5) { try { fn(); } catch (e) { console.warn('audio', te, e); } }
  AU.last = t;
}
/* prueba: dispara todos los eventos y devuelve los errores */
window.__audioTest = () => { if (!AU.ac) auInit(); const errs = []; for (const [te, fn] of AU.EV) { try { fn(); } catch (e) { errs.push([te, String(e)]); } } for (const t of [0, 40, 75, 112, 130, 151, 154, 160, 175]) { try { AU.last = t - .1; auUpdate(t, true); } catch (e) { errs.push(['upd' + t, String(e)]); } } return { n: AU.EV.length, errs }; };
