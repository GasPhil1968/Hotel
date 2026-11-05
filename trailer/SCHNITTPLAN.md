# MALA – Trailer 90 s: Schnittplan

Fassung `MALA_Trailer_90s_DE.mp4`: 90,000 s, genau 2700 Bilder bei 30 Bildern/s, 1920 × 1080. Zeitcodes stehen im Format `mm:ss:Bild`. Der Schnittplan selbst ist die Datei `werkzeug/edl.py`. Dieses Dokument erzeugt `werkzeug/doku.py` aus dieser Datei und aus den Bildschirmprotokollen der Engine (`takes/<id>/events.jsonl`). Die Spalte „Spieltext im Bild“ gibt deshalb wörtlich wieder, was das Spiel im jeweiligen Abschnitt anzeigt.

## Dramaturgie

| Abschnitt | Vorgabe | Im Schnitt | Dauer | Inhalt |
|---|---|---|---|---|
| Aufhänger | 00:00–00:06 | 00:00:00–00:06:00 | 6,00 s | Dieselbe Riva, zwei Blicke: Ein Klick auf Mala macht die Welt kalt, und Ivkas Leine aus Licht wird sichtbar. Spielszene ab dem ersten Bild. |
| Marko und Mala | 00:06–00:18 | 00:06:00–00:18:13 | 12,43 s | Marko: trocken, übermüdet, Übersetzer mit Kopfschmerz. Mala: ruhig und hartnäckig. Beziehungsmoment: „Du bist eine Einbildung.“ – „Vielleicht.“ – „Dann eine, die dir nichts tut.“ |
| Welt und Geheimnis | 00:18–00:28 | 00:18:13–00:27:17 | 9,13 s | Split, dann Sarajevo, November 2011, sechs Orte. Tomaž wartet an der Kula („Tomaž. Ich warte auf jemanden.“), dazu die Einblendung „Manche Tote warten noch.“ |
| Zusammenarbeit | 00:28–00:44 | 00:27:17–00:44:03 | 16,53 s | Pflichtsequenz: Marko wird blockiert, Wechsel zu Mala, Mala geht durch die Archivtür und spürt die Schrift, Marko setzt fort. Schnitt vor dem Ergebnis. |
| Rätsel und Ermittlung | 00:44–00:59 | 00:44:03–00:58:20 | 14,57 s | Inventar ziehen, Notizbuch (grau, dann grün), Fikret und das Übersetzungsrätsel |
| Menschen und Atmosphäre | 00:59–01:10 | 00:58:20–01:09:26 | 11,20 s | Zdenka über Ivka, dann Mala und Marko in der Pension: „Ich lache selten.“ – „Ich weiß. Ich zähle mit.“ |
| Technischer Nutzen | 01:10–01:20 | 01:09:26–01:19:26 | 10,00 s | Titelbild mit Kapitelwahl und Sprachschalter, Speichern im Menü, „Zeigen“. Texte nur zu Geprüftem. |
| Spannung | 01:20–01:24 | 01:19:26–01:23:27 | 4,03 s | „Worauf wartest du dann?“ – „Ich weiß nicht, auf wen.“ Bild auf die Szene beschnitten. |
| Titel und Abschluss | 01:24–01:30 | 01:23:27–01:30:00 | 6,10 s | Titelbild des Spiels ohne Menü, „MALA“ bis zum letzten Bild sichtbar, Genrezeile, „Entdecke MALA.“ |

Die Abschnittsgrenzen weichen um höchstens 0,43 s von der Vorgabe ab. Der Grund: Die Schnitte liegen auf Satzanfängen und Satzenden der Spieltexte, damit kein Text angeschnitten ist oder kurz aufblitzt. In Summe sind es genau 90,000 s. Die Endkarte mit „MALA“ steht 6,10 s.

## Schnittliste

| Nr. | Zeitcode (mm:ss:Bild) | Dauer | Abschnitt | Aufnahme (Sek. in der Aufnahme) | Bild und Handlung | Spieltext im Bild (wörtlich) | Trailer-Einblendung | Musik |
|---|---|---|---|---|---|---|---|---|
| 1 | 00:00:00–00:06:00 | 6.00 s | Aufhänger | `riva_hook` 0.40–6.40 | Riva, Split, Abend: Marko, Mala, Ivka. Wechsel zu Mala: kalte Sicht, Leine aus Licht, Verbmenü an Ivka | Menü: Sprich mit/Spüre/Schau an | — | Titelthema |
| 2 | 00:06:00–00:09:25 | 3.83 s | Marko und Mala | `marko_open` 10.06–13.89 | Markos Wohnung: „Seite einunddreißig von achtundvierzig …“ | „Seite einunddreißig von achtundvierzig. Eine Espressomaschine aus Mailand, die man in Graz verkaufen will. Auf Deutsch.“ | MARKO VUKOVIĆ   ·   Übersetzer in Split | Titelthema |
| 3 | 00:09:25–00:11:19 | 1.80 s | Marko und Mala | `marko_open` 18.55–20.35 | Kopfschmerz-Bild, „…Kopfschmerzen. Natürlich.“ | „…Kopfschmerzen. Natürlich.“ | MARKO VUKOVIĆ   ·   Übersetzer in Split | Titelthema |
| 4 | 00:11:19–00:18:13 | 6.80 s | Marko und Mala | `mala_deny` 3.70–10.50 | Riva: Auswahl → „Du bist eine Einbildung.“ – „Vielleicht.“ – „Dann eine, die dir nichts tut.“ | Auswahl: Was willst du von mir? / Du bist eine Einbildung. / Geh weg.<br>„Du bist eine Einbildung.“<br>„Vielleicht.“<br>„Dann eine, die dir nichts tut.“ | MALA   ·   ein Geist an Markos Seite | Titelthema |
| 5 | 00:18:13–00:19:25 | 1.40 s | Welt und Geheimnis | `zdenka` 0.20–1.60 | Veli Varoš, Split | — | Split und Sarajevo   ·   November 2011 | Titelthema |
| 6 | 00:19:25–00:21:07 | 1.40 s | Welt und Geheimnis | `palma` 0.40–1.80 | Hotel Palma, Split | — | Split und Sarajevo   ·   November 2011 | Titelthema |
| 7 | 00:21:07–00:22:19 | 1.40 s | Welt und Geheimnis | `stanica` 0.40–1.80 | Busbahnhof, Sarajevo | — | Split und Sarajevo   ·   November 2011 | Titelthema |
| 8 | 00:22:19–00:23:28 | 1.30 s | Welt und Geheimnis | `tram` 17.70–19.00 | In der Straßenbahn Linie 1 | — | — | Titelthema |
| 9 | 00:23:28–00:25:07 | 1.30 s | Welt und Geheimnis | `kazan` 1.00–2.30 | Kazandžiluk, Sarajevo | — | — | Titelthema |
| 10 | 00:25:07–00:27:17 | 2.33 s | Welt und Geheimnis | `kula_tomaz` 12.76–15.09 | An der Kula: „Tomaž. Ich warte auf jemanden.“ | „Tomaž. Ich warte auf jemanden.“ | Manche Tote warten noch. | Titelthema |
| 11 | 00:27:17–00:31:00 | 3.43 s | Zusammenarbeit | `coop` 43.85–47.28 | Hafenbüro: „Der Band 1984 ist nicht da …“ (Marko kommt nicht weiter) | „Der Band 1984 ist nicht da. Irgendwer hat das Regal durcheinandergebracht. Ich suche doch nicht fünfzig Jahre durch.“ | Manche Tote warten noch. | Titelthema |
| 12 | 00:31:00–00:34:04 | 3.13 s | Zusammenarbeit | `coop` 58.10–61.23 | Mala: „Ich kann nachsehen.“ → Auswahl „(Leise:) Dann sieh nach.“ | „Ich kann nachsehen.“<br>Auswahl: (Leise:) „Dann sieh nach.“ / (Leise:) „Nicht hier. Er hört uns.“ / (Nichts sagen.) | Wechsle zwischen Marko und Mala | Fall 1 |
| 13 | 00:34:04–00:35:10 | 1.20 s | Zusammenarbeit | `coop` 80.15–81.35 | Wechsel zu Mala (Knopf unten links) | — | Wechsle zwischen Marko und Mala / Mala geht, wohin Marko nicht kommt. | Fall 1 |
| 14 | 00:35:10–00:36:26 | 1.53 s | Zusammenarbeit | `coop` 87.20–88.73 | Mala geht durch die verschlossene Archivtür | — | Mala geht, wohin Marko nicht kommt. | Fall 1 |
| 15 | 00:36:26–00:41:17 | 4.70 s | Zusammenarbeit | `coop` 95.30–100.00 | Im Archiv, Spüren: „Die Schrift auf dem Schild ist weg …“ | „Die Schrift auf dem Schild ist weg. Die Hand, die sie geschrieben hat, nicht.“ | Mala geht, wohin Marko nicht kommt. | Fall 1 |
| 16 | 00:41:17–00:44:03 | 2.53 s | Zusammenarbeit | `coop` 135.40–137.93 | Wieder Marko: „Schauen Sie mal bei achtundvierzig.“ – Schnitt vor dem Ergebnis | „Schauen Sie mal bei achtundvierzig.“ | — | Fall 1 |
| 17 | 00:44:03–00:46:27 | 2.80 s | Rätsel und Ermittlung | `shoebox` 22.30–25.10 | Ivkas Wohnung: Stricknadel auf den Schuhkarton ziehen („Benutze Stricknadel mit Schuhkarton“) | — | Kombinieren | Fall 1 |
| 18 | 00:46:27–00:48:21 | 1.80 s | Rätsel und Ermittlung | `notebook` 6.50–8.30 | Notizbuch: zwei Notizen, die nicht reichen (grau) | — | Kombinieren / Schlussfolgern | Fall 1 |
| 19 | 00:48:21–00:51:24 | 3.10 s | Rätsel und Ermittlung | `notebook` 12.50–15.60 | Notizbuch: Schlussfolgerung (grün) | — | Schlussfolgern | Fall 1 |
| 20 | 00:51:24–00:55:05 | 3.37 s | Rätsel und Ermittlung | `fikret` 5.00–8.37 | Busbahnhof: Fikret: „Sie! Ja, Sie, mit dem Gesicht wie ein Wörterbuch!“ | „Sie! Ja, Sie, mit dem Gesicht wie ein Wörterbuch!“ | Schlussfolgern | Fall 1 |
| 21 | 00:55:05–00:58:20 | 3.50 s | Rätsel und Ermittlung | `fikret` 57.10–60.60 | Übersetzungsrätsel: Vorlesen → Fikrets Einwand | — | Übersetzen | Fall 1 |
| 22 | 00:58:20–00:59:20 | 1.00 s | Menschen und Atmosphäre | `zdenka` 5.20–6.20 | Veli Varoš: Auswahl „Wie war sie?“ | Auswahl: Wie war sie? / Hatte sie wirklich niemanden mehr? / Was hat sie den Tag über gemacht? / Kann ich mir die Wohnung ansehen? Sie haben den Schlüssel. / Nach etwas aus dem Notizbuch fragen … / Danke, Gospođa Zdenka. | Übersetzen | Fall 1 + Malas Thema |
| 23 | 00:59:20–01:02:17 | 2.90 s | Menschen und Atmosphäre | `zdenka` 7.70–10.60 | Zdenka: „Stur. Zu Kindern freundlich, zum Wetter nicht. …“ | „Stur. Zu Kindern freundlich, zum Wetter nicht. Sie hat für die halbe Gasse gestrickt, Socken, Mützen, alles. Nur für sich nie.“ | — | Malas Thema |
| 24 | 01:02:17–01:09:26 | 7.30 s | Menschen und Atmosphäre | `pansion_mala` 29.58–36.88 | Pension: „Nur wenn du lachst …“ – „Ich lache selten.“ – „Ich weiß. Ich zähle mit.“ | „Nur wenn du lachst, ist es laut. Dann bin ich ganz da.“<br>„Ich lache selten.“<br>„Ich weiß. Ich zähle mit.“ | — | Malas Thema |
| 25 | 01:09:26–01:12:14 | 2.60 s | Technischer Nutzen | `title` 2.60–5.20 | Titelbild: Kapitelwahl | — | Im Browser spielbar   ·   mit Maus oder Touch | Malas Thema |
| 26 | 01:12:14–01:14:14 | 2.00 s | Technischer Nutzen | `title` 10.30–12.30 | Titelbild: Sprache bosanski / hrvatski | — | Im Browser spielbar   ·   mit Maus oder Touch / Deutsch   ·   Kapitel 1 auch auf Bosnisch/Kroatisch | Malas Thema |
| 27 | 01:14:14–01:17:08 | 2.80 s | Technischer Nutzen | `menu1` 4.60–7.40 | Menü: Speichern (Platz 1) → „Gespeichert.“ (Ton der Aufnahme stumm) | Hinweis: Gespeichert. | Deutsch   ·   Kapitel 1 auch auf Bosnisch/Kroatisch / Drei Speicherplätze   ·   speichert auch automatisch | Malas Thema |
| 28 | 01:17:08–01:19:26 | 2.60 s | Technischer Nutzen | `reveal` 2.20–4.80 | „Zeigen“: alle anklickbaren Stellen der Baščaršija | — | Drei Speicherplätze   ·   speichert auch automatisch / Nach vollständigem Erstladen auch offline | Malas Thema |
| 29 | 01:19:26–01:21:27 | 2.03 s | Spannung | `carsija_bench` 14.36–16.39 | Baščaršija: „Worauf wartest du dann?“ (beschnitten auf die Szene (×5)) | „Worauf wartest du dann?“ | — | Geisterfläche |
| 30 | 01:21:27–01:23:27 | 2.00 s | Spannung | `carsija_bench` 17.20–19.20 | Mala: „Ich weiß nicht, auf wen.“ (beschnitten auf die Szene (×5)) | „Ich weiß nicht, auf wen.“ | — | Geisterfläche |
| 31 | 01:23:27–01:30:00 | 6.10 s | Titel und Abschluss | `title_still` 0.50–6.60 | Endkarte: Titelbild des Spiels (ohne Menü), Genre, Aufruf (beschnitten auf die Szene (×5)) | — | Ein Point-and-Click-Mystery-Adventure / Entdecke MALA. | Titelthema |

Gesamt: 90.000 s = 2700 Bilder bei 30 Bildern/s.

## Trailer-Einblendungen

Alle Einblendungen stehen im Textstreifen unter dem Spielbild (y 1010–1080) oder auf der Endkarte. In die Textkästen des Spiels wird nichts geschrieben.

| Von | Bis | Text |
|---|---|---|
| 00:06:08 | 00:11:16 | MARKO VUKOVIĆ   ·   Übersetzer in Split |
| 00:12:02 | 00:18:08 | MALA   ·   ein Geist an Markos Seite |
| 00:18:17 | 00:22:19 | Split und Sarajevo   ·   November 2011 |
| 00:25:16 | 00:27:17 | Manche Tote warten noch. |
| 00:32:26 | 00:35:10 | Wechsle zwischen Marko und Mala |
| 00:35:10 | 00:41:11 | Mala geht, wohin Marko nicht kommt. |
| 00:44:08 | 00:46:27 | Kombinieren |
| 00:47:00 | 00:51:24 | Schlussfolgern |
| 00:55:08 | 00:58:20 | Übersetzen |
| 01:10:01 | 01:12:14 | Im Browser spielbar   ·   mit Maus oder Touch |
| 01:12:14 | 01:14:14 | Deutsch   ·   Kapitel 1 auch auf Bosnisch/Kroatisch |
| 01:14:14 | 01:17:08 | Drei Speicherplätze   ·   speichert auch automatisch |
| 01:17:08 | 01:19:23 | Nach vollständigem Erstladen auch offline |
| 01:24:10 | 01:30:00 | Ein Point-and-Click-Mystery-Adventure |
| 01:26:02 | 01:30:00 | Entdecke MALA. |

## Musik

Alle Stücke stammen aus der Engine selbst. Sie wurden live synthetisiert und vom Master-Ausgang aufgenommen, jedes Stück einzeln mit abgeschalteten Geräuschen (`music_*`). Die Einsätze liegen auf Takt- oder Schleifengrenzen.

| Stück | Trailer von–bis | Aufnahme ab | Zweck |
|---|---|---|---|
| Titelthema (`title`) | 00:02:05–00:30:09 | 5.000 s | Schlag 4 (Takt 2) fällt auf den Wechsel zu Mala, die Kadenz auf den Beginn der Zusammenarbeit |
| Fall 1 (`case1`) | 00:29:22–00:59:15 | 17.593 s | Schleife mit Melodie unter der Zusammenarbeit, danach Begleitung unter den Rätseln |
| Malas Thema (`k2_mala`) | 00:58:18–01:20:18 | 7.412 s | Malas Thema; die Melodie-Schleife liegt unter dem Gespräch in der Pension |
| Geisterfläche (`ghost`) | 01:19:21–01:24:09 | 24.510 s | Nur Fläche unter der Spannung |
| Titelthema (`title`) | 01:23:27–01:30:00 | 28.557 s | Schlussphrase von Malas Spieluhr-Motiv, d-Moll-Kadenz auf der Endkarte |

## Ton

- **Geräusche:** Jeder Abschnitt bringt den Ton seiner Aufnahme mit: Raumklang, Klicks, den dumpfen Klang in Malas Sicht. Der Pegel wird je Abschnitt angeglichen: Der Median der 50-ms-Fenster wird auf -36 dBFS gebracht, mit höchstens +14 dB und Spitzen bis -12 dBFS. An jedem Tonschnitt liegt eine Blende von 30 ms. Die Aufnahme `menu1` lief mit Spielmusik und ist deshalb stumm geschaltet; dort trägt die Musikspur. Die Verstärkungen stehen in `pruefung/verstaerkungen.txt`.
- **Musik:** Der Kompressor auf der Musikspur arbeitet mit Schwelle −16 dBFS, Verhältnis 3:1, Attack 4 ms und Release 180 ms. Er dämpft die Spitzen auf den Takt-Einsen.
- **Lautheit:** Gemessen nach EBU R128 (ffmpeg `loudnorm`, zwei Durchgänge, linear) und auf −15 LUFS gebracht. Danach folgt ein Begrenzer bei −2 dBFS. In den letzten 1,8 s blendet der Ton aus. Messwerte am fertigen MP4 stehen in `pruefung/qc.json`.
- **Sprache:** keine. Das Spiel ist nicht vertont, und der Trailer hat keinen Sprecher.

## Bild

- Das Spielbild (320 × 200) wird ganzzahlig ×5 mit Nearest Neighbour vergrößert: 1600 × 1000 bei x 160, y 10, auf dem dunklen Grund der Spielseite (#08070d). Nichts wird gestreckt, weichgezeichnet, animiert oder nachträglich bewegt.
- In den letzten 10 s (Abschnitte 29–31) ist das Bild auf die Szene beschnitten (320 × 144, ×5 = 1600 × 720, mittig). Die Spielleiste fällt weg; Bankszene und Endkarte haben dieselbe Bildfläche.
- Alle Übergänge sind harte Schnitte. Jede Abschnittslänge ist eine ganze Zahl von Bildern, Bild- und Tonschnitt liegen also auf derselben Bildgrenze. Nur das erste Bild blendet aus Schwarz auf (0,5 s), und Einblendungen blenden in 0,25 s.
