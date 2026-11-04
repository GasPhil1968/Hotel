// Prüft Übersetzungen gegen den Quelltext (Sprachfassung BHS).
//   node game/tools/i18n_check.js --list <quelle.js> [...]                 sichtbare Texte mit Zeile und Sprecher-Hinweis
//   node game/tools/i18n_check.js <lang.js|lang-ordner> <quelle.js> [...]  prüfen: Tippfehler in Schlüsseln, fehlende Texte,
//                                                                         fremde Zeichen, vermutlich unübersetzte Texte
const fs = require('fs'), path = require('path');
const args = process.argv.slice(2);
const LIST = args[0] === '--list';
const langArg = LIST ? null : args[0];
const srcs = args.slice(1);
if (!srcs.length) { console.log('Aufruf: i18n_check.js (--list | <lang.js|ordner>) <quelle.js> …'); process.exit(2); }

function unesc(raw) { try { return Function("'use strict'; return '" + raw + "';")(); } catch (e) { return raw; } }
const LIT = /'((?:[^'\\\n]|\\.)*)'/g;
function visible(s) {
  if (!/[A-Za-zÄÖÜäöüßČĆŠŽĐčćšžđ]{2}/.test(s)) return false;
  if (/^[a-z0-9_.:\-#@\/]+$/.test(s)) return false;          // IDs, Flags, Schlüssel
  if (/^[a-z]+([A-Z][a-z0-9]*)+$/.test(s)) return false;      // camelCase (Animationen, Klänge)
  if (/^[A-Za-z0-9]+_[A-Za-z0-9_]+$/.test(s)) return false;   // snake_case
  if (/^[A-Za-z0-9_]+([.:][A-Za-z0-9_]+)+$/.test(s)) return false;   // Flags wie c1.letterOpen, first:abc
  if (s === 'use strict') return false;
  if (/[{};]/.test(s) && /:/.test(s) && !/[.!?…“]$/.test(s)) return false;   // CSS und Code
  return true;
}
function hint(line, idx) {
  const pre = line.slice(Math.max(0, idx - 60), idx);
  let m;
  if (/A\.m\($/.test(pre)) return 'Marko';
  if (/A\.g\($/.test(pre)) return 'Mala';
  if (/A\.narrate\($/.test(pre)) return 'Erzähler';
  if ((m = /A\.phoneVoice\($/.exec(pre))) return 'Telefon';
  if ((m = /(\w+)\.say\($/.exec(pre))) return 'Figur ' + m[1];
  if (/g:\{[^}]*$/.test(pre) && /(look|sense|listen|talk):$/.test(pre)) return 'Mala (g)';
  if (/look:$/.test(pre)) return 'Ansehen (Marko)';
  if (/mala:$/.test(pre)) return 'Mala über Gegenstand';
  if (/name:$/.test(pre)) return 'Name';
  if (/\{t:$/.test(pre)) return 'Option';
  if (/title:$/.test(pre)) return 'Titel';
  if (/lines:\[[^\]]*$/.test(pre)) return 'Dokument/Erinnerung';
  if (/A\.cycle\([^)]*$/.test(pre)) return 'Wechselsatz';
  return '';
}
// Quelltexte einsammeln
const all = new Set(), cand = new Map();
for (const f of srcs) {
  const lines = fs.readFileSync(f, 'utf8').split('\n');
  lines.forEach((ln, i) => { LIT.lastIndex = 0; let m;
    while ((m = LIT.exec(ln))) { const s = unesc(m[1]); all.add(s); if (visible(s) && !cand.has(s)) cand.set(s, { f: path.relative(process.cwd(), f), line: i + 1, hint: hint(ln, m.index) }); } });
}
if (LIST) {
  for (const [s, c] of cand) console.log(`${c.f}:${c.line}\t[${c.hint}]\t${s}`);
  console.log(`\n${cand.size} sichtbare Texte`); process.exit(0);
}
// Übersetzungen laden
const T = {}, IGN = new Set(), PAT = [];
const stub = { trAdd: (l, t) => Object.assign(T, t), trIgnore: (a) => a.forEach(x => IGN.add(x)), trPattern: (l, re, fn) => PAT.push(re) };
const langFiles = fs.statSync(langArg).isDirectory() ? fs.readdirSync(langArg).filter(f => /^bhs_.*\.js$/.test(f)).map(f => path.join(langArg, f)) : langArg.split(',');
for (const lf of langFiles) { try { new Function('M', fs.readFileSync(lf, 'utf8'))(stub); } catch (e) { console.log('FEHLER beim Laden ' + lf + ': ' + e.message); process.exit(1); } }
const OK = /^[\x20-\x7E\n…„“”‚‘’–—·•✓▸☎°ČĆĐŠŽčćđšžäöüÄÖÜßéèáàíìóòúùâêô]*$/;
const GERMAN = /\b(der|die|das|und|ist|nicht|ich|ein|eine|mit|auf|sie|wir|aber|noch|schon)\b/i;
let bad = 0; const out = [];
for (const k of Object.keys(T)) {
  const base = k.replace(/^@[a-z0-9_]+:/, '');
  if (!all.has(base)) { out.push('Schlüssel nicht im Quelltext: ' + JSON.stringify(k)); bad++; }
  const v = T[k], vals = typeof v === 'string' ? [v] : (v && typeof v === 'object' ? [v.hr, v.bs].filter(x => x != null) : []);
  if (!vals.length) { out.push('Leere Übersetzung: ' + JSON.stringify(k)); bad++; }
  vals.forEach(x => { if (typeof x !== 'string') { out.push('Kein Text: ' + JSON.stringify(k)); bad++; return; }
    if (!OK.test(x)) { const odd = [...x].filter(ch => !OK.test(ch)); out.push('Fremde Zeichen ' + JSON.stringify([...new Set(odd)].join('')) + ' in ' + JSON.stringify(k)); bad++; }
    if (x === base && base.length > 25 && GERMAN.test(base)) { out.push('Vermutlich unübersetzt: ' + JSON.stringify(k)); bad++; } });
}
const missing = [];
const onlySpk = [];
for (const [s, c] of cand) { if (IGN.has(s) || T[s] !== undefined) continue; if (Object.keys(T).some(k => k.endsWith(':' + s) && k[0] === '@')) { onlySpk.push(`${c.f}:${c.line} [${c.hint}] ${s}`); continue; } missing.push(`${c.f}:${c.line} [${c.hint}] ${s}`); }
if (process.env.STRICT) { onlySpk.forEach(m => out.push('Nur Sondereinträge, keine Standardfassung: ' + m)); bad += onlySpk.length; }
missing.forEach(m => out.push('Fehlt: ' + m)); bad += missing.length;
console.log(out.join('\n'));
console.log(`\n${Object.keys(T).length} Einträge, ${cand.size} sichtbare Texte im Quelltext, ${missing.length} fehlen, ${bad} Meldungen`);
process.exit(bad ? 1 : 0);
