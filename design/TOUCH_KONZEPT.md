# MALA auf iPhone und iPad: Touch-Steuerung und Oberfläche

> **Stand:** Der Umsetzungsplan E1–E7 ist inzwischen umgesetzt. Änderungen, Abnahme K1–K14 und Tests stehen in `design/TOUCH_UMSETZUNG.md`. Dieses Dokument beschreibt den Stand **vor** der Umsetzung (Commit `346bff6`).

**Untersuchter Stand**
- Branch `claude/gifted-keller-rsg4ye`, Commit `346bff6`.
- `web/index.html`, SHA-256 `4e41283c…`. Das ist dieselbe Datei wie im ZIP `dist/MALA_netlify_oberflaeche.zip`, also der Stand nach Phase 4.
- Ein anderes Archiv lag in dieser Sitzung nicht vor.
- Für diese Untersuchung wurde kein Spielcode geändert.
- Neu hinzugekommen sind nur Messwerkzeuge und Belege unter `design/touch/`.

**Kennzeichnung der Aussagen**

| Kürzel | Bedeutung |
|---|---|
| **[R]** | In der Emulation reproduziert: Playwright 1.63, WebKit bzw. Chromium unter Linux, Geräteprofile von Apple-Geräten, echte Touch-Ereignisse durch die Eingabekette des Spiels. |
| **[M]** | Gemessen, mit dem Spielcode selbst (Node-VM oder Browser). |
| **[C]** | Aus dem Code abgeleitet (`datei:zeile`, relativ zu `game/src/`). |
| **[D]** | Aus der Dokumentation zu iOS/iPadOS-Safari, nicht auf einem Gerät geprüft. Quellen sind die Kompatibilitätsdaten von MDN (BCD 8.1.8, Stand 2.11.2026) und WebKit-Bugs bzw. -Blog; die Fundstellen stehen in `design/touch/QUELLEN.md`. |
| **[O]** | Offen: nur auf einem echten Gerät prüfbar. |

Auf einem echten iPhone oder iPad wurde **nichts** getestet. Eine Emulation bildet keine Safe-Area-Ränder, keine Safari-Leisten, keine Systemgesten, keine Bildschirmtastatur und keinen Ton nach.

---

## Grundlage: Was im Spiel vorhanden ist und wie es funktioniert

**Inhalt**
- Kapitel 1 bis 4 sind enthalten: Split, Sarajevo, Mostar und München. Kapitel 5 ist nur angekündigt.
- Die Musterlösungen der QA besuchen 75 Räume. Darin hat das Messwerkzeug 315 verschiedene Raumzustände und 904 Hotspots erfasst: 663 Dinge, 127 Personen und 114 Ausgänge **[M]**.

**Bewegung und Spielwelt** (`06_ui.js:733–781` `click`, `05_engine.js:384–420` `doVerb0`)
- Ein Tipp auf freien Boden lässt die aktive Figur dorthin gehen. Ist die Stelle nicht begehbar, geht sie bis zum nächsten erreichbaren Punkt; eine Rückmeldung gibt es dabei nicht.
- Ein Tipp auf einen Hotspot hat je nach Hotspot unterschiedliche Folgen:
  - Hat er nur „Ansehen“, wird er sofort angesehen.
  - Ist er ein Ausgang, geht die Figur hin. Ein zweiter Tipp innerhalb von 350 ms überspringt den Rest des Weges.
  - Hat er mehrere Handlungen, öffnet sich das **Verb-Menü** neben dem Tippunkt (`06_ui.js:208–210`).
- Der Weg zum Ziel läuft, bevor die Szene beginnt. Ein neuer Tipp während des Weges verwirft die vorige Handlung, es gilt die letzte Eingabe (`actionTok`) **[C]**.
- Nach einem Ortswechsel nimmt das Spiel 350 ms lang keinen Tipp an (`E.sceneBlockUntil`, `05_engine.js:430`) **[C][R]**.

**Treffer** (`05_engine.js:349–354` `hotspotAt`)
- Jeder Hotspot ist ein Rechteck. Überlappen sich mehrere, gewinnt das mit der kleinsten Fläche, also bleibt ein kleines Ding auf einem großen erreichbar.
- Für den Finger gibt es keinen Toleranzbereich.
- Im Dunkeln zählen nur Hotspots im Lichtschein; das ist Spielmechanik.

**Tippen, Ziehen und Abbrechen** (`06_ui.js:715–731`)
- Ausgelöst wird beim Loslassen.
- Wandert der Finger in der Szene mehr als 10 Spielpixel, passiert beim Loslassen nichts. Das wirkt wie ein Abbruch.
- Während der Finger liegt, steht der Name des Objekts unter dem Finger in der Satzzeile der Leiste.

**Inventar**
- Ein Tipp öffnet ein Menü mit „Benutze“ und „Schau an“. „Benutze“ wählt den Gegenstand. Ein Tipp aufs Ziel wendet ihn an.
- Die Wahl lässt sich auf drei Wegen aufheben: ein zweiter Tipp auf den Gegenstand, ein Tipp auf freien Boden oder Esc bzw. Rechtsklick.
- Alternativ lässt sich ein Gegenstand aus der Leiste ins Bild **ziehen**.
- Seitliches Wischen in der Leiste blättert (Schwelle 22 Spielpixel); dazu kommen Pfeile und das Mausrad.

**Figurenwechsel**
- Der Wechsel geht über das Porträt „↔ Name“ oder die Tasten Tab und M.
- Während Szene, Gespräch oder Overlay ist er gesperrt (`05_engine.js:261` `canSwitch`).

**Gespräche**
- Ein Satz erscheint vollständig, eine Tipp-Animation gibt es nicht. Ein Tipp beendet den Satz frühestens 200 ms nach seinem Beginn.
- Der zweite Tipp eines Doppeltipps (350 ms) überspringt keinen weiteren Satz (`06_ui.js:748`).
- Die Antwortliste steht unten im Canvas, bei Touch mit drei Zeilen à 15 Spielpixel.
- Bei „Schrift: Lesbar“ oder „Textgröße: groß“ erscheinen Sätze und Antworten stattdessen als HTML-Untertitel (`07_subs.js`).

**Karte, Notizbuch, Dokumente, Rätsel**
- Sie sind Overlays im 320 × 200-Bild.
- Während einer Reise wirkt ein Tipp auf den Plan nicht (`17_map.js:185`).

**Menüs**
- Titel, Pause, Speichern, Laden und Einstellungen sind eine HTML-Schicht (`07_shell.js`).
- Ihre Zeilen sind mindestens 44 CSS-px hoch, scrollbare Bereiche stoppen die Zeigerereignisse.

**Eingabe** (`99_main.js:70–99`)
- `pointerdown`, `pointermove` und `pointerup` auf `#game` und `#hud` werden über `toLogical` in Spielkoordinaten umgerechnet, mit Fassungen für das gewohnte Bild, das Breitbild und das gedrehte Bild.
- Nur der erste Finger zählt.
- `touchend` verhindert innerhalb von 450 ms den Doppeltipp-Zoom.
- Kontextmenü und `dblclick` sind unterdrückt.
- **Ein `pointercancel` wird nicht behandelt.**

**Anpassung an die Bildschirmgröße** (`99_main.js:39–65`)
- Das Bild wird in einem ganzzahligen Maßstab in Gerätepixeln gezeichnet, damit die Pixel scharf bleiben.
- Die Breitbild-Leiste aus Phase 3 greift nur, wenn die Szene eine Maßstabsstufe größer passt. Sie berücksichtigt dabei die Safe Area.
- Im Hochformat wird das Bild um 90° gedreht; beim ersten Mal erscheint der Hinweis „Gedreht weiterspielen“.
- Das Spiel reagiert nur auf `resize` und `orientationchange` des Fensters, nicht auf `visualViewport`.
- Meta-Viewport: `viewport-fit=cover, user-scalable=no`.
- CSS: `touch-action:none` und `overscroll-behavior:none` auf `html` und `body`, Textauswahl und Callout aus (`game/build.js:38–45`).
- Pinch-Zoom ist zusätzlich über `gesturestart` gesperrt (`99_main.js:102`).

**Speichern und Lebenszyklus**
- Automatisch gespeichert wird bei jedem Ortswechsel, außerdem bei `visibilitychange` (verborgen) und `pagehide` (`99_main.js:103–104`).
- Mitten in einer Szene gilt der Stand vom Szenenbeginn.

**Ton** (`04_audio.js:15`)
- Er wird bei der ersten Eingabe freigeschaltet, auch über `touchend`.
- `M.audioInit` setzt den Ton nur aus dem Zustand `suspended` fort.

**Home-Bildschirm**
- Es gibt ein Manifest mit `display: standalone` und `orientation: landscape` sowie einen Service Worker für den Offline-Betrieb. Das ist in Szenario C12 getestet.

---

## A. Gesamturteil

MALA lässt sich auf dem iPad heute ordentlich mit dem Finger spielen.

- Bedienelemente der Leiste, Verb-Menü und Antwortzeilen sind dort 45–52 CSS-px hoch **[M]**.
- Nur kleine Dinge in dichten Szenen verlangen Genauigkeit.

Auf dem **iPhone** ist die Bedienung spielbar, aber mühsam und fehleranfällig.

- Das Bild ist klein: Auf iPhone SE und iPhone 14, 15 und 16 nutzt es nur 41–51 % des Bildschirms.
- Viele Hotspots und fast alle Canvas-Bedienelemente sind kleiner als ein Finger.

Für Desktop und iPad mit Trackpad funktionieren Maus, Tastatur, Hover und Rechtsklick.

Ein **Fortschritts-Blocker (P0) wurde nicht gefunden**: Jede Handlung ist mit einfachen Tipps erreichbar, und kein Ablauf blieb in der Emulation hängen.

**Die fünf wichtigsten Probleme**

1. **Kleine Hotspots ohne Toleranz (P1, [M][R])**
   - Auf einem iPhone 16 quer haben 190 von 904 Hotspots (21 %) keine Stelle von 24 × 24 CSS-px, die sicher sie trifft. 533 Hotspots (59 %) erreichen nicht 44 × 44.
   - Beispiele: „Lockerer Ziegel“ (Ledana) 8 CSS-px, „Telefonbuch“ (Hotel Palma) 10 CSS-px.
   - Schon 5 Spielpixel daneben, auf dem iPhone 8 CSS-px oder etwa 1,4 mm, trifft jeder vierte Tipp an der Rezeption einen Nachbarn.
2. **Viel Bildschirm bleibt ungenutzt, und die Breitbild-Leiste greift fast zufällig (P1, [M][C])**
   - iPhone SE: Szene 480 × 216 CSS-px, 41,5 % der Fläche.
   - iPhone 14, 15 und 16: 533 × 240, 50,8 %.
   - Ob die Breitbild-Leiste kommt, entscheiden 2 CSS-px Höhe: Das iPhone 13 (342 px hoch) bekommt sie, das iPhone 14 (340 px) nicht.
3. **Bedienelemente im Canvas sind auf iPhones zu klein (P1, [M])**
   - Notizen, Karte, Zeigen und Menü sind 22,5–25 CSS-px hoch.
   - Verb-Zeilen 22,5–30, Antwortzeilen 22,5–26, Inventarpfeile 24–27 CSS-px breit.
   - Auf dem iPhone SE liegen sie unter 24 CSS-px, der Mindestgröße nach WCAG 2.2 AA.
4. **Ein Doppeltipp am Satzende wählt ungelesen eine Antwort (P1, [R], alle Geräte einschließlich Desktop)**
   - Der erste Tipp beendet den letzten Satz.
   - Der zweite, auch noch 420 ms später, wählt die Antwort, die gerade unter dem Finger erscheint.
5. **Antwortlisten zeigen auf Touch nur 2–3 Antworten (P1, [R][M])**
   - Im Gespräch mit Bruno sind von 8 Antworten auf jedem Touch-Gerät nur 3 sichtbar.
   - Weiter geht es über ▼-Flächen von 25 CSS-px. Auf dem iPhone sind die Zeilen 25 CSS-px hoch, ihre Unterkante liegt 28 CSS-px über dem Bildschirmrand.

**Gesichert, weil in der Emulation reproduziert oder gemessen**
- Alle fünf Probleme oben.
- Fehlende Rückmeldung beim gesperrten Figurenwechsel.
- Gegenstandswahl, die einen Wechsel zu Mala überlebt.
- Hängender gezogener Gegenstand nach abgebrochener Berührung.
- Drehhinweis, der das Spiel nicht anhält.

**Nur aus Code und Dokumentation, auf dem Gerät offen**
- Ton nach Telefonat oder App-Wechsel (Zustand `interrupted`).
- Speichern beim App-Wechsel.
- Getrennter Speicher von Safari und Home-Bildschirm-App sowie die 7-Tage-Regel in Safari.
- Safari-Leisten und `visualViewport`.
- Bildschirmtastatur beim Benennen.
- Safe Area im gedrehten Bild.

**Was gut funktioniert und bleiben soll** **[R]**
- Fünf schnelle Tipps auf einen Ausgang führen zu genau einem Ortswechsel.
- Ein Doppeltipp auf einen Ort der Karte führt zu genau einer Reise.
- Ein Doppeltipp auf ein Ding ergibt genau eine Antwort.
- Fünf schnelle Tipps während einer Antwort überspringen nur einen Satz.
- Ein Tipp ins Leere schließt das Verb-Menü, ohne loszugehen.
- Wischen im Inventar blättert, ohne etwas zu benutzen.
- Scrollen in „Laden“ wirkt nicht auf die Szene.
- Nach dem Drehen stimmen Bild und Treffer überein.
- Speichern und Laden über die Pause stellt den Stand vollständig her.
- Textauswahl, Callout und Kontextmenü sind auf der Spielfläche abgeschaltet.

---

## B. Problemliste

Prioritäten: **P0** Fortschritt oder zentrale Bedienung blockiert · **P1** häufige Fehlbedienung oder erhebliche Einschränkung · **P2** Komfort, Lesbarkeit, Konsistenz · **P3** Feinschliff.

| ID | Bereich/Szene | Problem und Reproduktion | Auswirkung | Nachweisstatus | Priorität | Empfohlene Änderung | Datei/Funktion |
|---|---|---|---|---|---|---|---|
| T01 | Hotspots, alle Kapitel; Beispiele Hotel Palma (K1), Pflegeheimflur (K4) | Treffer nur exakt im Rechteck, ohne Toleranz. Messung über alle Musterlösungen: Auf iPhone 16 quer haben 190 von 904 Hotspots kein sicheres 24 × 24-CSS-px-Feld, 533 kein 44 × 44-Feld; auf dem iPhone SE sind es 206 bzw. 587. Kleinste Felder: Sofa (Kuća, K2) 3 Spielpx, Kühlschrank (Ana, K4) 3, Lockerer Ziegel 5, Telefonbuch, Aschenbecher, Domino, Schubladen je 6. Figuren im Pflegeheimflur überlappen bis auf 4–6 Spielpixel. Tipp an der Rezeption (Spielstand k1_bruno): Mitte 5/5 Treffer, ±5 Spielpx daneben nur 15/20; beim Telefonbuch treffen drei von vier versetzten Tipps Portiersloge, Schublade oder Fächer. | Pixel-Suche auf dem iPhone, falsche Handlungen an dichten Stellen, Frust bei Rätselgegenständen | [M] `design/touch/hotspots.json`; [R] F4 | P1 | Fangradius bei Touch, Auswahl bei Mehrdeutigkeit, Markierung des erkannten Objekts (C2). Größeres Bild auf Telefonen (T02). Optional Feinwahl (T21). | `05_engine.js:349` `hotspotAt`, `06_ui.js:733` `click` |
| T02 | Layout iPhone | Ganzzahliger Maßstab ohne Leiste außerhalb des Bildes. iPhone SE (667 × 375): Szene 480 × 216 CSS-px, 41,5 % der Fläche. iPhone 14, 15 und 16 (734 × 343): 533 × 240, 50,8 %. Das Breitbild greift nur, wenn `320(n+1)+66n` in die Breite passt: iPhone 13 (750 × 342) ja, iPhone 14 (750 × 340) und iPhone 16 (734 × 343) nein. Auf echten Geräten hängt das am Zustand der Safari-Leisten. | Kleine Figuren und Schrift, kleine Treffer; das Layout springt je nach Gerät | [M] Messung je Gerät; [C] `99_main.js:39–65`; Geräte [O] | P1 | Telefon-Layout (D1): Szene immer im größten ganzzahligen Maßstab, der mit einer Leiste von 48 CSS-px passt; Seitenleisten nur, wenn ≥ 44 CSS-px frei sind; Hysterese gegen Springen. | `99_main.js` `wideGeo`/`fit`, `06_ui.js` `wideLayout` |
| T03 | Leiste, Verb-Menü, Antworten, Overlays (Telefon) | Gemessene Höhen der Canvas-Bedienelemente in CSS-px: Leistenknöpfe 22,5 (SE) bzw. 25 (iPhone 16) bzw. 45 (Breitbild, iPad); Verb-Zeile 22,5 bzw. 25 bzw. 30 bzw. 45; Antwortzeile 22,5 bzw. 25 bzw. 26 bzw. 45; Inventarpfeile 24–27 breit; „X“ im Notizbuch 15 × 14 Spielpx (iPhone ≈ 25 × 23 CSS-px). | Häufiges Danebentippen; auf dem SE unter dem WCAG-Minimum | [M] `devicetests.json` (messung) | P1 | Telefon-Layout mit Leiste ≥ 48 CSS-px; Aktionsleiste und Antwortliste als HTML ≥ 44 CSS-px (C3, C6); „✕“ der Overlays in der HTML-Schicht ≥ 44 CSS-px. | `06_ui.js` `drawUI`, `openPop`, `drawChoices`, Overlay-Schließen |
| T04 | Gespräch, Übergang Satz → Antwortliste | Letzter Satz läuft, Tipp beendet ihn, sofort erscheint die Liste, ein zweiter Tipp an derselben Stelle wählt die Antwort darunter. Reproduziert mit 120, 250 und 420 ms Abstand auf iPhone 16, iPhone 13, iPad und Desktop (auch per Maus). | Ungelesene, unbeabsichtigte Antworten; nicht rückgängig zu machen | [R] F5b | P1 | Eingabesperre der Liste: Tipps, die vor oder bis 450 ms nach dem Erscheinen der Liste beginnen, wählen nicht. Kurz sichtbar machen, dass die Liste bereitsteht (Zeilen blenden in 150 ms auf). | `06_ui.js:749` (`E.dlg` in `click`), `07_subs.js` |
| T05 | Gespräch, Antwortliste (Touch) | Bei Touch höchstens drei Zeilen; eine zweizeilige Antwort zählt doppelt. Synthetische Liste: 2 von 7 sichtbar. Bruno (k1_bruno): 3 von 8; weiter über ▼ (25 CSS-px). Unterkante der untersten Zeile auf dem iPhone 16 nur 28 CSS-px über dem Rand. | Viel Blättern, Antworten übersehen, Fehltipps am Rand | [R] F5; [M] | P1 | Antwortliste bei Touch immer als HTML (wie `07_subs.js`, auch in Pixelschrift): Zeilen ≥ 44 CSS-px, bis 5 sichtbar, natives Scrollen mit sichtbarer Bildlaufleiste, Abstand zum unteren Rand ≥ Safe Area + 8 px. | `06_ui.js:256` `drawChoices`, `07_subs.js` |
| T06 | Verb-Menü (Touch) | Das Menü öffnet 14 Spielpixel rechts des Fingers, senkrecht mittig auf ihn (`06_ui.js:209`). Rechtshänder verdecken die untere Hälfte mit Finger und Hand. Abstand gemessen: 21–29 CSS-px auf iPhones, Zeilen 22,5–30 CSS-px. | Erst suchen, dann zielen; Fehltipps | [M]; Verdeckung [C], Gerät [O] | P2 | Bei Touch Aktionsleiste unten statt Menü am Finger (C3). Bei Maus bleibt das Menü am Zeiger. | `06_ui.js:208` `openPop` |
| T07 | Inventar | „Benutzen“ braucht drei Tipps: Gegenstand → „Benutze“ → Ziel. Ziehen geht in einem Zug, verlangt aber Halten und verdeckt beim Ziehen das Ziel. | Umständlich auf kleinen Displays | [R] F3, F3b | P2 | Tipp auf den Gegenstand wählt ihn sofort („Benutze X mit …“, Ansehen und Abbrechen in der Aktionsleiste), dann Ziel antippen: zwei Tipps. Ziehen bleibt als Abkürzung. | `06_ui.js:761–765` |
| T08 | Figurenwechsel | Tipp auf das Porträt während einer Szene: nichts passiert, kein Ton, kein Grund. | Wirkt wie ein Defekt | [R] F2 (alle Geräte) | P2 | Grund kurz in der Satzzeile zeigen („Gerade nicht – die Szene läuft.“, „Mala ist nicht hier.“), Porträt gesperrt darstellen. | `05_engine.js:269` `switchChar`, `06_ui.js` `drawSwitch` |
| T09 | Figurenwechsel mit gewähltem Gegenstand | Marko wählt „Benutze Postkarte“, dann Wechsel zu Mala: die Wahl bleibt bestehen; Malas nächster Tipp „benutzt“ die Postkarte und bekommt eine Absage. | Verwirrend; ungewollte Handlung | [R] F2 (alle Geräte) | P2 | Beim Wechsel `E.pending`, Verb-Menü und Ziehen aufheben. | `05_engine.js:263` `switchTo` |
| T10 | Abgebrochene Berührung | Ein `pointercancel` (Systemgeste am Rand, Benachrichtigung, Mehrfinger) wird nicht behandelt. Mit Chromium-Touch: Gegenstand ziehen, Berührung abbrechen, der Gegenstand bleibt mit „Benutze … mit …“ am letzten Fingerpunkt stehen. | Hängende Anzeige; nächster Tipp verhält sich unerwartet | [R] F3b (Chromium); iOS [O] | P2 | `pointercancel` und `lostpointercapture`: Druck- und Ziehzustand zurücksetzen, ohne Handlung. | `99_main.js:78–96`, `06_ui.js:715–717` |
| T11 | Hochformat | Der Drehhinweis verdeckt die Fläche, aber das Spiel läuft weiter: in 600 ms vergehen ≈ 600 ms Spielzeit. Sätze laufen unbemerkt ab. | Verpasste Sätze und Szenen | [R] F8 | P2 | Solange der Hinweis sichtbar ist, Spiel anhalten (wie in der Pause); danach weiter. | `99_main.js:20` `showRot` |
| T12 | Ton nach Unterbrechung | `M.audioInit` setzt nur aus `suspended` fort. WebKit kennt zusätzlich `interrupted` (Telefonat, Siri, App-Wechsel); dann bleibt der Ton aus, bis neu geladen wird. Der Stummschalter schaltet Web Audio stumm. | Stilles Spiel ohne Erklärung | [C]; [D]; Gerät [O] | P2 | Bei jeder Nutzereingabe und bei `visibilitychange` (sichtbar) `resume()`, wenn der Zustand nicht `running` ist. Kurzer Hinweis in den Einstellungen zum Stummschalter. | `04_audio.js:15` |
| T13 | Speichern beim App-Wechsel | Gespeichert wird bei Ortswechsel, `visibilitychange` und `pagehide`. Auf iOS feuert `pagehide` beim App-Wechsel nicht, und `visibilitychange` fehlt laut WebKit-Bug 207256 bei manchen Wechseln; ein beendeter Prozess bekommt nichts. Fortschritt innerhalb eines Raums (Gegenstände, Notizen) kann dann verloren gehen. | Verlorene Schritte nach Wechsel oder Absturz | [C]; [D]; synthetische Ereignisse [R] F9; Gerät [O] | P2 | Zusätzlich speichern, sobald eine Handlung abgeschlossen ist und nichts läuft (gedrosselt, höchstens alle 10 s), nicht mitten in Szenen. | `05_engine.js` `autosave`/`saveGame` |
| T14 | Safari ↔ Home-Bildschirm | Die Home-Bildschirm-App hat einen eigenen Speicher; Spielstände aus Safari fehlen dort. In Safari kann skriptbeschreibbarer Speicher nach 7 Tagen ohne Nutzung gelöscht werden; für Home-Bildschirm-Apps gilt das laut WebKit nicht. | Spielstände „weg“ nach Installation oder längerer Pause | [D]; Gerät [O] | P2 | Beim ersten Start als App erklären („Spielstände aus Safari mit Sicherung übertragen“); in Einstellungen/LIESMICH empfehlen, auf dem iPhone die Home-Bildschirm-Fassung zu nutzen; `navigator.storage.persist()`, wo vorhanden. | `07_shell.js`, `web/LIESMICH.txt` |
| T15 | Einstellungen: „Vollbild“ | Auf dem iPhone gibt es kein Element-Vollbild; der Schalter bewirkt nichts. Auf dem iPad gibt es nur ein Vollbild mit festem Schließen-Knopf, das bei Wischen nach unten endet. | Toter Schalter | [C] `07_shell.js:157`, `99_main.js:29`; [D] | P2 | Auf dem iPhone ausblenden und durch den Hinweis „Zum Home-Bildschirm hinzufügen“ ersetzen; auf dem iPad mit Hinweis anbieten. | `07_shell.js` `SCR.settings` |
| T16 | Gesten | Globale Sperre: `touch-action:none` auf `html`/`body`, `gesturestart` verhindert, `user-scalable=no`. Pinch-Zoom ist damit auch in Menüs und Texten gesperrt; `user-scalable` ignoriert iOS ohnehin. | Zoom als Zugänglichkeitshilfe in Menüs fehlt | [C] `game/build.js:38–45`, `99_main.js:102`; [D] | P2 | Sperre auf die Spielflächen (`#game`, `#hud`, Antwortliste) beschränken; Menüs `touch-action: manipulation`, damit Wischen und Zoomen dort gehen. Die Spielfläche bleibt ohne Zoom: Tipp, Ziehen und Doppeltipp sind dort Spielaktionen. | `game/build.js`, `99_main.js` |
| T17 | Safari-Leisten, Größenwechsel | Nur `resize`/`orientationchange` des Fensters; kein `visualViewport`. Ob Safari beim Ein- und Ausblenden der Leisten `resize` sendet, ist nicht dokumentiert. Ohne Hysterese kann der Layoutwechsel Breitbild ↔ gewohnt bei 2 px Unterschied hin und her springen. | Abgeschnittenes oder springendes Bild | [C]; [D]; Gerät [O] | P2 | Zusätzlich `visualViewport.resize` (entprellt 150 ms); Hysterese von 8 CSS-px für den Layoutwechsel; Wechsel nicht während eines Ziehens. | `99_main.js:69` |
| T18 | Bildschirmtastatur (Lesezeichen benennen) | Das Namensfeld steht mittig. Im Querformat verdeckt die Bildschirmtastatur auf dem iPhone etwa die untere Hälfte. | Feld nicht sichtbar beim Tippen | [C]; Gerät [O] | P2 | Bei Fokus das Fenster oben ausrichten (Höhe aus `visualViewport`). | `07_shell.js` `SCR.rename` |
| T19 | Drehen mit offenem Overlay | Bild und Treffer stimmen nach dem Zurückdrehen (F8). Nicht geprüft: Drehen während eines Ziehens oder einer Feinwahl. | – | [R] F8; Rest [O] | P3 | Ziehen bei Größenwechsel abbrechen (wie T10). | `99_main.js` `fit` |
| T20 | Gedrehtes Hochformat in der Home-Bildschirm-App | `fit()` rechnet im gedrehten Bild ohne Safe Area. Mit `viewport-fit=cover` kann das gedrehte Bild unter Kamera oder Home-Indikator reichen. | Teile des Bildes verdeckt | [C]; Gerät [O] | P3 | Im gedrehten Bild die Ränder aus der Safe-Area-Sonde abziehen. | `99_main.js:60–65` |
| T21 | Dichte Stellen | Auch mit Fangradius bleiben Orte, an denen mehrere kleine Dinge dicht beieinander liegen: Rezeption Palma, Schubladen beim Vulkanizer, Pflegeheimflur. | Fehltipps trotz Toleranz | [M][R] | P3 | Optionale Feinwahl: Finger 0,4 s halten, dann Fadenkreuz 40 CSS-px über dem Finger, Name in der Leiste, Loslassen auf Objekt = Tipp. Ergänzung, keine Pflichtgeste. | `06_ui.js` Zeigerlogik |
| T22 | iPad: freier Platz | iPad (7. Gen.): Bild 960 × 600, darunter und darüber 105 CSS-px schwarz. Antworten und Untertitel liegen trotzdem über Leiste und Szene. | Szene wird im Gespräch unnötig verdeckt | [M] | P3 | Auf dem iPad Antwortliste und Untertitel in den freien Raum unter dem Bild legen, sobald ≥ 120 CSS-px frei sind. | `07_subs.js` `geo` |
| T23 | Schriftgröße im Bild (Telefon) | Versalhöhe der Pixelschrift: 10,5 (SE), 11,7 (iPhone 16), 14 CSS-px (Breitbild); entspricht etwa 15–20 px Schriftgröße. | Lesbar, auf kleinen iPhones grenzwertig | [M] | P3 | Mit dem Telefon-Layout überall ≥ 14 CSS-px; „Textgröße: groß“ bleibt für Gespräche. | – |
| T24 | Hotspot-Anzeige „Zeigen“ | Zeigt alle sichtbaren Hotspots 4,5 s als Punkte (Ausgänge grün, Personen rot), Namen nur für Ausgänge und Personen; ein Tipp auf einen Punkt zeigt den Namen. Gleichwertig für alle Hotspots, keine Reihenfolge, kein „wichtig“. | Gute Bedienhilfe, verrät keine Lösung | [C][R] | – | Beibehalten. Auf Touch zusätzlich bei Fangradius-Treffern nicht verwenden; Zeigen bleibt eine ausdrückliche Handlung. | `06_ui.js` `drawReveal` |

---

## C. Empfohlenes Bedienmodell

**Grundsatz:** Ein Modell für alle Kapitel.

- Ein Tipp tut das Naheliegende.
- Gibt es mehrere Möglichkeiten, entscheidet die Aktionsleiste.
- Ein Gegenstand wird erst gewählt, dann aufs Ziel angewendet.
- Die Bedienung zeigt immer, **was** erkannt wurde, aber nie, was als Nächstes zu tun ist.

Für iPhone und iPad gilt dasselbe Modell; die Größen kommen aus dem Layout (D). Maus und Trackpad behalten Hover, das Menü am Zeiger und den Rechtsklick. Die Logik dahinter ist dieselbe; nur die Darstellung des Verb-Menüs unterscheidet sich je nach letzter Eingabeart (`pointerType`, auch beim Wechsel zwischen Finger und Trackpad am iPad).

**Bewusste Abweichungen von heute**
- **Aktionsleiste statt Menü am Finger.** Das Menü wird von der Hand verdeckt, seine Zeilen sind auf dem iPhone 22–30 CSS-px hoch, und Platz für größere Zeilen hat die Szene nicht.
- **Gegenstand mit einem Tipp wählen.** Bisher waren es drei Tipps; „Benutze“ ist die häufigste Gegenstandshandlung.
- **Fangradius.** Ohne ihn verfehlen Finger 21–23 % der Hotspots auf iPhones, gemessen als größtes sicheres Feld unter 24 CSS-px.
- **Eingabesperre der Antwortliste.** Ohne sie wählt ein Doppeltipp ungelesen eine Antwort (T04).

Alles andere bleibt, wie es ist: Gehen per Tipp, Doppeltipp auf Ausgänge, Wischen im Inventar, Ziehen als Abkürzung, Sperren gegen Mehrfachtipps.

### C1. Bewegung

| Eingabe | sichtbare Reaktion | Ergebnis | Abbruch |
|---|---|---|---|
| Tipp auf freien Boden | Tippmarke an der erkannten Stelle (Ring, 300 ms); ist die Stelle nicht begehbar, am Endpunkt | Figur geht zum nächsten begehbaren Punkt | Neuer Tipp setzt ein neues Ziel; letzte Eingabe gewinnt (wie heute) |
| Tipp während eine Szene läuft | Satz endet, falls einer läuft; sonst nichts | – | – |
| Tipp in den ersten 350 ms nach einem Ortswechsel | nichts (wie heute) | Schutz vor nachgereichten Tipps | – |

### C2. Untersuchen und Interagieren (Hotspots)

| Eingabe | sichtbare Reaktion | Ergebnis | Abbruch |
|---|---|---|---|
| Finger auf Objekt | Name in der Satzzeile der Leiste, dünner Rahmen um das **erkannte** Objekt (nur das berührte, sonst nichts) | – | Finger mehr als 10 Spielpixel wegziehen und loslassen: nichts passiert (wie heute) |
| Loslassen: Objekt mit genau einer Handlung (nur Ansehen, Ausgang) | – | Sofort ausführen (wie heute); Ausgang: hingehen, zweiter Tipp innerhalb von 350 ms = sofort hinaus | Neuer Tipp während des Weges |
| Loslassen: Objekt mit mehreren Handlungen | Aktionsleiste zeigt die Verben als Knöpfe ≥ 44 CSS-px („Schau an“, „Nimm“, „Rede“ …) und „✕“; das Objekt bleibt markiert | Tipp auf Verb führt aus | „✕“, Tipp ins Bild (schließt nur, geht nicht), Esc |
| Tipp knapp neben ein Objekt (Touch) | wie oben, Rahmen um das gefundene Objekt | **Fangradius:** Trifft der Tipp nichts, gilt das nächste Objekt im Umkreis von 10 Spielpixeln (≈ 20 CSS-px auf dem Telefon). | – |
| Tipp zwischen zwei gleich nahe Objekte (Abstand < 3 Spielpx Unterschied) | Aktionsleiste fragt mit den Namen beider Objekte | Tipp auf einen Namen wählt das Objekt | „✕“ |

**Regeln**
- **Überlappung:** Ein Tipp innerhalb eines Rechtecks trifft wie heute das kleinste. So bleiben kleine Dinge auf großen erreichbar.
- **Fangradius:** Er gilt nur für Tipps, die keinen Hotspot treffen, und nur bei Touch.
- **Bedienhilfe ist keine Lösungshilfe:**
  - Rahmen und Name zeigen nur das, was der Finger getroffen hat.
  - Es gibt keine Hervorhebung „passender“ Ziele, keine Reihenfolge und keine automatische Anzeige aller Hotspots.
  - „Zeigen“ bleibt eine ausdrückliche Handlung.

### C3. Inventar

| Eingabe | sichtbare Reaktion | Ergebnis | Abbruch |
|---|---|---|---|
| Tipp auf Gegenstand | Feld angehoben und gerahmt, Satzzeile „Benutze Džezva mit …“, Aktionsleiste: „Ansehen“, „✕“ | Gegenstand gewählt | Zweiter Tipp auf denselben Gegenstand, „✕“, Tipp auf freien Boden (wie heute), Figurenwechsel (neu), Esc |
| Danach Tipp auf Ziel (Objekt, Person, Mala, anderer Gegenstand) | Rahmen um das Ziel, Satzzeile „Benutze Džezva mit Blick über die Stadt“ | Handlung wie heute | – |
| Gegenstand aus der Leiste nach oben ziehen (Abkürzung) | Symbol und Satz über dem Finger | Loslassen auf Ziel: anwenden; auf nichts: nichts | Loslassen in der Leiste oder abgebrochene Berührung (neu: Zustand zurücksetzen, T10) |
| Seitlich wischen in der Leiste | Seite wechselt | Blättern, nie Benutzen (wie heute) | – |

Es entsteht keine neue Kombinationsmechanik. „Gegenstand antippen, dann Ziel antippen“ gibt es heute schon über „Benutze“; der Zwischenschritt entfällt.

### C4. Figurenwechsel Marko ↔ Mala

| Eingabe | sichtbare Reaktion | Ergebnis | Abbruch |
|---|---|---|---|
| Tipp auf das Porträt „↔ Name“ (≥ 44 CSS-px) | Wechselgeräusch, Bild wird kalt (Mala) bzw. warm (Marko), Porträt zeigt die andere Figur | Wechsel; Gegenstandswahl, Aktionsleiste und Ziehen werden aufgehoben (neu, T09) | – |
| Tipp, während der Wechsel gesperrt ist | Porträt gedämpft; Satzzeile nennt kurz den Grund (neu, T08) | kein Wechsel | – |
| Tipp während des Weges zu einem Objekt | – | Wechsel; die angefangene Handlung wird verworfen (wie heute) | – |

Die Fähigkeiten zeigen sich, wie heute, in den Verben der Aktionsleiste: „Lausche“ und „Spüre“ bei Mala, „Nimm“ und „Rede“ bei Marko. Das Spiel erklärt nicht, wo eine Fähigkeit hilft.

### C5. Gespräche

| Eingabe | sichtbare Reaktion | Ergebnis | Abbruch |
|---|---|---|---|
| Tipp während ein Satz steht | – | Satz endet, frühestens 200 ms nach Beginn; ein zweiter Tipp innerhalb von 350 ms zählt nicht (wie heute) | – |
| „Weiter erst nach Tippen“ | ▸ am Satzende | Satz bleibt stehen, bis getippt wird | – |
| Antwortliste erscheint | Zeilen blenden in 150 ms auf; **450 ms Eingabesperre** (neu, T04) | – | – |
| Tipp auf eine Antwortzeile (≥ 44 CSS-px, HTML) | Zeile leuchtet auf | Antwort gewählt | Vor dem Loslassen wegziehen; scrollen statt tippen, wenn der Finger sich bewegt |
| Wischen in der Liste | Liste scrollt, Bildlaufleiste sichtbar | – | – |

Die Liste steht über der Leiste und zeigt bis zu 5 Zeilen. Lange Antworten brechen um, die Schrift wird nie verkleinert. Schon gestellte Fragen sind gedämpft, wie heute.

### C6. Karte und Ausgänge

| Eingabe | sichtbare Reaktion | Ergebnis | Abbruch |
|---|---|---|---|
| Tipp auf „Karte“ | Stadtplan (Overlay) | – | „✕“ (HTML, ≥ 44 CSS-px, oben rechts), Esc, Zurück-Geste des Browsers |
| Tipp auf einen Ort | Ort hervorgehoben, Figur reist | Ortswechsel; weitere Tipps während der Reise wirken nicht (wie heute) | Vor der Reise: „✕“ |
| Tipp auf gesperrten oder gestrichelten Ort | Grund im Plan (wie heute) | – | – |

### C7. Menüs

Das Verhalten bleibt wie heute: HTML-Schicht, Zeilen ≥ 44 CSS-px, Bestätigung vor dem Überschreiben, „Rückgängig“ nach dem Laden. Neu sind zwei Punkte:
- Das Namensfeld rückt bei offener Bildschirmtastatur nach oben (T18).
- Menüs dürfen gezoomt werden (T16).

---

## D. Layoutentwurf (inzwischen umgesetzt; Abweichungen in `TOUCH_UMSETZUNG.md`, Abschnitt 3)

Beschriftete Entwürfe mit echten Szenenbildern aus dem Spiel stehen als Zeichenfläche unter https://claude.ai/artifact/4LGo76UBHuwvrLEjfMunXb (privat). Es sind sieben Zeichenbretter: iPhone 16 heute und im Entwurf, Aktionsleiste, Auswahl bei zwei Dingen, Gespräch, iPhone SE und iPad. Die Beschriftungen lassen sich je Zeichenbrett ausblenden. Quellen und Bilder liegen in `design/touch/entwurf/`. Maße in CSS-Pixeln.

### D1. iPhone quer: Telefon-Layout

**Regel**
- `m` ist der größte ganzzahlige Maßstab in Gerätepixeln, bei dem gilt: `320·m ≤ sichere Breite` und `144·m + 48 CSS-px Leiste ≤ sichere Höhe`.
- Bleiben links und rechts mindestens 44 CSS-px frei, stehen dort die Seitenknöpfe; sonst steht alles in der unteren Leiste.
- Hysterese: Gewechselt wird erst bei 8 px Unterschied.

| Gerät (Emulationsmaß) | heute | Entwurf |
|---|---|---|
| iPhone SE (667 × 375, ×2) | Szene 480 × 216 (1,5 px/Spielpx) | Szene 640 × 288 (2,0), Leiste unten 48 hoch, ohne Seitenknöpfe; Fläche +78 % |
| iPhone 14, 15 und 16 (734 × 343, ×3) | 533 × 240 (1,67) | 640 × 288 (2,0), Seitenknöpfe 47 breit, Leiste 48; +44 % |
| iPhone 13 (750 × 342) | 640 × 288 (Breitbild) | gleich, Seitenknöpfe 55 |
| iPhone 17 Pro Max (838 × 390) | 640 × 288 (Breitbild) | 747 × 336 (2,33), Seitenknöpfe 45; +36 % |

**Anordnung** (von links nach rechts)
- **Linke Seite:** Figurenknopf (Porträt, 44 × 66) und darunter Notizen (44 × 44).
- **Mitte:** die Szene.
- **Rechte Seite:** Menü, Karte und Zeigen (je 44 × 44).
- **Untere Leiste, 48 hoch, über der Home-Indikator-Zone:** Inventar mit 6 Feldern à 56 × 48 und Pfeilen 44 × 48. Die Satzzeile liegt als schmale Zeile auf der Unterkante der Szene (halbtransparent, 18 hoch).
- **Ohne Seitenknöpfe (SE):** Porträt und Notizen links in der Leiste, Menü, Karte und Zeigen rechts in der Leiste; das Inventar dazwischen mit 5 Feldern.

**Zustände**

| Zustand | Darstellung |
|---|---|
| Aktionsleiste | Ersetzt die Inventarzeile: bis zu 4 Verbknöpfe (≥ 96 × 44) und „✕“. Das Objekt bleibt im Bild markiert. |
| Gespräch | Brustbild oben wie heute. Antwortliste als HTML über der Leiste, bis 5 Zeilen à ≥ 44, rechts eine Bildlaufleiste. Die Leiste ist abgedunkelt. Der Satz steht als Untertitel über der Liste. |
| Overlays (Notizbuch, Karte, Dokument, Rätsel) | Im 320 × 200-Bild im größten passenden Maßstab, wie heute. „✕“ als HTML-Knopf 44 × 44 oben rechts außerhalb der Safe-Area-Ränder. |
| Pause und Menüs | HTML-Schicht, wie heute. |

### D2. iPad quer

| Gerät | heute | Entwurf |
|---|---|---|
| iPad (7. Gen.) 1080 × 810 | Bild 960 × 600 (3,0), Leiste im Bild, darüber und darunter je 105 frei | Bild bleibt, die Leiste ist mit 45–52 hohen Knöpfen ausreichend. Das Bild rückt 12 px an den oberen Rand, darunter werden 198 px frei. Gespräch: Antwortliste **unter dem Bild** (4 Zeilen à 44, Wischen scrollt), Untertitel auf der Unterkante der Szene; Szene und Leiste bleiben sichtbar. |
| iPad Pro 11 1194 × 834 | 1120 × 700 (3,5) | wie oben, 134 frei |

**Aktionsleiste auf dem iPad**
- Mit dem Finger erscheinen die Verben in der Leiste.
- Mit Trackpad oder Maus bleibt das Menü am Zeiger.

### D3. Hochformat (beide)

- Der Drehhinweis erscheint einmal, das Spiel steht dabei still (neu).
- „Gedreht weiterspielen“ zeigt das gedrehte Bild mit denselben Regeln, jetzt mit Safe-Area-Rändern (T20).
- Ein erzwungener Ausrichtungswechsel ist nicht vorgesehen; iOS kann die Ausrichtung nicht sperren.

---

## E. Priorisierter Umsetzungsplan

Aufwand: **S** bis ½ Tag, **M** 1–3 Tage, **L** über 3 Tage.

| Schritt | Inhalt | Nutzen | Komponenten | Abhängigkeit | Aufwand | Regressionsrisiko / Prüfung |
|---|---|---|---|---|---|---|
| E1 | **Sofortmaßnahmen:** Eingabesperre der Antwortliste (T04); `pointercancel`/`lostpointercapture` (T10); Figurenwechsel mit Grund und ohne übrig bleibende Gegenstandswahl (T08, T09); Drehhinweis hält das Spiel an (T11); Ton `resume` bei `interrupted` (T12); Vollbild-Schalter am iPhone ersetzen (T15); Speichern nach abgeschlossener Handlung (T13) | Behebt alle reproduzierten Fehlbedienungen ohne Layoutarbeit | `06_ui.js` (`click`, `escape`), `05_engine.js` (`switchTo`, `autosave`), `99_main.js` (`showRot`, Zeiger), `04_audio.js`, `07_shell.js` | – | M | Die Sperre darf nur Zeigertipps betreffen, nicht Ziffern, `M.TA.choose` oder Kampagnen. Prüfung: `phase1`–`phase4`, Szenarien, `devicetests.js` F2/F3b/F5b/F8/F9. |
| E2 | **Treffsicherheit:** Fangradius bei Touch, Auswahl bei Mehrdeutigkeit, Tippmarke, Rahmen um das erkannte Objekt (T01) | Weniger Pixel-Suche ohne Lösungshinweis | `05_engine.js` (`hotspotNear`), `06_ui.js` (`click`, Zeichnung) | – | M | Hotspot-Prüfungen (Szenario C11, `klicktests`), `hotspotscan.js` mit Fangradius-Simulation (Ziel: kein Hotspot unter 24 CSS-px Fangfläche auf iPhone 16), F4. |
| E3 | **Telefon-Layout** als Verallgemeinerung der Breitbild-Leiste: Szene ≥ 2,0 px/Spielpx auf allen iPhones, Leiste 48, Seitenknöpfe nach Platz, Hysterese, `visualViewport` (T02, T03, T17, T23) | Größeres Bild, alle Knöpfe ≥ 44 | `99_main.js` (`wideGeo` → Telefonregel), `06_ui.js` (`wideLayout`-Varianten), `07_shell.js`/`07_subs.js` (Geometrie) | E1 | L | `hudcmp.js` (Desktop/iPad unverändert), `phase3.js` erweitern um SE, iPhone 16, 17 Pro Max; Overlays; Drehen; Größenwechsel im Gespräch. |
| E4 | **Aktionsleiste und Antwortliste als HTML bei Touch;** Gegenstand mit einem Tipp wählen (T05, T06, T07); „✕“ der Overlays als HTML | Große, unverdeckte Bedienelemente in Gesprächen und bei Handlungen | `06_ui.js` (`openPop` → Leiste, `drawConv`), `07_subs.js` (Antworten auch in Pixelschrift) | E3 (Leistengeometrie) | M | Maus-Pfad unverändert lassen; `qa/ui/phase1.js` (Canvas-Liste) und `uirun` für Touch anpassen; Spielstände bleiben gültig (keine Datenänderung). |
| E5 | **Plattformhinweise:** Safari/Home-Bildschirm, Sicherung, 7-Tage-Regel, Stummschalter; `navigator.storage.persist()` (T14, T12) | Weniger verlorene Spielstände | `07_shell.js`, `web/LIESMICH.txt` | – | S | Texte BHS übersetzen; `phase2` (Einstellungen). |
| E6 | **iPad und Feinschliff:** Antworten unter dem Bild (T22), Zoom in Menüs (T16), Namensfeld über der Tastatur (T18), Safe Area im gedrehten Bild (T20), optionale Feinwahl (T21) | Komfort | `07_subs.js`, `game/build.js`, `07_shell.js`, `99_main.js`, `06_ui.js` | E3, E4 | M | Szenarien W11 (gedreht), Menütests. |
| E7 | **Echtgeräte-Abnahme** (F, offene Prüfungen) | Belastbare Aussagen zu Safari und iOS | – | E1–E6 | S je Gerät | – |

**Reihenfolge:** zuerst E1, weil es behebt, was reproduziert ist, und nichts umbaut. Dann E2 und E3, die größten Hebel auf dem iPhone. Danach E4 auf der neuen Leiste, zuletzt E5 und E6.

Spielstände bleiben in allen Schritten unverändert gültig: Das Datenmodell ändert sich nicht. Nach jeder Auslieferung ändert sich die Cache-Version im Service Worker (wie bisher durch `build.js`).

---

## F. Testprotokoll und Abnahmekriterien

### F1. Ausgeführte Tests

**Methode und Bedingungen**
- **Werkzeuge:** Playwright 1.63 unter Linux; WebKit (Playwright-Build, nicht Safari auf iOS) für die Apple-Profile, Chromium für Desktop und für Touch-Gesten über CDP (Ziehen, Wischen, Abbruch).
- **Was die Emulation nicht hat:** Safe-Area-Ränder, Safari-Leisten, Systemgesten, Bildschirmtastatur, Ton.
- **Werkzeuge der Untersuchung:** `design/touch/devicetests.js` (Messungen und Abläufe, Ergebnisse in `devicetests.json`, Bildschirmfotos in `design/touch/evidence/`) und `design/touch/hotspotscan.js` (Node-VM, Musterlösungen K1–K4, Ergebnis `hotspots.json`).

**Geräteprofile** (Viewport in CSS-px, Pixeldichte)

| Profil | Viewport | Dichte | Gemessen | Abläufe |
|---|---|---|---|---|
| iPhone SE (3. Gen.) quer | 667 × 375 | ×2 | ja | – |
| iPhone 16 quer | 734 × 343 | ×3 | ja | ja |
| iPhone 13 quer | 750 × 342 | ×3 | ja | ja |
| iPhone 17 Pro Max quer | 838 × 390 | ×3 | ja | – |
| iPad (7. Gen.) quer | 1080 × 810 | ×2 | ja | ja |
| iPad Pro 11 quer | 1194 × 834 | ×2 | ja | – |
| Desktop mit Maus | 1280 × 800 | ×1 | ja | ja |
| Hochformat (Abläufe F8) | Viewport gedreht | – | – | ja |

Alle Abläufe verwenden echte Spielstände aus `qa/results/browser/states.json`.

| Ablauf | Szene / Spielstand | iPhone 16 | iPhone 13 | iPad | Desktop | Ergebnis |
|---|---|---|---|---|---|---|
| 1 Fortsetzen, gehen, untersuchen | Hafenamt / k1_amt | ✓ | ✓ | ✓ | ✓ | Fortsetzen 1 Tipp; Untersuchen 2 Tipps über das Verb-Menü |
| 2 Figurenwechsel, Fähigkeit | Hafenamt / k1_amt | ✓ / ✗ | ✓ / ✗ | ✓ / ✗ | ✓ / ✗ | Wechsel und „Lausche“ gehen; gesperrter Wechsel ohne Rückmeldung (T08); Gegenstandswahl bleibt (T09) |
| 3 Gegenstand wählen, benutzen, abbrechen | Vratnik / k2_limbo | ✓ | ✓ | ✓ | ✓ | 3 Tipps; Abbruch per Gegenstand oder Boden geht |
| 3b Ziehen, Wischen, Abbruch (Chromium-Touch) | Vratnik / k2_limbo | ✓ / ✗ | – | – | – | Ziehen und Wischen gehen; nach `touchCancel` hängt der Gegenstand (T10) |
| 4 benachbarte kleine Hotspots | Rezeption Palma / k1_bruno | Befund | Befund | Befund | Befund | Mitte 5/5; ±5 Spielpx: 15/20 bzw. 14/20 (T01) |
| 5 langes Gespräch, unterste Antwort | Palma, Bruno / k1_bruno | ✓ | ✓ | ✓ | ✓ | 8 Antworten, 3 sichtbar (Desktop 4); Wahl unten geht; Mehrfachtipps überspringen nur 1 Satz |
| 5b Doppeltipp Satz → Liste | Palma / k1_bruno | ✗ | ✗ | ✗ | ✗ | Antwort ungelesen gewählt bei 120, 250 und 420 ms (T04) |
| 6 Karte, Reise, zurück in die Szene | Matejuška → Varoš / k1_brief | ✓ | ✓ | ✓ | ✓ | Doppeltipp auf Ort: genau 1 Reise |
| 7 speichern, laden, weiterspielen | Vratnik / k2_limbo | ✓ | ✓ | ✓ | ✓ | Lesezeichen, Laden, „Rückgängig“ |
| 8 Drehen in Gespräch und Pause | Palma / k1_bruno | ✓ / ✗ | ✓ / ✗ | ✓ / ✗ | – | Treffer stimmen gedreht und zurückgedreht; Drehhinweis hält nicht an (T11) |
| 9 App verlassen, zurück, neu laden | Vratnik / k2_limbo | ✓ | ✓ | ✓ | ✓ | Speichern bei `visibilitychange`/`pagehide` (synthetisch), Neuladen → Fortsetzen; echter App-Wechsel offen |
| 10 Mehrfachtipps, Overlays, Scrollen | Hafenamt → Riva / k1_amt | ✓ | ✓ | ✓ | ✓ | 5 Tipps auf Ausgang = 1 Ortswechsel; Doppeltipp auf Ding = 1 Antwort; Scrollen in „Laden“ (Chromium-Touch) ohne Wirkung auf die Szene |

**Testartefakt, erkannt und behoben:** Direkt aus dem Test geladene Stände schließen die Titelschicht erst im nächsten Bild. Ein sofortiger Tipp traf dort noch einen unsichtbaren Titelknopf. Im Spiel kommt das nicht vor, weil „Fortsetzen“ und „Laden“ die Schicht selbst schließen. Die Tests warten jetzt darauf.

### F2. Offene Prüfungen (echtes Gerät nötig)

| Nr. | Gerät | Prüfung |
|---|---|---|
| O1 | iPhone mit Kamera-Aussparung und Home-Indikator, Safari und Home-Bildschirm-App | Safe-Area-Ränder; Abstand der Leiste zum Home-Indikator |
| O2 | iPhone in Safari | Safari-Leisten im Querformat ein und aus: `resize` bzw. `visualViewport`, Layoutwechsel |
| O3 | iPhone und iPad | Systemgesten am Rand während des Ziehens (`pointercancel`) |
| O4 | iPhone und iPad | Ton nach Telefonat, Siri, Bildschirmsperre und App-Wechsel (`interrupted`); Stummschalter |
| O5 | iPhone und iPad | App-Wechsel und Sperre: Wird gespeichert? Fortsetzung von Satz, Szene und Übergang |
| O6 | iPhone | Bildschirmtastatur beim Benennen von Lesezeichen |
| O7 | iPhone und iPad | Installation auf dem Home-Bildschirm: getrennter Speicher, Offline-Start, Aktualisierung |
| O8 | iPad mit Trackpad | Wechsel zwischen Finger und Trackpad: Hover, Menü am Zeiger bzw. Aktionsleiste |
| O9 | iPhone SE oder mini | Kleinstes Display, ganzer Spielabschnitt mit dem Finger |
| O10 | iPhone und iPad | Lupe bzw. Textauswahl bei langem Druck auf die Spielfläche |

### F3. Abnahmekriterien (nach der Umsetzung)

| Nr. | Kriterium | Prüfung |
|---|---|---|
| K1 | Keine wesentliche Aktion setzt Hover, Rechtsklick, langen Druck, Ziehen oder Mehrfingergesten voraus. | Abläufe 1–10 nur mit Einzel-Tipps auf iPhone SE und iPhone 16 |
| K2 | Ein Tipp löst höchstens eine Spielaktion aus; Doppeltipps auf Dinge, Ausgänge und Orte bleiben einfach. | F10, F6 |
| K3 | Eine Antwortliste nimmt innerhalb von 450 ms nach dem Erscheinen keine Wahl per Tipp an; Ziffern und Pfeiltasten bleiben sofort möglich. | F5b mit 120, 250, 420 ms; `phase1` |
| K4 | Dialoge, Menüs und Overlays lassen keine Eingaben an die Szene durch; Tippen neben ein Fenster bricht nur ab. | F10 (Scrollen), `phase4` (Tipp neben ein Fenster) |
| K5 | Alle Bedienelemente sind auf iPhone SE quer und größer mindestens 44 × 44 CSS-px: Leiste, Aktionsleiste, Antwortzeilen, Menüs, „✕“ der Overlays. | `devicetests.js` Messung |
| K6 | Jeder Hotspot ist auf iPhone 16 quer mit Fangradius aus einem Feld von mindestens 24 × 24 CSS-px erreichbar, oder es erscheint eine Auswahl mit ihm. | `hotspotscan.js` mit Fangradius-Simulation; F4 (±5 Spielpx: ≥ 19/20 oder Auswahl) |
| K7 | Bedienelemente liegen außerhalb der Safe-Area-Ränder und mindestens 8 CSS-px über dem Home-Indikator. | Simulation über die Safe-Area-Sonde; O1 |
| K8 | Nach Größen- und Ausrichtungswechsel stimmen Bild und Treffer überein, auch mitten im Gespräch und mit gewähltem Gegenstand. | F8, `phase3` F25 |
| K9 | Ausrichtungs- und App-Wechsel verursachen keinen Fortschrittsverlust: Nach dem Wechsel sind Gegenstände und Notizen des laufenden Raums erhalten. | F9; O5 |
| K10 | Der Drehhinweis hält das Spiel an; danach geht es an derselben Stelle weiter. | F8 |
| K11 | Eine abgebrochene Berührung hinterlässt keinen hängenden Zustand. | F3b; O3 |
| K12 | Nach einer Unterbrechung setzt der nächste Tipp den Ton fort. | O4 |
| K13 | Die Rätsel bleiben ohne zusätzliche Lösungshinweise spielbar: Markierungen zeigen nur das Berührte; keine Hervorhebung passender Ziele; „Zeigen“ unverändert. | Sichtprüfung je Kapitel; Kampagne A–E |
| K14 | Die Desktop-Bedienung bleibt funktionsfähig. | `phase1`–`phase4`, Szenarien Chromium, WebKit, Firefox, `hudcmp.js` |
