/* =====================================================================
   ESCENA 1 · LA UTILERÍA DEL ESTUDIO (pintada una vez; lo que se mueve se dibuja vivo)
   estantería pandeada con libros de Sobremesa y cientos de post-its · láminas del Gabinete (cortes de carne
   botánicos) y de Tsukiyo (cuchillos) · diploma de la Guía Brújula (vibra cuando la puerta rebota) · puerta con
   tablero · escritorio rayado con taza seca de Molienda y cuaderno de emplatados · monstera con hojas que proyectan
   sombra · ropa en una pila · zuecos Firme · cama con lino · mesita y despertador Kronotek
   ===================================================================== */
const PROPS = {};
const SPINE = [[118, 36, 40], [44, 72, 56], [36, 48, 86], [190, 146, 64], [228, 216, 190], [34, 30, 32], [150, 84, 50], [96, 40, 70], [70, 100, 110], [200, 92, 54], [236, 200, 120], [60, 60, 66]];
const POSTIT = [[250, 226, 90], [255, 150, 170], [150, 220, 140], [255, 170, 80], [130, 200, 240], [220, 160, 240]];
/* ---------- estantería (frente: 210 × 228, con el fondo en sombra y las baldas pandeadas) ---------- */
function paintShelf() {
  const w = 210, h = 228, T = tex(w, h, 2.2), g = T.g, r = mulberry32(77), wood = [128, 84, 54];
  g.fillStyle = 'rgb(40,28,26)'; g.fillRect(0, 0, w, h);
  const back = g.createLinearGradient(0, 0, w, 0); back.addColorStop(0, 'rgba(70,48,40,.8)'); back.addColorStop(.5, 'rgba(90,64,52,.5)'); back.addColorStop(1, 'rgba(60,40,36,.8)'); g.fillStyle = back; g.fillRect(6, 4, w - 12, h - 8);
  const shelves = [4, 52, 98, 144, 190, 226], sag = k => 4.5 + k * .4;
  const by = (k, x) => shelves[k] + Math.sin((x - 6) / (w - 12) * PI) * sag(k);
  for (let k = 1; k < shelves.length; k++) {
    /* libros sobre la balda k (el estante de abajo se apoya en by(k)) */
    let x = 8; const room = shelves[k] - shelves[k - 1] - 6;
    while (x < w - 10) {
      if (r() < .07 && x < w - 40) {   /* pila horizontal */
        let yy = 0; const pw = 22 + r() * 12; for (let n = 0; n < 2 + (r() * 4 | 0); n++) { const th = 3 + r() * 3, c = SPINE[r() * SPINE.length | 0], base = by(k, x + pw / 2) - yy; wcWash(g, rectP(x, base - th, pw, th), c, .97, { reserve: false, mode: 'source-over', amt: .2, seed: x + n, edge: false, step: 8 }); g.fillStyle = 'rgba(240,230,200,.5)'; g.fillRect(x + 1, base - th * .5, pw - 2, .5); yy += th; }
        x += pw + 2; continue; }
      if (r() < .05 && x < w - 30) {   /* objeto: mortero o bote de palillos */
        const base = by(k, x + 8); if (r() < .5) { wcWash(g, [[x, base], [x + 16, base], [x + 18, base - 10], [x - 2, base - 10]], [70, 66, 66], .98, { reserve: false, mode: 'source-over', amt: .3, seed: x, step: 6 }); g.strokeStyle = 'rgb(140,110,80)'; g.lineWidth = 2; g.beginPath(); g.moveTo(x + 10, base - 10); g.lineTo(x + 18, base - 22); g.stroke(); }
        else { wcWash(g, rectP(x, base - 14, 10, 14), [200, 196, 186], .98, { reserve: false, mode: 'source-over', amt: .2, seed: x, step: 6 }); for (let n = 0; n < 6; n++) { g.strokeStyle = n % 2 ? 'rgb(150,40,40)' : 'rgb(196,160,110)'; g.lineWidth = .9; g.beginPath(); g.moveTo(x + 2 + n * 1.3, base - 14); g.lineTo(x + n * 1.8 - 1, base - 28 - r() * 4); g.stroke(); } }
        x += 22; continue; }
      const bw = 2.6 + r() * 4.6, bh = Math.min(room, 22 + r() * 18), lean = r() < .1 ? (r() - .5) * .25 : 0, base = by(k, x + bw / 2), c = shc(SPINE[r() * SPINE.length | 0], (r() - .5) * .14);
      g.save(); g.translate(x + bw / 2, base); g.rotate(lean);
      const sp = [[-bw / 2, 0], [bw / 2, 0], [bw / 2, -bh], [-bw / 2, -bh]], gr = g.createLinearGradient(-bw / 2, 0, bw / 2, 0); gr.addColorStop(0, cssc(shc(c, -.25))); gr.addColorStop(.35, cssc(shc(c, .12))); gr.addColorStop(1, cssc(shc(c, -.2)));
      g.fillStyle = gr; g.fill(pPolys([sp]));
      /* bandas doradas y etiqueta del lomo */
      g.fillStyle = 'rgba(214,180,100,.75)'; if (r() < .7) { g.fillRect(-bw / 2 + .3, -bh + 2, bw - .6, .5); g.fillRect(-bw / 2 + .3, -4, bw - .6, .5); }
      if (r() < .35) { g.fillStyle = cssc(shc(c, .5), .8); g.fillRect(-bw / 2 + .5, -bh * .62, bw - 1, bh * .16); }
      if (bw > 4.5 && r() < .5) { g.save(); g.rotate(-PI / 2); g.font = `600 ${bw * .5}px ${MFONT.serif}`; g.fillStyle = 'rgba(236,214,160,.85)'; g.textBaseline = 'middle'; g.fillText(pickT(r), 4, 0, bh - 8); g.restore(); }
      /* post-its que asoman por arriba */
      const np = r() < .6 ? 1 + (r() * 3 | 0) : 0; for (let n = 0; n < np; n++) { const pc = POSTIT[r() * POSTIT.length | 0], px = -bw / 2 + r() * (bw - 1.6), ph = 2.5 + r() * 3; g.fillStyle = cssc(pc); g.fillRect(px, -bh - ph, 1.8 + r() * .8, ph + 1); g.fillStyle = 'rgba(0,0,0,.15)'; g.fillRect(px, -bh, 1.8, .5); }
      if (r() < .25) { const pc = POSTIT[r() * POSTIT.length | 0]; g.fillStyle = cssc(pc); g.fillRect(bw / 2 - .4, -bh * (.3 + r() * .5), 2.2, 1.8); }   // y por el costado
      g.restore();
      x += bw + (r() < .1 ? 1.5 : .25);
    }
    /* balda pandeada, con canto claro */
    const pts = []; for (let i = 0; i <= 20; i++) { const xx = 6 + i * (w - 12) / 20; pts.push([xx, by(k, xx)]); } for (let i = 20; i >= 0; i--) { const xx = 6 + i * (w - 12) / 20; pts.push([xx, by(k, xx) + 3.2]); }
    g.fillStyle = cssc(shc(wood, .05)); g.fill(pPolys([pts])); g.strokeStyle = 'rgba(255,230,190,.35)'; g.lineWidth = .5; g.beginPath(); pts.slice(0, 21).forEach((p, i) => i ? g.lineTo(p[0], p[1] + .3) : g.moveTo(p[0], p[1] + .3)); g.stroke();
    g.fillStyle = 'rgba(20,10,10,.35)'; g.beginPath(); pts.slice(0, 21).forEach((p, i) => i ? g.lineTo(p[0], p[1] - 1.2) : g.moveTo(p[0], p[1] - 1.2)); for (let i = 20; i >= 0; i--) g.lineTo(pts[i][0], pts[i][1]); g.fill();
  }
  /* costados y techo */
  woodGrain(g, 0, 0, 6, h, wood, r, { gap: 1.2, knots: false }); woodGrain(g, w - 6, 0, 6, h, wood, r, { gap: 1.2, knots: false }); woodGrain(g, 0, 0, w, 5, shc(wood, .05), r, { knots: false });
  g.fillStyle = 'rgba(30,18,14,.4)'; g.fillRect(6, 5, 3, h - 6); g.fillRect(w - 9, 5, 3, h - 6);
  wcTex(g, T.c.width, T.c.height, .25, .2);
  return T;
}
function pickT(r) { const L = MARCAS.sobremesa.libros; return L[r() * L.length | 0]; }
/* ---------- lámina: cortes de carne como lámina botánica ---------- */
function paintPosterCuts() {
  const w = 120, h = 150, S = spr([-w / 2, -h, w / 2, 0], 3), g = S.g, r = mulberry32(5);
  g.fillStyle = 'rgb(46,32,26)'; g.fillRect(-w / 2, -h, w, h);
  g.fillStyle = 'rgb(236,226,204)'; g.fillRect(-w / 2 + 5, -h + 5, w - 10, h - 10);
  g.fillStyle = 'rgb(244,236,218)'; g.fillRect(-w / 2 + 12, -h + 12, w - 24, h - 24);
  const ink = 'rgba(92,60,40,.9)';
  g.font = `700 6px ${MFONT.serif}`; g.fillStyle = ink; g.textAlign = 'center'; g.fillText('LÁMINA IV · LOS CORTES', 0, -h + 24); g.font = `italic 4px ${MFONT.serif}`; g.fillText('Bos taurus, según el oficio del carnicero', 0, -h + 30);
  /* la res de perfil, contorno a plumilla, con los cortes en lavados suaves */
  g.save(); g.translate(0, -78); g.scale(.92, .92);
  const body = [[-40, -14], [-30, -22], [-6, -24], [20, -22], [34, -26], [42, -32], [50, -28], [52, -20], [46, -12], [40, -6], [36, 10], [34, 30], [28, 30], [26, 12], [-20, 12], [-24, 30], [-30, 30], [-30, 10], [-40, 0], [-46, -2], [-44, -10]];
  const cuts = [[[-40, -14], [-30, -22], [-18, -23], [-18, 8], [-30, 8], [-42, -2]], [[-18, -23], [2, -24], [2, 10], [-18, 8]], [[2, -24], [20, -22], [22, 12], [2, 10]], [[20, -22], [34, -26], [40, -6], [36, 10], [22, 12]]];
  const cc = [[196, 120, 100], [214, 150, 120], [186, 100, 90], [204, 136, 108]];
  cuts.forEach((q, i) => wcWash(g, q, cc[i], .55, { reserve: false, amt: .6, seed: i, edge: false, step: 4 }));
  wcInk(g, body.concat([body[0]]), .7, .9, 3, .05, [80, 50, 36]);
  g.setLineDash([1.5, 1.2]); g.strokeStyle = ink; g.lineWidth = .5; for (const x of [-18, 2, 21]) { g.beginPath(); g.moveTo(x, -24); g.lineTo(x + (x > 10 ? 1 : 0), 11); g.stroke(); } g.setLineDash([]);
  g.font = `600 4px ${MFONT.serif}`; g.fillStyle = ink; ['I', 'II', 'III', 'IV'].forEach((n, i) => g.fillText(n, [-28, -8, 12, 30][i], -6));
  g.restore();
  /* un helecho y una rama de romero, como en un herbario */
  g.strokeStyle = 'rgba(70,96,60,.85)'; g.lineWidth = .6; g.beginPath(); g.moveTo(-38, -14); g.quadraticCurveTo(-40, -36, -30, -52); g.stroke(); for (let k = 0; k < 9; k++) { const t = k / 9, x = lerp(-38, -30, t), y = lerp(-14, -52, t); g.beginPath(); g.moveTo(x, y); g.lineTo(x - 6 + t * 3, y - 2); g.moveTo(x, y); g.lineTo(x + 6 - t * 3, y - 2); g.stroke(); }
  g.beginPath(); g.moveTo(30, -14); g.quadraticCurveTo(36, -30, 34, -46); g.stroke(); for (let k = 0; k < 12; k++) { const y = -16 - k * 2.6; g.beginPath(); g.ellipse(33 + (k % 2 ? 2 : -2), y, 2.2, .7, k % 2 ? .5 : -.5, 0, TAU); g.stroke(); }
  for (let k = 0; k < 4; k++) { g.font = `3px ${MFONT.serif}`; g.textAlign = 'left'; g.fillText(['I · aguja', 'II · lomo', 'III · cadera', 'IV · pierna'][k], -40 + k * 22, -40 + 26); }
  marcaLogo(g, 'gabinete', -14, -24, 7, { mono: [92, 60, 40], monoBg: [244, 236, 218] });
  g.globalCompositeOperation = 'multiply'; const fox = g.createRadialGradient(30, -30, 2, 30, -30, 40); fox.addColorStop(0, 'rgba(190,150,90,.25)'); fox.addColorStop(1, 'rgba(190,150,90,0)'); g.fillStyle = fox; g.fillRect(-w / 2, -h, w, h);   // manchas de humedad
  wcTex(g, S.c.width, S.c.height, .3, .25);
  return S;
}
/* ---------- lámina: los cuchillos japoneses ---------- */
function paintPosterKnives() {
  const w = 110, h = 100, S = spr([-w / 2, -h, w / 2, 0], 3), g = S.g;
  g.fillStyle = 'rgb(30,28,30)'; g.fillRect(-w / 2, -h, w, h); g.fillStyle = 'rgb(232,228,218)'; g.fillRect(-w / 2 + 4, -h + 4, w - 8, h - 8);
  g.font = `700 5px ${MFONT.sans}`; g.fillStyle = 'rgb(40,40,46)'; g.textAlign = 'left'; g.fillText('HŌCHŌ · ANATOMÍA DEL FILO', -w / 2 + 10, -h + 14);
  const knives = [['GYUTO', 70, 9, .1], ['SANTOKU', 54, 10, .35], ['DEBA', 44, 11, .2], ['NAKIRI', 50, 11, 0], ['PETTY', 40, 6, .1]];
  knives.forEach(([n, L, bw, tip], i) => {
    const y = -h + 26 + i * 14, x0 = -w / 2 + 12;
    g.fillStyle = 'rgb(86,58,40)'; g.fillRect(x0, y - 1.6, 22, 3.6); g.fillStyle = 'rgb(30,26,26)'; g.fillRect(x0 + 21, y - 2, 2.4, 4.4);
    const bx = x0 + 23, P = [[bx, y - 2], [bx + L * (1 - tip * .3), y - 2.2], [bx + L, y + bw * .1 - 2], [bx + L * .82, y + bw - 2], [bx, y + bw * .7 - 2]];
    const gr = g.createLinearGradient(0, y - 2, 0, y + bw); gr.addColorStop(0, 'rgb(214,218,224)'); gr.addColorStop(1, 'rgb(150,156,166)'); g.fillStyle = gr; g.fill(pPolys([P]));
    g.save(); g.clip(pPolys([P])); g.strokeStyle = 'rgba(90,96,110,.45)'; g.lineWidth = .3; for (let k = 0; k < 12; k++) { g.beginPath(); for (let x = bx; x < bx + L; x += 2) g.lineTo(x, y + k * .7 - 1 + Math.sin(x * .3 + k) * .8); g.stroke(); } g.restore();   // damasco
    g.strokeStyle = 'rgb(40,40,46)'; g.lineWidth = .4; g.stroke(pPolys([P]));
    g.font = `600 3.2px ${MFONT.sans}`; g.fillStyle = 'rgb(60,60,66)'; g.fillText(n, bx + L + 3, y + 2);
  });
  marcaLogo(g, 'tsukiyo', w / 2 - 34, -14, 7, {});
  wcTex(g, S.c.width, S.c.height, .25, .22);
  return S;
}
/* ---------- diploma de la Guía Brújula (cuelga de un clavo: el pie del sprite es el clavo) ---------- */
function paintDiploma() {
  const w = 60, h = 74, S = spr([-w / 2, 0, w / 2, h + 4], 4), g = S.g;
  g.strokeStyle = 'rgb(60,50,40)'; g.lineWidth = .6; g.beginPath(); g.moveTo(0, 0); g.lineTo(-18, 6); g.moveTo(0, 0); g.lineTo(18, 6); g.stroke();
  const fr = g.createLinearGradient(-w / 2, 6, w / 2, h); fr.addColorStop(0, 'rgb(214,176,96)'); fr.addColorStop(.5, 'rgb(150,112,52)'); fr.addColorStop(1, 'rgb(200,160,84)'); g.fillStyle = fr; g.fillRect(-w / 2, 6, w, h - 2);
  g.fillStyle = 'rgb(246,240,224)'; g.fillRect(-w / 2 + 5, 11, w - 10, h - 12);
  marcaLogo(g, 'brujula', -9, 15, 18, { layout: 'emblema' });
  g.fillStyle = 'rgb(31,47,85)'; g.textAlign = 'center'; g.font = `700 4.4px ${MFONT.serif}`; g.fillText('GUÍA BRÚJULA', 0, 40); g.font = `italic 3.6px ${MFONT.serif}`; g.fillText('distingue a', 0, 45); g.font = `700 5.2px ${MFONT.serif}`; g.fillText('Brasa y Bruma', 0, 52);
  g.fillStyle = 'rgb(200,162,74)'; mStar(g, -6, 59, 3.4, 1.4, 5); g.fill(); mStar(g, 6, 59, 3.4, 1.4, 5); g.fill();
  g.strokeStyle = 'rgba(31,47,85,.7)'; g.lineWidth = .3; g.beginPath(); g.moveTo(-14, 68); g.lineTo(14, 68); g.stroke(); g.beginPath(); g.moveTo(-10, 67); g.bezierCurveTo(-6, 63, -2, 70, 4, 65); g.stroke();
  g.fillStyle = 'rgba(255,255,255,.18)'; g.beginPath(); g.moveTo(-w / 2 + 5, 11); g.lineTo(-w / 2 + 20, 11); g.lineTo(-w / 2 + 5, 40); g.fill();   // reflejo del vidrio
  return S;
}
/* ---------- la puerta (90 × 208): madera oscura con cuatro tableros, pomo de latón y una hoja clavada ---------- */
function paintDoor() {
  const T = matWood(90, 208, { seed: 61, c: [104, 66, 44], plank: 208, gap: 1.6, nk: 2 }), g = T.g;
  for (const [x, y, w, h] of [[10, 12, 30, 80], [50, 12, 30, 80], [10, 112, 30, 84], [50, 112, 30, 84]]) {
    g.fillStyle = 'rgba(40,22,14,.35)'; g.fillRect(x, y, w, 2); g.fillRect(x, y, 2, h); g.fillStyle = 'rgba(255,220,180,.18)'; g.fillRect(x, y + h - 2, w, 2); g.fillRect(x + w - 2, y, 2, h);
    g.fillStyle = 'rgba(255,220,180,.06)'; g.fillRect(x + 5, y + 5, w - 10, h - 10); }
  const kx = 80, ky = 104; g.fillStyle = 'rgb(176,140,70)'; g.beginPath(); g.arc(kx, ky, 3.4, 0, TAU); g.fill(); g.fillStyle = 'rgba(255,240,190,.7)'; g.beginPath(); g.arc(kx - 1, ky - 1, 1.2, 0, TAU); g.fill(); g.fillStyle = 'rgb(140,108,50)'; g.fillRect(kx - 1.6, ky + 6, 3.2, 9);
  /* hoja de menú clavada con una chincheta */
  g.save(); g.translate(26, 46); g.rotate(-.06); g.fillStyle = 'rgb(240,234,220)'; g.fillRect(-11, -14, 22, 30); g.fillStyle = 'rgba(40,40,60,.7)'; for (let k = 0; k < 8; k++) g.fillRect(-8, -9 + k * 3, 10 + (k * 7 % 6), .6); g.fillStyle = 'rgb(200,40,40)'; g.beginPath(); g.arc(0, -12, 1.2, 0, TAU); g.fill(); g.restore();
  return T;
}
/* ---------- escritorio: sobre de nogal rayado, aros de café, migas y carbón ---------- */
function paintDeskTop() {
  const T = matWood(150, 70, { seed: 71, c: [110, 74, 50], plank: 17.5, gap: 1.2, scratch: 50 }), g = T.g, r = mulberry32(72);
  for (const [x, y, rr] of [[30, 20, 5], [36, 26, 5.2], [120, 50, 4.6]]) { g.strokeStyle = 'rgba(70,40,24,.45)'; g.lineWidth = .8; g.beginPath(); g.arc(x, y, rr, .3, TAU - .5); g.stroke(); }
  for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(${r() < .5 ? '230,200,150' : '30,30,30'},${.3 + r() * .4})`; g.fillRect(90 + r() * 40, 8 + r() * 30, .8, .8); }
  g.fillStyle = 'rgba(30,30,34,.25)'; g.beginPath(); g.ellipse(70, 52, 14, 5, .3, 0, TAU); g.fill();   // tizne de carbón
  /* lápiz de carbón */
  g.save(); g.translate(104, 30); g.rotate(.4); g.fillStyle = 'rgb(40,40,40)'; g.fillRect(-12, -1, 24, 2); g.fillStyle = 'rgb(214,190,150)'; g.fillRect(10, -1, 3, 2); g.restore();
  return T;
}
function paintNotebook() {
  const T = tex(44, 30, 4), g = T.g, r = mulberry32(73);
  g.fillStyle = 'rgb(40,36,38)'; g.fillRect(0, 0, 44, 30);
  g.fillStyle = 'rgb(242,236,222)'; g.fillRect(1.2, 1.2, 20.4, 27.6); g.fillRect(22.4, 1.2, 20.4, 27.6);
  g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(21.4, 1, 1.2, 28);
  /* bocetos de emplatado: platos redondos con trazos y flechas, a carbón */
  for (const [cx, cy] of [[11, 10], [33, 9], [32, 22]]) { g.strokeStyle = 'rgba(40,40,44,.75)'; g.lineWidth = .35; g.beginPath(); g.arc(cx, cy, 6, 0, TAU); g.stroke(); g.beginPath(); g.arc(cx, cy, 4.2, 0, TAU); g.stroke();
    g.lineWidth = .5; g.beginPath(); g.moveTo(cx - 3, cy + 1); g.quadraticCurveTo(cx, cy - 2, cx + 3, cy + 1); g.stroke(); g.fillStyle = 'rgba(50,50,54,.6)'; for (let k = 0; k < 4; k++) { g.beginPath(); g.arc(cx - 2 + k * 1.4, cy + (k % 2) - .5, .45, 0, TAU); g.fill(); } }
  g.strokeStyle = 'rgba(40,40,44,.6)'; g.lineWidth = .3; for (let k = 0; k < 5; k++) { g.beginPath(); g.moveTo(3, 19 + k * 2); g.lineTo(18 - (k % 2) * 4, 19 + k * 2); g.stroke(); }
  g.fillStyle = 'rgba(160,120,60,.25)'; g.beginPath(); g.ellipse(36, 26, 3.5, 2.4, 0, 0, TAU); g.fill();   // mancha de grasa
  g.fillStyle = 'rgba(40,40,44,.15)'; g.fillRect(4, 3, 8, 2);
  return T;
}
/* ---------- taza de cerámica de Molienda con restos secos de ayer ---------- */
function paintMug() {
  const S = spr([-8, -12, 10, 0], 7), g = S.g;
  g.fillStyle = 'rgb(230,224,212)'; g.beginPath(); g.moveTo(-6, -10); g.lineTo(6, -10); g.lineTo(5.6, -.6); g.quadraticCurveTo(0, .4, -5.6, -.6); g.closePath(); g.fill();
  g.strokeStyle = 'rgb(230,224,212)'; g.lineWidth = 1.6; g.beginPath(); g.arc(7, -5.6, 2.6, -PI / 2, PI / 2); g.stroke();
  const sh = g.createLinearGradient(-6, 0, 6, 0); sh.addColorStop(0, 'rgba(110,90,120,.35)'); sh.addColorStop(.4, 'rgba(255,255,255,0)'); sh.addColorStop(1, 'rgba(110,90,120,.45)'); g.fillStyle = sh; g.fillRect(-6, -10, 12, 10);
  g.fillStyle = 'rgb(214,208,196)'; g.beginPath(); g.ellipse(0, -10, 6, 1.4, 0, 0, TAU); g.fill(); g.fillStyle = 'rgb(96,64,44)'; g.beginPath(); g.ellipse(0, -9.9, 5, .9, 0, 0, TAU); g.fill();
  g.strokeStyle = 'rgba(110,70,44,.6)'; g.lineWidth = .4; g.beginPath(); g.moveTo(3.5, -9.6); g.quadraticCurveTo(4.2, -7, 3.8, -5); g.stroke();   // goterón seco
  marcaLogo(g, 'molienda', -3, -7, 5, { layout: 'emblema' });
  return S;
}
/* ---------- monstera: hojas con cortes y agujeros (la misma forma sirve para el dibujo y para la sombra) ---------- */
function monLeaf(sz, seed) {
  const r = mulberry32(seed), pts = [], n = 64, cuts = [];
  for (let k = 0; k < 4 + (r() * 3 | 0); k++) cuts.push([.12 + r() * .34, (r() < .5 ? 1 : -1), .025 + r() * .02, .45 + r() * .3]);
  for (let i = 0; i < n; i++) {
    const t = i / n * TAU; let x = 16 * Math.pow(Math.sin(t), 3), y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    const side = Math.sign(x), f = i / n; let cut = 0;
    for (const [c, sd, wdt, dep] of cuts) { const cc = sd > 0 ? c : 1 - c; if (Math.abs(f - cc) < wdt) cut = Math.max(cut, dep * (1 - Math.abs(f - cc) / wdt)); }
    x *= 1 - cut; y = y * (1 - cut * .25);
    pts.push([x * sz / 16, -(y + 5) * sz / 16 * 1.1]);
  }
  const holes = []; for (let k = 0; k < 2 + (r() * 2 | 0); k++) { const hy = -sz * (.5 + r() * .6), hx = (r() < .5 ? -1 : 1) * sz * (.18 + r() * .1); holes.push(ellP(hx, hy, sz * .05, sz * .1, 10)); }
  return { pts, holes, sz };
}
const MON = { x: -160, z: 702 };
function paintMonstera() {
  const r = mulberry32(81), L = [];
  const spec = [[-46, -150, 26, -.5, -8], [-10, -172, 30, .1, 6], [30, -140, 27, .6, -4], [-62, -100, 22, -.9, 10], [44, -92, 24, 1.0, 12], [-18, -116, 22, -.2, -14], [12, -64, 18, .3, 16], [-36, -62, 16, -.7, 18], [58, -126, 18, .9, -12]];
  for (const [lx, ly, sz, ang, dz] of spec) {
    const lf = monLeaf(sz, L.length * 13 + 5), box = [-sz * 1.15, -sz * 2.1, sz * 1.15, sz * .2], S = spr(box, 3), g = S.g, gc = [[46, 96, 56], [62, 120, 64], [40, 84, 52]][L.length % 3];
    const P = pPolys([lf.pts].concat(lf.holes));
    const gr = g.createLinearGradient(-sz, -sz * 2, sz, 0); gr.addColorStop(0, cssc(shc(gc, .25))); gr.addColorStop(.6, cssc(gc)); gr.addColorStop(1, cssc(shc(gc, -.3)));
    g.fillStyle = gr; g.fill(P, 'evenodd');
    g.save(); g.clip(P, 'evenodd'); g.strokeStyle = cssc(shc(gc, .35), .6); g.lineWidth = .7; g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(sz * .05, -sz, 0, -sz * 2); g.stroke();
    g.lineWidth = .4; for (let k = 1; k < 7; k++) { const y = -k * sz * .28; g.beginPath(); g.moveTo(0, y); g.quadraticCurveTo(-sz * .5, y + sz * .05, -sz, y - sz * .1); g.moveTo(0, y); g.quadraticCurveTo(sz * .5, y + sz * .05, sz, y - sz * .1); g.stroke(); }
    g.fillStyle = 'rgba(255,255,240,.12)'; g.beginPath(); g.ellipse(-sz * .3, -sz * 1.2, sz * .35, sz * .6, -.4, 0, TAU); g.fill(); g.restore();
    g.strokeStyle = cssc(shc(gc, -.45), .7); g.lineWidth = .6; g.stroke(P);
    wcTex(g, S.c.width, S.c.height, .25, .2);
    L.push({ S, lf, lx, ly, ang, dz, ph: r() * 9 });
  }
  /* maceta de barro y tallos */
  const pot = spr([-26, -46, 26, 0], 3), g = pot.g;
  wcWash(g, [[-22, -40], [22, -40], [17, 0], [-17, 0]], [176, 98, 66], .97, { reserve: false, mode: 'source-over', amt: .4, seed: 3, step: 6, bloom: [140, 70, 50] });
  wcWash(g, rectP(-24, -46, 48, 8), [190, 110, 76], .97, { reserve: false, mode: 'source-over', amt: .3, seed: 4, step: 6 });
  g.fillStyle = 'rgba(240,236,220,.35)'; g.fillRect(-14, -30, 4, 26);
  g.fillStyle = 'rgb(60,44,36)'; g.beginPath(); g.ellipse(0, -45, 21, 2.5, 0, 0, TAU); g.fill();
  wcTex(g, pot.c.width, pot.c.height, .3, .25);
  return { leaves: L, pot };
}
/* hojas de la monstera en t (balanceo leve por la corriente de aire): sprite + polígono 3D para la sombra */
function monLeafAt(Lf, t, gust = 0) { return Lf.ang + Math.sin(t * .7 + Lf.ph) * .035 + Math.sin(t * 1.9 + Lf.ph * 2) * .015 + gust * Math.sin(t * 9 + Lf.ph) * .12; }
function monOcc(t, gust = 0) {
  const o = []; for (const Lf of PROPS.mon.leaves) { const a = monLeafAt(Lf, t, gust), c = Math.cos(a), s = Math.sin(a), z = MON.z + Lf.dz;
    const map = p => [MON.x + Lf.lx + p[0] * c - p[1] * s, Lf.ly + p[0] * s + p[1] * c, z];
    o.push({ pts: Lf.lf.pts.map(map), holes: Lf.lf.holes.map(h => h.map(map)), a: .88 }); }
  return o;
}
function drawMonstera(t, gust = 0) {
  const s = PS(MON.z), b = PJ(MON.x, -44, MON.z);
  /* tallos */
  ctx.strokeStyle = 'rgb(56,92,52)'; ctx.lineCap = 'round';
  for (const Lf of PROPS.mon.leaves) { const a = monLeafAt(Lf, t, gust), e = PJ(MON.x + Lf.lx, Lf.ly, MON.z + Lf.dz); ctx.lineWidth = Math.max(.6, 2.2 * s); ctx.beginPath(); ctx.moveTo(b[0] + Lf.lx * .1 * s, b[1]); ctx.quadraticCurveTo(b[0] + Lf.lx * .5 * s, b[1] + (Lf.ly) * .5 * s - 10 * s, e[0], e[1]); ctx.stroke(); }
  /* hojas de atrás adelante */
  for (const Lf of PROPS.mon.leaves.slice().sort((p, q) => q.dz - p.dz)) bill(Lf.S, MON.x + Lf.lx, Lf.ly, MON.z + Lf.dz, { rot: monLeafAt(Lf, t, gust), px: 0, py: 0 });
  bill(PROPS.mon.pot, MON.x, 0, MON.z);
}
/* ---------- ropa en una pila al pie de la cama ---------- */
function paintClothes() {
  const S = spr([-46, -30, 46, 0], 3), g = S.g;
  wcWash(g, [[-44, 0], [-40, -12], [-20, -18], [10, -16], [30, -10], [44, -2], [44, 0]], [62, 76, 120], .97, { reserve: false, mode: 'source-over', amt: 1.2, seed: 1, step: 5, bloom: [40, 50, 90] });   // vaqueros
  g.strokeStyle = 'rgba(220,180,100,.6)'; g.lineWidth = .5; g.beginPath(); g.moveTo(-30, -8); g.quadraticCurveTo(-10, -13, 14, -10); g.stroke();
  wcWash(g, [[-30, -10], [-22, -24], [0, -28], [20, -22], [26, -12], [6, -8]], [236, 236, 230], .97, { reserve: false, mode: 'source-over', amt: 1, seed: 2, step: 5 });   // pantalón de cuadritos de cocina
  g.save(); g.clip(pPolys([[[-30, -10], [-22, -24], [0, -28], [20, -22], [26, -12], [6, -8]]])); g.fillStyle = 'rgba(30,30,34,.55)'; for (let x = -32; x < 30; x += 2) for (let y = -30; y < -6; y += 2) if (((x + y) / 2 | 0) % 2) g.fillRect(x, y, 1, 1); g.restore();
  wcWash(g, [[0, -14], [10, -24], [26, -26], [36, -18], [30, -10], [14, -8]], [150, 150, 156], .97, { reserve: false, mode: 'source-over', amt: 1, seed: 3, step: 5 });   // camiseta gris
  wcWash(g, ellP(-34, -6, 6, 3, 12), [196, 60, 50], .97, { reserve: false, mode: 'source-over', amt: .4, seed: 4, step: 4 });   // calcetín
  wcWash(g, ellP(36, -4, 7, 2.6, 12), [60, 60, 64], .97, { reserve: false, mode: 'source-over', amt: .4, seed: 5, step: 4 });
  wcTex(g, S.c.width, S.c.height, .3, .25);
  return S;
}
/* ---------- zuecos Firme (pequeños, del tamaño de Teo) ---------- */
function paintClogs() {
  const S = spr([-16, -7, 16, 0], 6), g = S.g;
  for (const [x, flip] of [[-8, 1], [8, -1]]) { g.save(); g.translate(x, 0); g.scale(flip * -1, 1);
    g.fillStyle = 'rgb(34,34,38)'; g.beginPath(); g.moveTo(-7, 0); g.lineTo(-7, -3); g.quadraticCurveTo(-6, -6.4, -1, -6.4); g.lineTo(3, -5); g.quadraticCurveTo(7, -4, 7, -1.4); g.lineTo(7, 0); g.fill();
    g.fillStyle = 'rgb(236,190,40)'; g.fillRect(-7, -1.1, 14, .9); g.fillStyle = 'rgba(255,255,255,.25)'; g.beginPath(); g.ellipse(-3, -5, 2.4, .8, -.2, 0, TAU); g.fill(); g.restore(); }
  return S;
}
/* ---------- chaqueta de cocina colgada (Brasa y Bruma bordado) ---------- */
function paintJacket() {
  const S = spr([-30, -4, 30, 74], 3), g = S.g;
  g.strokeStyle = 'rgb(60,50,44)'; g.lineWidth = 1; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 4); g.moveTo(-14, 10); g.quadraticCurveTo(0, 2, 14, 10); g.stroke();
  const J = [[-14, 8], [14, 8], [26, 16], [24, 44], [18, 44], [17, 72], [-17, 72], [-18, 44], [-24, 44], [-26, 16]];
  wcWash(g, J, [240, 240, 236], .98, { reserve: false, mode: 'source-over', amt: .8, seed: 6, step: 5 });
  const sh = g.createLinearGradient(-26, 0, 26, 0); sh.addColorStop(0, 'rgba(120,110,140,.35)'); sh.addColorStop(.5, 'rgba(255,255,255,0)'); sh.addColorStop(1, 'rgba(120,110,140,.4)'); g.fillStyle = sh; g.fill(pPolys([J]));
  g.strokeStyle = 'rgba(100,96,110,.6)'; g.lineWidth = .6; g.beginPath(); g.moveTo(-6, 9); g.lineTo(6, 22); g.lineTo(6, 72); g.stroke();
  for (let k = 0; k < 4; k++) for (const x of [-4, 12]) { g.fillStyle = 'rgb(30,30,32)'; g.beginPath(); g.arc(x, 26 + k * 11, 1.3, 0, TAU); g.fill(); }
  marcaLogo(g, 'brasa', -20, 24, 9, { layout: 'emblema' });
  wcTex(g, S.c.width, S.c.height, .25, .2);
  return S;
}
/* ---------- almohadas ---------- */
function paintPillow(seed) {
  const S = spr([-34, -22, 34, 0], 3), g = S.g, P = [[-32, -2], [-33, -14], [-26, -20], [0, -19], [26, -21], [33, -14], [32, -2], [0, 0]];
  wcWash(g, dens(P, 4).map((p, i) => [p[0] + N2(i * .3, seed) * 1.5, p[1] + N2(i * .3 + 5, seed)]), [240, 236, 226], .98, { reserve: false, mode: 'source-over', amt: .6, seed, step: 5 });
  const sh = g.createLinearGradient(0, -20, 0, 0); sh.addColorStop(0, 'rgba(255,255,255,0)'); sh.addColorStop(1, 'rgba(130,116,150,.35)'); g.fillStyle = sh; g.fill(pPolys([P]));
  g.strokeStyle = 'rgba(150,140,160,.4)'; g.lineWidth = .7; g.beginPath(); g.moveTo(-20, -6); g.quadraticCurveTo(-8, -12, 4, -8); g.stroke();
  return S;
}
/* ---------- textura del frente de la mesita y del despertador ---------- */
function paintNight() {
  const T = matWood(80, 56, { seed: 91, c: [130, 90, 60], plank: 56 }), g = T.g;
  for (const y of [6, 30]) { g.fillStyle = 'rgba(40,22,14,.35)'; g.fillRect(5, y, 70, 1.2); g.fillRect(5, y + 20, 70, 1.2); g.fillStyle = 'rgb(176,140,70)'; g.fillRect(34, y + 9, 12, 2); }
  return T;
}
function paintClock() {
  const T = tex(46, 22, 6), g = T.g;
  const gr = g.createLinearGradient(0, 0, 0, 22); gr.addColorStop(0, 'rgb(70,70,78)'); gr.addColorStop(1, 'rgb(30,30,34)'); g.fillStyle = gr; g.fillRect(0, 0, 46, 22);
  g.fillStyle = 'rgb(16,10,12)'; g.fillRect(3, 3, 40, 13);
  g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(3, 3, 40, 2);
  marcaLogo(g, 'kronotek', 3.5, 17, 3.4, { dark: true, sub: false });
  g.fillStyle = 'rgb(150,150,158)'; g.fillRect(36, 17.6, 6, 2);
  return T;
}
/* dígitos de 7 segmentos en un rectángulo de pantalla (x, y, alto) */
const SEG7 = { 0: 'abcdef', 1: 'bc', 2: 'abdeg', 3: 'abcdg', 4: 'bcfg', 5: 'acdfg', 6: 'acdefg', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg' };
function seg7(g, s, x, y, h, col, off = 'rgba(80,10,10,.5)') {
  const w = h * .52, th = h * .12; let cx = x;
  for (const ch of s) {
    if (ch === '.') { g.fillStyle = col; g.fillRect(cx, y + h - th, th * 1.2, th * 1.2); cx += th * 3; continue; }
    if (ch === ':') { g.fillStyle = col; g.fillRect(cx + w * .1, y + h * .28, th, th); g.fillRect(cx + w * .1, y + h * .66, th, th); cx += w * .45; continue; }
    const on = SEG7[ch] || '', seg = { a: [cx + th, y, w - th * 2, th], b: [cx + w - th, y + th, th, h / 2 - th * 1.5], c: [cx + w - th, y + h / 2 + th / 2, th, h / 2 - th * 1.5], d: [cx + th, y + h - th, w - th * 2, th], e: [cx, y + h / 2 + th / 2, th, h / 2 - th * 1.5], f: [cx, y + th, th, h / 2 - th * 1.5], g: [cx + th, y + h / 2 - th / 2, w - th * 2, th] };
    for (const k in seg) { g.fillStyle = on.includes(k) ? col : off; g.fillRect(...seg[k]); }
    cx += w + h * .14;
  }
}
function utileriaPaint() {
  PROPS.shelf = paintShelf(); PROPS.cuts = paintPosterCuts(); PROPS.knives = paintPosterKnives(); PROPS.diploma = paintDiploma();
  ESX.door = paintDoor(); PROPS.desk = paintDeskTop(); PROPS.note = paintNotebook(); PROPS.mug = paintMug(); PROPS.mon = paintMonstera();
  PROPS.clothes = paintClothes(); PROPS.clogs = paintClogs(); PROPS.jacket = paintJacket(); PROPS.pillow = [paintPillow(3), paintPillow(9)];
  PROPS.night = paintNight(); PROPS.clock = paintClock();
  PROPS.woodA = matWood(240, 60, { seed: 92, c: [120, 80, 52], plank: 12 }); PROPS.woodB = matWood(80, 240, { seed: 93, c: [112, 74, 48], plank: 80 });
  PROPS.mattress = matLinen(240, 40, { seed: 94, c: [236, 232, 222], folds: 3 }); PROPS.mattTop = matLinen(240, 170, { seed: 95, c: [238, 234, 224], folds: 6 });
  PROPS.head = matWood(170, 120, { seed: 96, c: [96, 62, 42], plank: 24, gap: 1.6 });
  for (const k of ['shelf', 'desk', 'note', 'night', 'woodA', 'woodB', 'mattress', 'mattTop', 'head']) texShade(PROPS[k], SOL.bake, SOL.bakeA * .8); texShade(ESX.door, SOL.bake, SOL.bakeA);
  for (const k of ['cuts', 'knives', 'diploma', 'mug', 'clothes', 'clogs', 'jacket']) texShadeKeep(PROPS[k], SOL.bake, SOL.bakeA * .8); for (const P of PROPS.pillow) texShadeKeep(P, SOL.bake, SOL.bakeA * .6);
  for (const L of PROPS.mon.leaves) texShadeKeep(L.S, SOL.bake, SOL.bakeA * .7); texShadeKeep(PROPS.mon.pot, SOL.bake, SOL.bakeA * .7);
}
