# design/ – Oberflächen-Analyse und Entwurf

| Pfad | Inhalt |
|---|---|
| `TOUCH_KONZEPT.md` | Touch-Steuerung auf iPhone und iPad: Grundlage, Gesamturteil, Problemliste T01–T24, Bedienmodell, Layoutentwurf, Umsetzungsplan, Testprotokoll und Abnahmekriterien |
| `touch/` | Messwerkzeuge und Belege dazu (siehe `touch/README.md`) |
| `UMSETZUNG.md` | Stand der Umsetzung (Phase 1–4): was umgesetzt ist, Abnahme F1–F25 mit Nachweis, Abweichungen, Tests |
| `UI_KONZEPT.md` | Analyse und Entwurf (A–F): Entscheidungen des Autors, Bestandsaufnahme, Problemliste, Gestaltungsrichtung, Entwurf je Bildschirm (D1–D17, inkl. Breitbild-Leiste), Umsetzungsplan, Abnahme (F1–F25) |
| `prototype/` | Klickbarer Entwurf (`src.html` → `index.html`), Bilder aus dem Spiel (`img/`), Ist-Bilder (`ist/`), echte Hotspot-Daten (`hotspots.json`). Veröffentlicht: https://claude.ai/artifact/W8o3QnYDp8TEz9ayPLmVcP |
| `evidence/` | Belege: Bildschirmfotos je Gerät (`desktop/`, `tablet/`, `phone/`, `phonePortrait/`) mit `capture.json` (Zustände, Trefferflächen, Escape-Protokoll, Intro-Zeitleiste), `geometry.md` (Tippflächen in CSS-px), `vm/` (Kapitelübergänge, Produktionscode in der Node-VM gerendert), `fontcheck.txt` (Abdeckung der Leseschrift) |
| `assets/MALAPixel.otf` | Webfont aus der Bitmap-Schrift des Spiels (`M.FONT`) |
| `assets/atkinson-hyperlegible-next-*.woff2` | Leseschrift „Atkinson Hyperlegible Next“ 400/700, latin + latin-ext (aus `@fontsource/atkinson-hyperlegible-next` 5.3.0), Lizenz `assets/AtkinsonHyperlegibleNext-OFL.txt` (SIL OFL 1.1) |
| `tools/` | Werkzeuge (siehe unten) |

## Befehle

```bash
node design/tools/capture.js --device desktop|tablet|phone|phonePortrait   # Bildschirmzustände + Trefferflächen im Browser
node design/tools/geometry.js                                              # Auswertung → evidence/geometry.md
node design/tools/vmshots.js                                               # Kapitelübergänge (VM)
OPENTYPE=<pfad>/node_modules/opentype.js node design/tools/makefont.js     # Webfont aus M.FONT (opentype.js@1.3.4 nur zum Bauen)
node design/tools/assets.js && node design/tools/assets2.js                # Bildmaterial und Hotspots für den Prototyp
node design/tools/buildproto.js                                            # prototype/index.html (Schriften + Hotspots eingebettet)
node design/tools/protosweep.js                                            # Gesamtprüfung des Prototyps (136 Zustände, Chromium)
FONTSOURCE=<pfad>/node_modules/@fontsource/atkinson-hyperlegible-next \
OPENTYPE=<pfad>/node_modules/opentype.js node design/tools/fontcheck.js    # Leseschrift gegen alle Zeichen der Spieltexte → evidence/fontcheck.txt
```

## Tests der Umsetzung (siehe `UMSETZUNG.md`)

```bash
node qa/ui/phase1.js [--shots <ordner>]    # Phase 1: Esc-Stapel, Antwortlisten, Figurenknopf, Fließtext, Hochformat
node qa/ui/phase2.js [--shots <ordner>]    # Phase 2: HTML-Schicht, Spielstände, Kapitelsperre, Einstellungen, Schriften
node qa/ui/phase3.js [--shots <ordner>]    # Phase 3: Breitbild-Leiste (iPhone quer), Wechsel, Drehung
node qa/ui/phase4.js [--shots <ordner>]    # Phase 4: Untertitel, Schnellvorlauf, Sicherung, „Zuletzt“, Lesezeichen-Namen
node qa/ui/hudcmp.js <alt/index.html>      # gewohnte Leiste pixelgleich zu einer früheren Fassung (Desktop, Tablet)
bash design/tools/package_ui.sh            # bauen und dist/MALA_netlify_oberflaeche.zip packen
```

Geräte sind Playwright-Emulationen (Chromium, WebKit), keine echten Telefone oder Tablets.
