# MALA – Kapitel 2: Sarajevo · Entwicklungs- und Testbericht

Stand: 3. November 2026 · Branch `claude/split-adventure-game-concept-inxuzp`

Dieser Bericht trennt streng zwischen dem, was **tatsächlich ausgeführt und gemessen** wurde (Abschnitt 5), und dem, was **nur geschätzt oder theoretisch begründet** ist (Abschnitt 6). Was nicht geprüft werden konnte, steht in Abschnitt 7.

---

## 1. Ergebnis in Kürze

- Kapitel 2 ist von der Ankunft am Busbahnhof bis zur Abfahrt nach Mostar **vollständig spielbar**. Es gibt kein Game Over und nach allen ausgeführten Prüfungen keine Sackgasse.
- **Drei Geisterfälle:** Tomaž unter der Uhr (Fall 1), Professor Ivan Barać und das Bibliotheksbuch (Fall 2), die Lehrerin Zora im Schutzraum (Fall 3). Dazu kommt **Malas eigene Geschichte** in drei Teilen mit dem Kioskgeist Alija, einem Zwischenspiel, dem Finale und dem Epilog. Jeder Geist hat eine eigene Erkenntnisszene und einen eigenen Übergang in der Zwischenwelt.
- **18 neue Schauplätze**, alle gemalt, dazu der Stadtplan von Sarajevo. **26 neue Figuren** mit Rig und Animationen, **22 neue Porträts**.
- **Kapitelwahl** im Titelmenü. Kapitel 2 ist nach dem Ende von Split freigeschaltet und lässt sich nach einer Rückfrage auch direkt beginnen. Nach dem Abspann von Split heißt es „Weiter mit Kapitel 2“. Antworten und Erinnerungen aus Split werden übernommen. Alte Spielstände laufen unverändert weiter, das Spiel funktioniert weiterhin offline.
- **Umfang gegenüber Split** (gleiche Zählweise für beide Kapitel): Dialog- und Erzählzeilen **+52,6 %**, Gesprächsoptionen **+50,2 %**, Schlussfolgerungen im Notizbuch **9 → 24**, Rätsel-Overlays **1 → 7**, Erinnerungsszenen **8 → 23**. Hinzu kommen **50 Hinweisthemen mit je drei Stufen**, nur auf Wunsch.
- **Automatisch geprüft** (Abschnitt 5): zwei vollständige Durchläufe von Kapitel 2 in zwei Reihenfolgen, ein vollständiger Durchlauf von Kapitel 1, 31 Einzeltests, 19 Gerätetests (iPad-Ansicht mit Touch, offline, Bildzeit) und Bilder aller Räume.
- **Nicht geprüft:** ein echtes iPad, Safari/WebKit, der Klang mit dem Ohr und die Spielzeit mit Menschen (Abschnitt 7).

## 2. Grundlage und bewusste Abweichungen

1. **Hochgeladene ZIP-Datei:** Der Auftrag nennt eine hochgeladene ZIP-Datei. In dieser Sitzung kam keine Datei an. Grundlage war deshalb der Stand von Kapitel 1 im Repository (Commit `5850502`).
2. **Dauer der Erkenntnis:** Die Vorgabe nennt „ungefähr 2–3 Sekunden“. Vorher war ausdrücklich gewünscht: „mach 5 Sekunden daraus“. Ich habe die **5 Sekunden** beibehalten, für beide Kapitel gleich. Ändern lässt sich das an einer Stelle: `REAL_MS` in `game/src/05_engine.js`, Zeile 125.
3. **Hinweise:** In Kapitel 1 gibt es weiterhin keine Hinweise, wie früher gewünscht („keine Lenkung“). In Kapitel 2 gibt es sie nur auf Wunsch über **Menü → Hinweis …**. Das Spiel zeigt sie nie von selbst an.
4. **Mindestwerte:** Die Mengenziele habe ich als Planungsziele behandelt, nicht als Aufforderung zum Strecken. Alles über den Lösungsweg hinaus ist freiwillig: Gespräche mit eigenen Themen, Malas Bemerkungen, Reaktionen auf Gegenstände. Niemand muss es lesen, um weiterzukommen.
5. **Ausgangswert der Zählung:** `KAPITEL2.md` nennt für Split 1271 Zeilen. Diese Zahl stammt aus einer früheren, gröberen Zählung. Für diesen Bericht wurden **beide Kapitel mit demselben Skript** gezählt. Damit hat Split 1323 Zeilen, und das Ziel für +50 % liegt bei 1985.

## 3. Was gebaut wurde

| Bereich | Inhalt | Wo |
|---|---|---|
| Handlung, Figuren, Orte, Rätselgraph | Entwurf mit Phasen, allen Ketten, Abhängigkeitsgraph, Notizen, Gegenständen und Audio | `KAPITEL2.md` |
| Komplettlösung | jeder Schritt, beide Reihenfolgen, Optionales | `LOESUNG2.md` |
| Kapitelsystem | Kapitelwahl, Freischaltung, „Weiter mit Kapitel 2“, Abspann je Kapitel, Spielstände ohne Umbau | `game/src/06_ui.js`, `90_story.js`, `96_k2_story.js` |
| Übernahme aus Split | zwei Antworten (warum Split, warum nicht Sarajevo) und sechs Erinnerungen werden zu `m2_split_*`; fehlt ein Split-Ende, gelten Vorgaben | `96_k2_story.js` (`storeC1End`, `k2Carry`, `applyCarry`) |
| Schauplätze | Busbahnhof, Straßenbahn, Baščaršija, Sahat-kula, Kafana, Kammer, Kupferschmiede, Pension, Ferhadija, Antiquariat, Uferstraße, Vijećnica, Hof in Alipašino, Hausflur, Schutzraum, Wohnung, Vratnik, Großmutters Küche, Stadtplan | `game/src/rooms/*.js` (Logik), `rooms/art/*.js` (Kunst) |
| Figuren und Porträts | 26 Figuren mit Leerlauf- und Gesprächsanimationen, 22 Porträts, lesbare Geister | `14_k2_cast.js`, `portraits/*.js` |
| Rätsel | Notizen und Schlüsse in Ketten (A+B=C, C+D=E), 7 Rätsel-Overlays (Übersetzen, Zuordnen, Gravieren, Kurrent, Foto zusammensetzen), Kooperation Marko und Mala | `13_k2_notes.js`, Raumdateien |
| Falsche Kombinationen | eigene Antworten je Figur und je Art des Fehlers, auch bei Wiederholung | `13_k2_notes.js` (`M.noCombo`) |
| Hinweise | 50 Themen × 3 Stufen: erinnern, Ort oder Person nennen, konkreter Denkanstoß | `15_k2_hints.js` |
| Zwischenwelt | drei neue Übergänge (Uhr, Ausleihzettel, Glocke) | `97_k2_limbo.js` |
| Mala | Gespräche, Bemerkungen zu jedem Ort, Reaktionen auf Gegenstände, Erinnerungsfolge im Finale | `97_k2_mala.js`, `97_k2_talk.js` |
| Erinnerungsbilder | 22 gemalte Bilder für die Nachhall- und Erinnerungsszenen | `97_k2_mem_a.js`, `97_k2_mem_b.js` |
| Musik und Klang | 12 eigene Stücke (u. a. Sarajevo, Kafana, Ermittlung, Geist, Erkenntnis, Erinnerung, Mala, Nacht, Zwischenwelt, Finale, Bus, Abspann), 18 Klangkulissen, rund 30 neue Geräusche (Straßenbahn, Kupferhämmern, Kula, Glocken, Gebetsruf aus der Ferne, Domino …) | `16_k2_audio.js` |
| Werkzeuge | Durchlauf Kapitel 2 (zwei Reihenfolgen), Einzeltests, Gerätetest, Syntaxprüfung beim Bauen | `game/tools/walkthrough2.js`, `k2tests.js`, `devicetest.js`, `game/build.js` |

## 4. Umfang, gemessen

Gezählt mit demselben Skript für beide Kapitel. Es zählt im Quelltext Sprechaufrufe (`say`, `A.m`, `A.g`, `narrate`, `voice`, `phoneVoice`), Beschreibungstexte, Optionen und Hotspots. Gezählt wird also, was im Spiel steht. Ein einzelner Spieler sieht davon je nach Weg nur einen Teil.

| Größe | Kapitel 1 (Split) | Kapitel 2 (Sarajevo) | Veränderung |
|---|---:|---:|---:|
| Dialog- und Erzählzeilen | 1323 | **2019** | **+52,6 %** |
| davon Figuren | 571 | 875 | +53 % |
| davon Marko | 470 | 610 | +30 % |
| davon Mala | 249 | 434 | +74 % |
| davon Erzähler, Telefon, Stimme | 33 | 100 | |
| Beschreibungen („Schau an“) | 444 | 564 | +27 % |
| Gesprächsoptionen | 205 | **308** | **+50,2 %** |
| Hotspots | 240 | 280 | +17 % |
| Schlussfolgerungen im Notizbuch | 9 | **24** | ×2,7 |
| mehrstufige Rätselketten (laut Entwurf) | 12 | 24 | ×2 |
| Rätsel-Overlays | 1 | 7 | |
| Erinnerungs- und Nachhallszenen (Aufrufe) | 8 | 23 | |
| gemalte Erinnerungsbilder | 7 | {{MEMK2}} | |
| Dokumente (Briefe, Postkarten, Register …) | 16 | 17 | |
| Hinweise | 0 | 50 × 3 Stufen | |
| Wörter in Texten | 29 239 | 40 068 | +37 % |
| Schauplätze | 18 | 18 | |
| Musikstücke | 11 | 12 | |
| Klangkulissen | 21 | 18 | |

Die Wortzahl von Kapitel 2 enthält auch die Hinweistexte. Die Zeilenzahl enthält sie nicht.

## 5. Tatsächlich ausgeführte Prüfungen

Alle Prüfungen liefen automatisch in Chromium (Playwright), headless, in diesem Container. Die Ergebnisse unten stammen vom **letzten Bau** (`web/index.html`, mit allen Räumen und Erinnerungsbildern).

{{TESTS}}

## 6. Geschätzt oder nur theoretisch begründet (nicht gemessen)

- **Spielzeit 4–5 Stunden:** nicht mit Menschen gemessen. Gemessen ist nur der Spieltakt der Musterlösung (siehe 5.1): {{GT2}} Minuten für Kapitel 2 gegenüber {{GT1}} Minuten für Kapitel 1, jeweils ohne Umwege, Suchen, Nachdenken und freiwillige Gespräche. Das Verhältnis passt zum größeren Umfang. Ob ein Mensch beim ersten Spielen auf 4–5 Stunden kommt, ist eine Schätzung: Kapitel 2 hat rund 40 000 Wörter Text, und die freiwilligen Gespräche, die Rätsel und das Erkunden kommen zum Pflichtweg hinzu.
- **Schwierigkeit und Fairness der Rätsel:** Die Rätsel folgen festen Regeln: jeder Schluss hat eine Begründung im Spiel, falsche Versuche setzen nur zurück, kein Pixelsuchen, weil jeder Hotspot beim Zeigen oder Tippen seinen Namen nennt. Ob die Rätsel für Menschen angenehm schwer sind, hat niemand ausprobiert.
- **iPad:** Die Bildzeit wurde in Chromium mit vierfach gedrosselter CPU gemessen. Das soll ein älteres Tablet nachahmen, ist aber kein echtes iPad. Eine echte Messung auf Safari fehlt.
- **Wirkung der Musik:** Die Stücke sind nach Plan komponiert: Tonarten, Instrumente wie Saz, Klarinette, Akkordeon und Glockenspiel, Tempo je Szene. Gehört hat sie niemand.

## 7. Nicht ausgeführt, mit Grund

| Was | Warum nicht | Was stattdessen lief |
|---|---|---|
| Test auf einem echten iPad | kein Gerät in der Arbeitsumgebung | iPad-Ansicht (iPad gen 7, quer, Touch) in Chromium, Touch-Bedienung, offline, gedrosselte Bildzeit |
| Safari / WebKit | nur Chromium ist installiert | Code für iOS bleibt wie in Kapitel 1: Ton startet beim ersten Tippen, kein Zoomen, Vollbild per Homescreen |
| Klang anhören | Container ohne Audioausgabe | Ton-Code läuft ohne Fehler; Stücke, Kulissen und Geräusche sind registriert und werden in den Szenen aufgerufen |
| Spieltest mit Menschen | nicht möglich | zwei vollständige automatische Durchläufe, Hinweisabdeckung an allen 67 Zwischenständen |
| Alle denkbaren Reihenfolgen | zu viele Kombinationen | zwei vollständige Reihenfolgen, falsche Reihenfolge bei Emina, falsche Figur, falsche Argumente bei Tomaž, Klingel ohne Mala, Malas Spur erst im dritten Akt |
| Alte Spielstände echter Spieler | keine echten Spielstände verfügbar | mitgelieferter Spielstand „Ivka“, alter Stand aus Kapitel 1, Laden und Neuladen mitten in Kapitel 2 |

## 8. Bekannte Grenzen und Kompromisse

- **Raumwechsel:** Der erste Aufbau eines Raums dauert bei vierfach gedrosselter CPU 0,14–0,86 s (am längsten Uferstraße, Vratnik und der Hof in Alipašino). Das fällt in die Überblendung, kann auf einem langsamen Gerät aber als kurzes Stocken auffallen.
- **Lateinerbrücke:** Sie ist erkennbar, aber nicht in der berühmten Seitenansicht mit drei freien Bögen gemalt, weil Fluss und Straße hintereinander liegen.
- **Haus 7:** Ein Eingang in Figurengröße und die Dachuhr sind am Fuß eines 18-stöckigen Hauses nicht zusammen darstellbar. Deshalb steht vorn ein flacher Eingangsbau, der Turm mit der Uhr dahinter wirkt kleiner als die Nachbartürme.
- **Schrift mit Hatschek:** Auf Schildern sind Haken und Striche als eigene Pixel über die Buchstaben gesetzt, weil die 5-Pixel-Schrift Š und Ž kaum lesbar macht.
- **Hinweis „Was geschah im Januar 1994?“:** Dieses Thema öffnet sich nur kurz, weil der passende Schluss meist sofort folgt. Im Durchlauf kam es deshalb nicht vor. Es ist trotzdem erreichbar.
- **Direktstart in Kapitel 2 ohne Split:** Dann gelten Vorgaben, nämlich „hängen geblieben“ und „Da ist niemand mehr“ sowie alle Erinnerungen aus Split. Vor dem Start fragt das Spiel nach („Split ist noch nicht zu Ende gespielt. Trotzdem?“). Welche Vorgaben gelten, sagt es nicht.

## 9. Auslieferung

| Was | Datei |
|---|---|
| Spiel, Kapitel 1 und 2, für Netlify (Ordner hochladen oder ZIP entpacken) | `web/` und `mala_kapitel1-2_web.zip` |
| Handlung, Schauplätze, Figuren, Rätsel, Audio (Entwurf) | `KAPITEL2.md`, `game/CAST2.md`, `game/ROOM_SPECS2.md` |
| Dialoge, Rätsel, Animationen, Audio (umgesetzt) | `game/src/` (siehe Abschnitt 3) |
| Komplettlösung Kapitel 2 | `LOESUNG2.md` |
| Dieser Bericht | `BERICHT_K2.md` |

Prüfen und bauen:

```
node game/build.js                                  # baut web/ (mit Syntaxprüfung je Datei)
node game/tools/walkthrough.js                      # Kapitel 1 komplett
MALA_DUMPALL=/tmp/dumps node game/tools/walkthrough2.js        # Kapitel 2 komplett, legt Zwischenstände ab
MALA_ORDER=alt node game/tools/walkthrough2.js      # Kapitel 2, andere Reihenfolge
node game/tools/k2tests.js /tmp/dumps               # Einzeltests (braucht die Zwischenstände)
node game/tools/devicetest.js                       # iPad-Ansicht, Touch, offline, Bildzeit
```
