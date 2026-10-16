"""Une capturas en una hoja de contactos.  Uso:  python hoja.py prefijo salida.png 12 40.5 88   (requiere Pillow)"""
import sys
from PIL import Image
pre, out, ts = sys.argv[1], sys.argv[2], [float(x) for x in sys.argv[3:]]
cols = 3 if len(ts) > 4 else 2; w = 1920 // cols; h = w * 9 // 16; rows = (len(ts) + cols - 1) // cols
W = Image.new('RGB', (cols * w, rows * h), 'white')
for i, t in enumerate(ts): W.paste(Image.open(f'{pre}_{t:05.1f}.png').resize((w, h)), ((i % cols) * w, (i // cols) * h))
W.save(out)
