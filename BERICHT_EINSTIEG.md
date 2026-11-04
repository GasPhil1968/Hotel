# Bericht: Markos Einstieg, das Kennenlernen und die Wiederkehr nach Ivka

Stand: November 2026, Zweig `claude/split-adventure-game-concept-inxuzp`. Plan vor dem Umbau: `EINSTIEG_PLAN.md`. Lösungsweg: `LOESUNG1.md`.

## 1. Grundlage und Abweichungen vom Auftrag

- **Ausgangsstand:**
  - Der Auftrag nennt eine hochgeladene `mala_kapitel1-2_web.zip`. Dem Auftrag lag keine ZIP bei.
  - Gearbeitet wurde auf dem Repository-Stand `7ddcc03`. Daraus war die zuletzt gelieferte ZIP gebaut.
- **Referenz:**
  - Der Hauptauftrag spricht von „The Blackwell Deception“; beigefügt war die Komplettlösung zu „The Blackwell Legacy“. Die Ergänzung zum Auftrag nennt Legacy und geht vor.
  - Ausgewertet sind die Seiten 4–10. Übernommen sind nur Prinzipien:
    - ein eigener Alltag mit abgeschlossener Recherche vor dem Geist;
    - eine zuerst unerklärliche körperliche Wahrnehmung;
    - die Frage nach dem Ort des ersten Unwohlseins;
    - die Rückkehr an einen vorher besuchten Ort.
  - Nicht übernommen sind Figuren, Dialoge, Rätsellösungen, Joeys Fähigkeiten und die vererbte Bindung.
  - Übelkeit und Schwindel sind eigene Vorgaben für MALA; die Vorlage dokumentiert nur Kopfschmerzen. Auch die Abwesenheit nach Ivka ist eigene Handlung; in Legacy ist Joey am nächsten Morgen da.
- **Ergänzung geht vor:** Das erste lange Gespräch findet in Markos Wohnung statt, nicht im Hafenamt. Das Hafenamt ist der erste gemeinsame Praxistest.

## 2. Was umgesetzt ist

Die Übersicht der geänderten Funktionen und den Zustandsplan enthält `EINSTIEG_PLAN.md`. Kurz:

**Soloauftakt (Dienstag)**
- **Wohnung:**
  - Seite 31 der Espresso-Anleitung. Welche Leuchte gemeint ist, beantwortet die eigene Übersetzung von Seite 30.
  - Die Abgabe ist schnell oder sorgfältig. Am Donnerstag antwortet der Kunde je nach Wahl anders.
  - Danach Schwindel beim Aufstehen; Marko stützt sich ab („seit Sonntag“).
- **Anrufbeantworter:** Vesna mit der Notiz der Stadt („keine Kontakte“) und Sanja mit dem Brief aus Triest.
- **Bar „Bura“:**
  - Jetzt im Prolog geöffnet; Sanja, Stipe und Frane sind da. Alle drei gelten von Anfang an als bekannt, also ohne „???“ und ohne Vorstellung.
  - Sanja ist beschäftigt, bis Marko sich an seinen Tisch setzt.
  - Ihr Antwortbrief hat drei Fassungen; eine trifft ihr Ziel, die anderen bekommen Widerspruch.
  - Übelkeit an der Tasse, dann Sanjas Frage nach ihm mit drei Antworten; sie greift sie am Donnerstag auf.
  - Der Stuhl gegenüber ist ganz gewöhnlich; Sanja sitzt dort, während sie diktiert.
- **Recherche:**
  - Ivkas Strickheft im Nähkorb. Notizbuch: Notiz der Stadt + Heft = „Keine Familie heißt nicht: niemand“.
  - Danach die gezielte Rückfrage bei Zdenka. Den Schlüssel gibt Marko erst danach zurück.
  - Eine falsche Kombination erklärt nur, was fehlt.
- **Symptome:**
  - in Ivkas Wohnung stärker (Kopfweh, Flüstern, das Radio, ein Geruch nach Fritule, Übelkeit);
  - der erste klare Schwindelanfall erst am letzten Poller der Riva, ohne Geist und ohne Meldung.
- **Erste Erscheinung:** an der Kirchentreppe, erst nach der Rückgabe des Schlüssels; gespeichert in `split.intro.glimpse`.
- **Nachruf:** zusätzlich die Abwägung zwischen „Angehörige sind nicht bekannt“ und dem genauen Detail. Zeitung, Vesna, Sanja und Zdenka geben die Wahl wieder.
- **Nacht:** nur ein Spiegelbild und „Marko.“ Keine Prämisse, keine Antwort „Ich träume“.

**Kennenlernen (Mittwoch, Wohnung)**
- Kein Traumgespräch mehr in `M.startCase1`.
- An der Tür bekommt das Unbehagen eine Richtung, und Mala steht im Zimmer.
- Marko prüft die Tür, geht um sie herum und stellt ihr ein Glas Wasser hin, das sie nicht nehmen kann. „Der Boden steht still.“
- Dann die Fragen: Name, wer sie sieht, warum er, was sie kann und was nicht, seit wann sie da ist, warum es ihm jetzt anders geht.
- Mala fragt nach dem ersten Anfall. Falsche Orte bekommen eine Rückfrage.
- Das Glas bleibt bis zum Donnerstag auf dem Schreibtisch.
- **Hafenamt:**
  - nur noch Praxistest („Dann sieh nach.“): Figurenwechsel, Archiv, Markos Skepsis („Zufall.“);
  - keine zweite Vorstellung und nicht noch einmal „Der Kopfschmerz ist weg“.
- **Riva:** Mala ist sichtbar, Ivka steht an dem Poller vom Dienstag.

**Nach Ivka**
- Die Passage beginnt erst nach `c1.done`, beim Rückweg durch das Tor: eine kurze Pause auf der Bank, ein erzählter Heimweg, ins Bett.
- Kurz vor dem Schlaf verliert Marko Mala aus der Wahrnehmung.
- **Donnerstagmorgen (neue Phase `i1m`), allein:** Glas, Mail des Kunden, versandter Nachruf, umgedeutete Notizen, leere Mole. Kein Kaffee-Ritual.
- **Bura:**
  - Sanjas Begrüßung richtet sich nach dem Verlauf: nach der Antwort vom Dienstag, nach einem Besuch am Mittwoch, nach dem Satz im Nachruf.
  - Danach Malas Wiederkehr auf dem Stuhl gegenüber, mit drei Reaktionen.
  - Das Überprüfungsrätsel mit dem Zettel hinter dem Tresen: Mala geht hinter den Tresen und liest; Marko fragt, Sanja zeigt den Zettel.
- **Bank am Morgen:** das bisherige Zwischenspiel, an den Morgen angepasst. `mk.accept` setzt erst Markos ausgesprochener Entschluss; „Gib mir noch einen Tag“ ist möglich.
- **Übergang zu Fall 2:** Titelkarte „Mittag“, Marko bleibt an der Riva. In der Bar gibt es keine zweite Einführung und keine doppelten Sanja-Zeilen.

**Technik**
- **Abwesenheit:** `split.afterIvka.away` sperrt:
  - `A.g` (auch verzögerte Zeilen; gezählt in `E.gSuppressed`) und `malaJoin`;
  - `canSwitch`, den Wechselknopf samt Tippfläche und den Hilfetext;
  - außerdem ist `GS.malaOn` aus, damit gibt es weder Figur noch Hotspot, Leuchten oder Geräuschreaktion.
- **Neue Zustände:**
  - `split.intro.*`: v, translation, desk, sanja, health, knit, dizzy, glimpse, night, meet, door, round, offer, glass, first, met;
  - `split.afterIvka.*`: bench, home, away, wake, glass, water, notes, fixed, bar, back, reaction, verified, benchTalk;
  - `mala.noSwitch`: Mala ist bekannt, aber noch ohne Wechsel.
- **Migration** (`M.migrateSave`): Stände ohne `split.intro.v` gelten als alt (`split.intro.legacy`). Für sie gilt:
  - keine neuen Pflichtschritte;
  - `mk.test` belegt das Kennenlernen;
  - die alte Stimmenphase behält die alte Erstvorstellung im Hafenamt;
  - wer nach der Zwischenwelt lädt, kommt in die neue Passage (`resume` der Riva).
- **Neue Körperanimationen:** `steady`, `dizzy`, `nausea`, im Sitzen `sitSick` und `sitDrink`.
- **Ton:** an den Anfällen der vorhandene Kopfschmerz-Ton, Wind und Stille statt Musik. Kein Stroboskop, keine Bilddrehung.
- **Mitgelieferter Spielstand:** mit dem neuen Ablauf erzeugt. Der alte Stand liegt als Testdatum unter `game/tools/fixtures/`.

## 3. Tatsächlich ausgeführte Tests

Alle Tests liefen automatisch in Chromium (Playwright, ohne Fenster) auf dieser Maschine.

| Test | Was er prüft | Ergebnis |
|---|---|---|
| `walkthrough.js` (Deutsch) | Kapitel 1 vom Start bis zum Abspann auf dem neuen Pflichtweg. Dazu Sperren (Tür, Stadtplan), Kennenlernen nur einmal, kein Wechsel vor dem Praxistest, keine zweite Vorstellung, Morgen allein mit Speichern/Laden, Tab/M, Wiederkehr, Zettel, Aufschub der Zusage, Entscheidungen, Fall 2–3 | siehe Abschnitt 5 |
| `einstiegtests.js` | 39 Prüfungen mit echten Spielständen der Vorversion: alter Prolog, alte Stimmenphase, alter mitgelieferter Stand bis Fall 2, altes Zwischenspiel, alte Stände in Fall 2, Fall 3 und im Epilog; Sanjas drei Begrüßungen; der neue mitgelieferte Stand; Eingabewege während der Abwesenheit | siehe Abschnitt 5 |
| `walkthrough2.js` | Kapitel 2 komplett | durchgelaufen, keine JS-Fehler |
| `k2tests.js` | Kapitel 2: direkter Start im Hauptmenü, Übergang aus Split, Spielstände, Hinweise | 32 bestanden, 0 fehlgeschlagen |
| `devicetest.js` | Querformat, Drehung im Hochformat, Touch, Zoom, Service-Worker-Update, offline, Bildzeit | 27 bestanden, 0 fehlgeschlagen |
| Bilder | Bildschirmfotos der neuen Szenen angesehen: Sanja gegenüber, Mala auf dem Stuhl gegenüber, Zettel, Morgenlicht, Riva in der Dämmerung | in Ordnung; Zettel nach dem ersten Blick deutlicher gezeichnet |

**Nicht getestet:**
- **Kein echtes iPad:** Die Touch-Prüfungen sind Desktop-Chromium mit Touch-Emulation.
- **Keine Erstspieler-Tests:** Die Zeitangaben unten sind Messungen des automatischen Durchlaufs plus Schätzung.
- **Keine Option „reduzierte Effekte“:** Das Spiel hat diese Einstellung nicht. Die Anfälle tragen keine Information, die nicht auch im Text steht.

## 4. Zeit (gemessen und geschätzt)

Die Spieluhr misst im Durchlauf den kürzesten Weg: Dialoge in normaler Geschwindigkeit, Dokumente sofort geschlossen, kein Erkunden.

| Abschnitt | gemessen | geschätzt für Erstspieler |
|---|---|---|
| Spielstart bis zur Erscheinung an der Kirchentreppe | 12,0 min | 17–22 min |
| Kennenlernen in der Wohnung | 3,6 min | 5–8 min |
| Rückkehr durch das Tor, Bank, Heimweg, Aufwachen | 1,8 min | 2–3 min |
| Donnerstagmorgen allein bis zum Betreten der „Bura“ (mit Glas, Mails, Notizbuch, Mole) | 2,3 min | 4–6 min |
| Bura bis Malas Wiederkehr | ca. 1,2 min | 1–2 min |
| Zettel, Sanja, Bank am Morgen bis Fall 2 | 4,3 min | 6–9 min |
| ganzes Kapitel 1 auf dem kürzesten Weg | 83,0 min (vorher 64,8 min) | – |

## 5. Ergebnisse der letzten Läufe (endgültiger Stand, alles in einem Durchgang)

| Lauf | Ergebnis |
|---|---|
| `walkthrough.js` Deutsch | 61 Schritte bis zum Abspann, alle Erwartungen erfüllt, keine JS-Fehler |
| `walkthrough.js` mit `MALA_LANG=bhs` | 61 Schritte bis zum Abspann; 0 angezeigte Texte auf Deutsch, 0 Texte außerhalb des Bildes, keine JS-Fehler; Transkript mit 1.081 Sätzen |
| `einstiegtests.js` | 39 bestanden, 0 Fehler, keine JS-Fehler |
| `walkthrough2.js` | Kapitel 2 bis zum Abspann, keine JS-Fehler |
| `k2tests.js` | 32 bestanden, 0 fehlgeschlagen |
| `devicetest.js` | 27 bestanden, 0 fehlgeschlagen |
| `i18n_check.js` (statisch) | 3.440 sichtbare Texte, 0 ohne Übersetzung |

**Während der Tests gefunden und behoben:**
- Der Wechselknopf war während Malas Abwesenheit zwar unsichtbar, die Tippfläche reagierte aber. Ein Tippen bewirkte nichts; jetzt ist auch die Fläche weg.
- Malas Gruß „Morgen.“ war in der Sprachfassung gleichlautend mit „Morgen.“ (= morgen) in Sustipan. Er heißt jetzt „Morgen, Marko.“.
- Die dritte Antwort nach Triest war nur durch Blättern sichtbar. Alle drei sind gekürzt.
- Die gesprochene Antwort einer Auswahl konnte nach langer Bedenkzeit in der anderen Sprachform erscheinen als im Menü. Jetzt gilt der Angesprochene vom Öffnen der Auswahl.
- Zeitung und Kartenspiel in der „Bura“ waren nicht für jede Tageszeit gezeichnet.
- Der Zettel hinter dem Tresen war zu blass.

## 6. Offene Punkte

- Die Schätzungen der Spielzeit sollten mit echten Erstspielern überprüft werden.
- Die bosnisch-kroatische Fassung der neuen Texte stammt wie die bisherige von KI-Übersetzern. Sie ist vollständig und automatisch geprüft; Gegenlesen durch Muttersprachler ist trotzdem empfehlenswert. Die unsicheren Wörter stehen in `SPRACHFASSUNG_BHS.md`.
- Einige kurze Sätze aus den neuen Szenen kommen auch in Kapitel 2 vor. In der BHS-Fassung erscheinen sie dort übersetzt, obwohl Kapitel 2 sonst deutsch ist.
- Das Videoskript `game/tools/video_fall1.js` ist auf den neuen Ablauf umgestellt, aber nicht erneut aufgenommen. Das Video vom ersten Fall zeigt noch den alten Mittwochabend.
- Malas Abwesenheit hat keine eigene Tonspur. Die Stille entsteht durch die Musik der Räume am Morgen und durch das Fehlen ihrer Reaktionen auf Glocken und Fähren.
