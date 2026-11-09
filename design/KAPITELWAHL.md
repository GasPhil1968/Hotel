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

## 7. Umsetzung (9. November 2026): Entwurf A und „Spiele statt Plätze“

Entscheidung des Autors: Entwurf A. Umgesetzt im Spiel (Build `web/index.html`):

- **Bildschirm** `SCR.chapters` in `game/src/07_shell.js` (Layout `chapters`): fünf Karten (`.chcard`, `role="option"`, `aria-selected`), Linie mit Stationen (`.route`), Detail (`.chdetail`: Titel, Prologtitel und Datum aus `CHAP`, Stimmungszeile außer auf dem Telefon, Marken „schon gespielt“, „zuletzt hier“, „Spielstand · Zeit“, Übernahme-Satz, „bisher nur auf Deutsch“), Knöpfe „Kapitel beginnen“ bzw. „Fortsetzen“ (gefüllt) und „Neu beginnen“, Fußzeile. Eine Karte antippen wählt sie; die gewählte Karte noch einmal antippen beginnt. Tastatur: ← → wählen, ↑ ↓ wandern durch alle Knöpfe, Enter tippt an, Esc zurück. Die Auswahl steht in `top().p.sel`; voreingestellt ist das zuletzt gespielte Kapitel, sonst das nächste ungespielte.
- **Gesperrte Kapitel** (`M.chapterLock()`, nur Tests): Karte abgedunkelt mit Schloss, im Detail „nach Kapitel N“ statt der Knöpfe; ein zweiter Tipp meldet den Grund.
- **Szenenbilder** `game/art/kapitel/k1–k5.png` (320 × 144, indiziert, 9–14 KB), erzeugt von `node design/tools/kapitelart.js` aus `M.sceneSnap()` (Riva c1, Sahat-kula k2_s1, Alte Brücke k3_d1, Gleis 11 k4_d1, Alipašino Polje k5_pro); `game/build.js` bettet sie als `M.CHAPTER_ART` ein (+65 KB im Build).
- **Spiele statt Plätze** (Abschnitt 4): `SLOTS=24` ist nur noch die Obergrenze (`05_engine.js`); `E.usedSlots()` liest die belegten Nummern aus den Schlüsseln `mala.save.N` und `mala.mark.N.*`, `E.freeSlot()` die nächste freie. `newGame(ch)` startet ohne Platzwahl (`SCR.slots` und `withSlot` sind weg); Beispielstände ebenso. Ist die Obergrenze erreicht, fragt eine Bestätigung, ob das älteste Spiel ohne Lesezeichen gelöscht wird („Löschen und beginnen“). „Spiel laden“ listet alle Spiele nach dem jüngsten Stand, Überschrift „Spiel N · Kapitel c · Ort“; ab 20 Spielen der Hinweis „Speicher fast voll“. Pause: „Andere Spiele …“; Meldung „Gespeichert – Spiel N“. Alte Stände 1–3 bleiben gültig. `SH.legacyPick('Platz N')` der QA-Werkzeuge startet weiter auf der genannten Nummer.
- **Übersetzung** (`lang/bhs_ui.js`): 25 Sätze und Muster (Prologtitel, Daten, Stimmungszeilen, Übernahme, Fußzeile, Meldungen).
- **Prüfung:** `qa/ui/phase2.js` (90 Prüfungen, davon neu: Karten, Auswahl, Pfeiltasten, Fortsetzen, Sperre, neues Spiel ohne Rückfrage, Obergrenze mit Rückfrage, Reihenfolge in „Spiel laden“), `phase4.js` (92), `savecompat.js` (33), `qa/regress/run.js` (22); `qa/browser/scenarios.js` und `uirun.js` tippen nach der Karte auf „… beginnen“.
- **Maße:** Desktop 1280 × 800: Panel 1248 × 450; Telefon quer 844 × 390: 812 × 297 ohne Scrollen; mit „Lesbar/groß“ auf dem Telefon scrollt der Inhalt unter der Kopfzeile.

