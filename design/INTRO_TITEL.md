# Intro und vier Titelbilder

Stand 11.11.2026. Alles ist mit den Mitteln des Spiels gezeichnet (Palette, Rampen, Himmel, Wasser, Nebel, Schnee, Regen,
Räume, Figuren); es gibt keine eingebundenen Bilder.

## Vier Titelbilder (`game/src/88_titles.js`)

| Nr. | Ort | Kapitel, Tag | Bild | Bewegung |
|---|---|---|---|---|
| 1 | Split | K1, Dienstag 15. 11. 2011 | das bisherige Titelbild: Riva bei Nacht, Glockenturm, Mole, Mala als Schimmer | Wellen, Lichter auf dem Wasser, Fähre am Horizont, Mala atmet |
| 2 | Sarajevo | K2, Samstag 19. 11. 2011 („Die Linie Drei“) | Novembernacht an der Miljacka: Hänge mit Lichtern, Altstadt mit Kuppel und Minaretten, Lateinerbrücke, Uferstraße mit Laternen | die Straßenbahn der Linie 3 fährt alle 26 s vorbei (mit Spiegelung), Nebelschwaden, erster Schnee, Fenster gehen an und aus, Mala als Schimmer auf der Brücke |
| 3 | Mostar | K3, Donnerstag 24. 11. 2011 (Regen) | die Alte Brücke am Abend: Türme Tara und Halebija, Häuser mit Steinplattendächern, Koski-Mehmed-Paša-Moschee, die grüne Neretva | Regen, Strömung und Regenringe auf dem Fluss, ein roter Schirm geht über die Brücke (Marko), daneben ein Schimmer (Mala), Lampen flackern |
| 4 | München | K4, Heiligabend 2011 | Schnee, Giebelhäuser, Rathausturm, die Türme der Frauenkirche, Christbaum und Buden auf dem Platz | Schneefall, Christbaumlichter funkeln, Rauch aus den Kaminen, Leute über den Platz, Mala steht im Schnee und sieht zum Baum |

* **Wechsel**: bei jedem Start das nächste Bild (Split → Sarajevo → Mostar → München → Split …), je Gerät in `mala.titel`
  gemerkt; der erste Start zeigt Split. Innerhalb einer Sitzung bleibt das Bild (auch nach „Zum Titelbild“).
  `?titel=split|sarajevo|mostar|muenchen` wählt fest (Tests, Bildschirmfotos). In der QA-VM bleibt es bei Split.
* **Lesbarkeit**: Die Motive liegen in der oberen Bildhälfte; unten liegt das Menü auf dem dunklen Band der HTML-Schicht. Türme
  und Kuppeln sind so gesetzt, dass sie den Schriftzug „DIE STILLEN“ möglichst wenig kreuzen.
* **Bewegung reduzieren**: Alle Bewegungen laufen mit 30 % Tempo (wie bisher beim Titel).
* **Spoiler**: Die Orte sind dieselben, die die Kapitelwahl vom ersten Start an zeigt; die Unterzeile unter dem Schriftzug nennt
  weiterhin nur erreichte Orte. Kein Bild zeigt Handlung aus den Fällen.

## Intro (`game/src/89_intro.js`)

Breitbild-Streifen (Szene 320 × 144 bei y 28), die Räume des Spiels, gemalt mit einem eigenen, nicht gespeicherten Spielstand
(Prolog, Nacht). Länge 40,2 s (seit 13.11.2026 mit der Reise durch die vier Städte, siehe `design/ZWISCHENFILME.md`), danach blendet das Titelbild unter dem schon stehenden Schriftzug auf (1,4 s), das Menü weich dazu.

| Zeit | Bild | Text |
|---|---|---|
| 0,0–7,6 | Riva bei Nacht, Marko geht nach Hause, das Bild folgt ihm (Laternen, Hafenamt, Meer, Mond) | „Split, November 2011“ |
| 8,0–25,4 | Markos Wohnung: er steht am Fenster | „Marko schreibt Nachrufe.“ · „Auf Menschen, die allein gestorben sind.“ |
| | Mala wird am Regal sichtbar, Marko dreht sich um | „Marko lebt. Mala nicht.“ |
| | Mala schwebt an ihm vorbei und geht durch die Wand | „Er spricht mit den Lebenden.“ / „Sie geht durch Wände.“ |
| 25,4–37,0 | Die Reise: Baščaršija im Nebel, Alte Brücke, Gleis 11 im Schnee, Vratnik im März – Marko geht, Mala folgt | „Ein halber Name in einem alten Register.“ · „Eine Spur nach Osten.“ · „Vier Städte.“ · „Und ein Mädchen, das nur einer sieht.“ |
| 37,0–40,2 | Titelkarte: „DIE STILLEN“ wird von links nach rechts aufgedeckt (kalter Schimmer an der Kante), dann die Unterzeile | – |

* **Ton**: Fläche `ghost` und der Raumklang von Riva und Wohnung, ab der Titelkarte das Titelstück, das im Titel weiterläuft.
  Browser spielen Ton erst nach einer ersten Eingabe; beim Start läuft das Intro deshalb meist stumm. Über
  Einstellungen → „Intro ansehen“ (vom Titelbild aus) läuft es mit Ton.
* **Überspringen**: jeder Tipp, Klick oder jede Taste, sofort; der Tipp löst im Menü nichts aus. „Überspringen ▸“ steht ab 1,5 s
  oben rechts im schwarzen Streifen.
* **Wann es läuft**: beim Start, wenn „Intro beim Start“ an ist (Standard; `mala.intro`). Nicht unter Testautomatisierung
  (`navigator.webdriver`), nie in der QA-VM. `?intro=1` erzwingt es, `?intro=0` schaltet es ab.
* **Bewegung reduzieren**: kein Kameraschwenk auf der Riva; Blenden und Texte bleiben.
* **Sprache**: Die Texte gibt es auf Deutsch und Bosanski/Hrvatski (`lang/bhs_ui.js`).

## Werkzeuge und Tests

* `node design/tools/titelvorschau.js <ordner> [id …] [--t 0,3,7] [--video 12]` – Titelbilder als PNG oder Video
* `node design/tools/introvorschau.js <ordner> [--t …] [--video]` – Intro als Einzelbilder oder Video (ohne Ton)
* `node qa/ui/intro_titel.js [--kurz]` – Intro beim Start und unter Automatisierung, Überspringen (Klick, Taste, Esc),
  Durchlauf bis zum Titel, Aufblenden des Menüs, Einstellungen, fünf Starts mit Titelwechsel, Bewegung in allen vier Bildern

## Bilder und Videos

`design/intro_titel/`: `titel_split.png`, `titel_sarajevo.png`, `titel_mostar.png`, `titel_muenchen.png` (mit Menü, 1280 × 800),
`intro_ablauf.jpg` (Einzelbilder aus der Aufnahme), `intro_mit_ton.mp4` (das Intro in Echtzeit mit Spielmusik und Raumklang,
gestartet wie „Intro ansehen“; nur für dieses Video lauter gemacht), `titelbilder.mp4` (je 7 s jedes Titelbild mit Menü, ohne Ton).

## Prüfung (Build 11.11.2026 · a9714e)

| Prüfung | Ergebnis |
|---|---|
| `node qa/ui/intro_titel.js` | alle 16 Punkte OK (Intro beim Start und unter Automatisierung, Überspringen mit Klick, Leertaste und Esc, Durchlauf 28,6 s, Menü blendet auf, Einstellungen, fünf Starts Split → Sarajevo → Mostar → München → Split, Bewegung in allen vier Bildern, keine JS-Fehler) |
| Regression `node qa/regress/run.js` | 33 von 33 OK |
| UI-Tests Phase 1–5 | 33/33, 90/90, 52/52, 92/92, 31/31 |
| `qa/ui/k3_revision.js`, `qa/ui/musik_nach_titel.js` | 40/40, OK |
| Offline-Test, Musterlösung Kapitel 1 | OK, OK |
| `qa/ui/savecompat.js` | 27/33 – genauso auf dem vorherigen Build 962623 (dieselben drei K3-Stände auf beiden Geräten); nicht durch diese Änderung |

Protokolle: `qa/protokolle/intro_titel_2026-11-11/`.
