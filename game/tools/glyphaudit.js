// Prüft alle sichtbaren Texte (Quelltext und Übersetzungen) auf Zeichen, die die Spielschrift nicht kennt (würden als „?“ erscheinen).
//   node game/tools/glyphaudit.js       Ausgabe: Datei:Zeile, Zeichen, Text; Rückgabe 1 bei Funden
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', 'src');
const core = fs.readFileSync(path.join(ROOT, '00_core.js'), 'utf8');
const a = core.indexOf('var F={'), b = core.indexOf('\n};', a);
const F = Function('return ' + core.slice(a + 6, b + 2))();
const known = new Set(Object.keys(F).concat([' ', 'äöüÄÖÜčšžČŠŽćĆéáíóúèàòùìâêôđĐ'].join('').split('')));
const files = []; (function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (f.endsWith('.js')) files.push(p); } })(ROOT);
const LIT = /'((?:[^'\\\n]|\\.)*)'/g; let bad = 0;
for (const f of files) {
  if (/[\\/](portraits|art)[\\/]/.test(f)) continue;            // reine Grafik
  const lines = fs.readFileSync(f, 'utf8').split('\n');
  lines.forEach((ln, i) => {
    const code = ln.replace(/^\s*\/\/.*$/, '').replace(/\/\*.*?\*\//g, '');
    let m; LIT.lastIndex = 0;
    while ((m = LIT.exec(code))) { const s = m[1]; if (!/[A-Za-zÄÖÜäöüß]{2}/.test(s)) continue;
      const miss = [...new Set([...s].filter(c => !known.has(c) && !known.has(c.toLowerCase()) && c >= ' ' && c !== '\\'))];
      if (miss.length) { bad++; console.log(path.relative(ROOT, f) + ':' + (i + 1) + '  [' + miss.join('') + ']  ' + s.slice(0, 90)); } }
  });
}
console.log(bad ? bad + ' Texte mit unbekannten Zeichen' : 'Zeichensatz OK'); process.exit(bad ? 1 : 0);
