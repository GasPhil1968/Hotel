# MALA – Trailer, 90 Sekunden, Deutsch

Stand 11.11.2026. Ergebnisdatei: `MALA_Trailer_90s_DE.mp4` (Ablage und Messwerte: Abschnitt 9). Alles Bildmaterial stammt aus
dem Spiel selbst (Build-Stempel im Abschnitt 9), aufgenommen mit echter Maus- und Tastatureingabe in Chromium; die Musik ist die
Musik des Spiels, von seiner eigenen Klang-Engine erzeugt. Kein Fremdmaterial, keine nachgebauten Szenen.
Standbilder aus dem Trailer: `design/trailer/bilder/`; Testprotokolle: `qa/protokolle/trailer_2026-11-11/`.

Inhalt: 1 Referenzanalyse · 2 Kernbotschaft · 3 Bestandsaufnahme MALA · 4 Funktionsmatrix · 5 Schnittplan · 6 Texte ·
7 Ton und Musik · 8 Herstellung (wiederholbar) · 9 Prüfbericht · 10 Änderungen am Spiel während der Arbeit

---

## 1 Referenzanalyse „THE PACTMAKER“ (beigefügter Trailer)

**Methode.** Einstellungsgrenzen per Bildwechsel-Erkennung (ffmpeg, Differenz aufeinanderfolgender Bilder), je Einstellung ein
Bild aus der Mitte (Kontaktbogen), Einzelbilder alle 0,5 s, Lautheit nach EBU R128 (ffmpeg `ebur128`, Momentanwerte je Sekunde).
Den Ton habe ich gemessen, nicht angehört: über Sprecherstimme oder Musikstil sage ich deshalb nichts.
Spalten „Bild“ und „Ton“ = Beobachtung, Spalte „Funktion“ = meine Deutung.

Technisch: 1280 × 720, 60 fps, H.264 / AAC 48 kHz Stereo, 67,58 s. 28 Einstellungen. Lautheit integriert −11,8 LUFS,
Lautheitsbereich (LRA) 2,6 LU, True Peak +0,2 dBTP; die Momentanlautheit liegt durchgehend zwischen −16 und −9 LUFS.

| Zeit | Einst. | Bild (Beobachtung) | Ton (Messung) | Funktion (Deutung) |
|---|---|---|---|---|
| 0:00,0–0:02,1 | 1–2 | Figur im weißen Hemd vor einer Steinfassade mit zwei Fenstern, Regen. Kein Logo, kein Text. | sofort laut (−13 LUFS) | Einstieg direkt in der Welt |
| 0:02,1–0:12,8 | 3 | eine lange Einstellung (10,7 s): dunkles Zimmer, ein Mann steht mit einer Mappe vor Regal und Computer | −11 … −14 LUFS | Stimmung, Hauptfigur |
| 0:12,8–0:24,0 | 4–11 | acht kurze Einstellungen (0,9–2,3 s): Krankenhausbett, Cottage, Empfang eines Gasthauses, Marienstatue am Hang, gezeichnete Großaufnahme der Statue, Kaminzimmer, Familie am Kamin, Collage aus Ortsplan und Zeitung | −10 … −14 LUFS | Welt und Figuren, das Tempo zieht an |
| 0:24,0–0:30,9 | 12 | Texttafel auf violettem Nebel: „A pact must be sealed.“ (6,9 s) | unverändert laut | Prämisse als ein Satz |
| 0:30,9–0:34,3 | 13–15 | Spielszenen, durch die Papierfetzen fliegen (Zimmer, Friedhof, Tor in Orange) | −10 … −12 LUFS | übernatürlicher Konflikt |
| 0:34,3–0:40,1 | 16 | Texttafel „Hush now...“ (5,8 s) | −10 … −13 LUFS | Stimme des Gegenspielers |
| 0:40,1–0:43,4 | 17–18 | Büste in einem dunklen Raum; Gasthaus mit Schild, davor ein Auto | | Orte |
| 0:43,4–0:49,1 | 19 | Texttafel „I will not take... much.“ (5,6 s) | | Drohung, Spannung |
| 0:49,1–0:54,8 | 20–24 | Schlafzimmer mit Papierfetzen; Tor mit eingeblendetem Mobiltelefon; Stadtkarte mit Symbolen; Herrenhaus bei Nacht mit Symbolen; Kerzenkreis | | einzige Momente mit Oberfläche (Karte, Telefon), je ca. 1 s |
| 0:54,8–0:59,8 | 25–26 | grün beleuchtetes Zimmer; Weißblende mit fliegendem Papier | | Höhepunkt |
| 0:59,8–1:01,5 | 27 | Schwarz (1,7 s) | Ton läuft weiter (−13 LUFS) | Atempause vor dem Titel |
| 1:01,5–1:07,5 | 28 | Endkarte: Schriftzug, Aufruf zur Wunschliste, Plattformlogo, Szene im Hintergrund (6,0 s) | Schlussakzent (−9 LUFS) | Titel und Aufruf |

Zahlen: Texttafeln 18,3 s (27 % der Laufzeit), Endkarte 6,0 s, Schwarz 1,7 s, Weißblende 2,0 s. Spielbilder 39,6 s; ohne die
lange dritte Einstellung im Mittel 1,4 s je Einstellung. Sichtbare Spielerhandlungen (Zeiger, Inventar, Auswahl): keine;
Oberfläche nur ca. 2 s (Karte, Telefon).

### Abgeleitete Gestaltungsentscheidungen (Beobachtung → Prinzip → Umsetzung in MALA)

1. **Kein Logo am Anfang, sofort in der Welt** (0:00) → Wer den Trailer startet, ist sofort im Spiel. → MALA beginnt im
   Spielbild, und zwar mit Bedienung: in Sekunde 1–3 öffnet der Zeiger das Verbmenü am Bett und klickt „Benutze“.
2. **Prämisse in einem Satz, früh** (0:24) → Ein Satz trägt die Ausgangslage. → MALA sagt die Prämisse noch früher
   (0:10 und 0:17): „Marko schreibt Nachrufe. Auf Menschen, die allein gestorben sind.“ und „Marko lebt. Mala nicht.“
3. **Texttafeln kosten 27 % der Laufzeit und unterbrechen das Bild** → kurze Sätze ja, Vollbild-Tafeln nein. → Bei MALA steht
   Trailertext nur unter der Szene (in einem Band) oder als Streifen über dem Bild; das Spiel läuft weiter. Keine Texttafel
   außer der Endkarte. Die Geschichte erzählen die Spieltexte selbst.
4. **Das Tempo steigt** (Einstellungen 0,9–2,3 s ab 0:12, dichter werdende Akzente) → ruhig beginnen, zum Ende verdichten.
   → MALA: am Anfang Einstellungen von 2–5 s (Spieltexte müssen lesbar bleiben), im Zusammenspiel 1,5–3,5 s, die Städte in
   1,4–1,6 s, dann Ruhe auf der Endkarte.
5. **Die Referenz zeigt kaum Mechanik** (keine Zeiger, kein Inventar) → *Gegenentscheidung*: Ein Point-and-Click-Spiel
   verkauft sich über sein Spielen. → MALA zeigt in über 30 s echte Handlungen mit Rückmeldung: Verbmenüs, Antwortlisten,
   Gegenstand auf Ding ziehen, Notizen verbinden, Stadtplan, Figurenwechsel, Hinweise, Fingertipp.
6. **Atempause vor dem Titel, Endkarte mit genau einem Aufruf** (Schwarz 1,7 s, Endkarte 6 s) → klarer Schnitt, dann Titel.
   → MALA blendet ins Schwarz ab und dann die Endkarte auf (5,1 s): MALA, Gattung, „Entdecke MALA.“ – ohne Shop, ohne
   erfundene Adresse.
7. **Durchgehend laut** (−11,8 LUFS, LRA 2,6 LU, True Peak über 0 dBTP) → *Gegenentscheidung*: Ein stilles Mystery braucht
   leise Stellen, und Spitzen über 0 dBTP verzerren bei der Umwandlung. → MALA: Ziel −15 LUFS integriert, ≤ −1,5 dBTP; leiser
   Anfang in der Nacht, Musikwechsel an den Abschnittsgrenzen, ein Moment Musik aus der Szene (das Lied an der Brücke).
8. **Akzente durch Effekte** (fliegendes Papier, Weißblende) → Akzente setzen, aber aus dem Spiel. → MALA nutzt Momente, die
   die Engine selbst zeigt: die Welt wird blau, wenn man zu Mala wechselt; Mala geht durch die Tür; Ivka blendet am Molenende
   ein. Keine nachträglichen Bildeffekte außer Ab- und Aufblenden.

Nicht übernommen: Bilder, Musik, Logos, Sätze oder Schriftbild der Referenz; englische Texte; Aufrufe zu Shop oder Wunschliste.

---

## 2 Kernbotschaft

**Ein stilles Point-and-Click-Mystery: Marko schreibt Nachrufe auf Menschen, die allein gestorben sind. Mala ist tot und geht
durch Wände. Zusammen finden sie heraus, wer diese Menschen waren – und du spielst beide.**

Daraus die drei Schritte des Trailers: (1) die beiden und die Regel (er lebt, sie nicht), (2) ein Fall (Ivka am Ende der Mole),
(3) das Zusammenspiel als Mechanik (Problem bei Marko → Wechsel zu Mala → ihre Fähigkeit → Markos Reaktion), danach Breite
(Rätselarten, Städte) und Zugänglichkeit (Hinweise, Speichern, Touch).

---

## 3 Bestandsaufnahme der aktuellen MALA-Version

Geprüft am Build des Trailers (Abschnitt 9) mit den Werkzeugen des Projekts: Musterlösungen Kapitel 1–5 (`game/tools/walkthrough*.js`),
Regression (`qa/regress/run.js`), Offline-Test (`game/tools/offlinetest.js`), dazu die Trailer-Aufnahmen selbst, die jede gezeigte
Handlung mit echter Eingabe ausführen (`design/trailer/scenes.js`).

### Szenenkandidaten und Spoilerprüfung

| Kandidat | Quelle (Spielstand) | Entscheidung | Grund |
|---|---|---|---|
| Nacht: Mädchen im Fenster, „Marko.“, „Niemand.“ | K1, Prolog Dienstagnacht (Musterlösung K1, Stand 14) | verwendet | Prämisse, ganz am Anfang des Spiels |
| erste Begegnung, Glas Wasser, „Du siehst mich.“ | K1, Mittwochmorgen (Stand 16) | verwendet | Prämisse; im Spiel nach ca. 15 Minuten |
| Ivka am Ende der Mole | K1, Fall 1 (Stand 18) | verwendet | Ausgangslage des ersten Falls, keine Auflösung |
| Hafenamt: Wechsel, Archiv, Spüren, „Zufall.“ | K1, Praxistest (Stand 19) | verwendet | Kernmechanik; der Inhalt des Ordners bleibt ungelesen |
| Hafenbuch 1984 (Dokument mit Namen und Unglück) | K1, Hafenamt | **nicht verwendet** | lesbare Fall-Lösung |
| Postkarte von Tonći, Übersetzung | K1, Ivkas Wohnung | **nicht verwendet** | Hintergrund des Falls |
| Spüren-Ergebnis „eine Seite … mit zitternder Hand …“ | K1, Archiv | **nicht verwendet** | weist auf die Auflösung |
| Ivka erkennt, dass sie tot ist; Zwischenwelt | K1, Finale Fall 1 | **nicht verwendet** | Ende des Falls |
| Kapitelwahl mit Kapitel 5 ausgewählt („Der letzte Samstag mit der Drei“) | Titel → Kapitel wählen | **nicht verwendet** | Text zu Kapitel 5 könnte vorgreifen |
| Malas Herkunft und Identität (spätere Kapitel) | K4/K5 | **nicht verwendet** | Kern-Spoiler |
| Lied an der Brücke (Straßenmusiker) | K3, Samstag | verwendet | Stimmung; ohne Handlungsfolgen gezeigt |
| Ankunft im Regen mit Schirm, Baščaršija, Gleis 11, Vratnik | K3, K2, K4, K5 (je Anfang) | verwendet | reine Orte, kein Handlungsinhalt |
| Hinweise, Pausenmenü, Fingertipp | K3, Ankunft | verwendet | Bedienung |

### Behauptungen, die der Trailer bewusst nicht macht

* **Echte Geräte**: Touch ist im Spiel umgesetzt und in Chromium mit Touch-Emulation getestet, nicht auf einem echten iPad
  oder Telefon. Der Trailer sagt deshalb nur „Maus oder Touch“ und nennt keine Geräte.
* **„Jederzeit wechseln“**: Der Wechsel wird in Kapitel 1 erst nach dem Praxistest frei und ist in einzelnen Szenen gesperrt
  (z. B. wenn Mala abwesend ist). Der Text sagt „Ein Klick, und du wechselst.“
* **Sprachen**: nur Deutsch wird gezeigt und nichts anderes behauptet.
* **Andere Browser** als Chromium wurden in diesem Lauf nicht geprüft; der Text sagt „Im Browser“.
* Keine Plattformen, Shops, Preise, Termine, Auszeichnungen, Adressen.

---

## 4 Funktionsmatrix

| Merkmal | Status | Beleg | im Trailer | Grenzen |
|---|---|---|---|---|
| Point-and-Click mit Verbmenü (Benutze, Schau an, Nimm, Öffne …) | geprüft | Aufnahmen `night`, `box`; Musterlösungen K1–K5 | 0:00–0:03 | – |
| Antwortlisten im Gespräch | geprüft | Aufnahmen `night`, `coop` | 0:06, 0:40, 0:53 | – |
| zwei Figuren, Wechsel über das Porträt unten links | geprüft | Aufnahme `coop` (Klick aufs Porträt); Musterlösung K1 | 0:43–0:46 | frei erst nach dem Praxistest in K1, in Einzelszenen gesperrt |
| Mala geht durch Wände/Türen | geprüft | Aufnahme `coop` (Archivtür) | 0:46–0:50 | nur Mala |
| Mala: eigenes Verb „Spüre“ | geprüft | Aufnahme `coop` | 0:50–0:53 | nur Mala |
| Inventar, Gegenstand auf ein Ding ziehen | geprüft | Aufnahme `box` (Stricknadel → Schuhkarton) | 0:59–1:02 | – |
| Notizbuch: zwei Notizen verbinden | geprüft | Aufnahme `notes` | 1:02–1:06 | – |
| Stadtplan, Reisen | geprüft | Aufnahme `map` (Mostar) | 1:06–1:08 | – |
| Hinweise in vier Stufen, von Mala erzählt | geprüft | Aufnahme `hints` (Stufe 1, dann 2); `15_hints.js` (Stufen 1–4), Hinweisprobe | 1:17–1:20 | Trailer zeigt Stufe 1 |
| automatisches Speichern, Speichern/Laden | geprüft | Pausenmenü („Automatisch gespeichert gerade eben ✓“); Regression (Speichern und Laden) | 1:20–1:22 | – |
| Touch-Bedienung (Aktionsleiste nach einem Tipp) | geprüft in Emulation | `html_shots.js` (Chromium, hasTouch); UI-Tests | 1:22–1:25 | kein echtes Gerät |
| läuft im Browser | geprüft | alle Aufnahmen (Chromium/Playwright) | ganzer Trailer | andere Browser nicht in diesem Lauf |
| offline nach dem ersten Laden (Service Worker) | geprüft | `game/tools/offlinetest.js` | 1:22–1:25 (Text) | Chromium |
| fünf Kapitel, vier Städte | geprüft | Kapitelwahl; Musterlösungen K1–K5 | 1:11–1:17 | – |
| Doppelklick auf Ausgang | geprüft | Aufnahme `exitdbl` (Vor-Build b17c6d) | nicht im Trailer | aus Zeitgründen weggelassen |

---

## 5 Schnittplan

Erzeugt aus `edl.py` und den Marken der Aufnahmen (`python3 design/trailer/schnittplan.py <arbeitsordner> raw2`). „Quelle →
Quellzeit“: Aufnahme · Marke (von `record.js` im Moment des Ereignisses gesetzt) + Versatz → Sekunden in der Aufnahme.

| # | Trailer | Dauer | Quelle → Quellzeit | Bild | Handlung (Spieltext wörtlich) | Trailertext | Ton | Zweck |
|---|---|---|---|---|---|---|---|---|
| 1 | 0:00,00 | 3,30 s | night · „Abend in der Wohnung“ +1,10 s → 2,40–5,70 s | full | Abend in Markos Wohnung (Split). Mauszeiger auf das Bett, Verbmenü „Bett: Benutze / Schau an“, Klick auf „Benutze“; Marko geht hin | – | Spielton ×0,9; Musik: ghost (Fläche, 40 bpm) | Spielprinzip in den ersten Sekunden: Point-and-Click mit Verbmenü, Leiste, Inventar |
| 2 | 0:03,30 | 2,27 s | night · „Mala: Marko.“ -0,60 s → 29,55–31,82 s | full | Nacht, Marko am Fenster; in der Scheibe ein Mädchen. Spieltext: „Marko.“ | – | Spielton ×0,7; Musik: ghost (Fläche, 40 bpm) | Mala zum ersten Mal: nur als Spiegelbild und Stimme |
| 3 | 0:05,57 | 2,70 s | night · „Wahl“ +1,20 s → 35,92–38,62 s | full | Antwortliste „Nachts“: „Wer ist da?“ / (Licht machen.) / (Zurück ins Bett. Nicht hinsehen.) – Klick auf „Wer ist da?“ | – | Spielton ×0,7; Musik: ghost (Fläche, 40 bpm) | Spielerentscheidung sichtbar |
| 4 | 0:08,27 | 1,40 s | night · „Niemand.“ -0,10 s → 40,45–41,85 s | full | Spieltext: „Niemand.“ | – | Spielton ×0,7; Musik: ghost (Fläche, 40 bpm) | Haken des Kaltstarts |
| 5 | 0:09,67 | 3,90 s | meet · „Wohnung am Morgen“ -0,10 s → 1,00–4,90 s | scene | Morgen in der Wohnung, Marko am Fenster | Marko schreibt Nachrufe. / Auf Menschen, die allein gestorben sind. | Spielton ×0,7; Musik: title (Malas Spieluhr-Thema, 56 bpm) | Prämisse: Beruf und Thema |
| 6 | 0:13,57 | 2,60 s | meet · „Wer bist du?“ -0,05 s → 20,40–23,00 s | full | Mala steht vor dem Regal. Marko: „Wer bist du? Wie bist du hier hereingekommen?“ | – | Spielton ×0,7; Musik: title (Malas Spieluhr-Thema, 56 bpm) | Mala als Gestalt, Marko fragt |
| 7 | 0:16,17 | 5,20 s | meet · „Durch die Tür.“ -0,08 s → 23,55–28,75 s | scene | Mala: „Durch die Tür.“ – Marko: „Die Tür ist zu.“ – Mala: „Ja.“ (mit Porträts) | Marko lebt. Mala nicht. | Spielton ×0,7; Musik: title (Malas Spieluhr-Thema, 56 bpm) | Ton der beiden: trocken, leise komisch; Mala beim Namen |
| 8 | 0:21,37 | 3,20 s | glass · „Finger hindurch“ -0,60 s → 24,25–27,45 s | full | Marko reicht ihr ein Glas Wasser. Spieltext: „Sie streckt die Hand aus. Die Finger gehen durch das Glas hindurch …“ | – | Spielton ×0,7; Musik: title (Malas Spieluhr-Thema, 56 bpm) | Regel sichtbar machen: Mala kann nichts greifen |
| 9 | 0:24,57 | 1,60 s | glass · „Du siehst mich“ -0,05 s → 45,83–47,43 s | full | Mala: „Du siehst mich.“ | – | Spielton ×0,7; Musik: title (Malas Spieluhr-Thema, 56 bpm) | Beziehung: er ist der Einzige, der sie sieht |
| 10 | 0:26,17 | 2,70 s | ivka · „auf der Mole“ -2,20 s → 9,03–11,73 s | full | Riva bei Sonnenuntergang; Klick auf die Mole, Marko geht hinaus, Mala folgt | – | Spielton ×0,7; Musik: title (Malas Spieluhr-Thema, 56 bpm) | Ortswechsel, Bewegung durch die Welt |
| 11 | 0:28,87 | 2,60 s | ivka · „Ivka erscheint“ -0,10 s → 23,20–25,80 s | full | Bild am Molenende; eine alte Frau (Ivka) blendet ein | – | Spielton ×0,7; Musik: title (Malas Spieluhr-Thema, 56 bpm) | der erste Fall, ohne ihn zu erklären |
| 12 | 0:31,47 | 2,20 s | ivka · „Du siehst sie also auch“ -0,05 s → 33,58–35,78 s | full | Mala: „Du siehst sie also auch.“ | – | Spielton ×0,7; Musik: title (Malas Spieluhr-Thema, 56 bpm) | Echo auf „Du siehst mich.“ – Marko sieht Geister |
| 13 | 0:33,67 | 2,60 s | ivka · „nicht mehr kalt“ +0,00 s → 40,89–43,49 s | full | Mala: „Sie friert nicht, weil ihr nicht mehr kalt sein kann.“ | – | Spielton ×0,7; Musik: title (Malas Spieluhr-Thema, 56 bpm) | Tonfall des Spiels: ernst, zart |
| 14 | 0:36,27 | 2,40 s | coop · „immer kalt“ +0,05 s → 85,80–88,20 s | full | Hafenamt. Mladen: „Da drin ist es immer kalt. Ich gehe nicht gern hinein.“ | – | Spielton ×0,7; Musik: case1 (Walzer, Fall 1, 84 bpm) | Markos Problem: das Archiv bleibt zu |
| 15 | 0:38,67 | 1,80 s | coop · „Mala: Ich kann nachsehen“ +0,02 s → 93,31–95,11 s | full | Mala: „Ich kann nachsehen.“ | – | Spielton ×0,7; Musik: case1 (Walzer, Fall 1, 84 bpm) | Malas Angebot |
| 16 | 0:40,47 | 2,80 s | coop · „Dann sieh nach“ -1,20 s → 95,68–98,48 s | full | Antwortliste, Klick auf „(Leise:) ‚Dann sieh nach.‘“ | – | Spielton ×0,7; Musik: case1 (Walzer, Fall 1, 84 bpm) | Spielerentscheidung: Marko lässt sie gehen |
| 17 | 0:43,27 | 3,00 s | coop · „Wechsel zu Mala“ -2,00 s → 114,68–117,68 s | full | Klick auf das Porträt unten links: Wechsel zu Mala, die Welt wird blau | Du spielst beide. Ein Klick, und du wechselst. | Spielton ×0,7; Musik: case1 (Walzer, Fall 1, 84 bpm) | Kernmechanik: Wechsel der Figur (ein Spieler, zwei Figuren) |
| 18 | 0:46,27 | 3,40 s | coop · „Wechsel zu Mala“ +4,60 s → 121,28–124,68 s | scene | Mala geht als Geist durch die geschlossene Archivtür; drinnen: „Hier drin ist es kalt …“ | Er spricht mit den Lebenden. / Sie geht durch Wände. | Spielton ×0,4; Musik: case1 (Walzer, Fall 1, 84 bpm) | Malas Fähigkeit 1: durch Wände |
| 19 | 0:49,67 | 3,50 s | coop · „spüren“ -2,00 s → 141,06–144,56 s | scene | Mala am Regal: Verbmenü „Ordner bei ‚1948‘: Spüre / Schau an“, Klick auf „Spüre“; Ergebnis: „Die Schrift auf dem Schild ist weg. Die Hand, die sie geschrieben hat, nicht.“ | Er spricht mit den Lebenden. / Sie geht durch Wände. | Spielton ×0,4; Musik: case1 (Walzer, Fall 1, 84 bpm) | Malas Fähigkeit 2: Spüren (eigenes Verb) |
| 20 | 0:53,17 | 2,70 s | coop · „Schauen Sie mal“ -1,50 s → 179,71–182,41 s | full | Zurück bei Marko: Antwortliste, Klick auf „Schauen Sie mal im Regal bei ‚1948‘.“ | – | Spielton ×0,7; Musik: case1 (Walzer, Fall 1, 84 bpm) | Marko nutzt, was Mala gefunden hat |
| 21 | 0:55,87 | 1,60 s | coop · „Tatsächlich“ +0,05 s → 193,30–194,90 s | full | Mladen: „Tatsächlich. Irgendein Praktikant mit einem Zahlendreher …“ | – | Spielton ×0,7; Musik: case1 (Walzer, Fall 1, 84 bpm) | Erfolg der Zusammenarbeit |
| 22 | 0:57,47 | 1,50 s | coop · „Zufall.“ -0,02 s → 238,26–239,76 s | full | Marko: „Zufall.“ | – | Spielton ×0,7; Musik: case1 (Walzer, Fall 1, 84 bpm) | Markos Reaktion: er will es noch nicht glauben |
| 23 | 0:58,97 | 3,30 s | box · „Nadel am Knoten“ -0,80 s → 24,66–27,96 s | full | Ivkas Wohnung: Stricknadel aus dem Inventar auf den verknoteten Schuhkarton ziehen („Benutze Stricknadel mit Schuhkarton“) | – | Spielton ×0,7; Musik: case1 (Walzer, Fall 1, 84 bpm) | Gegenstände benutzen |
| 24 | 1:02,27 | 3,40 s | notes · „erste Notiz“ +0,30 s → 5,26–8,66 s | full | Notizbuch: zwei Notizen antippen, Schluss „Keine Familie heißt nicht: niemand“ | – | Spielton ×0,5; Musik: case1 (Walzer, Fall 1, 84 bpm) | Kombinieren im Notizbuch; Thema des Spiels |
| 25 | 1:05,67 | 2,70 s | map · „Koski-Moschee“ -2,20 s → 6,56–9,26 s | full | Mostar: Stadtplan, Ziel wählen, Reise zur Koski-Moschee | – | Spielton ×0,7; Musik: case1 (Walzer, Fall 1, 84 bpm) | Orte wählen, Reisen |
| 26 | 1:08,37 | 2,80 s | song · „Zeile 1“ +0,03 s → 12,36–15,16 s | full | Alte Brücke: australische Straßenmusiker spielen „Kad ja pođoh na Bembašu“, Liedzeile mit deutscher Übersetzung | – | Spielton ×1,1; Musik: – | Gefühl, Musik der Szene, Lokalkolorit |
| 27 | 1:11,17 | 1,60 s | mostar · „im Regen, Schirm offen“ -0,60 s → 4,17–5,77 s | scene | Mostar, Busbahnhof im Regen: Marko spannt den Schirm auf | Fünf Kapitel, vier Städte: / Split · Sarajevo · Mostar · München | Spielton ×0,7; Musik: end (Thema in Dur, 56 bpm) | Städte: Mostar |
| 28 | 1:12,77 | 1,40 s | sarajevo · „Baščaršija im Regen“ +0,60 s → 2,20–3,60 s | scene | Sarajevo, Baščaršija im Regen (Kapitel 2) | Fünf Kapitel, vier Städte: / Split · Sarajevo · Mostar · München | Spielton ×0,7; Musik: end (Thema in Dur, 56 bpm) | Städte: Sarajevo |
| 29 | 1:14,17 | 1,40 s | muenchen · „Gleis 11“ +1,40 s → 3,00–4,40 s | scene | München Hbf, Gleis 11 (Kapitel 4) | Fünf Kapitel, vier Städte: / Split · Sarajevo · Mostar · München | Spielton ×0,7; Musik: end (Thema in Dur, 56 bpm) | Städte: München |
| 30 | 1:15,57 | 1,60 s | sarajevo5 · „Vratnik im März“ +0,60 s → 2,20–3,80 s | scene | Sarajevo, Vratnik im März (Kapitel 5) | Fünf Kapitel, vier Städte: / Split · Sarajevo · Mostar · München | Spielton ×0,7; Musik: end (Thema in Dur, 56 bpm) | Städte: Sarajevo, Kapitel 5 |
| 31 | 1:17,17 | 2,80 s | hints · „Thema Ankommen“ -1,60 s → 5,14–7,94 s | small | Menü → Hinweise → Thema „Ankommen“; Mala gibt den ersten Hinweis in der Szene | Hinweise in vier Stufen / Automatisches Speichern | Spielton ×0,7; Musik: end (Thema in Dur, 56 bpm) | Hilfe ohne Lösungsbuch |
| 32 | 1:19,97 | 1,50 s | Standbild html/pause.png | html_small | Pausenmenü: „Automatisch gespeichert gerade eben ✓“, Speichern, Laden, Hinweise | Hinweise in vier Stufen / Automatisches Speichern | Musik: end (Thema in Dur, 56 bpm) | Speichern |
| 33 | 1:21,47 | 3,40 s | Standbild html/touch.png | html_small | Finger-Bedienung: ein Tipp auf die Abfahrtstafel öffnet die Aktionsleiste (Benutze / Lies / Schau an / ✕) | Im Browser · Maus oder Touch / Offline nach dem ersten Laden | Musik: end (Thema in Dur, 56 bpm) | Bedienung mit Touch (in Chromium nachgestellt) |
| 34 | 1:24,87 | 5,13 s | titles/endbg + Ebenen | end | Endkarte: Landschaft des Titelbilds mit bewegtem Wasser; MALA, „Die Stillen“, Gattung, Aufruf | MALA · Die Stillen · Ein Point-and-Click-Mystery-Adventure · Entdecke MALA. | Musik: end (Thema in Dur, 56 bpm) | Titel und neutraler Aufruf |

Summe: 2700 Bilder = 90,000 s
Spielaufnahmen (bewegt): 80,0 s · Standbilder des Spiels (Menü, Touch): 4,9 s · Endkarte: 5,1 s
davon mit sichtbarer Spielereingabe und Rückmeldung: 32,9 s · Einstellungen mit Trailertext: 32,7 s · Vollbild-Texttafeln: 0 s

---

## 6 Texte

Alle Trailertexte sind neu geschrieben oder stammen aus dem Spiel selbst („Über ‚Die Stillen‘“); sie stehen in der Schrift des
Spiels (Pixelschrift, ganzzahlig ×5), hell mit dunklem Rand, nie in einem nachgebauten Dialogfenster.

| Text | Zeit | Herkunft |
|---|---|---|
| Marko schreibt Nachrufe. / Auf Menschen, die allein gestorben sind. | 0:09,9–0:13,5 | nach „Über ‚Die Stillen‘“ |
| Marko lebt. Mala nicht. | 0:17,5–0:20,7 | „Über ‚Die Stillen‘“ |
| Du spielst beide. Ein Klick, und du wechselst. | 0:43,6–0:46,3 | neu |
| Er spricht mit den Lebenden. / Sie geht durch Wände. | 0:46,5–0:53,0 | „Über ‚Die Stillen‘“ |
| Fünf Kapitel, vier Städte: / Split · Sarajevo · Mostar · München | 1:11,4–1:17,0 | neu |
| Hinweise in vier Stufen / Automatisches Speichern | 1:17,4–1:21,4 | neu |
| Im Browser · Maus oder Touch / Offline nach dem ersten Laden | 1:21,6–1:24,9 | neu |
| Endkarte: MALA · Die Stillen · Ein Point-and-Click-Mystery-Adventure · Entdecke MALA. | 1:24,9–1:30,0 | neu; „Die Stillen“ ist der Titel, den das Spiel auf seinem Titelbild trägt |

Alle übrigen Wörter im Bild sind Spieltext, so wie das Spiel ihn zeigt (Sprechblasen, Erzähltext, Menüs).

---

## 7 Ton und Musik

* **Musik**: vier Stücke des Spiels, erzeugt von der Klang-Engine des Spiels (`game/src/04_audio.js`) und mit `music.js` aus
  dem Audioausgang der Engine aufgenommen: `ghost` (Fläche, 40 bpm) in der Nacht, `title` (Malas Spieluhr-Thema, 56 bpm) für
  die beiden und Ivka, `case1` (Walzer von Fall 1, 84 bpm, 3/4) für das Zusammenspiel und das Ermitteln, `end` (dasselbe
  Thema mit Dur-Wendung, 56 bpm) für Städte, Komfort und Endkarte. Das Lied an der Brücke („Kad ja pođoh na Bembašu“, traditionell)
  ist der Ton der Szene selbst, ebenfalls von der Engine gespielt.
* **Spielton**: Raumklang, Schritte, Klicks und Regen aus den Aufnahmen, meist 8–17 dB unter der Musik; Malas Klänge beim Gang
  durch die Tür und beim Spüren etwa 2 dB darunter (gemessen je Einstellung, EBU R128).
* **Keine Stimmen**: Das Spiel ist nicht vertont; der Trailer erfindet keine Sprecher. Was Marko und Mala sagen, steht als
  Spieltext im Bild.
* **Lautheit**: Spielton und Musik werden gemischt, die Mischung nach EBU R128 gemessen und im Pegel so gesetzt, dass −15 LUFS
  herauskommen; ein Begrenzer bei vierfacher Abtastrate (Näherung für True Peak) hält die Spitzen bei −1,6 dBFS. Danach wird
  nachgemessen und der Pegel nötigenfalls nachgeführt. Messwerte der fertigen Datei im Abschnitt 9.

---

## 8 Herstellung (wiederholbar)

Voraussetzungen: Node mit Playwright/Chromium, ffmpeg, Python 3 mit Pillow. Arbeitsordner z. B. `$W`.

```bash
node game/build.js                                                   # web/index.html bauen
for k in "" 2 3 4 5; do mkdir -p $W/dumps/k${k:-1}; MALA_DUMPALL=$W/dumps/k${k:-1} node game/tools/walkthrough$k.js; done
                                                                     # Spielstände der Musterlösungen (Ausgangspunkte der Szenen)
for s in night meet glass ivka coop box notes map mostar sarajevo muenchen sarajevo5 song hints; do
  TRAILER_DUMPS=$W/dumps node design/trailer/record.js $s $W/raw2; done   # Szenen mit echter Eingabe aufnehmen (+ Marken)
node design/trailer/html_shots.js $W/html2                           # Pausenmenü und Fingertipp (HTML-Schicht)
node design/trailer/music.js $W/music title:70 ghost:40 case1:60 end:50   # Spielmusik aufnehmen
node design/trailer/titles.js $W/titles                              # Texte und Endkarte in der Spielschrift
TRAILER_RAW=raw2 TRAILER_HTML=html2 python3 design/trailer/render.py $W $W/MALA_Trailer_90s_DE.mp4
python3 design/trailer/schnittplan.py $W raw2                        # Schnittplan-Tabelle und Anteile
python3 design/trailer/review.py $W/MALA_Trailer_90s_DE.mp4 $W/review   # Kontaktbogen, Telefongröße, Einzelbilder
```

Die Szenen (`scenes.js`) laden einen Spielstand und spielen dann nur mit Maus und Tastatur (Zeiger fährt sichtbar, Klicks,
Ziehen, Mausrad). Die Spielstände der Kapitel 1–5 kommen aus den Musterlösungen; die Nummer des Stands steht in `scenes.js`.
`render.py` schneidet jede Einstellung verlustfrei auf genau n Bilder, setzt sie aneinander, mischt den Ton und gibt H.264/AAC aus.

---

## 9 Prüfbericht

**Ablage.** `dist/MALA_Trailer_90s_DE.mp4` (20,3 MB, SHA-256 in `dist/SHA256SUMS_trailer.txt`). Spiel-Build aller Aufnahmen:
„11.11.2026 · 962623“ (Stempel im Titelbild und in `web/index.html`); alle Szenen in einem Durchgang auf diesem Build aufgenommen.

### Technik (gemessen an der fertigen Datei)

| Vorgabe | Messung | Werkzeug | erfüllt |
|---|---|---|---|
| genau 90 s, 2700 Bilder | 2700 Bilder gezählt; Video 90,000 s, Ton 90,000 s, Container 90,000 s | `ffprobe -count_frames`, `-show_entries …duration` | ja |
| 1920 × 1080, 16:9, keine Verzerrung | 1920 × 1080, quadratische Pixel; Spielbild ganzzahlig ×5 (bzw. ×4 im Abschnitt Komfort), nächster Nachbar | `ffprobe`; 1:1-Ausschnitt geprüft | ja |
| konstante 30 fps | r_frame_rate = avg_frame_rate = 30/1; alle 2700 Pakete gleich lang (1/30 s) | `ffprobe -show_entries packet=duration` | ja |
| H.264, yuv420p, SDR | H.264 High@5.0, yuv420p, BT.709 (Primärfarben, Übertragung, Matrix), Bereich „tv“, progressiv | `ffprobe` | ja |
| AAC Stereo 48 kHz | AAC-LC, 48 kHz, 2 Kanäle, 192 kb/s, Sprachkennung „deu“ | `ffprobe` | ja |
| ca. −16 … −14 LUFS | −15,2 LUFS integriert (Lautheitsbereich 4,5 LU) | `ffmpeg ebur128=peak=true` an der dekodierten MP4-Tonspur | ja |
| ≤ −1 dBTP | True Peak −1,5 dBTP | ebenda | ja |
| Dateiname | `MALA_Trailer_90s_DE.mp4` | – | ja |

### Inhalt (Vorgaben des Auftrags)

| Vorgabe | Ergebnis |
|---|---|
| ≥ 65 s echtes Spielmaterial | 80,0 s bewegte Aufnahmen aus dem Spiel, dazu 4,9 s Standbilder seiner Menüs (Pause, Touch-Leiste); Endkarte 5,1 s aus der Titelbild-Landschaft des Spiels |
| ≥ ca. 30 s sichtbare Spielerhandlungen mit Rückmeldung | 32,9 s (Einstellungen mit `aktion=True` in `edl.py`: Verbmenü, Antwortlisten, Klick auf die Mole, Figurenwechsel, Spüren, Ziehen, Notizen, Stadtplan, Hinweismenü) |
| Spielprinzip in den ersten 10 s erkennbar | 0:00–0:03 Zeiger, Verbmenü „Bett: Benutze / Schau an“, Leiste mit Porträt und Inventar; 0:06–0:08 Antwortliste mit Klick |
| Marko und Mala in den ersten ca. 20 s eingeführt | Marko ab 0:00 (Porträt „Marko“ in der Leiste), mit Namen im Text ab 0:10; Mala ab 0:04 als Spiegelbild, ab 0:14 als Gestalt, ab 0:16 mit Porträt, mit Namen im Text ab 0:17 |
| Zusammenspiel als Einzelspieler-Mechanik | 0:36–0:59: Problem (Archiv kalt, Mladen geht nicht hinein) → Malas Angebot → Klick „Dann sieh nach“ → Klick aufs Porträt, Welt wird blau (Text: „Du spielst beide. Ein Klick, und du wechselst.“) → Mala durch die Tür → „Spüre“ → zurück bei Marko, er schickt Mladen ans Regal → „Tatsächlich“ → Marko: „Zufall.“ |
| keine Spoiler | ausgeschlossen: Hafenbuch, Postkarte, Spüren-Ergebnis mit der Seite, Auflösung von Fall 1, Zwischenwelt, Text zu Kapitel 5, Malas Herkunft (Tabelle in Abschnitt 3). Bewusst in Kauf genommen: Im Notizbuch (1:02) sind Notiztitel lesbar, darunter „Tonći – Das Boot um sieben“ – ein Hinweis aus dem ersten Fall, keine Auflösung. |
| Texte kurz, eigene Worte, nicht in nachgebauten Dialogfenstern | 7 Texte, 1–2 Zeilen; im Band unter der Szene oder als Streifen; keine Vollbild-Tafel außer der Endkarte (Abschnitt 6) |
| Musik und Klänge des Spiels, Herkunft belegt | Abschnitt 7; keine fremde Musik, keine erfundenen Stimmen |
| wahre technische Aussagen | jede Aussage im Text mit Beleg in der Funktionsmatrix (Abschnitt 4); was nicht geprüft ist, wird nicht behauptet |
| Endkarte | „MALA“, „Die Stillen“, „Ein Point-and-Click-Mystery-Adventure“, „Entdecke MALA.“ – ohne Shop, Adresse, Datum |

### Sichtprüfung

* Kontaktbogen (ein Bild je Sekunde) und ein Bild aus der Mitte jeder Einstellung (`review.py`): keine Fremdeinblendungen, keine
  Ladebildschirme, keine Fehlermeldungen; in keiner Aufnahme ein JS-Fehler (Protokoll von `record.js`).
* Lesbarkeit klein: alle Einstellungen mit Trailertext auf 480 × 270 verkleinert (Telefon quer, halbe Breite): die Trailertexte
  sind lesbar; die Spieltexte in Sprechblasen ebenfalls, die Menüzeilen von Pause und Touch-Leiste nur knapp.
* Ohne Ton verständlich: Die Geschichte liegt vollständig im Bild (Spieltexte und Trailertexte); das Spiel hat keine Sprachausgabe.
  Das habe ich anhand des Kontaktbogens beurteilt – **keine Prüfung mit Zuschauern**.
* Lesedauer: jeder Trailertext steht 2,65–6,5 s (7–18 Zeichen pro Sekunde); Spieltexte, auf die es ankommt, bleiben bis zum
  Ende ihrer Zeile im Bild („Ja.“ 1,3 s, „Zufall.“ 1,5 s, „Du siehst mich.“ 1,6 s).

### Ton

* Messung statt Anhören: Den Ton hat **kein Mensch abgehört**. Geprüft sind Lautheit, Spitzen, Pegelverlauf je Sekunde und
  Pausen in der Musik (Fenster 50 ms). Gefunden und behoben: Musikaufnahmen nach einer Sekunde stumm (Fehler im Spiel, Abschnitt 10);
  Malas Tür- und Spür-Klänge 3–4 LU lauter als die Musik (gesenkt); unterschiedlich laute Stücke (angeglichen).
* Absichtliche Stellen ohne Musik: 0:05,8 (Atempause der Nachtfläche, so im Spiel) und 1:08–1:11 (das Lied der Szene ersetzt die Musik).

### Spieltests auf dem Trailer-Build

| Prüfung | Ergebnis |
|---|---|
| Regression `node qa/regress/run.js` | 33 von 33 OK (BUG-001 bis BUG-033; BUG-033 ist neu und prüft die Kamera auf der Mole); dazu `qa/ui/musik_nach_titel.js`: OK |
| Offline `node game/tools/offlinetest.js` | OK (neue Service-Worker-Version aktiv, Neustart ohne Netz, Karten- und Hinweisdaten offline, Spielstand lädt offline, Kapitel 3 und 5 starten offline) |
| Musterlösungen Kapitel 1–5 `game/tools/walkthrough*.js` | Kapitel 1, 2, 3 (131 Schritte), 4 (85 Schritte), 5 (55 Schritte): alle OK, keine JS-Fehler |

### Grenzen

* Keine Zuschauertests, keine Messung von Wirkung oder Verständnis bei anderen Menschen.
* Kein echtes iOS- oder Android-Gerät; Touch nur als Emulation in Chromium. Kein anderer Browser als Chromium in diesem Lauf.
* Der Ton ist gemessen, nicht angehört (siehe oben).
* Die Referenz wurde gemessen und Bild für Bild ausgewertet; ihr Ton wurde nicht angehört.

---

## 10 Änderungen am Spiel während der Trailerarbeit

Beim Aufnehmen fielen zwei Fehler auf, die alle Spieler betreffen; beide sind behoben (Einträge in `web/AENDERUNGEN.txt`):

1. **Riva, erste Begegnung mit Ivka**: Die Szene beginnt, sobald Marko die Mole betritt. Ivka stand dann rechts außerhalb des
   Bildes (die Kamera folgt Marko), während Marko sie beschreibt und man über sie entscheiden soll. Jetzt schwenkt das Bild
   vorher ans Molenende (0,9 s); danach ist die Kamera wieder frei (`game/src/rooms/riva.js`). Neuer Regressionstest
   `qa/regress/bug_033_k1_mole_kamera.js` (heutiger Ablauf und alter Ablauf mit Malas Stimme): auf dem alten Build FEHL
   (Ivka bei Bildschirm-x 356, außerhalb), auf dem neuen OK (x 276).
2. **Musik nach dem Titelbild**: Wurde die Titelmusik ausgeblendet und innerhalb von 1,7 s ein anderes Stück gestartet, zog die
   noch laufende Ausblendung das neue Stück auf null; es blieb stumm bis zur nächsten Lautstärkeänderung. Jetzt verwirft der
   Wechsel die alte Ausblendung (`game/src/04_audio.js`). Neuer Test mit echtem Ton `qa/ui/musik_nach_titel.js` (hört den
   Audioausgang der Engine ab): alter Build rund −119 dBFS nach dem schnellen Wechsel (stumm), neuer Build rund −45 dBFS
   (Protokoll `qa/protokolle/trailer_2026-11-11/musik_nach_titel.txt`).
