"""Prueba de audio: (1) dispara TODOS los eventos de la partitura (EV) y recoge excepciones
(p. ej. una nota que falta en NOTE da un AudioParam no finito); (2) reproduce a saltos por la línea de tiempo.
Uso:  python audio.py ruta/pelicula.html [t1 t2 ...]"""
import asyncio, sys, pathlib
from playwright.async_api import async_playwright
async def main():
    url = pathlib.Path(sys.argv[1]).resolve().as_uri(); ts = [float(x) for x in sys.argv[2:]] or list(range(0, 600, 15))
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
        pg = await b.new_page(viewport={'width': 960, 'height': 540}); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'TUNNEL' not in m.text else None)
        await pg.goto(url); await pg.wait_for_function("document.body.classList.contains('ready')", timeout=180000)
        await pg.click('#go'); await pg.wait_for_timeout(500)
        print('eventos', await pg.evaluate('()=>{const bad=[];let n=0;for(const e of EV){try{e.f();n++}catch(x){bad.push(e.t+": "+x.message)}};return [n,EV.length,bad.slice(0,10)]}'))
        await pg.wait_for_timeout(1500)
        for t in ts: await pg.evaluate(f'seek({t})'); await pg.wait_for_timeout(1200)
        print('estado', await pg.evaluate('AU.ac && AU.ac.state'), 'errores', errs[:10]); await b.close()
asyncio.run(main())
