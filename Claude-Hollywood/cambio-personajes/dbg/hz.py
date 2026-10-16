import sys, asyncio
from playwright.async_api import async_playwright
# hz.py film.html prefix t0 dur hz [hz...]
async def main():
    f, pre, t0, dur = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4]); hzs=[float(x) for x in sys.argv[5:]]
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader'])
        pg=await b.new_page(viewport={'width':960,'height':540})
        errs=[]; pg.on('pageerror',lambda e: errs.append(str(e)))
        await pg.goto('file://'+f+'?t=%s'%t0); await pg.wait_for_function("document.title==='ready'",timeout=180000)
        for hz in hzs:
            await pg.evaluate('''([t0,dur,hz])=>{ seek(t0-1); playing=true; const st=1/hz; for(let x=0;x<dur+1;x+=st){ T+=st; render(st);} playing=false; }''',[t0,dur,hz])
            await pg.screenshot(path='%s_%dhz.png'%(pre,hz))
        print(errs[:3]); await b.close()
asyncio.run(main())
