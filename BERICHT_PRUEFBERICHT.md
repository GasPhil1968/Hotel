# MALA – Überarbeitung nach dem Prüfbericht (November 2026)

Dieser Bericht beschreibt, was nach dem externen Prüfbericht geändert wurde. Er gibt für jeden Befund an:

- ob er sich im Code bestätigt hat;
- wie er behoben ist;
- wie die Behebung geprüft wurde.

Die Reihenfolge folgt der Empfehlung des Prüfberichts.

Grundsätze wie bisher:

- keine Hinweise auf dem Bildschirm, die den nächsten Schritt vorgeben;
- konkrete Lösungsschritte nur in der freiwilligen Hilfe;
- alte Spielstände laufen weiter.

## 1. Blockierende Fehler

| Befund | Bestätigt? | Ursache | Änderung |
|---|---|---|---|
| **Ivkas Handschuhe gehen bei einer Unterbrechung verloren** | ja | Das Spiel speicherte beim Gang zum Titelbild und beim Wechsel aus der App den Stand mitten in der Szene. In der Szene waren die Handschuhe schon übergeben, der nächste Sicherungspunkt kam erst später. | **Sicherungspunkt für Szenen** in `05_engine.js`: Läuft eine Szene, wird der Stand von ihrem Beginn gespeichert oder der vom letzten `A.save()` in ihr. Das gilt für alle Szenen beider Kapitel. Betroffene alte Stände bekommen die Handschuhe beim Laden zurück, solange Ivkas Abschied aussteht (`90_story.js`). |
| **Tomažs Nacht beginnt ohne die Auskunft über die Kaserne** | ja | Lejla war nur in der Kafana zu fragen. Nachts ist die Kafana zu, und die Kula lässt sich nicht verlassen. | **Lejla sitzt in dieser Nacht auf der Stufe der Kafana.** Sie ist der Großmutter vorausgegangen und gibt die Auskunft dort. Fehlt der Zapfenstreich noch, sagt Tomaž ihn selbst. Was Tomaž schon gehört hat (die zwei Siebenen), bleibt auch nach einem Abbruch gültig. Die Hilfe sagt, wo Lejla sitzt. |
| **Zurückgegebenes Stemmeisen fehlt am Herd** | ja | Nach der Rückgabe gab es keine zweite Ausleihe. Nedžad sagte trotzdem „Behalten Sie es“. | **Nedžad leiht es erneut**, solange eine Fuge offen ist: im ersten Fall die Leiste am Spiegel, im Finale das Wärmefach. Seine Sätze hängen jetzt davon ab, ob Marko das Werkzeug hat. Bei der Rückgabe sagt er, wo es hängt. Alte Stände mit der alten Rückgabe-Markierung bekommen es ebenfalls. |
| **„Danach fragen“ fast außerhalb des Bildes** | ja | Der Knopf lag bei y = 198 und war 13 Pixel hoch. | **Neues Notizbuch-Layout** (`06_ui.js`): fünf Einträge je Seite und ein fester Bereich unten für Beschreibung und Bestätigung. „Danach fragen“ ist 18 Pixel hoch und liegt vollständig im Bild, bei y = 154–171. Zweimal Antippen geht weiterhin. |

## 2. Widersprüche und gleichwertige Handlungen

- **Uhrzeiten an der Kula**, mit einer verbindlichen Zeitleiste:
  - Am 14.11.1972 ging die Sonne um 16:16 unter. Die Kula schlug um 23:16 sieben.
  - Tomaž ging um 23:05, Emina kam um 23:16. Das sind elf Minuten.
  - Heute Nacht (Sonntag, 20.11.2011) schlägt die Kula um 23:12. Die Kula-Zeiger passen dazu.
  - Das Warten heute dauert sieben Minuten: „Damals waren es elf.“
  - Emina: „Um sechzehn nach elf. Elf Minuten nach dir.“
  - Malas Nachhall an der Bank, Tomažs Antwort auf 23:16 und das Zifferblatt in der Zwischenwelt nennen dieselbe Zeit.
- **Lukas Tickets:**
  - Bei Nina hängt jetzt eine **gerahmte Reservierung für zwei**, nie eingelöst.
  - Die beiden Tickets hatte Luka. Sie liegen zusammen im Koffer.
  - Nina bekommt das zweite am Ende zum ersten Mal in die Hand: „Ich hatte nur die Reservierung. Die Tickets hatte er.“
  - Notiz, Schlussfolgerungen, Lukas Antwort und Ninas Satz zur Uhrzeit (10:14) sind angepasst.
- **Zdenka den Schlüssel als Gegenstand geben** wirkt jetzt wie die Dialogzeile. Dieselben Bedingungen gelten, dieselben Reaktionen folgen.
- **Malas Frage nach dem ersten Schwindel** schließt das Aufstehen am Schreibtisch ausdrücklich aus: „Nicht der halbe Schritt beim Aufstehen.“ Wer trotzdem den Schreibtisch wählt, hört, dass Mala das Festhalten an der Kante gesehen hat. Dann fragt sie nach dem anderen Moment.

## 3. Tonćis Brief und Brunos Rätsel

- **Tonćis Brief:**
  - Malas Fähigkeit, eine Schrift zu lesen, die nicht mehr da ist, kommt jetzt vorher **spielerisch** vor. Das geschieht im Pflichtschritt im Hafenamt.
  - Das Rückenschild des falsch einsortierten Ordners ist ausgeblichen. *Ansehen* reicht nicht; erst *Spüren* liest „1984“.
  - Beim ausgewaschenen Brief kann man dieselbe Fähigkeit übertragen. Es gibt dafür keinen neuen Hinweis auf dem Bildschirm.
  - **Sanja** reagiert auf den Zustand des Briefs. Ist er geöffnet, aber unlesbar: „Lesen kann ihn so keiner mehr. Das Salz nimmt die Tinte zuerst.“ Ist er gelesen: „Den hast du doch gelesen.“
- **Brunos Satz:**
  - Bruno bekommt den Satz erst aus **drei Erinnerungen** zusammen: Tanzfoto, Klavierschule und Umschlag aus Zagreb. Die Reihenfolge ist frei.
  - Jede Erinnerung bringt ein eigenes Wort. Das Foto bringt „sam“ (allein), die Klavierschule „sviraj“ (spiel), der Umschlag die Schuld.
  - Der Umschlag allein ist **keine Abkürzung** mehr.
  - Die fünf Antwortfelder beginnen **leer**. Die richtige Fassung steht nicht mehr immer an erster Stelle. „Vorlesen“ mit leeren Feldern: „Da fehlt noch etwas.“

## 4. Neue Rätselformen statt Auswahlzeilen

Drei Aufgaben sind jetzt anders spielbar. Die neuen Formen liegen als allgemeine Overlays in `06_ui.js`.

| Aufgabe | vorher | jetzt |
|---|---|---|
| **Tomažs sechs Briefe** | Übersetzung in vier Auswahlzeilen | **Ordnen:** nach Stempel, Anrede („Draga Emina“, „Emina“, „E.“) und Inhalt (zu Hause, Weihnachten, „Hast du meine Briefe bekommen?“). Antippen zeigt Markos Übersetzung, ein zweites Antippen tauscht. Bei Fehlern sagt Marko, woran es liegt. |
| **Die zwei Fotohälften** | zwei Auswahlzeilen | **Zusammenlegen:** Das Foto ist gezeichnet und entlang eines Risses geteilt. Antippen dreht eine Hälfte, „Tauschen“ legt sie um. Glatte Außenränder und ausgefranste Rissränder zeigen, was zusammengehört. Der Ärmel des Jungen liegt auf Lanas Hälfte. |
| **Bauakte in Kurrent** | drei Auswahlzeilen | **Schriftvergleich:** Oben steht Jakobs Tafel, darunter die unsicheren Zeichen der drei Wörter. Man liest jedes Zeichen so, wie es auf der Tafel aussieht: u mit Bogen, e klein, r, ſ ohne und f mit Querstrich. |

Weiterhin als Auswahlzeilen gelöst werden:

- Lejlas Bewerbung;
- Nedžads Gravur;
- Fikrets Brief;
- Ivans erste Zeile;
- Brunos Satz, jetzt mit leeren Feldern.

## 5. Spannungsbogen, Fallabschlüsse, Führung

- **Malas Erinnerungen verteilt:** Am Ende kamen fünf hintereinander.
  - Der Keller kommt jetzt früher: in Zoras Kellerschule die Bänke benutzen, am Tisch mit dem eingeritzten M.
  - Das schwarze Blatt kommt ebenfalls früher: auf der Gelben Bastei zur Vijećnica hinuntersehen.
  - Beide frühen Erinnerungen zeigen ein Mädchen ohne Namen. Wer sie verpasst, sieht sie beim Foto, dann mit Namen.
  - **Die Nacht des Busses** kommt erst in der letzten Drei. Davor hält die Bahn an einer leeren Haltestelle, danach gibt es eine Pause ohne Worte.
- **Malas Fahrschein vorbereitet:** Nach seiner Erkenntnis gibt Tomaž Marko seinen Zettel. Für einen Atemzug ist er echt. Mala sagt dazu: „Wer losgelassen hat, kann etwas hergeben. Einmal.“ In der letzten Nacht greift Mala das auf.
- **Fallabschlüsse:**
  - **Ljerka:** Sie bekommt nach Brunos Satz einen eigenen Moment für das, was sie verloren hat: Akademie, Wien, sechsunddreißig Jahre Frühstück. Bruno darf gehen, Ljerka verzeiht ihm nicht: „Heute nicht.“
  - **Nina:** Ihre Bereitschaft ist das eigentliche Hindernis. Sie will nicht an die Rampe. Marko muss zeigen, dass er verstanden hat, worauf sie wartet: über ihre Bilder oder über ihr Warten am Kiosk. Andere Notizen weist sie ab; man kann es danach noch einmal versuchen.
  - **Bruno:** Er erkennt seinen Tod nicht mehr am gealterten Gesicht seiner Tochter, denn so erkennt schon Luka. Er dreht sich zum Sonntagstanz nach Danica um, sie ist nicht da, und er denkt an die Kerze, die er ihr jedes Jahr angezündet hat: „Und mir … wer hat mir …?“
- **Markos Skepsis nach Ivka:** Den Zettel hinter Sanjas Tresen gibt es weiter. Er war eine ausdrückliche Vorgabe für die Wiederkehr. Er ist aber kein zweiter Wahrnehmungstest mehr.
  - Marko glaubt Mala: „Das ist ja das Problem.“ Wer ihr glaubt, glaubt auch, was sie über andere sieht.
  - Sanja wollte es Stipe und Frane selbst sagen.
  - Marko merkt, was es heißt, das zu wissen. Mala weicht der Frage nach sich selbst aus.
- **Wegeansagen:** „Erst die Riva“, „Nur zur Kula“, „Erst Sanja“, „Erst Mala“ und ähnliche Sätze sind ersetzt. Die gesperrten Wege nennen jetzt einen Grund in der Welt oder einen Wunsch der Figur, keinen nächsten Schritt. Beispiele:
  - „Sonst schreibe ich über eine Frau, die ich nur aus einem Heft kenne.“
  - „Nur das Lied von vorhin geht mir nicht aus dem Kopf.“

## 6. Tatsächlich ausgeführte Prüfungen

Alle Läufe gehen durch das echte Spiel (`web/index.html`) in Chromium (Playwright, ohne Bildschirm). Ein echtes iPad stand nicht zur Verfügung.

| Prüfung | Ergebnis |
|---|---|
| `pruefbericht.js` (neu): jeder Befund so nachgestellt, wie er beim Spielen entsteht | **57 von 57** bestanden, keine JS-Fehler |
| Kapitel 1 komplett, deutsch (`walkthrough.js`) | **OK**, 61 Schritte bis zum Abspann, keine JS-Fehler. Spieltakt der Musterlösung: 85,9 min, vorher 83 min |
| Kapitel 1 komplett, BHS (`MALA_LANG=bhs walkthrough.js`) | **OK**, 61 Schritte, kein angezeigter Text ohne Übersetzung, kein Text läuft aus dem Bild. Das Transkript hat 1.120 Sätze; die Suche nach kroatischen Wörtern bei Mala ergab einen Treffer, der Absicht ist: Marko spricht dort mit sich selbst. |
| Kapitel 2 komplett (`walkthrough2.js`) | **OK**, 67 Schritte bis zum Abspann, keine JS-Fehler. Die neuen Rätselformen werden über ihre Trefferflächen angetippt. Spieltakt: 98,6 min, vorher 96,4 min |
| Spielstände und Einstieg (`einstiegtests.js`, alte Spielstände der Vorversion) | **39 von 39** |
| Kapitel 2, Zusatztests (`k2tests.js`) | **32 von 32** |
| Geräte und Bedienung (`devicetest.js`) | **27 von 27**: iPad-Ansicht mit Touch, Hochformat, offline, Bildzeit unter 16,7 ms bei gedrosselter CPU |

Was `pruefbericht.js` im Einzelnen nachstellt:

1. **Handschuhe:**
   - Abschied bis zur Übergabe spielen, dann „Zum Titelbild“ bzw. den App-Wechsel auslösen.
   - Laden: Die Handschuhe sind da, und der Abschied ist vollständig spielbar.
   - Ein beschädigter Stand der Vorversion wird repariert. Nach Ivkas Abschied kommen keine Handschuhe zurück.
2. **Tomaž:**
   - Lejlas Auskunft aus dem Stand entfernen und die Nacht beginnen. Die Ausgänge sind gesperrt, Lejla ist da.
   - Mit den zwei Siebenen allein bleibt Tomaž nicht. Nach Lejlas Auskunft bleibt er, und die Kula schlägt.
3. **Stemmeisen:**
   - Nach dem Spiegel zurückgeben und im Finale ohne Werkzeug an den Herd gehen.
   - Nedžad leiht es noch einmal, das Wärmefach geht auf. Ein Stand mit der alten Markierung bekommt es ebenso.
4. **Notizbuch:**
   - Trefferfläche von „Danach fragen“ ausmessen: ganz im Bild, mindestens 16 × 60 Pixel.
   - Antippen über den echten Eingabeweg stellt die Frage.
5. **Zdenka:** Den Schlüssel als Gegenstand vor, zwischen und nach den Notizen geben. Die Reaktionen gleichen denen der Dialogzeile.
6. **Malas Frage:** Der Schreibtisch bekommt die passende Rückfrage. Danach geht die Riva wie vorgesehen.
7. **Hafenamt:** *Ansehen* liefert die Jahreszahl nicht, *Spüren* schon.
8. **Sanja:** passende Reaktion auf den geöffneten und auf den gelesenen Brief.
9. **Bruno:**
   - Umschlag zuerst: kein Satz. Danach Klavierschule und Foto: der Satz.
   - Die Felder beginnen leer, „Vorlesen“ meldet die Lücke. Die ersten Fassungen sind nicht die Lösung.
10. **Briefe ordnen**, nur mit Antippen: Die falsche Reihenfolge wird erklärt, die richtige liest die Briefe.
11. **Kurrent**, nur mit Antippen: Leere Lesarten werden gemeldet, falsche Lesarten ergeben „Grnndmaner“. Mit der Tafel richtig gelesen gibt es den Passierschein.
12. **Fotohälften**, nur mit Antippen:
    - falsche Seite: „Der Riss passt nicht“;
    - eine Hälfte verkehrt: „auf dem Kopf“;
    - richtig: das ganze Foto.
13. **Erinnerungen:**
    - Der Tisch mit dem M bringt die Kellerschule, noch ohne Lanas Namen.
    - Beim Foto fehlt der schon gesehene Keller; das schwarze Blatt wird nachgeholt; die Nacht des Busses kommt noch nicht.
    - In der letzten Drei kommt die Nacht des Busses vor dem Geständnis.

### Statische Prüfungen

- Die Sprachfassung BHS hat 0 fehlende Texte bei rund 3.490 sichtbaren Texten (`i18n_check.js`). Bei den Doppelten gibt es keine neuen Widersprüche (`i18n_dupes.js`).
- Die Uhrzeiten an der Kula sind per Suche abgeglichen.

## 7. Was offen bleibt

- **Kein Durchlauf auf einem echten iPad.** Die Gerätetests emulieren Berührung und Bildgrößen in Chromium. Die Größe der Berührungsflächen ist ausgemessen, aber nicht mit dem Finger erprobt.
- **Die beiden frühen Erinnerungen sind freiwillig.** Wer sie verpasst, sieht sie beim Foto. So bleibt das Ende verlässlich, aber nicht jeder erlebt die Verteilung.
- **Fünf Aufgaben bleiben Auswahlzeilen:** Bewerbung, Gravur, Fikrets Brief, Ivans Zeile, Brunos Satz.
- **Kapitel 2 ist auf BHS weiter deutsch.**
- **Neue Texte in Kapitel 1** (Bruno, Ljerka, Nina, Sanja, Mala, Zdenka) haben KI-Übersetzer nach den Regeln in `game/STYLE_BHS.md` übertragen. Eine Durchsicht durch Muttersprachler ist empfehlenswert.
- **Spielzeiten** sind Schätzungen aus den Testläufen: Spieltakt der Musterlösung mit Pflichtdialogen in Normaltempo.

## Geänderte Dateien

**Kern:**

- `game/src/05_engine.js`: Sicherungspunkt, neue Rätselaufrufe, abgebrochene Szene beim Laden;
- `game/src/06_ui.js`: Notizbuch, leere Felder, drei neue Rätselformen;
- `game/src/00_core.js`: Schriftzeichen ſ;
- `game/src/90_story.js`: Reparatur alter Stände.

**Kapitel 1:**

- `rooms/flat.js`, `rooms/varos.js`, `rooms/office.js`, `rooms/bar.js`, `rooms/shop.js`, `rooms/ledana.js`, `rooms/palma.js`;
- `11_notes.js`, `92_story2.js`;
- Sprachdateien `lang/bhs_k1_*.js` und `lang/bhs_ui.js`.

**Kapitel 2:**

- `rooms/kula.js`, `rooms/kafana.js`, `rooms/kazandziluk.js`, `rooms/kuca.js`, `rooms/obala.js`, `rooms/skloniste.js`, `rooms/vratnik.js`, `rooms/tramvaj.js`, `rooms/pansion.js`, `rooms/carsija.js`;
- `96_k2_story.js`, `97_k2_mala.js`, `97_k2_limbo.js`, `15_k2_hints.js`.

**Tests:**

- `game/tools/pruefbericht.js` (neu);
- `walkthrough.js`, `walkthrough2.js` und `driver.js` angepasst.

**Doku:** `KONZEPT.md`, `LOESUNG1.md`, `LOESUNG2.md`, `README.md`, `SPRACHFASSUNG_BHS.md`.
