/* =====================================================================
   ESCENARIOS · TELA PESADA HORNEADA (sábanas de lino, manteles, delantales)
   Una malla Verlet 3D se simula UNA vez en la carga (reposo + el golpe + la caída) y se guardan los cuadros
   a 60 Hz: en la película la tela es función de t (se puede saltar, no depende de los Hz de la pantalla).
   Colisiones con cajas (colchón, mesa), esferas (el personaje debajo) y el suelo, con fricción.
   ===================================================================== */
function clothBake(o) {
  const nx = o.nx, ny = o.ny, N = nx * ny, P = new Float32Array(N * 3), Q = new Float32Array(N * 3);
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const p = o.at(i / (nx - 1), j / (ny - 1)), k = (j * nx + i) * 3; P[k] = Q[k] = p[0]; P[k + 1] = Q[k + 1] = p[1]; P[k + 2] = Q[k + 2] = p[2]; }
  const C = [], link = (a, b, s) => { const ka = a * 3, kb = b * 3; C.push(a, b, Math.hypot(P[ka] - P[kb], P[ka + 1] - P[kb + 1], P[ka + 2] - P[kb + 2]), s); };
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const a = j * nx + i;
    if (i < nx - 1) link(a, a + 1, 1); if (j < ny - 1) link(a, a + nx, 1);
    if (i < nx - 1 && j < ny - 1) { link(a, a + nx + 1, .6); link(a + 1, a + nx, .6); }
    if (i < nx - 2) link(a, a + 2, o.bend ?? .25); if (j < ny - 2) link(a, a + nx * 2, o.bend ?? .25); }
  const dt = 1 / (o.hz ?? 240), g = 980 * (o.g ?? 1), drag = o.drag ?? .6, fr = o.friction ?? .5;
  const step = (t) => {
    const cols = o.colliders ? o.colliders(t) : [];
    for (let k = 0; k < N; k++) { const b = k * 3; for (let a = 0; a < 3; a++) { const v = (P[b + a] - Q[b + a]) * (1 - drag * dt); Q[b + a] = P[b + a]; P[b + a] += v + (a === 1 ? g * dt * dt : 0); } }
    if (o.kick) for (let k = 0; k < N; k++) { const v = o.kick(t, k % nx, Math.floor(k / nx), P[k * 3], P[k * 3 + 1], P[k * 3 + 2]); if (v) for (let a = 0; a < 3; a++) Q[k * 3 + a] -= v[a] * dt; }
    for (let it = 0; it < (o.iter ?? 6); it++) {
      for (let c = 0; c < C.length; c += 4) { const a = C[c] * 3, b = C[c + 1] * 3, L = C[c + 2], s = C[c + 3] * .5;
        const dx = P[b] - P[a], dy = P[b + 1] - P[a + 1], dz = P[b + 2] - P[a + 2], d = Math.hypot(dx, dy, dz) || 1, e = (d - L) / d * s;
        P[a] += dx * e; P[a + 1] += dy * e; P[a + 2] += dz * e; P[b] -= dx * e; P[b + 1] -= dy * e; P[b + 2] -= dz * e; }
      for (let k = 0; k < N; k++) { const b = k * 3;
        if (P[b + 1] > -.5) { P[b + 1] = -.5; Q[b] = lerp(Q[b], P[b], fr); Q[b + 2] = lerp(Q[b + 2], P[b + 2], fr); }
        for (const B of cols) {
          if (B.t === 'box') { if (P[b] > B.x0 && P[b] < B.x1 && P[b + 2] > B.z0 && P[b + 2] < B.z1 && P[b + 1] > B.y0 && P[b + 1] < B.y1) {
              const dTop = P[b + 1] - B.y0, dBot = B.y1 - P[b + 1], dL = P[b] - B.x0, dR = B.x1 - P[b], dF = P[b + 2] - B.z0, dK = B.z1 - P[b + 2], m = Math.min(dTop, dBot, dL, dR, dF, dK);
              if (m === dBot) { P[b + 1] = B.y1; Q[b + 1] = P[b + 1]; }
              else if (m === dTop) { P[b + 1] = B.y0; Q[b] = lerp(Q[b], P[b], fr); Q[b + 2] = lerp(Q[b + 2], P[b + 2], fr); } else if (m === dL) P[b] = B.x0; else if (m === dR) P[b] = B.x1; else if (m === dF) P[b + 2] = B.z0; else P[b + 2] = B.z1; } }
          else { const dx = P[b] - B.c[0], dy = P[b + 1] - B.c[1], dz = P[b + 2] - B.c[2], d = Math.hypot(dx, dy, dz); if (d < B.r && d > 1e-3) { const k2 = B.r / d; P[b] = B.c[0] + dx * k2; P[b + 1] = B.c[1] + dy * k2; P[b + 2] = B.c[2] + dz * k2; Q[b] = lerp(Q[b], P[b], fr * .5); Q[b + 2] = lerp(Q[b + 2], P[b + 2], fr * .5); } }
        } }
    }
  };
  /* reposo, luego los cuadros */
  const fps = 60, t0 = o.t0, t1 = o.t1, sub = Math.round(1 / dt / fps), frames = [];
  let t = t0 - (o.settle ?? 2.5); while (t < t0) { step(t); t += dt; }
  for (let f = 0; f <= Math.ceil((t1 - t0) * fps); f++) { frames.push(P.slice()); for (let s = 0; s < sub; s++) { step(t); t += dt; } }
  return { nx, ny, t0, fps, frames };
}
function clothAt(B, t) {
  const f = (t - B.t0) * B.fps; if (f <= 0) return B.frames[0]; if (f >= B.frames.length - 1) return B.frames[B.frames.length - 1];
  const i = Math.floor(f), u = f - i, A = B.frames[i], C = B.frames[i + 1], o = new Float32Array(A.length); for (let k = 0; k < A.length; k++) o[k] = A[k] + (C[k] - A[k]) * u; return o;
}
/* dibujo: cuadriláteros de atrás adelante con sombreado por normal (la luz entra por la ventana), un poco de sol
   si el centro cae en un haz, y un borde de tinta en el dobladillo. o.bump(x,y,z) → desplazamiento y (respirar) */
function clothDraw(B, t, o = {}) {
  const Pf = clothAt(B, t), nx = B.nx, ny = B.ny, at = (i, j) => { const k = (j * nx + i) * 3; let y = Pf[k + 1]; if (o.bump) y += o.bump(Pf[k], y, Pf[k + 2]); return [Pf[k], y, Pf[k + 2]]; };
  if (!SOL.d) solNorm();
  const L = SOL.d, base = o.c || [240, 234, 222], shade = o.shade || [150, 140, 170], Qs = [], VN = new Float32Array(nx * ny * 3);
  for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) { const a = at(i, j), b = at(i + 1, j), c = at(i + 1, j + 1), d = at(i, j + 1), u = [c[0] - a[0], c[1] - a[1], c[2] - a[2]], v = [d[0] - b[0], d[1] - b[1], d[2] - b[2]], n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]], l = Math.hypot(...n) || 1;
    for (const [ii, jj] of [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]]) { const k = (jj * nx + ii) * 3; VN[k] += n[0] / l; VN[k + 1] += n[1] / l; VN[k + 2] += n[2] / l; } }
  for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
    const a = at(i, j), b = at(i + 1, j), c = at(i + 1, j + 1), d = at(i, j + 1);
    const u = [c[0] - a[0], c[1] - a[1], c[2] - a[2]], v = [d[0] - b[0], d[1] - b[1], d[2] - b[2]];
    let n = [0, 0, 0]; for (const [ii, jj] of [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]]) { const k = (jj * nx + ii) * 3; n[0] += VN[k]; n[1] += VN[k + 1]; n[2] += VN[k + 2]; } const nl = Math.hypot(...n) || 1; n = n.map(q => q / nl);
    const zc = (a[2] + b[2] + c[2] + d[2]) / 4; Qs.push([zc, [a, b, c, d], n, i, j]);
  }
  Qs.sort((p, q) => q[0] - p[0]);
  ctx.save(); ctx.lineJoin = 'round';
  for (const [, pts, n, i, j] of Qs) {
    const P = poly3(pts); if (!P) continue;
    const lam = Math.abs(n[0] * -L[0] + n[1] * -L[1] + n[2] * -L[2]), up = Math.max(0, -n[1]) * .25, f = clamp(.34 + .6 * lam + up);
    const cen = [(pts[0][0] + pts[2][0]) / 2, (pts[0][1] + pts[2][1]) / 2, (pts[0][2] + pts[2][2]) / 2];
    let col = mixc(shade, base, f); const sun = SOL.on * SOL.k * (solIn(pts[0]) + solIn(pts[1]) + solIn(pts[2]) + solIn(pts[3]) + 2 * solIn(cen)) / 6; if (sun > 0) col = mixc(col, mixc(base, SOL.col, .5), .55 * sun);
    ctx.fillStyle = cssc(col); ctx.strokeStyle = cssc(col); ctx.lineWidth = .9; ctx.fill(P); ctx.stroke(P);
  }
  /* dobladillo */
  const edge = []; for (let i = 0; i < nx; i++) edge.push(at(i, 0)); for (let j = 1; j < ny; j++) edge.push(at(nx - 1, j)); for (let i = nx - 2; i >= 0; i--) edge.push(at(i, ny - 1)); for (let j = ny - 2; j > 0; j--) edge.push(at(0, j));
  const E = clipNear(edge); if (E.length > 2) { const sp = pj3(E); ctx.strokeStyle = cssc(o.ink || [110, 96, 110], .55); ctx.lineWidth = Math.max(.8, 1.4 * PS(edge[0][2]) * (o.inkW ?? 1)); ctx.beginPath(); sp.forEach((p, k) => k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); ctx.stroke(); }
  ctx.restore();
  return Pf;
}
/* polígonos de la tela para que proyecte sombra (bloques de 2×2) */
function clothOcc(B, t, a = .7) {
  const Pf = clothAt(B, t), nx = B.nx, ny = B.ny, at = (i, j) => { const k = (j * nx + i) * 3; return [Pf[k], Pf[k + 1], Pf[k + 2]]; }, o = [];
  for (let j = 0; j < ny - 1; j += 2) for (let i = 0; i < nx - 1; i += 2) { const i1 = Math.min(nx - 1, i + 2), j1 = Math.min(ny - 1, j + 2); o.push({ pts: [at(i, j), at(i1, j), at(i1, j1), at(i, j1)], a }); }
  return o;
}
