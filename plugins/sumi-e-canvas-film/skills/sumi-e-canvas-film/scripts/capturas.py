"""Captura fotogramas de una película en modo prueba (?t=) y, opcionalmente, mide el coste por fotograma.
Uso:  python capturas.py ruta/pelicula.html prefijo 12 40.5 88 [--perf] [--w 1600 --h 900]
Requiere:  pip install playwright  y  playwright install chromium"""
import sys, asyncio, pathlib
from playwright.async_api import async_playwright
async def main():
    a = sys.argv[1:]; w, h = 1600, 900
    if '--w' in a: i = a.index('--w'); w = int(a[i + 1]); del a[i:i + 2]
    if '--h' in a: i = a.index('--h'); h = int(a[i + 1]); del a[i:i + 2]
    url = pathlib.Path(a[0]).resolve().as_uri(); pre = a[1]; ts = [float(x) for x in a[2:] if not x.startswith('--')]
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--use-gl=swiftshader', '--enable-gpu-rasterization', '--ignore-gpu-blocklist'])
        pg = await b.new_page(viewport={'width': w, 'height': h}); logs = []
        pg.on('console', lambda m: logs.append(m.type + ': ' + m.text) if m.type in ('error', 'warning') else None)
        pg.on('pageerror', lambda e: logs.append('ERR ' + str(e)))
        await pg.goto(url + '?t=%s' % ts[0])
        await pg.wait_for_function("document.title==='ready'", timeout=180000)
        for t in ts:
            await pg.evaluate('t=>window.__seek(t)', t)
            await pg.screenshot(path='%s_%05.1f.png' % (pre, t))
        if '--perf' in sys.argv: print('ms/fotograma (CPU)', await pg.evaluate('window.__perf(60)'))
        for l in logs[:20]: print(l)
        await b.close()
asyncio.run(main())
