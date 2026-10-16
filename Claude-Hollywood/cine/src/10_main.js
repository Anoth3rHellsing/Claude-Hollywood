/* ---------- reproductor ---------- */
let T = 0, PLAY = false, LASTF = performance.now(), ACCF = 0, FROZ = null;
const btn = document.getElementById('play'), bar = document.getElementById('bar');
function frame(now) {
  const dt = Math.min(.1, (now - LASTF) / 1000); LASTF = now; resize();
  let ticks = 0;
  if (PLAY) { T += dt; ACCF += dt; ticks = Math.min(4, Math.floor(ACCF * 60)); ACCF -= ticks / 60; if (T >= FILM.DUR) { T = FILM.DUR; PLAY = false; btn.hidden = false; btn.textContent = '↺ Ver otra vez'; } }
  drawFilm(FROZ ?? T, ticks);
  bar.style.width = (100 * T / FILM.DUR) + '%';
  auUpdate(T, PLAY);
  requestAnimationFrame(frame);
}
function start() { if (!AU.ac) try { auInit(); } catch (e) { } if (AU.ac && AU.ac.state === 'suspended') AU.ac.resume(); if (T >= FILM.DUR) { T = 0; AU.last = -1; SPR.clear(); FILM.reset && FILM.reset(); } PLAY = true; btn.hidden = true; }
btn.onclick = start;
cv.addEventListener('click', () => { if (btn.hidden) { PLAY = !PLAY; if (!PLAY) { btn.hidden = false; btn.textContent = '▶ Seguir'; } } });
addEventListener('keydown', e => { if (e.code === 'Space') { e.preventDefault(); PLAY ? (PLAY = false, btn.hidden = false, btn.textContent = '▶ Seguir') : start(); } if (e.key === 'r' || e.key === 'R') { T = 0; AU.last = -1; SPR.clear(); FILM.reset && FILM.reset(); } });
GRAIN = makeGrain(); WASHTEX = makeWashTex(); HATCH = makeHatch(9, -.8, 1.3, 'rgba(52,50,62,.75)'); HATCH2 = makeHatch(5, -.8, 1.5, 'rgba(40,38,50,.9)');
resize(); requestAnimationFrame(frame);
window.__seek = (t, warm) => { FROZ = null; resize(); SPR.clear(); if (typeof FILM.reset === 'function') FILM.reset(); const sh = FILM.SHOTS.find(s => t >= s.t0 && t < s.t1); if (warm === undefined) warm = Math.min(420, Math.round(((sh ? t - sh.t0 : 1)) * 60) + 4); for (let i = warm; i > 0; i--) drawFilm(t - i / 60, 1); FROZ = t; drawFilm(t, 0); };
window.__perf = (t, n = 30) => { const a = []; for (let i = 0; i < n; i++) { const t0 = performance.now(); drawFilm(t + i / 60, 1); a.push(performance.now() - t0); } a.sort((x, y) => x - y); return { med: a[n >> 1], max: a[n - 1] }; };
