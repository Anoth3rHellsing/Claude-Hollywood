/* =====================================================================
   ESCENARIOS · REPRODUCTOR: carga por pasos (FILM.load = [[texto, fn]]), bucle, controles, modo prueba (?t=)
   ===================================================================== */
const btn = document.getElementById('play'), bar = document.getElementById('bar'), chap = document.getElementById('chap'), STAGE = document.getElementById('stage');
resize = function () {
  const r = cv.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
  let w = Math.max(320, Math.round(r.width * dpr)), h = Math.max(180, Math.round(r.height * dpr));
  const k = Math.min(1, 1920 / w, 1080 / h); w = Math.round(w * k); h = Math.round(h * k);
  if (w === W && h === H) return false;
  W = cv.width = w; H = cv.height = h; U = H / 1000; SW = W / U;
  PAPER = makePaper(W, H); FX = mk(W, H); fx = FX.getContext('2d'); POSTPAT2 = null; VIG2 = null;
  if (typeof onResize === 'function') onResize();
  return true;
};
let T = 0, PLAY = false, LASTF = performance.now(), ACCF = 0, FROZ = null, READY = false;
const TEST = /[?&]t=/.test(location.search);
async function load() {
  const step = async (txt, f) => { btn.textContent = txt; await new Promise(r => setTimeout(r, 0)); await f(); };
  resize();
  await step('Mezclando los pigmentos…', () => { GRAIN = makeGrain(); WASHTEX = makeWashTex(); BLOT = makeBlot(); });
  if (document.fonts && FILM.fonts) await Promise.race([Promise.all(FILM.fonts.map(f => document.fonts.load(f).catch(() => 0))), new Promise(r => setTimeout(r, 2500))]);
  for (const [txt, f] of FILM.load) await step(txt, f);
  READY = true; btn.textContent = FILM.playLabel || '▶ Comenzar (con sonido)'; btn.disabled = false;
  window.__ready = true;
}
function drawFrame(t, ticks) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none'; SHX = SHY = 0; T = t;
  FILM.draw(t, ticks);
}
function frame(now) {
  const dt = Math.min(.1, (now - LASTF) / 1000); LASTF = now;
  resize();
  let ticks = 0;
  if (PLAY) { TT += dt; ACCF += dt; ticks = Math.min(4, Math.floor(ACCF * 60)); ACCF -= ticks / 60; if (TT >= FILM.DUR) { TT = FILM.DUR; PLAY = false; btn.hidden = false; btn.textContent = '↺ Ver otra vez'; STAGE.classList.remove('playing'); } }
  if (READY) drawFrame(FROZ ?? TT, ticks);
  bar.style.width = (100 * TT / FILM.DUR) + '%';
  if (typeof auUpdate === 'function') auUpdate(TT, PLAY);
  requestAnimationFrame(frame);
}
let TT = 0;
function seekTo(t) { TT = clamp(t, 0, FILM.DUR); if (typeof auSeek === 'function') auSeek(TT); }
function start() {
  if (!READY) return;
  if (!AU.ac) try { auInit(); } catch (e) { console.warn(e); }
  if (AU.ac && AU.ac.state === 'suspended') AU.ac.resume();
  if (TT >= FILM.DUR) seekTo(0);
  PLAY = true; btn.hidden = true; STAGE.classList.add('playing'); auSeek(TT);
}
function pause() { PLAY = false; btn.hidden = false; btn.textContent = '▶ Seguir'; STAGE.classList.remove('playing'); auSeek(TT); }
btn.onclick = start; btn.disabled = true;
cv.addEventListener('click', () => { if (btn.hidden) pause(); });
addEventListener('keydown', e => {
  if (e.code === 'Space') { e.preventDefault(); PLAY ? pause() : start(); }
  if (e.key === 'r' || e.key === 'R') seekTo(0);
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') seekTo(TT + (e.key === 'ArrowRight' ? 5 : -5));
});
document.querySelector('.prog').addEventListener('pointerdown', e => { const r = e.currentTarget.getBoundingClientRect(); seekTo(clamp((e.clientX - r.left) / r.width) * FILM.DUR); });
/* la película llama a bootFilm() al final de su último módulo (cuando FILM ya existe) */
function bootFilm() {
  if (chap && FILM.CHAPTERS) chap.innerHTML = FILM.CHAPTERS.map(([t, n]) => `<span style="left:${100 * t / FILM.DUR}%" title="${n}"></span>`).join('');
  requestAnimationFrame(frame); load();
}
/* modo prueba */
window.__seek = (t, warm) => { FROZ = null; if (warm === undefined) warm = 30; for (let i = warm; i > 0; i--) drawFrame(t - i / 60, 1); FROZ = t; TT = t; drawFrame(t, 0); };
window.__perf = (t, n = 30) => { const a = []; for (let i = 0; i < n; i++) { const t0 = performance.now(); drawFrame(t + i / 60, 1); a.push(performance.now() - t0); } a.sort((x, y) => x - y); return { med: a[n >> 1], max: a[n - 1] }; };
