#!/usr/bin/env python3
# Zeigt das Bildschirm-Protokoll einer Aufnahme mit Zeiten relativ zum ersten Bild (für den Schnittplan).
#   python3 events.py <take-id>
import json, sys, os
T = os.path.dirname(os.path.abspath(__file__))
tid = sys.argv[1]; D = os.path.join(T, 'takes', tid)
fr = json.load(open(os.path.join(D, 'frames.json'))); t0 = fr[0][1]
print(f'{tid}: {len(fr)} Bilder, {fr[-1][1]-t0:.1f} s')
last = None
for line in open(os.path.join(D, 'events.jsonl'), encoding='utf-8'):
    line = line.strip()
    if not line: continue
    t, (speech, dlg, ov, room, active, flash, pop, screen) = json.loads(line)
    parts = []
    if screen != 'game': parts.append(f'[{screen}]')
    parts.append(f'{room}/{active}')
    if ov: parts.append(f'<{ov}>')
    if pop: parts.append(f'menü: {pop}')
    if speech: parts.append(f'» {speech}')
    if dlg: parts.append(f'wahl: {dlg}')
    if flash: parts.append(f'hinweis: {flash}')
    s = '  '.join(parts)
    if s != last: print(f'{t-t0:7.2f}  {s}'); last = s
