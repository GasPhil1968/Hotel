// Erzeugt den QA-Bericht automatisch aus den Laufprotokollen.
//   node qa/report.js qa/results/<tag> [--browser qa/results/browser] [--bugs qa/BUGS.json] [--title "..."]
// Schreibt <tag>/REPORT.md und <tag>/summary.json.
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const dir = path.resolve(process.argv[2]);
const a = process.argv.slice(3), arg = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
const meta = JSON.parse(fs.readFileSync(path.join(dir, 'meta.json'), 'utf8'));
const runs = fs.readFileSync(path.join(dir, 'runs.jsonl'), 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
const bugs = (() => { try { return JSON.parse(fs.readFileSync(arg('--bugs', path.join(__dirname, 'BUGS.json')), 'utf8')); } catch (e) { return []; } })();
const browserDir = arg('--browser', path.join(__dirname, 'results', 'browser'));
const browser = (() => { try { return JSON.parse(fs.readFileSync(path.join(browserDir, 'browser_results.json'), 'utf8')); } catch (e) { return null; } })();

// Universum aus der Produktionsdatei
async function universe() {
  const { open } = require('./vmdriver'); const D = await open({ seed: 1, html: meta.html ? path.join(__dirname, '..', meta.html) : undefined });
  const u = await D.ev(() => { const chOf = (id) => { const r = M.ROOMS[id]; return r ? r : null; }; void chOf;
    const rooms = Object.keys(M.ROOMS).filter(k => !/^__/.test(k));
    const hs = []; rooms.forEach(r => (M.ROOMS[r].hotspots || []).forEach(h => hs.push(r + '.' + h.id)));
    return { rooms, phases: Object.keys(M.PHASES), deduce: Object.keys(M.DEDUCE), hs, items: Object.keys(M.ITEMS), notes: Object.keys(M.NOTES) }; });
  await D.close2(); return u;
}
const chOfPhase = (ph) => (/^k4/.test(ph) ? 4 : /^k3/.test(ph) ? 3 : /^k2/.test(ph) ? 2 : 1);

(async () => {
  const U = await universe();
  const cats = ['A', 'B', 'C', 'D', 'E'];
  const by = (f) => { const o = {}; runs.forEach(r => { const k = f(r); (o[k] = o[k] || []).push(r); }); return o; };
  const cnt = (list) => { const o = { total: list.length, pass: 0, fail: 0, undecided: 0, aborted: 0, infra: 0 }; list.forEach(r => { o[r.result] = (o[r.result] || 0) + 1; }); return o; };
  const S = { meta, totals: cnt(runs), planned: meta.planned, started: meta.started_runs || runs.length, completed: runs.length };
  S.byCat = {}; cats.forEach(c => { S.byCat[c] = cnt(runs.filter(r => r.cat === c)); S.byCat[c].planned = (meta.plan || {})[c] || 0; });
  S.byStartCh = {}; Object.entries(by(r => r.startCh)).forEach(([k, v]) => { S.byStartCh[k] = cnt(v); });
  // Kapitelergebnisse (ein Lauf deckt mehrere Kapitel ab)
  S.byChapter = {}; [1, 2, 3, 4].forEach(ch => { const L = []; runs.forEach(r => (r.chapters || []).forEach(c => { if (c.ch === ch) L.push(c); })); S.byChapter[ch] = { played: L.length, ended: L.filter(c => c.ok).length, failed: L.filter(c => !c.ok).length, perturbed: L.filter(c => c.perturbed).length }; });
  S.byVersion = {}; Object.entries(by(r => r.shaFile || r.sha || '?')).forEach(([k, v]) => { S.byVersion[k] = cnt(v); });
  // vollständige Durchläufe bis zum Endpunkt
  const full = runs.filter(r => r.startCh === 1 && r.result === 'pass');
  S.fullFromStart = { runs: runs.filter(r => r.startCh === 1).length, reachedEndpoint: full.length, endpoint: meta.endpoint, avgActions: full.length ? Math.round(full.reduce((s, r) => s + r.steps, 0) / full.length) : null, avgScriptSteps: full.length ? Math.round(full.reduce((s, r) => s + r.scriptSteps, 0) / full.length) : null, avgGameMinutes: full.length ? +(full.reduce((s, r) => s + (r.vtimeMs || 0) * 25 / 60000, 0) / full.length).toFixed(1) : null, avgWallS: full.length ? +(full.reduce((s, r) => s + r.wallMs, 0) / full.length / 1000).toFixed(1) : null };
  S.reachedEndpointAll = runs.filter(r => r.endpointReached).length;
  // Vielfalt
  const actHash = (r) => crypto.createHash('sha1').update(JSON.stringify((r.trace || []).map(t => t.slice(1)))).digest('hex');
  const stHash = (r) => crypto.createHash('sha1').update(JSON.stringify([r.phaseSeq, (r.coverage || {}).edges])).digest('hex');
  S.diversity = { distinctActionPaths: new Set(runs.map(actHash)).size, distinctPhaseRoomPaths: new Set(runs.map(stHash)).size, distinctVariants: new Set(runs.map(r => JSON.stringify([r.cat, r.startCh, r.variant]))).size, distinctSeeds: new Set(runs.map(r => r.seed)).size };
  // Abdeckung
  const uni = (k) => { const s = new Set(); runs.forEach(r => ((r.coverage || {})[k] || []).forEach(x => s.add(x))); return s; };
  const rooms = uni('rooms'), edges = uni('edges'), phases = uni('phases'), phaseEdges = uni('phaseEdges'), deduce = uni('deduce'), hs = uni('hs'), opts = uni('opts');
  const hsBase = new Set(Array.from(hs).map(x => x.split('.').slice(0, 2).join('.')));
  const realize = {}, cross = {}; runs.forEach(r => { Object.keys((r.coverage || {}).realize || {}).forEach(k => { realize[k] = (realize[k] || 0) + 1; }); Object.keys((r.coverage || {}).cross || {}).forEach(k => { cross[k] = (cross[k] || 0) + 1; }); });
  const testRooms = U.rooms.filter(r => !/^(test|art_|_)/.test(r));
  const dedNorm = (k) => k.split('+').sort().join('+'); const dedSeen = new Set(Array.from(deduce).map(dedNorm));
  S.coverage = {
    rooms: { covered: testRooms.filter(r => rooms.has(r)).length, total: testRooms.length, missing: testRooms.filter(r => !rooms.has(r)) },
    roomTransitions: edges.size,
    phases: { covered: U.phases.filter(p => phases.has(p)).length, total: U.phases.length, missing: U.phases.filter(p => !phases.has(p)) },
    phaseTransitions: phaseEdges.size,
    deductions: { covered: U.deduce.filter(d => dedSeen.has(dedNorm(d))).length, total: U.deduce.length, missing: U.deduce.filter(d => !dedSeen.has(dedNorm(d))) },
    hotspots: { covered: U.hs.filter(h => hsBase.has(h)).length, total: U.hs.length },
    hotspotVerbs: hs.size, dialogOptions: opts.size,
    ghostRealizations: realize, crossings: cross
  };
  // Fehlerbilder
  const sig = (r) => (r.reason || '').replace(/\{.*$/, '').replace(/\d+(\.\d+)?/g, '#').slice(0, 160);
  const group = (list) => { const g = {}; list.forEach(r => { const k = sig(r); (g[k] = g[k] || []).push(r.runId); }); return Object.entries(g).sort((x, y) => y[1].length - x[1].length).map(([k, v]) => ({ signature: k, count: v.length, examples: v.slice(0, 6) })); };
  S.failures = group(runs.filter(r => r.result === 'fail'));
  S.undecided = group(runs.filter(r => r.result === 'undecided'));
  S.infra = group(runs.filter(r => r.result === 'infra' || r.result === 'aborted'));
  S.exceptions = runs.filter(r => (r.errors || []).length).map(r => ({ run: r.runId, err: r.errors[0].split('\n')[0] })).slice(0, 50);
  S.invariants = runs.filter(r => (r.invariants || []).length).map(r => ({ run: r.runId, inv: r.invariants })).slice(0, 50);
  const sl = []; runs.forEach(r => (r.saveload || []).forEach(p => sl.push(Object.assign({ run: r.runId }, p))));
  S.saveLoad = { points: sl.length, saved: sl.filter(p => /Gespeichert/.test(p.save || '')).length, refused: sl.filter(p => p.note).length, compared: sl.filter(p => p.equal !== undefined).length, equal: sl.filter(p => p.equal).length, mismatches: sl.filter(p => p.equal === false).slice(0, 20).map(p => ({ run: p.run, mode: p.mode, ch: p.ch, step: p.step, diff: p.diff })), byMode: sl.reduce((o, p) => { o[p.mode] = (o[p.mode] || 0) + 1; return o; }, {}) };
  const pert = []; runs.forEach(r => (r.perturb || []).forEach(p => pert.push(p)));
  S.perturbations = { total: pert.length, skippedNotCalm: pert.filter(p => p.skipped).length, returnedToAnchor: pert.filter(p => p.returned).length, notReturned: pert.filter(p => p.returned === false).length, actions: pert.reduce((s, p) => s + (p.actions || 0), 0) };
  // Gegenstände, die verschwanden (Verbrauch), nach Gegenstand und Phase – zur Prüfung gegen das Design
  const lost = {}; runs.forEach(r => (r.lostItems || []).forEach(c => c[3].forEach(it => { const k = it + ' @' + c[0]; lost[k] = (lost[k] || 0) + 1; })));
  S.itemRemovals = Object.entries(lost).sort((x, y) => y[1] - x[1]).slice(0, 80);
  // Sackgassen-Sonde und Softlock-Einordnung
  const probed = runs.filter(r => r.softlock); const slc = {}; probed.forEach(r => { const k = String(r.softlock.cls).replace(/\d+ Aktionen/, 'N Aktionen'); slc[k] = (slc[k] || 0) + 1; });
  S.softlock = { probed: probed.length, classes: slc, suspicions: probed.filter(r => /^Verdacht|gescheitert/.test(r.softlock.cls)).map(r => ({ run: r.runId, cls: r.softlock.cls, start: r.softlock.start, reason: (r.reason || '').split('\n')[0].slice(0, 160) })) };
  // verfrühte Versuche (C), beabsichtigte Szenen-Rücksetzungen (D), Harness-Eingriffe
  let pre = 0, preNone = 0, preEff = 0; runs.forEach(r => (r.perturb || []).forEach(p => (p.rec || []).forEach(x => { if (x[0] === 'premature') pre++; if (x[0] === 'premature-none') preNone++; if (x[0] === 'premature-effect') { const b = x[1] || {}, c = x[2] || {}; if (b.n !== c.n || b.inv !== c.inv || b.ph !== c.ph || b.f !== c.f) preEff++; } })));
  S.premature = { attempts: pre, noCandidate: preNone, withStateChange: preEff };
  const resets = {}; sl.filter(p => p.expectedReset).forEach(p => p.expectedReset.forEach(w => { resets[w] = (resets[w] || 0) + 1; }));
  S.saveLoad.expectedResets = resets; S.saveLoad.recovered = sl.filter(p => p.recover).length;
  S.illegalSwitch = runs.filter(r => (r.illegalSwitch || []).length).map(r => r.runId);
  S.limits = { stepLimit: [Math.min(...runs.map(r => r.stepLimit || 0)), Math.max(...runs.map(r => r.stepLimit || 0))], wallLimitS: [Math.min(...runs.map(r => (r.wallLimitMs || 0) / 1000)), Math.max(...runs.map(r => (r.wallLimitMs || 0) / 1000))], harness: Array.from(new Set(runs.map(r => r.harness))).filter(Boolean) };
  const regress = (() => { try { return JSON.parse(fs.readFileSync(arg('--regress', path.join(__dirname, 'results', 'regress_final.json')), 'utf8')); } catch (e) { return null; } })();
  const regressOrig = (() => { try { return JSON.parse(fs.readFileSync(path.join(__dirname, 'results', 'regress_original.json'), 'utf8')); } catch (e) { return null; } })();
  const harnessFixes = (() => { try { return JSON.parse(fs.readFileSync(path.join(__dirname, 'HARNESS_KORREKTUREN.json'), 'utf8')); } catch (e) { return []; } })();
  S.bugs = bugs; S.browser = browser ? browser.summary || null : null;
  fs.writeFileSync(path.join(dir, 'summary.json'), JSON.stringify(S, null, 1));

  // ------------------------------------------------------------ Markdown
  const L = [];
  const pc = (x, n) => (n ? (100 * x / n).toFixed(1) + ' %' : '–');
  L.push('# ' + arg('--title', 'MALA – automatischer QA-Bericht'));
  L.push('', '_Automatisch erzeugt aus `' + path.relative(path.join(__dirname, '..'), dir) + '/runs.jsonl` (' + runs.length + ' Läufe) von `qa/report.js`._', '');
  L.push('## Version und Rahmen', '');
  L.push('- Geprüfte Datei: `' + meta.html + '`, SHA-256 `' + meta.sha256 + '`');
  L.push('- Start ' + meta.started + ', Ende ' + (meta.finished || '–') + ', ' + meta.workers + ' parallele Prozesse, Node ' + meta.node);
  L.push('- Endpunkt des implementierten Umfangs: **' + meta.endpoint + '**');
  L.push('- Simulationsart: Produktionsskript in Node-VM, virtuelle Uhr, Zufall mit Seed, eigener localStorage je Lauf (siehe `qa/README.md`).');
  L.push(`- Jeder Lauf in \`runs.jsonl\`: Lauf-ID, Kategorie, deterministischer Seed (aus Salz \`${meta.salt}\` und Lauf-ID), Startkapitel, Variante, Ziel, Schrittlimit (${S.limits.stepLimit.join('–')}), Zeitrahmen (${S.limits.wallLimitS.join('–')} s Rechenzeit), Aktionsfolge (trace), Ergebnis mit Grund, geprüfter Endzustand (Kapitelenden, Titelbild), Harness-Prüfsumme (${S.limits.harness.join(', ') || '–'}).`);
  L.push('- Spielerhandlungen laufen über die Test-API des Spiels (dieselben Funktionen wie die Oberfläche) bzw. bei Belastung über Zeigerereignisse; es werden keine Flags gesetzt, keine Gegenstände eingefügt, nicht teleportiert. Zufällige Handlungen nutzen nur Hotspots, die an dieser Stelle antippbar sind, Hinüberbringen nur, wenn das Spiel es anbietet, Figurenwechsel nur, wenn der Wechselknopf es erlaubt (Verstöße würden als Infrastruktur gezählt: ' + S.illegalSwitch.length + ').', '');
  L.push('## Läufe', '');
  L.push('| | geplant | gestartet | abgeschlossen | bestanden | fehlgeschlagen | unentschieden | abgebrochen/Infrastruktur |', '|---|---|---|---|---|---|---|---|');
  L.push(`| **Gesamt** | ${S.planned} | ${S.started} | ${S.completed} | ${S.totals.pass} | ${S.totals.fail} | ${S.totals.undecided} | ${(S.totals.aborted || 0) + (S.totals.infra || 0)} |`);
  cats.forEach(c => { const x = S.byCat[c]; if (!x.total && !x.planned) return; L.push(`| ${c} | ${x.planned} | ${x.total} | ${x.total} | ${x.pass} | ${x.fail} | ${x.undecided} | ${(x.aborted || 0) + (x.infra || 0)} |`); });
  L.push('', 'A = kritischer Pfad ab Spielbeginn · B = Zufallserkundung · C = variierte Reihenfolge/verfrühte Versuche · D = Speichern/Laden · E = Belastung/Fehlbedienung', '');
  L.push('### Nach Startkapitel', '', '| Startkapitel | Läufe | bestanden | fehlgeschlagen | unentschieden |', '|---|---|---|---|---|');
  Object.entries(S.byStartCh).forEach(([k, x]) => L.push(`| ${k} | ${x.total} | ${x.pass} | ${x.fail} | ${x.undecided} |`));
  L.push('', '### Nach Kapitel (ein Lauf spielt alle Kapitel ab seinem Start bis K4)', '', '| Kapitel | gespielt | Ende erreicht | gescheitert | davon gestört |', '|---|---|---|---|---|');
  Object.entries(S.byChapter).forEach(([k, x]) => L.push(`| ${k} | ${x.played} | ${x.ended} | ${x.failed} | ${x.perturbed} |`));
  L.push('', '### Nach Spielversion', ''); Object.entries(S.byVersion).forEach(([k, x]) => L.push(`- \`${k}\`: ${x.total} Läufe, ${x.pass} bestanden, ${x.fail} fehlgeschlagen, ${x.undecided} unentschieden`));
  L.push('', '## Vollständige Durchläufe bis zum Endpunkt', '');
  L.push(`- Läufe ab Spielbeginn (Kapitel 1): ${S.fullFromStart.runs}, davon Endpunkt erreicht: **${S.fullFromStart.reachedEndpoint}**`);
  L.push(`- Alle Läufe mit erreichtem Endpunkt (beliebiger Start): ${S.reachedEndpointAll}`);
  L.push(`- Durchschnitt erfolgreicher Volldurchläufe: ${S.fullFromStart.avgActions} Spieleraktionen (M.TA-Ebene, inkl. Dialogwahlen), ${S.fullFromStart.avgScriptSteps} Skriptschritte, ${S.fullFromStart.avgGameMinutes} min Spielzeit, ${S.fullFromStart.avgWallS} s Rechenzeit`, '');
  L.push('## Vielfalt', '', `- unterschiedliche Aktionsfolgen: **${S.diversity.distinctActionPaths}** · unterschiedliche Phasen-/Raumpfade: ${S.diversity.distinctPhaseRoomPaths} · Varianten-Kombinationen: ${S.diversity.distinctVariants} · Seeds: ${S.diversity.distinctSeeds}`, '');
  L.push('## Abdeckung', '');
  const C = S.coverage;
  L.push(`- Räume: ${C.rooms.covered}/${C.rooms.total} (${pc(C.rooms.covered, C.rooms.total)}); Raumübergänge: ${C.roomTransitions}`);
  L.push(`- Phasen (Story-Abschnitte): ${C.phases.covered}/${C.phases.total}; Phasenübergänge: ${C.phaseTransitions}`);
  L.push(`- Schlüsse (Notizen verbinden): ${C.deductions.covered}/${C.deductions.total} (${pc(C.deductions.covered, C.deductions.total)})`);
  L.push(`- Hotspots: ${C.hotspots.covered}/${C.hotspots.total} (${pc(C.hotspots.covered, C.hotspots.total)}); Hotspot×Verb×Figur: ${C.hotspotVerbs}; Dialogzeilen gewählt: ${C.dialogOptions}`);
  L.push(`- Geister-Erkenntnisse (Kapitel:Geist → Läufe): ${Object.entries(C.ghostRealizations).map(([k, v]) => k + ' ' + v).join(', ') || '–'}`);
  L.push(`- Hinüberbringen (Schwelle geöffnet, Raum → Läufe): ${Object.entries(C.crossings).map(([k, v]) => k + ' ' + v).join(', ') || '–'}`);
  L.push('', '<details><summary>Ungeprüfte Räume, Phasen und Schlüsse</summary>', '');
  L.push('- Räume nie betreten: ' + (C.rooms.missing.join(', ') || '–'));
  L.push('- Phasen nie erreicht: ' + (C.phases.missing.join(', ') || '–'));
  L.push('- Schlüsse nie gezogen: ' + (C.deductions.missing.join(', ') || '–'));
  L.push('', '</details>', '');
  L.push('## Störungen und Speichern/Laden', '');
  L.push(`- Störstellen (B/C/E): ${S.perturbations.total}, davon ${S.perturbations.skippedNotCalm} übersprungen (Spiel nicht ruhig), Rückkehr zum Anker ${S.perturbations.returnedToAnchor}, ohne Rückkehr ${S.perturbations.notReturned}; zufällige/gestörte Aktionen insgesamt ${S.perturbations.actions}`);
  L.push(`- Speicherpunkte (D): ${S.saveLoad.points}; gespeichert ${S.saveLoad.saved}; abgelehnt ${S.saveLoad.refused}; verglichen ${S.saveLoad.compared}; identisch ${S.saveLoad.equal}; Modi ${JSON.stringify(S.saveLoad.byMode)}`);
  if (Object.keys(S.saveLoad.expectedResets).length) { L.push('- Im Spiel vorgesehene Rücksetzungen beim Laden (protokolliert, kein Fehler): ' + Object.entries(S.saveLoad.expectedResets).map(([k, v]) => v + '× ' + k).join('; ') + `; danach wie ein Spieler fortgesetzt: ${S.saveLoad.recovered}×`); }
  L.push(`- Verfrühte Versuche (C): ${S.premature.attempts} Lösungsschritte vor ihrer Zeit ausgeführt, davon ${S.premature.withStateChange} mit Zustandsänderung (Notiz/Inventar/Phase/Flag); ${S.premature.noCandidate} Störstellen ohne passenden verfrühten Schritt`);
  if (S.saveLoad.mismatches.length) { L.push('', 'Abweichungen nach dem Laden:'); S.saveLoad.mismatches.forEach(m => L.push(`- ${m.run} (${m.mode}, K${m.ch} Schritt ${m.step}): ${m.diff.slice(0, 4).join('; ')}`)); }
  L.push('', '## Fehlschläge, Ausnahmen, Invarianten', '');
  if (!S.failures.length) L.push('- keine fehlgeschlagenen Läufe');
  S.failures.forEach(f => L.push(`- **${f.count}×** ${f.signature} (z. B. ${f.examples.join(', ')})`));
  L.push('', '### Unentschieden (Fortsetzung nach Störung nicht gefunden / Limit)', '');
  if (!S.undecided.length) L.push('- keine');
  S.undecided.slice(0, 25).forEach(f => L.push(`- ${f.count}× ${f.signature} (z. B. ${f.examples.join(', ')})`));
  L.push('', '### Infrastruktur/abgebrochen', ''); if (!S.infra.length) L.push('- keine'); S.infra.forEach(f => L.push(`- ${f.count}× ${f.signature} (${f.examples.join(', ')})`));
  L.push('', `- Läufe mit JS-Ausnahmen: ${runs.filter(r => (r.errors || []).length).length}; mit Invariantenverletzung: ${runs.filter(r => (r.invariants || []).length).length}`);
  S.exceptions.slice(0, 10).forEach(e => L.push(`  - ${e.run}: ${e.err}`));
  S.invariants.slice(0, 10).forEach(e => L.push(`  - ${e.run}: ${e.inv.join('; ')}`));
  L.push('', '### Gegenstände, die aus dem Inventar verschwanden (Gegenstand @Phase → Läufe)', '', S.itemRemovals.slice(0, 40).map(([k, v]) => '`' + k + '` ' + v).join(' · ') || '–', '');
  L.push('## Softlocks (Sackgassen)', '');
  L.push(`Jeder unentschiedene Lauf (das Lösungsskript fand nach der Störung nicht weiter) wurde vom erreichten Zustand aus mit einer begrenzten Suche über reguläre Spielerhandlungen weitergespielt (Lösungsschritte des Kapitels in der Nähe der Abbruchstelle, Notizen, Dialogwahlen, Kombinationen, Reisen, Rätsel über die sichtbaren Bedienelemente; höchstens 600 Aktionen). Geprüfte Läufe: ${S.softlock.probed}.`, '');
  L.push('| Einordnung der Sonde | Läufe |', '|---|---|'); Object.entries(S.softlock.classes).sort((x, y) => y[1] - x[1]).forEach(([k, v]) => L.push(`| ${k} | ${v} |`));
  L.push('', '„kein Softlock“ = von dort aus wurde ein Phasen- oder Kapitelwechsel erreicht. „Fortschritt möglich“ = neue Notiz, neuer Gegenstand, neuer Ort oder neues Story-Flag, aber kein Phasenwechsel im Budget (kein Beweis, Stichproben von Hand geprüft). „Verdacht“ = kein Fortschritt; jeder Verdacht wird einzeln von Hand untersucht.', '');
  if (S.softlock.suspicions.length) { L.push('Verdachtsfälle und Läufe ohne Sondenergebnis (einzeln von Hand nachgeprüft, Ergebnis in `TRIAGE.md` dieses Ordners):'); S.softlock.suspicions.slice(0, 40).forEach(x => { const rr = runs.find(r => r.runId === x.run); L.push(`- ${x.run}: ${x.cls}${rr && rr.softlock && rr.softlock.err ? ' (' + rr.softlock.err + ')' : ''}${x.start ? ', ' + JSON.stringify(x.start) : ''} – ${x.reason.replace(/\s*\|\s*\{.*$/, '')}`); }); L.push(''); }
  else L.push('Verdachtsfälle: keine.', '');
  if (fs.existsSync(path.join(dir, 'TRIAGE_NOTIZEN.md'))) L.push('Die von Hand geprüfte Einordnung (Stichproben je Gruppe, Mechanismen, nicht bewiesene Gruppen) steht in `TRIAGE.md` dieses Ordners.', '');
  const conf = bugs.filter(b => /Softlock/i.test(b.title)), det = bugs.filter(b => /Umweg|Ausweg|Alternative|nicht angedeutete|kein endgültiger Softlock/i.test((b.effect || '') + ' ' + (b.title || '')));
  L.push('Einordnung bekannter Stellen:', '');
  conf.forEach(b => L.push(`- **bestätigter Softlock** – ${b.id} (${b.status}): ${b.title}`));
  det.forEach(b => L.push(`- **Umweg** – ${b.id} (${b.status}): ${b.title}`));
  L.push('- **kein Softlock (beabsichtigt)** – Laden während der Überquerung der Straßenbrücke setzt sie zurück; Marko tippt das Westufer erneut an (strassenbr.load).');
  L.push('- **kein Softlock (beabsichtigt)** – Kühlraum (K1) ist nur in Malas Schein zu sehen („Bleib bei mir“); dunkle Hotspots werden erst im Licht antippbar.', '');
  if (regress) { L.push('## Regressionstests (`qa/regress/run.js`)', '', `Fassung \`${path.relative(path.join(__dirname, '..'), regress.html)}\`, SHA-256 \`${regress.sha256}\`` + (regressOrig ? `; zum Vergleich gegen die Originalfassung \`${regressOrig.sha256.slice(0, 12)}…\`` : ''), '', '| Test | korrigierte Fassung | Originalfassung | Ergebnis |', '|---|---|---|---|');
    regress.results.forEach(t => { const o = regressOrig && regressOrig.results.find(x => x.id === t.id); L.push(`| ${t.id} ${t.title} | ${t.ok ? 'bestanden' : '**nicht bestanden**'} | ${o ? (o.ok ? 'bestanden' : 'schlägt fehl (Fehler vorhanden)') : '–'} | ${String(t.detail || '').replace(/\|/g, '/').slice(0, 220)} |`); }); L.push(''); }
  if (harnessFixes.length) { L.push('## Korrekturen am eigenen Prüfwerkzeug (während der Prüfung gefunden)', ''); harnessFixes.forEach(h => L.push(`- **${h.title}** – ${h.effect} Korrektur: ${h.fix}`)); L.push(''); }
  if (browser) { L.push('## Browser- und Geräteprüfungen', ''); (browser.summaryLines || []).forEach(l => L.push(l)); L.push(''); }
  L.push('## Gefundene Fehler', '');
  if (!bugs.length) L.push('- keine erfasst');
  else { L.push('| ID | Schwere | Status | Titel | Belege |', '|---|---|---|---|---|'); bugs.forEach(b => L.push(`| ${b.id} | ${b.severity} | ${b.status} | ${b.title} | ${(b.evidence || []).join(', ')} |`));
    const sev = {}; bugs.forEach(b => { const k = b.severity + '/' + b.status; sev[k] = (sev[k] || 0) + 1; }); L.push('', 'Nach Schweregrad/Status: ' + Object.entries(sev).map(([k, v]) => k + ' ' + v).join(', ')); }
  fs.writeFileSync(path.join(dir, 'REPORT.md'), L.join('\n') + '\n');
  console.log('Bericht:', path.join(dir, 'REPORT.md'));
})().catch(e => { console.error(e); process.exit(1); });
