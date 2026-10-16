/* =====================================================================
   BLOQUE 6 · el tiquete de producción: los campos se llenan a mano, Aguada sella el modo,
   una pincelada lo cruza y la película vuelve a pintarse. Tarjeta final.
   ===================================================================== */
const TK = { x: 0, y: -40, w: 1080, h: 820 };
const TK_FIELDS = [
  ['La idea', 'Una tacita explica cómo se hace una película con código', 174.6],
  ['Los personajes', 'Aguada · tacita de agua con boina, en 8 bits', 176.2],
  ['Lo que no se toca', 'Su diseño · nada de neón · violencia nula', 178.1]];
const TK_MODES = [['CONTROL', 184.0], ['AUTO', 185.1], ['ASISTIDO', 186.3]];
function modeBox(i) { return [TK.x - 330 + i * 330, TK.y + 250]; }
/* texto que se escribe letra a letra entre t0 y t0 + d */
function typeIn(txt, x, y, t, t0, d, size, col, o) { const n = Math.floor(clamp((t - t0) / d) * txt.length); if (n > 0) hand(txt.slice(0, n), x, y, size, col, o); }
function ticketDraw(t, bgDraw) {
  /* fondo: el invernadero desenfocado y aclarado */
  bgDraw(); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = `blur(${Math.round(10 * U)}px)`; ctx.drawImage(cv, 0, 0); ctx.filter = 'none'; ctx.globalAlpha = .45; ctx.fillStyle = '#efe4cc'; ctx.fillRect(0, 0, W, H); ctx.restore();
  L0s();
  const slide = easeOut((t - 171.7) / 1.1), y = TK.y + (1 - slide) * 900;
  ctx.save(); ctx.translate(TK.x, y); ctx.rotate(-.018 * slide);
  sheet(0, 0, TK.w, TK.h);
  ctx.strokeStyle = 'rgba(42,33,28,.35)'; ctx.lineWidth = 1.5; ctx.setLineDash([8, 7]); ctx.strokeRect(-TK.w / 2 + 40, -TK.h / 2 + 40, TK.w - 80, TK.h - 80); ctx.setLineDash([]);
  hand('TIQUETE DE PRODUCCIÓN', 0, -TK.h / 2 + 108, 46, 'rgba(42,33,28,.9)', { serif: true, w: 600 });
  hand('Claude Hollywood · nº 101', 0, -TK.h / 2 + 150, 28, 'rgba(42,33,28,.55)', { serif: true, w: 500 });
  TK_FIELDS.forEach(([lab, val, t0], i) => {
    const fy = -TK.h / 2 + 230 + i * 110;
    hand(lab, -TK.w / 2 + 90, fy, 28, 'rgba(42,33,28,.6)', { serif: true, w: 600, align: 'left' });
    ctx.strokeStyle = 'rgba(42,33,28,.25)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-TK.w / 2 + 90, fy + 52); ctx.lineTo(TK.w / 2 - 90, fy + 52); ctx.stroke();
    typeIn(val, -TK.w / 2 + 96, fy + 44, t, t0, 1.6, 40, 'rgba(36,40,92,.92)', { align: 'left' });
  });
  hand('El modo', -TK.w / 2 + 90, 170, 28, 'rgba(42,33,28,.6)', { serif: true, w: 600, align: 'left' });
  TK_MODES.forEach(([m, ts], i) => {
    const [bx, by] = modeBox(i), bxL = bx - TK.x, byL = by - TK.y;
    ctx.strokeStyle = 'rgba(42,33,28,.6)'; ctx.lineWidth = 2; ctx.strokeRect(bxL - 120, byL - 44, 240, 88);
    hand(m, bxL, byL + 12, 34, 'rgba(42,33,28,.75)', { serif: true, w: 600 });
    const st = t - ts; if (st > 0) {   /* el sello: tinta roja, un poco torcido, golpe con escala */
      const k = st < .12 ? 1.35 - st / .12 * .35 : 1;
      ctx.save(); ctx.translate(bxL, byL); ctx.rotate(-.12 + i * .1); ctx.scale(k, k); ctx.globalAlpha = .85 * sm(st / .08);
      ctx.strokeStyle = 'rgb(176,24,38)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(0, 0, 128, 56, 0, 0, TAU); ctx.stroke(); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(0, 0, 118, 47, 0, 0, TAU); ctx.stroke();
      ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(52, -6); ctx.lineTo(70, 14); ctx.lineTo(104, -40); ctx.stroke();
      ctx.globalCompositeOperation = 'destination-out'; ctx.globalAlpha = .35; for (let j = 0; j < 30; j++) { ctx.beginPath(); ctx.arc((hsh(j, i) - .5) * 190, (hsh(j, i + 3) - .5) * 100, 2 + hsh(j, i + 5) * 5, 0, TAU); ctx.fill(); }
      ctx.restore();
    }
  });
  ctx.restore(); T0();
}
/* la pincelada que cruza el tiquete: «y Claude se pone a pintar» */
function brushSweep(t) {
  const f = clamp((t - 188.4) / 1.3); if (f <= 0) return;
  L0s(); const pts = []; for (let i = 0; i <= 40; i++) { const u = i / 40 * f; pts.push([lerp(-SW / 2 - 60, SW / 2 + 60, u), 20 + Math.sin(u * 5) * 50 - u * 60]); }
  if (pts.length < 2) return;
  ctx.fillStyle = 'rgba(200,104,30,.88)'; ctx.fill(pPolys([stripP(pts, u => (70 + 30 * Math.sin(u * 9)) * (u < .05 ? u / .05 : 1))]));
  ctx.strokeStyle = 'rgba(150,64,20,.6)'; ctx.lineWidth = 2; for (let k = -3; k <= 3; k++) ctx.stroke(pLine(pts.map((p, i) => [p[0], p[1] + k * 14 + N2(i * .2, k) * 6])));
  T0();
}
/* tarjeta final */
function endCard(t) {
  const a = sm((t - 196.6) / 1.2); if (a <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; ctx.drawImage(PAPER, 0, 0, W, H); ctx.restore(); L0s();
  const b = sm((t - 197.4) / 1.2), c = sm((t - 198.6) / 1.2), d = sm((t - 199.6) / 1.2), out = 1 - sm((t - 204.4) / 1.4);
  ctx.save(); ctx.globalAlpha = b * out; hand('Claude Hollywood 101', 0, -130, 104, 'rgba(36,28,24,.92)', { serif: true, w: 500 });
  ctx.strokeStyle = 'rgba(200,104,30,.8)'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-260 * b, -86); ctx.quadraticCurveTo(0, -70, 260 * b, -90); ctx.stroke();
  ctx.globalAlpha = c * out; hand('Una producción de Nico · hecha con Claude', 0, -10, 40, 'rgba(36,28,24,.8)', { serif: true, w: 500 });
  ctx.globalAlpha = d * out; hand('Voz de Aguada: Fruna (ElevenLabs) · todo lo demás: código', 0, 44, 30, 'rgba(36,28,24,.6)', { serif: true, w: 500 });
  hand('primera clase', 0, 98, 34, 'rgba(176,24,38,.75)');
  ctx.restore(); T0();
  /* Aguada se despide: salta y parpadea */
  const st = { f: { blink: Math.sin(t * 2.3) > .97, slosh: Math.floor(t * 4) % 2 ? 1 : -1 } }, hop = Math.max(0, Math.sin((t - 199) * 5)) * (t > 199 && t < 203 ? 1 : 0);
  if (a > .5) { ctx.save(); ctx.globalAlpha = out; const cell = Math.round(H / 150); agBlit(agCanvas(st.f), W / 2, H * .86 - hop * cell * 6, cell, { a: out }); ctx.restore(); }
}
