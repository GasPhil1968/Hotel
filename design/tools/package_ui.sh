#!/usr/bin/env bash
# Paketiert die Fassung mit der überarbeiteten Oberfläche (gleiche Struktur wie das Netlify-ZIP: Dateien direkt im Wurzelordner).
# Das ZIP der QA-Fassung (dist/MALA_netlify_korrigiert.zip, qa/package.sh) bleibt unverändert.   bash design/tools/package_ui.sh
set -euo pipefail
cd "$(dirname "$0")/../.."
node game/build.js
mkdir -p dist
rm -f dist/MALA_netlify_oberflaeche.zip
(cd web && zip -q -X -9 ../dist/MALA_netlify_oberflaeche.zip index.html sw.js manifest.webmanifest icon-180.png icon-192.png icon-512.png LIESMICH.txt AENDERUNGEN.txt)
sha256sum web/index.html dist/MALA_netlify_oberflaeche.zip > dist/SHA256SUMS_oberflaeche.txt
cat dist/SHA256SUMS_oberflaeche.txt
