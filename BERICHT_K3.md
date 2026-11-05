# MALA – Kapitel 3: Mostar · Entwicklungs- und Testbericht

Stand: 5. November 2026 · Branch `claude/split-adventure-game-concept-inxuzp`

Dieser Bericht trennt streng zwischen dem, was **tatsächlich ausgeführt und gemessen** wurde (Abschnitt 5), und dem, was **nur geschätzt oder theoretisch begründet** ist (Abschnitt 6). Was nicht geprüft werden konnte, steht in Abschnitt 7.

---

## 1. Ergebnis in Kürze

- Kapitel 3 ist **vollständig spielbar**: von der Ankunft am Ostbusbahnhof (Donnerstag) bis zur Abfahrt nach Sarajevo und zum Abspann („Ende des dritten Kapitels · Fortsetzung: München“). Es gibt kein Game Over und nach allen ausgeführten Prüfungen keine Sackgasse.
- **Zwei Geisterfälle und Malas eigene Geschichte:**
  - **Fall A, Bato, der Fährmann von Skela:** Seine Leine hängt an der Glocke. Die Nacht zum 15. Januar 1994 wird rekonstruiert: Lichtprobe, die Nacht ordnen, „Bato war wach“. Im Finale erkennt er seinen Tod: „Steig ein. Diesmal fahre ich.“ Mala bringt ihn hinüber.
  - **Fall B, Mate Zelenika:** Er wartet im Café am Westbusbahnhof und am Tor seines Hauses auf seinen Sohn aus München. Er hat zwei Erkenntnisse: Zuerst erkennt er den Sohn („Došli smo, dida.“), dann den eigenen Tod (der Schlüssel am Tor). Danach legt er den Schlüssel stofflich in die Astgabel und geht durch die Zwischenwelt.
  - **Malas Geschichte:**
    - Es ist nicht die Alte Brücke.
    - Die Peilung führt nach Skela.
    - Vlados zwei Fassungen und die Botschaft „Dann fahr still.“
    - Sie hat den Fluss überlebt und ist am Samstag gestorben.
    - Am Ende ist sie frei und bleibt, weil sie es will und Marko zustimmt, in drei Fassungen.
- **22 neue Schauplätze**, alle gemalt, dazu der Stadtplan von Mostar, die Peilungskarte mit Zdravkos Karte von 1985 und zwei neue Requisiten der Zwischenwelt (Mates Haltestelle mit dem Feigenkübel, Batos Fährseil). **22 neue Figuren** mit Rig und Animationen, **13 neue Porträts**, **17 Erinnerungsbilder**, **13 Musikstücke**, **22 Klangkulissen**.
- **Neue Mechaniken:**
  - „(Mala fragen.)“: Einvernehmen als Spielmechanik. Mala merkt es, wenn Marko sie übergeht.
  - Malas Peilung: drei Standorte, gezeichnete Fächer, geschnittene Fläche.
  - Die Straßenbrücke: Mala geht mit geschlossenen Augen, der Spieler führt sie.
  - Die Lichtprobe zwischen zwei Ufern.
  - Die Nacht ordnen.
  - Botschaften aus dem Notizbuch.
  - Ein Finale mit drei Zentren und **vier Zwischenständen**.
- **Kapitelwahl:**
  - „Kapitel 3: Mostar“ steht im Hauptmenü.
  - Nach dem Abspann von Sarajevo heißt es „Weiter mit Kapitel 3: Mostar“.
  - Antworten aus Sarajevo werden übernommen: Markos Geständnis, warum Mostar, Hajra, Ana, das Vatergespräch. Ohne sie gelten Vorgaben.
  - Alte Spielstände laufen unverändert weiter.
- **Umfang** (dasselbe Zählskript für alle drei Kapitel, Abschnitt 4):
  - Dialog- und Erzählzeilen: 3048 (Kapitel 2: 2098, **+45 %**).
  - Wörter: 48 383 (Kapitel 2: 37 834, +28 %).
  - Malas Zeilen: 758 (Kapitel 2: 446, +70 %).
  - Hinzu kommen **86 Hinweisthemen mit je vier Stufen**, nur auf Wunsch.
- **Automatisch geprüft** (Abschnitt 5):
  - ein vollständiger Durchlauf von Kapitel 3 nur mit Spielerhandlungen (113 Schritte, keine JS-Fehler);
  - 15 Zusatztests mit 157 Prüfungen: Nebenwege, falsche Versuche, alle Zwischenstände, Neuladen, Laden in jeder Phase;
  - die Hinweisprüfung an 472 Ständen;
  - die Gegenprobe für Kapitel 1 und 2 (beide Durchläufe, 33 + 51 + 39 Einzeltests);
  - der Gerätetest (27/27), der einen echten Bildzeitfehler fand (behoben);
  - der Offline-Test (8/8).
- **Nicht geprüft:** ein echtes iPad, Safari/WebKit, der Klang mit dem Ohr und die Spielzeit mit Menschen (Abschnitt 7).

## 2. Grundlage und bewusste Abweichungen

**Grundlage** ist `KAPITEL3_KONZEPT.md` in Fassung 2, nach der Prüfung. Der Vertrag für alle, die Skripte geschrieben haben, ist `game/K3_SPEC.md`: Dateien, Schalter, Notizen, Übergänge, Zwischenstände. Raumvorgaben stehen in `game/ROOM_SPECS3.md`, Figuren in `game/CAST3.md`.

**Die Prüfvorgaben und wo sie umgesetzt sind:**

| Vorgabe | Umsetzung | geprüft in |
|---|---|---|
| Mala ist am Ende frei und bleibt aus eigenem Willen, mit Markos Zustimmung in drei Fassungen | Die Leine löst sich (Zwischenstand 3). Am Grab fragt Marko „Was willst du?“. Mala entscheidet und fragt zurück: „Willst du das?“ Die Antworten „Ja.“, „Ja. Und wenn es zu schwer wird, sagen wir es.“ und „Frag mich in München noch mal.“ ergeben einen neuen Faden, der nicht zieht (`rooms/skela_l.js`, `graveAsk`). Eine Ablehnung wird nicht angeboten, weil die Frage Malas Wunsch ist, keine Erlaubnis. | Test 10 (alle drei Fassungen), Durchlauf |
| Der Brückenbeweis ruht auf Pfeilern gegen einen einzigen Bogen | *Malas Brücke stand im Wasser* + *Ein Bogen, kein Pfeiler* → *Nicht die Alte Brücke*. Allein mit „Sie fiel dreiundneunzig“ geht es nicht (`13_k3_notes.js`). | Durchlauf |
| Peilung: drei Stationen mit flachem Schnitt, dann Westhang, dann die Karte von 1985 mit Skela | Brückenkopf und Minarett ergeben *zu flach geschnitten*. Der Partisanenfriedhof am Westhang ergibt *hinter dem Kartenrand*. Zdravkos Karte ergibt *Skela heißt Fähre* (`97_k3_peil.js`, konvexe Schnittfläche). | Durchlauf, Test 6 |
| „Dann fahr still“ kommt nur aus dem Echo im Führerhaus | Nur Mala im TAM-Führerhaus (`v3_cab`). Jede andere Notiz als Botschaft bekommt Vlados eigene Ablehnung. | Test 8 |
| Kata fragt „Welche?“; kein Raten | Ohne Malas Blick durch das Holz gibt es kein „Die unterste.“. Raten lehnt Marko ab. | Test 4 (beide Reihenfolgen) |
| Mate hat zwei Erkenntnisse; „dida“ stammt aus seinen Bleistiftnotizen, „djede“ wird nicht verspottet | Die Postkarten zeigen „Dragi dida.“ in Mates Schrift (`b3_pencil`). Erste Erkenntnis: der Sohn. Zweite: der Schlüssel am Tor. Auf „djede“ antwortet Mate freundlich: „So sagt man in der Schule. Ein höfliches Mädchen.“ | Test 9, Durchlauf |
| Davors Verkauf bleibt offen | „Montag. Vielleicht.“ – „Ich kann hier nicht leben. Aber ich kann kommen.“ – „Dann im August.“ | Durchlauf |
| Lanas Todeszeit wird nicht genannt, nur „Samstag“ | Notiz *Der Ofen*: „Am Samstag ist sie am Herd gestorben …“, keine Uhrzeit | Durchsicht der Texte |
| Finale mit drei Zentren und Zwischenständen | Glocke und Fähre (Zwischenstand 1), Zlatas Erzählung (2 und 3), Grab und Zustimmung (4) | Test 11 (jeder Zwischenstand nach Neustart der Seite bis zum Epilog) |
| Taxi nach Skela immer, Dino nur als Möglichkeit | Die Reise nach Skela geht immer mit dem Taxi vom Ostbusbahnhof. Dinos Roller ist eine Wahl, wenn er ihn angeboten hat. | Test 5 |
| Keine Volkszugehörigkeiten, keine religiösen oder nationalen Zeichen | Texte nach Begriffen durchsucht. Die Bilder zeigen Hum, Glockenturm und Minarett ausdrücklich ohne Kreuz und ohne Halbmond, die Skizze in Malas Heft eine Tür „31“ statt Kreuzen. | Durchsicht von Text und Bild |

**Bewusste Abweichungen und Entscheidungen**

1. **Davor abgesagt:** Das Konzept sieht Jelas Szene nur am Samstag vor. Sagt Marko Davor ab („Heute habe ich zu tun.“) und geht am Samstag nicht hin, fehlte am Sonntag Jelas Satz über das Tor, und Lena bezog sich auf etwas, das Marko nie gehört hat. Jetzt spricht Jela Marko am Sonntag selbst an: „Ti si taj prevodilac.“ Sie erzählt vom Tor, vom Schlüssel und von den Feigen. Lena fragt dann am Tor „Ans Tor? Wieso?“ statt „Wie Jela gesagt hat?“ (Test 15).
2. **Gegenstände:**
   - Das Minarett-Ticket heißt `ulaznica`. Der ursprüngliche Name `ticket_m` gab es schon in Kapitel 2, und die doppelte Anmeldung hätte das Spiel für alle Kapitel nicht starten lassen.
   - Schlüssel 31 und Zeichnung bleiben bei Vlado und werden kein Gegenstand.
3. **„Zwei Sprachen“** (freiwillig, aus dem Konzept, S4): Maja lässt sich ein Amtsschreiben „übersetzen“, das bis auf drei Wörter gleich ist. Die Szene nennt Sprachen, keine Volkszugehörigkeiten, und verteilt keine Schuld.
4. **Ton, alle Kapitel:** Hüllkurven beginnen jetzt bei Lautstärke 0 (`04_audio.js`). Vorher konnte jeder Einsatz leise knacken. Die Änderung wirkt auf alle drei Kapitel.
5. **Kapitel 2, Fehler behoben:** Zwei Gesprächsoptionen bei Nada („Wo ist Ihr Mann?“, „Haben Sie nie das Zimmer aufgemacht?“) hatten denselben internen Schlüssel wie zwei Fragen an den Kupferschmied. Wer zuerst den Kupferschmied fragte, sah sie nie (`rooms/stan.js`). Ein Prüfskript über alle Dateien fand außerdem zwei solche Kollisionen in Kapitel 3, beide behoben, und keine weitere.
6. **Sprache:** Kapitel 3 gibt es nur auf Deutsch, wie Kapitel 2. In der bosnisch-kroatischen Einstellung läuft es auf Deutsch.
7. **Hinweise:** wie in Kapitel 1 und 2 nur auf Wunsch, in vier Stufen. Das Spiel zeigt sie nie von selbst an.

## 3. Was gebaut wurde

| Bereich | Inhalt | Wo |
|---|---|---|
| Konzept, Vertrag | Handlung, Figuren, Orte, Rätselketten, Finale, Audio; Dateien, Schalter, Notizen, Übergänge | `KAPITEL3_KONZEPT.md`, `game/K3_SPEC.md`, `game/ROOM_SPECS3.md`, `game/CAST3.md` |
| Komplettlösung | jeder Schritt, alle Varianten | `LOESUNG3.md` |
| Gerüst | 10 Phasen (Donnerstagabend bis Epilog bei Tag), Tagesenden mit Pflichtschritten, Reiseregeln (Westufer erst nach der Überquerung, Taxi nach Skela, Rückwege), Malas Leine je Tag, Reaktionen auf Schlüsse, „Mala fragen“, Zwischenstände, Abspann | `96_k3_story.js` |
| Übernahme aus Sarajevo | Markos Geständnis, warum Mostar, Hajra, Ana, das Vatergespräch; ohne Ende von Kapitel 2 gelten Vorgaben | `96_k3_story.js` (`storeC2End`, `k3CarryRead`) |
| Schauplätze | Ostbusbahnhof, Herberge, Zimmer, Kujundžiluk, Alte Brücke, Koski, Minarett, Tepa, Straßenbrücke, Bulevar, Partisanenfriedhof, Westbusbahnhof, Café „Zdravko“, Vulkanizer, Hof mit dem TAM, Haus Zelenika (Hof und Stube), Vermisstenstelle, Skela (rechtes Ufer, Brücke, linkes Ufer), Zlatas Küche; Stadtplan, Peilungskarte | `rooms/*.js`, `rooms/art/*.js` |
| Figuren und Porträts | 22 Figuren mit Leerlauf-, Gesprächs- und Sonderanimationen (Jela packt Feigen ein, Mate legt den Schlüssel ab, Lena hält die Hand auf …), 13 Porträts | `14_k3_cast.js`, `14_k3_cast_b.js`, `portraits/*.js` |
| Notizbuch | 96 Notizen, 23 Schlüsse in Ketten (A+B=C, C+D=E), falsche Verbindungen mit eigenen Antworten | `13_k3_notes.js` |
| Rätsel-Overlays | Peilung (drei Stationen und die alte Karte), Katas E-Mail, die Nacht ordnen | `97_k3_peil.js`, `rooms/vulkanizer.js` |
| Mala | Gespräche 1 und 2, „Mala fragen“, Bemerkungen, die Straßenbrücke, das Grab | `97_k3_mala.js`, Raumdateien |
| Zwischenwelt | Mates Haltestelle („Bitte einsteigen.“), Batos Seil („Oprosti, mala.“) | `97_k3_limbo_mate.js`, `97_k3_limbo_bato.js`, `rooms/art/limbo.js` |
| Erinnerungsbilder | 17 gemalte Bilder (im Bus, Malas Brücke, das Führerhaus, die Hütte, die Glocke, das Seil, die Decke, der Ofen, die Nachtfahrt, Malas Skizzen …) | `97_k3_mem.js` |
| Musik und Klang | 13 Stücke (Bus, Mostar, Ermittlung, Nacht, die Australier, Skela, Mate, Geist, Zwischenwelt, Finale, Grab, Epilog, Abspann), 22 Klangkulissen, 21 neue Geräusche (Fährglocke, Seil, Fähre, Roller, Taxi, der TAM springt an, Kompressor, Ei, Feuerzeug, Gitarre, Hühner, Laterne, Herdfeuer, Jute, Schlüssel …) | `16_k3_audio.js` |
| Hinweise | 86 Themen × 4 Stufen: einordnen, Denkrichtung, konkreter Ansatz, nächster Schritt | `15_hints_k3.js`, Übersicht in `HINWEISE.md` |
| Werkzeuge | Durchlauf, Zusatztests mit gemeinsamen Spielerhandlungen, Hinweisprüfung für Kapitel 3, Bildzeit der Mostar-Räume im Gerätetest | `game/tools/walkthrough3.js`, `k3tests.js`, `k3play.js`, `hintcheck.js`, `devicetest.js` |

## 4. Umfang, gemessen

Alle drei Kapitel wurden mit **demselben, neu geschriebenen Skript** gezählt. Es zählt in den Inhaltsdateien jedes Kapitels, ohne Engine, Kunst und Hinweise:
- Sprechaufrufe (`say`, `A.m`, `A.g`, `narrate`, `voice`, `phoneVoice`);
- Beschreibungen (`look`);
- Gesprächs- und Auswahloptionen;
- Hotspots;
- Dokumente, Rätsel-Overlays und Erinnerungsszenen.

Gezählt wird also, was im Spiel steht; ein einzelner Spieler sieht davon je nach Weg nur einen Teil. Die Zahlen für Kapitel 1 und 2 weichen von `BERICHT_K2.md` ab. Dort wurde mit einem anderen Skript gezählt, und beide Kapitel sind seitdem gewachsen (Einstieg, Prüfbericht).

| Größe | Kapitel 1 (Split) | Kapitel 2 (Sarajevo) | Kapitel 3 (Mostar) | K3 zu K2 |
|---|---:|---:|---:|---:|
| Dialog- und Erzählzeilen | 1731 | 2098 | **3048** | **+45 %** |
| davon Figuren | 686 | 916 | 1076 | +17 % |
| davon Marko | 666 | 630 | 917 | +46 % |
| davon Mala | 338 | 446 | 758 | +70 % |
| davon Erzähler, Telefon, Stimme | 41 | 106 | 297 | |
| Beschreibungen („Schau an“) | 454 | 567 | 455 | −20 % |
| Gesprächs- und Auswahloptionen | 266 | 312 | **333** | +7 % |
| Hotspots | 252 | 287 | 236 | −18 % |
| Notizen | 112 | 101 | 96 | |
| Schlüsse im Notizbuch | 13 | 24 | 23 | |
| Rätsel-Overlays (Aufrufstellen im Quelltext) | 1 | 5 | 5 (6 Einsätze: drei Peilstationen, alte Karte, Katas E-Mail, die Nacht ordnen) | |
| Erinnerungs- und Nachhallszenen (Aufrufe) | 8 | 23 | 18 | |
| gemalte Erinnerungsbilder | 7 | 22 | 17 | |
| Erkenntnisszenen | 3 | 4 | 2 (Mate zweistufig) | |
| Dokumente | 24 | 17 | 13 | |
| Hinweise | 76 × 4 | 51 × 4 | **86 × 4** | |
| Wörter in Texten (ohne Hinweise) | 27 371 | 37 834 | **48 383** | +28 % |
| Wörter in Hinweisen | 3 679 | 2 588 | 3 356 | |
| Schauplätze | 18 | 18 | **22** | |
| Musikstücke | 11 | 12 | 13 | |
| Klangkulissen | 22 | 18 | 22 | |

Kapitel 3 hat weniger Hotspots und Beschreibungen als Kapitel 2, aber deutlich mehr Gespräch und Erzählung. Seine Rätsel liegen öfter im Gespräch, in den Notizen und in der Arbeit zu zweit (Mala sieht, Marko fragt) als im Absuchen von Räumen.

## 5. Tatsächlich ausgeführte Prüfungen

Alle Prüfungen liefen automatisch in Chromium (Playwright), headless, in diesem Container, auf dem **letzten Bau** mit allen Änderungen dieses Berichts.

### 5.1 Vollständige Durchläufe

Die Durchläufe spielen über die echte Oberfläche:
- Verben auf Hotspots und Gesprächsoptionen nach ihrem sichtbaren Text;
- Notizen verbinden und zu Mala wechseln;
- die Peilung über ihre Trefferflächen, die Rätsel-Overlays über ihre Prüfung;
- Reisen über den Stadtplan.

Der Durchlauf von Kapitel 3 setzt keinen Schalter und keine Notiz. Nach jedem Schritt prüft er die erwartete Notiz, den Gegenstand, den Schalter, die Phase oder den Raum. Der Spieltakt ist die Spieluhr in Normaltempo, obwohl der Test 25-fach beschleunigt läuft. Er enthält die kurzen Wartezeiten des Testtreibers.

| Prüfung | Ergebnis |
|---|---|
| Kapitel 3, Musterlösung (`walkthrough3.js`) | **bestanden** (auf dem letzten Bau): 113 Prüfschritte von `M.E.newGame(3)` bis zum Abspann, keine JS-Fehler, 362 s Laufzeit, Spieltakt 150,8 min. Mate erkennt erst seinen Sohn, dann seinen Tod; Bato erkennt seinen Tod; beide gehen durch die Zwischenwelt. Mala ist frei (Zustimmung b). Das Ende von Kapitel 3 ist gespeichert (`mala.c3end`). |
| Kapitel 3, derselbe Durchlauf auf dem Bau vor der Optimierung der Geistersicht | bestanden: 113 Schritte, keine JS-Fehler, Spieltakt 152,0 min |
| Kapitel 2 (`walkthrough2.js`) | **bestanden:** 67 Schritte bis zum Abspann, keine JS-Fehler, Spieltakt 98,5 min |
| Kapitel 1 (`walkthrough.js`) | **bestanden:** bis zum Abspann, keine JS-Fehler, Spieltakt 85,2 min |

### 5.2 Zusatztests (`k3tests.js`): 157 von 157 bestanden

Die Tests laden Stände aus dem Durchlauf, spielen von dort mit Spielerhandlungen weiter und prüfen gezielt. Schalter setzen sie nur dort, wo ein unterbrochener Spielstand oder das Ende von Kapitel 2 nachgebaut wird.
- Die Tests 1–14 liefen in einem Lauf (148 Prüfungen).
- Test 15 ist neu. Im ersten Lauf brach er an einem Fehler im Testaufbau ab: Der geladene Stand liegt in der Werkstatt, Marko muss erst hinaus. Nach der Korrektur lief er allein mit 9 Prüfungen durch. Am Spiel änderte sich dazwischen nichts.

| Test | Prüfungen |
|---|---:|
| 1. Einstieg: Titelmenü, Speicherplätze, „Weiter mit Kapitel 3: Mostar“ nach dem Abspann von Sarajevo, Übernahme und Vorgaben, Neuladen beim Tageswechsel | 11 |
| 2. Westufer vor der Überquerung: Mala weigert sich; „(Allein gehen.)“ und „(Bei ihr bleiben.)“ führen zu keiner Reise | 7 |
| 3. Vlado vergrault: Laden zu, nach einem Ortswechsel am selben Tag wieder offen | 6 |
| 4. Kata und die Schublade: „Welche?“, kein Raten, beide Reihenfolgen; jede falsche Zeile der E-Mail hat eine eigene Antwort | 10 |
| 5. Skela mit dem Taxi und mit Dinos Roller, Rückweg ohne Dino | 6 |
| 6. Falsche Versuche: alle drei Peilstationen, Lichtprobe (Küche, Stube), Ordnen mit zwei verschiedenen falschen Reihenfolgen | 13 |
| 7. Glocke und Bato: bei Tag, bei Nacht vor der Rekonstruktion, „Sie sind tot“ | 7 |
| 8. Botschaft an Vlado: vier falsche Botschaften mit je eigener Antwort, dann die richtige | 6 |
| 9. Lenas Satz: „djede“, Deutsch, dann „dida“ | 3 |
| 10. Am Grab: erst das Versprechen, dann die Frage; Zustimmung a, b und c; keine Ablehnung im Angebot | 8 |
| 11. Finale: Laden an jedem der vier Zwischenstände nach Neustart der Seite, jeweils weiter bis zum Epilog; Neuladen mitten in der Szene | 18 |
| 12. Tagesende: Das Bett verweigert sich mit einem Satz, solange Pflichtschritte fehlen, danach kommt der Wechsel; an allen Tagen und Nächten, mit und ohne Zusage an Davor | 18 |
| 13. Die Probe für den Vater zweimal verweigert: Der Anruf bei der Mutter geht trotzdem, das Kapitel endet | 4 |
| 14. Laden in allen 10 Phasen (neue Seite) und 9 unterbrochene Wechsel, die nach dem Laden nachgeholt werden | 31 |
| 15. Davor abgesagt, am Samstag nie bei Jela: Am Sonntag spricht Jela Marko an; Fall B geht ohne Rückgriff auf den Samstag bis zu Davors Karte | 9 |

### 5.3 Hinweise (`hintcheck.js`): bestanden

- **472 Stände geprüft:** 113 aus dem Durchlauf, 359 aus den Nebenwegen der Zusatztests.
- **Abdeckung:** An jedem Stand ist mindestens ein Thema offen, außer am Abspann.
- **Inhalt der Themen:**
  - Kein Stufentext ist leer, weder für Mala noch für Marko.
  - Kein offenes Thema nennt einen Ort, den Marko noch nicht kennt.
  - Keines gehört zu einem anderen Kapitel.
  - Keines nennt einen verbrauchten Gegenstand.
- **Themen gesamt:** 81 der 86 Themen waren in den Läufen mindestens einmal offen. Die übrigen fünf stehen in Abschnitt 8.
- **Kapitel 1 und 2:** Die Erweiterung des Prüfskripts für Mostar ändert dort nichts; die Ausgabe ist vorher und nachher gleich.

### 5.4 Gegenprobe Kapitel 1 und 2

| Prüfung | Ergebnis |
|---|---|
| `k2tests.js` (Kapitelwahl, Übernahme, Spielstände, falsche Wege, Hinweise) | 33 von 33 bestanden |
| `navtests.js` (Stadtplan, Übergänge, Doppelklick auf Ausgänge, Touch) | 51 von 51 bestanden |
| `einstiegtests.js` (Einstieg in Split, alte Spielstände, Malas Abwesenheit) | 39 von 39 bestanden |

Diese drei liefen auf dem Bau vor der Optimierung der Geistersicht. Die Optimierung betrifft nur zwei Mostar-Räume; deren Ausgabe ist Pixel für Pixel gleich geblieben (5.6).

### 5.5 Gerätetest (`devicetest.js`): 27 von 27 bestanden; Offline-Test (`offlinetest.js`): 8 von 8

- **Gerätetest:** iPad-Ansicht in Chromium, quer und hochkant, mit Touch, dazu Offline-Betrieb, Update einer offline gespeicherten Fassung und Bildzeit.
  - Die Bildzeit wird jetzt auch für alle 22 Mostar-Räume und den Stadtplan von Mostar gemessen, je mit und ohne Geistersicht, bei vierfach gedrosselter CPU.
  - **Der erste Lauf fand einen echten Fehler:** An der Alten Brücke brauchte die Geistersicht im Schnitt 16,7 ms pro Bild, im 95-%-Wert 19,9 ms. Das liegt über den 16,7 ms für 60 Bilder pro Sekunde.
  - Ursache: Die Pfützen der Geistersicht berechneten in jedem Bild für jedes Pflasterpixel Rauschen mit vier Oktaven, obwohl sich ihre Form nie ändert. Am Ostbusbahnhof gab es dasselbe Muster.
  - Behoben: Beide Masken werden jetzt einmal je Raumbild vorberechnet.
  - **Zweiter Lauf:** Die Alte Brücke liegt in der Geistersicht bei Ø 2,9 ms (95 %: 4,4 ms). Alle Bilder bleiben unter 16,7 ms; der schlechteste 95-%-Wert ist 15,0 ms am Ostbusbahnhof (Geistersicht).
  - Eine Nachmessung über 400 Bilder zeigt, dass dieser Wert aus den ersten Bildern nach dem Wechsel zu Mala stammt. Ab dem 60. Bild liegen Ostbusbahnhof, Alte Brücke und Zimmer bei Ø 3,3–4,8 ms und 95 % unter 6,5 ms.
  - Raumwechsel samt erstem Bild in Mostar: 151–765 ms gedrosselt. Am längsten dauern die Alte Brücke, Skela links und Skela rechts.
- **Offline-Test:**
  - Der neue Service Worker ist aktiv. Ohne Netz lädt das Spiel neu, und der Spielstand ist noch da.
  - Hinweise und Stadtplan sind offline vorhanden.
  - Neu geprüft für Kapitel 3: die 86 Hinweisthemen, der Stadtplan von Mostar, die Räume und die Musik. Außerdem startet ein neues Spiel in Mostar ohne Netz am Ostbusbahnhof.

### 5.6 Weitere Prüfungen

- **Pixelvergleich der optimierten Geistersicht:** 48 Bilder: Alte Brücke und Ostbusbahnhof, Tag und Nacht, drei Kamerapositionen, vier Zeitpunkte. Alt gegen neu: 0 Abweichungen. Die Zeit je Aufruf sank von 3,1 auf 0,05 ms (Alte Brücke) und von 1,6 auf 0,06 ms (Ostbusbahnhof), ungedrosselt.
- **Doppelte Gesprächsschlüssel:** Ein Prüfskript über alle Quelldateien sucht je Kapitel Schlüssel für einmalige Gesprächszeilen, Ersttreffer und Wechselsätze, die in zwei Dateien vorkommen. Gefunden hat es die Kollision in Kapitel 2 (Abschnitt 2, Punkt 5). Nach den Korrekturen gibt es keine mehr.
- **Volkszugehörigkeit, Religion, Nation:** Die Texte und die Kommentare der Bildskripte von Kapitel 3 wurden nach den einschlägigen Begriffen durchsucht.
  - Treffer gibt es nur für „Rotes Kreuz“ (Suchdienst), für „Kreuzung“ und „ankreuzen“ sowie für die Sprachszene aus dem Konzept.
  - In den Bildern sind Kreuz und Halbmond ausdrücklich weggelassen.
- **Gegenproben der Skript-Agenten:** Die Prüfskripte der drei Skriptteile (Ostufer, Westufer mit Haus Zelenika, Skela) liefen auf dem Bau des Integrationsschritts fehlerfrei.
- **Syntaxprüfung je Quelldatei** bei jedem Bau.

## 6. Geschätzt oder nur theoretisch begründet (nicht gemessen)

- **Spielzeit:** nicht mit Menschen gemessen.
  - **Gemessen** ist nur der Spieltakt der Musterlösung: **rund 151 Minuten** für Kapitel 3 (150,8 und 152,0 in zwei Läufen), ohne Umwege, Suchen, Nachdenken und freiwillige Gespräche. Er enthält die Pflichtdialoge in Normaltempo und die kurzen Wartezeiten des Testtreibers. Zum Vergleich: Kapitel 2 98,5 Minuten, Kapitel 1 85,2 Minuten.
  - **Hochgerechnet:** `BERICHT_K2.md` schätzte für Sarajevo bei 96 Minuten Spieltakt 4–5 Stunden. Mit demselben Verhältnis ergäben sich für Mostar etwa **6–8 Stunden** für Spieler, die erkunden. Zielstrebige Spieler brauchen eher 4½–6 Stunden.
  - Kapitel 3 ist mehr Gespräch als Suche (Abschnitt 4). Ob das für Menschen schneller oder langsamer spielt, ist nicht gemessen.
- **Schwierigkeit und Fairness:**
  - Jeder Schluss hat eine Begründung im Spiel. Wo Marko etwas wissen muss, gibt es kein Raten: Katas Schublade, die Botschaft an Vlado, Lenas Satz.
  - Falsche Versuche bekommen eine eigene Antwort und setzen nur zurück. Jeder Hotspot nennt beim Zeigen seinen Namen.
  - Die Peilung ist das schwerste Rätsel. Gibt Mala zwei falsche Landmarken an, lehnt sie das mit einem Satz ab, der zur Station passt.
  - Ob die Rätsel für Menschen angenehm schwer sind, hat niemand ausprobiert.
- **Musik:** Die Stücke sind nach Plan komponiert: Sevdalinka-Wendungen, Gitarre in a-Moll, Glocke, Tempo je Szene. Gehört hat sie niemand.

## 7. Nicht ausgeführt, mit Grund

| Was | Warum nicht | Was stattdessen lief |
|---|---|---|
| Test auf einem echten iPad | kein Gerät in der Arbeitsumgebung | iPad-Ansicht in Chromium (Touch, quer und hochkant), offline, gedrosselte Bildzeit für alle Mostar-Räume |
| Safari / WebKit | nur Chromium ist installiert | Code für iOS wie in Kapitel 1 und 2 |
| Klang anhören | Container ohne Audioausgabe | Ton-Code läuft ohne Fehler; Stücke, Kulissen und Geräusche sind registriert und werden aufgerufen; der Knackfehler wurde im Code gefunden und behoben |
| Spieltest mit Menschen | nicht möglich | Durchlauf, 15 Zusatztests, Hinweisprüfung an allen Ständen |
| Alle denkbaren Reihenfolgen | zu viele Kombinationen | Hauptweg plus Nebenwege der Tests: Mala zuerst an der Schublade, Davor abgesagt, Taxi oder Roller, Laden in jeder Phase, jeder Zwischenstand, unterbrochene Wechsel |
| Bosnisch-kroatische Fassung von Kapitel 3 | nicht beauftragt; Kapitel 3 bleibt Deutsch wie Kapitel 2 | – |

## 8. Bekannte Grenzen und Kompromisse

- **Fünf Hinweisthemen waren in keinem Lauf offen:** `d2e`, `d3b`, `f3c`, `e3a`, `e3c`. Sie gehören zu Nebenwegen, die kein Test geht, oder zu kurzen automatischen Übergängen, in denen sich ein Thema nur für einen Moment öffnet. Die Hinweisprüfung zeigt, dass an keinem geprüften Stand ein Thema fehlt (Abschnitt 5.3).
- **Mostar ist verdichtet:** Stadtplan und Peilungskarte sind gezeichnete Pläne, keine maßstäblichen Karten. Kräne, Hochhaus und Mühle sind Landmarken für das Rätsel. Skela ist ein Ort flussab, wie ihn das Konzept beschreibt.
- **Davors Entscheidung bleibt offen**, wie gefordert. Das Kapitel sagt nicht, ob das Haus verkauft wird.
- **Testriegel in Momentaufnahmen:** Die Stände des Durchlaufs sind Momentaufnahmen. Mitten in einer Szene enthalten sie den Szenen-Riegel `mala.lock`, den die Tests beim Laden entfernen. Echte Spielstände enthalten ihn nicht; an den Zwischenständen löst ihn `k3FinResume`.
- **Erster Wechsel in die Geistersicht:** Beim ersten Wechsel zu Mala in einem Raum wird das Raumbild für die Geistersicht aufgebaut. Mit vierfach gedrosselter CPU dauert das in allen drei Kapiteln eine Viertel- bis knapp eine Sekunde:
  - Kapitel 1: Riva 0,47 s;
  - Kapitel 2: Baščaršija 0,45 s, Uferstraße 0,93 s;
  - Kapitel 3: Alte Brücke 0,62 s, Skela 0,58 s, Zimmer 0,25 s.

  Danach läuft der Raum flüssig. Das ist kein neues Verhalten von Kapitel 3, kann auf einem langsamen Gerät aber als kurzes Stocken auffallen.
- **Kapitel 3 ohne Sarajevo:** Startet man Mostar direkt im Hauptmenü, gelten Vorgaben: „Ich bin gekommen“, „wegen der Brücke“. Welche Vorgaben gelten, sagt das Spiel nicht.

## 9. Auslieferung

| Was | Datei |
|---|---|
| Spiel, Kapitel 1–3, für Netlify (Ordner hochladen oder ZIP entpacken) | `web/` und `MALA_netlify.zip` (nicht im Repository) |
| Konzept und Vorgaben | `KAPITEL3_KONZEPT.md`, `game/K3_SPEC.md`, `game/ROOM_SPECS3.md`, `game/CAST3.md` |
| Dialoge, Rätsel, Animationen, Audio (umgesetzt) | `game/src/` (siehe Abschnitt 3) |
| Komplettlösung Kapitel 3 | `LOESUNG3.md` |
| Alle Hinweistexte | `HINWEISE.md` |
| Dieser Bericht | `BERICHT_K3.md` |

Prüfen und bauen:

```
node game/build.js                                        # baut web/ (mit Syntaxprüfung je Datei)
MALA_DUMPALL=/tmp/d3 node game/tools/walkthrough3.js      # Kapitel 3 komplett, legt Zwischenstände ab
K3T_DUMPS=/tmp/d3t node game/tools/k3tests.js /tmp/d3     # Zusatztests (legt die Stände der Nebenwege ab)
node game/tools/hintcheck.js /tmp/d3 /tmp/d3t             # Hinweise gegen alle Stände
node game/tools/walkthrough.js                            # Kapitel 1 komplett
MALA_DUMPALL=/tmp/d node game/tools/walkthrough2.js       # Kapitel 2 komplett
node game/tools/k2tests.js /tmp/d                         # Einzeltests Kapitel 2
node game/tools/devicetest.js                             # iPad-Ansicht, Touch, offline, Bildzeit (auch Mostar)
node game/tools/offlinetest.js                            # Offline-Betrieb
```
