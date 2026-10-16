import asyncio, sys, json
from playwright.async_api import async_playwright
import os
HERE = os.path.dirname(os.path.abspath(__file__))
DIST = 'file:///' + os.path.join(HERE, 'dist').replace('\\', '/').lstrip('/')
os.makedirs(os.path.join(HERE, 'shots'), exist_ok=True)
T = float(sys.argv[1]) if len(sys.argv) > 1 else 85
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 1280, 'height': 720})
        await pg.goto(f'{DIST}/_test_invernadero.html'); await pg.wait_for_function('window.__ready === true', timeout=180000)
        await pg.evaluate("document.getElementById('play').hidden = true")
        base = await pg.evaluate(f'__perf({T}, 16)'); print('base', base)
        for fn in ['drawSky','drawFarWall','drawRoof','drawFloor','drawPuddles','fernAt','treeFern','bananaAt','vineAt','drawRoots','drawSprite','drawShelf','ironColumn','drawMage','lightsComp','post','dustFx','godRays','stdFx','drawFallingWall','floorStrips']:
            r = await pg.evaluate(f"(()=>{{const o=window['{fn}']; window['{fn}']=()=>{{}}; eval('{fn}=()=>{{}}'); const r=__perf({T},12); eval('{fn}=o'); return r;}})()")
            print(f'{fn:16s} sin: {r["med"]:.1f}  (ahorra {base["med"]-r["med"]:.1f})')
        await b.close()
asyncio.run(main())
