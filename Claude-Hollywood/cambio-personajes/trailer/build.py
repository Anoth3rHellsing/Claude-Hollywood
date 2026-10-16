import os, sys, json
# uso: python build.py  → dist/trailer-v2.html (+ _test_trailer-v2.html)
# Necesita las tres películas con el rig nuevo (../dist/juramento-epN-nuevo.html, de swap/build.py),
# el laboratorio (LAB_SRC) y el motor de cine (CINE_SRC).
here = os.path.dirname(os.path.abspath(__file__))
def pick(env, *cands):
    for c in [os.environ.get(env)] + list(cands):
        if c and os.path.isdir(c): return c
    raise SystemExit('no encuentro ' + env)
LAB = pick('LAB_SRC', os.path.join(here, '..', '..', 'laboratorio', 'src'), '/work/lab/src')
CINE = pick('CINE_SRC', os.path.join(here, '..', '..', 'cine', 'src'), '/work/cine/src')
FILMS = pick('FILMS_DIR', os.path.join(here, '..', 'dist'), '/work/swap/dist')

INJECT = '''<style>#start,#ui,#title,#rebuild,#rot,.paused-badge,#txt>:not(#spell){display:none!important} html,body,#cv{cursor:none!important}</style>
<script>
/* modo tráiler: la película no se dibuja sola; la conduce la página de fuera */
window.render0 = render; window.render = function () { }; window.auInit = function () { };
window.__ctl = {
  ready: () => ready && !building,
  pct: () => { const e = document.getElementById('loadpct'); return e ? (parseFloat(e.textContent) || 0) : 0; },
  drive(t, dt, warm) {
    if (!ready || building) return;
    if (warm !== undefined || Math.abs(t - T) > .6 || t < T - .001) {
      const w = warm ?? .5, n = Math.max(1, Math.round(w * 20));
      seek(Math.max(0, t - w)); for (let i = 0; i < n; i++) { T += w / n; window.render0(w / n); }
    }
    T = t; window.render0(dt); updText();
  },
  lowq(v) { LOWQ = v; },
};
</script>
'''
films = {}
for k in ['e1', 'e2', 'e3']:
    h = open(os.path.join(FILMS, f'juramento-ep{k[1]}-nuevo.html'), encoding='utf-8').read()
    i = h.rfind('</body>')
    h = h[:i] + INJECT + h[i:] if i >= 0 else h + INJECT
    films[k] = h
fs = 'const FILMSRC = ' + json.dumps(films, ensure_ascii=False).replace('<', '\\u003c') + ';\n'

lab = ['01_base.js', '02_head.js', '03_hand.js', '04_body.js', '05_styles.js', '05b_fx.js']
js = '\n'.join(open(os.path.join(LAB, f), encoding='utf-8').read() for f in lab)
js += '\n' + open(os.path.join(CINE, '07_cine.js'), encoding='utf-8').read()
js += '\n' + open(os.path.join(here, '08_trailer2.js'), encoding='utf-8').read()
js += '\n' + open(os.path.join(CINE, '09_audio.js'), encoding='utf-8').read()
js += '\n' + fs
js += '\n' + open(os.path.join(here, '10_main2.js'), encoding='utf-8').read()
shell = open(os.path.join(here, 'shell.html'), encoding='utf-8').read()
out = shell.replace('/*__JS__*/', js)
os.makedirs(os.path.join(here, 'dist'), exist_ok=True)
open(os.path.join(here, 'dist', 'trailer-v2.html'), 'w', encoding='utf-8').write(out)
open(os.path.join(here, 'dist', '_test_trailer-v2.html'), 'w', encoding='utf-8').write('<!doctype html><html><head><meta charset="utf-8"></head><body>' + out + '</body></html>')
print('ok', len(out))
