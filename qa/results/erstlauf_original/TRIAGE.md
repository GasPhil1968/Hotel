# Erstlauf (Originalfassung) – Triage

_Erzeugt von `qa/triage.js` aus `qa/results/erstlauf_original/runs.jsonl`._

| Ergebnis | Zuordnung | Läufe | Beispiele | Sonde |
|---|---|---|---|---|
| fail | BUG-001 (Spielfehler, behoben) | 560 | D-0000, D-0001, D-0002, D-0003, D-0004 | – |
| undecided | Skriptgrenze: der Lösungsweg passt nach der Störung nicht mehr (Zustand weicht ab); Softlock-Einordnung durch die Sonde | 390 | B-0001, E-0001, B-0003, B-0004, B-0005 | – |
| fail | BUG-002 (Spielfehler, behoben) bzw. Harness-Belastung über doppelte Test-API-Aufrufe (korrigiert) | 19 | E-0008, E-0019, E-0054, E-0075, E-0196 | – |
| fail | BUG-004 (Spielfehler, behoben) | 4 | D-0077, D-0175, D-0331, D-0534 | – |
| fail | BUG-008 (Spielfehler, behoben) | 1 | E-0159 | – |

## Hinweise zur Lesart des Erstlaufs

- Der Erstlauf lief mit dem damaligen Stand des Prüfwerkzeugs. Mehrere Mängel des Werkzeugs wurden erst danach gefunden (siehe `qa/HARNESS_KORREKTUREN.json`): Die verfrühten Versuche der Kategorie C liefen nie (Kanon ohne Schrittzähler); Zufallsaktionen konnten unerlaubte Figurenwechsel und nicht angebotenes Hinüberbringen auslösen. Zahlen des Erstlaufs sind deshalb nur als Fehlerfund-Lauf zu lesen, nicht als Abnahme.
- Eine Sackgassen-Sonde gab es im Erstlauf noch nicht. Die 390 unentschiedenen Läufe wurden stichprobenartig nachgespielt (auf der korrigierten Fassung, gleicher Seed): Dabei fiel E-0026 auf (Marko im Archiv ohne Ausgang) → **BUG-009, bestätigter Softlock**, behoben. Weitere Stichproben (B-0001, B-0003, B-0005, B-0007, E-0001, E-0009, C-0010, C-0017, E-0025, E-0031) zeigten Fortschritt (Skriptgrenze, kein Softlock).
- D-0379, D-0223 (Laden mitten in der Überquerung der Straßenbrücke) sind unter BUG-001 gezählt, weil die Legacy-Marke zuerst auffiel; die zweite Ursache (vorgesehene Rücksetzung der Überquerung) wurde einzeln geprüft: kein Spielfehler.

