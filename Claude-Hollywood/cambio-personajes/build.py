import os, sys, re
# uso: python build.py juramento-ep3  → película original con los personajes del rig nuevo
here = os.path.dirname(os.path.abspath(__file__))
MOTOR = next(d for d in [os.environ.get('MOTOR_SRC'), os.path.join(here, '..', 'motor'), '/mnt/user-data/outputs/Claude-Hollywood/motor'] if d and os.path.isdir(d))
sys.path.insert(0, MOTOR)
film = sys.argv[1]
ORDER = {
  'juramento-ep1': ['01_core','02_paint','02b_hp','02c_hp2','03_fig','03b_mage','04_audio','04b_music','05_fx','05b_magic','05c_duel','06_scenes','07_main'],
  'juramento-ep2': ['01_core','02_paint','02b_hp','02c_hp2','02d_ep2','03_fig','03b_mage','04_audio','04b_music','05_fx','05b_magic','05c_duel','06_ep2a','06_ep2b','06_ep2c','06_ep2d','07_main'],
  'juramento-ep3': ['01_core','02_paint','02b_hp','02c_hp2','02d_ep2','02e_ep3','03_fig','03b_mage','04_audio','04b_music','05_fx','05b_magic','05c_duel','06_ep3_base','06_ep3a','06_ep3b','06_ep3c','06_ep3d','07_main'],
}
src = os.path.join(MOTOR, film, 'src')
old = [open(os.path.join(src, n + '.js'), encoding='utf-8').read() for n in ORDER[film]]
LAB = next(d for d in [os.environ.get('LAB_SRC'), os.path.join(here, '..', 'laboratorio', 'src'), '/work/lab/src'] if d and os.path.isdir(d))
lab = '\n'.join(open(os.path.join(LAB, f), encoding='utf-8').read() for f in ['01_base.js','02_head.js','03_hand.js','04_body.js','05_styles.js','05b_fx.js'])
rep = [
  ("const cv = document.getElementById('cv'), ctx = cv.getContext('2d');", "let cv = null, ctx = null;"),
  ("function T0(g = ctx) { g.setTransform(U, 0, 0, U, W / 2 + SHX, H / 2 + SHY); }", "let CURM = new DOMMatrix(); function T0(g = ctx) { g.setTransform(CURM); }"),
  ("PAPERPAT.setTransform(new DOMMatrix([1 / U, 0, 0, 1 / U, -W / 2 / U, -H / 2 / U])); return PAPERPAT;", "PAPERPAT.setTransform(CURM.inverse()); return PAPERPAT;"),
  ("  const a = Math.max(0, Math.floor((x0 - pad) * U + W / 2)), b = Math.max(0, Math.floor((y0 - pad) * U + H / 2));\n  return [a, b, Math.min(W, Math.ceil((x1 + pad) * U + W / 2)) - a, Math.min(H, Math.ceil((y1 + pad) * U + H / 2)) - b];",
   "  const M = CURM, cs = [[x0 - pad, y0 - pad], [x1 + pad, y0 - pad], [x0 - pad, y1 + pad], [x1 + pad, y1 + pad]].map(([x, y]) => [M.a * x + M.c * y + M.e, M.b * x + M.d * y + M.f]);\n  const a = Math.max(0, Math.floor(Math.min(...cs.map(p => p[0])))), b = Math.max(0, Math.floor(Math.min(...cs.map(p => p[1]))));\n  return [a, b, Math.min(W, Math.ceil(Math.max(...cs.map(p => p[0])))) - a, Math.min(H, Math.ceil(Math.max(...cs.map(p => p[1])))) - b];"),
  ("  trim(lines, house, w) { if (SC.sil) return; const h", "  trim(lines, house, w) { const h"),
  ("g.shadowOffsetX = -FAR * U; g.shadowOffsetY = 0;", "g.shadowOffsetX = -FAR * g.getTransform().a; g.shadowOffsetY = -FAR * g.getTransform().b;"),
]
for a, b in rep:
    if a not in lab and b in lab: continue   # ya aplicado en el laboratorio
    assert a in lab, a[:60]
    lab = lab.replace(a, b)
api = '''
GRAIN = makeGrain(); WASHTEX = makeWashTex(); HATCH = makeHatch(9, -.8, 1.3, 'rgba(52,50,62,.75)'); HATCH2 = makeHatch(5, -.8, 1.5, 'rgba(40,38,50,.9)');
function sync(g, w, h, u, sw, paper, m) { ctx = g; cv = g.canvas; if (w !== W || h !== H) { W = w; H = h; FX = mk(W, H); fx = FX.getContext('2d'); PAPERPAT = null; TINTA.tex = null; } U = u; SW = sw; if (PAPER !== paper) { PAPER = paper; PAPERPAT = null; } CURM = m; ctx.setTransform(CURM); }
function draw(J, o) {
  SC.sil = true; SC.rimCol = o.rimCol; SC.boil = false;
  const D = dressBody(J, { k: o.k, x0: o.x0, y0: o.y0, who: o.who, key: o.key, ticks: o.ticks, flip: o.flip, wand: o.wand, wandTo: o.wandTo, nearPose: o.wand ? HPOSE.varita : HPOSE.relajada, ex: EXPR.neutral, capeStiff: .14, headK: o.headK });
  const S = TINTA, L = o.L, all = []; SC.anchor = D.X([0, -50]); SC.house = o.house;
  D.parts.forEach((p, i) => { if (p.hand) renderHand(p.hand, S, { L, sep: true, rim: false }); else { S.fill(p.polys, p.k); if (p.trimLine) S.trim([p.trimLine], o.house, 2.2); } all.push(...p.polys); if (i === 0 && D.head.back.length) S.fill(D.head.back, 'hair'); });
  renderHead(D.head, S, { L, bust: false, feats: false, ex: EXPR.neutral, rim: false, noBack: true });
  all.push(...D.head.headU, ...D.head.cap, ...D.head.front, ...D.head.mid, ...D.head.back);
  for (const p of D.near) { if (p.hand) renderHand(p.hand, S, { L, sep: true, rim: false }); else S.fill(p.polys, p.k); all.push(...p.polys); }
  S.rim(all, L.d, 1.6 * o.k, o.rimA);
  return D;
}
return { sync, draw, ik2, nrm2, CAST, HAIR, inkStroke, inkBloom, paperLight, bez };
'''
nr = 'const NR = (() => {\n' + lab + '\n' + api + '})();\n'
adapter = open(os.path.join(here, 'nr_adapter.js'), encoding='utf-8').read()
js = '\n'.join(old) + '\n' + nr + adapter
shell = open(os.path.join(src, 'shell.html'), encoding='utf-8').read()
art = shell.replace('/*__JS__*/', js)
art = re.sub(r'<title>(.*?)</title>', lambda m_: '<title>' + m_.group(1) + ' · rig nuevo</title>', art, count=1)
os.makedirs(os.path.join(here, 'dist'), exist_ok=True)
open(os.path.join(here, 'dist', film + '.js'), 'w', encoding='utf-8').write(js)
if art.lstrip().lower().startswith('<!doctype'): full = art
else:
    i = art.index('</style>') + len('</style>')
    full = '<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n' + art[:i] + '\n</head>\n<body>\n' + art[i:] + '\n</body>\n</html>\n'
open(os.path.join(here, 'dist', film + '-nuevo.html'), 'w', encoding='utf-8').write(full)
open(os.path.join(here, 'dist', film + '-nuevo-artifact.html'), 'w', encoding='utf-8').write(art)
print('ok', film, len(full))
