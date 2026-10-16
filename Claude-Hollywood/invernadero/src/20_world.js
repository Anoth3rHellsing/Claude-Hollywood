/* =====================================================================
   EL INVERNADERO · mundo 2.5D en perspectiva viva
   x = a lo largo de la nave (izq → der), y hacia abajo (suelo = 0), z = profundidad desde la cámara.
   Una unidad ≈ 1 cm: un mago mide ~180.
   · Lo plano y quieto se pinta UNA vez en acuarela: muro de cristal del fondo (dos versiones: entero y roto),
     el suelo visto desde arriba (se dibuja en franjas con perspectiva), la luz de las ventanas en el suelo,
     el cielo y la utilería.
   · Lo que se rompe, se dobla o se mueve se dibuja vivo: costillas del techo, paneles del techo, columnas.
   ===================================================================== */
const ZF = 1600, ZC = 1050, ZN = 330, EAVE = -600, FOC = 1155;
const CAM = { x: 0, y: -150, z: 0, zoom: 1, tx: 0, ty: 0 };
function camSet(o) { CAM.x = o.x ?? 0; CAM.y = o.y ?? -150; CAM.z = o.z ?? 0; CAM.zoom = o.zoom ?? 1; CAM.tx = o.tx ?? 0; CAM.ty = o.ty ?? 0; }
const PS = z => FOC * CAM.zoom / Math.max(6, z - CAM.z);
const PJ = (x, y, z) => { const s = PS(z); return [(x - CAM.x) * s + CAM.tx, (y - CAM.y) * s + CAM.ty]; };
const hsh = (a, b = 0) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
const IRON = [26, 24, 30];

/* ---------- estado del mundo en el instante t (daños, luz) ---------- */
const BOLTS = [[4.6, -.5, .45], [11.2, .62, .35], [22.4, .12, 1], [28.3, -.7, .5], [47.2, .4, .45], [56.6, -.3, .7], [72.1, .05, 1], [76.6, .55, .6], [85.3, -.6, .45], [93.6, .3, .55], [105.2, -.2, .6], [111.4, .5, 1], [117.6, -.45, .55], [135.8, .7, .4], [146.6, -.6, .45]];
function flashAt(t) {
  let f = 0;
  for (const [t0, , k] of BOLTS) { const d = t - t0; if (d < 0 || d > 1.6) continue; f = Math.max(f, k * (Math.exp(-d * 10) + .75 * (d > .14 ? Math.exp(-(d - .14) * 6) : 0) + .35 * (d > .5 ? Math.exp(-(d - .5) * 9) : 0))); }
  return clamp(f);
}
const WS = { t: 0, flash: 0, moon: .12, clear: 0 };
function worldState(t) {
  WS.t = t; WS.flash = flashAt(t);
  WS.clear = sm((t - 156) / 9);                       // la tormenta se abre: luna llena
  WS.moon = lerp(.12, .62, WS.clear);
  WS.bend = sm((t - 110.2) / .8);                     // la columna principal cede
  WS.wall = clamp((t - 111.0) / 3.0);                 // el muro lateral se desploma
  WS.final = t > 153.25 ? 1 : 0;                      // tras la detonación
  WS.rain = t > 70.7 ? 1 : 0;                         // la lluvia entra por el hueco
}

/* ============================ CIELO ============================ */
let SKY = null, SKYC = null, RAINT = null, TREES = [];
function makeSky(clear) {
  const w = Math.ceil(W * 1.5), h = Math.ceil(H * 1.9), c = mk(w, h), g = c.getContext('2d'), r = mulberry32(clear ? 77 : 41);
  const top = clear ? [30, 38, 66] : [26, 30, 44], bot = clear ? [70, 84, 112] : [52, 58, 74];
  g.fillStyle = cssc(PAPC); g.fillRect(0, 0, w, h);
  const gr = g.createLinearGradient(0, 0, 0, h * .62); gr.addColorStop(0, cssc(top)); gr.addColorStop(1, cssc(bot));
  g.globalAlpha = .93; g.fillStyle = gr; g.fillRect(0, 0, w, h); g.globalAlpha = 1;
  /* nubes: floraciones mojado sobre mojado; borde de abajo más marcado */
  g.globalCompositeOperation = 'multiply';
  for (let i = 0; i < (clear ? 7 : 16); i++) { const x = r() * w, y = r() * h * .58, rr = (.1 + r() * .25) * w, cc = r() < .5 ? [70, 66, 92] : [96, 88, 104]; const q = g.createRadialGradient(x, y, 0, x, y, rr); q.addColorStop(0, cssc(cc, clear ? .25 : .45)); q.addColorStop(.7, cssc(cc, clear ? .1 : .2)); q.addColorStop(1, cssc(cc, 0)); g.fillStyle = q; g.fillRect(x - rr, y - rr, rr * 2, rr * 2); }
  g.globalAlpha = .55; g.fillStyle = g.createPattern(BLOT, 'repeat'); g.fillRect(0, 0, w, h);
  g.globalAlpha = .12; g.fillStyle = g.createPattern(GRAIN, 'repeat'); g.fillRect(0, 0, w, h);
  g.globalCompositeOperation = 'destination-out';
  g.save(); g.filter = `blur(${Math.round(16 * U)}px)`;
  for (let i = 0; i < (clear ? 9 : 5); i++) { const x = r() * w, y = h * (.05 + r() * .45), rx = (.05 + r() * .12) * w, ry = rx * (.15 + r() * .2); g.globalAlpha = clear ? .2 + r() * .3 : .12 + r() * .18; g.fill(pPolys([wob(ellP(x, y, rx, ry, 30), ry * .6, i * 7, .02)])); }
  g.restore(); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
  if (clear) {   /* luna llena: papel reservado con halo frío */
    const mx = w * .62, my = h * .24, mr = 46 * U;
    const hg = g.createRadialGradient(mx, my, mr, mx, my, mr * 6); hg.addColorStop(0, 'rgba(206,214,236,.5)'); hg.addColorStop(1, 'rgba(206,214,236,0)'); g.fillStyle = hg; g.fillRect(mx - mr * 6, my - mr * 6, mr * 12, mr * 12);
    g.globalCompositeOperation = 'destination-out'; g.beginPath(); g.arc(mx, my, mr, 0, TAU); g.fill(); g.globalCompositeOperation = 'source-over';
    g.globalAlpha = .4; g.fillStyle = 'rgb(214,220,236)'; g.beginPath(); g.arc(mx, my, mr, 0, TAU); g.fill();
    g.fillStyle = 'rgba(120,130,160,.35)'; for (const [dx, dy, rr] of [[-.3, -.2, .22], [.25, .15, .16], [-.05, .35, .12]]) { g.beginPath(); g.arc(mx + dx * mr, my + dy * mr, rr * mr, 0, TAU); g.fill(); }
    g.globalAlpha = 1; for (let i = 0; i < 90; i++) { g.fillStyle = `rgba(250,246,232,${.2 + r() * .6})`; g.beginPath(); g.arc(r() * w, r() * h * .5, (.5 + r()) * U, 0, TAU); g.fill(); }
    c.moon = [mx, my, mr];
  }
  return c;
}
function makeRainTex() {
  const s = 256, c = mk(s, s), g = c.getContext('2d'), r = mulberry32(5);
  g.lineCap = 'round';
  for (let i = 0; i < 70; i++) { const x = r() * s, y = r() * s, l = 18 + r() * 30; g.strokeStyle = `rgba(214,222,236,${.25 + r() * .35})`; g.lineWidth = .7 + r() * .8; for (const ox of [-s, 0, s]) for (const oy of [-s, 0, s]) { g.beginPath(); g.moveTo(x + ox, y + oy); g.lineTo(x + ox - l * .18, y + oy + l); g.stroke(); } }
  return c;
}
/* árboles del jardín de fuera, vistos a través del vidrio sucio; se doblan con el viento */
function makeTrees() {
  const out = [];
  for (let i = 0; i < 6; i++) {
    const r = mulberry32(300 + i), h = 260 + r() * 180, w = h * (.55 + r() * .3), d = 1.4;
    const box = [-w * .7, -h * 1.05, w * .7, 10], S = spr(box, d), g = S.g;
    const col = [34, 40, 46];
    wcWash(g, [[-6, 0], [-3, -h * .55], [3, -h * .55], [7, 0]], col, .9, { reserve: false, mode: 'source-over', amt: 1, seed: i });
    for (let k = 0; k < 7; k++) { const cx = (r() - .5) * w * .7, cy = -h * (.5 + r() * .42), rx = w * (.18 + r() * .2), ry = rx * (.6 + r() * .3); wcWash(g, ellP(cx, cy, rx, ry, 18), col, .55 + r() * .3, { reserve: false, mode: 'source-over', amt: rx * .18, f: .04, seed: i * 10 + k }); }
    out.push({ S, x: -2600 + i * 1000 + r() * 400, z: 2400 + r() * 900, ph: r() * 9, h });
  }
  return out;
}
function drawSky(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  const ox = (SKY.width - W) / 2 + CAM.x * .04 * U, oy = (SKY.height - H) * .42 - CAM.ty * .35 * U - (CAM.y + 150) * .2 * U;
  ctx.drawImage(SKY, ox, oy, W, H, 0, 0, W, H);
  if (WS.clear > .01) { ctx.globalAlpha = WS.clear; ctx.drawImage(SKYC, ox, oy, W, H, 0, 0, W, H); ctx.globalAlpha = 1; }
  T0();
  /* rayo: papel reservado que se ramifica */
  for (const [t0, sx, k] of BOLTS) { const d = t - t0; if (d < -.02 || d > .55) continue; const a = (d < .09 ? 1 : d < .18 ? .4 : d < .26 ? .95 : 1 - sm((d - .26) / .29)) * k; bolt(sx * SW * .5 - (CAM.x * .04), -560 - CAM.ty * .35, 380 + 120 * k, t0 * 13, a); }
  /* fuera: suelo del jardín y árboles que se doblan */
  const gy = PJ(0, 0, 2600)[1];
  ctx.fillStyle = `rgba(28,32,40,${.85 - WS.clear * .2})`; ctx.fillRect(-SW, gy, SW * 2, 1200);
  for (const T of TREES) {
    const s = PS(T.z), p = PJ(T.x, 0, T.z); if (p[0] < -SW / 2 - 400 || p[0] > SW / 2 + 400) continue;
    const wind = (1 - WS.clear) * (.18 + .1 * Math.sin(t * 1.3 + T.ph) + .07 * Math.sin(t * 3.7 + T.ph * 2)) + (t > 112 && t < 153 ? .2 : 0);
    ctx.save(); ctx.translate(p[0], p[1]); ctx.transform(s, 0, -wind * s, s, 0, 0);
    ctx.globalAlpha = .9; ctx.drawImage(T.S.c, T.S.box[0], T.S.box[1], T.S.box[2] - T.S.box[0], T.S.box[3] - T.S.box[1]); ctx.restore();
  }
  ctx.globalAlpha = 1;
  /* lluvia de fuera (se ve a través del vidrio) */
  const ra = .5 * (1 - WS.clear);
  if (ra > .02) { if (!RAINT.pat) RAINT.pat = ctx.createPattern(RAINT, 'repeat'); const sc = 1.6; RAINT.pat.setTransform(new DOMMatrix().translate((t * 90) % (256 * sc), (t * 900) % (256 * sc)).scale(sc)); ctx.globalAlpha = ra; ctx.fillStyle = RAINT.pat; ctx.fillRect(-SW / 2, -500, SW, 1000); ctx.globalAlpha = 1; }
  if (WS.flash > .01) { ctx.globalAlpha = WS.flash * .85; ctx.fillStyle = 'rgb(246,242,232)'; ctx.fillRect(-SW / 2, -500, SW, 1000); ctx.globalAlpha = 1; }
}
function bolt(x, y, L, s, a) {
  if (a <= .01) return;
  const r = mulberry32(Math.floor(s)), seg = (p, ang, l, w, depth) => {
    const pts = [p]; let q = p;
    for (let i = 0; i < 9; i++) { ang += (r() - .5) * .9; q = [q[0] + Math.sin(ang) * l / 9, q[1] + Math.cos(ang) * l / 9]; pts.push(q); if (depth < 2 && r() < .22) seg(q, ang + (r() - .5) * 1.4, l * .45, w * .55, depth + 1); }
    ctx.strokeStyle = `rgba(206,214,240,${.35 * a})`; ctx.lineWidth = w * 4; ctx.stroke(pLine(pts));
    ctx.strokeStyle = `rgba(252,250,242,${a})`; ctx.lineWidth = w; ctx.stroke(pLine(pts));
  };
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'; seg([x, y], (r() - .5) * .4, L, 3.2, 0);
}

/* ============================ MURO DE CRISTAL DEL FONDO (z = ZF) ============================ */
const TRANS = [-60, -200, -340, -470, -600], PANES = [], WALLX = [-2200, 2200];
for (let x = WALLX[0]; x < WALLX[1]; x += 50) for (let r = 0; r < 4; r++) PANES.push({ x0: x, x1: x + 50, y0: TRANS[r + 1], y1: TRANS[r], r, id: PANES.length, h: hsh(x * .37, r) });
let FWA = null, FWB = null, FWCLIP = null;          // entero / roto
function makeFarWall(broken) {
  const box = [WALLX[0], -660, WALLX[1], 4], S = spr(box, 1.25), g = S.g;
  /* zócalo de ladrillo con musgo */
  wcWash(g, rectP(WALLX[0], -60, WALLX[1] - WALLX[0], 62), [96, 64, 52], .95, { reserve: false, mode: 'source-over', amt: 1.2, seed: 3, bloom: [70, 92, 60], step: 20 });
  g.strokeStyle = 'rgba(40,28,26,.35)'; g.lineWidth = 1;
  for (let y = -52; y < 0; y += 9) { g.beginPath(); g.moveTo(WALLX[0], y); g.lineTo(WALLX[1], y); g.stroke(); for (let x = WALLX[0] + ((y / 9) & 1) * 11; x < WALLX[1]; x += 22) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 9); g.stroke(); } }
  for (let i = 0; i < 90; i++) { const x = lerp(WALLX[0], WALLX[1], hsh(i, 5)), w = 30 + hsh(i, 6) * 120; wcWash(g, ellP(x, -4, w, 10 + hsh(i, 7) * 22, 16, PI, TAU), [58, 86, 52], .55, { reserve: false, mode: 'source-over', amt: 4, seed: i }); }
  /* paneles: vidrio sucio translúcido (el cielo se ve detrás); abajo, verdín y musgo */
  for (const p of PANES) {
    const w = p.x1 - p.x0, hgt = p.y1 - p.y0;
    if (broken) {   // quedan esquirlas en los bordes
      const r = mulberry32(p.id + 7);
      for (let k = 0; k < 2 + (r() * 3 | 0); k++) { const e = r() * 4 | 0, u = r(), a = e < 2 ? [lerp(p.x0, p.x1, u), e ? p.y1 : p.y0] : [e === 2 ? p.x0 : p.x1, lerp(p.y0, p.y1, u)], b = e < 2 ? [a[0] + 8 + r() * 14, a[1]] : [a[0], a[1] + 10 + r() * 20], c = [lerp(a[0], b[0], .5) + (e === 2 ? 1 : e === 3 ? -1 : 0) * (6 + r() * 12), lerp(a[1], b[1], .5) + (e === 0 ? 1 : e === 1 ? -1 : 0) * (8 + r() * 18)]; g.fillStyle = 'rgba(150,164,170,.45)'; g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.lineTo(...c); g.closePath(); g.fill(); g.strokeStyle = 'rgba(232,236,236,.5)'; g.lineWidth = .6; g.stroke(); }
      continue;
    }
    const dirt = .42 + p.h * .3 + (p.r === 0 ? .2 : 0), c = mixc([58, 68, 80], [56, 76, 56], p.r === 0 ? .6 : p.h * .3);
    g.globalCompositeOperation = 'source-over';
    const gr = g.createLinearGradient(0, p.y0, 0, p.y1); gr.addColorStop(0, cssc(c, dirt * .75)); gr.addColorStop(1, cssc(shc(c, -.2), Math.min(.92, dirt * 1.35)));
    g.fillStyle = gr; g.fillRect(p.x0, p.y0, w, hgt);
    /* chorretones de suciedad y gotas secas */
    for (let k = 0; k < 3; k++) { const x = p.x0 + hsh(p.id, k) * w; g.strokeStyle = `rgba(60,62,58,${.1 + hsh(p.id, k + 9) * .14})`; g.lineWidth = 1 + hsh(p.id, k + 3) * 2.5; g.beginPath(); g.moveTo(x, p.y0 + hsh(p.id, k + 4) * hgt * .4); g.quadraticCurveTo(x + 2, p.y0 + hgt * .7, x - 1, p.y1); g.stroke(); }
    /* condensación: claros de papel donde el vidrio está limpio */
    if (p.h > .62) { g.globalCompositeOperation = 'destination-out'; g.globalAlpha = .35; g.fill(pPolys([wob(ellP(p.x0 + w * .5, p.y0 + hgt * .45, w * .32, hgt * .3, 14), 4, p.id, .08)])); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; }
    /* grietas a plumilla */
    if (p.h < .2) { const r = mulberry32(p.id), o = [p.x0 + w * (.2 + r() * .6), p.y0 + hgt * (.2 + r() * .6)]; for (let k = 0; k < 5; k++) { const a = r() * TAU, l = 14 + r() * 40; wcInk(g, [o, [o[0] + Math.cos(a) * l * .5 + (r() - .5) * 6, o[1] + Math.sin(a) * l * .5], [clamp(o[0] + Math.cos(a) * l, p.x0, p.x1), clamp(o[1] + Math.sin(a) * l, p.y0, p.y1)]], .7, .55, p.id + k, .1, [230, 234, 232]); } }
    /* musgo en los paneles bajos */
    if (p.r === 0 && p.h > .3) wcWash(g, ellP(p.x0 + w / 2, p.y1, w * .6, hgt * (.3 + p.h * .5), 14, PI, TAU), [62, 92, 54], .5, { reserve: false, mode: 'source-over', amt: 3, seed: p.id });
  }
  wcTex(g, S.c.width, S.c.height, .45, .25);
  /* hierro: parteluces, travesaños, pilares con capitel y arcos de abanico arriba de cada tramo */
  const iron = (pts, w, a = .95) => { g.globalCompositeOperation = 'source-over'; g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = cssc(IRON, a); g.lineWidth = w; g.stroke(pLine(wob(pts, .4, pts[0][0] * .1, .08, false, 10))); };
  for (let x = WALLX[0]; x <= WALLX[1]; x += 50) iron([[x, -60], [x, -600]], 3.2);
  for (const y of TRANS) iron([[WALLX[0], y], [WALLX[1], y]], y === -600 ? 13 : y === -60 ? 7 : 4.5);
  for (let x = -2100; x <= 2100; x += 300) {
    g.fillStyle = cssc(IRON); g.fill(pPolys([wob([[x - 9, 2], [x - 7, -560], [x - 15, -580], [x - 15, -606], [x + 15, -606], [x + 15, -580], [x + 7, -560], [x + 9, 2]], .5, x, .1)]));
    g.fillStyle = 'rgba(150,140,130,.5)'; for (let y = -540; y < -80; y += 46) { g.beginPath(); g.arc(x - 3, y, 1.4, 0, TAU); g.arc(x + 3, y + 8, 1.4, 0, TAU); g.fill(); }
    /* arco de abanico entre pilares (tracería victoriana) */
    const cx = x + 150; if (cx < WALLX[1]) { const arc = ellP(cx, -470, 142, 110, 30, PI, TAU); iron(arc, 5); for (let k = 1; k < 8; k++) { const a = PI + k / 8 * PI; iron([[cx, -470], [cx + Math.cos(a) * 140, -470 + Math.sin(a) * 108]], 2); } iron(ellP(cx, -470, 40, 32, 16, PI, TAU), 3.5); }
    /* ménsula en espiral bajo el alero */
    for (const sg of [-1, 1]) { const sp = []; for (let k = 0; k <= 20; k++) { const a = k / 20 * 4.2, rr = 22 * (1 - k / 26); sp.push([x + sg * (16 + 24 - Math.cos(a) * rr), -590 + 26 - Math.sin(a) * rr * .9]); } iron(sp, 2.6); }
  }
  return S;
}
function farWallXf(mirror = false) {
  const s = PS(ZF); ctx.transform(s, 0, 0, mirror ? -s : s, -CAM.x * s + CAM.tx, -CAM.y * s + CAM.ty);
}
function paneBroken(p, t) {
  if (t > 153.25) return p.h < .78 || (p.x0 >= 300 && p.x0 < 900);
  if (p.x0 >= 300 && p.x0 < 900 && t > 111) return true;
  for (let i = 0; i < 6; i++) { const tp = 141 + i * 1.6; if (t > tp && Math.abs(p.x0 - (i % 2 ? 700 : -900) + (i - 3) * 230) < 260 && p.h < .55) return true; }
  return false;
}
function drawFarWall(t, mirror = false) {
  ctx.save(); farWallXf(mirror);
  const bw = FWA.box[2] - FWA.box[0], bh = FWA.box[3] - FWA.box[1];
  const gone = WS.wall > 0, clipGone = P => { if (gone) { P.rect(WALLX[0], -700, 300 - WALLX[0], 720); P.rect(900, -700, WALLX[1] - 900, 720); } else P.rect(WALLX[0], -700, WALLX[1] - WALLX[0], 720); };
  const cg = new Path2D(); clipGone(cg); ctx.clip(cg);
  ctx.drawImage(FWB.c, FWB.box[0], FWB.box[1], bw, bh);
  const ok = new Path2D(); let any = false;
  for (const p of PANES) { if (paneBroken(p, t)) { any = true; continue; } ok.rect(p.x0 + 1.5, p.y0 + 2, p.x1 - p.x0 - 3, p.y1 - p.y0 - 4); }
  ok.rect(WALLX[0], -62, WALLX[1] - WALLX[0], 70);
  ctx.save(); ctx.clip(ok); ctx.drawImage(FWA.c, FWA.box[0], FWA.box[1], bw, bh); ctx.restore();
  /* el rayo atraviesa el vidrio sucio: los paneles se vuelven papel; el hierro queda negro */
  const L = WS.flash * .85 + WS.moon * .25;
  if (L > .02) { if (!FWCLIP) { FWCLIP = new Path2D(); for (const p of PANES) FWCLIP.rect(p.x0 + 2.5, p.y0 + 3, p.x1 - p.x0 - 5, p.y1 - p.y0 - 6); } ctx.save(); ctx.clip(FWCLIP); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = Math.min(1, L); ctx.fillStyle = mirror ? 'rgb(150,154,160)' : 'rgb(226,226,220)'; ctx.fillRect(WALLX[0], -600, WALLX[1] - WALLX[0], 540); ctx.restore(); }
  ctx.restore();
}
/* la sección del muro que se desploma hacia dentro: franjas a su propia profundidad (plano girando sobre su base) */
function drawFallingWall(t) {
  const f = WS.wall; if (f <= 0 || f >= 1) return;
  const ang = Math.pow(f, 2.2) * 1.45, ca = Math.cos(ang), sa = Math.sin(ang);
  const bw = FWA.box[2] - FWA.box[0], d = FWA.d;
  for (let i = 0; i < 24; i++) {
    const y0 = -600 + i * 25, y1 = y0 + 25, h0 = -y0, h1 = -y1;
    const zA = ZF - h0 * sa, zB = ZF - h1 * sa, yA = -h0 * ca, yB = -h1 * ca;
    const zm = (zA + zB) / 2, s = PS(zm), pa = PJ(300, yA, zA), pb = PJ(300, yB, zB);
    if (pb[1] - pa[1] < .2) continue;
    const sx = (300 - FWA.box[0]) * d, sy = (y0 - FWA.box[1]) * d;
    const brk = hsh(i, 3) < f * .9;   // al caer se va rompiendo
    ctx.globalAlpha = brk ? .55 : 1;
    ctx.drawImage(brk ? FWB.c : FWA.c, sx, sy, 600 * d, 25 * d, pa[0], pa[1], 600 * s, pb[1] - pa[1] + .6);
  }
  ctx.globalAlpha = 1;
}

/* ============================ TECHO: costillas y paneles (vivo) ============================ */
const RIBX = []; for (let x = -2250; x <= 2250; x += 150) RIBX.push(x);
const NPUR = 14, TH = []; for (let j = 0; j <= NPUR; j++) TH.push(PI * j / NPUR);
const ribP = (x, th) => [x, EAVE - 550 * Math.sin(th), 900 + 700 * Math.cos(th)];
function roofBroken(i, j, t) {
  const x = RIBX[i], h = hsh(i * 3.1, j);
  if (t > 153.25) return h > .1;
  if (t > 70.75 + h * .3 && x >= -300 && x < 300 && j >= 3 && j <= 9 && !(j === 9 && h < .5)) return true;
  if (t > 141 && h < .22) return true;
  if (t > 111.2 && x >= 300 && x < 900 && j < 3) return true;
  return false;
}
function ribTwist(i, th) {   // tras la detonación las costillas quedan retorcidas como ramas secas
  if (!WS.final) return [0, 0];
  const h = hsh(i, 9), k = (h - .5) * 2;
  return [k * 90 * Math.pow(th / PI, 1.5) + Math.sin(th * 5 + i) * 18 * h, Math.pow(th / PI, 2) * 140 * h];
}
const ribEnd = i => WS.final ? PI * (.22 + .55 * hsh(i, 4)) : PI;
function drawRoof(t) {
  const lit = WS.flash, base = mixc([40, 46, 64], [96, 106, 126], WS.moon * .4);
  const buckets = [new Path2D(), new Path2D(), new Path2D(), new Path2D()], SHB = new Path2D();
  const vis = p => p[0] > -SW / 2 - 300 && p[0] < SW / 2 + 300 && p[1] < 560 && p[1] > -2600;
  const PR = []; for (let i = 0; i < RIBX.length; i++) { PR.push(TH.map(th => { const q = ribP(RIBX[i], th), tw = ribTwist(i, th); return q[2] - CAM.z > 40 ? PJ(q[0] + tw[0], q[1] + tw[1], q[2]) : null; })); }
  for (let i = 0; i < RIBX.length - 1; i++) for (let j = 0; j < NPUR; j++) {
    const a = PR[i][j], b = PR[i + 1][j], c = PR[i + 1][j + 1], d = PR[i][j + 1];
    if (!a || !b || !c || !d) continue; if (!(vis(a) || vis(b) || vis(c) || vis(d))) continue;
    if (roofBroken(i, j, t)) { if (!WS.final && hsh(i, j + 7) < .8) { const r = hsh(i * 5, j), q = [a, b, c, d], k = Math.floor(r * 4), p0 = q[k], p1 = q[(k + 1) % 4], p3 = q[(k + 3) % 4]; SHB.moveTo(...p0); SHB.lineTo(...L2(p0, p1, .3 + r * .4)); SHB.lineTo(...L2(L2(p0, p1, .2), L2(p3, q[(k + 2) % 4], .2), .5 + r * .3)); SHB.lineTo(...L2(p0, p3, .25 + r * .3)); SHB.closePath(); } continue; }
    const P = buckets[Math.floor(hsh(i, j + 40) * 4)]; P.moveTo(...a); P.lineTo(...b); P.lineTo(...c); P.lineTo(...d); P.closePath();
  }
  buckets.forEach((P, k) => { const c = mixc(shc(base, -.18 + k * .1), [236, 236, 228], lit * (.55 + k * .1)); ctx.fillStyle = cssc(c, .42 + k * .08 + lit * .3); ctx.fill(P); });
  ctx.fillStyle = cssc(mixc([120, 132, 150], [240, 240, 232], lit), .7); ctx.fill(SHB); ctx.strokeStyle = 'rgba(236,240,240,.5)'; ctx.lineWidth = .8; ctx.stroke(SHB);
  /* correas (horizontales) y costillas (curvas que se abren hacia la cámara) */
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (let j = 1; j < NPUR; j++) {
    if (WS.final && j > 3) continue;
    const z = 900 + 700 * Math.cos(TH[j]); if (z - CAM.z < 60) continue;
    const s = PS(z), y = PJ(0, EAVE - 550 * Math.sin(TH[j]), z)[1]; if (y < -560 || y > 560) continue;
    ctx.strokeStyle = cssc(IRON, .9); ctx.lineWidth = Math.max(.6, 3.2 * s); ctx.beginPath(); ctx.moveTo(-SW / 2, y); ctx.lineTo(SW / 2, y); ctx.stroke();
  }
  for (let i = 0; i < RIBX.length; i++) {
    const main = (RIBX[i] + 2250) % 300 === 0, te = ribEnd(i), pts = [], ws = [];
    for (let k = 0; k <= 40; k++) { const th = k / 40 * te, q = ribP(RIBX[i], th); if (q[2] - CAM.z < 40) break; const tw = ribTwist(i, th); pts.push(PJ(q[0] + tw[0], q[1] + tw[1], q[2])); ws.push((main ? 11 : 5.5) * PS(q[2])); }
    if (pts.length < 2) continue;
    if (Math.max(...pts.map(p => p[0])) < -SW / 2 - 50 || Math.min(...pts.map(p => p[0])) > SW / 2 + 50) continue;
    ctx.fillStyle = cssc(IRON, .96); ctx.fill(pPolys([stripP(pts, f => ws[Math.round(f * (ws.length - 1))])]));
    if (lit > .05 && main) { ctx.strokeStyle = `rgba(236,232,220,${lit * .35})`; ctx.lineWidth = 1.2; ctx.stroke(pLine(pts.map((p, k) => [p[0] - ws[k] * .35, p[1]]))); }
  }
}

/* ============================ COLUMNAS DE HIERRO (vivas) ============================ */
const COLS = [[-1350, ZC], [-450, ZC], [450, ZC], [1350, ZC], [-1900, ZN], [-1000, ZN], [1000, ZN], [1900, ZN]];
function colBend(x, z) {
  if (x === 450 && z === ZC) return WS.final ? 1.35 : WS.bend;
  if (WS.final && x === -450 && z === ZC) return -.6;
  return 0;
}
function ironColumn(x, z, t) {
  const top = -1150, bend = colBend(x, z), s = PS(z);
  const bx = y => { const f = clamp((-y - 120) / 700); return bend * (f * f * 150 + Math.sin(f * 3) * 30 * f); };
  const p0 = PJ(x, 0, z); if (p0[0] < -SW / 2 - 200 || p0[0] > SW / 2 + 200 || z - CAM.z < 60) return;
  const L = [], Rr = [];
  for (let k = 0; k <= 24; k++) { const y = lerp(-26, top, k / 24), w = lerp(9, 6.5, k / 24) * (1 + (y < -620 && y > -660 ? .7 : 0)); L.push(PJ(x + bx(y) - w, y, z)); Rr.push(PJ(x + bx(y) + w, y, z)); }
  ctx.fillStyle = cssc(IRON); ctx.fill(pPolys([L.concat(Rr.reverse())]));
  /* basa, capitel y ménsulas */
  const b = [[-20, 0], [-20, -10], [-15, -14], [-15, -26], [15, -26], [15, -14], [20, -10], [20, 0]].map(([dx, dy]) => PJ(x + dx, dy, z));
  ctx.fill(pPolys([b]));
  const cy = -640, cxp = x + bx(cy);
  ctx.fill(pPolys([[[-16, cy - 10], [16, cy - 10], [11, cy + 6], [-11, cy + 6]].map(([dx, dy]) => PJ(cxp + dx, dy, z))]));
  ctx.strokeStyle = cssc(IRON); ctx.lineCap = 'round'; ctx.lineWidth = Math.max(.8, 3 * s);
  for (const sg of [-1, 1]) { const sp = []; for (let k = 0; k <= 22; k++) { const a = k / 22 * 4.4, rr = 50 * (1 - k / 28); sp.push(PJ(cxp + sg * (60 - Math.cos(a) * rr), cy - 30 - Math.sin(a) * rr * .8, z)); } ctx.stroke(pLine(sp)); ctx.stroke(pLine([PJ(cxp + sg * 10, cy - 8, z), PJ(cxp + sg * 160, cy - 120, z)])); }
  /* acanaladuras con la luz del rayo */
  if (WS.flash > .05) { ctx.strokeStyle = `rgba(236,232,220,${WS.flash * .4})`; ctx.lineWidth = Math.max(.6, 1.6 * s); ctx.stroke(pLine(L.slice(1, 22).map(p => [p[0] + 3 * s, p[1]]))); }
  ctx.fillStyle = 'rgba(160,150,140,.45)'; for (let k = 0; k < 4; k++) { const q = PJ(x + (k % 2 ? 9 : -9), -6 - (k >> 1) * 8, z); ctx.beginPath(); ctx.arc(q[0], q[1], Math.max(.6, 1.5 * s), 0, TAU); ctx.fill(); }
}
/* viga de la arcada entre columnas (a la altura de los capiteles) */
function arcadeBeam(z) {
  const y = -700, a = PJ(-2300, y, z), b = PJ(2300, y, z); if (a[1] < -560) return;
  const s = PS(z); ctx.fillStyle = cssc(IRON); ctx.fillRect(a[0], a[1] - 7 * s, b[0] - a[0], 14 * s);
  ctx.strokeStyle = cssc(IRON, .9); ctx.lineWidth = Math.max(.6, 2.4 * s);
  for (let x = -2250; x <= 2250; x += 150) { const c = PJ(x + 75, y + 26, z); if (c[0] < -SW / 2 - 60 || c[0] > SW / 2 + 60) continue; ctx.beginPath(); ctx.arc(c[0], c[1], 18 * s, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(...PJ(x, y + 7, z)); ctx.lineTo(...PJ(x + 75, y + 44, z)); ctx.lineTo(...PJ(x + 150, y + 7, z)); ctx.stroke(); }
}
