// Fasst alle Browser-Ergebnisse (Szenarien je Engine, UI-Volldurchläufe) zu browser_results.json zusammen (für qa/report.js).
'use strict';
const fs = require('fs'), path = require('path');
const DIR = path.join(__dirname, '..', 'results', 'browser');
const read = (f) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return null; } };
const scen = [];
for (const e of ['chromium', 'firefox', 'webkit']) { const r = read(path.join(DIR, 'scen_' + e, 'results.json')); if (r) r.forEach(x => scen.push(x)); }
const ui = [];
for (const d of fs.readdirSync(DIR).filter(d => /^ui_/.test(d))) { const r = read(path.join(DIR, d, 'result.json')); if (r) ui.push(Object.assign({ dir: d }, r)); }
const versions = {}; scen.concat(ui).forEach(x => { if (x.browserVersion) versions[x.engine] = x.browserVersion; });
const lines = [];
lines.push('Engines: ' + Object.entries(versions).map(([k, v]) => k + ' ' + v).join(', ') + '. Geräte sind Playwright-Emulationen (iPhone 13 quer/hochkant, iPad gen 7 quer), keine echten Geräte.', '');
lines.push('### Vollständige UI-Durchläufe (nur sichtbare Bedienelemente, Kapitel 1 → K4-Abspann)', '', '| Engine | Gerät | Ergebnis | Aktionen | Dauer | Kapitelenden (s) | Seitenfehler | Konsolenfehler | fehlgeschl. Anfragen | Bedienhinweise |', '|---|---|---|---|---|---|---|---|---|---|');
ui.forEach(r => { const k = {}; (r.uiNotes || []).forEach(n => { k[n.kind] = (k[n.kind] || 0) + 1; });
  lines.push(`| ${r.engine} ${r.browserVersion || ''} | ${r.device} ${r.viewport ? r.viewport.width + '×' + r.viewport.height : ''}${r.touch ? ' Touch' : ' Maus'} | ${r.ok ? '**bestanden**' : 'nicht bestanden' + (r.failure ? ': ' + String(r.failure.msg).slice(0, 80) : '')} | ${r.actionsDone} | ${Math.round(r.wallS)} s | ${(r.chapterEnds || []).map(c => 'K' + c.ch + ' ' + Math.round(c.at)).join(', ')} | ${(r.errors || []).length} | ${(r.consoleErr || []).length} | ${(r.failedReq || []).length} | ${Object.entries(k).map(([a, b]) => a + ' ×' + b).join('; ') || '–'} |`); });
lines.push('', '### Einzelszenarien', '', '| ID | Engine | Gerät | Szenario | Ergebnis | Prüfungen | Screenshots |', '|---|---|---|---|---|---|---|');
scen.forEach(r => lines.push(`| ${r.id} | ${r.engine} | ${r.device} | ${r.title} | ${r.reproduces ? (r.ok ? 'Fehler ' + r.reproduces + ' reproduziert (erwartet)' : 'Reproduktion fehlgeschlagen') : (r.ok ? 'bestanden' : '**nicht bestanden**')} | ${r.checks.filter(c => c.ok).length}/${r.checks.length}${r.ok ? '' : ': ' + r.checks.filter(c => !c.ok).map(c => c.what).join('; ').slice(0, 160)} | ${(r.shots || []).length} |`));
const summary = { scenarios: scen.length, scenariosOk: scen.filter(x => x.ok).length, byEngine: ['chromium', 'firefox', 'webkit'].reduce((o, e) => { const l = scen.filter(x => x.engine === e); o[e] = { total: l.length, ok: l.filter(x => x.ok).length }; return o; }, {}), uiRuns: ui.map(r => ({ engine: r.engine, device: r.device, ok: r.ok, actions: r.actionsDone, wallS: r.wallS })), versions };
lines.push('', `Summe: ${summary.scenarios} Einzelszenarien (${summary.scenariosOk} wie erwartet) und ${ui.length} UI-Volldurchläufe (${ui.filter(r => r.ok).length} bestanden).`);
fs.writeFileSync(path.join(DIR, 'browser_results.json'), JSON.stringify({ summary, summaryLines: lines, scenarios: scen, uiRuns: ui.map(r => Object.assign({}, r, { log: undefined })) }, null, 1));
console.log(lines.join('\n'));
