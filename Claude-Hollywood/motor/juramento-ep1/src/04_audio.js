/* =====================================================================
   SONIDO PROCEDURAL (Web Audio): shakuhachi, koto, taiko, viento, lluvia,
   fuego, espadas. Nada pregrabado.
   ===================================================================== */
const AU = { ac: null, ok: false, muted: false };
const NOTE = { D2: 73.42, F2: 87.31, G2: 98, A2: 110, Bb2: 116.54, C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196, A3: 220, Bb3: 233.08, C4: 261.63, Cs4: 277.18, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392, A4: 440, Bb4: 466.16, C5: 523.25, Cs5: 554.37, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880, Bb5: 932.33, D6: 1174.66, Eb4: 311.13, Eb5: 622.25 };
function auInit() {
  if (AU.ac) return;
  const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
  const ac = new AC(); AU.ac = ac;
  const comp = ac.createDynamicsCompressor(); comp.threshold.value = -16; comp.knee.value = 12; comp.ratio.value = 3.5; comp.attack.value = .005; comp.release.value = .35;
  const master = ac.createGain(); master.gain.value = .85; master.connect(comp); comp.connect(ac.destination); AU.master = master;
  // reverberación (respuesta impulsional generada)
  const len = ac.sampleRate * 4.2, ib = ac.createBuffer(2, len, ac.sampleRate);
  for (let c = 0; c < 2; c++) { const d = ib.getChannelData(c); for (let i = 0; i < len; i++) { const t = i / len; d[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2.6) * (i < 400 ? i / 400 : 1); } }
  const conv = ac.createConvolver(); conv.buffer = ib; const rv = ac.createGain(); rv.gain.value = .55; conv.connect(rv); rv.connect(master); AU.rev = conv;
  AU.dry = ac.createGain(); AU.dry.connect(master);
  // ruido
  const nb = ac.createBuffer(1, ac.sampleRate * 3, ac.sampleRate), nd = nb.getChannelData(0); let b0 = 0, b1 = 0, b2 = 0;
  for (let i = 0; i < nd.length; i++) { const w = Math.random() * 2 - 1; b0 = .99765 * b0 + w * .099; b1 = .963 * b1 + w * .2965; b2 = .57 * b2 + w * 1.0526; nd[i] = (b0 + b1 + b2 + w * .1848) * .2; }
  AU.noise = nb;
  const wb = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate), wd = wb.getChannelData(0); for (let i = 0; i < wd.length; i++) wd[i] = Math.random() * 2 - 1; AU.white = wb;
  // lechos continuos
  const bed = (buf, type, f, q, wet) => { const s = ac.createBufferSource(); s.buffer = buf; s.loop = true; const fl = ac.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q; const g = ac.createGain(); g.gain.value = 0; s.connect(fl); fl.connect(g); send(g, wet); s.start(); return { g, f: fl }; };
  AU.wind = bed(nb, 'bandpass', 500, .9, .3); AU.wind2 = bed(nb, 'bandpass', 1400, 2.5, .3);
  AU.rain = bed(wb, 'highpass', 1800, .4, .2); AU.rain2 = bed(nb, 'lowpass', 900, .5, .1);
  AU.fire = bed(nb, 'lowpass', 320, .8, .2); AU.crowd = bed(nb, 'bandpass', 520, 1.4, .35);
  // drone
  AU.drone = ac.createGain(); AU.drone.gain.value = 0; const dl = ac.createBiquadFilter(); dl.type = 'lowpass'; dl.frequency.value = 520; AU.drone.connect(dl); send(dl, .5);
  for (const [f, v, ty] of [[NOTE.D2, .5, 'sine'], [NOTE.A2, .28, 'sine'], [NOTE.D3, .12, 'triangle'], [NOTE.D2 * 1.003, .3, 'sawtooth']]) { const o = ac.createOscillator(); o.type = ty; o.frequency.value = f; const g = ac.createGain(); g.gain.value = ty === 'sawtooth' ? v * .08 : v; o.connect(g); g.connect(AU.drone); o.start(); }
  AU.tens = ac.createGain(); AU.tens.gain.value = 0; AU.tens.connect(dl);
  for (const f of [77.78, 155.56, 51.9]) { const o = ac.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; const g = ac.createGain(); g.gain.value = .05; o.connect(g); g.connect(AU.tens); o.start(); }
  // koto: Karplus-Strong precalculado
  AU.koto = {};
  for (const [k, f] of Object.entries(NOTE)) {
    const sr = ac.sampleRate, n = Math.round(sr / f), dur = 3.2, buf = ac.createBuffer(1, sr * dur, sr), d = buf.getChannelData(0), ring = new Float32Array(n);
    for (let i = 0; i < n; i++) ring[i] = (Math.random() * 2 - 1) * (1 - i / n * .5);
    let p = 0, prev = 0;
    for (let i = 0; i < d.length; i++) { const v = ring[p]; const nx = ring[(p + 1) % n]; const av = (v + nx) * .5 * .9965; ring[p] = av * .7 + prev * .3; prev = av; d[i] = v * (i < 30 ? i / 30 : 1); p = (p + 1) % n; }
    AU.koto[k] = buf;
  }
  AU.ok = true;
}
function send(node, wet = .35) { node.connect(AU.dry); if (wet > 0) { const s = AU.ac.createGain(); s.gain.value = wet; node.connect(s); s.connect(AU.rev); } }
const now = (d = 0) => AU.ac.currentTime + .02 + d;
function envG(g, t, a, peak, hold, rel) { g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.setValueAtTime(peak, t + a + hold); g.gain.exponentialRampToValueAtTime(.0001, t + a + hold + rel); }
function nsrc(t, dur, white) { const s = AU.ac.createBufferSource(); s.buffer = white ? AU.white : AU.noise; s.loop = true; s.start(t, Math.random() * 1.5); s.stop(t + dur + .1); return s; }

/* shakuhachi: seno + armónico + soplo, con meri (ataque desde abajo) y vibrato */
function shaku(d, f, dur, v = .16) {
  if (!AU.ok) return; const ac = AU.ac, t = now(d);
  const o = ac.createOscillator(), o2 = ac.createOscillator(); o.type = 'sine'; o2.type = 'triangle';
  o.frequency.setValueAtTime(f * .94, t); o.frequency.exponentialRampToValueAtTime(f, t + .28);
  o2.frequency.setValueAtTime(f * 2 * .94, t); o2.frequency.exponentialRampToValueAtTime(f * 2, t + .28);
  const lfo = ac.createOscillator(); lfo.frequency.value = 4.6 + Math.random() * .8; const lg = ac.createGain(); lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(f * .011, t + Math.max(.4, dur * .6)); lfo.connect(lg); lg.connect(o.frequency);
  const g = ac.createGain(), g2 = ac.createGain(); g2.gain.value = .09; o2.connect(g2); g2.connect(g); o.connect(g);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .22); g.gain.linearRampToValueAtTime(v * .82, t + dur * .7); g.gain.linearRampToValueAtTime(0, t + dur + .35);
  const n = nsrc(t, dur + .5), bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f * 2.1; bp.Q.value = 2.2; const ng = ac.createGain();
  ng.gain.setValueAtTime(0, t); ng.gain.linearRampToValueAtTime(v * .9, t + .05); ng.gain.linearRampToValueAtTime(v * .16, t + .35); ng.gain.linearRampToValueAtTime(0, t + dur + .3);
  n.connect(bp); bp.connect(ng);
  const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2600; g.connect(lp); ng.connect(lp); send(lp, .7);
  for (const x of [o, o2, lfo]) { x.start(t); x.stop(t + dur + .6); }
}
function phrase(d, notes, v = .15) { let tt = 0; for (const [n, du, gap = 0] of notes) { tt += gap; shaku(d + tt, NOTE[n], du * 1.05, v); tt += du; } }
function koto(d, n, v = .35, rate = 1) {
  if (!AU.ok) return; const ac = AU.ac, t = now(d), s = ac.createBufferSource(); s.buffer = AU.koto[n]; s.playbackRate.value = rate;
  const g = ac.createGain(); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + 3); const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3200;
  s.connect(lp); lp.connect(g); send(g, .45); s.start(t); s.stop(t + 3.1);
}
function arp(d, notes, step = .18, v = .3) { notes.forEach((n, i) => koto(d + i * step, n, v * (1 - i * .04))); }
function taiko(d, v = .7, f = 1) {
  if (!AU.ok) return; const ac = AU.ac, t = now(d), o = ac.createOscillator(); o.type = 'sine';
  o.frequency.setValueAtTime(130 * f, t); o.frequency.exponentialRampToValueAtTime(46 * f, t + .32);
  const g = ac.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + .006); g.gain.exponentialRampToValueAtTime(.0001, t + 1.1); o.connect(g); send(g, .35); o.start(t); o.stop(t + 1.2);
  const n = nsrc(t, .3), lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 700; const ng = ac.createGain(); ng.gain.setValueAtTime(v * .7, t); ng.gain.exponentialRampToValueAtTime(.0001, t + .16); n.connect(lp); lp.connect(ng); send(ng, .3);
}
function ka(d, v = .2) { if (!AU.ok) return; const ac = AU.ac, t = now(d), n = nsrc(t, .1, 1), hp = ac.createBiquadFilter(); hp.type = 'bandpass'; hp.frequency.value = 2400; hp.Q.value = 3; const g = ac.createGain(); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t + .06); n.connect(hp); hp.connect(g); send(g, .3); }
function heart(d, v = .9) { for (const [o, k] of [[0, 1], [.26, .65]]) { if (!AU.ok) return; const ac = AU.ac, t = now(d + o), s = ac.createOscillator(); s.frequency.setValueAtTime(70, t); s.frequency.exponentialRampToValueAtTime(38, t + .14); const g = ac.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v * k, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + .28); s.connect(g); send(g, .1); s.start(t); s.stop(t + .3); } }
function shing(d, v = .12) {
  if (!AU.ok) return; const ac = AU.ac, t = now(d);
  for (const f of [2380, 3517, 4790, 6230, 1310]) { const o = ac.createOscillator(); o.type = 'sine'; o.frequency.value = f * (1 + (Math.random() - .5) * .01); const g = ac.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v * (f === 1310 ? .6 : 1), t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + 1.8 + Math.random()); o.connect(g); send(g, .6); o.start(t); o.stop(t + 3); }
  const n = nsrc(t, .4, 1), hp = ac.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.setValueAtTime(3000, t); hp.frequency.exponentialRampToValueAtTime(9000, t + .25); const g = ac.createGain(); envG(g, t, .02, v * 2, .05, .25); n.connect(hp); hp.connect(g); send(g, .4);
}
function whoosh(d, dur = .25, v = .5, f0 = 300, f1 = 3200) {
  if (!AU.ok) return; const ac = AU.ac, t = now(d), n = nsrc(t, dur + .2, 1), bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.3;
  bp.frequency.setValueAtTime(f0, t); bp.frequency.exponentialRampToValueAtTime(f1, t + dur); const g = ac.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + dur * .7); g.gain.exponentialRampToValueAtTime(.0001, t + dur + .12);
  n.connect(bp); bp.connect(g); send(g, .35);
}
function boom(d, v = .9, dur = 2.2) {
  if (!AU.ok) return; const ac = AU.ac, t = now(d), o = ac.createOscillator(); o.frequency.setValueAtTime(72, t); o.frequency.exponentialRampToValueAtTime(26, t + dur * .7);
  const g = ac.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + dur); o.connect(g); send(g, .5); o.start(t); o.stop(t + dur);
  const n = nsrc(t, dur), lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(900, t); lp.frequency.exponentialRampToValueAtTime(80, t + dur * .6); const ng = ac.createGain(); ng.gain.setValueAtTime(v * .8, t); ng.gain.exponentialRampToValueAtTime(.0001, t + dur * .8); n.connect(lp); lp.connect(ng); send(ng, .5);
}
function swell(d, dur = 3, v = .35) {
  if (!AU.ok) return; const ac = AU.ac, t = now(d), n = nsrc(t, dur + .1), lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 3; lp.frequency.setValueAtTime(150, t); lp.frequency.exponentialRampToValueAtTime(7000, t + dur);
  const g = ac.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + dur); g.gain.setValueAtTime(.0001, t + dur + .02); n.connect(lp); lp.connect(g); send(g, .5);
}
function thunder(d, v = .6) {
  if (!AU.ok) return; const ac = AU.ac, t = now(d), n = nsrc(t, 5), lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 380; const g = ac.createGain(); g.gain.setValueAtTime(.0001, t);
  let tt = t; for (let i = 0; i < 9; i++) { tt += .05 + Math.random() * .35; g.gain.exponentialRampToValueAtTime(v * (1 - i / 10) * (.5 + Math.random() * .5), tt); } g.gain.exponentialRampToValueAtTime(.0001, tt + 2.5);
  n.connect(lp); lp.connect(g); send(g, .6);
}
function crow(d, v = .07) {
  if (!AU.ok) return; for (let i = 0; i < 2; i++) { const ac = AU.ac, t = now(d + i * .32), o = ac.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime(540, t); o.frequency.exponentialRampToValueAtTime(400, t + .22); const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1300; bp.Q.value = 3.5; const g = ac.createGain(); envG(g, t, .02, v, .1, .12); o.connect(bp); bp.connect(g); send(g, .5); o.start(t); o.stop(t + .4); }
}
function chirp(d, v = .03) { if (!AU.ok) return; for (let i = 0; i < 3; i++) { const ac = AU.ac, t = now(d + i * .11), o = ac.createOscillator(); o.frequency.setValueAtTime(3200, t); o.frequency.exponentialRampToValueAtTime(4300, t + .06); const g = ac.createGain(); envG(g, t, .01, v, .02, .05); o.connect(g); send(g, .5); o.start(t); o.stop(t + .12); } }
function drop(d, v = .25) { if (!AU.ok) return; const ac = AU.ac, t = now(d), o = ac.createOscillator(); o.frequency.setValueAtTime(480, t); o.frequency.exponentialRampToValueAtTime(1500, t + .06); const g = ac.createGain(); envG(g, t, .004, v, .01, .25); o.connect(g); send(g, .8); o.start(t); o.stop(t + .4); }
function conch(d, dur = 3.5, v = .18) {
  if (!AU.ok) return; const ac = AU.ac, t = now(d), lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 760; lp.Q.value = 4; const g = ac.createGain(); envG(g, t, .6, v, dur, 1.2);
  for (const [f, k] of [[98, 1], [196, .4], [147, .25]]) { const o = ac.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime(f * .96, t); o.frequency.linearRampToValueAtTime(f, t + .6); o.frequency.linearRampToValueAtTime(f * 1.02, t + dur); const gg = ac.createGain(); gg.gain.value = k * .3; o.connect(gg); gg.connect(lp); o.start(t); o.stop(t + dur + 2); }
  lp.connect(g); send(g, .7);
}
function step(d, v = .08) { if (!AU.ok) return; const ac = AU.ac, t = now(d), n = nsrc(t, .12), lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 600; const g = ac.createGain(); envG(g, t, .005, v, .02, .08); n.connect(lp); lp.connect(g); send(g, .15); }
function clank(d, v = .1) { if (!AU.ok) return; const ac = AU.ac, t = now(d); for (const f of [880, 1460, 2290]) { const o = ac.createOscillator(); o.type = 'triangle'; o.frequency.value = f; const g = ac.createGain(); envG(g, t, .002, v, .01, .5); o.connect(g); send(g, .4); o.start(t); o.stop(t + .7); } }
function crackle() { if (!AU.ok) return; const ac = AU.ac, t = now(), n = nsrc(t, .05, 1), bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1500 + Math.random() * 3000; bp.Q.value = 2; const g = ac.createGain(); envG(g, t, .002, .04 + Math.random() * .08, .005, .03); n.connect(bp); bp.connect(g); send(g, .2); }
function stamp(d) { boom(d, .5, .6); ka(d, .25); }

