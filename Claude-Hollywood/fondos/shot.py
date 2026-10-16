import sys, os, asyncio, json
from playwright.async_api import async_playwright
# uso: shot.py prefijo modo:ciudad:lt[:split] ... [--w 1920 --h 1080] [--perf] [--build]
async def main():
    a = sys.argv[1:]; w, h = 1920, 1080
    if '--w' in a: i = a.index('--w'); w = int(a[i + 1]); del a[i:i + 2]
    if '--h' in a: i = a.index('--h'); h = int(a[i + 1]); del a[i:i + 2]
    perf = '--perf' in a; bld = '--build' in a; a = [x for x in a if not x.startswith('--')]
    pre, specs = a[0], a[1:]
    here = os.path.dirname(os.path.abspath(__file__))
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--use-gl=swiftshader', '--enable-gpu-rasterization', '--ignore-gpu-blocklist'])
        pg = await b.new_page(viewport={'width': w, 'height': int(w * 9 / 16) if h is None else h})
        logs = []
        pg.on('console', lambda m: logs.append(m.type + ': ' + m.text) if m.type in ('error', 'warning') else None)
        pg.on('pageerror', lambda e: logs.append('ERR ' + str(e)))
        await pg.goto('file://' + os.path.join(here, 'dist', '_test_atlas.html'))
        await pg.wait_for_function('window.__ready === true', timeout=60000)
        await pg.evaluate("document.body.classList.remove('ui'); document.querySelector('.ui').style.display='none'")
        for s in specs:
            q = s.split(':'); mode, ci, lt = q[0], int(q[1]), float(q[2]); sp = float(q[3]) if len(q) > 3 else None
            if bld: print('build', ci, round(await pg.evaluate('i => window.__build(i)', ci)), 'ms')
            await pg.evaluate('([m,i,l,s]) => window.__shot(m,i,l,s===null?undefined:s)', [mode, ci, lt, sp])
            await pg.screenshot(path='%s_%s_%d_%.2f.png' % (pre, mode, ci, lt))
            if perf: print('perf', mode, ci, await pg.evaluate('window.__perf(20)'))
        for l in logs[:20]: print(l)
        await b.close()
asyncio.run(main())
