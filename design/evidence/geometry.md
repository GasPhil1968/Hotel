# Trefferflächen je Gerät (gemessen im Browser)

Gemessen mit `design/tools/capture.js`: für jeden Bildschirmzustand alle 320×200 Spielpixel über `M.uiHit` abgefragt, Umrissrechteck je Bedienelement, umgerechnet mit dem tatsächlichen Canvas-Maßstab. „Kleinste Seite“ ist die kürzere Kante des Rechtecks. Richtwerte: WCAG 2.2 SC 2.5.8 mindestens 24×24 CSS-px; Apple HIG 44×44 pt, Material 48×48 dp.

## Desktop 1280×800 (Chromium, Maus)

- Maßstab 4 CSS-px je Spielpixel (1× Gerätepixel), Canvas 1280×800 CSS-px in 1280×800 → 100 % der Fläche genutzt; Szene 1280×576 CSS-px
- Schrift: Versalhöhe 7 Spielpixel = 28.0 CSS-px (entspricht etwa 40 px Schriftgröße), Zeilenabstand 10 → 40.0 CSS-px

| Bedienelement | gemessen in | kleinste Seite (CSS-px) | Beispiel (Spielpx → CSS-px) | ≥ 24 | ≥ 44 |
|---|---|---|---|---|---|
| Titel: Hauptmenüzeile | 45 Zuständen | 36.0 | 228×9 → 912×36 (`t:1`, 01_titel_erststart.png) | ja | nein |
| Titel: Platz-/Bestätigungszeile | 17 Zuständen | 52.0 | 228×13 → 912×52 (`t:0`, 04_titel_platzwahl.png) | ja | ja |
| HUD: „Notizen“ | 20 Zuständen | 60.0 | 39×15 → 156×60 (`notes`, 07_intro_08s.png) | ja | ja |
| HUD: „Karte“ | 20 Zuständen | 60.0 | 33×15 → 132×60 (`map`, 07_intro_08s.png) | ja | ja |
| HUD: „Zeigen“ | 20 Zuständen | 60.0 | 36×15 → 144×60 (`reveal`, 07_intro_08s.png) | ja | ja |
| HUD: „Menü“ | 20 Zuständen | 60.0 | 29×15 → 116×60 (`menu`, 07_intro_08s.png) | ja | ja |
| HUD: Blätterpfeil Inventar | 40 Zuständen | 40.0 | 10×41 → 40×164 (`up`, 07_intro_08s.png) | ja | nein |
| HUD: Inventarfeld | 120 Zuständen | 152.0 | 40×38 → 160×152 (`i:0`, 07_intro_08s.png) | ja | ja |
| Verb-Popup: Zeile | 7 Zuständen | 52.0 | 66×13 → 264×52 (`p:0`, 12_verb_popup.png) | ja | ja |
| Notizbuch: Schließen „X“ | 2 Zuständen | 56.0 | 15×14 → 60×56 (`nx`, 15_notizbuch.png) | ja | ja |
| Pausenmenü: Zeile | 39 Zuständen | 48.0 | 172×12 → 688×48 (`m:0`, 16_menue.png) | ja | ja |
| Dialog: Schließen „X“ | 3 Zuständen | 56.0 | 18×14 → 72×56 (`cx`, 29_dialog_optionen.png) | ja | ja |
| Dialog: Antwortzeile | 10 Zuständen | 44.0 | 292×11 → 1168×44 (`c:0`, 29_dialog_optionen.png) | ja | ja |
| Dialog: Blättern ▲/▼ | 1 Zuständen | 56.0 | 18×14 → 72×56 (`cd`, 29_dialog_optionen.png) | ja | ja |
| Rätsel: „Zurück“ | 2 Zuständen | 64.0 | 38×16 → 152×64 (`zx`, 31_raetsel_puzzle.png) | ja | ja |
| Rätsel: Zeile | 10 Zuständen | 72.0 | 256×18 → 1024×72 (`z:0`, 31_raetsel_puzzle.png) | ja | ja |
| Rätsel: „Vorlesen“ | 2 Zuständen | 56.0 | 100×14 → 400×56 (`zgo`, 31_raetsel_puzzle.png) | ja | ja |
| Notizbuch: Zeile | 4 Zuständen | 76.0 | 234×19 → 936×76 (`n:p2_mala_gone`, 33_k2_notizbuch.png) | ja | ja |
| Karte/Overlay: Element | 3 Zuständen | 120.0 | 78×30 → 312×120 (`o:x`, 40_karte.png) | ja | ja |
| HUD: Figurenwechsel (Porträt) | 6 Zuständen | 152.0 | 38×40 → 152×160 (`sw`, 41_k3_szene.png) | ja | ja |

## Tablet quer – iPad gen 7 (Chromium-Emulation, Touch)

- Maßstab 3 CSS-px je Spielpixel (2× Gerätepixel), Canvas 960×600 CSS-px in 1080×810 → 66 % der Fläche genutzt; Szene 960×432 CSS-px
- Schrift: Versalhöhe 7 Spielpixel = 21.0 CSS-px (entspricht etwa 30 px Schriftgröße), Zeilenabstand 10 → 30.0 CSS-px

| Bedienelement | gemessen in | kleinste Seite (CSS-px) | Beispiel (Spielpx → CSS-px) | ≥ 24 | ≥ 44 |
|---|---|---|---|---|---|
| Titel: Hauptmenüzeile | 38 Zuständen | 27.0 | 228×9 → 684×27 (`t:1`, 01_titel_erststart.png) | ja | nein |
| Titel: Platz-/Bestätigungszeile | 17 Zuständen | 39.0 | 228×13 → 684×39 (`t:0`, 03_titel_platzwahl.png) | ja | nein |
| HUD: „Notizen“ | 17 Zuständen | 45.0 | 39×15 → 117×45 (`notes`, 05_intro_erzaehlung.png) | ja | ja |
| HUD: „Karte“ | 17 Zuständen | 45.0 | 33×15 → 99×45 (`map`, 05_intro_erzaehlung.png) | ja | ja |
| HUD: „Zeigen“ | 17 Zuständen | 45.0 | 36×15 → 108×45 (`reveal`, 05_intro_erzaehlung.png) | ja | ja |
| HUD: „Menü“ | 17 Zuständen | 45.0 | 29×15 → 87×45 (`menu`, 05_intro_erzaehlung.png) | ja | ja |
| HUD: Blätterpfeil Inventar | 34 Zuständen | 30.0 | 10×41 → 30×123 (`up`, 05_intro_erzaehlung.png) | ja | nein |
| HUD: Inventarfeld | 102 Zuständen | 114.0 | 40×38 → 120×114 (`i:0`, 05_intro_erzaehlung.png) | ja | ja |
| Verb-Popup: Zeile | 7 Zuständen | 39.0 | 66×13 → 198×39 (`p:0`, 07_verb_popup.png) | ja | nein |
| Notizbuch: Schließen „X“ | 2 Zuständen | 42.0 | 15×14 → 45×42 (`nx`, 10_notizbuch.png) | ja | nein |
| Pausenmenü: Zeile | 39 Zuständen | 36.0 | 172×12 → 516×36 (`m:0`, 11_menue.png) | ja | nein |
| Dialog: Schließen „X“ | 3 Zuständen | 42.0 | 18×14 → 54×42 (`cx`, 24_dialog_optionen.png) | ja | nein |
| Dialog: Antwortzeile | 10 Zuständen | 33.0 | 292×11 → 876×33 (`c:0`, 24_dialog_optionen.png) | ja | nein |
| Dialog: Blättern ▲/▼ | 1 Zuständen | 42.0 | 18×14 → 54×42 (`cd`, 24_dialog_optionen.png) | ja | nein |
| Rätsel: „Zurück“ | 2 Zuständen | 48.0 | 38×16 → 114×48 (`zx`, 26_raetsel_puzzle.png) | ja | ja |
| Rätsel: Zeile | 10 Zuständen | 54.0 | 256×18 → 768×54 (`z:0`, 26_raetsel_puzzle.png) | ja | ja |
| Rätsel: „Vorlesen“ | 2 Zuständen | 42.0 | 100×14 → 300×42 (`zgo`, 26_raetsel_puzzle.png) | ja | nein |
| Notizbuch: Zeile | 4 Zuständen | 57.0 | 234×19 → 702×57 (`n:p2_mala_gone`, 28_k2_notizbuch.png) | ja | ja |
| Karte/Overlay: Element | 3 Zuständen | 90.0 | 78×30 → 234×90 (`o:x`, 35_karte.png) | ja | ja |
| HUD: Figurenwechsel (Porträt) | 6 Zuständen | 114.0 | 38×40 → 114×120 (`sw`, 36_k3_szene.png) | ja | ja |

## Smartphone quer – iPhone 13 (WebKit-Emulation, Touch)

- Maßstab 1.667 CSS-px je Spielpixel (3× Gerätepixel), Canvas 533×333 CSS-px in 750×342 → 69 % der Fläche genutzt; Szene 533×240 CSS-px
- Schrift: Versalhöhe 7 Spielpixel = 11.7 CSS-px (entspricht etwa 17 px Schriftgröße), Zeilenabstand 10 → 16.7 CSS-px

| Bedienelement | gemessen in | kleinste Seite (CSS-px) | Beispiel (Spielpx → CSS-px) | ≥ 24 | ≥ 44 |
|---|---|---|---|---|---|
| Titel: Hauptmenüzeile | 38 Zuständen | 15.0 | 228×9 → 380×15 (`t:1`, 01_titel_erststart.png) | **nein** | nein |
| Titel: Platz-/Bestätigungszeile | 17 Zuständen | 21.7 | 228×13 → 380×21.7 (`t:0`, 03_titel_platzwahl.png) | **nein** | nein |
| HUD: „Notizen“ | 17 Zuständen | 25.0 | 39×15 → 65×25 (`notes`, 05_intro_erzaehlung.png) | ja | nein |
| HUD: „Karte“ | 17 Zuständen | 25.0 | 33×15 → 55×25 (`map`, 05_intro_erzaehlung.png) | ja | nein |
| HUD: „Zeigen“ | 17 Zuständen | 25.0 | 36×15 → 60×25 (`reveal`, 05_intro_erzaehlung.png) | ja | nein |
| HUD: „Menü“ | 17 Zuständen | 25.0 | 29×15 → 48.3×25 (`menu`, 05_intro_erzaehlung.png) | ja | nein |
| HUD: Blätterpfeil Inventar | 34 Zuständen | 16.7 | 10×41 → 16.7×68.3 (`up`, 05_intro_erzaehlung.png) | **nein** | nein |
| HUD: Inventarfeld | 102 Zuständen | 63.3 | 40×38 → 66.7×63.3 (`i:0`, 05_intro_erzaehlung.png) | ja | ja |
| Verb-Popup: Zeile | 7 Zuständen | 21.7 | 66×13 → 110×21.7 (`p:0`, 07_verb_popup.png) | **nein** | nein |
| Notizbuch: Schließen „X“ | 2 Zuständen | 23.3 | 15×14 → 25×23.3 (`nx`, 10_notizbuch.png) | **nein** | nein |
| Pausenmenü: Zeile | 39 Zuständen | 20.0 | 172×12 → 286.7×20 (`m:0`, 11_menue.png) | **nein** | nein |
| Dialog: Schließen „X“ | 3 Zuständen | 23.3 | 18×14 → 30×23.3 (`cx`, 24_dialog_optionen.png) | **nein** | nein |
| Dialog: Antwortzeile | 10 Zuständen | 18.3 | 292×11 → 486.7×18.3 (`c:0`, 24_dialog_optionen.png) | **nein** | nein |
| Dialog: Blättern ▲/▼ | 1 Zuständen | 23.3 | 18×14 → 30×23.3 (`cd`, 24_dialog_optionen.png) | **nein** | nein |
| Rätsel: „Zurück“ | 2 Zuständen | 26.7 | 38×16 → 63.3×26.7 (`zx`, 26_raetsel_puzzle.png) | ja | nein |
| Rätsel: Zeile | 10 Zuständen | 30.0 | 256×18 → 426.7×30 (`z:0`, 26_raetsel_puzzle.png) | ja | nein |
| Rätsel: „Vorlesen“ | 2 Zuständen | 23.3 | 100×14 → 166.7×23.3 (`zgo`, 26_raetsel_puzzle.png) | **nein** | nein |
| Notizbuch: Zeile | 4 Zuständen | 31.7 | 234×19 → 390×31.7 (`n:p2_mala_gone`, 28_k2_notizbuch.png) | ja | nein |
| Karte/Overlay: Element | 3 Zuständen | 50.0 | 78×30 → 130×50 (`o:x`, 35_karte.png) | ja | ja |
| HUD: Figurenwechsel (Porträt) | 6 Zuständen | 63.3 | 38×40 → 63.3×66.7 (`sw`, 36_k3_szene.png) | ja | ja |

## Smartphone hochkant – iPhone 13 (WebKit-Emulation, Bild gedreht)

- Maßstab 1.667 CSS-px je Spielpixel (3× Gerätepixel), Canvas 533×333 CSS-px in 390×664 (gedreht) → 69 % der Fläche genutzt; Szene 533×240 CSS-px
- Schrift: Versalhöhe 7 Spielpixel = 11.7 CSS-px (entspricht etwa 17 px Schriftgröße), Zeilenabstand 10 → 16.7 CSS-px

| Bedienelement | gemessen in | kleinste Seite (CSS-px) | Beispiel (Spielpx → CSS-px) | ≥ 24 | ≥ 44 |
|---|---|---|---|---|---|
| Titel: Hauptmenüzeile | 38 Zuständen | 15.0 | 228×9 → 380×15 (`t:1`, 01_titel_erststart.png) | **nein** | nein |
| Titel: Platz-/Bestätigungszeile | 17 Zuständen | 21.7 | 228×13 → 380×21.7 (`t:0`, 03_titel_platzwahl.png) | **nein** | nein |
| HUD: „Notizen“ | 17 Zuständen | 25.0 | 39×15 → 65×25 (`notes`, 05_intro_erzaehlung.png) | ja | nein |
| HUD: „Karte“ | 17 Zuständen | 25.0 | 33×15 → 55×25 (`map`, 05_intro_erzaehlung.png) | ja | nein |
| HUD: „Zeigen“ | 17 Zuständen | 25.0 | 36×15 → 60×25 (`reveal`, 05_intro_erzaehlung.png) | ja | nein |
| HUD: „Menü“ | 17 Zuständen | 25.0 | 29×15 → 48.3×25 (`menu`, 05_intro_erzaehlung.png) | ja | nein |
| HUD: Blätterpfeil Inventar | 34 Zuständen | 16.7 | 10×41 → 16.7×68.3 (`up`, 05_intro_erzaehlung.png) | **nein** | nein |
| HUD: Inventarfeld | 102 Zuständen | 63.3 | 40×38 → 66.7×63.3 (`i:0`, 05_intro_erzaehlung.png) | ja | ja |
| Verb-Popup: Zeile | 7 Zuständen | 21.7 | 66×13 → 110×21.7 (`p:0`, 07_verb_popup.png) | **nein** | nein |
| Notizbuch: Schließen „X“ | 2 Zuständen | 23.3 | 15×14 → 25×23.3 (`nx`, 10_notizbuch.png) | **nein** | nein |
| Pausenmenü: Zeile | 39 Zuständen | 20.0 | 172×12 → 286.7×20 (`m:0`, 11_menue.png) | **nein** | nein |
| Dialog: Schließen „X“ | 3 Zuständen | 23.3 | 18×14 → 30×23.3 (`cx`, 24_dialog_optionen.png) | **nein** | nein |
| Dialog: Antwortzeile | 10 Zuständen | 18.3 | 292×11 → 486.7×18.3 (`c:0`, 24_dialog_optionen.png) | **nein** | nein |
| Dialog: Blättern ▲/▼ | 1 Zuständen | 23.3 | 18×14 → 30×23.3 (`cd`, 24_dialog_optionen.png) | **nein** | nein |
| Rätsel: „Zurück“ | 2 Zuständen | 26.7 | 38×16 → 63.3×26.7 (`zx`, 26_raetsel_puzzle.png) | ja | nein |
| Rätsel: Zeile | 10 Zuständen | 30.0 | 256×18 → 426.7×30 (`z:0`, 26_raetsel_puzzle.png) | ja | nein |
| Rätsel: „Vorlesen“ | 2 Zuständen | 23.3 | 100×14 → 166.7×23.3 (`zgo`, 26_raetsel_puzzle.png) | **nein** | nein |
| Notizbuch: Zeile | 4 Zuständen | 31.7 | 234×19 → 390×31.7 (`n:p2_mala_gone`, 28_k2_notizbuch.png) | ja | nein |
| Karte/Overlay: Element | 3 Zuständen | 50.0 | 78×30 → 130×50 (`o:x`, 35_karte.png) | ja | ja |
| HUD: Figurenwechsel (Porträt) | 6 Zuständen | 63.3 | 38×40 → 63.3×66.7 (`sw`, 36_k3_szene.png) | ja | ja |

