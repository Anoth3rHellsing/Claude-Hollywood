"""Claude Hollywood 101 · construye la película en un solo HTML.
uso:  python build.py            → dist/claude-hollywood-101.html (+ _test_ para Playwright)
Incrusta: la voz (../../voz/L01..L18.mp3), los fotogramas de las películas (assets/*.jpg) y los tiempos de los subtítulos,
que salen de la duración real de cada audio y de sus pausas (ffmpeg silencedetect)."""
import os, sys, json, base64, re, subprocess
here = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(here, '..', '..'))          # carpeta Code-Corn
VOZ = os.path.join(ROOT, 'voz')
LAB = os.path.join(here, '..', 'laboratorio', 'src')

def dur(f):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], capture_output=True, text=True).stdout.strip())

def silences(f):
    r = subprocess.run(['ffmpeg', '-hide_banner', '-i', f, '-af', 'silencedetect=n=-38dB:d=0.18', '-f', 'null', '-'], capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', r)]; en = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', r)]
    return list(zip(st, en))

def envelope(f, hz=30):
    """volumen de la voz a 30 Hz (0–1), para el vaivén del agua de Aguada y la onda de L15"""
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', '6000', '-f', 's16le', '-'], capture_output=True).stdout
    import struct
    n = len(raw) // 2; s = struct.unpack('<%dh' % n, raw[:n * 2]); step = 6000 // hz; out = []
    for i in range(0, n, step):
        seg = s[i:i + step]; out.append((sum(x * x for x in seg) / max(1, len(seg))) ** .5)
    m = max(out) or 1
    return [round(min(1, v / m * 1.15), 2) for v in out]

def split_sub(text, d, sil):
    """parte una línea en frases y las reparte en las pausas largas del audio"""
    parts = [p.strip() for p in re.split(r'(?<=[.!?…:])\s+(?=[¡¿A-ZÁÉÍÓÚÑ…])', text) if p.strip()]
    # une frases muy cortas a la siguiente
    m = []
    for p in parts:
        if m and len(m[-1]) < 18: m[-1] += ' ' + p
        else: m.append(p)
    if len(m) > 1 and len(m[-1]) < 14: m[-2] += ' ' + m.pop()
    # frases largas: se parten en la pausa de puntuación más cercana al centro
    def cut(p):
        if len(p) <= 66: return [p]
        cands = [mm.end() for mm in re.finditer(r'(: |… |\? |, )', p)]
        if not cands: return [p]
        k = min(cands, key=lambda c: abs(c - len(p) / 2))
        return cut(p[:k].strip()) + cut(p[k:].strip())
    m = [q for p in m for q in cut(p)]
    lead = sil[0][1] if sil and sil[0][0] < .05 else 0
    inner = [(a, b) for a, b in sil if a > .3 and b < d - .1]
    tail = next((a for a, b in sil if b >= d - .05), d)
    if len(m) == 1: return [[round(lead, 2), round(tail, 2), m[0]]]
    # elige k-1 pausas: las más largas, cerca de la proporción de caracteres
    tot = sum(len(p) for p in m); acc = 0; cuts = []
    for p in m[:-1]:
        acc += len(p); want = lead + (tail - lead) * acc / tot
        best = min(inner, key=lambda ab: abs((ab[0] + ab[1]) / 2 - want) - (ab[1] - ab[0]) * 2, default=None) if inner else None
        c = (best[0] + best[1]) / 2 if best and abs((best[0] + best[1]) / 2 - want) < 2.2 else want
        cuts.append(c)
        if best: inner = [x for x in inner if x != best]
    cuts.sort(); edges = [lead] + cuts + [tail]
    return [[round(edges[i], 2), round(edges[i + 1], 2), m[i]] for i in range(len(m))]

def assets():
    g = json.load(open(os.path.join(ROOT, 'guion.json'), encoding='utf-8'))
    V = {}
    for L in g['lineas']:
        f = os.path.join(VOZ, L['id'] + '.mp3')
        if not os.path.exists(f):
            d = L['chars'] / 11.5; V[L['id']] = {'d': d, 'subs': [[0, d, L['texto']]], 'env': [], 'b64': ''}; continue
        d = dur(f); sil = silences(f)
        V[L['id']] = {'d': round(d, 3), 'subs': split_sub(L['texto'], d, sil), 'env': envelope(f), 'b64': base64.b64encode(open(f, 'rb').read()).decode()}
    F = {}
    for n in sorted(os.listdir(os.path.join(here, 'assets'))):
        if n.endswith('.jpg'): F[n[:-4]] = 'data:image/jpeg;base64,' + base64.b64encode(open(os.path.join(here, 'assets', n), 'rb').read()).decode()
    return V, F

def main():
    V, F = assets()
    js = open(os.path.join(LAB, '01_base.js'), encoding='utf-8').read()
    js += '\nconst VOICE = ' + json.dumps(V, ensure_ascii=False) + ';\nconst FRAMES = ' + json.dumps(F) + ';\n'
    mine = sorted(f for f in os.listdir(os.path.join(here, 'src')) if f.endswith('.js') and f[:2].isdigit())
    js += '\n'.join(open(os.path.join(here, 'src', f), encoding='utf-8').read() for f in mine)
    os.makedirs(os.path.join(here, 'dist'), exist_ok=True)
    jp = os.path.join(here, 'dist', '_all.js'); open(jp, 'w', encoding='utf-8').write(js)
    r = subprocess.run(['node', '--check', jp], capture_output=True, text=True)
    if r.returncode: print(r.stderr[:3000]); sys.exit(1)
    shell = open(os.path.join(here, 'src', 'shell.html'), encoding='utf-8').read()
    out = shell.replace('/*__JS__*/', js)
    full = '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' + out.replace('<!--BODY-->', '</head><body>') + '</body></html>'
    name = os.path.join(here, 'dist', 'claude-hollywood-101.html')
    open(name, 'w', encoding='utf-8').write(full)
    open(os.path.join(here, 'dist', 'claude-hollywood-101-artifact.html'), 'w', encoding='utf-8').write(out.replace('<!--BODY-->', ''))
    os.remove(jp)
    tot = sum(v['d'] for v in V.values())
    print('ok', round(len(full) / 1e6, 2), 'MB · voz', round(tot, 1), 's ·', len(F), 'fotogramas ·', mine)
    if '--subs' in sys.argv:
        for k, v in V.items():
            for a, b, s in v['subs']: print(k, a, b, s)

main()
