#!/usr/bin/env python3
# Erzeugt SCHNITTPLAN.md und FEATURES.md mit allen Zeitcodes aus edl.py und den Aufnahmeprotokollen.
#   python3 doku.py <zielordner>
import os, sys, io, contextlib
T = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, T)
import edl as EDL
OUT = sys.argv[1] if len(sys.argv) > 1 else T; os.makedirs(OUT, exist_ok=True)
FPS = 30
def tc(t):
    f = int(round(t * FPS)); return f'{f // (60 * FPS):02d}:{(f // FPS) % 60:02d}:{f % FPS:02d}'
def at(i, take_t):
    s = EDL.SEGMENTS[i]; assert s['in'] - 1e-6 <= take_t <= s['out'] + 1e-6, (i, take_t); return EDL.start(i) + take_t - s['in']
def de(x, n=2): return f'{x:.{n}f}'.replace('.', ',')
def seg_tc(i): return f'{tc(EDL.start(i))}–{tc(EDL.end(i))}'
def span(i, j): return f'{tc(EDL.start(i))}–{tc(EDL.end(j))}'
def find(take, a, b=None):
    # Index des Abschnitts, der Aufnahme `take` ab Sekunde a enthält
    for i, s in enumerate(EDL.SEGMENTS):
        if s['take'] == take and s['in'] - 1e-6 <= a <= s['out'] + 1e-6: return i
    raise KeyError((take, a))

# ---------------------------------------------------------------- Schnittplan
SOLL = {'Aufhänger': (0, 6), 'Marko und Mala': (6, 18), 'Welt und Geheimnis': (18, 28), 'Zusammenarbeit': (28, 44), 'Rätsel und Ermittlung': (44, 59),
        'Menschen und Atmosphäre': (59, 70), 'Technischer Nutzen': (70, 80), 'Spannung': (80, 84), 'Titel und Abschluss': (84, 90)}
DESC = {'Aufhänger': 'Dieselbe Riva, zwei Blicke: Ein Klick auf Mala macht die Welt kalt, und Ivkas Leine aus Licht wird sichtbar. Spielszene ab dem ersten Bild.',
        'Marko und Mala': 'Marko: trocken, übermüdet, Übersetzer mit Kopfschmerz. Mala: ruhig und hartnäckig. Beziehungsmoment: „Du bist eine Einbildung.“ – „Vielleicht.“ – „Dann eine, die dir nichts tut.“',
        'Welt und Geheimnis': 'Split, dann Sarajevo, November 2011, sechs Orte. Tomaž wartet an der Kula („Tomaž. Ich warte auf jemanden.“), dazu die Einblendung „Manche Tote warten noch.“',
        'Zusammenarbeit': 'Pflichtsequenz: Marko wird blockiert, Wechsel zu Mala, Mala geht durch die Archivtür und spürt die Schrift, Marko setzt fort. Schnitt vor dem Ergebnis.',
        'Rätsel und Ermittlung': 'Inventar ziehen, Notizbuch (grau, dann grün), Fikret und das Übersetzungsrätsel',
        'Menschen und Atmosphäre': 'Zdenka über Ivka, dann Mala und Marko in der Pension: „Ich lache selten.“ – „Ich weiß. Ich zähle mit.“',
        'Technischer Nutzen': 'Titelbild mit Kapitelwahl und Sprachschalter, Speichern im Menü, „Zeigen“. Texte nur zu Geprüftem.',
        'Spannung': '„Worauf wartest du dann?“ – „Ich weiß nicht, auf wen.“ Bild auf die Szene beschnitten.',
        'Titel und Abschluss': 'Titelbild des Spiels ohne Menü, „MALA“ bis zum letzten Bild sichtbar, Genrezeile, „Entdecke MALA.“'}
secs = {}
for i, s in enumerate(EDL.SEGMENTS):
    a, b = EDL.start(i), EDL.end(i); secs.setdefault(s['sec'], [a, b]); secs[s['sec']][1] = b
mx = max(max(abs(a - SOLL[n][0]), abs(b - SOLL[n][1])) for n, (a, b) in secs.items())
buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    import runpy; runpy.run_path(os.path.join(T, 'schnittplan.py'), run_name='__main__')
tab = buf.getvalue().strip()
L = ['# MALA – Trailer 90 s: Schnittplan\n',
     'Fassung `MALA_Trailer_90s_DE.mp4`: 90,000 s, genau 2700 Bilder bei 30 Bildern/s, 1920 × 1080. Zeitcodes stehen im Format `mm:ss:Bild`. Der Schnittplan selbst ist die Datei `werkzeug/edl.py`. '
     'Dieses Dokument erzeugt `werkzeug/doku.py` aus dieser Datei und aus den Bildschirmprotokollen der Engine (`takes/<id>/events.jsonl`). Die Spalte „Spieltext im Bild“ gibt deshalb wörtlich wieder, was das Spiel im jeweiligen Abschnitt anzeigt.\n',
     '## Dramaturgie\n', '| Abschnitt | Vorgabe | Im Schnitt | Dauer | Inhalt |', '|---|---|---|---|---|']
for n, (a, b) in secs.items():
    L.append(f'| {n} | {SOLL[n][0] // 60:02d}:{SOLL[n][0] % 60:02d}–{SOLL[n][1] // 60:02d}:{SOLL[n][1] % 60:02d} | {tc(a)}–{tc(b)} | {de(b - a)} s | {DESC[n]} |')
L.append(f'\nDie Abschnittsgrenzen weichen um höchstens {de(mx)} s von der Vorgabe ab. Der Grund: Die Schnitte liegen auf Satzanfängen und Satzenden der Spieltexte, damit kein Text angeschnitten ist oder kurz aufblitzt. '
         f'In Summe sind es genau {de(EDL.end(len(EDL.SEGMENTS) - 1), 3)} s. Die Endkarte mit „MALA“ steht {de(EDL.end(30) - EDL.start(30))} s.\n')
L += ['## Schnittliste\n', tab + '\n', '## Trailer-Einblendungen\n',
      'Alle Einblendungen stehen im Textstreifen unter dem Spielbild (y 1010–1080) oder auf der Endkarte. In die Textkästen des Spiels wird nichts geschrieben.\n', '| Von | Bis | Text |', '|---|---|---|']
for x in EDL.TEXTS:
    t = ''.join(r[0] for r in x['runs']) if x.get('runs') else ' / '.join(l[0] for l in x['lines'])
    L.append(f"| {tc(x['t0'])} | {tc(min(x['t1'], 90.0))} | {t.strip()} |")
names = {'music_title': 'Titelthema (`title`)', 'music_case1': 'Fall 1 (`case1`)', 'music_k2_mala': 'Malas Thema (`k2_mala`)', 'music_ghost': 'Geisterfläche (`ghost`)'}
purp = ['Schlag 4 (Takt 2) fällt auf den Wechsel zu Mala, die Kadenz auf den Beginn der Zusammenarbeit', 'Schleife mit Melodie unter der Zusammenarbeit, danach Begleitung unter den Rätseln',
        'Malas Thema; die Melodie-Schleife liegt unter dem Gespräch in der Pension', 'Nur Fläche unter der Spannung', 'Schlussphrase von Malas Spieluhr-Motiv, d-Moll-Kadenz auf der Endkarte']
L += ['\n## Musik\n', 'Alle Stücke stammen aus der Engine selbst. Sie wurden live synthetisiert und vom Master-Ausgang aufgenommen, jedes Stück einzeln mit abgeschalteten Geräuschen (`music_*`). Die Einsätze liegen auf Takt- oder Schleifengrenzen.\n',
      '| Stück | Trailer von–bis | Aufnahme ab | Zweck |', '|---|---|---|---|']
for m, p in zip(EDL.MUSIC, purp): L.append(f"| {names[m['take']]} | {tc(m['at'])}–{tc(min(90, m['at'] + m['dur']))} | {m['in']:.3f} s | {p} |")
L += ['\n## Ton\n',
      f'- **Geräusche:** Jeder Abschnitt bringt den Ton seiner Aufnahme mit: Raumklang, Klicks, den dumpfen Klang in Malas Sicht. Der Pegel wird je Abschnitt angeglichen: Der Median der 50-ms-Fenster wird auf {EDL.FX_TARGET:.0f} dBFS gebracht, mit höchstens +{EDL.FX_MAX:.0f} dB und Spitzen bis {EDL.FX_PEAK:.0f} dBFS. An jedem Tonschnitt liegt eine Blende von {EDL.EDGE * 1000:.0f} ms. Die Aufnahme `menu1` lief mit Spielmusik und ist deshalb stumm geschaltet; dort trägt die Musikspur. Die Verstärkungen stehen in `pruefung/verstaerkungen.txt`.',
      '- **Musik:** Der Kompressor auf der Musikspur arbeitet mit Schwelle −16 dBFS, Verhältnis 3:1, Attack 4 ms und Release 180 ms. Er dämpft die Spitzen auf den Takt-Einsen.',
      '- **Lautheit:** Gemessen nach EBU R128 (ffmpeg `loudnorm`, zwei Durchgänge, linear) und auf −15 LUFS gebracht. Danach folgt ein Begrenzer bei −2 dBFS. In den letzten 1,8 s blendet der Ton aus. Messwerte am fertigen MP4 stehen in `pruefung/qc.json`.',
      '- **Sprache:** keine. Das Spiel ist nicht vertont, und der Trailer hat keinen Sprecher.\n',
      '## Bild\n',
      '- Das Spielbild (320 × 200) wird ganzzahlig ×5 mit Nearest Neighbour vergrößert: 1600 × 1000 bei x 160, y 10, auf dem dunklen Grund der Spielseite (#08070d). Nichts wird gestreckt, weichgezeichnet, animiert oder nachträglich bewegt.',
      '- In den letzten 10 s (Abschnitte 29–31) ist das Bild auf die Szene beschnitten (320 × 144, ×5 = 1600 × 720, mittig). Die Spielleiste fällt weg; Bankszene und Endkarte haben dieselbe Bildfläche.',
      '- Alle Übergänge sind harte Schnitte. Jede Abschnittslänge ist eine ganze Zahl von Bildern, Bild- und Tonschnitt liegen also auf derselben Bildgrenze. Nur das erste Bild blendet aus Schwarz auf (0,5 s), und Einblendungen blenden in 0,25 s.']
open(os.path.join(OUT, 'SCHNITTPLAN.md'), 'w').write('\n'.join(L) + '\n')

# ---------------------------------------------------------------- Feature-Matrix
K = dict(
    wechsel_riva=tc(at(find('riva_hook', 2.56), 2.56)), wechsel_buero=tc(at(find('coop', 80.73), 80.73)), hook=seg_tc(0),
    archiv=span(find('coop', 87.20), find('coop', 95.30)), marko_item=tc(EDL.start(find('shoebox', 22.30))),
    coop=span(find('coop', 43.85), find('coop', 135.40)), dlg_mala=tc(at(find('mala_deny', 3.70), 3.70)), dlg_buero=tc(at(find('coop', 59.99), 59.99)), dlg_zdenka=tc(at(find('zdenka', 5.20), 5.20)),
    inv=seg_tc(find('shoebox', 22.30)), inv_label=tc(at(find('shoebox', 23.80), 23.80)), nb_grau=tc(at(find('notebook', 6.75), 6.75)), nb_gruen=tc(at(find('notebook', 13.25), 13.25)),
    uebers=seg_tc(find('fikret', 57.10)), tomaz=tc(EDL.start(find('kula_tomaz', 12.76))), spueren=tc(at(find('coop', 95.99), 95.99)),
    titel=tc(EDL.start(find('title', 2.60))), endkarte=tc(EDL.start(len(EDL.SEGMENTS) - 1)), menu=seg_tc(find('menu1', 4.60)), bhs=seg_tc(find('title', 10.30)),
    zeigen=tc(at(find('reveal', 2.60), 2.60)), offline=tc(EDL.start(find('reveal', 2.20))), welt=span(find('zdenka', 0.20), find('kula_tomaz', 12.76)))
F = f'''# MALA – Trailer 90 s: Feature-Abdeckung

Zeitcodes im Format `mm:ss:Bild` bei 30 Bildern/s, bezogen auf `MALA_Trailer_90s_DE.mp4` (erzeugt mit `werkzeug/doku.py`). Grundlage ist der Build `web/index.html` (SHA-1 `f4b32c501563…`, Stand Commit `ae3c21e`). Jede Zeile ist entweder im Video zu sehen oder ausdrücklich als Text belegt und vorher geprüft. Prüfprotokolle liegen in `pruefung/`.

## Beworbene Funktionen

| Feature | Tatsächlich vorhanden? | Szene und Nachweis | Timecode |
|---|---|---|---|
| Zwei spielbare Figuren | Ja | Wechselknopf unten links. Marko ist lebend, Mala ist ein Geist. Der Wechsel ist an der Riva und im Hafenbüro als echte Klickaktion zu sehen. | {K['wechsel_riva']}, {K['wechsel_buero']} |
| Unterschiedliche Fähigkeiten | Ja | **Mala:** eigene Sicht, in der die Welt kalt wird und die Leine aus Licht zu sehen ist. Sie geht durch die verschlossene Archivtür und hat „Spüren“ (Nachhall). **Marko:** redet mit Lebenden, nimmt und benutzt Gegenstände. | {K['hook']}, {K['archiv']}, {K['marko_item']} |
| Mehrstufige Rätsel | Ja | Pflichtsequenz Hafenbüro: (1) Marko kommt nicht weiter, (2) Wechsel zu Mala, (3) Mala geht ins Archiv und spürt die Schrift, (4) Marko setzt fort. Der Schnitt liegt vor dem Ergebnis. | {K['coop']} |
| Kooperation beider Figuren | Ja, im Einzelspiel | Eine Person steuert beide Figuren nacheinander. Es gibt keinen Mehrspielermodus, und der Trailer deutet auch keinen an. | {K['coop']} |
| Dialog und Ermittlung | Ja | Echte Dialogauswahl mit Porträts: Mala („Du bist eine Einbildung.“), Hafenbüro („Dann sieh nach.“), Zdenka („Wie war sie?“) | {K['dlg_mala']}, {K['dlg_buero']}, {K['dlg_zdenka']} |
| Inventar | Ja | Die Stricknadel wird aus der Leiste auf den Schuhkarton gezogen, mit der Anzeige „Benutze Stricknadel mit Schuhkarton“. Das ist echte Zeigereingabe, nichts ist nachgestellt. | {K['inv']} (Anzeige ab {K['inv_label']}) |
| Notizbuch-Schlussfolgerungen | Ja | Zwei Notizen werden verbunden. Zuerst erscheint die graue Rückmeldung (reicht nicht), dann die grüne Schlussfolgerung. | {K['nb_grau']}, {K['nb_gruen']} |
| Übersetzungsrätsel | Ja | „Fikret den Brief übersetzen“: Marko liest eine Zeile vor, Fikret widerspricht. Die richtige Lösung wird nicht gezeigt. | {K['uebers']} |
| Geisterwahrnehmung | Ja | Malas Sicht mit Leine, Geister in eigener Farbe, Spüren im Archiv, Tomaž an der Kula | {K['wechsel_riva']}, {K['tomaz']}, {K['spueren']} |
| Orte | Ja | **Split:** Riva, Markos Wohnung, Veli Varoš, Hotel Palma, Hafenbüro mit Archiv, Ivkas Wohnung. **Sarajevo:** Busbahnhof, Straßenbahn, Kazandžiluk, Sahat-kula, Hajras Pension, Baščaršija. | Ortsfolge {K['welt']}, sonst durchgehend |
| Musik | Ja | Eigene Stücke der Engine, live synthetisiert und vom Master-Ausgang aufgenommen: Titelthema, Fall 1, Malas Thema, Geisterfläche | durchgehend |
| Klangkulisse | Ja | Raumklang und Geräusche der jeweiligen Aufnahme, zum Beispiel Wellen an der Riva, der dumpfe Klang in Malas Sicht und Menüklicks | durchgehend |
| Kapitel | Kapitel 1 und 2 spielbar | Das Titelbild zeigt „Kapitel 1: Split · Kapitel 2: Sarajevo“. Weitere Kapitel werden weder gezeigt noch angekündigt. | {K['titel']}, Endkarte {K['endkarte']} |
| Speichern | Ja | Menü „Speichern (Platz 1)“ → „Gespeichert.“ Es gibt drei Plätze: `SLOTS=3` in `05_engine.js` und die Platzwahl im Titelmenü. Automatisches Speichern beim Ortswechsel ist geprüft (`verify3.js`): Hafenbüro-Tür → Platz 2 mit neuem Raum und neuem Zeitstempel. Speichern und Laden über ein Neuladen der Seite ist geprüft (`verify.js`). | {K['menu']} (Text „Drei Speicherplätze · speichert auch automatisch“) |
| Maus | Ja | Alle Aufnahmen sind mit dem spieleigenen Cursor über die echten Zeigerfunktionen gemacht. | durchgehend |
| Touch | Ja, in Emulation geprüft | Ein Tippen im Touch-Kontext bewegt Marko (x 188 → 76, `verify.js`). Ein echtes Touch-Gerät ist **nicht** getestet. | Text {K['titel']} |
| Im Browser | Ja | Das Spiel ist eine HTML-Datei. Die Aufnahmen stammen aus Chromium. | Text {K['titel']} |
| Offline | Ja, **nach vollständigem Erstladen** | Über http(s) geladen und der Service Worker meldet sich. Danach funktionieren Neuladen und ein neuer Tab ohne Netz. Ein Kaltstart ohne vorheriges Laden funktioniert nicht, deshalb lautet die Formulierung im Video genau so. Die Datei-Fassung startet zusätzlich auch ohne Netz (`verify2.js`). | Text {K['offline']} („Nach vollständigem Erstladen auch offline“) |
| Sprachen | Deutsch, Kapitel 1 auch Bosnisch/Kroatisch | Der Sprachschalter im Titelbild wird live umgeschaltet. Laut `SPRACHFASSUNG_BHS.md` ist Kapitel 1 vollständig übersetzt; Kapitel 2 läuft in dieser Sprachfassung auf Deutsch. | {K['bhs']} |
| „Zeigen“ | Ja | Der Knopf blendet alle anklickbaren Stellen der Baščaršija ein: Oberleitung, Haltestelle, Bank und weitere. | {K['zeigen']} |

## Nicht beworben, weil es nicht vorhanden oder nicht geprüft ist

| Aussage | Status | Im Trailer |
|---|---|---|
| Sprachausgabe/Vertonung | Gibt es nicht, alle Dialoge sind Text | Keine Stimme, keine vorgetäuschte Vertonung, kein Sprecher |
| iPad, iOS, Safari, echte Tablets/Telefone | Nicht getestet | Nicht erwähnt |
| Spielzeit | Nicht gemessen | Nicht erwähnt |
| Preise, Auszeichnungen, Wertungen | Keine | Nicht erwähnt |
| Veröffentlichung, Store, Datum, Preis, Webadresse | Nichts bestätigt | Keine Logos, kein Datum, keine URL. Aufruf: „Entdecke MALA.“ |
| Kapitel 3–5 | Kapitel 3 ist nur Konzept (`KAPITEL3_KONZEPT.md`), 4 und 5 sind geplant | Nicht gezeigt, keine „Reihe“ angekündigt |
| Mehrspieler | Gibt es nicht | Nicht angedeutet |
'''
open(os.path.join(OUT, 'FEATURES.md'), 'w').write(F)
print('geschrieben:', os.path.join(OUT, 'SCHNITTPLAN.md'), os.path.join(OUT, 'FEATURES.md'))
print({k: v for k, v in K.items()})
