import sys
from PIL import Image, ImageDraw
# uso: python sheet.py salida.png cols ancho img1 img2 ... (etiqueta = nombre)
out, cols, w = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]); ims = sys.argv[4:]
tiles = []
for p in ims:
    im = Image.open(p).convert('RGB'); h = round(im.height * w / im.width); tiles.append((p, im.resize((w, h))))
h = tiles[0][1].height; rows = (len(tiles) + cols - 1) // cols
S = Image.new('RGB', (cols * w + (cols - 1) * 4, rows * h + (rows - 1) * 4), (255, 255, 255))
for i, (p, im) in enumerate(tiles):
    x, y = (i % cols) * (w + 4), (i // cols) * (h + 4); S.paste(im, (x, y)); d = ImageDraw.Draw(S); d.rectangle([x, y, x + 64, y + 16], fill=(0, 0, 0)); d.text((x + 3, y + 2), p.split('/')[-1][:-4], fill=(255, 255, 0))
S.save(out)
