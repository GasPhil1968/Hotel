# Atmosphäre-Effekte

Stand 13.11.2026. Angeregt von Vergleichsbildern (Lichtinseln im Dunkeln, Lichtstrahlen, Funken, farbiges Zauberlicht).
Die Figuren bleiben unverändert: Die Effekte wirken nach dem Zeichnen auf das fertige Bild und hellen nur auf oder dunkeln ab.

Code: `game/src/22_atmo.js`, eingehängt in `drawScene` (`game/src/06_ui.js`), Malas Leuchten in `act` (`game/src/05_engine.js`),
Rahmen der Erinnerungsbilder im Overlay `memory` (`06_ui.js`), Schalter in den Einstellungen (`07_shell.js`).

## Was wo wirkt

| Effekt | Wo |
|---|---|
| **Nacht:** abgedunkelte Ränder, Lichtinseln an den Lampen, Mondlicht auf Marko | jeder Raum bei Nacht; die Lampen sucht das Spiel selbst (helle warme Pixel im Hintergrund, gebündelt) |
| **Dämmerung / Morgengrauen:** leicht abgedunkelte Ränder | jeder Raum |
| **Tag, innen:** Staub in der Luft, sanfte Randabdunklung | alle Innenräume |
| **Tag, Fenster:** zwei schräge Lichtstrahlen vom Fenster auf den Boden, mit Staub (bei Regen und Schnee schwächer) | Dachzimmer, Kafana, Bahnhofsmission, Mamas Wohnung, Mamas Schlafzimmer, Haus Zelenika, Nadas Wohnung, Gemeinschaftsraum, Pension |
| **Bar „Bura“:** vormittags Sonnenstrahlen mit Staub, abends Lampenlicht, dunkle Ecken | eigener Eintrag |
| **Sustipan bei Nacht:** Laterne, Mondlicht überm Meer; nach Jakovs Fall das rote Grablicht mit Flamme und Funken | eigener Eintrag |
| **Bunker unter Gleis 11:** Licht der einen Lampe, Staub | eigener Eintrag |
| **Malas Leuchten:** bei jedem „Spüren“ ein türkiser Ring, ihr Licht auf der Umgebung, zuckende Linien zur gespürten Stelle (1,6 s) | überall |
| **Erinnerungsbilder:** ausgefranster schwarzer Rahmen | alle „Nachhall“- und Erinnerungsbilder |
| Geister bleiben im Dunkeln hell | überall |

Räume mit eigener Dunkelheit (Schutzraum, Ledana, Kammer) bleiben, wie sie sind. In der Geistersicht wirkt nur Malas Leuchten.

## Einstellung

„Atmosphäre“ an/aus (Vorgabe an, gespeichert als `mala.atmo`). `?atmo=1` / `?atmo=0` erzwingt. Unter Testautomatisierung
(`navigator.webdriver`) und in der Test-VM aus, damit Tests und Vergleichsbilder unverändert bleiben; `M.ATMO_ON=true` schaltet sie dort ein.

## Prüfung (Build 13.11.2026)

| Prüfung | Ergebnis |
|---|---|
| Regression `node qa/regress/run.js` | 34 von 34 OK |
| Musterlösung Kapitel 1 | OK, keine JS-Fehler |
| Bildrate (Chromium, Riva nachts, Bar vormittags, Gemeinschaftsraum) | 60 Bilder/s mit und ohne Effekte |
| Bilderbogen über 20 Räume, Tag und Nacht | gesichtet; Fensterstrahlen danach schräger und ohne Gelbstich, Innenräume nachts heller |

Bilder: `design/atmo/vergleich_1.png` … `vergleich_5_raeume.png` (links vorher, rechts nachher), `5_mala_spuert_echt.png`, `6_erinnerung_rahmen.png`.
