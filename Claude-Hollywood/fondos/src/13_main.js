/* =====================================================================
   REPRODUCTOR · gira por las ciudades, compone cada fotograma, compara estilos
   ===================================================================== */
const cv = document.getElementById('cv'), ctx = cv.getContext('2d');
const SCR = mk(4, 4), sctx = SCR.getContext('2d');            // capa auxiliar para teñir de noche
const BUFA = mk(4, 4), BUFB = mk(4, 4), REF = mk(4, 4);                        // los dos estilos (comparar)
const D = 18, INTRO = 4;                                       // segundos por ciudad
const CACHE = new Map();
let BUILDING = null, CURI = 0;

function sizeAll() {
  const r = cv.getBoundingClientRect(), dpr = Math.min(1.5, devicePixelRatio || 1);
  let w = Math.round(r.width * dpr), h = Math.round(r.height * dpr);
  const cap = Math.sqrt(2.2e6 / (w * h)); if (cap < 1) { w = Math.round(w * cap); h = Math.round(h * cap); }
  if (w === W && h === H) return false;
  cv.width = w; cv.height = h; for (const c of [SCR, BUFA, BUFB]) { c.width = w; c.height = h; }
  resizeTo(w, h); CS = U * 1.04; CACHE.clear(); return true;
}

/* ---------- construir una ciudad (los dos estilos), por pasos para no congelar ---------- */
async function buildCity(i, onp) {
  const city = CITIES[i];
  if (CACHE.has(i)) return CACHE.get(i);
  const W0 = W, H0 = H;
  seed(hashS(city.id)); const lays = city.build();
  const steps = lays.length * 2 + 6; let k = 0; const tick = async () => { k++; onp && onp(k / steps); await new Promise(r => setTimeout(r, 0)); };
  const B = { city, lays, wc: [], pp: [], sky: {}, clouds: { wc: [], pp: [] } };
  B.sky.wcD = skyWC(city, false); await tick(); B.sky.wcN = skyWC(city, true); await tick();
  B.sky.ppD = skyPaper(city, false); await tick(); B.sky.ppN = skyPaper(city, true); await tick();
  for (let c = 0; c < 4; c++) { B.clouds.wc.push(cloudSprite(city, 'wc', c)); B.clouds.pp.push(cloudSprite(city, 'pp', c)); } await tick();
  for (const L of lays) { B.wc.push(renderWC(L, city)); await tick(); B.pp.push(renderPaper(L, city)); await tick(); }
  await tick();
  if (W !== W0 || H !== H0) return null;   /* la pantalla cambió mientras se pintaba: se descarta */
  CACHE.set(i, B);
  for (const key of [...CACHE.keys()]) if (CACHE.size > 2 && key !== i && key !== CURI) CACHE.delete(key);
  return B;
}

/* ---------- cámara de capa: pantalla = mundo · s + o ---------- */
let CAM = { x: 0, y: 0, z: 1 };
function LT(p) { const zl = 1 + (CAM.z - 1) * p, s = U * zl; return { s, ox: W / 2 - CAM.x * p * s, oy: H / 2 - CAM.y * p * s }; }
function blit(g, img, box, T, sc = 1, dx = 0, dy = 0) { g.drawImage(img, T.ox + (box[0] + dx) * T.s, T.oy + (box[1] + dy) * T.s, (box[2] - box[0]) * T.s, (box[3] - box[1]) * T.s); }

/* ---------- un fotograma de una ciudad en un estilo ---------- */
function drawCity(g, B, style, lt, t) {
  const city = B.city, night = clamp(city.night(lt)), wc = style === 'wc';
  CAM = { x: lerp(city.pan[0], city.pan[1], eio(lt)), y: city.camY || 0, z: lerp(1, city.zoom ?? 1.04, eio(lt)) };
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  g.drawImage(PAPER, 0, 0, W, H);
  /* cielo (el de noche encima, fundido) */
  g.drawImage(wc ? B.sky.wcD : B.sky.ppD, 0, 0, W, H); if (night > .01) { g.globalAlpha = night; g.drawImage(wc ? B.sky.wcN : B.sky.ppN, 0, 0, W, H); g.globalAlpha = 1; }
  /* nubes que derivan */
  const cl = wc ? B.clouds.wc : B.clouds.pp, T0c = LT(.06);
  for (let i = 0; i < (city.clouds ?? 4); i++) { const sp = cl[i % cl.length], span = SW * 1.6 + 600, x = ((i * 523 + t * (6 + i * 2.5)) % span) - span / 2 - 300, y = (city.cloudY || [-420, -200])[0] + ((i * 97) % 1) * 0 + i * ((city.cloudY || [-420, -200])[1] - (city.cloudY || [-420, -200])[0]) / Math.max(1, (city.clouds ?? 4) - 1);
    g.globalAlpha = (1 - night * .6) * (city.cloudA ?? .9); g.drawImage(sp.c, T0c.ox + x * T0c.s - 20, T0c.oy + y * T0c.s - 20, sp.c.width * U / CS, sp.c.height * U / CS); }
  g.globalAlpha = 1;
  if (city.preLive) city.preLive(g, { style, t, lt, night, LT });
  B.lays.forEach((L, i) => {
    const T = LT(L.p), R0 = wc ? B.wc[i] : B.pp[i];
    let sway = 0; if (!wc && L.sway) sway = Math.sin(t * .6 + i * 1.3) * L.sway;
    g.save();
    if (sway) { const px = W / 2, py = T.oy + R0.box[3] * T.s; g.translate(px, py); g.rotate(sway); g.translate(-px, -py); }
    if (wc) drawTinted(g, R0.img, R0.box, T, night, L, city, .62);
    else {
      g.globalAlpha = .42; blit(g, R0.shadow, R0.box, T, 1, R0.off[0], R0.off[1]); g.globalAlpha = 1;
      blit(g, R0.under, R0.box, T); if (night > .01) { g.globalAlpha = night; blit(g, R0.glow, R0.box, T); g.globalAlpha = 1; }
      drawTinted(g, R0.img, R0.box, T, night, L, city, .55);
    }
    if (night > .01) { g.globalAlpha = night; if (wc) blit(g, R0.light, R0.box, T); else if (R0.flare) blit(g, R0.flare, R0.box, T); g.globalAlpha = 1; }
    g.restore();
    if (city.water && city.water.after === i) drawWater(g, city, style, t, night);
    if (city.live && city.live[i]) city.live[i](g, { style, t, lt, night, LT, T });
  });
  /* acabado: el grano del papel por encima de todo y la viñeta */
  g.setTransform(1, 0, 0, 1, 0, 0);
  if (wc) { g.globalCompositeOperation = 'multiply'; g.globalAlpha = .1; g.fillStyle = g.createPattern(GRAIN, 'repeat'); g.fillRect(0, 0, W, H); }
  else { g.globalCompositeOperation = 'soft-light'; g.globalAlpha = .35; g.fillStyle = g.createPattern(FIBER, 'repeat'); g.fillRect(0, 0, W, H); }
  g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
  const vg = g.createRadialGradient(W / 2, H * .45, H * .35, W / 2, H * .5, Math.hypot(W, H) * .62); vg.addColorStop(0, 'rgba(40,24,10,0)'); vg.addColorStop(1, `rgba(40,24,10,${wc ? .32 : .4})`); g.fillStyle = vg; g.fillRect(0, 0, W, H);
}
function drawTinted(g, img, box, T, night, L, city, k) {
  if (night < .02) { blit(g, img, box, T); return; }
  sctx.setTransform(1, 0, 0, 1, 0, 0); sctx.globalCompositeOperation = 'source-over'; sctx.globalAlpha = 1; sctx.clearRect(0, 0, W, H);
  const m = g.getTransform(); sctx.setTransform(m); blit(sctx, img, box, T); sctx.setTransform(1, 0, 0, 1, 0, 0);
  sctx.globalCompositeOperation = 'source-atop'; sctx.fillStyle = css(mixc(city.nightTint || [30, 36, 70], city.sky.night[1], L.haze * .7), night * k); sctx.fillRect(0, 0, W, H);
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(SCR, 0, 0); g.restore();
}

/* ---------- agua ---------- */
function drawWater(g, city, style, t, night) {
  const Wt = city.water, T = LT(Wt.p), wy = Math.max(0, Math.round(T.oy + Wt.y * T.s)); if (wy >= H) return;
  const c = mixc(Wt.c, Wt.cN || [30, 40, 70], night * .8), depth = H - wy;
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
  if (style === 'wc') {
    /* reflejo: la ciudad invertida, en baja resolución (suave como un lavado) y en franjas que ondulan */
    const rh = Math.min(wy, depth * 1.1), rw = Math.max(8, Math.round(W / 7)), rhp = Math.max(4, Math.round(rh / 7));
    if (REF.width !== rw || REF.height !== rhp) { REF.width = rw; REF.height = rhp; }
    const rg2 = REF.getContext('2d'); rg2.clearRect(0, 0, rw, rhp); rg2.drawImage(g.canvas, 0, wy - rh, W, rh, 0, 0, rw, rhp);
    const n = 40, hs = depth / n;
    for (let k = 0; k < n; k++) { const f = (k + .5) / n, sy = rhp * (1 - Math.min(1, f * depth / rh)), dx = Math.sin(t * 1.1 + k * .55) * (1.5 + k * .3) * U; if (sy <= 0) break; g.globalAlpha = .62 * (1 - f * .65); g.drawImage(REF, 0, Math.max(0, sy - rhp / n), rw, Math.max(1, rhp * hs / rh), dx, wy + k * hs, W, hs + 1); }
    /* trazos verticales: el pincel arrastrado que hace los reflejos */
    seed(31); g.globalCompositeOperation = 'multiply'; for (let i = 0; i < 40; i++) { const x = rnd(W), l = rnd(.2, .7) * depth; g.globalAlpha = rnd(.05, .14); g.fillStyle = css(shadeC(c, -.3)); g.fillRect(x, wy, rnd(2, 6) * U, l); }
    g.globalAlpha = 1; g.globalCompositeOperation = 'multiply';
    const gr = g.createLinearGradient(0, wy, 0, H); gr.addColorStop(0, css(shadeC(c, .25), .55)); gr.addColorStop(1, css(shadeC(c, -.2), .85)); g.fillStyle = gr; g.fillRect(0, wy, W, depth);
    g.globalAlpha = .4; g.fillStyle = g.createPattern(BLOT, 'repeat'); g.fillRect(0, wy, W, depth);
    g.globalCompositeOperation = 'source-over';
    /* brillos: papel que queda sin pintar entre pinceladas horizontales */
    seed(77); for (let i = 0; i < 70; i++) { const y = wy + Math.pow(R(), 1.4) * depth, l = rnd(10, 60) * U * (1 + (y - wy) / depth), x = ((rnd(W) + t * rnd(4, 14) * U) % (W + l)) - l; g.globalAlpha = rnd(.25, .6) * (1 - night * .5); g.fillStyle = css(PAPERC); g.fillRect(x, y, l, rnd(.8, 2) * U); }
    g.globalAlpha = .5; g.strokeStyle = css(INK, .5); g.lineWidth = .8 * U; for (let i = 0; i < 6; i++) { const y = wy + (i + .5) / 6 * depth * .9; g.beginPath(); for (let x = 0; x <= W; x += 20) g.lineTo(x, y + Math.sin(x * .01 + t * .8 + i) * 2 * U); g.stroke(); }
  } else {
    /* bandas de papel azul que se mecen, cada una con sombra sobre la anterior */
    const nb = 5;
    for (let i = 0; i < nb; i++) { const y0 = wy + depth * (i / nb) * .92 + Math.sin(t * .9 + i * 1.7) * 2.5 * U, col = mixc(shadeC(c, .18), shadeC(c, -.18), i / (nb - 1)), pts = [[0, H]];
      for (let x = 0; x <= W + 40; x += 40) pts.push([x, y0 + Math.sin(x * .012 + i * 2 + t * (.5 + i * .1)) * 3 * U]); pts.push([W, H]);
      g.save(); g.shadowColor = 'rgba(10,14,30,.35)'; g.shadowBlur = 5 * U; g.shadowOffsetY = -2 * U; g.fillStyle = css(col); g.fill(pathPolys([pts])); g.restore(); }
    /* reflejo del sol/luna y de las luces: tiras de papel claro */
    seed(91); const orb = night > .5 ? city.sky.moon : city.sky.sun;
    if (orb) { const T2 = LT(.06), ox = T2.ox + orb[0] * T2.s; for (let i = 0; i < 9; i++) { const y = wy + (i + .5) / 9 * depth * .8, w = (30 - i * 2) * U * rnd(.6, 1.2), x = ox + Math.sin(t * 1.3 + i) * 6 * U; g.globalAlpha = .7 - i * .05; g.fillStyle = css(shadeC(orb[3], .3)); g.fillRect(x - w / 2, y, w, 2.4 * U); } }
    if (night > .05 && Wt.lights) for (const lx of Wt.lights) { const Tl = LT(Wt.p), x = Tl.ox + lx * Tl.s; for (let i = 0; i < 5; i++) { g.globalAlpha = night * (.75 - i * .12); g.fillStyle = 'rgb(255,214,140)'; const w = rnd(8, 18) * U; g.fillRect(x - w / 2 + Math.sin(t * 2 + i + lx) * 3 * U, wy + 6 * U + i * 9 * U, w, 2 * U); } }
    g.globalAlpha = 1; g.globalCompositeOperation = 'soft-light'; g.globalAlpha = .4; g.fillStyle = g.createPattern(FIBER, 'repeat'); g.fillRect(0, wy, W, depth);
  }
  g.restore();
}

/* ---------- piezas vivas compartidas ---------- */
function liveShape(g, st, T, polys, col, o = {}) {   // un objeto pequeño que se mueve, pintado en el estilo
  g.save(); g.setTransform(T.s, 0, 0, T.s, T.ox, T.oy);
  const P = pathPolys(polys.map(orient));
  if (st.style === 'wc') { g.globalAlpha = .85; g.fillStyle = css(col); g.fill(P); g.globalAlpha = .7; g.strokeStyle = css(INK); g.lineWidth = .8; g.stroke(P); }
  else { g.shadowColor = 'rgba(20,14,10,.4)'; g.shadowBlur = 3 * T.s; g.shadowOffsetX = 2 * T.s; g.shadowOffsetY = 2.5 * T.s; g.fillStyle = css(col); g.fill(P); }
  g.restore();
}
function birds(g, st, n, y0, sp = 30, seedv = 3) {
  const T = LT(.15); g.save(); g.setTransform(T.s, 0, 0, T.s, T.ox, T.oy); seed(seedv);
  g.strokeStyle = st.style === 'wc' ? css(INK, .7) : 'rgba(30,26,30,.9)'; g.lineWidth = st.style === 'wc' ? 1.1 : 1.8; g.lineCap = 'round';
  for (let i = 0; i < n; i++) { const span = SW * 1.8, x = ((rnd(span) + st.t * sp * rnd(.7, 1.3)) % span) - span / 2 + CAM.x * .15, y = y0 + rnd(-60, 60) + Math.sin(st.t + i) * 6, f = Math.sin(st.t * 7 + i * 2) * 3, s = rnd(4, 8);
    g.beginPath(); g.moveTo(x - s, y - f); g.quadraticCurveTo(x - s * .4, y - s * .3, x, y); g.quadraticCurveTo(x + s * .4, y - s * .3, x + s, y - f); g.stroke(); }
  g.restore();
}
function rain(g, st, a = .3) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); seed(5); g.strokeStyle = st.style === 'wc' ? css([90, 96, 120], a) : css([210, 220, 236], a * 1.2); g.lineWidth = (st.style === 'wc' ? .8 : 1.3) * U; for (let i = 0; i < 160; i++) { const x = (rnd(W * 1.2) + st.t * 60 * U) % (W * 1.2) - W * .1, y = (rnd(H) + st.t * 700 * U * rnd(.8, 1.2)) % H; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 4 * U, y + 16 * U); g.stroke(); } g.restore(); }

/* ---------- títulos ---------- */
function titleCard(g, city, style, a, dark = false) {
  if (a <= .01) return;
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a;
  const x = 60 * U, y = 120 * U;
  if (style === 'wc') {
    if (dark) { g.shadowColor = 'rgba(10,8,20,.7)'; g.shadowBlur = 10 * U; }
    g.font = `italic 600 ${64 * U}px "Cormorant Garamond", Georgia, serif`; g.fillStyle = dark ? 'rgba(246,238,222,.95)' : 'rgba(40,28,26,.88)'; g.fillText(city.name, x, y);
    g.font = `500 ${20 * U}px "Cormorant Garamond", Georgia, serif`; g.fillStyle = dark ? 'rgba(232,222,204,.9)' : 'rgba(70,52,44,.85)'; g.fillText(`${city.country.toUpperCase()}   ·   ${city.coord}`, x + 4 * U, y + 34 * U);
    g.strokeStyle = 'rgba(150,40,40,.7)'; g.lineWidth = 2 * U; g.beginPath(); g.moveTo(x, y + 48 * U); g.lineTo(x + 220 * U * a, y + 48 * U); g.stroke();
  } else {
    g.font = `700 ${58 * U}px "Josefin Sans", "Futura", "Century Gothic", sans-serif`;
    g.shadowColor = 'rgba(20,14,10,.45)'; g.shadowBlur = 5 * U; g.shadowOffsetX = 3 * U; g.shadowOffsetY = 4 * U; g.fillStyle = 'rgb(250,244,230)'; g.fillText(city.name.toUpperCase(), x, y);
    g.shadowBlur = 3 * U; g.shadowOffsetX = 2 * U; g.shadowOffsetY = 2 * U; g.font = `600 ${18 * U}px "Josefin Sans", sans-serif`; g.fillStyle = css(city.accent || [190, 60, 50]);
    const label = `${city.country.toUpperCase()}  ·  ${city.coord}`, tw = g.measureText(label).width; g.fillRect(x, y + 18 * U, tw + 24 * U, 30 * U); g.shadowColor = 'transparent'; g.fillStyle = 'rgb(250,244,230)'; g.fillText(label, x + 12 * U, y + 39 * U);
  }
  g.restore();
}

/* ---------- gira: qué se ve en cada instante ---------- */
const UIS = { mode: 'gira', city: 0, split: .5, playing: false, t: 0, manualT: 0 };
const TOTAL = () => INTRO + CITIES.length * D + 6;
function tourAt(T) {   // → {i, lt, style, mix (0..1 papel), fade (negro), title}
  if (T < INTRO) return { intro: 1 - T / INTRO, i: 0, lt: 0 };
  const k = T - INTRO, i = Math.min(CITIES.length - 1, Math.floor(k / D)), lt = (k - i * D) / D;
  return { i, lt, mix: sm(rg(lt, .47, .56)), fade: Math.max(1 - rg(lt, 0, .05), rg(lt, .95, 1)) * (k > CITIES.length * D ? 1 : 1), title: Math.min(sm(rg(lt, .03, .08)), 1 - sm(rg(lt, .2, .26))) + Math.min(sm(rg(lt, .57, .6)), 1 - sm(rg(lt, .7, .76))), end: k >= CITIES.length * D };
}
/* desgarro: el papel recortado entra rasgando el papel de acuarela */
function tearPath(x, h, s) { const P = new Path2D(); P.moveTo(x, -10); for (let y = 0; y <= h + 10; y += 6) P.lineTo(x + N2(y * .02, s) * 26 * U + N2(y * .2, s + 3) * 5 * U, y); P.lineTo(W + 10, h + 10); P.lineTo(W + 10, -10); P.closePath(); return P; }
function composite(B, lt, t, mode, split) {
  if (mode === 'wc' || mode === 'pp') { drawCity(ctx, B, mode, lt, t); return; }
  /* gira (fundido rasgado) o comparar (divisor) */
  const x = split * W;
  if (x <= 1) { drawCity(ctx, B, 'pp', lt, t); return; } if (x >= W - 1) { drawCity(ctx, B, 'wc', lt, t); return; }
  drawCity(BUFA.getContext('2d'), B, 'wc', lt, t); drawCity(BUFB.getContext('2d'), B, 'pp', lt, t);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(BUFA, 0, 0);
  const P = mode === 'comparar' ? (() => { const p = new Path2D(); p.rect(x, 0, W - x, H); return p; })() : tearPath(x, H, 9);
  ctx.save(); ctx.clip(P); ctx.drawImage(BUFB, 0, 0); ctx.restore();
  ctx.save(); if (mode === 'comparar') { ctx.fillStyle = 'rgba(250,244,230,.95)'; ctx.fillRect(x - 1.5, 0, 3, H); ctx.beginPath(); ctx.arc(x, H / 2, 16, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(40,30,30,.8)'; ctx.font = `600 ${14}px sans-serif`; ctx.textAlign = 'center'; ctx.fillText('⇆', x, H / 2 + 5); }
  else { ctx.shadowColor = 'rgba(20,14,10,.5)'; ctx.shadowBlur = 10 * U; ctx.shadowOffsetX = -4 * U; ctx.strokeStyle = 'rgba(250,246,236,1)'; ctx.lineWidth = 5 * U; ctx.stroke(tearPath(x, H, 9)); }
  ctx.restore();
}
function introCard(a) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(PAPER, 0, 0, W, H);
  ctx.globalAlpha = a; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(40,28,26,.9)'; ctx.font = `italic 600 ${72 * U}px "Cormorant Garamond", Georgia, serif`; ctx.fillText('Atlas de ciudades', W / 2, H * .46);
  ctx.font = `500 ${24 * U}px "Cormorant Garamond", Georgia, serif`; ctx.fillStyle = 'rgba(80,60,50,.9)'; ctx.fillText('acuarela  ·  papel recortado', W / 2, H * .46 + 46 * U); ctx.textAlign = 'left'; ctx.globalAlpha = 1;
}

/* ---------- bucle ---------- */
let LAST = performance.now(), STATUS = '';
function frame(now) {
  const dt = Math.min(.1, (now - LAST) / 1000); LAST = now;
  if (sizeAll()) STATUS = '';
  if (UIS.playing) { if (UIS.mode === 'gira') UIS.t = Math.min(TOTAL(), UIS.t + dt); else UIS.manualT = (UIS.manualT + dt) % D; }
  render();
  requestAnimationFrame(frame);
}
function want(i) {
  if (CACHE.has(i)) return CACHE.get(i);
  if (!BUILDING) { BUILDING = buildCity(i, p => { STATUS = `Pintando ${CITIES[i].name}… ${Math.round(p * 100)}%`; }).then(() => { BUILDING = null; STATUS = ''; }); }
  return null;
}
function render() {
  let i, lt, mode, split = UIS.split, info = null;
  if (UIS.mode === 'gira') { info = tourAt(UIS.t); i = info.i; lt = info.lt; mode = 'gira'; split = 1 - info.mix; }
  else { i = UIS.city; lt = UIS.manualT / D; mode = UIS.mode; }
  CURI = i; updUI(i);
  if (info && info.intro !== undefined && info.intro > 0) { introCard(Math.min(1, info.intro * 2)); want(0); return; }
  const B = want(i);
  if (!B) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(PAPER, 0, 0, W, H); ctx.fillStyle = 'rgba(60,44,40,.85)'; ctx.font = `italic ${28 * U}px "Cormorant Garamond", Georgia, serif`; ctx.textAlign = 'center'; ctx.fillText(STATUS || 'Mezclando pigmentos…', W / 2, H / 2); ctx.textAlign = 'left'; return; }
  if (UIS.playing && !BUILDING && UIS.mode === 'gira' && lt > .3 && i + 1 < CITIES.length) want(i + 1);   // se prepara la siguiente
  composite(B, lt, UIS.mode === 'gira' ? UIS.t : UIS.manualT + i * 100, mode, split);
  if (info) {
    titleCard(ctx, B.city, lt < .5 ? 'wc' : 'pp', info.title, B.city.night(lt) > .45);
    if (info.fade > .001) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = info.fade; ctx.drawImage(PAPER, 0, 0, W, H); ctx.globalAlpha = 1; }
    if (info.end) introCard(rg(UIS.t - INTRO - CITIES.length * D, 0, 2));
  } else titleCard(ctx, B.city, mode === 'pp' ? 'pp' : 'wc', 1, B.city.night(lt) > .45);
}
