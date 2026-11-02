# Mal-Vertrag für Porträts

Gespräche zeigen bei jeder gesprochenen Zeile ein gemaltes Brustbild der sprechenden Figur oben links oder oben rechts im Bild. Daneben steht der Satz in einem schwarzen Kasten mit hellem Rand. Vorbild ist die Darstellung der Blackwell-Reihe: große, sorgfältig gemalte Gesichter neben dem Text. Unsere Bilder sind eigenständig, es wird nichts nachgemalt.

## Datei und Schnittstelle

Je Figur eine Datei `game/src/portraits/<id>.js`:

```js
(function(M){
'use strict';
var P=M.P, T=M.T, bayer=M.bayer, hash=M.hash;
M.definePortrait('nina',{ paint:function(b,v){
  // b: M.Buf(56,64), transparent (M.T). v.mouth: 0 zu, 1 offen (spricht). v.eyes: 0 offen, 1 zu (Lidschlag).
} });
})(M);
```

- **Größe:** genau 56 × 64 Pixel (`M.PORTRAIT_W`, `M.PORTRAIT_H`). Das Bild wird 1:1 gezeigt, nicht skaliert. Das Spiel läuft in 320 × 200, das Porträt ist also etwa ein Drittel der Bildhöhe groß.
- **Ausschnitt:** Kopf und Schultern, Dreiviertelansicht, **Blick nach rechts**. Steht das Porträt rechts im Bild, spiegelt die Oberfläche es. Die Schultern reichen bis an die Unterkante (gerade abgeschnitten). Oben 3–6 Pixel Luft über dem Haar.
- **Grund:** transparent lassen (kein Hintergrund, kein Rahmen). Die Silhouette bekommt außen eine dunkle Kontur (`P.k1` oder `P.k0`), damit sie über jedem Raum steht.
- **Varianten:** Die Funktion wird dreimal aufgerufen: `{mouth:0,eyes:0}` (ruhig), `{mouth:1,eyes:0}` (spricht), `{mouth:0,eyes:1}` (blinzelt). Mund offen = Lippen etwas geöffnet, eine dunkle Linie zwischen den Lippen, ggf. 1 Pixel Zähne. Augen zu = Lid in Hautfarbe mit dunkler Wimpernlinie.
- **Farben:** nur Namen aus `M.P` (siehe `game/src/00_core.js`, Liste `PAL_DEF`, und die Rampen in `RAMPS`). Hilfreich: `M.R('p1 p2 p3 p4')` für Rampen, `M.rampAt(ramp,v,x,y)` für geditherte Verläufe, `M.UP[c]` / `M.DN[c]` für eine Stufe heller/dunkler, `M.stamp(rows,legend)` für ASCII-Pixelkarten, `M.outline(buf,col)` für Konturen, die Methoden des Puffers (`px rect hl vl line ellipse poly get`), `M.light(b, M.lf.pool(...))` für Licht.
- **Kein** `Math.random`, kein Canvas, keine externen Dateien. Wiederholbar (gleiches Bild bei jedem Aufruf).
- **Geister** (`mala`, `ivka`, `luka`, `bruno`, `jakov`) bitte **in natürlichen Farben** malen. Das Spiel färbt sie selbst ein: Mala kalt blau-türkis, die anderen fahl-lavendel (`M.TINT.ghostP`, `M.TINT.spiritP`). Prüfe im Blatt, dass das eingefärbte Bild gut lesbar bleibt: Augen, Brauen, Mund und Kontur müssen auch einfarbig klar sein (Helligkeitsunterschiede, nicht nur Farbunterschiede).

## Stil

- Gemalte Pixelkunst, kein Comic: klare Formen, 4–6 Tonstufen je Fläche, Hauptlicht von links oben (warm), Gegenlicht oder Schatten rechts (kühl). Dithering sparsam, nur für weiche Übergänge.
- Gesichter mit Charakter und Alter: Augen mit Weiß, Iris und Lidschatten (je Auge etwa 4–5 × 2–3 Pixel), Brauen bestimmen den Ausdruck, Nase über Schatten statt Linie, Lippen mit Ober- und Unterlippe, Ohren, Haar in Strähnen mit Glanzlicht, Kleidung mit Kragen und Faltenschatten.
- Ausdruck: ruhig und ernst, passend zum Ton des Spiels. Keine Grimassen, kein Lachen.
- Kopfgröße: Gesicht (Kinn bis Haaransatz) etwa 24–30 Pixel hoch. Gleiche Proportionen über alle Figuren, damit die Bilder zusammenpassen.
- Die Figur soll zu ihrer Spielfigur passen: Haarfarbe, Kleidung und Farben aus `game/src/03_cast.js` (Kommentarzeile über jeder Figur und `legend`/`cols`) übernehmen, im Porträt aber feiner ausgearbeitet.

## Figuren

| id | Wer | Aussehen |
|---|---|---|
| `marko` | Marko Vuković, 33, Übersetzer aus Sarajevo, lebt seit 1994 in Split | kurzes dunkles Haar, Bartschatten, müde dunkle Augen, schmales Gesicht, dunkler Wollmantel über dunklem Pullover; trocken, wach, verschlossen |
| `mala` | Mala, Geist, wirkt 17–18, Kleidung der frühen Neunziger | dunkles Haar im lockeren Zopf über der Schulter, einzelne Strähnen im Gesicht, übergroße Jeansjacke mit hochgeschlagenem Kragen, handgestrickter grauer Schal; ernster, direkter Blick, große Augen, blass |
| `ivka` | Ivka Perić, Geist, 85, wartet an der Mole | schwarzes Kopftuch, langer schwarzer Mantel, tiefe Falten, eingefallene Wangen, wache Augen; stolz, geduldig |
| `zdenka` | Zdenka Bašić, 78, Nachbarin in Veli Varoš | graues Haar im Knoten, ganz in Schwarz (Witwe), scharfe Gesichtszüge, Brille ist nicht da; scharfe Zunge, weiches Herz |
| `mladen` | Mladen Šimić, 63, Beamter im Hafenamt seit 1975 | Halbglatze mit grauem Haarkranz, Schnurrbart, Brille, weißes Hemd, dunkle Weste; müde, korrekt |
| `dinko` | Dinko Matić, 46, Fischer | Wollmütze, grauer kurzer Bart, wettergegerbte Haut, grüner Pullover; trägt Schuld, wortkarg |
| `sanja` | Sanja Lozić, 32, Wirtin der Bar „Bura“ | kurzes schwarzes Haar, schwarzes Shirt, Schürzenträger; wach, beschützend |
| `stipe` | Stipe, 70+, Kartenspieler | Schiebermütze, faltiges Gesicht, Stoppeln, alte Jacke (Khaki/Grau) |
| `frane` | Frane, 70+, Kartenspieler | Glatze mit weißem Haarkranz, buschige weiße Brauen, Strickjacke |
| `nina` | Nina Barić, 31, Malerin und Rahmenmacherin | kastanienbraunes Haar, rotes Tuch im Haar, senfgelber Pullover, Jeansschürze; müde, aufmerksam |
| `mira` | Mira, 61, Kiosk am Fährterminal | weinrote Locken, Brille an einer Kette, lila Strickjacke; neugierig, gutmütig |
| `ljerka` | Ljerka Lalić, 56, Besitzerin des Hotel Palma | hellgrauer Haarknoten, Brille, Strickjacke über Bluse; stolz, müde, verschlossen |
| `ljerkaNight` | dieselbe Ljerka nachts | Haar offen bis zur Schulter, Morgenmantel; sonst wie `ljerka` (gleiche Gesichtszüge, gern gemeinsamer Code) |
| `luka` | Luka Radić, Geist, 20, Gitarrist, 1999 | strubbeliges Haar, offenes Flanellhemd über weißem T-Shirt, junges Gesicht, Vorfreude in den Augen |
| `bruno` | Bruno Lalić, Geist, 66, Nachtportier | Portiersmütze, gepflegter Schnurrbart, flaschengrüne Uniform mit Messingknöpfen; höflich, würdevoll, ein wenig verloren |
| `jakov` | Jakov, Geist, Totengräber von Sustipan (gest. 1959) | Schiebermütze, Weste über Hemd, wettergegerbt, freundlich |

## Prüfen

```
node game/build.js --out <dein-scratchpad>/build            # baut das Spiel in einen eigenen Ordner (nie nach web/)
node game/tools/portraitsheet.js --html <dein-scratchpad>/build/index.html --out <dein-scratchpad>/blatt.png --ids nina,mira --scale 3
```

Das Blatt zeigt je Figur: ruhig, spricht, blinzelt (dunkler Grund), ruhig auf hellem Grund, eingefärbt (wie Geister erscheinen), auf blauem und hellem Grund, und eine Probe mit Textkasten.
