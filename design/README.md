# design/ – Oberflächen-Analyse und Entwurf

| Pfad | Inhalt |
|---|---|
| `UI_KONZEPT.md` | Analyse und Entwurf (A–F): Bestandsaufnahme, Problemliste, Gestaltungsrichtung, Entwurf je Bildschirm, Umsetzungsplan, Abnahme |
| `prototype/` | Klickbarer Entwurf (`src.html` → `index.html`), Bilder aus dem Spiel (`img/`), Ist-Bilder (`ist/`), echte Hotspot-Daten (`hotspots.json`). Veröffentlicht: https://claude.ai/artifact/W8o3QnYDp8TEz9ayPLmVcP |
| `evidence/` | Belege: Bildschirmfotos je Gerät (`desktop/`, `tablet/`, `phone/`, `phonePortrait/`) mit `capture.json` (Zustände, Trefferflächen, Escape-Protokoll, Intro-Zeitleiste), `geometry.md` (Tippflächen in CSS-px), `vm/` (Kapitelübergänge, Produktionscode in der Node-VM gerendert) |
| `assets/MALAPixel.otf` | Webfont aus der Bitmap-Schrift des Spiels (`M.FONT`) |
| `tools/` | Werkzeuge (siehe unten) |

## Befehle

```bash
node design/tools/capture.js --device desktop|tablet|phone|phonePortrait   # Bildschirmzustände + Trefferflächen im Browser
node design/tools/geometry.js                                              # Auswertung → evidence/geometry.md
node design/tools/vmshots.js                                               # Kapitelübergänge (VM)
OPENTYPE=<pfad>/node_modules/opentype.js node design/tools/makefont.js     # Webfont aus M.FONT (opentype.js@1.3.4 nur zum Bauen)
node design/tools/assets.js && node design/tools/assets2.js                # Bildmaterial und Hotspots für den Prototyp
node design/tools/buildproto.js                                            # prototype/index.html (Schrift + Hotspots eingebettet)
```

Geräte sind Playwright-Emulationen (Chromium, WebKit), keine echten Telefone oder Tablets.
