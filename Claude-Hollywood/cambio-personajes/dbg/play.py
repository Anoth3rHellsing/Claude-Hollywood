import sys, asyncio
from playwright.async_api import async_playwright
# play.py film.html prefix hz t1 t2 ...  → reproduce 3 s seguidos a esa frecuencia (con fotogramas irregulares) antes de cada captura
async def main():
    f, pre, hz = sys.argv[1], sys.argv[2], float(sys.argv[3]); ts=[float(x) for x in sys.argv[4:]]
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader'])
        pg=await b.new_page(viewport={'width':int(__import__('os').environ.get('VW','960')),'height':int(__import__('os').environ.get('VH','540'))})
        errs=[]; pg.on('pageerror',lambda e: errs.append(str(e)))
        await pg.goto('file://'+f+'?t=%s'%ts[0]); await pg.wait_for_function("document.title==='ready'",timeout=180000)
        for t in ts:
            await pg.evaluate('''([t,hz])=>{ seek(t-3); playing=true; let x=0, i=0; while(T<t){ const st=(1/hz)*(i%7==3?2.2:1); T=Math.min(t,T+st); render(st); i++; } playing=false; updText(); }''',[t,hz])
            await pg.screenshot(path='%s_%05.1f.png'%(pre,t))
        print(errs[:3]); await b.close()
asyncio.run(main())
