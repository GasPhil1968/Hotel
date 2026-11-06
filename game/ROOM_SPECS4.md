# Raumvorgaben (Kunst) – MALA, Kapitel 4: München

Grundlage: `KAPITEL4_KONZEPT.md` (4.4 Orte, 4.5 Handlung) und `game/K4_SPEC.md` (Phasen, Wetter, Zustände). Zeit: 24. Dezember 2011 bis 1. Januar 2012.

## Allgemein

**München im Winter 2011**
- **Schnee:** Es liegt Schnee, nicht malerisch, sondern städtisch: weiß auf Dächern, Fensterbrettern und Autos, grau und zertreten an Straßenrändern.
- **Altbauten im Westend:** vier- bis fünfstöckig, mit Stuck, hohe Fenster, Balkone mit Gittern, Hinterhöfe mit Teppichstangen.
- **Bahnhof:** Der Hauptbahnhof ist ein Kopfbahnhof. Eine große Halle mit Stahldach und Glas, Prellböcke, viele Gleise nebeneinander, darüber Anzeigetafeln.
- **Trambahn:** Sie ist blau-weiß (2011: blau mit weißem Band).
- **Taxis** sind hellelfenbein (cremeweiß).
- **Weihnachtsschmuck** schlicht: Lichterketten, Tannenbäume, Sterne aus Papier oder Stroh in Fenstern. **Keine Krippen, keine Kreuze, keine religiösen Zeichen.**
- **Keine Fahnen, keine Wappen,** auch nicht am Konsulat.
- **Schrift auf Schildern** ist deutsch (mit Umlauten über `M.microText`, wo es geht), an der Bar italienisch.

**Für jeden Raum gilt wie in Kapitel 1 bis 3**
- Datei `game/src/rooms/art/<id>.js` nach `game/ART_API.md`. Vorbilder sind die Räume aus Kapitel 3, etwa `ostbus.js`, `herberge.js`, `zimmer.js`, `vulkanizer.js`, `vermisst.js`.
- **Die Spot-IDs sind fest.** Die Logikdateien benutzen genau diese Namen.
- Jeder Spot braucht ein Rechteck in `spots`, die meisten einen Standpunkt in `stands`.
- NPCs stehen mit der Fußposition aus `actorPos` ([x, y, Blick]).
- `entries` je Herkunftsraum, `start` für den ersten Aufbau.

**Phasen** für `roomshot.js --phase` (in `K4_SPEC.md` Abschnitt 3)
- Tag: `k4_pro` (Schneefall, `snow`), `k4_d1` (klar, `snowlie`), `k4_d2` (grau, Tauwetter, `thaw`: nasser grauer Schnee, Pfützen), `k4_d3` (Schneefall), `k4_d4` (klar), `k4_d5` (**Nebel**, `fog`: weiches Grau, ferne Dinge verschwinden), `k4_epi` (Sonne auf Schnee, `sun`).
- Nacht: `k4_pro_n`, `k4_d1_n`, `k4_d2_n`, `k4_d4_n`, `k4_d5_n` (Nebel), `k4_fin_a`, `k4_fin_n` (klar, Frost, Feuerwerk).
- **Neue Wetter-Schlüssel:** `snow`, `snowlie`, `thaw`, `fog`, `sun`. `M.scn.weather(GS)` liefert sie aus der Phase.
  - Fallender Schnee kommt in `front` (wie Regen, nur langsam und weich, Flocken in `s5`/`s6`/`l0`).
  - Nebel kommt als halbtransparent wirkende Dither-Schleier in `front` oder `paint`.
  - Unbekannte Schlüssel wie `snowlie` behandeln.
- **Feuerwerk** in `k4_fin_n` und am Ende von `k4_fin_a` (Zustand `S.fireworks`, nur draußen oder durch Fenster sichtbar): in `dynamic` kurze Lichtbüschel und Funkenregen am Himmel. Sparsam, nie das ganze Bild. Zeitversetzt über `view.t`.

**Innen** sind Fenster bei Nacht gelb erleuchtet, gegenüberliegende Fenster ebenso.

**Malas Geistersicht** (`ghost`-Ebene): zart, Farben `x0–x6`, `v0–v5`. Wo etwas für ein Rätsel nötig ist, steht es beim Raum.

**Figurenhöhe** etwa 48 px (Kinder: Mia etwa 32, Niko etwa 26). Laufflächen meist y≈108–140.

**Malas Leine** zeichnet die Engine (in Kapitel 4 meist keine).

---

## zob — ZOB an der Hackerbrücke · Breite 480, scrollend
- **Phasen:** `k4_pro` (Ankunft, morgens, Schneefall).
- **Bild:**
  - Der Fernbusbahnhof von 2009: lang gestrecktes modernes Gebäude, oben eine geschwungene, helle Dachkante, unten Glas und Läden in einer Passage, davor Bussteige mit Nummern (Schilder „Bussteig 14“ und so weiter).
  - Ein Reisebus steht da, weiß mit blauem Streifen, Zielschild „SARAJEVO – MÜNCHEN“ (`S.busIn`).
  - Links am Rand ein **Betonpfeiler**, an dem ein heller Fleck im Pflaster zeigt, wo früher eine Bude stand (`pillar`).
  - Rechts der **Taxistand** mit einem cremeweißen Mercedes. Weiter rechts der Aufgang zur **Hackerbrücke**: Stahlbögen, angeschnitten.
  - Im Hintergrund das Dach der Gleisanlagen und in der Ferne der Hauptbahnhof.
  - Schneematsch, Fahrspuren, zwei gemalte Reisende mit Koffern.
- **Lauffläche:** y≈112–140, x 6–474.
- **Spots:**
  - `exit` (linker Rand, zum Stadtplan);
  - `to_bridge` (rechter Rand, Treppe zur Hackerbrücke);
  - `bus`, `board` (elektronische Abfahrtsanzeige mit Zeilen), `pillar` (Pfeiler mit dem Fleck), `taxi`, `bench`;
  - `shops` (Ladenpassage, geschlossen, Heiligabend);
  - `hbf_view` (Blick zum Hauptbahnhof), `snow` (Schneehaufen).
- **actorPos:** `wastl` (am Taxi lehnend, Blick 'L'), `hansi` (Geist, am Pfeiler, Blick 'F'), `mala` (neben der Bustür, Blick 'R').
- **entries:** `map` (links, Blick 'R'), `hacker` (rechts, Blick 'L'). **start:** neben der Bustür, Blick 'R'.
- **Zustände:** `S.busIn` (Bus steht da), `S.hansi` (Hansi ist da).
- **Geistersicht:** Am Pfeiler steht der Umriss einer kleinen Bude mit Schalterfenster, „FAHRKARTEN“ in Geisterschrift.
- **dynamic:** Schneefall wird in `front` gezeichnet, Abgas am Bus, Blinklicht am Taxi.

## hacker — Hackerbrücke · Breite 400
- **Phasen:** `k4_pro` (Durchgang), `k4_d5_n` (**Nacht, Nebel**: Schlüsseldialog 2).
- **Bild:**
  - Die historische **Stahlbogenbrücke** über die breite Gleisanlage: genietete Bögen beidseits, ein Geländer aus Stahl, Gehweg mit Schnee, Laternen.
  - Darunter, tief, viele Gleise nebeneinander, Oberleitungen, ein Zug fährt ein (Lichter).
  - In der Ferne die Halle des Hauptbahnhofs mit Lichtern.
  - Bei Nebel verschwimmen die Ferne und die Lichter.
- **Lauffläche:** Gehweg y≈114–136, x 6–394.
- **Spots:** `exit` (links, zurück zum ZOB und zum Stadtplan), `railing` (Geländer, Mitte), `tracks` (die Gleise unten), `train`, `arch` (Stahlbogen), `hbf_view`, `lamp`.
- **actorPos:** `mala` (am Geländer, in der Nacht **auf** dem Geländer sitzend: gib dafür einen eigenen Punkt `mala_rail` an, y auf Geländerhöhe, Blick 'L'), `marko_rail` (Standpunkt neben ihr, Blick 'R').
- **entries:** `zob` (links, Blick 'R'), `map` (links). **start:** links.
- **dynamic:**
  - Züge fahren unten ein und aus, als Lichterreihen.
  - Funken an der Oberleitung, selten.
  - Nebel wogt (`fog`).
  - Schneefall bei `k4_pro`.

## jhaus — Jasnas Haus, Treppenhaus (Westend) · Breite 320, Innenraum
- **Phasen:** alle außer `k4_fin_a`.
- **Bild:**
  - Treppenhaus eines Altbaus: Terrazzoboden, Briefkästen mit Namensschildern (eines „VUKOVIĆ“, eines „HUBER“), ein Klingelbrett.
  - Eine Holztreppe mit gedrechseltem Geländer führt nach oben.
  - Die Wohnungstür von Frau Huber mit Fußmatte und Weihnachtsstern aus Stroh.
  - Ein Fenster mit Bleiglas auf Halbstock, ein Kinderwagen unter der Treppe.
  - Die Katze sitzt auf einer Stufe.
- **Lauffläche:** y≈114–138, x 10–310.
- **Spots:**
  - `exit` (Haustür unten links, zur Straße und zum Stadtplan);
  - `up` (Treppe nach oben zu Jasna);
  - `huber_door`, `mailboxes`, `bells`, `window`, `pram`, `cat`.
- **actorPos:** `huber` (in ihrer Tür, Blick 'L'), `mucki` (Katze auf der Stufe, Blick 'F').
- **entries:** `map` (unten an der Haustür, Blick 'R'), `jwohnung` (oben an der Treppe, Blick 'L'). **start:** an der Haustür.
- **Zustände:** `S.hubOpen` (Tür von Frau Huber offen).
- **Geistersicht:** Auf der Treppe liegt ein Abdruck vieler Schritte nach oben, abends am dichtesten (Jasna, achtzehn Jahre).

## jwohnung — Jasnas Wohnung: Flur und Wohnküche · Breite 400, Innenraum
- **Phasen:** alle außer `k4_fin_a` und `k4_fin_n`.
- **Bild:**
  - **Links der Flur:** Wohnungstür, davor **ein Paar Herrenpantoffeln**, gerade gestellt (`S.slippers`). An der Wand ein gerahmtes **Foto**: ein Mann mit Schnurrbart lehnt an einem roten Kleinwagen (Zastava 101), auf der Motorhaube sitzt ein kleines Mädchen. Eine Garderobe.
  - **Rechts die Wohnküche:**
    - eine Küchenzeile mit Herd (darauf kann die Džezva stehen: `S.dzezva`);
    - ein Tisch mit Wachstuch und vier Stühlen;
    - ein Regal mit Ordnern, einer beschriftet „VRATNIK – KROV“;
    - ein kleines Sofa (zu kurz) mit Wolldecke;
    - ein Fernseher;
    - ein Kalender mit Kinderzeichnungen;
    - eine Tür zum Schlafzimmer;
    - ein Fenster zur Straße. Gegenüber Altbaufenster, eines davon bei Nacht hell, eine Frau bügelt (`S.ironing`).
  - Ein kleiner Tannenbaum auf dem Fensterbrett (Ana hat ihn gebracht).
- **Lauffläche:** y≈114–138, x 10–390.
- **Spots:**
  - Flur: `door` (Wohnungstür, zum Treppenhaus), `slippers`, `photo`, `coats`;
  - Küche: `stove`, `table`, `shelf`, `folder` (Ordner „VRATNIK – KROV“), `sofa`, `tv`, `calendar`;
  - Ausgang und Fenster: `bedroom` (Tür, zum Schlafzimmer), `window`, `tree`.
- **actorPos:** `jasna` (am Herd, Blick 'L'), `jasna_table` (am Tisch sitzend, Blick 'R'), `mala` (am Fenster, Blick 'L'), `ana` (am Tisch, Epilog, Blick 'L').
- **entries:** `jhaus` (Tür, Blick 'R'), `jschlaf` (Schlafzimmertür, Blick 'L'). **start:** im Flur. **stands** für `sofa` (zum Schlafen).
- **Zustände:** `S.jasnaHome` (Jasna ist da), `S.slippers` (true bis zum Epilog), `S.box` (die Kiste steht offen auf dem Tisch, Epilog), `S.ironing`, `S.dzezva`.
- **Geistersicht:**
  - Auf den Pantoffeln liegt ein Glanz, als würde man sie jeden Tag berühren.
  - Am Fenster ein Abdruck einer Hand am Rahmen, in Kopfhöhe einer kleinen Frau.
- **dynamic:**
  - Die Herdplatte glüht, wenn gekocht wird.
  - Schneefall vor dem Fenster in Schneephasen.
  - Fernseher flimmert nur, wenn er läuft (`S.tv`).

## jschlaf — Jasnas Schlafzimmer · Breite 320, Innenraum
- **Phasen:** `k4_d1_n` (Nacht: Malas Kiste), Tagesphasen (zugänglich).
- **Bild:**
  - Ein schmales Zimmer: Bett mit gehäkelter Decke, Nachttisch mit Lampe und einem kleinen Hochzeitsfoto, ein Stuhl mit einem hellblauen Pflegekittel.
  - Ein **Kleiderschrank** mit zwei Türen. In der Geistersicht und für Mala sieht man oben im Schrank eine **Holzkiste** mit Schloss (`box`).
  - Ein Fenster mit Vorhang, Schnee draußen.
- **Lauffläche:** y≈114–138, x 20–300.
- **Spots:** `door` (zurück in die Wohnküche), `wardrobe`, `box` (Kiste im Schrank; Rechteck auf der Schranktür oben), `bed`, `nightstand`, `smock`, `window`.
- **actorPos:** `mala` (vor dem Schrank, Blick 'L').
- **entries:** `jwohnung` (Tür, Blick 'R'). **start:** an der Tür.
- **Geistersicht:**
  - Durch die Schranktür hindurch ist die Kiste sichtbar, umgeben von Nachhall (blasse Schrift und Stempelformen). Sie ist für Mala lesbar.
  - Am Bett ein ruhiger Abdruck.

## ana — Anas Wohnung in Giesing · Breite 480, Innenraum
- **Phasen:** `k4_pro_n` (Heiligabend), `k4_d1` (morgens? nicht nötig), `k4_d2` (Mittag: Ana allein, Praxispause), `k4_d5` (Freitag), `k4_fin_a` (Silvester), `k4_fin_n` (nach Jasnas Weggang).
- **Bild:**
  - **Wohnküche** einer Familie: großer Holztisch, eine Küchenzeile, Kinderzeichnungen am Kühlschrank.
  - Ein **Tannenbaum** mit Lichterkette und Strohsternen (Weihnachten, auch Silvester noch da). Spielzeug in einer Ecke (Holzeisenbahn).
  - Eine **Garderobe** mit Mänteln (Jasnas dunkelblauer Mantel: `S.coatGone` = er fehlt).
  - Ein Regal mit einem **Schuhkarton**, eine Fotowand.
  - Eine Balkontür mit Fenster, draußen Dächer von Giesing, bei Silvester Feuerwerk über den Dächern.
- **Lauffläche:** y≈114–138, x 10–470.
- **Spots:**
  - `door` (Wohnungstür, zum Treppenhaus und zum Stadtplan);
  - `table`, `tree`, `kitchen`, `fridge`, `toys`, `shoebox`, `photos`, `coats`;
  - `balcony` (Balkontür und Fenster).
- **actorPos:** `ana` (Küchenzeile, Blick 'L'), `tobias` (am Tisch, Blick 'R'), `mia` (bei den Spielsachen, Blick 'R'), `niko` (am Baum, Blick 'L'), `jasna_ana` (am Tisch, Blick 'L'), `mala` (am Fenster, Blick 'L').
- **entries:** `map` (Tür, Blick 'R'). **start:** an der Tür.
- **Zustände:** `S.eve` (gedeckter Tisch, Heiligabend), `S.silvester` (Raclette auf dem Tisch, Luftschlangen), `S.coatGone`, `S.fireworks`.
- **Geistersicht:** An der Tür in `k4_fin_n` eine Spur von Zahlen in Geisterschrift: „1 2 3 …“, Jasnas Zählen.
- **dynamic:** Lichterkette blinkt sacht, Kerzen nein (Lichterkette reicht), Feuerwerk durchs Fenster (`S.fireworks`).

## wiesn — Theresienwiese · Breite 560, scrollend
- **Phasen:** `k4_d1` (klar, kalt).
- **Bild:**
  - Die **leere Festwiese** im Schnee: eine riesige weiße Fläche, Wege mit Laternen.
  - Links hinten auf der Anhöhe die **Bavaria** (Bronzestatue einer Frau mit Löwe) vor der Ruhmeshalle (Säulenhalle). Davor ein Hang, auf dem Kinder rodeln (gemalt, plus Mia als Figur).
  - Rechts in der Ferne Häuser des Westends, Kirchtürme **weglassen**.
  - Fußspuren im Schnee.
- **Lauffläche:** Weg y≈116–140, x 6–554.
- **Spots:** `exit` (rechter Rand, zum Stadtplan), `bavaria`, `slope` (Rodelhang), `field` (leere Wiese), `path`, `bench`, `sled` (Mias Schlitten), `tracks` (Fußspuren), `city`.
- **actorPos:** `ana` (am Weg, Blick 'L'), `mia` (am Hang), `niko` (bei Ana), `mala`.
- **entries:** `map` (rechts, Blick 'L'). **start:** rechts.
- **Zustände:** `S.walk` (Ana und die Kinder sind da).
- **Geistersicht:** Auf der leeren Wiese viele blasse Abdrücke von Menschenmengen, wie ein verblasster Jahrmarkt.

## gleis11 — Hauptbahnhof, Gleis 11 · Breite 560, scrollend
- **Phasen:** `k4_d1`, `k4_d2`, `k4_d3`, `k4_d4`, `k4_d5`.
- **Bild:**
  - Die **Halle** des Kopfbahnhofs: hohe Stahl-Glas-Dachkonstruktion, links ein Zug am Bahnsteig.
  - Bahnsteigende mit **Prellbock**, das große Gleisschild „11“.
  - An der Querhalle eine Tür mit Schild „BAHNHOFSMISSION“ (nur Text, **kein Symbol**).
  - Ein Kiosk mit Zeitungen („PRESSE“), eine Anzeigetafel, Tauben, Reisende (gemalt).
  - Im Boden nahe dem Bahnsteigende eine **eiserne Luke** mit Gitter (`hatch`).
  - Ein großer Weihnachtsbaum in der Querhalle (Tage 1, 2).
- **Lauffläche:** y≈112–140, x 6–554.
- **Spots:**
  - `exit` (linker Rand, Ausgang zur Stadt und zum Stadtplan);
  - `platform`, `sign11`, `mission` (Tür zur Bahnhofsmission), `kiosk`, `board`, `train`, `buffer`, `bench`, `tree`;
  - `hatch` (Luke: für Mala Durchgang nach unten in den Bunker, für Marko verschlossen).
- **actorPos:** `sepp` (Geist, am Bahnsteigende beim Prellbock, Blick 'L'), `kioskg` (im Kiosk, Oberkörper hinter der Theke als Vordergrund-Ebene, Blick 'F'), `mala`.
- **entries:** `map` (links, Blick 'R'), `bmission` (an der Tür, Blick 'R'), `bunker` (an der Luke, Blick 'R'). **start:** links.
- **Zustände:** `S.sepp` (Sepp ist da), `S.tree` (Baum an Tag 1 und 2).
- **Geistersicht:**
  - Am Bahnsteigende ein Strom alter Koffer-Umrisse, wie Ankommende von früher.
  - Über der Luke ein Schimmer nach unten.
- **dynamic:** Durchsage-Lautsprecher (kein Bild), Zug steht und atmet (leichtes Flimmern der Lichter), Tauben trippeln.

## bmission — Bahnhofsmission · Breite 320, Innenraum
- **Phasen:** Tagesphasen; `k4_d4` mit dem Abschied.
- **Bild:**
  - Ein heller, einfacher Raum: eine Theke mit großem **Teekessel** (Edelstahl), Tassen, Tische mit Wachstuch, an denen Gäste sitzen.
  - Eine **Pinnwand** mit Zetteln (`S.notice`: der Aushang „Wer kannte diesen Mann?“ mit Foto).
  - Eine Tür zum **Lager**, ein Fenster zum Bahnsteig, eine Grünpflanze.
  - **Kein Kreuz, kein Bild religiöser Art.**
- **Lauffläche:** y≈114–138, x 10–310.
- **Spots:**
  - `door` (zurück zum Gleis), `counter`, `urn`, `board`, `storage` (Lagertür), `tables`, `window`, `guests`;
  - `suitcase` (Sepps Pappkoffer, nur wenn `S.suitcaseOut`, auf einem Tisch).
- **actorPos:** `wimmer` (hinter der Theke, Blick 'L'), `gast1`, `gast2` (sitzend an den Tischen), `mala`.
- **entries:** `gleis11` (Tür, Blick 'L'). **start:** an der Tür.
- **Zustände:** `S.suitcaseOut`, `S.notice`, `S.farewell`. Bei `S.farewell` am Donnerstag steht auf einem Tisch eine schlichte Urne aus Ton neben einem Foto (Sepp mit Mütze) und einer Tasse Tee. Stühle stehen im Halbkreis.
- **Geistersicht:** Am Koffer liegt ein dichter Nachhall von Briefen (fliegende Umschläge in Geisterfarbe).

## bunker — Bunker unter Gleis 11 (nur Mala) · Breite 320, Innenraum
- **Phasen:** Tagesphasen.
- **Bild:**
  - Ein **Betongang** mit gewölbter Decke, alte Lüftungsrohre, rostige Stahltüren.
  - Verblasste Schilder auf Deutsch: „WEITERLEITUNGSSTELLE“, „WARTERAUM“, Pfeile.
  - Ein alter **Tisch** mit Stuhl (Registrierstelle), Holzbänke an der Wand.
  - In einer Ecke Theaterkram: Scheinwerfer, Stühle, eine Kiste mit der Aufschrift „GLEIS 11“.
  - Staub, kaltes Licht aus einer einzigen Lampe.
- **Lauffläche:** y≈114–138, x 20–300. **Nur Mala** (`walkG` für den ganzen Raum, `walk` wie üblich).
- **Spots:** `up` (zurück nach oben, für Mala `gexit` zu `gleis11`), `desk`, `signs`, `benches`, `props`, `pipes`.
- **actorPos:** `mala`.
- **entries:** `gleis11` (an der Treppe nach oben, Blick 'R'). **start:** an der Treppe.
- **Geistersicht:** Am Tisch steht der Nachhall einer Schlange junger Männer mit Pappkoffern. Am Tisch sitzt ein Beamter mit Stempel. Das ist zentral für Fall A.

## barsport — „Bar Sport“ im Bahnhofsviertel · Breite 320, Innenraum
- **Phasen:** Tagesphasen.
- **Bild:**
  - Eine kleine italienische Bar: Theke mit **Espressomaschine** (Chrom), Gläser, eine Kühltruhe.
  - An der Wand eine **Fotowand**: alte Schwarzweißfotos, darunter eines von 1962 mit jungen Männern und Koffern auf einem Bahnsteig, ein Fußballwimpel (Vereinsfarben, keine Wappen).
  - Ein Fernseher mit italienischem Programm, zwei Tische, ein Fenster mit Schnee draußen.
  - Schriftzug „BAR SPORT“ am Spiegel.
- **Lauffläche:** y≈114–138, x 10–310.
- **Spots:** `door` (zum Stadtplan), `counter`, `machine`, `photos`, `photo1962` (das Foto von 1962), `tv`, `tables`, `window`.
- **actorPos:** `enzo` (hinter der Theke, Blick 'L'), `gast3` (alter Mann mit Zeitung am Tisch, Blick 'R'), `mala`.
- **entries:** `map` (Tür, Blick 'R'). **start:** an der Tür.
- **dynamic:** Dampf an der Maschine, Fernseher flimmert.

## friedamt — Städtische Friedhöfe, Verwaltung · Breite 320, Innenraum
- **Phasen:** Tagesphasen.
- **Bild:**
  - Ein Amtszimmer: Schreibtisch mit Aktenstapeln und Telefon, ein **Aktenschrank**, Formulare in Fächern.
  - Ein Kalender mit einem Friedhofsfoto (Bäume, Schnee, Grabsteine, keine Kreuze sichtbar).
  - Ein Fenster, ein Besucherstuhl, eine Grünpflanze, ein Stempelkarussell.
- **Lauffläche:** y≈114–138, x 20–300.
- **Spots:** `door` (zum Stadtplan), `desk`, `files`, `forms`, `calendar`, `window`, `chair`, `stamp`.
- **actorPos:** `obermaier` (sitzend am Schreibtisch, Blick 'L').
- **entries:** `map` (Tür, Blick 'R'). **start:** an der Tür.

## heim — Haus am Bavariapark, Eingang · Breite 320, Innenraum
- **Phasen:** Tagesphasen, `k4_fin_n` (Nacht: nur Notlicht, Kevin).
- **Bild:**
  - Eine helle Eingangshalle: Empfangstheke, ein Weihnachtsstern, ein Tannenbaum mit Lichterkette.
  - Die **Aufzugtür** (Edelstahl), eine Treppe, eine Pinnwand mit Speiseplan und „Besuchszeiten 10–18 Uhr“.
  - Eine Bank, große Glastür nach draußen, Schnee dahinter.
- **Lauffläche:** y≈114–138, x 10–310.
- **Spots:** `door` (zum Stadtplan), `reception`, `elevator` (zum Wohnbereich, Ausgang zu `heim_flur`), `stairs` (ebenfalls zu `heim_flur`), `board`, `tree`, `bench`.
- **actorPos:** `empfang` (Empfangskraft hinter der Theke, Blick 'R', tags), `kevin` (Nacht, an der Theke, Blick 'R').
- **entries:** `map` (Glastür, Blick 'R'), `heim_flur` (am Aufzug, Blick 'L'). **start:** an der Glastür.
- **Zustände:** `S.night` (nur Notlicht und Lichterkette).

## heim_flur — Wohnbereich 2, Flur mit Aufzug · Breite 480, scrollend
- **Phasen:** Tagesphasen, `k4_fin_n`.
- **Bild:**
  - Ein langer Flur, Linoleum, Handläufe an beiden Wänden.
  - Links die **Aufzugtür** mit einer Anzeige darüber (Pfeil und Etagenzahl). Daneben eine **Bank**, auf der Alois wartet.
  - Die **Wanduhr** gut sichtbar (Zeiger, wichtig für drei Uhr: `S.three`, dann zeigt sie 15:00).
  - Türen zu Zimmern mit Namensschildern (eine „214 · LECHNER“), eine Tür zum Gemeinschaftsraum.
  - Das **Dienstzimmer** mit Glasfenster, ein Wäschewagen, ein Fenster am Ende des Flurs mit Blick auf verschneite Bäume.
- **Lauffläche:** y≈114–138, x 6–474.
- **Spots:** `elevator` (Ausgang zu `heim`), `bench`, `clock`, `door214` (Ausgang zu `heim214`), `door_raum` (Ausgang zu `heim_raum`), `office`, `cart`, `window`, `rail`, `display` (die Anzeige über dem Aufzug).
- **actorPos:** `alois` (auf der Bank, Blick 'R'), `alois_lift` (stehend vor der Aufzugtür, Blick 'L'), `gerda` (Geist, auf der Bank neben Alois, Blick 'L'), `gerda_hall` (Geist, am Fenster am Flurende, Blick 'L'), `jasnaW` (an der Dienstzimmertür, Blick 'R'), `pflege1` (am Wäschewagen), `kraus` (am Bedienfeld neben dem Aufzug, Blick 'L'), `mala`.
- **entries:** `heim` (am Aufzug, Blick 'R'), `heim_raum`, `heim214`. **start:** am Aufzug.
- **Zustände:** `S.three` (Szene um drei: Uhr 15:00), `S.gerdaPos` (`'bench'`, `'hall'` oder `null`), `S.chimeOff`, `S.night`.
- **Geistersicht:** Ein blasser Pfad vom Aufzug zur Bank, täglich begangen.
- **dynamic:** Die Anzeige über dem Aufzug zählt, wenn er kommt (`S.lift`). Ein kleines Licht blinkt beim Gong.

## heim_raum — Gemeinschaftsraum · Breite 400, Innenraum
- **Phasen:** Tagesphasen.
- **Bild:**
  - Ein großer Raum mit Tischen. Um drei stehen Kaffee und Kuchen darauf (`S.three`).
  - Große Fenster zum verschneiten **Bavariapark** mit kahlen Bäumen.
  - Ein Fernseher, ein Tannenbaum, ein altes Klavier.
  - Bewohnerinnen und Bewohner sind als gemalte Hintergrundfiguren in Sesseln zu sehen.
- **Lauffläche:** y≈114–138, x 10–390.
- **Spots:** `door` (zurück in den Flur), `tables`, `cake`, `window`, `tv`, `tree`, `piano`, `residents`.
- **actorPos:** `ertl` (am Tisch, Blick 'L'), `pflege1` (mit Kaffeekanne), `mala`.
- **entries:** `heim_flur` (Tür, Blick 'R'). **start:** an der Tür.

## heim214 — Zimmer 214, Alois Lechner · Breite 320, Innenraum
- **Phasen:** Tagesphasen, `k4_fin_n` (**Höhepunkt**: dunkel, nur Nachtlicht, Feuerwerk vor dem Fenster).
- **Bild:**
  - Ein Pflegezimmer: Pflegebett mit Galgen, daneben ein **Stuhl** (Gerdas Stuhl), ein Nachttisch.
  - Ein Fenster zum Park. Bei Nacht Feuerwerk: `S.fireworks` und `dynamic`, Lichtblitze, die das Zimmer kurz färben.
  - Ein Schrank. An der Wand viele **Trambahnfotos** (eine blau-weiße Tram, Linie 19, ein Fahrer in Uniform), ein Foto: eine junge Frau mit Thermoskanne vor einem Depottor.
  - An einem Haken eine alte **Fahrermütze**.
- **Lauffläche:** y≈114–138, x 20–300.
- **Spots:** `door` (zurück in den Flur), `bed`, `chair`, `window`, `photos`, `depot_photo`, `cap`, `nightstand`, `wardrobe`.
- **actorPos:** `alois_bed` (im Bett, sitzend/halb liegend: eine eigene Pose `bed` der Figur; Blick 'R'), `alois_chair` (im Sessel am Fenster, tags, Blick 'L'), `gerda` (Geist, auf ihrem Stuhl, Blick 'L'), `jasna_window` (Silvesternacht: auf einem Stuhl am Fenster, Blick 'L'), `marko_chair` (Standpunkt: Marko setzt sich auf Gerdas Stuhl), `mala` (an der Wand neben dem Fenster, Blick 'L').
- **entries:** `heim_flur` (Tür, Blick 'R'). **start:** an der Tür.
- **Zustände:** `S.night`, `S.fireworks`, `S.thermos` (Kanne auf dem Nachttisch oder in Alois' Armen), `S.aloisBed` (Alois liegt im Bett).
- **Geistersicht:** Am Stuhl ein Abdruck von jemandem, der täglich dort saß. Ab `k4.g.goodbye` ist er verblasst.
- **dynamic:** Feuerwerksblitze bei `S.fireworks`: zufällig über `M.hash` mit `view.t`, nicht jedes Bild.

## balkon — Davors Balkon in Moosach · Breite 320
- **Phasen:** Tagesphasen.
- **Bild:**
  - Ein kleiner Balkon eines Mietshauses im dritten Stock, Gitter mit Schnee darauf.
  - Ein Blumentopf mit einem kurzen **Feigenzweig** unter einer Plastiktüte, die Erde nass. Eine Gießkanne, ein Klappstuhl.
  - Durch die Balkontür sieht man ins Wohnzimmer (Davor und Lena als Figuren davor).
  - Dahinter Dächer von Moosach (Davors Karte aus Kapitel 3 nennt Moosach), Kamine.
- **Lauffläche:** y≈116–138, x 30–290.
- **Spots:** `door` (Balkontür, verlassen = zum Stadtplan), `pot`, `can`, `view`, `chair`, `window`.
- **actorPos:** `davor` (an der Tür, Blick 'R'), `lena` (neben dem Topf, Blick 'L'), `mala`.
- **entries:** `map` (Tür, Blick 'R'). **start:** an der Tür.
- **Geistersicht:** Am Zweig ein winziger Schimmer, wie ein Ast in einem anderen Sommer.

## konsulat — Generalkonsulat, Wartezimmer (nur Fassung „Probe nein“) · Breite 320, Innenraum
- **Phasen:** Tagesphasen.
- **Bild:**
  - Ein nüchterner Warteraum: Stuhlreihen, eine Nummernanzeige („Nr. 47“), ein Schalter hinter Glas mit Durchreiche.
  - Plakate zu Pässen und Formularen (Text, **keine Fahnen, keine Wappen**), eine Topfpflanze.
- **Lauffläche:** y≈114–138, x 20–300.
- **Spots:** `door` (zum Stadtplan), `counter`, `number`, `chairs`, `posters`.
- **actorPos:** `beamtin` (hinter dem Glas, Blick 'L').
- **entries:** `map`. **start:** an der Tür.

---

## Stadtplan München (Raum `map` in Kapitel 4)
**Funktion:** `M.paintMap4(S,GS)`, dazu `M.MAP4_POS = {ortId:[x,y], …}` in derselben Kunstdatei `game/src/rooms/art/map4.js`. Sie liefert ein `M.Buf(320,144)`.

**Gezeichneter Stadtplan im Stil der Pläne aus Kapitel 2 und 3**
- Papier, Straßenraster, rechts im Osten die **Isar** als blaues Band von Süd nach Nord.
- Der Hauptbahnhof in der Mitte links als großes Gleisfeld, westlich davon die Gleise mit der Hackerbrücke.
- Südwestlich die Theresienwiese (ovale Fläche), westlich davon das Westend.
- Im Nordwesten Moosach, östlich der Isar Giesing.

**Orte** (Ort-IDs aus `K4_SPEC.md` 4): `zob`, `hbf`, `bhfviertel`, `westend`, `wiesn`, `heim` (am Bavariapark, westlich der Wiese), `friedhof` (Verwaltung in der Altstadt), `giesing`, `moosach`, `konsulat` (nördlich der Altstadt). Das Spiel setzt die Marken und Namen; du lieferst nur die Positionen und das Bild.

**Ohne Namen:** Der Plan selbst trägt keine Ortsnamen außer „MÜNCHEN“ in einer Ecke und dem Fluss „ISAR“.

## Zwischenwelten (Erweiterung von `game/src/rooms/art/limbo.js`)
- **`S.who==='sepp'`, Bahnsteig 1962:**
  - Ein Bahnsteig im Licht, alte Personenwagen (grün), Dampf, ein Zug nach Süden. Auf dem Wagen steht „ROMA“ oder nur Wagennummern.
  - Ein Gepäckkarren, viele alte Koffer, ein einzelner **Pappkoffer** mit Schnur abseits (`prop`).
  - Die Steine der Zwischenwelt bleiben am Rand.
- **`S.who==='gerda'`, Trambahn-Depot bei Nacht:**
  - Ein Depottor mit Lampe, Gleise, eine Trambahn mit Liniennummer „19“ (alt, blau-weiß), eine **hohe Einstiegsstufe** (`prop`).
  - Schnee, eine Bank am Tor.

## Erinnerungsbilder
**Ort:** `game/src/97_k4_mem.js`, `M.mem.k4_*`. Format wie `97_k3_mem.js`. Die Liste steht in `K4_SPEC.md` Abschnitt 14.

**Zu `k4_april`:**
- Eine Schlange vor einer Mauer im Frühling, Menschen mit Kanistern, zwei blaue Kanister mit roter Schrift „VUKOVIĆ“ im Vordergrund.
- **Keine Verletzten, kein Blut, keine Waffen.**
