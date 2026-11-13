# Zwischenfilme: Spiel-Intro, Intro und Outro jedes Kapitels

Stand 13.11.2026. Elf kurze Filme, gemalt mit den Räumen des Spiels (Breitbild-Streifen 320 × 144, Unterzeile, animierte Titelkarte).
Jeder Film lässt sich mit einem Klick, Tipp oder einer Taste überspringen.

| Film | Wo im Spiel | Länge | Einstellungen |
|---|---|---|---|
| Spiel-Intro | vor dem Titelbild (wie bisher) | 40 s | Riva bei Nacht · Markos Wohnung, Mala wird sichtbar · **neu:** die Reise – Sarajevo im Nebel, Mostar, München im Schnee, Sarajevo im März (Marko geht, Mala folgt) · Titel |
| Kapitel 1 Intro | statt der Prologkarte | 26 s | Riva im Jugo-Regen · Altstadt · Markos Wohnung · Karte „Prolog – Die Stillen“ |
| Kapitel 1 Outro | nach dem Bus am Fährhafen, vor dem Abspann | 32 s | Fährhafen im Morgengrauen · Riva (Ivka, Luka, Bruno) · Sustipan mit Mala · „Ende des ersten Kapitels – Fortsetzung: Sarajevo“ |
| Kapitel 2 Intro | statt der Kapitelkarte | 26,5 s | Busbahnhof im Nebel (ohne Mala) · Straßenbahn · Baščaršija · Karte „Prolog – Die Linie Drei“ |
| Kapitel 2 Outro | nach der Abfahrt nach Mostar | 31,5 s | erster Schnee am Hochhaus · Busbahnhof, „Hin und zurück“ · Miljacka · „Fortsetzung: Mostar“ |
| Kapitel 3 Intro | statt der Kapitelkarte | 27 s | Busbahnhof im Regen · Alte Brücke · Kujundžiluk · Karte „Prolog – Die Brücke, die alle kennen“ |
| Kapitel 3 Outro | nach dem Epilog, statt „Ende des dritten Kapitels“ | 32,5 s | Herbergsterrasse im Morgengrauen · Alte Brücke · Busbahnhof mit Nada und Mala · „Fortsetzung: München“ |
| Kapitel 4 Intro | statt der Kapitelkarte | 27 s | ZOB im Schnee · Gleis 11 · Theresienwiese · Karte „Prolog – Heiligabend“ |
| Kapitel 4 Outro | nach Neujahr, statt der Endkarte | 32,5 s | Silvester · Mamas Küche in der Neujahrssonne · Theresienwiese · „Fortsetzung: Sarajevo“ |
| Kapitel 5 Intro | statt der Kapitelkarte | 27 s | Busbahnhof bei Tauwetter (Marko und Jasna, ohne Mala) · Baščaršija · Vratnik · Karte „Prolog – Ankunft“ |
| Kapitel 5 Outro | nach dem Epilog, statt „Ende“ | 34,5 s | Vratnik: Mala geht ins Licht · die Drei · Ružas Küche in der Dämmerung · „Ende – Diese Geschichte ist zu Ende erzählt“ |

**Spoiler:** Die Intros zeigen nur, was in den ersten Minuten des Kapitels ohnehin zu sehen ist (Ort, Wetter, ob Mala dabei ist).
Die Outros greifen auf, was gerade geschehen ist, aber nichts aus späteren Kapiteln. Malas Name und Herkunft kommen erst im
Outro von Kapitel 5 vor, ihr Weg ins Licht ebenso. Die Texte stammen aus den Szenen des Spiels oder fassen sie zusammen.

## Einbindung

* `game/src/89_kino.js`: Ablauf (Bildschirm `kino`), Räume in einem eigenen, nie gespeicherten Spielstand (Phase, Tageszeit und
  Wetter wie im Kapitel; Mostar mit Umfärbung und Farbstimmung), Figuren (`M.KH.walk`, `stand`, `ghost`, `ghostMove`),
  gerasterte Blenden, Titelkarte (`M.kinoCard`), `M.kinoFrameAt` für Vorschaubilder.
* `game/src/89_kinoszenen.js`: die zehn Kapitelfilme; `M.kinoIntro(A,ch,karte)` ersetzt die Kapitelkarte, `M.kinoOutro(A,ch)`
  läuft vor dem Abspann. Aufrufe in `90_story.js`, `96_k2_story.js` … `96_k5_story.js`.
* `game/src/89_intro.js`: die Reise durch die vier Städte vor der Titelkarte.
* Läuft nicht unter Testautomatisierung und ohne Bildschirm; dann kommt wie bisher die einfache Karte. `?kino=1` erzwingt die
  Filme, `?kino=0` schaltet sie ab. Einstellung „Zwischenfilme“ (an/aus). Unter „Über ‚Die Stillen‘“: „Intro Kapitel n“ für jedes
  erreichte, „Outro Kapitel n“ für jedes beendete Kapitel.
* Spielstand, Notizen und Gegenstände bleiben unberührt; das Kapitelende wird vor dem Outro gespeichert.

## Video

`design/kino/zwischenfilme.mp4` (alle elf Filme hintereinander, 1280 × 800, mit Ton) und je Film eine Datei, aufgenommen mit
`node design/tools/kinovideo.js design/kino`.

## Prüfung (Build 13.11.2026)

| Prüfung | Ergebnis |
|---|---|
| alle elf Filme im Browser abgespielt und aufgenommen | ohne JS-Fehler; Längen 26–42 s, zusammen 5:44 min |
| echter Ablauf mit `?kino=1`, Kapitel 1–5 | Intro statt Karte, Überspringen per Klick, danach Spiel bzw. Busfahrt-Erinnerung wie bisher; Outro vor dem Abspann, Überspringen per Leertaste, dann Abspann |
| Regression `node qa/regress/run.js` | 33 von 33 OK |
| `qa/ui/intro_titel.js` (Länge auf 40 s angepasst) | OK |
| `qa/ui/k3_grafik.js`, `qa/ui/k3_revision.js` | 26/26, 40/40 |
| Musterlösungen Kapitel 1 und 5 (unter Testautomatisierung, also mit den einfachen Karten) | OK, keine JS-Fehler |
