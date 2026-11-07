#!/usr/bin/env bash
# Paketiert die korrigierte Spielversion (gleiche Struktur wie das gelieferte Netlify-ZIP: Dateien direkt im Wurzelordner)
# und komprimiert die Laufprotokolle.   bash qa/package.sh
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p dist
rm -f dist/MALA_netlify_korrigiert.zip
(cd web && zip -q -X -9 ../dist/MALA_netlify_korrigiert.zip index.html sw.js manifest.webmanifest icon-180.png icon-192.png icon-512.png LIESMICH.txt)
sha256sum web/index.html dist/MALA_netlify_korrigiert.zip > dist/SHA256SUMS.txt
for d in qa/results/erstlauf_original qa/results/final; do
  if [ -f "$d/runs.jsonl" ]; then gzip -kf -9 "$d/runs.jsonl"; fi
done
ls -la dist
