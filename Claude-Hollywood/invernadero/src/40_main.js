/* =====================================================================
   REPRODUCTOR: carga por pasos, bucle, pasos de física acumulados, modo prueba
   ===================================================================== */
const btn = document.getElementById('play'), bar = document.getElementById('bar'), chap = document.getElementById('chap');
/* resolución interna limitada (≤ 1920×1080): el detalle está en los sprites, no en los píxeles */
resize = function () {
  const r = cv.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
  let w = Math.max(320, Math.round(r.width * dpr)), h = Math.max(180, Math.round(r.height * dpr));
  const k = Math.min(1, 1920 / w, 1080 / h); w = Math.round(w * k); h = Math.round(h * k);
  if (w === W && h === H) return false;
  W = cv.width = w; H = cv.height = h; U = H / 1000; SW = W / U;
  PAPER = makePaper(W, H); FX = mk(W, H); fx = FX.getContext('2d'); PAPERPAT = null; VIG = null; POSTPAT = null; TINTA.tex = null;
  if (RAINT) RAINT.pat = null;
  return true;
};
let T = 0, PLAY = false, LASTF = performance.now(), ACCF = 0, FROZ = null, READY = false;
async function load() {
  const step = async (txt, f) => { btn.textContent = txt; await new Promise(r => setTimeout(r, 0)); f(); };
  resize();
  await step('Mezclando los pigmentos…', () => { GRAIN = makeGrain(); WASHTEX = makeWashTex(); BLOT = makeBlot(); });
  await step('Pintando el cielo de tormenta…', () => { SKY = makeSky(false); SKYC = makeSky(true); RAINT = makeRainTex(); TREES = makeTrees(); });
  await step('Pintando el muro de cristal…', () => { FWA = makeFarWall(false); });
  await step('Rompiendo el cristal…', () => { FWB = makeFarWall(true); });
  await step('Pintando las losas del suelo…', () => { FTN = floorTex(FLN); });
  await step('Pintando las losas del fondo…', () => { FTF = floorTex(FLF); FTL = floorTex(FLL, 'light'); RIV = rivTex(); });
  await step('Pintando mesas, macetas y frascos…', () => { TABLES = TABLE_AT.map(([, , sd, w], i) => makeTable(sd, w, i >= 4 && i < 8 ? 3 : 2)); JARS = jarSprites(); });
  if (typeof FILM.load === 'function') await step('Últimos retoques…', () => FILM.load());
  READY = true; btn.textContent = '▶ Ver la película (con sonido)'; btn.disabled = false;
  window.__ready = true;
}
function drawFrame(t, ticks) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; SHX = SHY = 0;
  FILM.draw(t, ticks);
}
function frame(now) {
  const dt = Math.min(.1, (now - LASTF) / 1000); LASTF = now;
  if (resize() && READY) { /* los sprites están en unidades de mundo: no hace falta repintarlos */ }
  let ticks = 0;
  if (PLAY) { T += dt; ACCF += dt; ticks = Math.min(4, Math.floor(ACCF * 60)); ACCF -= ticks / 60; if (T >= FILM.DUR) { T = FILM.DUR; PLAY = false; btn.hidden = false; btn.textContent = '↺ Ver otra vez'; } }
  if (READY) drawFrame(FROZ ?? T, ticks);
  bar.style.width = (100 * T / FILM.DUR) + '%';
  if (typeof auUpdate === 'function') auUpdate(T, PLAY);
  requestAnimationFrame(frame);
}
function start() {
  if (!READY) return;
  if (typeof auInit === 'function' && !AU.ac) try { auInit(); } catch (e) { console.warn(e); }
  if (AU.ac && AU.ac.state === 'suspended') AU.ac.resume();
  if (T >= FILM.DUR) { T = 0; AU.last = -1; SPR.clear(); FILM.reset && FILM.reset(); }
  PLAY = true; btn.hidden = true;
}
btn.onclick = start; btn.disabled = true;
cv.addEventListener('click', () => { if (btn.hidden) { PLAY = !PLAY; if (!PLAY) { btn.hidden = false; btn.textContent = '▶ Seguir'; } } });
addEventListener('keydown', e => {
  if (e.code === 'Space') { e.preventDefault(); PLAY ? (PLAY = false, btn.hidden = false, btn.textContent = '▶ Seguir') : start(); }
  if (e.key === 'r' || e.key === 'R') { T = 0; AU.last = -1; SPR.clear(); FILM.reset && FILM.reset(); }
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { T = clamp(T + (e.key === 'ArrowRight' ? 5 : -5), 0, FILM.DUR); AU.last = T; SPR.clear(); }
});
document.querySelector('.prog').addEventListener('pointerdown', e => { const r = e.currentTarget.getBoundingClientRect(); T = clamp((e.clientX - r.left) / r.width) * FILM.DUR; AU.last = T; SPR.clear(); });
if (chap && FILM.CHAPTERS) chap.innerHTML = FILM.CHAPTERS.map(([t, n]) => `<span style="left:${100 * t / FILM.DUR}%" title="${n}"></span>`).join('');
requestAnimationFrame(frame); load();
/* modo prueba */
window.__seek = (t, warm) => { FROZ = null; SPR.clear(); FILM.reset && FILM.reset(); if (warm === undefined) warm = 150; for (let i = warm; i > 0; i--) drawFrame(t - i / 60, 1); FROZ = t; drawFrame(t, 0); };
window.__perf = (t, n = 30) => { const a = []; for (let i = 0; i < n; i++) { const t0 = performance.now(); drawFrame(t + i / 60, 1); a.push(performance.now() - t0); } a.sort((x, y) => x - y); return { med: a[n >> 1], max: a[n - 1] }; };
