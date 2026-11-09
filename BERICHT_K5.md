# Bericht Kapitel 5: Sarajevo („Angekommen“)

Kapitel 5 (1. bis 5. März 2012) ist gebaut, durchgespielt und geprüft. Es ist das Finale der Reihe: Lanas Begräbnis, ihr letzter Samstag, ihr Gehen, Zorans Begräbnis. Grundlage ist `KAPITEL5_KONZEPT.md` (Richtung „Angekommen“, ein Ende, mit der Ergänzung „Markos Atem“). Die Komplettlösung steht in `LOESUNG5.md`, alle Hinweistexte in `HINWEISE.md`.

## Umfang
- **Ablauf:** 8 Abschnitte: Prolog „Ankunft“, Donnerstag, Donnerstagnacht, Freitag, Lanas Begräbnis, Freitagabend mit der Nacht auf der Žuta tabija, Samstag „Zehn nach elf“, Epilog „Montag“ (dazwischen die Karte „Sonntag“). Ein Abschnitt endet erst nach seinen Pflichtschritten; in der Donnerstagnacht geht man in der Pension ins Bett.
- **Räume:** 14. Drei neue Bilder (Treppenhaus im siebten Stock, An der Brauerei, Friedhof Bare), dazu elf Räume mit Bildern aus Kapitel 2 unter eigenen Kennungen (`stanica5`, `pansion5`, `vratnik5`, `kuca5`, `neboder5`, `haustor5`, `stan5`, `carsija5`, `kazandziluk5`, `tramvaj5`, `institut`). Kapitel 2 bleibt dadurch unberührt.
- **Stadtplan:** der Plan von Sarajevo aus Kapitel 2 mit neun Orten, vier davon neu (Kazandžiluk als eigener Ort, Brauerei, Gerichtsmedizin, Friedhof Bare) mit eigenen Symbolen.
- **Figuren:** ein neuer Geist, Hamdija Selimović, Abfüller der Brauerei (Figur und Porträt), und Fra Ivo, Franziskaner von Sveti Ante, der Zorans Begräbnis hält. Alle anderen Figuren kommen aus Kapitel 2 bis 4.
- **Text:** rund 1100 gesprochene und erzählte Zeilen in drei Szenendateien und den Raumdateien, dazu etwa 380 Beschreibungen. 33 Notizen, 5 Schlüsse (zwei davon als mehrstufige Kette), 4 Gegenstände (Kanister leer und voll, Hamdijas Liste, Malas Dose).
- **Hinweise:** vier Stufen, 25 Themen.
- **Ton:** Musik und Klangkulissen aus Kapitel 2 bis 4, zwei neue Kulissen (Brauerei, Bare).

## Neu in der Engine
- **Malas Verb „Zeichne“:** erscheint nur, wo eine Bedingung im Raum es erlaubt (`g.draw`, `g.drawIf`). Gebraucht in der Donnerstagnacht (Pensionsfenster) und am Samstag (Nadas Balkontür). Bosnische Oberfläche: „Crtaj“.
- **Zeichnungen auf beschlagenem Glas:** eine Bildebene über den Bildern aus Kapitel 2 zeigt den Beschlag, die Drei, die Straßenbahn mit Gesichtern und Rädern (eiförmig am Samstag, rund am Montag) und lässt sie wieder vergehen.
- **Eigener Stand „Vor dem Samstag“:** `E.saveSpecial('sat')` schreibt am Punkt ohne Rückkehr einen Stand neben die drei Lesezeichen (`mala.mark.N.sat`). „Spiel laden“ führt ihn mit dem Abzeichen „Punkt ohne Rückkehr“. Die Lesezeichen des Spielers bleiben unberührt.
- **Raumzustände frisch:** Die Räume von Kapitel 5 setzen ihren Zustand bei jedem Betreten aus dem Spielverlauf neu (`load`). Vorher blieb ein Zustand auf dem Stand des ersten Besuchs (Mačak auf dem Fensterbrett statt auf dem Bett, der Friedhof ohne Ableger).
- **Kapitelrahmen:** Kapitel 5 im Titelmenü, in der Kapitelwahl, im Abspann-Archiv und nach dem Abspann von Kapitel 4 („Weiter mit Kapitel 5“). Ende der Reihe: Abspann mit Widmung, kein „Weiter“.
- **Übernahmen aus Kapitel 3 und 4:** Zustimmung am Grab, Versprechen, Probe in Mostar oder im Konsulat, die Kurve, Pantoffeln, Dose, Davors Angebot. Ohne Stand gelten Zustimmung b, Versprechen a, Probe ja, Pantoffeln und Dose ja.
- **Kleinigkeiten:** Das Busschild am Busbahnhof kennt München; die Pension aus Kapitel 2 liest Mačaks Platz aus dem Raum, in dem sie gerade steht.

## Prüfungen (Endbau `web/`)
- **Durchlauf Kapitel 5** (`game/tools/walkthrough5.js`, nur Spielerhandlungen, kein gesetzter Schalter): 55 Schritte, 195 s, Spieltakt der Musterlösung 81 min, keine JS-Fehler, Kapitelende in `mala.c5end` gemerkt.
- **Variante** (`MALA_K5VAR=1`): Übernahmen aus Kapitel 3/4, Taxi nach Vratnik, ohne optionale Schritte (Fahrschein, Rade, Damir), alle anderen Antworten: 51 Schritte, 192 s, keine JS-Fehler. Geprüft werden auch die Variantensätze (Konsulat, vergessene Dose, Pantoffeln, Davors Zweig).
- **Laden mitten im Kapitel:** Die Durchläufe setzen an jeder Abschnittsgrenze aus einem gespeicherten Stand fort (`MALA_SNAP`/`MALA_FROM`).
- **Hinweisprüfung** (`game/tools/hintcheck.js` auf den Ständen des Durchlaufs): 55 Stände, 0 Fehler; die Laufzeitprotokollierung des Treibers fand nach jeder Aktion ein offenes Thema.
- **Offlinetest** (`game/tools/offlinetest.js`): OK, auch Kapitel 5 startet ohne Netz am Busbahnhof.
- **Übergang aus Kapitel 4:** Nach einem Kapitelende-Stand von Kapitel 4 führt das Titelmenü in den Prolog von Kapitel 5.
- **Oberfläche:** UI-Tests Phase 1 bis 5 und Spielstand-Kompatibilität: 306 Prüfungen, 0 Fehler. Phase 2 erwartet jetzt ein spielbares Kapitel 5 (gesperrt „nach Kapitel 4“, mit Stand aus Kapitel 4 startbar).
- **Regressionstests** (`qa/regress/run.js`): alle neun grün.
- **Alte Kapitel:** Die Durchläufe von Kapitel 1, 2, 3 und 4 laufen gegen den Bau mit Kapitel 5 fehlerfrei.
- **QA-Gerüst:** `qa/sim.js` und `qa/browser/uirun.js` erwarten nach dem Abspann von Kapitel 4 jetzt „Weiter mit Kapitel 5“. Die 4000 Simulationsläufe wurden für diesen Bau nicht wiederholt.

## Lieferung
- `web/` (eine `index.html`, Service Worker, Icons, `LIESMICH.txt`, `AENDERUNGEN.txt`) und dasselbe als Netlify-ZIP: `dist/MALA_netlify_oberflaeche.zip` (Prüfsummen in `dist/SHA256SUMS_oberflaeche.txt`).

## Nach der ersten Rückmeldung geändert
- **Friedhof Bare** zeigt den katholischen Teil: Kreuze aus Stein und Holz, Grabsteine mit eingemeißeltem Kreuz, Einfassungen, rote Grablichter. Vorher standen dort schlanke weiße Stelen, die wie ein muslimischer Friedhof aussahen.
- **Zorans Grab und Begräbnis sind katholisch** (Vuković ist eine katholische Familie): Holzkreuz mit weißer Tafel, Kränze mit Schleifen, Grablichter; Fra Ivo spricht „U ime Oca …“ und „Pokoj vječni“, besprengt den Sarg mit Weihwasser, Mama bekreuzigt sich und zündet ein Grablicht an. „Poginuo“ kommt auf den Stein, der im Sommer kommt; bis dahin steht auf der Tafel am Kreuz Name und Jahre.
- **Lanas Grab und Begräbnis bleiben konfessionslos** (Entscheidung des Autors): kein Priester, kein Imam, der Eichenpfosten ohne religiöses Zeichen.
- **Abgleich mit Kapitel 2:** Esad Delić ist 2005 gestorben (nicht 1999); das Hausbuch zeigt dieselben Einträge wie in Kapitel 2; Lana hat Sarajevo im November 1993 mit dem Bus verlassen (Nadas Briefe, Vesnas Artikel, „Ich komme“ am Tor im November 1993); die neuen Nachbarn im siebten Stock heißen Begić.

## Abweichungen vom Konzept
- **Der Geist heißt Hamdija Selimović,** nicht Fikret Mulić: In Kapitel 2 gibt es schon einen Fikret (Busbahnhof). Seine Liste ist „H. S., punionica“ unterschrieben.
- **Die Kanister liegen im Garten,** unter Hajras Plane beim Holz, nicht auf dem Dachboden. Hajra sagt es bei der Begrüßung. Der Dachboden mit Hakenstange, Zastava-Schlüssel und Etui ist nicht spielbar; die Quitten liegen auf Ružas Küchenschrank.
- **Die Zeichnung am Samstag** entsteht auf Nadas gläserner Balkontür neben der Küchenzeile: Nadas Wohnung aus Kapitel 2 hat keine eigene Küche mit Fenster.
- **Hamdijas Übergang** geschieht am Hahn, über Malas „Hinüberbringen“, ohne Zwischenwelt.
- **Die zwei Proben des Atems** (Spiegel, Mia) und die Rekonstruktion des neunzehnten April („Neben ihr stehen“) sind erzählt, nicht einzeln steuerbar. `a5_grenze` ist in `a5_atem` aufgegangen.
- **Nedžads Zollstock** ist ein Satz: Vlado hat das Brett gemessen, zweiunddreißig Zentimeter.
- **Der Weg nach Vratnik** am Samstag ist eine Folge von drei erzählten Haltepunkten, kein freier Weg.
- **Nicht umgesetzt:** Dragicas zweites Gespräch am Freitag, Hajras Frage nach dem „Mädchen mit dem Mali“ als eigener Auftritt (sie steckt im Gespräch), die Plastikflasche als Fehlversuch an der Brauerei, ein eigenes Erinnerungsbild für die Dämmerung auf der Bastei. Neue Erinnerungsbilder gibt es keine; die Nachhalle nutzen Bilder aus Kapitel 2 bis 4.

## Offen
- **Spieldauer:** Die Musterlösung braucht 81 Minuten Spieltakt, das Konzept schätzte 140 bis 160 (Kapitel 4: 150). Ein erstes Spielen mit Lesen und Suchen dauert länger, gemessen ist das nicht.
- **Kein blinder Spieldurchgang** durch unabhängige Spieler.
- **Musik:** keine neuen Stücke; Kapitel 5 nutzt Musik aus Kapitel 2 bis 4.
- **Figurenplätze** in den Bildern aus Kapitel 2 sind an Bildschirmfotos geprüft (Busbahnhof, Pension, Vratnik, Treppenhaus, Nadas Wohnung, Brauerei, Bare, Ružas Küche), nicht in jeder Phase jedes Raums.
- **Nur Deutsch.** Die bosnische Oberfläche übersetzt das neue Verb, nicht die Texte.
- `qa/sim.js` (4000 Läufe) und `game/tools/klicktests.js` spielen Kapitel 5 nicht.
