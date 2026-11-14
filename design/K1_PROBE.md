# Probe in Kapitel 1: Gespräch & Nachruf statt Kombinieren

Stand 14.11.2026. Code: `game/src/23_k1probe.js` (Einstellung, Kreuzverhör, Polaroid-Auswahl, Nachruf, Inhalte, Hinweise).
Eingebunden in `rooms/riva.js` (Ivkas Finale), `rooms/ledana.js` (Luka), `92_jakov.js` (Jakov, Nachrufe Luka/Anka), `rooms/flat.js`
(Nachruf Tonći), `92_story2.js` (Nachruf Bruno). Kleine Haken: `05_engine.js` (`M.afterAct`, `TA.combine` über `E.combineNotes`),
`06_ui.js` (`M.uiHover`, Hinweistext im Notizbuch), `07_shell.js` (Einstellung).

## Einstellung

„Rätsel in Kapitel 1 (Probe)“: **Gespräch & Nachruf** (Vorgabe) oder **klassisch**. Gilt nur in den Abschnitten von Kapitel 1.
`?k1neu=1` / `?k1neu=0` erzwingt. Unter Testautomatisierung und in der Test-VM klassisch, außer `M.K1NEU` ist gesetzt.

## Was sich im Probemodus ändert

| Stelle | klassisch | Probe |
|---|---|---|
| Notizbuch | zwei Notizen verbinden | nur Ablage („Zum Nachlesen antippen. Verbunden wird im Gespräch.“) |
| Prolog „Keine Familie heißt nicht: niemand“ | verbinden | Marko schließt es selbst, sobald er Stadt-Notiz und Strickheft hat |
| Fall 1, Ivkas Finale | Notiz „Fähre fiel aus“, dann eigener Schluss „Tonći kam mit der ANKICA“ | **Kreuzverhör**: bei „Er kommt mit der Fähre“ die ausgefallene Fähre zeigen, bei „Bei der Bura fährt keiner raus“ die gekenterte ANKICA (oder Dinkos Geschichte); danach Brief und Handschuhe wie bisher |
| Fall 2, „Nina hat gewartet“ | verbinden | **Kreuzverhör** mit Luka: bei „Wenn sie nicht kommt …“ den Nachhall am Kiosk oder Miras Erinnerung zeigen |
| Zwischenfall, „Er hat sie umgebettet“ | verbinden | **Kreuzverhör** mit Jakov, zwei Runden: leerer Sarg, dann „Unter unserem Baum“ |
| Fall 3, „Bruno hat sie versteckt“ | verbinden | Marko schließt es selbst (Bruno kann kaum sprechen, ein Verhör passt nicht) |
| Fallende | – | **Nachruf** als Lückentext: Tonći (Donnerstagmorgen), Luka (Freitagmorgen), Anka (nach Jakovs Finale), Bruno (Epilog, Fährhafen) |

**Kreuzverhör:** Die Figur sagt eine Aussage; Menü: Nachhaken · Beleg zeigen … (Geduld n/3) · Nächste Aussage (n/m) · Aufhören.
Belege wählt man als Polaroids (Porträt oder Gegenstand, Titel; der ganze Text beim Antippen). Treffer: die Figur reagiert, nächste Runde,
der Schluss kommt als Notiz. Beinahe-Treffer: Marko sagt, warum es nicht reicht, kostet nichts. Falscher Beleg: Geduld −1; bei 0 dreht sich
die Figur weg, man spricht sie neu an, geschaffte Runden bleiben.

**Nachruf:** Lücke antippen, Wort antippen (darunter: woher das Wort stammt). Abgeben: alles richtig → „GEDRUCKT“; höchstens zwei
Fehler → „Fast“, ohne zu sagen, welche; nach zwei Versuchen „Eine Lücke aufdecken“. Kein Abbruch, keine Sackgasse.

Hinweise im Probemodus: `k1_ivka2`, `k2_waited`, `kj_where` mit eigenen Texten; `k1_came`, `k1_people` öffnen nicht.

## Prüfung (Build 14.11.2026)

| Prüfung | Ergebnis |
|---|---|
| Musterlösung Kapitel 1, klassisch | OK, keine JS-Fehler |
| Musterlösung Kapitel 1, Probemodus (`MALA_K1NEU=1`) | OK, keine JS-Fehler; drei Kreuzverhöre, vier Nachrufe |
| `qa/regress/bug_035_k1_probe.js` | OK: Geduld, Beinahe-Treffer, Wegdrehen mit Fortschritt, Luka, Jakov, Notizbuch ohne Kombinieren, Nachruf mit Fehlern und Aufdecken, klassisch unverändert |
| volle Regression `node qa/regress/run.js` | 35 von 35 OK |

Bilder: `design/k1probe/1_aussage.png` … `6_gedruckt.png`.
