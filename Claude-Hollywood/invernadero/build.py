import os, sys, subprocess
# uso: python build.py [film]   (film = invernadero | test)
here = os.path.dirname(os.path.abspath(__file__))
film = sys.argv[1] if len(sys.argv) > 1 else 'invernadero'
LAB = os.environ.get('LAB_SRC', os.path.join(here, '..', 'laboratorio', 'src'))
if not os.path.isdir(LAB): LAB = '/work/lab/src'
CINE = os.environ.get('CINE_SRC', os.path.join(here, '..', 'cine', 'src'))
if not os.path.isdir(CINE): CINE = '/work/cine/src'
lab = ['01_base.js', '02_head.js', '03_hand.js', '04_body.js', '05_styles.js', '05b_fx.js']
mine = sorted(f for f in os.listdir(os.path.join(here, 'src')) if f.endswith('.js') and f[:2].isdigit() and int(f[:2]) < 40 and not f.startswith('29_'))
if film == 'test': mine = [f for f in mine if not f.startswith('3')] + ['29_test.js']
js = '\n'.join(open(os.path.join(LAB, f), encoding='utf-8').read() for f in lab)
js += '\n' + open(os.path.join(CINE, '07_cine.js'), encoding='utf-8').read()
js += '\n' + '\n'.join(open(os.path.join(here, 'src', f), encoding='utf-8').read() for f in mine)
js += '\n' + open(os.path.join(here, 'src', '40_main.js'), encoding='utf-8').read()
shell = open(os.path.join(here, 'src', 'shell.html'), encoding='utf-8').read()
os.makedirs(os.path.join(here, 'dist'), exist_ok=True)
open(os.path.join(here, 'dist', f'_{film}.js'), 'w', encoding='utf-8').write(js)
r = subprocess.run(['node', '--check', os.path.join(here, 'dist', f'_{film}.js')], capture_output=True, text=True)
if r.returncode: print(r.stderr[:2000]); sys.exit(1)
out = shell.replace('/*__JS__*/', js)
open(os.path.join(here, 'dist', f'{film}.html'), 'w', encoding='utf-8').write(out)
open(os.path.join(here, 'dist', f'_test_{film}.html'), 'w', encoding='utf-8').write('<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + out + '</body></html>')
print('ok', film, len(js), mine)
