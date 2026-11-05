#!/usr/bin/env python3
# Kontaktbogen: Bilder einer Aufnahme zu bestimmten Zeiten (relativ), 2 Spalten, ×2
import json, os, sys, bisect
from PIL import Image, ImageDraw
T = os.path.dirname(os.path.abspath(__file__))
tid = sys.argv[1]; times = [float(x) for x in sys.argv[2].split(',')]; out = sys.argv[3]
D = os.path.join(T, 'takes', tid); fr = json.load(open(os.path.join(D, 'frames.json'))); ts = [f[1] for f in fr]; t0 = ts[0]
cols = 2; rows = (len(times) + 1) // 2; S = Image.new('RGB', (640 * cols, 400 * rows), (0, 0, 0)); d = ImageDraw.Draw(S)
for k, t in enumerate(times):
    i = max(0, bisect.bisect_right(ts, t0 + t) - 1); im = Image.open(os.path.join(D, fr[i][0])).convert('RGB').resize((640, 400), Image.NEAREST)
    S.paste(im, ((k % cols) * 640, (k // cols) * 400)); d.text(((k % cols) * 640 + 6, (k // cols) * 400 + 4), f'{t:.1f}s', fill=(255, 255, 0))
S.save(out)
