# Schnittliste des 90-Sekunden-Trailers (gelesen von render.py). Zeiten der Quellen über Marken aus den Aufnahmen:
# „at“ = Name der Marke in <szene>.marks.json (record.js setzt sie im Moment des Ereignisses: Klick, erster Satz, Wechsel …),
# „off“ = Versatz dazu in Sekunden. „dur“ wird in ganze Bilder (30 fps) umgerechnet; die Endkarte nimmt den Rest bis 2700.
# Texte: (png aus titles/, von, bis[, 'band'|'top'[, einblenden, ausblenden]]) – über Einstellungsgrenzen hinweg ohne Blende.
# aktion=True: In der Einstellung ist eine Eingabe des Spielers selbst zu sehen (Zeiger klickt, zieht, wählt) samt Rückmeldung.
FPS, TOTAL = 30, 2700

def E(**k):
    k['n'] = int(round(k.pop('dur') * FPS)) if 'dur' in k else 0
    return k

EDL = [
    # 1 · NACHT – sofort bedienen: Verbmenü am Bett, dann das Mädchen im Fenster und die erste Wahl (0–10 s)
    E(id='n_bett', aktion=True, was='Abend in Markos Wohnung (Split). Mauszeiger auf das Bett, Verbmenü „Bett: Benutze / Schau an“, Klick auf „Benutze“; Marko geht hin', zweck='Spielprinzip in den ersten Sekunden: Point-and-Click mit Verbmenü, Leiste, Inventar', src='night', at='Abend in der Wohnung', off=1.1, dur=3.3, frame='full', fadein=0.4, gain=0.9),
    E(id='n_marko', was='Nacht, Marko am Fenster; in der Scheibe ein Mädchen. Spieltext: „Marko.“', zweck='Mala zum ersten Mal: nur als Spiegelbild und Stimme', src='night', at='Mala: Marko.', off=-0.6, dur=2.25, frame='full'),
    E(id='n_wahl', aktion=True, was='Antwortliste „Nachts“: „Wer ist da?“ / (Licht machen.) / (Zurück ins Bett. Nicht hinsehen.) – Klick auf „Wer ist da?“', zweck='Spielerentscheidung sichtbar', src='night', at='Wahl', off=1.2, dur=2.7, frame='full'),
    E(id='n_niemand', was='Spieltext: „Niemand.“', zweck='Haken des Kaltstarts', src='night', at='Niemand.', off=-0.1, dur=1.4, frame='full'),
    # 2 · DIE BEIDEN – Marko und Mala, wer lebt und wer nicht (10–26 s)
    E(id='p_nachrufe', was='Morgen in der Wohnung, Marko am Fenster', zweck='Prämisse: Beruf und Thema', src='meet', at='Wohnung am Morgen', off=-0.1, dur=3.9, frame='scene', caps=[('c_nachrufe', 0.2, 3.8)]),
    E(id='p_wer', was='Mala steht vor dem Regal. Marko: „Wer bist du? Wie bist du hier hereingekommen?“', zweck='Mala als Gestalt, Marko fragt', src='meet', at='Wer bist du?', off=-0.05, dur=2.6, frame='full'),
    E(id='p_tuer', was='Mala: „Durch die Tür.“ – Marko: „Die Tür ist zu.“ – Mala: „Ja.“ (mit Porträts)', zweck='Ton der beiden: trocken, leise komisch; Mala beim Namen', src='meet', at='Durch die Tür.', off=-0.08, dur=5.2, frame='scene', caps=[('c_lebt', 1.3, 4.5)]),
    E(id='g_finger', was='Marko reicht ihr ein Glas Wasser. Spieltext: „Sie streckt die Hand aus. Die Finger gehen durch das Glas hindurch …“', zweck='Regel sichtbar machen: Mala kann nichts greifen', src='glass', at='Finger hindurch', off=-0.6, dur=3.2, frame='full'),
    E(id='g_siehst', was='Mala: „Du siehst mich.“', zweck='Beziehung: er ist der Einzige, der sie sieht', src='glass', at='Du siehst mich', off=-0.05, dur=1.6, frame='full'),
    # 3 · DER FALL – Ivka am Ende der Mole (26–36 s)
    E(id='i_riva', aktion=True, was='Riva bei Sonnenuntergang; Klick auf die Mole, Marko geht hinaus, Mala folgt', zweck='Ortswechsel, Bewegung durch die Welt', src='ivka', at='auf der Mole', off=-2.2, dur=2.7, frame='full'),
    E(id='i_erscheint', was='Bild am Molenende; eine alte Frau (Ivka) blendet ein', zweck='der erste Fall, ohne ihn zu erklären', src='ivka', at='Ivka erscheint', off=-0.1, dur=2.6, frame='full'),
    E(id='i_auch', was='Mala: „Du siehst sie also auch.“', zweck='Echo auf „Du siehst mich.“ – Marko sieht Geister', src='ivka', at='Du siehst sie also auch', off=-0.05, dur=2.2, frame='full'),
    E(id='i_kalt', was='Mala: „Sie friert nicht, weil ihr nicht mehr kalt sein kann.“', zweck='Tonfall des Spiels: ernst, zart', src='ivka', at='nicht mehr kalt', off=0.0, dur=2.6, frame='full'),
    # 4 · ZUSAMMENSPIEL – Markos Problem, Wechsel zu Mala, ihre Fähigkeit, Markos Reaktion (36–59 s)
    E(id='c_kalt', was='Hafenamt. Mladen: „Da drin ist es immer kalt. Ich gehe nicht gern hinein.“', zweck='Markos Problem: das Archiv bleibt zu', src='coop', at='immer kalt', off=0.05, dur=2.4, frame='full'),
    E(id='c_nachsehen', was='Mala: „Ich kann nachsehen.“', zweck='Malas Angebot', src='coop', at='Mala: Ich kann nachsehen', off=0.02, dur=1.8, frame='full'),
    E(id='c_dann', aktion=True, was='Antwortliste, Klick auf „(Leise:) ‚Dann sieh nach.‘“', zweck='Spielerentscheidung: Marko lässt sie gehen', src='coop', at='Dann sieh nach', off=-1.2, dur=2.8, frame='full'),
    E(id='c_wechsel', aktion=True, was='Klick auf das Porträt unten links: Wechsel zu Mala, die Welt wird blau', zweck='Kernmechanik: Wechsel der Figur (ein Spieler, zwei Figuren)', src='coop', at='Wechsel zu Mala', off=-2.0, dur=3.0, frame='full', caps=[('c_beide_top', 0.35, 3.0, 'top')]),
    E(id='c_tuer', was='Mala geht als Geist durch die geschlossene Archivtür; drinnen: „Hier drin ist es kalt …“', zweck='Malas Fähigkeit 1: durch Wände', src='coop', at='Wechsel zu Mala', off=4.6, dur=3.4, frame='scene', caps=[('c_waende', 0.2, 3.4, 'band', True, False)], gain=0.4),
    E(id='c_spuer', aktion=True, was='Mala am Regal: Verbmenü „Ordner bei ‚1948‘: Spüre / Schau an“, Klick auf „Spüre“; Ergebnis: „Die Schrift auf dem Schild ist weg. Die Hand, die sie geschrieben hat, nicht.“', zweck='Malas Fähigkeit 2: Spüren (eigenes Verb)', src='coop', at='spüren', off=-2.0, dur=3.5, frame='scene', caps=[('c_waende', 0.0, 3.3, 'band', False, True)], gain=0.4),
    E(id='c_schauen', aktion=True, was='Zurück bei Marko: Antwortliste, Klick auf „Schauen Sie mal im Regal bei ‚1948‘.“', zweck='Marko nutzt, was Mala gefunden hat', src='coop', at='Schauen Sie mal', off=-1.5, dur=2.7, frame='full'),
    E(id='c_tatsaechlich', was='Mladen: „Tatsächlich. Irgendein Praktikant mit einem Zahlendreher …“', zweck='Erfolg der Zusammenarbeit', src='coop', at='Tatsächlich', off=0.05, dur=1.6, frame='full'),
    E(id='c_zufall', was='Marko: „Zufall.“', zweck='Markos Reaktion: er will es noch nicht glauben', src='coop', at='Zufall.', off=-0.02, dur=1.5, frame='full'),
    # 5 · ERMITTELN – Gegenstand benutzen, Notizen verbinden, Stadtplan (59–69 s)
    E(id='v_nadel', aktion=True, was='Ivkas Wohnung: Stricknadel aus dem Inventar auf den verknoteten Schuhkarton ziehen („Benutze Stricknadel mit Schuhkarton“)', zweck='Gegenstände benutzen', src='box', at='Nadel am Knoten', off=-0.8, dur=3.3, frame='full'),
    E(id='v_notiz', aktion=True, was='Notizbuch: zwei Notizen antippen, Schluss „Keine Familie heißt nicht: niemand“', zweck='Kombinieren im Notizbuch; Thema des Spiels', src='notes', at='erste Notiz', off=0.3, dur=3.4, frame='full', gain=0.5),
    E(id='v_plan', aktion=True, was='Mostar: Stadtplan, Ziel wählen, Reise zur Koski-Moschee', zweck='Orte wählen, Reisen', src='map', at='Koski-Moschee', off=-2.2, dur=2.7, frame='full'),
    # 6 · LIED UND STÄDTE – das Lied an der Brücke (Spielmusik der Szene), vier Städte (69–78 s)
    E(id='s_lied', was='Alte Brücke: australische Straßenmusiker spielen „Kad ja pođoh na Bembašu“, Liedzeile mit deutscher Übersetzung', zweck='Gefühl, Musik der Szene, Lokalkolorit', src='song', at='Zeile 1', off=0.03, dur=2.8, frame='full', gain=1.1),
    E(id='s_mostar', was='Mostar, Busbahnhof im Regen: Marko spannt den Schirm auf', zweck='Städte: Mostar', src='mostar', at='im Regen, Schirm offen', off=-0.6, dur=1.6, frame='scene', caps=[('c_reise', 0.2, 1.6, 'band', True, False)]),
    E(id='s_sarajevo', was='Sarajevo, Baščaršija im Regen (Kapitel 2)', zweck='Städte: Sarajevo', src='sarajevo', at='Baščaršija im Regen', off=0.6, dur=1.4, frame='scene', caps=[('c_reise', 0.0, 1.4, 'band', False, False)]),
    E(id='s_muenchen', was='München Hbf, Gleis 11 (Kapitel 4)', zweck='Städte: München', src='muenchen', at='Gleis 11', off=1.4, dur=1.4, frame='scene', caps=[('c_reise', 0.0, 1.4, 'band', False, False)]),
    E(id='s_sarajevo5', was='Sarajevo, Vratnik im März (Kapitel 5)', zweck='Städte: Sarajevo, Kapitel 5', src='sarajevo5', at='Vratnik im März', off=0.6, dur=1.6, frame='scene', caps=[('c_reise', 0.0, 1.45, 'band', False, True)]),
    # 7 · KOMFORT – Hinweise von Mala, automatisches Speichern, Finger-Bedienung (78–85 s)
    E(id='k_hinweis', aktion=True, was='Menü → Hinweise → Thema „Ankommen“; Mala gibt den ersten Hinweis in der Szene', zweck='Hilfe ohne Lösungsbuch', src='hints', at='Thema Ankommen', off=-1.6, dur=2.8, frame='small', caps=[('c_hilfe', 0.2, 2.8, 'band', True, False)]),
    E(id='k_pause', was='Pausenmenü: „Automatisch gespeichert gerade eben ✓“, Speichern, Laden, Hinweise', zweck='Speichern', src='pause.png', dur=1.5, frame='html_small', caps=[('c_hilfe', 0.0, 1.4, 'band', False, True)]),
    E(id='k_touch', was='Finger-Bedienung: ein Tipp auf die Abfahrtstafel öffnet die Aktionsleiste (Benutze / Lies / Schau an / ✕)', zweck='Bedienung mit Touch (in Chromium nachgestellt)', src='touch.png', dur=3.4, frame='html_small', caps=[('c_browser', 0.15, 3.4)]),
    # 8 · ENDKARTE (Rest bis 90,0 s)
    E(id='ende', was='Endkarte: Landschaft des Titelbilds mit bewegtem Wasser; MALA, „Die Stillen“, Gattung, Aufruf', zweck='Titel und neutraler Aufruf', frame='end', fadein=0.6, fadeout=0.8),
]
# Spielton je Einstellung: Raumklang, Schritte, Klicks – leiser als die Musik
for e in EDL:
    if e['frame'] in ('full', 'scene', 'small'): e.setdefault('gain', 0.7)
rest = TOTAL - sum(e['n'] for e in EDL[:-1])
assert rest >= 150, f'Endkarte zu kurz: {rest} Bilder'
EDL[-1]['n'] = rest
assert sum(e['n'] for e in EDL) == TOTAL

# Endkarte: Schriftebenen (titles.js) – (png, Beginn der Einblendung, Dauer der Einblendung)
END_LAYERS = [('e_mala', 0.3, 0.6), ('e_stillen', 0.8, 0.5), ('e_genre', 1.3, 0.5), ('e_cta', 1.8, 0.5)]

def at(id_):   # Beginn einer Einstellung im Trailer (Sekunden)
    t = 0
    for e in EDL:
        if e['id'] == id_: return t / FPS
        t += e['n']
    raise KeyError(id_)

# Musik: Stücke des Spiels (music.js nimmt sie aus der Engine auf), alle vom Anfang des Stücks
MUSIC = [
    # Pegel so, dass die Stücke gleich laut sitzen (gemessen: ghost −40,9, title −43,6, case1 −43,7, end −44,1 LUFS bei Pegel 1);
    # die Nacht etwas leiser. „rampe“: (Sekunde im Stück, Dauer, neuer Pegel) – auf der Endkarte etwas lauter.
    dict(stueck='ghost', von=0.0, bei=0.0, dauer=at('p_nachrufe') + 0.6, ein=0.8, aus=1.2, pegel=1.5),               # Nacht: Fläche
    dict(stueck='title', von=0.0, bei=at('p_nachrufe') - 0.4, dauer=at('c_kalt') - at('p_nachrufe') + 1.0, ein=0.6, aus=1.4, pegel=2.4),   # Malas Spieluhr-Thema
    dict(stueck='case1', von=0.0, bei=at('c_kalt') - 0.3, dauer=at('s_lied') - at('c_kalt') + 0.6, ein=0.8, aus=1.0, pegel=2.4),         # Fall 1: Walzer
    dict(stueck='end', von=0.0, bei=at('s_mostar') - 0.3, dauer=TOTAL / FPS - at('s_mostar') + 0.3, ein=0.8, aus=2.4, pegel=2.5,
         rampe=(at('ende') - at('s_mostar') + 0.3, 1.5, 3.2)),                                                        # Ausklang (Thema in Dur)
]
