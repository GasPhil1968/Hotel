// Kurzansicht eines Ergebnisordners: node qa/peek.js <dir> [nur-nicht-bestanden]
const L = require('fs').readFileSync(process.argv[2] + '/runs.jsonl', 'utf8').trim().split('\n').map(JSON.parse);
for (const r of L) { if (process.argv[3] && r.result === 'pass') continue;
  console.log(r.runId, r.result, 'K' + r.startCh, ((r.wallMs || 0) / 1000).toFixed(1) + 's', (r.chapters || []).map(c => c.ch + ':' + c.ok + (c.skips ? '/sk' + c.skips : '')).join(' '), '|', (r.reason || '').slice(0, 260));
  (r.perturb || []).forEach(p => console.log('    K' + p.ch + ' s' + p.step, p.skipped || '', p.mode || '', 'n=' + p.actions, 'ret=' + p.returned, p.equal !== undefined ? 'eq=' + p.equal : '', p.save || '', (p.diff || []).slice(0, 2).join(';'), JSON.stringify(p.anchor && [p.anchor.room, p.anchor.phase]), '->', JSON.stringify(p.end && [p.end.room, p.end.phase]), (p.rec || []).slice(-4).map(x => x.join(' ')).join(' | ').slice(0, 300)));
  if (r.result !== 'pass') (r.chapters || []).filter(c => !c.ok).forEach(c => console.log('    last:', (c.last || []).join(' // ').slice(0, 400))); }
