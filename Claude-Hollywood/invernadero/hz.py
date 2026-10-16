import asyncio, sys
from playwright.async_api import async_playwright
import os
HERE = os.path.dirname(os.path.abspath(__file__))
DIST = 'file:///' + os.path.join(HERE, 'dist').replace('\\', '/').lstrip('/')
os.makedirs(os.path.join(HERE, 'shots'), exist_ok=True)
# reproduce en tiempo real simulado a varias frecuencias y captura al final: python hz.py t0 dur prefix
async def main():
    t0, dur, pre = float(sys.argv[1]), float(sys.argv[2]), sys.argv[3]
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 1280, 'height': 720})
        await pg.goto(f'{DIST}/_test_invernadero.html'); await pg.wait_for_function('window.__ready === true', timeout=180000)
        await pg.evaluate("document.getElementById('play').hidden = true")
        for hz in [60, 144, 240]:
            await pg.evaluate(f"""(()=>{{ SPR.clear(); let t={t0}, acc=0; const n=Math.round({dur}*{hz}); for(let i=0;i<n;i++){{ const dt=Math.min(.1, (1/{hz})*(i%37===0?2.6:1)); t+=dt; acc+=dt; const k=Math.min(4, Math.floor(acc*60)); acc-=k/60; drawFrame(t,k); }} FROZ=t; }})()""")
            el = await pg.query_selector('canvas'); await el.screenshot(path=f'{HERE}/shots/{pre}_{hz}.png')
        await b.close()
asyncio.run(main())
