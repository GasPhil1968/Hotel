# MALA – Kapitel 2: Sarajevo · Entwicklungs- und Testbericht

Stand: 3. November 2026 · Branch `claude/split-adventure-game-concept-inxuzp`

Dieser Bericht trennt streng zwischen dem, was **tatsächlich ausgeführt und gemessen** wurde (Abschnitt 5), und dem, was **nur geschätzt oder theoretisch begründet** ist (Abschnitt 6). Was nicht geprüft werden konnte, steht in Abschnitt 7.

---

## 1. Ergebnis in Kürze

- Kapitel 2 ist von der Ankunft am Busbahnhof bis zur Abfahrt nach Mostar **vollständig spielbar**. Es gibt kein Game Over und nach allen ausgeführten Prüfungen keine Sackgasse.
- **Drei Geisterfälle:** Tomaž unter der Uhr (Fall 1), Professor Ivan Barać und das Bibliotheksbuch (Fall 2), die Lehrerin Zora im Schutzraum (Fall 3). Dazu kommt **Malas eigene Geschichte** in drei Teilen mit dem Kioskgeist Alija, einem Zwischenspiel, dem Finale und dem Epilog. Alle vier Geister haben eine eigene Erkenntnisszene. Die drei Fallgeister gehen danach mit Mala durch die Zwischenwelt, jeder mit einem eigenen Übergang.
- **18 neue Schauplätze**, alle gemalt, dazu der Stadtplan von Sarajevo. **26 neue Figuren** mit Rig und Animationen, **22 neue Porträts**.
- **Kapitelwahl direkt im Hauptmenü:** „Kapitel 1: Split“ und „Kapitel 2: Sarajevo“ stehen nebeneinander. Sarajevo startet sofort, auch ohne Split, ohne Sperre und ohne Rückfrage. Nach dem Abspann von Split heißt es „Weiter mit Kapitel 2“.
- **Immer Querformat:** Hält man das Gerät hochkant, dreht sich das Spielbild um 90° und füllt die lange Seite. Das funktioniert auch bei gesperrter Bildschirmdrehung. Wo der Browser es erlaubt, wird die Ausrichtung zusätzlich auf quer gesperrt. Antworten und Erinnerungen aus Split werden übernommen. Alte Spielstände laufen unverändert weiter, das Spiel funktioniert weiterhin offline.
- **Umfang gegenüber Split** (gleiche Zählweise für beide Kapitel): Dialog- und Erzählzeilen **+53,6 %**, Gesprächsoptionen **+50,2 %**, Schlussfolgerungen im Notizbuch **9 → 24**, Rätsel-Overlays **1 → 7**, Erinnerungsszenen **8 → 23**. Hinzu kommen **50 Hinweisthemen mit je drei Stufen**, nur auf Wunsch.
- **Automatisch geprüft** (Abschnitt 5): zwei vollständige Durchläufe von Kapitel 2 in zwei Reihenfolgen, ein vollständiger Durchlauf von Kapitel 1, 32 Einzeltests, 27 Gerätetests (iPad-Ansicht quer und hochkant mit Touch, Update einer offline gespeicherten Fassung, offline, Bildzeit) und Bilder aller Räume.
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
| Musik und Klang | 12 eigene Stücke (u. a. Sarajevo, Kafana, Ermittlung, Geist, Erkenntnis, Erinnerung, Mala, Nacht, Zwischenwelt, Finale, Bus, Abspann), 18 Klangkulissen, 27 neue Geräusche und 14 Klangereignisse für die Kulissen (Straßenbahn, Kupferhämmern, Kula, Glocken, Gebetsruf aus der Ferne, Domino …), 5 neue Instrumente (Saz, Klarinette, Akkordeon, Glockenspiel, Cello) | `16_k2_audio.js` |
| Werkzeuge | Durchlauf Kapitel 2 (zwei Reihenfolgen), Einzeltests, Gerätetest, Syntaxprüfung beim Bauen | `game/tools/walkthrough2.js`, `k2tests.js`, `devicetest.js`, `game/build.js` |

## 4. Umfang, gemessen

Gezählt mit demselben Skript für beide Kapitel. Es zählt im Quelltext Sprechaufrufe (`say`, `A.m`, `A.g`, `narrate`, `voice`, `phoneVoice`), Beschreibungstexte, Optionen und Hotspots. Gezählt wird also, was im Spiel steht. Ein einzelner Spieler sieht davon je nach Weg nur einen Teil.

| Größe | Kapitel 1 (Split) | Kapitel 2 (Sarajevo) | Veränderung |
|---|---:|---:|---:|
| Dialog- und Erzählzeilen | 1323 | **2032** | **+53,6 %** |
| davon Figuren | 571 | 883 | +55 % |
| davon Marko | 470 | 611 | +30 % |
| davon Mala | 249 | 437 | +76 % |
| davon Erzähler, Telefon, Stimme | 33 | 101 | |
| Beschreibungen („Schau an“) | 444 | 564 | +27 % |
| Gesprächsoptionen | 205 | **308** | **+50,2 %** |
| Hotspots | 240 | 280 | +17 % |
| Schlussfolgerungen im Notizbuch | 9 | **24** | ×2,7 |
| mehrstufige Rätselketten (laut Entwurf) | 12 | 24 | ×2 |
| Rätsel-Overlays | 1 | 7 | |
| Erinnerungs- und Nachhallszenen (Aufrufe) | 8 | 23 | |
| gemalte Erinnerungsbilder | 7 | 22 | |
| Dokumente (Briefe, Postkarten, Register …) | 16 | 17 | |
| Hinweise | 0 | 50 × 3 Stufen | |
| Wörter in Texten | 29 239 | 40 194 | +37 % |
| Schauplätze | 18 | 18 | |
| Musikstücke | 11 | 12 | |
| Klangkulissen | 21 | 18 | |

Die Wortzahl von Kapitel 2 enthält auch die Hinweistexte. Die Zeilenzahl enthält sie nicht.

## 5. Tatsächlich ausgeführte Prüfungen

Alle Prüfungen liefen automatisch in Chromium (Playwright), headless, in diesem Container. Die Ergebnisse unten stammen vom **letzten Bau** (`web/index.html`, mit allen Räumen und Erinnerungsbildern).

### 5.1 Vollständige Durchläufe

Die Durchläufe spielen das Spiel über die echte Oberfläche: Verben auf Hotspots, Gesprächsoptionen, Notizen verbinden, Rätsel-Overlays lösen, Räume wechseln. Nach jedem Schritt prüfen sie konkret, ob die erwartete Notiz, der Gegenstand, das Flag, die Phase oder der Raum da ist. Der Spieltakt ist die Spieluhr in Normaltempo (der Test läuft 25-fach beschleunigt). Er enthält auch die kurzen Wartezeiten des Testtreibers.

| Prüfung | Ergebnis |
|---|---|
| Kapitel 2, Musterlösung (`walkthrough2.js`) | **bestanden**: 67 Prüfschritte von der Ankunft bis zum Abspann, keine JS-Fehler, das Ende von Kapitel 2 ist gespeichert. Alle vier Geister erkennen ihren Tod (Tomaž, Ivan, Zora, Alija). Spieltakt 95,8 min. |
| Kapitel 2, andere Reihenfolge (`MALA_ORDER=alt`) | **bestanden**: Fall 2 und das Zwischenspiel kommen vor Malas Spur, die erst im dritten Akt folgt. 68 Prüfschritte, keine JS-Fehler. Spieltakt 95,6 min. |
| Kapitel 1, Musterlösung (`walkthrough.js`) | **bestanden**: 53 Prüfschritte bis zum Abspann, keine JS-Fehler. Kapitel 1 funktioniert also weiterhin. Spieltakt 64,4 min. |

### 5.2 Einzeltests (`k2tests.js`): 32 von 32 bestanden

Die Tests laden Zwischenstände aus dem Durchlauf und prüfen gezielt:

- **Kapitelwahl und Übernahme (14):**
  - Beide Kapitel stehen im Hauptmenü. Ein Antippen von „Kapitel 2: Sarajevo“ führt, auch ohne Split-Ende, sofort zu den Speicherplätzen, ohne Sperre und ohne Rückfrage. Danach beginnt Sarajevo am Busbahnhof. Bedient wird dabei über den echten Eingabeweg.
  - Ohne Split gelten die Vorgaben; das Register aus Split ist immer da.
  - Nach dem Ende von Split ist Kapitel 2 frei. Die Antworten („Meer“, „niemand mehr“) und die Notizen werden übernommen.
  - Nach dem Abspann heißt es „Weiter mit Kapitel 2“.
  - Kapitel 1 startet wie bisher, der mitgelieferte Spielstand aus Split lädt, ein alter Stand gilt als Kapitel 1, und Kapitel 1 hat keine Hinweise.
- **Spielstände (3):** Laden mitten in Fall 1, dann die Seite neu laden: Der Stand ist identisch. Der Speicherplatz zeigt „Sarajevo: …“.
- **Falsche Wege (13):**
  - Emina in falscher Reihenfolge: Sie wendet sich ab, danach klappt es mit der richtigen Reihenfolge.
  - Vor dem Datum gibt es keinen Sonnenuntergang.
  - Mala kann nichts nehmen.
  - Falsche Verbindungen bekommen eine eigene Antwort, auch beim zweiten Versuch.
  - Hinweise sind offen und zeigen die erste Stufe.
  - Die Klingel ohne Mala unten bringt keinen Fortschritt und lässt sich wiederholen.
  - Der Karton öffnet sich erst mit den nötigen Schlüssen.
  - Tomaž mit falschem Argument bleibt unruhig, mit den richtigen schlägt die Kula sieben.
- **Hinweisabdeckung (2):**
  - Jeder Hinweis hat drei Stufen.
  - **An 66 von 67 Zwischenständen ist mindestens ein Hinweis offen**, nur am Abspann nicht. Diese Prüfung ist neu. Beim ersten Lauf fand sie zwölf Stellen ohne Hinweis, die ich mit 15 neuen Themen geschlossen habe.
  - 49 der 50 Themen kommen im Durchlauf vor. Das fehlende („Was geschah im Januar 1994?“) öffnet sich nur für einen Moment.

### 5.3 Gerätetest (`devicetest.js`): 27 von 27 bestanden

Profil „iPad (gen 7) landscape“, 1080 × 810, Touch. Das Spiel läuft dabei über einen lokalen Webserver, damit der Service Worker greift.

- **Darstellung:** Das Spielbild ist 960 × 600 groß, passt ganz auf den Bildschirm, behält das Verhältnis 320:200 und nutzt 89 % der Breite.
- **Touch:** Alles per Tippen:
  - im Hauptmenü „Kapitel 2: Sarajevo“ antippen, dann den Speicherplatz;
  - die Einleitung durchtippen;
  - den Kiosk antippen, das Verbmenü öffnet sich, „Ansehen“ wählen, Marko spricht;
  - Inventar und Menüknopf sind antippbar; der Spielstand wird gespeichert;
  - Doppeltippen zoomt und scrollt nicht.
- **Hochformat** (Profil „iPad (gen 7)“, 810 × 1080): Das Spielbild ist um 90° gedreht und passt ganz auf den Bildschirm (600 × 960). Es nutzt 89 % der langen Seite und bleibt bei 320:200. Antippen im gedrehten Bild trifft „Kapitel 2: Sarajevo“ und „Zurück“. Wird das Gerät quer gedreht, steht das Bild wieder normal.
- **Offline:** Der Service Worker ist aktiv und hat alle 6 Dateien gespeichert. Ohne Netz lädt die Seite vollständig neu, und der Spielstand ist noch da.
- **Update:** Eine offline gespeicherte Fassung wird auf dem Server durch eine neue ersetzt. Das Titelbild lädt die neue Fassung dann von selbst, und der alte Offline-Speicher ist gelöscht. Ohne diese Änderung hätte ein installiertes Spiel beim ersten Öffnen nach einem Update noch die alte Fassung gezeigt, also womöglich auch das alte Menü ohne Kapitel 2.
- **Bildzeit** (Chromium, CPU vierfach gedrosselt, alle 18 Schauplätze, der Stadtplan und zwei Räume aus Split, je mit und ohne Geistersicht):
  - Im Schnitt 0,3–2,2 ms pro Bild, schlechtester 95-%-Wert 6,8 ms. Für 60 Bilder pro Sekunde wären 16,7 ms erlaubt.
  - Ein Raumwechsel samt erstem Bild dauert 137–856 ms.

### 5.4 Weitere Prüfungen

- **Ladeprüfung des Endstands:** 38 Räume, 202 Notizen, 60 Gegenstände, 24 Phasen. 0 JS-Fehler und 0 Warnungen; kein Spot und keine Raumkunst fehlt.
- **Syntaxprüfung je Quelldatei** beim Bauen. Ein absichtlich eingebauter Fehler wurde mit Datei und Zeile gemeldet.
- **Bilder aller Schauplätze** mit echter Logik, Figuren und Mala: alle 18 Orte und der Stadtplan, mehrere Phasen (Tag, Nacht, Geistersicht), ohne JS-Fehler. Die Mal-Agenten haben jeden Raum zusätzlich in jeder vorgegebenen Phase, mit Debug-Rahmen und in Geistersicht aufgenommen.
- **Erinnerungsbilder:** Alle 22 werden im Endstand ohne Fehler gezeichnet. Die Mal-Agenten haben jedes zusätzlich im echten Overlay mit seinem Text geöffnet.
- **Gezielter Test für Alijas Erkenntnis** an der letzten Drei: Das Flag ist gesetzt, die Erkenntnis lief ab, danach geht es weiter in die Straßenbahn, ohne Fehler. Der Durchlauf prüft diese Szene außerdem in beiden Reihenfolgen.

## 6. Geschätzt oder nur theoretisch begründet (nicht gemessen)

- **Spielzeit 4–5 Stunden:** nicht mit Menschen gemessen.
  - **Gemessen** ist nur der Spieltakt der Musterlösung (siehe 5.1): rund 96 Minuten für Kapitel 2 und 64 Minuten für Kapitel 1, jeweils ohne Umwege, Suchen, Nachdenken und freiwillige Gespräche. Das ist knapp das 1,5-Fache.
  - **Hochgerechnet:** Für Split war die Spielzeit auf 2–3 Stunden geschätzt, ebenfalls ohne Messung. Mit demselben Faktor ergäben sich für Sarajevo etwa 3 bis 4½ Stunden.
  - **Zusätzlich** ist der freiwillige Teil in Kapitel 2 deutlich größer: Mala hat 76 % mehr Zeilen, es gibt eigene Themen bei jeder Figur und Reaktionen auf Gegenstände.
  - **Meine Schätzung:** 4–5 Stunden für Spieler, die erkunden. Zielstrebige Spieler eher 3–4 Stunden.
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
- **Split mit einer älteren Fassung beendet:** Die Fassung vor Kapitel 2 hat beim Abspann den Spielstand gelöscht und sonst nichts gespeichert. Ihr Split-Ende wird deshalb nicht erkannt. Sie starten Kapitel 2 direkt im Hauptmenü und spielen mit den Vorgaben. Wer Split mit der neuen Fassung beendet, wird erkannt und übernimmt seine Antworten. Nach dem Code gilt das auch, wenn man dafür einen Spielstand aus der alten Fassung weiterspielt, denn die Spiellogik von Split ist unverändert. Geprüft wurde aber nur das Laden eines alten Stands, nicht das Weiterspielen bis zum Ende.
- **Direktstart in Kapitel 2 ohne Split:** Dann gelten Vorgaben, nämlich „hängen geblieben“ und „Da ist niemand mehr“ sowie alle Erinnerungen aus Split. Welche Vorgaben gelten, sagt das Spiel nicht.

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

## 10. Nachträge

Nach dem ersten Bericht kamen diese Änderungen hinzu. Alle sind von den Tests in Abschnitt 5 abgedeckt, denn die Tests liefen danach erneut auf dem neuen Stand.

- **Kapitelwahl:** Kapitel 2 steht direkt im Hauptmenü, ohne Sperre und ohne Rückfrage (siehe 5.2 und 5.3).
- **Updates kommen sofort an:** Übernimmt eine neue Fassung den Offline-Speicher, lädt das Spiel sie auf dem Titelbild sofort. Mitten im Spiel erscheint ein Hinweis, und die neue Fassung startet beim nächsten Titelbild. Außerdem holt der Service Worker die Dateien am Browser-Cache vorbei (siehe 5.3).
- **Querformat:** Im Hochformat dreht sich das Spielbild um 90°, die Touch-Eingabe wird mitgedreht. Wo möglich, wird zusätzlich `screen.orientation.lock('landscape')` versucht. Das gelingt auf Android im Vollbild und in installierten Apps, auf iPad und iPhone nicht; dort hilft die Drehung des Bildes (siehe 5.3).
- **Bewusste Stille:** In der Kammer, im dunklen Schutzraum am Tag und in der Vijećnica bis zur Rückgabe des Buchs spielt keine Musik, nur die Klangkulisse.
- **Alija:** Er verschwindet nach seiner Erkenntnis nicht sofort. Er bleibt an der Haltestelle, bis die Drei abfährt, und Marko sieht durch das Rückfenster, wie er seinen Kiosk schließt.
- **Geschichtliche Genauigkeit:**
  - Rade sagt jetzt, die erste Drei nach dem Stillstand sei im März 1994 gefahren, „mitten im Krieg, in einer Waffenruhe“. Vorher hieß es „nach dem Krieg“. Die Quellen nennen den 8. März oder den 15. April 1994; der Krieg dauerte bis Ende 1995.
  - Der Fahrpreis von 1,60 KM am Kiosk (1,80 KM beim Fahrer) deckt sich mit mehreren Reiseführern. Eine Quelle, die das Jahr 2011 ausdrücklich belegt, habe ich nicht gefunden.
