// Doppelte Schlüssel in mehreren Sprachdateien mit unterschiedlichen Übersetzungen (die zuletzt geladene gewinnt).
// node game/tools/i18n_dupes.js [game/src/lang]
const fs = require('fs'), path = require('path');
const dir = process.argv[2] || path.join(__dirname, '..', 'src', 'lang');
const files = fs.readdirSync(dir).filter(f => /^bhs_.*\.js$/.test(f)).sort();
const seen = {};   // key -> [{f, v}]
for (const f of files) {
  const T = {}; const stub = { trAdd: (l, t) => Object.assign(T, t), trIgnore: () => {}, trPattern: () => {} };
  new Function('M', fs.readFileSync(path.join(dir, f), 'utf8'))(stub);
  for (const k of Object.keys(T)) (seen[k] = seen[k] || []).push({ f, v: JSON.stringify(T[k]) });
}
let n = 0;
for (const k of Object.keys(seen)) { const L = seen[k]; if (L.length < 2) continue; const vals = new Set(L.map(x => x.v)); if (vals.size < 2) continue;
  n++; console.log(JSON.stringify(k)); L.forEach(x => console.log('   ' + x.f.padEnd(14) + ' ' + x.v)); }
console.log(`\n${files.length} Dateien, ${Object.keys(seen).length} Schlüssel, ${n} widersprüchliche Doppelte (Ladereihenfolge: ${files.join(', ')})`);
