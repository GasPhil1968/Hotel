# MALA – Abhängigkeitsübersicht aus dem dokumentierten Design (QA)

Stand: Dokumente im Repository, 7. 11. 2026. **Grundlage sind nur die Dokumente**, nicht der Code. Bei Widersprüchen gilt die Priorität LOESUNG1–4 > README/LIESMICH > KONZEPT/KAPITEL2/K3_SPEC/K4_SPEC > Berichte. Wo ein Bericht eine spätere Änderung belegt (BERICHT_PRUEFBERICHT), ist das vermerkt. Offene Punkte stehen in Abschnitt 3.

Notation: `Ergebnis ← benötigt`. **[M]** Marko, **[G]** Mala. „+“ heißt Notizen im Notizbuch verbinden. *kursiv* = Notiz/Schluss, **fett** = Gegenstand. „frei“ = Reihenfolge beliebig. „Abw.“ = dokumentierte Abweisung.

---

## 1. Allgemeine Regeln

### 1.1 Marko und Mala
- **Marko (lebend):** redet mit Lebenden und Geistern, nimmt, öffnet, benutzt, liest, kombiniert, gibt. Geht nicht durch Türen/Wände („Da komme ich nicht durch.“, KAPITEL2.md:343). Im Dunkeln sieht er nur, was im Lichtkeil oder in Malas Schein liegt (LIESMICH:101; K1 Kühlraum, K2 Schutzraum). In der Zwischenwelt spielt man immer Marko, er tut „das Letzte“ (LIESMICH:111–113).
- **Mala (Geist):** geht durch Wände/verschlossene Türen in Nebenräume (Geisterwege), Geistersicht, „Spüren“ (Nachhall), „Lauschen“ bei Lebenden, spricht mit Geistern, sieht Gegenstände an, die Marko auf sie zieht (LIESMICH:94–100). **Fasst nichts an** („Ich kann es nicht halten.“), redet nicht mit Lebenden, wird von Lebenden nicht gehört; ab K4 telefoniert sie auch nicht (LOESUNG4:9). Allein nimmt sie keine normalen Ausgänge („Ohne Marko geht sie nicht weit“, LIESMICH:97; KONZEPT:69). Verlässt Marko einen Ort, kommt sie mit; bleibt sie in einem Nebenraum, wartet sie dort (KONZEPT:69–70).
- **Figurenwechsel:** unten links/Tab/M. Nicht möglich: vor dem Hafenamt-Test (K1), in Szenen mit abwesender Mala, in der Zwischenwelt (KONZEPT:68).
- **Geister sehen:** Marko sieht einen Geist erst, wenn Mala ihn gefunden hat; bis dahin pocht sein Kopf (dunkler Bildrand). Gilt laut BERICHT_K4:21 jetzt in allen vier Kapiteln („Leere Stelle“) – siehe Widerspruch W7.
- **„(Mala fragen.)“:** ab K3 nach Gespräch 1 an Entscheidungspunkten, freiwillig; übergeht Marko sie, rügt sie einmal (K3_SPEC:139–160). Keine Rüge bei eigener Probe, eigenem Formularsatz, der von Mala aufgetragenen Botschaft (BERICHT_K3:320). K4: nur noch für Lanas Geschichte (Keys `lana_jasna`, `lana_ana`), nie Rüge (K4_SPEC:229–248, LOESUNG4:16).

### 1.2 Dokumentierte Ausnahmen (Malas Verfügbarkeit)
| Kapitel/Phase | Regel | Quelle |
|---|---|---|
| K1 Prolog bis Hafenamt | Kein Wechsel. Wohnung-Kennenlernen am Mittwoch ohne Wechselknopf. Erst „(Leise:) Dann sieh nach.“ im Hafenamt schaltet ihn frei; Ablehnen/Schweigen → später über *Rede mit* Mala nachholbar | LOESUNG1:28, :139–140; LIESMICH:88 |
| K1 nach Ivka (Mi spät–Do Bar) | Mala fort, kein Wechsel, keine Geisterzeile, auch nach Speichern/Laden; zurück erst am **Markos Tisch** in der „Bura“ | LOESUNG1:155–181; LIESMICH:89–91 |
| K1 Altstadt (Fall 2) | Mittagsglocken: Mala kurz weg („Zu laut.“) | KONZEPT:386 (Fall 2, Schritt 9) |
| K1 Epilog | Mala nicht da, Wechselknopf leer, bis zur Bank am Busbahnhof | KONZEPT:248 |
| K2 Prolog | Mala bei der Einfahrt verschwunden, Wechselknopf leer, bis **entwerteter Fahrschein** auf Mala (Bank an der Drei) | KAPITEL2:180–187; LOESUNG2:33–35 |
| K3 Westufer | Mala geht über keine Brücke, bis sie die Straßenbrücke mit geschlossenen Augen überquert; vorher kein Reisen ans Westufer („(Allein gehen.)“ → Leine zieht, Marko kehrt um) | LOESUNG3:58, :235–237; K3_SPEC:110 |
| K3 Skela | Mala bleibt in `skela_d`, wenn Marko über die neue Brücke geht (Sa-Nacht, Sonntag, Finale bis zur Überfahrt) | K3_SPEC:117 |
| K3 Partisanenfriedhof | Glocken: Mala kurz fort, warten | LOESUNG3:59 |
| K4 Tagphasen | Mala geht **allein** durch Ausgänge und reist allein über den Plan; Marko bleibt; gleicher Raum → sie folgt; abends beide in Mamas Wohnung | LOESUNG4:10; K4_SPEC:148–154 |
| K4 Nachts | Mala allein nur durch die Türen in Mamas Wohnung/Haus (`jwohnung`, `jschlaf`, `jhaus`) | K4_SPEC:158; LOESUNG4:10 |
| K4 Do-Abend (Streit) bis Fr-Nacht | Mala fort, nicht wählbar, unsichtbar; wartet dann auf der Hackerbrücke; kein Weg, sie früher zu finden | K4_SPEC:155; BERICHT_K4:17; LOESUNG4:154, :227 |
| K4 Silvesternacht | Mala bei Marko; darf als Aktive für die Spur aus Anas Wohnung | K4_SPEC:156 |

### 1.3 Geister (Ablauf, alle Kapitel)
1. **Finden:** Mala findet den Geist (Leine aus Licht zu Ort/Ding). Erst danach sieht ihn Marko.
2. **Leugnen:** Direkt „Sie sind tot“ sagen wird nicht gehört (Ivka: „Sie haben getrunken.“; Bato: „Was? Der Fluss ist zu laut.“) – erwartete Abweisung ohne Folgen (KONZEPT:104; K3_SPEC:26).
3. **Unruhe → Erkennen:** Erkenntnis kommt am Ding/Zeichen, nicht durch Behauptung. Gestalt flackert **5 s** (Erstarren 0–0,8 / Flackern –2,6 / Höhepunkt –3,6 / Fangen –5 s), Geisterwind; je Geist nur einmal, Szene läuft auch ohne Figur weiter (KONZEPT:106–114; LIESMICH:108–111; BERICHT_K2:23).
4. **Hinüberbringen:** Spiel wechselt zu Mala, Verb „Hinüberbringen“, Schwelle an einem Ort des Geistes, „Nimm meine Hand“ (KONZEPT:114–115).
5. **Zwischenwelt:** schwebende Steine, steinernes Tor; Marko tut das Letzte, dann geht der Geist ins Licht; **zurück durch das Tor** (vorher ist das Tor gesperrt, walkthrough.js:124).
6. **Gegenstandsregel:** „Wer losgelassen hat, kann etwas hergeben, und es bleibt“ (Tomažs Zettel, Gerdas Kanne) (BERICHT_PRUEFBERICHT:180; K4_SPEC:51).
7. **Ausnahmen ohne Zwischenwelt:** Alija (K2, Erkenntnis ohne Zutun beim Einsteigen in die letzte Drei), Hansi (K4, geht nur mit „Feierabend“) (LOESUNG2:291; K4_SPEC:52). K2 Fall-1-Nacht, K3 Mate: zweistufige Erkenntnis bei Mate.

### 1.4 Karte / Stadtplan
- Nur bekannte Orte. **Ring** = hier; **gestrichelter Ring** = gerade nicht (Uhrzeit, Begleitung, etwas steht an), Tipp sagt warum; **Schloss** = bekannt, noch nicht erreichbar, Tipp sagt warum (LIESMICH:68–76).
- **Reisen nur von der Straße aus**; aus Innenräumen zeigt der Plan nur den Standort (LIESMICH:75–76). Orte erscheinen, wenn jemand davon erzählt hat (KONZEPT:144).
- Gesperrte Ausgänge bleiben gesperrt, Absage nur einmal; Doppeltipp auf Ausgang = sofort draußen (LIESMICH:64–67).
- Sperrsätze nennen einen Grund in der Welt, nie den nächsten Ort (BERICHT_PRUEFBERICHT:90–92, :184).
- K3: Skela erst nach *Skela* (davor „Hinter dem Kartenrand“), Taxi immer, Dinos Roller optional; nachts nur Herberge, Alte Brücke, Ostbusbahnhof (+ Sa-Nacht Skela); weg aus Skela nur von `skela_d` (K3_SPEC:108–119; BERICHT_K3:321).
- K4: Nachtphasen kein Reisen („Es ist Abend. Mama hat gekocht.“); Silvester `k4_fin_a` nur Ana, `k4_fin_n` nur Heim nach der Spur; Hackerbrücke nicht auf dem Plan (zu Fuß vom ZOB); Epilog kein Reisen (K4_SPEC:139–146, :135).

### 1.5 Speichern
- **3 Plätze** für alle Kapitel; Platz zeigt Kapitel und Abschnitt; alte K1-Stände laden unverändert; Spielstände gelten für beide Sprachen (LIESMICH:52, :159–161).
- **Autosave bei jedem Ortswechsel** (LIESMICH:159–160).
- Unterbrechung mitten in einer Szene (Titelbild, App-Wechsel): Stand vom **Szenenbeginn** wird gemerkt, Szene wird wiederholt, nichts geht verloren (LIESMICH:162–164); präziser: Szenenbeginn **oder letztes `A.save()` in der Szene** (BERICHT_PRUEFBERICHT:21).
- Beim Laden werden **ausstehende Abschnittswechsel** nachgeholt (BERICHT_PRUEFBERICHT:175); K4: an jedem Tageswechsel (LOESUNG4:207).
- Feste Zwischenstände: K3-Finale cp1–4 (LOESUNG3:261; K3_SPEC:449–468), K4-Silvestergespräch cp1–3 (LOESUNG4:172–181; K4_SPEC:406–428). Laden dort = genau ab dort weiter.
- Fortsetzen fragt nach dem Platz; „Mitgelieferter Spielstand“ = K1 kurz vor der Wahrheit für Ivka (Nacht an der Mole, Brief gelesen, Handschuhe) (LIESMICH:165–167).

### 1.6 Kapitelwahl und Übergänge
- Alle vier Kapitel direkt im Hauptmenü, ohne Sperre/Rückfrage; Kapitel + Speicherplatz → Start; ohne Vorkapitel gelten Vorgaben (LIESMICH:33–36). Nach jedem Abspann „Weiter mit Kapitel n+1“ (bis K4).

| Übergang | Übertragen | Vorgabe ohne Stand | Quelle |
|---|---|---|---|
| K1→K2 | Bank an der Riva: `i1.answer` (warum in Split), `i1.sarajevo` (warum nicht zurück); Notizen „Aus Split“ (`m_register`, `m_journal`, `m_31`, `m_chalk`, `m_sarajevo`, `m_waited`, `m_tin`, `m_bells`); Honorar ausgegeben | „hängen geblieben“, „Da ist niemand mehr“; Erinnerungen aus Split (Register immer da) | KAPITEL2:58–61; BERICHT_K2:96, :170 |
| K2→K3 | Straßenbahn-Geständnis (`confess`), Warum Mostar, Hajra-Besuch, Ana-Anruf, Vater (`M.k3Carry`); Notizen `k3_c_bridge`, `k3_c_name`, `k3_c_missing`, `k3_c_promise` | „Ich bin gekommen“, „wegen der Brücke“ | K3_SPEC:135, :324–327; BERICHT_K3:275; LIESMICH:40–41 |
| K3→K4 | Zustimmung am Grab `consent` a/b/c, Probe ja/nein, Gespräch-1/2-Antwort, Zahl der Nachfragen/Übergehungen, K2 Ana/Vater | consent **b**, Probe **ja**, promise a, talk2 a, asks 3, skips 0, ana/father false | K4_SPEC:207–228; LOESUNG4:5, :194 |
- Handlungsrelevant nur: K4 Probe (Kolar-Anruf zweifach, Konsulat nur bei „nein“, Silvester-Zug anders) und Zustimmung c (Pflichtfrage im Epilog). Rest = Dialogfarbe (K4_SPEC:224–227).
- Ältere Split-Fassung: deren Split-Ende wird nicht erkannt → Vorgaben (BERICHT_K2:169). Das Spiel sagt nicht, welche Vorgaben gelten (BERICHT_K2:170; BERICHT_K3:275).

### 1.7 Allgemeine Fehlwege
- Falsche Notizverbindung: eigene Antwort („Das hängt nicht zusammen.“/figurenbezogen), nichts passiert (KONZEPT:131; KAPITEL2:164).
- Falsche Wahl in Konfrontationen: Geist wiederholt/wendet sich ab, Neustart der Folge; kein Game Over, keine Sackgasse (LIESMICH:152; KONZEPT:133).
- Synchronrätsel ohne Mala am Ort: „nichts Schlimmes“, wiederholbar (LIESMICH:146–148).
- Hinweise nur auf Wunsch (Mala „Ich komme gerade nicht weiter.“ oder Menü), erledigen nichts (LIESMICH:133–139).

---

## 2. Kapitel

### 2.1 Kapitel 1 – Split (Di 15.–Sa 19. 11. 2011)
**Phasen:** Prolog Di Nachmittag (Wohnung → Bura → Varoš/Ivkas Wohnung) → Di Abend (Riva, Wohnung, Nacht) → Fall 1 Mi Abend (Wohnung-Kennenlernen → Riva → Hafenamt → … → Zwischenwelt) → Nach Ivka (Mi spät) → Zwischenspiel Do Morgen (allein → Bura → Bank) → Fall 2 Do → Zwischenspiel Sustipan → Fall 3 Fr Abend bis Morgengrauen → Epilog Sa Morgengrauen.

**Prolog (LOESUNG1:21–101)**
- Wohnungstür offen ← Anrufbeantworter (2 Nachrichten) + Kaffee (**Džezva**→Spüle→Herd) + Übersetzung S. 31 abgegeben. Abw.: Tür sagt jeweils warum (:40).
- Übersetzung „sorgfältig“ ← S. 30 gelesen; „schnell“ geht auch → Kunde antwortet Do je nach Abgabe (:32–35).
- Varoš auf dem Plan ← Anrufbeantworter; Varoš betretbar ← Sanjas Brief erledigt. Abw.: „Erst Sanja …“ bzw. Grund in der Welt (:28, :44).
- Sanjas Brief ← **Markos Tisch** benutzen (Ansprechen nur „Gleich, Marko.“); Antwort: nur „fest“ erfüllt Sanjas Ziel; Gesundheitsantwort alle gültig, wirkt Do nach (:46–56).
- **Schlüssel** von Zdenka ← zweimal fragen (erste Antwort verweigert) (:65).
- Postkarte (*Boot um sieben*) ← **Stricknadel** aus Nähkorb + Schuhkarton (Abw.: Öffnen ohne Nadel – Knoten hält) (:68–69; walkthrough.js:56).
- Ivkas Wohnung verlassen ← **Strickheft** gelesen (Abw.: „Bis jetzt erzählt hier alles vom Warten.“) (:71–73). **Foto ANKICA** nehmen.
- *Keine Familie heißt nicht: niemand* ← *Laut Stadt: keine Kontakte* + *Strickheft* (alternativ *Strickte für die halbe Gasse* + Heft); *Zdenkas Wort* + *Laut Stadt* allein reicht nicht (:79–81; walkthrough.js:69–70).
- Zdenkas Hinweis „wer nichts von ihr trägt“ ← Schluss oben, gezielt fragen; danach **Schlüssel zurück** (Dialog oder Ziehen, gleiche Bedingungen). Abw.: Marko verweigert Rückgabe vorher selbst (:82–84).
- → Abend; Erscheinung an der Kirchentreppe (gespeichert). Danach nur Riva erlaubt (:85–89).
- Riva: bis zum letzten Poller → Schwindelanfall, kein Geist (:89–92).
- Nachruf (2 Sätze, Wahl wirkt Do auf Zeitung/Vesna/Sanja/Zdenka) → Bett → Mädchen in der Scheibe (3 Antworten) (:96–101).

**Fall 1 – Ivka (LOESUNG1:103–148; KONZEPT:340–369; walkthrough.js:82–126)**
- Kennenlernen ← Wohnungstür (Mala erscheint); dann frei: Tür prüfen, Mala ansehen → **Wassergläser**→Spüle→Glas Mala geben → Fragen („Wer bist du?“ Pflicht) → Malas Frage: richtig „Riva, letzter Poller“; Bar/Ivkas Wohnung/Schreibtisch = Rückfrage (:110–127). Kein Wechsel; danach geht die Tür auf.
- Ivka sichtbar auf der Mole (3 Reaktionen gültig) → „Fragen Sie im Hafenbüro“.
- Mladen sucht ← genaues Datum (Postkarte/Notiz) → Band 1984 fehlt (KONZEPT:348).
- **Wechsel frei** ← „(Leise:) Dann sieh nach.“ (:139).
- *1948* ← [G] Archiv, Ordner **spüren** (Ansehen reicht nicht) (:141–143).
- Fahrtenbuch/*Fähre fiel aus* ← Mladen „Schauen Sie mal im Regal bei 1948“; Matejuška auf Plan.
- *Tonći kam mit der ANKICA* ← *Boot um sieben* + *Fähre fiel aus*.
- Dinko weicher ← **Foto** zeigen; *Tonćis letzte Worte* ← [G] Schuppen, Seesack spüren; Dinkos Geständnis + **Brief**, **Handschuhe** ← Notiz *letzte Worte* (KONZEPT:354–356).
- Brief offen ← Džezva (Spüle, Herd) + Brief in Dampf **oder** Sanja (Espressomaschine). Abw.: trocken reißt er; über offener Flamme nicht; Brief vor dem Öffnen an Mala → nichts (walkthrough.js:108–112).
- *Tonćis Brief* lesbar ← geöffneter Brief auf Mala ziehen (dieselbe Fähigkeit wie im Archiv) (BERICHT_PRUEFBERICHT:45–48). Sanja reagiert auf „geöffnet, unlesbar“ und „gelesen“.
- Optional: Sustipan-Tafel, Jakov; Zdenka (Abend); [G] Poller-Nachhall, Ivka „Wo ist deine Mutter?“.
- Finale an der Mole ← Fähre-Notiz, ANKICA-Schluss, gelesener Brief, Handschuhe; Gespräch beginnt mit Brief **oder** Handschuhen, wenn alles da ist. Abw.: Handschuhe zu früh → „Für mich? Ich trage keine.“ (LOESUNG1:148; BERICHT_PRUEFBERICHT:182). Reihenfolge: Fähre → ANKICA → Brief → Handschuhe; falsch → Ivka wiederholt/wendet sich ab (KONZEPT:360–366).
- Erkennen (Handschuhe fallen) → [G] Hinüberbringen → Zwischenwelt: **Handschuhe** geben → Tor.

**Nach Ivka / Zwischenspiel Do (LOESUNG1:150–199)**
- Heimweg automatisch, Mala verblasst. Do: Mala fort (1.2). Optional Glas, Mail Graz (Korrektur bei schneller Abgabe), Nachruf, Notizbuch (Umdeutung, nichts gelöscht). Kein Kaffee. Erreichbar: Wohnung, Riva, Bar.
- Mala zurück ← **Markos Tisch** in der Bura (3 Reaktionen).
- Sanja „Du machst am Montag zu?“ ← [G] Zettel hinter dem Tresen ansehen (*Montag geschlossen – Inventur*). Ohne Zettel keine Frage (walkthrough.js:140).
- Bank an der Riva: Gespräch (`i1.answer`, `i1.sarajevo`) → Zusage „Ich höre auf, so zu tun …“; „Gib mir noch einen Tag“ → Bank erneut benutzen (:192–197). → Titelkarte Fall 2.

**Fall 2 – Luka (KONZEPT:373–400; walkthrough.js:149–191)**
- *Ledana-Abriss*, „Junge von '99“ ← Bura (Sanja, Stipe/Frane), **Zeitung** nehmen.
- **Brecheisen** ← Dinko nach Werkzeug für die Ledana fragen.
- Ledana-Zugang ← [G] loses Zaunfeld finden + [M] Fischkisten wegschieben.
- Luka + Notizen (*Treffpunkt Kiosk 20:30*, *Nachtfähre*, *Briefkasten* …) ← [G] Empore (nur Mala kommt hinauf).
- Koffer (**Tickets**, **Kassette**) ← [G] Kühlraum: „Darunter liegt ein Koffer“ + [M] Brecheisen an Tür + Brecheisen am Schutt (im Dunkeln; ohne Malas Hinweis sinnloses Stochern).
- Ziegel: [G] sieht Papier; Abw.: Brecheisen → „halbe Wand“, braucht etwas Dünnes.
- Sanja erzählt (Laden „Okvir“) ← Tickets oder Luka-Notizen. Abw.: „Luka wartet noch“ → verärgert, später wiederkommen.
- **Spachtel** ← Nina (1. Besuch, 20 Kuna). Abw.: zu früh nach Luka fragen → hinauskomplimentiert.
- *Reservierung für zwei*, Nachhall ← [G] Hinterzimmer; *Nina hat am Kiosk gewartet* ← Reservierung + *Treffpunkt*.
- **Batterien**, Miras Aussage ← Mira. **Radio** ← Zdenka + Zeitung. Radio + Batterien, dann + Kassette.
- **Ninas Zettel** ← Ziegel + Spachtel. Luka bittet um das Lied ← Zettel vorlesen.
- Nina zur Rampe ← Konfrontation: „Ich war in der Ledana“ → Zettel → (Wahrheit/halbe Wahrheit, beide gültig) → Tickets → Radio/Kassette → „Wollen Sie es hören?“ → Weigerung → Notiz zu ihren Bildern (*Bilder*, *Nachhall am Kiosk*) **oder** ihrem Warten (*hat gewartet*, *Mira*); andere Notizen Abw., wiederholbar (KONZEPT:395; BERICHT_PRUEFBERICHT:84).
- Finale 21:00 Rampe: Radio an Nina → Erkennen → [G] Hinüber → Zwischenwelt: **Tickets** → Luka nimmt eins → Tor → Nina **ihr Ticket** geben.
- Zwischenspiel Sustipan (Gespräch) → Fall 3.

**Fall 3 – Bruno (KONZEPT:402–433; walkthrough.js:193–226)**
- Ljerka-Anruf → Hotel: **Dokumentenmappe** ← Gespräch; Lesetisch → Nachtbuch → Nacht.
- Register (Zimmer 31) lesen; [G] Logenstuhl spüren → Bruno erscheint; Bruchstücke als Notizen.
- **Schlüsselring** ← Haken 13; **Kurbel** ← Telefonbuch; **Tanzfoto** → Bruno (Wort „sam“).
- Salon ← Schlüsselring (vorher [G] optional: Kreide, Hocker „Papier. Angst.“). **Klavierschule** (Wort „sviraj“), **Platte**; Kurbel + Platte am Grammofon → Bruno im Salon.
- **Umschlag** + **Brunos Brief** ← Klavierhocker + Messingschlüssel.
- Satzbau-Rätsel ← **alle drei** Erinnerungen (Foto, Klavierschule, Umschlag; frei). Abw.: Umschlag allein „… ne … još ne …“; leere Felder „Da fehlt noch etwas“; falscher Teil → Kopfschütteln genau dort (BERICHT_PRUEFBERICHT:50–54).
- *Bruno hat die Zusage versteckt* ← Nachtbuch „wo sie nicht mehr spielt“ + Zusage.
- Finale Ljerkas Tür: Umschlag → Brief → Satz → (Antwort Übersetzer/„Er hat es mir gesagt“) → Ljerkas Verlust (3 Antworten) → zwei Kerzen → Erkennen → [G] Hinüber → Zwischenwelt: Glocke läuten (nach Frage nach der Ablösung) → Salon: Schlüsselring an Ljerka → **Honorar**.
- Epilog: Fahrkarte „Nur hin“ → Bus → Gespräch → Abspann.

### 2.2 Kapitel 2 – Sarajevo (Sa 19.–Do 24. 11. 2011)
**Phasen** (KAPITEL2:69–82): Prolog Sa Nachm./Nacht → Fall 1 So Tag/Nacht → Fall 2 Mo (Regen)/Nacht → Zwischenspiel Mo spät → Fall 3 Di/Nacht → Finale Mi/Nacht (Schnee) → Epilog Do Morgen. **Malas Spur** läuft ab dem 2. Tag parallel.

**Prolog (LOESUNG2:14–43)**
- **10 KM** + Burek ← Fikrets Brief richtig übersetzen (Kiosk nimmt keine Kuna; Wechselstube/Automat/Taxi Abw.). **Fahrschein** ← Kiosk + KM.
- Fahrt: Eins → Fahrschein entwerten (sonst Kontrolleur, geht weiter) → Baščaršija.
- Mala kommt mit + Splitter *Samstags. Wir.* ← **entwerteter Fahrschein** auf Mala.
- Kovači auf Plan ← Rade „Ich suche Kovači …“. Hajra/Ružas Džezva → Bett → Nacht: Soldat unter der Uhr fragen → Bett → Fall 1.

**Fall 1 – Tomaž (LOESUNG2:47–125; KAPITEL2:193–222, Graph :297–339)** – Ketten S1-A bis S1-D **frei beginnbar** (KAPITEL2:341).
- *Zwei Siebenen* ← [G] Tomažs Zettel + *Mondzeit* (Tafel am Turm oder Lejla).
- Ferhadija/Antiquariat auf Plan ← Lejla nach *Zwei Siebenen*.
- *Datum 14.11.1972*, *T. Zupan* ← Nedžad nach Gravurhilfe (Auswahl), Werkbank lesen. **Stemmeisen** ← Nedžad („etwas Schmales, Festes“).
- *Sonnenuntergang 16:16* ← Takvim **mit Datum** (ohne: „Welcher Tag?“, kein Sonnenuntergang – BERICHT_K2:102). *23:16* ← *Zwei Siebenen* + Takvim.
- *Er ging kurz nach elf* ← *Halid schloss um elf* (Šaćir, laut) + *Zapfenstreich*; *Elf Minuten* ← + *23:16*; *Beide haben gewartet* ← Šaćirs Soldat + [G] Emina belauscht.
- *Warum nie geschrieben* ← Emina + *Elf Minuten*; Šaćir „etwas dagelassen?“ → an Halid; [G] Spiegel-Nachhall (Kammer).
- Kammer offen ← Lejlas Bewerbungsbrief korrigiert + [G] Emina geht zu Tante Sabira (belauscht).
- **Briefe**, **Armband** ← Stemmeisen an Rahmenleiste. Briefe **ordnen** (6, Stempel/Anrede/Inhalt; Fehler werden erklärt). *Halid hat sie versteckt* ← Briefe + *Hinter dem Spiegel*.
- Emina kommt heute Nacht ← Briefe + Armband geben, dann **zuerst** *Elf Minuten* (oder *Beide haben gewartet*), **dann** *Halid hat sie versteckt*. Abw.: falsche Reihenfolge → abwenden, neu.
- Nacht: Tomaž halten ← *Kaserne gibt es nicht mehr* + *Zwei Siebenen* (frei). Lejla sitzt nachts auf der Stufe, falls nicht gefragt. Abw.: nur *Zwei Siebenen* → bleibt nicht (BERICHT_PRUEFBERICHT:116).
- Kula 23:12 → Emina → Erkennen → **Eminas Zettel** an Marko → [G] Hinüber → Zwischenwelt: Zeiger auf **sieben** → Tor → Zettel an Emina, Splitter *Uhr mit leuchtenden Ziffern* → Bett → Fall 2.

**Malas Spur (LOESUNG2:129–144)** – frei vor/zwischen/nach Fall 2; spätestens vor „Lana Delić?“ (Fall 3) fertig; **Haus 7 (Fall 3) braucht *Mala kennt das Siebener*** (KAPITEL2:341).
- Rade: alte Haltestelle, *Uhr auf dem Siebener*, *zwei Kinder* ← **Foto „Alipašino Polje 1987“** (Fotokiste Antiquariat, Fall 1; Splitter *Halt dich fest, Mali!* beim Zeigen an Mala).
- *Mala kennt das Siebener* (→ Alipašino Polje auf Plan) ← *Uhr mit leuchtenden Ziffern* + *Hochhaus mit der Uhr*.
- *Ich habe im Siebener gewohnt* ← Besuch Alipašino Polje. Alija-Aussage ← [G] Alija fragen.
- *Malas Fahrschein 12.11.93* ← Mala „Darf ich sehen …?“ (mit Alija-Aussage; vorher „Meins.“).
- *Mali* ← *zwei Kinder* + *im Siebener gewohnt*. *Keine Bahn 11/93* ← Rade. *Ein Versprechen* ← Fahrschein + Keine Bahn. Splitter *Neunter Stock* ← Mala reden.

**Fall 2 – Ivan Barać (LOESUNG2:148–191)**
- Leihzettel ← [G] Buch ansehen; Professor ← [G] Sessel. Jakob „woher“/Ankaufbuch ← erst nach Malas Stempel.
- *Gehört der Bibliothek* ← Leihzettel + Ankaufbuch; *Konnte nicht zurückgeben* ← Frist + Brand (26.8.1992).
- *Reliquie* ← Telefon Pension → Petar (Wien). *Asche* ← Milka. *Im Buch liegen die Seiten* ← Asche + Reliquie. Optional [G] Brückenmitte (Splitter).
- **Kurrent-Tafel** ← Jakob. **Buch** ← „gehört der Bibliothek“ + „beide Begründungen“ (s. W17).
- **Passierschein** ← Amra: Kurrent-Schriftvergleich (u/e/r/ſ). Erneut Amra → Abend.
- Vijećnica: Ilija (jede Antwort), Buch auf Ausleihtheke, **Kugelschreiber**/Theke → „Vraćeno, 21.11.2011“ → begreift → [G] Hinüber → Zwischenwelt: Lesetisch, Rilke-Zeile (3 Teile) → Zwischenspiel.
- **Zwischenspiel Bastei:** Bank; Vijećnica-Blick optional (sonst Erinnerung beim Karton); Ende „Ich lasse ihn mir schicken“ (Karton) → Bett → Fall 3.

**Fall 3 – Zora (LOESUNG2:204–255)**
- Sanja anrufen (Karton) – jede Wahl gültig.
- *Lana Delić?* ← Register aus Split + Hausbuch, **nur mit Splitter *Neunter Stock***.
- Zora-Aussage (Stempel, Klingel) ← [G] Stahltür. Optional *Dieselbe Drei* ← Kreide aus Split + Tafel.
- **Schlüssel** ← [G] Šehić belauscht (Hanka) + Šehić behutsam fragen. Klingel-Info ← Mirza.
- **Synchron:** [G] im Schutzraum + [M] Klingelknopf → [G] Zora holt Schlüssel unter dem Pult. Abw.: Mala nicht unten → nichts, wiederholbar.
- **Klassenbuch**, **Zeugnisse** ← Pultschlüssel, Schrank (dunkel, Malas Schein).
- **Schulstempel** ← Mirza nach Stempel; *Gerettet* ← Mirza nach „Moja krivica“; *Keine Schuld* ← Schuld + Gerettet. Schüler: Mirza (bitten), Selma (Kinderwagen), Damir (Klassenbuch zeigen). Stempel aufs Pult (Zeugnisse im Inventar).
- Nacht ← alle drei zugesagt **und** gestempelt. Klassenbuch aufs Pult → Namen → Mala „Prisutna“ → *Zoras Satz* → [G] Hinüber → Zwischenwelt: Schulbank/Glocke. Optional Bänke (Kellererinnerung; sonst beim eigenen Namen im Klassenbuch).

**Finale (LOESUNG2:259–294)**
- Paket-SMS ← Handy an Steckdose, Hinausgehen. **Karton** ← Fadila. Karton öffnen ← *Lana Delić?* **und** *Zoras Satz* (Abw.: „Noch nicht.“; BERICHT_K2:107).
- Dose ganz offen ← **alter Fahrschein** auf Mala. Fotohälften **zusammenlegen** (Markos Hälfte links; Lanas steht auf dem Kopf; Abw.: „Der Riss passt nicht“/„auf dem Kopf“).
- Nada öffnet ← Foto unter der Tür. **Postkarte**, *vermisst* ← Lanas Zimmer, Nada fragen.
- **Schlüssel Vratnik** ← Hajra. [G] Herd-Nachhall. **Rotkreuz-Nachricht** ← Stemmeisen am Wärmefach (zurückgegebenes Stemmeisen: Nedžad leiht erneut).
- *Sie kam mich holen* ← RKN + Postkarte; *Darum steht bei Abreise nichts* ← + Register → Mala bittet „Heute Nacht“.
- Letzte Drei ← Malas Fahrschein (Alipašino Polje) → Alija erkennt → **beide** Fahrscheine entwerten → Geständnis (keine falsche Antwort) → Bank Baščaršija (Name, Leine Südwest).
- Epilog: RKN an Nada → Fahrkarte Mostar „Hin und zurück“ → Bus.

### 2.3 Kapitel 3 – Mostar (Do 24.–Mo 28. 11. 2011)
**Phasen** (K3_SPEC:53–68): `k3_pro` Do → `k3_pro_n` Do-Abend → `k3_d1` Fr → `k3_d1_n` → `k3_d2` Sa → `k3_d2_n` Sa-Nacht (Skela) → `k3_d3` So → `k3_fin_n` Finalnacht → `k3_epi` Mo früh → `k3_epi_d` Mo Tag. Tageswechsel automatisch, wenn Bedingungen erfüllt; Bett sagt, was fehlt.

| Wechsel | Pflicht |
|---|---|
| Do → Do-Abend | *Nicht die Alte Brücke*, *Eine Richtung reicht nicht*, Eintrag bei Maja |
| Do-Abend → Fr | Gespräch 1 (Versprechen a/b/c) |
| Fr → Fr-Nacht | *Skela* + unterste Schublade offen („Morgen“) |
| Fr-Nacht → Sa | Vatergespräch |
| Sa → Sa-Nacht | Eierfrau (Ei fiel **oder** sie ging) + Vlado Teil 1 + Bus aus München; bei „Ich komme mit“ auch Jela |
| Sa-Nacht → So | Bato gefunden + Zlata „Sutra. Danju.“ + zurück bei Mala |
| So → Finale | *Überlebt*, *Bato war wach*, *Es war das Mädchen*, Bato-Konfrontation (beide Belege), Vlado frei, Fall B abgeschlossen |
| Finale → Epilog | Bato hinübergegangen |

**Prolog (LOESUNG3:16–44)**: Nada-SMS beantworten; Tafel; **Stadtplan** (Kiosk) → Herberge/Kujundžiluk/Alte Brücke. Eintrag (28.11. oder leer, beides gültig). *Malas Brücke stand im Wasser* ← Mala „Ist sie es?“; *Ein Bogen, kein Pfeiler* ← Dino (oder Widerlager oder Postkarte 1974, K3_SPEC:332); *Nicht die Alte Brücke* ← beide (Abw.: „Sie fiel 93“ allein reicht nicht, BERICHT_K3:60). *flussab*, *Eine Richtung reicht nicht* ← Leine/Uferstufen.

**Freitag – Peilung**
- Station 1 Brückenkopf (Kran 1/2) → Koski auf Plan → Station 2 Minarett ← Ticket (Kassierer). *Zu flach* ← Linie 1 + 2 → Straßenbrücke, Partisanenfriedhof auf Plan. Abw.: falsche Landmarken je Station.
- Westufer ← Mala über die Straßenbrücke führen (Augen zu; Stehenbleiben folgenlos).
- Station 3 Partisanenfriedhof (nach Glocken warten). *Hinter dem Kartenrand* ← *zu flach* + Linie 3.
- *Skela* ← *Kartenrand* + **alte Karte 1985** (Café Zdravko). Mate: Vlado-Hinweis; Versprechen Bus Samstag.
- Vulkanizer: Vlado leugnet. Kata: E-Mail übersetzen → „Welche?“. *Unterste Schublade* ← [G] durch das Holz (auch vor der E-Mail). Abw.: Raten lehnt Marko ab. *Dann fahr still* ← **nur** [G] TAM-Führerhaus spüren. Schublade offen ← „Die Schublade.“ nach Malas Blick. Abw.: Vlado zu früh mit Mutter bedrängt → Laden zu, nach Ortswechsel offen.
- Sanja-Anruf → Ljerka ruft zurück (Bild, Schlüssel 31, Abreise leer).

**Samstag**: *in die Stadt* (Aufwachen). *Ein Mensch, kein Ort* ← *Skela* + *in die Stadt* → Tepa via Maja. Optional *Eine Spur* → *Zwei Suchen*. Eierfrau: „Kannten Sie eine Mala?“ → Ei fällt; [G] Nachbarin belauschen. Vlado Teil 1 ← Zeichnung „Für später“ + Schlüssel-Frage → *Er ist gefahren*. Bus aus München (Mate erkennt Sohn nicht); „Ich komme mit“ → Haus Zelenika/Jela/Lena übersetzen. Nada-Anruf („(Mala fragen.)“ optional).
**Samstagnacht Skela**: [G] Schuppen → Bato (*Leine an der Glocke*); [G] Hütte, Glocke („Halo! Ima li koga?“), Seilanker („Das ist meins.“). [M] Glocke läuten → Nachbar. Brücke → linkes Ufer (Mala bleibt). Bato „Soldat“. Zlata „Sutra. Danju.“ Abw.: Glocke tags → „fährt seit 1998 nicht“; nachts vor Rekonstruktion → „Bei Nacht fährt keiner!“.

**Sonntag – Fall A Skela und Fall B Zelenika (frei zueinander)**
- *Es war das Mädchen* ← *Halo …* + *Bleistift* (Zlata „Was lag morgens an der Glocke?“). Grab ← Brett.
- *Licht in Batos Kammer* ← Lichtprobe (Handy ins **Dachfenster**; andere Fenster: „Zu breit.“/„Zu tief.“) + [G] Haus ansehen + [G] Glocke (Licht-Folge) + Ordnen am Küchentisch (7 bzw. 8 Karten; 8. nur nach Hühner-Frage; Abw.: erste falsche Stelle mit Begründung) + Vlado Teil 1.
- *Dreimal* ← Bato + *Licht*. *Bato war wach* ← *dreimal* + *Er hat geschlafen*. Bato-Konfrontation (*wach* + *Mädchen*, frei) = **Pflicht** (BERICHT_K3:319).
- **Decke** ← Zlata (Weg zur Brücke). *Sie hat den Fluss überlebt* ← [G]-Lesung der Decke + *von Zlata*. Zlata nach *überlebt* fragen.
- Vlado Teil 2 ← *Mädchen*, *Licht*, *überlebt* → *weggeschickt*, *Um zwei*. *Wer hat wen stehen lassen?* ← *weggeschickt* + *Er ist gefahren* → Gespräch 2 im Hof. Vlado frei ← Notiz *Dann fahr still*. Abw.: *Für später*, *weggeschickt*, *Um zwei*, *Seil* je eigene Antwort.
- Fall B: *Einladung, die sich nicht traut* ← Briefe + Kinderzimmer; *So wollte er heißen* ← Karten + Bleistift (oder Zdravko + Bleistift). Davor „Kommt doch“ → Hof. 1. Erkenntnis ← Lena „Došli smo, dida“ (Abw.: „Djede“/Deutsch eigene Antwort). 2. Erkenntnis ← Lena am Tor, Hand auf. Feigen einpacken → Schlüssel in Astgabel → **Schlüssel** an Lena → [G] Hinüber → Zwischenwelt: Haltestelle/Feigenkübel. Variante „Heute habe ich zu tun“: Jela spricht Marko Sonntag selbst an.
**Finale**: Abfahrt mit Vlado → Glocke → Bato erkennt (cp1) → [G] Anleger einsteigen → [M] Brücke (cp2) → Zlata → „Zlata. Bato war wach.“ → Leine frei (cp3) → Grab: „Was willst du?“ (Abw.: „Ich bringe dich nach Hause“ → „Schon wieder.“) → Zustimmung a/b/c, keine Ablehnung (cp4) → [G] Hinüber Bato → Zwischenwelt: Fährseil.
**Epilog**: Nada anrufen → Scheitel Alte Brücke → Nada → Skela: Brief 1996, Skizzenbuch an Nada → Vermisstenstelle: Formular (eigener Satz), Probe ja **oder** zweimal „Heute nicht“ (dann Anas Probe nötig) → Mutter anrufen → Bus.

### 2.4 Kapitel 4 – München (Sa 24. 12. 2011 – So 1. 1. 2012)
**Phasen** (K4_SPEC:79–116): `k4_pro` → `k4_pro_n` → `k4_d1` (Christtag) → `k4_d1_n` → (Mo übersprungen, Karte „Zweiter Feiertag“) → `k4_d2` (Di) → `k4_d2_n` → `k4_d3` (Mi, ohne Nacht) → `k4_d4` (Do) → `k4_d4_n` (Streit) → `k4_d5` (Fr, ohne Mala) → `k4_d5_n` (Hackerbrücke) → `k4_fin_a` → `k4_fin_n` → `k4_epi`. Bett (Couch) nur in den vier Nächten; Couch am Tag sagt was fehlt, nicht wo.

| Wechsel | Pflicht |
|---|---|
| pro → pro_n | Hansi erledigt, Jasna-Gespräch |
| pro_n → d1 | Abend bei Ana, Schlüsseldialog 1 |
| d1 → d1_n | *Peppino* (s4_peppino), *Gerda gefunden*, *Gelbe Stiefel* (Ana) – frei |
| d1_n → d2 | Džezva-Abend, Mala hat die Kiste gelesen |
| d2 → d2_n | *Ana 2004*, *Sepps Name*, *Um drei* |
| d2_n → d3 | *Ankunft 1992* (Jasna erkennt Sepp) |
| d3 → d4 | Sepp hinüber, Gerda entschieden; bei Probe „nein“ Probe im Konsulat |
| d4 → d4_n | Sepps Abschied, Kanne bei Alois |
| d4_n → d5 | Streit |
| d5 → d5_n | Ana (Abfahrt 92) + *Derselbe Satz, zwei Städte* |
| d5_n → fin_a | Brücke (Dialog 2) |

**Prolog/Heiligabend**: ZOB nicht verlassen ← Hansi: [G] Pfeiler findet ihn → [M] Gespräch → Wastl „Servus, Burschi“ → Feierabend (ohne Zwischenwelt). Hackerbrücke → Westend. **Schlüssel** ← Frau Huber (erste Frage). Wohnung: Pantoffeln, Foto, Ordner; Kiste ansehen. Herd/Kaffee → Jasna → Nadas Dose, Lana („(Mala fragen.)“ optional), Probe → „Nicht heute“. Abend bei Ana: Tisch (Essen); Tür vorher zu. Dialog 1 (alle Zeilen tragen).
**Christtag**: **Brotdose** → Heim auf Plan. Ana-Spaziergang (Wiesn) → *Gelbe Stiefel*. [G] allein zum Hbf → Gepäckträger finden → [M] Peppino, Kioskfrau (*Urmünchner*, Bahnhofsviertel, Bunker), Bahnhofsmission (*italienisch geflucht*, Friedhöfe auf Plan); *Er konnte beides*. Heim: Brotdose an Jasna, [G] Bank → Gerda. Abend: Džezva-Gespräch (*Ich kann lesen*). [G] nachts Kiste lesen („(Nicht lesen.)“ später erneut) → *Rotkreuz-Nachricht*, *Suchantrag*, *Passierschein* = **Malas Geheimnis**: für Marko bis zum Streit nicht nennbar/verbindbar (Abw.: „Das hat Mala in der Kiste gelesen, nicht ich.“); [G] darf *In Sarajevo hieß es tot* früher ziehen.
**Dienstag**: Kolar-Anruf (*Akten-Satz*, *Ana 2004* bei Probe ja). *In Sarajevo hieß es tot* ← [G] RKN + Akten-Satz. Ana (freiwillig bei „ja“, Pflicht-Info bei „nein“).
- *Sepps Name* (Josef Rugiero = Giuseppe Ruggiero) **auf drei Wegen** (LOESUNG4:201–204; K4_SPEC:370): *Peppino ist der Sepp (?)* (*Peppino* + **Ausweis** Obermaier) + *Unter Gleis 11* ([G] Bunker, Luke) | *Sepp (?)* + *Umschläge* (Koffer, Wimmer) | *Unter Gleis 11* + *Ausweis*.
- **Aushang** ← Kioskfrau. Peppino mit Namen → Bitte „Cara Carmela“ (Fehlweg: Brief schreiben → unsigniert, bleibt im Gepäck). Wimmer + *Sepps Name* → Koffer, Brief 1979; [G] Koffer → *Frau, die weint*; *Carmela wusste es seit 1979*.
- *Um drei* ← Heim-Flur, **Mala dabei**, Uhr „(Bis drei warten.)“ (Abw.: „Mala ist nicht hier.“/„(Noch nicht.)“).
- Abend: Jasna erkennt Aushang (*Ankunft 1992*), Suchantrag (2. Weg). Abw.: zu früh „Über Tata“ → „Ich muss morgen früh zum Dienst.“
**Mittwoch**: optional Davor anrufen → Moosach, Feigenzweig ([G] „schläft nur“), Jela-Anruf → Davors Silvester-Angebot (auch beim Abschied ohne Jela). Sepp geht ← Peppino: Carmela-Telefonat (Zeilenfolge) → [G] Hinüber → Zwischenwelt: Koffer tragen. Danach Wimmer, Enzo, **Obermaier-Absage** (Pflicht vor Abschied, auch Do möglich).
- **Die zwei Versuche um drei – beide Reihenfolgen** (LOESUNG4:126–135, :205): Versuch 1 (Gong aus ← Herr Kraus; Gerda bei ihm) → steht nicht auf, friert. Versuch 2 (Gong an, Gerda am Fenster ← [G] Fotos Zimmer 214 → Gerda „Am Fenster. Einmal.“) → steht auf, friert nicht. **Zwischen zwei Versuchen neuer Nachmittag** (hinaus und wieder herein). Abw.: „Wegen eines Geistes“ → Kraus „Heut nimmer“; „Ihre Frau ist gestorben“ → kein Versuch mehr an diesem Nachmittag; Gerda ohne Beleg wegschicken → Abw.
- *Gong und Hand* ← V1 + V2; *In seiner Sprache* ← + *Am Depot*. Frau Ertl erlaubt ← *In seiner Sprache*. Gerda entscheidet ← [G] Versuche erzählen + *Gong und Hand*. Probe „nein“: Konsulat (Finger).
**Donnerstag**: Abschied Bahnhofsmission (Jasna). Heim um drei → „Endstation … Feierabend“ → [G] Hinüber Gerda → Zwischenwelt: Stufe → **Kanne** stofflich → Kanne an Alois. Abend: Streit (Mala verrät sich) → Malas Notizen gehören Marko; Mala fort.
**Freitag**: Ana → *Bis zur Kurve*. *In München hieß es vermisst* ← *Ich kann lesen* + *Suchantrag*; *Sie hat zurückgesehen* ← *Passierschein* + *Kurve*; *Derselbe Satz, zwei Städte* ← *vermisst* + *tot*. **Nacht Hackerbrücke**: Dialog 2 → Notiz *Ich war dabei* (gibt das Spiel).
**Silvester**: Blei gießen → Jasna fort (23:15) → [G] Spur an Anas Tür → Reise Heim (Nachttram/zu Fuß/Davor) → Kevin → Zimmer 214 (cp1) → 8 Züge: *Ich war dabei* → Erzählen → *Zwei Städte* → Warten (cp2) → *Zurückgesehen* (fehlt der Schluss: Mala gibt ihn, wenn beide Hälften da) → „Sie haben ihn gefunden“ → „Weil er weiß …“ → Mitternacht (cp3). Fehlzüge: Zug 1 *gefunden* → Mama geht kurz, „Noch einmal. Von vorn.“; Zug 1 *vermisst*, Zug 3 *tot* allein → Malas Korrektur; Zug 5 ohne Kurve trägt, Epilog-Satz anders.
**Epilog**: Gespräch mit Mama (Nachruf 11 Zeichen); Zustimmung c → Pflichtfrage „Willst du das?“ (3 gültige Antworten); falscher Brief: wegwerfen oder schicken.

---

## 3. Widersprüche und offene Designfragen

| # | Thema | Fundstellen | Befund / Frage |
|---|---|---|---|
| W1 | Kapitelzahl, README veraltet | README.md:1, :7–9, :13–31, :43–57; web/LIESMICH.txt:1, :33–42 | README nennt drei Kapitel, kein K4 (keine LOESUNG4/K4_SPEC/BERICHT_K4, keine K4-Tests). LIESMICH nennt vier. |
| W2 | Finale der Reihe | LOESUNG4.md:188; game/K4_SPEC.md:115; KAPITEL4_KONZEPT.md:295, :1968 | K4 endet „Fortsetzung: Sarajevo“, Reihe ist auf 5 Kapitel geplant; K5 fehlt (kein Fehler). Offen: was nach dem K4-Abspann angeboten wird (kein „Weiter mit Kapitel 5“ dokumentiert). „Finale“ heißt in K2/K3/K4 jeweils ein Kapitelabschnitt. |
| W3 | Sprachen | README.md:7; web/LIESMICH.txt:46–48; BERICHT_K4.md:48 | README: „K2 und 3 vorerst nur Deutsch“; LIESMICH: „K2 bis 4“. |
| W4 | Hinweise in K1 | BERICHT_K2.md:24, :98; KONZEPT.md:144 vs README.md:41; web/LIESMICH.txt:133; BERICHT_K3.md:81, :130 | K2-Bericht/Konzept: K1 ohne Hinweise (auch als Test „K1 hat keine Hinweise“). Neuere Dokumente: K1 hat 76 Themen × 4 Stufen. Erwartung für Test unklar. |
| W5 | Hinweisstufen/-zahl K2 | LOESUNG2.md:3; KAPITEL2.md:5, :168; BERICHT_K2.md:16, :40, :110 vs README.md:41; web/LIESMICH.txt:136; BERICHT_K3.md:130 | LOESUNG2/KAPITEL2/BERICHT_K2: drei Stufen, 50 Themen. README/LIESMICH: vier Stufen; BERICHT_K3: K2 51 × 4. |
| W6 | Spielzeit | web/LIESMICH.txt:20, :29–30 vs BERICHT_K3.md:242–244; BERICHT_K4.md:25 | K3 laut LIESMICH 4–5 h, laut Bericht hochgerechnet 6–8 h (zielstrebig 4½–6). K4 laut LIESMICH 4–5 h, Spieltakt 150,7 min ≈ K3 (151 min) → nach derselben Rechnung eher 6–8 h; keine K4-Schätzung im Bericht. Keine Zahl ist mit Menschen gemessen. |
| W7 | Wann Marko Geister sieht | KONZEPT.md:77; web/LIESMICH.txt:173–174; game/K3_SPEC.md:22 vs BERICHT_K4.md:21; LOESUNG4.md:11 | K3_SPEC: „dasselbe Prinzip wie in K1 und K2“ (erst nach Fund). BERICHT_K4: die Engine hat das in K1–K3 nie umgesetzt, erst jetzt in allen vier („Leere Stelle“). LIESMICH sagt nur „Marko sieht auch die anderen Geister“. Erwartung für K1–K3 neu festlegen. |
| W8 | K1-Einstieg, KONZEPT veraltet | KONZEPT.md:68, :151, :161, :210, :253 vs LOESUNG1.md:21–28, :100–101, :139; README.md:66 | KONZEPT: Mala bis zum Hafenbüro nur Stimme/Flimmern, im Fenster drei Sätze, Hafenamt „Wenn du da bist, dann sieh nach.“. LOESUNG1: Soloauftakt mit Bura, Mala sichtbar in der Wohnung vor dem Hafenamt, im Fenster nur sein Name, „(Leise:) Dann sieh nach.“. |
| W9 | Bank an der Riva | KONZEPT.md:223, :257 vs LOESUNG1.md:150–198; web/LIESMICH.txt:7 | KONZEPT: Bank nachts direkt nach Ivka. LOESUNG1: Heimweg, Donnerstagmorgen allein, Bura, Bank am Morgen. „Zwei Zwischenspiele“ (LIESMICH) passt nur, wenn die Morgen-Passage und die Bank als ein Zwischenspiel zählen. |
| W10 | Notizbuch-Seite | KONZEPT.md:126 vs BERICHT_PRUEFBERICHT.md:24 | sechs vs. fünf Einträge je Seite. |
| W11 | Brunos Erkenntnis | KONZEPT.md:105 vs KONZEPT.md:430; BERICHT_PRUEFBERICHT.md:85, :181 | KONZEPT 2.3a: graues Haar der Tochter. Fall 3 und Prüfbericht: ausdrücklich *nicht* am Gesicht, sondern Danica fehlt beim Sonntagstanz bzw. zwei Kerzen. Zwei Fassungen im Prüfbericht selbst (:85 Tanz/Kerze, :181 zwei Kerzen auf dem Flügel). |
| W12 | Ninas Ticket | KONZEPT.md:229, :389 vs KONZEPT.md:388; BERICHT_PRUEFBERICHT.md:36–39 | Story/Notizname „gerahmtes Fährticket, nie entwertet“ vs. „gerahmte Reservierung für zwei“; Tickets hatte nur Luka. |
| W13 | Orte in K1 | KONZEPT.md:451; README.md:26 vs KAPITEL2.md:15; BERICHT_K3.md:133 | 19 vs. 18 Schauplätze. |
| W14 | Kula-Zeiten | KAPITEL2.md:198, :221 vs BERICHT_PRUEFBERICHT.md:28–34, :116, :183; LOESUNG2.md:120 | KAPITEL2: heute schlägt die Kula 23:16, Tomaž bleibt auch mit falschen Argumenten bis Viertel nach, Zifferblatt „drei“/„Viertel nach drei“. Gültig laut Prüfbericht: 23:12, sieben Minuten, nur mit Lejlas Auskunft bleibt er, „zwanzig vor drei“. |
| W15 | K2-Rätselformen veraltet | KAPITEL2.md:218, :282, :288 vs LOESUNG2.md:99–106, :269–271, :290–292; BERICHT_PRUEFBERICHT.md:62–64, :76–80, :178 | Briefe: Übersetzung (4 Wendungen) vs. Ordnen. Fotohälften: alle Erinnerungen inkl. Busnacht vs. nur Samstage + Fahrscheine, Busnacht erst in der letzten Drei. Malas Fahrschein: in der Bahn vs. vorher in Alipašino Polje erbitten. |
| W16 | Ivans Erkenntnis | KAPITEL2.md:251 vs LOESUNG2.md:184–185 | Entwurf: Erkenntnis beim vorgelesenen Blatt, Vermerk löst die Leine. Lösung: „Stempeln Sie“ → Kugelschreiber-Vermerk → „begreift“. Auslöser unklar. |
| W17 | Jakob gibt das Buch | LOESUNG2.md:157–159, :172 vs KAPITEL2.md:251 | LOESUNG2 „mit beiden Begründungen“ (gemeint: *gehört der Bibliothek* + *konnte nicht zurückgeben*?), KAPITEL2: `s2_provenance` + `s2_relic`. Welche Notizen genau? |
| W18 | Schutzraum-Alternative | KAPITEL2.md:265, :341 | Zweiter Weg (Mirza, Notausstieg, Brecheisen) steht im Entwurf, fehlt in LOESUNG2 und BERICHT_K2. Umgesetzt? |
| W19 | Kontrolleur K2 | KAPITEL2.md:182 vs LOESUNG2.md:30 | einmalige Strafe vs. freundliche Erinnerung. |
| W20 | Malas Spur „erst im dritten Akt“ | LOESUNG2.md:131 vs KAPITEL2.md:341 | Fall 3 (Haus 7) braucht *Mala kennt das Siebener*. „Erst im dritten Akt“ geht also nur, wenn die Spur zu Beginn des Dienstags nachgeholt wird. LOESUNG2 nennt nur „Neunter Stock“ als späteste Bedingung. |
| W21 | Testzahlen | BERICHT_K2.md:89 vs BERICHT_PRUEFBERICHT.md:105, BERICHT_K3.md:206; BERICHT_K3.md:43, :161; BERICHT_K4.md:29 vs game/K4_SPEC.md:97–115 | k2tests 32/32 → 33/33 (spätere Erweiterung). K3: „19 Zusatztests“ = „180 Prüfungen“. BERICHT_K4: „alle zehn Tageswechsel“, K4_SPEC hat 13 Wechsel plus Ende. |
| W22 | Spieltakt | BERICHT_PRUEFBERICHT.md:101, :103 vs BERICHT_K3.md:242–243 | K1 86,2 vs. „rund 85“ min. K2 99,5 vs. „rund 98“ vs. „96“ min. |
| W23 | K3-Zeitangaben | web/LIESMICH.txt:15–17 vs KAPITEL2.md:82; game/K3_SPEC.md:53 | „am Donnerstag danach“ (laut Phasen derselbe Donnerstag, 24.11.). „Drei Tage und zwei Nächte“, die Phasen haben aber Do-, Fr- und Sa-Nacht plus Finalnacht und Montag. |
| W24 | K4 Mala nachts | LOESUNG4.md:10; BERICHT_K4.md:17; game/K4_SPEC.md:158 | „Türen in Mamas Haus“ vs. „nur in Mamas Wohnung“ vs. `jwohnung`/`jschlaf`/`jhaus`. Darf sie nachts ins Treppenhaus/zu Frau Huber? |
| W25 | K4-Vorgaben ohne Stand | game/K4_SPEC.md:217 vs BERICHT_K4.md:40; LOESUNG4.md:194 | Vorgabe `asks=3` (wirkt wie „oft gefragt“), aber das Lob für Nachfragen gibt es nur mit Stand. Welche Färbung gilt ohne Stand? |
| W26 | Speichern mitten in der Szene | web/LIESMICH.txt:162–164 vs BERICHT_PRUEFBERICHT.md:21 | LIESMICH: Stand vom Szenenbeginn. Prüfbericht: Beginn **oder** letztes `A.save()` in der Szene (z. B. K3/K4-Zwischenstände). Erwartung je Szene unklar. |
| W27 | Hinweise vs. „Keine Lenkung“ | KONZEPT.md:143–147; BERICHT_PRUEFBERICHT.md:13–14 | Grundsatz „keine Tipps“ vs. freiwillige vierstufige Hilfe mit konkreten Schritten. Gilt als gelöst durch „nur auf Wunsch“, aber KONZEPT ist nicht angepasst. |
| W28 | Mala „gibt nichts her“ | KONZEPT.md:78 vs KAPITEL2.md:288; BERICHT_PRUEFBERICHT.md:180 | Die Blechdose gibt sie nicht her; in K2 gibt sie Fahrschein und Fotohälfte her (gewollte Entwicklung, aber als Regel in LIESMICH nicht erwähnt). |

**Nicht gelesen / nur teilweise:** game/K3_SPEC.md §11–12 und game/K4_SPEC.md §2, §8, §13–15 (Zuständigkeiten, Schalter K4, Musik, Technik) nur überflogen bzw. ausgelassen; BERICHT_K3.md §3, §5.1, §9 überflogen; KONZEPT.md §1, §5–6, §9 nicht gelesen; KAPITEL2.md §4–5, §9–12 nur teilweise. Nicht in der Quellenliste und nur per Suche gestreift: KAPITEL3_KONZEPT.md, KAPITEL4_KONZEPT.md (nur für W2). BERICHT_EINSTIEG.md (von LOESUNG1:17 referenziert) nicht gelesen. Alle angegebenen Quelldateien waren lesbar.
