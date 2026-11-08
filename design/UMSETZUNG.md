# MALA – Umsetzung des UI-Konzepts

Stand 8. November 2026. Grundlage: `design/UI_KONZEPT.md` (Abschnitte D und E, Abnahme F) mit den sechs Entscheidungen des Autors. Umgesetzt sind alle vier Phasen, auch die optionale Phase 4. Jede Phase hat einen eigenen Commit und ein eigenes spielbares ZIP bekommen (`dist/MALA_netlify_oberflaeche.zip`, gebaut mit `design/tools/package_ui.sh`). Das QA-ZIP `dist/MALA_netlify_korrigiert.zip` (Fassung 5ddc4f3c) bleibt unverändert.

| Phase | Inhalt | Commit | Eigener Browser-Test |
|---|---|---|---|
| 1 | Bedienfehler und Lesbarkeit im bestehenden Canvas | `9d5b18a` | `qa/ui/phase1.js` |
| 2 | HTML-Schicht für Titel und Menüs, Spielstand-Modell, Kapitelsperre, Einstellungen, eingebettete Schriften | `3a68dc5` | `qa/ui/phase2.js` |
| 3 | Breitbild-Leiste für Telefone quer | `22363ba` | `qa/ui/phase3.js`, `qa/ui/hudcmp.js` |
| 4 | Untertitelschicht, Sicherung als Datei, „Zuletzt“-Karte, Schnellvorlauf, Namen für Lesezeichen; dazu Nachträge zu D2, D3, D8 und D17 | dieser Stand | `qa/ui/phase4.js` |

Alle Tests laufen in Playwright-Emulationen (Chromium, WebKit, Firefox) und in der Node-VM der QA-Werkzeuge. Echte Telefone und Tablets standen nicht zur Verfügung.

---

## Phase 1 – Bedienfehler und Lesbarkeit (Canvas)

- **Esc:** Esc schließt immer nur die oberste Ebene, in dieser Reihenfolge: Ziehen, Overlay, Pause, Verb-Menü, gewählter Gegenstand. Erst wenn nichts mehr offen ist, öffnet Esc die Pause. Im Titel führt Esc eine Ebene zurück.
- **Karten, Abspann, Ton:** Kapitelkarten und Abspann lassen sich per Leertaste, Enter und Esc überspringen. Auch Tasten geben den Ton frei.
- **Antwortlisten:**
  - Ziffern 1–9 wählen eine sichtbare Zeile, dazu ↑/↓ mit Enter und das Mausrad.
  - Bei Touch drei Zeilen à 15 Spielpixel, darunter „+N“ für die weiteren Antworten.
  - Gewählte Zeilen haben einen Kontrast von mindestens 4,5:1.
- **Rechtsklick:** hebt die Auswahl auf bzw. heißt „Schau an“.
- **Verb-Menü bei Touch:** 15-px-Zeilen, mindestens 12 px neben dem Tippunkt.
- **Figurenknopf:** „↔ Mala“ / „↔ Marko“; ohne Mala zeigt er Markos eigenes Porträt.
- **Zeigen:** beschriftet nur Ausgänge und Personen.
- **Inventar:** Pfeile 16 px breit; die Neu-Markierung endet beim ersten Ansehen.
- **Lesbarkeit:**
  - Gesperrte Knöpfe gestrichelt und lesbar.
  - Rätsel und Notizbuch in Tinte statt Grau, größere Schließen- und Vorlesen-Flächen.
  - Briefe als Fließtext ohne Waisen, Kapitelkarten zweizeilig umbrochen.
- **Meldungen:**
  - Eine Meldung bei offenem Menü steht in der Kopfzeile.
  - Die Offline-Marke liegt klein oben rechts.
- **Titel:** Die Unterzeile wächst mit den erreichten Kapiteln („Split · Sarajevo …“).
- **Leiste:** Während längerer Szenen ruht sie eine Stufe dunkler.
- **Hochformat:** einmaliger Hinweis mit „Gedreht weiterspielen“.
- **Spielzeit:** steht still im Notizbuch, auf der Karte und in Dokumenten.

## Phase 2 – HTML-Schicht und Spielstand-Modell

- **`07_shell.js`:** HTML-Schicht über dem Canvas für Titel, Kapitelwahl, Laden, Speichern, Einstellungen, Über MALA, Steuerung, Pause, Bestätigungen und die Karte am Kapitelende.
  - Tastatur, Fokus zurück auf den auslösenden Eintrag, Zurück-Taste des Geräts.
  - Tippflächen mindestens 44 CSS-px.
  - Das Modell läuft auch ohne DOM, also in der QA-VM.
- **Spielstände:**
  - Je Platz ein automatischer Stand und drei Lesezeichen, jeweils mit Vorschaubild, Ort, Datum und Spielzeit.
  - Kapitelende-Stand statt Löschen.
  - Versionsprüfung mit den Zuständen „beschädigt“ und „inkompatibel“.
  - Vor dem Laden wird gesichert, danach 10 s „Rückgängig“; bei Ladefehlern bleibt das laufende Spiel erhalten.
  - Getrennte Fehlertexte.
- **Kapitelsperre (Entscheidung):**
  - Kapitel N wird erst nach `mala.c(N−1)end` frei; für die Beispielstände gilt dasselbe.
  - Kapitel 5 erscheint mit Ort erst nach `c4end`.
  - Laden ist nie gesperrt.
  - Testschalter `?kapitel=alle`.
- **Einstellungen:**
  - Lautstärke getrennt für Musik, Geräusche und Umgebung.
  - Tempo und „Weiter erst nach Tippen“.
  - Textgröße und Schrift (Pixel/Lesbar), Bewegung reduzieren, Röhrenbild, Vollbild.
  - Notizbuch-Ansicht, Sprache (beim ersten Start aus der Browsersprache).
- **Schriften:** MALA Pixel und Atkinson Hyperlegible Next sind eingebettet und funktionieren offline.
- **Musik, Titelbild, Abspann:**
  - Die Pause dämpft die Musik; aus der Titelmusik gibt es einen weichen Übergang.
  - Das Meer im Titelbild reicht bis zum Rand.
  - Im Abspann erscheint „Überspringen ▸“; der Abspann beendeter Kapitel liegt unter „Über MALA“.

## Phase 3 – Breitbild-Leiste

Regel aus D17: Breitbild gilt, wenn `320(n+1) + 66n ≤ Breite` und die Leistenhöhe innerhalb der sicheren Zone in die Höhe passt.

- **Aufbau:** Die Szene liegt dann eine Maßstabsstufe größer auf `#game` (320 × 144). Die Leiste hat einen eigenen Puffer auf `#hud`: links Figur und Notizen, rechts Menü, Karte und Zeigen, darunter Name und Inventar.
- **Gespräche:** Der Antwortkasten liegt über dem unteren Szenendrittel.
- **Zurück ins 320 × 200-Bild:** Overlays, Karten, Abspann und Titel.
- **Gewohnte Leiste:** Auf Desktop und Tablet bleibt sie pixelgleich (`hudcmp.js`).

## Phase 4 – optionale Erweiterungen (B3)

| Nr. | Erweiterung | Umsetzung |
|---|---|---|
| B3-2 | **Untertitelschicht** | `07_subs.js`. Bei „Schrift: Lesbar“ oder „Textgröße: groß“ stehen Sätze und Antwortlisten der Gespräche als HTML unten im Bild, mit dem Namen der Figur davor. Der Canvas zeichnet weiter Szene und Brustbilder; was er sonst geschrieben hätte, meldet er pro Bild (`M.subsFrame`). Texte und Übersetzung sind dieselben wie im Canvas (`M.dlgView`). Klick, Ziffern, ↑/↓/Enter und Tippen ins Bild bedienen die Schicht wie die Canvas-Liste. Sie funktioniert im gewohnten Bild, im Breitbild und im gedrehten Hochformat. In der Pause ist sie ausgeblendet. |
| B3-3 | **Sicherung als Datei** | „Spiel laden“ → „Sicherung exportieren …“ schreibt alle `mala.*`-Einträge (Stände, Lesezeichen, Kapitelmarken, Einstellungen) als JSON: Format 1, Datum, Anzahl, FNV-Prüfsumme. „Sicherung importieren …“ prüft Format und Prüfsumme und fragt nach; erst dann ersetzt sie alles. Importieren geht nur vom Titelbild aus. Es gibt kein Cloud-Versprechen. Vorschaubilder werden nur als PNG-data-URI übernommen. |
| B3-4 | **„Zuletzt“-Karte** | Nach dem Laden vom Titelbild aus: Kapitel, Ort und die drei zuletzt notierten offenen Notizen im Wortlaut des Notizbuchs. Sie blockiert keine Eingabe; ein Tipp oder eine Taste schließt sie, sonst verschwindet sie nach 9 s. |
| B3-5 / D2 | **Schnellvorlauf** | Esc gedrückt halten (≥ 350 ms), während eine Szene läuft. Sätze enden dann sofort, Wartezeiten, Wege und Blenden laufen zehnmal so schnell. Es ist derselbe Ablauf mit allen Flags und Speicherpunkten, kein Sprung. Oben rechts steht „▸▸“. Die Spielzeit im Spielstand zählt weiter als Echtzeit. Kurz gedrückt öffnet Esc wie gewohnt die Pause; während einer Szene geschieht das beim Loslassen. Bei offener Auswahl und ohne laufende Szene verhält sich Esc wie bisher. Fokusverlust beendet den Vorlauf. |
| B3-6 | **Namen für Lesezeichen** | „Benennen …“ unter jedem Lesezeichen, höchstens 24 Zeichen. Enter speichert, Esc oder ein Tipp neben das Fenster bricht ab. Leer gelassen steht wieder der Ort da. Wer das Lesezeichen überschreibt, setzt den Namen zurück. |
| B3-6 | **Abspann beendeter Kapitel** | schon in Phase 2 („Über MALA“ → „Abspann Kapitel N“), in Phase 4 mit getestet |

**Nachträge zu Phase 1–3**, beim Abgleich mit dem Konzept gefunden und in diesem Stand umgesetzt:
- **D17:** Der Wechsel zwischen Breitbild und gewohntem Bild blendet in 150 ms aus dem Dunkel auf; bei „Bewegung reduzieren“ entfällt das.
- **D8:** Ein Tipp neben eine Rückfrage oder neben das Namensfeld bricht ab.
- **D3:** Das Erinnerungsbild am Kapitelanfang zeigt seinen Titel in der Schriftgröße der Kapitelkarte (×2). Das betrifft die Busfahrten zu Beginn von Kapitel 2–4.
- **Menüschicht:** Ein Klick führt immer den Eintrag aus, der zu sehen war, auch wenn sich Spielstände inzwischen geändert haben. Vorher wurde die Liste beim Klick neu berechnet; ein Eintrag konnte so auf eine andere Aktion verrutschen (gefunden durch `phase4.js`).

Bosnisch/Kroatisch: Alle neuen Texte sind übersetzt, Zahlen mit Form (1 unos, 3 unosa, 21 unos). `web/LIESMICH.txt` beschreibt alle neuen Funktionen.

---

## Abnahme F1–F25

„geprüft“ heißt: Ein automatischer Test auf diesem Stand prüft die Erwartung. „Teilweise“ nennt, was davon nicht automatisch geprüft ist.

| Nr. | Stand | Nachweis |
|---|---|---|
| F1 Erststart | geprüft | `phase2`: kein „Fortsetzen“, Fokus auf „Neues Spiel“, Unterzeile „Split“ |
| F2 Neues Spiel, Plätze frei | geprüft | `phase2`: startet auf Platz 2 ohne Rückfrage, Platz 1 unverändert |
| F3 alle Plätze belegt | geprüft | `phase2`: Platzwahl, Bestätigung mit Fokus auf „Abbrechen“, Esc bricht ab |
| F4 Fortsetzen | geprüft | `phase2` (lädt mit einem Tipp); Kampagne D: Zustand nach Speichern/Laden ohne Abweichung |
| F5 Kapitelende-Stand | geprüft | `phase2`: Weiter-Karte, Kapitel und Spielzeit, nächstes Kapitel auf demselben Platz |
| F6 Lesezeichen | geprüft | `phase2`: zehn automatische Speicherungen danach, Lesezeichen unverändert |
| F7 Speicher voll | geprüft | `phase2`: eigene Meldung, nichts geschrieben |
| F8 beschädigt/inkompatibel | geprüft | `phase2`: beschriftet, nicht ladbar, löschbar |
| F9 Laden mit Fehler, Rückgängig | geprüft | `phase2`; `phase4` (Laden im Spiel: „Rückgängig“-Meldung) |
| F10 Intro | teilweise | `phase1`: Kapitelkarte per Enter übersprungen. Der Zustandsvergleich „Intro vollständig gegen übersprungen“ ist nicht als eigener Test vorhanden. |
| F11 Rückkehr, Fokus | geprüft | `phase2` (Kapitelwahl), `phase4` (Fokus zurück auf „Benennen …“), Szenarien |
| F12 Menüs oft öffnen | teilweise | `phase2`: 25× öffnen/schließen ohne wachsende Knoten (Konzept: 50×) |
| F13 Esc-Stapel | geprüft | `phase1`: Verb-Menü, Gegenstandswahl, Notizbuch, Pause; `phase4`: Esc halten nur bei laufender Szene ohne offene Ebene |
| F14 Figurenwechsel | geprüft | `phase1` (Knopf „↔ Name“ mit Mala), `phase3` im Breitbild |
| F15 Tippflächen | teilweise | Geprüft: HTML-Schicht ≥ 44 CSS-px (`phase2`, `phase4`), Antwortzeilen, Verb-Menü, Hochformat-Knopf (`phase1`), Pfeile ≥ 24 CSS-px (`phase3`). Die Gesamtvermessung mit `geometry.js` wurde nach der Umsetzung nicht wiederholt. |
| F16 lange Texte, große Schrift | teilweise | `phase2`: Menüs bei „groß“ ohne Abschneiden; `phase4`: Untertitel und Listen bleiben im Bild. Längste Antwort, Kapitelkarte und Ortsname sind nicht einzeln geprüft. |
| F17 Kontraste | nicht erneut gemessen | Die Farben stammen aus den in der Analyse gemessenen Paarungen (Phase 1). Nach der Umsetzung gab es keine automatische Kontrastmessung. |
| F18 Hochformat | geprüft | `phase1`, Szenario W11, `phase4` (Untertitel im gedrehten Bild) |
| F19 Offline | geprüft | Szenario C12 (Service Worker, Neustart ohne Netz); Schriften als data-URI (`phase2`) |
| F20 Kapitelsperre | geprüft | `phase2`: leer, nach c1end, ohne Marken, `?kapitel=alle`, Kapitel 5 nach c4end |
| F21 Leseschrift | geprüft | `phase2`: Menüs in Atkinson, Überschriften in MALA Pixel; `phase4`: Gespräche in Atkinson. `fontcheck.js` lief bei der Entscheidung (`evidence/fontcheck.txt`). |
| F22 Breitbild: Auswahl | geprüft | `phase3` (iPhone 13 quer: Szene 640 × 288); `hudcmp.js`: gewohnte Leiste pixelgleich auf Desktop und Tablet |
| F23 Breitbild: Bedienung | geprüft | `phase3`: Figur, Notizen, Menü, Karte, Zeigen, Inventar, „Benutze … mit“, Knöpfe ≥ 44 und Pfeile ≥ 24 CSS-px |
| F24 Breitbild: Wechsel | teilweise | `phase3`: Gespräch, Notizbuch, Karte und Pause hin und zurück, `GS` unverändert; `phase4`: Überblendung. Dokument und Rätsel sind nicht einzeln geprüft. |
| F25 Breitbild: Drehung, Größe | geprüft (Emulation) | `phase3`: Fenstergröße mitten im Gespräch und mit gewähltem Gegenstand. Safe-Area-Ränder lassen sich nur auf echtem Gerät prüfen. |

## Abweichungen vom Konzept

1. **Seitenpunkte im Inventar bleiben Anzeige (D9: „tippbar“).** Unter dem Inventar sind nur zwei bis drei Spielpixel frei. Als Tippfläche wären die Punkte kleiner als die geforderten 24 CSS-px (F15), und eine größere Fläche würde in die Inventarfelder ragen. Blättern geht mit den vergrößerten Pfeilen, durch Wischen und mit dem Mausrad.
2. **Breitbild nur im echten Querformat.** Im gedrehten Hochformat („Gedreht weiterspielen“) bleibt das gewohnte 320 × 200-Bild, denn die Rechnung für die sichere Zone gilt dort nicht.
3. **Schnellvorlauf für jede laufende Szene.** Das Konzept sagt „für gesehene Szenen“. Szenen haben im Code keine Kennung, an der sich „gesehen“ festmachen ließe; der Spieler entscheidet durch Halten. Läuft eine Szene, öffnet ein kurzes Esc die Pause erst beim Loslassen, damit Halten und Tippen unterscheidbar sind.
4. **„Zuletzt“-Karte bei jedem Laden vom Titelbild** („Fortsetzen“ und „Spiel laden“), nicht nur bei „Fortsetzen“. Sie zeigt offene Notizen des laufenden Falls, keine Schlüsse aus abgeschlossenen Fällen.
5. **Untertitel unten im Bild statt neben dem Brustbild.** Die Brustbilder bleiben oben im Canvas; der Name steht vor dem Satz. Sätze, die während eines Overlays fallen (Notizbuch, Briefe, Rätsel), bleiben im Canvas in Pixelschrift, weil diese Seiten ganz auf 320 × 200 gezeichnet sind.
6. **Überblendung als kurzes Aufblenden des neuen Bildes aus dem Dunkel**, keine Mischung zweier Bilder. Der Grund hinter dem Spielbild ist ohnehin dunkel.

## Nur auf echten Geräten prüfbar

- Safari/iOS-Eigenheiten bei Vollbild, Ausrichtung und Audio.
- Safe-Area-Ränder der Breitbild-Leiste.
- Hörbild der Musikdämpfung.
- Bildschirmleser mit der HTML-Schicht: Knöpfe mit Beschriftung, `aria-live` für Meldungen und Untertitel.
- Herunterladen und Auswählen von Dateien auf iOS.

## Tests dieses Standes

Ausgeführt auf diesem Stand (`web/index.html` wie im ZIP, nacheinander in einem Lauf):

| Test | Ergebnis |
|---|---|
| `qa/ui/phase1.js` | 33/33 |
| `qa/ui/phase2.js` | 64/64 |
| `qa/ui/phase3.js` | 26/26 |
| `qa/ui/phase4.js` | 92/92 (Schnellvorlauf: Spielzeit ×10,0, Spielstand-Uhr 1,00 ms je ms, 8 Sätze in 471 ms) |
| `qa/ui/hudcmp.js` gegen Phase 3 | 8/8 gleich (gewohnte Leiste, Desktop und Tablet, vier Spielstände) |
| `qa/regress/run.js` | 9/9 |
| Browser-Szenarien Chromium, WebKit, Firefox | läuft noch (Ergebnis folgt im nächsten Commit) |
| Simulationskampagne (Node-VM, A–E, 2 Worker) | läuft noch (Ergebnis folgt im nächsten Commit) |
