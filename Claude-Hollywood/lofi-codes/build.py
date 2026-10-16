"""Lo-Fi Codes · construye el video musical en un solo HTML (sin recursos externos: todo es código).
uso:  python build.py            → dist/lo-fi-codes.html (+ _test_ para Playwright)
Concatena laboratorio/src/01_base.js + src/*.js, comprueba la sintaxis con node --check y mete el JS en src/shell.html."""
import os, sys, json, base64, re, subprocess
here = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(here, '..', '..'))          # carpeta Code-Corn
VOZ = os.path.join(ROOT, 'voz')
LAB = os.path.join(here, '..', 'laboratorio', 'src')

def main():
    js = open(os.path.join(LAB, '01_base.js'), encoding='utf-8').read() + '\n'
    mine = sorted(f for f in os.listdir(os.path.join(here, 'src')) if f.endswith('.js') and f[:2].isdigit())
    js += '\n'.join(open(os.path.join(here, 'src', f), encoding='utf-8').read() for f in mine)
    os.makedirs(os.path.join(here, 'dist'), exist_ok=True)
    jp = os.path.join(here, 'dist', '_all.js'); open(jp, 'w', encoding='utf-8').write(js)
    r = subprocess.run(['node', '--check', jp], capture_output=True, text=True)
    if r.returncode: print(r.stderr[:3000]); sys.exit(1)
    shell = open(os.path.join(here, 'src', 'shell.html'), encoding='utf-8').read()
    out = shell.replace('/*__JS__*/', js)
    full = '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' + out.replace('<!--BODY-->', '</head><body>') + '</body></html>'
    name = os.path.join(here, 'dist', 'lo-fi-codes.html')
    open(name, 'w', encoding='utf-8').write(full)
    open(os.path.join(here, 'dist', 'lo-fi-codes-artifact.html'), 'w', encoding='utf-8').write(out.replace('<!--BODY-->', ''))
    os.remove(jp)
    print('ok', round(len(full) / 1e6, 2), 'MB ·', mine)

main()
