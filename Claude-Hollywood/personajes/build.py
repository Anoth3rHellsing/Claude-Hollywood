"""Catálogo del elenco pixel: python build.py → catalogo.html (una ficha por personaje con sus cuadros)."""
import os
here = os.path.dirname(os.path.abspath(__file__))
js = open(os.path.join(here, 'src', 'elenco.js'), encoding='utf-8').read()
page = r'''<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Elenco pixel</title>
<style>
:root { --bg:#f3ecdc; --fg:#2a211c; --dim:#7a6c5c; --card:#fbf7ee; --line:#d9ccb2; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --bg:#1d1916; --fg:#f1e8d6; --dim:#a89a86; --card:#27221d; --line:#3b332b; } }
:root[data-theme="dark"] { --bg:#1d1916; --fg:#f1e8d6; --dim:#a89a86; --card:#27221d; --line:#3b332b; }
body { margin:0; background:var(--bg); color:var(--fg); font:16px/1.45 Georgia, serif; padding:24px 16px 48px; }
h1 { font-size:28px; margin:0 0 4px; } p.sub { color:var(--dim); margin:0 0 24px; max-width:70ch; }
.grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(min(100%, 420px), 1fr)); gap:16px; }
.card { background:var(--card); border:1px solid var(--line); border-radius:10px; padding:16px; }
.card h2 { margin:0; font-size:21px; } .card .rol { color:var(--dim); font-style:italic; margin:2px 0 12px; }
.frames { display:flex; flex-wrap:wrap; gap:10px; align-items:flex-end; }
.frames figure { margin:0; text-align:center; font:12px/1.2 ui-monospace, monospace; color:var(--dim); }
canvas { image-rendering:pixelated; display:block; background:repeating-conic-gradient(rgba(127,127,127,.12) 0 25%, transparent 0 50%) 0 0/8px 8px; }
</style></head><body>
<h1>Elenco pixel · mundo Clawd</h1>
<p class="sub">Todos los personajes de este mundo son sprites de 8 bits nítidos sobre escenarios en acuarela. Cada ficha guarda su paleta, su cuadrícula y sus cuadros, y su voz de bleeps (nota base y onda) para las cajas de diálogo.</p>
<div class="grid" id="g"></div>
<script>
''' + js + r'''
const FR = { teo: [['quieto', {}], ['parpadeo', { blink: true }], ['dormido', { sleep: true }], ['sorpresa', { wide: true, mouthO: true }], ['feliz', { happy: true }], ['agotado', { tired: true, flat: true }], ['corre', { legL: 2 }], ['zuecos', { clogs: true, legR: 1 }], ['cuaderno', { top: 'cuaderno', clogs: true }], ['café', { cup: true, clogs: true }]],
  valeria: [['quieta', {}], ['guiño', { wink: true }], ['feliz', { happy: true }], ['sorpresa', { wide: true, mouthO: true }]],
  rosa: [['quieta', {}], ['parpadeo', { blink: true }], ['feliz', { happy: true }], ['camina', { legL: 1 }]],
  brote: [['quieto', {}], ['feliz', { happy: true }]], tetera: [['quieta', {}], ['parpadeo', { blink: true }]], aguada: [['quieta', {}], ['parpadeo', { blink: true }]] };
const G = document.getElementById('g');
for (const id in ELENCO) { const E = ELENCO[id], d = document.createElement('div'); d.className = 'card';
  d.innerHTML = `<h2>${E.nombre}</h2><div class="rol">${E.rol} · <span>${E.pelicula}</span> · voz ${E.voz.base} Hz ${E.voz.onda}</div><div class="frames"></div>`;
  const fr = d.querySelector('.frames');
  for (const [n, o] of (FR[id] || [['quieto', {}]])) { const c = elencoCanvas(id, o), k = 4, v = document.createElement('canvas'); v.width = c.width * k; v.height = c.height * k; const g = v.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(c, 0, 0, v.width, v.height); const f = document.createElement('figure'); f.appendChild(v); f.insertAdjacentHTML('beforeend', `<figcaption>${n}</figcaption>`); fr.appendChild(f); }
  G.appendChild(d); }
</script></body></html>'''
open(os.path.join(here, 'catalogo.html'), 'w', encoding='utf-8').write(page)
print('ok catalogo.html')
