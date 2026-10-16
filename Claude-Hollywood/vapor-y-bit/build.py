"""Entre el Vapor y el Bit · construye la película en un solo HTML (todo es código: dibujo y sonido).
uso:  python build.py  → dist/entre-el-vapor-y-el-bit.html (+ -artifact.html para publicar)
Concatena: laboratorio/src/01_base.js (núcleo) + escenarios/src/*.js (motor estándar) + personajes y marcas
(catálogos compartidos) + src/*.js (la película), comprueba la sintaxis con node --check y mete el JS en src/shell.html."""
import os, sys, subprocess
here = os.path.dirname(os.path.abspath(__file__)); HW = os.path.abspath(os.path.join(here, '..'))
def rd(*p): return open(os.path.join(HW, *p), encoding='utf-8').read() + '\n'
def mods(*p): d = os.path.join(HW, *p); return [os.path.join(*p, f) for f in sorted(os.listdir(d)) if f.endswith('.js') and f[:2].isdigit()]
def main():
    parts = [os.path.join('laboratorio', 'src', '01_base.js')] + mods('escenarios', 'src') + [os.path.join('personajes', 'src', 'elenco.js'), os.path.join('marcas', 'src', 'marcas.js')] + mods('vapor-y-bit', 'src')
    js = ''.join(rd(p) for p in parts)
    os.makedirs(os.path.join(here, 'dist'), exist_ok=True)
    jp = os.path.join(here, 'dist', '_all.js'); open(jp, 'w', encoding='utf-8').write(js)
    r = subprocess.run(['node', '--check', jp], capture_output=True, text=True)
    if r.returncode: print(r.stderr[:3000]); sys.exit(1)
    shell = open(os.path.join(here, 'src', 'shell.html'), encoding='utf-8').read(); out = shell.replace('/*__JS__*/', js)
    full = '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' + out.replace('<!--BODY-->', '</head><body>') + '</body></html>'
    open(os.path.join(here, 'dist', 'entre-el-vapor-y-el-bit.html'), 'w', encoding='utf-8').write(full)
    open(os.path.join(here, 'dist', 'entre-el-vapor-y-el-bit-artifact.html'), 'w', encoding='utf-8').write(out.replace('<!--BODY-->', ''))
    os.remove(jp); print('ok', round(len(full) / 1e6, 2), 'MB ·', len(parts), 'módulos')
main()
