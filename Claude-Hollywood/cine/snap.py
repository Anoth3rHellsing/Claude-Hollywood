import asyncio, sys
from playwright.async_api import async_playwright
async def main():
    ts = [float(x) for x in sys.argv[1].split(',')]; out = sys.argv[2] if len(sys.argv) > 2 else 's'; film = sys.argv[3] if len(sys.argv) > 3 else 'trailer'
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width':1280,'height':720})
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type=='error' else None)
        await pg.goto(f'file:///work/cine/dist/_test_{film}.html'); await pg.wait_for_timeout(500)
        await pg.evaluate("document.getElementById('play').hidden = true")
        for i,t in enumerate(ts):
            await pg.evaluate(f'__seek({t})')
            el = await pg.query_selector('canvas'); await el.screenshot(path=f'shots/{out}_{i}.png')
        if '--perf' in sys.argv:
            for t in [3, 10, 18, 24, 31, 38, 45, 52, 60]: print(t, await pg.evaluate(f'__perf({t})'))
        print('errores', [e for e in errs if 'TUNNEL' not in e][:5])
        await b.close()
asyncio.run(main())
