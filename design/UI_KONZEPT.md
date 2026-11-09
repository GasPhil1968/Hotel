# MALA – Oberfläche: Analyse und Entwurf

Geprüfte Fassung: `web/index.html`, SHA-256 `5ddc4f3c29d8d46332504bc8cea2ecc78b406729f93e77a7bad572c9df2be115` (identisch mit `dist/MALA_netlify_korrigiert.zip`). Klickbarer Entwurf: https://claude.ai/artifact/W8o3QnYDp8TEz9ayPLmVcP (Quelle `design/prototype/`).

Stand 7. November 2026: Die sechs Entscheidungen des Autors sind eingearbeitet (Abschnitt „Entscheidungen“). Es sind keine Entscheidungsfragen mehr offen.

Stand 8. November 2026: Alle vier Phasen sind umgesetzt. Was wie umgesetzt und geprüft ist und wo die Umsetzung abweicht, steht in `design/UMSETZUNG.md`.

Kennzeichnung der Aussagen:
- **[B]** im laufenden Spiel beobachtet (Browser, Bildschirmfoto oder Messung unter `design/evidence/`)
- **[C]** im Code oder in Assets festgestellt (Fundstelle `datei:zeile`, relativ zu `game/src/`, sofern nicht anders angegeben)
- **[V]** gestalterischer Vorschlag
- **[E]** Entscheidung des Autors
- **[N]** mangels Zugriff nicht überprüfbar

## Entscheidungen

| Nr. | Frage | Entscheidung **[E]** | Folgen im Entwurf |
|---|---|---|---|
| 1 | Kapitelsperre | **Ja.** Ein Kapitel ist erst nach dem Ende des vorigen startbar. Das ersetzt „ohne Sperre und ohne Rückfrage“ aus `BERICHT_K2.md:14`. **Später geändert (Autor, Kapitelwahl am Anfang):** Die Kapitelwahl ist frei; die Sperre bleibt als Schalter (`M.CHAPTER_LOCK`, `?kapitel=sperre`), siehe `BERICHT_K5.md`. | D1 (Kapitelwahl, Beispielstände, Kapitel 5), E Phase 2 (Testschalter, QA-Werkzeuge), F20 |
| 2 | Ankündigung „Kapitel 5: Sarajevo“ im Abspann von Kapitel 4 | **Bleibt** (`96_k4_story.js:318`). | D3; die Kapitelwahl nennt Sarajevo als Ort von Kapitel 5 erst nach diesem Abspann (D1) |
| 3 | Liste der Mitwirkenden | **Entfällt.** Kein Eintrag „Mitwirkende“. | D1, D16 |
| 4 | Leseschrift | Wahl dem Entwurf überlassen → **Atkinson Hyperlegible Next** (OFL 1.1), Abdeckung gegen alle Spieltexte geprüft. | C „Schrift“, D5, E Phase 2, F21 |
| 5 | Breitbild-Leiste | **Kommt.** | B2-11, D17, E Phase 3, F22–F25 |
| 6 | Malas Stimme-Zeilen im Hafenbüro, alle 24 s (`rooms/office.js:38, 95–98`) | **Bleiben wiederkehrend**, keine Änderung. | – |

---

## A. Bestandsaufnahme

### Was tatsächlich geprüft wurde

| Bereich | Weg | Belege |
|---|---|---|
| Titel, Platzwahl, Überschreiben, Beispielstände, „Über das Spiel“, Sprache | Chromium 1280×800 (Maus); WebKit-Emulation iPhone 13 quer und hochkant (Touch); Chromium-Emulation iPad gen 7 quer (Touch) | `design/evidence/{desktop,phone,phonePortrait,tablet}/*.png`, `capture.json` |
| Intro Kapitel 1 in Echtzeit (Zeilen und Zeitpunkte) | Chromium, ohne Eingabe gewartet | `design/evidence/desktop/capture.json` → `intro` |
| Leiste, Verb-Popup, Zeigen, Notizbuch, Karte, Pausenmenü, Speichern, Hinweise, Spielanleitung, Gespräch, Dokument, Rätsel, Inventar, Mala-Sicht | gleiche vier Geräte; Spielstände aus regulär erspielten Ständen (`qa/results/browser/states.json`) | wie oben |
| Escape-Verhalten je Zustand | Tastendruck, Zustand vorher/nachher protokolliert | `capture.json` → `esc` |
| Tippflächen aller Bedienelemente | jedes der 320×200 Spielpixel über `M.uiHit` abgefragt, umgerechnet mit dem tatsächlichen Canvas-Maßstab | `design/evidence/geometry.md` |
| Kontraste | WCAG-Formel auf die Palettenwerte aus `00_core.js:9–57` | Abschnitt C |
| Kapitelkarten, Abspann, Titel nach Kapitelende | Produktionscode in der Node-VM gerendert (kein Browser) | `design/evidence/vm/*.png` |
| Code: Titel, Menüs, Speichern, Laden, Autosave, Einstellungen, Eingabe, Hinweise, Audio | vollständige Durchsicht mit Fundstellen | Fundstellen im Text |

**[N] Nicht überprüfbar:** echte iPhones/iPads (nur Emulation); hörbare Wirkung von Musik und Geräuschen (Prüfumgebung ohne Ton); Vollbild und Ausrichtungssperre auf iOS; Bildschirmleser; Verhalten bei vollem Browser-Speicher (nur im Code gelesen).

### Enthaltene Kapitel
**[C]** Kapitel 1 Split, Kapitel 2 Sarajevo, Kapitel 3 Mostar, Kapitel 4 München (vorletztes Kapitel). Kapitel 5 ist nicht enthalten; der Abspann von Kapitel 4 kündigt es an („FORTSETZUNG / Kapitel 5: Sarajevo“, `96_k4_story.js:315–318`), danach erscheint das normale Hauptmenü. MALA steht für sich; Bezüge zu anderen Projekten gibt es im Code nicht.

### Was trägt und erhalten bleiben soll
- **[B]** Die Szenen: handgebaute Pixel-Kunst mit klarer Lichtführung (Laternen, Fenster, Neon). Sie ist der Kern der Atmosphäre und wird nicht angetastet.
- **[B]** Das Titelbild: Split bei Nacht, Glockenturm, zwei Laternen, und auf der Mole Mala als flimmernde Gestalt, darunter fährt eine Fähre. Stimmig und unverwechselbar.
- **[B][C]** Zwei Lichtfarben mit Bedeutung: warmes Bernstein für Marko und die Leiste, kühles Eisblau für Mala. Als Mala färbt sich die Szene kühl, die Leiste wird türkis, Mala selbst bleibt warm gezeichnet (`06_ui.js:15, 47–54`).
- **[B]** Papier als zweite Ebene: Notizbuch mit roter Randlinie, Briefe, Rätselblätter, Stadtplan auf Papier mit Legende „hier · gerade nicht · noch nicht“.
- **[B]** Kapitelkarten im Kartenstil („Prolog / Die Stillen / Split / Dienstag, 15. November 2011 · Nachmittag“) und das sepiafarbene Erinnerungsbild „Im Bus“.
- **[B]** Gespräche im Stil von Brustbild plus Antwortliste unten (Repository-Wurzel `KONZEPT.md:173`).
- **[C]** Hinweise nur auf Wunsch, in vier Stufen; die letzte Stufe fragt ausdrücklich „Soll ich dir den konkreten nächsten Schritt verraten?“ (`15_hints.js:31–77`). Das entspricht der Vorgabe „keine automatischen Lösungshinweise“.
- **[C]** Häufiges automatisches Speichern; Option „Text: wartet auf Tippen“; Sprache Bosanski/Hrvatski; Offline-Fähigkeit.

### Kurzurteil
Welt und Erzählung sind sorgfältig; die Systemoberfläche (Titel, Pause, Spielstände) ist dagegen eine Folge gleich gewichteter Textzeilen, die an mehreren Stellen kollidiert, am Smartphone zu kleine Tippflächen hat und beim Speichern ein Modell verwendet, das manuelle Stände nicht schützt.

---

## B. Priorisierte Problemliste

Priorität: **1** = vor der nächsten Veröffentlichung beheben, **2** = gehört zur Überarbeitung, **3** = sinnvoll, nicht dringend.

### B1. Bedienfehler (funktional)

| Nr. | Bereich | Befund | Auswirkung | Verbesserung | Prio |
|---|---|---|---|---|---|
| 1 | Speichern | **[C]** Jeder Raumwechsel (`05_engine.js:495`), 103 Skriptstellen `A.save()`, „Zum Titelbild“ und Tab-Wechsel (`99_main.js:50–51`) schreiben in denselben Schlüssel `mala.save.N` wie „Speichern“ im Menü (`05_engine.js:510–546`). | Ein manueller Stand hält nur bis zum nächsten Raumwechsel; man kann keinen Punkt vor einer Entscheidung festhalten (etwa die Zustimmung am Ende von Kapitel 3, die Kapitel 4 prägt). „Speichern“ ist praktisch wirkungslos. | Je Platz ein automatischer Stand und drei Lesezeichen mit eigenen Schlüsseln (D6/D7). | 1 |
| 2 | Kapitelende | **[C]** Am Kapitelende wird der Stand gelöscht (`90_story.js:211–212`, ebenso K2–K4). „Weiter mit Kapitel N“ gibt es nur direkt nach dem Abspann (`06_ui.js:541, 557`). | Wer nach dem Abspann „Zum Titelbild“ wählt oder den Tab schließt, findet kein „Fortsetzen“ mehr und muss das Kapitel selbst suchen. | Stand bleibt als „Kapitelende“ erhalten; „Fortsetzen“ führt zur Weiter-Karte (D3). | 1 |
| 3 | Kapitelwahl | **[B][C]** Kapitel 1–4 sind ab dem ersten Start wählbar, mit Ortsnamen (`06_ui.js:542`); Kapitel 4 startet dann mit Vorgaben statt der Entscheidung vom Ende von Kapitel 3. | Spoiler vor dem ersten Klick; Ausgangszustand wird umgangen. `BERICHT_K2.md:14` (Repository-Wurzel) hielt „ohne Sperre und ohne Rückfrage“ als Absicht fest; **[E]** jetzt entschieden: Sperre. **[C]** Eine Abfrage `M.ch2Unlocked` gibt es schon (`96_k2_story.js:27`), sie wird nirgends benutzt. | Nur erreichte Kapitel startbar, über die vorhandenen Marken `mala.c1end…c3end` (D1); Testschalter für die QA-Werkzeuge (E). | 1 |
| 4 | Touch | **[B]** Smartphone quer, kleinste Seite der Tippfläche: Titelzeilen **15 CSS-px**, Platz-/Bestätigungszeilen 21,7, Pausenmenü 20, Dialogzeilen 18,3, Verb-Popup 21,7, „X“ und ▲/▼ 23,3, Inventarpfeile 16,7 breit, „Vorlesen“ 23,3 (`design/evidence/geometry.md`). | Unter dem WCAG-2.2-Minimum von 24 CSS-px (SC 2.5.8); Fehltipps, besonders im Pausenmenü und bei Antworten. | Mindestens 24 CSS-px sofort im Canvas (Zeilenhöhen auf 15 Spielpixel bei Touch); Menüs in der HTML-Schicht mit ≥ 44 CSS-px (D1–D7). | 1 |
| 5 | Escape | **[B]** Verb-Popup offen + Esc: Popup schließt **und** das Pausenmenü öffnet sich. Gegenstand gewählt („Benutze Džezva mit …“) + Esc: Menü öffnet sich, die Auswahl bleibt (`capture.json` → `esc`). | Esc tut zwei Dinge oder das falsche; man landet unerwartet im Menü. | Ebenen-Stapel: Esc schließt nur die oberste Ebene (Popup → Gegenstandswahl → Overlay → Menü); erst ohne offene Ebene öffnet Esc die Pause. | 1 |
| 6 | Tastatur | **[C]** Titel, Menüs und Antwortlisten sind nicht per Tastatur bedienbar; Esc wirkt im Titel nicht; Tasten entsperren kein Audio (`06_ui.js:668–672`, `99_main.js:46–48`). | Desktop-Spieler ohne Maus kommen nicht ins Spiel; Ton startet erst mit dem ersten Klick. | Pfeile/Enter/Esc in allen Menüs; Ziffern 1–9 in Antwortlisten; Audio-Freigabe auch bei `keydown`. | 2 |
| 7 | Meldungen | **[B]** „Offline bereit ✓“ (HTML, unten Mitte) verdeckt im Titel die Zeile „Über das Spiel“, am Smartphone zwei Zeilen, im Spiel Inventarfelder (bisher UI-002). | Kurzzeitig nicht lesbar/antippbar. | Kleine Marke oben rechts, nie über Bedienelementen (D14). | 2 |
| 8 | Meldungen | **[B]** „Gespeichert.“ erscheint im offenen Pausenmenü auf der Zeile „Vollbild“ und bleibt bis zum Schließen (die Spielzeit steht, `06_ui.js:511, 564`). | Bestätigung verdeckt einen Eintrag und wirkt wie ein Fehler im Menü. | Rückmeldung im Speichern-Bildschirm an der betroffenen Karte bzw. als Toast über dem Panel (D6). | 2 |
| 9 | Fortsetzen | **[B][C]** „Fortsetzen“ öffnet immer die Platzwahl, auch bei nur einem Stand (`06_ui.js:535–537`); der Zeitstempel `at` wird gespeichert, aber nie gezeigt (`05_engine.js:519`). | Ein unnötiger Schritt; unklar, welcher Stand der neueste ist. | „Fortsetzen“ = jüngster gültiger Stand, direkt; Auswahl unter „Spiel laden“. | 2 |
| 10 | Bestätigung | **[B]** „Auf Platz 1 liegt ein Spielstand. Neu beginnen?“: „Ja, Platz 1 neu beginnen“ steht oben und ist hervorgehoben. | Zerstörerische Wahl ist die naheliegende. | Bisher/neu nebeneinander, Fokus auf „Abbrechen“, Verb auf dem Knopf (D8). | 2 |
| 11 | Ladefehler | **[C]** Ein beschädigter Platz erscheint als „leer“ und ist trotzdem wählbar; Meldung erst nach dem Tipp („Spielstand beschädigt.“, `06_ui.js:537`). Im Spiel heißt jeder Ladefehler „Kein Spielstand.“ Eine Ausnahme nach `setGame` kann den Zustand teilweise ersetzen (`05_engine.js:528–542`). Das Versionsfeld `v` wird nie geprüft. | Verwirrende Zustände; im Fehlerfall möglicher Verlust des laufenden Spiels. | Zustände „beschädigt“/„inkompatibel“ sichtbar; Laden mit Sicherung und Rücksprung bei Fehler (D7). | 2 |
| 12 | Speichern | **[C]** Während Szenen ist „Speichern“ nur ausgegraut, ohne Grund (`06_ui.js:498`); ein voller Browser-Speicher meldet dasselbe wie ein verbotener Ort („Hier geht Speichern nicht.“). | Spieler wissen nicht, warum und wann es wieder geht. | Grund am Eintrag; getrennte Fehlertexte (D6). | 2 |
| 13 | Hochformat | **[B][C]** Im Hochformat dreht das Spiel das Bild um 90°, ohne Erklärung; der vorbereitete Hinweis „Dreh das Gerät quer.“ ist immer verborgen (`game/build.js:31`, `99_main.js:30`). | Erster Eindruck: Spiel liegt quer. | Einmaliger Hinweis mit „Gedreht weiterspielen“ (D15). | 2 |
| 14 | Pause | **[C]** Das Menü hält Spielzeit und Abläufe an, die Musik läuft weiter (`05_engine.js:551–560`). Notizbuch, Karte und Dokumente halten die Spielzeit nicht an. | Zeitgesteuerte Dinge laufen weiter, während man liest. | Musik im Menü dämpfen; Spielzeit auch bei Notizbuch, Karte und Dokumenten anhalten. | 3 |
| 15 | Zeiger | **[C]** Rechtsklick wirkt wie Linksklick (keine Tastenprüfung, `99_main.js:35–45`). | Unerwartete Handlungen. | Rechtsklick = „Schau an“ bzw. Auswahl aufheben (zusätzlich, nie einzig). | 3 |

### B2. Visuelle Schwächen

| Nr. | Bereich | Befund | Auswirkung | Verbesserung | Prio |
|---|---|---|---|---|---|
| 1 | Über das Spiel | **[B]** Text liegt ohne Fläche über dem abgedunkelten Logo; Zeilen kollidieren mit „MALA“ und der Unterzeile (`evidence/desktop/24_titel_ueber.png`). | Schwer lesbar, wirkt fehlerhaft. | Karte mit Fläche (D16). | 1 |
| 2 | Dokumente | **[B]** Briefzeilen sind länger als das Papier und werden ein zweites Mal umbrochen: einzelne Wörter („einer“, „Fleisch“) stehen auf eigener Zeile (`evidence/desktop/30_dokument_brief.png`). | Unruhiger Satz, Briefe wirken unfertig. | Absätze statt fester Zeilen umbrechen; Waisen vermeiden (`06_ui.js:310–319`). | 2 |
| 3 | Kapitelkarten | **[C]** Kartentexte werden nicht umbrochen; die Unterzeile der Karte „Zweiter Feiertag“ ist 537 px breit und wird abgeschnitten (`96_k4_story.js:227`, `06_ui.js:554–556`). | Text fehlt. | Umbruch auf 280 px, zweizeilig. | 2 |
| 4 | Zeigen | **[B]** In Markos Wohnung 20 Namen gleichzeitig; sie überlagern sich und Marko (`evidence/desktop/13_zeigen.png`). | „Zeigen“ verdeckt genau die Szene, die es erklären soll. | Punkte für alle, Namen nur für Ausgänge und Personen; weitere beim Antippen eines Punkts (D9). | 2 |
| 5 | Kontrast | **[B][C]** „Zurück“ auf Papier 2,03:1 (s3 auf s5); Hinweistexte auf Papier 3,32:1 (s2 auf s5); Titelzeilen über dem Wasser bis 3,68:1 (x4 auf a3); gesperrte „Karte“ 1,36:1; leere Plätze 1,68:1. | Unter 4,5:1 für Text; Gesperrtes kaum von Abwesendem zu unterscheiden. | Tokens in C; Gesperrtes zusätzlich gestrichelt und mit Grund. | 2 |
| 6 | Hauptmenü | **[B]** 7–8 gleich gewichtete Zeilen in derselben Farbe; kein Hauptweg; die Unterzeile nennt alle vier Städte schon vor dem ersten Klick. | Kein Einstieg „auf einen Blick“; Spoiler. | D1. | 2 |
| 7 | Pausenmenü | **[B]** 13 Zeilen, Aktionen und Einstellungen gemischt, das Panel füllt fast die Bildhöhe (`evidence/desktop/16_menue.png`). | Langes Suchen; am Smartphone eng. | 7 Einträge, Einstellungen als eigene Seite (D4). | 2 |
| 8 | Figurenwechsel | **[B][C]** Der Knopf zeigt die andere Figur nur mit ihrem Namen („Mala“ bzw. „Marko“, `06_ui.js:172–177`); solange Mala fehlt, ein leerer Rahmen. | „Mala“ unter dem Porträt liest sich leicht als „du bist Mala“. | Beschriftung „↔ Mala“; ohne Mala Markos Porträt (D9). | 2 |
| 9 | Inventar | **[C]** Der neueste Gegenstand blinkt dauerhaft (`E.invNew` wird nie gelöscht, `05_engine.js:241`, `06_ui.js:163`). | Dauerreiz am Bildrand. | Blinken bis zum ersten Ansehen. | 3 |
| 10 | Anleitung | **[B]** „Spielanleitung“ spielt lange Sprechblasen von Marko ab (`evidence/desktop/37_k2_anleitung.png`). | Nicht nachlesbar, nicht überspringbar im Einzelnen. | Seite „Steuerung“ im Pausenmenü (D4). | 3 |
| 11 | Bildfläche | **[B]** Smartphone quer: 31 % der Fläche bleiben schwarz; Szene 533×240 CSS-px. Tablet quer: 34 % ungenutzt (`geometry.md`). | Kleine Figuren und Hotspots am Telefon. | Breitbild-Leiste, **[E]** entschieden (D17). | 2 |
| 12 | Kapitelende | **[B]** Nach dem Abspann ein Kasten über dem Titelbild („Split ist zu Ende. Weiter nach Sarajevo?“, `evidence/vm/k1_ende_01_title.png`); Überspringen des Abspanns ist nicht sichtbar. | Wirkt technisch, bricht den Kartenstil. | D3. | 3 |

### B3. Optionale Erweiterungen

| Nr. | Erweiterung | Nutzen | Prio |
|---|---|---|---|
| 1 | ~~Breitbild-Leiste~~ – **[E]** entschieden, nicht mehr optional: D17, Phase 3. | – | – |
| 2 | **Leseschrift und große Texte auch in Gesprächen** über eine HTML-Untertitelschicht, deckungsgleich mit dem Canvas. Die Leseschrift selbst ist entschieden (C „Schrift“); für Menüs kommt sie mit Phase 2. | Textgröße wählbar, ohne die Szenen neu zu zeichnen. | 3 |
| 3 | **Sicherung als Datei** (Export/Import, JSON mit Versionsnummer und Prüfsumme). Ausdrücklich ohne Cloud-Versprechen. | Schutz vor gelöschten Browserdaten, Gerätewechsel von Hand. | 3 |
| 4 | **„Zuletzt“-Karte beim Fortsetzen**: Ort, Kapitel, die drei zuletzt notierten Notizen (Wortlaut aus dem Notizbuch, keine Lösung). | Wiedereinstieg nach Pausen. | 3 |
| 5 | **Schnellvorlauf für gesehene Szenen** (Esc gedrückt halten), technisch als beschleunigter Ablauf, nicht als Sprung. | Wiederholungen, Tests. | 3 |
| 6 | Abspann bereits beendeter Kapitel unter „Über MALA“; Namen für Lesezeichen. | Komfort. | 3 |

---

## C. Gestalterische Richtung: „Zwei Lichter auf Papier“

**Hauptempfehlung.** Die Welt bleibt Pixel-Kunst im Canvas. Die Bedienung bekommt ein eigenes, kleines System aus drei Materialien, die im Spiel schon vorkommen und eine Bedeutung tragen:

1. **Nacht** (Tinte, `k0 #08070d`, `k1 #13111c`): Grund für alles, was das Spiel steuert – Titel, Pause, Einstellungen, Leiste. MALA spielt fast immer bei Dämmerung oder Nacht.
2. **Lampenlicht** (Bernstein, Ramp `y`): Marko, der Lebende, und alles, was der Spieler mit ihm tut – Auswahl, Fokus, Hauptweg. Die Laternen des Titelbilds und die bisherige Leiste sind schon so gefärbt.
3. **Geisterlicht** (Eisblau, Ramp `x`): Mala – Logo, ihre Sicht, Zustände, die das Spiel meldet („automatisch gespeichert“).
4. **Papier** (`s5 #e3d9c0`, rote Randlinie `r4`, blaue Linien `b4`): alles, was man liest, sammelt und aufhebt – Notizbuch, Briefe, Rätsel, Karte und neu die **Spielstände als Lesezeichen im Notizbuch**. Marko ist Übersetzer und schreibt Texte; das Notizbuch ist seine Werkbank.

Warum diese Richtung und keine andere: Sie kommt ohne neue Bildsprache aus und schärft nur, was die Szenen, das Titelbild und die Paper-Overlays schon erzählen (Leben/Tod als warm/kalt, Ermittlung als Papier). Horror-Rahmen, Runen, Glas-Effekte oder Neon würden der ruhigen, melancholischen Stimmung widersprechen. Blackwell bleibt Bezug für die Rolle der Geisterwelt; die Mittel sind eigene (zwei Lichtfarben, Papierebene, MALA-Schrift).

### Farben (alle aus `00_core.js:9–57`)

| Token | Wert | Funktion | Kontrast |
|---|---|---|---|
| `--ink0` | `#08070d` (k0) | Grund, Abdunkelung (74 %) | – |
| `--ink1` | `#13111c` (k1) | Panels | – |
| `--ink2` | `#1e1b2a` (k2) | Hover/Auswahl-Fläche | – |
| `--lamp1` | `#6a400e` (y1) | Rahmen (Marko) | – |
| `--lamp3` | `#d99a33` (y3) | Text Leiste/Aktionen | 8,2:1 auf k0 |
| `--lamp4` | `#f3c75c` (y4) | Fokus, Marker ▸, Hauptweg | 11,7:1 auf k1 |
| `--lamp5` | `#fff0a6` (y5) | ausgewählter Text | 17,5:1 auf k0 |
| `--ghost2` | `#2c6074` (x2) | Rahmen (Mala), Meldungen | – |
| `--ghost4` | `#82c1c9` (x4) | Mala-Text, Statuszeilen | 9,3:1 auf k1 |
| `--ghost5` | `#c3ecee` (x5) | Logo „MALA“ | 15,8:1 auf k0 |
| `--text` | `#e3d9c0` (s5) | Fließtext auf Nacht | 14,3:1 auf k0 |
| `--muted` | `#a39882` (s3) | Nebentext auf Nacht | ≈ 7:1 auf k0 |
| `--paper` / `--paper2` | `#e3d9c0` / `#f5efe0` (s5/s6) | Papierflächen | – |
| `--paper-ink` | `#08070d` | Text auf Papier | 14,3:1 |
| `--paper-muted` | `#5a5248` (s1) | Nebentext auf Papier (ersetzt s2/s3) | 5,5:1 |
| `--seal2` | `#79212e` (r2) | Überschriften auf Papier | 7,2:1 |
| `--seal` | `#cc5f68` (r4) | Warnung, Zerstörerisches, „neu“ | 5,2:1 auf k0 |
| `--exit` | `#8b9a55` (g5) | Ausgänge beim „Zeigen“ | 6,6:1 auf k0 |
| `--dis` | `#7d7364` (s2) | gesperrt (immer mit Grund in Worten) | 4,3:1 auf k0 |

Regeln: Information nie nur über Farbe – Auswahl trägt zusätzlich den Marker „▸“, Gesperrtes einen gestrichelten Rahmen und einen Grund („nach der Szene“), Zerstörerisches ein ausgeschriebenes Verb.

### Schrift
- **„MALA Pixel“** für alle Oberflächen: aus der Bitmap-Schrift des Spiels erzeugt (`design/tools/makefont.js`, 145 Glyphen, 19,8 KB, inkl. ä ö ü ß č ć š ž đ „ “ … ▸ ↔ ✓). Eine Quelle für Canvas und HTML; pixelgenau bei 10 px × n. **[B]** Probedruck im Browser deckungsgleich mit der Canvas-Schrift.
- Größen in Vielfachen von u (CSS-px je Schriftpixel): Text `10u` (Versalhöhe 7u), Überschrift `20u`, Logo bleibt `M.big` ×4 im Canvas. Zeilenhöhe `12u`.
- u: Smartphone 2 (Versalhöhe 14 CSS-px; heute 11,7), Tablet 3, Desktop 3 (heute 4 – das Menü wird ruhiger, bleibt groß).
- **Leseschrift „Atkinson Hyperlegible Next“** **[E]** als Einstellung „Schrift: Lesbar“ (D5). Sie gilt für Menüs (Phase 2) und mit der Untertitelschicht für Gespräche (B3-2). Überschriften und das Logo bleiben in MALA Pixel.
  - Herkunft: „The Atkinson Hyperlegible Next Project Authors“, SIL Open Font License 1.1 (`design/assets/AtkinsonHyperlegibleNext-OFL.txt`); Dateien aus `@fontsource/atkinson-hyperlegible-next` 5.3.0.
  - Umfang: Schnitte 400 und 700, je Untermenge latin und latin-ext als woff2 (`design/assets/`). Das sind 19,0 KB (400) und 19,8 KB (700); die Dateien werden lokal eingebettet und funktionieren offline.
  - **[B]** Abdeckung geprüft (`design/tools/fontcheck.js`, Ergebnis `design/evidence/fontcheck.txt`), und zwar gegen jedes Zeichen in den Zeichenketten aller 297 Quelldateien unter `game/src/`, einschließlich `rooms/` und der Übersetzungen in `lang/`. Ergebnis:
    - Alle Buchstaben der deutschen und bosnisch-kroatischen Texte sind enthalten, auch đ/Đ, č ć š ž, à á â è é ê ì í ò ó ô ù ú und „ “ ‚ ‘ … – —.
    - Es fehlen nur die Symbole → ↓ ↔ ▸ ☎ ✓ ✝ ⟨ ⟩ sowie das lange ſ. Alle stehen in MALA Pixel und kommen über die Schriftenfolge (`font-family: 'Atkinson Hyperlegible Next', 'MALA Pixel'`).
  - **Regel:** Rätsel und Dokumente, deren Lösung an Buchstabenformen hängt, bleiben immer in MALA Pixel. **[C]** Beispiel ist die Bauakte 1894 in Kapitel 2: ſ gegen f, n gegen u, Wörter in ⟨ ⟩ (`rooms/obala.js:35–41`).

### Raster, Flächen, Zustände
- Abstände in u: 1 · 2 · 4 · 6 · 8 · 12 · 16. Panel-Innenabstand 6u, Kartenabstand 5u.
- Zeilen: `max(44px, 16u)` hoch; im Canvas bei Touch mindestens 15 Spielpixel (≥ 25 CSS-px am Telefon).
- Panels: `ink1` 97 %, Rahmen 1u in `lamp1` (als Mala `ghost2`), außen 1u `ink0`, harter Schatten 2u. Kein Blur, keine Rundungen – passend zur Pixel-Kunst.
- Zustände: normal (`text`), Hover/Fokus (`lamp5` auf `ink2`, Marker ▸, Fokusrahmen 1u `lamp4`), gewählt (wie Fokus, bleibt), gesperrt (`dis`, gestrichelt, Grund), Fehler (`seal`, Siegel „!“), Erfolg (`ghost4`, ✓).
- Bewegung: Überblenden 150–250 ms; Fokus ohne Animation. „Bewegung reduzieren“ und `prefers-reduced-motion`: kein Bildwackeln, kein pulsierender Kopfschmerz-Rand, ruhige Fähre und Wasser.
- Ton: vorhandene Effekte – „click“ für Auswahl, „page“ für Papier, „nope“ für Ablehnung.

---

## D. Entwurf je Bildschirm

Alle Entwürfe sind im Prototyp anklickbar (https://claude.ai/artifact/W8o3QnYDp8TEz9ayPLmVcP), mit Umschalter „Ist“ (Bildschirmfoto heute) und den vier Geräten. Szenenbilder dort sind unveränderte Ausschnitte des Spiels.

### D1. Hauptmenü
- **Bild:** das vorhandene Titelbild, unverändert animiert. **[V]** neues Asset: das Wasser bis zum unteren Rand verlängern (heute Zeilen 144–199 schwarz; das Wasser wird prozedural gezeichnet, der Aufwand ist klein).
- **Titel:** „MALA“ wie heute (×4, Eisblau, Schatten). Die **Unterzeile wächst mit der Reise:** erster Start „Split“, nach Kapitel 1 „Split · Sarajevo“ usw.
- **Einträge mit Spielstand:** Karte „**Fortsetzen**“ (Vorschaubild, „Kapitel 2 · Busbahnhof“, „heute 19:42 · 1 Std. 12 Min.“), dann *Neues Spiel*, *Spiel laden*, *Einstellungen*, *Über MALA*. **Ohne Spielstand:** *Neues Spiel* (hervorgehoben), *Spiel laden* (zeigt dann die Beispielstände), *Einstellungen*, *Über MALA*. Sprache steht unter Einstellungen; beim allerersten Start wird sie aus der Browsersprache vorbelegt (hr/bs/sr → Bosanski/Hrvatski).
- **Begründung der Struktur:** Vier Einträge statt sieben bis acht. Einen Eintrag „Mitwirkende“ gibt es nicht (**[E]**); „Über MALA“ enthält Beschreibung und Abspann beendeter Kapitel (D16). Die Kapitelwahl ist keine eigene Zeile, sondern Teil von „Neues Spiel“, sobald mehr als ein Kapitel erreicht ist.
- **Lage:** Standard unten mittig über einem Verlauf (Text ≥ 9:1). Smartphone quer: Spalte links über dem dunklen Marjan-Hang und dem Seitenrand – Mala und die Laternen bleiben frei.
- **Bedienung:** Maus: Hover = Fokus. Tastatur: ↑/↓, Enter, Esc (zurück aus Unterseiten); Fokus startet auf dem Hauptweg. Touch: ganze Zeile tippbar, ≥ 44 CSS-px. Ton: Titelmusik startet mit der ersten Eingabe (auch Taste); kleine Ton-Marke oben rechts.
- **Fortsetzen:** jüngster Stand nach `at` über alle Plätze, nur wenn er lesbar und kompatibel ist (Phase bekannt, `v` ≤ unterstützt). Sonst fehlt der Eintrag.
- **Neues Spiel:** nimmt den ersten freien Platz ohne Rückfrage („Startet auf Platz 2“). Sind alle drei belegt, folgt die Platzwahl mit Überschreiben-Bestätigung (D8). Sind mehrere Kapitel erreicht, erscheint die Kapitelwahl.
- **Kapitelwahl mit Sperre [E]:** Kapitel N ist startbar, sobald `mala.c(N−1)end` existiert. Die Marken schreibt das Spiel schon heute am Kapitelende: `90_story.js:211` → `96_k2_story.js:25–26` (K1), `96_k2_story.js:120` (K2), `96_k3_story.js:315` (K3), `96_k4_story.js:320` (K4).
  - Erreichte Kapitel erscheinen mit Ort und Herkunft: „Kapitel 1 · Split – von vorn“, „Kapitel 2 · Sarajevo – mit deinem Ende von Kapitel 1“.
  - Gesperrte Kapitel erscheinen ohne Ortsnamen und ausgegraut mit Grund: „Kapitel 3 – nach Kapitel 2“.
  - Kapitel 5 erscheint als „Kapitel 5 – noch nicht erschienen“. Erst nach dem Abspann von Kapitel 4 (`mala.c4end`) heißt es „Kapitel 5 · Sarajevo – noch nicht erschienen“, passend zur Ankündigung dort (D3).
  - **Beispielstände** folgen derselben Regel. „Split: kurz vor Ivkas Wahrheit“ ist immer verfügbar; „Sarajevo: vor dem Ankaufbuch“ erst nach `mala.c1end` (`95_preset.js:5–6`).
  - **Laden ist nie gesperrt:** Vorhandene Spielstände bleiben ladbar, auch aus Kapiteln, die nach der neuen Regel noch gesperrt wären. Das betrifft etwa Spieler, die heute direkt in Kapitel 3 gesprungen sind.
  - **Testschalter:** Der URL-Parameter `?kapitel=alle` gibt alle Kapitel frei, ohne Marken zu schreiben. Kapitel 2–4 starten dann wie heute mit Vorgaben. Er erscheint nicht im Menü. Die QA-Werkzeuge starten Kapitel bisher über das Titelmenü und setzen den Schalter künftig selbst (E, Phase 2).

**Drei Einstiege**
1. *Erster Start / neues Spiel:* Titel → Neues Spiel → (freier Platz automatisch) → Kapitelkarte → Intro.
2. *Fortsetzen / Laden:* Titel → Fortsetzen → direkt in die Szene (kein Intro, wie heute über `room.load`/`resume`, `05_engine.js:537–542`); bei Kapitelende-Stand → Weiter-Karte.
3. *Rückkehr aus dem Spiel:* Pause → Zum Titelbild → Meldung „Gespeichert – Platz 1“ → Titel mit „Fortsetzen“ auf genau diesem Stand.

### D2. Intro (Kapitel 1)
- **[B]** Ablauf heute, in Echtzeit gemessen: Karte „Prolog / Die Stillen / Split / Dienstag, 15. November 2011 · Nachmittag“ 4,2 s; Markos Wohnung mit vier Zeilen (4,5 s / 7,1 s / 2,2 s / 2,3 s); Kontrolle nach **22,9 s**. Kurz, ruhig, gut lesbar – bleibt so.
- **[V]** Ton: Übergang von der Titelmusik in Regen und Jugo-Wind statt hartem Schnitt (heute kein Überblenden, `04_audio.js:221`).
- **[V]** Bedienung: Karte per Tipp, Klick, Leertaste, Enter oder Esc überspringen (heute nur Tipp). Zeilen wie bisher einzeln weiter. Neu: **Esc halten = Szene im Schnellvorlauf** – technisch beschleunigt (`A.wait` sofort, Zeilen sofort beendet, bis `E.busy` endet), damit Flags, `A.save()` und Zustände genau einmal laufen. Kein Sprung.
- **[V]** Während gescripteter Abschnitte die Leiste auf 50 % abdunkeln; mit Beginn der Kontrolle volle Helligkeit. So ist sichtbar, wann man handeln kann.
- Kein neuer Erzähltext; „Der Anrufbeantworter blinkt.“ bleibt die einzige Lenkung, und sie ist Erzählung, keine Oberfläche.

### D3. Kapitelübergänge
- **Anfang:** vorhandene Karten und Erinnerungsbild bleiben. **[V]** Kartentexte umbrechen (B2-3); Erinnerungsbild mit derselben Schriftstaffel wie die Karte.
- **Ende:** **[V]** Karte im Stil der Anfangskarten: „Ende des ersten Kapitels“ / „Split“ / „Fortsetzung: Sarajevo“ / „Spielzeit 3 Std. 40 Min.“. Danach Abspann mit sichtbarem „Überspringen ▸“ ab 3 s, dann dieselbe Karte mit *Weiter mit Kapitel 2* (Hauptweg) und *Zum Titelbild*. Der Stand bleibt als „Kapitelende“ auf dem Platz.
- **Kapitel 4:** Der Abspann endet mit „FORTSETZUNG / Kapitel 5: Sarajevo“ (`96_k4_story.js:318`). **[E]** Das bleibt so. **[V]** Die Endkarte von Kapitel 4 („Ende“, oben) nennt entsprechend „Fortsetzung: Sarajevo“, aber ohne „Weiter mit …“, weil Kapitel 5 nicht enthalten ist. Danach erscheint das Titelbild, und die Kapitelwahl zeigt „Kapitel 5 · Sarajevo – noch nicht erschienen“ (D1).
- **Wiederholung gesehener Intros:** nur als „Abspann Kapitel N“ unter „Über MALA“ (technisch einfach). Intros erneut abzuspielen bräuchte einen eigenen Abspielmodus ohne Spielzustand – nicht empfohlen.

### D4. Pause
- Öffnen: „Menü“, Esc, Android-Zurück. Szene abgedunkelt; Spielzeit, Abläufe und Musik (gedämpft) halten an.
- Kopf: „Pause“ · „Kapitel 2 · Vratnik“ · „Automatisch gespeichert vor 1 Min. ✓“.
- Einträge: **Weiterspielen** · Speichern · Laden · Einstellungen · Hinweise … · Steuerung · Zum Titelbild („speichert automatisch“).
- Während einer Szene: „Speichern“ und „Hinweise“ bleiben sichtbar mit „nach der Szene“.
- Smartphone quer zweispaltig (alle Zeilen ≥ 44 CSS-px ohne Scrollen). Esc schließt; Fokus geht zurück an das Spiel.

### D5. Einstellungen
Eigene Seite aus Titel und Pause. Speicherung je Gerät in `localStorage` wie heute (`mala.tspeed`, `mala.tap`, `mala.music`, `mala.sound`, `mala.crt`, `mala.lang`, `mala.nbstyle`), neu `mala.vol.*`, `mala.textsize`, `mala.font`, `mala.motion`.

| Gruppe | Einstellung | Heute | Vorschlag |
|---|---|---|---|
| Ton | Musik, Geräusche, Umgebung | an/aus | Regler 0–100 auf die vorhandenen Verstärkungen (`04_audio.js:9–21`); Probeklang beim Loslassen |
| Text | Tempo | eine Zeile mit 4 Zuständen | langsam/normal/schnell |
| Text | Weiter erst nach Tippen | in „Tempo“ versteckt | eigener Schalter |
| Text | Textgröße, Schrift | – | normal/groß; Pixel/Lesbar (Atkinson Hyperlegible Next, C „Schrift“; HTML-Schicht; Gespräche mit B3-2) |
| Darstellung | Bewegung reduzieren | – | Schalter, folgt `prefers-reduced-motion` |
| Darstellung | Röhrenbild, Vollbild | vorhanden | bleibt |
| Notizbuch | Liste/Nachdenken | vorhanden | mit Erklärung in einer Zeile |
| Sprache | Deutsch / Bosanski·Hrvatski | vorhanden | Hinweis „Kapitel 3–4 bisher nur Deutsch“ (heute im Platzdialog) |

Vorschau: Beispielzeile im gewählten Tempo, Größe und Schrift. „Untertitel“ entfällt: Das Spiel hat keine Sprachausgabe, aller Text ist bereits Text.

### D6. Speichern (Lesezeichen)
- Notizbuchseite: „Speichern · Platz 1 · Kapitel 2 · Vratnik“, darunter eine Infozeile zum automatischen Stand und **drei Lesezeichen** als Karten (Vorschaubild, Ort, Datum, Spielzeit, optional Name).
- Leere Karte antippen = speichern. Rückmeldung **erst nach erfolgreichem Schreiben** („Gespeichert ✓ Lesezeichen 2“). Belegte Karte → Bestätigung (D8).
- **Smartphone quer** (gilt auch für D7): „Zurück“ in der Kopfzeile, flachere Vorschaubilder (320:112), die Art-Marke liegt auf dem Bild. Wird der Mittelteil bei großer Schrift zu hoch, scrollt er; Überschrift und „Zurück“ bleiben stehen.
- Nicht möglich (Szene, Zwischenwelt, Stadtplan): Karten gesperrt, Satz mit Grund. Fehler: „Hier geht Speichern nicht.“ (Ort) bzw. „Speichern fehlgeschlagen: Der Browser-Speicher ist voll.“ (Quota).

**Datenmodell [V]**

| Schlüssel | Inhalt |
|---|---|
| `mala.save.N` (bleibt) | automatischer Stand von Platz N: `{GS, at, v:2, meta:{chapter, phaseShort, room, roomName, playMs, kind:'auto'}, thumb}` |
| `mala.mark.N.k` (neu, k = 1–3) | Lesezeichen, gleiches Format, `kind:'mark'`, optional `name` |
| `mala.save.N` am Kapitelende | `{kind:'chapterEnd', chapter, next, at, playMs}` statt Löschen |
| `mala.undo` | Sicherung „Vor dem Laden“ (D7) |

Vorschaubild: 160×72 aus dem aktuellen Szenenbild (`M.renderFrame()`, Bedienleiste abgeschnitten) – nur, was der Spieler gerade sieht. **[B]** Ein Spielstand ist heute 7,5–10,4 KB groß (`states.json`); zwölf Stände mit Vorschaubild bleiben weit unter jeder Speichergrenze. Alte Stände ohne `meta` werden beim Lesen ergänzt; ohne Vorschaubild erscheint die Kapitelkarte.

### D7. Laden
- Aus dem Titel: drei Platz-Karten; je Platz der automatische Stand und seine Lesezeichen. Aus der Pause: die Stände des laufenden Platzes, „Andere Plätze …“.
- **Zustände:** *Automatisch* · *Lesezeichen* · *Kapitelende* („Weiter mit Kapitel 2“) · *leer* („Neues Spiel hier“) · *beschädigt* („Lässt sich nicht lesen“, Siegel „!“, nur *Löschen …*) · *inkompatibel* („Aus einer neueren Fassung – bitte aktualisieren“). Ausgewählt: Rahmen `seal2`, Schatten.
- **Laden ohne Rückfrage, aber sicher:** vorher wird der aktuelle Stand als `mala.undo` gesichert; 10 s lang „Rückgängig“. Schlägt das Laden fehl, bleibt der laufende Zustand unverändert (Sicherung vor `setGame`, Rücksprung im `catch`).
- **Löschen:** nur im Titel, mit Bestätigung, die Kapitel, Ort und Spielzeit nennt.
- **Beispielstände** (bisher „Mitgelieferte Spielstände“) als zweiter Abschnitt, mit Hinweis „enthalten Handlung aus Kapitel 1 bzw. 2“.
- Fußzeile: „Spielstände liegen nur in diesem Browser auf diesem Gerät.“ Optional *Sicherung exportieren / importieren* (B3-3).

**Wann ist der Zustand konsistent?** **[C]** Gespeichert wird heute schon nur außerhalb von Szenen; während einer Szene sichert das Spiel den Zustand vom Szenenbeginn (`safeGS`, `05_engine.js:177–182, 517–519`), Laden spielt die Szene neu ab (z. B. Überquerung der Straßenbrücke). Das bleibt so. Lesezeichen werden nur angeboten, wenn `E.busy`, Dialog, Overlay und Raumwechsel ruhen; der automatische Stand folgt weiter `pendingSave`.

### D8. Bestätigungen
- Nur für Überschreiben und Löschen. Bisher → neu nebeneinander (Vorschaubild, Ort, Zeit). Knöpfe: *Überschreiben* / *Löschen* (rot umrandet, ausgeschrieben) und **Abbrechen** (Fokus). Esc und Tipp neben das Fenster brechen ab.
- Entfallen: Rückfrage bei „Neues Spiel“ auf freiem Platz, bei „Zum Titelbild“ (speichert ohnehin), beim Laden (abgesichert durch „Rückgängig“).

### D9. Spieloberfläche: Leiste, Figurenwechsel, Inventar, Zeigen
Die Leiste bleibt im Canvas und behält ihre Ordnung (Notizen links, Name in der Mitte, Karte/Zeigen/Menü rechts, darunter Porträt und Inventar). Änderungen:
- **Figurenknopf:** Beschriftung „↔ Mala“ / „↔ Marko“ (Glyphe ↔ gibt es); Tipp wechselt. Ohne Mala Markos Porträt mit „Marko“ statt leerem Rahmen. Die aktive Figur bleibt an der Szenenfärbung und der Leistenfarbe erkennbar (heute schon eindeutig).
- **Knöpfe:** Tippfläche 15 Spielpixel hoch (wie `btnAt`), gesperrt mit gestricheltem Rahmen und Grund beim Tipp (vorhanden: „Gerade nicht.“ u. a., `17_map.js:87–91`).
- **Inventar:** Pfeile 16 statt 10 Spielpixel breit (ragen 6 px in den leeren Rand des ersten/letzten Felds; am Telefon 27 statt 17 CSS-px). Seitenpunkte tippbar. Neu-Markierung bis zum ersten Ansehen.
- **Zeigen:** Punkte für alle Hotspots (Farbe nach Art: Ausgang grün, Person rot, Ding gelb, Malas „Spüre“-Stellen eisblau), Namen nur für Ausgänge und Personen; Tipp auf einen Punkt zeigt dessen Namen. Dauer 4,5 s wie heute; bei „Bewegung reduzieren“ ohne Pulsieren.
- **Verb-Popup:** bleibt; bei Touch Zeilen 15 Spielpixel; Abstand ≥ 12 Spielpixel zum Tippunkt, damit das Ziel sichtbar bleibt.
- **Ständig sichtbar:** Notizen, Karte, Zeigen, Menü, Porträt, Inventar. Nichts davon wird ausgeblendet – die Leiste verdeckt keine Szene (sie liegt unter der Szene).
- Auf breiten Telefonen ordnet die Breitbild-Leiste dieselben Elemente an den Seiten an (D17). Alles in diesem Abschnitt gilt dort ebenso.

### D10. Gespräche
- Brustbild und Antwortliste unten bleiben. Touch: drei Zeilen à 15 Spielpixel und „▼ noch 3“; Desktop: vier Zeilen, Ziffern 1–9, Mausrad, ↑/↓/Enter. Schon gewählte Zeilen in `muted` (≥ 4,5:1). Lange Antworten umbrechen wie heute (nie abgeschnitten).
- Gesprochene Zeilen: „wartet auf Tippen“ zeigt wie heute ▸. Mit B3-2 große Schrift in der Untertitelschicht.

### D11–D13. Notizbuch, Karte, Dokumente und Rätsel
- **Notizbuch:** bleibt (fünf Zeilen, je 31,7 CSS-px am Telefon – ausreichend). Hinweistext in `paper-muted` (5,5:1), „X“ auf 16 Spielpixel.
- **Karte:** bleibt; Zustände und Legende sind klar, gesperrte Orte erscheinen erst, wenn Marko von ihnen weiß – keine vorzeitige Erreichbarkeit. Esc schließt (vorhanden).
- **Dokumente:** Absatzumbruch statt fester Zeilen. **Rätsel:** „Zurück“ und Anleitung in Tinte statt Grau (2,0:1 → 14:1); „Vorlesen“ bei Touch 16 Spielpixel hoch.

### D14. Meldungen
- Spielmeldungen (neue Notiz, Fehlschlag) wie heute über der Leiste.
- Systemmeldungen (Offline bereit, neue Fassung, gespeichert) als kleine Marke oben rechts im Seitenrand bzw. oben rechts im Bild – nie über Menüzeilen oder Inventar. „Neue Fassung geladen – sie startet beim nächsten Titelbild“ bleibt inhaltlich.

### D15. Hochformat
Beim ersten Aufruf im Hochformat: Karte „MALA wird quer gespielt“ – „Dreh dein Gerät ins Querformat.“ – „Ist die Drehsperre an? Dann spiel hier weiter: Das Bild liegt richtig, sobald du das Gerät drehst.“ – *Gedreht weiterspielen*. Die Wahl wird gemerkt; die gedrehte Darstellung bleibt technisch wie heute.

### D16. Über MALA
Text auf Papierkarte statt über dem Titelbild; *Abspann Kapitel N* für beendete Kapitel. **[E]** Keine Liste der Mitwirkenden und kein Eintrag dafür.

### D17. Breitbild-Leiste (Telefone quer) [E]
**[B]** Heute bleiben am iPhone 13 quer (Emulation 750 × 342 CSS-px) 31 % der Fläche schwarz; die Szene misst 533 × 240 CSS-px (`geometry.md`). Im Prototyp: Bildschirm „Breitbild-Leiste“ mit den Umschaltern Marko, Mala und Gespräch, jeweils mit „Ist“.

**Wann sie gilt.** Sei n der heutige Maßstab in Gerätepixeln je Spielpixel (`99_main.js:25`). Die Breitbild-Leiste gilt, wenn die Szene eine Stufe größer (n+1) passt, während die Leiste bei n bleibt. In Gerätepixeln innerhalb der Safe-Area heißt das: `320·(n+1) + 2·33·n ≤ Breite` und `144·(n+1) + 32·n ≤ Höhe`. Sonst bleibt alles wie heute.
- iPhone 13 quer: n = 5; 2250 ≤ 2250 und 1024 ≤ 1026 → Breitbild.
- iPad quer (1080 × 810, Faktor 2) und Desktop 1280 × 800 → heutige Leiste.
- In der Praxis trifft das Telefone quer, ab einem Seitenverhältnis von etwa 1,9. Ein sehr breites Desktopfenster kann ebenfalls darunter fallen.
- Im gedrehten Hochformat gilt dieselbe Regel. Beim iPhone 13 (664 × 390 nutzbar) reicht die Breite nicht.

**Aufteilung** (Rechenbeispiel iPhone 13 quer, 750 × 342 CSS-px, Faktor 3; Prototyp „Breitbild-Leiste“):
- **Szene:** 6 Gerätepixel je Spielpixel, also 640 × 288 CSS-px (+44 % Fläche); oben bündig, waagerecht mittig.
- **Leiste:** bleibt bei 5 Gerätepixeln (5/3 CSS-px je Spielpixel); die Schrift bleibt so groß wie heute (Versalhöhe 11,7 CSS-px).
- **Links (55 CSS-px), linker Daumen:** Figurenknopf mit Porträt und „↔ Mala“ (55 × 67), darunter Notizen (55 × 45).
- **Rechts (55 CSS-px), rechter Daumen:** Menü, Karte, Zeigen, je 55 × 45 CSS-px.
- **Unten (54 CSS-px, unter der Szene):** links der Name des Hotspots, rechts das Inventar.
  - Sechs Felder 36 × 30 Spielpixel, also 60 × 50 CSS-px (heute 40 × 36 Spielpixel; die Symbole messen 32 × 24 und passen, `06_ui.js:137, 167`).
  - Pfeile 15 × 30 Spielpixel, also 25 × 50 CSS-px.
- **Tippflächen:** Knöpfe und Felder ≥ 44 CSS-px, Pfeile ≥ 24 CSS-px.

**Gespräche, Sprechzeilen, Popup.**
- **Antwortliste:** ein Kasten über dem unteren Szenendrittel, 45 Spielpixel hoch. Drei Zeilen à 13 Spielpixel (26 CSS-px), dazu „▼ noch N“.
- **Brustbild:** oben rechts in der Szene.
- **Leiste:** während des Gesprächs auf 35 % abgedunkelt; sie nimmt keine Eingaben an.
- **Sprechzeilen, Verb-Popup und „Zeigen“:** liegen in der Szene und werden mit ihr 20 % größer.

**Andere Bildschirme.**
- Notizbuch, Karte, Dokumente, Rätsel, Kapitelkarten und Abspann sind auf 320 × 200 gezeichnet. Sie wechseln mit 150 ms Überblendung ins gewohnte Bild und nach dem Schließen zurück.
- Pause, Einstellungen, Speichern, Laden und Titel liegen nach Phase 2 in der HTML-Schicht und passen sich ohnehin an. Vor Phase 2 nutzen sie ebenfalls das 320 × 200-Bild.

**Umschalten.** Bei Drehung und Größenänderung wird neu entschieden (Ereignisse `resize` und `orientationchange`, `99_main.js:34`). Nur die Darstellung wechselt, der Spielzustand bleibt unberührt.

**Technik** (Vorschlag mit Fundstellen):
- **Layout-Objekt:** Lage von Porträt, Notizen, Karte, Zeigen, Menü, Name, Inventar und Pfeilen kommt aus einem Layout-Objekt statt aus festen Konstanten (`06_ui.js:5, 137–138`). Die Zeichenroutinen der Leiste bleiben dieselben (`06_ui.js:139–178`). Das Standard-Layout entspricht den heutigen Werten und muss pixelgleich bleiben.
- **Zweite Zeichenfläche:** eine eigene Fläche für die Leiste mit eigenem Puffer. Die Szene bleibt auf `#game` (Ausschnitt 320 × 144).
- **Trefferprüfung je Fläche:** betrifft `uiAt` (`06_ui.js:578–600`) und `toLogical` (`99_main.js:35`); Letzteres rechnet heute nur ein Rechteck um.
- **Safe-Area:** `fit()` (`99_main.js:23–34`) wählt Standard oder Breitbild und zieht die Safe-Area-Ränder (`env(safe-area-inset-*)`) ab. **[C]** Heute rückt nur die Artefakt-Fassung seitlich ein (`game/build.js:83, 90`, `MALA_FIT`). Die Netlify-Fassung (`web/index.html`) setzt `viewport-fit=cover` (`game/build.js:23`), wertet die Ränder aber nicht aus. Heute schadet das nicht, weil das Bild mittig weit vom Rand liegt; die Breitbild-Leiste reicht dagegen bis an die Safe-Area.
- **Röhrenbild:** muss beide Flächen abdecken (`placeCRT`, `99_main.js:30`).

**[N] Nicht geprüft:** Safe-Area-Werte und Safari-Leisten echter iPhones. Die Rechnung oben nutzt die Emulation, die keine Ränder kennt.

---

## E. Umsetzungsplan

Aufwand: **S** ≤ ½ Tag, **M** 1–3 Tage, **L** ≥ 1 Woche.

### Phase 1 – Bedienfehler und Lesbarkeit im bestehenden Canvas (keine neue Technik)
| Schritt | Dateien | Aufwand |
|---|---|---|
| Esc-Stapel; Audio-Freigabe auch per Taste; Rechtsklick | `06_ui.js:668–672`, `99_main.js:35–48` | S |
| „Offline bereit“ oben rechts | `game/build.js:46–63` | S |
| Meldung im Menü nicht über Zeilen | `06_ui.js:511, 564` | S |
| „Über das Spiel“ auf Fläche | `06_ui.js:549` | S |
| Kontraste Papier/Gesperrt | `06_ui.js` (`ovFrame`, `ovInfo`, `nb*`, `drawButton`) | S |
| Touch-Zeilenhöhen (Titel, Menü, Dialog, Popup, Pfeile, X/▲▼) bei `pointer: coarse` | `06_ui.js:181–258, 497–560, 578–600` | M |
| Dokument-Absatzumbruch, Kartenumbruch | `06_ui.js:310–319, 554–556` | S |
| Figurenknopf „↔ Name“, Marko ohne Mala | `06_ui.js:172–177, 592` | S |
| Zeigen: Namen nur Ausgänge/Personen, Tipp auf Punkt | `06_ui.js:482–494` | S |
| Neu-Blinken beenden | `05_engine.js:241`, `06_ui.js:163` | S |
| Hochformat-Hinweis | `game/build.js:31`, `99_main.js:23–34` | S |
| Regressionstests: Esc-Stapel, Tippflächen ≥ 24 CSS-px (geometry.js als Test), Meldungslage | `qa/` | S |

### Phase 2 – Systemoberflächen als HTML-Schicht und Spielstand-Modell
| Schritt | Dateien | Aufwand |
|---|---|---|
| Schriften einbetten: `makefont.js` in den Build, MALA Pixel als data-URI (≈ 27 KB); Leseschrift Atkinson Hyperlegible Next, vier woff2 mit zusammen 39 KB (als data-URI ≈ 53 KB); `fontcheck.js` als Prüfschritt | `game/build.js`, `design/tools/makefont.js`, `design/tools/fontcheck.js`, `design/assets/` (opentype.js nur als Build-Werkzeug) | S |
| HTML-Schicht über dem Canvas, deckungsgleich skaliert; Fokusverwaltung, Esc, Zurück-Taste (`popstate`) | neu `game/src/07_shell.js` + CSS im Build | M |
| Titel, Kapitelwahl, Über MALA, Pause, Einstellungen, Speichern, Laden, Bestätigungen in der Schicht; Canvas-Fassungen entfernen | `07_shell.js`, `06_ui.js:497–560` | L |
| Spielstand-Modell: `meta`, Vorschaubild, Lesezeichen, Kapitelende-Stand, `v`-Prüfung, Sicherung vor dem Laden, getrennte Fehlertexte | `05_engine.js:505–546`, `90_story.js:211–212`, `96_k2_story.js:120–121`, `96_k3_story.js:28–32, 314–318`, `96_k4_story.js:319–324` | M |
| Kapitelsperre **[E]** über `mala.cNend`: Kapitelwahl, Beispielstände, Kapitel 5 mit Ort erst nach `mala.c4end`; Laden bleibt ungesperrt; Testschalter `?kapitel=alle` (Abfrage verträgt fehlendes `location`) | `06_ui.js:540–542` → `07_shell.js`; vorhandene, ungenutzte Abfrage `96_k2_story.js:27` | S |
| QA-Werkzeuge auf den Testschalter umstellen, sonst starten Kapitel 2–4 nicht mehr: Node-VM-Sandbox ohne `location` (`qa/vmdriver.js:56–70`), Kapitelstart über das Titelmenü in `qa/sim.js:14`, `qa/browser/scenarios.js:175, 215, 219`, `qa/browser/uirun.js:180`; neuer Test der Sperre selbst | `qa/` | S |
| Einstellungen: Lautstärkeregler, Textgröße, Schrift Pixel/Lesbar (`mala.font`), Bewegung reduzieren | `04_audio.js:9–21`, `05_engine.js:185–188`, `06_ui.js:47–63`, `99_main.js:10–17` | M |
| Pause hält Musik (gedämpft) und Overlays an | `05_engine.js:551–560`, `04_audio.js:221–223` | S |
| Tests: Abnahmekriterien F als Playwright-Szenarien (vier Geräte) | `qa/browser/` | M |

### Phase 3 – Breitbild-Leiste [E] (zusammen L)
| Schritt | Dateien | Aufwand |
|---|---|---|
| Layout-Objekt für die Leiste; Standard-Layout pixelgleich zu heute (Bildvergleich vorher/nachher auf allen vier Geräten) | `06_ui.js:5, 137–178` | M |
| Zweite Zeichenfläche für die Leiste, Szene im eigenen Maßstab; Röhrenbild über beide Flächen | `99_main.js:23–34`, `game/build.js` (Canvas, CSS) | M |
| Wahl Standard/Breitbild in `fit()` nach der Regel aus D17, mit Safe-Area-Rändern in beiden Fassungen | `99_main.js:23–34`, `game/build.js:23, 83, 90` | S |
| Trefferprüfung je Fläche | `06_ui.js:578–600`, `99_main.js:35` | S |
| Gespräche im Breitbild (Antwortkasten über dem unteren Szenendrittel, Leiste abgedunkelt); Overlays, Karten und Abspann im 320 × 200-Bild mit Überblendung | `06_ui.js:181–258`, Overlay-Zeichnung in `06_ui.js` | M |
| Tests F22–F25: `geometry.js` mit Breitbild-Gerät, Bildvergleich der Standard-Leiste, Wechsel Breitbild ↔ Overlay ↔ zurück, Drehung im Gespräch | `qa/browser/`, `design/tools/geometry.js` | M |

### Phase 4 – optional
Untertitelschicht mit Leseschrift und großer Schrift für Gespräche (B3-2, M–L), Export/Import (S), „Zuletzt“-Karte (S), Schnellvorlauf (M), Abspann-Archiv (S).

### Benötigte Assets
| Asset | Zweck | Herstellung |
|---|---|---|
| Wasserfläche bis zum Bildrand im Titelbild | Menüuntergrund (D1) | prozedural im vorhandenen Titelcode (`90_story.js:170–205`) |
| Kleine Pixel-Symbole: Schloss, Siegel „!“, Lautsprecher, Lesezeichen, Drehen (je 7×8 bis 10×10) | Zustände ohne Farbe allein | als Glyphen in der Spielschrift ergänzen (Tabelle `F`, `00_core.js:171–200`) – erscheinen dann in Canvas und Webfont |
| Bediensymbole ◂ ▲ ▼ ✕ als Glyphen | Pfeile, Mehr-Anzeige und Schließen in der HTML-Schicht. Das Spiel zeichnet sie heute als Formen (`arrowH` `06_ui.js:178`, `tri` `06_ui.js:257`); der Prototyp nimmt sie noch aus der Systemschrift (`evidence/fontcheck.txt`) | wie oben, in der Spielschrift |
| Leseschrift Atkinson Hyperlegible Next 400/700, latin + latin-ext | „Schrift: Lesbar“ (C, D5) | vorhanden: `design/assets/*.woff2` mit Lizenztext (OFL 1.1); keine Herstellung |
| Vorschaubild-Ersatz für alte Stände | Laden (D7) | Kapitelkarte verkleinert, keine neue Grafik |
| Keine neuen Szenen, Figuren oder Illustrationen | – | – |

**Abhängigkeiten:**
- **Phase 1** ist unabhängig und sofort umsetzbar.
- **Phase 2** setzt die Schriften (Schritt 1) und das Spielstand-Modell vor dem Lade-Bildschirm voraus. Kapitelsperre, Testschalter und die Umstellung der QA-Werkzeuge gehören in denselben Schritt, sonst starten die Kampagnen für Kapitel 2–4 nicht mehr.
- **Phase 3** baut auf den Touch-Zeilenhöhen und dem Figurenknopf aus Phase 1 auf und ist von Phase 2 unabhängig. Vor Phase 2 nutzen Pause und Titel im Breitbild das 320 × 200-Bild.

---

## F. Abnahme und offene Punkte

### Abnahmekriterien (nach der Umsetzung zu prüfen; Playwright, vier Geräte)
| Nr. | Situation | Erwartung |
|---|---|---|
| F1 | Erststart ohne Spielstand | Kein „Fortsetzen“; „Neues Spiel“ hat den Fokus; Unterzeile „Split“; keine Meldung über Menüzeilen. |
| F2 | Neues Spiel mit 1–2 belegten Plätzen | Startet auf dem ersten freien Platz, ohne Rückfrage; andere Stände unverändert. |
| F3 | Neues Spiel mit drei belegten Plätzen | Platzwahl; Überschreiben nur nach Bestätigung mit Fokus auf „Abbrechen“; Esc bricht ab. |
| F4 | Fortsetzen | Lädt den jüngsten gültigen Stand mit einem Tipp; Ort, aktive Figur, Inventar, Notizen, Flags gleich wie beim Speichern (Vergleich wie `qa/sim.js` Kategorie D). |
| F5 | Fortsetzen bei Kapitelende-Stand | Weiter-Karte mit „Weiter mit Kapitel N+1“. |
| F6 | Lesezeichen speichern | Bestätigung erst nach erfolgreichem `setItem`; Autosave überschreibt Lesezeichen nie (zehn Raumwechsel danach unverändert). |
| F7 | Speicherfehler (Quota simuliert) | Meldung „Browser-Speicher voll“; vorhandene Stände unverändert. |
| F8 | Beschädigter / inkompatibler Stand | Als solcher beschriftet, nicht ladbar, löschbar; kein „Fortsetzen“ darauf. |
| F9 | Laden mit Fehler | Laufendes Spiel unverändert; Meldung mit Grund. Nach erfolgreichem Laden 10 s „Rückgängig“. |
| F10 | Intro vollständig / übersprungen | Gleicher Zustand nach Kontrolle (Flags, `GS`, ein Autosave); Karte per Tipp/Taste übersprungen; Fortsetzen spielt kein Intro. |
| F11 | Rückkehr aus jedem Untermenü | Esc und „Zurück“ führen eine Ebene zurück; Fokus liegt danach auf dem auslösenden Eintrag. |
| F12 | Menüs 50× öffnen/schließen | Keine Zustandsänderung, keine verlorenen Eingaben, keine wachsenden Listener. |
| F13 | Esc-Stapel | Popup → Esc schließt nur das Popup; Gegenstandswahl → Esc hebt sie auf; erst danach öffnet Esc die Pause. |
| F14 | Wechsel Marko/Mala | Knopf „↔ Name“; Wechsel per Tipp, Tab und M; gesperrter Wechsel ohne Wirkung und ohne Fehlermeldung im Code. |
| F15 | Tippflächen | Jede Tippfläche ≥ 24 CSS-px (Canvas), Menüzeilen der HTML-Schicht ≥ 44 CSS-px, auf allen vier Geräten (`design/tools/geometry.js` als Test). |
| F16 | Lange Texte, große Schrift | Längste Antwort, längste Kapitelkarte, längster Ortsname: nichts abgeschnitten oder überlappend, bei Textgröße „groß“. |
| F17 | Kontraste | Text ≥ 4,5:1, große Schrift ≥ 3:1, Fokusrahmen ≥ 3:1 gegen Nachbarfarbe. |
| F18 | Hochformat | Hinweis einmal; „Gedreht weiterspielen“ merkt sich die Wahl; Eingaben treffen. |
| F19 | Offline | Nach dem ersten Laden ohne Netz startbar (wie heute, Szenario C12); Schrift ist eingebettet. |
| F20 | Kapitelsperre | Bei leerem Speicher ist nur Kapitel 1 startbar. Kapitel 2–4 erscheinen ohne Ortsnamen mit Grund; Kapitel 5 erscheint als „noch nicht erschienen“ ohne Ort. Jedes Kapitel wird genau nach `mala.cNend` frei. „Sarajevo“ bei Kapitel 5 erscheint erst nach `mala.c4end`, der Beispielstand aus Kapitel 2 erst nach `mala.c1end`. Vorhandene Stände aus gesperrten Kapiteln bleiben ladbar. `?kapitel=alle` gibt alles frei, ohne Marken zu schreiben, und die QA-Kampagnen für Kapitel 2–4 laufen damit wie bisher. |
| F21 | Leseschrift | „Schrift: Lesbar“ stellt Menütexte auf Atkinson Hyperlegible Next um; Überschriften bleiben in MALA Pixel. `fontcheck.js` läuft ohne Fehler, und bei Sichtprüfung mit đ/Đ, č ć š ž und „ “ erscheint kein Ersatzkästchen. Die Bauakte 1894 bleibt in MALA Pixel. Die Schrift ist auch offline verfügbar. |
| F22 | Breitbild: Auswahl | Emulation iPhone 13 quer: Szene 640 × 288 CSS-px, Leiste an den Seiten und darunter. iPad quer und Desktop 1280 × 800: Leiste wie heute und pixelgleich zum Bild vor der Änderung. |
| F23 | Breitbild: Bedienung | Alle Teile der Leiste sind erreichbar: Figur, Notizen, Menü, Karte, Zeigen, Inventar blättern und wählen, „Benutze … mit“. Knöpfe und Felder ≥ 44 CSS-px, Pfeile ≥ 24 CSS-px (`geometry.js`). |
| F24 | Breitbild: Wechsel | Gespräch, Notizbuch, Karte, Dokument, Rätsel und Pause öffnen und schließen: jeweils die richtige Darstellung, danach wieder Breitbild. `GS` bleibt unverändert, keine Eingabe geht verloren. |
| F25 | Breitbild: Drehung, Größe | Drehen oder Fenstergröße ändern mitten im Gespräch und mit gewähltem Gegenstand: Die Darstellung wechselt, Gespräch und Auswahl bleiben. Kein Bedienelement liegt in den Safe-Area-Rändern (**[N]** nur auf echtem Gerät prüfbar). |

### In dieser Analyse ausgeführt (Ist-Zustand, keine Abnahme)
- Bildschirmaufnahmen aller oben genannten Zustände auf vier Geräten (Chromium, WebKit-Emulation), 0 Seitenfehler.
- Vermessung aller Tippflächen (`geometry.md`), Kontrastberechnung, Escape-Protokoll, Intro-Zeitmessung.
- Kapitelübergänge K1/K2 im VM-Rendering.
- Erzeugung der Webfont „MALA Pixel“ und Probedruck im Browser (deckungsgleich mit der Canvas-Schrift).
- Erste Prüfung des Prototyps (Chromium): acht Bildschirmzustände auf Desktop, Tablet, Smartphone quer und schmaler Seite ohne Skriptfehler.
- Abdeckung der Leseschrift gegen alle Zeichen der 297 Quelldateien (`design/tools/fontcheck.js` → `evidence/fontcheck.txt`): alle Buchstaben vorhanden, fehlende Symbole stehen in MALA Pixel.
- Gesamtprüfung des Prototyps nach dem Einarbeiten der Entscheidungen (`design/tools/protosweep.js`, Chromium): alle 15 Bildschirme auf jedem passenden Gerät, je als Entwurf und Ist, dazu die Umschalter der Spielansicht, Marko/Mala und Breitbild, zusammen 136 Zustände.
  - Ergebnis: keine Skriptfehler, keine fehlenden Bilder, kein Bedienelement außerhalb des Bildes. Was nicht ins Bild passt, liegt in Scrollbereichen: Einstellungen auf allen Geräten, „Kapitel 5“ in der Kapitelwahl am Telefon.
  - Dabei gefunden und behoben: Am Telefon liefen „Spiel laden“ und „Speichern“ unten aus dem Bild, „Zurück“ war nicht erreichbar. Jetzt steht „Zurück“ in der Kopfzeile, die Vorschaubilder sind flacher, und der Mittelteil kann scrollen.
- Sichtprüfung der Breitbild-Leiste (Marko, Gespräch), der Einstellungen mit „Lesbar“ sowie von Laden und Speichern am Telefon.

Nichts davon ist eine Abnahme der vorgeschlagenen Oberfläche – die gibt es erst nach der Umsetzung (F1–F25).

### Offene Punkte
Keine Entscheidungsfragen mehr. Alle sechs sind beantwortet (Abschnitt „Entscheidungen“ am Anfang); Malas Stimme-Zeilen im Hafenbüro bleiben unverändert.

### Erst nach der Umsetzung prüfbar
Wirkung auf echten Geräten (Safari/iOS-Eigenheiten bei Vollbild, Ausrichtung, Audio, Safe-Area-Ränder der Breitbild-Leiste), Hörbild der Musikdämpfung, Bildschirmleser-Tauglichkeit der HTML-Schicht (geplant: `button`-Elemente mit Beschriftung, `aria-live` für Meldungen).
