import asyncio, sys, json
from playwright.async_api import async_playwright
import os
HERE = os.path.dirname(os.path.abspath(__file__))
DIST = 'file:///' + os.path.join(HERE, 'dist').replace('\\', '/').lstrip('/')
os.makedirs(os.path.join(HERE, 'shots'), exist_ok=True)
# uso: python shot.py "t1,t2,..." prefijo [film] [W H] [--cam JSON]
async def main():
    ts = [float(x) for x in sys.argv[1].split(',')]; out = sys.argv[2]; film = sys.argv[3] if len(sys.argv) > 3 else 'invernadero'
    vw, vh = (int(sys.argv[4]), int(sys.argv[5])) if len(sys.argv) > 5 and sys.argv[4].isdigit() else (1280, 720)
    cam = None
    if '--cam' in sys.argv: cam = sys.argv[sys.argv.index('--cam') + 1]
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--disable-gpu-sandbox']); pg = await b.new_page(viewport={'width': vw, 'height': vh})
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
        await pg.goto(f'{DIST}/_test_{film}.html')
        await pg.wait_for_function('window.__ready === true', timeout=180000)
        await pg.evaluate("document.getElementById('play').hidden = true")
        if cam: await pg.evaluate(f'__cam({cam})')
        for i, t in enumerate(ts):
            await pg.evaluate(f'__seek({t})')
            el = await pg.query_selector('canvas'); await el.screenshot(path=f'{HERE}/shots/{out}_{i}.png')
        if '--perf' in sys.argv:
            for t in ts: print(t, await pg.evaluate(f'__perf({t}, 20)'))
        print('errores', [e for e in errs if 'TUNNEL' not in e and 'fonts' not in e][:6])
        await b.close()
asyncio.run(main())
