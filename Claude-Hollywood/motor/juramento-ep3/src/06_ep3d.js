/* ===================== EPÍLOGO · PRIMAVERA EN EL PORCHE (518–582) ===================== */
scene(518, 582, 4, .5, {
  tin: 'bleed',
  draw(T, dt) {
    const ins = fade(T, 558, 581, .8, 1);
    CAM = { z: 1.15 + .1 * eio(rg(T, 538, 552)), x: lerp(lerp(-120, 40, eio(rg(T, 518, 530))), 60, eio(rg(T, 538, 552))), y: lerp(60, 110, eio(rg(T, 538, 552))) };
    porch3(T, { sky: 'dusk', spring: true, mA: 0, lit: .5 * sm(rg(T, 545, 552)) });
    const lit = sm(rg(T, 526.6, 527.6)) * (.9 + .1 * N2(T * 3, 2));
    lantern(T, lit, 0);
    fireflies(T, sm(rg(T, 544, 552)));
    // Joy enciende el farol con una cerilla
    let jx = -175, jy = PFY, jp = POSE.stand, jfl = false;
    if (T > 524.4 && T < 528.4) jp = mixP(POSE.stand, { ...RAISE, ra: 2.1, re: -.1 }, Math.sin(rg(T, 524.4, 528.4) * PI));
    if (T > 533) { jx = lerp(-175, -40, eio(rg(T, 533, 535.4))); jp = T < 535.4 ? walkW(jx) : POSE.stand; }
    if (T > 535.4) { jx = lerp(-40, -20, rg(T, 535.4, 536.6)); jy = lerp(PFY, 330, eio(rg(T, 535.4, 536.6))); }
    if (T > 539.6) jp = mixP(POSE.stand, { ...SIT, lean: .2, ht: .2 }, eio(rg(T, 539.6, 541)));
    const JF = M('joy', jp, T, { wind: .3 });
    const lt = [{ x: LX, y: LY, c: '255,196,110', r: 380, a: lit }, { x: SW * .5, y: 160, c: '255,186,140', r: 600, a: .5 }];
    dm('joy', JF, jx, jy, 2.5, jfl, T, { light: lt, glow: .12, ignite: .05 });
    if (T > 524.8 && T < 527.4) { const h = figPt(JF.W2, jx, jy, 2.5, jfl); L(1); mode('source-over'); ctx.fillStyle = `rgba(255,210,120,${SA})`; ctx.beginPath(); ctx.ellipse(h[0], h[1] - 6, 2.2, 5, 0, 0, TAU); ctx.fill(); mode('multiply'); glowAt(h[0], h[1] - 6, 60, '255,190,110', .5); }
    // Anami y Draconida llegan del brazo y se sientan con ella
    let ax = lerp(SW * .72, 170, eo(rg(T, 529, 537))), cx = ax + 110, ap = T < 537 ? walkW(ax) : POSE.stand, cp = T < 537 ? walkW(cx + 20) : POSE.stand, afl = true, cfl = true;
    if (T > 537) { cx = 295; }
    if (T > 540.2) { ap = mixP(POSE.stand, { ...SIT, lean: .2, ht: .15 }, eio(rg(T, 540.2, 541.6))); cp = mixP(POSE.stand, { ...SIT, lean: .2, ht: .15 }, eio(rg(T, 540.6, 542))); }
    const as = T > 529 ? 1 : 0;
    if (as) { dm('anami', M('anami', ap, T, { wind: .3 }), ax, 330, 2.5, afl, T, { light: lt, green: 1 }); dm('draco', M('draco', cp, T, { wind: .3 }), cx, 330, 2.4, cfl, T, { light: lt, glow: .9 }); }
    // inserto final: dos muñecas, una cinta verde, ningún hilo rojo
    if (ins > 0) {
      insertBg(ins * .95, '34,28,26'); L0(); glowAt(-200, -200, 700, '255,190,130', .25 * ins); glowAt(200, 260, 500, '120,230,160', .12 * ins);
      for (const [x, fl2, rot, col] of [[-90, 1, .08, '30,24,28'], [90, -1, -.08, '44,40,46']]) { ctx.save(); ctx.translate(x, 160); ctx.rotate(rot); ctx.scale(1.55 * fl2, 1.55); ctx.globalAlpha = ins * SA; ctx.fillStyle = `rgba(${col},.95)`; ctx.fill(B.hand); ctx.restore(); }
      const pr = eio(rg(T, 562, 569)); mode('source-over'); ctx.strokeStyle = `rgba(70,200,120,${ins * SA})`; ctx.lineWidth = 4.5; ctx.shadowColor = 'rgba(120,255,170,.9)'; ctx.shadowBlur = LOWQ ? 0 : 12 * U; ctx.lineCap = 'round'; ctx.beginPath();
      const N = 80; for (let i = 0; i <= N * pr; i++) { const f = i / N, a = f * TAU * 2, x = Math.sin(a) * 150 * (f < .5 ? 1 : -1) * Math.abs(Math.sin(a * .5 + .3)) * .8, y = 255 + Math.sin(a * 2) * 14; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.stroke(); ctx.shadowBlur = 0; mode('multiply'); ctx.globalAlpha = 1;
    }
  }
});

/* ===================== FINAL: FIN (578–) ===================== */
const F3 = [[-200, -400], [150, -400], [0, -300], [260, -370]]; // Damien, Anami, Joy, Draconida
scene(578, 1e9, 3, .01, {
  draw(T, dt) {
    CAM = { z: 1, x: 0, y: 0 }; L0();
    const a = sm(rg(T, 579, 582));
    mode('source-over');
    dS(B.drops[0].sp, F3[0][0], F3[0][1], .8, 0, a * .85, B.drops[0].bl.get(eo(rg(T, 579, 580.5))));
    dS(B.green.sp, F3[1][0], F3[1][1], .8, 1, a, B.green.bl.get(eo(rg(T, 579.5, 581))));
    dS(B.drops[2].sp, F3[2][0], F3[2][1], .8, 2, a, B.drops[2].bl.get(eo(rg(T, 580, 581.5))));
    dS(B.green.sp, F3[3][0], F3[3][1], .55, 3, a * .8 * sm(rg(T, 581.5, 583.5)), B.green.bl.get(eo(rg(T, 581.5, 583.5))));
    mode('multiply');
    // ningún hilo rojo: solo una cinta verde que une a dos, y motas doradas que suben de Joy
    if (T > 583) { const pr = eio(rg(T, 583, 586)); mode('source-over'); ctx.strokeStyle = `rgba(70,200,120,${.8 * a * SA})`; ctx.lineWidth = 2; ctx.shadowColor = 'rgba(120,255,170,.9)'; ctx.shadowBlur = 8 * U; ctx.beginPath(); ctx.moveTo(F3[1][0], F3[1][1]); ctx.bezierCurveTo(F3[1][0] + 40 * pr, F3[1][1] - 60 * pr, F3[3][0] - 30 * pr, F3[3][1] - 50 * pr, lerp(F3[1][0], F3[3][0], pr), lerp(F3[1][1], F3[3][1], pr)); ctx.stroke(); ctx.shadowBlur = 0; mode('multiply'); }
    mode('source-over'); for (let i = 0; i < 8; i++) { const ph = (T * .25 + i / 8) % 1, x = F3[2][0] + Math.sin(i * 2.3 + T) * 20, y = F3[2][1] - 20 - ph * 120; ctx.fillStyle = `rgba(236,190,90,${a * .5 * Math.sin(ph * PI) * SA})`; ctx.beginPath(); ctx.arc(x, y, 2, 0, TAU); ctx.fill(); } mode('multiply');
  }
});

/* ===================== TEXTOS ===================== */
const CUES = [
  { t: 3.6, d: 4.4, k: 'narr', x: 'La maldición no desapareció.' },
  { t: 8.4, d: 4.8, k: 'narr', x: 'Se quedó dentro del hilo, esperando.' },
  { t: 14, d: 4.4, k: 'narr', x: 'Tres lunas. Ni una más.' },
  { t: 19, d: 7.4, k: 'ptitle', x: '<b>La Última Luna</b><i>El Juramento Roto · Episodio III</i>' },
  { t: 29.6, d: 5.4, k: 'card light', x: '<b>Primer acto</b><i>La primera luna</i>' },
  { t: 35.2, d: 7, k: 'loc light', x: '<b>Hogwarts</b><i>la sala común de Slytherin, bajo el lago · enero de 1896</i>' },
  { t: 39.6, d: 4.4, k: 'narr light', x: 'La primera luna llena llegó en enero.' },
  { t: 45, d: 6, k: 'narr light', x: 'El dolor nació en el pecho, justo donde la maldición debía haber caído.' },
  { t: 51.6, d: 4.4, k: 'narr light', x: '<em class="S">Draconida</em> no se apartó de su lado.' },
  { t: 56.6, d: 5, k: 'narr light', x: 'Y escondió algo bajo la manga.' },
  { t: 65, d: 4.2, k: 'narr light', x: '<em class="G">Joy</em> también lo sintió.' },
  { t: 69.8, d: 5.4, k: 'narr light', x: 'Desde aquella noche no había dejado de leer sobre pactos de sangre.' },
  { t: 76.2, d: 5.4, k: 'narr light', x: 'Y había encontrado algo que no quería encontrar.' },
  { t: 88.6, d: 5.6, k: 'loc light', x: '<b>Páramos del norte</b><i>la misma noche</i>' },
  { t: 92.2, d: 5.4, k: 'narr light', x: '<em class="R">Damien</em>, que la había lanzado, la sintió tres veces más fuerte.' },
  { t: 99, d: 5.4, k: 'narr light', x: 'Y en el dolor vio adónde quería ir la maldición.' },
  { t: 105.4, d: 4.6, k: 'narr light', x: 'No podía matar a uno de los tres…' },
  { t: 110.4, d: 4.6, k: 'narr light', x: '…así que buscaba a alguien más.' },
  { t: 121.4, d: 5.2, k: 'card light', x: '<b>Segundo acto</b><i>La segunda luna</i>' },
  { t: 127, d: 4.4, k: 'narr light', x: 'Draconida lo supo antes que nadie.' },
  { t: 132, d: 5.8, k: 'narr light', x: 'Al atar la cinta, se había atado también al juramento.' },
  { t: 139.2, d: 5.6, k: 'narr light', x: 'Y no se lo dijo a nadie. Ni siquiera a él.' },
  { t: 150.4, d: 4.2, k: 'narr', x: 'La segunda luna llegó en febrero.' },
  { t: 160.2, d: 4.6, k: 'narr', x: 'Esta vez, el dolor no se quedó en él.' },
  { t: 165.2, d: 5, k: 'narr', x: 'Bajó por la cinta verde… hasta ella.' },
  { t: 171.2, d: 7, k: 'narr voice', x: '«La maldición no puede matar a uno de los tres. Busca a quien no pertenece al pacto.»' },
  { t: 178.8, d: 4.6, k: 'narr voice', x: '«Lo sé. Desde la primera luna.»' },
  { t: 184.6, d: 4.6, k: 'narr', x: 'Quedaba una sola luna.' },
  { t: 197.6, d: 4.6, k: 'narr light', x: 'Damien escribió una sola vez.' },
  { t: 221.4, d: 3.6, k: 'narr light', x: 'Anami quemó la carta.' },
  { t: 226.2, d: 5.4, k: 'narr light', x: 'Esta vez no quedó nada que rescatar de las cenizas.' },
  { t: 233.4, d: 6, k: 'narr', x: 'Por primera vez desde niños, Joy y Anami se pusieron del mismo lado.' },
  { t: 240.8, d: 5.4, k: 'narr', x: 'Draconida les enseñó lo que una vez le enseñó a él.' },
  { t: 251.8, d: 6, k: 'narr voice', x: '«Si la maldición no puede matarnos… puede quitarnos otra cosa.»' },
  { t: 258.6, d: 2.8, k: 'narr voice', x: '«No.»' },
  { t: 262.6, d: 5, k: 'narr', x: 'Joy no discutió. Ya lo había decidido.' },
  { t: 274.2, d: 6, k: 'narr', x: 'Esa noche guardó su varita como quien se despide.' },
  { t: 291.6, d: 5, k: 'narr light voice', x: '«Si tengo que pagarlo yo, déjame hacerlo.»' },
  { t: 298.6, d: 5.4, k: 'narr light voice', x: '«No me mires así. Fría por fuera, ¿recuerdas?»' },
  { t: 305.4, d: 4, k: 'narr light voice', x: '«Cálida por dentro.»' },
  { t: 310.6, d: 4.4, k: 'narr light', x: 'Era la primera vez que él lo decía.' },
  { t: 316.4, d: 5, k: 'narr light', x: 'Faltaba una noche para la última luna.' },
  { t: 331.4, d: 5.4, k: 'card light', x: '<b>Tercer acto</b><i>La última luna</i>' },
  { t: 336.6, d: 6.4, k: 'loc', x: '<b>Condado de York</b><i>el porche · la última luna</i>' },
  { t: 343, d: 5.6, k: 'narr voice', x: '«Ella no es de los tres. La maldición la quiere a ella.»' },
  { t: 349.8, d: 5, k: 'narr voice', x: '«Cuando la tome, seremos libres. Los tres.»' },
  { t: 357, d: 4.2, k: 'narr', x: 'Anami se puso delante de ella.' },
  { t: 361.8, d: 5, k: 'narr', x: 'Como ella había hecho tantas veces por él.' },
  { t: 373, d: 4.6, k: 'narr', x: 'La luna llena salió verde.' },
  { t: 380.2, d: 5, k: 'narr', x: 'Damien tiró del hilo con las manos.' },
  { t: 386.5, d: 2, k: 'spell X', x: '¡Expelliarmus!' },
  { t: 391.6, d: 5.2, k: 'narr', x: 'Cada golpe contra Damien era un golpe contra sí mismo.' },
  { t: 403.6, d: 4.6, k: 'narr', x: 'La maldición había encontrado su camino.' },
  { t: 414.8, d: 4.6, k: 'narr', x: 'La maldición no podía matar a uno de los tres.' },
  { t: 419.8, d: 4.4, k: 'narr', x: 'Pero sí podía quitarle algo.' },
  { t: 425, d: 6.4, k: 'narr', x: 'Joy le dio lo único que siempre había sido suyo: su magia.' },
  { t: 432.6, d: 4.8, k: 'narr', x: 'Y con eso compró unos minutos.' },
  { t: 455, d: 4, k: 'narr voice', x: '«Te perdono.»' },
  { t: 460.4, d: 3.2, k: 'narr voice', x: '«¿Por qué?»' },
  { t: 464.4, d: 5.6, k: 'narr voice', x: '«Porque ella vale más que mi odio.»' },
  { t: 476, d: 4.6, k: 'narr', x: 'El juramento se rompió.' },
  { t: 489.4, d: 3.6, k: 'narr', x: 'Joy estaba viva.' },
  { t: 493.6, d: 4.6, k: 'narr', x: 'Su sello no volvió a brillar.' },
  { t: 503.4, d: 6, k: 'narr', x: 'Cuando llegaron los aurores, Damien les tendió las muñecas.' },
  { t: 510.4, d: 5.4, k: 'narr', x: 'Por primera vez en su vida, no huyó.' },
  { t: 520.6, d: 6, k: 'loc light', x: '<b>Condado de York</b><i>primavera de 1896</i>' },
  { t: 524.4, d: 4, k: 'narr light', x: 'Joy ya no tenía magia.' },
  { t: 529, d: 5, k: 'narr light', x: 'Aprendió a encender el farol con una cerilla.' },
  { t: 535.6, d: 6, k: 'narr light', x: 'Y cada primavera, dos magos de verde y plata volvían al porche.' },
  { t: 544.6, d: 4.6, k: 'narr light', x: 'Ya no los unía ningún juramento.' },
  { t: 550, d: 5, k: 'narr light', x: 'Solo las ganas de volver.' },
  { t: 560.6, d: 4.6, k: 'narr light', x: 'Del hilo rojo no quedó nada.' },
  { t: 566.4, d: 6, k: 'narr light', x: 'Solo una cinta verde, atada por elección.' },
];
const CHAPTERS = [[0, 'Prólogo'], [26, 'I · La primera luna'], [120, 'II · La segunda luna'], [328, 'III · La última luna'], [446, 'El perdón'], [518, 'Epílogo']];
