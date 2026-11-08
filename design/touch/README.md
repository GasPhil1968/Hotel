# design/touch/: Touch-Analyse iPhone und iPad

Werkzeuge und Belege zu `design/TOUCH_KONZEPT.md` (Analyse) und `design/TOUCH_UMSETZUNG.md` (Umsetzung). Die Dateien direkt in diesem Ordner sind der Stand der Analyse (vor der Umsetzung); `nachher/` enthält dieselben Messungen nach der Umsetzung.

| Pfad | Inhalt |
|---|---|
| `hotspotscan.js` | Spielt Kapitel 1–4 mit den QA-Musterlösungen in der Node-VM durch und vermisst in jedem neuen Raumzustand die Trefferflächen mit `E.hotspotAt`: Fläche, größtes sicheres Quadrat, Nachbarn unter der Fingerkuppe. Ergebnis: `hotspots.json` (75 Räume, 315 Zustände, 904 Hotspots). |
| `devicetests.js` | Messungen (Maßstab, Szenenanteil, Leiste, Verb-Menü, Antwortzeilen, Pausenmenü) und die Bedienabläufe F1–F10 auf emulierten Apple-Geräten (Playwright WebKit) und Desktop (Chromium); Touch-Gesten zusätzlich über CDP in Chromium. Ergebnis: `devicetests.json`, Bildschirmfotos in `evidence/`. |
| `nachher/` | Nach der Umsetzung: `devicetests.json` mit Bildern in `evidence/`, `hotspots_fang.json` (Erreichbarkeit mit Fangradius, K6). |
| `GERAETEPRUEFUNG.md` | Prüfliste für echte iPhones und iPads (E7). |
| `QUELLEN.md` | Fundstellen zu iOS/iPadOS-Safari: Vollbild, Ausrichtung, Safe Area, Leisten, Ton, Home-Bildschirm, Lebenszyklus. |
| `entwurf/` | Quellen des Layoutentwurfs (Zeichenbretter `.dc.html`, `canvas.json`) und die Spielbilder dazu (`assets/`, erzeugt mit `entwurf/assets.js`). Veröffentlicht als Zeichenfläche: https://claude.ai/artifact/4LGo76UBHuwvrLEjfMunXb (privat). |

```bash
node design/touch/hotspotscan.js [--ch 1,2,3,4] [--out design/touch/hotspots.json] [--fang 10]
node design/touch/devicetests.js [--only messung,F1,…,F10,F5b,F3b,F10cr] [--dev iphoneSE,iphone16,iphone13,iphone17pm,ipad,ipadpro,desktop] [--out design/touch/nachher]
```

**Wichtig:** Alles hier ist Emulation oder Codeprüfung. Ein Playwright-WebKit unter Linux ist nicht Safari auf iOS. Es fehlen Safe-Area-Ränder, Safari-Leisten, Systemgesten, Bildschirmtastatur und Ton. Was nur auf echten Geräten prüfbar ist, steht in `TOUCH_KONZEPT.md`, Abschnitt F2.
