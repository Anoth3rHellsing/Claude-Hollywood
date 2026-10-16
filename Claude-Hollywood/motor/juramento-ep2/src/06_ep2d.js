/* ===================== EPÍLOGO · AMANECER EN EL PORCHE (518–552) ===================== */
scene(518, 554, 4, .5, {
  tin: 'bleed2',
  enter() { B.motes.clear(); },
  draw(T, dt) {
    CAM = { z: 1.05 + .08 * rg(T, 518, 552), x: lerp(-60, 430, eio(rg(T, 520, 546))), y: 60 };
    porchBack(T, 1, 0);
    lantern(T, 0, 1);
    const sun = [{ x: SW * .6, y: 150, c: '255,186,140', r: 600, a: .55 }];
    // Joy sentada en el escalón, mira su muñeca
    const jp = T < 526.4 ? { ...SIT, lean: .3, ht: .4, la: 1.0, le: 1.3, ra: 1.1, re: 1.2 } : mixP({ ...SIT, lean: .3, ht: .4, la: 1.0, le: 1.3, ra: 1.1, re: 1.2 }, { ...SIT, lean: .2, ht: .3, la: 1.75, le: 1.3, ra: 1.1, re: 1.2 }, eio(rg(T, 526.4, 528)) * (1 - eio(rg(T, 540, 542))));
    const JF = M('joy', jp, T, { wind: .25 });
    dm('joy', JF, 10, 330, 2.5, false, T, { light: sun, glow: .8 });
    const JW = wr(JF, 10, 330, 2.5, false);
    L(1); wristRing(JW, T, .8, 6); hilo(JW, [-SW * .8, -460], T, .7 * fade(T, 524, 552, 2, 2), { sag: 140, w: 1.2, gap: [30, 8] });
    // Anami y Draconida se alejan del brazo; ella mira atrás una vez
    const ax = lerp(240, SW * .62 + 200, rg(T, 519, 552)), cx = ax + 75, back = T > 538.6 && T < 541.2;
    dm('anami', M('anami', walkW(ax), T, { wind: .4 }), ax, 330, 2.5, false, T, { light: sun, green: 1 });
    dm('draco', M('draco', back ? mixP(walkW(cx + 20), POSE.stand, eio(rg(T, 538.6, 539.2)) * (1 - eio(rg(T, 540.6, 541.2)))) : walkW(cx + 20), T, { wind: .45 }), back ? cx : cx, 330, 2.4, back, T, { light: sun, glow: .9 });
    L(1); const AW = wr(M('anami', walkW(ax), T), ax, 330, 2.5, false); wristRing(AW, T, .7, 6);
    snowDraw(T, dt, .35, 4);
    birds(T, { t0: 528, t1: 548, n: 5, x0: -900, x1: 900, y0: -260, y1: -320, spread: 120, s: 12, d: .4, seed: 4 });
  }
});

/* ===================== EPÍLOGO · DAMIEN EN EL PÁRAMO (550–582) ===================== */
scene(550, 582, 4, 3, {
  tin: 'sweep',
  draw(T, dt) {
    const push = eio(rg(T, 557, 563));
    CAM = { z: lerp(1.0, 1.45, push), x: lerp(60, 170, push), y: lerp(40, 100, push) };
    L(.05); dS(B.night, 0, 0, 1, 0, .85); starsDraw(B.stars, T, .7); L(.04); mode('source-over'); dS(B.moon, -SW * .32, -200, .8, 0, .75); mode('multiply');
    mtnDraw(0, .12, .7); mistDraw(T, 0, 80, .2, .4, 16); mtnDraw(1, .25, .7); mistDraw(T, 1, 180, .4, .5, 22);
    L(1); dS(B.crag);
    const x = 180, y = 204;
    let p = POSE.stand; if (T > 559) p = mixP(POSE.stand, { ...POSE.stand, la: 1.55, le: 1.35, ht: .32, lean: .06 }, eio(rg(T, 559, 560.8)));
    if (T > 567.5) p = { ...p, ht: -.2 + Math.sin(T * 9) * .05 * (1 - rg(T, 568, 571)), lean: -.06 };
    const F = M('damien', p, T, { wind: 1.25 });
    dm('damien', F, x, y, 2.5, false, T);
    const W = wr(F, x, y, 2.5, false), k = fade(T, 559.5, 582, 1.2, 2);
    L(1); wristRing(W, T, .6 + .4 * k, 6);
    hilo(W, [-SW * .9, -60], T, .85 * k, { sag: 90, w: 1.3, gap: [34, 8], ph: 1 }); hilo(W, [-SW * .9, 360], T, .85 * k, { sag: 40, w: 1.3, gap: [34, 8], ph: 2 });
    mistDraw(T, 2, 330, .9, .35, 30);
    birds(T, { t0: 554, t1: 574, n: 7, x0: -800, x1: 900, y0: -180, y1: -280, spread: 140, s: 15, d: .45, seed: 7, crow: 1 });
  }
});

/* ===================== FINAL: CONTINUARÁ (580–) ===================== */
const FIN = [[-160, -360], [160, -360], [0, -250]]; // Damien, Anami, Joy
scene(580, 1e9, 3, .01, {
  draw(T, dt) {
    CAM = { z: 1, x: 0, y: 0 }; L0();
    const a = sm(rg(T, 581, 584));
    mode('source-over');
    dS(B.drops[0].sp, FIN[0][0], FIN[0][1], .85, 0, a, B.drops[0].bl.get(eo(rg(T, 581, 582.5))));
    dS(B.green.sp, FIN[1][0], FIN[1][1], .85, 1, a, B.green.bl.get(eo(rg(T, 581.5, 583))));
    dS(B.drops[2].sp, FIN[2][0], FIN[2][1], .85, 2, a, B.drops[2].bl.get(eo(rg(T, 582, 583.5))));
    mode('multiply');
    if (T > 583.5) {
      const k = sm(rg(T, 583.5, 586));
      hilo(FIN[0], FIN[2], T, .8 * k, { sag: 24, w: 1.4 }); hilo(FIN[0], FIN[1], T, .8 * k, { sag: -30, w: 1.4, ph: 1 });
      // el hilo entre Joy y Anami: solo quedan motas doradas
      const g = sm(rg(T, 584, 587)) * (1 - sm(rg(T, 590, 596)) * .7);
      mode('source-over'); for (let i = 0; i < 14; i++) { const f = (i + .5) / 14, q = [lerp(FIN[2][0], FIN[1][0], f), lerp(FIN[2][1], FIN[1][1], f) + 10 * Math.sin(f * PI) - ((T * 8 + i * 7) % 40) * .5]; ctx.fillStyle = `rgba(236,180,80,${g * (.5 + .5 * Math.sin(T * 3 + i)) * SA})`; ctx.beginPath(); ctx.arc(q[0], q[1], 2.2, 0, TAU); ctx.fill(); } mode('multiply');
      // la cinta verde rodea la gota de Anami
      const pr = eio(rg(T, 585, 588)); mode('source-over'); ctx.strokeStyle = `rgba(70,200,120,${.85 * a * SA})`; ctx.lineWidth = 2; ctx.shadowColor = 'rgba(120,255,170,.9)'; ctx.shadowBlur = 8 * U; ctx.beginPath(); ctx.ellipse(FIN[1][0], FIN[1][1], 46, 46, T * .3, 0, TAU * pr); ctx.stroke(); ctx.shadowBlur = 0; mode('multiply');
    }
  }
});

/* ===================== TEXTOS ===================== */
const CUES = [
  { t: 3.6, d: 5.6, k: 'narr', x: 'Tres niños juraron con sangre que nada los separaría.' },
  { t: 9.8, d: 3.8, k: 'narr', x: 'La traición los separó.' },
  { t: 13.8, d: 4.2, k: 'narr', x: 'El juramento, no.' },
  { t: 18.6, d: 7.6, k: 'ptitle', x: '<b>La Deuda de Sangre</b><i>El Juramento Roto · Episodio II</i>' },
  { t: 29.6, d: 5.6, k: 'card light', x: '<b>Primer acto</b><i>La luna llena</i>' },
  { t: 35.6, d: 7, k: 'loc light', x: '<b>Ministerio de Magia</b><i>Londres · celdas de custodia · invierno de 1895</i>' },
  { t: 40.8, d: 5, k: 'narr light', x: 'Expulsado. Sin varita. A la espera de juicio.' },
  { t: 51.2, d: 4.4, k: 'narr light', x: '<em class="R">Damien</em> fue el primero en notarlo.' },
  { t: 56, d: 5.4, k: 'narr light', x: 'Cada luna llena, el hilo del juramento se apretaba…' },
  { t: 61.6, d: 5, k: 'narr light', x: '…y la magia se le escurría entre los dedos.' },
  { t: 67.2, d: 6, k: 'narr light', x: 'Entonces recordó un libro que había leído años atrás. Y se rió.' },
  { t: 76, d: 6, k: 'loc light', x: '<b>Hogwarts</b><i>Torre de Astronomía · la misma noche</i>' },
  { t: 79.2, d: 4.8, k: 'narr light', x: 'A cientos de millas, <em class="S">Anami</em> también lo sintió.' },
  { t: 85, d: 5.6, k: 'narr light', x: 'La magia que tanto le había costado se apagaba con la luna.' },
  { t: 91.6, d: 4.2, k: 'narr light', x: '<em class="S">Draconida</em> reconoció aquel hilo.' },
  { t: 96.2, d: 6, k: 'narr light', x: 'Lo había visto dibujado en los libros prohibidos de su familia.' },
  { t: 105.4, d: 5.2, k: 'narr light', x: 'Y esta vez fue ella quien lo levantó.' },
  { t: 114, d: 4.4, k: 'narr light', x: '<em class="G">Joy</em> tampoco pudo encender una vela.' },
  { t: 124.2, d: 5, k: 'narr light', x: 'Solo le quedaba una carta que no había ardido.' },
  { t: 130.4, d: 4.2, k: 'narr light', x: 'La había leído cien veces.' },
  { t: 135.2, d: 5.6, k: 'narr light', x: 'Y por fin supo a quién tenía que buscar.' },
  { t: 145, d: 5.6, k: 'card light', x: '<b>Segundo acto</b><i>La deuda</i>' },
  { t: 151.2, d: 5, k: 'narr', x: 'Joy lo esperó bajo la nieve, con la carta en la mano.' },
  { t: 157.4, d: 6.4, k: 'narr voice', x: '«Sé que no fuiste tú. Lo supe tarde… pero lo sé.»' },
  { t: 164.6, d: 3.6, k: 'narr voice', x: '«Lo supiste tarde.»' },
  { t: 168.6, d: 3.8, k: 'narr', x: 'Él no quería reparar nada.' },
  { t: 175, d: 5.4, k: 'narr', x: 'Pero el hilo no les preguntaba qué querían.' },
  { t: 180.8, d: 4.6, k: 'narr', x: 'Y no solo los unía a ellos dos.' },
  { t: 186.6, d: 4.4, k: 'narr voice', x: '«Venid conmigo. Los dos.»' },
  { t: 191.6, d: 5.6, k: 'narr', x: 'Draconida era la única que sabía lo que estaban viendo.' },
  { t: 204, d: 6, k: 'loc light', x: '<b>Mansión Malfoy</b><i>Wiltshire</i>' },
  { t: 206.4, d: 6, k: 'narr light', x: 'Los Malfoy guardaban libros que ninguna biblioteca se atrevía a tener.' },
  { t: 216.2, d: 5.6, k: 'narr light', x: 'Un juramento de sangre solo se deshace donde se hizo…' },
  { t: 222.2, d: 5.6, k: 'narr light', x: '…con los tres presentes, y el agravio perdonado.' },
  { t: 228.4, d: 4.8, k: 'narr light', x: 'Alguien había añadido algo en el margen.' },
  { t: 236.2, d: 3, k: 'narr light', x: 'Perdonar.' },
  { t: 239.6, d: 5.6, k: 'narr light', x: 'Lo único que Anami se había jurado no hacer jamás.' },
  { t: 247, d: 5, k: 'narr light', x: 'Joy no se atrevió a pedírselo.' },
  { t: 258, d: 6.5, k: 'loc light', x: '<b>Ministerio de Magia</b><i>tres noches antes de la luna llena</i>' },
  { t: 259.6, d: 5, k: 'narr light', x: 'Damien también conocía aquel libro.' },
  { t: 267.4, d: 1.9, k: 'spell X', x: '¡Desmaius!' },
  { t: 269.5, d: 2, k: 'spell X', x: '¡Desmaius!' },
  { t: 272.6, d: 4.8, k: 'narr light', x: 'Lo había leído en la sección prohibida, años atrás.' },
  { t: 278, d: 5.6, k: 'narr light', x: 'Si uno de los tres muere, los otros dos quedan libres.' },
  { t: 284.4, d: 4.8, k: 'narr light voice', x: '«Y yo no pienso ser el que muera.»' },
  { t: 302.6, d: 5.4, k: 'narr light', x: 'Volver al porche era volver a mirarlos a los dos.' },
  { t: 309.4, d: 6, k: 'narr light', x: 'Durante años, ella lo había mirado desde esta misma orilla.' },
  { t: 316.4, d: 5, k: 'narr light', x: 'Esta vez, se sentó a su lado.' },
  { t: 322.8, d: 5, k: 'narr light voice', x: '«No lo hagas por ellos. Hazlo por ti.»' },
  { t: 339.2, d: 5.4, k: 'card light', x: '<b>Tercer acto</b><i>El porche</i>' },
  { t: 345.6, d: 3.4, k: 'narr light', x: 'Tres caminos.' },
  { t: 349.4, d: 3.4, k: 'narr light', x: 'Una sola luna.' },
  { t: 353.2, d: 5, k: 'narr light', x: 'Y el mismo porche esperándolos al final.' },
  { t: 362.4, d: 7, k: 'loc light', x: '<b>Condado de York</b><i>dieciséis años después</i>' },
  { t: 366.6, d: 5, k: 'narr', x: 'El porche seguía allí. El farol, también.' },
  { t: 377.4, d: 6.6, k: 'narr', x: 'Por un instante, volvieron a ser tres niños bajo la misma luz.' },
  { t: 390.6, d: 4.4, k: 'narr voice', x: '«Llegáis tarde. Como siempre.»' },
  { t: 395.4, d: 4.6, k: 'narr', x: 'La luna llena salió sobre los cuatro.' },
  { t: 400.2, d: 2.4, k: 'narr', x: 'Damien había venido a cobrar.' },
  { t: 402.6, d: 1.8, k: 'spell P', x: '¡Protego!' },
  { t: 405.5, d: 2, k: 'spell X', x: '¡Expelliarmus!' },
  { t: 407.8, d: 5.6, k: 'narr', x: 'Cada hechizo que lanzaban contra los otros, el hilo se lo devolvía.' },
  { t: 425.6, d: 4.6, k: 'narr', x: 'Si uno de los tres moría, los otros quedarían libres.' },
  { t: 429, d: 3.2, k: 'narr voice', x: '«Uno de los tres tiene que pagar.»' },
  { t: 432.4, d: 2.8, k: 'spell A', x: '¡Avada Kedavra!' },
  { t: 436.6, d: 6, k: 'narr', x: 'Un juramento de sangre no deja que se maten entre ellos.' },
  { t: 443, d: 4.6, k: 'narr', x: 'Nada los separaría. Ni siquiera eso.' },
  { t: 448.6, d: 4.2, k: 'narr', x: 'Solo quedaba el camino del libro.' },
  { t: 453.4, d: 4.4, k: 'narr', x: 'Joy le tendió la mano, como aquella noche en el porche.' },
  { t: 458.2, d: 5.6, k: 'narr voice', x: '«Vamos, Anami. Perdónanos. Demuéstrame que eres mejor que yo.»' },
  { t: 464.6, d: 5.8, k: 'narr', x: 'Draconida no dijo nada. Esta vez no hacía falta: estaba a su lado.' },
  { t: 472.6, d: 4.4, k: 'narr', x: 'Anami perdonó a Joy.' },
  { t: 479.4, d: 4, k: 'narr', x: 'A Damien, no.' },
  { t: 485, d: 5, k: 'narr light', x: 'Ella ató la cinta verde sobre el hilo rojo.' },
  { t: 490.4, d: 4.8, k: 'narr light', x: 'Si él iba a cargar con esa deuda, no la cargaría solo.' },
  { t: 496.4, d: 4.8, k: 'narr', x: 'Draconida había avisado a los aurores antes de salir.' },
  { t: 501.6, d: 4.4, k: 'narr', x: 'Damien desapareció antes de que llegaran.' },
  { t: 506.6, d: 7, k: 'narr', x: 'Pero el hilo que los unía a él se estiró en la oscuridad… y no se rompió.' },
  { t: 520.6, d: 5, k: 'narr', x: 'Al amanecer, Joy se quedó en el porche.' },
  { t: 526.4, d: 5.6, k: 'narr', x: 'En su muñeca quedaba un solo hilo. El de Damien.' },
  { t: 533, d: 4.2, k: 'narr', x: 'Anami no miró atrás.' },
  { t: 538.2, d: 5, k: 'narr', x: 'Draconida sí. Solo una vez.' },
  { t: 553, d: 5.4, k: 'narr light', x: 'En algún lugar del norte, Damien miró su muñeca.' },
  { t: 560.2, d: 4.4, k: 'narr light', x: 'Dos hilos seguían rojos.' },
  { t: 566, d: 7.4, k: 'narr light', x: 'Y una deuda de sangre siempre encuentra quién la pague.' },
];
const CHAPTERS = [[0, 'Prólogo'], [28, 'I · La luna llena'], [144, 'II · La deuda'], [338, 'III · El porche'], [400, 'El duelo'], [518, 'Epílogo']];
