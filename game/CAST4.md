# Besetzung – MALA, Kapitel 4: München

**Wofür:**
- die Spielfiguren in `game/src/14_k4_cast.js` (bei Bedarf auch `14_k4_cast_b.js`), im Format wie `game/src/14_k3_cast.js`, `14_k3_cast_b.js` und `03_cast.js`;
- die gemalten Porträts in `game/src/portraits/<id>.js`, im Format nach `game/PORTRAIT_API.md`.

Die IDs und Animationsnamen sind fest. Die Skripte verwenden genau diese Namen. Grundlage: `KAPITEL4_KONZEPT.md` Abschnitt 5 und `game/K4_SPEC.md`.

## Allgemein

**Zeit:** München, Weihnachten bis Neujahr 2011. Es ist Winter mit Schnee.
- **Draußen:** Mäntel, Daunen- und Steppjacken, Schals, Mützen, Handschuhe.
- **Drinnen:** Pullover, Strickjacken.

**Gesichter** haben Alter und Charakter.

**Verboten:**
- Trachten jeder Art: kein Janker, kein Dirndl, keine Lederhose, kein Gamsbart;
- religiöse oder nationale Zeichen: kein Kreuz, keine Fahnen, keine Wappen, kein Weihnachtsschmuck mit religiösen Figuren.

**Kopftücher** gibt es nur bei Gerda: ein buntes Seidentuch gegen den Wind, wie in den Sechzigern, unter dem Kinn geknotet.

**Größen:**
- Erwachsene wie in Kapitel 3, etwa 48 px.
- **Kinder:** Mia (7) etwa 34 px, Niko (3) etwa 26 px. Sie sind eigene Figuren mit kürzeren Knochen und größerem Kopf im Verhältnis, nicht einfach verkleinert. Wenn das Rig das nicht hergibt, nimm `scale` im Aktor (`05_engine.js`, `o.scale`) und schreib es in den Bericht.
- **Sitzende** sitzen in der allgemeinen Sitzhöhe wie in Kapitel 3 (Hüfte 13 px über dem Boden).

**Dinge in der Hand** über `M.HELD` mit dem Vorsatz `k4a_`. Rauch und Dampf zeichnet `after()` nach dem Umriss (wie in `14_k3_cast.js` beschrieben).

## Kostüme

Eine Figur kann mehrere Kostüme haben. **Jedes Kostüm ist eine eigene Figur-ID** mit denselben Animationen, wie `ljerka` und `ljerkaNight` in `03_cast.js`. Das Gerüst verbindet die Porträts:

```js
M.PORTRAIT_ALIAS = {jasnaW:'jasna', jasnaC:'jasna', anaC:'ana', miaC:'mia', nikoC:'niko'};
```

Du malst das Porträt nur einmal, unter der Grund-ID.

## Lebende (mit Porträt)

### Familie

**`jasna`, `jasnaW`, `jasnaC`: Jasna Vuković, 58, Pflegehelferin**
- **Aussehen:** klein, kräftig, aufrecht. Kurzes, dunkelbraun gefärbtes Haar, am Scheitel grauer Ansatz. Müde, wache Augen mit Fältchen, schmale Lippen, kleine goldene Ohrstecker.
- **Kostüme:**
  - `jasna` (daheim und bei Ana): weinrote Strickjacke über heller Bluse, dunkelgraue Hose, flache dunkle Schuhe;
  - `jasnaW` (Arbeit im Heim): hellblauer Kasack mit Namensschild, weiße Hose, weiße Clogs;
  - `jasnaC` (draußen und Silvesternacht): **dunkelblauer Wollmantel** bis übers Knie, grauer Schal, dunkle Stiefel, Handtasche.
- **Animationen:**
  - `cook` (rührt am Herd, Seitenansicht);
  - `sit` (am Tisch, Hände um eine Tasse);
  - `arms` (verschränkt die Arme);
  - `look` (sieht aus dem Fenster, Hand am Rahmen; wichtig für Silvester);
  - `wipe` (wischt sich mit dem Handrücken über die Augen, kurz);
  - `give` (reicht etwas mit beiden Händen; Pantoffeln, Dose);
  - `push` (`jasnaW`: schiebt einen Rollstuhl oder Wäschewagen; ein Griff genügt);
  - `phone` (Handy am Ohr).

**`ana`, `anaC`: Ana Brandl, geb. Vuković, 27, Logopädin**
- **Aussehen:** schlank, mittelgroß. Dunkelbraunes Haar, schulterlang, meist im lockeren Pferdeschwanz. Jasnas Augen, gerade Brauen, schneller Blick.
- **Kostüme:**
  - `ana` (daheim): senfgelber Strickpullover, Jeans, Hausschuhe aus Filz;
  - `anaC` (draußen): **dunkelgrüner Parka** mit Kapuze, gestreifte Wollmütze, Schal, Handschuhe, Stiefel.
- **Animationen:**
  - `cook` (schneidet an der Küchenzeile);
  - `sit`;
  - `arms`;
  - `phone` (tippt am Handy; Anas SMS);
  - `hug` (umarmt jemanden: offene Arme nach vorn, für die Ankunft um 00:40 und den Epilog);
  - `point` (zeigt mit dem Finger, streng);
  - `carry` (trägt Niko auf der Hüfte, als eigene Haltung mit Kind: zeichne Niko in Kleinform mit).

**`tobias`: Tobias Brandl, 33, Lehrer**
- **Aussehen:**
  - groß, schlaksig, kurzes hellblondes Haar, runde Brille, glatt rasiert, freundlich;
  - Norwegerpullover (blau-weiß, Schneeflocken- und Rentiermuster, nichts anderes), Cordhose, Hausschuhe.
- **Animationen:** `read` (liest in einem kleinen Sprachbuch, Lippen bewegen sich), `sit`, `cheers` (hebt ein Glas), `wave`.

**`mia`, `miaC`: Mia Brandl, 7**
- **Aussehen:** zwei braune Zöpfe, Zahnlücke.
- **Kostüme:**
  - `mia`: roter Pullover mit einem aufgenähten Stern (Stoff, kein Symbol), Strumpfhose, Rock;
  - `miaC`: lila Schneeanzug, Bommelmütze, Fäustlinge.
- **Animationen:** `play` (kniet bei der Holzeisenbahn), `sled` (`miaC`: zieht einen Schlitten an der Schnur), `jump` (hüpft vor Freude), `sit`.

**`niko`, `nikoC`: Niko Brandl, 3**
- **Aussehen:** blonde Locken, runde Wangen.
- **Kostüme:**
  - `niko`: blaue Latzhose über gestreiftem Shirt, Stoppersocken;
  - `nikoC`: roter Schneeanzug, Mütze mit Ohrenklappen.
- **Animationen:**
  - `stare` (sieht lange nach oben auf etwas Unsichtbares, Mund offen; er sieht Mala);
  - `wave` (winkt, die ganze Hand);
  - `point` (zeigt auf etwas);
  - `play` (sitzt am Boden);
  - `hide` (versteckt das Gesicht an einem Bein: für Ana oder Jasna, als Haltung mit einem gemalten Hosenbein reicht).

### Haus, Stadt, Bahnhof

**`huber`: Frau Huber, 81, Nachbarin**
- **Aussehen:** klein, rund. Weißes, frisch gelegtes Haar, Brille an einer Kette, rosige Wangen. Geblümte Kittelschürze über einer grünen Strickjacke, Filzpantoffeln.
- **Animationen:** `talk` (redet mit beiden Händen), `key` (hält einen Schlüssel hin), `pet` (beugt sich zur Katze).

**`mucki`: Mucki, Frau Hubers Katze** (Tier, eigene kleine Figur wie der Hund `pas` aus Kapitel 3)
- **Aussehen:** dick, grau getigert, weiße Pfoten.
- **Animationen:**
  - `sit`;
  - `watch` (folgt etwas mit dem Kopf: Mala);
  - `walk`;
  - `arch` (Buckel, Schwanz hoch; kurz, wenn Mala zu nah kommt).

**`wastl`: Wastl, 72, Taxifahrer am ZOB**
- **Aussehen:**
  - groß, breit, rotes Gesicht, buschiger weißer Schnurrbart;
  - Schiebermütze, dunkelgrüne Steppjacke, Wollschal, Cordhose, schwere Schuhe;
  - gemütlich, spöttisch.
- **Animationen:** `lean` (lehnt am Taxi, Arme verschränkt), `laugh` (lacht, Bauch wackelt), `call` (ruft, Hand am Mund: „Feierabend, Hansi!“), `wave`.

**`wimmer`: Frau Wimmer, 66, Bahnhofsmission**
- **Aussehen:**
  - mittelgroß, grauer Bob, Lesebrille auf der Nase;
  - fliederfarbene Bluse, dunkelblaue Fleeceweste, Namensschild an einem Band (nur Schrift);
  - feste Schuhe, ernst, warm.
- **Animationen:** `pour` (schenkt Tee aus dem großen Kessel ein), `write` (schreibt an der Theke), `arms`, `hold` (hält einen Zettel oder Brief vor sich).

**`enzo`: Signor Enzo Caruso, 78, Bar Sport**
- **Aussehen:**
  - klein, rund, Glatze mit weißem Haarkranz, dicke schwarze Brille, weißer Schnurrbart;
  - weißes Hemd, weinrote Strickweste, Hosenträger; weinerlich und stolz.
- **Animationen:** `espresso` (bedient die Maschine, Dampf in `after()`), `polish`, `point` (zeigt auf die Fotowand), `wipe` (wischt sich die Augen mit einem Taschentuch).

**`obermaier`: Herr Obermaier, 54, Städtische Friedhöfe**
- **Aussehen:**
  - hager, akkurater Seitenscheitel, grauer Schnurrbart, Lesebrille;
  - beiges Hemd mit dunkler Krawatte, graue Strickjacke; genau, ohne Wärme, nicht böse.
- **Animationen:** `write` (sitzend), `stamp` (stempelt, sitzend), `phone` (sitzend, Hörer am Ohr), `file` (blättert in einer Akte, sitzend).

### Heim

**`ertl`: Frau Ertl, 52, Pflegedienstleitung**
- **Aussehen:**
  - groß, kurzes blondgraues Haar, randlose Brille, schmale Lippen;
  - weißer Kasack, darüber eine dunkelrote Strickjacke, Klemmbrett; bestimmt, müde, menschlich.
- **Animationen:** `write` (schreibt auf dem Klemmbrett, stehend), `arms`, `sit` (am Tisch im Gemeinschaftsraum).

**`kraus`: Herr Kraus, 61, Hausmeister**
- **Aussehen:**
  - untersetzt, grauer Stoppelbart, Brille auf der Stirn;
  - graublauer Hausmeisterkittel, großer Schlüsselbund am Gürtel, Arbeitsschuhe; brummig.
- **Animationen:** `key` (dreht einen Schlüssel an einem Bedienfeld an der Wand, in Augenhöhe), `fix` (schraubt mit einem Schraubenzieher), `shrug` (zuckt mit den Schultern).

**`kevin`: Kevin, 26, Pfleger**
- **Aussehen:**
  - groß, kräftig, kurzes dunkles Haar mit Gel, ein Ohrstecker;
  - hellgrüner Kasack, weiße Hose, weiße Turnschuhe; freundlich, praktisch.
- **Animationen:** `push` (schiebt einen Wäschewagen), `eat` (sitzt an der Theke, isst eine Brezel: Silvesternacht), `point` (zeigt den Flur hinunter).

**`alois`: Alois Lechner, 89, Bewohner, früher Trambahnfahrer**
- **Aussehen:**
  - groß, hager, gebeugt, große Ohren, große Hände;
  - weißes Haar, nach hinten gekämmt, glatt rasiert, wässrige blaue Augen;
  - beige Strickjacke über kariertem Hemd, Cordhose, braune Hausschuhe.
- **Animationen:**
  - `sit` (auf der Bank oder im Sessel, Hände auf den Knien);
  - `wait` (steht vor der Aufzugtür, Hände hinter dem Rücken, wippt leicht);
  - `shiver` (schaudert, zieht die Schultern hoch, als ginge ein Fenster auf);
  - `call` (ruft „Die Gerda!“, Kopf hoch);
  - `bed` (im Pflegebett halb aufgerichtet: zeichne Kissen und Decke mit; Füße bei `actorPos`);
  - `hold` (hält die Thermoskanne mit beiden Armen an der Brust, sitzend oder im Bett, mit `S.thermos`);
  - `drive` (seine Hände führen eine unsichtbare Kurbel: Trambahnfahrer).

**Ohne Porträt im Heim**
- `pflege1`: Pflegerin, um 40, dunkler Pferdeschwanz, hellblauer Kasack. Animationen: `pour` (Kaffeekanne), `push`.
- `empfang`: Empfang, um 45, Mann mit grauem Pullover und Brille. Animation: `sit` (hinter der Theke).

## Lebende ohne Porträt (nur Figur)

| id | Wer | Aussehen | Animationen |
|---|---|---|---|
| `kioskg` | Kioskfrau an Gleis 11, um 58 | blond gefärbt, hochgesteckt, dicke Strickjacke, Fingerhandschuhe; steht hinter der Theke | `read`, `sell` (reicht eine Zeitung) |
| `gast1` | Gast der Bahnhofsmission, um 65 | grauer Vollbart, Wollmütze, abgetragener Parka; würdig, nicht karikiert | `sit`, `drink` (Tee, sitzend) |
| `gast2` | Reisende in der Bahnhofsmission, um 25 | kurze schwarze Haare, großer Rucksack neben sich, gelbe Daunenjacke | `sit`, `phone` |
| `gast3` | alter Mann in der Bar Sport, um 80 | Hut, Mantel, Zeitung, sehr dünn | `read` (sitzend) |
| `beamtin` | Schalter im Konsulat, um 40 | dunkles Haar im Knoten, dunkler Blazer; sitzt hinter Glas | `write` (sitzend), `stamp` |

## Geister (mit Porträt)

**`hansi`: Johann „Hansi“ Kirchmaier († 1998, wirkt 63), Fahrkartenverkäufer**
- **Aussehen:**
  - mittelgroß, Bauch, schütteres graues Haar, quer gekämmt, Bleistift hinter dem Ohr, Hornbrille;
  - grauer Arbeitskittel, eine **lederne Wechselgeldtasche** am Gürtel, Ärmelschoner; gemütlich, stur.
- **Animationen:**
  - `wait` (steht, Daumen in der Tasche);
  - `count` (zählt Münzen aus der Tasche in die Hand);
  - `look` (sieht auf eine Armbanduhr);
  - `wave` (der Abschied: hebt die Hand, „Servus, Burschi“);
  - `go` (dreht sich um und geht: kurze Folge, dann löst er sich auf).
- **Löst sich auf** über die Engine (`alpha`), du lieferst nur die Bewegung.

**`sepp`: Giuseppe „Peppino“ Ruggiero, genannt Sepp († Dezember 2011, wirkt 72), Gepäckträger Nr. 17**
- **Aussehen:**
  - schlank, **sehr gerader Rücken**, schmales Gesicht, kurzes weißes Haar, dünner weißer Schnurrbart, dunkle Augen, buschige Brauen;
  - eine **Schirmmütze mit Messingschild „17“**, die Ziffern als zwei Pixel, lesbar im Porträt;
  - eine dunkelblaue Uniformjacke mit Messingknöpfen, an Ellbogen und Saum blank gewetzt;
  - dunkle Hose, schwarze, glänzend geputzte Schuhe.
- **Animationen:**
  - `wait` (steht am Prellbock, Hände hinter dem Rücken);
  - `carry` (trägt einen Pappkoffer: Haltung in der Zwischenwelt und als Erinnerung; der Koffer als `k4a_case`);
  - `cap` (tippt an den Mützenschirm, Gruß);
  - `point` (zeigt auf die Gleise);
  - `sit` (auf einem Koffer oder einer Bank);
  - `turn` (wendet sich ab, Schultern hoch: wenn man ihn nach dem Namen fragt).

**`gerda`: Gerda Lechner († 3. September 2011, wirkt 84)**
- **Aussehen:**
  - klein, aufrecht, rundes freundliches Gesicht, weiße Löckchen unter einem **blauen Seidenkopftuch mit weißen Tupfen**, unter dem Kinn geknotet;
  - ein langer kamelfarbener Wintermantel, dunkle Handschuhe, eine Handtasche am Arm;
  - **eine grüne Thermoskanne aus Blech** mit Becherdeckel (`k4a_thermos`).
- **Animationen:**
  - `wait` (steht mit der Kanne in beiden Händen; Haltung am Depot und in der Zwischenwelt);
  - `sit` (auf der Bank oder dem Stuhl, die Kanne auf dem Schoß);
  - `hand` (beugt sich vor und legt die Hand auf eine Hand neben sich: ein Arm nach vorn unten);
  - `step` (steigt eine hohe Stufe hinauf: die Zwischenwelt, kurze Folge);
  - `give` (reicht die Kanne mit beiden Händen nach vorn).

## Geisterfarben

Für `hansi`, `sepp` und `gerda` je einen Eintrag in `M.GHOST_OVR` (wie die Einträge für `bato` und `mate` in `14_k3_cast_b.js`) und in `M.PORTRAIT_GHOSTS`. Kleidung bleibt erkennbar:
- **Hansi:** Kittel grau, Tasche braun;
- **Sepp:** Jacke dunkelblau, Messing-Mütze;
- **Gerda:** Mantel kamelbraun, Tuch blau, Kanne grün.

Die Kanne von Gerda bleibt auch im Geisterbild deutlich grün. Sie wird später stofflich und soll wiedererkannt werden. In der Hand von Alois ist sie ein normaler Gegenstand (`k4a_thermos` in natürlichen Farben).

## Bekannte Figuren, die wiederkommen
- `marko`, `mala`: unverändert. Mala trägt weiter ihre Dose mit den zwei Fahrscheinen; sie ist ihr letzter Geistergegenstand und wird in Kapitel 5 gebraucht.
- `davor`, `lena` (Kapitel 3, `14_k3_cast*.js`), unverändert; Davor im Trenchcoat, Lena im pinken Anorak passen in den Winter.
- Nur am Telefon (keine Figur, nur Sprechfarbe): `kolar`, `nada`, `jela` (vorhanden), neu `carmela`, `rosa`.

## Sprechfarben (`M.CAST_COLORS`, nur ergänzen, wie am Ende von `14_k3_cast.js`)
- `jasna`, `jasnaW`, `jasnaC`: ein warmes Rotbraun;
- `ana`, `anaC`: Senf;
- `tobias`: Hellblau;
- `mia`, `miaC`: Rosa;
- `niko`, `nikoC`: Hellgelb;
- `huber`: Grün;
- `wastl`: Ocker;
- `wimmer`: Flieder;
- `enzo`: Weinrot;
- `obermaier`: Grau;
- `ertl`: Rot;
- `kraus`: Graublau;
- `kevin`: Hellgrün;
- `alois`: Beige;
- `pflege1`, `empfang`, `kioskg`, `gast1`, `gast2`, `gast3`, `beamtin`: unauffällige Töne;
- `carmela`: Orange;
- `rosa`: Rosé;
- Geister `hansi`, `sepp`, `gerda`: Geistertöne wie `bato` und `mate`.

## Porträts (56 × 64, nach rechts blickend, Varianten n/o/b)

**Für wen:** `jasna`, `ana`, `tobias`, `mia`, `niko`, `huber`, `wastl`, `wimmer`, `enzo`, `obermaier`, `ertl`, `kraus`, `kevin`, `alois`, `hansi`, `sepp`, `gerda`.

**Vorbilder:** `portraits/nada.js`, `portraits/zlata.js`, `portraits/kolar.js`, `portraits/mate.js` (Geist mit Hut).

**Je Figur:**
- **Jasna:** Strickjacke, die Ohrstecker, die Müdigkeit. Mutter von Marko, Ähnlichkeit in Augen und Mund mit `portraits/marko.js`.
- **Ana:** Jasnas Augen, Pferdeschwanz, Pullover.
- **Tobias:** runde Brille, Norwegerkragen.
- **Mia:** Zöpfe, Zahnlücke in `o`.
- **Niko:** Locken, sehr runde Wangen, große Augen.
- **Frau Huber:** Brillenkette, Löckchen.
- **Wastl:** Schiebermütze, Schnurrbart.
- **Frau Wimmer:** Lesebrille.
- **Enzo:** dicke Brille, Schnurrbart.
- **Herr Obermaier:** Seitenscheitel, Krawatte.
- **Frau Ertl:** randlose Brille.
- **Kraus:** Brille auf der Stirn, Stoppeln.
- **Kevin:** Ohrstecker.
- **Alois:** große Ohren, wässrige Augen, Strickjacke.
- **Hansi:** Bleistift hinter dem Ohr, Hornbrille.
- **Sepp:** Mütze mit „17“, Schnurrbart.
- **Gerda:** Kopftuch mit Tupfen, Kanne am Bildrand angeschnitten.

**Kinder:** größerer Kopf im Bildausschnitt, damit sie nicht wie kleine Erwachsene wirken.
