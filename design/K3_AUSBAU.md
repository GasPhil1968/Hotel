# MALA – Kapitel 3 „Mostar“: Ausbau

Konzept, Rätselnetz und Umsetzungsstand für die Erweiterung des dritten Kapitels. Erste Fassung: 10. November 2026. **Nach der zweiten externen Prüfung: Teil S (zuerst lesen), dann Teil R (Revision nach dem ersten Prüfbericht).** Wo die Abschnitte A–I der ersten Fassung überholt sind, steht es dort ausdrücklich.

Kennzeichnung in diesem Dokument:

- **[B]** tatsächlich vorhandener und geprüfter Spielinhalt (Code in `game/src`, geprüft mit dem Inventar vom 10.11.2026).
- **[V]** Vorgabe des Autors (Master-Prompt).
- **[N]** neu entwickelte Ergänzung.
- **[H]** historisch belegt (Quelle genannt) · **[H?]** plausibel, nicht belegt.
- **[?]** ungeklärte Annahme oder technische Einschränkung.

Die Umsetzung ist in Abschnitt G mit „umgesetzt“, „nur konzipiert“ oder „offen“ ausgewiesen.

---

## S. Zweite Prüfung (11. November 2026): zwei Restbefunde und der Fotovergleich

Die zweite Prüfung (Lieferung „11.11.2026 · 402502“) hat die Kernrevision abgenommen und zwei begrenzte Restfehler sowie einen gestalterischen Punkt benannt. Alle drei sind umgesetzt; sonst ist nichts umgebaut.

### S.1 Befunde und Änderungen

| Befund | Ursache | Änderung | Prüfung |
|---|---|---|---|
| **K3-R2-01** Epilog: Der Taxifahrer sagt „Vom Taxi“ und kündigt die Rückgabe an, obwohl die Batterie aus Mates Garage kam | `rooms/ostbus.js` prüfte nur, ob eine Ersatzbatterie eingebaut war; Vlados Nicken im Finale (`k3.fin.batteryNod`) gibt es in beiden Wegen und sagt nichts über die Herkunft | „Vom Taxi“ und die Rückgabe nur noch mit der geliehenen Taxibatterie (`k3.x.batteryGiven`, nicht `k3.b.batFrom = 'mate'`). Mit Mates Batterie eine eigene kurze Szene: „Rajić ist gefahren …“ – „Mit einer Batterie aus Mate Zelenikas Mercedes.“ – „Den Mercedes hat er jeden Winter abgeklemmt … für später.“ – „Dann war das später.“ Ohne Ersatzbatterie (alte Stände, schwache Batterie) das normale Epiloggespräch. | BUG-030 (1): neuer Weg, alter Weg mit Taxibatterie, alter Weg ohne Ersatz; die beiden Batteriewege vorher über den echten Spielstand gespeichert und geladen |
| **K3-R2-02** Samstagsende: Die vorbereitete Aufführung der Australier fehlt in der Liste offener Zusagen | `M.k3OpenThreads` behandelte Fotoausflug und Aufführung als *eine* Brückenzusage; das erledigte Pflichtfoto unterdrückte die Erinnerung an die unabhängige Musik | Eigener offener Punkt „music“, unabhängig vom Foto, für jeden angefangenen Zustand: Text und Dinos Erlaubnis da, nicht gespielt; nur Erlaubnis; nur Text; Aufführung ohne Ende (Text fehlte noch); Wiederholung mit Ende offen. Je Zustand ein eigener Satz, etwa „Die Australier warten an der Brücke. Den Text haben sie, gespielt haben sie noch nicht.“ Nichts angefangen: keine Warnung, die Aufführung bleibt freiwillig. „Noch nicht“ lässt sie spielbar; wer trotzdem beendet, hat sie bewusst zurückgestellt (`k3.left.music`, getrennt von den anderen Punkten). | BUG-030 (2): fünf Zustände; Ablehnen, danach Aufführung mit Lenas Strophe, Warnung weg; bewusstes Beenden |
| **Fotovergleich erklärt zu viel** (Gestaltung, kein Fehler) | Das Fenster zeigte Markos fertiges Urteil schon beim Öffnen, er wiederholte es danach, und am richtigen Ort schlug das Spiel selbst vor, durch den Stein zu sehen („Ich?“ – „Du.“) | Das Fenster zeigt zuerst die beiden Bilder und eine neutrale Beschreibung des Blicks („Von hier steht der Turm am linken Rand und ist breit …“). Der Spieler entscheidet: **„Hier stand er.“** oder **„Weitersuchen“**. Erst nach „Hier stand er.“ urteilt Marko (falsch: warum nicht; richtig: der Standort, die Platte liegt unter dem Quader). Kein ungefragter Vorschlag, Mala einzusetzen: Ihr Blick durch Holz und Deckel ist eingeführt (Zdravkos Schublade „Durch das Holz: eine Mappe“, Kapitel 1 und 2). Wer als Marko den Quader zu heben, zu schieben oder zu nehmen versucht, hört beim zweiten Versuch Mala: „Mit Händen nicht.“ Auf Wunsch helfen die Hinweise („Unter dem Quader“, vier Stufen). | BUG-027 (neu: vor der Entscheidung kein Urteil; „Weitersuchen“ bewirkt nichts; kein ungefragter Vorschlag; Versuche am Quader); `qa/ui/k3_revision.js` mit Maus („Hier stand er.“) und Finger („Weitersuchen“, dann „Hier stand er.“) |

Nicht geändert: Die neutralen Beschreibungen bleiben verständlich und nennen, was im Bild zu sehen ist; das Rätsel wird nicht durch weniger Information schwerer, sondern verlangt die eigene Entscheidung. Die Hinweisstufe 4 („Wo Mate stand“) sagt jetzt: „Unter der Brücke das Foto an die flache Platte halten und „Hier stand er.“ wählen.“

### S.2 Ergebnisse auf dem neuen Build

Alle Ergebnisse gelten für denselben Build: Stempel „11.11.2026 · 9b12c2“, `web/index.html` sha256 `35fbb71d1471…`. Die Protokolle liegen in `qa/protokolle/k3_2026-11-11/` und im Prüfpaket (S.3).

| Art | Werkzeug | Ergebnis |
|---|---|---|
| Ganzer Hauptweg, neues Spiel bis zum Abspann | `node game/tools/walkthrough3.js` | 131 Schritte, keine JS-Fehler |
| Gezielte Tests Kapitel 1–5, davon BUG-025 bis BUG-030 für Kapitel 3 | `node qa/regress/run.js` | 30/30 |
| Echte Maus und echter Finger (Chromium, Desktop und iPad-Größe) | `node qa/ui/k3_revision.js` | 40/40 Prüfpunkte |
| Hinweise: Stufe 4 an allen Ständen der Musterlösung und an 22 abweichenden Ständen | `node qa/hints/hintprobe.js --dumps …`, `--varianten` | ohne Befund: 255 + 44 Themen-Stände bestanden, 62 + 1 übersprungen (dieselben Gründe wie in R.8; der Fotovergleich wird mit „Hier stand er.“ ausgeführt) |
| Menschliche Spielwirkung, Safari/iOS-Gerät, Ton, Spielzeit | – | **nicht geprüft** |

### S.3 Prüfpaket

Die Netlify-ZIP enthält nur das Spiel. Damit die Testzahlen nachprüfbar sind, gibt es daneben `dist/Die_Stillen_Pruefpaket_K3.zip`: derselbe `web/index.html`, die Testwerkzeuge (`qa/regress`, `qa/hints`, `qa/ui`, `qa/vmdriver.js`, `game/tools`), dieser Bericht, `LOESUNG3.md`, `HINWEISE.md`, die Protokolle dieses Laufs und eine Anleitung (`PRUEFPAKET_LIESMICH.txt`). Regressionstests und Hinweisprobe laufen mit Node.js allein; Musterdurchlauf und Bedienprüfung brauchen zusätzlich Playwright mit Chromium.

---

## R. Revision nach dem Prüfbericht (MALA_Kapitel3_Pruefbericht.md)

Der Prüfbericht hat die erste Fassung als gute erzählerische Grundlage, aber nicht als Umsetzung des Auftrags bewertet. Er hat recht in den Punkten, die zählen: Die neuen Stränge waren alle freiwillig, die alten Tagesabschlüsse schnitten sie ab, drei neue Stellen hatten keine Trefferfläche, die Brücke war kein räumliches Rätsel, die beiden Geisterfälle berührten sich nur thematisch, und die Teilung der Stadt war Atmosphäre, keine Ursache. Diese Revision baut deshalb einen **erweiterten Hauptweg** mit wenigen tragenden neuen Knoten. Die erzählerischen Vertiefungen der ersten Fassung bleiben, als Vertiefungen.

Zwei Aussagen der ersten Fassung waren falsch und werden hier ausdrücklich zurückgenommen:
- „Keine neuen Trefferflächen“ (Abschnitt G): Handschuhfach, Autoradio und Zdravkos Schublade waren neue Stellen – ohne Fläche im Bild (K3-01).
- „Alle Pflichtschritte bleiben, Speicherkompatibilität ohne Migration“ (Abschnitt B.2, G): Das hielt den Ausbau unnötig freiwillig. Jetzt gibt es eine Regelversion mit Migration (R.2).

### R.1 Die Befunde und was geändert ist

| Befund | Änderung | Prüfung |
|---|---|---|
| **K3-01** Handschuhfach, Radio, Schublade ohne Fläche | Das geöffnete Führerhaus ist gezeichnet (Lenkrad, Radio mit halb herausstehender Kassette, Handschuhfach zu/offen/leer); die Schublade sitzt mit Messingknopf in der Thekenfront. Nebenbefunde in anderen Kapiteln mitbehoben: doppelte Bank in K5 (`carsija5`), negative Breiten beim Zug (K4) und Schuppenfenster (K1), „Gleise“ in K5 ohne Fläche. Die Engine dreht negative Rechtecke jetzt beim Laden um. | BUG-025 (echte Treffererkennung `M.E.hotspotAt`, alle Räume, kein „Spot fehlt“); `qa/ui/k3_revision.js` (echte Maus und echter Finger) |
| **K3-02** Tageswechsel schneiden Zusagen ab | Freitag, Samstag und Sonntag enden **bewusst**: in der Herberge (Fr, Sa) bzw. in Vlados Werkstatt (So), auch über das Bett. Marko sagt einmal, dass der Tag reif ist; vor dem Beenden nennt er offene Zusagen (Brücke, Waage, Veras Brief, Mates Mappe; in Regel 1 die Batterie). „Noch nicht“ lässt den Tag offen; beim nächsten Betreten fragt das Spiel wieder, jederzeit auch das Bett im Zimmer, am Sonntag Vlado („Es ist gleich elf. Fahren wir?“). Wer trotzdem beendet, stellt die Zusage bewusst zurück (`k3.left.*`). Prolog, Samstagnacht, Finale und Epilog wechseln weiter von selbst (dort gibt es nichts abzuschneiden). | BUG-026 |
| **K3-03** Veras Menü veraltet | Die Bedingungen werden bei jedem Aufbau des Menüs neu gelesen. | BUG-029 (4) |
| **K3-04** Zlata packt die Waage ein und lässt sie liegen | Beide Abgänge erzählen jetzt, dass die Waage liegen bleibt; sie ist auf dem leeren Klapptisch gezeichnet, bis Vera sie Marko gibt. | Sichtprüfung (Bildschirmfoto), BUG-023 |
| **K3-05** „Tote“ Batterie hindert nicht | Regel 2: Die zweite Batterie ist tot; ohne Ersatz ist der Sonntag nicht reif, der TAM springt nicht an. Der Ersatz kommt aus Mates Garage (R.4). Regel 1 (alte Stände): Kata nennt sie **schwach**; ohne Ersatz springt der TAM beim dritten Versuch an, Kata sagt dann „Die schwache hat gerade noch gereicht.“ Die Notiz „Zwei Batterien“ folgt der Regel. | BUG-028 |
| **K3-06** Einwilligung dokumentiert, nicht verlangt | Entscheidung: **Beziehungswahl, keine Bedingung.** „(Mala fragen.)“ bleibt freiwillig, wie überall im Kapitel; übergeht Marko Mala, sagt sie es ihm („Du hast mich nicht gefragt.“) und zählt mit (`k3.skips`, im Kapitelende gespeichert). Die erste Fassung hatte hier eine Bedingung behauptet; das war falsch dokumentiert. | BUG-023 (Brief ohne und mit Frage) |
| Veras Wohnort widersprach Kata | Vera wohnt „auf dieser Seite, hinter dem Markt“; „die Straße“, über die Vlado nicht geht, ist der Bulevar. | Text |

### R.2 Regelversion und Spielstände

`k3.rules` = 2 (neuer Hauptweg) oder 1 (bisheriger). Neue Spiele beginnen mit 2. Beim Laden (`M.MIGRATE`) bekommen Stände bis einschließlich Samstag (`k3_pro` … `k3_d2`) die 2, weil alle neuen Pflichtknoten danach noch erreichbar sind; Stände ab Samstagnacht behalten die 1 (Lenas Foto entsteht am Samstag an der Brücke). Auch in Regel 1 enden die Tage bewusst. Geprüft: BUG-029 (Migration je Stand, Regel 1 vollständig spielbar: Feigen mit Jute, Mates Erkenntnis ohne Fotos, Taxi-Batterie).

### R.3 Der erweiterte Hauptweg: was jetzt Pflicht ist

| Tag | Neuer Pflichtknoten | Art | Wer |
|---|---|---|---|
| Sa | Jela gibt Davor das **Foto von 1965** (Davor mit fünf auf einer Uferplatte unter der Brücke) und schickt die beiden an die Brücke | Auslöser | – |
| Sa | **Fotostandort unter der Brücke** (neuer Ort `podmost`): das Foto an vier Uferfelsen hochhalten; ein Vergleichsbild zeigt den Blick von dort, gerechnet aus derselben Geometrie (Turm Tara: Lage und Breite; Scheitel des Bogens; Form des Felsens). Jede falsche Wahl wird geometrisch begründet – seit der zweiten Prüfung erst, nachdem der Spieler „Hier stand er.“ gewählt hat (S.1). | räumliche Rekonstruktion | Marko |
| Sa | Auf der richtigen Platte liegt ein **Quader der alten Brücke**; erst wenn Marko den Standort kennt, sieht Mala hindurch: „M · D · 1965“ (das Spiel schlägt es nicht von selbst vor, S.1) | Kooperation | Mala |
| Sa | Davor setzt sich auf den Quader, **Lena fotografiert** ihn. Ohne dieses Foto ist der Samstag nicht reif. | Folge | – |
| So | Mate erkennt seinen Sohn erst, wenn er **beide Fotos** gesehen hat („Wer setzt sich auf unseren Stein?“) und dann die Anrede hört („dida“ oder Lenas Strophe) | zweistufige Erkenntnis | Marko, Lena |
| So | **Batos Plane**: Die große Feige braucht die Plane, die auf Batos altem Ponton in Skela liegt. Bato bewacht sie, solange er glaubt, dass morgen früh eine Fähre fährt. Erst nach der Konfrontation (er war wach, es war das Mädchen) gibt er sie frei. | Fall A öffnet Fall B | Marko |
| So | Die Feigen: Jute für den kleinen, Batos Plane für den großen Baum | Fall B | – |
| So | Am Schlüsselring, den Mate loslässt, hängt ein **kleiner Garagenschlüssel**. Jela nennt die Garage mit dem alten Straßennamen: „u Bratstva i jedinstva, kod stare pošte“. | Fall B öffnet die Lösung für A | Jela, Davor |
| So | **Kartenvergleich 1985/2011** bei Zdravko: Der alte Name steht auf keinem heutigen Plan. Auf Zdravkos Karte und Markos Plan dieselben Linien (Bahndamm, Flussbiegung, Postblock), andere Namen; die richtige Straße antippen. Falsche Wahlen werden begründet (beginnt nicht am Postblock / läuft quer / heißt auf beiden Karten gleich). | räumliches Kartenrätsel, Teilung | Marko |
| So | **Garage sieben** (neuer Ort `garaze`): Über zwei Toren sind die Nummern abgeblättert; Marko schließt an fremden Toren nicht auf gut Glück. Mala sieht durch das Blech den Mercedes mit der Thermoskanne. | Kooperation | Mala, Marko |
| So | Haube öffnen, Mates **Batterie** (abgeklemmt, „wie jeden Winter“), Kata baut sie ein. Ohne sie ist der Sonntag nicht reif. | Fall B löst den Weg zu Fall A | Marko, Kata |
| Fr/Sa/So | **Bewusster Tagesabschluss** mit Liste offener Zusagen | Struktur | – |

Weiter freiwillig (Vertiefungen der ersten Fassung): das Lied vom Fenster (Liam, Dino, Aufführung, Lenas Strophe – als zweiter Weg zu Mates Erkenntnis), Vera und ihr Brief, Mates Mappe, die Waage, der Bleistift, Handschuhfach und Fahrtenbuch, Batos Blechkiste und Fährbuch, Mehlsack und Spendertafel. Was davon offen ist, wenn ein Tag endet, nennt Marko.

Die Musterlösung (`game/tools/walkthrough3.js`) hat jetzt 131 protokollierte Spielerschritte statt 112 (gezählt an den Protokollzeilen der alten und neuen Fassung; ein Schritt kann mehrere Klicks umfassen).

### R.4 Abhängigkeitsplan der Revision

Fall A = Bato (Skela), Fall B = Mate (Haus Zelenika). Pfeile: „ist Voraussetzung für“.

```
SAMSTAG
  Bus aus München ──► Haus Zelenika: Jela (Schlüssel, Feigen, „Batos Plane“) ──► Foto von 1965, Ausflug zur Brücke
  Foto ──► Brücke: Davor gibt das Foto ──► unter der Brücke: Fotovergleich an R1…R4 ──► Standort R3
  Standort R3 ──► Mala sieht durch den Quader „M · D · 1965“ ──► Davor sitzt, Lenas Foto ──► Samstag reif
  (Eierfrau, Vlado Teil 1 wie bisher) ──────────────────────────────────────────────────────► Samstag reif
SONNTAG
  Fall A:  Zlata, Lichtprobe, Ordnen ─► „Bato war wach“ + „Es war das Mädchen“ ─► Bato erschüttert ─► Bato gibt die Plane frei   (A)
                                                                                                         │
  Fall B:  Briefe ─► Einladung ─► Fotos am Tor (Zweifel) + „dida“/Strophe ─► Mate erkennt Davor ─► Schlüssel am Tor (Tod)        │
           Plane (aus A) ─────────────────────────────────────────────────────────────► Feigen eingepackt  ◄──────────────────┘   (A → B)
           Feigen + Tod erkannt ─► Mate legt den Schlüssel in die Astgabel ─► Lena bekommt ihn ─► kleiner Garagenschlüssel
  Teilung: Garagenschlüssel + alter Straßenname ─► Kartenvergleich 1985/2011 (Zdravko) ─► „Lipova“ ─► Garagen auf dem Plan
           Garage: Mala sieht Tor 7 ─► Marko schließt auf ─► Haube ─► Batterie ─► Kata baut ein (TAM fährt)                  (B → A)
  Vlado:   Teil 2 ─► Gespräch „Wie Großmutter“ ─► Botschaft ─► Vlado fährt
  Sonntag reif = Fall A erschüttert + Vlado fährt + Fall B abgeschlossen + Batterie ─► Werkstatt: „Es ist Zeit.“
FINALE
  TAM (mit Mates Batterie) bringt Vlado nach Skela ─► Glocke ─► Batos Erkenntnis an der Fähre (Fall A) ─► …                    (… → A)
```

**A–B–A im Spiel:** Ein Schritt in Fall A (Bato hört die Wahrheit und lässt die Fähre los) verändert eine Handlungsmöglichkeit in Fall B (ohne seine Plane wird die große Feige nicht eingepackt, Mate lässt nicht los). Das Ergebnis von Fall B (Mates Schlüsselring, sein Auto) wird in Fall A genutzt: Ohne Mates Batterie springt der TAM nicht an, und ohne den TAM kommt Vlado in der Finalnacht nicht nach Skela, wo Bato erkennt, was er getan hat. Im Finale nennt Kata die Herkunft der Batterie, Vlado nickt.

### R.5 Die räumliche Brückenkonstruktion

Der Fotostandort braucht den Brückenort selbst: Bogen, Turm und Uferfelsen sind in Raum und Vergleichsbild aus denselben Zahlen gezeichnet (`M.PODMOST`, `M.K3F.VIEW`). Wo der Turm im Bild steht und wie breit er ist, und wo der Scheitel des Bogens liegt, hängt vom Standort ab; der Spieler liest das am alten Foto ab und vergleicht. Das allein reicht nicht: Auf der richtigen Platte liegt ein Quader, und nur Mala sieht hindurch, und erst, wenn Marko weiß, dass sie dort suchen muss. Beide Figuren sind nötig; die Szene könnte an keinem anderen Platz der Stadt stattfinden.

Belegt ist: Nach der Zerstörung 1993 wurden Steine der alten Brücke aus dem Fluss geholt (Mitte der 1990er Jahre, auch von ungarischen Militärtauchern); die meisten waren für den Wiedereinbau zu beschädigt. Die Steine der Brücke waren mit Eisenklammern verbunden (darum die leeren Klammerschlitze am Quader). Erfunden sind: der Quader auf dieser Platte, die Platte selbst, die Buchstaben, das Foto.

### R.6 Die geteilte Stadt als Lösungsweg (2011)

Der Garagenweg hängt an einer Tatsache der Nachkriegsstadt: Nach 1995 wurden in Mostar die Straßen umbenannt, auf beiden Seiten getrennt; die alten Namen leben in den Köpfen der Älteren weiter, die neuen stehen auf Schildern und Plänen. Jela kennt nur den alten Namen, Markos Plan nur den neuen, Zdravkos Karte von 1985 nur den alten; erst der Vergleich über das, was sich nicht ändert (Bahndamm, Flussbiegung, der Block der alten Post), führt zur Garage. Am Pfosten hängt das neue Schild über dem halb überstrichenen alten.

Belege [H]: Monika Palmberger, „Nationalizing the streetscape: the case of street renaming in Mostar, Bosnia and Herzegovina“; Max-Planck-Institut zur Erforschung multireligiöser und multiethnischer Gesellschaften, Working Paper WP 12-02, „Renaming of public space: a policy of exclusion in Bosnia and Herzegovina“ (2012); Arbeiten zur Nachkriegsrekonstruktion Mostars (E. G. Makas) berichten, dass viele Bewohner die alten Namen weiter benutzen. **Erfunden und bewusst neutral:** „Lipova“, „Brestova“, „Jasenova“ (Baumnamen, ohne nationale Zeichen); dass gerade diese Straße „Bratstva i jedinstva“ hieß (der Name war in Jugoslawien verbreitet), die Garagen, die alte Post an dieser Stelle. Das Spiel nennt keine Seite und keine Gruppe; Zdravko sagt nur: „Auf beiden Seiten, jede für sich.“

### R.7 Konsistenz

- Waage: bleibt beim Abgang sichtbar liegen, Vera gibt sie Marko, Zlata nimmt sie an der Tür, Sonntag steht sie auf ihrem Küchentisch.
- TAM: Regel 2 – fährt nur mit Mates Batterie (Sonntag sonst nicht reif); Regel 1 – schwache Batterie, drei Versuche, oder die Taxi-Batterie. Kata nennt im Finale die Herkunft.
- Batos Plane: liegt bis zur Freigabe auf dem Ponton (im Bild), danach liegt das Ponton nackt da, die Plane auf dem großen Feigenbaum.
- Mates Garagentor: offen nur der gekippte Streifen oben als Stelle, damit Auto, Haube, Batterie, Thermoskanne und Kalender frei antippbar sind.
- Die Australier warten mit dem Spielen, solange Davor und Lena unten am Ufer suchen.

### R.8 Tests, getrennt nach Art (Stand der ersten Revision; aktuelle Ergebnisse in S.2)

| Art | Was | Werkzeug | Ergebnis |
|---|---|---|---|
| Zustandslogik, ganzer Hauptweg | neues Spiel Kapitel 3 bis zum Abspann, nur Spielerhandlungen über die Test-Schnittstelle (`M.TA`), Overlays über ihre gezeichneten Felder (`M.pointerDown/Up`) | `node game/tools/walkthrough3.js` | 131 Schritte, keine JS-Fehler |
| Zustandslogik, einzelne Ketten | Tagesabschluss (mit erneutem Angebot über Bett und Vlado); Brückenkette; A–B–A und Straßenname; Regeln, Migration, Speichern, Veras Menü | `qa/regress/run.js --only BUG-026` (bis BUG-029) | alle OK |
| Reihenfolgen | Fotovergleich in falscher Reihenfolge (R1, R2, R4 vor R3); Mala vor dem Standort; Davor vor den Buchstaben; Plane vor/nach der Konfrontation; Feigen ohne/mit Plane; „dida“ vor/nach den Fotos; Tor ohne/mit Malas Blick; Batterie vor/nach der Haube; drei falsche Straßen vor der richtigen | BUG-027, BUG-028 | alle OK |
| Reale Bedienung | echte Maus (Ziehen aus dem Inventar, Verb-Menü am Zeiger, Klicks in Overlays) und echter Finger (Gegenstand antippen, dann Ziel; Aktionsleiste; Nachfrage „Welches?“) für Handschuhfach, Radio, Schublade, Fotovergleich, Quader, Kartenvergleich, Garagentor, Haube, Batterie | `node qa/ui/k3_revision.js` (Chromium; Desktop 1280 × 800 und iPad-Emulation 1080 × 810) | 33/33 |
| Trefferflächen | jede sichtbare Stelle in jedem Raum hat eine Fläche; die neuen Stellen treffen sich selbst | BUG-025 | OK |
| Speicherung | `M.API.save` → `mala.save.<platz>` → `M.E.loadKey` mitten unter der Brücke und in der Garage; Fortsetzen danach | BUG-029 | OK |
| Regression | alle 29 gezielten Tests (Kapitel 1–5), davon fünf neu (BUG-025 bis BUG-029) | `node qa/regress/run.js` | 29/29 |
| Hinweise | Stufe 4 jedes offenen Themas wird im Spiel ausgeführt und muss etwas bewirken; dazu Wiederöffnung und Stranglücken. An allen 131 Ständen der Musterlösung und an 22 Abweichungs-Ständen (andere Reihenfolge, verpasster Schritt, früher Schluss) | `MALA_DUMPALL=… node game/tools/walkthrough3.js`, dann `node qa/hints/hintprobe.js --dumps …` und `--varianten` | ohne Befund: 255 + 44 Themen-Stände bestanden, 62 + 1 übersprungen (Gründe unten) |
| Historische Prüfung | Quellen in R.5/R.6; was erfunden ist, steht dabei | – | Literatur, kein Gutachten |
| Menschliche Spielwirkung | **nicht geprüft.** Kein Erstspielertest, keine gemessene Spielzeit, kein Safari/iOS-Gerät, kein Ton. Die Spieltakt-Schätzung des Testtreibers (Pflichtdialoge in Normaltempo) ist keine Spielzeit. | – | offen |

**Alle Ergebnisse gelten für denselben Build** (Stempel „11.11.2026 · 402502“, `web/index.html` sha256 `2740546f3a71…`).

**Was die Hinweisprobe gefunden hat (und was daraufhin geändert wurde).** Der erste Lauf nach der Revision meldete 22 Fehler und 11 Stellen zum Prüfen. Drei echte Mängel:
1. Der Hinweis zum Tagesende schickte auf eine Reise in die Herberge bzw. zum Bulevar, auch dann, wenn Marko in der Werkstatt, unter der Brücke oder schon in der Herberge stand – von dort geht keine Reise. Außerdem war es *ein* Thema für alle Tage: Die Hinweisgeschichte merkt sich die erreichte Stufe je Thema, am Samstag hätte der Hinweis mit der Stufe vom Freitag angefangen. Jetzt hat jeder Abschnitt ein eigenes Thema (`x3fr`, `x3sa`, `x3so` …); Stufe 4 nennt je nach Ort das Bett im Zimmer oder die Herberge; am Sonntag fragt man Vlado („Es ist gleich elf. Fahren wir?“) – das ist neu und bietet den Abschluss erneut an, wenn man an der Werkstatttür „Noch nicht“ gesagt hat (geprüft in BUG-026).
2. „Zwei Batterien“ verlangte, Lena Mates Schlüssel zu geben, solange Mate ihn noch festhielt. Jetzt nennt Stufe 4 bis dahin die Abhängigkeit („Noch nicht: Erst muss Mate aufhören zu warten …“), danach Astgabel und Lena.
3. Nach dem Garagenschlüssel blieb „Zwei Batterien“ beim Kartenvergleich stehen, auch als Straße und Garage längst gefunden waren. Jetzt schließt das Thema mit dem Schlüssel; „Bratstva i jedinstva“, „Garage sieben“ und „Mates Batterie“ führen weiter, „Mates Batterie“ bis zum Einbau bei Kata.
Die elf Stellen zum Prüfen waren Wortlaut: Stufe 4 nannte „die alte Karte“ und „die flache Platte“ nicht so, wie die Stellen im Bild heißen („Alte Landkarte“, „Flache Platte“). Danach: ohne Befund.

**Übersprungen heißt nicht bestanden.** Von den 62 übersprungenen Themen-Ständen der Musterlösung sind 44 Themen, deren Stufe 4 auf ein anderes, eigens geprüftes Thema verweist (14 × Briefe → `d3q`; 12 × Sammelthema „Bis elf“ → `d3q`–`d3w2`; 10 × Batos Fall → seine Einzelthemen; 8 × „Zwei Batterien“ vor Mates Loslassen → Mates Fall); elf betreffen Rätselfelder, die die Probe nicht selbst löst (Peilung auf Karte und Friedhof, Formular), oder Abläufe, die von selbst kommen (geführte Überquerung, Ljerkas Rückruf); sieben sind Stände, an denen nach dem Laden eine Szene läuft oder das Thema nicht offen ist. Diese Stellen sind über die Musterlösung und die Regressionstests abgedeckt, nicht über die Hinweisprobe.

### R.9 Was offen bleibt

- Ob der Fotovergleich und der Kartenvergleich für Erstspieler zu leicht oder zu schwer sind, ist nicht gemessen. Beide haben vier Wahlen mit Begründung; die Hinweise führen in vier Stufen hin.
- Die neuen Texte sind nur deutsch (wie das übrige Kapitel 3).
- Alte Stände ab Samstagnacht sehen die neuen Pflichtknoten nicht (Regel 1). Das ist Absicht, keine Lücke.

---

## A. Analyse der bisherigen Fassung

### A.1 Was da ist [B]

Zehn Phasen (Donnerstag bis Montag), 21 Räume (Ostbusbahnhof, Herberge, Zimmer, Kujundžiluk, Alte Brücke, Koski-Moschee, Minarett, Straßenbrücke, Partisanenfriedhof, Bulevar, Westbusbahnhof, Café Zdravko, Vulkanizer mit Hof, Tepa, Haus Zelenika mit Stube, Skela rechtes Ufer, neue Brücke, linkes Ufer, Zlatas Küche, Vermisstenstelle) sowie die Zwischenwelt. 21 Figuren, davon drei Geister mit Fall (Mala, Bato, Mate) und ein Geist ohne Fall (der Springer). 86 Notizen, 23 Schlussregeln, 81 Hinweisthemen, 9 Gegenstände des Kapitels.

Rätseltypen, die tragen: die Peilung über drei Standorte (Kooperation, Raum), die Lichtprobe mit dem Handy (physische Handlung, Mala vergleicht), das Ordnen der Nacht (Rekonstruktion), die Schublade bei Kata (Mala sieht durch Holz, Marko darf nicht raten), die Übersetzungswahl (Katas E-Mail, Lenas Sätze, Jelas Satz), die Botschaft an Vlado (Notiz zeigen, falsche Notizen mit eigener Antwort), Mates zwei Erkenntnisse (Anrede, Schlüssel durch die Hand). Die Nacht an der Fähre ist als Mehrquellenrekonstruktion (Vlado, Zlata, Bato, Malas Nachhall) die stärkste Konstruktion der Reihe.

### A.2 Was fehlt [B, gemessen am Inventar]

| Befund | Beleg |
|---|---|
| **Die Alte Brücke** hat drei Funktionen: Prolog (Identifikation, Leine), Freitag (Peilung 1), Epilog (Gang). Samstag und Sonntag trägt sie nur Dinos Roller (optional) und nachts den Springer (optional, ohne Folge). | `rooms/starimost.js` |
| **Die Musiker** setzen kein Flag, haben kein Ziel, keinen Wunsch, keine Folge. Ihr Lied ist Stimmung („schön falsch“). | `rooms/herberge.js:61-72` |
| **Zdravko** liefert Karte, Kaffee und eine Erinnerung. Er entscheidet nichts. | `rooms/kafic.js` |
| **Jela** bringt den Schlüssel, erzählt drei Dinge, gibt nach. **Davor** antwortet, verkauft. **Lena** lernt einen Satz. Alle drei sind Gesprächsstationen eines linearen Sonntags. | `rooms/zelenika.js` |
| **Zlata** handelt zweimal (Decke, Erzählung im Finale); sonst antwortet sie. | `rooms/skela_l.js` |
| **Der Taxifahrer** fährt und kennt Vlado. **Die Marktfrau** (susjeda) hat zwei Sätze. | `rooms/ostbus.js`, `rooms/tepa.js` |
| **Die Teilung der Stadt** erscheint an drei Stellen: zwei Busbahnhöfe, der Bulevar (Mala wird still), Majas Witz über das Übersetzen. Keine Rätselkette hängt daran. | `rooms/bulevar.js`, `herberge.js:31` |
| **Beide Fälle** berühren sich nur über Mates Hinweis auf Vlado (Freitag). Danach laufen sie getrennt. | `kafic.js:23` |
| **Lebende handeln selten.** Weltveränderungen durch Lebende: Jela gibt nach, Davor packt Feigen, Zlata gibt die Decke, Vlado fährt. | – |

### A.3 Warum das Kapitel kurz wirkt

Die Musterlösung hat 113 Spielerhandlungen (`game/tools/walkthrough3.js`). Davon sind 41 Gesprächswahlen, 19 Reisen, 18 Verbinden/Zeigen, 14 Ansehen/Spüren, 9 Benutzen/Geben, 7 Rätselfelder, 5 Figurenwechsel. Der Anteil an Handlungen, die etwas in der Welt verändern, ist klein; der Anteil an Gesprächen groß. Eine menschliche Spielzeit ist nicht gemessen (`PRUEFBERICHT_K3.md:654`); der Takt der Musterlösung mit Pflichtdialogen in Normaltempo liegt bei etwa 150 Minuten ohne Denkzeit. Die Schätzung „zwei bis drei Stunden für Erstspieler“ ist eine Schätzung.

### A.4 Handlungsjahr und historischer Rahmen: ein Widerspruch zur Vorgabe

**Das Kapitel spielt vom 24. bis 28. November 2011 [B].** Das steht fest durch: die Daten der Kapitel 1 und 2 (November 2011), Malas Tod am 15. Januar 1994 und „siebzehn Jahre“ in Zlatas Satz, Mates Tod im März 2010, Batos Tod 2006, die Spendertafel von 1998, Dinos Geschichte („Zweitausendvier haben sie sie wieder aufgebaut“), die Mobiltelefone und die SMS. Die Alte Brücke ist im Spiel die 2004 wiedereröffnete Brücke [H: Wiedereröffnung 23.7.2004, siehe `KAPITEL3_KONZEPT.md` 10.4].

Die Vorgabe „frühe Nachkriegszeit“ [V] lässt sich deshalb nicht wörtlich erfüllen, ohne die gesamte Reihe um anderthalb Jahrzehnte zu verschieben. Das Konzept löst es so:

- **Das Jahr bleibt 2011.** Mostar ist 2011 eine Stadt, die im Alltag weiter geteilt ist: zwei Busbahnhöfe, zwei Postbetriebe, zwei Stromversorger, zwei Universitäten, das Gymnasium als „zwei Schulen unter einem Dach“ [H: Wikipedia „Two schools under one roof“, „Mostar Gymnasium“; Christian Science Monitor 27.9.2007; Vreme; Crisis Group/Balkan Diskurs in `KAPITEL3_KONZEPT.md` 10.4]. Der Bulevar war die Frontlinie und ist die stille Trennlinie geblieben [H: Wikipedia „Siege of Mostar“]. Die Neretva ist **nicht** die Trennlinie; die Altstadt mit der Alten Brücke liegt beiderseits des Flusses und gehört zu derselben Stadthälfte [H: ebd.; der Bulevar liegt westlich des Flusses].
- **Die Nacht vom Januar 1994 ist die Kriegsschicht.** Sperrstunde, die Kontrolle vor der Stadt, eine Fähre, die nachts nicht fahren durfte: Lanas Tod ist ohnehin von der Teilung geprägt [B: `KAPITEL3_KONZEPT.md` 4.3]. Der Ausbau macht diese Schicht an Vlados Familie sichtbar (Kette N1).
- Was 2011 konkret erfahrbar wird, steht in Abschnitt E.

Keine Korrektur am bisherigen Kapitel ist nötig: Es enthält keinen zeitlichen Widerspruch. Der Widerspruch liegt zwischen Vorgabe und Kanon, und er wird zugunsten des Kanons entschieden.

### A.5 Was bleibt, was nicht angefasst wird

Bewahrt werden: alle bestehenden Räume, Figuren, Notizen, Schlüsse, die Peilung, die Nacht an der Fähre, Mates zwei Erkenntnisse, die Gespräche „Mich hast du nicht gefragt“ und „Wie Großmutter“, das Finale, der Epilog, die Tagesbedingungen. Keine neuen Geisterfähigkeiten [V]. Keine Volkszugehörigkeiten, keine religiösen oder nationalen Zeichen [B: Grundsatz seit Kapitel 2].

---

## B. Überarbeitetes Story- und Dramaturgiekonzept

### B.1 Leitgedanke

Das Kapitel heißt „Was der Fluss behält“. Der Ausbau fügt ein zweites Motiv hinzu, das in jedem Strang schon angelegt war: **Wer kommt, und wer kommt zu spät.** Lana wartete an der Fähre. Bato stand am Fenster und kam nicht. Vlado kam um zwei, zu spät. Mate wartete zwölf Jahre auf den Bus. Marko wartete in Split auf einer Treppe. Das Lied der Australier handelt von einem Mädchen am Fenster. Und in Mostar 2011 gibt es Menschen, die seit Jahren nicht über eine Straße gehen, die sie jeden Tag sehen.

Der Ausbau macht aus diesem Motiv Spielhandlungen: Dinge, die ankommen oder nicht (eine Fahrkarte, ein Brief, eine Waage, ein Werkspapier, ein Vers), und Menschen, die sich entscheiden, einen Weg zu gehen oder nicht (Vera, Zdravko, Jela, Davor, Zlata).

### B.2 Die neuen Stränge im Überblick

| Kette | Kern | Fall | Orte | Lebende, die handeln |
|---|---|---|---|---|
| **N1 „Über die Straße“** | Vlados Schwester Vera lebt drüben. Seit der Nacht von 1994 reden die beiden nicht. Sie hält das Werkspapier des TAM. Marko „übersetzt“ einen Brief zwischen zwei Menschen, die eine Sprache sprechen. | A, Finale | Tepa, Vulkanizer, Hof | Vera, Kata, Vlado |
| **N2 „Das Lied vom Fenster“** | Die Australier wollen das Lied richtig singen. Mate hat es beim Warten gesummt, immer nur bis zum Fenster. Lena hört an der Brücke die fehlende Strophe und bringt sie ihrem Großvater. | B, Herberge, Brücke | Herberge, Alte Brücke, Café, Haus Zelenika | Jela, Davor, Lena, Dino, die Musiker |
| **N3 „Mates Fahrkarte“** | Mate hatte eine Fahrkarte nach München gekauft. Zdravko bewahrt sie für den, der kommt. Davor kommt nicht ins Café, Lena schon. Davor verschiebt den Verkauf. | B | Café, Haus Zelenika | Zdravko, Lena, Davor |
| **N4 „Die Waage“** | Zlata lässt beim Weglaufen ihre Marktwaage liegen. Vera gibt sie Marko mit. Nachts in Skela ist die Waage der Grund, an Zlatas Tür zu stehen. | A | Tepa, Skela | Vera, Zlata |
| **N5 „Der Bleistift“** | Zlata hat den angekauten Bleistift von der Glocke. Ob sie ihn hergibt, hängt daran, ob Marko ihr die Wahrheit über die Mutter sagt. | A, Epilog | Zlatas Küche | Zlata |
| **P1 „Das Handschuhfach“** | Mala sieht durch das Blech des TAM ein Heft und eine Kassette. Marko braucht den Schraubenzieher aus Vlados Werkstatt. Das Fahrtenbuch 1994 („+1“, „02:00 Skela · nitko“) ist ein Beleg, den Vlado nicht wegreden kann. Die Kassette spielt der Mercedes am Ostbahnhof. | A | Hof, Vulkanizer, Ostbusbahnhof | Kata, Vlado, Taxifahrer |
| **P2 „Batos Blechkiste“** | Unter der Ruderbank im Schuppen steht eine verschlossene Kiste mit Batos Fährbuch. Mala sieht hinein, Zlata hat den Schlüssel in ihrer Schublade, Marko liest Batos Schrift: dreimal Glocke, „nisam išao“. Dazu der Mehlsack in der Hütte und die Spendertafel mit Vlados Namen. | A | Skela beide Ufer, neue Brücke, Zlata, Vulkanizer | Zlata, Bato, Vlado |
| **P3 „Zwei Batterien“** | Der TAM braucht für die Finalnacht eine zweite Batterie. Die liegt im Kofferraum des Taxis am Ostbahnhof. Der Fahrer gibt sie für die Fahrt nach Skela, nicht für Rajić, und will morgen wissen, was Vlado gesagt hat. | Finale | Vulkanizer, Ostbusbahnhof, Hof | Kata, Taxifahrer, Vlado |
| **E „Die Stadt“** | Kurze Szenen, in denen die Teilung von 2011 sichtbar wird, ohne Monolog. | – | Bulevar, Brücke, beide Busbahnhöfe, Café | Dino, Zdravko, Taxifahrer, Kata, Davor |

*(Fassung vom 10.11., überholt – siehe Teil R.)* Alle neuen Stränge sind **optionale Vertiefungen**; die bisherigen Pflichtschritte bleiben die Pflichtschritte. Grund: Bestehende Spielstände müssen weiter funktionieren (jede Phase bleibt mit dem alten Pflichtweg abschließbar), und die Hinweisprobe darf keine neuen Sackgassen finden. Die Vertiefungen haben aber Folgen in der Pflichthandlung (zweiter Weg zu Mates Erkenntnis, verändertes Finale, veränderter Epilog), und das Hinweissystem führt zu ihnen hin.

### B.3 Was Marko und Mala daraus lernen

- **Marko** übersetzt in N1 zum ersten Mal nicht zwischen Sprachen, sondern zwischen zwei Menschen, die dieselbe sprechen. Er muss entscheiden, welche Sätze er weglässt, und er darf nicht lügen (Vlado merkt es). Das ist seine Arbeit, auf den Punkt gebracht.
- **Mala** wird in N1 gefragt, ob die Wahrheit über ihren Tod an eine dritte Lebende gehen darf (Vera). Nach „Wie Großmutter“ sagt sie ja: „Sie hat das Bett gemacht.“ In N5 begegnet sie ihrem eigenen Bleistift. Beides berührt ihren Bogen (wem gehört mein Tod), löst ihn aber nicht auf [V: nichts vorwegnehmen].
- **Bato und Mate** bleiben, was sie sind. Mates Fall bekommt mit der Fahrkarte eine Spiegelung: Der Wartende hatte sich entschieden zu fahren. Batos Fall bekommt mit Vera eine zweite Lebende, die in jener Nacht wach lag.

---

## C. Rätselplan

### C.1 Abhängigkeiten (neu, mit Anschluss an Bestehendes)

Schreibweise: `→` setzt voraus; `|` parallel möglich; **fett** = Pflichtschritt des Kapitels [B]; kursiv = neu [N].

```
FREITAG (k3_d1)
  Kata: E-Mail übersetzen [B] → Kata: „das Blatt fehlt“ [N] → Notiz v3_blatt
  Mala: unterste Schublade [B] (unverändert)
  Nacht: Liam: „Do you know the words?“ [N] → Strophen ordnen (A.arrange) [N] → Bec hat den Zettel (k3.s.words)
         | kann auch Samstagnacht geschehen

SAMSTAG (k3_d2)
  **Maja: Tepa** [B]
  Tepa: Marktfrau = Vera [N] (Vorstellung, sobald Marko „Rajić“ sagt oder die Notiz v3_where zeigt)
        Vera: „Um zwei hat er den Motor abgestellt“ [N] → v3_bed
        **Zlata läuft weg** [B] → Vera: die Waage [N] → Gegenstand vaga
  **Bus aus München** [B] → **Haus Zelenika, Jela** [B]
        Lena: „Gehen wir zur Brücke? Papa will nicht.“ [N] → Jela: „Dijete mora vidjeti most.“ [N] → k3.s.trip
  Alte Brücke (nach k3.s.trip): Davor und Lena da [N]
        Dino: Singen am Brückenkopf nur gegen eine Geschichte [N] → Marko erzählt (Notizwahl) → k3.s.dinoOk
        Australier spielen (k3.s.words ∧ k3.s.dinoOk) [N] → Lena hört die dritte Strophe → Marko übersetzt → k3.s.lenaVerse
        Davor: „Er hat am Telefon gesummt“ [N] → b3_hum
  Café (Sa oder So): Zdravko: „bis zum Fenster, weiter nie“ [N] → b3_hum (zweite Quelle)
        Mala lauscht am Fenstertisch [N] → b3_hum (dritte Quelle)
        Mala sieht in Zdravkos Schublade [N] → b3_folder
  **Vlado, Teil 1** [B]; Vera-Notiz v3_bed zeigen [N] → Vlado nennt „um zwei“ schon am Samstag (zweiter Weg zu v3_two)

SAMSTAGNACHT (k3_d2_n)
  Herberge: Australier singen richtig (k3.s.words) [N], stiller Moment
  **Skela: Bato, Nachhall, Bato drüben, Zlata: „Sutra“** [B]; mit vaga: Waage an der Tür [N] → k3.z.vaga

SONNTAG (k3_d3)
  Fall A [B unverändert]; dazu: Zlata: „Sucht sie jemand?“ [N] → wahr/ausweichend → Bleistift (olovka_mala) [N]
        Bleistift Mala zeigen [N] → a3_mypencil
  Fall B: Lenas Satz „dida“ [B]  |  Lenas Strophe (k3.s.lenaVerse) [N]  → beide führen zu **„Das ist Davor“**
        Lena: „Wo hat er gewartet?“ (nach b3_dida oder b3_hum) [N] → Lena geht mit ins Café [N]
        Zdravko gibt Lena die Mappe (k3.b.folder) [N] → Fahrkarte lesen → b3_coming
        Mappe an Davor [N] → Davor verschiebt den Verkauf (k3.b.noSale) → Jela, Mate reagieren
  Vera: Brief (nach v3_who ∨ v3_message, mit „Mala fragen“ vera) [N] → Brief übersetzen (A.puzzle) → pismo
        pismo an Vlado (nach k3.v.part2) [N] → k3.v.veraLetter

FINALE (k3_fin_n)
  **Abfahrt im Hof** [B]; mit k3.v.veraLetter: Vera am Tor, das Werkspapier [N]

EPILOG
  **Brief 1996, Skizzenbuch an Nada** [B]; mit olovka_mala: der Bleistift an Nada [N]
  Maja: die Australier haben ein Video dagelassen [N, nur Zeile]
```

### C.2 Zirkel und Sackgassen

- Kein neuer Gegenstand ist Voraussetzung für einen Pflichtschritt. `vaga`, `pismo`, `mapa_mate`, `olovka_mala` sind Vertiefungen.
- Die Australier sind Freitag- und Samstagnacht da [B]; der Zettel kann in beiden Nächten entstehen. Fehlt er am Samstag, spielen sie an der Brücke nicht; Lenas Strophe entfällt, der Satz „dida“ bleibt [B].
- Vera ist Samstag, Sonntag und Montag am Markt [B: susjeda]; ihre Schritte können Sonntag nachgeholt werden (außer die Waage, die Zlata am Samstag liegen lässt).
- Der Brief braucht Malas Zustimmung; Mala stimmt nach „Wie Großmutter“ immer zu (kein Verlustzustand).
- Zdravkos Mappe braucht Lena im Café; Lena geht nur, wenn Davor sie lässt, und Davor lässt sie, sobald er im Haus ist (Sonntag). Es gibt keine Bedingung, die sich gegenseitig blockiert.
- Alle neuen Flags werden mit dem Spielstand gespeichert; alte Stände ohne diese Flags laufen wie bisher (alle neuen Prüfungen sind `!!G.flags[...]`).

### C.3 Was mandatorisch bleibt

Unverändert `dayReady` in `96_k3_story.js:191-199`. Der Grund steht in B.2.

---

## D. Schauplatz- und Figurenvergleich

### D.1 Orte

| Ort | bisher [B] | neu [N] |
|---|---|---|
| **Alte Brücke** | Prolog: Identifikation, Leine. Fr: Peilung 1. Nächte: Springer (ohne Folge). So: Dinos Roller. Epilog: Gang. | Sa: Davor und Lena besichtigen die Brücke (Jelas Entscheidung). Die Australier spielen am Brückenkopf (Dinos Regel: eine Geschichte). Lena hört die Strophe. Dino erklärt Touristen, dass hier keine Grenze ist. Davor erinnert sich an das Summen. |
| **Herberge** | Basis, Maja, Gespräche 1 und Vater, Lied als Stimmung. | Liam fragt nach dem Text; Strophen ordnen; Samstagnacht singen sie richtig; Montag: das Video. |
| **Café Zdravko** | Karte 1985, Mate, Kaffee, Zdravkos Erinnerung. | Mate summt (Mala lauscht). Zdravko: „bis zum Fenster“. Die Schublade mit Mates Mappe (Mala sieht hinein). Lena am Sonntag: Zdravko entscheidet. |
| **Tepa** | Zlata, die Nachbarin (zwei Sätze). | Die Nachbarin ist Vera Rajić. Die Waage. „Um zwei“. Der Brief am Sonntag. |
| **Vulkanizer** | Vlado, Kata, Schubladen. | Kata: das fehlende Blatt, die Tante als Telefon. Vlado liest Veras Brief. |
| **Hof** | Nachhall, Gespräch 2, Abfahrt. | Vera am Rolltor, das Werkspapier. |
| **Haus Zelenika** | Jela, Davor, Lena, Feigen, Schlüssel. | Jela schickt die beiden zur Brücke. Lenas Strophe als zweiter Weg. Die Mappe: Davor verschiebt. |
| **Zlatas Küche / linkes Ufer** | Ordnen, Decke, Finale, Epilog. | Die Waage auf dem Tisch. Der Bleistift (Zlatas Entscheidung). |
| **Bulevar** | Stiller Ort. | Mala hört zwei Pausenglocken, eine nach der anderen. |
| **Ostbusbahnhof** | Ankunft, Taxi, Abfahrt. | Der Taxifahrer: „Wir waren eine Firma. Jetzt sind wir zwei Bahnhöfe.“ |

### D.2 Figuren

| Figur | bisher [B] | neu [N] |
|---|---|---|
| **Zlata** | antwortet, gibt die Decke, erzählt im Finale | nimmt die Waage; entscheidet über den Bleistift, je nachdem, was Marko ihr über die Mutter sagt |
| **Davor** | übersetzt, liest Briefe, packt Feigen | geht gegen seinen Willen zur Brücke (Jela), erinnert sich ans Summen, verschiebt den Verkauf, nachdem Lena ihm die Fahrkarte bringt |
| **Lena** | lernt „dida“ | will zur Brücke, lernt die Strophe, geht ins Café, bekommt die Mappe, bringt sie dem Vater |
| **Jela** | Schlüssel, drei Dinge, gibt nach | entscheidet, dass das Kind die Brücke sehen muss |
| **Zdravko** | Karte, Kaffee, Erinnerung | hat Mates Mappe aufgehoben und gibt sie nur dem, der kommt; gibt sie Lena |
| **Die Musiker** | singen falsch | wollen den Text, bekommen ihn als geordnete Strophen, spielen an der Brücke (gegen Dinos Geschichte), singen Samstagnacht richtig, lassen ein Video da |
| **Dino** | Geschichte, Bogen, Karte, Roller | lässt am Brückenkopf nur gegen eine Geschichte spielen; erklärt, wo die Grenze ist |
| **Vera** (neu, ersetzt die namenlose Marktfrau) | zwei Sätze | Vlados Schwester, hält das Werkspapier, hat 1994 das Bett gemacht, diktiert den Brief, steht im Finale am Tor |
| **Kata** | E-Mail, Schublade | „das Blatt fehlt“, das Telefon zwischen Vater und Tante |
| **Vlado** | leugnet, erzählt, fährt | liest den Brief seiner Schwester und sagt nichts |
| **Taxifahrer** | fährt, kennt Vlado | eine Firma, zwei Bahnhöfe |
| **Mate** | wartet, erkennt | summt bis zum Fenster; hört die Strophe von Lena; „Der Vierzehnte. Ein Sonntag.“ |
| **Bato** | unverändert | – |
| **Mala** | – | wird gefragt (Vera), sieht ihren Bleistift, hört die Australier richtig singen |

---

## E. Konzept zur historischen Einbindung (2011)

### E.1 Grundsätze [V]

- Keine Figur wird einer Gruppe zugeordnet, keine Seite ist schuld, nichts wird erklärt. Das Spiel zeigt Folgen im Alltag. Niemand sagt „die anderen“; alle sagen „drüben“.
- Die Teilung wird nicht gelöst. Vera geht am Ende zurück über die Straße, allein. Zdravko und der Taxifahrer bleiben an ihren Bahnhöfen.

### E.2 Wo sie erfahrbar wird

| Ort / Szene | Was zu sehen oder zu hören ist | Status |
|---|---|---|
| Ostbusbahnhof, Taxifahrer | „Wir waren eine Firma, einer Depot. Jetzt sind wir zwei Bahnhöfe. Ich fahre von hier. Zdravko schenkt dort aus. Wir winken, wenn ein Bus vorbeifährt.“ | [H: zwei Busbahnhöfe; die eine Firma ist [N]] |
| Café Zdravko | Zdravko über den Taxifahrer; die Karte von 1985, auf der die Stadt eine ist (Straßennamen von damals) | [H?: Umbenennungen nach dem Krieg sind belegt, im Spiel nur als Stimmung] |
| Bulevar | Das wiederaufgebaute Gymnasium [H: Renovierung 2004–2009]; Mala hört zwei Pausenglocken, eine nach der anderen [H: zwei Schulen unter einem Dach mit getrennten Stundenplänen] | neu |
| Alte Brücke, Samstag | Ein Tourist fragt Dino, ob das hier die Grenze ist. Dino: „Das hier ist eine Brücke. Die Grenze ist eine Straße mit einer Bank, die man nicht sieht.“ | [H: die Trennlinie ist der Bulevar, nicht der Fluss] |
| Vulkanizer | Kata: „Papa fährt nicht rüber. Nicht, weil er nicht darf. Weil er dann weiß, was er alles nicht weiß.“ | [N] |
| Tepa | Vera: „Seit sechsundneunzig wohne ich drüben. Es war eine Wohnung frei, und ich war allein. Man muss nicht über die Straße, wenn man nicht will. Die Stadt hilft einem dabei.“ | [N] |
| Haus Zelenika, Westbusbahnhof | Davor kam mit dem Bus am Westbahnhof an [B]; Nada kommt am Ostbahnhof an [B]. Davor: „Jela hat uns den Weg zur Brücke erklärt wie in eine andere Stadt. Für sie ist es eine.“ | [N] |
| Die Nacht 1994 | Sperrstunde, die Kontrolle vor der Stadt, nachts fährt keine Fähre, die Blankets im Lastwagen [B] | [B] |

### E.3 Die Rätselkette, die von der Teilung geprägt ist: N1

Das Werkspapier liegt bei einer Person, zu der seit siebzehn Jahren kein Kontakt besteht [V-Beispiel]. Der Botengang ist nicht das Rätsel. Das Rätsel ist, warum die beiden nicht reden (eine Nacht, ein Satz), was Vera weiß (das gemachte Bett, der Motor um zwei), was Vlado weiß (sie hat ihn weggeschickt), und wie Marko daraus einen Brief macht, den Vlado bis zu Ende liest. Die Teilung ist das Medium: Sie macht das Nichtreden leicht. Die Kette würde in einer ungeteilten Stadt nicht so funktionieren, weil die Geschwister sich dort begegnen würden (Prüffrage [V] 5.8).

### E.4 Keine künstliche Versöhnung

Vera bringt das Papier an das Tor und bleibt am Tor. Vlado nickt. Kata nimmt das Papier. Mehr nicht. Mala: „Das ist nicht viel.“ Marko: „Das ist eine Straße.“

### E.5 Belegt, Kanon, erfunden

- **Belegt:** Jahr und Zustand der Brücke; zwei Busbahnhöfe; zwei Schulen unter einem Dach; Bulevar als Frontlinie; Partisanenfriedhof verwahrlost (Europa Nostra, Lonely Planet). Quellen in `KAPITEL3_KONZEPT.md` 10.4 und oben.
- **Kanon:** Lanas Nacht, Vlados Fahrt, Batos Fenster, Zlatas Grab, Mates Warten.
- **Erfunden:** Vera, die Firma der beiden Fahrer, Mates Fahrkarte, Jelas Satz, Dinos Regel, das Summen.

---

## F. Ausgearbeitete Inhalte (Kurzfassung; die Texte stehen im Code)

### F.1 N1 „Über die Straße“

- **Kata, Freitag** (`rooms/vulkanizer.js`, nach der E-Mail): „In der Mappe ist alles. Außer dem einen Blatt. Der Lastwagen war von meinem Onkel. Das Blatt hat die Tante. Die Tante wohnt drüben, am Markt. Papa und sie reden nicht. Seit vierundneunzig. Ich bin das Telefon zwischen ihnen. Ein schlechtes.“ → `v3_blatt` („Das Blatt hat die Tante“).
- **Vera, Samstag** (`rooms/tepa.js`): Vorstellung „???“ → „Vera Rajić“, sobald Marko den Namen Rajić nennt (Notiz `v3_where` oder `v3_blatt` zeigen) oder Zlata fort ist und Vera von der Waage spricht. Sie fragt, woher er den Namen hat. Gespräch: die Wohnung drüben; „Mein Bruder fährt nicht mehr. Er fährt seit vierundneunzig nicht mehr. Das sagt man so. Er geht auch nicht.“ – „Im Januar vierundneunzig hat er mir gesagt: Ich bringe dir eine. Aus Split. Mach ein Bett. Ich habe ein Bett gemacht. Um zwei hat er den Motor abgestellt. Ich habe gewartet, dass eine Tür geht. Es ist keine gegangen. Am Morgen saß er im Führerhaus, und ich habe gefragt. Er hat gesagt: Ich habe nie jemanden mitgenommen. Mit dem Gesicht, das er hat, wenn er lügt.“ → `v3_bed`. Fehlversuch: „Wo ist das Mädchen?“ → „Fragen Sie ihn. Sie können über die Straße. Ich nicht. Doch. Ich will nicht.“
- **Die Waage** (`tepa.js`, nach `k3.z.mala` oder `k3.z.lost`): Zlatas Waage steht noch am Stand. Vera: „Die Waage. Die vergisst sie jetzt öfter. Sie wohnen bei der Biegung, Sie fahren doch hin, Sie haben so gefragt.“ → `vaga`. Nachts in Skela: die Waage an Zlatas Tür (statt oder vor dem Klopfen): Zlata nimmt sie: „Moja vaga.“ Sie sieht Marko an, dann zur Glocke drüben. „Sutra. Danju.“ → `k3.z.vaga`. Sonntag steht die Waage auf dem Küchentisch (Beschreibung).
- **Vlado, Samstag**: `v3_bed` zeigen → Vlado: „Vera.“ Pause. „Siebzehn Jahre, und sie erzählt es einem Fremden am Eierstand.“ – „Um zwei. Ja. Ich war noch mal unten.“ → `v3_two` schon am Samstag (zweiter Weg; Teil 2 am Sonntag erkennt das: „Das haben Sie von Vera.“).
- **Der Brief, Sonntag** (`tepa.js`, Vera da, Bedingung `v3_who` oder `v3_message`; vorher „Mala fragen“ `vera`): Vera: „Dann schreiben Sie ihm. Sie sind Übersetzer. Übersetzen Sie, was ich sage, in das, was er versteht.“ Rätsel `A.puzzle`, vier Zeilen à drei Fassungen:
  1. Anrede: „Vlado.“ / „Lieber Bruder,“ / „Du.“ → richtig „Vlado.“ (Vera: „Lieber? Er würde den Brief umdrehen und nachsehen, wer das geschrieben hat.“ / „Du? So fange ich keinen Satz an.“)
  2. Das Bett: „Ich habe damals ein Bett gemacht.“ / „Ich habe dir verziehen.“ / „Das Bett steht noch.“ → richtig „Ich habe damals ein Bett gemacht.“ („Verziehen? Was denn? Er hat nie gesagt, was.“ / „Das Bett steht nicht mehr. Ich lüge nicht in einem Brief.“)
  3. Die Wahrheit (braucht `v3_who`/`v3_message`): „Sie hat dich weggeschickt. Du bist zurückgekommen.“ / „Es war nicht deine Schuld.“ / „Ich weiß, was passiert ist.“ → richtig die erste („Nicht seine Schuld? Das sagt man Kindern.“ / „Weiß? Ich weiß nichts. Sie wissen es. Schreiben Sie, was Sie wissen.“)
  4. Das Papier: „Das Blatt liegt bei mir. Kata soll es holen.“ / „Komm es holen.“ / „Ich bringe es dir.“ → richtig „Komm es holen.“ („Kata? Kata ist das Telefon. Ich will kein Telefon mehr.“ / „Bringen? Ich gehe nicht über die Straße. Das steht fest.“ Marko: „Steht es?“ Vera: „Schreiben Sie: Komm es holen.“)
  → Gegenstand `pismo`. Der Brief wird erst richtig, wenn Zeile 3 vorhanden ist; ohne `v3_who` fehlt die dritte Zeile, und Vera sagt: „Da fehlt was. Das, was Sie nicht wissen. Oder nicht sagen.“
- **Vlado liest** (`vulkanizer.js`, `pismo` geben, nach `k3.v.part2`): „Er liest. Er liest es zweimal. Dann faltet er es und steckt es in die Brusttasche, zu den Zigaretten.“ Vlado: nichts. Kata: „Was steht drin?“ Marko: „Dass sie ein Bett gemacht hat.“ → `k3.v.veraLetter`. Mala: „Er hat nichts gesagt.“ – „Bei ihm ist das ein Satz.“
- **Finale** (`vhof.js`, Abfahrt): Mit `k3.v.veraLetter` steht Vera am Rolltor, einen Umschlag in der Hand. Sie gibt ihn Kata. „Das Blatt. Für Graz. Nicht für ihn.“ Vlado sieht sie an. Nickt. Vera: „Fahr still.“ (Sie kennt den Satz nicht; sie sagt ihn, weil sie ihn so kennt: Er redet nicht beim Fahren.) Mala: „Das ist nicht viel.“ Marko: „Das ist eine Straße.“ Vera geht zurück. → `k3.fin.vera`.

### F.2 N2 „Das Lied vom Fenster“

- **Das Lied** ist das bestehende (`16_k3_audio.js`: „Kad ja pođoh na Bembašu“ in der Fassung der verstimmten Gitarre) [B]. Im Spiel heißt es nur „das alte Lied“ und „das Lied vom Fenster“; niemand nennt eine Herkunft. Die Strophen sind Volksgut; das Spiel verwendet sechs halbe Zeilen in Markos Übersetzung und die Originalzeile der Einladung.
- **Liam, Freitag- oder Samstagnacht** (`herberge.js`): „Do you know the words? The guy in Sarajevo only sang the first bit, and then he cried, and then he bought us a round.“ Marko: Er kennt das Lied, jeder in Sarajevo kennt es; aber Bec will es aufschreiben, und Liam will wissen, worum es geht. Rätsel `A.arrange`: sechs Zeilen (Markos Übersetzung) in die Reihenfolge der Geschichte bringen: zum Wasser gehen · das Lamm mitnehmen · die Mädchen an den Toren · die Liebste am vergitterten Fenster · „Guten Abend“ · „Komm heute Abend“. Jede falsche Stelle hat Markos Begründung („Erst geht er zum Wasser. Die Mädchen sieht er unterwegs.“). → Bec schreibt es mit (`k3.s.words`). Mala: „Das Lied ist nicht über ein Mädchen, das wartet.“ – „Doch. Am Ende sagt sie: Komm. Und das Lied hört auf.“
- **Davor und Lena an der Brücke, Samstag** (`zelenika.js` Sa: Lena: „Gehen wir zur Brücke? Papa will nicht.“ Davor: „Ich war seit zweiundneunzig nicht da. Ich will nicht sehen, wie es jetzt ist.“ Marko kann Jela fragen (neue Zeile bei Jela, nach `k3.b.jela`): Jela: „Dijete mora vidjeti most. Idite.“ Davor: „Sie hat uns den Weg erklärt wie in eine andere Stadt. Für sie ist es eine.“ → `k3.s.trip`. In `starimost.js` erscheinen Davor und Lena in `k3_d2` nach `k3.s.trip`; die Australier erscheinen dort mit `k3.s.words`.
- **Dinos Regel** (`starimost.js`): Die Australier wollen am Brückenkopf spielen; Dino: „Am Brückenkopf spielt keiner umsonst. Eine Geschichte. Eine wahre. Das ist der Preis.“ Marko erzählt eine aus seinem Notizbuch (`A.pickNoteThink`): Mates Warten (`b3_mate`), der Fahrer (`v3_*`), die Eierfrau (`l3_eggwoman`) oder die Brücke, die keiner gezählt hat (`l3_uncounted`). Jede trägt; Dino antwortet je eigen. → `k3.s.dinoOk`. Ein Tourist fragt, ob das hier die Grenze ist; Dino: „Das hier ist eine Brücke. Die Grenze ist eine Straße mit einer Bank, die man nicht sieht.“
- **Die Aufführung**: Liam singt mit Bec' Zettel die dritte Strophe. Lena: „Das kenn ich! Vom Telefon. Opa hat das gesummt, wenn er nichts mehr wusste.“ Davor: „Immer dasselbe. Und immer vor der Stelle aufgehört.“ → `b3_hum`. Lena: „Was heißt das? Dođi, dragi …“ Marko übersetzt: „Komm, Liebster, komm heute Abend.“ Lena: „Das sag ich ihm.“ → `k3.s.lenaVerse`.
- **Mate und Zdravko** (`kafic.js`): Mala lauscht am Fenstertisch: „Er summt. Immer dieselbe Stelle. Dann hört er auf, als käme eine Tür.“ → `b3_hum`. Zdravko: „Dida Mate hat gesummt. Bis zum Fenster. Weiter hat er es nie gekonnt. Oder nie gewollt.“ → `b3_hum`.
- **Sonntag am Tor** (`zelenika.js`): Neue Lena-Zeile „(Ihm die Strophe singen.)“ (mit `k3.s.lenaVerse`): Lena singt die Zeile. Mate hört auf zu summen. „Doveče. Das hat keiner mehr … Woher hast du das?“ Lena: „Vom Telefon, dida.“ Mate: „Das ist Davor.“ Zweiter Weg zu `k3.b.son`.
- **Samstagnacht in der Herberge** (`herberge.js`): Mit `k3.s.words` singen die Australier richtig, mit der dritten Strophe. Mala: „Jetzt singen sie richtig.“ Marko: „Schade?“ Mala: „Nein. Schön richtig.“
- **Montag** (`herberge.js`, Epilog): Maja: „Die Australier haben bezahlt. Mit einem Video. Liam singt, und Bec hält einen Zettel ins Bild.“

### F.3 N3 „Mates Fahrkarte“

- **Zdravkos Schublade** (`kafic.js`, Hotspot `bar_drawer`): Marko: „Eine Schublade unter der Theke, mit einem Messingknopf. Zdravko stellt die Tasse darauf, wenn er zählt.“ Mala `g:look`: „Eine Mappe. Ein Fahrschein, blau. Und ein Brief, angefangen. Jemand hat die Mappe zweimal zurückgelegt.“ → `b3_folder`.
- **Zdravko** (`b3_folder` zeigen): „Das ist von Mate. Vom Tag, an dem er … an dem der Kaffee kalt wurde. Es gehört dem, der kommt. Er ist am Samstag an meinem Fenster vorbeigegangen wie an einem Schaufenster.“ Zdravko gibt sie nicht Marko.
- **Lena** (`zelenika.js`, Sonntag, nach `b3_dida` oder `b3_hum`): „Wo hat er gewartet? Zeigst du es mir?“ Davor: „Geh. Ich komme nach.“ Er kommt nicht. → `k3.s.lenaCafe`; in `kafic.js` steht Lena am Fenstertisch (`k3_d3`, bis `k3.b.folder`). Lena sieht die Fotos: „Da ist er. Mit Hut.“ Zdravko sieht sie lange an. Dann holt er die Mappe. „Dem, der kommt.“ → `mapa_mate`, `k3.b.folder`. Inhalt (`A.doc`): AUTOBUSNA KARTA · MOSTAR – MÜNCHEN · 14.03.2010 · 06:30 · jednosmjerna. Und ein Blatt: „Dragi Davore, dolazim. Ne čekaj me na stanici, znam put.“ Marko übersetzt: „Lieber Davor, ich komme. Hol mich nicht ab, ich kenne den Weg.“ → `b3_coming`.
- **Davor** (`zelenika.js`, `mapa_mate` geben): Er liest. „Der Vierzehnte. Er ist am Zwölften gestorben. Zdravko hat mich angerufen, am Dreizehnten.“ Pause. „Ich verkaufe nicht am Montag.“ Jela: „Nego kad?“ Davor: „Im August. Bei den Feigen. Dann sehen wir weiter.“ → `k3.b.noSale`; Notiz `b3_sell` erledigt; `b3_august`. Der Verkauf bleibt offen [B: Grundsatz].
- **Mate** (`zelenika.js`, Geist am Pfosten, mit `b3_coming`): „Sie hatten eine Fahrkarte.“ → Mate unruhig: „Ich? … Der Vierzehnte. Ein Sonntag. Sonntags fährt der frühe.“ Keine Bedingung, nur Unruhe (`agitate`).

### F.4 N4 „Die Waage“: siehe F.1.

### F.5 N5 „Der Bleistift“

- **Zlata, Sonntag** (`skela_l.js`, nach `a3_pencil`): Zlata fragt zurück: „Traži li je neko?“ Marko wählt: „Ihre Mutter. Seit siebzehn Jahren.“ (wahr) / „Ich weiß es nicht.“ (ausweichend) / „(Mala fragen.)“ Mala: „Sag es ihr. Sie hat mich gewaschen.“ Bei Wahrheit holt Zlata den Bleistift aus der Schublade: „Za majku.“ → `olovka_mala`. Bei Ausweichen behält sie ihn: „Dann bleibt er hier. Bis einer fragt, der es weiß.“ Später am Tag noch einmal möglich (die Frage kehrt zurück, sobald Marko `l3_twosearches` hat).
- **Mala** (`olovka_mala` an Mala): „Meiner. Ich habe immer daran gekaut. Mama hat geschimpft.“ Mala sieht Marko an. „Den hast du jetzt. Mehr von mir hat keiner.“ → `a3_mypencil`.
- **Epilog** (`zlata_k.js`): Mit `olovka_mala`: Nada bekommt neben Brief und Skizzenbuch den Bleistift. Nada: „Sie hat daran gekaut. Immer.“

### F.7 P1 „Das Handschuhfach“ (Gegenstände: Schraubenzieher, Fahrtenbuch 1994, Kassette)

- **Hof** (`rooms/vhof.js`): Marko öffnet das Führerhaus (unverschlossen, kanon) und sieht hinein; danach sind **Handschuhfach** und **Autoradio** eigene Trefferflächen. Mala, Blick aufs Führerhaus: „Im Handschuhfach, durch das Blech: ein Heft. Voll mit Zahlen.“ → `v3_glove`. Der Deckel klemmt; Marko bricht nichts auf. Mala: „Mit etwas Dünnem, Flachem.“
- **Werkstatt** (`rooms/vulkanizer.js`): Auf der Montiermaschine liegt ein Schraubenzieher; nehmen geht, sobald der Hof offen ist; Kata: „Bringen Sie ihn zurück. Papa zählt sie.“ Zurückgeben an Kata möglich.
- Schraubenzieher auf das Handschuhfach → `putni_nalog` (Fahrtenbuch). Lesen (`A.doc`): „14. I. Split – Skela · brašno 40 vr. · deke 200 · +1 · dolazak 22:40 · odlazak 23:15 / 15. I. 02:00 Skela nitko · 06:30 kuća / 16. I. Mostar – Skela (pitao)“ → `v3_log`. Mala: „Plus eins. So heiße ich in seinem Buch.“
- Schraubenzieher auf das Radio → `kaseta` („za put · Mala“). Am Ostbusbahnhof auf das Taxi: der Mercedes spielt sie (Lied vom Fenster, vom Radio aufgenommen; am Ende singt ein Mädchen mit) → `v3_tape`. Mala: „Das bin ich.“ – „Falsch, oder?“ – „Schön falsch.“
- Vlado (Buch geben oder `v3_log` zeigen, Samstag nach Teil 1 oder Sonntag): „Mein Buch.“ Kata: „Ich habe ihm den Schraubenzieher gegeben, Papa.“ Vlado: „Plus eins. So schreibt man das. Man schreibt keinen Namen in ein Fahrtenbuch. Zwei Uhr. Ja. Ich war noch mal unten.“ → `v3_two` (zweiter Weg, vor Teil 2). In Teil 2: „Das wissen Sie aus dem Buch. Jetzt wissen Sie es von mir.“

### F.8 P2 „Batos Blechkiste“ (Gegenstände: Schlüssel, Fährbuch, Mehlsack)

- **Rechtes Ufer** (`rooms/skela_d.js`): Mala, Blick auf den Schuppen drüben (Sonntag): die Blechkiste unter der Ruderbank, durch das Blech das Heft in seiner Schrift → `a3_box`. Marko am linken Ufer sieht die Kiste und das Schloss.
- **Zlata** (`rooms/skela_l.js`): „Batos Kiste. Haben Sie den Schlüssel?“ – „Ich habe nie hineingesehen. Ich kann seine Schrift nicht lesen. Er hat wie ein Arzt geschrieben.“ Sie holt den Schlüssel aus der Schublade: „Und sagen Sie mir nicht, was drinsteht. Oder doch. Später. Wenn ich frage.“ → `kljucic`.
- Schlüssel auf den Schuppen: die Kiste, darin Heft, Foto der Fähre, Pfeife → `knjiga_skele`. Lesen: „15. I. NOĆ · zvono 3× · nisam išao · ‚vojnik‘ / 15. I. jutro · cura u trsci · Zlata · deke · olovka kod zvona / 16. I. Rajić pita za curu · rekao: nitko / 17. I. dunja · daska · MALA“ → `a3_book`, `a3_asked`.
- Schlüsse: `a3_book + a3_slept → a3_awake` („Wer nicht fährt, hat entschieden. Er war wach.“); `a3_book + a3_soldier → a3_awake`, wenn `a3_slept` da ist (sonst Beinahe-Treffer mit Rückfrage). Bato, nach `a3_book` gefragt: „Mein Buch. Wer hat Ihnen mein Buch gegeben?“ – „Zlata.“ – „Sie kann meine Schrift nicht lesen. Darum habe ich alles hineingeschrieben.“ Zählt als Beleg wie „Bato war wach“.
- **Hütte** (`rooms/skela_d.js`), bei Tag: am Mehlsack ziehen → `vreca` („BRAŠNO · 50 kg · SPLIT · XII 1993“) → `v3_sack`. Vlado: „Mein Mehl. Vierzig Sack. Nicht alles, wie ich sehe.“
- **Spendertafel** (`rooms/skela_most.js`): Namen der Spender, darunter „V. Rajić, Mostar“ → `a3_donor`, sobald Marko Vlados Namen kennt. Vlado: „Zweihundert Mark. Mehr hatte ich nicht. Damit keiner mehr nachts läuten muss.“ Kata: „Papa. Du hast für eine Brücke gezahlt?“ – „Für eine Straße mit Geländer.“

### F.9 P3 „Zwei Batterien“ (Gegenstand: Batterie)

- **Kata** (Sonntag, nach „Heute Nacht fahre ich“): „Vierundzwanzig Volt. Zwei Batterien hintereinander. Eine habe ich neu, die zweite ist tot wie ein Stein. Sonntag.“ → `v3_battery`. Mala: „Wer hat hier eine Batterie und ein Auto, das er liebt?“
- **Taxifahrer**: „Für wen?“ – „Für den TAM von Vlado Rajić.“ – „Rajić fährt.“ Er gibt die Ersatzbatterie aus dem Kofferraum: „Für die Fahrt nach Skela, nicht für Rajić. Morgen bringen Sie sie zurück. Und Sie sagen ihm, von wem sie ist.“ → `akumulator` („schwer wie ein Kind“).
- Batterie an Kata: „Vom Taxi. Der flickt seine Reifen bei uns, seit ich denken kann. Zwei. Jetzt sind es zwei.“ → `k3.v.battery`.
- **Finale** (`rooms/vhof.js`): Der TAM springt beim ersten Mal an. Kata: „Die zweite ist vom Taxi am Ostbahnhof.“ Vlado: „Vom Taxi.“ Er nickt, zur Stadt hin. **Epilog**: der Taxifahrer: „Und was hat er gesagt?“ – „Er hat genickt.“ – „Das ist viel. Für ihn.“

### F.6 E „Die Stadt“

Zeilen an den in E.2 genannten Stellen. Der Taxifahrer bekommt eine Gesprächszeile „Kennen Sie Zdravko?“ (nach `b3_zdravko`), Zdravko eine Zeile „Kennen Sie den Taxifahrer am Ostbahnhof?“ (nach `v3_where`). Mala am Gymnasium: `g:listen`: „Zwei Glocken. Eine, dann eine. Die Kinder laufen zweimal.“

---

## G. Umsetzung und Änderungsübersicht

Siehe Tabelle am Ende dieses Dokuments (wird mit der Umsetzung gepflegt).

| Teil | Stand |
|---|---|
| N1 Vera: Kata, Tepa, Waage, Vlado, Brief, Finale | siehe G.1 |
| N2 Lied: Liam, Strophen, Jela, Brücke, Dino, Lena, Zdravko/Mate, Nacht, Montag | siehe G.1 |
| N3 Fahrkarte: Schublade, Zdravko, Lena im Café, Davor | siehe G.1 |
| N5 Bleistift | siehe G.1 |
| E Stadt | siehe G.1 |
| Notizen, Schlüsse, Hinweise, Übersetzungen (bhs) | siehe G.1 |
| Musterlösung, Hinweisprobe, Regression | siehe H |

### G.1 Stand (10. November 2026)

| Teil | Stand | Dateien |
|---|---|---|
| N1 Vera: Katas „das Blatt fehlt“, Vorstellung, das gemachte Bett, Vlados Reaktion, der Brief (A.puzzle), Vlado liest, Vera am Rolltor | **umgesetzt** | `rooms/tepa.js`, `rooms/vulkanizer.js`, `rooms/vhof.js`, `97_k3_ausbau.js` |
| N2 Lied: Liam will den Text (A.arrange), Jela schickt zur Brücke, Davor/Lena/Australier an der Brücke, Dinos Regel, Aufführung, Lenas Strophe, Mate erkennt Davor über die Strophe, Samstagnacht richtig, Maja am Montag, Zdravko und Mate summen | **umgesetzt** | `rooms/herberge.js`, `rooms/zelenika.js`, `rooms/starimost.js`, `rooms/kafic.js` |
| N3 Mates Mappe: Schublade (Mala), Zdravkos Bedingung, Lena im Café, die Mappe (A.doc), Davor verschiebt, Jela und Mate reagieren | **umgesetzt** | `rooms/kafic.js`, `rooms/zelenika.js`, `97_k3_ausbau.js` |
| N4 Waage: Vera gibt sie mit, Zlata nimmt sie an der Tür, Sonntag auf dem Tisch | **umgesetzt** | `rooms/tepa.js`, `rooms/skela_l.js`, `rooms/zlata_k.js` |
| N5 Bleistift: Zlatas Frage, „Mala fragen“, Mala, Nada im Epilog | **umgesetzt** | `rooms/skela_l.js`, `rooms/zlata_k.js`, `12_k3_items.js` |
| P1 Handschuhfach: Schraubenzieher, Fahrtenbuch, Kassette, Taxi-Radio, Vlados Reaktion, Teil 2 angepasst | **umgesetzt** | `rooms/vhof.js`, `rooms/vulkanizer.js`, `rooms/ostbus.js`, `97_k3_ausbau.js` |
| P2 Blechkiste: Malas Blick, Zlatas Schlüssel, Fährbuch, zwei Schlüsse, Bato, Mehlsack, Spendertafel | **umgesetzt** | `rooms/skela_d.js`, `rooms/skela_l.js`, `rooms/skela_most.js`, `13_k3_notes.js` |
| P3 Batterie: Kata, Taxifahrer, Finale, Epilog | **umgesetzt** | `rooms/vulkanizer.js`, `rooms/ostbus.js`, `rooms/vhof.js` |
| E Stadt: Taxifahrer/Zdravko, Gymnasium, Dino an der Brücke, Kata | **umgesetzt** | `rooms/ostbus.js`, `rooms/kafic.js`, `rooms/bulevar.js`, `rooms/starimost.js`, `rooms/vulkanizer.js` |
| Notizen (18), Erledigt-Regeln, zwei Schlussregeln, Gegenstände (11), Hinweisthemen (17), Probe-Zuordnungen | **umgesetzt** | `13_k3_notes.js`, `12_k3_items.js`, `15_hints_k3.js`, `qa/hints/stufe4.js` |
| Regressionstests mit Spielständen | **umgesetzt** | `qa/regress/bug_023_k3_ausbau.js`, `bug_024_k3_gegenstaende.js`, `qa/regress/fixtures/k3x_*.json` |
| Dokumente: LOESUNG3, HINWEISE (neu erzeugt), AENDERUNGEN | **umgesetzt** | – |
| Übersetzungen ins Bosnische/Kroatische für die neuen Sätze | **offen** (wie für alle Sätze der Kapitel 2 bis 5: nur Kapitel 1 ist übersetzt) | `lang/` |
| Neue Grafiken | nicht nötig: alle neuen Szenen nutzen vorhandene Figuren, Räume und Gegenstandssymbole (vier neue Symbole gezeichnet) | – |
| Vorstellung der neuen Figur | Vera nutzt die vorhandene Figur „Marktfrau“ (Modell, Porträt, Stimme); der Name erscheint, sobald Marko ihn kennt | – |
| Musterlösung `walkthrough3.js` | unverändert (die Pflichtschritte sind dieselben); die Vertiefungen prüft BUG-023 | – |

**Nicht umgesetzt (nur konzipiert):** keine Teile des Konzepts in Abschnitt F sind offen geblieben. Nicht aufgenommen wurde eine Erweiterung der Springerhütte (Fotowand, der schlafende Präsident): Sie hätte einen neuen Raum gebraucht, ohne einen Geisterfall zu berühren.

**Speicherkompatibilität:** Alle neuen Prüfungen lesen Schalter mit `!!G.flags[...]`; fehlende Schalter gelten als „nicht geschehen“. Ein alter Stand sieht die neuen Stränge an dem Tag, an dem sie beginnen können (Vera auch am Sonntag; die Waage nur, wenn Zlata am Samstag im selben Stand ging). Keine Migration nötig.

**Touch und Maus:** *(Fassung vom 10.11. – diese Aussage war falsch, siehe Teil R.1, K3-01.)* Handschuhfach, Autoradio und Zdravkos Schublade waren neue Stellen, hatten aber keine Fläche im Bild. Seit der Revision gezeichnet, mit Fläche, mit echter Maus und echtem Finger geprüft.

---

## H. Testbericht

*(Erste Fassung. Der Testbericht der Revision steht in Teil R.8; die Musterlösung hat sich geändert, die Zahlen hier gelten für den alten Bau.)* Alle Angaben beziehen sich auf den Bau vom 10. November 2026 (`web/index.html`, Fassung mit Stempel auf dem Titelbild).

| Prüfung | Werkzeug | Ergebnis |
|---|---|---|
| Musterlösung Kapitel 3, alle Pflichtschritte | `node qa/runwalk.js game/tools/walkthrough3.js` | 113 Schritte, keine JS-Fehler |
| Hinweisprobe: Stufe 4 ausführbar, Abdeckung, Wiederöffnung, Stranglücken; Musterlösung (135 Stände) und Varianten | `node qa/hints/hintprobe.js --dumps … --varianten` | 248 Proben, 0 Fehler, 0 zu prüfen |
| Die neuen Stränge über Spielerhandlungen (A Freitagnacht, B Samstag, C Samstagnacht, D Sonntag, E Finale; 24 Prüfpunkte) | `node qa/regress/run.js --only BUG-023` | OK |
| Die Gegenstandsrätsel (Schraubenzieher, Handschuhfach, Fahrtenbuch, Kassette im Taxi, Batterie, Mehlsack, Tafel, Blechkiste, Fährbuch, Schluss, Bato, Finale; 21 Prüfpunkte) | `node qa/regress/run.js --only BUG-024` | OK |
| Regression aller behobenen Fehler (Kapitel 1 bis 5) | `node qa/regress/run.js` | 24 OK |
| Browser: Tepa mit Vera, Alte Brücke am Samstag (Davor, Lena, Australier, Dino), Café mit Lena, Vera am Rolltor | Playwright, Chromium | Szenen laufen, Figuren stehen frei, keine Konsolenfehler |

**Was nicht geprüft wurde:** menschliche Spieler, echte Spielzeit, Ton, Geräte außer Chromium (Desktop). Die Zahl der Spielerhandlungen in den Vertiefungen (etwa 60 zusätzliche Handlungen mit drei Rätselfeldern) ist gezählt, nicht gemessen; eine Spielzeit wird nicht behauptet.

**Gefundene und behobene Probleme während der Umsetzung:**
- Der Gegenstand „dnevnik“ gibt es schon in Kapitel 1; das Fahrtenbuch heißt `putni_nalog`.
- Mala bleibt in Skela am rechten Ufer (kanon); ihr Blick in Batos Kiste geht deshalb vom rechten Ufer aus („Ich sehe von hier, was mir gehört“), Marko sieht die Kiste am linken.
- Nach „Heute Nacht fahre ich“ war Vlados Gespräch zu; jetzt nimmt er Notizen (Fahrtenbuch, Tafel, Mehlsack) weiter entgegen.
- Vlados Schwester ist nach Kanon 2002 gestorben (`vulkanizer.js`, Zeile „Sie ist tot. Zweitausendzwei.“). Vera ist deshalb die jüngere von zwei Schwestern; die ältere hatte das Zimmer mit dem Ofen. Vlados Satz ergänzt das, wenn Marko Vera kennt.
- Der Typenschein liegt laut Freitag in der Mappe. Kata stellt am Samstag beim Durchsehen fest, dass das eine Blatt fehlt (keine Änderung am Freitag).
- Graz: Nach Vlados Befreiung verkaufen die Rajićs den TAM nicht mehr [B]. Vera bringt das Blatt trotzdem: „Es gehört zum Lastwagen.“
- Lenas Weg ins Café stand zu früh in ihrem Menü und zog sie vor dem Schlüssel am Tor aus dem Hof; die Hinweisprobe fand es (d3s). Jetzt erst nach „Ich bin nicht mehr da“.
- Die Samstags-Hinweise zur Brücke blieben nach Tagesende offen; die Probe fand es (x3b). Jetzt schließen sie mit `M.k3DayReady`.
- Ein Zeilenkommentar hinter `done('l3_skela', …)` hatte die Regel für „Markttag“ ausgeschaltet (Inventar).

---

## I. Prüfung gegen die Vorgaben (Abschnitt 24 des Auftrags)

*(Erste Fassung. Der Prüfbericht hat diese Selbstprüfung zu Recht als zu günstig bewertet; die Punkte Brücke, Fallverflechtung, Teilung, Pflichtumfang und Tests beantwortet Teil R neu.)*

| Frage | Antwort |
|---|---|
| Stari Most mehrfach und unterschiedlich spielbar? | Ja: Prolog (Identifikation), Freitag (Peilung), Samstag (Jelas Entscheidung, Dinos Regel, die Aufführung, Lenas Strophe, Davors Erinnerung, die Grenze, die keine ist), Nächte (der Springer), Sonntag (Roller), Epilog (Malas Gang). Andere Orte: Tepa (Vera, Waage, Brief), Café (Summen, Schublade, Lena), Herberge (Zettel, richtig gesungen, Video), Hof (Vera am Tor). |
| Musiker mit mehrstufiger Funktion? | Ja: Zettel (Ordnen), Brücke (Dinos Preis), Aufführung (zwei Ausgänge je nach Zettel), Lenas Strophe, Mates Erkenntnis, Samstagnacht, Montag. Kein Instrument ist verloren; das Problem ist der Text und der Ort. |
| Handelt Zlata selbst? Sind Davor, Lena, Jela, Zdravko mehr als Hinweisgeber? | Zlata nimmt die Waage und entscheidet über den Bleistift. Jela entscheidet, dass das Kind die Brücke sieht. Davor geht gegen seinen Willen, erinnert sich, verschiebt den Verkauf. Lena lernt die Strophe, geht ins Café, bringt die Mappe. Zdravko hält die Mappe zurück und gibt sie der Richtigen. |
| Bato und Mate eigenständig, Fälle verbunden? | Beide Fälle unverändert in ihrem Kern. Verbindungen: Zdravko (Karte für A, Mappe und Summen für B), der Taxifahrer (Fahrt nach Skela für A, Zdravkos Kollege), Vera (A) am selben Stand wie Zlata (A), das Lied (Mate, die Australier, Lana im Führerhaus). |
| Müssen Marko und Mala unterschiedliche Fähigkeiten einsetzen? | Neu: Mala sieht in Zdravkos Schublade, lauscht Mates Summen, wird zweimal gefragt (Vera, Bleistift), sieht ihren Bleistift. Marko ordnet, übersetzt, erzählt Dino, gibt. |
| Denkarbeit statt Durchklicken? | Gegenstandsketten über mehrere Orte: Schraubenzieher → Handschuhfach → Fahrtenbuch → Vlado; Malas Blick → Zlatas Schlüssel → Blechkiste → Fährbuch → Schluss → Bato; Kata → Taxifahrer → Batterie → Finale; Mehlsack und Spendertafel als Belege. Dazu zwei Rätselfelder mit begründeten Fehlantworten (Strophen, Brief), Wahlen mit Folge (Jela, Zlata), Dinos Geschichte aus dem Notizbuch, zwei Wege zu Mates Erkenntnis, drei Wege zu „Bato war wach“. |
| Mehrere Ziele parallel? | Samstag: Vera, Waage, Jela, Brücke neben Tepa, Vlado, Bus. Sonntag: Strophe, Café, Mappe, Brief, Bleistift neben Fall A und B. Reihenfolge frei (C.1). |
| Konsequenzen? | Verkauf verschoben, Vera am Tor, Zlatas Waage auf dem Tisch, der Bleistift bei Nada, Mates Erkenntnis über die Strophe, das Lied richtig gesungen, das Video. |
| Historischer Hintergrund stimmig? | Jahr 2011 (A.4), Brücke von 2004, Teilung als Alltag ohne Seiten (E). Keine Gruppenzugehörigkeit, keine Belehrung. |
| Emotionale Glaubwürdigkeit ohne große Versöhnung? | Vera bleibt am Tor und geht zurück. Zdravko und der Taxifahrer winken. Davor verschiebt, verkauft nicht nicht. |
| Umfang durch sinnvolle Handlungen? | Etwa 60 neue Handlungen, drei Rätselfelder, keine neuen Laufwege (alle neuen Orte sind die alten). |
| Technik: Pflichtschritte erreichbar, Speichern/Laden, Übergänge? | Musterlösung unverändert, Regression 23/23, Stände ohne neue Schalter laufen, keine neuen Pflichtbedingungen. |
| Gesamtgeschichte: Fortsetzung vorbereitet, Finale nicht vorweggenommen? | Der Bleistift geht an Nada (Kapitel 5), Vera und der Brief bleiben in Mostar, Malas Fragen (wem gehört mein Tod) werden berührt, nicht gelöst. |

**Verbleibende Einschränkungen:** Die Vertiefungen sind freiwillig; wer die Hinweise nicht öffnet, kann sie übersehen. Die neuen Sätze sind nur deutsch (wie das übrige Kapitel). Eine Erstspielerzeit ist nicht gemessen.
