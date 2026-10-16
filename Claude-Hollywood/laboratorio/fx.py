import asyncio, sys
from playwright.async_api import async_playwright
async def main():
    html = open('dist/laboratorio.html', encoding='utf-8').read()
    open('dist/_test.html','w',encoding='utf-8').write('<!doctype html><html><head><meta charset="utf-8"></head><body>'+html+'</body></html>')
    kind = sys.argv[1]; phs = [float(x) for x in sys.argv[2].split(',')]
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width':1500,'height':900})
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file:///work/lab/dist/_test.html'); await pg.wait_for_timeout(500)
        for i,ph in enumerate(phs):
            await pg.evaluate(f'__lab.set("efectos",{{kind:"{kind}"}}); __lab.shot({4.8*3+ph}, 120)')
            el = await pg.query_selector('canvas'); await el.screenshot(path=f'shots/fx_{kind}_{i}.png')
        print(await pg.evaluate('__lab.perf(60)')); print('errores', errs[:3])
        await b.close()
asyncio.run(main())
