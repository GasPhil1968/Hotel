# MALA – Trailer 90 s: Render-Workflow (reproduzierbar)

So entsteht `MALA_Trailer_90s_DE.mp4` aus dem Spiel in diesem Repository. Aufgenommen wird nur, was die Engine selbst zeigt und erzeugt. Am Spiel wird nichts geändert.

## Voraussetzungen

| Werkzeug | Geprüfte Version |
|---|---|
| Node.js | 22.23 |
| Playwright mit Chromium | 1.63 |
| Python 3 mit numpy und Pillow | numpy 2.5, Pillow 12.3 |
| ffmpeg mit libx264 und AAC | 6.1.1 |

Außerdem braucht es die Schrift Inter (Inter, InterDisplay) unter `/usr/share/fonts/opentype/inter/`; der Pfad steht in `compose.py`, `FONT_DIR`.

## 1. Arbeitskopie anlegen

Die Arbeitskopie liegt außerhalb des Repositorys. So bleiben Originaldateien und persönliche Spielstände unberührt.

```bash
REPO=$(pwd)                       # Wurzel dieses Repositorys
W=$HOME/mala-trailer              # beliebiger leerer Ordner
mkdir -p "$W" && cp -r "$REPO/web" "$W/game" && cp "$REPO"/trailer/werkzeug/* "$W/"
```

## 2. Ausgangsstände aus den automatischen Durchläufen

Beide Durchläufe spielen das Spiel über die Oberfläche durch und legen nach jedem Schritt den Spielstand ab.

```bash
mkdir -p "$W/d1" "$W/d2"
MALA_HTML="$W/game/index.html" MALA_DUMPALL="$W/d1" node "$REPO/game/tools/walkthrough.js"    # Kapitel 1, 61 Stände
MALA_HTML="$W/game/index.html" MALA_DUMPALL="$W/d2" node "$REPO/game/tools/walkthrough2.js"   # Kapitel 2, 67 Stände
```

Beide Läufe müssen mit „keine JS-Fehler“ enden. Die Nummern der Stände (`d1/19.json` und so weiter) gehören zu diesem Build. Hat sich der Durchlauf geändert, die Zuordnung in `shots.js` (Feld `dump`) prüfen.

## 3. Spielszenen aufnehmen

```bash
cd "$W"
node rec.js riva_hook marko_open mala_deny zdenka palma stanica tram kazan kula_tomaz coop shoebox notebook fikret \
            pansion_mala title menu1 reveal carsija_bench title_still music_title music_case1 music_k2_mala music_ghost
```

- Jede Einstellung ist in `shots.js` beschrieben: Ausgangsstand, Vorbereitung und die Eingaben in der Szene.
- Ergebnis je Einstellung in `takes/<id>/`:
  - jedes Bild als PNG mit dem Zeitstempel der Audio-Uhr (`frames.json`)
  - der Ton als PCM (`audio.f32`, `audio.json`)
  - ein Bildschirmprotokoll (`events.jsonl`): Sprechtext, Auswahl, Menü, Hinweis, Raum, aktive Figur
- Dauer insgesamt etwa 30 Minuten, weil in Echtzeit aufgenommen wird.

## 4. Sichten und Schnittpunkte prüfen

```bash
python3 events.py coop                          # Protokoll mit Zeiten relativ zum ersten Bild
python3 sheet4.py coop 79.4:82:0.3 bogen.png 3   # Kontaktbogen (von:bis:Schritt oder Liste)
python3 rms.py music_title 2                    # Lautstärkeverlauf einer Aufnahme
```

**Wichtig bei Neuaufnahmen:** Die Szenen laufen in Echtzeit. Bei einer neuen Aufnahme können sich Zeiten um Bruchteile einer Sekunde verschieben. Dann die Schnittpunkte in `edl.py` mit `events.py` abgleichen.

`python3 schnittplan.py` listet für jeden Abschnitt die Spieltexte, die im Bild zu sehen sind. Ein Text, der nur ein oder zwei Bilder lang aufblitzt, fällt dort sofort auf.

## 5. Schnittplan, Vorschau, Export

```bash
TABLE=1 python3 compose.py                       # Zeitachse als Tabelle (muss genau 90,000 s ergeben)
PREVIEW=vorschau python3 compose.py              # Prüfbilder je Abschnitt und je Einblendung
python3 schnittplan.py > SCHNITTPLAN_TABELLE.md  # Schnittliste mit Spieltexten
python3 compose.py MALA_Trailer_90s_DE.mp4       # Export, etwa 10 Minuten
```

`compose.py` macht aus Schnittplan und Aufnahmen das fertige Video:

- **Bild:** 30 Bilder/s, Bildwahl nach Zeitstempel. Die Vergrößerung ist ganzzahlig ×5 (Nearest Neighbour), dazu kommen Einblendungen im Streifen unter dem Spielbild.
- **Ton:**
  - Geräusche je Abschnitt angleichen
  - Musikspur verdichten
  - auf 48 kHz bringen
  - EBU-R128-Messung, danach lineare Angleichung auf −15 LUFS und Begrenzer bei −2 dBFS
- **Kodierung:** libx264 High\@4.1, CRF 15, yuv420p, BT.709 (TV-Bereich), SAR 1:1, genau 2700 Bilder. Ton als AAC-LC, 256 kbit/s, 48 kHz, Stereo, `+faststart`.

## 6. Technische Prüfung

```bash
python3 qc.py MALA_Trailer_90s_DE.mp4 qc
```

Geprüft werden:
- Dauer 90,0 s, 2700 Bilder, h264/yuv420p, 1920 × 1080, 30/1 Bilder/s
- AAC, 48 kHz, Stereo
- −16 ≤ I ≤ −14 LUFS und True Peak ≤ −1 dBTP
- schwarze Bilder und Stille

Dazu erzeugt das Skript einen Kontaktbogen alle 3 s sowie das erste und letzte Bild. Das Ergebnis steht in `qc/qc.json`.

## 7. Funktionsprüfungen für die Texte im Trailer

```bash
node verify.js "$W/game" 8765   # offline nach Erstladen, Speichern/Laden über Neuladen, Tippen mit Touch
node verify2.js                  # Datei-Fassung startet ohne Netz
node verify3.js                  # automatisches Speichern beim Ortswechsel (Hafenbüro-Tür)
```

Die Ergebnisse dieser Fassung stehen in `pruefung/`.
