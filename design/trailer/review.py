#!/usr/bin/env python3
# Sichtprüfung des fertigen Trailers: python3 design/trailer/review.py <trailer.mp4> <ausgabeordner>
#   kontakt.png  – ein Bild je Sekunde (90 Bilder, 256 × 144), mit Zeitangabe
#   klein.png    – die Einstellungen mit Trailertext in Telefongröße (480 × 270): Ist der Text dann noch lesbar?
#   bilder/      – Einzelbilder in voller Größe zu ausgewählten Zeiten (Mitte jeder Einstellung)
import os, subprocess, sys
from PIL import Image, ImageDraw
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from edl import EDL, FPS
SRC, OUT = sys.argv[1], sys.argv[2]; os.makedirs(os.path.join(OUT, 'bilder'), exist_ok=True)

def frame(t, w, h, path):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.3f}', '-i', SRC, '-frames:v', '1', '-vf', f'scale={w}:{h}:flags=area', path], check=True)

def sheet(items, w, h, cols, out):
    rows = (len(items) + cols - 1) // cols; sh = Image.new('RGB', (cols * w, rows * (h + 16)), (24, 22, 30)); d = ImageDraw.Draw(sh)
    for i, (label, p) in enumerate(items):
        x, y = (i % cols) * w, (i // cols) * (h + 16); sh.paste(Image.open(p), (x, y + 16)); d.text((x + 4, y + 2), label, fill=(255, 226, 140))
    sh.save(out)

tmp = os.path.join(OUT, 'tmp'); os.makedirs(tmp, exist_ok=True)
items = []
for s in range(90):
    p = os.path.join(tmp, f'k{s:02d}.png'); frame(s + 0.5, 256, 144, p); items.append((f'{s + 0.5:.1f} s', p))
sheet(items, 256, 144, 10, os.path.join(OUT, 'kontakt.png'))
small, t = [], 0
for e in EDL:
    mid = (t + e['n'] / 2) / FPS
    full = os.path.join(OUT, 'bilder', f"{t / FPS:05.2f}_{e['id']}.png"); frame(mid, 1920, 1080, full)
    if e.get('caps') or e['frame'] == 'end':
        p = os.path.join(tmp, f"s_{e['id']}.png"); frame(min(mid + 0.4, (t + e['n'] - 3) / FPS), 480, 270, p); small.append((f"{e['id']} {mid:.1f} s", p))
    t += e['n']
sheet(small, 480, 270, 4, os.path.join(OUT, 'klein.png'))
print('kontakt.png, klein.png, bilder/ in', OUT)
