#!/usr/bin/env python3
# Erzeugt den Schnittplan (Markdown) aus edl.py und den Aufnahmeprotokollen (takes/<id>/events.jsonl):
# Zeitcode, Dauer, Quelle, Inhalt, im Bild sichtbarer Spieltext, Trailer-Einblendung, Musik.
#   python3 schnittplan.py > SCHNITTPLAN_TABELLE.md
import json, os, sys
T = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, T)
import edl as EDL
FPS = 30
def tc(t):
    f = int(round(t * FPS)); return f'{f // (60 * FPS):02d}:{(f // FPS) % 60:02d}:{f % FPS:02d}'
SECTIONS = [(0, 6, 'Aufhänger'), (6, 18, 'Marko und Mala'), (18, 28, 'Welt und Geheimnis'), (28, 44, 'Zusammenarbeit'), (44, 59, 'Rätsel und Ermittlung'),
            (59, 70, 'Menschen und Atmosphäre'), (70, 80, 'Technischer Nutzen'), (80, 84, 'Spannung'), (84, 90, 'Titel und Abschluss')]
def section(t):
    best = None
    for a, b, n in SECTIONS:
        if a - 0.6 <= t < b: best = n; break
    return best or SECTIONS[-1][2]
def events(tid):
    p = os.path.join(T, 'takes', tid, 'events.jsonl'); fr = json.load(open(os.path.join(T, 'takes', tid, 'frames.json'))); t0 = fr[0][1]; ev = []
    if os.path.exists(p):
        for line in open(p, encoding='utf-8'):
            line = line.strip()
            if line: t, v = json.loads(line); ev.append((t - t0, v))
    return ev
def visible_text(tid, a, b):
    ev = events(tid); out = []
    for i, (t, v) in enumerate(ev):
        t1 = ev[i + 1][0] if i + 1 < len(ev) else 1e9
        if t1 <= a or t >= b: continue
        speech, dlg, ov, room, active, flash, pop, screen = v
        for x in ([f'„{speech.split(": ", 1)[1] if ": " in speech else speech}“'] if speech else []) + ([f'Auswahl: {dlg}'] if dlg else []) + ([f'Hinweis: {flash}'] if flash else []) + ([f'Menü: {pop}'] if pop else []):
            if x not in out: out.append(x)
    return out
def music_at(t):
    names = {'music_title': 'Titelthema', 'music_case1': 'Fall 1', 'music_k2_mala': 'Malas Thema', 'music_ghost': 'Geisterfläche'}
    return ' + '.join(names.get(m['take'], m['take']) for m in EDL.MUSIC if m['at'] <= t < m['at'] + m['dur']) or '—'
rows = []; t = 0.0
print('| Nr. | Zeitcode (mm:ss:Bild) | Dauer | Abschnitt | Aufnahme (Sek. in der Aufnahme) | Bild und Handlung | Spieltext im Bild (wörtlich) | Trailer-Einblendung | Musik |')
print('|---|---|---|---|---|---|---|---|---|')
for i, s in enumerate(EDL.SEGMENTS):
    d = s['out'] - s['in']; a, b = t, t + d
    txt = '<br>'.join(visible_text(s['take'], s['in'], s['out'])) or '—'
    caps = []
    for x in EDL.TEXTS:
        if x['t0'] < b and x['t1'] > a:
            caps.append(''.join(r[0] for r in x['runs']) if x.get('runs') else ' / '.join(l[0] for l in x['lines']))
    extra = []
    if s.get('crop'): extra.append('beschnitten auf die Szene (×5)')
    if s.get('mute'): extra.append('Ton der Aufnahme stumm')
    print(f"| {i + 1} | {tc(a)}–{tc(b)} | {d:.2f} s | {s.get('sec') or section(a + d / 2)} | `{s['take']}` {s['in']:.2f}–{s['out']:.2f} | {s.get('note', '')}{(' (' + ', '.join(extra) + ')') if extra else ''} | {txt} | {' / '.join(caps) or '—'} | {music_at(a + d / 2)} |")
    t = b
print(f'\nGesamt: {t:.3f} s = {int(round(t * FPS))} Bilder bei {FPS} Bildern/s.')
