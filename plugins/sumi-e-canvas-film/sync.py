"""Sincroniza el skill publicado con el código vivo de Claude-Hollywood y arma el zip para claude.ai.
uso (desde la raíz del repo):  python plugins/sumi-e-canvas-film/sync.py
1. copia el motor (núcleo, Escenarios, elenco, marcas) a la plantilla, las guías a references/ y las herramientas a scripts/
2. construye la plantilla (comprueba que el motor funciona)
3. crea dist/sumi-e-canvas-film.zip con la carpeta del skill en la raíz (formato de subida de claude.ai)"""
import os, shutil, subprocess, sys, zipfile, glob
here = os.path.dirname(os.path.abspath(__file__)); root = os.path.abspath(os.path.join(here, '..', '..')); HW = os.path.join(root, 'Claude-Hollywood')
SK = os.path.join(here, 'skills', 'sumi-e-canvas-film'); PL = os.path.join(SK, 'assets', 'plantilla')
def cp(src, dst): os.makedirs(os.path.dirname(dst), exist_ok=True); shutil.copyfile(src, dst)
cp(os.path.join(HW, 'laboratorio', 'src', '01_base.js'), os.path.join(PL, 'motor', '01_base.js'))
shutil.rmtree(os.path.join(PL, 'motor', 'escenarios'), ignore_errors=True)
for f in sorted(glob.glob(os.path.join(HW, 'escenarios', 'src', '*.js'))): cp(f, os.path.join(PL, 'motor', 'escenarios', os.path.basename(f)))
cp(os.path.join(HW, 'personajes', 'src', 'elenco.js'), os.path.join(PL, 'motor', 'elenco.js'))
cp(os.path.join(HW, 'marcas', 'src', 'marcas.js'), os.path.join(PL, 'motor', 'marcas.js'))
for n in ['ESCENARIOS.md', 'LECCIONES.md', 'FONDOS.md', 'RIG.md']:   # en la edición pública, las notas personales se atribuyen al «director»
    txt = open(os.path.join(HW, n), encoding='utf-8').read().replace('Notas de dirección de Nico', 'Notas de dirección').replace('el PC de Nico', 'el PC del director').replace('Nico', 'el director')
    os.makedirs(os.path.join(SK, 'references'), exist_ok=True); open(os.path.join(SK, 'references', n), 'w', encoding='utf-8').write(txt)
cp(os.path.join(HW, 'tiquetes', 'tiquete.html'), os.path.join(SK, 'assets', 'tiquete.html'))
for f in sorted(glob.glob(os.path.join(HW, 'herramientas', '*'))): cp(f, os.path.join(SK, 'scripts', os.path.basename(f)))
r = subprocess.run([sys.executable, os.path.join(PL, 'build.py')], capture_output=True, text=True); print('plantilla:', (r.stdout + r.stderr).strip())
if r.returncode: sys.exit(1)
shutil.rmtree(os.path.join(PL, 'dist'), ignore_errors=True)
os.makedirs(os.path.join(root, 'dist'), exist_ok=True); zp = os.path.join(root, 'dist', 'sumi-e-canvas-film.zip')
with zipfile.ZipFile(zp, 'w', zipfile.ZIP_DEFLATED) as z:
    for d, _, fs in os.walk(SK):
        for f in fs: p = os.path.join(d, f); z.write(p, os.path.relpath(p, os.path.dirname(SK)))
print('zip:', os.path.relpath(zp, root), round(os.path.getsize(zp) / 1e3), 'KB')
