/* ---------- reproductor del tráiler v2 ----------
   Cada película vive en su propio iframe (mismo origen) y el tráiler la «conduce»:
   le dice en qué segundo está y la dibuja él, fotograma a fotograma, en sincronía con este reloj.
   Encima, una capa con los primeros planos, subtítulos, rótulos, franjas y cortes. */
let T = 0, STARTED = false, PLAY = false, LASTF = performance.now(), ACCF = 0, FROZ = null, CUR = null, EMA = 1 / 60, SLOW = 0;
const btn = document.getElementById('play'), bar = document.getElementById('bar'), stage = document.querySelector('.stage'), loadEl = document.getElementById('load');
const FR = {};
for (const k of ['e1', 'e2', 'e3']) {
  const f = document.createElement('iframe'); f.className = 'film'; f.setAttribute('aria-hidden', 'true'); f.tabIndex = -1; f.title = k;
  f.srcdoc = FILMSRC[k]; stage.insertBefore(f, cv); FR[k] = { el: f };
}
const ctl = k => { try { return FR[k].el.contentWindow.__ctl || null; } catch (e) { return null; } };
const allReady = () => ['e1', 'e2', 'e3'].every(k => { const c = ctl(k); return c && c.ready(); });
function loadPct() { let p = 0; for (const k of ['e1', 'e2', 'e3']) { const c = ctl(k); p += c ? (c.ready() ? 100 : c.pct()) : 0; } return Math.round(p / 3); }

const segAt = t => SEGS.find(s => t >= s.t0 && t < s.t1);
function bars() { const h = Math.round(H * .058); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = '#0b0a0d'; ctx.fillRect(0, 0, W, h); ctx.fillRect(0, H - h, W, h); }
function overlay(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'source-over';
  /* cortes: un parpadeo de tinta en cada empalme; más largo entre capítulos */
  let dk = 0;
  for (let i = 1; i < SEGS.length; i++) { const s = SEGS[i], w = s.dip ?? .2; dk = Math.max(dk, 1 - Math.abs(t - s.t0) / w); }
  dk = Math.max(dk, 1 - t / 1.2, sm((t - ENDT + .5) / .5) * (1 - sm((t - ENDT) / .6)));
  if (dk > 0) { ctx.globalAlpha = clamp(dk); ctx.fillStyle = 'rgb(11,10,13)'; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
  if (t < ENDT) bars();
  for (const [a, b, txt, who] of FILM.SUBS) subtitle(txt, win(t, a, b, .35, .4), who);
  for (const [a, b, txt] of FILM.CARDS) { const al = win(t, a, b, .5, .5); if (al > .01) { ctx.save(); L0s(); ctx.globalAlpha = al; ctx.font = '600 30px "Cormorant Garamond", Georgia, serif'; ctx.textAlign = 'left'; ctx.fillStyle = 'rgba(244,236,218,.92)'; ctx.shadowColor = 'rgba(0,0,0,.85)'; ctx.shadowBlur = 10 * U; ctx.fillText(txt.toUpperCase(), -SW / 2 + 60, -390); ctx.restore(); } }
  T0();
}
function show(t, dt, ticks, warm) {
  const sg = segAt(t);
  for (const k in FR) FR[k].el.style.visibility = sg && sg.film === k ? 'visible' : 'hidden';
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; SHX = SHY = 0;
  if (sg && sg.film) {
    const c = ctl(sg.film), lt = t - sg.t0, ft = sg.f0 + lt;
    if (c) { if (sg !== CUR || warm) c.drive(ft, 1 / 60, warm ?? .5); else if (dt > 0) c.drive(ft, dt); }
    const z = lerp(sg.z[0], sg.z[1], eio(clamp(lt / sg.d)));
    const el = FR[sg.film].el; el.style.transformOrigin = `${sg.o[0] * 100}% ${sg.o[1] * 100}%`; el.style.transform = `scale(${z.toFixed(4)})`;
    ctx.clearRect(0, 0, W, H);
  } else if (sg) { if (warm) for (let i = 30; i > 0; i--) sg.draw(t - i / 60, 1, t - i / 60 - sg.t0); sg.draw(t, ticks, t - sg.t0); }
  else FILM.end(t);
  CUR = sg;
  overlay(t);
}
function frame(now) {
  const raw = (now - LASTF) / 1000, dt = Math.min(.1, raw); LASTF = now; resize();
  if (!document.body.classList.contains('ready')) {
    if (allReady()) { document.body.classList.add('ready'); btn.hidden = false; loadEl.hidden = true; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H); show(SEGS[1].t0 + 4.6, 0, 0, 1); }
    else { loadEl.textContent = `Mezclando la tinta de los tres episodios… ${loadPct()}%`; }
    requestAnimationFrame(frame); return;
  }
  let ticks = 0;
  if (PLAY) {
    T += dt; ACCF += dt; ticks = Math.min(4, Math.floor(ACCF * 60)); ACCF -= ticks / 60;
    if (T >= FILM.DUR) { T = FILM.DUR; PLAY = false; btn.hidden = false; btn.textContent = '↺ Ver otra vez'; }
    if (raw < .5) { EMA = EMA * .96 + raw * .04; if (EMA > 1 / 36) { SLOW += raw; if (SLOW > 2.5) for (const k in FR) ctl(k)?.lowq(true); } else SLOW = Math.max(0, SLOW - raw * .5); }
  }
  if (FROZ === null) { if (STARTED) show(T, PLAY ? dt : 0, ticks); else show(SEGS[1].t0 + 4.6, 0, 0); }
  bar.style.width = (100 * T / FILM.DUR) + '%';
  auUpdate(T, PLAY);
  requestAnimationFrame(frame);
}
function start() {
  if (!document.body.classList.contains('ready')) return;
  if (!AU.ac) try { auInit(); } catch (e) { }
  if (AU.ac && AU.ac.state === 'suspended') AU.ac.resume();
  if (!STARTED || T >= FILM.DUR) { T = 0; AU.last = -1; CUR = null; }
  STARTED = true;
  FROZ = null; PLAY = true; btn.hidden = true; document.body.classList.add('playing');
}
function pause() { PLAY = false; btn.hidden = false; btn.textContent = '▶ Seguir'; document.body.classList.remove('playing'); }
btn.onclick = start;
cv.addEventListener('click', () => { if (btn.hidden) pause(); });
addEventListener('keydown', e => {
  if (e.code === 'Space') { e.preventDefault(); PLAY ? pause() : start(); }
  if (e.key === 'r' || e.key === 'R') { T = 0; AU.last = -1; CUR = null; if (!PLAY && STARTED) show(0.0001, 0, 0, .3); }
});
GRAIN = makeGrain(); WASHTEX = makeWashTex(); HATCH = makeHatch(9, -.8, 1.3, 'rgba(52,50,62,.75)'); HATCH2 = makeHatch(5, -.8, 1.5, 'rgba(40,38,50,.9)');
resize(); requestAnimationFrame(frame);
/* modo prueba: captura de un fotograma concreto */
window.__ready = () => document.body.classList.contains('ready');
window.__seek = t => { btn.hidden = true; for (const k in FR) try { FR[k].el.contentDocument.body.classList.add('test'); } catch (e) { } FROZ = null; resize(); T = t; CUR = null; show(t, 1 / 60, 1, 1.0); FROZ = t; };
