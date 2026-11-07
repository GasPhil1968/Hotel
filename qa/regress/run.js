// Gezielte Regressionstests für die behobenen Fehler. Jeder Test spielt über reguläre Eingaben (Titelmenü, Menü, Spielerhandlungen).
//   node qa/regress/run.js [--html pfad/zu/index.html] [--only BUG-001]
// Ausgabe: je Test OK/FEHL; Exitcode 1, wenn ein Test fehlschlägt. Gegen die Originalfassung ausgeführt, schlagen die Tests der behobenen Fehler fehl.
'use strict';
const path = require('path'), fs = require('fs');
const a = process.argv.slice(2), arg = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
const html = arg('--html', path.join(__dirname, '..', '..', 'web', 'index.html'));
const only = arg('--only', null);
const tests = fs.readdirSync(__dirname).filter(f => /^bug_.*\.js$/.test(f)).sort().map(f => require(path.join(__dirname, f)));
(async () => {
  const { loadScript } = require('../vmdriver'); const S = loadScript(html); let fails = 0; const out = [];
  console.log('Fassung', path.relative(process.cwd(), S.htmlPath), 'sha256', S.sha12);
  for (const t of tests) { if (only && t.id !== only) continue; let r;
    try { r = await t.run(html); } catch (e) { r = { ok: false, detail: 'Ausnahme: ' + (e.stack || e).toString().split('\n').slice(0, 3).join(' | ') }; }
    if (!r.ok) fails++; out.push({ id: t.id, title: t.title, ok: r.ok, detail: r.detail }); console.log((r.ok ? 'OK   ' : 'FEHL ') + t.id + ' ' + t.title + (r.detail ? '\n       ' + r.detail : '')); }
  if (arg('--json')) fs.writeFileSync(arg('--json'), JSON.stringify({ html: S.htmlPath, sha256: S.sha, results: out }, null, 1));
  process.exitCode = fails ? 1 : 0;
})();
