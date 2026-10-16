import asyncio, sys
from playwright.async_api import async_playwright
async def main():
    html = open('dist/laboratorio.html', encoding='utf-8').read()
    open('dist/_test.html','w',encoding='utf-8').write('<!doctype html><html><head><meta charset="utf-8"></head><body>'+html+'</body></html>')
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width':1500,'height':900})
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file:///work/lab/dist/_test.html'); await pg.wait_for_timeout(500)
        who = sys.argv[1] if len(sys.argv)>1 else 'joy'
        bones = 'true' if len(sys.argv)>2 else 'false'
        for i,ph in enumerate([1.6, 2.6, 4.0, 5.5, 6.8, 8.0, 9.2, 11.0]):
            await pg.evaluate(f'__lab.set("fisica",{{bones:{bones}}},{{who:"{who}"}}); FIS.rd=null; __lab.shot({10+ph}, {int(ph*60)+5})')
            el = await pg.query_selector('canvas'); await el.screenshot(path=f'shots/fis_{i}.png')
        print(await pg.evaluate('__lab.perf(60)'))
        print('errores', errs[:3])
        await b.close()
asyncio.run(main())
