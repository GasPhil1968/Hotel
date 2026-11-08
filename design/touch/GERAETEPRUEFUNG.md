# Prüfung auf echten Geräten (Touch-Konzept E7)

Diese Prüfungen lassen sich nur auf echten iPhones und iPads ausführen. Die Emulation unter Linux (Playwright WebKit und Chromium) kennt keine Safe-Area-Ränder, keine Safari-Leisten, keine Systemgesten, keine Bildschirmtastatur und keinen Ton. Alles hier ist **noch nicht geprüft**; bitte die Spalte „Ergebnis“ ausfüllen.

**Vorbereitung**
- Den Ordner aus `MALA_netlify_oberflaeche.zip` bei Netlify hochladen (siehe `LIESMICH.txt`, Abschnitt „Installation auf dem iPad“).
- Jede Prüfung einmal in **Safari** und einmal als **App vom Home-Bildschirm**, wo es angegeben ist.
- Geräte nach Möglichkeit: iPhone SE (2./3. Gen.) oder mini, ein iPhone mit Dynamic Island (14 Pro bis 17), ein großes iPhone (Plus/Pro Max), ein iPad mit Trackpad oder Tastatur-Hülle.
- Notieren: Gerät, iOS-Version, Safari oder App, Datum.

## A. Darstellung

| Nr. | Prüfung | Schritte | Erwartet | Ergebnis |
|---|---|---|---|---|
| O1 | Safe Area, Home-Indikator | Spiel quer halten, Kamera-Aussparung links und rechts ausprobieren. In Safari und als App. | Kein Knopf und kein Bildteil unter der Aussparung oder dem Home-Indikator; die untere Leiste endet mindestens 8 px über dem Indikator. | |
| O1b | Telefon-Layout | Einen Raum öffnen, Bild und Leiste ansehen. | Szene deutlich größer als früher (auf jedem iPhone mindestens 2 Bildpunkte je Spielpixel). Mit Platz: Figur und Notizen links, Menü/Karte/Zeigen rechts; ohne Platz (SE): alle Knöpfe in einer Reihe unten. Alle Knöpfe bequem mit dem Daumen treffbar. | |
| O2 | Safari-Leisten | In Safari die Leisten durch Wischen ein- und ausblenden (soweit Safari das quer anbietet), Gerät drehen. | Bild und Leiste passen sich an, springen nicht hin und her; Tipps treffen danach weiter. | |
| O9 | kleinstes Display | iPhone SE oder mini: einen ganzen Abschnitt (z. B. Kapitel 1, Hotel Palma) nur mit dem Finger spielen. | Alles erreichbar, keine Pixel-Suche nötig; Antworten lesbar. | |
| T20 | gedrehtes Hochformat | Gerät hochkant, „Gedreht weiterspielen“, ein paar Tipps; als App vom Home-Bildschirm. | Gedrehtes Bild nicht unter Aussparung oder Home-Indikator; Tipps treffen. | |

## B. Bedienung

| Nr. | Prüfung | Schritte | Erwartet | Ergebnis |
|---|---|---|---|---|
| E2 | Fangradius | Kleine Dinge antippen (Rezeption Hotel Palma: Glocke, Telefonbuch, Schublade), auch knapp daneben. | Knapp daneben trifft das Ding; bei zwei nahen Dingen fragt „Welches?“ mit Namen. Kein Ding wird hervorgehoben, das nicht berührt wurde. | |
| E4 | Aktionsleiste | Ein Ding mit mehreren Handlungen antippen (z. B. Mantel, Portier). | Knöpfe unten statt Menü am Finger; Ding gerahmt; „✕“ oder Tipp ins Bild schließt, Marko geht nicht los. | |
| E4b | Gegenstand mit einem Tipp | Gegenstand antippen, dann ein Ziel; zweiter Versuch: Gegenstand antippen, „Schau an“. | „Benutze … mit …“ nach einem Tipp; „Schau an“ in der kleinen Leiste darüber; Inventar bleibt frei. | |
| T04 | Antwortliste | Gespräch mit vielen Antworten; am Satzende schnell zweimal tippen. | Zeilen groß, Wischen blättert; der Doppeltipp wählt keine Antwort ungelesen. | |
| O3 | Systemgesten | Gegenstand ziehen und dabei vom unteren Rand oder seitlich eine Systemgeste auslösen (Home, App-Wechsel). | Nach der Rückkehr hängt kein Gegenstand am Finger; die nächste Bedienung funktioniert. | |
| O8 | iPad mit Trackpad | Abwechselnd mit Finger und Trackpad bedienen. | Finger: Aktionsleiste und große Antwortzeilen. Trackpad: Hover-Namen, Menü am Zeiger, Antworten im Bild. | |
| T21 | Feinwahl | Einstellungen → Darstellung → Feinwahl an. Finger 0,5 s auf ein kleines Ding halten, Fadenkreuz verschieben, loslassen. | Fadenkreuz über dem Finger, Name in der Satzzeile, Loslassen wählt. Aus: alles wie ohne. | |
| O10 | Lupe, Textauswahl | Lange auf das Spielbild drücken (Feinwahl aus). | Keine Lupe, keine Textauswahl, kein Kontextmenü. | |
| T16 | Zoom | Im Menü (Einstellungen, Laden) mit zwei Fingern vergrößern, dann wieder verkleinern; auch auf dem Spielbild probieren, solange vergrößert ist. | Menüs lassen sich vergrößern; auf dem Spielbild vergrößert nichts, außer die Seite ist schon vergrößert – dann geht das Zurückzoomen dort auch. | |

## C. Ton, Speichern, Lebenszyklus

| Nr. | Prüfung | Schritte | Erwartet | Ergebnis |
|---|---|---|---|---|
| O4 | Ton nach Unterbrechung | Spielen, Anruf annehmen oder Siri, Bildschirm sperren, App wechseln; zurück und tippen. | Ton läuft spätestens nach dem nächsten Tipp weiter. Mit Stummschalter/Stummmodus: still (Hinweis steht in den Einstellungen). | |
| O5 | App-Wechsel, Sperre | Mitten in einem Raum (nach einer abgeschlossenen Handlung) App wechseln, Gerät sperren, später zurück; einmal die App ganz schließen. | Gegenstände und Notizen des laufenden Raums sind erhalten; „Fortsetzen“ führt an dieselbe Stelle. | |
| O6 | Bildschirmtastatur | Menü → Speichern → Lesezeichen → „Benennen …“, Namen tippen. | Das Namensfeld bleibt über der Tastatur sichtbar; Enter speichert. | |
| O7 | Home-Bildschirm | In Safari „Zum Home-Bildschirm“, App starten, Flugmodus, neu starten; neue Version hochladen und einmal mit Internet starten. | Erster Start als App: Hinweis auf den eigenen Speicher; offline startbar; Aktualisierung kommt an. Spielstände aus Safari lassen sich per „Sicherung exportieren/importieren“ übertragen. | |
| T14 | Hinweis in Safari | Erster Start in Safari. | Einmaliger Hinweis „Zum Home-Bildschirm“, verdeckt das Titelmenü nicht; nach „Verstanden“ nicht wieder. | |

## D. Abnahme

Die Kriterien K1–K14 stehen in `design/TOUCH_KONZEPT.md`, Abschnitt F3. Emuliert geprüft sind sie in `qa/ui/phase3.js`, `qa/ui/phase5.js` und `design/touch/devicetests.js` (Ergebnisse in `design/touch/nachher/`). Erst diese Liste macht daraus eine Aussage über Safari auf iOS.
