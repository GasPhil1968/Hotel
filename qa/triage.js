// Ordnet Fehl- und unentschiedene Läufe eines Ergebnisordners anhand ihrer Signatur einer Ursache zu (Regeln unten, aus der Einzelprüfung abgeleitet)
// und schreibt TRIAGE.md in den Ordner.   node qa/triage.js qa/results/<ordner> [--title "…"]
'use strict';
const fs = require('fs'), path = require('path');
const dir = path.resolve(process.argv[2]); const a = process.argv.slice(3), arg = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
const runs = fs.readFileSync(path.join(dir, 'runs.jsonl'), 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
const RULES = [
  [/split\.intro\.legacy/, 'BUG-001 (Spielfehler, behoben)'],
  [/Aktion hängt/, 'BUG-002 (Spielfehler, behoben) bzw. Harness-Belastung über doppelte Test-API-Aufrufe (korrigiert)'],
  [/nicht über der Flamme/, 'BUG-004 (Spielfehler, behoben)'],
  [/doVerb0/, 'BUG-008 (Spielfehler, behoben)'],
  [/at rollcall/, 'Harness: verfrühtes Hinüberbringen ohne crossIf (korrigiert) – kein Spielfehler'],
  [/strassenbr\.crossing|Zeitüberschreitung: drüben/, 'beabsichtigte Rücksetzung beim Laden (Straßenbrücke); Harness setzt jetzt wie ein Spieler fort', 'D'],
  [/^Save\/Load-Abweichung[^|]*: (GS\.rooms\.partizan\.(bellBack|nextBell): \d+ ≠ \d+( \| )?)+\s*$/, 'Harness-Vergleich: Spielzeit-Stempel der Glocken-Szene, beim Laden von partizan.resume neu gesetzt (beabsichtigt); Lauf danach bis zum Endpunkt', 'D'],
  [/k3\.bellsOut|partizan\.bellBack/, 'beabsichtigt: Glocken-Szene läuft nach dem Laden weiter (Mala kehrt zurück)', 'D'],
  [/rooms\.\w+\.(steam|nudge|ferryAt|ferryGo|radioT)/, 'Harness-Vergleich: Sitzungsstempel (absichtlich nicht gespeichert)'],
  [/GS\.flags\.[\w.]+: (false|undefined|null|0) ≠ (false|undefined|null|0)/, 'Harness-Vergleich: Flag false/undefined gleichbedeutend'],
  [/^Harness: Figurenwechsel/, 'Harness: unerlaubter Figurenwechsel (Infrastruktur)'],
  [/Fortsetzung nach Störung gescheitert/, 'Skriptgrenze: der Lösungsweg passt nach der Störung nicht mehr (Zustand weicht ab); Softlock-Einordnung durch die Sonde'],
  [/^LIMIT/, 'Schritt-/Zeitlimit erreicht'],
];
const classify = (r) => { const s = String(r.reason || '') + ' ' + (r.errors || []).join(' '); for (const [re, c, cats] of RULES) if ((!cats || cats.indexOf(r.cat) >= 0) && re.test(s)) return c; return 'NICHT ZUGEORDNET'; };
const rows = {}; runs.filter(r => r.result !== 'pass').forEach(r => { const c = r.result + ' | ' + classify(r); (rows[c] = rows[c] || []).push(r); });
const L = ['# ' + arg('--title', 'Triage der nicht bestandenen Läufe'), '', '_Erzeugt von `qa/triage.js` aus `' + path.relative(path.join(__dirname, '..'), dir) + '/runs.jsonl`._', '', '| Ergebnis | Zuordnung | Läufe | Beispiele | Sonde |', '|---|---|---|---|---|'];
Object.entries(rows).sort((x, y) => y[1].length - x[1].length).forEach(([k, v]) => { const [res, c] = k.split(' | '); const sl = {}; v.forEach(r => { if (r.softlock) { const kk = String(r.softlock.cls).replace(/\d+ Aktionen/, 'N'); sl[kk] = (sl[kk] || 0) + 1; } });
  L.push(`| ${res} | ${c} | ${v.length} | ${v.slice(0, 5).map(r => r.runId).join(', ')} | ${Object.entries(sl).map(([a, b]) => a + ': ' + b).join('; ') || '–'} |`); });
const un = runs.filter(r => r.result !== 'pass' && classify(r) === 'NICHT ZUGEORDNET');
if (un.length) { L.push('', '## Nicht zugeordnet', ''); un.slice(0, 40).forEach(r => L.push(`- ${r.runId} (${r.result}): ${String(r.reason || '').split('\n')[0].slice(0, 200)}`)); }
const extra = arg('--notes'); if (extra && fs.existsSync(extra)) L.push('', fs.readFileSync(extra, 'utf8'));
fs.writeFileSync(path.join(dir, 'TRIAGE.md'), L.join('\n') + '\n'); console.log(L.slice(4).join('\n'));
