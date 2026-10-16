import asyncio, sys
from playwright.async_api import async_playwright
import os
HERE = os.path.dirname(os.path.abspath(__file__))
DIST = 'file:///' + os.path.join(HERE, 'dist').replace('\\', '/').lstrip('/')
os.makedirs(os.path.join(HERE, 'shots'), exist_ok=True)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']); pg = await b.new_page(viewport={'width': 1280, 'height': 720})
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type in ('error', 'warning') else None)
        await pg.goto(f'{DIST}/_test_invernadero.html'); await pg.wait_for_function('window.__ready === true', timeout=180000)
        print('audio', await pg.evaluate('__audioTest()'))
        await pg.wait_for_timeout(1500)
        print('errores', [e for e in errs if 'fonts' not in e][:8])
        await b.close()
asyncio.run(main())
