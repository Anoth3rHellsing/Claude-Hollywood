import os, asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-gpu-rasterization','--ignore-gpu-blocklist'])
        pg=await b.new_page(viewport={'width':1280,'height':720})
        await pg.goto('file://'+os.path.join(os.path.dirname(os.path.abspath(__file__)),'dist','_test_trailer-v2.html'))
        t0=await pg.evaluate('performance.now()')
        await pg.wait_for_function("window.__ready && window.__ready()",timeout=300000)
        print('load s', (await pg.evaluate('performance.now()')-t0)/1000)
        for t in [3, 10, 26, 40, 58, 78, 84, 98]:
            ms=await pg.evaluate('''t=>{ __seek(t); const a=[]; for(let i=0;i<30;i++){const t0=performance.now(); show(t+i/60,1/60,1); a.push(performance.now()-t0);} a.sort((x,y)=>x-y); return a[15]; }''',t)
            print(t, round(ms,1))
        await b.close()
asyncio.run(main())
