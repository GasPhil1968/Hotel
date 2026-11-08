# MALA auf iPhone und iPad: Umsetzung des Touch-Konzepts (E1–E7)

**Auftrag:** „Alles von E umsetzen“ – die Schritte E1–E7 aus `design/TOUCH_KONZEPT.md`, Abschnitt E.
**Ausgangsstand:** Commit `346bff6` (Phase 4, Cache-Version `mala-split-47c7f7cd86`).
**Stand dieser Umsetzung:** Branch `claude/gifted-keller-rsg4ye`, Commits `1ad5e07` (E1), `a3f0a4b` (E2), `c7c6b51` (E3), `07599dc` (E4), `4cdf31a` (E5–E7), `b0b8280` (Nachfrage an schmalen Dingen, Prüfwerkzeuge) und der Abschlusscommit mit diesem Bericht.

**Wichtig:** Alle Tests liefen in Emulationen (Playwright 1.63: Chromium, WebKit und Firefox unter Linux, Apple-Geräteprofile) und in der Node-VM. Auf einem echten iPhone oder iPad wurde **nichts** geprüft. Was nur dort prüfbar ist, steht unten und in `design/touch/GERAETEPRUEFUNG.md`.

Geschichte, Rätsellogik, Texte der Figuren und das Datenmodell der Spielstände sind unverändert. Die Bedienhilfen zeigen nur, was berührt wurde; es gibt keine neuen Hinweise auf den nächsten Schritt.

---

## 1. Was sich geändert hat

### E1 – Sofortmaßnahmen (`1ad5e07`)
| Nr. | Änderung |
|---|---|
| T04 | Eine gerade erschienene Antwortliste nimmt 450 ms lang keinen Tipp oder Klick an und blendet in 150 ms auf. Ziffern, Pfeiltasten und Enter wirken sofort. |
| T10 | `pointercancel` und `lostpointercapture` setzen Ziehen, Druck und Zeiger zurück (Systemgesten, abgebrochene Berührungen). |
| T08, T09 | Ein gesperrter Figurenwechsel nennt kurz den Grund („Gerade nicht – die Szene läuft.“ …). Der Wechsel hebt Gegenstandswahl und Verb-Menü auf. |
| T11 | Der Drehhinweis im Hochformat hält das Spiel an (Musik leiser); danach geht es an derselben Stelle weiter. |
| T12 | Ton: Ein unterbrochener oder angehaltener Audio-Kontext wird beim nächsten Tipp und bei der Rückkehr in den Vordergrund fortgesetzt. |
| T13 | Zusätzlich gespeichert wird nach jeder abgeschlossenen Handlung (höchstens alle 10 s), nicht nur beim Ortswechsel und beim Verlassen. |
| T15 | Ohne Vollbild-Schnittstelle (iPhone) steht in den Einstellungen statt des Schalters der Weg über den Home-Bildschirm. |

### E2 – Treffsicherheit (`a3f0a4b`, ergänzt in `b0b8280`)
- **Fangradius bei Touch:** Trifft ein Fingertipp kein Ding, gilt das nächste Ding im Umkreis von etwa 20 CSS-px (4–12 Spielpixel je nach Maßstab), wenn es eindeutig das nächste ist.
- **„Welches?“:** Liegen zwei oder drei Dinge fast gleich nah (Unterschied unter 3 Spielpixel), liegt ein viel kleineres Ding neben dem getroffenen (Fläche ≤ ¼) oder trifft der Finger ein schmales Ding (eine Seite < 8 Spielpixel) mit einem anderen höchstens 3 Spielpixel daneben, fragt das Spiel und nennt die Namen.
- **Rückmeldung:** Tippmarke (Ring, 300 ms) an der erkannten Stelle, dünner Rahmen um das erkannte Ding, solange der Finger liegt, die Leiste offen ist oder kurz nach einem Fangtreffer. Mit der Maus ändert sich nichts.

### E3 – Telefon-Layout (`c7c6b51`)
- Die Szene steht im größten ganzzahligen Maßstab, der mit der Leiste in die Safe-Area passt. Die Leiste behält den Maßstab des gewohnten Bildes.
- Bleiben bei Touch links und rechts je mindestens 44 CSS-px frei, stehen Figur und Notizen links, Menü, Karte und Zeigen rechts; sonst stehen alle Knöpfe in einer Reihe unter dem Bild, mit einer Satzzeile darüber.
- Bei Touch sind alle Knöpfe, Inventarfelder und Pfeile mindestens 44 × 44 CSS-px. Der Satz in der Leiste bricht bei Bedarf in zwei Zeilen um, statt über das Inventar zu laufen. Schmale Knöpfe trennen an Silbengrenzen.
- Größenwechsel: zusätzlich `visualViewport`-Ereignisse (entprellt), Hysterese von 8 CSS-px, kein Layoutwechsel, solange ein Finger oder ein gezogener Gegenstand unterwegs ist.

| Gerät (Emulation, quer) | vorher | nachher |
|---|---|---|
| iPhone SE (667 × 375) | Szene 1,5 CSS-px je Spielpixel, Leistenknöpfe 22,5 hoch | **2,0**, Knöpfe unten 45 × 45, Szenenanteil 73,7 % |
| iPhone 14/15/16 (734 × 343) | 1,67, Leistenknöpfe 25 hoch | **2,0**, Seitenknöpfe 46,7 × 45, Szenenanteil 73,2 % |
| iPhone 13 (750 × 342) | 2,0 (Breitbild) | 2,0, Pfeile jetzt 45 statt 25 breit |
| iPhone 17 Pro Max (838 × 390) | 2,0 (Breitbild) | **2,33**, Szenenanteil 76,8 % |
| iPad, Desktop | gewohnte Leiste | unverändert, pixelgleich (`hudcmp`) |

### E4 – Aktionsleiste und Antwortliste (`07599dc`)
- **Aktionsleiste (neue Schicht `07_bar.js`):** Bei Fingereingabe erscheinen die Handlungen eines Dings und die Nachfrage „Welches?“ als Knöpfe (≥ 96 × 44 CSS-px) in der Leiste unter dem Bild statt als Menü am Finger. Das Ding bleibt gerahmt. „✕“ oder ein Tipp ins Bild schließt die Leiste, ohne dass die Figur losgeht.
- **Gegenstand mit einem Tipp:** Ein Tipp wählt den Gegenstand („Benutze … mit …“ in der Satzzeile). „Schau an“ und, wo vorhanden, „Lies“, „Öffne“ und die Zweithandlung stehen in einer kleinen Leiste über dem Feld; das Inventar bleibt frei. Ein zweiter Tipp, „✕“, ein Tipp auf freien Boden oder Esc heben die Wahl auf. Ziehen bleibt als Abkürzung.
- **Antwortliste bei Fingereingabe immer als HTML** (auch in der Pixelschrift): Zeilen ≥ 44 CSS-px, Wischen scrollt, Abstand zur Unterkante ≥ 8 CSS-px. Die Eingabesperre aus E1 gilt weiter.
- **„✕“ der Overlays** (Notizbuch, Karte, Dokumente, Rätsel) als HTML-Knopf 44 × 44 oben rechts im Bild, mit derselben Wirkung wie Esc (nicht bei Erinnerungen, die per Tipp weiterlaufen).
- Maus und Trackpad behalten das Menü am Zeiger und die Antwortliste im Bild; es entscheidet die letzte Eingabeart (auch beim Wechsel am iPad).
- Die Logik ist dieselbe wie im Menü am Zeiger (`M.barView`, `M.barAct` auf `E.pop`/`E.pending`).

### E5 – Plattformhinweise (`4cdf31a`)
- Einmaliger Hinweis auf iPhone und iPad: in Safari „Teilen → Zum Home-Bildschirm“ (ohne Leisten, ohne die Sieben-Tage-Löschung von Safari); in der Home-Bildschirm-App der eigene Speicher und der Weg über „Sicherung exportieren/importieren“. Der Hinweis verdeckt das Titelmenü nicht und kommt nach „Verstanden“ nicht wieder.
- Einstellungen, Abschnitt „iPhone und iPad“: Stummschalter, Spielstände (sieben Tage, Sicherung).
- `navigator.storage.persist()` auf Apple-Geräten beim ersten Tipp (ohne Rückfrage; Firefox am Desktop wird nicht gefragt).
- `LIESMICH.txt` überarbeitet; alle neuen Texte aus E1–E6 sind ins Bosnische/Kroatische übersetzt.

### E6 – iPad und Feinschliff (`4cdf31a`)
- **T22:** Auf dem Tablet rückt das Bild 6 px unter den oberen Rand, sobald darunter mindestens 132 CSS-px frei werden. Die Antwortliste steht dann unter dem Bild (iPad 7. Gen.: vier Zeilen à 44 ganz sichtbar); Szene und Leiste bleiben frei. Desktop unverändert.
- **T16:** Keine globale Gestensperre mehr. Die Seite hat `touch-action: manipulation`, das `user-scalable=no` ist entfernt; Menüs lassen sich vergrößern. Szene und Leiste bleiben ohne Zoom; ist die Seite schon vergrößert, geht das Zurückzoomen auch dort. Solange gezoomt ist, wird das Bild nicht neu ausgelegt.
- **T18:** Beim Benennen eines Lesezeichens steht das Fenster in der sichtbaren Fläche über der Bildschirmtastatur (`visualViewport`).
- **T20:** Das gedrehte Hochformatbild bleibt innerhalb der Safe Area.
- **T21 Feinwahl** (Einstellungen → Darstellung, nur mit Touch, Standard aus): Finger 0,4 s ruhig halten → Fadenkreuz 40 CSS-px über dem Finger, Rahmen und Name des Dings darunter; Loslassen wählt genau diese Stelle.

### E7 – Prüfung auf echten Geräten
`design/touch/GERAETEPRUEFUNG.md`: Prüfliste mit Schritten und erwarteten Ergebnissen für O1–O10 und die neuen Funktionen. **Nicht ausgeführt**, weil dafür echte iPhones und iPads nötig sind.

### Cache-Version und Spielstände
- Die Cache-Version des Service Workers entsteht beim Bauen aus dem Inhalt: vorher `mala-split-47c7f7cd86`, jetzt `mala-split-3ff65a6a92`. Installierte Fassungen holen sich die neue Fassung beim nächsten Start mit Internet.
- Das Datenmodell der Spielstände ist unverändert. Neu sind nur Einstellungen im Browser (`mala.fine`, `mala.hint.home`, `mala.hint.app`).

---

## 2. Abnahme K1–K14 (Touch-Konzept F3)

| Nr. | Kriterium (gekürzt) | Ergebnis | Nachweis |
|---|---|---|---|
| K1 | Keine wesentliche Aktion braucht Hover, Rechtsklick, langen Druck, Ziehen oder Mehrfingergesten | erfüllt (Emulation) | Abläufe F1–F10 mit Einzel-Tipps auf iPhone SE und iPhone 16 (`devicetests.js`); Leiste unten auf dem SE (`phase3`); Ziehen und Feinwahl sind Zusatz |
| K2 | Ein Tipp löst höchstens eine Spielaktion aus | erfüllt | F10 (Doppeltipp auf ein Ding, fünf Tipps auf einen Ausgang), F6 (Doppeltipp auf einen Ort: genau ein Ortswechsel) |
| K3 | 450 ms Eingabesperre der Antwortliste per Tipp, Ziffern sofort | erfüllt | F5b (120, 250, 420 ms), `phase5` (Tipp nach 200 ms ohne Wirkung, Ziffer sofort) |
| K4 | Dialoge, Menüs, Overlays lassen keine Eingabe an die Szene durch; Tipp daneben bricht nur ab | erfüllt | F10 (Wischen im Laden-Menü), `phase4` (Tipp neben ein Fenster), `phase5` (Tipp ins Bild schließt die Leiste ohne Gehen) |
| K5 | Alle Bedienelemente ≥ 44 × 44 CSS-px auf iPhone SE und größer | erfüllt | `phase3` (Leiste SE/16/13/17 Pro Max), `phase5` (Aktionsleiste SE, Antwortzeilen, Overlay-„✕“), `devicetests` Messung (Pausenmenü 44) |
| K6 | Jeder Hotspot auf iPhone 16 aus ≥ 24 × 24 CSS-px erreichbar oder angeboten | **weitgehend, nicht vollständig** | `hotspotscan.js --fang 10`: 1455 von 1472 Hotspot-Fällen erfüllt; 17 liegen bei 16–22 CSS-px (vorher ohne Fangradius 177 unter 24). Übrig: die jeweils andere Figur am Bildrand, das Gedränge im Pflegeheimflur, der schmale Kühlschrank bei Ana, eine Schublade, Kredenz, Tasche, Eier, Ordner. Abhilfe: Feinwahl, „Zeigen“. F4 (±5 Spielpixel neben kleinen Dingen): 19/20 getroffen oder angeboten auf iPhone SE, 16, 13 und iPad |
| K7 | Bedienelemente außerhalb der Safe-Area-Ränder, ≥ 8 CSS-px über dem Home-Indikator | **offen (nur Gerät)** | Layout rechnet in der Safe-Area-Sonde (`env(safe-area-inset-*)`); die Emulation hat keine Ränder. O1 |
| K8 | Nach Größen- und Ausrichtungswechsel stimmen Bild und Treffer, auch im Gespräch und mit gewähltem Gegenstand | erfüllt (Emulation) | `phase3` (F25, Drehen, Hysterese, Ziehen), F8 |
| K9 | Ausrichtungs- und App-Wechsel ohne Fortschrittsverlust | erfüllt (Emulation), Gerät offen | F9 (`visibilitychange`/`pagehide`), Speichern nach Handlungen; O5 |
| K10 | Drehhinweis hält das Spiel an | erfüllt | F8 (Spielzeit steht, danach weiter) |
| K11 | Abgebrochene Berührung hinterlässt keinen hängenden Zustand | erfüllt (Emulation), Gerät offen | F3b (`touchcancel` beim Ziehen, CDP); O3 |
| K12 | Nach einer Unterbrechung setzt der nächste Tipp den Ton fort | **offen (nur Gerät)** | Code (`audioResume` bei Tipp und Rückkehr); O4 |
| K13 | Keine zusätzlichen Lösungshinweise | erfüllt | `phase5`: Gegenstandswahl hebt nichts im Bild hervor (Szene pixelgleich mit und ohne Wahl); Rahmen nur am Berührten; „Zeigen“ unverändert; Kampagne A–E |
| K14 | Desktop-Bedienung funktioniert | erfüllt | `phase1`–`phase4`, `phase5` (Maus: Menü am Zeiger, Liste im Bild), Szenarien Chromium/WebKit/Firefox, `hudcmp` |

---

## 3. Abweichungen vom Konzept

- **Gegenstandsleiste über dem Feld** statt in der Inventarzeile: Sonst könnte man einen gewählten Gegenstand nicht mit einem anderen Gegenstand benutzen.
- **iPad:** Das Bild rückt 6 statt 12 px an den oberen Rand, damit vier Antwortzeilen à 44 ganz darunter passen.
- **Feinwahl** ist eine Einstellung und steht standardmäßig aus. Sonst würde langes Drücken auf ein Ding, wie es manche Spieler tun, plötzlich die Stelle über dem Finger wählen.
- **Zusätzliche Nachfrage an schmalen Dingen** (eine Seite < 8 Spielpixel): Sie stand nicht im Konzept und verbessert K6 an gestapelten Schubladen.
- **Seitenknöpfe am Desktop:** Die 44-px-Regel gilt nur bei Touch. Am Desktop bleiben die bisherigen Seitenknöpfe, damit häufige Fenstergrößen (1920 × 950) unverändert bleiben.
- **Hysterese:** Bei einer Änderung unter 8 px bleibt die bisherige Aufteilung, solange sie passt. Passt sie nicht mehr, wird neu gewählt.

---

## 4. Tests

**Abschlusslauf** auf dem ausgelieferten Stand (`web/index.html`, SHA-256 `380ebe95e6dfa08e…`, Cache-Version `mala-split-3ff65a6a92`), alles Emulation bzw. Node-VM:

| Prüfung | Ergebnis |
|---|---|
| `qa/ui/phase1.js` (Esc-Stapel, Antwortlisten, Figurenknopf, Hochformat) | 33/33. Im ersten Durchgang 32/33: Der Test „Drehhinweis nach dem Neuladen nicht erneut“ verlor unter der Last der parallel laufenden Kampagne einen localStorage-Eintrag (im Test selbst als Chromium-Verhalten in frischen Kontexten beschrieben). Wiederholung in Ruhe: 33/33. |
| `qa/ui/phase2.js` (HTML-Schicht, Spielstände, Einstellungen, Schriften) | 64/64 |
| `qa/ui/phase3.js` (Leiste, jetzt mit iPhone SE, 16, 13, 17 Pro Max, Hysterese, Ziehen, Drehen, Gegenstand mit einem Tipp, HTML-Antwortliste) | 52/52 |
| `qa/ui/phase4.js` (Untertitel, Schnellvorlauf, Sicherung, „Zuletzt“, Lesezeichen) | 92/92 |
| `qa/ui/phase5.js` (neu: Aktionsleiste, Maus unverändert, HTML-Antwortliste mit Sperre, Overlay-„✕“, iPad, Gesten, Feinwahl, iOS-Hinweise, Tastatur nachgestellt) | 31/31 |
| `qa/ui/savecompat.js` (neu: 16 erspielte Stände auf iPhone/Finger und Desktop/Maus laden, vergleichen, speichern, neu laden) | 33/33 |
| `qa/ui/hudcmp.js` gegen den Stand vor der Touch-Arbeit (`346bff6`) | Desktop und iPad in 4 Zuständen pixelgleich (8/8) |
| `qa/regress/run.js` (Regressionen BUG-001 … BUG-009) | 9/9 |
| Browser-Szenarien `qa/browser/scenarios.js` | Chromium 16/16, WebKit 15/15, Firefox 11/11 |
| Bedienabläufe `design/touch/devicetests.js` (F1–F10, F3b, F5b; iPhone SE, 16, 13, iPad, Desktop) | 57 Abläufe, 201 bestandene Schritte, 0 Befunde; 1 Ablauf bewusst ohne Wertung (Drehen am Desktop). Ergebnisse und Bilder: `design/touch/nachher/` |
| Hotspot-Erreichbarkeit `hotspotscan.js --fang 10` (Kapitel 1–4, 315 Raumzustände) | 1455/1472 ≥ 24 CSS-px (K6, siehe oben) |
| Simulationskampagne (Node-VM, `qa/sim.js`, 2 Worker) | A 4/4, B 19 + 5 offen, C 11 + 1 offen, D 24/24 (Speichern/Laden ohne Abweichung), E 18 + 6 offen; kein Fehlschlag, dieselben Zahlen wie in Phase 3 und 4. Die Sackgassen-Sonde fand bei keinem offenen Lauf einen Softlock. |

**An den Tests geändert** (wegen des neuen Verhaltens, nicht um Befunde zu verdecken):
- `phase3`, `devicetests.js` und `scenarios.js` bedienen bei Fingereingabe die HTML-Leiste und die HTML-Antwortliste statt der Canvas-Zeilen.
- Pfeile werden jetzt mit ≥ 44 statt ≥ 24 CSS-px geprüft.
- „Freier Boden“ wird außerhalb des Fangradius gewählt; sonst gilt der Tipp, wie gewollt, dem Ding daneben.
- F5b tippt zuerst ins Bild, wenn die Antwortliste unter dem Bild steht (iPad).
- `devicetests.js` schreibt die Ergebnisse nach der Umsetzung nach `design/touch/nachher/`. Die Belege der Analyse bleiben unverändert.

## 5. Nur auf echten Geräten prüfbar

O1 Safe Area und Home-Indikator (K7) · O2 Safari-Leisten · O3 Systemgesten beim Ziehen · O4 Ton nach Anruf, Siri, Sperre, Stummschalter (K12) · O5 App-Wechsel und Sperre · O6 Bildschirmtastatur beim Benennen · O7 Home-Bildschirm (Speicher, offline, Aktualisierung) · O8 iPad mit Trackpad · O9 kleinstes iPhone, ganzer Abschnitt · O10 Lupe/Textauswahl bei langem Druck. Schritte und erwartete Ergebnisse: `design/touch/GERAETEPRUEFUNG.md`.
