"""Coste de CPU por fotograma en varios instantes (sin GPU real: sirve para comparar y para encontrar picos).
Uso:  python rendimiento.py ruta/pelicula.html 30 90 175 420
Ojo: la primera medición puede llevar un pico de calentamiento; repite el instante si sale alto."""
import asyncio, sys, pathlib
from playwright.async_api import async_playwright
async def main():
    url = pathlib.Path(sys.argv[1]).resolve().as_uri()
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--use-gl=swiftshader', '--enable-gpu-rasterization', '--ignore-gpu-blocklist'])
        pg = await b.new_page(viewport={'width': 1600, 'height': 900})
        await pg.goto(url + '?t=30'); await pg.wait_for_function("document.title==='ready'", timeout=180000)
        for t in [float(x) for x in sys.argv[2:]]:
            await pg.evaluate('t=>window.__seek(t)', t); print(t, round(await pg.evaluate('window.__perf(30)'), 1), 'ms')
        await b.close()
asyncio.run(main())
