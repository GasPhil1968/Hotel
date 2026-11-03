# MALA – Kapitel 1: Split

Ein ernstes Point-and-Click-Adventure nach dem Vorbild der Blackwell-Reihe, im technischen und ästhetischen Stil des beigelegten „Twenty to Four“ (VGA-Pixelgrafik, alles im Code gemalt und vertont), aber komplett eigenständig.

Marko Vuković, Übersetzer in Split, kann mit Menschen reden, die nicht weiterkommen. Mala, ein Geist in Kleidung der frühen Neunziger, kann sie finden. Drei Fälle im November 2011: eine Mutter, die seit 1984 auf das Boot um sieben wartet; ein Junge, der seit 1999 auf die Nachtfähre nach Ancona wartet; ein Nachtportier, dem die Worte fehlen.

## Inhalt

| Pfad | Was |
|---|---|
| [`KONZEPT.md`](KONZEPT.md) | Das vollständige Konzept: Analyse des Originals, Umsetzung der Blackwell-Mechanik, Story, Figuren, 19 Orte, die drei Fälle mit allen Rätseln und Lösungen, Spielzeit, Malas Geheimnis |
| `web/` | **Das spielbare Spiel** (eine einzige `index.html` + Offline-Service-Worker + Icons). Ordner bei Netlify hochladen oder `index.html` im Browser öffnen. Siehe `web/LIESMICH.txt` |
| `game/src/` | Quelltext: Engine (`00`–`06`, `99`), Porträts (`07`, `portraits/`), Tagesabläufe der Nebenfiguren (`08`), Gegenstände & Notizen (`10`, `11`), Szenerie (`20`), Räume (`rooms/` Logik, `rooms/art/` Kunst, `rooms/limbo.js` die Zwischenwelt), Story (`90`–`93`) |
| `game/build.js` | Baut `web/index.html` aus den Quellen: `node game/build.js` |
| `game/tools/` | Entwicklungswerkzeuge: `walkthrough.js` (automatischer Komplett-Durchlauf), `roomshot.js` (Raum-Screenshots), `contact.js` (alle Räume und Tageszeiten auf einem Blatt), `memsheet.js` (Erinnerungsbilder), `uishots.js` (Oberfläche), `portraitsheet.js` (Porträts), `sheet.js` (Figuren-Modellblatt), `icons.js` |
| `game/ART_API.md`, `game/ROOM_SPECS.md`, `game/PORTRAIT_API.md` | Mal-Verträge für Räume und Porträts, Raumvorgaben |

## Spielen

```
node game/build.js          # baut web/index.html
node game/build.js --artifact out/mala.html   # zusätzlich eine Fassung für claude.ai-Artefakte
open web/index.html         # oder bei Netlify hochladen
```

Steuerung kurz: Tippen = ansehen bzw. Verb-Menü · Ziehen = Gegenstand benutzen · unten links = zwischen Marko und Mala wechseln · „Notizen“ = Notizbuch (Karten; Karte auf Karte ziehen = verbinden) · „Zeigen“, „Menü“. Das Spiel gibt keine Lösungshinweise.

## Prüfen

```
node game/tools/walkthrough.js [screenshot-ordner]   # spielt das ganze Kapitel automatisch durch
node game/tools/roomshot.js --room riva --phase c1 --cam 320 --out riva.png [--debug] [--who mala]
```

## Technik in Kürze

- 320 × 200, indexierte Palette mit 110 Farben in Rampen, geordnetes Bayer-Dithering, Farbtabellen für Dämmerung, Nacht, Morgengrauen, Geistersicht und Erinnerung.
- Räume prozedural in Fluchtpunktperspektive (`M.box`, `M.room3`), Figuren über ein Rig aus Kopf-Stempeln, erzeugten Torsi und IK-Gliedmaßen.
- Engine mit Verb-Menü, Inventar zum Ziehen, A*-Wegfindung je Figur (Mala hat eigene Geisterwege), Notizbuch mit Schlussfolgerungen, drei Speicherplätzen.
- Gespräche wie in der Blackwell-Reihe: gemaltes Brustbild (56 × 64, `game/src/portraits/`) oben, der Satz im Kasten daneben, die Antworten unten.
- Die Stimme: Zu Beginn ist Mala für Marko nur eine Stimme. Überhören verstärkt den Kopfschmerz, erst wenn er sie zulässt, erscheint der Wechsel-Knopf.
- Geister: Leine aus Licht in Malas Sicht, Leugnen bis zum plötzlichen Erkennen, dann bringt Mala sie über eine Licht-Schwelle in die Zwischenwelt, wohin Marko mitgeht und den letzten Schritt tut.
- Nebenfiguren mit Tagesablauf (Tätigkeiten, kurze Wege), dunkle Orte, die nur Malas Schein erhellt.
- WebAudio: Raumklang aus gefiltertem Rauschen und gestreuten Ereignissen, Fährenhörner, Glocken, Schritte je Bodenart, Geisterfilter, ein kleiner Sequenzer mit eigenen Stücken.
