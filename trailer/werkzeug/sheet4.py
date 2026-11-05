#!/usr/bin/env python3
# Kontaktbogen klein: python3 sheet4.py <take> <t0>:<t1>:<schritt> | t1,t2,... <out.png> [spalten]
import json, os, sys, bisect
from PIL import Image, ImageDraw
T = os.path.dirname(os.path.abspath(__file__))
tid, spec, out = sys.argv[1], sys.argv[2], sys.argv[3]; cols = int(sys.argv[4]) if len(sys.argv) > 4 else 4
if ':' in spec:
    a, b, s = [float(x) for x in spec.split(':')]; times = []; t = a
    while t <= b + 1e-6: times.append(round(t, 2)); t += s
else: times = [float(x) for x in spec.split(',')]
D = os.path.join(T, 'takes', tid); fr = json.load(open(os.path.join(D, 'frames.json'))); ts = [f[1] for f in fr]; t0 = ts[0]
rows = (len(times) + cols - 1) // cols; S = Image.new('RGB', (320 * cols, 200 * rows), (0, 0, 0)); d = ImageDraw.Draw(S)
for k, t in enumerate(times):
    i = max(0, bisect.bisect_right(ts, t0 + t) - 1); im = Image.open(os.path.join(D, fr[i][0])).convert('RGB')
    S.paste(im, ((k % cols) * 320, (k // cols) * 200)); d.rectangle([(k % cols) * 320, (k // cols) * 200, (k % cols) * 320 + 34, (k // cols) * 200 + 10], fill=(0, 0, 0)); d.text(((k % cols) * 320 + 2, (k // cols) * 200), f'{t:.2f}', fill=(255, 255, 0))
S.save(out)
