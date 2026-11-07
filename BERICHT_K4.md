# Bericht Kapitel 4: München

Kapitel 4 („Nicht zurückgekommen“, 24.12.2011 bis 1.1.2012) ist gebaut, durchgespielt und geprüft. Grundlage ist `KAPITEL4_KONZEPT.md`. Die Verträge stehen in `game/K4_SPEC.md`, `game/ROOM_SPECS4.md` und `game/CAST4.md`. Die Komplettlösung steht in `LOESUNG4.md`.

## Umfang
- **Ablauf:** 14 Abschnitte, von Heiligabend über fünf Tage und die Silvesternacht bis Neujahr. Der Tageswechsel kommt erst, wenn die Pflichtschritte erledigt sind. In den Nächten geht man auf Mamas Couch schlafen.
- **Räume:** 18, dazu der Stadtplan von München mit zehn Orten, acht Erinnerungsbilder und zwei neue Zwischenwelten (Bahnsteig 1962, Trambahndepot).
- **Figuren:** 30 Figur-IDs, darunter Kostüme, Kinder mit eigenen Proportionen und die Katze Mucki. Dazu 17 neue Porträts.
- **Ton:** 17 Musikstücke, 18 Klangkulissen und die neuen Geräusche.
- **Text:** etwa 3200 Dialog- und Erzählzeilen in drei Skriptteilen:
  - Familie: Ankunft, Heiligabend, Malas Kiste, Kolars Anruf, Streit, Hackerbrücke, Silvestergespräch, Epilog;
  - Bahnhof: Sepp, Carmela, Abschied, Davor und Lena;
  - Heim: Gerda, „Drei Uhr“, Zwischenwelt mit der Kanne, Silvesternacht im Heim.
- **Hinweise:** vier Stufen, 48 Themen.

## Neu in der Engine
- **Mala allein:** Tagsüber geht sie durch Ausgänge und reist über den Stadtplan, nachts nur in Mamas Wohnung. Geht Marko, bleibt sie, wo sie ist. Von Donnerstagabend bis Freitagnacht ist sie fort.
- **Malas Geheimnis:** Was sie in der Kiste liest, kennt Marko im Gespräch erst nach dem Streit. Auch Schlüsse damit gehen erst dann. Als Mala darf man ihren eigenen Schluss früher ziehen.
- **Titelmenü und Abspann:** „Kapitel 4: München“ steht im Titelmenü. Nach dem Abspann von Mostar geht es weiter nach München. Kostüme einer Figur teilen sich ein Porträt.
- **Übernahmen aus Mostar:** Zustimmung a, b oder c, die Probe ja oder nein (eigene Szenen: Konsulat, Kolars Anruf, Silvester-Zug 8), die Nachfragen, Kapitel 2. Ohne Stand gelten b und ja.
- **Sichtbarkeit der Geister:** In Kapitel 4 sieht Marko einen Geist erst, wenn Mala ihn gefunden hat. Die Engine hat diese Einstellung bisher nicht übernommen. In Kapitel 1 bis 3 bleibt es bewusst, wie es war.
- **Handy:** In München ruft das Handy wieder an. Eine Stelle aus Kapitel 3 hatte das Anrufen in allen anderen Kapiteln abgeschaltet.

## Prüfungen (Endbau `web/`)
- **Durchlauf Kapitel 4** (`game/tools/walkthrough4.js`, nur Spielerhandlungen, kein gesetzter Schalter): 85 Schritte, 362 s, Spieltakt der Musterlösung 150,7 min, keine JS-Fehler.
- **Zusatztests** (`game/tools/k4tests.js`): 116 ok, 0 Fehler. Geprüft werden:
  - Übernahmen und beide Fassungen der Probe;
  - Malas Geheimnis, Mala allein, Reiseregeln;
  - Laden an allen zehn Tageswechseln und an den Silvester-Zwischenständen;
  - alle Fehlwege, beide Reihenfolgen der Versuche, die drei Wege zu Sepps Namen;
  - Davors Fahrt und der Epilog mit Zustimmung c.
- **Hinweisprüfung:**
  - auf den Ständen des Durchlaufs: 85 Stände, 0 Fehler;
  - auf den Ständen der Zusatztests: 383 Stände, 0 Fehler.
- **Offlinetest:** OK, auch Kapitel 4 startet ohne Netz am ZOB.
- **Alte Kapitel:** Die Durchläufe von Kapitel 1, 2 und 3 laufen gegen den Bau mit Kapitel 4 weiter fehlerfrei.

## Beim Zusammenführen behoben
- Nach dem Laden mitten im Silvestergespräch oder auf der Brücke begann das Gespräch nicht wieder. Die Sperren fallen jetzt beim Laden.
- Ohne Stand aus Kapitel 3 lobte Mala Markos Nachfragen in Mostar. Diesen Satz gibt es jetzt nur noch mit Stand.
- Davors Viertel heißt wie auf seiner Karte aus Kapitel 3: Moosach.
- Mama kam im Juni 1992 mit Ana am Bahnhof an, nicht mit Marko.
- Die Hinweise sind an die echten Skripte angeglichen. Zwei Lücken sind geschlossen: Donnerstagabend und Brücke.

## Offen
- Die Musik ist gemessen (Pegel wie in Kapitel 3, nirgends übersteuert), aber noch von keinem Menschen angehört.
- Kein blinder Spieldurchgang durch unabhängige Spieler wie bei der Prüfung von Kapitel 3.
- Kapitel 4 ist nur auf Deutsch.
- `game/tools/klicktests.js` (echte Mausklicks) deckt Kapitel 4 noch nicht eigens ab.
