#!/usr/bin/env python3
# Schnittplan als Markdown-Tabelle aus edl.py, den Marken der Aufnahmen und den Texten aus titles.js:
#   python3 design/trailer/schnittplan.py <arbeitsordner> [raw-unterordner]  > schnittplan.md
import json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from edl import EDL, MUSIC, FPS
WORK = sys.argv[1]; RAW = os.path.join(WORK, sys.argv[2] if len(sys.argv) > 2 else 'raw')
src_js = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'titles.js'), encoding='utf-8').read()
TEXT = {}
for k, body in re.findall(r"(c_\w+): \[([^\]]*)\]", src_js): TEXT[k] = ' / '.join(re.findall(r"'([^']*)'", body))
for k, body in re.findall(r"(c_\w+_top): '([^']*)'", src_js): TEXT[k] = body

def marks(src):
    p = os.path.join(RAW, src + '.marks.json')
    return {m[1]: m[0] for m in json.load(open(p))} if os.path.exists(p) else {}

def tc(t): return f'{int(t // 60)}:{t % 60:05.2f}'
NAMES = {'ghost': 'ghost (Fläche, 40 bpm)', 'title': 'title (Malas Spieluhr-Thema, 56 bpm)', 'case1': 'case1 (Walzer, Fall 1, 84 bpm)', 'end': 'end (Thema in Dur, 56 bpm)'}

def music_at(t):
    return ', '.join(NAMES.get(m['stueck'], m['stueck']) for m in MUSIC if m['bei'] <= t < m['bei'] + m['dauer']) or '–'

print('| # | Trailer | Dauer | Quelle → Quellzeit | Bild | Handlung (Spieltext wörtlich) | Trailertext | Ton | Zweck |')
print('|---|---|---|---|---|---|---|---|---|')
t = 0
for i, e in enumerate(EDL, 1):
    a, d = t / FPS, e['n'] / FPS; mid = a + d / 2
    if 'at' in e:
        m = marks(e['src']); q = m.get(e['at']); off = e.get('off', 0.0)
        quelle = f"{e['src']} · „{e['at']}“ {off:+.2f} s → {q + off:.2f}–{q + off + d:.2f} s" if q is not None else f"{e['src']} · „{e['at']}“ (Marke fehlt)"
    elif e['frame'].startswith('html'): quelle = f"Standbild html/{e['src']}"
    else: quelle = 'titles/endbg + Ebenen'
    caps = []
    for c in e.get('caps', []):
        if c[0] in TEXT and TEXT[c[0]] not in caps: caps.append(TEXT[c[0]])
    if e['frame'] == 'end': caps = ['MALA · Die Stillen · Ein Point-and-Click-Mystery-Adventure · Entdecke MALA.']
    ton = (f"Spielton ×{e.get('gain', 0):g}; " if e.get('gain') else '') + 'Musik: ' + music_at(mid)
    row = f"| {i} | {tc(a)} | {d:.2f} s | {quelle} | {e['frame']} | {e.get('was', '')} | {' / '.join(caps) or '–'} | {ton} | {e.get('zweck', '')} |"
    print(re.sub(r'(?<=\d)\.(?=\d)', ',', row))   # deutsche Dezimalzeichen
    t += e['n']
print(f'\nSumme: {t} Bilder = {t / FPS:.3f} s'.replace('.', ','))
game = sum(e['n'] for e in EDL if e['frame'] in ('full', 'scene', 'small')) / FPS
still = sum(e['n'] for e in EDL if e['frame'].startswith('html')) / FPS
act = sum(e['n'] for e in EDL if e.get('aktion')) / FPS
end = sum(e['n'] for e in EDL if e['frame'] == 'end') / FPS
capt = sum(e['n'] for e in EDL if e.get('caps')) / FPS
print(f'Spielaufnahmen (bewegt): {game:.1f} s · Standbilder des Spiels (Menü, Touch): {still:.1f} s · Endkarte: {end:.1f} s'.replace('.', ','))
print(f'davon mit sichtbarer Spielereingabe und Rückmeldung: {act:.1f} s · Einstellungen mit Trailertext: {capt:.1f} s · Vollbild-Texttafeln: 0 s'.replace('.', ','))
