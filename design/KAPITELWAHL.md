# Kapitelwahl: zwei Entwürfe (9. November 2026)

Klickbarer Entwurf mit echten Szenenbildern: `design/prototype/kapitelwahl/index.html` (gebaut aus `src.html` mit `node design/tools/buildkapitel.js`; die Bilder erzeugt `node design/tools/kapitelshots.js` aus dem Spiel). Dieselbe Seite ist als Zeichenfläche veröffentlicht: https://claude.ai/artifact/NVno9NE2dKFzk1RKX8oQSM (privat).

## 1. Ist-Zustand und Befund

Die Kapitelwahl ist heute ein `panel` der HTML-Schicht (`07_shell.js`, `SCR.chapters`): Titel, eine Kontextzeile, fünf Menüzeilen mit Unterzeile, ein Hinweis, „Zurück“.

| Befund | Wirkung |
|---|---|
| Nur Text, fünf gleichförmige Zeilen | Die Orte, um die es geht, sind unsichtbar; nichts lädt zum Antippen ein. |
| Schmaler Rahmen (`u·190px`, auf dem Telefon 380 von 844 px) | wirkt wie ein Dialog einer Werkzeugoberfläche, nicht wie ein Teil des Spiels. |
| „Quereinstieg mit Standardantworten“ dreimal, unerklärt | Die wichtigste Folge der Wahl steht im Kleingedruckten. |
| „Alle drei Plätze sind belegt: Du wählst gleich, welcher überschrieben wird.“ | spricht über Speichertechnik, bevor man gewählt hat; die Grenze drei soll weg (Abschnitt 4). |

## 2. Entwurf A · „Die Reise“

Fünf Bildkarten in einer Reihe, verbunden durch eine Linie mit Stationen (Split, Sarajevo, Mostar, München, Sarajevo). Die Reihe sagt, dass die Kapitel aufeinander folgen.

- **Karte:** Szenenbild des Orts (Riva, Sahat-kula, Alte Brücke, Gleis 11, Alipašino Polje), Nummer oben links, Ortsname unten. Gespielte Kapitel tragen ✓, das zuletzt gespielte ▸. Nicht gewählte Karten sind leicht abgedunkelt, die gewählte leuchtet im Lampenton und liegt einen Punkt höher.
- **Darunter:** „Kapitel 2 · Sarajevo“, Prologtitel und Datum im Spiel, eine Stimmungszeile (Desktop und Tablet), die Chips „zuletzt hier“, „Spielstand · gestern 21:14“, und als Satz die Folge der Wahl: „Übernimmt dein Ende von Kapitel 1.“ oder „Quereinstieg: Standardantworten für Kapitel 1–2.“
- **Handlung:** gefüllter Knopf „Kapitel beginnen“. Gibt es im Kapitel einen Spielstand, wird „Fortsetzen“ der gefüllte Knopf und „Neu beginnen“ steht daneben.
- **Fußzeile:** „Beginnt als neues Spiel (Nr. 5) · deine 4 Spiele bleiben.“ bzw. „‚Neu beginnen‘ legt Spiel 5 an …“.
- **Tastatur:** ← → wählen, Enter startet, Esc zurück.
- **Maße:** Panel `100 % − 32 px` breit; Telefon quer (844 × 390, Einheit 2) ohne Scrollen, Panel 299 px hoch; Desktop (1280 × 800, Einheit 3) mit Stimmungszeile.
- **Grenze:** sechs Karten gehen noch, danach müsste die Reihe scrollen.

## 3. Entwurf B · „Das Fahrkartenheft“

Links ein Heft mit fünf Fahrkarten (eine je Kapitel), rechts die große Vorschau des gewählten Orts. Fahrkarten ziehen sich durch das ganze Spiel (Alijas Fahrscheine mit dem Sternloch, die Linie Drei, die Busfahrkarten); eine Karte ziehen heißt, dorthin zu fahren.

- **Fahrkarte:** gestrichelte Abrisskante links, große Nummer, Ortsname, eine Zeile Stand („gespielt“, „Spielstand · gestern 21:14“, „noch nicht“). Gespielte Kapitel tragen den Stempel GESPIELT (Siegelrot, leicht gedreht), das zuletzt gespielte ▸. Die gezogene Karte liegt hell (Papier) auf dem Stapel und rückt zwei Punkte nach rechts.
- **Vorschau:** Szenenbild mit Kapitel, Ort und Prologtitel im Bild; darunter Datum, der Satz zur Übernahme, der Spielstand mit Ort, Zeit und Spieldauer, die Fußzeile; unten rechts die Knöpfe wie in A.
- **Tastatur:** ↑ ↓ wählen, Enter startet, Esc zurück.
- **Maße:** Liste 34 % (Telefon) bzw. 30 % der Breite; Bild 320 : 104 auf dem Telefon, 320 : 144 sonst; Telefon quer ohne Scrollen, Panel 368 px hoch.
- **Grenze:** nur ein Bild zur Zeit; die Reihenfolge der Reise ist weniger sichtbar als in A. Dafür wächst die Liste nach unten, wenn Kapitel dazukommen.

## 4. Mehr als drei Spielstände

Heute: drei Plätze (`SLOTS=3` in `05_engine.js`), je ein automatischer Stand und drei Lesezeichen (`MARKS=3`), dazu „Vor dem Samstag“ in Kapitel 5. Ein viertes Spiel verlangt, einen Platz zu überschreiben; die Kapitelwahl kündigt das an, bevor man gewählt hat.

Beide Entwürfe setzen ein anderes Modell voraus:

1. **Ein Kapitelstart ist immer ein neues Spiel.** Es bekommt die nächste freie Nummer („Spiel 5“); die bisherigen bleiben. Keine Platzwahl (`SCR.slots`), keine Überschreiben-Frage, kein `withSlot('new', …)`.
2. **Spiele statt Plätze.** „Spiel laden“ zeigt alle Spiele, das neueste oben, jedes mit automatischem Stand und Lesezeichen (Kapitel, Ort, Zeit, Bild). Löschen gibt es nur dort. Die Gruppenüberschrift heißt „Spiel 5 · Kapitel 3 · Mostar“ statt „Platz 1“.
3. **Grenze nur durch den Speicher.** Ein Spiel braucht mit Bildern etwa 100 bis 200 KB, der Browser gibt rund 5 MB. Ab etwa zwanzig Spielen warnt „Spiel laden“ einmal („Speicher fast voll“); die Kapitelwahl bietet dann an, das älteste Spiel ohne Lesezeichen zu löschen, und spricht vorher nie vom Speicher. Schlägt ein Speichern wegen `QuotaExceededError` fehl, gilt weiter die heutige Meldung.
4. **Fortsetzen pro Kapitel.** Die Kapitelwahl zeigt am Kapitel den neuesten spielbaren Stand aus diesem Kapitel (`meta.chapter`) und bietet „Fortsetzen“ an. Gibt es mehrere, führt ein Tipp auf die Spielstandzeile zu „Spiel laden“, gefiltert auf das Kapitel.

Technisch: `SLOTS` wird zur Obergrenze (z. B. 24), die Plätze werden nicht mehr vorab nummeriert, sondern `firstFree()` liefert die nächste unbelegte Nummer; `E.hasSave`, `slotStates`, `latest`, `anyState`, Export/Import und `savecompat` laufen über die tatsächlich belegten Nummern (Schlüssel `mala.save.N`, `mala.mark.N.K` bleiben). Alte Stände mit den Nummern 1–3 bleiben gültig.

## 5. Vergleich und Empfehlung

| Kriterium | A · Die Reise | B · Das Fahrkartenheft |
|---|---|---|
| Erster Eindruck | fünf Orte als Bilder, die Reise sichtbar | ein großes Bild, eine Liste; ruhiger, mehr Text |
| Telefon quer | passt ohne Scrollen, Karten 150 px | passt ohne Scrollen, Vorschau 58 % |
| Hochformat | das Spiel dreht ins Querformat; keine eigene Fassung nötig | ebenso |
| Mehr Kapitel später | bis sechs Karten | Liste wächst nach unten |
| Information vor dem Start | Titel, Datum, Übernahme, Spielstand | dazu Stimmungszeile und Spielstand mit Dauer |
| Aufwand | neues Layout `chapters` in `07_shell.js`, fünf Szenenbilder beim Bau (`game/build.js` bettet sie wie die Schriften ein, je ~45 KB PNG), etwa 180 Zeilen | gleich; die Fahrkarte ist ein Stil der bestehenden Menüeinträge |
| Übersetzung | etwa zwölf neue Sätze (BHS); Ortsnamen bleiben | ebenso |
| Prüfung | `qa/ui/phase2.js` (Kapitelwahl), `savecompat.js`, `k2tests` (Titelmenü), Simulation startet weiter über `M.shell.pick('Kapitel 2')` | ebenso |

**Empfehlung:** A für das Spiel, B als Rückfalloption, falls eine sechste Station dazukommt. Unabhängig davon zuerst „Spiele statt Plätze“ (Abschnitt 4) bauen: Es erledigt den Satz über die belegten Plätze und ändert „Spiel laden“ mit.

## 6. Was in beiden Entwürfen gleich ist

- Panelbreite `100 % − 32 px` statt `u·190px`; Titel 1,6 Einheiten statt 2.
- Dieselben Zustände: gespielt (✓ / Stempel), zuletzt hier (▸), Spielstand, Übernahme in einem Satz; „bisher nur auf Deutsch“ bleibt als Chip, wenn die Sprache nicht Deutsch ist.
- Gefüllter Hauptknopf (Lampenton auf Tinte), Nebenknopf wie bisher umrandet; Mindesthöhe 44 px.
- Kapitelsperre (`M.chapterLock`, nur Tests): gesperrte Karten erscheinen abgedunkelt mit Schloss und „nach Kapitel N“ statt der Knöpfe.
- Die Stimmungszeilen sind Vorschläge ohne Lösungswissen: „Ein Nachruf auf eine Frau, die jeden Abend an der Mole stand.“ / „Drei Fälle in der Altstadt. Und ein Fahrschein für später.“ / „Eine Spur, die hinter den Rand des Stadtplans führt.“ / „Weihnachten bei Mama. An Gleis 11 wartet einer.“ / „Zurück nach Haus 7. Der letzte Samstag mit der Drei.“
