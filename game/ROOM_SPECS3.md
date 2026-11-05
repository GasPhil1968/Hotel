# Raumvorgaben (Kunst) – MALA, Kapitel 3: Mostar

Grundlage: `KAPITEL3_KONZEPT.md` (Fassung 2, Abschnitt 4.5 „Orte“, 4.6 „Handlung“). Zeit: 24. bis 28. November 2011.

**Mostar 2011.** Die Neretva fließt grün, tief unten zwischen hellen Kalkfelsen. Die Altstadt (Ostufer) ist osmanisch: niedrige Steinhäuser mit grauen Steinplattendächern (Kalksteinplatten, nicht Ziegel), Kopfsteinpflaster aus glattgetretenem Flussstein, Kupferläden, Teppiche, Touristen in Regenponchos, Minarette. Die Alte Brücke (Stari most) ist ein **einziger hoher, schlanker Steinbogen** von Fels zu Fels, mit zwei Türmen an den Enden (Halebija und Tara), **ohne Pfeiler im Wasser**. Das Westufer ist moderner: Wohnblocks, Cafés, der breite Bulevar (frühere Frontlinie) mit einer Bankruine (Glasfassade zerschossen, Betonskelett), das restaurierte Gymnasium (gelb-ocker, maurischer Stil). Kriegsspuren sind sichtbar (Einschusslöcher, Ruinen), erzählen aber nichts selbst: keine Parolen, keine Flaggen, keine Symbole von Seiten. Hügel: Hum (Westen, mit Kreuz in der Ferne – **weglassen**, keine religiösen Zeichen der Seiten), Velež (Osten, kahl, Kalk).

**Für jeden Raum gilt dasselbe wie in Kapitel 1 und 2:** Datei `game/src/rooms/art/<id>.js` nach `game/ART_API.md`, Vorbilder die Räume aus Kapitel 2 (`game/src/rooms/art/*.js`, z. B. `kula.js`, `obala.js`, `stanica.js`). Die **Spot-IDs sind fest vorgegeben**, weil die Logikdateien genau diese Namen benutzen. Jeder Spot braucht ein Rechteck in `spots`, die meisten einen Standpunkt in `stands`. NPCs stehen mit der Fußposition aus `actorPos` ([x, y, Blick]); ihr Hotspot-Rechteck setzt das Spiel selbst. Prüfe jeden Raum mit `node game/tools/roomshot.js <id> --phase <phase>` (Bild ansehen!) und für jede Phase, in der er vorkommt.

**Phasen** für `roomshot.js --phase` (Tageszeit, Wetter): `k3_pro` (Tag, Mittag, **Regen**, warmer Jugo, Fluss hoch und laut), `k3_pro_n` (Nacht, Regen hört auf), `k3_d1` (Tag, **Bura**, klar und windig, weite Sicht), `k3_d1_n` (Nacht, klar), `k3_d2` (Tag, klar, kalt), `k3_d2_n` (Nacht, klar, kalt), `k3_d3` (Tag, klar, kalt, Frost angesagt), `k3_fin_n` (Nacht, **sehr dunkel**, Neumond, Frost), `k3_epi` (Morgengrauen, **grau, mild**; Tageszeit `'dawn'`), `k3_epi_d` (derselbe Montag am Tag, grau; Tageszeit `'day'`). Wetter-Schlüssel: `'rain'`, `'bura'` (neu: klare Luft, Wind; Kunst darf Wolkenfetzen, wehende Planen, gebeugte Bäume zeigen), `'calm'`, `'frost'` (neu: klar, Raureif auf Holz und Gras), `'grey'` (neu: bedeckt, flaches graues Licht; `M.scn.sky` malt dafür einen grauen Himmel). `M.scn.weather(GS)` liefert den Schlüssel aus der Phase; wenn ein Schlüssel unbekannt ist, verhalte dich wie bei `'calm'`.

**Schrift auf Schildern** bosnisch/kroatisch (lateinisch) mit ČĆŠŽ, wo `M.microText` es kann; sonst ohne Haken.

**Malas Geistersicht** (`ghost`-Ebene): zart, Geisterfarben `x0–x6`, `v0–v5`. Wo etwas für ein Rätsel nötig ist, steht es beim Raum.

**Malas Leine** zeichnet das Spiel selbst (nicht Teil der Kunst).

**Zustände** `S.xxx` sind Raumzustände (`A.S`), `G.flags['k3.xxx']` Spielschalter. Die Kunst liest sie in `paint`/`layers`/`dynamic` (über `GS`/`S`), damit sich der Raum im Verlauf ändert.

---

## ostbus — Ostbusbahnhof · Breite 480, scrollend
Phasen: `k3_pro` (Ankunft, Regen), alle Tagesphasen, `k3_epi_d` (grau; Nada kommt an, später die Abfahrt).
Bild: flacher Betonbau des Busbahnhofs neben dem Bahnhof (sachlich, 1970er), ein Vordach auf Stützen, darunter zwei Bussteige. Ein Reisebus (weiß-blau) mit Zielschild (`S.busTo`: `'sarajevo'` → „MOSTAR – SARAJEVO“, `'split'` → „SPLIT“; sonst leer). Eine **Abfahrtstafel** („POLASCI“) mit Zeilen, darunter gut lesbar „MÜNCHEN · subota“. Ein **Kiosk** mit Zeitungen, Postkarten, Stadtplänen im Drehständer. Ein **Taxistand**: ein alter weißer Mercedes (W123) mit Taxischild, Fahrer lehnt daran. Pfützen, Regen (Phase `k3_pro`), ein Mann mit Schirm. Hinten Wohnblocks und der kahle Velež.
Lauffläche: Bussteig und Vorplatz, y≈112–140, x 6–474.
Spots: `exit` (linker Rand, zum Stadtplan), `bus`, `board` (Abfahrtstafel), `kiosk`, `maps` (Drehständer mit Stadtplänen), `taxi` (Wagen), `bench`, `station` (Bahnhofsgebäude), `puddle`, `clock`.
actorPos: `kioskm` (Kioskfrau im Kiosk, Oberkörper hinter der Theke = Vordergrund-Ebene, Blick 'F'), `taxist` (am Taxi lehnend, Blick 'L'), `nada` (Epilog: steigt aus dem Bus, neben der Bustür, Blick 'R').
entries: `map` (linker Rand, Blick 'R'). `start`: neben dem Bus (Ankunft), Blick 'R'.
Zustände: `S.busTo`, `S.busIn` (Bus steht da; sonst leerer Bussteig).
Geistersicht: nichts Besonderes, die Pfützen spiegeln kalt.
dynamic: Regentropfen in Pfützen (Ringe), Abgas am Bus, Scheibenwischer des Taxis bei Regen, Uhrzeiger.

## herberge — Herberge „Neretva“: Rezeption und Terrasse · Breite 400
Phasen: alle außer `k3_fin_n` (`k3_epi`: Morgengrauen, Anruf bei Nada).
Bild: links (x 0–170) die kleine Rezeption in einem alten Steinhaus: Holztresen mit Glocke, Schlüsselbrett, Prospekte, ein Laptop, ein Rucksackstapel, ein Schild „HOSTEL NERETVA · free wifi“. Rechts (x 170–400) die **Terrasse** über dem Fluss: Holzboden, Geländer, zwei Tische mit Plastikstühlen, Lichterkette, ein Weinstock ohne Blätter. Hinter dem Geländer tief unten die Neretva (nur oben zu sehen, grün), drüben das Westufer, in der Ferne rechts die Alte Brücke klein im Profil (Bogen!). Bei Nacht: Lichterkette, Kerzen in Gläsern.
Lauffläche: Boden Rezeption und Terrasse, y≈112–138, x 10–390.
Spots: `door` (Haustür links, zum Stadtplan), `desk` (Tresen), `bell` (Tischglocke), `register` (Gästebuch), `stairs` (Treppe nach oben zum Zimmer, Tür hinten links), `railing` (Geländer, Blick auf den Fluss), `table` (Markos Tisch auf der Terrasse), `guitar` (Tisch der Australier), `lights` (Lichterkette), `bridge_view` (die Brücke in der Ferne).
actorPos: `maja` (hinter dem Tresen, Blick 'R'), `aussie1`, `aussie2`, `aussie3` (am Tisch der Australier: zwei **sitzend**, einer mit Gitarre sitzend, Blick 'L' bzw. 'R'), `mala` (Terrasse, am Geländer, Blick 'R').
entries: `map` (Tür, Blick 'R'), `zimmer` (an der Treppe, Blick 'R'). `start`: vor dem Tresen, Blick 'R'.
Zustände: `S.aussies` (die Australier sind da: abends `k3_pro`, `k3_d1_n`, `k3_d2_n`, tagsüber weg), `S.candles`.
Geistersicht: am Geländer ein schwacher Abdruck vieler Hände.
dynamic: Lichterkette flimmert, Kerzenflammen, Gitarrensaite schwingt (wenn `S.aussies`), Fluss glitzert unten.

## zimmer — Markos Zimmer in der Herberge · Breite 320, Innenraum
Phasen: alle außer `k3_fin_n`.
Bild: schmales Zimmer unter dem Dach, Holzbalken, weiß gekalkte Wand. Ein Bett mit Wolldecke, ein Stuhl mit Markos Tasche, ein kleiner Tisch, ein **Fenster zum Fluss** mit tiefem Fensterbrett (darauf kann die Džezva stehen: `S.dzezva`), dahinter Neretva und Westufer. Eine Glühbirne an einem Kabel. Ein Heizkörper, der tickt.
Lauffläche: y≈114–138, x 20–300.
Spots: `door` (zurück zur Rezeption), `bed`, `window`, `sill` (Fensterbrett), `bag`, `chair`, `heater`, `lamp`.
actorPos: `mala` (am Fenster? **nein**: Mala meidet das Fenster; sie steht an der Tür, Blick 'R').
entries: `herberge` (Tür, Blick 'R'). `start`: neben dem Bett, Blick 'L'.
Zustände: `S.dzezva` (Džezva steht auf dem Fensterbrett).
Geistersicht: am Fenster ist es kälter (Raureif am Glas).
dynamic: Glühbirne schwingt leicht, Regen am Fenster (Phase `k3_pro`).

## kujundziluk — Kujundžiluk · Breite 480, scrollend
Phasen: Tagesphasen, `k3_epi`, `k3_epi_d`.
Bild: enge Altstadtgasse, Kopfstein aus runden Flusssteinen, beidseits niedrige Steinhäuser mit Holzläden, darüber graue Steinplattendächer. Kupferteller, Teppiche, Tücher hängen vor den Läden. Ein **Laden mit alten Postkarten** (Drehständer und Kisten), drinnen ein Händler. Touristen (zwei Figuren im Hintergrund, nur gemalt). Am rechten Ende öffnet sich die Gasse zur Brücke (Turm der Brücke angeschnitten).
Lauffläche: y≈112–138, x 6–474.
Spots: `exit` (linker Rand, zum Stadtplan), `to_bridge` (rechter Rand, zur Alten Brücke), `shop` (Postkartenladen), `postcards` (Kiste mit alten Postkarten), `copper` (Kupferteller), `carpets`, `cobbles`, `tourists`.
actorPos: `haendler` (Händler im Ladeneingang, sitzend auf einem Hocker, Blick 'L').
entries: `map` (links, Blick 'R'), `starimost` (rechts, Blick 'L'). `start`: links.
Geistersicht: auf den Pflastersteinen ein Strom von Schritten (blasse Fußabdrücke).
dynamic: Tücher wehen (Bura), Regen (`k3_pro`).

## starimost — Die Alte Brücke · Breite 560, scrollend
Phasen: alle außer `k3_fin_n`; `k3_pro_n` (Nacht: Uferstufen, Laternen), `k3_epi` (Morgengrauen, grau).
Bild: Blick vom Ostufer-Brückenkopf. Die **Alte Brücke** groß im Bild: ein einziger hoher Steinbogen (Spannweite füllt die Bildmitte), helle Kalksteinblöcke, flacher Buckel, Geländerbrüstung, an jedem Ende ein Turm. **Das Widerlager** links unten: der Bogen sitzt direkt auf dem Fels, gut sichtbar, kein Pfeiler im Wasser. Tief unten die grüne Neretva mit weißen Strudeln. Am Brückenkopf (links) die kleine **Springerhütte** (Klub der Springer, Holzbalkon, Schild „KLUB SKAKAČA“), ein Mann in Trainingsjacke (Dino). Links unten **Uferstufen** aus Stein, die zum Wasser führen (`steps`). Rechts drüben das Westufer mit Häusern.
Lauffläche: Brückenkopfplatz y≈110–132 x 6–300; die Stufen führen nach links unten (x 20–90, y bis 140). Die Brücke selbst ist **nicht** begehbar (nur als Hotspot), außer im Epilog (`S.walkBridge`: dann ist der Weg über den Bogen bis zum Scheitel begehbar, x 300–420).
Spots: `exit` (zurück in die Gasse, links), `bridge` (die Brücke), `abutment` (Widerlager: Bogen auf Fels), `river`, `hut` (Springerhütte), `bridgehead` (Brückenkopf, Peilung 1), `steps` (Uferstufen), `towers`, `crest` (Scheitel der Brücke, nur wenn `S.walkBridge`).
actorPos: `dino` (vor der Hütte, Blick 'R'), `springer` (Geist, nur Nacht: auf der Brüstung, Blick 'F'), `mala` (am Brückenkopf, Blick 'R').
entries: `kujundziluk` (links, Blick 'R'), `map` (links, Blick 'R'). `start`: links.
Zustände: `S.walkBridge` (Epilog), `S.dinoJump` (Dino steht auf der Brüstung).
Geistersicht: über dem Wasser, unter dem Bogen, eine zarte zweite Linie: die Behelfs-Seilbrücke von 1994 (nur als Lichtstrich).
dynamic: Strudel, Gischt, Möwen, bei Nacht Laternen an der Brücke; der Springer (Geist) springt jedes Mal, wenn die Laternen angehen (das Spiel steuert ihn als Figur).

## koski — Hof der Koski-Mehmed-Pascha-Moschee · Breite 320
Phasen: Tagesphasen.
Bild: kleiner ummauerter Hof mit Kieselmosaik, ein Brunnen (Šadrvan) mit Holzdach, ein Granatapfelbaum (kahl), die Moschee mit Kuppel und schlankem **Minarett** (Tür am Fuß), ein kleines **Kassenhäuschen** („ULAZNICA / TICKET – MINARET“). Hinter der Hofmauer der Fluss und die Alte Brücke im Profil (vom Hof aus ist der Blick auf die Brücke berühmt).
Lauffläche: y≈112–138, x 10–310.
Spots: `exit` (Tor, zum Stadtplan), `minaret_door` (Tür zum Minarett), `ticket` (Kasse), `fountain`, `tree`, `view` (Blick zur Brücke über die Mauer), `mosque` (Moschee, nicht betretbar).
actorPos: `kasir` (im Kassenhäuschen, Oberkörper, Blick 'F').
entries: `map` (Tor, Blick 'R'), `minarett` (an der Minaretttür, Blick 'L'). `start`: am Tor.
Geistersicht: am Brunnen viele Hände, die Wasser schöpfen (blass).
dynamic: Wasser im Brunnen, Tauben.

## minarett — Oben auf dem Minarett · Breite 320
Phasen: Tagesphasen.
Bild: der enge Balkon (Šerefe) des Minaretts: Steingeländer im Vordergrund (Vordergrund-Ebene), Marko steht auf dem schmalen Umgang. Panorama: die Dächer der Altstadt, die Brücke von oben, der Fluss nach Süden, Westufer, Hügel. Gut erkennbare **Landmarken** für die Peilung: der Glockenturm der Kirche (Westufer, links), zwei **Baukräne** (Westufer, Mitte und rechts), das Hochhaus „Razvitak“ (Ostufer, links, Hochhaus), der kahle Velež.
Lauffläche: der Umgang, y≈118–134, x 40–280 (eng).
Spots: `stairs` (zurück nach unten), `rail` (Geländer), `view` (die Aussicht; Peilung 2), `tower_l` (Glockenturm), `cranes` (die Kräne).
actorPos: keine.
entries: `koski` (Treppe, Blick 'R'). `start`: an der Treppe.
dynamic: Wind (Bura) zerrt an einer Fahne aus Stoff (nur ein Wimpel, ohne Zeichen), Vögel.

## tepa — Markt auf der Tepa · Breite 480, scrollend
Phasen: `k3_d2` (Samstag, voller Markt), sonst leerer Platz mit zwei Ständen.
Bild: kleiner Marktplatz am Rand der Altstadt, Stände unter Planen und Schirmen: Obst (Granatäpfel, Mandarinen), Gemüse, Honig in Gläsern, Käse, Säcke mit Walnüssen. **Zlatas Stand**: ein Klapptisch mit Eierkartons und einem Sack Walnüsse, eine Waage. Daneben der Stand der Nachbarin (Gemüse). Hinten ein Minarett und Steinhäuser.
Lauffläche: y≈112–138, x 6–474.
Spots: `exit` (zum Stadtplan), `zlata_stand` (Zlatas Tisch), `eggs` (Eierkartons), `walnuts`, `neighbor_stand`, `honey`, `fruit`, `crowd`.
actorPos: `zlata` (hinter ihrem Tisch, sitzend auf einem Hocker, Blick 'L'), `susjeda` (Nachbarin, hinter ihrem Stand, stehend, Blick 'R'), Marktleute als gemalte Hintergrundfiguren.
entries: `map` (links, Blick 'R'). `start`: links.
Zustände: `S.zlataGone` (Zlata hat zusammengepackt: ihr Tisch ist leer), `S.eggDropped` (ein zerbrochenes Ei auf dem Pflaster).
Geistersicht: an Zlatas Hocker eine warme, flackernde Spur (dort endet Malas Leine).
dynamic: Planen bewegen sich, Tauben, Waage wippt.

## strassenbr — Die Straßenbrücke · Breite 400
Phasen: Tagesphasen.
Bild: eine moderne, nüchterne Straßenbrücke aus Beton, flach über den Fluss, mit Metallgeländer, zwei Fahrspuren, Laternenmasten, ein Bürgersteig. Seitlich Blick auf das Wasser. Links das Ostufer, rechts das Westufer. Autos (gemalt, eines fährt in `dynamic`).
Lauffläche: der Bürgersteig, y≈118–134, x 6–394 (von links nach rechts über die Brücke).
Spots: `exit_e` (links, Ostufer, zum Stadtplan), `exit_w` (rechts, Westufer, zum Stadtplan), `railing`, `river`, `traffic`, `lamp`.
actorPos: `mala` (Ostufer-Ende, Blick 'R').
entries: `map` (links, Blick 'R'). `start`: links.
Geistersicht: nichts; die Brücke ist für Mala „eine Straße mit Geländer“.
dynamic: Autos, Wind.

## bulevar — Der Bulevar · Breite 480, scrollend
Phasen: Tagesphasen.
Bild: eine breite Straße mit Mittelstreifen, kahle Platanen. Links das **restaurierte Gymnasium** (ocker und gelb, maurische Bögen). Mitte die **Bankruine**: ein Hochhaus aus Beton und Glas, Glas zerschossen, Betonskelett, Graffiti-frei (nur Spuren). Rechts eine Seitengasse mit dem Schild „VULKANIZER RAJIĆ →“ und einem Reifenstapel. Einschusslöcher in einer Hauswand. Eine Bank.
Lauffläche: Gehweg y≈114–138, x 6–474.
Spots: `exit` (zum Stadtplan), `to_vulk` (Seitengasse rechts, zum Vulkanizer), `gymnasium`, `bank_ruin`, `bench`, `holes` (Einschusslöcher), `sign` (Schild Vulkanizer).
actorPos: keine.
entries: `map` (links, Blick 'R'), `vulkanizer` (rechts, Blick 'L'). `start`: links.
Geistersicht: auf der Straße eine Linie aus Kälte quer über den Asphalt (die alte Front), sehr zart.
dynamic: Laub, ein vorbeifahrendes Auto.

## partizan — Partisanenfriedhof am Westhang · Breite 400
Phasen: Tagesphasen (Peilung 3 am Freitag, Mittag).
Bild: ein großes verwildertes Gedenkareal am Hang (Bogdan Bogdanović, 1965): Terrassen und Wege aus Steinplatten, Steinblöcke in Form von Blüten/Steinzungen, Gras zwischen den Fugen, zerbrochene Platten, kahle Bäume. Weiter Blick über die Stadt und den Fluss nach Süden. Keine Symbole, keine Inschriften (zerstört/verwittert).
Lauffläche: eine Terrasse, y≈112–134, x 10–390.
Spots: `exit` (zum Stadtplan), `view` (Blick über die Stadt; Peilung 3), `stones` (Steinblüten), `terraces`, `bench`, `grass`.
actorPos: `mala` (an der Kante, Blick 'R').
entries: `map` (links, Blick 'R'). `start`: links.
Geistersicht: sehr leise viele Namen an den Steinen, wie Kreide unter Wasser (unlesbar).
dynamic: Gras im Wind, Vögel; mittags ein ferner Glockenklang (Ton, kein Bild).

## westbus — Westbusbahnhof · Breite 400
Phasen: Tagesphasen. `k3_d2`: der Bus aus München steht da (`S.munich`).
Bild: kleiner moderner Busbahnhof am Westufer: Bussteig unter einem Blechdach, Bänke, eine Anzeige. Links das **Café „Zdravko“** mit großem Fenster (drinnen sichtbar ein Fenstertisch) und einer Tür. Rechts der Bussteig; bei `S.munich` ein Reisebus mit Schild „MÜNCHEN – MOSTAR“, Gepäckklappe offen.
Lauffläche: y≈112–138, x 6–394.
Spots: `exit` (zum Stadtplan), `cafe_door` (ins Café), `cafe_window`, `bus` (nur bei `S.munich`), `platform`, `bench`, `timetable`.
actorPos: `davor` (am Bus, Blick 'L'), `lena` (neben ihm, Blick 'L').
entries: `map` (links, Blick 'R'), `kafic` (an der Cafétür, Blick 'R'). `start`: links.
Zustände: `S.munich` (Bus aus München da).
dynamic: Bus-Abgas, Taube.

## kafic — Café „Zdravko“ am Westbusbahnhof · Breite 320, Innenraum
Phasen: Tagesphasen.
Bild: kleines Café der 1980er: Resopaltische, Stühle, eine Theke mit Espressomaschine und Rakijaflaschen, ein Fernseher in der Ecke, Fenster zum Bussteig. An der Wand eine **alte gerahmte Landkarte** (Straßenkarte der Region, 1985, vergilbt). Am **Fenstertisch** ein Stuhl mit Blick auf den Bussteig.
Lauffläche: y≈114–138, x 10–310.
Spots: `door` (zum Bussteig), `oldmap` (die Karte an der Wand), `bar` (Theke), `window_table` (Fenstertisch), `tv`, `photos` (Fotos an der Wand, darunter eines von Mate).
actorPos: `zdravko` (hinter der Theke, Blick 'L'), `mate` (Geist, am Fenstertisch **sitzend**, Blick 'R', mit Hut und Thermoskanne).
entries: `westbus` (Tür, Blick 'L'). `start`: an der Tür.
Geistersicht: am Fenstertisch eine Thermoskanne, die dampft.
dynamic: Fernseher flimmert, Dampf aus der Maschine.

## vulkanizer — Vulkanizer Rajić: Laden und Büro · Breite 400
Phasen: Tagesphasen.
Bild: Reifenwerkstatt, Wellblech und Ziegel: Reifenstapel, Montiermaschine, Kompressor, Werkzeugwand, ein alter Kalender. Rechts abgetrennt durch eine Glaswand das **Büro**: ein Schreibtisch mit **drei Schubladen untereinander** (gut erkennbar, mit Schlössern), Ordner, ein Telefon, ein Aschenbecher. Hinten ein Rolltor zum Hof (geschlossen; `S.yardOpen` offen) und ein Fenster mit Blick auf eine Plane im Hof.
Lauffläche: y≈114–138, x 10–390.
Spots: `door` (Straßentür, zum Bulevar), `yard_door` (Rolltor zum Hof), `desk`, `drawer1` (oben), `drawer2` (Mitte), `drawer3` (unten), `tires`, `machine` (Montiermaschine), `compressor`, `calendar`, `window`, `ashtray`.
actorPos: `vlado` (an der Montiermaschine, Blick 'L'), `kata` (im Büro am Schreibtisch, **sitzend**, Blick 'L').
entries: `bulevar` (Tür, Blick 'R'), `vhof` (Rolltor, Blick 'L'). `start`: an der Tür.
Zustände: `S.yardOpen`, `S.drawerOpen` (unterste Schublade offen, Mappe auf dem Tisch), `S.closed` (Laden zu: Rollladen halb unten, Vlado weg).
Geistersicht: in der untersten Schublade schimmert etwas (ein Schlüssel mit Holzanhänger) – nur wenn Mala hinsieht, also immer zart sichtbar.
dynamic: Kompressor zittert, Zigarettenrauch über dem Aschenbecher.

## vhof — Hof des Vulkanizers mit dem TAM · Breite 320
Phasen: Tagesphasen, `k3_fin_n` (Abfahrt, Nacht).
Bild: Hof mit Schotter, Bretterzaun, Altreifen, Ölfässer. In der Mitte der **TAM 4500**, ein alter Lastwagen (Jugoslawien, 1970er/80er: kantige Kabine, Rundscheinwerfer, Pritsche), **unter einer Plane** (`S.tarpOff`: Plane abgenommen). Die Fahrertür des **Führerhauses** ist gut erkennbar.
Lauffläche: y≈116–138, x 10–310.
Spots: `door` (Rolltor, zurück in die Werkstatt), `tam` (der Lastwagen), `cab` (Führerhaus), `tarp` (Plane), `fence`, `barrels`.
actorPos: `mala` (am Kotflügel, Blick 'L'), `vlado` (Finalnacht: an der Fahrertür, Blick 'L'), `kata` (Finalnacht: neben dem Laster, Blick 'R').
entries: `vulkanizer` (Tor, Blick 'R'). `start`: am Tor.
Zustände: `S.tarpOff`, `S.lights` (Scheinwerfer an, Finalnacht).
Geistersicht: im Führerhaus ein blasses Leuchten am Armaturenbrett.
dynamic: Plane flattert (Bura), bei `S.lights` Scheinwerferkegel.

## zelenika — Haus Zelenika mit Feigengarten · Breite 400
Phasen: `k3_d2`, `k3_d3` (Tag), am `k3_d3` nachmittags/abends mit Mate am Tor.
Bild: ein einfaches zweistöckiges Haus der 1970er (Gastarbeiterhaus: rohe Ziegel oben unverputzt, unten verputzt, Balkon mit Eisengeländer), ein **Gartentor** aus Eisen mit einem **Pfosten** (an dem Mate immer stand), zwei **Feigenbäume** (kahl, große Äste, noch **nicht eingepackt**; `G.flags['k3.b.figs']`: eingepackt in Jute, mit Schnur), ein Weinstock, eine Bank. Links das kleine Nachbarhaus von Jela mit Küchenfenster und Tür.
Lauffläche: Hof und Weg vor dem Tor, y≈114–138, x 6–394.
Spots: `exit` (zum Stadtplan), `gate` (Tor), `post` (Pfosten am Tor), `figs` (die Feigenbäume), `fork` (Astgabel des großen Feigenbaums, dort liegt später der Schlüssel: nur wenn `G.flags['k3.b.keyFree']`), `house_door` (zur Stube), `jela_door` (Jelas Haus), `bench`, `vine`.
actorPos: `jela` (vor ihrer Tür, Blick 'R'), `davor` (im Hof, Blick 'L'), `lena` (am Tor, Blick 'R'), `mate` (Geist, am Pfosten, Blick 'R').
entries: `map` (links, Blick 'R'), `zelenika_in` (Haustür, Blick 'L'). `start`: links vor dem Tor.
Geistersicht: am Pfosten eine Abnutzung, als hätte sich jemand jahrelang daran gelehnt.
dynamic: Laub, ein Hund bellt fern (Ton).

## zelenika_in — Im Haus Zelenika: Stube und Kinderzimmer · Breite 400, Innenraum
Phasen: `k3_d2`, `k3_d3`.
Bild: links die **Stube**: Tisch mit Wachstuch, ein Schuhkarton mit **Briefen** (Mates Briefe, Durchschläge/Rückläufer), eine Kommode mit **Mates Schublade**, ein Röhrenfernseher mit Häkeldeckchen, Fotos an der Wand (Mate jung mit Koffer vor einem Bus), ein Kalender von 2010. Rechts eine **Treppe** nach oben, oben angeschnitten das **Kinderzimmer**, durch eine offene Tür sichtbar (Zwischenstock: rechts oben ein Raum mit Kinderbett, Tapete mit Ballons, einem Regal mit einem bunten Kinderbuch; Titel unleserlich, keine echten Buchtitel).
Lauffläche: Stube y≈116–138 x 10–260; Treppe zum Kinderzimmer: Spot (Marko geht hinauf per Skript, das Bild muss den oberen Raum nicht begehbar machen).
Spots: `door` (zum Hof), `letters` (Schuhkarton mit Briefen), `drawer` (Mates Schublade), `photos`, `tv`, `calendar`, `stairs` (Treppe), `kidsroom` (das Kinderzimmer oben), `kidsbook` (das Buch im Regal), `kidsbed`.
actorPos: `davor` (am Tisch, **sitzend**, Blick 'R'), `lena` (an der Treppe, Blick 'L').
entries: `zelenika` (Tür, Blick 'R'). `start`: an der Tür.
Geistersicht: im Kinderzimmer warme, unbenutzte Erwartung (ein goldener Schimmer am Bett).
dynamic: Staub im Licht, Uhr tickt.

## vermisst — Vermisstenstelle (Büro) · Breite 320, Innenraum
Phasen: `k3_epi_d`.
Bild: ein nüchternes Büro in einem Verwaltungsbau: Schreibtisch mit PC (Röhrenmonitor), Formularstapel, Stempel, ein Aktenschrank, eine Wand mit vielen Fotos Vermisster (kleine Rechtecke, Gesichter nur angedeutet, **keine echten Bilder**), ein Fenster mit Lamellen, zwei Besucherstühle, ein Wasserkocher. Ein Plakat mit einem Tropfen-Symbol („Blutprobe – Krvni uzorak“).
Lauffläche: y≈116–138, x 10–310.
Spots: `door` (zum Stadtplan), `desk`, `form` (Formular), `wall` (Wand mit Fotos), `poster`, `cabinet`, `chairs`, `window`.
actorPos: `kolar` (am Schreibtisch, **sitzend**, Blick 'L'), `nada` (auf einem Besucherstuhl, **sitzend**, Blick 'R').
entries: `map` (Tür, Blick 'R'). `start`: an der Tür.
dynamic: Lamellen werfen Streifen, der Monitor flimmert.

## skela_d — Skela, rechtes Ufer: Anlegestelle · Breite 480, scrollend
Phasen: `k3_d2_n` (Nacht), `k3_d3` (Tag), `k3_fin_n` (sehr dunkel), `k3_epi_d` (grau).
Bild: ein Hochufer über einer Flussbiegung, zehn Kilometer südlich von Mostar, ländlich. Eine Schotterstraße endet an einer verfallenen **Hütte** (Steinmauern, halbes Dach). Am Ufer ein **Holzpfosten mit einer Glocke** (Schiffsglocke aus Messing, grün angelaufen, mit Seilzug). Ein rostiger **Seilanker** (Betonblock mit Eisenring, ein Stück altes Stahlseil hängt ins Wasser). Im Fluss die **Pfeilerstümpfe** der alten Brücke (drei Steinstümpfe, „wie abgebrochene Zähne“). Flussauf rechts die **neue Brücke** (Beton, 1998) mit einer Laterne. **Drüben** (Hintergrund, über dem Wasser) das linke Ufer: Zlatas Haus mit drei unterscheidbaren Fenstern (unten ein **breites** Küchenfenster, unten daneben ein **tiefes, schmales** Stubenfenster, oben unter dem Dach ein **kleines Dachfenster**), daneben Batos Schuppen und ein Quittenbaum.
Lauffläche: Uferplatz y≈114–138, x 10–470; rechts geht es zur neuen Brücke.
Spots: `road` (Straße/Taxi, linker Rand, zum Stadtplan), `hut`, `bell`, `anchor`, `stumps`, `river`, `far_house` (das Haus drüben; Lichtprobe), `far_shed` (Schuppen drüben), `far_tree` (Quittenbaum drüben), `to_bridge` (rechts, zur neuen Brücke), `landing` (Anlegestelle am Wasser; Finalnacht: die Geisterfähre legt hier an).
actorPos: `komsija` (Nachbar mit Hund, Nacht 2: an der Straße, Blick 'R'), `mala` (an der Glocke, Blick 'R'), `vlado` und `kata` (Finalnacht, an der Straße), `bato` (Finalnacht: auf der Geisterfähre am Anleger, Blick 'L').
entries: `map` (Straße, Blick 'R'), `skela_most` (rechts, Blick 'L'). `start`: an der Straße.
Zustände: `S.lit` (welches Fenster drüben leuchtet: `'kitchen'` | `'stube'` | `'roof'` | null; liest `G.flags['k3.lit']`), `S.lantern` (drüben im Schuppen brennt eine Sturmlaterne: Nacht 2 und Finalnacht), `S.ferry` (Finalnacht: die Geisterfähre – Ponton mit Geländer – liegt `'far'` drüben, `'mid'` mitten im Fluss, `'here'` am Anleger, `'gone'`), `S.zvono` (die Glocke schwingt).
Geistersicht: über dem Fluss ein **gespanntes Stahlseil aus Licht**, vom Anker zum anderen Ufer (das Seil von 1994); an der Glocke eine Leine aus Licht, die über den Fluss zum Schuppen führt (Batos Leine) – ab `G.flags['k3.bato.found']`.
dynamic: Strömung, Strudel an den Stümpfen, Glocke schwingt bei `S.zvono`, Laterne flackert drüben, Fähre bewegt sich (Position aus `S.ferry`, weiche Bewegung über `view.t` ist erlaubt, das Spiel setzt die Endpositionen).

## skela_most — Skela, die neue Brücke · Breite 320
Phasen: wie `skela_d`.
Bild: eine schmale Betonbrücke von 1998 über die Neretva, Geländer aus Rohr, eine Laterne, eine **Spendertafel** am Brückenkopf (Messing: „Ovaj most je izgrađen 1998. … donacija …“, Text frei erfunden, ohne echte Organisationen). Flussab (links) sieht man die Pfeilerstümpfe und das Seil nicht (zu weit), nur den Fluss.
Lauffläche: der Brückenweg, y≈118–134, x 6–314.
Spots: `exit_d` (links, rechtes Ufer), `exit_l` (rechts, linkes Ufer), `plaque`, `railing`, `river`, `lamp`.
actorPos: keine.
entries: `skela_d` (links, Blick 'R'), `skela_l` (rechts, Blick 'L'). `start`: links.
dynamic: Wasser, Laterne.

## skela_l — Skela, linkes Ufer: Zlatas Hof, Batos Schuppen, der Quittenbaum · Breite 480, scrollend
Phasen: `k3_d2_n`, `k3_d3`, `k3_fin_n`, `k3_epi_d`.
Bild: Bauernhof am Flussufer: Zlatas **Haus** (zweistöckig, weiß verputzt, Steinplattendach, unten ein breites Küchenfenster, daneben ein tiefes schmales Stubenfenster, oben unter dem Dach ein kleines **Dachfenster**; die Fenster sind dieselben wie in `skela_d` von drüben), Haustür, Holzstapel, Hühner. **Batos Schuppen** (Holz, offen zum Fluss, darin eine Sturmlaterne, Ruder, ein Netz, eine Wathose am Haken). Der **Quittenbaum** mit einem kleinen **Grab** darunter (ein Beet mit Chrysanthemen, ein flacher Stein, ein verwittertes Brett mit eingeschnitztem „MALA · 15.1.1994“ – gut lesbar erst in Nahsicht, im Raum nur angedeutet). Der **Anleger** des linken Ufers (Holzsteg). Drüben (Hintergrund) das rechte Ufer mit Glocke und Hütte, klein.
Lauffläche: Hof und Ufer, y≈114–138, x 10–470.
Spots: `to_bridge` (links, zur neuen Brücke), `house` (das Haus; Lichtprobe), `house_door` (zur Küche), `shed` (Schuppen), `quince` (Quittenbaum), `grave`, `board` (das geschnitzte Brett), `landing` (Anleger), `hens`, `woodpile`, `far_bell` (die Glocke drüben).
actorPos: `zlata` (vor der Haustür, Blick 'L'), `bato` (Geist, im Schuppen, Blick 'L'), `nada` (Epilog: am Grab, Blick 'R'), `vlado` (Finalnacht/Epilog), `kata` (Finalnacht), `mala` (am Grab, Blick 'L').
entries: `skela_most` (links, Blick 'R'), `zlata_k` (Haustür, Blick 'R'). `start`: links.
Zustände: `S.lit` (wie in `skela_d`: das Fenster leuchtet von innen), `S.lantern` (Laterne im Schuppen), `S.zlataLamp` (Zlata steht mit einer Petroleumlampe draußen: Finalnacht), `S.ferry` (die Geisterfähre liegt am Anleger: `'here'`).
Geistersicht: am Quittenbaum **das Ende von Malas Leine** (sie geht zum Haus, zu Zlata); im Schuppen eine Leine aus Licht von Bato über den Fluss zur Glocke.
dynamic: Hühner picken, Rauch aus dem Schornstein (Tag), Laterne, Quittenblätter (eine letzte gelbe Quitte am Baum).

## zlata_k — Zlatas Küche · Breite 320, Innenraum
Phasen: `k3_d3`, `k3_fin_n`, `k3_epi_d`.
Bild: niedrige Bauernküche: ein gemauerter **Holzherd** (Šporet) mit Messingstange und Wasserkessel, daneben ein schmales Bett/Sofa mit **grauen Wolldecken** (Armeedecken, mit einem schwarzen Streifen), ein **Radio** (alt, Holzgehäuse) auf einem Regal, ein Tisch mit Wachstuch, eine **Küchenschublade** im Tisch, ein Fenster (das breite Küchenfenster), Heiligenbild **nein** (keine religiösen Zeichen), stattdessen ein Kalender und Zwiebelzöpfe. Eine Treppe/Leiter nach oben (zur Dachkammer, nicht begehbar).
Lauffläche: y≈116–138, x 10–310.
Spots: `door` (hinaus in den Hof), `stove` (Herd), `blankets` (Decken), `radio`, `drawer` (Küchenschublade), `table`, `window`, `ladder` (Leiter zur Kammer), `calendar`.
actorPos: `zlata` (am Herd, Blick 'L'), `nada` (Epilog, am Tisch **sitzend**, Blick 'R').
entries: `skela_l` (Tür, Blick 'L'). `start`: an der Tür.
Geistersicht: am Herd eine **Kuhle in der Luft**, wo jemand lange lag (zarter Umriss auf dem Sofa).
dynamic: Feuer im Herd (Glut im Spalt), Dampf aus dem Kessel, Radio-Lämpchen.

---

## Stadtplan Mostar — `game/src/rooms/art/map3.js`
`M.paintMap3(S,GS)` → `M.Buf(320,144)`, Stil wie `map2.js` (Papierkarte, Höhenlinien, gedeckte Farben). Inhalt: die Neretva von Nord nach Süd durch die Mitte (grün-blau), Ostufer rechts, Westufer links, die Alte Brücke (Symbol: Bogen), die Straßenbrücke, der Bulevar als breite Linie am Westufer, Hügel. Ganz unten (y > 128) ein **ausgefranster Kartenrand** mit einem Pfeil „→ Skela 10 km“ – Skela liegt außerhalb und wird als Marke am unteren Rand gezeigt. Kartusche „MOSTAR 2011“, Kompass.
`M.MAP3_POS = { id:[x,y] }` (Mittelpunkt des Symbols) und `drawIcon3(b,id,on)` wie in `map2.js`. Die Orte (IDs fest): `ostbus` (Ostufer Nord), `herberge` (Ostufer Altstadt), `kujundziluk` (Ostufer, an der Brücke), `koski` (Ostufer, am Fluss), `tepa` (Ostufer, Altstadtrand), `strassenbr` (Brücke über die Neretva, nördlich der Alten Brücke), `bulevar` (Westufer, Mitte), `partizan` (Westhang, oben links), `westbus` (Westufer Nord), `zelenika` (Westufer Süd, Wohngebiet), `vermisst` (Ostufer Nord), `skela` (Marke am unteren Rand, Mitte). Abstände der Symbole mindestens 20 px. Namen setzt das Spiel selbst (die Funktion muss `M.mapNoNames` beachten wie `map2.js`, und `M.mapIconVis(id,GS)` für Sichtbarkeit).

## Kartenansicht der Peilung — `game/src/rooms/art/peilung.js`
`M.paintPeilung(b, st)` malt in einen `M.Buf(280,150)` eine größere Karte (Ausschnitt Mostar + Fluss bis 12 km südlich, ohne Ortsnamen außer Landmarken), auf der die Fächer der Peilung liegen. `st` = `{ fans:[{from:[x,y], a0, a1}], area:[...polygon]|null, skela:bool }`. Die Standorte: `bridgehead` [~150,52], `minaret` [~158,58] (nahe dabei!), `partizan` [~96,40] (weit links und höher). Landmarken mit festen Positionen (für die Auswahl): `L_church` (Glockenturm Westufer), `L_crane1`, `L_crane2` (Kräne), `L_tower` (Hochhaus Ostufer), `L_hum` (Hügel West), `L_velez` (Berg Ost), `L_bend` (Flussbiegung Süd), `L_mill` (Mühle am Fluss, Süd). Exportiere `M.PEIL = { stations:{…:[x,y]}, landmarks:{…:[x,y]} }` (Koordinaten im 280×150-Bild). Das Spiel berechnet die Fächer und den Schnittbereich und zeichnet sie darüber; die Kunst liefert die Karte und hilft mit `M.peilFan(b,from,p1,p2,col)` (einen Fächer zwischen den Richtungen zu zwei Landmarken zeichnen, halbtransparent über Bayer-Dither) und `M.peilArea(b,poly,col)`.

## Zwischenwelt
Der Raum `limbo` bleibt. Neue Bruchstücke (in `game/src/97_k3_limbo.js` gezeichnet, nicht als Raumkunst): für **Mate** eine Bushaltebank mit Feigenkübel und Haltestellenschild ohne Namen; für **Bato** ein Ponton an einem Seil, das ins Licht führt. Siehe `97_k2_limbo.js` für das Vorbild.

## Erinnerungsbilder — `game/src/97_k3_mem.js`
232 × 104 Pixel, wie `97_k2_mem_a.js` (natürliche Farben, das Spiel tönt: `tint 'ghost'` kalt-blau, `'memory'` sepia). IDs fest:
- `M.mem.k3_bus` – Im Bus nach Mostar: Fensterblick auf die grüne Neretva im Regen, Felswände, ein Sitz mit angezogenen Knien (Mala, nur Umriss im Fensterspiegel), eine halbe Pita auf dem leeren Sitz.
- `M.mem.k3_mybridge` – Malas Brücke: drei Steinstümpfe im schwarzen Wasser, angeleuchtet von zwei Lastwagenscheinwerfern, Regen, „wie abgebrochene Zähne“.
- `M.mem.k3_cab` – Im Führerhaus, Nacht: Armaturenbrett-Licht, ein Mann mit Zigarette am Steuer (Vlado jung, 47), daneben eine junge Frau (Lana, 17, Zopf) mit Skizzenbuch und Bleistift.
- `M.mem.k3_hut` – Die Hütte: ein Mädchen auf einem Mehlsack, eine Kerze, Mehlsäcke und Deckenballen, ein Bleistift.
- `M.mem.k3_bell` – Die Glocke bei Nacht: eine junge Frau am Pfosten zieht am Glockenseil, drüben ein kleines Licht in einem Dachfenster.
- `M.mem.k3_rope` – Das Seil: zwei Hände an einem Stahlseil über schwarzem Wasser, Gischt (keine Gesichter, kein Körper im Wasser).
- `M.mem.k3_blanket` – Ein Mädchen in einer grauen Decke an einem Herd, zitternd, eine alte Frau reibt ihre Hände.
- `M.mem.k3_oven` – Die letzte Erinnerung (sepia): Herd, Decken, ein Radio mit Lämpchen, Licht von einem Fenster, eine Hand in einer anderen Hand.
- `M.mem.k3_lightorder` – Drei kleine Bilder nebeneinander: Glocke/Fenster dunkel, Glocke/Fenster hell, Glocke/Fenster dunkel (für die Reihenfolge).
- `M.mem.k3_mate` – Mate am Tor in den 1990ern: ein Mann mit Hut und Thermoskanne am Pfosten, ein Bus fährt vorbei, ein Schlüssel in seiner Hand.
- `M.mem.k3_ferry` – Die Geisterfähre: ein Ponton an einem Lichtseil über dem Fluss, ein alter Mann mit Stange, eine junge Frau mit einer Dose (für das Finale).
- `M.mem.k3_vratnik` – Vratnik im Winter 1994: ein Junge hackt Holz vor einem kleinen Haus, im Fenster ein heller Fleck.
- `M.mem.k3_home` – Im Bus nach Sarajevo: Nada am Fenster, daneben ein heller Fleck (Mala), vorne zwei Hinterköpfe.
- `M.mem.k3_sketch1` – Skizzenbuchseite: Bleistiftzeichnungen (Treppe im Palma, eine Straßenbahn „3“, „KUĆA“, ein Mann mit Teeglas).
- `M.mem.k3_sketch2` – Skizzenbuchseite: ein Junge mit großen Ohren, ein Fahrer mit Zigarette, ein Fluss mit einem Licht, oben „Dubrovnik 1991“ mit Meer und Mauer.
- `M.mem.k3_springer` – Der Springer aus den Sechzigern (Badehose, Seitenscheitel) im Sprung vor dem Bogen.
