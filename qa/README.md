# MALA – QA-Testumgebung

Alles hier prüft die **Produktionsdatei** `web/index.html` (bzw. eine angegebene Fassung). Es gibt keinen Nachbau der Spielwelt.

## Aufbau

| Pfad | Zweck |
|---|---|
| `vmdriver.js` | Lädt das erste `<script>` der gebauten `index.html` unverändert in eine Node-VM. Ohne `document` steigt `99_main.js` aus; der Treiber übernimmt die Bildschleife (`M.update(16)`, TURBO 25 wie die vorhandenen Playwright-Durchläufe). Kontrolliert: `Math.random` (Seed, mulberry32), `Date.now`/`performance.now`/`setTimeout` (virtuelle Uhr), `localStorage` (eigener Speicher je Lauf, exportier- und in einen neuen Kontext übertragbar). |
| `lib/session.js` | Ein Lauf: austauschbarer Treiber-Proxy (Laden in **frischem Kontext** mitten im Skript), Aktionsprotokoll auf `M.TA`-Ebene, Abdeckung, Invarianten (doppelte/unbekannte Gegenstände, unbekannte Notizen/Phasen, Mala aktiv ohne Anwesenheit, Räume, **hängende Aktionen**), Toleranzmodus für Fortsetzungen nach Störungen. |
| `lib/explore.js` | Zufallserkundung (nur Aktionen, die die Oberfläche anbietet: antippbare Hotspots mit den Verben des Popups, „Hinüberbringen“ nur bei `crossIf`, Ausgänge, Inventar, Mala ansprechen, Wechsel nur bei `canSwitch`, Stadtplan, Notizen verbinden aus der sichtbaren Liste, Hinweise), Rätsellöser über sichtbare Bedienelemente (`puzzle`, `arrange`) für die Sackgassen-Sonde, Belastung über den **Eingabeweg** (Zeigerereignisse auf Bildschirmpunkte, Tasten), Navigation zurück zum Anker über Ausgänge/Stadtplan. |
| `lib/common.js` | Pfadmodule laden, Titelmenü per Zeiger antippen, spielrelevanten Zustand vergleichen. |
| `paths/walkthrough*.js` | Kopien der Durchläufe aus `game/tools/` als ladbare Module mit Variantenschaltern (Zustimmung a/b/c, Probe ja/nein, Konsulat früh, Notizbuch „Nachdenken“, K2-Reihenfolge). Kapitelstart im verketteten Lauf über „Weiter mit Kapitel N“. |
| `sim.js` | Orchestrierung der Kategorien A–E, Grenzen (Schritte, Wanduhr, Spielzeit), Klassifizierung, JSONL-Protokoll, Kindprozesse. |
| `report.js` | Erzeugt `REPORT.md`/`summary.json` automatisch aus `runs.jsonl` (+ `BUGS.json`, Browser-Ergebnisse, Regressionstests, `HARNESS_KORREKTUREN.json`). |
| `triage.js` | Ordnet nicht bestandene Läufe per Signatur einer Ursache zu (Fehler-ID, Harness, beabsichtigt) → `TRIAGE.md`. |
| `HARNESS_KORREKTUREN.json` | Mängel des eigenen Prüfwerkzeugs, die während der Prüfung gefunden und korrigiert wurden (Auswirkung auf den Erstlauf). |
| `regress/` | Gezielte Regressionstests je behobenem Fehler (`bug_00N_*.js`). |
| `browser/` | Playwright: `record.js` (Aufnahme eines regulären Durchlaufs), `uirun.js` (Volldurchlauf nur über sichtbare Bedienelemente), `scenarios.js` (Einzelszenarien je Engine), `statepack.js` (regulär erspielte Spielstände), `engines.js` (Engines/Geräte). |
| `originals/index_original.html` | Die unveränderte gelieferte Fassung (SHA-256 `e380ec8b…`) für Vorher/Nachher. |
| `ABHAENGIGKEITEN.md` | Abhängigkeitsübersicht aus dem dokumentierten Design, mit Widersprüchen. |
| `BUGS.json` | Fehlerregister (Ursache, Wirkung, Korrektur, Reproduktion, Belege). |
| `results/` | Laufprotokolle, Berichte, Browser-Ergebnisse, Screenshots. |

## Was ein „Lauf“ ist

Jede Zeile in `runs.jsonl` ist ein eigenständiger Lauf: neue VM, leerer `localStorage`, eigener Seed (aus Kategorie, Nummer und Salz), Start über das Titelmenü, zusammenhängende Spielerhandlungen bis zum Endpunkt **K4-Abspann → Titelbild ohne „Weiter mit Kapitel 5“** oder bis zu einer Grenze. Protokolliert werden u. a. Run-ID, Kategorie, Seed, Datei-Hash, Gerüst-Hash, Startzustand, Ziel, Varianten, alle Aktionen (`trace`), Phasen- und Raumfolge, Störungen, Speicherpunkte, Abdeckung, Fehler, Laufzeit, Ergebnis.

Ergebnisse: `pass` (Endpunkt erreicht, keine JS-Fehler, keine Invariantenverletzung), `fail` (JS-Fehler, Invariante, Save/Load-Abweichung oder regulärer Pfad gescheitert), `undecided` (Fortsetzung nach einer Störung nicht gefunden oder Grenze erreicht – **kein** Nachweis eines Softlocks), `infra` (Prüfgerüst, z. B. ein unerlaubter Figurenwechsel des Werkzeugs).

**Sackgassen-Sonde:** Bei `undecided` spielt der Lauf vom erreichten Zustand aus weiter – höchstens 600 reguläre Aktionen, bevorzugt Lösungsschritte des Kapitels nahe der Abbruchstelle (Hotspots, Ausgänge, Notizwahlen, Dialogzeilen, Kombinationen), Rätsel über die sichtbaren Bedienelemente. Ergebnis in `softlock`: *kein Softlock* (Phasen-/Kapitelwechsel erreicht), *Fortschritt möglich* (neue Notiz/Gegenstand/Ort/Story-Flag), *Verdacht* (nichts) → Einzelprüfung von Hand.

Kategorien: **A** kritischer Pfad ab Spielbeginn mit Varianten · **B** Zufallserkundung an 1–3 Stellen, danach regulär weiter · **C** Varianten, verfrühte Lösungsversuche (spätere Aktionen der kanonischen Folge, wenn sie schon angeboten werden), Abwesenheiten · **D** Speichern im Menü, Laden im frischen Kontext / im selben Kontext / zweimal, Zustandsvergleich, weiter bis zum Ende · **E** Doppeltipps, Dreifachtipps, Wechsel im Gehen, Tippen während Sätzen/Übergängen, Tastenfeuer, ungültige Kombinationen.

## Befehle

```bash
node game/build.js                                    # Spiel bauen (web/index.html)
node qa/sim.js --canon --out qa/results/canon         # kanonische Aktionsfolge (für Kategorie C), einmalig
node qa/sim.js --plan full --workers 3 --salt final --out qa/results/final        # 4.000 Läufe (A1000 B1000 C800 D600 E600)
MALA_HTML=qa/originals/index_original.html node qa/sim.js --plan full --workers 3 --salt erstlauf --out qa/results/erstlauf_original
node qa/sim.js --cat D --count 50 --out qa/results/probe                         # einzelne Kategorie
node qa/report.js qa/results/final --title "MALA – Abschlusslauf"                 # Bericht aus den Logs
node qa/peek.js qa/results/final 1                                               # nicht bestandene Läufe ansehen
node qa/regress/run.js --json qa/results/regress_final.json                      # Regressionstests auf der korrigierten Fassung
node qa/regress/run.js --html qa/originals/index_original.html --json qa/results/regress_original.json   # gegen das Original: alle rot
node qa/triage.js qa/results/final --title "Abschlusslauf – Triage"            # Zuordnung nicht bestandener Läufe
node qa/validate_driver.js 11                                                    # Treiber: Determinismus, smart vs. full
# Browser (Chromium vorinstalliert; Firefox/WebKit: PLAYWRIGHT_BROWSERS_PATH=~/pwb npx playwright install firefox webkit, WebKit braucht install-deps)
node qa/browser/statepack.js                                                     # regulär erspielte Stände
node qa/browser/record.js                                                        # Aufnahme für den UI-Durchlauf
node qa/browser/uirun.js --engine chromium --device desktop                      # Volldurchlauf nur über Klicks/Tipps
node qa/browser/uirun.js --engine webkit --device phone                          # iPhone 13 quer (emuliert)
node qa/browser/uirun.js --engine firefox --device tablet                        # iPad quer (emuliert)
node qa/browser/scenarios.js --engine chromium|firefox|webkit                     # Einzelszenarien
```

Einen fehlgeschlagenen Lauf wiederholen: Run-ID und Salz genügen (`makeSpec(cat, nr, salz)` ist deterministisch), z. B.
`node -e "const s=require('./qa/sim');s.runOne(s.makeSpec('D',77,'erstlauf'),{}).then(r=>console.log(r.result,r.reason))"`.

## Grenzen der Methode (ehrlich)

- Die VM zeichnet im Modus `smart` nur, wo Spiellogik an der Zeichnung hängt (Abspann, Overlay-Trefferflächen). Gleicher Seed im Modus `full` (jede Zeichnung wie im Browser) ergab dieselben Story-Zustände (`results/validate_driver.json`).
- Die Läufe nutzen die Test-API `M.TA` (Hotspot-/Ausgangsaktionen wie ein Tipp, mit allen Prüfungen des Spiels). Die Oberflächen-Sperre `E.busy` liegt in `click()`; deshalb laufen Belastungstests über Zeigerereignisse.
- Fortsetzungen nach Störungen benutzen die Lösungsskripte; scheitern sie, heißt das „unentschieden“, nicht „Softlock“. Die Sonde kann einen Softlock nicht beweisen, nur widerlegen (Phasenwechsel) oder einen Verdacht liefern; Rätseltypen `halves`, `glyphs`, `peil` löst sie nicht selbst.
- Mobile Geräte sind Playwright-Emulationen, keine echten iPhones/iPads. Spannung, Fairness und Schwierigkeit misst das nicht.
