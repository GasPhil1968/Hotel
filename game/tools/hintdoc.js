// Erzeugt die Entwicklerübersicht aller Hinweistexte (Markdown) aus game/src/15_hints_k1.js bis 15_hints_k5.js.
//   node game/tools/hintdoc.js > HINWEISE.md
// Stufentexte, die vom Spielstand abhängen (Funktionen), werden mit allen ihren möglichen Sätzen aufgeführt.
const fs = require('fs'), path = require('path'), vm = require('vm');
const SRC = path.join(__dirname, '..', 'src');
const M = { chapterOf: () => 1 }; const ctx = { M }; vm.createContext(ctx);
['15_hints_k1.js', '15_hints_k2.js', '15_hints_k3.js', '15_hints_k4.js', '15_hints_k5.js'].forEach(f => vm.runInContext(fs.readFileSync(path.join(SRC, f), 'utf8'), ctx, { filename: f }));
const STUFE = ['Problem einordnen', 'Denkrichtung', 'Konkreter Ansatz', 'Nächster Schritt'];
function strs(fn) { const out = []; const re = /'((?:[^'\\]|\\.)*)'/g; let m; const src = fn.toString(); while ((m = re.exec(src))) { const t = m[1]; if (t.length > 12 && /[ .:?!]/.test(t) && !/^[a-z0-9_.]+$/.test(t)) out.push(t.replace(/\\'/g, "'")); } return out; }
function cell(v) { if (typeof v === 'string') return v; if (typeof v === 'function') return '*je nach Stand:* ' + strs(v).map(s => '„' + s + '“').join(' / '); if (v && typeof v === 'object') return v.m + (v.g && v.g !== v.m ? ' *(Mala: ' + v.g + ')*' : ''); return '?'; }
function cond(h) { const s = h.open.toString().replace(/^function\s*\(G\)\s*\{\s*return\s*/, '').replace(/;\s*\}$/, ''); return s.replace(/\|/g, '\\|'); }
let out = '# Die Stillen – Hinweistexte (Entwicklerübersicht)\n\nErzeugt mit `node game/tools/hintdoc.js` aus `game/src/15_hints_k1.js` bis `game/src/15_hints_k5.js`. Enthält Lösungen.\n\n' +
  'Jedes Thema ist ein Rätselabschnitt. „Offen, wenn“ ist die Bedingung im Quelltext (F = Schalter, N = Notiz, I = Inventar). Die Stufen: ' + STUFE.map((s, i) => (i + 1) + ' ' + s).join(' · ') + '. Stufe 4 kommt nur nach der Rückfrage.\n';
[['Kapitel 1: Split', ctx.M.HINTS_K1], ['Kapitel 2: Sarajevo', ctx.M.HINTS_K2], ['Kapitel 3: Mostar', ctx.M.HINTS_K3], ['Kapitel 4: München', ctx.M.HINTS_K4], ['Kapitel 5: Sarajevo', ctx.M.HINTS_K5]].forEach(([title, list]) => {
  out += `\n## ${title} (${list.length} Themen)\n`;
  list.forEach(h => { out += `\n### ${h.t} \`${h.id}\`\n\nOffen, wenn: \`${cond(h)}\`\n\n`; h.s.forEach((v, i) => { out += `${i + 1}. **${STUFE[i]}:** ${cell(v)}\n`; }); });
});
process.stdout.write(out);
