"""Plantilla Escenarios · construye la película en un solo HTML.
uso:  python build.py  → dist/pelicula.html (completo) + dist/pelicula-artifact.html (sin <html>/<head>, para publicar como artifact)
Concatena motor/01_base.js + motor/escenarios/*.js + motor/elenco.js + motor/marcas.js + src/*.js (en orden por nombre),
comprueba la sintaxis con node --check si está instalado y mete el JS en shell.html."""
import os, sys, subprocess, shutil
here = os.path.dirname(os.path.abspath(__file__))
def rd(p): return open(os.path.join(here, p), encoding='utf-8').read() + '\n'
def mods(d): return [os.path.join(d, f) for f in sorted(os.listdir(os.path.join(here, d))) if f.endswith('.js') and f[:2].isdigit()]
def main():
    parts = ['motor/01_base.js'] + mods('motor/escenarios') + ['motor/elenco.js', 'motor/marcas.js'] + mods('src')
    js = ''.join(rd(p) for p in parts)
    os.makedirs(os.path.join(here, 'dist'), exist_ok=True)
    jp = os.path.join(here, 'dist', '_all.js'); open(jp, 'w', encoding='utf-8').write(js)
    if shutil.which('node'):
        r = subprocess.run(['node', '--check', jp], capture_output=True, text=True)
        if r.returncode: print(r.stderr[:3000]); sys.exit(1)
    os.remove(jp)
    out = rd('shell.html').replace('/*__JS__*/', js)
    full = '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' + out.replace('<!--BODY-->', '</head><body>') + '</body></html>'
    open(os.path.join(here, 'dist', 'pelicula.html'), 'w', encoding='utf-8').write(full)
    open(os.path.join(here, 'dist', 'pelicula-artifact.html'), 'w', encoding='utf-8').write(out.replace('<!--BODY-->', ''))
    print('ok', round(len(full) / 1e6, 2), 'MB ·', len(parts), 'módulos')
main()
