# MALA – Trailer 90 s: Quellen und Status

## Spielversion und Arbeitskopie

- **Build:** `web/index.html` aus diesem Repository, SHA-1 `f4b32c501563…`, zuletzt geändert in Commit `ae3c21e` (2026-11-04). Dazu gehören `sw.js`, `manifest.webmanifest` und die Symbole aus `web/`.
- **Arbeitskopie:** Alle Aufnahmen liefen gegen eine Kopie dieses Builds in einem eigenen Arbeitsordner außerhalb des Repositorys. Das Spiel wurde für den Trailer **nicht verändert**. Kein Spieltext, keine Grafik, keine Funktion und kein Ablauf wurde angepasst. Die Aufnahme hängt nur zur Laufzeit Messpunkte an den AudioContext und den Master-Knoten (`werkzeug/rec.js`).
- **Spielstände:** Jede Aufnahme läuft in einem frischen Browser-Kontext mit eigenem `localStorage`. Persönliche Spielstände wurden weder gelesen noch überschrieben. Die Ausgangsstände stammen aus den automatischen Durchläufen des Spiels (`game/tools/walkthrough.js` und `walkthrough2.js` mit `MALA_DUMPALL`): Kapitel 1 mit 61 Schritten, Kapitel 2 mit 67 Schritten. Beide Durchläufe meldeten „keine JS-Fehler“. Jeder Stand ist also auf normalem Spielweg erreichbar. Figurenkonstellationen, die das Spiel nicht kennt, kommen nicht vor.
- **Eingaben:** Alle Eingaben laufen über die echten Zeigerfunktionen des Spiels (`M.pointerDown/Move/Up`) mit dem spieleigenen Cursor: Verbmenüs, Dialogauswahl, Wechselknopf, Ziehen aus dem Inventar, Notizbuch, Menü. Inventaraktionen und Ergebnisse sind nicht nachgestellt.
- **Bild und Ton:** Jedes Bild des Spiel-Canvas (320 × 200) wurde verlustfrei als PNG gespeichert, mit dem Zeitstempel der Audio-Uhr. Der Ton kam verlustfrei als PCM vom Master-Ausgang der Engine. Es gibt keine Bildschirmaufnahme, keinen Browserrahmen und keine Debug-Anzeigen.

## Verwendete Aufnahmen

| Aufnahme | Ausgangsstand (Schritt im Durchlauf) | Inhalt |
|---|---|---|
| `riva_hook` | Kapitel 1, `d1/20` „Praxistest: Marko lässt sie nachsehen“ | Riva bei Dämmerung, Wechsel zu Mala, Ivkas Leine |
| `marko_open` | Neues Spiel (Titel → Kapitel 1) | Prolog: Markos Wohnung, die Übersetzung |
| `mala_deny` | `d1/18` „Riva“ | „Du bist eine Einbildung.“ |
| `zdenka` | `d1/07` „Varoš“ | Veli Varoš, Gespräch mit Zdenka |
| `shoebox` | `d1/08` „Schlüssel“ | Ivkas Wohnung, Stricknadel auf dem Schuhkarton |
| `notebook` | `d1/11` | Notizbuch: zwei Hinweise verbinden |
| `coop` | `d1/19` „Begegnung mit Ivka“ | Hafenbüro: Mladen, Mala im Archiv, Marko setzt fort |
| `menu1` | `d1/36` „Bank am Morgen“ | Menü in Kapitel 1: Speichern |
| `palma` | `d1/53` „Übersetzt, Nacht“ | Hotel Palma bei Nacht (nur 1,4 s Ortsbild) |
| `stanica` | Kapitel 2, `d2/01` „Ankunft in Sarajevo“ | Busbahnhof Sarajevo |
| `fikret` | `d2/02` „Kune? Ne.“ | Fikret, Übersetzungsrätsel |
| `tram` | `d2/04` „Fahrschein“ | In der Straßenbahn Linie 1 |
| `carsija_bench` | `d2/06` „Baščaršija“ | Mala auf der Bank an der Drei |
| `reveal` | `d2/08` „Rade kennt Ruža“ | „Zeigen“ |
| `kula_tomaz` | `d2/10` „Nacht: jemand singt“ | Tomaž an der Kula |
| `pansion_mala` | `d2/12` „Erster Fall“ | Hajras Pension, Gespräch mit Mala |
| `kazan` | `d2/17` „Auftragsbuch 1972“ | Kazandžiluk |
| `title`, `title_still` | Titelbild | Kapitelwahl, Sprachschalter, Endkarte |
| `music_title`, `music_case1`, `music_k2_mala`, `music_ghost` | beliebiger Stand, Geräusche aus | Musikstücke der Engine, je etwa 100 s |

Alle Musik und alle Geräusche stammen aus der Engine. Es gibt keine fremden Klänge, keine Archivmusik und keine Klänge aus anderen Spielen.

## Inhaltlicher Stand

| Inhalt | Stand | Im Trailer |
|---|---|---|
| Kapitel 1: Split | spielbar | gezeigt |
| Kapitel 2: Sarajevo | spielbar | gezeigt |
| Kapitel 3: Mostar | nur Konzept (`KAPITEL3_KONZEPT.md`), nicht programmiert | nicht gezeigt, nicht erwähnt |
| Kapitel 4 und 5 | geplant | nicht gezeigt, nicht erwähnt |
| Bosnisch/Kroatisch | Kapitel 1 vollständig, Kapitel 2 dann auf Deutsch | nur als „Kapitel 1 auch auf Bosnisch/Kroatisch“ |

## Spoilerprüfung

Der Trailer zeigt die Ausgangslage, aber keine Antworten. Die Prüfung beruht auf dem Abgleich mit `KONZEPT.md`, `KAPITEL2.md`, `KAPITEL3_KONZEPT.md` und dem tatsächlich angezeigten Text jedes Abschnitts (Spalte „Spieltext im Bild“ in `SCHNITTPLAN.md`).

**Nicht gezeigt:**
- **Malas Identität:** Wer sie war und ihr Name zu Lebzeiten kommen nicht vor. Es gibt keine Register, Briefe, Fotos oder Rotkreuz-Nachrichten, die darauf deuten.
- **Todesumstände** von Mala, Ivkas Sohn und allen anderen Geistern.
- **Fall-Lösungen:** Was 1984 mit der Fähre geschah, steht nicht im Bild. Mladens Satz zur Weihnachtsbura und Zdenkas Antwort zu Tonći sind herausgeschnitten. Das Hafenbüro endet vor dem Fahrtenbuch. Beim Übersetzungsrätsel ist nur eine falsche Lesart mit Fikrets Einwand zu sehen, nicht die richtige Übersetzung. Tomažs Missverständnis bleibt offen.
- **Kapitelenden** von Kapitel 1 und 2, das Hinübergehen in die Zwischenwelt und alle Erkenntnisszenen.
- **Lesbare Spoiler-Dokumente:** keine Briefe, Register, Fahrtenbücher oder Erinnerungsbilder. Die grüne Notizbuch-Schlussfolgerung ist ein früher Zwischenschluss aus dem Prolog von Kapitel 1 („Keine Familie heißt nicht: niemand“). Sie verrät keine Lösung.
- **Vollständige Sequenzen** von Kennenlernen, Abwesenheit und Rückkehr kommen nicht vor:
  - Vom Kennenlernen (Wohnung) gibt es nichts.
  - Aus dem Hafenbüro, dem Praxistest im Anschluss, stammen sechs verdichtete Ausschnitte, die vor dem Ergebnis enden.
  - Von der Bank an der Drei, der Rückkehr in Kapitel 2, stehen nur zwei Zeilen (4 s) im Trailer. Das Bild ist auf die Szene beschnitten, sodass der leere Wechselknopf nicht zu sehen ist; Abwesenheit und Wiederkehr selbst kommen nicht vor.
  - In den kurzen Bildern vom Busbahnhof, aus der Straßenbahn und mit Fikret ist der Wechselknopf leer, so wie im Spiel in dieser Phase. Eine Abwesenheitsszene ist das nicht, und nichts im Trailer erklärt oder benennt es.

**Gezeigt, weil es Prämisse ist:**
- Mala ist ein Geist.
- Es gibt Geister, die an etwas festgemacht sind (Ivkas Leine).
- Tomaž wartet an der Kula. Das wird früh im Prolog von Kapitel 2 klar.

**Schnittfolge:** Keine Abfolge legt eine Antwort nahe. Auf „Ich weiß nicht, auf wen.“ folgt nur das Titelbild, kein Bild von Marko. Ivkas „Wo ist deine Mutter?“ ist nicht verwendet.

## Bei der Arbeit gefundene Auffälligkeiten im Spiel (nicht behoben, nicht gezeigt)

1. **Menükopf in Kapitel 2:** Das Spielmenü zeigt in Ständen von Kapitel 2 die Überschrift „MALA – Kapitel 1: Split“. Die Menüszene im Trailer ist deshalb in Kapitel 1 aufgenommen (`menu1`), wo die Überschrift stimmt. Für den Trailer wurde das Spiel nicht geändert; der Fehler sollte im Spiel behoben werden.
2. **Hinweismenü in Kapitel 2:** Die Themenliste der Hinweise nennt Stichworte, die spätere Inhalte verraten. Deshalb kommt sie im Trailer nicht vor.

## Nicht geprüft und deshalb nicht behauptet

- Echte Touch-Geräte, iPad, iOS und Safari, Firefox, Leistung auf Telefonen. Touch ist nur in Chromium-Emulation geprüft.
- Spielzeit. Sie ist nicht gemessen.
- Veröffentlichung, Store, Preis, Datum und Webadresse. Nichts davon ist bestätigt.
- Es gibt keine Vertonung und keinen Sprecher.

## Lautheit

Am fertigen MP4 gemessen (ffmpeg `ebur128`): **−15,0 LUFS** integriert, True Peak **−2,0 dBTP**, LRA 3,8 LU. Das Protokoll steht in `pruefung/qc.json`.
