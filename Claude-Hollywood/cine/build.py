import os, sys
# uso: python build.py trailer|perdon
here = os.path.dirname(os.path.abspath(__file__))
film = sys.argv[1] if len(sys.argv) > 1 else 'trailer'
LAB = os.environ.get('LAB_SRC', os.path.join(here, '..', 'laboratorio', 'src'))
if not os.path.isdir(LAB): LAB = '/work/lab/src'
lab = ['01_base.js', '02_head.js', '03_hand.js', '04_body.js', '05_styles.js', '05b_fx.js']
cine = ['07_cine.js', f'08_{film}.js', '09_audio.js', '10_main.js']
js = '\n'.join(open(os.path.join(LAB, f), encoding='utf-8').read() for f in lab)
js += '\n' + '\n'.join(open(os.path.join(here, 'src', f), encoding='utf-8').read() for f in cine)
TITLES = {'trailer': 'El Juramento Roto · Tráiler', 'perdon': 'El Perdón'}
shell = open(os.path.join(here, 'src', 'shell.html'), encoding='utf-8').read().replace('<title>El Perdón</title>', f'<title>{TITLES[film]}</title>').replace('El Perdón — escena animada', TITLES[film])
os.makedirs(os.path.join(here, 'dist'), exist_ok=True)
open(os.path.join(here, 'dist', f'_{film}.js'), 'w', encoding='utf-8').write(js)
out = shell.replace('/*__JS__*/', js)
open(os.path.join(here, 'dist', f'{film}.html'), 'w', encoding='utf-8').write(out)
open(os.path.join(here, 'dist', f'_test_{film}.html'), 'w', encoding='utf-8').write('<!doctype html><html><head><meta charset="utf-8"></head><body>' + out + '</body></html>')
print('ok', film, len(js))
