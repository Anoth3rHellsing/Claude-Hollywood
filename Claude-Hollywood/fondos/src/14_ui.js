/* ---------- interfaz ---------- */
const $ = s => document.querySelector(s);
function buildUI() {
  const chips = $('#cities');
  CITIES.forEach((c, i) => { const b = document.createElement('button'); b.className = 'chip'; b.textContent = c.name; b.onclick = () => { if (UIS.mode === 'gira') { UIS.t = INTRO + i * D + .2; } else UIS.city = i; UIS.playing = true; }; chips.appendChild(b); });
  document.querySelectorAll('[data-mode]').forEach(b => b.onclick = () => { const m = b.dataset.mode; if (m !== 'gira' && UIS.mode === 'gira') { const inf = tourAt(UIS.t); UIS.city = inf.i; UIS.manualT = inf.lt * D; } if (m === 'gira' && UIS.mode !== 'gira') UIS.t = INTRO + UIS.city * D + UIS.manualT; UIS.mode = m; UIS.playing = true; });
  $('#play').onclick = () => { UIS.playing = !UIS.playing; if (UIS.mode === 'gira' && UIS.t >= TOTAL()) UIS.t = 0; };
  let drag = false;
  cv.addEventListener('pointerdown', e => { if (UIS.mode === 'comparar') { drag = true; cv.setPointerCapture(e.pointerId); move(e); } });
  const move = e => { if (!drag) return; const r = cv.getBoundingClientRect(); UIS.split = clamp((e.clientX - r.left) / r.width, .02, .98); };
  cv.addEventListener('pointermove', move); cv.addEventListener('pointerup', () => drag = false);
  $('#tl').addEventListener('pointerdown', e => { const r = e.currentTarget.getBoundingClientRect(), f = clamp((e.clientX - r.left) / r.width); if (UIS.mode === 'gira') UIS.t = f * TOTAL(); else UIS.manualT = f * D; });
  addEventListener('keydown', e => { if (e.code === 'Space') { e.preventDefault(); $('#play').click(); } if (e.key === 'ArrowRight') { if (UIS.mode === 'gira') UIS.t = Math.min(TOTAL(), UIS.t + 5); else UIS.manualT = (UIS.manualT + 2) % D; } if (e.key === 'ArrowLeft') { if (UIS.mode === 'gira') UIS.t = Math.max(0, UIS.t - 5); else UIS.manualT = (UIS.manualT - 2 + D) % D; } });
  let hideT = 0; const poke = () => { document.body.classList.add('ui'); clearTimeout(hideT); hideT = setTimeout(() => document.body.classList.remove('ui'), 2600); };
  addEventListener('pointermove', poke); poke();
}
let lastUI = '';
function updUI(i) {
  const key = UIS.mode + i + UIS.playing;
  if (key !== lastUI) { lastUI = key; document.querySelectorAll('.chip').forEach((b, k) => b.classList.toggle('on', k === i)); document.querySelectorAll('[data-mode]').forEach(b => b.classList.toggle('on', b.dataset.mode === UIS.mode)); $('#play').textContent = UIS.playing ? '❚❚' : '▶'; document.body.classList.toggle('cmp', UIS.mode === 'comparar'); }
  $('#bar').style.width = (UIS.mode === 'gira' ? UIS.t / TOTAL() : UIS.manualT / D) * 100 + '%';
}
buildUI(); sizeAll(); requestAnimationFrame(frame);
if (!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) && !location.search.includes('test')) UIS.playing = true;   /* sin sonido: puede arrancar sola */
/* modo prueba */
window.__shot = async (mode, i, lt, split) => {
  UIS.playing = false; UIS.mode = mode; UIS.city = i; UIS.manualT = lt * D; if (split !== undefined) UIS.split = split;
  await buildCity(i); if (mode === 'gira') UIS.t = INTRO + (i + lt) * D; render(); return true;
};
window.__perf = (n = 30) => { const a = []; for (let k = 0; k < n; k++) { const t0 = performance.now(); UIS.manualT = (UIS.manualT + 1 / 60) % D; render(); a.push(performance.now() - t0); } a.sort((x, y) => x - y); return { med: a[n >> 1], max: a[n - 1] }; };
window.__build = async i => { CACHE.delete(i); const t0 = performance.now(); await buildCity(i); return performance.now() - t0; };
document.title = document.title;   // listo
window.__ready = true;
