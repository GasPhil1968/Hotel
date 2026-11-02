# Raumvorgaben (Kunst) – MALA, Kapitel 1: Split

Ein ernstes, melancholisches Adventure im November 2011. Split: Kalkstein, Terrakottadächer, grüne Fensterläden (škure), Palmen an der Riva, Pinien auf dem Marjan, das türkisfarbene Hafenwasser, im Süden die Inseln Brač und Šolta als blaue Silhouetten. Viel Wind, Meer und Stille. Der Ton ist ruhig und nie komisch.

**Für jeden Raum gilt:** Datei `game/src/rooms/art/<id>.js` nach `game/ART_API.md`, Vorbild `game/src/rooms/flat.js`.
Die **Spot-IDs sind fest vorgegeben**, denn die Logikdateien verwenden genau diese Namen. Jeder Spot braucht ein Rechteck in `spots`, die meisten einen Standpunkt in `stands`. Bei NPCs steht die Fußposition in `actorPos`.
`S` ist der Raumzustand (Objekt); manche Bilder hängen von `S.*` oder `GS.flags['…']` ab, siehe jeweils „Zustände“. Wenn sich ein Zustand ändert, wird `paint`/`layers` neu aufgerufen.
Figuren (ca. 48 px) werden vom Spiel gezeichnet, **nicht** in die Kunst malen. Sitzmöbel für sitzende NPCs musst du aber malen.

---

## varos — Veli Varoš (Gasse am Marjan-Hang) · Breite 320
Phasen: `pro` (Tag, eben aufgehörter Regen: nasse, glänzende Steine, grauer Himmel), `c1` (Dämmerung), `c1_night` (Nacht, Bura), `c2` (Tag, Bura, klar).
Bild: Eine schmale Gasse mit alten Steinhäusern aus Kalkstein, teils verputzt in Ocker. Die Gasse steigt nach rechts leicht an, rechts hinten führen Stufen hinauf zum kleinen romanischen Kirchlein **Sv. Nikola** mit einem Glockengiebel und einer einzelnen Glocke. Links Zdenkas Haustür (Nr. 12) mit einem niedrigen **Holzschemel** daneben (dort sitzt Zdenka) und Basilikum und Geranien in alten Blechdosen. Rechts davon **Ivkas grüne Tür** (Nr. 14) mit geschlossenen grünen Läden am Fenster darüber und einem rostigen Briefkasten mit „PERIĆ“. An der Wand neben Ivkas Tür hängt eine **Todesanzeige** (osmrtnica): ein weißes Blatt mit schwarzem Rand und kleinem Kreuz. Über der Gasse eine Wäscheleine, eine Wandlaterne an einem Eisenarm. Über den Dächern Pinien des Marjan und ein Streifen Himmel. Auf einer Stufe sitzt eine Katze (klein, statisch gemalt, in `dynamic` ab und zu ein Schwanzzucken). Bei Bura weht die Wäsche (dynamic).
Lauffläche: Gasse unten, ungefähr y 110–140, x 6–310 (rechts darf sie mit den Stufen enden).
Spots: `exit` (linker Rand, zurück in die Stadt), `zdenka_door`, `stool` (Schemel), `plants`, `ivka_door`, `ivka_window`, `mailbox`, `notice` (Todesanzeige), `church` (Kirchlein), `bell` (Glocke im Giebel), `steps` (Stufen hinauf), `laundry`, `lamp`, `cat`.
actorPos: `zdenka` sitzt auf dem Schemel (Füße etwa bei x≈86, y≈122, Blick 'R').
entries: `map` (linker Rand, Blick 'R'), `ivka` (vor Ivkas Tür, Blick 'F').

## ivka — Ivkas Wohnung · Breite 320, Innenraum
Phasen: `pro` (Tag, gedämpft: Licht fällt in Streifen durch halb geschlossene Läden, Staub tanzt im Licht).
Bild: Ein kleines, sehr ordentliches Zimmer einer alten Frau. An der Rückwand ein Fenster mit halb geöffneten grünen Läden, durch die man tief unten über Dächer die Mole und das Meer sieht. Davor ein **Stuhl am Fenster** mit einer gefalteten Decke, zum Fenster gedreht. Eine **Kredenz** (Anrichte) mit gehäkeltem Deckchen und zwei gerahmten **Fotos**: links Tonći im Matrosenpullover, rechts zwei junge Männer auf einem weißen Boot. Daneben das **alte Radio** (Radiorekorder, 80er Jahre). Ein Tisch mit Wachstuch, darauf **zwei Tassen** (eine benutzt, eine unbenutzt) und ein **Schuhkarton**, mit Band verschnürt. An der Wand ein **Kalender 2011** mit kleinen Strichen und ein kleines Bild des heiligen Nikolaus (Ikone). Ein **Nähkorb** mit grauer Wolle und Stricknadeln. Ein Bett in einer Nische mit Häkeldecke, eine kleine Kochecke mit Herd. An der Tür ein Haken mit einem **schwarzen Mantel**. Dazu eine tickende Wanduhr.
Zustände: `S.photoTaken` (rechtes Foto fehlt), `S.boxOpen` (Karton offen, Briefe sichtbar), `S.radioOn` (kleines grünes Lämpchen am Radio).
Spots: `door` (Ausgang), `window`, `chair`, `cupboard`, `photo_tonci`, `photo_boat`, `radio`, `table`, `cups`, `shoebox`, `calendar`, `icon`, `basket`, `bed`, `coat`, `clock`, `stove`.
entries: `varos` (an der Tür).

## riva — Die Riva und die Mole · Breite 640, scrollend
Phasen: `c1` (Dämmerung, Lichter gehen an), `c1_night` (Nacht, Bura: klar, Sterne, Wellen), `c2` (Tag, Bura), `c3` (Dämmerung, Regen), `i1` (Nacht, Bura).
Bild: Links (x 0–400) die breite Uferpromenade mit **poliertem Kalksteinpflaster**. Dahinter die Südfront des Diokletianpalastes: alte Steinmauer mit Bogenfenstern, darin kleine Läden und Cafés, über allem der **Glockenturm von Sveti Duje**. Davor eine Reihe **Palmen**, **Bänke** und Riva-**Laternen**. Bei x≈250–330 das Hafenbüro: ein Gebäude aus dem 19. Jahrhundert mit Schild „LUČKA KAPETANIJA“ und einer Tür. Rechts (x 380–640) geht die **Mole** als steinerner Pier ins Hafenbecken hinaus, mit **Pollern**, einer **Laterne am Ende** und einer **Bank**. Am Ende steht Ivka. Unten im Vordergrund verläuft die Kaimauer, darunter ein Streifen Meer, das in `dynamic` animiert ist. Rechts hinter der Mole sieht man das Hafenbecken und am Horizont Brač. Bei Dämmerung und Nacht spiegeln sich Lichter im Wasser (glints), dazu Möwen am Tag. Für das Finale soll in `dynamic` eine Fähre einlaufen können, wenn `S.ferryAt` gesetzt ist (Zeitstempel in ms, `view.gt`): sie gleitet von rechts zur Mole.
Lauffläche: die Promenade y≈108–136 über x 6–400, dann die Mole y≈108–124 bis x≈620.
Spots: `exit` (linker Rand), `palace`, `belltower`, `palms`, `bench` (eine Bank auf der Promenade, für ein Gespräch in der Nacht), `lamp`, `office` (Gebäude), `office_door` (Tür, Ausgang ins Hafenbüro), `sea`, `ferries` (Fähren im Becken), `mole`, `bollard` (der Poller, an dem Ivka wartet), `mole_lamp`, `mole_bench`, `islands`.
actorPos: `ivka` am Ende der Mole (≈ x 596, y 114, Blick 'R' aufs Meer), `mala` (wo Mala auftaucht, ≈ x 560, y 116).
entries: `map` (linker Rand, Blick 'R'), `office` (vor der Tür des Hafenbüros, Blick 'F').

## office — Hafenbüro (Lučka kapetanija) · Breite 320, Innenraum
Phasen: `c1` (Abend, Neonlicht innen), `c1_night`.
Bild: Ein schlichtes öffentliches Amtszimmer: grünlich gestrichene Wände, Neonröhre, ein Holz**tresen** mit Glasaufsatz und Durchreiche. Dahinter sitzt **Mladen** (nur Oberkörper sichtbar, der Tresen ist eine Vordergrund-Ebene). An der Wand **Fahrpläne** und Aushänge, alte **Schiffsfotos** in Rahmen, eine **Wanduhr** und ein **Funkgerät**, das knistert (in `dynamic` blinkt ein Lämpchen). Dazu eine Wartebank, ein Gummibaum und rechts eine Tür mit Schild „ARHIVA – SAMO OSOBLJE“, links die Eingangstür.
Spots: `door` (Ausgang zur Riva), `counter`, `timetable`, `photos`, `radio`, `clock`, `bench`, `plant`, `archive_door` (Mala geht hier hindurch).
actorPos: `mladen` hinter dem Tresen (Füße ≈ x 150, y 104, Blick 'F'; Tresen-Ebene muss ihn bis zur Brust verdecken).
entries: `riva` (an der Eingangstür), `archive` (an der Archivtür, für Malas Rückkehr).

## archive — Archiv (nur Mala) · Breite 320, Innenraum
Phasen: `c1`, `c1_night` (dunkel; wird fast immer in Geistersicht gesehen, also kräftige Hell-Dunkel-Kontraste).
Bild: Ein schmaler, staubiger Raum mit hohen Metallregalen voller Aktenordner. Die Rücken tragen Jahreszahlen: 1946 … 2009 in Mikroschrift, in Gruppen ('40er, '50er …). Im Regal bei **1948** steht ein Ordner, dessen Rücken **„1984“** zeigt (Zahlendreher). Bei den '80ern klafft eine **Lücke**, wo 1984 fehlt. Dazu ein kleines hohes Fenster mit Mondlicht, ein Schreibtisch mit abgedeckter Schreibmaschine, Kartons und Spinnweben.
Lauffläche (für Mala): Boden y 108–138.
Spots: `door` (zurück ins Büro), `shelf_40s`, `binder_1948` (der falsch stehende Ordner, klein), `shelf_80s`, `gap_1984` (die Lücke, klein), `desk`, `window`, `boxes`.
ghost-Ebene: feine Staubfäden im Mondlicht; der falsche Ordner schimmert leicht (x5/x6), wenn `!GS.flags['c1.found1984']`.
entries: `office` (an der Tür).

## matejuska — Fischerhafen Matejuška + Bauzaun der Ledana · Breite 640, scrollend
Phasen: `c1` (Dämmerung), `c1_night` (Nacht, Bura), `c2` (Tag, Bura), `c2_night` (Nacht).
Bild: Links (x 0–380) das kleine Hafenbecken der Fischer mit bunten Holzbooten (Pasara, Gajeta), weiß, blau und grün gestrichen und mit Namen am Bug. Das Wasser wird in `dynamic` animiert, die Boote schaukeln leicht. Auf dem Kai liegen **Netze** (orange, grün), blaue **Fischkisten**, Poller und Taue, dazu eine **Laterne**. Dinkos **Schuppen** (konoba) ist ein kleines Steinhaus mit Holztür und **Vorhängeschloss** (x≈170–220). Davor bei x≈240 eine umgedrehte Kiste, auf der Dinko sitzt und flickt. Im Hintergrund der Marjan mit Pinien und die Häuser von Varoš. Rechts (x 420–640) die **Ledana**: ein großes, verlassenes Industriegebäude der alten Eisfabrik mit zerbrochenen Fenstern und dem verblassten Schriftzug „LEDANA“. Davor ein **Bauzaun** mit Kettentor und Schild „ZABRANJEN PRISTUP – RUŠENJE 21.11.“ und vor einem losen Zaunfeld ein **Stapel Fischkisten** (`S.cratesMoved`: Kisten zur Seite geschoben, das **Loch im Zaun** ist sichtbar).
Lauffläche: Kai y≈110–138, x 6–600 (die Ledana-Front ist Wand).
Spots: `exit` (linker Rand), `boats`, `nets`, `fishboxes` (Kisten am Kai), `shed` (Gebäude), `shed_door` (Tür mit Schloss; Mala geht hindurch), `lamp`, `marjan`, `sea`, `ledana` (Gebäude), `fence`, `sign`, `crates` (der Stapel vor dem Loch, verschiebbar), `gap` (Loch im Zaun, Ausgang in die Ledana, nur wenn `S.cratesMoved`).
actorPos: `dinko` sitzt auf der Kiste (≈ x 244, y 124, Blick 'L').
entries: `map` (links), `shed` (vor der Schuppentür, für Malas Rückkehr), `ledana` (vor dem Loch im Zaun).

## shed — Dinkos Schuppen (nur Mala) · Breite 320, Innenraum
Phasen: `c1`, `c1_night` (dunkel, ein Streifen Licht durch eine Ritze in der Tür und ein kleines Fenster).
Bild: Ein niedriger Raum aus rohem Stein. Netze hängen von Balken, dazu Ruder, ein alter Außenbordmotor, Bojen, Teerfässer und Kanister. Auf einem Regalbrett liegt, in Plastik gewickelt, ein alter Segeltuch-**Seesack** mit verblichenem „T.P.“. An der Wand ist ein **Foto** angeheftet (ein junger Mann), darunter auf einer Untertasse ein **Kerzenstummel**.
Spots: `door` (zurück), `seabag`, `photo`, `candle`, `nets`, `motor`, `oars`, `window`.
ghost-Ebene: ein schwacher Schimmer um den Seesack.
entries: `matejuska`.

## ledana — In der alten Eisfabrik · Breite 320, Innenraum
Phasen: `c2` (Tag: Licht fällt in Streifen durch kaputte Oberlichter, Tauben, Staub), `c2_night` (Nacht: Mond, das große Ladetor offen zum Hafen, gegenüber die erleuchtete **Nachtfähre nach Ancona** am Fährterminal).
Bild: Eine große Halle mit rostigen Eismaschinen und Kompressoren links, Rohren an den Wänden, einer Pfütze, Graffiti aus den 2000ern und kaputten Paletten. Links hinten führt eine **eingestürzte Holztreppe** zu einer **Galerie** mit Geländer (Büroebene, Boden der Galerie bei y≈62–72). Oben ein **Bürofenster** mit zerbrochener Scheibe zum Hafen. Auf der Galerie sitzt Luka (NPC, Geist). Rechts hinten die schwere **Kühlraumtür** mit Isolierung und Hebel (`S.coldOpen`: Tür einen Spalt offen, dunkel dahinter). Rechts vorn das große **Ladetor**, offen, dahinter die **Rampe** und das Wasser. Im Torrahmen auf Hüfthöhe ein **lockerer Ziegel** (`S.brickOut`: Ziegel liegt am Boden, Loch). Durch das Tor sieht man den Hafen und gegenüber den Fährhafen.
Lauffläche Marko: Hallenboden y≈108–138 (nicht unter der Treppe). **walkG** (nur Mala): zusätzlich die schräge Treppe als Rampe und die Galerie (y≈60–72), verbunden.
Spots: `exit` (zurück durch den Zaun, linker oder vorderer Rand), `stairs`, `gallery`, `office_window`, `machines`, `pipes`, `graffiti`, `puddle`, `pallets`, `colddoor` (Kühlraumtür), `gate` (Ladetor), `ramp` (Rampe draußen), `brick` (lockerer Ziegel, klein), `harbor_view` (Blick durchs Tor).
actorPos: `luka` sitzt auf der Galerie am Fenster (≈ x 92, y 70, Blick 'R'), `nina` an der Rampe (≈ x 270, y 124, Blick 'R') für das Finale.
entries: `matejuska` (am Eingang), `coldroom` (vor der Kühlraumtür).
dynamic: Tauben flattern am Tag, bei Nacht in der Ferne die Lichter der Fähre; `S.ferryGo` (Zeitstempel ms) lässt die Fähre langsam nach rechts aus dem Bild fahren.

## coldroom — Kühlraum (Mala zuerst) · Breite 320, Innenraum
Phasen: `c2`.
Bild: Ein dunkler, isolierter Raum mit Fleischhaken an Schienen und stockfleckigen Wänden. Ein Teil der Decke ist eingestürzt und hat einen **Schutthaufen** gebildet. Unter dem Schutt liegt ein **Gitarrenkoffer** (`S.caseOpen`: Koffer offen, kaputte Gitarre sichtbar). Ein Lichtkeil fällt aus der Tür.
Spots: `door` (zurück), `case`, `debris`, `hooks`, `walls`.
entries: `ledana`.

## bar — Bar „Bura“ · Breite 320, Innenraum
Phasen: `c2` (Morgen, Tageslicht durchs Fenster), `c1` (Abend), `c3` (Abend, Regen).
Bild: Eine kleine Stammkneipe mit Café. Ein Tresen mit verchromter **Espressomaschine**, Flaschen im Regal und einem Spiegel, dahinter steht Sanja. Ein kleines **Radio** (Fußball), an der Wand gerahmte **Fotos** von Hajduk-Mannschaften und ein Ventilator. Am Fenster Markos **Ecktisch** mit Blick auf die Straße und den Hafen, ein zweiter **Tisch**, an dem zwei alte Männer Karten spielen (Briškula); Stühle für sie mitmalen. Auf dem Tresen liegt die **Zeitung** (`S.paperTaken` = weg). Dazu ein Garderobenständer und die Eingangstür.
Spots: `door` (Ausgang), `counter`, `espresso`, `bottles`, `radio`, `photos`, `window`, `marko_table`, `cards_table`, `newspaper`.
actorPos: `sanja` hinter dem Tresen (≈ x 120, y 106, Blick 'F'; Tresen-Ebene verdeckt bis zur Hüfte), `stipe` und `frane` sitzen am Kartentisch (≈ x 214 und x 252, y 124, sich zugewandt: 'R' bzw. 'L').
entries: `map` (Tür).

## oldtown — Altstadt: der Peristil · Breite 480, scrollend
Phasen: `c2` (Tag, Bura, harte Sonne, klare Schatten).
Bild: Der Peristil des Diokletianpalastes: links ein römischer **Säulengang** mit Bögen (weißer Kalkstein, rötliche Granitsäulen), in der Mitte die **Stufen** zum Vestibül, eine kleine schwarze Granit-**Sphinx**, Tauben auf dem Pflaster. Dahinter ragt hoch der romanische **Glockenturm** der Kathedrale Sv. Duje auf (weiß, mit Bogenfenstern). Rechts (x 330–480) eine enge **Gasse** mit Wäsche, darin Ninas Laden: ein **Schaufenster** mit leeren Rahmen und ein Schild „OKVIR“ (Holz, gemalte Buchstaben) über der **Ladentür**. Dazu ein kleiner Zeitungsstand und eine steinerne Bank.
Lauffläche: Pflaster y≈110–138, x 6–470.
Spots: `exit` (linker Rand), `columns`, `belltower`, `steps`, `sphinx`, `pigeons`, `bench`, `kiosk`, `alley`, `shop_window`, `shop_door` (Ausgang in den Laden), `sign`.
entries: `map` (links), `shop` (vor der Ladentür).
dynamic: Tauben picken und flattern auf (kleine Sprites), Wäsche weht in der Bura.

## shop — Ninas Rahmenwerkstatt „Okvir“ · Breite 320, Innenraum
Phasen: `c2` (Tag: Licht durch das Schaufenster), `c2_night`.
Bild: Eine kleine Werkstatt. Die Wände sind voller **leerer Rahmen** in allen Größen, dazwischen ein paar **Bilder** (Ölbilder vom Hafen bei Nacht mit Fähre). Eine **Werkbank** mit Glasschneider, Passepartoutschneider und Gehrungssäge, ein **Regal** mit Werkzeug (Spachtel, Zangen, Hämmer), ein **Ladentisch** mit Klingel und Kasse und ein kleines Radio. Hinten ein Vorhang beziehungsweise eine Tür „PRIVAT“ zum Hinterzimmer, vorne das Schaufenster zur Gasse und die Ladentür.
Spots: `door` (Ausgang), `frames`, `paintings`, `bench` (Werkbank), `tools` (Regal mit Spachteln), `counter`, `bell`, `window`, `private` (Tür/Vorhang ins Hinterzimmer – Mala geht hindurch).
actorPos: `nina` an der Werkbank (≈ x 210, y 116, Blick 'L').
entries: `oldtown` (Ladentür), `backroom` (vor der Tür „PRIVAT“).

## backroom — Ninas Hinterzimmer (nur Mala) · Breite 320, Innenraum
Phasen: `c2`.
Bild: Eine enge Kammer, Atelier und Lager zugleich. Überall lehnen **Leinwände** an den Wänden, fast alle zeigen den Hafen bei Nacht: eine Fähre, Lichter und eine einzelne Gestalt, die an einem Kiosk wartet. Auf einer **Staffelei** steht ein unfertiges Bild derselben Szene. An der Wand hängt ein kleiner **Rahmen mit einem Fährticket**, daneben ist eine **Bleistiftskizze** angepinnt: ein junger Mann mit Gitarre. Dazu Farbgläser, Pinsel in Dosen und ein kleines hohes Fenster.
Spots: `door` (zurück), `canvases`, `easel`, `ticket`, `sketch`, `paints`, `window`.
ghost-Ebene: Das gerahmte Ticket schimmert leicht.
entries: `shop`.

## sustipan — Sustipan, der Park auf dem alten Friedhof · Breite 320
Phasen: `c1` (Dämmerung), `c1_night`, `i2` (Nacht, windstill, Sterne, Mond).
Bild: Eine Landzunge mit hohen Pinien, Kieswegen und niedrigen Steinmauern. Rechts vorn steht ein kleiner runder **Pavillon** mit Säulen und Kuppeldach an der Spitze über dem Meer. Eine **Gedenktafel** auf einem Steinblock trägt „ONIMA KOJE JE MORE ZADRŽALO“ (Denen, die das Meer behielt) und eine Namensliste in Mikroschrift. Dazu eine Bank. Unten das offene Meer, links in der Ferne die Hafeneinfahrt mit einem kleinen grünen **Leuchtfeuer** auf dem Wellenbrecher und die Lichter der Stadt über die Bucht.
**ghost-Ebene (sehr wichtig):** In Malas Geistersicht erscheinen die **Gräber des alten Friedhofs**, der in den 1950ern eingeebnet wurde: Kreuze, Grabsteine und eine kleine Kapelle als blasse, leuchtende Umrisse (x3–x6) zwischen den Pinien, auf und neben den Wegen.
Lauffläche: Kiesweg y≈108–138.
Spots: `exit` (linker Rand), `pines`, `pavilion`, `plaque`, `bench`, `sea`, `lighthouse`, `city`, `wall`, `graves` (großes Rechteck, nur Mala).
actorPos: `jakov` (Geist, fegt einen Weg, ≈ x 150, y 120, Blick 'L').
entries: `map`.

## terminal — Fährhafen & Busbahnhof · Breite 480, scrollend
Phasen: `c2` (Tag, Bura), `epi` (Morgengrauen: kühles Rosa und Blau, Straßenlaternen gehen gerade aus).
Bild: Links das Fährterminal, ein Betonbau aus den 70ern mit Schild „TRAJEKTNA LUKA“. Davor am Kai liegt eine **große weiße Fähre** (die Fähre nach Ancona) mit offener Bugklappe. In der Mitte ein **Kiosk**: Häuschen mit Fenster, Zeitschriften, Zigaretten und Mira dahinter (nur Oberkörper, die Kiosk-Fassade ist Vordergrund-Ebene bis zur Brust). Dazu **Bänke**, eine **Palme** und Möwen. Rechts (x 300–480) die **Bussteige** mit einem Reisebus, auf dessen Frontscheibe ein Schild „SARAJEVO“ steht, ein **Fahrkartenschalter** („BLAGAJNA“), eine **Abfahrtstafel**, ein Lautsprecher am Mast und Wasser im Vordergrund.
Lauffläche: y≈110–138, x 6–470.
Spots: `exit` (linker Rand), `ferry`, `terminal_bldg`, `kiosk`, `bench`, `palm`, `bus`, `bus_sign`, `ticket_counter`, `timetable`, `speaker`, `sea`.
actorPos: `mira` im Kiosk (≈ x 236, y 108, Blick 'F'), `mala` auf der Bank im Epilog (≈ x 350, y 124).
entries: `map` (links).

## palma — Hotel Palma, die Halle · Breite 320, Innenraum
Phasen: `c3` (Abend: Lampen an, Regen an den Fenstern), `c3_night` (Nacht: nur eine Tischlampe und die Notbeleuchtung, sehr still).
Bild: Eine verblasste Grandhotel-Halle aus den 1910ern. Links ein dunkler Holz**tresen** (Rezeption), dahinter die **Portiersloge**: ein Glaskasten mit alter Telefon-**Vermittlung** (Steckfeld), einem Messing**glöckchen** auf dem Tresen und einer Wand mit **Schlüsselfächern** 1–40 (Schlüssel an Messingbirnen). In der Loge stehen ein Stuhl und eine kleine **Schublade** mit **Telefonbuch** darauf. Rechts eine **große Treppe** mit rotem Läufer nach oben (zum Salon); auf dem Absatz hängt eine Kette mit Schild „ZATVORENO“ (`S.chainOff` = Kette ab). An der linken Wand eine Reihe **Garderobenhaken** mit Nummern 1–20, an Haken 13 ein dunkelgrüner Portiersmantel. Dazu Topfpalmen, zwei Sessel und ein **Lesetisch** mit Lampe, an den Wänden alte **Fotos** in Rahmen (das Hotel 1936, das Personal 1965) und ein **Tanzfoto** (Paar im Salon; `S.photoTaken` = nur noch ein hellerer Fleck an der Wand). Hinter der Rezeption ein **Regal** mit alten Registerbüchern, eine Tür „PRIVAT“ zu Ljerkas Zimmer, die **Eingangstür** zur Straße mit Regen am Glas und eine Standuhr, die geht.
Spots: `door` (Ausgang), `reception`, `lodge`, `bell`, `switchboard`, `pigeonholes`, `drawer`, `phonebook`, `stairs` (Ausgang zum Salon), `chain`, `hooks`, `coat13`, `photos`, `photo_dance`, `reading_table`, `armchairs`, `palms`, `register` (Regal mit Büchern), `private` (Ljerkas Tür), `window`, `clock`.
actorPos: `ljerka` hinter der Rezeption (≈ x 92, y 112, Blick 'F'), `bruno` (Geist) in der Loge (≈ x 52, y 108, Blick 'F'), `ljerkaNight` vor ihrer Tür.
entries: `map` (Eingangstür), `salon` (unten an der Treppe).

## salon — Der Salon im ersten Stock (verschlossen seit 1993) · Breite 320, Innenraum
Phasen: `c3_night` (Nacht: Regen an hohen Fenstern, Licht nur von draußen und aus der Tür; im Finale `S.dawn`: erstes Morgenlicht färbt die Fenster rosa).
Bild: Ein Ballsaal mit hohen Fenstern, einem verstaubten **Kronleuchter** und Parkett. Möbel stehen unter weißen Tüchern. In der Mitte ein **Flügel** unter einem Tuch (`S.sheetOff`: Tuch liegt daneben, schwarzer Flügel sichtbar) mit **Klavierhocker**. Links ein **Grammofon** mit Trichter auf einem **Plattenschrank** (`S.crank`: Kurbel steckt). Rechts an der Wand gestapelte **Eisenbetten** und zusammengerollte Matratzen aus der Flüchtlingszeit. Dazu die Tür zur Treppe.
**ghost-Ebene (wichtig):** In Malas Geistersicht erscheinen an den Wänden **Kinderzeichnungen in Kreide** unter der Farbe: eine **Straßenbahn mit der Nummer 3**, Häuser, eine Sonne, ein **Mädchen mit Zopf** und das Wort „KUĆA“. Auf dem Parkett ein Himmel-und-Hölle-Spiel.
Spots: `door` (Ausgang), `piano`, `sheet` (Tuch auf dem Flügel), `bench` (Klavierhocker), `gramophone`, `cabinet` (Plattenschrank), `beds`, `windows`, `chandelier`, `chalk` (Wand mit Kreidebildern, großes Rechteck, nur Mala), `hopscotch` (nur Mala).
actorPos: `bruno` an der Tür (≈ x 60, y 118), `ljerkaNight` am Flügel (sitzend: ≈ x 160, y 120, Blick 'R').
entries: `palma`.
