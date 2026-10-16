"""Construye una película: concatena los módulos JS en orden y los inyecta en shell.html.
Uso:  python build.py kurenai | juramento-ep1 | juramento-ep2 | juramento-ep3
Salida: <pelicula>/dist/<nombre>.html (completo) y <nombre>-artifact.html (sin doctype, para publicar).
Comprueba la sintaxis después con:  node --check <pelicula>/dist/_all.js"""
import os, sys, glob
ORDER = {
  'kurenai': None,  # todos los 0*.js en orden alfabético
  'juramento-ep1': ['01_core','02_paint','02b_hp','02c_hp2','03_fig','03b_mage','04_audio','04b_music','05_fx','05b_magic','05c_duel','06_scenes','07_main'],
  'juramento-ep3': ['01_core','02_paint','02b_hp','02c_hp2','02d_ep2','02e_ep3','03_fig','03b_mage','04_audio','04b_music','05_fx','05b_magic','05c_duel','06_ep3_base','06_ep3a','06_ep3b','06_ep3c','06_ep3d','07_main'],
  'juramento-ep2': ['01_core','02_paint','02b_hp','02c_hp2','02d_ep2','03_fig','03b_mage','04_audio','04b_music','05_fx','05b_magic','05c_duel','06_ep2a','06_ep2b','06_ep2c','06_ep2d','07_main'],
}
NAME = {'kurenai': 'kurenai', 'juramento-ep1': 'juramento-ep1', 'juramento-ep2': 'la-deuda-de-sangre', 'juramento-ep3': 'la-ultima-luna'}
film = sys.argv[1] if len(sys.argv) > 1 else 'juramento-ep2'
base = os.path.join(os.path.dirname(os.path.abspath(__file__)), film)
src = os.path.join(base, 'src')
files = sorted(glob.glob(os.path.join(src, '0*.js'))) if ORDER[film] is None else [os.path.join(src, n + '.js') for n in ORDER[film]]
js = '\n'.join(open(f, encoding='utf-8').read() for f in files)
shell = open(os.path.join(src, 'shell.html'), encoding='utf-8').read()
art = shell.replace('/*__JS__*/', js)
dist = os.path.join(base, 'dist'); os.makedirs(dist, exist_ok=True)
open(os.path.join(dist, NAME[film] + '-artifact.html'), 'w', encoding='utf-8').write(art)
if art.lstrip().lower().startswith('<!doctype'):
    full = art
else:
    i = art.index('</style>') + len('</style>')
    full = ('<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
            + art[:i] + '\n</head>\n<body>\n' + art[i:] + '\n</body>\n</html>\n')
open(os.path.join(dist, NAME[film] + '.html'), 'w', encoding='utf-8').write(full)
open(os.path.join(dist, '_all.js'), 'w', encoding='utf-8').write(js)
print(film, '->', os.path.join(dist, NAME[film] + '.html'), len(full), 'bytes')
