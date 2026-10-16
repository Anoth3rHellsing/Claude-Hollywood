/* =====================================================================
   BUCLE PRINCIPAL · POSTPROCESO · TEXTOS · CONTROLES
   ===================================================================== */
let EMA = 1 / 60, slowT = 0;
let T = 0, playing = false, ready = false, started = false, lastNow = 0, lastEvT = 0, buf = null, building = false;
const $ = s => document.querySelector(s);
const params = new URLSearchParams(location.search);

function sizeCanvas() {
  const iw = innerWidth, ih = innerHeight, dpr = devicePixelRatio || 1;
  const rs = Math.min(1.25, dpr, Math.sqrt(1.9e6 / (iw * ih)));
  W = Math.round(iw * rs); H = Math.round(ih * rs);
  cv.width = W; cv.height = H; cv.style.width = iw + 'px'; cv.style.height = ih + 'px';
  U = Math.min(H / 1000, W / 1500); SW = W / U;
  buf = mk(W, H);
  document.body.classList.toggle('portrait', ih > iw * 1.1);
}

async function build() {
  building = true; ready = false;
  const bar = $('#loadbar'), lbl = $('#loadpct');
  sizeCanvas();
  const tasks = buildTasks();
  for (let i = 0; i < tasks.length; i++) {
    tasks[i]();
    const p = Math.round((i + 1) / tasks.length * 100); bar.style.width = p + '%'; lbl.textContent = p + '%';
    await new Promise(r => setTimeout(r, 0));
  }
  for (const s of SC) s.on = false;
  building = false; ready = true;
  document.body.classList.add('ready');
}

/* ---------- render ---------- */
function render(dt) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; mode('source-over');
  ctx.drawImage(B.paper, 0, 0, W, H);
  SX = SHK ? (Math.random() - .5) * SHK * U : 0; SY = SHK ? (Math.random() - .5) * SHK * U : 0;
  FLASH = 0; CUT = null;
  for (const s of SC) {
    const act = T >= s.t0 && T <= s.t1;
    if (!act) { if (s.on) { s.on = false; s.exit && s.exit(); } continue; }
    if (!s.on) { s.on = true; s.enter && s.enter(T); }
    SA = fade(T, s.t0, s.t1, s.fi, s.fo); if (SA <= .002) continue;
    mode('multiply'); s.draw(T, dt);
  }
  SA = 1; ctx.globalAlpha = 1;
  SHK *= Math.pow(.03, dt);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  // corte de pantalla: el encuadre se parte en dos por la diagonal del espadazo
  if (CUT && CUT.k > .001) {
    const b = buf.getContext('2d'); b.globalCompositeOperation = 'copy'; b.drawImage(cv, 0, 0);
    mode('source-over'); ctx.drawImage(B.paper, 0, 0, W, H);
    const dx = Math.cos(CUT.a), dy = Math.sin(CUT.a), nx = -dy, ny = dx, cx = W / 2, cy = H / 2, BIG = W + H, sh = CUT.k * 26 * U, gp = CUT.k * 5 * U;
    for (const sd of [1, -1]) {
      ctx.save(); ctx.beginPath();
      ctx.moveTo(cx - dx * BIG, cy - dy * BIG); ctx.lineTo(cx + dx * BIG, cy + dy * BIG);
      ctx.lineTo(cx + dx * BIG + nx * BIG * sd, cy + dy * BIG + ny * BIG * sd); ctx.lineTo(cx - dx * BIG + nx * BIG * sd, cy - dy * BIG + ny * BIG * sd); ctx.closePath(); ctx.clip();
      ctx.drawImage(buf, dx * sh * sd + nx * gp * sd, dy * sh * sd + ny * gp * sd); ctx.restore();
    }
    mode('multiply'); ctx.strokeStyle = `rgba(176,20,34,${.9 * CUT.k})`; ctx.lineWidth = 3 * U; ctx.shadowColor = 'rgba(176,20,34,.8)'; ctx.shadowBlur = 14 * U;
    ctx.beginPath(); ctx.moveTo(cx - dx * BIG, cy - dy * BIG); ctx.lineTo(cx + dx * BIG, cy + dy * BIG); ctx.stroke(); ctx.shadowBlur = 0;
  }
  if (FLASH > 0) { mode('source-over'); ctx.fillStyle = `rgba(246,238,222,${clamp(FLASH)})`; ctx.fillRect(0, 0, W, H); }
  // textura del papel sobre la pintura + viñeta
  if (!LOWQ) { mode('soft-light'); ctx.globalAlpha = .55; ctx.drawImage(B.tex, 0, 0, W, H); ctx.globalAlpha = 1; }
  mode('multiply'); ctx.drawImage(B.vig, 0, 0, W, H);
  // franjas de cine
  if (W / H > 1.3) {
    const bk = eo(rg(T, .2, 3)) * (1 - eo(rg(T, 352, 358))), bh = 46 * bk;
    if (bk > 0) { mode('source-over'); L0(); ctx.save(); ctx.translate(0, -H / U / 2 - 60 + bh); dS(B.bars, 0, 0, 1, 0, .95); ctx.restore(); ctx.save(); ctx.translate(0, H / U / 2 + 60 - bh); ctx.scale(1, -1); dS(B.bars, 0, 0, 1, 0, .95); ctx.restore(); }
  }
  mode('source-over'); ctx.setTransform(1, 0, 0, 1, 0, 0);
}

/* ---------- textos (DOM) ---------- */
const box = { narr: '#narr', card: '#card', loc: '#loc', kanji: '#kanji' };
function updText() {
  for (const c of CUES) {
    const act = T >= c.t && T < c.t + c.d;
    if (act && !c.el) {
      const el = document.createElement('div'); el.className = 'cue ' + c.k; el.innerHTML = c.k.startsWith('kanji') ? [...c.x].map(ch => `<span>${ch}</span>`).join('') : c.x;
      $(box[c.k.split(' ')[0]]).appendChild(el); c.el = el;
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('show')));
    } else if (!act && c.el) {
      const el = c.el; c.el = null; el.classList.remove('show'); el.classList.add('gone'); setTimeout(() => el.remove(), 2200);
    }
  }
  const tt = $('#title');
  tt.classList.toggle('s1', T > 352); tt.classList.toggle('s2', T > 354.6); tt.classList.toggle('s3', T > 356.6); tt.classList.toggle('s4', T > 358.6); tt.classList.toggle('s5', T > 366); tt.classList.toggle('s6', T > 372);
}
function clearText() { for (const c of CUES) if (c.el) { c.el.remove(); c.el = null; } }

/* ---------- bucle ---------- */
function loop(nw) {
  requestAnimationFrame(loop);
  const raw = (nw - lastNow) / 1000 || 0, dt = Math.min(.05, raw); lastNow = nw;
  if (!ready) return;
  if (playing && raw < .5) { EMA = EMA * .97 + raw * .03; if (EMA > 1 / 38) { slowT += raw; if (slowT > 3 && !LOWQ) { LOWQ = true; } } else slowT = Math.max(0, slowT - raw * .5); }
  if (playing) {
    T = Math.min(END, T + dt);
    if (AU.ok && !AU.muted) for (const e of EV) if (e.t > lastEvT && e.t <= T) e.f();
    lastEvT = T;
  }
  render(started ? (playing ? dt : 0) : 0);
  if (started) { auBeds(playing ? T : -1, dt); updText(); updUI(); }
}

/* ---------- controles ---------- */
const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
function updUI() {
  $('#prog').style.width = (T / END * 100) + '%'; $('#time').textContent = `${fmt(T)} / ${fmt(END)}`;
  document.body.classList.toggle('paused', !playing);
}
function seek(t) {
  T = clamp(t, 0, END); lastEvT = T; clearText();
  for (const s of SC) s.on = false;
  CUT = null; SHK = 0;
}
function togglePlay(force) {
  playing = force ?? !playing;
  if (AU.ac) { if (playing) AU.ac.resume(); else AU.ac.suspend(); }
  if (playing && T >= END) { seek(0); }
  poke();
}
function start() {
  if (!ready || started) return;
  started = true; document.body.classList.add('started');
  try { auInit(); if (AU.ac && AU.ac.state === 'suspended') AU.ac.resume(); } catch (e) { }
  seek(0); togglePlay(true);
}
let pokeT = 0;
function poke() { document.body.classList.add('ui'); clearTimeout(pokeT); pokeT = setTimeout(() => { if (playing) document.body.classList.remove('ui'); }, 2600); }
function fullscreen() { const d = document, el = d.documentElement; try { if (!d.fullscreenElement) (el.requestFullscreen || el.webkitRequestFullscreen).call(el).catch?.(() => { }); else d.exitFullscreen(); } catch (e) { } }
function setMute(m) { AU.muted = m; if (AU.master) AU.master.gain.setTargetAtTime(m ? 0 : .85, AU.ac.currentTime, .1); $('#mute').classList.toggle('off', m); $('#mute').setAttribute('aria-pressed', m); }

function initUI() {
  $('#go').addEventListener('click', start);
  $('#play').addEventListener('click', () => togglePlay());
  $('#mute').addEventListener('click', () => setMute(!AU.muted));
  $('#fs').addEventListener('click', fullscreen);
  $('#replay').addEventListener('click', () => { seek(0); togglePlay(true); });
  const tl = $('#tl');
  const seekEv = e => { const r = tl.getBoundingClientRect(); seek(clamp((e.clientX - r.left) / r.width) * END); };
  let drag = false;
  tl.addEventListener('pointerdown', e => { drag = true; tl.setPointerCapture(e.pointerId); seekEv(e); });
  tl.addEventListener('pointermove', e => { if (drag) seekEv(e); });
  tl.addEventListener('pointerup', () => drag = false);
  for (const [t, n] of CHAPTERS) { const m = document.createElement('button'); m.className = 'chap'; m.style.left = (t / END * 100) + '%'; m.title = n; m.setAttribute('aria-label', 'Ir a ' + n); m.addEventListener('click', e => { e.stopPropagation(); seek(t); }); m.addEventListener('pointerdown', e => e.stopPropagation()); $('#tl').appendChild(m); }
  addEventListener('pointermove', poke); addEventListener('touchstart', poke, { passive: true });
  cv.addEventListener('click', () => { if (started) togglePlay(); });
  addEventListener('keydown', e => {
    if (!started) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); start(); } return; }
    if (e.key === ' ' || e.key === 'k') { e.preventDefault(); togglePlay(); }
    else if (e.key === 'ArrowRight') seek(T + 10); else if (e.key === 'ArrowLeft') seek(T - 10);
    else if (e.key === 'm') setMute(!AU.muted); else if (e.key === 'f') fullscreen();
    poke();
  });
  let rt = 0;
  addEventListener('resize', () => {
    clearTimeout(rt); rt = setTimeout(async () => {
      if (Math.abs(innerWidth * Math.min(1.25, devicePixelRatio) - W) < 40 && Math.abs(innerHeight * Math.min(1.25, devicePixelRatio) - H) < 40) return;
      const was = playing; if (was) togglePlay(false); document.body.classList.add('rebuild'); document.body.classList.remove('ready');
      await build(); seek(T); document.body.classList.remove('rebuild'); if (was) togglePlay(true);
    }, 450);
  });
}

/* ---------- arranque ---------- */
(async function boot() {
  cv = $('#cv'); ctx = cv.getContext('2d', { alpha: false });
  score(); EV.sort((a, b) => a.t - b.t);
  initUI();
  requestAnimationFrame(loop);
  await build();
  // modo prueba: ?t=segundos (captura de un fotograma)
  if (params.has('t')) {
    document.body.classList.add('test'); started = true; document.body.classList.add('started');
    const t = +params.get('t'), warm = +(params.get('w') || 1.5);
    seek(Math.max(0, t - warm)); playing = true; ready = false;
    const st = 1 / 30; for (let x = 0; x < warm; x += st) { T += st; render(st); }
    T = t; render(st); updText(); updUI(); playing = false;
    window.__seek = async (t2) => { seek(Math.max(0, t2 - warm)); playing = true; for (let x = 0; x < warm; x += st) { T += st; render(st); } T = t2; render(st); playing = false; updText(); updUI(); };
    window.__perf = (n = 60) => { const t0 = performance.now(); playing = true; for (let i = 0; i < n; i++) { T += 1 / 60; render(1 / 60); } playing = false; return (performance.now() - t0) / n; };
    document.title = 'ready';
  }
})();
