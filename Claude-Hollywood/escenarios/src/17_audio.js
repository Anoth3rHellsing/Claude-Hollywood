/* =====================================================================
   ESCENARIOS · SONIDO 100 % SINTETIZADO (WebAudio): núcleo, voces de 8 bits, foley y programación
   La película entrega su lista de eventos (FILM.events() → [[t, fn(at)]]) y sus lechos (FILM.beds(t, now)).
   Se programa con anticipación; al saltar se reconstruyen los buses (lo pendiente se corta).
   ===================================================================== */
const AU = { ac: null, sched: -1, vol: 2.0 };
const NT = n => 440 * Math.pow(2, (n - 69) / 12);
function auInit(given) {
  const ac = given || new (window.AudioContext || window.webkitAudioContext)(); AU.ac = ac;
  const comp = ac.createDynamicsCompressor(); comp.threshold.value = -20; comp.ratio.value = 8; comp.knee.value = 6; comp.attack.value = .004; comp.release.value = .2; comp.connect(ac.destination);
  AU.master = ac.createGain(); AU.master.gain.value = 0; AU.master.connect(comp);
  const rev = ac.createConvolver(), len = ac.sampleRate * 2.2, ir = ac.createBuffer(2, len, ac.sampleRate);
  for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2) * (i < 300 ? i / 300 : 1); }
  rev.buffer = ir; AU.rev = ac.createGain(); AU.rev.gain.value = .3; AU.rev.connect(rev); rev.connect(AU.master);
  /* buses fijos: música, efectos, voz, ambiente (cada uno con su envío a la reverb) */
  const bus = (v, rv) => { const g = ac.createGain(); g.gain.value = v; g.connect(AU.master); if (rv) { const s = ac.createGain(); s.gain.value = rv; g.connect(s); s.connect(AU.rev); } return g; };
  AU.mus = bus(.8, .25); AU.sfx = bus(1, .18); AU.voz = bus(1, .12); AU.amb = bus(1, .3);
  const mkNoise = (sec, brown) => { const b = ac.createBuffer(1, ac.sampleRate * sec, ac.sampleRate), d = b.getChannelData(0); let l = 0; for (let i = 0; i < d.length; i++) { const w = Math.random() * 2 - 1; if (brown) { l = (l + .02 * w) / 1.02; d[i] = l * 3.5; } else d[i] = w; } return b; };
  AU.white = mkNoise(3, false); AU.brown = mkNoise(3, true);
  AU.pulse = {}; for (const [k, duty] of [['pulse', .25], ['pulse12', .125]]) { const n = 32, re = new Float32Array(n), im = new Float32Array(n); for (let i = 1; i < n; i++) { re[i] = 0; im[i] = 2 / (i * PI) * Math.sin(i * PI * duty); } AU.pulse[k] = ac.createPeriodicWave(re, im); }
  AU.bedL = {};
  if (typeof FILM !== 'undefined' && FILM.audioInit) FILM.audioInit(ac);
  AU.EV = (typeof FILM !== 'undefined' && FILM.events ? FILM.events() : []).sort((a, b) => a[0] - b[0]);
  newBuses();
}
function newBuses() {
  const ac = AU.ac;
  for (const b of AU.buses || []) { try { b.gain.cancelScheduledValues(0); b.gain.value = 0; b.disconnect(); } catch (e) { } }
  const mkb = dest => { const g = ac.createGain(); g.connect(dest); return g; };
  AU.bM = mkb(AU.mus); AU.bS = mkb(AU.sfx); AU.bV = mkb(AU.voz); AU.bA = mkb(AU.amb);
  AU.buses = [AU.bM, AU.bS, AU.bV, AU.bA];
}
/* lecho continuo (ruido filtrado en bucle) controlado por volumen */
function auBed(name, buf, type, f, q, dest) {
  const ac = AU.ac, s = ac.createBufferSource(); s.buffer = buf; s.loop = true; const fl = ac.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q; const g = ac.createGain(); g.gain.value = 0; s.connect(fl); fl.connect(g); g.connect(dest || AU.amb); s.start(0, Math.random() * 2);
  return AU.bedL[name] = { g, fl, s };
}
const bedSet = (name, v, n, tc = .4) => { const B = AU.bedL[name]; if (B) B.g.gain.setTargetAtTime(v, n, tc); };
/* ---------- primitivas ---------- */
function env(g, at, v, atk, dur, rel = .08) { g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(v, at + atk); g.gain.setTargetAtTime(0, at + dur, rel); }
function oscW(o, type) { if (AU.pulse[type]) o.setPeriodicWave(AU.pulse[type]); else o.type = type; }
function tone(f, at, dur, vol, type = 'sine', f2, dest = AU.bS, atk = .005) { const ac = AU.ac, o = ac.createOscillator(), g = ac.createGain(); oscW(o, type); o.frequency.setValueAtTime(f, at); if (f2) o.frequency.exponentialRampToValueAtTime(f2, at + dur); g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(vol, at + atk); g.gain.exponentialRampToValueAtTime(.0004, at + dur); o.connect(g); g.connect(dest); o.start(at); o.stop(at + dur + .05); return o; }
function noiseHit(at, dur, o) { const ac = AU.ac, s = ac.createBufferSource(); s.buffer = o.brown ? AU.brown : AU.white; const f = ac.createBiquadFilter(); f.type = o.type || 'bandpass'; f.frequency.setValueAtTime(o.f, at); if (o.f2) f.frequency.exponentialRampToValueAtTime(o.f2, at + dur); f.Q.value = o.q ?? 1; const g = ac.createGain(); g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(o.vol, at + (o.atk ?? .002)); g.gain.exponentialRampToValueAtTime(.0004, at + Math.max(dur, (o.atk ?? .002) + .01)); s.connect(f); f.connect(g); g.connect(o.dest || AU.bS); s.start(at, Math.random() * 2); s.stop(at + dur + .05); }
/* ---------- voz de 8 bits: un bleep por letra ---------- */
function bleep(at, b) {
  const ac = AU.ac, o = ac.createOscillator(), g = ac.createGain(); oscW(o, b.wave || 'square');
  o.frequency.setValueAtTime(b.f, at); if (b.glide) o.frequency.exponentialRampToValueAtTime(b.f * b.glide, at + b.dur);
  g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(b.vol, at + .004); g.gain.setValueAtTime(b.vol, at + b.dur * .7); g.gain.linearRampToValueAtTime(0, at + b.dur);
  o.connect(g); g.connect(AU.bV); o.start(at); o.stop(at + b.dur + .02);
}
/* bostezo de 8 bits: pulso que sube y cae lento */
function yawn(at, base = 300) { const ac = AU.ac, o = ac.createOscillator(), g = ac.createGain(); oscW(o, 'triangle'); o.frequency.setValueAtTime(base, at); o.frequency.linearRampToValueAtTime(base * 1.5, at + .5); o.frequency.exponentialRampToValueAtTime(base * .6, at + 1.5); g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(.05, at + .2); g.gain.setTargetAtTime(0, at + 1.2, .2); o.connect(g); g.connect(AU.bV); o.start(at); o.stop(at + 2); }
/* ---------- foley ---------- */
function stepTap(at, v = 1, f = 1800) { noiseHit(at, .03, { type: 'bandpass', f, q: 2.5, vol: .05 * v }); tone(f * .12, at, .05, .03 * v, 'sine'); }
function clogClack(at, v = 1) { noiseHit(at, .04, { type: 'bandpass', f: 1200, q: 4, vol: .14 * v }); tone(420, at, .06, .07 * v, 'triangle', 300); }
function thump(at, v = 1, f = 90) { tone(f, at, .25, .3 * v, 'sine', f * .5); noiseHit(at, .08, { type: 'lowpass', f: 600, vol: .18 * v, brown: true }); }
function whoosh(at, dur = .6, v = 1, f0 = 400, f1 = 2400) { noiseHit(at, dur, { type: 'bandpass', f: f0, f2: f1, q: .9, vol: .12 * v, atk: dur * .45 }); }
function creak(at, v = 1) { const ac = AU.ac, o = ac.createOscillator(), g = ac.createGain(), f = ac.createBiquadFilter(); o.type = 'sawtooth'; o.frequency.setValueAtTime(70, at); o.frequency.linearRampToValueAtTime(110, at + .25); o.frequency.linearRampToValueAtTime(80, at + .5); f.type = 'bandpass'; f.frequency.value = 900; f.Q.value = 6; g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(.05 * v, at + .05); g.gain.setTargetAtTime(0, at + .4, .08); o.connect(f); f.connect(g); g.connect(AU.bS); o.start(at); o.stop(at + .7); }
function doorSlam(at, v = 1) { thump(at, v * 1.2, 70); noiseHit(at, .25, { type: 'bandpass', f: 380, q: 1.2, vol: .25 * v }); tone(180, at, .4, .08 * v, 'triangle', 120); }
function doorStop(at, v = 1) { const ac = AU.ac, o = ac.createOscillator(), g = ac.createGain(), lfo = ac.createOscillator(), lg = ac.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(260, at); o.frequency.exponentialRampToValueAtTime(180, at + .7); lfo.frequency.value = 18; lg.gain.value = 22; lfo.connect(lg); lg.connect(o.frequency); g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(.12 * v, at + .005); g.gain.exponentialRampToValueAtTime(.0005, at + .75); o.connect(g); g.connect(AU.bS); o.start(at); lfo.start(at); o.stop(at + .8); lfo.stop(at + .8); }
function frameRattle(at, v = 1, n = 9) { for (let k = 0; k < n; k++) { const a = at + k * .055 + Math.random() * .01, d = Math.exp(-k * .3); noiseHit(a, .02, { type: 'bandpass', f: 2600 + Math.random() * 900, q: 5, vol: .07 * v * d }); tone(1900 + Math.random() * 300, a, .04, .012 * v * d, 'sine'); } }
function alarmBeep(at, n = 4) { for (let k = 0; k < n; k++) tone(2093, at + k * .13, .09, .045, 'square', null, AU.bS, .002); }
function chirp(at, v = 1) { for (let k = 0; k < 2 + (Math.random() * 3 | 0); k++) { const f = 2600 + Math.random() * 1600; tone(f, at + k * .11, .07, .012 * v, 'sine', f * 1.35, AU.bA); } }
function cloth(at, dur = .5, v = 1) { noiseHit(at, dur, { type: 'bandpass', f: 1400, f2: 700, q: .7, vol: .08 * v, atk: .03 }); noiseHit(at + dur * .3, dur * .8, { type: 'highpass', f: 3500, vol: .03 * v, atk: .05 }); }
function paperFlip(at, v = 1) { for (let k = 0; k < 3; k++) noiseHit(at + k * .04, .05, { type: 'highpass', f: 2500 + k * 600, vol: .05 * v }); }
/* ---------- programación ---------- */
function auSeek(t) { if (!AU.ac) return; newBuses(); AU.sched = t; }
function auUpdate(t, playing) {
  if (!AU.ac || AU.offline) return;
  const ac = AU.ac, n = ac.currentTime, fin = typeof FILM !== 'undefined' && FILM.fade ? FILM.fade(t) : 1;
  AU.master.gain.setTargetAtTime(playing ? AU.vol * Math.min(1, t / 1.2 + .1) * fin : 0, n, .06);
  if (!playing) return;
  if (FILM.beds) FILM.beds(t, n);
  const look = .25, from = AU.sched, to = t + look;
  if (to > from) { for (const [te, fn] of AU.EV) if (te > from && te <= to) { try { fn(n + Math.max(0, te - t)); } catch (e) { console.warn('audio', te, e); } } AU.sched = to; }
}
window.__audioTest = () => { if (!AU.ac) auInit(); const errs = []; const n = AU.ac.currentTime; for (const [te, fn] of AU.EV) { try { fn(n + 1); } catch (e) { errs.push([te, String(e)]); } } for (let t = 0; t < FILM.DUR; t += 3) { try { AU.sched = t - .1; auUpdate(t, true); } catch (e) { errs.push(['upd' + t, String(e)]); } } return { n: AU.EV.length, errs }; };
window.__renderSong = async (t0 = 0, dur = FILM.DUR, sr = 44100) => {
  const oc = new OfflineAudioContext(2, Math.ceil(sr * dur), sr); AU.offline = true; AU.ac = null; auInit(oc);
  for (let t = t0; t < t0 + dur; t += .1) if (FILM.beds) FILM.beds(t, t - t0);
  AU.master.gain.value = AU.vol;
  window.__songErr = []; for (const [te, fn] of AU.EV) if (te >= t0 && te < t0 + dur) { try { fn(te - t0); } catch (e) { if (window.__songErr.length < 5) window.__songErr.push(te + ' ' + e); } }
  const buf = await oc.startRendering(), out = [];
  for (let c = 0; c < 2; c++) { const d = buf.getChannelData(c), q = new Int16Array(d.length); let pk = 0; for (let i = 0; i < d.length; i++) { const v = Math.max(-1, Math.min(1, d[i])); if (Math.abs(v) > pk) pk = Math.abs(v); q[i] = v * 32767; } out.push(q); window.__songPeak = pk; }
  window.__song = out; return out[0].length;
};
window.__songChunk = (c, i0, n) => { const a = window.__song[c].subarray(i0, i0 + n); let s = ''; const u8 = new Uint8Array(a.buffer, a.byteOffset, a.byteLength); for (let i = 0; i < u8.length; i += 32768) s += String.fromCharCode.apply(null, u8.subarray(i, i + 32768)); return btoa(s); };
