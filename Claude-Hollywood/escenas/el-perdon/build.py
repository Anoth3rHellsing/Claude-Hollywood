import os, glob
here = os.path.dirname(os.path.abspath(__file__))
lab = ['01_base.js', '02_head.js', '03_hand.js', '04_body.js', '05_styles.js', '05b_fx.js']
js = '\n'.join(open(os.path.join(here, '..', '..', 'laboratorio', 'src', f), encoding='utf-8').read() for f in lab)
js += '\n' + '\n'.join(open(f, encoding='utf-8').read() for f in sorted(glob.glob(os.path.join(here, 'src', '*.js'))))
shell = open(os.path.join(here, 'src', 'shell.html'), encoding='utf-8').read()
os.makedirs(os.path.join(here, 'dist'), exist_ok=True)
open(os.path.join(here, 'dist', '_all.js'), 'w', encoding='utf-8').write(js)
out = shell.replace('/*__JS__*/', js)
open(os.path.join(here, 'dist', 'el-perdon.html'), 'w', encoding='utf-8').write(out)
open(os.path.join(here, 'dist', '_test.html'), 'w', encoding='utf-8').write('<!doctype html><html><head><meta charset="utf-8"></head><body>' + out + '</body></html>')
print('ok', len(js))
