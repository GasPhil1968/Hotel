#!/usr/bin/env bash
# Prüfpaket Kapitel 3: dasselbe web/index.html wie im Netlify-ZIP, die Testwerkzeuge, Bericht, Musterlösung, Hinweise und die Protokolle
# des Laufs, auf dem die Zahlen im Bericht beruhen. Baut NICHT neu (geprüft wird genau die vorhandene Datei).
#   bash design/tools/package_pruef.sh [protokollordner]     (Standard: qa/protokolle/k3_2026-11-11_auftritt)
set -euo pipefail
cd "$(dirname "$0")/../.."
LOGS="${1:-qa/protokolle/k3_2026-11-11_auftritt}"
OUT=dist/Die_Stillen_Pruefpaket_K3.zip
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
STAMP="$(grep -o 'M.BUILD="[^"]*"' web/index.html | sed 's/M.BUILD="//; s/"$//')"
SHA="$(sha256sum web/index.html | cut -c1-64)"
copy() { for f in "$@"; do mkdir -p "$TMP/$(dirname "$f")"; cp "$f" "$TMP/$f"; done; }
copy web/index.html design/K3_AUSBAU.md LOESUNG3.md HINWEISE.md web/AENDERUNGEN.txt qa/vmdriver.js qa/sim.js
git ls-files qa/lib qa/paths qa/regress qa/hints qa/ui game/tools | while read -r f; do copy "$f"; done
for f in qa/regress/bug_*.js qa/ui/k3_revision.js; do copy "$f"; done   # auch noch nicht eingecheckte Tests
mkdir -p "$TMP/$LOGS"; cp "$LOGS"/* "$TMP/$LOGS/"
cat > "$TMP/PRUEFPAKET_LIESMICH.txt" <<EOF
DIE STILLEN – PRÜFPAKET KAPITEL 3

Geprüfter Build: web/index.html, Stempel „$STAMP“
sha256 $SHA
(dieselbe Datei wie in Die_Stillen_netlify.zip)

INHALT
- web/index.html                 das Spiel
- design/K3_AUSBAU.md            Bericht: Teil S (zweite Prüfung), Teil R (Revision)
- LOESUNG3.md, HINWEISE.md       Musterlösung Kapitel 3, alle Hinweistexte
- $LOGS/   Protokolle des Laufs, auf dem die Zahlen beruhen
- qa/, game/tools/               die Testwerkzeuge

AUSFÜHREN (im entpackten Ordner)
1) Nur Node.js (ab Version 18):
   node qa/regress/run.js                   alle gezielten Tests (Kapitel 1–5)
   node qa/regress/run.js --only BUG-030    ein einzelner Test
   node qa/hints/hintprobe.js --varianten   Hinweisprobe an den abweichenden Ständen
2) Zusätzlich mit Playwright und Chromium
   (npm install playwright, dann npx playwright install chromium):
   node game/tools/walkthrough3.js          Musterlösung Kapitel 3, neues Spiel bis zum Abspann
   node qa/ui/k3_revision.js                Bedienung mit echter Maus und echtem Finger
   MALA_DUMPALL=dumps node game/tools/walkthrough3.js
   node qa/hints/hintprobe.js --dumps dumps Hinweisprobe an allen Ständen der Musterlösung
Eine andere Fassung prüft man mit --html <pfad> (run.js, hintprobe.js) oder MALA_HTML=<pfad>.

Was die Werkzeuge prüfen und was nicht: design/K3_AUSBAU.md, Teil S.2 und R.8.
Nicht geprüft: Erstspieler, echte iOS-Geräte, Ton, Spielzeit.
EOF
mkdir -p dist; rm -f "$OUT"
(cd "$TMP" && zip -q -X -9 -r "$OLDPWD/$OUT" .)
sha256sum web/index.html "$OUT" > dist/SHA256SUMS_pruefpaket.txt
cat dist/SHA256SUMS_pruefpaket.txt; unzip -l "$OUT" | tail -1
