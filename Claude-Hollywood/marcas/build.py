"""Libro de marcas del mundo Clawd: python build.py → catalogo.html"""
import os
here = os.path.dirname(os.path.abspath(__file__))
js = open(os.path.join(here, 'src', 'marcas.js'), encoding='utf-8').read()
page = r'''<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Marcas de Almagre</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Josefin+Sans:wght@400;600;700&family=Pacifico&family=Playfair+Display:wght@400;700&family=Space+Mono:wght@400;700&display=swap">
<style>
:root { --bg:#f3ecdc; --fg:#2a211c; --dim:#7a6c5c; --card:#fbf7ee; --line:#d9ccb2; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --bg:#1d1916; --fg:#f1e8d6; --dim:#a89a86; --card:#27221d; --line:#3b332b; } }
:root[data-theme="dark"] { --bg:#1d1916; --fg:#f1e8d6; --dim:#a89a86; --card:#27221d; --line:#3b332b; }
body { margin:0; background:var(--bg); color:var(--fg); font:16px/1.5 "Playfair Display", Georgia, serif; padding:24px 16px 48px; }
h1 { font-size:30px; margin:0 0 4px; } p.sub { color:var(--dim); margin:0 0 24px; max-width:72ch; font-family:"Josefin Sans", sans-serif; }
.grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(min(100%, 440px), 1fr)); gap:16px; }
.card { background:var(--card); border:1px solid var(--line); border-radius:10px; overflow:hidden; }
.card canvas { display:block; width:100%; height:auto; }
.txt { padding:14px 16px 16px; font-family:"Josefin Sans", sans-serif; font-size:15px; }
.txt h2 { font:700 20px "Playfair Display", Georgia, serif; margin:0; } .rubro { color:var(--dim); margin:2px 0 8px; }
.lema { font-style:italic; font-family:"Playfair Display", Georgia, serif; margin:8px 0; }
.chips { display:flex; gap:6px; margin-top:8px; } .chips span { width:28px; height:18px; border-radius:4px; border:1px solid var(--line); }
.donde { color:var(--dim); font-size:13px; margin-top:8px; }
</style></head><body>
<h1>Marcas de Almagre</h1>
<p class="sub">Identidades ficticias del mundo Clawd para decorar las películas: cada marca tiene carácter, lema, paleta y un emblema dibujado con código. Nada copia logos reales.</p>
<div class="grid" id="g"></div>
<script>
const TAU = Math.PI * 2, PI = Math.PI;
''' + js + r'''
async function go() {
  try { await Promise.race([document.fonts.load('700 20px "Playfair Display"'), new Promise(r => setTimeout(r, 2500))]); await Promise.race([Promise.all(['20px "Bebas Neue"', '700 20px "Josefin Sans"', '20px "Pacifico"', '20px "Space Mono"'].map(f => document.fonts.load(f))), new Promise(r => setTimeout(r, 2500))]); } catch (e) {}
  const G = document.getElementById('g');
  for (const id in MARCAS) { const M = MARCAS[id], d = document.createElement('div'); d.className = 'card';
    const c = document.createElement('canvas'); c.width = 880; c.height = 300; const g = c.getContext('2d');
    g.fillStyle = '#f6f0e4'; g.fillRect(0, 0, 440, 300); g.fillStyle = '#1e1a18'; g.fillRect(440, 0, 440, 300);
    marcaLogo(g, id, 26, 118, 62, {});
    marcaLogo(g, id, 466, 118, 62, { dark: true });
    d.appendChild(c);
    d.insertAdjacentHTML('beforeend', `<div class="txt"><h2>${M.nombre}</h2><div class="rubro">${M.rubro}</div><div>${M.personalidad}</div><div class="lema">«${M.lema}»</div><div class="chips">${M.pal.map(p => `<span style="background:rgb(${p})"></span>`).join('')}</div><div class="donde">Aparece en: ${M.donde}</div>${M.libros ? `<div class="donde">Títulos: ${M.libros.join(' · ')}</div>` : ''}</div>`);
    G.appendChild(d); }
}
go();
</script></body></html>'''
open(os.path.join(here, 'catalogo.html'), 'w', encoding='utf-8').write(page)
print('ok catalogo.html')
