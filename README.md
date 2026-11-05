# MALA – Kapitel 1: Split · Kapitel 2: Sarajevo · Kapitel 3: Mostar

Ein ernstes Point-and-Click-Adventure nach dem Vorbild der Blackwell-Reihe, im technischen und ästhetischen Stil des beigelegten „Twenty to Four“ (VGA-Pixelgrafik, alles im Code gemalt und vertont), aber komplett eigenständig.

Marko Vuković, Übersetzer in Split, kann mit Menschen reden, die nicht weiterkommen. Mala, ein Geist in Kleidung der frühen Neunziger, kann sie finden. Drei Fälle im November 2011: eine Mutter, die seit 1984 auf das Boot um sieben wartet; ein Junge, der seit 1999 auf die Nachtfähre nach Ancona wartet; ein Nachtportier, dem die Worte fehlen.

**Kapitel 2: Sarajevo.** Marko fährt mit Mala in die Stadt seiner Kindheit. Drei neue Fälle: ein junger Mann, der seit 1972 unter dem Uhrturm wartet; ein Professor, der ein Buch aus der brennenden Nationalbibliothek zurückgeben will; eine Lehrerin, die im Schutzraum eines Hochhauses noch immer Schule hält. Dazu Malas eigene Geschichte. Beide Kapitel lassen sich im Hauptmenü direkt wählen; Sarajevo startet auch ohne Split. Das Spiel läuft immer im Querformat (hochkant dreht sich das Bild mit). Sprachen: Deutsch und Bosnisch/Kroatisch (Kapitel 1 vollständig, Kapitel 2 und 3 vorerst nur Deutsch).

**Kapitel 3: Mostar.** Marko folgt Malas Spur nach Mostar. Ihre Brücke ist nicht die Alte Brücke; eine Peilung von drei Standorten führt zu einer stillgelegten Fähre flussab. Dort warten zwei Geister: Bato, der Fährmann, an seiner Glocke, und Mate Zelenika, der jeden Samstag auf den Bus seines Sohnes aus München wartet. Am Ende ist Mala frei und bleibt, weil sie es will und Marko zustimmt. Kapitel 3 lässt sich im Hauptmenü direkt wählen; nach dem Abspann von Sarajevo heißt es „Weiter mit Kapitel 3: Mostar“.

## Inhalt

| Pfad | Was |
|---|---|
| [`LOESUNG1.md`](LOESUNG1.md) | Lösungsweg von Kapitel 1 vom Spielstart bis zu Lukas Fall: Soloauftakt, Kennenlernen in der Wohnung, erster Fall, der Morgen nach Ivka |
| [`BERICHT_EINSTIEG.md`](BERICHT_EINSTIEG.md) | Bericht zum neuen Einstieg und zur Passage nach Ivka: Änderungen, ausgeführte Tests, Schätzungen, offene Punkte (Plan vorab: [`EINSTIEG_PLAN.md`](EINSTIEG_PLAN.md)) |
| [`KAPITEL2.md`](KAPITEL2.md) | Entwurf von Kapitel 2: Umfang, Kontinuität, Phasen, Figuren, 18 Schauplätze, alle Rätselketten, Abhängigkeitsgraph, Audio |
| [`LOESUNG2.md`](LOESUNG2.md) | Komplettlösung von Kapitel 2 |
| [`SPRACHFASSUNG_BHS.md`](SPRACHFASSUNG_BHS.md) | Bosnisch-kroatische Sprachfassung: wer welche Sprachform spricht, Technik, Prüfungen, offene Punkte (Stilvorgaben in `game/STYLE_BHS.md`) |
| [`BERICHT_K2.md`](BERICHT_K2.md) | Entwicklungs- und Testbericht von Kapitel 2 (was geprüft wurde und was nicht) |
| [`KAPITEL3_KONZEPT.md`](KAPITEL3_KONZEPT.md) | Konzept von Kapitel 3 (Fassung 2, nach der Prüfung): Handlung, Figuren, Orte, Rätselketten, Finale, Audio |
| [`LOESUNG3.md`](LOESUNG3.md) | Komplettlösung von Kapitel 3 mit allen Varianten |
| [`BERICHT_K3.md`](BERICHT_K3.md) | Entwicklungs- und Testbericht von Kapitel 3 (was geprüft wurde und was nicht) |
| [`HINWEISE.md`](HINWEISE.md) | Alle Hinweistexte der drei Kapitel mit ihren Bedingungen (Entwicklerübersicht, enthält Lösungen) |
| [`BERICHT_PRUEFBERICHT.md`](BERICHT_PRUEFBERICHT.md) | Überarbeitung nach dem externen Prüfbericht (November 2026): blockierende Fehler, Widersprüche, neue Rätselformen, Spannungsbogen, Tests, offene Punkte |
| [`KONZEPT.md`](KONZEPT.md) | Das vollständige Konzept: Analyse des Originals, Umsetzung der Blackwell-Mechanik, Story, Figuren, 19 Orte, die drei Fälle mit allen Rätseln und Lösungen, Spielzeit, Malas Geheimnis |
| `web/` | **Das spielbare Spiel** (eine einzige `index.html` + Offline-Service-Worker + Icons). Ordner bei Netlify hochladen oder `index.html` im Browser öffnen. Siehe `web/LIESMICH.txt` |
| `game/src/` | Quelltext: Engine (`00`–`06`, `99`), Porträts (`07`, `portraits/`), Tagesabläufe der Nebenfiguren (`08`), Gegenstände & Notizen (`10`, `11`), Szenerie (`20`), Räume (`rooms/` Logik, `rooms/art/` Kunst, `rooms/limbo.js` die Zwischenwelt), Story (`90`–`93`); Kapitel 2: Gegenstände, Notizen, Figuren, Hinweise, Klang (`12`–`16`), Story, Mala, Zwischenwelt, Gespräche, Erinnerungsbilder (`96`–`98`); Kapitel 3: Gegenstände, Notizen, Figuren, Hinweise, Klang (`12_k3` bis `16_k3`), Gerüst, Peilung, Mala, Zwischenwelt, Erinnerungsbilder, Vorstellungen (`96_k3` bis `98_k3`) |
| `game/build.js` | Baut `web/index.html` aus den Quellen: `node game/build.js` |
| `game/tools/` | Entwicklungswerkzeuge: `walkthrough.js` (automatischer Komplett-Durchlauf), `roomshot.js` (Raum-Screenshots), `contact.js` (alle Räume und Tageszeiten auf einem Blatt), `memsheet.js` (Erinnerungsbilder), `uishots.js` (Oberfläche), `portraitsheet.js` (Porträts), `sheet.js` (Figuren-Modellblatt), `icons.js`; für Kapitel 2: `walkthrough2.js` (Durchlauf, auch in anderer Reihenfolge), `k2tests.js` (Kapitelwahl, Übernahme, Spielstände, falsche Reihenfolgen, Hinweise), `devicetest.js` (iPad-Ansicht mit Touch, offline, Bildzeit); für Kapitel 3: `walkthrough3.js` (Durchlauf von Anfang bis Ende), `k3tests.js` (Nebenwege, falsche Versuche, Zwischenstände, Laden in jeder Phase) mit `k3play.js` (gemeinsame Spielerhandlungen); `hintcheck.js` (Hinweise gegen echte Spielstände), `hintdoc.js` (erzeugt `HINWEISE.md`) |
| `game/ART_API.md`, `game/ROOM_SPECS.md`, `game/ROOM_SPECS2.md`, `game/ROOM_SPECS3.md`, `game/CAST2.md`, `game/CAST3.md`, `game/PORTRAIT_API.md`, `game/K3_SPEC.md` | Mal-Verträge für Räume und Porträts, Raumvorgaben; `K3_SPEC.md` ist die Vorgabe für die Skripte von Kapitel 3 (Dateien, Schalter, Notizen, Übergänge) |

## Spielen

```
node game/build.js          # baut web/index.html
node game/build.js --artifact out/mala.html   # zusätzlich eine Fassung für claude.ai-Artefakte
open web/index.html         # oder bei Netlify hochladen
```

Steuerung kurz: Tippen = ansehen bzw. Verb-Menü · Ziehen = Gegenstand benutzen · unten links = zwischen Marko und Mala wechseln · „Notizen“ = Notizbuch (zwei Einträge antippen = verbinden; im Menü auf „Nachdenken“ umschaltbar) · „Zeigen“, „Menü“. Hinweise gibt es in allen drei Kapiteln nur auf Wunsch unter „Menü → Hinweis …“, in vier Stufen.

## Prüfen

```
node game/tools/walkthrough.js [screenshot-ordner]   # spielt Kapitel 1 automatisch durch (MALA_LANG=bhs: auf Bosnisch/Kroatisch)
node game/tools/einstiegtests.js                    # Einstieg und Morgen nach Ivka: alte Spielstände, Laden, Malas Abwesenheit
MALA_DUMPALL=/tmp/d node game/tools/walkthrough2.js # spielt Kapitel 2 durch (MALA_ORDER=alt: andere Reihenfolge)
node game/tools/k2tests.js /tmp/d                   # Einzeltests für Kapitel 2
MALA_DUMPALL=/tmp/d3 node game/tools/walkthrough3.js   # spielt Kapitel 3 durch
K3T_DUMPS=/tmp/d3t node game/tools/k3tests.js /tmp/d3  # Einzeltests für Kapitel 3 (legt die Stände der Nebenwege ab)
node game/tools/hintcheck.js /tmp/d3 /tmp/d3t       # Hinweise gegen alle Stände prüfen
node game/tools/hintdoc.js > HINWEISE.md            # Übersicht aller Hinweistexte
node game/tools/devicetest.js                       # iPad-Ansicht, Touch, offline, Bildzeit
MALA_DUMPALL=/tmp/k1 node game/tools/walkthrough.js # Spielstände je Schritt für den nächsten Test
node game/tools/pruefbericht.js /tmp/k1 /tmp/d [bilder]   # jeder Befund des Prüfberichts im echten Spiel nachgestellt
node game/tools/roomshot.js --room riva --phase c1 --cam 320 --out riva.png [--debug] [--who mala]
```

## Technik in Kürze

- 320 × 200, indexierte Palette mit 110 Farben in Rampen, geordnetes Bayer-Dithering, Farbtabellen für Dämmerung, Nacht, Morgengrauen, Geistersicht und Erinnerung.
- Räume prozedural in Fluchtpunktperspektive (`M.box`, `M.room3`), Figuren über ein Rig aus Kopf-Stempeln, erzeugten Torsi und IK-Gliedmaßen.
- Engine mit Verb-Menü, Inventar zum Ziehen, A*-Wegfindung je Figur (Mala hat eigene Geisterwege), Notizbuch mit Schlussfolgerungen, drei Speicherplätzen.
- Gespräche wie in der Blackwell-Reihe: gemaltes Brustbild (56 × 64, `game/src/portraits/`) oben, der Satz im Kasten daneben, die Antworten unten.
- Der Einstieg: Zuerst ist Marko allein: Übersetzung, die Bar „Bura“, die Recherche für den Nachruf, Kopfschmerz, Übelkeit, Schwindel. Dann ein Mädchen an der Kirchentreppe und in der Scheibe; das erste lange Gespräch findet in seiner Wohnung statt. Erst nach dem ersten gemeinsamen Test im Hafenamt erscheint der Wechsel-Knopf.
- Nach Ivka: Am Morgen danach sieht Marko Mala nicht mehr und erklärt sich alles als Traum; sie kehrt auf dem Stuhl gegenüber in der „Bura“ zurück. Erst auf der Bank an der Riva sagt er zu.
- Geister: Leine aus Licht in Malas Sicht, Leugnen bis zum plötzlichen Erkennen, dann bringt Mala sie über eine Licht-Schwelle in die Zwischenwelt, wohin Marko mitgeht und den letzten Schritt tut.
- Nebenfiguren mit Tagesablauf (Tätigkeiten, kurze Wege), dunkle Orte, die nur Malas Schein erhellt.
- WebAudio: Raumklang aus gefiltertem Rauschen und gestreuten Ereignissen, Fährenhörner, Glocken, Schritte je Bodenart, Geisterfilter, ein kleiner Sequenzer mit eigenen Stücken.
