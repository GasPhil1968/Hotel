# MALA – Trailer 90 s (deutsch). Schnittplan für compose.py.
# Jeder Abschnitt ist echtes, im Browser aufgenommenes Spielmaterial (takes/<id>), Zeiten in Sekunden relativ zum ersten Bild der Aufnahme.
# Die Zeiten im Trailer ergeben sich aus der Reihenfolge (harte Schnitte). Die Endkarte füllt genau bis 90,0 s auf.

def seg(take, a, b, note='', **kw):
    d = dict(take=take, note=note, **kw); d['in'] = a; d['out'] = b; return d

SEGMENTS = [
    # ---- 00:00–00:06 Aufhänger: dieselbe Riva, zwei Blicke
    seg('riva_hook', 0.40, 6.40, 'Riva, Split, Abend: Marko, Mala, Ivka. Wechsel zu Mala: kalte Sicht, Leine aus Licht, Verbmenü an Ivka', fade_in=0.5, gain_db=5, sec='Aufhänger'),
    # ---- 00:06–00:18 Marko und Mala
    seg('marko_open', 10.06, 13.90, 'Markos Wohnung: „Seite einunddreißig von achtundvierzig …“', sec='Marko und Mala'),
    seg('marko_open', 18.55, 20.35, 'Kopfschmerz-Bild, „…Kopfschmerzen. Natürlich.“', sec='Marko und Mala'),
    seg('mala_deny', 3.70, 10.50, 'Riva: Auswahl → „Du bist eine Einbildung.“ – „Vielleicht.“ – „Dann eine, die dir nichts tut.“', sec='Marko und Mala'),
    # ---- 00:18–00:28 Welt und Geheimnis
    seg('zdenka', 0.20, 1.60, 'Veli Varoš, Split', sec='Welt und Geheimnis'),
    seg('palma', 0.40, 1.80, 'Hotel Palma, Split', sec='Welt und Geheimnis'),
    seg('stanica', 0.40, 1.80, 'Busbahnhof, Sarajevo', sec='Welt und Geheimnis'),
    seg('tram', 17.70, 19.00, 'In der Straßenbahn Linie 1', sec='Welt und Geheimnis'),
    seg('kazan', 1.00, 2.30, 'Kazandžiluk, Sarajevo', sec='Welt und Geheimnis'),
    seg('kula_tomaz', 12.76, 15.10, 'An der Kula: „Tomaž. Ich warte auf jemanden.“', sec='Welt und Geheimnis'),
    # ---- 00:28–00:44 Zusammenarbeit (Pflichtsequenz): blockiert → Wechsel → Malas Weg → Marko setzt fort → Schnitt vor dem Ergebnis
    seg('coop', 43.85, 47.30, 'Hafenbüro: „Der Band 1984 ist nicht da …“ (Marko kommt nicht weiter)', sec='Zusammenarbeit'),
    seg('coop', 58.10, 61.25, 'Mala: „Ich kann nachsehen.“ → Auswahl „(Leise:) Dann sieh nach.“', sec='Zusammenarbeit'),
    seg('coop', 80.15, 81.35, 'Wechsel zu Mala (Knopf unten links)', sec='Zusammenarbeit'),
    seg('coop', 87.20, 88.75, 'Mala geht durch die verschlossene Archivtür', sec='Zusammenarbeit'),
    seg('coop', 95.30, 100.00, 'Im Archiv, Spüren: „Die Schrift auf dem Schild ist weg …“', sec='Zusammenarbeit'),
    seg('coop', 135.40, 137.95, 'Wieder Marko: „Schauen Sie mal bei achtundvierzig.“ – Schnitt vor dem Ergebnis', sec='Zusammenarbeit'),
    # ---- 00:44–00:58 Rätsel und Ermittlung
    seg('shoebox', 22.30, 25.10, 'Ivkas Wohnung: Stricknadel auf den Schuhkarton ziehen („Benutze Stricknadel mit Schuhkarton“)', sec='Rätsel und Ermittlung'),
    seg('notebook', 6.50, 8.30, 'Notizbuch: zwei Notizen, die nicht reichen (grau)', sec='Rätsel und Ermittlung'),
    seg('notebook', 12.50, 15.60, 'Notizbuch: Schlussfolgerung (grün)', sec='Rätsel und Ermittlung'),
    seg('fikret', 5.00, 8.36, 'Busbahnhof: Fikret: „Sie! Ja, Sie, mit dem Gesicht wie ein Wörterbuch!“', sec='Rätsel und Ermittlung'),
    seg('fikret', 57.10, 60.60, 'Übersetzungsrätsel: Vorlesen → Fikrets Einwand', sec='Rätsel und Ermittlung'),
    # ---- 00:58–01:09 Menschen und Atmosphäre
    seg('zdenka', 5.20, 6.20, 'Veli Varoš: Auswahl „Wie war sie?“', sec='Menschen und Atmosphäre'),
    seg('zdenka', 7.70, 10.60, 'Zdenka: „Stur. Zu Kindern freundlich, zum Wetter nicht. …“', sec='Menschen und Atmosphäre'),
    seg('pansion_mala', 29.58, 36.88, 'Pension: „Nur wenn du lachst …“ – „Ich lache selten.“ – „Ich weiß. Ich zähle mit.“', sec='Menschen und Atmosphäre'),
    # ---- 01:09–01:20 Technischer Nutzen
    seg('title', 2.60, 5.20, 'Titelbild: Kapitelwahl', sec='Technischer Nutzen'),
    seg('title', 10.30, 12.30, 'Titelbild: Sprache bosanski / hrvatski', sec='Technischer Nutzen'),
    seg('menu1', 4.60, 7.40, 'Menü: Speichern (Platz 1) → „Gespeichert.“', mute=True, sec='Technischer Nutzen'),
    seg('reveal', 2.20, 4.80, '„Zeigen“: alle anklickbaren Stellen der Baščaršija', sec='Technischer Nutzen'),
    # ---- 01:20–01:24 Spannung
    seg('carsija_bench', 14.36, 16.40, 'Baščaršija: „Worauf wartest du dann?“', crop=(0, 0, 320, 144), sec='Spannung'),
    seg('carsija_bench', 17.20, 19.20, 'Mala: „Ich weiß nicht, auf wen.“', crop=(0, 0, 320, 144), sec='Spannung'),
]
# Jede Länge auf ganze Bilder (30/s) runden, damit Bild- und Tonschnitt auf dieselbe Bildgrenze fallen
for _s in SEGMENTS: _s['out'] = round(_s['in'] + round((_s['out'] - _s['in']) * 30) / 30, 6)
DURATION = 90.0
_pre = sum(s['out'] - s['in'] for s in SEGMENTS)
END_IN = 0.50
SEGMENTS.append(seg('title_still', END_IN, END_IN + round(DURATION - _pre, 6), 'Endkarte: Titelbild des Spiels (ohne Menü), Genre, Aufruf', crop=(0, 0, 320, 144), gain_db=-6, sec='Titel und Abschluss'))

def start(i):
    # Startzeit von Abschnitt i (0-basiert) im Trailer
    return sum(s['out'] - s['in'] for s in SEGMENTS[:i])
def end(i):
    return start(i) + SEGMENTS[i]['out'] - SEGMENTS[i]['in']

WHITE, MUTED, CYAN, AMBER = (242, 236, 224), (190, 180, 160), (170, 224, 234), (236, 182, 92)
def strip(t0, t1, *runs, fade=0.25):
    return dict(t0=round(t0, 3), t1=round(t1, 3), style='strip', runs=[list(r) for r in runs], fade=fade)
SEP = ('   ·   ', 'medium', 42, MUTED)

TEXTS = [
    strip(start(1) + 0.25, end(2) - 0.10, ('MARKO VUKOVIĆ', 'bold', 44, WHITE), SEP, ('Übersetzer in Split', 'medium', 42, MUTED)),
    strip(start(3) + 0.45, end(3) - 0.15, ('MALA', 'bold', 44, CYAN), SEP, ('ein Geist an Markos Seite', 'medium', 42, MUTED)),
    strip(start(4) + 0.15, end(6), ('Split und Sarajevo', 'semibold', 42, WHITE), SEP, ('November 2011', 'medium', 42, MUTED)),
    strip(start(9) + 0.30, end(9), ('Manche Tote warten noch.', 'semibold', 44, WHITE)),
    strip(start(11) + 1.85, end(12), ('Wechsle zwischen Marko und Mala', 'semibold', 42, WHITE)),
    strip(start(13), end(14) - 0.20, ('Mala geht, wohin Marko nicht kommt.', 'semibold', 42, WHITE)),
    strip(start(16) + 0.15, end(16), ('Kombinieren', 'semibold', 44, AMBER)),
    strip(start(17) + 0.10, end(18), ('Schlussfolgern', 'semibold', 44, AMBER)),
    strip(start(20) + 0.10, end(20), ('Übersetzen', 'semibold', 44, AMBER)),
    strip(start(24) + 0.15, end(24), ('Im Browser spielbar', 'semibold', 42, WHITE), SEP, ('mit Maus oder Touch', 'medium', 42, MUTED)),
    strip(start(25), end(25), ('Deutsch', 'semibold', 42, WHITE), SEP, ('Kapitel 1 auch auf Bosnisch/Kroatisch', 'medium', 42, MUTED)),
    strip(start(26), end(26), ('Drei Speicherplätze', 'semibold', 42, WHITE), SEP, ('speichert auch automatisch', 'medium', 42, MUTED)),
    strip(start(27), end(27) - 0.10, ('Nach vollständigem Erstladen auch offline', 'semibold', 42, WHITE)),
    dict(t0=round(start(30) + 0.45, 3), t1=DURATION + 1, style='endcard', y=892, gap=26, fade=0.5, lines=[['Ein Point-and-Click-Mystery-Adventure', 'medium', 44, MUTED]]),
    dict(t0=round(start(30) + 2.15, 3), t1=DURATION + 1, style='endcard', y=956, gap=26, fade=0.5, lines=[['Entdecke MALA.', 'bold', 62, WHITE]]),
]

# Musik: durchgehend aus der Engine (Live-Synthese), Einsätze auf Taktgrenzen. Erster Ton jeder Musikaufnahme bei 0,80 s.
#   title   56 bpm 4/4, Schlag 1,0714 s, Schleife 34,29 s (Malas Spieluhr-Motiv), Kadenz auf Schlag 28
#   case1   84 bpm 3/4, Takt 2,143 s, Schleife 17,14 s, Melodie in jeder zweiten Schleife (ab 17,94 s)
#   k2_mala 72 bpm 3/4, Takt 2,5 s, Schleife 10 s, Melodie in jeder zweiten Schleife (ab 10,81 s)
#   ghost   40 bpm 4/4, Takt 6 s, Schleife 24 s, ab 24,81 s nur Fläche
MUSIC = [
    dict(take='music_title', **{'in': 5.00}, at=2.165, dur=28.15, gain_db=24.0, fade_in=0.10, fade_out=1.3),      # Schlag 4 (Takt 2) auf den Wechsel bei 2,25 s, Kadenz bei 27,97 s
    dict(take='music_case1', **{'in': 17.593}, at=29.75, dur=29.75, gain_db=22.5, fade_in=0.35, fade_out=1.0),     # Schleife 1 (mit Melodie) ab 30,10 s
    dict(take='music_k2_mala', **{'in': 7.412}, at=58.60, dur=22.0, gain_db=30.0, fade_in=1.0, fade_out=1.0),     # Melodie-Schleife 62,0–72,0 s unter dem Gespräch in der Pension
    dict(take='music_ghost', **{'in': 24.51}, at=79.70, dur=4.6, gain_db=20.0, fade_in=0.8, fade_out=0.6),        # nur Fläche unter der Spannung
    dict(take='music_title', **{'in': 28.557}, at=83.90, dur=6.10, gain_db=24.0, fade_in=0.10, fade_out=0.0),     # Schlag 26 bei 84,0 s, Schlusskadenz (d-Moll) bei 86,14 s
]
DUCK = []
FX_GAIN = 1.0          # Geräusche aus den Aufnahmen
MUSIC_GAIN = 1.0
FX_TARGET = -36.0      # dBFS, Median-Pegel der Klangkulisse je Abschnitt
FX_MAX = 14.0          # dB, höchste automatische Verstärkung
FX_MIN = -12.0
FX_PEAK = -12.0        # dBFS, Spitzen (Klicks, Effekte) vor der Lautheitsangleichung
EDGE = 0.03            # s, Blende an jedem Tonschnitt
END_FADE = 1.8
MUS_COMP_THR = 0.16    # linear, etwa −16 dBFS
MUS_COMP_RATIO = 3.0
