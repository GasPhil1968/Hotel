# Mostar: die elf Grafikpunkte

Stand 12.11.2026. Umsetzung der Liste „Was man an der Grafik verbessern kann“ für Kapitel 3 (Mostar und Skela). Alles wirkt nur in den
Räumen von Kapitel 3 und nur in Kapitel 3 (`M.k3LookOn`); die übrigen Kapitel sind pixelgleich wie vorher (geprüft). Jeder Punkt ist
einzeln abschaltbar (`M.K3FX.pal|para|light|shadow|reflect|breath|follow|life|face|gait|close = false`), alles zusammen mit
`M.K3LOOK_OFF = true` (Vergleichsbilder, Tests).

Eingehalten, was nicht gewollt war: keine echten Farbverläufe, keine Transparenz außerhalb der Palette (Mischfarben werden auf
Palettenfarben gelegt), kein weichgezeichnetes Skalieren, keine Figuren in höherer Auflösung als die Räume (auch die Nahaufnahmen haben
dieselbe Pixelgröße), kein Glühen oder Bloom außerhalb der Palette, kein zusätzliches Raster auf kleinen Flächen (die neuen Rampen haben
Zwischenstufen und brauchen *weniger* Raster).

| # | Punkt | Was man sieht | Wo |
|---|---|---|---|
| 1 | Spiegelungen | Lebende Figuren spiegeln sich in Pfützen und auf nassem Pflaster: eine Stufe dunkler, mit dem Boden gemischt, gerastert, nach unten schwächer, bei Regen gekräuselt. Busbahnhof (Pfützen immer), Alte Brücke, Kujundžiluk, Herbergsterrasse (bei Regen und in der nassen Donnerstagnacht). **Mala hat kein Spiegelbild.** | `06_ui.js` `k3Reflect`; Böden aus den Räumen (`fx.reflect`) |
| 2 | Lampenlicht auf den Figuren | Nachts färbt jede nahe Lampe die ihr zugewandte Kante der Figur in Lampenfarbe (warm aus der neuen Rampe *f*, Leuchtröhren am Busbahnhof kalt); starkes Licht zwei Pixel tief; steht die Lampe hinter der Figur, ein Saum an beiden Seiten (Gegenlicht). Lampen aus den Lichtlisten der Räume (11 Räume). | `02_rig.js` `rimPass`; `21_k3_look.js` Lampen |
| 3 | Echte Schlagschatten | Von den (höchstens zwei) stärksten Lampen ein langer, gerasterter Schatten von der Lampe weg, nah an den Füßen kräftiger, je weiter die Lampe, desto länger. Geister werfen keinen. | `06_ui.js` `k3Shadows` |
| 4 | Atemwolken | Draußen in kalten Stunden (Bura, alle Nächte, Frostnacht, Morgengrauen) alle zwei bis vier Sekunden ein Wölkchen vor dem Mund, beim Sprechen öfter; steigt, wächst, vergeht gerastert; bei Bura reißt es der Wind weg; vor hellem Grund grau statt weiß. **Mala atmet nicht.** | `21_k3_look.js` `M.k3Breath` |
| 5 | Parallaxe | In den neun breiten Räumen läuft die ferne Ebene (Himmel; an Busbahnhof und Alter Brücke auch Velež, Hügel, Hum) beim Schwenken langsamer (Faktor 0,5–0,6). In der Raummitte deckt sie sich genau mit dem gemalten Bild. | Räume geben `farSky` heraus; `21_k3_look.js` |
| 6 | Folgebewegung | Beim Gehen hängt der Mantelsaum nach, beim Anhalten schwingt er vor und pendelt aus (auch Röcke, auch beim Umdrehen); langes Haar am Hinterkopf (Malas Zopf, Lenas Haar) schwingt mit. Bei Bura weht draußen alles nach links, flatternd – nur nicht bei Geistern. | `02_rig.js` (`p.cl`, `hairShift`); `21_k3_look.js` |
| 7 | Leben im Hintergrund | Leute auf dem Scheitel der Alten Brücke und auf dem Gehweg gegenüber am Bulevar; Autos mit Scheinwerfern und Rücklicht nachts (Bulevar, Straßenbrücke); Katzen (Kujundžiluk auf dem Ladentisch, Koski auf der Mauer, Markt unter dem Tisch); Tauben auf den Firsten; Hühner und Krähen in Skela, Krähen über dem Partisanenfriedhof; Kaminrauch in kalten Stunden (Altstadt, Skela); flackernde Leuchtschrift „Caffe Zdravko“. | `21_k3_look.js` `K3_LIFE`; Scheinwerfer in `bulevar.js`, `strassenbr.js` |
| 8 | Palette mit farbverschobenen Rampen | 70 neue Farben (115 → 185): Kalkstein, Graustein, Neretva (smaragd), Laub, Lampenlicht, Erde – Schatten kühl und violett, Lichter warm, jede Rampe mit Zwischenstufen. In Mostar werden Hintergrund, Ebenen und Vordergrund auf die neuen Rampen umgefärbt (Figuren nicht), und wo die Räume mit Rampen malen, kommen die Zwischenstufen dazu. | `00_core.js`, `01_art.js` `M.R`, `06_ui.js` |
| 9 | Gesichter mit Ausdruck | Für jede Figur aus ihrem Kopf abgeleitet: Lächeln (Mundwinkel hoch, Wange), Stirnrunzeln (Braue zur Nase tiefer, Mundwinkel runter), hochgezogene Braue, weiter Mund; je auch sprechend. Gewählt aus dem Wortlaut jedes Satzes (Dank/Freude, Widerspruch/Ärger, Frage, Ausruf); Lidschlag und die Stimmungen der Geister gehen vor. | `02_rig.js` `exprRows`; `21_k3_look.js` |
| 10 | Eigene Gangarten | Jela, Zlata, der alte Mann an der Brücke: gebeugt, kurze Schritte, Kopf vor, 1,45× langsamer; Vlado, der Händler: leicht gebeugt; Lena: federnd, größere Schritte, schneller; Marko in den Nächten und am Morgen danach: müde, Kopf gesenkt, hängende Arme. | `21_k3_look.js` |
| 11 | Nahaufnahmen | Fünf große Bilder an Schlüsselmomenten, gerastert ein- und ausgeblendet, die Sätze laufen oben weiter: die Fährglocke beim ersten Läuten (Samstagnacht), Batos Hände („Mit diesen Händen“), Zlatas Sturmlaterne („Zvono.“), Mala unter dem Quittenbaum, der Blick vom Scheitel der Alten Brücke („Tief unten.“). | `97_k3_nah.js`; Aufrufe in `skela_d.js`, `skela_l.js`, `starimost.js` |

## Nachtrag 13.11.2026: kräftiger

Rückmeldung: „So viel Unterschied sehe ich nicht.“ Stimmt – bei 320 × 144 Pixeln waren die Punkte zu leise, und die neuen Rampen
waren tagsüber sogar grauer als die alten. Deshalb:

* **Rampen satter** (`00_core.js`, `PAL3_DEF`): Kalkstein mit deutlich violetten Schatten und warmem Creme-Gold im Licht, Graustein
  violetter, die Neretva leuchtender smaragdgrün, Laub und Erde satter.
* **Farbstimmung je Tageszeit und Wetter** (`21_k3_look.js`, `M.k3PalMap`, abschaltbar mit `M.K3FX.mood=false`): über der Umfärbung
  eine feste Farbtabelle je Stimmung – tags warmes Licht und kühle Schatten, nachts tiefes Blau und wärmere Lampen, im Regen kühl
  und gedämpft, bei Bura klar und hart, in Dämmerung und Morgengrauen Orange gegen Blau. Damit nichts grell oder hart wird, gilt
  bei zu großem Helligkeitssprung oder zu viel Buntheit die halbe Verschiebung oder die alte Farbe. Kein Raster, keine Farben
  außerhalb der Palette; die anderen Kapitel bleiben unberührt.
* Bilder: `farbstimmung_tag.png`, `farbstimmung_wetter.png`, `farbstimmung_nacht.png` (je Zeile vorher | nur Umfärbung | mit Farbstimmung).
* Geprüft: `qa/ui/k3_grafik.js` 26/26, Regression 33/33, `qa/ui/k3_revision.js` 40/40, Musterlösung Kapitel 3 OK (131 Schritte,
  keine JS-Fehler), Fahrtvorschau OK.

## Technik in Kürze

* **Umfärben (8):** `M.PAL3MAP` bildet die alten Rampen *s m a g y e* auf die neuen *o u j i f z* ab. Die Szene wird nach der
  Raumbewegung einmal ganz umgefärbt und am Ende noch einmal überall, wo keine Figur steht (Maske `amask`). Die Suche nach der nächsten
  Palettenfarbe (Farbtabellen für Nacht, Geister, Mischfarben) bleibt auf den alten 115 Farben, solange keine Mostar-Farbe beteiligt
  ist – deshalb ändern sich die anderen Kapitel nicht.
* **Parallaxe (5):** `farSky()` liefert die ferne Ebene ganz gemalt (auch, wo die Stadt sie verdeckt) und die Maske, wo sie im Bild zu
  sehen ist; an diesen Stellen wird um (Kamera − Raummitte) · (1 − k) versetzt gelesen.
* **Licht (2, 3):** Lampen sind die Einträge der Lichtlisten über dem Boden, ihr Fußpunkt die Lichtpfütze darunter.
* **Posen (6, 9, 10):** `M.k3Pose` leitet aus jeder Pose eine Variante mit Saum, Haar, Ausdruck oder Gangart ab (zwischengespeichert).

## Prüfung (Build 12.11.2026 · e6e39d)

| Prüfung | Ergebnis |
|---|---|
| `node qa/ui/k3_grafik.js` (neu) | 26 von 26: Palette (185 Farben, 43 neue im Bild der Alten Brücke, feinere Rampen), andere Kapitel unberührt, Parallaxe in allen neun breiten Räumen (am Rand 7333 Pixel versetzt, in der Mitte deckungsgleich), Lichtkante (142 Pixel) und Schatten (124 Pixel), Spiegelung (78 Pixel, Mala 0, Pfütze 30), Atem bei Bura (nicht an einem milden Tag), Saum weht (Mala nicht), Auspendeln nach dem Anhalten, Ausdrücke je Figur und aus dem Satz, Gangarten, Leben in acht Räumen, fünf Nahaufnahmen eingebaut und gezeigt, abschaltbar, keine JS-Fehler |
| Rechenzeit je Bild (`M.renderFrame`) | Alte Brücke nachts 0,69 ms (ohne die Punkte 0,37), im Regen 0,45 (0,16), Busbahnhof bei Bura 0,56 (0,22), Bulevar nachts 0,39 (0,15), Skela Frostnacht 0,92 (0,76) |
| Regression `node qa/regress/run.js` | 33 von 33 OK |
| UI-Tests Phase 1–5 | 33/33, 90/90, 52/52, 92/92, 31/31 (Phase 5 im Gesamtlauf einmal 30/31 unter Last, einzeln wiederholt 31/31) |
| `qa/ui/k3_revision.js`, `qa/ui/intro_titel.js`, `qa/ui/musik_nach_titel.js`, `qa/ui/figuren_leben.js`, Offline-Test | 40/40, OK, OK, OK, OK |
| Musterlösungen (`game/tools/walkthrough*.js`) | Kapitel 1, 2, 3 (131 Schritte, mit allen fünf Nahaufnahmen im Finale und Epilog), 4, 5: OK, keine JS-Fehler |
| `qa/ui/savecompat.js` | 27/33 – dieselben drei K3-Stände auf beiden Geräten wie vor dieser Arbeit |
| andere Kapitel | Hintergründe von Split, Sarajevo, München, Sarajevo (K5) pixelgleich mit dem Stand davor; keine Mostar-Farben, keine Effekte außerhalb von Kapitel 3 |

## Bilder (`design/k3grafik/`)

`vergleich_*.png` (vorher/nachher je Szene), `palette.png`, `lichtkante_nah.png`, `schatten_nah.png`, `spiegelung_nah.png`,
`parallaxe.png` (drei Kamerastellungen), `gesichter.png`, `gangarten.png`, `leben.png`, `nah_glocke.png`, `nah_haende.png`,
`nah_laterne.png`, `nah_quitte.png`, `nah_scheitel.png`, `rundgang.mp4` (Video). Werkzeuge: `design/tools/k3grafik_shots.js`
(Szenenbilder aus einem Build), `design/tools/k3grafik_video.js` (Rundgang).
