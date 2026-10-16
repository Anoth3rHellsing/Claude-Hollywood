import sys, json, asyncio
from playwright.async_api import async_playwright
# uso: shot.py salida.png '[["rostro",{...},{...},t], ...]'
async def main():
    out = sys.argv[1]; jobs = json.loads(sys.argv[2])
    html = open('dist/laboratorio.html', encoding='utf-8').read()
    open('dist/_test.html','w',encoding='utf-8').write('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head><body>'+html+'</body></html>')
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width':1500,'height':900}, device_scale_factor=1)
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type=='error' else None)
        await pg.goto('file:///work/lab/dist/_test.html'); await pg.wait_for_timeout(600)
        for i,(tab,patch,glob,t) in enumerate(jobs):
            await pg.evaluate(f'__lab.set({json.dumps(tab)},{json.dumps(patch)},{json.dumps(glob)}); __lab.shot({t})')
            el = await pg.query_selector('canvas')
            await el.screenshot(path=out.replace('.png',f'_{i}.png'))
        if '--perf' in sys.argv:
            print(await pg.evaluate('__lab.perf(60)'))
        print('errores:', errs[:5])
        await b.close()
asyncio.run(main())
