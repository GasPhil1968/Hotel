## Einordnung (von Hand geprüft)

**Stand:** Spiel `web/index.html` SHA-256 `5ddc4f3c…`, Prüfwerkzeug Stand Commit `701fa95` (Harness-Prüfsumme `45bb4beaf7` in jedem Lauf). Danach am Werkzeug nur eine optionale Umgebungsvariable für das Sondenbudget ergänzt (Vorgabe unverändert).

**Fehlschläge (2):** D-0071 und D-0450 – Save/Load-Vergleich meldet nur die Spielzeit-Stempel `partizan.bellBack/nextBell` (Glocken-Szene). `partizan.resume` setzt sie beim Laden absichtlich neu (gt beginnt nach dem Laden neu). Beide Läufe spielten danach bis zum Endpunkt (K4-Abspann), ohne JS-Fehler. → **Fehlalarm des Vergleichs, kein Spielfehler.** Nicht nachträglich umgewertet, damit die Zahlen der Kampagne unverändert bleiben.

**Unentschieden (516) – Softlock-Einordnung:**

| Einordnung | Läufe | Nachweis |
|---|---|---|
| kein Softlock: Sonde erreichte einen Phasen- oder Kapitelwechsel | 371 | automatisch, je Lauf in `runs.jsonl` (`softlock.progress.phaseTo`) |
| kein Softlock: Sonde scheiterte nur am Zeitrahmen, mit größerem Rahmen Phasenwechsel | 1 | B-0913: `pro → pro_eve` nach 330 Aktionen |
| Fortschritt möglich (neue Notiz/Gegenstand/Ort/Story-Flag), kein Phasenwechsel im Budget | 144 | siehe Stichproben unten |
| Verdacht (kein Fortschritt) | 0 | – |

Die 144 „Fortschritt möglich“-Läufe nach Phase, mit Stichprobe (`qa/resume_check.js` spielt vom erreichten Zustand die aufgezeichnete Lösungsfolge der Reihe nach weiter, Ergebnisse in `resume_check.jsonl`; sonst von Hand):

| Phase | Läufe | Stichprobe | Ergebnis |
|---|---|---|---|
| k4_d3 (K4 Mittwoch) | 43 | C-0072 von Hand | Vorgesehene Regel „ein Versuch je Nachmittag; neuer Nachmittag, wenn man das Haus verlässt und wiederkommt“ (heim_flur.js). Der verfrühte Versuch verbrauchte den Nachmittag. Haus verlassen (ZOB) und zurück → Gerda bietet „Sie haben immer draußen gewartet. Am Depot.“ wieder an, `k4.g.hall` gesetzt. **Umweg, kein Softlock.** B-0147 (Gleis 11): Lösungsfolge scheitert an anders lautenden Dialogzeilen – nicht bewiesen. |
| k3_d3 (K3 Sonntag) | 25 | E-0097 | Lösungsfolge → Phase `k3_fin_n`. **kein Softlock.** |
| c1 (K1 Tag) | 17 | E-0011, E-0008 | Störung ließ das Kennenlernen anders ablaufen („Wer bist du?“ – „Durch die Tür.“); Gespräche und Notizen gehen weiter. Lösungsfolge und Sonde mit 2.400 Aktionen erreichen den Phasenwechsel nicht. **nicht bewiesen, kein Verdacht.** |
| k3_d1 (K3 Freitag) | 12 | B-0423 von Hand | Überquerung war schon gelungen; das Werkzeug setzte bei der Rückkehr zum Anker Mala wieder aktiv, das Skript wartete auf den Rückwechsel. **Werkzeug-Artefakt, kein Softlock.** Die Lösungsfolge scheitert sonst an der Peilung (Rätsel `peil` löst das Werkzeug nicht). |
| k2_s3 (K2 Fall 3) | 11 | E-0055 | → `k2_s3_n`. **kein Softlock.** |
| k2_s1 (K2 Fall 1) | 9 | E-0067 | → `k2_s1_n`. **kein Softlock.** (vorher von Hand: Emina ist da, die Notizen s1_missed + s1_betrayal führen weiter) |
| i1m (K1 nach Ivka) | 5 | C-0465 | → `c2`. **kein Softlock.** |
| k2_pro (K2 Prolog) | 5 | B-0174 | Bekannter Mechanismus (B-0007 im Smoke-Test): nach dem ersten Lesen heißt die Zeile „Ich lese ihn Ihnen noch einmal vor.“, das Rätsel ist wieder lösbar; die Sonde erreichte dort `k2_pro_n`. **kein Softlock.** |
| k4_d1 (K4 Christtag) | 5 | B-0493 | Lösungsfolge scheitert an anders lautenden Dialogzeilen. **nicht bewiesen, kein Verdacht.** |
| c2, k4_d2, c3_night, c1_night, k4_d4 | 12 | – | keine Stichprobe. **nicht bewiesen, kein Verdacht.** |

Zusammengefasst: 372 Läufe mit nachgewiesenem Phasenwechsel, 144 mit Fortschritt; davon sind die Gruppen mit 110 Läufen durch je eine Stichprobe bzw. den erkannten Mechanismus erklärt (kein Softlock bzw. vorgesehener Umweg; nicht jeder Lauf einzeln geprüft), 34 Läufe bleiben „nicht bewiesen“ ohne Verdacht.

**Bestätigter Softlock in dieser Prüfung:** nur BUG-009 (Marko im K1-Archiv), behoben; im Abschlusslauf kein neuer.
