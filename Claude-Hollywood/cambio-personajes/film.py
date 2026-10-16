import sys, asyncio, json
from playwright.async_api import async_playwright
# uso: film.py out_prefix t1 t2 ... [--w 1600 --h 900]
async def main():
    args=sys.argv[1:]; w,h=1600,900
    if '--w' in args: i=args.index('--w'); w=int(args[i+1]); del args[i:i+2]
    if '--h' in args: i=args.index('--h'); h=int(args[i+1]); del args[i:i+2]
    FILE=args[0]; args=args[1:]
    pre=args[0]; ts=[float(x) for x in args[1:] if not x.startswith('--')]
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-gpu-rasterization','--ignore-gpu-blocklist'])
        pg=await b.new_page(viewport={'width':w,'height':h})
        logs=[]
        pg.on('console',lambda m: logs.append(m.type+': '+m.text) if m.type in ('error','warning') else None)
        pg.on('pageerror',lambda e: logs.append('ERR '+str(e)))
        await pg.goto('file://'+FILE+'?t=%s'%ts[0])
        try: await pg.wait_for_function("document.title==='ready'",timeout=180000)
        except Exception as e: logs.append('timeout')
        for t in ts:
            await pg.evaluate('t=>window.__seek(t)',t)
            await pg.screenshot(path='%s_%05.1f.png'%(pre,t))
        if '--perf' in sys.argv: print('ms/frame', await pg.evaluate('window.__perf(60)'))
        for l in logs[:20]: print(l)
        await b.close()
asyncio.run(main())
