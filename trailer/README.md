# MALA – Trailer (90 s, deutsch)

**Status: Video gerendert und geprüft.** Die Datei `MALA_Trailer_90s_DE.mp4` ist aus echtem Spielmaterial des aktuellen Builds entstanden: Kapitel 1 (Split) und Kapitel 2 (Sarajevo). Spiel und Ton wurden in der laufenden Engine aufgenommen und montiert. Weder Grafik noch Ton sind KI-generiert.

## Lieferung

| Datei | Inhalt |
|---|---|
| `MALA_Trailer_90s_DE.mp4` | Der Trailer (22,4 MB, SHA-256 `2dc3f28d74ca387a0416ca4eeeb79cce5453d670911222a25b8b585909a93bae`). Er wird direkt übergeben und liegt wie die früheren Videos nicht im Repository; neu erzeugen lässt er sich mit [`WORKFLOW.md`](WORKFLOW.md). |
| [`SCHNITTPLAN.md`](SCHNITTPLAN.md) | Dramaturgie, Schnittliste mit Zeitcodes, wörtliche Spieltexte je Abschnitt, Einblendungen, Musik, Ton, Bild |
| [`FEATURES.md`](FEATURES.md) | Feature-Matrix: vorhanden? / Szene und Nachweis / Timecode, dazu alles, was bewusst nicht behauptet wird |
| [`QUELLEN_UND_STATUS.md`](QUELLEN_UND_STATUS.md) | Spielversion, Arbeitskopie, Spielstände, verwendete Aufnahmen, inhaltlicher Stand, Spoilerprüfung, gefundene Auffälligkeiten, Ungeprüftes |
| [`WORKFLOW.md`](WORKFLOW.md) | Reproduzierbarer Weg vom Repository zum fertigen MP4 |
| `werkzeug/` | Aufnahme (`rec.js`, `shots.js`), Schnitt und Mischung (`edl.py`, `compose.py`), Sichtung (`events.py`, `sheet*.py`, `rms.py`), Dokumente (`schnittplan.py`, `doku.py`), Prüfungen (`qc.py`, `verify*.js`) |
| `pruefung/` | Messprotokoll `qc.json`, Kontaktbogen alle 3 s, erstes und letztes Bild jedes Abschnitts, Funktionsprüfungen, Pegel je Abschnitt |

Untertitel gibt es nicht. Der Trailer hat keinen Sprecher, und alle Texte sind ohnehin im Bild: die Spieltexte des Spiels und wenige Einblendungen.

## Prüfergebnis der gelieferten Datei

Gemessen mit `werkzeug/qc.py` (ffprobe/ffmpeg) am fertigen MP4:

| Vorgabe | Ergebnis |
|---|---|
| MP4, H.264, 1920 × 1080, 16:9 | H.264 High\@4.1, 1920 × 1080, SAR 1:1, DAR 16:9 |
| konstant 30 Bilder/s, 2700 Bilder | r_frame_rate = avg_frame_rate = 30/1, **2700 Bilder**, 90,000 s |
| SDR, yuv420p | yuv420p, BT.709 (Primaries, Transfer, Matrix), TV-Bereich |
| AAC Stereo 48 kHz | AAC-LC, 48 kHz, Stereo, 254 kbit/s (Ziel 256 kbit/s) |
| −16 bis −14 LUFS, ≤ −1 dBTP | **−15,0 LUFS** integriert, True Peak **−2,0 dBTP**, LRA 3,8 LU |
| keine Fehlbilder, keine Tonlöcher | keine schwarze Strecke ab 0,2 s (das Video blendet nur am Anfang in 0,5 s aus Schwarz auf), keine Stille unter −50 dB ab 0,4 s |

## Inhaltliche Prüfung

Durchgesehen am fertigen MP4: Kontaktbogen alle 3 s sowie das erste und letzte Bild jedes der 31 Abschnitte.

- **Wahrheit:** Jede Einblendung ist geprüft (`FEATURES.md`). Kein Wort über Preise, Spielzeit, Vertonung, iPad, Stores oder Termine, und keine Webadresse.
- **Spoiler:** Malas Identität, Todesumstände, Fall-Lösungen, Kapitelenden und lesbare Spoiler-Dokumente kommen nicht vor. Kennenlernen, Abwesenheit und Rückkehr sind nicht vollständig zu sehen (Einzelheiten in `QUELLEN_UND_STATUS.md`).
- **Bild:**
  - Ganzzahlig ×5 vergrößert, ohne Strecken, ohne Weichzeichnung und ohne Kamerafahrten über Standbilder.
  - Keine eingefügten Effekte, kein Browserrahmen, keine Debug-Anzeigen.
  - Jeder Schnitt liegt auf einer Bildgrenze. Kein Spieltext blitzt nur für einzelne Bilder auf; `schnittplan.py` prüft das je Abschnitt.
- **Ton:** Nur Musik und Geräusche der Engine. Die Musik ist auf Takt- und Schleifengrenzen geschnitten.
- **Timing:** Gameplay ab dem ersten Bild, Marko und Mala sind nach 11,6 s eingeführt. Die Pflichtsequenz zur Zusammenarbeit läuft von 00:27 bis 00:44, „MALA“ steht in den letzten 6,1 s.
- **Wirkung ohne Ton:** Die Geschichte trägt sich über die Spieltexte und die Einblendungen. Kurze Schlüsselzeilen stehen lange genug für 8–15 Zeichen pro Sekunde, die Spüren-Zeile für 19. Drei lange Spielzeilen sind nur zum Teil lesbar, ihr erster Satz trägt die Aussage: Markos Seite 31, Mladens Regal, Zdenkas Antwort.
