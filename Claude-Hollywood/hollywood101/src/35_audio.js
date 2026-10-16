/* =====================================================================
   SONIDO · todo sintetizado salvo la voz de Aguada (ElevenLabs, incrustada en base64)
   lechos: brisa, hojas, pájaros · música de «clase» curiosa (caja de música, pizzicato, colchón) en Fa lidio
   eventos: blips de 8 bits, pasos y chapoteos, piedra, poste, derrumbe de vidrio, notas de la caja de cultivo, sellos
   Programación con anticipación (lookahead) y buses que se tiran al saltar: se puede saltar a cualquier instante.
   ===================================================================== */
const AU = { ac: null, sched: -1, vbuf: {} };
const NT = n => 440 * Math.pow(2, (n - 69) / 12);
let VDEC = null;
async function voiceLoad() {
  const oc = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 44100, 44100);
  for (const [id, V] of Object.entries(VOICE)) {
    if (!V.b64) continue;
    try { const bin = atob(V.b64), u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); AU.vbuf[id] = await oc.decodeAudioData(u.buffer); } catch (e) { console.warn('voz', id, e); }
  }
}
function auInit() {
  const ac = new (window.AudioContext || window.webkitAudioContext)(); AU.ac = ac;
  const comp = ac.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 3.5; comp.connect(ac.destination);
  AU.master = ac.createGain(); AU.master.gain.value = 0; AU.master.connect(comp);
  const rev = ac.createConvolver(), len = ac.sampleRate * 2.6, ir = ac.createBuffer(2, len, ac.sampleRate);
  for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
  rev.buffer = ir; AU.rev = ac.createGain(); AU.rev.gain.value = .5; AU.rev.connect(rev); rev.connect(AU.master);
  const mkNoise = (sec, brown) => { const b = ac.createBuffer(1, ac.sampleRate * sec, ac.sampleRate), d = b.getChannelData(0); let l = 0; for (let i = 0; i < d.length; i++) { const w = Math.random() * 2 - 1; if (brown) { l = (l + .02 * w) / 1.02; d[i] = l * 3.5; } else d[i] = w; } return b; };
  AU.white = mkNoise(3, false); AU.brown = mkNoise(3, true);
  const bed = (buf, type, f, q) => { const s = ac.createBufferSource(); s.buffer = buf; s.loop = true; const fl = ac.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q; const g = ac.createGain(); g.gain.value = 0; s.connect(fl); fl.connect(g); g.connect(AU.master); s.start(); return { g, fl }; };
  AU.wind = bed(AU.brown, 'bandpass', 380, 1.0); AU.leaves = bed(AU.white, 'bandpass', 5200, .7); AU.room = bed(AU.brown, 'lowpass', 220, .5);
  /* la música pasa por un control de volumen que baja cuando habla Aguada */
  AU.mus = ac.createGain(); AU.mus.gain.value = 1; AU.mus.connect(AU.master); const mr = ac.createGain(); mr.gain.value = .6; AU.mus.connect(mr); mr.connect(AU.rev);
  /* colchón de 4 voces que sigue los acordes */
  AU.pad = ac.createGain(); AU.pad.gain.value = 0; const plp = ac.createBiquadFilter(); plp.type = 'lowpass'; plp.frequency.value = 900; AU.pad.connect(plp); plp.connect(AU.mus);
  AU.voices = [0, 1, 2, 3].map(() => { const o1 = ac.createOscillator(), o2 = ac.createOscillator(), g = ac.createGain(); o1.type = 'triangle'; o2.type = 'sine'; o2.detune.value = 7; g.gain.value = .05; o1.connect(g); o2.connect(g); g.connect(AU.pad); o1.start(); o2.start(); return [o1, o2]; });
  buildEvents(); newBuses();
}
function newBuses() {
  const ac = AU.ac;
  for (const b of [AU.bus, AU.mbus, AU.vbus]) if (b) { try { b.gain.cancelScheduledValues(0); b.gain.value = 0; b.disconnect(); } catch (e) { } }
  AU.bus = ac.createGain(); AU.bus.connect(AU.master); AU.rbus = ac.createGain(); AU.rbus.connect(AU.rev); AU.bus.connect(AU.rbus); AU.rbus.gain.value = .35;
  AU.mbus = ac.createGain(); AU.mbus.connect(AU.mus);
  AU.vbus = ac.createGain(); AU.vbus.gain.value = 1.9; AU.vbus.connect(AU.master); const vr = ac.createGain(); vr.gain.value = .12; AU.vbus.connect(vr); vr.connect(AU.rev);
}
/* ---------- primitivas (at = tiempo del AudioContext) ---------- */
function env(g, at, v, atk, dur) { g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(v, at + atk); g.gain.exponentialRampToValueAtTime(.0004, at + Math.max(dur, atk + .01)); }
function nz(at, dur, o = {}) {
  const ac = AU.ac, s = ac.createBufferSource(); s.buffer = o.brown ? AU.brown : AU.white; s.loop = true;
  const f = ac.createBiquadFilter(); f.type = o.type || 'bandpass'; f.frequency.setValueAtTime(o.f || 1000, at); if (o.f2) f.frequency.exponentialRampToValueAtTime(o.f2, at + dur); f.Q.value = o.q ?? 1;
  const g = ac.createGain(); env(g, at, o.vol ?? .2, o.atk ?? .005, dur);
  s.connect(f); f.connect(g); g.connect(o.dest || AU.bus); s.start(at, Math.random() * 2); s.stop(at + dur + .05);
}
function tone(f, at, dur, vol, type = 'sine', f2, atk = .006, dest) {
  const ac = AU.ac, o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.setValueAtTime(f, at); if (f2) o.frequency.exponentialRampToValueAtTime(f2, at + dur);
  env(g, at, vol, atk, dur); o.connect(g); g.connect(dest || AU.bus); o.start(at); o.stop(at + dur + .05);
}
function bell(f, at, dur, vol, dest, ratio = 3.5) {   // campana / caja de música (FM)
  const ac = AU.ac, c = ac.createOscillator(), m = ac.createOscillator(), mg = ac.createGain(), g = ac.createGain();
  c.frequency.value = f; m.frequency.value = f * ratio; mg.gain.setValueAtTime(f * 1.6, at); mg.gain.exponentialRampToValueAtTime(f * .05, at + dur);
  m.connect(mg); mg.connect(c.frequency); env(g, at, vol, .004, dur); c.connect(g); g.connect(dest || AU.bus);
  c.start(at); m.start(at); c.stop(at + dur + .05); m.stop(at + dur + .05);
}
function pluck(f, at, dur, vol, dest) {   // pizzicato: triángulo con filtro que se cierra
  const ac = AU.ac, o = ac.createOscillator(), fl = ac.createBiquadFilter(), g = ac.createGain(); o.type = 'triangle'; o.frequency.value = f;
  fl.type = 'lowpass'; fl.frequency.setValueAtTime(f * 6, at); fl.frequency.exponentialRampToValueAtTime(f * 1.2, at + dur); env(g, at, vol, .004, dur);
  o.connect(fl); fl.connect(g); g.connect(dest || AU.bus); o.start(at); o.stop(at + dur + .05);
}
function blip(at, f = 880, f2, dur = .09, vol = .07) { tone(f, at, dur, vol, 'square', f2, .002); }   // 8 bits
function tinkle(at, n, span, vol = .05) { for (let i = 0; i < n; i++) { const t = at + Math.pow(Math.random(), 1.6) * span, f = 2400 + Math.random() * 4200; tone(f, t, .12 + Math.random() * .3, vol * (.5 + Math.random()), 'sine'); } }
function shatter(at, vol = .5, n = 40, span = 1.4) { nz(at, .5, { type: 'highpass', f: 2500, vol: vol * .7 }); nz(at, .25, { type: 'bandpass', f: 900, vol: vol * .5 }); tinkle(at + .02, n, span, .05 * vol / .5); }
function thump(at, vol = .4) { tone(140, at, .45, vol, 'sine', 45); nz(at, .3, { type: 'lowpass', f: 300, vol: vol * .5 }); }
function whoosh(at, dur = .5, vol = .2, f1 = 300, f2 = 2600) { nz(at, dur, { type: 'bandpass', f: f1, f2, q: 1.2, vol, atk: dur * .5 }); }
function creak(at, dur, f = 90, f2 = 60, vol = .12) { const ac = AU.ac, o = ac.createOscillator(), fl = ac.createBiquadFilter(), g = ac.createGain(); o.type = 'sawtooth'; o.frequency.setValueAtTime(f, at); o.frequency.linearRampToValueAtTime(f2, at + dur); fl.type = 'bandpass'; fl.frequency.value = f * 6; fl.Q.value = 6; g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(vol, at + dur * .2); g.gain.exponentialRampToValueAtTime(.0004, at + dur); o.connect(fl); fl.connect(g); g.connect(AU.bus); o.start(at); o.stop(at + dur + .05); }
function clang(at, vol = .3) { for (const [r, d] of [[1, 2.2], [2.76, 1.5], [5.4, 1], [8.9, .6]]) tone(240 * r, at, d, vol / (1 + r * .4), 'sine'); nz(at, .15, { type: 'highpass', f: 3000, vol: vol * .4 }); }
function chirp(at) { for (let k = 0; k < 2 + (Math.random() * 3 | 0); k++) { const f = 2600 + Math.random() * 1600; tone(f, at + k * .11, .07, .018, 'sine', f * 1.35); } }
function splash(at, vol = .12) { nz(at, .18, { type: 'bandpass', f: 1800, q: 1.5, vol }); tone(900, at, .12, vol * .3, 'sine', 300); }
/* ---------- música ---------- */
const BEAT = .6, PROG = [[53, 57, 60, 64], [55, 59, 62, 67], [52, 55, 59, 62], [57, 60, 64, 67]];   // Fmaj7 · G · Em7 · Am7 (Fa lidio)
const chordAt = t => PROG[Math.floor(Math.max(0, t) / (BEAT * 8)) % 4];
const MSEC = [[3, 29.4, 'box'], [31.2, 48.2, 'tick'], [48.2, 55.4, 'box'], [56.2, 88.8, 'warm'], [89.6, 110.8, 'nost'], [111.6, 131.0, 'play'], [141.4, 150.2, 'tick'], [150.6, 171.2, 'soft'], [171.6, 196.4, 'bright']];
function musicEvents(E) {
  for (const [a, b, st] of MSEC) {
    for (let k = Math.ceil(a / (BEAT / 2)); k * BEAT / 2 < b; k++) {
      const t = k * BEAT / 2, i8 = k % 16, ch = chordAt(t), r = hsh(k, 3), fade = Math.min(1, (t - a) / 1.5, (b - t) / 1.2);
      const add_ = f => E.push([t, f]);
      if (st === 'box' || st === 'bright' || st === 'soft') {
        if (i8 % 2 === 0 || r > .55) { const n = ch[(i8 * 3 + (k >> 4)) % 4] + 12 + (i8 > 11 ? 12 : 0); add_(at => bell(NT(n), at, .9, (st === 'soft' ? .022 : .035) * fade, AU.mbus)); }
        if (i8 % 4 === 0) add_(at => pluck(NT(ch[0] - 12), at, .5, .11 * fade, AU.mbus));
        if (st === 'bright' && i8 % 8 === 4) add_(at => pluck(NT(ch[2] - 12), at, .4, .08 * fade, AU.mbus));
      } else if (st === 'tick') {
        if (i8 % 2 === 0) add_(at => { nz(at, .03, { type: 'highpass', f: 6000, vol: .03 * fade, dest: AU.mbus }); });
        if (i8 % 4 === 0) add_(at => pluck(NT(ch[i8 % 3] + 12), at, .35, .06 * fade, AU.mbus));
        if (i8 === 0) add_(at => pluck(NT(ch[0] - 12), at, .6, .1 * fade, AU.mbus));
      } else if (st === 'warm' || st === 'nost') {
        if (i8 % 4 === 0 || (st === 'warm' && i8 % 4 === 2 && r > .5)) { const n = ch[(i8 >> 1) % 4] + 12; add_(at => bell(NT(n), at, 1.6, .03 * fade, AU.mbus, 2)); }
        if (i8 === 0 || i8 === 8) add_(at => pluck(NT(ch[0] - 12), at, .9, .1 * fade, AU.mbus));
      } else if (st === 'play') {
        add_(at => pluck(NT(ch[[0, 2, 1, 3][i8 % 4]] - 12 + (i8 % 8 > 3 ? 0 : 0)), at, .25, .1 * fade, AU.mbus));
        if (i8 % 4 === 2) add_(at => bell(NT(ch[(i8 >> 2) % 4] + 24), at, .25, .028 * fade, AU.mbus));
      }
    }
  }
  /* acorde final */
  E.push([196.8, at => { for (const [n, d] of [[53, 0], [60, .3], [64, .6], [67, .9], [72, 1.4], [76, 2]]) bell(NT(n), at + d, 4, .04, AU.mbus, 2); }]);
}
/* ---------- la partitura de efectos ---------- */
function buildEvents() {
  const E = [];
  musicEvents(E);
  /* B0 */
  E.push([1.2, at => bell(NT(77), at, 3, .03)]);
  E.push([4.25, at => { blip(at, 660, 1320, .12, .06); blip(at + .08, 990, 1980, .1, .05); blip(at + .17, 1320, 2640, .14, .045); }]);
  for (const th of AG_HOPS) E.push([th, at => blip(at, 520, 1040, .1, .045)]);
  for (const [t] of NOTES_INK) E.push([t, at => { nz(at, .25, { type: 'bandpass', f: 3000, q: 2, vol: .025, atk: .05 }); }]);
  for (let t = 2; t < FILM.DUR - 8; t += 3 + hsh(t, 1) * 5) if (!(t > 29 && t < 56) && !(t > 171 && t < 192)) E.push([t, at => chirp(at)]);
  /* B1: el mundo se congela (cinta que se frena), el esqueleto (barrido), pintar desde cero (un toque por capa) */
  E.push([29.6, at => { tone(330, at, .7, .06, 'triangle', 80); nz(at, .6, { type: 'lowpass', f: 1200, f2: 120, vol: .08 }); }]);
  E.push([30.5, at => whoosh(at, 1.8, .12, 200, 4000)]);
  for (let i = 0; i < 7; i++) E.push([REBUILD_T0 + i * REBUILD_DT, at => { bell(NT(72 + [0, 2, 4, 7, 9, 12, 14][i]), at, .6, .035); nz(at, .06, { type: 'highpass', f: 4000, vol: .04 }); }]);
  E.push([REBUILD_T0 + 7 * REBUILD_DT, at => { blip(at, 880, 1760, .08, .04); }]);
  /* B2: deformar (pops), capas (gotas), borde húmedo, papel */
  for (const t of [57.6, 58.1, 58.6, 59.1]) E.push([t, at => nz(at, .09, { type: 'bandpass', f: 1400, q: 3, vol: .03 })]);
  for (const t of [62.4, 64.1, 65.8]) E.push([t, at => { for (let k = 0; k < 6; k++) tone(1200 + k * 150, at + k * .05, .06, .02, 'sine'); }]);
  for (let i = 0; i < 20; i++) E.push([68.8 + i * .31, at => tone(1800 - i * 30, at, .18, .018, 'sine', 900 - i * 15)]);
  E.push([81.2, at => whoosh(at, 1.6, .1, 300, 1500)]);
  /* B3: las pantallas se encienden */
  for (const S of SCREENS) E.push([S.t, at => { for (const [n, d] of [[79, 0], [84, .1], [88, .2]]) bell(NT(n), at + d, 2, .03); }]);
  /* B4: pasos, chapoteos, la piedra, el poste, el derrumbe */
  for (const [ts, x, z] of STEPS) E.push([ts, at => { if (inPuddle(x, z)) splash(at, .1); else tone(260 + Math.random() * 40, at, .05, .03, 'square'); }]);
  E.push([125.75, at => { splash(at, .14); blip(at + .05, 1200, 600, .1, .04); }]);
  E.push([128.5, at => blip(at, 300, 600, .3, .04)]);
  E.push([T_THROW, at => { whoosh(at, .9, .18, 400, 2800); blip(at, 1500, 3000, .12, .04); }]);
  E.push([T_HIT, at => { clang(at, .3); nz(at, .1, { type: 'highpass', f: 3500, vol: .12 }); }]);
  E.push([T_POSTF, at => creak(at, T_WALL - T_POSTF + .3, 80, 40, .14)]);
  E.push([T_WALL, at => { thump(at, .5); shatter(at + .05, .7, 110, 3); nz(at, 2.5, { brown: true, type: 'lowpass', f: 300, vol: .25, atk: .1 }); }]);
  E.push([T_WALL + .9, at => tinkle(at, 60, 3, .03)]);
  E.push([133.0, at => whoosh(at, 3, .14, 200, 900)]);
  E.push([141.6, at => { tone(200, at, 1.6, .04, 'sine', 120); }]);
  /* B5: la caja de cultivo; el viento; la música; la voz */
  for (const [th, j] of CFHITS) E.push([th, at => { bell(NT(CFL[j].n), at, 1.8, .07); blip(at, 700, 1400, .05, .025); }]);
  E.push([154.4, at => whoosh(at, 4, .16, 250, 1200)]);
  /* B6: el tiquete, los sellos, la pincelada */
  E.push([171.7, at => whoosh(at, 1, .1, 600, 2400)]);
  for (const [, t0] of TK_FIELDS) E.push([t0, at => nz(at, 1.6, { type: 'bandpass', f: 3500, q: 2, vol: .02, atk: .2 })]);
  for (const [, ts] of TK_MODES) E.push([ts, at => { thump(at, .3); blip(at + .02, 400, 200, .08, .04); }]);
  E.push([188.4, at => whoosh(at, 1.3, .2, 300, 3000)]);
  E.push([192.9, at => blip(at, 660, 1320, .1, .05)]);
  AU.EV = E.sort((a, b) => a[0] - b[0]);
}
/* ---------- la voz ---------- */
function voicePlay(id, at, off = 0) { const b = AU.vbuf[id]; if (!b || off >= b.duration) return; const s = AU.ac.createBufferSource(); s.buffer = b; s.connect(AU.vbus); s.start(at, off); }
function voiceAt(t) { for (const [id, s] of VO) { const d = VOICE[id].d; if (t >= s && t < s + d) return [id, s, d]; } return null; }
function auSeek(t) {
  if (!AU.ac) return; newBuses(); AU.sched = t;
  if (PLAY) { const v = voiceAt(t); if (v) voicePlay(v[0], AU.ac.currentTime + .03, t - v[1]); }
}
function auUpdate(t, playing) {
  if (!AU.ac) return;
  const ac = AU.ac, n = ac.currentTime;
  AU.master.gain.setTargetAtTime(playing ? .9 * Math.min(1, t / 1) * (1 - sm((t - 204.5) / 1.5)) : 0, n, .08);
  if (!playing) return;
  /* lechos */
  const w = windAt(t), ins = (t > 55.6 && t < 89) || (t > 171.6 && t < 191.5) ? .35 : 1, frz = t > 29.6 && t < 54.4 ? .25 : 1;
  AU.wind.g.gain.setTargetAtTime((.035 + w * .09) * ins * frz, n, .3); AU.wind.fl.frequency.setTargetAtTime(280 + w * 300 + 60 * Math.sin(t * .9), n, .3);
  AU.leaves.g.gain.setTargetAtTime((.006 + Math.max(0, w - .2) * .03) * ins * frz, n, .2);
  AU.room.g.gain.setTargetAtTime(.03 * frz, n, .5);
  /* la música baja con la voz; el colchón sigue el acorde */
  const v = voiceAt(t + .15); AU.mus.gain.setTargetAtTime(v ? .42 : 1, n, v ? .08 : .5);
  let padV = 0; for (const [a, b, st] of MSEC) if (t > a && t < b && (st === 'warm' || st === 'nost' || st === 'bright' || st === 'soft')) padV = Math.min(sm((t - a) / 2), sm((b - t) / 1.5)) * (st === 'nost' ? .55 : .35);
  if (t > 196.4) padV = .5 * (1 - sm((t - 202) / 3));
  AU.pad.gain.setTargetAtTime(padV, n, .6);
  const ch = chordAt(t); AU.voices.forEach(([o1, o2], i) => { o1.frequency.setTargetAtTime(NT(ch[i]), n, .3); o2.frequency.setTargetAtTime(NT(ch[i]), n, .3); });
  /* programación con anticipación */
  const look = .2, from = AU.sched, to = t + look;
  if (to > from) {
    for (const [te, fn] of AU.EV) if (te > from && te <= to) { try { fn(n + Math.max(0, te - t)); } catch (e) { console.warn('audio', te, e); } }
    for (const [id, s] of VO) if (s > from && s <= to) voicePlay(id, n + Math.max(0, s - t));
    AU.sched = to;
  }
}
window.__audioTest = () => { if (!AU.ac) auInit(); const errs = []; const n = AU.ac.currentTime; for (const [te, fn] of AU.EV) { try { fn(n + 1); } catch (e) { errs.push([te, String(e)]); } } for (const t of [0, 30, 60, 100, 130, 160, 190, 200]) { try { AU.sched = t - .1; auUpdate(t, true); } catch (e) { errs.push(['upd' + t, String(e)]); } } return { n: AU.EV.length, voz: Object.keys(AU.vbuf).length, errs }; };
