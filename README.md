# MALA – Kapitel 1: Split

Ein ernstes Point-and-Click-Adventure nach dem Vorbild der Blackwell-Reihe, im technischen und ästhetischen Stil des beigelegten „Twenty to Four“ (VGA-Pixelgrafik, alles im Code gemalt und vertont), aber komplett eigenständig.

Marko Vuković, Übersetzer in Split, kann mit Menschen reden, die nicht weiterkommen. Mala, ein Geist in Kleidung der frühen Neunziger, kann sie finden. Drei Fälle im November 2011: eine Mutter, die seit 1984 auf das Boot um sieben wartet; ein Junge, der seit 1999 auf die Nachtfähre nach Ancona wartet; ein Nachtportier, dem die Worte fehlen.

## Inhalt

| Pfad | Was |
|---|---|
| [`KONZEPT.md`](KONZEPT.md) | Das vollständige Konzept: Analyse des Originals, Umsetzung der Blackwell-Mechanik, Story, Figuren, 18 Orte, die drei Fälle mit allen Rätseln und Lösungen, Spielzeit, Malas Geheimnis |
| `web/` | **Das spielbare Spiel** (eine einzige `index.html` + Offline-Service-Worker + Icons). Ordner bei Netlify hochladen oder `index.html` im Browser öffnen. Siehe `web/LIESMICH.txt` |
| `game/src/` | Quelltext: Engine (`00`–`06`, `99`), Gegenstände & Notizen (`10`, `11`), Szenerie (`20`), Räume (`rooms/` Logik, `rooms/art/` Kunst), Story (`90`–`92`) |
| `game/build.js` | Baut `web/index.html` aus den Quellen: `node game/build.js` |
| `game/tools/` | Entwicklungswerkzeuge: `walkthrough.js` (automatischer Komplett-Durchlauf), `roomshot.js` (Raum-Screenshots), `sheet.js` (Figuren-Modellblatt), `icons.js` |
| `game/ART_API.md`, `game/ROOM_SPECS.md` | Mal-Vertrag und Raumvorgaben für die Kunst-Dateien |

## Spielen

```
node game/build.js          # baut web/index.html
open web/index.html         # oder bei Netlify hochladen
```

Steuerung kurz: Tippen = ansehen bzw. Verb-Menü · Ziehen = Gegenstand benutzen · unten links = zwischen Marko und Mala wechseln · „Notizen“ = Notizbuch (zwei Notizen antippen = verbinden) · „Tipp“, „Zeigen“, „Menü“.

## Prüfen

```
node game/tools/walkthrough.js [screenshot-ordner]   # spielt das ganze Kapitel automatisch durch
node game/tools/roomshot.js --room riva --phase c1 --cam 320 --out riva.png [--debug] [--who mala]
```

## Technik in Kürze

- 320 × 200, indexierte Palette mit 110 Farben in Rampen, geordnetes Bayer-Dithering, Farbtabellen für Dämmerung, Nacht, Morgengrauen, Geistersicht und Erinnerung.
- Räume prozedural in Fluchtpunktperspektive (`M.box`, `M.room3`), Figuren über ein Rig aus Kopf-Stempeln, erzeugten Torsi und IK-Gliedmaßen.
- Engine mit Verb-Menü, Inventar zum Ziehen, A*-Wegfindung je Figur (Mala hat eigene Geisterwege), Porträt-Dialogen, Notizbuch mit Schlussfolgerungen, gestuften Tipps, drei Speicherplätzen.
- WebAudio: Raumklang aus gefiltertem Rauschen und gestreuten Ereignissen, Fährenhörner, Glocken, Schritte je Bodenart, Geisterfilter, ein kleiner Sequenzer mit eigenen Stücken.
