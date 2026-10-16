/* =====================================================================
   SONIDO PROCEDURAL (Web Audio): shakuhachi, koto, taiko, viento, lluvia,
   fuego, espadas. Nada pregrabado.
   ===================================================================== */
const AU = { ac: null, ok: false, muted: false };
const NOTE = { G3: 196, A3: 220, Bb3: 233.08, D4: 293.66, Eb4: 311.13, G4: 392, A4: 440, Bb4: 466.16, D5: 587.33, Eb5: 622.25, G5: 783.99, A5: 880, D3: 146.83, G2: 98, A2: 110, D2: 73.42 };
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
  AU.fire = bed(nb, 'lowpass', 320, .8, .2);
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

/* niveles continuos en función del tiempo de la película */
function auBeds(T, dt) {
  if (!AU.ok) return;
  const t = AU.ac.currentTime, set = (p, v, k = .5) => p.setTargetAtTime(AU.muted ? 0 : v, t, k);
  const silence = rg(T, 267.9, 268.1) * (1 - rg(T, 270.2, 274));
  const wind = (fade(T, 0, 120, 6, 4) * .18 + fade(T, 103, 124, 4, 6) * .35 + fade(T, 118, 146, 2, 4) * .15 + fade(T, 240, 300, 3, 8) * .28 + fade(T, 316, 386, 4, 10) * .14) * (1 - silence * .95);
  set(AU.wind.g.gain, wind); set(AU.wind.f.frequency, 380 + (N2(T * .25, 1) * .5 + .5) * 700 + wind * 300, .8);
  set(AU.wind2.g.gain, wind * .25 * (N2(T * .4, 5) * .5 + .5));
  const rain = fade(T, 172, 248, 3, 4) * .22 + fade(T, 290, 320, 3, 5) * .12;
  set(AU.rain.g.gain, rain * .4); set(AU.rain2.g.gain, rain * .9);
  const fire = fade(T, 140, 176, 2, 5); set(AU.fire.g.gain, fire * .6);
  if (fire > .05 && Math.random() < fire * dt * 22) crackle();
  const drone = (fade(T, 9, 64, 5, 8) * .05 + fade(T, 104, 176, 6, 5) * .1 + fade(T, 206, 268, 5, .2) * .12 + fade(T, 272, 322, 3, 8) * .07 + fade(T, 346, 386, 4, 12) * .05);
  set(AU.drone.gain, drone, .8);
  set(AU.tens.gain, (fade(T, 116, 146, 4, 4) * .7 + fade(T, 252, 268, 6, .2) * 1) * (1 - silence));
}

/* partitura de eventos (tiempo de película → función) */
const EV = [];
const ev = (t, f) => EV.push({ t, f });
function score() {
  // Prólogo
  ev(2.6, () => { drop(0, .3); boom(.02, .35, 3); });
  ev(7.0, () => whoosh(0, 3.0, .12, 200, 900));
  ev(10.4, () => swell(0, 4, .08));
  ev(13.5, () => phrase(0, [['A4', 2.2], ['Bb4', .8], ['A4', 1.4], ['G4', 2.4], ['D4', 3.6]]));
  // Valle
  ev(26, () => arp(0, ['D4', 'G4', 'A4', 'D5', 'A4'], .32, .22));
  ev(31, () => koto(0, 'D3', .4));
  ev(35, () => phrase(0, [['D5', 1.8], ['Eb5', .6], ['D5', 1.2], ['Bb4', 1], ['A4', 2.8]], .13));
  ev(40, () => chirp(0)); ev(44, () => chirp(0, .02)); ev(47.5, () => chirp(0));
  ev(49, () => arp(0, ['G3', 'D4', 'G4', 'A4', 'Bb4', 'A4'], .4, .2));
  ev(54, () => phrase(0, [['G4', 1.6], ['A4', .7], ['D5', 2.2], ['A4', 1], ['G4', 2.8]], .12));
  // Cerezo
  for (let i = 0; i < 6; i++) ev(64 + i * 5, () => arp(0, [pick(['D4', 'G4']), 'A4', pick(['D5', 'Bb4']), 'A4'], .26, .2));
  ev(72, () => koto(0, 'D3', .4));
  ev(80, () => phrase(0, [['D4', 1], ['G4', 1], ['A4', 1.2], ['D5', 2.2], ['Eb5', .6], ['D5', 1], ['A4', 1], ['Bb4', 1.5], ['A4', 3.2]], .13));
  ev(96, () => phrase(0, [['A4', 1.6], ['G4', .8], ['D4', 3]], .12));
  // Presagio
  ev(104, () => swell(0, 6, .12)); ev(110, () => crow(0)); ev(111.2, () => crow(0, .05)); ev(113.4, () => crow(0, .06));
  for (const t of [115, 117.5, 119.6, 121.2, 122.4]) ev(t, () => taiko(0, .45, .9));
  // Ejército
  ev(121.5, () => conch(0, 4)); ev(131, () => thunder(0, .55));
  for (let i = 0; i < 40; i++) { const t = 124 + i * .6; ev(t, () => { taiko(0, i % 4 === 0 ? .8 : .45, i % 4 === 0 ? .85 : 1.1); if (i % 2) ka(.3, .12); }); }
  ev(134.5, () => conch(0, 3.5, .15));
  // Fuego
  ev(142, () => boom(0, .5, 3)); ev(150, () => phrase(0, [['G4', 2], ['A4', .7], ['Bb4', 1.6], ['A4', .8], ['G4', 1.2], ['Eb4', 1.2], ['D4', 4]], .14));
  ev(165, () => shing(0, .05));
  // Bambú / camino
  ev(176, () => arp(0, ['D3', 'A3', 'D4'], .5, .25));
  ev(186, () => phrase(0, [['D5', 2.4], ['Bb4', 1], ['A4', 1.4], ['G4', 3]], .1));
  // Emboscada
  for (let i = 0; i < 18; i++) ev(210 + i * .75, () => taiko(0, .35 + i * .02, 1.15));
  ev(214, () => swell(0, 2, .15)); ev(216.05, () => whoosh(0, .35, .35, 200, 1200)); ev(216.42, () => { whoosh(0, .16, .7); shing(.05, .1); boom(.06, .45, 1); });
  ev(221, () => swell(0, 2, .15)); ev(223.05, () => whoosh(0, .35, .4, 200, 1200));
  ev(223.38, () => { whoosh(0, .14, .7); shing(.03, .1); }); ev(223.66, () => { whoosh(0, .14, .7); boom(.05, .55, 1.4); });
  for (let i = 0; i < 8; i++) ev(224 + i * .5, () => taiko(0, .6 - i * .06, .9));
  ev(225.2, () => { whoosh(0, .9, .2, 1200, 300); }); ev(227.4, () => { boom(0, .3, .8); clank(0, .03); });
  ev(229, () => shing(0, .05));
  ev(232, () => phrase(0, [['A4', 1.6], ['Bb4', .6], ['A4', 1.2], ['D4', 3]], .1));
  // Duelo
  ev(243, () => phrase(0, [['Eb5', 2.6], ['D5', 1.2], ['Bb4', 1.4], ['A4', 3.5]], .1));
  ev(256, () => koto(0, 'D3', .5)); ev(259.5, () => koto(0, 'Eb4', .3));
  for (let i = 0; i < 14; i++) { const t = 255 + i * (1.05 - i * .045); ev(t, () => heart(0, .55 + i * .03)); }
  ev(264.5, () => swell(0, 3.5, .2)); ev(268, () => step(0, .15)); ev(268.4, () => step(0, .15)); ev(268.7, () => step(0, .18));
  ev(269.0, () => swell(0, .3, .3)); ev(269.3, () => { shing(0, .16); boom(0, 1, 3.5); whoosh(0, .2, .8, 500, 6000); });
  ev(278, () => clank(0, .08)); ev(279.2, () => step(0, .25)); ev(282.6, () => boom(0, .35, 1.2));
  ev(285, () => phrase(0, [['G4', 2.4], ['A4', .8], ['Bb4', 1.8], ['A4', 1], ['G4', 1.6], ['D4', 4.5]], .14));
  // Lluvia / desenlace
  ev(298, () => koto(0, 'G3', .35)); ev(301, () => koto(0, 'D4', .3)); ev(304, () => koto(0, 'A3', .3));
  ev(305, () => phrase(0, [['D5', 2.4], ['Eb5', .7], ['D5', 1.4], ['Bb4', 1.2], ['A4', 1.2], ['G4', 3.8]], .12));
  // Retorno
  ev(318, () => arp(0, ['D4', 'G4', 'A4', 'D5'], .35, .22));
  for (let i = 0; i < 4; i++) ev(320 + i * .58, () => step(0, .04)); for (let i = 0; i < 10; i++) ev(322 + i * .58, () => step(0, .045));
  ev(329, () => { boom(0, .25, .6); clank(.05, .04); });
  ev(332, () => phrase(0, [['D4', 1], ['G4', 1], ['A4', 1.2], ['D5', 2.4], ['Eb5', .6], ['D5', 1], ['A4', 1], ['Bb4', 1.5], ['A4', 2], ['D5', 4]], .14));
  for (let i = 0; i < 8; i++) ev(333 + i * 1.6, () => arp(0, [pick(['D4', 'G4']), 'A4', pick(['D5', 'Bb4'])], .22, .18));
  ev(339, () => chirp(0)); ev(343, () => chirp(.3, .02));
  // Título
  ev(352, () => { arp(0, ['D3', 'A3', 'D4', 'G4', 'A4', 'D5'], .12, .3); boom(0, .3, 4); });
  ev(358.6, () => stamp(0));
  ev(360, () => phrase(0, [['A4', 2], ['D5', 3], ['A4', 1.2], ['G4', 1.2], ['D4', 5]], .11));
}
