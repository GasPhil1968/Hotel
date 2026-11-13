# Atmosphäre-Effekte (Probe)

Stand 13.11.2026. Angeregt von Vergleichsbildern (Lichtinseln im Dunkeln, Lichtstrahlen, Funken, farbiges Zauberlicht).
Die Figuren bleiben unverändert: Die Effekte wirken nach dem Zeichnen auf das fertige Bild und hellen nur auf oder dunkeln ab.

Code: `game/src/22_atmo.js`, eingehängt in `drawScene` (`game/src/06_ui.js`). **Nur mit `?atmo=1` aktiv**, im normalen Spiel
ändert sich nichts.

| Effekt | Funktion | Probe |
|---|---|---|
| Dunkelheit mit Lichtinseln (warm, kalt), flackernd; Geister bleiben hell | `dark`, `pools` (auch `follow:'marko'`) | Sustipan bei Nacht mit Jakovs Grablicht, Bar bei Nacht |
| Lichtstrahlen mit treibendem Staub | `beams` | Bar „Bura“ am Vormittag |
| Glut, Funken, kleine Flamme (mit Grablicht-Glas) | `embers` | Grablicht an der Pinie |
| Lichthöfe | `halos` | Laterne, Grablicht |
| Malas Leuchten beim Spüren: türkiser Ring, Licht auf der Umgebung, zuckende Linien zur gespürten Stelle | `M.atmoPulse(x,y,tx,ty)` | Sustipan, Mala spürt die Mauer |
| Schwarzer, ausgefranster Rahmen | `frame` | noch ohne Raum (für Erinnerungen gedacht) |

Bilder: `design/atmo/vergleich_1.png` … `vergleich_4.png` (links vorher, rechts nachher) und die Einzelbilder.
Noch offen: Effekte pro Raum festlegen, Malas Leuchten an „Spüren“ koppeln, Einstellung an/aus, Leistung auf schwachen Geräten prüfen.
