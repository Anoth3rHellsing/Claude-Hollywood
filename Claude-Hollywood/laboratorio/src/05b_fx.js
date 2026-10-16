/* =====================================================================
   EFECTOS HECHOS DEL MISMO MATERIAL QUE EL RESTO
   · el hechizo es una pincelada (cuerpo + cerdas + pincel seco al final)
   · la luz es papel sin pintar (núcleo con el patrón del propio papel)
   · el impacto es una flor de tinta húmeda + 1–2 fotogramas invertidos
   · cada tipo tiene su forma: ataque = puntas, escudo = ensō (círculo de un trazo), maldición = enroscado
   · los efectos van a 12 FPS («en doses»)
   ===================================================================== */
function bez(a, c, b, n = 24) { const o = []; for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t; o.push([u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]]); } return o; }
function polyLen(pts) { const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return L; }
/* pincelada: o = {w: t→ancho, col, a, prog (0..1 dibujado), from (0..1 borrado desde el inicio), dry, seed, core (fracción de ancho en papel), bristles} */
function inkStroke(pts, o) {
  const L = polyLen(pts), tot = L[L.length - 1] || 1, end = tot * clamp(o.prog ?? 1), st = tot * clamp(o.from ?? 0);
  if (end - st < 1) return;
  const sp = [], tg = [];
  for (let i = 0; i < pts.length; i++) {
    if (L[i] < st) { if (L[i + 1] > st) { const f = (st - L[i]) / (L[i + 1] - L[i]); sp.push([lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)]); tg.push(st / tot); } continue; }
    if (L[i] <= end) { sp.push(pts[i]); tg.push(L[i] / tot); continue; }
    const f = (end - L[i - 1]) / (L[i] - L[i - 1]); sp.push([lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)]); tg.push(end / tot); break;
  }
  if (sp.length < 2) return;
  const dryS = o.dry ?? .7, bw = t => o.w(t) * (1 - .85 * sm((t - dryS) / (1 - dryS + 1e-6)));
  const n = sp.length, Lr = [], Rr = [];
  for (let i = 0; i < n; i++) { const a = sp[Math.max(0, i - 1)], b = sp[Math.min(n - 1, i + 1)], d = nrm2(sub(b, a)), w = bw(tg[i]) / 2; Lr.push([sp[i][0] - d[1] * w, sp[i][1] + d[0] * w]); Rr.push([sp[i][0] + d[1] * w, sp[i][1] - d[0] * w]); }
  const body = pathOf([Lr.concat(Rr.reverse())], true);
  ctx.fillStyle = `rgba(${o.col},${o.a ?? .9})`; ctx.fill(body);
  if (o.core) { ctx.strokeStyle = `rgba(20,12,16,${(o.a ?? .9) * .45})`; ctx.lineWidth = 2.6; ctx.lineJoin = 'round'; ctx.stroke(body); }   // pigmento acumulado en el borde
  const B = o.bristles ?? 7, sd = o.seed || 1; ctx.lineCap = 'round';
  for (let b = 0; b < B; b++) {
    const off = (b / (B - 1) * 2 - 1) * .95; ctx.lineWidth = Math.max(.8, o.w(.3) / B * 1.3); ctx.strokeStyle = `rgba(${o.col},${(o.a ?? .9) * .55})`; ctx.beginPath(); let pen = false;
    for (let i = 0; i < n; i++) {
      const a = sp[Math.max(0, i - 1)], c = sp[Math.min(n - 1, i + 1)], d = nrm2(sub(c, a)), t = tg[i], dry = t > dryS ? (t - dryS) / (1 - dryS) : 0;
      const vis = N2(b * 7.31 + sd, t * tot * .045) * .5 + .5 > dry * .85 + .06, w = o.w(t) * .5 * off, x = sp[i][0] - d[1] * w, y = sp[i][1] + d[0] * w;
      if (vis) { if (pen) ctx.lineTo(x, y); else { ctx.moveTo(x, y); pen = true; } } else pen = false;
    }
    ctx.stroke();
  }
  if (o.core) {   // la luz: pigmento «levantado» en el centro, suave y continuo (como pasar un pincel limpio y húmedo)
    const cut = sp.slice(0, Math.max(2, tg.findIndex(t => t > dryS) < 0 ? n : tg.findIndex(t => t > dryS)));
    const inner = varPoly(cut, t => bw(t * (tg[cut.length - 1] || 1)) * o.core * 1.6);
    ctx.save(); ctx.globalAlpha = (o.coreA ?? 1) * .85; softFill(ctx, pathOf([inner], true), 0, 0, Math.max(2, o.w(.3) * .22) * U, 'rgb(250,243,226)'); ctx.restore();
  }
}
/* flor de tinta: mancha húmeda irregular en capas; spikes > 0 la vuelve estrella (ataque) */
function inkBloom(c, r, col, a, seed, spikes = 0, k = 7) {
  if (a <= .01 || r < 1) return;
  for (let l = 0; l < 3; l++) {
    const pts = [];
    for (let i = 0; i < 44; i++) {
      const an = i / 44 * TAU, ns = N2(Math.cos(an) * 1.6 + seed + l * 3.1, Math.sin(an) * 1.6 + seed);
      const rr = r * (1 - l * .2) * (1 + .22 * ns) * (1 + spikes * Math.pow(Math.abs(Math.cos(an * k / 2 + seed)), 12) * (.6 + .4 * Math.sin(i * 1.7 + seed)));
      pts.push([c[0] + Math.cos(an) * rr, c[1] + Math.sin(an) * rr]);
    }
    const P = pathOf([pts], true);
    ctx.fillStyle = `rgba(${col},${a * (.42 - l * .1)})`; ctx.fill(P);
    if (!l) { ctx.strokeStyle = `rgba(${col},${a * .5})`; ctx.lineWidth = 2.2; ctx.stroke(P); }
  }
}
/* «luz como papel»: claro sin pintar con borde suave (el papel reservado) */
function paperLight(c, r, a) {
  if (a <= .01) return;
  const P = pathOf([circ(c, r, 24).map((p, i) => [p[0] + N2(i * .7, r) * r * .12, p[1] + N2(i * .7 + 9, r) * r * .12])], true);
  ctx.save(); ctx.globalAlpha = a * .45; softFill(ctx, P, 0, 0, r * .6 * U, 'rgb(250,243,226)'); ctx.restore();
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = paperPat(); ctx.fill(P); ctx.restore();
}
/* --- versión «antes»: brillos de videojuego --- */
function glowDot(c, r, col, a) { if (a <= .01) return; const g = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], r); g.addColorStop(0, `rgba(255,244,214,${a})`); g.addColorStop(.35, `rgba(${col},${.55 * a})`); g.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = g; ctx.fillRect(c[0] - r, c[1] - r, r * 2, r * 2); }
function glowLine(a, b, col, al) { if (al <= .01) return; ctx.lineCap = 'round'; ctx.strokeStyle = `rgba(${col},${.85 * al})`; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke(); ctx.strokeStyle = `rgba(255,248,230,${al})`; ctx.lineWidth = 2.5; ctx.stroke(); }

/* ---------- pestaña ---------- */
const FXP = 4.8;   // periodo del ciclo
function drawEfectos(t, ticks) {
  const o = ST.efectos, S = STYLES[ST.style]; SC.sil = ST.style === 'tinta'; SC.boil = ST.boil; SC.t = t;
  const tt = o.slow ? t * .35 : t, ph = tt % FXP;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(PAPER, 0, 0); T0();
  const other = ST.who === 'damien' ? 'anami' : 'damien';
  [['antes', -250], ['ahora', 250]].forEach(([mode, cy], i) => {
    ctx.save(); ctx.beginPath(); ctx.rect(-SW / 2, cy - 245, SW, 490); ctx.clip();
    const gy = cy + 165, k = 2.75, fph = mode === 'ahora' ? Math.floor(ph * 12) / 12 : ph;
    /* cielo de anochecer (tono medio: la tinta y el papel se leen encima) */
    if (ST.style === 'tinta') {
      ctx.fillStyle = 'rgba(58,64,88,.78)'; ctx.fillRect(-SW / 2, cy - 250, SW, 500);
      if (!TINTA.tex) TINTA.tex = ctx.createPattern(WASHTEX, 'repeat');
      ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = .5; ctx.fillStyle = TINTA.tex; ctx.fillRect(-SW / 2, cy - 250, SW, 500); ctx.restore();
      ctx.fillStyle = 'rgba(20,18,26,.55)'; ctx.fillRect(-SW / 2, gy, SW, 300);
    } else { S.bg({ ground: gy, hz: gy - 60 }); T0(); ctx.beginPath(); ctx.rect(-SW / 2, cy - 245, SW, 490); ctx.clip(); }
    label(mode === 'antes' ? 'Antes · brillos' : 'Ahora · tinta y papel', -SW / 2 + 30, cy - 205, { align: 'left', size: 30, col: ST.style === 'boceto' ? 'rgba(40,30,32,.8)' : 'rgba(239,230,210,.85)' });
    const L = { d: nrm2([.3, -1]), z: -.6 };
    /* coreografía según el hechizo */
    const kind = o.kind, hc = HOUSES[CAST[ST.who].house], oc = HOUSES[CAST[other].house];
    let lRaise = sm((ph - .55) / .45) * (1 - sm((ph - 3.4) / .8)), rRaise = 0, knock = 0, crouch = 0;
    let lTarget = [lerp(10, 33, lRaise), lerp(-26, -70, lRaise)];
    if (kind === 'escudo') { lTarget = [lerp(10, 26, lRaise), lerp(-26, -82, lRaise)]; rRaise = sm((ph - .95) / .35) * (1 - sm((ph - 3) / .8)); }
    if (kind === 'maldicion') lTarget = [lerp(10, 30, lRaise), lerp(-26, -52, lRaise)];
    if (kind === 'ataque') knock = eio(clamp((ph - 1.75) / .3)) * (1 - sm((ph - 2.9) / 1.4));
    if (kind === 'maldicion') crouch = sm((ph - 2.3) / .9) * (1 - sm((ph - 3.9) / .8));
    const Lf = bodyRig({ x0: -560, y0: gy, k, t: tt, target: lTarget, hy: 47.5, crouchK: 0, who: ST.who, key: `fx${i}l`, ticks, yawAdd: 0, wand: true }); Lf.target = null;
    const Rf = bodyRig({ x0: 470 + knock * 26 * k, y0: gy, k, t: tt, target: kind === 'escudo' ? [lerp(10, 32, rRaise), lerp(-26, -70, rRaise)] : [10, -26], hy: 47.5 - crouch * 13, crouchK: crouch * .9 - knock * .5, who: other, key: `fx${i}r`, ticks, yawAdd: 0, flip: true, wand: kind === 'escudo' }); Rf.target = null;
    renderFig(Lf, S, L, {}, 0); renderFig(Rf, S, L, {}, 1);
    const tipL = Lf.wandTip, tipR = Rf.wandTip, chest = Rf.X([2, -60 + crouch * 10]), feet = Rf.X([2, -2]);
    if (mode === 'antes') fxAntes(kind, ph, tipL, tipR, chest, feet, hc, oc, Lf);
    else fxAhora(kind, fph, tipL, tipR, chest, feet, hc, oc, Lf, gy, cy);
    ctx.restore();
  });
  ctx.strokeStyle = 'rgba(239,230,210,.6)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-SW / 2, 0); ctx.lineTo(SW / 2, 0); ctx.stroke();
}
function fxAntes(kind, ph, tipL, tipR, chest, feet, hc, oc, Lf) {
  if (kind === 'ataque') {
    glowDot(tipL, 45 * sm((ph - 1) / .45), hc.g, sm((ph - 1) / .4) * (1 - sm((ph - 1.5) / .2)));
    const f = clamp((ph - 1.45) / .3), fade = 1 - sm((ph - 1.75) / .4);
    if (ph > 1.45) glowLine(lerp2(tipL, chest, Math.max(0, f - .4)), lerp2(tipL, chest, f), hc.g, fade);
    if (ph > 1.75) glowDot(chest, 40 + 90 * sm((ph - 1.75) / .4), hc.c, 1 - sm((ph - 1.75) / .7));
  } else if (kind === 'escudo') {
    const sc = Lf.X([4, -50]), a = sm((ph - .9) / .4) * (1 - sm((ph - 2.8) / .6));
    if (a > .01) { const g = ctx.createRadialGradient(sc[0], sc[1], 110, sc[0], sc[1], 185); g.addColorStop(0, `rgba(${hc.g},0)`); g.addColorStop(.7, `rgba(${hc.g},${.45 * a})`); g.addColorStop(1, `rgba(${hc.g},0)`); ctx.fillStyle = g; ctx.fillRect(sc[0] - 185, sc[1] - 185, 370, 370); }
    if (tipR) { glowDot(tipR, 40, oc.g, sm((ph - 1.2) / .25) * (1 - sm((ph - 1.5) / .2))); const hit = add(sc, [160, -14]), f = clamp((ph - 1.45) / .3);
      if (ph > 1.45) glowLine(lerp2(tipR, hit, Math.max(0, f - .4)), lerp2(tipR, hit, f), oc.g, 1 - sm((ph - 1.75) / .3));
      if (ph > 1.75) glowDot(hit, 30 + 60 * sm((ph - 1.75) / .3), oc.c, 1 - sm((ph - 1.75) / .5)); }
  } else {
    const f = clamp((ph - 1.1) / .9), a = 1 - sm((ph - 3.4) / .8);
    if (ph > 1.1) glowLine(tipL, lerp2(tipL, chest, f), HOUSES.S.c, a);
    if (ph > 2) glowDot(chest, 70, HOUSES.S.c, a * .8);
  }
}
const lerp2 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
function fxAhora(kind, ph, tipL, tipR, chest, feet, hc, oc, Lf, gy, cy) {
  const inv = (a, b) => ph >= a && ph < b;   // fotogramas invertidos del golpe
  if (kind === 'ataque') {
    /* carga: la tinta se recoge hacia la punta (trazos que convergen) y la punta se «levanta» a papel */
    const ch = clamp((ph - 1.0) / .45);
    if (ch > 0 && ph < 1.5) { for (let s = 0; s < 6; s++) { const an = s / 6 * TAU + ph * 3, r0 = 70 * (1 - ch) + 14, p0 = add(tipL, [Math.cos(an) * r0, Math.sin(an) * r0]), p1 = add(tipL, [Math.cos(an + .5) * (r0 * .45), Math.sin(an + .5) * (r0 * .45)]);
      inkStroke([p0, lerp2(p0, p1, .5), p1], { w: t => 7 * (1 - t * .6), col: hc.c, a: .85, dry: .4, seed: s, bristles: 3 }); }
      paperLight(tipL, 6 + 16 * ch, ch); }
    /* golpe: pincelada curva del color de la casa con alma de papel */
    const path = bez(tipL, [lerp(tipL[0], chest[0], .5), Math.min(tipL[1], chest[1]) - 70], chest, 30);
    const f = clamp((ph - 1.45) / .25), dis = sm((ph - 1.9) / 1.4);
    if (ph >= 1.45 && dis < 1) {
      /* el color sangra en el papel por donde pasó: un lavado ancho y desenfocado bajo el trazo */
      if (ph > 1.6) { const wash = varPoly(path.slice(0, Math.max(2, Math.round(30 * f))), t => 70 * Math.sin(Math.min(1, t * 1.2) * PI * .5 + .2)); ctx.save(); ctx.globalAlpha = .35 * sm((ph - 1.6) / .5) * (1 - dis); softFill(ctx, pathOf([wash], true), 0, 0, 22 * U, `rgb(${hc.c})`); ctx.restore(); }
      inkStroke(path, { w: t => 56 * Math.min(1, t * 8) * (1 - t * .5) * (1 + .22 * Math.sin(t * 11 + 1) * Math.sin(t * 4.3)), col: hc.c, a: .93 * (1 - dis), prog: f, from: dis * .9, dry: .62, seed: 3, core: .3, coreA: 1 - dis, bristles: 11 });
    }
    /* impacto: flor de luz (oro/plata de la casa) con papel reservado en el centro; nunca rojo sobre el cuerpo */
    if (ph >= 1.75 && ph < 3.4) { const g = sm((ph - 1.75) / .35), fade = 1 - sm((ph - 2.3) / .9); inkBloom(chest, 24 + 62 * g, hc.g, .8 * fade, 4, .9, 7); paperLight(chest, 30 * (1 - sm((ph - 1.75) / .6)) + 4, fade); }
    if (inv(1.75, 1.92)) impactFrame(cy);
  } else if (kind === 'escudo') {
    /* ensō: el círculo de un solo trazo, dibujado en vivo, abierto al final */
    const sc = Lf.X([4, -50]), R = 150, RY = 172, pr = clamp((ph - .9) / .45), fade = sm((ph - 2.8) / .8);
    const ring = []; for (let s = 0; s <= 60; s++) { const an = -PI * .62 + s / 60 * TAU * .97; ring.push([sc[0] + Math.cos(an) * R * (1 + .035 * Math.sin(s * .8)), sc[1] + Math.sin(an) * RY]); }
    if (pr > 0 && fade < 1) {
      inkStroke(ring, { w: t => 40 * Math.min(1, t * 12) * (1 - t * .55) * (1 + .15 * Math.sin(t * 13)), col: hc.c, a: .92 * (1 - fade), prog: pr, dry: .62, seed: 7, core: .22, coreA: .9 * (1 - fade), bristles: 10 });
      if (ph > 1.75) { const rp = sm((ph - 1.75) / .7); ctx.strokeStyle = `rgba(${hc.g},${.7 * (1 - rp)})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(sc[0], sc[1], R * (1 + rp * .3), RY * (1 + rp * .3), 0, 0, TAU); ctx.stroke(); }
    }
    if (tipR) {
      const hit = add(sc, [R * .98, -14]), f = clamp((ph - 1.45) / .3);
      if (ph > 1.2 && ph < 1.5) paperLight(tipR, 6 + 12 * sm((ph - 1.2) / .25), 1);
      const bolt = bez(tipR, [lerp(tipR[0], hit[0], .5), Math.min(tipR[1], hit[1]) - 40], hit, 24);
      if (ph >= 1.45 && ph < 2.2) inkStroke(bolt, { w: t => 32 * Math.min(1, t * 8) * (1 - t * .5) * (1 + .2 * Math.sin(t * 9)), col: oc.c, bristles: 9, a: .9 * (1 - sm((ph - 1.8) / .4)), prog: f, from: sm((ph - 1.75) / .4), dry: .75, seed: 2, core: .3 });
      /* el golpe rebota en gotas */
      if (ph >= 1.75 && ph < 2.8) { const a = 1 - sm((ph - 1.9) / .9), age = ph - 1.75, rr = mulberry32(11);
        inkBloom(hit, 18 + 26 * sm(age / .3), oc.c, .8 * a, 9, .8, 5);
        ctx.fillStyle = `rgba(${oc.c},${a})`; for (let d = 0; d < 9; d++) { const an = -PI * .5 + (rr() - .3) * 2.2, sp = 150 + rr() * 220; const x = hit[0] + Math.cos(an) * sp * age * (an > 0 ? -1 : 1) * .2 + sp * age * .8, y = hit[1] + Math.sin(an) * sp * age + 380 * age * age; if (y < gy) { ctx.beginPath(); ctx.arc(x, y, 3 + rr() * 5, 0, TAU); ctx.fill(); } } }
      if (inv(1.75, 1.84)) impactFrame(cy);
    }
  } else {
    /* maldición: un zarcillo verde que crece despacio, se arrastra por el suelo y trepa enroscándose */
    const g = HOUSES.S, gr = clamp((ph - 1.05) / 1.6), fade = sm((ph - 3.5) / 1.1);
    if (ph > .9 && ph < 1.3) paperLight(tipL, 5 + 8 * sm((ph - .9) / .3), 1 - sm((ph - 1.2) / .1));
    const pts = [], gp = [tipL[0] + 40, gy - 4];
    for (let s = 0; s <= 10; s++) pts.push(lerp2(tipL, gp, s / 10).map((v, j) => v + (j ? 0 : Math.sin(s * .9) * 6)));
    for (let s = 1; s <= 30; s++) { const x = lerp(gp[0], feet[0] - 6, s / 30); pts.push([x, gy - 4 - Math.abs(Math.sin(s * .55)) * 9]); }
    for (let s = 1; s <= 26; s++) { const f = s / 26; pts.push([feet[0] + Math.sin(f * TAU * 2.2) * 26 * (1 - f * .3), lerp(feet[1], chest[1] + 20, f)]); }
    if (gr > 0 && fade < 1) {
      inkStroke(pts, { w: t => 9 + 5 * Math.sin(t * 40), col: g.c, a: .92 * (1 - fade), prog: gr, dry: .93, seed: 5, bristles: 4 });
      /* rizos: ganchos que brotan a lo largo del zarcillo */
      const Lp = polyLen(pts), tot = Lp[Lp.length - 1];
      for (let j = 6; j < pts.length - 2; j += 6) { if (Lp[j] / tot > gr) break; const p = pts[j], s = j % 12 ? 1 : -1, cur = []; for (let q = 0; q <= 10; q++) { const an = q / 10 * PI * 1.6, r = 22 * (1 - q / 12); cur.push([p[0] + s * Math.sin(an) * r, p[1] - (1 - Math.cos(an)) * r * .8]); }
        inkStroke(cur, { w: t => 6 * (1 - t), col: g.c, a: .85 * (1 - fade), prog: clamp((gr - Lp[j] / tot) * 6), dry: .6, seed: j, bristles: 3 }); }
      if (gr > .75) inkBloom(lerp2(feet, chest, .5), 40 + 50 * sm((ph - 2.4) / 1), g.c, .4 * (1 - fade), 6);
    }
  }
}
function impactFrame(cy) { ctx.save(); ctx.globalCompositeOperation = 'difference'; ctx.fillStyle = 'rgb(239,230,210)'; ctx.fillRect(-SW / 2, cy - 250, SW, 500); ctx.restore(); }
