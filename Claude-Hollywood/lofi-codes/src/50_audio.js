/* =====================================================================
   LA CANCIÓN · lo-fi a 80 BPM (un compás = 3 s, 72 compases = 3:36), 100 % sintetizada con WebAudio
   piano eléctrico por FM con trémolo · batería boom-bap con swing y humanizado · bajo · melodía con delay ·
   kalimba · crujido de vinilo y siseo de cinta · wow & flutter (la afinación se mece) · el bombo hace «respirar» la mezcla ·
   ambientes por escena (pájaros, ciudad, cafetera, motor, olas, gaviotas)
   ===================================================================== */
const BPM = 80, BEAT = 60 / BPM, BAR = BEAT * 4, STEP = BEAT / 4, SWING = STEP * .24;
const beatPhase = t => ((t / BEAT) % 1 + 1) % 1;
const AU = { ac: null, sched: -1 };
const NT = n => 440 * Math.pow(2, (n - 69) / 12);
/* acordes: [bajo, voces] */
const PA = [[41, [57, 60, 64, 67]], [40, [55, 59, 62, 66]], [38, [53, 57, 60, 64]], [36, [52, 55, 59, 62]]];   // Fmaj9 · Em9 · Dm9 · Cmaj9
const PB = [[45, [55, 60, 64, 71]], [38, [54, 60, 64, 69]], [43, [59, 62, 66, 69]], [36, [52, 55, 59, 62]]];   // Am9 · D9 · Gmaj9 · Cmaj9
/* melodías: [paso de 16avos dentro de 2 compases, nota, duración en pasos] */
const MA1 = [[0, 72, 3], [3, 69, 2], [6, 67, 4], [12, 64, 3], [16, 67, 2], [18, 69, 2], [22, 71, 8]];
const MA2 = [[0, 69, 3], [3, 72, 3], [6, 74, 6], [14, 72, 2], [16, 71, 2], [18, 67, 4], [24, 64, 8]];
const MB1 = [[0, 76, 2], [2, 74, 2], [4, 72, 4], [10, 69, 2], [12, 72, 4], [16, 74, 3], [19, 78, 2], [22, 76, 8]];
const MB2 = [[0, 74, 4], [4, 71, 2], [6, 69, 4], [12, 67, 4], [16, 71, 2], [18, 72, 6], [26, 67, 6]];
/* la forma de la canción, compás a compás: progresión, batería, bajo, melodía */
const FORM = [];
{ const S = (n, o) => { for (let i = 0; i < n; i++) FORM.push({ ...o, i }); };
  S(4, { p: 'A', d: 0, b: 0, m: 0, sec: 'intro' });                 // 0–12 s: invernadero, despierta
  S(8, { p: 'A', d: 'A', b: 1, m: 0, sec: 'walk' });                // 12–36: camina por el invernadero
  S(8, { p: 'A', d: 'A', b: 1, m: 'lead', sec: 'city' });           // 36–60: la ciudad
  S(8, { p: 'B', d: 'A', b: 1, m: 'lead', sec: 'city' });           // 60–84
  S(4, { p: 'A', d: 'L', b: .6, m: 0, sec: 'cafe' });               // 84–96: el carrito (respiro)
  S(4, { p: 'B', d: 'L', b: .5, m: 'kal', sec: 'latte' });          // 96–108: el latte
  S(4, { p: 'A', d: 'A', b: 1, m: 0, sec: 'cafe' });                // 108–120
  S(4, { p: 'A', d: 'A', b: 1, m: 'lead', sec: 'drive', hats16: 1 });   // 120–132: el auto
  S(4, { p: 'B', d: 'A', b: 1, m: 'lead', sec: 'drive', hats16: 1 });   // 132–144
  S(4, { p: 'A', d: 'A', b: 1, m: 'lead8', sec: 'drive', hats16: 1 });  // 144–156
  S(4, { p: 'B', d: 'L', b: .7, m: 0, sec: 'sea' });                // 156–168: el mar
  S(8, { p: 'A', d: 'S', b: .9, m: 'kal', sec: 'sea' });            // 168–192
  S(4, { p: 'B', d: 'L', b: .7, m: 'kal', sec: 'sea' });            // 192–204
  S(4, { p: 'end', d: 0, b: 0, m: 0, sec: 'outro' }); }             // 204–216
const chordOf = bar => { const F = FORM[bar]; if (!F || F.p === 'end') return PA[0]; return (F.p === 'A' ? PA : PB)[bar % 4]; };
function auInit(given) {
  const ac = given || new (window.AudioContext || window.webkitAudioContext)(); AU.ac = ac;
  /* cadena de «cinta»: saturación suave → filtro de tono → compresor */
  const comp = ac.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 3; comp.attack.value = .01; comp.release.value = .2; comp.connect(ac.destination);
  AU.tone = ac.createBiquadFilter(); AU.tone.type = 'lowpass'; AU.tone.frequency.value = 1200; AU.tone.Q.value = .4; AU.tone.connect(comp);
  const sat = ac.createWaveShaper(), cv_ = new Float32Array(1024); for (let i = 0; i < 1024; i++) { const x = i / 512 - 1; cv_[i] = Math.tanh(x * 1.6) / Math.tanh(1.6); } sat.curve = cv_; sat.connect(AU.tone);
  AU.master = ac.createGain(); AU.master.gain.value = 0; AU.master.connect(sat);
  const rev = ac.createConvolver(), len = ac.sampleRate * 2.8, ir = ac.createBuffer(2, len, ac.sampleRate);
  for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.8) * (i < 400 ? i / 400 : 1); }
  rev.buffer = ir; AU.rev = ac.createGain(); AU.rev.gain.value = .45; AU.rev.connect(rev); rev.connect(AU.master);
  /* delay de la melodía (3/8 de pulso, con retroalimentación filtrada) */
  const dl = ac.createDelay(2), fb = ac.createGain(), dlf = ac.createBiquadFilter(); dl.delayTime.value = BEAT * .75; fb.gain.value = .38; dlf.type = 'lowpass'; dlf.frequency.value = 2400;
  AU.dly = ac.createGain(); AU.dly.gain.value = .32; AU.dly.connect(dl); dl.connect(dlf); dlf.connect(fb); fb.connect(dl); dlf.connect(AU.master); dlf.connect(AU.rev);
  /* buses persistentes por instrumento (el teclado tiene trémolo y «respira» con el bombo) */
  AU.keys = ac.createGain(); AU.keys.gain.value = .9; AU.keys.connect(AU.master); const kr = ac.createGain(); kr.gain.value = .35; AU.keys.connect(kr); kr.connect(AU.rev);
  const trem = ac.createOscillator(), tg = ac.createGain(); trem.frequency.value = 4.6; tg.gain.value = .12; trem.connect(tg); tg.connect(AU.keys.gain); trem.start();
  AU.drums = ac.createGain(); const dlp = ac.createBiquadFilter(); dlp.type = 'lowpass'; dlp.frequency.value = 8000; AU.drums.connect(dlp); dlp.connect(AU.master); const dr = ac.createGain(); dr.gain.value = .12; dlp.connect(dr); dr.connect(AU.rev); AU.drumsLP = dlp;
  AU.bass = ac.createGain(); const blp = ac.createBiquadFilter(); blp.type = 'lowpass'; blp.frequency.value = 700; AU.bass.connect(blp); blp.connect(AU.master);
  AU.lead = ac.createGain(); AU.lead.gain.value = .9; AU.lead.connect(AU.master); AU.lead.connect(AU.dly); const lr = ac.createGain(); lr.gain.value = .4; AU.lead.connect(lr); lr.connect(AU.rev);
  AU.amb = ac.createGain(); AU.amb.connect(AU.master);
  /* wow & flutter: la afinación de todo lo tonal se mece un poco, como una cinta vieja */
  AU.wow = ac.createGain(); AU.wow.gain.value = 9; const wo = ac.createOscillator(); wo.frequency.value = .42; wo.connect(AU.wow); wo.start();
  const fl = ac.createOscillator(), flg = ac.createGain(); fl.frequency.value = 6.3; flg.gain.value = 2.2; fl.connect(flg); flg.connect(AU.wow); fl.start();
  /* ruidos */
  const mkNoise = (sec, brown) => { const b = ac.createBuffer(1, ac.sampleRate * sec, ac.sampleRate), d = b.getChannelData(0); let l = 0; for (let i = 0; i < d.length; i++) { const w = Math.random() * 2 - 1; if (brown) { l = (l + .02 * w) / 1.02; d[i] = l * 3.5; } else d[i] = w; } return b; };
  AU.white = mkNoise(3, false); AU.brown = mkNoise(3, true);
  /* vinilo: chasquidos sueltos + siseo */
  { const b = ac.createBuffer(1, ac.sampleRate * 4, ac.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) { const r = Math.random(); d[i] = r < .0009 ? (Math.random() * 2 - 1) * (.4 + Math.random() * .6) : r < .004 ? (Math.random() * 2 - 1) * .08 : (Math.random() * 2 - 1) * .012; } AU.vinylBuf = b; }
  const bed = (buf, type, f, q) => { const s = ac.createBufferSource(); s.buffer = buf; s.loop = true; const fl_ = ac.createBiquadFilter(); fl_.type = type; fl_.frequency.value = f; fl_.Q.value = q; const g = ac.createGain(); g.gain.value = 0; s.connect(fl_); fl_.connect(g); g.connect(AU.master); s.start(); return { g, fl: fl_ }; };
  AU.vinyl = bed(AU.vinylBuf, 'bandpass', 2600, .5); AU.hiss = bed(AU.white, 'highpass', 6000, .5);
  AU.wind = bed(AU.brown, 'bandpass', 380, 1); AU.traffic = bed(AU.brown, 'lowpass', 260, .6); AU.murmur = bed(AU.white, 'bandpass', 620, 2.4);
  AU.waves = bed(AU.brown, 'lowpass', 700, .6); AU.foam = bed(AU.white, 'bandpass', 3200, .7);
  /* motor del auto: sierra grave + ruido de carretera */
  AU.eng = ac.createGain(); AU.eng.gain.value = 0; const elp = ac.createBiquadFilter(); elp.type = 'lowpass'; elp.frequency.value = 220; AU.eng.connect(AU.master); elp.connect(AU.eng);
  AU.engO = [[48, 'sawtooth', .5], [96.5, 'square', .12]].map(([f, ty, v]) => { const o = ac.createOscillator(), g = ac.createGain(); o.type = ty; o.frequency.value = f; g.gain.value = v; o.connect(g); g.connect(elp); o.start(); return o; });
  AU.road = bed(AU.brown, 'bandpass', 520, .8);
  buildEvents(); newBuses();
}
function newBuses() {
  const ac = AU.ac;
  for (const b of AU.buses || []) { try { b.gain.cancelScheduledValues(0); b.gain.value = 0; b.disconnect(); } catch (e) { } }
  const mkb = dest => { const g = ac.createGain(); g.connect(dest); return g; };
  AU.bK = mkb(AU.keys); AU.bD = mkb(AU.drums); AU.bB = mkb(AU.bass); AU.bL = mkb(AU.lead); AU.bA = mkb(AU.amb); AU.bS = mkb(AU.master);
  AU.buses = [AU.bK, AU.bD, AU.bB, AU.bL, AU.bA, AU.bS];
}
/* ---------- instrumentos (at = tiempo del AudioContext) ---------- */
function env(g, at, v, atk, dur, rel = .08) { g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(v, at + atk); g.gain.setTargetAtTime(0, at + dur, rel); }
function osc(type, f, at, end, dest, wow = true) { const o = AU.ac.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, at); if (wow) { AU.wow.connect(o.detune); o.onended = () => { try { AU.wow.disconnect(o.detune); } catch (e) { } }; } o.connect(dest); o.start(at); o.stop(end); return o; }
/* piano eléctrico: FM con índice que cae (el «golpe» de la lengüeta) + un brillo de campana */
function rhodes(n, at, dur, vel = .6, dest = AU.bK, pitchDrop) {
  const ac = AU.ac, f = NT(n), g = ac.createGain(), end = at + dur + 1.6;
  g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(.34 * vel, at + .006); g.gain.setTargetAtTime(.15 * vel, at + .01, .5); g.gain.setTargetAtTime(0, at + dur, .35);
  const c = osc('sine', f, at, end, g), m = ac.createOscillator(), mg = ac.createGain(); m.frequency.value = f; mg.gain.setValueAtTime(f * 1.4 * vel, at); mg.gain.setTargetAtTime(f * .18, at, .18); m.connect(mg); mg.connect(c.frequency); m.start(at); m.stop(end);
  const tine = ac.createGain(); env(tine, at, .06 * vel, .002, .05, .08); const t2 = osc('sine', f * 4.02, at, at + .5, tine, false); tine.connect(g);
  if (pitchDrop) { c.frequency.setValueAtTime(f, pitchDrop[0]); c.frequency.exponentialRampToValueAtTime(f * pitchDrop[1], pitchDrop[0] + pitchDrop[2]); m.frequency.setValueAtTime(f, pitchDrop[0]); m.frequency.exponentialRampToValueAtTime(f * pitchDrop[1], pitchDrop[0] + pitchDrop[2]); }
  g.connect(dest);
}
function chord(ch, at, dur, vel, strum = .014, pd) { ch[1].forEach((n, i) => rhodes(n, at + i * strum + Math.random() * .006, dur, vel * (.85 + Math.random() * .2), AU.bK, pd)); }
function bassNote(n, at, dur, vel = .8) { const ac = AU.ac, g = ac.createGain(); env(g, at, .17 * vel, .012, dur, .07); osc('sine', NT(n), at, at + dur + .5, g); const g2 = ac.createGain(); g2.gain.value = .35; g2.connect(g); osc('triangle', NT(n), at, at + dur + .5, g2); g.connect(AU.bB); }
function leadNote(n, at, dur, vel = .5, oct = 0) {
  const ac = AU.ac, f = NT(n + oct), g = ac.createGain(); env(g, at, .12 * vel, .03, dur, .18);
  const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3200; lp.connect(g);
  const o = osc('triangle', f, at, at + dur + 1, lp), o2 = osc('sine', f * 2, at, at + dur + 1, lp);
  const vib = ac.createOscillator(), vg = ac.createGain(); vib.frequency.value = 5.2; vg.gain.setValueAtTime(0, at); vg.gain.linearRampToValueAtTime(14, at + .35); vib.connect(vg); vg.connect(o.detune); vg.connect(o2.detune); vib.start(at); vib.stop(at + dur + 1);
  g.connect(AU.bL);
}
function kalimba(n, at, vel = .5) { const ac = AU.ac, f = NT(n), g = ac.createGain(); env(g, at, .18 * vel, .002, .02, .5); osc('sine', f, at, at + 2.2, g); const h = ac.createGain(); env(h, at, .07 * vel, .002, .01, .08); osc('sine', f * 5.4, at, at + .4, h, false); h.connect(AU.bL); g.connect(AU.bL); }
function noiseHit(at, dur, o) { const ac = AU.ac, s = ac.createBufferSource(); s.buffer = o.brown ? AU.brown : AU.white; const f = ac.createBiquadFilter(); f.type = o.type || 'bandpass'; f.frequency.setValueAtTime(o.f, at); if (o.f2) f.frequency.exponentialRampToValueAtTime(o.f2, at + dur); f.Q.value = o.q ?? 1; const g = ac.createGain(); g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(o.vol, at + (o.atk ?? .002)); g.gain.exponentialRampToValueAtTime(.0004, at + Math.max(dur, (o.atk ?? .002) + .01)); s.connect(f); f.connect(g); g.connect(o.dest || AU.bD); s.start(at, Math.random() * 2); s.stop(at + dur + .05); }
function tone(f, at, dur, vol, type = 'sine', f2, dest = AU.bS) { const ac = AU.ac, o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.setValueAtTime(f, at); if (f2) o.frequency.exponentialRampToValueAtTime(f2, at + dur); g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(vol, at + .005); g.gain.exponentialRampToValueAtTime(.0004, at + dur); o.connect(g); g.connect(dest); o.start(at); o.stop(at + dur + .05); }
function kick(at, v = 1) { tone(120, at, .28, .4 * v, 'sine', 48, AU.bD); noiseHit(at, .02, { type: 'bandpass', f: 2600, q: .8, vol: .22 * v }); AU.keys.gain.cancelScheduledValues(at); AU.keys.gain.setValueAtTime(.62, at); AU.keys.gain.setTargetAtTime(.9, at + .02, .12); }
function snare(at, v = 1) { noiseHit(at, .2, { type: 'bandpass', f: 2600, q: .55, vol: .45 * v }); noiseHit(at, .12, { type: 'highpass', f: 5000, vol: .12 * v }); tone(190, at, .1, .18 * v, 'triangle', 150, AU.bD); }
function rim(at, v = 1) { tone(1700, at, .04, .12 * v, 'square', 1200, AU.bD); noiseHit(at, .03, { type: 'bandpass', f: 3000, q: 3, vol: .1 * v }); }
function hat(at, v = 1, open) { noiseHit(at, open ? .28 : .05, { type: 'highpass', f: 6500, vol: .2 * v }); }
function blip(at, f = 880, f2, dur = .08, vol = .035) { tone(f, at, dur, vol, 'square', f2); }
function chirp(at) { for (let k = 0; k < 2 + (Math.random() * 3 | 0); k++) { const f = 2600 + Math.random() * 1600; tone(f, at + k * .11, .07, .012, 'sine', f * 1.35, AU.bA); } }
function gull(at) { for (let k = 0; k < 3; k++) tone(1300 - k * 60, at + k * .22, .18, .02, 'sawtooth', 900, AU.bA); }
/* ---------- la partitura completa ---------- */
function buildEvents() {
  const E = [], hum = () => (Math.random() - .5) * .012;
  for (let bar = 0; bar < FORM.length; bar++) {
    const F = FORM[bar], t0 = bar * BAR, ch = chordOf(bar);
    const st = (s) => t0 + s * STEP + (s % 2 ? SWING : 0);
    /* teclado */
    if (F.p === 'end') { if (bar === 68) E.push([t0, at => chord(PA[0], at, 3, .7)]); if (bar === 69) E.push([t0, at => chord(PA[3], at, 6, .7, .03, [at + 2.4, .62, 1.6])]); continue; }
    const kv = F.sec === 'intro' ? .55 : F.sec === 'latte' ? .5 : .62;
    E.push([st(0) + hum(), at => chord(ch, at, BEAT * 1.7, kv)]);
    if (bar % 2 === 1 || F.sec === 'drive') E.push([st(6) + hum(), at => chord(ch, at, BEAT * .6, kv * .55, .01)]);
    if (F.sec !== 'intro' && bar % 4 === 3) E.push([st(10) + hum(), at => chord(ch, at, BEAT * 1.2, kv * .7)]);
    /* bajo */
    if (F.b) { const r = ch[0], nxt = chordOf(bar + 1)[0];
      E.push([st(0), at => bassNote(r, at, BEAT * 1.3, F.b)]); E.push([st(7), at => bassNote(r + 12, at, STEP * 1.2, F.b * .6)]); E.push([st(10), at => bassNote(r, at, BEAT * .9, F.b * .85)]);
      if (bar % 2 === 1) E.push([st(14), at => bassNote(nxt + (nxt > r ? -1 : 1), at, STEP * 1.5, F.b * .5)]); }
    /* batería */
    for (let s = 0; s < 16; s++) {
      const at0 = st(s) + hum();
      if (F.d === 'A' || F.d === 'S') {
        const soft = F.d === 'S' ? .6 : 1;
        if (s === 0 || s === 10 || (s === 7 && bar % 2 === 0)) E.push([at0, at => kick(at, (s === 7 ? .55 : 1) * soft)]);
        if (s === 4 || s === 12) E.push([at0, at => snare(at, soft)]);
        if (s === 15 && bar % 4 === 3) E.push([at0, at => snare(at, .3 * soft)]);
        if (s % 2 === 0 || (F.hats16 && Math.random() < .6)) E.push([at0, at => hat(at, (s % 4 === 0 ? 1 : .55) * soft * (s % 2 ? .4 : 1), s === 14 && bar % 4 === 3)]);
      } else if (F.d === 'L') {
        if (s === 4 || s === 12) E.push([at0, at => rim(at, .8)]);
        if (s % 2 === 0) E.push([at0, at => hat(at, s % 4 === 0 ? .6 : .35)]);
      }
    }
    /* melodías */
    if (F.m) { const half = bar % 2, M = F.p === 'A' ? (bar % 4 < 2 ? MA1 : MA2) : (bar % 4 < 2 ? MB1 : MB2);
      for (const [s, n, d] of M) { if ((s >> 4) !== half) continue; const ls = s - half * 16, at0 = st(ls) + hum();
        if (F.m === 'kal') E.push([at0, at => kalimba(n + 12, at, .7)]);
        else E.push([at0, at => leadNote(n, at, d * STEP, .8, F.m === 'lead8' ? 12 : 0)]); } }
  }
  /* un barrido de ruido (como un platillo al revés) antes de cada sección */
  for (const b of [4, 12, 28, 40, 52]) E.push([b * BAR - 1.6, at => noiseHit(at, 1.6, { type: 'highpass', f: 1200, f2: 7000, vol: .06, atk: 1.55, dest: AU.bS })]);
  /* ---- ambiente y efectos ---- */
  for (let t = 1.5; t < 34; t += 1.8 + hsh(t, 1) * 2.5) E.push([t, at => chirp(at)]);
  E.push([9.3, at => { blip(at, 330, 660, .12, .025); blip(at + .1, 495, 990, .12, .022); }]);   // se despierta
  E.push([13.2, at => blip(at, 660, 1320, .1, .025)]);
  E.push([52.5, at => { tone(2800, at, .5, .03, 'sine'); tone(2800, at + .18, .6, .03, 'sine'); }]);   // timbre de bici
  for (const P of PIGEONS) E.push([P.tf, at => { for (let k = 0; k < 7; k++) noiseHit(at + k * .07, .05, { type: 'bandpass', f: 900, q: 1, vol: .05, dest: AU.bA }); }]);
  E.push([86.4, at => { blip(at, 660, 990, .08, .025); blip(at + .12, 880, 1320, .08, .022); }]);   // pide
  E.push([92.4, at => noiseHit(at, 3.4, { type: 'bandpass', f: 1800, f2: 4200, q: 2, vol: .05, atk: .6, dest: AU.bA })]);   // la cafetera
  E.push([99.2, at => { for (let k = 0; k < 40; k++) tone(500 + Math.random() * 500, at + Math.random() * 5, .06, .006, 'sine', 300, AU.bA); noiseHit(at, 5, { type: 'bandpass', f: 900, q: 1.2, vol: .02, atk: .5, dest: AU.bA }); }]);   // el vertido
  E.push([110.6, at => { tone(2400, at, .4, .03, 'sine'); tone(3600, at, .3, .015, 'sine'); }]);   // la taza en el borde
  E.push([111.0, at => { blip(at, 660, 1320, .08, .025); blip(at + .1, 990, 1980, .1, .02); }]);
  E.push([118.6, at => { noiseHit(at, .12, { type: 'lowpass', f: 400, vol: .2, dest: AU.bS }); }]);   // puerta del auto
  E.push([119.4, at => { tone(600, at, .14, .05, 'square'); tone(600, at + .2, .14, .05, 'square'); }]);   // bip bip
  E.push([155.6, at => noiseHit(at, .1, { type: 'bandpass', f: 1400, q: 4, vol: .06, dest: AU.bS })]);
  for (let t = 160; t < 210; t += 5 + hsh(t, 2) * 6) E.push([t, at => gull(at)]);
  E.push([207.6, at => { /* la cinta se frena */ AU.tone.frequency.setTargetAtTime(420, at, .5); }]);
  AU.EV = E.sort((a, b) => a[0] - b[0]);
}
function auSeek(t) { if (!AU.ac) return; newBuses(); AU.sched = t; }
function auUpdate(t, playing) {
  if (!AU.ac || AU.offline) return;
  const ac = AU.ac, n = ac.currentTime;
  AU.master.gain.setTargetAtTime(playing ? .5 * Math.min(1, t / 1.5) * (1 - sm((t - 212.5) / 3)) : 0, n, .08);
  if (!playing) return;
  auBeds(t, n);
  /* programación con anticipación */
  const look = .25, from = AU.sched, to = t + look;
  if (to > from) { for (const [te, fn] of AU.EV) if (te > from && te <= to) { try { fn(n + Math.max(0, te - t)); } catch (e) { console.warn('audio', te, e); } } AU.sched = to; }
}
function auBeds(t, n) {
  const F = FORM[Math.min(FORM.length - 1, Math.floor(t / BAR))];
  /* el filtro de la «cinta»: cerrado al principio, se abre con la batería; más oscuro en el mar y al final */
  const open = t < 12 ? lerp(1400, 4200, sm(t / 12)) : F.sec === 'sea' ? 6500 : F.sec === 'latte' ? 5200 : 9500;
  if (t < 207.6) AU.tone.frequency.setTargetAtTime(open, n, .6);
  AU.drumsLP.frequency.setTargetAtTime(F.sec === 'sea' ? 5000 : 8000, n, .5);
  /* lechos */
  const amb = (b, v, tc = .5) => b.g.gain.setTargetAtTime(v, n, tc);
  amb(AU.vinyl, .14); amb(AU.hiss, .01);
  amb(AU.wind, t < 36 ? .03 : F.sec === 'sea' ? .04 : .015);
  const city = t > 35 && t < 120 ? (F.sec === 'latte' ? .3 : 1) : 0; amb(AU.traffic, .06 * city); amb(AU.murmur, .012 * city); AU.murmur.fl.frequency.setTargetAtTime(520 + 160 * Math.sin(t * .7), n, .3);
  const seaV = t > 155 ? 1 : 0, sw = .5 + .5 * Math.sin(t * .55); amb(AU.waves, (.05 + .07 * sw) * seaV, .4); amb(AU.foam, (.004 + .012 * sw * sw) * seaV, .4);
  const dv = t > 119.6 && t < 157 ? driveV(t) / DR_V : 0; AU.eng.gain.setTargetAtTime(.1 * (t > 119.6 && t < 156.5 ? .4 + .6 * dv : 0), n, .3); AU.engO[0].frequency.setTargetAtTime(44 + 22 * dv + Math.sin(t * 3) * 1.5, n, .2); AU.engO[1].frequency.setTargetAtTime(88 + 44 * dv, n, .2); amb(AU.road, .05 * dv, .3);
}
/* grabar la canción sin conexión (para medir niveles o exportarla): devuelve los canales en Int16 */
window.__renderSong = async (t0 = 0, dur = FILM.DUR, sr = 44100) => {
  const oc = new OfflineAudioContext(2, Math.ceil(sr * dur), sr); AU.offline = true; AU.ac = null; auInit(oc);
  for (let t = t0; t < t0 + dur; t += .1) auBeds(t, t - t0);
  AU.master.gain.value = .5;   // los fundidos se aplican al exportar
  window.__songErr = []; for (const [te, fn] of AU.EV) if (te >= t0 && te < t0 + dur) { try { fn(te - t0); } catch (e) { if (window.__songErr.length < 5) window.__songErr.push(te + " " + e); } }
  const buf = await oc.startRendering(), out = [];
  for (let c = 0; c < 2; c++) { const d = buf.getChannelData(c), q = new Int16Array(d.length); let pk = 0; for (let i = 0; i < d.length; i++) { const v = Math.max(-1, Math.min(1, d[i])); if (Math.abs(v) > pk) pk = Math.abs(v); q[i] = v * 32767; } out.push(q); window.__songPeak = pk; }
  window.__song = out; return out[0].length;
};
window.__songChunk = (c, i0, n) => { const a = window.__song[c].subarray(i0, i0 + n); let s = ''; const u8 = new Uint8Array(a.buffer, a.byteOffset, a.byteLength); for (let i = 0; i < u8.length; i += 32768) s += String.fromCharCode.apply(null, u8.subarray(i, i + 32768)); return btoa(s); };
window.__audioTest = () => { if (!AU.ac) auInit(); const errs = []; const n = AU.ac.currentTime; for (const [te, fn] of AU.EV) { try { fn(n + 1); } catch (e) { errs.push([te, String(e)]); } } for (const t of [0, 20, 50, 90, 100, 130, 160, 200, 210]) { try { AU.sched = t - .1; auUpdate(t, true); } catch (e) { errs.push(['upd' + t, String(e)]); } } return { n: AU.EV.length, errs }; };
