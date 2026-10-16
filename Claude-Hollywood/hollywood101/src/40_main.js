/* =====================================================================
   REPRODUCTOR: carga por pasos, bucle, subtítulos en el DOM, controles, modo prueba (?t=)
   ===================================================================== */
const btn = document.getElementById('play'), bar = document.getElementById('bar'), chap = document.getElementById('chap'), SUB = document.getElementById('sub'), STAGE = document.getElementById('stage');
resize = function () {
  const r = cv.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
  let w = Math.max(320, Math.round(r.width * dpr)), h = Math.max(180, Math.round(r.height * dpr));
  const k = Math.min(1, 1920 / w, 1080 / h); w = Math.round(w * k); h = Math.round(h * k);
  if (w === W && h === H) return false;
  W = cv.width = w; H = cv.height = h; U = H / 1000; SW = W / U;
  PAPER = makePaper(W, H); FX = mk(W, H); fx = FX.getContext('2d'); POSTPAT = null; VIG = null;
  if (typeof onResize === 'function') onResize();
  return true;
};
let T = 0, PLAY = false, LASTF = performance.now(), ACCF = 0, FROZ = null, READY = false, SUBS_ON = true;
const TEST = /[?&]t=/.test(location.search);
async function load() {
  const step = async (txt, f) => { btn.textContent = txt; await new Promise(r => setTimeout(r, 0)); await f(); };
  resize();
  await step('Mezclando los pigmentos…', () => { GRAIN = makeGrain(); WASHTEX = makeWashTex(); BLOT = makeBlot(); });
  await step('Pintando el cielo de otoño…', () => { SKY = makeSky(); });
  await step('Pintando el bosque…', () => { FOREST = makeForest(); });
  await step('Pintando el muro de cristal…', () => { FWA = makeFarWall(false); FWB = makeFarWall(true); });
  await step('Pintando las losas del suelo…', () => { FTN = floorTex(FLN); FTF = floorTex(FLF); FTL = floorTex(FLL, 'light'); });
  await step('Pintando mesas, macetas y frascos…', () => { TABLES = TABLE_AT.map(([, , sd, w], i) => makeTable(sd, w, i >= 4 && i < 8 ? 3 : 2)); JARS = jarSprites(); });
  if (typeof FILM.load === 'function') await step('Últimos retoques…', () => FILM.load());
  if (typeof voiceLoad === 'function') await step('Afinando la voz de Aguada…', () => voiceLoad());
  if (document.fonts && document.fonts.ready) await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 2500))]);
  READY = true; btn.textContent = '▶ Ver la película (con sonido)'; btn.disabled = false;
  window.__ready = true;
}
function drawFrame(t, ticks) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none'; SHX = SHY = 0;
  FILM.draw(t, ticks);
  subUpdate(t);
}
let SUBTXT = '';
function subUpdate(t) {
  let txt = '', dark = false;
  if (SUBS_ON) for (const [a, b, s, d] of FILM.SUBS) if (t >= a && t < b) { txt = s; dark = d; break; }
  if (txt !== SUBTXT) { SUBTXT = txt; if (txt) SUB.textContent = txt; SUB.classList.toggle('on', !!txt); }
  SUB.classList.toggle('dark', !!dark);
}
function frame(now) {
  const dt = Math.min(.1, (now - LASTF) / 1000); LASTF = now;
  resize();
  let ticks = 0;
  if (PLAY) { T += dt; ACCF += dt; ticks = Math.min(4, Math.floor(ACCF * 60)); ACCF -= ticks / 60; if (T >= FILM.DUR) { T = FILM.DUR; PLAY = false; btn.hidden = false; btn.textContent = '↺ Ver otra vez'; STAGE.classList.remove('playing'); } }
  if (READY) drawFrame(FROZ ?? T, ticks);
  bar.style.width = (100 * T / FILM.DUR) + '%';
  if (typeof auUpdate === 'function') auUpdate(T, PLAY);
  requestAnimationFrame(frame);
}
function seekTo(t) { T = clamp(t, 0, FILM.DUR); if (typeof auSeek === 'function') auSeek(T); }
function start() {
  if (!READY) return;
  if (typeof auInit === 'function' && !AU.ac) try { auInit(); } catch (e) { console.warn(e); }
  if (AU.ac && AU.ac.state === 'suspended') AU.ac.resume();
  if (T >= FILM.DUR) seekTo(0);
  PLAY = true; btn.hidden = true; STAGE.classList.add('playing'); if (typeof auSeek === 'function') auSeek(T);
}
function pause() { PLAY = false; btn.hidden = false; btn.textContent = '▶ Seguir'; STAGE.classList.remove('playing'); if (typeof auSeek === 'function') auSeek(T); }
btn.onclick = start; btn.disabled = true;
cv.addEventListener('click', () => { if (btn.hidden) pause(); });
addEventListener('keydown', e => {
  if (e.code === 'Space') { e.preventDefault(); PLAY ? pause() : start(); }
  if (e.key === 'r' || e.key === 'R') seekTo(0);
  if (e.key === 's' || e.key === 'S') SUBS_ON = !SUBS_ON;
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') seekTo(T + (e.key === 'ArrowRight' ? 5 : -5));
});
document.querySelector('.prog').addEventListener('pointerdown', e => { const r = e.currentTarget.getBoundingClientRect(); seekTo(clamp((e.clientX - r.left) / r.width) * FILM.DUR); });
if (chap && FILM.CHAPTERS) chap.innerHTML = FILM.CHAPTERS.map(([t, n]) => `<span style="left:${100 * t / FILM.DUR}%" title="${n}"></span>`).join('');
requestAnimationFrame(frame); load();
/* modo prueba */
window.__seek = (t, warm) => { FROZ = null; if (warm === undefined) warm = 30; for (let i = warm; i > 0; i--) drawFrame(t - i / 60, 1); FROZ = t; T = t; drawFrame(t, 0); };
window.__perf = (t, n = 30) => { const a = []; for (let i = 0; i < n; i++) { const t0 = performance.now(); drawFrame(t + i / 60, 1); a.push(performance.now() - t0); } a.sort((x, y) => x - y); return { med: a[n >> 1], max: a[n - 1] }; };
