# Fahrt nach Skela: Taxi und Roller als Szene

Stand 12.11.2026. Bisher stand bei der Reise nach Skela nur ein Satz über dem Ostbusbahnhof („Am Ostbusbahnhof lehnt der Taxifahrer an
seinem Mercedes …“), und Dinos Rollerfahrt war ein langes Gespräch vor einem stehenden Bild. Jetzt wird die Fahrt gezeigt: Das Taxi
bzw. Dinos Roller fährt durchs Neretvatal, die Landschaft zieht vorbei, und Erzähltext und Gespräch laufen darüber. Die Sätze, die
Auswahl („Mit dem Taxi.“ / „Mit Dino auf dem Roller.“) und alles, was die Geschichte zählt, sind dieselben.

## Was zu sehen ist

| Fahrt | Wann | Bild |
|---|---|---|
| Taxi hin | Samstag, Samstagnacht, Sonntag (über den Stadtplan nach Skela) | cremefarbener Mercedes W123 mit TAXI-Schild fährt nach rechts; vorn der Fahrer am Lenkrad, hinten Marko, daneben Mala als Schimmer (wenn sie mitkommt) |
| Roller hin | wenn Dino es angeboten hat (Auswahl) | roter Roller: Dino fährt (roter Helm), Marko hinter ihm (grauer Helm), dahinter Mala; der gelbe Kinderhelm hängt leer hinten am Roller („Zwei Helme, einer davon für ein Kind. Ich nehme den anderen.“) |
| Taxi zurück | von Skela an der Straße zu jedem Ort in Mostar | dasselbe Taxi nach links, der Fahrer jetzt auf der nahen Seite |

* **Landschaft** in sieben Ebenen mit eigener Geschwindigkeit: Berge (sehr langsam, am Tag mit Schneekante), Hügel mit Häusern,
  Minaretten und Zypressen, Felder mit Pappeln und Telegrafenmasten samt Leitungen, die Straße mit wandernden Mittelstrichen, die
  Leitplanke, die Böschung (in der Frostnacht glitzernd), die Neretva mit Strömung und Glanzlichtern, ganz vorn Schilf und Büsche am Ufer.
* **Fahren**: Das Fahrzeug fährt erst an, wenn die Geschichte es sagt (Dino: nach „Halt dich fest. Nicht an mir. Am Griff.“), und
  bremst bei „Bei Skela hält er an …“; dazwischen Federn, Wippen der Figuren, sich drehende Radkappen, Auspuffwölkchen.
* **Tageszeit und Wetter** wie die Phase: Tag, Abend, Nacht (Mondsichel, Sterne, Scheinwerferkegel, Rück- und Scheinwerfer leuchten,
  der Rest nachtfarben), Frostnacht.
* **Figuren** sitzen in eigenen Haltungen: im Auto (Fahrer mit Händen am Lenkrad, spricht über die Schulter), auf dem Roller (Dino
  vorgebeugt am Lenker, dreht beim Reden den Kopf nach hinten; Marko hält sich am Griff fest), Mala schwebt mit.
* **Ton**: Motor und Stadt bzw. Moped und Fahrtwind, ab und zu Radio oder ein Hund.
* **Erzähltext** steht in dieser Szene oben im Himmel (Raumangabe `narrY`), damit er die Fahrer nicht verdeckt.

## Wie es eingebaut ist

* `game/src/rooms/art/k3_fahrt.js`: Bild (Himmel, Ebenen, Taxi, Roller, Helme, Vordergrund), Bewegung aus `dist(S, gt)` (Anfahren,
  Fahren, Bremsen).
* `game/src/rooms/k3_fahrt.js`: Raum „Unterwegs“ (ohne Speichern, ohne Mitlaufen, ohne Geisterblick), Haltungen, Sitzplätze,
  Geräuschkulisse; `M.k3Drive(A, art, fn)` wechselt in die Szene, setzt die Mitfahrer, spielt `fn()` (die bisherigen Texte) und fährt
  danach wie bisher ans Ziel. `M.k3RideGo` / `M.k3RideStop` lassen das Fahrzeug an der passenden Stelle anfahren bzw. halten.
* `game/src/96_k3_story.js` (`M.canTravel`): Hin- und Rückfahrt rufen `M.k3Drive` auf; `game/src/rooms/starimost.js`
  (`M.k3DinoRide`): Anfahren und Halten im Gespräch.
* **Geschichte unberührt**: Die Szene zählt nicht als Ortswechsel (`k3.moves` steigt wie vorher um eins, `k3.lastFrom` bleibt der Ort,
  an dem die Fahrt begann), sie löst keine Raumereignisse aus und wird nie gespeichert (Laden führt an den Ort vor der Fahrt). Die
  Trockenprüfung des Stadtplans (welche Orte erreichbar sind) und Tests ohne Bildschirm spielen nur die Texte.
* Die Epilogfahrt mit Vlados Lastwagen bleibt ein Satz.

## Prüfung (Build 12.11.2026 · 6315fc)

| Prüfung | Ergebnis |
|---|---|
| echte Reise über den Stadtplan mit Spielständen aus `qa/regress/fixtures` | Samstag Taxi, Samstag Roller (ganzes Gespräch mit Auswahl), Rückfahrt, Samstagnacht Taxi, Sonntag Roller: Szene läuft, Ankunft in Skela bzw. Mostar, `k3.moves` +1, `k3.lastFrom` = Ausgangsort, Mala am Ziel, keine JS-Fehler |
| Regression `node qa/regress/run.js` | 33 von 33 OK |
| `qa/ui/k3_revision.js` | 40 von 40 OK |
| Musterlösung Kapitel 3 (`game/tools/walkthrough3.js`, Reisen über den Stadtplan, also mit den Fahrtszenen) | OK, 131 Schritte, keine JS-Fehler |
| `qa/ui/figuren_leben.js` (alle Figuren × Animationen, auch die neuen Sitzhaltungen) | OK |
| Offline-Test | OK |
| Übersetzungsprüfung | neu nur „Unterwegs“, „Taxifahrer“, „Dino“, „TAXI“; Kapitel 3 hat noch keine BHS-Fassung |

Video: `design/fahrt/fahrten_skela.mp4` (aufgenommen mit `node design/tools/fahrtvideo.js design/fahrt`: Spielbild vierfach, mit Ton).
