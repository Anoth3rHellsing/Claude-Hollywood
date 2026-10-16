import sys, os, asyncio
from playwright.async_api import async_playwright
# uso: shoot.py out_prefix t1 t2 ... [--w 1280 --h 720]
async def main():
    a=sys.argv[1:]; w,h=1280,720
    if '--w' in a: i=a.index('--w'); w=int(a[i+1]); del a[i:i+2]
    if '--h' in a: i=a.index('--h'); h=int(a[i+1]); del a[i:i+2]
    pre=a[0]; ts=[float(x) for x in a[1:]]
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-gpu-rasterization','--ignore-gpu-blocklist'])
        pg=await b.new_page(viewport={'width':w,'height':h})
        logs=[]
        pg.on('console',lambda m: logs.append(m.type+': '+m.text) if m.type in ('error','warning') else None)
        pg.on('pageerror',lambda e: logs.append('ERR '+str(e)))
        await pg.goto('file://'+os.path.join(os.path.dirname(os.path.abspath(__file__)),'dist','_test_trailer-v2.html'))
        try: await pg.wait_for_function("window.__ready && window.__ready()",timeout=300000)
        except Exception as e: logs.append('timeout')
        await pg.screenshot(path='%s_poster.png'%pre)
        for t in ts:
            await pg.evaluate('t=>window.__seek(t)',t)
            await pg.screenshot(path='%s_%05.1f.png'%(pre,t))
        for l in logs[:20]: print(l)
        await b.close()
asyncio.run(main())
