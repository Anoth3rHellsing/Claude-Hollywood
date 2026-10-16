const AU = { ac: null };
let SHOTX = { x: 0 };
const FILM = { DUR: 180, draw(t, ticks) { camSet(SHOTX); WIND.x = windAt(t) * 2.2; drawSet(t, { items: (put) => { put(800, () => drawMage('magoA', t, ticks, { rim: .5 + WS.flash * .6, col: '200,210,230' }, 'T')); put(799, () => drawMage('magoB', t, ticks, { rim: .5 + WS.flash * .6, col: '200,210,230' }, 'T')); } }); post(t); } };
window.__cam = o => { SHOTX = o; };
