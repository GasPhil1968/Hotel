# Raumvorgaben (Kunst) – MALA, Kapitel 2: Sarajevo

November 2011. Sarajevo liegt in einem engen Tal zwischen Hügeln. Im Winter hängen Nebel und Kohlerauch über der Stadt, die Lichter sind gelb und gedämpft, man sieht den Himmel oft tagelang nicht. Drei Schichten: im Osten die osmanische **Baščaršija** (niedrige Holzläden mit Ziegel- und Bleidächern, Kopfsteinpflaster, Minarette, Tauben, Kupfer), in der Mitte die österreichisch-ungarische Stadt (vier- und fünfstöckige Fassaden mit Stuck, die Kathedrale, die Miljacka mit ihren Ufermauern und Steinbrücken), im Westen die sozialistischen **Hochhäuser** von Alipašino Polje (Betonplatten, Balkone, Satellitenschüsseln). Die Straßenbahn verbindet alles. An vielen Fassaden sieht man noch kleine Narben von Granatsplittern, im Pflaster mancher Straßen rot ausgegossene Einschläge („Sarajevoer Rosen“). Das zeigt man ruhig und beiläufig, nie als Spektakel. Der Ton ist ernst, warm und still.

**Für jeden Raum gilt dasselbe wie in Kapitel 1:** Datei `game/src/rooms/art/<id>.js` nach `game/ART_API.md`, Vorbild `game/src/rooms/flat.js` und die Räume aus Kapitel 1 (`rooms/art/*.js`). Die **Spot-IDs sind fest vorgegeben**, weil die Logikdateien genau diese Namen benutzen. Jeder Spot braucht ein Rechteck in `spots`, die meisten einen Standpunkt in `stands`. NPCs stehen mit der Fußposition in `actorPos`. Figuren (ca. 48 px) zeichnet das Spiel selbst, **nicht** in die Kunst malen. Sitzmöbel für sitzende NPCs musst du dagegen malen.

## Neu in Kapitel 2

**Wetter** (`M.scn.weather(GS)`) kennt zusätzlich `'fog'` (Nebel) und `'snow'` (erster Schnee). `M.scn.sky(b,x,y,w,h,tod,weather,seed)` malt für beide einen passenden verhangenen Himmel.
- `M.fogBake(b, amt, {col})` in `paint` **vor** `M.finishTOD`: mischt jeden Pixel nach `amt(x,y)` (0..1) zur Nebelfarbe (Standard `P.s4`). So verblasst die Ferne: Hügel kräftig (0,6–0,8), ferne Häuser mittel (0,3–0,5), Vordergrund nicht. **Den Himmel nicht vernebeln** (er ist schon verhangen und wird von `finishTOD` nicht umgefärbt); bei Nacht ist eine dunklere Nebelfarbe besser (`col:P.m1`).
- `M.fogDrift(fb, view.t, {y0,y1,amt,k,col,cam:view.cam})` in `front`: ziehende Schwaden. Sparsam: ein Band, `amt` 0,25–0,45. Bei Nacht `col:P.m1` oder `P.n1`.
- `M.snow(fb, view.t, {n,cam:view.cam,mask})` in `front`: fallender Schnee. `M.snowCap(b,x,y,w,h,top)` in `paint`: Schneekanten auf Oberseiten (Simse, Dächer, Mauern, Bänke), wo `top(x,y)` wahr ist.
- `M.scn.minaret(b,x,fußY,höhe,{lit})`: schlankes Minarett mit Balkon und Bleispitze, als Silhouette für Hintergründe.
- `M.scn.tram(b,x,schieneY,{s,line,dir,lit,doors,len,litOnly})`: Straßenbahn Tatra K2 (rot, cremefarbenes Fensterband, zwei Wagenteile). `s` = Maßstab (1 = Figurengröße, dann ~84 px hoch, 550 px lang; im Hintergrund 0,4–0,6), `len` schneidet ab, `litOnly:true` malt nur die erleuchteten Fenster (für `after`). Du darfst sie auch selbst malen, wenn es besser passt; dann aber im selben Aussehen.
- Phasen für `roomshot.js --phase`: `k2_pro` (Dämmerung, Nebel), `k2_pro_n` (Nacht, Nebel), `k2_s1` (Tag, Nebel), `k2_s1_n` (Nacht, klar), `k2_s2` (Tag, Regen), `k2_s2_n` (Nacht, Regen), `k2_i` (Nacht, klar), `k2_s3` (Tag, Nebel), `k2_s3_n` (Nacht, Nebel), `k2_fin` (Tag, klar und kalt), `k2_fin_n` (Nacht, Schnee), `k2_epi` (Morgengrauen, Schnee).
- **Schrift auf Schildern** ist bosnisch (lateinisch), mit ČĆŠŽ. Prüfe, ob `M.microText` ein Zeichen kann. Wenn nicht, nimm den Buchstaben ohne Haken.

**Malas Geistersicht** (`ghost`-Ebene) zeigt in Kapitel 2 oft Dinge, die für Rätsel gebraucht werden. Sie stehen bei jedem Raum. Benutze die Geisterfarben `x0–x6` und `v0–v5` und halte sie zart.

---

## stanica — Busbahnhof und Bahnhof · Breite 640, scrollend
Phasen: `k2_pro` (Ankunft, Dämmerung, Nebel), `k2_fin` (Tag, klar, kalt), `k2_epi` (Morgengrauen, Schnee).
Bild: Links (x 0–330) der **Busbahnhof**: ein flaches Bahnsteigdach aus Beton auf schlanken Stützen, darunter ein Reisebus mit Zielschild (`S.busTo`: `'split'` → „SPLIT – SARAJEVO“, `'mostar'` → „MOSTAR“), Bahnsteignummern, eine **Abfahrtstafel** („POLASCI“). Am Rand der **Kiosk** von Senada (Zeitungen „Oslobođenje“, „Dnevni avaz“, ein Schild „KARTE / TICKETS GRAS“), daneben die **Buregdžinica** von Fikret mit beschlagenem Schaufenster, Blechen voller Burek und Schild „BUREGDŽINICA SARAJ“. Eine geschlossene **Wechselstube** („MJENJAČNICA – subotom do 14h“), ein **Bankautomat** mit Zettel „VAN FUNKCIJE“, der **Paketschalter** („PAKETI – GARDEROBA“) mit Fenster und Klappe. Rechts (x 330–640) der **Bahnhof**: ein modernistischer Bau der 50er Jahre mit großer Glasfront, langem flachem Dach und einer **Uhr**, davor die Haltestelle der Linie 1 mit Wartehäuschen und Gleisen. Ein **Taxi** (alter Mercedes, weiß, „TAXI“ auf dem Dach) am Bordstein, Tauben, eine Bank, Laternen. Im Hintergrund durch den Nebel Hochhäuser und Hügel. Bei Schnee: dünne weiße Kanten, nasser Asphalt mit Spiegelungen.
Lauffläche: Bahnsteig und Vorplatz, y≈110–140, x 6–634.
Spots: `exit` (linker Rand, zum Stadtplan), `bus`, `timetable`, `kiosk`, `newspapers`, `burek` (Fikrets Laden, Schaufenster und Tür), `exchange`, `atm`, `parcel` (Paketschalter), `taxi`, `station` (Bahnhofsgebäude), `clock`, `tram_stop`, `tram` (die Straßenbahn an der Haltestelle, nur wenn `S.tramIn`), `bench`, `pigeons`.
actorPos: `fikret` vor seiner Ladentür (Blick 'R'), `senada` im Kiosk (Oberkörper hinter der Theke, die Theke ist eine Vordergrund-Ebene), `fadila` hinter dem Paketschalter (Oberkörper im Fenster, Blick 'F').
entries: `map` (linker Rand, Blick 'R'), `tramvaj` (an der Haltestelle, Blick 'L'). `start`: neben dem Bus (Ankunft), Blick 'R'.
Zustände: `S.tramIn` (Bahn steht an der Haltestelle, Türen offen), `S.busTo`.
Geistersicht: blasse, wartende Gestalten mit Koffern auf dem Bahnsteig, nur als Umrisse.
dynamic: Tauben picken, Abgaswolke am Bus, Uhrzeiger, Lichtflackern im Kiosk. Bei Nebel `M.fogDrift`, bei Schnee `M.snow`.

## tramvaj — In der Straßenbahn (Tatra K2) · Breite 320, Innenraum
Phasen: `k2_pro` (Linie 1, Dämmerung, Nebel), `k2_fin_n` (Linie 3, Nacht, Schnee).
Bild: Seitenblick in den Wagen. Rückwand = die gegenüberliegende Fensterreihe: große Fenster mit Metallrahmen, darunter Sitzbänke (Kunstleder, rotbraun) mit Haltegriffen. Senkrechte und waagrechte **Haltestangen** (gelb lackiert). Links das **Gelenk** zum hinteren Wagenteil (Faltenbalg, Drehteller im Boden). Rechts die **Tür** (Falttür) und dahinter die **Fahrerkabine** mit Glaswand. An einer Stange der **Entwerter** (orangefarbenes Kästchen mit Schlitz). Über den Fenstern ein **Linienplan** (`S.line`: `'1'` → „1 ŽELJ. STANICA – BAŠČARŠIJA“, `'3'` → „3 ILIDŽA – BAŠČARŠIJA“) und eine **Werbung**. Deckenlampen (Neon). Boden: geriffeltes Gummi, Schneematsch bei `k2_fin_n`.
Hinter den Fenstern zieht die Stadt vorbei (`dynamic`): wenn `S.moving`, scrollende Silhouetten. `S.view` legt fest, was gerade zu sehen ist: `'city'` (allgemein: Fassaden, Laternen), `'towers'` (Hochhäuser von Alipašino), `'unitic'` (zwei gläserne Bürotürme), `'yellow'` (ein großer gelber Hotelwürfel), `'museum'` (flaches Museum, davor ein großes Denkmal in Form einer Konservendose), `'cathedral'` (Kathedrale im Schnee), `'river'` (Miljacka, Brücke, ein Gebäude mit Streifenfassade und Gerüst), `'bascarsija'` (niedrige Holzläden, Sebilj). Steht die Bahn (`!S.moving`), steht das Bild still.
Lauffläche: der Gang, y≈114–138, x 20–300.
Spots: `door` (Aussteigen), `validator`, `seat`, `window`, `route`, `cab`, `joint`, `ad`, `lamp`.
actorPos: `kontrolor` (stehend nahe der Tür, Blick 'L'), `babica` (alte Frau mit Einkaufstasche, **sitzend** auf der Bank links, Blick 'R'), `student` (stehend an einer Stange, Blick 'F'), `mala` (sitzend auf der Bank neben dem Platz bei `seat`, Blick 'R').
entries: `stanica`, `carsija`, `neboder` (alle an der Tür, Blick 'L').
Zustände: `S.moving`, `S.line`, `S.view`.
Geistersicht: an der Fensterscheibe neben `seat` zwei kleine Handabdrücke im Hauch und eine mit dem Finger gemalte „3“.
dynamic: leichtes Schaukeln (Stangen und Haltegriffe pendeln 1 px), Lichter blitzen vorbei, Neon flackert selten.

## carsija — Baščaršija · Breite 640, scrollend
Phasen: `k2_pro` (Dämmerung, Nebel), `k2_pro_n` (Nacht, Nebel), `k2_s1` (Tag, Nebel), `k2_s1_n` (Nacht, klar), `k2_s2` (Tag, Regen), `k2_s3` (Tag, Nebel), `k2_fin` (Tag, klar), `k2_fin_n` (Nacht, Schnee).
Bild: Links (x 0–260) die **Endhaltestelle** der Straßenbahn: Gleise, die in einer Schleife enden, Oberleitungen an Masten, ein Wartehäuschen mit Schild „BAŠČARŠIJA“, davor eine **Bank** (dort sitzt Mala im Prolog). Daneben das kleine **Häuschen des Fahrdienstleiters** (Blech und Glas, ein Fenster mit Vorhang, Telefon, ein Fahrplan „VOZNI RED“ an der Wand, eine Thermoskanne auf dem Sims). Mitte (x 260–480) der Platz mit dem **Sebilj** (der hölzerne Brunnenkiosk mit grüner Kuppel), Tauben, dahinter niedrige Läden mit hölzernen Klappläden und Ziegel- oder Bleidächern, die **Baščaršija-Moschee** mit Bleikuppel und Minarett. Rechts (x 480–640) eine **Ćevabdžinica** mit Schild und Rauch aus dem Kamin, der Eingang einer **Gasse nach Kazandžiluk** am rechten Rand (Kupferteller hängen am Eingang) und hinten in der Mitte eine **Gasse zur Sahat-kula**, über deren Dächern der Uhrturm hervorschaut.
Lauffläche: Platz und Haltestelle y≈110–140, x 6–634; in die Gasse zur Kula ein Stück hinein bis y≈104.
Spots: `exit` (linker Rand, Stadtplan), `tram_stop`, `bench`, `tracks`, `booth` (Häuschen), `booth_window`, `timetable`, `wires`, `tram` (nur wenn `S.tramIn`), `sebilj`, `pigeons`, `mosque`, `shops`, `cevabdzinica`, `lane_kula` (Ausgang zur Kula), `lane_kazan` (Ausgang nach Kazandžiluk, rechter Rand), `lamp`.
actorPos: `rade` vor seinem Häuschen (stehend, Blick 'R'), `mala` **sitzend** auf der Bank (Blick 'R'), `damir` (Fahrer in Pause, stehend neben dem Häuschen, Blick 'L').
entries: `map` (linker Rand, 'R'), `tramvaj` (an der Haltestelle, 'R'), `kula` (Mund der Gasse zur Kula, 'F'), `kazandziluk` (rechter Rand, 'L').
Zustände: `S.tramIn` (Bahn in der Schleife, Türen offen).
Geistersicht: an der Haltestelle ein altes, blasses Haltestellenschild mit großer „3“, wie aus den 80ern; auf der Bank eingeritzte Buchstaben „L + M“ (sehr klein, nur in Geistersicht).
dynamic: Tauben (flattern auf, wenn jemand nah vorbeigeht, sonst picken), Rauch der Ćevabdžinica, Lichter. Bei Schnee `M.snow`.

## kula — Unter der Sahat-kula · Breite 320
Phasen: `k2_pro_n` (Nacht, Nebel), `k2_s1` (Tag, Nebel), `k2_s1_n` (Nacht, klar, Sterne), `k2_s2` (Tag, Regen).
Bild: Ein kleiner gepflasterter Platz. Links hinten die hohe **Sahat-kula**: ein schlanker quadratischer Turm aus hellem Stein (etwa 100 px hoch sichtbar, oben angeschnitten erlaubt), oben ein **Zifferblatt** mit arabischen Ziffern (ein Kreis mit zwölf Marken, zwei Zeiger), darunter eine kleine **Holztür** mit Eisenbeschlägen. Am Turmsockel eine **Tafel** (Schrift). Hinten die **Mauer** des Moscheehofs mit einem Bogentor und dahinter Baumkronen. Vor dem Turm eine **Steinbank**. Rechts die **Terrasse der Kafana „Kula“**: zwei, drei Tische mit Stühlen unter einem Vordach, Kupfertabletts im Fenster, die **Tür** zur Kafana mit Schild „KAFANA KULA – od 1958“. Eine Laterne.
Lauffläche: der Platz, y≈112–140, x 6–314.
Spots: `exit` (linker Rand, zur Baščaršija), `tower`, `clock` (Zifferblatt, klein), `tower_door`, `plaque`, `wall`, `bench`, `terrace`, `table`, `kafana_door` (Ausgang in die Kafana), `lamp`.
actorPos: `tomaz` (Geist, **stehend unter der Uhr**, vor der Bank, Blick 'F'), `emina` (kommt nachts von rechts; Standpunkt rechts vor der Terrasse, Blick 'L'), `lejla` (Terrasse, stehend, Blick 'L').
entries: `carsija` (linker Rand, 'R'), `kafana` (vor der Kafanatür, 'F').
Zustände: `S.clock` = `[h, m]` Stellung der Zeiger in Zifferblatt-Stunden (0–12) und Minuten. Wenn nicht gesetzt: Tag `[8,30]`, Dämmerung `[12,0]`, Nacht `[5,45]`. Die Zeiger zeichnest du in `dynamic`, damit die Logik sie verstellen kann.
Geistersicht: eine feine **Leine aus Licht** von der Bank zum Zifferblatt (Tomaž ist an die Verabredung gebunden), nur wenn `!GS.flags['k2.s1.free']`. Auf der Bank, ganz blass, eine sitzende Frauengestalt (Emina, 1972), nur wenn `GS.flags['k2.s1.echoBench']`.
dynamic: Zeiger, Laternenflackern, Tauben am Tag, ein Wassertropfen von der Dachrinne bei Regen.

## kafana — Kafana „Kula“, innen · Breite 320, Innenraum
Phasen: `k2_s1` (Tag), `k2_s1_n` (Nacht: geschlossen, Stühle auf den Tischen, nur ein Licht über der Theke), `k2_s2` (Tag, Regen am Fenster).
Bild: Ein niedriger, warmer Raum mit Holzdecke und Balken. An den Wänden **Kupfertabletts** und Teller, ein Regal voller **Džezve**, gerahmte **Fotos** (schwarzweiß: eine Kafana-Belegschaft vor dem Turm, Jahr 1972 unten im Rahmen). Hinten die **Theke** aus dunklem Holz mit einem **Kaffeeherd** (heißer Sand, Džezve darin), Zuckerdose, Tassen auf Tellern mit Lokum. Links das **Fenster** mit Spitzenvorhang und dem **Fenstertisch** (dort sitzt Šaćir; auf dem Tisch Dominosteine). Ein altes **Radio** auf einem Wandbord. Rechts hinter der Theke eine schmale **Tür zur Kammer** („OSTAVA“, mit Vorhang davor). Niedrige Stühle, eine **Preistafel** („BOSANSKA KAFA 1,50 KM · ČAJ · SOK · RAHATLOKUM“).
Zustände: `S.ostavaOpen` (Kammertür offen, dunkler Spalt), `S.closed` (Nacht: Stühle auf den Tischen), `S.radioOn` (Skala leuchtet).
Spots: `door` (Ausgang zur Kula), `counter`, `stove`, `dzezve`, `trays`, `window_table`, `dominoes`, `photos`, `radio`, `ostava_door` (Kammertür; Mala geht hier durch), `pricelist`, `stools`.
actorPos: `emina` **hinter der Theke** (Füße ≈ Thekenhöhe hinten, die Theke als Vordergrund-Ebene verdeckt sie bis zur Brust, Blick 'F'), `lejla` (stehend rechts vor der Theke, Blick 'L'), `sacir` (**sitzend** am Fenstertisch, Blick 'R').
entries: `kula` (an der Tür, 'R'), `ostava` (an der Kammertür, für Malas Rückkehr, 'L').
Geistersicht: an der Kammertür ein schwacher Schimmer; hinter der Theke, ganz blass, ein Mann mit Schnurrbart und Weste (Halid, 1973), nur wenn `GS.flags['k2.s1.echoHalid']`.
dynamic: Dampf über den Džezve, Rauch einer Zigarette am Fenstertisch, Regen am Fenster bei Regen.

## ostava — Die Kammer hinter der Kafana · Breite 320, Innenraum
Phasen: `k2_s1` (Tag: graues Licht durch ein hohes Fensterchen).
Bild: Ein schmaler, vollgestellter Raum. **Regale** mit Kaffeesäcken und Gläsern, **Kisten** mit leeren Flaschen („Sarajevsko“), alte **Möbel** unter Tüchern, eine nackte **Glühbirne** am Kabel. An der Wand lehnt ein großer alter **Spiegel** in schwerem, vergoldetem Rahmen (ca. 40 × 70 px), halb mit einem Tuch verhängt, blind gewordenes Glas. Unten am **Rahmen** links eine lose Leiste. Ein **Fensterchen** hoch oben.
Zustände: `S.lit` (Birne an: warmer Lichtkegel), `S.frameOff` (die untere Rahmenleiste ist abgehebelt, dahinter ein Hohlraum mit einer verbeulten Blechkasse), `S.tinTaken` (Hohlraum leer).
Spots: `door` (zurück in die Kafana), `mirror`, `frame` (unten am Rahmen, klein), `shelves`, `sacks`, `crates`, `furniture`, `window`, `bulb`.
entries: `kafana` (an der Tür, 'R').
Geistersicht: hinter dem Spiegel unten ein warmes, pulsierendes Leuchten (x5/x6), solange `!S.tinTaken`.
dunkel: ohne `S.lit` ist es fast dunkel (nur das Fensterchen). Male in Tagesfarben, dunkle es selbst ab, wenn `!S.lit` (M.light mit einem kleinen Lichtkegel vom Fenster).

## kazandziluk — Kupferschmiede-Gasse · Breite 320
Phasen: `k2_s1` (Tag, Nebel), `k2_s2` (Tag, Regen).
Bild: Eine schmale Gasse zwischen zweistöckigen Holzläden; vor den Läden hängen glänzende **Kupferwaren** (Teller, Kannen, Laternen, **Džezve** in allen Größen). In der Mitte die offene **Werkstatt** von Nedžad: Ladenfront mit hochgeklappten Läden, innen eine **Werkbank** mit Schraubstock, ein **Amboss** (eiserner Dorn im Holzklotz), **Werkzeug** zum Gravieren und Hämmern an der Wand, ein niedriger Hocker. Über der Werkstatt ein hölzernes Obergeschoss mit einer **Luke zum Dachboden**; eine **Leiter** lehnt seitlich an der Wand (`S.ladderUp`: Leiter an der Luke). Schild „KAZANDŽIĆ · od 1912“. Daneben ein **Nachbarladen** mit gravierten **Tabletts** im Fenster. Eine kleine Laterne.
Lauffläche: Gasse y≈114–140, x 6–314.
Spots: `exit` (linker Rand, zurück zur Baščaršija), `shop`, `workbench`, `anvil`, `tools`, `copper`, `dzezve`, `trays`, `ladder`, `attic`, `sign`, `neighbor`, `lantern`.
actorPos: `nedzad` **sitzend** auf dem Hocker an der Werkbank (Blick 'R').
entries: `carsija` (linker Rand, 'R').
Zustände: `S.ladderUp`, `S.bookOut` (ein dickes, staubiges Auftragsbuch liegt aufgeschlagen auf der Werkbank).
Geistersicht: an der Werkbank ein kurzer Schimmer, solange `!GS.flags['k2.s1.benchSensed']`.
dynamic: Glanzlichter auf dem Kupfer, die im Licht wandern, Hammerfunken? nein, nur ein Aufblitzen am Amboss bei Schlägen ist Sache der Animation; male nichts Bewegtes außer Glanz und Regen.

## pansion — Zimmer in Hajras Pension, Kovači · Breite 320, Innenraum
Phasen: `k2_pro` (Dämmerung), `k2_pro_n` (Nacht), `k2_s1`, `k2_s1_n`, `k2_s2` (Regen), `k2_s2_n`, `k2_s3`, `k2_s3_n`, `k2_fin`, `k2_fin_n` (Schnee am Fenster).
Bild: Ein Zimmer in einem alten bosnischen Haus: weiß gekalkte Wände, eine Holzdecke mit Leisten, ein **Fenster** mit tiefer Laibung und Gitter, dahinter der **Blick über die Stadt** im Tal (Dächer, Minarette, nachts gelbe Lichter im Nebel; der Blick soll schön sein). Ein **Bett** mit Kelim, ein kleiner **Tisch** mit Spitzendecke (bei `S.coffee`: Kupfertablett mit Džezva und zwei Tassen), ein **Kachelofen** oder eiserner **Ofen** mit Rohr, ein **Kleiderschrank**, ein **Wandbord** mit Hajras Kaffeegeschirr. An der Wand gerahmte **Fotos** (zwei Frauen vor einem Haus, 80er Jahre). Neben der Tür auf einem Tischchen ein altes **Telefon** mit Wählscheibe und darunter eine **Steckdose** (`S.charging`: ein Ladekabel hängt daran, ein kleines grünes Lämpchen). Ein **Teppich**. Die Katze **Mačak** schläft auf dem Bett oder sitzt auf dem Fensterbrett (`S.catAt`: `'bed'` | `'window'`, Katze statisch malen, in `dynamic` ein Ohrzucken).
Spots: `door` (Ausgang, zum Stadtplan), `bed`, `window`, `stove`, `table`, `phone`, `socket`, `photos`, `cat`, `wardrobe`, `shelf`, `rug`.
actorPos: `hajra` (stehend, nahe der Tür, Blick 'L').
entries: `map` (an der Tür, 'R'). `start`: am Fenster.
Geistersicht: im Fenster liegt über der Stadt ein zartes Netz aus Licht, das von Westen kommt (Malas eigene Leine, sehr schwach, nach Westen gerichtet).
dynamic: Ofenglut, Regen/Schnee am Fenster, Lichter der Stadt funkeln, Katze.

## ferhadija — Ferhadija · Breite 640, scrollend
Phasen: `k2_s1` (Tag, Nebel), `k2_s2` (Tag, Regen), `k2_s2_n` (Nacht, Regen).
Bild: Die Fußgängerzone: österreichisch-ungarische Fassaden (hell, Stuck, hohe Fenster, Läden im Erdgeschoss mit Markisen), Pflaster aus großen Steinplatten. Links (x 0–140) die **Ewige Flamme** (eine kleine Flamme in einer Nische unter einer Inschrift, mit Kränzen; ruhig behandeln). In der Mitte im Pflaster eine **Sarajevoer Rose**: ein Granateinschlag, mit roter Masse ausgegossen (klein, flach, würdevoll). Bei x≈300 eine **Passage** (Durchgang mit Rundbogen, Schild „ANTIKVARIJAT ↓“ an einem Arm). Rechts (x 440–640) die neugotische **Kathedrale** mit zwei Türmen (oben angeschnitten erlaubt), Stufen, Tauben davor. **Schaufenster**, ein **Café** mit Stühlen draußen, eine **Bank**, Laternen, ein **Plakat** an einer Litfaßsäule („JAZZ FEST SARAJEVO – NOVEMBAR 2011“).
Lauffläche: y≈112–140, x 6–634.
Spots: `exit` (linker Rand, Stadtplan), `flame`, `rose`, `passage` (Ausgang ins Antiquariat), `sign`, `shops`, `cafe`, `cathedral`, `towers`, `bench`, `lamp`, `pigeons`, `poster`.
entries: `map` (links, 'R'), `antikvarijat` (vor der Passage, 'F').
Geistersicht: über der Rose ein schwaches Glühen; sonst nichts.
dynamic: Flamme flackert, Tauben, Regen mit Spiegelungen in den Platten.

## antikvarijat — Jakobs Antiquariat · Breite 320, Innenraum
Phasen: `k2_s1` (Tag), `k2_s2` (Tag, Regen), `k2_s2_n` (Nacht, eine Leselampe).
Bild: Ein enger, hoher Laden voller **Regale** bis unter die Decke, Leitern, Bücherstapel auf dem Boden. Links ein abgewetzter grüner **Lesesessel** mit Stehlampe (dort sitzt der Geist des Professors). In der Mitte eine **Glasvitrine** mit Messingbeschlägen; darin auf rotem Samt ein altes **Buch** (Halbleder, ein Bibliotheksschild auf dem Rücken), Preisschildchen „900 KM“. Ein **Regal mit Kalendern und Almanachen** („KALENDARI · TAKVIMI“ auf einem Zettel). Eine **Fotokiste** (Holzkiste voller Abzüge) auf einem Hocker. **Zeitungsbündel** mit Schnur. Rechts der **Schreibtisch** Jakobs mit Rechenmaschine, Lupe und einem dicken **Ankaufbuch**. An der Wand alte **Landkarten** und eine gerahmte **Schrifttafel** („Deutsche Kurrentschrift“ – Alphabet in zwei Zeilen). Über der Tür eine **Türglocke** an einer Feder. Ein kleiner **Ofen**. Das **Schaufenster** zur Passage.
Zustände: `S.vitrineOpen`, `S.bookOut` (Vitrine leer), `S.kurrentOff` (Tafel fehlt, heller Fleck an der Wand), `S.photoOut`.
Spots: `door` (Ausgang zur Ferhadija), `shelves`, `almanacs`, `vitrine`, `book` (klein, in der Vitrine), `photobox`, `newspapers`, `armchair`, `desk`, `ledger`, `bell`, `kurrent`, `maps`, `stove`, `window`.
actorPos: `jakob` hinter dem Schreibtisch (stehend, Blick 'L'; der Schreibtisch darf ihn bis zur Hüfte verdecken), `ivan` (Geist, **sitzend** im Lesesessel, Blick 'R').
entries: `ferhadija` (an der Tür, 'L'). `start`: vor dem Schreibtisch.
Geistersicht: eine **Leine aus Licht** vom Sessel zum Buch in der Vitrine (solange `!GS.flags['k2.s2.free']`); das Zeitungsbündel glimmt schwach (`!GS.flags['k2.s2.obit']`).
dynamic: Staub im Licht, die Türglocke wackelt manchmal von selbst (`S.spook`), Regen am Schaufenster.

## obala — Ufer der Miljacka · Breite 640, scrollend
Phasen: `k2_s2` (Tag, Regen), `k2_s2_n` (Nacht, Regen).
Bild: Eine Uferstraße mit Straßenbahn**gleisen**, kahlen Platanen (**trees**) und Laternen. Unten die **Miljacka**: flach, steinig, grünbraun, zwischen hohen Ufermauern. Links (x 60–240) die osmanische **Lateinerbrücke** aus Stein mit drei Bögen und runden Öffnungen über den Pfeilern; ihre Mitte (**bridge_mid**) ist begehbar (gehört zur Lauffläche: die Brücke führt nach hinten, perspektivisch, du kannst sie als begehbaren Steg in die Tiefe malen oder als Brückenkopf). In der Mitte (x 240–420) das Haus **Obala 14**: österreichisch-ungarisch, vier Stockwerke, **Balkone** mit schmiedeeisernem Geländer (einer im zweiten Stock hervorgehoben), davor eine **Bank** (dort sitzt Milka, Tauben um sie). Rechts (x 420–640) die **Vijećnica**: großer Bau im maurischen Stil mit **ocker-roten Streifen**, Spitzbögen und Zinnen, fast ganz von **Gerüst** und grüner Plane verhüllt, davor ein **Bauzaun** mit **Schild** („OBNOVA GRADSKE VIJEĆNICE“), einem **Tor** im Zaun und einem **Baucontainer** der Nachtwache mit Fenster. Im Hintergrund dunkle **Hügel** (Trebević) im Regen.
Lauffläche: Uferstraße y≈112–140, x 6–634; dazu die Brückenmitte.
Spots: `exit` (linker Rand, Stadtplan), `river`, `bridge`, `bridge_mid`, `house14`, `balcony`, `bench`, `trees`, `lamp`, `tracks`, `vijecnica`, `scaffold`, `fence`, `sign`, `gate` (Ausgang in die Vijećnica), `container`, `hills`.
actorPos: `milka` **sitzend** auf der Bank (Blick 'R'), `amra` (am Tor, tags, stehend, Blick 'L'), `ilija` (vor dem Container, nachts, stehend, Blick 'L').
entries: `map` (links, 'R'), `vijecnica` (am Tor, 'L').
Zustände: `S.gateOpen`.
Geistersicht: über dem Fluss fällt **schwarzer Schnee**: kleine dunkle Flocken mit glimmenden Rändern (verbrannte Seiten), ruhig, langsam, in `ghost` animiert. Ein Faden aus Licht vom Balkon Nr. 14 zur Vijećnica.
dynamic: Fluss strömt, Regen mit Ringen auf dem Wasser, Tauben bei Milka, Laternen spiegeln sich.

## vijecnica — In der Vijećnica (Baustelle) · Breite 320, Innenraum
Phasen: `k2_s2` (Tag: graues Licht durch die Plane der Kuppel; nur Mala kommt hinein), `k2_s2_n` (Nacht: ein Baustrahler).
Bild: Die große Halle im maurischen Stil: ein Lichthof mit **Spitzbögen** in zwei Geschossen, schlanke **Säulen** (manche frisch restauriert und hell, manche noch rußschwarz), Reste farbiger Ornamente. Überall **Gerüst**, Bretter, Leitern. Oben die **Kuppel**, deren Glas fehlt, mit Plane (**tarp**) abgedeckt; Regen tropft durch. In der Mitte die Reste der alten **Ausleihtheke** (verkohltes Holz, eine Messingleiste). Säcke, Steinstücke für die Restaurierung (**stones**), eine Mischmaschine (**mixer**), Kabel, ein **Baustrahler** (`S.lampOn`). Eine gesperrte **Treppe**.
Zustände: `S.bookOnDesk` (ein Buch liegt auf der Theke), `S.lampOn`.
Spots: `exit` (zurück zur Obala), `desk`, `columns`, `arches`, `dome`, `tarp`, `scaffold`, `worklamp`, `stones`, `stairs`, `mixer`.
actorPos: `ivan` (Geist, stehend vor der Theke, Blick 'F').
entries: `obala` ('R').
Geistersicht: In den Bögen stehen die **alten Regale voller Bücher**, nur als feine Lichtlinien (x3–x5), dazu Lesetische mit grünen Lampen. Das ist das Herz des Raums: zart und schön.
dynamic: Regentropfen fallen aus der Kuppel in eine Pfütze, die Plane bläht sich leicht, Staub im Strahlerlicht.

## neboder — Hof von Haus 7, Alipašino Polje · Breite 640, scrollend
Phasen: `k2_s2` (Tag, Regen), `k2_s3` (Tag, Nebel), `k2_s3_n` (Nacht, Nebel), `k2_fin` (Tag, klar), `k2_fin_n` (Nacht, Schnee), `k2_epi` (Morgengrauen, Schnee).
Bild: Hohe Wohntürme aus Betonplatten (18 Stockwerke, oben angeschnitten), mit Loggien, Wäsche, Satellitenschüsseln, nachts einzelne gelbe Fenster. In der Mitte das Hochhaus **Nr. 7** (`tower7`); auf seinem Dach (sichtbar ganz oben oder durch einen Blick nach oben angedeutet) eine große, rußgeschwärzte **Uhr** ohne Zeiger (**roofclock**). Der **Hauseingang** von Nr. 7 mit Vordach, Glastür und Hausnummer „7“. Links die **Haltestelle** „ALIPAŠINO POLJE“ der Linie 3 mit Wartehäuschen und Gleisen; `S.tramIn`: eine Bahn hält. Daneben eine **alte Kioskstelle**: eine Betonplatte mit vier abgesägten Stahlstümpfen und einem verrosteten Schild „KIOSK“. Rechts ein **Spielplatz** mit Klettergerüst und **Sandkasten**; am Rand des Sandkastens eine kleine eiserne **Luke** (Notausstieg des Schutzraums). Eine **Bank**, geparkte **Autos** (alter Golf, Yugo), Pappeln (**trees**), andere **Hochhäuser** im Hintergrund, eine Laterne.
Lauffläche: Hof y≈110–140, x 6–634.
Spots: `exit` (linker Rand, Stadtplan), `tram_stop`, `tram` (nur wenn `S.tramIn`), `kiosk_spot`, `tower7`, `roofclock`, `haustor_door` (Ausgang ins Haus), `balconies`, `towers`, `playground`, `sandpit`, `hatch` (klein), `bench`, `cars`, `trees`, `lamp`.
actorPos: `alija` (Geist, stehend an der Kioskstelle, Blick 'R'), `mirza` (fegt Laub vor dem Haus, stehend, Blick 'R'), `nada` (Epilog: vor dem Haus, stehend, Blick 'L').
entries: `map` (links, 'R'), `haustor` (vor der Haustür, 'F'), `tramvaj` (an der Haltestelle, 'R').
Zustände: `S.tramIn`.
Geistersicht: an der Kioskstelle steht der **alte Kiosk** in Lichtlinien wieder da (mit Zeitungen, Fenster, Dach); die Uhr auf dem Dach leuchtet mit **grünlich glimmenden Ziffern**, wie in den 80ern.
dynamic: Wäsche, einzelne Fenster gehen an und aus, Krähen, Nebel, Schnee.

## haustor — Eingangshalle von Haus 7 · Breite 320, Innenraum
Phasen: `k2_s3` (Tag), `k2_s3_n` (Nacht), `k2_fin`, `k2_epi`.
Bild: Eine Betonhalle mit Terrazzoboden und hellgrünem Ölsockel an den Wänden. Links eine Wand mit **Briefkästen** aus Blech (Namen auf Zetteln). Ein **Glaskasten** mit dem Hausbuch / einer Tafel „STANARI“ (Liste nach Stockwerken, klein). Ein **Schwarzes Brett** mit Zetteln des Hausrats. Hinten der **Aufzug** mit Schild „VAN FUNKCIJE“ und daneben die **Treppe** nach oben. Neben einem **Heizkörper** ein alter **Sessel** mit Häkeldecke (Dragicas Posten) und ein **Vogelkäfig** mit Kanarienvogel. Die Tür des **Hausmeisterraums** („DOMAR“). Rechts ein paar Stufen hinunter die schwere **Stahltür** des Schutzraums („SKLONIŠTE“, Hebel, Vorhängeschloss), daneben ein alter **Klingelknopf** mit vergilbtem Zettel „ŠKOLA“. Die Wohnungstür von **Šehić** (Hochparterre, Namensschild, Fußabtreter). Ein **Kinderwagen** am Fuß der Treppe. Ein **Lichtschalter** mit Zeitschaltung (orangefarbenes Lämpchen). Eine Topfpflanze.
Zustände: `S.shelterOpen` (Stahltür offen, dunkle Treppe nach unten), `S.strollerGone`.
Spots: `exit` (Haustür, zurück in den Hof), `mailboxes`, `housebook`, `notices`, `elevator`, `stairs` (Ausgang nach oben, zu Nada), `chair`, `birdcage`, `radiator`, `domar_door`, `shelter_door` (Ausgang in den Schutzraum; Mala geht auch durch die geschlossene Tür), `bell_button` (klein), `sehic_door`, `stroller`, `lightswitch` (klein), `plant`.
actorPos: `dragica` **sitzend** im Sessel (Blick 'R'), `mirza` (vor der Domar-Tür, stehend, Blick 'L'), `sehic` (vor seiner Tür, stehend, Blick 'L'), `selma` (neben dem Kinderwagen, stehend, Blick 'L').
entries: `neboder` (an der Haustür, 'R'), `stan` (an der Treppe, 'F'), `skloniste` (an der Stahltür, 'L').
Geistersicht: auf der Stahltür Kreidepfeile und „ŠKOLA →“, kleine Handabdrücke an der Wand neben dem Klingelknopf.
dynamic: das Lämpchen am Lichtschalter, der Vogel hüpft, Neonröhre flackert nachts.

## skloniste — Der Schutzraum (Kellerschule) · Breite 320, Innenraum
Phasen: `k2_s3` (Tag), `k2_s3_n` (Nacht) – unten ist es immer gleich.
Bild: Ein niedriger Betonkeller mit Rohren an der Decke, Sandsäcken am Eingang, einem **Ofen** aus einem Ölfass mit Rohr. In Reihen alte **Bänke** und schmale Tische, vorn ein **Lehrerpult** mit Schublade und eine **Tafel** auf einem Gestell. An der Wand **Kinderzeichnungen** (Straßenbahnen, Sonnen, Häuser), mit Reißzwecken angeheftet, vergilbt. Ein Blech**schrank** mit Vorhängeschloss. Auf dem Pult eine **Handglocke**. An der Wand eine alte elektrische **Klingel** (Glockenschale mit Klöppel, **bellbox**). Wasserkanister, Decken, eine nackte **Glühbirne** (`S.lit`).
Zustände: `S.lit` (Licht an), `S.cabinetOpen`, `S.rollcall` (auf den Bänken sitzen Leute; nur Kunst ändert sich nicht, die Figuren stellt das Spiel).
Spots: `exit` (die Treppe hinauf), `blackboard`, `drawings`, `benches`, `desk`, `under_desk` (klein, unter dem Pult), `cabinet`, `bell` (Handglocke, klein), `stove`, `pipes`, `sandbags`, `canister`, `bulb`, `bellbox`.
actorPos: `zora` (Geist, stehend an der Tafel, Blick 'F'), `mirza` (**sitzend** auf der ersten Bank, Blick 'L'), `selma` (**sitzend**, zweite Bank, Blick 'L'), `damir` (**sitzend**, dritte Bank, Blick 'L').
entries: `haustor` (am Fuß der Treppe, 'R').
Dunkel: ohne `S.lit` ist es stockdunkel. Male den Raum normal; die Engine zeigt Marko im Dunkeln nur, was in Malas Schein liegt.
Geistersicht: Die Tafel ist voller Kreide: Rechnungen, ein Gedicht in zwei Zeilen, eine gezeichnete Straßenbahn mit „3“ und darunter Namen in Kinderschrift; auf den Bänken sitzen blasse Kindergestalten (nur Umrisse, x2/x3), solange `!GS.flags['k2.s3.free']`.
dynamic: Birne pendelt leicht, Wassertropfen.

## stan — Nadas Wohnung, 9. Stock · Breite 480, scrollend, Innenraum
Phasen: `k2_s3` (Tag, Nebel draußen), `k2_fin` (Tag, klar), `k2_epi` (Morgengrauen, Schnee draußen).
Bild: Links (x 0–300) Küche und Wohnzimmer einer kleinen Hochhauswohnung: Tisch mit Wachstuch, zwei Stühle, eine Küchenzeile, ein Heizkörper, ein **Fernseher**, eine **Anrichte** mit gerahmten **Fotos** (ein Mädchen mit Zopf, etwa 15, lachend), ein **Kalender**, die **Balkontür** und der **Ausblick** über die Hochhäuser, das Tal und die Hügel. Rechts eine geschlossene Zimmertür (**lana_door**, ein Schlüsselloch). Dahinter (x 300–480) **Lanas Zimmer**, seit 1993 unverändert: ein schmales **Bett** mit Tagesdecke, ein **Schreibtisch** mit Stiften in einer Blechdose, Zeichenblock, **Zeichnungen** an der Wand (Straßenbahnen, Gesichter), **Poster** von frühen 90ern (ein Konzertplakat, ein Filmplakat, beides erfunden), ein **Kleiderschrank**, ein **Fenster**, eine **Postkarte** an die Wand gepinnt (ein Bild vom Meer und Palmen). Staub, Stille. Solange `!S.lanaOpen`, ist das Zimmer dunkler (Vorhänge zu) und nur für Mala betretbar.
Lauffläche: Wohnzimmer y≈112–140, x 10–290 (Marko); Lanas Zimmer x 310–470 für Marko nur mit `S.lanaOpen`. **walkG** (Mala): Lanas Zimmer immer.
Spots: `door` (Wohnungstür, Ausgang zur Treppe), `table`, `kitchen`, `radiator`, `tv`, `sideboard`, `photo`, `calendar`, `balcony`, `view`, `lana_door`, `lana_bed`, `lana_desk`, `drawings_l`, `posters`, `wardrobe_l`, `lana_window`, `postcard`.
actorPos: `nada` (**sitzend** am Tisch, Blick 'R').
entries: `haustor` (an der Wohnungstür, 'R').
Zustände: `S.lanaOpen`.
Geistersicht: in Lanas Zimmer leuchten die Zeichnungen an der Wand; am Schreibtisch sitzt blass ein Mädchen und zeichnet (nur wenn `GS.flags['k2.f2.echoRoom']`).
dynamic: Uhr, Vorhang, Schneeflocken draußen.

## vratnik — Vratnik und die Gelbe Bastei · Breite 640, scrollend
Phasen: `k2_i` (Nacht, klar: die Stadt als Lichtermeer im Tal), `k2_fin` (Tag, klar, kalt).
Bild: Links (x 0–330) eine steile, gepflasterte **Gasse** in der alten Mahala: weiße Häuser mit dunklen Holz-Obergeschossen und Erkern, Gartenmauern mit Holztoren, Weinreben, ein kleiner Mahalla-**Moschee**-Bau mit Holzminarett. **Ružas Haus**: klein, weiß, mit Ziegeldach und einem eigenen hölzernen **Tor** (**ruza_gate**) in einer Gartenmauer, dahinter ein verwilderter **Garten** mit einem kahlen Quittenbaum. **Nachbarhäuser**. Rechts (x 330–640) die **Stadtmauer** aus gelblichem Stein und die **Žuta tabija** (Gelbe Bastei): eine runde Bastion mit Terrasse und Brüstung, eine **Bank**, der Platz, an dem im Ramadan die Kanone steht (**cannon**: nur ein Sockel). Von dort der weite **Blick** über das Tal: die ganze Stadt, Minarette, Kuppeln, Hochhäuser in der Ferne, Hügel gegenüber. Nachts ein Lichtermeer im leichten Dunst. Ein streunender **Hund**, eine Laterne.
Lauffläche: Gasse (steigt nach rechts an, darf als Ebene gemalt sein) und Bastei-Terrasse, y≈108–140, x 6–634.
Spots: `exit` (linker Rand, Stadtplan), `alley`, `houses`, `mosque`, `ruza_house`, `ruza_gate` (Ausgang in Ružas Küche), `garden`, `wall`, `tabija`, `bench`, `cannon`, `view`, `lamp`, `dog`.
entries: `map` (links, 'R'), `kuca` (vor dem Tor, 'F').
Geistersicht: auf der Bank, nur in Geistersicht, eingeritzt und leuchtend: „M + M 91“.
dynamic: Lichter der Stadt funkeln, der Hund trottet, Rauch aus Kaminen.

## kuca — Großmutter Ružas Küche · Breite 320, Innenraum
Phasen: `k2_fin` (Tag, kaltes Licht durch Spitzenvorhänge).
Bild: Eine niedrige Küche eines alten Hauses, seit 1994 unbewohnt, aber gelüftet: ein gusseiserner **Kohleherd** mit Backrohr und einem **Wärmefach** (kleine Klappe oben seitlich, verrostet), das **Ofenrohr** in die Wand, ein **Tisch** mit Häkeldecke, zwei **Stühle**, eine **Kredenz** mit Glastüren und **Tassen**, ein **Fenster** mit Spitzenvorhang, ein **Wandkalender** von 1994 (aufgeschlagen: Februar), ein **Sofa** mit Kelim, ein gerahmtes **Foto** an der Wand (ein Mann mit Schnurrbart, Hochzeitsbild), Möbel teils unter weißen **Tüchern**.
Zustände: `S.compOpen` (Wärmefach offen), `S.msgTaken`, `S.sheetsOff`.
Spots: `door` (Ausgang, zurück auf die Gasse), `stove`, `compartment` (klein), `pipe`, `table`, `chairs`, `cupboard`, `cups`, `window`, `calendar`, `sofa`, `photo`, `sheets`.
entries: `vratnik` ('R').
Geistersicht: am Herd ein warmes Glimmen (solange `!S.msgTaken`); am Tisch blass eine alte Frau mit Kopftuch (nur wenn `GS.flags['k2.f2.echoOven']`).
dynamic: Staub im Licht.

---

## map2 — Stadtplan Sarajevo
Datei `game/src/rooms/art/map2.js`. Keine `defineArt`, sondern zwei Exporte:
- `M.paintMap2(S,GS)` gibt einen `M.Buf(320,144)` zurück: eine gezeichnete Karte auf Papier wie der Stadtplan von Split (siehe `paintMap` in `game/src/90_story.js`), aber für Sarajevo: das Tal von West (links) nach Ost (rechts), die **Miljacka** als Linie durch das Tal, die **Linie 3** als gestrichelte rote Linie entlang des Tals bis zur Schleife in der Baščaršija, Hügel als Schraffur im Norden und Süden (Trebević im Süden), Kartusche „SARAJEVO 2011“, Kompass. Dazu je Ort ein kleines Symbol (nur wenn `GS.map[id]`, sonst blass) und darunter sein Name (wie `drawIcon` in Split).
- `M.MAP2_POS = { neboder:[x,y], stanica:[x,y], ferhadija:[x,y], obala:[x,y], carsija:[x,y], pansion:[x,y], vratnik:[x,y] }` – Mittelpunkt des Symbols.
Orte (west → ost, grob): `neboder` Alipašino Polje (ganz im Westen), `stanica` Bahnhof und Busbahnhof (Mitte-West, nördlich des Flusses), `ferhadija` (Zentrum), `obala` Miljacka/Vijećnica (am Fluss, Osten), `carsija` Baščaršija (Osten), `pansion` Kovači (nordöstlich darüber, am Hang), `vratnik` (noch höher im Nordosten). Namen: „Alipašino Polje“, „Busbahnhof“, „Ferhadija“, „Miljacka“, „Baščaršija“, „Kovači – Pension“, „Vratnik“. Achte darauf, dass sich die Namen nicht überlappen.
Symbole: Hochhaus, Bus, Kathedrale, Brücke, Sebilj/Kuppel, Haus, Bastei.

## limbo — Zwischenwelt: drei neue Geister
Datei `game/src/rooms/art/limbo.js` (bestehend) **erweitern**, ohne die drei Varianten aus Kapitel 1 zu verändern. `S.who` kann zusätzlich sein:
- `'tomaz'`: Requisit = ein steinerner Pfeiler mit dem **Zifferblatt der Sahat-kula** (arabische Ziffern, zwei Zeiger). `S.clockSet`: Zeiger auf sieben, sonst auf drei. Blick durch das Tor: der Platz unter der Kula bei Nacht mit Laterne.
- `'ivan'`: Requisit = ein **Lesetisch** mit grüner Lampe und einem aufgeschlagenen Buch. `S.lineDone`: die Lampe leuchtet heller, Seiten schimmern. Blick durch das Tor: die Miljacka mit der Streifenfassade der Vijećnica.
- `'zora'`: Requisit = eine alte **Schulbank** mit einer **Handglocke** darauf. `S.rung`: die Glocke ist fort (Zora hält sie). Blick durch das Tor: der Hof der Hochhäuser im Nebel.
`propSpot(S)` und `propStand(S)` müssen auch für die neuen Werte stimmen. Das Requisit steht wie bisher rechts vom Geist.
