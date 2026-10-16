import os, glob
here = os.path.dirname(os.path.abspath(__file__))
src = os.path.join(here, 'src')
js = '\n'.join(open(f, encoding='utf-8').read() for f in sorted(glob.glob(os.path.join(src, '*.js'))))
shell = open(os.path.join(src, 'shell.html'), encoding='utf-8').read()
os.makedirs(os.path.join(here, 'dist'), exist_ok=True)
open(os.path.join(here, 'dist', '_all.js'), 'w', encoding='utf-8').write(js)
open(os.path.join(here, 'dist', 'laboratorio.html'), 'w', encoding='utf-8').write(shell.replace('/*__JS__*/', js))
print('ok', len(js))
