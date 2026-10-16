/* =====================================================================
   CLAUDE HOLLYWOOD 101 · la película: voz, coreografía de Aguada, planos por bloque, subtítulos
   B0 Apertura · B1 Todo es código · B2 La acuarela · B3 Lo que ya hicimos · B4 El mundo reacciona · B5 El sonido · B6 Tu turno
   ===================================================================== */
/* cuándo empieza cada línea de voz (la duración real sale del audio) */
const VO = [['L01', 5.0], ['L02', 16.4], ['L03', 30.6], ['L04', 41.8], ['L05', 57.0], ['L06', 68.6], ['L07', 81.0], ['L08', 90.5], ['L09', 98.3],
  ['L10', 112.0], ['L11', 120.6], ['L12', 136.6], ['L13', 141.4], ['L14', 151.5], ['L15', 161.0], ['L16', 172.5], ['L17', 182.0], ['L18', 192.8]];
const CHAPTERS = [[0, 'Apertura'], [29.6, 'Todo es código'], [55.6, 'La acuarela'], [89.5, 'Lo que ya hicimos'], [111, 'El mundo reacciona'], [150.5, 'El sonido'], [171.5, 'Tu turno']];
const FREEZE0 = 29.6, FREEZE1 = 54.4, REBUILD_T0 = 48.6, REBUILD_DT = .72;
const REBUILD_LABELS = ['cielo y bosque', 'muro de cristal', 'techo y columnas', 'suelo y charcos', 'plantas y mesas', 'Aguada', 'la luz'];
const AG_HOPS = [5.15, 25.5, 62.4, 64.1, 65.8, 132.45, 192.9, 194.7];
/* palabras escritas a mano en la apertura (y tachadas) */
const NOTES_INK = [[17.25, 'cámara', -560, -230, 1], [18.45, 'actores', -610, -90, 1], [19.75, 'dibujos guardados', -520, 50, 1], [22.55, '{ código }', 480, -200, 0]];
/* ---------- coreografía de Aguada ---------- */
const WALKS = [[90.6, 93.6, -440, 0, 700, 700], [119.6, 125.2, -820, -185, 565, 565]];
/* la caja de cultivo: [instante en que aterriza, tapa] (la melodía) */
const CF_SEQ = [[150.9, 0], [151.95, 2], [152.5, 4], [158.0, 5], [158.4, 3], [158.8, 1], [159.5, 2], [159.9, 4], [160.3, 6], [166.9, 0], [167.35, 2], [167.8, 4], [168.25, 6], [168.9, 4], [169.35, 5], [170.0, 6]];
CFHITS = CF_SEQ.map(([t, j]) => [t, j]);
const TK_HOPS = [[173.2, [600, -300]], [183.6, null, 0], [184.6, null, 1], [185.8, null, 2], [187.4, [640, 260]]];
function voiceEnv(t) { const v = voiceAt(t); if (!v) return 0; const E = VOICE[v[0]].env, i = Math.floor((t - v[1]) * 30); return E[i] || 0; }
function agLook(t) {
  const sp = voiceEnv(t), blink = (t * .41 + .3) % 1 < .045 || (t > 25.4 && t < 25.55);
  return { blink, slosh: sp > .3 ? (Math.floor(t * 9) % 2 ? 1 : -1) : (Math.floor(t * 1.6) % 2 ? 1 : -1) };
}
function hopY(t, h = 34) { let y = 0; for (const th of AG_HOPS) { const d = t - th; if (d > 0 && d < .42) y = Math.max(y, Math.sin(d / .42 * PI) * h); } return y; }
function agAt(t) {
  if (t < 4.2) return { hide: true };
  const f = agLook(t);
  if (t < FREEZE0) return { x: -60, z: 640, y: hopY(t), f, appear: clamp((t - 4.2) / .6) };
  if (t < 55.6) { const tf = t < FREEZE1 ? FREEZE0 : t; return { x: -60, z: 640, y: 0, f: agLook(tf) }; }
  if (t < 81.2) return { insert: true, f };
  if (t < 111) {
    const W_ = WALKS[0]; if (t < W_[0]) return { x: -440, z: 700, y: 0, f };
    if (t < W_[1]) { const u = (t - W_[0]) / (W_[1] - W_[0]), st = Math.floor((t - W_[0]) / .25); return { x: lerp(W_[2], W_[3], u), z: lerp(W_[4], W_[5], u), y: (st % 2) * AG_CELL, f: { ...f, legL: st % 2 ? 0 : 1, legR: st % 2 ? 1 : 0 }, walk: true, step: st }; }
    return { x: 0, z: 700, y: 0, f };
  }
  if (t < 150.5) {
    const W_ = WALKS[1];
    if (t < W_[0]) return { x: -820, z: 565, y: 0, f };
    if (t < W_[1]) { const u = (t - W_[0]) / (W_[1] - W_[0]), st = Math.floor((t - W_[0]) / .25); return { x: lerp(W_[2], W_[3], u), z: 565, y: (st % 2) * AG_CELL, f: { ...f, legL: st % 2 ? 0 : 1, legR: st % 2 ? 1 : 0 }, walk: true, step: st }; }
    const st = { x: -185, z: 565, y: hopY(t, 46), f: { ...f } };
    if (t > 125.3 && t < 125.75) st.sq = 1 - .14 * Math.sin((t - 125.3) / .45 * PI);
    if (t >= 125.75 && t < T_THROW) st.f.stone = true;
    if (t > 128.5 && t < T_THROW) { st.sq = .9; st.x -= 6; }
    if (t >= T_THROW && t < T_THROW + .25) st.sq = 1.1;
    if (t > 132.5 && t < 141.5) st.f.sweat = true;
    if (t > 136.5 && t < 139.5) { st.f.look = -1; st.sq = .94; }
    return st;
  }
  if (t < 171.5) {   /* sobre la caja de cultivo, de tapa en tapa */
    let i = 0; while (i < CF_SEQ.length - 1 && t >= CF_SEQ[i + 1][0] - .32) i++;
    const [tl, j] = CF_SEQ[i], L = CFL[j], top = 28 + L.h * .62, nxt = CF_SEQ[i + 1];
    if (nxt && t >= nxt[0] - .32) { const u = (t - (nxt[0] - .32)) / .32, L2_ = CFL[nxt[1]], top2 = 28 + L2_.h * .62; return { x: lerp(L.x, L2_.x, u), z: CFZ - 10, y: lerp(top, top2, u) + Math.sin(u * PI) * 46, f }; }
    const land = t - tl, sq = land > 0 && land < .16 ? 1 - .12 * Math.sin(land / .16 * PI) : 1;
    return { x: L.x, z: CFZ - 10, y: top, f, sq };
  }
  if (t < 191.6) return { insert: true, f };
  return { x: 0, z: 640, y: hopY(t, 40), f };
}
/* ---------- cámara por fotogramas clave (transiciones suaves) ---------- */
function camKeys(t, K) {
  if (t <= K[0][0]) return K[0][1];
  for (let i = 0; i < K.length - 1; i++) { const [a, A] = K[i], [b, B] = K[i + 1]; if (t < b) { const u = eio((t - a) / (b - a)); const o = {}; for (const k of ['x', 'y', 'zoom', 'ty']) o[k] = lerp(A[k] ?? (k === 'zoom' ? 1 : k === 'y' ? -150 : 0), B[k] ?? (k === 'zoom' ? 1 : k === 'y' ? -150 : 0), u); return o; } }
  return K[K.length - 1][1];
}
const CAM_B0 = [[2, { x: -150, zoom: 1.0, ty: 20 }], [9.6, { x: -70, zoom: 1.45, ty: 50 }], [11.2, { x: -60, y: -62, zoom: 2.5, ty: -10 }], [15.8, { x: -60, y: -62, zoom: 2.55, ty: -10 }], [17.6, { x: -40, zoom: 1.35, ty: 40 }], [29.6, { x: -30, zoom: 1.45, ty: 45 }]];
const CAM_B1 = [[30.4, { x: -30, zoom: 1.45, ty: 45 }], [33, { x: -60, zoom: 1.0, ty: 30 }], [38.5, { x: 420, y: -470, zoom: .95, ty: 120 }], [44, { x: -420, y: -300, zoom: 1.0, ty: 80 }], [48.2, { x: -60, zoom: 1.05, ty: 30 }]];
const CAM_B3 = [[89.5, { x: -300, y: -130, zoom: 1.15, ty: 20 }], [97.4, { x: -60, y: -160, zoom: 1.0, ty: 20 }], [99.0, { x: -620, y: -420, zoom: 2.15, ty: 0 }], [100.3, { x: -600, y: -420, zoom: 2.2, ty: 0 }], [101.3, { x: 0, y: -420, zoom: 2.15, ty: 0 }], [103.1, { x: 10, y: -420, zoom: 2.2, ty: 0 }], [104.1, { x: 620, y: -420, zoom: 2.15, ty: 0 }], [106.6, { x: 630, y: -420, zoom: 2.2, ty: 0 }], [109, { x: 0, y: -200, zoom: 1.05, ty: 0 }], [111, { x: 0, y: -200, zoom: 1.07, ty: 0 }]];
/* ---------- el mundo con todo lo que vive en él ---------- */
const WT = t => (t > FREEZE0 && t < FREEZE1) ? FREEZE0 : (t > 141.6 && t < 150.5) ? Math.min(136.5, T_WALL + (t - 141.6) * .42) : t;
function worldItems(t, ag, o = {}) {
  return (put) => {
    if (t > 80) put(EASEL.z, () => drawEasel(t));
    put(SCR_Z, () => hangingScreens(t));
    put(POST.z - 1, () => drawPost(t));
    const sq = stoneAt(t, ag || { x: -185, z: 565 }); if (sq) put(sq[2] - 2, () => drawStone(sq));
    if (t > 150 && t < 171.6) put(CFZ, () => coldFrame(t));
    if (ag && !ag.hide && !ag.insert) put(ag.z - .5, () => agDraw(ag));
  };
}
function drawWorld(t, cam, o = {}) {
  const wt = o.wt ?? WT(t), ag = o.ag !== undefined ? o.ag : agAt(t);
  camSet(cam); WIND.x = windAt(wt) * .8; FILM.agNow = ag && !ag.insert ? ag : null;
  drawSet(wt, { stage: o.stage, props: worldItems(wt, ag), items: o.items, floorFx: t2 => floorLeaves(t2),
    fx: t2 => { sunRays(t2, o.rays ?? 1); dustCloud(t2); shardsFx(t2, o.trails || 0); leavesFall(t2, o.leaves ?? 1); if (t > 150 && t < 171.6) notesFx(t2); if (o.fx) o.fx(t2); } });
}
/* ---------- planos especiales ---------- */
function titleCard(t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(PAPER, 0, 0, W, H); ctx.restore(); L0s();
  const a = sm((t - .3) / 1.2);
  ctx.save(); ctx.globalAlpha = a; hand('Claude Hollywood 101', 0, -40, 110, 'rgba(36,28,24,.92)', { serif: true, w: 500 });
  ctx.globalAlpha = sm((t - 1.1) / 1); hand('una clase con Aguada', 0, 50, 46, 'rgba(176,24,38,.8)');
  ctx.restore(); T0();
}
/* palabras a mano que se escriben y se tachan (B0) */
function inkNotes(t) {
  L0s();
  for (const [t0, txt, x, y, cross] of NOTES_INK) {
    const a = win(t, t0, 28.8, .35, .6); if (a < .01) continue;
    ctx.save(); ctx.globalAlpha = a; typeIn(txt, x, y, t, t0, .45, 54, 'rgba(36,40,92,.88)', { align: 'left' });
    if (cross) { const cf = clamp((t - t0 - .6) / .35), wdt = ctx.measureText(txt).width; if (cf > 0) { ctx.strokeStyle = 'rgba(176,24,38,.9)'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - 8, y - 14); ctx.lineTo(x - 8 + (wdt + 16) * cf, y - 22 + Math.sin(cf * 3) * 4); ctx.stroke(); } }
    ctx.restore();
  }
  /* «Aguada» con una flecha que la señala */
  const a = win(t, 25.3, 28.9, .3, .6);
  if (a > .01) { const ag = agAt(t), [fx, fy] = agFoot(ag), p = [(fx - W / 2) / U, (fy - H / 2) / U - AG_CH * agCell(ag.z) / U];
    ctx.save(); ctx.globalAlpha = a; const lx = p[0] + 230, ly = p[1] - 120; typeIn('Aguada', lx, ly, t, 25.3, .5, 64, 'rgba(176,24,38,.92)', { align: 'left' });
    if (t > 26.4) typeIn('tacita con boina', lx + 6, ly + 50, t, 26.4, .7, 40, 'rgba(36,40,92,.85)', { align: 'left' });
    ctx.strokeStyle = 'rgba(176,24,38,.85)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(lx - 14, ly - 14); ctx.quadraticCurveTo(lx - 90, ly - 40, p[0] + 50, p[1] - 10); ctx.stroke(); ctx.restore(); }
  T0();
}
/* «soy de píxeles»: la cuadrícula del sprite aparece encima, como bajo una lupa */
function pixelGrid(ag, a) {
  if (a < .01 || !ag || ag.hide) return; const [fx, fy] = agFoot(ag), cell = Math.max(1, Math.round(agCell(ag.z)));
  const x0 = Math.round(fx - 8.5 * cell), y0 = Math.round(fy - AG_CH * cell);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; ctx.strokeStyle = 'rgba(36,40,92,.55)'; ctx.lineWidth = 1; ctx.beginPath();
  for (let i = 0; i <= AG_CW; i++) { ctx.moveTo(x0 + i * cell + .5, y0); ctx.lineTo(x0 + i * cell + .5, y0 + AG_CH * cell); }
  for (let j = 0; j <= AG_CH; j++) { ctx.moveTo(x0, y0 + j * cell + .5); ctx.lineTo(x0 + AG_CW * cell, y0 + j * cell + .5); }
  ctx.stroke(); ctx.font = `600 ${Math.round(34 * U)}px "Caveat", cursive`; ctx.fillStyle = 'rgba(36,40,92,.9)'; ctx.fillText('22 × 22 píxeles', x0 + AG_CW * cell + 12 * U, y0 + 40 * U); ctx.restore(); T0();
}
/* B5: el viento (trazos de tinta), la música (pentagrama con las notas que suenan), la voz (onda que sale de Aguada) */
function windInk(t, a) {
  if (a < .01) return; L0s(); ctx.save(); ctx.lineCap = 'round';
  for (let i = 0; i < 9; i++) { const ph = ((t * .45 + hsh(i, 1)) % 1), x0 = lerp(-SW / 2 - 300, SW / 2, ph), y0 = -330 + hsh(i, 2) * 520, pts = []; for (let k = 0; k <= 24; k++) { const u = k / 24; pts.push([x0 + u * 420, y0 + Math.sin(u * 5 + t * 2 + i) * 18 - u * 20]); }
    ctx.strokeStyle = `rgba(70,80,110,${.45 * a * Math.sin(ph * PI)})`; ctx.lineWidth = 2.4; ctx.stroke(pLine(pts)); const e = pts[24]; ctx.beginPath(); ctx.arc(e[0] - 10, e[1] - 12, 12, -PI / 2, PI * .8); ctx.stroke(); }
  ctx.restore(); T0();
}
function staffInk(t, a) {
  if (a < .01) return; L0s(); ctx.save(); const y0 = -390, sp = 16, ys = k => y0 + k * sp, wav = x => Math.sin(x * .004 + t * .4) * 10;
  ctx.globalAlpha = a; ctx.strokeStyle = 'rgba(60,40,96,.5)'; ctx.lineWidth = 1.6;
  for (let k = 0; k < 5; k++) { ctx.beginPath(); for (let x = -SW / 2 + 40; x <= SW / 2 - 40; x += 20) { const y = ys(k) + wav(x); x === -SW / 2 + 40 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); }
  hand('𝄞', -SW / 2 + 70, ys(4) + 14, 92, 'rgba(60,40,96,.7)', { serif: true });
  CF_SEQ.forEach(([th, j], i) => { if (t < th) return; const x = -SW / 2 + 180 + i * ((SW - 300) / CF_SEQ.length), y = ys(4) - (j + 1) * sp * .5 + wav(x), al = sm((t - th) / .15);
    ctx.globalAlpha = a * al; ctx.fillStyle = 'rgba(60,40,96,.9)'; ctx.beginPath(); ctx.ellipse(x, y, 9, 6.5, -.4, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(60,40,96,.9)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 8, y); ctx.lineTo(x + 8, y - 44); ctx.stroke(); });
  ctx.restore(); T0();
}
function voiceRibbon(t, ag, a) {
  if (a < .01 || !ag) return; const [fx, fy] = agFoot(ag), cell = Math.max(1, Math.round(agCell(ag.z))), v = voiceAt(t);
  const left = fx > W * .55, dir = left ? -1 : 1, ox = left ? fx - 12 * cell : fx + 14 * cell, oy = fy - 14 * cell;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a;
  for (let i = 0; i < 70; i++) { const tt = t - i * .04, e = (voiceAt(tt) ? voiceEnv(tt) : 0), x = ox + dir * i * cell * 1.2, h = Math.max(1, Math.round(e * 9)) * cell; ctx.fillStyle = `rgba(36,40,92,${.85 * (1 - i / 70)})`; ctx.fillRect(Math.round(x / cell) * cell, Math.round((oy - h / 2) / cell) * cell, cell, h); }
  ctx.font = `600 ${Math.round(40 * U)}px "Caveat", cursive`; ctx.fillStyle = 'rgba(176,24,38,.9)'; ctx.textAlign = left ? 'right' : 'left'; ctx.fillText('mi voz · ElevenLabs', ox + dir * 8 * cell, oy - 9 * cell);
  ctx.restore(); T0();
}
/* temblor */
const SHAKES = [[T_HIT, 3, 8], [T_WALL, 10, 3.5], [T_WALL + 1.4, 4, 5], [184.0, 3, 9], [185.1, 3, 9], [186.3, 3, 9]];
function shakeAt(t) { let sx = 0, sy = 0; for (const [t0, a, d] of SHAKES) { const dt = t - t0; if (dt < 0 || dt > 2.5) continue; const e = a * Math.exp(-dt * d); sx += Math.sin(dt * 61) * e; sy += Math.cos(dt * 47) * e; } return [sx, sy]; }
/* fondo del tiquete: el invernadero en ese instante, pintado una vez */
let TKBG = null;
function tkBg() {
  if (!TKBG || TKBG.width !== W) { TKBG = mk(W, H); drawWorld(171.5, { x: 0, zoom: 1.1, ty: 40 }, { ag: null }); post(171.5); TKBG.getContext('2d').drawImage(cv, 0, 0); }
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(TKBG, 0, 0); T0();
}
function ticketScene(t) {
  ticketDraw(t, tkBg);
  /* Aguada salta por el tiquete y sella los modos */
  const cell = Math.round(H / 120); let pos = [600, -300], prev = pos, tl = -1;
  for (const [th, p, mi] of TK_HOPS) { const q = p || [modeBox(mi)[0], modeBox(mi)[1] + 10]; if (t >= th - .4) { prev = pos; pos = q; tl = th; } }
  let p = pos, y = 0;
  if (t < tl) { const u = clamp((t - (tl - .4)) / .4); p = L2(prev, pos, u); y = Math.sin(u * PI) * 120; }
  if (t < 172.8) return;
  const slideY = (1 - easeOut((t - 172.8) / .5)) * 400;
  agBlit(agCanvas(agLook(t)), W / 2 + p[0] * U, H / 2 + (p[1] - y + slideY) * U, cell);
}
function paintScene(t) {
  paintDemo(t);
  const cell = Math.round(H / 105), hop = Math.max(0, ...[57.6, 62.4, 64.1, 65.8].map(th => (t > th && t < th + .4) ? Math.sin((t - th) / .4 * PI) : 0));
  agBlit(agCanvas(agLook(t)), W / 2 + (-SW / 2 + 150) * U, H * .93 - hop * cell * 8, cell);
}
/* ---------- la película ---------- */
const FILM = {
  DUR: 206, CHAPTERS, SUBS: [], agNow: null,
  load() {
    for (const [id, s] of VO) for (const [a, b, txt] of VOICE[id].subs) FILM.SUBS.push([s + a, s + b + .3, txt, false]);
    floorLeavesInit(); stepsInit(); paintInit(); screensLoad();
  },
  draw(t, ticks) {
    const [sx, sy] = shakeAt(t); SHX = sx * U; SHY = sy * U; T0();
    if (t < 2.0) titleCard(t);
    else if (t < 29.6) {
      const scene = () => { drawWorld(t, camKeys(t, CAM_B0)); post(t); };
      inkWipe(() => titleCard(t), scene, clamp((t - 2.0) / 4.4), 'open', 'center', .47, .62);
      inkNotes(t);
    } else if (t < 55.6) {
      const ag = agAt(t), cam = camKeys(t, CAM_B1);
      const painted = () => { drawWorld(t, cam, { ag }); post(t); };
      const skel = () => { camSet(cam); worldState(WT(t)); drawSkeleton(t, t < 47.2 ? clamp((t - 30.4) / 2.5) : 1 - clamp((t - 47.2) / 1.2), ag); skAxes(ag, win(t, 33.4, 46.6, .6, .6)); skFormula(win(t, 34.6, 47.2, .8, .6)); };
      if (t < 30.4) painted();
      else if (t < 32.8) inkWipe(painted, skel, (t - 30.4) / 2.4, 'skel', 'sweep');
      else if (t < REBUILD_T0) skel();
      else { const k = Math.floor((t - REBUILD_T0) / REBUILD_DT), stage = k >= 6 ? 9 : k + 1; camSet(cam); drawWorld(t, cam, { ag, stage }); if (stage >= 9) post(t); }
      if (t > 29.6 && t < 30.6) { L0s(); ctx.save(); ctx.globalAlpha = win(t, 29.6, 30.6, .1, .3); hand('‖', SW / 2 - 90, -390, 80, 'rgba(176,24,38,.85)', { serif: true }); ctx.restore(); T0(); }
      const lab = t >= REBUILD_T0 && t < REBUILD_T0 + 7 * REBUILD_DT + .6 ? REBUILD_LABELS[Math.min(6, Math.floor((t - REBUILD_T0) / REBUILD_DT))] : '';
      frameCounter(t, 41.8, win(t, 41.8, 54.4, .4, .5), lab);
    } else if (t < 89.5) {
      const world = () => { const ag = agAt(Math.max(t, 81.2)); drawWorld(t, t < 81.2 ? { x: -60, zoom: 1.05, ty: 30 } : camKeys(t, [[81.2, { x: -500, y: -110, zoom: 1.75, ty: 0 }], [83.4, { x: -500, y: -110, zoom: 1.75, ty: 0 }], [89.5, { x: -300, y: -130, zoom: 1.15, ty: 20 }]]), { ag: t < 81.2 ? agAt(55) : ag }); post(t); };
      if (t < 56.8) inkWipe(world, () => paintScene(t), (t - 55.6) / 1.2, 'paint', 'center', .5, .5);
      else if (t < 81.2) paintScene(t);
      else if (t < 83.4) {   /* la hoja se encoge hasta el caballete */
        const e = eio((t - 81.2) / 2.2); paintScene(Math.min(t, 80.5)); BUFB.getContext('2d').drawImage(cv, 0, 0);
        world(); const r = easelRect(), x = lerp(-SW / 2, r[0], e), y = lerp(-500, r[1], e), w = lerp(SW, r[2], e), h = lerp(1000, r[3], e);
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1 - sm((e - .75) / .25); ctx.drawImage(BUFB, (x + SW / 2) * U, (y + 500) * U, w * U, h * U); ctx.restore(); T0();
      } else world();
    } else if (t < 111) {
      drawWorld(t, camKeys(t, CAM_B3), { leaves: .6 }); post(t);
    } else if (t < 150.5) {
      let cam; const ag = agAt(t);
      if (t < 119.4) cam = { x: -760, y: -42, zoom: 2.4, ty: 10 };
      else if (t < 125.4) cam = { x: ag.x + 60, y: -42, zoom: 2.2, ty: 15 };
      else if (t < T_THROW) cam = { x: -150, y: -36, zoom: 2.8, ty: 0 };
      else if (t < 136) cam = camKeys(t, [[T_THROW, { x: 190, y: -170, zoom: 1.0, ty: 30 }], [T_HIT + .2, { x: 220, y: -170, zoom: 1.0, ty: 30 }], [T_WALL - .3, { x: 560, y: -230, zoom: 1.3, ty: 20 }], [136, { x: 590, y: -230, zoom: 1.36, ty: 20 }]]);
      else if (t < 141.4) cam = { x: -150, y: -36, zoom: 2.7, ty: 0 };
      else cam = camKeys(t, [[141.4, { x: 600, y: -260, zoom: 1.75, ty: 10 }], [150.5, { x: 620, y: -260, zoom: 1.85, ty: 10 }]]);
      const trails = t > 141.4 ? win(t, 142.4, 150.5, 1, .3) : 0;
      drawWorld(t, cam, { trails, leaves: 1.2 }); post(t);
      pixelGrid(ag, win(t, 113.2, 116.6, .4, .5));
      if (t > 141.4) { L0s(); ctx.save(); ctx.globalAlpha = win(t, 141.6, 150.4, .4, .3); hand('cámara lenta ×0,4', SW / 2 - 70, -410, 40, 'rgba(176,24,38,.85)', { align: 'right' }); ctx.globalAlpha = win(t, 145.6, 150.4, .6, .3); hand('y = y₀ + v·t + ½·g·t²', -SW / 2 + 80, -400, 50, 'rgba(36,40,92,.9)', { align: 'left' }); ctx.restore(); T0(); }
    } else if (t < 171.5) {
      const ag = agAt(t), cam = camKeys(t, [[150.5, { x: -45, y: -75, zoom: 1.32, ty: 70 }], [171.5, { x: -45, y: -75, zoom: 1.38, ty: 70 }]]);
      drawWorld(t, cam, { leaves: t > 152.8 && t < 158 ? 2.2 : 1 }); post(t);
      windInk(t, win(t, 154.0, 158.6, .5, .8)); staffInk(t, win(t, 155.2, 171.3, .8, .4)); voiceRibbon(t, ag, win(t, 161.0, 166.6, .3, .4));
    } else if (t < 191.6) {
      const world = (tt) => { drawWorld(tt, camKeys(tt, [[189.4, { x: 0, zoom: 1.1, ty: 40 }], [196.6, { x: 0, zoom: 1.22, ty: 50 }]]), { ag: agAt(191.6) }); post(tt); };
      if (t < 172.6) inkWipe(() => world(171.5), () => ticketScene(t), (t - 171.5) / 1.1, 'tk', 'center', .5, .45);
      else if (t < 189.4) { ticketScene(t); brushSweep(t); }
      else inkWipe(() => { ticketScene(t); brushSweep(t); }, () => world(t), (t - 189.4) / 2.2, 'fin', 'sweep');
    } else {
      drawWorld(t, camKeys(t, [[191.6, { x: 0, zoom: 1.12, ty: 42 }], [197, { x: 0, zoom: 1.2, ty: 48 }]])); post(t);
      endCard(t);
    }
  },
};
